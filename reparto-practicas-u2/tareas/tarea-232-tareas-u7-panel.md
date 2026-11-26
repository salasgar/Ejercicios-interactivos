# Tarea 232 · Montar en el panel de la app las seis tareas semanales de la unidad 7, con Juan Luis delante (Claude en Chrome)

> **CORRECCIÓN DE LA COORDINADORA (s-20261126T162834-4b1cc936, 26-11-2026; manda sobre lo que diga esta ficha más abajo).** El acta de la 02 de la U7 (`apuntes-1eso-bilingue/7. Proportionality/inventario-unidad7-revision.md`, punto u) decidió **una sola hoja 3** (`hoja-unidad7-semana3.*`, sin «parte», hecha por la tarea 08 de la U7; su 09 está SUSTITUIDA) y **cinco tareas semanales de la app, una por paquete** (no seis): lun 1-3 → jue 4-3, lun 8-3 → jue 11-3, **lun 15-3 8:00 → jue 8-4 23:59** (paquete 3, abierta en vacaciones), lun 12-4 → jue 15-4 y lun 19-4 → jue 22-4. **No hay tarea del lun 5-4.** Se montan **cinco** tareas con esas fechas.

Actualizado: 2026-11-19 (adaptada a la unidad 7; alta de la montadora del reparto de la unidad 7, s-20261118T221619-b66ec280, a partir de la ficha 160 de la unidad 6, con sus trampas)
Precondición: **227 LISTA** para la primera tarea (y 228, 229, 230 y 231 para las siguientes: las propuestas de tarea dependen de qué prácticas quedan publicadas; se puede montar por paquetes y volver) · **Juan Luis delante**, con Chrome abierto, la extensión de Claude conectada y su sesión de Google iniciada en el panel · Disparo: MANUAL (sesión atendida) · **Plazo: mié 24-2 para la primera tarea (la tarea 40 del reparto de la U7 programa Classroom con estas tareas; la primera sale el lun 1-3 a las 8:00); después, por paquetes: jue 4-3 (la del 8-3), jue 11-3 (las dos del paquete 3: 15-3 y 5-4), jue 8-4 (la del 12-4) y jue 15-4 (la del 19-4)**
Duración esperada: 1 h (tiempo de sesión, no de persona; para las seis: en la U6 fueron de 6 a 12 min por tarea, con la extensión en marcha, en tres vueltas) · Banda de modelo: ALTO · Encadenable con: la publicación que acabe de cerrar (227-231), en la misma sesión, si Juan Luis está delante
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/232-tareas-u7-panel/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): **ninguno del repositorio**. Las tareas se crean en la nube (`config/tareas` del espacio de Juan Luis) desde el editor de tareas del panel, con su cuenta; esta tarea no edita código ni `practicas/_comun/tareas.js`

La duración esperada no es informativa: de ella sale la caducidad del reclamo (2 ×, mínimo
45 min), el plazo tras el cual otra sesión puede relevarte si te cortas. **Este fichero es
la fuente de la banda**: el tablón la copia de aquí cada vez que se regenera. La banda
dice con qué modelo conviene abrir la sesión; la tabla de bandas de `proyecto.md` la
traduce al menú de hoy (ALTO = Opus 5.5, esfuerzo Alto; MEDIO = Sonnet 5.5, esfuerzo Medio).

## Antes de empezar

Todas las rutas son relativas a la raíz del repositorio
(`/Users/salasgar/Documents/git/Ejercicios-interactivos`). `R=reparto-practicas-u2`.

1. Lee `$R/proyecto.md` y `$R/_ESTADO.md` enteros, y **lista `$R/hechos/`**
   (`ls $R/hechos/*/`): la carpeta manda sobre la tabla. Resuelve lo que no cuadre antes de
   coger nada (tabla de rastros contradictorios en el tablón, «Antes de hacer nada»).
2. `date -u` para saber la hora de verdad. `git fetch origin && git status -sb` para saber
   si hay commits que traer (`git pull --rebase origin main` si los hay; los ficheros de
   otras sesiones a medias no estorban porque tocan rutas distintas).
