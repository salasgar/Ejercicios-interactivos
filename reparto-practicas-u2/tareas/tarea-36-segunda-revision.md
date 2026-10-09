# Tarea 36 · Segunda revisión: comprobar que las 28 reaperturas corrigieron lo que se pedía y no rompieron nada

Actualizado: 2026-10-08
Precondición: las 28 reabiertas por la 18 con terminada posterior, o con el código comiteado y el reclamo caducado (30 y 33; ver «Trampas conocidas») · Disparo: MANUAL (sesión atendida)
Duración esperada: 2 h (real: 1 h 55 min, 45 de ellos esperando a iCloud; tiempo de sesión, no de persona; la 18, que leyó las 31 prácticas enteras, tardó 43 min con seis revisores en paralelo) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/36-segunda-revision/` (`VEREDICTO.md`, `HALLAZGOS-FUERA-DE-CRITERIO.md`, `ENTREGA.md` y sus marcadores)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/catalogo.js` (**solo** el campo `disponible`, y solo para retirar de la portada una práctica con hallazgo grave). Ningún otro fichero de código.

La duración esperada no es informativa: de ella sale la caducidad del reclamo (2 ×, mínimo
45 min), el plazo tras el cual otra sesión puede relevarte si te cortas. **Este fichero es
la fuente de la banda**: el tablón la copia de aquí cada vez que se regenera. La banda
dice con qué modelo conviene abrir la sesión; la tabla de bandas de `proyecto.md` la
traduce al menú de hoy (ALTO = Opus 5, esfuerzo Alto; MEDIO = Sonnet 5, esfuerzo Medio).

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
   printf 'sesión: %s\ntarea: 36\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/36--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/36--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 36 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/36--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

La tarea 18 revisó las 31 prácticas y reabrió 28. Las 28 se corrigieron la tarde del
2026-10-08, en paralelo y deprisa (entre 2 y 45 minutos cada una), y **nadie ha vuelto a
mirar esas correcciones**: cada sesión declara «HECHO» punto por punto, pero quien corrige
no es quien verifica. Esta tarea es esa verificación, limitada a lo que cambió. Es ALTO
porque juzga significado (regla de oro) y porque es la última mirada antes de que Juan Luis
mande las prácticas a los alumnos como tarea semanal.

## Siguiente paso

`git log --oneline 6a0359e..HEAD -- practicas/ tests/ divisores/` para ver los commits de la
tarde, y `ls reparto-practicas-u2/hechos/reabiertas/ reparto-practicas-u2/hechos/terminadas/`
para emparejar cada reabierta con su terminada (la de sid `s-20261008T17…` o `T18…`).

## Qué hay que hacer

Para cada una de las 28 tareas (02 03 04 05 07 08 10 11 12 13 14 15 16 19 20 21 22 23 24 25
26 27 28 29 30 31 32 33), con su reabierta `hechos/reabiertas/NN--s-20261008T051928-1cba9950.md`
(la 20 tiene además `20--s-20261008T174225-f75f5cdb.md`, con una decisión de Juan Luis) y el
diff de su práctica `git diff 6a0359e..HEAD -- practicas/<slug>/ tests/practicas-<slug>.test.js`:

1. **Cada punto de «Qué corregir» está hecho de verdad**, leyendo el código de hoy, no la
   terminada. Los puntos graves se reproducen con un script propio (generar 2000 ítems y
   contar los que caen en el defecto que describía la reabierta: tiene que dar 0). Un punto
   que la terminada declara «a medias» o «no hecho» se juzga: ¿vale así o hay que reabrir?
2. **La corrección no ha traído un defecto nuevo.** Regla de oro en todo ítem, opción,
   plantilla o mensaje que el diff añade o cambia: ¿puede defenderse alguna opción dada por
   falsa?, ¿se rechaza alguna respuesta verdadera?, ¿dice el feedback algo falso? Y las
   reglas de contenido de `proyecto.md` sobre las líneas añadidas (`×`, HCF, «factor» como
   relación, letras, «primos entre sí», decimales o negativos sin dar).
3. **Lo que no había que rehacer sigue intacto**: el apartado «Qué NO rehacer» de cada
   reabierta contra el diff. Si el diff toca eso, se mira con lupa.
