# ENTREGA tarea 156 · Revisión y publicación de la semana 1 de la unidad 6

Sesión s-20261117T023530-f7aa1ea7 (relevo de s-20261116T233507-987369cb, que a su vez relevó a s-20261116T133235-a95571ce; ninguna de las
dos cerró). **PARCIAL**: se publican `traduce` y `valor-numerico`; `terminos-semejantes` y `leelo6` se reabren y no se publican.

Commits: 0d2a58d (`practicas/_comun/catalogo.js`, `docs/practicas-unidad6.md`). `npm test` 2449/2449 (antes y después del commit).

## Cuarta pasada (18-11, s-20261118T075702-4c9a28a4): la 156 queda LISTA

Quedaba una práctica, `leelo6`, porque `terminos-semejantes` la publicó la 157 el 18-11 (52ad72e). `leelo6` se ha vuelto a revisar
después de 5374976, sobre una copia de ed82f09, con el mismo criterio y la misma semilla que abajo.
- **Cotejo**: ya no sale ningún caso de las hojas 1-4, los exámenes 1-4, los cuestionarios 1-4 ni los finales en los ej. 2-4. Tampoco
  sale ninguno recorriendo todo el espacio de los generadores con la x (16853 casos, 370 de ellos reservados). Solo coincide el
  vocabulario, que no se reserva: 2x, 3x, x/2, x/3, x ± 1 y x + 2, en 2439 ítems.
- **Bien**: sale solo la x, ningún ítem pasa del 1,5 %, ningún ítem tiene dos opciones buenas y los tests pasan (65/65). Los clics, a 375 y
  1100 px, en español y en inglés, con un acierto y un fallo por ejercicio, salen sin errores de JavaScript ni desbordes.
- **No se publica: está reabierta** (`hechos/reabiertas/155--s-20261118T075702-4c9a28a4-revision.md`), por dos fallos:
  - en el ej. 3, dos opciones falsas que dicen lo mismo, en 3600 de 20000 ítems (por ejemplo «Simplifica la expresión.» y
    «Simplifica la expresión agrupando los términos semejantes.»);
  - en el ej. 4, «One years ago» (h = 1).
- **Y no va en la semana 1 aunque se arregle.** La trampa de esta ficha dice que una práctica de toda la unidad que no filtra por sesión
  no va en la semana 1, y `leelo6` tiene vocabulario de los problemas de la sesión 13: unos 7000 de los 40000 ítems de los ej. 1 y 4. La
  publica la **159** (semana 4), como proponían esta ENTREGA (propuesta 1) y la terminada de la 155. **Falta añadirlo a la ficha 159**,
  y eso le toca a la coordinadora.

Con esto, la semana 1 queda resuelta: `traduce`, `valor-numerico` y `terminos-semejantes` están publicadas. **La tarea semanal 1 va con el
plan A** (abajo): ya no hace falta el plan B.

De paso, la publicación de GitHub Pages llevaba en rojo desde las 00:40Z del 18-11. La 148 (8c5aebf) importaba
`practicas/es-solucion/reserva.js` sin haberlo comiteado, y por eso tampoco se había publicado `terminos-semejantes`. Se ha subido en
ed82f09.

## Qué se ha revisado y cómo

Dos pasadas. La primera (s-20261116T233507-987369cb, 16-11 noche) reabrió 145, 146 y 147
(`hechos/reabiertas/14N--s-20261116T233507-987369cb-revision.md`); las tres se cerraron entre las 00:04Z y las 00:14Z del 17-11 (b3b0532,
1b19e09, badfdcb), sin prueba en navegador. Esta segunda pasada vuelve a revisar las tres sobre HEAD y hace la primera revisión completa de
`leelo6`:

- **Con clics** (CDP, `Input.dispatchMouseEvent`) sobre una copia de HEAD servida en local, a 375 y 1100 px, en español y en inglés: un ítem
  acertado y uno fallado en cada ejercicio de las cuatro prácticas (14 ejercicios × 4). Sin errores de JavaScript, sin diálogos y sin
  desbordes horizontales. Los feedbacks de fallo se han leído a 375 px.
- **Cotejo de casos**: 20000 ítems por ejercicio, semilla 156000 + nº de ejercicio, idioma alterno, contra la hoja 1 (en claro) y, por
  huella de la forma canónica calculada fuera del repositorio, el examen 1, el repaso del examen 2 y los cinco finales (`leelo6`, al ser de
  toda la unidad, contra las hojas 1-4, los exámenes 1-4, los cuestionarios y los finales). Criterio: la misma tarea con sus datos (la frase con
  sus números, la expresión con el mismo valor de x, la suma sin reducir…); el vocabulario y las construcciones sin número propio no son casos.
- **Regla de oro** (ninguna opción equivalente a otra por forma canónica ni por solución, la buena única), **variedad** (ningún ítem en más
  del 10 % de un ejercicio, criterio de la coordinadora del 13-11), **realismo** (las cotas de cada `COTAS`), notación del acta.

