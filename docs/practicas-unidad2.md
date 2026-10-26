# Prácticas interactivas de la unidad 2 (`practicas/`)

Escrito el 2026-10-08, al cerrar el reparto PU2 (`reparto-practicas-u2/`), y puesto al día
el 2026-10-17 con el modelo de tareas v2 (unidades, plazos, asignación y progreso por tarea:
§1, §2 y §3) y con el sistema de **varios profesores** (espacios, código secreto y alta de
profesores: §9). Es el documento
que la coordinación de la unidad necesita sobre las prácticas, con el mismo espíritu que
[coordinacion-unidad1.md](coordinacion-unidad1.md): qué hay, cómo se amplía, cómo se leen los
resultados y qué destreza del inventario practica cada una.

Son 31 mini-aplicaciones sin cuentas para 1.º ESO bilingüe: 16 de la unidad 2
(Divisibilidad) y 15 de repaso de la unidad 1. Todas se apoyan en una **base común**
(`practicas/_comun/`) y comparten **un solo panel del profesor** (`practicas/profesor.html`).

**Un solo sistema**: un espacio por profesor (códigos registrados en la nube, nombres
cifrados, tareas en la nube), descrito en §9; los compañeros empiezan con la guía
[practicas-como-empezar.md](practicas-como-empezar.md). Historia: del 2026-10-17 al 2026-10-25
convivió con el **modo antiguo** (códigos de 4 calculables y las colecciones `practicas`,
`practicas-tareas`, `practicas-asignaciones`, `fallos` y `divisores`). Juan Luis pasó a su
espacio el 18-10 con sus códigos de 4 de siempre (tarea 70 de PU2) y la tarea 71 quitó el modo
antiguo: un código que la nube no conoce, aunque sea de 4, da «Ese código no existe».

- Portada: https://salasgar.github.io/Ejercicios-interactivos/practicas/
- En local: `npm run servir` y http://localhost:8080/practicas/ (los módulos ES no cargan
  abriendo el fichero).

## 1. Qué ve el alumno

1. Entra con su **código** (de 4 u 8 caracteres, el mismo en todas; lo da su profesor, §9.2).
   El enlace que reparte el panel es `practicas/?c=ABCD`: la portada guarda el código y las
   prácticas lo encuentran. Un código que la nube no conoce da «Ese código no existe». También
   puede «probar sin código» (no se guarda nada).
2. Cada práctica tiene entre 2 y 5 ejercicios. En cada uno hay que **llegar a 10 puntos**:
   cada acierto da 1 punto y **5 aciertos seguidos dan 1 extra** (con felicitación). Cada
   fallo **quita 1 punto** (nunca por debajo de 0) **y una vida**; hay **5 vidas** y, si se
   pierden todas, el ejercicio vuelve a empezar desde 0 (los fallos acumulados se conservan
   para el profesor). Un ejercicio puede declarar otro objetivo (el árbol de factores pide 6
   árboles). Las constantes viven en `practicas/_comun/contador.js`, para ajustarlas cuando se
   vea cómo reaccionan los alumnos; un ejercicio terminado con unas normas sigue terminado
   aunque cambien. Este modelo sustituyó el 2026-10-08, antes de que ningún alumno usara las
   prácticas, al de «10 aciertos, +2 por fallo, tope 20».
3. El **idioma de cada ítem lo sortea la base** (modo alterno, en bloques equilibrados de
   cuatro: dos en español y dos en inglés). El alumno no lo elige; después de responder puede
   ver el mismo ítem en el otro idioma. El profesor puede fijarlo para un alumno con
   `?idioma=es` o `?idioma=en` en el enlace (queda guardado para ese código;
   `?idioma=alterno` lo quita).
4. Al fallar, el mensaje dice qué ha pasado **con los números de ese ítem**, no una regla
   genérica, y la base añade unas palabras de ánimo.
5. Al terminar los ejercicios aparece «Tu profesor ya puede verlo» (la nube ya cuenta el
   progreso). Una práctica suelta no da ningún código (el de 16 caracteres por práctica
   existió hasta el 2026-10-16 y se eliminó); nada manda al alumno enviar nada.
6. **La tarea de la semana** (desde el 2026-10-15): un enlace, `practicas/semana.html?t=<id>`,
   abre en una página los ejercicios de esa semana: unos con ★, obligatorios, y una lista de la
   que elige unos cuantos («Termina los 6 ejercicios con ★ y 4 más de la lista, los que tú
   elijas. Son 100 puntos.»). Cada ejercicio sale con su práctica, su nombre, su estado (sin
   empezar, puntos que lleva o terminado) y un botón que abre **ese ejercicio** de la práctica;
   al salir de él o al terminarlo se vuelve a la tarea. Un marcador dice cuánto lleva («★ 4 de 6
   · a elegir 2 de 4 · 60 de 100 puntos»: cada ejercicio vale 10, los terminados enteros y los
   que van a medias en proporción a sus puntos; de los de elegir cuentan los mejores). Al
   cumplirla dice «Tu profesor ya puede verlo» y deja el **código de resultado de la tarea**
   (20 caracteres) en un desplegable de respaldo; no hay código parcial. La página no guarda
   nada suyo: lee el progreso que guarda la base. **Desde el modelo v2 (17-10-2026) cada
   tarea lleva su propio progreso**, separado del de la práctica libre (apartado siguiente);
   solo la tarea 1 sigue leyendo el de las prácticas, así que en ella cuenta lo hecho en la
   práctica libre. Al entrar con el código trae antes lo de la nube (ver «Seguir desde
   cualquier aparato», abajo), así que el alumno ve lo que hizo en otro móvil u ordenador.
   Las tareas que ya han llegado a su día salen también en la portada, en la sección de su
   unidad.

### Unidades, plazos, asignación y progreso por tarea (modelo v2)

Diseñado con Juan Luis el 16-10-2026 (`reparto-practicas-u2/salidas/45-diseno-tareas-v2/DISENO.md`,
aprobado entero), hecho por las tareas 49-54 y revisado de punta a punta por la 55
(`salidas/55-revision-v2/VEREDICTO.md`). En una frase: cada unidad tiene sus prácticas y sus
tareas; una tarea es de repaso, obligatoria para todos con plazo u obligatoria solo para los
alumnos que se marquen en el panel; el progreso de una tarea es suyo y no se mezcla con el de
la práctica libre; y el retraso de cada entrega queda medido en días.

- **Unidades.** Cada fila del catálogo y cada tarea llevan `unidad`. `UNIDADES` (en
  `catalogo.js`) da el número, el título y el día en que empieza cada una; la **unidad actual**
  es la última cuyo `desde` ha llegado, así que la portada cambia sola de unidad (la 3, el
  16-11-2026). La portada enseña la unidad actual arriba y abierta, con «Tareas» y
  «Prácticas»; las anteriores, debajo y plegadas (el navegador recuerda cuáles abrió el
  alumno). En la unidad 2 las prácticas siguen agrupadas por semanas (`BLOQUES` de
  `portada.js`); en la 1 van en una lista. Una unidad que no ha empezado o que no tiene nada
  publicado no sale. Los nombres ya no llevan «(repaso de la unidad 1)»: lo dice la sección
  (`propiedades` conserva «(ampliación)»). Dentro de una tarea, un ejercicio de otra unidad
  lleva «· repaso U1».
- **Tres tipos de tarea**, según los campos de la tarea (los de `tareas.js`, §9.5; nada más se guarda):

  | `asignada` | `hasta` | Para un alumno marcado (o para todos si no es `asignada`) | Para uno no marcado |
  |---|---|---|---|
  | no | no | **Repaso**: voluntaria, sin plazo | — |
  | no | sí | **Obligatoria** hasta el plazo | — |
  | sí | sí o no | **Obligatoria para ti** (con o sin plazo) | **Repaso**, sin ninguna marca |

  Quien no está marcado ve la tarea asignada como un repaso más: por eso su título no puede
  decir «refuerzo» ni nada que señale a quien la tiene. Un único plazo por tarea, para todos.
- **Plazo y retraso.** `hasta` es el plazo, hasta el final de ese día (hora local). Lo que se
  haga después **sigue contando**, pero sale «fuera de plazo» y se mide el retraso en **días
  naturales**: entre el plazo y el **día de entrega** (el día en que la tarea quedó cumplida
  por primera vez, `diaEntrega` de `estadoTarea`) o, si no la ha entregado, hasta hoy. El
  alumno ve, en la tarea y en la portada, «Plazo: jueves 22-10», «Fuera de plazo · 3 días de
  retraso», «Entregada con 3 días de retraso» o «✓ Entregada», y «fuera de plazo» en cada
  ejercicio terminado tarde. Lo calcula `estadoPlazo` (`tareas.js`); las frases, `vistaPlazo`
  (`practicas/vista-tareas.js`). El criterio para calificar el retraso lo decidirá Juan Luis
  al final de cada evaluación con la vista «Retrasos» del panel.
- **Asignación.** Se marca en el panel («Asignar tareas», casillas alumno × tarea `asignada`,
  botón «Guardar asignaciones») y se guarda en Firestore, **no en el repositorio** (que es
  público): `practicas-espacios/{uid}/asignaciones/<código>` = `{ tareas: [ids], actualizado }`.
  La escribe solo el profesor; el alumno la lee con `get` (como su progreso) al abrir la portada
  o la tarea, como mucho 4 s, y la copia en el navegador (`practicas.asignacion.<código>`). Sin
  red ni copia, la tarea asignada sale como repaso. Desmarcar deja `tareas: []`.
