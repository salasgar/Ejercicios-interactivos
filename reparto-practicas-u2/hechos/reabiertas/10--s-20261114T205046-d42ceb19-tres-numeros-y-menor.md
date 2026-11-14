sesión: s-20261114T205046-d42ceb19 (coordinadora, sin reclamo; decisiones del 14-11 sobre los hallazgos de la 193: las de Juan Luis y las de la coordinadora, en `proyecto.md`, «Decisiones del 14-11»)
tarea: 10
reabierta: 2026-11-14T20:57:55Z
ficha: tareas/tarea-10-imposibles.md
origen: puntos 4 (★), 8 (★) y 14 de `salidas/193-revision-no-lo-se/ENTREGA.md`, «Hallazgos fuera de criterio»
veredicto: ★ el feedback enseña una regla falsa, el generador de tres números puede repetir uno y los contextos del ej. 1 sacan parejas con m.c.d. 1. Banda: MEDIO (~1 h 15 min). `imposibles` está publicada. **Prioridad 1.**

## Qué falla
1. **Ej. 2, tres números** (`TX.producto.feedbackTres`, `textos.js` hacia la línea 94): «con tres números el m.c.d. · m.c.m. ya no
   coincide con el producto». Es falso como regla: con 3, 4 y 5 coincide (1 · 60 = 60). Lo cierto es que **con tres números la
   comprobación no sirve**: unas veces coincide y otras no. El comentario de `logica.js` (línea ~43, «nunca vale») dice lo mismo.
2. **`generarTres`** (`logica.js`, línea ~56): sortea a, b y c por separado y puede repetir un número (8, 5, 8), que no es «tres
   números». Además, el bucle se rinde a los 15 intentos: si los 15 tríos coinciden (improbable, pero posible), sale un ítem con
   `cuadra: false` cuyo producto sí cuadra, y el feedback escribe «60 ≠ 60».
3. **`TX.feedbackPuede`** (línea ~78): un «<» sin escapar dentro de HTML («12 < 18: el m.c.m.…»).
4. **Ej. 1 con contexto** (`generarPuedeNumeros`, `logica.js`, línea ~14, cuando `conContexto`): salen parejas con m.c.d. 1 en el
   «mayor número posible de grupos / bolsas iguales»: «16 lápices y 7 gomas… ¿puede salir 1 grupo?», y la respuesta buena es «Sí». Es
   el caso de las pulseras de la regla de realismo (`CLAUDE.md`): con m.c.d. 1, «el mayor número de grupos» es 1 y no hay reparto.
   Juan Luis lo dejó a la coordinadora el 14-11 («para muchos alumnos un lápiz solo no es un grupo; para una mente matemática sí»).

## Tiene que quedar
- Feedback de tres números, como la tarjeta (que ya tiene su propia cuenta, línea ~158): «Con tres números esta comprobación no vale:
  a veces coincide y a veces no. Aquí, g · m = … y a · b · c = …». Sin el ejemplo fijo de 2, 4 y 8 si ya se hace la cuenta del ítem.
- `generarTres`: tres números **distintos** y con g · m ≠ a · b · c **garantizado** (enumera una vez los tríos válidos y sortea de la
  lista, o un bucle sin tope). Test sobre 5000 ítems: tres distintos y el producto nunca cuadra. Los casos de examen excluidos, igual.
- El «<» de `TX.feedbackPuede`, escapado (`&lt;`) o, mejor, con palabras («12 es menor que 18»). Mira si hay más «<» o «>» sueltos
  en los textos de la práctica.
- **Ej. 1, decisión de la coordinadora: con contexto, solo parejas con m.c.d. ≥ 2 cuando se pregunta por el m.c.d.**; sin contexto
  (números a secas), el m.c.d. 1 sigue saliendo, que ahí es justo lo que hay que saber. Vale tanto si el ítem es «puede» como si es
  «no puede» (la pareja es la misma). En los contextos de m.c.m. no cambia nada. Elige de forma que no se pierda variedad (enumera las
  parejas válidas del rango y sortea, o descarta y repite sin tope): mide que ninguna pareja pasa del 10 % en 20 000 ítems y dilo.
- Repasa de paso, con la regla de realismo, **todos** los valores que puede proponer el ej. 1 con contexto (el `propuesto` de los
  «no puede» y los rangos de cada contexto): que la situación sea posible y los números creíbles; si un contexto necesita cota
  propia, se la pones y la vigila el test. Los casos de examen excluidos siguen excluidos.
- Test: en 5000 ítems del ej. 1 con contexto y cantidad m.c.d., `mcd(a, b) ≥ 2` siempre; y sin contexto sigue saliendo alguna pareja con m.c.d. 1.
- La tarjeta del «No lo sé» del ej. 1 sigue valiendo para los ítems nuevos (su test de ayuda, en verde).

## Al cerrar
Reclamo nuevo de la 10 (protocolo de su ficha; duración de esta reabierta, no la de la ficha: reclamo de 90 min). Antes de tocar nada,
`git status --short practicas/imposibles/` tiene que salir vacío. **La tarjeta del «No lo sé» ya dice bien lo que aquí se corrige** (revisión 193): el
feedback tiene que decir lo mismo que la tarjeta, reutilizando su función si se puede; no escribas una tercera versión. Lo que esta
reabierta no nombra no cambia: comprueba con el hash de 300 ítems por ejercicio (misma semilla, antes y después) que los generadores que
no tocas dan los mismos ítems, y no quites ninguna exclusión de casos de examen. `node --test tests/practicas-imposibles.test.js tests/practicas-ayuda-imposibles.test.js tests/practicas-no-lo-se.test.js`
en verde y `npm test` sin fallos tuyos. Clic a 375 px y a 1200 px en los ejercicios tocados (un acierto, un fallo y un «No lo sé», en los
dos idiomas). Commit con rutas explícitas solo de `practicas/imposibles/` y sus tests. **No toques `catalogo.js` ni `practicas/_comun/`.** Está
publicada y sigue publicada: tras el push comprueba que carga https://salasgar.github.io/Ejercicios-interactivos/practicas/imposibles/.
