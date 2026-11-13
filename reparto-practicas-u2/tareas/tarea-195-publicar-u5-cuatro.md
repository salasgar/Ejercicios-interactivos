# Tarea 195 · Publicar `lee-decimales` (57), `compara-decimales` (58), `suma-resta-decimales` (59) y `multiplica-divide-decimales` (60) tras sus reabiertas del 8-11, con las propuestas de las tareas de las semanas 1 y 2 de la unidad 5 al día

Actualizado: 2026-11-13 (alta de la coordinadora s-20261111T215225-39c1f4f5, pedida por Juan Luis: «Da de alta una tarea de publicación (ALTO), como la 169»; la 130 y la 131 las reabrieron el 8-11 y las dejaron sin publicador; sus reabiertas cerraron el 8-11 y el 9-11)
Precondición: las **reabiertas del 8-11** de 123, 124 (las dos), 125 y 126 cerradas con terminada nueva (lo están: `hechos/terminadas/123--s-20261108T101900-95a51c60.md`, `124--s-20261109T095406-0d17b1b5.md`, `125--s-20261108T102903-1fbe12d4.md`, `126--s-20261108T111949-3e8570e4.md`) · **190 LISTA** (revisa el «No lo sé» de estas cuatro y hereda sus carpetas; hoy RELEVABLE: publicar después, para probar con clics la versión final) · **no en paralelo con la 196** ni con ninguna otra que toque `catalogo.js` o `docs/practicas-unidad5.md` (hoy: 132, 156-159, 196; mira los reclamos vivos, paso 2 de «Antes de empezar») · Disparo: MANUAL · **Plazo: semana 1 publicada antes del jue 14-1 y semana 2 antes del jue 21-1** (la U5 empieza el lun 18-1; la 132 monta las tareas en el panel con esta ENTREGA). La portada no enseña la U5 hasta el 18-1: publicar antes no las pone delante de nadie; ideal antes de Navidad.
Duración esperada: 1 h 15 min (tiempo de sesión, no de persona; la 130 revisó cuatro en ~32 min y la 131 tres en ~15 min, encadenadas) · Banda de modelo: ALTO · Encadenable con: 196
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/195-publicar-u5-cuatro/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/catalogo.js` (solo `disponible` de las filas 57, 58, 59 y 60), `docs/practicas-unidad5.md` (la línea «**Publicadas** (a …)», las menciones de las reabiertas y el §7 con `registro.js`, propuesta 1 de la 131); y, solo para una errata de texto de una línea, `practicas/<slug>/textos.js` de una de las cuatro (declarándolo en la terminada, como la 119)

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
   **Comprueba la precondición en el disco, no solo en el tablón**: las cuatro terminadas de arriba, ninguna reabierta de 123-126
   posterior a ellas (`ls $R/hechos/reabiertas/ | grep -E '^12[3-6]--'` y mira su fecha), la 190 con terminada (`ls $R/hechos/terminadas/ | grep '^190--'`),
   ningún reclamo vivo de una tarea que toque `catalogo.js` (`grep -l 'catalogo.js' $R/tareas/*.md` da las fichas; cruza sus números
   con `ls $R/hechos/reclamos/`), y `git status --short practicas/_comun/catalogo.js docs/practicas-unidad5.md practicas/lee-decimales practicas/compara-decimales practicas/suma-resta-decimales practicas/multiplica-divide-decimales`
   tiene que salir **vacío**. Si algo sale modificado, es trabajo de otra sesión: no lo toques y no reclames.
3. Abre tu reclamo generando el sid **en el mismo comando** (probado en este Mac):
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -d '+150 minutes' +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -v+150M +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 195\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/195--$sid.md; echo $sid
   ```
   (150 min = 2 × la duración esperada). A partir de aquí tu sid es el del nombre de ese
   fichero (`ls $R/hechos/reclamos/195--*`); no lo guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 195 con `abierto:` más antiguo (o igual y sid menor), añade a tu
   reclamo una línea `CEDIDA a <sid del otro>` y elige otra tarea. Mira también que no haya
   ningún reclamo vivo de una tarea que toque `catalogo.js` (lista de la precondición): si lo
   hay, `CEDIDA (catalogo.js en uso por la NN)` y para.
5. Si el reclamo que encuentras está caducado (RELEVABLE en el tablón), relévalo con la
   línea `releva a: <sid anterior>` **en tu propio reclamo**; el suyo no se toca. Después
   mira qué dejó hecho: `git log --oneline -5`, `git status -sb`, la carpeta de salida, su scratchpad (`ls -d /tmp/*/`) y
   `grep -n "slug: '\(lee-decimales\|compara-decimales\|suma-resta-decimales\|multiplica-divide-decimales\)'" practicas/_comun/catalogo.js`.
   Lo que haya con tests en verde se hereda y se dice en la terminada; lo que no, se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** (todas las filas contra `hechos/` y la
   hora real; banda y «encadenable» recopiadas de las fichas; el guion de la coordinadora,
   `$R/hechos/notas/s-20261111T215225-39c1f4f5-regenerar-tablon.py`, lo hace: uso en su cabecera) antes de empezar, y sigue
   con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/195--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

`lee-decimales`, `compara-decimales` y `suma-resta-decimales` (semana 1 de la U5) y `multiplica-divide-decimales` (semana 2) siguen
sin publicar. La 130 (8-11) reabrió las tres primeras porque sacaban casos del examen 1 (sus huellas estaban vacías: las prácticas se
escribieron antes que los exámenes), y la 131 reabrió la cuarta por U5-2C-17 y el final. Las reabiertas se cerraron el 8-11 y el 9-11
(la de `compara-decimales`, en dos vueltas: la segunda llevaba el añadido del examen 2), pero **ninguna tarea las publicaba**: eso es
esta. Las otras tres de la U5 (`leelo5`, `fraccion-decimal`, `errores5`) ya están publicadas (131); `leelo5` tiene una reabierta de la
190 del 13-11 que **no es de esta tarea**.

Después, las tareas 173 y 174 les pusieron el botón «No lo sé» y la 190 lo revisó (commits del 13-11 en las cuatro carpetas). Por eso
la prueba con clics se hace **después** de que la 190 cierre: es la última versión la que verán los alumnos.

Es la revisión que no puede hacer un test: el significado y el clic. Verifica y, si algo falla **según el criterio de abajo**, **reabre; no
corrige** (salvo erratas de una línea en un texto, que se arreglan y se dicen). La que no pase se queda sin publicar con su reabierta nueva,
y las demás se publican igual. Sin esta publicación no puede avanzar la 132 (las dos tareas de la U5 en el panel), ni, detrás, la tarea
24 del reparto de la U5 (Classroom).

### Criterio de reapertura (el de la 169, decisión de la coordinadora del 11-11; lo puede cambiar Juan Luis)

- **Se reabre** solo por un caso del papel que la práctica **pregunta** con los mismos datos: el mismo enunciado o cuenta, en cualquier
  orden de los términos y con el signo en cualquier operando; la respuesta de un caso de examen pedida tal cual; un paso que el ítem pide
  explícitamente y que es el caso entero del examen. También, por supuesto, por la regla de oro, el realismo o un fallo en pantalla.
- **No se reabre** por un **paso compartido que el ítem no pregunta**, por una **opción que está bien** de un «¿cuál está mal?», ni por ver
  el mismo decimal en otra tarea (el 2,6 de un listón no es el 2,6 de un cambio de unidad). Ver los mismos números en otra tarea no
  enseña la respuesta del examen.
- **Variedad** (decisión de Juan Luis del 13-11, por el ej. 5 de `suma-resta`): si un ejercicio repite un mismo ítem en más del 10 % de
  20000, se reabre (corta, MEDIO) aunque todo lo demás esté bien; mídelo en el barrido.
- **Si reabres una**, la terminada empieza por `PARCIAL:` (como la de la 121) y dice qué queda; cuando su reabierta esté cerrada, esta misma
  tarea se vuelve a reclamar (reclamo nuevo, «Antes de empezar» entero) para revisar **solo lo reabierto** y publicarla.

## Siguiente paso

1. Lee las ENTREGA de la 130 y la 131 (`$R/salidas/130-publicar-u5-semana1/ENTREGA.md`, `$R/salidas/131-publicar-u5-semana2/ENTREGA.md`:
   cómo probaron, qué barrido hicieron, las dos propuestas de tarea semanal y los hallazgos), las reabiertas del 8-11
   (`$R/hechos/reabiertas/12[3-6]--s-20261108T095958-d9654cd4-revision*.md`: qué fallaba y «Tiene que quedar»), las terminadas que las
   cierran (precondición), las ENTREGA de las cuatro prácticas (`$R/salidas/12[3-6]-*/ENTREGA.md`, apartado del 8-11 o 9-11), las
   terminadas de la 173, la 174 y la 190, y `docs/practicas-unidad5.md`.
2. Mira si el papel ha cambiado desde el último barrido (9-11): `find "<base>/5. Decimals/exámenes-semanales" "<base>/5. Decimals/examen-final" "<base>/5. Decimals/hojas-de-ejercicios" -type f \( -name '*.tex' -o -name '*.tsv' \) -newermt '2026-11-09 18:15'`
   (`<base>` = `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue`). **El 9-11 se
   renombraron los `.tex` de los exámenes semanales** (`examen-semanaN*.tex` → `examen-u5-semanaN*.tex`, tarea 30 del reparto de la U5,
   commit 93cd37d de la carpeta de apuntes, que es un repositorio git): compruébalo con `git -C "<base>" show --stat 93cd37d`; el
   13-11 no había ningún otro commit en esas carpetas desde el 8-11. Si sale algo, ese fichero entra entero en el barrido.
3. `node --test tests/practicas-comun.test.js tests/practicas-lee-decimales.test.js tests/practicas-compara-decimales.test.js tests/practicas-suma-resta-decimales.test.js tests/practicas-multiplica-divide-decimales.test.js`
   y `npm run servir` (o `python3 -m http.server 81NN` si el 8080 está ocupado); abre cada práctica por su URL
   (`http://localhost:8080/practicas/<slug>/`) con «Probar sin código» (nunca el código de un alumno ni `AJJN`).

