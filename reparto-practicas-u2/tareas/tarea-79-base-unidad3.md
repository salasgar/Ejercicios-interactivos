# Tarea 79 · Base de la unidad 3: catálogo, portada, destrezas, `_comun/enteros.js` y `_comun/recta-enteros.js`

Actualizado: 2026-10-21
Precondición: ninguna · no en paralelo con la 71 (las dos tocan `registro.js`, `portada.js` y sus tests; la 71 no empieza antes del 25-10: lo natural es que la 79 cierre antes) · Disparo: MANUAL (sesión atendida)
Duración esperada: 1 h 30 min (tiempo de sesión, no de persona; real, ~70 min) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/79-base-unidad3/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/enteros.js` (nuevo), `practicas/_comun/recta-enteros.js` (nuevo), `practicas/_comun/catalogo.js` (doce filas), `practicas/portada.js` (bloques y descripciones de la U3), `practicas/_comun/registro.js` (`DESTREZAS` de la U3), `practicas/<slug>/` de los doce slugs (solo el esqueleto), `docs/practicas-unidad3.md` (nuevo, §7), `tests/practicas-enteros.test.js` (nuevo), `tests/practicas-comun.test.js` (lista del catálogo), `tests/practicas-semana.test.js` (el test de los bloques), `tests/practicas-registro.test.js` (leer también la tabla de la U3)

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
   printf 'sesión: %s\ntarea: 79\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/79--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/79--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 79 con `abierto:` más antiguo (o igual y sid menor), añade a tu
   reclamo una línea `CEDIDA a <sid del otro>` y elige otra tarea.
5. Si el reclamo que encuentras está caducado (RELEVABLE en el tablón), relévalo con la
   línea `releva a: <sid anterior>` **en tu propio reclamo**; el suyo no se toca. Después
   mira qué dejó hecho: `ls practicas/`, `git log --oneline -5`, `git status -sb`, y la
   carpeta de salida. Lo que haya con tests en verde se hereda y se dice en la terminada;
   lo que no, se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** (todas las filas contra `hechos/` y la
   hora real; banda y «encadenable» recopiadas de las fichas) antes de empezar, y sigue
   con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.
7. Idempotencia: comprueba si `practicas/<tu slug>/` o tu test ya existen (de una sesión
   caída) antes de crearlos. Si existen, léelos y continúa desde ahí.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/79--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.



## Objetivo

Preparar lo común para las doce prácticas de la **unidad 3, Integers** (tareas 80-91), de forma que
ninguna de ellas tenga que escribir en un fichero común y puedan ir las doce en paralelo. Es la
lección del 8-10 (`proyecto.md`, «Un fichero común con candado no se reparte entre sesiones en
paralelo»): todo lo que es común lo hace esta tarea, de una vez.

El catálogo de la unidad 3 (diseño de la coordinadora del 21-10; Juan Luis pidió el alta):

| id | slug | nombre (es / en) | nEjercicios | semana (bloque de la portada) | destrezas |
|---|---|---|---|---|---|
| 33 | `termometro` | La recta y el termómetro / The number line and the thermometer | 5 | 1 | U3-1C-02, 1C-03, 1C-04, 1C-05, 1C-06 |
| 34 | `opuestos` | Opuesto y valor absoluto / Opposite and absolute value | 4 | 1 | U3-1C-07, 1C-08, 1C-09, 1C-10 |
| 35 | `situaciones` | Enteros en la vida real / Integers in real life | 3 | 1 | U3-1C-01, 1C-16, 1B-04 |
| 36 | `saltos` | Sumas y restas con saltos / Adding and subtracting with jumps | 5 | 1 | U3-1C-11 a 1C-15, 1A-01, 1A-02, 2A-01, 2C-01 a 2C-04 |
| 37 | `dos-signos` | Dos signos seguidos / Two signs in a row | 4 | 2 | U3-2C-05 a 2C-08, 2C-10 |
| 38 | `signos-producto` | La regla de los signos / The rule of signs | 5 | 2 | U3-2C-15 a 2C-21 |
| 39 | `potencias-enteros` | Productos y potencias con signo / Signs in products and powers | 4 | 3 | U3-3C-02, 3C-03, 3C-10 a 3C-15 |
| 40 | `jerarquia-enteros` | ¿Qué se hace primero? Con enteros / What comes first? With integers | 4 | 3 | U3-3A-01 a 3A-03, 3C-20, 4A-01, 4A-02 |
| 41 | `parentesis-enteros` | Paréntesis y corchetes / Brackets | 5 | 3 | U3-3A-04, 3C-16 a 3C-18, 4A-03, 4A-04, 4A-06, 4A-07 |
| 42 | `errores3` | Caza el error / Spot the mistake | 3 | 4 | U3-3C-19, 4A-05, 4C-08, 4C-09, 2C-21 |
| 43 | `variacion` | Subidas, bajadas y diferencias / Rises, falls and differences | 5 | 4 | U3-4C-01 a 4C-05, 4C-07, 4C-10, 4B-02, 3C-21 |
| 44 | `leelo3` | Léelo en inglés / Say it in English | 4 | toda la unidad | U3-1B-01 a 1B-03, 2B-01 a 2B-03, 3B-02, 4B-01, 4B-02 |

Destrezas sin práctica, a propósito: U3-2A-04 (escribir el cálculo con un igual por línea), U3-2C-09
y U3-2C-17 como explicación (la 85 usa el patrón de la 2C-17 en su introducción). Son de papel.

## Siguiente paso

1. Lee la ficha de la tarea 01 (§1 catálogo, §2 `aritmetica.js`, §3 el contrato) y la de la 75 (la
   última que añadió una fila al catálogo y un bloque a la portada). Lee `practicas/_comun/catalogo.js`,
   `practicas/portada.js`, `practicas/_comun/registro.js` (`DESTREZAS`), `practicas/_comun/piezas.js`
   (`leerNumero`, que solo lee naturales), `practicas/jerarquia/logica.js` (el evaluador por fichas de
   la unidad 1, solo naturales) y `docs/practicas-unidad2.md` (§7).
2. `git status` y `git log --oneline -3 -- practicas/_comun/ practicas/portada.js`: si hay cambios sin
   commit en esos ficheros que no son tuyos, no los pises y avisa.

## Qué hay que hacer

**1. `practicas/_comun/enteros.js`** (nuevo, puro, sin DOM), con su test `tests/practicas-enteros.test.js`:
- `MENOS = '\u2212'`; `fmt(n)` → `'−5'`, `'0'`, `'5'` (nunca `'+5'`); `fmtPar(n)` → `'(−5)'` si es
  negativo y `'5'` si no (para el factor o el divisor que no va primero, y para el `−(−4)`).
- `leerEntero(texto)` → entero o `null`: acepta `-`, `−` (U+2212) y `–` (U+2013), un `+` delante,
  espacios; rechaza decimales, vacío y basura.
- Un **evaluador de expresiones** con enteros, `+ − · : ^ ( ) [ ]` y el menos delante de un número o
  de un paréntesis, con la jerarquía de verdad: `−3² = −9`, `(−3)² = 9`, `−(−3)² = −9`,
  `30 : (−5) · 2 = −12`, `30 : (−5 · 2) = −3`. Al menos: `analizar(texto)` → árbol, `evaluar(árbol o
  texto)` → entero (o error si una división no es exacta o es entre 0), `html(árbol o texto)` →
  HTML con `−`, `·`, `:` y `<sup>`, `pasosPosibles(árbol)` → las operaciones que pueden hacerse ya (para
  la regla «un paso independiente no es fallo»: varias), y `aplicarPaso(árbol, i)`. El alumno puede
  escribir `*`, `x`, `/` o `÷`, que se traducen a `·` y `:` al pintar.
- **Los errores típicos** de la nota de U3-4C-08 del inventario, cada uno como función con nombre que
  da el cálculo equivocado a partir de los números (`reglaSignosEnSuma(−2, −3)` → `5`;
  `signoDelMayorEnProducto(5, −2)` → `10`; `potenciaParNegativa`, `menosSoloAlPrimero`,
  `derechaAIzquierda`, `mismoSignoDosVeces`, `valorAbsolutoNegativo`, `opuestoDelOpuesto`…) y una
  tabla `ERRORES_TIPICOS` con su nombre `{ es, en }` en frase corta. Las prácticas sacan de aquí sus
  distractores.
- Test: el evaluador contra una tabla de al menos 40 expresiones calculadas a mano (incluidas las de
  arriba y las del inventario), y contra `eval` de JavaScript (con `**` y paréntesis explícitos) en
  3000 expresiones aleatorias; cada error típico da un valor distinto del correcto en los casos en que
  se usa como distractor (y la función dice cuándo no sirve: `−2 + 3` con «regla de los signos en la
  suma» da lo mismo, así que no vale como distractor ahí).

**2. `practicas/_comun/recta-enteros.js`** (nuevo, con DOM, SVG): una recta horizontal y un termómetro
vertical. Rango, paso de las marcas (1, 2, 5), qué marcas llevan número (todas, algunas, solo el 0),
puntos con etiqueta y clase, saltos (arco con flecha, animable), y marcas que se pueden tocar
(`alTocar(valor)`). Tiene que verse bien a 375 px con hasta 21 marcas en horizontal, y el termómetro
hasta 30. El menos de las etiquetas, U+2212. La parte pura (posición de cada marca, qué marca está
más cerca de un toque) va en funciones exportadas con su test, en el mismo `tests/practicas-enteros.test.js`.

**3. `leerNumero` de `piezas.js` no se toca**: las prácticas de la U3 usan `leerEntero`. Si
`campoNumero` no deja escribir el signo, añade a `enteros.js` un `campoEntero` con la misma forma (o
un parámetro `signo` a `campoNumero`, sin cambiar lo que hace hoy: decide tú y dilo en la ENTREGA).

**4. Catálogo** (`practicas/_comun/catalogo.js`): las doce filas de la tabla de arriba, `unidad: 3`,
**`disponible: false`**, en ese orden, después de la 32 y antes de la plantilla. Los ids no se
reutilizan nunca.

**5. Un esqueleto por práctica**: `practicas/<slug>/` para los doce slugs, copia mínima de
`practicas/plantilla/` que carga y declara su `slug` y sus `nEjercicios` (un test de
`tests/practicas-semana.test.js` carga el `practica.js` de cada fila del catálogo: sin el esqueleto,
`npm test` falla). Con `disponible: false` no lo ve nadie. **Desde que esta tarea esté LISTA, cada
carpeta es de su tarea (80-91)**, que la sustituye entera; escríbelo en la ENTREGA.

**6. Portada** (`practicas/portada.js`): cinco bloques de la unidad 3, `unidad: 3`:
- «Semana 1 · Los enteros: recta, orden, sumas y restas» / «Week 1 · Integers: number line, order,
  adding and subtracting»: `termometro`, `opuestos`, `situaciones`, `saltos`.
- «Semana 2 · Dos signos seguidos y la regla de los signos» / «Week 2 · Two signs in a row and the
  rule of signs»: `dos-signos`, `signos-producto`.
- «Semana 3 · Potencias, jerarquía y paréntesis» / «Week 3 · Powers, order of operations and
  brackets»: `potencias-enteros`, `jerarquia-enteros`, `parentesis-enteros`.
- «Semana 4 · Problemas y errores típicos» / «Week 4 · Word problems and common mistakes»: `variacion`,
  `errores3`.
- «Para toda la unidad · Vocabulario» / «For the whole unit · Vocabulary»: `leelo3`.
Y una línea de `DESCRIPCION` por práctica, en los dos idiomas, sacada de la ficha de su tarea (una
frase de qué se toca). Ajusta el test de `tests/practicas-semana.test.js` que hoy exige
`BLOQUES.every(b => b.unidad === 2)`: que los de la U2 se conserven tal cual y que los de la U3 sean
estos cinco (sin publicadas todavía, `bloquesPublicados(CATALOGO, 3)` no enseña ninguno).

**7. Destrezas** (`practicas/_comun/registro.js`, `DESTREZAS`): las de la tabla de arriba, con los
ids completos (`U3-1C-02`…). Hoy un test de `tests/practicas-registro.test.js` exige que `DESTREZAS`
sea exactamente la tabla del §7 de `docs/practicas-unidad2.md`: crea **`docs/practicas-unidad3.md`**
con su §7 («Qué práctica cubre qué destreza de la unidad 3», mismas columnas que la de la unidad 2,
una fila por destreza del inventario, también las que no tienen práctica) y cambia el test para que
lea las dos tablas. El resto de ese documento lo escribe la 96; deja los apartados con un «por
escribir (tarea 96)».

**8. `tests/practicas-comun.test.js`**: la lista del catálogo con las doce filas nuevas (es el test que
fija ids, slugs y número de ejercicios).

## Datos de entrada

- El inventario de la unidad 3, solo lectura: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/3. Integers/inventario-unidad3.tsv`.
- `reparto-practicas-u2/tareas/tarea-80-…` a `tarea-91-…`: lo que cada práctica va a pedir a
  `enteros.js` y `recta-enteros.js` (léelas por encima antes de fijar la API: por ejemplo, la 83
  necesita saltos animados, la 87 varios pasos posibles, la 89 los errores con nombre).

