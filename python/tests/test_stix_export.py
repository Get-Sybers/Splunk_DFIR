"""Unit tests for the STIX 2.1 export + OpenCTI exchange scaffold (no network)."""
import json
import uuid

import pytest
from typer.testing import CliRunner

from get_sybers_dfir import cli
from get_sybers_dfir.stix import config, export, hits, objects, opencti

NOW = "2026-09-02T10:00:00.000Z"
SCO_NS = uuid.UUID("00abedb4-aa42-466c-9c01-fed23315a9b7")

# One misc.Detections row exactly as `dxdfir detect --jsonl-out` writes it.
ENVELOPE = {
    "RunId": "20260902T090000Z-abcd1234", "DetectionId": "win-eventlog-cleared",
    "Title": "Windows event log cleared", "Severity": "high", "AttackIds": "T1070.001",
    "Source": "host.EvtxEcmdJson", "Timestamp": "2026-08-31T12:11:53.899000Z",
    "Entity": "PC1", "Details": {"EventId": 1102, "Channel": "Security", "Computer": "PC1"},
    "DetectedAt": "2026-09-02T09:00:01.000000Z",
}
# A signature-lane row: Details came back from Kusto as a JSON string, the
# entity is the "src -> dst:port" shape, AttackIds carries the ET Open form.
SURICATA = {
    "RunId": "20260902T090000Z-abcd1234", "DetectionId": "sig-suricata-alert",
    "Title": "Suricata IDS alert", "Severity": "medium", "AttackIds": "T1204,t1059_003",
    "Source": "signatures/suricata", "Timestamp": "2026-08-31 12:11:53.899 +00:00",
    "Entity": "10.0.0.5 -> 203.0.113.9:443",
    "Details": '{"Signature": "ET MALWARE beacon", "SignatureId": 2000001}',
    "DetectedAt": "2026-09-02T09:00:02.000000Z",
}
# A Byakugan tagged evidence line (query-stamped) with car-detections provenance.
STAMPED = {
    "@timestamp": "2026-08-31T12:00:00Z", "host": {"name": "PC2"},
    "event": {"id": "car-guid-123", "code": "7045"},
    "rule": {"id": "win-service-suspicious-path", "name": "Service installed from a suspicious path"},
    "threat": {"technique": {"id": ["T1543.003"], "name": ["Windows Service"]}},
    "detection": {"severity": "high", "run_id": "run-es-1", "detected_at": "2026-09-02T09:30:00Z",
                  "source_index": "logs-dfir.evtx-case17"},
    "file": {"name": "evil.exe", "hash": {"sha256": "a" * 64, "md5": "b" * 32}},
    "kibana": {"alert": {"uuid": "ignored-bookkeeping"}},
}


def _by_type(bundle, t):
    return [x for x in bundle["objects"] if x["type"] == t]


def _one(bundle, t):
    found = _by_type(bundle, t)
    assert len(found) == 1, f"expected one {t}, got {len(found)}"
    return found[0]


def _hit(doc):
    h = hits.hit_from_document(doc)
    assert h is not None
    return h


# ---- primitives ------------------------------------------------------------
def test_technique_ids_normalises_and_dedupes():
    assert objects.technique_ids("T1204,t1059_003 ¦ T1204") == ["T1204", "T1059.003"]
    assert objects.technique_ids(["attack.t1112", "TA0005", None]) == ["T1112"]
    assert objects.technique_ids(None) == [] and objects.technique_ids("") == []


def test_stix_timestamp_is_utc_millisecond_precision():
    ts = objects.stix_timestamp
    assert ts("2026-08-31T12:11:53.899000Z") == "2026-08-31T12:11:53.899Z"
    assert ts("2018-03-27 12:11:53.899 +00:00") == "2018-03-27T12:11:53.899Z"   # hayabusa
    assert ts("2011-06-18T18:17:15.107810+0000") == "2011-06-18T18:17:15.107Z"  # suricata
    assert ts("2020-01-02T03:04:05+02:00") == "2020-01-02T01:04:05.000Z"        # offset folded
    assert ts("2020-01-02T03:04:05") == "2020-01-02T03:04:05.000Z"              # naive = UTC
    assert ts(1735689600000) == "2025-01-01T00:00:00.000Z"                      # epoch ms
    assert ts(1735689600) == "2025-01-01T00:00:00.000Z"                         # epoch s
    assert ts(None) is None and ts("") is None and ts("not a time") is None


