# Entrega de la tarea 79 · Base de la unidad 3

Sesión `s-20261024T224223-4911ef6c`, 2026-10-25. Commit del código: **139b446**.
Para las sesiones de las tareas 80-96: léelo entero antes de escribir nada.

## Ficheros entregados

- `practicas/_comun/enteros.js` (nuevo): escritura, lectura, evaluador, paso a paso, paréntesis,
  errores típicos y `campoEntero`. La documentación de la API está en su cabecera.
- `practicas/_comun/recta-enteros.js` (nuevo): recta y termómetro en SVG (`crearRecta`) y su
  parte pura (`marcas`, `conNumero`, `geometria`, `marcaMasCercana`). API en su cabecera.
- `practicas/_comun/catalogo.js`: filas 33-44, `unidad: 3`, **`disponible: false`**.
- `practicas/<slug>/index.html` y `practica.js` de los doce slugs: **esqueletos**.
- `practicas/portada.js`: cinco bloques de la unidad 3 y una `DESCRIPCION` por práctica.
- `practicas/_comun/registro.js`: `DESTREZAS` de la unidad 3 (en el mismo objeto que las de la 2).
- `docs/practicas-unidad3.md` (nuevo): §7 entero; los demás apartados, «por escribir (tarea 96)».
- Tests: `tests/practicas-enteros.test.js` (nuevo, 20 tests) y los ajustes de
  `practicas-comun` (lista del catálogo, 51 ejercicios), `practicas-semana` (bloques de la U3)
  y `practicas-registro` (lee las dos tablas de destrezas).

## Traspaso de titularidad

**Desde que esta tarea está LISTA, cada carpeta `practicas/<slug>/` es de su tarea (80-91)**, que
la sustituye entera (empezando por `logica.js` y su test). El esqueleto declara los ejercicios
con los nombres de su ficha («Coloca el entero», «Salta en la recta»…): si los cambias, mira que
las tareas de la semana (93-96) los citen igual. Cada práctica pone su `disponible: true` en el
catálogo solo cuando la publique su tarea de la semana.

## Lo que tienes que saber de `enteros.js`

- **Escribe siempre con `fmt` / `fmtPar` / `html` / `aTexto`**: el menos que sale es U+2212.
  Para leer lo que teclea el alumno, `leerEntero` (acepta -, −, –, un + delante y espacios).
- **El árbol conserva lo escrito**: `(−3)` es `par(neg(3))`, `−3²` es `neg(pot(3, 2))`. Así
  `html` vuelve a pintar exactamente la expresión, y se puede resaltar la base de una potencia
  con `envolver: { 'arg.base': 'base' }` (en `−3²` la base es 3; en `(−3)²`, la ruta `base`).
- **Paso a paso** (87, 88): `pasosPosibles` da las operaciones que valen ya, con la regla de
  Juan Luis del 8-10 (lo independiente vale; en una cadena del mismo nivel, de izquierda a
  derecha salvo que adelantar la segunda no cambie el valor: esas llevan `cadena: true`, y
  `{ cadenas: false }` las quita, por ejemplo en `saltos` antes de la sesión 6, donde la
  alternativa podría escribir `−3 + (−4)`). `html(…, { marcarOperadores: true })` pone cada
  operación en `<span class="ent-op" data-ruta="…">`: la ruta del span es la `ruta` del paso.
  `aplicarPaso` deja los resultados negativos entre paréntesis cuando no van los primeros
  (`3 + (−8) · 2`); si quieres `3 − 8`, pásalo por `quitarParentesisDeNumeros`.
- **Quitar paréntesis** (84, 88): `quitarParentesisDeNumeros` (U3-2C-08) y
  `quitarParentesis(árbol, ruta)` (U3-3C-17/18; null si el paréntesis está en un producto).
  `terminos` / `deTerminos` dan y rehacen los términos con su signo (83 ej. 4).
