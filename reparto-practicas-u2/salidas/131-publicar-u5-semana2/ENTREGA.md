# Entrega de la tarea 131 · Revisión y publicación de la semana 2 de la U5 (`multiplica-divide-decimales`, `fraccion-decimal`, `errores5`; y `leelo5`)

Sesión `s-20261108T095958-d9654cd4`, 2026-11-08, encadenada tras la 130 (lanzador automático, sin nadie delante). Commits: **77f7823**
(`catalogo.js`: `disponible: true` de `leelo5`; `docs/practicas-unidad5.md`: la semana 2 y «Publicadas»), **f2807a7** (`fraccion-decimal` y
«Publicadas») y **41aec1a** (`errores5`, que se quedó fuera de f2807a7).

## Resultado
| Práctica (tarea, id) | Veredicto | Estado |
|---|---|---|
| `leelo5` (129, 63) | **pasa** tras su reabierta del 8-11 (s-20261108T102909-7f9717e3, 60 huellas y tres valores de la hoja 1): 0 casos de los exámenes 1 y 2, de las hojas y del final en la misma tarea; clics hechos en la 130 (64 combinaciones, sin fallos) | **PUBLICADA** · bloque «Para toda la unidad» (decisión de la 130: va con la semana 2) |
| `multiplica-divide-decimales` (126, 60) | **no pasa**: le faltan la posición U5-2C-17 del examen 2 (tres cálculos salen en los ej. 1-3 y uno en el 5) y el examen final | sin publicar · `hechos/reabiertas/126--s-20261108T095958-d9654cd4-revision.md` (MEDIO, corta) |
| `fraccion-decimal` (127, 61) | **no pasaba**: ej. 1 y 2 sacaban las fracciones y los decimales del examen 2, dos del examen 1 y del final, y dos casos de las hojas. Reabierta (`hechos/reabiertas/127--…-revision.md`), **cerrada a las 10:4xZ** por s-20261108T103902-5df4c3f5 (f44910f); **recotejada: pasa** (0 casos de la misma tarea) | **PUBLICADA** · bloque «Semana 2» |
| `errores5` (128, 62) | **no pasaba**: `HUELLAS_EXAMEN` vacío (sumas, productos y divisiones de los exámenes 1 y 2, un cálculo de U5-2C-17, una línea del final) y las plantillas de redondeo no filtraban la suma de su primera línea. Reabierta (`128--…-revision.md`), **cerrada a las 10:41Z** por s-20261108T103856-9d971183 (0f3e01c, 146 huellas y el filtro); **recotejada: pasa** | **PUBLICADA** · bloque «Semana 2» |

Las tres reabiertas llevan las huellas ya calculadas con la clave de cada práctica (126: 18 más; 127: 26 y una de pareja; 128: 146) y lo que falta
en claro de las hojas; comprobado en una copia de `practicas/` en el scratchpad: **con ellas, 0 coincidencias de examen** (salvo lo que cada
reabierta pide arreglar en el código: la pareja de la 127 y las plantillas de redondeo de la 128).

**Quedan sin publicador** `multiplica-divide-decimales` (su reabierta, sin reclamar al cerrar) y las tres de la semana 1 (130): `lee-decimales` y
`suma-resta-decimales` ya pasan mi barrido tras sus reabiertas (falta solo publicarlas, con sus clics); `compara-decimales`, tras su segunda reabierta. Hace falta una tarea de publicación nueva (ALTO, como la 119 para la
U4) que dé de alta la coordinadora: semana 1 antes del **jue 14-1**, semana 2 antes del **jue 21-1** (ideal, las dos antes de Navidad). Las sesiones del lanzador cogen las reabiertas en minutos, así que esa tarea
puede ir pronto.

## Cómo se revisó
- **Cotejo independiente** (guiones en `/tmp/pu2-130/`, fuera del repositorio: `papel2.py` saca de cada trozo de papel sus números, fracciones y
  operaciones; `preciso2.mjs` genera **20000 ítems por ejercicio**, semilla 131000 + nº, idioma alterno, y busca **la misma operación con los mismos
  números** —sin orden— o la misma fracción / el mismo decimal en un trozo que pide pasar de una a otro). Papel: `casos-examen-semana1.tsv` y
  `casos-examen-semana2.tsv` (las posiciones de la U5, con la respuesta de U5-2C-17, que es un cálculo mal hecho), las hojas 1 y 2 y los cinco `.tex`
  del final (modelos 1 y 2, recuperación, adaptado-A y el de dislexia; el tipo test de la semana 2 es el examen semanal 2). Para `errores5`, toda la
  unidad, como pide la ficha.
