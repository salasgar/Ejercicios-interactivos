# Tarea 203 — revisión con clics y publicación de «Coloca los paréntesis. Con enteros» (`coloca-enteros`, id 80, U3)

## Segunda pasada (17-11, sesión `s-20261116T230536-882771da`, relevo de `s-20261116T174541-c449f0b6`)

**Veredicto: PUBLICADA.** Commit **e62574e**: `disponible: true` en la fila 80 de `catalogo.js` (nada más de ese fichero), la fila
de `coloca-enteros` en la tabla de la unidad 3 del `README.md` (semanas 3-4) y el recuento («Trece prácticas», ids 33-44 y 80), y en
`docs/practicas-unidad3.md` la línea de publicadas, la fila sin «Sin publicar» y «las trece prácticas». README y docs los dejó escritos
sin comitear la sesión relevada; se han leído y se heredan (solo cambia la fecha: 17-11). Se ve en la portada, bloque de la semana 3
de la U3, detrás de `parentesis-enteros` (`practicas/portada.js` ya la tenía en ese bloque desde la 199).

Solo se revisa lo reabierto (la reabierta de la 200, `hechos/reabiertas/200--s-20261116T124345-d075acd5.md`, cerrada en b7fa757:
en ≤ 400 px huecos de 20 px y `.num`/`.signo` sin relleno lateral). Lo demás quedó revisado en la primera pasada (abajo).

### Navegador (Chrome headless por CDP, clics de ratón, «Probar sin código»; guion en el scratchpad)

- **Renglón a 375 px** (375 × 800, móvil, DPR 2): 60 cargas por ejercicio e idioma (**360**): **0 renglones partidos, 0 desbordes**
  (de la página ni de la `.expr`). En el ej. 3, 33 de las 120 cargas con dos o más números de dos cifras y 64 con el primero negativo.
  A 1200 px, 60 cargas: 0 y 0.
