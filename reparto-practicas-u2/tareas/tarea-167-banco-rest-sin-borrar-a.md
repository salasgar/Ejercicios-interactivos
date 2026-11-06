# Tarea 167 · El banco REST de las reglas no borra los datos de la cuenta de prueba A

Actualizado: 2026-11-06 (alta de la coordinadora s-20261106T125246-dae3dde3, pedida por Juan Luis el 6-11; nota `hechos/notas/s-20261106T125246-dae3dde3-altas-164-168.md`)
Precondición: ninguna tarea · **no en paralelo** con otra que toque `herramientas/probar-reglas.mjs` o `firestore.rules` · Disparo: MANUAL (con Juan Luis delante para la ejecución de verdad) · **Plazo: antes del lun 14-12 (se vuelven a usar los códigos de prueba 62 y 63)**
Duración esperada: 45 min (real ~35 min) (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/167-banco-rest-sin-borrar-a/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `herramientas/probar-reglas.mjs` (y su documentación, si la tiene en el propio fichero o en `docs/`; dilo en la terminada)

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
   **Comprueba la precondición en el disco, no solo en el tablón**: `git status --short herramientas/probar-reglas.mjs` tiene que salir **vacío**.
3. Abre tu reclamo generando el sid **en el mismo comando** (probado en este Mac):
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -d '+90 minutes' +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -v+90M +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 167\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/167--$sid.md && git add $R/hechos/reclamos/167--$sid.md && git commit -m "PU2 T167: reclamo ($sid)" -- $R/hechos/reclamos/167--$sid.md && git push origin main; echo $sid
   ```
   (90 min = 2 × la duración esperada). A partir de aquí tu sid es el del nombre de ese
   fichero (`ls $R/hechos/reclamos/167--*`); no lo guardes en un fichero de nombre fijo.
4. `sleep 30 && git fetch origin && git ls-tree --name-only origin/main $R/hechos/reclamos/ | grep '/167--'` — el
   comando, no la intención. Si hay otro reclamo vivo de la tarea 167 con `abierto:` más antiguo (o igual y sid
   menor), añade a tu reclamo una línea `CEDIDA a <sid del otro>` y para. Mira también que no haya ningún reclamo
   vivo de una tarea que toque tus ficheros (lista de la precondición): si lo hay, `CEDIDA (<fichero> en uso por la
   NN)` y para.
5. Si el reclamo que encuentras está caducado (RELEVABLE en el tablón), relévalo con la
   línea `releva a: <sid anterior>` **en tu propio reclamo**; el suyo no se toca. Después mira qué dejó hecho: `git log --oneline -5`, `git status -sb` y tu carpeta de salida. Lo que haya con tests en verde se hereda y se dice en la terminada; lo que no, se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** (todas las filas contra `hechos/` y la
   hora real; banda y «encadenable» recopiadas de las fichas) antes de empezar, y sigue
   con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/167--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Propuesta 10 de la 113 (`$R/salidas/113-guia-profesor-nuevo/ENTREGA.md`, punto 10), dada de alta el 6-11 con el «resuélvelo» de Juan Luis sobre ese punto.
La limpieza del banco REST borra `config/tareas`, `privado/nombres` y el documento del espacio de la cuenta de prueba A,
**también lo que había antes** de ejecutarlo: tras la ejecución del 5-11, `config/tareas` de A da 404 y los códigos de
prueba 62 y 63 se quedaron sin tareas.

## Qué hay que hacer

1. Que el banco **guarde al empezar** lo que encuentra en cada documento de A y de B que va a tocar, y **lo restaure al
   final** (también si una prueba falla o se interrumpe: `try/finally`). Lo que no existía antes, se borra; lo que existía,
   vuelve a quedar igual.
2. Un modo `--seco` (o equivalente) que diga qué documentos tocaría y qué guardaría, sin escribir nada, para probarlo sin
   contraseñas.
3. **La ejecución de verdad la hace Juan Luis** en Terminal, con las contraseñas de A y B escritas con `read -s` (nunca en
   el repo, en el historial ni en la conversación). La sesión le da el comando exacto y comprueba con él, antes y después,
   que `config/tareas` de A queda igual (mismo contenido; el `updateTime` puede cambiar).
4. Si tras el arreglo A sigue sin tareas (por el borrado del 5-11), díselo: no se reconstruyen de memoria.

## Siguiente paso

Comprobación barata: `grep -n "restaur" herramientas/probar-reglas.mjs` (si ya restaura, alguien lo hizo: dilo y para).

## Trampas conocidas

- Las cuentas de prueba son profe-a-prueba@example.com y profe-b-prueba@example.com; las contraseñas solo con `read -s`.
- (167) `process.exit` dentro de un `try` salta el `finally`: el banco devuelve `{quedan, codigos}` desde `main()` y sale desde fuera, tras restaurar. Una restauración de Firestore REST es un PATCH **sin** máscara (reemplaza el documento entero); con máscara se quedarían campos de prueba. Para probar esto sin nube basta un `fetch` simulado cargado con `node --import`.

## Prohibido (propio de esta tarea)

- Tocar `firestore.rules` o publicar reglas.
- Ejecutar el banco contra la nube sin Juan Luis delante.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja lo
publicado en un estado coherente (una práctica publicada y comiteada vale aunque la otra
quede sin revisar), escribe `$R/hechos/notas/<sid>-traspaso-167.md` con el estado exacto
(qué está hecho, qué falta, qué has descubierto, en qué orden seguir),
`$R/hechos/fallos/167--<sid>.md` con `parada por: sesión agotada` y la ruta de esa nota, y
`ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/167--<sid>.md` con `parada por: mal cortada`
y la ruta de la incidencia, `ABANDONADA` en tu reclamo, y díselo al usuario. Si un paso te
pide **decidir** algo que va a durar (quitar más casos que los del papel, cambiar cotas o
el número de ejercicios), no lo decidas: entrégalo como hallazgo para Juan Luis en tu
terminada y sigue con lo que no dependa de ello.

## Al terminar

Por este orden (el del repositorio git):

1. `node herramientas/probar-reglas.mjs --seco` en verde y `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con reclamo vivo no es
   tuyo: anótalo en la terminada).
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas:
   `git add <rutas> && git commit -m "Banco REST: guarda y restaura los datos de A (tarea 167)" -- <rutas>`. Apunta el hash (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/167-banco-rest-sin-borrar-a/ENTREGA.md` (qué se hizo, hash, cómo se probó, decisiones tomadas y **hallazgos fuera
   de criterio**, que son para Juan Luis) y su marcador vacío `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/167--<sid>.md`: hash del commit, ficheros (lo que dice `git show --stat`, no lo que
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

Si paras sin terminar: `$R/hechos/fallos/167--<sid>.md` con hasta dónde llegaste, la línea
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
