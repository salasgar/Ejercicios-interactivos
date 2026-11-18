# Tarea 210 · Menos lecturas de Firestore en las herramientas del profesor, y la app de los alumnos protegida ante una cuota agotada

Actualizado: 2026-11-18 (alta de la coordinadora s-20261118T222927-cc5dc2ff, por encargo de Juan Luis del 18-11; ver `proyecto.md`, «Alta del 18-11: tarea 210»)
Precondición: 209 LISTA (lo está: 32cf2ea; la 210 toca el mismo `informe-actividad.mjs`) · ningún reclamo vivo sobre los «Ficheros que toca» (a 18-11 22:30Z no había ninguno: los EN CURSO eran 153, 154 y 159, que no los tocan) · `git status --short herramientas practicas/_comun/nube.js practicas/_comun/espacio.js tests` vacío · Disparo: MANUAL · Plazo: sin fecha, pero **urgente**: hasta que esté, cada pasada que lea de más puede agotar otra vez la cuota
Duración esperada: 2 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: ALTO (toca el código de la app de los alumnos: un error aquí pierde progreso de alumnos y es caro de detectar) · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/210-lecturas-firestore/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca):
- en el repositorio: `herramientas/informe-actividad.mjs`, `practicas/_comun/nube.js`, `practicas/_comun/espacio.js` (solo si hace falta), `tests/herramientas-informe.test.js`, `tests/practicas-nube.test.js`, `tests/practicas-espacio.test.js`, y, si la caché se saca a un módulo, `herramientas/cache-lecturas.mjs` y `tests/herramientas-cache-lecturas.test.js` (nuevos);
- **fuera del repositorio**: `~/.claude/lanzador/notas_tarea_app.mjs` (la ficha lo dice aquí a propósito: no está en git; hay que editarlo, no copiarlo al repo);
- **solo leer**: `practicas/profesor.js` (hacia la línea 1185: es el modelo de lectura incremental; no se edita).

La duración esperada no es informativa: de ella sale la caducidad del reclamo (2 ×). **Este fichero es la fuente de la banda**; la
tabla de bandas de `proyecto.md` la traduce al menú de hoy (ALTO = Opus 5.5, esfuerzo Alto).

## Antes de empezar

Rutas relativas a la raíz del repositorio (`/Users/salasgar/Documents/git/Ejercicios-interactivos`). `R=reparto-practicas-u2`. Las
sesiones de este reparto trabajan en ese árbol, no en un worktree (regla de git del 16-11 en `CLAUDE.md`).

1. Lee `$R/proyecto.md` («Alta del 18-11: tarea 210»), `$R/_ESTADO.md`, `$R/salidas/209-informe-con-reto/ENTREGA.md` y lista `$R/hechos/`
   (`ls $R/hechos/*/`): la carpeta manda sobre la tabla. Lee también la cabecera de `~/.claude/lanzador/notas_tarea_app.mjs` y su guarda del 18-11.
2. `date -u`. `git fetch origin && git status -sb`; si hay commits que traer, `git pull --rebase origin main` (nunca `--autostash`).
   Comprueba que `git status --short` de los «Ficheros que toca» sale **vacío**; si no, es trabajo de otra sesión: no reclames.
