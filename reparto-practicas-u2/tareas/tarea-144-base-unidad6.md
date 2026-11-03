# Tarea 144 · Base de la unidad 6: catálogo, portada, destrezas y `_comun/algebra.js` (expresiones lineales y ecuaciones con fracciones exactas, lecturas, errores típicos)

Actualizado: 2026-11-03 (alta de la montadora del reparto de la unidad 6, s-20261103T140356-12629e13)
Precondición: tarea 01 del reparto de la unidad 6 LISTA (existe la propuesta de inventario `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/6. Algebra/inventario-unidad6.tsv`; con F0 firmada, mejor: ids definitivos) · no en paralelo con otra tarea que toque `catalogo.js`, `portada.js` o `registro.js` (122 de la U5, 134 de la ortografía, 119/120 si siguen EN CURSO) · Disparo: MANUAL (sesión atendida) · **Plazo: mar 8-12 (ideal; las once prácticas van detrás y la semana 1 se publica antes del mié 27-1); límite vie 8-1**
Duración esperada: 1 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/144-base-unidad6/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/algebra.js` (nuevo), `practicas/_comun/catalogo.js` (once filas y la unidad 6 en `UNIDADES`), `practicas/portada.js` (bloques y descripciones de la U6), `practicas/_comun/registro.js` (`DESTREZAS` de la U6), `practicas/<slug>/` de los once slugs (solo el esqueleto), `docs/practicas-unidad6.md` (nuevo, §7), `tests/practicas-algebra.test.js` (nuevo), `tests/practicas-comun.test.js` (lista del catálogo), `tests/practicas-semana.test.js` (el test de los bloques), `tests/practicas-registro.test.js` (leer también la tabla de la U6), `tests/practicas-editor.test.js` (`tareasPorUnidad` cuenta las unidades) y `tests/practicas-espacio.test.js` (`unidadesCon`: lección de la 98)

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
   printf 'sesión: %s\ntarea: 144\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/144--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/144--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 144 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/144--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Preparar lo común para las once prácticas de la **unidad 6, Algebra** (tareas 145-155), de forma que ninguna de ellas
tenga que escribir en un fichero común y puedan ir las once en paralelo (lección del 8-10: «un fichero común con candado no
se reparte entre sesiones en paralelo»). Es lo que la 98 fue para la unidad 4 y la 122 para la 5: léelas y lee sus ENTREGA.

El catálogo de la unidad 6 (diseño de la montadora del 3-11; Juan Luis puede cambiarlo):

| id | slug | nombre (es / en) | nEjercicios | semana (bloque de la portada) | destrezas (descripción; ids tras F0) |
|---|---|---|---|---|---|
| 69 | `traduce` | Del enunciado al álgebra / From words to algebra | 4 | 1 | traducir una frase a una expresión (el doble, la mitad, tres más que, tres menos que, el siguiente, consecutivos) y una expresión a una frase; situaciones (un plan de 5 € al mes más 2 € por giga: `5 + 2g`); si el acta las admite, sucesiones (`2n + 1`) |
| 70 | `valor-numerico` | Valor numérico / Evaluate | 3 | 1 | sustituir un valor (natural, entero, fracción sencilla según el acta) en `ax + b`, `a(x ± b)` y, si el acta lo admite, `x² ± c`; completar una tabla de valores; «¿para qué valor vale…?» (tanteo, preludio de la ecuación, solo si el acta lo admite) |
| 71 | `terminos-semejantes` | Términos semejantes / Like terms | 4 | 1 | ¿son semejantes?; reducir (`5x + 2x − 3x`, `7x + 2y − 3x + y`); coeficiente y parte literal; cazar el error (`3x + 2 = 5x`, `x · x = 2x`) |
| 72 | `es-solucion` | ¿Es solución? / Is it a solution? | 4 | 2 | comprobar sustituyendo; ¿qué ecuación tiene solución 5? (opciones con soluciones distintas); identidad o ecuación (si el acta); escribe una ecuación con solución dada (campo libre: cualquier ecuación válida) |
| 73 | `transposicion` | Pasa al otro lado / Move it across | 5 | 2 | los cuatro niveles del guión con números (`3 + 2 = 5 → 3 = 5 − □`; `3 · 2 = 6 → 3 = 6 : □`; bidireccional; con jerarquía); ecuaciones de una operación; de dos operaciones paso a paso; `3x = 12` frente a `12x = 3` (fracción irreducible) |
| 74 | `resuelve` | Resuelve / Solve it | 4 | 3 | `x` en los dos miembros sin paréntesis ni denominadores: elegir el paso siguiente correcto; escribir la solución (negativa o fracción); ¿cuál es el primer paso?; comprobar |
| 75 | `parentesis-algebra` | Paréntesis / Brackets | 4 | 3 | quitar paréntesis (`3(x − 2)`, `−(x − 2)`, `−2(3 − x)` con enteros); elegir el desarrollo correcto; resolver con paréntesis; cazar el error (`3(x − 2) = 3x − 2`) |
| 76 | `denominadores` | Quita denominadores / Clear the fractions | 4 | 3 | el m.c.m. por el que hay que multiplicar; elegir la ecuación equivalente sin denominadores; resolver `x/2 + x/3 = 5`; `x/7 = 24/7` |
| 77 | `problemas-ecuaciones` | Problemas con ecuaciones / Word problems | 5 | 4 | qué es `x`; qué ecuación plantea el problema (opciones no equivalentes); resolver y contestar (campo); interpretar (¿qué pide: la edad de la hermana, no `x`?); ¿tiene sentido la solución? (7,5 personas) |
| 78 | `errores6` | Caza el error / Spot the mistake | 3 | 4 (toda la unidad) | los errores típicos de la unidad como resoluciones con un paso mal (el signo al transponer, el factor que pasa restando, la distributiva, el m.c.m., los términos no semejantes) |
| 79 | `leelo6` | Léelo en inglés / Say it in English | 4 | toda la unidad | vocabulario: unknown, like terms, coefficient, solve for x, both sides, twice, three more than, consecutive, equation, solution, check, brackets, expand; leer `2x + 3` (*two x plus three*) y `x/2` (*x over two*); las consignas de examen |

Sin práctica, a propósito: la lectura en voz alta (va a `leelo6`), las sucesiones como práctica propia (si el acta las admite, van
como ejercicio dentro de `traduce` y de `es-solucion`), y lo que el acta deje fuera (`x²`, casos sin solución, `x` en el
denominador: si entran, se proponen en la ENTREGA como ejercicio extra de la práctica que toque, no como práctica nueva). Si el
§7 de `docs/practicas-unidad6.md` reparte las destrezas de otra manera, el §7 manda y esta tabla se corrige en la ENTREGA.

## Siguiente paso

1. Lee la ficha de la tarea 98 (`tareas/tarea-98-base-unidad4.md`) y su `salidas/98-base-unidad4/ENTREGA.md`, y la ficha y la ENTREGA de la 122 (`salidas/122-base-unidad5/`) si ya cerró: son el molde exacto (esqueletos, bloques, `DESTREZAS`, docs §7, tests, trampas de `UNIDADES`). Lee `practicas/_comun/fracciones.js` (`Fraccion`, `htmlFraccion`, `leerFraccion`: los coeficientes y las soluciones son fracciones exactas y se apoyan en él), `practicas/_comun/aritmetica.js` (`mcd`, `mcm`) y `practicas/_comun/piezas.js` (`leerNumero` solo lee naturales: no se toca; la expresión se lee aparte).
2. Lee `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/6. Algebra/inventario-unidad6.tsv` (la propuesta de la 01, o el aprobado si la 02 ya cerró) y, si existe, el acta `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/6. Algebra/inventario-unidad6-revision.md` (qué entra, la notación y los ids que cambiaron): de ahí salen los ids de cada práctica.
3. `git status` y `git log --oneline -3 -- practicas/_comun/ practicas/portada.js`: si hay cambios sin commit en esos ficheros que no son tuyos, no los pises y avisa. Mira `.claude/sesiones/` por si otra sesión tiene reservado `catalogo.js` (la 134 de la ortografía y la 122 de la U5 lo tocan estas semanas).

## Qué hay que hacer

1. **`practicas/_comun/algebra.js`** (nuevo, puro, sin DOM), con su test `tests/practicas-algebra.test.js`: una **expresión lineal** inmutable `Lineal(a, b)` (`a·x + b` con `a` y `b` enteros o `Fraccion` de `fracciones.js`; una letra, por defecto `x`, configurable para `n` y las que admita el acta), con `canonica()`, `equals(otra)` (por forma canónica), `evaluar(valor)` (exacto, `Fraccion`), `sumar`, `restar`, `porNumero`, `expandir(k, expr)` (`k(ax + b)` → `kax + kb`, también con `k` negativo), `reducir(terminos)` (lista de monomios de grado 0 y 1 → canónica, y la lista de pasos para el feedback), `aTexto(idioma)` (la notación de la regla 3: `3x + 2`, `−x`, `x/2` como texto, sin `1x`, sin `+ −`), `aHtml()` (con `htmlFraccion` para los coeficientes fraccionarios, `x` en cursiva), `enPalabras(idioma)` (*two x plus three*; español: *dos equis más tres*) y `lecturasValidas(idioma)` (*twice x*, *x over two* / *half of x*); `deTexto(texto)` → `Lineal` o `null` (acepta `2x+3`, `3 + 2x`, `2·x+3`, `2*x+3`, `-x`, `x/2`, `3x/4`, `(x+1)` no; rechaza vacío, basura, dos letras, `x²`; **nunca `eval`**); una **ecuación** `Ecuacion(izq, der)` (dos `Lineal`) con `resolver()` (→ `Fraccion`, o `{ tipo: 'ninguna' | 'infinitas' }` para los casos `0x = b` y `0x = 0`, que solo se usan si el acta los admite), `esSolucion(valor)` (sustituyendo en los dos miembros originales), `equivalente(otra)` (misma solución), `pasos()` (la lista de ecuaciones equivalentes del método: agrupar, transponer, dividir; para «elige el paso siguiente» y el feedback), `sinDenominadores(mcm)` y `aTexto`/`aHtml`; **los errores típicos** de la regla 4, cada uno como función con nombre que da el resultado equivocado (`sumarNoSemejantes`, `xPorXDosX`, `yuxtaponerAlSustituir`, `saltarseJerarquia`, `transponerSinSigno`, `pasarFactorRestando`, `multiplicarEnVezDeDividir`, `invertirCoeficiente`, `distribuirSoloPrimero`, `signoMenosParentesis`, `mcmSoloDenominadores`, `contestarXEnVezDeLoPedido`, `tresMenosQueAlReves`…) y una tabla `ERRORES_TIPICOS` con su nombre `{ es, en }` en frase corta; cada función devuelve `null` si da lo mismo que la respuesta correcta. Y una **tabla de traducción** `FRASES` (español e inglés, con las glosas) de las construcciones del hilo A: el doble, la mitad, el triple, `n` más que, `n` menos que, el siguiente, el anterior, dos consecutivos, un número y su doble, el doble de un número más `n` frente a el doble de la suma (*twice a number, plus five* / *twice the sum of a number and five*): cada entrada con su `Lineal` y sus distractores típicos.
2. **Test** de `algebra.js`: contra una tabla de 40 casos calculados a mano y contra aritmética entera propia (`BigInt`) en 3000 casos aleatorios (canónica, evaluar, expandir, reducir, resolver, `esSolucion` con la solución y con un valor equivocado); `equals` por forma canónica (`2x + 3` = `3 + 2x`; `x/2` = `½x`); `deTexto` y `enPalabras` con tabla (los dos idiomas, todas las escrituras aceptadas, rechazos); cada error típico distinto del correcto cuando no devuelve `null`; `FRASES` sin dos entradas con el mismo `Lineal`.
3. **Catálogo** (`practicas/_comun/catalogo.js`): las once filas de la tabla de arriba, `unidad: 6`, **`disponible: false`**, en ese orden, después de las filas de la U5 (57-63) y de la ortografía (64-68, tarea 134) y antes de la plantilla; los ids 69-79 están libres (acuerdo del 3-11 entre las dos coordinadoras: la ortografía toma 64-68). Y en `UNIDADES`, `{ n: 6, desde: '2027-02-01', titulo: { es: 'Álgebra', en: 'Algebra' } }`. **Añadir una unidad rompe dos tests más** (lección de la 98): `tareasPorUnidad` en `tests/practicas-editor.test.js` y `unidadesCon` en `tests/practicas-espacio.test.js`: ajústalos.
4. **Un esqueleto por práctica**: `practicas/<slug>/` para los once slugs, copia mínima de `practicas/plantilla/` que carga y declara su `slug` y sus `nEjercicios` (un test de `tests/practicas-semana.test.js` carga el `practica.js` de cada fila del catálogo). **Desde que esta tarea esté LISTA, cada carpeta es de su tarea (145-155)**; escríbelo en la ENTREGA.
5. **Portada** (`practicas/portada.js`): cinco bloques de la unidad 6, `unidad: 6`: «Semana 1 · El lenguaje algebraico» / «Week 1 · Algebraic language»: `traduce`, `valor-numerico`, `terminos-semejantes`; «Semana 2 · Las ecuaciones» / «Week 2 · Equations»: `es-solucion`, `transposicion`; «Semana 3 · Ecuaciones con paréntesis y denominadores» / «Week 3 · Brackets and fractions»: `resuelve`, `parentesis-algebra`, `denominadores`; «Semana 4 · Problemas» / «Week 4 · Word problems»: `problemas-ecuaciones`; «Para toda la unidad · Errores y vocabulario» / «For the whole unit · Mistakes and vocabulary»: `errores6`, `leelo6`. Y una línea de `DESCRIPCION` por práctica, en los dos idiomas, sacada de la ficha de su tarea. Ajusta los tests de `tests/practicas-semana.test.js` que fijen los bloques por unidad (los de la U2-U5 y la sección «Ortografía» de la 134 se conservan tal cual).
6. **Destrezas** (`practicas/_comun/registro.js`, `DESTREZAS`): las de la unidad 6 con los ids completos (`U6-1C-03`…), y **`docs/practicas-unidad6.md`** con su §7 («Qué práctica cubre qué destreza de la unidad 6», mismas columnas que el de la unidad 4, una fila por destreza del inventario, también las que no tienen práctica); cambia `tests/practicas-registro.test.js` para que lea también la tabla de la U6. El resto del documento lo escribe la 159; deja los apartados con «por escribir (tarea 159)». Si al cerrar F0 sigue sin firma, los ids son los de la propuesta: dilo en la ENTREGA y la 156 lo comprueba antes de publicar.
7. **`tests/practicas-comun.test.js`**: la lista del catálogo con las once filas nuevas (es el test que fija ids, slugs y número de ejercicios).

## Datos de entrada

- El inventario de la unidad 6 (propuesta de la 01 o aprobado tras la 02), solo lectura: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/6. Algebra/inventario-unidad6.tsv`; el acta `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/6. Algebra/inventario-unidad6-revision.md` (léela entera si existe); la secuenciación `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/6. Algebra/secuenciación-unidad6.pdf`; `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/6. Algebra/reparto-unidad6/proyecto.md` (reglas de contenido, notación y cotas).
- `reparto-practicas-u2/tareas/tarea-145-…` a `tarea-155-…`: lo que cada práctica va a pedir a `algebra.js` (léelas por encima antes de fijar la API).
- `tareas/tarea-98-base-unidad4.md`, `salidas/98-base-unidad4/ENTREGA.md`, `tareas/tarea-122-base-unidad5.md` y su ENTREGA si existe, `practicas/_comun/fracciones.js`, `aritmetica.js`, `docs/practicas-unidad4.md`: el molde. Si la 122 dejó `_comun/decimales.js`, reutilízalo para el dinero en los problemas (no lo reescribas).

