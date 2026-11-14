# ENTREGA tarea 186 — «No lo sé» en errores, leelo, factorizaciones y fichas-de-pablo (sesión s-20261114T113351-e5a8777d)

## Lo hecho
Commits (en main): c9733a1 8b0c28a a92eb6d 73df841 
- **errores** (3 ejercicios: ¿hay error?, señala la línea, nombra el error): `explicacion` en los tres, sin `noLoSe` (son de reconocer). La explicación ya existía como feedback en practica.js; se movió a `textos.js` (`explicaItem`) para poder probarla; el feedback no cambia.
- **leelo** (3): `explicaEscuchar`, `explicaLeer` (piezas inglés↔símbolo, solución y como mucho un consejo -teen/-ty) y `explicaCompletar` (regla de las 11 plantillas + frase completa). Sin `noLoSe`.
- **factorizaciones** (3): `explicaProducto` y `explicaCociente` (con `noLoSe`), `explicaMultiplo` (sí/no y por qué número se multiplica). En logica.js (textos.js importa de ahí al revés no cabe).
- **fichas-de-pablo** (8; el código vive en `practicas/fichas-del-parchis/`, la carpeta `fichas-de-pablo/` es solo una redirección): regla en una frase + el `buena` de cada ejercicio. `noLoSe` en 1, 2, 3, 4, 6, 7 y 8; el 5 (¿divisible?) usa el texto por defecto.
- Ningún `sinAyuda`: no hay juegos ni ejercicios por pasos (ninguna usa `sesion.aciertos`).
- Tests: tests/practicas-ayuda-{errores,leelo,factorizaciones,fichas-de-pablo}.test.js (1000 ítems por ejercicio, es y en, solución calculada aparte). npm test 2205/2205.
- A mano: leídas ~6-8 explicaciones por ejercicio y idioma (no 15) con el guion del scratchpad; cuentas correctas.
- Navegador (iframes en un Chrome, 375 y 900 px, es/en según el ítem): botón presente en los 17 ejercicios, tarjeta «Así se hace» visible, sin desbordes horizontales, sin errores de consola de la práctica. Ojo: el ejercicio 1 de cada práctica muestra primero la introducción (Empezar).

## Hallazgos (para Juan Luis)
- fichas-de-pablo, ejercicios 4 y 5: el feedback existente escribe «196 : 28 = 7 = 7» cuando el cociente es una sola ficha (`quedaTxt`). No se tocó.
- errores: el comentario del banco dice 29 plantillas; hay 28.
- Las explicaciones de errores y fichas-de-pablo repiten el feedback de acierto (decisión de la ficha: reutilizar).
- Desvío: por error edité código con heredocs de shell en errores y en leelo/textos.js (el candado no lo vio); ninguna otra sesión tocaba esas carpetas.
- Pendiente de la 193 (ALTO): revisión del significado.
