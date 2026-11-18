# Prácticas interactivas de la unidad 6 (`practicas/`)

Empezado el 2026-11-08 por la tarea 144 del reparto PU2 (`reparto-practicas-u2/`), que deja
la base de la unidad 6: el catálogo, la portada, los esqueletos, la pieza común `algebra.js` y la
tabla de destrezas (§7). Los apartados 1-6 y 8 los escriben las tareas de publicación (156-159),
al revisar cada semana, con el mismo espíritu que [practicas-unidad5.md](practicas-unidad5.md).
La base común, el panel, los dos sistemas de códigos y los varios profesores son los de la
unidad 2: están en [practicas-unidad2.md](practicas-unidad2.md), y aquí solo se cuenta lo que cambia.

Son once mini-aplicaciones para 1.º ESO bilingüe sobre la unidad 6, **Álgebra** (ids 69-79 del
catálogo, tareas 145-155 de PU2; la portada las enseña por semanas desde el lunes 1-2-2027), la
primera unidad con letras, con una pieza común nueva en `practicas/_comun/`:

- `algebra.js`: la **expresión lineal** (`a·x + b`, y con dos letras para reducir y para el valor
  numérico) con coeficientes `Fraccion` exactos de `fracciones.js`, siempre reducida y comparada
  por forma canónica (`2x + 3` = `3 + 2x`; `x/2` = `½x` = `0,5x`); los **términos** sin reducir, en
  el orden en que se escriben (`5x + 2x − 3x`, los pasos de una ecuación); la **ecuación** de primer
  grado guardada tal como se escribe (`x/2 + x/3 = 5`), con su solución exacta (o «ninguna» o
  «infinitas»), la comprobación, la equivalencia por solución, el método paso a paso (quitar
  denominadores, transponer, reducir, despejar) y la ecuación sin denominadores; leer lo que teclea
  el alumno sin `eval` (con un motivo y un mensaje cuando no vale: `x2`, `x²`, `1/2x`…); escribir en
  texto y en HTML con la notación del acta; decirlo en palabras (*two x plus three*, *dos equis más
  tres*) con todas las lecturas que valen; **los errores típicos de la unidad** (columna `nota` del
  inventario), de donde salen los distractores, cada uno con `null` cuando no sirve; la tabla
  `FRASES` del hilo «del enunciado al álgebra»; y la huella FNV-1a de la forma canónica, para
  excluir los casos de examen sin escribirlos. La API está en su cabecera.

## 1. Qué ve el alumno

Lo mismo que en la unidad 2 (§1 de [practicas-unidad2.md](practicas-unidad2.md)): código,
10 puntos por ejercicio con 5 vidas, el idioma de cada ítem sorteado, el feedback con los
números del ítem, el botón «No lo sé» y la tarea de la semana. Lo propio de la unidad 6
(apartados 1-6 escritos por la tarea 156 el 2026-11-17, al revisar la semana 1):

1. **La portada enseña la unidad 6 desde el lunes 1-2-2027** (`desde` de la unidad 6 en
   `UNIDADES`, `catalogo.js`). Antes, una práctica publicada solo se abre por su URL. Las
   prácticas salen por semanas (`BLOQUES` en `practicas/portada.js`): semana 1 (`traduce`,
   `valor-numerico`, `terminos-semejantes`), semana 2 (`es-solucion`, `transposicion`), semana 3
   (`resuelve`, `parentesis-algebra`, `denominadores`), semana 4 (`problemas-ecuaciones`) y «Para
   toda la unidad» (`errores6`, `leelo6`).
2. **Dos expresiones equivalentes son la misma respuesta**, y dos ecuaciones con la misma
   solución también: `2x + 3` y `3 + 2x`, `x/2` y `0,5x`, `x + x` y `2x`. Lo que teclea el alumno
   se lee con `leerExpresion` de `algebra.js` y se compara **por forma canónica**: vale `3+2x`,
   `2·x + 3`, `2*x+3`, `X`, y cualquier letra si el ejercicio no la fija. Lo que no se puede leer
   (`x2`, `x²`, `1/2x`, dos letras donde va una) no cuenta como fallo: sale un aviso que dice qué
   pasa («¿2x o x²?»). Ninguna opción equivale a otra (los tests lo comprueban por forma canónica
   y por solución).
3. **La notación del acta de la unidad**: el coeficiente delante y pegado (`3x`, `−2x`), `x` y no
   `1x`, `·` solo entre números, la división con letras como fracción (`x/2` dibujado con raya),
   `3(x − 2)` sin punto; en inglés, *two x*, *x over two*, *like terms*, *both sides*.
4. **El dinero va siempre con dos decimales** (`9,00 €` / `€9.00`), también en las opciones y en
   las cuentas del feedback; al teclear valen `33` y `33,00`. Los contextos de la app son los del
   acta: tarifas con una parte fija, edades de un paso, cantidades de cosas, «pienso un número» y
   consecutivos (las edades con tabla, las monedas y el jardín son del papel).
