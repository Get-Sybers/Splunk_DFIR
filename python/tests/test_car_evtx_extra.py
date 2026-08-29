"""BITS -> http and TerminalServices -> user_session grabs (epic #86)."""
import json
from get_sybers_dfir.car import normalize


def _bits(**o):
    data = [{"@Name": k, "#text": v} for k, v in {
        "transferId": "c411", "name": "Font Download",
        "url": "https://fs.microsoft.com/fs/windows/config.json",
        "bytesTotal": "55", "bytesTransferred": "55"}.items()]
    rec = {"EventId": 59, "Channel": "Microsoft-Windows-Bits-Client/Operational",
           "Computer": "WIN-1M3263ACE5D", "EventRecordId": 3,
           "TimeCreated": "2018-03-27T12:11:42+00:00",
           "Payload": json.dumps({"EventData": {"Data": data}})}
    rec.update(o); return rec


def _ts(eid=21, address="LOCAL"):
    return {"EventId": eid,
            "Channel": "Microsoft-Windows-TerminalServices-LocalSessionManager/Operational",
            "Computer": "WIN-1M3263ACE5D", "EventRecordId": 7,
            "TimeCreated": "2018-03-27T12:11:42+00:00",
            "Payload": json.dumps({"UserData": {"EventXML": {
                "User": r"DESKTOP-PM6C56D\defaultuser0", "SessionID": "1",
                "Address": address}}})}


def test_bits_is_http_get_with_url():
    ev = normalize.normalize("evtx_bits", _bits())
    assert ev["car_object"] == "http" and ev["car_action"] == "get"
    assert ev["url_full"] == "https://fs.microsoft.com/fs/windows/config.json"
    assert ev["url_domain"] == "fs.microsoft.com" and ev["url_scheme"] == "https"
    assert ev["url_remainder"] == "/fs/windows/config.json"
    assert ev["hostname"] == "WIN-1M3263ACE5D"        # the endpoint = http vantage
    assert ev["_native"]["name"] == "Font Download"


def test_ts_session_userdata_and_local_is_null_ip():
    ev = normalize.normalize("evtx_rdp", _ts(21, "LOCAL"))
    assert ev["car_object"] == "user_session" and ev["car_action"] == "login"
    assert ev["user"] == r"DESKTOP-PM6C56D\defaultuser0"
    assert ev["src_ip"] is None                        # LOCAL console != an IP
    assert ev["_native"]["SessionID"] == "1"
    assert normalize.normalize("evtx_rdp", _ts(24))["car_action"] == "logout"
    rdp = normalize.normalize("evtx_rdp", _ts(21, "10.0.0.9"))
    assert rdp["src_ip"] == "10.0.0.9"                 # a real remote source
