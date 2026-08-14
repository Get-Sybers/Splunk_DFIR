"""Volatility 3 plugin: targeted registry values for the CAR data model.

`dfir_registry.DfirRegistry` — instead of dumping whole hives, it reads only the
forensically-relevant keys (the same target list Eric Zimmerman's RECmd batch
uses on disk) out of the registry hives that are resident IN MEMORY, and emits
one row per value:

  Hive        the hive the value came from (…\\NTUSER.DAT, …\\SOFTWARE, …)
  Key         the full key path
  ValueName   value name ("" = the key's default value)
  ValueType   REG_SZ / REG_DWORD / REG_BINARY / …
  ValueData   the decoded value data (bytes are hex)
  LastWrite   the key's last write time

Every target is tried against every hive; get_key raises for hives that lack it,
so a key simply lands in whichever hive(s) actually hold it (HKLM\\SOFTWARE keys
in SOFTWARE, per-user keys in each NTUSER.DAT/UsrClass.dat). Override the list
with --targets "a\\b,c\\d" to match a specific RECmd batch.

Rendered by the jsonl_dfir renderer -> memory.VolatilityJson (Plugin =
"dfir_registry.DfirRegistry") -> CarRegistry reads Record.Key/ValueName/…
"""
from volatility3.framework import interfaces, renderers, exceptions
from volatility3.framework.configuration import requirements
from volatility3.framework.layers.registry import RegistryException
from volatility3.framework.symbols.windows.extensions.registry import RegValueTypes
from volatility3.plugins.windows.registry import hivelist, printkey


# RECmd-batch style target list: the high-value keys across the machine and user
# hives. HKLM\SOFTWARE / HKLM\SYSTEM keys use their in-hive path; NTUSER / UsrClass
# keys carry the "Software\" prefix. A target that a given hive lacks is skipped.
_DEFAULT_TARGETS = [
    # HKLM\SOFTWARE — autoruns, install, OS
    r"Microsoft\Windows\CurrentVersion\Run",
    r"Microsoft\Windows\CurrentVersion\RunOnce",
    r"Microsoft\Windows\CurrentVersion\RunServices",
    r"Microsoft\Windows\CurrentVersion\Explorer\Shell Folders",
    r"Microsoft\Windows\CurrentVersion\Uninstall",
    r"Microsoft\Windows NT\CurrentVersion\Winlogon",
    r"Microsoft\Windows NT\CurrentVersion\ProfileList",
    r"Microsoft\Windows NT\CurrentVersion\Image File Execution Options",
    # HKLM\SYSTEM — services, devices, config
    r"ControlSet001\Services",
    r"ControlSet001\Control\ComputerName\ComputerName",
    r"ControlSet001\Control\TimeZoneInformation",
    r"ControlSet001\Control\Session Manager\AppCompatibility\AppCompatCache",
    r"ControlSet001\Control\Session Manager\Memory Management",
    r"ControlSet001\Enum\USBSTOR",
    r"MountedDevices",
    # NTUSER.DAT / UsrClass.dat — per-user activity
    r"Software\Microsoft\Windows\CurrentVersion\Run",
    r"Software\Microsoft\Windows\CurrentVersion\RunOnce",
    r"Software\Microsoft\Windows\CurrentVersion\Explorer\RunMRU",
    r"Software\Microsoft\Windows\CurrentVersion\Explorer\TypedPaths",
    r"Software\Microsoft\Windows\CurrentVersion\Explorer\RecentDocs",
    r"Software\Microsoft\Windows\CurrentVersion\Explorer\UserAssist",
    r"Software\Microsoft\Windows\CurrentVersion\Explorer\ComDlg32\LastVisitedPidlMRU",
    r"Software\Microsoft\Windows\CurrentVersion\Explorer\ComDlg32\OpenSavePidlMRU",
]


class DfirRegistry(interfaces.plugins.PluginInterface):
    """Targeted (RECmd-list) registry values recovered from memory hives."""

    _required_framework_version = (2, 0, 0)
    _version = (1, 0, 0)

    @classmethod
    def get_requirements(cls):
        return [
            requirements.ModuleRequirement(
                name="kernel", description="Windows kernel",
                architectures=["Intel32", "Intel64"]),
            requirements.StringRequirement(
                name="targets", description="Comma-separated key paths to override the default list",
                optional=True, default=None),
        ]

    def _targets(self):
        raw = self.config.get("targets")
        if raw:
            return [t.strip() for t in raw.split(",") if t.strip()]
        return _DEFAULT_TARGETS

    def _generator(self):
        targets = self._targets()
        for hive in hivelist.HiveList.list_hives(
                self.context, self.config_path, self.config["kernel"]):
            try:
                hive_name = hive.get_name() or ""
            except (exceptions.InvalidAddressException, RegistryException):
                hive_name = ""
            for key in targets:
                try:
                    node_path = hive.get_key(key, return_list=True)
                except (KeyError, RegistryException, exceptions.InvalidAddressException):
                    continue
                if not node_path:
                    continue
                try:
                    walker = printkey.PrintKey.key_iterator(hive, node_path, recurse=True)
                except (RegistryException, exceptions.InvalidAddressException):
                    continue
                for depth, is_key, last_write, path, _volatile, node in walker:
                    if is_key:
                        continue  # values only
                    try:
                        value_name = node.get_name()
                    except Exception:  # pylint: disable=broad-except
                        value_name = ""
                    try:
                        value_type = RegValueTypes(node.Type).name
                    except Exception:  # pylint: disable=broad-except
                        value_type = ""
                    try:
                        data = node.decode_data()
                        # Decode by type the way RECmd/Registry Explorer present it:
                        # string types -> UTF-16LE text, numbers -> decimal, and
                        # everything else (REG_BINARY/REG_NONE/…) -> hex.
                        if isinstance(data, int):
                            value_data = str(data)
                        elif isinstance(data, bytes):
                            if value_type in ("REG_SZ", "REG_EXPAND_SZ", "REG_LINK"):
                                value_data = data.decode("utf-16-le", "replace").rstrip("\x00")
                            elif value_type == "REG_MULTI_SZ":
                                value_data = " ".join(
                                    s for s in data.decode("utf-16-le", "replace").split("\x00") if s)
                            else:
                                value_data = data.hex()
                        else:
                            value_data = str(data)
                        value_data = value_data[:2048]
                    except Exception:  # pylint: disable=broad-except
                        value_data = ""
                    yield (0, (
                        hive_name,
                        path,
                        value_name or renderers.NotAvailableValue(),
                        value_type or renderers.NotAvailableValue(),
                        value_data or renderers.NotAvailableValue(),
                        last_write if last_write is not None else renderers.NotAvailableValue(),
                    ))

    def run(self):
        import datetime
        return renderers.TreeGrid(
            [
                ("Hive", str),
                ("Key", str),
                ("ValueName", str),
                ("ValueType", str),
                ("ValueData", str),
                ("LastWrite", datetime.datetime),
            ],
            self._generator(),
        )
