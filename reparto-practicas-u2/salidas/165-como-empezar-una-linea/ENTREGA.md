# ENTREGA · Tarea 165 · como-empezar en una línea

Sesión `s-20261106T144721-0fd0cab5` (Sonnet 5.5, Medio) · commit **0a1a75b**.

## Qué se hizo
- `docs/practicas-como-empezar.md`: queda con su título y «Esta guía se ha sustituido por [la guía del profesor](practicas-guia-profesor.md).» (era solo en español).
- Enlaces a ella pasados a `practicas-guia-profesor.md`: `README.md` (2) y `docs/practicas-unidad2.md` (3: §0, §9 y el paso de «Mándale…»). `grep -rn practicas-como-empezar` fuera de `reparto-practicas-u2/` ya no da nada.
- `npm test`: 1595/1595.

## Hallazgos para Juan Luis (lo que tenía `como-empezar` y la guía no tiene; no lo he pasado)
- **Por qué 8 y no 4 en la longitud del código**: `como-empezar` explica el riesgo (con 4, alguien con paciencia y conocimientos podría encontrar el código de otro y ver sus resultados, nunca su nombre); la guía solo dice «deja la longitud en 8».
- **«Cargar la plantilla del curso»**: `como-empezar` aclara que, si ya hay tareas, las añade sin tocar las tuyas; la guía no lo dice.