4. **Las «decisiones de Juan Luis» no se han tocado sin su decisión**, salvo la de la 20
   (tomada el 2026-10-08: operar primero algo independiente no es fallo; comprobar con
   `3² + 5 · 4`, `10 − 4 + 6 · 16`, `2 + 3 · 4`, `20 : 4 · 5`) y la de la 30 (por defecto,
   «lápiz y papel» habiendo atajo cuenta como pista).
5. **El contador por puntos** (commit 58a9da2, posterior a las reabiertas): ningún texto de
   las prácticas habla ya de «aciertos seguidos», «+2» o «20» como objetivo; ninguna declara
   `inicial` ni `maximo`.
6. **Móvil**, solo en las prácticas cuya reabierta tenía un punto de pantalla (05, 08, 12,
   13, 16, 27, 28, 29, 30, 33 y las que diga el diff de `estilos.css`): 375 × 667, español e
   inglés, nada se sale. Medir contra 375 fijo, no contra `window.innerWidth`.
7. **El incidente del autostash** (`hechos/incidencias/s-20261008T175319-8ec41ac6.md`): a las
   17:58Z un stash se llevó trabajo sin comitear de las tareas 08, 12, 15, 20 y 32, entre
   otras. Comprobar que nada quedó perdido: `git diff 58bd3a4 HEAD -- <rutas de la
   incidencia>` y, donde `HEAD` tenga MENOS que el stash, decidir si falta algo.
8. **`npm test` entero en verde** y, por práctica, que el test nuevo o cambiado comprueba de
   verdad lo que la reabierta pedía (un test que no fallaría con el código viejo no vale).

**No corrijas nada.** Las carpetas de las prácticas son de sus tareas. Por cada práctica con
hallazgo escribes `hechos/reabiertas/NN--<tu sid>.md` con lo exacto que hay que corregir y lo
que no hay que rehacer, y su gravedad. Si el hallazgo es GRAVE (se penaliza una respuesta
correcta, hay dos respuestas defendibles, o no se puede contestar), pones además
`disponible: false` en su fila de `practicas/_comun/catalogo.js` y lo dices en la reabierta.

Reparte la lectura en revisores de solo lectura bajo tu sid (cinco o seis prácticas cada
uno, con un encargo común escrito que incluya esta lista), y **verifica tú en el código cada
hallazgo que te devuelvan** antes de reabrir: vuelven con el mismo aplomo los buenos y los
dudosos.

## Datos de entrada

- `hechos/reabiertas/*`, `hechos/terminadas/*`, `salidas/18-revision-final/VEREDICTO.md` y
  `HALLAZGOS-FUERA-DE-CRITERIO.md`.
- `hechos/notas/s-20261008T174225-f75f5cdb.md` (coordinadora) y
  `hechos/notas/s-20261008T173817-contador-contador-por-puntos.md`.
- `practicas/` y `tests/` (solo lectura, salvo lo declarado arriba).

## Salida esperada

Dos salidas separadas, las dos en `reparto-practicas-u2/salidas/36-segunda-revision/`:

- `VEREDICTO.md` + `.ok-<sid>`: una fila por tarea, SE ENTREGA / NO SE ENTREGA, con cada
  punto de su reabierta marcado COMPROBADO / NO HECHO / HECHO A MEDIAS (y si vale así), los
  defectos nuevos, y la reabierta que los recoge.
- `HALLAZGOS-FUERA-DE-CRITERIO.md` + `.ok-<sid>`: lo que veas y no esté entre los ocho
  puntos de arriba, **dicho también a Juan Luis en el mensaje de cierre como decisiones
  pendientes**, no enterrado en el fichero.
- `ENTREGA.md` + `.ok-<sid>`.

## Cómo saber que ha terminado

- Las 28 tienen veredicto; cada NO SE ENTREGA tiene su `reabiertas/` con tu sid.
- `npm test` en verde; ninguna práctica con hallazgo grave sigue enlazada en la portada.
- `git push` hecho.

## Trampas conocidas

- **La 30 (mental) y la 33 (propiedades) no tienen terminada**: su sesión comiteó el código
  (dcc3821 y 99576ba) y se quedó esperando el candado de `catalogo.js`; la coordinadora puso
  después su `disponible: true` (commit 2128eb6). Se revisan igual que las demás, contra su
  reabierta y su commit. Si sus reclamos siguen sin cerrar, no los toques ni las releves: es
  cosa de la coordinadora.
