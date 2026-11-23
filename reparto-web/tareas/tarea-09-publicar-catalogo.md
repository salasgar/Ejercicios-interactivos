# Tarea 09 · Poner el catálogo revisado en la página

Actualizado: 2026-11-23
Precondición: 06, 07 y 08 LISTAS, y firma en `autorizaciones.md` · Disparo: MANUAL
Duración esperada: 25 min (tiempo de sesión) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `salidas/09-publicar-catalogo/`
Ficheros que toca: `acertijos/catalogo.json`, `acertijos/adjuntos/`

Rutas relativas a `reparto-web/` salvo que empiecen por `docs/`, `acertijos/`, `tests/`, `practicas/` o `~`.
La banda se traduce a modelo en la tabla de `proyecto.md`. Este fichero es la fuente de la banda y de la duración.

## Antes de empezar
Sigue «Antes de hacer nada» de `reparto-web/_ESTADO.md`, entero: leer `proyecto.md` y el tablón, listar `hechos/`,
`date -u`, abrir `hechos/reclamos/09--<sid>.md` generando el sid en ese mismo comando, `sleep 30 && ls hechos/reclamos/`,
ceder si otra sesión llegó antes, y **regenerar el tablón entero** si ganas. Caducidad inicial: el doble de la
duración esperada, mínimo 45 minutos. Si hay precondición de firma, se mira en `autorizaciones.md`. Después, sigue con
la tarea hasta cerrarla o soltarla, sin parar a pedir confirmación.

## Objetivo
Unir catálogo y soluciones, dejar solo lo publicable y copiarlo a `acertijos/` en el repositorio, que es público.
Es el único paso que saca acertijos a internet, y por eso va con firma.

## Qué hay que hacer
1. Comprueba la firma en `reparto-web/autorizaciones.md` («Subir el catálogo de acertijos al repositorio público»).
   Sin firma: latido `BLOQUEADA por firma`, díselo a Juan Luis y para.
2. Une `salidas/06-catalogo/catalogo.json` con `salidas/07-soluciones/soluciones.json`. Solo fichas `publicable: si`;
   las `enlazar` entran como tarjeta con título, autor y enlace, sin el enunciado.
3. Copia el resultado a `acertijos/catalogo.json` y las imágenes a `acertijos/adjuntos/` (nombres sin espacios).
4. Pasa `npm test` (incluye `tests/sin-nombres-de-alumnos.test.js`) y busca a mano nombres y apellidos en el JSON.
5. Abre la página en local y recorre diez tarjetas al azar: imagen, pista y solución cargan.
6. Commit con rutas explícitas y `push`. Anota en la terminada la URL pública
   (`https://<usuario>.github.io/Ejercicios-interactivos/acertijos/`; mira el dominio real en `README.md`).

Si algún paso te pide decidir algo que va a durar y no está decidido en la ficha, no lo decidas: entrégalo como
propuesta marcada, o para con `BLOQUEADA por decisión`.

## Datos de entrada
- `salidas/06-catalogo/`, `salidas/07-soluciones/`, `salidas/08-pagina-acertijos/notas.md`.

## Salida esperada
`acertijos/catalogo.json` y `acertijos/adjuntos/` en el repo, y `salidas/09-publicar-catalogo/INFORME.md` con recuentos (publicados, enlazados, excluidos y por qué).
Ningún fichero cuenta hasta que existe al lado su marcador vacío `<nombre>.ok-<sid>`.

## Cómo saber que ha terminado
La página pública carga y el contador coincide con el recuento del informe.

## Si la sesión se alarga
Con una señal (releer lo ya leído, lentitud, una operación larga por delante, aviso de límite), termina y no encadenes.
Con varias: deja los marcadores, `hechos/notas/<sid>-traspaso-09.md` con el estado exacto, `hechos/fallos/09--<sid>.md`
con `parada por: sesión agotada`, y `ABANDONADA` en tu reclamo.

## Al terminar
1. Verifica la comprobación de arriba; cada fichero de salida lleva su marcador vacío `<nombre>.ok-<sid>`.
2. `hechos/terminadas/09--<sid>.md`: recuento, rutas, hora y **duración real** y el hash del commit del código (pruebas en verde → `git commit -m "…" -- <ficheros que toca>` antes de este paso).
3. `CERRADA` en tu reclamo. Choques, a `hechos/incidencias/<sid>.md`.
4. Regenera `_ESTADO.md` entero desde `hechos/` (con `git fetch` antes) y anota aquí abajo las trampas nuevas.
5. Un commit con rutas explícitas (tus ficheros de `hechos/`, `_ESTADO.md`, esta ficha) y `push`, desde este
   árbol. Si el `push` se rechaza: `git pull --rebase`, regenera el tablón otra vez y repite.
6. A Juan Luis: la foto del momento (EN CURSO · LIBRES · BLOQUEADAS) y, solo para las LIBRES, las frases de arranque
   de `proyecto.md` con su nombre de sesión, la banda traducida y la tarea o cadena ya puestas. Lo mismo si la sueltas.
7. Encadena solo en verde y con una tarea de tu banda (cabecera, «Encadenable con»).

Si paras sin terminar: `hechos/fallos/09--<sid>.md` con `parada por: sesión agotada | avería | mal cortada` y
`ABANDONADA` en tu reclamo. Si la tarea resulta ser varias, no la recortes tú: incidencia con el corte natural,
fallo `mal cortada` y avisa.

## Trampas conocidas
- GitHub Pages tarda uno o dos minutos en servir lo nuevo.

## Prohibido
- No escribir fuera de la carpeta de salida de esta tarea (y de los «Ficheros que toca», si los hay).
- No hacer `git add .`, `-A`, `commit -a`, `stash` ni `reset --hard`: el índice es compartido (CLAUDE.md, «Git»).
- `salidas/` está fuera de git a propósito (material ajeno y sin revisar): no forzar su subida.
- Nada con `publicable: no`. Nada sin firma. Ningún PDF ajeno.
