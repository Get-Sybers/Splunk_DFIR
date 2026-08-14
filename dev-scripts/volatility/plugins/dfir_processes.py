"""Volatility 3 plugin: DFIR process records for the CAR data model.

`dfir_processes.DfirProcesses` — one row per process, enumerated with psscan
(pool-tag scanning) so UNLINKED / terminated processes a rootkit hid from the
active list are still found. Each row carries what CarProcess wants and no single
built-in plugin gives together:

  PID, PPID
  ImageFileName   the EPROCESS short name (<= 15 chars)
  Path            the FULL image path from the PEB (ProcessParameters.ImagePathName)
  CommandLine     from the PEB
  ParentPath      the parent's full image path, resolved by PID
  CreateTime      process creation time
  DllCount        number of loaded modules
  LoadedDlls      the loaded modules' full paths (PEB load-order list)
  Hidden          true if psscan found it but the active list (pslist) did not
                  — i.e. an unlinked process, the reason to use psscan

A psscan process is found in the PHYSICAL layer, so `EPROCESS.get_peb()` /
`load_order_modules()` (which build the process layer off `self.vol.layer_name`)
raise "not a translation layer". An unlinked process is still RUNNING, so its PEB
is in memory: this plugin rebuilds the process address space from the DTB using
the KERNEL's Intel layer as the template, so the PEB, command line and loaded
DLLs resolve for unlinked processes too. Truly dead processes (invalid DTB) get
empty fields but are still listed and flagged.

Rendered by the jsonl_dfir renderer -> memory.VolatilityJson (Plugin =
"dfir_processes.DfirProcesses") -> CarProcess reads Record.Path/ParentPath/etc.
"""
import datetime

from volatility3.framework import constants, exceptions, interfaces, renderers
from volatility3.framework.configuration import requirements
from volatility3.framework.layers import intel
from volatility3.framework.objects import utility
from volatility3.plugins.windows import pslist, psscan


class DfirProcesses(interfaces.plugins.PluginInterface):
    """Process records (psscan) with full image path, parent path and loaded DLLs."""

    _required_framework_version = (2, 0, 0)
    _version = (1, 0, 0)

    @classmethod
    def get_requirements(cls):
        return [
            requirements.ModuleRequirement(
                name="kernel", description="Windows kernel",
                architectures=["Intel32", "Intel64"]),
        ]

    def _process_layer(self, proc, kernel_layer):
        """Build the process's virtual address space from its DTB, using the
        kernel Intel layer as the template — so a psscan (physical) process's PEB
        is reachable. Returns the new layer name, or None if the DTB is unusable.
        """
        try:
            dtb = proc.Pcb.DirectoryTableBase
            if hasattr(dtb, "cast"):
                dtb = dtb.cast("unsigned long long")
            dtb = int(dtb) & ((1 << kernel_layer.bits_per_register) - 1)
            if not dtb:
                return None
            config = kernel_layer.build_configuration()
            # build_configuration() omits the base-layer reference; the Intel
            # layer __init__ requires it, so copy it from the kernel layer (this
            # is what EPROCESS._add_process_layer does), then point at the DTB.
            config["memory_layer"] = kernel_layer.config["memory_layer"]
            config["page_map_offset"] = dtb
            name = self.context.layers.free_layer_name(prefix="dfir_proc")
            path = interfaces.configuration.path_join("temporary", name)
            self.context.config.splice(path, config)
            self.context.layers.add_layer(
                kernel_layer.__class__(self.context, config_path=path, name=name))
            return name
        except Exception:  # pylint: disable=broad-except
            return None

    def _enrich(self, proc, kernel_layer):
        """(full image path, command line, [loaded dll paths]) via the rebuilt
        process layer; empty where a field / the whole PEB is unreachable."""
        image_path = command_line = ""
        dlls = []
        layer_name = self._process_layer(proc, kernel_layer)
        if layer_name is None:
            return image_path, command_line, dlls
        try:
            sym_table = proc.get_symbol_table_name()
            peb = self.context.object(
                sym_table + constants.BANG + "_PEB",
                layer_name=layer_name, offset=proc.Peb)
            params = peb.ProcessParameters
            try:
                image_path = params.ImagePathName.get_string()
            except Exception:  # pylint: disable=broad-except
                pass
            try:
                command_line = params.CommandLine.get_string()
            except Exception:  # pylint: disable=broad-except
                pass
            try:
                for entry in peb.Ldr.InLoadOrderModuleList.to_list(
                        sym_table + constants.BANG + "_LDR_DATA_TABLE_ENTRY",
                        "InLoadOrderLinks"):
                    try:
                        name = entry.FullDllName.get_string()
                        if name:
                            dlls.append(name)
                    except Exception:  # pylint: disable=broad-except
                        continue
            except Exception:  # pylint: disable=broad-except
                pass
        except Exception:  # pylint: disable=broad-except
            pass
        return image_path, command_line, dlls

    def _generator(self):
        kernel = self.context.modules[self.config["kernel"]]
        kernel_layer = self.context.layers[kernel.layer_name]
        if not isinstance(kernel_layer, intel.Intel):
            return

        # Active (linked) PIDs, so psscan-only processes can be flagged Hidden.
        linked = set()
        try:
            for proc in pslist.PsList.list_processes(self.context, self.config["kernel"]):
                try:
                    linked.add(int(proc.UniqueProcessId))
                except exceptions.InvalidAddressException:
                    continue
        except Exception:  # pylint: disable=broad-except
            pass

        # Pass one: pool-scan every process, enrich, record path by pid.
        records = []
        path_by_pid = {}
        for proc in psscan.PsScan.scan_processes(self.context, self.config["kernel"]):
            try:
                pid = int(proc.UniqueProcessId)
                ppid = int(proc.InheritedFromUniqueProcessId)
                name = utility.array_to_string(proc.ImageFileName)
            except exceptions.InvalidAddressException:
                continue
            image_path, command_line, dlls = self._enrich(proc, kernel_layer)
            try:
                create_time = proc.get_create_time()
            except Exception:  # pylint: disable=broad-except
                create_time = None
            if image_path:
                path_by_pid[pid] = image_path
            records.append((pid, ppid, name, image_path, command_line,
                            create_time, dlls))

        # Pass two: fill ParentPath from the pid->path map and emit.
        for pid, ppid, name, image_path, command_line, create_time, dlls in records:
            na = renderers.NotAvailableValue
            yield (0, (
                pid, ppid, name,
                image_path or na(),
                command_line or na(),
                path_by_pid.get(ppid) or na(),
                create_time if create_time is not None else na(),
                len(dlls),
                ", ".join(dlls) if dlls else na(),
                pid not in linked,
            ))

    def run(self):
        return renderers.TreeGrid(
            [
                ("PID", int),
                ("PPID", int),
                ("ImageFileName", str),
                ("Path", str),
                ("CommandLine", str),
                ("ParentPath", str),
                ("CreateTime", datetime.datetime),
                ("DllCount", int),
                ("LoadedDlls", str),
                ("Hidden", bool),
            ],
            self._generator(),
        )
