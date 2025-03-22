#!/usr/bin/env python3
import sys
import json
import datetime

FILETIME_EPOCH_DIFFERENCE = 11644473600  # seconds between Jan 1, 1601 and Jan 1, 1970

def convert_posix_time(ts):
    """
    Converts a Unix timestamp (integer) to a human-readable UTC string.
    For local time, use datetime.fromtimestamp(ts) instead.
    """
    try:
        dt = datetime.datetime.utcfromtimestamp(ts)
        return dt.strftime('%Y-%m-%d %H:%M:%S')
    except Exception as e:
        sys.stderr.write(f"Error converting PosixTime timestamp {ts}: {e}\n")
        return None

def convert_filetime(ts):
    """
    Converts a Windows Filetime (timestamp in 100-nanosecond intervals since Jan 1, 1601)
    to a human-readable UTC string.
    """
    try:
        unix_time = ts / 10000000 - FILETIME_EPOCH_DIFFERENCE
        dt = datetime.datetime.utcfromtimestamp(unix_time)
        return dt.strftime('%Y-%m-%d %H:%M:%S')
    except Exception as e:
        sys.stderr.write(f"Error converting Filetime timestamp {ts}: {e}\n")
        return None

def process_dict(d):
    """
    Recursively searches for dictionaries that have a "__class_name__" and "timestamp" key.
    When found, the timestamp is converted based on its type (PosixTime or Filetime)
    and a new field 'human_readable' is added.
    """
    if isinstance(d, dict):
        if "__class_name__" in d and "timestamp" in d:
            class_name = d["__class_name__"]
            ts = d["timestamp"]
            hr_time = None
            if class_name == "PosixTime":
                hr_time = convert_posix_time(ts)
            elif class_name == "Filetime":
                hr_time = convert_filetime(ts)
            if hr_time:
                d["human_readable"] = hr_time
        for key, value in d.items():
            if isinstance(value, dict):
                process_dict(value)
            elif isinstance(value, list):
                for item in value:
                    process_dict(item)
    return d

def search_for_human_readable(d):
    """
    Recursively searches for a dictionary with the key 'human_readable' and returns its value.
    """
    if isinstance(d, dict):
        if "human_readable" in d:
            return d["human_readable"]
        for key, value in d.items():
            result = search_for_human_readable(value)
            if result:
                return result
    elif isinstance(d, list):
        for item in d:
            result = search_for_human_readable(item)
            if result:
                return result
    return None

def main():
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            event = json.loads(line)
            # Recursively process the event to convert any timestamps
            event = process_dict(event)
            dtg_value = None
            # If a top-level date_time exists, check it first
            if "date_time" in event and isinstance(event["date_time"], dict):
                dtg_value = event["date_time"].get("human_readable")
            # Otherwise, search recursively for a converted timestamp
            if not dtg_value:
                dtg_value = search_for_human_readable(event)
            if dtg_value:
                event["DTG"] = dtg_value
            print(json.dumps(event))
        except Exception as e:
            sys.stderr.write(f"Error processing line: {line}\nError: {e}\n")
            continue

if __name__ == "__main__":
    main()