sesión: s-20261114T205046-d42ceb19 (coordinadora, sin reclamo; decisiones del 14-11 sobre los hallazgos de la 193: las de Juan Luis y las de la coordinadora, en `proyecto.md`, «Decisiones del 14-11»)
tarea: 02
reabierta: 2026-11-14T20:54:51Z
ficha: tareas/tarea-02-semaforo.md
origen: punto 15 de `salidas/193-revision-no-lo-se/ENTREGA.md`, «Hallazgos fuera de criterio»
veredicto: el feedback del ej. 4 da la cifra y no el método. Banda: MEDIO (~30 min). `semaforo` está publicada. La dueña de la carpeta es la 02 (la 40 fue un arreglo puntual).

## Qué falla
`explicarCifra` (`practicas/semaforo/logica.js`, línea ~202; feedback del ej. 4): empieza por la respuesta («La cifra que falta es X»)
y no dice cómo se encuentra. La tarjeta se reescribió en la 193 (commit 25cd229) con el método de los apuntes: suma lo que ves y qué
cifra falta para el criterio; la única par; el 11, con las sumas de los lugares pares e impares.

## Tiene que quedar
- El feedback (acierto y fallo) da el método de la tarjeta en corto y acaba en la cifra: primero la cuenta, luego «la cifra que falta
  es X». Reutiliza la función de la tarjeta.
- El criterio del 11 habla de las **sumas** de las cifras de lugar par e impar, no de «las cifras».
- Test: en 1000 ítems del ej. 4, el feedback no empieza por la respuesta y contiene la cifra única (la que ya comprueba el test de ayuda).

## Al cerrar
Reclamo nuevo de la 02 (protocolo de su ficha; duración de esta reabierta, no la de la ficha: reclamo de 90 min). Antes de tocar nada,
`git status --short practicas/semaforo/` tiene que salir vacío. **La tarjeta del «No lo sé» ya dice bien lo que aquí se corrige** (revisión 193): el
feedback tiene que decir lo mismo que la tarjeta, reutilizando su función si se puede; no escribas una tercera versión. Lo que esta
reabierta no nombra no cambia: comprueba con el hash de 300 ítems por ejercicio (misma semilla, antes y después) que los generadores que
no tocas dan los mismos ítems, y no quites ninguna exclusión de casos de examen. `node --test tests/practicas-semaforo.test.js tests/practicas-ayuda-semaforo.test.js tests/practicas-no-lo-se.test.js`
en verde y `npm test` sin fallos tuyos. Clic a 375 px y a 1200 px en los ejercicios tocados (un acierto, un fallo y un «No lo sé», en los
dos idiomas). Commit con rutas explícitas solo de `practicas/semaforo/` y sus tests. **No toques `catalogo.js` ni `practicas/_comun/`.** Está
publicada y sigue publicada: tras el push comprueba que carga https://salasgar.github.io/Ejercicios-interactivos/practicas/semaforo/.