5. **Cada ejercicio empieza con su introducción**, en los dos idiomas, y el feedback de un fallo
   nombra el error con los números del ítem («`x + 3 = 10`: al pasar el 3 al otro lado cambia de
   signo»; «23 sale de multiplicar solo la x por 3»).

## 2. Cómo lee el profesor los resultados

Igual que en las unidades 2-5 (§2 de [practicas-unidad2.md](practicas-unidad2.md)): el panel
`practicas/profesor.html`, la nube del espacio de cada profesor y la vista «Fallos» con «qué
falla más». **Cada fallo lleva el id de un error típico** en el campo `error`
(`api.responder({ error })`):

- los de la tabla de la unidad, en `ERRORES_TIPICOS` de `practicas/_comun/algebra.js`, cada uno
  con su nombre `{ es, en }`, un ejemplo y su función (sumar no semejantes, `x · x = 2x`,
  yuxtaponer al sustituir, perder el signo al sustituir, saltarse la jerarquía, transponer sin
  cambiar el signo, invertir `12x = 3`, el menos delante del paréntesis…);
- los propios de una práctica, en su `logica.js` (`ERRORES_TRADUCE` de `traduce`, los de
  `terminos-semejantes` y `leelo6`…). Como en las unidades 3-5, el panel no traduce todavía estos
  ids a su nombre.

## 3. La base común de la unidad 6

Un módulo nuevo en `practicas/_comun/` (tarea 144), puro: **`algebra.js`**. La API completa está
en su cabecera; lo esencial:

| Qué | Cómo |
|---|---|
| La expresión | `Lineal` inmutable y siempre reducida (`lineal(3, 2)` es `3x + 2`; dos letras con `new Lineal({ x: 7, y: 2 }, 0)`, solo para reducir y el valor numérico); coeficientes `Fraccion` exactos; `equals` y `clave()` por forma canónica; `evaluar`, `sumar`, `restar`, `porNumero`, `opuesta`. Las sumas sin reducir (`5x + 2x − 3x`) son **términos** (`{ coef, letra }` en el orden en que se escriben); `reducir(términos)` da el resultado y los grupos de semejantes para el feedback |
| La ecuación | `Ecuacion` guardada como se escribe (`x/2 + x/3 = 5` no se convierte en `5x/6 = 5`), con `resolver()` (una `Fraccion`, o «ninguna» o «infinitas»), `esSolucion`, `equivalente` (por solución), `pasos()` (quitar denominadores, transponer, reducir, despejar) y `sinDenominadores` |
| Lo que teclea el alumno | `leerExpresion` y `leerEcuacion`, sin `eval`: aceptan las formas de §1.2 y rechazan lo ambiguo con un motivo y un mensaje para el alumno |
| Escribir y decir | `aTexto`, `aHtml` (la fracción con `htmlFraccion`), `enPalabras` (*two x plus three*, *dos equis más tres*) y `lecturasValidas` (*twice x*, *half of x*: nunca son distractor) |
| Los errores típicos | `ERRORES_TIPICOS` (cada función da el resultado equivocado con los números del ítem, o `null` cuando ese error no cambia nada), `distractores(candidatos, correcta)` (sin dos equivalentes entre sí ni con la buena) y `NO_ES_ERROR` (`x · 3` por `3x`, `1x` por `x`, una solución sin simplificar) |
| La traducción | `FRASES`: las construcciones del hilo «del enunciado al álgebra» (el doble, la mitad, n más que, n menos que, el siguiente, consecutivos…) en los dos idiomas, con su glosa, su expresión y sus errores |
| Los casos reservados | la huella FNV-1a de la forma canónica, para excluir los casos de examen sin escribirlos |

Los distractores de la unidad 6 **salen siempre de un error típico con nombre**, calculado con
los números del ítem, y el `error` que se registra al fallar es el de ese distractor. Lo
aprendido en la revisión de la semana 1 (tarea 156):

- **Las cuatro prácticas de la semana 1 se escribieron antes que la hoja 1 y el examen 1** y
  dejaron sus listas de casos reservados vacías y preparadas. La 156 las cotejó al publicar
  (§6): con álgebra, «el mismo caso» es la misma tarea con la misma forma canónica (la misma
  frase traducida a la misma expresión; la misma expresión con el mismo valor de x; la misma
  suma de términos sin reducir), no el mismo texto.
- **La letra es la x** (acta, punto b): otra letra solo cuando el enunciado dice qué es
  (`h` las horas de una tarifa, `2a + 3b` en el valor numérico con dos letras); `y` como
  segunda letra solo para reducir, como en la hoja 1.

Tests: `tests/practicas-algebra.test.js` (la base de la unidad) y uno por práctica.

## 4. El contrato de una práctica

El de siempre: [practicas-unidad2.md](practicas-unidad2.md) y `practicas/plantilla/practica.js`.

## 5. Cómo se añade una práctica

