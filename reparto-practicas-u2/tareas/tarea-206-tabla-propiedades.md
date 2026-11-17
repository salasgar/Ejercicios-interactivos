# Tarea 206 · Reto de la unidad 2 «Tabla de propiedades» (`tabla-propiedades`, id 83): arrastrar números y etiquetas para formar una tabla de doble entrada, por niveles

Actualizado: 2026-11-16 (alta de la coordinadora s-20261116T124745-d0ed648f, por el encargo de Juan Luis del 15/16-11; decisiones en `proyecto.md`, «Decisiones del 16-11: el reto «Tabla de propiedades» y los puntos extra»)
Precondición: **205 LISTA** (deja `api.sumar`, `sinVidas` y el campo `reto`) · nadie con reclamo vivo sobre `practicas/_comun/catalogo.js` (**ni la 203 ni la 204**: las tres tocan el catálogo y los docs; en cadena, nunca a la vez) · `git status --short practicas/tabla-propiedades/ practicas/_comun/catalogo.js practicas/portada.js` vacío · Disparo: MANUAL · **Plazo: mié 25-11** (la 207 la publica antes del vie 27-11)
Duración esperada: 2 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: ninguna
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/206-tabla-propiedades/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/tabla-propiedades/*` (nueva), `practicas/_comun/catalogo.js` (solo la fila 83, con `disponible: false`), `practicas/portada.js` (la descripción de la práctica y su sitio en un bloque de la U2), `tests/practicas-comun.test.js` (la fila nueva en la lista fija), `tests/practicas-tabla-propiedades.test.js` (nuevo), `docs/practicas-unidad2.md` (la práctica nueva en su lista)

La duración esperada no es informativa: de ella sale la caducidad del reclamo (2 ×), el plazo tras el cual otra
sesión puede relevarte si te cortas. **Este fichero es la fuente de la banda**: el tablón la copia de aquí cada vez que
se regenera. La tabla de bandas de `proyecto.md` la traduce al menú de hoy (ALTO = Opus 5.5, esfuerzo Alto; MEDIO =
Sonnet 5.5, esfuerzo Medio).

## Antes de empezar

Todas las rutas son relativas a la raíz del repositorio (`/Users/salasgar/Documents/git/Ejercicios-interactivos`).
`R=reparto-practicas-u2`. Las sesiones de este reparto trabajan en ese árbol, no en un worktree.

1. Lee `$R/proyecto.md` (al menos «Dónde está cada cosa», «Reglas de contenido comunes» y **«Decisiones del 16-11: el reto «Tabla
   de propiedades» y los puntos extra»**), `$R/_ESTADO.md`, la **ENTREGA de la 205** (`$R/salidas/205-reto-puntos-extra/ENTREGA.md`:
   la API real de `sumar`, `sinVidas` y `reto`), el contrato de `practicas/plantilla/practica.js` y lista `$R/hechos/`
   (`ls $R/hechos/*/`): la carpeta manda sobre la tabla.
2. `date -u` para la hora de verdad. `git fetch origin && git status -sb`; si hay commits que traer, `git pull --rebase origin main`
   (nunca `--autostash`). Si el `main` local diverge de `origin/main`, no lo arregles: díselo a Juan Luis y para. **Comprueba la
   precondición en el disco**: `ls $R/hechos/terminadas/ | grep '^205--'`, ningún reclamo vivo de la 203 ni de la 204, y
   `git status --short` de los ficheros de arriba **vacío**. Si algo sale modificado, es trabajo de otra sesión: no lo toques y no
   reclames.
3. Abre tu reclamo generando el sid **en el mismo comando** (probado en este Mac):
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -v+300M +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 206\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/206--$sid.md; echo $sid
   ```
   (300 min = 2 × la duración esperada). Tu sid es el del nombre de ese fichero; no lo guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/ | grep '^206--'` — el comando, no la intención. Si hay otro reclamo vivo de la 206 con
   `abierto:` más antiguo (o igual y sid menor), añade a tu reclamo `CEDIDA a <sid del otro>` y para.
5. Si el reclamo que encuentras está caducado (RELEVABLE), relévalo con `releva a: <sid anterior>` **en tu propio reclamo**. Mira
   qué dejó hecho (`git log --oneline -8`, `git status -sb`, su carpeta de salida): lo comiteado con tests en verde se hereda y se
   dice en la terminada; lo demás se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** con el guion (`$R/hechos/notas/s-20261111T215225-39c1f4f5-regenerar-tablon.py`,
   ver su cabecera) y sigue con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/206--<sid>.md`) al terminar cada
