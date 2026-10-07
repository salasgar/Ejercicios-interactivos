# Tarea 14 · Caza el error: ¿hay error?, señala el paso y nombra el error, con lo que NO es un error

Actualizado: 2026-10-07
Precondición: 01 LISTA · Disparo: MANUAL (sesión atendida)
Duración esperada: 2 h (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/14-errores/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/errores/*` (nuevo), `tests/practicas-errores.test.js` (nuevo)

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
   printf 'sesión: %s\ntarea: 14\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/14--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/14--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 14 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/14--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

La base del examen acumulativo de la semana 4: reconocer y nombrar el error en un
procedimiento resuelto, y saber lo que no es un error (divisor y factor, GCD y HCF, dos
árboles distintos, el orden de los factores). Destrezas: U2-4C-01 (reconocer y nombrar el
error: la tabla de errores típicos de toda la unidad), U2-4C-02 (lo que no es un error),
U2-4C-03 (resultado razonable), y como repaso todas las destrezas cuyos errores aparecen.

## Siguiente paso

1. Lee la ficha de la tarea 01 (`reparto-practicas-u2/tareas/tarea-01-base-comun.md`),
   apartados §1 (catálogo), §2 (`aritmetica.js`: no reescribas lo que ya está ahí) y §3
   (el contrato de `arrancar(practica)` y la `api` de `montar`), y después
   `practicas/plantilla/practica.js` entero con sus comentarios, `practicas/_comun/aritmetica.js`
   (los exports reales mandan sobre esta ficha si difieren) y `practicas/_comun/estilos.css`.
   Si la terminada de la 01 (`reparto-practicas-u2/hechos/terminadas/01--*.md`) anuncia
   cambios del contrato, mandan sobre esta ficha.
2. Copia `practicas/plantilla/` a `practicas/errores/` (si no existe ya de una sesión caída)
   y cambia el `<title>`, el `slug` y el icono.
3. Escribe primero `logica.js` (generadores y comprobaciones, puro) con su test
   `tests/practicas-errores.test.js`, en verde, y solo después `montar` y los textos.

## Qué hay que hacer

Un **banco de procedimientos** en `textos.js`: al menos **24 plantillas**, cada una con
`{ id, lineas: (params) => [{ es, en }…] (2 a 4 líneas), error: null | { linea, nombre } , numeros: rng => params }`.
Al menos 8 plantillas con `error: null` (procedimientos correctos, incluidos los «no
errores» de U2-4C-02: una factorización con los factores en otro orden, dos árboles
distintos que llegan a lo mismo, «6 es factor de 24» junto a «6 es divisor de 24», «HCF(24,
36) = 12», «lowest common multiple», «divisible por» y «divisible entre»). Los **nombres de
error** son una lista cerrada en los dos idiomas (`NOMBRES`), de 10 a 12 entradas, por
ejemplo: «ha cruzado las reglas del m.c.d. y el m.c.m.», «ha calculado el m.c.m. solo con
los primos comunes», «ha tratado la potencia como un producto», «ha usado la última cifra
para el criterio del 3», «ha confundido el criterio del 3 con el del 9», «ha dejado un
factor compuesto sin descomponer», «ha confundido múltiplo con divisor», «ha dado 0 como
m.c.d.», «ha olvidado el 1 y el propio número entre los divisores», «ha sumado los minutos
de cien en cien», «ha dicho que un impar es primo», «ha dado el m.c.d. como número de
trozos». Cada plantilla con error apunta a uno de ellos y el error está en una línea
concreta. Las plantillas son procedimientos de alumno (texto corto con cuentas, no prosa).

Tres ejercicios:

1. **¿Hay un error?** Se muestra el procedimiento (líneas numeradas); botones «Está bien»
   / «Hay un error». Mitad y mitad. Feedback: si está bien, por qué lo que parecía raro no
   es un error («el orden de los factores no importa: 3 · 2² · 5 = 2² · 3 · 5»); si hay
   error, la línea y la corrección con los números.
2. **Señala el paso.** Solo procedimientos con error; cada línea es un botón. Acierto si
   toca la línea del error. Feedback: la línea corregida.
3. **Nombra el error.** Solo con error; cuatro nombres de `NOMBRES`: el correcto y tres que
   **no pueden aplicarse** a ese procedimiento (la plantilla declara `excluidos` si algún
   nombre podría confundirse; el generador nunca saca esos como distractores). Acierto si
   elige el nombre correcto.

Ítem: `{ tipo: 'hay' | 'linea' | 'nombre', plantilla, params, lineas, error, opciones, solucion }`.

## Datos de entrada

Comunes a todas las prácticas (solo lectura): `practicas/_comun/*` (la base), `practicas/plantilla/*`
(el ejemplo), `divisores/app.js` (fichas que se arrastran con pointer events, si hace falta
arrastrar), el inventario `inventario-unidad2.tsv` de la carpeta de apuntes (ruta en `proyecto.md`)
para el texto exacto de cada destreza, y las «Reglas de contenido comunes» de `proyecto.md`.
Propios de esta tarea:

- `contenidos-unidad2-resumen.tex`, apartado «Errores más frecuentes» (y su versión
  inglesa en `unit2-contents-summary.tex`), en la carpeta de apuntes (solo lectura): la
  tabla de errores típicos de la unidad. Los nombres de `NOMBRES` salen de ahí.
- `inventario-unidad2.tsv`: las notas «Error típico…» de cada fila, y las filas U2-4C-01 y
  U2-4C-02.

## Cómo saber que ha terminado

- Test: cada plantilla produce líneas en los dos idiomas con cualquier `params`; las
  plantillas con error tienen `linea` dentro del rango y `nombre` en `NOMBRES`; en el
  ejercicio 3 los tres distractores no están en `excluidos` y son distintos del correcto;
  en 3000 ítems del ejercicio 1 salen «bien» y «error» entre el 40 % y el 60 %; cada una de
  las entradas de `NOMBRES` es el error de al menos una plantilla.
- Revisión a mano obligatoria (regla de oro): para cada plantilla con error, comprueba que
  **solo un** nombre de la lista describe lo que pasa (si dos valen, añade el otro a
  `excluidos`); para cada plantilla sin error, comprueba que de verdad no lo tiene. Anótalo
  en `ENTREGA.md`.
- Navegador: procedimientos de 4 líneas con potencias legibles en 375 px.

## Trampas conocidas

- Un procedimiento con dos errores es un ítem inválido para los ejercicios 2 y 3: cada
  plantilla con error tiene exactamente uno.
- «Divisible por» y «divisible entre» valen las dos en español, pero «divisible between»
  en inglés es un error (U2-1B-02): esa plantilla tiene `error` en inglés y… no: una
  plantilla no puede ser error en un idioma y correcta en otro. Haz dos plantillas
  distintas: «divisible between» (error, solo tiene sentido en inglés: su versión española
  dice «divisible entre», que es correcta, así que esa plantilla **se marca `soloEn: true`**
  y no sale con el idioma español) y «divisible por» (sin error).

## Prohibido (propio de esta tarea)

- Marcar como error algo de la lista de pares válidos de U2-4C-02.
- Procedimientos con contenidos no dados (letras, ecuaciones, criterios del 4 y 25).

## Salida esperada

- `practicas/errores/index.html`, `practica.js`, `logica.js`, `textos.js`, `estilos.css`
  (vacío si no hace falta nada propio). `logica.js` puro: sin DOM ni red.
- `tests/practicas-errores.test.js`: para cada ejercicio, al menos 1000 ítems generados con
  semilla fija y comprobados contra definiciones **independientes** por fuerza bruta (no
  contra las funciones de `aritmetica.js`): la respuesta correcta es verdad, cada opción
  dada por falsa es falsa (regla de oro), y no gana quien pulsa siempre lo mismo (ninguna
  opción es correcta en más del 70 % de los ítems de un ejercicio de elegir).
- `reparto-practicas-u2/salidas/14-errores/ENTREGA.md` con su marcador `.ok-<sid>`.
- En la terminada: la petición a la tarea 18 de poner `disponible: true` en el catálogo
  para `errores` (si la base usa ese campo), y cualquier propuesta de cambio del contrato.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 14, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-14.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/14--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/14--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/14-errores/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/14--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/14--<sid>.md` con hasta dónde llegaste, la línea
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

- 2026-10-07 (tarea 14): `generar(rng, sesion)` no recibe el idioma del ítem, así que una plantilla «solo en inglés» (divisible between) es imposible: no la intentes sin que la base pase el idioma. Los verificadores del test conviene escribirlos por línea («válida frente a las anteriores») y exigir que la única falsa sea la declarada.
