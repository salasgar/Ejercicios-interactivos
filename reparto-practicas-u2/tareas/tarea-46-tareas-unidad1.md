# Tarea 46 · Propuesta (para Juan Luis) de las cuatro tareas de la unidad 1 con las 15 prácticas de repaso existentes

Actualizado: 2026-10-16
Precondición: ninguna (es una propuesta de contenido; su configuración en `tareas.js` esperará al campo `unidad` de la implementación de la 45) · Disparo: MANUAL (sesión atendida)
Duración esperada: 1 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/46-tareas-unidad1/` (`PROPUESTA.md`, `ENTREGA.md` y su marcador)
Ficheros que toca (ninguna otra tarea en paralelo los toca): solo su carpeta de salida. No toca `practicas/`.

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
   printf 'sesión: %s\ntarea: 46\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/46--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/46--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 46 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/46--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

Juan Luis quiere que cada unidad tenga sus tareas semanales. Las de la unidad 1 no existen,
y las 15 prácticas de repaso de la U1 sí (catálogo, ids 16 a 30: paréntesis, jerarquía,
exponente, raíz, división entera, del enunciado a la expresión, redondeo, constructor,
distributiva, potencias de 10, dictado, cálculo mental, potencias especiales, caza el error
de la U1, propiedades de las potencias). Esas cuatro tareas son **sobre todo para el curso
que viene** y, mientras, repaso para quien lo necesite (haya suspendido la U1 o no), a veces
obligatorio para todos o para algunos (modelo de la tarea 45).

Esta tarea produce la **propuesta de composición**: qué ejercicios lleva cada una de las
cuatro semanas, con qué ★ y cuáles de elegir, cubriendo las destrezas nucleares de la U1 en
el orden en que se dieron. La decide Juan Luis; aquí se le prepara con criterio.

## Siguiente paso

1. Lee el inventario de destrezas de la unidad 1 (solo lectura): `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/1. Natural numbers, powers and roots/cuestionarios/comun/reparto/salidas/06-reserva/inventario-unidad1.tsv`
   (si la ruta ha cambiado, búscalo con `find … -name 'inventario-unidad1.tsv'`), y la
   secuenciación de la U1 (`…/apuntes-1eso-bilingue/secuenciación-unidad1.tex`) para saber en
   qué semana se dio cada cosa.
2. Lee, de cada una de las 15 prácticas, `practicas/<slug>/textos.js` (nombre y detalle de cada
   ejercicio) y el apartado de destrezas de su ficha (`reparto-practicas-u2/tareas/tarea-19-…`
   a `tarea-33-…`): ahí está qué destreza cubre cada ejercicio.
3. Mira cómo están compuestas las cuatro tareas de la U2 en `practicas/_comun/tareas.js` (6 ★
   + 8 a elegir 4 = 100 puntos) y la nota de temporización
   `reparto-practicas-u2/hechos/notas/s-20261008T174225-f75f5cdb-temporizacion.md`.

## Qué hay que hacer

- Cuatro tareas, una por semana de la U1 (la temporización de la U1 fue de cuatro semanas:
  números naturales y operaciones; potencias; raíces; operaciones combinadas y problemas,
  compruébalo en la secuenciación), con el mismo formato que las de la U2: 6 ★ que cubran las
  destrezas nucleares de esa semana y 8 a elegir 4, de los que 1 o 2 pueden ser repaso de la
  semana anterior. Cada ejercicio con su destreza (id del inventario) al lado.
- Para cada tarea, la tabla ejercicio → destreza, y la lista de destrezas nucleares de la U1
  que **ninguna práctica cubre** (son candidatas a prácticas nuevas para el curso que viene:
  propuesta aparte, sin montarlas).
- Título bilingüe de cada tarea, al estilo de las de la U2 («Semana 1 · …» / «Week 1 · …»).
- Dos variantes de uso que Juan Luis tiene que decidir: como repaso sin plazo (las cuatro
  visibles desde ya), o solo las que él active. La propuesta no decide eso: lo pregunta.

## Datos de entrada

Los de «Siguiente paso». Todo es de solo lectura.

## Cómo saber que ha terminado

- `PROPUESTA.md` con las cuatro tareas en el formato exacto de `tareas.js` (un bloque de
  código JavaScript listo para pegar cuando exista el campo `unidad`, con `unidad: 1` y sin
  `desde`), las tablas ejercicio → destreza, y la lista de destrezas sin cubrir.
- Juan Luis ha visto la propuesta (en la conversación) y ha dicho qué cambia; se anota en
  `ENTREGA.md`. Si no está delante, la propuesta se entrega como pendiente de su visto bueno.

## Trampas conocidas

- Los `id` de las tareas nuevas tienen que ser enteros distintos de 1-4 y menores que 1024
  (viajan en el código de la tarea); propón 11, 12, 13, 14 y que la coordinadora lo confirme.
- Un mismo ejercicio puede ir en dos semanas, pero hasta que la 45 esté implementada
  aparecería ya terminado la segunda vez: dilo en la propuesta donde lo uses.
- (2026-10-16, s-20261016T144913-715ee461) **El inventario de la U1 no marca nucleares**
  (272 filas, sin columna). Lo más parecido son las 20 destrezas de cada examen semanal:
  `…/1. Natural numbers, powers and roots/exámenes-semanales/semana-N/clave-semanaN.json`,
  campo `destrezas`.
- La secuenciación buena es la de la carpeta de la unidad
  (`…/1. Natural numbers, powers and roots/secuenciación-unidad1.tex`, 17-09); la de
  `apuntes-1eso-bilingue/` es más antigua y distinta. Las semanas de la U1 son: 1 números
  naturales y redondeo; 2 operaciones, división y propiedades; 3 potencias y raíces; 4
  jerarquía y problemas.
- Hay 47 ejercicios, no 49 (`mental` tiene 2; `errores1`, 4). Los `practica.js` no se
  pueden importar con node mientras otra sesión tenga a medias `_comun/codigos.js`: los
  nombres se leen con `git show HEAD:practicas/<slug>/textos.js`, y el bloque de tareas se
  valida con `erroresTareas` sobre una copia de `practicas/_comun` sacada con `git archive HEAD`.

## Prohibido (propio de esta tarea)

- Tocar `tareas.js` o cualquier fichero de `practicas/`.
- Inventar destrezas que no estén en el inventario, o dar por nuclear lo que el inventario
  no marque como tal.

## Salida esperada

- `reparto-practicas-u2/salidas/46-tareas-unidad1/PROPUESTA.md`, `ENTREGA.md` y su marcador.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 46, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-46.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/46--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/46--<sid>.md` con `parada por: mal cortada`
y la ruta de la incidencia, `ABANDONADA` en tu reclamo, y díselo al usuario. Si un paso te
pide **decidir** algo que va a durar (un cambio del contrato de la base, otro número de
ejercicios que el del catálogo, una colección nueva en Firestore) y esta tarea no es de
banda ALTA con el usuario delante, no lo decidas: entrégalo como propuesta en tu terminada
y sigue con lo que no dependa de ello.

## Al terminar

(Esta tarea no tiene código: en los pasos 1 y 2, en lugar de tests y commit de código, basta con que `PROPUESTA.md` esté escrita y comiteada con rutas explícitas.)

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
3. Escribe `$R/salidas/46-tareas-unidad1/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/46--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/46--<sid>.md` con hasta dónde llegaste, la línea
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
