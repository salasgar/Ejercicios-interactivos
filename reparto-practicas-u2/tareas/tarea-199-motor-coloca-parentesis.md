# Tarea 199 · Base de «Coloca los paréntesis» para la U3, la U4 y la U5: el motor de árboles de `parentesis` sacado a `_comun` con aritmética exacta (naturales, enteros, fracciones, decimales), la pantalla común, y las tres prácticas nuevas en el catálogo (ids 80-82, sin publicar) con su esqueleto

Actualizado: 2026-11-14 (alta de la coordinadora s-20261114T212714-761c8123, por el encargo de Juan Luis del 14-11: «Los ejercicios de colocar paréntesis me gustan mucho. Espero que hagas otros similares en la U3, en la U4 y en la U5»; decisiones y porqués en `proyecto.md`, «Decisiones del 14-11: colocar paréntesis en la U3, la U4 y la U5»)
Precondición: **197 LISTA** (las dos tocan `tests/practicas-comun.test.js`; hoy está EN CURSO) · ningún reclamo vivo de otra tarea que toque `practicas/_comun/catalogo.js`, `practicas/portada.js`, `practicas/_comun/registro.js` o `docs/practicas-unidad{3,4,5}.md` (hoy: ninguna libre; 156-159, BLOQUEADAS, tocan el catálogo) · `git status --short` vacío en esos ficheros · Disparo: MANUAL · **Plazo: mié 18-11** (la 200 tiene que llegar al vie 27-11)
Duración esperada: 2 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: — (las 200-202 son MEDIO: van en sesiones aparte, las tres a la vez)
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/199-motor-coloca-parentesis/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/parentesis-motor.js` (nuevo), `practicas/_comun/parentesis-pantalla.js` (nuevo), `practicas/_comun/parentesis-textos.js` (nuevo), `tests/practicas-parentesis-motor.test.js` (nuevo), `practicas/coloca-enteros/*`, `practicas/coloca-fracciones/*` y `practicas/coloca-decimales/*` (nuevas: solo el esqueleto), `practicas/_comun/catalogo.js` (tres filas nuevas), `tests/practicas-comun.test.js` (solo la lista del catálogo), `practicas/portada.js` (tres slugs en sus bloques y sus tres descripciones), `practicas/_comun/registro.js` (`DESTREZAS` de las tres), `docs/practicas-unidad3.md`, `docs/practicas-unidad4.md` y `docs/practicas-unidad5.md` (fila de la práctica nueva y su columna en el §7)

La duración esperada no es informativa: de ella sale la caducidad del reclamo (2 ×), el plazo tras el cual otra
sesión puede relevarte si te cortas. **Este fichero es la fuente de la banda**: el tablón la copia de aquí cada vez que
se regenera. La tabla de bandas de `proyecto.md` la traduce al menú de hoy (ALTO = Opus 5.5, esfuerzo Alto; MEDIO =
Sonnet 5.5, esfuerzo Medio).

## Antes de empezar

Todas las rutas son relativas a la raíz del repositorio (`/Users/salasgar/Documents/git/Ejercicios-interactivos`).
`R=reparto-practicas-u2`. Las sesiones de este reparto trabajan en ese árbol, no en un worktree.

1. Lee `$R/proyecto.md` (al menos «Dónde está cada cosa», «Reglas de contenido comunes», «Reglas de contenido de la unidad 3»,
   «Tareas 171-194» y **«Decisiones del 14-11: colocar paréntesis en la U3, la U4 y la U5»**), `$R/_ESTADO.md`, `docs/no-lo-se.md`,
   y lista `$R/hechos/` (`ls $R/hechos/*/`): la carpeta manda sobre la tabla.
2. `date -u` para la hora de verdad. `git fetch origin && git status -sb`; si hay commits que traer, `git pull --rebase origin main`
   (nunca `--autostash`; si el árbol tiene cambios ajenos y el pull se niega, sigue y empuja al final desde un worktree limpio, como
   dice `proyecto.md`). **Comprueba la precondición en el disco**: `ls $R/hechos/terminadas/ | grep '^197--'` (la 197 cerrada),
   `git status --short practicas/_comun/catalogo.js practicas/_comun/registro.js practicas/portada.js tests/practicas-comun.test.js docs/practicas-unidad3.md docs/practicas-unidad4.md docs/practicas-unidad5.md practicas/parentesis/`
   **vacío**, y ningún reclamo vivo de una tarea cuya ficha cite `catalogo.js` (`grep -l 'catalogo.js' $R/tareas/*.md`, cruzado con
   `ls $R/hechos/reclamos/`). Si algo sale modificado, es trabajo de otra sesión: no lo toques y no reclames.
3. Abre tu reclamo generando el sid **en el mismo comando** (probado en este Mac):
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -v+300M +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 199\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/199--$sid.md; echo $sid
   ```
   (300 min = 2 × la duración esperada). Tu sid es el del nombre de ese fichero; no lo guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/ | grep '^199--'` — el comando, no la intención. Si hay otro reclamo vivo de la 199 con
   `abierto:` más antiguo (o igual y sid menor), añade a tu reclamo `CEDIDA a <sid del otro>` y para.
5. Si el reclamo que encuentras está caducado (RELEVABLE), relévalo con `releva a: <sid anterior>` **en tu propio reclamo**. Mira
   qué dejó hecho (`git log --oneline -8`, `git status -sb`, su carpeta de salida): lo comiteado con tests en verde se hereda y se
   dice en la terminada; lo demás se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** con el guion (`$R/hechos/notas/s-20261111T215225-39c1f4f5-regenerar-tablon.py`,
   ver su cabecera) y sigue con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/199--<sid>.md`) al terminar cada
paso grande. Si vas a tardar más de lo que te queda, añade antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`).
Tras cualquier pausa: `date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de `$R/hechos/reclamos/*.md`; si te han
relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

La práctica `parentesis` de la U1 (id 16; https://salasgar.github.io/Ejercicios-interactivos/practicas/parentesis/?ejercicio=1&probar=1)
enseña una operación como 2 + 3 · 4; el alumno toca los huecos a los lados de cada número para poner y quitar «(» y «)», ve la
resolución línea a línea y, debajo, **todos los resultados posibles, apagados**, que se encienden según los consigue. A Juan Luis le
gusta mucho y la quiere en la U3, la U4 y la U5. Ninguna práctica de esas unidades tiene el «encuentra todos los resultados»
(`parentesis-enteros` ej. 5 es una diana de un solo par de paréntesis; `combinadas-fracciones` y `multiplica-divide-decimales`, de
elegir o escribir).

Se hacen **tres prácticas nuevas** (no ejercicios al final de las que hay; el porqué, en `proyecto.md`), sobre **un solo motor**.
Esta tarea deja el motor y la pantalla en `_comun`, probados contra la U1, y las tres prácticas dadas de alta y sin publicar, con un
esqueleto que funciona, para que las tareas 200, 201 y 202 (MEDIO) las escriban **a la vez**, cada una solo en su carpeta.

| id | slug | Nombre (es / en) | Unidad, bloque de la portada | Ejercicios | La escribe | La publica |
|---|---|---|---|---|---|---|
| 80 | `coloca-enteros` | Coloca los paréntesis. Con enteros / Place the brackets: with integers | 3, «Semana 3 · Potencias, jerarquía y paréntesis» (detrás de `parentesis-enteros`) | 3 | 200 | 203 |
| 81 | `coloca-fracciones` | Coloca los paréntesis. Con fracciones / Place the brackets: with fractions | 4, el bloque de la semana 3 (detrás de `combinadas-fracciones`) | 3 | 201 | 204 |
| 82 | `coloca-decimales` | Coloca los paréntesis. Con decimales / Place the brackets: with decimals | 5, el bloque de la semana 2 (detrás de `multiplica-divide-decimales`) | 3 | 202 | 204 |

Los ejercicios de cada una, sus números y sus cotas están en las fichas 200-202: léelas antes de diseñar el motor, porque el motor
tiene que servir a las tres.

## Qué hay que hacer

1. **Lee la U1 entera**: `practicas/parentesis/{logica,practica,textos,estilos}.js|css`, `tests/practicas-parentesis.test.js`,
   `tests/practicas-ayuda-parentesis.test.js` y la ficha 19 (`$R/tareas/tarea-19-parentesis.md`). **No se toca nada de
   `practicas/parentesis/`**: está publicada, a Juan Luis le gusta como está y su `logica.js` es la referencia de la prueba de
   equivalencia del paso 4. (Pasarla al motor nuevo es una propuesta para la ENTREGA, no un cambio de esta tarea.)
2. **`practicas/_comun/parentesis-motor.js`**, puro (sin DOM ni red), generalizando `parentesis/logica.js`:
   - `crearMotor(aritmetica)` devuelve las funciones de la U1 con la aritmética inyectada: `arboles`, `secuencia`, `evaluar`
     (pasos y, si un árbol no se puede, `{ invalido: { paso, razon, a, op, b } }`), `resultados` (sin repetir **por valor**, con
     `aritmetica.clave`, y ordenados con `aritmetica.comparar`), `analizar`, `sinParentesis`, `interpretar`, `colocacion`,
     `alcanzable`, `arbolQueDa`, `pistaPara`, `textoColocacion`, y un `buscar(rng, hacer, vale, reserva, { anterior })` que cuente
     cuántas veces cae en la reserva (para el test) y **no devuelva la misma expresión que `anterior`** (clave de la expresión:
     números, operaciones y exponente).
   - Los pasos se guardan como **secuencias** (estructura), no como texto ASCII: la U4 escribe fracciones con raya y eso no sale
     de un `replace`. `htmlSecuencia(sec, idioma)` y `htmlPasos(pasos, idioma)` pintan con `aritmetica.html(valor, { idioma,
     detras, base })`; `claveSecuencia(sec)` da un texto plano para claves y huellas.
   - **Aritméticas** (en el mismo fichero o en uno hermano, `parentesis-aritmeticas.js`; dilo en la ENTREGA): cada una es
     `{ operar(a, op, b) → { valor } | { razon }, potencia(base, e) → idem, clave(v), comparar(a, b), html(v, opciones) }`.
     - `ARITMETICA_NATURALES`: exactamente las reglas de la U1 (razones `negativo`, `inexacta`, `cero`, `grande` con tope 10 000).
     - `aritmeticaEnteros({ tope })`: la resta siempre se puede; razones `inexacta` (el cociente no es entero), `cero`, `grande`
       (|valor| > tope). Escritura con `fmt`/`MENOS` de `_comun/enteros.js` (U+2212).
     - `aritmeticaFracciones({ topeNum, topeDen })`: sobre `Fraccion` de `_comun/fracciones.js`; cada resultado, **irreducible**;
       razones `cero` (dividir entre 0) y `grande` (numerador o denominador del irreducible por encima del tope). HTML con
       `htmlFraccion` (raya; compacta en los chips); un entero se escribe como entero (2, no 2/1).
     - `aritmeticaDecimales({ cifras, tope, negativos })`: sobre `_comun/decimales.js` (entero escalado; **nunca** coma flotante);
       razones `inexacta` (la división no es exacta o el resultado pasa de `cifras` cifras decimales; vale también para una
       potencia con demasiadas cifras), `cero`, `negativo` (si `negativos: false`), `grande`. Clave por valor (0,5 = 0,50) y
       escritura normalizada con `aTexto` (coma en español, punto en inglés).
   - **Escritura** (lo decide la aritmética, no el motor): un negativo **detrás de una operación** va entre paréntesis
     (`5 · (−2)`, `4 − (−3)`, `1/2 · (−1/3)`); **la base de una potencia** que sea negativa o una fracción va entre paréntesis
     (`(−2)²`, `(2/3)²`); el primero de una línea o de un grupo, sin paréntesis de más (`(−3 + 2) · 4`, no `((−3) + 2) · 4`).
     Ojo con la trampa de la U1: cuando un grupo se queda en un solo número, `paso` le quita los paréntesis; si ese número es la
     base de una potencia y es negativo, `(−2)²` tiene que seguir escrito así, nunca `−2²` (que es otro número).
3. **`practicas/_comun/parentesis-pantalla.js`** (DOM) y **`practicas/_comun/parentesis-textos.js`** (`{ es, en }`): la interfaz
   de `parentesis/practica.js` sacada a funciones con el motor y los textos inyectados: `crearEditor`, `montarTodos`,
   `montarDiana`, `resumenHtml`, y los constructores del «No lo sé» (`explicaTodos`, `explicaDiana`, como `explicaTres` y
   `explicaDiana` de `parentesis/textos.js`, con la solución del ítem y una agrupación imposible de ejemplo cuando la haya). Mismo
   comportamiento que la U1: 400 ms por línea, hasta dos paréntesis seguidos por hueco, pista, borrar, el valor sin paréntesis ya
   encendido, «no agrupan / ya lo tenías / ya con otros», `responder({ acierto: true, pistas, html, espera: 5000 })` al encenderlos
   todos, y en los «todos» `objetivo: 5, penalizacion: 0` en la definición del ejercicio. Los chips y la resolución se pintan con
   `aritmetica.html` (las fracciones, con raya compacta). **Nada de CSS en `_comun/estilos.css`** (es de la 197): los estilos del
   editor (`.expr`, `.celda`, `.hueco-p`, `.chip`…) se copian al `estilos.css` de cada práctica nueva.
   Lo que no sea común (las introducciones, la frase de cada razón de «no se puede», el consejo del «No lo sé») lo pone cada
   práctica en su `textos.js`; los textos comunes, en `parentesis-textos.js`.
4. **`tests/practicas-parentesis-motor.test.js`**:
   - **Equivalencia con la U1** (lo que garantiza que el motor es el de la práctica que le gusta a Juan Luis): con
     `ARITMETICA_NATURALES`, para 3000 ítems de cada ejercicio de `parentesis/logica.js` (`generar(1..4, rng)`), el motor da los
     mismos `arboles` (por `clave`), los mismos `resultados`, la misma validez y razón de cada árbol, la misma `colocacion`, el mismo
     `arbolQueDa` (por valor) y la misma `pistaPara` desde una colocación vacía y desde una a medias.
   - Casos fijos: `12 : 6 : 2 = 1`; `6 − (1 − 8) = 13`; `(−3 + 1)²` se escribe `(−2)²` en el paso y vale 4; `−4 · 2 + 3 · 2²`
     da 4 sin paréntesis y `(−4 · 2 + 3) · 2²` da −20; `1/2 + 1/4` y `3/4` son el mismo chip; `0,5 · 3` y `1,5`, también;
     `7 : 2` en enteros es `inexacta`; `1 : 3` en decimales es `inexacta`; ninguna división entre 0 se hace.
   - **Alcanzables**: para 200 expresiones al azar de cada aritmética (tres y cuatro números, con y sin exponente), recorrer
     **todas** las colocaciones del editor (0-2 «(» y 0-2 «)» por número), interpretarlas y evaluarlas: el conjunto de valores que
     salen es exactamente `resultados`. Es la prueba de que ningún chip apagado es inalcanzable y ninguno falta.
   - La clave de la expresión y `buscar` con `anterior`: dos llamadas seguidas no dan la misma.
5. **Las tres filas del catálogo** (`practicas/_comun/catalogo.js`): ids 80, 81 y 82 (los siguientes libres: el más alto es el 79),
   `unidad` 3, 4 y 5, `nEjercicios: 3`, **`disponible: false`**, cada una justo detrás de la práctica de su unidad que nombra la tabla
   de arriba, con un comentario de una línea (tarea, quién la publica). Y en `tests/practicas-comun.test.js`, solo la lista
   `[id, slug, nEjercicios]` (los totales por unidad no cambian: filtran por los rangos de ids de cada base).
6. **El esqueleto de cada práctica** (`practicas/coloca-<x>/`: `index.html` y `estilos.css` copiados de `parentesis/` con la ruta
   y el título nuevos, `logica.js` con su aritmética y un `generar(ejercicio, rng, sesion)` provisional que ya cumpla las cotas
   de su ficha por `buscar`, `textos.js` y `practica.js` con los tres ejercicios, sus `explicacion` y su `noLoSe`). Tiene que
   cargar, pasar `tests/practicas-no-lo-se.test.js` y funcionar con «Probar sin código»: es lo que heredan las 200-202, que lo
   rehacen a su gusto. Desde que esta tarea esté LISTA, **cada carpeta es de su tarea** (200, 201, 202).
7. **La portada** (`practicas/portada.js`): cada slug en el bloque de la tabla de arriba y su descripción en los dos idiomas.
   **`DESTREZAS`** (`practicas/_comun/registro.js`) y el **§7** de `docs/practicas-unidad{3,4,5}.md` a la vez (el test de registro
   exige que coincidan), con estas destrezas (compruébalas en el inventario de cada unidad; si una no encaja, dilo en la ENTREGA):
   - `coloca-enteros`: U3-3A-01, U3-3C-10, U3-3C-16, U3-4A-04, U3-4A-06.
   - `coloca-fracciones`: U4-3A-01, U4-3A-02, U4-3C-10.
   - `coloca-decimales`: U5-2C-13, U5-2C-14, U5-2C-15.
   Y en la tabla de prácticas de cada `docs/practicas-unidadN.md`, una fila con «sin publicar (la publica la 203/204)».
8. `npm test` en verde; prueba en el navegador, a 375 px y en ancho, en español y en inglés, que los tres esqueletos y la U1 cargan
   (la U1 no ha cambiado: compruébalo igual) y que el editor de una fracción con raya no se sale a 375 px (mídelo con cuatro
   números; si no cabe, déjalo dicho en la ENTREGA para la 201 con la medida).

## Datos de entrada

- `practicas/parentesis/` y sus dos tests (solo lectura), la ficha 19 y la ENTREGA de la 187 (su «No lo sé»).
- `practicas/_comun/enteros.js`, `fracciones.js`, `decimales.js` (solo lectura: se usan, no se cambian).
- Las fichas 200, 201 y 202 (los ejercicios y las cotas de cada unidad).
- Los inventarios, solo lectura: `apuntes-1eso-bilingue/{3. Integers,4. Fractions,5. Decimals}/inventario-unidad{3,4,5}.tsv`
  (ruta base: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/`).

## Cómo saber que ha terminado

- El motor, la pantalla y los textos comunes en `_comun`, con su test (equivalencia con la U1, casos fijos, alcanzables) en verde.
- Las filas 80, 81 y 82 en el catálogo con `disponible: false`; los tres esqueletos cargan con «Probar sin código» y pasan el test
  genérico del «No lo sé»; portada, `DESTREZAS` y §7 al día; `practicas/parentesis/` sin un solo cambio (`git diff --stat` vacío ahí).
- `npm test` sin fallos, comiteado y empujado. La ENTREGA dice la **API real** del motor y de la pantalla (las 200-202 la leen ahí,
  no en esta ficha), con un ejemplo de uso por aritmética.

## Trampas conocidas

- (de la coordinadora) **El motor no puede comparar con `===`** los valores de fracciones y decimales: un `Set` de objetos no
  deduplica. Todo lo que hoy hace la U1 con números (`Set`, `sort`, `!==`, `faltan.has(v)`, los `data-v` de los chips) pasa por
  `clave` y `comparar`. Es donde se cuelan dos chips iguales (3/4 y 6/8; 0,5 y 0,50), que serían «dos respuestas correctas» de la
  regla de oro.
- (de la coordinadora) La U1 escribe los pasos como texto ASCII y los adorna con `formatear`; con fracciones eso no vale (raya).
  Si conservas el texto, que sea solo para claves.
- (de la 19) `5 + 2 + 3` agrupado de dos maneras da lo mismo: se deduplica por valor y el mensaje «no cambia el resultado» sale.
  La resta y la división, de izquierda a derecha (`12 : 6 : 2 = 1`).
- (de la coordinadora) `buscar` de la U1 cae en la `reserva` en silencio: con las cotas de la U4 o la U5 puede caer a menudo y
  repetir siempre el mismo ítem (criterio de variedad del 13-11: ningún ítem en más del 10 %). Cuenta las caídas.
- (de la coordinadora) El test genérico `tests/practicas-no-lo-se.test.js` carga **toda** práctica del catálogo y prueba 200
  ítems de cada `explicacion`: en cuanto pongas las filas, los esqueletos tienen que estar completos. No se edita (es de la 197).
- (de la 88) `.cuenta` no se parte (`nowrap`): solo cuentas cortas dentro; las frases, como texto normal.
- (de la coordinadora) Hay varias sesiones en este árbol: mira `git status --short` de cada fichero común antes de tocarlo.
- (de la 199) **`tests/practicas-semana.test.js` fija a mano los slugs de cada bloque de la portada** (y el orden de los bloques
  publicados de la U4 y la U5): poner un slug en `portada.js` lo rompe. No estaba en «Ficheros que toca»; cualquier alta futura en
  la portada lo tiene que declarar.
- (de la 199) Con cuatro números, la expresión del editor **no cabe en un renglón a 375 px, ni en la U1 publicada** (ancho natural
  380-465 px en una caja de 324): pasa a dos renglones sin salirse. Las medidas están en la ENTREGA.
- (de la 199) `python3 -m http.server` corta conexiones (`ERR_CONNECTION_RESET`) cuando una práctica pide veinte módulos a la vez:
  la prueba en el navegador falla al azar. Un servidor estático de diez líneas en Node no lo hace.
- (de la 199) En zsh, `git add $F` con varias rutas en una variable no parte en palabras: usa un array (`"${F[@]}"`).

## Prohibido (propio de esta tarea)

- Tocar `practicas/parentesis/` (U1), `practicas/parentesis-enteros/`, `practicas/combinadas-fracciones/` o
  `practicas/multiplica-divide-decimales/`.
- Tocar `practicas/_comun/estilos.css`, `base.js`, `piezas.js`, `enteros.js`, `fracciones.js` o `decimales.js` (si les falta algo,
  se escribe en el motor o se propone en la ENTREGA).
- Poner `disponible: true` a ninguna de las tres (las publican la 203 y la 204, después de revisarlas con clics).
- Escribir en el repositorio un caso de examen en claro (comentarios y tests incluidos).

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas claramente más lentas, aviso de límite de
sesión. Con una señal, termina esta tarea y no encadenes otra. Con varias, a mitad: lo que tenga sentido solo es **el motor con su
test** (comitéalo y empújalo: no lo ve ningún alumno); deja las filas del catálogo para el final y en el mismo commit que los
esqueletos (sin esqueleto, `npm test` falla). Escribe `$R/hechos/notas/<sid>-traspaso-199.md` con el estado exacto,
`$R/hechos/fallos/199--<sid>.md` con `parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que quepa, comitea coherente y actualiza arriba la duración esperada antes de soltarla.
Si está **mal cortada** (el corte natural es «motor y test» / «pantalla, catálogo y esqueletos»), no la recortes tú: termina el
trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el tamaño real y el corte, `$R/hechos/fallos/199--<sid>.md` con
`parada por: mal cortada` y la ruta de la incidencia, `ABANDONADA` en tu reclamo, y díselo a Juan Luis.

## Al terminar

1. `node --test tests/practicas-parentesis-motor.test.js tests/practicas-parentesis.test.js tests/practicas-ayuda-parentesis.test.js tests/practicas-comun.test.js tests/practicas-registro.test.js tests/practicas-portada-unidades.test.js tests/practicas-no-lo-se.test.js`
   en verde y `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con reclamo vivo no es tuyo: anótalo en la terminada).
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas y en la misma orden:
   `git add <rutas> && git commit -m "Coloca los paréntesis U3-U5: motor y pantalla comunes, tres prácticas sin publicar (tarea 199)" -- <rutas>`.
   Apunta el hash (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/199-motor-coloca-parentesis/ENTREGA.md` (API real del motor, de las aritméticas y de la pantalla, con un
   ejemplo de cada una; lo que mide el test; la medida a 375 px; hash; propuestas, como pasar la U1 al motor) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/199--<sid>.md`: hash, ficheros (lo que dice `git show --stat`, no lo que crees), tests, hora y
   **duración real** (de `abierto:` a ahora). Si queda algo sin hacer, empieza por `PARCIAL:` y di qué.
5. Añade `CERRADA` a tu reclamo (línea propia que empieza por esa palabra).
6. Choques encontrados → `$R/hechos/incidencias/<sid>.md`.
7. `git fetch origin`, relista `$R/hechos/` **ahora** y regenera `$R/_ESTADO.md` entero con el guion. Anota qué tareas pasan de
   BLOQUEADA a PENDIENTE (200, 201, 202).
8. Vuelca en «Trampas conocidas» lo que hayas aprendido por las malas (es lo único de la ficha que editas, además de la duración).
9. Un solo commit con rutas explícitas de tus ficheros de `$R/hechos/` (por sid), tu carpeta de `$R/salidas/`, `$R/_ESTADO.md` y esta
   ficha, y `git push origin main`. Si el push se rechaza: `git pull --rebase origin main` (nunca `--autostash`), regenera el tablón
   otra vez desde `hechos/` (no lo fusiones a mano) y vuelve a comitear y empujar.
10. Dile al usuario la **foto del momento** en tres líneas («EN CURSO: … · LIBRES ahora: … · BLOQUEADAS: …»), sacada de la lectura
    de `hechos/` del paso 7, y, **solo para las LIBRES**, las frases de arranque de `proyecto.md` literales, en bloques de cita, una
    por sesión que quepa a la vez (200, 201 y 202 caben las tres), con la tarea, la banda traducida y el nombre de sesión delante.

Si paras sin terminar: `$R/hechos/fallos/199--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni el resto de `practicas/_comun/`, ni `css/estilos.css`,
  ni `README.md`, ni `firestore.rules` ni `src/firebase.js`, ni fichas ajenas, ni nada de la carpeta de apuntes de iCloud. Si la base
  te falta algo, se propone en la terminada; no se parchea.
- `git add .`, `git add -A`, `git commit -a`, o un `add` separado del `commit`. El índice es compartido con otras sesiones del mismo
  árbol. Nunca `git stash`, `--autostash`, `git checkout -- .` ni `git reset --hard`.
- Editar el código con `sed -i` o heredocs desde el shell: el candado de sesiones solo ve Edit/Write. El código se edita con las
  herramientas de edición; `hechos/` sí se escribe desde el shell (un escritor).
- Reescribir un fichero de `hechos/` (solo `>>`), editar un reclamo ajeno, o regenerar el tablón de memoria sin relistar `hechos/`.
- Dependencias nuevas (npm, CDN). Nombres de alumnos reales en ningún fichero.
