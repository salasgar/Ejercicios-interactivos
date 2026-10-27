# Prácticas interactivas de la unidad 3 (`practicas/`)

Empezado el 2026-10-25 por la tarea 79 del reparto PU2 (`reparto-practicas-u2/`), que deja
la base de la unidad 3: el catálogo, la portada, los esqueletos y la tabla de destrezas
(§7). El resto lo escribió la tarea 96 (2026-10-25), al cerrar la última semana, con el
mismo espíritu que [practicas-unidad2.md](practicas-unidad2.md): qué hay, cómo se amplía,
cómo se leen los resultados y qué destreza del inventario practica cada una. La base común,
el panel, los dos sistemas de códigos y los varios profesores son los de la unidad 2: están
en ese documento, y aquí solo se cuenta lo que cambia.

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

Lo mismo que en la unidad 2 (§1 de [practicas-unidad2.md](practicas-unidad2.md)): código,
10 puntos por ejercicio con 5 vidas, el idioma de cada ítem sorteado, el feedback con los
números del ítem y la tarea de la semana. Lo propio de la unidad 3:

1. **La portada enseña la unidad 3 desde el lunes 16-11** (`desde` de la unidad 3 en
   `UNIDADES`, `catalogo.js`). Antes, una práctica publicada solo se abre por su URL. Las
   prácticas salen por semanas (`BLOQUES` en `practicas/portada.js`): semana 1 (`termometro`,
   `opuestos`, `situaciones`, `saltos`), semana 2 (`dos-signos`, `signos-producto`), semana 3
   (`potencias-enteros`, `jerarquia-enteros`, `parentesis-enteros`), semana 4 (`variacion`,
   `errores3`) y «Para toda la unidad · Vocabulario» (`leelo3`). La práctica de ortografía
   española (`ortografia`, id 45, unidad 3) sale en un bloque «Otras».
2. **Los negativos se escriben con el menos de verdad** (−, U+2212). Para contestar, el alumno
   escribe en un campo de enteros con un botón **+/−** al lado (`campoEntero`); puede teclear
   también `-` o `–`. Un `+5` se lee como 5.
3. **La recta y el termómetro** se dibujan en SVG, se tocan y animan los saltos
   (`recta-enteros.js`). Se usan en `termometro`, `opuestos`, `situaciones`, `saltos` y `variacion`.
4. **Las operaciones se tocan**: en `jerarquia-enteros` el alumno toca el signo de la operación
   que va primero (vale cualquiera de las que pueden ir primero sin cambiar el valor: regla de
   Juan Luis del 8-10); en `parentesis-enteros` toca el paréntesis o el corchete de más adentro;
   en `errores3`, la línea del cálculo donde está el error.
5. **Cada ejercicio empieza con «Cómo se hace»**, un ejemplo resuelto en los dos idiomas.
6. Algunos ítems tienen **dos pasos** (elegir el signo y después escribir el valor; tocar la
   operación y después su valor): si falla el primero, el ítem termina ahí con su explicación.

## 2. Cómo lee el profesor los resultados

Igual que en la unidad 2 (§2 de [practicas-unidad2.md](practicas-unidad2.md)): el panel
`practicas/profesor.html`, la nube del espacio de cada profesor y la vista «Fallos» con «qué
falla más». En la unidad 3, **cada fallo lleva el id de un error típico** en el campo `error`
(`api.responder({ error })`), que el panel enseña tal cual, en `código`:

- los de la tabla de la unidad, en `ERRORES_TIPICOS` de `practicas/_comun/enteros.js`, cada uno
  con su nombre `{ es, en }` y su función (`regla-signos-en-suma`, `restar-negativo`,
  `potencia-par-negativa`, `menos-en-la-base`, `derecha-a-izquierda`, `sin-jerarquia`…);
- los propios de una práctica, en su `logica.js` (`ERRORES_PROPIOS` en `termometro`,
  `situaciones` y `variacion`; constantes sueltas en las demás, como `dos-signos-seguidos` o
  `divide-entre-cero`). El panel **no** traduce todavía estos ids a su nombre: es una
  propuesta pendiente (terminadas de la 84 y la 85).

La agrupación de «qué falla más» es por práctica, ejercicio y error, así que en la unidad 3
dice, por ejemplo, cuántos alumnos han hecho `−2 − 3 = 5` en `saltos`.

## 3. La base común de la unidad 3

Dos módulos nuevos en `practicas/_comun/` (tarea 79), puros salvo `campoEntero` y `crearRecta`:

