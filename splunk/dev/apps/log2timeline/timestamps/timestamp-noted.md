index=host
| table date_time.__class_name__ date_time.__type__	date_time.time_zone_offset	date_time.timestamp	timestamp	timestamp_desc date_time.fat_date_time	date_time.string	date_time.system_time_tuple{}	date_time.time_elements_tuple{}
| dedup date_time.__class_name__ date_time.__type__ timestamp_desc


| Time Type     | Field to Use             | Action Required                        | Use for `_time`?                 |
|---------------|--------------------------|----------------------------------------|----------------------------------|
| `Filetime`    | `date_time.timestamp`    | Convert from FILETIME → Unix epoch     | ✅ Yes (with scripted transform) |
| `UUIDTime`    | `date_time.timestamp`    | Convert from UUID epoch → Unix epoch   | ✅ Yes (with scripted transform) |
| `FATDateTime` | `date_time.fat_date_time`| Decode FAT datetime structure          | 🟡 Yes (custom decode required)  |
| `NotSet`      | —                        | No usable timestamp                    | ❌ No                            |


# After digging deeper

| Format Name                  | Likely `__class_name__` or Data Source     | Epoch Base        | Unit         | SPL Conversion |
|-----------------------------|---------------------------------------------|-------------------|--------------|----------------|
| Unix Timestamp              | `PosixTime`                                 | 1970-01-01        | seconds      | `timestamp_val` |
| Unix Timestamp (µs)        | `PosixTimeInMicroseconds`                  | 1970-01-01        | microseconds | `timestamp_val / 1000000` |
| Time (ms since epoch)      | `TimeElementsInMilliseconds`               | 1970-01-01        | milliseconds | `timestamp_val / 1000` |
| Microsoft FILETIME         | `Filetime`                                  | 1601-01-01        | 100 ns       | `(timestamp_val / 10000000) - 11644473600` |
| UUIDTime                   | `UUIDTime`                                  | 1582-10-15        | 100 ns       | `(timestamp_val / 10000000) - 12219292800` |
| WebKit / Chrome            | `WebKitTime`                                | 2001-01-01        | microseconds | `(timestamp_val / 1000000) + 978307200` |
| Apple Core Data            | (unseen)                                    | 2001-01-01        | seconds      | `timestamp_val + 978307200` |
| HFS+ Timestamp             | (unseen)                                    | 1904-01-01        | seconds      | `timestamp_val + 2082844800` |
| Excel Timestamp            | (unseen)                                    | 1899-12-31        | days         | `timestamp_val * 86400 + offset` |
| Microsoft FAT DateTime     | `FATDateTime`                               | Derived manually  | 2-sec steps  | `bit unpack + strptime()` |
| Microsoft SYSTEMTIME       | `Systemtime`                                | N/A               | structured   | parse individual fields |
| ISO9660 Binary/Decimal     | (unseen)                                    | N/A               | structured   | parse manually |
| SemanticTime               | `SemanticTime`                              | N/A               | label-based  | not convertible |
| Not Set                    | `NotSet`                                    | N/A               | —            | `null()` |


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

---
# SPL to test logic

```
index=host sourcetype="l2t:*"

| eval class = 'date_time.__class_name__'

| eval timestamp_val = 'date_time.timestamp'
| eval filetime_epoch = if(class=="Filetime", (timestamp_val/10000000)-11644473600, null())
| eval uuid_epoch     = if(class=="UUIDTime", (timestamp_val/10000000)-12219292800, null())
| eval posix_epoch    = if(class=="PosixTime", timestamp_val, null())
| eval tems_epoch     = if(class=="TimeElementsInMilliseconds", timestamp_val/1000, null())

| eval fat_raw = 'date_time.fat_date_time'
| eval fat_date = floor(fat_raw / 65536)
| eval fat_time = fat_raw % 65536
| eval fat_year = floor(fat_date / 512) % 128 + 1980
| eval fat_month = floor(fat_date / 32) % 16
| eval fat_day = fat_date % 32
| eval fat_hour = floor(fat_time / 2048) % 32
| eval fat_minute = floor(fat_time / 32) % 64
| eval fat_second = (fat_time % 32) * 2

| eval fat_epoch = if(
    class=="FATDateTime",
    strptime(fat_year."-".printf("%02d", fat_month)."-".printf("%02d", fat_day)." ".
             printf("%02d", fat_hour).":".printf("%02d", fat_minute).":".printf("%02d", fat_second),
             "%Y-%m-%d %H:%M:%S"
    ),
    null()
)

| eval DTG = case(
    class=="Filetime", strftime(filetime_epoch, "%Y-%m-%d %H:%M:%S"),
    class=="UUIDTime", strftime(uuid_epoch, "%Y-%m-%d %H:%M:%S"),
    class=="PosixTime", strftime(posix_epoch, "%Y-%m-%d %H:%M:%S"),
    class=="TimeElementsInMilliseconds", strftime(tems_epoch, "%Y-%m-%d %H:%M:%S"),
    class=="FATDateTime", strftime(fat_epoch, "%Y-%m-%d %H:%M:%S"),
    class=="NotSet", "not set",
    true(), "unknown"
)

| table class, 'date_time.timestamp', filetime_epoch, uuid_epoch, posix_epoch, tems_epoch, 'date_time.fat_date_time', fat_epoch, DTG
| dedup class
```