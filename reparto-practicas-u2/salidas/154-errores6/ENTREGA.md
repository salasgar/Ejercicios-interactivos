# Entrega de la tarea 154 · «Caza el error» de la unidad 6 (errores6)

Sesión `s-20261109T104507-cf70d6cc`, 2026-11-09. Commit del código: **`9bb48e2`**.

## Ficheros
`practicas/errores6/{index.html,practica.js,logica.js,textos.js,estilos.css}` y `tests/practicas-errores6.test.js` (10 tests; con `practicas-comun`, 56 en verde). `disponible: false` (lo pone la publicación de la semana).

## Ejercicios y destrezas (ids de la PROPUESTA del inventario, sin F0)
1. **¿Dónde está el error?** (tocar la línea; un tercio sin error): U6-3C-05 y los errores de U6-1C-15, 2C-07…2C-11, 3C-06/07/09…3C-12.
2. **¿Qué error es?** (cuatro nombres, solo uno verdadero): mismas destrezas.
3. **Corrígelo** (escribir x con `leerFraccion`: entero o fracción): mismas destrezas.

Doce plantillas, una por error de `ERRORES_TIPICOS`: transponer-sin-signo, pasar-factor-restando, multiplicar-en-vez-de-dividir, invertir-coeficiente, signo-al-dividir, signo-de-la-solucion, cero-x-como-x (sin solución; no entra en el ej. 3), mcm-solo-denominadores, olvidar-numerador, suma-no-semejantes, distribuir-solo-primero, signo-solo-primero. Ecuaciones resueltas paso a paso (el camino de `Ecuacion.pasos()`); tras la línea mala el compañero sigue bien de ella. Los paréntesis solo salen en el enunciado (línea 1) de las dos plantillas que los usan.

## Decisiones / propuestas
- **Sin el ejercicio «m.c.m./términos no semejantes» como reducción de expresiones sueltas**: todo va en cadenas de ecuación (más homogéneo para el ej. 1). El error «contestar x cuando el problema pide otra cosa» no está (no hay problemas de enunciado en esta práctica): si Juan Luis lo quiere, es un ejercicio 4 (propuesta).
- Distractores del ej. 2: de la misma clase primero; **ningún error alternativo, aplicado a los números del ítem, lleva al mismo resultado final** (comprobado en el test, también contra el cálculo a mano en racionales BigInt). Las dos plantillas de paréntesis se excluyen entre sí cuando coinciden (−(x − 2)).
- Cotas: coeficientes 1-12, soluciones −12…15, constantes ≤ 30, denominadores 2-7, factores del paréntesis 1-6; ningún número de las líneas > 1500 (test).

## Hoja y examen
**No existían** al escribirla (`6. Algebra/` no tiene `hojas-de-ejercicios/` ni `exámenes-semanales/`). `HOJA` y `HUELLAS_EXAMEN` están vacíos y el mecanismo (clave canónica del enunciado / `huellaCanonica`) está probado; la tarea de publicación de la semana 4 (159) coteja y, si hace falta, reabre.

## Cómo probarlo en 1 minuto
`python3 -m http.server 8154` desde la raíz → http://localhost:8154/practicas/errores6/ → «Probar sin código». Probado en Chrome en ventana ancha, ejercicios 1 y 3 (ES y EN, acierto y fallo). **No probado a 375 px** (la ventana no cambió de ancho al redimensionarla) ni el ejercicio 2 con clics.

## Ajeno
`npm test`: 1772/1773; el fallo es «¿Qué es x?» de `problemas-ecuaciones` (tarea 155, otra sesión).
