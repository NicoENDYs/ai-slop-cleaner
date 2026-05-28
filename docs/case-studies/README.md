# Case Studies

Resultados reales del scanner sobre proyectos propios. Cada case study documenta: número de findings por categoría, falsos positivos encontrados, tiempo de revisión manual y una conclusión honesta sobre el ratio señal/ruido.

## Template para nuevos case studies

Crea un archivo `docs/case-studies/<nombre-proyecto>.md` con esta estructura:

```markdown
# Case Study: <Nombre del proyecto>

**Fecha:** YYYY-MM-DD
**Stack:** TypeScript + React / Python / etc.
**Tamaño del scan:** X archivos, Y líneas

## Comando ejecutado

\`\`\`bash
python3 .github/scripts/slop_scan.py --diff   # o --scope=all
\`\`\`

## Findings por categoría

| Categoría | Findings | Falsos positivos | Ratio señal |
|-----------|----------|-----------------|-------------|
| A — Redundant comments | X | Y | Z% |
| B — Template phrases | X | Y | Z% |
| C — AI meta-phrases | X | Y | Z% |
| D — Debug labels | X | Y | Z% |
| E — Emojis non-UI | X | Y | Z% |
| **Total** | **X** | **Y** | **Z%** |

## Falsos positivos notables

Describe 2–3 casos donde el scanner marcó algo que debería haberse conservado. Incluye el texto exacto y por qué no era ruido.

## Tiempo de revisión

- Scan: X segundos
- Revisión manual del diff (/ai-clean-confirm): X minutos
- Restauraciones: X comentarios restaurados de Y eliminados

## Conclusión

Una o dos frases honestas: ¿valió la pena? ¿qué mejoraría del scanner?
```

## Por qué documentar esto

Sin números reales, el repo es teoría. Con case studies, es evidencia. Para un empleador o colaborador que revisa el repositorio, un análisis con ratio señal/ruido cuenta más que tres skills bien documentadas que nadie ha medido.

## Estado actual

No hay case studies publicados todavía. El primer paso es correr el scanner sobre un proyecto real con código asistido por IA reciente y documentar honestamente los resultados.
