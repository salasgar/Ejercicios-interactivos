# Entrega de la tarea 98 · Base de la unidad 4

Sesión `s-20261026T210321-d2c2a286`, 2026-10-26 y 27. Commit del código: **42a5e05**.
Para las sesiones de las tareas 99-111: léelo entero antes de escribir nada.

## Ficheros entregados

- `practicas/_comun/fracciones.js` (nuevo, puro): la fracción, escritura, lectura, palabras,
  errores típicos y un evaluador de expresiones con paso a paso. La API está en su cabecera.
- `practicas/_comun/dibujo-fracciones.js` (nuevo): barras, pizzas, cuadrículas y la recta, en
  SVG, y su parte pura. API en su cabecera.
- `practicas/_comun/estilos.css`: un bloque `.frac` (la raya horizontal), `.frac--compacta`,
  `.frac-neg` y `.cuenta-frac` (lo pedía el punto 1 de la ficha: el estilo de `htmlFraccion` en
  el CSS común, no en `css/estilos.css`).
- `practicas/_comun/catalogo.js`: filas 47-56, `unidad: 4`, **`disponible: false`**; la U4 en
  `UNIDADES` desde el **2026-12-14**.
- `practicas/<slug>/index.html` y `practica.js` de los diez slugs: **esqueletos**.
- `practicas/portada.js`: cuatro bloques de la unidad 4 y una `DESCRIPCION` por práctica.
- `practicas/_comun/registro.js`: `DESTREZAS` de la unidad 4.
- `docs/practicas-unidad4.md` (nuevo): §7 entero (73 filas); los demás apartados, «por escribir (tarea 111)».
- Tests: `tests/practicas-fracciones.test.js` (nuevo, 15 tests) y los ajustes de
  `practicas-comun` (lista del catálogo, 39 ejercicios en la U4), `practicas-semana` (bloques de
  la U4 y `UNIDADES`), `practicas-registro` (lee las tres tablas). **Fuera de la lista de la
  ficha**, dos líneas de tests que fijaban tres unidades: `practicas-editor` (`tareasPorUnidad`)
  y `practicas-espacio` (`unidadesCon`: el ejemplo aplaza también la U4).

## Traspaso de titularidad

**Desde que esta tarea está LISTA, cada carpeta `practicas/<slug>/` es de su tarea (99-108)**, que
la sustituye entera (empezando por `logica.js` y su test). El esqueleto declara los ejercicios
con los nombres de su ficha («Lee la figura», «Sombrea la fracción»…; el 2 de `compara` se llama
«Frente a 1 y a un medio», sin barra). Si los cambias, mira que las tareas de la semana (109-111)
los citen igual. Cada práctica pone su `disponible: true` solo cuando la publique su tarea de la semana.

## Lo que tienes que saber de `fracciones.js`

| Pieza | Qué hace |
|---|---|
| `fraccion(n, d)`, `new Fraccion(n, d)`, `aFraccion(x)` | Inmutable; `den > 0`, el signo arriba; **no se simplifica sola** (6/8 se queda 6/8). Las operaciones aceptan Fraccion, entero o texto. |
| `sumar`, `restar` | Sobre el **m.c.m.** de los denominadores, sin simplificar (1/4 + 2/3 = 11/12; 5/9 − 2/9 = 3/9). |
| `multiplicar`, `dividir`, `potencia(n)` | Sin simplificar (2/5 · 3/4 = 6/20; 2/3 : 4/5 = 10/12). |
| `simplificar()`, `simplificarPor(k)`, `esIrreducible()` | La irreducible con su signo; un paso (null si k no divide a los dos). |
| `equivalentePor(k)`, `amplificaciones(hasta)` | Ampliar por k; las ampliadas por 2…hasta. |
| `inversa()`, `opuesta()`, `de(cantidad)` | `de` lanza `no-exacta` si no da un entero. |
| `equals` / `mismaForma` / `clave()` | Por valor / por forma / la irreducible como texto (para un `Set` de valores). |
| `esPropia`, `esImpropia`, `esEntera`, `esNatural`, `aEntero`, `esNegativa`, `esCero` | **6/6 es impropia** (26-10). |
| `comparar(a, b)`, `ordenar(lista)`, `comunDenominador(a, b, …)`, `productosCruzados` | Con enteros, **nunca con decimales**. `valor()` existe solo para ordenar por dentro. |
| `htmlFraccion(f, { compacta, conUno, parentesis })` | `<span class="frac"><span>3</span><span>5</span></span>`; negativa: `<span class="frac-neg">−…</span>`; un natural, sin raya. |
| `htmlRaya(arriba, abajo)` | La raya con un □ o un campo dentro (ejercicios de «el término que falta»). |
| `htmlCuenta([a, '+', b, '=', c])` | La cuenta en línea; una negativa tras + − · : ÷ va entre paréntesis, tras = < > no. |
| `aTexto(f)` | '−3/5' (U+2212): claves, consola, frases en inglés hablado. |
| `leerFraccion(texto)` | 3/5, 3 / 5, ⁄, un natural, −5/12, (−5)/12, 5/(−12) (con -, − o –); null con decimales, 0 abajo, «3 5», «--3/5». Devuelve lo escrito, sin simplificar. |
| `enPalabras(f, 'en' \| 'es')` | three fifths, a half, a quarter, one third, minus three fifths · tres quintos, un medio, siete doceavos, veintiún quintos. |
| `lecturasValidas(f, idioma)`, `esLecturaValida(f, texto, idioma)` | Todas las que valen (one half, one fourth, three fourths, a third, three over five, negative…; la mitad, dozavo, onzavo, partido por): **ninguna puede ser distractor**. La comparación ignora mayúsculas, tildes y guiones. |
| `ERRORES_TIPICOS[id]` = `{ fn, devuelve, ejemplo, nombre: { es, en } }` | 41 errores (lista abajo). `fn` devuelve **null** cuando no sirve ahí. El id es el `error` de `api.responder`. |
| `distractores([[id, …args], …], correcta, { porForma })` | Sin null, sin la correcta y **sin dos que valgan lo mismo**. `porForma: true` solo en «la fracción irreducible» de U4-1C-13 y U4-1C-14 (acta, punto i). |
| `hayEquivalentes(lista)`, `NO_ES_ERROR`, `terminoATermino(a, b)` | Para los tests de «ninguna opción equivale a otra» y para lo que no es un error (6/8 : 2/4 = 3/2). |
| `analizar`, `evaluar`, `html`, `aTextoExpresion` | Expresiones: «a/b» es una fracción; la división es «:» (o ÷); potencias con ^ o ². `evaluar` → irreducible. |
| `pasosPosibles`, `aplicarPaso`, `pasoCanonico`, `cadenaDePasos`, `valorLiteral` | Como en `enteros.js`, con la regla del 8-10 (lo independiente vale; cadena solo si no cambia el valor). Cada paso trae `valor` (irreducible) y `sinSimplificar` (1/3 · 3/4 = 3/12). |

