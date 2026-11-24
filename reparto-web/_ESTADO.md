# TABLÓN DE ESTADO — WEB (web «1º ESO» de Google Sites y acertijos)

**VISTA DERIVADA. No se edita a mano y no es la fuente de verdad.** La verdad está en la
carpeta `hechos/`: un fichero por hecho, cada uno con el identificador de la sesión que
lo escribió en el nombre. Si la tabla de abajo contradice a `hechos/`, gana `hechos/` y
este tablón hay que regenerarlo entero. Reclamar una tarea **no** es escribir aquí: es
escribir un fichero propio en `hechos/reclamos/`; si este fichero está reservado por
otra sesión cuando te toque regenerarlo, no esperes —tu reclamo ya vale— y regenera
cuando puedas. Este párrafo se copia tal cual en cada regeneración.

Ficha del proyecto —rutas, automatismos, frase de arranque—: `proyecto.md`
Autorizaciones firmadas: `autorizaciones.md`
Ninguno de los dos se regenera nunca; este fichero sí, entero.

Regenerado: 2026-11-24T00:26:50Z · por la sesión s-20261124T002600-b155c411 (WEB T07: reclamo de la 07)

## Antes de hacer nada

0. Lee `proyecto.md`: ahí están las rutas —dónde está `hechos/`, dónde van las salidas—
   y si aquí se pueden renombrar ficheros. Sin eso, lo demás no se puede ejecutar.
1. Lee este fichero entero.
2. **Lista `hechos/reclamos/`, `hechos/terminadas/`, `hechos/reabiertas/`,
   `hechos/sustituidas/` y `hechos/fallos/`**, y compáralo con lo que hay en `salidas/`. Resuelve lo que no
   cuadre antes de coger tarea. Cuando haya varios rastros de una misma tarea, gana el
   más reciente por su fecha interna. Si existe `hechos/consolidado/`, su fichero más
   reciente te ahorra releer lo que enumera —tras comprobar que el disco no tiene nada
   fuera de su lista y que las carpetas que da por vacías lo están—, pero
   `hechos/reclamos/` se lee entero siempre: los reclamos cambian por dentro. Los
   recuentos de una salida que vayas a usar se leen de `hechos/terminadas/` o de la
   propia salida, nunca de este tablón.
3. Mira la hora de verdad: `date -u`. Suponerla es lo que hace que se releven tareas
   vivas. Y toda hora que escribas —latido, `caduca:`, cierre— la genera el propio
   comando con `$(date -u …)`; nunca la tecleas.
4. Genera tu identificador de sesión **en el mismo comando que escribe tu reclamo** y no
   lo cambies:
   `sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"`
   Nada de `$RANDOM`: solo existe en bash, y en un `sh` POSIX se expande a vacío sin
   error — dos sesiones del mismo minuto acabarían con el mismo sid y escribiendo los
   mismos ficheros. A partir de ahí tu sid es el del nombre de tu reclamo: léelo de ahí,
   nunca de un fichero de nombre fijo como `/tmp/sid.txt` — otra sesión de esta máquina
   elige el mismo nombre y os intercambiáis el sid.
5. Reclama tu tarea: crea el reclamo, ejecuta `sleep 30 && ls hechos/reclamos/` —el
   comando, no la intención; en segundo plano si el entorno bloquea `sleep`; `sleep 120`
   si la carpeta está sincronizada **y** hay sesiones en más de un dispositivo, según
   diga `proyecto.md`— y cede si otra sesión llegó antes. **Si `hechos/` está en Drive
   no hay shell**: el listado es `mcp__Google_Drive__search_files` y la escritura
   `mcp__Google_Drive__create_file`; el `sleep` sí corre en tu contenedor. **Aquí no hay worktrees**: se escribe y se comitea en este árbol
   (`CLAUDE.md`, «Git»); el reclamo se comitea y se empuja en el mismo comando que lo escribe
   (`git commit -m "WEB: reclamo NN" -- reparto-web/hechos/reclamos/NN--<sid>.md && git push`). Si la frase de arranque te
   nombra una tarea o una cadena, esa reclamas.
