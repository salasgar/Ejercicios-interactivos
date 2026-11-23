# Tarea 14 · Arreglar enlaces rotos y ordenar las páginas de enlaces

Actualizado: 2026-11-23
Precondición: 10 LISTA · Disparo: MANUAL
Duración esperada: 40 min (tiempo de sesión) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `salidas/14-enlaces-y-transversales/`
Ficheros que toca: — (edita el borrador de Google Sites: recurso `editor-sites`)

Rutas relativas a `reparto-web/` salvo que empiecen por `docs/`, `acertijos/`, `tests/`, `practicas/` o `~`.
La banda se traduce a modelo en la tabla de `proyecto.md`. Este fichero es la fuente de la banda y de la duración.

## Antes de empezar
Sigue «Antes de hacer nada» de `reparto-web/_ESTADO.md`, entero: leer `proyecto.md` y el tablón, listar `hechos/`,
`date -u`, abrir `hechos/reclamos/14--<sid>.md` generando el sid en ese mismo comando, `sleep 30 && ls hechos/reclamos/`,
ceder si otra sesión llegó antes, y **regenerar el tablón entero** si ganas. Caducidad inicial: el doble de la
duración esperada, mínimo 45 minutos. Si hay precondición de firma, se mira en `autorizaciones.md`. Después, sigue con
la tarea hasta cerrarla o soltarla, sin parar a pedir confirmación.

## Objetivo
Aplicar el apartado 3 del inventario (enlaces rotos) y ordenar «Enlaces interesantes», «Vídeos», «Técnicas de
estudio», «Apuntes para descargar», «Ejercicios interactivos» y «Otros cursos», fuera de las páginas de unidad.

## Qué hay que hacer
1. «ocupo editor-sites» en `hechos/recursos/<sid>.md`. Editor: `https://sites.google.com/d/12iuNEJIpi2yCnzs38jwzEYyOIIfeAeKD/p/1X7IQez5srxFCksCRN8f72W1G8wiJ9qq5/edit`.
2. Quita o sustituye los enlaces rotos del inventario; los de Vitutor que ya no llevan al ejercicio, fuera.
   Comprueba a mano los «dudosos» (liveworksheets, vadenumeros, htwins, cienciadesofa).
3. «Enlaces interesantes»: fuera las noticias de 2015-16 y «Reciclaje». «Ejercicios interactivos»: encabezar con
   la app del curso. «Otros cursos»: comprobar cada sitio y quitar los que no existan.
4. `cambios.md` con cada cambio (página, antes → después) y «libero editor-sites».

Si algún paso te pide decidir algo que va a durar y no está decidido en la ficha, no lo decidas: entrégalo como
propuesta marcada, o para con `BLOQUEADA por decisión`.

## Datos de entrada
- `docs/web-google-sites-inventario.md`, apartados 2 y 3.

## Salida esperada
`salidas/14-enlaces-y-transversales/cambios.md`.
Ningún fichero cuenta hasta que existe al lado su marcador vacío `<nombre>.ok-<sid>`.

## Cómo saber que ha terminado
Ningún enlace de la lista «Rotos o perdidos» del inventario sigue en el borrador fuera de las páginas de unidad.

## Si la sesión se alarga
Con una señal (releer lo ya leído, lentitud, una operación larga por delante, aviso de límite), termina y no encadenes.
Con varias: deja los marcadores, `hechos/notas/<sid>-traspaso-14.md` con el estado exacto, `hechos/fallos/14--<sid>.md`
con `parada por: sesión agotada`, y `ABANDONADA` en tu reclamo.

## Al terminar
1. Verifica la comprobación de arriba; cada fichero de salida lleva su marcador vacío `<nombre>.ok-<sid>`.
2. `hechos/terminadas/14--<sid>.md`: recuento, rutas, hora y **duración real**.
3. `CERRADA` en tu reclamo. Choques, a `hechos/incidencias/<sid>.md`.
4. Regenera `_ESTADO.md` entero desde `hechos/` (con `git fetch` antes) y anota aquí abajo las trampas nuevas.
5. Un commit con rutas explícitas (tus ficheros de `hechos/`, `_ESTADO.md`, esta ficha) y `push`, desde este
   árbol. Si el `push` se rechaza: `git pull --rebase`, regenera el tablón otra vez y repite.
6. A Juan Luis: la foto del momento (EN CURSO · LIBRES · BLOQUEADAS) y, solo para las LIBRES, las frases de arranque
   de `proyecto.md` con su nombre de sesión, la banda traducida y la tarea o cadena ya puestas. Lo mismo si la sueltas.
7. Encadena solo en verde y con una tarea de tu banda (cabecera, «Encadenable con»).

Si paras sin terminar: `hechos/fallos/14--<sid>.md` con `parada por: sesión agotada | avería | mal cortada` y
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

## Prohibido
- **No pulsar «Publicar»** ni «Dejar de publicar»: publica Juan Luis, cuando revise el borrador.
- No editar el sitio sin tener anotado «ocupo editor-sites» en `hechos/recursos/<sid>.md` y sin haber
  comprobado que ninguna otra sesión lo ocupa: dos sesiones en el mismo editor se pisan.
- No poner en la web nombres de alumnos, notas ni correos personales. No borrar páginas que la ficha no nombre.
- No tocar las páginas de unidad (son de las tareas 10 y 13).
- No escribir fuera de la carpeta de salida de esta tarea (y de los «Ficheros que toca», si los hay).
- No hacer `git add .`, `-A`, `commit -a`, `stash` ni `reset --hard`: el índice es compartido (CLAUDE.md, «Git»).
- `salidas/` está fuera de git a propósito (material ajeno y sin revisar): no forzar su subida.