## Cómo saber que ha terminado

- `npm test` sin fallos (el árbol entero: con el esqueleto, todas las filas cargan).
- `node --test tests/practicas-algebra.test.js` en verde, con la tabla a mano y los 3000 casos.
- En local (`npm run servir`), la portada no enseña nada nuevo (todo `disponible: false`; la U6 no llega hasta el 1-2), y una página de prueba tuya (no comiteada) pinta una expresión con `aHtml()` y lee lo que se teclea con `deTexto` a 375 px.

## Trampas conocidas

- **La unidad 6 no aparece en la portada hasta el 1-2** (`UNIDADES.desde`): para verla antes en local, pásale a `unidadActual` una fecha de prueba o mira `bloquesPublicados(CATALOGO, 6)` en la consola.
- Si otra sesión tiene reservado `catalogo.js` (122, 134, 119, 120 o una de Juan Luis fuera del reparto), espera o haz antes todo lo demás (`algebra.js`, esqueletos, docs) y deja el catálogo para el final del commit.
- `deTexto` y el teclado del móvil: el alumno teclea `x` minúscula o mayúscula, con o sin espacios, con `*`, `·` o nada entre el coeficiente y la letra, y el menos como `-` o `−`: acepta todo eso; rechaza `x2` (¿`x²` o `2x`?) con un mensaje claro. `inputmode="text"` (no `decimal`) en los campos de expresión.
- Para probar en el navegador sin dejar nada en el árbol compartido: servir una carpeta del scratchpad con enlaces a `practicas/`, `css/`, `src/`, `divisores/` y `herramientas/`; Chrome guarda en caché los módulos: `fetch(url, { cache: 'reload' })`. Sin la extensión: Chrome headless con perfil propio (`--user-data-dir=<scratchpad>/perfil`), matando el proceso al acabar (un headless huérfano bloquea el Chrome normal). En este Mac no hay `timeout`.
- En zsh una variable con varias rutas no se parte en palabras: `F=(a b c); git add "${F[@]}"`.
- Duración real de la 98 en la U4: ~30 min de la estimación de 1 h 45 min.