- **Progreso por tarea.** Abierto desde una tarea v2 (`…/<slug>/?ejercicio=n&semana=<id>`), el
  ejercicio trabaja en el **ámbito de la tarea**: lee, guarda y sube
  `practicas-espacios/{uid}/progreso-tareas/t<id>--<slug>--<código>` (en el navegador,
  `practicas.v1.<slug>.<código>.t<id>`), con el mismo formato, la misma fusión entre aparatos
  y la misma migración que los de la práctica libre (`progreso-libre`). Lo hecho en la tarea no sale en la práctica
  libre ni al revés, y no hay avisos de «ya lo hiciste en otro sitio» (decisión de Juan
  Luis): cada tarea pide sus ejercicios, se hayan hecho antes o no. **Repetir** un ejercicio
  ya terminado dentro de la tarea es practicar: solo suma `repeticiones`, no cambia puntos
  ni fallos. Si el enlace pide un ejercicio que no está en la tarea, se abre la práctica
  libre. Cada fallo hecho dentro de una tarea lleva `tarea: <id>` en la colección `fallos` del espacio.
  Una tarea puede ser solo de obligatorios (`elegir` vacío y `nElegir: 0`).
- **La tarea 1 de Juan Luis es la excepción, para siempre** (`progresoPorPractica: true`): su
  progreso es el de la práctica libre (`progreso-libre/<slug>--<código>`), lo hecho en la
  práctica libre le cuenta, su código de resultado lleva el día del último ejercicio terminado
  (las v2, el de entrega) y sus enlaces no cambian. Así se publicó el modelo v2 mientras 51
  alumnos la estaban haciendo, y así pasó a su espacio (tarea 70). En `tareas.js` (la
  plantilla) `erroresTareas` impide quitárselo y ponérselo a otra; «Cargar la plantilla del
  curso» la copia sin él (en el espacio de un profesor nuevo la 1 es una más).
- **Una tarea nueva** se crea en el editor «Tareas» del panel (§9.5), con un `id` nuevo (no se
  reutiliza ni se cambia una ya mandada), su `unidad`, `desde` (opcional) y `hasta` (opcional)
  y, si es solo para algunos, «solo para algunos alumnos» (`asignada: true`). `tareas.js` es
  la plantilla del curso: se cambia a mano y `npm test` comprueba sus datos (`erroresTareas`).

### Seguir desde cualquier aparato (tarea 38)

El progreso de cada alumno en cada práctica está en el navegador y en Firestore, en el
documento `practicas-espacios/{uid}/progreso-libre/{práctica}--{código}` del espacio de su
profesor. La regla deja al alumno **leer** ese documento (`allow get`, sabiendo el código;
**listar** la colección es solo del profesor y de sus lectores; dentro solo hay números, sin
nombres). Lo hace `practicas/_comun/nube.js`:

- **Al entrar con el código** (en una práctica o en la página de la semana), antes de enseñar
  nada y antes de subir nada, se lee el documento (como mucho 4 s), se **fusiona** con lo del
  navegador, se guarda la fusión en el navegador y, si la nube no la tenía, se sube. Sin red,
  o si el documento no existe (alumno nuevo), se sigue con lo del navegador sin avisos.
- **Fusión**, ejercicio a ejercicio: gana entero el más avanzado (terminado gana a sin
  terminar; entre dos terminados, el que se terminó antes; entre dos sin terminar, más
  puntos); de `fallos`, `reinicios`, `repeticiones` y lo hecho en inglés se queda el máximo.
  Es conmutativa e idempotente, nunca deja sin terminar algo terminado y respeta el tope de
  `objetivo − 1` puntos sin terminar. `aciertos`, `vidas`, `racha` y `dia` van con el que gana
  (`aciertos` es del intento en curso: la criba lo usa como número de paso).
- **Cada subida** (al terminar un ejercicio y cada 5 respuestas) vuelve a leer y fusiona
  antes de escribir, en cola. Al volver a la pestaña en el menú se vuelve a leer la nube (como
  mucho cada 30 s).
- El **idioma fijado** (`&idioma=es|en`) viaja también: un aparato que no tiene nada dicho
  adopta el de la nube; `?idioma=alterno` queda guardado y no se pisa.
- **Lo que no se resuelve:** dos aparatos abiertos a la vez y respondiendo a la vez pueden
  pisarse en la nube (no hay transacciones por REST sin cuenta). Lo peor que pasa es que la
  nube pierda lo último de un aparato hasta que se vuelva a entrar con él (lo tiene en su
  navegador y lo sube al entrar). La portada (`practicas/`) cuenta los ejercicios hechos con
  lo que hay en el navegador; se pone al día en cuanto se abre una práctica o la tarea.

## 2. Cómo lee el profesor los resultados

En `practicas/profesor.html`. Cada profesor entra con Google en su espacio (§9); no hay
selector de sistema (el «sistema actual» del modo antiguo se quitó en la tarea 71).

1. **Mis alumnos.** Se pega la lista de clase (un nombre por línea) y «Generar códigos» da un
   código a cada línea que no lo tiene; el panel da el enlace de cada alumno, y el selector
   «Idioma de los enlaces» los genera todos en alterno, en español o en inglés. La lista sube
   a la nube cifrada (§9.4). Los alumnos de Juan Luis conservan sus códigos de 4 de siempre,
   registrados en su espacio (tarea 70).
2. **Resultados**, de dos fuentes que el panel junta:
   - (respaldo, para cuando la nube no llega) los **códigos de resultado** de las tareas
     (20 caracteres) que los alumnos dan si se piden, pegados tal cual (el mensaje entero vale:
     el panel extrae los códigos). Cada código dice de quién es y de qué tarea, con las tareas
     del profesor. Los de 12 de la `divisores/` antigua y los de 16 (el código por práctica,
     que ya no existe) salen en el aviso de «no válidos»;
   - la **nube**: el progreso está en el espacio del profesor
     (`practicas-espacios/{uid}/progreso-libre/{práctica}--{código}` el de la práctica libre y
     la tarea 1 de Juan Luis, `…/progreso-tareas/t{id}--{práctica}--{código}` el de las tareas
     v2; reglas en `firestore.rules`), fusionado entre los aparatos del alumno, y el panel lo
     lee con la sesión del profesor («Cargar de la nube» lee también las asignaciones; solo
     pide lo nuevo, §9.6). Si la nube falla no se pierde nada: el código de la tarea lleva lo
     necesario para calificar.
3. La vista «Resumen de todas las prácticas» da una fila por alumno; eligiendo una práctica
   se ve ejercicio a ejercicio. Las dos tablas se descargan en CSV.
4. **Tareas de la semana.** La sección «Tareas» da el **enlace común** de cada
   tarea (`…/practicas/semana.html?t=2`), el que se pega en Classroom: cada alumno escribe su
   código la primera vez, o ya lo tiene recordado si entró en otra práctica en ese
   dispositivo. Para el enlace de cada alumno (`…&c=ABCD`), se elige la tarea en «Enlaces a»,
   en «Mis alumnos». En el cuadro de códigos se pegan los de las tareas (20
   caracteres), y la vista «Tareas de la
   semana» da una fila por alumno y una columna por tarea: «✓ cumplida · 100 pt», «★ 4 de 6 ·
   2 de 4 · 65 pt» o «sin empezar». Los **puntos** (sobre 100) los calcula `estadoTarea`, la
   misma función del marcador del alumno; lo que va a medias solo lo sabe la nube. Un ejercicio cuenta como terminado si lo dice el código de la tarea **o**
   lo que se sabe de su progreso (en la tarea 1, el de la práctica; en las v2, el de la
   tarea): así se ve el avance de quien no ha mandado todavía el código de la tarea. Cada
   celda con plazo añade el retraso («✓ cumplida · 20 pt · 2 d tarde»; «… · 2 d de retraso»
   si sigue sin entregar); en una tarea `asignada`, los no marcados salen con «—» y no
   cuentan. El CSV trae además los puntos, los fallos, el día, de dónde sale cada dato y,
   por tarea, plazo, fecha de entrega, días de retraso y entrega (a tiempo / con retraso /
   sin entregar / pendiente).
   La vista **«Retrasos en las tareas»** es para el análisis de final de evaluación: por
   alumno, cuántas tareas con plazo tenía, cuántas entregó a tiempo, con retraso o no
   entregó, cuántas están pendientes (plazo sin vencer), los días de retraso en total y la
   media y el máximo de las que tienen retraso; y lo mismo por tarea. Solo cuentan las
   tareas ya publicadas (`desde`) y, para cada alumno, las que eran obligatorias para él. Su
   CSV añade una fila por alumno y tarea.
   La sección **«Asignar tareas»** (pide haber cargado la nube) es la tabla de casillas de
   las tareas `asignada`: se marca y «Guardar asignaciones» escribe solo lo que ha cambiado.
5. **Qué falla más.** Las vistas «Qué falla más · todas las prácticas» y «Qué falla más ·
   tarea N» dan una fila por ejercicio (con su nombre y, en las de tarea, si es ★ o de
   elegir): cuántos alumnos lo han empezado, cuántos lo han terminado, fallos totales,
   **fallos por alumno que lo ha empezado** (el orden de la tabla) y veces que se quedaron sin
   vidas. De cada alumno se toma lo mismo que en la tabla de su práctica; si hay nombres en la
   lista, solo cuentan los de la lista. Con CSV. Lo calcula `juntarFallos` (`resultados.js`).
   En «tarea N» los datos son los de esa tarea (en las v2, sus propios documentos), no los
   de la práctica libre.
