# Tarea 97 · Práctica nueva «Las fichas de Pablo» / «Pablo's counters» (`fichas-de-pablo`): la hoja de refuerzo de la unidad 2, convertida en ejercicios interactivos para hacerla en clase

Actualizado: 2026-10-25 (alta de la coordinadora s-20261025T003735-56c33ec7, por encargo de Juan Luis: «Conviértela en una hoja de ejercicios interactivos, como si fuese una tarea de ejercicios interactivos de una semana. La haremos en clase»)
Precondición: ninguna (la hoja está aprobada por Juan Luis el 25-10) · Disparo: MANUAL (sesión atendida) · **Plazo: LISTA antes del jueves 29-10** (la semana 3 de la U2 empieza el lunes 26-10 y la quiere hacer en clase)
Duración esperada: 3 h (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/97-fichas-de-pablo/` (solo `ENTREGA.md`, su marcador y `capturas/`; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca, salvo lo dicho en «Trampas»): `practicas/fichas-de-pablo/*` (nuevo), `tests/practicas-fichas-de-pablo.test.js` (nuevo), `practicas/_comun/catalogo.js` (solo una fila nueva, la última de la unidad 2, detrás de `por-primos`), `practicas/portada.js` (solo un bloque nuevo en `BLOQUES` para la unidad 2 y una entrada de `DESCRIPCION`), `practicas/_comun/registro.js` (solo una línea nueva en `DESTREZAS`, en la unidad 2), `docs/practicas-unidad2.md` (solo un párrafo en §6 y la columna «Prácticas» de nueve filas del §7)

La duración esperada no es informativa: de ella sale la caducidad del reclamo (2 ×, mínimo
45 min), el plazo tras el cual otra sesión puede relevarte si te cortas. **Este fichero es
la fuente de la banda**: el tablón la copia de aquí cada vez que se regenera. La banda
dice con qué modelo conviene abrir la sesión; la tabla de bandas de `proyecto.md` la
traduce al menú de hoy (ALTO = Opus 5.5, esfuerzo Alto; MEDIO = Sonnet 5.5, esfuerzo Medio).

## Antes de empezar

Todas las rutas son relativas a la raíz del repositorio
(`/Users/salasgar/Documents/git/Ejercicios-interactivos`). `R=reparto-practicas-u2`.

1. Lee `$R/proyecto.md` y `$R/_ESTADO.md` enteros, y **lista `$R/hechos/`**
   (`ls $R/hechos/*/`): la carpeta manda sobre la tabla. Resuelve lo que no cuadre antes de
   coger nada (tabla de rastros contradictorios en el tablón, «Antes de hacer nada»).
2. `date -u` para saber la hora de verdad. `git fetch origin && git status -sb` para saber
   si hay commits que traer (`git pull --rebase origin main` si los hay; los ficheros de
   otras sesiones a medias no estorban porque tocan rutas distintas). **Nunca `--autostash`.**
3. Abre tu reclamo generando el sid **en el mismo comando** (probado en este Mac):
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -d '+MINUTOS minutes' +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -v+MINUTOSM +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 97\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/97--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/97--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 97 con `abierto:` más antiguo (o igual y sid menor), añade a tu
   reclamo una línea `CEDIDA a <sid del otro>` y elige otra tarea.
5. Si el reclamo que encuentras está caducado (RELEVABLE en el tablón), relévalo con la
   línea `releva a: <sid anterior>` **en tu propio reclamo**; el suyo no se toca. Después
   mira qué dejó hecho: `ls practicas/`, `git log --oneline -5`, `git status -sb`, y la
   carpeta de salida. Lo que haya con tests en verde se hereda y se dice en la terminada;
   lo que no, se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** (todas las filas contra `hechos/` y la
   hora real; banda y «encadenable» recopiadas de las fichas) antes de empezar, y sigue
   con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.
   Si el hook dice que otra sesión tiene reservado `_ESTADO.md`, no esperes: tu reclamo ya
   vale; regeneras al cerrar.
7. Idempotencia: comprueba si `practicas/fichas-de-pablo/` o tu test ya existen (de una sesión
   caída) antes de crearlos. Si existen, léelos y continúa desde ahí.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/97--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Juan Luis tiene una hoja de refuerzo de la unidad 2, **«Las fichas de Pablo» / «Pablo's counters»**,
que revisó y aprobó el 25-10 («está muy bien»). La idea: Pablo representa cada número con fichas de
parchís, **una ficha por cada factor primo**: verde = 2, azul = 3, amarilla = 5, roja = 7, y una ficha
blanca con el número escrito para el 11, el 13… El 1 es «ninguna ficha». Con eso, multiplicar es
**juntar** fichas, dividir es **quitar** las del divisor, divisible es **tantas o más de cada color**,
un divisor es **cualquier elección de fichas** (también ninguna), el m.c.d. son **las fichas que tienen
los dos** y el m.c.m. es **el montón más pequeño que contiene a los dos**.

Hay que convertir la hoja en la práctica **`fichas-de-pablo`** (id 46 del catálogo, unidad 2,
**8 ejercicios**, nombre `{ es: 'Las fichas de Pablo', en: "Pablo's counters" }`), para que la clase
entera la haga en el aula como si fuera una tarea semanal de la app: él montará la tarea en el panel
(editor de tareas de la 67) con los ejercicios que tú le propongas en la ENTREGA. **En la app sí hay
colores** (la hoja se fotocopia en blanco y negro y por eso nombra las fichas): cada ficha es un
círculo de su color **con el primo escrito dentro**, siempre, para que se lea también sin distinguir
colores; cuando el texto nombre un color, lo hace en los dos idiomas (*green / verde*).

Destrezas del inventario de la unidad 2 que practica (las mismas que la hoja; ningún id nuevo):
**U2-2C-11, U2-2C-12, U2-2C-14** (semana 2, sesión 7), **U2-3C-01, U2-3C-02, U2-3C-03** (sesión 9),
**U2-3C-04, U2-3C-06** (sesión 10) y **U2-3C-08** (sesión 11). Lee su texto, su `nota` y su `ejemplo`
en el inventario antes de escribir nada. La hoja también tiene dos retos (cuadrados perfectos, que es
ampliación U2-2C-15, y la tabla de exponentes enormes de A, B y C): **no entran** en esta tarea; van
como propuesta de ejercicios 9 y 10 en la ENTREGA.

**Es un diseño de la coordinadora (25-10) sobre la hoja aprobada; Juan Luis puede cambiarlo.** Si un
ejercicio no se sostiene, no lo cambies por tu cuenta: entrégalo como propuesta y sigue con los demás.
El número de ejercicios (8) es el del catálogo; otro número también es propuesta.

## Siguiente paso

1. Lee la hoja y su solucionario (son la especificación del contenido, con los ejemplos resueltos
   que irán en las introducciones): `…/2. Divisibility/hojas-de-ejercicios/hoja-unidad2-fichas-de-pablo.tex`
   y `soluciones-unidad2-fichas-de-pablo.tex` (ruta completa en «Datos de entrada»). Solo lectura.
2. Lee la ficha de la tarea 01 (§3, el contrato de `arrancar(practica)` y la `api` de `montar`),
   `practicas/plantilla/` entero y `practicas/_comun/piezas.js`: `pasos` (los botones − / + que vas a
   usar para «construir un montón»), `elecciones` y `claseCorreccion` (los cuatro estados tras
   comprobar), `campoNumero` y `leerNumero`. Mira cómo ocultan «Comprobar» al responder (T58) las
   prácticas de la unidad 2.
3. Lee, **sin importarlas**, dos prácticas hermanas: `practicas/venn/` (m.c.d. y m.c.m. con factores
   primos: la misma matemática con otro dibujo) y `practicas/por-primos/` (multiplicar y dividir por
   primos con botones). Lo que te sirva, cópialo a tu `logica.js`.
4. `ls practicas/fichas-de-pablo/`: no existe. Crea la carpeta copiando `practicas/plantilla/` y empieza
   por `logica.js` y su test, en verde; después `practica.js` (`montar`), `textos.js` y `estilos.css`.
5. Antes de probar en el navegador, la fila del catálogo (la base no arranca sin ella; ver «Trampas»).

## Qué hay que hacer

**Modelo de datos** (`logica.js`, puro): un montón es `{ 2: a, 3: b, 5: c, 7: d, 11: e, 13: f }` con
exponentes enteros ≥ 0 (los que faltan, 0); `valor(monton)`, `fichas(monton)` (la lista de primos, uno
por ficha, de menor a mayor), `indice(monton)` (el HTML en forma de potencias con `<sup>`, bases de menor
a mayor, `·` entre factores, «1» si no hay fichas), `juntar`, `quitar`, `contiene`, `comunes` (m.c.d.:
el menor exponente de cada color), `montonMinimo` (m.c.m.: el mayor exponente), `numeroDivisores`.
Todo con **enteros**; el valor nunca pasa de 100 000.

**Dibujo** (`practica.js` + `estilos.css`): la ficha es un `<span class="ficha ficha--2">2</span>`
redondo, 34-40 px, color de fondo por clase (verde 2, azul 3, amarilla 5, roja 7, blanca con borde
para 11 y 13), el primo dentro en negrita y contraste suficiente; las fichas de un montón van juntas,
agrupadas por color, de menor a mayor primo. Un montón vacío se pinta como una casilla con «1 · no
counters / ninguna ficha». Nada se sale de 375 px: los montones grandes se parten en varias líneas.

**Para todos los ejercicios**: introducción con el ejemplo resuelto de la hoja en los dos idiomas (los
números de la hoja: 40 y 490, 9 000 y 75, 120 y 75, 45 y 1 350, 28, 49 y 45); el ítem en el idioma que
le toque (la base alterna); «Comprobar» que se oculta al responder; los cuatro estados tras comprobar
donde haya opciones; feedback con los números y los colores del ítem («1 350 tiene una sola ficha verde
y 20 necesita dos: no es divisible»); cada fallo pasado a `api.responder` con su `error` (nombre del
error típico, de la lista de cada ejercicio) y la `respuesta` del alumno. Los números generados: solo
primos 2, 3, 5 y 7 salvo donde se diga; exponentes de 0 a 3 (el 2 hasta 4); valores ≤ 2 000 en los
montones que se tocan y ≤ 100 000 en los productos y los m.c.m.

1. **Lee las fichas** · *Read the counters* (U2-2C-11, U2-2C-12). Se enseña un montón (1 a 5 fichas, 1 a
   3 colores; en un 10 % de los ítems hay una ficha blanca de 11 o de 13; en un 8 %, ningún montón: «no
   counters») y el alumno **escribe el número**. La introducción contrasta `2³` (tres verdes, 8) con `2 · 3`
   (una verde y una azul, 6), como el ejercicio 1 c) de la hoja. Errores con nombre, calculados con el ítem
   y reconocidos en lo que escribe: `exponente-como-producto` (tres verdes leídas como 2 · 3 = 6),
   `suma-de-fichas` (suma los primos), `numero-de-fichas` (contesta cuántas fichas hay), `ninguna-es-cero`
   (contesta 0 al montón vacío). Feedback: «tres verdes y una amarilla: 2 · 2 · 2 · 5 = 2³ · 5 = 40».
2. **Construye el montón** · *Build the pile* (U2-2C-11, U2-2C-12). Se da un número (≤ 500; 1 a 4 colores;
   en un 10 %, con 11 o 13 como ficha blanca) y el alumno pone cuántas fichas de cada color con `pasos`
   (− / + de 0 a 4 por color; las fichas se dibujan al momento debajo). Comprobar compara el montón con la
   factorización. Errores: `potencia-como-producto` (para 8 pone una verde y una azul), `faltan-fichas` y
   `sobran-fichas` (con el color), `monton-equivocado` (el resto). Feedback: el montón bueno y «tus fichas
   hacen 24, no 36».
3. **★ Multiplicar es juntar** · *Multiplying is putting the counters together* (U2-2C-11, U2-2C-12). Se
   enseñan A y B como montones y en forma de potencias; el alumno construye con `pasos` el montón de
   A · B (producto ≤ 100 000) y Comprobar lo lee en forma de potencias y en valor. En un 25 % de los
   ítems, en vez de construir: «¿qué fichas añade Pablo a A al multiplicarlo por k?» (k ∈ {2, 3, 4, 5, 6,
   9, 10}) con cuatro opciones de montones pequeños, cada distractor de un error con nombre. Errores:
   `monton-mayor` (coge el mayor exponente de cada color: «eso es el m.c.m.»), `solo-comunes` (el menor
   exponente, solo colores comunes: «eso es el m.c.d.»), `suma-en-vez-de-producto` (si construye las fichas
   de A + B, cuando A + B se factoriza con esos colores), `fichas-mal` (lo demás, con el color que falla).
   El feedback recuerda «juntar fichas es multiplicar, no sumar» cuando toca.
4. **★ Dividir es quitar** · *Dividing is taking counters away* (U2-2C-14, U2-2C-12). Se enseña el montón
   de A (≤ 2 000, 2 a 4 colores) y el divisor d (en forma de potencias y en valor; 1 a 3 fichas, nunca 1 ni
   A). En el 70 % de los ítems d divide a A: el alumno **toca las fichas de A que Pablo quita** (se atenúan)
   y Comprobar comprueba que lo quitado son exactamente las fichas de d; el feedback lee lo que queda:
   «quedan una azul y dos amarillas: 3 · 5² = 75, así que 9 000 : 120 = 75». En el 30 % d **no** divide a
   A: el alumno pulsa «Pablo se atasca: no se puede» / «Pablo gets stuck: it can't be done» y elige **qué
   color le falta** entre los colores de d. Errores: `quita-de-mas` y `quita-de-menos` (con el color),
   `divide-lo-indivisible` (quita fichas cuando falta alguna), `se-atasca-sin-motivo` (dice que no se
   puede cuando sí), `color-equivocado`.
5. **★ La regla: tantas o más de cada color** · *The rule: as many or more of every colour* (U2-2C-14). A
   y d en forma de potencias y como montones; pregunta «¿Es A divisible entre d?» con Sí / No. Si es que
   sí, segundo paso: el cociente en forma de potencias entre cuatro opciones (distractores de errores con
   nombre: `cociente-con-el-menor` (el patrón del m.c.d.), `cociente-sin-quitar` (A entero), `exponente-mal`
   (un exponente de más o de menos)). Si es que no: «¿qué color le falta?» entre los colores de d (uno de
   ellos puede ser un color que A no tiene en absoluto, como el 7 de la hoja). Mitad de ítems divisibles y
   mitad no; entre los no divisibles, al menos un 40 % en que A es **mayor** que d (para el error
   `mayor-es-divisible`) y un 40 % en que a A le falta **un solo color** aunque le sobren muchas fichas de
   los otros (`mira-solo-un-color`). Error también: `ninguna-ficha-de-ese-color` cuando el color falta del
   todo.
6. **Los divisores son elecciones** · *Divisors are choices of counters* (U2-3C-01, U2-3C-02). Montón de A
   con 2 o 3 colores y ≤ 12 divisores. Dos tipos de ítem alternados: (a) «¿cuántos divisores tiene A?»,
   escrito; feedback «(2 + 1) · (1 + 1) = 6: de las azules, ninguna, una o dos; de la amarilla, ninguna o
   una». Errores: `sin-el-mas-uno` (multiplica los exponentes), `suma-de-exponentes`, `numero-de-fichas`.
   (b) «toca las fichas que hacen el divisor d» (d divisor de A, incluido el propio A; en un 10 %, d = 1,
   que es «no tocar ninguna» y se contesta con el botón «Ninguna ficha / No counters»): vale cualquier
   elección con el mismo número de fichas de cada color (las fichas de un color son indistinguibles: el
   test lo comprueba). Errores: `eleccion-mal` (con el valor que hacen sus fichas), `ninguna-es-cero` si
   contesta 0 a «¿qué divisor es no coger ninguna ficha?» (pregunta corta que sale en un 10 %).
7. **★ El m.c.d.: las fichas que tienen los dos** · *The GCD: the counters they both have* (U2-3C-03,
   U2-3C-08). Dos montones, A y B, uno al lado del otro (2 a 3 colores cada uno, ≤ 2 000). El alumno
   **toca en A las fichas que tienen pareja en B**; la app dibuja la pareja en B al tocar. Comprobar da el
   m.c.d. en forma de potencias y en valor. Reparto de ítems: 55 % con parejas en algún color y fichas
   sueltas en los dos; **15 % sin ninguna pareja** (como 49 y 45): entonces hay que pulsar «Ninguna
   pareja» y elegir el m.c.d. entre **1 y 0**; **15 % en que A divide a B** (todas las fichas de A tienen
   pareja: m.c.d. = A, «el pequeño», U2-3C-08); 15 % con un color que solo tiene uno de los dos. Errores:
   `mcd-cero`, `coge-el-mayor` (marca el mayor exponente de un color común: «eso es el m.c.m.»),
   `incluye-no-comunes` (marca un color que B no tiene), `olvida-pareja` (marca de menos), `parejas-mal`
   (lo demás). El feedback dice qué fichas se han quedado sin pareja y por qué.
8. **★ El m.c.m.: el montón más pequeño** · *The LCM: the smallest pile that contains both* (U2-3C-04,
   U2-3C-06, U2-3C-08). A y B como en el 7; el alumno **construye con `pasos` el montón más pequeño que
   contiene a los dos** y Comprobar lo lee (forma de potencias y valor ≤ 100 000). Reparto: 55 % general;
   15 % sin colores comunes (el m.c.m. es el producto); **15 % en que A divide a B** (m.c.m. = B, «el
   grande»); 15 % con un color no común (para U2-3C-06). Errores: `solo-comunes` (el error de Irene: las
   fichas comunes con el montón menor, «eso es el m.c.d.: 15 no puede contener a 120»), `junta-todo` (suma
   los exponentes: «ese es el producto; sobran fichas»), `menor-exponente` (coge el menor de cada color),
   `falta-color` (olvida un color no común, U2-3C-06), `fichas-mal` (lo demás). El feedback comprueba:
   «600 = 120 · 5 = 75 · 8».

**Objetivo de puntos**: 10 en todos salvo en los ejercicios 4, 7 y 8, que son largos: 8 (precedente aceptado
por Juan Luis en la 88). Penalización y vidas, las de la base.

**Test** `tests/practicas-fichas-de-pablo.test.js` (fuerza bruta, 3 000 ítems por ejercicio con semillas fijas):
- Toda la aritmética cuadra: el valor del montón es el producto de sus fichas; en el 4 y el 5, «divisible»
  coincide con `A % d === 0`; en el 7 y el 8, el m.c.d. y el m.c.m. por exponentes coinciden con los
  calculados con el algoritmo de Euclides; en el 6, el número de divisores coincide con contarlos.
- Cotas: valores ≤ 2 000 en los montones que se tocan, ≤ 100 000 en productos y m.c.m.; exponentes ≤ 3
  (≤ 4 el del 2); el 11 y el 13 solo en el 1 y el 2, y salen en al menos un 8 % de sus ítems.
- Los repartos de casos (sin parejas, uno divide al otro, no divisible, A mayor que d…) están dentro de
  ±5 puntos de lo que dice la ficha.
- Todo distractor es distinto de la respuesta correcta y sale de un error con nombre; en el 3 b) y el 5,
  dos opciones nunca son el mismo montón escrito de otra manera.
- Ningún texto de alumno, en ningún idioma, con `×`, con letras de variable ni con «factor» para la relación
  entre números («divisor»); los exponentes con `<sup>` y los productos con `·`.
- La elección de fichas del 6 b) y las parejas del 7 se comparan **por número de fichas de cada color**, no
  por posición.

**Propuesta de la tarea de clase** (para Juan Luis, en la ENTREGA; él la monta en el panel): ★ los
ejercicios 3, 4, 5, 7 y 8 (los ★ de la hoja); a elegir, 1, 2 y 6; con la destreza de cada uno y los
puntos que suma. Título propuesto: «U2 · Las fichas de Pablo (en clase)» / «U2 · Pablo's counters (in
class)». Si el editor exige 100 puntos justos, dilo y propón cómo cuadrarlo.

## Datos de entrada

- La hoja (especificación del contenido, solo lectura): `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/2. Divisibility/hojas-de-ejercicios/hoja-unidad2-fichas-de-pablo.tex` y `soluciones-unidad2-fichas-de-pablo.tex`; la idea original, `IDEA-fichas-de-pablo.md`, en la misma carpeta.
- El inventario de la unidad 2, solo lectura: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/2. Divisibility/inventario-unidad2.tsv`.
- `practicas/_comun/*` (salvo lo declarado arriba), `practicas/plantilla/*`, `practicas/venn/*` y `practicas/por-primos/*`: solo lectura.
- El modelo de prueba en navegador: la ENTREGA de la 82 (`$R/salidas/82-situaciones/ENTREGA.md`, Chrome headless por el protocolo de depuración) y las capturas de la 87 y la 88.

## Cómo saber que ha terminado

- `node --test tests/practicas-comun.test.js tests/practicas-registro.test.js tests/practicas-fichas-de-pablo.test.js` en verde y `npm test` sin fallos en tus ficheros.
- En el navegador (`npm run servir`; si la extensión de Chrome no está conectada, Chrome headless como la 82), http://localhost:8080/practicas/fichas-de-pablo/ con el código de prueba 60 (`7NPD`; si da «no existe», «Probar sin código»; nunca el de un alumno ni AJJN), a 375 px y en ventana ancha, en español y en inglés; en cada ejercicio, un ítem acertado y uno fallado mirando el feedback, y en el 4, el 7 y el 8, también el caso especial (no se puede; ninguna pareja; uno divide al otro). Capturas PNG a 375 px, una por ejercicio, en `salidas/97-fichas-de-pablo/capturas/`.
- La práctica sale en la portada de la unidad 2, en su bloque nuevo «Para toda la unidad · Refuerzo: las fichas de Pablo» / «For the whole unit · Support: Pablo's counters», con `disponible: true` (Juan Luis la ha aprobado y la quiere en clase esta semana: no espera a una tarea de publicación).

## Trampas conocidas

- **`catalogo.js` lo tocan también las tareas 93-96** (solo `disponible` de filas de la unidad 3). Excepción de la coordinadora a la regla de «un fichero, una tarea»: tu fila es una línea nueva en la unidad 2 y la suya está en otras líneas. Si el hook dice que otra sesión tiene reservado el fichero, late («esperando catalogo.js»), espera unos minutos y vuelve; nunca lo edites desde el shell ni fuerces el candado. Si el push se rechaza, `git pull --rebase origin main` lo funde sin conflicto.
- **La base no arranca sin la fila del catálogo** (`nEjercicios` tiene que ser 8, el que declare `practica.js`). Ponla al principio para poder probar; el `disponible: true` queda en el commit final.
- `tests/practicas-registro.test.js` exige que `DESTREZAS` de `registro.js` sea exactamente la tabla del §7 de `docs/practicas-unidad2.md`: la línea nueva de `DESTREZAS` y las nueve filas del §7 van **en el mismo commit** (`por-primos` no está en ninguno de los dos, y así se queda).
- `.cuenta` no se parte (`nowrap`): los montones grandes no van dentro de `.cuenta`; las frases del feedback van como texto normal o se salen de 375 px (lección de la 16).
- `t(null)` no usa el valor por defecto: la barra va en el idioma del ítem (T60, `idiomaBarra()`).
- Las fichas de un mismo color son indistinguibles: nunca comparar por posición ni por `id` de ficha.
- Hay otras sesiones en este árbol (la 93 y, quizá, reabiertas): no metas en tu commit nada que no sea tuyo, y nada de `git stash`.

## Prohibido (propio de esta tarea)

- Cambiar nada de `practicas/_comun/` fuera de la fila de `catalogo.js` y la línea de `DESTREZAS`; tocar `tareas.js` (la tarea de clase la monta Juan Luis en el panel) o `css/estilos.css`.
- Importar `venn/` o `por-primos/`: se copia lo que haga falta a `logica.js`.
- Enseñar fichas sin el primo escrito dentro, o nombrar un color en un solo idioma.
- Los retos de la hoja (cuadrados perfectos, A, B y C): propuesta en la ENTREGA, no código.

## Salida esperada

- `practicas/fichas-de-pablo/{index.html,practica.js,logica.js,textos.js,estilos.css}` y `tests/practicas-fichas-de-pablo.test.js` comiteados, con la fila del catálogo, el bloque de la portada, la línea de `DESTREZAS` y los cambios de `docs/practicas-unidad2.md`, y `npm test` sin fallos en tus ficheros.
- `reparto-practicas-u2/salidas/97-fichas-de-pablo/ENTREGA.md` (hash, ficheros, los ocho ejercicios con sus destrezas y sus errores con nombre, lo visto en el navegador con las capturas, la propuesta de la tarea de clase, la propuesta de los ejercicios 9 y 10, cómo probarlo en 1 minuto) y su marcador `ENTREGA.md.ok-<sid>`.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 97, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-97.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/97--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/97--<sid>.md` con `parada por: mal cortada`
y la ruta de la incidencia, `ABANDONADA` en tu reclamo, y díselo al usuario. Si un paso te
pide **decidir** algo que va a durar (un cambio del contrato de la base, otro número de
ejercicios que el del catálogo, una colección nueva en Firestore) y esta tarea no es de
banda ALTA con el usuario delante, no lo decidas: entrégalo como propuesta en tu terminada
y sigue con lo que no dependa de ello.

## Al terminar

Por este orden (el del repositorio git):

1. `node --test tests/practicas-comun.test.js tests/practicas-registro.test.js tests/practicas-fichas-de-pablo.test.js`
   en verde y `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con reclamo vivo no
   es tuyo: anótalo en la terminada). Prueba la práctica en el navegador como dice «Cómo saber que ha
   terminado», con capturas.
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas:
   `git add <rutas> && git commit -m "Práctica fichas-de-pablo: <qué>" -- <rutas>`. Apunta el hash
   (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/97-fichas-de-pablo/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, lo visto en el navegador, la propuesta de la tarea de clase,
   cómo probarlo en 1 minuto) y su marcador vacío `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/97--<sid>.md`: hash del commit, ficheros (lo que dice
   `git show --stat`, no lo que crees), número de tests propios en verde, hora y
   **duración real** (de `abierto:` a ahora), y propuestas pendientes si las hay.
