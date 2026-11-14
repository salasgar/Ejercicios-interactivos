# Tarea 161 · Generadores `expresiones_algebraicas.js` y `ecuaciones_primer_grado.js` de la app principal al día con el inventario de la U6 (`items`, distractores = errores típicos, nunca opciones equivalentes, fracciones exactas)

Actualizado: 2026-11-10 (coordinadora de la U6 s-20261110T084200-3c26de2f, con el acta de la 02 de la U6, `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/6. Algebra/inventario-unidad6-revision.md`, F0 aún sin firmar ese día: «Reglas de contenido de la unidad 6» puestas al día con lo decidido —ningún id cambió; dos filas nuevas, `U6-2C-14` y `U6-3C-16`—, y lo que el acta resuelve de esta ficha: todo lo de la regla 2 ya decidido; `items` con los ids del inventario aprobado (80 filas; `U6-2C-14` nunca es ítem); la solución como fracción irreducible o su decimal exacto, las dos correctas; nunca un periódico (hoy `ecuaciones_primer_grado.js` redondea: eso es justo lo que hay que quitar)). Antes: 2026-11-03 (alta de la montadora del reparto de la unidad 6, s-20261103T140356-12629e13)
Precondición: F0 del reparto de la U6 firmada (ids definitivos) · no en paralelo con otra tarea que toque esos dos ficheros · Disparo: MANUAL (sesión atendida) · **Plazo: vie 22-1**
Duración esperada: 1 h 15 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/161-generadores-algebra/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `src/ejercicios/expresiones_algebraicas.js`, `src/ejercicios/ecuaciones_primer_grado.js` y sus tests (`tests/algebra-items.test.js`, nuevo si no existe; si ya hay un test que los cubra, ese)

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
   otras sesiones a medias no estorban porque tocan rutas distintas).
3. Abre tu reclamo generando el sid **en el mismo comando** (probado en este Mac):
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -d '+MINUTOS minutes' +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -v+MINUTOSM +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 161\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/161--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/161--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 161 con `abierto:` más antiguo (o igual y sid menor), añade a tu
   reclamo una línea `CEDIDA a <sid del otro>` y elige otra tarea.
5. Si el reclamo que encuentras está caducado (RELEVABLE en el tablón), relévalo con la
   línea `releva a: <sid anterior>` **en tu propio reclamo**; el suyo no se toca. Después
   mira qué dejó hecho: `ls practicas/`, `git log --oneline -5`, `git status -sb`, y la
   carpeta de salida. Lo que haya con tests en verde se hereda y se dice en la terminada;
   lo que no, se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** (todas las filas contra `hechos/` y la
   hora real; banda y «encadenable» recopiadas de las fichas) antes de empezar, y sigue
   con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.
   Si hay otras sesiones en el árbol (`.claude/sesiones/`), retoque de tus filas y del registro, no regeneración completa.
7. Idempotencia: comprueba si `practicas/<tu slug>/` o tu test ya existen (de una sesión
   caída) antes de crearlos. Si existen, léelos y continúa desde ahí.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/161--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Lo que la 112 fue para los generadores de fracciones y la 133 para `decimales.js`: que los dos generadores de álgebra de la app
principal (los ejercicios de la portada antigua, no las prácticas; ya existen: valor numérico, reducir, traducir «el doble de un
número más b», y ecuaciones `x ± a = b`, `ax = b`, `ax ± b = c`, `a(x ± b) = c`) citen las destrezas de la U6 con sus ids en `items`, que
cada distractor salga de un error típico del inventario (regla 4) y que **ninguna opción equivalga a otra** (forma canónica,
misma solución), con los coeficientes y las soluciones como fracciones exactas (hoy `ecuaciones_primer_grado.js` usa `redondear`
en coma flotante para la clave); y que respeten la regla de oro de `CLAUDE.md` (`construirOpciones` toma los tres primeros
distractores: barajar el pool antes). Lo que el inventario aprobado tenga y los generadores no (x en los dos miembros,
denominadores), se añade como tipo nuevo si cabe en la hora; si no, propuesta en la ENTREGA.

## Siguiente paso

Lee `src/ejercicios/expresiones_algebraicas.js` y `ecuaciones_primer_grado.js` enteros, `docs/coordinacion-unidad1.md` (el campo `items`), la ficha y la ENTREGA de la 112 (`salidas/112-generadores-fracciones/`) y de la 133 si cerró, y `tests/distractores.test.js` (lo que ya comprueba).

## Qué hay que hacer

