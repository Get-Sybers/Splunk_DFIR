#!/bin/bash
# ==============================================================================
# Shared disk-image access for the signature lanes.
#
# PREFERRED: MOUNT the image read-only and let tools scan it IN PLACE (no copies).
#   ewfmount (E01 -> raw, FUSE) + ntfs-3g (NTFS via FUSE, offset= — no loop needed).
#   This needs /dev/fuse. In this LXC the device cgroup blocks /dev/fuse (even for
#   privileged containers), so mounting only works once the HOST exposes it:
#       lxc.cgroup2.devices.allow: c 10:229 rwm
#       lxc.mount.entry: /dev/fuse dev/fuse none bind,create=file
#   sig_have_fuse gates on this so the lanes mount the instant it's available.
#
# FALLBACK (opt-in, SIG_ALLOW_EXTRACT=1): pull files out with Plaso image_export.py
#   (dfVFS, userspace, works without /dev/fuse). Kept for FUSE-less environments;
#   off by default because the intent is mount-in-place, not copying.
#
# Provides: sig_list_images, sig_have_fuse, sig_mount_image, sig_unmount_image,
#           sig_image_export (fallback).
# ==============================================================================

PLASO_IMAGE="${PLASO_IMAGE:-log2timeline/plaso}"
SIG_VSS="${SIG_VSS:-0}"

sig_list_images() {
    find "$1" -type f \( \
        -iname '*.e01' -o -iname '*.raw' -o -iname '*.img' -o -iname '*.dd' \
     -o -iname '*.vmdk' -o -iname '*.001' -o -iname '*.aff4' \
     \) 2>/dev/null | sort
}

# True if a real filesystem mount of an image is possible here.
sig_have_fuse() { [[ -e /dev/fuse ]] && command -v ntfs-3g >/dev/null 2>&1; }

sig_fuse_help() {
    cat >&2 <<'MSG'
   ⚠️  cannot mount images: /dev/fuse is not available in this container.
      This is an LXC device-cgroup restriction (mount needs FUSE, not loop).
      Enable it on the Proxmox HOST for this container, then re-run:
        lxc.cgroup2.devices.allow: c 10:229 rwm
        lxc.mount.entry: /dev/fuse dev/fuse none bind,create=file
      (Or set SIG_ALLOW_EXTRACT=1 to pull files with image_export instead.)
MSG
}

# Mount <image> read-only at <mountpoint>. Handles E01 (via ewfmount) and raw/dd/
# img, and the first NTFS partition (mmls) — Windows images, which is what winevt
# and most Windows YARA targets need. Prints nothing; returns 0 on success. State
# for unmount is kept in <mountpoint>.state.
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
    # first NTFS/Windows partition offset (sectors -> bytes); empty => single volume
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
    # unmount ntfs first, then ewf, then clean temp dirs (reverse order)
    tac "$mnt.state" | while read -r kind path; do
        fusermount -u "$path" 2>/dev/null || umount "$path" 2>/dev/null
        [[ "$kind" == "ewf" ]] && rm -rf "$path"
    done
    rm -f "$mnt.state"; rmdir "$mnt" 2>/dev/null || true
}

# Fallback extractor (opt-in). Extra args pass through to image_export.py.
sig_image_export() {
    local image out; image="$(realpath -m "$1")"; out="$(realpath -m "$2")"; shift 2
    mkdir -p "$out"; chmod 777 "$out" 2>/dev/null || true
    local vss=(--vss_stores none); [[ "$SIG_VSS" == "1" ]] && vss=(--vss_stores all)
    docker run --rm -v "$(dirname "$image")":/data:ro -v "$out":/out \
        "$PLASO_IMAGE" image_export.py -q --partitions all "${vss[@]}" \
        "$@" -w /out "/data/$(basename "$image")" >/dev/null 2>&1
    find "$out" -type f 2>/dev/null | grep -q .
}
