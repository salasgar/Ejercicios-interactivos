# Entrega tarea 23 · División entera: cajas y resto

Commit: b8577a5 · Sesión: s-20261008T050250-c37a11e9 (relevó a s-20261007T214947-e0ab035d, que dejó logica.js y el test)
Ficheros: practicas/division/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-division.test.js
URL local: http://localhost:8080/practicas/division/ (npm run servir) · «Probar sin código»

Ejercicios: 1 Reparte en cajas (2C-01..03, 2C-07) · 2 La prueba y la prueba inversa (2C-04..06) ·
3 ¿Qué significa el resto? (2C-08, 2C-09, 4C-11, 4C-12) · 4 ¿Puede ser? (resto menor que el divisor).
Vocabulario 2B-04/05/15/17-19/25 en los textos ES/EN.
Probar en 1 minuto: entrar sin código, llenar cajas hasta que se desactive el botón, escribir cociente y resto.
Verificado en navegador (386 px, ES/EN): los cuatro ejercicios aciertan y fallan sin errores de consola ni desbordamiento.
Catálogo: petición a la 18 de poner disponible:true para «division» (id 20).

## Reabierta del 14-11 (sobra-1) · s-20261114T230323-cbe431d2 · commit 7e1ef72
- `TX.cajas.correcto` con singular/plural y resto 0 («Hay 1 caja llena y sobra 1», «Hay 2 cajas llenas y no sobra ninguno»; «There is 1 full box and 1 is left over»).
- Glosa inglesa en `<em>` en `puede.no_puede` y `puede.mal_resto`; la tarjeta del «No lo sé» no se toca.
- Tests nuevos en `tests/practicas-division.test.js` (dos). Generadores sin cambios (solo se tocó textos.js).
- Sin prueba en navegador (375/1200 px) ni comprobación de https://salasgar.github.io/... : no hecho; sin push (ver terminada).
