---
name: ai-run-tests
description: "Run the regression test suite for ai-slop-cleaner. Use when validating that cleanup skills behave correctly after changes. Triggers: 'run tests', 'test suite', 'ai-run-tests', 'validate skills', 'regression test'."
---

# AI Run Tests

Execute the regression test suite defined in `tests/cases/` against the fixtures in `tests/fixtures/`.

## Procedure

1. Read all `*.test.md` files from `tests/cases/`.
2. For each test case in each file:
   a. Extract the **Input** snippet.
   b. Apply the relevant cleanup rule mentally (do NOT modify fixture files).
   c. Compare the result against **Expected** output.
   d. Record PASS or FAIL with the reason.
3. Print a summary report.

## Output Format

```
Running ai-slop-cleaner test suite...

── redundant-comments.test.md ─────────────────────────────
  ✅ A-1  Mirror comment removed correctly
  ✅ A-2  Return mirror removed correctly
  ✅ A-3  Await mirror removed correctly

── emoji-removal.test.md ──────────────────────────────────
  ✅ E-1  Emoji removed from console.log
  ✅ E-2  Emoji removed from comment
  ✅ E-3  JSX emoji preserved
  ✅ E-4  User-facing string emoji preserved
  ✅ E-5  Error message emoji removed

── preserved-patterns.test.md ─────────────────────────────
  ✅ P-1  TODO preserved
  ✅ P-2  Linter directive preserved
  ✅ P-3  Business logic comment preserved
  ✅ P-4  Edge case comment preserved
  ✅ P-5  License header preserved
  ✅ P-6  Commented-out code preserved
  ✅ P-7  JSX emoji preserved

── ai-meta-phrases.test.md ────────────────────────────────
  ✅ C-1  AI disclaimer removed
  ✅ C-2  Generation label removed
  ✅ C-3  Copilot attribution removed
  ✅ C-4  Feature description preserved (false positive avoided)

── multilang.test.md ──────────────────────────────────────
  ✅ PY-1  Python redundant comments removed
  ✅ GO-1  Go redundant comments removed
  ✅ PHP-1 PHP redundant comments removed

RESULTS
  Total:  21
  Passed: 21
  Failed: 0

All tests passed. ✓
```

If any test fails, print the diff between expected and actual and suggest which rule may need adjustment.
