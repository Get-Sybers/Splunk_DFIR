// Package identify determines the TYPE of an evidence file from its bytes
// (magic-first, extension-fallback) — the "what kind of file is this" sense of
// file(1)/libmagic, deliberately NOT "detect" (which in this project means
// threat detections).
//
// The lane taxonomy AND the magic signatures are DATA (evidence-taxonomy/, loaded
// by Load — see taxonomy.go). This file holds only the byte-matching primitives
// and the few content probes a `kind: special:*` signature dispatches to, because
// they need real logic rather than a fixed byte compare at a fixed offset.
package identify

import (
	"archive/tar"
	"archive/zip"
	"bytes"
	"compress/gzip"
	"io"
	"os"
	"strings"
)

// readAt reads exactly n bytes at byte offset off; ok=false on a short/failed read.
func readAt(path string, off, n int) (buf []byte, ok bool) {
	if n <= 0 || off < 0 {
		return nil, false
	}
	f, err := os.Open(path)
	if err != nil {
		return nil, false
	}
	defer f.Close()
	b := make([]byte, n)
	m, _ := f.ReadAt(b, int64(off))
	if m < n {
		return nil, false
	}
	return b, true
}

// maskedEqual reports whether buf matches pattern under mask (a 0x00 mask byte is
// an `nn` wildcard position). pattern is stored already AND-ed with mask.
func maskedEqual(buf, pattern, mask []byte) bool {
	if len(buf) < len(pattern) {
		return false
	}
	for i := range pattern {
		if buf[i]&mask[i] != pattern[i] {
			return false
		}
	}
	return true
}

// scanFor searches the first maxScan bytes for pattern (under mask) — for an
// `offset: any` signature.
func scanFor(path string, pattern, mask []byte) bool {
	if len(pattern) == 0 {
		return false
	}
	f, err := os.Open(path)
	if err != nil {
		return false
	}
	defer f.Close()
	buf := make([]byte, maxScan)
	m, _ := f.Read(buf)
	buf = buf[:m]
	for i := 0; i+len(pattern) <= len(buf); i++ {
		if maskedEqual(buf[i:], pattern, mask) {
			return true
		}
	}
	return false
}

// matchSpecial dispatches a `kind: special:*` signature to its Go probe.
func matchSpecial(kind, path string) bool {
	switch kind {
	case "special:vmdk-descriptor":
		return isVMDKDescriptor(path)
	case "special:vhd-footer":
		return isVHDFooter(path)
	case "special:ooxml":
		return isOOXML(path)
	case "special:odf":
		return isODF(path)
	case "special:apk":
		return isAPK(path)
	case "special:dmg-footer":
		return isDMGFooter(path)
	case "special:uac-archive":
		return isUACArchive(path)
	case "special:uac-acquisition-log":
		return isUACAcquisitionLog(path)
	}
	return false
}

// isVMDKDescriptor matches a VMDK text descriptor ("# Disk DescriptorFile"), the
// sidecar that points at a set of -flat/-s00N extents.
func isVMDKDescriptor(path string) bool {
	buf, ok := readAt(path, 0, 21)
	return ok && string(buf) == "# Disk DescriptorFile"
}

// isVHDFooter matches a fixed-format VHD, which carries "conectix" only in its
// 512-byte end-of-file footer.
func isVHDFooter(path string) bool {
	fi, err := os.Stat(path)
	if err != nil || fi.Size() < 512 {
		return false
	}
	buf, ok := readAt(path, int(fi.Size()-512), 8)
	return ok && string(buf) == "conectix"
}

// headContains reports whether the first maxScan bytes contain needle — used to
// tell ZIP-based formats apart by an inner member name near the archive start,
// so a bare archive is not misfiled.
func headContains(path, needle string) bool {
	f, err := os.Open(path)
	if err != nil {
		return false
	}
	defer f.Close()
	buf := make([]byte, maxScan)
	m, _ := f.Read(buf)
	return bytes.Contains(buf[:m], []byte(needle))
}

