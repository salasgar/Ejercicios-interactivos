# Tarea 37 · Tarea de la semana (página con marcador y código único) y los cuatro arreglos de la base

Actualizado: 2026-10-09
Precondición: 36 LISTA; las reaperturas de la 30 y la 32 del 2026-10-09 (`hechos/reabiertas/30--…-decisiones.md`, `32--…-decisiones.md`) LISTAS, porque tocan `catalogo.js` y `tests/practicas-comun.test.js`; ninguna sesión fuera del reparto con cambios sin comitear en `practicas/_comun/` (`git status`) · Disparo: MANUAL (sesión atendida)
Duración esperada: 2 h (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/37-tarea-semanal/` (solo `ENTREGA.md` y su marcador)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/{base.js,estilos.css,piezas.js,textos.js,codigos.js}`, `practicas/_comun/tareas.js` (nuevo), `practicas/semana.html` y `practicas/semana.js` (nuevos), `practicas/index.html`, `practicas/portada.js`, `practicas/profesor.html`, `practicas/profesor.js`, `practicas/resultados.js`, `practicas/plantilla/` (comentarios y ejemplo), `tests/practicas-comun.test.js`, `tests/practicas-semana.test.js` (nuevo), `docs/practicas-unidad2.md`, `README.md` (apartado de prácticas). `firestore.rules` solo si hiciera falta una colección nueva, y entonces NO se toca: se propone (ver «Si esta tarea resulta ser más de una»).

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
   printf 'sesión: %s\ntarea: 37\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/37--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/37--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 37 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/37--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

Juan Luis va a mandar a los alumnos **una tarea por semana**: un enlace que abre los
ejercicios interactivos de esa semana, con un objetivo que el alumno puede comprobar solo
(«Termina los 6 ejercicios con ★ y 4 más de la lista. Son 100 puntos.»). Hoy la portada
agrupa las prácticas por semanas, pero no hay selección de ejercicios dentro de una práctica,
ni progreso conjunto, ni un resultado por tarea: el alumno entregaría un código por práctica.
Esta tarea construye esa página y, de paso, los cuatro arreglos de la base que pidió la
revisión final, porque tocan los mismos ficheros. Es ALTO porque cambia la base que usan las
31 prácticas y define un formato de código que va a durar todo el curso.

## Siguiente paso

Lee `docs/practicas-unidad2.md` (§1 a §4), `practicas/_comun/{base,codigos,contador}.js`,
`practicas/profesor.js`, `practicas/portada.js` y la temporización
(`reparto-practicas-u2/hechos/notas/s-20261008T174225-f75f5cdb-temporizacion.md`).

## Qué hay que hacer

### A. La tarea de la semana

1. **Los datos**: `practicas/_comun/tareas.js`, una lista de tareas semanales. Cada una: `id`
   (1, 2, 3…; no se renumera, viaja en el código), `titulo { es, en }`, `estrella` (lista de
   `[slug, n]`, ejercicio n de la práctica, empezando en 1), `elegir` (lista igual) y
   `nElegir`. Contenido inicial: las cuatro semanas de la nota de temporización, tal cual.
   Es un fichero que Juan Luis o la coordinadora cambiarán a mano: comentario de cabecera que
   explique el formato, y un test que compruebe que todo `[slug, n]` existe en el catálogo
   (`n ≤ nEjercicios`), que no hay repetidos dentro de una tarea y que `nElegir ≤ elegir.length`.
2. **La página**: `practicas/semana.html?t=<id>` (más el código de alumno y el idioma, como
   viajen hoy en los enlaces del panel). Entrada con el código de alumno igual que en la base.
   Muestra el objetivo en una frase, un marcador («★ 4 de 6 · a elegir 2 de 4 · 60 de 100
   puntos») y dos listas, la de ★ y la de «elige 4», cada ejercicio con su práctica, su
   nombre, su estado (sin empezar / puntos que lleva / terminado) y un enlace que abre **ese
   ejercicio** de esa práctica. Si la base no admite abrir un ejercicio concreto por URL,
   se le añade (`?ejercicio=n`), sin cambiar el comportamiento sin parámetro. Al terminar o
   salir del ejercicio se vuelve a la página de la semana, no al menú de la práctica.
   El progreso se lee de donde la base ya lo guarda (navegador y, si hay, nube): la página no
   guarda un progreso propio que pueda contradecir al de las prácticas.
   Móvil primero: 375 px, todo tocable con el pulgar, español e inglés con el mismo criterio
   de idioma que la base.
3. **Cumplida**: la tarea está cumplida cuando están terminados todos los ★ y al menos
   `nElegir` de los de elegir. Entonces la página lo dice claro y da **un único código de
   resultado de la tarea**. Antes de cumplirla también se puede pedir el código («llevo esto»),
   y dice lo que hay.
4. **El código de la tarea**: formato nuevo en `codigos.js`, que el panel distinga sin
   ambigüedad de los de práctica (16 caracteres) y de los antiguos de `divisores/` (12): otra
   longitud u otra marca. Tiene que decir: de quién es, qué tarea, cuántos ★ y cuántos de
   elegir están terminados (o cuáles, si caben los bits), fallos totales (con tope), día y
   control. Mismo alfabeto, misma idea de enmascarado; no es criptografía y el comentario lo
   dice. El formato lo decides tú y lo documentas en `docs/practicas-unidad2.md`; los códigos
   de práctica existentes NO cambian.
5. **El panel del profesor**: lee mezclados los tres tipos de código; vista nueva «Tareas de
   la semana», una fila por alumno y una columna por tarea (cumplida / ★ x de 6 · y de 4 /
   sin empezar), con CSV. Y genera el enlace de la tarea para cada alumno (o uno común, si el
   código de alumno se teclea al entrar), listo para pegar en Classroom.
6. **La portada** enlaza las tareas de la semana arriba, sin quitar lo que hay.

### B. Los cuatro arreglos de la base (HALLAZGOS-FUERA-DE-CRITERIO.md de la 18, apartado 2)

7. `.cuenta` puede partirse cuando no cabe (sin desbordar a 375 px). Varias prácticas lo
   arreglaron en su CSS: la red de la base no debe romperles nada; comprobar con capturas.
8. `.comprobar[hidden] { display: none; }`.
9. Pieza común de campo numérico en `piezas.js`: campo de texto con teclado numérico, que
   acepta y limpia puntos y espacios de millares («4.730», «4 730») y no deja comprobar vacío.
   Se ofrece y se documenta; **no se cambia ninguna práctica para usarla** (son de sus
   tareas): la terminada lista qué prácticas deberían adoptarla.
10. `generar` recibe el idioma del ítem (segundo argumento u opción), sin romper a las
    prácticas que no lo usan.

### C. Lo que no cambia

El contador (10 puntos, −1 por fallo, 5 vidas, racha de 5: commit 58a9da2), los códigos de
alumno, el formato de los códigos de práctica, `firestore.rules`, y cualquier fichero de
`practicas/<slug>/` o de `divisores/`.

## Datos de entrada

- La nota de temporización (arriba) y `docs/practicas-unidad2.md`.
- `reparto-practicas-u2/salidas/18-revision-final/HALLAZGOS-FUERA-DE-CRITERIO.md`, apartado 2.
- `hechos/notas/s-20261008T173817-contador-contador-por-puntos.md`.

## Salida esperada

- El código de arriba, con sus tests: `tests/practicas-semana.test.js` (datos de `tareas.js`
  coherentes con el catálogo; «cumplida» calculada bien en los casos límite; ida y vuelta del
  código de la tarea para todos los alumnos y todas las tareas; el panel no confunde los tres
  tipos de código) y lo que cambie en `tests/practicas-comun.test.js`.
- `ENTREGA.md` + `.ok-<sid>`, con el enlace de cada tarea y cómo probarla en un minuto.
- En la terminada: el formato del código, qué prácticas deberían adoptar el campo numérico,
  y **los hallazgos fuera de criterio, dichos también a Juan Luis en el mensaje de cierre**.

## Cómo saber que ha terminado

- `npm test` en verde; las 31 prácticas siguen arrancando (la base no ha roto a ninguna:
  abrir cada una en el navegador, o un script que cargue cada `practica.js`).
- Hecho en el navegador, a 375 px, en los dos idiomas: entrar en la tarea 1, terminar un ★,
  volver, ver el marcador moverse, pedir el código, pegarlo en el panel y verlo en la tabla.
- `git push` hecho.

## Trampas conocidas

- El catálogo está lleno (ids 0-31, 5 bits): la tarea de la semana NO es una práctica más
  del catálogo. Su código es un formato aparte.
- El progreso de cada práctica se guarda por práctica y por alumno; un ejercicio puede estar
  en la lista ★ de una semana y haberse terminado antes de que existiera la tarea: cuenta.
- iCloud evacúa ficheros de este árbol (`ls -lO` → `dataless`) y deja copias en conflicto
  dentro de `.git/`; nunca `git stash` ni `--autostash` (`proyecto.md`, «Repositorio git»).
- `criba/3` tenía un defecto el 2026-10-09 (tarea 36): la temporización lo deja entre los de
  elegir de la semana 4; si sigue sin corregir al cerrar, sácalo de `tareas.js` y dilo.
- Las trampas de móvil de la ficha 18 (medir contra 375 fijo; `puppeteer-core` necesita
  `process.exit(0)`) valen aquí.

## Prohibido (propio de esta tarea)

- Editar cualquier fichero de `practicas/<slug>/` (salvo `plantilla/`) o de `divisores/`.
- Cambiar el formato de los códigos de práctica o de alumno, o el contador.
- Tocar `firestore.rules` o crear colecciones: si el diseño lo pide, se propone y se para.
- Decidir qué ejercicios lleva cada semana: eso es de Juan Luis (nota de temporización).

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 37, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-37.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/37--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/37--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/37-tarea-semanal/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/37--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/37--<sid>.md` con hasta dónde llegaste, la línea
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

- En «Al terminar», los pasos 1 y 2 no son los de una práctica: en la 37 los tests propios son `tests/practicas-comun.test.js` y `tests/practicas-semana.test.js`, y lo que se prueba en el navegador es `practicas/semana.html` y un par de prácticas.
