# Prácticas interactivas de la unidad 3 (`practicas/`)

Empezado el 2026-10-25 por la tarea 79 del reparto PU2 (`reparto-practicas-u2/`), que deja
la base de la unidad 3: el catálogo, la portada, los esqueletos y la tabla de destrezas
(§7). **El resto de este documento lo escribe la tarea 96**, al cerrar la última semana, con
el mismo espíritu que [practicas-unidad2.md](practicas-unidad2.md): qué hay, cómo se amplía,
cómo se leen los resultados y qué destreza del inventario practica cada una. La base común,
el panel, los dos sistemas de códigos y los varios profesores son los de la unidad 2: están
en ese documento.

Son doce mini-aplicaciones para 1.º ESO bilingüe sobre la unidad 3, **Números enteros**
(ids 33-44 del catálogo, tareas 80-91 de PU2), con dos piezas comunes nuevas en
`practicas/_comun/`:

- `enteros.js`: cómo se escribe un entero (el menos es siempre U+2212), `leerEntero`, un
  evaluador de expresiones con la jerarquía de verdad (`−3² = −9`, `(−3)² = 9`), los pasos
  que se pueden dar en cada momento, quitar paréntesis, y **los errores típicos de la unidad**
  (nota de U3-4C-08 del inventario), de donde salen los distractores.
- `recta-enteros.js`: la recta numérica y el termómetro, en SVG, con puntos, saltos animados
  y marcas que se pueden tocar.

## 1. Qué ve el alumno

Por escribir (tarea 96).

## 2. Cómo lee el profesor los resultados

Por escribir (tarea 96).

## 3. La base común de la unidad 3

Por escribir (tarea 96). Mientras tanto, la referencia es la cabecera de
`practicas/_comun/enteros.js` y de `practicas/_comun/recta-enteros.js`.

## 4. El contrato de una práctica

El mismo que en la unidad 2 (§4 de [practicas-unidad2.md](practicas-unidad2.md)).

## 5. Cómo se añade una práctica

Por escribir (tarea 96).

## 6. Las doce prácticas

Por escribir (tarea 96). Mientras tanto, las fichas `reparto-practicas-u2/tareas/tarea-80-…` a
`tarea-91-…`.

## 7. Qué práctica cubre qué destreza de la unidad 3

Una fila por destreza de `inventario-unidad3.tsv` (81), con las prácticas que la trabajan
según la ficha de cada tarea (diseño de la coordinadora del 2026-10-21). «—» quiere decir que
ninguna práctica la trabaja de forma expresa. `practicas/_comun/registro.js` (`DESTREZAS`)
tiene que coincidir con esta tabla: lo comprueba `tests/practicas-registro.test.js`.