## Cómo saber que ha terminado

- `npm test` sin fallos (el árbol entero: con el esqueleto, todas las filas cargan).
- `node --test tests/practicas-enteros.test.js` en verde, con la tabla a mano y la comparación con `eval`.
- En local (`npm run servir`), la portada de las prácticas no enseña nada nuevo (todo `disponible:
  false`), y una página de prueba tuya (no comiteada) pinta la recta y el termómetro a 375 px.

## Trampas conocidas

- **La fila 45 del catálogo, `ortografia`, ya es `unidad: 3`** (con `transversal: true`, sin publicar;
  commits del 23 y el 25-10, fuera del reparto). No es una de tus doce: los ids 33-44 siguen libres, pero
  cualquier test o bloque que filtre «las prácticas de la unidad 3» tiene que excluirla (o filtrar por
  `!transversal`), y el ★ de ortografía de cada tarea semanal de la U3 ya está en las fichas 93-96. La
  sesión que la hace (otra de Claude Code en este mismo árbol) tocó también `catalogo.js`, `base.js`,
  `vista-tareas.js` y los tests `practicas-comun` y `practicas-semana`: antes de editarlos mira
  `.claude/sesiones/` y `git log -3 -- <fichero>`, y si los tiene reservados, espera; nunca comitees sus
  cambios (aviso de la coordinadora s-20261024T223205-13077485, 25-10).
