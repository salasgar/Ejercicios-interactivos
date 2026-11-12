# Tarea 194 · Enseñar en el panel del profesor cuántas veces ha pulsado «No lo sé» cada alumno en cada ejercicio

Actualizado: 2026-11-12 (alta de la coordinadora s-20261112T221031-a65e0c81, pedida por Juan Luis: «Publícalo y hazlo extensivo a todos los ejercicios interactivos desde la unidad 1»; el panel era lo que quedaba pendiente de la primera entrega)
Precondición: ninguna tarea previa (el campo `ayudas` ya se guarda desde el commit 1b74b06) · ningún reclamo vivo de otra tarea que toque `practicas/profesor.js`, `practicas/profesor-hoy.js` o `practicas/resultados.js`, ni cambios sin comitear en ellos · Disparo: MANUAL
Duración esperada: 1 h (tiempo de sesión) · Banda de modelo: MEDIO · Encadenable con: ninguna
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/194-ayudas-en-el-panel/` (solo `ENTREGA.md` y su marcador)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/resultados.js`, `practicas/profesor.js`, `practicas/profesor-hoy.js`, `practicas/profesor.html` (solo si hace falta una clase de estilo), `tests/practicas-resultados.test.js`

La duración esperada no es informativa: de ella sale la caducidad del reclamo (2 ×), el plazo tras el cual otra
sesión puede relevarte si te cortas. **Este fichero es la fuente de la banda**: el tablón la copia de aquí cada vez que
se regenera. La tabla de bandas de `proyecto.md` la traduce al menú de hoy (ALTO = Opus 5.5, esfuerzo Alto; MEDIO =
Sonnet 5.5, esfuerzo Medio).

## Antes de empezar

Todas las rutas son relativas a la raíz del repositorio (`/Users/salasgar/Documents/git/Ejercicios-interactivos`).
`R=reparto-practicas-u2`. Las sesiones de este reparto trabajan en ese árbol, no en un worktree.

1. Lee `$R/proyecto.md` (al menos «Dónde está cada cosa», «Reglas de contenido comunes» y la sección «Tareas 171-194»),
   `$R/_ESTADO.md` y **`docs/no-lo-se.md` entero** (es la especificación de esta tarea), y lista `$R/hechos/`
   (`ls $R/hechos/*/`): la carpeta manda sobre la tabla.
2. `date -u` para la hora de verdad. `git fetch origin && git status -sb`; si hay commits que traer,
   `git pull --rebase origin main` (nunca `--autostash`). **Comprueba la precondición en el disco**:
   `git status --short practicas/resultados.js practicas/profesor.js practicas/profesor-hoy.js tests/practicas-resultados.test.js` tiene que salir **vacío**, y `grep -lE "profesor(-hoy)?\.js|resultados\.js" $R/tareas/*.md` da las fichas que los tocan: ninguna con reclamo vivo.
   Si alguna de tus carpetas sale modificada, es trabajo de otra sesión: no la toques; sigue con las demás y dilo en la
   terminada (`PARCIAL:`), o no reclames si son todas.
3. Abre tu reclamo generando el sid **en el mismo comando** (probado en este Mac):
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -v+120M +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 194\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/194--$sid.md; echo $sid
   ```
   (120 min = 2 × la duración esperada). Tu sid es el del nombre de ese fichero; no lo guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/ | grep '^194--'` — el comando, no la intención. Si hay otro reclamo vivo de la 194
   con `abierto:` más antiguo (o igual y sid menor), añade a tu reclamo `CEDIDA a <sid del otro>` y para.
