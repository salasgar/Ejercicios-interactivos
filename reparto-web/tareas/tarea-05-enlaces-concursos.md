# Tarea 05 · Enlaces a Canguro, Agudeza y olimpiadas

Actualizado: 2026-11-23
Precondición: ninguna · Disparo: MANUAL
Duración esperada: 20 min (tiempo de sesión) · Banda de modelo: BAJO · Encadenable con: 01
Carpeta de salida (dueña exclusiva): `salidas/05-enlaces-concursos/`
Ficheros que toca: —

Rutas relativas a `reparto-web/` salvo que empiecen por `docs/`, `acertijos/`, `tests/`, `practicas/` o `~`.
La banda se traduce a modelo en la tabla de `proyecto.md`. Este fichero es la fuente de la banda y de la duración.

## Antes de empezar
Sigue «Antes de hacer nada» de `reparto-web/_ESTADO.md`, entero: leer `proyecto.md` y el tablón, listar `hechos/`,
`date -u`, abrir `hechos/reclamos/05--<sid>.md` generando el sid en ese mismo comando, `sleep 30 && ls hechos/reclamos/`,
ceder si otra sesión llegó antes, y **regenerar el tablón entero** si ganas. Caducidad inicial: el doble de la
duración esperada, mínimo 45 minutos. Si hay precondición de firma, se mira en `autorizaciones.md`. Después, sigue con
la tarea hasta cerrarla o soltarla, sin parar a pedir confirmación.

## Objetivo
El material de concursos no se copia: se enlaza. Esta tarea reúne los enlaces a las pruebas de años anteriores
que sirven para 1.º y 2.º de ESO.

## Qué hay que hacer
1. Canguro Matemático (`https://www.canguromat.es`): por cada año disponible, enlace a la prueba y a las soluciones
   del nivel de 1.º ESO y del de 2.º ESO (el nombre del nivel cambia según el año: compruébalo en cada uno).
2. Olimpiada de la SEMRM (`https://www.semrm.com`): pruebas de 2.º ESO de años anteriores.
3. Otros concursos que aparecen en `salidas/00-classroom/INFORME.md` (Agudeza, microrrelatos): solo la página oficial.
4. Comprueba cada enlace con `curl -s -o /dev/null -L -m 12 -w "%{http_code}" "<url>"` y guarda el código.
5. `enlaces.json`: lista de `{concurso, año, nivel, que (prueba|soluciones), url, http}`. `INFORME.md` con recuentos.

Si algún paso te pide decidir algo que va a durar y no está decidido en la ficha, no lo decidas: entrégalo como
propuesta marcada, o para con `BLOQUEADA por decisión`.

## Datos de entrada
- `salidas/00-classroom/INFORME.md`.

## Salida esperada
`salidas/05-enlaces-concursos/`: `enlaces.json`, `INFORME.md`.
Ningún fichero cuenta hasta que existe al lado su marcador vacío `<nombre>.ok-<sid>`.

## Cómo saber que ha terminado
Todos los enlaces de `enlaces.json` tienen su código HTTP y los que no dan 200 están listados aparte en `INFORME.md`.

## Si la sesión se alarga
Con una señal (releer lo ya leído, lentitud, una operación larga por delante, aviso de límite), termina y no encadenes.
Con varias: deja los marcadores, `hechos/notas/<sid>-traspaso-05.md` con el estado exacto, `hechos/fallos/05--<sid>.md`
con `parada por: sesión agotada`, y `ABANDONADA` en tu reclamo.

## Al terminar
1. Verifica la comprobación de arriba; cada fichero de salida lleva su marcador vacío `<nombre>.ok-<sid>`.
2. `hechos/terminadas/05--<sid>.md`: recuento, rutas, hora y **duración real**.
3. `CERRADA` en tu reclamo. Choques, a `hechos/incidencias/<sid>.md`.
4. Regenera `_ESTADO.md` entero desde `hechos/` (con `git fetch` antes) y anota aquí abajo las trampas nuevas.
5. Un commit con rutas explícitas (tus ficheros de `hechos/`, `_ESTADO.md`, esta ficha) y `push`, desde este
   árbol. Si el `push` se rechaza: `git pull --rebase`, regenera el tablón otra vez y repite.
6. A Juan Luis: la foto del momento (EN CURSO · LIBRES · BLOQUEADAS) y, solo para las LIBRES, las frases de arranque
   de `proyecto.md` con su nombre de sesión, la banda traducida y la tarea o cadena ya puestas. Lo mismo si la sueltas.
7. Encadena solo en verde y con una tarea de tu banda (cabecera, «Encadenable con»).

Si paras sin terminar: `hechos/fallos/05--<sid>.md` con `parada por: sesión agotada | avería | mal cortada` y
`ABANDONADA` en tu reclamo. Si la tarea resulta ser varias, no la recortes tú: incidencia con el corte natural,
fallo `mal cortada` y avisa.

## Trampas conocidas
- Algunas webs rechazan `curl` (403/406) y están vivas: márcalas «dudoso», no «roto».

## Prohibido
- No escribir fuera de la carpeta de salida de esta tarea (y de los «Ficheros que toca», si los hay).
- No hacer `git add .`, `-A`, `commit -a`, `stash` ni `reset --hard`: el índice es compartido (CLAUDE.md, «Git»).
- `salidas/` está fuera de git a propósito (material ajeno y sin revisar): no forzar su subida.
- No descargar ni copiar los enunciados de los concursos: solo enlaces.
