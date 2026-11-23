# Tarea 07 · Escribir y comprobar las soluciones que faltan

Actualizado: 2026-11-23
Precondición: 06 LISTA · Disparo: MANUAL
Duración esperada: 90 min (tiempo de sesión) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `salidas/07-soluciones/`
Ficheros que toca: —

Rutas relativas a `reparto-web/` salvo que empiecen por `docs/`, `acertijos/`, `tests/`, `practicas/` o `~`.
La banda se traduce a modelo en la tabla de `proyecto.md`. Este fichero es la fuente de la banda y de la duración.

## Antes de empezar
Sigue «Antes de hacer nada» de `reparto-web/_ESTADO.md`, entero: leer `proyecto.md` y el tablón, listar `hechos/`,
`date -u`, abrir `hechos/reclamos/07--<sid>.md` generando el sid en ese mismo comando, `sleep 30 && ls hechos/reclamos/`,
ceder si otra sesión llegó antes, y **regenerar el tablón entero** si ganas. Caducidad inicial: el doble de la
duración esperada, mínimo 45 minutos. Si hay precondición de firma, se mira en `autorizaciones.md`. Después, sigue con
la tarea hasta cerrarla o soltarla, sin parar a pedir confirmación.

## Objetivo
Unas 33 fichas de Classroom, y las que añadan las demás fuentes, no tienen solución escrita. La página las necesita
(pista y solución ocultas hasta pulsar).

## Qué hay que hacer
1. De `salidas/06-catalogo/INFORME.md`, la lista de fichas `publicable: si` sin solución.
2. Para cada una: resuélvela, **comprueba el resultado por un segundo camino** (o con un script en `comprobaciones/`),
   y escribe en `soluciones.json`: `id` → `{pista, solucion, comprobado_con}`. Pista de una frase, que no destripe.
   Solución paso a paso, con el lenguaje de 1.º ESO, y en el idioma del enunciado.
3. Si un enunciado es ambiguo, no tiene solución o tiene varias, no lo fuerces: a `dudas.md`, para Juan Luis.
4. Repasa de paso las soluciones que ya existían: si alguna está mal, a `dudas.md` (no se corrige en silencio).

Si algún paso te pide decidir algo que va a durar y no está decidido en la ficha, no lo decidas: entrégalo como
propuesta marcada, o para con `BLOQUEADA por decisión`.

## Datos de entrada
- `salidas/06-catalogo/` · `salidas/03-adjuntos-classroom/adjuntos/` (los enunciados en imagen).

## Salida esperada
`salidas/07-soluciones/`: `soluciones.json`, `comprobaciones/`, `dudas.md`.
Ningún fichero cuenta hasta que existe al lado su marcador vacío `<nombre>.ok-<sid>`.

## Cómo saber que ha terminado
Cada ficha publicable sin solución está en `soluciones.json` o en `dudas.md`; ninguna en los dos ni en ninguno.

## Si la sesión se alarga
Con una señal (releer lo ya leído, lentitud, una operación larga por delante, aviso de límite), termina y no encadenes.
Con varias: deja los marcadores, `hechos/notas/<sid>-traspaso-07.md` con el estado exacto, `hechos/fallos/07--<sid>.md`
con `parada por: sesión agotada`, y `ABANDONADA` en tu reclamo.

## Al terminar
1. Verifica la comprobación de arriba; cada fichero de salida lleva su marcador vacío `<nombre>.ok-<sid>`.
2. `hechos/terminadas/07--<sid>.md`: recuento, rutas, hora y **duración real**.
3. `CERRADA` en tu reclamo. Choques, a `hechos/incidencias/<sid>.md`.
4. Regenera `_ESTADO.md` entero desde `hechos/` (con `git fetch` antes) y anota aquí abajo las trampas nuevas.
5. Un commit con rutas explícitas (tus ficheros de `hechos/`, `_ESTADO.md`, esta ficha) y `push`, desde este
   árbol. Si el `push` se rechaza: `git pull --rebase`, regenera el tablón otra vez y repite.
6. A Juan Luis: la foto del momento (EN CURSO · LIBRES · BLOQUEADAS) y, solo para las LIBRES, las frases de arranque
   de `proyecto.md` con su nombre de sesión, la banda traducida y la tarea o cadena ya puestas. Lo mismo si la sueltas.
7. Encadena solo en verde y con una tarea de tu banda (cabecera, «Encadenable con»).

Si paras sin terminar: `hechos/fallos/07--<sid>.md` con `parada por: sesión agotada | avería | mal cortada` y
`ABANDONADA` en tu reclamo. Si la tarea resulta ser varias, no la recortes tú: incidencia con el corte natural,
fallo `mal cortada` y avisa.

## Trampas conocidas
- Es una tarea **larga**: si no cabe, deja las hechas con su `.ok` y la lista de las que faltan en el fallo.
- Los de pesadas (33a, 37, 38) y los de lógica por inducción (9, 11, 40, 46) son los que más errores admiten: doble comprobación.

## Prohibido
- No escribir fuera de la carpeta de salida de esta tarea (y de los «Ficheros que toca», si los hay).
- No hacer `git add .`, `-A`, `commit -a`, `stash` ni `reset --hard`: el índice es compartido (CLAUDE.md, «Git»).
- `salidas/` está fuera de git a propósito (material ajeno y sin revisar): no forzar su subida.
- No tocar `salidas/06-catalogo/`: las soluciones van en fichero aparte y las une la tarea 09.