| Fichero | Qué pone |
|---|---|
| `enteros.js` | Escritura: `MENOS`, `fmt` (−5, nunca +5), `fmtPar` ((−5) cuando no va el primero), `leerEntero`. Expresiones: `analizar` (texto → árbol, con + − · : ^ ( ) [ ] y superíndices), `evaluar` (jerarquía de clase: −3² = −9, (−3)² = 9), `html` (con `marcarOperadores` para tocar operaciones y `envolver` para resaltar un trozo), `aTexto`. Paso a paso: `pasosPosibles` (las operaciones que se pueden hacer ya, con la regla del 8-10), `aplicarPaso`, `pasoCanonico`, `cadenaDePasos`, `terminos`, `quitarParentesis`, `quitarParentesisDeNumeros`, `bienEscrita`. **Errores típicos**: una función por error que da el valor equivocado con los números del ítem (o null si ese error no cambia nada) y la tabla `ERRORES_TIPICOS` (id → nombre y función); `distractores(candidatos, correcta)` saca de ahí opciones falsas sin repetir y distintas de la buena. `campoEntero`: el campo con el botón +/− |
| `recta-enteros.js` | `crearRecta(contenedor, opciones)`: recta horizontal o termómetro vertical, con `min`, `max`, `paso`, qué números se escriben (`numeros`), puntos, saltos animados y marcas que se tocan. `marcas`, `geometria`, `marcaMasCercana` son puras (se prueban sin navegador) |

Los distractores de la unidad 3 **salen siempre de un error típico con nombre**, calculado
con los números del ítem (regla 4 de la unidad en `reparto-practicas-u2/proyecto.md`), nunca
de un número al azar; y el `error` que se registra al fallar es el de ese distractor.

Tests: `tests/practicas-enteros.test.js` (la base de la unidad) y uno por práctica.

## 4. El contrato de una práctica

El mismo que en la unidad 2 (§4 de [practicas-unidad2.md](practicas-unidad2.md)).

## 5. Cómo se añade una práctica

Como en la unidad 2 (§5 de [practicas-unidad2.md](practicas-unidad2.md)): copiar
`practicas/plantilla/`, fila en `catalogo.js` con `unidad: 3` y `disponible: false`, `logica.js`
y su test antes que la interfaz, la línea de `DESTREZAS` en `registro.js` y la fila de §7 en el
mismo commit (lo exige `tests/practicas-registro.test.js`), su `slug` en un bloque de `BLOQUES`
y, al publicarla, `disponible: true`. Lo propio de la unidad 3:

1. Escribir los enteros con `fmt` / `fmtPar` y leerlos con `leerEntero` o `campoEntero`; las
   expresiones con `analizar` / `html`, nunca a mano con un guion.
2. **Cada distractor, de un error típico** de `ERRORES_TIPICOS` (o uno propio con su nombre
   `{ es, en }`), calculado con los números del ítem, y el mismo id en `api.responder({ error })`.
3. Las reglas de contenido de la unidad 3 (en `reparto-practicas-u2/proyecto.md`): la suma y la
   resta sin paréntesis al empezar (nunca `(+5) + (+3)`), nada de una sesión posterior a la de
   la destreza, las parejas válidas que nunca se enfrentan (*negative three* / *minus three*,
   agrupar / ir de izquierda a derecha, operar dentro / quitar el paréntesis…) y el
   **realismo** de los contextos con una cota por contexto que el test comprueba.
4. Probarla en el navegador **pulsando cada botón con un clic** (un «Comprobar» que solo
   respondía a la tecla Intro pasó los tests de `dos-signos`; lo vio la tarea 94).

## 6. Las doce prácticas

`id` es el del catálogo; «Semana» es la de la unidad en que se dan sus destrezas, y la de su
bloque en la portada. Las cotas y los errores de cada una, con más detalle, en la `ENTREGA.md`
de su tarea (`reparto-practicas-u2/salidas/NN-<slug>/`).

