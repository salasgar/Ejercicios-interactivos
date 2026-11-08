# Prácticas interactivas de la unidad 5 (`practicas/`)

Empezado el 2026-11-05 por la tarea 122 del reparto PU2 (`reparto-practicas-u2/`), que deja
la base de la unidad 5: el catálogo, la portada, los esqueletos, las dos piezas comunes y la
tabla de destrezas (§7). Los apartados 1-6 y 8 los escribió la tarea 130 (2026-11-08), al
revisar la semana 1, y la tarea 131 completa lo de la semana 2, con el mismo espíritu que
[practicas-unidad4.md](practicas-unidad4.md). La base común, el panel, los
dos sistemas de códigos y los varios profesores son los de la unidad 2: están en
[practicas-unidad2.md](practicas-unidad2.md), y aquí solo se cuenta lo que cambia.

Son siete mini-aplicaciones para 1.º ESO bilingüe sobre la unidad 5, **Números decimales**
(ids 57-63 del catálogo, tareas 123-129 de PU2; la portada las enseña por semanas desde el
lunes 18-1-2027), con dos piezas comunes nuevas en `practicas/_comun/`:

- `decimales.js`: el decimal como **entero escalado** (`{ m, k }` = m / 10^k; nunca un `Number`
  con coma flotante), inmutable y sin normalizarse solo (2,50 se queda 2,50), sumar, restar,
  multiplicar, dividir con el cociente cortado y el resto de la división original, ×/÷ por
  potencias de 10, redondear y truncar, comparar (también con una fracción), intercalar,
  descomponer, pasar a fracción y de fracción, escribir con coma o punto según el idioma, leer
  lo que teclea el alumno con coma o punto en los dos idiomas, decirlo en palabras (*three
  point seven five*, *tres coma setenta y cinco*) con todas las lecturas que valen, el dinero, y
  **los errores típicos de la unidad** (columna `nota` del inventario), de donde salen los
  distractores. La API está en su cabecera.
- `recta-decimales.js`: la recta entre dos naturales o dos décimas, con marcas en las décimas,
  las centésimas o las milésimas (grandes y pequeñas), números en las grandes, puntos con
  etiqueta y marcas que se tocan, en SVG.

## 1. Qué ve el alumno

Lo mismo que en la unidad 2 (§1 de [practicas-unidad2.md](practicas-unidad2.md)): código,
10 puntos por ejercicio con 5 vidas, el idioma de cada ítem sorteado, el feedback con los
números del ítem y la tarea de la semana. Lo propio de la unidad 5:

1. **La portada enseña la unidad 5 desde el lunes 18-1** (`desde` de la unidad 5 en
   `UNIDADES`, `catalogo.js`). Antes, una práctica publicada solo se abre por su URL. Las
   prácticas salen por semanas (`BLOQUES` en `practicas/portada.js`): semana 1
   (`lee-decimales`, `compara-decimales`, `suma-resta-decimales`), semana 2
   (`multiplica-divide-decimales`, `fraccion-decimal`, `errores5`) y «Para toda la unidad»
   (`leelo5`).
2. **La coma y el punto van con el idioma del ítem**: en español, `3,75`; en inglés, `3.75`, y
   la lectura con *point* y las cifras de una en una (*three point seven five*; *nought* y
   *zero* valen los dos). Para contestar, el alumno puede **teclear coma o punto en los dos
   idiomas** (`deTexto` de `decimales.js`); nunca hay punto de millares, y la coma de millares
   inglesa solo sale donde se enseña a leerla (`leelo5`).
3. **Un mismo número escrito de dos maneras es la misma respuesta**: 0,5 = 0,50 = 1/2. Ninguna
   opción vale lo mismo que otra (los tests lo comprueban por valor, con enteros escalados), y
   2,50 € por 2,5 € no es un fallo. Cuando la respuesta pide un número fijo de cifras
   (*round to two decimal places*), el enunciado lo dice y la corrección lo exige, con su
   propio aviso.
4. **La recta se toca** (`recta-decimales.js`): en `lee-decimales` 4 se toca la marca de un
   decimal, entre dos naturales en décimas o entre dos décimas en centésimas, y se pulsa
   «Comprobar»; o se escribe el decimal que marca un punto.
5. **El dinero va siempre con dos decimales** y los contextos son los de la app según el acta
   de la unidad: fruta al peso y gasolina (la vuelta, la cena y las botellas son del papel);
   las medidas, en km-m, m-cm, kg-g y L-mL.
