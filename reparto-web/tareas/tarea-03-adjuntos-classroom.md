# Tarea 03 · Recuperar los adjuntos de Classroom que la API no ve

Actualizado: 2026-11-23
Precondición: 01 LISTA · Disparo: MANUAL
Duración esperada: 45 min (tiempo de sesión) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `salidas/03-adjuntos-classroom/`
Ficheros que toca: —

Rutas relativas a `reparto-web/` salvo que empiecen por `docs/`, `acertijos/`, `tests/`, `practicas/` o `~`.
La banda se traduce a modelo en la tabla de `proyecto.md`. Este fichero es la fuente de la banda y de la duración.

## Antes de empezar
Sigue «Antes de hacer nada» de `reparto-web/_ESTADO.md`, entero: leer `proyecto.md` y el tablón, listar `hechos/`,
`date -u`, abrir `hechos/reclamos/03--<sid>.md` generando el sid en ese mismo comando, `sleep 30 && ls hechos/reclamos/`,
ceder si otra sesión llegó antes, y **regenerar el tablón entero** si ganas. Caducidad inicial: el doble de la
duración esperada, mínimo 45 minutos. Si hay precondición de firma, se mira en `autorizaciones.md`. Después, sigue con
la tarea hasta cerrarla o soltarla, sin parar a pedir confirmación.

## Objetivo
La API de Drive solo dejó bajar 11 de los 92 adjuntos de las dos clases «PROBLEMAS DE INGENIO». Ocho enunciados
(4a, 10b, 11, 12, 14, 24, 25a, 34) están solo en una imagen que falta. Esta tarea las recupera.

## Qué hay que hacer
1. Lee `salidas/00-classroom/INFORME.md` y saca de `catalogo.json` la lista de adjuntos con `estado` pendiente.
2. Primero, en local: muchas son las imágenes de `0_ACERTIJOS Y CURIOSIDADES/Acertijos/` y de la raíz del banco
   (ya descargadas por la tarea 01). Empareja por título y por contenido (mira la imagen) y copia cada una a
   `adjuntos/<id>-<nombre>`.
3. Lo que no aparezca en local: con Claude in Chrome, abre la clase 2023-24
   (`https://classroom.google.com/c/` + el id 563801372958 en base64 no hace falta: entra por classroom.google.com →
   «PROBLEMAS DE INGENIO» 2023-2024 → Trabajo de clase), abre cada tarea y **pide permiso a Juan Luis antes de
   descargar** (dile nombre y origen); si no está delante, anótalo como pendiente.
4. Para los ocho enunciados que eran solo imagen, transcribe el texto de la imagen a `transcripciones.json`
   (`id` → texto literal), sin resolver nada.
5. `INFORME.md`: recuperados en local, por Chrome, y los que siguen faltando.

Si algún paso te pide decidir algo que va a durar y no está decidido en la ficha, no lo decidas: entrégalo como
propuesta marcada, o para con `BLOQUEADA por decisión`.

## Datos de entrada
- `salidas/00-classroom/` · `salidas/01-dropbox-extraccion/listado.tsv` · el banco en «ex Dropbox» (solo lectura).

## Salida esperada
`salidas/03-adjuntos-classroom/`: `adjuntos/`, `mapa.json` (id de ficha → archivos), `transcripciones.json`, `INFORME.md`.
Ningún fichero cuenta hasta que existe al lado su marcador vacío `<nombre>.ok-<sid>`.

## Cómo saber que ha terminado
Cada uno de los 73 adjuntos pendientes figura en `mapa.json` como recuperado (con su ruta) o como «falta» (con el motivo).

## Si la sesión se alarga
Con una señal (releer lo ya leído, lentitud, una operación larga por delante, aviso de límite), termina y no encadenes.
Con varias: deja los marcadores, `hechos/notas/<sid>-traspaso-03.md` con el estado exacto, `hechos/fallos/03--<sid>.md`
con `parada por: sesión agotada`, y `ABANDONADA` en tu reclamo.

## Al terminar
1. Verifica la comprobación de arriba; cada fichero de salida lleva su marcador vacío `<nombre>.ok-<sid>`.
2. `hechos/terminadas/03--<sid>.md`: recuento, rutas, hora y **duración real**.
3. `CERRADA` en tu reclamo. Choques, a `hechos/incidencias/<sid>.md`.
4. Regenera `_ESTADO.md` entero desde `hechos/` (con `git fetch` antes) y anota aquí abajo las trampas nuevas.
5. Un commit con rutas explícitas (tus ficheros de `hechos/`, `_ESTADO.md`, esta ficha) y `push`, desde este
   árbol. Si el `push` se rechaza: `git pull --rebase`, regenera el tablón otra vez y repite.
6. A Juan Luis: la foto del momento (EN CURSO · LIBRES · BLOQUEADAS) y, solo para las LIBRES, las frases de arranque
   de `proyecto.md` con su nombre de sesión, la banda traducida y la tarea o cadena ya puestas. Lo mismo si la sueltas.
7. Encadena solo en verde y con una tarea de tu banda (cabecera, «Encadenable con»).

Si paras sin terminar: `hechos/fallos/03--<sid>.md` con `parada por: sesión agotada | avería | mal cortada` y
`ABANDONADA` en tu reclamo. Si la tarea resulta ser varias, no la recortes tú: incidencia con el corte natural,
fallo `mal cortada` y avisa.

## Trampas conocidas
- Los adjuntos de 2024-25 se perdieron al copiar las tareas en borrador: búscalos en la clase 2023-24.
- La solución del n.º 5 son tres imágenes «de vuestros compañeros»: **pueden llevar nombres de alumnos**. Si los
  llevan, no se copian: se anota.
- Las imágenes de 4a y 4b son capturas de tuits ajenos: márcalo en `mapa.json` (`autor_ajeno`).

## Prohibido
- No escribir fuera de la carpeta de salida de esta tarea (y de los «Ficheros que toca», si los hay).
- No hacer `git add .`, `-A`, `commit -a`, `stash` ni `reset --hard`: el índice es compartido (CLAUDE.md, «Git»).
- `salidas/` está fuera de git a propósito (material ajeno y sin revisar): no forzar su subida.
- No modificar nada en Classroom ni en Drive. No descargar por Chrome sin el sí de Juan Luis.
