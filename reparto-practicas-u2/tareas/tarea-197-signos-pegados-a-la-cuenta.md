# Tarea 197 · Base común: que el signo de puntuación no se quede solo en el renglón siguiente detrás de una `.cuenta` (375 px), con una sola solución en `_comun`

Actualizado: 2026-11-14 (alta de la coordinadora s-20261114T205046-d42ceb19; hallazgo 19 de la revisión 193, «Signos sueltos a 375 px (de la base, no de las tarjetas)»)
Precondición: ninguna tarea previa (la 193 está LISTA) · ningún reclamo vivo de otra tarea que toque `practicas/_comun/base.js`, `practicas/_comun/piezas.js`, `practicas/_comun/estilos.css`, `tests/practicas-comun.test.js` o `tests/practicas-no-lo-se.test.js`, ni cambios sin comitear en ellos (hoy no hay ninguna tarea libre que los toque) · Disparo: MANUAL
Duración esperada: 1 h 30 min (tiempo de sesión) · Banda de modelo: ALTO · Encadenable con: ninguna
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/197-signos-pegados-a-la-cuenta/` (solo `ENTREGA.md`, su marcador y `capturas/`)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/base.js`, `practicas/_comun/piezas.js` (solo si el ayudante va ahí), `practicas/_comun/estilos.css` (solo las reglas de `.cuenta` y `.cuenta-frac` y su comentario de cabecera), `tests/practicas-comun.test.js`, `tests/practicas-no-lo-se.test.js` (solo la excepción de la unidad 1 del «×», línea ~202, y su comentario), `docs/no-lo-se.md` (solo la línea de «Cómo se prueba» que cita esa excepción)

La duración esperada no es informativa: de ella sale la caducidad del reclamo (2 ×), el plazo tras el cual otra
sesión puede relevarte si te cortas. **Este fichero es la fuente de la banda**: el tablón la copia de aquí cada vez que
se regenera. La tabla de bandas de `proyecto.md` la traduce al menú de hoy (ALTO = Opus 5.5, esfuerzo Alto; MEDIO =
Sonnet 5.5, esfuerzo Medio).

## Antes de empezar

Todas las rutas son relativas a la raíz del repositorio (`/Users/salasgar/Documents/git/Ejercicios-interactivos`).
`R=reparto-practicas-u2`. Las sesiones de este reparto trabajan en ese árbol, no en un worktree.

1. Lee `$R/proyecto.md` (al menos «Dónde está cada cosa», «Reglas de contenido comunes», «Tareas 171-194» y **«Decisiones del 14-11»**),
   `$R/_ESTADO.md`, `docs/no-lo-se.md` y los hallazgos de `$R/salidas/193-revision-no-lo-se/ENTREGA.md`, y lista `$R/hechos/`
   (`ls $R/hechos/*/`): la carpeta manda sobre la tabla.
2. `date -u` para la hora de verdad. `git fetch origin && git status -sb`; si hay commits que traer,
   `git pull --rebase origin main` (nunca `--autostash`). **Comprueba la precondición en el disco**:
   `git status --short practicas/_comun/ tests/practicas-comun.test.js tests/practicas-no-lo-se.test.js docs/no-lo-se.md` tiene que salir **vacío**, y `ls $R/hechos/reclamos/` no tiene ningún reclamo vivo de una tarea cuya ficha cite `_comun/base.js`, `_comun/piezas.js` o `_comun/estilos.css` (`grep -lE "_comun/(base|piezas)[.]js|_comun/estilos[.]css" $R/tareas/*.md`).
   Si algo tuyo sale modificado, es trabajo de otra sesión: no lo toques y no reclames.
3. Abre tu reclamo generando el sid **en el mismo comando** (probado en este Mac):
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -v+180M +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 197\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/197--$sid.md; echo $sid
   ```
   (180 min = 2 × la duración esperada). Tu sid es el del nombre de ese fichero; no lo guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/ | grep '^197--'` — el comando, no la intención. Si hay otro reclamo vivo de la 197
   con `abierto:` más antiguo (o igual y sid menor), añade a tu reclamo `CEDIDA a <sid del otro>` y para.
5. Si el reclamo que encuentras está caducado (RELEVABLE), relévalo con `releva a: <sid anterior>` **en tu propio
   reclamo**. Mira qué dejó hecho (`git log --oneline -8`, `git status -sb`, su carpeta de salida): lo que esté
   comiteado con tests en verde se hereda y se dice en la terminada; lo demás se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** con el guion (`$R/hechos/notas/s-20261111T215225-39c1f4f5-regenerar-tablon.py`,
   ver su cabecera) y sigue con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/197--<sid>.md`) al
terminar cada paso grande. Si vas a tardar más de lo que te queda, añade antes una línea `caduca:` más allá. A tu reclamo
solo se añade (`>>`). Tras cualquier pausa: `date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

