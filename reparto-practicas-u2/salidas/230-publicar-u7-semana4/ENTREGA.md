# ENTREGA tarea 230 · Revisión y publicación del paquete 4 de la unidad 7 — PRIMERA PASADA (PARCIAL), con la segunda pasada del paquete 3

Sesión `s-20261128T155528-114b5029` (28-11-2026, desde las 15:55 UTC), lanzada por el lanzador automático, sin nadie delante.

**Por qué empezó con la 229 en PARCIAL.** El lanzador dio la 229 por LISTA, pero su terminada es PARCIAL (primera pasada, nada publicado). Sus ocho
reabiertas (213, 214 y 216-221) habían cerrado entre las 15:04Z y las 15:50Z, nadie tenía reclamada la 229 y esta ficha manda revisar y publicar «lo
que la 229 dejara reabierto y ya esté cerrado». Así que esta tarea hizo **la segunda pasada del paquete 3** y después la primera del paquete 4, en
serie y en la misma sesión (comparten `catalogo.js` y `docs/practicas-unidad7.md`). Precondiciones del paquete 4 comprobadas en `hechos/`: 222 y
223 LISTAS; en el reparto de la U7, la hoja 4 de la tarea 10 (cerrada el 26-11) y el examen 4 de la tarea 23 (cerrado el 27-11). Pages, en verde
antes de empezar y después de cada push.

## Qué se publicó

Commit **1774f6b**: `disponible: true` de **`tres-escrituras`, `tanto-por-ciento`, `que-porcentaje` y `descuentos`** (ids 90-93) en `catalogo.js`,
y `docs/practicas-unidad7.md` (filas de los paquetes 3 y 4 en §6, «Publicadas» y el estado de los dos paquetes). `npm test` 2856/2856.

| Práctica | Resultado | Reabierta |
|---|---|---|
| `tres-escrituras` (218) | **Publicada.** Todo bien | — |
| `tanto-por-ciento` (219) | **Publicada.** Saca, en muy pocos ítems, el repaso del examen 4; el feedback pierde el espacio duro | `hechos/reabiertas/219--s-20261128T155528-114b5029-revision.md` (sigue publicada) |
| `que-porcentaje` (220) | **Publicada.** Saca, en muy pocos ítems, el repaso del examen 4 | `220--…-revision.md` (sigue publicada) |
| `descuentos` (221) | **Publicada.** Saca, en muy pocos ítems, el repaso del examen 4; espacios corrientes ante «%» en las introducciones (menor) | `221--…-revision.md` (sigue publicada) |
| `escalas` (222) | **No se publica**: casos de la hoja 4 y del examen 4 (reserva vacía), miles con espacio corriente, «1 200», «1 cm del plano» en mapas y maquetas | `222--…-revision.md` |
| `unidades` (223) | **No se publica**: casos de la hoja 4 y del examen 4 (reserva vacía), «murcia a cartagena» y «1.º de eso» en el feedback, «1 000 kg» y «3 250 m» | `223--…-revision.md` |
| `directa-o-inversa` (216) | Sigue publicada; saca la pregunta de repaso del examen 4 en 59 de 200 000 ítems del ej. 3 | `216--…-revision.md` |
| `regla-de-tres` (214) | Sigue publicada; menor: el feedback pierde el espacio duro | `214--…-revision.md` |

Las reabiertas de las publicadas tienen plazo **antes del lun 1-3** (la portada enseña la U7 desde ese día); las del paquete 4, **antes del jue 8-4**
(mejor antes del jue 18-3). Las listas de reserva, calculadas con las funciones de cada práctica y **simuladas (dan 0)**:
`hechos/notas/s-20261128T155528-114b5029-reserva-{escalas,unidades,repaso-examen4}.md` (la hoja en claro; el examen, solo huellas).
**Siguiente**: cuando cierren la 222 y la 223 (MEDIO, de 30 a 40 min), una segunda pasada de la 230 (ALTO) repite barrido, cotejo y clics de las dos y
las publica.

## Cómo se revisó (copias de HEAD en /tmp/pu2-230-114b/arbol, con el parche de `window.__item` solo en la copia)