Los errores típicos, con sus argumentos: `suma-arriba-y-abajo` (a, b) · `resta-arriba-y-abajo` (a, b) ·
`en-cruz-al-sumar` (a, b) · `suma-solo-cambia-denominador` (a, b, op) · `natural-al-numerador` (n, f, op) ·
`suma-multiplicando-denominadores` (a, b) · `signo-perdido` (resultado bueno) · `signo-del-primero` (a, b, op) ·
`simplifica-solo-numerador` / `simplifica-solo-denominador` (f, k) · `amplia-solo-numerador` / `amplia-solo-denominador` (f, k) ·
`suma-mismo-numero` (f, k) · `hueco-sumando` (f, conocido, 'den' | 'num') → el número del hueco ·
`simplifica-a-medias` (f, k?) · `signo-perdido-al-simplificar` (f) · `fraccion-de-al-reves` (f, n) ·
`se-queda-en-la-unitaria` (f, n) · `multiplica-por-el-denominador` (f, n) · `fraccion-del-dato` (f, dato) ·
`parte-entre-el-resto` (parte, total) · `del-resto-como-del-total` (a, b) · `gastado-como-queda` (…partes) ·
`compara-solo-numeradores` / `compara-solo-denominadores` / `ignora-el-signo` (a, b) → −1, 0 o 1 ·
`contar-marcas` (f) · `contar-desde-menos-uno` (f) · `producto-denominador-comun` (a, b) · `natural-por-ambos` (n, f) ·
`multiplica-en-cruz` (a, b) · `multiplica-sumando-denominadores` (a, b) · `suma-en-vez-de-multiplicar` (a, b) ·
`inversa-como-opuesta` (f) · `inversa-del-natural` (n) · `invierte-la-primera` / `no-invierte` / `invierte-las-dos` (a, b) ·
`eleva-solo-el-numerador` / `base-por-exponente` (f, n) · `izquierda-a-derecha` (expresión).

Ojo (como en la U3): **dos errores pueden dar el mismo valor** (`suma-solo-cambia-denominador` y
`suma-multiplicando-denominadores` dan 3/12 con 1/4 + 2/3). `distractores` se queda con el
primero; la 107 («¿qué error es?») tiene que comprobar que el error del ítem no lo explica otra opción.
`fraccion-de-al-reves` puede no dar un entero (3/5 de 40 → 200/3): la 103 lo usa en el feedback,
no como opción de un ítem de respuesta entera. `base-por-exponente` da una equivalente de la base
(4/6 para (2/3)²): no la pongas junto a la base entre las opciones.

## Lo que tienes que saber de `dibujo-fracciones.js`

- `crearFigura(contenedor, { tipo: 'barra' | 'pizza' | 'cuadricula', partes, filas, columnas,
  sombreadas, figuras, alTocar, nombre })` → `alternar(i)`, `sombrear(i, si)`, `sombreadas()`,
  `marcar(i, clase)`, `desmarcar(i)`, `bloquear()`. Las impropias van en varias figuras (7/4: dos
  barras; `figuras` por defecto, las que hagan falta). `alTocar(i)` da el índice global; la
  práctica decide (normalmente `fig.alternar(i)`).
