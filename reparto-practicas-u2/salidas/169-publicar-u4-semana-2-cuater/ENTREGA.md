# ENTREGA · Tarea 169 · Publicar `fraccion-de` y `suma-resta` (semana 2 de la U4, cuarta publicación)

Sesión `s-20261112T003355-40db956b` (relevo de `s-20261111T220846-49bbdc87`, que caducó a las 00:08Z sin cierre ni commit; su
barrido a medias en el scratchpad se rehízo entero y se leyó coincidencia a coincidencia antes de usarlo). 2026-11-12.

## Veredicto

| Práctica (tarea, id) | Veredicto | Estado |
|---|---|---|
| `fraccion-de` (103, 51) | **pasa**: lo que pedía la reabierta del 6-11 está hecho y no sale ningún caso reabrible según el criterio del 11-11 | **publicada** · commit a9216a1 |
| `suma-resta` (104, 52) | **pasa**: lo que pedía la reabierta del 6-11 está hecho en los cinco ejercicios y no sale ningún caso reabrible | **publicada** · commit a9216a1 |

Commit a9216a1: `disponible: true` en las filas 51 y 52 de `practicas/_comun/catalogo.js` (nada más de ese fichero) y la línea de
publicadas de `docs/practicas-unidad4.md` (§6). La portada no enseña la U4 hasta el 14-12: se comprobó por URL. No se tocó código de
las prácticas (ninguna errata de una línea que arreglar).

El papel no ha cambiado desde el último barrido (`find … -newermt '2026-11-09 18:15'`: nada; el último commit de la carpeta de la
unidad sigue siendo eeed01f, el de los nombres).

## Cómo se revisó

- **Barrido propio** (guiones en el scratchpad de la sesión, fuera del repo). El lector abre los 16 ficheros que se esperan y cuenta
  sus casos: los tres `casos-examen-semanaN.tsv` (120 filas cada uno, enunciado y `correcta`), `examen-u4-semanaN.tex` (1020 ítems:
  51 exámenes × 20) y `-extra.tex` (60), los cuatro `.tex` del final (modelos 1 y 2, recuperación y adaptado-A) y las tres hojas sin
  recuadros de apoyo; 17250 trozos. **Comprobación del lector** (trampa de la 163): de las listas que la práctica ya excluye ve 36 de 49
  sumas de `RESERVADOS`, 8 de 10 naturales y 7 de 10 fracciones de una cantidad; las que no ve son casos de versiones antiguas de las
  hojas (ya no están en el papel), ejemplos de los recuadros de apoyo (quitados a propósito) y una suma dentro de una cadena con
  producto de la hoja 3. Claves sacadas del papel, no de la práctica: fracción con su total (cada fracción **suelta** y cada pareja) para
  `fraccion-de` 1, 2 y 4; parejas (parte, otra) sin orden para su ej. 3; términos con signo **sin orden** de toda suma o resta del papel
  y de sus trozos, y las parejas de fracciones de los problemas de partes (U4-2A-01, 2A-02, 2A-04, 3A-04) para los cinco ejercicios de
  `suma-resta`. 3 semillas × 20000 ítems por ejercicio. Cada coincidencia se leyó en su contexto y se clasificó con el criterio de
  reapertura del 11-11.
- **Recuentos** (60000 ítems por ejercicio; casos reabribles = el mismo enunciado o cuenta, la respuesta de un examen pedida tal cual, o
  un paso que el ítem pide y que es el caso entero del examen):
  - `fraccion-de`: ej. 1, 2, 3 y 4 (también `queda` y `dos`), **0 reabribles**. Lo que pedía la reabierta del 6-11 se cumple: ninguna
    fracción suelta ni pareja de un ítem reproduce con su total un caso de U4-1A-01, 2A-02 o 3A-04 de los semanales. Las coincidencias
    que da la clave son números de apartados distintos de una misma línea de la hoja 1, problemas «del resto» de la hoja 3 (la fracción
    no se toma del total) y pasos no preguntados de problemas de la hoja 2 (hallazgos 1 y 2).
  - `suma-resta`: ej. 1 a 5, **0 reabribles**. Ninguna suma o resta de las hojas 2 y 3, de los semanales ni del final sale en ningún
    orden en ningún ejercicio; la cuenta mal hecha de U4-3C-11 (semanal 3 y su extra) sale 0 veces en 100000 ítems de los ej. 1, 2, 4 y
    5. Quedan solo trozos de cadenas más largas que el ítem no pide, opciones que no son la respuesta (criterio de la 119) y parejas de
    fracciones de problemas cuya suma el examen no escribe (hallazgo 3).
