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

## Reabierta del 9-11 (s-20261109T101419-76cca97f, commit d8b86f5)
Hecha según `hechos/reabiertas/137--s-20261109T095010-067ba651.md`. `ortografia-puntuacion` sigue SIN publicar: la publica la 141.
**Quitado**
- Ej. 1, nivel 3: «El Rey», «La Directora», «La presidenta… Papa», «El Alcalde», «La Ministra» (mayúscula de respeto, solo recomendación del DPD); «El Principito»; «instituto salvador sandoval»; «universidad de Murcia»; los dos saludos «Hola, Marta: te…» y «Querido Pablo: hoy…». Tipos `mayuscula-en-cargo` y `minuscula-tras-saludo` fuera de `REGLAS_MAYUSCULAS`.
- Ej. 2: «Sí, voy contigo.» (la mala valía como «sí» enfático).
- Ej. 4: los fallos `despedida` y `firma` (y el motivo `despedida-sin-coma`); `minuscula-tras-suspensivos` sale de `MOTIVOS` (ya sin uso).
**Corregido**
- Ej. 2: «Marta, mi prima, vive en Lorca.» → «Mi vecina, la del tercero, trabaja en Lorca.» (el inciso ya no se lee como vocativo).
- Ej. 3: las comillas con punto final: «El profesor gritó: «¡Silencio!».» y «Mi madre me preguntó: «¿Has comido?».» con sus malas (DPD «comillas» 2.d). Las dos malas de suspensivos que eran válidas, ahora cuatro puntos (`Llegué a casa.... Estaba…`) o espacio delante (`Se oyó un ruido .... Nadie…`), `puntos-suspensivos-mal`.
- Ej. 4: en ASUNTO_CUERPO, sin saludo («No puedo entregar la tarea porque estoy enfermo.», «No sé en qué página está el ejercicio.»).
**Nuevo**
- Ej. 1, nivel 3: 12 ítems (de 7 a 19): profesiones (`mayuscula-en-profesion`: enfermera, cocinero, veterinaria), «sierra de Espuña», «río Guadalquivir», «Ministerio de Sanidad», «Congreso de los Diputados», «Cruz Roja», «Tribunal Supremo», «La isla del tesoro», «Harry Potter y la piedra filosofal», «Mañana yo preparo la cena».
- Ej. 4, correos del nivel 3: los 16 llevan ahora dos fallos de entre `saludo` (coma en vez de dos puntos), `mayuscula`, `tilde` (sin tildes en el cuerpo) y `apertura` (sin ¿), según lo que admita cada cuerpo.
Recuentos por nivel (ej. 1 / 2 / 3 / 4): nivel 1 15/16/16/16, nivel 2 16/16/17/16, nivel 3 19/17/17/32. Tests propios 78 (con comun) y `npm test` 1706/1706. Sin probar en navegador (cambio solo de bancos). Para la 141: el ★ «Mayúsculas» (ej. 1) tiene ahora 19 ítems de nivel 3 revisados contra el DPD.
