# Tarea 205 · Retos con puntos extra en las tareas de la semana (`reto` en la tarea, `api.sumar` y ejercicios sin vidas en la base)

Actualizado: 2026-11-16 (alta de la coordinadora s-20261116T124745-d0ed648f, por el encargo de Juan Luis del 15/16-11; decisiones en `proyecto.md`, «Decisiones del 16-11: el reto «Tabla de propiedades» y los puntos extra»)
Precondición: nadie con reclamo vivo sobre `practicas/_comun/tareas.js`, `semana.js`, `vista-tareas.js`, `profesor-*.js`, `base.js` o `contador.js` · `git status --short` de esos ficheros vacío · Disparo: MANUAL · **Plazo: vie 20-11** (la 206 la necesita; el reto entra en la tarea de la semana 3 de la U3, lun 30-11)
Duración esperada: 2 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: ninguna (la 206 es MEDIO)
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/205-reto-puntos-extra/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/tareas.js`, `practicas/_comun/contador.js`, `practicas/_comun/base.js`, `practicas/semana.js`, `practicas/vista-tareas.js`, `practicas/profesor-tareas.js`, `practicas/profesor-hoy.js` y los demás `practicas/profesor*.js` / `resultados.js` que lean la nota de una tarea, `practicas/plantilla/practica.js` (solo el comentario del contrato), `firestore.rules` solo si el esquema de `config/tareas` lo exige, `tests/practicas-semana.test.js`, `tests/practicas-contador*.test.js` o el test de la base que corresponda, `docs/practicas-guia-profesor.md`

La duración esperada no es informativa: de ella sale la caducidad del reclamo (2 ×), el plazo tras el cual otra
sesión puede relevarte si te cortas. **Este fichero es la fuente de la banda**: el tablón la copia de aquí cada vez que
se regenera. La tabla de bandas de `proyecto.md` la traduce al menú de hoy (ALTO = Opus 5.5, esfuerzo Alto; MEDIO =
Sonnet 5.5, esfuerzo Medio).

## Antes de empezar

Todas las rutas son relativas a la raíz del repositorio (`/Users/salasgar/Documents/git/Ejercicios-interactivos`).
`R=reparto-practicas-u2`. Las sesiones de este reparto trabajan en ese árbol, no en un worktree.

1. Lee `$R/proyecto.md` (al menos «Dónde está cada cosa», «Reglas de contenido comunes» y **«Decisiones del 16-11: el reto «Tabla
   de propiedades» y los puntos extra»**), `$R/_ESTADO.md`, la cabecera de `practicas/_comun/tareas.js` (el modelo de tareas) y
   `$R/salidas/45-diseno-tareas-v2/DISENO.md`, y lista `$R/hechos/` (`ls $R/hechos/*/`): la carpeta manda sobre la tabla.
2. `date -u` para la hora de verdad. `git fetch origin && git status -sb`. **Ojo (16-11): el `main` local del árbol compartido
   divergía de `origin/main` (37 commits locales y 42 de origin sin traer).** Si sigue así, **no lo arregles tú ni hagas `pull`**:
   díselo a Juan Luis y para; es de la coordinadora o de él. Si está al día o solo detrás, `git pull --rebase origin main` (nunca
   `--autostash`). Comprueba la precondición en el disco: `git status --short` de los ficheros de arriba **vacío** y ningún reclamo
   vivo en `$R/hechos/reclamos/` de una tarea cuya ficha los cite.
3. Abre tu reclamo generando el sid **en el mismo comando** (probado en este Mac):
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -v+300M +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 205\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/205--$sid.md; echo $sid
   ```
   (300 min = 2 × la duración esperada). Tu sid es el del nombre de ese fichero; no lo guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/ | grep '^205--'` — el comando, no la intención. Si hay otro reclamo vivo de la 205 con
   `abierto:` más antiguo (o igual y sid menor), añade a tu reclamo `CEDIDA a <sid del otro>` y para.
5. Si el reclamo que encuentras está caducado (RELEVABLE), relévalo con `releva a: <sid anterior>` **en tu propio reclamo**. Mira
   qué dejó hecho (`git log --oneline -8`, `git status -sb`, su carpeta de salida): lo comiteado con tests en verde se hereda y se
   dice en la terminada; lo demás se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** con el guion (`$R/hechos/notas/s-20261111T215225-39c1f4f5-regenerar-tablon.py`,
   ver su cabecera) y sigue con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/205--<sid>.md`) al terminar cada
paso grande. Si vas a tardar más de lo que te queda, añade antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`).
Tras cualquier pausa: `date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de `$R/hechos/reclamos/*.md`; si te han
relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Juan Luis quiere **retos opcionales** dentro de las tareas de la semana: ejercicios más difíciles que no son obligatorios y que, si
el alumno los hace, **suman puntos por encima de los 100 de la tarea**. Sus palabras (15-11): «Cada vez que el alumno complete una
tabla, le damos 1 punto por cada número y cada etiqueta que haya colocado bien. De esta manera, si resuelve todos los retos,
obtendrá bastante más de 10 puntos. Es un premio por resolver un ejercicio de mayor dificultad que los otros.» Y a la pregunta de
cómo cuentan: **«Suman a la nota» aunque pase de 100** (Classroom admite notas por encima del máximo).

El primer reto es la práctica `tabla-propiedades` (tarea 206), pero esta tarea hace el mecanismo general: cualquier práctica podrá
ser reto de cualquier tarea.

## Qué hay que hacer

### 1. En la tarea: el campo `reto`

- Campo opcional `reto` en cada tarea: lista de `[slug, n]`, como `estrella` y `elegir` (tope: 3). Un `[slug, n]` del reto no puede
  estar también en `estrella` ni en `elegir` de la misma tarea.
- **Los puntos del reto no cuentan para los 100**: la nota base sigue igual que hoy (★ + los `nElegir` mejores, sobre 100, con tope
  100). Encima se suma el **extra**: los puntos que el alumno lleve en los ejercicios del reto, **con el mismo peso que un punto de
  un ejercicio normal de esa tarea**: `extra = round(PUNTOS_TAREA · puntosReto / (PUNTOS_POR_EJERCICIO · n))`, con `n` el número de
  ejercicios que cuentan para la base (★ + `nElegir`). Con 6 ★ y 4 a elegir, 1 punto del reto = 1 punto de la nota. Sin tope.
  Es una decisión de la coordinadora sobre la fórmula; la regla («1 punto por pieza, como un punto normal») es de Juan Luis. Si al
  hacerlo ves que no se sostiene, escríbelo en la ENTREGA como hallazgo, no la cambies por tu cuenta.
- **El extra suma siempre**, aunque la base no esté completa (decisión de la coordinadora del 16-11; Juan Luis puede cambiarla: si la
  cambia, es una constante o un `if`, déjalo fácil). Cuenta igual dentro y fuera de plazo que el resto de la tarea (la regla del
  retraso de `estadoPlazo` y `penalizacion-por-retraso` se aplica a la nota total, como hoy a la base).
- **Tareas ya mandadas**: una tarea que no tiene `reto` se comporta exactamente como hoy (mismos números en todos los tests que ya
  existen). Añadir un `reto` a una tarea ya mandada no cambia lo que significa su código de resultado de 20 caracteres
  (`codigos.js`): el código es de respaldo y **el reto no viaja en él** (decide si hay que decirlo en pantalla junto al código; si
  cabe en el formato sin cambiar los códigos ya repartidos, mejor, pero no es obligatorio). Documenta la decisión.
- `erroresTareas` (o lo que valide las tareas) comprueba los `[slug, n]` del reto contra el catálogo, el tope y que no se repitan.

### 2. En la base: dar varios puntos de golpe y ejercicios sin vidas

El reto de la 206 es un solo ejercicio con niveles por dentro: al completar una tabla bien, el alumno gana de golpe tantos puntos
como piezas ha colocado (6, 14, 15, 19…), y comprobar una tabla con errores **no cuesta nada** (Juan Luis: «la tabla se puede
comprobar las veces que haga falta; al quedar entera bien se dan todos los puntos, sin penalizar los intentos»). Hoy la base no
puede hacer ninguna de las dos cosas: cada acierto da 1 (+1 de racha), y cada fallo quita una vida y con 5 vuelve a 0.

- `api.sumar(k)` (o el nombre que encaje con la API actual): suma k puntos de una vez, sin contar como `aciertos` sueltos ni mover la
  racha; termina el ejercicio si llega al `objetivo`. Se guarda en el navegador y en la nube como el resto del progreso.
- Opción de ejercicio `sinVidas: true` (o equivalente): un intento fallido se registra para el profesor (en `fallos`, con lo que la
  práctica pase, si el formato lo admite) pero no quita vida ni puntos ni reinicia. `penalizacion: 0` ya existe; lo que falta son las
  vidas.
- Contrato documentado en el comentario de `practicas/plantilla/practica.js` y probado en el test de la base/contador.
- `migrarProgreso` y `adaptarProgreso` siguen funcionando con progresos guardados antes del cambio.

### 3. Lo que ve el alumno y lo que ve el profesor

- `semana.html` / `vista-tareas.js`: una sección **«Reto (opcional)» / «Challenge (optional)»** debajo de los ★ y de los de
  elegir, con los puntos extra que lleva y los que puede ganar; el marcador de la tarea enseña la nota con el extra («100 + 12»,
  o como quede claro a un alumno de 12 años). Una tarea sin reto no cambia.
- Panel del profesor (`profesor-tareas.js`, `profesor-hoy.js` y todo lo que enseñe o exporte la nota de una tarea): el editor de
  tareas permite poner y quitar el reto (como `elegir`), y las notas pueden pasar de 100 sin cortarse en ningún sitio (tablas, CSV,
  lo que se copie para Classroom).
- **Busca todos los que leen la nota de una tarea** (`git grep -n "puntosSobreCien\|PUNTOS_TAREA\|maximo"` y lo que salga de ahí), dentro y
  **fuera del repositorio**: `~/.claude/lanzador/` (`classroom_pendientes.py`), la skill `~/.claude/skills/atender-correo/` (califica
  las tareas de la app en Classroom), la rutina del informe diario de prácticas y `apuntes-1eso-bilingue/comun/gestion/`. **Fuera del
  repositorio no edites nada**: lista en la ENTREGA qué fichero, qué línea y qué habría que cambiar, para que Juan Luis o una sesión de
  ese proyecto lo haga.
- `firestore.rules`: si el esquema de `config/tareas` o del progreso valida campos o topes que el reto rompe (`puntos <= objetivo`,
  claves permitidas…), cámbialo **y no lo des por hecho**: las reglas las publica Juan Luis a mano (en la ENTREGA, el enlace de la
  consola y la ruta absoluta del fichero, como dice `proyecto.md`). Hasta que las publique, que nada falle en silencio.

### 4. Tests

- `tests/practicas-semana.test.js`: una tarea de prueba con reto: base 100 + extra con la fórmula; el extra con 6 ★ + 4 y con 5 ★ + 0;
  reto sin empezar = 0; reto repetido con `estrella` → error; tope de 3; una tarea sin reto da exactamente lo de antes (los casos que
  ya hay siguen igual).
- Test de la base/contador: `sumar(k)` termina al llegar al objetivo; `sinVidas` no quita vidas ni puntos tras 20 fallos.
- `npm test` entero en verde.

## Datos de entrada

- `practicas/_comun/tareas.js` (cabecera: el modelo), `practicas/_comun/contador.js`, `practicas/_comun/base.js`, `codigos.js`,
  `practicas/semana.js`, `vista-tareas.js`, `profesor*.js`; `$R/salidas/45-diseno-tareas-v2/DISENO.md`.
- Memoria de Juan Luis sobre la idea: `~/.claude/projects/-Users-salasgar-Documents-git-Ejercicios-interactivos/memory/idea-tabla-doble-entrada-propiedades.md` (solo lectura).

## Cómo saber que ha terminado

- `reto` en el modelo de tareas, `sumar` y `sinVidas` en la base, sección del reto en la página de la semana y en el panel, notas por
  encima de 100 sin cortar; tests nuevos y `npm test` en verde; comiteado y empujado.
- Probado en el navegador (`npm run servir`; `?probar=1`) con una tarea de prueba con reto (usa una práctica cualquiera como reto, la
  206 aún no existe): el alumno ve la sección y el extra; el panel enseña más de 100. A 375 y 1200 px, consola limpia.
- La ENTREGA dice: la API exacta (`reto`, `sumar`, `sinVidas`) para la 206; la fórmula; qué pasa con el código de resultado; la lista
  de consumidores **fuera del repo** con lo que hay que cambiar en cada uno; si hay que publicar reglas.

## Trampas conocidas

- (Ninguna aún. Quien encuentre una, la escribe aquí al cerrar.)

## Prohibido

- Cambiar la nota de una tarea sin `reto` (ni un punto, ni un redondeo).
- Cambiar el formato del código de resultado de forma que los códigos ya repartidos dejen de leerse.
- Tocar el progreso guardado de los alumnos en Firestore, o renumerar ids de tareas o del catálogo.
- Editar ficheros fuera del repositorio (lanzador, skills, apuntes): solo se listan.
- Poner un `reto` en una tarea real de Juan Luis: eso es de la 207 y del panel.
- `git add` separado de `git commit`; `git commit` sin rutas explícitas.

## Al terminar

1. `npm test` en verde. Commit del código con rutas explícitas (`git commit -m "…" -- ruta1 ruta2…`) → sale el hash.
2. `$R/salidas/205-reto-puntos-extra/ENTREGA.md` y su marcador `ENTREGA.md.ok-<sid>`.
3. `$R/hechos/terminadas/205--<sid>.md` con el hash, la duración real y el `npm test`; `CERRADA` al final de tu reclamo.
4. Trampas nuevas en esta ficha. Regenera `$R/_ESTADO.md` con el guion.
5. Un commit con rutas explícitas de tus ficheros de `hechos/`, la salida, `_ESTADO.md` y esta ficha → `git push`. Si se rechaza,
   trae lo nuevo, **regenera otra vez el tablón** y vuelve a comitear.
6. Dile a Juan Luis, en pocas líneas: qué hace el reto, la fórmula, si tiene que publicar reglas (con enlace y ruta) y qué hay que
   cambiar fuera del repositorio.
7. Dale la foto del momento (EN CURSO · LIBRES · BLOQUEADAS) y **las frases de arranque** de lo que haya quedado libre, cada una con
   su nombre de sesión delante, su banda traducida y la tarea o cadena que reclama (la 206 queda libre al cerrar esta).