`.cuenta` es `display: inline-block; max-width: 100%; overflow-wrap: anywhere` (`practicas/_comun/estilos.css`, línea ~213; lo puso la
37 para que una cuenta no se parta si cabe en un renglón y no ensanche la página si no cabe). Un bloque en línea admite un salto de
renglón justo detrás, así que el punto, la coma o el paréntesis que siguen a la cuenta pueden quedarse **solos al principio del renglón
siguiente**. La 193 lo midió a 375 px con seis «No lo sé» por ejercicio, tarjeta y traducción: **118 signos sueltos en 35 de 109
ejercicios** de la U1 y la U2 (los peores: `reloj` ej. 2, 18; `leelo` ej. 2, 16; `distributiva` ej. 1, 12; `baldosas` ej. 3, 10). Pasa
igual en el feedback y, con toda probabilidad, en las prácticas de las unidades 3-6 y en `.cuenta-frac`.

**Una sola solución en la base, no un parche por práctica**: hay unas 60 prácticas que escriben `<span class="cuenta">…</span>` a mano
en sus textos, y ninguna se toca.

## Qué hay que hacer

1. Reproduce la medida de la 193 antes de cambiar nada (su guion está descrito en la ENTREGA, «Cómo se ha probado»: Chrome headless por
   CDP sobre `python3 -m http.server 81NN`, `?probar=1&ejercicio=<k>`, 375 px). Un signo suelto es un nodo de texto que sigue a una
   `.cuenta` y cuyo primer carácter (`. , ; : ) » ” ! ?`) está en un renglón distinto del final de la cuenta (compara los `getClientRects`).
   Mide al menos los cuatro peores y dos prácticas de fracciones (`.cuenta-frac`).
2. Elige la solución **en `_comun`** y justifícala en la ENTREGA con la medida. Propuesta de la coordinadora (puedes cambiarla si otra
   mide mejor): un ayudante de la base que, sobre el HTML que la base pinta en el feedback, la tarjeta del «No lo sé» y la traducción
   (`base.js`, los `innerHTML` de `#feedback` y de la caja de ayuda, líneas ~813-980), recorra cada `.cuenta` / `.cuenta-frac` y **meta
   dentro del bloque los signos de cierre que la siguen** (y los de apertura que la preceden: `(`, `«`, `“`, `¿`, `¡`), sin la negrita
   (un `span` interior con `font-weight: normal`). Así el signo viaja con la cuenta y no hace falta cambiar el `display`.
   Lo que **no** vale: `white-space: nowrap` en la cuenta o en un envoltorio (vuelve el desbordamiento que arregló la 37), ni tocar los
   textos de las prácticas.
3. Las cuentas que una práctica pinta por su cuenta fuera de esas zonas (enunciados, introducciones) no son de esta tarea: mide cuántos
   signos sueltos quedan ahí y dilo como hallazgo.
4. Tests en `tests/practicas-comun.test.js`: el ayudante con cadenas de ejemplo (cuenta + punto, cuenta + coma + texto, paréntesis
   alrededor, dos cuentas seguidas, cuenta al final sin signo, `.cuenta-frac`, HTML sin cuentas: sale igual), y que es idempotente.
5. Vuelve a medir a 375 px y a 1200 px: **0 signos sueltos** en feedback, tarjeta y traducción de los ejercicios del paso 1 y de una
   muestra de 20 ejercicios más repartidos por las seis unidades; ningún desbordamiento horizontal (`scrollWidth` ≤ ancho) en ninguno;
   capturas de los cuatro peores, antes y después, en `capturas/`.
6. **De paso, el «×» de la U1** (decisión de Juan Luis del 14-11: la app usa «·» también en la U1; `docs/no-lo-se.md` ya lo dice):
   `tests/practicas-no-lo-se.test.js` (línea ~202) solo prohíbe «×» en las explicaciones desde la unidad 2. Quita la excepción de la U1
   si pasa en verde con las quince prácticas de la U1, y pon al día el comentario de la línea ~160 y la frase de `docs/no-lo-se.md`
   («sin «×» desde la unidad 2»). Si alguna práctica de la U1 falla, no la toques: deja la excepción y dilo como hallazgo.

## Cómo saber que ha terminado

- A 375 px no queda ningún signo suelto detrás de una cuenta en el feedback, la tarjeta ni la traducción de los ejercicios medidos, sin
  desbordamiento y sin haber tocado ninguna carpeta de práctica; `npm test` en verde; comiteado y empujado; ENTREGA con las dos medidas.

## Trampas conocidas

- (de la coordinadora) La 37 puso `inline-block` + `overflow-wrap: anywhere` porque una práctica metía una frase entera en una
  `.cuenta` y ensanchaba la página a 375 px; hay un test de eso en `tests/practicas-comun.test.js`: tiene que seguir en verde.
- (de la coordinadora) Hay reabiertas libres de quince prácticas de la U1 y la U2 (14-11) y la 198: tocan `practicas/<slug>/` y sus
  tests, nunca `_comun`. Pueden ir a la vez que esta. Si mientras mides ves un fichero de práctica a medio editar, no es tuyo.
