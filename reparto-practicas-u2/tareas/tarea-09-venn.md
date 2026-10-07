# Tarea 09 · m.c.d. y m.c.m. con factores primos: el diagrama de Venn, las dos reglas y no cruzarlas

Actualizado: 2026-10-07
Precondición: 01 LISTA · Disparo: MANUAL (sesión atendida)
Duración esperada: 2 h 30 min (tiempo de sesión, no de persona; real: 24 min el 2026-10-07) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/09-venn/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/venn/*` (nuevo), `tests/practicas-venn.test.js` (nuevo)

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
   printf 'sesión: %s\ntarea: 09\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/09--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/09--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 09 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/09--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

La aplicación que ataca el error más caro de la unidad: cruzar las reglas del m.c.d. y
del m.c.m. Los factores primos de dos números se reparten en dos círculos que se solapan;
lo común es el m.c.d. y todo junto es el m.c.m. Destrezas: U2-3C-03 (m.c.d. por
factorización y por qué), U2-3C-04 (m.c.m. por factorización y por qué), U2-3C-05 (no
cruzar las reglas), U2-3C-06 (no calcular el m.c.m. solo con los comunes), U2-3C-08 (si
uno es divisor del otro), U2-3C-10 (desigualdades: el m.c.d. no pasa del menor, el m.c.m.
no baja del mayor), U2-3B-01 (vocabulario: common prime factors, lowest/highest power).
Es ALTO por la interfaz (chips en tres zonas, con arrastre y con toque) y porque el
feedback tiene que distinguir cuatro errores distintos.

## Siguiente paso

1. Lee la ficha de la tarea 01 (`reparto-practicas-u2/tareas/tarea-01-base-comun.md`),
   apartados §1 (catálogo), §2 (`aritmetica.js`: no reescribas lo que ya está ahí) y §3
   (el contrato de `arrancar(practica)` y la `api` de `montar`), y después
   `practicas/plantilla/practica.js` entero con sus comentarios, `practicas/_comun/aritmetica.js`
   (los exports reales mandan sobre esta ficha si difieren) y `practicas/_comun/estilos.css`.
   Si la terminada de la 01 (`reparto-practicas-u2/hechos/terminadas/01--*.md`) anuncia
   cambios del contrato, mandan sobre esta ficha.
2. Copia `practicas/plantilla/` a `practicas/venn/` (si no existe ya de una sesión caída)
   y cambia el `<title>`, el `slug` y el icono.
3. Escribe primero `logica.js` (generadores y comprobaciones, puro) con su test
   `tests/practicas-venn.test.js`, en verde, y solo después `montar` y los textos.

## Qué hay que hacer

Cuatro ejercicios (catálogo: `nEjercicios: 4`):

1. **Reparte los factores.** a y b (12 ≤ a, b ≤ 400, con 2 o 3 primos cada uno, al menos
   un primo común en el 85 % de los ítems; nunca a = b). Se muestran sus factorizaciones
   como **fichas individuales**: a = 2 · 2 · 2 · 3 da fichas «2» «2» «2» «3» en azul; b =
   2 · 2 · 3 · 3 da «2» «2» «3» «3» en naranja. Debajo, un Venn con tres zonas tocables:
   «solo a», «común», «solo b». Una ficha azul puede ir a «solo a» o a «común»; una
   naranja a «solo b» o a «común». En «común» las fichas se **emparejan**: una azul y una
   naranja del mismo primo forman una pareja y cuentan como un solo factor del m.c.d.
   Interacción: tocar una ficha la selecciona, tocar una zona la coloca (y arrastrar
   también, con el patrón de `divisores/app.js`). «Comprobar»: acierto si las parejas de
   «común» son exactamente los factores del m.c.d. (como multiconjunto) y lo que queda
   fuera es lo demás. Tras el acierto, la app escribe «GCD = 2 · 2 · 3 = 12 (lo común)» y
   «LCM = 2 · 2 · 2 · 3 · 3 = 72 (todo, contando lo común una vez)». Feedback de fallo:
   qué ficha sobra o falta en «común» («hay tres 2 en a y dos en b: solo dos parejas de 2»).
2. **El m.c.d. con steppers.** a y b factorizados con `htmlFact`, uno sobre otro, con las
   bases alineadas en columnas (los primos de la unión; exponente 0 mostrado como «—»). El
   alumno construye el m.c.d. con steppers por base. Acierto si es exactamente `mcdFact`.
   Feedback según el error: si su respuesta es el m.c.m. → «has cogido el mayor exponente y
   todos los primos: eso es el m.c.m.; el m.c.d. solo lleva los comunes con el menor»; si
   incluyó un primo no común → «el 5 solo está en b: no es común»; si eligió el mayor
   exponente de un común → «2³ no divide a 2²·…: el menor exponente»; si dio 0 cuando no
   hay comunes → «sin primos comunes el m.c.d. es 1, nunca 0». Un 15 % de ítems sin
   primos comunes (respuesta 1) y un 15 % con a divisor de b (U2-3C-08).
3. **El m.c.m. con steppers.** Igual, respuesta `mcmFact`. Feedback: si su respuesta es el
   m.c.d. → «has cogido solo los comunes con el menor exponente: eso es el m.c.d.»; si solo
   usó los comunes con el mayor exponente (U2-3C-06) → «faltan los no comunes: el 5 solo
   está en b, pero el m.c.m. tiene que ser múltiplo de b»; si usó el menor exponente de un
   común → «2² no es múltiplo de 2³».
4. **Mezcla y comprobación.** Cada ítem pide al azar GCD o LCM (la palabra en negrita y en
   color distinto para cada uno) y, tras la respuesta, muestra las dos comprobaciones de
   U2-3C-10 con los números: «12 ≤ 24 (el menor) ✓ y 24 : 12 y 36 : 12 exactas ✓» o «72 ≥ 36
   (el mayor) ✓ y 72 : 24 = 3, 72 : 36 = 2 ✓». Si la respuesta viola una desigualdad, el
   feedback lo dice antes que nada: «un m.c.d. de 72 no puede ser: 72 > 24».

Ítem: `{ tipo: 'venn' | 'mcd' | 'mcm' | 'mezcla', a, b, fa, fb, comunes: [[p, e]…], soloA, soloB, pide: 'mcd'|'mcm', solucion: [[p,e]…] }`.
Funciones de `logica.js`: `generar`, `repartir(fa, fb)` → `{ comunes, soloA, soloB }`,
`esCorrectaVenn(item, zonas)`, `diagnosticar(item, respuesta)` → código del error
(`'es_el_otro'`, `'no_comun'`, `'exponente_mayor'`, `'exponente_menor'`, `'cero'`,
`'faltan_no_comunes'`, `'desigualdad'`, `'otro'`), `explicar(item, respuesta, idioma)`.

## Datos de entrada

Comunes a todas las prácticas (solo lectura): `practicas/_comun/*` (la base), `practicas/plantilla/*`
(el ejemplo), `divisores/app.js` (fichas que se arrastran con pointer events, si hace falta
arrastrar), el inventario `inventario-unidad2.tsv` de la carpeta de apuntes (ruta en `proyecto.md`)
para el texto exacto de cada destreza, y las «Reglas de contenido comunes» de `proyecto.md`.
Propios de esta tarea:

- `aritmetica.js`: `factorizar`, `mcdFact`, `mcmFact`, `valorDe`, `htmlFact`, `mcd`, `mcm`.
- `divisores/app.js` (solo lectura) para el patrón de arrastrar.

## Cómo saber que ha terminado

- Test: en 3000 ítems, `valorDe(mcdFact)` = `mcd` por fuerza bruta (el mayor d que divide a
  los dos) y `valorDe(mcmFact)` = `mcm` por fuerza bruta (el menor múltiplo común);
  `repartir` reconstruye a y b (comunes + soloA = fa, comunes + soloB = fb);
  `diagnosticar` devuelve `'es_el_otro'` exactamente cuando la respuesta es la otra
  cantidad y `'cero'` cuando es 0; cuotas de ítems sin comunes y con a | b.
- Navegador: el Venn con hasta 8 fichas cabe en 375 px; se puede colocar una ficha con
  toque-toque sin arrastrar; las fichas emparejadas en «común» se ven como pareja.

## Trampas conocidas

- Con fichas individuales, el m.c.d. de 2³ y 2² se ve como dos parejas de 2 y un 2 azul
  suelto: eso es justo lo que se quiere que se vea. No agrupes en potencias en el
  ejercicio 1; en los 2-4 sí.
- Las fichas sueltas que quedan sin colocar deben contar como «sin repartir» y bloquear
  «Comprobar», no como colocadas en su lado.
- (Aprendido al hacerla, 2026-10-07.) `.comprobar { display: block }` de la base anula el
  atributo `hidden`: `boton.hidden = true` no esconde el botón. Hace falta
  `.comprobar[hidden] { display: none; }` (aquí, en el CSS propio; propuesto para la base).
- La base vuelve a llamar a `montar` con el mismo ítem para la traducción, con
  `api.respondido()` ya en true y **en otro contenedor de la misma página**: nada de `id`
  (se duplicarían) ni de `document.querySelector`; todo con `contenedor.querySelector` y
  atributos `data-`. En esa llamada se pinta el ítem resuelto y bloqueado.
- Seleccionar una ficha no puede rehacer el DOM: si el `pointerup` reconstruye las fichas, el
  `click` que viene después cae en la zona de debajo y la «coloca» donde ya estaba. Tocar solo
  cambia clases; rehacer, solo al colocar. Y el clic de una zona ignora los que vienen de una ficha.
- Al soltar un arrastre, la ficha está debajo del dedo y `elementFromPoint` la devuelve a
  ella: se pone `visibility: hidden` un instante para ver la zona de detrás.
- Con círculos de verdad (`border-radius: 50%`), a 375 px las fichas de «solo a» y «solo b» se
  salen por la curva: son óvalos de esquinas muy redondeadas (`3rem`).
- Elegir parejas al azar entre todas las válidas da casi siempre números grandes (hay muchas
  más parejas con números de 200 a 400): seis de cada diez se sacan de las de hasta 150.
- Hay números de 12 a 400 con exponentes altos (192 = 2⁶ · 3, 384 = 2⁷ · 3): acotado a 4.
- `th` hereda de `css/estilos.css` un borde inferior y el color gris: en una tabla propia hay
  que anularlos, y una clase de color puesta en el `th` pierde contra `.tabla th`.

## Prohibido (propio de esta tarea)

- Llamar HCF al m.c.d. en pantalla (GCD; HCF/GCF se aceptan solo si hay entrada de texto,
  y aquí no la hay).
- Usar «primos entre sí»: se dice «no tienen primos comunes: el m.c.d. es 1».

## Salida esperada

- `practicas/venn/index.html`, `practica.js`, `logica.js`, `textos.js`, `estilos.css`
  (vacío si no hace falta nada propio). `logica.js` puro: sin DOM ni red.
- `tests/practicas-venn.test.js`: para cada ejercicio, al menos 1000 ítems generados con
  semilla fija y comprobados contra definiciones **independientes** por fuerza bruta (no
  contra las funciones de `aritmetica.js`): la respuesta correcta es verdad, cada opción
  dada por falsa es falsa (regla de oro), y no gana quien pulsa siempre lo mismo (ninguna
  opción es correcta en más del 70 % de los ítems de un ejercicio de elegir).
- `reparto-practicas-u2/salidas/09-venn/ENTREGA.md` con su marcador `.ok-<sid>`.
- En la terminada: la petición a la tarea 18 de poner `disponible: true` en el catálogo
  para `venn` (si la base usa ese campo), y cualquier propuesta de cambio del contrato.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 09, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-09.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/09--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/09--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/09-venn/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/09--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/09--<sid>.md` con hasta dónde llegaste, la línea
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
