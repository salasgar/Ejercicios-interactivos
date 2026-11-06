# Tarea 165 · `docs/practicas-como-empezar.md` reducida a una línea que remite a la guía del profesor

Actualizado: 2026-11-06 (alta de la coordinadora s-20261106T125246-dae3dde3, pedida por Juan Luis el 6-11; nota `hechos/notas/s-20261106T125246-dae3dde3-altas-164-168.md`)
Precondición: ninguna tarea · **no en paralelo** con la 140 ni la 141 (tocan `README.md`) ni con la 01 o la 18 · Disparo: MANUAL (sesión atendida) · **Plazo: antes del lun 14-12**
Duración esperada: 25 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: 164 (misma banda, corta, ficheros disjuntos)
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/165-como-empezar-una-linea/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `docs/practicas-como-empezar.md`, `README.md` (solo los enlaces a ese documento), `docs/practicas-unidad2.md` (§9: solo los enlaces)

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
   **Comprueba la precondición en el disco, no solo en el tablón**: `git status --short docs/practicas-como-empezar.md README.md docs/practicas-unidad2.md` tiene que salir **vacío**.
3. Abre tu reclamo generando el sid **en el mismo comando** (probado en este Mac):
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -d '+50 minutes' +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -v+50M +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 165\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/165--$sid.md && git add $R/hechos/reclamos/165--$sid.md && git commit -m "PU2 T165: reclamo ($sid)" -- $R/hechos/reclamos/165--$sid.md && git push origin main; echo $sid
   ```
   (50 min = 2 × la duración esperada). A partir de aquí tu sid es el del nombre de ese
   fichero (`ls $R/hechos/reclamos/165--*`); no lo guardes en un fichero de nombre fijo.
4. `sleep 30 && git fetch origin && git ls-tree --name-only origin/main $R/hechos/reclamos/ | grep '/165--'` — el
   comando, no la intención. Si hay otro reclamo vivo de la tarea 165 con `abierto:` más antiguo (o igual y sid
   menor), añade a tu reclamo una línea `CEDIDA a <sid del otro>` y para. Mira también que no haya ningún reclamo
   vivo de una tarea que toque tus ficheros (lista de la precondición): si lo hay, `CEDIDA (<fichero> en uso por la
   NN)` y para.
5. Si el reclamo que encuentras está caducado (RELEVABLE en el tablón), relévalo con la
   línea `releva a: <sid anterior>` **en tu propio reclamo**; el suyo no se toca. Después mira qué dejó hecho: `git log --oneline -5`, `git status -sb` y tu carpeta de salida. Lo que haya con tests en verde se hereda y se dice en la terminada; lo que no, se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** (todas las filas contra `hechos/` y la
   hora real; banda y «encadenable» recopiadas de las fichas) antes de empezar, y sigue
   con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/165--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Propuesta 2 de la 113, **aprobada por Juan Luis el 6-11** (`$R/salidas/113-guia-profesor-nuevo/ENTREGA.md`, punto 2): `docs/practicas-como-empezar.md`
(de la tarea 69) y `docs/practicas-guia-profesor.md` (de la 113) dicen casi lo mismo en dos sitios.

## Qué hay que hacer

1. Antes de recortar, compara los dos documentos: si `como-empezar` tiene algo útil que la guía no tiene, **no lo pases tú
   a la guía** (no es fichero tuyo): apúntalo en la ENTREGA como hallazgo para Juan Luis.
2. `docs/practicas-como-empezar.md` queda con su título y **una línea**: «Esta guía se ha sustituido por
   [la guía del profesor](practicas-guia-profesor.md).» (y la misma en inglés si el documento era bilingüe).
3. Los enlaces que apuntan a ella (`grep -rn "practicas-como-empezar" --include=*.md --include=*.html --include=*.js .`,
   fuera de `reparto-practicas-u2/hechos`, `salidas` y `tareas`, que son historia y no se tocan) pasan a
   `docs/practicas-guia-profesor.md`. Hoy son `README.md` y `docs/practicas-unidad2.md` (§9).

## Siguiente paso

Comprobación barata: `wc -l docs/practicas-como-empezar.md` (si ya son 3-4 líneas, está hecha: dilo y para).

## Trampas conocidas

- (vacío)

## Prohibido (propio de esta tarea)

- Borrar `docs/practicas-como-empezar.md`: hay enlaces externos (correos a compañeros) que tienen que seguir llegando a algo.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja lo
publicado en un estado coherente (una práctica publicada y comiteada vale aunque la otra
quede sin revisar), escribe `$R/hechos/notas/<sid>-traspaso-165.md` con el estado exacto
(qué está hecho, qué falta, qué has descubierto, en qué orden seguir),
`$R/hechos/fallos/165--<sid>.md` con `parada por: sesión agotada` y la ruta de esa nota, y
`ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/165--<sid>.md` con `parada por: mal cortada`
y la ruta de la incidencia, `ABANDONADA` en tu reclamo, y díselo al usuario. Si un paso te
pide **decidir** algo que va a durar (quitar más casos que los del papel, cambiar cotas o
el número de ejercicios), no lo decidas: entrégalo como hallazgo para Juan Luis en tu
terminada y sigue con lo que no dependa de ello.

## Al terminar

Por este orden (el del repositorio git):

1. `npm test` en verde y `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con reclamo vivo no es
   tuyo: anótalo en la terminada).
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas:
   `git add <rutas> && git commit -m "Guía: como-empezar remite a la guía del profesor (tarea 165)" -- <rutas>`. Apunta el hash (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/165-como-empezar-una-linea/ENTREGA.md` (qué se hizo, hash, cómo se probó, decisiones tomadas y **hallazgos fuera
   de criterio**, que son para Juan Luis) y su marcador vacío `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/165--<sid>.md`: hash del commit, ficheros (lo que dice `git show --stat`, no lo que
   crees), tests, hora y **duración real** (de `abierto:` a ahora), y propuestas pendientes si las hay.
5. Añade `CERRADA` a tu reclamo (línea propia que empieza por esa palabra).
6. Choques encontrados → `$R/hechos/incidencias/<sid>.md`.
7. `git fetch origin`, relista `$R/hechos/` **ahora** y regenera `$R/_ESTADO.md` entero:
   todas las filas, el registro con una línea por fichero de `terminadas/`, banda y
   «encadenable» recopiadas de las fichas, leyenda de bandas de `proyecto.md`. Ninguna tarea depende de esta. Si tu duración
   real difiere mucho de la estimada, díselo al usuario.
8. Vuelca abajo, en «Trampas conocidas» de esta ficha, lo que hayas aprendido por las
   malas (es lo único de la ficha que editas, además de la duración).
9. Un solo commit con rutas explícitas de tus ficheros de `$R/hechos/` (por sid), tu
   carpeta de `$R/salidas/`, `$R/_ESTADO.md` y esta ficha, y `git push origin main`. Si el
   push se rechaza: `git pull --rebase origin main` (nunca `--autostash`), regenera el tablón
   otra vez desde `hechos/` (no lo fusiones a mano) y vuelve a comitear y empujar.
10. Dile al usuario la **foto del momento** en tres líneas («EN CURSO: … · LIBRES ahora: … ·
    BLOQUEADAS: …»), sacada de la lectura de `hechos/` del paso 7, y después, **solo para las
    LIBRES**, las frases de arranque de `proyecto.md` literales, en bloques de cita, una por
    sesión que quepa a la vez, con la tarea o la cadena, la banda traducida y el nombre de
    sesión delante.

Si paras sin terminar: `$R/hechos/fallos/165--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni
  `practicas/_comun/` (salvo la tarea 01 y, en la unidad 3, la 79 y las de publicación 93-96 y la 115, y, en la unidad 4, las 109-111, 119, 120, 162 y 163, y las 164 y 166, cada una en lo que declara), ni `css/estilos.css`, ni `README.md` (salvo
  01, 18 y 165), ni `firestore.rules` ni `src/firebase.js` (salvo 01), ni fichas ajenas, ni
  nada de la carpeta de apuntes de iCloud. Si la base te falta algo, se propone en la
  terminada; no se parchea.
- `git add .`, `git add -A`, `git commit -a`, o un `add` separado del `commit`. El índice
  es compartido con otras sesiones del mismo árbol. Nunca `git stash`, `--autostash`,
  `git checkout -- .` ni `git reset --hard`.
- Editar el código con `sed -i` o heredocs desde el shell: el candado de sesiones solo
  ve Edit/Write, y así otra sesión no sabe que el fichero está en uso. El código se edita
  con las herramientas de edición; `hechos/` sí se escribe desde el shell (un escritor).
- Reescribir un fichero de `hechos/` (solo `>>`), editar un reclamo ajeno, o regenerar el
  tablón de memoria sin relistar `hechos/`.
- Dependencias nuevas (npm, CDN).
- Las reglas de contenido de la unidad: opciones equivalentes por valor, decimales o números mixtos, potencias de base
  negativa, algo de una sesión posterior a la de la destreza, distractores que puedan ser verdad, casos del papel.
