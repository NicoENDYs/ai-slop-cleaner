---
name: ai-remove-emojis
description: "Use this skill when the user asks to remove emojis from code, clean emoji decoration from comments or logs, or strip visual noise from source files. Triggers include: 'remove emojis', 'quitar emojis', 'limpiar emojis', 'ai-remove-emojis', 'strip emojis', 'clean emoji'. Do NOT use for removing comments, refactoring logic, or touching UI strings that are clearly user-facing."
---

# AI Remove Emojis

Strip emojis and decorative Unicode symbols from source code comments, logs, and non-UI strings without breaking structure, indentation, or user-facing content.

## Emoji Ranges to Target

Remove characters in these Unicode ranges:
- **Emoticons / pictographs:** U+1F300–U+1FFFF (covers 😂🔥💀✅🛠️🎉🚀💡🔧 and thousands more)
- **Miscellaneous symbols:** U+2600–U+27BF (covers ☀️⚡☎️✉️ and similar)
- **Dingbats:** U+2700–U+27FF (covers ✂️✔️✗✘ and similar)
- **Enclosed alphanumerics supplement:** U+1F100–U+1F1FF

**Do NOT remove:**
- Standard punctuation and ASCII symbols: `!`, `*`, `-`, `>`, `|`, `#`, `@`, etc.
- Mathematical symbols: `≤`, `≥`, `≠`, `±`, `∞`
- Copyright/trademark: `©`, `™`, `®`
- Currency symbols: `€`, `£`, `¥`
- Arrows used in documentation: `→`, `←`, `↑`, `↓`, `⇒`

## Where to Remove Emojis

### Always remove — comments
Any emoji inside a comment is decorative and should go:

```typescript
// Setup complete ✅          → // Setup complete
/* Error handler 🔥 */       → /* Error handler */
/** @returns the user 👤 */  → /** @returns the user */
// ─── Auth module 🔐 ──────  → // ─── Auth module ──────
```

### Always remove — debug/logging statements
Emojis in `console.*` calls that are not user-facing UI strings:

```typescript
console.log("Fetched user 🎉", user)     → console.log("Fetched user", user)
console.warn("Missing field ⚠️")         → console.warn("Missing field")
console.error("Auth failed 🚨", err)     → console.error("Auth failed", err)
```

### Remove — non-UI string literals in logic code
Strings used as internal values, error messages thrown programmatically, or log messages:

```typescript
throw new Error("Validation failed 💥")  → throw new Error("Validation failed")
logger.info("Processing done 🏁")        → logger.info("Processing done")
```

## Where to Preserve Emojis

### JSX / template content (user-facing UI)
Never modify strings inside JSX elements or template literals that render to the user:

```tsx
// Keep as-is:
<p>Upload complete ✅</p>
<button>Submit 🚀</button>
const label = `Status: ${status} 🟢`   // if rendered in UI
```

**Heuristic:** If the string or element is inside JSX (`<Tag>…</Tag>` or a JSX expression `{…}`), keep emojis.

### i18n / translation keys and values
Keep emojis in translation files (`*.json`, `*.po`, `*.yml` inside `locales/` or `i18n/` directories) — those are content, not code.

### README and documentation files (`.md`, `.mdx`)
Out of scope — do not modify Markdown files with this skill.

## Dry-Run Mode

If the user's request includes `--dry-run`, `dry run`, or "muéstrame qué cambiaría" / "show me what would change":

1. Run the full procedure below, but **do not write any file changes**.
2. Instead, output a unified diff showing which lines would be modified:
   ```diff
   --- src/auth/login.ts (before)
   +++ src/auth/login.ts (after)
   @@ -5,3 +5,3 @@
   -// 🚀 Auth module setup
   +// Auth module setup
   -  console.log("User authenticated 🎉", user.id)
   +  console.log("User authenticated", user.id)
   ```
3. Print a summary (X emojis would be removed from Y lines) and ask the user to confirm.
4. If the user confirms, run again in normal mode to apply changes.

## Configuration

If a `.ai-slop-cleaner.json` file exists in the project root, read it and apply `rules.removeEmojisInComments`, `rules.removeEmojisInLogs`, and `perDirectory` overrides before processing each file.

## Procedure

1. Read the full file content.
2. Check if a `.ai-slop-cleaner.json` config exists and load relevant rules for this file's directory.
3. Scan line by line for characters in the emoji Unicode ranges listed above.
4. For each line containing an emoji:
   a. **Is it inside a JSX element or JSX expression?** → Skip (keep emoji).
   b. **Is it inside a comment (`//`, `/* */`, `/** */`)?** → Remove the emoji(s), keep the rest of the comment.
   c. **Is it inside a `console.*` call string?** → Remove the emoji(s), keep the string.
   d. **Is it inside a string that renders to the UI** (JSX prop, template literal used in render)? → Keep.
   e. **Is it inside a thrown `Error` message, a logger call, or a non-UI string literal?** → Remove emoji(s), keep the string.
5. After removing an emoji, clean up any extra whitespace it leaves:
   - `"Done  🎉 here"` → `"Done here"` (collapse extra spaces)
   - `"Done 🎉"` → `"Done"` (trailing space removed)
   - `"🎉 Done"` → `"Done"` (leading space removed)
6. Preserve indentation, line breaks, and all surrounding code structure.
7. Report a summary: how many emojis removed, from how many lines.

## Edge Cases

- **Multiple emojis on one line:** remove all of them in that context.
- **Emoji-only comment:** `// 🎉` → remove the entire comment line.
- **Emoji in a variable name** (rare, e.g., `const 🚀speed = …`): flag to the user — do not modify variable names automatically.
- **Skin tone modifiers** (U+1F3FB–U+1F3FF) and **zero-width joiners** (U+200D) that combine emojis: remove the full sequence, not just the base emoji.
- **Variation selectors** (U+FE0F): remove when attached to an emoji that was removed; keep when attached to a symbol that was kept (e.g., `©️` → `©`).
