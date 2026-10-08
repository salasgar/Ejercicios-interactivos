# Tarea 07 · Divisiones sucesivas guiadas: el menor primo con los criterios, la forma de potencias y la comprobación multiplicando

Actualizado: 2026-10-07
Precondición: 01 LISTA · Disparo: MANUAL (sesión atendida)
Duración esperada: 2 h (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: 08
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/07-divisiones/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/divisiones/*` (nuevo), `tests/practicas-divisiones.test.js` (nuevo)

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
   printf 'sesión: %s\ntarea: 07\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/07--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/07--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 07 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/07--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

El procedimiento estándar de la unidad, paso a paso y con corrección en cada paso: elegir
el menor primo que divide usando los criterios, escribir el resultado como producto de
potencias con las bases de menor a mayor y comprobar multiplicando sin tratar la potencia
como un producto. Destrezas: U2-2C-10, U2-2C-11, U2-2C-12, U2-2B-02. Error que ataca:
«2³ · 3 = 18» (el error capital de la unidad 1, otra vez) y olvidar los primos mayores que 7.

## Siguiente paso

1. Lee la ficha de la tarea 01 (`reparto-practicas-u2/tareas/tarea-01-base-comun.md`),
   apartados §1 (catálogo), §2 (`aritmetica.js`: no reescribas lo que ya está ahí) y §3
   (el contrato de `arrancar(practica)` y la `api` de `montar`), y después
   `practicas/plantilla/practica.js` entero con sus comentarios, `practicas/_comun/aritmetica.js`
   (los exports reales mandan sobre esta ficha si difieren) y `practicas/_comun/estilos.css`.
   Si la terminada de la 01 (`reparto-practicas-u2/hechos/terminadas/01--*.md`) anuncia
   cambios del contrato, mandan sobre esta ficha.
2. Copia `practicas/plantilla/` a `practicas/divisiones/` (si no existe ya de una sesión caída)
   y cambia el `<title>`, el `slug` y el icono.
3. Escribe primero `logica.js` (generadores y comprobaciones, puro) con su test
   `tests/practicas-divisiones.test.js`, en verde, y solo después `montar` y los textos.

## Qué hay que hacer

Tres ejercicios:

1. **Las divisiones.** n de 2 o 3 cifras (hasta 600), un 30 % con factor 11 o 13 y un 15 %
   con un factor repetido tres veces o más. Se muestra la «escalera» (n | p) y botones de
   primos 2, 3, 5, 7, 11, 13. En cada paso el alumno pulsa el **menor** primo que divide al
   número actual. Si no divide: error con el criterio («3 no divide a 350: 3 + 5 + 0 = 8»);
   si divide pero hay uno menor que también divide: error («sí divide, pero 2 también y es
   más pequeño; empezamos por el menor»); si es el correcto: se escribe el cociente y se
   sigue hasta llegar a 1. Cada error cuenta una vez y la app escribe el paso correcto
   para continuar; el ítem es acierto si no hubo errores (una sola llamada a `responder`
   al llegar a 1). Para el 11 y el 13, el criterio «no hay otro: hay que probar dividiendo»
   con la división escrita («143 : 11 = 13»).
2. **La forma de potencias.** Se da la lista de primos obtenida («2 · 2 · 2 · 3 · 3 · 5») y
   steppers −/+ con las bases candidatas (los primos que aparecen más uno que no, con
   exponente 0 inicial). El alumno fija los exponentes; «Comprobar»: acierto si coinciden.
   Un 20 % de los ítems son potencias de 10 (10, 100, 1000, 10 000: «se factorizan solas»,
   2ⁿ · 5ⁿ). Feedback: cuenta de cada base («el 2 aparece 3 veces: 2³»).
3. **Comprobar multiplicando.** «¿Cuánto vale 2³ · 3²?» con cuatro opciones numéricas: la
   correcta (72), la de tratar las potencias como productos (2 · 3 · 3 · 2 = 36), la de
   sumar exponentes mal o una potencia como base·exponente (2³ → 6: 6 · 9 = 54) y una
   más (la correcta ± un factor), todas distintas (si coinciden, se vuelve a generar).
   Variante al 40 %: «¿Es correcta la factorización 2³ · 3 = 18?» Sí/No con la cuenta en el
   feedback («2³ = 8; 8 · 3 = 24, no 18»).

Ítem: `{ tipo: 'escalera' | 'potencias' | 'valor' | 'sino', n, pasos: [[numero, primo]…], factorizacion, lista, opciones, solucion, igualdadCorrecta }`.

## Datos de entrada

Comunes a todas las prácticas (solo lectura): `practicas/_comun/*` (la base), `practicas/plantilla/*`
(el ejemplo), `divisores/app.js` (fichas que se arrastran con pointer events, si hace falta
arrastrar), el inventario `inventario-unidad2.tsv` de la carpeta de apuntes (ruta en `proyecto.md`)
para el texto exacto de cada destreza, y las «Reglas de contenido comunes» de `proyecto.md`.
Propios de esta tarea:

- `aritmetica.js`: `factorizar`, `criterio`, `valorDe`, `htmlFact`.

## Cómo saber que ha terminado

- Test: ejercicio 1, la secuencia de primos de `pasos` es la lista no decreciente de
  factores primos de n (fuerza bruta) y cada «menor primo que divide» coincide con
  `min{p primo: p | m}`; ejercicio 2, la factorización coincide y la lista de primos tiene
  tantos elementos como la suma de exponentes; ejercicio 3, la opción correcta es el único
  valor igual al producto y las cuatro son distintas; los ítems `sino` tienen la verdad
  calculada por producto.
- Navegador: la escalera de 360 (6 pasos) cabe en 375 px con los botones de primos
  debajo; los steppers de exponentes responden al toque sin zoom accidental.

## Trampas conocidas

- Los botones de primos deben incluir el 11 y el 13 aunque n no los tenga: si solo
  aparecen cuando hacen falta, delatan la respuesta.
- Steppers: usa `<button>` −/+ con `aria-label`, no `<input type=number>` (abre el teclado
  en el móvil y desplaza la página).
- (07, al cerrar) Diseñar los distractores del ejercicio 3 es más delicado de lo que
  parece: con una factorización de 2 primos [[p1,e1],[p2,e2]], «tratar p^e como p·e en
  TODOS los factores» y «tratarlo solo en UNO» dan el MISMO valor salvo que los dos
  exponentes sean distintos (si uno es 1, transformarlo no cambia nada y los dos
  distractores coinciden). Y p=2,e=2 es un caso especial: 2·2 = 2² = 4, así que ese
  distractor «de toda la vida» coincide con el valor correcto si el otro factor tiene
  exponente 1. Solución que funcionó: forzar e1 ≠ e2 al generar, y cambiar el distractor
  de «solo un factor mal» por «intercambiar los exponentes entre las dos bases»
  (p1^e2 · p2^e1), que con e1≠e2 nunca coincide con el valor correcto. El test de
  fuerza bruta («las cuatro opciones son distintas») lo detectó enseguida; sin ese test
  habría pasado a producción con dos respuestas válidas en bastantes ítems.
- (07) Probar en el navegador con `puppeteer-core`: la navegación con
  `waitUntil: 'networkidle0'` se cuelga si hay `setRequestInterception` activo (al menos
  en esta versión); usar `waitUntil: 'load'` y una espera corta aparte. Y `page.$x` ya no
  existe en la versión instalada: usar `page.evaluate` con `querySelectorAll` y comparar
  `textContent`.
- (07) La duración esperada de 2 h se queda corta para esta tarea en concreto, no por el
  código (los tests y la interfaz salen en minutos, como en las demás tareas) sino por lo
  que cuesta diseñar y verificar los distractores del ejercicio 3 y las pruebas
  exhaustivas en el navegador. Aun así la caducidad (2×, con margen) no hizo falta
  estirarla porque nadie relevó la tarea; si el reparto tuviera más contención, convendría
  subir la duración esperada de tareas con un ejercicio de «opciones con distractores
  matemáticos» a 2 h 30 min - 3 h.

## Prohibido (propio de esta tarea)

- Dejar pasar «elige cualquier primo que divida» como correcto: la destreza exige el
  menor; el feedback lo dice y cuenta el fallo.
- Escribir `×`: punto medio siempre.

## Salida esperada

- `practicas/divisiones/index.html`, `practica.js`, `logica.js`, `textos.js`, `estilos.css`
  (vacío si no hace falta nada propio). `logica.js` puro: sin DOM ni red.
- `tests/practicas-divisiones.test.js`: para cada ejercicio, al menos 1000 ítems generados con
  semilla fija y comprobados contra definiciones **independientes** por fuerza bruta (no
  contra las funciones de `aritmetica.js`): la respuesta correcta es verdad, cada opción
  dada por falsa es falsa (regla de oro), y no gana quien pulsa siempre lo mismo (ninguna
  opción es correcta en más del 70 % de los ítems de un ejercicio de elegir).
- `reparto-practicas-u2/salidas/07-divisiones/ENTREGA.md` con su marcador `.ok-<sid>`.
- En la terminada: la petición a la tarea 18 de poner `disponible: true` en el catálogo
  para `divisiones` (si la base usa ese campo), y cualquier propuesta de cambio del contrato.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 07, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-07.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/07--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/07--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/07-divisiones/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/07--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/07--<sid>.md` con hasta dónde llegaste, la línea
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