def test_sco_ids_follow_the_spec():
    # §2.9: uuid5 under the STIX SCO namespace over the canonical JSON of the
    # id-contributing properties — computed here independently of the package.
    ip = objects.ip_address("1.1.1.1")
    assert ip["type"] == "ipv4-addr" and ip["spec_version"] == "2.1"
    assert ip["id"] == "ipv4-addr--" + str(uuid.uuid5(SCO_NS, '{"value":"1.1.1.1"}'))
    assert objects.ip_address("2001:db8::1")["type"] == "ipv6-addr"
    assert objects.ip_address("PC1") is None                     # not an address: nothing invented
    # file: ONE hash contributes (MD5 preferred over SHA-256), plus the name
    f = objects.file_observable("evil.exe", {"SHA-256": "a" * 64, "MD5": "b" * 32})
    expect = '{"hashes":{"MD5":"' + "b" * 32 + '"},"name":"evil.exe"}'
    assert f["id"] == "file--" + str(uuid.uuid5(SCO_NS, expect))
    assert f["hashes"] == {"MD5": "b" * 32, "SHA-256": "a" * 64}   # all hashes still carried
    assert objects.file_observable(None, {}) is None


def test_relationship_requires_a_class():
    with pytest.raises(ValueError):
        objects.relationship("indicator--x", "attack-pattern--y", "indicates", NOW, "identity--p",
                             relationship_class="guessed")


# ---- hits -> objects -------------------------------------------------------
def test_envelope_hit_becomes_sighting_indicator_and_technique():
    bundle = export.build_bundle([_hit(ENVELOPE)], case_id="CASE-1", now=NOW)
    sighting, indicator = _one(bundle, "sighting"), _one(bundle, "indicator")
    pattern, producer_and_host = _one(bundle, "attack-pattern"), _by_type(bundle, "identity")
    assert sighting["spec_version"] == "2.1" and sighting["id"].startswith("sighting--")
    assert sighting["sighting_of_ref"] == indicator["id"]
    assert sighting["first_seen"] == sighting["last_seen"] == "2026-08-31T12:11:53.899Z"
    assert sighting["created"] == "2026-09-02T09:00:01.000Z"     # DetectedAt, ms precision
    assert sighting["count"] == 1
    assert sighting["x_dxdfir"]["detection_id"] == "win-eventlog-cleared"
    assert sighting["x_dxdfir"]["details"] == ENVELOPE["Details"]
    assert sighting["x_dxdfir"]["run_id"] == ENVELOPE["RunId"]
    # the indicator is the rule; with no rule body it carries a reference pattern
    assert indicator["name"] == "Windows event log cleared"
    assert indicator["pattern_type"] == "stix"
    assert "win-eventlog-cleared" in indicator["pattern"]
    assert indicator["valid_from"] == NOW and indicator["indicator_types"] == ["malicious-activity"]
    # the technique ref: attack-pattern with the mitre-attack external reference
    ref = pattern["external_references"][0]
    assert ref == {"source_name": "mitre-attack", "external_id": "T1070.001",
                   "url": "https://attack.mitre.org/techniques/T1070/001/"}
    rel = _one(bundle, "relationship")
    assert (rel["relationship_type"], rel["source_ref"], rel["target_ref"]) == \
        ("indicates", indicator["id"], pattern["id"])
    assert rel["labels"] == ["declared"]
    # Details.Computer -> the host identity that saw it; the producer created everything
    producer = next(i for i in producer_and_host if i["name"] == "DX_DFIR")
    host = next(i for i in producer_and_host if i["name"] == "PC1")
    assert host["identity_class"] == "system"
    assert sighting["where_sighted_refs"] == [host["id"]]
    assert all(x.get("created_by_ref") == producer["id"] for x in bundle["objects"]
               if x["type"] != "marking-definition" and x["id"] != producer["id"])
    # TLP amber by default, applied to everything but the marking itself
    marking = _one(bundle, "marking-definition")
    assert marking["id"] == objects.TLP_MARKING_IDS["amber"] and marking["definition"] == {"tlp": "amber"}
    assert all(marking["id"] in x["object_marking_refs"]
               for x in bundle["objects"] if x["type"] != "marking-definition")