- **Regla de oro**: 3000 ítems de cada ejercicio de elegir (`fraccion-de` 4, `suma-resta` 4 y 5) comprobados por valor con
  `_comun/fracciones.js`: una sola buena, ninguna opción repetida ni equivalente a otra, la buena es la cuenta; el ej. 5 con exactamente
  una línea mal o ninguna y dos razones distintas, una de ellas la buena. **0 fallos.** Leídos a mano 36 ítems del ej. 4 de
  `fraccion-de`, 32 del ej. 4 y 32 del ej. 5 de `suma-resta`, con todas sus opciones: ningún distractor ni ninguna razón se puede dar
  por buena.
- **Realismo** (3000 ítems de cada ejercicio con contexto, contra las cotas del acta): clase de 12 a 36, pizza de `suma-resta` ej. 4 de 3 a
  15 trozos (m.c.m. ≤ 12), ahorro hasta 2000 € con cada compra de `queda` y `dos` ≤ 250 €, todos los totales en la cota y en el paso de
  su contexto, ninguna opción de cantidad fuera de la cota en `parte` y `restante`. **0 fallos.**
- **Navegador con clics de ratón** (Chrome headless por CDP, `Input.dispatchMouseEvent` en el centro del elemento visible, «Probar sin
  código», servidor local; el ítem se resuelve leyendo la pantalla y comparándola con las funciones de texto de la propia práctica): un
  acierto y un fallo de **cada uno de los 9 ejercicios**, a **375 px** y a **1100 px**, con ítems en **español y en inglés** (el idioma
  alterna por ítem); en el ej. 5 de `suma-resta`, además, «no hay error» bien y mal, línea equivocada, razón equivocada y línea + razón
  buenas, en los dos idiomas; en el ej. 2, nueve ítems seguidos (dos y tres fracciones) a 375 px. El feedback dice qué ha pasado con los
  números del ítem; las fracciones se ven enteras (capturas revisadas); sin desbordes horizontales ni recortes (`scrollWidth`, cajas
  de cada `.frac` y de cada botón); **sin excepciones ni errores en la consola**.
- Tests: `node --test tests/practicas-comun.test.js tests/practicas-fraccion-de.test.js tests/practicas-suma-resta.test.js` 81/81;
  `npm test` 1807/1807 (con el `disponible` ya cambiado).

## Propuesta de la tarea de la semana 2 (para Juan Luis; no está creada)

**Vale el plan A de `salidas/110-publicar-u4-semana2/ENTREGA.md` tal cual**: todo lo que cita está publicado en el `catalogo.js` de
a9216a1 (`ortografia` 45, `fraccion-de` 51, `suma-resta` 52, `simplifica` 49, `equivalentes` 48, `compara` 50) y el ejercicio de
ortografía, el 6 (la coma del vocativo), es el que el calendario del curso pone para U4 · 2.

`U4 · Semana 2 · Sumar y restar fracciones` / `U4 · Week 2 · Adding and subtracting fractions` · `unidad: 4` · `desde: '2026-12-21'` ·
`hasta: '2027-01-07'` (la prueba 2 es el vie 8-1; Navidad del 23-12 al 6-1 en medio).

```js
  estrella: [['ortografia', 6], ['suma-resta', 1], ['suma-resta', 2], ['suma-resta', 3], ['suma-resta', 4], ['fraccion-de', 1], ['fraccion-de', 4]],
  elegir: [['fraccion-de', 2], ['fraccion-de', 3], ['suma-resta', 5], ['simplifica', 3], ['equivalentes', 4], ['compara', 1]],
  nElegir: 3,
```

