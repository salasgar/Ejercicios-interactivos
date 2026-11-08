# Entrega de la tarea 130 · Revisión y publicación de la semana 1 de la U5 (`lee-decimales`, `compara-decimales`, `suma-resta-decimales`, `leelo5`)

Sesión `s-20261108T095958-d9654cd4`, 2026-11-08 (lanzador automático, sin nadie delante; cadena 130 → 131). Commit: **89826a3**
(`docs/practicas-unidad5.md`). **`catalogo.js` no se toca: no se publica ninguna.**

## Resultado
| Práctica (tarea, id) | Veredicto | Estado |
|---|---|---|
| `lee-decimales` (123, 57) | **no pasa**: ej. 1, 2 y 3 sacan casos del examen 1 (lectura, valor de la cifra, fracción decimal) y dos de la hoja 1 | sin publicar · `hechos/reabiertas/123--s-20261108T095958-d9654cd4-revision.md` (MEDIO, corta) |
| `compara-decimales` (124, 58) | **no pasa**: ej. 1 saca parejas del examen 1 y del final, y tres de la hoja 1; ej. 4, decimales de redondear del examen 1 y del final | sin publicar · `hechos/reabiertas/124--…-revision.md` (MEDIO, corta) |
| `suma-resta-decimales` (125, 59) | **no pasa**: ej. 3 saca un problema del examen 1 con los mismos datos (19 de 20000); ej. 4, nueve movimientos de la coma del examen 1, tres del final y uno de la hoja 1 | sin publicar · `hechos/reabiertas/125--…-revision.md` (MEDIO, corta) |
| `leelo5` (129, 63) | **no pasa**: ej. 2 saca tres casos del examen 1 (de palabras a cifras) y dos de la hoja 1 | sin publicar · `hechos/reabiertas/129--…-revision.md` (MEDIO, corta) · **se publica con la semana 2** |

La causa es la misma en las cuatro: se escribieron antes que el examen semanal 1 (sus ENTREGA lo dicen: «`HUELLAS_EXAMEN` vacío y preparado, la
130 coteja»), y el examen salió después con casos que sus generadores producen. Las cuatro reabiertas llevan **las huellas ya calculadas** con la
clave de cada práctica (fuera del repositorio) y lo que falta en claro de la hoja; comprobado en una copia de `practicas/` en el scratchpad: **con
ellas, 0 coincidencias** en los 16 ejercicios. Son de pegar y testear (~20 min cada una) y tocan carpetas disjuntas: caben las cuatro a la vez.

**Quedan sin publicador**: la 130 no puede volver a publicar cuando se cierren. Hace falta una tarea de publicación nueva (ALTO, como la 119 para
la U4), que dé de alta la coordinadora, con plazo **jue 14-1** (la tarea semanal 1 sale el lun 18-1; ideal antes de Navidad). `leelo5` la puede
publicar la 131 si su reabierta está cerrada cuando la 131 corra; si no, la misma tarea nueva.

## Cómo se revisó
- **Cotejo independiente** (guiones en `/tmp/pu2-130/`, fuera del repositorio, porque leen los casos en claro): los 120 casos de
  `casos-examen-semana1.tsv` (20 posiciones × 6 variantes; `examen-semana1-extra.tex` usa esas mismas variantes), los ejercicios de
  `hoja-unidad5-semana1.tex` (también los que la hoja escribe con palabras y las flechas de la recta, que no están entre `$…$`) y los cinco
  `.tex` del examen final (modelos 1 y 2, recuperación, adaptado-A y el de dislexia), solo lo de la semana 1. **20000 ítems por ejercicio**,
  semilla 130000 + nº de ejercicio, idioma alterno. La clave sale de los datos del papel, no de las prácticas, **por familias de tarea**: el
  decimal (leer, escribir en cifras, valor de una cifra, fracción decimal, recta, redondear), la pareja sin orden (comparar), el conjunto
  (ordenar, con 3 o más valores en común), el cálculo sin orden de los sumandos, los importes de la compra, los datos de la medida, y el
  movimiento de la coma (decimal, operación y potencia; un cambio de unidad es su movimiento). Cuenta **la misma tarea con los mismos datos**, en
  los dos sentidos (de un decimal a su fracción decimal y al revés) y en los dos idiomas. Un decimal del examen dentro de otra tarea (una
  consigna de ordenar de `leelo5` que lleva el decimal de un caso de leer) no cuenta.
