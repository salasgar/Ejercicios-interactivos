# Tarea 12 · Carpeta de Drive «Web 1º ESO» con los PDF

Actualizado: 2026-11-23
Precondición: 11 LISTA, y firma en `autorizaciones.md` · Disparo: MANUAL
Duración esperada: 25 min (tiempo de sesión) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `salidas/12-drive-web/`
Ficheros que toca: —

Rutas relativas a `reparto-web/` salvo que empiecen por `docs/`, `acertijos/`, `tests/`, `practicas/` o `~`.
La banda se traduce a modelo en la tabla de `proyecto.md`. Este fichero es la fuente de la banda y de la duración.

## Antes de empezar
Sigue «Antes de hacer nada» de `reparto-web/_ESTADO.md`, entero: leer `proyecto.md` y el tablón, listar `hechos/`,
`date -u`, abrir `hechos/reclamos/12--<sid>.md` generando el sid en ese mismo comando, `sleep 30 && ls hechos/reclamos/`,
ceder si otra sesión llegó antes, y **regenerar el tablón entero** si ganas. Caducidad inicial: el doble de la
duración esperada, mínimo 45 minutos. Si hay precondición de firma, se mira en `autorizaciones.md`. Después, sigue con
la tarea hasta cerrarla o soltarla, sin parar a pedir confirmación.

## Objetivo
Subir los PDF del manifiesto a una carpeta de Drive con enlace público de solo lectura, que es de donde los
incrustará la web. Es publicar: va con firma.

## Qué hay que hacer
1. Comprueba la firma («Crear la carpeta de Drive pública “Web 1º ESO”…»). Sin firma: `BLOQUEADA por firma` y para.
2. Repasa con Juan Luis las dudas de `salidas/11-manifiesto-materiales/INFORME.md`; lo dudoso no se sube.
3. Crea «Web 1º ESO» con una subcarpeta por unidad (herramientas de Google Drive del conector, o Chrome); sube
   cada PDF; comparte **la carpeta** como «cualquiera con el enlace: lector».
4. `enlaces.json`: por archivo, `{unidad, tipo, titulo, drive_id, url}`. Comprueba tres al azar en una ventana sin sesión.

Si algún paso te pide decidir algo que va a durar y no está decidido en la ficha, no lo decidas: entrégalo como
propuesta marcada, o para con `BLOQUEADA por decisión`.

## Datos de entrada
- `salidas/11-manifiesto-materiales/manifiesto.json`.

## Salida esperada
`salidas/12-drive-web/`: `enlaces.json`, `INFORME.md`.
Ningún fichero cuenta hasta que existe al lado su marcador vacío `<nombre>.ok-<sid>`.

## Cómo saber que ha terminado
Todo PDF aprobado del manifiesto tiene su `drive_id` y la carpeta abre sin iniciar sesión.

## Si la sesión se alarga
Con una señal (releer lo ya leído, lentitud, una operación larga por delante, aviso de límite), termina y no encadenes.
Con varias: deja los marcadores, `hechos/notas/<sid>-traspaso-12.md` con el estado exacto, `hechos/fallos/12--<sid>.md`
con `parada por: sesión agotada`, y `ABANDONADA` en tu reclamo.

## Al terminar
1. Verifica la comprobación de arriba; cada fichero de salida lleva su marcador vacío `<nombre>.ok-<sid>`.
2. `hechos/terminadas/12--<sid>.md`: recuento, rutas, hora y **duración real**.
3. `CERRADA` en tu reclamo. Choques, a `hechos/incidencias/<sid>.md`.
4. Regenera `_ESTADO.md` entero desde `hechos/` (con `git fetch` antes) y anota aquí abajo las trampas nuevas.
5. Un commit con rutas explícitas (tus ficheros de `hechos/`, `_ESTADO.md`, esta ficha) y `push`, desde este
   árbol. Si el `push` se rechaza: `git pull --rebase`, regenera el tablón otra vez y repite.
6. A Juan Luis: la foto del momento (EN CURSO · LIBRES · BLOQUEADAS) y, solo para las LIBRES, las frases de arranque
   de `proyecto.md` con su nombre de sesión, la banda traducida y la tarea o cadena ya puestas. Lo mismo si la sueltas.
7. Encadena solo en verde y con una tarea de tu banda (cabecera, «Encadenable con»).

Si paras sin terminar: `hechos/fallos/12--<sid>.md` con `parada por: sesión agotada | avería | mal cortada` y
`ABANDONADA` en tu reclamo. Si la tarea resulta ser varias, no la recortes tú: incidencia con el corte natural,
fallo `mal cortada` y avisa.

## Trampas conocidas
- La API de Drive admite dos archivos con el mismo nombre: busca antes de subir (idempotencia).
- La cuenta es la del centro (murciaeduca): puede limitar compartir fuera del dominio. Si no deja, para y dilo.

## Prohibido
- No escribir fuera de la carpeta de salida de esta tarea (y de los «Ficheros que toca», si los hay).
- No hacer `git add .`, `-A`, `commit -a`, `stash` ni `reset --hard`: el índice es compartido (CLAUDE.md, «Git»).
- `salidas/` está fuera de git a propósito (material ajeno y sin revisar): no forzar su subida.
- No compartir nada que no esté en el manifiesto aprobado. No tocar otras carpetas de Drive.