- (de la coordinadora) `practicas/_comun/relaciones.js` también define su `cuenta()`: no hace falta tocarlo si el ayudante trabaja
  sobre el HTML ya pintado.
- (de la 193) En la pasada de medida, `constructor` ej. 1 no cargó una vez porque el servidor de prueba cortó la conexión: reintenta.
- (de la 197) **Desactiva la caché del Chrome headless** (`Network.setCacheDisabled`) al medir después de un cambio: con el mismo
  perfil y el mismo puerto, la medida «final» salió con la `base.js` de antes y parecía que el arreglo no hacía nada.
- (de la 197) Un U+2060 entre una `.frac` (`inline-flex`) y su signo no impide el corte en Chrome; un envoltorio `inline-block` sí.
- (de la 197) `base.js` puede quedar cogido por otra sesión (incluso fuera del reparto) después de reclamar: avanza con lo que no
  lo toca y espera; no fuerces el candado.

## Prohibido (propio de esta tarea)

- Tocar los textos, el feedback o los generadores de ninguna práctica; cambiar cómo se cuenta, se puntúa o se guarda.
- Arreglarlo con `nowrap`, o con una regla que deje desbordar la página a 375 px.

## Si la sesión se alarga

Si no te cabe todo, comitea lo que esté con tests en verde, escribe `$R/hechos/fallos/197--<sid>.md` con lo que queda y
`parada por: sesión agotada`, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

No recortes tú. Termina lo que quepa, escribe `$R/hechos/incidencias/<sid>.md` (tamaño real y dónde está el corte
natural), `$R/hechos/fallos/197--<sid>.md` con `parada por: mal cortada`, `ABANDONADA` en tu reclamo, y díselo a Juan Luis.

## Al terminar

1. `node --test tests/practicas-comun.test.js tests/practicas-no-lo-se.test.js` en verde y `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con reclamo vivo no es tuyo:
   anótalo en la terminada).
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas y en la misma orden:
   `git add <rutas> && git commit -m "Base: el signo va pegado a la cuenta (tarea 197)" -- <rutas>`; y `git push origin main` (si se rechaza,
   `git pull --rebase origin main`, nunca `--autostash`). Apunta el hash (`git rev-parse --short HEAD`). **Lo empujado
   lo ven los alumnos en las prácticas publicadas**: no empujes nada sin sus tests en verde.
3. Escribe `$R/salidas/197-signos-pegados-a-la-cuenta/ENTREGA.md` y su marcador vacío `ENTREGA.md.ok-<sid>`. Dos apartados separados:
   **lo hecho** (qué se cambió, hash, cómo se probó, con las medidas) y **hallazgos fuera de criterio**, que son para Juan Luis.
   Nunca un caso de examen en claro.
4. Escribe `$R/hechos/terminadas/197--<sid>.md`: hashes, ficheros (lo que dice `git show --stat`), tests, hora y
   **duración real** (de `abierto:` a ahora). Si queda algo sin hacer, empieza por `PARCIAL:` y di qué.
5. Añade `CERRADA` a tu reclamo (línea propia que empieza por esa palabra).
6. Choques encontrados → `$R/hechos/incidencias/<sid>.md`.
7. `git fetch origin`, relista `$R/hechos/` **ahora** y regenera `$R/_ESTADO.md` entero con el guion.
8. Vuelca en «Trampas conocidas» lo que hayas aprendido por las malas (es lo único de la ficha que editas, además de la duración).
9. Un solo commit con rutas explícitas de tus ficheros de `$R/hechos/` (por sid), tu carpeta de `$R/salidas/`,
   `$R/_ESTADO.md` y esta ficha, y `git push origin main`. Si el push se rechaza: `git pull --rebase origin main`,
   regenera el tablón otra vez desde `hechos/` (no lo fusiones a mano) y vuelve a comitear y empujar.
10. Dile al usuario la **foto del momento** en tres líneas («EN CURSO: … · LIBRES ahora: … · BLOQUEADAS: …»), sacada
    de la lectura de `hechos/` del paso 7.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni carpetas de prácticas, ni `practicas/_comun/` fuera de lo declarado, ni `catalogo.js`, ni `css/`, ni `README.md`, ni
  `firestore.rules`, ni fichas ajenas, ni nada de la carpeta de apuntes de iCloud.
- `git add .`, `git add -A`, `git commit -a`, o un `add` separado del `commit`. El índice es compartido con otras
  sesiones del mismo árbol. Nunca `git stash`, `--autostash`, `git checkout -- .` ni `git reset --hard`.
- Editar el código con `sed -i` o heredocs desde el shell: el candado de sesiones solo ve Edit/Write. El código se
  edita con las herramientas de edición; `hechos/` sí se escribe desde el shell (un escritor).
- Reescribir un fichero de `hechos/` (solo `>>`), editar un reclamo ajeno, o regenerar el tablón de memoria.
- Dependencias nuevas (npm, CDN). Nombres de alumnos reales en ningún fichero.
