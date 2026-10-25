# Entrega de la tarea 81 · «Opuesto y valor absoluto» (opuestos)

Sesión `s-20261024T235904-7d83dc11`. Commit del código: **79eb010**. URL local: http://localhost:8080/practicas/opuestos/ (código 60, `7NPD`, o «Probar sin código»). `disponible: false` hasta la tarea 93.

## Ficheros
`practicas/opuestos/{logica,textos,practica}.js`, `estilos.css`, `index.html` (enlaza el css) y `tests/practicas-opuestos.test.js` (11 tests, 3000 ítems por ejercicio).

## Ejercicios y destrezas
1. **El opuesto** (U3-1C-07): recta de −10 a 10; 2/3 «toca el opuesto de n» (n de −9 a 9, sin 0) y 1/3 «¿cuánto es −(n)?» con n negativo, escribiendo con `campoEntero`. Errores: sin-cambiar-el-signo, opuesto-del-opuesto (−(−9) = −9), opuesto-incorrecto.
2. **Distancia al cero** (U3-1C-08): punto en la recta, se escribe |n| = □; tras responder, el salto hasta el 0. n de −10 a 10 (≈55 % negativos; el 0, 1 de cada 12). Error: valor-absoluto-negativo (|−4| = −4), distancia-incorrecta.
3. **Opuesto y valor absoluto** (U3-1C-09): dos huecos para un n de ±1 a ±20, mitad y mitad. Ninguna pregunta de elegir «¿opuesto o valor absoluto?». Tras fallar, recta con n y −n (de −20 a 20 de 2 en 2 si |n| > 10). Errores: opuesto-del-opuesto, sin-cambiar-el-signo, valor-absoluto-negativo, absoluto-como-opuesto, distancia-incorrecta.
4. **¿Quiénes están a esa distancia?** (U3-1C-10): mitad «marca todos los enteros cuyo valor absoluto es k» (k de 1 a 10, hay que marcar k y −k; error solo-uno / marca-mal, con «Falta otro») y mitad «¿cuál es mayor, a o b?» con dos negativos distintos de −1 a −10 (error compara-como-naturales). Sin letra x.

## Cotas
Todo dentro de la recta dibujada (el test lo comprueba): ±10 en los ejercicios 1, 2 y 4; ±20 en el 3. No hay contextos con unidades.

## Probado
Chrome headless a 375 px (CDP, sin la extensión de Chrome) sobre una copia limpia de HEAD con los ficheros propios (el árbol compartido tenía la base a medias por otra sesión): cada ejercicio con un fallo, en español; sin errores de consola. Los aciertos y el inglés no se probaron a mano en esta práctica (el inglés sí en la 80).

## Aviso
`npm test` completo: 6 fallos en `tests/practicas-comun.test.js` (y los de espacio/nube/migración), todos de ficheros de la base que otra sesión (la 71, reclamo vivo) tiene a medias sin commit. No son de esta tarea: mis dos ficheros de test pasan 26/26.
