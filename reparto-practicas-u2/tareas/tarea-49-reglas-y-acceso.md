# Tarea 49 · Modelo de tareas v2, I1: reglas de Firestore y acceso a datos (practicas-tareas, practicas-asignaciones, campo tarea en fallos)

Actualizado: 2026-10-16
Precondición: ninguna (47 LISTA). Atendida: Juan Luis publica las reglas en la consola de Firebase durante la sesión · Disparo: MANUAL (sesión atendida)
Duración esperada: 45 min (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/49-reglas-y-acceso/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `firestore.rules`, `src/firebase.js`

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
   printf 'sesión: %s\ntarea: 49\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/49--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/49--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 49 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/49--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## La especificación es el diseño aprobado

Todo lo que esta ficha pide está detallado en
`reparto-practicas-u2/salidas/45-diseno-tareas-v2/DISENO.md` (tarea 45, **aprobado entero
por Juan Luis el 2026-10-16**): léelo antes que nada, entero, y después los apartados que
cita esta ficha. Si algo del diseño resulta mal pensado al implementarlo, **no lo cambies por
tu cuenta**: hazlo como está si funciona, o propón el cambio en tu terminada y para en ese
punto si no funciona. Lo que el diseño marca «decidido por Juan Luis» no se discute.

**Regla de publicación (DISENO.md, D):** cada commit a `main` se publica solo en GitHub Pages y
hay 51 alumnos haciendo la **tarea 1** hasta el jueves 22-10. La tarea 1 se queda con el modelo
de hoy para siempre (`progresoPorPractica: true`): su progreso sigue en `practicas/<slug>--<código>`,
lo de la práctica libre le cuenta, su código de resultado no cambia y los enlaces
`semana.html?t=1&c=<código>` y `semana.html?t=1` siguen igual. **Al cerrar, tu tarea deja la
tarea 1 funcionando exactamente como hoy y lo comprueba con un test.** No hay ventana de
publicación: se publica cuanto antes sin tocar la tarea 1 (decisión de Juan Luis que sustituye
a la ventana 23-25 de octubre que aparece en la ficha 45).

## Objetivo

Primer paso del modelo v2 (DISENO.md, E y F/I1): las reglas de Firestore de las dos colecciones
nuevas y el campo `tarea` del registro de fallos, y las funciones de acceso con la cuenta del
profesor en `src/firebase.js`. **Las reglas van antes que el código que las usa** (DISENO.md, D):
si el código escribiera en una colección sin regla, el alumno perdería progreso en la nube.

## Siguiente paso

1. Lee DISENO.md entero; después `firestore.rules` entero (los bloques `practicas/{doc}` y
   `fallos/{id}` son el modelo), `src/firebase.js` y `practicas/_comun/nube.js` (cómo se lee y
   escribe por REST, para probar).
2. `git status -sb`; si hay cambios sin comitear en tus ficheros, no los pises.

## Qué hay que hacer

1. **`firestore.rules`**, dos bloques nuevos copiando el de `practicas/{doc}`:
   - `practicas-tareas/{doc}`: id `^t[0-9]{1,4}--[a-z0-9-]+--[A-HJ-NP-Z2-9]{4}$`; `read` solo el
     profesor; `get` con ese id; `create, update` con `estado` texto de menos de 4000 caracteres y
     `actualizado` entero, `hasOnly(['estado', 'actualizado'])`.
   - `practicas-asignaciones/{codigo}`: id `^[A-HJ-NP-Z2-9]{4}$`; `get` cualquiera; `read` (list) y
     `write` solo el profesor; `tareas` lista de enteros y `actualizado` entero.
   - En `fallos/{id}`: el campo opcional `tarea` (entero entre 1 y 1023) añadido a `hasOnly` y
     comprobado si está.
2. **`src/firebase.js`**: funciones con la cuenta del profesor (SDK) para listar
   `practicas-tareas`, listar `practicas-asignaciones` y guardar una asignación
   (`setDoc` de `practicas-asignaciones/<código>` con `{ tareas, actualizado }`). Sigue el estilo
   de lo que ya hay en el fichero.
3. **Publicación de las reglas**: pídele a Juan Luis en la conversación que pegue
   `firestore.rules` en la consola (Firestore Database → Reglas → Publicar) y espera a que diga
   que está. Después comprueba por REST, sin autenticación (como `nube.js`): un `GET` de
   `practicas-tareas/t999--semaforo--XXXX` (código de prueba del número de lista 60:
   `codigoAlumno(59)`) da 404 y no 403; un `PATCH`/`create` de ese documento con `estado` y
   `actualizado` pasa; un `GET` de la colección (`list`) da 403; un `GET` de
   `practicas-asignaciones/<ese código>` da 404 y no 403; un `create` en `fallos/` con `tarea: 1`
   pasa y con `tarea: 'x'` falla. Borra el documento de prueba si puedes (solo el profesor
   puede: pídeselo o déjalo anotado en la terminada).

## Cómo saber que ha terminado

- Las comprobaciones REST del punto 3, con el resultado literal en `ENTREGA.md`.
- `npm test` en verde (no hay test de reglas; no rompas los demás).

## Trampas conocidas

- Juan Luis ya ha publicado reglas dos veces con este patrón (tareas 38 y 39): mira sus
  terminadas por si dejaron algo escrito sobre la consola.
- Sin las reglas publicadas, la 51 (base) y la 53 (panel) no pueden cerrarse: por eso esta es
  atendida y corta.
- (2026-10-17, s-20261016T210110-64cbee4b) `tests/practicas-registro.test.js` lee
  `firestore.rules` y exige que `hasOnly` de `fallos/` sea igual a los campos de `datosFallo`:
  tocar esa regla rompe `npm test`, y `pages.yml` no despliega con tests en rojo. Hubo que
  tocar ese test (de la 51) aunque la ficha no lo listaba.
- Las reglas de Firestore no pueden comprobar el tipo de cada elemento de una lista: «lista de
  enteros» se queda en `is list` + tamaño, y lo asegura el código del profesor.
- Enlace directo a las reglas en la consola:
  https://console.firebase.google.com/project/ejercicios-interactivos/firestore/databases/-default-/rules
  Juan Luis puede tardar horas en publicarlas: alarga la caducidad antes de esperar y, si caduca
  igualmente, comprueba que nadie te ha relevado antes de seguir.
- Duración real: ~15 min de trabajo; la espera de la publicación, aparte.

## Prohibido (propio de esta tarea)

- Tocar cualquier fichero de `practicas/`, los documentos de alumnos reales, o las reglas de
  `practicas/{doc}` y `divisores/` (la tarea 1 depende de ellas).

## Salida esperada

- `firestore.rules` y `src/firebase.js` comiteados; `ENTREGA.md` con las comprobaciones y la
  confirmación de que las reglas están publicadas; marcador `ENTREGA.md.ok-<sid>`.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 49, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-49.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/49--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/49--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/49-reglas-y-acceso/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/49--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/49--<sid>.md` con hasta dónde llegaste, la línea
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