6. Si ganas, **regenera este tablón entero** —relistando `hechos/` ahora (`git fetch`
   antes si hay repositorio); todas las filas contra `hechos/` y la hora real, no solo la
   tuya— antes de empezar: es lo que el usuario mira para abrir
   sesiones, y si dijera «libre» de una tarea cogida abriría una sesión para nada. Y
   **sigue con la tarea hasta cerrarla o soltarla; no termines el turno para pedir
   confirmación**: una sesión que para tras reclamar es indistinguible en este tablón de
   una que trabaja. Si no hay tarea libre de tu banda, dilo —qué está vivo y cuándo
   caduca— y para; no te quedes sondeando.

El protocolo completo está en la skill `reparto`, fichero `referencias/concurrencia.md`
(`~/.claude/skills/synced/*/reparto/referencias/concurrencia.md`).
Si no lo tienes a mano, lo esencial es esto: cada sesión escribe únicamente ficheros que
llevan su identificador en el nombre, nadie edita el fichero de nadie, y este tablón se
regenera a partir de los demás.

## Reglas de operación

0. **Coge una tarea que encaje con el modelo con el que te han abierto.** Una sesión no
   puede saber en qué modelo corre: lo dice el usuario en la frase de arranque. Si dice
   banda BAJO, coge una tarea de banda BAJO y no la de decidir la estructura; si no dice
   nada, pregúntaselo en una línea antes de reclamar nada, salvo que todas las tareas
   libres sean de la misma banda. Una tarea de banda ALTA hecha con el modelo rápido sale
   cara: no falla de golpe, sale mediocre y nadie lo nota hasta mucho después.
1. **Una sesión, una tarea, reclamada.** El reclamo se abre en
   `hechos/reclamos/NN--<sid>.md` con un campo `caduca:` ya calculado (`2 ×` la duración
   esperada, mínimo 45 minutos). Después, `sleep 30` y volver a listar: si hay otro
   reclamo vivo de la misma tarea, sigue el de apertura más antigua y, si empatan, el de
   identificador menor alfabéticamente. El que pierde escribe `CEDIDA` y elige otra
   tarea. Con la carpeta sincronizada y sesiones en varios dispositivos, `sleep 120`.
   **El reclamo se lee a máquina**: campos `sesión:`, `tarea:`, `abierto:`, `caduca:` con
   ese nombre exacto, y el cierre como línea propia que empieza por `CERRADA`, `CEDIDA` o
   `ABANDONADA`; esas palabras no van en ningún latido («v16 terminada», no «v16
   CERRADA»).
2. **Un reclamo está vivo** si su último `caduca:` está en el futuro, no tiene línea de
   cierre (`CEDIDA`, `CERRADA`, `ABANDONADA`) y ningún reclamo —esté como esté— lo nombra en un
   `releva a:`. Un reclamo caducado es **relevable** (así lo pinta la tabla): se toma
   abriendo el tuyo con la línea `releva a: <sid anterior>`, y eso anula al anterior
   aunque reviva. Sin esa línea, si el anterior revive y estira su caducidad, el suyo es
   el más antiguo y gana. El relevo se escribe **solo en tu reclamo**; el del caído no
   cambia ni una línea, y que no diga que fue relevado es normal. Un reclamo con tu sid
   que no recuerdas haber escrito no es tuyo: ciérralo con `ABANDONADA (no es mío)` y
   no lo uses. Y un fichero con tu contenido y sid ajeno no lo edites: incidencia, sid
   nuevo, reclamo nuevo.
3. **Estira la caducidad antes de una operación larga**, y late mientras dura: la
   operación corre en segundo plano y tú, desde un bucle, esperas de diez a quince
   minutos, lates y vuelves a esperar; si tiene que correr donde nada sobrevive a la
   llamada, no hay latido y estirar antes con margen es la única defensa. Esperar
   también es una operación larga: si te quedas a la espera de un vigilante, una cuota
   o un proceso ajeno, estira antes de esperar y late en cada comprobación. Y
   **cualquier pausa cuenta como operación larga** —un turno terminado, un «Continúa»
   tras un rato parada—: antes de escribir nada después, `date -u`, tu reclamo, y tu sid
   en las líneas `releva a:` de `hechos/reclamos/`; si te han relevado, `ABANDONADA
   (relevado)` y no toques la salida.
