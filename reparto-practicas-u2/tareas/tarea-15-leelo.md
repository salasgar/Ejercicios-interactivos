# Tarea 15 · Léelo en inglés: escuchar y elegir, elegir la lectura correcta, y completar la frase (divisible by, never between)

Actualizado: 2026-10-07
Precondición: 01 LISTA · Disparo: MANUAL (sesión atendida)
Duración esperada: 1 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: 16
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/15-leelo/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/leelo/*` (nuevo), `tests/practicas-leelo.test.js` (nuevo)

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
   printf 'sesión: %s\ntarea: 15\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/15--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/15--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 15 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/15--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

El lenguaje de la unidad en inglés, con síntesis de voz: oír una factorización o un
m.c.d. y reconocerlo, elegir cómo se lee lo que se ve, y completar frases con la
preposición correcta. Destrezas: U2-2B-03 (leer una factorización en voz alta), U2-3B-03
(leer un GCD o un LCM), U2-1B-01 (vocabulario básico), U2-1B-02 («divisible by», nunca
«divisible between»), U2-1B-05 (GCD, HCF, GCF; lowest/least), U2-2B-01 y U2-2B-02
(vocabulario de primos y de la factorización). Esta práctica tiene sentido sobre todo en
inglés: en español el selector ES/EN cambia las instrucciones y el feedback, pero lo que
se lee y se escucha es siempre inglés.

## Siguiente paso

1. Lee la ficha de la tarea 01 (`reparto-practicas-u2/tareas/tarea-01-base-comun.md`),
   apartados §1 (catálogo), §2 (`aritmetica.js`: no reescribas lo que ya está ahí) y §3
   (el contrato de `arrancar(practica)` y la `api` de `montar`), y después
   `practicas/plantilla/practica.js` entero con sus comentarios, `practicas/_comun/aritmetica.js`
   (los exports reales mandan sobre esta ficha si difieren) y `practicas/_comun/estilos.css`.
   Si la terminada de la 01 (`reparto-practicas-u2/hechos/terminadas/01--*.md`) anuncia
   cambios del contrato, mandan sobre esta ficha.
2. Copia `practicas/plantilla/` a `practicas/leelo/` (si no existe ya de una sesión caída)
   y cambia el `<title>`, el `slug` y el icono.
3. Escribe primero `logica.js` (generadores y comprobaciones, puro) con su test
   `tests/practicas-leelo.test.js`, en verde, y solo después `montar` y los textos.

## Qué hay que hacer

Tres ejercicios:

1. **Escúchalo.** Botón grande «▶ Listen» que lee con `speechSynthesis` (voz `en-GB` si
   existe, si no cualquier `en-*`, si no la por defecto) una frase: «sixty equals two
   squared times three times five», «the GCD of twenty-four and thirty-six is twelve», «the
   LCM of four and six is twelve», «seven is a prime number», «fifty-one is a composite
   number». Cuatro opciones escritas en notación: `60 = 2² · 3 · 5`, `60 = 2³ · 3 · 5`,
   `60 = 2² · 3 · 7`, `30 = 2 · 3 · 5`… (los distractores difieren en una potencia o en un
   número; nunca en el orden de los factores). Acierto si elige la correcta. **Sin voz
   disponible** (`!('speechSynthesis' in window)` o sin voces tras `voiceschanged`), el
   ejercicio muestra la frase escrita en lugar del botón y pasa a ser «lee y elige»; que
   quede dicho en pantalla («your device has no voice: read the sentence»). Se puede
   volver a escuchar sin límite. El texto que se lee se construye con una función pura
   `leer(expresion)` → inglés, con los números hasta 999 en letras (reutiliza o copia el
   generador de números en inglés de `src/ejercicios/lenguaje_ingles.js` si te sirve; es de
   solo lectura).
2. **¿Cómo se lee?** Se muestra `60 = 2² · 3 · 5` (o `GCD(24, 36) = 12`, o `LCM(4, 6) = 12`)
   y cuatro lecturas escritas; la correcta y tres que fallan **solo en la potencia o en
   un número** («two cubed times…», «…times three times seven», «thirty equals…»). Variantes
   válidas (`equals` / `is equal to`, `times` / `multiplied by`, `GCD` / `greatest common
   divisor` / `HCF`, `lowest` / `least`) **nunca son distractores**: el generador elige una
   forma para la correcta y los distractores usan la misma forma. Botón «▶» opcional para
   oír la correcta tras responder.
3. **Completa la frase.** «24 is divisible ___ 6» → opciones `by` / `between` / `of`; «6 is
   a divisor ___ 24» → `of` / `by` / `in`; «24 is a multiple ___ 6» → `of` / `by` / `for»;
   «6 ___ 24 four times» → `goes into` / `goes between` / `divides for`; «GCD stands for…»
   → `greatest common divisor` / `greatest common multiple` / `general common divisor` (HCF
   no aparece como opción: sería válida); «1 is ___» → `neither prime nor composite` /
   `prime` / `composite`. Al menos 10 plantillas con números al azar donde los haya; las
   frases son siempre **verdaderas** con la opción correcta (el generador comprueba la
   divisibilidad).

Ítem: `{ tipo: 'escuchar' | 'leer' | 'completar', expresion: { clase: 'fact'|'gcd'|'lcm'|'primo'|'compuesto', n, f, a, b, valor }, frase, opciones, solucion }`.

## Datos de entrada

Comunes a todas las prácticas (solo lectura): `practicas/_comun/*` (la base), `practicas/plantilla/*`
(el ejemplo), `divisores/app.js` (fichas que se arrastran con pointer events, si hace falta
arrastrar), el inventario `inventario-unidad2.tsv` de la carpeta de apuntes (ruta en `proyecto.md`)
para el texto exacto de cada destreza, y las «Reglas de contenido comunes» de `proyecto.md`.
Propios de esta tarea:

- `src/ejercicios/lenguaje_ingles.js` (solo lectura): números en letras y lectura de
  operaciones en inglés, para no reinventarlo.
- `inventario-unidad2.tsv`, filas U2-1B-01, U2-1B-02, U2-1B-05, U2-2B-01, U2-2B-02, U2-2B-03,
  U2-3B-03 (las notas dicen qué pares son equivalentes y nunca se enfrentan).

## Cómo saber que ha terminado

- Test: `leer(expresion)` devuelve el inglés esperado en 20 casos fijos (incluidos
  «squared», «cubed», «to the power of four», números con guion como twenty-four); en
  3000 ítems de los ejercicios 1 y 2, las cuatro opciones son distintas en valor o en
  lectura y los distractores no son variantes válidas de la correcta (comprobado con una
  lista de equivalencias); en el 3, la frase con la opción correcta es verdad (fuerza
  bruta sobre los números).
- Navegador: en Safari iOS la voz solo suena tras un toque del usuario (ya lo es: el
  botón); si no hay voces, aparece el modo lectura.

## Trampas conocidas

- `speechSynthesis.getVoices()` devuelve `[]` la primera vez en Chrome: escucha
  `voiceschanged` y vuelve a pedir las voces; decide el modo (voz / lectura) con un retardo
  de hasta 1 s.
- `speechSynthesis` se queda «pausado» en Chrome tras ~15 s de una locución larga: las
  frases aquí son cortas; llama a `cancel()` antes de cada `speak()`.
- Lectura de potencias en inglés: 2² «two squared», 2³ «two cubed», 2⁴ «two to the power
  of four» (también «two to the fourth»; usa la primera en la correcta y en los
  distractores por igual).

## Prohibido (propio de esta tarea)

- Enfrentar como opciones dos lecturas equivalentes, dos siglas equivalentes (GCD/HCF/GCF)
  o `lowest`/`least`.
- Hacer que el ejercicio dependa de que exista voz: siempre tiene que poder hacerse.

## Salida esperada

- `practicas/leelo/index.html`, `practica.js`, `logica.js`, `textos.js`, `estilos.css`
  (vacío si no hace falta nada propio). `logica.js` puro: sin DOM ni red.
- `tests/practicas-leelo.test.js`: para cada ejercicio, al menos 1000 ítems generados con
  semilla fija y comprobados contra definiciones **independientes** por fuerza bruta (no
  contra las funciones de `aritmetica.js`): la respuesta correcta es verdad, cada opción
  dada por falsa es falsa (regla de oro), y no gana quien pulsa siempre lo mismo (ninguna
  opción es correcta en más del 70 % de los ítems de un ejercicio de elegir).
- `reparto-practicas-u2/salidas/15-leelo/ENTREGA.md` con su marcador `.ok-<sid>`.
- En la terminada: la petición a la tarea 18 de poner `disponible: true` en el catálogo
  para `leelo` (si la base usa ese campo), y cualquier propuesta de cambio del contrato.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 15, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-15.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/15--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/15--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/15-leelo/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/15--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/15--<sid>.md` con hasta dónde llegaste, la línea
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
