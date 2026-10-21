# Tarea 81 · Práctica de la unidad 3 «Opuesto y valor absoluto» (`opuestos`)

Actualizado: 2026-10-21
Precondición: 79 LISTA · Disparo: MANUAL (sesión atendida)
Duración esperada: 1 h (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: 80
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/81-opuestos/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/opuestos/*` (sustituye el esqueleto que deja la 79: desde que la 79 está LISTA, la dueña de esa carpeta es esta tarea), `tests/practicas-opuestos.test.js` (nuevo)

La duración esperada no es informativa: de ella sale la caducidad del reclamo (2 ×, mínimo
45 min), el plazo tras el cual otra sesión puede relevarte si te cortas. **Este fichero es
la fuente de la banda**: el tablón la copia de aquí cada vez que se regenera. La banda
dice con qué modelo conviene abrir la sesión; la tabla de bandas de `proyecto.md` la
traduce al menú de hoy (ALTO = Opus 5.5, esfuerzo Alto; MEDIO = Sonnet 5.5, esfuerzo Medio).

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
   printf 'sesión: %s\ntarea: 81\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/81--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/81--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 81 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/81--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.



## Objetivo

Práctica **«Opuesto y valor absoluto» / «Opposite and absolute value»** (`opuestos`, id 34 del catálogo, 4 ejercicios) para
la **unidad 3, Integers**, que empieza el lunes 16-11. Semana 1 (sesión 1). Tiene que estar LISTA antes del **jueves 12-11** (la publica la 93).

Destrezas del inventario de la unidad 3: U3-1C-07, U3-1C-08, U3-1C-09 y U3-1C-10. El texto exacto de cada una, su sesión y su
nota (errores típicos y riesgos) están en el inventario: léelas antes de escribir nada.

**Es un diseño propuesto por la coordinadora (21-10) y aprobado en bloque por Juan Luis al pedir el
alta; él puede cambiarlo.** Si al hacerla ves que un ejercicio no se sostiene (dos respuestas
correctas inevitables, algo de una sesión posterior), no lo cambies por tu cuenta: entrégalo como
propuesta en la terminada y sigue con lo demás. El número de ejercicios (4) está fijado en el
catálogo por la 79; otro número también es propuesta.

Usa la recta de `_comun/recta-enteros.js`: el opuesto se ve como el punto simétrico respecto del 0 y el valor absoluto como los saltos hasta el 0.

## Siguiente paso

1. Lee la ficha de la tarea 01 (§3, el contrato de `arrancar(practica)` y la `api` de `montar`), la
   `ENTREGA.md` de la 79 (`reparto-practicas-u2/salidas/79-base-unidad3/`) y los módulos que dejó:
   `practicas/_comun/enteros.js` (`fmt`, `fmtPar`, `leerEntero`, `evaluar`, `html`, los errores típicos)
   y `practicas/_comun/recta-enteros.js` (la recta y el termómetro). **No los reescribas**: si te falta
   algo, cópialo en tu `logica.js` y proponlo en la terminada.
2. Lee `practicas/plantilla/` entero y la práctica modelo que cita el Objetivo, si la hay; `practicas/_comun/piezas.js`
   (`elecciones`, `claseCorreccion`: los cuatro estados tras comprobar, de la 56) y cómo ocultan
   «Comprobar» al responder (T58) las prácticas de la unidad 2.
3. `ls practicas/opuestos/`: la 79 dejó un esqueleto que carga y declara 4 ejercicios. Sustitúyelo
   empezando por `logica.js` y su test, en verde; después `practica.js` (`montar`) y `textos.js`.

## Qué hay que hacer

1. **El opuesto** · *The opposite*. La recta con un punto; el alumno toca su opuesto (el simétrico
   respecto del 0) y lo escribe. En un tercio de los ítems, el opuesto del opuesto: «¿cuánto es
   −(−4)?», con los dos simétricos en la recta (U3-1C-07 lo pide en la sesión 1).
   Error típico que da feedback propio: `−(−9) = −9`.
2. **Distancia al cero** · *Distance from zero*. Un punto en la recta; el alumno cuenta los saltos
   hasta el 0 y escribe `|−6| = 6`. Error típico: `|−4| = −4`. U3-1C-08.
3. **Opuesto y valor absoluto** · *Opposite and absolute value*. Para un número, dos huecos a la vez:
   «opuesto de 7 = □» y «|7| = □». Con números positivos y negativos a partes iguales: con un
   negativo los dos huecos dan lo mismo, con un positivo no, y el feedback lo explica con la recta.
   **Nunca una pregunta de elegir «¿es el opuesto o el valor absoluto?» con un negativo: es las dos
   cosas** (regla de oro). U3-1C-09.
4. **¿Quiénes están a esa distancia?** · *Which integers are that far from zero?* «Marca todos los
   enteros cuyo valor absoluto es 5»: el alumno marca los dos puntos en la recta (si marca uno solo,
   «falta otro»). En la mitad de los ítems, en cambio, dos negativos: «¿cuál es mayor, −8 o −3?»,
   con el de menor valor absoluto como respuesta. U3-1C-10. Sin la letra x: «el valor absoluto es 5»,
   nunca «|x| = 5».

**Para todos los ejercicios**: introducción con un ejemplo resuelto en los dos idiomas; el ítem en el
idioma que le toque (la base alterna); «Comprobar» que se oculta al responder; los cuatro estados tras
comprobar donde haya opciones; feedback con los números del ítem; cada fallo pasado a `api.responder`
con su `error` (el nombre del error típico) y la `respuesta` del alumno, para el registro de fallos.

**Test** `tests/practicas-opuestos.test.js` (por fuerza bruta, 3000 ítems por ejercicio con semillas fijas):
- Ej. 1: el punto nunca es el 0 y el opuesto cabe en la recta dibujada.
- Ej. 3: la respuesta del valor absoluto nunca es negativa; reparto positivo/negativo cerca del 50 %.
- Ej. 4: los dos puntos marcables caben en el rango; nunca valor absoluto 0.
- Ningún texto de alumno con `×`, con el guion `-` como signo, con letras de variable o con `(+`
  fuera de donde la ficha lo permite (recorre los textos generados en los dos idiomas).
- Todo distractor distinto de la respuesta correcta y sacado de un error típico con nombre.

## Datos de entrada

- El inventario de la unidad 3, solo lectura: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/3. Integers/inventario-unidad3.tsv`.
- Carpeta de la unidad (solo lectura): `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/3. Integers/` — `contenidos-unidad3-resumen.tex` (apartado «Errores
  más frecuentes»), `secuenciación-unidad3.pdf` (qué se da en cada sesión) y las hojas
  `hojas-de-ejercicios/` (para no repetir sus casos y para ver cómo lo escribe Juan Luis).
- Material de otros cursos, por si sirve (no es obligatorio): `~/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/3. Números enteros/` (los `.docx`, por su PDF gemelo).
- `practicas/_comun/*` y `practicas/plantilla/*`: solo lectura.

## Cómo saber que ha terminado

- `node --test tests/practicas-comun.test.js tests/practicas-opuestos.test.js` en verde y `npm test` sin
  fallos en tus ficheros.
- En local (`npm run servir`), http://localhost:8080/practicas/opuestos/ con el código de prueba 60
  (`7NPD`; nunca el de un alumno ni AJJN), a 375 px y en ventana ancha, en español y en inglés; en
  cada ejercicio, un ítem acertado y uno fallado, mirando el feedback. La práctica **no sale en la
  portada** (está con `disponible: false` hasta su tarea de publicación): se entra por la URL.

## Trampas conocidas

- `.cuenta` no se parte (`nowrap`): solo cuentas cortas; las frases del feedback van como texto normal
  o se salen de 375 px (lección de la 16).
- `t(null)` no usa el valor por defecto: la barra va en el idioma del ítem (T60, `idiomaBarra()`).
- Puede haber hasta doce sesiones a la vez en este árbol (las prácticas 80-91 van en paralelo): no
  metas en tu commit nada que no sea tuyo, y nada de `git stash`.

## Prohibido (propio de esta tarea)

- Tocar otras prácticas, la base (`practicas/_comun/`), `catalogo.js`, `portada.js`, `registro.js`,
  `tareas.js` o los docs: lo que haga falta ahí es propuesta en la terminada. `disponible: true` lo
  pone la tarea de publicación de su semana, no esta.
- Meter la práctica en una tarea semanal.

## Salida esperada

- `practicas/opuestos/*` y `tests/practicas-opuestos.test.js` comiteados, con `npm test` sin fallos en tus
  ficheros.
- `reparto-practicas-u2/salidas/81-opuestos/ENTREGA.md` (hash, ficheros, los ejercicios y sus destrezas,
  las cotas de realismo que has fijado, cómo probarlo en 1 minuto) y su marcador `ENTREGA.md.ok-<sid>`.

## Reglas de contenido de la unidad 3 (copia de `proyecto.md`; lo común no se lee, por eso va aquí)

1. **La suma y la resta empiezan sin paréntesis**: `5 + 3`, `5 − 3`, `−5 + 3`, `−5 − 3`. **Nunca**
   `(+5) + (+3) = +8`, ni `+8` como resultado. El paréntesis de un número (`5 − (−3)`, `5 · (−2)`)
   aparece en la sesión 6, como algo que se quita; `(+6)` y compañía, solo en el ejercicio que
   enseña a quitarlos (U3-2C-08). Un negativo que no va el primero en un producto o un cociente va
   entre paréntesis: `5 · (−2)`, `12 : (−3)`. El opuesto del opuesto, `−(−4)`, es de la sesión 1.
2. **Nada que no se haya dado**: cada ejercicio respeta la columna `sesion` de sus destrezas en el
   inventario. Ningún producto o cociente de enteros antes de la sesión 6, ningún paréntesis que
   envuelva una operación antes de la 11 (salvo `30 : (−5 · 2)` en la 9), ninguna potencia de base
   negativa antes de la 10, corchetes solo en la 13. Ni letras ni ecuaciones (el número que falta es
   un hueco `□`), ni decimales, fracciones ni porcentajes.
3. **Escritura**: el menos que se ve en pantalla es U+2212 `−` (`fmt` de `practicas/_comun/enteros.js`,
   de la tarea 79); el alumno puede teclear `-`, `−` o `–` (`leerEntero`). Producto con `·`, nunca
   `×`; división con `:` (en inglés, `÷` o `:`, como el resto de la app). Exponentes con `<sup>`.
4. **Regla de oro**: todo distractor, inequívocamente falso, y cada distractor sale de un **error
   típico** de la columna `nota` del inventario, calculado con los números del ítem y comprobado en el
   test (nunca un número al azar): `−2 − 3 = +5`, `5 · (−2) = 10`, `(−2)⁴ = −16`, `(−2)³ = +8`,
   `(−5)² = −10`, `−(−3)² = 9`, `5 − (2 − 4) = 5 − 2 − 4`, `2 − 4 + 3 = 2 − 7`, `4 − 5 · 2 = 4 − (−10)`,
   `3 − (−2) = 3 − 2`, `|−4| = −4`, `−(−9) = −9`. Los generadores de estos valores están en
   `_comun/enteros.js` (tarea 79): úsalos.
5. **Parejas válidas, que nunca se enfrentan** (U3-4C-09): *negative three* / *minus three*;
   *subtract* / *take away*; *times* / *multiplied by*; *exponent* / *index*; *brackets* /
   *parentheses*; `÷` / `:`; `+5` / `5`; agrupar positivos y negativos / ir de izquierda a derecha;
   operar dentro del paréntesis / quitarlo. **Riesgos de dos respuestas correctas** (las destrezas
   con `cuidado` en la columna `tipo_test`): `√49` con 7 y ±7 a la vez entre las opciones; colocar
   paréntesis (varias colocaciones pueden dar lo mismo: vale cualquiera que dé el resultado); años
   a. C. (no hubo año 0); la escritura de dos signos seguidos (solo como «¿cuál está bien escrita?»).
6. **Inglés sencillo**; la palabra no matemática que decide la respuesta se aclara entre paréntesis
   (*to owe (deber)*, *rose (subió)*), salvo que sea justo lo que se evalúa. *Even* y *odd* se aclaran
   siempre salvo en su pregunta.
7. **Realismo** (regla de Juan Luis del 16-10): la situación tiene que ser posible y **todos** los
   números que pueda sacar el generador, creíbles en su contexto, con una cota por contexto que el
   test comprueba. Orientativas (la sesión fija las suyas y las escribe en su ENTREGA): temperatura de
   una ciudad, de −30 a 45 °C, y su cambio en un día, de 1 a 20 grados; plantas de un edificio, de −5
   a 20; buceo, de 0 a −40 m; saldo de un alumno, de −50 a 300 €; altitudes, de −400 m (mar Muerto) a
   8849 m; años, de 3000 a. C. a 2026, sin año 0.
8. **Feedback ligado al error**, con los números del ítem («−2 − 3: vas hacia abajo dos veces; 2 + 3 =
   5, así que el resultado es −5»), no una regla genérica. Frase sencilla antes que caso límite: «el
   valor absoluto es siempre positivo» se queda aunque |0| = 0 (decisión de Juan Luis del 17-10; no
   vale para los distractores).
9. **Casos fijos** (frases, contextos, cálculos con error) que no copien los de las hojas, los
   exámenes semanales ni el examen final de la unidad 3 (en la carpeta de la unidad: `hojas-de-ejercicios/`,
   `exámenes-semanales/`, `examen-final/`): los alumnos los verán en papel.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 81, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-81.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/81--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/81--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/81-opuestos/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/81--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/81--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni
  `practicas/_comun/` (salvo la tarea 01 y, en la unidad 3, la 79 y las de publicación 93-96, cada una en lo que declara), ni `css/estilos.css`, ni `README.md` (salvo
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
- Las reglas de contenido de la unidad 3 (en esta ficha y en `proyecto.md`): `(+5) + (+3)` al
  empezar, `+8` como resultado, `×` en vez de `·`, el guion `-` en vez del menos `−` en pantalla,
  letras, ecuaciones, decimales o fracciones, algo de una sesión posterior a la de la destreza,
  distractores que puedan ser verdad y parejas válidas enfrentadas.
