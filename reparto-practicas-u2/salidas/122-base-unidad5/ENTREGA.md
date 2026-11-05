# Entrega de la tarea 122 · Base de la unidad 5

Sesión `s-20261105T221032-77dcff9f`, 2026-11-05 (encadenada tras la 134). Commit del código: **`7b5f2bb`**
(25 ficheros). Para las sesiones de las tareas 123-131: léelo entero antes de escribir nada.

## Ficheros entregados

- `practicas/_comun/decimales.js` (nuevo, puro): el decimal como entero escalado, escritura, lectura, palabras,
  dinero, fracción y errores típicos. La API completa está en su cabecera; resumen abajo.
- `practicas/_comun/recta-decimales.js` (nuevo): la recta en SVG y su parte pura.
- `practicas/_comun/catalogo.js`: filas 57-63, `unidad: 5`, **`disponible: false`**; la U5 en `UNIDADES` desde el
  **2027-01-18**.
- `practicas/<slug>/index.html` y `practica.js` de los siete slugs: **esqueletos** (cargan con «Probar sin código»
  y enseñan sus ejercicios con los nombres de cada ficha, «en preparación»).
- `practicas/portada.js`: tres bloques de la unidad 5 y una `DESCRIPCION` por práctica.
- `practicas/_comun/registro.js`: `DESTREZAS` de la unidad 5.
- `docs/practicas-unidad5.md` (nuevo): §7 entero (54 filas), con «Lo que este reparto añade a las fichas» y
  «Destrezas sin práctica»; los demás apartados, «por escribir (tarea 131)».
- Tests: `tests/practicas-decimales.test.js` (nuevo, 13 tests: 40 casos a mano, 3000 al azar contra BigInt, lectura y
  escritura, fracción, errores, recta) y los ajustes de `practicas-comun` (lista del catálogo, 28 ejercicios en la U5),
  `practicas-semana` (UNIDADES, bloques de la U5), `practicas-registro` (lee la tabla de la U5) y `practicas-editor`
  (`tareasPorUnidad`, cinco unidades). `practicas-espacio` no hizo falta tocarlo (su ejemplo sigue valiendo con la U5
  el 18-1).

## Traspaso de titularidad

**Desde que esta tarea está LISTA, cada carpeta `practicas/<slug>/` es de su tarea (123-129)**, que la sustituye
entera (empezando por `logica.js` y su test). Cada práctica pone su `disponible: true` solo cuando la publique su tarea
de la semana (130-131).

## Lo que tienes que saber de `decimales.js`

