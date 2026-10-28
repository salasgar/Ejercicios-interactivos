# Entrega de la tarea 110 · Revisión y publicación de las prácticas de la semana 2 de la U4, y propuesta de su tarea

Sesión `s-20261028T175638-13228212`, 2026-10-28. **Sin commit de código**: no se ha publicado nada, así que `catalogo.js` no cambia.

## Resultado
| Práctica (tarea, id) | Veredicto | Estado |
|---|---|---|
| `fraccion-de` (103, 51) | **no pasa**: distractores del ej. 4 fuera de la cota, cotas del acta de la hora y la botella, concordancia con 1, casos reservados | sin publicar · `hechos/reabiertas/103--s-20261028T175638-13228212-revision.md` (MEDIO) |
| `suma-resta` (104, 52) | **no pasa, por poco**: la pizza del ej. 4 sale partida en hasta 60 trozos (35 % de sus ítems); una palabra partida a 375 px | sin publicar · `hechos/reabiertas/104--s-20261028T175638-13228212-revision.md` (MEDIO, corta) |
| `equivalentes` (100) y `compara` (102), reabiertas por la 109 | siguen sin cerrar (sin reclamo a las 18:1x UTC) | sin publicar; no se han podido reverificar |

**Quién publica ahora las cuatro**: la tarea de publicación siguiente, la **111** (semana 3), que según su ficha publica también las que
reabrió la anterior. Pero la 111 está BLOQUEADA hasta que cierren la 105, la 106 y la 107, y los plazos de estas cuatro son anteriores al suyo:
**100 y 102 antes del jue 10-12** (tarea de la semana 1, lunes 14-12) y **103 y 104 antes del jue 17-12** (tarea de la semana 2, lunes 21-12).
Hay margen (estamos a 28-10), pero si las cuatro reabiertas cierran y la 111 todavía no puede empezar, hace falta que la coordinadora dé de
alta una publicación suelta (como la 115 para la U3) o que Juan Luis encargue a la 111 solo esa parte. Las cuatro reabiertas son MEDIO,
tocan carpetas disjuntas y caben a la vez.

## Cómo se revisó
- **Regla de oro**: 3000 ítems por ejercicio con las funciones de cada `logica.js` (script en el scratchpad) y 30-40 leídos enteros en es y en.
  `fraccion-de` ej. 4: 0 opciones repetidas por valor. `suma-resta` ej. 4: 0 opciones equivalentes (comparadas con `hayEquivalentes`); ej. 5:
  en los 3000 ítems, exactamente una línea mal cuando la hay (recalculado con `lineaCorrecta`), ninguna cuando no, y la razón falsa
  siempre es otro error distinto. Ningún distractor que pueda darse por bueno.
- **Nada que no se haya dado**: `fraccion-de` es contenido de las sesiones 1-3 salvo el ej. 4 (variantes `dos` y `restante`, sesión 6);
  `suma-resta`, sesiones 5 y 6 (el ej. 5 se cita como U4-3C-11, de la sesión 11, pero solo usa errores de la suma de la sesión 5). Sin decimales,
  sin mixtos, sin productos; negativas solo en la suma y la resta (`suma-resta` ej. 1 y 3), como permite el acta para la semana 2.
- **Realismo**: cotas leídas en el código y contadas en 3000 ítems, también en los distractores; contra el acta del 26-10, punto j.
- **Regla 9**: contra `RESERVADOS_ANTERIORES` de `4. Fractions/hojas-de-ejercicios/comprobar-semana3.py` (los de las hojas 1 y 2).
- **Navegador con clics** (Chrome headless por CDP, servidor propio en el 8093, «Probar sin código», 375 y 1100 px, es y en): acierto y fallo de
  cada ejercicio de las dos prácticas (32 + 40 pasadas). Fracciones con raya bien, sin desbordes, sin excepciones en consola.

## Propuesta de la tarea de la semana 2 (para que Juan Luis la monte en el panel; no está creada)

`U4 · Semana 2 · Sumar y restar fracciones` / `U4 · Week 2 · Adding and subtracting fractions` · `unidad: 4` · `desde: '2026-12-21'` ·
`hasta: '2027-01-07'`. Sesiones de la tarea: 5 lun 21-12 (suma y resta: mismo y distinto denominador, con un natural, con negativas),
6 mar 22-12 (tres términos, ¿es razonable?, partes de un todo y lo que queda), **Navidad del 23-12 al 6-1**, 7 jue 7-1 (producto: **no entra**,
va en la tarea de la semana 3 con `multiplica-divide`). La prueba 2 es el vie 8-1.

**Cruza la Navidad**: son dos sesiones de contenido y dos semanas de vacaciones antes del plazo. Propongo que sea algo más larga, pero
**opcional por arriba**: los mismos 100 puntos obligatorios de siempre y un bloque de repaso de la semana 1 a elegir, para quien quiera
practicar en vacaciones (el panel ya admite elegir N de una lista más larga). Si Juan Luis prefiere que la Navidad cuente, la variante
«larga» de abajo pide 12 ejercicios y se pasa a 100 con ×100/120, como la tarea de las fichas del parchís (80 → ×100/80).

Los ejercicios de `fraccion-de` son contenido de la semana 1 (fracción de una cantidad, U4-1C-08 y los problemas 1A-01 a 1A-03, nucleares)
que la tarea de la semana 1 no pudo llevar porque la práctica es del bloque de la semana 2 (lo dijo la 109). Aquí van con ★.