3. Abre tu reclamo generando el sid **en el mismo comando** (probado en este Mac):
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -d '+MINUTOS minutes' +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -v+MINUTOSM +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 232\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/232--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/232--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 232 con `abierto:` más antiguo (o igual y sid menor), añade a tu
   reclamo una línea `CEDIDA a <sid del otro>` y elige otra tarea.
5. Si el reclamo que encuentras está caducado (RELEVABLE en el tablón), relévalo con la
   línea `releva a: <sid anterior>` **en tu propio reclamo**; el suyo no se toca. Después
   mira qué dejó hecho: `ls practicas/`, `git log --oneline -5`, `git status -sb`, y la
   carpeta de salida. Lo que haya con tests en verde se hereda y se dice en la terminada;
   lo que no, se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** (todas las filas contra `hechos/` y la
   hora real; banda y «encadenable» recopiadas de las fichas) antes de empezar, y sigue
   con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.
   Si hay otras sesiones en el árbol (`.claude/sesiones/`), retoque de tus filas y del registro, no regeneración completa.
7. Idempotencia: comprueba si `practicas/<tu slug>/` o tu test ya existen (de una sesión
   caída) antes de crearlos. Si existen, léelos y continúa desde ahí.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/232--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Calcada de la 116 (U3, 30-10, sin incidencias), la 121 (U4), la 132 (U5) y la 160 (U6, 18-11, en tres vueltas): con Juan Luis
delante y Claude en Chrome, crear en el editor de tareas del panel **las seis tareas semanales de la U7** que proponen las
ENTREGA de la 227-231, y dejar sus ids en la ENTREGA para la tarea 40 del reparto de la U7 (Classroom). **Son seis y no cinco**
porque el paquete 3 es doble y lo parten las vacaciones (del vie 19-3 al vie 2-4): una tarea por lunes lectivo, con entrega el
jueves a las 23:59 y 100 puntos cada una.

| Tarea semanal | `desde` → `hasta` | Propuesta en | Prácticas (propuesta, hasta el acta de la 02 de la U7) | Nombre (propuesta) |
|---|---|---|---|---|
| 1 | lun 1-3 → jue 4-3 (`2027-03-01` → `2027-03-04`) | 227 | `razones`, `tabla-proporcional`, `regla-de-tres` (y `leelo7` si se publicó) | «U7 · 1» |
| 2 | lun 8-3 → jue 11-3 (`2027-03-08` → `2027-03-11`) | 228 | `inversa`, `directa-o-inversa`, `repartos` | «U7 · 2» |
| 3 | lun 15-3 → jue 18-3 (`2027-03-15` → `2027-03-18`) | 229 | `tres-escrituras`, `tanto-por-ciento`, `que-porcentaje` | «U7 · 3a» |
| 4 | lun 5-4 → jue 8-4 (`2027-04-05` → `2027-04-08`) | 229 | `descuentos` y repaso de las otras tres | «U7 · 3b» |
| 5 | lun 12-4 → jue 15-4 (`2027-04-12` → `2027-04-15`) | 230 | `escalas` y, si existe, `unidades` | «U7 · 4» |
| 6 | lun 19-4 → jue 22-4 (`2027-04-19` → `2027-04-22`) | 231 | `problemas-proporcion`, `errores7` | «U7 · 5» |

**Cómo se llaman las seis lo decide Juan Luis aquí**, antes de guardar la primera: la propuesta («U7 · 1», «U7 · 2», «U7 · 3a»,
«U7 · 3b», «U7 · 4», «U7 · 5», con el título que traiga cada ENTREGA detrás) hace que cuadren con los paquetes del papel; la
alternativa es numerarlas del 1 al 6. Lo que decida vale para las seis y se escribe en la ENTREGA (lo lee la tarea 40 de la U7).
Cada tarea lleva los ★ y los «a elegir» de su propuesta (el plan A, o el que toque según lo publicado ese día) y **su ★ de
ortografía, el que diga esa ENTREGA**: sale de `comun/CALENDARIO-CURSO-2026-27.md` de los apuntes o, si allí no había fila, es
una propuesta de la publicación marcada como tal (la tabla de la 196 tiene cinco ★ para la U7 y las tareas son seis): en ese
caso **se le pregunta a Juan Luis al montar la tarea** y lo que diga se anota. El campo `reto` (puntos extra, decisión del
16-11) se deja vacío salvo que él pida uno.

