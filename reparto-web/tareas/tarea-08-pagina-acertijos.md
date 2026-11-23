# Tarea 08 · Página de acertijos con filtros

Actualizado: 2026-11-23
Precondición: ninguna · Disparo: MANUAL
Duración esperada: 60 min (tiempo de sesión) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `salidas/08-pagina-acertijos/`
Ficheros que toca: `acertijos/index.html`, `acertijos/estilos.css`, `acertijos/pagina.js`, `acertijos/logica.js`, `acertijos/catalogo-ejemplo.json`, `tests/acertijos-pagina.test.js`

Rutas relativas a `reparto-web/` salvo que empiecen por `docs/`, `acertijos/`, `tests/`, `practicas/` o `~`.
La banda se traduce a modelo en la tabla de `proyecto.md`. Este fichero es la fuente de la banda y de la duración.

## Antes de empezar
Sigue «Antes de hacer nada» de `reparto-web/_ESTADO.md`, entero: leer `proyecto.md` y el tablón, listar `hechos/`,
`date -u`, abrir `hechos/reclamos/08--<sid>.md` generando el sid en ese mismo comando, `sleep 30 && ls hechos/reclamos/`,
ceder si otra sesión llegó antes, y **regenerar el tablón entero** si ganas. Caducidad inicial: el doble de la
duración esperada, mínimo 45 minutos. Si hay precondición de firma, se mira en `autorizaciones.md`. Después, sigue con
la tarea hasta cerrarla o soltarla, sin parar a pedir confirmación.

## Objetivo
Una página estática, como las prácticas del repositorio, que muestra el catálogo con filtros por tipo, nivel y
unidad, y con la pista y la solución ocultas hasta pulsar. Se incrustará en Google Sites, así que tiene que verse
bien dentro de un marco estrecho y en el móvil.

## Qué hay que hacer
1. Lee `README.md` y una práctica reciente (`practicas/inversa/`) para seguir la misma estructura (`index.html`,
   `estilos.css`, `logica.js` con la lógica pura y probada, y un fichero que pinta).
2. La página carga `catalogo.json` de su misma carpeta (lo pondrá la tarea 09). Para desarrollar, crea
   `acertijos/catalogo-ejemplo.json` con **cinco acertijos inventados por ti** y con el esquema de
   `reparto-web/salidas/00-classroom/catalogo.json` más `unidad`, `pista` y `orden`; si `catalogo.json` no existe,
   la página usa el de ejemplo.
3. Funciones: filtros combinables (tipo, nivel, unidad, idioma), buscador por texto, contador «N acertijos»,
   botón «Uno al azar», tarjeta con título, estrellas, enunciado, imagen si la hay, «Ver pista» y «Ver solución»,
   y enlace directo a cada acertijo (`#id`). Sin dependencias externas ni datos de nadie.
4. Tests de `logica.js` (filtrar, buscar, ordenar) en `tests/acertijos-pagina.test.js`; `npm test` en verde.
5. Pruébala en el navegador a 360 px y a 1200 px de ancho. Deja en `reparto-web/salidas/08-pagina-acertijos/notas.md`
   cómo se usa y qué espera del catálogo.

Si algún paso te pide decidir algo que va a durar y no está decidido en la ficha, no lo decidas: entrégalo como
propuesta marcada, o para con `BLOQUEADA por decisión`.

## Datos de entrada
- `reparto-web/salidas/00-classroom/catalogo.json` (solo para ver el esquema; **no se copia a `acertijos/`**).

## Salida esperada
Los seis «Ficheros que toca» (en el repo, comiteados) y `salidas/08-pagina-acertijos/notas.md`.
Ningún fichero cuenta hasta que existe al lado su marcador vacío `<nombre>.ok-<sid>`.

## Cómo saber que ha terminado
`npm test` en verde, la página abre con el catálogo de ejemplo y los filtros reducen la lista como dice el test.

## Si la sesión se alarga
Con una señal (releer lo ya leído, lentitud, una operación larga por delante, aviso de límite), termina y no encadenes.
Con varias: deja los marcadores, `hechos/notas/<sid>-traspaso-08.md` con el estado exacto, `hechos/fallos/08--<sid>.md`
con `parada por: sesión agotada`, y `ABANDONADA` en tu reclamo.

## Al terminar
1. Verifica la comprobación de arriba; cada fichero de salida lleva su marcador vacío `<nombre>.ok-<sid>`.
2. `hechos/terminadas/08--<sid>.md`: recuento, rutas, hora y **duración real** y el hash del commit del código (pruebas en verde → `git commit -m "…" -- <ficheros que toca>` antes de este paso).
3. `CERRADA` en tu reclamo. Choques, a `hechos/incidencias/<sid>.md`.
4. Regenera `_ESTADO.md` entero desde `hechos/` (con `git fetch` antes) y anota aquí abajo las trampas nuevas.
5. Un commit con rutas explícitas (tus ficheros de `hechos/`, `_ESTADO.md`, esta ficha) y `push`, desde este
   árbol. Si el `push` se rechaza: `git pull --rebase`, regenera el tablón otra vez y repite.
6. A Juan Luis: la foto del momento (EN CURSO · LIBRES · BLOQUEADAS) y, solo para las LIBRES, las frases de arranque
   de `proyecto.md` con su nombre de sesión, la banda traducida y la tarea o cadena ya puestas. Lo mismo si la sueltas.
7. Encadena solo en verde y con una tarea de tu banda (cabecera, «Encadenable con»).

Si paras sin terminar: `hechos/fallos/08--<sid>.md` con `parada por: sesión agotada | avería | mal cortada` y
`ABANDONADA` en tu reclamo. Si la tarea resulta ser varias, no la recortes tú: incidencia con el corte natural,
fallo `mal cortada` y avisa.

## Trampas conocidas
- El catálogo real todavía lleva material ajeno y sin revisar: por eso el ejemplo es inventado.
- `.gitignore` ignora `*.pdf`: los adjuntos del catálogo serán imágenes.

## Prohibido
- No escribir fuera de la carpeta de salida de esta tarea (y de los «Ficheros que toca», si los hay).
- No hacer `git add .`, `-A`, `commit -a`, `stash` ni `reset --hard`: el índice es compartido (CLAUDE.md, «Git»).
- `salidas/` está fuera de git a propósito (material ajeno y sin revisar): no forzar su subida.
- No copiar a `acertijos/` nada de `reparto-web/salidas/`: lo hace la tarea 09, con firma.
- No editar `src/` ni otras prácticas.