def test_ids_are_global_for_content_and_case_scoped_for_observations():
    a = export.build_bundle([_hit(ENVELOPE)], case_id="CASE-A", now=NOW)
    b = export.build_bundle([_hit(ENVELOPE)], case_id="CASE-B", now=NOW)
    again = export.build_bundle([_hit(ENVELOPE)], case_id="CASE-A", now=NOW)
    for t in ("indicator", "attack-pattern", "relationship", "marking-definition"):
        assert _one(a, t)["id"] == _one(b, t)["id"]           # content-keyed: global
    assert {i["id"] for i in _by_type(a, "identity")} == {i["id"] for i in _by_type(b, "identity")}
    assert _one(a, "sighting")["id"] != _one(b, "sighting")["id"]   # observation: case-scoped
    assert a == again and a["id"] != b["id"]                          # idempotent per case


def test_arrow_entity_yields_address_scos_and_observed_data():
    h = _hit(SURICATA)
    assert (h.source_ip, h.destination_ip, h.destination_port) == ("10.0.0.5", "203.0.113.9", 443)
    assert h.details == {"Signature": "ET MALWARE beacon", "SignatureId": 2000001}   # string parsed
    assert h.attack_ids == ["T1204", "T1059.003"]
    assert h.timestamp == "2026-08-31T12:11:53.899Z"
    bundle = export.build_bundle([h], now=NOW)
    ips = _by_type(bundle, "ipv4-addr")
    assert {x["value"] for x in ips} == {"10.0.0.5", "203.0.113.9"}
    od = _one(bundle, "observed-data")
    assert set(od["object_refs"]) == {x["id"] for x in ips}
    assert od["first_observed"] == od["last_observed"] == h.timestamp and od["number_observed"] == 1
    assert _one(bundle, "sighting")["observed_data_refs"] == [od["id"]]
    assert len(_by_type(bundle, "attack-pattern")) == 2 == len(_by_type(bundle, "relationship"))
    # no case given: the run id scopes the observations
    assert _one(bundle, "sighting")["x_dxdfir"]["case_id"] == SURICATA["RunId"]


def test_entities_that_are_not_addresses_produce_no_observables():
    assert hits.arrow_endpoints("? -> 2.2.2.2:80") == (None, None, None)
    assert hits.arrow_endpoints("PC1: PSEXEC.EXE") == (None, None, None)
    bundle = export.build_bundle([_hit({**ENVELOPE, "Entity": "svchost.exe (pid 4)", "Details": {}})], now=NOW)
    assert not _by_type(bundle, "observed-data") and not _by_type(bundle, "ipv4-addr")
    assert "where_sighted_refs" not in _one(bundle, "sighting")


def test_identical_rows_collapse_into_one_sighting_with_count():
    bundle = export.build_bundle([_hit(ENVELOPE), _hit(ENVELOPE), _hit(SURICATA)], now=NOW)
    sightings = _by_type(bundle, "sighting")
    assert sorted(s["count"] for s in sightings) == [1, 2]
    assert len(_by_type(bundle, "indicator")) == 2


def test_elastic_stamped_line_is_read():
    h = _hit(STAMPED)
    assert h.detection_id == "win-service-suspicious-path"
    assert h.attack_ids == ["T1543.003"] and h.technique_names == {"T1543.003": "Windows Service"}
    assert (h.host, h.entity, h.severity, h.run_id) == ("PC2", "PC2", "high", "run-es-1")
    assert h.car_guid == "car-guid-123" and h.source == "logs-dfir.evtx-case17"
    assert h.file_name == "evil.exe" and h.file_hashes == {"MD5": "b" * 32, "SHA-256": "a" * 64}
    assert h.timestamp == "2026-08-31T12:00:00.000Z" and h.detected_at == "2026-09-02T09:30:00.000Z"
    assert "kibana.alert.uuid" not in h.details and h.details["event.code"] == "7045"
    bundle = export.build_bundle([h], case_id="CASE-17", now=NOW)
    assert _one(bundle, "file")["name"] == "evil.exe"
    assert _one(bundle, "sighting")["x_dxdfir"]["car_guid"] == "car-guid-123"
    assert _one(bundle, "attack-pattern")["name"] == "Windows Service"


