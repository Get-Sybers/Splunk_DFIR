"""Plaso browser/download evidence -> http, and lnk/recyclebin -> file (epic #86).

Fixtures mirror REAL M57 record shapes captured during the port.
"""
from get_sybers_dfir.car import normalize


def _wrap(record, ts="2009-11-20T19:13:29.625000Z"):
    return {"SourceImage": "jo.E01", "Timestamp": ts, "Parser": record.get("parser", "x"),
            "Record": record}


# ---- msiecf (IE index.dat) --------------------------------------------------

def test_ie_visit_maps_only_last_visited_and_strips_prefix():
    rec = {"data_type": "msiecf:url", "timestamp_desc": "Last Visited Time",
           "url": "Visited: Administrator@http://windowsupdate.microsoft.com/x",
           "number_of_hits": 2, "image_hostname": "M57-JO",
           "display_name": r"NTFS:\...\index.dat"}
    ev = normalize.normalize("l2t_msiecf", _wrap(rec))
    assert ev["car_object"] == "http" and ev["car_action"] == "get"
    assert ev["url_full"] == "http://windowsupdate.microsoft.com/x"
    assert ev["url_domain"] == "windowsupdate.microsoft.com"
    assert ev["hostname"] == "M57-JO"                 # endpoint = the vantage
    assert ev["_native"]["raw_url"].startswith("Visited:")
    # Expiration rows and url-less leak rows stay raw
    assert normalize.normalize("l2t_msiecf", _wrap(
        dict(rec, timestamp_desc="Expiration Time"))) is None
    assert normalize.normalize("l2t_msiecf", _wrap(
        {"data_type": "msiecf:leak", "timestamp_desc": "Not a time"})) is None


def test_ie_visit_non_http_target_yields_null_url_parts():
    rec = {"data_type": "msiecf:url", "timestamp_desc": "Last Visited Time",
           "url": "Visited: Administrator@about:Home", "image_hostname": "M57-JO"}
    ev = normalize.normalize("l2t_msiecf", _wrap(rec))
    assert ev["url_full"] == "about:Home"             # verbatim record
    assert ev["url_domain"] is None and ev["url_scheme"] is None  # honest nulls


# ---- firefox cache ----------------------------------------------------------

def test_firefox_cache_method_status_and_http_prefix():
    rec = {"data_type": "firefox:cache:record", "request_method": "GET",
           "response_code": "HTTP/1.1 200 OK", "fetch_count": 3,
           "url": "HTTP:http://windowsupdate.microsoft.com/",
           "image_hostname": "M57-JO"}
    ev = normalize.normalize("l2t_firefox_cache", _wrap(rec))
    assert ev["car_action"] == "get"
    assert ev["url_full"] == "http://windowsupdate.microsoft.com/"
    assert ev["response_status_code"] == 200
    # a method outside CAR's action set stays raw
    assert normalize.normalize("l2t_firefox_cache", _wrap(
        dict(rec, request_method="HEAD"))) is None


# ---- firefox places (sqlite table, gated by data_type) ----------------------

def test_firefox_page_visit_with_referrer():
    rec = {"data_type": "firefox:places:page_visited",
           "url": "http://windowsupdate.microsoft.com/",
           "from_visit": "http://www.microsoft.com/isapi/redir.dll?prd=Win2000 (www.microsoft.com)",
           "title": "Microsoft Windows Update", "visit_count": 2,
           "image_hostname": "M57-JO"}
    ev = normalize.normalize("l2t_firefox_places", _wrap(rec))
    assert ev["car_action"] == "get"
    assert ev["request_referrer"] == "http://www.microsoft.com/isapi/redir.dll?prd=Win2000"
    assert ev["_native"]["title"] == "Microsoft Windows Update"
    # other sqlite-plugin rows (bookmarks etc) stay raw
    assert normalize.normalize("l2t_firefox_places", _wrap(
        {"data_type": "firefox:places:bookmark_annotation", "url": "place:x"})) is None


# ---- java idx ---------------------------------------------------------------

def test_javaidx_download_with_server_ip_native():
    rec = {"data_type": "java:download:idx", "url": "http://dl.javafx.com/jogl.jar",
           "ip_address": "72.5.123.29", "idx_version": 603, "image_hostname": "M57-JO"}
    ev = normalize.normalize("l2t_javaidx", _wrap(rec))
    assert ev["car_action"] == "get" and ev["url_domain"] == "dl.javafx.com"
    assert ev["_native"]["ip_address"] == "72.5.123.29"   # CAR http has no dest_ip


# ---- lnk --------------------------------------------------------------------

def test_lnk_target_times_map_by_timestamp_desc():
    rec = {"data_type": "windows:lnk:link", "timestamp_desc": "Creation Time",
           "link_target": r"<My Computer> C:\Program Files\OO3\soffice.exe",
           "working_directory": r"C:\Program Files\OO3\\", "file_size": 0,
           "image_hostname": "M57-JO", "username": "-",
           "display_name": r"NTFS:\...\OpenOffice.org.lnk"}
    ev = normalize.normalize("l2t_lnk", _wrap(rec))
    assert ev["car_object"] == "file" and ev["car_action"] == "create"
    assert ev["file_path"] == r"C:\Program Files\OO3\soffice.exe"   # prefix stripped
    assert ev["file_name"] == "soffice.exe" and ev["extension"] == "exe"
    assert ev["_native"]["lnk_file"].endswith(".lnk")   # the artefact itself, native
    assert normalize.normalize("l2t_lnk", _wrap(
        dict(rec, timestamp_desc="Not a time"))) is None  # no CAR action -> raw


# ---- recycle bin ------------------------------------------------------------

def test_recyclebin_is_the_delete_event_with_original_path():
    rec = {"data_type": "windows:metadata:deleted_item",
           "timestamp_desc": "Content Deletion Time",
           "original_filename": r"C:\Documents and Settings\Jo\secret.xls",
           "file_size": 12288, "record_index": 1, "image_hostname": "M57-JO"}
    ev = normalize.normalize("l2t_recyclebin", _wrap(rec))
    assert ev["car_object"] == "file" and ev["car_action"] == "delete"
    assert ev["file_path"] == r"C:\Documents and Settings\Jo\secret.xls"
    assert ev["file_name"] == "secret.xls" and ev["extension"] == "xls"
