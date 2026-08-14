#!/bin/bash
# ==============================================================================
# Shared disk-image access for the signature lanes — MOUNT ONLY, never extract.
#
# Disk images are mounted READ-ONLY and tools scan them in place (nothing is
# copied out of the image). Mounting uses FUSE (ewfmount for E01 -> raw, ntfs-3g
# for the NTFS volume — no loop device needed), so it requires /dev/fuse.
#
# In this LXC /dev/fuse is blocked by the device cgroup (even a privileged Docker
# container can't get it), so mounting only works once the HOST allows it:
#     lxc.cgroup2.devices.allow: c 10:229 rwm
#     lxc.mount.entry: /dev/fuse dev/fuse none bind,create=file
# Until then the lanes skip disk images — the user can drop loose .evtx / files in
# instead. We deliberately do NOT extract files out of images.
#
# Provides: sig_list_images, sig_have_fuse, sig_mount_image, sig_unmount_image.
# ==============================================================================

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
