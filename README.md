# 🚀 Splunk DFIR Pipeline
## 📚 Repo
- [1. Overview](#overview)
- [2. Get-Started](/get-started.md)
- [3. Dir-Structure](/dir-structure.md)
- [4. Project-Progress](/project-progress.md)
- [5. Docs](/docs/)

---

### 📚 This Page
- [Overview](#overview)
- [Current Status](#current-status)
- [Why This Exists](#why-this-exists)
- [The Problem - DeadBox Forensics](#the-problem---deadbox-forensics)
- [Get-Sybers Solution](#get-sybers-solution)
- [Benefits](#benefits)
- [Envisioned Endstate](#envisioned-endstate)
- [Notes](#notes)

---

## 🚀 Overview
<a name="overview"></a>

This repository automates the processing and ingestion of forensic data into **[Splunk](https://www.splunk.com/)** using tools such as **[Plaso (log2timeline)](https://github.com/log2timeline/plaso), [Zeek](https://zeek.org/)**, and mapping fields to the **[MITRE CAR Data Model](https://car.mitre.org/data_model/)**.

## 📌 Current Status
<a name="current-status"></a>

Currently in development, which means that the code and functionality are still evolving and have not yet reached full operational capacity. See [Project-Progress](/project-progress.md) for more.

## 🏴‍☠️ Why This Exists
<a name="why-this-exists"></a>

Most SOCs have already figured this problem out. Unfortunately, DeadBox forensics still has its place, but it doesn't need to remain outdated. Learning DFIR via DeadBox analysis is common and arguably a great starting point. Digital Forensics and Incident Response (DFIR) should be fast, efficient, and less tedious. This project automates messy tasks, lowering the barrier to entry and encouraging faster DFIR skill development by transforming forensic data into neatly mapped and standardized Splunk events.

## 🎯 The Problem - DeadBox Forensics
<a name="the-problem---deadbox-forensics"></a>

DFIR analysts juggle mountains of fragmented artifacts and data produced by various tools, leading to extensive manual parsing. This slows junior DFIR analyst skill development and risks overlooking crucial details precisely when speed and accuracy matter most.

## 🌟 Get-Sybers Solution
<a name="get-sybers-solution"></a>

Automate and clarify the DeadBox DFIR data pipeline by normalizing data fields consistent with the [MITRE CAR Data Model](https://car.mitre.org/data_model/).

## 🎁 Benefits
<a name="benefits"></a>

- **Less Pain, More Gain**: Automate tedious tasks, focusing your time on investigations.
- **Accuracy & Speed**: Consistent mappings and automated parsing reduce errors and accelerate response.
- **Ready to Roll**: Quick-deployment scripts get you operational swiftly.
- **Familiarity**: Simplify DFIR terminology: Artifact, Artifact Source, Field.

## 🛠️ Envisioned Endstate
<a name="envisioned-endstate"></a>

```spl
process=* action=create
| table dtg, hostname, user, command_line, artifact
```
| dtg                 | hostname       | user         | command_line                                             | artifact                 |
|---------------------|----------------|--------------|----------------------------------------------------------|--------------------------|
| 2025-01-01T10:14:29 | WKS-1          | analyst01    | `powershell.exe -nop -exec bypass Invoke-Mimikatz.ps1`   | Prefetch                 |
| 2025-01-01T11:05:52 | DC-1           | svc_backup   | `powershell.exe Get-ChildItem -Path \\server\share`     | WinEVTX:Security         |
| 2025-01-01T11:45:17 | WKS-2          | jdoe         | `powershell.exe -EncodedCommand JABzAD0AbgBlAHQAIAB1AH...`| Volatile:Get-Process     |

---

## 📌 Notes
<a name="notes"></a>

- Ensure your Docker environment is correctly set up before running scripts.
- Handle Splunk credentials and sensitive data securely.

🚀 **Happy hunting!**

