# Tarea 50 · Modelo de tareas v2, I2: unidad y UNIDADES en el catálogo, campos nuevos de las tareas, estado de plazo, y nube.js con colección e id

Actualizado: 2026-10-16
Precondición: 47 LISTA (lo está: d06a9af) · Disparo: MANUAL (sesión atendida)
Duración esperada: 1 h 45 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: 54
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/50-modelo-de-datos/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/catalogo.js`, `practicas/_comun/tareas.js` (incluidas las cuatro tareas de la U1 de la 46), `practicas/_comun/nube.js`, `tests/practicas-semana.test.js`, `tests/practicas-nube.test.js`, `tests/practicas-comun.test.js`

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
   printf 'sesión: %s\ntarea: 50\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/50--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/50--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 50 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/50--<sid>.md`)
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

Los datos y las funciones puras del modelo v2 (DISENO.md, A, B.1, B.2, C.1 y E), sin que nadie
las use todavía: por eso no rompe nada publicado. Después, la base (51), la página de la tarea
(52), el panel (53) y el informe (54) se apoyan en esto.

## Siguiente paso

1. Lee DISENO.md entero; después `catalogo.js`, `tareas.js` (sobre todo `estadoTarea`,
   `tareasPublicadas`, `erroresTareas`), `nube.js` entero y los tres tests.
2. `git status -sb`; no pises cambios ajenos sin comitear.

## Qué hay que hacer

1. **`catalogo.js`** (A.1, A.2, A.5): `unidad` en cada fila (ids 0-15 → 2; 16-30 → 1; plantilla
   → `null`); `export const UNIDADES` con las tres unidades y sus `desde` (confirma con Juan
   Luis las fechas de la U1 y la U2 si está en la conversación; si no, deja las del diseño y
   anótalo); `unidadActual(hoy)` = la última cuyo `desde` ha llegado; nombres sin la coletilla
   «(repaso de la unidad 1)» / «(unit 1 review)», con las dos excepciones del diseño (`errores1`
   → «Caza el error» / «Spot the mistake»; `propiedades` conserva «(ampliación)» /
   «(extension)»). No toques los `id` ni el orden.
2. **`tareas.js`** (B.1, B.2): campos `unidad`, `hasta`, `asignada`, `progresoPorPractica` en
   la definición y en el comentario de cabecera; la tarea 1 con `unidad: 2`,
   `hasta: '2026-10-22'`, `progresoPorPractica: true`; las 2, 3 y 4 con `unidad: 2` y `hasta`
   `'2026-10-29'`, `'2026-11-05'`, `'2026-11-12'`. `estadoTarea` devuelve además `diaEntrega`
   (B.2: el día en que se cumplió por primera vez). Función pura nueva
   `estadoPlazo(tarea, estado, hoyDia, asignadoAMi)` → `{ tipo: 'repaso' | 'obligatoria' |
   'obligatoria_para_ti', entregada, fueraDePlazo, diasRetraso }` según la tabla de B.1 y las
   reglas de B.2 (días naturales). `tareasPublicadas` admite filtrar por unidad.
   `erroresTareas` comprueba lo nuevo (B.1, último punto).
3. **`nube.js`** (C.1, E): las funciones de URL, lectura y escritura reciben la colección y el id
   del documento con valores por defecto `practicas` y `<slug>--<código>`, de modo que **todas
   las llamadas actuales siguen iguales**; helper `idDocumentoTarea(tareaId, slug, codigo)` →
   `t<id>--<slug>--<código>` y `claveProgresoTarea` para el navegador
   (`practicas.v1.<slug>.<código>.t<id>`); lectura sencilla `leerAsignacion(codigo)` →
   `{ tareas: [...] }` o `null`, con el mismo tiempo máximo que la nube.
4. **Las cuatro tareas de la unidad 1** (propuesta de la tarea 46, **aprobada por Juan Luis el
   2026-10-16**): pega en `TAREAS` el bloque de
   `reparto-practicas-u2/salidas/46-tareas-unidad1/PROPUESTA.md`, apartado «Lo que se pega en
   `tareas.js`» (ids 11, 12, 13 y 14, `unidad: 1`, **sin `desde` ni `hasta`**: son de repaso, sin
   plazo, hasta que Juan Luis las active). Lee antes su apartado «Antes de nada: tres cosas que
   cambian lo que pedía la ficha». Si `erroresTareas` protesta por algo del bloque, corrige lo
   mínimo y anótalo en la terminada.
5. **Tests**: `erroresTareas` sin errores con las tareas reales (las ocho: 1-4 y 11-14); `estadoPlazo` en los cuatro
   casos de la tabla y con retraso (entregada 3 días tarde → 3; sin entregar 2 días después del
   plazo → 2 «y subiendo»); `diaEntrega` cuando el alumno siguió haciendo ejercicios después
   de cumplir; `unidadActual` el 15-11 → 2 y el 16-11 → 3; los nombres sin coletilla; en
   `practicas-nube.test.js`, las URL y claves nuevas y que las llamadas sin parámetros dan lo
   de siempre; **y el test de la regla de publicación**: la tarea 1 tiene
   `progresoPorPractica: true` y `erroresTareas` falla si se le quita.

## Cómo saber que ha terminado

- `npm test` en verde; `git grep -n "repaso de la unidad 1" practicas/` solo devuelve, si acaso,
  comentarios.
- La app publicada sigue igual (nada la usa aún): abre `practicas/` y `semana.html?t=1` con
  `npm run servir` y comprueba que todo carga.

## Trampas conocidas

- `portada.js` quita la coletilla con la expresión `SIN_COLETILLA`: al quitarla del catálogo la
  expresión deja de encontrar nada, y no pasa nada; la 52 la borra. No toques `portada.js` aquí.
- `codigoTarea` usa el `dia` de `estadoTarea`: pasarle `diaEntrega` es lo que dice el diseño
  (E, `codigos.js` sin cambio de formato); si lo haces aquí, que el test de códigos siga en verde.

## Prohibido (propio de esta tarea)

- Tocar `base.js`, `registro.js`, `textos.js`, `semana.js`, `portada.js`, el panel o el informe:
  son de la 51 a la 54.
- Renumerar ids o cambiar el `desde` de la tarea 1.

## Salida esperada

- Los seis ficheros comiteados; `ENTREGA.md` con el hash, la lista de funciones nuevas y sus
  firmas (para la 51-54), y el marcador `ENTREGA.md.ok-<sid>`.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 50, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-50.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/50--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/50--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/50-modelo-de-datos/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/50--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/50--<sid>.md` con hasta dónde llegaste, la línea
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
