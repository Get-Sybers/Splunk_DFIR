package cli

import "testing"

// TestCleanupEscalate pins the automatic-escalation decision for the wipe
// actions (purge evidence/car): the role is always opted into become (the
// processed/CAR trees hold lane output written as a different uid), and the
// sudo prompt is requested only when we are NOT already root AND this is NOT a
// --dry-run — a preview stats the world-readable tree and needs no escalation.
// Mirrors TestStackEscalate.
func TestCleanupEscalate(t *testing.T) {
	cases := []struct {
		name    string
		euid    int
		dryRun  bool
		wantAsk bool
	}{
		{"operator, real run -> prompt", 1000, false, true},
		{"operator, dry run -> no prompt", 1000, true, false},
		{"root, real run -> no prompt", 0, false, false},
		{"root, dry run -> no prompt", 0, true, false},
	}
	for _, c := range cases {
		vars, ask := cleanupEscalate(c.euid, c.dryRun)
		if len(vars) != 1 || vars[0] != "dxdfir_cleanup_become=true" {
			t.Errorf("%s: cleanupEscalate(%d,%v) vars = %v, want [dxdfir_cleanup_become=true]",
				c.name, c.euid, c.dryRun, vars)
		}
		if ask != c.wantAsk {
			t.Errorf("%s: cleanupEscalate(%d,%v) askBecomePass = %v, want %v",
				c.name, c.euid, c.dryRun, ask, c.wantAsk)
		}
	}
}

// TestPurgeNoBecomeFlag pins that escalation stays automatic for the wipe
// targets too: neither `purge evidence` nor `purge car` exposes a --become
// flag. (The stack verbs are covered by TestStackNoBecomeFlag.)
func TestPurgeNoBecomeFlag(t *testing.T) {
	root := NewRootCmd("test")
	for _, path := range [][]string{{"purge", "evidence"}, {"purge", "car"}} {
		cmd, _, err := root.Find(path)
		if err != nil {
			t.Fatalf("Find(%q): %v", path, err)
		}
		if cmd.Flags().Lookup("become") != nil {
			t.Errorf("%v unexpectedly exposes --become (escalation must be automatic, not a flag)", path)
		}
	}
}
