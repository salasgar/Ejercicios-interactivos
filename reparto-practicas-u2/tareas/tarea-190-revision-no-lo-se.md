# Tarea 190 · Revisión del «No lo sé» de las unidades 4 y 5: leer las explicaciones, probarlas con clics y corregir

Actualizado: 2026-11-12 (alta de la coordinadora s-20261112T221031-a65e0c81, pedida por Juan Luis: «Publícalo y hazlo extensivo a todos los ejercicios interactivos desde la unidad 1»)
Precondición: **171 LISTA**, **172 LISTA**, **173 LISTA**, **174 LISTA** (si alguna cerró `PARCIAL:`, se revisa lo hecho y la terminada de esta también es `PARCIAL:`) · Disparo: MANUAL
Duración esperada: 1 h 30 min (tiempo de sesión; 17 prácticas) · Banda de modelo: ALTO · Encadenable con: ninguna
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/190-revision-no-lo-se/` (solo `ENTREGA.md` y su marcador)
Ficheros que toca (ninguna otra tarea en paralelo los toca; hereda la titularidad de las carpetas de 171, 172, 173, 174 cuando están LISTAS): `practicas/que-fraccion/`, `practicas/equivalentes/`, `practicas/simplifica/`, `practicas/compara/`, `practicas/suma-resta/`, `practicas/combinadas-fracciones/`, `practicas/errores4/`, `practicas/leelo4/`, `practicas/lee-decimales/`, `practicas/compara-decimales/`, `practicas/suma-resta-decimales/`, `practicas/leelo5/`, `practicas/multiplica-divide-decimales/`, `practicas/fraccion-decimal/`, `practicas/errores5/`, `practicas/fraccion-de/`, `practicas/multiplica-divide/` (solo `practica.js`, `textos.js`, `logica.js`) y sus `tests/practicas-ayuda-<slug>.test.js`; `tests/practicas-no-lo-se.test.js` (solo la condición que salta las prácticas sin empezar, y solo si eres la última revisión en cerrar)

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
   `ls $R/hechos/terminadas/ | grep -E "^(171|172|173|174)--"` tiene que dar una terminada por tarea, ninguna `PARCIAL:` sin cerrar, y `git status --short practicas/ divisores/ tests/` no puede mostrar cambios en tus carpetas.
   Si alguna de tus carpetas sale modificada, es trabajo de otra sesión: no la toques; sigue con las demás y dilo en la
   terminada (`PARCIAL:`), o no reclames si son todas.
3. Abre tu reclamo generando el sid **en el mismo comando** (probado en este Mac):
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -v+180M +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 190\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/190--$sid.md; echo $sid
   ```
   (180 min = 2 × la duración esperada). Tu sid es el del nombre de ese fichero; no lo guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/ | grep '^190--'` — el comando, no la intención. Si hay otro reclamo vivo de la 190
   con `abierto:` más antiguo (o igual y sid menor), añade a tu reclamo `CEDIDA a <sid del otro>` y para.
5. Si el reclamo que encuentras está caducado (RELEVABLE), relévalo con `releva a: <sid anterior>` **en tu propio
   reclamo**. Mira qué dejó hecho (`git log --oneline -8`, `git status -sb`, su carpeta de salida): lo que esté
   comiteado con tests en verde se hereda y se dice en la terminada; lo demás se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** con el guion (`$R/hechos/notas/s-20261111T215225-39c1f4f5-regenerar-tablon.py`,
   ver su cabecera) y sigue con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/190--<sid>.md`) al
