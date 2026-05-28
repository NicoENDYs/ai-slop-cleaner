---
name: ai-clean-confirm
description: "Use this skill after running /ai-clean-diff to confirm the cleanup is safe before committing. This is a required validation step, not optional. Triggers include: 'confirm cleanup', 'verify cleanup', 'ai-clean-confirm', 'check what was removed', 'is the cleanup safe to commit', 'review before commit'. Do NOT skip this step if the cleanup removed more than 5 lines."
---

# AI Clean Confirm

Validate the cleanup diff before committing. This is a **required step** in the workflow — not optional. Run it after every cleanup pass that removes more than a trivial amount.

## Why This Step Exists

Cleanup heuristics are conservative by design, but they're still heuristics. Before you commit, spend 60 seconds checking that nothing meaningful was removed. This step is what makes the cleanup trustworthy, not just fast.

## What to Check

### Flag these — may need manual review

**1. Numbers, versions, or named references in removed comments**
A removed comment that contains a specific number, a version string, a proper noun, or a URL might encode a real constraint:
- `// retry up to 3 times` → might document a deliberate rate limit
- `// workaround for Firefox 98` → might document a platform constraint
- `// required by PaymentProvider API v2` → might document an external contract
- `// see JIRA-1234` → might link to a ticket with more context

These are different from `// increment counter`. They contain information that isn't in the code.

**2. The only comment on a non-trivial function**
If a function has >15 lines, side effects, or complex logic, and the cleanup removed its only comment, flag it. The function might need a replacement comment.

**3. JSDoc `@param` or `@returns` that contained a constraint**
- `@param id - must be UUID v4, never an integer` → meaningful, consider restoring
- `@param id - the id` → not meaningful, correctly removed

### These are safe — confirm and proceed

- Comments that literally repeated the function or variable name.
- Template phrases ("This function is responsible for…").
- AI meta-phrases ("As an AI language model…").
- Emoji-only comments (`// 🎉`).
- Debug labels (`// debug`, `// temp`).
- JSDoc on trivial getters/setters/one-liners.

If a removed tool directive or `TODO`/`FIXME` shows up in the diff, that's a **scanner bug** — flag it and restore it.

## Procedure

1. Run `git diff HEAD` to see the changes from the cleanup pass.
   - If cleanup was already committed: `git diff HEAD~1 HEAD`.

2. Filter to lines starting with `-` in `.js/.ts/.jsx/.tsx` files.

3. For each removed comment line:
   a. Apply the "safe" checklist. If it matches → mark as confirmed, move on.
   b. Apply the "flag" checklist. If it matches → show it to the user with context.

4. For each flagged removal, output:
   - File and approximate line number (pre-cleanup).
   - The removed text.
   - Why it was flagged (one sentence).
   - A concrete suggestion: restore verbatim, write a shorter replacement, or confirm removal.

5. If nothing is flagged: print a green confirmation and tell the user it's safe to commit.

6. **Do not edit any file.** The user makes the final call on what to restore.

## Output Format

```
── Cleanup confirm: git diff HEAD ─────────────────────────

FLAGGED (review before committing)

  src/payments/processor.ts ~line 34
    Removed: // PaymentProvider requires max 3 retries
    Flagged: contains a specific limit and an external service name.
    Options:
      a) Restore as-is.
      b) Shorten: // max 3 retries (PaymentProvider contract)
      c) Confirm removal if this limit is enforced elsewhere.

CONFIRMED CLEAN
  9 redundant comments removed — all mirrored the next line.
  3 emojis stripped from console.log calls.

Safe to commit the confirmed items. Resolve flagged items first.
```

## Edge Cases

- **Large cleanup (>50 removed lines):** Work file by file. Ask the user which files to prioritize.
- **Cleanup removed actual code (not just comments):** Flag immediately — this is a scanner bug or misuse. Cleanup skills must not touch logic.
- **No diff found:** Ask the user to specify the commit or file to review.