- **Recuentos** (casos de papel distintos que salen en la misma tarea, sobre 20000 ítems por ejercicio):

  | Ejercicio | Examen 1 | Examen 2 | Hojas | Final |
  |---|---|---|---|---|
  | `multiplica-divide-decimales` 1 · 2 · 3 · 4 · 5 · 6 | 0 · 0 · 0 · 0 · 0 · 0 | 1 · 1 · 1 · 0 · 1 · 0 | 0 · 0 · 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 · 0 · 0 |
  | `fraccion-decimal` 1 · 2 · 3 · 4 | 0 · 2 · 0 · 0 | 5 · 5 · 0 · 0 | 0 · 1 · 0 · 1 | 1 · 0 · 0 · 0 |
  | `errores5` 1 · 2 · 3 | 2 · 1 · 1 | 3 · 5 · 6 | 0 · 0 · 0 | 0 · 1 · 0 |
  | Tras las reabiertas de la 127 y la 128 | `fraccion-decimal` y `errores5`: 0 en todas las casillas (recotejado a las 10:45Z) | | | |
  | `leelo5` 1 · 2 · 3 · 4 (tras su reabierta) | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 |

  No cuentan los ejemplos de los recuadros («Recuerda», «Ojo»), como en la 119, ni los **pares de memoria** (1/2, 1/4, 3/4, 1/5, 1/10, 1/100), que
  el acta manda saberse y que la hoja 2 pide emparejar: se practican aposta.
- **`npm test` 1661/1661** con `leelo5` publicada.
- **Navegador con clics**: las tres de la semana 2 (13 ejercicios) a **375 px en español y a 1100 px en inglés**
  (Chrome headless por CDP, `Input.dispatchMouseEvent`, «Probar sin código» y «Empezar»; cuatro ítems por ejercicio): aciertos y fallos, el feedback
  con los números del ítem (comprobadas a mano una docena de cuentas: productos, cocientes, pruebas de la división, problemas y combinadas),
  **sin errores de JavaScript ni desplazamiento horizontal**. El guion no maneja los campos de dos casillas ni las parejas: **`fraccion-decimal` 2
  (escribir) y 3 y parte de `errores5` 1 y 2 no se probaron con clics en esta pasada** (la 127 los probó a 375 px; que los haga la tarea de
  publicación nueva). `leelo5`, con clics en la 130 (64 combinaciones). Nada nuevo para las reabiertas.

## Propuesta de la tarea de la semana 2 (para Juan Luis; no está creada: la monta la 132 en el panel y la programa en Classroom la tarea 24 del reparto de la U5)

`U5 · Semana 2 · Multiplicar, dividir, fracciones y decimales` / `U5 · Week 2 · Multiplying, dividing, fractions and decimals`
· `unidad: 5` · `desde: '2027-01-25'` · `hasta: '2027-01-27'` (de lunes a miércoles; entrega **mié 27-1 a las 23:59**: el examen final es el
jue 28-1). Sesiones: 5 lun 25-1 (multiplicar, dividir, la división con resto y su prueba, de fracción a decimal), 6 mar 26-1 (de decimal a
fracción, periódicos, combinadas, problemas de varios pasos, repaso). Lo de la sesión 6 va «a elegir» (se da la víspera del plazo), y entran
como ★ de repaso las nucleares de la sesión 3 que en la tarea 1 iban «a elegir» (decisión 2 de la 130).

