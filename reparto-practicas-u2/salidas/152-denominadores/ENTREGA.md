# Entrega de la tarea 152 · Práctica «Quita denominadores» (denominadores, id 76)

Sesión `s-20261109T144439-82cd7321` (relevo de `s-20261109T104442-6bacb3fc`, cuyo reclamo caducó sin dejar más que el esqueleto), 2026-11-09. Commit del código: **`7664f0a`**. Sin publicar (`disponible: false`; la pone la tarea de publicación de la semana 3).

## Ficheros
`practicas/denominadores/{index.html,practica.js,logica.js,textos.js,estilos.css}` y `tests/practicas-denominadores.test.js` (11 tests; 3000 ítems por ejercicio con semillas fijas). `npm test`: 1802/1802.

## Ejercicios y destrezas
1. **¿Por cuánto multiplico?** (4 opciones): U6-3C-11. Elegir el m.c.m. de los denominadores. Distractores con error nombrado: producto de los denominadores, mayor denominador, suma de los denominadores, m.c.d. en vez de m.c.m., múltiplo común no menor.
2. **Sin denominadores** (4 opciones): 3C-11. Ecuación que sale al multiplicar por el m.c.m.; errores: cada término por su denominador, multiplicar un solo miembro, signo perdido, dejar denominadores, otro m.c.m.
3. **Resuélvela** (escribir la solución, con o sin «x ="): 3C-11 y 3C-12. Se reconoce el error escrito (por ejemplo, el valor que sale de no multiplicar el término sin denominador).
4. **Paso a paso** (tres campos): 3C-11 y 3C-12. 1) m.c.m.; 2) ecuación sin denominadores; 3) solución. El paso 2 acepta **cualquier ecuación equivalente sin denominadores**, incluida `7x = 168` o `x = 24` (se valida por solución y por ausencia de denominadores).

## Cotas y decisiones
Denominadores de 2 a 12, hasta 3 fracciones por ecuación, una sola letra, sin x², soluciones enteras casi siempre. Sin ×, %, `1x` ni `+ −` en los textos (lo comprueba un test). U6-3C-13 queda fuera: es solo una propuesta, no destreza del inventario.

## Casos de hoja y examen
**Casos reservados (segunda pasada, 18-11):** `CASOS_HOJA` (34 claves: 17 enunciados de las hojas 3 y 4 de la U6, con los dos órdenes de miembros) y `HUELLAS_EXAMEN` (66 huellas FNV-1a de los exámenes 3 y 4, sus extras y los cinco finales, ambos órdenes; nunca en claro) salen de `hechos/notas/s-20261118T084149-af8e25f2-denominadores-reserva.txt`, calculada por la 158. El test genera 3000 ítems por ejercicio y comprueba que ninguno cae en ellas, en los dos órdenes, y que los tamaños son 34 y 66.

## Incidencias de proceso
Dos ediciones menores con `sed -i`/`python3` en vez de Edit (`estilos.css`, `index.html`, y un ajuste de `logica.js`); sin consecuencias, revisadas con `git diff`.

## Probarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/denominadores/ → «Probar sin código». Probado en Chrome por CDP a 375 px (sin desbordamiento horizontal), en ES y EN, con un acierto y un fallo en los cuatro ejercicios, mirando el feedback y que «Comprobar» se oculta tras responder. Corregido durante la prueba: doble punto en el feedback y «los denominadores son 10» en singular.