| Pieza | Qué hace |
|---|---|
| `decimal(m, k)`, `new Decimal(m, k)`, `aDecimal(x)` | `{ m, k }` = m / 10^k, `m` entero seguro (también negativo), `k` 0-15. Inmutable. **No se normaliza solo**: 2,50 se queda 2,50. Las operaciones aceptan Decimal, entero o texto (`'3,75'`). |
| `normalizar()`, `conCifras(k)`, `equals`, `mismaForma`, `clave()`, `esEntero`, `esNegativo`, `opuesto`, `abs` | `equals` por valor (0,5 = 0,50), `mismaForma` por escritura; `conCifras(2)` rellena con ceros (null si habría que quitar cifras). `valor()` (Number) solo para dibujar u ordenar por dentro. |
| `sumar`, `restar`, `multiplicar` | En columna: la suma lleva las cifras del que más tiene (0,5 + 0,5 = 1,0); el producto, las de los dos factores (1,2 · 0,3 = 0,36). |
| `dividir(a, b, cifras)` → `{ cociente, resto, exacta }` | Con `cifras`, el cociente **cortado** y el **resto de la división original** (6,384 : 0,49 → 13,02, resto 0,0042). Sin `cifras`: exacta si termina; si no, a las centésimas. |
| `porPotenciaDe10(d, n)` | ×10ⁿ; n < 0 divide (3 : 1000 = 0,003). |
| `redondear(d, c)`, `truncar(d, c)` | Deja justo `c` cifras (2,96 → 3,0); el 5 sube en valor absoluto. |
| `comparar(a, b)`, `ordenar(lista, { descendente })` | Exacto; también con una `Fraccion` de `fracciones.js` delante o detrás. |
| `entreDos(a, b)` | El decimal más corto estrictamente entre los dos (3,4 y 3,5 → 3,41). |
| `cifrasDecimales(d)`, `descomponer(d, { soloNoNulas })`, `ORDENES` | Las cifras de la escritura; cada cifra con su exponente y su valor (4,507 → 4, 0,5, 0, 0,007); los nombres de los órdenes en los dos idiomas. |
| `aFraccionDecimal(d)`, `aFraccion(d)`, `deFraccion(f)` | 3,75 = 375/100 sin simplificar; la irreducible (1,25 = 5/4, sin mixtos); el decimal exacto de una fracción o null si es periódico. |
| `aTexto(d, idioma, cifras?)` (= `fmtDecimal`) | '3,75' / '3.75'; menos U+2212; sin separador de millares. |
| `deTexto(texto)` (= `leerDecimal`) | Coma **o** punto en los dos idiomas, '.5', menos (-, −, –), espacios alrededor; null con dos separadores ('1.234,5'), separador al final, vacío o basura. Nunca `Number(texto)`. |
| `enPalabras(d, idioma)`, `lecturasValidas`, `esLecturaValida` | *three point seven five*, *nought point nought five*; *tres coma setenta y cinco*. Valen también *zero*, *point five* y *tres unidades y setenta y cinco centésimas*: **ninguna lectura válida puede ser distractor**. *three point seventy-five* no es lectura válida del decimal (es la del precio). |
| `dinero(d, idioma)`, `dineroEnPalabras`, `lecturasDinero` | '3,75 €' / '€3.75'; *three euros seventy-five*, *tres euros con setenta y cinco céntimos* y sus variantes. |
| `aTextoPeriodico(f, idioma, cifras = 3)` | '0,333…' (sin arco); si la fracción es exacta, el decimal sin «…». |
| `ERRORES_TIPICOS[id]` = `{ fn, devuelve, ejemplo, nombre: { es, en } }`, `APLICA_A[id]` | 18 errores; `fn` devuelve **null** cuando da lo mismo que la respuesta buena o no se aplica. `APLICA_A` dice a qué cálculo se aplica cada uno (suma, producto, division, redondeo, comparacion, potencia10, fraccion, lectura, dinero, signo): para «¿qué error es?» de `errores5`. |
| `distractores([[id, …args]], correcta)`, `mismoValor`, `hayIguales`, `NO_ES_ERROR` | Sin null, sin la correcta y **sin dos que valgan lo mismo** (0,5, 0,50 y 1/2 son la misma respuesta). Si son más de tres, barájalos antes (trampa del motor). |

Los errores, con sus argumentos: `compara-por-cifras` (a, b) → −1/0/1 · `alinea-a-la-derecha` (a, b, op) ·
`coma-mal-puesta` (a, b, desplazamiento?) · `por-diez-anadiendo-cero` (d, n) · `entre-diez-quitando-cero` (d, n) ·
`redondea-truncando` (d, c) · `redondea-en-cadena` (d, c) · `redondea-otro-orden` (d, c) · `olvida-coma-cociente`
(a, b, c?) · `resto-sin-deshacer` (a, b, c = 2) · `coma-solo-en-divisor` (a, b, c?) · `periodico-por-redondeo` (f, c) ·
`decimas-por-centesimas` (d) · `fraccion-al-reves` (f) · `numerador-como-decimas` (f) · `denominador-equivocado` (d) →
Fraccion · `centimos-por-euros` (céntimos, entero) · `signo-perdido` (resultado). Los que las fichas piden y no están
(«contar marcas en vez de huecos», «parar en el resto», «el cambio al revés», «sumar entera y decimal por separado»…)
los escribe cada práctica en su `logica.js`; si sirven a `errores5`, que la 128 los proponga para la base.