4. **Cada sesión escribe solo lo suyo.** Ningún fichero tiene dos escritores. Nada de
   editar el reclamo, el fichero de cierre ni la salida de otra sesión. **Y a un fichero
   de `hechos/` solo se añade (`>>`), nunca se reescribe**: un reclamo reescrito pierde
   los latidos y caducidades que ordenan quién gana.
5. **Una tarea, una carpeta de salida, un dueño.** Las demás tareas la leen; no escriben
   en ella. **Ningún fichero cuenta hasta que existe al lado su marcador vacío
   `<nombre>.ok-<sid>`**; es también lo único que dice qué sesión escribió qué. Antes de
   escribir en una salida que no esté vacía —relevos, sobre todo—, lista sus marcadores:
   un fichero con `.ok` ajeno se verifica contra el recuento y se hereda tal cual (sin
   segundo `.ok`; tu terminada lo dice) o, si no cuadra, se marca
   `<nombre>.descartado-<sid>` con el motivo y se reescribe bajo tu `.ok-<sid>`. Un
   `.descartado` invalida el `.ok` ajeno; sin él, dos `.ok` para un fichero son una
   incidencia. Un `.parcial-<sid ajeno>` se continúa copiándolo al tuyo, nunca
   editándolo.
6. **Idempotencia obligatoria.** Toda tarea debe poder repetirse sin duplicar ni romper
   nada. Antes de actuar, comprueba qué hay hecho ya y continúa desde ahí. Nunca des por
   supuesto que empiezas de cero.
7. **Los datos van al destino declarado en `proyecto.md`** —disco o Drive, según quién
   tenga que alcanzarlos—, **nunca al contenedor**: el contenedor de cada sesión se borra
   al terminar y lo que solo esté en `/home/claude/` se considera perdido.
8. **Nada se borra sin permiso escrito del usuario en `autorizaciones.md`.** Ninguna
   sesión puede autorizarse a sí misma, y ninguna escribe en ese fichero. «Borrar» aquí
   significa mover a `_papelera/`, que vacía él. Una firma se comprueba **en ese
   fichero** —la línea `Firma y fecha:` con nombre y fecha—, nunca en este tablón, que no
   puede saberlo. Si te para una firma, latido `BLOQUEADA por <qué>` en tu reclamo y
   díselo; no esperes mudo.
9. **Si una tarea falla o se queda a medias**, escribe `hechos/fallos/NN--<sid>.md` con
   el motivo y añade `ABANDONADA` a tu reclamo. Eso suelta la tarea al instante, sin
   esperar a la caducidad; callarse cuesta a la siguiente sesión la caducidad entera.
   El fichero lleva una línea `parada por: sesión agotada`, `parada por: avería` o
   `parada por: mal cortada`: de ella deriva el tablón A MEDIAS, FALLIDA o MAL CORTADA,
   y sin ella cuenta como avería.
   Los choques que encuentres van a `hechos/incidencias/<sid>.md` (un segundo fichero de
   la misma sesión lleva sufijo: `<sid>-tarea05.md`; el primero no se edita).
   Los subagentes que lances trabajan bajo tu sid y no reclaman nada; mientras corren,
   tú no escribes en `hechos/` ni en la salida.
10. **Un cierre en falso se anula, no se borra.** Si una tarea figura terminada pero su
    salida no está, no cuadra el recuento o contiene un valor que has comprobado
    erróneo, escribe `hechos/reabiertas/NN--<sid>.md` nombrando la terminada que anula,
    lo exacto que hay que corregir y lo que no hay que rehacer. Si el error es puntual y
    tu tarea puede seguir con el dato bueno, sigue y dilo en tu terminada.