- Hay sesiones de Juan Luis fuera del reparto que tocan `practicas/`, y la 71 puede estar en curso
  desde el 25-10 (base, panel, informe, reglas): si coincidís, **no** toquéis los mismos ficheros a la
  vez. La 71 no toca `catalogo.js`, `portada.js` ni `registro.js` salvo lo que diga su ficha: mírala.
- `-` y `−` se parecen: en el test, busca U+2212 por su código.
- `eval` de JavaScript con `-3**2` da error de sintaxis: en la comparación, genera el texto para
  `eval` con paréntesis explícitos.
- (s-20261024T224223-4911ef6c, al cerrar) **En un SVG, lo que se dibuja encima se queda el clic**:
  las zonas de toque iban debajo de la línea y las marcas, y tocar justo en la línea no hacía
  nada. Las capas de dibujo llevan `pointer-events: none` (clase `re-capa`). El test puro no lo
  ve: solo se nota tocando en el navegador.
- (íd.) **La letra de la recta no puede salir de la separación entre marcas**: con 21 marcas
  quedaba a 9 aunque solo hubiera cinco números. Ahora sale de los huecos entre las marcas
  numeradas, y con todas numeradas van en dos filas.
- (íd.) Para probar en el navegador sin dejar nada en el árbol compartido: servir una carpeta del
  scratchpad con enlaces a `practicas/`, `css/`, `src/`, `divisores/` y `herramientas/` (sin
  `src/` la base se queda en «Cargando…» sin ningún error en la consola). Chrome guarda en
  caché los módulos: `fetch(url, { cache: 'reload' })` antes de recargar.
