index=host
| table date_time.__class_name__ date_time.__type__	date_time.time_zone_offset	date_time.timestamp	timestamp	timestamp_desc date_time.fat_date_time	date_time.string	date_time.system_time_tuple{}	date_time.time_elements_tuple{}
| dedup date_time.__class_name__ date_time.__type__ timestamp_desc

| Time Type     | Field to Use             | Action Required                        | Use for `_time`?                 |
|---------------|--------------------------|-----------------------------------------|----------------------------------|
| `Filetime`    | `date_time.timestamp`    | Convert from FILETIME → Unix epoch     | ✅ Yes (with scripted transform) |
| `UUIDTime`    | `date_time.timestamp`    | Convert from UUID epoch → Unix epoch   | ✅ Yes (with scripted transform) |
| `FATDateTime` | `date_time.fat_date_time`| Decode FAT datetime structure          | 🟡 Yes (custom decode required)  |
| `NotSet`      | —                        | No usable timestamp                    | ❌ No                            |



# Timestamp Conversion to Unix Epoch (for Splunk)

This section describes how to convert various timestamp formats found in log2timeline's `date_time` object to Unix epoch time.

---

## ✅ FILETIME

- **Field:** `date_time.timestamp`
- **Description:** 100-nanosecond intervals since **1601-01-01 00:00:00 UTC**
- **Conversion Formula (Python):**

```python
unix_epoch = (filetime_value / 10_000_000) - 11644473600
```

- **Explanation:**
  - Divide by 10,000,000 to convert 100ns intervals → seconds
  - Subtract `11644473600` seconds (difference between FILETIME and Unix epoch)

---

## ✅ UUIDTime

- **Field:** `date_time.timestamp`
- **Description:** 100-nanosecond intervals since **1582-10-15 00:00:00 UTC** (used in UUIDv1)
- **Conversion Formula (Python):**

```python
unix_epoch = (uuid_time_value / 10_000_000) - 12219292800
```

- **Explanation:**
  - Divide by 10,000,000 to convert 100ns intervals → seconds
  - Subtract `12219292800` seconds (difference between UUID epoch and Unix epoch)

---

## 🟡 FATDateTime

- **Field:** `date_time.fat_date_time`
- **Description:** 32-bit packed MS-DOS date and time format
- **Conversion Logic (Python):**

```python
# Assume fat_dt is a 32-bit integer
date = (fat_dt >> 16) & 0xFFFF
time = fat_dt & 0xFFFF

year = ((date >> 9) & 0x7F) + 1980
month = (date >> 5) & 0x0F
day = date & 0x1F

hour = (time >> 11) & 0x1F
minute = (time >> 5) & 0x3F
second = (time & 0x1F) * 2  # FAT stores seconds divided by 2

from datetime import datetime
dt = datetime(year, month, day, hour, minute, second)
unix_epoch = dt.timestamp()
```

- **Explanation:**
  - Date and time are packed into a 32-bit structure
  - Seconds are stored in 2-second increments
  - You unpack the bits and reassemble into a datetime object

---

## ❌ NotSet

- **Field:** N/A
- **Description:** No usable timestamp present
- **Action:** Skip or flag for further investigation

---

## ✅ Final Notes

- All numeric values must be cast to integers before performing math
- Handle time zone offsets if needed based on your ingestion source
- These conversions are best done via scripted transforms if `_time` must be set at index time
