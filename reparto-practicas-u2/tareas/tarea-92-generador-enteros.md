# Tarea 92 · Generador `enteros` de la aplicación principal, al día con el inventario de la unidad 3

Actualizado: 2026-10-21
Precondición: ninguna · Disparo: MANUAL (sesión atendida)
Duración esperada: 1 h (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/92-generador-enteros/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `src/ejercicios/enteros.js`, `tests/enteros-items.test.js` (nuevo)

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
   printf 'sesión: %s\ntarea: 92\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/92--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/92--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 92 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/92--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.



## Objetivo

La aplicación principal (`src/`, la de las tareas con `generarTarea`) tiene un generador `enteros`
(`src/ejercicios/enteros.js`, 223 líneas) anterior al inventario de la unidad 3. Hay que ponerlo al día
con el inventario y con las reglas de la unidad: es la tarea 6 del plan viejo de la unidad 3
(`3. Integers/PLAN-UNIDAD3.md`), que su reparto manda aquí. Plazo orientativo: antes del **jueves
19-11** (semana 2).

## Siguiente paso

1. Lee `CLAUDE.md` del repositorio entero (regla de oro y la trampa de `construirOpciones`), `README.md`
   (cómo son los generadores) y `src/ejercicios/enteros.js`, `src/ejercicios/index.js` y
   `tests/distractores.test.js`.
2. Lee el inventario de la unidad 3 (columnas `sesion`, `ejemplo` y `nota`).
3. `npm test` antes de tocar nada, para saber de dónde partes.

## Qué hay que hacer

- **Las primeras formas, sin paréntesis** (`5 − 8`, `−4 + 9`, `−3 − 6`): hoy el generador escribe
  `(−a) − b` y `a + (−b)` desde el principio. Las de paréntesis de un número (`5 − (−3)`, `5 + (−3)`)
  quedan como formas posteriores, y el producto con el negativo que no va primero entre paréntesis.
- **`items` por forma** (como `divisibilidad.js`, ver `tests/divisibilidad-items.test.js`), con cada
  forma ligada a su destreza del inventario (`U3-1C-11`, `U3-1C-12`, `U3-1C-13`, `U3-2C-05`,
  `U3-2C-06`, `U3-2C-15`, `U3-2C-18`…), para que una tarea pueda pedir solo las de una semana.
- **Distractores = errores típicos** de la nota del inventario, calculados con los números del ítem;
  barajar el pool y quedarse con tres (`rng.barajar(pool).slice(0, 3)`), y ninguno igual a la
  correcta. Los `errores` con mensaje ligado a los números.
- Escritura: el menos de U+2212 en lo que se pinta (si `tex` ya lo resuelve, dilo en la ENTREGA), `\cdot`
  y nunca `\times`.
- `npm test` en verde, con un test nuevo por forma (fuerza bruta: 3000 ítems, ningún distractor igual
  a la correcta, ningún paréntesis en las formas sin paréntesis).

## Datos de entrada

- El inventario de la unidad 3, solo lectura: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/3. Integers/inventario-unidad3.tsv`.
- `3. Integers/PLAN-UNIDAD3.md`, «Avisos para quien escriba preguntas» (en la carpeta de la unidad, solo lectura).

## Cómo saber que ha terminado

- `npm test` sin fallos (incluidos `tests/distractores.test.js`, `tests/ejercicios.test.js` y `tests/csv.test.js`, que usan `enteros`).
- En local, una tarea de prueba con `enteros` en la app principal: los ítems de las primeras formas sin paréntesis.

## Trampas conocidas

- `construirOpciones` toma los distractores en orden y se planta en tres: los sobrantes son código muerto (CLAUDE.md).
- `tests/csv.test.js` usa `tipo: 'enteros'` y comprueba «Errores: Números enteros»: no cambies el nombre del tipo.

## Prohibido (propio de esta tarea)

- Tocar `practicas/` (eso son las tareas 79-91) o cualquier otro generador.
- Cambiar el nombre del tipo `enteros` o la forma de `errores`/`notas` que leen la app y el CSV.

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
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 92, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-92.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/92--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/92--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/92-generador-enteros/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/92--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/92--<sid>.md` con hasta dónde llegaste, la línea
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