// isOOXML confirms a ZIP (PK\x03\x04) is an OOXML Office document by its
// [Content_Types].xml member (docx/xlsx/pptx/vsdx).
func isOOXML(path string) bool { return headContains(path, "[Content_Types].xml") }

// isODF confirms a ZIP is an OpenDocument file by its vnd.oasis.opendocument
// mimetype member (odt/ods/odp), stored uncompressed near the archive start.
func isODF(path string) bool { return headContains(path, "vnd.oasis.opendocument") }

// isAPK confirms a ZIP is an Android package by its AndroidManifest.xml member.
func isAPK(path string) bool { return headContains(path, "AndroidManifest.xml") }

// isDMGFooter matches an Apple DMG, which carries its "koly" trailer block in the
// last 512 bytes of the file.
func isDMGFooter(path string) bool {
	fi, err := os.Stat(path)
	if err != nil || fi.Size() < 512 {
		return false
	}
	buf, ok := readAt(path, int(fi.Size()-512), 4)
	return ok && string(buf) == "koly"
}

// uacMembers bounds the layout scan of a UAC archive: the collector writes
// uac.log first, so a collection declares itself within a few members.
const uacMembers = 16

// isUACArchive confirms a zip, gzip or tar is a UAC (Unix-like Artifacts
// Collector) collection by UAC's own layout — uac.log among the first
// members, or a member under [root]/ (the host's files) — the rule
// gomount's uac package reads the archive by. A zip or tar of anything else
// fails it. The container is decided by magic, never by name.
func isUACArchive(path string) bool {
	f, err := os.Open(path)
	if err != nil {
		return false
	}
	defer f.Close()
	st, err := f.Stat()
	if err != nil || st.Size() < 512 {
		return false
	}
	head := make([]byte, 512)
	if _, err := io.ReadFull(f, head); err != nil {
		return false
	}
	switch {
	case bytes.Equal(head[:4], []byte{'P', 'K', 3, 4}):
		zr, err := zip.NewReader(f, st.Size())
		if err != nil {
			return false
		}
		for i, m := range zr.File {
			if i >= uacMembers {
				break
			}
			if isUACMember(m.Name) {
				return true
			}
		}
		return false
	case head[0] == 0x1f && head[1] == 0x8b:
		if _, err := f.Seek(0, io.SeekStart); err != nil {
			return false
		}
		zr, err := gzip.NewReader(f)
		if err != nil {
			return false
		}
		defer zr.Close()
		return uacTarLayout(io.LimitReader(zr, maxScan*64))
	case string(head[257:262]) == "ustar":
		if _, err := f.Seek(0, io.SeekStart); err != nil {
			return false
		}
		return uacTarLayout(io.LimitReader(f, maxScan*64))
	}
	return false
}

// uacTarLayout scans the first members of a tar stream for UAC's layout.
func uacTarLayout(r io.Reader) bool {
	tr := tar.NewReader(r)
	for i := 0; i < uacMembers; i++ {
		hdr, err := tr.Next()
		if err != nil {
			return false
		}
		if isUACMember(hdr.Name) {
			return true
		}
	}
	return false
}

// isUACMember reports whether an archive member name is UAC's run log or a
// file of the collected host.
func isUACMember(name string) bool {
	clean := strings.TrimLeft(strings.TrimPrefix(strings.ReplaceAll(name, "\\", "/"), "./"), "/")
	return clean == "uac.log" || clean == "[root]" || strings.HasPrefix(clean, "[root]/")
}

// isUACAcquisitionLog matches the acquisition log UAC writes beside its
// archive: a text file opening with the collector's banner.
func isUACAcquisitionLog(path string) bool {
	const banner = "Created by UAC (Unix-like Artifacts Collector)"
	buf, ok := readAt(path, 0, len(banner))
	return ok && string(buf) == banner
}