def test_kibana_alert_threat_block_is_read():
    alert = {"kibana": {"alert": {
        "rule": {"rule_id": "win-defender-tamper", "name": "Defender tamper",
                 "threat": [{"framework": "MITRE ATT&CK",
                             "technique": [{"id": "T1562", "name": "Impair Defenses",
                                            "subtechnique": [{"id": "T1562.001", "name": "Disable Tools"}]}]}]},
        "severity": "medium", "original_time": "2026-08-31T12:00:00Z"}},
        "host.name": "PC3", "source.ip": "10.1.1.1", "destination.ip": "10.2.2.2", "destination.port": "445"}
    h = _hit(alert)
    assert h.detection_id == "win-defender-tamper" and h.title == "Defender tamper"
    assert h.attack_ids == ["T1562", "T1562.001"]
    assert h.technique_names["T1562.001"] == "Disable Tools"
    assert h.host == "PC3" and h.destination_port == 445 and h.severity == "medium"
    # a document that names no detection is not a hit — never guessed
    assert hits.hit_from_document({"event": {"id": "x"}, "host": {"name": "PC9"}}) is None
    assert hits.hit_from_document({"DetectionId": ""}) is None


def test_read_hits_accepts_jsonl_array_and_search_response(tmp_path):
    jsonl = tmp_path / "hits.jsonl"
    jsonl.write_text(json.dumps(ENVELOPE) + "\n\nnot json\n" + json.dumps(SURICATA) + "\n")
    found, report = hits.read_hits(str(jsonl))
    assert [h.detection_id for h in found] == ["win-eventlog-cleared", "sig-suricata-alert"]
    assert report["documents"] == 3 and report["hits"] == 2 and report["skipped"] == 1
    array = tmp_path / "hits.json"
    array.write_text(json.dumps([ENVELOPE, {"event": {"id": "context-row"}}]))
    found, report = hits.read_hits(str(array))
    assert len(found) == 1 and report["skipped"] == 1
    search = tmp_path / "search.json"
    search.write_text(json.dumps({"took": 1, "hits": {"total": {"value": 1}, "hits": [
        {"_index": "logs-dfir.evtx-case17", "_id": "abc", "_source": STAMPED}]}}))
    found, _ = hits.read_hits(str(search))
    assert len(found) == 1 and found[0].source == "logs-dfir.evtx-case17"
    bundle = tmp_path / "bundle.json"
    bundle.write_text(json.dumps({"type": "bundle", "id": "bundle--x", "objects": []}))
    with pytest.raises(ValueError):
        hits.read_hits(str(bundle))


# ---- the bundle ------------------------------------------------------------
def test_bundle_is_well_formed():
    bundle = export.build_bundle([_hit(ENVELOPE), _hit(SURICATA), _hit(STAMPED)], now=NOW)
    assert bundle["type"] == "bundle" and bundle["id"].startswith("bundle--")
    uuid.UUID(bundle["id"].split("--", 1)[1])
    ids = [x["id"] for x in bundle["objects"]]
    assert len(ids) == len(set(ids))
    assert all(x["spec_version"] == "2.1" for x in bundle["objects"])
    errors, warnings = export.validate_bundle(bundle)
    assert errors == [] and warnings == []            # every *_ref(s) resolves inside the bundle
    json.loads(json.dumps(bundle))                    # serialisable as-is
    assert export.bundle_id(bundle["objects"]) == bundle["id"]
    summary = export.summarise(bundle)
    assert summary["sightings"] == 3 and summary["indicators"] == 3
    assert summary["relationship_classes"] == {"declared": 4}


