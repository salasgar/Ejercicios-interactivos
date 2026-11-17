# Tarea 209 · El informe de actividad (y la pestaña «Hoy» del panel) también ve los ejercicios de reto

Actualizado: 2026-11-17 (alta de la coordinadora s-20261116T124745-d0ed648f, por encargo de Juan Luis del 17-11; ver `proyecto.md`, «Alta del 17-11: tarea 209»)
Precondición: 205 LISTA (lo está: df972d0) · ningún reclamo vivo sobre los «Ficheros que toca» · `git status --short herramientas/informe-actividad.mjs practicas/profesor-hoy.js tests/herramientas-informe.test.js` vacío · Disparo: MANUAL · **Plazo: vie 27-11** (el primer reto entra en la tarea de la semana 3 de la U3, lun 30-11)
Duración esperada: 1 h (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/209-informe-con-reto/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `herramientas/informe-actividad.mjs`, `practicas/profesor-hoy.js` (solo si hace falta para mostrar lo nuevo), `tests/herramientas-informe.test.js`

La duración esperada no es informativa: de ella sale la caducidad del reclamo (2 ×). **Este fichero es la fuente de la banda**; la
tabla de bandas de `proyecto.md` la traduce al menú de hoy (MEDIO = Sonnet 5.5, esfuerzo Medio).

## Antes de empezar

Rutas relativas a la raíz del repositorio (`/Users/salasgar/Documents/git/Ejercicios-interactivos`). `R=reparto-practicas-u2`. Las
sesiones de este reparto trabajan en ese árbol, no en un worktree (regla de git del 16-11 en `CLAUDE.md`).

1. Lee `$R/proyecto.md` («Dónde está cada cosa», «Decisiones del 16-11: el reto…» y «Alta del 17-11: tarea 209»), `$R/_ESTADO.md`,
   `$R/salidas/205-reto-puntos-extra/ENTREGA.md` (apartado «Fuera del repositorio», punto 3) y la cabecera de
   `herramientas/informe-actividad.mjs`; lista `$R/hechos/` (`ls $R/hechos/*/`): la carpeta manda sobre la tabla.
2. `date -u`. `git fetch origin && git status -sb`; si hay commits que traer, `git pull --rebase origin main` (nunca `--autostash`).
   Comprueba que `git status --short` de los «Ficheros que toca» sale **vacío**; si no, es trabajo de otra sesión: no reclames.
3. Reclama, con el sid generado **en el mismo comando**:
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -v+120M +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 209\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/209--$sid.md && git commit -m "PU2 209: reclamo" -- $R/hechos/reclamos/209--$sid.md && echo $sid
   ```
4. `sleep 30 && ls $R/hechos/reclamos/ | grep '^209--'`. Si hay otro reclamo vivo de la 209 con `abierto:` más antiguo, añade
   `CEDIDA a <sid del otro>` al tuyo y para. Uno caducado se releva con `releva a: <sid>` en tu reclamo.
5. Si ganas, regenera `$R/_ESTADO.md` entero con el guion (`$R/hechos/notas/s-20261111T215225-39c1f4f5-regenerar-tablon.py`) y sigue
   hasta cerrar o soltar; no termines el turno para pedir confirmación.

Latidos con `printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/209--<sid>.md`. A tu reclamo solo se añade.

## El problema

La 205 añadió a las tareas el campo `reto` (lista de `[slug, n]`, fuera de los 100; ver `practicas/_comun/tareas.js`). El informe
de actividad (`herramientas/informe-actividad.mjs`) saca los ejercicios de una tarea con `ejerciciosDe(tarea)`, que solo junta
`estrella` y `elegir`. Así que **no lee los documentos de las prácticas de reto**: quien solo ha trabajado en el reto sale como que no
ha entrado ni ha estado activo, y la tabla de ejercicios no dice cuántos lo prueban ni lo terminan. Lo usan dos sitios:

- la **rutina diaria** en la nube (`trig_018p4Y73wGMvZu7Uxjf27Tc1`, 21:30 hora peninsular), que lee el repositorio publicado y manda
  el informe a Juan Luis por correo;
- la pestaña **«Hoy» del panel** (`practicas/profesor-hoy.js`, que llama a `agregar`).

No califica mal: el «puntos» del informe no es la nota (la nota sale de `estadoTarea`). Es actividad que no se ve.

## Qué hay que hacer

1. `ejerciciosDe(tarea)` devuelve también los del reto, marcados: `{ slug, n, estrella: false, reto: true }` (los demás con
   `reto: false`), detrás de los de elegir. `tarea.reto` puede faltar (tareas antiguas o de la configuración guardada): `?? []`.
2. En `agregar`:
   - Los documentos del reto cuentan para `existe`, `activo` y `ultima` (quien solo hace el reto **ha entrado** y está activo).
   - **No** cuentan para `puntos`, `terminadosEstrella`, `terminadosElegir` ni `completa`: siguen siendo los de la tarea.
   - Cada fila de alumno lleva además `puntosReto` (los del contador del reto; usa el `estado` de `estadoTarea`, que ya lo calcula)
     y `nota` (`estado.puntos`, base + extra: la que ve el alumno, que puede pasar de 100).
   - En `porEjercicio`, los del reto se cuentan igual (prueban, terminan, fallos, reinicios) y llevan `reto: true`.
   - **Alertas**: un reto no dispara «Ejercicio difícil o confuso» ni «Muchos reinicios» (es difícil a propósito, se comprueba sin
     penalizar y no tiene vidas). La alerta de «N fallos y 0 puntos» de un alumno no debe contar los fallos del reto.
3. En `formatear`:
   - Tabla de ejercicios: los del reto con la marca ` (reto)` en vez de ` ★`.
   - Resumen: una línea «Reto: lo han probado N alumnos; lo han terminado M.» solo si la tarea tiene reto.
   - Lista de alumnos: tras los puntos, `· nota N` y, si `puntosReto > 0`, `· reto +X pt`. Que el texto deje claro que
     «pt» es el contador y «nota» la de la app.
4. `practicas/profesor-hoy.js`: si pinta su propia tabla con los campos de `agregar`, que los ejercicios del reto salgan marcados
   igual. Si no hace falta tocarlo, no lo toques y dilo en la ENTREGA.
5. Tests en `tests/herramientas-informe.test.js`: una tarea con reto y tres alumnos (uno solo con reto, uno con la tarea completa
   y reto, uno sin nada): `existe`/`activo`, `puntos` sin el reto, `nota` con el extra, sin alertas por el reto, texto de
   `formatear` con la marca. Que los tests que ya hay sigan pasando sin cambiarlos (salvo que esperen la lista exacta de
   `ejerciciosDe` en una tarea con reto, que hoy no existe).

## Al terminar

1. `node --test tests/herramientas-informe.test.js` en verde y `npm test` sin fallos en tus ficheros.
2. Si puedes, una pasada real de solo lectura (cuenta lectora del llavero, ver la cabecera del informe y la memoria
   `lector-informe-llavero`) con `--tarea` de una tarea sin reto: el informe sale igual que antes salvo la columna nueva.
3. Commit **solo de los «Ficheros que toca»**: `git commit -m "Informe de actividad: los ejercicios de reto (tarea 209)" -- <rutas>`.
4. `$R/salidas/209-informe-con-reto/ENTREGA.md` + marcador vacío `ENTREGA.md.ok-<sid>`: lo hecho, hash, cómo se probó, y
   **hallazgos fuera de criterio**.
5. `$R/hechos/terminadas/209--<sid>.md` (hash, `git show --stat`, tests, hora y **duración real**); `CERRADA` en tu reclamo.
6. `git fetch origin`, relista `$R/hechos/` y regenera `$R/_ESTADO.md` con el guion.
7. Un solo commit con rutas explícitas de tus ficheros de `$R/hechos/`, tu carpeta de `$R/salidas/`, `$R/_ESTADO.md` y esta ficha, y
   `git push origin main` desde este árbol. Si se rechaza: `git pull --rebase origin main`, regenera el tablón otra vez y repite.
8. Dile a Juan Luis la foto del momento y, solo para las LIBRES, las frases de arranque de `proyecto.md`.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca». `git add .`, `-A`, `commit -a`, un `add` separado del `commit`, `git stash`,
  `--autostash`, `git checkout -- .`, `git reset --hard`.
- Editar el código con `sed -i` o heredocs desde el shell (el candado de sesiones solo ve Edit/Write); `hechos/` sí, desde el shell.
- Reescribir un fichero de `hechos/` (solo `>>`), editar un reclamo ajeno o regenerar el tablón de memoria.
- Nombres de alumnos reales en ningún fichero (el repo es público).
- Escribir en Firestore: el informe solo lee.