- (íd.) En zsh una variable con varias rutas no se parte en palabras: `git add $F` falla con
  «File name too long». Usar una lista: `F=(a b c); git add "${F[@]}"`.

## Prohibido (propio de esta tarea)

- Escribir ninguna práctica de verdad (solo los esqueletos) o poner `disponible: true`.
- Cambiar lo que hacen hoy `leerNumero`, `campoNumero`, el catálogo de las unidades 1 y 2 o sus bloques.

## Reglas de contenido de la unidad 3 (copia de `proyecto.md`; lo común no se lee, por eso va aquí)

1. **La suma y la resta empiezan sin paréntesis**: `5 + 3`, `5 − 3`, `−5 + 3`, `−5 − 3`. **Nunca**
   `(+5) + (+3) = +8`, ni `+8` como resultado. El paréntesis de un número (`5 − (−3)`, `5 · (−2)`)
   aparece en la sesión 6, como algo que se quita; `(+6)` y compañía, solo en el ejercicio que
   enseña a quitarlos (U3-2C-08). Un negativo que no va el primero en un producto o un cociente va
   entre paréntesis: `5 · (−2)`, `12 : (−3)`. El opuesto del opuesto, `−(−4)`, es de la sesión 1.
2. **Nada que no se haya dado**: cada ejercicio respeta la columna `sesion` de sus destrezas en el
   inventario. Ningún producto o cociente de enteros antes de la sesión 6, ningún paréntesis que
   envuelva una operación antes de la 11 (salvo `30 : (−5 · 2)` en la 9), ninguna potencia de base
   negativa antes de la 10, corchetes solo en la 13. Ni letras ni ecuaciones (el número que falta es
   un hueco `□`), ni decimales, fracciones ni porcentajes.
