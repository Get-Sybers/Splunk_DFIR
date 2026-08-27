"""DFIR JSON line output module for Plaso.

A drop-in psort output module (`-o l2t_json_dfir`) that emits the same rich,
per-parser json_line as the built-in `json_line`, but adds four attribution
fields resolved FROM THE .plaso DB — so the output is self-describing and no
second pass over the logs is needed:

  image_hostname  the host the image belongs to, from preprocessing
                  (system_configuration: registry ComputerName / /etc/hostname).
                  Consistent on EVERY event — unlike the per-event `hostname`,
                  which for a utmp/ssh event is the login *source*, not the box.
  username        the event's user, resolved via the output mediator (honours
                  --output_fallback_hostname's user-account resolution).
  disk_id         the source disk/image, from the event path spec's OS layer.
  volume_id       the partition/volume the event came from, from the path spec's
                  partition layer (e.g. /p2) — distinguishes multi-partition disks.
  volume_offset   that partition's byte start offset — a stable numeric id for
                  the volume within the disk. (A true NTFS volume serial / GPT
                  GUID / disk signature is NOT in Plaso's stored path spec, so it
                  is not emitted here; recovering it would mean re-reading the
                  partition table / filesystem superblock via dfVFS.)

Copy this file into the container and run, e.g.:

  psort.py -o l2t_json_dfir --output_fallback_hostname -w out.jsonl storage.plaso

(loaded via a small import wrapper; see the plaso lane).

Upstreaming: the hostname/username half of this is proposed to Plaso itself so
the built-in JSON output resolves them like the dynamic output already does.
"""
import os

from plaso.output import json_line
from plaso.output import manager


class DFIRJSONLineOutputModule(json_line.JSONLineOutputModule):
    """JSON line output enriched with image hostname / disk / volume ids."""

    NAME = "l2t_json_dfir"
    DESCRIPTION = "JSON line enriched with image hostname, username, disk and volume ids."

    # Partition/volume path-spec layers, innermost-meaningful first.
    _VOLUME_TYPE_INDICATORS = frozenset((
        "TSK_PARTITION", "GPT", "APFS_CONTAINER", "LVM", "VSHADOW", "BDE"))

    def __init__(self):
        """Initializes the output module."""
        super().__init__()
        self._image_hostname = None   # resolved once; constant for one .plaso

    def _ResolveImageHostname(self, output_mediator):
        """The box's own hostname from preprocessing, or '' if unresolved."""
        try:
            reader = output_mediator._storage_reader  # pylint: disable=protected-access
            for configuration in reader.GetAttributeContainers("system_configuration"):
                hostname = getattr(configuration, "hostname", None)
                name = getattr(hostname, "name", None)
                if name:
                    return name
        except (AttributeError, IOError, OSError):
            pass
        return ""

    def _DiskAndVolume(self, path_spec):
        """Walks a path spec to its disk (OS layer) and volume (partition)."""
        disk_id = volume_id = ""
        volume_offset = None
        current = path_spec
        while current is not None:
            type_indicator = getattr(current, "type_indicator", "")
            location = getattr(current, "location", "") or ""
            if type_indicator in self._VOLUME_TYPE_INDICATORS and location and not volume_id:
                volume_id = location
                start_offset = getattr(current, "start_offset", None)
                if start_offset is not None:
                    volume_offset = start_offset
            if type_indicator == "OS" and location:
                disk_id = os.path.basename(location.rstrip("/")) or location
            current = getattr(current, "parent", None)
        return disk_id, volume_id, volume_offset

    def GetFieldValues(
        self, output_mediator, event, event_data, event_data_stream, event_tag):
        """Adds the DFIR attribution fields to the standard JSON field values."""
        field_values = super().GetFieldValues(
            output_mediator, event, event_data, event_data_stream, event_tag)

        if self._image_hostname is None:
            self._image_hostname = self._ResolveImageHostname(output_mediator)
        field_values["image_hostname"] = self._image_hostname
        field_values["username"] = output_mediator.GetUsername(event_data)

        disk_id = volume_id = ""
        volume_offset = None
        if event_data_stream is not None:
            path_spec = getattr(event_data_stream, "path_spec", None)
            if path_spec is not None:
                disk_id, volume_id, volume_offset = self._DiskAndVolume(path_spec)
        field_values["disk_id"] = disk_id
        field_values["volume_id"] = volume_id
        field_values["volume_offset"] = volume_offset

        return field_values


manager.OutputManager.RegisterOutput(DFIRJSONLineOutputModule)