| Destreza | Sem. | Nuclear | Qué es | Prácticas |
|---|---|---|---|---|
| U3-1A-01 | 1 | sí | Calcular una cadena corta de sumas y restas sin paréntesis, de izquierda a derecha | `saltos` |
| U3-1A-02 | 1 |  | Escribir una cadena de movimientos como una expresión sin paréntesis | `saltos` |
| U3-1B-01 | 1 | sí | Vocabulario básico de los enteros en los dos idiomas: integer, positive, negative, sign, number line, ab… | `leelo3` |
| U3-1B-02 | 1 |  | Leer y escribir un entero en inglés: negative three o minus three; three degrees below zero | `leelo3` |
| U3-1B-03 | 1 | sí | Vocabulario del orden: greater than, less than, opposite, absolute value, ascending / descending order,… | `leelo3` |
| U3-1B-04 | 1 |  | Vocabulario de los contextos: to owe, to deposit, to withdraw, to rise, to fall / to drop, sea level, BC… | `situaciones` |
| U3-1C-01 | 1 | sí | Expresar una situación con un entero, y un entero con una situación (temperatura, planta, saldo, nivel d… | `situaciones` |
| U3-1C-02 | 1 |  | Reconocer los enteros: los naturales son enteros, el 0 no es positivo ni negativo, y +5 es 5 | `termometro` |
| U3-1C-03 | 1 | sí | Representar enteros en la recta y leer qué entero marca un punto | `termometro` |
| U3-1C-04 | 1 |  | Leer una recta o un termómetro con escala de 2 en 2 o de 5 en 5 | `termometro` |
| U3-1C-05 | 1 | sí | Comparar dos enteros con < y > | `termometro` |
| U3-1C-06 | 1 | sí | Ordenar una lista de enteros de menor a mayor o de mayor a menor | `termometro` |
| U3-1C-07 | 1 | sí | Hallar el opuesto de un entero; el opuesto del opuesto | `opuestos` |
| U3-1C-08 | 1 | sí | Hallar el valor absoluto de un entero como distancia al cero | `opuestos` |
| U3-1C-09 | 1 |  | Distinguir opuesto y valor absoluto | `opuestos` |
| U3-1C-10 | 1 |  | Usar el valor absoluto: qué enteros tienen un valor absoluto dado; entre dos negativos, es mayor el de m… | `opuestos` |
| U3-1C-11 | 1 | sí | Calcular una resta de naturales con resultado negativo | `saltos` |
| U3-1C-12 | 1 | sí | Calcular −a + b: signos distintos, se restan y se pone el signo del de mayor valor absoluto | `saltos` |
| U3-1C-13 | 1 | sí | Calcular −a − b: mismo signo, se suman y se deja el signo | `saltos` |
| U3-1C-14 | 1 |  | Decidir el signo del resultado antes de calcular | `saltos` |
| U3-1C-15 | 1 |  | Saber que un número y su opuesto dan 0, y cambiar el orden llevando cada número su signo | `saltos` |
| U3-1C-16 | 1 | sí | Resolver un problema de un paso con temperatura, ascensor o saldo | `situaciones` |
| U3-2A-01 | 2 | sí | Calcular sumas y restas de cuatro a seis términos, sin paréntesis | `saltos` |
| U3-2A-04 | 2 |  | Escribir el cálculo paso a paso, con un igual por línea | — |
| U3-2B-01 | 2 | sí | Vocabulario de la suma y la resta: to add, to subtract, plus, minus, to take away, term, brackets, to re… | `leelo3` |
| U3-2B-02 | 2 |  | Leer en inglés una expresión con signos | `leelo3` |
| U3-2B-03 | 2 | sí | Vocabulario del producto y la división: to multiply, times, product, factor, to divide, divided by, quot… | `leelo3` |
| U3-2C-01 | 2 | sí | Calcular agrupando por un lado los positivos y por otro los negativos | `saltos` |
| U3-2C-02 | 2 |  | Anular los opuestos de una expresión | `saltos` |
| U3-2C-03 | 2 |  | Cambiar de orden los términos llevando cada uno su signo | `saltos` |
| U3-2C-04 | 2 | sí | Resolver un problema de varios movimientos seguidos (buceador, ascensor, ingresos y gastos) | `saltos` |
| U3-2C-05 | 2 | sí | Sumar un número negativo: es restar | `dos-signos` |
| U3-2C-06 | 2 | sí | Restar un número negativo: es sumar | `dos-signos` |
| U3-2C-07 | 2 | sí | Convertir dos signos seguidos en uno: +(+) y −(−) dan +; +(−) y −(+) dan − | `dos-signos` |
| U3-2C-08 | 2 | sí | Quitar los paréntesis de los números de una expresión y calcularla | `dos-signos` |
| U3-2C-09 | 2 |  | Explicar por qué restar es sumar el opuesto | — |
| U3-2C-10 | 2 |  | Escribir bien: dos signos no van seguidos sin paréntesis | `dos-signos` |
| U3-2C-15 | 2 | sí | Multiplicar dos enteros con la regla de los signos | `signos-producto` |
| U3-2C-16 | 2 |  | Escribir bien un producto: el negativo que no va el primero, entre paréntesis | `signos-producto` |
| U3-2C-17 | 2 |  | Explicar con un patrón por qué menos por menos es más | `signos-producto` |
| U3-2C-18 | 2 | sí | Dividir dos enteros (división exacta) con la regla de los signos | `signos-producto` |
| U3-2C-19 | 2 |  | Hallar el factor que falta en un producto de enteros | `signos-producto` |
| U3-2C-20 | 2 |  | Saber que 0 entre un entero distinto de 0 es 0, y que entre 0 no se divide | `signos-producto` |
| U3-2C-21 | 2 | sí | No aplicar la regla de los signos a una suma o una resta | `signos-producto`, `errores3` |
| U3-3A-01 | 3 | sí | Calcular una expresión con un producto o un cociente dentro de una suma o una resta | `jerarquia-enteros` |
| U3-3A-02 | 3 | sí | Calcular una expresión con una potencia dentro de una suma o una resta | `jerarquia-enteros` |
| U3-3A-03 | 3 |  | Calcular multiplicaciones y divisiones encadenadas, de izquierda a derecha | `jerarquia-enteros` |
| U3-3A-04 | 3 | sí | Calcular una expresión de sumas y restas con paréntesis que envuelven operaciones | `parentesis-enteros` |
| U3-3B-02 | 3 |  | Vocabulario y lectura de las potencias: power, base, exponent / index, squared, cubed, even / odd expone… | `leelo3` |
| U3-3C-02 | 3 | sí | Decidir el signo de un producto de varios factores contando los negativos | `potencias-enteros` |
| U3-3C-03 | 3 |  | Calcular un producto de varios factores; multiplicar por −1 y por 0 | `potencias-enteros` |
| U3-3C-10 | 3 | sí | Calcular una potencia de base negativa | `potencias-enteros` |
| U3-3C-11 | 3 | sí | Decidir el signo de una potencia de base negativa por el exponente: par, positivo; impar, negativo | `potencias-enteros` |
| U3-3C-12 | 3 | sí | Distinguir (−a)^n de −a^n, y decir cuál es la base en cada caso | `potencias-enteros` |
| U3-3C-13 | 3 |  | Hallar los dos enteros cuyo cuadrado es un número dado; la raíz cuadrada es solo el positivo | `potencias-enteros` |
| U3-3C-14 | 3 |  | Saber que la raíz cuadrada de un número negativo no existe | `potencias-enteros` |
| U3-3C-15 | 3 |  | Calcular una potencia con un signo menos delante, con y sin paréntesis | `potencias-enteros` |
| U3-3C-16 | 3 | sí | Operar primero dentro del paréntesis | `parentesis-enteros` |
| U3-3C-17 | 3 |  | Quitar un paréntesis precedido de +: los signos de dentro no cambian | `parentesis-enteros` |
| U3-3C-18 | 3 | sí | Quitar un paréntesis precedido de −: cambian todos los signos de dentro | `parentesis-enteros` |
| U3-3C-19 | 3 |  | Encontrar el error en un cálculo con paréntesis | `errores3` |
| U3-3C-20 | 3 | sí | Calcular y distinguir una cadena con un paréntesis que agrupa parte del cálculo: 30 : (−5) · 2 frente a… | `jerarquia-enteros` |
| U3-3C-21 | 3 |  | Resolver un problema con un producto o un cociente de enteros | `variacion` |
| U3-4A-01 | 4 | sí | Decidir qué operación va primero en una expresión combinada con enteros | `jerarquia-enteros` |
| U3-4A-02 | 4 | sí | Calcular una expresión combinada con potencias, productos y sumas | `jerarquia-enteros` |
| U3-4A-03 | 4 | sí | Calcular una expresión combinada con un paréntesis que contiene una potencia o un producto | `parentesis-enteros` |
| U3-4A-04 | 4 |  | Colocar paréntesis en una expresión para obtener un resultado dado | `parentesis-enteros` |
| U3-4A-05 | 4 |  | Encontrar el error en un cálculo combinado | `errores3` |
| U3-4A-06 | 4 |  | Distinguir la potencia que afecta a todo el paréntesis de la que afecta solo a un número de dentro | `parentesis-enteros` |
| U3-4A-07 | 4 |  | Calcular una expresión con paréntesis dentro de corchetes, de dentro afuera | `parentesis-enteros` |
| U3-4B-01 | 4 |  | Pasar una expresión a palabras y una frase a símbolos, en los dos idiomas | `leelo3` |
| U3-4B-02 | 4 |  | Vocabulario de los problemas: change, difference, deeper, balance, profit / loss, how much warmer / cold… | `variacion`, `leelo3` |
| U3-4C-01 | 4 |  | Traducir un enunciado a una expresión con enteros: los verbos que suman y los que restan | `variacion` |
| U3-4C-02 | 4 | sí | Calcular una variación: final menos inicial | `variacion` |
| U3-4C-03 | 4 |  | Calcular la diferencia entre dos temperaturas, dos plantas o dos alturas | `variacion` |
| U3-4C-04 | 4 |  | Hallar el dato que falta: si ha subido o ha bajado, y cuánto | `variacion` |
| U3-4C-05 | 4 |  | Resolver un problema con años antes y después de Cristo | `variacion` |
| U3-4C-07 | 4 | sí | Interpretar el signo del resultado en su contexto y dar la respuesta con una frase | `variacion` |
| U3-4C-08 | 4 | sí | Reconocer y nombrar el error en un procedimiento: la tabla de errores típicos de toda la unidad | `errores3` |
| U3-4C-09 | 4 |  | Saber lo que NO es un error: las parejas válidas de la unidad | `errores3` |
| U3-4C-10 | 4 |  | Prever el signo del resultado y comprobar que es razonable | `variacion` |

### Destrezas de la unidad 3 sin práctica

Dos de las 81, ninguna nuclear, y a propósito (son de papel):

- **U3-2A-04** — escribir el cálculo paso a paso, con un igual por línea.
- **U3-2C-09** — explicar por qué restar es sumar el opuesto.

U3-2C-17 (explicar con un patrón por qué menos por menos es más) figura en `signos-producto`
porque su ficha la cita, pero solo como **introducción** del ejercicio 1 (el patrón
`3 · (−2) = −6`, `2 · (−2) = −4`…): la explicación en sí sigue siendo de papel.

**U3-4C-05 (años a. C. y d. C.)**: mientras Juan Luis no decida qué cuenta vale al cruzar el
año 0 (no lo hubo), `variacion` solo pone ítems con los dos años a. C. o los dos d. C.

## 8. Dónde está lo demás

Por escribir (tarea 96).