Como en la unidad 2 (§5 de [practicas-unidad2.md](practicas-unidad2.md)): copiar
`practicas/plantilla/`, fila en `catalogo.js` con `unidad: 6` y `disponible: false`, `logica.js`
y su test antes que la interfaz, la línea de `DESTREZAS` en `registro.js` y la fila de §7 en el
mismo commit (lo exige `tests/practicas-registro.test.js`), su `slug` en un bloque de `BLOQUES`
y, al publicarla, `disponible: true`. Lo propio de la unidad 6:

1. Las expresiones y las ecuaciones, con `Lineal` y `Ecuacion` de `algebra.js`; los números,
   con `Fraccion`: **nunca `Number` en coma flotante ni `eval`**. Los tests comprueban la
   aritmética contra `BigInt` o enteros propios, aparte del generador.
2. **Cada distractor, de un error típico** de `ERRORES_TIPICOS` (o uno propio con su nombre
   `{ es, en }`), calculado con los números del ítem, y el mismo id en `api.responder({ error })`.
   Ninguna opción equivalente a otra **por forma canónica ni por solución**, y ninguna lectura
   válida como distractor (*twice x* / *two x*, *half of x* / *x over two*, *brackets* /
   *parentheses*).
3. Las reglas de contenido de la unidad 6 (en cada ficha 144-161 y, por encima, el acta de la
   unidad del 9/10-11): cada ejercicio respeta la `sesion` de sus destrezas; ni porcentajes ni
   proporcionalidad; x² solo en el valor numérico y en «¿es … solución?»; la solución como
   fracción irreducible o su decimal exacto (las dos valen), nunca un periódico; la x casi
   siempre; el dinero con dos decimales; el **realismo** con una cota por contexto que el test
   comprueba (edades, paga, precios, cantidades de cosas, «pienso un número» de −50 a 200).
4. **Los casos fijos no copian las hojas ni los exámenes** de la unidad: los de las hojas, en
   claro; los de los exámenes semanales y del final, por huella FNV-1a de la forma canónica,
   calculada fuera del repositorio.
5. Probarla en el navegador **pulsando cada botón con un clic**, a 375 px y en ancho, en los dos
   idiomas.

## 6. Las once prácticas

`id` es el del catálogo; «Semana» es la de la unidad en que se dan sus destrezas, y la de su
bloque en la portada. Las cotas y los errores de cada una, con más detalle, en la `ENTREGA.md`
de su tarea (`reparto-practicas-u2/salidas/NN-<slug>/`). Las de las semanas 2-4 las revisan y
completan aquí las tareas 157-159.

