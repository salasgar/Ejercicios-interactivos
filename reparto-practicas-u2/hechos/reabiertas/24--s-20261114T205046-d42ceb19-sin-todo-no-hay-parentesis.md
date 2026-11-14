sesión: s-20261114T205046-d42ceb19 (coordinadora, sin reclamo; decisiones del 14-11 sobre los hallazgos de la 193: las de Juan Luis y las de la coordinadora, en `proyecto.md`, «Decisiones del 14-11»)
tarea: 24
reabierta: 2026-11-14T20:54:51Z
ficha: tareas/tarea-24-expresion.md
origen: punto 7 (★) de `salidas/193-revision-no-lo-se/ENTREGA.md`, «Hallazgos fuera de criterio»
veredicto: ★ el feedback enseña una regla falsa. Banda: MEDIO (~45 min; la ficha dice ALTO porque escribió la práctica entera, y esto es un texto y su test). `expresion` está publicada. **Prioridad 1.**

## Qué falla
`TX.sin.introduccion` (`practicas/expresion/textos.js`, hacia la línea 20), el `explica` de las plantillas `frase_mas_por`,
`frase_menos_por` y `frase_mas_entre` (hacia las líneas 207, 277 y 287) y el comentario de la línea ~122 dicen: «si la frase no dice
«todo», no hay paréntesis». Es falso dentro de la propia práctica: «31 menos la suma de 8 y 2» (ej. 2) lleva paréntesis sin decir «todo».
El alumno que se aprende la regla del ej. 1 falla el ej. 2 por hacerle caso.

## Tiene que quedar
- La regla que se enseña es la **jerarquía**, que vale siempre (es la que ya usa la tarjeta, `logica.js` hacia la línea 540): la
  multiplicación y la división van antes que la suma y la resta; el paréntesis solo hace falta cuando la frase manda hacer antes una suma
  o una resta, y la frase lo avisa («todo», «la suma de…», «la diferencia de…»). Frase sencilla, sin lista de casos límite. Por ejemplo,
  en la introducción: «Ojo con los paréntesis: la multiplicación va antes que la resta, así que «20 menos 5 multiplicado por 3» es
  20 − 5 · 3. Para que la resta vaya antes, la frase lo dice: «20 menos 5, todo multiplicado por 3» es (20 − 5) · 3».
- Los tres `explica`: «La multiplicación (la división) va antes: solo el b se multiplica por c», sin «la frase no dice «todo», así que…».
- El comentario de la línea ~122, puesto al día. La introducción del ej. 2 («Sin «todo» sería 7 + 3 · 2», línea ~35) es verdad en ese
  ejemplo y se queda, salvo que al leerla junto a la nueva suene a la regla vieja.
- En inglés, lo mismo («all»).
- El test propio (`tests/practicas-expresion.test.js`) comprueba hoy la frase de la introducción: se cambia con ella, y se añade uno que
  falle si en algún texto de la práctica (introducciones, `explica`, tarjeta; los dos idiomas) vuelve a salir «no dice «todo»» o
  «does not say «all»» como regla general.
- De paso (punto 9, mismo criterio): si en los textos en inglés hay comillas «» o rectas, pasan a “ ”; en español, «».

## Al cerrar
Reclamo nuevo de la 24 (protocolo de su ficha; duración de esta reabierta, no la de la ficha: reclamo de 90 min). Antes de tocar nada,
`git status --short practicas/expresion/` tiene que salir vacío. **La tarjeta del «No lo sé» ya dice bien lo que aquí se corrige** (revisión 193): el
feedback tiene que decir lo mismo que la tarjeta, reutilizando su función si se puede; no escribas una tercera versión. Lo que esta
reabierta no nombra no cambia: comprueba con el hash de 300 ítems por ejercicio (misma semilla, antes y después) que los generadores que
no tocas dan los mismos ítems, y no quites ninguna exclusión de casos de examen. `node --test tests/practicas-expresion.test.js tests/practicas-ayuda-expresion.test.js tests/practicas-no-lo-se.test.js`
en verde y `npm test` sin fallos tuyos. Clic a 375 px y a 1200 px en los ejercicios tocados (un acierto, un fallo y un «No lo sé», en los
dos idiomas). Commit con rutas explícitas solo de `practicas/expresion/` y sus tests. **No toques `catalogo.js` ni `practicas/_comun/`.** Está
publicada y sigue publicada: tras el push comprueba que carga https://salasgar.github.io/Ejercicios-interactivos/practicas/expresion/.
