# Entrega de la tarea 111 · Revisión y publicación de las prácticas de la semana 3 de la U4, y propuesta de su tarea

Sesión `s-20261028T182802-3d6fcf1b`, 2026-10-28. Commit: **9254d33** (solo documentación: `docs/practicas-unidad4.md` completo y la
sección de la U4 en `README.md`). **No se ha publicado nada**: `catalogo.js` no cambia.

## Resultado
| Práctica (tarea, id) | Veredicto | Estado |
|---|---|---|
| `multiplica-divide` (105, 53) | **no pasa**: el ej. 2 da por mala una fracción sin simplificar (34 % de los ítems) y el enunciado no pide la irreducible; ejemplos de las introducciones copiados del examen semanal 3 y de la hoja 2 | sin publicar · `hechos/reabiertas/105--s-20261028T182802-3d6fcf1b-revision.md` (MEDIO, corta) |
| `combinadas-fracciones` (106, 54) | **no pasa**: en el ej. 2, un distractor de «izquierda a derecha» en pasos que son una sola operación (38 % de los ítems); pistas que hablan de restar en una división; etiqueta de error equivocada con un natural; mensaje de «izquierda» en un fallo de jerarquía | sin publicar · `hechos/reabiertas/106--…-revision.md` (MEDIO) |
| `errores4` (107, 55) | **no pasa**: «los denominadores no se multiplican» presentado como error (es un denominador común válido) y contradicho cuando el m.c.m. es el producto; dos nombres de error que valen a la vez; comparaciones con «=» y feedback falso con un término común; «suma arriba y abajo» aplicada sobre una forma que no se ve | sin publicar · `hechos/reabiertas/107--…-revision.md` (MEDIO) |
| `equivalentes` (100) y `compara` (102), reabiertas por la 109; `fraccion-de` (103) y `suma-resta` (104), por la 110 | siguen sin cerrar (sin reclamo a las 18:4x UTC) | sin publicar; no se han podido reverificar |

**Quién las publica ahora.** La 111 era la última tarea de publicación de la U4, así que **hace falta una más** (como la 115 para la U3):
la coordinadora la da de alta cuando cierren las siete reabiertas, o antes con «publica las que hayan cerrado». Plazos:
**100 y 102 antes del jue 10-12** (tarea de la semana 1, lun 14-12), **103 y 104 antes del jue 17-12** (semana 2, lun 21-12), **105, 106 y
107 antes del mar 22-12** (semana 3, lun 11-1; límite jue 7-1). Las siete reabiertas son MEDIO y tocan carpetas disjuntas: caben a la vez.

## Cómo se revisó
- **Regla de oro, nada que no se haya dado, realismo, feedback, inglés y casos fijos**: tres revisiones en paralelo (subagentes de esta
  sesión, solo lectura), 3000 ítems por ejercicio con las funciones de cada `logica.js` y 30-40 ítems leídos enteros en es y en; lo que
  bloquea, comprobado después en el código por esta sesión (`opcionesDePaso` de `7/12 − 1/2 · 4` y de `(1/2 − 3/2) : 3/5`;
  `FRASES_PARTE` sin «irreducible»; el texto de `suma-multiplicando-denominadores`).
- **Navegador con clics** (Chrome headless por CDP, guion en `capturas/prueba.mjs`, servidor propio en el 8111, «Probar sin código», 375 y 1100 px, es y en): acierto y
  fallo de cada ejercicio de las tres prácticas (20 + 12 + 12 pasadas por idioma y ancho, 88 en total). Fracciones con raya bien, campo con
  raya y +/− bien a 375 px, sin desbordes ni errores de consola. Lo vio también el navegador: «En el dibujo: 1 trozos de 15» y el aviso de
  signos a quien había puesto bien el signo (`multiplica-divide`).
- **Ninguna práctica copia un caso con número de las hojas o del examen final**, salvo los ejemplos de las introducciones de
  `multiplica-divide` (y `2/3 : 4/5` en la de `errores4`), que coinciden con la propuesta del examen semanal 3
  (`exámenes-semanales/semana-3/destrezas-semana3.md`, sin firmar). Se arreglan en las reabiertas.