### Plan A (con las tres de la semana 2 y las de la semana 1 publicadas): 8 ★ + 2 a elegir = 100 puntos
| | Ejercicio | Destreza (sesión) |
|---|---|---|
| ★ | `['ortografia', 9]` Tilde diacrítica: sé, sí, tú, él, mí, más | — (ortografía) |
| ★ | `['multiplica-divide-decimales', 1]` Coloca la coma | U5-2C-02 nuclear, 2C-01, 2C-03 (5) |
| ★ | `['multiplica-divide-decimales', 2]` Divide hasta el final | U5-2C-04, 2C-05 nucleares (5) |
| ★ | `['multiplica-divide-decimales', 3]` Entre un decimal | U5-2C-06 nuclear (5) |
| ★ | `['multiplica-divide-decimales', 4]` ¿Está bien hecha? | U5-2C-07 nuclear, 2B-01 (5) |
| ★ | `['fraccion-decimal', 1]` De fracción a decimal | U5-2C-08 nuclear, 2C-11 (5-6) |
| ★ | `['suma-resta-decimales', 1]` Alinea la coma (repaso) | U5-1C-13, 1C-14 nucleares (3) |
| ★ | `['suma-resta-decimales', 4]` Mueve la coma (repaso) | U5-1C-15, 1C-16 nucleares (3) |
| elegir | `['multiplica-divide-decimales', 5]` Problemas | U5-2A-01, 2A-02 nucleares (5) |
| elegir | `['multiplica-divide-decimales', 6]` Combinadas | U5-2C-14, 2C-15 nucleares (6) |
| elegir | `['fraccion-decimal', 2]` De decimal a fracción | U5-2C-10 nuclear (6) |
| elegir | `['fraccion-decimal', 3]` Los que hay que saberse | U5-2C-09 (5) |
| elegir | `['fraccion-decimal', 4]` ¿Fracción o decimal? | U5-2C-12 (6) |
| elegir | `['errores5', 1]` ¿Dónde está el error? | U5-2C-17 nuclear, 2C-18 (6) |
| elegir | `['errores5', 2]` ¿Qué error es? | U5-2C-17 nuclear (6) |
| elegir | `['suma-resta-decimales', 2]` En el súper (repaso) | U5-1A-01 nuclear (3) |
| elegir | `['leelo5', 2]` Léelo | U5-1B-01, 1B-03, 2B-03 (1-6) |
| elegir | `['leelo5', 4]` Completa | U5-1B-04 a 1B-07, 2B-01, 2B-02 (1-6) |

```js
  estrella: [['ortografia', 9], ['multiplica-divide-decimales', 1], ['multiplica-divide-decimales', 2], ['multiplica-divide-decimales', 3], ['multiplica-divide-decimales', 4], ['fraccion-decimal', 1], ['suma-resta-decimales', 1], ['suma-resta-decimales', 4]],
  elegir: [['multiplica-divide-decimales', 5], ['multiplica-divide-decimales', 6], ['fraccion-decimal', 2], ['fraccion-decimal', 3], ['fraccion-decimal', 4], ['errores5', 1], ['errores5', 2], ['suma-resta-decimales', 2], ['leelo5', 2], ['leelo5', 4]],
  nElegir: 2,
```

### Plan B (si el jue 21-1 falta alguna)
Lo que no esté publicado sale de la lista. Sin `multiplica-divide-decimales` la tarea pierde cuatro de sus ★ y no vale la pena: se manda la
ortografía, el repaso de la semana 1 y lo publicado, y se avisa. Sin `fraccion-decimal` o sin `errores5`, su ★ (o sus «a elegir») se sustituye por
`['leelo5', 2]` y `['leelo5', 4]`. La tarea de publicación nueva lo concreta.

### Destrezas nucleares de la semana sin ★
U5-2A-01, 2A-02 (problemas) y las de la sesión 6 (2A-03, 2C-10, 2C-14, 2C-15, 2C-17): «a elegir». U5-2A-03 (varios pasos) no tiene ejercicio propio:
la cubren a medias los problemas y las combinadas de `multiplica-divide-decimales`.

## Hallazgos fuera de criterio (no bloquean; decide Juan Luis)
1. **§7 de `docs/practicas-unidad5.md` dice que las combinadas (U5-2C-14 y 2C-15) no tienen práctica**, pero la 126 añadió el 6-11 su ej. 6
   «Combinadas» (opción b de la ENTREGA de la 122). El §7 y `DESTREZAS` de `registro.js` van juntos (un test lo exige) y no son ficheros de esta
   tarea: lo tiene que corregir la tarea de publicación nueva o la coordinadora.
2. **Las otras tres opciones de U5-2C-17** (los cálculos bien hechos que acompañan al malo) no se han medido: solo la respuesta.
3. **Los cuestionarios (Forms) semanales** no entran en la regla 9 y no se han cotejado.

## Cómo comprobarlo en 1 minuto
`grep -n "slug: 'leelo5'" practicas/_comun/catalogo.js` (`disponible: true`); la portada la enseña desde el lun 18-1 (`UNIDADES.desde`) en «Para
toda la unidad». `npm run servir` → http://localhost:8080/practicas/leelo5/ → «Probar sin código». Para las reabiertas, sus recuentos arriba y el
detalle en cada una.