5. Si el reclamo que encuentras está caducado (RELEVABLE), relévalo con `releva a: <sid anterior>` **en tu propio
   reclamo**. Mira qué dejó hecho (`git log --oneline -8`, `git status -sb`, su carpeta de salida): lo que esté
   comiteado con tests en verde se hereda y se dice en la terminada; lo demás se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** con el guion (`$R/hechos/notas/s-20261111T215225-39c1f4f5-regenerar-tablon.py`,
   ver su cabecera) y sigue con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/194--<sid>.md`) al
terminar cada práctica. Si vas a tardar más de lo que te queda, añade antes una línea `caduca:` más allá. A tu reclamo
solo se añade (`>>`). Tras cualquier pausa: `date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Desde el 12-11 cada ejercicio guardado puede llevar `ayudas`: las veces que el alumno ha pulsado «No lo sé» (ver
`docs/no-lo-se.md` y `practicas/_comun/contador.js`, `ayudar`). El campo solo existe cuando es mayor que 0, y al
fusionar aparatos se queda el máximo (`nube.js`, `ACUMULADOS`). El panel todavía no lo enseña. Hay que enseñarlo en
tres sitios, sin cambiar nada de lo que ya se ve ni de cómo se califica:

1. **Tabla por alumno** (`profesor.js`, la celda de cada ejercicio, hacia la línea 186): detrás de lo que ya pone,
   ` · ?N` cuando `ayudas` es N > 0, con `title="N veces «No lo sé»"`. Nada si es 0.
2. **Tabla de ejercicios más fallados** (`resultados.js`, la función que devuelve `{ practica, n, empezados,
   terminados, fallos, fallosPorAlumno, reinicios, tope }`, hacia la línea 289, y su tabla en `profesor.js`, hacia la
   431): una columna más, «No lo sé», con el total de ayudas del ejercicio entre los alumnos que lo han empezado. El
   orden de la tabla no cambia.
3. **«Hoy»** (`profesor-hoy.js`, hacia la línea 102): junto al porcentaje de fallos, ` · ?N` igual que en 1.

## Qué hay que hacer

1. Lee `practicas/resultados.js` entero (es puro y tiene tests) y las tres zonas de `profesor.js` y `profesor-hoy.js`.
   Sigue el campo desde donde se lee el documento de progreso hasta la celda: en varios puntos el ejercicio se copia
   campo a campo (por ejemplo `{ terminado, puntos, objetivo, fallos, dia }`) y `ayudas` se pierde si no se añade.
2. Añade `ayudas` (0 si falta) en esas copias y en el agregado, con tests en `tests/practicas-resultados.test.js`:
   un ejercicio con ayudas, uno sin el campo (progreso antiguo), y la fusión de código de resultado + nube.
3. Pinta las tres salidas. Pruébalo en el navegador con `practicas/profesor.html` y las cuentas de prueba (memoria
   del proyecto: `profe-a-prueba@example.com`; contraseña solo con `read -s`, nunca en un fichero ni en el chat) o,
   si no hay sesión, con un guion que llame a las funciones de pintar con datos inventados.

## Cómo saber que ha terminado

- Las tres vistas enseñan las ayudas cuando las hay y no cambian cuando no; `npm test` en verde; comiteado y empujado.

## Trampas conocidas

- (de la coordinadora) El **CSV** que exporta el panel (`profesor.js`, hacia las líneas 215 y 308) lo leen guiones de
  fuera del repo (`comun/gestion/calificar_classroom.py`): **no se le añaden columnas**. Si conviene, es un hallazgo.
- (de la coordinadora) El código de resultado que copia el alumno no lleva `ayudas`: solo llegan por la nube.

## Prohibido (propio de esta tarea)

- Cambiar la nota, los puntos, el orden de las tablas o el formato del CSV; tocar `practicas/_comun/`.
- Nombres o códigos de alumnos reales en tests, ejemplos o capturas.

## Si la sesión se alarga

Si no te cabe todo, comitea lo que esté con tests en verde (resultados.js antes que las vistas),
escribe `$R/hechos/fallos/194--<sid>.md` con qué vistas quedan y `parada por: sesión agotada`, y `ABANDONADA` en tu
reclamo. Quien la coja después mira qué prácticas declaran ya `explicacion` en todos sus ejercicios y sigue por las demás.

## Si esta tarea resulta ser más de una

No recortes tú. Termina lo que quepa, escribe `$R/hechos/incidencias/<sid>.md` (tamaño real y dónde está el corte
natural), `$R/hechos/fallos/194--<sid>.md` con `parada por: mal cortada`, `ABANDONADA` en tu reclamo, y díselo a Juan Luis.