## Sesión mínima de cada ejercicio (para la tarea de la semana)
Semana 3 de la unidad: sesión 9 lun 11-1 (inversa y cociente), 10 mar 12-1 (combinadas, problemas «del resto»), 11 jue 14-1 (repaso con la
tabla de errores), **examen final el vie 15-1**. El producto, la fracción de una fracción y las potencias son de la sesión 7 (jue 7-1), y la
tarea de la semana 2 los dejó para esta (propuesta de la 110). Como en la 93 y la 109, lo de la sesión del día del plazo va «a elegir».

| Ejercicio | Destrezas | Sesión |
|---|---|---|
| `multiplica-divide` 1 Multiplica | U4-2C-08, 2C-09 (nuclear), 2C-10; con negativa, 3C-10 | 7 (9-10 con negativa) |
| `multiplica-divide` 2 La fracción de una fracción | U4-2C-11 (nuclear), 2A-06 | 7 |
| `multiplica-divide` 3 La inversa | U4-3C-05 (nuclear) | 9 |
| `multiplica-divide` 4 Divide | U4-3C-06, 3C-07 (nucleares), 3C-10 | 9 |
| `multiplica-divide` 5 Potencias | U4-2C-12 | 7 |
| `combinadas-fracciones` 1 ¿Cuál primero? | U4-3A-01, 3A-02 (nucleares) | 10 (usa el cociente) |
| `combinadas-fracciones` 2 Un paso cada vez | U4-3A-01, 3A-02, 3C-09 (nucleares), 3C-10 | 10 |
| `combinadas-fracciones` 3 Caza el error (orden o cálculo) | U4-3A-01, 3A-02 | 10 |
| `errores4` 1, 2 y 3 | U4-3C-09 (s10), 3C-11 (nuclear, s11); una de cada cuatro plantillas es un cociente | 11 |

## Propuesta de la tarea de la semana 3 (para que Juan Luis la monte en el panel; no está creada)

`U4 · Semana 3 · Multiplicar, dividir y combinadas` / `U4 · Week 3 · Multiplying, dividing and mixed operations` · `unidad: 4` ·
`desde: '2027-01-11'` · `hasta: '2027-01-14'` (de lunes a jueves, como las demás; el examen final es el vie 15-1).

### Plan A (con las tres publicadas tras sus reabiertas): 7 ★ + 3 a elegir = 100 puntos
| | Ejercicio | Destreza (sesión) | Publicado |
|---|---|---|---|
| ★ | `['ortografia', 7]` Comas que cambian el significado | — (calendario del 25-10) | sí |
| ★ | `['multiplica-divide', 1]` Multiplica | U4-2C-09 nuclear (7) | tras la reabierta |
| ★ | `['multiplica-divide', 2]` La fracción de una fracción | U4-2C-11 nuclear (7) | tras la reabierta |
| ★ | `['multiplica-divide', 3]` La inversa | U4-3C-05 nuclear (9) | tras la reabierta |
| ★ | `['multiplica-divide', 4]` Divide | U4-3C-06, 3C-07 nucleares (9) | tras la reabierta |
| ★ | `['combinadas-fracciones', 1]` ¿Cuál primero? | U4-3A-01, 3A-02 nucleares (10) | tras la reabierta |
| ★ | `['combinadas-fracciones', 2]` Un paso cada vez | U4-3A-01, 3A-02, 3C-09 nucleares (10) | tras la reabierta |
| elegir | `['multiplica-divide', 5]` Potencias | U4-2C-12 (7) | tras la reabierta |
| elegir | `['combinadas-fracciones', 3]` Caza el error | U4-3A-01, 3A-02 (10) | tras la reabierta |
| elegir | `['errores4', 1]` ¿Bien o mal? | U4-3C-11 nuclear (11, jue 14-1) | tras la reabierta |
| elegir | `['errores4', 2]` La línea mala | U4-3C-11 nuclear (11) | tras la reabierta |
| elegir | `['errores4', 3]` Arréglalo | U4-3C-09, 3C-11 (11) | tras la reabierta |
| elegir | `['suma-resta', 4]` ¿Qué queda? | U4-2A-01 nuclear (6), repaso | tras su reabierta |

