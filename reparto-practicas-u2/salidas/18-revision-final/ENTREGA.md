# Entrega — Tarea 18: revisión final, portada, README y documentación

Sesión: `s-20261008T051928-1cba9950` · Commit del código: `f7df3ba`

## Ficheros entregados (git show --stat f7df3ba: 5 ficheros)

- `practicas/_comun/catalogo.js` — solo el campo `disponible` (y el comentario que lo explica): `true` en 20 prácticas, `false` en 11.
- `practicas/portada.js` y `practicas/index.html` — portada por semanas de la unidad, con una línea por práctica y el panel del profesor al pie.
- `README.md` — apartado «Prácticas de la unidad 2» con la tabla de las 31, y el de `divisores/` puesto al día (estaba descrito como antes de migrarlo).
- `docs/practicas-unidad2.md` (nuevo) — contrato de la base, cómo se añade una práctica, cómo lee el profesor los resultados y tabla destreza → práctica.

## Lo demás que deja esta tarea

- `VEREDICTO.md` — 3 prácticas SE ENTREGAN (divisores, arbol, venn) y 28 NO SE ENTREGAN: 11 con hallazgo grave (no enlazadas desde la portada) y 17 con hallazgos menores (enlazadas).
- `HALLAZGOS-FUERA-DE-CRITERIO.md` — 12 decisiones para Juan Luis, 4 arreglos que pide la base, ejercicios que se aprueban sin pensar, desvíos de las fichas, solapes y destrezas sin cubrir.
- 28 reaperturas en `hechos/reabiertas/NN--s-20261008T051928-1cba9950.md` (tareas 02, 03, 04, 05, 07, 08, 10, 11, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32 y 33), cada una con lo exacto que hay que corregir y lo que no hay que rehacer.

## Cómo probarlo en un minuto

`npm run servir` y http://localhost:8080/practicas/?c=SF3A : seis bloques (semanas 1 a 4, vocabulario, repaso de la unidad 1), 20 prácticas, cada una con su línea y su botón «Abrir»; ES/EN arriba; «Panel del profesor» al pie. `npm test`: 576 de 576.

## Qué no se ha hecho

- Los 15 ítems a mano por ejercicio en el navegador que pedía la ficha: sustituidos por la lectura completa del código y los bancos y por el muestreo de los generadores (ver «Cómo se ha revisado» en el veredicto).
- Probar en un móvil de verdad (arrastre con el dedo, voz).
- No se ha corregido nada dentro de `practicas/<slug>/` ni de `divisores/`: va todo a las reaperturas.
- La tarea no tiene test propio. La portada exporta `BLOQUES`, `DESCRIPCION` y `bloquesPublicados`; comprobado a mano que los bloques cubren las 31 sin repetir y que los 20 enlaces arrancan.