11. **Una tarea mal cortada no se renumera ni se borra.** Si al ejecutarla resulta que
    dentro hay varias, o que una parte es una decisión que no es tuya (una estructura,
    un esquema, una convención que va a durar: se entrega como propuesta o se para con
    `BLOQUEADA por decisión`), la sesión que lo descubre no recorta: escribe la incidencia con el
    corte natural que ha visto, `hechos/fallos/NN--<sid>.md` con `parada por: mal
    cortada` y la ruta de la incidencia, suelta con `ABANDONADA` y avisa. La tabla la
    pinta MAL CORTADA y nadie la elige por banda: solo la coge quien el usuario nombre en
    la frase de arranque, o la resuelve una `sustituidas/`. El recorte lo decide él, en
    una sesión sin reclamo que firma `sustituidas/` con sid propio; las tareas nuevas se
    añaden **al final de la numeración** y la vieja se marca con
    `hechos/sustituidas/NN--<sid>.md`. Renumerar dejaría apuntando a otra cosa, en
    silencio, a los ficheros de tarea, a los prompts de los automatismos y a todo
    `hechos/`.
12. **No modificar nunca** «ex Dropbox/mat», la carpeta de apuntes, Classroom ni Drive ajeno a la tarea; y
    **no pulsar nunca «Publicar»** en Google Sites: publica Juan Luis.
13. **Cerrada tu tarea, encadena otra solo en verde**: sin señales de sesión larga
    (releer lo ya leído, lentitud, una tarea entera ya hecha y la siguiente más larga, una
    espera por delante, aviso de límite), y con una tarea libre de **tu misma banda**,
    corta y que no dependa de nada EN CURSO ni de una firma. La columna «Encadenable con»
    lo sugiere; **si tu frase de arranque nombra la cadena, encadenas por defecto** y solo
    dejas de hacerlo en ámbar o rojo, diciéndolo. La anterior tiene que estar `CERRADA`
    antes de reclamar la siguiente, y para la siguiente se repite «Antes de hacer nada»
    entero, con reclamo nuevo, y dices el nombre que te toca ahora («renómbrame a
    `WEB T<NN>+T<MM> (<BANDA>)`», convención en `proyecto.md`). Si no estás en verde,
    cierra, da la foto del momento (EN CURSO · LIBRES · BLOQUEADAS, de `hechos/` leído
    ahora) y las frases de arranque **solo para las LIBRES** —una por sesión que quepa,
    con su tarea o cadena dentro y su nombre de sesión delante— y para. Cuántas caben se
    cuenta cruzando los «ficheros que toca» con los reclamos vivos. Una sesión con
    temporizador reclama cuando empieza a trabajar, no cuando se programa.
14. **Cada ficha declara los ficheros que
    toca; dos tareas que compartan uno no van en paralelo.** `add` nunca separado de
    `commit` (`git commit -m "…" -- rutas`); orden de cierre: pruebas en verde → commit
    del código → terminada con el hash, `CERRADA`, tablón y ficha → un commit con rutas
    explícitas (tus `hechos/` por sid, `_ESTADO.md`, la ficha) → `push`; si el `push` se
    rechaza, regenera el tablón otra vez en vez de fusionarlo. Un reclamo vivo es una
    sesión viva, aunque no aparezca en
    ningún directorio de sesiones del entorno; lo que deje preparado (índice, `.parcial`,
    salida sin marcador) no se materializa por iniciativa ajena.

15. **Corregir una salida ya entregada.** Si la tarea hizo mal su trabajo, `reabiertas/`
    y otra sesión la reclama. Si lo hizo bien y la especificación estaba incompleta, una
    tarea nueva **toma la titularidad** de la carpeta y lo declara en su ficha: rehace con
    `.descartado-<sid>` sobre lo viejo y hereda el resto. La carpeta no se comparte
    nunca; la fila de las dos tareas anota el traspaso.
16. **Quien monta o coordina no reclama ni escribe en `salidas/`.** Sus ficheros son las
    fichas, `proyecto.md`, `autorizaciones.md` vacío, este tablón cuando monta, da de alta
    o recorta, y en `hechos/` sus `notas/`, `sustituidas/`, `reabiertas/`, `incidencias/`
    y `consolidado/`. Si deja un vigía, es una comprobación de shell que solo avisa: no
    reclama, no escribe, no regenera.
17. **Los mensajes entre sesiones valen para resolver un choque**, siempre que el
    resultado acabe escrito en `hechos/` (incidencia o terminada): este tablón no sabe
    nada de los mensajes.

