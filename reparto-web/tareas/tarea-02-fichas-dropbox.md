# Tarea 02 · Fichas de los acertijos de «ex Dropbox»

Actualizado: 2026-11-23
Precondición: 01 LISTA · Disparo: MANUAL
Duración esperada: 60 min (tiempo de sesión) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `salidas/02-fichas-dropbox/`
Ficheros que toca: —

Rutas relativas a `reparto-web/` salvo que empiecen por `docs/`, `acertijos/`, `tests/`, `practicas/` o `~`.
La banda se traduce a modelo en la tabla de `proyecto.md`. Este fichero es la fuente de la banda y de la duración.

## Antes de empezar
Sigue «Antes de hacer nada» de `reparto-web/_ESTADO.md`, entero: leer `proyecto.md` y el tablón, listar `hechos/`,
`date -u`, abrir `hechos/reclamos/02--<sid>.md` generando el sid en ese mismo comando, `sleep 30 && ls hechos/reclamos/`,
ceder si otra sesión llegó antes, y **regenerar el tablón entero** si ganas. Caducidad inicial: el doble de la
duración esperada, mínimo 45 minutos. Si hay precondición de firma, se mira en `autorizaciones.md`. Después, sigue con
la tarea hasta cerrarla o soltarla, sin parar a pedir confirmación.

## Objetivo
Convertir en fichas, con el mismo esquema que las de Classroom, los acertijos del banco local que sean de verdad
acertijos o retos para alumnos, y marcar cuáles ya están en Classroom para no duplicarlos.

## Qué hay que hacer
1. Lee `salidas/00-classroom/catalogo.json` (66 fichas) y `docs/acertijos-recopilacion.md`.
2. Recorre `salidas/01-dropbox-extraccion/texto/` por este orden: `2018-2019/` (serie semanal 1-14), `Acertijos/`,
   los sueltos de la raíz («Acertijos con las soluciones», «Más acertijos», «Acertijos clasificados por tipo»…),
   `Ingenio/`, `Juegos/`, y el resto.
3. Una ficha por acertijo en `fichas.json`. Esquema de ficha (el de `salidas/00-classroom/catalogo.json`; léelo antes): `id`, `titulo`, `enunciado` (texto
tal cual, sin retocar), `adjuntos`, `solucion`, `adjuntos_solucion`, `tipo` (L lógica · N números · G geometría ·
P pesadas y medidas · J juegos y puzles · S series · T pensamiento lateral · C contar), `nivel` (1, 2 o 3
estrellas), `idioma`, `fuente`, `notas`. Añade `clasificacion: "propuesta"` a lo que clasifiques tú, y
`autor_ajeno` cuando el material no sea de Juan Luis (libro, web, captura de redes, concurso).
   Si ya está en Classroom, ficha mínima con `duplicado_de: "<id de Classroom>"` y, si aquí hay algo que allí falta
   (solución, versión en inglés, texto del enunciado), cópialo en `aporta`.
4. Lo que no es acertijo (administración, oposiciones, divulgación, libros enteros) no lleva ficha: una línea en
   `descartado.md` por carpeta, con el motivo.
5. `INFORME.md`: fichas nuevas, duplicadas, con y sin solución, y qué carpetas quedan sin mirar si la sesión se acaba.

Si algún paso te pide decidir algo que va a durar y no está decidido en la ficha, no lo decidas: entrégalo como
propuesta marcada, o para con `BLOQUEADA por decisión`.

## Datos de entrada
- `salidas/01-dropbox-extraccion/` (tarea 01) · `salidas/00-classroom/catalogo.json` (hecho antes del reparto).

## Salida esperada
`salidas/02-fichas-dropbox/`: `fichas.json`, `descartado.md`, `INFORME.md`.
Ningún fichero cuenta hasta que existe al lado su marcador vacío `<nombre>.ok-<sid>`.

## Cómo saber que ha terminado
`fichas.json` es JSON válido, cada ficha tiene `id` único con prefijo `D-`, y toda carpeta del banco aparece en `INFORME.md` o en `descartado.md`.

## Si la sesión se alarga
Con una señal (releer lo ya leído, lentitud, una operación larga por delante, aviso de límite), termina y no encadenes.
Con varias: deja los marcadores, `hechos/notas/<sid>-traspaso-02.md` con el estado exacto, `hechos/fallos/02--<sid>.md`
con `parada por: sesión agotada`, y `ABANDONADA` en tu reclamo.

## Al terminar
1. Verifica la comprobación de arriba; cada fichero de salida lleva su marcador vacío `<nombre>.ok-<sid>`.
2. `hechos/terminadas/02--<sid>.md`: recuento, rutas, hora y **duración real**.
3. `CERRADA` en tu reclamo. Choques, a `hechos/incidencias/<sid>.md`.
4. Regenera `_ESTADO.md` entero desde `hechos/` (con `git fetch` antes) y anota aquí abajo las trampas nuevas.
5. Un commit con rutas explícitas (tus ficheros de `hechos/`, `_ESTADO.md`, esta ficha) y `push`, desde este
   árbol. Si el `push` se rechaza: `git pull --rebase`, regenera el tablón otra vez y repite.
6. A Juan Luis: la foto del momento (EN CURSO · LIBRES · BLOQUEADAS) y, solo para las LIBRES, las frases de arranque
   de `proyecto.md` con su nombre de sesión, la banda traducida y la tarea o cadena ya puestas. Lo mismo si la sueltas.
7. Encadena solo en verde y con una tarea de tu banda (cabecera, «Encadenable con»).

Si paras sin terminar: `hechos/fallos/02--<sid>.md` con `parada por: sesión agotada | avería | mal cortada` y
`ABANDONADA` en tu reclamo. Si la tarea resulta ser varias, no la recortes tú: incidencia con el corte natural,
fallo `mal cortada` y avisa.

## Trampas conocidas
- La serie 2018-19 es casi toda duplicado de Classroom 9-15; lo valioso suele ser la versión en inglés y las soluciones.
- Hay un libro ajeno entero («Los 100 mejores juegos de ingenio») y exámenes de oposición: no se fichan.
- Es una tarea **larga**, no mal cortada: si no cabe, deja hechas las carpetas que quepan y dilo en el fallo.

## Prohibido
- No escribir fuera de la carpeta de salida de esta tarea (y de los «Ficheros que toca», si los hay).
- No hacer `git add .`, `-A`, `commit -a`, `stash` ni `reset --hard`: el índice es compartido (CLAUDE.md, «Git»).
- `salidas/` está fuera de git a propósito (material ajeno y sin revisar): no forzar su subida.
- No reescribir ni «mejorar» los enunciados: se copian tal cual. No cambiar la clasificación de las fichas de Classroom.