- **Paquete 3, segunda pasada**: los guiones de la 229 (`barrido.mjs`, `clics.mjs`, `cotejo-repaso.mjs`) sobre HEAD 9750a01, con las mismas semillas.
  Regla de oro, 0 fallos en los 17 ejercicios; cotejo con la hoja 3 y el examen 3, **0** en todos los ejercicios (por el ítem entero; en
  `tres-escrituras` ej. 3 y 4 las fichas sueltas coinciden con conversiones de la hoja, como en la primera pasada, y no son el caso); variedad,
  máximo 8,47 %; clics, **68/68** (es/en, 375/1200 px, acierto y fallo; tres recorridos se repitieron por el corte conocido de `http.server`).
  El repaso del examen 3 contra lo publicado de los paquetes 1 y 2 (200 000 ítems por ejercicio): **0** en los 21 ejercicios.
- **Paquete 4**: un barrido nuevo (`barrido-p4.mjs`, 20 000 ítems por ejercicio, semillas 2300NN, fracciones exactas): regla de oro por valor (en
  `escalas` ej. 3, las cuatro escalas de valor distinto; ej. 4, una sola con el dibujo de 5 a 30 cm y las otras por debajo de 1 cm o por encima de
  60 cm; en `unidades` ej. 2 y 3, cuatro valores distintos; ej. 5, una sola unidad creíble), que la buena tecleada se acepte con y sin unidad, cotas,
  cuentas, variedad y textos (enunciado, opciones, explicación del «No lo sé», el porqué de cada error con los números del ítem e introducciones).
  Clics, **36/36** (`escalas` y `unidades`, fecha del navegador lun 12-4-2027). Capturas leídas a mano a 375 px.
- **Cotejo con el papel**, por valor y sin contexto: la hoja 4 en claro y el examen 4 (`casos-examen-semana4.tsv`) solo en /tmp
  (`papel4-PRIVADO.mjs`). En escalas, el caso es la escala y la medida del plano (la real sale de las dos); en los cambios de unidad, la pareja de
  unidades sin sentido y el valor en la unidad base; en «¿Qué unidad?», el objeto del banco.
- **El repaso del examen 4** (preguntas 17-20: U7-3C-04, 3A-05, 3A-02 y 2A-02) contra las cuatro del paquete 3 (20 000 ítems por ejercicio) y contra
  lo publicado de los paquetes 1 y 2 (200 000), con el `huellasDe` de cada práctica (`barrido-repaso4.mjs`, `cotejo-repaso4.mjs`).

## Recuentos del cotejo del paquete 4 (ítems de 20 000 con un caso del papel, sin reserva; nunca los casos del examen)

| Práctica · ejercicio | Hoja 4 | Examen 4 |
|---|---|---|
| `escalas` ej. 1 · 2 · 3 · 4 | 476 · 490 · 446 · 0 | 695 · 674 · 732 · 0 |
| `unidades` ej. 1 · 2 · 3 · 4 · 5 | 9 · 4 · 8878 · 362 · 1623 | 1 · 2 · 4620 · 351 · 2575 |

Con las listas de reserva simuladas, **0 en todo**, salvo ¼, ½ y ¾ de hora en `unidades` ej. 3, que se dejan a propósito: son la tabla del
«Recuerda» de la hoja 4, como los seis porcentajes fáciles de `tres-escrituras` (la 229 no los reservó). El repaso del examen 4: `tanto-por-ciento`
14 · 5 · 12 · 1; `que-porcentaje` 5 · 9 · 0 · 4; `descuentos` 10 · 4 · 0 · 1 · 0 (de 20 000); `directa-o-inversa` ej. 3, 59 de 200 000; todo lo demás, 0.
Con las huellas de la nota, 0.

## Lo que está bien en el paquete 4

- **Regla de oro: 0 fallos** en los nueve ejercicios. En `unidades` ej. 4, los errores «pegar cifras» y «decimales como unidad pequeña» dan la buena
  cuando las cifras ya cuadran (10 m 34 cm = 1034 cm): ahí no son errores y la práctica da el acierto, que es lo correcto.
