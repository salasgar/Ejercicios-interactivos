# Tarea 06 · Fusionar y clasificar el catálogo de acertijos

Actualizado: 2026-11-23
Precondición: 02, 03 y 04 LISTAS · Disparo: MANUAL
Duración esperada: 75 min (tiempo de sesión) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `salidas/06-catalogo/`
Ficheros que toca: —

Rutas relativas a `reparto-web/` salvo que empiecen por `docs/`, `acertijos/`, `tests/`, `practicas/` o `~`.
La banda se traduce a modelo en la tabla de `proyecto.md`. Este fichero es la fuente de la banda y de la duración.

## Antes de empezar
Sigue «Antes de hacer nada» de `reparto-web/_ESTADO.md`, entero: leer `proyecto.md` y el tablón, listar `hechos/`,
`date -u`, abrir `hechos/reclamos/06--<sid>.md` generando el sid en ese mismo comando, `sleep 30 && ls hechos/reclamos/`,
ceder si otra sesión llegó antes, y **regenerar el tablón entero** si ganas. Caducidad inicial: el doble de la
duración esperada, mínimo 45 minutos. Si hay precondición de firma, se mira en `autorizaciones.md`. Después, sigue con
la tarea hasta cerrarla o soltarla, sin parar a pedir confirmación.

## Objetivo
Juntar en un solo catálogo las fichas de Classroom, de «ex Dropbox» y del sitio antiguo, sin duplicados, con el
tipo y el nivel **confirmados leyendo cada acertijo** (ahora son provisionales, puestos por el título), y con la
unidad del curso con la que encaja cada uno.

## Qué hay que hacer
1. Parte de `salidas/00-classroom/catalogo.json`; incorpora lo que aportan los duplicados de 02 y 04 (`aporta`),
   las transcripciones y adjuntos de 03, y añade las fichas nuevas de 02 y 04.
2. Lee cada enunciado y confirma `tipo` y `nivel` (quita `clasificacion: "propuesta"` al confirmarlo). Criterio de
   nivel: 1 = lo saca casi cualquiera de 1.º ESO en unos minutos; 2 = hay que pensar o probar; 3 = reto.
3. Añade `unidad` (U1 naturales, U2 divisibilidad, U3 enteros, U4 fracciones, U5 decimales, U6 álgebra,
   U7 proporcionalidad, U8 geometría, o vacío) y `publicable` (`si` | `enlazar` | `no`) con su motivo: material
   ajeno entero o capturas de redes → `enlazar` o `no`; con nombres de alumnos → `no`.
4. Renumera **solo con un campo nuevo** `orden`; los `id` de origen no se cambian.
5. `catalogo.json`, `adjuntos/` (solo los de fichas `publicable: si`), y `INFORME.md`: recuento por tipo, por nivel
   y por unidad; fichas sin solución (entrada de la tarea 07); y las **dudas de clasificación**, para Juan Luis.

Si algún paso te pide decidir algo que va a durar y no está decidido en la ficha, no lo decidas: entrégalo como
propuesta marcada, o para con `BLOQUEADA por decisión`.

## Datos de entrada
- `salidas/00-classroom/`, `salidas/02-fichas-dropbox/`, `salidas/03-adjuntos-classroom/`, `salidas/04-sitio-antiguo-y-drive/`.
- `docs/acertijos-recopilacion.md`: los ocho tipos y los tres niveles ya están aprobados por Juan Luis (23-11-2026); no se rediscuten.

## Salida esperada
`salidas/06-catalogo/`: `catalogo.json`, `adjuntos/`, `INFORME.md`.
Ningún fichero cuenta hasta que existe al lado su marcador vacío `<nombre>.ok-<sid>`.

## Cómo saber que ha terminado
Ningún `id` repetido; toda ficha tiene `tipo`, `nivel` y `publicable`; el recuento de `INFORME.md` suma el total de fichas.

## Si la sesión se alarga
Con una señal (releer lo ya leído, lentitud, una operación larga por delante, aviso de límite), termina y no encadenes.
Con varias: deja los marcadores, `hechos/notas/<sid>-traspaso-06.md` con el estado exacto, `hechos/fallos/06--<sid>.md`
con `parada por: sesión agotada`, y `ABANDONADA` en tu reclamo.

## Al terminar
1. Verifica la comprobación de arriba; cada fichero de salida lleva su marcador vacío `<nombre>.ok-<sid>`.
2. `hechos/terminadas/06--<sid>.md`: recuento, rutas, hora y **duración real**.
3. `CERRADA` en tu reclamo. Choques, a `hechos/incidencias/<sid>.md`.
4. Regenera `_ESTADO.md` entero desde `hechos/` (con `git fetch` antes) y anota aquí abajo las trampas nuevas.
5. Un commit con rutas explícitas (tus ficheros de `hechos/`, `_ESTADO.md`, esta ficha) y `push`, desde este
   árbol. Si el `push` se rechaza: `git pull --rebase`, regenera el tablón otra vez y repite.
6. A Juan Luis: la foto del momento (EN CURSO · LIBRES · BLOQUEADAS) y, solo para las LIBRES, las frases de arranque
   de `proyecto.md` con su nombre de sesión, la banda traducida y la tarea o cadena ya puestas. Lo mismo si la sueltas.
7. Encadena solo en verde y con una tarea de tu banda (cabecera, «Encadenable con»).

Si paras sin terminar: `hechos/fallos/06--<sid>.md` con `parada por: sesión agotada | avería | mal cortada` y
`ABANDONADA` en tu reclamo. Si la tarea resulta ser varias, no la recortes tú: incidencia con el corte natural,
fallo `mal cortada` y avisa.

## Trampas conocidas
- Un acertijo cuya «solución» es solo una URL a otra web no tiene solución a efectos del catálogo.
- No des por bueno un nivel sin leer el enunciado entero: varios títulos engañan.

## Prohibido
- No escribir fuera de la carpeta de salida de esta tarea (y de los «Ficheros que toca», si los hay).
- No hacer `git add .`, `-A`, `commit -a`, `stash` ni `reset --hard`: el índice es compartido (CLAUDE.md, «Git»).
- `salidas/` está fuera de git a propósito (material ajeno y sin revisar): no forzar su subida.
- No inventar soluciones aquí (es la tarea 07). No retocar enunciados; si uno tiene una errata, va a `notas`.
