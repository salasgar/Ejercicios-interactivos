# ENTREGA tarea 227 · Revisión y publicación del paquete 1 de la unidad 7

Sesión `s-20261126T211424-60469b12` (26-11-2026, 21:14-21:44 UTC), tercera en la tarea: releva a `s-20261126T163420-462f6c1c`
(26-11, 16:34-16:55, sin cierre), que relevaba a `s-20261125T152540-1c18e6d5` (25-11, sin nada hecho). De la segunda se heredan
las reabiertas de 212 y 226 (ya cerradas: 212 LISTA a las 21:06Z, a304d9d; 226 LISTA a las 21:08Z, 760811f), la reserva de
`razones` (`hechos/notas/s-20261126T163420-462f6c1c-reserva-razones.md`) y los apartados 1-5 y 8 de `docs/practicas-unidad7.md`,
sin comitear: se han aprovechado tal cual, con dos lecciones más en §3. Su último barrido (el de `tabla-proporcional` y
`regla-de-tres`) terminó después de su último latido y nadie lo llevó a reabiertas: aquí se ha repetido y comprobado.

## Qué se publicó

Commit **e60be6b**: `practicas/_comun/catalogo.js` (`disponible: true` de `razones`, id 84, y `leelo7`, id 98) y
`docs/practicas-unidad7.md` (apartados 1-6 y 8, y la línea «**Publicadas** (a 2026-11-26)»). La portada no enseña la U7 hasta el
lun 1-3-2027 (`UNIDADES`): hasta entonces solo se abren por su URL.

| Práctica | Resultado |
|---|---|
| `razones` (212) | **Publicada.** Los cinco puntos de su reabierta, comprobados con barrido y clics |
| `leelo7` (226) | **Publicada con el paquete 1.** Los cuatro puntos de su reabierta, comprobados; el 1-3 y el 4-3 no enseña nada de un paquete posterior |
| `tabla-proporcional` (213) | **Reabierta** (`hechos/reabiertas/213--s-20261126T211424-60469b12-revision.md`): casos del papel, «÷» en español, casillas cambiadas en el ej. 2, receta > 1000 g, dinero sin decimales, tabla que no cabe a 375 px |
| `regla-de-tres` (214) | **Reabierta** (`hechos/reabiertas/214--s-20261126T211424-60469b12-revision.md`): solo los casos del papel |

Lo reabierto lo publica la **228** con el paquete 2, en cuanto cierren las reabiertas (como la 157 hizo con una de la semana 1 de la
U6); si cierran antes del mié 24-2, puede hacerlo una publicación corta y la tarea del 1-3 pasa al plan A.

## Cómo se revisó

Sobre una copia de HEAD 777a0da en /tmp/pu2-227-6046 (servida en el puerto 8327, libre; con una línea de `base.js` que expone el ítem
al script, solo en la copia):

- **Barridos** de 20 000 ítems por ejercicio con semilla fija (y de 200 000 para las reservas), con aritmética propia (`Fraccion` y
  enteros) y sin usar las funciones de la práctica para decidir: regla de oro por valor (la buena con cada falsa y las falsas entre sí),
  variedad, cotas, notación y textos (enunciado, feedback de acierto y de fallo, «No lo sé»). `leelo7`, con las fechas 1-3, 4-3, 8-3 y
  19-4-2027 y un lector de inglés aparte que confirma cada opción de «Léelo».
- **Clics reales** (Chrome sin ventana, `Input.dispatchMouseEvent` e `insertText`) en las cuatro prácticas: cada ejercicio en español
  y en inglés, a 375 y a 1200 px, un acierto y un fallo: 64 combinaciones, ninguna con errores de JavaScript ni diálogos. Leídos los
  feedbacks de fallo a 375 px en las capturas. La fecha del navegador, fija en el 2-3-2027.
- **Cotejo con el papel**, por valor (el mismo tipo de problema con los mismos datos, sea cual sea el contexto): la hoja 1
  (`hoja-unidad7-semana1.tex` y sus soluciones), en claro; el examen 1 (`casos-examen-semana1.tsv`), solo por huella de
  `huellaCaso` calculada en /tmp; `leelo7`, además, contra el cuestionario 1 y los finales.

## Recuentos del cotejo (nunca los casos del examen)

