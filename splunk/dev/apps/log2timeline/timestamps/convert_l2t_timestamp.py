#!/usr/bin/env python3
import sys
import json
from datetime import datetime, timedelta

def convert_timestamp(event):
    class_name = event.get("date_time.__class_name__")
    timestamp = event.get("date_time.timestamp")
    fat_raw = event.get("date_time.fat_date_time")

    try:
        if class_name == "Filetime" and timestamp:
            epoch = int(timestamp) / 10000000 - 11644473600
        elif class_name == "UUIDTime" and timestamp:
            epoch = int(timestamp) / 10000000 - 12219292800
        elif class_name == "PosixTime" and timestamp:
            epoch = int(timestamp)
        elif class_name == "PosixTimeInMicroseconds" and timestamp:
            epoch = int(timestamp) / 1000000
        elif class_name == "TimeElementsInMilliseconds" and timestamp:
            epoch = int(timestamp) / 1000
        elif class_name == "WebKitTime" and timestamp:
            epoch = int(timestamp) / 1000000 + 978307200
        elif class_name == "FATDateTime" and fat_raw:
            fat_raw = int(fat_raw)
            date = (fat_raw >> 16) & 0xFFFF
            time = fat_raw & 0xFFFF
            year = ((date >> 9) & 0x7F) + 1980
            month = (date >> 5) & 0x0F
            day = date & 0x1F
            hour = (time >> 11) & 0x1F
            minute = (time >> 5) & 0x3F
            second = (time & 0x1F) * 2
            dt = datetime(year, month, day, hour, minute, second)
            epoch = dt.timestamp()
        else:
            epoch = None

        if epoch is not None:
            event["_time"] = datetime.utcfromtimestamp(epoch).strftime("%Y-%m-%d %H:%M:%S")
    except Exception:
        pass

    return event

for line in sys.stdin:
    try:
        event = json.loads(line)
        event = convert_timestamp(event)
        print(json.dumps(event))
    except Exception:
        continue