- **La 32 (errores1) sigue con `disponible: false` a propósito**: espera la decisión de Juan
  Luis sobre las cuatro plantillas `saltoPaso`. Se revisa todo lo demás de su reabierta; que
  no esté publicada no es un hallazgo.
- La 31 declara su punto 4 «a medias» (2⁴ = 4² sale en el 15,8 % de los ítems del ejercicio
  2): la coordinadora se lo ha explicado a Juan Luis; anota lo que él haya decidido si
  consta en `hechos/`, y si no, déjalo como decisión pendiente.
- Las trampas de la ficha 18 valen aquí enteras (detector de desbordes que miente,
  `puppeteer-core` que no termina sin `process.exit(0)`, un proceso por práctica, los tests
  en verde no dicen nada del significado): léelas en `tareas/tarea-18-revision-final.md`.
- **Nunca `git stash` ni `--autostash`** (`proyecto.md`, «Repositorio git»).
- `catalogo.js` con candado ajeno: no esperes editando; termina todo lo demás y deja ese
  cambio para el final, con `git diff -- practicas/_comun/catalogo.js` limpio antes de tocar.
- (2026-10-09, sesión s-20261009T082156-0a34d7a4) **iCloud evacuó unos 390 ficheros con la
  sesión abierta** (prácticas, `hechos/` y el paquete de `.git`): un `cat` de varios ficheros se
  quedó colgado y `brctl download` no los trajo. Lo que funcionó: `git archive HEAD | tar -x -C
  <scratchpad>/repo` (tardó 12 min) y revisar sobre esa copia, con los revisores leyendo solo
  de ahí y un `python3 -m http.server` sobre la copia para la pasada de móvil.
- **Relista `hechos/` y mira `git log` ANTES de escribir el veredicto, no solo al cerrar**: en
  hora y media otra sesión comiteó tres veces en el mismo árbol, entre ellas ocho reaperturas
  con decisiones de Juan Luis que cambiaban lo que había que decir de la 30, la 31 y la 32, y
  el arreglo de `corrector/` que yo daba por perdido. Hubo que rehacer medio veredicto.
- **Los dos defectos más visibles estaban en `practica.js` y en el CSS**, donde no llega ningún
  test ni ningún script de lógica: «hasta la mitad de undefined» (criba) y los exponentes que
  no suben (propiedades). Solo los vio la pasada con navegador y **mirando las capturas**; el
  detector de desbordes no dice nada de eso. La pasada de pantalla no se puede limitar a las
  prácticas «con punto de pantalla».
- Un hallazgo del revisor puede ser una pregunta mal planteada desde la primera revisión: «la
  lista más corta que basta» (criba) lo pidió la reabierta anterior y era lo que hacía
  defendible el distractor. Lo que una reabierta manda hacer también se juzga.
- No des cifras de resumen («113 de 118 puntos») sin contarlas: `grep -cE '^[0-9]+\. '` sobre
  el apartado «Qué corregir» de cada reabierta da el total (121).

## Prohibido (propio de esta tarea)

- Editar cualquier fichero de `practicas/<slug>/`, de `divisores/` o de `tests/`.
- Poner `disponible: true` a nada (la 32 incluida).
- Dar SE ENTREGA a una práctica sin haber leído su diff entero.
- Reabrir por algo que la reabierta original llamaba «fuera de criterio» o «decisión de Juan
  Luis»: eso va a HALLAZGOS.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 36, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-36.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/36--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/36--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/36-segunda-revision/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/36--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/36--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni
  `practicas/_comun/` (salvo la tarea 01), ni `css/estilos.css`, ni `README.md` (salvo
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
- Las reglas de contenido de `proyecto.md`: «factor» por «divisor», HCF en vez de GCD, `×`
  en vez de `·`, letras o ecuaciones, «primos entre sí», distractores que puedan ser
  verdad, excluir el 0 de los múltiplos, preguntar «múltiplo de 0».

- En «Al terminar», los pasos 1 y 2 no son los de una práctica: la 36 no tiene test propio ni práctica que probar; corre `npm test` entero y, si ha tocado `catalogo.js`, ese es su único commit de código.