## Al terminar

1. `node --test tests/practicas-no-lo-se.test.js tests/practicas-resultados.test.js` en verde y `npm test` sin fallos en tus ficheros (un
   fallo en un fichero ajeno con reclamo vivo no es tuyo: anótalo en la terminada).
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas y en la misma orden:
   `git add <rutas> && git commit -m "Panel: ayudas de «No lo sé» (tarea 194)" -- <rutas>`; y `git push origin main` (si se rechaza,
   `git pull --rebase origin main`, nunca `--autostash`). Apunta el hash (`git rev-parse --short HEAD`). **Lo empujado
   lo ven los alumnos en las prácticas publicadas**: no empujes una práctica sin sus tests en verde.
3. Escribe `$R/salidas/194-ayudas-en-el-panel/ENTREGA.md` y su marcador vacío `ENTREGA.md.ok-<sid>`. Dos apartados separados:
   **lo hecho** (por práctica y ejercicio: `explicacion`, `noLoSe` o `sinAyuda` con su motivo; hash; cómo se probó) y
   **hallazgos fuera de criterio**, que son para Juan Luis (un ítem imposible, un feedback que ya estaba mal, una
   duda de `sinAyuda`…). Nunca un caso de examen en claro.
4. Escribe `$R/hechos/terminadas/194--<sid>.md`: hashes, ficheros (lo que dice `git show --stat`), tests, hora y
   **duración real** (de `abierto:` a ahora). Si queda alguna práctica sin hacer, empieza por `PARCIAL:` y di cuáles.
5. Añade `CERRADA` a tu reclamo (línea propia que empieza por esa palabra).
6. Choques encontrados → `$R/hechos/incidencias/<sid>.md`.
7. `git fetch origin`, relista `$R/hechos/` **ahora** y regenera `$R/_ESTADO.md` entero con el guion. Si tu duración
   real difiere mucho de la estimada, díselo al usuario (las fichas 171-193 que queden se recalibran).
8. Vuelca abajo, en «Trampas conocidas», lo que hayas aprendido por las malas (es lo único de la ficha que editas,
   además de la duración).
9. Un solo commit con rutas explícitas de tus ficheros de `$R/hechos/` (por sid), tu carpeta de `$R/salidas/`,
   `$R/_ESTADO.md` y esta ficha, y `git push origin main`. Si el push se rechaza: `git pull --rebase origin main`,
   regenera el tablón otra vez desde `hechos/` (no lo fusiones a mano) y vuelve a comitear y empujar.
10. Dile al usuario la **foto del momento** en tres líneas («EN CURSO: … · LIBRES ahora: … · BLOQUEADAS: …»), sacada
    de la lectura de `hechos/` del paso 7, y después, **solo para las LIBRES de las tareas 171-194**, las frases de
    arranque de `proyecto.md` literales, en bloques de cita, una por sesión, con la tarea, la banda traducida y el
    nombre de sesión delante.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `practicas/_comun/`, ni `tests/practicas-no-lo-se.test.js`,
  ni `docs/no-lo-se.md`, ni `catalogo.js`, ni `css/`, ni `README.md`, ni `firestore.rules`, ni fichas ajenas, ni nada de
  la carpeta de apuntes de iCloud. Si a la base le falta algo, se propone en la terminada; no se parchea.
- `git add .`, `git add -A`, `git commit -a`, o un `add` separado del `commit`. El índice es compartido con otras
  sesiones del mismo árbol. Nunca `git stash`, `--autostash`, `git checkout -- .` ni `git reset --hard`.
- Editar el código con `sed -i` o heredocs desde el shell: el candado de sesiones solo ve Edit/Write. El código se
  edita con las herramientas de edición; `hechos/` sí se escribe desde el shell (un escritor).
- Reescribir un fichero de `hechos/` (solo `>>`), editar un reclamo ajeno, o regenerar el tablón de memoria.
- Dependencias nuevas (npm, CDN). Nombres de alumnos reales en ningún fichero.