6. **Cada ejercicio empieza con su introducción**, en los dos idiomas, y el feedback de un
   fallo nombra el error con los números del ítem («has alineado a la derecha; alinea las
   comas: 2,50 + 1,25 = 3,75»).

## 2. Cómo lee el profesor los resultados

Igual que en las unidades 2, 3 y 4 (§2 de [practicas-unidad2.md](practicas-unidad2.md)): el
panel `practicas/profesor.html`, la nube del espacio de cada profesor y la vista «Fallos» con
«qué falla más». **Cada fallo lleva el id de un error típico** en el campo `error`
(`api.responder({ error })`), que el panel enseña tal cual:

- los de la tabla de la unidad, en `ERRORES_TIPICOS` de `practicas/_comun/decimales.js`, cada
  uno con su nombre `{ es, en }`, un ejemplo y su función (`compara-por-cifras`,
  `alinea-a-la-derecha`, `coma-mal-puesta`, `redondea-en-cadena`, `resto-sin-deshacer`…), y
  `APLICA_A`, que dice a qué cálculo se aplica cada uno;
- los propios de una práctica, en su `logica.js` (`ERRORES` de `lee-decimales`,
  `ERRORES_PROPIOS` de `suma-resta-decimales`, `ERRORES_LEELO` de `leelo5`…). Como en las
  unidades 3 y 4, el panel no traduce todavía estos ids a su nombre.

## 3. La base común de la unidad 5

Dos módulos nuevos en `practicas/_comun/` (tarea 122), puros salvo `crearRectaDecimales`:

| Fichero | Qué pone |
|---|---|
| `decimales.js` | `Decimal` inmutable (`{ m, k }` = m / 10^k, `m` entero seguro, también negativo; **no se normaliza solo**: `equals` compara por valor y `mismaForma` por escritura), `decimal`, `aDecimal`. Operar en columna: `sumar`, `restar`, `multiplicar`, `dividir(a, b, cifras)` (cociente **cortado** y **resto de la división original**: 6,384 : 0,49 → 13,02, resto 0,0042), `porPotenciaDe10`, `redondear`, `truncar`. Comparar y ordenar, exacto y también contra una `Fraccion` (`comparar`, `ordenar`, `entreDos`). Las cifras: `cifrasDecimales`, `descomponer`, `ORDENES`. Fracción: `aFraccionDecimal` (sin simplificar), `aFraccion` (irreducible, sin mixtos), `deFraccion`, `aTextoPeriodico` (0,333…, sin arco). Escritura y lectura: `aTexto` / `fmtDecimal` (coma o punto según el idioma, menos U+2212), `deTexto` / `leerDecimal` (coma o punto en los dos idiomas; null con dos separadores). En palabras: `enPalabras`, `lecturasValidas`, `esLecturaValida`, `dinero`, `dineroEnPalabras`, `lecturasDinero` (ninguna lectura válida puede ser distractor). **Errores típicos**: `ERRORES_TIPICOS` (18; cada función da el valor equivocado con los números del ítem, o null si ese error no cambia nada), `APLICA_A`, `distractores(candidatos, correcta)` (sin null, sin la buena y sin dos del mismo valor), `mismoValor`, `hayIguales`, `NO_ES_ERROR` |
| `recta-decimales.js` | `crearRectaDecimales(contenedor, opciones)`: la recta entre dos naturales o dos décimas, con marcas finas en las décimas, centésimas o milésimas y gruesas con número, puntos con etiqueta y marcas que se tocan (`alTocar` recibe un Decimal con las cifras de la marca: 3,40, no 3,4), con los cuatro estados. Como mucho 101 marcas; con más de 21, solo se tocan las gruesas. La geometría y «la marca más cercana a un toque» son puras |

Los distractores de la unidad 5 **salen siempre de un error típico con nombre**, calculado con
los números del ítem (regla 4 de la unidad en cada ficha), y el `error` que se registra al
fallar es el de ese distractor. Lo aprendido en la revisión de la semana 1 (tarea 130):

