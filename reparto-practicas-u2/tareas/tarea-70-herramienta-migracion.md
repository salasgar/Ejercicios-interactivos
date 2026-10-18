# Tarea 70 · Varios profesores, N10 (rehecha el 17-10): pasar a Juan Luis al sistema nuevo con sus códigos de siempre (lo antes posible)

Actualizado: 2026-10-17
Precondición: **para preparar y ensayar, 72 LISTA** (en paralelo con la 69: ficheros disjuntos); **para EJECUTAR el paso, 69 LISTA con veredicto «se entrega» y Juan Luis delante**, la primera noche que él pueda (Juan Luis, 17-10: «Cuanto antes, mejor») · Disparo: MANUAL (sesión atendida, CON Juan Luis delante)
Duración esperada: 2 h (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/70-herramienta-migracion/` (`ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/profesor-migracion.js` (nuevo), `practicas/profesor.html` (solo el botón y su sección), `practicas/profesor.js` (solo para enganchar la sección), `practicas/_comun/textos.js`, `herramientas/informe-actividad.mjs` (solo si hace falta para la rutina), `tests/practicas-migracion.test.js` (nuevo)

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
   printf 'sesión: %s\ntarea: 70\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/70--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/70--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 70 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/70--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Lo común a las tareas 61-72 (varios profesores)

- **La especificación es `reparto-practicas-u2/salidas/57-diseno-varios-profesores/DISENO.md`**, aprobado entero por Juan Luis el 2026-10-17. Léelo entero antes de empezar (no solo tu apartado). Lo que esté mal pensado se propone en la terminada; no se cambia por tu cuenta.
- **El modo antiguo no se rompe nunca**: hasta la migración de Juan Luis (vuelta de Navidad) sus 51 alumnos siguen con códigos de 4 caracteres, `tareas.js` y las colecciones `practicas`, `practicas-tareas`, `practicas-asignaciones` y `fallos`. Cada tarea lo comprueba con un test (la longitud del código decide el modo: 4, antiguo; 8, nuevo).
- **Nada de datos reales en el repositorio**: ni nombres, ni códigos de alumnos, ni uids de compañeros, ni contraseñas. Las cuentas de prueba y sus contraseñas, por variables de entorno.
- **Código de prueba del modo antiguo**: 60 (`7NPD`), 61-63. Nunca el de un alumno.
- Decisiones de Juan Luis posteriores al diseño (17-10): el centro ha dicho que **sí** se puede usar su proyecto de Firebase con alumnos de sus compañeros (G, resuelto); los compañeros empiezan el **lunes 14-12** (la 69 tiene que estar LISTA con «se entrega» antes); **códigos (17-10, noche): Juan Luis pasa YA al sistema nuevo, y sus alumnos conservan sus códigos de 4 de siempre, registrados en `practicas-alumnos` como si fueran al azar** («Nadie va a fisgonear en las tareas de mis alumnos; te lo garantizo»: acepta que esos códigos se puedan calcular). Sus alumnos nuevos de cursos próximos, códigos de 4 al azar; los de los compañeros, de 8 (tarea 72). El paso de Juan Luis lo hace la 70 **lo antes posible** (Juan Luis, 17-10 noche: «Me va bien cualquier momento. Cuanto antes, mejor»): la herramienta y el ensayo de la 70 se preparan **en paralelo con la 69** en cuanto la 72 esté LISTA (la 69 prueba con los códigos 60 y 61; el ensayo de la 70, con el 62 y el 63), y el paso se ejecuta con él delante en cuanto la 69 dé «se entrega», de noche (después del informe de las 21:30 y antes de las 7:00), aunque la tarea 1 siga abierta.
- Hay una sesión de Juan Luis fuera del reparto que el 17-10 por la tarde editaba `practicas/profesor.js`, `practicas/resultados.js` y su test: antes de tocar esos ficheros, `git status`; si hay cambios sin commit que no son tuyos, no los pises y avisa.

## Objetivo

Pasar a Juan Luis al sistema nuevo **ya**, con sus alumnos conservando sus códigos de 4 de siempre (decisión suya del 17-10; ver «Lo común» y la ficha 72). Sustituye a la migración de E.4 del diseño, que daba códigos nuevos el 1 de enero: ya no hay códigos nuevos ni correo a los alumnos, y los enlaces repartidos (`?c=<código>`) siguen valiendo.

Cuándo: lo antes posible (Juan Luis, 17-10: «Me va bien cualquier momento. Cuanto antes, mejor»), de noche, después del informe de las 21:30 y antes de las 7:00, aunque la tarea 1 (hasta el jueves 22-10 a las 23:59) siga abierta. Por eso el paso tiene que dejar bien la tarea 1 en el panel (`progresoPorPractica`) y el informe de la noche siguiente leyendo del espacio. Se propuso el fin de semana del 24-25-10 y él prefirió no esperar.

## Siguiente paso

1. Lee DISENO.md (E, F.3), las terminadas de la 61 a la 69 y la 72, y la nota de la 68 para la 70 (`f9d33d6`: los lectores listan `practicas-alumnos`).
2. Mide antes cuántos documentos hay en `practicas`, `practicas-tareas`, `practicas-asignaciones` y `fallos` (con la cuenta de Juan Luis en el panel, o pídeselo): de eso dependen las cuotas del día del paso (F.7: 20 000 escrituras al día).

## Qué hay que hacer

1. **Herramienta «Pasar al sistema nuevo»** en el panel (solo el administrador, una sola vez, con confirmación escrita y un modo de ensayo):
   - **Registrar los códigos de siempre** en `practicas-alumnos`: para cada número `n` de su lista (1-51, y los que añada) `codigoAlumno(n − 1)` con `{ profesor: su uid, n }`; y **AJJN con `n: 1000`** (su alumno de prueba). Los de prueba de Claude (60-63) **no**: se registran en el espacio del profesor de prueba A, para que no salgan en su panel.
   - **Copiar** a su espacio, con los mismos ids: progreso libre (`practicas/<slug>--<código>` → `progreso-libre`), progreso por tarea (`practicas-tareas` → `progreso-tareas`), asignaciones y **fallos** (si son menos de ~8 000; si son más, se para y se le pregunta).
   - **Su configuración**: `TAREAS` de `tareas.js` y las fechas de `UNIDADES`, **con los mismos ids de tarea** (los enlaces `semana.html?t=N` siguen valiendo), y `longitudCodigo: 4`.
   - **Orden**: primero copiar, después registrar (registrar es lo que cambia a los alumnos de sistema); si algo falla a medias, se puede repetir sin duplicar.
2. **Ensayo** con un profesor de prueba y los códigos **62 y 63** (en su espacio; el 60 y el 61 los usa la 69, que puede estar corriendo a la vez: no los toques): todo copiado, y con esos códigos la portada, una práctica y `semana.html?t=1` enseñan su progreso de antes.
3. **El día del paso**, con Juan Luis delante: descargar antes el CSV de «Qué falla más»; ejecutar; comprobar con AJJN y con dos alumnos al azar (sin abrir su sesión: leyendo sus documentos) que su progreso está en el espacio; que la tarea 1 (`progresoPorPractica`) sale bien en el panel; y el informe diario: que Juan Luis cree la cuenta lectora, la añada como lectora en su panel, y la rutina pase a `--espacio` con esa cuenta (la contraseña, en la configuración de la rutina, nunca en el repositorio).
4. Las colecciones del modo antiguo **se quedan como están** (nadie escribe ya en ellas): las limpia la 71, con firma, cuando Juan Luis lo diga.
5. Tests de la lógica de copia y registro con datos inventados (qué se copia, con qué id, que repetir no duplica, que AJJN entra con `n: 1000`).

## Cómo saber que ha terminado

- El ensayo con 62 y 63 sale bien, con el resultado en `ENTREGA.md`.
- El día del paso: los alumnos de Juan Luis entran con su código de siempre y ven su progreso; el panel de Juan Luis lee de su espacio; el informe de esa noche llega leyendo del espacio.
- `npm test` en verde.

## Trampas conocidas

- Si un alumno practica durante el paso, su progreso queda en su navegador y se fusiona al volver (la base fusiona lo local con la nube): no se pierde, pero dilo en la entrega.
- AJJN es el número 1000 (no está en la lista de 51): por eso la 72 sube el tope de `n` en las reglas a 1023.
- (s-20261017T215325-bbc75a2d) **«Primero copiar, después registrar» es imposible**: las reglas solo dejan escribir en el
  espacio documentos de códigos ya registrados a nombre del dueño (`alumnoDe`). Se registra primero y se copia fusionando
  (nunca pisa, repetir no escribe nada).
- `erroresConfig` rechazaba `progresoPorPractica` en un espacio y el editor de tareas se lo quitaba a la tarea 1 al
  guardar: la tarea 1 de Juan Luis habría dejado de leer la práctica libre. Arreglado en tareas.js y profesor-tareas.js.
- La API de las rutinas **no admite variables de entorno en la rutina** («not supported on triggers»): las credenciales de
  la cuenta lectora van en las variables del entorno en la nube («Default»), que edita Juan Luis en claude.ai, junto con
  los dominios permitidos (`firestore.googleapis.com`, `identitytoolkit.googleapis.com`).
- Una pestaña del panel abierta antes de un cambio de `TAREAS` copia las tareas viejas: recargar con Cmd+Shift+R (aviso de
  la 76, que cambió la tarea 2 y la 3 esa misma noche).
- En el panel no había dónde añadir la cuenta lectora (hallazgo 1 de la 69): va en la sección del paso.
- Los profesores de prueba no pueden listar las colecciones antiguas ni leer `fallos`: el ensayo lee documento a documento
  y no copia fallos.

## Prohibido (propio de esta tarea)

- Ejecutar el paso de verdad sin Juan Luis delante, o borrar nada (es la 71, con firma).
- Dar códigos nuevos a los alumnos de Juan Luis.

## Salida esperada

- Los ficheros de «Ficheros que toca» cambiados y comiteados, con `npm test` en verde.
- `reparto-practicas-u2/salidas/70-herramienta-migracion/ENTREGA.md` (hash, ficheros, lo comprobado con su resultado literal, lo que queda para la tarea siguiente) y su marcador `ENTREGA.md.ok-<sid>`.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 70, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-70.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/70--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/70--<sid>.md` con `parada por: mal cortada`
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
   `git add <rutas> && git commit -m "Práctica <slug>: <qué>" -- <rutas>`. Apunta el hash
   (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/70-herramienta-migracion/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/70--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/70--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni
  `practicas/_comun/` (salvo la tarea 01 y, en esta, lo declarado en «Ficheros que toca»), ni `css/estilos.css`, ni `README.md` (salvo
  01, 18 y lo declarado arriba), ni `firestore.rules` ni `src/firebase.js` (salvo 01 y lo declarado arriba), ni fichas ajenas, ni
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
