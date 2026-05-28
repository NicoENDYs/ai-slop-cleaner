#!/usr/bin/env bash
# Diff-based regression tests for slop_scan.py.
# For each tests/fixtures/*.input.ts, applies the scanner and diffs
# the output against the corresponding *.expected.ts.
# Exit 0 = all passed, 1 = failures.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SCANNER="$REPO_ROOT/.github/scripts/slop_scan.py"
FIXTURES_DIR="$SCRIPT_DIR/fixtures"

PASS=0
FAIL=0

for input in "$FIXTURES_DIR"/*.input.ts; do
    base="${input%.input.ts}"
    expected="${base}.expected.ts"
    name="$(basename "$base")"

    if [[ ! -f "$expected" ]]; then
        echo "SKIP  $name  (no expected file)"
        continue
    fi

    tmp=$(mktemp)
    python3 "$SCANNER" "$input" --apply > "$tmp" 2>&1

    if diff -u "$expected" "$tmp" > /dev/null 2>&1; then
        echo "PASS  $name"
        ((++PASS))
    else
        echo "FAIL  $name"
        diff -u "$expected" "$tmp" || true
        ((++FAIL))
    fi
done

echo ""
echo "Results: $PASS passed, $FAIL failed"
[[ $FAIL -eq 0 ]]
