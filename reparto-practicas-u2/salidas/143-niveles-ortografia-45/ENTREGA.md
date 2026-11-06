# ENTREGA · Tarea 143 · Niveles adaptables en «Ortografía: lo más frecuente» (id 45)

Sesión: `s-20261105T234455-51d3c35d`. Commit del código: **`444f826`**. Fecha: 2026-11-06.

## Ficheros
`practicas/ortografia/{logica,comas,tildes,signos,sujeto,practica}.js` y `tests/practicas-ortografia.test.js`. `textos.js` no se toca (la frase «Empieza fácil…» era opcional).

## Ítems por nivel y ejercicio (1 / 2 / 3; el par de «significado» y los extras de tildes cuentan 2 por pregunta)
| Ej. | Niveles | Añadidos |
|---|---|---|
| 1 a/ha | 16 / 13 / 11 | 0 |
| 2 e/he | 20 / 12 / 10 | 2 (nivel 3) |
| 3 echo/hecho | 14 / 8 / 8 | 2 (nivel 3) |
| 4 ¿bien escrita? | 50 / 33 / 29 | (hereda de 1-3) |
| 5 porque/por qué | 15 / 8 / 10 | 5 (1 de nivel 2, 4 de nivel 3) |
| 6 vocativo | 8 / 12 / 8 | 0 |
| 7 comas | 8 / 8 / 8 | 3 pares (nivel 2) |
| 8 interrogativos | 17 / 12 / 16 | 13 |
| 9 diacríticas | 17 / 10 / 16 | 10 |
| 10 signos | 8 / 8 / 8 | 10 |
| 11 sujeto/inciso | 8 / 8 / 8 | 2 incisos (nivel 2) |

Los ítems nuevos van siempre al FINAL de su lista (la clave es la posición). Los de tildes: huecos, no pares nuevos.

## Confirmación del diff
Script que importa los bancos de `HEAD` y los nuevos: **todos los ítems aprobados, idénticos y en su misma posición**; solo se añade el nivel. `clave`, `idError`, nombres y orden de los ejercicios no cambian. `npm test`: 1585/1585.

## Decisiones
1. **Sin `sesion` (llamada suelta) no hay nivel**: sale cualquier ítem, como antes. Así las aserciones antiguas (que llaman `generar(rng)`) siguen intactas; la base siempre pasa `sesion`.
2. **Pares y preguntas de sí o no (8 y 9) son de nivel 3** (como pedía la ficha), y solo salen (uno de cada cuatro) a quien está en el nivel 3. Antes de eso, solo huecos.
3. **Tildes**: el nivel de los huecos va por dificultad, no solo por «¿ ¡ a la vista», para que cada nivel tenga las dos clases (con y sin tilde).
4. Cada ejercicio elige primero la clase (palabra con h / sin h, con / sin tilde, bien / mal, sujeto / inciso) al 50 % y luego el nivel dentro de ella: ningún botón pasa del 60 % en ningún nivel (lo comprueba un test).
5. La etiqueta «Nivel N · ●●○» la pone un envoltorio `conNivel` en `practica.js` con estilo en línea (`estilos.css` no está en la ficha).

## Cómo probarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/ortografia/?nivel=2 → «Probar sin código» → cualquier ejercicio. Probados los 11 en el navegador (niveles 1-3, acertando un ítem en cada uno): etiqueta correcta y explicación visible.
