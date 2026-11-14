sesión: s-20261114T205046-d42ceb19 (coordinadora, sin reclamo; decisiones del 14-11 sobre los hallazgos de la 193: las de Juan Luis y las de la coordinadora, en `proyecto.md`, «Decisiones del 14-11»)
tarea: 14
reabierta: 2026-11-14T20:54:51Z
ficha: tareas/tarea-14-errores.md
origen: punto 12 de `salidas/193-revision-no-lo-se/ENTREGA.md`, «Hallazgos fuera de criterio»
veredicto: tres retoques del banco. Banda: MEDIO (~30 min). `errores` está publicada.

## Qué falla
En `practicas/errores/textos.js`:
1. `e-mcd-cero`, la línea `corregida` (línea ~249; es lo que enseña el feedback): dice que el 1 divide a los dos, sin decir que es el
   **único** divisor común, que es por lo que el m.c.d. es 1. La explicación de la tarjeta (línea ~575) ya lo dice.
2. El comentario del banco (línea ~136) dice 29 plantillas (14 + 15) y hay 28.
3. `b-lcm-nombres`, en inglés: comillas rectas.

## Tiene que quedar
- La `corregida` de `e-mcd-cero` dice «el único divisor común es el 1», en los dos idiomas.
- El comentario, con el recuento de verdad (cuéntalas con un guion, no a ojo), y un test que compruebe el número de plantillas con y
  sin error para que el comentario no vuelva a mentir.
- Comillas: “ ” en inglés y «» en español en todo el banco (`grep -n '"' ` sobre los textos que ve el alumno).
- Regla de oro: en las 28, la línea señalada como error sigue siendo la única mal, y las «sin error» no tienen ninguna.

## Al cerrar
Reclamo nuevo de la 14 (protocolo de su ficha; duración de esta reabierta, no la de la ficha: reclamo de 90 min). Antes de tocar nada,
`git status --short practicas/errores/` tiene que salir vacío. **La tarjeta del «No lo sé» ya dice bien lo que aquí se corrige** (revisión 193): el
feedback tiene que decir lo mismo que la tarjeta, reutilizando su función si se puede; no escribas una tercera versión. Lo que esta
reabierta no nombra no cambia: comprueba con el hash de 300 ítems por ejercicio (misma semilla, antes y después) que los generadores que
no tocas dan los mismos ítems, y no quites ninguna exclusión de casos de examen. `node --test tests/practicas-errores.test.js tests/practicas-ayuda-errores.test.js tests/practicas-no-lo-se.test.js`
en verde y `npm test` sin fallos tuyos. Clic a 375 px y a 1200 px en los ejercicios tocados (un acierto, un fallo y un «No lo sé», en los
dos idiomas). Commit con rutas explícitas solo de `practicas/errores/` y sus tests. **No toques `catalogo.js` ni `practicas/_comun/`.** Está
publicada y sigue publicada: tras el push comprueba que carga https://salasgar.github.io/Ejercicios-interactivos/practicas/errores/.