| Semana | `slug` | id | Tarea | Ejercicios | Cotas |
|---|---|---|---|---|---|
| 1 | `traduce` | 69 | 145 | Elige la expresión (de una frase a su expresión) · Escríbela (teclear la expresión de una frase) · Elige la frase (de una expresión a su frase) · Situaciones (edades, precios y tarifas con una letra) | tarifas: móvil 5-15 € + 1-3 €/GB y 2-12 GB, taxi 3-5 € + 1-2 €/km y 2-30 km, feria 3-10 € + 1-3 € y 2-10 atracciones, bici 2-6 € + 2-4 €/h y 2-8 h, carpeta 2-6 € + lápices a 1-2 €; hermano 2-9 años mayor, «dentro de» 2-20 años, «hace» 2-10 años; de 2 a 9 cuadernos; el dinero con dos decimales |
| 1 | `valor-numerico` | 70 | 146 | Sustituye y calcula (escribir o elegir) · La tabla (la expresión con dos o tres valores) · ¿Qué valor? (qué expresión vale N) | sin contextos; \|resultado\| ≤ 60; coeficientes 2-9, constantes 1-9 (6-20 en `b − ax`); x natural 2-9, negativo −1…−6, o 0,5 / 1,5 / 2,5 |
| 1 | `terminos-semejantes` | 71 | 147 | ¿Semejantes? (sí o no) · Coeficiente y parte literal · Reduce (teclear el resultado) · Caza el error (una reducción: bien, o qué error tiene) | sin contextos; coeficientes enteros de 1 a 9 |
| 2 | `es-solucion` | 72 | 148 | Compruébalo (¿es x = v solución?, sí o no) · ¿Qué ecuación? (la única de cuatro que tiene esa solución) · ¿Identidad o ecuación? · Inventa una (cualquier ecuación con esa solución; se corrige resolviéndola) | sin contextos; x en un solo miembro y sin paréntesis salvo en el ej. 3; coeficientes 2-9 (−2…−5 si es negativo), constantes 1-12 (hasta 20 en `b − ax`); soluciones −6…12, nunca 0; \|c\| y el valor probado ≤ 60 |
| 2 | `transposicion` | 73 | 149 | Con números (la operación que falta o el número del hueco) · Una operación · Dos operaciones, paso a paso (el primer paso y la solución) · 3x = 12 frente a 12x = 3 · Comprueba y corrige | sin contextos; ej. 1 con números de 2 a 100; ej. 2 y 5, coeficientes 2-9, términos 2-12, `x/n` con n 2-9; ej. 3, c de 1 a 100 y solución natural ≤ 48; ej. 4, números 2-15 (solución entera o fracción; vale el decimal exacto) |
| 3 | `resuelve` | 74 | 150 | El primer paso · Paso a paso · Resuélvela · ¿Está bien resuelta? | sin contextos; sin paréntesis ni denominadores; \|coeficiente de x\| ≤ 9, números sueltos ≤ 12 (hasta 40 en «reducir», ej. 2); solución entera \|s\| ≤ 12, o fracción con denominador ≤ 9 y \|numerador\| ≤ 20; x = 0 en los ej. 2 y 3 |
| 3 | `parentesis-algebra` | 75 | 151 | Quita el paréntesis · ¿Cuál es el desarrollo? · Resuelve con paréntesis · Caza el error | sin contextos; un paréntesis por miembro; número delante del paréntesis de 1 a 6, positivo o negativo (o solo el signo menos), coeficientes dentro de 1 a 5, números 1-9, término delante hasta 9 (hasta 40 en el segundo miembro de las ecuaciones); solución entera casi siempre (fracción en ~12 %, \|numerador\| ≤ 40, denominador ≤ 6) |
| 3 | `denominadores` | 76 | 152 | ¿Por cuánto multiplico? · Sin denominadores · Resuélvela · Paso a paso | sin contextos; denominadores 2-12 con m.c.m. ≤ 30; hasta tres fracciones; sin paréntesis en los numeradores; solución entera casi siempre |
| 4 | `problemas-ecuaciones` | 77 | 153 | ¿Qué es x? · ¿Qué ecuación? · Resuelve y contesta · ¿Qué pide? · ¿Tiene sentido? | ocho contextos: consecutivos (el menor de 5 a 120), reparto «el doble, el triple…» (3-40 cada uno, total ≤ 200), reparto de tres (3-30, sobran 2-9), hermanos (el menor 6-16, diferencia 2-8), entradas (3-25 €, extra 2-12 €), cuadernos y bolígrafo (0,50-6,00 € y 0,50-4,00 €, de 5 en 5 céntimos), perímetro con palabras (lados ≤ 50), «pienso un número» (2-60, resultado positivo); solución natural o dinero exacto al céntimo |
| toda | `errores6` | 78 | 154 | ¿Dónde está el error? · ¿Qué error es? · Corrígelo | sin contextos; doce plantillas, una por error típico; coeficientes 1-12, soluciones −12…15, constantes ≤ 30, denominadores 2-7, factor del paréntesis 1-6; ningún número de las líneas pasa de 1500 |
| toda | `leelo6` | 79 | 155 | La palabra (38 términos, del inglés al español y al revés) · Léelo (leer y escribir expresiones y ecuaciones) · La consigna (de examen, en inglés) · Completa (la palabra que falta) | coeficientes 2-9, constantes 1-9, denominadores 2-6, x de 2 a 6; lápices 5-30, edades 8-16, «hace» 1-5 años |

