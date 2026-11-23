# Tarea 10 · Portada, plantilla de página de unidad y piloto (Unidad 2)

Actualizado: 2026-11-23
Precondición: ninguna · Disparo: MANUAL
Duración esperada: 60 min (tiempo de sesión) · Banda de modelo: ALTO · Encadenable con: 16
Carpeta de salida (dueña exclusiva): `salidas/10-plantilla-y-piloto/`
Ficheros que toca: — (edita el borrador de Google Sites: recurso `editor-sites`)

Rutas relativas a `reparto-web/` salvo que empiecen por `docs/`, `acertijos/`, `tests/`, `practicas/` o `~`.
La banda se traduce a modelo en la tabla de `proyecto.md`. Este fichero es la fuente de la banda y de la duración.

## Antes de empezar
Sigue «Antes de hacer nada» de `reparto-web/_ESTADO.md`, entero: leer `proyecto.md` y el tablón, listar `hechos/`,
`date -u`, abrir `hechos/reclamos/10--<sid>.md` generando el sid en ese mismo comando, `sleep 30 && ls hechos/reclamos/`,
ceder si otra sesión llegó antes, y **regenerar el tablón entero** si ganas. Caducidad inicial: el doble de la
duración esperada, mínimo 45 minutos. Si hay precondición de firma, se mira en `autorizaciones.md`. Después, sigue con
la tarea hasta cerrarla o soltarla, sin parar a pedir confirmación.

## Objetivo
Dejar en el borrador del sitio una portada limpia y una página de unidad modelo, para que Juan Luis la vea y diga
si las demás se hacen igual. La plantilla es una **propuesta**: la aprueba él.

## Qué hay que hacer
1. Anota «ocupo editor-sites» en `hechos/recursos/<sid>.md` (mira antes que nadie lo ocupe). Editor: `https://sites.google.com/d/12iuNEJIpi2yCnzs38jwzEYyOIIfeAeKD/p/1X7IQez5srxFCksCRN8f72W1G8wiJ9qq5/edit`.
2. **Portada**: deja el saludo y el vídeo; quita el temario por bloques de la ley anterior, los criterios 80/20, los
   avisos caducados y el enlace roto de Dropbox (lista en `docs/web-google-sites-inventario.md`). Pon un índice de las
   ocho unidades y enlaces a «Acertijos» y «Para estudiar». Guarda antes el texto antiguo en `portada-antigua.md`.
3. **Plantilla**, escrita en `plantilla.md`: apartados y orden de una página de unidad — «Qué vamos a aprender»
   (resumen bilingüe), «Vocabulary», «Hojas de ejercicios», «Practica en la app», «Vídeos», «Para saber más»
   (lo antiguo que valga) y «Acertijos de esta unidad».
4. **Piloto en «Unidad 2. Divisibilidad»**: reordena lo que ya hay según la plantilla, sin borrar los apuntes de
   criterios ni los juegos de Scratch; cambia el título de cabecera si aún dice «Tema 2»; quita los enlaces rotos
   (imatex); enlaza las prácticas de divisibilidad de la app (URL pública en `README.md`). Los PDF de hojas todavía
   no están en Drive (tarea 12): deja el apartado con «próximamente».
5. Capturas de la portada y del piloto (vista previa, ordenador y móvil) en la carpeta de salida, «libero editor-sites»
   en tu fichero de recursos, y **díselo a Juan Luis como decisión pendiente**: ¿vale la plantilla?

Si algún paso te pide decidir algo que va a durar y no está decidido en la ficha, no lo decidas: entrégalo como
propuesta marcada, o para con `BLOQUEADA por decisión`.

## Datos de entrada
- `docs/web-google-sites-inventario.md` · sitio publicado `https://sites.google.com/a/murciaeduca.es/1eso/` (aún con el contenido antiguo) · `README.md`.
- Estado del borrador a 23-11-2026: ya están borradas `z_Backup`, `WWW.MATEMATICO.ES` y «Actividades extraescolares»;
  los temas ya se llaman «Unidad N. …» y existe «Unidad 8. Geometría» vacía. La Unidad 6 está detrás de la 7.

## Salida esperada
`salidas/10-plantilla-y-piloto/`: `plantilla.md`, `portada-antigua.md`, capturas, `cambios.md` (qué se tocó en el sitio).
Ningún fichero cuenta hasta que existe al lado su marcador vacío `<nombre>.ok-<sid>`.

## Cómo saber que ha terminado
La portada del borrador no contiene ninguno de los elementos caducados del inventario y la página de la Unidad 2 tiene los siete apartados de `plantilla.md`.

## Si la sesión se alarga
Con una señal (releer lo ya leído, lentitud, una operación larga por delante, aviso de límite), termina y no encadenes.
Con varias: deja los marcadores, `hechos/notas/<sid>-traspaso-10.md` con el estado exacto, `hechos/fallos/10--<sid>.md`
con `parada por: sesión agotada`, y `ABANDONADA` en tu reclamo.

