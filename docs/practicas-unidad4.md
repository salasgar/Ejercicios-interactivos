# Prácticas interactivas de la unidad 4 (`practicas/`)

Empezado el 2026-10-26 por la tarea 98 del reparto PU2 (`reparto-practicas-u2/`), que deja
la base de la unidad 4: el catálogo, la portada, los esqueletos, las dos piezas comunes y la
tabla de destrezas (§7). El resto lo escribió la tarea 111 (2026-10-28), al revisar la
última semana, con el mismo espíritu que [practicas-unidad3.md](practicas-unidad3.md): qué
hay, cómo se amplía, cómo se leen los resultados y qué destreza del inventario practica cada
una. La base común, el panel, los dos sistemas de códigos y los varios profesores son los de
la unidad 2: están en [practicas-unidad2.md](practicas-unidad2.md), y aquí solo se cuenta lo
que cambia.

Son diez mini-aplicaciones para 1.º ESO bilingüe sobre la unidad 4, **Fracciones**
(ids 47-56 del catálogo, tareas 99-108 de PU2), con dos piezas comunes nuevas en
`practicas/_comun/`:

- `fracciones.js`: la fracción inmutable (el signo en el numerador; no se simplifica sola),
  comparar con enteros y nunca con decimales, operar, el común denominador, cómo se pinta con
  raya horizontal (`htmlFraccion`), cómo se lee lo que teclea el alumno (`leerFraccion`), cómo
  se dice en los dos idiomas (`enPalabras`, `lecturasValidas`), **los errores típicos de la
  unidad** (columna `nota` del inventario), de donde salen los distractores, y un evaluador de
  expresiones con su paso a paso, hermano del de `enteros.js`.
- `dibujo-fracciones.js`: barras, pizzas y cuadrículas con partes que se tocan, y la recta con
  marcas en los múltiplos de 1/d (también con negativas), en SVG.

## 1. Qué ve el alumno

Lo mismo que en la unidad 2 (§1 de [practicas-unidad2.md](practicas-unidad2.md)): código,
10 puntos por ejercicio con 5 vidas, el idioma de cada ítem sorteado, el feedback con los
números del ítem y la tarea de la semana. Lo propio de la unidad 4:

1. **La portada enseña la unidad 4 desde el lunes 14-12** (`desde` de la unidad 4 en
   `UNIDADES`, `catalogo.js`). Antes, una práctica publicada solo se abre por su URL. Las
   prácticas salen por semanas (`BLOQUES` en `practicas/portada.js`): semana 1 (`que-fraccion`,
   `equivalentes`, `simplifica`, `compara`), semana 2 (`fraccion-de`, `suma-resta`), semana 3
   (`multiplica-divide`, `combinadas-fracciones`, `errores4`) y «Para toda la unidad ·
   Vocabulario» (`leelo4`). La semana 2 cruza la Navidad (lun 21-12 a jue 7-1).
2. **Las fracciones se ven con raya horizontal** (`htmlFraccion`), nunca con barra, y el menos
   de las negativas es el de verdad (−, U+2212), delante de la fracción. Para contestar, el
   alumno escribe **arriba y abajo** en un campo con raya y un botón **+/−** (`campo.js` de
   `suma-resta`, `multiplica-divide` y `errores4`); con el de abajo vacío vale un natural. Donde
   se teclea en una línea, `leerFraccion` acepta `3/5`, `3 / 5`, `−3/5`, `3/−5` y un natural.
3. **Dos fracciones equivalentes son la misma respuesta**: ninguna opción equivale a otra, y
   cuando la consigna pide la **fracción irreducible** lo dice en el enunciado del ítem, en los
   dos idiomas; entonces una equivalente sin simplificar cuenta como fallo con su propio aviso
   («el valor está bien, pero falta simplificar»).
4. **Los dibujos se tocan**: barras, pizzas y cuadrículas con partes iguales, y la recta con
   marcas en los múltiplos de 1/d, también con negativas (`dibujo-fracciones.js`). Se usan en
   `que-fraccion`, `compara` y `multiplica-divide` (la fracción de una fracción).
5. **Las operaciones se tocan**, como en la unidad 3: en `combinadas-fracciones` el signo de la
   operación que va primero (vale cualquiera de las que pueden ir primero sin cambiar el valor:
   regla de Juan Luis del 8-10); en `suma-resta`, `combinadas-fracciones` y `errores4`, la línea
   del cálculo donde está el error.