**Publicadas** (a 2026-11-18): `traduce`, `valor-numerico`, `terminos-semejantes`, `es-solucion`,
`transposicion`, `resuelve`, `parentesis-algebra`, `denominadores`, `leelo6`, `errores6` y `problemas-ecuaciones`: las
doce de la unidad, las cuatro semanas enteras.
`traduce` y `valor-numerico` las publicó la tarea 156, tras las reabiertas que les
abrió la primera pasada de la 156 el 16-11 por casos de la hoja 1, del examen 1 y del final que sus
generadores producían: se escribieron antes que el papel. Las dos tienen abierta desde el 17-11 una
reabierta corta que no las despublica (en `traduce`, la variedad del ej. 1 y una solución que repite la
expresión en el ej. 4; en `valor-numerico`, «sumar antes de multiplicar» cuando la cuenta resta).
`terminos-semejantes` se quedó sin publicar en la 156 (el ej. 4 tenía todavía ítems con dos respuestas
buenas, y su test escribía casos de examen en claro) y la publica la 157 (abajo). `leelo6` tuvo una reabierta el 17-11 (casos del
papel en tres ejercicios, dos respuestas buenas en el ej. 3, letras que el enunciado no define), que quedó
atendida, y ya no saca ningún caso del papel. La revisión del 18-11 la reabrió otra vez: en el ej. 3
salían dos opciones falsas que decían lo mismo, y en el ej. 4, «One years ago». Se arregló en 7c36e41. Como tiene
vocabulario de los problemas (semana 4) y no filtra por sesión, no va en la semana 1: la publica
la tarea de la semana 4 (159), igual que `leelo5` salió con la semana 2. **Semana 2** (tarea 157, 18-11): se publica **`terminos-semejantes`** (la 157 la publica junto
con las suyas, tras su cuarta entrega, 714ff62: 0 casos del papel y ningún ítem con dos respuestas buenas).
`es-solucion` y `transposicion` se escribieron antes que la hoja 2 y el examen 2, no reservaban nada y se
reabrieron. En la tercera pasada (18-11) se publica **`transposicion`** (96b46da): ya no saca ningún caso del
papel en sus cinco ejercicios, tampoco en el 1, cuya huella dependía del orden de los lados. Y se publica
**`es-solucion`** (63c6253): desde 8c5aebf no saca ningún caso del papel y sus cuentas son exactas. Quedaba el
ejemplo fijo de la introducción del ej. 3, que era una identidad de la hoja 2; se cambió tras una reabierta
corta. Lo demás estaba bien en
las tres: regla de oro, campos, variedad y clics a 375 y 1100 px, en español y en inglés. **Semana 3** (tarea 158,
18-11): en la primera pasada no se publicó ninguna. `resuelve`, `parentesis-algebra` y `denominadores` se escribieron antes
que la hoja 3 y el examen 3, con las listas de reserva vacías, y sacaban casos de la hoja 3, del examen 3 y su extra, del
examen 4 y de los finales en casi todos sus ejercicios. Se reabrieron con las listas ya calculadas (las de los exámenes, como
huellas), y en la segunda pasada se publican las tres: **`resuelve`** (0289880), **`parentesis-algebra`** (421218b) y
**`denominadores`** (c00bd13). Ya no sacan ningún caso del papel (20000 ítems por ejercicio, con los miembros en cualquier
orden), el ej. 4 de `parentesis-algebra` ya no tiene ítems con dos respuestas defendibles, y el feedback ya no mezcla personas
ni lleva el guion del teclado. Regla de oro, variedad y clics a 375 y 1100 px, en español y en inglés, bien en las tres.
`parentesis-algebra` tiene una reabierta corta que no la despublica: en el ej. 4, cuando no hay error, el feedback empieza
«Está bien: En…», con mayúscula tras los dos puntos. **Semana 4** (tarea 159, 18-11): se publica **`leelo6`** (7c36e41). Sus
dos arreglos están bien: ninguna opción del ej. 3 repite a otra y no sale «one years» en 20000 ítems del ej. 4. Los clics, bien
(es/en, 375/1100 px). `problemas-ecuaciones` y `errores6` se escribieron antes que el papel, con las listas de reserva vacías,
y sacan casos de las hojas, de los exámenes 2-4 y de los finales en todos sus ejercicios (`errores6`, que es de toda la unidad,
de las cuatro hojas). Están reabiertas, con las listas ya calculadas (las de los exámenes, como huellas). `problemas-ecuaciones`
tiene además dos concordancias mal en el feedback en español y, en `pienso`, algún «-» del teclado. Lo demás está bien en las
dos: regla de oro, variedad y clics. En la segunda pasada (18-11) se reabrieron otra vez: a `problemas-ecuaciones` le
faltaban reservas (las ecuaciones de los enunciados y las de otras destrezas que, reducidas, coinciden con la planteada), y en
`errores6` el factor negativo de dos pistas iba sin paréntesis. En la tercera pasada (18-11) se publica **`errores6`**
(b837244): 0 casos del papel en sus tres ejercicios (20000 ítems por ejercicio, reducidos y término a término), regla de oro,
feedbacks (también los que se calculan al corregir) y clics a 375 y 1100 px, en español y en inglés, bien. `problemas-ecuaciones`
(e62b43a) ya no saca ningún caso del papel, pero se reabre por cuarta vez: en el ej. 2, el porqué de una ecuación falsa con
dinero escribe la solución en céntimos y con el separador colgando («x = 188,» por 1,88 €), en un 17 % de los ítems. Arreglado
en 6f5ac4b (el porqué usa `solTexto`, como el ej. 5). En la cuarta pasada (18-11) se publica **`problemas-ecuaciones`**:
0 casos del papel en sus cinco ejercicios, ninguna opción falsa con dinero mal escrita en 20000 ítems del ej. 2, regla de oro,
feedbacks y clics (es/en, 375/1100 px) bien. La portada enseña la unidad 6 desde el
lunes 1-2-2027. Las reabiertas están en `reparto-practicas-u2/hechos/reabiertas/`. El estado vivo es el
campo `disponible` de `catalogo.js`.

## 7. Qué práctica cubre qué destreza de la unidad 6

Una fila por destreza de `inventario-unidad6.tsv` (78; **propuesta de la tarea 01 del reparto de la
U6, del 2026-11-06, sin firmar**: la aprueba Juan Luis en la tarea 02, firma F0, y el acta será
`inventario-unidad6-revision.md`), con las prácticas que la trabajan según la ficha de cada tarea
(diseño de la montadora de la U6 del 3-11, con el reparto de la tarea 144 donde la ficha no lo decía;
ver abajo). «—» quiere decir que ninguna práctica la trabaja de forma expresa.
`practicas/_comun/registro.js` (`DESTREZAS`) tiene que coincidir con esta tabla: lo comprueba
`tests/practicas-registro.test.js`. **Si F0 cambia los ids o quita filas, la tarea de publicación de
la semana (156-159) pone al día esta tabla y `DESTREZAS` a la vez.**

