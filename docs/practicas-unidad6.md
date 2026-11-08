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

Por escribir (tareas 156-159).

## 2. Cómo lee el profesor los resultados

Por escribir (tareas 156-159).

## 3. La base común de la unidad 6

Por escribir (tareas 156-159). Mientras, la cabecera de `practicas/_comun/algebra.js` y la ENTREGA de
la tarea 144 (`reparto-practicas-u2/salidas/144-base-unidad6/ENTREGA.md`).

## 4. El contrato de una práctica

Por escribir (tareas 156-159): es el de la unidad 2.

## 5. Cómo se añade una práctica

Por escribir (tareas 156-159).

## 6. Las once prácticas

Por escribir (tareas 156-159).

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
| U6-1C-09 | 1 |  | Calcular el valor numérico de una expresión con x² | `valor-numerico` |
| U6-1C-10 | 1 |  | Calcular los términos de una sucesión dada por su término general | `traduce` |
| U6-1C-11 | 1 |  | Hallar el término general de una sucesión o de un patrón de figuras que crece siempre lo mismo | — |
| U6-1C-12 | 1 | sí | Reconocer términos semejantes: los que tienen la misma parte literal | `terminos-semejantes` |
| U6-1C-13 | 1 | sí | Sumar y restar términos semejantes con x | `terminos-semejantes` |
| U6-1C-14 | 1 | sí | Reducir una expresión con términos con x y términos sin x | `terminos-semejantes` |
| U6-1C-15 | 1 | sí | Saber qué no se puede reducir: 3x + 2 no es 5x, 3x + 2y no se reduce, x + x no es x², x · x no es 2x | `terminos-semejantes`, `errores6` |
| U6-1C-16 | 1 |  | Multiplicar y dividir un término con x por un número | `terminos-semejantes` |
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
| U6-3A-03 | 3 |  | Resolver un problema con la mitad, la tercera o la cuarta parte de un número | `problemas-ecuaciones` |
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
| U6-3C-13 | 3 |  | Resolver ecuaciones con denominadores en los dos miembros y fracciones sin x | `denominadores` |
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
  (además de escribir `5 + 2g`, «¿cuánto pagas con 3 gigas?»); **U6-1C-10** (los términos de `2n + 1`)
  solo si F0 admite las sucesiones, como dice la ficha.
- `valor-numerico`: **U6-1C-09** (`x²`) solo si F0 lo admite (punto d de la propuesta: sí, solo en el
  valor numérico).
- `terminos-semejantes`: **U6-1C-01** (3x es 3 · x, x es 1x, −x es −1x) en el ejercicio 2, y **U6-1C-16**
  (multiplicar un término por un número, `2x · 3 = 6x`) en el 4, que ya trae ese error.
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

Por escribir (tareas 156-159).
