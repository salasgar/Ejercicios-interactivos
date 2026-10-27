# Entrega de la tarea 100 · «Fracciones equivalentes» (`equivalentes`, id 48)

Sesión `s-20261027T082738-14ce7cde` (encadenada tras la 99), 2026-10-27. Commit del código: **a2d20f3**.

## Ficheros
`practicas/equivalentes/{index.html,practica.js,logica.js,textos.js,estilos.css}` y `tests/practicas-equivalentes.test.js` (7 tests, 3000 ítems por ejercicio con semillas fijas).

## Ejercicios y destrezas
| # | Ejercicio | Destrezas |
|---|---|---|
| 1 | El término que falta (ampliar o reducir, hueco arriba o abajo; k de 2 a 6; denominadores ≤ 60) | U4-1C-10, 1C-12 |
| 2 | ¿Son equivalentes? (Sí/No; 50/50; los «No» de tres errores típicos; productos cruzados al responder) | U4-1C-11 |
| 3 | Equipos (8 tarjetas en 2 o 3 cajas; toque o arrastre; vale cualquier orden de las cajas) | U4-1C-10, 1C-11 |
| 4 | Común denominador (paso 1: el m.c.m.; paso 2: los dos numeradores; la mitad sin múltiplos) | U4-1C-16 |

## Decisiones a revisar (propuestas)
- Ej. 3: la caja no lleva etiqueta de valor; vale cualquier reparto en que cada caja tenga un solo valor y no haya dos cajas con el mismo. El valor de una caja es el del grupo que más tarjetas tiene en ella.
- Ej. 4: si el paso 1 falla, el ítem termina ahí con el feedback de los dos pasos (no se pide el paso 2). Un producto de denominadores distinto del m.c.m. cuenta como fallo («the smallest»), como pedía la ficha.
- Los productos cruzados (novedad de la unidad) solo aparecen en el feedback del ej. 2 y en su introducción.
- Errores propios, reutilizables: `suma-la-diferencia`, `no-cambia-el-termino`, `suma-el-mismo-numero`, `cambia-solo-un-termino`, `mismo-numerador`, `mezcla-valores`, `producto-de-denominadores`, `solo-cambia-el-denominador`…
- Reservados de la hoja de la semana 1 que no salen: 5/8 = □/48 y 7/9 = 28/□.

## Cómo probarlo en 1 minuto
`npm run servir` y http://localhost:8080/practicas/equivalentes/ → «Probar sin código» → `?ejercicio=1..4`. Probada en navegador (420 px, es/en): acierto y fallo en los cuatro; el 3 por toque (el arrastre usa el mismo código que `venn`). No sale en la portada (`disponible: false`).
