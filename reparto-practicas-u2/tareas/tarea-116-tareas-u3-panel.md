# Tarea 116 · Montar en el panel de la app las cuatro tareas semanales de la unidad 3, con Juan Luis delante (Claude en Chrome)

Actualizado: 2026-10-30 (alta de la coordinadora s-20261030T074933-c1fcc2b1, por encargo de Juan Luis del 30-10: «vamos con las cuatro tareas de la U3»)
Precondición: 93, 94, 95, 96 y 115 LISTAS (lo están: las doce prácticas de la U3 publicadas) · **Juan Luis delante**, con Chrome abierto, la extensión de Claude conectada y su sesión de Google iniciada en el panel · Disparo: MANUAL (sesión atendida) · **Plazo: sáb 14-11** (la tarea 30 del reparto de la U3 programa Classroom con estas tareas; la primera sale el lun 16-11 a las 8:00)
Duración esperada: 1 h (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/116-tareas-u3-panel/` (solo `ENTREGA.md` y su marcador)
Ficheros que toca: **ninguno del repositorio**. Las tareas se crean en la nube (colección `practicas-tareas` del espacio de Juan Luis) desde el editor de tareas del panel, con su cuenta; esta tarea no edita código ni `practicas/_comun/tareas.js`.

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
   printf 'sesión: %s\ntarea: 116\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/116--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/116--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 116 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/116--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.



## Objetivo

Que existan en el panel de Juan Luis las **cuatro tareas semanales de la unidad 3**, tal como las proponen las ENTREGA de las
tareas 93, 94, 95 y 96 (y como las confirmó la 115 para las semanas 2 y 4 tras publicar `dos-signos` y `variacion`): título en los
dos idiomas, unidad 3, `desde`/`hasta`, los ★, los «a elegir» y `nElegir`. Es la precondición externa de la **tarea 30 del
reparto de la U3** (programar en Classroom «3. Interactive exercises · Week N (100 points)»), que tiene plazo el sáb 14-11.

No hay ningún script que cree tareas: las escribe el panel (`practicas/profesor.js`, editor de la tarea 67) con la sesión de
Google de Juan Luis. Por eso esta tarea es **con él delante**: él abre el panel y confirma cada tarea antes de guardarla; tú
manejas el navegador con las herramientas de Claude en Chrome (`mcp__claude-in-chrome__*`) o, si fallan, le dictas los campos.

## Siguiente paso

1. Lee las cuatro propuestas: el apartado «Propuesta de la tarea de la semana N» de `$R/salidas/93-publicar-semana1/ENTREGA.md`,
   `94-publicar-semana2`, `95-publicar-semana3` y `96-publicar-semana4`, y el apartado de propuestas de
   `$R/salidas/115-publicar-84-y-90/ENTREGA.md` (si una carpeta no se llama así, `ls $R/salidas/ | grep -E '^(9[3-6]|115)-'`).
2. Comprueba que todos los slugs que usan están publicados: `grep -n "disponible" practicas/_comun/catalogo.js` para
   `termometro`, `opuestos`, `situaciones`, `saltos`, `leelo3`, `dos-signos`, `signos-producto`, `potencias-enteros`,
   `jerarquia-enteros`, `parentesis-enteros`, `errores3`, `variacion` y `ortografia`. Si alguno no lo está, para y dilo.
3. Lee la skill `anthropic-skills:chrome-browser` y la pantalla «Tareas» del panel en `practicas/profesor.js` (qué campos pide el
   editor y cómo guarda), para saber qué vas a ver.

## Qué hay que hacer

1. **Con Juan Luis**: pídele que abra Chrome con la extensión de Claude conectada y entre con su cuenta en
   `https://salasgar.github.io/Ejercicios-interactivos/practicas/profesor.html`. Tú nunca tecleas credenciales ni ves su
   contraseña. Carga las herramientas de Chrome con **una sola** llamada a ToolSearch, llama primero a `tabs_context_mcp` y
   trabaja en una pestaña nueva. Nada de `alert`/`confirm`, nada de botones de borrar.
2. **Una tarea por semana**, en el editor del panel, con los datos **literales** de la propuesta: título ES/EN, `unidad: 3`,
   `desde`/`hasta` (semana 1: lun 16-11 → jue 19-11; semana 2: lun 23-11 → jue 26-11; semana 3: lun 30-11 → jue 3-12;
   semana 4: lun 7-12 → jue 10-12, con el 7 y el 8 festivos; si una ENTREGA dice otra cosa, manda la ENTREGA), la lista ★,
   la lista «a elegir» y `nElegir`, tipo obligatoria con plazo (como las de la U2), sobre 100 puntos. **Antes de guardar cada
   una, léele a Juan Luis el resumen («6 ★ + 4 de 11, del 16 al 19-11») y que confirme**; después guarda.
3. **Comprobar**: recarga el panel y mira que las cuatro salen en la lista con sus recuentos y fechas; abre la portada de alumno
   con un código de prueba de Claude (60-63, por ejemplo el 61 `KTFN`; **nunca** el de un alumno ni `AJJN`) y comprueba que las
   tareas de la U3 aparecen en su bloque o, si la portada las oculta hasta su `desde`, que el panel las lista como «aún no
   publicadas, desde el 16/11». Ningún nombre de alumno que veas en pantalla se copia a ningún sitio.
4. **ENTREGA**: tabla con el **id** de cada tarea, título, `desde`/`hasta`, recuentos (★, a elegir, `nElegir`, puntos),
   desviaciones respecto a la propuesta y por qué, y la lista exacta que necesita la tarea 30 de la U3 (ids y títulos) para
   programar Classroom. Y qué tal se portó el editor (la pantalla de la 67 se entregó «sin probar en navegador»): si algo falla,
   **no se corrige aquí**: `hechos/reabiertas/67--<sid>.md` con lo exacto, y plan B, Juan Luis lo teclea mientras tú le dictas.
5. Si el editor no admite algo de la propuesta (una fecha, `nElegir`, un ejercicio), no se toca código ni `tareas.js`: se anota
   como propuesta en la ENTREGA y lo decide Juan Luis allí mismo.

## Datos de entrada

- Las ENTREGA de 93, 94, 95, 96 y 115 (solo lectura) y `docs/practicas-unidad3.md` (qué hay publicado).
- `practicas/_comun/catalogo.js` (solo lectura) y `practicas/profesor.js` (solo lectura: el editor).
- El calendario de la U3: `apuntes-1eso-bilingue/3. Integers/reparto-unidad3/proyecto.md` (solo lectura; no se escribe nada en iCloud).

## Cómo saber que ha terminado

- Las cuatro tareas existen en el panel con los datos de las propuestas (o con la desviación anotada y aprobada por Juan Luis
  en la ENTREGA), y recargando el panel siguen ahí.
- La ENTREGA lleva los cuatro ids, y en tu último mensaje le dices a Juan Luis que la tarea 30 del reparto de la U3 ya tiene su
  precondición externa, dónde está la lista (la ENTREGA) y que le falta firmar F12 allí.

## Trampas conocidas

- La pantalla del editor de tareas (tarea 67) se entregó con la lógica probada (14 tests) y **sin probar en navegador**: lo primero
  que puede fallar es la pantalla, no la propuesta. Un fallo de pantalla es una reabierta de la 67, no un parche de esta sesión.
- Claude en Chrome: si una herramienta falla dos o tres veces seguidas, para y díselo a Juan Luis; no insistas ni explores otras
  páginas. Classroom no se toca desde el navegador (no funciona con la extensión y además no es de esta tarea).
- La práctica `ortografia` es compartida con la U2: en cada tarea va **un ejercicio distinto** (`['ortografia', n]`, n según la
  ENTREGA y el calendario de ortografía de `comun/CALENDARIO-CURSO-2026-27.md`).
- Las fechas del editor son días naturales `AAAA-MM-DD`; «hasta» es el jueves (plazo 23:59), no el viernes del examen.
- El panel enseña nombres de alumnos: ni uno en la ENTREGA, en `hechos/` ni en el chat más allá de lo imprescindible.

## Prohibido (propio de esta tarea)

- Editar código, `practicas/_comun/tareas.js` o `catalogo.js`; crear tareas en otro espacio de profesor o de otra unidad.
- Borrar o modificar tareas que ya existan en el panel (las de la U2 y las de clase).
- Guardar una tarea sin que Juan Luis haya confirmado su resumen.
- Copiar nombres o códigos de alumnos a ningún fichero.

## Reglas de contenido

No aplican: esta tarea no produce contenido. Las propuestas que monta ya pasaron la regla de oro y el realismo en las tareas 93-96
y 115; si al leerlas ves algo que no cuadra, no lo cambies: anótalo en la ENTREGA y que lo decida Juan Luis delante.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 116, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-116.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/116--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/116--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/116-tareas-u3-panel/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/116--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/116--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni
  `practicas/_comun/` (salvo la tarea 01 y, en la unidad 3, la 79 y las de publicación 93-96 y la 115, y, en la unidad 4, las 109-111, 117 y 118, cada una en lo que declara), ni `css/estilos.css`, ni `README.md` (salvo
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
- Las reglas de contenido de la unidad que toque (en esta ficha y en `proyecto.md`): en la U4, opciones
  equivalentes por valor, decimales o números mixtos, potencias de base negativa, algo de una sesión posterior a la
  de la destreza, distractores que puedan ser verdad.
