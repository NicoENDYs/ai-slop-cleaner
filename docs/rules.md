# Reglas de limpieza

Referencia completa de qué detecta, elimina y conserva cada skill.

## Tabla de patrones

| Categoría | Patrón | Ejemplo | Acción | Skills |
|-----------|--------|---------|--------|--------|
| A | Comentario que repite la línea siguiente | `// return result` encima de `return result` | ❌ Eliminar | scan, ai-clean-comments, ai-clean-diff |
| B | Frase plantilla | `"This function is responsible for…"` | ❌ Eliminar | scan, ai-clean-comments, ai-clean-diff |
| C | Frase meta de IA | `"As an AI…"`, `"AI-generated"` | ❌ Eliminar | scan, ai-clean-comments, ai-clean-diff |
| D | Comentario de debug | `// debug`, `// temp`, `// remove before commit` | ❌ Eliminar | scan, ai-clean-comments, ai-clean-diff |
| E | Emoji en comentario | `// Setup ✅` | ❌ Eliminar | scan, ai-remove-emojis, ai-clean-diff |
| E | Emoji en console.log / console.warn | `console.log("Done 🎉")` | ❌ Eliminar | scan, ai-remove-emojis, ai-clean-diff |
| E | Emoji en mensaje de Error lanzado | `throw new Error("Failed 💥")` | ❌ Eliminar | scan, ai-remove-emojis, ai-clean-diff |
| F | JSDoc inflado en función trivial | 8 líneas de JSDoc para un getter de 2 líneas | ❌ Eliminar | scan, ai-clean-comments |
| — | TODO / FIXME / HACK / NOTE con contexto | `// TODO: add pagination` | ✅ Conservar | todos |
| — | Directiva de linter | `eslint-disable`, `@ts-ignore`, `prettier-ignore` | ✅ Conservar | todos |
| — | Lógica de negocio no obvia | `// Fee waived for users with plan > Pro` | ✅ Conservar | todos |
| — | Edge case o workaround documentado | `// Safari bug: reflow needed before measuring` | ✅ Conservar | todos |
| — | Emoji en string de UI dentro de JSX | `<p>Listo ✅</p>` | ✅ Conservar | ai-remove-emojis |
| — | Símbolo matemático o técnico | `≤`, `≥`, `→`, `©` | ✅ Conservar | ai-remove-emojis |
| — | Código comentado | `// const x = oldValue;` | ✅ Conservar (no tocar) | todos |
| — | Cabecera de licencia | `// Copyright (c) 2024 …` | ✅ Conservar | todos |
| — | JSDoc en API pública exportada con info real | `@param id - must be UUID v4, not integer` | ✅ Conservar | ai-clean-comments |

## Flujo de tres capas

### scan (`/ai-slop-scan`)
Detecta patrones A–F sin modificar archivos. Produce un reporte con referencias `archivo:línea` por categoría.

### cleanup (`/ai-clean-comments`, `/ai-remove-emojis`, `/ai-clean-diff`)
Elimina los patrones A–F según las reglas arriba. Soporta `--dry-run` para ver el diff antes de aplicar cambios. Respeta la configuración en `.ai-slop-cleaner.json`.

### review (`/ai-slop-review`)
Revisa el diff post-limpieza en busca de eliminaciones que podrían haber sido significativas (límites numéricos, referencias a contratos externos, directivas de herramientas eliminadas por error).

## Notas de diseño

### Principio de conservación por defecto
Cuando un comentario no encaja claramente en la lista de "eliminar", se conserva. El objetivo es quitar ruido obvio, no reescribir el historial de decisiones del equipo.

### Código comentado ≠ comentario de código
Líneas de código desactivadas con `//` no se eliminan automáticamente. Para limpiar código comentado, el usuario debe pedirlo explícitamente.

### Directivas de herramientas: prioridad absoluta
Las directivas (`eslint-disable`, `@ts-ignore`, etc.) nunca se tocan, sin importar su posición o contenido. Eliminarlas puede romper el build o introducir errores de tipo.

### Scope: diff por defecto
Todos los skills de limpieza operan sobre los archivos modificados en el diff actual por defecto, no sobre todo el repo. Esto protege el código legacy estabilizado. El scope puede cambiarse en `.ai-slop-cleaner.json` o especificándolo en el prompt.

### Configuración por directorio
El archivo `.ai-slop-cleaner.json` permite reglas distintas por carpeta. Por ejemplo, permitir más comentarios en `docs/` y reglas más estrictas en `src/`. Ver [`config/default.json`](../config/default.json) para todas las opciones.