5. Añade `CERRADA` a tu reclamo (línea propia que empieza por esa palabra).
6. Choques encontrados → `$R/hechos/incidencias/<sid>.md`.
7. `git fetch origin`, relista `$R/hechos/` **ahora** y regenera `$R/_ESTADO.md` entero:
   todas las filas, el registro con una línea por fichero de `terminadas/`, banda y
   «encadenable» recopiadas de las fichas, leyenda de bandas de `proyecto.md`. Anota qué
   tareas pasan de BLOQUEADA a PENDIENTE. Si tu duración real difiere mucho de la estimada,
   díselo al usuario.
8. Vuelca abajo, en «Trampas conocidas» de esta ficha, lo que hayas aprendido por las
   malas (es lo único de la ficha que editas, además de la duración).
9. Un solo commit con rutas explícitas de tus ficheros de `$R/hechos/` (por sid), tu
   carpeta de `$R/salidas/`, `$R/_ESTADO.md` y esta ficha, y `git push origin main`. Si el
   push se rechaza: `git pull --rebase origin main`, regenera el tablón otra vez desde
   `hechos/` (no lo fusiones a mano) y vuelve a comitear y empujar.
10. Dile al usuario la **foto del momento** en tres líneas («EN CURSO: … · LIBRES ahora: … ·
    BLOQUEADAS: …»), sacada de la lectura de `hechos/` del paso 7, y después, **solo para las
    LIBRES**, las frases de arranque de `proyecto.md` literales, en bloques de cita, una por
    sesión que quepa a la vez, con la tarea o la cadena, la banda traducida y el nombre de
    sesión delante. Dile también qué tiene que hacer él: montar la tarea de clase en el panel
    con tu propuesta y probar la práctica con su código antes de llevarla al aula.