## Resultado

| Práctica | Casos del papel | Regla de oro | Variedad (máx.) | Clics | Veredicto |
|---|---|---|---|---|---|
| `traduce` (145) | 0 en los 4 ejercicios | 0 fallos | 11,3 % (ej. 1) | bien | **publicada**; reabierta corta |
| `valor-numerico` (146) | 0 en los 3 | 0 fallos | 0,9 % | bien | **publicada**; reabierta corta |
| `terminos-semejantes` (147) | 0 en los 4 (63 claves de hoja, 175 huellas) | 35 de 20000 en el ej. 4 | 8,9 % | bien | **no se publica**: reabierta |
| `leelo6` (155) | 1820 ítems del ej. 2, 189 del ej. 3 y 604 del ej. 4 con casos del papel | 919 de 20000 en el ej. 3 | 1,5 % | bien | **no se publica**: reabierta |

Recuentos (casos distintos del papel que salen · ítems de 20000), con el código de HEAD:

| | Hoja 1 | Examen 1 | Repaso examen 2 | Finales |
|---|---|---|---|---|
| `traduce` ej. 1-4 | 0 · 0 | 0 · 0 | 0 · 0 | 0 · 0 |
| `valor-numerico` ej. 1-3 | 0 · 0 | 0 · 0 | 0 · 0 | 0 · 0 |
| `terminos-semejantes` ej. 1-4 | 0 · 0 | 0 · 0 | 0 · 0 | 0 · 0 |

`leelo6` (de toda la unidad), por papel: en el ej. 2, 18 casos de la hoja 1, 20 de la hoja 2, 19 del examen 1 y 13 del cuestionario 1, entre otros; el detalle por papel está en su reabierta. El ej. 1 (vocabulario) no tiene casos.

## Reabiertas

- `hechos/reabiertas/145--s-20261117T023530-f7aa1ea7-revision.md` (sigue publicada): variedad del ej. 1 (seis construcciones sin número al
  10,7-11,3 %); la solución del ej. 4 repite la expresión («x + 8: x + 8.», 24 % de los ítems); tres huellas de examen sobrantes que delatan
  qué casos de la hoja están también en el examen.
- `hechos/reabiertas/146--s-20261117T023530-f7aa1ea7-revision.md` (sigue publicada): «sumar antes de multiplicar» cuando la cuenta resta
  (`3x − 3`); la ENTREGA nombra `2(x − 1)`.
- `hechos/reabiertas/147--s-20261117T023530-f7aa1ea7-revision.md` (**no se publica**): casos de examen en claro en su test, ya en
  origin/main (incidencia para Juan Luis: `hechos/incidencias/s-20261117T023530-f7aa1ea7.md`); ej. 4 con dos respuestas buenas en 35 de
  20000 ítems; cuatro defectos del feedback.
- `hechos/reabiertas/155--s-20261117T023530-f7aa1ea7-revision.md` (**no se publica**): casos del papel en los ej. 2-4 (con las 69 claves de
  hoja y las 85 huellas de examen propuestas, y `esReservado` en las doce plantillas de «Completa»); dos respuestas buenas en 919 ítems del
  ej. 3 («Suma 2» y «Resta -2»); las letras y, n, t sin definir (acta, punto b); tres defectos menores. La semana de publicación la decide la
  coordinadora (abajo).

## Propuesta de la tarea semanal 1 (para Juan Luis; no está creada: la monta la 160 en el panel y la programa en Classroom la tarea 34 del reparto de la U6)

`U6 · Semana 1 · El lenguaje algebraico` / `U6 · Week 1 · Algebraic language` · `unidad: 6` · `desde: '2027-02-01'` · `hasta: '2027-02-04'`
(sale el **lun 1-2 a las 8:00**; entrega el **jue 4-2 a las 23:59**; la prueba 1 es el vie 5-2). Sesiones: 1 lun 1-2 (de las palabras al
álgebra), 2 mar 2-2 (valor numérico y sucesiones), 3 jue 4-2 (términos semejantes). Como en la U5 (decisión de la 131: lo que se da la víspera
del plazo va «a elegir»), lo de la sesión 3, que se da **el mismo día** del plazo, va «a elegir». 10 puntos por ejercicio.

### Plan A (con `traduce`, `valor-numerico` y `terminos-semejantes` publicadas): 8 ★ + 2 a elegir = 100 puntos

