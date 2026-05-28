# Test Suite

This directory contains regression test cases for `ai-slop-cleaner`.

## Structure

```
tests/
  fixtures/       — Sample files used as input/expected output
    dirty.ts      — File with all slop patterns present
    clean.ts      — Expected output after full cleanup
    preserved.ts  — Patterns that must NEVER be modified
  cases/          — Markdown test specs per category
    redundant-comments.test.md
    emoji-removal.test.md
    preserved-patterns.test.md
    ai-meta-phrases.test.md
    multilang.test.md
```

## How to run (manual)

Open a file from `fixtures/` in your project and run the corresponding skill. Compare output against the expected fixture.

## How to run (automated with Claude Code)

```
/ai-run-tests
```

This skill reads each `.test.md` case, applies the relevant skill to the fixture, and reports PASS/FAIL per case.

## Adding a new test case

1. Add a section to the relevant `.test.md` file.
2. Include: Input snippet, Expected output, and any false-positive checks.
3. Run `/ai-run-tests` to validate.
