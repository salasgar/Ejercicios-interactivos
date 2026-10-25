# Entrega de la tarea 83 · Práctica «saltos» (id 36)

Sesión `s-20261024T235311-ac96b255`. Commit del código: **57e8240**.

## Ficheros
`practicas/saltos/{logica,textos,practica}.js`, `estilos.css`, `index.html` (enlaza `estilos.css`) y `tests/practicas-saltos.test.js` (11 tests, 3000 ítems por generador).

## Ejercicios y destrezas
1. **Salta en la recta** (U3-1C-11, 12, 13): cuenta de dos términos, recta de −10 a 10 con todos los números; se toca la marca de llegada y «Comprobar». Un tercio de cada tipo, resultado nunca 0. Errores con aviso propio: `regla-signos-en-suma`, `suma-valores-absolutos`, `olvida-el-signo`, `signo-del-primero`.
2. **¿Qué signo tendrá?** (U3-1C-14): positivo/negativo y después el resultado (por etapas; fallo en cualquiera = ítem fallado). Nunca resultado 0; términos de 1 a 15, resultado de −20 a 20.
3. **De izquierda a derecha** (U3-1A-01, 1A-02): 3 o 4 términos; mitad con números (escribe el resultado; detecta `derecha-a-izquierda`) y mitad con palabras (elige la cuenta entre 4, tres falsas con un signo cambiado, y calcula).
4. **Varios términos** (U3-1C-15, 2A-01, 2C-01/02/03): 4-6 términos, fichas que se tocan para repartir positivos/negativos (un toque, positivos; dos, negativos), luego las dos sumas y el resultado. Mitad con pareja de opuestos, que la explicación dice que se pueden tachar.
5. **Varios movimientos** (U3-2C-04): 3 o 4 movimientos tras el inicio; elige la cuenta, la calcula y elige la frase de respuesta.

## Cotas de realismo (las comprueba el test)
buceador nivel −40…−1 m (inicio −30…−2, mueve 1-15 m); ascensor piso −3…12 (mueve 1-8); saldo −50…300 € (mueve 5-120 €, de 5 en 5); temperatura −20…35 °C (mueve 1-12 grados). Nunca resultado 0 en el 5.

## Cómo probarlo en 1 minuto
`npm run servir` y http://localhost:8080/practicas/saltos/ → «Probar sin código» (o código 60, `7NPD`). Probado en Chrome headless a 375 px, en español e inglés, con acierto y fallo, sin errores en consola, en los cinco ejercicios (ej. 1 con captura). **No probado en ventana ancha ni con un móvil real.**

## Propuestas (no cambiadas por mi cuenta)
- Ej. 1: la ficha decía «toca la marca y escribe el resultado»; son dos acciones para lo mismo, así que solo se toca la marca (la cuenta se rellena con el valor tocado).
- Ej. 2 y 3-palabras: la «cuenta» de las opciones falsas cambia un signo cualquiera (incluido el del número inicial), todas con otro valor que la buena.
- Ej. 4: «reordenar llevando cada número su signo» (U3-2C-03) se trabaja con las fichas que se reparten; no hay un ejercicio aparte de reordenar.
- Ej. 5: la frase falsa sale de `signo-cambiado` y `derecha-a-izquierda` (tres frases en total).
- Ni `catalogo.js` ni nada ajeno se ha tocado; `disponible: false` sigue (lo cambia la 93).
