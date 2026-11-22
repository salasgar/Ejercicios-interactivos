# Tarea 237 · «Caza el error» de la unidad 5 (errores5), ejercicio 1 en columnas

Actualizado: 2026-11-22 (alta de la coordinadora de la fase 2 de «Caza el error», a petición de Juan Luis)
Precondición: — (la fase 1 está en `main`: commits 82bb0c4, 601be04, c8c9afa, 39d6d39, 96554fb y c36041d) · Disparo: MANUAL (sesión atendida)
Duración esperada: 60 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/237-errores5-columnas/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/errores5/*`, `tests/practicas-errores5.test.js`, `tests/practicas-ayuda-errores5.test.js`

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
   printf 'sesión: %s\ntarea: 237\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/237--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/237--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 237 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/237--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Contexto (común a las tareas 234-239)

El 22-11-2026 Juan Luis probó los ejercicios de «señalar la línea del error» de las siete «Caza el error» y pidió
cambios. La sesión s-20261122T120314-344f1477 (coordinadora de esta alta; su nota en `hechos/notas/`) hizo la **fase 1** en
todas: sin números de línea (commit 82bb0c4 y siguientes), el enunciado fijo y sin poderse pulsar, el feedback sin
«Se llama:», con la línea nombrada por ordinal («la tercera línea»), el error como frase, **la regla rota en
negrita** (`REGLAS` en el `textos.js` de cada práctica o `regla()` en errores4) y lo correcto; y el ejercicio 1 de
**errores3 en columnas** (commit c36041d), que es **el modelo** de las tareas 234-238.

El formato en columnas, decidido por Juan Luis:
- El mismo cálculo (o problema) **resuelto por varios alumnos, uno por columna: de 2 a 4 columnas, 1 o 2 bien y 1
  o 2 con un error** (errores distintos). Las columnas buenas lo hacen **de formas distintas** (no dos iguales).
- El enunciado va **una vez arriba**, sin poderse pulsar; cada columna empieza por su primer paso.
- El alumno toca la línea mala de **cada columna que esté mal** (como mucho una por columna; las buenas, sin
  marcar) y pulsa «Comprobar». **No se le dice cuántas columnas tienen error.**
- Si acierta, **una pregunta tipo test por cada columna mala** («¿Qué error hay en la columna B?»): el nombre
  bueno y dos que no pueden describir esa columna (regla de oro; en errores3, de otro grupo de `GRUPOS`).
- Una sola llamada a `api.responder`: el primer fallo termina el ítem con la explicación de todas las columnas
  (`espera: 'boton'`); si acierta todo, 1 punto.
- Por qué: con un solo cálculo de tres líneas el error se deducía («si la última cuenta cuadra, tiene que estar
  en la segunda»). Lo que importa es que haya **varias formas correctas** de hacerlo y que el alumno decida cuáles
  están bien.

Piezas ya hechas, **solo lectura** (`practicas/_comun/procedimiento.js`): `columnasPulsables(contenedor, {
enunciadoHtml, columnas: [{ letra, lineasHtml }], textoComprobar, alComprobar })` → `{ corregir(solucion, { bien,
mal }) }`; `columnasFijas` (para la traducción); `lista`, `lineasPulsables`, `lineaN`, `errorEnLinea`,
`LO_CORRECTO`, `reglaEnNegrita`; y el CSS `.columnas`/`.columna` en `practicas/_comun/estilos.css`. Si te falta
algo ahí, **no lo parchees**: propónlo en la terminada (otras tareas de esta tanda la usan a la vez).

Léete antes, enteros: `practicas/errores3/logica.js` (apartado «Ejercicio 1 en columnas»: `FAMILIAS`, rutas que
reutilizan plantillas con `mapa`, rutas `propia`, `columnaDe` que **comprueba la verdad de cada línea**,
`columnasPosibles` sin columnas repetidas ni errores repetidos, `PESOS` para que salgan 3 y 4 columnas,
`generarDonde`, `explicaColumna`), `practicas/errores3/practica.js` (`montarDonde` y `preguntar`),
`practicas/errores3/textos.js` (`explicacionColumnas`, `explicaDonde`, `REGLAS`) y
`tests/practicas-errores3.test.js` (apartado «Ejercicio 1 en columnas»).

## Qué hay que hacer

El **ejercicio 1 «¿Dónde está el error?»** de `practicas/errores5/` (unidad 5, decimales) pasa a columnas; el 2 y el 3 se quedan.
Desaparece el botón «Todo está bien» de este ejercicio: en columnas, «está bien» es dejar la columna sin marcar.

Familias propuestas (las líneas son fragmentos con `sd()`/`st()`; para comprobarlas, `decimales.js`):
- Suma y resta: bien, rellenando con ceros (`1,93 + 13,00`) o sin rellenar pero coma debajo de coma; mal, `alinea-a-la-derecha`.
- Producto: bien, «Sin comas: 212 · 9 = 1908» y luego la cuenta con su resultado, o multiplicando con las comas a la vez;
  mal, `coma-mal-puesta`. **Nunca «2,12 · 0,9 = 212 · 9»** (lo arregló la fase 1; hay un test).
- Por 10, 100, 1000: bien, moviendo la coma; mal, `por-diez-anadiendo-cero`.
- División: bien, quitando la coma del divisor en los dos números, o dividiendo directamente; mal, `coma-solo-en-divisor`,
  `olvida-coma-cociente`, `resto-sin-deshacer`.
- Redondeo: bien, mirando solo la cifra siguiente; mal, `redondea-truncando`, `redondea-en-cadena`.
- Fracción a decimal: bien, `n : d`; mal, `fraccion-al-reves`, `periodico-por-redondeo`.
- Comparar: bien, igualando las cifras decimales o mirando cifra a cifra; mal, `compara-por-cifras`.

`REGLAS` y `frase()` (que recorta del nombre lo que ya dice la regla) están en `textos.js`. Preguntas: el nombre bueno y dos
de otra `CLASE_DE` que, aplicados a los números de la columna, darían otro resultado (como hace hoy `opcionesDeNombre`).


## Cómo saber que ha terminado

- `npm test` en verde, con los tests nuevos de la lista de arriba.
- Probada en Chrome (`npm run servir`, http://localhost:8080/practicas/errores5-columnas/?c=AJJN&ejercicio=N): un ítem de 2, de 3 y de 4
  columnas si salen; acertando todo, fallando el marcado (marcar una columna buena) y fallando una pregunta; el «No lo sé»; en
  español y en inglés; en una ventana estrecha (375 px: dos columnas por fila) y en una ancha.
- La ENTREGA dice qué familias hay, cuántas rutas buenas y malas tiene cada una y el reparto real de 2/3/4 columnas en 3000 ítems.

## Trampas conocidas

- (De la fase 1, 22-11) En la tarjeta del «No lo sé» y en el feedback, `.ejercicio .feedback strong` de la base
  pone en línea cualquier `<strong>`: la regla en negrita usa la clase `regla-rota` (ya con la especificidad que
  hace falta). No metas la regla en un `<strong>` suelto.
- (De la fase 1) `button.ancho` es `display: block`: un botón con `hidden` sigue viéndose. `columnasPulsables` ya
  quita «Comprobar» con `remove()`.
- (De la fase 1) Cada porqué lleva solo los números del ítem: si repite la regla (que ya va en negrita) o el nombre
  del error, se recorta. Juan Luis lo pidió expresamente («sin repetir»).
- (De la fase 1) Ninguna igualdad falsa en una columna buena: un paso que no es una igualdad («Sin comas: 212 · 9 =
  1908») no se escribe con «=» delante ni detrás. Lo comprueba un test que evalúa cada línea.
- La base sortea el idioma del ítem: prueba siempre los dos.

## Prohibido (propio de esta tarea)

- Tocar `practicas/_comun/` (también `procedimiento.js` y su CSS): lo que falte, propuesta en la terminada.
- Cambiar los ejercicios que no son el de columnas, salvo lo que el test de columnas obligue (y dicho en la ENTREGA).
- Inventar errores que no estén en el catálogo de errores de la unidad: un error sin nombre no puede preguntarse.
- Mantener «Todo está bien» en el ejercicio de columnas.

## Salida esperada

`reparto-practicas-u2/salidas/237-errores5-columnas/ENTREGA.md` y su marcador `ENTREGA.md.ok-<sid>`; el código en los ficheros de arriba.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 237, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-237.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/237--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/237--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/237-errores5-columnas/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cotas de realismo, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/237--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/237--<sid>.md` con hasta dónde llegaste, la línea
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
- Las reglas de contenido de la unidad de la práctica (`proyecto.md`, apartado de su unidad) y la regla de oro de los distractores del `CLAUDE.md` del repositorio.