## Qué hay que hacer

1. **Lo que pedían las reabiertas del 8-11, comprobado de verdad**: que ningún caso del examen 1 (y del repaso del examen 2: U5-1C-08,
   1C-10, 1C-13, 1C-16), del examen 2 (U5-2C-17 en `multiplica-divide-decimales`), de las hojas 1 y 2 ni de los `.tex` del final
   (también `adaptado-A`, `modeloK-dislexia` y `recuperacion`) sale en ningún ejercicio de las cuatro, en ningún orden. **Con tu propio
   barrido**, no con la clave de la práctica: un guion **en el scratchpad** (nunca en el repo) que lee los casos de
   `casos-examen-semana{1,2}.tsv` (con la columna `correcta`), de los `examen-u5-semanaN*.tex`, de los `.tex` del final y de las dos
   hojas sin recuadros de apoyo, y genera 20000 ítems por ejercicio con las funciones de su `logica.js`. El modelo es el de la 130
   (familias: decimal suelto, pareja, conjunto, redondeo, cálculo sin orden, compra, medida, movimiento de la coma). Antes de fiarte de
   un cero, pasa por tu lector las listas que la práctica ya excluye. En la ENTREGA, solo recuentos. Mide también la **variedad**
   (el ítem más repetido de cada ejercicio, en %).