1. Mapa de lo que generan hoy frente al inventario de la U6: qué destrezas cubren, con qué ids, qué no.
2. Corrige: `items` con ids de la U6; distractores desde errores típicos (sumar términos no semejantes, transponer sin signo, pasar un factor restando, distribuir solo al primer término…); filtro por equivalencia (nunca dos opciones con la misma forma canónica o la misma solución; nunca un distractor igual a la correcta); `redondear` fuera: fracciones exactas (una `Fraccion` mínima en el generador o la de `src/` si existe); la notación del acta en el `tex` (`3x`, `\dfrac{x}{2}`, `\cdot` solo entre números); cotas de realismo en «el doble de un número más b».
3. Test por fuerza bruta (3000 ítems por tipo con semilla fija): opciones no equivalentes, distractores con nombre, `items` válidos, textos sin `\times` ni porcentajes.
4. `npm test` sin fallos.

## Datos de entrada

- `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/6. Algebra/inventario-unidad6.tsv` (aprobado), `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/6. Algebra/inventario-unidad6-revision.md`; `src/ejercicios/expresiones_algebraicas.js`, `ecuaciones_primer_grado.js`, `src/ejercicios/index.js` (`construirOpciones`), `src/ejercicios/fracciones_*.js` (modelo de la 112).

## Cómo saber que ha terminado

`npm test` en verde; el test nuevo pasa con 3000 ítems por tipo; cada ejercicio de los dos generadores cita ids de la U6 en `items`.

## Trampas conocidas

- `construirOpciones` se planta en tres distractores: barajar el pool (`rng.barajar(pool).slice(0, 3)`), como dice `CLAUDE.md`; `tests/distractores.test.js` lo detecta.
- `ecuaciones_primer_grado.js` calcula la clave con `redondear(v)` (coma flotante): con soluciones fraccionarias dos claves distintas pueden redondear igual, o una fracción y su decimal parecer distintas; comparar por `Fraccion`.

## Prohibido (propio de esta tarea)

- Tocar otros generadores, `index.js` o las prácticas.

## Salida esperada

- Los dos generadores y su test comiteados con `npm test` en verde.
- `reparto-practicas-u2/salidas/161-generadores-algebra/ENTREGA.md` (hash, qué cubre cada ejercicio con sus ids, qué quedó fuera) y su marcador.

## Reglas de contenido de la unidad 6 (copia de `proyecto.md` de su reparto; lo común no se lee, por eso va aquí)

Las reglas 2-4 y 8-9 de la lista de la unidad 2 (signos `·` y `:`, inglés, regla de oro, feedback, realismo) valen igual.
La fuente es `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/6. Algebra/reparto-unidad6/proyecto.md` («Reglas de contenido comunes») y el acta
`/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/6. Algebra/inventario-unidad6-revision.md` (la tarea 02 de aquel reparto, **cerrada el 9/10-11-2026**:
lo que Juan Luis decidió de las letras, las sucesiones, las potencias de letras, el método, los casos sin solución, los
paréntesis, los denominadores, los problemas, la notación, las cotas y los ids; su apartado «Lo que cambia fuera de estos
ficheros», punto 12, es el de la app). **Si esta copia y el acta discrepan, manda el acta.** Copia puesta al día con el acta el
2026-11-10 por la coordinadora de la U6 `s-20261110T084200-3c26de2f` (F0 aún sin firmar ese día; **ningún id cambió** respecto a
la propuesta de la 01: hay dos filas nuevas, `U6-2C-14` y `U6-3C-16`, las dos `tipo_test = no`).