## Prohibido (propio de esta tarea)

- Escribir ninguna práctica de verdad (solo los esqueletos) o poner `disponible: true`.
- Cambiar lo que hacen hoy `leerNumero`, `campoNumero`, `enteros.js`, `fracciones.js`, `decimales.js`, el catálogo de las unidades 1-5 o la ortografía, o sus bloques.
- Usar `eval` o `Function` sobre lo que teclea el alumno, o comparar con `Number` en coma flotante: fracciones exactas siempre.

## Salida esperada

- Los ficheros de «Ficheros que toca» comiteados, con `npm test` sin fallos.
- `reparto-practicas-u2/salidas/144-base-unidad6/ENTREGA.md` (hash, ficheros, la API de `algebra.js` en una tabla, la tabla slug → ids definitivos de cada práctica, qué dejó provisional y cómo probarlo en 1 minuto) y su marcador `ENTREGA.md.ok-<sid>`.

## Reglas de contenido de la unidad 6 (copia de `proyecto.md` de su reparto; lo común no se lee, por eso va aquí)

Las reglas 2-4 y 8-9 de la lista de la unidad 2 (signos `·` y `:`, inglés, regla de oro, feedback, realismo) valen igual.
La fuente es `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/6. Algebra/reparto-unidad6/proyecto.md` («Reglas de contenido comunes») y, cuando exista, el acta
`/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/6. Algebra/inventario-unidad6-revision.md` (lo que Juan Luis decida en la tarea 02 de aquel reparto: las letras, las sucesiones,
las potencias de letras, el método —balanza o transposición—, los casos sin solución, hasta dónde los paréntesis y los
denominadores, los problemas, la notación, las cotas de realismo, los ids). **Hasta el acta, nada de eso entra.**

