# Tarea 40 · Semáforo de divisibilidad: botón «Ninguno / None», Check solo con algo pulsado y corrección visible de cada botón

Actualizado: 2026-10-16
Precondición: ninguna (la 02 está LISTA; para este cambio la dueña de `practicas/semaforo/` es esta tarea) · Disparo: MANUAL (sesión atendida)
Duración esperada: 45 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: 41, 42
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/40-semaforo-ninguno/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/semaforo/practica.js`, `practicas/semaforo/textos.js`, `practicas/semaforo/estilos.css`, `practicas/semaforo/logica.js` (solo si hace falta la frase del caso «ninguno» en `explicarSemaforo`), `tests/practicas-semaforo.test.js`

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
   printf 'sesión: %s\ntarea: 40\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/40--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/40--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 40 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/40--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

Juan Luis, revisando la app el 2026-10-16, sacó en el ejercicio 1 («Semáforo básico») un
número que no era divisible entre 2, 3, 5, 9 ni 10 y no encontró cómo contestar: no hay
botón «Ninguno», y la única forma de acertar es pulsar Check sin encender nada, cosa que
nada dice. El generador produce ese caso a propósito (`nAlAzar` en `logica.js`: alrededor
de 1 de cada 11 ítems en el ejercicio 1 y 1 de cada 40 en el 2) y es pedagógicamente
valioso: obliga a afirmar «ninguno» en vez de encender algo por encender. Hay que hacerlo
visible y, de paso, que un Check sin contestar deje de acertar por azar.

Lo decidido con Juan Luis (no se rediscute):

1. Un botón **«Ninguno» / «None»** al final de la fila de los divisores, en los ejercicios 1
   y 2 (`montarSemaforo`), excluyente con los números: pulsarlo apaga todos los números
   encendidos; encender un número lo apaga a él.
2. **Check deshabilitado** (`disabled`) mientras no haya nada pulsado, ni número ni
   «Ninguno»; se habilita y deshabilita al vuelo.
3. Al corregir, **«Ninguno» también se pinta** con el mismo código de cuatro estados que los
   números (ver «Qué hay que hacer», punto 4).

## Siguiente paso

1. Lee `practicas/semaforo/practica.js` entero (146 líneas), `practicas/semaforo/textos.js`,
   `practicas/semaforo/logica.js` (solo `generarSemaforo1/2`, `esCorrecta` y
   `explicarSemaforo`) y `practicas/_comun/estilos.css`, líneas 114-124 (`.botones-numeros`).
2. `git log --oneline -5 -- practicas/semaforo practicas/_comun/estilos.css` y `git status -sb`:
   si hay cambios sin comitear en `practicas/semaforo/`, son de otra sesión (fuera del
   reparto hay una que arregla los colores de los botones encendidos, ver «Trampas»); no
   los pises: espera a que estén comiteados o anótalo como incidencia y cede.
3. Primero `textos.js` y `practica.js`; después el CSS; después el test; al final la prueba
   en el navegador con un ítem de conjunto vacío (ver «Cómo saber que ha terminado»).

## Qué hay que hacer

1. **Texto.** En `textos.js`, dentro de `TX.ej1` o como clave común a los dos ejercicios
   (`TX.semaforo.ninguno`), `{ es: 'Ninguno', en: 'None' }`. Nada más cambia de texto.
2. **Botón.** En `montarSemaforo`, tras los botones de `item.divisores`, un `<button
   type="button" class="ninguno" aria-pressed="false">` con ese texto. Estado interno: el
   `Set` `encendidos` ya existente más un booleano `ninguno`. Al pulsarlo (si no se ha
   respondido): `ninguno = true`, vaciar `encendidos`, poner `aria-pressed="false"` en todos
   los números y `"true"` en él. Al pulsar un número: `ninguno = false` y `aria-pressed="false"`
   en «Ninguno», además de lo que ya hace.
3. **Check.** `#comprobar` nace `disabled` y se recalcula tras cada pulsación:
   `disabled = !ninguno && encendidos.size === 0`. La respuesta que se corrige sigue siendo
   `[...encendidos]` (`esCorrecta` ya acepta el vector vacío; no se toca).
4. **Pintado tras Check**, mismo código para números y para «Ninguno» (es el que la sesión de
   los colores está fijando en toda la app):
   - pulsado y correcto → clase `bien` (verde relleno);
   - pulsado y erróneo → clase `mal` (rojo, número tachado);
   - no pulsado pero era correcto → clase `falta` (borde verde de puntos, como la casilla
     olvidada de la práctica «recta» y el banco de «rectangulos», commit 31733ea);
   - no pulsado y no era correcto → nada (gris atenuado de `:disabled`).
   Para «Ninguno», «correcto» significa `item.correctos.length === 0`. Hoy los números no
   pulsados pero correctos reciben `bien`: pasan a `falta`.
5. **CSS propio** (`practicas/semaforo/estilos.css`): el botón «Ninguno» se distingue de los
   números (por ejemplo `min-width` mayor, fondo blanco y borde del color primario, texto
   en 1 rem), y encendido se ve igual de encendido que un número. Si el CSS común aún no
   trae las reglas de `button.bien`, `button.mal` (tachado) y `button.falta` con
   `opacity: 1` que pesen más que `[aria-pressed="true"]` y que `:disabled`, cópialas aquí
   tal como están en `practicas/rectangulos/estilos.css` (ver «Trampas»). No toques el común.