3. **Escritura**: el menos que se ve en pantalla es U+2212 `−` (`fmt` de `practicas/_comun/enteros.js`,
   de la tarea 79); el alumno puede teclear `-`, `−` o `–` (`leerEntero`). Producto con `·`, nunca
   `×`; división con `:` (en inglés, `÷` o `:`, como el resto de la app). Exponentes con `<sup>`.
4. **Regla de oro**: todo distractor, inequívocamente falso, y cada distractor sale de un **error
   típico** de la columna `nota` del inventario, calculado con los números del ítem y comprobado en el
   test (nunca un número al azar): `−2 − 3 = +5`, `5 · (−2) = 10`, `(−2)⁴ = −16`, `(−2)³ = +8`,
   `(−5)² = −10`, `−(−3)² = 9`, `5 − (2 − 4) = 5 − 2 − 4`, `2 − 4 + 3 = 2 − 7`, `4 − 5 · 2 = 4 − (−10)`,
   `3 − (−2) = 3 − 2`, `|−4| = −4`, `−(−9) = −9`. Los generadores de estos valores están en
   `_comun/enteros.js` (tarea 79): úsalos.
5. **Parejas válidas, que nunca se enfrentan** (U3-4C-09): *negative three* / *minus three*;
   *subtract* / *take away*; *times* / *multiplied by*; *exponent* / *index*; *brackets* /
   *parentheses*; `÷` / `:`; `+5` / `5`; agrupar positivos y negativos / ir de izquierda a derecha;
   operar dentro del paréntesis / quitarlo. **Riesgos de dos respuestas correctas** (las destrezas
   con `cuidado` en la columna `tipo_test`): `√49` con 7 y ±7 a la vez entre las opciones; colocar
   paréntesis (varias colocaciones pueden dar lo mismo: vale cualquiera que dé el resultado); años
   a. C. (no hubo año 0); la escritura de dos signos seguidos (solo como «¿cuál está bien escrita?»).
