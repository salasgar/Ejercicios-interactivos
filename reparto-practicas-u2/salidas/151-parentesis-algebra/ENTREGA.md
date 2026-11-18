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
Segunda pasada (sesión `s-20261118T090057-4da5731a`, 2026-11-18), tras la reabierta de la 158. Las listas vienen de la nota `hechos/notas/s-20261118T084149-af8e25f2-parentesis-algebra-reserva.txt` de la 158, calculada sobre las hojas 3 y 4 de la unidad 6 (enunciados) y sobre los exámenes 3 y 4 con sus extras y los cinco finales (solo huellas). `CASOS_HOJA`: 41 claves (29 casos; las ecuaciones, con los dos órdenes de miembros). `HUELLAS_EXAMEN`: 55 huellas (ya con los dos órdenes). El test comprueba que 3000 ítems por ejercicio (semillas fijas) no tocan ni una, en los dos órdenes, y los tamaños de las listas.

## Segunda pasada: lo corregido
- Reserva de hoja y examen (arriba).
- Caza el error con ecuación: se descarta el ítem si la ecuación «equivocada» tiene la misma solución que la de arriba (test con 20000 ítems, semilla 158108).
- Español: «Has multiplicado bien, pero te has equivocado en el signo del segundo término» en los ej. 1-3. En el ej. 4 el feedback va en tercera persona («Ha multiplicado solo el primer término…»; en inglés, «They multiplied only…»).
- Ej. 4 con ecuación: cada lado del enunciado lleva `white-space: nowrap`, para que solo pueda partirse en la flecha.

## Propuestas (no decididas aquí)
- **Ejercicio 3 pide solo la solución**, no «elegir el primer paso» como decía la ficha: dos respuestas por ítem no caben en un `api.responder`. El primer paso se enseña en el feedback. Si Juan Luis quiere elegir paso, es un ejercicio nuevo.
- La explicación del feedback usa el nombre del error de `ERRORES_TIPICOS` o uno propio (`signo-del-segundo`, `signo-solo-segundo`, `sin-multiplicar`, `menos-olvidado`): si se quieren en la base, propuesta para la 144.
- U6-3A-02 (frases con paréntesis) sigue sin práctica.

## Probarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/parentesis-algebra/ → «Probar sin código». Probado en Chrome (ES y EN, un ítem acertado/fallado en los cuatro ejercicios) y en un iframe de 375 px: sin desbordamiento horizontal en ninguno.

## Reabierta del 13-11 (sesión s-20261113T170434-bebf93c0)
`solucionDeDesarrollo` (rama del producto) con algo delante: «(−2) · 4 + (−2) · 4x = −8 − 8x; con lo de delante, 2x − 8 − 8x», en los dos idiomas. `ayuda.js` pierde el parche `desarrolloBien` (ya no hace falta: la tarjeta y el feedback comparten el texto). Test nuevo: cada igualdad del feedback de los ejercicios 1, 2 y 4 es cierta en x = 7 y x = −3 (3000 ítems por ejercicio; falla con el código anterior). Commit cf464c3. Sin navegador.