### Plan A (con las dos prácticas publicadas tras sus reabiertas): 7 ★ + 3 a elegir = 100 puntos
| | Ejercicio | Destreza (sesión) | Publicado |
|---|---|---|---|
| ★ | `['ortografia', 6]` La coma del vocativo | — (calendario del 25-10) | sí |
| ★ | `['suma-resta', 1]` Mismo denominador | U4-2C-01 nuclear, 2C-07 nuclear (5) | tras la reabierta |
| ★ | `['suma-resta', 2]` Distinto denominador, paso a paso | U4-1C-16, 2C-02 nucleares; 2C-04 en pequeño (5-6) | tras la reabierta |
| ★ | `['suma-resta', 3]` Con naturales | U4-2C-03 nuclear, 2C-07 (5) | tras la reabierta |
| ★ | `['suma-resta', 4]` ¿Qué queda? | U4-2A-01 nuclear, 2A-04 (6) | tras la reabierta |
| ★ | `['fraccion-de', 1]` Calcula | U4-1C-08, 1C-09 (1) | tras la reabierta |
| ★ | `['fraccion-de', 4]` El problema | U4-1A-01, 1A-02, 2A-02, 2A-03 nucleares (3 y 6) | tras la reabierta |
| elegir | `['fraccion-de', 2]` Con contexto | U4-1A-01 (1) | tras la reabierta |
| elegir | `['fraccion-de', 3]` ¿Qué fracción es? | U4-1C-04, 1A-03 (1-3) | tras la reabierta |
| elegir | `['suma-resta', 5]` Caza el error | U4-3C-11 (con errores de la suma, 5) | tras la reabierta |
| elegir | `['simplifica', 3]` De una vez | U4-1C-14 (2), repaso | sí |
| elegir | `['equivalentes', 4]` Común denominador | U4-1C-16 (2), repaso | tras su reabierta |
| elegir | `['compara', 1]` Mayor o menor | U4-1C-17, 1C-19 (3), repaso | tras su reabierta |

```js
  estrella: [['ortografia', 6], ['suma-resta', 1], ['suma-resta', 2], ['suma-resta', 3], ['suma-resta', 4], ['fraccion-de', 1], ['fraccion-de', 4]],
  elegir: [['fraccion-de', 2], ['fraccion-de', 3], ['suma-resta', 5], ['simplifica', 3], ['equivalentes', 4], ['compara', 1]],
  nElegir: 3,
```
Variante «larga» por la Navidad: los mismos ★ y `nElegir: 5` (120 puntos, ×100/120 al calificar).

### Plan B (si alguna de las dos no se publica a tiempo)
- Sin `suma-resta`: no hay tarea de la semana 2 que valga (es la práctica central); mejor retrasar la tarea que mandarla sin ella.
- Sin `fraccion-de`: los ★ de `suma-resta` 1-4 y la ortografía (50) + `suma-resta` 5 ★ (60) + 4 a elegir entre repaso de la semana 1
  (`que-fraccion` 3, `simplifica` 1, 2 y 3, y `equivalentes` 4 y `compara` 1 si ya están).
```js
  estrella: [['ortografia', 6], ['suma-resta', 1], ['suma-resta', 2], ['suma-resta', 3], ['suma-resta', 4], ['suma-resta', 5]],
  elegir: [['que-fraccion', 3], ['simplifica', 1], ['simplifica', 2], ['simplifica', 3], ['equivalentes', 4], ['compara', 1]],
  nElegir: 4,
```

### Destrezas nucleares de la semana 2 sin ejercicio en la tarea
- **U4-2B-01** (vocabulario de la suma y la resta): solo en `leelo4`, tramo 2, que mezcla sesiones (la 109 la dejó fuera de las tareas semanales).
- **U4-2C-04** en versión grande (tres fracciones con denominadores como 168 y 140, m.c.m. por factorización): `suma-resta` 2 se queda en
  denominadores hasta 12 y m.c.m. ≤ 60 (propuesta pendiente de la 104).
- **U4-2C-09 y U4-2C-11** (producto y fracción de una fracción, sesión 7, el jue 7-1): en `multiplica-divide`, para la tarea de la semana 3.

## Hallazgos que no bloquean (decide Juan Luis)
- `suma-resta` ej. 2: fracciones sin simplificar en el enunciado (2/4, 2/8, 10/12) y un denominador común no mínimo cuenta como fallo aunque
  el resultado esté bien (coherente con que el paso se llama «m.c.m.»).
- `fraccion-de` ej. 4 enseña una opción en forma de fracción («da la fracción en vez de la cantidad») junto a tres cantidades: es falsa sin duda,
  pero se descarta por la forma, sin pensar; en el 59 % de los ítems hay una (1779 de 3000).
- `fraccion-de` ej. 4, `resta-el-numerador` da opciones como «984 kilómetros faltan» de 990: dentro de la cota, pero muy fáciles de descartar.

## Cómo comprobarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/fraccion-de/ y /suma-resta/ («Probar sin código»). Ej. 4 de `fraccion-de` hasta que salga una
pregunta «¿Cuántos alumnos tiene la clase?»: alguna opción es menor que el dato. Ej. 4 de `suma-resta` hasta una pizza con décimos y doceavos.
`npm test` (1334/1334 a las 18:2x UTC del 28-10).
