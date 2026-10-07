# Tarea 34 · Añadir al catálogo las filas 17 a 30 (prácticas de repaso de la unidad 1)

Actualizado: 2026-10-07
Precondición: 01 LISTA · Disparo: MANUAL (sesión atendida)
Duración esperada: 30 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/34-catalogo-u1/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/catalogo.js` (solo añadir filas) y `tests/practicas-comun.test.js` (solo las tres líneas que dependen del catálogo), **en el mismo commit**

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
   printf 'sesión: %s\ntarea: 34\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/34--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/34--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 34 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/34--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

Que las tareas 20 a 33 puedan empezar sin tocar un fichero común: esta tarea añade sus
filas al catálogo de la base y nada más. Las filas están aquí escritas; es MEDIO y no BAJO porque hay que tocar también el test
común, siguiendo al pie de la letra la nota de la tarea 01:
`reparto-practicas-u2/hechos/notas/s-20261007T192646-341f1b98-para-la-34.md` (léela entera antes
de empezar).

## Siguiente paso

Lee `practicas/_comun/catalogo.js`. Si las filas 17 a 30 ya están (porque la tarea 01 las
incluyó al leer esta ficha), comprueba que coinciden con la tabla de abajo, escribe la
terminada diciendo «ya estaban, verificadas» y cierra: la tarea es idempotente.

## Qué hay que hacer

Añade estas entradas, con la misma forma que las existentes (`disponible: false` si la 01
usa ese campo):

| id | slug | ruta | nombre es | nombre en | nEjercicios | tarea |
|---|---|---|---|---|---|---|
| 17 | jerarquia | jerarquia/ | ¿Qué se hace primero? (repaso de la unidad 1) | What comes first? (unit 1 review) | 4 | 20 |
| 18 | exponente | exponente/ | El exponente y su base (repaso de la unidad 1) | The index and its base (unit 1 review) | 3 | 21 |
| 19 | raiz | raiz/ | Raíz cuadrada con cuadrados (repaso de la unidad 1) | Square roots with squares (unit 1 review) | 3 | 22 |
| 20 | division | division/ | División entera: cajas y resto (repaso de la unidad 1) | Division with remainder: boxes (unit 1 review) | 4 | 23 |
| 21 | expresion | expresion/ | Del enunciado a la expresión (repaso de la unidad 1) | From words to expression (unit 1 review) | 3 | 24 |
| 22 | redondeo | redondeo/ | Redondeo y estimación (repaso de la unidad 1) | Rounding and estimating (unit 1 review) | 3 | 25 |
| 23 | constructor | constructor/ | Constructor de números (repaso de la unidad 1) | Number builder (unit 1 review) | 3 | 26 |
| 24 | distributiva | distributiva/ | Distributiva con rectángulos (repaso de la unidad 1) | Distributive property with rectangles (unit 1 review) | 3 | 27 |
| 25 | potencias10 | potencias10/ | Potencias de 10 y números grandes (repaso de la unidad 1) | Powers of 10 and big numbers (unit 1 review) | 3 | 28 |
| 26 | dictado | dictado/ | Dictado de números (repaso de la unidad 1) | Number dictation (unit 1 review) | 3 | 29 |
| 27 | mental | mental/ | Cálculo mental con estrategia (repaso de la unidad 1) | Mental maths strategies (unit 1 review) | 3 | 30 |
| 28 | especiales | especiales/ | Potencias especiales: ¿verdadero o falso? (repaso de la unidad 1) | Special powers: true or false? (unit 1 review) | 2 | 31 |
| 29 | errores1 | errores1/ | Caza el error (unidad 1) | Spot the mistake (unit 1) | 3 | 32 |
| 30 | propiedades | propiedades/ | Propiedades de las potencias (ampliación de la unidad 1) | Laws of indices (unit 1 extension) | 3 | 33 |

Después, en `tests/practicas-comun.test.js` (detalle en la nota de la 01):
1. Línea ~36: la lista entera de `[id, slug, nEjercicios]` del test debe incluir las catorce
   filas nuevas entre `[16, 'parentesis', 4]` y `[31, 'plantilla', 2]`, con los mismos datos.
2. Línea ~50: `assert.equal(practicaPorId(30), null)` deja de ser verdad; cámbialo por
   `practicaPorId(32)`.
3. Línea ~155: la comprobación con `codigoResultado(30, …)` como «práctica que no existe» se
   **quita** (no se sustituye: con 5 bits y los ids 0-31 ocupados no queda ningún id libre).

`node --test tests/practicas-comun.test.js` en verde y `npm test` entero en verde. **Un solo
commit** con los dos ficheros: `git add practicas/_comun/catalogo.js tests/practicas-comun.test.js && git commit -m "Catálogo: prácticas de repaso de la unidad 1 (ids 17-30)" -- practicas/_comun/catalogo.js tests/practicas-comun.test.js`.
Si solo comiteas el catálogo, GitHub Actions deja de publicar.

## Datos de entrada

- `practicas/_comun/catalogo.js` tal como lo dejó la tarea 01.
- La ficha de la tarea 01, §1, para la forma de cada entrada.

## Salida esperada

- `practicas/_comun/catalogo.js` con las 14 filas y `tests/practicas-comun.test.js` ajustado.
- `reparto-practicas-u2/salidas/34-catalogo-u1/ENTREGA.md` + `.ok-<sid>`.

## Cómo saber que ha terminado

- `grep -c "slug: '" practicas/_comun/catalogo.js` (o el equivalente según la forma del
  fichero) da 14 más que antes; `npm test` en verde.

## Trampas conocidas

- Los ids 0 a 16 y el 31 ya están ocupados; no los toques ni los reordenes.
- **Con las filas 17-30 el catálogo queda lleno** (ids 0-31: el código de resultado reserva
  5 bits para la práctica). No cabe ninguna práctica más sin cambiar el formato del código;
  si alguien lo pide, es decisión de la coordinadora, no de esta tarea.

## Prohibido (propio de esta tarea)

- Tocar cualquier otro fichero (salvo las tres líneas del test), incluida la portada: la portada se adapta sola si lee el
  catálogo (tarea 01) o la ajusta la 18.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 34, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-34.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/34--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/34--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/34-catalogo-u1/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/34--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/34--<sid>.md` con hasta dónde llegaste, la línea
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

- En «Al terminar», paso 1, esta tarea no tiene test propio: basta `npm test` entero.
