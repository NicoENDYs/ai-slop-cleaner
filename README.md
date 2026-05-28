# AI Slop Cleaner for Claude Code

> Pack de skills y scanner para Claude Code que limpian artefactos típicos de código generado por IA en proyectos JavaScript/TypeScript — sin modificar la lógica de negocio.

> ⚠️ **Uso ético:** Esta herramienta no está pensada para engañar en entornos académicos o profesionales donde el uso de IA esté restringido. No falsifica autoría. No evade detectores basados en metadatos, telemetría ni historial de commits — esos datos no los toca.

---

## Qué hace (y qué no hace)

### Lo que detecta y elimina (objetivo, no opinión)

Estas categorías son razonablemente objetivas — hay criterios mecánicos para detectarlas:

| Categoría | Ejemplo → resultado |
|-----------|---------------------|
| **A** Comentario que repite la línea siguiente | `// return result` encima de `return result` → se elimina |
| **B** Frase plantilla de IA | `// This function is responsible for…` → se elimina |
| **C** Frase meta de IA | `// As an AI language model…` → se elimina |
| **D** Comentario de debug | `// debug`, `// temp`, `// remove before commit` → se elimina |
| **E** Emoji en contexto no-UI | `console.log("Done 🎉")` → `console.log("Done")` |

El scanner estático (`.github/scripts/slop_scan.py`) implementa las categorías A–E con reglas precisas, tests de regresión en `tests/fixtures/`, y CI en GitHub Actions.

### Lo que conserva (siempre)

| Patrón | Ejemplo |
|--------|---------|
| `TODO` / `FIXME` / `HACK` / `NOTE` | `// TODO: add pagination` |
| Directivas de linters | `eslint-disable`, `@ts-ignore`, `prettier-ignore` |
| Lógica de negocio | `// Fee waived for users with plan > Pro` |
| Edge cases y workarounds | `// Safari 15 bug: reflow needed here` |
| Restricciones externas | `// PaymentProvider requires max 3 retries` |
| Emojis en JSX/UI | `<button>Submit 🚀</button>` |
| Código comentado | `// const x = oldValue;` |

### Lo que NO hace

- No garantiza evadir detectores de IA basados en metadatos, telemetría o historial de commits.
- No modifica lógica — solo comentarios y strings decorativos.
- No aplica reglas de estilo de prose ni opina sobre redacción.
- No está pensada para incumplir políticas de uso de IA.

---

## Lenguajes soportados

| Lenguaje | Estado |
|----------|--------|
| JavaScript / TypeScript (`.js`, `.ts`, `.jsx`, `.tsx`, `.mjs`, `.cjs`) | ✅ Soportado oficialmente |
| Markdown (`.md`, `.mdx`) | ✅ Soportado (skills de Claude Code) |
| Python | 🧪 Experimental |

Go, PHP y otros lenguajes no están en el roadmap activo hasta tener proyectos reales donde validar el scanner.

---

## Flujo de trabajo

```
/ai-slop-scan       →   detectar patrones sin tocar nada (read-only)
/ai-clean-diff      →   limpiar (por defecto: solo archivos del diff actual)
/ai-clean-confirm   →   validar antes de commitear (paso obligatorio)
```

Cada paso es independiente. El más común en el día a día es `/ai-clean-diff --dry-run` para ver qué cambiaría, y luego `/ai-clean-diff` para aplicarlo.

---

## Skills incluidos

| Skill | Función |
|-------|---------|
| `/ai-slop-scan` | Auditoría read-only: lista findings por categoría con referencias `archivo:línea` |
| `/ai-clean-diff` | Limpieza principal. Flags: `--scope=diff/file/all`, `--only=comments/emojis`, `--dry-run` |
| `/ai-clean-confirm` | Validación post-limpieza: detecta eliminaciones que podrían haber sido significativas |
| `/ai-review-fixtures` | Ayuda a revisar y añadir fixtures de test (no es una suite automatizada) |

Los skills `/ai-clean-comments` y `/ai-remove-emojis` fueron consolidados en `/ai-clean-diff` para evitar duplicación de reglas.

---

## Scanner estático (CI)

El scanner de Python en `.github/scripts/slop_scan.py` implementa las categorías A–E:

```bash
# Scan files changed in git diff
python3 .github/scripts/slop_scan.py --diff

# Scan specific files
python3 .github/scripts/slop_scan.py src/auth/login.ts src/utils/format.ts

# Apply cleanup to a single file (output to stdout)
python3 .github/scripts/slop_scan.py src/auth/login.ts --apply

# JSON output (for CI integration)
python3 .github/scripts/slop_scan.py --diff --json
```

El workflow en `.github/workflows/slop-scan.yml` corre el scanner en cada PR sobre los archivos JS/TS modificados. Es informacional por defecto — no bloquea el merge. Para convertirlo en gate duro, cambiar `continue-on-error: true` a `false`.

### Tests

```bash
bash tests/run.sh
```

Diff-based: aplica el scanner sobre cada `tests/fixtures/*.input.ts` y compara con `*.expected.ts`. 2 fixtures ahora, fácil de extender.

---

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/NicoENDYs/ai-slop-cleaner.git
   cd ai-slop-cleaner
   ```

2. Copia los skills a tu proyecto:
   ```bash
   mkdir -p .claude/skills
   cp -r skills/* .claude/skills/
   ```

   O a nivel de usuario (disponibles en todos tus proyectos):
   ```bash
   mkdir -p ~/.claude/skills
   cp -r skills/* ~/.claude/skills/
   ```

3. Reinicia Claude Code.

### Configuración por proyecto (opcional)

Copia `config/default.json` a la raíz de tu proyecto como `.ai-slop-cleaner.json`:

```bash
cp config/default.json .ai-slop-cleaner.json
```

Ejemplo de personalización:
```json
{
  "scope": "diff",
  "dryRun": false,
  "perDirectory": {
    "docs/": { "removeRedundantComments": false },
    "tests/": { "removeDebugLabels": false }
  }
}
```

---

## Ejemplos antes/después

### Comentarios redundantes

**Antes:**
```typescript
// This function is responsible for incrementing the counter by one
function increment() {
  // increment counter
  counter++;
  // return the result
  return counter;
}
```

**Después:**
```typescript
function increment() {
  counter++;
  return counter;
}
```

### Emojis en logs

**Antes:**
```typescript
// 🚀 Auth module setup
console.log("User authenticated 🎉", user);
console.warn("Missing field ⚠️");
```

**Después:**
```typescript
// Auth module setup
console.log("User authenticated", user);
console.warn("Missing field");
```

### Qué no toca

```typescript
// TODO: add pagination when list grows large     ← conservado
// eslint-disable-next-line @typescript-eslint/no-explicit-any  ← conservado
// Fee waived for users with plan > Pro           ← conservado (regla de negocio)
<button>Submit 🚀</button>                        ← emoji conservado (JSX)
```

Ver más en [`examples/`](./examples/) y [`tests/fixtures/`](./tests/fixtures/).

---

## Cuándo NO usar este repo

- Si la solución real es revisar más antes de commitear. El cleaner no reemplaza el juicio sobre qué código merece estar en el repo.
- Si tu equipo no tiene el problema de slop — algunos estilos de trabajo con IA ya producen código limpio. No agrega valor si no hay señal.
- Si tu proyecto ya tiene un linter configurado que cubre el 80% de esto. Evitar redundancia.
- Si necesitas que el resultado "pase como humano" ante algún evaluador. Esta herramienta no funciona para eso ni está pensada para eso.

---

## Roadmap

- [x] Skills de limpieza de comentarios y emojis
- [x] Skill de scan (detectar sin modificar)
- [x] Modo diff (limpieza solo sobre cambios recientes)
- [x] Dry-run (ver diff antes de editar)
- [x] Configuración por proyecto
- [x] Scanner estático en Python con tests de regresión
- [x] CI en GitHub Actions
- [ ] Soporte para Python (experimental → estable)
- [ ] Modo `--apply` que escribe directamente al archivo (no solo stdout)
- [ ] Integración con pre-commit hooks

---

## Créditos e inspiración

- Extensiones VS Code: *Emoji Eraser*, *Markdown Stupefy*.
- Skills: `ai-code-cleanup`, `deslop`, *Code Cleanup & Slop Remover*.
- La discusión creciente sobre calidad de código en proyectos asistidos por IA.

---

## Licencia

MIT
