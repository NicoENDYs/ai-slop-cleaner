# Aviso ético y límites de uso

## Para qué está pensado este proyecto

`ai-slop-cleaner` es una herramienta de **calidad de código**. Su propósito es eliminar el ruido textual que introduce el uso intensivo de copilotos de IA: comentarios redundantes, emojis decorativos, frases genéricas de plantilla y logs de depuración olvidados.

El objetivo final es que el código sea más legible, más fácil de revisar en code reviews, y más consistente con el estilo del equipo.

## Para qué NO está pensado

### Falsificación de autoría
Esta herramienta **no ayuda a hacer pasar código generado por IA como trabajo humano** con el propósito de engañar a evaluadores, clientes, profesores o empleadores.

Limpiar comentarios ruidosos es distinto a falsificar la autoría de un artefacto. La herramienta opera sobre el contenido visible del código; no altera metadatos de git, historial de commits, telemetría de editores, ni ningún otro rastro de uso de IA.

### Evasión de detectores basados en metadatos
Existen detectores de uso de IA que analizan datos que esta herramienta no toca:
- Historial de commits y tiempos entre commits.
- Telemetría de editores (Copilot, Claude Code, etc.).
- Patrones estadísticos en el código fuente.
- Datos de GitHub Copilot o similares.

**Esta herramienta no modifica ninguno de esos datos.** No es efectiva ni está pensada para evadir ese tipo de análisis.

### Incumplimiento de políticas académicas o laborales
Si tu universidad, bootcamp, empresa o cliente tiene políticas sobre el uso de IA en el trabajo que entregas, esta herramienta no es una forma de eludir esas políticas. Usarla con ese fin va contra el espíritu del proyecto y es responsabilidad exclusiva del usuario.

## Quién debería usarlo

- Desarrolladores que usan IA como asistente de productividad y quieren revisar y limpiar el resultado antes de hacer commit.
- Equipos que quieren mantener un estilo de código consistente independientemente de qué herramienta generó el borrador inicial.
- Proyectos que quieren reducir el "debt" de comentarios y decoración visual acumulados en sesiones largas con copilotos.

## Resumen

| | ¿Lo hace esta herramienta? |
|---|---|
| Limpiar comentarios redundantes | ✅ Sí |
| Quitar emojis decorativos de código | ✅ Sí |
| Mejorar legibilidad del código | ✅ Sí |
| Alterar metadatos de git | ❌ No |
| Modificar historial de commits | ❌ No |
| Evadir telemetría de editores | ❌ No |
| Garantizar que el código pase como "no generado por IA" | ❌ No |
| Reemplazar la responsabilidad del desarrollador sobre su código | ❌ No |
