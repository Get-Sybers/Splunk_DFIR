#!/usr/bin/env python3
import sys
import json
from datetime import datetime, timedelta

for line in sys.stdin:
    try:
        event = json.loads(line)
        ts_class = event.get("date_time.__class_name__", "")
        ts_raw = event.get("date_time.timestamp")

        if ts_raw is None:
            continue

        ts = int(ts_raw)
        if ts_class == "Filetime":
            dt = datetime(1601, 1, 1) + timedelta(microseconds=ts // 10)
        elif ts_class == "UUIDTime":
            dt = datetime(1582, 10, 15) + timedelta(microseconds=ts // 10)
        else:
            continue  # Skip NotSet or unsupported types

        event["_time"] = dt.strftime("%Y-%m-%d %H:%M:%S")
        print(json.dumps(event))

    except Exception:
        continue