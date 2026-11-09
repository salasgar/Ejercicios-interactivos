# ENTREGA tarea 146 — práctica «Valor numérico» (valor-numerico, unidad 6)

Commit: a0ebb74. Ficheros: `practicas/valor-numerico/{index.html,practica.js,logica.js,textos.js,estilos.css}` y `tests/practicas-valor-numerico.test.js`.
Probar en 1 minuto: `npm run servir` → http://localhost:8080/practicas/valor-numerico/?probar=1 (sin código) → Empezar.

## Ejercicios
1. **Sustituye y calcula**: escribir (número, decimal o fracción; se lee con `deTexto`) o elegir entre cuatro. Expresiones `3x + 2`, `2 + 3x`, `3x − 2`, `10 − 2x`, `2(x − 1)`. x natural, negativo (entre paréntesis al sustituir) o decimal 0,5 / 1,5 / 2,5. Feedback con la cuenta paso a paso del ítem.
2. **La tabla**: cuatro valores de x distintos (paso 1 o 2), dos huecos; cada hueco se comprueba exacto y se pinta bien/mal; sin valores repetidos en la tabla.
3. **¿Qué valor?**: «con x = 5, ¿qué expresión vale 15?» entre cuatro expresiones; solo una lo da y cada falsa es una expresión que da N si se calcula con un error típico (trampa a medida).

Destrezas: U6-1C-05, 1C-06 y 1C-07 (los ids son provisionales: F0 sin firmar).

## Decisiones a revisar (propuestas, no cambian el catálogo)
- **Sin x² (1C-09)**: sigue pendiente del punto d de F0; añadirlo es una forma más en `expresion()` y sus errores `(2·3)²`, `3² = 6`, `(−4)² = −16`.
- **Ejercicio 3 sin ecuaciones ni tanteo**: no es el «¿qué valor hace verdadera la igualdad?» de la ficha ni su alternativa de comparar dos expresiones; es «qué expresión vale N», que solo evalúa y cabe en la semana 1. La versión con ecuación queda para la semana de ecuaciones.
- **1A-05 (tarifa en contexto)** no está aquí: se propuso para `traduce`; si `traduce` no lo coge, entra como un contexto más del ejercicio 1 (cota: móvil 5-50 €/mes; taxi 3-5 € + 1-2 €/km hasta 50 km).
- Hoja y examen de la U6 **no existen aún**: no hay casos que excluir. `HUELLAS_RESERVADAS` (logica.js) está vacío y listo: la 156 debe cotejar y, si hay casos, añadir sus huellas (`huellaCaso(expresión, valor)`) y reabrir esta tarea.

## Cotas de realismo (no hay contexto de la vida real)
|resultado| ≤ 60 en todos los ítems; coeficientes 2-9 (5 si negativo), constantes 1-9 (6-20 en `b − ax`); x natural 2-9, negativo −1…−6.

## Pruebas
15 tests propios (3000 ítems por ejercicio, evaluador propio con BigInt): valor exacto de lo que se ve, una sola buena, falsas con error nombrado y valor distinto, sin repetidos en la tabla, sin ×, %, 1x, «+ −», x², guion por menos ni separador decimal del otro idioma. `npm test` 1699/1699. Probada en Chrome headless a 375 px y 1100 px, ES y EN, acierto y fallo en los tres ejercicios.
