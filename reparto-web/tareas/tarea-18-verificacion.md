# Tarea 18 · Verificación final del borrador del sitio

Actualizado: 2026-11-23
Precondición: 13, 14 y 15 LISTAS · Disparo: MANUAL
Duración esperada: 35 min (tiempo de sesión) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `salidas/18-verificacion/`
Ficheros que toca: —

Rutas relativas a `reparto-web/` salvo que empiecen por `docs/`, `acertijos/`, `tests/`, `practicas/` o `~`.
La banda se traduce a modelo en la tabla de `proyecto.md`. Este fichero es la fuente de la banda y de la duración.

## Antes de empezar
Sigue «Antes de hacer nada» de `reparto-web/_ESTADO.md`, entero: leer `proyecto.md` y el tablón, listar `hechos/`,
`date -u`, abrir `hechos/reclamos/18--<sid>.md` generando el sid en ese mismo comando, `sleep 30 && ls hechos/reclamos/`,
ceder si otra sesión llegó antes, y **regenerar el tablón entero** si ganas. Caducidad inicial: el doble de la
duración esperada, mínimo 45 minutos. Si hay precondición de firma, se mira en `autorizaciones.md`. Después, sigue con
la tarea hasta cerrarla o soltarla, sin parar a pedir confirmación.

## Objetivo
Repaso independiente del borrador antes de que Juan Luis publique.

## Qué hay que hacer
1. Abre la vista previa del editor (`https://sites.google.com/d/12iuNEJIpi2yCnzs38jwzEYyOIIfeAeKD/p/1X7IQez5srxFCksCRN8f72W1G8wiJ9qq5/edit`, icono de dispositivos) **sin editar nada** y recorre todas las páginas.
2. Criterios: (a) ninguna página contiene nombres de alumnos, correos personales ni contraseñas; (b) ningún enlace
   de la lista de rotos del inventario; (c) las ocho páginas de unidad siguen `plantilla.md`; (d) los PDF de Drive y
   la página de acertijos cargan en una ventana sin sesión; (e) nada de lo marcado RETIRAR en el inventario sigue ahí;
   (f) se ve bien a ancho de móvil.
3. `veredicto.md`: SE PUEDE PUBLICAR / NO, criterio a criterio. `hallazgos.md`: todo lo que veas fuera de esos
   criterios. Los hallazgos se le dicen a Juan Luis en el mensaje de cierre, como decisiones pendientes.

Si algún paso te pide decidir algo que va a durar y no está decidido en la ficha, no lo decidas: entrégalo como
propuesta marcada, o para con `BLOQUEADA por decisión`.

## Datos de entrada
- `docs/web-google-sites-inventario.md` · `salidas/10-plantilla-y-piloto/plantilla.md` · los `cambios.md` de 10, 13, 14 y 15.

## Salida esperada
`salidas/18-verificacion/`: `veredicto.md`, `hallazgos.md`.
Ningún fichero cuenta hasta que existe al lado su marcador vacío `<nombre>.ok-<sid>`.

## Cómo saber que ha terminado
Los seis criterios tienen veredicto y todas las páginas del árbol aparecen como revisadas.

## Si la sesión se alarga
Con una señal (releer lo ya leído, lentitud, una operación larga por delante, aviso de límite), termina y no encadenes.
Con varias: deja los marcadores, `hechos/notas/<sid>-traspaso-18.md` con el estado exacto, `hechos/fallos/18--<sid>.md`
con `parada por: sesión agotada`, y `ABANDONADA` en tu reclamo.

