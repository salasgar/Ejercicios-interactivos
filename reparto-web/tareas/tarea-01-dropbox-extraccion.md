# Tarea 01 · Descargar y pasar a texto «0_ACERTIJOS Y CURIOSIDADES»

Actualizado: 2026-11-23
Precondición: ninguna · Disparo: MANUAL
Duración esperada: 30 min (tiempo de sesión) · Banda de modelo: BAJO · Encadenable con: 05
Carpeta de salida (dueña exclusiva): `salidas/01-dropbox-extraccion/`
Ficheros que toca: —

Rutas relativas a `reparto-web/` salvo que empiecen por `docs/`, `acertijos/`, `tests/`, `practicas/` o `~`.
La banda se traduce a modelo en la tabla de `proyecto.md`. Este fichero es la fuente de la banda y de la duración.

## Antes de empezar
Sigue «Antes de hacer nada» de `reparto-web/_ESTADO.md`, entero: leer `proyecto.md` y el tablón, listar `hechos/`,
`date -u`, abrir `hechos/reclamos/01--<sid>.md` generando el sid en ese mismo comando, `sleep 30 && ls hechos/reclamos/`,
ceder si otra sesión llegó antes, y **regenerar el tablón entero** si ganas. Caducidad inicial: el doble de la
duración esperada, mínimo 45 minutos. Si hay precondición de firma, se mira en `autorizaciones.md`. Después, sigue con
la tarea hasta cerrarla o soltarla, sin parar a pedir confirmación.

## Objetivo
De los 537 archivos del banco de acertijos de Juan Luis, 512 están solo en iCloud. Esta tarea los baja al disco
y deja una copia en texto de cada documento, para que las tareas 02 y 03 puedan leerlos sin abrir Word ni PDF.

## Qué hay que hacer
1. Lista la carpeta `~/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/0_ACERTIJOS Y CURIOSIDADES/` (recursivo) y guarda el listado en `listado.tsv` (ruta relativa, extensión, bytes, fecha).
2. Descarga lo que esté solo en la nube: `brctl download "<ruta>"` por archivo (o por carpeta). Estira `caduca:`
   antes; comprueba con `ls -lO` o reintentando la lectura que ya no son marcadores `.icloud`.
   **No descargues** vídeos (`.mp4`, `.mov`) ni `.zip`: anótalos como «no descargado».
3. Convierte a texto en `texto/<ruta relativa>.txt`: `.docx`/`.doc`/`.rtf` con `textutil -convert txt -output <dest> <orig>`;
   `.pdf` con `pdftotext -layout <orig> <dest>`; `.txt`/`.tex` se copian. Las imágenes no se convierten: solo se listan.
4. Escribe `resumen.md`: cuántos archivos por carpeta y formato, cuántos convertidos, cuántos PDF han salido vacíos
   (escaneados), cuántos no descargados.

Si algún paso te pide decidir algo que va a durar y no está decidido en la ficha, no lo decidas: entrégalo como
propuesta marcada, o para con `BLOQUEADA por decisión`.

## Datos de entrada
- `~/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/0_ACERTIJOS Y CURIOSIDADES/`: el banco (solo lectura; no se mueve ni se renombra nada ahí).
- Inventario previo por carpetas: `~/.claude/projects/-Users-salasgar-Documents-git-Ejercicios-interactivos/memory/inventario-materiales-mat/06-acertijos-recursos-varios.md`.

## Salida esperada
`salidas/01-dropbox-extraccion/`: `listado.tsv`, `texto/…` (un `.txt` por documento), `resumen.md`.
Ningún fichero cuenta hasta que existe al lado su marcador vacío `<nombre>.ok-<sid>`.

## Cómo saber que ha terminado
`listado.tsv` tiene una fila por archivo del banco (unos 537) y `resumen.md` cuadra: convertidos + imágenes + no descargados + fallidos = total.

## Si la sesión se alarga
Con una señal (releer lo ya leído, lentitud, una operación larga por delante, aviso de límite), termina y no encadenes.
Con varias: deja los marcadores, `hechos/notas/<sid>-traspaso-01.md` con el estado exacto, `hechos/fallos/01--<sid>.md`
con `parada por: sesión agotada`, y `ABANDONADA` en tu reclamo.

## Al terminar
1. Verifica la comprobación de arriba; cada fichero de salida lleva su marcador vacío `<nombre>.ok-<sid>`.
2. `hechos/terminadas/01--<sid>.md`: recuento, rutas, hora y **duración real**.
3. `CERRADA` en tu reclamo. Choques, a `hechos/incidencias/<sid>.md`.
4. Regenera `_ESTADO.md` entero desde `hechos/` (con `git fetch` antes) y anota aquí abajo las trampas nuevas.
5. Un commit con rutas explícitas (tus ficheros de `hechos/`, `_ESTADO.md`, esta ficha) y `push`, desde este
   árbol. Si el `push` se rechaza: `git pull --rebase`, regenera el tablón otra vez y repite.
6. A Juan Luis: la foto del momento (EN CURSO · LIBRES · BLOQUEADAS) y, solo para las LIBRES, las frases de arranque
   de `proyecto.md` con su nombre de sesión, la banda traducida y la tarea o cadena ya puestas. Lo mismo si la sueltas.
7. Encadena solo en verde y con una tarea de tu banda (cabecera, «Encadenable con»).

Si paras sin terminar: `hechos/fallos/01--<sid>.md` con `parada por: sesión agotada | avería | mal cortada` y
`ABANDONADA` en tu reclamo. Si la tarea resulta ser varias, no la recortes tú: incidencia con el corte natural,
fallo `mal cortada` y avisa.

## Trampas conocidas
- `brctl download` vuelve enseguida: la descarga sigue por detrás. Comprueba antes de convertir.
- macOS no trae `shuf`, `soffice` ni GNU `sed -i` sin sufijo. `textutil` y `pdftotext` sí están (comprobado el 23-11-2026).
- Un `.xps` y varios `.xlsx` no se convierten: se listan.

## Prohibido
- No escribir fuera de la carpeta de salida de esta tarea (y de los «Ficheros que toca», si los hay).
- No hacer `git add .`, `-A`, `commit -a`, `stash` ni `reset --hard`: el índice es compartido (CLAUDE.md, «Git»).
- `salidas/` está fuera de git a propósito (material ajeno y sin revisar): no forzar su subida.
- No tocar nada dentro de «ex Dropbox»: solo leer y descargar.
