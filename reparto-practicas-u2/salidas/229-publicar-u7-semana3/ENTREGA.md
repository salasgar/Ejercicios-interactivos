# ENTREGA tarea 229 · Revisión y publicación del paquete 3 de la unidad 7 — PRIMERA PASADA (PARCIAL)

Sesión `s-20261128T130248-eea9cd09` (28-11-2026, desde las 13:02 UTC), lanzada por el lanzador automático, sin nadie delante. Precondiciones
comprobadas en `hechos/`: 218, 219, 220 y 221 LISTAS (19-11) y 228 LISTA (27-11); en el reparto de la U7, la hoja 3 única de la tarea 08 (cerrada el
24-11; la 09, SUSTITUIDA por el acta, punto u) y el examen 3 de la tarea 20 (cerrado el 27-11). Pages, en verde antes de empezar.

## Qué se publicó

**Nada.** Las cuatro prácticas son del 19-11, anteriores al acta de la 02 de la U7 (23-11), a la hoja 3 (24-11) y al examen 3 (27-11), y las cuatro
sacan casos de los dos papeles: se reabren con sus listas de reserva ya calculadas y probadas, como la primera pasada de la 158 (U6) y la de la 228.
Commit **5f32d91**: solo `docs/practicas-unidad7.md` (filas del paquete 3 en §6, con sus ejercicios y cotas, y un párrafo con el estado).
`catalogo.js` sin cambios.

| Práctica | Resultado | Reabierta |
|---|---|---|
| `tres-escrituras` (218) | No se publica: casos del papel en el ej. 2; dos introducciones copian la hoja 3 | `hechos/reabiertas/218--s-20261128T130248-eea9cd09-revision.md` |
| `tanto-por-ciento` (219) | No se publica: casos del papel; feedback con números fijos; los problemas, sin el método oficial; regalos de hasta 475 € | `219--…-revision.md` |
| `que-porcentaje` (220) | No se publica: casos del papel; el total, sin el método oficial; regalos de hasta 475 € | `220--…-revision.md` |
| `descuentos` (221) | No se publica: casos del papel; «÷»; «1 000»; espacio corriente por duro; introducciones sin dos decimales; un distractor que no es error típico | `221--…-revision.md` |
| `tabla-proporcional` (213), `regla-de-tres` (214), `directa-o-inversa` (216), `repartos` (217) | **Siguen publicadas**; sacan casos del repaso del examen 3 y tienen que añadir esas huellas a su `reserva.js` (plazo, antes del lun 1-3) | `213--…`, `214--…`, `216--…`, `217--…-revision.md` |

Las listas de reserva, en `hechos/notas/s-20261128T130248-eea9cd09-reserva-{tres-escrituras,tanto-por-ciento,que-porcentaje,descuentos,repaso-examen3}.md`
(la hoja en claro; el examen, solo huellas; con el `huellasDe` propuesto en el convenio de `huellaCaso`). **Siguiente**: cuando cierren las ocho
reabiertas (MEDIO, de 15 a 40 min cada una), una segunda pasada de la 229 (ALTO) repite barrido, cotejo y clics y publica.

## Cómo se revisó (sobre una copia de HEAD 0bb692b en /tmp/pu2-229-eea9/arbol)

- **Barridos** de 20 000 ítems por ejercicio con semilla fija (`barrido.mjs`), con aritmética propia en `BigInt`: regla de oro por valor (la buena con
  cada falsa y las falsas entre sí; en `tres-escrituras`, que cada fracción tenga un solo decimal y un solo porcentaje de su valor y que el señuelo no
  valga lo de ninguna; en `tanto-por-ciento` ej. 3 y `descuentos` ej. 2 y 4, cuatro valores y una sola buena), que ningún error con nombre valga lo
  bueno, que la buena tecleada se acepte, exactitud (parte natural, personas enteras, dinero al céntimo), cotas, variedad y los textos (enunciado,
  opciones, explicación, «No lo sé» y el feedback de cada error con su valor; «÷», «×», el guion como signo, el dinero sin dos decimales, la coma o el
  punto del otro idioma, el % pegado o separado, espacio duro, «1 000», plural con 1).