11. Decide si encadenas (solo en verde: misma banda, tarea corta, sin esperas) o paras. Si
    encadenas, «Antes de empezar» entero otra vez, con reclamo nuevo, y di el nombre nuevo que te toca.

Si paras sin terminar: `$R/hechos/fallos/97--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni
  `practicas/_comun/` (salvo la tarea 01 y lo declarado arriba), ni `css/estilos.css`, ni `README.md`
  (salvo 01, 18 y 71), ni `firestore.rules` ni `src/firebase.js` (salvo 01 y 71), ni fichas ajenas, ni
  nada de la carpeta de apuntes de iCloud. Si la base te falta algo, se propone en la
  terminada; no se parchea.
- `git add .`, `git add -A`, `git commit -a`, o un `add` separado del `commit`. El índice
  es compartido con otras sesiones del mismo árbol.
- Editar el código con `sed -i` o heredocs desde el shell: el candado de sesiones solo
  ve Edit/Write, y así otra sesión no sabe que el fichero está en uso. El código se edita
  con las herramientas de edición; `hechos/` sí se escribe desde el shell (un escritor).
- Reescribir un fichero de `hechos/` (solo `>>`), editar un reclamo ajeno, o regenerar el
  tablón de memoria sin relistar `hechos/`.
- Dependencias nuevas (npm, CDN): la app no tiene build y solo carga KaTeX y Firebase por
  CDN; las prácticas no usan ni siquiera KaTeX (exponentes con `<sup>`).
- Las reglas de contenido de `proyecto.md`: «factor» por «divisor», HCF en vez de GCD, `×`
  en vez de `·`, letras o ecuaciones, «primos entre sí» (se dice «su único divisor común es 1»),
  distractores que puedan ser verdad, excluir el 0 de los múltiplos, preguntar «múltiplo de 0».
