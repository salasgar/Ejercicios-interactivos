# Tarea 57 · Diseño (con Juan Luis) de la app para varios profesores con separación estricta: cada profesor, sus alumnos, sus tareas y sus fechas

Actualizado: 2026-10-17
Precondición: 51, 52 y 53 LISTAS (el diseño se hace sobre el código real del modelo de tareas v2, no sobre el papel). Es diseño: no toca código. La implementación saldrá en fichas nuevas que esperarán a la 55 · Disparo: MANUAL (sesión atendida, CON Juan Luis delante: hay decisiones suyas)
Duración esperada: 2 h (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/57-diseno-varios-profesores/` (el documento de diseño `DISENO.md`, `ENTREGA.md` y su marcador)
Ficheros que toca (ninguna otra tarea en paralelo los toca): solo su carpeta de salida. **No toca `practicas/`, `firestore.rules`, `src/` ni `docs/`**: el diseño se aprueba antes de implementar.

La duración esperada no es informativa: de ella sale la caducidad del reclamo (2 ×, mínimo
45 min), el plazo tras el cual otra sesión puede relevarte si te cortas. **Este fichero es
la fuente de la banda**: el tablón la copia de aquí cada vez que se regenera. La banda
dice con qué modelo conviene abrir la sesión; la tabla de bandas de `proyecto.md` la
traduce al menú de hoy (ALTO = Opus 5, esfuerzo Alto; MEDIO = Sonnet 5, esfuerzo Medio).

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
   printf 'sesión: %s\ntarea: 57\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/57--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/57--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 57 con `abierto:` más antiguo (o igual y sid menor), añade a tu
   reclamo una línea `CEDIDA a <sid del otro>` y elige otra tarea.
5. Si el reclamo que encuentras está caducado (RELEVABLE en el tablón), relévalo con la
   línea `releva a: <sid anterior>` **en tu propio reclamo**; el suyo no se toca. Después
   mira qué dejó hecho: `ls practicas/`, `git log --oneline -5`, `git status -sb`, y la
   carpeta de salida. Lo que haya con tests en verde se hereda y se dice en la terminada;
   lo que no, se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** (todas las filas contra `hechos/` y la
   hora real; banda y «encadenable» recopiadas de las fichas) antes de empezar, y sigue
   con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.
7. Idempotencia: comprueba si `practicas/<tu slug>/` o tu test ya existen (de una sesión
   caída) antes de crearlos. Si existen, léelos y continúa desde ahí.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/57--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

Juan Luis, el 2026-10-17: *«Tengo compañeros que también dan clase en 1º de ESO y me gustaría que ellos pudieran usar la app con sus alumnos. ¿Cómo puedo hacer para que ellos puedan acceder a la app como profesores, agregar a sus alumnos y hacer seguimiento de su progreso sin que se mezclen los datos de sus alumnos con los datos de los míos?»*

Sus respuestas a la coordinadora, ese mismo día (decididas, no se rediscuten):

1. **Cada profesor tiene sus tareas y sus fechas.** Nada de un `tareas.js` común para todos.
2. **Separación estricta.** No basta con que el panel filtre: un profesor no puede poder leer los datos de los alumnos de otro, ni con conocimientos técnicos.
3. **Tamaño:** en principio, 3 compañeros además de él, con menos de 30, menos de 60 y unos 100 alumnos. Ningún profesor pasará nunca de 200 alumnos.
4. **Sin prisa.** La app «aún está en construcción»; los compañeros empezarán cuando esté lista.

Esta tarea produce **el diseño**, aprobado por Juan Luis, y la **lista de tareas de implementación**, que la coordinadora dará de alta después. No implementa nada.

## Lo que hay hoy (comprobado por la coordinadora el 17-10; verifícalo, que la 51-53 lo habrán cambiado)

- **Un solo profesor**, con su uid escrito en `firestore.rules` (`esProfesor()`) y en `src/config.js` (`PROFESOR_UID`). Solo él puede listar colecciones.
- **El alumno es un código de 4 caracteres** (`codigoAlumno(indice)` en `practicas/_comun/codigos.js`), sacado de su número de lista con una sal **pública** (`'divisores/1eso/2026-27'`) y con 1024 códigos válidos en total (`MAX_ALUMNOS`). Los 51 alumnos de Juan Luis usan los números 1 a 51, y sus enlaces (`semana.html?t=1&c=<código>`) ya están repartidos por correo y en Classroom.
- **Cualquiera puede leer el progreso de cualquier alumno.** Las reglas permiten un `get` sin autenticar con el id del documento (`practicas/<slug>--<código>`, `practicas-tareas/t<id>--<slug>--<código>`, `practicas-asignaciones/<código>`), y los 1024 códigos se pueden calcular con el código público. Es lo que hace `herramientas/informe-actividad.mjs` (REST sin autenticar). Hoy no importa porque en la nube solo hay números, sin nombres. **Con la separación estricta (punto 2) esto no vale**: es el primer problema que tiene que resolver el diseño.
- **Los nombres de los alumnos viven solo en el navegador del profesor** (lista del panel, `practicas/profesor.js`, `nombres()`). Nunca suben a la nube. Hay que conservarlo.
- **Las tareas y su calendario** (`practicas/_comun/tareas.js`: `TAREAS`, `UNIDADES`, fechas `desde`/`hasta`) son un fichero del repositorio que hoy edita a mano una sesión de Claude. Los compañeros no pueden editarlo.
- **El catálogo de prácticas** (`catalogo.js`) es común, y debe seguir siéndolo: la app es la misma para todos.
- `fallos/` (registro de cada fallo) lleva el código del alumno, y lo lee solo el profesor.
- Hay además una aplicación antigua con cuentas (`src/`, colecciones `alumnos/`, `tareas/`, `credenciales/`) y la práctica `divisores/`, que usa los mismos códigos.

## Siguiente paso

1. Lee `reparto-practicas-u2/salidas/45-diseno-tareas-v2/DISENO.md` entero (es el modelo que esto amplía) y `docs/practicas-unidad2.md` (el contrato de la base, al día tras la 55 o, si no ha cerrado, tras la 53).
2. Después lee el código: `firestore.rules`, `src/firebase.js`, `src/config.js`, `practicas/_comun/{codigos,nube,base,tareas,registro}.js`, `practicas/{semana,portada,profesor,resultados}.js` y `herramientas/informe-actividad.mjs`.
3. Escribe el diseño por apartados (abajo) **como propuesta con alternativas donde las haya**, y resuelve con Juan Luis en la conversación lo marcado como decisión suya. Las preguntas, en sus términos: qué cambia para él, para sus compañeros y para sus alumnos, no en nombres de colecciones (ver «Trampas»).

## Qué hay que decidir y escribir en `DISENO.md`

A. **Quién es profesor.** Propuesta: cuenta de Google (la de murciaeduca de cada uno). Una colección `practicas-profesores/{uid}` que solo escribe Juan Luis (administrador, su uid en las reglas). Las reglas dejan a cada profesor leer y escribir solo lo suyo. Decisión de Juan Luis: si él puede ver los datos de sus compañeros (como administrador) o tampoco (propuesta: tampoco; solo da de alta y de baja).

B. **Cómo se identifica el alumno y a qué profesor pertenece.** Es el núcleo, por el problema de «Lo que hay hoy». Hay que comparar al menos:
   - **B1. Códigos secretos por profesor.** Códigos aleatorios largos (por ejemplo 8-10 caracteres sin I, O, 0 ni 1). Los genera el panel de cada profesor, que guarda en la nube la lista de códigos de sus alumnos (sin nombres). Los ids de los documentos los llevan, y el `get` sin autenticar sigue funcionando: no se pueden adivinar. Ventaja: el alumno sigue sin cuenta y sigue entrando con un enlace. Coste: códigos más largos de teclear, y el profesor tiene que listar «sus» documentos (¿subcolección por profesor, `practicas-profes/{uid}/…`?).
   - **B2. Alumno con sesión anónima de Firebase** ligada a un código de clase. Valorar qué pasa al cambiar de aparato (hoy se sigue desde cualquier aparato con el código, tarea 38).
   - **B3. Cuentas de Google de los alumnos.** Probablemente descartable: no todos tienen, y hoy entran sin cuenta.
   Decisión de Juan Luis, con pros y contras en llano.

C. **Dónde viven los datos de cada profesor.** Para cada colección (`practicas`, `practicas-tareas`, `practicas-asignaciones`, `fallos`, y las tareas del punto D): ruta nueva y reglas. Requisito: un profesor solo puede **listar** lo suyo, y nadie puede leer nada que no pueda nombrar con un id imposible de adivinar. Incluir **las reglas escritas en borrador** y cómo probarlas: con el emulador de Firestore si está disponible y, si no, con la lista de comprobaciones REST que hará la tarea de reglas, como hizo la 49.

D. **Tareas y calendario por profesor.** Las tareas pasan a la nube, una lista por profesor, con `UNIDADES` y fechas también por profesor. El panel necesita un **editor de tareas**: elegir unidad, ★ y ejercicios de elegir del catálogo común, fechas y asignación. Propuesta para no empezar de cero: «copiar las tareas de Juan Luis» como plantilla, cambiando solo las fechas. Decisiones de Juan Luis: si sus tareas siguen en `tareas.js` (propuesta: no, él también pasa a la nube; `tareas.js` queda solo como plantilla y para la tarea 1) y qué puede tocar un compañero.

E. **Migración de Juan Luis sin romper nada.** Sus 51 alumnos tienen códigos de 4 caracteres y enlaces repartidos, y la tarea 1 lleva `progresoPorPractica: true`. Opciones: (a) Juan Luis se queda con el esquema actual hasta fin de curso y solo los profesores nuevos usan el nuevo; (b) migrar sus datos y reenviar los enlaces en una fecha que él elija (¿un cambio de trimestre?). Decisión de Juan Luis. Ojo: mientras quede algo en el esquema actual, sus datos siguen siendo legibles con el código público. Hay que decírselo claro.

F. **Lo que cambia alrededor.**
   - El panel: entrar con Google, ver solo lo suyo, la lista de nombres en su navegador como hoy (¿o cifrada en la nube para usarla desde varios aparatos? Propuesta: no; como hoy).
   - La portada y la página de la tarea: qué tareas ve el alumno, según su profesor.
   - El informe diario (`herramientas/informe-actividad.mjs` y la rutina de la nube): ¿solo para Juan Luis, o uno por profesor? Ya no puede leer sin autenticar.
   - `divisores/`.
   - La aplicación antigua de `src/` (propuesta: fuera de alcance, salvo que él diga otra cosa).
   - El correo con los códigos (hoy es un script local de Juan Luis): cómo reparte cada compañero los suyos.
   - Las cuotas del plan gratuito de Firebase (lecturas al día con unos 400 alumnos y 4 paneles; el panel no debe leer la colección entera).
   - `docs/` y el README.

G. **Protección de datos.** En la nube solo habría códigos, nunca nombres. Anótalo, y anota como pendiente de Juan Luis consultar en el centro si se puede usar su proyecto de Firebase con alumnos de otros profesores. No es una decisión técnica: no la tomes tú.

H. **Calendario y lista de tareas de implementación.** Cada tarea con los ficheros que toca, banda, duración y dependencias, para que la coordinadora las dé de alta tal cual. Hay que contar con que la Unidad 3 empieza el 16-11 y su reparto (PU3) se diseña la última semana de octubre y se construye la primera de noviembre: propón cuándo encaja esto sin pisar eso. Decisión de Juan Luis: la fecha en que los compañeros empiezan.

## Datos de entrada

Solo lectura: todo lo listado en «Siguiente paso»; `reparto-practicas-u2/proyecto.md` (reglas del reparto); `reparto-practicas-u2/hechos/notas/s-20261017T065935-3ecc253b.md` (nota de la coordinadora con el alta de esta tarea); `reparto-practicas-u2/hechos/terminadas/49--*.md` (cómo se comprobaron las reglas por REST).

## Cómo saber que ha terminado

- `DISENO.md` tiene los apartados A-H. Cada decisión está marcada como «decidido por Juan Luis el <fecha>» o «propuesta pendiente», el apartado C lleva las reglas en borrador y la lista H está completa.
- Juan Luis ha dicho en la conversación que aprueba el diseño (o qué apartados quedan pendientes); se anota en `ENTREGA.md`.

## Trampas conocidas

- **Los 1024 códigos actuales se pueden calcular a partir del código público.** Cualquier diseño que siga usando `codigoAlumno` para los alumnos nuevos incumple la separación estricta, aunque las reglas «filtren por profesor».
- Los enlaces repartidos a los 51 alumnos de Juan Luis (`semana.html?t=1&c=<código>`, `semana.html?t=1`) no pueden dejar de funcionar sin un aviso y una fecha que decida él.
- El panel lee la colección `practicas` partiendo el id por `--` (`resultados.js`): lo nuevo va en colecciones aparte, con el prefijo `practicas-` (en las mismas reglas ya existen `tareas/` y `alumnos/` de la aplicación antigua).
- A Juan Luis una pregunta técnica le resulta opaca (lección de la 45): explica en llano qué cambia para él, para sus compañeros y para los alumnos.
- La 45 duró unos 40 minutos con tres rondas de preguntas; esta tiene más decisiones (B y E son de peso). No las precipites: si él duda, déjalas como «propuesta pendiente» con tu recomendación.
- (s-20261017T085824-72f01790, al cerrar) Al pedirle que apruebe un documento, dale **la ruta completa** del fichero en el mismo mensaje: la primera vez contestó «¿dónde está el archivo?». Tres rondas de preguntas (cuatro, cuatro y una) bastaron; duró ~1 h 20 min.
- (ídem) Este Mac **no tiene Java** (`java -version` falla), así que no hay emulador de Firestore; Juan Luis prefirió no instalarlo. Las reglas de la implementación se prueban por REST en el proyecto real, como en la 49.
- (ídem) `_ESTADO.md` estuvo reservado por el candado de otra sesión desde el reclamo hasta el cierre: se regenera al cerrar, como dice el tablón.

## Prohibido (propio de esta tarea)

- Implementar: ni código, ni reglas, ni documentación del repositorio. Solo `DISENO.md`.
- Publicar o probar reglas en el proyecto real de Firebase.
- Decidir en nombre de Juan Luis lo marcado como decisión suya; si no está en la conversación, queda como «propuesta pendiente».
- Escribir en el diseño nombres de alumnos o de compañeros, o los códigos reales: el repositorio es público.

## Salida esperada

- `reparto-practicas-u2/salidas/57-diseno-varios-profesores/DISENO.md`, `ENTREGA.md` y su marcador.
- En la terminada: la lista H resumida, para que la coordinadora dé de alta las fichas.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 57, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-57.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/57--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/57--<sid>.md` con `parada por: mal cortada`
y la ruta de la incidencia, `ABANDONADA` en tu reclamo, y díselo al usuario. Si un paso te
pide **decidir** algo que va a durar (un cambio del contrato de la base, otro número de
ejercicios que el del catálogo, una colección nueva en Firestore) y esta tarea no es de
banda ALTA con el usuario delante, no lo decidas: entrégalo como propuesta en tu terminada
y sigue con lo que no dependa de ello.

## Al terminar

(Esta tarea no tiene código: en los pasos 1 y 2, en lugar de tests y commit de código, basta con que `DISENO.md` esté escrito y comiteado con rutas explícitas.)

Por este orden (el del repositorio git):

1. `node --test tests/practicas-comun.test.js tests/practicas-<tu slug>.test.js` en verde y
   `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con reclamo vivo no
   es tuyo: anótalo en la terminada). Prueba la práctica en el navegador con
   `npm run servir` y http://localhost:8080/practicas/<slug>/ (los módulos ES no cargan
   abriendo el fichero), en una ventana estrecha (375 px) y en una ancha, en español y en
   inglés, y haz al menos un ítem de cada ejercicio acertando y fallando.
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas:
   `git add <rutas> && git commit -m "Práctica <slug>: <qué>" -- <rutas>`. Apunta el hash
   (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/57-diseno-varios-profesores/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/57--<sid>.md`: hash del commit, ficheros (lo que dice
   `git show --stat`, no lo que crees), número de tests propios en verde, hora y
   **duración real** (de `abierto:` a ahora), y propuestas pendientes si las hay.
5. Añade `CERRADA` a tu reclamo (línea propia que empieza por esa palabra).
6. Choques encontrados → `$R/hechos/incidencias/<sid>.md`.
7. `git fetch origin`, relista `$R/hechos/` **ahora** y regenera `$R/_ESTADO.md` entero:
   todas las filas, el registro con una línea por fichero de `terminadas/`, banda y
   «encadenable» recopiadas de las fichas, leyenda de bandas de `proyecto.md`. Anota qué
   tareas pasan de BLOQUEADA a PENDIENTE. Si tu duración real difiere mucho de la estimada,
   díselo al usuario.
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

Si paras sin terminar: `$R/hechos/fallos/57--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni
  `practicas/_comun/` (salvo la tarea 01), ni `css/estilos.css`, ni `README.md` (salvo
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
  CDN; las prácticas no usan ni siquiera KaTeX (exponentes con `<sup>`).
- Las reglas de contenido de `proyecto.md`: «factor» por «divisor», HCF en vez de GCD, `×`
  en vez de `·`, letras o ecuaciones, «primos entre sí», distractores que puedan ser
  verdad, excluir el 0 de los múltiplos, preguntar «múltiplo de 0».
