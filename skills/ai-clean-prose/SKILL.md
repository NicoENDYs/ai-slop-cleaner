---
name: ai-clean-prose
description: "Remove AI writing patterns from prose in Markdown files: READMEs, changelogs, docs, PR descriptions, commit messages. Use when editing .md files or reviewing documentation for AI tells. Triggers: 'clean prose', 'clean readme', 'limpiar documentación', 'ai-clean-prose', 'remove AI writing', 'edit docs'."
---

# AI Clean Prose

Eliminate predictable AI writing patterns from Markdown files and prose content.
Does NOT touch code blocks (``` fenced blocks are skipped entirely).

## Scope

By default, scan `.md` files in the current diff. The user can specify a file path or `--all` to clean all `.md` files in the project.

## Core Rules

### 1. Cut filler openers
Remove throat-clearing phrases at the start of sentences:
- "It's worth noting that…" → cut the opener, keep the point
- "It's important to mention…" → same
- "As mentioned above…" → delete
- "Note that…" → delete, state the fact directly
- "In conclusion…" / "To summarize…" → delete the phrase, keep content
- "Basically" / "Simply" / "Just" → remove
- "Feel free to…" → remove the phrase

### 2. Cut emphasis crutches
- "Really", "very", "extremely", "incredibly", "highly" before adjectives → remove
- "It's crucial that…" / "It's essential that…" → rewrite as imperative or direct statement

### 3. Break formulaic structures
- "Not X, but Y" / "Not X, it's Y" → rewrite as direct statement of Y
- "X is not just about Y, it's about Z" → "X is about Z."
- Numbered lists of exactly 3 vague nouns ("speed, reliability, and scalability") → keep only if specific, flag if generic
- Dramatic one-sentence paragraphs at the end of a section → integrate or delete

### 4. Use active voice
- "The function can be called…" → "Call the function…"
- "This was designed to…" → name who designed it or rewrite
- Inanimate subjects doing human actions: "the config allows you to" → "use the config to"

### 5. Be specific
- "Various", "several", "many", "numerous" without a count → replace with specific number or restructure
- "And more" / "etc." at the end of a list → complete the list or remove
- "Powerful", "robust", "seamless", "intuitive" as standalone adjectives → remove or replace with specific behavior

### 6. Vary rhythm
- Three consecutive sentences of similar length → flag for manual review
- Em dashes (—) → replace with comma, period, or restructure

### 7. Trust readers
- "Don't worry, this is easy!" → delete
- "As you can see…" → delete
- "You might be wondering…" → delete, answer the question directly

## What is ALWAYS preserved

- Code blocks (``` fenced)
- Inline code (`backtick` spans)
- URLs and links
- Table content
- Headings (only prose inside headings is cleaned)
- File paths and technical terms
- Quoted text (blockquotes)

## Supports dry-run

Append `--dry-run` to show the diff without modifying files.

## Output Format

For each file, show only changed lines:

```
── README.md ────────────────────────────────────────────────
  line 12  - It's worth noting that this tool requires Claude Code.
            + This tool requires Claude Code.
  line 34  - The tool is very easy to use and extremely powerful.
            + The tool cleans AI noise from your codebase.
  line 67  - Not a linter, it's a semantic filter.
            + It's a semantic filter.

3 changes applied.
```

## Prose Quality Score

After applying changes, score the file on these dimensions (1–10 each):

| Dimension   | Question                          |
|-------------|-----------------------------------|
| Directness  | Statements or announcements?      |
| Rhythm      | Varied or metronomic?             |
| Trust       | Respects reader intelligence?     |
| Authenticity| Sounds human?                     |
| Density     | Anything still cuttable?          |

Below 35/50: suggest a second pass.