## Lo que tienes que saber de `recta-decimales.js`

- `crearRectaDecimales(contenedor, { desde, hasta, cifras, grandes, numeros, idioma, puntos, tocables, alTocar, nombre })`
  → `ponerPuntos`, `marcar(valor, clase)`, `desmarcar(valor)`, `bloquear()`. `cifras` son las marcas finas (1 décimas,
  2 centésimas, 3 milésimas); `grandes`, las gruesas con número (por defecto, `cifras − 1`); `numeros`: 'grandes',
  'extremos', 'ninguno' o una lista. `alTocar` recibe un **Decimal con `cifras` cifras** (3,40, no 3,4): compáralo con
  `equals`. Como mucho 101 marcas; con más de 21, solo se tocan las grandes (`tocables`).
- Estados: `rd-toque--elegida | --bien | --mal | --falta`; `rd-punto--bien | --mal | --hueco`. Estilos en una hoja propia
  que se añade sola (`#estilos-recta-decimales`).
- Parte pura (con test): `opcionesRecta`, `marcasDecimales`, `valorDeMarca(i)`, `indiceDe(valor)`, `textoDeMarca`,
  `geometriaDecimales` (`x(i)`, `coord(valor)`, `indiceEn(x)`, `separacion`, `fuente`), `marcaMasCercanaDecimales`,
  `puntoMedio`.
- Probada a 375 px: de 3 a 4 en centésimas (101 marcas, 11 números «3 3,1 … 4» con letra 14, 11 zonas de toque de unos
  30 px); de 0 a 1 en décimas en inglés; de −1 a 0 con un punto. Los toques llegan a su marca (las capas de dibujo
  llevan `pointer-events: none`) y `bloquear()` los corta.

## Qué práctica cubre qué destreza (ids definitivos, inventario aprobado el 3-11)

| Práctica | Destrezas |
|---|---|
| `lee-decimales` (123) | U5-1B-01, 1B-02, 1B-03, **1B-04**, 1C-01, 1C-03, 1C-04, 1C-06 |
| `compara-decimales` (124) | U5-1C-05, 1C-07, 1C-08, 1C-09, 1C-10, **1C-11** |
| `suma-resta-decimales` (125) | U5-1A-01, 1A-02, 1C-13, 1C-14, 1C-15, 1C-16 |
| `multiplica-divide-decimales` (126) | U5-2A-01, 2A-02, **2A-03**, 2C-01, 2C-02, **2C-03**, 2C-04, 2C-05, 2C-06, 2C-07, 2C-17 |
| `fraccion-decimal` (127) | U5-2C-08, 2C-09, 2C-10, 2C-11, 2C-12 |
| `errores5` (128) | U5-2C-17, **2C-18** |
| `leelo5` (129) | U5-1B-01 a 1B-07, 2B-01, 2B-02, 2B-03 |

En negrita, las que **la ficha no nombraba y este reparto añade**; en qué ejercicio va cada una, en el §7 de
`docs/practicas-unidad5.md` («Lo que este reparto añade a las fichas»). **Corrección a la ficha 122**: decía que los
periódicos (U5-2C-11) se quedaban sin práctica, pero su propio catálogo y la ficha 127 los meten en
`fraccion-decimal` 1: van ahí (manda el §7).

## Lo provisional y lo que tiene que decidir Juan Luis

1. **Dos nucleares sin práctica: las combinadas** (U5-2C-14 sin paréntesis y U5-2C-15 con un paréntesis, sesión 6).
   Ninguna ficha 123-129 las recoge; en la U4 había `combinadas-fracciones`. Opciones, de menos a más cambio: (a) que
   parte de los cálculos de `errores5` sean combinadas (cambia la ficha 128 y pide un error de jerarquía en la base);
   (b) un sexto ejercicio «Combinadas» en `multiplica-divide-decimales` (`nEjercicios` 5 → 6); (c) una octava práctica
   `combinadas-decimales` (id 64… que ya es de la ortografía: sería el 80 o el siguiente libre tras la U6). **Mi
   propuesta: (b)**, porque es la práctica de la semana 2 y la jerarquía ya la saben de las unidades 1, 3 y 4; se decide
   antes de que alguien coja la 126.
