# Tarea 196 · Publicar «Las tildes» (`ortografia-tildes`, 64), «Palabras que se confunden» (`ortografia-palabras`, 67) y «Ampliación» (`ortografia-ampliacion`, 68) tras sus reabiertas del 9-11, con la tabla de ★ de la U7, la U8 y junio al día y la ampliación entre los «a elegir» de la U8

Actualizado: 2026-11-13 (alta de la coordinadora s-20261111T215225-39c1f4f5, pedida por Juan Luis: «Otra tarea de publicación»; la 141 y la 142 las reabrieron el 9-11 y las dejaron sin publicador; sus reabiertas cerraron el 9-11. Decisión de Juan Luis del 13-11 sobre la ampliación: **(b), entre los «a elegir» de la U8**)
Precondición: las **reabiertas del 9-11** de 135 (la segunda), 138 y 139 cerradas con terminada nueva (lo están: `hechos/terminadas/135--s-20261109T114919-4bdd2b23.md`, `138--s-20261109T112906-85f368be.md`, `139--s-20261109T112903-1732e1f0.md`) · **192 LISTA** (revisa el «No lo sé» de la ortografía y hereda las carpetas de la 182; hoy RELEVABLE) · **no en paralelo con la 195** ni con ninguna otra que toque `catalogo.js` (hoy: 132, 156-159, 195; mira los reclamos vivos, paso 2 de «Antes de empezar») · Disparo: MANUAL · **Plazo: jue 25-2 para las tildes** (el primer ★ de las tildes es el lun 1-3, U7 · paquete 1) y **jue 15-4 para las palabras** (★ del lun 19-4, U7 · paquete 5); la ampliación, antes del lun 26-4 (U8 · 1). La portada enseña la sección «Ortografía» desde ya: lo que se publique, los alumnos lo ven al momento.
Duración esperada: 1 h 15 min (tiempo de sesión, no de persona; la 141 tardó ~35 min con dos bloques y la 142 ~25 min con tres, sin publicar) · Banda de modelo: ALTO · Encadenable con: 195
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/196-publicar-ortografia-4/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/catalogo.js` (solo `disponible` de las filas 64, 67 y 68), `docs/practicas-ortografia.md` (§5 y §7), `README.md` (filas), `tests/practicas-ortografia-comun.test.js` (solo la lista `PUBLICADOS`, como la 140 y la 141); y, solo para recortes de ≤ 5 ítems por bloque, `practicas/ortografia-tildes/logica.js`, `practicas/ortografia-palabras/logica.js` y `practicas/ortografia-ampliacion/logica.js` (declarándolo)

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
   si hay commits que traer (`git pull --rebase origin main` si los hay; nunca `--autostash`).
   **Comprueba la precondición en el disco, no solo en el tablón**: las tres terminadas de arriba, ninguna reabierta de 135, 138 o 139
   posterior a ellas (`ls $R/hechos/reabiertas/ | grep -E '^13[589]--'` y mira su fecha), la 192 con terminada
   (`ls $R/hechos/terminadas/ | grep '^192--'`), ningún reclamo vivo de una tarea que toque `catalogo.js` (`grep -l 'catalogo.js' $R/tareas/*.md`
   da las fichas; cruza sus números con `ls $R/hechos/reclamos/`), y
   `git status --short practicas/_comun/catalogo.js docs/practicas-ortografia.md README.md tests/practicas-ortografia-comun.test.js practicas/ortografia-tildes practicas/ortografia-palabras practicas/ortografia-ampliacion`
   tiene que salir **vacío**. Si algo sale modificado, es trabajo de otra sesión: no lo toques y no reclames.
3. Abre tu reclamo generando el sid **en el mismo comando** (probado en este Mac):
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -d '+150 minutes' +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -v+150M +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 196\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/196--$sid.md; echo $sid
   ```
   (150 min = 2 × la duración esperada). A partir de aquí tu sid es el del nombre de ese
   fichero (`ls $R/hechos/reclamos/196--*`); no lo guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 196 con `abierto:` más antiguo (o igual y sid menor), añade a tu
   reclamo una línea `CEDIDA a <sid del otro>` y elige otra tarea. Mira también que no haya
   ningún reclamo vivo de una tarea que toque `catalogo.js`: si lo hay, `CEDIDA (catalogo.js en uso por la NN)` y para.
5. Si el reclamo que encuentras está caducado (RELEVABLE en el tablón), relévalo con la
   línea `releva a: <sid anterior>` **en tu propio reclamo**; el suyo no se toca. Después
   mira qué dejó hecho: `git log --oneline -5`, `git status -sb`, la carpeta de salida, su scratchpad (`ls -d /tmp/*/`) y
   `grep -n "slug: 'ortografia-\(tildes\|palabras\|ampliacion\)'" practicas/_comun/catalogo.js`.
   Lo que haya con tests en verde se hereda y se dice en la terminada; lo que no, se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** (el guion de la coordinadora,
   `$R/hechos/notas/s-20261111T215225-39c1f4f5-regenerar-tablon.py`, lo hace: uso en su cabecera) antes de empezar, y sigue
   con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/196--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Los tres bloques de ortografía que faltan siguen sin publicar. La 141 (9-11) reabrió «Las tildes» (14 ítems dudosos o mal), y la 142
(9-11) volvió a reabrirlo (lámpara, cómetelo y explícaselo por el voseo, tres por cotejar en el DLE, «En 356 hay 5 decenas» y la regla
de los monosílabos), y reabrió «Palabras que se confunden» (6 ítems fuera y 3 reglas mal dichas) y «Ampliación» (7 ítems fuera y 2
explicaciones que contradicen a la buena). Las tres reabiertas se cerraron el 9-11, pero **ninguna tarea las publicaba**: eso es esta.
Después, la 182 les puso el botón «No lo sé» y la 192 lo revisó: la prueba con clics se hace **después** de que la 192 cierre.

Es la revisión que no puede hacer un test: el significado y el clic. Lo de las reabiertas se comprueba **ítem a ítem**; el resto del
banco, con la misma lectura que la 142 (regla de oro de la ortografía, lista «Lo que nunca es distractor», «si dudas, fuera»). Lo que
se quita se quita aquí si son ≤ 5 ítems por bloque y no hay que escribir ninguno nuevo; si no, reabierta y el bloque no se publica.

### La ampliación: entre los «a elegir» de la U8 (decisión de Juan Luis del 13-11)

De las tres formas que propuso la 142 (a: tarea asignada a los alumnos que él marque; b: entre los «a elegir» de las tareas de la U8;
c: solo en la portada, sin puntos), **Juan Luis ha elegido la (b)**. Por tanto:
- La ampliación **nunca es ★**: va entre los ejercicios «a elegir» de las tareas semanales de la U8, como alternativa para quien ya
  tenga el ★ de ortografía de esa semana. Como cualquier «a elegir», cuenta en los puntos si el alumno la elige.
- Al publicarse, sale también en la portada (sección «Ortografía»), con su aviso «Ampliación» en cada introducción.
- La ENTREGA propone **qué ejercicio de la ampliación va en qué paquete de la U8**, con las líneas literales para el editor del panel
  (`['ortografia-ampliacion', n]`), junto a la tabla de ★; `docs/practicas-ortografia.md` §5 dice la decisión.

### Criterio de reapertura (el de la 169; lo puede cambiar Juan Luis)

- **Se reabre** por la regla de oro (una opción que también vale, una forma que la RAE admite), por un dato falso en una frase, por
  una explicación que contradice a la buena, por una frase que caduca o por un fallo en pantalla.
- **No se reabre** por lo que ya decidieron las anteriores y está dicho en `proyecto.md` («Tareas 134-143»): el criterio estrecho del
  voseo (fuera solo la misma palabra en voseo), los niveles ya discutidos. Si ves algo nuevo de ese tipo, es un hallazgo para Juan Luis.
- **Variedad** (decisión de Juan Luis del 13-11): si un ejercicio repite un mismo ítem en más del 10 % de 3000 por nivel, se reabre.
- **Si reabres uno**, la terminada empieza por `PARCIAL:` y dice qué queda; cuando su reabierta esté cerrada, esta misma tarea se vuelve a
  reclamar para revisar **solo lo reabierto** y publicarlo. Los otros bloques se publican igual.

## Siguiente paso

1. Lee las ENTREGA de la 141 y la 142 (`$R/salidas/141-publicar-ortografia-2/ENTREGA.md`, `$R/salidas/142-publicar-ortografia-3/ENTREGA.md`:
   cómo probaron, la tabla de ★ —planes A y B, regla de sustitución— y los hallazgos), las reabiertas del 9-11
   (`$R/hechos/reabiertas/135--s-20261109T105938-1997ca78.md`, `138--s-20261109T105938-1997ca78.md`, `139--s-20261109T105938-1997ca78.md`
   y la primera de la 135, `135--s-20261109T101428-e1825b21.md`), las terminadas que las cierran (precondición), las ENTREGA de los tres
   bloques (`$R/salidas/13[589]-*/ENTREGA.md`), las terminadas de la 182 y la 192, y la ficha de la 142 (`$R/tareas/tarea-142-publicar-ortografia-3.md`,
   «Qué hay que hacer» y «Reglas de contenido de la ortografía»: se aplican igual aquí).
2. `docs/practicas-ortografia.md` §5-§7 y «Reglas de contenido de la ortografía» y «Lo que nunca es distractor» de `$R/proyecto.md`.
3. `node --test tests/practicas-ortografia-comun.test.js tests/practicas-ortografia-tildes.test.js tests/practicas-ortografia-palabras.test.js tests/practicas-ortografia-ampliacion.test.js`
   y `npm run servir` (o `python3 -m http.server 81NN`); cada bloque por su URL con «Probar sin código» (nunca el código de un alumno ni `AJJN`).

## Qué hay que hacer

1. **Lo que pedían las reabiertas, ítem a ítem**: cada ítem que la 141 y la 142 dieron por malo o dudoso, ¿se ha quitado o arreglado?
   ¿Las reglas y explicaciones señaladas dicen ya lo correcto? Lo marcado «comprobar» (DLE), cotejado ahora en `dle.rae.es` o
   `rae.es/dpd/` **con Claude in Chrome** (WebFetch da 403; trampa de la 142) y con la fuente anotada.
2. **Leer el banco entero** de cada bloque, como la 142 (punto 2 de su «Qué hay que hacer»), con la lista negra al lado: ¿la otra opción
   es **inequívocamente** falsa en esa frase? Lo dudoso, fuera. Tres revisores en paralelo (uno por bloque, solo lectura) lo hacen en
   minutos; cada marca, verificada a mano en el código.
3. **En el navegador**, con clics: cada ejercicio de los tres bloques en los tres niveles (`?nivel=1`, `2`, `3`), acertando y fallando,
   a 375 px y en ancho; que el feedback dice la regla con la palabra del ítem y que tras un fallo la buena queda a la vista; la etiqueta
   de nivel visible; el aviso «Ampliación» en la ampliación; **«No lo sé»** una vez por ejercicio (que la explicación sale y el ítem
   siguiente es otro); consola sin errores.
4. **Publicar** lo que pase: `disponible: true` en las filas 64, 67 y 68 (solo ese campo), `PUBLICADOS` del test común, `docs/practicas-ortografia.md`
   §7 («Qué hay publicado»: bloque, fecha, ejercicios, ítems por nivel) y §5 (la decisión de la ampliación), y las filas de `README.md`.
   `npm test` entero en verde. Tras el push, comprueba en https://salasgar.github.io/Ejercicios-interactivos/practicas/ (1-2 min; recarga
   forzada) que la sección «Ortografía» enseña los bloques publicados y que cada uno carga.
5. **Tabla de ★ al día** en la ENTREGA: la del plan A de la 142 (U7 · 1-5, U8 · 1-6, junio) con la columna «publicado» de ese momento,
   o el plan B / la regla de sustitución si un bloque no se publica; y, aparte, **la ampliación entre los «a elegir» de la U8**: qué
   ejercicio en qué paquete (U8 · 1-6), con las líneas literales y el nombre de cada ejercicio. Recuérdale a Juan Luis que la tabla de ★
   del calendario del curso (`apuntes-1eso-bilingue/comun/CALENDARIO-CURSO-2026-27.md`) **no se edita desde este reparto**.
6. **Dos salidas separadas** en la ENTREGA: el veredicto contra los criterios de arriba y los hallazgos fuera de criterio, dichos al
   usuario en el mensaje de cierre como decisión pendiente.

## Datos de entrada

- Las ENTREGA de 134, 135, 138, 139, 141, 142, 182 y 192 (solo lectura).
- `practicas/ortografia-tildes/*`, `practicas/ortografia-palabras/*`, `practicas/ortografia-ampliacion/*` y sus tests (solo lectura salvo
  el recorte de ≤ 5 ítems).
- `$R/proyecto.md` («Tareas 134-143», «Reglas de contenido de la ortografía», «Lo que nunca es distractor»), `docs/practicas-ortografia.md`.
- `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/comun/CALENDARIO-CURSO-2026-27.md`
  (solo lectura: los paquetes de la U7 y la U8 y la semana libre de junio).
- Para dudas: `dle.rae.es`, `rae.es/dpd/`, `fundeu.es` (solo lectura; con Claude in Chrome).

## Cómo saber que ha terminado

- Veredicto escrito por bloque; para lo publicado, `disponible: true`, `PUBLICADOS`, docs §5 y §7 y README; `npm test` en verde; la portada
  publicada lo enseña. Lo que no se publica, con su reabierta y la terminada en `PARCIAL:`.
- La ENTREGA lleva los ítems leídos y quitados con su fuente, la tabla de ★ al día con las líneas literales, la propuesta de la
  ampliación por paquete de la U8 y los hallazgos fuera de criterio.

## Trampas conocidas

- Las de la 140, la 141 y la 142 (en sus fichas): el bot genérico de clics da «0 aciertos» en los ejercicios de dos pasos (falla el
  paso 1; no es un fallo de la práctica); lo que más se escapa son frases que caducan, datos falsos en frases de ortografía,
  explicaciones compartidas que contradicen a la buena y verbos raros del DLE detrás de la forma sin tilde.
- (de la 142) **Sin Claude in Chrome, el DLE y el DPD no se abren**: WebFetch da 403 y un Chrome sin ventana se queda en la verificación de
  Cloudflare. Lo dudoso que no se pueda cotejar va a la reabierta marcado «comprobar», no se da por bueno.
- (de la coordinadora, 13-11) La ortografía **no la oculta la portada por fecha**: lo que se pone `disponible: true` lo ven los alumnos
  al momento. Publica cuando el veredicto esté escrito, no antes.
- (de la coordinadora, 13-11) La decisión (b) de la ampliación cambia lo que decía la 142 («hasta que decida, (c)»): no copies a la
  ENTREGA ni a los docs el «(c) por defecto».
- El lunes 3-5 es festivo: el paquete 2 de la U8 empieza el martes 4-5; la propuesta nombra paquetes, no fechas.
- (de la coordinadora, 5-11) `catalogo.js` lo comparten muchas tareas: edita, comitea con ruta explícita y suéltalo enseguida.
- (de la 163) El 8080 suele estar ocupado por el servidor de otra sesión: levanta el tuyo en otro puerto.
- (de la 196, 14-11) **El DLE con Claude in Chrome**: abre una pestaña en `https://dle.rae.es/<palabra>` y haz `fetch('https://dle.rae.es/' + w)`
  desde ella (mismo origen; desde otra pestaña da «Failed to fetch»). La búsqueda **sin tilde** es la prueba de las tildes: si «jamas» devuelve
  artículos (`jama`, `jamar`), la forma existe; si solo devuelve sugerencias entre paréntesis («autobús (autobús)»), no. Comprueba también los
  sustitutos: *compás* parecía limpio y *compas* es el plural de *compa*. El DPD está en `www.rae.es/dpd/<entrada>` (otra pestaña u origen).
- (de la 196) Un recorte que deja un nivel por debajo del mínimo (16; 12 en los de tocar) **no es recorte**: el test lo tumba (tildes, línea 136).
  Cuenta antes de quitar.
- (de la 196) El bot de clics al azar va lento con un `python3 -m http.server` (unos 25 s por recorrido; 66 recorridos, ~25 min): lánzalo en
  segundo plano nada más empezar, y mientras tanto lee. Y mientras corre, ese servidor tarda en responder a otra pestaña («Cargando…»).
- (de la 196) La etiqueta de nivel enseña el nivel del alumno, no el del ítem (`elegirDeNivel` mezcla los inferiores): «mesa» con «Nivel 3» es lo diseñado.
- (de la 196, segunda pasada, 14-11) **Los sustitutos de una reabierta se revisan como ítems nuevos**, no como «hecho»: en la tercera de la 135, *triunfo*
  (por *Luis*) metió otra palabra con dos respuestas (*triunfó*) y la frase nueva de *proporcional* quedó sin concordancia. En los ej. 2 y 3 (palabra
  suelta), la prueba es poner la tilde en cada vocal o sílaba y buscar cada forma en el DLE; en el ej. 4, leer la frase completa con la buena puesta.
- (de la 196, segunda pasada) **El candado del hook sobrevive 30 min al cierre de la sesión anterior**: la ficha y la ENTREGA quedan reservadas por
  ella aunque su reclamo esté CERRADO. Si reclamas la 196 justo después de otra pasada, deja estas dos ediciones para el final y espera con un Monitor
  que compare `date -u +%H%M` (en las sesiones del lanzador, `sleep` en segundo plano vuelve al instante y un `sleep` largo en primer plano lo bloquea
  el entorno). El `sleep 30` del reclamo puede no esperar: vuelve a listar `hechos/reclamos/` un rato después.
- (de la 196, tercera pasada, 14-11) **Sin Claude in Chrome, el DLE no se abre de ninguna manera**: el modo automático deniega un `curl` a
  `dle.rae.es`, y esa denegación vale para cualquier otra vía. Si la sesión no trae las herramientas de Chrome, coteja de cabeza solo lo que no
  sea dudoso (la conjugación entera del verbo, por ejemplo) y lo dudoso va a la reabierta marcado «comprobar».
- (de la 196, tercera pasada) **El guion de clics de la 192 no pasa `&nivel=`** y no deja forzar un ítem: para ver uno concreto, pulsa «No lo sé» y
  «Siguiente» en bucle hasta que salga (el texto de `#item` lleva las letras separadas: quita los espacios antes de buscar). Y dentro de una
  plantilla de JS que mandas con `Runtime.evaluate`, `/\s+/` llega como `/s+/` y se come las eses del volcado: no es la práctica.

## Prohibido (propio de esta tarea)

- Corregir un bloque más allá del recorte de ≤ 5 ítems: se reabre.
- Proponer la ampliación como ★ de ninguna semana.
- Publicar otras prácticas, o tocar en `catalogo.js` algo que no sea `disponible` de las filas 64, 67 y 68.
- Crear tareas en el panel o en `tareas.js`, o editar el calendario del curso.

## Reglas de contenido de la ortografía

Las de la ficha de la 142 (`$R/tareas/tarea-142-publicar-ortografia-3.md`, «Reglas de contenido de la ortografía», nueve reglas copiadas
de `proyecto.md`), que **se leen enteras antes de empezar**. Lo que más se mira: solo español; ninguna opción que la RAE admita también;
tres niveles con ≥ 16 ítems (≥ 12 en los de tocar piezas) y equilibrados; frases cortas con nombres inventados; feedback con la regla
aplicada a esa palabra; `error` estable por confusión; dudas al DLE, al DPD o a la FundéuRAE, y lo dudoso, fuera.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): deja lo publicado en un
estado coherente (un bloque publicado y comiteado vale aunque los otros queden sin revisar),
escribe `$R/hechos/notas/<sid>-traspaso-196.md` con el estado exacto,
`$R/hechos/fallos/196--<sid>.md` con `parada por: sesión agotada` y la ruta de esa nota, y
`ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada**, tú no la recortas:
termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el tamaño real y el
corte natural, `$R/hechos/fallos/196--<sid>.md` con `parada por: mal cortada` y la ruta de la
incidencia, `ABANDONADA` en tu reclamo, y díselo al usuario. Si un paso te pide **decidir**
algo que va a durar, no lo decidas: entrégalo como hallazgo para Juan Luis en tu terminada.

## Al terminar

Por este orden (el del repositorio git):

1. Los tests de «Siguiente paso», 3, en verde y `npm test` sin fallos en tus ficheros.
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas:
   `git add <rutas> && git commit -m "Publicadas las tildes, palabras que se confunden y ampliación (tarea 196)" -- <rutas>`
   (ajusta el mensaje a lo que de verdad publiques). Apunta el hash (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/196-publicar-ortografia-4/ENTREGA.md` y su marcador vacío `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/196--<sid>.md`: hash del commit, ficheros (lo que dice `git show --stat`), qué se publica y qué se
   reabre, tests, hora y **duración real**, y propuestas pendientes si las hay.
5. Añade `CERRADA` a tu reclamo (línea propia que empieza por esa palabra).
6. Choques encontrados → `$R/hechos/incidencias/<sid>.md`.
7. `git fetch origin`, relista `$R/hechos/` **ahora** y regenera `$R/_ESTADO.md` entero (el guion de la coordinadora).
8. Vuelca abajo, en «Trampas conocidas» de esta ficha, lo que hayas aprendido por las malas.
9. Un solo commit con rutas explícitas de tus ficheros de `$R/hechos/` (por sid), tu carpeta de `$R/salidas/`, `$R/_ESTADO.md` y esta
   ficha, y `git push origin main`. Si el push se rechaza: `git pull --rebase origin main` (nunca `--autostash`), regenera el tablón
   otra vez desde `hechos/` y vuelve a comitear y empujar.
10. Dile al usuario la **foto del momento** en tres líneas y, **solo para las LIBRES**, las frases de arranque de `proyecto.md`
    literales, en bloques de cita, con la banda traducida y el nombre de sesión delante.
11. Decide si encadenas la 195 (solo en verde y si su precondición se cumple). Si encadenas, «Antes de empezar» entero otra vez.

Si paras sin terminar: `$R/hechos/fallos/196--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni `practicas/_comun/` (esta, solo `disponible` de tres filas de
  `catalogo.js`), ni `css/estilos.css`, ni `firestore.rules` ni `src/firebase.js`, ni fichas ajenas, ni nada de la carpeta de apuntes de
  iCloud. Si la base te falta algo, se propone en la terminada; no se parchea.
- `git add .`, `git add -A`, `git commit -a`, o un `add` separado del `commit`. El índice
  es compartido con otras sesiones del mismo árbol. Nunca `git stash`, `--autostash`,
  `git checkout -- .` ni `git reset --hard`.
- Editar el código con `sed -i` o heredocs desde el shell: el candado de sesiones solo
  ve Edit/Write. El código se edita con las herramientas de edición; `hechos/` sí se escribe desde el shell (un escritor).
- Reescribir un fichero de `hechos/` (solo `>>`), editar un reclamo ajeno, o regenerar el
  tablón de memoria sin relistar `hechos/`.
- Dependencias nuevas (npm, CDN).
