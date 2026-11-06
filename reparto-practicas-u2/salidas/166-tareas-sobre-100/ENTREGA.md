sesión: s-20261106T144048-5b0fb99d · tarea 166 · commit aeed95d

# Tareas sobre 100

**Qué se hizo.** Toda tarea de la app puntúa sobre 100 (decisión de Juan Luis, 6-11).
- `practicas/_comun/tareas.js`: constante `PUNTOS_TAREA = 100` y función `puntosSobreCien(suma, n)` (`Math.round(100·suma/(10·n))`, acotada a 0-100). `estadoTarea` devuelve `puntos` sobre 100 y `maximo: 100`. Por dentro cada ejercicio sigue contando 10 (`PUNTOS_POR_EJERCICIO`); el contador, las vidas y lo guardado en la nube no cambian.
- `practicas/profesor-hoy.js`: «Tarea completa (100 puntos)». `practicas/resultados.js`: solo el comentario (los puntos ya salen de `estadoTarea`). `semana.js` y `portada.js` no cambian: ya leen `est.maximo`; `textos.js` tampoco (no dice «10 por ejercicio»). `docs/practicas-guia-profesor.md`: el párrafo ahora dice «Toda tarea vale 100 puntos».
- Tests: `tests/practicas-semana.test.js` (los de una tarea de 4 ejercicios pasan a sobre 100; nuevo: terminada entera da 100 exactos con 1…MAX_ESTRELLA+MAX_ELEGIR ejercicios que cuentan y nunca fuera de 0-100; nuevo: en una de 10 ejercicios los puntos son los de la fórmula anterior, con cuatro combinaciones).

**Desviación.** Se tocó `tests/practicas-nube.test.js` (no estaba en «Ficheros que toca»): su test «panel: los puntos de la tarea…» fijaba 28 y 40 de una tarea de 4 ejercicios; ahora 70 y 100. Solo cambió la escala, sin reclamo vivo sobre ese fichero.

**Pruebas.** `node --test tests/practicas-semana.test.js tests/practicas-resultados.test.js` en verde; `npm test` 1595/1595. **No probado en Chrome** (punto 6 de la ficha): el marcador solo imprime `est.maximo`, y lo cubren los tests; queda por mirar con un código real al montar las tareas de la U4 en el panel.

**Hallazgos fuera de criterio (para Juan Luis).**
1. `docs/practicas-unidad2.md` (línea ~55-58) sigue diciendo «cada ejercicio vale 10» y «60 de 100 puntos» (cierto solo con 10 ejercicios); y el README (línea ~144) pone el mismo ejemplo. No eran de esta ficha.
2. Una tarea con pocos ejercicios da saltos grandes por ejercicio (con 3 ejercicios, 33,3 cada uno; con 1, 100); por redondeo, 3 ejercicios terminados dan 100 pero cada uno a medias se redondea por separado al sumar.
3. `comun/gestion/calificar_classroom.py` no usa `maximo` ni `puntos` (según la ficha); no he mirado otros consumidores fuera del repo.