def test_validate_bundle_flags_defects():
    ok = export.build_bundle([_hit(ENVELOPE)], now=NOW)
    assert export.validate_bundle({"type": "report"})[0]
    dup = json.loads(json.dumps(ok))
    dup["objects"].append(dict(dup["objects"][-1]))
    assert any("duplicate id" in e for e in export.validate_bundle(dup)[0])
    bad = json.loads(json.dumps(ok))
    bad["objects"][0]["id"] = "indicator--" + bad["objects"][0]["id"].split("--", 1)[1]
    assert any("does not match type" in e for e in export.validate_bundle(bad)[0])
    dangling = json.loads(json.dumps(ok))
    next(x for x in dangling["objects"] if x["type"] == "sighting")["sighting_of_ref"] = \
        "indicator--00000000-0000-4000-8000-000000000000"
    errors, warnings = export.validate_bundle(dangling)
    assert errors == [] and any("not in bundle" in w for w in warnings)
    missing = json.loads(json.dumps(ok))
    del next(x for x in missing["objects"] if x["type"] == "indicator")["pattern"]
    assert any("missing pattern" in e for e in export.validate_bundle(missing)[0])


def test_piiat_bundle_passes_through_untouched(tmp_path):
    own = export.hit_objects([_hit(SURICATA)], now=NOW)
    shared_ip = objects.ip_address("10.0.0.5")                  # same spec id both sides derive
    newer_pattern = dict(own[objects.global_id("attack-pattern", "T1204")], modified="2027-01-01T00:00:00.000Z",
                         name="User Execution")
    piiat = {"type": "bundle", "id": "bundle--" + str(uuid.uuid4()), "objects": [
        shared_ip,
        {"type": "observed-data", "spec_version": "2.1", "id": "observed-data--" + str(uuid.uuid4()),
         "created": NOW, "modified": NOW, "first_observed": NOW, "last_observed": NOW,
         "number_observed": 1, "object_refs": [shared_ip["id"]]},
        {"type": "relationship", "spec_version": "2.1", "id": "relationship--" + str(uuid.uuid4()),
         "created": NOW, "modified": NOW, "relationship_type": "created-by",
         "source_ref": "process--" + str(uuid.uuid4()), "target_ref": "process--" + str(uuid.uuid4()),
         "labels": ["declared"]},
        {"type": "relationship", "spec_version": "2.1", "id": "relationship--" + str(uuid.uuid4()),
         "created": NOW, "modified": NOW, "relationship_type": "related-to",
         "source_ref": "file--" + str(uuid.uuid4()), "target_ref": "process--" + str(uuid.uuid4()),
         "labels": ["derived"], "x_piiat_inferred": True},
        newer_pattern,
        "not an object",
    ]}
    path = tmp_path / "piiat.json"
    path.write_text(json.dumps(piiat))
    bundle, report = export.assemble([_hit(SURICATA)], [export.load_bundle(str(path))], now=NOW)
    counts = report["merged"][0]
    assert (counts["added"], counts["kept"], counts["replaced"], counts["invalid"]) == (3, 1, 1, 1)
    assert sum(1 for x in bundle["objects"] if x["id"] == shared_ip["id"]) == 1
    assert next(x for x in bundle["objects"] if x["id"] == newer_pattern["id"])["name"] == "User Execution"
    # PIIAT's objects are neither re-marked nor re-keyed
    passed = next(x for x in bundle["objects"] if x.get("x_piiat_inferred"))
    assert "object_marking_refs" not in passed and passed["labels"] == ["derived"]
    assert export.summarise(bundle)["relationship_classes"] == {"declared": 3, "derived": 1}
    errors, warnings = export.validate_bundle(bundle)
    assert errors == [] and warnings                       # PIIAT refs held elsewhere: warned, not refused
    not_a_bundle = tmp_path / "hits.json"
    not_a_bundle.write_text("[]")
    with pytest.raises(ValueError):
        export.load_bundle(str(not_a_bundle))