6. **Fallos, uno a uno** (tarea 39, sección 3 del panel). Cada vez que un alumno con código
   falla un ítem, la base crea un documento en la colección `fallos` del espacio de su
   profesor (`practicas-espacios/{uid}/fallos`; uno por
   fallo; decisión de Juan Luis del 16-10-2026): código del alumno, práctica, ejercicio, hora y
   día, idioma, el ítem (lo que devolvió `generar`, en JSON, hasta 400 caracteres), la
   explicación que vio en texto plano (hasta 500), si estaba repitiendo un ejercicio ya
   terminado y, si la práctica los da, `error` y `respuesta`. El alumno solo puede **crear**
   esos documentos, y solo si el código es de ese profesor; leerlos, el profesor y sus
   lectores. Si no hay red, o aún no se sabe de qué profesor es el código, el fallo espera en
   el navegador (hasta 50) y se manda en el siguiente fallo o al entrar; el id lo pone la app,
   así que un reintento no duplica. El panel los lee **desde el día que se elija** (una
   lectura por fallo: unos 2.500 a la semana para 51 alumnos, lejos de las 50.000 diarias
   gratuitas; los ya leídos se guardan en el navegador y no se vuelven a pedir) y da los fallos más repetidos (por `error` si lo hay, si no por
   ejercicio) con tres ejemplos reales, qué le cuesta a cada alumno, y un CSV con un fallo por
   fila y las destrezas de la práctica (§7). Filtros: tarea (por el campo `tarea` de cada
   fallo: «Sin tarea (práctica libre)», «Tarea 1», «Tarea 2»…), práctica y alumno; con
   nombres en la lista, solo cuentan los de la lista.
7. **Informe diario por correo** (`herramientas/informe-actividad.mjs`). Lee por REST el
   espacio de un profesor con una **cuenta lectora** (§9.10; solo números de lista y grupos,
   sin nombres), y da en Markdown: alertas, resumen por grupo, cada ejercicio de la tarea
   (cuántos lo prueban, lo terminan, fallos y reinicios) y cada alumno con sus puntos y su
   entrega. Lee los documentos de la tarea 1 en `progreso-libre` y los de las v2 en
   `progreso-tareas`; en una tarea `asignada` solo cuenta a los marcados (y dice cuántos
   quedan fuera); con plazo vencido resume «X a tiempo, Y con retraso, Z sin entregar».
   `LECTOR_EMAIL=… LECTOR_CLAVE=… node herramientas/informe-actividad.mjs --espacio <uid>
   [--alumnos 51 | --codigos <CSV>] [--tarea <id>] [--horas 24]
   [--grupos "1.º A:1-29,E1CB:30-46,E1DB:47-51"] [--json]`; `--espacio` es obligatorio (desde
   la tarea 71 no hay modo sin cuenta). **Sin `--tarea` elige solo la
   tarea vigente**: la obligatoria (con `hasta` y no `asignada`) de plazo abierto más
   próximo; si no hay ninguna, la última vencida. Lo manda cada noche, a las 21:30 hora
   peninsular, una rutina de Claude en la nube (`trig_018p4Y73wGMvZu7Uxjf27Tc1`) que ejecuta
   el script de `main` con `--espacio <uid de Juan Luis> --alumnos 51 --horas 24 --grupos …` y
   envía el correo a Juan Luis; la rutina no está en el repositorio y se cambia desde claude.ai.

### Los dos códigos de resultado

La longitud dice qué es cada uno. Desde la tarea 71 el panel solo lee el de 20 (con las
tareas del profesor); el de 12 queda descrito como historia. (Hubo un tercero, de 16
caracteres, uno por práctica: existió hasta el 2026-10-16 y se eliminó, porque con la nube y
el de la tarea sobraba y sus 5 bits de práctica limitaban el catálogo a 32 prácticas.)

| Largo | De qué | Qué lleva (en bits) |
|---|---|---|
| 12 | la `divisores/` antigua (antes de la tarea 17; el panel ya no lo lee) | su formato de siempre (`divisores/logica.js`) |
| 20 | una tarea de la semana | versión (5, hoy 1) · tarea (10) · alumno (10) · ★ terminados (10, un bit por ★ en el orden de `tareas.js`) · de elegir terminados (15, igual) · fallos de todos los ejercicios de la tarea (10, hasta 1023) · día (10): en la tarea 1, el del último ejercicio terminado; en las v2, el de entrega (cuando quedó cumplida) · control (30) |

El de la tarea se escribe en cinco grupos de cuatro (`ABCD-EFGH-JKLM-NPQR-STUV`), con el mismo
alfabeto (sin I, O, 0 ni 1) y enmascarado. Los 30
bits de control hacen que cualquier carácter mal copiado lo invalide. El panel lo interpreta
con las tareas del profesor (las de su espacio), así que **una tarea ya mandada no se cambia** (el bit «3.er ★» pasaría a
querer decir otro ejercicio): si hay que cambiarla, se copia con un `id` nuevo. Cabe una tarea
de hasta 10 ★ y 15 de elegir, y ids hasta 1023.

Ninguno de los dos códigos es **criptografía** (el programa es público): impiden inventárselo
a ojo o copiar el de un compañero, no a quien lea el código fuente.

## 3. La base común (`practicas/_comun/`)

| Fichero | Qué pone |
|---|---|
| `base.js` | `arrancar(practica)`: entrada por código, menú, contador, feedback, traducción, guardado en el navegador y en Firestore (leído y fusionado al entrar). También `validarPractica`, `parametrosDe`, `claveProgreso`, `documentoNube`, `leer`/`escribir`/`borrar`, `URL_PORTADA`, `progresoGuardado`, `sincronizarGuardado` (navegador y nube de acuerdo, para la página de la semana; las dos con `tareaId` para el progreso de una tarea v2), `ambitoDe` (práctica libre, tarea 1 o tarea v2), `ubicacionProgreso` (clave del navegador y documento de la nube de cada ámbito) y `adoptarIdioma` |
| `registro.js` | Registro de cada fallo (tarea 39): `datosFallo` (qué se guarda y sus topes, `LIMITES`), `textoPlano`, `registrarFallo` y `enviarPendientes` (cola del navegador; cada fallo va a la colección `fallos` del espacio de su profesor, `coleccionFallo`) y `DESTREZAS` (práctica → destrezas, copia del §7; un test comprueba que coinciden) |
| `nube.js` | Progreso en la nube entre aparatos: `leerNube` (REST, con tiempo máximo; `ok`, `vacio`, `prohibido` o `error`), `escribirNube`, `subirFusionado` (lee, fusiona y escribe; las tres piden `coleccion`, la del espacio con `coleccionEspacio(uid, …)`, e `id`; sin colección no hay nube), la fusión pura `fusionarEjercicio` / `fusionarProgreso`, `idDocumentoPractica`, `idDocumentoTarea`, `claveProgresoTarea`, `leerAsignacion` y lo del espacio (`leerBusqueda`, `leerConfig`) |
| `espacio.js` | `resolverCodigo`: de qué profesor es un código (`practicas-alumnos/{código}`) y sus tareas (`config/tareas`), con copia en el navegador para seguir sin red; un código que la nube no conoce da `no-existe` |
| `catalogo.js` | Las filas del catálogo (hoy 31 prácticas y la plantilla): `id`, `slug`, `ruta`, `nombre { es, en }`, `nEjercicios`, `disponible`, `unidad`; y `UNIDADES` con `unidadActual(hoy)` |
| `codigos.js` | Código de alumno (4 u 8 caracteres al azar, `codigoSecreto`; de 4 descarta los 1024 calculables del modo antiguo) y de resultado de una tarea de la semana (20); `extraerCodigosResultado`, que los encuentra mezclados en un texto |
| `tareas.js` | La **plantilla** de las tareas («Cargar la plantilla del curso» en el panel, y lo que se ve sin código; **se cambia a mano**; el formato está en su cabecera): `id`, `titulo`, `unidad`, `desde`, `hasta`, `asignada`, `progresoPorPractica` (solo la 1), `estrella`, `elegir`, `nElegir`. También `estadoTarea` (marcador, «cumplida» y `diaEntrega`), `estadoPlazo` (tipo, entrega y días de retraso), `tareasPublicadas` (por unidad), `diaDeFecha` y `erroresTareas`, que comprueba los datos contra el catálogo y las unidades |
| `contador.js` | `OBJETIVO = 10`, `PENALIZACION = 1`, `VIDAS = 5`, `RACHA = 5`, `EXTRA = 1`; `ejercicioNuevo`, `anotar`, `queHaPasado`, `migrarProgreso`, fechas |
| `aritmetica.js` | `esPrimo`, `factorizar`, `divisores`, `parejasDivisores`, `mcd`, `mcm`, `criterio(n, d)` con `CRITERIOS = [2, 3, 5, 9, 10, 11]`, y las operaciones con factorizaciones (`multiplicarFact`, `dividirFact`, `mcdFact`, `mcmFact`, `htmlFact`…) |
| `piezas.js` | `elecciones` (botones de elegir, con `marcar`), `pasos` (contador −/valor/+) y `campoNumero` (campo para escribir un número: teclado de cifras en el móvil, acepta «4.730» y «4 730», no deja comprobar vacío; lo lee `leerNumero`) |
| `textos.js` | Textos comunes `T[idioma]`, `unir(frases, idioma, 'y' \| 'o')`, `esc` |
| `rng.js` | `crearRng(semilla)`: `azar()`, `entero(min, max)`, `elegir(lista)`, `barajar(lista)` |
| `estilos.css` | Lo que comparten: `.instruccion`, `.operacion`, `.elecciones`, `.si-no`, `.pasos`, `.rejilla`, `.hueco`, `.ficha`, `.comprobar`, `.cuenta`… (la lista está en su cabecera) |

