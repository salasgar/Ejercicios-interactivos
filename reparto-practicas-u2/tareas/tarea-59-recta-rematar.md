# Tarea 59 · Recta: rematar los cambios sueltos del feedback, ocultar «Comprobar» y llevar el recuento a logica.js

Actualizado: 2026-10-17
Precondición: ninguna (la 04 y la 58 están LISTAS; la sesión fuera del reparto que dejó cambios sin commit en la recta se cerró, dice Juan Luis el 17-10) · Disparo: MANUAL (sesión atendida)
Duración esperada: 45 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/59-recta-rematar/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/recta/logica.js`, `practicas/recta/practica.js`, `practicas/recta/textos.js` (solo si el recuento se lleva sus textos), `tests/practicas-recta.test.js`, `tests/practicas-comprobar.test.js` (solo quitar la excepción de la recta)

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
   printf 'sesión: %s\ntarea: 59\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/59--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/59--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 59 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/59--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

Tres cosas pendientes en `practicas/recta/`, que se hacen juntas porque tocan los mismos ficheros:

1. **Cambios sin commit de una sesión ya cerrada** (los vio la coordinadora el 17-10; Juan Luis confirma que esa sesión terminó). Están en el árbol de trabajo, sin commit: `practicas/recta/logica.js` (+44 −11) y `tests/practicas-recta.test.js` (+16 −2). Hacen dos cosas en `explicar`:
   - en el ejercicio 1 (múltiplos), los **divisores de n marcados como múltiplos** van en un solo aviso: «2 y 5 son divisores de 10, no múltiplos: no están en la tabla del 10.», o, si los ha marcado todos, «Has marcado los divisores de 10 (1, 2 y 5) en vez de sus múltiplos…» (función `avisoDivisoresMarcados`). Sustituye al aviso anterior «2 no es múltiplo de 4… Es al revés: 4 es múltiplo de 2»;
   - **cada aviso en su línea** (`<br>`) en los ejercicios 1 y 2: «seguidos no se leían».
   Con esos cambios, `node --test tests/practicas-recta.test.js` daba 15 de 15 en verde el 17-10 a las 15:3x UTC.
2. **Ocultar «Comprobar» al responder** (lo que la 58 no pudo hacer aquí por esos cambios ajenos): quitar `recta` de `EXCEPCIONES` en `tests/practicas-comprobar.test.js`.
3. **Llevar el recuento a `logica.js`** (pendiente del 16-10): la función `recuento` de `practica.js` («Has encontrado 8 de los 9 múltiplos de 7. Te falta el 0.») se escribió en la interfaz solo porque `logica.js` estaba ocupado. La lógica pura y probada va en `logica.js`, con test.

## Siguiente paso

1. `git status -sb` y `git diff --stat`: tienen que salir los dos ficheros de arriba con cambios. Si salen otros de `practicas/recta/`, o si `git log -3 -- practicas/recta tests/practicas-recta.test.js` muestra un commit posterior al 17-10 a las 15:30 UTC, alguien ha seguido: para y anótalo como incidencia.
2. Lee `git diff` entero y juzga los cambios con los criterios de `proyecto.md` (reglas de contenido; «divisor», nunca «factor»; los distractores y avisos, inequívocos; el inglés, correcto). Si algo no se sostiene, corrígelo y dilo en la terminada; si todo está bien, se queda tal cual.
3. Después, punto 2 y punto 3 del objetivo.

## Qué hay que hacer

1. **Cambios sueltos:** revisarlos (paso 2 de arriba) y **hacer un commit propio solo con ellos**, antes de tocar nada más, con un mensaje que diga de dónde vienen: «Recta: aviso único de divisores marcados como múltiplos y avisos en líneas (cambios sueltos de una sesión cerrada, revisados en la tarea 59)». Así la historia distingue lo heredado de lo tuyo.
2. **«Comprobar»:** en el manejador de `#comprobar` (`practica.js`, hacia la línea 47), justo después de `if (api.respondido()) return;`, ocultar el botón con `hidden = true` (como `baldosas`). Quitar `recta` de `EXCEPCIONES` en `tests/practicas-comprobar.test.js` (y el objeto queda vacío; déjalo, con su comentario).
3. **Recuento:** pasar `recuento(item, marcados, textos)` a `logica.js` como función pura que recibe la respuesta (array) y el idioma y devuelve el HTML; si sus textos están en `TX.recuento` de `textos.js`, o bien se mueven a `logica.js` como el resto de frases de `explicar`, o bien `logica.js` los importa (mira qué hace hoy `explicar` y haz lo mismo). Decide si `explicar` lo incluye cuando no hay acierto (propuesta: sí, que `practica.js` llame solo a `explicar`) y quita el comentario «PENDIENTE» de `practica.js`.
4. **Tests** en `tests/practicas-recta.test.js`: el recuento en los dos idiomas, con un caso de ejercicio 1 (múltiplos, falta el 0), uno de ejercicio 2 (divisores, sobra uno) y que no aparece cuando la respuesta es correcta.

## Datos de entrada

Comunes (solo lectura): `practicas/baldosas/practica.js` (cómo se oculta el botón), `tests/practicas-comprobar.test.js` (la red de la 58), la ficha `tarea-58-ocultar-comprobar.md`.

## Cómo saber que ha terminado

En local (`npm run servir`, http://localhost:8080/practicas/recta/), con el código de prueba 60 (`7NPD`; nunca el de un alumno), ejercicios 1 y 2, en los dos idiomas y a 375 px:
- falla a propósito marcando en el ejercicio 1 un divisor de n (por ejemplo, con n = 10, el 2 y el 5) y sin marcar el 0: salen el recuento, el aviso único de divisores, el aviso del 0 y la lista, cada uno en su línea;
- «Comprobar» desaparece al responder y queda solo «Siguiente»;
- acierta uno: sin recuento.
`npm test` sin fallos en tus ficheros (incluido `practicas-comprobar`).

## Trampas conocidas

- Los cambios heredados **no son tuyos hasta que los revisas**: no los mezcles en el mismo commit que lo tuyo (punto 1 de «Qué hay que hacer»).
- Nunca `git stash` ni `--autostash` en este árbol (ver la incidencia del 8-10 en el tablón): si `git pull --rebase` se niega por cambios sin commit, primero el commit del punto 1.
- Hay otra sesión de Juan Luis, fuera del reparto, que el 17-10 por la tarde editaba `practicas/profesor.js`, `practicas/resultados.js` y su test: no los toques ni los metas en tus commits.

## Prohibido (propio de esta tarea)

- Tocar algo fuera de «Ficheros que toca».
- Cambiar la corrección (`esCorrecta`), la puntuación o los colores de la rejilla.

## Salida esperada

- Dos commits como mínimo: el de los cambios heredados (revisados) y el tuyo.
- `reparto-practicas-u2/salidas/59-recta-rematar/ENTREGA.md` (hashes, ficheros, qué has cambiado de lo heredado si algo, enlace de GitHub Pages de la recta para que Juan Luis lo mire) y su marcador `ENTREGA.md.ok-<sid>`.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 59, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-59.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/59--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/59--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/59-recta-rematar/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/59--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/59--<sid>.md` con hasta dónde llegaste, la línea
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