6. **Cada ejercicio empieza con «Cómo se hace»**, un ejemplo resuelto en los dos idiomas, y
   algunos ítems tienen varios pasos (el m.c.m., los numeradores y el resultado; la inversa y
   el producto que da 1).

## 2. Cómo lee el profesor los resultados

Igual que en las unidades 2 y 3 (§2 de [practicas-unidad2.md](practicas-unidad2.md)): el panel
`practicas/profesor.html`, la nube del espacio de cada profesor y la vista «Fallos» con «qué
falla más». **Cada fallo lleva el id de un error típico** en el campo `error`
(`api.responder({ error })`), que el panel enseña tal cual:

- los de la tabla de la unidad, en `ERRORES_TIPICOS` de `practicas/_comun/fracciones.js`, cada
  uno con su nombre `{ es, en }`, un ejemplo y su función (`suma-arriba-y-abajo`,
  `fraccion-de-al-reves`, `invierte-la-primera`, `eleva-solo-el-numerador`…);
- los propios de una práctica, en su `logica.js` (`sin-simplificar` en varias,
  `divide-en-vez-de-multiplicar` y `producto-no-es-uno` en `multiplica-divide`, los de
  `ERRORES_PROPIOS` de `fraccion-de`…). Como en la unidad 3, el panel no traduce todavía estos
  ids a su nombre.

## 3. La base común de la unidad 4

Dos módulos nuevos en `practicas/_comun/` (tarea 98), puros salvo `crearFigura` y
`crearRectaFracciones`:

| Fichero | Qué pone |
|---|---|
| `fracciones.js` | `Fraccion` inmutable (el signo en el numerador; **no se simplifica sola**: `equals` compara por valor y `mismaForma` por forma), `fraccion`, `deNatural`, `aFraccion`. Comparar y ordenar con enteros, nunca con decimales (`comparar`, `sonEquivalentes`, `productosCruzados`, `comunDenominador`, `ordenar`). Escritura: `aTexto`, `htmlRaya`, `htmlFraccion`, `htmlCuenta`; lectura: `leerFraccion`. En palabras: `enPalabras`, `lecturasValidas`, `esLecturaValida` (ordinales en inglés, partitivos en español; las parejas válidas nunca se enfrentan). **Errores típicos**: una función por error que da el valor equivocado con los números del ítem (o null si ese error no cambia nada) y la tabla `ERRORES_TIPICOS` (id → nombre, ejemplo y función); `distractores(candidatos, correcta)` saca de ahí opciones falsas sin repetir y no equivalentes a la buena; `NO_ES_ERROR` lista lo que no es un error (otro denominador común, simplificar antes o después, en cruz al dividir, término a término si es exacto, comparar por denominadores con numeradores iguales). Expresiones: `analizar`, `evaluar`, `html` (con `marcarOperadores`), `pasosPosibles`, `aplicarPaso`, `pasoCanonico`, `valorLiteral`, hermanos de los de `enteros.js` |
| `dibujo-fracciones.js` | `crearFigura(contenedor, opciones)`: barra, pizza o cuadrícula, con partes que se sombrean, se tocan y se marcan con los cuatro estados; `crearRectaFracciones`: recta de enteros a enteros con marcas en los múltiplos de 1/d (de 2 a 12), puntos y toques. La geometría y «la marca más cercana a un toque» son puras |

Los distractores de la unidad 4 **salen siempre de un error típico con nombre**, calculado
con los números del ítem (regla 4 de la unidad en `reparto-practicas-u2/proyecto.md`), y el
`error` que se registra al fallar es el de ese distractor. Cuidado aprendido en la revisión de
la semana 3 (tarea 111): **dos errores distintos pueden dar el mismo valor con ciertos números**
(fracción de una cantidad al revés e «invertir la primera»; sumar multiplicando denominadores y
sumar un natural al numerador cuando un denominador es 1; multiplicar en cruz y dividir en la
fracción de una fracción). Cuando eso pasa, el nombre o la explicación tienen que valer para
los dos, o el ítem se descarta; y un nombre ofrecido como falso nunca puede explicar el
resultado. Se comprueba en el test por fuerza bruta.

Tests: `tests/practicas-fracciones.test.js` (la base de la unidad) y uno por práctica.

## 4. El contrato de una práctica

El mismo que en la unidad 2 (§4 de [practicas-unidad2.md](practicas-unidad2.md)).

