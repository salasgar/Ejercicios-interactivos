# Tarea 188 · Botón «No lo sé» en `expresion`, `redondeo`, `constructor`, `distributiva`, `potencias10` (unidad 1): la explicación de cada ejercicio

Actualizado: 2026-11-12 (alta de la coordinadora s-20261112T221031-a65e0c81, pedida por Juan Luis: «Publícalo y hazlo extensivo a todos los ejercicios interactivos desde la unidad 1»)
Precondición: ninguna tarea previa (la base común del botón ya está en `main`, commits 1b74b06 y 5d1dda1) · ninguna de sus carpetas con cambios sin comitear ni con reclamo vivo de otra tarea · Disparo: MANUAL
Duración esperada: 1 h 30 min (tiempo de sesión; 5 prácticas, 15 ejercicios) · Banda de modelo: MEDIO · Encadenable con: ninguna (es larga)
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/188-no-lo-se-u1-expresion/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/expresion/{practica,textos,logica}.js`, `practicas/redondeo/{practica,textos,logica}.js`, `practicas/constructor/{practica,textos,logica}.js`, `practicas/distributiva/{practica,textos,logica}.js`, `practicas/potencias10/{practica,textos,logica}.js` (y otros `.js` de esas carpetas si la explicación vive ahí), y un test nuevo por práctica: `tests/practicas-ayuda-expresion.test.js`, `tests/practicas-ayuda-redondeo.test.js`, `tests/practicas-ayuda-constructor.test.js`, `tests/practicas-ayuda-distributiva.test.js`, `tests/practicas-ayuda-potencias10.test.js`

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
   `git status --short practicas/expresion/ practicas/redondeo/ practicas/constructor/ practicas/distributiva/ practicas/potencias10/` tiene que salir **vacío**, y no puede haber un reclamo vivo de otra tarea que toque esas carpetas (`grep -lE "practicas/expresion/|practicas/redondeo/|practicas/constructor/|practicas/distributiva/|practicas/potencias10/" $R/tareas/*.md` da las fichas; cruza sus números con `ls $R/hechos/reclamos/`; las LISTAS no cuentan).
   Si alguna de tus carpetas sale modificada, es trabajo de otra sesión: no la toques; sigue con las demás y dilo en la
   terminada (`PARCIAL:`), o no reclames si son todas.
3. Abre tu reclamo generando el sid **en el mismo comando** (probado en este Mac):
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -v+180M +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 188\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/188--$sid.md; echo $sid
   ```
   (180 min = 2 × la duración esperada). Tu sid es el del nombre de ese fichero; no lo guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/ | grep '^188--'` — el comando, no la intención. Si hay otro reclamo vivo de la 188
   con `abierto:` más antiguo (o igual y sid menor), añade a tu reclamo `CEDIDA a <sid del otro>` y para.
5. Si el reclamo que encuentras está caducado (RELEVABLE), relévalo con `releva a: <sid anterior>` **en tu propio
   reclamo**. Mira qué dejó hecho (`git log --oneline -8`, `git status -sb`, su carpeta de salida): lo que esté
   comiteado con tests en verde se hereda y se dice en la terminada; lo demás se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** con el guion (`$R/hechos/notas/s-20261111T215225-39c1f4f5-regenerar-tablon.py`,
   ver su cabecera) y sigue con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/188--<sid>.md`) al
terminar cada práctica. Si vas a tardar más de lo que te queda, añade antes una línea `caduca:` más allá. A tu reclamo
solo se añade (`>>`). Tras cualquier pausa: `date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Que **cada ejercicio** de `expresion`, `redondeo`, `constructor`, `distributiva`, `potencias10` lleve el botón «No lo sé»: su `explicacion` (cómo se hace ese ítem, con sus números,
y la solución), o `sinAyuda` con el motivo si es un juego o va por pasos. La especificación completa —qué hace el botón,
cómo se declara, qué tiene que decir la explicación, las reglas de contenido y cómo se prueba— es `docs/no-lo-se.md`;
los modelos, `practicas/fraccion-de/` y `practicas/multiplica-divide/`. Después revisa el significado la tarea
193 (ALTO).

Propio de la unidad 1: La unidad 1 usa «×» para el producto (el resto de su material también); el test genérico no lo marca en esta unidad.

## Qué hay que hacer, por cada práctica (y se comitea al acabar cada una)

1. Lee su `practica.js`, `textos.js` y `logica.js`: qué pide cada ejercicio, qué da por bueno y qué feedback da ya al
   acertar y al fallar. Mira si `generar` usa `sesion.aciertos` como número de paso (`grep -n "aciertos" <carpeta>*.js`).
2. Escribe en `textos.js` (o `logica.js`) una función exportada por ejercicio que devuelva la explicación, y conéctala
   en el `arrancar` de `practica.js` (`explicacion`, y `noLoSe` si es de procedimiento; o `sinAyuda`). Reutiliza el
   paso a paso que ya tenga el feedback de acierto; no dupliques cuentas a mano.
3. Escribe `tests/practicas-ayuda-<slug>.test.js`: 1000 ítems o más por ejercicio (semilla fija, `crearRng`), en los
   idiomas de la práctica, y la explicación contiene la solución que el ejercicio da por buena, calculada con su
   `logica.js`. Modelo: los dos tests de `fraccion-de` y `multiplica-divide` en `tests/practicas-no-lo-se.test.js`.
4. `node --test tests/practicas-no-lo-se.test.js tests/practicas-ayuda-<slug>.test.js` y los tests que ya tuviera la práctica.
5. **A mano**: imprime 15 explicaciones de cada ejercicio en cada idioma (un guion en el scratchpad, nunca en el repo)
   y comprueba las cuentas una a una y que se entiende sin haber visto el ejercicio resuelto.
6. **En el navegador**: `python3 -m http.server 8188` desde la raíz y
   `http://localhost:8188/practicas/<slug>/?probar=1&ejercicio=<k>`; pulsa el botón en **cada** ejercicio, a
   375 px y en ancho, en los dos idiomas, y mira que el ítem apagado y la tarjeta se leen bien y la consola está limpia.
7. Commit de esa práctica y push (paso 2 de «Al terminar»), latido, y a la siguiente.

## Cómo saber que ha terminado

- Las 5 prácticas declaran `explicacion` o `sinAyuda` en sus 15 ejercicios, comiteado y empujado.
- `tests/practicas-no-lo-se.test.js` muestra un test «No lo sé en <slug>» por cada una, en verde, y cada
  `tests/practicas-ayuda-<slug>.test.js` también; `npm test` sin fallos.
- ENTREGA con lo hecho por ejercicio y los hallazgos aparte.

## Trampas conocidas

- (de la coordinadora) El botón solo existe si el ejercicio declara `explicacion`: en varias prácticas de ortografía
  hay un parámetro que ya se llama `explicacion` dentro de sus `montar` (es el feedback); no es lo mismo ni se toca.
- (de la coordinadora) `explicacion` recibe `(item, { idioma, t, tt, esc })`; dentro, usa el `tt` que recibe, no uno
  de fuera, o la traducción saldrá en el idioma equivocado.
- (de la coordinadora) El test genérico genera los ítems con `sesion = { aciertos, fallos, puntos, vidas, anterior, idioma }`
  y `aciertos` de 0 a 9; si tu `generar` necesita algo más, la explicación tiene que aguantar cualquier ítem que salga.
- (de la coordinadora) Otra sesión hace arreglos sueltos en prácticas fuera del reparto (12-11: `division`,
  `factorizaciones`): por eso el `git status --short` de tus carpetas antes de empezar cada práctica.

## Prohibido (propio de esta tarea)

- Cambiar generadores, opciones, comprobaciones o el feedback que ya existe; tocar `disponible` en `catalogo.js`.
- Decidir un `sinAyuda` que no sea «juego» o «por pasos»: se deja `sinAyuda: 'Pendiente de decisión: …'` y va a los hallazgos.
- Empujar una práctica sin haber leído sus explicaciones a mano.

## Si la sesión se alarga

La tarea es idempotente **por práctica**: cada práctica terminada se comitea sola (paso 2 de «Al terminar») antes de
empezar la siguiente. Si no te cabe todo, cierra la práctica en curso o déjala sin tocar (nunca a medias sin comitear),
escribe `$R/hechos/fallos/188--<sid>.md` con qué prácticas quedan y `parada por: sesión agotada`, y `ABANDONADA` en tu
reclamo. Quien la coja después mira qué prácticas declaran ya `explicacion` en todos sus ejercicios y sigue por las demás.

## Si esta tarea resulta ser más de una

No recortes tú. Termina lo que quepa, escribe `$R/hechos/incidencias/<sid>.md` (tamaño real y dónde está el corte
natural), `$R/hechos/fallos/188--<sid>.md` con `parada por: mal cortada`, `ABANDONADA` en tu reclamo, y díselo a Juan Luis.

## Al terminar

1. `node --test tests/practicas-no-lo-se.test.js tests/practicas-ayuda-*.test.js` en verde y `npm test` sin fallos en tus ficheros (un
   fallo en un fichero ajeno con reclamo vivo no es tuyo: anótalo en la terminada).
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas y en la misma orden:
   `git add <rutas> && git commit -m "«No lo sé» en <slug> (tarea 188)" -- <rutas>`; y `git push origin main` (si se rechaza,
   `git pull --rebase origin main`, nunca `--autostash`). Apunta el hash (`git rev-parse --short HEAD`). **Lo empujado
   lo ven los alumnos en las prácticas publicadas**: no empujes una práctica sin sus tests en verde.
3. Escribe `$R/salidas/188-no-lo-se-u1-expresion/ENTREGA.md` y su marcador vacío `ENTREGA.md.ok-<sid>`. Dos apartados separados:
   **lo hecho** (por práctica y ejercicio: `explicacion`, `noLoSe` o `sinAyuda` con su motivo; hash; cómo se probó) y
   **hallazgos fuera de criterio**, que son para Juan Luis (un ítem imposible, un feedback que ya estaba mal, una
   duda de `sinAyuda`…). Nunca un caso de examen en claro.
4. Escribe `$R/hechos/terminadas/188--<sid>.md`: hashes, ficheros (lo que dice `git show --stat`), tests, hora y
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
