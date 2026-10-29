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

## Reabierta del 28-10 (sesión `s-20261028T223951-1b094c4a`, commit 41c7e53)
Cerrada punto por punto contra `hechos/reabiertas/100--s-20261028T135932-e77025db-revision.md`:
1. Ej. 4, paso 2: nuevo error `numerador-mal` (el m.c.m. estaba bien): nombra qué numerador falla y la cuenta (`6 · 5 = 30`); ya no dice «Ese no es el m.c.m.».
2. Ej. 4, «solo cambia el denominador»: habla solo de las fracciones cuyo denominador cambia (1/8 y 1/2 con 1 y 1 ya no acusa a 1/8).
3. Regla 9: el ejemplo de la introducción es ahora 3/4 y 1/10 (→ 15/20 y 2/20). Reservados (ej. 1: los cuatro huecos de la hoja 6b; ej. 2: 6/9-10/15 y 8/10-9/12; ej. 4: 1/4-5/6, 4/9-1/6, 7/8-5/12, parejas de 1/2, 3/5 y 7/10, 2/3-5/8 y 3/10-4/15) no salen, con test en 3000 ítems.
4. Erratas: ej. 2 `no-ve-el-factor` («valen lo mismo; las dos se simplifican a la misma fracción»); ej. 1 `suma-la-diferencia` pone la cuenta (`5 + 12 = 17`) y en inglés «subtracted … from».
Probado en navegador con clics: ej. 4 con 6/7 y 2/5, m.c.m. 35 bien y numeradores 28 y 14 → «arriba de 6/7 no va 28: 6 · 5 = 30». No probado a 375 px ni en inglés a clics (cubierto por tests de texto).
