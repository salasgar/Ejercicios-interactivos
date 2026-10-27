# Entrega de la tarea 84 · Dos signos seguidos
Sesión `s-20261025T000326-ab2c42a8`. Commit del código: **c3470d9**.

Ficheros: `practicas/dos-signos/{logica,textos,practica}.js`, `estilos.css`, `index.html` (enlaza estilos), `tests/practicas-dos-signos.test.js` (12 tests, 3000 ítems por ejercicio).

Ejercicios y destrezas: 1 Un solo signo (U3-2C-07; elige el signo y escribe el resultado, forma `−(−9)` y `5 − (−3)`) · 2 Sumar o restar un negativo (U3-2C-05, 06; elige la reescritura y calcula) · 3 Quita los paréntesis y calcula (U3-2C-08; fichas de signo, 3-5 números) · 4 ¿Cuál está bien escrita? (U3-2C-10; 3 opciones, una sola con paréntesis).

Cotas de realismo (sin contexto, solo cuentas): primer número 1-20 (ej. 2: a veces −20…−1), número entre paréntesis 1-9, resultado siempre entre −30 y 30 (test).

Cómo probarlo: `npm run servir` → http://localhost:8080/practicas/dos-signos/ con el código 60 (7NPD). **No probada en navegador** (la extensión de Chrome no estaba conectada); solo tests.

## Reabierta del 2026-10-25 (sesión `s-20261026T212311-134b68ba`, commit **1529486**)
Arreglado: (1) ej. 3, el «Comprobar» del segundo paso responde al clic y se oculta al responder (`pedirResultado` toma el último `.comprobar` de la zona, no el primero, que era el «Comprobar los signos» ya oculto); (2) ej. 1, el feedback de un fallo empieza en mayúscula en es y en. Dos tests nuevos (14 propios en total). **Probada en navegador** (Chrome headless por CDP, 375 px, es y en, con clics): ej. 3 acierta con clic y el botón se oculta; ej. 1 con fallo muestra «No es correcto. Los signos son distintos…» / «That is not correct. The signs are the same…»; sin errores en consola. Sin tocar `catalogo.js`.