2. **Regla de oro, a mano**, en los ejercicios que cambiaron y una muestra de los demás: al menos 30 ítems por ejercicio, leyendo cada
   distractor (¿podría darse por bueno?), comparando **por valor** con `_comun/decimales.js` (0,5 = 0,50 = 1/2: la misma respuesta).
   Realismo con las cotas del acta sobre 3000 ítems (fruta al peso 0,80-6 € el kilo y de 0,5 a 5 kg; gasolina 1,20-2,00 € el litro y
   de 5 a 70 L; los cambios de unidad, solo los del acta).
3. **En el navegador**, con clics de ratón (nunca Intro), a 375 px y en ancho, en español y en inglés: un ítem acertado y uno fallado de
   **cada** ejercicio de las cuatro (4 + 4 + 4 + 6 = 18), mirando que el feedback dice qué ha pasado con esos números, la coma en
   español y el punto en inglés, y que no hay excepciones en la consola. Pulsa también **«No lo sé»** una vez en cada ejercicio de
   procedimiento (lo puso la 173/174 y lo revisó la 190): que la explicación sale y que el ítem siguiente es otro.
4. **Publicar**: `disponible: true` en `catalogo.js` de las que pasen (filas 57, 58, 59 y 60; nada más de ese fichero). Commit con rutas
   explícitas. La portada oculta la U5 hasta el 18-1, así que la comprobación es por URL y, si hace falta, cambiando la fecha solo en tu
   guion de prueba (nunca en el código). En `docs/practicas-unidad5.md`, la línea de publicadas, las menciones de las reabiertas y el §7
   (U5-2C-14 y 2C-15 ya tienen práctica: ej. 6 de `multiplica-divide-decimales`, propuesta 1 de la 131).