## 5. Cómo se añade una práctica

Como en la unidad 2 (§5 de [practicas-unidad2.md](practicas-unidad2.md)): copiar
`practicas/plantilla/`, fila en `catalogo.js` con `unidad: 4` y `disponible: false`, `logica.js`
y su test antes que la interfaz, la línea de `DESTREZAS` en `registro.js` y la fila de §7 en el
mismo commit (lo exige `tests/practicas-registro.test.js`), su `slug` en un bloque de `BLOQUES`
y, al publicarla, `disponible: true`. Lo propio de la unidad 4:

1. Las fracciones, con `Fraccion` y `htmlFraccion` / `htmlCuenta`; las expresiones, con
   `analizar` / `html`; nunca a mano con una barra o un guion. Comparar con `equals` (valor) o
   `mismaForma` (forma), nunca con decimales.
2. **Cada distractor, de un error típico** de `ERRORES_TIPICOS` (o uno propio con su nombre
   `{ es, en }`), calculado con los números del ítem, y el mismo id en `api.responder({ error })`.
   Ninguna opción equivalente a otra, y ningún nombre de error ofrecido como falso que también
   explique el resultado (§3).
3. Si se pide la fracción irreducible, **el enunciado de cada ítem lo dice**, en los dos idiomas
   (la introducción no basta: la tarea 111 reabrió `multiplica-divide` por eso).
4. Las reglas de contenido de la unidad 4 (en `reparto-practicas-u2/proyecto.md` y en cada
   ficha): ni decimales ni números mixtos (acta del 26-10); negativas desde la semana 1;
   productos y potencias de base positiva desde la sesión 7, cocientes desde la 9 y combinadas
   desde la 10; las parejas válidas que nunca se enfrentan (*three quarters* / *three fourths*,
   *simplify* / *reduce*, `÷` / `:`…); el **realismo** de los contextos con una cota por
   contexto que el test comprueba (pizza o tarta de 3 a 15 trozos, clase de 12 a 36…), también
   en los distractores; y los casos fijos, que no copien las hojas ni los exámenes de la unidad.
5. Probarla en el navegador **pulsando cada botón con un clic**, a 375 px y en ancho, en los dos
   idiomas.

## 6. Las diez prácticas

`id` es el del catálogo; «Semana» es la de la unidad en que se dan sus destrezas, y la de su
bloque en la portada. Las cotas y los errores de cada una, con más detalle, en la `ENTREGA.md`
de su tarea (`reparto-practicas-u2/salidas/NN-<slug>/`).

| Semana | `slug` | id | Tarea | Ejercicios | Cotas |
|---|---|---|---|---|---|
| 1 | `que-fraccion` | 47 | 99 | Lee la figura (barra, pizza, cuadrícula) · Sombrea la fracción · De la frase a la fracción · Léela | clase 12-36, tarta 3-15 trozos, equipo 11-25, caja 6-24 |
| 1 | `equivalentes` | 48 | 100 | El término que falta (hueco □) · ¿Son equivalentes? · Equipos (tarjetas en cajas) · Común denominador (m.c.m. y numeradores) | denominadores ≤ 60, factor 2-6 |
| 1 | `simplifica` | 49 | 101 | Paso a paso (dividir entre 2, 3, 5 o 7) · ¿Irreducible? · De una vez (entre el m.c.d.) | términos 1-100, m.c.d. 2-25 |
| 1 | `compara` | 50 | 102 | Mayor o menor · Frente a 1 y a un medio · Ordena · En la recta (de 0 a 1, de 0 a 2 y de −1 a 1) | denominadores 2-12; en la recta, 13 marcas como mucho |
| 2 | `fraccion-de` | 51 | 103 | Calcula (3/5 de 40) · Con contexto · ¿Qué fracción es? · El problema (lo que queda, el total) | depósito de coche 20-90 L, garrafa 5-50 L, botella hasta 3 L, clase 12-36, instituto 200-3000, pizza 3-15 trozos, ahorro hasta 2000 €, bici hasta 50 km, coche hasta 1000 km |
| 2 | `suma-resta` | 52 | 104 | Mismo denominador · Distinto denominador, paso a paso · Con naturales · ¿Qué queda? · Caza el error | denominadores 2-12, m.c.m. ≤ 60 |
| 3 | `multiplica-divide` | 53 | 105 | Multiplica (con «Simplifica antes») · La fracción de una fracción (cuadrícula) · La inversa · Divide (por la inversa o en cruz) · Potencias | términos 1-12; tableta y huerto ≤ 24 trozos, bandeja ≤ 20; potencias de base positiva hasta 9² y 5³ |
| 3 | `combinadas-fracciones` | 54 | 106 | ¿Cuál primero? · Un paso cada vez · Caza el error (orden o cálculo) | 2-3 operaciones, denominadores 2-12, pasos ≤ 72, final con denominador ≤ 36 |
| 3 | `errores4` | 55 | 107 | ¿Bien o mal? (y el nombre del error) · La línea mala · Arréglalo | denominadores 2-8, todo número ≤ 600 |
| toda | `leelo4` | 56 | 108 | Emparejar · La lectura · ¿Qué pide? · Dictado | dinero 20-600 €, pizza 4-12 trozos, clase 12-36, denominadores ≤ 12 |