2. **Contextos de la vuelta, la cena y las botellas.** El acta los reserva para el papel («para la app, supermercado al
   peso y gasolina»), pero la ficha 125 (ej. 2) usa la vuelta y la 126 (ej. 5) la cena y las botellas. Afecta a
   U5-1A-01 (nuclear: «el total de una compra y la vuelta»). Si la reserva es exclusiva, la 125 y la 126 tienen que
   cambiar de contexto; si solo era una preferencia, se quedan. Lo tiene que decir él antes de la 125 y la 126.
3. **Estimar (U5-1C-12)**: la ficha 124 se contradice (el Objetivo dice «solo pista del feedback», su ejercicio 4 pone
   un ítem de estimar, y con un producto, que es de la semana 2). Manda el acta: sin ítem de estimar en la app; a lo
   sumo, pista del feedback. En el §7 va «—». La 124 debería leer esto.
4. **`leelo5` y la semana 2**: se publica con la semana 1 (plazo 15-12) pero su lista tiene vocabulario de la semana 2
   (*quotient*, *remainder*, *recurring decimal*, *simplest form*). O se publica en la semana 2, o esos ítems se
   reservan a la tarea de la semana 2. Lo decide la 130 al publicar; la 129 lo tiene que saber.
5. **No nucleares fuera, como pedía la ficha** (propuestas, sin cambiar `nEjercicios`): negativos U5-1C-17 →
   `compara-decimales` 1-2, U5-1C-18 → `suma-resta-decimales` 1 (su test hoy dice «nunca negativo»), U5-2C-16 →
   `multiplica-divide-decimales`; cambios de unidad U5-1A-04 → `suma-resta-decimales` 4; cuadrado y cubo U5-2C-13 →
   `multiplica-divide-decimales` 1. Y tres que ninguna ficha recoge: U5-1A-03 (comparar en contexto → `compara-decimales`
   2), U5-1C-02 (en décimas, centésimas o milésimas → `lee-decimales` 3), U5-2A-04 (cuántas veces cabe).
6. **Nombres repetidos**: «Léelo · Say it» es el ejercicio 1 de `lee-decimales` y el 2 de `leelo5` (y casi el mismo
   ejercicio); «¿Cuál es mayor?» es el 1 de `compara-decimales` y el 4 de `fraccion-decimal`. Sugerencia para 127 y 129:
   «¿Fracción o decimal?» y «Dinero y decimales», con `leelo5` 2 centrado en el dinero y en leer operaciones (U5-2B-03).
7. **Sesión de `fraccion-decimal`**: la ficha 127 dice sesión 6; según el acta, fracción → decimal es de la 5 y decimal →
   fracción de la 6. No cambia la publicación (toda la semana 2 sale junta).

## Cómo probarlo en 1 minuto

`node --test tests/practicas-decimales.test.js` (13 en verde). En el navegador, `npm run servir` y
http://localhost:8080/practicas/lee-decimales/ → «Probar sin código» → cuatro ejercicios «en preparación» (igual los
otros seis). La portada no enseña nada nuevo hasta el 18-1. Para ver la recta, en la consola de cualquiera de esas
páginas: `const R = await import('/practicas/_comun/recta-decimales.js'); R.crearRectaDecimales(document.querySelector('#app'), { desde: 3, hasta: 4, cifras: 2, alTocar: v => console.log(String(v)) })`.
Recarga forzada (cmd+shift+R) si el catálogo viejo está en caché: sin ella, el esqueleto dice «no está en catalogo.js».
