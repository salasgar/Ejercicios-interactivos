# Tarea 13 · Aplicar la plantilla a las demás páginas de unidad

Actualizado: 2026-11-24
Precondición: 10 LISTA con la plantilla aprobada por Juan Luis (**aprobada el 24-11-2026**, ver abajo). La 12 ya no es precondición · Disparo: MANUAL
Duración esperada: 90 min (tiempo de sesión) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `salidas/13-paginas-unidades/`
Ficheros que toca: — (edita el borrador de Google Sites: recurso `editor-sites`)

Rutas relativas a `reparto-web/` salvo que empiecen por `docs/`, `acertijos/`, `tests/`, `practicas/` o `~`.
La banda se traduce a modelo en la tabla de `proyecto.md`. Este fichero es la fuente de la banda y de la duración.

## Antes de empezar
Sigue «Antes de hacer nada» de `reparto-web/_ESTADO.md`, entero: leer `proyecto.md` y el tablón, listar `hechos/`,
`date -u`, abrir `hechos/reclamos/13--<sid>.md` generando el sid en ese mismo comando, `sleep 30 && ls hechos/reclamos/`,
ceder si otra sesión llegó antes, y **regenerar el tablón entero** si ganas. Caducidad inicial: el doble de la
duración esperada, mínimo 45 minutos. Si hay precondición de firma, se mira en `autorizaciones.md`. Después, sigue con
la tarea hasta cerrarla o soltarla, sin parar a pedir confirmación.

## Objetivo
Dejar las unidades 1, 3, 4, 5, 6, 7 y 8 como el piloto de la Unidad 2, cada una con su material de este curso.

## Qué hay que hacer
1. **La plantilla está aprobada**: Juan Luis dijo el 24-11-2026 «Me vale la plantilla de la Unidad 2, sigue con la 13»
   (nota de la montadora en `hechos/notas/s-20261123T132317-16556b5f.md`). Se aplica tal cual está en `plantilla.md`
   y en el piloto: mismo orden, «Qué vamos a aprender» en español con títulos bilingües, vocabulario inglés — español
   y cada práctica de la app enlazada.
   **Sin la tarea 12** (la carpeta de Drive espera su firma): en «Hojas de ejercicios · Worksheets» se pone la frase
   «Próximamente: las hojas de cada semana de la unidad, con sus soluciones.», como en el piloto. Si al empezar
   existe `salidas/12-drive-web/enlaces.json`, se usan sus enlaces.
2. «ocupo editor-sites» en `hechos/recursos/<sid>.md`. Editor: `https://sites.google.com/d/12iuNEJIpi2yCnzs38jwzEYyOIIfeAeKD/p/1X7IQez5srxFCksCRN8f72W1G8wiJ9qq5/edit`.
3. Una página cada vez, en orden U3 (la unidad en curso: enteros, hasta el 11-12-2026), U1, U4, U5, U6, U7, U8.
   **No se quita nada** de lo que haya en la página salvo enlaces rotos comprobados (regla de `proyecto.md`): lo
   antiguo se reordena o se baja a «Para saber más». Para cada una: título de cabecera
   «Unidad N. …», apartados de `plantilla.md`, PDF de `salidas/12-drive-web/enlaces.json` incrustados desde Drive,
   prácticas de la app de esa unidad, y lo antiguo que el inventario marca CONSERVAR o CANTERA en «Para saber más».
   Las subpáginas de proporcionalidad (cuatro partes) y de álgebra se conservan como están, enlazadas.
4. Tras cada página, una línea en `cambios.md` y el marcador `U<N>.ok-<sid>`: la tarea se reanuda por ahí.
5. «libero editor-sites» al terminar o al soltar.

Si algún paso te pide decidir algo que va a durar y no está decidido en la ficha, no lo decidas: entrégalo como
propuesta marcada, o para con `BLOQUEADA por decisión`.

## Datos de entrada
- `salidas/10-plantilla-y-piloto/plantilla.md` · `salidas/12-drive-web/enlaces.json` · `docs/web-google-sites-inventario.md` · `README.md` (URL de las prácticas).

## Salida esperada
`salidas/13-paginas-unidades/`: `cambios.md` y un marcador `U<N>.ok-<sid>` por página.
Ningún fichero cuenta hasta que existe al lado su marcador vacío `<nombre>.ok-<sid>`.

## Cómo saber que ha terminado
Siete marcadores (U1, U3, U4, U5, U6, U7, U8) y, en la vista previa, cada página con los apartados de la plantilla.

## Si la sesión se alarga
Con una señal (releer lo ya leído, lentitud, una operación larga por delante, aviso de límite), termina y no encadenes.
Con varias: deja los marcadores, `hechos/notas/<sid>-traspaso-13.md` con el estado exacto, `hechos/fallos/13--<sid>.md`
con `parada por: sesión agotada`, y `ABANDONADA` en tu reclamo.

## Al terminar
1. Verifica la comprobación de arriba; cada fichero de salida lleva su marcador vacío `<nombre>.ok-<sid>`.
2. `hechos/terminadas/13--<sid>.md`: recuento, rutas, hora y **duración real**.
3. `CERRADA` en tu reclamo. Choques, a `hechos/incidencias/<sid>.md`.
4. Regenera `_ESTADO.md` entero desde `hechos/` (con `git fetch` antes) y anota aquí abajo las trampas nuevas.
5. Un commit con rutas explícitas (tus ficheros de `hechos/`, `_ESTADO.md`, esta ficha) y `push`, desde este
   árbol. Si el `push` se rechaza: `git pull --rebase`, regenera el tablón otra vez y repite.
6. A Juan Luis: la foto del momento (EN CURSO · LIBRES · BLOQUEADAS) y, solo para las LIBRES, las frases de arranque
   de `proyecto.md` con su nombre de sesión, la banda traducida y la tarea o cadena ya puestas. Lo mismo si la sueltas.
7. Encadena solo en verde y con una tarea de tu banda (cabecera, «Encadenable con»).

Si paras sin terminar: `hechos/fallos/13--<sid>.md` con `parada por: sesión agotada | avería | mal cortada` y
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
- Es **larga**: siete páginas. Si no caben, suelta con `parada por: sesión agotada`; la siguiente sigue por los marcadores.

## Prohibido
- **No pulsar «Publicar»** ni «Dejar de publicar»: publica Juan Luis, cuando revise el borrador.
- No editar el sitio sin tener anotado «ocupo editor-sites» en `hechos/recursos/<sid>.md` y sin haber
  comprobado que ninguna otra sesión lo ocupa: dos sesiones en el mismo editor se pisan.
- No poner en la web nombres de alumnos, notas ni correos personales. No borrar páginas que la ficha no nombre.
- No borrar las listas de problemas ni los vídeos propios de las páginas antiguas.
- No escribir fuera de la carpeta de salida de esta tarea (y de los «Ficheros que toca», si los hay).
- No hacer `git add .`, `-A`, `commit -a`, `stash` ni `reset --hard`: el índice es compartido (CLAUDE.md, «Git»).
- `salidas/` está fuera de git a propósito (material ajeno y sin revisar): no forzar su subida.
