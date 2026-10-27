# Prácticas interactivas de la unidad 4 (`practicas/`)

Empezado el 2026-10-26 por la tarea 98 del reparto PU2 (`reparto-practicas-u2/`), que deja
la base de la unidad 4: el catálogo, la portada, los esqueletos, las dos piezas comunes y la
tabla de destrezas (§7). **El resto de este documento lo escribe la tarea 111**, al cerrar la
última semana, con el mismo espíritu que [practicas-unidad3.md](practicas-unidad3.md): qué
hay, cómo se amplía, cómo se leen los resultados y qué destreza del inventario practica cada
una. La base común, el panel, los dos sistemas de códigos y los varios profesores son los de
la unidad 2: están en [practicas-unidad2.md](practicas-unidad2.md).

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

Por escribir (tarea 111). Lo que ya está fijado: la portada enseña la unidad 4 desde el lunes
14-12 (`desde` de la unidad 4 en `UNIDADES`, `catalogo.js`), con cuatro bloques (`BLOQUES` en
`practicas/portada.js`): semana 1 (`que-fraccion`, `equivalentes`, `simplifica`, `compara`),
semana 2 (`fraccion-de`, `suma-resta`), semana 3 (`multiplica-divide`,
`combinadas-fracciones`, `errores4`) y «Para toda la unidad · Vocabulario» (`leelo4`).

## 2. Cómo lee el profesor los resultados

Por escribir (tarea 111).

## 3. La base común de la unidad 4

Por escribir (tarea 111). Mientras tanto, la referencia es la cabecera de
`practicas/_comun/fracciones.js` y de `practicas/_comun/dibujo-fracciones.js`, y la ENTREGA de
la tarea 98 (`reparto-practicas-u2/salidas/98-base-unidad4/ENTREGA.md`).

## 4. El contrato de una práctica

El mismo que en la unidad 2 (§4 de [practicas-unidad2.md](practicas-unidad2.md)).

## 5. Cómo se añade una práctica

Por escribir (tarea 111).

## 6. Las diez prácticas

Por escribir (tarea 111). Mientras tanto, las fichas `reparto-practicas-u2/tareas/tarea-99-…` a
`tarea-108-…`.

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

Por escribir (tarea 111). El reparto con el que se hacen: `reparto-practicas-u2/` (tareas
98-111; las reglas de la unidad 4 en `proyecto.md` y en cada ficha). El inventario de la unidad
(solo lectura, fuera del repositorio): `<iCloud>/mat/1º ESO/apuntes-1eso-bilingue/4. Fractions/inventario-unidad4.tsv`,
con el acta de su revisión y la secuenciación por sesiones en la misma carpeta. Tests:
`tests/practicas-fracciones.test.js` (la base de la unidad) y `tests/practicas-registro.test.js`
(§7 contra `DESTREZAS`).