1. **Dos expresiones equivalentes son la misma respuesta, y dos ecuaciones con la misma solución también.** `2x + 3` y `3 + 2x`;
   `x/2`, `0,5x` y `x : 2`; `3 · x` y `3x`; `x + x` y `2x`; `2(x + 1)` y `2x + 2`; `x + 3 = 10` y `2x + 6 = 20`; y una solución `3/2`,
   `1,5` o `6/4`. En cualquier ejercicio de elegir, emparejar o verdadero/falso, ninguna opción puede equivaler a otra: el test lo
   comprueba **por forma canónica** (`a·x + b` con las fracciones exactas de `_comun/algebra.js`, nunca `Number` en coma flotante)
   y **por solución**. Solo si el ejercicio evalúa la forma escrita («¿cuál está reducida?», «la fracción irreducible», «escribe sin
   paréntesis») cuenta la escritura, y el enunciado lo dice; y en «¿es `x = 4` solución?» la ecuación es una sola (acta, n). Lo que
   teclea el alumno se lee con `deTexto` y se compara por forma canónica: `3 + 2x` vale como `2x + 3`.
   **Soluciones** (acta, g): la solución simplificada vale **como fracción irreducible o como su decimal exacto, las dos
   correctas** (`x = −3/2` o `x = −1,5`; `x = 1/4` o `x = 0,25`): el campo de respuesta acepta las dos; **una fracción sin
   simplificar** (`x = −21/14`) **la admite la clave** en la app (en el examen final, en cambio, resta una parte: no es cosa de la
   app); **un periódico con puntos suspensivos, nunca** (`x = 1/3`, no `0,333…`; ni como solución que se muestra ni como opción);
   y en un ejercicio de elegir, **nunca dos opciones con el mismo valor** (`1/4`, `3/12` y `0,25` son la misma respuesta): **no
   simplificar nunca es un distractor** (`U6-2C-11`). `0,33` no es `1/3` (es su redondeo): nunca equivalen.
2. **Nada que no se haya dado**: cada ejercicio respeta la columna `sesion` de sus destrezas en el inventario aprobado (semana 1:
   traducir, la letra, valor numérico, sucesiones, términos semejantes; semana 2: ecuación y solución, identidad, la balanza, la
   transposición, una y dos operaciones, `12x = 3`, negativas, problemas de dos pasos desde la sesión 7; semana 3: `x` en los dos
   miembros, solución 0, ninguna o infinitas, paréntesis, denominadores, coeficientes decimales; semana 4: problemas). **Ni
   porcentajes ni proporcionalidad** (U7), ni geometría con fórmula ni áreas (U8), **ni ecuaciones de segundo grado que haya que
   resolver, sistemas, inecuaciones ni dos incógnitas** (la `y` nunca como segunda incógnita), **ni sacar factor común** (2.º ESO),
   ni el producto de dos paréntesis, ni `x` en el denominador, ni `½x` como coeficiente (los fraccionarios, solo `x/2` o `3x/4`).
   Lo que la 02 decidió (acta, puntos c, d, f, h, i, j):
   - **`x²` solo en el valor numérico** (`U6-1C-09`: `2x²` con `x = 3` es 18) **y en «¿es … solución?»** (`U6-2C-02`: ¿es `x = −3`
     solución de `x² + x = 6`?). **Nunca** una ecuación de segundo grado que resolver, nunca `x²` al reducir. `x · x = x²` se
     nombra (`U6-1C-15`) sin operar con `x²`. Es opcional: una práctica sin `x²` cumple.
   - **La raíz de `x² = 16`** (`U6-2C-14`): se explica en clase, **no es ejercicio de la app** (ni de ningún examen).
   - **Sucesiones**: los términos de `2n + 1` (`U6-1C-10`), «¿qué término vale 31?» como ecuación (`U6-2A-04`); el término
     general de un patrón, solo como reto (`U6-1C-11`). Sin hoja de cálculo.
   - **`ax = b` con `a` o `b` nulos**: sí, desde la sesión 9, no nucleares: solución 0 (`U6-3C-03`), sin solución e infinitas
     (`U6-3C-04`), con *this equation has no solution* / *it has infinitely many solutions* (`U6-3B-02`).
   - **Paréntesis**: con un número delante, también negativo; con un signo menos delante; en los dos miembros; con dos términos con
     `x` dentro. **Paréntesis dentro de paréntesis, solo si es reto** (`U6-3C-16`: `2[x − (3 − x)] = 10`, `x = 4`), marcado como tal.
   - **Denominadores**: hasta tres fracciones con numerador `x` o `ax`, y fracciones sin `x`, en uno o en los dos miembros, con el
     m.c.m. de dos o tres números hasta 30. **Numeradores con paréntesis, solo como reto** (`U6-3C-14`).
   - **Soluciones y coeficientes**: negativas desde la sesión 6; fraccionarias desde la 7; coeficientes enteros negativos desde
     la 6 (`−2x = 8`, `−x = 7`); decimales de una cifra solo en `U6-3C-15` (sesión 11, no nuclear: `1,2x − 4 = −0,8x`).
   Se saben la jerarquía (U1), el m.c.m. (U2), los enteros (U3), las fracciones (U4) y los decimales (U5). De la U5, en la U6
   (acta, a): los céntimos en los problemas de dinero; euros-céntimos en el de monedas; los decimales negativos, solo como
   coeficientes, nunca en un problema; los demás cambios de unidad, en ninguno.