## Al terminar
1. Verifica la comprobación de arriba; cada fichero de salida lleva su marcador vacío `<nombre>.ok-<sid>`.
2. `hechos/terminadas/18--<sid>.md`: recuento, rutas, hora y **duración real**.
3. `CERRADA` en tu reclamo. Choques, a `hechos/incidencias/<sid>.md`.
4. Regenera `_ESTADO.md` entero desde `hechos/` (con `git fetch` antes) y anota aquí abajo las trampas nuevas.
5. Un commit con rutas explícitas (tus ficheros de `hechos/`, `_ESTADO.md`, esta ficha) y `push`, desde este
   árbol. Si el `push` se rechaza: `git pull --rebase`, regenera el tablón otra vez y repite.
6. A Juan Luis: la foto del momento (EN CURSO · LIBRES · BLOQUEADAS) y, solo para las LIBRES, las frases de arranque
   de `proyecto.md` con su nombre de sesión, la banda traducida y la tarea o cadena ya puestas. Lo mismo si la sueltas.
7. Encadena solo en verde y con una tarea de tu banda (cabecera, «Encadenable con»).

Si paras sin terminar: `hechos/fallos/18--<sid>.md` con `parada por: sesión agotada | avería | mal cortada` y
`ABANDONADA` en tu reclamo. Si la tarea resulta ser varias, no la recortes tú: incidencia con el corte natural,
fallo `mal cortada` y avisa.

## Trampas conocidas
- **Leer el sitio**: un `fetch` de una página publicada solo devuelve el título. Hay que navegar a cada
  página con Chrome y leer el texto de los elementos `section` (o `get_page_text`).
- `javascript_tool` trunca la salida hacia los 1000 caracteres: para sacar mucho texto, vuélcalo en el DOM
  de tu propia pestaña y léelo con `get_page_text`.
- En el desplegable de «Publicar», **«Dejar de publicar» está justo debajo de «Ver sitio web publicado»**.
- Al terminar, cierra tus pestañas con `tabs_close_mcp` (regla global de Juan Luis).
- (26-11, s-20261126T160602-d1641e6a) **El sitio publicado sí se lee con `curl` sin cookies**: el HTML trae el
  texto y los enlaces de cada página (el «solo devuelve el título» es de WebFetch). Las rutas salen de los `href`
  `/a/murciaeduca.es/1eso/…` de la portada. Sirve para comprobar «sin sesión» y para analizar en local.
- La vista previa del borrador está en `https://sites.google.com/u/0/d/<sitio>/p/<página>/preview`; con un `fetch`
  solo llega el esqueleto (el contenido lo pinta JS): hay que cargarla en un `<iframe>` de la misma pestaña y leer
  sus `section`. Veintinueve páginas tardan ~2 min: lanzarlo sin `await` y sondear, o salta el límite de 45 s del
  `javascript_tool`. Un `<iframe>` de 375 px sirve también para comprobar el ancho de móvil (`resize_window` no
  encoge la ventana si está maximizada).
- `DOMParser` en Sites exige TrustedHTML (`trustedTypes.createPolicy`). Las salidas del `javascript_tool` con `?`
  en una URL se bloquean («Cookie/query string data»): comparar con hashes o quitar la consulta.
- Al cerrar con `tabs_close_mcp` una pestaña mientras otra llamada está en marcha, el grupo puede desaparecer y la
  pestaña restante quedar fuera del grupo, sin poder cerrarla: cerrar las pestañas cuando no haya nada corriendo.
- YouTube: `oembed` con la URL `/embed/…?embed_config=…` da 404 aunque el vídeo exista; usar `watch?v=<id>`. Un 401
  o 403 de `oembed` no es «roto»: mirar `playabilityStatus` en la página del vídeo.

## Prohibido
- **No editar el sitio ni publicar.** Si algo está mal, se anota; lo arregla una reabierta de la tarea dueña.
- No escribir fuera de la carpeta de salida de esta tarea (y de los «Ficheros que toca», si los hay).
- No hacer `git add .`, `-A`, `commit -a`, `stash` ni `reset --hard`: el índice es compartido (CLAUDE.md, «Git»).
- `salidas/` está fuera de git a propósito (material ajeno y sin revisar): no forzar su subida.
