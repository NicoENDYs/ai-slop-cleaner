---
name: ai-slop-review
description: "Use this skill after running cleanup skills (ai-clean-comments, ai-remove-emojis, ai-clean-diff) to validate that no useful context was accidentally removed. Triggers include: 'review cleanup', 'validate cleanup', 'ai-slop-review', 'check what was removed', 'review the changes', 'did I lose anything useful'. Do NOT use as a standalone code review tool — it focuses only on verifying that cleanup didn't remove meaningful comments or context."
---

# AI Slop Review

Validate that the cleanup pass didn't accidentally remove useful information. This is the final step in the scan → clean → review workflow.

## Purpose

Cleanup skills apply heuristics. Heuristics can be wrong. This skill checks the post-cleanup diff and flags any removed content that might have been meaningful, so you can decide whether to restore it before committing.

## What to Check

### Potentially meaningful removals (flag these)

- A removed comment that contains a number, a name, a URL, a version, or a specific condition — these often encode constraints, not just repetition.
  - `// retry up to 3 times` → might encode a deliberate limit
  - `// workaround for Firefox 98` → might encode a platform constraint
  - `// required by PaymentProvider API v2` → might encode an external contract

- A removed JSDoc `@param` or `@returns` that mentioned a constraint beyond the type name:
  - `@param id - must be a UUID v4, not an integer ID` → meaningful
  - `@param id - the id` → not meaningful (was correctly removed)

- A removed `TODO` or `FIXME` — these should never have been removed. Flag as a bug in the cleanup.

- A removed tool directive (`eslint-disable`, `@ts-ignore`, etc.) — these should never have been removed. Flag as a bug in the cleanup.

- A removed comment that is the only documentation for a non-trivial function (>15 lines, or a function with side effects).

### Confirm as correctly removed (do not flag)

- Comments that literally repeat the function/variable name.
- Template phrases ("This function is responsible for…").
- AI meta-phrases ("As an AI…").
- Emoji-only comments (`// 🎉`).
- Debug labels (`// debug`, `// temp`).
- `// TODO remove` with no context.

## Procedure

1. Run `git diff HEAD` to see what was changed in the cleanup pass.
   - If there are no staged/unstaged changes (cleanup was already committed), use `git diff HEAD~1 HEAD` or ask the user which commit to review.

2. Filter to lines beginning with `-` (removed lines) in `.js`, `.ts`, `.jsx`, `.tsx` files.

3. For each removed line that was a comment or part of a JSDoc block:
   a. Apply the "confirm as correctly removed" checks. If it matches → skip.
   b. Apply the "potentially meaningful removals" checks. If it matches → flag it.

4. For each flagged removal, show:
   - The file and line number (pre-cleanup position).
   - The removed text.
   - A brief reason it was flagged.
   - A suggested action: restore, keep removed, or leave a shorter replacement comment.

5. If no flags: print a clean confirmation and suggest committing.

6. Do NOT edit any file automatically. This skill is advisory — the user decides what to restore.

## Output Format

```
── Cleanup review: HEAD diff ──────────────────────────────

FLAGGED REMOVALS (review before committing)

  src/payments/processor.ts, line 34 (removed):
    // retry up to 3 times — required by PaymentProvider contract
    Reason: contains a specific limit (3) and an external contract reference.
    Suggestion: restore as a shorter note, e.g.: // PaymentProvider requires max 3 retries

  src/auth/login.ts, line 89 (removed):
    // @ts-ignore
    Reason: tool directive — should never be removed by cleanup.
    Suggestion: restore immediately; check if the cleanup skill has a bug.

CONFIRMED CLEAN (correctly removed)
  12 redundant comments removed.
  4 emojis stripped from logs.
  1 inflated JSDoc block removed.

No action needed for confirmed items.
Run `git add -p` to selectively stage restored changes.
```

## Edge Cases

- **No diff available:** Ask the user to specify the commit or file to review.
- **Large diff (>200 removed lines):** Focus only on removed comment lines; skip removed code lines.
- **Cleanup removed code (not just comments):** Flag immediately — cleanup skills should not remove logic. This indicates a bug or misuse.
- **User ran cleanup on the whole repo:** The review may have many findings. Group by file and ask the user if they want to review file by file.