terminar cada práctica. Si vas a tardar más de lo que te queda, añade antes una línea `caduca:` más allá. A tu reclamo
solo se añade (`>>`). Tras cualquier pausa: `date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Las tareas 171, 172, 173, 174 han escrito la explicación del botón «No lo sé» de `que-fraccion`, `equivalentes`, `simplifica`, `compara`, `suma-resta`, `combinadas-fracciones`, `errores4`, `leelo4`, `lee-decimales`, `compara-decimales`, `suma-resta-decimales`, `leelo5`, `multiplica-divide-decimales`, `fraccion-decimal`, `errores5`, `fraccion-de`, `multiplica-divide` (las dos últimas las escribió la coordinadora el 12-11). Sus tests comprueban que
la explicación lleva la solución; **no comprueban que enseñe bien**. Esta tarea lo mira con criterio de profesor y
corrige lo que encuentre. La especificación es `docs/no-lo-se.md`.

## Qué hay que hacer

1. Lee las ENTREGA de esas tareas (`$R/salidas/<NN>-no-lo-se-*/ENTREGA.md`): lo hecho y, sobre todo, los hallazgos y
   los `sinAyuda`.
2. **Lectura**: con un guion en el scratchpad (nunca en el repo), 20 explicaciones de cada ejercicio en cada idioma.
   Para cada una: ¿las cuentas son verdad?, ¿la solución es la que el ejercicio da por buena?, ¿un alumno de 1.º que no
   sabe hacerlo sabría hacer el siguiente después de leerla?, ¿usa algo que no se ha dado en esa unidad?, ¿cabe en
   tres o cuatro líneas?, ¿el inglés es sencillo y correcto?, ¿el consejo es verdad siempre o solo en ese ítem?
3. **`sinAyuda`**: que cada uno sea de verdad un juego o un ejercicio por pasos. Los «Pendiente de decisión» se
   resuelven aquí si es evidente; si no, van a Juan Luis en la ENTREGA con tu recomendación.
4. **Clics** en el navegador (`python3 -m http.server 8190`, `?probar=1&ejercicio=<k>`): el botón en cada ejercicio, a
   375 px y en ancho, en los dos idiomas; la tercera ayuda avisa del punto; el ítem siguiente es otro; consola limpia.
5. **Corrige** lo que falle en la explicación (texto, cuenta, pasos, `noLoSe` mal puesto o que falta) y su test; un
   commit por práctica, con rutas explícitas, y push. Lo que no sea de la explicación (un generador, un feedback que
   ya estaba mal) **no se corrige**: reabierta de la tarea dueña de esa práctica o hallazgo, según el protocolo.
6. **Solo la última de las cuatro revisiones (190-193) en cerrar**: cuando las cuatro estén LISTAS, en
   `tests/practicas-no-lo-se.test.js` se quita la línea `if (!defs.some(d => d.explicacion || d.sinAyuda)) continue;`
   para que ninguna práctica del catálogo, presente o futura, pueda quedarse sin declarar; `npm test` en verde. Si no
   eres la última, no lo toques y dilo en la terminada.

## Cómo saber que ha terminado

- Cada ejercicio de esas prácticas, leído y probado con clics, y lo corregido, comiteado y empujado con tests en verde.
- ENTREGA con **veredicto por práctica** (bien / corregida: qué) y, aparte, **hallazgos fuera de criterio** para Juan Luis.

## Trampas conocidas

- (de la coordinadora) Una explicación puede llevar la solución y aun así enseñar mal: un paso que solo vale para ese
  ítem, un consejo falso en general, o la regla dicha con una palabra que no se ha dado.
- (de la coordinadora) El feedback de acierto reutilizado a veces da la cuenta sin decir por qué: delante tiene que ir la regla.
- (s-20261113T170133-3d38e018, relevo) Duración real: ~55 min en total (35 + 20), con la lectura repartida en cinco subagentes. La
  sesión que la hizo se paró tras escribir la ENTREGA y antes del marcador y la terminada: escribe la terminada en cuanto acabes.
- (ídem) Clics con el guion de la 192 (`hechos/notas/s-20261113T074721-a71b7338-clics-no-lo-se.mjs`, cópialo al scratchpad y cambia
  rutas y puertos). El servidor `python3 -m http.server` va con `run_in_background`: lanzado con `&` dentro de una llamada muere al
  acabarla y el guion da «sin» botón en todo lo que viene detrás. «itemIgualAlAnterior» compara el texto del ítem: en los ejercicios de
  dibujo (que-fraccion ej1) el texto es solo la instrucción y da falsos positivos.

## Prohibido (propio de esta tarea)

- Reescribir por gusto lo que está bien; cambiar generadores, opciones o feedback; tocar `catalogo.js`.

## Si la sesión se alarga

La tarea es idempotente **por práctica**: cada práctica terminada se comitea sola (paso 2 de «Al terminar») antes de
empezar la siguiente. Si no te cabe todo, cierra la práctica en curso o déjala sin tocar (nunca a medias sin comitear),
escribe `$R/hechos/fallos/190--<sid>.md` con qué prácticas quedan y `parada por: sesión agotada`, y `ABANDONADA` en tu
reclamo. Quien la coja después mira qué prácticas declaran ya `explicacion` en todos sus ejercicios y sigue por las demás.

## Si esta tarea resulta ser más de una

No recortes tú. Termina lo que quepa, escribe `$R/hechos/incidencias/<sid>.md` (tamaño real y dónde está el corte
natural), `$R/hechos/fallos/190--<sid>.md` con `parada por: mal cortada`, `ABANDONADA` en tu reclamo, y díselo a Juan Luis.

## Al terminar

1. `node --test tests/practicas-no-lo-se.test.js tests/practicas-ayuda-*.test.js` en verde y `npm test` sin fallos en tus ficheros (un
   fallo en un fichero ajeno con reclamo vivo no es tuyo: anótalo en la terminada).
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas y en la misma orden:
   `git add <rutas> && git commit -m "«No lo sé»: revisión de <slug> (tarea 190)" -- <rutas>`; y `git push origin main` (si se rechaza,
   `git pull --rebase origin main`, nunca `--autostash`). Apunta el hash (`git rev-parse --short HEAD`). **Lo empujado
   lo ven los alumnos en las prácticas publicadas**: no empujes una práctica sin sus tests en verde.
3. Escribe `$R/salidas/190-revision-no-lo-se/ENTREGA.md` y su marcador vacío `ENTREGA.md.ok-<sid>`. Dos apartados separados:
   **lo hecho** (por práctica y ejercicio: `explicacion`, `noLoSe` o `sinAyuda` con su motivo; hash; cómo se probó) y
   **hallazgos fuera de criterio**, que son para Juan Luis (un ítem imposible, un feedback que ya estaba mal, una
   duda de `sinAyuda`…). Nunca un caso de examen en claro.
4. Escribe `$R/hechos/terminadas/190--<sid>.md`: hashes, ficheros (lo que dice `git show --stat`), tests, hora y
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