## Tabla de tareas

Vista derivada. LISTA si el rastro más reciente es una terminada; EN CURSO si hay
reclamo vivo; RELEVABLE si su reclamo más reciente está caducado sin cierre ni relevo
(la fila dice el sid y a qué hora caducó: quien la coja abre el suyo con `releva a:`);
REABIERTA si el rastro más reciente es una reabierta (la fila dice qué hay que corregir,
copiado del fichero); si el rastro más reciente es un fallo, su línea `parada por:`
decide: A MEDIAS con `sesión agotada` (cogible, se continúa por idempotencia), MAL
CORTADA con `mal cortada` (no se elige por banda; espera la decisión del usuario) y
FALLIDA con `avería` o sin línea (leer el fallo antes de reintentar); SUSTITUIDA si lo es
una sustituida —y entonces la fila dice por cuáles—; BLOQUEADA si le falta una
precondición; PENDIENTE en lo demás. Una LISTA cuya precondición se reabrió después
sigue LISTA y la fila lo anota. Se regenera al reclamar y al cerrar, **y regenerar es
recalcular todas las filas** contra `hechos/` y `date -u`, y el registro entero —una
línea por fichero de `terminadas/`—, no editar la fila propia: comprobación mínima,
ningún reclamo caducado sin cierre ni relevo sigue EN CURSO. **Nada de lo que hay aquí
sale de una conversación**: solo de `hechos/`, de los ficheros de tarea y de
`proyecto.md`. Ni firmas, ni «sigue viva», ni ninguna otra prosa de estado.

**La columna «Banda» no sale de `hechos/`: se copia del fichero de tarea**, que no se
regenera nunca. Al regenerar este tablón hay que volver a copiarla o la columna se pierde.
Dice con qué modelo conviene abrir la sesión que coja la tarea; la leyenda de debajo de
la tabla traduce cada banda al menú de hoy y se recopia de la tabla de bandas de
`proyecto.md` al regenerar, como la columna.

**La columna «Encadenable con» tampoco sale de `hechos/`**: la escribe quien monta, en
la ficha y aquí, y se recopia al regenerar como la banda. Nombra tareas de la misma banda,
cortas e independientes entre sí, que una sola sesión puede hacer seguidas. Es una
sugerencia para el usuario al decidir cuántas sesiones abre, y para la sesión al cerrar.