| Destreza | Sem. | Nuclear | Qué es | Prácticas |
|---|---|---|---|---|
| U6-1A-01 | 1 | sí | Traducir al lenguaje algebraico frases de una operación: el doble, el triple, la mitad, n más que, n… | `traduce` |
| U6-1A-02 | 1 | sí | Traducir frases de dos operaciones sin paréntesis, en el orden en que se dicen: el doble de un númer… | `traduce` |
| U6-1A-03 | 1 | sí | Expresar con letras cantidades de un contexto: edades, precios y cantidades de cosas | `traduce` |
| U6-1A-04 | 1 |  | Escribir con letras números consecutivos, pares consecutivos y un número con su doble o su triple | `traduce` |
| U6-1A-05 | 1 |  | Calcular el valor de una expresión en un contexto: una tarifa con una parte fija y otra que depende… | `traduce` |
| U6-1A-06 | 1 |  | Escribir como una expresión el perímetro de una figura descrita con palabras, y reducirla | — |
| U6-1B-01 | 1 |  | Vocabulario del lenguaje algebraico: algebraic expression, letter, unknown, variable, term | `leelo6` |
| U6-1B-02 | 1 | sí | Entender en inglés las frases que traducen operaciones: twice, three times, half of, three more than… | `traduce`, `leelo6` |
| U6-1B-03 | 1 |  | Leer en voz alta una expresión en inglés y en español | `leelo6` |
| U6-1B-04 | 1 |  | Vocabulario de las partes de una expresión y de las operaciones con ellas: term, coefficient, consta… | `leelo6` |
| U6-1C-01 | 1 | sí | Saber que 3x significa 3 · x, que x es 1x y que -x es -1x, y escribir el coeficiente delante y sin p… | `terminos-semejantes` |
| U6-1C-02 | 1 |  | Reconocer los papeles de la letra: una incógnita (un número concreto que hay que hallar), un número… | — |
| U6-1C-03 | 1 |  | Escribir con palabras, en español y en inglés, lo que dice una expresión | `traduce`, `leelo6` |
| U6-1C-04 | 1 | sí | Reconocer en una expresión los términos, el coeficiente y la parte literal de cada uno y el término… | `terminos-semejantes` |
| U6-1C-05 | 1 | sí | Calcular el valor numérico de una expresión con un número natural, respetando la jerarquía | `valor-numerico` |
| U6-1C-06 | 1 | sí | Calcular el valor numérico con un número negativo, poniéndolo entre paréntesis al sustituir | `valor-numerico` |
| U6-1C-07 | 1 |  | Calcular el valor numérico con una fracción o un decimal sencillos | `valor-numerico` |
| U6-1C-08 | 1 |  | Calcular el valor numérico de una expresión con dos letras | — |
| U6-1C-09 | 1 |  | Calcular el valor numérico de una expresión con x² | — |
| U6-1C-10 | 1 |  | Calcular los términos de una sucesión dada por su término general | — |
| U6-1C-11 | 1 |  | Hallar el término general de una sucesión o de un patrón de figuras que crece siempre lo mismo | — |
| U6-1C-12 | 1 | sí | Reconocer términos semejantes: los que tienen la misma parte literal | `terminos-semejantes` |
| U6-1C-13 | 1 | sí | Sumar y restar términos semejantes con x | `terminos-semejantes` |
| U6-1C-14 | 1 | sí | Reducir una expresión con términos con x y términos sin x | `terminos-semejantes` |
| U6-1C-15 | 1 | sí | Saber qué no se puede reducir: 3x + 2 no es 5x, 3x + 2y no se reduce, x + x no es x², x · x no es 2x | `terminos-semejantes`, `errores6` |
| U6-1C-16 | 1 |  | Multiplicar y dividir un término con x por un número | — |
| U6-1C-17 | 1 |  | Reconocer expresiones equivalentes y comprobar una reducción sustituyendo un valor | — |
| U6-2A-01 | 2 | sí | Traducir un enunciado a una ecuación | `problemas-ecuaciones` |
| U6-2A-02 | 2 | sí | Resolver un problema de «pienso un número» de dos pasos y comprobar la solución en el enunciado | `problemas-ecuaciones` |
| U6-2A-03 | 2 |  | Resolver un problema con contexto de una ecuación de dos pasos (ax + b = c) | `problemas-ecuaciones` |
| U6-2A-04 | 2 |  | Hallar con una ecuación qué término de una sucesión vale un número dado | — |
| U6-2B-01 | 2 |  | Vocabulario de la ecuación: equation, left-hand side, right-hand side, solution, solve, check, ident… | `leelo6` |
| U6-2B-02 | 2 |  | Escribir en palabras una ecuación, en inglés y en español | `leelo6` |
| U6-2B-03 | 2 |  | Entender en inglés las instrucciones de resolver: solve (for x), add, subtract, multiply or divide b… | `leelo6` |
| U6-2C-01 | 2 | sí | Reconocer una ecuación y sus elementos (miembros, términos, incógnita) y distinguirla de una expresi… | `es-solucion` |
| U6-2C-02 | 2 | sí | Comprobar si un número es solución de una ecuación sustituyéndolo en los dos miembros | `es-solucion` |
| U6-2C-03 | 2 |  | Distinguir una identidad (se cumple con cualquier número) de una ecuación (solo con alguno) | `es-solucion` |
| U6-2C-04 | 2 |  | Escribir una ecuación cuya solución sea un número dado | `es-solucion` |
| U6-2C-05 | 2 |  | Entender la balanza: si se hace lo mismo en los dos miembros, la ecuación sigue teniendo la misma so… | — |
| U6-2C-06 | 2 | sí | Transponer en igualdades con números (niveles 1 a 4 de su guión): lo que suma pasa restando, lo que… | `transposicion` |
| U6-2C-07 | 2 | sí | Resolver ecuaciones de una operación con suma o resta, también con solución negativa | `transposicion` |
| U6-2C-08 | 2 | sí | Resolver ecuaciones de una operación con producto o cociente, también con coeficiente negativo | `transposicion` |
| U6-2C-09 | 2 | sí | Resolver ecuaciones de dos operaciones (ax + b = c), también con la incógnita en el segundo miembro | `transposicion` |
| U6-2C-10 | 2 | sí | Resolver ecuaciones con la x restando o con coeficiente -1 | `transposicion` |
| U6-2C-11 | 2 | sí | Distinguir ax = b de bx = a y dar la solución como fracción irreducible | `transposicion` |
| U6-2C-12 | 2 |  | Reducir los términos semejantes de un miembro antes de resolver | `resuelve` |
| U6-2C-13 | 2 |  | Escribir la resolución paso a paso, una operación por línea, con la solución «x = …» y la comprobaci… | — |
| U6-3A-01 | 3 |  | Traducir y resolver un problema de números con la incógnita en los dos miembros | `problemas-ecuaciones` |
| U6-3A-02 | 3 |  | Traducir frases con paréntesis: el doble de la suma de un número y cinco frente al doble de un númer… | — |
| U6-3A-03 | 3 |  | Resolver un problema con la mitad, la tercera o la cuarta parte de un número | — |
| U6-3B-01 | 3 |  | Vocabulario de los paréntesis y los denominadores: brackets, expand the brackets, denominator, lowes… | `leelo6` |
| U6-3B-02 | 3 |  | Decir en inglés y en español cuántas soluciones tiene una ecuación | `leelo6` |
| U6-3C-01 | 3 | sí | Resolver ecuaciones con la x en los dos miembros, sin paréntesis ni denominadores | `resuelve` |
| U6-3C-02 | 3 | sí | Resolver ecuaciones con la x en los dos miembros y solución negativa o fraccionaria | `resuelve` |
| U6-3C-03 | 3 |  | Reconocer una ecuación con solución x = 0 | `resuelve` |
| U6-3C-04 | 3 |  | Reconocer las ecuaciones sin solución (0x = 2) y con infinitas soluciones (0x = 0) | — |
| U6-3C-05 | 3 |  | Encontrar el error en una ecuación resuelta paso a paso | `resuelve`, `errores6` |
| U6-3C-06 | 3 | sí | Quitar un paréntesis con un número delante (propiedad distributiva), también negativo | `parentesis-algebra` |
| U6-3C-07 | 3 | sí | Quitar un paréntesis con un signo menos delante | `parentesis-algebra` |
| U6-3C-08 | 3 |  | Reducir una expresión con paréntesis respetando la jerarquía | `parentesis-algebra` |
| U6-3C-09 | 3 | sí | Resolver ecuaciones con un paréntesis | `parentesis-algebra` |
| U6-3C-10 | 3 |  | Resolver ecuaciones con paréntesis en los dos miembros y un signo menos delante | `parentesis-algebra` |
| U6-3C-11 | 3 | sí | Resolver ecuaciones con un denominador, multiplicando los dos miembros por él | `denominadores` |
| U6-3C-12 | 3 | sí | Resolver ecuaciones con varios denominadores, multiplicando todos los términos por el m.c.m. | `denominadores` |
| U6-3C-13 | 3 |  | Resolver ecuaciones con denominadores en los dos miembros y fracciones sin x | — |
| U6-3C-14 | 3 |  | Resolver ecuaciones con denominadores y numeradores con paréntesis | — |
| U6-3C-15 | 3 |  | Resolver ecuaciones con coeficientes decimales sencillos | — |
| U6-4A-01 | 4 | sí | Seguir las fases de un problema: decir qué es x, escribir los datos con x, plantear la ecuación, res… | `problemas-ecuaciones` |
| U6-4A-02 | 4 | sí | Resolver problemas de números y de números consecutivos | `problemas-ecuaciones` |
| U6-4A-03 | 4 | sí | Resolver problemas de repartos: uno tiene el doble, el triple o n más que otro, y entre todos hay un… | `problemas-ecuaciones` |
| U6-4A-04 | 4 |  | Resolver problemas de perímetros descritos con palabras | `problemas-ecuaciones` |
| U6-4A-05 | 4 | sí | Resolver problemas de edades (ahora, dentro de n años, hace n años) con una tabla | `problemas-ecuaciones` |
| U6-4A-06 | 4 |  | Resolver problemas de dos clases de cosas con un total de piezas y un total de valor: monedas, cabez… | — |
| U6-4A-07 | 4 |  | Resolver problemas de «¿cuántos tiene que darle uno a otro para que…?» | — |
| U6-4A-08 | 4 |  | Interpretar la solución de un problema: que tenga sentido en el contexto y que conteste a lo que se… | `problemas-ecuaciones` |
| U6-4A-09 | 4 |  | Resolver problemas de dinero con precios con céntimos | `problemas-ecuaciones` |
| U6-4B-01 | 4 |  | Entender el vocabulario de los problemas en inglés: altogether, each, share, consecutive, times as m… | `leelo6` |
| U6-4C-01 | 4 | sí | Elegir la ecuación que corresponde a un problema | `problemas-ecuaciones` |