**Publicadas** (a 2026-10-28): `que-fraccion`, `simplifica` y `leelo4` (tarea 109, commit
26306eb). Sin publicar, con su reabierta en `reparto-practicas-u2/hechos/reabiertas/`:
`equivalentes` y `compara` (tarea 109: feedback de un paso que no estaba mal; marcas enteras
nombradas como −6/6), `fraccion-de` y `suma-resta` (tarea 110: distractores y contextos fuera de
la cota del acta) y las tres de la semana 3 (tarea 111: el ej. 2 de `multiplica-divide` da por
mala una fracción sin simplificar que el enunciado no prohíbe; en `combinadas-fracciones` y
`errores4`, distractores y nombres de errores que dicen algo falso del ítem). El estado vivo es
el campo `disponible` de `catalogo.js`.

## 7. Qué práctica cubre qué destreza de la unidad 4

Una fila por destreza de `inventario-unidad4.tsv` (73, aprobado por Juan Luis el 2026-10-26;
acta `inventario-unidad4-revision.md`), con las prácticas que la trabajan según la ficha de cada
tarea (diseño de la coordinadora de la U4 del 26-10, con el reparto de la tarea 98 donde la
ficha no lo decía; ver abajo). «—» quiere decir que ninguna práctica la trabaja de forma
expresa. `practicas/_comun/registro.js` (`DESTREZAS`) tiene que coincidir con esta tabla: lo
comprueba `tests/practicas-registro.test.js`.

