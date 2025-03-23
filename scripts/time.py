#!/usr/bin/env python3
import sys
import json
from datetime import datetime

def calculate_epoch(event):
    class_name = event.get("date_time", {}).get("__class_name__")
    timestamp = event.get("date_time", {}).get("timestamp")
    fat_raw = event.get("date_time", {}).get("fat_date_time")
    epoch = None
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
            date_val = (fat_raw >> 16) & 0xFFFF
            time_val = fat_raw & 0xFFFF
            year = ((date_val >> 9) & 0x7F) + 1980
            month = (date_val >> 5) & 0x0F
            day = date_val & 0x1F
            hour = (time_val >> 11) & 0x1F
            minute = (time_val >> 5) & 0x3F
            second = (time_val & 0x1F) * 2
            dt = datetime(year, month, day, hour, minute, second)
            epoch = dt.timestamp()
    except Exception as e:
        sys.stderr.write(f"Error calculating epoch: {e}\n")
    return epoch

def main():
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            event = json.loads(line)
        except Exception as e:
            sys.stderr.write(f"Error parsing JSON: {e}\n")
            continue

        epoch = calculate_epoch(event)
        if epoch is not None:
            # Add the two key values:
            # DTG: epoch timestamp (numeric)
            event["DTG"] = epoch
            # DTG_ISO: ISO 8601 representation (for readability/searching)
            event["DTG_ISO"] = datetime.utcfromtimestamp(epoch).isoformat() + "Z"
        else:
            event["DTG"] = None
            event["DTG_ISO"] = None

        sys.stdout.write(json.dumps(event) + "\n")

if __name__ == "__main__":
    main()