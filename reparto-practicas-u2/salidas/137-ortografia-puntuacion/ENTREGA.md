# ENTREGA · Tarea 137 · Ortografía: puntuación y mayúsculas (id 66)

Sesión: `s-20261105T234323-5337339b`. Commit del código: **`6d562e4`** (5 ficheros). Fecha: 2026-11-06.

## Ficheros entregados
- `practicas/ortografia-puntuacion/{logica,textos,practica}.js` y `estilos.css` (sustituyen el esqueleto de la 134).
- `tests/practicas-ortografia-puntuacion.test.js` (31 tests).

## Los cuatro ejercicios (ítems por nivel 1 / 2 / 3)
1. **Mayúsculas** (tocar palabras + «Comprobar»): 15 / 16 / 17. Cada palabra mal lleva su `idError` (tipo) y su porqué.
2. **El punto y la coma** (¿cuál está bien escrita?, 3 opciones): 16 / 17 / 17.
3. **Dos puntos, puntos suspensivos y el saludo**: 16 / 17 / 17 (nivel 3: punto y coma en listas, raya, coma fuera de comillas).
4. **El correo al profesor**: correos 16 / 16 / 16 (el nivel 3 se monta por piezas: saludo, cuerpo, despedida, firma) y 16 ítems **asunto / cuerpo** (8 y 8, nivel 3).

## Decisiones
- Las malas de 2-4 son la buena con UN cambio; el motivo sale de `MOTIVOS` por `idError` (la explicación dice «En <mala> <motivo>»).
- Descartado por dudoso (regla «si dudas, fuera»): «aunque» con coma, `;` ante «sin embargo», `, y` entre verbos con mismo sujeto, «Hola a todos:».
- Los casos de «coma delante de y» usan malas claramente incorrectas, nunca «sin la coma».
- Realismo/nombres: solo Marta, Lucía, Pablo, Marcos, Ángela, Álvaro, Hugo, Elena, Carmen, Ana y Juan Luis.

## Cómo probarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/ortografia-puntuacion/?nivel=3 → «Probar sin código». Si el navegador guarda el módulo viejo, recarga forzada.

## Probado en navegador
Chrome (extensión), «Probar sin código»: ejercicios 1-4, acierto y fallo, nivel 2 y 3, correo de tres líneas y asunto/cuerpo. **No se probó a 375 px real** (la ventana no se estrechó); el CSS usa `pre-line` y `overflow-wrap`.
