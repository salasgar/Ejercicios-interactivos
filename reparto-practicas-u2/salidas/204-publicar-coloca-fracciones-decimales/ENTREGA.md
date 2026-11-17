# Tarea 204 — revisión con clics de «Coloca los paréntesis. Con fracciones» (81, U4) y «Con decimales» (82, U5)

## Cuarta pasada (17-11, sesión `s-20261117T061533-12dd3186`, relevo de `s-20261117T031553-f80558bf`)

La tercera pasada (`s-20261117T031553-f80558bf`, 03:16Z) caducó a las 05:46:30Z sin cierre y sin dejar nada sin comitear: esta la
releva. **Veredicto: `coloca-decimales` PUBLICADA (commit 173b497).** Las dos prácticas de la tarea quedan publicadas. Solo se revisa
lo reabierto el 16-11 (`hechos/reabiertas/202--s-20261116T231631-e7593747.md`): el arreglo de 537d7d5 (en ≤ 400 px, `.expr` a 1rem y
huecos de 16 px; alto de 52 px intacto).

Publicar: `disponible: true` en la fila 82 de `catalogo.js` (nada más), y en `docs/practicas-unidad5.md` «Son ocho…» (con id 82 y
tarea 202), «Las ocho prácticas», la fila sin «Sin publicar» y la línea de publicadas («a 2026-11-17: las ocho»). El README sigue sin
sección de la U5: no se crea. La portada no enseña la U5 hasta el lun 18-1: publicarla ahora no la pone delante de nadie.

### Navegador (Chrome headless por CDP, clics de ratón, «Probar sin código»; guiones en el scratchpad)

