# Entrega de la tarea 150 · «Resuelve» (U6)

Sesión `s-20261109T104413-a16205de`, 2026-11-09. Commit del código: **`a7f60eb`**. Ficheros: `practicas/resuelve/{logica,textos,practica}.js`, `estilos.css`, `index.html`, `tests/practicas-resuelve.test.js`.

## Ejercicios y destrezas (ids de la propuesta, sin F0)
1. **El primer paso**: elegir entre 4 líneas la que pasa bien los términos (U6-3C-01, 3C-02). Errores: x-sin-signo, numero-sin-signo, pierde-un-termino, transponer-sin-signo.
2. **Paso a paso**: tres huecos (A, C, x). 60 % x en los dos miembros, 40 % «reducir» (2x + 3x = 20; U6-2C-12). Incluye x = 0 (U6-3C-03), negativas y fracciones; |A| ≥ 2. Acepta 6/4 como 3/2 y lo avisa.
3. **Resuélvela**: escribir (o elegir, 40 %, salvo x = 0) el valor de x (U6-3C-01, 3C-02, 3C-03). Feedback con la resolución completa y la comprobación sustituyendo.
4. **¿Está bien resuelta?**: 3 pasos, uno malo (1/3 de los ítems sin error); solo el paso que no sale de la línea anterior cuenta como fallo (U6-3C-05).

## Cotas fijadas (el test las comprueba)
|coef. de x| ≤ 9; números sueltos ≤ 12 (en «reducir», el del otro miembro ≤ 40); solución entera |s| ≤ 12, fracción con denominador ≤ 9 y |numerador| ≤ 20. Sin contextos.

## Casos de hoja y de examen
Reserva completa desde la segunda pasada (reabierta por la 158, 18-11). `CASOS_HOJA`: 34 ecuaciones de las hojas 3 y 4 de la U6, en claro; `esReservada` compara cada una en los dos órdenes de miembros. `HUELLAS_EXAMEN`: 146 huellas FNV-1a de la forma canónica (examen 3 y su extra, examen 4 y su extra, los cinco finales; ya con los dos órdenes), nunca en claro. Las listas salen de `hechos/notas/s-20261118T084149-af8e25f2-resuelve-reserva.txt` (calculada por la 158 fuera del repositorio). Tests: 3000 ítems por ejercicio, también la ecuación de partida del ej. 4, sin ninguna reservada; `CASOS_HOJA.length` = 34 y `HUELLAS_EXAMEN.size` = 146. También se excluyen los dos ejemplos de las introducciones.

Segunda pasada: (1) el feedback del ej. 2 y del ej. 3 escribe los signos con «−» y la división con el divisor negativo entre paréntesis («−5 : (−7)»); `feedback2` y `feedback3` pasan a `ayuda.js` para poder probarlos sin DOM, con un test que recorre los dos idiomas; (2) `htmlEc` pega el signo de cada término a su número con un espacio duro, para que a 375 px la ecuación solo se parta entre términos o por el «=» (no comprobado con clics en navegador en esta pasada: queda para la publicación).

## Cómo probarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/resuelve/ → «Probar sin código»; `node --test tests/practicas-resuelve.test.js` (9 en verde). Probado en Chrome (ej. 1-4, 375 px sin desbordar, ES/EN).

## Propuestas
- Sin `disponible: true` ni tarea semanal (las pone la publicación).
- Sin probar en Chrome: un acierto de cada ejercicio con clics (sí se vio fallo en 1 y 2 y la carga de 3 y 4).
