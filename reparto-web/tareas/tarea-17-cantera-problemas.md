# Tarea 17 · Banco de problemas de la web antigua (proporcionalidad y ecuaciones)

Actualizado: 2026-11-23
Precondición: ninguna · Disparo: MANUAL
Duración esperada: 35 min (tiempo de sesión) · Banda de modelo: MEDIO · Encadenable con: 04
Carpeta de salida (dueña exclusiva): `salidas/17-cantera-problemas/`
Ficheros que toca: —

Rutas relativas a `reparto-web/` salvo que empiecen por `docs/`, `acertijos/`, `tests/`, `practicas/` o `~`.
La banda se traduce a modelo en la tabla de `proyecto.md`. Este fichero es la fuente de la banda y de la duración.

## Antes de empezar
Sigue «Antes de hacer nada» de `reparto-web/_ESTADO.md`, entero: leer `proyecto.md` y el tablón, listar `hechos/`,
`date -u`, abrir `hechos/reclamos/17--<sid>.md` generando el sid en ese mismo comando, `sleep 30 && ls hechos/reclamos/`,
ceder si otra sesión llegó antes, y **regenerar el tablón entero** si ganas. Caducidad inicial: el doble de la
duración esperada, mínimo 45 minutos. Si hay precondición de firma, se mira en `autorizaciones.md`. Después, sigue con
la tarea hasta cerrarla o soltarla, sin parar a pedir confirmación.

## Objetivo
La web antigua tiene listas de problemas propios de proporcionalidad (cuatro partes) y de ecuaciones. Pasarlas a
un banco ordenado sirve ya para la Unidad 7, que es la que se está dando, y para la 6.

## Qué hay que hacer
1. Con Chrome, lee del sitio publicado (`https://sites.google.com/a/murciaeduca.es/1eso/ejercicios-y-apuntes/…`; las rutas antiguas siguen valiendo
   mientras no se publique el borrador: `tema-6-proporcionalidad/parte-1-proporcionalidad-directa`,
   `…/parte-2-porcentajes`, `…/parte-3-repaso-de-lo-anterior`, `…/parte-4-proporcionalidad-inversa`,
   `tema-7-álgebra/álgebra-ejercicios-de-ecuaciones-con-soluciones`).
2. `proporcionalidad.md` y `ecuaciones.md`: cada problema tal cual, numerado como en la web, con: tipo (directa,
   inversa, porcentaje, reparto; o tipo de ecuación), **resultado calculado y comprobado**, y una marca de
   **realismo** (✓, o qué número o situación no es creíble, según la regla del `CLAUDE.md` del repo).
3. Marca los repetidos entre las partes 1, 3 y 4. Lista aparte los vídeos propios que explican problemas.
4. `INFORME.md`: cuántos por tipo, cuántos con pega de realismo, y cuáles encajan con las prácticas
   `practicas/directa-o-inversa/` e `inversa/` como contextos nuevos.

Si algún paso te pide decidir algo que va a durar y no está decidido en la ficha, no lo decidas: entrégalo como
propuesta marcada, o para con `BLOQUEADA por decisión`.

## Datos de entrada
- El sitio publicado · `CLAUDE.md` del repo («Repaso de realismo») · `docs/web-google-sites-inventario.md`.

## Salida esperada
`salidas/17-cantera-problemas/`: `proporcionalidad.md`, `ecuaciones.md`, `INFORME.md`.
Ningún fichero cuenta hasta que existe al lado su marcador vacío `<nombre>.ok-<sid>`.

## Cómo saber que ha terminado
Todos los problemas numerados de las cinco páginas están en los dos ficheros, cada uno con resultado y marca de realismo.

## Si la sesión se alarga
Con una señal (releer lo ya leído, lentitud, una operación larga por delante, aviso de límite), termina y no encadenes.
Con varias: deja los marcadores, `hechos/notas/<sid>-traspaso-17.md` con el estado exacto, `hechos/fallos/17--<sid>.md`
con `parada por: sesión agotada`, y `ABANDONADA` en tu reclamo.

## Al terminar
1. Verifica la comprobación de arriba; cada fichero de salida lleva su marcador vacío `<nombre>.ok-<sid>`.
2. `hechos/terminadas/17--<sid>.md`: recuento, rutas, hora y **duración real**.
3. `CERRADA` en tu reclamo. Choques, a `hechos/incidencias/<sid>.md`.
4. Regenera `_ESTADO.md` entero desde `hechos/` (con `git fetch` antes) y anota aquí abajo las trampas nuevas.
5. Un commit con rutas explícitas (tus ficheros de `hechos/`, `_ESTADO.md`, esta ficha) y `push`, desde este
   árbol. Si el `push` se rechaza: `git pull --rebase`, regenera el tablón otra vez y repite.
6. A Juan Luis: la foto del momento (EN CURSO · LIBRES · BLOQUEADAS) y, solo para las LIBRES, las frases de arranque
   de `proyecto.md` con su nombre de sesión, la banda traducida y la tarea o cadena ya puestas. Lo mismo si la sueltas.
7. Encadena solo en verde y con una tarea de tu banda (cabecera, «Encadenable con»).

Si paras sin terminar: `hechos/fallos/17--<sid>.md` con `parada por: sesión agotada | avería | mal cortada` y
`ABANDONADA` en tu reclamo. Si la tarea resulta ser varias, no la recortes tú: incidencia con el corte natural,
fallo `mal cortada` y avisa.

## Trampas conocidas
- **Leer el sitio**: un `fetch` de una página publicada solo devuelve el título. Hay que navegar a cada
  página con Chrome y leer el texto de los elementos `section` (o `get_page_text`).
- `javascript_tool` trunca la salida hacia los 1000 caracteres: para sacar mucho texto, vuélcalo en el DOM
  de tu propia pestaña y léelo con `get_page_text`.
- En el desplegable de «Publicar», **«Dejar de publicar» está justo debajo de «Ver sitio web publicado»**.
- Al terminar, cierra tus pestañas con `tabs_close_mcp` (regla global de Juan Luis).
- Parte de los ejercicios resueltos está en imágenes: se listan, no se transcriben.

## Prohibido
- No escribir fuera de la carpeta de salida de esta tarea (y de los «Ficheros que toca», si los hay).
- No hacer `git add .`, `-A`, `commit -a`, `stash` ni `reset --hard`: el índice es compartido (CLAUDE.md, «Git»).
- `salidas/` está fuera de git a propósito (material ajeno y sin revisar): no forzar su subida.
- No corregir los enunciados: las pegas se anotan. No tocar `practicas/` ni `src/`.

## Trampas nuevas (2026-11-23)
- `get_page_text` de una página de Sites solo da el título; sirvió volcar `section.innerText` en un `<pre>` del propio DOM y leerlo con `get_page_text`.
- Las soluciones de la web no son fiables: R20a e I12 están mal (ver `INFORME.md`). Recalcular siempre.
- Los enlaces de Sites salen envueltos en `google.com/url?q=…`; `javascript_tool` bloquea hrefs con query string, pero con `decodeURIComponent` sobre el `q=` se pueden sacar.