- **Clics reales** (Chrome sin ventana, `Input.dispatchMouseEvent` e `insertText`; `clics.mjs`, puerto 8329, fecha del navegador lun 15-3-2027) en las
  cuatro: cada ejercicio en español y en inglés, a 375 y a 1200 px, un acierto y un fallo: **68 combinaciones, ninguna con errores de JavaScript,
  diálogos ni desbordes**. Leídos a mano los feedbacks de fallo a 375 px en las capturas (/tmp/pu2-229-eea9/capturas).
- **Cotejo con el papel**, por valor y sin contexto ni unidades: la hoja 3 (`hoja-unidad7-semana3.tex`), en claro; el examen 3
  (`casos-examen-semana3.tsv`), solo en /tmp (`papel-PRIVADO.mjs`). Además, las prácticas publicadas de los paquetes 1 y 2 contra las cuatro
  preguntas de repaso del examen 3, con el `huellasDe` de cada una y 200 000 ítems por ejercicio (`cotejo-repaso.mjs`).

## Recuentos del cotejo (ítems de 20 000 con un caso del papel, sin reserva; nunca los casos del examen)

| Práctica · ejercicio | Hoja 3 | Examen 3 |
|---|---|---|
| `tres-escrituras` ej. 1 (los seis fáciles: una tabla que se aprende, no un caso) | — | 0 |
| `tres-escrituras` ej. 2 | 3219 (10 casos) | 613 (4 casos) |
| `tres-escrituras` ej. 3 y ej. 4 (el ítem entero) | 0 | 0 |
| `tanto-por-ciento` ej. 1 · 2 · 3 · 4 | 476 · 79 · 69 · 524 | 365 · 71 · 63 · 73 |
| `que-porcentaje` ej. 1 · 2 · 3 · 4 | 137 · 146 · 555 · 524 | 183 · 192 · 59 · 77 |
| `que-porcentaje` ej. 1 y 2, los tres primeros ítems (fáciles) | 379 · 381 | 681 · 654 |
| `descuentos` ej. 1 · 2 · 3 · 4 · 5 | 54 · 1741 · 234 · 108 · 0 | 48 · 20 · 164 · 77 · 481 |

«El mismo caso», por valor y laxo a propósito (reservar de más no hace daño): el trío porcentaje-total sin la pregunta (la parte, el porcentaje y el
total de un mismo trío son el mismo caso; en «la parte y el resto», los dos porcentajes); el valor que se convierte, en cualquier sentido; el precio
en euros y el porcentaje con su tipo (el IVA es un aumento); el multiplicador sin precio; dos cambios seguidos. Las huellas propuestas cazan, en una
simulación aparte con otras semillas, los mismos órdenes de magnitud que el cotejo independiente; con ellas descartadas no queda ningún caso, y la
reserva quita entre el 0,5 % y el 19 % de los ítems según el ejercicio (el máximo, `tres-escrituras` ej. 2: 14 de los 99 porcentajes).

**El repaso del examen 3** (U7-1C-01, 1A-02, 2A-01 y 2C-04) contra lo publicado, 200 000 ítems por ejercicio: `razones` e `inversa`, 0;
`tabla-proporcional` 95 · 560 · 110 (ej. 1-3); `regla-de-tres` 44 · 0 · 16 · 31; `directa-o-inversa` ej. 3, 226 (a veces con el mismo contexto);
`repartos` unos 2200 en cada uno de los cuatro (≈ 1,1 %). Desglosados a mano en /tmp: son casos de verdad, no falsos positivos del convenio.

## Lo que está bien en las cuatro

- **Regla de oro: 0 fallos** en los 17 ejercicios (ninguna pareja de opciones del mismo valor, ni la buena con una falsa ni dos falsas entre sí).
- **Exactitud y cotas**: todo resultado natural o al céntimo; descuentos de la lista del acta (10-70 %), subidas del 5 al 20 %, el IVA real de cada
  producto; nada que no se haya dado (ningún descuento ni aumento antes de `descuentos`).
