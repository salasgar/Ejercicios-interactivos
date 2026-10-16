# Tarea 45 · Diseño (con Juan Luis) del modelo de tareas v2: unidades, tres estados de tarea, asignación a alumnos y progreso por tarea

Actualizado: 2026-10-16
Precondición: ninguna (es diseño: no toca código; la implementación saldrá en fichas nuevas que sí esperarán a la 44) · Disparo: MANUAL (sesión atendida, CON Juan Luis delante: hay decisiones suyas)
Duración esperada: 2 h (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/45-diseno-tareas-v2/` (el documento de diseño `DISENO.md`, `ENTREGA.md` y su marcador)
Ficheros que toca (ninguna otra tarea en paralelo los toca): solo su carpeta de salida. **No toca `practicas/` ni `docs/`**: el diseño se aprueba antes de implementar.

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
   printf 'sesión: %s\ntarea: 45\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/45--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/45--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 45 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/45--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

Juan Luis decidió el 2026-10-16, revisando la app, tres cosas que cambian la base:

1. **Cada unidad didáctica tiene su pool de prácticas y sus tareas.** Hoy el catálogo y las
   tareas (`practicas/_comun/tareas.js`) no saben de unidades; la portada agrupa a mano con
   `BLOQUES` (`practicas/portada.js`). Hacen falta un campo `unidad` en el catálogo y en las
   tareas, y una portada por unidades. Las tareas de la U1 (que no existen) son sobre todo
   para el curso que viene, y mientras tanto repaso.
2. **Una tarea puede estar en tres estados**: repaso sin plazo (visible, voluntaria),
   obligatoria para todos con plazo, u **obligatoria solo para algunos alumnos** (los que él
   elija). Lo tercero no existe: exige que el profesor asigne tareas a códigos concretos y
   que la app lo lea.
3. **El progreso se guarda por tarea, no por ejercicio**: hoy un ejercicio terminado en la
   semana 1 sale ya terminado si se repite en la semana 3 (`practicas/<slug>--<código>`,
   un documento por práctica). Él quiere poder volver a mandar un ejercicio ya hecho y que el
   alumno lo haga de nuevo. La práctica libre (fuera de tareas) sigue teniendo su progreso.

Además, un mismo ejercicio puede ir en varias semanas y una tarea puede llevar ejercicios de
unidades anteriores (esto ya funciona).

Esta tarea produce **el diseño**, aprobado por Juan Luis, y la **lista de tareas de
implementación** que la coordinadora dará de alta después (46+). No implementa nada.

## Siguiente paso

1. Lee `docs/practicas-unidad2.md` entero (es la documentación del contrato de la base), y
   después `practicas/_comun/base.js` (progreso, `claveProgreso`, `leerYFusionar`, `semana`),
   `practicas/_comun/nube.js`, `practicas/_comun/tareas.js`, `practicas/semana.js`,
   `practicas/portada.js`, `practicas/profesor.js`, `practicas/_comun/registro.js` (campos
   `practica`, `ejercicio` de cada fallo), `practicas/_comun/codigos.js` (`codigoTarea`),
   `firestore.rules`, `herramientas/informe-actividad.mjs` (lee los documentos por REST) y las
   fichas 38, 39 y 44 de este reparto.
2. Escribe el diseño por apartados (abajo) **como propuesta con alternativas donde las
   haya**, y resuelve con Juan Luis en la conversación lo que esté marcado como decisión suya.
   No des por cerrado nada que él no haya dicho.

## Qué hay que decidir y escribir en `DISENO.md`

A. **Unidades.** Campo `unidad` (1, 2, 3…) en cada entrada del catálogo y de las tareas. Portada:
   sección por unidad (la actual primero; las anteriores plegadas), «Tareas» y «Prácticas» de
   cada una. Quita la coletilla «(repaso de la unidad 1)» de los nombres del catálogo: la
   unidad ya lo dice. Decisión de Juan Luis: orden y títulos de las secciones.
B. **Estados de una tarea.** Propuesta: `desde` y `hasta` opcionales (con plazo = obligatoria
   para todos entre esas fechas; sin fechas = repaso), y una **asignación** a alumnos
   concretos que vive en Firestore, no en el repositorio (el repo es público y los códigos y
   los números de lista de quien necesita refuerzo no deben verse): documento
   `asignaciones/<código>` con `{ tareas: [{ id, hasta }] }`, que el alumno lee por `get`
   (como `practicas/<slug>--<código>`) y que solo escribe el profesor desde el panel
   (autenticado). Decisión de Juan Luis: cómo quiere asignar en el panel (pegar números de
   lista, marcar casillas) y si una tarea asignada a algunos la ven los demás como repaso.
C. **Progreso por tarea.** Propuesta: un documento `tareas-progreso/<tareaId>--<código>` con
   el mismo formato que el de una práctica (`estado.ej` indexado por posición en la tarea:
   ★ primero, luego los de elegir), mismas reglas (`get` por id, create/update con las mismas
   comprobaciones), misma fusión (`nube.js`). La práctica libre sigue en
   `practicas/<slug>--<código>`. Al abrir un ejercicio desde una tarea, la base trabaja sobre
   el progreso de esa tarea; desde la portada, sobre el de la práctica. Alternativa a
   descartar o no: guardar las tareas dentro del documento de la práctica (`estado.tareas`),
   que complica la fusión. Decisión de Juan Luis: si al terminar un ejercicio dentro de una
   tarea también cuenta como hecho en la práctica libre (propuesta: sí, lo que vale una vez
   vale siempre; lo contrario no).
D. **Migración de la semana 1 (en curso del 16 al 22-10).** El progreso de la tarea 1 está hoy
   en los documentos de práctica. Propuesta: la tarea 1 lleva `progresoPorPractica: true` y se
   sigue leyendo como hasta ahora; las tareas 2, 3 y 4 de la U2 y todas las nuevas usan el
   modelo nuevo. **Nada de esto se publica entre el 16 y el 22-10** (tarea viva): la
   implementación tiene que estar en `main` entre el viernes 23 y el domingo 25, antes de que
   la semana 2 empiece el lunes 26. Si no llega, la semana 2 sale con el modelo viejo y la
   migración se mueve a la semana 3. Juan Luis decide la fecha límite.
E. **Lo que cambia alrededor:** `codigoTarea` (si el formato cambia, versión 2 y seguir leyendo
   la 1), el registro de fallos (`registro.js`: añadir `tarea` al documento y a las reglas),
   el panel (`profesor.js`: progreso por tarea y por alumno; «qué falla más» por tarea; la
   asignación), `herramientas/informe-actividad.mjs` (leer `tareas-progreso/` cuando la
   tarea sea v2), `docs/practicas-unidad2.md` y el README.
F. **Lista de tareas de implementación**, cada una con ficheros que toca, banda, duración y
   dependencias, para que la coordinadora las dé de alta tal cual: por ejemplo «unidad y
   portada», «reglas de Firestore y nube.js», «base: progreso por tarea», «semana.js y
   código v2», «panel: asignación», «registro e informe», «documentación». Las que tocan
   `practicas/_comun/base.js` no van en paralelo entre sí ni con la 44.

## Datos de entrada

Solo lectura: todo lo listado en «Siguiente paso»; `reparto-practicas-u2/proyecto.md`
(decisiones de reparto y reglas de contenido); `reparto-practicas-u2/hechos/notas/s-20261016T122625-186b4bd8.md`
(la nota de la coordinadora del 16-10 con el contexto de estas decisiones).

## Cómo saber que ha terminado

- `DISENO.md` con los apartados A-F, cada decisión marcada como «decidido por Juan Luis el
  <fecha>» o «propuesta pendiente», y la lista F completa.
- Juan Luis ha dicho en la conversación que aprueba el diseño (o qué apartados quedan
  pendientes); se anota en `ENTREGA.md`.

## Trampas conocidas

- La tarea 1 está viva hasta el 22-10 con 51 alumnos: cualquier cambio del modelo de datos
  que toque `practicas/<slug>--<código>` puede perderles el progreso. Por eso la propuesta
  D no toca esos documentos.
- Los enlaces repartidos en el correo a los alumnos y en Classroom son
  `semana.html?t=1&c=<código>` y `semana.html?t=1`: el id 1 de la tarea y esos parámetros
  no pueden cambiar.
- `codigos.js` deriva el código del alumno de su número de lista: ninguna estructura nueva
  puede necesitar que se reordene la lista del panel.

## Prohibido (propio de esta tarea)

- Implementar: ni código, ni reglas, ni documentación del repositorio. Solo `DISENO.md`.
- Decidir en nombre de Juan Luis lo marcado como decisión suya; si no está en la
  conversación, queda como «propuesta pendiente».

## Salida esperada

- `reparto-practicas-u2/salidas/45-diseno-tareas-v2/DISENO.md`, `ENTREGA.md` y su marcador.
- En la terminada: la lista F resumida, para que la coordinadora dé de alta las fichas.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 45, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-45.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/45--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/45--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/45-diseno-tareas-v2/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/45--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/45--<sid>.md` con hasta dónde llegaste, la línea
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
