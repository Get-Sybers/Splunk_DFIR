# 01_Containers

This section lists the required Docker containers for the DFIR automation pipeline and their respective documentation links.

---

## Pull Required Containers

```sh
log2timeline/plaso:latest                                    # Plaso timelining + image_export (dfVFS)
zeek/zeek:latest                                             # PCAP → Zeek JSON
sk4la/volatility3:latest                                     # memory (Volatility 3)
blacktop/yara:latest                                         # signatures — YARA
jasonish/suricata:latest                                     # signatures — Suricata
mcr.microsoft.com/azuredataexplorer/kustainer-linux:latest   # analysis backend (Kusto emulator)
```

`save-docker-images.sh` seeds only the three long-lived images for offline hosts —
`log2timeline/plaso`, `zeek/zeek` and the Kusto emulator. The `sk4la/volatility3`,
`blacktop/yara` and `jasonish/suricata` images are pulled on first use by the
memory/signature lanes (save/load them manually with `docker save`/`docker load`
if you need them offline too).

**Not containers:** **Hayabusa** ships as a self-contained Rust binary (no official
image) — operator-supplied: download the pinned release into
`data_store/dependencies/hayabusa/`. Disk-image file access uses host tools
(`ewf-tools`, `sleuthkit`, `ntfs-3g`) installed by `setup-environment.sh`.

---

## Container Documentation

- [Plaso (log2timeline) – Docker Hub](https://hub.docker.com/r/log2timeline/plaso)
- [Zeek (Network Security Monitor) – Docker Hub](https://hub.docker.com/r/zeek/zeek)
- [Volatility 3 (sk4la) – Docker Hub](https://hub.docker.com/r/sk4la/volatility3)
- [YARA (blacktop) – Docker Hub](https://hub.docker.com/r/blacktop/yara)
- [Suricata (jasonish) – Docker Hub](https://hub.docker.com/r/jasonish/suricata)
- [Hayabusa (Yamato Security) – GitHub](https://github.com/Yamato-Security/hayabusa)
- [Azure Data Explorer Kusto emulator – Microsoft Learn](https://learn.microsoft.com/en-us/azure/data-explorer/kusto-emulator-overview)

Note: starting the Kusto emulator requires accepting Microsoft's Software
License Terms (`ACCEPT_EULA=Y`) — the deploy (`dxdfir deploy`) does this on your behalf
and says so. See [THIRD_PARTY_NOTICES.md](/THIRD_PARTY_NOTICES.md).

Ensure all necessary containers are installed and configured before running the DFIR pipeline. 🚀