def test_rules_dir_supplies_the_real_pattern(tmp_path):
    (tmp_path / "win-eventlog-cleared.yml").write_text(
        "id: win-eventlog-cleared\nlanguage: eql\nquery: |\n  any where event.code == \"1102\"\n")
    (tmp_path / "sig-suricata-alert.yml").write_text("id: sig-suricata-alert\nlanguage: esql\nquery: null\n")
    src = export.rules_pattern_source(str(tmp_path))
    bundle = export.build_bundle([_hit(ENVELOPE), _hit(SURICATA), _hit(STAMPED)], pattern_source=src, now=NOW)
    by_name = {i["x_dxdfir"]["detection_id"]: i for i in _by_type(bundle, "indicator")}
    assert by_name["win-eventlog-cleared"]["pattern"] == 'any where event.code == "1102"'
    assert by_name["win-eventlog-cleared"]["pattern_type"] == "eql"
    for stub_or_unknown in ("sig-suricata-alert", "win-service-suspicious-path"):
        assert by_name[stub_or_unknown]["pattern_type"] == "stix"
        assert stub_or_unknown in by_name[stub_or_unknown]["pattern"]


# ---- OpenCTI exchange (stubbed transport) -----------------------------------
class RecordingTransport:
    def __init__(self, status=200, text='{"data": {"stixBundlePush": true}}'):
        self.calls, self.status, self.text = [], status, text

    def post(self, url, headers, body, timeout):
        self.calls.append((url, dict(headers), body, timeout))
        return self.status, self.text


def test_opencti_client_posts_the_bundle_through_the_transport():
    bundle = export.build_bundle([_hit(ENVELOPE)], now=NOW)
    rec = RecordingTransport()
    client = opencti.OpenCTIClient("https://opencti.example.test/", "tok-123",
                                   connector_id="conn-1", transport=rec, timeout=7)
    result = client.push_bundle(bundle)
    assert result.ok and result.objects == len(bundle["objects"]) and result.status == 200
    url, headers, body, timeout = rec.calls[0]
    assert url == "https://opencti.example.test/graphql" and timeout == 7.0
    assert headers["Authorization"] == "Bearer tok-123" and headers["Content-Type"] == "application/json"
    payload = json.loads(body)
    assert "stixBundlePush" in payload["query"]
    assert payload["variables"]["connectorId"] == "conn-1"
    assert json.loads(payload["variables"]["bundle"]) == bundle
    assert "tok-123" not in payload["variables"]["bundle"]
    assert "tok-123" not in repr(client) and "tok-123" not in json.dumps(result.as_dict())


def test_opencti_client_reports_refusals_without_raising():
    bundle = export.build_bundle([_hit(ENVELOPE)], now=NOW)

    def push(status, text):
        client = opencti.OpenCTIClient("https://x.test", "t", transport=RecordingTransport(status, text))
        return client.push_bundle(bundle)
    assert not push(401, "").ok and "token" in push(401, "").message
    refused = push(200, '{"errors": [{"message": "Connector not registered"}]}')
    assert not refused.ok and "Connector not registered" in refused.message
    assert not push(500, "<html>boom</html>").ok
    down = push(0, "connection refused")
    assert not down.ok and "unreachable" in down.message
    # the deterministic default connector id is a plain uuid the platform can register once
    uuid.UUID(opencti.OpenCTIClient("https://x.test", "t", transport=RecordingTransport()).connector_id)


def test_opencti_client_refuses_to_start_without_endpoint_or_token():
    with pytest.raises(ValueError):
        opencti.OpenCTIClient(None, "t", transport=RecordingTransport())
    with pytest.raises(ValueError):
        opencti.OpenCTIClient("https://x.test", "", transport=RecordingTransport())


def test_opencti_client_refuses_non_https_endpoint():
    # the bearer token must never go over cleartext: http:// or a schemeless URL is refused
    for bad in ("http://opencti.test", "opencti.test/graphql"):
        with pytest.raises(ValueError):
            opencti.OpenCTIClient(bad, "t", transport=RecordingTransport())


