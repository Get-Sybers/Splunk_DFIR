"""Unit coverage for the carcheck run-through tally logic (no emulator)."""
from get_sybers_dfir import carcheck


def _checker(scalars):
    """A _Checker whose scalar() returns canned values by csl substring."""
    c = carcheck._Checker.__new__(carcheck._Checker)
    c.passed = c.failed = c.skipped = 0
    c.lines = []
    c.scalar = lambda db, csl: next((v for k, v in scalars.items() if k in csl), None)
    return c


def test_ge_and_has_and_zero_tally():
    c = _checker({"good | count": "5", "empty | count": "0"})
    c.ge("mitre", "good | count", 3, "good>=3")
    c.ge("mitre", "good | count", 9, "good>=9")     # fails
    c.has("mitre", "good | count", "good has rows")
    c.zero("mitre", "empty | count", "empty is zero")
    c.zero("mitre", "good | count", "good is zero")  # fails (5 != 0)
    assert c.passed == 3 and c.failed == 2


def test_scalar_error_is_a_failure_not_a_skip():
    c = _checker({})                                 # scalar always None
    c.has("mitre", "x | count", "x present")
    c.zero("mitre", "x | count", "x zero")
    assert c.failed == 2 and c.passed == 0 and c.skipped == 0


def test_has_rows_gate():
    c = _checker({"present | count": "1", "absent | count": "0"})
    assert c.has_rows("host", "present | count") is True
    assert c.has_rows("host", "absent | count") is False
    assert c.has_rows("host", "missing | count") is False   # None -> False


def test_union_equals_sum_detects_fabrication():
    # union total matches the sum of the two sources -> pass
    ok = _checker({"CarX() | count": "10", "CarX_A() | count": "6", "CarX_B() | count": "4"})
    ok.union_equals_sum("X", ("A", "B"))
    assert ok.passed == 1 and ok.failed == 0
    # union total exceeds the sum (a fabricated/duplicated row) -> fail
    bad = _checker({"CarX() | count": "11", "CarX_A() | count": "6", "CarX_B() | count": "4"})
    bad.union_equals_sum("X", ("A", "B"))
    assert bad.failed == 1 and bad.passed == 0
