sesión: s-20261114T205046-d42ceb19 (coordinadora, sin reclamo; decisiones del 14-11 sobre los hallazgos de la 193: las de Juan Luis y las de la coordinadora, en `proyecto.md`, «Decisiones del 14-11»)
tarea: 29
reabierta: 2026-11-14T20:54:51Z
ficha: tareas/tarea-29-dictado.md
origen: puntos 16 y 17 de `salidas/193-revision-no-lo-se/ENTREGA.md`, «Hallazgos fuera de criterio»
veredicto: textos del feedback. Banda: MEDIO (~30 min). `dictado` está publicada.

## Qué falla
1. `explicarDictado` (feedback de los ej. 1 y 3): separa los grupos de cifras con «·», que en la app es el producto.
2. `TX.teen.escritura_ok`: «fifty = 50 Ojo con la ortografía…», sin punto entre las dos frases.
3. Comillas rectas en `TX.fichas.notas`.

## Tiene que quedar
- Los grupos, como en la tarjeta: delante y detrás de «thousand» / «mil», el de detrás siempre con tres cifras (17 095), sin «·».
  Si `explicarDictado` y la tarjeta pueden compartir función, mejor.
- El punto que falta, y las comillas («» en español, “ ” en inglés).
- Un test: en 1000 ítems por ejercicio, ningún feedback lleva «·», y ninguno tiene una minúscula o un dígito pegado a una mayúscula
  de principio de frase sin punto (el caso «50 Ojo»).

## Al cerrar
Reclamo nuevo de la 29 (protocolo de su ficha; duración de esta reabierta, no la de la ficha: reclamo de 90 min). Antes de tocar nada,
`git status --short practicas/dictado/` tiene que salir vacío. **La tarjeta del «No lo sé» ya dice bien lo que aquí se corrige** (revisión 193): el
feedback tiene que decir lo mismo que la tarjeta, reutilizando su función si se puede; no escribas una tercera versión. Lo que esta
reabierta no nombra no cambia: comprueba con el hash de 300 ítems por ejercicio (misma semilla, antes y después) que los generadores que
no tocas dan los mismos ítems, y no quites ninguna exclusión de casos de examen. `node --test tests/practicas-dictado.test.js tests/practicas-ayuda-dictado.test.js tests/practicas-no-lo-se.test.js`
en verde y `npm test` sin fallos tuyos. Clic a 375 px y a 1200 px en los ejercicios tocados (un acierto, un fallo y un «No lo sé», en los
dos idiomas). Commit con rutas explícitas solo de `practicas/dictado/` y sus tests. **No toques `catalogo.js` ni `practicas/_comun/`.** Está
publicada y sigue publicada: tras el push comprueba que carga https://salasgar.github.io/Ejercicios-interactivos/practicas/dictado/.