- **Los casos de examen se excluyen por huella, y la huella tiene que tener la forma de la
  tarea.** Las prácticas se escribieron antes que los exámenes semanales y dejaron sus huellas
  vacías y preparadas; al cotejarlas, las cuatro de la semana 1 sacaban casos del examen 1
  (los mismos decimales para leer, las mismas parejas para comparar, la misma botella con los
  mismos dos vasos, los mismos movimientos de la coma), y se reabrieron. Cada práctica tiene su
  clave: el valor del decimal, la pareja o el conjunto ordenados, el decimal con las cifras del
  redondeo (`2.718@0`), el cálculo sin orden de los sumandos (`s:`) o el movimiento de la coma
  (`m:`).
- **Los casos de la hoja escritos con palabras también son casos**: «siete milésimas» y
  «cuatro unidades y ocho centésimas» de la hoja 1 no estaban en las listas en claro porque no
  están entre `$…$`.

Tests: `tests/practicas-decimales.test.js` (la base de la unidad y la parte pura de la recta)
y uno por práctica.

## 4. El contrato de una práctica

El de siempre: [practicas-unidad2.md](practicas-unidad2.md) y `practicas/plantilla/practica.js`.

## 5. Cómo se añade una práctica

Como en la unidad 2 (§5 de [practicas-unidad2.md](practicas-unidad2.md)): copiar
`practicas/plantilla/`, fila en `catalogo.js` con `unidad: 5` y `disponible: false`, `logica.js`
y su test antes que la interfaz, la línea de `DESTREZAS` en `registro.js` y la fila de §7 en el
mismo commit (lo exige `tests/practicas-registro.test.js`), su `slug` en un bloque de `BLOQUES`
y, al publicarla, `disponible: true`. Lo propio de la unidad 5:

1. Los decimales, con `Decimal` de `decimales.js`: sumar, comparar y escribir con enteros
   escalados, **nunca con `Number` en coma flotante ni con `toFixed`** (0,1 + 0,2 ≠ 0,3); en
   pantalla, con `aTexto(d, idioma)`; lo que teclea el alumno, con `deTexto`. Los tests
   comprueban la aritmética contra `BigInt` o enteros propios, aparte del generador.
2. **Cada distractor, de un error típico** de `ERRORES_TIPICOS` (o uno propio con su nombre
   `{ es, en }`), calculado con los números del ítem, y el mismo id en `api.responder({ error })`.
   Ninguna opción del mismo valor que otra (`hayIguales`), y ninguna lectura válida como
   distractor (*nought* / *zero*, *point five*; *three point seventy-five* es la lectura de un
   precio, y no se enfrenta a *three point seven five*).
3. Las reglas de contenido de la unidad 5 (en cada ficha 122-133 y, por encima, el acta de la
   unidad del 3-11): cada ejercicio respeta la `sesion` de sus destrezas; ni porcentajes, ni
   letras, ni ecuaciones, ni números mixtos; negativos sí, nunca nucleares; cambios de unidad
   solo km-m, m-cm, kg-g, L-mL y euros-céntimos; periódicos solo al pasar de fracción a decimal,
   con puntos suspensivos; el **realismo** con una cota por contexto que el test comprueba (fruta
   0,80-6 € el kilo, gasolina 1,20-2,00 € el litro, una persona 1,20-2,10 m…).
4. **Los casos fijos no copian las hojas ni los exámenes** de la unidad: los de las hojas, en
   claro (también los que la hoja escribe con palabras); los de los exámenes semanales y del
   final, por huella FNV-1a con la clave de la tarea (§3), calculada fuera del repositorio.
5. Probarla en el navegador **pulsando cada botón con un clic**, a 375 px y en ancho, en los dos
   idiomas.

## 6. Las siete prácticas

`id` es el del catálogo; «Semana» es la de la unidad en que se dan sus destrezas, y la de su
bloque en la portada. Las cotas y los errores de cada una, con más detalle, en la `ENTREGA.md`
de su tarea (`reparto-practicas-u2/salidas/NN-<slug>/`). Las filas de la semana 2 las completa
la tarea 131.