| | Ejercicio | Destreza (sesión) |
|---|---|---|
| ★ | `['ortografia', 10]` Signos ¿ ¡ y espacios | — (ortografía) |
| ★ | `['traduce', 1]` Elige la expresión | U6-1A-01, 1A-02 nucleares, 1B-02 nuclear (1) |
| ★ | `['traduce', 2]` Escríbela | U6-1A-01, 1A-02 nucleares, 1A-04 (1) |
| ★ | `['traduce', 3]` Elige la frase | U6-1C-03, 1B-02 nuclear (1) |
| ★ | `['traduce', 4]` Situaciones | U6-1A-03 nuclear, 1A-05 (1-2) |
| ★ | `['valor-numerico', 1]` Sustituye y calcula | U6-1C-05, 1C-06 nucleares, 1C-07 (2) |
| ★ | `['valor-numerico', 2]` La tabla | U6-1C-05, 1C-06 nucleares (2) |
| ★ | `['valor-numerico', 3]` ¿Qué valor? | U6-1C-05 nuclear (2) |
| elegir | `['terminos-semejantes', 1]` ¿Semejantes? | U6-1C-12 nuclear (3) |
| elegir | `['terminos-semejantes', 2]` Coeficiente y parte literal | U6-1C-01, 1C-04 nucleares (3) |
| elegir | `['terminos-semejantes', 3]` Reduce | U6-1C-13, 1C-14 nucleares (3) |
| elegir | `['terminos-semejantes', 4]` Caza el error | U6-1C-15 nuclear (3) |

### Plan B (hoy: `terminos-semejantes` sin publicar): 8 ★ + 2 a elegir = 100 puntos

Los mismos 8 ★. «A elegir», dos del repaso que lleva la prueba 1 (secuenciación de la U6: una pregunta de la U3, sumar y restar enteros;
una de la U4, simplificar, que hará falta para `12x = 3`; una de la U5):

| | Ejercicio | Destreza |
|---|---|---|
| elegir | `['saltos', 3]` De izquierda a derecha | U3, sumar y restar enteros (repaso) |
| elegir | `['simplifica', 3]` De una vez | U4, simplificar (repaso, para `12x = 3`) |
| elegir | `['suma-resta-decimales', 1]` Alinea la coma | U5 (repaso) |

Si el lun 1-2 `terminos-semejantes` ya está publicada, plan A; si no, plan B.

`leelo6` no entra en la tarea 1: no filtra por sesión y más de la mitad de sus ítems son de las semanas 2-4; aunque se publicara a tiempo, no va en la tarea 1 (ver la propuesta 1).

## Propuestas (para la coordinadora)

1. **Quién publica `terminos-semejantes`** y `leelo6`. La 156 no puede publicar lo que se cierre después de ella. Propuesta: que la **157** (semana 2, también ALTO y dueña de `catalogo.js` cuando le toque) publique `terminos-semejantes` junto con las suyas en cuanto cierre su reabierta, y que `leelo6` vaya con la **159** (semana 4), como `leelo5` fue con la semana 2 de la U5: así no hace falta filtrar por sesión. Hay que añadirlo a las fichas 157 y 159 (eso es de la coordinadora).
2. **El nombre de `menos-que-al-reves`** en `_comun/algebra.js` (~776) lleva un ejemplo fijo («tres menos que un número» es x − 3) que sale
   en ítems sin el 3 (en `traduce`, 1001 ítems del ej. 1, 6593 del ej. 3 y 2508 del ej. 4 de cada 20000). Quitar el ejemplo del nombre, o que
   cada práctica lo dé con sus números. Es de la base (144): lo decide la coordinadora.
3. **`FRASES` sin coma en español** (`doble-mas`, `mitad-menos`), ya propuesto por la 145: `traduce` lo resuelve por su cuenta; las demás
   prácticas que usen `FRASES` heredarían la ambigüedad.
4. **`cantidad-caramelos` no sale nunca** en `traduce` (sus tres claves están en el papel) y U6-1A-03 pierde el «en total»; ya lo propuso la 145.

5. **`enPalabras` sin coma** en las lecturas de dos operaciones con fracción («x over three minus one», «equis partido por tres menos uno»;
   1695 ítems del ej. 2 de `leelo6`): la misma ambigüedad que `FRASES`. Es de la base.

## Hallazgos fuera de criterio (para Juan Luis)

- `valor-numerico`: siguen saliendo las sucesiones y los recuadros de la hoja 1 (11 huellas opcionales de la primera pasada), 10 ejemplos
  que solo están en las soluciones de la hoja 1 y 5 de los 8 casos lineales del cuestionario semanal 1 (Forms). No son la misma tarea o no
  son examen; se dejan.
- `terminos-semejantes`: la y sale ahora en el 46 % de los ítems del ej. 1 (en la primera pasada, el 20 %).
- `leelo6`: 153 ítems del ej. 1 enfrentan *letter*, *unknown* y *variable* (no son sinónimos, pero se parecen: vigilar).
- Casos de examen en claro en el repositorio público por el test de la 147 (badfdcb): **lo decide Juan Luis**, ver
  `hechos/incidencias/s-20261117T023530-f7aa1ea7.md` (lo más sencillo: cambiar esas dos sumas en el examen 1 y en los tres modelos del final).

## Cómo comprobarlo en 1 minuto

`npm run servir` y http://localhost:8080/practicas/traduce/?probar=1 (y `valor-numerico`): «Probar sin código». La portada no enseña la U6
hasta el 1-2-2027 (`UNIDADES.desde`): para verla antes, fecha de prueba en `unidadActual`.
