# Tarea 207 · Revisión a mano (con clics) y publicación del reto «Tabla de propiedades» (`tabla-propiedades`, 83), con la propuesta de en qué tarea de la U3 entra como reto

Actualizado: 2026-11-16 (alta de la coordinadora s-20261116T124745-d0ed648f, por el encargo de Juan Luis del 15/16-11; decisiones en `proyecto.md`, «Decisiones del 16-11: el reto «Tabla de propiedades» y los puntos extra»)
Precondición: **205 y 206 LISTAS** (terminadas sin `PARCIAL`) · **no en paralelo con la 203 ni con la 204** (las tres tocan `catalogo.js`, docs y `README.md`; en cadena, en cualquier orden) · Disparo: MANUAL · **Plazo: vie 27-11** (el reto entra en la tarea de la semana 3 de la U3, desde el lun 30-11)
Duración esperada: 1 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: 203 o 204 (si su precondición se cumple)
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/207-publicar-tabla-propiedades/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/catalogo.js` (solo `disponible` de la fila 83), `docs/practicas-unidad2.md` (la línea de publicadas y la fila de la práctica), `README.md` (una fila en la tabla de la unidad 2 y el recuento del párrafo)

La duración esperada no es informativa: de ella sale la caducidad del reclamo (2 ×), el plazo tras el cual otra
sesión puede relevarte si te cortas. **Este fichero es la fuente de la banda**: el tablón la copia de aquí cada vez que
se regenera. La tabla de bandas de `proyecto.md` la traduce al menú de hoy (ALTO = Opus 5.5, esfuerzo Alto; MEDIO =
Sonnet 5.5, esfuerzo Medio).

## Antes de empezar

Todas las rutas son relativas a la raíz del repositorio (`/Users/salasgar/Documents/git/Ejercicios-interactivos`).
`R=reparto-practicas-u2`. Las sesiones de este reparto trabajan en ese árbol, no en un worktree.

1. Lee `$R/proyecto.md` (al menos «Dónde está cada cosa», «Reglas de contenido comunes» y **«Decisiones del 16-11: el reto «Tabla
   de propiedades» y los puntos extra»**), `$R/_ESTADO.md`, la **ENTREGA de la 205** (`$R/salidas/205-reto-puntos-extra/ENTREGA.md`:
   la API de `sumar`, `sinVidas` y `reto`), la **ENTREGA de la 206** (`$R/salidas/206-tabla-propiedades/ENTREGA.md`) y lista `$R/hechos/`
   (`ls $R/hechos/*/`): la carpeta manda sobre la tabla.
2. `date -u` para la hora de verdad. `git fetch origin && git status -sb`; si hay commits que traer, `git pull --rebase origin main`
   (nunca `--autostash`). Si el `main` local diverge de `origin/main`, no lo arregles: díselo a Juan Luis y para. **Comprueba la
   precondición en el disco**: `ls $R/hechos/terminadas/ | grep -E '^(205|206)--' (las dos)`, ningún reclamo vivo de la 203 ni de la 204, y
   `git status --short` de los ficheros de arriba **vacío**. Si algo sale modificado, es trabajo de otra sesión: no lo toques y no
   reclames.
3. Abre tu reclamo generando el sid **en el mismo comando** (probado en este Mac):
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -v+180M +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 207\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/207--$sid.md; echo $sid
   ```
   (180 min = 2 × la duración esperada). Tu sid es el del nombre de ese fichero; no lo guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/ | grep '^207--'` — el comando, no la intención. Si hay otro reclamo vivo de la 207 con
   `abierto:` más antiguo (o igual y sid menor), añade a tu reclamo `CEDIDA a <sid del otro>` y para.
5. Si el reclamo que encuentras está caducado (RELEVABLE), relévalo con `releva a: <sid anterior>` **en tu propio reclamo**. Mira
   qué dejó hecho (`git log --oneline -8`, `git status -sb`, su carpeta de salida): lo comiteado con tests en verde se hereda y se
   dice en la terminada; lo demás se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** con el guion (`$R/hechos/notas/s-20261111T215225-39c1f4f5-regenerar-tablon.py`,
   ver su cabecera) y sigue con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/207--<sid>.md`) al terminar cada
paso grande. Si vas a tardar más de lo que te queda, añade antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`).
Tras cualquier pausa: `date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de `$R/hechos/reclamos/*.md`; si te han
relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Que el reto «Tabla de propiedades» (idea de Juan Luis del 15-11; ver la ficha 206) llegue a los alumnos sin un solo fallo que
penalice una respuesta buena, y que Juan Luis sepa en qué tarea ponerlo y qué va a pasar con la nota. Este curso entra **como reto
de repaso de la U2 dentro de una tarea de la U3**; el curso que viene, como reto opcional dentro de una tarea de la U2.

## Qué hay que hacer

1. Lee las ENTREGAS de la 205 y de la 206 (API, fórmula del extra, niveles, banco, recuentos, hallazgos) y sus terminadas.
2. `node --test tests/practicas-comun.test.js tests/practicas-tabla-propiedades.test.js tests/practicas-semana.test.js` y `npm test`.
3. **Tu propio barrido** (un guion **en el scratchpad**, nunca en el repo), 20 000 tablas por nivel con las funciones de
   `practicas/tabla-propiedades/logica.js`: que **todas** tienen solución (con tu propio emparejamiento, no con el del test), ninguna
   casilla imposible, las reglas de rechazo de la ficha 206, la variedad, y las propiedades comprobadas contra listas tuyas (primos <
   100, cuadrados, triangulares, divisores). En la ENTREGA, solo recuentos.
4. **A mano**: 20 tablas por nivel, en los dos idiomas: las etiquetas se entienden y no hay dos equivalentes; y 30 frases de feedback
   de intentos fallidos con las cuentas comprobadas una a una (divisores listados, factorizaciones, «1 no es primo ni compuesto»).
   Regla de oro del proyecto (CLAUDE.md): **un número bien colocado no puede marcarse nunca como fallo**.
5. **En el navegador**, con clics de ratón **y con el dedo simulado** (modo táctil de las herramientas de Chrome), a 375 px y a
   1200 px, en español y en inglés, con «Probar sin código» (nunca el código de un alumno ni `AJJN`): los cuatro niveles completos
   con soluciones **distintas** de la del generador (otro reparto de etiquetas en filas y columnas), un intento fallido con su
   feedback, mover y devolver piezas, la infografía de «triangular» con «Sí» y con «No»; que la tabla de 4 × 3 cabe a 375 px sin
   scroll horizontal; los puntos que suma cada nivel (6, 14, 15, 19); consola limpia. **Y con una tarea de prueba con `reto`** (de la
   205): el extra aparece en la página de la semana y en el panel, y la nota pasa de 100 sin cortarse.
6. **Publicar**: `disponible: true` en la fila 83 de `catalogo.js` (nada más de ese fichero), si pasa. En `docs/practicas-unidad2.md`,
   la línea de publicadas y la fila de la práctica; en `README.md`, la fila en la tabla de la unidad 2 y el recuento. Commit con rutas
   explícitas. **Lo empujado lo ven los alumnos**: se publica solo con todo lo anterior en verde.
7. **La propuesta para la tarea semanal** (en la ENTREGA, y dicha a Juan Luis): la tarea de la **semana 3 de la U3** (desde el lun
   30-11; mira en el panel o en la ENTREGA de la 116 cuál es su id) con `reto: [['tabla-propiedades', 1]]`; cuántos puntos extra da
   el reto completo **en esa tarea** con la fórmula de la 205 (54 puntos del reto × el peso de un punto en esa tarea); y cómo se lo
   explicaría a los alumnos en una línea («Reto opcional: suma puntos por encima de 100»). **Juan Luis la pone en el panel**; tú no
   tocas sus tareas. Si la 205 dejó cambios pendientes **fuera del repositorio** (lanzador, `atender-correo`, gestión) o reglas de
   Firestore sin publicar, recuérdaselo: sin eso, la nota de más de 100 no llega a Classroom.

## Datos de entrada

- ENTREGAS y terminadas de la 205 y la 206; `practicas/tabla-propiedades/` (solo lectura salvo lo que diga «Ficheros que toca»).
- La idea, tal como la guardó Juan Luis: `~/.claude/projects/-Users-salasgar-Documents-git-Ejercicios-interactivos/memory/idea-tabla-doble-entrada-propiedades.md` (solo lectura).

## Cómo saber que ha terminado

- Publicada (`disponible: true`) con todo lo de arriba en verde, docs y README al día, comiteado y empujado; o, si algo falla, **sin
  publicar** y con una reabierta de la 206 (`$R/hechos/reabiertas/206--<sid>.md`) que diga qué y cómo reproducirlo.
- La ENTREGA dice los recuentos, cómo se probó, la propuesta de tarea con los puntos extra y lo pendiente fuera del repo.

## Trampas conocidas

- **(s-20261117T064522-40c5ab61, primera pasada)** El «cabe a 375 px» no es solo el scroll horizontal: a 360-375 px la tabla de **2 × 4
  (nivel 2)** no desborda, pero una palabra de la cabecera (`Compuesto`, `Composite`, `Cuadrado perfecto`) es más ancha que la pieza y
  sale cortada. Se mide con la pieza real: meter cada una de las 38 etiquetas en una cabecera de columna y de fila y comparar el ancho de
  su palabra más larga (un `span` con la misma `font`) con el ancho útil de la pieza, a 320, 360 y 375 px, es y en. Los niveles 3 y 4
  (3 columnas) caben a 360 px y más.
- Para jugar con una solución **distinta** de la del generador hay que conocer el diseño: servir `logica.js` cambiado por `Fetch` (que
  `generarNivel` guarde cada ítem en `globalThis`) y buscar en Node otro reparto de etiquetas con solución. Para forzar un nivel o
  «triangular», cambiar en el mismo `logica.js` servido `nivelDePuntos` (parámetro de la URL) y `PROB_TRIANGULAR`.
- La página de la semana solo enseña el reto si la fila del catálogo está `disponible: true`: para probar la tarea con `reto` antes de
  publicar, se pone en el árbol durante la prueba y se deshace si no se publica (`git checkout -- practicas/_comun/catalogo.js`, solo
  si nadie más tiene cambios en ese fichero).
- El servidor `python3 -m http.server` en frío da `ERR_CONNECTION_RESET` en algunas cargas (ya lo vieron la 205 y la 206): repetir la
  pasada antes de dar nada por fallo de la práctica.
- En zsh, `for a in "375 es dedo" …; do node x.mjs $a` pasa la cadena entera como un solo argumento: `${=a}`.

## Prohibido

- Publicar con un solo caso en que una colocación válida se marque como fallo.
- Cambiar código de la práctica (eso es una reabierta de la 206) o de la base y las tareas (de la 205).
- Tocar las tareas de Juan Luis en el panel o en Firestore.
- `git add` separado de `git commit`; `git commit` sin rutas explícitas.

## Al terminar

1. `npm test` en verde. Commit de la publicación con rutas explícitas → sale el hash.
2. `$R/salidas/207-publicar-tabla-propiedades/ENTREGA.md` y su marcador `ENTREGA.md.ok-<sid>`.
3. `$R/hechos/terminadas/207--<sid>.md` con el hash, la duración real y el `npm test`; `CERRADA` al final de tu reclamo.
4. Trampas nuevas en esta ficha. Regenera `$R/_ESTADO.md` con el guion.
5. Un commit con rutas explícitas de tus ficheros de `hechos/`, la salida, `_ESTADO.md` y esta ficha → `git push`. Si se rechaza,
   trae lo nuevo, **regenera otra vez el tablón** y vuelve a comitear.
6. Dile a Juan Luis: publicada (con el enlace), la propuesta para la tarea de la semana 3 de la U3 y lo pendiente fuera del repo.
7. Dale la foto del momento (EN CURSO · LIBRES · BLOQUEADAS) y **las frases de arranque** de lo que haya quedado libre, cada una con
   su nombre de sesión delante, su banda traducida y la tarea o cadena que reclama.
