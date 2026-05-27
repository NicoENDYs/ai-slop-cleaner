# Reglas de limpieza

Referencia completa de qué elimina y qué conserva cada skill.

## Tabla de patrones

| Patrón | Ejemplo | Acción | Skill |
|--------|---------|--------|-------|
| Comentario que repite la línea siguiente | `// return result` encima de `return result` | ❌ Eliminar | ai-clean-comments |
| Frase plantilla | `"This function is responsible for…"` | ❌ Eliminar | ai-clean-comments |
| Frase meta de IA | `"As an AI…"`, `"AI-generated"` | ❌ Eliminar | ai-clean-comments |
| Comentario de debug | `// debug`, `// temp`, `// remove before commit` | ❌ Eliminar | ai-clean-comments |
| JSDoc inflado en función trivial | 10 líneas de JSDoc para un getter de 2 líneas | ❌ Eliminar | ai-clean-comments |
| TODO / FIXME / HACK / NOTE con contexto | `// TODO: add pagination` | ✅ Conservar | ai-clean-comments |
| Directiva de linter | `eslint-disable`, `@ts-ignore`, `prettier-ignore` | ✅ Conservar | ai-clean-comments |
| Lógica de negocio no obvia | `// Fee waived for users with plan > Pro` | ✅ Conservar | ai-clean-comments |
| Edge case o workaround documentado | `// Safari bug: reflow needed before measuring` | ✅ Conservar | ai-clean-comments |
| JSDoc en API pública exportada | `@param`, `@returns` en función exportada | ✅ Conservar | ai-clean-comments |
| Emoji en comentario | `// Setup ✅` | ❌ Eliminar | ai-remove-emojis |
| Emoji en console.log / console.warn | `console.log("Done 🎉")` | ❌ Eliminar | ai-remove-emojis |
| Emoji en mensaje de Error lanzado | `throw new Error("Failed 💥")` | ❌ Eliminar | ai-remove-emojis |
| Emoji en string de UI dentro de JSX | `<p>Listo ✅</p>` | ✅ Conservar | ai-remove-emojis |
| Símbolo matemático o técnico | `≤`, `≥`, `→`, `©` | ✅ Conservar | ai-remove-emojis |
| Código comentado | `// const x = oldValue;` | ✅ Conservar (no tocar) | ambos |
| Cabecera de licencia | `// Copyright (c) 2024 …` | ✅ Conservar | ambos |
| Separador de sección con propósito | `// ─── Exports ────────` | ✅ Conservar | ambos |

## Notas de diseño

### Principio de conservación por defecto
Cuando un comentario no encaja claramente en la lista de "eliminar", se conserva. El objetivo es quitar ruido obvio, no reescribir el historial de decisiones del equipo.

### Código comentado ≠ comentario de código
Líneas de código desactivadas con `//` no se eliminan automáticamente. Pueden representar alternativas descartadas o configuración provisional. Para limpiar código comentado, el usuario debe pedirlo explícitamente.

### Directivas de herramientas: prioridad absoluta
Las directivas (`eslint-disable`, `@ts-ignore`, etc.) nunca se tocan, sin importar su posición o contenido. Eliminarlas puede romper el build o introducir errores de tipo.

### JSDoc en funciones internas vs. exportadas
Para funciones no exportadas o funciones internas de componentes, el JSDoc raramente aporta valor extra sobre un nombre descriptivo. Para funciones exportadas, el JSDoc sí puede ayudar a editores e IDEs que muestran intellisense.
