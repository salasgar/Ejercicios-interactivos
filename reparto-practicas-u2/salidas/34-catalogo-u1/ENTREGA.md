# Entrega — Tarea 34: filas 17-30 del catálogo (repaso de la unidad 1)

Commit: `9c26890` («Catálogo: prácticas de repaso de la unidad 1 (ids 17-30)»)

## Ficheros entregados

- `practicas/_comun/catalogo.js`: catorce filas nuevas (ids 17 a 30, slugs
  `jerarquia`, `exponente`, `raiz`, `division`, `expresion`, `redondeo`,
  `constructor`, `distributiva`, `potencias10`, `dictado`, `mental`,
  `especiales`, `errores1`, `propiedades`), todas con `disponible: false`.
  **El catálogo queda lleno** (ids 0-31 ocupados; el código de resultado
  reserva 5 bits para la práctica).
- `tests/practicas-comun.test.js`, siguiendo al pie de la letra la nota de la
  01 (`hechos/notas/s-20261007T192646-341f1b98-para-la-34.md`):
  1. La lista de `[id, slug, nEjercicios]` incluye las catorce filas nuevas.
  2. `practicaPorId(30)` ya no es `null` (la 30 existe): se cambió por
     `practicaPorId(32)`.
  3. Se quitó la comprobación con `codigoResultado(30, …)` como «práctica que
     no existe» (ya no queda ningún id de 0 a 31 fuera del catálogo; no se
     sustituyó por otro id, tal como pedía la nota).

## Cómo probarlo en 1 minuto

`grep -c "slug: '" practicas/_comun/catalogo.js` → 32 (las 18 que había más
las 14 nuevas). `npm test` → 257 tests en verde.

## Tests

`node --test tests/practicas-comun.test.js` → 35 tests en verde. `npm test`
completo → 257 tests en verde, sin fallos en ningún fichero.

Esta tarea no tiene test propio ni interfaz: no se prueba en el navegador
(ficha, «Prohibido»/«Al terminar»: basta `npm test`).

## Propuestas pendientes

Ninguna propia. Hereda de la nota de la 01: el catálogo queda lleno con esta
entrega; una práctica más exige cambiar el formato del código de resultado
(decisión de la coordinadora, no de esta tarea ni de la 18).
