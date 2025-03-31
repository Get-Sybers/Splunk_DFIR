# 🗑️ Purge Splunk Container and Indexes

This document describes the functionality and operation of the provided shell script, designed to securely stop and remove the **Splunk Enterprise** Docker container and permanently delete all associated Splunk index data.

---

## ⚠️ Critical Warning

- Running this script will permanently **DELETE** all Splunk index data.
- This action **CANNOT** be undone.

---

## 🚨 Operation Steps

1. Confirms user intention explicitly before proceeding.
2. Stops and removes the specified Splunk Docker container (`splunk-enterprise`).
3. Permanently deletes all data within the Splunk index directory (`splunk/var`).
4. Provides clear feedback on each operation step, ensuring user awareness throughout the process.

---

**Important:**

- Always ensure critical data is backed up before executing this purge script.
- Only proceed when completely certain that data deletion is acceptable.