| Práctica | Hoja 1 | Examen 1 |
|---|---|---|
| `razones` (con la reserva de 70 huellas) | 0 casos en 80 000 ítems | 0 casos (20 del examen cotejables) |
| `leelo7` | 0 con el criterio de la 156 (ningún papel de la semana 1 pide leer o escribir en palabras una razón) | 0 |
| `tabla-proporcional` (sin reserva) | ej. 1-3: 1359, 6948 y 1478 ítems de 200 000 | ej. 1 y 2: 826 y 542 ítems (U7-1C-07) |
| `tabla-proporcional` (con la reserva propuesta, 14 huellas) | 0 | 0 |
| `regla-de-tres` (sin reserva) | ej. 1-4: 105, 105, 53 y 109 de 200 000 | 22, 34, 9 y 26 (seis casos de U7-1A-01 y 1A-02) |
| `regla-de-tres` (con la reserva propuesta, 54 huellas) | 0 | 0 |

Las dos reservas nuevas, con la hoja en claro, el examen solo por huella y el código de `huellasDe`, en `hechos/notas/s-20261126T211424-60469b12-reserva-tabla-proporcional.md`
y `…-reserva-regla-de-tres.md`; las dos, probadas: descartando lo reservado, 0 casos y la misma variedad. En `leelo7`, `1 : 200` y
`1 : 100 000` (paquete 4) también salen en los finales, pero como lectura, no como la misma tarea: lo mira la 230.

## Resultados por práctica

- **`razones`**: regla de oro, 0 fallos; variedad máxima 0,20 % (ej. 1); el feedback de acierto del ej. 2 (b) ya no dice «no vale lo
  mismo»; «and» en el ej. 3 en inglés; el ej. 1 no saca nunca el 1 (0 de 20 000); la x va abajo en el 34 % de los ítems del ej. 4, con
  los productos cruzados en el feedback y el «No lo sé». Los avisos de «a : b» del barrido son divisiones («648 : 27 = 24»), bien
  escritas; los de «mayúscula tras dos puntos», el GCD.
- **`leelo7`**: regla de oro, 0 fallos; variedad máxima 5,9 % (La palabra, 18 términos); las sesiones, las del acta (0 discrepancias); el
  1-3 y el 4-3, ni *inversely*, *share*, `%`, *VAT*, *scale* ni una escala en 80 000 ítems por fecha, tampoco en el consejo del «No lo sé»; el
  dinero, `€8.00`. Los «4.00» de los textos en español son la frase inglesa citada, que se queda en inglés.
- **`tabla-proporcional`** y **`regla-de-tres`**: lo bueno y lo que falla, en sus reabiertas. Lo de `regla-de-tres` es corto (~30 min).

## Propuesta de la tarea semanal 1 (para Juan Luis; no está creada: la monta la 232 en el panel y la programa en Classroom la tarea 40 del reparto de la U7)

`U7 · 1 · Razones y proporcionalidad directa` / `U7 · 1 · Ratios and direct proportion` (el nombre lo decide Juan Luis en la 232) ·
`unidad: 7` · `desde: '2027-03-01'` · `hasta: '2027-03-04'` (sale el **lun 1-3 a las 8:00**; entrega el **jue 4-3 a las 23:59**; la
prueba 1 es el vie 5-3). Es la primera de **cinco** tareas de la app, una por paquete (acta de la U7, punto u; no seis, como decía la
ficha). Sesiones: 1 lun 1-3 (razón y proporción), 2 mar 2-3 (proporcionalidad directa, tablas, precio por unidad), 3 jue 4-3 (problemas:
regla de tres y reducción a la unidad). Lo de la sesión 3, que se da **el mismo día** del plazo, va «a elegir» (decisión de la 131,
repetida en la U6). 10 puntos por ejercicio.

**El ★ de ortografía**: `['ortografia-tildes', 1]` La sílaba tónica, de la fila «U7 · 1» de `comun/CALENDARIO-CURSO-2026-27.md` (la puso
la tarea 03 de la U7 el 24-11, sacada de la tabla de la 196); el bloque `ortografia-tildes` (id 64) sigue con `disponible: true`.

### Plan A (con `tabla-proporcional` y `regla-de-tres` publicadas): 8 ★ + 2 a elegir = 100 puntos