3. **Notación** (acta, p): coeficiente delante y pegado (`3x`, `−2x`), `x` por `1x`, `·` solo entre números, la división con
   letras como fracción (`htmlFraccion` de `fracciones.js` con `x` en el numerador; en texto, `x/2`); **`x : 2 = 5` solo una vez,
   en la sesión 6, como lo mismo que `x/2 = 5`: en la app, mejor nunca, y jamás enfrentados en las opciones**; `3(x − 2)` sin
   punto; la solución «`x = 7`», nunca «`7 = x`»; en inglés `2x` se lee *two x* (o *twice x*), `x/2` *x over two* o *half of x*;
   *solve for x*, *both sides*, *like terms*, *expand the brackets*, *clear the fractions*, *check*. Las soluciones explicadas
   nombran las dos ideas («restamos 3 en los dos miembros; es decir, el 3 pasa restando»; *subtract 3 from both sides*; acta, e).
   Letras (acta, b): `x` casi siempre; `n` en las sucesiones; otra letra solo cuando el enunciado la define (`2a + 3b`). El dinero,
   con coma en español y punto en inglés, sin separador de millares (acta de la U5, punto m); las impropias, sin mixtos (punto g). El
   alumno puede teclear `2x+3`, `3+2x`, `2·x + 3`, `2*x+3` o `x/2`: `deTexto` los acepta todos; nunca `eval`.
4. **Regla de oro**: todo distractor, inequívocamente falso, y cada distractor sale de un **error típico** de la columna `nota`
   del inventario, calculado con los números del ítem y comprobado en el test (nunca un número al azar): sumar términos no
   semejantes (`3x + 2 = 5x`); `x · x = 2x`; yuxtaponer al sustituir (`3x` con `x = 4` → 34); transponer sin cambiar el signo
   (`x + 3 = 10 → x = 13`); pasar un factor restando (`3x = 12 → x = 9`); multiplicar en vez de dividir; invertir `12x = 3 → x = 4`;
   distribuir solo al primer término (`3(x − 2) = 3x − 2`); el signo menos delante del paréntesis (`−(x − 2) = −x − 2`); multiplicar
   por el m.c.m. solo los términos con denominador; contestar `x` cuando el problema pide otra cosa; traducir «tres menos que un
   número» como `3 − x`. Los generadores de estos valores están en `_comun/algebra.js` (`ERRORES_TIPICOS`): úsalos, y **cada
   función dice cuándo no sirve** (devuelve `null` cuando el error da lo mismo que la respuesta). **Lo que no es un error**: `x · 3`
   por `3x`, `1x` por `x`, el decimal exacto por la fracción irreducible, una solución sin simplificar (regla 1).
5. **Parejas válidas, que nunca se enfrentan**: *brackets* / *parentheses*; *solve* / *work out*; *twice* / *double*; *like terms* /
   *similar terms*; *both sides* / *each side*; `x : 2` / `x/2`; una fracción irreducible y su decimal exacto; una expresión y
   cualquier reordenación suya; dos ecuaciones equivalentes. «Cinco veces más que» no se usa (es ambiguo); en inglés, *five times as
   many as* (acta, o).
6. **Inglés sencillo**; la palabra no matemática que decide la respuesta se aclara entre paréntesis (*twice* (el doble), *three less
   than* (tres menos que), *consecutive* (seguidos), *altogether* (en total), *each* (cada uno), *in three years' time* (dentro de tres
   años)), salvo que sea justo lo que se evalúa. **El enunciado en inglés no puede ser ambiguo**: *twice a number, plus five*
   (`2x + 5`) frente a *twice the sum of a number and five* (`2(x + 5)`).