- **Cotas y exactitud**: escalas del acta (planos 1 : 50 a 1 : 200, mapas 1 : 25 000 a 1 : 1 000 000, maquetas 1 : 18, 1 : 24, 1 : 43, 1 : 87), plano
  de 0,5 a 30 cm, la medida real creíble para cada objeto, ninguna escala sobre un área; cambios de 1 a 3 saltos con resultado de 0,01 a 9999; horas
  en cuartos (acta, punto o); sin superficie ni volumen (acta, punto n).
- **Variedad**: ningún ítem por encima del 10 % (máximo, 7,74 %, `unidades` ej. 3; con la reserva, 9,3 %).
- **Navegador**: 36 recorridos limpios, también a 375 px.

## Hallazgos para Juan Luis y la coordinadora (no son de esta tarea)

1. **El lanzador lee una terminada PARCIAL como LISTA.** Me abrió con «la 229 ya está LISTA» y la 229 estaba PARCIAL (su tablón lo decía: «La 230 sigue
   BLOQUEADA»). Aquí salió bien porque esta ficha cubre lo que queda de la 229, pero al cerrar esta en PARCIAL el lanzador puede lanzar la 231
   (precondición: 230 LISTA) sin que nadie haga la segunda pasada del paquete 4. Incidencia: `hechos/incidencias/s-20261128T155528-114b5029.md`.
2. **La descripción de `unidades` en la portada habla de superficie** (`practicas/portada.js`, línea 281: «de longitud, de masa, de capacidad y de
   superficie» / «length, mass, capacity and area»), que el acta (punto n) manda a la U8, y no dice nada del tiempo, que sí está (ej. 3, «Horas y
   minutos»). Propuesta: «Cambia de unidad de longitud, de masa y de capacidad, pasa horas a minutos y al revés, de complejo a incomplejo, y elige
   la unidad sensata.» / «Convert units of length, mass and capacity, change hours to minutes and back, change between mixed and single units and
   choose a sensible unit.» La portada no es de esta tarea: tiene que cambiarse antes de que la segunda pasada publique `unidades`.
3. **La portada enseña el bloque «Semana 4» sin fecha**: si el paquete 4 se publica antes de las vacaciones (jue 18-3), estará a la vista casi un mes
   antes de su sesión (lun 12-4). Como en la 229 con `descuentos`, no estorba; si lo quieres aparte, un subtítulo en `portada.js` («desde el lun 12-4»).
4. **El espacio duro se pierde** en el feedback de `tanto-por-ciento` y `regla-de-tres` (`.replace(/\s+/g, ' ')`: en JavaScript `\s` incluye U+00A0).
   Ya está en sus reabiertas; lo digo porque la misma línea está también en `combinadas-fracciones`, `suma-resta`, `fraccion-de` y
   `problemas-ecuaciones` (U4 y U6), que no se han mirado.

## Propuesta de la tarea semanal del paquete 4 (para Juan Luis; no está creada: la monta la 232 en el panel y la programa en Classroom la tarea 40 del reparto de la U7)

`U7 · 4 · Escalas y unidades de medida` / `U7 · 4 · Scales and units` (el nombre lo decide Juan Luis en la 232) · `unidad: 7` ·
`desde: '2027-04-12'` · `hasta: '2027-04-15'` (sale el **lun 12-4 a las 8:00**; entrega el **jue 15-4 a las 23:59**; la prueba 4 es el vie 16-4).
Sesiones (inventario): 16 lun 12-4 (escalas), 17 mar 13-4 (la escalera, las no nucleares, complejo e incomplejo, elegir la unidad), 18 jue 15-4 (el
tiempo; el día del plazo, así que va «a elegir»). 10 puntos por ejercicio.

**El ★ de ortografía**: `['ortografia-tildes', 4]` Las palabras de Matemáticas, de la fila «U7 · 4» de `comun/CALENDARIO-CURSO-2026-27.md` («lun 12-4»;
la puso la tarea 03 de la U7 el 24-11); el bloque `ortografia-tildes` (id 64) sigue con `disponible: true`. No se corre nada: la U7 tiene cinco filas, una
por paquete, y la 229 usó la `3`.

### Plan A (con `escalas` y `unidades` publicadas): 8 ★ + 2 a elegir = 100 puntos

