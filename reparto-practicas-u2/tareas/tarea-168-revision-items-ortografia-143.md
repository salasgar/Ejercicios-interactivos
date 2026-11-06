# Tarea 168 · Revisar los ~45 ítems nuevos de la 143 y añadir «alrededor» y «en medio» a lo que nunca es distractor

Actualizado: 2026-11-06 (alta de la coordinadora s-20261106T125246-dae3dde3, pedida por Juan Luis el 6-11; nota `hechos/notas/s-20261106T125246-dae3dde3-altas-164-168.md`)
Precondición: 143 LISTA (lo está: commit 444f826) · **no en paralelo** con la 140 ni la 141 (tocan `docs/practicas-ortografia.md`) ni con otra que toque `practicas/ortografia/` · Disparo: MANUAL (sesión atendida) · **Plazo: antes del lun 16-11 (fecha que puso la 143)**
Duración esperada: 50 min (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/168-revision-items-ortografia-143/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/ortografia/{logica,comas,tildes,signos,sujeto}.js` (solo **ítems añadidos por la 143** que haya que corregir o quitar; los aprobados no se tocan), `tests/practicas-ortografia.test.js` (si un test fija un ítem que cambias), `docs/practicas-ortografia.md` (solo §6)

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
   **Comprueba la precondición en el disco, no solo en el tablón**: `git status --short practicas/ortografia/ docs/practicas-ortografia.md tests/practicas-ortografia.test.js` tiene que salir **vacío**.
3. Abre tu reclamo generando el sid **en el mismo comando** (probado en este Mac):
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -d '+100 minutes' +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -v+100M +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 168\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/168--$sid.md && git add $R/hechos/reclamos/168--$sid.md && git commit -m "PU2 T168: reclamo ($sid)" -- $R/hechos/reclamos/168--$sid.md && git push origin main; echo $sid
   ```
   (100 min = 2 × la duración esperada). A partir de aquí tu sid es el del nombre de ese
   fichero (`ls $R/hechos/reclamos/168--*`); no lo guardes en un fichero de nombre fijo.
4. `sleep 30 && git fetch origin && git ls-tree --name-only origin/main $R/hechos/reclamos/ | grep '/168--'` — el
   comando, no la intención. Si hay otro reclamo vivo de la tarea 168 con `abierto:` más antiguo (o igual y sid
   menor), añade a tu reclamo una línea `CEDIDA a <sid del otro>` y para. Mira también que no haya ningún reclamo
   vivo de una tarea que toque tus ficheros (lista de la precondición): si lo hay, `CEDIDA (<fichero> en uso por la
   NN)` y para.
5. Si el reclamo que encuentras está caducado (RELEVABLE en el tablón), relévalo con la
   línea `releva a: <sid anterior>` **en tu propio reclamo**; el suyo no se toca. Después mira qué dejó hecho: `git log --oneline -5`, `git status -sb` y tu carpeta de salida. Lo que haya con tests en verde se hereda y se dice en la terminada; lo que no, se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** (todas las filas contra `hechos/` y la
   hora real; banda y «encadenable» recopiadas de las fichas) antes de empezar, y sigue
   con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/168--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Juan Luis, 6-11: «Resuélvelo tú de manera autónoma» sobre tres cosas pendientes de la ortografía:

1. La 143 pidió que él leyera los ~45 ítems nuevos que añadió (`$R/hechos/terminadas/143--s-20261105T234455-51d3c35d.md`:
   2 de *e/he*, 2 de *echo/hecho*, 5 de *porque*, 3 pares de comas, 13 interrogativos, 10 diacríticas, 10 de signos, 2 de
   incisos; «sobre todo las frases de nivel 3 de tildes y los 3 pares de comas»). **Los lees tú**, como él.
2. La 138 propuso añadir **alrededor / al rededor** y **en medio / enmedio** (DPD, 2.ª ed.) a lo que nunca es distractor
   (`$R/salidas/138-ortografia-palabras/ENTREGA.md`, «Propuestas»). **Decidido por la coordinadora el 6-11: sí.** Ya están
   en la lista de `proyecto.md`; falta el §6 de `docs/practicas-ortografia.md`.
3. Nombres en los bancos (propuesta de la 135): **resuelto por la coordinadora el 6-11**, no es de esta tarea. Ninguno de los
   alumnos se llama Lucía, María, Ángel, Óscar ni Úrsula, y solo uno lleva «Luis», que en el banco es una palabra suelta de la
   lista de diptongos (`ortografia-tildes/logica.js`): se queda.

## Qué hay que hacer

1. Saca los ítems nuevos con `git show 444f826 -- practicas/ortografia/`: solo los que
   **añade** la 143, no los que ya estaban.
2. Para cada uno, la regla de oro de `CLAUDE.md`: la correcta lo es sin discusión y **cada distractor es inequívocamente
   falso**; nada de la lista «Lo que nunca es distractor» de `proyecto.md` usado como malo; frase natural para 1.º ESO; el
   nivel que le puso la 143 tiene sentido (1 lo más claro, 3 lo más fino); sin nombres de alumnos reales (el test
   `sin-nombres-de-alumnos` lo mira), sin contextos absurdos. Las diacríticas y los interrogativos, con especial cuidado
   (aún/aun, solo, qué/que en exclamativas e indirectas).
3. Lo que falle: **se corrige** si el arreglo es obvio y no cambia lo que evalúa el ítem; **se quita** si no tiene arreglo
   claro. Cada cambio, en la ENTREGA con el antes y el después. Si quitar deja un nivel con menos de lo que pide el motor,
   dilo en la ENTREGA y no rellenes con ítems nuevos inventados a prisa.
4. §6 de `docs/practicas-ortografia.md`: añade **alrededor / al rededor** y **en medio / enmedio** a la lista, con la misma
   forma que las demás entradas, y comprueba con `grep -rn "al rededor\|enmedio" practicas/` que ninguna práctica los usa
   como malos (la 138 ya los excluye en `ortografia-palabras/logica.js`).
5. Veredicto en la ENTREGA: cuántos ítems leídos, cuántos bien, corregidos y quitados, y **hallazgos fuera de criterio**
   (cosas que no son de estos ítems pero has visto) como decisiones para Juan Luis.

## Siguiente paso

Comprobación barata: `ls $R/hechos/terminadas/ | grep '^143--'` (tiene que estar) y `grep -n "al rededor" docs/practicas-ortografia.md`
(si ya está, el punto 4 está hecho).

## Trampas conocidas

- (s-20261106T144157-a6fa2e7c) Son **47** ítems, no ~45 ni 57: los 3 pares de comas cuentan uno cada uno. Duración real ~10 min.
- El fallo que más se escapa no es la tilde sino **la frase que solo necesita una coma para valer con la otra palabra**
  («Mira, sí está abierta»): léela también en voz alta con la otra palabra y una pausa.
- Una «buena» de signos puede no serlo sin discusión aunque el espacio esté bien (la enumeración anunciada pide dos puntos):
  cambiarla por otra frase que evalúe el mismo espacio, no tocar las malas por separado.

## Prohibido (propio de esta tarea)

- Cambiar o quitar ítems que **ya estaban** antes de la 143 (están aprobados), o los niveles que no sean de ítems nuevos.
- Tocar `docs/practicas-ortografia.md` fuera del §6.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja lo
publicado en un estado coherente (una práctica publicada y comiteada vale aunque la otra
quede sin revisar), escribe `$R/hechos/notas/<sid>-traspaso-168.md` con el estado exacto
(qué está hecho, qué falta, qué has descubierto, en qué orden seguir),
`$R/hechos/fallos/168--<sid>.md` con `parada por: sesión agotada` y la ruta de esa nota, y
`ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/168--<sid>.md` con `parada por: mal cortada`
y la ruta de la incidencia, `ABANDONADA` en tu reclamo, y díselo al usuario. Si un paso te
pide **decidir** algo que va a durar (quitar más casos que los del papel, cambiar cotas o
el número de ejercicios), no lo decidas: entrégalo como hallazgo para Juan Luis en tu
terminada y sigue con lo que no dependa de ello.

## Al terminar

Por este orden (el del repositorio git):

1. `node --test tests/practicas-ortografia.test.js tests/practicas-ortografia-comun.test.js` en verde y `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con reclamo vivo no es
   tuyo: anótalo en la terminada).
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas:
   `git add <rutas> && git commit -m "Ortografía: revisados los ítems nuevos de la 143; §6 con alrededor y en medio (tarea 168)" -- <rutas>`. Apunta el hash (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/168-revision-items-ortografia-143/ENTREGA.md` (qué se hizo, hash, cómo se probó, decisiones tomadas y **hallazgos fuera
   de criterio**, que son para Juan Luis) y su marcador vacío `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/168--<sid>.md`: hash del commit, ficheros (lo que dice `git show --stat`, no lo que
   crees), tests, hora y **duración real** (de `abierto:` a ahora), y propuestas pendientes si las hay.
5. Añade `CERRADA` a tu reclamo (línea propia que empieza por esa palabra).
6. Choques encontrados → `$R/hechos/incidencias/<sid>.md`.
7. `git fetch origin`, relista `$R/hechos/` **ahora** y regenera `$R/_ESTADO.md` entero:
   todas las filas, el registro con una línea por fichero de `terminadas/`, banda y
   «encadenable» recopiadas de las fichas, leyenda de bandas de `proyecto.md`. Ninguna tarea depende de esta (la 140 la espera solo por `docs/practicas-ortografia.md`). Si tu duración
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

Si paras sin terminar: `$R/hechos/fallos/168--<sid>.md` con hasta dónde llegaste, la línea
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