7. **Realismo** (regla de Juan Luis del 16-10): la situación tiene que ser posible y **todos** los números que pueda sacar el
   generador, creíbles, con **una cota por contexto que el test comprueba** (un `assert` en cada generador, como
   `src/ejercicios/contextos_mcd_mcm.js`). **Cotas aprobadas en la 02** (acta, «Cotas de realismo aprobadas»; si discrepan, manda el
   acta): edades de 1 a 100 (un alumno 6-18, un padre o una madre 25-60, un abuelo 55-95; la diferencia padre-hijo entre 18 y 50;
   «dentro de n años» y «hace n años» con n de 1 a 20 y nadie con edad negativa); números («pienso un número», consecutivos, un
   número y su doble: enteros de −50 a 200; en «pares consecutivos», `x` par); cantidades de cosas (caramelos, canicas, cromos,
   lápices, pulseras: 1-200; una clase 12-36 personas; un instituto 200-3000; un equipo 5-25); monedas (de 1 céntimo a 2 €, hasta
   50 monedas); dinero (la paga 1-50 €; ahorros hasta 2000 €; un producto 0,20-30 €, fruta 0,80-6 €/kg, una prenda 5-120 €, un
   móvil 80-1200 €, una entrada 3-60 €, gasolina 1,20-2,00 €/L, pagar con un billete de 5, 10, 20 o 50 € que cubra el total, una
   cena 10-200 € entre 2 y 30 personas que salga exacta…); perímetros descritos con palabras (lados de 1 a 50; nunca con fórmula ni
   áreas). **El dinero, siempre con dos decimales en el enunciado** (`12,00 €`; en inglés `12.00`), y en la respuesta del alumno
   valen `12` y `12,00` (acta, o); nunca céntimos en un reparto que no salga exacto. **La solución de un problema es un natural
   (o dinero con dos decimales)**: nunca una edad fraccionaria, un número negativo de personas ni 7,5 caramelos. **Contextos de la
   app** (acta, o): «pienso un número», consecutivos, repartos «el doble y n más» y edades de un paso, generados eligiendo primero
   la solución (como su Excel); los de edades con tabla, monedas, cabezas y patas, «cuántos tiene que darle» y el jardín son del
   papel. Sin mezclas ni movimiento, sin fracciones de una cantidad de más de un paso. Los personajes llevan nombres inventados (no
   de alumnos reales).
8. **Feedback ligado al error**, con los números del ítem («`x + 3 = 10`: al pasar el 3 al otro lado cambia de signo: `x = 10 − 3 =
   7`»), no una regla genérica. Frase sencilla antes que caso límite.
9. **Casos fijos** (frases, contextos, números) que no copien los de las hojas, los exámenes semanales ni el examen final de la
   unidad 6 (en `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/6. Algebra/hojas-de-ejercicios/`, `exámenes-semanales/`, `examen-final/`): los alumnos los verán en papel. **Los casos de
   las hojas se excluyen en claro; los de los exámenes, por huella FNV-1a calculada fuera del repositorio, nunca en claro** (regla de
   PU2 del 30-10; modelo: `practicas/equivalentes/logica.js` y `tests/practicas-equivalentes.test.js` tras el commit b0e4cfd, y la
   reabierta `hechos/reabiertas/100--s-20261030T081542-dab2aa98-revision.md`). Con álgebra, la huella se calcula sobre la **forma
   canónica** de la ecuación o la expresión (coeficientes como fracciones irreducibles, en un orden fijo), no sobre el texto. Si al
   reclamar la hoja o el examen de tu semana no existen aún, dilo en la ENTREGA: la tarea de publicación de tu semana coteja y
   reabre si hace falta.