Puntúa sobre 100 (tarea 166, LISTA): 7 ★ + 3 a elegir = 10 ejercicios, 10 puntos cada uno. Lo único que cambia respecto a la 110: la
variante «larga» por la Navidad (`nElegir: 5`) ya no necesita el ×100/120 al calificar, porque con la 166 cada uno de sus 12
ejercicios pesa 100/12. **La tarea 121 ya puede montarla** (Juan Luis delante con el panel abierto; plazo mar 8-12). El plan B ya no
hace falta.

## Hallazgos fuera de criterio (no bloquean; deciden Juan Luis o la coordinadora)

1. **`fraccion-de` ej. 4 `queda` con cuentas de U4-1C-08 del semanal 1** («n/d de T»): 125 de 60000 ítems (0,21 %), 5 cuentas
   distintas, todas de depósito de coche. El ítem pregunta lo que queda, no la cuenta del examen (paso compartido que el ítem no
   pregunta), aunque su distractor `gastado-como-queda` es justo esa parte. Además, el semanal 1 es el 18-12 y la tarea de la semana 2
   abre el 21-12. Si se quieren fuera, son 5 claves `n/d|total` más en `HUELLAS_EJ4` (la 103 ya excluye así las de 1A-01).
2. **Pasos de problemas de las hojas en `fraccion-de`** (ej. 1, 2 y 4 `dos`): la fracción de una cantidad o la pareja de fracciones de
   dos problemas de la hoja 2 con el mismo total, preguntando otra cosa (la hoja pide la fracción que queda o el dinero que queda).
   Pasos no preguntados; la pareja con su total, 27 de 60000.
3. **Parejas de fracciones de problemas de examen sumadas en `suma-resta`**: los problemas U4-2A-01 y 2A-02 de los semanales 2 y 3 y del
   final usan dos fracciones que el alumno suma sin que el examen escriba la suma (18 parejas). El ej. 2 pide esa suma en 644 de 60000
   ítems (1,1 %, 16 parejas) y el ej. 5 la enseña resuelta en 3064 de 60000 (5,1 %, 13 parejas); el ej. 4, que es el que hace el problema
   entero, no saca ninguna. La práctica pide un paso que no es el caso entero del examen (el examen pide lo que queda): con el criterio
   del 11-11 no se reabre. Es el hallazgo más visible de esta revisión; si Juan Luis quiere que cuente, son huellas nuevas en
   `HUELLAS_SUMAS` (una reabierta corta de la 104).
4. **El ej. 5 de `suma-resta` repite mucho**: `1/2 + 1/6` es el 19 % de sus ítems (13 % sin error), y `1/2 + 3/10` y `1/10 + 1/2`, el
   10 % cada una (10000 ítems). El reintento de `generarCaza` favorece las parejas que más se aceptan, y las exclusiones del 6-11 han
   concentrado más el reparto. No es regla de oro ni realismo; si molesta, sortear entre las parejas válidas en vez de reintentar.
5. **Frases repetidas en dos feedbacks**: `fraccion-de` ej. 3, error `parte-entre-el-resto` («Hay que compararla con el total: 23 + 14 =
   37. El total es 23 + 14 = 37.») y `suma-resta` ej. 5, «no había error» marcando una línea («…las tres líneas están bien. Las tres líneas
   están bien: …»): la explicación del error y la solución dicen lo mismo seguido. Se entiende; no es una errata de una línea.
6. Los cuestionarios de Forms de la U4 (`exámenes-semanales/semana-N/cuestionario-*`) no entran en el barrido: son prácticas, no
   exámenes, y la ficha no los pide.

## Ficheros (git show --stat a9216a1)
```
 docs/practicas-unidad4.md    | 17 ++++++++---------
 practicas/_comun/catalogo.js |  4 ++--
 2 files changed, 10 insertions(+), 11 deletions(-)
```