Fuera de `_comun/`, `practicas/vista-tareas.js` (tarea 52) junta lo que comparten la página
de la tarea y la portada, sin DOM: de dónde se lee el progreso de una tarea, la asignación
del alumno, las frases de plazo y las secciones por unidad.

Las colecciones de Firestore de estas prácticas son las de los espacios (§9.3; reglas en
`firestore.rules`, que publica Juan Luis a mano en la consola, **antes** de comitear el
código que las usa). Las del modo antiguo (`practicas`, `practicas-tareas`,
`practicas-asignaciones`, `fallos` y `divisores`) no tienen regla desde la tarea 71:
Firestore las deniega enteras, y Juan Luis las borra desde la consola con su firma (con
copia antes, fuera del repositorio).

**El catálogo ya no tiene tope** (desde el 2026-10-16, al eliminar el código de resultado por
práctica, que reservaba 5 bits para el id y limitaba a 32 prácticas): una práctica nueva lleva
el siguiente entero libre. Los `id` **no se renumeran ni se reordenan**: los usan el panel y
`BLOQUES`. El orden en que la portada enseña las prácticas no es el del catálogo: está en
`BLOQUES`, en `practicas/portada.js`.

## 4. El contrato de una práctica

Manda `practicas/plantilla/practica.js`, que es un ejemplo que funciona
(http://localhost:8080/practicas/plantilla/). Lo que sigue está copiado de su cabecera y de
la terminada de la tarea 01, tal como quedó tras la tarea 35.

Una práctica son cinco ficheros en `practicas/<slug>/` y un test:

```
logica.js    generadores y comprobaciones, PUROS (se prueban con npm test)
textos.js    textos propios, siempre { es, en }
practica.js  los `montar` (la interfaz) y la llamada a `arrancar`
estilos.css  lo que no esté ya en ../_comun/estilos.css
index.html   el armazón (copiado de la plantilla)
tests/practicas-<slug>.test.js
```

`arrancar({ slug, ejercicios })`:

- `slug`: el del catálogo. De ahí salen el id, el título y cuántos ejercicios tiene que
  haber; si no coincide, la base lo dice en pantalla y no arranca.
- Cada ejercicio declara:

| Campo | |
|---|---|
| `nombre`, `detalle` | `{ es, en }`, una línea cada uno (salen en el menú) |
| `objetivo`, `penalizacion`, `vidas` | opcionales; por defecto 10 puntos, −1 por fallo y 5 vidas. Si no se declaran, la práctica hereda cualquier cambio futuro de la base. (`inicial` y `maximo`, del modelo antiguo, hacen que la base no arranque) |
| `introduccion` | opcional, `{ es: html, en: html }`: una tarjeta con botón «Empezar» cada vez que se abre el ejercicio |
| `generar(rng, sesion)` | devuelve el ítem, que son **datos puros**. `sesion` es `{ aciertos, fallos, puntos, vidas, anterior, idioma }` (`aciertos` son los del intento en curso: vuelven a 0 al perder las vidas, así que valen como número de paso): sirve para graduar la dificultad o para un ejercicio por pasos. `idioma` (desde la tarea 37) es el del ítem que se va a generar, para ítems que solo tienen sentido en un idioma (un error que solo lo es en inglés, como «divisible between»); quien no lo use no tiene que cambiar nada. Ojo: tras responder, el alumno puede ver el mismo ítem en el otro idioma |
| `clave(item)` | opcional (por defecto `JSON.stringify`): la base no repite la clave anterior (lo intenta hasta 5 veces) |
| `montar(contenedor, item, api)` | pinta el ítem e instala sus eventos |

Lo que recibe `montar` en `api`:

- `api.idioma`: `'es'` o `'en'`, el idioma **de este ítem**, no un ajuste global.
- `api.t`: textos comunes en ese idioma (`comprobar`, `siguiente`, `si`, `no`, `verdadero`,
  `falso`, `borrar`, `fijate`…). `api.tt(obj)`: atajo para los textos propios `{ es, en }`.
- `api.esc(texto)`, `api.respondido()`.
- `api.responder({ acierto, html, espera, pistas, error, respuesta })`: **una vez por ítem**. `html` es la
  explicación con los números de ese ítem. Acierto: feedback verde y pasa solo al siguiente a
  los `espera` ms (1300 por defecto; algo más si hay punto extra por la racha, que se anuncia).
  Fallo: feedback rojo con los puntos perdidos y las vidas que quedan (o el aviso de que el
  ejercicio vuelve a empezar), el ánimo y el botón «Siguiente». `pistas` (entero ≥ 0) son las
  ayudas usadas: se suman a los fallos sin tocar los puntos ni las vidas.
  Desde la tarea 39, **cada fallo se registra** en la nube (ver §2, punto 6) con el ítem y el
  `html` en texto plano. Dos campos opcionales lo afinan: `error`, el identificador del tipo
  de error (minúsculas, cifras y guiones, hasta 40: `'criterio-3-ultima-cifra'`), con el que el
  panel agrupa; y `respuesta`, lo que contestó el alumno en texto corto. Ninguna práctica los
  pasa todavía; sin ellos todo funciona igual.

Cosas que conviene saber, aprendidas al escribir las 31:

- La base **monta el mismo ítem dos veces** cuando el alumno pide la traducción (la segunda,
  de solo lectura, con `api.respondido()` ya en `true` y un `api.responder` que no hace
  nada). `montar` no puede depender de un `id` único en el documento ni dar por hecho que el
  ítem está sin responder.
- La base no toca nada del contenedor después de montar: marcar en verde o en rojo y
  bloquear los botones es cosa de `montar`, **antes** de llamar a `api.responder`.
- Si `montar` lanza una excepción, la base enseña un aviso y un botón «Siguiente» sin
  penalizar.
- `boton.hidden = true` esconde «Comprobar» (desde la tarea 37 la base lleva
  `.comprobar[hidden] { display: none }`; antes `display: block` lo anulaba y algunas
  prácticas lo arreglaron en su CSS, que sigue valiendo).
- `.cuenta` ya no ensancha la página en el móvil: es un bloque en línea que pasa entero al
  renglón siguiente si no cabe, y solo se parte si no cabe en ninguno (antes `nowrap`).
- Para escribir un número, `campoNumero` de `piezas.js` en vez de `<input type="number">`
  (que da por mal «4.730» y cuenta el vacío como 0). Ejemplo en la cabecera de
  `plantilla/practica.js`. Hoy no lo usa ninguna práctica; lo deberían adoptar `redondeo`,
  `constructor`, `distributiva`, `division`, `reloj` y `baldosas` (las que tienen
  `type="number"`), cada una en su tarea.
- `…/<slug>/?ejercicio=n` abre directamente el ejercicio n; con `&semana=<id>` vuelve a la
  tarea al salir o al terminar y, si es una tarea v2, trabaja sobre el progreso de esa
  tarea (§1, modelo v2). Lo hace la base: la práctica no tiene que hacer nada.
- La página de la semana lee el nombre de cada ejercicio importando el `practica.js` de su
  práctica con la base en modo «solo declarar» (`declaracionDe`, en `base.js`): `arrancar` no
  pinta nada en ese modo. Por eso un `practica.js` **no puede tocar el documento fuera de
  `arrancar` y de sus `montar`** (el test `practicas-semana` las carga todas en Node).
- El fallo se anota al responder: quien sale al menú a mitad de un ítem que se construye en
  varios pasos no pierde ni puntos ni vidas.

## 5. Cómo se añade una práctica

1. Copiar
   `practicas/plantilla/` a `practicas/<slug>/`, dar de alta la fila en `catalogo.js` con
   `disponible: false` y actualizar las listas de `tests/practicas-comun.test.js`.
2. Escribir `logica.js` (puro) y su test **antes** que la interfaz. El test tiene que
   comprobar por fuerza bruta, con muchos ítems, que la respuesta dada por buena lo es y que
   ninguna otra opción lo es también.
3. Cumplir las reglas de contenido (las ocho de `reparto-practicas-u2/proyecto.md`):
   «divisor» y no «factor» para la relación entre números; GCD y no HCF; producto con `·`;
   inglés sencillo; **todo distractor es inequívocamente falso**; nada que no se haya dado
   (sin letras: el hueco es `□`); el 0 es múltiplo de todos y el 1 divisor de todos;
   feedback con los números del ítem.
4. Probarla en 375 px y en 1024 px, en español y en inglés (`?idioma=es`, `?idioma=en`),
   acertando y fallando en cada ejercicio.
5. Añadir su `slug` a un bloque de `BLOQUES` y su línea a `DESCRIPCION` en
   `practicas/portada.js`, y poner `disponible: true`.

## 6. Las 31 prácticas

`id` es el del catálogo (el que usan el panel y la portada). El orden es el de la
portada.

### Unidad 2 · Divisibilidad

| Semana | `slug` | id | Ejercicios |
|---|---|---|---|
| 1 | `semaforo` | 1 | Semáforo básico (2, 3, 5, 9, 10) · Con el 11 · Criterios compuestos (6, 15, 22, 30, 33) · La cifra que falta |
| 1 | `rectangulos` | 2 | Descubre los rectángulos · Sin dibujo: las parejas · ¿Dónde se para? |
| 1 | `recta` | 3 | Marca los múltiplos (del 0 al 60) · Marca los divisores · ¿Verdadero o falso? |
| 2 | `criba` | 4 | La criba de Eratóstenes · ¿Primo o compuesto? · ¿Hasta qué primo hay que probar? |
| 2 | `arbol` | 5 | Construye el árbol · ¿Está terminada? · Completa el árbol |
| 2 | `divisiones` | 6 | La escalera de divisiones · La forma de potencias · Comprobar multiplicando |
| 2 | `fabrica` | 7 | ¿Cuántos divisores tiene? · Sin dividir (hasta el 18-10 había un ejercicio 1, «Construye el divisor», quitado en la tarea 76; el progreso guardado con 3 se adapta solo: `quitados` en `catalogo.js`) |
| 2 | `factorizaciones` | 15 | El producto · ¿Es múltiplo? · El cociente |
| 3 | `venn` | 8 | Reparte los factores · El m.c.d. con factores primos · El m.c.m. con factores primos · Mezcla y comprobación |
| 3 | `imposibles` | 9 | ¿Puede ser? · La comprobación del producto · Nómbralo |
| 4 | `clasificador` | 10 | Enunciados limpios · Con trampa («mayor» y «menor» no deciden) · Justifícalo |
| 4 | `reloj` | 11 | Predice la coincidencia · La hora de reloj · Cada cuántos días (tres datos) |
| 4 | `baldosas` | 12 | La baldosa más grande · ¿Cuántas baldosas? · Cuerdas |
| 4 | `errores` | 13 | ¿Hay un error? · Señala el paso · Nombra el error |
| toda | `leelo` | 14 | Escúchalo · ¿Cómo se lee? · Completa la frase |
| toda | `divisores` | 0 | «De» o «entre» · Con multiplicaciones · Con divisiones · Mezcla · Arrastrar a «__ es múltiplo de __» · ¿Quién miente? (juego con bichos, 2026-10-08) |

**`fichas-de-pablo`** (id 46, tarea 97 de PU2, 2026-10-25) no está en la tabla de arriba: es el refuerzo
de la unidad 2, **«Las fichas del parchís» / «Ludo counters»** (hasta la tarea 114 se llamaba «Las fichas
de Pablo»; el slug, el id y la carpeta no cambian porque van en las URL, en el progreso guardado y en las
tareas; Pablo sigue siendo el niño que juega en los enunciados). Es la hoja `hoja-unidad2-fichas-de-pablo`
(en papel, «Pablo's counters») hecha ejercicios para la clase. Ocho ejercicios: Lee las fichas · Construye el
montón · Multiplicar es juntar · Dividir es quitar · La regla: tantas o más de cada color · Los divisores son
elecciones · El m.c.d.: las fichas que tienen los dos · El m.c.m.: el montón más pequeño. Cada número es un
montón de fichas de colores, una por factor primo (verde 2, azul 3, amarilla 5, roja 7, blanca con el número
para el 11 y el 13).

*Ejercicio 6 (rehecho en la tarea 114, 2026-10-26).* Se da un número factorizado con de 4 a 12 divisores y
valor ≤ 1000 (por ejemplo 847 = 7 · 11²), y debajo una tabla con **una casilla por divisor**: en cada
casilla están todas las fichas del número, con su multiplicidad, apagadas (grises), y a la derecha el
producto de las encendidas (1 al empezar). El alumno enciende fichas hasta que las casillas muestran todos
los divisores, cada uno una vez, en cualquier orden. «Comprobar» marca las casillas que repiten un divisor
y dice cuántos faltan, sin decir cuáles; se puede volver a pulsar. `api.responder` solo vale una vez por
ítem, así que las comprobaciones con fallos se cuentan y el ítem se cierra al acertar: un fallo (con el
error `divisor-repetido`; `faltan-divisores` solo si una casilla no tuviera divisor, que con una casilla por
divisor no ocurre) más tantas `pistas` como comprobaciones fallidas menos una. Que el número de casillas sea el
de divisores es una ayuda a propósito: enseña la fórmula (e₁ + 1) · (e₂ + 1)… Con 7 u 11 divisores no sale
ningún número (exigirían 2⁶ o 2¹⁰, fuera de los topes). Destrezas: U2-3C-01, 3C-02.

`divisores` vive en `divisores/` (su URL de siempre) y desde la tarea 17 está montada sobre
la base. Las demás, en `practicas/<slug>/`.

**Publicadas en la portada: las 31** (desde el 2026-10-09, tras corregir lo que encontraron
la revisión final, tarea 18, y la segunda revisión, tarea 36; los veredictos están en
`reparto-practicas-u2/salidas/18-revision-final/` y `36-segunda-revision/`).

### Repaso de la unidad 1

| `slug` | id | Ejercicios | Destrezas del inventario de la unidad 1 |
|---|---|---|---|
| `jerarquia` | 17 | Sin paréntesis · Potencias y raíces · Con paréntesis · Agrupadores invisibles | 1A-03, 1A-04, 1A-09, 1A-14, 1A-15, 2A-14, 2A-15, 3A-07 a 3A-10, 3A-13, 3A-14, 4A-09, 4A-10, 4A-14, 4A-15 |
| `parentesis` | 16 | Tres números · Con un cuadrado · Con resta y división · Una sola diana | 1A-10 a 1A-15, 2A-07, 2A-08, 2A-13 |
| `exponente` | 18 | ¿A qué afecta el exponente? · Multiplicación repetida · El cuadrado de la suma, con áreas | 3C-01, 3C-04, 3C-05, 3A-05, 3A-06, 4A-04, 1A-12, 3A-12, 4A-05, 3B-01 a 3B-03, 3B-05, 3B-11 |
| `raiz` | 19 | Forma el cuadrado · Sin dibujo · Problemas | 3C-11 a 3C-14, 3C-20 a 3C-23, 3C-27 a 3C-29, 4C-14, 4C-15, 3B-07 a 3B-09, 3B-12, 3B-22 |
| `division` | 20 | Reparte en cajas · La prueba de la división · ¿Qué significa el resto? · ¿Puede ser? | 2C-01 a 2C-09, 4C-11, 4C-12, 2B-04, 2B-05, 2B-15, 2B-17 a 2B-19, 2B-25 |
| `expresion` | 21 | Dos operaciones · ¿Hace falta el paréntesis? · Cuadrados y raíces | 4C-01 a 4C-10, 4C-22, 4C-24, 2C-29, 2A-16, 1A-17, 4A-16, 4A-17, 4B-01 a 4B-04, 4B-17, 4B-18 |
| `redondeo` | 22 | En la recta · A tres órdenes · Estimar y cazar el error | 1C-09 a 1C-19, 1C-21, 1C-22, 4C-16, 4C-17, 4C-20, 1B-12, 1B-13, 1B-24 |
| `constructor` | 23 | Construye el número · Valor de las cifras · Comas, puntos y palabras | 1C-01 a 1C-08, 1C-24, 1C-25, 1B-05, 1B-11, 1B-16 |
| `distributiva` | 24 | Parte el rectángulo · Saca factor común · Compensa con 99 | 2A-01 a 2A-04, 2C-17 a 2C-21, 2C-30, 4C-18, 2B-12, 2B-20 |
| `potencias10` | 25 | El deslizador de ceros · El «and» y los ceros · Billion, million y trillion | 3C-10, 3B-13 a 3B-18, 1B-14, 1B-15, 1B-25, 1B-26, 1C-24 |
| `dictado` | 26 | Dictado en inglés · -teen o -ty, y cómo se escribe · Ortografía española | 1B-01 a 1B-04, 1B-06 a 1B-10, 1B-17 a 1B-23 |
| `mental` | 27 | Compensar · Descomponer | 2C-20 a 2C-24, 2C-30, 2C-31, 2B-21, 2B-22 |
| `especiales` | 28 | ¿Verdadero o falso? · ¿Cuál es la falsa? | 3C-01, 3C-05 a 3C-10, 3C-29, 3C-30, 3B-01 a 3B-03 |
| `errores1` | 29 | ¿Hay un error? · Señala el paso · Nombra el error · ¿Paso a paso? | 4A-10 a 4A-13, 4B-16, 4C-22, y como repaso 1A-03 a 1A-05, 1A-12, 2C-03, 2C-05, 3A-06, 3C-01, 3C-11 |
| `propiedades` | 30 | Junta las potencias · Potencia de potencia y cadenas · ★ La última cifra (reto) | 3C-15 a 3C-19, 3B-06 (ampliación) |

Los identificadores de la unidad 1 son los de `inventario-unidad1.tsv` (en la carpeta de
apuntes, `1. Natural numbers, powers and roots/cuestionarios/comun/reparto/salidas/06-reserva/`),
tal como los cita la ficha de cada tarea en `reparto-practicas-u2/tareas/`.

## 7. Qué práctica cubre qué destreza de la unidad 2

Una fila por destreza de `inventario-unidad2.tsv` (78), con las prácticas que la trabajan
según la ficha de cada tarea. «—» quiere decir que ninguna práctica la trabaja de forma
expresa.

| Destreza | Sem. | Nuclear | Qué es | Prácticas |
|---|---|---|---|---|
| U2-1A-01 | 1 | sí | Decidir sin calcular si el número que se busca cabe en los datos (divisor común) o los contiene (múltiplo… | `clasificador` |
| U2-1A-02 | 1 | sí | Resolver con listas de múltiplos un problema de coincidencia con dos datos hasta 50 | `reloj` |
| U2-1A-03 | 1 | sí | Resolver con listas de divisores un problema de grupos iguales con dos datos hasta 50 | — |
| U2-1A-04 | 1 |  | Dar la respuesta de un problema con su nombre: es un m.c.d. (GCD) o es un m.c.m. (LCM) | `imposibles`, `clasificador` |
| U2-1B-01 | 1 | sí | Vocabulario básico de la divisibilidad en los dos idiomas: multiple, divisor (también factor), divisible… | `leelo`, `divisores` |
| U2-1B-02 | 1 |  | Decir «divisible by», nunca «divisible between» | `leelo` |
| U2-1B-03 | 1 | sí | Vocabulario de los criterios: digit, last digit, sum of the digits, ends in, even / odd | — |
| U2-1B-04 | 1 |  | Vocabulario de lo común: divisor pair, common divisor, common multiple | `rectangulos` |
| U2-1B-05 | 1 | sí | Nombres y siglas del m.c.d. y el m.c.m. en los dos idiomas: GCD (también HCF y GCF) y LCM (lowest o least) | `leelo` |
| U2-1B-06 | 1 |  | Distinguir las dos acepciones de «divisor» (el de una división cualquiera y el de un número) y de «factor»… | — |
| U2-1C-01 | 1 |  | Reconocer la relación de divisibilidad a partir de una división exacta (la prueba de la división con resto 0) | `divisores` |
| U2-1C-02 | 1 | sí | No confundir múltiplo, divisor y divisible: si a es múltiplo de b, entonces a es divisible entre b y b es… | `recta`, `divisores` |
| U2-1C-03 | 1 | sí | Escribir los primeros múltiplos de un número y decidir si un número es múltiplo de otro | `recta` |
| U2-1C-04 | 1 | sí | Hechos generales, sin darles la vuelta: el 1 es DIVISOR de todos y el 0 es MÚLTIPLO de todos (no al… | `recta` |
| U2-1C-05 | 1 | sí | Aplicar los criterios del 2, del 5 y del 10 (la última cifra) | `semaforo` |
| U2-1C-06 | 1 | sí | Aplicar el criterio del 3 (la suma de las cifras, no la última cifra) | `semaforo` |
| U2-1C-07 | 1 | sí | Aplicar el criterio del 9 y distinguirlo del criterio del 3: todo múltiplo de 9 lo es de 3, pero no al revés | `semaforo` |
| U2-1C-08 | 1 |  | Aplicar el criterio del 11 | `semaforo` |
| U2-1C-09 | 1 |  | Aplicar los criterios compuestos (6, 15, 22, 30, 33) y saber cuándo no se pueden combinar: divisible entre… | `semaforo` |
| U2-1C-10 | 1 |  | Hallar la cifra que falta para que un número sea divisible | `semaforo` |
| U2-1C-11 | 1 |  | Explicar con la descomposición polinómica por qué funcionan los criterios del 2, 5, 10, 3 y 9 | — |
| U2-1C-12 | 1 |  | Ampliación: criterios del 4 y del 25 | — |
| U2-1C-13 | 1 | sí | Hallar todos los divisores de un número por parejas, sin olvidar el 1 ni el propio número | `rectangulos` |
| U2-1C-14 | 1 |  | Saber cuándo parar al buscar divisores: en la raíz entera; en un cuadrado perfecto la pareja central se… | `rectangulos` |
| U2-1C-15 | 1 |  | Hallar con listas los divisores comunes y los múltiplos comunes de dos números | — |
| U2-1C-16 | 1 | sí | Calcular con listas el m.c.d. y el m.c.m. de dos números pequeños | — |
| U2-2A-01 | 2 | sí | Resolver problemas de m.c.d. y m.c.m. con dos datos hasta 100, con listas acortadas con los criterios y… | — |
| U2-2A-02 | 2 |  | Responder la segunda pregunta: cuántos grupos salen y cuántos de cada tipo hay en cada grupo | `baldosas` |
| U2-2A-03 | 2 |  | Resolver una coincidencia con tres datos pequeños | `reloj` |
| U2-2A-04 | 2 |  | Reconocer los datos que no tienen más divisor común que el 1 | — |
| U2-2B-01 | 2 | sí | Vocabulario de los primos: prime number, composite number, neither prime nor composite, sieve of… | `criba`, `leelo` |
| U2-2B-02 | 2 |  | Vocabulario de la factorización: prime factor, factor tree, branch, repeated division, prime… | `arbol`, `divisiones`, `leelo` |
| U2-2B-03 | 2 |  | Leer en voz alta una factorización en inglés | `leelo` |
| U2-2C-01 | 2 | sí | Definir número primo y número compuesto por su número de divisores | `criba` |
| U2-2C-02 | 2 | sí | Saber que el 1 no es primo ni compuesto | `criba` |
| U2-2C-03 | 2 | sí | Saber que el 2 es el único primo par y que primo no es lo mismo que impar | `criba` |
| U2-2C-04 | 2 |  | Construir la criba de Eratóstenes hasta 100 y explicar por qué basta tachar los múltiplos de 2, 3, 5 y 7 | `criba` |
| U2-2C-05 | 2 | sí | Reconocer los primos menores que 100 (de memoria, los menores que 50) | `criba` |
| U2-2C-06 | 2 |  | Decidir si un número es primo probando los primos hasta su raíz entera | `criba` |
| U2-2C-07 | 2 | sí | Detectar los compuestos que parecen primos: 51, 57, 87 (criterio del 3) y 91, 119, 143 (hay que probar el… | `criba` |
| U2-2C-08 | 2 | sí | Descomponer un número con un árbol de factores, o completar un árbol | `arbol` |
| U2-2C-09 | 2 | sí | Reconocer una factorización sin terminar: no pueden quedar factores compuestos, tampoco los que solo se… | `arbol` |
| U2-2C-10 | 2 | sí | Descomponer un número con divisiones sucesivas, eligiendo el menor primo con los criterios | `divisiones` |
| U2-2C-11 | 2 | sí | Escribir la factorización con potencias, las bases de menor a mayor; las potencias de 10 se factorizan solas | `arbol`, `divisiones`, `factorizaciones`, `fichas-de-pablo` |
| U2-2C-12 | 2 | sí | Comprobar una factorización multiplicando, sin tratar la potencia como un producto | `divisiones`, `factorizaciones`, `fichas-de-pablo` |
| U2-2C-13 | 2 |  | Saber que la factorización es única aunque el árbol cambie | `arbol` |
| U2-2C-14 | 2 |  | Leer la factorización para decidir sin dividir si un número es divisible entre otro | `fabrica`, `factorizaciones`, `fichas-de-pablo` |
| U2-2C-15 | 2 |  | Reconocer un cuadrado perfecto en su factorización: todos los exponentes son pares | — |
| U2-3A-01 | 3 | sí | Resolver por factorización un problema de m.c.d. (repartir o cortar) con datos que ya no se pueden listar | `baldosas` |
| U2-3A-02 | 3 | sí | Resolver por factorización un problema de m.c.m. (coincidencia) con datos de dos cifras | — |
| U2-3A-03 | 3 |  | Resolver un problema de m.c.d. o m.c.m. con tres datos | — |
| U2-3A-04 | 3 |  | Resolver a simple vista un problema en el que un dato es múltiplo del otro | `reloj` |
| U2-3B-01 | 3 | sí | Vocabulario de las dos reglas: common prime factors, lowest power, highest power, common and non-common… | `venn` |
| U2-3B-03 | 3 |  | Leer en voz alta un m.c.d. o un m.c.m. en inglés | `leelo` |
| U2-3B-04 | 3 |  | Justificar en inglés el método elegido: I chose ... because ... | — |
| U2-3C-01 | 3 |  | Obtener todos los divisores de un número combinando sus factores primos | `fichas-de-pablo` |
| U2-3C-02 | 3 |  | Contar los divisores a partir de los exponentes: se suma 1 a cada uno y se multiplica | `fabrica`, `fichas-de-pablo` |
| U2-3C-03 | 3 | sí | Calcular el m.c.d. por factorización (solo los primos comunes, con el menor exponente) y saber por qué | `factorizaciones`, `fichas-de-pablo`, `venn` |
| U2-3C-04 | 3 | sí | Calcular el m.c.m. por factorización (todos los primos, comunes y no comunes, con el mayor exponente) y… | `factorizaciones`, `fichas-de-pablo`, `venn` |
| U2-3C-05 | 3 | sí | No cruzar las dos reglas | `venn` |
| U2-3C-06 | 3 |  | No calcular el m.c.m. solo con los primos comunes | `fichas-de-pablo`, `venn` |
| U2-3C-07 | 3 |  | Calcular el m.c.d. y el m.c.m. de tres números | — |
| U2-3C-08 | 3 |  | Caso especial: si uno es divisor del otro, el m.c.d. es el pequeño y el m.c.m. el grande | `fichas-de-pablo`, `venn` |
| U2-3C-10 | 3 | sí | Comprobar con las desigualdades, también en contexto: el m.c.d. no pasa del menor dato y los divide a… | `venn`, `imposibles` |
| U2-3C-11 | 3 |  | Comprobar con m.c.d. x m.c.m. = a x b, sabiendo que con tres números no vale | `imposibles` |
| U2-3C-12 | 3 |  | Elegir el método (listas, factorización o a simple vista) | — |
| U2-4A-01 | 4 | sí | Decidir m.c.d. o m.c.m. cuando el enunciado empuja al revés: «mayor» y «menor» no deciden | `clasificador` |
| U2-4A-02 | 4 | sí | Resolver una coincidencia y dar la respuesta en hora de reloj | `reloj` |
| U2-4A-03 | 4 |  | Resolver un problema de cortar en trozos iguales lo más largos posible | `baldosas` |
| U2-4A-04 | 4 |  | Resolver un problema de cubrir un rectángulo con cuadrados iguales lo más grandes posible | `baldosas` |
| U2-4A-05 | 4 |  | Hallar la menor cantidad que se puede repartir de varias formas sin que sobre | — |
| U2-4A-06 | 4 |  | Resolver un problema de nivel 4 con tres datos | — |
| U2-4A-07 | 4 | sí | Responder la segunda pregunta en los problemas de la semana: cuántos trozos, cuántas baldosas, qué hora | `reloj`, `baldosas` |
| U2-4B-01 | 4 | sí | Vocabulario de los problemas: to coincide again, at the same time, share equally, cut into equal pieces,… | `clasificador` |
| U2-4B-02 | 4 |  | Explicar en inglés por qué un problema es un «GCD problem» o un «LCM problem» | `clasificador` |
| U2-4C-01 | 4 | sí | Reconocer y nombrar el error en un procedimiento: la tabla de errores típicos de toda la unidad | `errores` |
| U2-4C-02 | 4 |  | Saber lo que NO es un error: las parejas válidas de la sección 7 | `errores` |
| U2-4C-03 | 4 |  | Comprobar que el resultado de un problema es razonable | `imposibles`, `errores` |

### Destrezas de la unidad 2 sin práctica

Diecisiete de las 78. Cinco son **nucleares**:

- **U2-1A-03** — problema de grupos iguales con listas de divisores (dos datos hasta 50).
- **U2-1B-03** — vocabulario de los criterios (*digit, last digit, sum of the digits, ends
  in, even / odd*): aparece en el feedback de `semaforo`, pero ningún ejercicio lo pregunta.
- **U2-1C-16** — calcular con listas el m.c.d. y el m.c.m. de dos números pequeños.
- **U2-2A-01** — problemas de m.c.d. y m.c.m. con dos datos hasta 100.
- **U2-3A-02** — problema de m.c.m. por factorización con datos de dos cifras (`reloj` lo
  resuelve con listas y con datos hasta 50).

Las demás no son nucleares: U2-1B-06, U2-1C-11 y U2-1C-12 (fuera a propósito: explicar por
qué funcionan los criterios y los criterios del 4 y del 25 son de la hoja y de ampliación),
U2-1C-15, U2-2A-04, U2-2C-15, U2-3A-03, U2-3B-04, U2-3C-07, U2-3C-12, U2-4A-05 y U2-4A-06.
Casi todas son de tres datos o de justificar por escrito.

Para practicarlas hoy quedan las hojas de ejercicios y los cuestionarios; cubrirlas pasa por
añadir un ejercicio a una práctica existente o, ahora que el catálogo no tiene tope
(apartado 3), por una práctica nueva.

## 8. Dónde está lo demás

- El reparto con el que se hicieron: `reparto-practicas-u2/` (`proyecto.md`, las fichas en
  `tareas/`, lo entregado por cada tarea en `salidas/NN-<slug>/ENTREGA.md`).
- La revisión final (tarea 18): `reparto-practicas-u2/salidas/18-revision-final/`, con el
  veredicto práctica a práctica (`VEREDICTO.md`) y lo observado fuera de criterio
  (`HALLAZGOS-FUERA-DE-CRITERIO.md`).
- El modelo de tareas v2: el diseño en `reparto-practicas-u2/salidas/45-diseno-tareas-v2/DISENO.md`
  y la revisión de punta a punta (tarea 55) en `salidas/55-revision-v2/`.
- Tests: `tests/practicas-comun.test.js` (la base) y `tests/practicas-<slug>.test.js`
  (`tests/divisores.test.js` para `divisores/`); las tareas, el plazo y la portada en
  `tests/practicas-semana.test.js`, la nube en `tests/practicas-nube.test.js`, el panel en
  `tests/practicas-resultados.test.js` y el informe en `tests/herramientas-informe.test.js`.
  `npm test` los corre todos.
- Varios profesores (§9): el diseño en `reparto-practicas-u2/salidas/57-diseno-varios-profesores/DISENO.md`
  (aprobado por Juan Luis el 2026-10-17), los códigos de 4 al azar en `salidas/72-codigos-de-4/`
  y la revisión de punta a punta (tarea 69) en `salidas/69-revision-varios-profesores/`. Tests:
  `tests/practicas-{espacio,codigos-4,cifrado,editor,registro}.test.js` (el de la migración de
  la tarea 70 se retiró con su herramienta en la 71; queda en el historial de git) y las
  reglas con `herramientas/probar-reglas.mjs` (§9.8).

## 9. Varios profesores (desde el 2026-10-17)

Construido en las tareas 60-68 y 72 de PU2 sobre el diseño de la 57, y revisado en la 69 (se
entrega). Cada profesor entra en el panel con su cuenta de Google y tiene un **espacio** propio
en la nube con sus alumnos, sus tareas, sus fechas y sus resultados. **Un profesor no puede leer
nada de los alumnos de otro**, ni desde el panel ni sabiendo programar (lo comprueban las reglas
y su banco de pruebas). La guía para los compañeros, en llano, es
[practicas-como-empezar.md](practicas-como-empezar.md).

### 9.1 Quién es profesor

- Entra con **Google** (su cuenta de murciaeduca). Sin alta, el panel dice «Aún no tienes
  acceso. Juan Luis tiene que darte de alta.» y deja una **solicitud** con su correo y su nombre
  (`practicas-solicitudes/{uid}`).
- El **administrador** es el uid de siempre (`esProfesor()` en las reglas, `PROFESOR_UID` en
  `src/config.js`): Juan Luis. Solo él ve la sección **«Profesores»**: las solicitudes («Dar de
  alta», «Rechazar») y los dados de alta («Dar de baja», «Volver a dar de alta»). Dar de alta
  escribe `practicas-profesores/{uid}` con `{ activo: true, alta }`; dar de baja pone
  `activo: false` (el profesor deja de entrar en su espacio; sus datos no se borran).
- **El administrador no ve los alumnos de nadie**: en su panel solo tiene su propio espacio,
  como un profesor más (se da de alta a sí mismo la primera vez que entra en el panel).
  Lo único que no puede prometer ningún diseño: desde la **consola de Firebase** el dueño del
  proyecto ve todos los documentos; por eso en la nube no hay ningún nombre legible (§9.4).

### 9.2 El código del alumno

- **Lo genera el panel del profesor, al azar** (`crypto.getRandomValues`, `codigoSecreto` en
  `practicas/_comun/codigos.js`), con el alfabeto de siempre (sin I, O, 0 ni 1). El profesor elige
  la longitud en «Mis alumnos» (se guarda en su configuración, `longitudCodigo`):
  - **8** (por defecto; se escribe `K7QM-P3XA`): 32⁸ posibilidades, nadie da con uno probando;
  - **4**: más fácil de recordar; se descartan los 1024 calculables del modo antiguo, pero son
    pocos y alguien con paciencia podría encontrar alguno (y ver sus resultados, nunca su nombre).
- Cada código tiene su documento de búsqueda, `practicas-alumnos/{código}` = `{ profesor, n,
  alta }` (`n`, el número de línea de la lista, de 1 a 1023). El alumno lo lee con `get` sin cuenta;
  **nadie puede listar** la colección salvo cada profesor sus propias filas; un código creado no lo
  puede «quedarse» otro profesor.
- **De quién es un código lo dice la nube, no la longitud** (`resolverCodigo` en
  `practicas/_comun/espacio.js`): la búsqueda da su profesor o, si no está registrado (404),
  «Ese código no existe. Copia el de tu correo o usa tu enlace.». Vale igual para los de 8 y
  para los de 4, también para **los 1024 calculables**: los de los alumnos de Juan Luis siguen
  valiendo porque están registrados en su espacio (tarea 70), y uno sin registrar no existe.
  Hasta la tarea 71 un calculable sin registrar iba al modo antiguo; ya no. Sin red, vale la
  copia del navegador; sin copia, se practica igual y solo se guarda en el navegador hasta
  saber de quién es.
- El enlace sigue siendo corto (`practicas/?c=K7QMP3XA`, `semana.html?t=3&c=…`): no lleva el
  profesor. La búsqueda y la configuración del profesor se guardan en el navegador.
- El **código de resultado de la tarea** (20 caracteres, §2) no cambia de formato: lleva el
  número de lista **en la lista de su profesor** (desde 1) y el id de la tarea **de ese
  profesor**. Solo lo interpreta el panel de ese profesor.

### 9.3 Dónde viven los datos

| Qué | Ruta | Lee | Escribe |
|---|---|---|---|
| Solicitudes de alta | `practicas-solicitudes/{uid}` | el interesado y el administrador | el interesado |
| Profesores dados de alta | `practicas-profesores/{uid}` = `{ activo, alta }` | el propio profesor y el administrador | el administrador |
| Búsqueda de códigos | `practicas-alumnos/{código}` = `{ profesor, n, alta }` | cualquiera con `get`; listar, cada profesor lo suyo | el profesor dueño |
| Espacio | `practicas-espacios/{uid}` = `{ lectores, actualizado }` | su dueño | su dueño |
| Tareas y fechas | `…/{uid}/config/tareas` = `{ json, actualizado }` | cualquiera con `get` (no hay datos de alumnos) | su dueño |
| Lista de nombres, cifrada | `…/{uid}/privado/nombres` = `{ v, sal, iv, cifrado, actualizado }` | solo su dueño | su dueño |
| Progreso de práctica libre | `…/{uid}/progreso-libre/{práctica}--{código}` | el alumno con `get`; listar, el dueño y sus lectores | el alumno, si el código es de ese profesor |
| Progreso por tarea | `…/{uid}/progreso-tareas/t{id}--{práctica}--{código}` | ídem | ídem |
| Asignaciones | `…/{uid}/asignaciones/{código}` = `{ tareas, actualizado }` | el alumno con `get`; listar, el dueño y sus lectores | el dueño |
| Fallos | `…/{uid}/fallos/{código}-{hora}-{azar}` | el dueño y sus lectores | el alumno, solo crear |

Los documentos tienen el mismo formato que tenían en las colecciones del modo antiguo
(`practicas`, `practicas-tareas`, `practicas-asignaciones`, `fallos`), que desde la tarea 71
no tienen regla y se borran. Se llama
`progreso-libre` y no `progreso` porque la aplicación antigua de `src/` tiene una regla con
comodín (`{ruta=**}/progreso`) que habría dejado al administrador leerlo (tarea 61). Un
profesor dado de baja no entra en nada de su espacio, y sus lectores tampoco.

### 9.4 Los nombres, cifrados

La lista de «Mis alumnos» se guarda en el navegador sin cifrar (como siempre) y en la nube
**cifrada** con una contraseña que solo sabe el profesor: Web Crypto, PBKDF2-SHA-256 con 600 000
vueltas y AES-GCM de 256 bits (`practicas/_comun/cifrado.js`); contraseña de al menos 10
caracteres y distinta de la de Google. En otro ordenador el panel pide la contraseña y descifra.
**Nadie puede recuperarla**: si se olvida, se vuelve a pegar la lista y se pone otra; los
códigos no se pierden, porque van por número de línea. En la nube solo hay códigos, números de
lista, resultados (con lo que tecleó el alumno al fallar) y esa lista cifrada.

### 9.5 Las tareas de cada profesor

- Viven en su espacio (`config/tareas`): el mismo objeto de `tareas.js`,
  `{ unidades: [{ n, desde }], tareas: [ … ] }` (más `longitudCodigo` si es 4), con las mismas
  comprobaciones (`erroresConfig`). Los títulos de las unidades son comunes (`UNIDADES`); de cada
  profesor son las fechas.
- Se hacen en la sección **«Tareas»** del panel (tarea 67): por unidad, «Nueva tarea», «Editar»
  y «Duplicar»; los ids los pone el editor (el mayor + 1) y no se reutilizan; **desde su `desde`
  una tarea no cambia de ejercicios** (solo título y fechas). «Cargar la plantilla del curso»
  copia las de `tareas.js` (sin tareas, las pone; con tareas, las añade con ids nuevos).
- En el espacio de un profesor la tarea 1 es una tarea más, con su propio progreso. La única
  excepción es la tarea 1 que trajo Juan Luis del modo antiguo al pasar (tarea 70), que conserva
  `progresoPorPractica: true`.
- `tareas.js` es la **plantilla del curso** (lo que copia «Cargar la plantilla del curso») y lo
  que enseñan la portada y la página de la tarea sin código.

### 9.6 El panel

- Entra con Google y abre el espacio; las vistas de §2 son las mismas, leyendo del espacio y con
  las tareas del profesor. **Lee solo lo nuevo**: lo leído se guarda en el navegador (IndexedDB)
  y cada carga pide solo los documentos cambiados desde la última lectura, con un margen de dos
  días hacia atrás (el `actualizado` lo pone el aparato del alumno, y su reloj puede ir
  atrasado); «Volver a leer todo» empieza de cero.
- **«Hoy»** (tarea 68): lo que cuenta el informe diario (alertas, quién no ha entrado, entregas,
  cada ejercicio de la tarea), para los profesores que no reciben correo.
- **«Mis alumnos»**: la lista, la longitud de los códigos, «Generar códigos», la lista cifrada,
  los enlaces por alumno, el CSV (número, nombre, código, enlace) y las tarjetas para recortar.
- Juan Luis (el administrador) tiene además «Profesores» y **«Cuenta lectora del informe
  diario»** (`practicas/profesor-lectores.js`: añade el uid de la cuenta lectora a su espacio).
  Hasta la tarea 71 tenía también el selector de sistema (actual / nuevo) y «Pasar al sistema
  nuevo» (tarea 70); se quitaron con el modo antiguo y su código queda en el historial de git
  (`practicas/profesor-migracion.js`, `herramientas/ensayar-migracion.mjs`).

### 9.7 Dar de alta a un compañero

1. Mándale [practicas-como-empezar.md](practicas-como-empezar.md) y el enlace del panel.
2. Él entra con Google: su solicitud aparece en tu panel, «Profesores → Solicitudes», con su
   nombre y su correo. **Comprueba el correo** (cualquiera con la `apiKey` puede crear una
   cuenta y dejar una solicitud) y pulsa «Dar de alta». Si no es de nadie que conozcas,
   «Rechazar».
3. Él pulsa «Volver a comprobar» y ya está en su espacio. No hay que tocar las reglas ni el
   repositorio.
4. Para quitarle el acceso, «Dar de baja» (sus datos se quedan; «Volver a dar de alta» lo
   devuelve). Borrar sus datos, solo desde la consola.

### 9.8 Las reglas y su banco de pruebas

Las reglas de varios profesores son la sección «Varios profesores» de `firestore.rules`
(desde la tarea 71, sin los bloques del modo antiguo: esas colecciones no tienen regla y
Firestore las deniega). Se publican como siempre
(README, «Puesta en marcha de Firebase»). Después de publicar un cambio:

```
PROFE_A_EMAIL=… PROFE_A_CLAVE=… PROFE_B_EMAIL=… PROFE_B_CLAVE=… node herramientas/probar-reglas.mjs
```

con dos cuentas de prueba de correo y contraseña (Authentication → Add user) dadas de alta como
profesores. Comprueba por REST, contra el proyecto real, cada cosa que un profesor, un alumno
sin cuenta o un lector puede y no puede hacer (154 comprobaciones el 17-10; desde la tarea 71
también que las cinco colecciones del modo antiguo no se leen ni se escriben), y borra lo que crea.
`--baja` comprueba un profesor de baja; `--dejar` no borra los datos de prueba. Sin las
variables solo hace las comprobaciones sin red.

### 9.9 Las cuotas del plan gratuito

El plan gratuito de Firebase (Spark) da **por día** 50 000 lecturas, 20 000 escrituras y 20 000
borrados, y 1 GiB guardado; el contador vuelve a cero a las 9:00 hora peninsular. El cálculo del
diseño (F.7) para el peor día, con unos 400 alumnos practicando todos, es de un 65 % de las
escrituras y un 64 % de las lecturas. Si se pasa, **la app no se rompe**: el progreso queda en el
navegador y sube al día siguiente.

**Cómo mirarlo** (Juan Luis, cada día de la primera semana de los compañeros):

1. https://console.firebase.google.com → el proyecto → **Firestore Database** → pestaña **«Uso»**
   («Usage»).
2. Elige el periodo de los últimos 7 días y mira, **por día**, las lecturas, las escrituras y los
   borrados.
3. **Umbral: el 70 %**, o sea 35 000 lecturas o 14 000 escrituras en un día. Si algún día lo
   pasa, se decide entonces: bajar escrituras (subir el progreso menos a menudo) o pasar al plan de
   pago con una alerta de gasto.

### 9.10 El informe diario en un espacio

Sigue siendo solo para Juan Luis. Lee su espacio con una **cuenta lectora** (correo y
contraseña, solo lectura, añadida en su panel en «Cuenta lectora del informe diario»; nunca ve
los nombres). Desde la tarea 71 es el único modo (hasta entonces, sin `--espacio`, leía sin
cuenta las colecciones del modo antiguo):
`LECTOR_EMAIL=… LECTOR_CLAVE=… node herramientas/informe-actividad.mjs --espacio <uid> --alumnos 51`
(o `--codigos <CSV de «Mis alumnos»>`). La contraseña va en la configuración de la rutina en la
nube, nunca en el repositorio. Los demás profesores ven lo mismo en «Hoy».
