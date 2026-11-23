# Tarea 04 · Acertijos del sitio `pradomayor4eso` y carpetas de Drive de la web

Actualizado: 2026-11-23
Precondición: ninguna · Disparo: MANUAL
Duración esperada: 40 min (tiempo de sesión) · Banda de modelo: MEDIO · Encadenable con: 17
Carpeta de salida (dueña exclusiva): `salidas/04-sitio-antiguo-y-drive/`
Ficheros que toca: —

Rutas relativas a `reparto-web/` salvo que empiecen por `docs/`, `acertijos/`, `tests/`, `practicas/` o `~`.
La banda se traduce a modelo en la tabla de `proyecto.md`. Este fichero es la fuente de la banda y de la duración.

## Antes de empezar
Sigue «Antes de hacer nada» de `reparto-web/_ESTADO.md`, entero: leer `proyecto.md` y el tablón, listar `hechos/`,
`date -u`, abrir `hechos/reclamos/04--<sid>.md` generando el sid en ese mismo comando, `sleep 30 && ls hechos/reclamos/`,
ceder si otra sesión llegó antes, y **regenerar el tablón entero** si ganas. Caducidad inicial: el doble de la
duración esperada, mínimo 45 minutos. Si hay precondición de firma, se mira en `autorizaciones.md`. Después, sigue con
la tarea hasta cerrarla o soltarla, sin parar a pedir confirmación.

## Objetivo
La página de acertijos de la web remite a un sitio antiguo de Juan Luis («del n.º 5 en adelante») que pide sesión,
y la web incrusta siete carpetas de Drive que nadie ha abierto. Esta tarea lee las dos cosas.

## Qué hay que hacer
1. Con Claude in Chrome (sesión de Juan Luis), abre `http://sites.google.com/site/pradomayor4eso/acertijos-y-problemas-de-ingenio`
   y sus subpáginas. Una ficha por acertijo en `fichas.json`, con prefijo `P-`. Esquema de ficha (el de `salidas/00-classroom/catalogo.json`; léelo antes): `id`, `titulo`, `enunciado` (texto
tal cual, sin retocar), `adjuntos`, `solucion`, `adjuntos_solucion`, `tipo` (L lógica · N números · G geometría ·
P pesadas y medidas · J juegos y puzles · S series · T pensamiento lateral · C contar), `nivel` (1, 2 o 3
estrellas), `idioma`, `fuente`, `notas`. Añade `clasificacion: "propuesta"` a lo que clasifiques tú, y
`autor_ajeno` cuando el material no sea de Juan Luis (libro, web, captura de redes, concurso).
2. Abre las carpetas de Drive incrustadas y lista su contenido en `carpetas-drive.md` (nombre, tipo, fecha, de qué
   unidad es, y si parece llevar nombres de alumnos). Ids: Acertijos `1cGda3rDNdQYO6S15daZiVU15sMHRYecB` · Archivos
   `1ePqqrP6Cy9GIchQfmZnqfhq-SNRFwGXo` · Enteros `1KB5rl14sCaBEfqE86B2sMNTMScj4Z5kn` · Proporcionalidad
   `1eb4hyeAihlsE3A9lOgImnv_a2pyKrsQr`, `1h6wngylhRvApbTSXLOLeZBGsndrytiMy`, `1DEAhizYCcFBsevto_6ye-BZXAk71a7Cw`,
   `1i5Iij79nve5hE5pdF6JZXsDEJdtIPGyH` · Ecuaciones `19uQKsl_3z95PsHxMiOjR_g5YDzzKcSJO` · Estadística
   `19Fyenfvj36Aop0wSz7HaeDS1CkEJY_h_` (URL: `https://drive.google.com/drive/folders/<id>`).
3. Si en la carpeta de acertijos hay documentos con acertijos, fíchalos también.
4. `INFORME.md` con recuentos y con lo que no se haya podido abrir.

Si algún paso te pide decidir algo que va a durar y no está decidido en la ficha, no lo decidas: entrégalo como
propuesta marcada, o para con `BLOQUEADA por decisión`.

## Datos de entrada
- `docs/web-google-sites-inventario.md` · `salidas/00-classroom/catalogo.json` (para marcar `duplicado_de`).

