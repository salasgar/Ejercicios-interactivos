# Tarea 05 · Criba de Eratóstenes y flashcards «¿primo o compuesto?» con los compuestos que parecen primos

Actualizado: 2026-10-07
Precondición: 01 LISTA · Disparo: MANUAL (sesión atendida)
Duración esperada: 2 h (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/05-criba/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/criba/*` (nuevo), `tests/practicas-criba.test.js` (nuevo)

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
   printf 'sesión: %s\ntarea: 05\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/05--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/05--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 05 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/05--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

Construir la criba hasta 100 tachando, entender por qué basta con el 7, y reconocer los
primos menores que 100 de memoria, con los tramposos 51, 57, 87, 91, 119, 143 delante.
Destrezas: U2-2C-04 (criba y por qué basta tachar los múltiplos de 2, 3, 5 y 7), U2-2C-05
(primos menores que 100), U2-2C-06 (decidir si es primo probando hasta la raíz entera),
U2-2C-07 (compuestos que parecen primos), U2-2C-01/02/03 (definición por número de
divisores, el 1 no es primo ni compuesto, el 2 es el único primo par), U2-2B-01
(vocabulario: prime, composite, neither, sieve, cross out). Error que ataca: «impar,
luego primo».

## Siguiente paso

1. Lee la ficha de la tarea 01 (`reparto-practicas-u2/tareas/tarea-01-base-comun.md`),
   apartados §1 (catálogo), §2 (`aritmetica.js`: no reescribas lo que ya está ahí) y §3
   (el contrato de `arrancar(practica)` y la `api` de `montar`), y después
   `practicas/plantilla/practica.js` entero con sus comentarios, `practicas/_comun/aritmetica.js`
   (los exports reales mandan sobre esta ficha si difieren) y `practicas/_comun/estilos.css`.
   Si la terminada de la 01 (`reparto-practicas-u2/hechos/terminadas/01--*.md`) anuncia
   cambios del contrato, mandan sobre esta ficha.
2. Copia `practicas/plantilla/` a `practicas/criba/` (si no existe ya de una sesión caída)
   y cambia el `<title>`, el `slug` y el icono.
3. Escribe primero `logica.js` (generadores y comprobaciones, puro) con su test
   `tests/practicas-criba.test.js`, en verde, y solo después `montar` y los textos.

## Qué hay que hacer

Tres ejercicios:

1. **La criba, paso a paso.** `inicial: 5, penalizacion: 1`. Es un ejercicio **secuencial**:
   `generar(rng, sesion)` usa `sesion.aciertos` para saber en qué paso va (0: múltiplos de
   2, 1: de 3, 2: de 5, 3: de 7, 4: la pregunta final). Tabla 1-100 de 10 × 10 celdas
   tocables; las celdas ya tachadas en pasos anteriores vienen tachadas en gris y el 1
   viene marcado «ni primo ni compuesto». Instrucción: «Tacha los múltiplos de 3 que
   quedan (el 3 no, que es primo)». «Comprobar»: acierto si el conjunto tocado es
   exactamente el de los múltiplos de p mayores que p que no estaban tachados. Fallo: las
   celdas que sobran o faltan parpadean con su explicación («51 = 3 · 17») y el ítem se
   repite (la penalización +1 añade un paso: el generador recalcula el paso con
   `aciertos`, así que un fallo repite el mismo paso). Paso 4: «Después del 7, ¿por qué
   no hace falta tachar los múltiplos del 11?» con cuatro opciones: «porque 11 · 11 = 121
   ya pasa de 100: sus múltiplos menores ya estaban tachados» (correcta), «porque el 11 es
   impar», «porque el 11 no es primo», «porque 11 · 2 = 22 ya pasa de 100». Al terminar,
   la criba completa con los 25 primos resaltados y el texto «hay 25 primos menores que
   100».
2. **¿Primo o compuesto?** Flashcards con tres botones: Primo / Compuesto / Ni primo ni
   compuesto. Números de 1 a 150 con **pesos**: un 30 % de los ítems son de la lista de
   tramposos {51, 57, 87, 91, 119, 133, 143, 121, 169, 111, 117, 123, 129, 141, 147} más
   el 1 un 5 %; el 2 un 5 %; el resto, mitad primos y mitad compuestos. Feedback compuesto:
   «51 = 3 · 17 (la suma de las cifras es 6)» o «91 = 7 · 13: hay que probar el 7»;
   feedback primo: «probamos 2, 3, 5, 7 (hasta 11 · 11 = 121 > 97): ninguno divide». Para
   el 1: «tiene un solo divisor». Para el 2: «es el único primo par».
3. **¿Hasta qué primo hay que probar?** «Para saber si 113 es primo, ¿qué primos hay que
   probar?» n ∈ [50, 200]; cuatro opciones como listas: la correcta es «2, 3, 5, 7» (los
   primos ≤ raíz entera), las falsas: la lista hasta el primo siguiente, la lista hasta el
   primo anterior, y «todos los primos hasta n/2» (texto). Si n > 120 la correcta incluye
   el 11 (121 ≤ n). Feedback con la raíz: «10 · 10 = 100 < 113 < 11 · 11 = 121, así que
   basta probar hasta el 7». Un 30 % de los n son compuestos y entonces, acertada la lista,
   la segunda parte del ítem pregunta «¿y es primo?» Sí/No; el ítem solo es acierto si las
   dos respuestas lo son (una llamada a `responder` al final).

## Datos de entrada

Comunes a todas las prácticas (solo lectura): `practicas/_comun/*` (la base), `practicas/plantilla/*`
(el ejemplo), `divisores/app.js` (fichas que se arrastran con pointer events, si hace falta
arrastrar), el inventario `inventario-unidad2.tsv` de la carpeta de apuntes (ruta en `proyecto.md`)
para el texto exacto de cada destreza, y las «Reglas de contenido comunes» de `proyecto.md`.
Propios de esta tarea:

- `aritmetica.js`: `PRIMOS`, `esPrimo`, `factorizar`, `raizEntera`.

## Cómo saber que ha terminado

- Test: ejercicio 1, para cada paso el conjunto correcto coincide con fuerza bruta (y en
  el paso del 7 el conjunto es exactamente {49, 77, 91}); ejercicio 2, la clasificación
  coincide con la definición por número de divisores, y en 3000 ítems los tramposos
  aparecen ≥ 25 %; ejercicio 3, la lista correcta es exactamente `PRIMOS.filter(p => p*p <= n)`
  y las cuatro opciones son distintas.
- Navegador: la tabla 10 × 10 cabe en 375 px con celdas de ≥ 32 px; tachar 49 celdas (paso
  del 2) no exige precisión (celdas tocables enteras, con estado visible).

## Trampas conocidas

- (Reabierta 2026-10-08) En «¿qué primos hay que probar?» la pregunta tiene que pedir la lista **más corta**: sin eso, «2, 3, 5, 7, 11» también sirve y deja de ser distractor. Y los textos con un número del ítem no pueden usar la letra n.
- (Reabierta) Un mensaje de fallo sin número concreto no vale (regla 8): cita siempre una celda con su cuenta.

- En el paso del 2 hay 49 celdas que tocar: ofrece también «tachar arrastrando» (pointer
  events con `pointerenter` sobre celdas mientras se mantiene pulsado) o el paso se hace
  eterno; que el toque simple siga funcionando.
- El 1 no es múltiplo de ningún primo en la criba y no es primo: viene marcado desde el
  principio con otro color, y nunca es «correcto» tacharlo.

## Prohibido (propio de esta tarea)

- Pedir construir la criba hasta 200 o con más primos: 100 y 2, 3, 5, 7 es lo que se da.
- Un distractor que diga «el 1 es primo» como opción correcta o «compuesto» para el 1.

## Salida esperada

- `practicas/criba/index.html`, `practica.js`, `logica.js`, `textos.js`, `estilos.css`
  (vacío si no hace falta nada propio). `logica.js` puro: sin DOM ni red.
- `tests/practicas-criba.test.js`: para cada ejercicio, al menos 1000 ítems generados con
  semilla fija y comprobados contra definiciones **independientes** por fuerza bruta (no
  contra las funciones de `aritmetica.js`): la respuesta correcta es verdad, cada opción
  dada por falsa es falsa (regla de oro), y no gana quien pulsa siempre lo mismo (ninguna
  opción es correcta en más del 70 % de los ítems de un ejercicio de elegir).
- `reparto-practicas-u2/salidas/05-criba/ENTREGA.md` con su marcador `.ok-<sid>`.
- En la terminada: la petición a la tarea 18 de poner `disponible: true` en el catálogo
  para `criba` (si la base usa ese campo), y cualquier propuesta de cambio del contrato.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 05, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-05.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/05--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/05--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/05-criba/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/05--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/05--<sid>.md` con hasta dónde llegaste, la línea
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