1. **Dos expresiones equivalentes son la misma respuesta, y dos ecuaciones con la misma solución también.** `2x + 3` y `3 + 2x`;
   `x/2`, `½x` y `0,5x`; `3 · x` y `3x`; `x + x` y `2x`; `2(x + 1)` y `2x + 2`; `x + 3 = 10` y `2x + 6 = 20`; y una solución `3/2`,
   `1,5` o `6/4`. En cualquier ejercicio de elegir, emparejar o verdadero/falso, ninguna opción puede equivaler a otra: el test lo
   comprueba **por forma canónica** (`a·x + b` con las fracciones exactas de `_comun/algebra.js`, nunca `Number` en coma flotante)
   y **por solución**. Solo si el ejercicio evalúa la forma escrita («¿cuál está reducida?», «la fracción irreducible») cuenta la
   escritura, y el enunciado lo dice. Lo que teclea el alumno se lee con `deTexto` y se compara por forma canónica: `3 + 2x` vale
   como `2x + 3`, y `6/4` vale como `3/2` salvo que la consigna pida la irreducible.
2. **Nada que no se haya dado**: cada ejercicio respeta la columna `sesion` de sus destrezas en el inventario (semana 1: traducir,
   la letra, valor numérico, términos semejantes; semana 2: ecuación y solución, transposición, una y dos operaciones, `12x = 3`,
   negativas; semana 3: `x` en los dos miembros, paréntesis, denominadores; semana 4: problemas). **Ni porcentajes ni
   proporcionalidad** (U7), ni geometría con fórmula (U8), ni segundo grado, sistemas, inecuaciones ni dos incógnitas (2.º ESO);
   `x²`, las sucesiones, los casos `ax = b` con `a` o `b` nulos, los denominadores con paréntesis y `x` en el denominador solo si el
   acta los admite y en la sesión que diga. Se saben la jerarquía (U1), el m.c.m. (U2), los enteros (U3), las fracciones (U4) y los
   decimales (U5).