- **Variedad**: ningún ítem por encima del 10 % (el máximo, 8,47 %, el ej. 1 de `tres-escrituras`, que solo tiene 12 ítems posibles; los demás, ≤ 4,3 %).
- **Navegador**: 68 recorridos limpios, también a 375 px.

## Hallazgos para Juan Luis (no son de esta tarea)

1. **La portada enseña `descuentos` en el bloque «Semana 3 · Porcentajes»** junto a las otras tres, sin decir que es de abril (sesiones 12-14, del 5
   al 8-4). Como la tarea de la app del paquete 3 va del 15-3 al 8-4 (acta, punto u), no estorba; si quieres que se vea aparte, sería un
   subtítulo en `portada.js` («desde el lun 5-4»), que no es de esta tarea.
2. **El ej. 3 de `que-porcentaje`** («¿cuál de los tres problemas es?») es la destreza U7-3A-07, que el inventario pone en la sesión 14 (jue 8-4, el día
   del plazo): en la propuesta va «a elegir».
3. **El método oficial**: las explicaciones de los problemas de `tanto-por-ciento` y `que-porcentaje` iban por el decimal y por «el 10 %, el 20 %…»; las
   reabiertas piden la regla de tres en su tabla (acta, puntos b, h e i), con lo otro como «otra forma». Nunca se corrige el método del alumno: solo se
   mira el resultado.

## Propuesta de la tarea semanal del paquete 3 (para Juan Luis; no está creada: la monta la 232 en el panel y la programa en Classroom la tarea 40 del reparto de la U7)

**Una sola tarea** (acta de la 02, punto u, y la corrección de la coordinadora en la ficha: cinco tareas de la app, una por paquete; no hay tarea del
lun 5-4). `U7 · 3 · Porcentajes` / `U7 · 3 · Percentages` (el nombre lo decide Juan Luis en la 232) · `unidad: 7` · `desde: '2027-03-15'` ·
`hasta: '2027-04-08'` (sale el **lun 15-3 a las 8:00**; entrega el **jue 8-4 a las 23:59**, abierta en vacaciones; la prueba 3 es el vie 9-4).
Sesiones (acta): 9 lun 15-3 (las tres escrituras, los fáciles, comparar y ordenar), 10 mar 16-3 (el tanto por ciento de una cantidad, cálculo mental),
11 jue 18-3 (qué porcentaje, el total), 12 lun 5-4 (rebajas y subidas en dos pasos), 13 mar 6-4 (en un paso, nunca exigido; el IVA), 14 jue 8-4
(problemas mezclados; el porcentaje de una rebaja; subir y bajar no deja igual). Lo de la sesión 14, el día del plazo, y la vía de un paso, «a elegir».
10 puntos por ejercicio.

**El ★ de ortografía**: `['ortografia-tildes', 3]` Diptongos e hiatos, de la fila «U7 · 3» de `comun/CALENDARIO-CURSO-2026-27.md` («lun 15-3, abierta
hasta el jue 8-4»; la puso la tarea 03 de la U7 el 24-11); el bloque `ortografia-tildes` (id 64) sigue con `disponible: true`.

### Plan A (con las cuatro publicadas): 8 ★ + 2 a elegir = 100 puntos