- `crearRectaFracciones(contenedor, { min, max, den, numeros: 'enteros' | 'todas' | [..],
  puntos, alTocar, nombre })` → `ponerPuntos`, `marcar(f, clase)`, `desmarcar(f)`, `bloquear()`.
  `alTocar` recibe la marca como **k/den sin simplificar** (2/4, no 1/2): compárala con `equals`.
- Los cuatro estados: `fd-parte--bien | --mal | --falta` en las figuras; `fd-toque--elegida |
  --bien | --mal | --falta` en la recta; `fd-punto--bien | --mal | --hueco`. Estilos en una hoja
  propia que se añade sola (`#estilos-dibujo-fracciones`).
- Parte pura (con test): `geometriaFigura`, `parteEn(x, y, …)`, `figurasPara`, `indicesSombreados`,
  `marcasRecta`, `conNumeroRecta`, `geometriaRecta`, `marcaMasCercanaRecta`, `anchoEtiqueta`.
- Medidas a 375 px: una parte de una barra de 12 mide 28 unidades; la recta de 0 a 2 en doceavos
  (25 marcas) da zonas de toque de 13 unidades, unos 12 px en el móvil: es lo justo. Para la
  recta de la 102, mejor de 0 a 1 o de −1 a 1 con d ≤ 8 si hay que tocar.

## Qué práctica cubre qué destreza (ids definitivos, inventario aprobado el 26-10)

| Práctica | Destrezas |
|---|---|
| `que-fraccion` (99) | U4-1B-02, 1B-03, 1C-01, 1C-02, 1C-03, 1C-04, 1C-05 |
| `equivalentes` (100) | U4-1C-10, 1C-11, 1C-12, 1C-16 |
| `simplifica` (101) | U4-1C-13, 1C-14, 1C-15, 1C-22 |
| `compara` (102) | U4-1C-17, 1C-18, 1C-19, 1C-20, 1C-21, 1C-23, 1C-24 |
| `fraccion-de` (103) | U4-1A-01, **1A-02**, **1A-03**, 1C-04, 1C-08, 1C-09, 2A-02, **2A-03** |
| `suma-resta` (104) | U4-1C-16, 2A-01, 2A-04, 2C-01, 2C-02, 2C-03, **2C-04**, 2C-07, 3C-11 |
| `multiplica-divide` (105) | U4-2A-06, 2C-08, 2C-09, 2C-10, 2C-11, 2C-12, 3C-05, 3C-06, 3C-07, 3C-10 |
| `combinadas-fracciones` (106) | U4-3A-01, 3A-02, 3C-09, 3C-10, 3C-11 |
| `errores4` (107) | U4-3C-09, 3C-11, 3C-12 |
| `leelo4` (108) | U4-1B-01 a 1B-07, 2B-01, 2B-02, 2B-03, 3B-01, 3B-02, 3B-03 |

En negrita, las que **la ficha no nombraba y este reparto añade** (el §7 manda, ficha 98): la 103
pone en el ejercicio 4 ítems de «hallar el total» (si 3/5 son 15…; lo que queda vale 32 L…) y en
el 3 alguno con las dos partes y no el total; la 104 pone tres fracciones en parte de los ítems
del ejercicio 2 (o el 1). Detalle en el §7 de `docs/practicas-unidad4.md`, «Lo que este reparto
añade a las fichas».

## Propuesta pendiente (para Juan Luis o la coordinadora)

Dos destrezas **nucleares** de la semana 3 no tienen práctica: **U4-3A-03** (el problema «del
resto») y **U4-3A-04** (el total al final de un problema «del resto»). No caben en `fraccion-de`,
que se publica con la semana 2. Propuesta: un ejercicio más en `combinadas-fracciones` (pasa de 3
a 4 ejercicios; lo cambiaría la 106 en su fila del catálogo y en `practicas-comun.test.js`) o una
práctica nueva de problemas de la semana 3 (id 57). También sin práctica, no nucleares: U4-1A-04
(comparar las fracciones de dos grupos) y U4-3C-08 (elegir la operación). No lo he decidido.

## Cómo probarlo en 1 minuto

1. `node --test tests/practicas-fracciones.test.js` (15 tests, 3000 casos contra BigInt en la
   aritmética y 3000 expresiones contra un evaluador BigInt) y `npm test`.
2. `npm run servir` y http://localhost:8080/practicas/: la portada no enseña nada nuevo.
   http://localhost:8080/practicas/multiplica-divide/?c=XY4Z carga el esqueleto (cinco
   ejercicios «en preparación»).
3. Para ver los dibujos, una página propia que importe `crearFigura` y `crearRectaFracciones`
   (yo la probé fuera del repositorio, en Chrome headless a 375 px: barra de 8 que se toca,
   barra de 12, 7/4 en dos barras y en dos pizzas, pizza de 6 con una parte «falta», cuadrícula
   3 × 4, recta de 0 a 2 en doceavos y recta de −1 a 1 con todas las etiquetas y negativas).