- **Recuentos** (casos de papel distintos que salen, sobre 20000 ítems por ejercicio):

  | Ejercicio | Examen 1 | Examen 2 (repaso) | Hoja 1 | Final |
  |---|---|---|---|---|
  | `lee-decimales` 1 · 2 · 3 · 4 | 7 · 3 · 5 · 0 | 0 · 0 · 0 · 0 | 2 · 0 · 0 · 0 | 0 · 0 · 1 · 0 |
  | `compara-decimales` 1 · 2 · 3 · 4 | 8 · 0 · 0 · 1 | 0 · 0 · 0 · 4 | 3 · 0 · 0 · 0 | 4 · 0 · 0 · 4 |
  | `suma-resta-decimales` 1 · 2 · 3 · 4 | 0 · 0 · 1 · 9 | 0 · 0 · 0 · 2 | 0 · 0 · 0 · 1 | 0 · 0 · 0 · 3 |
  | `leelo5` 1 · 2 · 3 · 4 | 0 · 3 · 1 · 0 | 0 · 1 · 6 · 0 | 0 · 2 · 0 · 0 | 0 · 0 · 1 · 0 |

  El **examen semanal 2** (`casos-examen-semana2.tsv`) repasa la semana 1 (U5-1C-08, 1C-10, 1C-13, 1C-16) y se cotejó también; para `leelo5`,
  que va a la semana 2, entero (U5-2C-08 y 2C-10, con la consigna del examen casi literal en `consigna_fraccion`). Las reabiertas llevan un añadido
  con las listas completas. Con esas huellas, todas las casillas a 0. Detalle de cada una (variantes, veces) en su reabierta.
- **Regla de oro y aritmética**: no se repite aquí lo que ya barren los tests de cada práctica (3000 ítems, por valor, contra `BigInt`):
  `npm test` **1657/1657** en el árbol de esta sesión.
- **Navegador con clics de ratón** (Chrome headless por CDP, `Input.dispatchMouseEvent` en el centro de cada botón; «Probar sin código»,
  `?probar=1&ejercicio=N&idioma=xx`, «Empezar»): las cuatro prácticas, sus 16 ejercicios, **a 375 y a 1100 px, en
  español y en inglés** (64 combinaciones, cuatro ítems cada una; en el ej. 2 de `compara-decimales`, tocando las fichas en orden y al revés):
  aciertos y fallos en todos, el feedback siempre con los números del ítem, **sin errores de JavaScript, sin diálogos y sin desplazamiento
  horizontal**. Dos erratas, las dos en `compara-decimales` (a su segunda reabierta): el feedback del caso «ceros» del ej. 1 sale con los
  argumentos cambiados («… 6,05 6,70 6,05.», sin el signo), y el del ej. 4 dice «la de las milésima».

## Decisiones de la 130 (eran suyas: punto 4 de la ENTREGA de la 122 y punto 1 de la de la 129)
1. **`leelo5` se publica con la semana 2**, no con la 1. Lleva vocabulario y cuentas de las sesiones 5 y 6 (*dividend*, *quotient*, *remainder*,
   *recurring*, *simplest form*, productos y cocientes) en sus cuatro ejercicios, y filtrar por `sesion` según la fecha no lo sabe hacer la base.
   Con la semana 2 todo está dado salvo la sesión 6 (mar 26-1), y en la tarea de esa semana va «a elegir». Su bloque de la portada («Para toda la
   unidad») no cambia. Escrito en la reabierta de la 129 («no añadas ningún filtro por sesión») y en `docs/practicas-unidad5.md`.
2. **Lo de la sesión 3 (jue 21-1) va «a elegir»** en la tarea de la semana 1, porque se da el mismo día del plazo; es el criterio de la 109 para
   la U4. Las nucleares de la sesión 3 (sumar y restar, ·/: por 10, 100 y 1000, el problema de dinero) pasan a ★ de repaso en la tarea de la
   semana 2 (lo propone la 131).

## Propuesta de la tarea de la semana 1 (para Juan Luis; no está creada: la monta la 132 en el panel y la programa en Classroom la tarea 24 del reparto de la U5)

`U5 · Semana 1 · Leer, comparar, redondear y sumar decimales` / `U5 · Week 1 · Reading, comparing, rounding and adding decimals`
· `unidad: 5` · `desde: '2027-01-18'` · `hasta: '2027-01-21'` (de lunes a jueves; entrega **jue 21-1 a las 23:59**; la prueba 1 es el vie 22-1).
Sesiones: 1 lun 18-1 (qué es un decimal, leer y escribir, valor de las cifras, fracción decimal, recta), 2 mar 19-1 (comparar, ordenar,
intercalar, redondear), 3 jue 21-1 (sumar y restar, ·/: por 10, 100 y 1000, problemas de dinero y medidas).

### Plan A (con `lee-decimales`, `compara-decimales` y `suma-resta-decimales` publicadas): 7 ★ + 3 a elegir = 100 puntos
| | Ejercicio | Destreza (sesión) |
|---|---|---|
| ★ | `['ortografia', 8]` ¿Lleva tilde? Qué, cómo, dónde… | — (ortografía) |
| ★ | `['lee-decimales', 1]` Léelo | U5-1B-01, 1B-03 nucleares, 1B-02 (1) |
| ★ | `['lee-decimales', 2]` ¿Qué vale esta cifra? | U5-1C-01 nuclear, 1C-03 (1) |
| ★ | `['lee-decimales', 3]` La fracción decimal | U5-1C-04 nuclear (1) |
| ★ | `['compara-decimales', 1]` ¿Cuál es mayor? | U5-1C-07, 1C-05 nucleares, 1C-17 (2) |
| ★ | `['compara-decimales', 2]` Ordena | U5-1C-08 nuclear, 1C-17 (2) |
| ★ | `['compara-decimales', 4]` Redondea | U5-1C-10 nuclear, 1C-11 (2) |
| elegir | `['lee-decimales', 4]` En la recta | U5-1C-06 (1) |
| elegir | `['compara-decimales', 3]` Entre dos | U5-1C-09 (2) |
| elegir | `['suma-resta-decimales', 1]` Alinea la coma | U5-1C-13, 1C-14 nucleares (3) |
| elegir | `['suma-resta-decimales', 2]` En el súper | U5-1A-01 nuclear (3) |
| elegir | `['suma-resta-decimales', 3]` Medidas | U5-1A-02 (3) |
| elegir | `['suma-resta-decimales', 4]` Mueve la coma | U5-1C-15, 1C-16 nucleares (3) |