3. **Notación**: coeficiente delante y pegado (`3x`, `−2x`), `x` por `1x`, `·` solo entre números, la división con letras como
   fracción (`htmlFraccion` de `fracciones.js` con `x` en el numerador; en texto, `x/2`), `3(x − 2)` sin punto; en inglés `2x` se lee
   *two x* (o *twice x*), `x/2` *x over two* o *half of x*; *solve for x*, *both sides*, *like terms*, *expand the brackets*. El
   alumno puede teclear `2x+3`, `3+2x`, `2·x + 3`, `2*x+3` o `x/2`: `deTexto` los acepta todos; nunca `eval`.
4. **Regla de oro**: todo distractor, inequívocamente falso, y cada distractor sale de un **error típico** de la columna `nota`
   del inventario, calculado con los números del ítem y comprobado en el test (nunca un número al azar): sumar términos no
   semejantes (`3x + 2 = 5x`); `x · x = 2x`; yuxtaponer al sustituir (`3x` con `x = 4` → 34); transponer sin cambiar el signo
   (`x + 3 = 10 → x = 13`); pasar un factor restando (`3x = 12 → x = 9`); multiplicar en vez de dividir; invertir `12x = 3 → x = 4`;
   distribuir solo al primer término (`3(x − 2) = 3x − 2`); el signo menos delante del paréntesis (`−(x − 2) = −x − 2`); multiplicar
   por el m.c.m. solo los términos con denominador; contestar `x` cuando el problema pide otra cosa; traducir «tres menos que un
   número» como `3 − x`. Los generadores de estos valores están en `_comun/algebra.js` (`ERRORES_TIPICOS`): úsalos, y **cada
   función dice cuándo no sirve** (devuelve `null` cuando el error da lo mismo que la respuesta). **Lo que no es un error**: `x · 3`
   por `3x`, `1x` por `x`, una solución sin simplificar cuando no se pide la irreducible.
