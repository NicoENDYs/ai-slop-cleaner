---
name: ai-review-fixtures
description: "Use this skill when the user wants to manually verify that the scanner's pattern rules are correctly understood, review the test fixtures to understand what is and isn't detected, or add a new fixture to document a new pattern. Triggers include: 'review fixtures', 'check fixtures', 'add test case', 'ai-review-fixtures', 'update fixtures'. This is NOT an automated test runner — use tests/run.sh for that."
---

# AI Review Fixtures

Manually review and update the test fixtures in `tests/fixtures/` to ensure the scanner's rules are correctly documented.

## What This Skill Does

This is a **manual review workflow**, not an automated test suite. The automated tests live in `tests/run.sh` — run those first with `bash tests/run.sh`. This skill helps you:

1. Understand why a specific line is or isn't being detected.
2. Add a new fixture to cover a pattern that's currently missing.
3. Verify that the expected output files match the scanner's actual behavior.

## Fixture Naming Convention

| File | Purpose |
|------|---------|
| `*.input.ts` | TypeScript with slop patterns to be detected/cleaned |
| `*.expected.ts` | What the file should look like after `--apply` |

The test harness (`tests/run.sh`) runs `python3 .github/scripts/slop_scan.py <input> --apply` and diffs the output against `<expected>`.

## Procedure

### Reviewing an existing fixture

1. Read the `*.input.ts` file.
2. Run the scanner in report mode: `python3 .github/scripts/slop_scan.py tests/fixtures/<name>.input.ts`
3. Compare the findings to the `*.expected.ts` file.
4. Identify any discrepancies:
   - **False positive** (detected but should be kept): update `*.expected.ts` to keep the line, and note the false positive in a comment at the top of the fixture.
   - **False negative** (not detected but should be cleaned): consider whether the scanner rules should be updated in `slop_scan.py`. If yes, update the scanner and the expected file together.

### Adding a new fixture

1. Create `tests/fixtures/<descriptive-name>.input.ts` with the code pattern you want to test.
2. Run `python3 .github/scripts/slop_scan.py tests/fixtures/<name>.input.ts --apply > tests/fixtures/<name>.expected.ts`
3. Review the generated expected file manually to confirm it's correct.
4. If the output isn't right, adjust either the scanner or the input file.
5. Run `bash tests/run.sh` to confirm the new fixture passes along with all existing ones.

## Known Limitations

These patterns are **not detected** by the current scanner (acceptable false negatives):

- Comments using "concatenate", "combine", or other non-standard verbs that mirror the next line but aren't in the MIRROR_VERBS list.
- Emoji inside JSX template literals that are not clearly user-facing.
- Category F (inflated JSDoc) — not yet implemented in the scanner; Claude Code's cleanup skills handle it heuristically.

See `docs/rules.md` for the full pattern reference.
