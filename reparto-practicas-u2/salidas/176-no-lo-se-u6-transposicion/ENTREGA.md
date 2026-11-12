# Entrega de la tarea 176: «No lo sé» en la unidad 6 (transposicion, resuelve, parentesis-algebra, denominadores)

## Lo hecho
Commits: transposicion e00af69; resuelve d9a2186; parentesis-algebra 88da729; denominadores 59a615a.

- **transposicion** (5 ejercicios): `explicaConNumeros`, `explicaUnaOperacion`, `explicaDosOperaciones`, `explicaFrente`, `explicaComprueba` en `textos.js`. `noLoSe` en los ej. 1-4; el ej. 5 (¿está bien?) es de elegir y no lo lleva.
- **resuelve** (4 ejercicios): módulo nuevo `ayuda.js` (los ayudantes de la comprobación se movieron de `practica.js` sin cambiar su comportamiento). `noLoSe` en los ej. 2 y 3.
- **parentesis-algebra** (4): módulo nuevo `ayuda.js`; las explicaciones reutilizan `solucion`/`explicacion` del generador y cierran con «La respuesta es …». `noLoSe` en el ej. 1 (quita) y el 3 (resuelve).
- **denominadores** (4): módulo nuevo `ayuda.js`, igual criterio. `noLoSe` en el ej. 3 (resuelve) y el 4 (paso a paso).
- Ningún `sinAyuda`. Tests: `tests/practicas-ayuda-{transposicion,resuelve,parentesis-algebra,denominadores}.test.js` (1000 ítems por ejercicio, dos idiomas) y los cuatro «No lo sé en …» de `practicas-no-lo-se.test.js`; `npm test` 1938/1938.
- Leídas a mano varias explicaciones por ejercicio en los dos idiomas. **No se probó en el navegador** (sesión automática sin navegador; falta el paso 6 de la ficha).

## Hallazgos
- resuelve, ej. 3: la comprobación en inglés llevaba la «y» en español fijada en el código; ahora sale de `TX.ej3.y`. Toca texto ya existente del feedback.
- parentesis-algebra ej. 3 y denominadores ej. 3: la explicación heredada ya dice «La solución es …»; con mi cierre «La respuesta es x = …» queda algo redundante.
- Dos ediciones de código se hicieron con python/heredoc desde el shell y no con Edit (ver `hechos/incidencias/`).