### Lo que este reparto añade a las fichas

Las fichas 145-155 citan las destrezas por descripción; estas son las que la tabla les asigna sin
que la ficha las nombre del todo, y dónde encajan sin cambiar el número de ejercicios:

- `traduce`: **U6-1A-05** (el valor de una tarifa en contexto) en el ejercicio 4, «Situaciones»
  (además de escribir `5 + 2g`, «¿cuánto pagas con 3 gigas?»).
  **U6-1C-10** (sucesiones) queda sin práctica: la 145 no las tiene (acta del 10-11).
- `valor-numerico`: **U6-1C-09** (`x²`) sin práctica: la 146 no tiene x² (opcional según el acta).
- `terminos-semejantes`: **U6-1C-01** (3x es 3 · x, x es 1x, −x es −1x) en el ejercicio 2. **U6-1C-16** queda sin práctica.
- `es-solucion`: **U6-2C-01** (reconocer una ecuación y sus miembros) en el ejercicio 3.
- `resuelve`: **U6-3C-03** (la solución `x = 0`) como un caso más de los ejercicios 2 y 3.
- `leelo6`: **U6-3B-02** (decir cuántas soluciones tiene) solo si F0 admite los casos sin solución.

### Destrezas de la unidad 6 sin práctica

- **U6-1C-02** (los papeles de la letra), **U6-2C-13** (escribir el paso a paso) y **U6-3C-14**
  (numeradores con paréntesis): `tipo_test = no`, son del papel.