| # | Tarea | Fichero | Precondición | Duración esperada | Banda | Encadenable con | Salida (dueño único) | Disparo | Estado | Reclamo vivo (sid · caduca) |
|---|---|---|---|---|---|---|---|---|---|---|
| 00 | Fichas de Classroom (hecha antes del reparto) | — | — | — | — | — | salidas/00-classroom/ | — | ENTRADA (solo lectura) | |
| 01 | Descargar y pasar a texto «0_ACERTIJOS Y CURIOSIDADES» | tareas/tarea-01-dropbox-extraccion.md | ninguna | 30 min | BAJO | 05 | salidas/01-dropbox-extraccion/ | manual | LISTA | |
| 02 | Fichas de los acertijos de «ex Dropbox» | tareas/tarea-02-fichas-dropbox.md | 01 LISTA | 60 min | MEDIO | — | salidas/02-fichas-dropbox/ | manual | LISTA (165 fichas: 125 nuevas, 40 duplicados de Classroom con aportes; 82 nuevas sin solución) | |
| 03 | Recuperar los adjuntos de Classroom que la API no ve | tareas/tarea-03-adjuntos-classroom.md | 01 LISTA | 45 min | MEDIO | — | salidas/03-adjuntos-classroom/ | manual | LISTA (38 de 73 adjuntos recuperados, 35 faltan; 8 enunciados transcritos) | |
| 04 | Acertijos del sitio `pradomayor4eso` y carpetas de Drive de la web | tareas/tarea-04-sitio-antiguo-y-drive.md | ninguna | 40 min | MEDIO | 17 | salidas/04-sitio-antiguo-y-drive/ | manual | LISTA (0 fichas; sitio antiguo 404; Drive 3 de 9) | |
| 05 | Enlaces a Canguro, Agudeza y olimpiadas | tareas/tarea-05-enlaces-concursos.md | ninguna | 20 min | BAJO | 01 | salidas/05-enlaces-concursos/ | manual | LISTA (61 enlaces, todos 200; falta la URL de Agudeza) | |
| 06 | Fusionar y clasificar el catálogo de acertijos | tareas/tarea-06-catalogo.md | 02, 03 y 04 LISTAS | 75 min | ALTO | — | salidas/06-catalogo/ | manual | LISTA (184 fichas: si 129, enlazar 25, no 30; 71 con solución; 35 reclasificadas; dudas para Juan Luis en el INFORME) | |
| 07 | Escribir y comprobar las soluciones que faltan | tareas/tarea-07-soluciones.md | 06 LISTA | 90 min | ALTO | — | salidas/07-soluciones/ | manual | EN CURSO | s-20261124T002600-b155c411 · 2026-11-24T03:26:00Z |
| 08 | Página de acertijos con filtros | tareas/tarea-08-pagina-acertijos.md | ninguna | 60 min | MEDIO | — | salidas/08-pagina-acertijos/ | manual | LISTA | |
| 09 | Poner el catálogo revisado en la página | tareas/tarea-09-publicar-catalogo.md | 06, 07 y 08 LISTAS, y firma en `autorizaciones.md` | 25 min | MEDIO | — | salidas/09-publicar-catalogo/ | manual | BLOQUEADA (06 LISTA y 08 LISTA; faltan la 07 y la firma) | |
| 10 | Portada, plantilla de página de unidad y piloto (Unidad 2) | tareas/tarea-10-plantilla-y-piloto.md | ninguna | 60 min | ALTO | 16 | salidas/10-plantilla-y-piloto/ | manual | LISTA (plantilla = PROPUESTA: falta que Juan Luis la apruebe) | |
| 11 | Qué material de este curso va en cada página de unidad | tareas/tarea-11-manifiesto-materiales.md | ninguna | 25 min | BAJO | 05 | salidas/11-manifiesto-materiales/ | manual | LISTA (103 entradas: 89 claras, 14 en duda; U7 sin material) | |
| 12 | Carpeta de Drive «Web 1º ESO» con los PDF | tareas/tarea-12-drive-web.md | 11 LISTA, y firma en `autorizaciones.md` | 25 min | MEDIO | — | salidas/12-drive-web/ | manual | BLOQUEADA | |
| 13 | Aplicar la plantilla a las demás páginas de unidad | tareas/tarea-13-paginas-unidades.md | 10 LISTA con la plantilla aprobada por Juan Luis, y 12 LISTA | 90 min | MEDIO | — | salidas/13-paginas-unidades/ | manual | BLOQUEADA (10 LISTA, pero falta aprobar la plantilla; y falta la 12) | |
| 14 | Arreglar enlaces rotos y ordenar las páginas de enlaces | tareas/tarea-14-enlaces-y-transversales.md | 10 LISTA | 40 min | MEDIO | — | salidas/14-enlaces-y-transversales/ | manual | LISTA (5 páginas; quedan rotos solo en páginas de unidad) | |
| 15 | Incrustar la página de acertijos en Google Sites | tareas/tarea-15-incrustar-acertijos.md | 09 LISTA | 20 min | MEDIO | — | salidas/15-incrustar-acertijos/ | manual | BLOQUEADA | |
| 16 | Borrador de la página «Familias» | tareas/tarea-16-borrador-familias.md | ninguna | 30 min | ALTO | 10 | salidas/16-borrador-familias/ | manual | LISTA (borrador + 9 preguntas para Juan Luis; no va a la web hasta que lo apruebe) | |
| 17 | Banco de problemas de la web antigua (proporcionalidad y ecuaciones) | tareas/tarea-17-cantera-problemas.md | ninguna | 35 min | MEDIO | 04 | salidas/17-cantera-problemas/ | manual | LISTA (83+47 problemas; 2 errores de la web) | |
| 18 | Verificación final del borrador del sitio | tareas/tarea-18-verificacion.md | 13, 14 y 15 LISTAS | 35 min | ALTO | — | salidas/18-verificacion/ | manual | BLOQUEADA | |