| | Ejercicio | Destreza (sesión) |
|---|---|---|
| ★ | `['ortografia-tildes', 1]` La sílaba tónica | — (ortografía) |
| ★ | `['razones', 1]` La razón | U7-1C-01, 1C-05 (1) |
| ★ | `['razones', 2]` Equivalentes y la más sencilla | U7-1C-02 (1) |
| ★ | `['razones', 3]` ¿Forman proporción? | U7-1C-03 (1) |
| ★ | `['razones', 4]` El término que falta | U7-1C-04 (1) |
| ★ | `['tabla-proporcional', 1]` ¿Es proporcional? | U7-1C-07 (2) |
| ★ | `['tabla-proporcional', 2]` Completa la tabla | U7-1C-09 (2) |
| ★ | `['tabla-proporcional', 3]` Lo que vale 1 | U7-1C-10 (2) |
| elegir | `['tabla-proporcional', 4]` ¿Directamente proporcionales? | U7-1C-08 (2) |
| elegir | `['regla-de-tres', 1]` ¿Cuánto cuesta 1? | U7-1A-02 (3) |
| elegir | `['regla-de-tres', 2]` ¿Qué planteamiento? | U7-1C-13 (3) |
| elegir | `['regla-de-tres', 3]` Resuelve y contesta | U7-1A-01, 1A-05 (3) |
| elegir | `['regla-de-tres', 4]` ¿Tiene sentido? | U7-1A-05 (3) |
| elegir | `['leelo7', 1]` La palabra · `['leelo7', 2]` Léelo · `['leelo7', 3]` La consigna · `['leelo7', 4]` Completa | U7-1B-01 (1), 1B-02 (2) |

### Plan B (hoy: `tabla-proporcional` y `regla-de-tres` sin publicar): 8 ★ + 2 a elegir = 100 puntos

| | Ejercicio | Destreza (sesión) |
|---|---|---|
| ★ | `['ortografia-tildes', 1]` La sílaba tónica | — (ortografía) |
| ★ | `['razones', 1]` … `['razones', 4]` (los cuatro) | U7-1C-01 a 1C-05 (1) |
| ★ | `['leelo7', 1]` La palabra | U7-1B-01, 1B-02 (1-2) |
| ★ | `['leelo7', 2]` Léelo | U7-1B-01 (1) |
| ★ | `['leelo7', 4]` Completa | U7-1B-01, 1B-02 (1-2) |
| elegir | `['leelo7', 3]` La consigna | U7-1B-01, 1B-02 (1-2) |
| elegir | `['fraccion-de', 1]` Calcula | U4-1C-08 (repaso de la prueba 1) |
| elegir | `['multiplica-divide-decimales', 2]` Divide entre un natural | U5-2C-04 (repaso de la prueba 1) |
| elegir | `['transposicion', 2]` Una operación | U6-2C-08 (repaso de la prueba 1) |

Si el lun 1-3 están publicadas las dos, plan A; si solo una, plan A sin los ejercicios de la que falte (los de `tabla-proporcional` que
eran ★ pasan a los de `leelo7` del plan B). `leelo7` vale para las dos: en la semana 1 solo saca lo de las sesiones 1-3.

## Propuestas (para la coordinadora)

1. **Quién publica 213 y 214**: la 228, con el paquete 2, en cuanto cierren sus reabiertas (hay que decirlo en la ficha 228, que hoy no
   lo dice).
2. **Huecos de cobertura del paquete 1** (no son fallos de ninguna práctica): U7-1A-03 (directa con tiempo), U7-1A-04 (cambio de unidad
   dentro), U7-1C-06 (magnitud y unidad), U7-1C-11 (comparar dos tasas) y U7-1C-12 (horas y minutos) no los practica ninguna de las cuatro.
   Si se quieren en la app, como ejercicio nuevo de la práctica que se decida (quizá `problemas-proporcion`, la 224), no en una reabierta.
3. **`docs/practicas-unidad7.md`, fuera de los apartados de esta tarea**: la entrada y §7 dicen todavía «propuesta… sin firmar» y «`unidades`
   solo si el acta…»; la F0 se firmó el 24-11. Que lo ponga al día la próxima publicación (228) o la coordinadora.
4. **La ficha 227 dice «seis tareas semanales»**; el acta (punto u) dice cinco. Las fichas 229-232 también hablan de seis.

## Cómo comprobarlo en 1 minuto

`npm run servir` y http://localhost:8080/practicas/razones/?probar=1&idioma=es (un acierto del ej. 2, un ej. 4 con la x abajo) y
http://localhost:8080/practicas/leelo7/?probar=1&idioma=en («No lo sé» en «La palabra»: el consejo, sin *inversely* mientras la fecha
sea anterior al 8-3-2027). En la portada, la U7 aparece desde el 1-3-2027.
