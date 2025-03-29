# Steps to create a search-time DTG field in Splunk Web
	1.	Go to Settings > Fields > Calculated Fields
	2.	Click “Add new”
	3.	Fill in:
	•	Destination App: your app, e.g., Splunk_TA_log2timeline
	•	Name: DTG
	•	Sourcetype: l2t:olecf (or whatever applies)
	•	Eval Expression:

    `strftime(tonumber(timestamp), "%Y-%m-%d %H:%M:%S.%6N")`

# Manually in Props
[sourcetype]
EVAL:DTG = strftime(tonumber(timestamp), "%Y-%m-%d %H:%M:%S.%6N")


# Understanding `strftime()` in Splunk

In Splunk, `strftime()` is used to convert a **numeric epoch timestamp** into a **human-readable datetime string**.

---

## ✅ What `strftime()` Expects

`strftime()` only works with **numeric epoch-style values**, such as:

| Input                              | Valid? | Notes                                         |
|-----------------------------------|--------|-----------------------------------------------|
| `1701000000`                      | ✅     | Unix epoch time in seconds                    |
| `1701000000.123456`               | ✅     | Epoch time with microsecond precision         |
| `"2025-03-22 10:00:00"` (string)  | ❌     | Not supported — use `strptime()` first        |
| `"138322947954255456"` (FILETIME) | ❌     | Must be converted to epoch first              |

---
