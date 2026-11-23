# Tarea 16 · Borrador de la página «Familias»

Actualizado: 2026-11-23
Precondición: ninguna · Disparo: MANUAL
Duración esperada: 30 min (tiempo de sesión) · Banda de modelo: ALTO · Encadenable con: 10
Carpeta de salida (dueña exclusiva): `salidas/16-borrador-familias/`
Ficheros que toca: —

Rutas relativas a `reparto-web/` salvo que empiecen por `docs/`, `acertijos/`, `tests/`, `practicas/` o `~`.
La banda se traduce a modelo en la tabla de `proyecto.md`. Este fichero es la fuente de la banda y de la duración.

## Antes de empezar
Sigue «Antes de hacer nada» de `reparto-web/_ESTADO.md`, entero: leer `proyecto.md` y el tablón, listar `hechos/`,
`date -u`, abrir `hechos/reclamos/16--<sid>.md` generando el sid en ese mismo comando, `sleep 30 && ls hechos/reclamos/`,
ceder si otra sesión llegó antes, y **regenerar el tablón entero** si ganas. Caducidad inicial: el doble de la
duración esperada, mínimo 45 minutos. Si hay precondición de firma, se mira en `autorizaciones.md`. Después, sigue con
la tarea hasta cerrarla o soltarla, sin parar a pedir confirmación.

## Objetivo
Texto para una página que explique a las familias cómo se trabaja en clase, para contestar con un enlace lo que
ahora se contesta por correo. Es un texto que firma Juan Luis: aquí solo se redacta el borrador.

## Qué hay que hacer
1. Carga la skill `my-writing-style` (registro «familias»). Lee en la memoria del proyecto lo que ya está decidido:
   hoja semanal y publicación, examen semanal, app y códigos, penalización por retraso, redondeo de notas, entregas
   fuera de plazo, horario de atención. No inventes normas: lo que no esté escrito va como **pregunta** al final.
2. `borrador.md`: página breve, en primera persona, con apartados cortos. Sin nombres de alumnos ni de familias.
3. `preguntas.md`: lo que falta por saber para cerrarla.

Si algún paso te pide decidir algo que va a durar y no está decidido en la ficha, no lo decidas: entrégalo como
propuesta marcada, o para con `BLOQUEADA por decisión`.

## Datos de entrada
- `~/.claude/projects/-Users-salasgar-Documents-git-Ejercicios-interactivos/memory/MEMORY.md` y las notas que enlaza.

## Salida esperada
`salidas/16-borrador-familias/`: `borrador.md`, `preguntas.md`.
Ningún fichero cuenta hasta que existe al lado su marcador vacío `<nombre>.ok-<sid>`.

## Cómo saber que ha terminado
El borrador cubre los siete puntos del paso 1 o los lleva a `preguntas.md`.

## Si la sesión se alarga
Con una señal (releer lo ya leído, lentitud, una operación larga por delante, aviso de límite), termina y no encadenes.
Con varias: deja los marcadores, `hechos/notas/<sid>-traspaso-16.md` con el estado exacto, `hechos/fallos/16--<sid>.md`
con `parada por: sesión agotada`, y `ABANDONADA` en tu reclamo.

## Al terminar
1. Verifica la comprobación de arriba; cada fichero de salida lleva su marcador vacío `<nombre>.ok-<sid>`.
2. `hechos/terminadas/16--<sid>.md`: recuento, rutas, hora y **duración real**.
3. `CERRADA` en tu reclamo. Choques, a `hechos/incidencias/<sid>.md`.
4. Regenera `_ESTADO.md` entero desde `hechos/` (con `git fetch` antes) y anota aquí abajo las trampas nuevas.
5. Un commit con rutas explícitas (tus ficheros de `hechos/`, `_ESTADO.md`, esta ficha) y `push`, desde este
   árbol. Si el `push` se rechaza: `git pull --rebase`, regenera el tablón otra vez y repite.
6. A Juan Luis: la foto del momento (EN CURSO · LIBRES · BLOQUEADAS) y, solo para las LIBRES, las frases de arranque
   de `proyecto.md` con su nombre de sesión, la banda traducida y la tarea o cadena ya puestas. Lo mismo si la sueltas.
7. Encadena solo en verde y con una tarea de tu banda (cabecera, «Encadenable con»).

Si paras sin terminar: `hechos/fallos/16--<sid>.md` con `parada por: sesión agotada | avería | mal cortada` y
`ABANDONADA` en tu reclamo. Si la tarea resulta ser varias, no la recortes tú: incidencia con el corte natural,
fallo `mal cortada` y avisa.

## Trampas conocidas
- Juan Luis escribe en primera persona y no anuncia estrategias; su centro es un instituto, no un colegio.

## Prohibido
- No escribir fuera de la carpeta de salida de esta tarea (y de los «Ficheros que toca», si los hay).
- No hacer `git add .`, `-A`, `commit -a`, `stash` ni `reset --hard`: el índice es compartido (CLAUDE.md, «Git»).
- `salidas/` está fuera de git a propósito (material ajeno y sin revisar): no forzar su subida.
- No ponerlo en la web: lo hará otra tarea cuando él lo apruebe. No mencionar la IA en el texto.