| Semana | `slug` | id | Tarea | Ejercicios | Cotas |
|---|---|---|---|---|---|
| 1 | `lee-decimales` | 57 | 123 | Léelo (de decimal a lectura y al revés, en el idioma del ítem) · ¿Qué vale esta cifra? (y la descomposición) · La fracción decimal (sin simplificar) · En la recta (tocar o leer, en décimas o centésimas) | 1-3 cifras decimales sin 0 final; parte entera 0-99; recta entre 0 y 30 en décimas y entre 0,1 y 9 en centésimas |
| 1 | `compara-decimales` | 58 | 124 | ¿Cuál es mayor? (`<`, `=`, `>`; la trampa de las cifras, ceros, iguales, negativos) · Ordena (4-5 decimales) · Entre dos (escribir o elegir) · Redondea (a la unidad, la décima o la centésima; el 9 que arrastra) | parte entera 0-20, hasta 3 cifras decimales, negativos hasta −20 |
| 1 | `suma-resta-decimales` | 59 | 125 | Alinea la coma (dos o tres términos, también con naturales) · En el súper (fruta al peso y gasolina; total o la vuelta) · Medidas (listón, botella y vasos, estaturas, paquetes) · Mueve la coma (·/: por 10, 100 y 1000) | fruta 0,50-15,00 € cada importe y 40 € en total; repostaje 6-48 €; billete de 5, 10, 20 o 50 € que cubre el total; listón 1-3 m; botella 1-2 L y vasos 0,20-0,33 L; persona 1,20-2,10 m; paquete 0,1-30 kg |
| 2 | `multiplica-divide-decimales` | 60 | 126 | Seis ejercicios (coma del producto, entre un natural, entre un decimal, comprobar, problemas, combinadas): la tarea 131 | fruta 0,80-6,00 €/kg y 0,5-5 kg; gasolina 1,20-2,00 €/L y 5-70 L |
| 2 | `fraccion-decimal` | 61 | 127 | La tarea 131 | — |
| 2 | `errores5` | 62 | 128 | La tarea 131 | sin contextos; hasta cuatro cifras enteras |
| toda | `leelo5` | 63 | 129 | La palabra (32 términos) · Léelo (decimales, dinero, palabras a cifras y cuentas) · La consigna (de examen, en inglés) · Completa (la frase con un hueco) | dinero 0,05-59,99 €; libro 3-30 €; gasolina 1,20-2,00 €/L y 5-70 L; paquete 0,1-30 kg; recién nacido 2,5-4,5 kg |

**Publicadas** (a 2026-11-08): ninguna. La revisión de la semana 1 (tarea 130, 8-11) reabrió
las cuatro (`lee-decimales`, `compara-decimales`, `suma-resta-decimales` y `leelo5`;
`reparto-practicas-u2/hechos/reabiertas/`): las cuatro sacaban casos del examen 1 porque sus
huellas seguían vacías, y `lee-decimales`, `compara-decimales` y `leelo5`, algún caso de la hoja
1 que no tenían en su lista. **`leelo5` se publica con la semana 2**, no con la 1: lleva
vocabulario y cuentas de las sesiones 5 y 6 (*quotient*, *remainder*, *recurring*, *simplest
form*). El estado vivo es el campo `disponible` de `catalogo.js`.

## 7. Qué práctica cubre qué destreza de la unidad 5

Una fila por destreza de `inventario-unidad5.tsv` (54, aprobado por Juan Luis el 2026-11-03;
acta `inventario-unidad5-revision.md`), con las prácticas que la trabajan según la ficha de cada
tarea (diseño de la montadora de la U5 del 2-11, corregido con el acta el 3-11, con el reparto de
la tarea 122 donde la ficha no lo decía; ver abajo). «—» quiere decir que ninguna práctica la
trabaja de forma expresa. `practicas/_comun/registro.js` (`DESTREZAS`) tiene que coincidir con
esta tabla: lo comprueba `tests/practicas-registro.test.js`.