**Renglón a 375 px** (375 × 800, móvil, DPR 2), en la página de la práctica, ítems de `generar(ej, crearRng(…))` escritos en la `.expr`
con el mismo marcado del editor (`M.htmlValor(v, idioma, { detras: false })`, `M.signo`, el `³`/`²` en su celda), cada uno medido sin
paréntesis y con «((» y dos «)» puestos; renglones contados por el centro de cada `.celda` y `.signo`; ancho necesario medido con
`flex-wrap: nowrap` por los extremos de los hijos (el `scrollWidth` no vale: con `justify-content: center` nunca baja del `clientWidth`):

| | ítems por idioma | medidas por idioma | partidos (es / en) | ancho máximo (es / en; hay 324 px) |
|---|---|---|---|---|
| ej. 1 | 6000 | 12 000 | 0 / 0 | 230 / 236 px |
| ej. 2 | 6000 | 12 000 | 0 / 0 | 212 / 212 px |
| ej. 3 (diana, cuatro) | 6000 | 12 000 | 0 / 0 | 301 / 307 px |

Sin desbordamiento horizontal en ninguna. **Peor caso inventado** dentro del rango de `unDecimal` (cuatro 9,99) con `+++`, `+·−`,
`−−−`, `···` y `:+·`, sin y con paréntesis: 1 renglón, 301-318 px en los dos idiomas. Antes del arreglo la segunda pasada medía 7
partidos de 3000 y 340 px. Huecos a 375 px: 16 × 52 px. Los `((` caben en el hueco de 16 px: con y sin paréntesis el ancho es el mismo.

**Solo como dato** (no es criterio): a 360 px (`.expr` de 309 px), 0 partidos en 3000 medidas por ejercicio e idioma con el generador.
El peor caso inventado sí se parte ahí con `+++`, `+·−` y `−−−` (312-318 px).

**Recorrido con clics** a 375 y 1200 px, es y en, los tres ejercicios (12 casos), entrando desde la portada («Probar sin código» → menú
con 3 ejercicios). Los clics se dan en el centro de cada botón, comprobando con `elementFromPoint` que nada lo tapa, también en los huecos
de 16 px. En los «todos»: un «(» sin cerrar («Falta algún paréntesis…» / «A bracket is missing…»), el borrar (huecos vacíos), la pista
en el ej. 2 (con 2 resultados, en el ej. 1, la pista acaba el ítem) y **todos los chips encendidos por clic** (2/2, 3/3, 4/4), con la
colocación de cada chip sacada de `logica.js` importada en la página. En la diana: «(» sin cerrar + Comprobar (aviso), borrar, un
**fallo** sin paréntesis («Eso da …, no …» y una agrupación que sí lo da, resuelta) y un **acierto** con la colocación del objetivo (pasa
solo al siguiente a los 2,6 s, sin botón). El «No lo sé» en cada uno (sale la explicación y el ítem siguiente es otro). **Consola limpia
en los 12.** Las cuentas de los 20 mensajes que salieron (4 fallos, 4 aciertos y 12 «No lo sé»), comprobadas a mano una a una: todas bien.

### Tests

Paso 2 de la ficha: 182/182. `npm test`: 2461/2461.

### Papel

Ningún `.tex` ni `.tsv` de `5. Decimals/` es más nuevo que el 16-11 a las 12:00, y `logica.js` no ha cambiado desde el 15-11: el barrido
de casos del papel de la primera pasada sigue valiendo (537d7d5 solo toca `estilos.css`).

### Propuesta para la tarea semanal (Juan Luis la cambia en el panel; no se ha tocado)

- **U5, semana 2 (tarea 24 del panel, la de la ENTREGA de la 132: 8 ★ + 2 a elegir de 10)**: añadir **`['coloca-decimales', 1]`,
  `['coloca-decimales', 2]` y `['coloca-decimales', 3]`** a «a elegir», sin cambiar `nElegir: 2`. Quedan 8 ★ + 2 de 13 = 10 ejercicios,
  10 puntos cada uno, 100 (tarea 166); añadir opciones a «a elegir» no cambia el peso. Las combinadas con un cuadrado son de la sesión 6
  (mar 26-1), dentro de esa semana. Como ★, solo si Juan Luis lo quiere. Todo lo que cita está publicado.
- La de la **U4, semana 3** (`coloca-fracciones` 1-3 a «a elegir» de la tarea 22) es la de la segunda pasada, sin cambios.

Para probarlas: https://salasgar.github.io/Ejercicios-interactivos/practicas/coloca-fracciones/?probar=1 y
https://salasgar.github.io/Ejercicios-interactivos/practicas/coloca-decimales/?probar=1

### Fuera de criterio (no obliga)

- Siguen en pie los tres de la primera pasada (abajo). El « · » entre frases de la penalización (`base.js`) se ve en todos los fallos
  de la diana.

---

## Segunda pasada (17-11, sesión `s-20261116T231631-e7593747`, encadenada tras la 203)

**Veredicto: `coloca-fracciones` PUBLICADA (commit d1088b9); `coloca-decimales` NO, se reabre otra vez la 202**
(`hechos/reabiertas/202--s-20261116T231631-e7593747.md`). Solo se revisa lo reabierto el 16-11: las reglas de 375 px de
793cb7f (201) y dbd2e4f (202): en ≤ 400 px, `.expr` a 1.1rem, huecos de 18 px y `.num`/`.signo` sin relleno lateral.

Publicar: `disponible: true` en la fila 81 de `catalogo.js` (nada más), y en `docs/practicas-unidad4.md` «Son once…», «Las once
prácticas», la fila sin «Sin publicar» y la línea de publicadas; en el `README.md`, «Once prácticas más» (ids 47-56 y 81) y la fila de
`coloca-fracciones` en la semana 3. La U5 sigue sin sección en el README: no se crea. `docs/practicas-unidad5.md` no se toca (sigue
diciendo «Sin publicar (la publica la 204)», que es verdad). La portada no enseña la U4 hasta el lun 14-12: publicarla ahora no la pone
delante de nadie.

### Navegador (Chrome headless por CDP, clics de ratón, «Probar sin código»; guiones en el scratchpad)

**Renglón a 375 px** (375 × 800, móvil, DPR 2; renglones por el centro de cada `.celda` y `.signo`):

| | cargas normales (60 por ej. e idioma) | ítems del generador pintados en la `.expr` | ancho máximo (hay 324 px) |
|---|---|---|---|
| `coloca-fracciones` ej. 1 / 2 / 3 | 0 / 0 / 0 partidos de 120 | 0 de 19 000 por ejercicio (9500 por idioma) | 234 / 312 / 312 px |
| `coloca-decimales` ej. 1 / 2 / 3 | 0 / 0 / **1** partido de 120 (en inglés) | 0 / 0 / **7 de 3000** (6 en inglés, 0,4 %; 1 en español) | 261 / 234 / **340** px |

«Pintados»: en la página de la práctica, ítems de `generar(ej, crearRng(…))` escritos en la `.expr` con `M.htmlValor` y `M.signo`, y
medidos uno a uno. A 1200 px, 60 cargas de cada una: nada. Sin desbordamiento horizontal en ninguna medida. Huecos a 375 px: 18 × 52 px.

**Peor caso inventado** (números escritos en el DOM; fuera de lo que sale del generador): en fracciones, cuatro de dos cifras arriba y
abajo (−23/12 y tres 23/12) **no caben** en el ej. 2 ni en el ej. 3 (330-380 px), pero en 57 000 ítems del generador no ha salido
ninguno así (las cotas de la 201 los descartan casi siempre): no reabre. En decimales, cuatro 9,99 en el ej. 3: 339 px (es) y 346 px (en);
ese sí está en el rango del generador (decimales de una cifra entera y hasta dos decimales), y es lo que reabre.

**Recorrido con clics** a 375 y 1200 px, es y en, los tres ejercicios de cada una (24): «Probar sin código» → menú con 3 ejercicios; en
los «todos», la pista, el borrar, el «(» sin cerrar y **todos los chips encendidos por clic** (2/2, 5/5, 3/3, 4/4…); en la diana, el fallo
sin paréntesis («Eso da …, no …» y una agrupación que sí lo da) y el acierto con la colocación del objetivo; el «No lo sé» (sale la
explicación y el ítem siguiente es otro); **consola limpia en los 24**. Las cuentas de los mensajes finales que se vieron, comprobadas
a mano (p. ej., 3/5 − (9/5 − 2) + 13/10 = 21/10; −5/4 : 3 − (2 + 3/2) = −47/12; 7.1 · (2.35 + 5 − 0.56) = 48.209).

### Tests

Paso 2 de la ficha: 181/181. `npm test`: 2422/2422.

### Propuestas para las tareas semanales (Juan Luis las cambia en el panel; no se han tocado)

- **U4, semana 3 (tarea 22 del panel, la de la ENTREGA de la 170; 7 ★ + 3 a elegir de 6)**: añadir **`['coloca-fracciones', 1]`,
  `['coloca-fracciones', 2]` y `['coloca-fracciones', 3]`** a «a elegir», sin cambiar `nElegir: 3`. Siguen contando 7 ★ + 3 = 10
  ejercicios, 10 puntos cada uno, 100 en total (tarea 166); añadir opciones a «a elegir» no cambia el peso. Es la semana de las
  combinadas (sesión 10). Como ★, solo si Juan Luis lo quiere. Todo lo que cita está publicado.
- **U5, semana 2 (tarea 24 del panel)**: la propuesta de la primera pasada (los tres ejercicios de `coloca-decimales` a «a elegir», sin
  cambiar `nElegir: 2`) **espera** a que se publique `coloca-decimales`: no se añade nada mientras siga sin publicar.

Para probarlas: https://salasgar.github.io/Ejercicios-interactivos/practicas/coloca-fracciones/?probar=1 y
https://salasgar.github.io/Ejercicios-interactivos/practicas/coloca-decimales/?probar=1 (esta, sin publicar todavía).

### Fuera de criterio (no obliga)

- Siguen en pie los tres de la primera pasada (abajo): el `³` en el 9,7 % de los ítems de decimales, los paréntesis dentro de
  paréntesis y el « · » entre frases de `base.js`.

---

## Primera pasada (16-11, sesión `s-20261116T125904-962c7f16`), sin cambios


Sesión `s-20261116T125904-962c7f16` (16-11), encadenada tras la 203. **Veredicto: NO SE PUBLICA NINGUNA todavía.** Las dos se reabren por
el mismo fallo en pantalla a 375 px (`hechos/reabiertas/201--s-20261116T125904-962c7f16.md` y `202--…`). Todo lo demás está bien; cuando
cierren las reabiertas, la 204 se vuelve a reclamar para revisar solo eso y publicar. No se ha tocado `catalogo.js`, ni los docs, ni el README.

## El hallazgo que reabre las dos

A 375 px la expresión se parte en dos renglones (30 ítems seguidos por ejercicio, es y en; ancho que necesita con `flex-wrap: nowrap`,
y hay 324 px):

| | ej. 1 (tres) | ej. 2 | ej. 3 (diana, cuatro) |
|---|---|---|---|
| `coloca-fracciones` | 20/30 partidos · hasta 335 px | 30/30 (cuatro) · 367-408 px | 30/30 · 362-399 px |
| `coloca-decimales` | 20/30 · hasta 359 px | 26/30 (tres y `²`) · hasta 346 px | 30/30 · 375-439 px |

Ninguna de las dos lleva la regla `@media (max-width: 400px)` que sí tiene `coloca-enteros` (y aun con ella, la de enteros se queda 10 px
corta en su peor caso: reabierta de la 200). La ficha 204 pide que cuatro fracciones con raya y cuatro decimales quepan en un renglón. La
ENTREGA de la 202 ya avisaba de los 2-4 renglones. A 1200 px, nada.

## Barrido (20 000 ítems por ejercicio, con las funciones de cada `logica.js`)

| | distintos | más repetido | resultados | chips del mismo valor | fuera de cota | otras cotas |
|---|---|---|---|---|---|---|
| fracciones ej. 1 | 15 515 | 0,055 % | 2: 20 000 | 0 | 0 | primero negativo 29,5 %; ningún otro negativo |
| fracciones ej. 2 | 19 826 | 0,015 % | 3: 7656 · 4: 4190 · 5: 8154 | 0 | 0 | 29,1 %; sin agrupaciones imposibles |
| fracciones ej. 3 | 19 925 | 0,015 % | 3: 8556 · 4: 4788 · 5: 6656 | 0 | 0 | 28,0 %; dianas malas 0 |
| decimales ej. 1 | 19 685 | 0,020 % | 2: 20 000 | 0 | 0 | ningún negativo |
| decimales ej. 2 | 19 063 | 0,020 % | 3: 16 097 · 4: 2524 · 5: 1379 | 0 | 0 | exponente en todos; cubos 9,7 % |
| decimales ej. 3 | 19 994 | 0,010 % | 3: 12 641 · 4: 6418 · 5: 941 | 0 | 0 | dianas malas 0 |

«Chips del mismo valor» comparado por racional reducido, no por texto ni con `Number`. «Fuera de cota»: todo valor de todos los pasos de
todas las agrupaciones; fracciones, denominador ≤ 36 y |numerador| ≤ 60; decimales, ≥ 0, ≤ 500 y tres cifras decimales como mucho.
«Dianas malas»: objetivo igual al de sin paréntesis o que no sale de ninguna colocación. Ningún ítem igual al anterior; caídas en la
reserva de `buscar`: 0 de 60 000 en cada práctica. Denominadores de los operandos de la U4: 2-6 casi siempre, 8, 10 y 12 de vez en cuando.

**Casos del papel**: leídos por mi cuenta (no de `papel.js`). U4: 84 ficheros (hojas, soluciones y banco, 136 cuentas de 3+ números;
exámenes semanales 1-3 con sus extra, resueltos, claves, cuestionarios y Forms, 8837; los `.tex` del final con `adaptado-A` y
`recuperacion`, 129; inventario, 21). U5: 59 ficheros (hojas y banco, 79; exámenes semanales 1-2 con `casos-examen-semana{1,2}.tsv`, 2969;
final con `adaptado-A`, `modeloK-dislexia` y `recuperacion`, 112; inventario, 34). Fracciones con `\frac` y `\dfrac`, decimales con `{,}`,
a número racional. Contra los 120 000 ítems: **0 casos con la misma cuenta completa**. Ningún fichero del papel es más nuevo que las
terminadas de la 201 y la 202.

## A mano

- 20 ítems por ejercicio en los dos idiomas, con todas sus agrupaciones: **1840 líneas** de resolución con fracciones y **1696** con
  decimales, leídas y además comprobadas con un evaluador propio del texto que se ve. Cada línea vale lo mismo que la anterior; fracciones
  con raya y simplificadas, sin barra, y un entero como entero; coma en español y punto en inglés, sin ceros de más; ningún negativo sin
  paréntesis detrás de una operación; menos U+2212. **0 problemas.**
- «No lo sé»: 15 explicaciones por ejercicio e idioma (**212 + 190 líneas** de cuentas), igual: **0 problemas**. En la diana, la
  colocación que da el objetivo y su resolución son correctas.

## Navegador (Chrome headless por CDP, clics de ratón, «Probar sin código»)

Las dos, desde su portada: «Probar sin código» → menú con 3 ejercicios. Después, `?probar=1&ejercicio=N&idioma=es|en`, a 375 px (mobile)
y a 1200 px, 12 casos por práctica. En los «todos»: la pista (2 toques encienden un chip), el borrar, un «(» sin cerrar (aviso) y
**todos los chips encendidos por clic** con la colocación que da cada uno (de `logica.js`, importada en la página), el mensaje final y
el «No lo sé» (sale la explicación y el ítem siguiente es otro). En la diana: «(» sin cerrar + Comprobar (aviso, en rojo, sin contar
respuesta), borrar, un **fallo** (sin paréntesis: «Eso da …, no …» y «Una agrupación que da …» con su resolución), un **acierto** con la
colocación del objetivo y el «No lo sé». La consola, limpia en los 24 casos; sin desbordamiento horizontal. La única pega es la del
renglón partido.

## Tests

`node --test` de los siete ficheros del paso 2: 181/181. `npm test`: ver la terminada.

## Propuestas para las tareas semanales (Juan Luis las cambia en el panel; no se han tocado)

Cuando cada práctica esté publicada:

- **U4, semana 3 (tarea 22 del panel, 7 ★ + 3 a elegir de 6)**: añadir **`['coloca-fracciones', 1]`, `['coloca-fracciones', 2]` y
  `['coloca-fracciones', 3]`** a «a elegir», sin cambiar `nElegir: 3`. Quedan 7 ★ + 3 de 9 = 10 ejercicios, 100 puntos (10 cada uno), igual
  que ahora. Es la semana de las combinadas (sesión 10). Como ★, solo si Juan Luis lo quiere.
- **U5, semana 2 (tarea 24 del panel, 8 ★ + 2 a elegir de 10)**: añadir **`['coloca-decimales', 1]`, `['coloca-decimales', 2]` y
  `['coloca-decimales', 3]`** a «a elegir», sin cambiar `nElegir: 2`. Quedan 8 ★ + 2 de 13 = 10 ejercicios, 100 puntos. Las combinadas con
  un cuadrado son de la sesión 6 (mar 26-1), dentro de esa semana.
- El README **no tiene sección de la U5** (16-11): al publicar, no se crea; solo la fila de `coloca-fracciones` en la de la U4.

Para probarlas: https://salasgar.github.io/Ejercicios-interactivos/practicas/coloca-fracciones/?probar=1 y
https://salasgar.github.io/Ejercicios-interactivos/practicas/coloca-decimales/?probar=1 (las carpetas ya están en origin, sin publicar).

## Fuera de criterio (no obliga)

- Decimales, ej. 2: el `³` sale en el 9,7 % de los ítems (la decisión del 14-11 decía «en un 15 %»; la 202 lo deja en lo que permiten las
  cotas). No es motivo de reapertura.
- Con tres o cuatro operandos aparecen paréntesis dentro de paréntesis en la resolución (un par dentro de otro), como en la U1.
  Están bien escritos; solo por si en la U4 se prefiere no verlos todavía.
- Fuera de estas prácticas: en el feedback de fallo de la base (`practicas/_comun/base.js:986`), la línea de la penalización une dos
  frases con « · » («No pierdes puntos (estás en 0) · Te quedan 4 vidas»). Juan Luis no quiere «·» entre frases en textos para alumnos. Es
  común a todas las prácticas: para la coordinadora.