6. **Inglés sencillo**; la palabra no matemática que decide la respuesta se aclara entre paréntesis
   (*to owe (deber)*, *rose (subió)*), salvo que sea justo lo que se evalúa. *Even* y *odd* se aclaran
   siempre salvo en su pregunta.
7. **Realismo** (regla de Juan Luis del 16-10): la situación tiene que ser posible y **todos** los
   números que pueda sacar el generador, creíbles en su contexto, con una cota por contexto que el
   test comprueba. Orientativas (la sesión fija las suyas y las escribe en su ENTREGA): temperatura de
   una ciudad, de −30 a 45 °C, y su cambio en un día, de 1 a 20 grados; plantas de un edificio, de −5
   a 20; buceo, de 0 a −40 m; saldo de un alumno, de −50 a 300 €; altitudes, de −400 m (mar Muerto) a
   8849 m; años, de 3000 a. C. a 2026, sin año 0.
8. **Feedback ligado al error**, con los números del ítem («−2 − 3: vas hacia abajo dos veces; 2 + 3 =
   5, así que el resultado es −5»), no una regla genérica. Frase sencilla antes que caso límite: «el
   valor absoluto es siempre positivo» se queda aunque |0| = 0 (decisión de Juan Luis del 17-10; no
   vale para los distractores).
9. **Casos fijos** (frases, contextos, cálculos con error) que no copien los de las hojas, los
   exámenes semanales ni el examen final de la unidad 3 (en la carpeta de la unidad: `hojas-de-ejercicios/`,
   `exámenes-semanales/`, `examen-final/`): los alumnos los verán en papel.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 79, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-79.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/79--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/79--<sid>.md` con `parada por: mal cortada`
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
   `git add <rutas> && git commit -m "Práctica <slug>: <qué>" -- <rutas>`. Apunta el hash
   (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/79-base-unidad3/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/79--<sid>.md`: hash del commit, ficheros (lo que dice
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
    sesión delante.
11. Decide si encadenas (solo en verde: misma banda, tarea corta, sin esperas; si tu frase
    de arranque nombra la cadena, encadenas por defecto) o paras. Si encadenas, «Antes de
    empezar» entero otra vez, con reclamo nuevo, y di el nombre nuevo que te toca.

Si paras sin terminar: `$R/hechos/fallos/79--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni
  `practicas/_comun/` (salvo la tarea 01 y, en la unidad 3, la 79 y las de publicación 93-96, cada una en lo que declara), ni `css/estilos.css`, ni `README.md` (salvo
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
  CDN; las prácticas no usan ni siquiera KaTeX (exponentes con `<sup>`).
- Las reglas de contenido de la unidad 3 (en esta ficha y en `proyecto.md`): `(+5) + (+3)` al
  empezar, `+8` como resultado, `×` en vez de `·`, el guion `-` en vez del menos `−` en pantalla,
  letras, ecuaciones, decimales o fracciones, algo de una sesión posterior a la de la destreza,
  distractores que puedan ser verdad y parejas válidas enfrentadas.