- **Peor caso forzado** (el de la reabierta: −12 y tres 12 escritos en el DOM, con `−`, `:` y `·`, o `÷` en inglés), sin paréntesis y
  con «((» delante del primero y «)» detrás del segundo y del último puestos por clic, en los tres ejercicios y los dos idiomas: **12 de
  12 en un renglón**, sin desborde (`scrollWidth` con `flex-wrap: nowrap` = `clientWidth` = 324 px).
- **Huecos a 375 px**: 20 × 52 px (el alto para el pulgar, intacto).
- **Recorrido con clics** a 375 y 1200 px, es y en, los tres ejercicios (12): «Probar sin código» → menú con 3 ejercicios; la pista
  (2 toques encienden un chip nuevo, hueco resaltado), el borrar (0 paréntesis, 0 líneas), un «(» sin cerrar (aviso y hueco en rojo),
  la agrupación que no se puede en el ej. 3 (línea en rojo y el motivo), **todos los chips encendidos por clic** con la colocación que
  da cada uno (de `logica.js`, importada en la página), el mensaje final, el «No lo sé» (sale la explicación, el ítem siguiente es
  otro), la expresión en un renglón y **consola limpia en los 12**. Las cuentas de los mensajes finales que se vieron, comprobadas.

### Tests

Paso 2 de la ficha: 181/181. `npm test`: 2422/2422.

### Propuesta para la tarea de la semana 4 de la U3 (Juan Luis la cambia en el panel; no se ha tocado)

Es la tarea **19** del panel (ENTREGA de la 116: «U3 · Semana 4 · Problemas, errores típicos y combinadas», del lun 7-12 al jue 10-12;
5 ★ y `nElegir: 5`). Propuesta, igual que en la primera pasada: añadir **`['coloca-enteros', 2]`** (con una potencia: U3-3C-10, la base
negativa) y **`['coloca-enteros', 3]`** (con división: U3-4A-04 y 4A-06) a **«a elegir»**, **sin cambiar `nElegir: 5`**. Sigue
puntuando sobre 100: cuentan 5 ★ + 5 a elegir, y cada uno pesa 100 / 10 = 10 (tarea 166); añadir opciones a «a elegir» no cambia el
peso. El ej. 1 (tres números, sin potencia) encaja más en la semana 3: si se quiere, a «a elegir» de la tarea 18, también sin tocar su
`nElegir`. Como ★, solo si Juan Luis lo quiere (las combinadas con paréntesis se dan el mié 9-12, dentro de la semana).

Para probarla: https://salasgar.github.io/Ejercicios-interactivos/practicas/coloca-enteros/?probar=1

### Fuera de criterio (no obliga)

- Sigue en pie lo de la primera pasada: `logica.js` y `textos.js` conservan en la cabecera «ESQUELETO de la tarea 199: la 200 lo
  rehace», que ya no es verdad.
- Las sesiones anteriores de la 203 dejaron vivos cuatro Chrome headless (puerto 9343, perfiles en `/tmp/scratch-203` y
  `/tmp/pu2-203-c449`) y un servidor de Node (8743): matados al empezar. Su worktree `/tmp/wt-203-c449` (limpio, en eb9665b) sigue ahí.

---

## Primera pasada (16-11, sesión `s-20261116T124345-d075acd5`), sin cambios


Sesión `s-20261116T124345-d075acd5` (16-11). **Veredicto: NO SE PUBLICA todavía.** Se reabre la 200 por un fallo en pantalla a 375 px
(`hechos/reabiertas/200--s-20261116T124345-d075acd5.md`). Todo lo demás está bien; cuando cierre la reabierta, la 203 se vuelve a
reclamar para revisar solo eso y publicar. No se ha tocado `catalogo.js`, ni los docs, ni el README.

## El hallazgo que reabre

En el ejercicio 3 a 375 px, la expresión de cuatro números se parte en dos renglones si lleva dos o más números de dos cifras: **9 de
80 ítems** (40 es + 40 en), 8 de ellos con el primero negativo (−12 y −8, −10 delante de otros de dos cifras). El último número
queda solo en el segundo renglón con sus dos huecos. Medido: el peor caso (−12 y tres 12) necesita 334 px y hay 324. A 1200 px, nada.

## Barrido (20 000 ítems por ejercicio, con las funciones de `logica.js`)

| | distintos | más repetido | resultados | otras cotas |
|---|---|---|---|---|
| Ej. 1 | 6155 | 0,060 % | 2: 20 000 | sin inválidos; primero negativo 51,6 % |
| Ej. 2 | 1879 | 0,135 % | 3: 9082 · 4: 9243 · 5: 1675 | sin inválidos; eleva un negativo 81,2 % (≥ 40 %); cubos 15,0 % |
| Ej. 3 | 14 535 | 0,030 % | 3: 15 369 · 4: 4631 | los 20 000 con al menos una agrupación que no se puede; ningún `grande` |

Ningún valor (intermedio ni final) fuera de ±200; ningún ítem igual al anterior; caídas en la reserva de `buscar`: 0 de 60 000.

**Casos del papel**: leídos por mi cuenta de la carpeta de la U3 (no de `papel.js`), 67 ficheros: las 4 hojas, sus 4 soluciones y el banco
(445 cuentas de 3 o más números), los exámenes semanales 3 y 4 (`.tex` normal, extra y resueltos, casos y cuestionarios en `.tsv`,
claves y Forms en `.json`, «sé hacerlo»: 17 071, casi todas repeticiones de los 51 exámenes individuales), los `.tex` del final (modelos 1
y 2, `adaptado-A`, `modelo1-dislexia`, `recuperacion`, resueltos y soluciones: 254) y el inventario (109). Contra los 60 000 ítems:
**0 casos con la misma cuenta completa** (los 3 que salieron al principio eran falsos: dos líneas intermedias de una solución resuelta y
dos columnas del `.tsv` pegadas); los trozos de 3 o 4 números de cuentas más largas sí aparecen (237 claves), pero no son la misma cuenta.

## A mano

- 20 ítems por ejercicio en los dos idiomas (60 ítems, todas sus agrupaciones: **1590 líneas de resolución**), leídas y además
  comprobadas con un evaluador propio del texto que se ve: cada línea vale lo mismo que la anterior, ningún negativo sin paréntesis
  detrás de una operación, ningún `−a²` donde va `(−a)²`, ningún `(+5)`, menos U+2212, `·` y `:` (`÷` en inglés). **0 problemas.**
- «No lo sé»: 15 explicaciones por ejercicio e idioma (90; **262 líneas de cuentas**), leídas y comprobadas igual: **0 problemas**.
  En el ej. 3, la agrupación que «no cuenta» y su motivo («12 : (−10) no da un número entero») son correctos.

## Navegador (Chrome headless por CDP, clics de ratón, «Probar sin código»)

En la portada de la práctica, el botón «Probar sin código» → menú con los 3 ejercicios. Después, `?probar=1&ejercicio=N&idioma=es|en`,
a 375 px (mobile) y a 1200 px, los 12 casos: la pista (2 toques encienden un chip nuevo, con el hueco resaltado), el borrar (0 paréntesis
y 0 líneas), un «(» sin cerrar («Falta algún paréntesis…», en rojo), una agrupación que no se puede en el ej. 3 (línea en rojo y el motivo),
**todos los chips encendidos por clic** con la colocación que da cada uno (de `logica.js`, importada en la página), el mensaje final,
el «No lo sé» (sale la explicación y el ítem siguiente es otro) y la consola limpia en los 12. Sin desbordamiento horizontal en ninguno.
La única pega es la del renglón partido de arriba.

## Tests

`node --test` de los cinco ficheros del paso 2: 181/181. `npm test`: 2405/2405 (en el worktree, sobre origin/main con la 23, la 200 y
la 201 ya llevadas: ver la incidencia).

## Propuesta para la tarea de la semana 4 de la U3 (tarea 19 del panel; Juan Luis la cambia, no se ha tocado)

Cuando `coloca-enteros` esté publicada: añadir **`['coloca-enteros', 2]`** (Con una potencia: U3-3C-10 y 4A-03, la base negativa) y
**`['coloca-enteros', 3]`** (Con división: U3-4A-04) a **«a elegir»**, sin cambiar `nElegir: 5`. Queda 5 ★ + 5 a elegir de 11 = 100 puntos
(cada ejercicio que cuenta pesa 100 / 10 = 10), igual que ahora. El ej. 1 (tres números, sin potencia) es más de la semana 3: si se
quiere, a «a elegir» de la tarea 18 (semana 3), también sin tocar su `nElegir`. Como ★, solo si Juan Luis lo quiere: las combinadas con
paréntesis se dan el jueves 10-12, el día del plazo.

Para probarla: https://salasgar.github.io/Ejercicios-interactivos/practicas/coloca-enteros/?probar=1 (la carpeta ya está en origin,
sin publicar en la portada).

## Fuera de criterio (no obliga)

- `logica.js` y `textos.js` conservan en su cabecera «ESQUELETO de la tarea 199: la 200 lo rehace»; ya no es verdad. Se puede quitar al
  cerrar la reabierta.
- En el ej. 3 solo salen 3 o 4 resultados (nunca 5 o 6); lo dijo ya la 200.
- El main del árbol compartido y origin/main estaban separados: `hechos/incidencias/s-20261116T124345-d075acd5.md`.
