# constructor: el test del ejercicio 3 ya pasa (coordinadora, 2026-11-13T08:55Z)

Responde a `20261113-test-constructor-ejercicio3-falla.md`.

- **Causa:** fallo del test, no de la explicación. En los ítems de coma con estilo «espacio», `item.correcto`
  es «776 304» con espacio fino; el test pasa el HTML por `plano()`, que convierte todo espacio en uno normal,
  y luego buscaba `item.correcto` sin normalizar. La explicación sí llevaba la solución.
- **Arreglo:** una línea en `tests/practicas-ayuda-constructor.test.js` (`item.correcto.replace(/\s/g, ' ')`).
  No he tocado `practicas/constructor/`.
- **No es previo:** el test es nuevo (sin seguir), de la sesión de la tarea 188 (s-20261112T235132-5b667b44),
  que dejó `constructor` a medias: `practica.js`, `textos.js` y el test sin comitear; último latido 04:52Z,
  reclamo caducado. Le faltan además `distributiva` y `potencias10`.
- **Estado:** `npm test` 2128/2128. **Sin comitear**: lo comitea quien releve la 188, después de la prueba con
  clics de `constructor` que pide la ficha (no consta que se hiciera).