- `bienEscrita(texto)` es false con dos signos seguidos sin paréntesis (84 ej. 4, 85 ej. 5).
- **Errores típicos**: `ERRORES_TIPICOS[id]` = `{ fn, entrada, nombre: { es, en }, ejemplo }`.
  Las funciones de números reciben, en sumas y restas, **los dos términos con su signo**
  (`−2 − 3` es `(−2, −3)`); `restarNegativo(a, b)` y `sumarNegativo(a, b)` reciben el negativo
  en `b` (`3 − (−2)` es `(3, −2)`). Todas devuelven **null** cuando el error no sirve de
  distractor ahí: `reglaSignosEnSuma(−2, 3)` y `basePorExponente(2, 2)` dan null.
  `distractores([[id, …args], …], correcta)` junta los que sirven, sin repetidos ni la buena,
  cada uno con su `error`, que es el que se pasa a `api.responder({ error })` (los ids valen
  para el registro de fallos). Los nombres sirven de opciones en «¿Qué error es?» (89), pero
  ojo: **dos errores pueden dar el mismo número** (`olvidaElSigno(3, −7)` y
  `signoDelPrimero(3, −7)` dan 4; `ignoraElParentesis('5 − (2 − 7)')` y `menosSoloAlPrimero`
  dan −4): la 89 tiene que comprobar que el error del ítem no lo explica otra opción.
- `campoEntero`: como `campoNumero`, con un botón «+/−» delante, porque **el teclado de cifras
  del móvil no tiene signo menos** (por eso `campoNumero` no vale para enteros). Decidí no tocar
  `piezas.js`.

## Lo que tienes que saber de `recta-enteros.js`

- `crearRecta(contenedor, { tipo: 'recta' | 'termometro', min, max, paso, numeros, puntos, nivel,
  unidad, alTocar })`; métodos `ponerPuntos`, `saltar` (promesa; arco animado y, en el
  termómetro, el líquido), `borrarSaltos`, `ponerNivel`, `marcar(valor, clase)`, `desmarcar`,
  `bloquear`. Clases de las marcas tocadas: `re-toque--elegida`, `--bien`, `--mal`, `--falta`
  (los cuatro estados de la app); de los puntos: `re-punto--bien`, `--mal`, `--hueco`.
- Los estilos se añaden solos (hoja `#estilos-recta-enteros`); se cambian en el `estilos.css`
  de la práctica.
- La letra de los números es la más grande (14 a 9) con la que no se montan; con `numeros:
  'todas'` y 21 marcas van en **dos filas alternas**. Con 21 marcas, cada zona de toque mide
  unos 15 px en un móvil: **de −20 a 20 de 1 en 1 (41 marcas) es poco tocable**; mejor de 2 en
  2, o −10 a 10 (la ficha 80 pide «de −10 a 10 o de −20 a 20»: decídelo con esto delante).

## Cómo probarlo en 1 minuto

1. `node --test tests/practicas-enteros.test.js` (20 tests) y `npm test` (996/996 al cerrar).
2. `npm run servir` y http://localhost:8080/practicas/: la portada no enseña nada nuevo.
   http://localhost:8080/practicas/saltos/ carga el esqueleto (cinco ejercicios «en preparación»).
3. Para ver la recta y el termómetro, una página propia que importe `crearRecta` (yo la probé
   fuera del repositorio, a 359 px: recta de 21 marcas con saltos y toques, de −20 a 20, y
   termómetros de 30 y de 16 marcas).

## Qué destrezas cubre

Ninguna por sí misma: es la base. La tabla de qué práctica cubre qué destreza (81 filas) está en
el §7 de `docs/practicas-unidad3.md` y en `DESTREZAS`; un test exige que coincidan.

## Avisos para otras tareas

- **`ortografia` (id 45) es `unidad: 3` y `transversal`**: no está en ningún bloque de la
  portada de la U3. Cuando se publique, `bloquesPublicados` la pondrá en «Otras» al final de la
  unidad 3. Si se quiere en otro sitio, es cosa de quien la publique (no la toqué).
- U3-2C-17 figura en `signos-producto` (lo dice su ficha), pero solo como introducción.
