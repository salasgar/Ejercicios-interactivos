# Tarea 243 · «Caza el error» de la unidad 5 (errores5): el fallo de cuenta en las columnas

Actualizado: 2026-11-23 (alta de la coordinadora s-20261123T105616-5abfb78b, a petición de Juan Luis)
Precondición: — (el modelo, errores3, está en `main`: commit 8ef414a) · Disparo: MANUAL (sesión atendida)
Duración esperada: 40 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/243-errores5-fallo-cuenta/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/errores5/*`, `tests/practicas-errores5.test.js`, `tests/practicas-ayuda-errores5.test.js`

La duración esperada no es informativa: de ella sale la caducidad del reclamo (2 ×, mínimo
45 min). **Este fichero es la fuente de la banda**: el tablón la copia de aquí cada vez que se regenera
(ALTO = Opus 5.5, esfuerzo Alto; MEDIO = Sonnet 5.5, esfuerzo Medio).

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
   printf 'sesión: %s\ntarea: 243\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/243--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/243--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 243 con `abierto:` más antiguo (o igual y sid menor), añade a tu
   reclamo una línea `CEDIDA a <sid del otro>` y elige otra tarea.
5. Si el reclamo que encuentras está caducado (RELEVABLE en el tablón), relévalo con la
   línea `releva a: <sid anterior>` **en tu propio reclamo**; el suyo no se toca. Después
   mira qué dejó hecho: `ls practicas/`, `git log --oneline -5`, `git status -sb`, y la
   carpeta de salida. Lo que haya con tests en verde se hereda y se dice en la terminada;
   lo que no, se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** (todas las filas contra `hechos/` y la
   hora real; banda y «encadenable» recopiadas de las fichas) antes de empezar, y sigue
   con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.
   Si hay otras sesiones en el árbol (`.claude/sesiones/`), retoque de tus filas y del registro, no regeneración completa.
7. Idempotencia: comprueba si `practicas/<tu slug>/` o tu test ya existen (de una sesión
   caída) antes de crearlos. Si existen, léelos y continúa desde ahí.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/243--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Qué es (común a las tareas 240-244)

Decisión de Juan Luis del 23-11: en las columnas de «Caza el error» (fase 2, tareas 234-238) puede salir **una columna
con un error que no está en el catálogo: un fallo de cuenta** (aplica bien el método y se equivoca al operar). Esa
columna se marca igual que las demás, pero **no lleva la pregunta tipo test** (no hay nombre que preguntar) y su
explicación no tiene regla en negrita: «Se ha equivocado al hacer la cuenta.», la cuenta bien hecha («13 + 3 = 16, no
17.») y «Lo correcto es: = 16».

**Modelo: errores3, commit 8ef414a.** Léelo antes de nada (`git show 8ef414a`): en `practicas/errores3/logica.js`,
`CUENTA`, `CERCANOS`, `conNombre`, `columnaDeCuenta`, el trozo nuevo de `generarDonde` y `explicaColumna`; en
`textos.js`, `TX.fallo_cuenta` y `explicacionColumnas`; y el test «el fallo de cuenta (sin nombre)…».

Las condiciones, las mismas que en el modelo:
- **Como mucho una columna de fallo de cuenta por ítem**, solo cuando el ítem lleva **una** columna mala con nombre (así
  siguen siendo 1-2 malas) y siempre al menos un error con nombre (la práctica va de los errores típicos).
- **Sale de una ruta buena que no está en el ítem** (no un calco de otra columna) y se equivoca en **la última cuenta**:
  un resultado **cercano** al bueno, que no puede coincidir con el resultado de ninguna otra columna ni con lo que daría
  **un error con nombre** del catálogo aplicado a esa cuenta (en errores3, 5 − 7 = −12 es «suma aunque los signos son
  distintos», no un despiste; ni el signo cambiado). Si no hay valor seguro, ese ítem va sin fallo de cuenta.
- La pregunta tipo test, solo para las columnas con nombre; la `solucion` del marcado incluye la columna de la cuenta.
- Al registrar el fallo (`api.responder`, `error`), la columna de la cuenta anota `fallo-de-cuenta`.
- Tests como los del modelo: como mucho una; la última línea; cerca del bueno; distinta de las demás columnas y de los
  errores con nombre aplicables; no es un calco; preguntas solo con nombre; la tarjeta del «No lo sé» con
  `TX.fallo_cuenta` y sin regla en esa columna; y que salga en al menos un 8 % de los ítems.

## Lo propio de esta práctica

Decimales. Es la práctica donde más falta hace: con pocos errores por familia, solo un 8 % de los ítems llevan 4 columnas (ENTREGA de la 237). El fallo cambia **una cifra** del resultado (la de las unidades o la última decimal, ±1), **nunca la posición de la coma** (eso es el error con nombre «ha puesto mal la coma»), ni da el resultado de alinear a la derecha, de añadir un cero o de redondear mal. Compara por valor con `decimales.js` (3,50 y 3,5 son el mismo número: no es un fallo).

## Cómo saber que ha terminado

- `npm test` en verde, con los tests nuevos.
- Probada en Chrome (`npm run servir`, http://localhost:8080/practicas/<slug>/?probar=1&ejercicio=N&idioma=es, y `idioma=en`): un ítem
  con fallo de cuenta, acertando (marcar sus dos columnas malas y contestar solo la pregunta de la de nombre) y fallando; «No lo sé».
  Si la sesión no puede abrir Chrome, dilo en la terminada (no lo sortees).
- La ENTREGA dice en qué familias sale el fallo de cuenta y en qué porcentaje de los ítems.

## Trampas conocidas

- (Del modelo) Un número cercano puede ser justo un error con nombre aplicado a la última cuenta: compruébalo con las
  funciones del catálogo de la unidad, no a ojo.
- (Del modelo) La corrección de la columna de la cuenta es solo un número: si un test pide textos de más de 3
  caracteres, exclúyela ahí.
- (Aprendida en la 243) El fallo de cuenta solo cabe donde la última línea es «= número» tras una cuenta de números; en redondeo (`≈`), comparación, periódicos y división con resto no sale. La explicación lleva fracciones con raya (`htmlLinea`), así que el helper `sinHtml` del test de «cuatro cifras enteras» tiene que separar numerador y denominador (65 y 100, no 65100).
- Si una familia no tiene ninguna ruta buena que no salga en el ítem, ese ítem va sin fallo de cuenta: no lo fuerces.

## Prohibido (propio de esta tarea)

- Tocar `practicas/_comun/` o `practicas/errores3/`: lo que falte, propuesta en la terminada.
- Más de una columna de fallo de cuenta por ítem, o un ítem sin ningún error con nombre.
- Un fallo de cuenta que pueda leerse como otro método correcto o como un error con nombre.

## Salida esperada

`reparto-practicas-u2/salidas/243-errores5-fallo-cuenta/ENTREGA.md` y su marcador `ENTREGA.md.ok-<sid>`; el código en los ficheros de arriba.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 243, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-243.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/243--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/243--<sid>.md` con `parada por: mal cortada`
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
   `git add <rutas> && git commit -m "<qué>" -- <rutas>`. Apunta el hash
   (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/243-errores5-fallo-cuenta/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cotas de realismo, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/243--<sid>.md`: hash del commit, ficheros (lo que dice
   `git show --stat`, no lo que crees), número de tests propios en verde, hora y
   **duración real** (de `abierto:` a ahora), y propuestas pendientes si las hay.
5. Añade `CERRADA` a tu reclamo (línea propia que empieza por esa palabra).
6. Choques encontrados → `$R/hechos/incidencias/<sid>.md`.
7. `git fetch origin`, relista `$R/hechos/` **ahora** y regenera `$R/_ESTADO.md` (entero si
   no hay otras sesiones en el árbol; si las hay, retoque de tus filas y del registro):
   banda y «encadenable» recopiadas de las fichas, leyenda de bandas de `proyecto.md`. Anota qué
   tareas pasan de BLOQUEADA a PENDIENTE. Si tu duración real difiere mucho de la estimada,
   díselo al usuario.
8. Vuelca abajo, en «Trampas conocidas» de esta ficha, lo que hayas aprendido por las
   malas (es lo único de la ficha que editas, además de la duración).
9. Un solo commit con rutas explícitas de tus ficheros de `$R/hechos/` (por sid), tu
   carpeta de `$R/salidas/`, `$R/_ESTADO.md` y esta ficha, y `git push origin main`. Si el
   push se rechaza: `git pull --rebase origin main`, regenera el tablón otra vez desde
   `hechos/` (no lo fusiones a mano) y vuelve a comitear y empujar. **Nunca si `main` lleva
   commits ajenos sin empujar**: incidencia y díselo al usuario.
10. Dile al usuario la **foto del momento** en tres líneas («EN CURSO: … · LIBRES ahora: … ·
    BLOQUEADAS: …»), sacada de la lectura de `hechos/` del paso 7, y después, **solo para las
    LIBRES**, las frases de arranque de `proyecto.md` literales, en bloques de cita, una por
    sesión que quepa a la vez, con la tarea o la cadena, la banda traducida y el nombre de
    sesión delante.
11. Decide si encadenas (solo en verde: misma banda, tarea corta, sin esperas; si tu frase
    de arranque nombra la cadena, encadenas por defecto) o paras. Si encadenas, «Antes de
    empezar» entero otra vez, con reclamo nuevo, y di el nombre nuevo que te toca.

Si paras sin terminar: `$R/hechos/fallos/243--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni
  `practicas/_comun/` (salvo la tarea 01; en cada unidad, su base y sus tareas de publicación; cada una en lo que declara), ni `css/estilos.css`, ni `README.md` (salvo
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
  CDN; las prácticas no usan ni siquiera KaTeX (exponentes con `<sup>`; las fracciones con
  `htmlFraccion`).
- Las reglas de contenido de la unidad de la práctica (`proyecto.md`, apartado de su unidad) y la regla de oro de los distractores del `CLAUDE.md` del repositorio.
