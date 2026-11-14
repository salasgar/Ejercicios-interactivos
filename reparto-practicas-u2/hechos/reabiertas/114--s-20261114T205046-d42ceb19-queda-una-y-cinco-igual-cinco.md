sesión: s-20261114T205046-d42ceb19 (coordinadora, sin reclamo; decisiones del 14-11 sobre los hallazgos de la 193: las de Juan Luis y las de la coordinadora, en `proyecto.md`, «Decisiones del 14-11»)
tarea: 114
reabierta: 2026-11-14T20:54:51Z
ficha: tareas/tarea-114-fichas-parchis-ej6.md
origen: punto 11 de `salidas/193-revision-no-lo-se/ENTREGA.md`, «Hallazgos fuera de criterio»
veredicto: cuentas y concordancias del feedback. Banda: MEDIO (~45 min). `fichas-de-pablo` (carpeta `practicas/fichas-del-parchis/`) está publicada. La dueña de la carpeta es la 114 (la 97 la creó; la 114 la heredó al cambiarle el nombre).

## Qué falla
En `practicas/fichas-del-parchis/textos.js`:
1. `quedaTxt` (línea ~43; feedback de los ej. 4 y 5): escribe «125 : 25 = 5 = 5» cuando lo que queda es una sola ficha (el índice y
   el valor son el mismo número), y «quedan 1 amarilla».
2. `TX.mcd.buena`: «7 = 7 no tienen ninguna ficha en común» (la misma igualdad repetida, y una frase que no se entiende).
3. `TX.mcm.buena`: repite la regla que ya está en la introducción en vez de aplicarla al ítem.

## Tiene que quedar
- Sin igualdades de un número consigo mismo: la cuenta enseña el paso intermedio solo cuando es distinto del resultado.
- Singular: «queda 1 amarilla», «what is left is 1 yellow counter». Repasa `desglose` y `faltaTxt` con 1 ficha de un color.
- `TX.mcd.buena` sin fichas comunes: «No tienen ninguna ficha en común: el m.c.d. es 1», como la tarjeta.
- `TX.mcm.buena`: la regla aplicada al ítem (qué fichas pone cada uno y cuántas quedan de cada color), una vez.
- La tarjeta ya lo dice bien (commit a67fcea): reutiliza sus funciones. Test: en 1000 ítems por ejercicio, ningún feedback ni
  tarjeta casa con `/\b(\d+) = \1\b/` ni con «quedan 1 » / «are left 1 ».
- La regla del producto: «las de uno más las del otro» (ya corregida en la tarjeta); que el feedback no diga «sin sumar nada».

## Al cerrar
Reclamo nuevo de la 114 (protocolo de su ficha; duración de esta reabierta, no la de la ficha: reclamo de 90 min). Antes de tocar nada,
`git status --short practicas/fichas-del-parchis/` tiene que salir vacío. **La tarjeta del «No lo sé» ya dice bien lo que aquí se corrige** (revisión 193): el
feedback tiene que decir lo mismo que la tarjeta, reutilizando su función si se puede; no escribas una tercera versión. Lo que esta
reabierta no nombra no cambia: comprueba con el hash de 300 ítems por ejercicio (misma semilla, antes y después) que los generadores que
no tocas dan los mismos ítems, y no quites ninguna exclusión de casos de examen. `node --test tests/practicas-fichas-de-pablo.test.js tests/practicas-ayuda-fichas-de-pablo.test.js tests/practicas-no-lo-se.test.js`
en verde y `npm test` sin fallos tuyos. Clic a 375 px y a 1200 px en los ejercicios tocados (un acierto, un fallo y un «No lo sé», en los
dos idiomas). Commit con rutas explícitas solo de `practicas/fichas-del-parchis/` y sus tests. **No toques `catalogo.js` ni `practicas/_comun/`.** Está
publicada y sigue publicada: tras el push comprueba que carga https://salasgar.github.io/Ejercicios-interactivos/practicas/fichas-del-parchis/.