## Siguiente paso

Lee `salidas/160-tareas-u6-panel/ENTREGA.md` (cómo se hizo en tres vueltas, qué falló y cómo es la tabla para Classroom) y, si quieres más precedentes, `salidas/116-tareas-u3-panel/ENTREGA.md`, `salidas/121-tareas-u4-panel/ENTREGA.md` y `salidas/132-tareas-u5-panel/ENTREGA.md`; y las propuestas de la 227-231 que estén cerradas. Comprueba en `catalogo.js` de `origin/main` que las prácticas de la propuesta están con `disponible: true` y con `curl` que GitHub Pages ya las sirve. Si Juan Luis no está delante con el panel abierto, no reclames.

## Qué hay que hacer

1. Con las herramientas de Claude en Chrome, en el editor del panel (`https://salasgar.github.io/Ejercicios-interactivos/practicas/profesor.html`, su cuenta, su espacio): mira primero qué tareas hay ya en la unidad 7 (ninguna a medias ni duplicada); después, una tarea por cada propuesta cerrada, con sus campos (título en los dos idiomas, `desde`, `hasta`, ★, «a elegir», `nElegir`; obligatoria y para todos: la casilla «solo para algunos alumnos», sin marcar). Se le enseña el resumen a Juan Luis y **confirma cada una antes de guardar**; se guarda una sola vez.
2. Lee de vuelta las tareas creadas tras recargar (id, título, fechas, ejercicios marcados, `nElegir`, puntos) y compáralas con la propuesta; abre `…/practicas/semana.html?t=<id>` de cada una y mira el plazo y los recuentos, sin empezar ningún ejercicio. Cierra la pestaña al terminar.
3. `salidas/232-tareas-u7-panel/ENTREGA.md` con la tabla de las tareas (id, título, `desde` → `hasta`, ★, a elegir, `nElegir`, puntos, plan), sus enlaces `https://salasgar.github.io/Ejercicios-interactivos/practicas/semana.html?t=<id>`, los nombres que eligió Juan Luis, el ★ de ortografía de cada una y lo que quedó distinto de la propuesta, **en una tabla «Para la tarea 40 del reparto de la U7»** como la de la 160 (id, enlace, visible desde, plazo, recuentos para la descripción): las tareas no están en `tareas.js` y el script de Classroom toma los datos de ahí. Díselo a Juan Luis: la tarea 40 de la U7 (Classroom) ya puede reclamarse con su firma F13 (para las tareas que existan).
4. Si faltan paquetes por publicar, la tarea queda A MEDIAS con su nota (qué tareas faltan y de qué publicación dependen) y se vuelve con reclamo nuevo; en cada vuelta, la ENTREGA se amplía, no se reescribe.

## Datos de entrada

- `salidas/227-…` a `231-…/ENTREGA.md` (propuestas, con su ★ de ortografía); `salidas/196-publicar-ortografia-4/ENTREGA.md` y `comun/CALENDARIO-CURSO-2026-27.md` de los apuntes (de dónde salen esos ★); `salidas/160-…`, `116-…`, `121-…` y `132-…` (precedentes); `docs/practicas-guia-profesor.md`.

## Cómo saber que ha terminado

Las seis tareas en el panel con los campos de su propuesta, leídas de vuelta, con sus ids, sus enlaces y sus nombres en la ENTREGA y la tabla para la tarea 40 de la U7 (si faltan paquetes, la tarea queda A MEDIAS con su nota y se vuelve).

## Trampas conocidas

