# Tarea 52 · Modelo de tareas v2, I4: la página de la tarea lee el progreso v2 (salvo la tarea 1), plazo, retraso y asignación; portada por unidades plegables

Actualizado: 2026-10-16
Precondición: 51 LISTA · Disparo: MANUAL (sesión atendida)
Duración esperada: 2 h (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/52-pagina-tarea-y-portada/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/semana.js`, `practicas/semana.html`, `practicas/portada.js`, `practicas/index.html`, `practicas/_comun/textos.js` (solo añadir claves si faltan), `tests/practicas-semana.test.js`

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
   printf 'sesión: %s\ntarea: 52\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/52--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/52--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 52 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/52--<sid>.md`)
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

Lo que ve el alumno (DISENO.md, A, B.1, B.2, B.3 «cómo lo lee la app», C.1 y D): la página de la
tarea lee los documentos de la tarea (`practicas-tareas/t<id>--<slug>--<código>`) en las tareas
v2 y los de la práctica en la tarea 1; enseña el plazo, el retraso y si es «obligatoria para ti»;
y la portada se organiza por unidades, la actual abierta y las anteriores plegadas.

## Siguiente paso

1. Lee DISENO.md entero; después `semana.js`, `semana.html`, `portada.js` (`BLOQUES`,
   `SIN_COLETILLA`), `index.html`, las terminadas de la 50 y la 51 (funciones y claves de texto
   nuevas) y `tests/practicas-semana.test.js`.
2. `git status -sb`; no pises cambios ajenos sin comitear.

## Qué hay que hacer

1. **`semana.js`**: para una tarea v2, el progreso de cada práctica de la tarea sale de la clave
   y el documento de la tarea (helpers de la 50), con la misma lectura-fusión que hoy; para la
   tarea 1, como hoy. `estadoTarea` con `diaEntrega`; `estadoPlazo` para pintar: antes del
   plazo «Plazo: jueves 22-10»; pasado sin entregar «Fuera de plazo · N días de retraso»;
   entregada tarde «Entregada con N días de retraso»; a tiempo «✓ Entregada». Cada ejercicio
   terminado después del plazo lleva «fuera de plazo». Los enlaces a los ejercicios siguen
   llevando `semana=<id>`. La línea pequeña con el nombre de la práctica añade «· repaso U1»
   cuando la unidad de la práctica no es la de la tarea (A.6). El código de la tarea
   (desplegable de la 44) sigue, con `diaEntrega`.
2. **Asignación** (B.3): al entrar con el código, leer `practicas-asignaciones/<código>`
   (`leerAsignacion` de la 50, máximo 4 s), copiar en el navegador y usar la copia sin red. Una
   tarea `asignada` sale «obligatoria para ti» a los asignados y como repaso a los demás, sin
   marca alguna.
3. **Portada** (`portada.js`, `index.html`, A.3, A.4): secciones por unidad con «Unidad 2 ·
   Divisibilidad» / «Unit 2 · Divisibility»; la actual (`unidadActual`) arriba y abierta con
   «Tareas» y «Prácticas»; las anteriores en `<details>` plegados (recordar en el navegador
   cuáles están abiertos); dentro de «Prácticas» de la U2 se conservan los `BLOQUES` como
   subtítulos (con campo `unidad`); la U1, lista sin subtítulos; fuera la sección «Repaso de la
   unidad 1» de `BLOQUES` y `SIN_COLETILLA`. Cada tarea con su estado de plazo (misma función).
   Una unidad sin prácticas ni tareas publicadas no sale.
4. **Tests** (`practicas-semana.test.js`): la elección de documento por tarea (tarea 1 →
   práctica; v2 → tarea), las frases de plazo en los cuatro estados (si las funciones de pintado
   son puras), la agrupación por unidad con `unidadActual` y la **regla de publicación**: con
   `t=1` se leen los documentos de la práctica.

## Cómo saber que ha terminado

- `npm test` en verde.
- En el navegador (`npm run servir`), código de prueba 60 (`codigoAlumno(59)`): `semana.html?t=1`
  igual que hoy (progreso de práctica, plazo 22-10, código de 20 en el desplegable); una tarea
  v2 (la 2 por enlace directo, o una de prueba con id alto): su progreso separado, plazo,
  «fuera de plazo» cuando toque (fuerza la fecha en el test, no en producción); portada por
  unidades, en los dos idiomas y a 375 px; una asignación escrita a mano en Firestore para el
  código 60 (pídesela a Juan Luis o usa el SDK con su cuenta si la 53 ya existe) hace que la
  tarea salga «obligatoria para ti».

## Trampas conocidas

- `semana.js` ya lee la nube con fusión (tarea 38): reutiliza esa ruta cambiando solo clave y
  documento; no escribas una segunda lectura.
- La portada se abre sin código («Probar sin código»): sin código no hay asignación ni
  progreso, y debe seguir funcionando.
- `semana.html` perdió `.semana__pedir` en la 47: no la resucites.
- (Sesión 52) La lógica común de página y portada vive en `practicas/vista-tareas.js` (sin DOM, probada); el test que hace `conAlmacen` con `localStorage` falso debe ser `async` y esperar, o el `finally` borra el almacén antes de las comprobaciones.
- (Sesión 52) Al comitear `_ESTADO.md`, otra sesión (la 56) lo había regenerado minutos antes: relee la cabecera antes de editarla.

## Prohibido (propio de esta tarea)

- Tocar `base.js`, `nube.js`, `tareas.js`, `catalogo.js` o el panel.
- Mostrar a los no asignados cualquier marca de que una tarea está asignada a otros.

## Salida esperada

- Los ficheros comiteados; `ENTREGA.md` con hash, capturas o descripción de la portada y de la
  página en los cuatro estados de plazo, y cómo probarlo en 1 minuto; marcador `ENTREGA.md.ok-<sid>`.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 52, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-52.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/52--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/52--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/52-pagina-tarea-y-portada/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/52--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/52--<sid>.md` con hasta dónde llegaste, la línea
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
