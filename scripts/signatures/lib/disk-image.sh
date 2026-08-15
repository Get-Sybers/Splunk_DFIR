#!/bin/bash
# ==============================================================================
# Shared disk-image access for the signature lanes.
#
# PREFERRED: MOUNT the image read-only and scan it in place (nothing copied out).
#   ewfmount (E01 -> raw, FUSE) + ntfs-3g (NTFS via FUSE, no loop). Needs /dev/fuse
#   — blocked in this LXC by the device cgroup (even privileged Docker can't get
#   it), so mounting only works once the HOST allows it:
#     lxc.cgroup2.devices.allow: c 10:229 rwm
#     lxc.mount.entry: /dev/fuse dev/fuse none bind,create=file
#
# TARGETED EXTRACTION (Hayabusa lane only): when mounting isn't possible, pull just
#   the named artefact set out of the image with Plaso's image_export.py (dfVFS,
#   userspace, E01-capable) — e.g. `--artifact_filters WindowsEventLogs` copies ONLY
#   winevt\Logs\*.evtx, a triage-style collection, not the whole filesystem. This
#   is deliberately scoped to Hayabusa (Hayabusa needs real .evtx and its -J JSON
#   input doesn't detect); the YARA lane stays mount-only and never extracts.
#
# Provides: sig_list_images, sig_have_fuse, sig_mount_image, sig_unmount_image,
#           sig_extract_artifacts.
# ==============================================================================
PLASO_IMAGE="${PLASO_IMAGE:-log2timeline/plaso}"
SIG_VSS="${SIG_VSS:-0}"

sig_list_images() {
    find "$1" -type f \( \
        -iname '*.e01' -o -iname '*.raw' -o -iname '*.img' -o -iname '*.dd' \
     -o -iname '*.vmdk' -o -iname '*.001' -o -iname '*.aff4' \
     \) 2>/dev/null | sort
}

# True if a real read-only mount of an image is possible here.
sig_have_fuse() { [[ -e /dev/fuse ]] && command -v ntfs-3g >/dev/null 2>&1; }

sig_fuse_help() {
    cat >&2 <<'MSG'
   ⚠️  cannot mount disk images: /dev/fuse is not available in this container.
      This is an LXC device-cgroup restriction (mount needs FUSE, not loop).
      Enable it on the Proxmox HOST for this container, then re-run:
        lxc.cgroup2.devices.allow: c 10:229 rwm
        lxc.mount.entry: /dev/fuse dev/fuse none bind,create=file
      Otherwise, provide the files directly (drop loose .evtx / files in) — this
      lane never extracts files out of images.
MSG
}

# Mount <image> read-only at <mountpoint>. Handles E01 (via ewfmount) and raw/dd/
# img, and the first NTFS partition (mmls) — Windows images, which is what winevt
# and most Windows YARA targets need. Returns 0 on success; unmount state is kept
# in <mountpoint>.state.
sig_mount_image() {
    local image mnt raw ewfdir off offb; image="$(realpath -m "$1")"; mnt="$2"
    mkdir -p "$mnt"; : > "$mnt.state"
    case "${image,,}" in
        *.e01|*.ex01)
            ewfdir="$(mktemp -d)"
            ewfmount "$image" "$ewfdir" >/dev/null 2>&1 || { rm -rf "$ewfdir"; return 1; }
            echo "ewf $ewfdir" >> "$mnt.state"
            raw="$ewfdir/ewf1" ;;
        *) raw="$image" ;;
    esac
    off="$(mmls -a "$raw" 2>/dev/null | awk 'tolower($0) ~ /ntfs|basic data|0x07/ {print $3; exit}')"
    if [[ -n "$off" ]]; then offb=$(( 10#$off * 512 )); else offb=0; fi
    if ntfs-3g -o "ro,offset=$offb,streams_interface=windows" "$raw" "$mnt" >/dev/null 2>&1; then
        echo "ntfs $mnt" >> "$mnt.state"; return 0
    fi
    sig_unmount_image "$mnt"; return 1
}

sig_unmount_image() {
    local mnt="$1"
    [[ -f "$mnt.state" ]] || { fusermount -u "$mnt" 2>/dev/null; return; }
    tac "$mnt.state" | while read -r kind path; do
        fusermount -u "$path" 2>/dev/null || umount "$path" 2>/dev/null
        [[ "$kind" == "ewf" ]] && rm -rf "$path"
    done
    rm -f "$mnt.state"; rmdir "$mnt" 2>/dev/null || true
}

# Targeted, triage-style extraction of named artefacts from an image into <out>,
# via the log2timeline container's image_export.py (dfVFS; handles E01). Extra args
# pass through — e.g. `--artifact_filters WindowsEventLogs` or `-x evtx`. Returns 0
# if anything was extracted. Used only by the Hayabusa lane (evtx); NOT for YARA.
sig_extract_artifacts() {
    local image out; image="$(realpath -m "$1")"; out="$(realpath -m "$2")"; shift 2
    mkdir -p "$out"; chmod 777 "$out" 2>/dev/null || true
    local vss=(--vss_stores none); [[ "$SIG_VSS" == "1" ]] && vss=(--vss_stores all)
    docker run --rm -v "$(dirname "$image")":/data:ro -v "$out":/out \
        "$PLASO_IMAGE" image_export.py -q --partitions all "${vss[@]}" \
        "$@" -w /out "/data/$(basename "$image")" >/dev/null 2>&1
    find "$out" -type f 2>/dev/null | grep -q .
}