| Destreza | Sem. | Nuclear | Qué es | Prácticas |
|---|---|---|---|---|
| U4-1A-01 | 1 | sí | Resolver un problema de fracción de una cantidad, con la respuesta en una frase | `fraccion-de` |
| U4-1A-02 | 1 | sí | Hallar el total conociendo lo que vale una fracción, con un dibujo de barra: si 3/5 son 15, 1/5 son 5 y… | `fraccion-de` |
| U4-1A-03 | 1 | sí | Expresar con una fracción irreducible la parte de un grupo cuando el enunciado da las dos partes y no e… | `fraccion-de` |
| U4-1A-04 | 1 |  | Comparar las fracciones de dos grupos en un problema | — |
| U4-1B-01 | 1 | sí | Vocabulario básico de las fracciones en los dos idiomas: fraction, numerator, denominator, whole, equal… | `leelo4` |
| U4-1B-02 | 1 | sí | Leer y escribir una fracción en inglés con ordinales: a half, a third, a quarter, three fifths, five ei… | `leelo4`, `que-fraccion` |
| U4-1B-03 | 1 |  | Leer y escribir una fracción en español: medios, tercios, cuartos, quintos… décimos, y desde 11 con -av… | `leelo4`, `que-fraccion` |
| U4-1B-04 | 1 |  | Vocabulario de los tipos de fracción: proper fraction, improper fraction, equal to one, whole number | `leelo4` |
| U4-1B-05 | 1 |  | Vocabulario de la equivalencia: equivalent fractions, to simplify, lowest terms, common denominator | `leelo4` |
| U4-1B-06 | 1 |  | Vocabulario de la comparación: greater than, less than, the same as, in ascending order, from smallest… | `leelo4` |
| U4-1B-07 | 1 |  | Saber que «of» indica la fracción de una cantidad, y leer «3 out of 5» | `leelo4` |
| U4-1C-01 | 1 | sí | Reconocer una fracción como partes IGUALES de un todo: el denominador dice en cuántas partes se divide… | `que-fraccion` |
| U4-1C-02 | 1 | sí | Leer la fracción que representa un dibujo (barra, círculo, rectángulo cuadriculado, conjunto) | `que-fraccion` |
| U4-1C-03 | 1 |  | Representar una fracción dada en una barra, un círculo o un conjunto | `que-fraccion` |
| U4-1C-04 | 1 |  | Expresar con una fracción la parte de un grupo cuando se da el total | `fraccion-de`, `que-fraccion` |
| U4-1C-05 | 1 | sí | Distinguir las fracciones propias (menores que 1) de las impropias (mayores o iguales que 1) por sus té… | `que-fraccion` |
| U4-1C-06 | 1 |  | Escribir un natural como fracción y reconocer las fracciones que son un natural | — |
| U4-1C-07 | 1 |  | Entender la fracción como una división exacta del numerador entre el denominador | — |
| U4-1C-08 | 1 | sí | Calcular la fracción de una cantidad: dividir entre el denominador y multiplicar por el numerador | `fraccion-de` |
| U4-1C-09 | 1 |  | Calcular la mitad, la tercera parte, la cuarta parte… de una cantidad (fracción unitaria) | `fraccion-de` |
| U4-1C-10 | 1 |  | Obtener fracciones equivalentes multiplicando o dividiendo los dos términos por el mismo número | `equivalentes` |
| U4-1C-11 | 1 |  | Decidir si dos fracciones son equivalentes, simplificando las dos o con los productos cruzados | `equivalentes` |
| U4-1C-12 | 1 | sí | Completar una equivalencia con el término que falta (un hueco) | `equivalentes` |
| U4-1C-13 | 1 |  | Simplificar paso a paso dividiendo los dos términos entre un divisor común (con los criterios de la U2) | `simplifica` |
| U4-1C-14 | 1 | sí | Simplificar hasta la fracción irreducible de una vez, dividiendo entre el m.c.d. | `simplifica` |
| U4-1C-15 | 1 |  | Reconocer si una fracción es irreducible: el único divisor común de sus términos es el 1 | `simplifica` |
| U4-1C-16 | 1 | sí | Reducir dos o tres fracciones a común denominador con el m.c.m. de los denominadores | `equivalentes`, `suma-resta` |
| U4-1C-17 | 1 | sí | Comparar fracciones con el mismo denominador o con el mismo numerador | `compara` |
| U4-1C-18 | 1 |  | Comparar una fracción con 1 y con 1/2 | `compara` |
| U4-1C-19 | 1 | sí | Comparar dos fracciones cualesquiera reduciéndolas a común denominador | `compara` |
| U4-1C-20 | 1 | sí | Ordenar tres o cuatro fracciones de menor a mayor o de mayor a menor | `compara` |
| U4-1C-21 | 1 |  | Situar fracciones en la recta (también mayores que 1) y leer la fracción que marca un punto | `compara` |
| U4-1C-22 | 1 |  | Escribir una fracción negativa con el signo delante, saber que −5/12, (−5)/12 y 5/(−12) son el mismo nú… | `simplifica` |
| U4-1C-23 | 1 |  | Comparar y ordenar fracciones cuando alguna es negativa | `compara` |
| U4-1C-24 | 1 |  | Situar fracciones negativas en la recta y leer la fracción negativa que marca un punto | `compara` |
| U4-2A-01 | 2 | sí | Resolver un problema de partes de un todo: qué fracción suman dos partes y qué fracción queda | `suma-resta` |
| U4-2A-02 | 2 | sí | Resolver un problema de la parte que queda y su valor (ahorros, depósito, recorrido) | `fraccion-de` |
| U4-2A-03 | 2 | sí | Hallar el total conociendo el valor de la parte que queda | `fraccion-de` |
| U4-2A-04 | 2 |  | Traducir una situación a una suma o una resta de fracciones | `suma-resta` |
| U4-2A-05 | 2 |  | Escribir el cálculo paso a paso, con un igual por línea, y simplificar el resultado | — |
| U4-2A-06 | 2 |  | Resolver un problema de fracción de una fracción | `multiplica-divide` |
| U4-2B-01 | 2 | sí | Vocabulario de la suma y la resta de fracciones: to add, sum, to subtract, difference, LCM, the rest, w… | `leelo4` |
| U4-2B-02 | 2 |  | Leer en inglés una suma, una resta o un producto de fracciones con su resultado | `leelo4` |
| U4-2B-03 | 2 |  | Vocabulario del producto y de la potencia: to multiply, times, product, of, squared, cubed, to the powe… | `leelo4` |
| U4-2C-01 | 2 | sí | Sumar y restar fracciones con el mismo denominador | `suma-resta` |
| U4-2C-02 | 2 | sí | Sumar y restar dos fracciones con distinto denominador, con el m.c.m., y simplificar | `suma-resta` |
| U4-2C-03 | 2 | sí | Sumar y restar un natural y una fracción | `suma-resta` |
| U4-2C-04 | 2 | sí | Sumar y restar tres fracciones con denominadores grandes, con el m.c.m. por factorización | `suma-resta` |
| U4-2C-05 | 2 |  | Simplificar cada fracción antes de sumar para trabajar con un m.c.m. menor | — |
| U4-2C-06 | 2 |  | Comprobar si el resultado de una suma o una resta es razonable comparando con 1/2 y con 1 | — |
| U4-2C-07 | 2 | sí | Sumar y restar con fracciones negativas, también cuando el resultado es negativo | `suma-resta` |
| U4-2C-08 | 2 |  | Multiplicar un natural por una fracción | `multiplica-divide` |
| U4-2C-09 | 2 | sí | Multiplicar dos fracciones: numerador por numerador y denominador por denominador, y simplificar | `multiplica-divide` |
| U4-2C-10 | 2 |  | Simplificar antes de multiplicar, tachando factores comunes de un numerador y un denominador | `multiplica-divide` |
| U4-2C-11 | 2 | sí | Calcular la fracción de una fracción: «of» es multiplicar | `multiplica-divide` |
| U4-2C-12 | 2 |  | Calcular la potencia de una fracción de base positiva: se elevan el numerador y el denominador | `multiplica-divide` |
| U4-3A-01 | 3 | sí | Calcular una combinada sin paréntesis respetando la jerarquía | `combinadas-fracciones` |
| U4-3A-02 | 3 | sí | Calcular una combinada con un paréntesis | `combinadas-fracciones` |
| U4-3A-03 | 3 | sí | Resolver un problema «del resto»: la fracción del resto se calcula sobre lo que queda, no sobre el tota… | — |
| U4-3A-04 | 3 | sí | Hallar el total conociendo lo que queda al final de un problema «del resto» | — |
| U4-3A-06 | 3 |  | Escribir una combinada paso a paso, una operación por línea, copiando el resto | — |
| U4-3A-07 | 3 |  | Comprobar que el resultado de un problema es razonable (una parte no pasa del todo; lo que queda no es… | — |
| U4-3B-01 | 3 | sí | Vocabulario del cociente: to divide, divided by, quotient, reciprocal | `leelo4` |
| U4-3B-02 | 3 |  | Vocabulario de los problemas: savings, to spend, the rest, in total, to share | `leelo4` |
| U4-3B-03 | 3 |  | Leer y escribir en palabras, en inglés y en español, un cociente de fracciones | `leelo4` |
| U4-3C-05 | 3 | sí | Hallar la fracción inversa de una fracción y de un natural | `multiplica-divide` |
| U4-3C-06 | 3 | sí | Dividir dos fracciones por cualquiera de los dos métodos, que son equivalentes: multiplicar la primera… | `multiplica-divide` |
| U4-3C-07 | 3 | sí | Dividir un natural entre una fracción y una fracción entre un natural | `multiplica-divide` |
| U4-3C-08 | 3 |  | Elegir la operación en un problema: «la fracción de» es multiplicar; «cuántas veces cabe» es dividir | — |
| U4-3C-09 | 3 | sí | Distinguir las reglas de la suma y del producto en una tanda mezclada | `combinadas-fracciones`, `errores4` |
| U4-3C-10 | 3 |  | Multiplicar, dividir y operar en combinadas con fracciones negativas, con la regla de los signos de la… | `combinadas-fracciones`, `multiplica-divide` |
| U4-3C-11 | 3 | sí | Reconocer y nombrar el error en un procedimiento: la tabla de errores típicos de toda la unidad | `combinadas-fracciones`, `errores4`, `suma-resta` |
| U4-3C-12 | 3 |  | Saber lo que no es un error: otro denominador común, simplificar antes o después, «en cruz» al dividir,… | `errores4` |

### Lo que este reparto añade a las fichas

Las fichas 99-108 citan las destrezas por su descripción; al poner los ids, la tarea 98 asignó
a una práctica estas destrezas, que su ficha no nombraba (la sesión de cada práctica las cubre
en el ejercicio que se dice):

- **`fraccion-de`**: U4-1A-02 y U4-2A-03 (hallar el total conociendo lo que vale una fracción
  o lo que queda; nucleares) en el ejercicio 4, «El problema», en parte de sus ítems; U4-1A-03
  (la fracción irreducible de un grupo cuando se dan las dos partes y no el total) en el
  ejercicio 3; U4-1C-09 (la fracción unitaria) en el ejercicio 1.
- **`suma-resta`**: U4-2C-04 (tres fracciones con el m.c.m. por factorización; nuclear) en el
  ejercicio 2 o el 1, en parte de sus ítems; U4-1C-16 (común denominador) es el primer paso
  del ejercicio 2.
- **`que-fraccion`** y **`leelo4`**: U4-1B-03 (la lectura en español) en los ítems que salen en
  español de «Léela» y «La lectura».
- **`multiplica-divide`**: U4-2C-10 (simplificar antes de multiplicar) es el botón «simplifica
  antes» del ejercicio 1.
- **`combinadas-fracciones`** y **`errores4`**: U4-3C-09 (distinguir las reglas de la suma y del
  producto en una tanda mezclada).

### Destrezas de la unidad 4 sin práctica

Once de las 73. Siete son de papel o de estrategia, y a propósito:

- **U4-2A-05** y **U4-3A-06** — escribir el cálculo paso a paso, con un igual por línea.
- **U4-3A-07** — comprobar que el resultado de un problema es razonable y responder con una frase.
- **U4-2C-05** — simplificar antes de sumar (es una estrategia: no hacerlo no es un error).
- **U4-2C-06** — comprobar una suma comparando con 1/2 y con 1.
- **U4-1C-06** y **U4-1C-07** — el natural como fracción y la fracción como división exacta
  (salen dentro de otras: `suma-resta` 3, `multiplica-divide` 3).

Y cuatro que ninguna ficha recoge, **dos de ellas nucleares**, pendientes de que Juan Luis o la
coordinadora decidan dónde van (propuesta en la ENTREGA de la tarea 98):

- **U4-3A-03** y **U4-3A-04** (nucleares, sesión 10) — el problema «del resto» y el total al
  final de un problema «del resto». No caben en `fraccion-de`, que se publica en la semana 2.
- **U4-1A-04** — comparar las fracciones de dos grupos en un problema.
- **U4-3C-08** — elegir la operación en un problema («cuántas veces cabe» es dividir).

## 8. Dónde está lo demás

- El reparto con el que se hacen: `reparto-practicas-u2/` (tareas 98-114; las reglas de la
  unidad 4 en `proyecto.md` y en cada ficha, las fichas en `tareas/`, lo entregado en
  `salidas/NN-<slug>/ENTREGA.md`). El reparto de la unidad en el material del curso
  (`4. Fractions/reparto-unidad4/`) no toca la app: su `proyecto.md` lo manda aquí.
- La revisión y publicación de cada semana, con la **propuesta de la tarea de la app** de esa
  semana (★ y a elegir, 100 puntos, con la ortografía): `salidas/109-publicar-u4-semana1/`,
  `110-publicar-u4-semana2/` y `111-publicar-u4-semana3/`. Juan Luis las monta en el panel
  (editor de tareas); la tarea 29 del reparto de la unidad 4 las programa en Classroom.
- El inventario de la unidad (solo lectura, fuera del repositorio):
  `<iCloud>/mat/1º ESO/apuntes-1eso-bilingue/4. Fractions/inventario-unidad4.tsv`, con el acta
  de su revisión (`inventario-unidad4-revision.md`, decisiones del 26-10) y la secuenciación
  por sesiones (`secuenciación-unidad4.pdf`) en la misma carpeta.
- Los generadores de la aplicación principal al día con el inventario (tarea 112):
  `src/ejercicios/fracciones_equivalentes.js`, `suma_fracciones.js` y
  `producto_division_fracciones.js`.
- Tests: `tests/practicas-fracciones.test.js` (la base de la unidad), `tests/practicas-<slug>.test.js`
  (uno por práctica), `tests/practicas-registro.test.js` (§7 contra `DESTREZAS`) y
  `tests/fracciones-items.test.js` (los generadores de la aplicación principal).
