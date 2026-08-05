# 🛠️ 01_Containers

This section lists the required Docker containers for the DFIR automation pipeline and their respective documentation links.

---

## 📦 Pull Required Containers

```sh
log2timeline/plaso:latest
zeek/zeek:latest
mcr.microsoft.com/azuredataexplorer/kustainer-linux:latest
```

---

## 🔗 Container Documentation

- [Plaso (log2timeline) – Docker Hub](https://hub.docker.com/r/log2timeline/plaso)
- [Zeek (Network Security Monitor) – Docker Hub](https://hub.docker.com/r/zeek/zeek)
- [Azure Data Explorer Kusto emulator – Microsoft Learn](https://learn.microsoft.com/en-us/azure/data-explorer/kusto-emulator-overview)

Note: starting the Kusto emulator requires accepting Microsoft's Software
License Terms (`ACCEPT_EULA=Y`) — `deploy-kusto.sh` does this on your behalf
and says so. See [THIRD_PARTY_NOTICES.md](/THIRD_PARTY_NOTICES.md).

Ensure all necessary containers are installed and configured before running the DFIR pipeline. 🚀
