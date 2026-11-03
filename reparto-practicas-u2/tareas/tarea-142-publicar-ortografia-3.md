# Tarea 142 · Revisión con clics y lectura de todos los ítems, y publicación de «Palabras que se confunden» (67) y, si está LISTA, «Ampliación» (68); propuesta de los ★ de la U7 (paquete 5), la U8 y junio, y de cómo ofrecer la ampliación

Actualizado: 2026-11-03 (alta de la coordinadora s-20261103T110729-ca61fe3e)
Precondición: **138 LISTA · 141 LISTA** (misma `catalogo.js`; en cadena) · 139 LISTA si quiere publicarse aquí (si no, se publica después) · **no en paralelo con nada que toque `catalogo.js`** · Disparo: MANUAL (sesión atendida) · **Plazo: jue 15-4** (el ★ «¿Junto o separado?» es el lun 19-4, U7 · paquete 5)
Duración esperada: 1 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: 141 (antes)
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/142-publicar-ortografia-3/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/catalogo.js` (solo `disponible` de las filas 67 y, si procede, 68, y de lo que quedara reabierto y cerrado), `docs/practicas-ortografia.md` (§7), `README.md` (filas); y, solo para recortes de ≤ 5 ítems, `practicas/ortografia-palabras/logica.js` y `practicas/ortografia-ampliacion/logica.js` (declarándolo)

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
   printf 'sesión: %s\ntarea: 142\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/142--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/142--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 142 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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
7. Idempotencia: comprueba si los ficheros de «Ficheros que toca» ya existen o ya tienen
   parte del trabajo (de una sesión caída) antes de empezar. Si es así, léelos y continúa desde ahí.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/142--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Igual que la 140 y la 141, para **«Palabras que se confunden»** (★ del paquete 5 de la U7, de la U8 y de junio) y para
**«Ampliación»** si la 139 está LISTA (si no, se publica en otra tarea y no retrasa a la primera). La propuesta de ★ que
entrega esta tarea cubre el resto del curso, con el orden decidido el 3-11 (`proyecto.md`, «Tareas 134-143»):

| Paquete | ★ propuesto |
|---|---|
| U7 · 5 (lun 19-4) | `['ortografia-palabras', 1]` ¿Junto o separado? |
| U8 · 1 (lun 26-4) | `['ortografia-letras', 2]` b o v |
| U8 · 2 (lun 3-5, festivo: desde el mar 4-5) | `['ortografia-letras', 3]` g o j |
| U8 · 3 (lun 10-5) | `['ortografia-letras', 4]` Otras letras |
| U8 · 4 (lun 17-5) | `['ortografia-puntuacion', 2]` El punto y la coma |
| U8 · 5 (lun 24-5) | `['ortografia-puntuacion', 3]` Dos puntos, puntos suspensivos y el saludo |
| U8 · 6 (lun 31-5) | `['ortografia-palabras', 2]` Suenan igual, se escriben distinto |
| Junio · repaso 1 (lun 14-6) | `['ortografia-palabras', 3]` Números y símbolos |
| Junio · repaso 2 (lun 21-6) | `['ortografia-puntuacion', 4]` El correo al profesor |

Si en junio no hay tareas de la app, los dos últimos quedan como repaso libre y se dice. Y la **ampliación** nunca es ★: la
ENTREGA le propone a Juan Luis, en tres líneas, cómo ofrecerla: (a) una tarea `asignada: true` del panel para los alumnos
que él marque (es lo que mejor casa con «los más avanzados»); (b) sus ejercicios entre los «a elegir» de las tareas de la
U8; (c) solo en la portada, sin puntos. La decisión es suya; hasta que la tome, (c).

## Siguiente paso

1. Lee las ENTREGA de la 138 y la 139 (si existe), la de la 141 (qué publicó y qué dejó) y la de la 134.
2. `docs/practicas-ortografia.md` §6, «Reglas de contenido de la ortografía» y «Lo que nunca es distractor» de `$R/proyecto.md`.
3. `git fetch origin && git status -sb`; `npm test` antes de tocar nada.

## Qué hay que hacer

1. **Por cada bloque**: `node --test tests/practicas-ortografia-palabras` (y `ortografia-ampliacion.test.js`; `npm run servir` y http://localhost:8080/practicas/ortografia-palabras` (y `ortografia-ampliacion/
   con «Probar sin código» (nunca el código de un alumno ni AJJN); **cada ejercicio en los tres niveles** (`?nivel=1`,
   `?nivel=2`, `?nivel=3`), acertando y fallando, mirando que el feedback dice la regla con la palabra o la frase del ítem y
   que tras un fallo la buena queda a la vista; a 375 px y en ventana ancha; la etiqueta de nivel visible; `error` y
   `respuesta` llegan a `api.responder` al fallar (consola: la base los registra; sin código no sube nada a la nube).
2. **Leer el banco entero** de cada ejercicio en su `logica.js`, ítem a ítem, con la lista «Lo que nunca es distractor» de
   `proyecto.md` al lado y la regla de oro de la ortografía (regla 2): para cada ítem, ¿la otra opción es **inequívocamente**
   falsa en esa frase? ¿Hay alguna lectura en la que valdría? ¿Es una forma que la RAE admite? ¿El nivel 3 es «más allá» y no
   «dudoso»? Lo dudoso se apunta con su ítem exacto. **Criterio: si dudas, fuera.** Cotéjalo en `dle.rae.es`, `rae.es/dpd/` o
   `fundeu.es` antes de darlo por malo o por bueno, y anota la fuente.
3. **Realismo y nombres**: frases posibles, nada ofensivo, nombres inventados (`npm test` pasa el test de nombres si la carpeta
   de datos está; si no está, mira tú la lista de nombres de los bancos contra el sentido común: ningún nombre poco común).
4. **Veredicto por bloque**: SE PUBLICA (cero ítems dudosos, o solo ítems que se pueden quitar sin dejar un nivel por debajo
   de los mínimos de la regla 3) o NO SE PUBLICA. Lo que se quita se quita **aquí**, en esta tarea, si son ≤ 5 ítems por
   bloque y no hay que escribir ninguno nuevo (es un recorte, no contenido: toca el `logica.js` del bloque, lo declaras en la
   terminada y en la ENTREGA, y `npm test` tiene que seguir en verde con los mínimos); si hay que escribir ítems nuevos o
   quitar más de 5, el bloque no se publica y escribes `$R/hechos/reabiertas/138 o 139--<sid>.md` con la lista exacta de ítems
   y motivos (NNN = la tarea del bloque), y lo dices al usuario: la coordinadora da de alta el publicador o lo hace la
   siguiente tarea de publicación si llega a tiempo.
5. **Publicar**: `disponible: true` en la fila de cada bloque que SE PUBLICA (solo ese campo), `docs/practicas-ortografia.md`
   §7 («Qué hay publicado»: bloque, fecha, ejercicios, ítems por nivel) y las filas de la tabla de prácticas de `README.md`.
   `npm test` entero en verde. Tras el push, comprueba en https://salasgar.github.io/Ejercicios-interactivos/practicas/
   (1-2 min; recarga forzada) que la sección «Ortografía» enseña los bloques publicados y que cada uno carga.
6. **Propuesta de ★** en la ENTREGA, con las líneas literales para el editor del panel (`['ortografia-palabras` (y `ortografia-ampliacion', n]`, el nombre del
   ejercicio y el título sugerido de la semana) y la tabla «Para la tarea del panel de la unidad» (semana, ejercicio, bloque
   publicado sí/no). Si un bloque NO SE PUBLICA, la propuesta dice qué ★ se queda sin ejercicio y qué alternativa hay (un
   ejercicio de `ortografia`, el 45, repetido como repaso, o el siguiente del plan).
7. **Dos salidas separadas** en la ENTREGA: el **veredicto** contra los criterios de arriba y solo contra ellos, y los
   **hallazgos fuera de criterio** (lo que observes y no estaba previsto: un ejercicio que aburre, un nivel 3 demasiado
   fácil, una regla que choca con lo que da el profesor de Lengua…), dichos al usuario en el mensaje de cierre como decisión
   pendiente, no enterrados en el informe.
8. Recuérdale a Juan Luis en el mensaje de cierre que la tabla de ★ del calendario del curso
   (`apuntes-1eso-bilingue/comun/CALENDARIO-CURSO-2026-27.md`, «Ortografía en las tareas semanales de la app») **no se edita
   desde este reparto** (condición de `autorizaciones.md`): la actualiza él o una sesión de los apuntes con la tabla de tu
   ENTREGA.
9. **Propio de este bloque**: es el que más dobles formas válidas puede esconder (treintaiuno, enseguida, asimismo, adonde,
   undécimo, onceavo, 12.000, 5%, 1º…): comprueba **cada** ítem de «Números y símbolos» y de «¿Junto o separado?» contra la
   lista negra y, en los símbolos, contra lo que escriben las hojas del curso (una hoja de `apuntes-1eso-bilingue/*/hojas-de-ejercicios/`,
   solo lectura): lo que el curso escribe de una manera no puede ser «mal» en la app.
10. Si la 139 no está LISTA, dilo en la ENTREGA y en el mensaje de cierre: la coordinadora da de alta su publicador cuando cierre.

## Datos de entrada

- `$R/salidas/138-ortografia-palabras/ENTREGA.md`, `$R/salidas/139-ortografia-ampliacion/ENTREGA.md` (si existe), `$R/salidas/141-publicar-ortografia-2/ENTREGA.md`, `$R/salidas/134-base-ortografia/ENTREGA.md` (solo lectura).
- `practicas/ortografia-palabras/*`, `practicas/ortografia-ampliacion/*` y sus tests (solo lectura salvo el recorte de ≤ 5 ítems).
- `$R/proyecto.md` («Tareas 134-143»), `docs/practicas-ortografia.md`.
- `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/comun/CALENDARIO-CURSO-2026-27.md` (solo lectura: los paquetes de la U7 y la U8 y la semana libre de junio).
- Para dudas: `dle.rae.es`, `rae.es/dpd/`, `fundeu.es` (solo lectura).

## Cómo saber que ha terminado

- Veredicto escrito por bloque; para lo publicado, `disponible: true`, docs §7 y README; `npm test` en verde; la portada publicada lo enseña.
- La ENTREGA lleva el veredicto con los ítems leídos y quitados con su fuente, los hallazgos fuera de criterio, la tabla de ★ de la U7
  (paquete 5), la U8 y junio con las líneas literales, y la propuesta de cómo ofrecer la ampliación (a/b/c).

## Trampas conocidas

- Las de la 140 y la 141.
- El lunes 3-5 es festivo: el paquete 2 de la U8 empieza el martes 4-5; la propuesta nombra paquetes.
- Si Juan Luis elige (a) para la ampliación, la tarea `asignada` la monta él en el editor del panel (como la 116 y la 121, con
  Claude en Chrome si lo pide): no es cosa de esta tarea, y los nombres de los alumnos marcados no van a ningún fichero.

## Prohibido (propio de esta tarea)

- Lo mismo que la 140. Y proponer la ampliación como ★ de ninguna semana.

## Salida esperada

- `catalogo.js`, `docs/practicas-ortografia.md` §7 y `README.md` comiteados.
- `reparto-practicas-u2/salidas/142-publicar-ortografia-3/ENTREGA.md` y su marcador `ENTREGA.md.ok-<sid>`; reabiertas si las hay.

## Reglas de contenido de la ortografía (copia de `proyecto.md`, «Reglas de contenido de la ortografía»; lo común no se lee, por eso va aquí)

Las reglas comunes 4 (regla de oro), 8 (feedback ligado al ítem) y 9 (realismo) de `proyecto.md` valen igual. Y además:

1. **Solo español.** `idioma: 'es'` en `arrancar`; `nombre` y `detalle` de cada ejercicio en `{ es, en }` (el `en`
   empieza por «Spanish spelling: …», como en `practicas/ortografia/textos.js`): los usan la portada y la tarea semanal.
2. **Regla de oro, versión ortografía.** Ninguna opción puede ser también correcta. **Nunca** como hueco ni como distractor
   dos formas que la RAE admita las dos (la lista «Lo que nunca es distractor» de `proyecto.md`; cópiala al test como lista
   negra). Si la forma correcta depende del sentido, el contexto de la frase tiene que **forzar una sola** lectura; si no se
   consigue, la frase se descarta o va como «¿qué frase dice esto?» (el patrón de los ejercicios 7 y 8 de `ortografia`).
   Al añadir una frase, léela con todas las opciones puestas.
3. **Tres niveles por ejercicio**, con `nivel: 1 | 2 | 3` en cada ítem del banco y `elegirDeNivel` de
   `practicas/_comun/nivel.js` (tarea 134): **1** = lo que todo alumno de 1.º ESO tiene que dominar y lo que más falla en
   sus textos; **2** = el resto de lo que marca 1.º ESO; **3** = más allá de 1.º ESO (lo de 2.º-3.º: excepciones, cultismos,
   reglas finas), siempre con una sola respuesta defendible. Cada nivel con **≥ 16 ítems** (≥ 12 si el ejercicio es de tocar
   piezas o tiene tres o más opciones) y **equilibrado**: ningún botón acierta más del 60 % de las veces dentro de su nivel.
   El test lo comprueba por fuerza bruta (≥ 3000 ítems por ejercicio con `sesion` simulada en cada nivel) y comprueba
   también que el generador **nunca da un ítem de nivel superior** al que dice `nivelDe(sesion)`.
4. **Frases de la vida del instituto y de casa**, cortas (≤ 14 palabras), con nombres de persona **inventados** (nunca de
   alumnos reales: lo vigila `tests/sin-nombres-de-alumnos.test.js` cuando la carpeta de datos está) y sin datos reales;
   nada ofensivo ni que ridiculice a nadie. El realismo de la regla 9 vale para las situaciones.
5. **Feedback ligado al ítem**: la regla aplicada a **esa** palabra o frase («“lápiz” es llana, lá-piz, y acaba en z, que no
   es n ni s: lleva tilde»), con la forma buena en `<b>` y, tras un fallo, la buena a la vista en el hueco o tachando la mala
   (como hace `montarRevision` de `ortografia`). Nunca una regla genérica sola.
6. **`error` de `api.responder`**: identificador corto y **estable por confusión**, no por frase (`v-por-b`,
   `sin-tilde-llana`, `mayuscula-en-mes`): minúsculas, cifras y guiones, ≤ 40 caracteres (patrón `^[a-z0-9-]{1,40}$`);
   `respuesta`: lo que puso el alumno. Es lo que el panel agrupa en «Qué falla más».
7. **Palabras de uso en 1.º ESO** (nada raro ni técnico salvo en el nivel 3 y con su explicación); las de Matemáticas, del
   vocabulario de las unidades del curso (números naturales, divisibilidad, enteros, fracciones, decimales, álgebra,
   proporcionalidad, geometría).
8. **Dudas**: `dle.rae.es`, el Diccionario panhispánico de dudas (`rae.es/dpd/`) y `fundeu.es`, solo lectura. Lo que la RAE
   admita de dos maneras, fuera; lo dudoso, fuera; lo que un libro de texto viejo diga distinto que la Ortografía de 2010
   (guion, solo, demostrativos), fuera.
9. **Nada de gramática** (leísmo, dequeísmo, concordancia, «si tendría») salvo lo que la ficha de la ampliación nombre, y
   nada de separación silábica a final de línea.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; un ejercicio a medias se
queda como esqueleto «En construcción», nunca registrado a medias), commitea tus rutas con
el mensaje «Tarea 142, a medias», escribe `$R/hechos/notas/<sid>-traspaso-142.md` con el
estado exacto (qué está hecho, qué falta, qué has descubierto, en qué orden seguir),
`$R/hechos/fallos/142--<sid>.md` con `parada por: sesión agotada` y la ruta de esa nota, y
`ABANDONADA` en tu reclamo. **Esta tarea es larga a propósito y está pensada para que una
sesión pueda parar entre dos ejercicios**: cada ejercicio es un módulo propio y la
siguiente sesión sigue por el primero que falte.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/142--<sid>.md` con `parada por: mal cortada`
y la ruta de la incidencia, `ABANDONADA` en tu reclamo, y díselo al usuario. Si un paso te
pide **decidir** algo que va a durar (un cambio del contrato de la base, otro número de
ejercicios que el del catálogo, otros umbrales de nivel para todas las prácticas) y esta
tarea no es de banda ALTA con el usuario delante, no lo decidas: entrégalo como propuesta en
tu terminada y sigue con lo que no dependa de ello.

## Al terminar

Por este orden (el del repositorio git):

1. `node --test tests/practicas-comun.test.js tests/practicas-ortografia-palabras.test.js tests/practicas-ortografia-ampliacion.test.js` en verde y `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con
   reclamo vivo no es tuyo: anótalo en la terminada). La revisión con clics del paso 1 de «Qué hay que hacer» es la prueba en el navegador: ya hecha al llegar aquí.
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas:
   `git add <rutas> && git commit -m "Tarea 142: publicados ortografia-palabras y ortografia-ampliacion (o lo que diga el veredicto)" -- <rutas>`. Apunta el hash
   (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/142-publicar-ortografia-3/ENTREGA.md` (ficheros entregados, hash, URL local, qué hay en cada
   ejercicio y nivel, decisiones y propuestas, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/142--<sid>.md`: hash del commit, ficheros (lo que dice
   `git show --stat`, no lo que crees), número de tests propios en verde, hora y
   **duración real** (de `abierto:` a ahora), y propuestas pendientes si las hay.
5. Añade `CERRADA` a tu reclamo (línea propia que empieza por esa palabra).
6. Choques encontrados → `$R/hechos/incidencias/<sid>.md`.
7. `git fetch origin`, relista `$R/hechos/` **ahora** y regenera `$R/_ESTADO.md` entero
   (o retoque de tus filas y del registro si hay otras sesiones en el árbol): todas las filas,
   el registro con una línea por fichero de `terminadas/`, banda y «encadenable» recopiadas
   de las fichas, leyenda de bandas de `proyecto.md`. Anota qué tareas pasan de BLOQUEADA a
   PENDIENTE. Si tu duración real difiere mucho de la estimada, díselo al usuario.
8. Vuelca abajo, en «Trampas conocidas» de esta ficha, lo que hayas aprendido por las
   malas (es lo único de la ficha que editas, además de la duración).
9. Un solo commit con rutas explícitas de tus ficheros de `$R/hechos/` (por sid), tu
   carpeta de `$R/salidas/`, `$R/_ESTADO.md` y esta ficha, y `git push origin main`. Si el
   push se rechaza: `git pull --rebase origin main`, regenera el tablón otra vez desde
   `hechos/` (no lo fusiones a mano) y vuelve a comitear y empujar.
10. Dile al usuario la **foto del momento** en tres líneas («EN CURSO: … · LIBRES ahora: … ·
    BLOQUEADAS: …»), sacada de la lectura de `hechos/` del paso 7, y después, **solo para las
    LIBRES**, las frases de arranque de `proyecto.md` literales, en bloques de cita, una por
    sesión que quepa a la vez, con la tarea o la cadena, la banda traducida y el nombre de
    sesión delante.
11. Decide si encadenas (solo en verde: misma banda, tarea corta, sin esperas; si tu frase
    de arranque nombra la cadena, encadenas por defecto) o paras. Si encadenas, «Antes de
    empezar» entero otra vez, con reclamo nuevo, y di el nombre nuevo que te toca.

Si paras sin terminar: `$R/hechos/fallos/142--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni
  `practicas/_comun/` (salvo las tareas de base —01, 79, 98, 122 y, en la ortografía, la 134— y
  las de publicación —93-96, 109-111, 115, 117-120, 130-131 y, en la ortografía, 140-142—, cada
  una en lo que declara), ni `css/estilos.css`, ni `README.md` (salvo las de base y publicación),
  ni `firestore.rules` ni `src/firebase.js` (salvo 01), ni fichas ajenas, ni nada de la carpeta
  de apuntes de iCloud. Si la base te falta algo, se propone en la terminada; no se parchea.
- `git add .`, `git add -A`, `git commit -a`, o un `add` separado del `commit`. El índice
  es compartido con otras sesiones del mismo árbol.
- Editar el código con `sed -i` o heredocs desde el shell: el candado de sesiones solo
  ve Edit/Write, y así otra sesión no sabe que el fichero está en uso. El código se edita
  con las herramientas de edición; `hechos/` sí se escribe desde el shell (un escritor).
- Reescribir un fichero de `hechos/` (solo `>>`), editar un reclamo ajeno, o regenerar el
  tablón de memoria sin relistar `hechos/`.
- Dependencias nuevas (npm, CDN): la app no tiene build y solo carga KaTeX y Firebase por
  CDN; las prácticas no usan ni siquiera KaTeX.
- Las reglas de contenido de la ortografía (sección propia de esta ficha y «Reglas de contenido
  de la ortografía» en `proyecto.md`): dos formas que la RAE admita, nunca como hueco ni como
  distractor; una sola respuesta defendible por ítem; frases con nombres inventados.