```js
  estrella: [['ortografia', 8], ['lee-decimales', 1], ['lee-decimales', 2], ['lee-decimales', 3], ['compara-decimales', 1], ['compara-decimales', 2], ['compara-decimales', 4]],
  elegir: [['lee-decimales', 4], ['compara-decimales', 3], ['suma-resta-decimales', 1], ['suma-resta-decimales', 2], ['suma-resta-decimales', 3], ['suma-resta-decimales', 4]],
  nElegir: 3,
```

### Plan B (si el jue 14-1 alguna de las tres no está publicada)
Se quita lo suyo: sin `suma-resta-decimales`, `elegir` se queda en `lee-decimales` 4 y `compara-decimales` 3 con `nElegir: 2` y la tarea vale
90 (o se completa con un repaso de la U4 publicado, a decidir); sin `lee-decimales` o sin `compara-decimales`, la tarea pierde la mitad de sus ★
y no vale la pena: se manda solo la ortografía y lo publicado, y se avisa. La tarea de publicación nueva lo concreta.

### Destrezas nucleares de la semana sin ★
- Las de la sesión 3 (U5-1A-01, 1C-13, 1C-14, 1C-15, 1C-16): «a elegir» (decisión 2); ★ de repaso en la semana 2.
- U5-1B-01 a 1B-07 en inglés también los practica `leelo5`, que va a la semana 2 (decisión 1).
- Sin ejercicio en la app (no son de esta tarea): U5-1C-02 (en décimas, centésimas o milésimas; propuesta de la 123), U5-1A-03 (comparar en
  contexto) y U5-1A-04 (cambios de unidad; propuesta de la 125). U5-1C-12 (estimar) es de hoja, por el acta.

## Hallazgos fuera de criterio (no bloquean; decide Juan Luis)
1. **Las opciones falsas del examen 1** en U5-1C-05, 1C-07 y 1C-17 son parejas que no se han medido (como en la 119 con `compara`): una opción
   falsa no da la respuesta. Si se quieren excluir, son más huellas en `HUELLAS_PAREJAS` de `compara-decimales`.
2. **Los cuestionarios (Forms) semanales** (`cuestionario-semana1-casos.tsv`) no entran en la regla 9 y no se han cotejado.
3. **El recuadro del final adaptado-A y el de dislexia** pone un decimal de ejemplo («you can write a point or a comma») que sale en
   `lee-decimales` 3: es un ejemplo de escritura, no un caso; no se reserva.
4. **`lee-decimales` 3 y la semana 2**: saca como fracción **decimal** sin simplificar decimales que el examen 2 usa en otra tarea (U5-2C-08,
   de una fracción cualquiera a decimal dividiendo; U5-2C-10, de decimal a fracción irreducible). No es la misma tarea y no se reserva; si Juan Luis lo ve demasiado cerca, son seis huellas
   más en `HUELLAS_EXAMEN` de `lee-decimales`.
5. **Los nombres de error en tercera persona se pegan al feedback**, que tutea: «es 96,02, no 96,2: ha añadido un cero que no estaba» (`leelo5`,
   `ERRORES_LEELO`; también los propios de `suma-resta-decimales`). Es la convención de los nombres (son para el panel del profesor), y ya se vio
   en la U4 (`leelo4`, ENTREGA de la 109): si se cambia, se cambia para todas las unidades.
6. **Los textos de la hoja escritos con palabras** («siete milésimas», «cuatro unidades y ocho centésimas») se le escaparon a dos prácticas que
   decían excluir la hoja entera: queda en `docs/practicas-unidad5.md` (§3) como trampa para la 131 y las siguientes.

## Ficheros (git show --stat 89826a3)
```
 docs/practicas-unidad5.md | 125 +++++++++++++++++++++++++++++++++++++++++++---
 1 file changed, 117 insertions(+), 8 deletions(-)
```

## Cómo comprobarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/suma-resta-decimales/ → «Probar sin código» → ej. 3 (Medidas): en unos cientos de ítems sale la
botella del examen 1 (posición 2, variante 3). Para el resto, los recuentos de arriba y el detalle de cada reabierta. Que nada está publicado:
`grep -n "unidad: 5" practicas/_comun/catalogo.js` (todas con `disponible: false`).
