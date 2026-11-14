sesión: s-20261114T205046-d42ceb19 (coordinadora, sin reclamo; decisiones del 14-11 sobre los hallazgos de la 193: las de Juan Luis y las de la coordinadora, en `proyecto.md`, «Decisiones del 14-11»)
tarea: 28
reabierta: 2026-11-14T20:54:51Z
ficha: tareas/tarea-28-potencias10.md
origen: puntos 16 y 17 de `salidas/193-revision-no-lo-se/ENTREGA.md`, «Hallazgos fuera de criterio»
veredicto: textos del feedback. Banda: MEDIO (~30 min). `potencias10` está publicada.

## Qué falla
1. `TX.and.grupos` y `TX.and.por_que` (`practicas/potencias10/textos.js`, hacia la línea 141; feedback del ej. 2): separan los grupos
   de cifras con «·», que en la app es el producto.
2. Comillas rectas en textos en inglés: `TX.billion.nota_trillion` y `TX.and`.
3. La 193 quitó de la tarjeta una regla falsa («el «and» marca dónde empiezan las unidades sueltas»; falla en «five hundred and
   sixty thousand»). Hay que mirar si el feedback (`TX.and.por_que`) la sigue diciendo.

## Tiene que quedar
- Los grupos, como en la tarjeta (línea ~71): «millones …; miles …; unidades …», sin «·».
- Si `por_que` dice la regla falsa del «and», se cambia por la de la tarjeta. Dilo en la terminada, lo diga o no.
- Comillas: en inglés “ ”, en español «». Ninguna recta en un texto que ve el alumno.
- Sigue sin decirse en ningún sitio que billion sea 10¹² (el test ya lo vigila).
- Un test: en 1000 ítems por ejercicio, el feedback y la tarjeta no tienen «·» entre dos grupos de cifras (sí puede haberlo en un producto de verdad).

## Al cerrar
Reclamo nuevo de la 28 (protocolo de su ficha; duración de esta reabierta, no la de la ficha: reclamo de 90 min). Antes de tocar nada,
`git status --short practicas/potencias10/` tiene que salir vacío. **La tarjeta del «No lo sé» ya dice bien lo que aquí se corrige** (revisión 193): el
feedback tiene que decir lo mismo que la tarjeta, reutilizando su función si se puede; no escribas una tercera versión. Lo que esta
reabierta no nombra no cambia: comprueba con el hash de 300 ítems por ejercicio (misma semilla, antes y después) que los generadores que
no tocas dan los mismos ítems, y no quites ninguna exclusión de casos de examen. `node --test tests/practicas-potencias10.test.js tests/practicas-ayuda-potencias10.test.js tests/practicas-no-lo-se.test.js`
en verde y `npm test` sin fallos tuyos. Clic a 375 px y a 1200 px en los ejercicios tocados (un acierto, un fallo y un «No lo sé», en los
dos idiomas). Commit con rutas explícitas solo de `practicas/potencias10/` y sus tests. **No toques `catalogo.js` ni `practicas/_comun/`.** Está
publicada y sigue publicada: tras el push comprueba que carga https://salasgar.github.io/Ejercicios-interactivos/practicas/potencias10/.
