sesión: s-20261114T205046-d42ceb19 (coordinadora, sin reclamo; decisiones del 14-11 sobre los hallazgos de la 193: las de Juan Luis y las de la coordinadora, en `proyecto.md`, «Decisiones del 14-11»)
tarea: 11
reabierta: 2026-11-14T20:54:51Z
ficha: tareas/tarea-11-clasificador.md
origen: punto 9 (★); el punto 5 (el rosal) se queda como está por decisión de Juan Luis de `salidas/193-revision-no-lo-se/ENTREGA.md`, «Hallazgos fuera de criterio»
veredicto: ★ revisar que ninguna razón del banco diga la regla falsa que la 193 quitó de la tarjeta, y comillas y mayúsculas. Banda: MEDIO (~45 min). `clasificador` está publicada. **Prioridad 1.**

## Qué falla
1. Las `razon` del BANCO (`practicas/clasificador/textos.js`; son el feedback de los ej. 1-2 y las opciones del ej. 3) empiezan en
   minúscula aunque abren frase, y en inglés llevan comillas españolas («the smallest number of…»). Lo mismo en `TX.detalle.trampa.en`
   (línea ~201) y en las opciones `dice_mayor` / `dice_menor` en inglés (líneas ~214-215).
2. La 193 encontró en la tarjeta el consejo «si se reparte en partes iguales, m.c.d.», que es falso en las trampas de m.c.m., y lo
   cambió. Nadie ha leído con ese ojo las 24 razones del banco y los textos de introducción.

## Tiene que quedar
- Lee las 24 razones y las introducciones, en los dos idiomas, buscando una regla general falsa («partes iguales → m.c.d.», «mayor →
  m.c.d.», «menor → m.c.m.»): cada razón tiene que explicar **ese** enunciado con sus números (¿partes iguales de los datos, o un
  múltiplo de todos?) y no dar una receta por palabras. La que falle se reescribe como la tarjeta: «“mayor” y “menor” no deciden».
  Di en la terminada cuáles has cambiado y cuáles has leído y estaban bien.
- En inglés, comillas “ ” y nunca «» ni rectas; en español, «». Mayúscula inicial donde la razón abre frase (si la misma cadena se
  usa también a mitad de frase, se pone la mayúscula al pintarla, no en el banco).
- Regla de oro en el ej. 3: tras los cambios, la razón buena sigue siendo la única verdadera de las que se ofrecen (comprobado a mano
  en las 24 plantillas, y el test que ya lo vigila, en verde).
- **No se toca**: «riegas un rosal cada N días» (LIMPIOS_MCM, N hasta 20). Juan Luis lo ha decidido el 14-11: donde llueve a menudo es creíble.

## Al cerrar
Reclamo nuevo de la 11 (protocolo de su ficha; duración de esta reabierta, no la de la ficha: reclamo de 90 min). Antes de tocar nada,
`git status --short practicas/clasificador/` tiene que salir vacío. **La tarjeta del «No lo sé» ya dice bien lo que aquí se corrige** (revisión 193): el
feedback tiene que decir lo mismo que la tarjeta, reutilizando su función si se puede; no escribas una tercera versión. Lo que esta
reabierta no nombra no cambia: comprueba con el hash de 300 ítems por ejercicio (misma semilla, antes y después) que los generadores que
no tocas dan los mismos ítems, y no quites ninguna exclusión de casos de examen. `node --test tests/practicas-clasificador.test.js tests/practicas-ayuda-clasificador.test.js tests/practicas-no-lo-se.test.js`
en verde y `npm test` sin fallos tuyos. Clic a 375 px y a 1200 px en los ejercicios tocados (un acierto, un fallo y un «No lo sé», en los
dos idiomas). Commit con rutas explícitas solo de `practicas/clasificador/` y sus tests. **No toques `catalogo.js` ni `practicas/_comun/`.** Está
publicada y sigue publicada: tras el push comprueba que carga https://salasgar.github.io/Ejercicios-interactivos/practicas/clasificador/.
