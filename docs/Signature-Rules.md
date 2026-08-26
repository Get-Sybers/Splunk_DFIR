# Adding Your Own Signature Rules (YARA & Suricata)

The signature lanes (`scripts/signatures/`, ported to
`python/get_sybers_dfir/signatures/`) load operator-supplied rules from
`data_store/dependencies/`. There is **no registration step** — drop the files in
the right directory and run the lane; discovery is recursive.

Outputs land in `data_store/processed/signatures/<lane>/` as self-describing
JSONL. Lane basics are in
[Scripts-Overview](/docs/scripts/Scripts-Overview.md#signature-detection-process-signaturessh).

---

## YARA

**Where:** anywhere under `data_store/dependencies/yara-rules/` — nested
subdirectories are fine, the lane walks the whole tree.

**What loads:** every `*.yar` / `*.yara` file (extension is case-insensitive).
Files whose basename starts with `_` are skipped — prefix a file with `_` to
disable it without deleting it. (The shell lane's exclusion only covers
`_*.yar`, so use the `.yar` extension for disabled files to be safe in both
lanes.)

**How they're loaded:** the lane generates an index file of
`include "/rules/<relative-path>"` lines — one per discovered rule file — and
compiles that single index. Your rules directory is bind-mounted **read-only**
at `/rules` inside the `blacktop/yara` container, so nested layouts survive
intact. The Python lane writes the index to a temp file outside the tree; the
shell lane (`scripts/signatures/yara.sh`) writes a transient `_dfir_index.yar`
*into* the rules directory, so that directory must be writable when using the
shell lane.

For the **memory** source (shell lane, Volatility `vadyarascan`) all rule files
are concatenated into one file — so **rule names must be unique across every
file** or compilation fails.

```bash
# drop rules (any nesting)
mkdir -p data_store/dependencies/yara-rules/mine
cp my_malware.yar data_store/dependencies/yara-rules/mine/

# run just the YARA lane
./scripts/process-signatures.sh --only yara
```

`--fetch` downloads a YARA-Forge starter set **only when the directory has no
rules yet** — your own rules suppress it.

**Verify:** the lane reports the rule-file count (confirm yours is counted), then
check the output — each match is one JSON object naming your rule:

```bash
jq -r '.rule' data_store/processed/signatures/yara/matches.jsonl | sort | uniq -c
```

The **files** source scans `data_store/raw/other_raw_data/`. Plant an
EICAR-style test file there to prove a rule fires.

**Gotchas**

- **One broken rule aborts everything.** All rules compile through a single
  index, so a syntax error in any file kills the whole scan (container stderr is
  discarded — you just get 0 matches). Pre-check a new rule:
  ```bash
  docker run --rm -v "$PWD/data_store/dependencies/yara-rules":/rules:ro \
      blacktop/yara /rules/mine/my_malware.yar /dev/null
  ```
- Duplicate rule identifiers across files are a compile error (memory source) —
  namespace your rule names.
- The Python lane skips a source whose output already exists — pass `--force`
  (or delete `matches.jsonl`) to re-scan.

---

## Suricata

**Where:** a **single file named exactly `suricata.rules`**, anywhere under
`data_store/dependencies/suricata-rules/`. The lane takes the *first* one it
finds (the Python lane walks the whole tree; the shell lane looks at most two
levels deep — keep it shallow).

**How it's loaded:** the rules directory is mounted read-only at `/rules` and the
file is passed with `suricata -S`, which loads it **exclusively** — the container
image's bundled rules are ignored. If no `suricata.rules` exists, the lane falls
back to `jasonish/suricata`'s bundled rules and says so.

Multiple rule sources therefore have to be merged into that one file:

```bash
mkdir -p data_store/dependencies/suricata-rules
cat et-open.rules my-local.rules > data_store/dependencies/suricata-rules/suricata.rules

./scripts/process-signatures.sh --only suricata
```

`--fetch` runs `suricata-update` (ET Open) into the directory — again only when
no `suricata.rules` is already present. To combine ET Open with your own rules,
`--fetch` first, then append yours to the fetched file.

**Verify:** the lane reports the ruleset it chose (if it says it's using the
image's bundled rules, your file wasn't found). Then check the per-PCAP EVE
output for alerts from your signatures:

```bash
jq -r 'select(.event_type=="alert") | .alert.signature' \
    data_store/processed/signatures/suricata/*.eve.jsonl | sort | uniq -c
```

**Gotchas**

- Suricata's stderr is discarded; a rules file with syntax errors shows up as no
  output or silent zero alerts. Test first:
  ```bash
  docker run --rm -v "$PWD/data_store/dependencies/suricata-rules":/rules:ro \
      jasonish/suricata suricata -T -S /rules/suricata.rules
  ```
- Every rule needs a **unique `sid`** (use ≥ 1000000 for local rules) —
  duplicates are rejected at load.
- Output is filtered to alert + context event types
  (`alert, anomaly, http, dns, tls, fileinfo, flow`); set `keep_all` for the full
  EVE stream.
- A PCAP with an existing non-empty `.eve.jsonl` is skipped — delete the output
  (or pass `--force`) after changing rules.

### Tuning (HOME_NET and friends)

`HOME_NET` is Suricata's primary tuning variable: ET/Sigma-style rules key their
direction off `$HOME_NET` / `$EXTERNAL_NET`, so a `HOME_NET` matching the
capture's real internal range is what makes directional rules fire. The Python
lane (`python -m get_sybers_dfir.signatures`) exposes:

```bash
# set it explicitly (EXTERNAL_NET defaults to its complement)
--home-net '[10.0.0.0/8,192.168.0.0/16]'   [--external-net '[1.2.3.0/24]']

# or derive it per-PCAP from that PCAP's own traffic (a cheap first pass)
--auto-home-net

# any other Suricata variable, repeatable
--suricata-set vars.port-groups.HTTP_PORTS=8080
```

`--auto-home-net` runs Suricata once with defaults, reads the src/dest IPs from
its EVE flow records, and re-runs with `HOME_NET` set to the private supernets
that actually appeared (RFC1918 + CGNAT + link-local); it falls back to the
RFC1918 default when a capture shows no private address. It is ignored when
`--home-net` is given explicitly.

## Hayabusa (Sigma over Windows Event Logs)

Hayabusa runs inside the **evtx pipeline** (`python -m get_sybers_dfir.evtx
--hayabusa`), scanning the same `.evtx` the lane collected — loose logs or those
extracted from a disk image via `--image-src`. Sigma rules live under
`data_store/dependencies/hayabusa/rules/` (or `--hayabusa-rules`); detections are
written to `<out-dir>/hayabusa/timeline.jsonl`. See
[Scripts-Overview](/docs/scripts/Scripts-Overview.md#signature-detection-process-signaturessh).