paso grande. Si vas a tardar más de lo que te queda, añade antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`).
Tras cualquier pausa: `date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de `$R/hechos/reclamos/*.md`; si te han
relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Idea de Juan Luis (15-11), con una hoja de cálculo suya como ejemplo: hay unas **etiquetas** con propiedades de los números
(«Primo», «Par», «Cuadrado perfecto», «> 50»…) y unos **números**; el alumno arrastra las etiquetas a las cabeceras de las filas y
de las columnas de una tabla vacía, y cada número a una casilla **cuyas dos propiedades cumpla** (la de su fila y la de su columna).
Su ejemplo, ya resuelto (12 números, 4 filas × 3 columnas):

|                   | Triangular | Par | Impar |
|-------------------|-----------:|----:|------:|
| Primo             | 3          | 2   | 53    |
| Compuesto         | 10         | 4   | 15    |
| Cuadrado perfecto | 1          | 36  | 81    |
| > 50              | 55         | 68  | 51    |

**Hay muchas soluciones, a propósito** (Juan Luis: «Siempre habrá muchas posibles soluciones. Tienen que decidir dónde colocar los
números y dónde colocar las etiquetas»): qué etiquetas van en filas y cuáles en columnas, en qué orden, y qué número va en cada
casilla. **Se corrige por propiedades, nunca contra una clave.**

Es un **reto opcional** (Juan Luis: «puede que sea un ejercicio difícil»), por **niveles**: al resolver uno se pasa al siguiente, más
grande. Al completar cada tabla, **1 punto por cada número y cada etiqueta que haya colocado**; resolviéndolo entero pasa de largo
de los 10 puntos: es el premio por la dificultad.

## Qué hay que hacer

### Un solo ejercicio con cuatro niveles por dentro

`nEjercicios: 1` en el catálogo. El nivel en que está el alumno se deduce de sus puntos (0 → 6 → 20 → 35 → 54), así el progreso
guardado basta para retomar y no hace falta nada nuevo en la base. `objetivo: 54`, `penalizacion: 0`, `sinVidas: true` (de la 205),
`sinAyuda` (el motivo: «es un reto que se comprueba sin coste, y el feedback dice qué no encaja»: no lleva «No lo sé»).

| Nivel | Tabla | Números | Etiquetas | Quién coloca las etiquetas | Puntos al completarla | Propiedades |
|---|---|---|---|---|---|---|
| 1 | 2 × 3 | 6 | 5 | **ya colocadas** | 6 | fáciles |
| 2 | 2 × 4 | 8 | 6 | el alumno | 14 | fáciles y medias |
| 3 | 3 × 3 | 9 | 6 | el alumno | 15 | fáciles y medias |
| 4 | 4 × 3 | 12 | 7 | el alumno | 19 | todas, también las difíciles |

Los niveles y sus tamaños los ha fijado la coordinadora con lo que Juan Luis pidió («una versión más sencilla con solo 8 o 9
números, o incluso con solo 6»; «un reto por niveles que vaya aumentando la dificultad»; etiquetas ya colocadas en los primeros
niveles y propiedades fáciles antes que las difíciles, aprobado el 15-11). Él puede cambiarlos; déjalos en una tabla de `logica.js`.
**Terminado el nivel 4, el ejercicio está terminado** (54 puntos); si vuelve a entrar, puede seguir jugando tablas del nivel 4 sin
sumar más (como cualquier ejercicio terminado; mira cómo lo hace la base).

### Banco de etiquetas (números del 1 al 100)

- **Fáciles**: par, impar, mayor que N y menor que N (N múltiplo de 10), múltiplo de 5, múltiplo de 10.
- **Medias**: primo, compuesto, múltiplo de k (k = 3, 4, 6, 9), cuadrado perfecto.
- **Difíciles**: múltiplo de k (k = 7, 11), divisor de N (N = 24, 36, 48, 60, 72, 90, 100), tiene k divisores (k = 3, 4, 6),
  **triangular** (solo en el nivel 4; ver abajo).
- En inglés: even, odd, greater than N, less than N, multiple of k, prime, composite, perfect square, divisor of N («divisor», nunca
  «factor», regla de la U2), has k divisors, triangular number. En español, «divisor de 60», «tiene 4 divisores», «primo»,
  «compuesto», con minúscula o mayúscula inicial según quede en la etiqueta (uniforme).
- **Nada de «tiene 2 divisores»** (es «primo» con otras palabras) ni de dos etiquetas equivalentes en la misma tabla.
- El 1 puede salir: no es primo ni compuesto (U2-2C-02), y el feedback lo dice. El 0, no.

### El generador: que siempre exista al menos una solución

1. Elige las etiquetas del nivel y **un reparto en filas y columnas**.
2. Para cada casilla, elige un número que cumpla las dos propiedades, **todos distintos** (si una casilla no tiene candidato libre,
   descarta y vuelve a empezar: no dejes casillas imposibles). Así hay al menos una solución por construcción.