| Destreza | Sem. | Nuclear | Qué es | Prácticas |
|---|---|---|---|---|
| U5-1A-01 | 1 | sí | Resolver un problema de dinero con sumas y restas: el total de una compra y la vuelta | `suma-resta-decimales` |
| U5-1A-02 | 1 |  | Resolver un problema de medidas (longitud, peso, capacidad) con sumas y restas | `suma-resta-decimales` |
| U5-1A-03 | 1 |  | Comparar y ordenar decimales en contexto (tiempos de una carrera, alturas, precios) | — |
| U5-1A-04 | 1 |  | Cambiar de unidad de medida multiplicando o dividiendo por 10, 100 o 1000 (km-m, m-cm, kg-g, L-mL, euro… | — |
| U5-1B-01 | 1 | sí | Leer y escribir un decimal en inglés: el punto decimal y las cifras de después del punto una a una | `lee-decimales`, `leelo5` |
| U5-1B-02 | 1 |  | Leer y escribir un decimal en español con los nombres de los órdenes (décimas, centésimas, milésimas) | `lee-decimales`, `leelo5` |
| U5-1B-03 | 1 | sí | Escribir con cifras un decimal dado en palabras, también con ceros intermedios | `lee-decimales`, `leelo5` |
| U5-1B-04 | 1 |  | Vocabulario de los órdenes decimales: decimal point, tenths, hundredths, thousandths, decimal places | `lee-decimales`, `leelo5` |
| U5-1B-05 | 1 |  | Saber que en inglés el decimal lleva punto y los millares coma, al revés que en español | `leelo5` |
| U5-1B-06 | 1 |  | Leer una cantidad de dinero en inglés: euros y cents | `leelo5` |
| U5-1B-07 | 1 |  | Vocabulario de comparar y redondear: greater than, less than, round to one decimal place, to the neares… | `leelo5` |
| U5-1C-01 | 1 | sí | Reconocer la parte entera y la parte decimal y el valor de cada cifra hasta las milésimas | `lee-decimales` |
| U5-1C-02 | 1 |  | Expresar un decimal en décimas, centésimas o milésimas y conocer sus equivalencias | — |
| U5-1C-03 | 1 |  | Descomponer un decimal según el valor de sus cifras | `lee-decimales` |
| U5-1C-04 | 1 | sí | Pasar de una fracción decimal (denominador 10, 100, 1000) a decimal y al revés, sin simplificar | `lee-decimales` |
| U5-1C-05 | 1 | sí | Saber qué ceros cambian el valor de un decimal: los de la derecha de la parte decimal no lo cambian; lo… | `compara-decimales` |
| U5-1C-06 | 1 |  | Situar decimales en la recta (un tramo partido en 10 partes iguales) y leer el decimal que marca un pun… | `lee-decimales` |
| U5-1C-07 | 1 | sí | Comparar dos decimales cifra a cifra desde la izquierda (o igualando las cifras decimales con ceros) | `compara-decimales` |
| U5-1C-08 | 1 | sí | Ordenar de menor a mayor o de mayor a menor tres a cinco decimales | `compara-decimales` |
| U5-1C-09 | 1 |  | Intercalar un decimal entre otros dos | `compara-decimales` |
| U5-1C-10 | 1 | sí | Redondear un decimal a la unidad, a la décima y a la centésima | `compara-decimales` |
| U5-1C-11 | 1 |  | Redondear cuando la cifra que sube es un 9 (2,96 a la décima es 3,0) | `compara-decimales` |
| U5-1C-12 | 1 |  | Estimar el resultado de una suma o una resta redondeando, para comprobar si es razonable | — |
| U5-1C-13 | 1 | sí | Sumar y restar decimales colocando las comas en columna | `suma-resta-decimales` |
| U5-1C-14 | 1 | sí | Sumar y restar decimales y naturales, también con tres o más términos | `suma-resta-decimales` |
| U5-1C-15 | 1 | sí | Multiplicar un decimal por 10, 100 o 1000 moviendo la coma a la derecha | `suma-resta-decimales` |
| U5-1C-16 | 1 | sí | Dividir un decimal o un natural entre 10, 100 o 1000 moviendo la coma a la izquierda | `suma-resta-decimales` |
| U5-1C-17 | 1 |  | Comparar, ordenar y situar en la recta decimales negativos | — |
| U5-1C-18 | 1 |  | Sumar y restar con decimales negativos, también con resultado negativo | — |
| U5-2A-01 | 2 | sí | Resolver un problema de multiplicar con decimales: precio por cantidad | `multiplica-divide-decimales` |
| U5-2A-02 | 2 | sí | Resolver un problema de dividir con decimales: repartir a partes iguales o el precio de una unidad | `multiplica-divide-decimales` |
| U5-2A-03 | 2 | sí | Resolver un problema de varios pasos con dinero o medidas, escribiendo la operación y la respuesta en u… | `multiplica-divide-decimales` |
| U5-2A-04 | 2 |  | Elegir la operación: cuántas veces cabe una cantidad decimal en otra es dividir | — |
| U5-2B-01 | 2 | sí | Vocabulario de la división: dividend, divisor, quotient, remainder, division test, to two decimal place… | `leelo5` |
| U5-2B-02 | 2 |  | Vocabulario de fracción y decimal: convert, as a decimal, as a fraction in its simplest form, recurring… | `leelo5` |
| U5-2B-03 | 2 |  | Leer y escribir en palabras, en inglés y en español, una operación con decimales y su resultado | `leelo5` |
| U5-2C-01 | 2 |  | Multiplicar un decimal por un natural | `multiplica-divide-decimales` |
| U5-2C-02 | 2 | sí | Multiplicar dos decimales: el producto lleva tantas cifras decimales como los dos factores juntos | `multiplica-divide-decimales` |
| U5-2C-03 | 2 |  | Multiplicar y dividir por 0,1, 0,01 y 0,001 | `multiplica-divide-decimales` |
| U5-2C-04 | 2 | sí | Dividir un decimal entre un natural (división exacta) | `multiplica-divide-decimales` |
| U5-2C-05 | 2 | sí | Dividir dos naturales sacando decimales en el cociente hasta las centésimas | `multiplica-divide-decimales` |
| U5-2C-06 | 2 | sí | Dividir entre un decimal multiplicando dividendo y divisor por 10, 100 o 1000 | `multiplica-divide-decimales` |
| U5-2C-07 | 2 | sí | Hacer una división con dos decimales en el cociente, dar el resto y hacer la prueba | `multiplica-divide-decimales` |
| U5-2C-08 | 2 | sí | Pasar una fracción a decimal dividiendo el numerador entre el denominador | `fraccion-decimal` |
| U5-2C-09 | 2 |  | Saber de memoria los decimales de 1/2, 1/4, 3/4, 1/5, 1/10 y 1/100 | `fraccion-decimal` |
| U5-2C-10 | 2 | sí | Pasar un decimal exacto a fracción irreducible | `fraccion-decimal` |
| U5-2C-11 | 2 |  | Reconocer al dividir si una fracción da un decimal exacto o uno periódico | `fraccion-decimal` |
| U5-2C-12 | 2 |  | Comparar y ordenar fracciones y decimales juntos | `fraccion-decimal` |
| U5-2C-13 | 2 |  | Calcular el cuadrado y el cubo de un decimal | — |
| U5-2C-14 | 2 | sí | Calcular una combinada con decimales sin paréntesis, respetando la jerarquía | — |
| U5-2C-15 | 2 | sí | Calcular una combinada con decimales y un paréntesis, una operación por línea | — |
| U5-2C-16 | 2 |  | Multiplicar, dividir y operar en combinadas con decimales negativos, con la regla de los signos de la U… | — |
| U5-2C-17 | 2 | sí | Reconocer y nombrar el error de un procedimiento: la tabla de errores típicos de la unidad | `errores5`, `multiplica-divide-decimales` |
| U5-2C-18 | 2 |  | Saber lo que no es un error: ceros finales, dos decimales en dinero, nought o zero, un decimal o su fra… | `errores5` |

### Lo que este reparto añade a las fichas

Las fichas 123-129 citan las destrezas por su descripción; al poner los ids, la tarea 122 asignó
a una práctica estas destrezas, que su ficha no nombraba literalmente (la sesión de cada
práctica las cubre en el ejercicio que se dice):

- **`lee-decimales`**: U5-1B-04 (los órdenes en inglés: tenths, hundredths, thousandths) en los
  ítems en inglés del ejercicio 2, «¿Qué vale esta cifra?» (*the 7 is in the tenths place: it is
  worth 0.7*).
- **`compara-decimales`**: U5-1C-11 (redondear cuando sube un 9: 2,96 → 3,0) en parte de los
  ítems del ejercicio 4, «Redondea» (3,0 y 3 nunca juntas como opciones; la consigna dice las
  cifras); U5-1C-05, además de los ítems de `=` que la ficha ya nombra, con pares de cero
  intermedio (2,05 y 2,5) en el ejercicio 1.
- **`suma-resta-decimales`**: U5-1C-14 con tres términos (12 + 0,8 + 3,05) en parte de los ítems
  del ejercicio 1; U5-1C-16 con dividendo natural (7 : 1000 = 0,007) en el ejercicio 4.
- **`multiplica-divide-decimales`**: U5-2A-03 (problema de varios pasos; nuclear) en los ítems de
  dos pasos del ejercicio 5, «Problemas»; U5-2C-03 (por 0,1, 0,01 y 0,001) como factor del
  ejercicio 1 y como divisor del ejercicio 3; U5-2C-17 en el ejercicio 4, «¿Está bien?» (el ítem
  falso estrella es el resto sin deshacer).
- **`errores5`**: U5-2C-18 (lo que no es un error) en los ítems «todo está bien» del ejercicio 1,
  con pasos que parecen mal y no lo son (3,50 = 3,5; 2,50 € y 2,5 €; un decimal escrito como su
  fracción), con `NO_ES_ERROR` de la base.
- **`leelo5`**: U5-1B-02 (la lectura en español con los órdenes) en los ítems en español del
  ejercicio 2, «Léelo»; U5-1B-03 (de la lectura a las cifras, con ceros intermedios) en el
  sentido inverso del ejercicio 2; U5-1B-05 (punto y coma al revés que en español, con la coma de
  millares inglesa que el acta solo permite aquí y en 1B-01) en el ejercicio 4 o el 1; U5-2B-03
  (leer una operación con su resultado) en el ejercicio 2.
- **`fraccion-decimal`**: U5-2C-11 (reconocer un periódico al dividir, escrito con «…» y sin
  arco): la ficha 122 lo ponía entre las destrezas sin práctica, pero la fila 61 de su catálogo y
  la ficha 127 lo meten en el ejercicio 1; manda la ficha 127.

### Destrezas de la unidad 5 sin práctica

Once de las 54. Nueve, a propósito:

- **U5-1C-12** — estimar para comprobar una suma, una resta o dónde va la coma: destreza de hoja
  (acta, punto q); en `compara-decimales`, a lo sumo como pista del feedback.
- **No nucleares que la ficha 122 deja fuera** (se proponen en la ENTREGA de la 122 como ítems
  de la práctica que toque, sin cambiar `nEjercicios` sin el visto bueno de Juan Luis):
  **U5-1C-17** (negativos: comparar, ordenar y la recta → `compara-decimales`), **U5-1C-18**
  (negativos: sumar y restar → `suma-resta-decimales`), **U5-2C-16** (negativos: multiplicar,
  dividir, combinadas → `multiplica-divide-decimales`), **U5-1A-04** (cambios de unidad, solo
  km-m, m-cm, kg-g, L-mL y euros-céntimos → `suma-resta-decimales` 4) y **U5-2C-13** (cuadrado
  y cubo → `multiplica-divide-decimales` 1).
- **No nucleares que ninguna ficha recoge**: **U5-1A-03** (comparar y ordenar en contexto; cabría
  en `compara-decimales` 2), **U5-1C-02** (un decimal en décimas, centésimas o milésimas; cabría
  en `lee-decimales` 3) y **U5-2A-04** (cuántas veces cabe es dividir; su ejemplo es de botellas,
  contexto que el acta reserva al papel).

Y dos **nucleares** que ninguna ficha recoge, pendientes de que Juan Luis decida dónde van
(propuesta en la ENTREGA de la tarea 122):

- **U5-2C-14** y **U5-2C-15** — las combinadas con decimales, sin paréntesis y con un paréntesis
  (sesión 6). En la unidad 4 había práctica propia (`combinadas-fracciones`); en la 5, no.

## 8. Dónde está lo demás

- El reparto con el que se hacen: `reparto-practicas-u2/` (tareas 122-133; las reglas de la
  unidad 5 en cada ficha, lo entregado en `salidas/NN-<slug>/ENTREGA.md`). El reparto de la
  unidad en el material del curso (`5. Decimals/reparto-unidad5/`) no toca la app.
- La revisión y publicación de cada semana, con la **propuesta de la tarea de la app** de esa
  semana: tareas 130 y 131; la 132 las monta en el panel con Juan Luis.
- El inventario de la unidad (solo lectura, fuera del repositorio):
  `<iCloud>/mat/1º ESO/apuntes-1eso-bilingue/5. Decimals/inventario-unidad5.tsv`, con el acta
  de su revisión (`inventario-unidad5-revision.md`, decisiones del 3-11) y la secuenciación por
  sesiones (`secuenciación-unidad5.pdf`) en la misma carpeta.
- Tests: `tests/practicas-decimales.test.js` (la base de la unidad y la parte pura de la recta),
  `tests/practicas-<slug>.test.js` (uno por práctica) y `tests/practicas-registro.test.js` (§7
  contra `DESTREZAS`).
