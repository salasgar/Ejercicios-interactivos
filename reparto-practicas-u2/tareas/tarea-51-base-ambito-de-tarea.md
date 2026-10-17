# Tarea 51 · Modelo de tareas v2, I3: la base trabaja en el ámbito de una tarea (documento y clave de la tarea), campo tarea en los fallos, frases nuevas

Actualizado: 2026-10-16
Precondición: 49 LISTA (reglas publicadas) y 50 LISTA · Disparo: MANUAL (sesión atendida)
Duración esperada: 2 h (tiempo de sesión, no de persona; real: 15 min el 2026-10-17) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/51-base-ambito-de-tarea/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/base.js`, `practicas/_comun/registro.js`, `practicas/_comun/textos.js`, `tests/practicas-comun.test.js`, `tests/practicas-registro.test.js`

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
   printf 'sesión: %s\ntarea: 51\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/51--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/51--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 51 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/51--<sid>.md`)
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

El corazón del modelo v2 (DISENO.md, C.2): cuando la base se abre desde una tarea v2
(`?ejercicio=n&semana=<id>`, tarea sin `progresoPorPractica`), carga, guarda, lee y sube el
documento **de la tarea** (`practicas-tareas/t<id>--<slug>--<código>`, clave
`practicas.v1.<slug>.<código>.t<id>`), no el de la práctica. La tarea 1 y la práctica libre
siguen exactamente como hoy. Cada fallo registrado dentro de una tarea lleva `tarea: <id>`
(también en la tarea 1).

## Siguiente paso

1. Lee DISENO.md entero (C.2 y D sobre todo); después `base.js` entero (es largo: fíjate en
   `claveProgreso`, `leerYFusionar`, `subir`, `semana`, `abrirEjercicio`, `salirDelEjercicio`,
   `pintarFin`, y dónde se llama a `registrarFallo`), `registro.js`, `textos.js`, la terminada
   de la 50 (firmas nuevas de `nube.js` y `tareas.js`) y los dos tests.
2. `git status -sb`; no pises cambios ajenos sin comitear.

## Qué hay que hacer

1. **Ámbito** (C.2): al arrancar con `semana=<id>`, resolver la tarea (`tareaPorId`); si no
   tiene `progresoPorPractica` y el ejercicio `n` de esta práctica está en ella (★ o elegir), la
   base entra en ámbito de tarea: clave del navegador y documento de la nube los de la tarea
   (helpers de la 50), misma fusión, mismo tope, misma migración por práctica. Si el ejercicio
   no está en la tarea (enlace tocado a mano), se ignora `semana` y se abre en práctica libre.
   El idioma fijado sigue siendo del alumno. En ámbito de tarea nunca se enseña el menú de la
   práctica (ya es así): al salir o terminar, de vuelta a la tarea.
2. **Repetir** dentro de una tarea hecha: como hoy (`practica: true`, solo suma `repeticiones`),
   sobre el progreso de la tarea.
3. **Sin avisos** sobre lo hecho fuera de la tarea (decidido por Juan Luis): nada de «ya hiciste
   este ejercicio».
4. **Registro de fallos** (`registro.js`): `datosFallo` admite `tarea` (entero) y lo manda; la
   base lo pasa siempre que haya `semana` (también en la tarea 1). `leerFallos`/`agruparFallos`
   admiten filtrar por `tarea`.
5. **Textos** (`textos.js`, ES y EN): las frases de plazo y retraso que usará la 52 (B.2: «Plazo:
   jueves 22-10», «Fuera de plazo · 3 días de retraso», «Entregada con 3 días de retraso»,
   «✓ Entregada»), «obligatoria para ti», «repaso», títulos de unidad («Unidad 2 · Divisibilidad»),
   «· repaso U1» para los ejercicios de otra unidad (A.6). Nombres de clave claros; la 52 los
   usará tal cual.
6. **Tests**: con el DOM simulado que ya use `practicas-comun.test.js` (si no hay, con las
   funciones puras que extraigas: `ambitoDe(params, tarea, slug, n)` → `{ tipo: 'practica' |
   'tarea', tareaId }`, y las claves), los casos: tarea 1 → práctica (regla de publicación);
   tarea v2 con ejercicio dentro → tarea; tarea v2 con ejercicio fuera → práctica; sin `semana`
   → práctica. En `practicas-registro.test.js`: `tarea` viaja en el documento del fallo y el
   filtro funciona. **El test de la regla de publicación**: con `semana=1`, la clave y el
   documento son los de la práctica.

## Cómo saber que ha terminado

- `npm test` en verde.
- En el navegador (`npm run servir`), con un código de prueba (número de lista 60, `codigoAlumno(59)`)
  y la tarea de prueba que uses (una v2 con `desde` lejano, o la 2 abriendo el enlace a mano):
  termina un ejercicio desde la tarea → aparece terminado en la tarea (cuando la 52 esté, y
  mientras, en el documento `practicas-tareas/` por REST) y **no** en la práctica libre; haz el
  mismo ejercicio en práctica libre → la tarea no se entera. Con la **tarea 1** (`semana=1`),
  todo como hoy: el progreso va a `practicas/<slug>--<código>`. En dos navegadores, el
  progreso de la tarea se fusiona igual que el de la práctica.

## Trampas conocidas

- `base.js` lo tocaron hoy la 44 y la 47 (`cajaResultado` fuera, `activarCopiar` solo para la
  semana): parte de `main`, no de lo que recuerdes de la documentación.
- La migración de progreso viejo (`migrarProgreso`) va con los parámetros de la práctica: el
  documento de una tarea tiene el mismo formato, así que se aplica igual; no la dupliques.
- Las reglas tienen que estar publicadas (49) antes de probar en la nube; si al escribir sale
  403, no toques las reglas: avisa.
- (2026-10-17, s-20261017T065839-a86bc12f) Con otra sesión editando el panel en el mismo árbol,
  `npm test` falló en dos tests de `resultados.js` que no eran míos. Para saber si el verde es
  tuyo: `git worktree add --detach <scratchpad>/wt HEAD`, copiar allí solo tus ficheros, enlazar
  `node_modules` y `npm test` dentro; `git worktree remove --force` al acabar. Sirve también para
  probar en el navegador sin ficheros ajenos a medias (`python3 -m http.server 8091` en el worktree).
- En zsh, `F="a b"; git add $F` no parte la variable (falla con «pathspec did not match»): las
  rutas, escritas una a una.
- Para el navegador, el ejercicio 3 del semáforo (está en la tarea 2) se contesta por JS: el ítem
  es «¿Es N divisible entre D?»; envolver `window.fetch` en la página muestra cada GET/PATCH a
  `practicas-tareas/` y el `tarea` de cada POST a `fallos`.

## Prohibido (propio de esta tarea)

- Tocar `semana.js`, `portada.js`, el panel, `nube.js` o `tareas.js` (de la 50, 52 y 53); si te
  falta una función en `nube.js`/`tareas.js`, propónla en la terminada y resuélvelo localmente
  en `base.js` mientras tanto.
- Cambiar nada de cómo la tarea 1 lee o escribe.

## Salida esperada

- Los cinco ficheros comiteados; `ENTREGA.md` con hash, las claves de texto nuevas (para la 52)
  y cómo probarlo en 1 minuto con el código 60; marcador `ENTREGA.md.ok-<sid>`.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 51, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-51.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/51--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/51--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/51-base-ambito-de-tarea/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/51--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/51--<sid>.md` con hasta dónde llegaste, la línea
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
