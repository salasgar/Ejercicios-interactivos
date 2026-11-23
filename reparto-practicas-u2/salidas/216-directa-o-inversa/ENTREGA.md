# ENTREGA · Tarea 216 · «¿Directa, inversa o ninguna?» (directa-o-inversa, U7)

Sesión: s-20261123T124745-ab337dd6. Commit del código: **db09a38**. La 211 está LISTA y el acta de la 02 de la U7
(`inventario-unidad7-revision.md`, 23-11) deja dentro la inversa y la velocidad con marca: la práctica se ha hecho entera.

## Ficheros
- `practicas/directa-o-inversa/logica.js`, `textos.js`, `practica.js` (sustituye el esqueleto), `estilos.css`, `index.html` (enlaza `estilos.css`).
- `tests/practicas-directa-o-inversa.test.js` (3000 ítems por ejercicio, semilla fija) y `tests/practicas-ayuda-directa-o-inversa.test.js` (1000 por ejercicio, es y en).
- No se ha tocado `_comun`, `catalogo.js`, `portada.js`, `registro.js`, `tareas.js` ni los docs; `disponible` sigue en `false` (la 228).

## Los tres ejercicios
1. **Clasifica la situación**: banco de 31 situaciones (11 directas, 10 inversas, 10 «ninguna de las dos») en es/en, cada una con su
   condición («mismo precio», «al mismo ritmo»), las dos magnitudes y dos pares con x2 = 2·x1 que demuestran la clase (en «ninguna»
   desmienten a la vez «el doble» y «la mitad»). Incluye la velocidad y el tiempo (inversa), las páginas leídas y las que quedan, y el taxi
   con bajada de bandera. Tres casillas con `espera: 'boton'`. Error registrado: `<real>-por-<elegida>` (`ninguna-por-inversa`: era ninguna y se dijo inversa).
2. **Clasifica la tabla**: 2 filas, 3-4 columnas, naturales hasta 120, un tercio de cada clase; «ninguna» se reparte entre la que suma,
   la que resta y la que tiene una casilla que no cuadra. Toda tabla lleva una columna doble o triple de otra. El feedback enseña
   cocientes (directa) o productos (inversa) uno por línea; en «ninguna», los productos y solo los cocientes con 2 decimales o menos (nada periódico).
3. **¿Qué planteamiento?**: problema de un paso (directos: naranjas, fresas, harina, leche, coche, gasolinera; inversos: pintores, grifos,
   máquinas, pienso), cuatro cuentas con cuatro valores distintos (fracciones exactas), solo una buena; las opciones enseñan la cuenta, no el
   resultado. Distractores: `inversa-en-directa` / `directa-en-inversa`, `productos-en-linea` y `razonar-sumando` (b ± la diferencia). El feedback empieza por el sentido («De 50 a 10: menos. Con menos sale más (días): es inversa»).
   Contexto `viaje` (horas y minutos) excluido a propósito: sus opciones serían unas cuentas con «h min».

«No lo sé» desde el principio en los tres: pasos en `<ol class="pasos-ayuda">`, cuentas en `<span class="cuenta">`, y última línea «La respuesta es …» / «The answer is …».

## Tests
`practicas-directa-o-inversa` (7) y `practicas-ayuda-directa-o-inversa` (3) en verde; con `practicas-comun` y `practicas-no-lo-se`, 169/169. `npm test`: 2775/2775 (antes del último ajuste de redacción; los 169 se repitieron después).

## Navegador
`npm run servir` + Chrome sin cabeza: cargan las tres pantallas de entrada (`?probar=1&ejercicio=1..3`). **No hay navegador con clics en esta sesión**, así que lo
interactivo no se ha probado con ratón. Sí se ha pintado en un marco de 375 px el enunciado, las tres casillas, la tabla y las cuatro cuentas de cada ejercicio con el HTML real de `textos.js` y los
componentes de `piezas.js`: las tres casillas caben en **una fila** a 375 px (es y en), la tabla cabe y las cuentas van en 2×2. **Falta pasarla una vez a mano** (acertar, fallar, «No lo sé», es/en).

## Casos de hoja y de examen
La hoja de la semana 2 de la U7 (`hoja-unidad7-semana2.tex`) y los casos de examen (`casos-examen-semana2.tsv`) **no existen todavía**, así que no hay nada que excluir.
El banco del ej. 1 y los contextos del ej. 3 son ahora lo que la hoja y el examen deberían evitar o cotejar; cuando existan, hay que excluir sus casos por huella FNV-1a (`huella` de `proporcion.js`).

## Para Juan Luis
- F0 de la U7 sigue sin firmar y el acta puede cambiar: si quitara la inversa o la velocidad, hay que retocar las 10 situaciones inversas del banco.
- Ej. 1: la velocidad y el tiempo van como inversa («un viaje es siempre de la misma distancia»); si prefiere dejarla fuera, se quita la fila `i-velocidad`.
