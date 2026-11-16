# Tarea 204 — revisión con clics de «Coloca los paréntesis. Con fracciones» (81, U4) y «Con decimales» (82, U5)

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