Bandas hoy (de `proyecto.md`, escrito el 2026-11-23, pendiente de confirmar con el menú): ALTO = Opus 5.5, esfuerzo Alto ·
MEDIO = Sonnet 5.5, esfuerzo Medio · BAJO = Haiku 5.5, esfuerzo Medio.

Recurso `editor-sites` (tope 1), derivado de `hechos/recursos/`: libre (último: liberado 2026-11-23T18:42:31Z por la montadora). Lo usan las tareas 10, 13, 14 y 15.

## Registro de finalizaciones

Derivado de `hechos/terminadas/`. Una línea por fichero, más reciente arriba.

Formato: `LISTA · tarea NN · AAAA-MM-DD HH:MM · sid · recuento · ruta de la salida`

LISTA · tarea 06 · 2026-11-23 18:53 · s-20261123T184153-58e1a2ee · 184 fichas (si 129, enlazar 25, no 30; 71 con solución) · salidas/06-catalogo/
LISTA · tarea 02 · 2026-11-23 18:39 · s-20261123T182556-ba3c87df · 165 fichas (125 nuevas, 40 duplicados de Classroom) · salidas/02-fichas-dropbox/
LISTA · tarea 03 · 2026-11-23 18:32 · s-20261123T182608-89ae2d8c · 73 adjuntos: 38 recuperados en local, 35 faltan; 8 transcripciones · salidas/03-adjuntos-classroom/
LISTA · tarea 16 · 2026-11-23 18:29 · s-20261123T182647-7f338c08 · borrador de la página «Familias» (7 de 7 puntos) + 9 preguntas · salidas/16-borrador-familias/
LISTA · tarea 11 · 2026-11-23 18:28 · s-20261123T182516-30e9adcb · 103 entradas (89 claras, 14 en duda) · salidas/11-manifiesto-materiales/
LISTA · tarea 14 · 2026-11-23 18:34 · s-20261123T182806-6e8d9a11 · 5 páginas tocadas, 8 elementos caducados o rotos fuera · salidas/14-enlaces-y-transversales/
LISTA · tarea 10 · 2026-11-23 18:26 · s-20261123T180825-ade12f2f · plantilla de 7 apartados (propuesta) + portada y piloto U2 en el borrador, 7 capturas · salidas/10-plantilla-y-piloto/
LISTA · tarea 05 · 2026-11-23 18:25 · s-20261123T181741-730ebb0b · 61 enlaces, todos 200 (Canguro 25, SEMRM 36) · salidas/05-enlaces-concursos/
LISTA · tarea 17 · 2026-11-23 18:17 · s-20261123T181241-700b3a38 · 83 enunciados de proporcionalidad + 47 de ecuaciones · salidas/17-cantera-problemas/
LISTA · tarea 01 · 2026-11-23 18:17 · s-20261123T180910-16fc9b68 · 541 archivos: 221 convertidos, 314 solo listados, 5 no descargados, 1 fallido · salidas/01-dropbox-extraccion/
LISTA · tarea 04 · 2026-11-23 18:12 · s-20261123T181014-ef0ae619 · 0 fichas, 9 carpetas (3 leídas) · salidas/04-sitio-antiguo-y-drive/

## Incidencias de coordinación

Derivado de `hechos/incidencias/`. Choques encontrados y cómo se resolvieron: tareas
hechas dos veces, cierres en falso, copias en conflicto de la sincronización. Se
recogen aquí para que no se resuelvan dos veces y para que el próximo reparto corte
mejor.

- 2026-11-23T18:26 · s-20261123T182556-ba3c87df (tarea 02) y 2026-11-23T18:32 · s-20261123T182608-89ae2d8c (tarea 03): las salidas de la 01 y la 05 estaban en `salidas/` de la **raíz del repo** (no ignorada; repo público). **Resuelta** por la montadora (nota 2026-11-23T18:32:04Z): movidas a `reparto-web/salidas/`; en la raíz queda el enlace `salidas → reparto-web/salidas`, excluido en `.git/info/exclude`.

Los automatismos activos y las rutas del proyecto están en `proyecto.md`, no aquí: este
fichero se regenera entero y se los llevaría por delante.