- Claude en Chrome necesita la pestaña activa y visible; el editor de tareas del panel es el de la tarea 67 (ampliado el 2-11 para la ortografía transversal): si falla, reabierta de la 67 y plan B (él teclea, la sesión dicta).
- (U4, 121) Se puede montar solo la semana 1 y volver: dilo en la ENTREGA y deja la tarea A MEDIAS con su nota; cada vuelta, reclamo nuevo.
- (U6, 160, 18-11) La extensión de Chrome puede caerse a mitad de un formulario («Couldn't determine which page this action targets»; `list_connected_browsers` vacío). Al reconectarse, la pestaña se recarga y el formulario se pierde. Antes de rellenarlo otra vez, mira en la lista de la unidad qué tareas hay guardadas, para no duplicar ninguna. Rellenar y guardar con un solo `javascript_tool` sobre los controles del propio editor (`[data-nueva]`, `#f-es`, `select[data-ej="slug/n"]`, `#f-nelegir`, `#f-guardar`) es rápido y deja menos tiempo expuesto. Solo se pulsa «Guardar» si `#f-avisos` está vacío y salen las marcas esperadas.
- (U6, 160, 18-11) Si se monta una semana nada más publicarse sus prácticas, el editor puede seguir con el `catalogo.js` viejo, que Chrome tiene en caché (GitHub Pages lo sirve con caché de 10 min). Se nota porque salen menos filas y las prácticas nuevas no aparecen. Antes, comprueba con `curl` que Pages ya sirve `disponible: true`. Si el editor no las lista, cancela, pide el catálogo con `fetch(url, {cache: 'reload'})` y recarga.
- (U6, 160, 18-11, tercera vuelta) Encadenada tras la publicación en la misma sesión, salió sin tropiezos: `curl` en bucle hasta ver `disponible: true` (unos 3 min tras el push), `fetch` con `cache: 'reload'` y recarga **antes** de abrir el editor, y rellenar con `value` + eventos `input` y `change` en un `javascript_tool`, sin guardar. Se le enseña el resumen a Juan Luis y, con su sí, otro `javascript_tool` comprueba de nuevo las marcas esperadas (allí, 14) y que `#f-avisos` esté vacío antes de pulsar `#f-guardar`.
- (U6, 160) El editor guarda los ejercicios en el orden del catálogo, no en el de la propuesta (la ortografía sale la última de los ★ y los de repaso, los primeros): no cambia los puntos ni el contenido; se anota como desviación de orden y ya está.
- Las dos tareas del paquete 3 (15-3 y 5-4) salen de una sola publicación (229) y se montan en la misma vuelta; la del 5-4 es de abril: revisa el año y el mes de `desde` y `hasta` al leerla de vuelta («desde 05-04 · plazo 08-04»).
- (U6, del 14 al 16-11; historia) Varias sesiones escribieron en este árbol y comitearon y empujaron desde worktrees: `main` se separó de `origin/main` y el lanzador dejó de ver tareas. Regla vigente (`CLAUDE.md` de la raíz y `proyecto.md`, «Se sube desde el mismo árbol en el que se escribe»): tus rastros (`hechos/`, la ENTREGA, el tablón) se escriben, se comitean con rutas explícitas y se empujan desde aquí.

## Prohibido (propio de esta tarea)

- Tocar código, `tareas.js` o Firestore directamente.
- Crear una tarea con el código de un alumno o con AJJN.

## Salida esperada

- `reparto-practicas-u2/salidas/232-tareas-u7-panel/ENTREGA.md` (ids, enlaces, diferencias) y su marcador. Sin commit de código.

## Reglas de contenido de la unidad 7 (copia de `proyecto.md` de su reparto; lo común no se lee, por eso va aquí)

Las reglas 2-4 y 8-9 de la lista de la unidad 2 (signos `·` y `:`, inglés, regla de oro, feedback, realismo) valen igual.
La fuente es `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/reparto-unidad7/proyecto.md` («Reglas de contenido comunes») y, cuando exista, el acta
`/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/inventario-unidad7-revision.md` (lo que Juan Luis decida en la tarea 02 de aquel reparto, firma F0:
el método —reducción a la unidad, regla de tres o constante—, la inversa, los repartos, los porcentajes encadenados y «el
precio antes de la rebaja», el IVA, las escalas, si las unidades de medida van aquí o en la U8, la velocidad, el cambio de
moneda, la calculadora, la notación, las cotas de realismo, los ids, cómo se reparte el paquete 3). **Si esta copia y el acta
discrepan, manda el acta. Hasta el acta, todo lo de aquí es la propuesta de partida de la montadora (18-11-2026) y lo marcado
como «punto a decidir» no entra.** Calendario: del lun 1-3 al vie 23-4-2027, 23 clases, cinco paquetes (el 3, doble: sesiones
9-11 del 15 al 18 de marzo y 12-14 del 5 al 8 de abril, con vacaciones del 19-3 al 2-4); pruebas los viernes 5-3, 12-3, 9-4 y
16-4, final el vie 23-4; **seis tareas semanales de la app** (propuesta), una por lunes lectivo (1-3, 8-3, 15-3, 5-4, 12-4, 19-4).

1. **Una misma razón tiene muchas escrituras, y todas son la misma respuesta.** `3/4`, `6/8`, `0,75`, `75 %` y «3 de cada 4»;
   `1/5`, `0,2` y `20 %`; «aumentar un 20 %» y «multiplicar por 1,2»; «rebajar un 25 %» y «pagar el 75 %»; `1 : 50 000` y «1 cm
   son 500 m»; `1,5 h` y «1 h 30 min»; `2,5 km` y `2500 m`. En cualquier ejercicio de elegir, emparejar o verdadero/falso,
   ninguna opción puede valer lo mismo que otra: el test lo comprueba **por valor**, con las fracciones exactas de
   `_comun/fracciones.js` (nunca `Number` en coma flotante) y cada cantidad en su unidad base; el módulo base de la unidad será
   `practicas/_comun/proporcion.js` (tarea 211). Solo si el ejercicio evalúa la forma escrita («escribe como porcentaje», «la
   razón más sencilla») cuenta la escritura, y el enunciado lo dice. **Dos métodos correctos nunca se enfrentan.** Lo que teclea
   el alumno se interpreta sin `eval` y se compara por valor: `20 %`, `0,2` y `1/5` valen igual, y `12 €` como `12,00 €`, salvo
   que la consigna pida una forma.
2. **Nada que no se haya dado**: cada ejercicio respeta la columna `sesion` de sus destrezas en el inventario (hasta el acta, el
   calendario propuesto: semana 1, razón, proporción y proporcionalidad directa; semana 2, inversa y repartos directos; semana 3,
   porcentajes, en dos tareas de la app: sesiones 9-11, los tres problemas de porcentajes, y 12-14, aumentos, descuentos e IVA;
   semana 4, escalas y unidades de medida; semana 5, velocidad, cambio de moneda y problemas mezclados). **Ninguna inversa antes
   de la sesión 5, ningún reparto antes de la 7, ningún porcentaje antes de la 9, ningún aumento o descuento antes de la 12,
   ninguna escala antes de la 16.** Ni proporcionalidad compuesta, repartos inversos, interés compuesto ni funciones (2.º ESO),
   ni geometría con fórmula (U8); los encadenados, «el precio antes de la rebaja», las unidades de medida, la velocidad y el
   cambio de moneda, solo si el acta los admite y en la sesión que diga. Se saben la jerarquía (U1), el m.c.d. y el m.c.m. (U2),
   los enteros (U3), las fracciones (U4), los decimales (U5) y el álgebra (U6; `3/4 = 6/x` se resuelve con los productos
   cruzados, `3x = 24`, nunca «despejando» una `x` del denominador).
3. **Notación** (propuesta): `20 %` con espacio en español y `20%` pegado en inglés (*twenty per cent*); la razón, como fracción
   (`htmlFraccion` de `fracciones.js`) o con palabras («3 a 4», *3 to 4*, «3 de cada 4», *3 out of 4*), y `1 : 50 000` solo en
   escalas y repartos; espacio fino en los números de cinco cifras o más (`50 000`; `2500` sin separar); coma decimal en español
   y punto en inglés; el dinero, con dos decimales (`12,00 €`); las unidades del SI, separadas del número (`3,5 km`, `90 km/h`,
   `L` mayúscula); `·` y `:` entre números. El alumno puede teclear `20%`, `20 %`, `0,2`, `0.2` o `1/5`; nunca `eval`.
4. **Regla de oro**: todo distractor, inequívocamente falso, y cada distractor sale de un **error típico** de la columna `nota`
   del inventario, calculado con los números del ítem y comprobado en el test (nunca un número al azar): **razonar sumando en
   vez de multiplicando** (si 2 cuestan 5 €, 4 cuestan 7 €, en vez de 10 €); invertir la razón (`4/3` por `3/4`); confundir
   parte-parte con parte-todo (chicos y chicas en razón 2 a 3 → «2/3 de la clase son chicos», en vez de 2/5); aplicar la regla
   de tres directa a una situación inversa (6 obreros, 10 días → 4 obreros, «6,67 días», en vez de 15) y al revés; dar por
   proporcional lo que no lo es; el 20 % de 50 como `50 : 20 = 2,5` (es 10); `20 % = 0,02` o `= 2`; `5 % = 0,5`; restar el
   porcentaje como si fuera un número (`50 − 20 % = 30`, en vez de 40); dar el descuento cuando se pide el precio final (45 €
   con un 20 % → 9 €, en vez de 36,00 €) y al revés; para hallar el total, calcular el porcentaje del dato (el 20 % son 30 → 6,
   en vez de 150); para «qué porcentaje», dividir al revés; en un reparto, a partes iguales (120 € en la razón 2 : 3 → 60 € y
   60 €, en vez de 48 € y 72 €); en una escala, multiplicar cuando toca dividir u olvidar el cambio de unidad (3 cm a escala
   `1 : 50 000` → «150 000 km», en vez de 1,5 km); `1,5 h` leído como 1 h 50 min. Los generadores de estos valores estarán en
   `_comun/proporcion.js` (`ERRORES_TIPICOS`): úsalos, y **cada función dice cuándo no sirve** (devuelve `null` cuando el error
   da lo mismo que la respuesta). **Lo que no es un error**: una escritura equivalente cuando no se pide la forma, un método
   distinto del explicado, *percent* por *per cent*, `12 €` por `12,00 €`, una razón sin simplificar cuando no se pide.
5. **Parejas válidas, que nunca se enfrentan**: *per cent* / *percent*; «tanto por ciento» / «porcentaje»; *ratio 3 to 4* /
   `3 : 4` / `3/4`; *VAT* / IVA; *discount* / *reduction*; «regla de tres» / «reducción a la unidad» / «productos cruzados»;
   *directly proportional* / *in direct proportion*; una fracción irreducible, su decimal exacto y su porcentaje.
6. **Inglés sencillo**; la palabra no matemática que decide la respuesta se aclara entre paréntesis (*discount* (descuento),
   *sale* (rebajas), *increase* (subida), *each* (cada uno), *altogether* (en total), *share* (repartir), *per* (por cada),
   *at the same rate* (al mismo ritmo), *tap* (grifo), *recipe* (receta)), salvo que sea justo lo que se evalúa. **El enunciado
   no puede ser ambiguo**: «aumenta un 50 %» frente a «aumenta al 150 %»; «un 20 % más barato» (¿de qué precio?); en la
   inversa, todos trabajan al mismo ritmo y se dice; en un reparto, proporcional a qué.
7. **Realismo** (regla de Juan Luis del 16-10): la situación tiene que ser posible (y de proporcionalidad de verdad) y **todos**
   los números que pueda sacar el generador, creíbles, con una cota por contexto que el test comprueba. Orientativas hasta el
   acta: descuentos del 5 al 70 %; IVA del 4, 10 o 21 %; subidas del 1 al 20 %; propina del 5 al 15 %; un porcentaje de un
   grupo, con el resultado en personas enteras; recetas para 2 a 12 personas (50-1000 g, 0,1-2 L, 1-12 huevos); obreros o
   grifos de 1 a 12, de 1 a 60 días o de 1 a 24 horas; consumo de 4 a 9 L cada 100 km; velocidades: a pie 3-6 km/h, en bici
   10-30, en coche 30-120, en tren 80-300; escalas: planos `1 : 50` a `1 : 200`, mapas `1 : 25 000` a `1 : 1 000 000`, con 0,5 a
   30 cm en el plano; cambio de moneda entre 0,80 y 1,30, dicho en el enunciado; repartos entre 2-4 personas, exactos al
   céntimo; precios como en la U5 y la U6. **El resultado de un problema es creíble y exacto**: personas y objetos, un natural;
   dinero, exacto al céntimo (50 € más el 21 % de IVA son 60,50 €); los datos se eligen para que el porcentaje salga exacto.
   Los personajes llevan nombres inventados (no de alumnos reales).
8. **Feedback ligado al error**, con los números del ítem («el 20 % de 150 no es `150 : 20`: es `20/100 · 150 = 30`»), no una
   regla genérica. Frase sencilla antes que caso límite.
9. **Casos fijos** (frases, contextos, números) que no copien los de las hojas, los exámenes semanales ni el examen final de la
   unidad 7 (en `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/hojas-de-ejercicios/`, `exámenes-semanales/`, `examen-final/`): los alumnos los verán en papel. **Los casos de
   las hojas se excluyen en claro; los de los exámenes, por huella FNV-1a calculada fuera del repositorio, nunca en claro** (regla de
   PU2 del 30-10; modelo: `practicas/equivalentes/logica.js` y `tests/practicas-equivalentes.test.js` tras el commit b0e4cfd, y la
   reabierta `hechos/reabiertas/100--s-20261030T081542-dab2aa98-revision.md`). Con proporcionalidad, la huella se calcula sobre el
   **caso normalizado por valor** (tipo de problema y datos como fracciones irreducibles en un orden fijo), no sobre el texto. Si
   al reclamar la hoja o el examen de tu paquete no existen aún, dilo en la ENTREGA: la tarea de publicación de tu paquete coteja y
   reabre si hace falta.
10. **Aritmética exacta**: las razones, los porcentajes y los resultados son `Fraccion` de `_comun/fracciones.js` (o enteros; el
    dinero, en céntimos enteros); nunca se compara ni se muestra con `Number` en coma flotante; el redondeo, al más cercano (la
    mitad, hacia arriba) y solo si el enunciado lo pide, nunca `toFixed` sobre un flotante; nunca `eval` sobre lo que teclea el
    alumno. Los tests lo comprueban contra `BigInt` o aritmética entera propia.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 232, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-232.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/232--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/232--<sid>.md` con `parada por: mal cortada`
y la ruta de la incidencia, `ABANDONADA` en tu reclamo, y díselo al usuario. Si un paso te
pide **decidir** algo que va a durar (un cambio del contrato de la base, otro número de
ejercicios que el del catálogo, una colección nueva en Firestore) y esta tarea no es de
banda ALTA con el usuario delante, no lo decidas: entrégalo como propuesta en tu terminada
y sigue con lo que no dependa de ello.

## Al terminar

Por este orden (el del repositorio git):

1. `node --test tests/practicas-comun.test.js tests/practicas-<tu slug>.test.js` en verde y
   `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con reclamo vivo no
   es tuyo: anótalo en la terminada). Prueba la práctica en el navegador con
   `npm run servir` y http://localhost:8080/practicas/<slug>/ (los módulos ES no cargan
   abriendo el fichero), en una ventana estrecha (375 px) y en una ancha, en español y en
   inglés, y haz al menos un ítem de cada ejercicio acertando y fallando.
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas:
   `git add <rutas> && git commit -m "<qué>" -- <rutas>`. Apunta el hash
   (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/232-tareas-u7-panel/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cotas de realismo, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/232--<sid>.md`: hash del commit, ficheros (lo que dice
   `git show --stat`, no lo que crees), número de tests propios en verde, hora y
   **duración real** (de `abierto:` a ahora), y propuestas pendientes si las hay.
5. Añade `CERRADA` a tu reclamo (línea propia que empieza por esa palabra).
6. Choques encontrados → `$R/hechos/incidencias/<sid>.md`.
7. `git fetch origin`, relista `$R/hechos/` **ahora** y regenera `$R/_ESTADO.md` (entero si
   no hay otras sesiones en el árbol; si las hay, retoque de tus filas y del registro):
   banda y «encadenable» recopiadas de las fichas, leyenda de bandas de `proyecto.md`. Anota qué
   tareas pasan de BLOQUEADA a PENDIENTE. Si tu duración real difiere mucho de la estimada,
   díselo al usuario.
8. Vuelca abajo, en «Trampas conocidas» de esta ficha, lo que hayas aprendido por las
   malas (es lo único de la ficha que editas, además de la duración).
9. Un solo commit con rutas explícitas de tus ficheros de `$R/hechos/` (por sid), tu
   carpeta de `$R/salidas/`, `$R/_ESTADO.md` y esta ficha, y `git push origin main`. Si el
   push se rechaza: `git pull --rebase origin main`, regenera el tablón otra vez desde
   `hechos/` (no lo fusiones a mano) y vuelve a comitear y empujar. **Nunca si `main` lleva
   commits ajenos sin empujar**: incidencia y díselo al usuario.
10. Dile al usuario la **foto del momento** en tres líneas («EN CURSO: … · LIBRES ahora: … ·
    BLOQUEADAS: …»), sacada de la lectura de `hechos/` del paso 7, y después, **solo para las
    LIBRES**, las frases de arranque de `proyecto.md` literales, en bloques de cita, una por
    sesión que quepa a la vez, con la tarea o la cadena, la banda traducida y el nombre de
    sesión delante.
11. Decide si encadenas (solo en verde: misma banda, tarea corta, sin esperas; si tu frase
    de arranque nombra la cadena, encadenas por defecto) o paras. Si encadenas, «Antes de
    empezar» entero otra vez, con reclamo nuevo, y di el nombre nuevo que te toca.

Si paras sin terminar: `$R/hechos/fallos/232--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni
  `practicas/_comun/` (salvo la tarea 01; en cada unidad, su base y sus tareas de publicación; cada una en lo que declara), ni `css/estilos.css`, ni `README.md` (salvo
  01 y 18), ni `firestore.rules` ni `src/firebase.js` (salvo 01), ni fichas ajenas, ni
  nada de la carpeta de apuntes de iCloud. Si la base te falta algo, se propone en la
  terminada; no se parchea.
- `git add .`, `git add -A`, `git commit -a`, o un `add` separado del `commit`. El índice
  es compartido con otras sesiones del mismo árbol.
- Editar el código con `sed -i` o heredocs desde el shell: el candado de sesiones solo
  ve Edit/Write, y así otra sesión no sabe que el fichero está en uso. El código se edita
  con las herramientas de edición; `hechos/` sí se escribe desde el shell (un escritor).
- Reescribir un fichero de `hechos/` (solo `>>`), editar un reclamo ajeno, o regenerar el
  tablón de memoria sin relistar `hechos/`.
- Dependencias nuevas (npm, CDN): la app no tiene build y solo carga KaTeX y Firebase por
  CDN; las prácticas no usan ni siquiera KaTeX (exponentes con `<sup>`; las fracciones con
  `htmlFraccion`).
- Las reglas de contenido de la unidad 7 (en esta ficha y en `proyecto.md` de su reparto): `×` en vez de `·`; algo de una sesión
  posterior a la de la destreza (ninguna inversa antes de la sesión 5, ningún reparto antes de la 7, ningún porcentaje antes de
  la 9, ningún aumento o descuento antes de la 12, ninguna escala antes de la 16); proporcionalidad compuesta, repartos inversos,
  interés compuesto, funciones o geometría con fórmula; lo que el acta deje fuera (hasta el acta, los puntos a decidir: los
  encadenados, «el precio antes de la rebaja», las unidades de medida, la velocidad, el cambio de moneda); `eval` o coma
  flotante; un contexto sin su cota o un resultado que no sea exacto; distractores que puedan ser verdad, y en especial **dos
  opciones que valen lo mismo** (`0,2` y `20 %`; `3/4` y `75 %`; `2,5 km` y `2500 m`), que son dos respuestas correctas, o dos
  métodos correctos enfrentados; casos de examen en claro en el repositorio.