10. **Aritmética exacta**: los coeficientes y las soluciones son `Fraccion` de `_comun/fracciones.js` (o enteros); nunca se compara
    ni se muestra con `Number` en coma flotante; nunca `eval` sobre lo que teclea el alumno. Los tests lo comprueban contra
    `BigInt` o aritmética entera propia.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 161, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-161.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/161--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/161--<sid>.md` con `parada por: mal cortada`
y la ruta de la incidencia, `ABANDONADA` en tu reclamo, y díselo al usuario. Si un paso te
pide **decidir** algo que va a durar (un cambio del contrato de la base, otro número de
ejercicios que el del catálogo, una colección nueva en Firestore) y esta tarea no es de
banda ALTA con el usuario delante, no lo decidas: entrégalo como propuesta en tu terminada
y sigue con lo que no dependa de ello.

## Al terminar

Por este orden (el del repositorio git):

1. `node --test tests/practicas-comun.test.js tests/practicas-<tu slug>.test.js` en verde y
   `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con reclamo vivo no
   es tuyo: anótalo en la terminada). Prueba la práctica en el navegador con
   `npm run servir` y http://localhost:8080/practicas/<slug>/ (los módulos ES no cargan
   abriendo el fichero), en una ventana estrecha (375 px) y en una ancha, en español y en
   inglés, y haz al menos un ítem de cada ejercicio acertando y fallando.
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas:
   `git add <rutas> && git commit -m "<qué>" -- <rutas>`. Apunta el hash
   (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/161-generadores-algebra/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cotas de realismo, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/161--<sid>.md`: hash del commit, ficheros (lo que dice
   `git show --stat`, no lo que crees), número de tests propios en verde, hora y
   **duración real** (de `abierto:` a ahora), y propuestas pendientes si las hay.
5. Añade `CERRADA` a tu reclamo (línea propia que empieza por esa palabra).
6. Choques encontrados → `$R/hechos/incidencias/<sid>.md`.
7. `git fetch origin`, relista `$R/hechos/` **ahora** y regenera `$R/_ESTADO.md` (entero si
   no hay otras sesiones en el árbol; si las hay, retoque de tus filas y del registro):
   banda y «encadenable» recopiadas de las fichas, leyenda de bandas de `proyecto.md`. Anota qué
   tareas pasan de BLOQUEADA a PENDIENTE. Si tu duración real difiere mucho de la estimada,
   díselo al usuario.
8. Vuelca abajo, en «Trampas conocidas» de esta ficha, lo que hayas aprendido por las
   malas (es lo único de la ficha que editas, además de la duración).
9. Un solo commit con rutas explícitas de tus ficheros de `$R/hechos/` (por sid), tu
   carpeta de `$R/salidas/`, `$R/_ESTADO.md` y esta ficha, y `git push origin main`. Si el
   push se rechaza: `git pull --rebase origin main`, regenera el tablón otra vez desde
   `hechos/` (no lo fusiones a mano) y vuelve a comitear y empujar. **Nunca si `main` lleva
   commits ajenos sin empujar**: incidencia y díselo al usuario.
10. Dile al usuario la **foto del momento** en tres líneas («EN CURSO: … · LIBRES ahora: … ·
    BLOQUEADAS: …»), sacada de la lectura de `hechos/` del paso 7, y después, **solo para las
    LIBRES**, las frases de arranque de `proyecto.md` literales, en bloques de cita, una por
    sesión que quepa a la vez, con la tarea o la cadena, la banda traducida y el nombre de
    sesión delante.
11. Decide si encadenas (solo en verde: misma banda, tarea corta, sin esperas; si tu frase
    de arranque nombra la cadena, encadenas por defecto) o paras. Si encadenas, «Antes de
    empezar» entero otra vez, con reclamo nuevo, y di el nombre nuevo que te toca.

Si paras sin terminar: `$R/hechos/fallos/161--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni
  `practicas/_comun/` (salvo la tarea 01; en cada unidad, su base y sus tareas de publicación; cada una en lo que declara), ni `css/estilos.css`, ni `README.md` (salvo
  01 y 18), ni `firestore.rules` ni `src/firebase.js` (salvo 01), ni fichas ajenas, ni
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
  CDN; las prácticas no usan ni siquiera KaTeX (exponentes con `<sup>`; las fracciones con
  `htmlFraccion`).
- Las reglas de contenido de la unidad 6 (en esta ficha y en `proyecto.md` de su reparto): `×` en vez de `·`, porcentajes,
  proporcionalidad, segundo grado, sistemas, dos incógnitas; `eval` o coma flotante; lo que el acta deja fuera (`x²` en una ecuación que resolver o al reducir, `U6-2C-14`, `x` en el denominador, sacar factor común, el producto de dos paréntesis, un reto fuera de un ítem marcado como reto) o algo de una sesión posterior a la de la destreza; distractores que puedan ser
  verdad, y en especial **dos opciones equivalentes** (`2x + 3` y `3 + 2x`; dos ecuaciones con la misma solución), que son dos
  respuestas correctas; casos de examen en claro en el repositorio.

## Trampas conocidas (al cerrar, 2026-11-14)

- `ecuaciones_primer_grado.js` importa los racionales (`Q`, `qSuma`…) y los términos (`tX`, `tN`, `tP`, `texTerminos`) de `expresiones_algebraicas.js`: no tocar sus firmas sin mirar el otro fichero.
- `distractores.test.js` exige que todo error declarado **llegue a salir** con `concepto`: un error que solo es relleno (como `resta_al_reves`) tiene que salir alguna vez en 3000 ítems, o se quita de la tabla.
- Un distractor con paso `mal` necesita una línea que termine en `= valor` (`ejercicios.test.js`): en las traducciones, que no tienen cuenta, la línea es una derivación o una igualdad con ella misma (`x + 2 = x + 2`).
- El `\cdot` nunca va junto a la `x` (`x \cdot 2`): el test nuevo lo comprueba en todo lo que se pinta, también en los pasos de los distractores.
- No hay contextos: no hay cotas de realismo ni casos de hoja o examen que excluir; si algún día entra un generador de problemas, será otra tarea con sus cotas.