5. **Las dos propuestas de tarea semanal, al día**: di en la ENTREGA si el plan A de la 130 (semana 1: 7 ★ + 3 a elegir,
   `['ortografia', 8]`, entrega jue 21-1 23:59) y el de la 131 (semana 2: 8 ★ + 2 a elegir, `['ortografia', 9]`, entrega mié 27-1
   23:59) valen tal cual ahora, o qué cambia; si una práctica no se publica, el plan B. Mira que todo lo que citan esté publicado en el
   `catalogo.js` de ese momento y que cada tarea puntúa sobre 100 (tarea 166: cada ejercicio que cuenta pesa 100 / (★ + a elegir)).
   Como `leelo5` tiene una reabierta abierta del 13-11, di si las propuestas la necesitan y qué pasa si no ha cerrado. **Juan Luis las
   monta en el panel** (tarea 132, el siguiente paso); tú no las creas.

## Datos de entrada

- El inventario y el acta de la unidad 5, solo lectura: `apuntes-1eso-bilingue/5. Decimals/inventario-unidad5.tsv` y
  `apuntes-1eso-bilingue/5. Decimals/inventario-unidad5-revision.md` (ruta base: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/`).
- Carpeta de la unidad, solo lectura: `apuntes-1eso-bilingue/5. Decimals/` — `exámenes-semanales/semana-{1,2}/casos-examen-semanaN.tsv`
  y sus `examen-u5-semanaN*.tex`, `examen-final/*.tex`, `hojas-de-ejercicios/hoja-unidad5-semana{1,2}.tex`: casos que no se copian.
- Las ENTREGA de 123-126, 130, 131 y 190 (solo lectura).

## Cómo saber que ha terminado

- Cada una de las cuatro prácticas, o publicada (`disponible: true` en el `catalogo.js` comiteado y empujado) o con una reabierta nueva en
  `hechos/reabiertas/` y el motivo concreto según el criterio de reapertura (ítem, distractor, por qué; nunca un caso de examen en claro),
  y entonces la terminada empieza por `PARCIAL:`.
- `npm test` sin fallos.
- Las dos propuestas confirmadas o corregidas en la ENTREGA, y dichas a Juan Luis en tu último mensaje con sus fechas y con el aviso de
  que la 132 ya puede montarlas (si todo se publica), con la frase de arranque de la 132.

## Trampas conocidas

- (de la 130, 8-11) **Las cuatro se escribieron antes que los exámenes** y dejaron sus huellas vacías. El cotejo que las encontró es un
  barrido propio por familias (`/tmp/pu2-130/` en su día: `extraer.py`, `preciso.mjs`, `huellas.mjs`; si aún existe, cópialo a tu
  scratchpad y vuelve a correrlo, con los nombres nuevos de los `.tex`). Un barrido «por bolsa de números» sin familia da cientos de
  falsos positivos.
- (de la 130) **El examen semanal 2 repasa la semana 1** (U5-1C-08, 1C-10, 1C-13, 1C-16): cotéjalo también para las tres de la semana 1.
- (de la 130) **La hoja escribe casos con palabras** («siete milésimas») y la recta con flechas en TikZ: fuera de `$…$`, se escapan a
  quien extrae números.
- (de la 130) **Un ejemplo inventado puede ser un caso de examen**: antes de comitear la ENTREGA, las reabiertas o los docs, busca en ellos
  todos los decimales de los casos (pasó tres veces en la 130).
- (de la 130) Tras «Probar sin código» hay que pulsar «Empezar»; `#salir` («← Ejercicios») recarga el menú si un selector genérico lo
  pulsa; en zsh, `for s in "a 4"` no parte en palabras.
- (de la coordinadora, 13-11) **Los `.tex` de los exámenes semanales de la U5 cambiaron de nombre el 9-11** (`examen-u5-semanaN*.tex`). Un
  guion copiado de la 130 que busque los nombres viejos no lee **ningún** examen y da cero coincidencias sin avisar: cuenta los casos que
  lee de cada fichero.
- (de la coordinadora, 13-11) La reabierta de `leelo5` del 13-11 (`hechos/reabiertas/129--s-20261113T085456-88ebbbda-revision.md`) la
  escribió la 190 y estaba **sin commitear** ese día: no es tuya; no la toques ni la comitees.
- (de la 119) **No compruebes la exclusión con la clave de la práctica, sino con una tuya, sacada de los datos**: decimales con signo,
  operación y orden, y las sumas **sin orden**.
- (de la 119) **Un caso excluido en un ejercicio puede salir en otro con otra clave**: cruza cada destreza con todos los ejercicios que
  puedan generar sus datos, no solo con el que la cita.
- (de la 115) Clic de verdad en Chrome headless: `Input.dispatchMouseEvent` (moved, pressed, released) en el centro del
  `getBoundingClientRect()` del botón visible, no `element.click()`. Tras un acierto la base pasa sola al siguiente ítem.
- (de la 169) **Guion de clics que no se queda viejo**: importa en la página las funciones de texto de la propia práctica
  (`await import('/practicas/<slug>/textos.js')`) y compara su texto con el de la pantalla, en vez de leer el enunciado con expresiones
  regulares. El idioma alterna **por bloques**: haz otra pasada hasta ver los dos.
- (de la 163) El 8080 suele estar ocupado por el servidor de otra sesión: levanta el tuyo en otro puerto y copia un perfil de Chrome ya
  usado (borra sus `Singleton*`). Con un perfil nuevo la primera carga de la portada pasa de 30 s (Firebase por CDN).
- (de la 162) `npm test` con otras sesiones en la máquina puede tardar más de 20 min: estira la caducidad **antes** de lanzarlo.
- (de la coordinadora, 5-11) **Hay ENTREGA antiguas con casos de examen en claro**: no copies a tu ENTREGA frases de ENTREGA anteriores
  sin leerlas.
- (de la coordinadora, 5-11) `catalogo.js` lo comparten muchas tareas: edita, comitea con ruta explícita y suéltalo enseguida.
- (de la 109) Si `npm test` falla por el `disponible`, mira cómo lo resolvió la 109 (26306eb); si aun así falla un test que no es de tus
  ficheros, no lo arregles: dilo en la terminada.

## Prohibido (propio de esta tarea)

- Corregir el código de una práctica (más allá de una errata de texto de una línea): se reabre.
- Reabrir por lo que el criterio de reapertura deja fuera.
- Publicar otras prácticas, o tocar en `catalogo.js` algo que no sea `disponible` de las filas 57, 58, 59 y 60.
- Comitear `catalogo.js` si `git status` lo da modificado por otra sesión antes de tu cambio.
- Crear las tareas de la semana en el panel o en `tareas.js`: las propuestas son para Juan Luis (tarea 132).
- Cambiar `UNIDADES` o la fecha desde la que la portada enseña la U5.
- Escribir un caso de examen en claro (en la ENTREGA, en un test, en un comentario, en un mensaje de commit).

## Reglas de contenido de la unidad 5

Las de la ficha de la 130 (`$R/tareas/tarea-130-publicar-u5-semana1.md`, «Reglas de contenido de la unidad 5», diez reglas copiadas del
acta), que **se leen enteras antes de empezar**; si discrepan del acta
(`/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/5. Decimals/inventario-unidad5-revision.md`),
manda el acta. Lo que más se mira en esta tarea: un mismo número tiene muchas escrituras y todas son la misma respuesta (por valor,
con `_comun/decimales.js`, nunca con `Number`); ni porcentajes, ni letras, ni lo de una sesión posterior; coma en español y punto en
inglés; regla de oro con los errores típicos de `ERRORES_TIPICOS`; las cotas de realismo del acta; los casos del papel, fuera (los de
los exámenes, por huella).

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja lo
publicado en un estado coherente (una práctica publicada y comiteada vale aunque las otras
queden sin revisar), escribe `$R/hechos/notas/<sid>-traspaso-195.md` con el estado exacto
(qué está hecho, qué falta, qué has descubierto, en qué orden seguir),
`$R/hechos/fallos/195--<sid>.md` con `parada por: sesión agotada` y la ruta de esa nota, y
`ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada**, tú no la recortas:
termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el tamaño real y el
corte natural, `$R/hechos/fallos/195--<sid>.md` con `parada por: mal cortada` y la ruta de la
incidencia, `ABANDONADA` en tu reclamo, y díselo al usuario. Si un paso te pide **decidir**
algo que va a durar (quitar más casos que los del papel, cambiar cotas o el número de
ejercicios), no lo decidas: entrégalo como hallazgo para Juan Luis en tu terminada y sigue
con lo que no dependa de ello.

## Al terminar

Por este orden (el del repositorio git):

1. Los tests de «Siguiente paso», 3, en verde y `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con reclamo vivo
   no es tuyo: anótalo en la terminada).
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas:
   `git add <rutas> && git commit -m "Publicadas lee-decimales, compara-decimales, suma-resta-decimales y multiplica-divide-decimales (tarea 195, U5)" -- <rutas>`
   (ajusta el mensaje a lo que de verdad publiques). Apunta el hash (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/195-publicar-u5-cuatro/ENTREGA.md` (veredicto por práctica, hash, recuentos del barrido sin casos en claro,
   variedad, cómo se probó en el navegador, las dos propuestas al día y los hallazgos fuera de criterio) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/195--<sid>.md`: hash del commit, ficheros (lo que dice `git show --stat`, no lo que crees),
   qué se publica y qué se reabre, tests, hora y **duración real** (de `abierto:` a ahora), y propuestas pendientes si las hay.
5. Añade `CERRADA` a tu reclamo (línea propia que empieza por esa palabra).
6. Choques encontrados → `$R/hechos/incidencias/<sid>.md`.
7. `git fetch origin`, relista `$R/hechos/` **ahora** y regenera `$R/_ESTADO.md` entero (el guion de la coordinadora). Anota qué tareas
   pasan de BLOQUEADA a PENDIENTE (la 132). Si tu duración real difiere mucho de la estimada, díselo al usuario.
8. Vuelca abajo, en «Trampas conocidas» de esta ficha, lo que hayas aprendido por las malas (es lo único de la ficha que editas,
   además de la duración).
9. Un solo commit con rutas explícitas de tus ficheros de `$R/hechos/` (por sid), tu carpeta de `$R/salidas/`, `$R/_ESTADO.md` y esta
   ficha, y `git push origin main`. Si el push se rechaza: `git pull --rebase origin main` (nunca `--autostash`), regenera el tablón
   otra vez desde `hechos/` (no lo fusiones a mano) y vuelve a comitear y empujar.
10. Dile al usuario la **foto del momento** en tres líneas («EN CURSO: … · LIBRES ahora: … · BLOQUEADAS: …»), sacada de la lectura de
    `hechos/` del paso 7, y después, **solo para las LIBRES**, las frases de arranque de `proyecto.md` literales, en bloques de cita,
    una por sesión que quepa a la vez, con la tarea o la cadena, la banda traducida y el nombre de sesión delante.
11. Decide si encadenas la 196 (solo en verde: misma banda, sin esperas, y si su precondición se cumple). Si encadenas, «Antes de
    empezar» entero otra vez, con reclamo nuevo, y di el nombre nuevo que te toca.

Si paras sin terminar: `$R/hechos/fallos/195--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni
  `practicas/_comun/` (salvo las tareas que lo declaran, cada una en lo suyo; esta, solo `disponible` de cuatro filas de `catalogo.js`), ni `css/estilos.css`, ni `README.md`, ni
  `firestore.rules` ni `src/firebase.js`, ni fichas ajenas, ni nada de la carpeta de apuntes de iCloud. Si la base te falta algo,
  se propone en la terminada; no se parchea.
- `git add .`, `git add -A`, `git commit -a`, o un `add` separado del `commit`. El índice
  es compartido con otras sesiones del mismo árbol. Nunca `git stash`, `--autostash`,
  `git checkout -- .` ni `git reset --hard`.
- Editar el código con `sed -i` o heredocs desde el shell: el candado de sesiones solo
  ve Edit/Write, y así otra sesión no sabe que el fichero está en uso. El código se edita
  con las herramientas de edición; `hechos/` sí se escribe desde el shell (un escritor).
- Reescribir un fichero de `hechos/` (solo `>>`), editar un reclamo ajeno, o regenerar el
  tablón de memoria sin relistar `hechos/`.
- Dependencias nuevas (npm, CDN).
- Las reglas de contenido de la unidad: opciones del mismo valor, porcentajes, letras, algo de una sesión posterior a la de la destreza,
  distractores que puedan ser verdad, casos del papel.
