# Entrega de la tarea 151 · Práctica «Paréntesis» (parentesis-algebra, id 75)

Sesión `s-20261109T104438-79926dd7`, 2026-11-09. Commit del código: **`2efcbbd`**. Sin publicar (`disponible: false`; la pone la tarea de publicación de la semana 3).

## Ficheros
`practicas/parentesis-algebra/{index.html,practica.js,logica.js,textos.js,estilos.css}` y `tests/practicas-parentesis-algebra.test.js` (13 tests; 3000 ítems por ejercicio con semillas fijas). `npm test`: 1790/1790.

## Ejercicios y destrezas (ids de la propuesta del 6-11, sin F0)
1. **Quita el paréntesis** (escribir): U6-3C-06, 3C-07, 3C-08. `3(x − 2)`, `−2(3 − x)`, `−(x − 2)`, `4 − (5 − 2x)`, `5x − 2(x − 4)`. Vale cualquier orden y sin reducir; el error escrito se reconoce con nombre.
2. **¿Cuál es el desarrollo?** (4 opciones): 3C-06, 3C-07, 3C-08. Distractores de errores con nombre (distribuir solo el primero, multiplicar solo la x, signo del segundo, sin multiplicar, sumar antes del paréntesis, cambiar el signo solo del segundo).
3. **Resuelve con paréntesis** (escribir la solución, con o sin «x ="): 3C-09 (nivel medio, 65 %) y 3C-10 (dos paréntesis y un menos delante, 35 %). Solución entera casi siempre; fraccionaria ~12 % (|num| ≤ 40, den ≤ 6).
4. **Caza el error**: 3C-06, 3C-07, 3C-09. Opciones: No hay error / multiplica solo un término / se equivoca en un signo / quita sin multiplicar. Un 34 % sin error; 40 % son pasos de una ecuación.

## Cotas y decisiones
Coeficientes del paréntesis 1-5, números 1-9, k de 2 a 6 (o −1); término delante hasta 9 (x hasta 8). Sin x², una sola letra, un paréntesis por miembro. Con k = −1 los errores `distribuir-solo-primero` y `multiplicar-solo-la-x` no se usan (no se multiplica por ningún número). En Caza el error la familia del error tiene que ser única (se comprueba con todos los candidatos sin quitar duplicados).

## Casos de hoja y examen
**No existían** la hoja ni el examen de la semana 3 al escribirla (no hay `hojas-de-ejercicios/` ni `exámenes-semanales/` en «6. Algebra/»). `CASOS_HOJA` y `HUELLAS_EXAMEN` están vacíos pero operativos (`reservado` por forma canónica del desarrollo o de la ecuación expandida, probado). Lo coteja la tarea de publicación de la semana 3.

## Propuestas (no decididas aquí)
- **Ejercicio 3 pide solo la solución**, no «elegir el primer paso» como decía la ficha: dos respuestas por ítem no caben en un `api.responder`. El primer paso se enseña en el feedback. Si Juan Luis quiere elegir paso, es un ejercicio nuevo.
- La explicación del feedback usa el nombre del error de `ERRORES_TIPICOS` o uno propio (`signo-del-segundo`, `signo-solo-segundo`, `sin-multiplicar`, `menos-olvidado`): si se quieren en la base, propuesta para la 144.
- U6-3A-02 (frases con paréntesis) sigue sin práctica.

## Probarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/parentesis-algebra/ → «Probar sin código». Probado en Chrome (ES y EN, un ítem acertado/fallado en los cuatro ejercicios) y en un iframe de 375 px: sin desbordamiento horizontal en ninguno.

## Reabierta del 13-11 (sesión s-20261113T170434-bebf93c0)
`solucionDeDesarrollo` (rama del producto) con algo delante: «(−2) · 4 + (−2) · 4x = −8 − 8x; con lo de delante, 2x − 8 − 8x», en los dos idiomas. `ayuda.js` pierde el parche `desarrolloBien` (ya no hace falta: la tarjeta y el feedback comparten el texto). Test nuevo: cada igualdad del feedback de los ejercicios 1, 2 y 4 es cierta en x = 7 y x = −3 (3000 ítems por ejercicio; falla con el código anterior). Commit cf464c3. Sin navegador.
