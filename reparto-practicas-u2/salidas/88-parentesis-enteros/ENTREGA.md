# Entrega de la tarea 88 · Paréntesis y corchetes (parentesis-enteros)

Sesión `s-20261025T000433-78767514`. Commit del código: **71789cb**.

Ficheros: `practicas/parentesis-enteros/{logica,textos,practica}.js`, `estilos.css`, `index.html` (enlaza estilos) y `tests/practicas-parentesis-enteros.test.js` (14 tests, 3000 ítems por ejercicio, evaluador independiente).

## Ejercicios
1. Quita el paréntesis: fichas con signo tocables; errores cambia-con-mas, ignora-el-menos-de-delante, menos-solo-al-primero.
2. Calcula: campo de entero; dos botones de ayuda (opero dentro / quito) que cuentan como pistas; ambas rutas dan lo mismo (test).
3. ¿Al paréntesis o al número?: parejas (potencia del paréntesis o del número; (−a·b)^n frente a −a·b^n) con dos campos, o una cuenta sola con producto/potencia dentro.
4. De dentro afuera: se toca el paréntesis/corchete de más adentro y se escribe su valor; tocar uno con otro dentro es pista, no fallo.
5. Coloca los paréntesis: un par sobre 2+ números seguidos; vale cualquier colocación que dé el resultado (se evalúa, nunca solución guardada).

## Cómo probarlo
`node --test tests/practicas-parentesis-enteros.test.js`. En navegador: `npm run servir` → /practicas/parentesis-enteros/ (con `disponible: false` solo por URL directa).

## Aviso importante
**La interfaz NO se ha probado en navegador** (la extensión de Chrome no estaba conectada); solo `node --check` y la lógica por test. Hay que mirarla a 360 px antes de publicar (la 95).

## Propuestas (no decididas)
- Objetivo de aciertos: ej. 3 → 8 y ej. 4 → 6 (ítems largos); el resto, 10.
- Ej. 5 sin potencias ni divisiones; solo el primer número puede ser negativo.
- No se tocó `catalogo.js` (`disponible: false`): lo pone la 95.
- `npm test` falla ahora en 15 tests ajenos (base.js, nube.js, espacio.js, registro.js, firestore.rules con cambios sin commit de otra sesión); los míos pasan.

## Prueba en navegador (reabierta del 25-10, sesión s-20261025T004418-e8111850)
Chrome headless por CDP (extensión desconectada), «Probar sin código». Un ítem acertado y uno fallado de cada ejercicio, a 375 px (es, en, repetido) y a 1000 px (es, en): **sin desbordes horizontales, sin excepciones en consola, «Comprobar» oculto al responder** en todos los casos. El feedback cita los números del ítem.
Capturas a 375 px en `capturas/` (enunciado, acierto y fallo de cada ejercicio; `ej4-mitad` con el segundo estado).
- Ej. 4: tocar un paréntesis con otro dentro avisa («empieza por el de más adentro») sin fallo; el ítem acierta/falla bien.
- **Defecto propio corregido**: en el ej. 5 el signo de operación podía quedarse al final de una línea y su número en la siguiente; ahora cada operador va agrupado con su número (`.grupo`, practica.js y estilos.css).
- Base (no tocada): «No pierdes puntos (estás en 0)» sale tras un fallo con 0 puntos; es el texto de la base.
