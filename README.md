# AI Slop Cleaner for Claude Code

Pack de skills para Claude Code que limpian artefactos típicos de código generado por IA en proyectos JavaScript/TypeScript y React/Vite: emojis, comentarios obvios, disclaimers y ruido de depuración, sin modificar la lógica de negocio.

> ⚠️ **Uso ético:** Esta herramienta no está pensada para engañar en entornos académicos o profesionales donde el uso de IA esté restringido. Su objetivo es mejorar la calidad y legibilidad del código, no falsificar autoría ni evadir detectores basados en metadatos.

---

## Motivación

El uso de copilotos de código (Claude Code, Copilot, ChatGPT, etc.) ha traído un nuevo tipo de "slop" al repositorio:

- Emojis como `😂🔥💀` en comentarios, logs y hasta en commits.
- Comentarios que repiten exactamente lo que hace la línea siguiente (`// increment counter` encima de `counter++`).
- Bloques enormes de comentarios genéricos tipo *"This function is responsible for…"* que no aportan contexto real.
- Debug leftovers: `console.log`, `print`, etc. que nunca se limpiaron después de probar algo con IA.
- Estilo inconsistente, defensivo en exceso y lleno de type hacks provenientes de prompts excesivamente conservadores.

Ya existen herramientas que atacan partes de este problema: extensiones de VS Code, skills de limpieza en Smithery/MCP, linters que detectan slop. Este repo se enfoca específicamente en **Claude Code + JS/TS/React**: skills pensadas para correr dentro del flujo de trabajo de Claude Code, sobre el archivo actual o el diff de git.

---

## Objetivos

- Quitar señales obvias de código generado por IA (emojis, disclaimers, comentarios redundantes).
- Mantener y respetar:
  - Comentarios útiles de negocio y edge cases.
  - `TODO`/`FIXME` y notas de mantenimiento reales.
  - Directivas de linters y formateadores (`eslint-disable`, `@ts-ignore`, `prettier-ignore`, etc.).
- No cambiar la lógica ni el comportamiento del código.
- Integrarse bien con el flujo de Claude Code y proyectos JS/TS + React/Vite.

---

## Qué NO hace

- No garantiza evadir detectores de IA basados en metadatos, telemetría o historial de commits.
- No genera código desde cero; se usa *después* de haber trabajado con un copiloto para limpiar el resultado.
- No está pensada para saltarse normas académicas o empresariales donde esté prohibido el uso de IA.

---

## Skills incluidos

### `/ai-clean-comments`

Limpia comentarios obvios y artefactos textuales típicos de IA sin tocar la lógica.

**Elimina:**
- Comentarios que repiten literalmente la línea siguiente.
- Plantillas: *"This function is responsible for…"*, *"In this code we will…"*, *"As an AI…"*
- Bloques JSDoc inflados para funciones triviales.
- Comentarios de depuración: `// debug`, `// temp`, `// temporary test`.

**Conserva:**
- `TODO`, `FIXME`, `HACK`, `NOTE` reales.
- Directivas de herramientas (`eslint-disable`, `@ts-ignore`, `prettier-ignore`, `biome-ignore`, etc.).
- Comentarios sobre lógica de negocio, decisiones de diseño o edge cases no obvios.

### `/ai-remove-emojis`

Elimina emojis y símbolos decorativos de código y comentarios sin romper la estructura ni la indentación.

**Elimina:**
- Emojis en comentarios.
- Emojis en `console.log`/`console.warn`/`console.error` que no son strings de UI final.

**Conserva:**
- Strings claramente UI (e.g., `<p>Listo ✅</p>` en JSX).
- Puntuación y caracteres especiales funcionales.
- Formato e indentación.

### `/ai-clean-diff`

Aplica las reglas de los dos skills anteriores, pero **solo sobre los archivos y líneas modificadas** en el diff actual de git. Ideal para sesiones largas donde no quieres reescribir código legacy estabilizado.

---

## Instalación

1. Asegúrate de tener [Claude Code](https://claude.ai/code) instalado.
2. Clona este repositorio:
   ```bash
   git clone https://github.com/NicoENDYs/ai-slop-cleaner.git
   cd ai-slop-cleaner
   ```
3. Copia los skills a la carpeta de skills de tu proyecto o de usuario:
   ```bash
   # En tu proyecto (solo para ese repo)
   mkdir -p .claude/skills
   cp -r skills/* .claude/skills/

   # O a nivel de usuario (disponible en todos tus proyectos)
   mkdir -p ~/.claude/skills
   cp -r skills/* ~/.claude/skills/
   ```
4. Reinicia Claude Code para que detecte los nuevos skills.

> **Nota:** La ruta exacta puede variar según tu versión de Claude Code. Consulta la [documentación oficial](https://claude.ai/code/docs) y ajusta las rutas si es necesario.

---

## Uso

Dentro de Claude Code, usa los skills con estos prompts:

```
/ai-clean-comments
```
Limpia comentarios redundantes y de IA en el archivo actual, manteniendo TODOs y directivas de linters.

```
/ai-remove-emojis
```
Elimina emojis de comentarios y logs sin cambiar la lógica.

```
/ai-clean-diff
```
Revisa solo los cambios recientes de git y quita slop de IA (comentarios obvios, emojis, debug leftovers).

---

## Ejemplos antes/después

### Comentarios obvios

**Antes:**
```typescript
// This function is responsible for incrementing the counter by one
function increment() {
  // increment counter by 1
  counter++;
}
```

**Después:**
```typescript
function increment() {
  counter++;
}
```

### Emojis y debug leftovers

**Antes:**
```typescript
// Temporary debug 😂
console.log("User fetched 🔥", user);
```

**Después:**
```typescript
console.log("User fetched", user);
```

Ver más ejemplos en [`examples/`](./examples/).

---

## Roadmap

- [ ] Configuración por proyecto (archivos de reglas para decidir qué patrones eliminar o mantener).
- [ ] Soporte extendido para Python, Go, PHP manteniendo el foco en post-proceso de IA.
- [ ] Modo "dry-run" que devuelva un diff anotado en vez de reescribir directamente.
- [ ] Integración con Git Hooks / GitHub Actions para ejecutar limpieza en pre-commit o en CI.

---

## Créditos e inspiración

Este proyecto se inspira en el trabajo de la comunidad:

- Extensiones VS Code como *Emoji Eraser* y *Markdown Stupefy*.
- Skills de limpieza como `ai-code-cleanup`, `deslop` y *Code Cleanup & Slop Remover*.
- La discusión creciente sobre calidad de código en proyectos asistidos por IA.

---

## Licencia

MIT