3. Rechaza tablas sin gracia: una etiqueta de fila igual o equivalente a una de columna; «par» en filas e «impar» en columnas (o
   cualquier par de etiquetas incompatibles en ejes distintos: casilla vacía para siempre); una fila o columna en la que **todos**
   los números cumplen todas las etiquetas del otro eje (no hay nada que decidir).
4. Baraja números y etiquetas en la bandeja. En el nivel 1, las etiquetas ya están en las cabeceras y solo se colocan números.
5. No repetir la tabla anterior (`sesion.anterior`) y variedad: en 20 000 tablas por nivel, ninguna combinación de etiquetas en más
   del 10 %, y ningún número en más del 15 % de las tablas.

### La pantalla

- **Arrastrar con el dedo y con el ratón** (eventos de puntero: el modelo es `practicas/venn/practica.js` o
  `practicas/arbol/practica.js`, que ya arrastran fichas) **y, además, tocar y tocar**: tocar una pieza la selecciona, tocar un hueco
  la deja ahí. Una pieza colocada se puede mover a otro hueco o devolver a la bandeja. Una etiqueta puede ir a cualquier cabecera,
  de fila o de columna.
- Tabla vacía con los huecos de las cabeceras y de las casillas; bandeja con las piezas debajo. **Que quepa a 375 px**: la tabla de
  4 × 3 con cabeceras como «Cuadrado perfecto» o «Divisor de 100» (parte en dos líneas o baja la letra; ni desbordar ni scroll
  horizontal).
- Botón **«Comprobar»**, activo cuando están todas las piezas colocadas (antes, dice cuántas faltan). Comprobar **no cuesta nada**
  y se puede repetir siempre.
- **Feedback de cada intento fallido**: qué números no encajan y por qué, con sus números: «36 no es primo: tiene 9 divisores (1, 2,
  3, 4, 6, 9, 12, 18 y 36)»; «51 no es primo: 51 = 3 · 17»; «1 no es primo ni compuesto»; «45 no es divisor de 60: 60 : 45 no es
  exacta»; «16 no es triangular: los triangulares hasta 100 son 1, 3, 6, 10, 15, 21…» (comprueba cada frase con la función de la
  propiedad, no a mano). Las casillas que fallan se marcan; las demás no se tocan (ninguna pieza vuelve sola a la
  bandeja). Sin desvelar dónde iría cada número.
- **Tabla entera bien**: felicitación, `api.sumar(puntos del nivel)` y botón para el nivel siguiente. Producto con `·`, división
  con `:` (español) y `÷` (inglés), si salen.

### La infografía de «triangular»

«Triangular» no se ha dado en la U1 ni en la U2. Juan Luis (15-11): solo en los niveles altos (aquí, el 4); **antes del primer
puzle que la lleve, una pantalla con una infografía** que explica qué es un número triangular (puntos en triángulo: 1, 3, 6, 10,
15…, en SVG dentro de la práctica) **y la pregunta «¿Sabes ya lo que es un número triangular?»**: con **«Sí»**, al puzle; con
**«No»**, a una **explicación más detallada** (1, 1 + 2, 1 + 2 + 3…, cada triángulo con su fila nueva, y la lista de los
triangulares hasta 100: 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78, 91) y luego al puzle. Sale cada vez que una tabla del nivel 4
traiga «triangular», hasta que el alumno conteste «Sí» una vez (recuérdalo en el navegador; si no se puede guardar, que vuelva a
salir no es grave). Hazlo de forma que otra etiqueta nueva pueda llevar su propia infografía con poco código.

### Tests

`tests/practicas-tabla-propiedades.test.js`:
- Cada función de propiedad, contra listas a mano (primos < 100, cuadrados, triangulares, divisores de 60…).
- 2000 tablas por nivel: tamaño, puntos y dificultad del banco según la tabla de niveles; números distintos del 1 al 100; **existe una
  solución** (búscala con un emparejamiento números ↔ casillas sobre el reparto del generador) y las reglas del paso 3.
- **El corrector acepta soluciones distintas de la del generador**: para 200 tablas, construye otra solución válida (otro reparto de
  etiquetas, o dos números intercambiados que también cumplen) y comprueba que la da por buena; y que una con un número mal la da por
  mala, con la frase de feedback correcta en los dos idiomas.
- Variedad y no repetir el anterior; el progreso deduce bien el nivel de los puntos (0, 6, 20, 35, 54).
- `npm test` entero en verde (la fila nueva en `tests/practicas-comun.test.js`).

### En el navegador