## Salida esperada
`salidas/04-sitio-antiguo-y-drive/`: `fichas.json`, `carpetas-drive.md`, `INFORME.md`.
Ningún fichero cuenta hasta que existe al lado su marcador vacío `<nombre>.ok-<sid>`.

## Cómo saber que ha terminado
Las nueve carpetas de Drive aparecen en `carpetas-drive.md` (listadas o «no accesible») y todas las subpáginas de acertijos del sitio antiguo están en `INFORME.md`.

## Si la sesión se alarga
Con una señal (releer lo ya leído, lentitud, una operación larga por delante, aviso de límite), termina y no encadenes.
Con varias: deja los marcadores, `hechos/notas/<sid>-traspaso-04.md` con el estado exacto, `hechos/fallos/04--<sid>.md`
con `parada por: sesión agotada`, y `ABANDONADA` en tu reclamo.

## Al terminar
1. Verifica la comprobación de arriba; cada fichero de salida lleva su marcador vacío `<nombre>.ok-<sid>`.
2. `hechos/terminadas/04--<sid>.md`: recuento, rutas, hora y **duración real**.
3. `CERRADA` en tu reclamo. Choques, a `hechos/incidencias/<sid>.md`.
4. Regenera `_ESTADO.md` entero desde `hechos/` (con `git fetch` antes) y anota aquí abajo las trampas nuevas.
5. Un commit con rutas explícitas (tus ficheros de `hechos/`, `_ESTADO.md`, esta ficha) y `push`, desde este
   árbol. Si el `push` se rechaza: `git pull --rebase`, regenera el tablón otra vez y repite.
6. A Juan Luis: la foto del momento (EN CURSO · LIBRES · BLOQUEADAS) y, solo para las LIBRES, las frases de arranque
   de `proyecto.md` con su nombre de sesión, la banda traducida y la tarea o cadena ya puestas. Lo mismo si la sueltas.
7. Encadena solo en verde y con una tarea de tu banda (cabecera, «Encadenable con»).

Si paras sin terminar: `hechos/fallos/04--<sid>.md` con `parada por: sesión agotada | avería | mal cortada` y
`ABANDONADA` en tu reclamo. Si la tarea resulta ser varias, no la recortes tú: incidencia con el corte natural,
fallo `mal cortada` y avisa.

## Trampas conocidas
- **Leer el sitio**: un `fetch` de una página publicada solo devuelve el título. Hay que navegar a cada
  página con Chrome y leer el texto de los elementos `section` (o `get_page_text`).
- `javascript_tool` trunca la salida hacia los 1000 caracteres: para sacar mucho texto, vuélcalo en el DOM
  de tu propia pestaña y léelo con `get_page_text`.
- En el desplegable de «Publicar», **«Dejar de publicar» está justo debajo de «Ver sitio web publicado»**.
- Al terminar, cierra tus pestañas con `tabs_close_mcp` (regla global de Juan Luis).
- El sitio antiguo puede ser de Google Sites clásico migrado: si no carga, prueba `https://sites.google.com/site/pradomayor4eso/` y navega desde el menú.

## Prohibido
- No escribir fuera de la carpeta de salida de esta tarea (y de los «Ficheros que toca», si los hay).
- No hacer `git add .`, `-A`, `commit -a`, `stash` ni `reset --hard`: el índice es compartido (CLAUDE.md, «Git»).
- `salidas/` está fuera de git a propósito (material ajeno y sin revisar): no forzar su subida.
- Solo lectura: no editar el sitio antiguo, ni mover o borrar nada en Drive. No descargar archivos.

## Trampas nuevas (2026-11-23)
- `sites.google.com/site/pradomayor4eso/...` da 404 también con la sesión de Juan Luis: el sitio antiguo ya no existe o es de otra cuenta.
- De las 9 carpetas de Drive, 6 dan 404 (Enteros, las cuatro de Proporcionalidad, Estadística): ids borrados o mal copiados.
- `javascript_tool` bloquea la salida de hrefs con query string; para sacar los ids reales hay que usar `read_page` (filter interactive).