| | Ejercicio | Destreza (sesión) |
|---|---|---|
| ★ | `['ortografia-tildes', 3]` Diptongos e hiatos | — (ortografía) |
| ★ | `['tres-escrituras', 2]` Escríbelo de otra forma | U7-3C-01 (9) |
| ★ | `['tanto-por-ciento', 1]` De cabeza | U7-3C-02, 3C-05 (9-10) |
| ★ | `['tanto-por-ciento', 4]` Problemas | U7-3A-01, 3C-04 (10) |
| ★ | `['que-porcentaje', 1]` ¿Qué porcentaje es? | U7-3C-06 (11) |
| ★ | `['que-porcentaje', 2]` ¿De cuánto? | U7-3C-07 (11) |
| ★ | `['que-porcentaje', 4]` Problemas | U7-3A-02, 3A-04 (11) |
| ★ | `['descuentos', 1]` En dos pasos | U7-3A-05 (12) |
| elegir | `['tres-escrituras', 1]` Los porcentajes fáciles · `['tres-escrituras', 3]` Une las tres · `['tres-escrituras', 4]` Ordena | U7-3C-02, 3C-01, 3C-14 (9) |
| elegir | `['tanto-por-ciento', 2]` Con el decimal · `['tanto-por-ciento', 3]` ¿Qué operación? | U7-3C-04 (10) |
| elegir | `['que-porcentaje', 3]` ¿Cuál de los tres es? | U7-3A-07 (14) |
| elegir | `['descuentos', 2]` En un paso · `['descuentos', 3]` El IVA · `['descuentos', 4]` ¿Qué piden? · `['descuentos', 5]` (el de subir y bajar) | U7-3C-09, 3C-10 (13, nunca exigido); 3C-11 (13); 3A-05, 3B-02 (12); 3C-13 (14) |
| elegir | repaso para la prueba 3: `['repartos', 2]` Reparte · `['regla-de-tres', 3]` Resuelve y contesta · `['inversa', 3]` Problemas · `['razones', 1]` La razón | U7-2C-04, 1A-02, 2A-01, 1C-01 (las cuatro de repaso del examen 3) |

Los ocho ★ cubren las nueve nucleares del paquete 3 salvo U7-3A-07 (sesión 14, el día del plazo), que entra por `['que-porcentaje', 4]`, donde se
mezclan la parte, el porcentaje y el total, y por `['que-porcentaje', 3]` a elegir.

### Planes B (si alguna no llega publicada al jue 11-3)

- **Sin `descuentos`**: su ★ pasa a `['tanto-por-ciento', 2]` Con el decimal; lo de abril queda solo en la hoja 3 y en clase.
- **Sin `que-porcentaje`**: sus tres ★ pasan a `['tanto-por-ciento', 2]`, `['tanto-por-ciento', 3]` y `['tres-escrituras', 4]`; «a elegir», el repaso.
- **Sin `tanto-por-ciento`**: sus dos ★ pasan a `['tres-escrituras', 1]` y `['tres-escrituras', 4]`.
- **Sin `tres-escrituras`**: su ★ pasa a `['tanto-por-ciento', 2]`.
- Con dos o más sin publicar, los ★ que falten se completan con el repaso de la última fila (los paquetes 1 y 2), hasta 8.

## Propuestas (para la coordinadora)

1. **El cuerpo de la ficha 229** sigue hablando de dos tareas semanales y de las dos partes de la hoja 3; la corrección de la cabecera manda y esta
   ENTREGA la sigue. Si se reescribe, que «Cómo saber que ha terminado» diga «la propuesta de la tarea semanal (lun 15-3 → jue 8-4)».
2. **Las fichas de las prácticas que se escriban antes que su papel** (230 y 231: `escalas`, `unidades`, `problemas-proporcion`, `errores7`): que
   reserven desde el principio, o que la tarea de publicación cuente con una primera pasada que solo reabre (como aquí, en la 158 y en la 228).
3. **El repaso de cada examen** saca casos de prácticas ya publicadas (aquí, cuatro de los paquetes 1 y 2): las tareas 230 y 231 tienen que cotejar
   también el repaso de los exámenes 4 y 5 y del final contra todo lo publicado, no solo su paquete.

## Cómo comprobarlo en 1 minuto

`npm run servir` y http://localhost:8080/practicas/tanto-por-ciento/?probar=1&idioma=es (un fallo del ej. 3: el feedback habla del 15 % de 80
sea cual sea el ítem) y http://localhost:8080/practicas/descuentos/?probar=1&idioma=en (un fallo del ej. 1: «÷» en la explicación). Los guiones de la
revisión, en /tmp/pu2-229-eea9 (se pierden al reiniciar el Mac).