3. Reclama, con el sid generado **en el mismo comando**:
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -v+300M +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 210\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/210--$sid.md && git commit -m "PU2 210: reclamo" -- $R/hechos/reclamos/210--$sid.md && echo $sid
   ```
4. `sleep 30 && ls $R/hechos/reclamos/ | grep '^210--'`. Si hay otro reclamo vivo de la 210 con `abierto:` más antiguo, añade
   `CEDIDA a <sid del otro>` al tuyo y para. Uno caducado se releva con `releva a: <sid>` en tu reclamo.
5. Si ganas, regenera `$R/_ESTADO.md` entero con el guion (`$R/hechos/notas/s-20261111T215225-39c1f4f5-regenerar-tablon.py`) y sigue
   hasta cerrar o soltar; no termines el turno para pedir confirmación.

Latidos con `printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/210--<sid>.md`. A tu reclamo solo se añade.

## El problema (diagnóstico del 18-11)

- El 18-11 hacia las 23:07 (hora peninsular) se agotó la cuota diaria de lecturas de Firestore (plan Spark, unas 50 000 al día; se
  renueva a las 9:00 de Madrid). Firestore respondía 429 `RESOURCE_EXHAUSTED`. Causa: 35 ejecuciones en 90 s de
  `herramientas/informe-actividad.mjs --espacio … --json` y de `~/.claude/lanzador/notas_tarea_app.mjs`, en bucles de un subagente.
- Cada ejecución baja **enteras** las subcolecciones `progreso-libre` y `progreso-tareas`: unas 1 300 lecturas (328 + 924 documentos el
  18-11), que crecen cada semana:
  - `notas_tarea_app.mjs`, líneas 15-16, con `listarSubcoleccion`;
  - `informe-actividad.mjs`, hacia la línea 465, y además `asignaciones`, paginado en las líneas 421-441.
- El panel del profesor **ya lee de forma incremental**: caché en IndexedDB y `desdeParaLeer` con margen de 2 días
  (`practicas/profesor.js`, hacia la línea 1185), con `runQuery` y `where actualizado > …`. Ese es el modelo.
- Efecto en los alumnos con la cuota agotada:
  - en un aparato sin caché, `resolverCodigo` (`practicas/_comun/espacio.js`, 71-80) da `sin-red` y no ven tareas;
  - `subirFusionado` (`practicas/_comun/nube.js`, 311-317) escribe aunque la lectura falle, y puede pisar en la nube el progreso hecho
    en otro aparato.
- Juan Luis ha descartado pasar a plan de pago: la solución es leer menos.

## Qué hay que hacer

1. **Varias tareas en una sola lectura.** `notas_tarea_app.mjs` acepta `1 2 3 15 16` (una lectura de las subcolecciones, una salida por
   tarea: p. ej. `{ "tareas": [ {id, titulo, …, alumnos}, … ] }`; con un solo número, conserva la salida de hoy para no romper la skill
   `atender-correo`, `referencias/calificar.md`). `informe-actividad.mjs` gana una opción equivalente (`--tareas 1,2,3`, o la que
   decidas; documenta la elegida en la cabecera) que lee una vez y saca el informe de cada tarea.
2. **Caché local con lectura incremental**, en los dos scripts, como el panel: la primera vez baja todo y la guarda; las siguientes
   piden solo los documentos con `actualizado` posterior a lo último visto, **menos el margen de 2 días** (`desdeParaLeer`) por si
   un aparato sube con retraso, con `runQuery` y `where actualizado > …` en `progreso-libre` y `progreso-tareas` (y lo que valga para
   `asignaciones`). Verifica contra el esquema real que los documentos llevan ese campo y que las reglas dejan consultar con la
   cuenta lectora; si algún documento no lo lleva, di cuáles y cómo se resuelve (nunca una caché que se quede con datos viejos en
   silencio). Los borrados no salen en una consulta incremental: decide cada cuántos días (o con qué opción, p. ej. `--sin-cache`) se
   hace una lectura completa, y anótalo en la cabecera. Un módulo común (`herramientas/cache-lecturas.mjs`) evita escribirlo dos veces.
   - **La caché vive FUERA del repositorio**, porque lleva datos de alumnos y el repo es público: p. ej.
     `~/.claude/cache/firestore-practicas/`, con permisos 600. Nunca en una ruta que git pueda ver; añade un test que lo compruebe
     (que la ruta por defecto no cuelga del repo).
3. **Ante un 429 o un error del servidor (5xx), parar con un mensaje claro**, también dentro de `listarSubcoleccion` (hoy una página que
   falla puede dejar una lista corta que parece completa). Código de salida distinto de 0, mensaje en una línea («cuota de Firestore
   agotada hasta las 9:00 de Madrid: NO reintentes») y **ninguna caché a medias**: la caché se escribe entera o no se toca. El
   18-11 ya se puso una guarda mínima en `notas_tarea_app.mjs`, tras `leerConfig`; se conserva y se amplía.
4. **App de los alumnos: `subirFusionado` (`nube.js`).** Valora —y decide, con la razón por escrito en la ENTREGA— que no escriba cuando
   la lectura previa falló por 429 o error del servidor (**no** por falta de red). Pésalo: escribir sin haber leído puede pisar el
   progreso hecho en otro aparato; no escribir puede perder lo hecho en este si el alumno cierra antes de que vuelva la cuota.
   Mira cómo se comporta hoy `espacio.js` (`resolverCodigo`, 71-80) con un 429. Si no escribir es lo elegido, el progreso local ha de
   quedar guardado y marcado como pendiente de subir, y subirse en la siguiente ocasión; si lo elegido es escribir, di por qué el
   riesgo es aceptable. Es una **decisión que tomas tú con el criterio escrito**, no la dejes sin razonar. Distinguir 429 y 5xx de
   «sin red» exige que `leerConfig`/la lectura devuelvan el motivo (hoy devuelven un estado): usa estados ya existentes si los hay.
5. **Tests** (`npm test`): cache incremental (primera lectura completa, segunda con `where`, margen de 2 días, caché corrupta o de otra
   versión → lectura completa), parada en 429 y en 500 sin caché a medias, salida de varias tareas, ruta de la caché fuera del repo, y
   para `nube.js` el caso 429 de la decisión del punto 4 (y que «sin red» se sigue comportando como hasta ahora). Con `fetch` simulado:
   **los tests no tocan Firestore**.

## Trampas conocidas

- **No pruebes contra Firestore a lo loco**: la cuota es lo que se está protegiendo. Hasta las 9:00 del 19-11 (Madrid) puede seguir
  agotada. Una pasada real de comprobación, una sola, con la cuenta lectora (`security find-generic-password -s firebase-lector-informe -w`;
  memoria `lector-informe-llavero`), y mide cuántas lecturas hace la primera y cuántas la segunda (la consola de Firebase las cuenta
  con retraso; si no puedes medir, cuéntalas por documentos devueltos).
- `notas_tarea_app.mjs` está fuera del repo: no se comitea. Dilo en la ENTREGA con la ruta y haz una copia de seguridad a la
  `salidas/210-lecturas-firestore/` **sin credenciales** (no hay ninguna en el script: la clave viene del llavero), para que quede
  rastro del cambio.
- `informe-actividad.mjs` lo usa la rutina diaria en la nube (`trig_018p4Y73wGMvZu7Uxjf27Tc1`, 21:30 Madrid) leyendo el repositorio
  publicado: **allí no hay caché local** (cada ejecución es una sesión nueva). La caché debe ser opcional y no romper esa ruta: sin
  caché, el comportamiento es el de hoy. Con ~1 300 lecturas al día esa rutina sola no agota la cuota; no la toques más.
- `listaDeSiempre(51)`, `claveDocumento`, `documentosAMapa` y `ejerciciosDe` los usan los dos scripts y la 209 acaba de tocar
  `ejerciciosDe`: lee su ENTREGA antes de editar.
- Ningún nombre de alumno en ningún fichero del repo, tampoco en los tests ni en los ejemplos de la caché (el repo es público).

## Al terminar

1. `node --test tests/herramientas-informe.test.js tests/practicas-nube.test.js tests/practicas-espacio.test.js` (y el test nuevo) en
   verde y `npm test` sin fallos en tus ficheros.
2. Commit **solo de los «Ficheros que toca» del repositorio**: `git commit -m "Lecturas de Firestore: caché incremental, varias tareas por lectura, parada en 429 (tarea 210)" -- <rutas>`.
3. `$R/salidas/210-lecturas-firestore/ENTREGA.md` + marcador vacío `ENTREGA.md.ok-<sid>`: lo hecho, hash, cómo se probó, la decisión del
   punto 4 con su razón, las lecturas medidas, el cambio de `notas_tarea_app.mjs` (fuera del repo), y **hallazgos fuera de criterio**
   (p. ej. otras lecturas pesadas: `profesor.js`, la rutina de las 21:30, el atender-correo).
4. Avisa a Juan Luis de que la skill `atender-correo` (`referencias/calificar.md`) debe decir que ya se puede pasar varias tareas de una vez,
   o actualízala tú si es una skill local en `~/.claude/skills/atender-correo/` y no toca claude.ai (ver su CLAUDE.md global).
5. `$R/hechos/terminadas/210--<sid>.md` (hash, `git show --stat`, tests, hora y **duración real**); `CERRADA` en tu reclamo.
6. `git fetch origin`, relista `$R/hechos/` y regenera `$R/_ESTADO.md` con el guion.
7. Un solo commit con rutas explícitas de tus ficheros de `$R/hechos/`, tu carpeta de `$R/salidas/`, `$R/_ESTADO.md` y esta ficha, y
   `git push origin main` desde este árbol. Si se rechaza: `git pull --rebase origin main`, regenera el tablón otra vez y repite.
8. Dile a Juan Luis la foto del momento y, solo para las LIBRES, las frases de arranque de `proyecto.md`.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca». `git add .`, `-A`, `commit -a`, un `add` separado del `commit`, `git stash`,
  `--autostash`, `git checkout -- .`, `git reset --hard`.
- Editar el código con `sed -i` o heredocs desde el shell (el candado de sesiones solo ve Edit/Write); `hechos/` sí, desde el shell.
- Reescribir un fichero de `hechos/` (solo `>>`), editar un reclamo ajeno o regenerar el tablón de memoria.
- Nombres de alumnos reales en ningún fichero (el repo es público). La caché de lecturas, **nunca dentro del repositorio**.
- Escribir en Firestore desde las herramientas: solo leen. Pasar el proyecto a plan de pago (Juan Luis lo ha descartado).
- Bucles de ejecuciones reales de los scripts contra Firestore para probar: una pasada real, como mucho dos.