- **U6-2C-05** (la balanza): se explica en clase; en la app, el feedback de `transposicion` puede
  nombrarla («restamos 3 en los dos miembros»).
- **U6-1A-06** (el perímetro descrito con palabras, como expresión) y **U6-4A-06**, **U6-4A-07**
  (monedas, cabezas y patas; «cuántos tiene que darle»): la propuesta los deja para el papel. U6-1A-06
  cabría en `terminos-semejantes` 3 si Juan Luis lo quiere.
- **U6-1C-08** (dos letras en el valor numérico) y **U6-1C-17** (comprobar una reducción
  sustituyendo): `algebra.js` ya lo permite (`evaluar({ a, b })`); cabrían en `valor-numerico` 1 y en
  el feedback de `terminos-semejantes` 3, si la 146 y la 147 lo quieren y F0 los mantiene.
- **U6-1C-11** (el término general de un patrón, reto), **U6-2A-04** (qué término de una sucesión vale
  un número) y **U6-3C-04** (sin solución, infinitas): dependen de F0 (puntos c y f); si entran, como
  ejercicio de `es-solucion` o de `resuelve` (propuesta en la ENTREGA de esa tarea), no como práctica
  nueva.
- **U6-3A-02** (frases con paréntesis: el doble de la suma) es de la sesión 10, y `traduce` se publica
  en la semana 1: `FRASES` lo trae (`doble-de-la-suma`) para que `traduce` lo use solo si su tarea de
  publicación lo deja para la semana 3, o para `parentesis-algebra`.
- **U6-3C-15** (coeficientes decimales): sin práctica; cabría en `resuelve` 3 si F0 la mantiene.

## 8. Dónde está lo demás

- El reparto con el que se hacen: `reparto-practicas-u2/` (tareas 144-161; las reglas de la
  unidad 6 en cada ficha, lo entregado en `salidas/NN-<slug>/ENTREGA.md`). El reparto de la
  unidad en el material del curso (`6. Algebra/reparto-unidad6/`) no toca la app.
- La revisión y publicación de cada semana, con la **propuesta de la tarea de la app** de esa
  semana: tareas 156-159; la 160 las monta en el panel con Juan Luis.
- El inventario de la unidad (solo lectura, fuera del repositorio):
  `<iCloud>/mat/1º ESO/apuntes-1eso-bilingue/6. Algebra/inventario-unidad6.tsv`, con el acta
  de su revisión (`inventario-unidad6-revision.md`, decisiones del 9/10-11: las letras, x², las
  sucesiones, el método, los paréntesis, los denominadores, la notación y las cotas) y la
  secuenciación por sesiones (`secuenciación-unidad6.pdf`) en la misma carpeta.
- Tests: `tests/practicas-algebra.test.js` (la base de la unidad), `tests/practicas-<slug>.test.js`
  (uno por práctica) y `tests/practicas-registro.test.js` (§7 contra `DESTREZAS`).
