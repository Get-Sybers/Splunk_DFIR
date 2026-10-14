# dxdfir_evidence

Shared **evidence discovery** for the DX_DFIR pipeline. The disk-image `find` +
regex + `{tree, rel, name}` construction used to be copy-pasted across
`godfir_gowindowlicker`, `godfir_godaemonhunter` and `dxdfir_export`; it lives
here once now. Discovery stays in DX_DFIR (the consumer); the per-tool roles feed
its results to the `get_sybers.godfir_run` lanes.

It registers three facts:

- **`dxdfir_evidence_images`** — `[{tree, rel, name}]`, one per disk image found by
  recursing `dxdfir_evidence_trees` (a VMDK's `-flat`/`-sNNN` extents and an EWF
  set's `.E02…` segments are excluded — they belong to their image, not hosts).
- **`dxdfir_evidence_hosts`** — `[{name, export}]`, one per immediate subfolder of
  `dxdfir_evidence_host_dir` (`gowindowlicker` reads `.export`, `godaemonhunter`
  takes the dicts directly).
- **`dxdfir_evidence_archives`** — `[{tree, rel, name}]`, one per UAC collection
  archive (`uac-<host>-<os>-<ts>.tar.gz|.tar|.zip`, the Unix-like Artifacts
  Collector's archive of a host's files) found by recursing
  `dxdfir_evidence_archive_trees` — the UAC lane. The same shape as a disk image,
  because `godaemonhunter` hunts ON an archive exactly as on an image (gomount
  reads its `[root]/` tree as the root volume); the discovery is by name and the
  tool confirms the content, so a zip of anything else is skipped there, and
  UAC's acquisition-log sidecar (`uac-<…>.log`) never matches.

All three default to `[]` when their inputs are unset. Variables:
`meta/argument_specs.yml`.

## Testing

Offline molecule: builds a fixture tree with a disk image (+ an excluded extent),
two host folders and a UAC collection archive (+ its log sidecar), then asserts
the three result lists — no containers, no daemon.

```bash
molecule test
```
