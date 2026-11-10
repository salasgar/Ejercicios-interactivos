# Tarea 154 · Práctica de la unidad 6 «Caza el error» (errores6)

Actualizado: 2026-11-10 (coordinadora de la U6 s-20261110T084200-3c26de2f, con el acta de la 02 de la U6, `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/6. Algebra/inventario-unidad6-revision.md`, F0 aún sin firmar ese día: «Reglas de contenido de la unidad 6» puestas al día con lo decidido —ningún id cambió; dos filas nuevas, `U6-2C-14` y `U6-3C-16`—, y lo que el acta resuelve de esta ficha: los errores que se cazan, de la columna `nota` del inventario aprobado; no simplificar **no** es un error que se caza (vale lo mismo); `x²` solo si es del valor numérico). Antes: 2026-11-03 (alta de la montadora del reparto de la unidad 6, s-20261103T140356-12629e13)
Precondición: 144 LISTA · mejor con la hoja y el examen de su semana ya LISTOS en el reparto de la U6 (toda la unidad: las cuatro hojas y los cuatro exámenes): si existen, excluye sus casos desde el principio (hoja en claro, examen por huella de la forma canónica); si no, dilo en la ENTREGA y lo coteja la tarea de publicación de tu semana · Disparo: MANUAL (sesión atendida) · **Plazo: sáb 16-1 (ideal); límite mar 26-1**
Duración esperada: 45 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/154-errores6/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/errores6/*` (sustituye el esqueleto que deja la 144: desde que la 144 está LISTA, la dueña de esa carpeta es esta tarea), `tests/practicas-errores6.test.js` (nuevo)

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
   printf 'sesión: %s\ntarea: 154\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/154--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/154--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 154 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/154--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Práctica **«Caza el error» / «Spot the mistake»** (`errores6`, id 78 del catálogo, 3 ejercicios) para la **unidad 6, Algebra**, que
empieza el lunes 1-2 (la primera unidad con letras). Semana 4 (toda la unidad). Tiene que estar LISTA antes del plazo de la tarea de publicación
de su semana (semana 1: **mié 27-1**; semana 2: **jue 4-2**; semana 3: **jue 11-2**; semana 4: **jue 18-2**), y mejor antes de Navidad.

Destrezas (descripción; los ids definitivos, en el inventario tras F0 y en la ENTREGA de la 144): los errores típicos de la unidad como resoluciones o reducciones con un paso mal: el signo al transponer, el factor que pasa restando, la distributiva, el m.c.m., los términos no semejantes, la respuesta que no es lo que pide el problema. El texto exacto
de cada una, su sesión y su nota (errores típicos y riesgos) están en el inventario: léelas antes de escribir nada.

**Es un diseño propuesto por la montadora (3-11) y aprobado en bloque por Juan Luis al pedir el alta; él puede cambiarlo.**
Si al hacerla ves que un ejercicio no se sostiene (dos respuestas correctas inevitables, algo de una sesión posterior, algo
que el acta del inventario dejó fuera), no lo cambies por tu cuenta: entrégalo como propuesta en la terminada y sigue con lo
demás. El número de ejercicios (3) está fijado en el catálogo por la 144; otro número también es propuesta.

Modelo de interfaz: `practicas/errores4/` (la U4, con huellas de examen) y `practicas/errores5/` si la 128 de la U5 ya cerró.

## Siguiente paso

1. Lee la ficha de la tarea 01 (§3, el contrato de `arrancar(practica)` y la `api` de `montar`), la `ENTREGA.md` de la 144 (`reparto-practicas-u2/salidas/144-base-unidad6/`) y el módulo que dejó: `practicas/_comun/algebra.js` (`Lineal`, `Ecuacion`, `deTexto`, `aTexto`, `aHtml`, `enPalabras`, `lecturasValidas`, `expandir`, `reducir`, `resolver`, `esSolucion`, `pasos`, `sinDenominadores`, `ERRORES_TIPICOS`, `FRASES`). **No lo reescribas**: si te falta algo, cópialo en tu `logica.js` y proponlo en la terminada.
2. Lee `practicas/plantilla/` entero y la práctica modelo que cita el Objetivo; `practicas/_comun/piezas.js` (`elecciones`, `claseCorreccion`: los cuatro estados tras comprobar) y cómo ocultan «Comprobar» al responder las prácticas de la U4 y la U5.
3. `ls practicas/errores6/`: la 144 dejó un esqueleto que carga y declara tus ejercicios. Sustitúyelo empezando por `logica.js` y su test, en verde; después `practica.js` (`montar`) y `textos.js`.
4. Mira si existen ya la hoja y el examen de tu semana en `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/6. Algebra/` (`hojas-de-ejercicios/hoja-unidad6-semanaN.tex`, `exámenes-semanales/semana-N/casos-examen-semanaN.tsv`): si sí, sus casos se excluyen desde el principio (regla 9).

## Qué hay que hacer

1. **¿Dónde está el error?** · *Where is the mistake?* Una resolución de tres o cuatro pasos con un paso mal (de `ERRORES_TIPICOS`, con los números del ítem): el alumno toca el paso equivocado. Un tercio de los ítems sin error («todo está bien»), para que no sea adivinar.
2. **¿Qué error es?** · *What went wrong?* La misma resolución y cuatro frases cortas con el nombre del error (`ERRORES_TIPICOS[nombre].{es,en}`): solo una verdadera; las otras tres son errores que **no** se han cometido y que darían otro resultado.
3. **Corrígelo** · *Fix it*. El alumno escribe la solución correcta (`leerFraccion`) o la expresión reducida correcta (`deTexto`); feedback con el paso corregido y la comprobación ✓.
4. **Para todos los ejercicios**: introducción con un ejemplo resuelto en los dos idiomas; el ítem en el idioma que le toque (la base alterna); «Comprobar» que se oculta al responder; los cuatro estados tras comprobar donde haya opciones; feedback con los números del ítem (el paso corregido); cada fallo pasado a `api.responder` con su `error` (el nombre del error típico) y la `respuesta` del alumno, para el registro de fallos. Los campos de expresión con `inputmode="text"` y lectura con `deTexto` (comparación por forma canónica); los de número, con `leerFraccion` o `leerNumero` según el caso.
5. **Test** `tests/practicas-errores6.test.js` (por fuerza bruta, 3000 ítems por ejercicio con semillas fijas): 
- Ej. 1: el paso marcado como erróneo no es equivalente al anterior (la función del error no devuelve `null`); los demás pasos, equivalentes.
- Ej. 2: las cuatro frases distintas y solo una describe el error cometido (cada error alternativo aplicado daría otra ecuación).
- Ej. 3: la respuesta correcta exacta; se acepta cualquier escritura equivalente.
- Ningún texto de alumno con `×`, con porcentajes, con `x²` fuera del valor numérico y de «¿es … solución?», con dos letras en una ecuación (salvo una propiedad con las mismas letras en los dos miembros), con `1x` ni con `+ −` (recorre los textos generados en los dos idiomas), ni con lo que el acta deja fuera (regla 2).
- Todo distractor distinto de la respuesta correcta **por forma canónica o por solución** y sacado de un error típico con nombre; ningún par de opciones equivalentes.
- Los casos de la hoja de la semana (en claro) y los del examen (por huella FNV-1a de la forma canónica, calculada fuera del repo) no salen nunca (si existen al escribirla).

## Datos de entrada

- El inventario de la unidad 6, solo lectura: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/6. Algebra/inventario-unidad6.tsv` (ids definitivos tras la firma F0 de su reparto; la ENTREGA de la 144 dice cuáles son los tuyos).
- Carpeta de la unidad (solo lectura): `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/6. Algebra/` — `secuenciación-unidad6.pdf` (qué se da en cada sesión), `inventario-unidad6-revision.md` (qué entra, la notación y las cotas), `../Repaso de todo/contenidos-unidad6.tex` (errores típicos) y las hojas y exámenes que existan (para no repetir sus casos).
- Material de otros cursos, por si sirve (no es obligatorio): la nota `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/6. Algebra/reparto-unidad6/hechos/notas/s-20261103T140356-12629e13-inventario-material-otros-cursos.md` (sus exámenes y hojas de ecuaciones; el apartado 5 es un banco de problemas de enunciado: cantera de contextos, con números nuevos).
- `practicas/_comun/*` y `practicas/plantilla/*`: solo lectura.

## Cómo saber que ha terminado

- `node --test tests/practicas-comun.test.js tests/practicas-errores6.test.js` en verde y `npm test` sin fallos en tus ficheros.
- En local (`npm run servir`), http://localhost:8080/practicas/errores6/ con «Probar sin código» (nunca el código de un alumno ni AJJN), a 375 px y en ventana ancha, en español y en inglés; en cada ejercicio, un ítem acertado y uno fallado, mirando el feedback. La práctica **no sale en la portada** (está con `disponible: false` hasta su tarea de publicación): se entra por la URL.

## Trampas conocidas

- `.cuenta` no se parte (`nowrap`): solo cuentas cortas; las frases del feedback van como texto normal o se salen de 375 px. Una ecuación larga (`5x − 4 = 3 − 2x + 7`) cabe en 375 px con la fuente de `.cuenta`; con fracciones (`htmlFraccion`) comprueba la altura.
- `-` y `−`, `*` y `·` se parecen: en los tests busca por código; lo que teclea el alumno pasa por `deTexto`, que los normaliza.
- Puede haber varias sesiones a la vez en este árbol (las prácticas 145-155 van en paralelo): no metas en tu commit nada que no sea tuyo, y nada de `git stash`. Si el `http.server` del 8080 de otra sesión se cae, levanta el tuyo en otro puerto y mátalo al acabar.
- El test compara **por forma canónica** (`Lineal.equals`) y por solución (`Ecuacion.equivalente`): dos opciones equivalentes con distinta escritura son un fallo del test, no un caso raro.
- (U4) Las prácticas se reabrieron en bloque el 28-10 y el 30-10 por copiar casos de las hojas y de los exámenes escritos después: excluye lo que exista al escribirla y deja la huella de examen lista para que la publicación solo tenga que cotejar.
- Duración real de una práctica de 4 ejercicios en la U4 sobre la base ya hecha: 11-30 min.

## Prohibido (propio de esta tarea)

- Tocar otras prácticas, la base (`practicas/_comun/`), `catalogo.js`, `portada.js`, `registro.js`, `tareas.js` o los docs: lo que haga falta ahí es propuesta en la terminada. `disponible: true` lo pone la tarea de publicación de su semana, no esta.
- Meter la práctica en una tarea semanal.
- Escribir casos de examen en claro en el repositorio (ni en tests, ni en comentarios, ni en la ENTREGA).

## Salida esperada

- `practicas/errores6/*` y `tests/practicas-errores6.test.js` comiteados, con `npm test` sin fallos en tus ficheros.
- `reparto-practicas-u2/salidas/154-errores6/ENTREGA.md` (hash, ficheros, los ejercicios y sus destrezas con id, las cotas de realismo que has fijado, qué casos de hoja/examen excluye y qué faltaba al escribirla, cómo probarlo en 1 minuto) y su marcador `ENTREGA.md.ok-<sid>`.

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
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 154, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-154.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/154--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/154--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/154-errores6/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cotas de realismo, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/154--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/154--<sid>.md` con hasta dónde llegaste, la línea
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