## Al terminar
1. Verifica la comprobación de arriba; cada fichero de salida lleva su marcador vacío `<nombre>.ok-<sid>`.
2. `hechos/terminadas/10--<sid>.md`: recuento, rutas, hora y **duración real**.
3. `CERRADA` en tu reclamo. Choques, a `hechos/incidencias/<sid>.md`.
4. Regenera `_ESTADO.md` entero desde `hechos/` (con `git fetch` antes) y anota aquí abajo las trampas nuevas.
5. Un commit con rutas explícitas (tus ficheros de `hechos/`, `_ESTADO.md`, esta ficha) y `push`, desde este
   árbol. Si el `push` se rechaza: `git pull --rebase`, regenera el tablón otra vez y repite.
6. A Juan Luis: la foto del momento (EN CURSO · LIBRES · BLOQUEADAS) y, solo para las LIBRES, las frases de arranque
   de `proyecto.md` con su nombre de sesión, la banda traducida y la tarea o cadena ya puestas. Lo mismo si la sueltas.
7. Encadena solo en verde y con una tarea de tu banda (cabecera, «Encadenable con»).

Si paras sin terminar: `hechos/fallos/10--<sid>.md` con `parada por: sesión agotada | avería | mal cortada` y
`ABANDONADA` en tu reclamo. Si la tarea resulta ser varias, no la recortes tú: incidencia con el corte natural,
fallo `mal cortada` y avisa.

## Trampas conocidas
- **Leer el sitio**: un `fetch` de una página publicada solo devuelve el título. Hay que navegar a cada
  página con Chrome y leer el texto de los elementos `section` (o `get_page_text`).
- `javascript_tool` trunca la salida hacia los 1000 caracteres: para sacar mucho texto, vuélcalo en el DOM
  de tu propia pestaña y léelo con `get_page_text`.
- En el desplegable de «Publicar», **«Dejar de publicar» está justo debajo de «Ver sitio web publicado»**.
- Al terminar, cierra tus pestañas con `tabs_close_mcp` (regla global de Juan Luis).
- **Editar**: panel derecho → «Páginas». Renombrar: doble clic en el nombre, `cmd+a`, escribir, Intro (si no
  querías renombrar, Escape). Borrar: pasar el ratón por la fila, ⋮ → «Eliminar». Subpágina: ⋮ → «Añadir una
  subpágina». **Arrastrar para reordenar no funciona** con el ratón sintético: si hace falta reordenar, se
  anota para Juan Luis.
- Borrar una página con subpáginas no se deshace con «Deshacer»: solo con el historial de versiones.
- El editor guarda solo en el borrador («Se han guardado todos los cambios en Drive»). Nada sale a la web
  pública hasta que alguien pulsa «Publicar».
- (2026-11-23, s-20261123T180825-ade12f2f) **Reescribir un cuadro de texto entero**: clic dentro, `cmd+a` (selecciona
  solo ese cuadro; compruébalo con `getSelection().toString()`), y pegar HTML con un evento sintético:
  `new ClipboardEvent('paste',{clipboardData: dt})` con `dt.setData('text/html', …)`, despachado en
  `document.activeElement`. Funciona y respeta listas, encabezados y enlaces externos. Hay que poner
  `font-family: Lato` en cada bloque (si no, sale en Arial) y `font-weight: normal` en los `h2` (si no, el
  «Encabezado» sale en negrita). Deja una viñeta vacía al final: un par de `BackSpace`.
- «Borrar formato» está en el `⋯` de la barra del texto (icono de la T tachada); `cmd+\` no lo admite el ratón sintético.
- **Enlaces internos**: seleccionar el texto, `cmd+k`, escribir el nombre de la página y pulsar la sugerencia de
  «ESTE SITIO WEB», luego «Aplicar». Si el cuadro de diálogo dice en «Texto» algo distinto de lo seleccionado, no
  había selección: `Escape` y repetir (tras `Escape` hay que volver a hacer clic para entrar en el texto). En el DOM
  del editor los enlaces son `span[role=link]` sin `href`: el destino solo se ve en la burbuja al hacer clic.
- **Arrastrar secciones (asa ⋮⋮ a la izquierda) no es fiable**: hacia arriba, la sección acabó al final de la página;
  hacia abajo, hasta el borde inferior de la ventana, sí la dejó al final. «Cuadro de texto» (Insertar) mete la
  sección nueva **antes de la última**, no al final.
- La vista previa va en un marco que el script no puede leer: los enlaces se comprueban en el editor.
- Pulsar sobre una fila del panel «Páginas» con un solo clic abre la página sin entrar en modo renombrar.

## Prohibido
- **No pulsar «Publicar»** ni «Dejar de publicar»: publica Juan Luis, cuando revise el borrador.
- No editar el sitio sin tener anotado «ocupo editor-sites» en `hechos/recursos/<sid>.md` y sin haber
  comprobado que ninguna otra sesión lo ocupa: dos sesiones en el mismo editor se pisan.
- No poner en la web nombres de alumnos, notas ni correos personales. No borrar páginas que la ficha no nombre.
- No escribir fuera de la carpeta de salida de esta tarea (y de los «Ficheros que toca», si los hay).
- No hacer `git add .`, `-A`, `commit -a`, `stash` ni `reset --hard`: el índice es compartido (CLAUDE.md, «Git»).
- `salidas/` está fuera de git a propósito (material ajeno y sin revisar): no forzar su subida.
