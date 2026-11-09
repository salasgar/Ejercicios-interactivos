# Entrega de la tarea 149 · «Pasa al otro lado» (`transposicion`)

Sesión `s-20261109T104353-dee861be`, 2026-11-09. Commit del código: **`a65524a`**.

## Ficheros
`practicas/transposicion/{logica,textos,practica}.js`, `estilos.css`, `index.html` (enlaza `estilos.css`) y `tests/practicas-transposicion.test.js` (17 tests propios; `npm test` 1790/1790).

## Ejercicios y destrezas (ids de la propuesta, sin F0)
1. **Con números** (U6-2C-06): niveles 1-2 como «elige la operación» en `a = c □ b` (suma, resta, producto, cociente; una sola operación hace verdadera la igualdad); bidireccional y nivel 4 con hueco numérico (`9 − 2 = 4 + 3 → 9 − 3 = 4 + □`; `3 · 2 + 4 = 10 → 3 · 2 = 10 − □`).
2. **Una operación** (2C-07, 2C-08): `x + 7 = 12`, `x − 4 = 10`, `5 + x = 3`, `3x = 21`, `−2x = 8`, `x/5 = 4`; escribir (`7`, `x = 7`) o elegir; negativas desde el principio.
3. **Dos operaciones, paso a paso** (2C-09): elegir el paso (`2x = 17 − 5`) y escribir la solución; también `20 = 4x + 8` (x a la derecha) y `x/3 + 2 = 6`.
4. **`3x = 12` frente a `12x = 3`** (2C-11): solución como entero o fracción irreducible, también con −; el feedback enseña la pareja con los mismos números. Una fracción sin simplificar no gasta intento: se avisa.
5. **Comprueba y corrige** (2C-07, 2C-08 con comprobación): resolución mostrada buena (50 %) o con un error típico; si estaba mal y se ve, se escribe la correcta.
Sin práctica en esta (otras tareas o fuera): 2C-10 (`5 − x = 2`, x restando / coeficiente −1) y 2C-12 (reducir antes de resolver): **no están**; propuesta abajo.

## Decisiones y propuestas (para la coordinadora / Juan Luis)
- **Ej. 1 niveles 1-2 como elegir la operación, no como hueco numérico**: con hueco numérico `3 = 5 − □` la respuesta es siempre el número que ya está en la igualdad y no evalúa la transposición. El hueco queda en bidireccional y nivel 4.
- **2C-10 sin cubrir**: no cabe en el ej. 2 sin x restando; propuesta: ejercicio nuevo o reapertura (pasar `−x = −3` a `x = 3`).
- Errores propios (no están en `ERRORES_TIPICOS`): `olvida-pasar`, `signo-cambiado`, `dividir-en-vez-de-multiplicar`, `pasar-divisor-restando`, `resta-al-reves`, `divide-solo-un-termino`, `multiplicar-solo-un-termino`, `misma-operacion`, `otra-operacion`, `numero-que-no-pasa`, `da-por-mala`.
- `x/n` se escribe siempre así (no `x : n`); sin x² ni paréntesis.

## Cotas de realismo
Pura aritmética, sin contextos. Ej. 1: números de 2 a 100 y lados naturales. Ej. 2/5: coeficientes 2-9, términos 2-12, solución de −250 a 250 (en la práctica ≤ 108), `x/n` con n 2-9. Ej. 3: c 1-100, solución natural ≤ 48. Ej. 4: números 2-15. El test lo comprueba.

## Casos de hoja y de examen
**No existían al escribirla**: no hay `hojas-de-ejercicios/` ni `exámenes-semanales/` en `6. Algebra/`. `HUELLAS_RESERVADAS` (logica.js) está vacío y el test comprueba el mecanismo (huella FNV-1a de la forma canónica: `x + 7 = 12` y `7 + x = 12` coinciden; con huellas añadidas ningún ejercicio las saca en 20000 ítems). La tarea de publicación de la semana 2 coteja y añade huellas.

## Cómo probarlo en 1 minuto
`node --test tests/practicas-transposicion.test.js`. En `npm run servir`: http://localhost:8080/practicas/transposicion/ → «Probar sin código». Probado en Chrome (ancha, ES y EN, ej. 1 operador y hueco, 2, 3 con las dos fases, 4, 5; sin errores de montaje). **375 px no probado de verdad**: la ventana de la herramienta no se estrechó; el diseño es de una columna con la misma base que `valor-numerico`.
