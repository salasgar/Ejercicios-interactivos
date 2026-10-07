# Tarea 06 · Árbol de factores libre: partir nodos, detectar factorizaciones sin terminar y ver que el árbol cambia pero la factorización no

Actualizado: 2026-10-07
Precondición: 01 LISTA · Disparo: MANUAL (sesión atendida)
Duración esperada: 2 h 30 min (tiempo de sesión, no de persona; real: 16 min) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/06-arbol/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/arbol/*` (nuevo), `tests/practicas-arbol.test.js` (nuevo)

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
   printf 'sesión: %s\ntarea: 06\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/06--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/06--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 06 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/06--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

Que el alumno descomponga tocando nodos, elija sus propias parejas, descubra que todos los
caminos llevan a la misma factorización y aprenda a no dejar factores compuestos, sobre
todo los que solo se dividen entre 11 y 13 (121, 143, 169). Destrezas: U2-2C-08 (árbol de
factores, o completar uno), U2-2C-09 (reconocer una factorización sin terminar), U2-2C-13
(la factorización es única aunque el árbol cambie), U2-2C-11 (forma de potencias, bases
crecientes), U2-2B-02 (vocabulario: factor tree, branch, prime factor). Error que ataca,
el de todos los años: «242 = 2 · 121» y se quedan tan anchos. Es ALTO por la interfaz: un
árbol que crece con las decisiones del alumno, en 375 px, y una comprobación que acepte
cualquier partición válida.

## Siguiente paso

1. Lee la ficha de la tarea 01 (`reparto-practicas-u2/tareas/tarea-01-base-comun.md`),
   apartados §1 (catálogo), §2 (`aritmetica.js`: no reescribas lo que ya está ahí) y §3
   (el contrato de `arrancar(practica)` y la `api` de `montar`), y después
   `practicas/plantilla/practica.js` entero con sus comentarios, `practicas/_comun/aritmetica.js`
   (los exports reales mandan sobre esta ficha si difieren) y `practicas/_comun/estilos.css`.
   Si la terminada de la 01 (`reparto-practicas-u2/hechos/terminadas/01--*.md`) anuncia
   cambios del contrato, mandan sobre esta ficha.
2. Copia `practicas/plantilla/` a `practicas/arbol/` (si no existe ya de una sesión caída)
   y cambia el `<title>`, el `slug` y el icono.
3. Escribe primero `logica.js` (generadores y comprobaciones, puro) con su test
   `tests/practicas-arbol.test.js`, en verde, y solo después `montar` y los textos.

## Qué hay que hacer

Tres ejercicios:

1. **Construye el árbol.** Raíz n (24 ≤ n ≤ 400; un 25 % de los ítems con factor 11 o 13:
   242, 286, 338, 363, 242, 385, 429, 455, 507…). El alumno toca un nodo compuesto y
   aparece un selector con sus parejas de divisores propias (`parejasDivisores(n)` sin
   `1 · n`), como botones «6 · 10», «4 · 15», «2 · 30»… Al elegir, el nodo abre dos ramas.
   Un nodo primo se puede marcar «primo» (se rodea con un círculo) tocándolo; si el alumno
   marca «primo» un compuesto, es un error inmediato («121 = 11 · 11») que cuenta como
   fallo del ítem, pero se le deja seguir. Cuando todas las hojas están rodeadas, el botón
   «Terminado» se activa y el ítem es acierto si no hubo errores; el feedback muestra la
   factorización en forma de potencias (`htmlFact`) y el texto «hay otros árboles, pero la
   factorización es la misma». Un árbol tiene como mucho profundidad 5 con n ≤ 400: dibujo
   con CSS (flex en columnas) o SVG; en 375 px, los nodos pueden ser de 40 px y las ramas
   finas; permite desplazamiento vertical, no horizontal.
2. **¿Está terminada?** Se muestra una igualdad del tipo «60 = 4 · 15», «60 = 2² · 3 · 5»,
   «242 = 2 · 121», «90 = 2 · 3² · 5», «84 = 4 · 3 · 7», «338 = 2 · 169»… con botones «Sí,
   terminada» / «No». Si el alumno dice No, segunda parte: tocar el factor compuesto (los
   factores son botones). Acierto solo con las dos partes bien. Un 40 % de los ítems llevan
   un compuesto «disfrazado» (121, 143, 169, 187, 209, 221, 49, 91). Feedback: «121 no es
   primo: 121 = 11 · 11; terminada sería 242 = 2 · 11²». Las igualdades son siempre
   **verdaderas** como producto: lo que se juzga es si está terminada.
3. **Completa el árbol.** Un árbol de n ya dibujado con dos o tres nodos en blanco (nunca la
   raíz), y un banco de números (los que faltan más dos distractores que no encajan). El
   alumno arrastra o toca-y-coloca (patrón de `divisores/app.js`, fichas → huecos).
   «Comprobar»: acierto si cada hueco contiene un número que hace cierto el producto de su
   rama (si dos huecos hermanos son intercambiables, cualquier orden vale: la comprobación
   es por producto, no por posición). Feedback: la rama mal con su cuenta («2 · 15 = 30,
   no 45»). Tras el acierto, en un 50 % de los ítems, aparece debajo otro árbol distinto
   del mismo n ya completo con el texto «otro árbol, misma factorización: 45 = 3² · 5».

Ítem: `{ tipo: 'construir' | 'terminada' | 'completar', n, igualdad: [[base, exp]…], terminada: bool, compuesto, arbol: {valor, hijos: [..]}, huecos, banco }`.
Funciones de `logica.js`: `generar`, `parejasPropias(n)`, `arbolAlAzar(n, rng)`,
`hojasPrimas(arbol)`, `factorizacionDe(arbol)`, `esCorrectaCompletar(item, colocados)`,
`explicar`.

## Datos de entrada

Comunes a todas las prácticas (solo lectura): `practicas/_comun/*` (la base), `practicas/plantilla/*`
(el ejemplo), `divisores/app.js` (fichas que se arrastran con pointer events, si hace falta
arrastrar), el inventario `inventario-unidad2.tsv` de la carpeta de apuntes (ruta en `proyecto.md`)
para el texto exacto de cada destreza, y las «Reglas de contenido comunes» de `proyecto.md`.
Propios de esta tarea:

- `divisores/app.js` (solo lectura): `activarFichas`, `colocar`, `huecoEn` para el patrón de
  arrastrar con pointer events; cópialo y adáptalo a tu `practica.js`.

## Cómo saber que ha terminado

- Test: en 2000 ítems, `factorizacionDe(arbolAlAzar(n))` coincide con `factorizar(n)` y con
  la fuerza bruta; todo árbol generado tiene producto correcto en cada nodo; en el
  ejercicio 2, `terminada` es verdad exactamente cuando todos los factores de la igualdad
  son primos y el producto es n; en el 3, los dos distractores del banco no completan
  ningún hueco correctamente, y hay exactamente una asignación correcta salvo permutación
  de hermanos.
- Navegador: construir el árbol de 360 entero en 375 px sin que ningún nodo se salga;
  marcar «primo» en 121 da el error en el acto.

## Trampas conocidas

- `parejasDivisores` de `aritmetica.js` incluye `1 · n`: fíltralo, un nodo no se parte en
  «1 · n».
- Un árbol con 2³ · 3² · 5 tiene 6 hojas: en 375 px solo caben si la última fila usa
  nodos de ≤ 44 px y gap de 6 px. Prueba con 360 y 384 (= 2⁷ · 3, 8 hojas) antes de dar
  por buena la maqueta; si 384 no cabe, limita n a números con ≤ 7 factores primos
  contando repeticiones y anótalo aquí.
- **Anotado (sesión s-20261007T212058-817d27db):** n se limita a 6 factores primos contando
  repeticiones (`MAXIMO_DE_HOJAS`): con nodos de 40 px y 6 px de separación, 6 hojas son 270 px
  y 7 ya no caben en los ~314 px útiles de la tarjeta. Fuera: 128, 192, 256, 288, 320 y 384.
- `.comprobar` de la base lleva `display: block`, que gana al atributo `hidden`: un botón
  «Comprobar» no se esconde con `boton.hidden = true`; hay que quitarlo (`boton.remove()`).
- La base monta el mismo ítem una segunda vez, de solo lectura, en la caja de traducción
  (`api.respondido()` ya es `true` al montar): nada de `id` ni `document.querySelector`; todo
  se busca dentro de `contenedor`, y los controles se pintan desactivados.
- Las líneas del árbol se trazan midiendo (`getBoundingClientRect`): en una caja `hidden` todo
  mide 0; por eso se vuelven a trazar con un `ResizeObserver`.
- `setPointerCapture` lanza una excepción con eventos de puntero sintéticos (pruebas): va en `try`.
- Si el selector de parejas solo aparece al tocar un compuesto, la interfaz delata qué números
  son primos: primero se pregunta «¿es primo?» y solo después se enseñan las parejas.

## Prohibido (propio de esta tarea)

- Imponer una partición concreta: cualquier pareja de divisores propios es válida, y el
  feedback nunca dice «deberías haber empezado por el 2».
- Tratar como error el orden de los factores o un árbol distinto del «esperado».

## Salida esperada

- `practicas/arbol/index.html`, `practica.js`, `logica.js`, `textos.js`, `estilos.css`
  (vacío si no hace falta nada propio). `logica.js` puro: sin DOM ni red.
- `tests/practicas-arbol.test.js`: para cada ejercicio, al menos 1000 ítems generados con
  semilla fija y comprobados contra definiciones **independientes** por fuerza bruta (no
  contra las funciones de `aritmetica.js`): la respuesta correcta es verdad, cada opción
  dada por falsa es falsa (regla de oro), y no gana quien pulsa siempre lo mismo (ninguna
  opción es correcta en más del 70 % de los ítems de un ejercicio de elegir).
- `reparto-practicas-u2/salidas/06-arbol/ENTREGA.md` con su marcador `.ok-<sid>`.
- En la terminada: la petición a la tarea 18 de poner `disponible: true` en el catálogo
  para `arbol` (si la base usa ese campo), y cualquier propuesta de cambio del contrato.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 06, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-06.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/06--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/06--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/06-arbol/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/06--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/06--<sid>.md` con hasta dónde llegaste, la línea
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