| | Ejercicio | Destreza (sesión) |
|---|---|---|
| ★ | `['ortografia-tildes', 4]` Las palabras de Matemáticas | — (ortografía) |
| ★ | `['escalas', 1]` Del plano a la realidad | U7-4A-01, 4C-01 (16) |
| ★ | `['escalas', 2]` De la realidad al plano | U7-4A-02 (16) |
| ★ | `['escalas', 3]` ¿Qué escala es? | U7-4C-02 (16) |
| ★ | `['unidades', 1]` Longitud | U7-4C-04, 4C-07 (17) |
| ★ | `['unidades', 2]` Masa y capacidad | U7-4C-05, 4C-06, 4C-07 (17) |
| ★ | `['unidades', 5]` ¿Qué unidad? | U7-4C-03 (17) |
| ★ | `['descuentos', 1]` En dos pasos | U7-3A-05 (12; repaso del examen 4) |
| elegir | `['escalas', 4]` ¿Qué escala le va? | U7-4C-01, 4C-02 (16) |
| elegir | `['unidades', 3]` Horas y minutos · `['unidades', 4]` Complejo e incomplejo | U7-4C-10 (18); U7-4C-08 (17) y 4C-10 (18) |
| elegir | repaso para la prueba 4: `['tanto-por-ciento', 4]` Problemas · `['que-porcentaje', 2]` ¿De cuánto? · `['inversa', 3]` Problemas | U7-3C-04, 3A-02, 2A-02 (las de repaso del examen 4) |

Los ★ de contenido cubren las seis nucleares del paquete 4 de las sesiones 16 y 17 (U7-4A-01, 4A-02, 4C-01, 4C-04, 4C-05 y 4C-06). La séptima,
U7-4C-10 (el tiempo, sesión 18), se da el mismo día del plazo y va «a elegir», como pide la ficha. U7-4A-03 (el mapa sin escala), U7-4A-04 (un cambio
de unidad dentro de un problema) y U7-4C-09 (sumar medidas) no tienen práctica (§7 de `docs/practicas-unidad7.md`, «sin práctica»); U7-4A-05 va
en `problemas-proporcion` (paquete 5).

### Planes B y C (si alguna no llega publicada al jue 8-4)

- **Sin `unidades`**: sus tres ★ pasan a `['escalas', 4]`, `['tanto-por-ciento', 4]` y `['que-porcentaje', 2]`; «a elegir», `['inversa', 3]`,
  `['descuentos', 3]` y `['que-porcentaje', 4]`. Lo de las sesiones 17 y 18 queda solo en la hoja 4 y en clase.
- **Sin `escalas`**: sus tres ★ pasan a `['unidades', 4]`, `['tanto-por-ciento', 4]` y `['que-porcentaje', 2]`; «a elegir», `['unidades', 3]` y el repaso.
- **Plan C, sin ninguna**: ★ ortografía, `['descuentos', 1]`, `['descuentos', 3]`, `['tanto-por-ciento', 4]`, `['que-porcentaje', 1]`, `['que-porcentaje', 2]`,
  `['que-porcentaje', 4]` e `['inversa', 3]`; «a elegir», `['regla-de-tres', 3]`, `['repartos', 2]` y `['tres-escrituras', 2]`. Todo repaso: avisarlo en
  la tarea.

## Propuestas (para la coordinadora)

1. **Lanzador**: que una terminada que empieza por «PARCIAL» no cuente como LISTA para las precondiciones (incidencia de esta sesión).
2. **`portada.js`**: la descripción de `unidades` (hallazgo 2), antes de la segunda pasada de la 230. Es un fichero común: una tarea corta aparte, o
   que la segunda pasada de la 230 lo declare en sus «Ficheros que toca».
3. **La 231** (paquete 5 y `errores7`): cotejar también el repaso del examen 5 y del examen final contra **todo** lo publicado, como aquí y en la 229.

## Cómo comprobarlo en 1 minuto

`npm run servir` y http://localhost:8080/practicas/tanto-por-ciento/?probar=1&idioma=es (ej. 4, fallar: «el 50» / «%» partidos a 375 px) y
http://localhost:8080/practicas/unidades/?probar=1&idioma=es (ej. 5, fallar en «La distancia de Murcia a Cartagena…»: «murcia a cartagena» en
minúscula). Los guiones de la revisión, en /tmp/pu2-230-114b (se pierden al reiniciar el Mac).
