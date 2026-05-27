---
name: ai-clean-diff
description: "Use this skill when the user wants to clean only their recent changes, clean the current diff, or remove AI slop from modified files without touching legacy code. Triggers include: 'clean diff', 'limpiar diff', 'clean my changes', 'clean only changed files', 'ai-clean-diff', 'clean recent changes'. Do NOT use when the user wants to clean an entire file or entire codebase — use ai-clean-comments or ai-remove-emojis for that instead."
---

# AI Clean Diff

Apply comment and emoji cleanup rules **only to lines added or modified in the current git diff**. Protects legacy, stable code from unintended changes while cleaning up recent AI-assisted work.

## Scope

- Only files listed by `git diff --name-only HEAD` (unstaged + staged changes vs last commit).
- If the branch has commits ahead of the base branch, also include `git diff origin/main...HEAD --name-only` (or `origin/master` if `main` doesn't exist).
- Only target lines prefixed with `+` in the diff output (added/modified lines). Lines with `-` (removed) and context lines (no prefix) are ignored.
- Only process files with these extensions: `.js`, `.ts`, `.jsx`, `.tsx`, `.mjs`, `.cjs`.

## Cleanup Rules Applied

Apply the same rules as the `ai-clean-comments` and `ai-remove-emojis` skills to the scoped lines:

**From ai-clean-comments:**
- Remove redundant comments that repeat the next line.
- Remove template/boilerplate phrases ("This function is responsible for…", "As an AI…", etc.).
- Remove debug-labeled comments (`// debug`, `// temp`, `// TODO remove` with no context).
- Remove inflated JSDoc on trivial functions.
- Keep: `TODO:`, `FIXME:`, `HACK:`, tool directives, business logic explanations.

**From ai-remove-emojis:**
- Remove emojis from comments and `console.*` calls.
- Keep emojis inside JSX elements and user-facing UI strings.

## Dry-Run Mode

If the user's request includes `--dry-run`, `dry run`, or "muéstrame qué cambiaría" / "show me what would change":

1. Run Steps 1–4 below, but **do not write any file changes** in Step 5.
2. Instead, output a unified diff of what would be removed across all changed files.
3. Print a summary (X comments removed, Y emojis stripped across Z files) and ask the user to confirm.
4. If the user confirms, run again in normal mode to apply changes.

## Configuration

If a `.ai-slop-cleaner.json` file exists in the project root, read it before processing. Respect:
- `scope`: if set to `"diff"` (default), limit to changed files; if `"file"`, process only the current file.
- `dryRun`: if `true`, behave as if `--dry-run` was passed.
- `rules` and `perDirectory` overrides apply per file.
- `ignoreFiles`: skip any file matching these glob patterns.

## Procedure

### Step 1 — Identify changed files

```bash
git diff --name-only HEAD
```

If that returns nothing (all changes are committed to the feature branch), run:

```bash
git diff origin/main...HEAD --name-only
```

Filter the result to only `.js`, `.ts`, `.jsx`, `.tsx`, `.mjs`, `.cjs` files.

If no changed JS/TS files are found, report this to the user and stop.

### Step 2 — Identify changed lines per file

For each file, run:

```bash
git diff HEAD -- <filepath>
```

Or for committed changes:

```bash
git diff origin/main...HEAD -- <filepath>
```

Parse the diff output to extract:
- Which line numbers in the file correspond to added lines (`+` prefix in diff hunks).
- The hunk headers (`@@ -a,b +c,d @@`) to map diff line numbers to actual file line numbers.

### Step 3 — Read the full file

Read the complete content of each changed file. This is necessary to understand context (e.g., whether a comment is followed by a redundant line, or whether a string is inside JSX).

### Step 4 — Apply cleanup to changed lines only

For each line number identified in Step 2 as an added line:
1. Check if that line (and its immediate neighbors for context) contains AI slop patterns.
2. Apply the cleanup rules from `ai-clean-comments` and `ai-remove-emojis`.
3. **Do not modify any line that was not in the added-lines set**, even if it contains slop. Those belong to stable code.

### Step 5 — Write changes back

Edit each file with the cleaned content. Only lines in the added-lines set may change.

### Step 6 — Report

After processing all files, report:
- Files scanned.
- Files modified (with count of changes per file).
- Total comments removed and emojis stripped.
- Any files skipped (non-JS/TS extension, binary, or unreadable).

## Edge Cases

- **Unstaged changes only:** `git diff HEAD` captures both staged and unstaged. If the user wants only staged changes, use `git diff --cached --name-only` instead and ask for confirmation if unclear.
- **No git repository:** Report an error and suggest using `ai-clean-comments` or `ai-remove-emojis` on the specific file instead.
- **Merge conflicts:** Do not process files with conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`). Report them as skipped.
- **Renamed or moved files:** Include them if their content has added lines.
- **New files (entirely added):** Treat all lines as added — apply full cleanup to the entire file.
- **Deleted files:** Skip — no content to clean.
- **Binary files:** Skip automatically.
- **Very large diffs (>500 changed lines):** Warn the user and ask if they want to proceed file by file.
