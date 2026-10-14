package identify

import "testing"

// TestIsUACMemberFoldsLikeGomount: the probe and gomount's uac.cleanName fold
// a member name the same way, so `dx sort` files into UAC/ exactly the
// archives gomount reads as collections — a climbing "[root]/../x" is not
// one, a "x/../uac.log" or a trailing-slash "uac.log/" is.
func TestIsUACMemberFoldsLikeGomount(t *testing.T) {
	cases := map[string]bool{
		"uac.log":                 true,
		"./uac.log":               true,
		"/uac.log":                true,
		"uac.log/":                true,
		"x/../uac.log":            true,
		"[root]":                  true,
		"[root]/":                 true,
		"[root]/etc/passwd":       true,
		"meta/../[root]/etc/pw":   true,
		"[root]\\etc\\passwd":     true,
		"[root]/../evil.txt":      false,
		"[root]/../../etc/passwd": false,
		"notes/readme.txt":        false,
		"root/etc/passwd":         false,
		"[root]x/etc/passwd":      false,
		"":                        false,
		"./":                      false,
		"/":                       false,
		"uac.log.bak":             false,
		"bodyfile/bodyfile.txt":   false,
	}
	for name, want := range cases {
		if got := isUACMember(name); got != want {
			t.Errorf("isUACMember(%q) = %v, want %v", name, got, want)
		}
	}
}
