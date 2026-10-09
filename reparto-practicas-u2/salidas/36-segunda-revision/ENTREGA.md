# Entrega — Tarea 36: segunda revisión de las 28 reaperturas

Sesión: `s-20261009T082156-0a34d7a4` · Commit del código: `17a9e5c` · Revisado sobre `8279d74`

## Ficheros entregados (git show --stat 17a9e5c: 1 fichero)

- `practicas/_comun/catalogo.js` — solo `disponible: false` en la fila id 4 (criba).

## Lo demás que deja esta tarea

- `VEREDICTO.md` — 14 SE ENTREGAN (02, 04, 07, 08, 15, 19, 21, 22, 23, 25, 28, 29, 31, 32) y 14
  NO SE ENTREGAN: 1 grave y retirada de la portada (05 criba) y 13 menores que siguen enlazadas
  (03, 10, 11, 12, 13, 14, 16, 20, 24, 26, 27, 30, 33).
- `HALLAZGOS-FUERA-DE-CRITERIO.md` — 4 decisiones para Juan Luis, tres arreglos de base que no
  están en la ficha de la 37 y notas sobre los tests.
- 14 reaperturas en `hechos/reabiertas/NN--s-20261009T082156-0a34d7a4.md`.

## Cómo probarlo en un minuto

`npm run servir` y http://localhost:8080/practicas/ : la criba ya no aparece en la portada (se
sigue abriendo por http://localhost:8080/practicas/criba/, donde el ejercicio 3 enseña la opción
«hasta la mitad de undefined»). `npm test`: 648 de 648.

## Qué no se ha hecho

- No se ha corregido nada dentro de `practicas/<slug>/`, `divisores/` ni `tests/`.
- No se ha probado en un móvil de verdad (arrastre con el dedo, voz); la pantalla se midió con
  Chrome sin ventana a 375 × 667 en 13 prácticas.
- El veredicto se puso al día al cerrar con las ocho reaperturas de decisiones del 9-10, que
  llegaron mientras la revisión corría (último apartado de `VEREDICTO.md`).
- La tarea no tiene test propio.