`npm run servir` (o tu puerto), `?probar=1`, con clics de ratón y **simulando el dedo** (o el modo táctil de las herramientas de
Chrome), a 375 px y a 1200 px, en español y en inglés: los cuatro niveles completos, un intento fallido con su feedback, mover una
pieza ya colocada, devolverla a la bandeja, la infografía de «triangular» con «Sí» y con «No»; consola limpia.

## Datos de entrada

- La ENTREGA de la 205 (API), `practicas/plantilla/` (contrato), `practicas/venn/` y `practicas/arbol/` (arrastrar; solo lectura),
  `practicas/criba/` y `practicas/_comun/relaciones.js` (lo que ya haya de primos y divisores; reutiliza, no copies).
- Inventario de la U2, solo lectura: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/2. Divisibility/inventario-unidad2.tsv`
  (U2-1C-03, 1C-13, 2C-01 a 2C-07: destrezas que toca).
- La idea, tal como la guardó Juan Luis: `~/.claude/projects/-Users-salasgar-Documents-git-Ejercicios-interactivos/memory/idea-tabla-doble-entrada-propiedades.md` (solo lectura).

## Cómo saber que ha terminado

- La práctica con sus cuatro niveles, la infografía y los tests; `npm test` en verde; comiteado y empujado. Sigue con
  `disponible: false` (la publica la 207) y funciona por URL: https://salasgar.github.io/Ejercicios-interactivos/practicas/tabla-propiedades/?probar=1
- La ENTREGA dice los niveles y el banco finales, los recuentos (variedad, rechazos del generador) y cómo se probó en el navegador,
  para que la 207 la revise con clics.

## Trampas conocidas

- **Una etiqueta de pocos números (cuadrado perfecto: 10; triangular: 13) obliga a que 3-4 casillas se llenen con esos pocos**, y el tope del 15 % por número no se cumple en los niveles 3 y 4
  (≈ 22 % y 46 %); está explicado en la ENTREGA y el test fija topes por nivel. Quien toque el generador: mide con 3000 tablas por nivel antes y después.
- Un `api.sumar` en el nivel 4 siempre deja 54 puntos (el nivel sale de los puntos y 35 + 19 = 54): la frase de «has completado los cuatro niveles» no necesita leer el contador.
- Repetir un ejercicio terminado lo reinicia con 0 puntos (lo hace la base), así que la repetición empieza por el nivel 1.
- El servidor de Python en frío da `ERR_CONNECTION_RESET` en alguna carga; repetir la pasada del navegador.

- (de la 206, 17-11) **Las cabeceras de 4 columnas a 360-375 px no caben con los márgenes por defecto**: la tarjeta y `.app` quitan ~67 px. Se miden con un marco (`<iframe style="width:375px">`) con el CSS y las piezas reales, partiendo cada etiqueta en palabras y midiendo cada palabra con un `<span>` `nowrap` dentro de la pieza (con `overflow-wrap: break-word` una palabra partida no da `scrollWidth`). Con el CSS de móvil de `estilos.css` caben las 38 etiquetas a 320, 360 y 375 px. **Una tabla de reserva tiene que pasar las mismas reglas que las del generador** (números distintos: las piezas se identifican por su valor); lo comprueba el test `reserva`.

## Prohibido

- Corregir contra una solución fija: cualquier colocación que cumpla las propiedades es buena.
- Una tabla sin solución, o con una casilla imposible.
- Poner `disponible: true` (es de la 207) o tocar una fila del catálogo que no sea la 83.
- Tocar `tareas.js`, `base.js` o `contador.js` (son de la 205; si les falta algo, escríbelo como hallazgo y para).
- «Factor» por «divisor» entre números; «2 divisores» como etiqueta.
- `git add` separado de `git commit`; `git commit` sin rutas explícitas.

## Al terminar

1. `npm test` en verde. Commit del código con rutas explícitas (`git commit -m "…" -- ruta1 ruta2…`) → sale el hash.
2. `$R/salidas/206-tabla-propiedades/ENTREGA.md` y su marcador `ENTREGA.md.ok-<sid>`.
3. `$R/hechos/terminadas/206--<sid>.md` con el hash, la duración real y el `npm test`; `CERRADA` al final de tu reclamo.
4. Trampas nuevas en esta ficha. Regenera `$R/_ESTADO.md` con el guion.
5. Un commit con rutas explícitas de tus ficheros de `hechos/`, la salida, `_ESTADO.md` y esta ficha → `git push`. Si se rechaza,
   trae lo nuevo, **regenera otra vez el tablón** y vuelve a comitear.
6. Dile a Juan Luis el enlace para probarla (`?probar=1`) y que la 207 la publica.
7. Dale la foto del momento (EN CURSO · LIBRES · BLOQUEADAS) y **las frases de arranque** de lo que haya quedado libre, cada una con
   su nombre de sesión delante, su banda traducida y la tarea o cadena que reclama.