6. **Explicación.** Comprueba qué devuelve `explicarSemaforo` cuando `item.correctos` está
   vacío: si solo lista «2: no (…)», «3: no (…)», añade al final una frase de cierre en los
   dos idiomas («No es divisible entre ninguno de ellos» / «It is not divisible by any of
   them»), en `logica.js` o en `textos.js` según dónde viva el texto. Si ya la dice, nada.
7. **Test** (`tests/practicas-semaforo.test.js`): (a) con semilla fija, 2000 ítems de
   `generarSemaforo1` tienen al menos un 3 % de conjunto vacío y 2000 de `generarSemaforo2` al
   menos un 1 % (si no, el botón no sirve para nada); (b) `esCorrecta(item, [])` es `true`
   exactamente cuando `item.correctos` está vacío; (c) si has añadido la frase de cierre,
   `explicar` la incluye en `es` y en `en` cuando el conjunto es vacío y no la incluye cuando
   no lo es. El DOM no se testea.

## Datos de entrada

Comunes (solo lectura): `practicas/_comun/*`, en especial `estilos.css` (`.botones-numeros`,
líneas 114-124) y `piezas.js`; `practicas/rectangulos/estilos.css` y `practicas/rectangulos/practica.js`
(`montarBanco`, líneas 101-150: el mismo patrón de botones que se encienden con las clases
`bien`/`falta`/`mal` ya puestas) y `practicas/recta/` (la casilla olvidada con borde de puntos).
Reglas de contenido comunes de `proyecto.md`.

## Cómo saber que ha terminado

En el navegador (`npm run servir`, http://localhost:8080/practicas/semaforo/), en español y en
inglés, ventana estrecha (375 px) y ancha:

- Al abrir un ítem, Check está deshabilitado y «Ninguno» apagado. Enciendo el 2: Check se
  habilita. Pulso «Ninguno»: el 2 se apaga y «Ninguno» se enciende. Pulso el 5: «Ninguno» se
  apaga. Apago el 5: Check vuelve a deshabilitarse.
- Un ítem con conjunto vacío (en el ejercicio 1 sale aproximadamente 1 de cada 11; sigue
  jugando hasta que aparezca, o fuerza uno en la consola llamando al generador con
  distintas semillas): con «Ninguno» pulsado → acierto, «Ninguno» en verde; con un número
  pulsado → fallo, ese número en rojo tachado y «Ninguno» con borde de puntos.
- Un ítem normal con «Ninguno» pulsado → fallo, «Ninguno» en rojo y los divisores correctos
  con borde de puntos. El caso de la captura de Juan Luis (4150 con 9 y 10 pulsados): 10 en
  verde relleno, 9 en rojo tachado, 2 y 5 con borde de puntos, 3 gris.
- `node --test tests/practicas-comun.test.js tests/practicas-semaforo.test.js` en verde y
  `npm test` sin fallos en tus ficheros.

## Trampas conocidas

- **El CSS común tapa `.bien`/`.mal` en un botón encendido.** `.botones-numeros
  button[aria-pressed="true"]` tiene más peso que `.botones-numeros .bien` y `:disabled`
  baja la opacidad a .5, así que un botón pulsado se queda azul y atenuado acierte o no (es
  lo que Juan Luis vio en su captura: el 9 y el 10 iguales). El commit 31733ea lo arregló
  solo en `practicas/rectangulos/estilos.css`; una sesión fuera del reparto lo está moviendo
  al CSS común el 2026-10-16. Mira `git log -3 -- practicas/_comun/estilos.css`: si ya está,
  usa las clases y no dupliques; si no, copia las tres reglas a `semaforo/estilos.css`. Si
  después el común las trae, las tuyas sobran pero no estorban.
- `api.respondido()` manda: ningún botón, tampoco «Ninguno», cambia nada después de
  responder.
- La fila es `display: flex; flex-wrap: wrap`: en 375 px con seis números y «Ninguno» cabe
  en dos filas; comprueba que «Ninguno» no queda solo en una fila rara (si queda, un
  `margin-left` pequeño o `flex-basis: 100%` lo deja debajo, centrado, y se lee mejor).

## Prohibido (propio de esta tarea)

- Tocar `practicas/_comun/` (el arreglo del CSS común es de otra sesión) o cualquier otra
  práctica.
- Quitar la posibilidad de contestar «ninguno» o cambiar el generador para que no salga el
  conjunto vacío: el caso es deseado.
- Cambiar la puntuación, la espera del feedback o la lógica de `esCorrecta`.

## Salida esperada

- Los ficheros de «Ficheros que toca» cambiados y comiteados.
- `tests/practicas-semaforo.test.js` ampliado con los tres tests del punto 7.
- `reparto-practicas-u2/salidas/40-semaforo-ninguno/ENTREGA.md` (hash, ficheros, cómo
  probarlo en 1 minuto incluido cómo conseguir un ítem de conjunto vacío) y su marcador
  `ENTREGA.md.ok-<sid>`.
- En la terminada: si el CSS común ya traía las reglas o las has copiado, y cualquier
  propuesta (por ejemplo, sacar «botones que se encienden» a `piezas.js`: lo repiten
  semaforo, rectangulos y constructor; es una tarea aparte, no la hagas).

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 40, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-40.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/40--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/40--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/40-semaforo-ninguno/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/40--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/40--<sid>.md` con hasta dónde llegaste, la línea
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