# ---- config + the verb -----------------------------------------------------
def test_config_layers_file_env_and_overrides(tmp_path):
    f = tmp_path / "stix.json"
    f.write_text(json.dumps({"case": "FILE-CASE", "tlp": "GREEN", "push": "yes",
                             "opencti": {"url": "https://file.test", "token": "file-token"}}))
    env = {"DXDFIR_OPENCTI_URL": "https://env.test", "DXDFIR_OPENCTI_TOKEN": "env-token"}
    cfg = config.load_config(str(f), env=env, case_id="FLAG-CASE", out=None)
    assert (cfg.case_id, cfg.tlp, cfg.push) == ("FLAG-CASE", "green", True)
    assert (cfg.opencti_url, cfg.opencti_token) == ("https://env.test", "env-token")
    assert cfg.redacted()["opencti_token"] == "***" and "env-token" not in json.dumps(cfg.redacted())
    y = tmp_path / "stix.yml"
    y.write_text("out: bundle.json\nopencti:\n  connector_id: c-1\n")
    cfg = config.load_config(str(y), env={})
    assert (cfg.out, cfg.opencti_connector_id, cfg.push, cfg.tlp) == ("bundle.json", "c-1", False, "amber")
    assert config.load_config(env={}).opencti_token is None


def test_run_export_writes_and_pushes(tmp_path):
    jsonl = tmp_path / "hits.jsonl"
    jsonl.write_text(json.dumps(ENVELOPE) + "\n" + json.dumps(SURICATA) + "\n")
    out = tmp_path / "exchange" / "bundle.json"
    rec = RecordingTransport()
    cfg = config.StixConfig(case_id="CASE-9", out=str(out), push=True,
                            opencti_url="https://x.test", opencti_token="t")
    summary, bundle = export.run_export(cfg, [str(jsonl)], transport=rec, now=NOW)
    assert summary["ok"] and summary["push"]["ok"] and len(rec.calls) == 1
    assert json.loads(out.read_text()) == bundle
    assert summary["summary"]["sightings"] == 2 and summary["validation"]["errors"] == []
    assert summary["config"]["opencti_token"] == "***"
    # no push configured: the transport is never touched; no inputs: refused
    class Explode:
        def post(self, *a):
            raise AssertionError("must not be called")
    summary, _ = export.run_export(config.StixConfig(out=str(out)), [str(jsonl)], transport=Explode(), now=NOW)
    assert summary["ok"] and summary["push"] is None
    with pytest.raises(ValueError):
        export.run_export(config.StixConfig(), [], transport=Explode())


def test_cli_stix_export(tmp_path, monkeypatch):
    runner = CliRunner()
    jsonl = tmp_path / "hits.jsonl"
    jsonl.write_text(json.dumps(ENVELOPE) + "\n")
    out = tmp_path / "bundle.json"
    r = runner.invoke(cli.app, ["stix", "export", "--hits", str(jsonl), "--out", str(out),
                                "--case", "CASE-7", "--tlp", "green"])
    assert r.exit_code == 0, r.output
    bundle = json.loads(out.read_text())
    assert export.validate_bundle(bundle) == ([], [])
    assert _one(bundle, "marking-definition")["name"] == "TLP:GREEN"
    summary = json.loads(r.stdout)
    assert summary["summary"]["sightings"] == 1 and summary["bundle"] == str(out)
    # --push takes endpoint/token from the environment and goes through the transport
    rec = RecordingTransport()
    monkeypatch.setattr(opencti, "UrllibTransport", lambda: rec)
    monkeypatch.setenv("DXDFIR_OPENCTI_URL", "https://env.test")
    monkeypatch.setenv("DXDFIR_OPENCTI_TOKEN", "env-token")
    r = runner.invoke(cli.app, ["stix", "export", "--hits", str(jsonl), "--out", str(out), "--push"])
    assert r.exit_code == 0, r.output
    assert rec.calls[0][0] == "https://env.test/graphql"
    assert rec.calls[0][1]["Authorization"] == "Bearer env-token"
    # a refused push is exit 1; --push without a token is exit 2; no inputs is exit 2
    monkeypatch.setattr(opencti, "UrllibTransport", lambda: RecordingTransport(403, ""))
    assert runner.invoke(cli.app, ["stix", "export", "--hits", str(jsonl), "--push"]).exit_code == 1
    monkeypatch.delenv("DXDFIR_OPENCTI_TOKEN")
    assert runner.invoke(cli.app, ["stix", "export", "--hits", str(jsonl), "--push"]).exit_code == 2
    assert runner.invoke(cli.app, ["stix", "export"]).exit_code == 2