5. **Parejas válidas, que nunca se enfrentan**: *brackets* / *parentheses*; *solve* / *work out*; *twice* / *double*; *like terms* /
   *similar terms*; *both sides* / *each side*; `x : 2` / `x/2` (si el acta admite las dos); una fracción irreducible y su decimal
   exacto; una expresión y cualquier reordenación suya; dos ecuaciones equivalentes.
6. **Inglés sencillo**; la palabra no matemática que decide la respuesta se aclara entre paréntesis (*twice* (el doble), *three less
   than* (tres menos que), *consecutive* (seguidos), *altogether* (en total), *each* (cada uno), *in three years' time* (dentro de tres
   años)), salvo que sea justo lo que se evalúa. **El enunciado en inglés no puede ser ambiguo**: *twice a number, plus five*
   (`2x + 5`) frente a *twice the sum of a number and five* (`2(x + 5)`).
7. **Realismo** (regla de Juan Luis del 16-10): la situación tiene que ser posible y **todos** los números que pueda sacar el
   generador, creíbles, con una cota por contexto que el test comprueba. Orientativas hasta el acta (la sesión fija las suyas y
   las escribe en su ENTREGA): edades de 1 a 100 (un alumno 6-18, un padre o una madre 25-60, un abuelo 55-95; la diferencia
   padre-hijo entre 18 y 50; «dentro de n años» y «hace n años» con n de 1 a 20 y nadie con edad negativa); dinero (la paga 1-50 €;
   precios como en la U5; ahorros hasta 2000 €; con dos decimales si no es entero; un reparto que salga exacto); cantidades de
   cosas (caramelos, canicas, cromos: 1-200; una clase 12-36 personas; un equipo 5-25); números («pienso un número», consecutivos:
   enteros de −50 a 200); perímetros con palabras (lados de 1 a 50; nunca con fórmula ni áreas). **La solución de un problema es un
   natural (o dinero con dos decimales)**: nunca una edad fraccionaria ni un número negativo de personas. Los personajes llevan
   nombres inventados (no de alumnos reales).
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
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 144, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-144.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/144--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/144--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/144-base-unidad6/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cotas de realismo, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/144--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/144--<sid>.md` con hasta dónde llegaste, la línea
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
  proporcionalidad, segundo grado, sistemas, dos incógnitas; `eval` o coma flotante; lo que el acta deje fuera (`x²`, sucesiones,
  casos sin solución, `x` en el denominador) o algo de una sesión posterior a la de la destreza; distractores que puedan ser
  verdad, y en especial **dos opciones equivalentes** (`2x + 3` y `3 + 2x`; dos ecuaciones con la misma solución), que son dos
  respuestas correctas; casos de examen en claro en el repositorio.