| Semana | `slug` | id | Tarea | Ejercicios | Cotas (sin contexto, de tamaño) |
|---|---|---|---|---|---|
| 1 | `termometro` | 33 | 80 | Coloca el entero (recta) · ¿Qué temperatura marca? (escalas de 1, 2 y 5) · Mayor o menor · Ordena · ¿Positivo, negativo o ninguno? | −40…40 °C en el termómetro; −15…15 al ordenar |
| 1 | `opuestos` | 34 | 81 | El opuesto · Distancia al cero · Opuesto y valor absoluto · ¿Quiénes están a esa distancia? | −20…20 |
| 1 | `situaciones` | 35 | 82 | ¿Qué entero es? · ¿Qué situación es? · Un paso (termómetro o recta, con la frase de respuesta) | contextos de temperatura, plantas, saldo, buceo, altitud y años, cada uno con su cota |
| 1-2 | `saltos` | 36 | 83 | Salta en la recta · ¿Qué signo tendrá? · De izquierda a derecha · Varios términos (fichas, agrupar) · Varios movimientos (problema) | buceo −40…−1 m, ascensor −3…12, saldo −50…300 €, temperatura −20…35 °C |
| 2 | `dos-signos` | 37 | 84 | Un solo signo · Sumar o restar un negativo · Quita los paréntesis y calcula · ¿Cuál está bien escrita? | resultado −30…30 |
| 2 | `signos-producto` | 38 | 85 | Multiplica (intro con el patrón de U3-2C-17) · Divide (con 0 : d y d : 0) · El factor que falta · ¿Suma o producto? · ¿Cuál está bien escrito? | factores 2-12, cocientes 1-12 |
| 3 | `potencias-enteros` | 39 | 86 | Cuenta los negativos · Potencia de base negativa · ¿Cuál es la base? ((−a)ⁿ, −aⁿ, −(−a)ⁿ) · Cuadrados y raíces (con «No existe») | \|producto\| ≤ 500, \|potencia\| ≤ 1000, cuadrados 1-144 |
| 3-4 | `jerarquia-enteros` | 40 | 87 | ¿Qué va primero? · Producto o potencia dentro de una suma · Cadenas de · y : (y el par `30 : (−5) · 2` / `30 : (−5 · 2)`) · Combinadas (sesión 13) | final ±100, pasos ±200 y nunca 0 |
| 3-4 | `parentesis-enteros` | 41 | 88 | Quita el paréntesis · Calcula (operando dentro o quitando) · ¿Al paréntesis o al número? · De dentro afuera (corchetes) · Coloca los paréntesis (ej. 3-5, sesión 13) | todo valor ±200 |
| 4 | `errores3` | 42 | 89 | ¿Dónde está el error? · ¿Qué error es? (distractores de otro grupo de errores) · ¿Error o no? (parejas válidas) | términos 1-9, todo ≤ 300 |
| 4 | `variacion` | 43 | 90 | ¿Cuánto ha cambiado? (termómetro o recta) · La diferencia · El dato que falta · Antes y después de Cristo (cruza el año 0: se quita 1, regla de la hoja 4) · Del enunciado a la cuenta | temperatura −20…40 °C, plantas −5…20, saldo −50…300 €, buceo −40…−1 m; años 3000 a. C.-2026 |
| toda | `leelo3` | 44 | 91 | Los enteros · Sumas, restas y productos · Potencias · Palabras y símbolos (cada ejercicio, de una semana) | temperaturas −30…45 °C; parejas de ciudades de un mismo día de invierno |

**Publicadas** (a 2026-10-27): todas salvo `variacion`, reabierta por la tarea 96 y otra vez
por la 115 (realismo de los ej. 1, 3 y 4; `reparto-practicas-u2/hechos/reabiertas/`).
`dos-signos` se publicó el 27-10 (tarea 115), tras su reabierta. El estado vivo es el campo
`disponible` de `catalogo.js`.

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

**U3-4C-05 (años a. C. y d. C.)**: decidido el 2026-10-25 (coordinadora, por delegación de Juan
Luis) con la regla de su hoja 4: al cruzar de a. C. a d. C. se resta y **se quita 1**, porque no
hubo año 0 (del 10 a. C. al 10 d. C., 10 − (−10) − 1 = 19 años). `variacion` 4 cruza la era desde
la reabierta de la tarea 90 (commit 182d37c), con el error `año-cero` para quien no quita el 1.

## 8. Dónde está lo demás

- El reparto con el que se hicieron: `reparto-practicas-u2/` (tareas 79-96; las reglas de la
  unidad 3 en `proyecto.md`, las fichas en `tareas/`, lo entregado en `salidas/NN-<slug>/ENTREGA.md`).
- La revisión y publicación de cada semana, con la **propuesta de la tarea de la app** de esa
  semana (★ y a elegir, 100 puntos, con la ortografía): `salidas/93-publicar-semana1/`,
  `94-publicar-semana2/`, `95-publicar-semana3/` y `96-publicar-semana4/`. Juan Luis las monta
  en el panel (editor de tareas).
- Las decisiones del 25-10 (año 0, ejercicio 1 de `jerarquia-enteros` sin combinadas, objetivos
  de `parentesis-enteros`): `reparto-practicas-u2/hechos/notas/s-20261025T003735-56c33ec7-decisiones-25-10.md`.
- El inventario de la unidad (solo lectura, fuera del repositorio):
  `<iCloud>/mat/1º ESO/apuntes-1eso-bilingue/3. Integers/inventario-unidad3.tsv`, y la
  secuenciación por sesiones en `secuenciación-unidad3.pdf` de la misma carpeta.
- Tests: `tests/practicas-enteros.test.js` (la base de la unidad), `tests/practicas-<slug>.test.js`
  (uno por práctica), `tests/practicas-registro.test.js` (§7 contra `DESTREZAS`) y
  `tests/enteros-items.test.js` (el generador `enteros` de la aplicación principal, tarea 92).
