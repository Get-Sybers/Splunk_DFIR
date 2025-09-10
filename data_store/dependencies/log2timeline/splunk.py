# splunk.py — Plaso output module for Splunk HEC
# Place next to shared_splunk.py (helper funcs); ensure both are on PYTHONPATH for psort.

from __future__ import annotations
import json
import time
import traceback
from typing import Dict, Any, List

import requests

from plaso.output import interface
from plaso.output import manager
from plaso.lib import errors

ARGUMENTS_HELPER = "splunk"
# --- Defaults ---
_DEFAULT_ENDPOINT = "/services/collector/event"
_DEFAULT_TIMEOUT  = 30
_DEFAULT_BATCH    = 500    # tune for your env

class SplunkOutputModule(interface.OutputModule):
    """Send Plaso events to Splunk via HEC."""

    NAME = "splunk"
    DESCRIPTION = "Outputs events to Splunk HTTP Event Collector (HEC)."

    def __init__(self):
        super(SplunkOutputModule, self).__init__()
        self._server = None
        self._port = 8088
        self._token = None
        self._index = None
        self._sourcetype = "l2t:hec"
        self._source = "log2timeline"
        self._host = None
        self._verify_tls = True
        self._endpoint = _DEFAULT_ENDPOINT
        self._batch_size = _DEFAULT_BATCH
        self._session = None
        self._buffer: List[Dict[str, Any]] = []

    # ---- CLI flags ----
    @classmethod
    def AddArguments(cls, argument_group):
        """Add module-specific CLI flags to psort."""
        argument_group.add_argument("--server", dest="splunk_server",
                                    help="Splunk HEC server (hostname or IP).")
        argument_group.add_argument("--port", dest="splunk_port", type=int, default=8088,
                                    help="Splunk HEC port (default 8088).")
        argument_group.add_argument("--token", dest="splunk_token",
                                    help="Splunk HEC token.")
        argument_group.add_argument("--index", dest="splunk_index",
                                    help="Splunk index to write to (optional).")
        argument_group.add_argument("--sourcetype", dest="splunk_sourcetype", default="l2t:hec",
                                    help="HEC sourcetype (default l2t:hec).")
        argument_group.add_argument("--source", dest="splunk_source", default="log2timeline",
                                    help="HEC source (default log2timeline).")
        argument_group.add_argument("--host", dest="splunk_host",
                                    help="HEC host field (default: use psort --hostname or filename).")
        argument_group.add_argument("--endpoint", dest="splunk_endpoint", default=_DEFAULT_ENDPOINT,
                                    help="HEC path (/services/collector/event or /services/collector).")
        argument_group.add_argument("--batch-size", dest="splunk_batch", type=int, default=_DEFAULT_BATCH,
                                    help="Batch size before flushing to HEC (default 500).")
        argument_group.add_argument("--insecure", dest="splunk_insecure", action="store_true",
                                    help="Disable TLS verification.")
        # Optional: custom static fields
        argument_group.add_argument("--custom-fields", dest="splunk_custom_fields", default="",
                                    help='Extra HEC "fields" as key=value[,key=value].')

    def SetOutputOptions(self, options):
        """Receive parsed argparse options from psort."""
        self._server = getattr(options, "splunk_server", None)
        self._port = getattr(options, "splunk_port", 8088)
        self._token = getattr(options, "splunk_token", None)
        self._index = getattr(options, "splunk_index", None)
        self._sourcetype = getattr(options, "splunk_sourcetype", "l2t:hec")
        self._source = getattr(options, "splunk_source", "log2timeline")
        self._host = getattr(options, "splunk_host", None)
        self._endpoint = getattr(options, "splunk_endpoint", _DEFAULT_ENDPOINT)
        self._batch_size = int(getattr(options, "splunk_batch", _DEFAULT_BATCH) or _DEFAULT_BATCH)
        insecure = getattr(options, "splunk_insecure", False)
        self._verify_tls = not bool(insecure)

        # Parse custom fields (optional)
        self._custom_fields = {}
        kvs = getattr(options, "splunk_custom_fields", "") or ""
        for part in kvs.split(","):
            if "=" in part:
                k, v = part.split("=", 1)
                self._custom_fields[k.strip()] = v.strip()

    def _hec_url(self) -> str:
        scheme = "https" if self._verify_tls else "http"
        ep = self._endpoint or _DEFAULT_ENDPOINT
        if not ep.startswith("/"):
            ep = "/" + ep
        return f"{scheme}://{self._server}:{self._port}{ep}"

    # ---- plaso lifecycle ----
    def Open(self):
        """Open connections/resources."""
        if not self._server or not self._token:
            raise errors.BadConfigOption("Splunk HEC requires --server and --token.")
        self._session = requests.Session()
        self._session.headers.update({
            "Authorization": f"Splunk {self._token}",
            "Content-Type": "application/json"
        })

    def Close(self):
        """Flush remaining events and close resources."""
        try:
            if self._buffer:
                self._flush()
        finally:
            if self._session:
                self._session.close()
            self._session = None

    # ---- event writing ----
    def WriteEventBody(self, event, event_data, event_data_stream, event_tag):
        """Called by psort for each event. Buffer and flush in batches."""
        body = self._event_to_hec(event, event_data, event_data_stream, event_tag)
        self._buffer.append(body)
        if len(self._buffer) >= self._batch_size:
            self._flush()

    # ---- helpers ----
    def _event_to_hec(self, event, event_data, event_data_stream, event_tag) -> Dict[str, Any]:
        # Build HEC event envelope
        # See Splunk HEC JSON: fields you can set: time, host, source, sourcetype, index, event, fields
        # We'll keep 'time' optional to avoid clock skew unless you explicitly want it.
        hec: Dict[str, Any] = {
            "event": self._build_event_payload(event, event_data, event_data_stream, event_tag),
            "sourcetype": self._sourcetype,
            "source": self._source
        }
        if self._index:
            hec["index"] = self._index
        # Prefer explicit host if provided, else let Splunk auto-populate or use psort mediator hostname.
        if self._host:
            hec["host"] = self._host

        # Include custom fields if supplied
        if self._custom_fields:
            hec["fields"] = dict(self._custom_fields)

        # If you want to set event time, uncomment below (plaso timestamps are microseconds since epoch).
        # try:
        #     if getattr(event, "timestamp", None):
        #         hec["time"] = float(event.timestamp) / 1_000_000.0
        # except Exception:
        #     pass

        return hec

    def _build_event_payload(self, event, event_data, event_data_stream, event_tag) -> Dict[str, Any]:
        """Flatten plaso event structures into a Splunk-friendly dict."""
        payload = {}

        # Common plaso attributes:
        # event_data has parser/mixin specific attributes; event holds core timing, etc.
        # Use mediator helpers when you want formatted strings. Keep it raw-ish for Splunk.
        # Minimal example:
        timestamp = getattr(event, "timestamp", None)
        if timestamp is not None:
            payload["plaso_timestamp"] = int(timestamp)  # microseconds since epoch

        # Copy selected fields from event_data (avoid gigantic dumps; tune to your needs)
        for name, value in sorted(event_data.__dict__.items()):
            if name.startswith("_"):
                continue
            # make simple JSON serializable
            try:
                json.dumps(value)
                payload[name] = value
            except TypeError:
                payload[name] = str(value)

        # Tagging info (labels) if present
        if event_tag and getattr(event_tag, "labels", None):
            payload["labels"] = list(event_tag.labels)

        # Data stream info (pathspec, inode, etc.) can be large—add what you need:
        if event_data_stream:
            inode = getattr(event_data_stream, "inode", None)
            if inode is not None:
                payload["inode"] = inode

        return payload

    def _flush(self):
        """Send buffered events to HEC with simple retry/backoff."""
        url = self._hec_url()
        # HEC supports batched events as a JSON array envelope _when using /collector/event_?
        # Safer route: POST one JSON object per line (Newline-delimited JSON).
        # Splunk accepts an array of events too; to stay portable, send newline-delimited objects.
        body = "\n".join(json.dumps(evt, ensure_ascii=False) for evt in self._buffer).encode("utf-8")
        self._buffer.clear()

        for attempt in range(1, 5):
            try:
                resp = self._session.post(
                    url, data=body, timeout=_DEFAULT_TIMEOUT, verify=self._verify_tls
                )
                if resp.status_code == 200:
                    return
                # retry on 5xx
                if 500 <= resp.status_code < 600:
                    time.sleep(0.5 * attempt)
                    continue
                # non-retryable
                raise errors.PlugInError(
                    f"HEC HTTP {resp.status_code}: {resp.text[:300]}..."
                )
            except requests.RequestException as e:
                if attempt >= 4:
                    raise errors.PlugInError(f"HEC request failed: {e}") from e
                time.sleep(0.5 * attempt)

# Register with Plaso
manager.OutputManager.RegisterOutput(SplunkOutputModule)