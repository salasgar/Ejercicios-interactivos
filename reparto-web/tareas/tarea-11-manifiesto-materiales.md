# Tarea 11 · Qué material de este curso va en cada página de unidad

Actualizado: 2026-11-23
Precondición: ninguna · Disparo: MANUAL
Duración esperada: 25 min (tiempo de sesión) · Banda de modelo: BAJO · Encadenable con: 05
Carpeta de salida (dueña exclusiva): `salidas/11-manifiesto-materiales/`
Ficheros que toca: —

Rutas relativas a `reparto-web/` salvo que empiecen por `docs/`, `acertijos/`, `tests/`, `practicas/` o `~`.
La banda se traduce a modelo en la tabla de `proyecto.md`. Este fichero es la fuente de la banda y de la duración.

## Antes de empezar
Sigue «Antes de hacer nada» de `reparto-web/_ESTADO.md`, entero: leer `proyecto.md` y el tablón, listar `hechos/`,
`date -u`, abrir `hechos/reclamos/11--<sid>.md` generando el sid en ese mismo comando, `sleep 30 && ls hechos/reclamos/`,
ceder si otra sesión llegó antes, y **regenerar el tablón entero** si ganas. Caducidad inicial: el doble de la
duración esperada, mínimo 45 minutos. Si hay precondición de firma, se mira en `autorizaciones.md`. Después, sigue con
la tarea hasta cerrarla o soltarla, sin parar a pedir confirmación.

## Objetivo
Lista, unidad por unidad, de los PDF de este curso que se colgarán en la web: hojas, resumen bilingüe de
contenidos y vocabulario. Solo localizar y listar; no se sube nada.

## Qué hay que hacer
1. Recorre `~/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/` (carpetas «1. Natural numbers…» a «7. Proportionality», y `comun/`). Lee su `README.md`.
2. Por unidad, localiza: resumen de contenidos (`contenidos-unidad…`), hojas de ejercicios publicadas a los alumnos
   (no las de dislexia ni las personalizadas), vocabulario de pizarra. **Fuera**: exámenes de este curso, resueltos,
   cualquier cosa con nombres, borradores, material del reparto.
3. `manifiesto.json`: `{unidad, tipo, titulo, ruta_pdf, fecha, paginas}`. Si falta el PDF pero está el `.tex`, anótalo
   como «sin compilar» (no compiles).
4. `INFORME.md`: recuento por unidad y las **dudas** (¿esto se publica?) para Juan Luis.

Si algún paso te pide decidir algo que va a durar y no está decidido en la ficha, no lo decidas: entrégalo como
propuesta marcada, o para con `BLOQUEADA por decisión`.

## Datos de entrada
- `~/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/` (solo lectura).

## Salida esperada
`salidas/11-manifiesto-materiales/`: `manifiesto.json`, `INFORME.md`.
Ningún fichero cuenta hasta que existe al lado su marcador vacío `<nombre>.ok-<sid>`.

## Cómo saber que ha terminado
Las siete unidades con carpeta aparecen en el manifiesto, cada PDF listado existe en el disco y ninguno es un examen.

## Si la sesión se alarga
Con una señal (releer lo ya leído, lentitud, una operación larga por delante, aviso de límite), termina y no encadenes.
Con varias: deja los marcadores, `hechos/notas/<sid>-traspaso-11.md` con el estado exacto, `hechos/fallos/11--<sid>.md`
con `parada por: sesión agotada`, y `ABANDONADA` en tu reclamo.

## Al terminar
1. Verifica la comprobación de arriba; cada fichero de salida lleva su marcador vacío `<nombre>.ok-<sid>`.
2. `hechos/terminadas/11--<sid>.md`: recuento, rutas, hora y **duración real**.
3. `CERRADA` en tu reclamo. Choques, a `hechos/incidencias/<sid>.md`.
4. Regenera `_ESTADO.md` entero desde `hechos/` (con `git fetch` antes) y anota aquí abajo las trampas nuevas.
5. Un commit con rutas explícitas (tus ficheros de `hechos/`, `_ESTADO.md`, esta ficha) y `push`, desde este
   árbol. Si el `push` se rechaza: `git pull --rebase`, regenera el tablón otra vez y repite.
6. A Juan Luis: la foto del momento (EN CURSO · LIBRES · BLOQUEADAS) y, solo para las LIBRES, las frases de arranque
   de `proyecto.md` con su nombre de sesión, la banda traducida y la tarea o cadena ya puestas. Lo mismo si la sueltas.
7. Encadena solo en verde y con una tarea de tu banda (cabecera, «Encadenable con»).

Si paras sin terminar: `hechos/fallos/11--<sid>.md` con `parada por: sesión agotada | avería | mal cortada` y
`ABANDONADA` en tu reclamo. Si la tarea resulta ser varias, no la recortes tú: incidencia con el corte natural,
fallo `mal cortada` y avisa.

## Trampas conocidas
- Los nombres de archivo llevan la unidad desde el 9-11; los anteriores no siempre.
- Hay hojas con versión para alumnos concretos: se reconocen por el nombre; quedan fuera.

## Prohibido
- No escribir fuera de la carpeta de salida de esta tarea (y de los «Ficheros que toca», si los hay).
- No hacer `git add .`, `-A`, `commit -a`, `stash` ni `reset --hard`: el índice es compartido (CLAUDE.md, «Git»).
- `salidas/` está fuera de git a propósito (material ajeno y sin revisar): no forzar su subida.
- No modificar nada en la carpeta de apuntes. No subir nada a ningún sitio.
