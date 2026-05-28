---
name: ai-slop-metrics
description: "Show metrics on how much AI slop has been cleaned over time. Use when the user wants a report, stats, or trend of slop reduction. Triggers: 'metrics', 'stats', 'how much slop', 'slop report', 'ai-slop-metrics'."
---

# AI Slop Metrics

Report how much AI-generated noise has been cleaned per commit and over the project lifetime.

## Data Source

Read from `.ai-slop-metrics.json` in the project root. This file is updated automatically by `/ai-clean-diff` and `/ai-clean-comments` after each cleanup run (when `metrics.enabled` is `true` in config).

## Metrics File Format

The metrics file follows this structure:
```json
{
  "totalCleaned": 42,
  "byCategory": {
    "A": 10,
    "B": 8,
    "C": 3,
    "D": 7,
    "E": 9,
    "F": 5
  },
  "history": [
    {
      "date": "2026-05-27",
      "commitSha": "abc1234",
      "branch": "feat/auth",
      "cleaned": 12,
      "byCategory": { "A": 4, "B": 3, "E": 5 }
    }
  ]
}
```

## Output Format

```
── AI Slop Metrics ─────────────────────────────────────────

Total artifacts cleaned (all time): 42

By category:
  [A] Redundant comments    10  (24%)
  [B] Template phrases       8  (19%)
  [C] AI meta-phrases        3  ( 7%)
  [D] Debug labels           7  (17%)
  [E] Emojis (non-UI)        9  (21%)
  [F] Inflated JSDoc         5  (12%)

Recent activity (last 5 cleanups):
  2026-05-27  feat/auth      abc1234  →  12 cleaned
  2026-05-25  main           def5678  →   8 cleaned
  2026-05-22  fix/login      ghi9012  →   7 cleaned
  2026-05-20  feat/payments  jkl3456  →   9 cleaned
  2026-05-18  main           mno7890  →   6 cleaned

Most common slop in this project: [A] Redundant comments
```

## Procedure

1. Check if `.ai-slop-metrics.json` exists. If not, print a message explaining metrics are collected automatically on the next cleanup run.
2. Read and parse the file.
3. Calculate percentages per category.
4. Print the report in the format above.
5. If `history` has more than 10 entries, show only the 5 most recent by default. The user can request `--all` to see the full history.

## How metrics are recorded (for cleanup skills)

After any cleanup skill modifies files, it should append to `.ai-slop-metrics.json`:
- The current date (ISO format)
- The current git commit SHA (`git rev-parse --short HEAD`)
- The current branch (`git rev-parse --abbrev-ref HEAD`)
- Count of findings removed, grouped by category.

If the file doesn't exist yet, create it with the structure above.