```js
  estrella: [['ortografia', 7], ['multiplica-divide', 1], ['multiplica-divide', 2], ['multiplica-divide', 3], ['multiplica-divide', 4], ['combinadas-fracciones', 1], ['combinadas-fracciones', 2]],
  elegir: [['multiplica-divide', 5], ['combinadas-fracciones', 3], ['errores4', 1], ['errores4', 2], ['errores4', 3], ['suma-resta', 4]],
  nElegir: 3,
```
`errores4` va entero «a elegir» porque su destreza principal (U4-3C-11) se reúne en la sesión 11, el día del plazo; quien la haga antes del
jueves practica para el final, y es la mejor preparación del examen del viernes.

### Plan B (si alguna no se publica a tiempo)
- Sin `multiplica-divide`: no hay tarea de la semana 3 que valga (lleva el producto y el cociente); mejor retrasarla que mandarla sin ella.
- Sin `combinadas-fracciones`: ★ ortografía y `multiplica-divide` 1-5 (60) + 4 a elegir entre `errores4` 1-3, `suma-resta` 2 y 4 y
  `fraccion-de` 4 (los que estén publicados).
```js
  estrella: [['ortografia', 7], ['multiplica-divide', 1], ['multiplica-divide', 2], ['multiplica-divide', 3], ['multiplica-divide', 4], ['multiplica-divide', 5]],
  elegir: [['errores4', 1], ['errores4', 2], ['errores4', 3], ['suma-resta', 2], ['suma-resta', 4], ['fraccion-de', 4]],
  nElegir: 4,
```
- Sin `errores4`: el plan A con `['suma-resta', 2]`, `['simplifica', 3]` y `['fraccion-de', 4]` en su lugar entre los «a elegir».

### Destrezas nucleares de la semana 3 sin ejercicio en la tarea
- **U4-3A-03 y U4-3A-04** (el problema «del resto» y el total al final de un problema «del resto», sesión 10): **ninguna práctica las
  cubre** (ya lo dijo la 98). Son el problema que sale todos los años en sus exámenes; si Juan Luis quiere práctica en la app, hace falta
  un ejercicio nuevo (en `fraccion-de` o en `combinadas-fracciones`) o una práctica nueva.
- **U4-3B-01** (vocabulario del cociente: *divided by*, *quotient*, *reciprocal*): solo en `leelo4`, que mezcla sesiones (la 109 la dejó
  fuera de las tareas semanales).
- **U4-3C-11**, solo «a elegir» (sesión 11, día del plazo).

## Hallazgos que no bloquean (decide Juan Luis)
- `combinadas-fracciones`: un 8 % de los ítems obliga a un m.c.m. de 49 a 72 (novenos con octavos); la revisión propone bajar la cota de los
  pasos de 72 a 36 o 48. Negativas en el 31 % de los enunciados (la ficha pedía en torno a un cuarto).
- `errores4`: el nombre del error se adivina por eliminación (los dos distractores son siempre de otra operación); la línea mala es la 2 en
  el 74 % de los ítems del ej. 2; U4-3C-12 («lo que no es un error») sin ítems (propuesta de la 107).
- `multiplica-divide`: `naturalPorAmbos` de `_comun/fracciones.js` pierde el signo con un natural negativo (afecta al diagnóstico, no a la
  corrección); es de la base.
- `jerarquia-enteros` (U3, publicada): la revisión sospecha el mismo mensaje de «izquierda» en fallos de jerarquía que en
  `combinadas-fracciones` (misma lógica en `logica.js` ~217). No medido; si Juan Luis quiere, una reabierta de la 87.

## Cómo comprobarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/multiplica-divide/?ejercicio=2 («Probar sin código»): escribe la fracción sin simplificar
que da el dibujo y falla, aunque el enunciado no pide simplificar. http://localhost:8080/practicas/combinadas-fracciones/?ejercicio=2 hasta un
último paso con resta: una de las opciones es «izquierda a derecha». `npm test` (1334/1334 a las 18:4x UTC del 28-10).
