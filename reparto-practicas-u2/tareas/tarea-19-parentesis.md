# Tarea 19 · Coloca los paréntesis: conseguir todos los resultados posibles de una operación combinada, con la resolución paso a paso (repaso de la unidad 1)

Actualizado: 2026-10-07
Precondición: 01 LISTA · Disparo: MANUAL (sesión atendida)
Duración esperada: 2 h (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: 16
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/19-parentesis/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/parentesis/*` (nuevo), `tests/practicas-parentesis.test.js` (nuevo)

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
   printf 'sesión: %s\ntarea: 19\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/19--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/19--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 19 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/19--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

Idea de Juan Luis (2026-10-07): una operación combinada con huecos entre los números; el
alumno va colocando paréntesis y, con cada colocación válida, ve la resolución paso a paso
y se enciende el resultado conseguido, hasta tener todos los posibles. Repaso de la unidad
1 (jerarquía de las operaciones y paréntesis) para alumnos que ya van por la unidad 2.
Destrezas del inventario de la unidad 1 (fichero `inventario-unidad1.tsv`, ruta en «Datos de
entrada»): 1A-10, 1A-11, 1A-12 (el paréntesis va antes del producto y de la potencia),
2A-07, 2A-08 (paréntesis en el dividendo y en el divisor), 2A-13, y de rebote 1A-14 y 1A-15
(qué operación va primero). Lo que la hace distinta de un test: el alumno descubre que
unos paréntesis pueden no cambiar nada, que otros no se pueden hacer en naturales, y ve
la jerarquía actuar línea a línea.

## Siguiente paso

1. Lee la ficha de la tarea 01 (`reparto-practicas-u2/tareas/tarea-01-base-comun.md`),
   apartados §1 (catálogo), §2 (`aritmetica.js`: no reescribas lo que ya está ahí) y §3
   (el contrato de `arrancar(practica)` y la `api` de `montar`), y después
   `practicas/plantilla/practica.js` entero con sus comentarios, `practicas/_comun/aritmetica.js`
   (los exports reales mandan sobre esta ficha si difieren) y `practicas/_comun/estilos.css`.
   Si la terminada de la 01 (`reparto-practicas-u2/hechos/terminadas/01--*.md`) anuncia
   cambios del contrato, mandan sobre esta ficha.
2. Copia `practicas/plantilla/` a `practicas/parentesis/` (si no existe ya de una sesión caída)
   y cambia el `<title>`, el `slug` y el icono.
3. Escribe primero `logica.js` (generadores y comprobaciones, puro) con su test
   `tests/practicas-parentesis.test.js`, en verde, y solo después `montar` y los textos.

## Qué hay que hacer

**La expresión** es una lista de 3 o 4 números naturales con operaciones binarias entre
ellos: `+`, `−`, `·`, `:` y, solo en último lugar, el cuadrado o el cubo (`²`, `³`) aplicado
al número o al grupo que tenga delante. Las agrupaciones posibles son los árboles binarios
sobre esa lista (2 con tres números, 5 con cuatro); **el exponente nunca se agrupa con
nada** (no hay expresiones en el exponente): se trata como una operación unaria sobre el
último operando o sobre el grupo cerrado justo antes de él. Un árbol es **válido** si todas
sus operaciones intermedias dan naturales (sin restas negativas ni divisiones inexactas) y
ningún valor intermedio pasa de 10 000. Los **resultados posibles** son los valores
distintos de los árboles válidos.

En `logica.js`, puro y con tests:
- `arboles(expresion)` → todas las agrupaciones; `evaluar(arbol)` → `{ valor, pasos }` o
  `{ invalido: { paso, razon: 'negativo' | 'inexacta' | 'grande' } }`; `pasos` es la
  lista de líneas de la resolución, cada una la expresión entera con una operación menos,
  resolviendo primero el paréntesis más interno y dentro de cada nivel potencias, después
  `·` y `:` de izquierda a derecha, después `+` y `−` de izquierda a derecha, exactamente
  como se enseña en la unidad 1. Los paréntesis que ya no agrupan nada desaparecen en la
  línea siguiente: `(5 + 2 · 3)² = (5 + 6)² = 11² = 121`.
- `resultados(expresion)` → valores distintos de los árboles válidos, ordenados.
- `interpretar(expresion, parentesis)` → el árbol que corresponde a una colocación del
  alumno, o `{ error: 'desequilibrados' | 'vacio' }`. `parentesis` es, por operando, el
  número de `(` a su izquierda y de `)` a su derecha. Unos paréntesis alrededor de un solo
  número o de toda la expresión son válidos y **redundantes**: el árbol es el mismo que sin
  ellos y la app lo dice.
- `generar(ejercicio, rng)` con las restricciones de cada ejercicio y con la garantía de
  que **todos** los resultados posibles son alcanzables con a lo sumo dos niveles de
  paréntesis (con cuatro números siempre lo son).
- `textoPasos(pasos, idioma)` para el HTML de la resolución (· como punto medio, `:` en
  español y `÷` en inglés, exponentes con `<sup>`).

**La interfaz** (`montar`): los números en una fila grande; a la izquierda de cada número
un hueco que solo admite `(` y a su derecha uno que solo admite `)`; tocar un hueco pasa
de nada a uno y a dos paréntesis y vuelve a nada. Con los paréntesis equilibrados la app
evalúa sola (sin botón): si la agrupación es válida, aparece la resolución línea a línea
(una línea cada 400 ms) y se enciende el chip del resultado; si ya estaba encendido, la
resolución se muestra igual y un texto dice «ya lo tenías: estos paréntesis no cambian el
resultado» (o, si son redundantes, «estos paréntesis no agrupan nada»); si es inválida, la
resolución llega hasta la línea del problema y la señala: «8 − 15: no se puede en los
números naturales» o «7 : 2 no es exacta». Desequilibrados: los huecos en rojo suave y
nada más. Debajo, los **chips de resultados** apagados, el que se consigue sin paréntesis
encendido desde el principio. Un botón **«Pista»** coloca un paréntesis de una agrupación
que falta (y cuenta: ver contador). Cuando todos los chips están encendidos, el ítem
termina: `responder({ acierto: true, pistas: n, html: 'resumen de las agrupaciones con su
resultado' })`. En los ejercicios 1 a 3 **no hay fallo**: `penalizacion: 0`, `inicial: 5`
(cinco expresiones), y lo que se mide son las pistas (campo `pistas` de `responder`,
ficha 01 §3). Botón «Borrar paréntesis» siempre visible.

Cuatro ejercicios:

1. **Tres números.** `+`, `·` y a veces `²` al final; exactamente 2 resultados distintos
   (el generador descarta expresiones donde las dos agrupaciones coinciden).
2. **Cuatro números con +, · y cuadrado.** Como el ejemplo de Juan Luis: 5 + 2 · 3² →
   23, 63, 41, 121, 441. Entre 4 y 5 resultados distintos; todos los árboles válidos.
3. **Con resta y división.** Cuatro números con `−` o `:` en al menos una operación; al
   menos un árbol **inválido** en naturales y al menos 3 resultados válidos. El chip de
   los inválidos no existe: el alumno los descubre al probar, y la resolución dice por qué.
4. **Una sola diana.** Como en el examen: «Coloca paréntesis para obtener 63». Contador
   normal (`inicial: 20, penalizacion: 5`), botón «Comprobar»: acierto si la agrupación
   válida da el objetivo; fallo si da otro valor (feedback: la resolución de lo que ha
   puesto y una agrupación que sí da 63 con su resolución). El objetivo nunca es el valor
   sin paréntesis.

Ítem: `{ tipo: 'todos' | 'diana', numeros, operaciones, exponente: null | 2 | 3, resultados, sinParentesis, objetivo }`.

## Datos de entrada

Comunes a todas las prácticas (solo lectura): `practicas/_comun/*` (la base), `practicas/plantilla/*`
(el ejemplo), `divisores/app.js` (fichas que se arrastran con pointer events, si hace falta
arrastrar), el inventario `inventario-unidad2.tsv` de la carpeta de apuntes (ruta en `proyecto.md`)
para el texto exacto de cada destreza, y las «Reglas de contenido comunes» de `proyecto.md`.
Propios de esta tarea:

- Inventario de la unidad 1 (solo lectura):
  `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/1. Natural numbers, powers and roots/cuestionarios/comun/reparto/salidas/06-reserva/inventario-unidad1.tsv`
  (filas 1A-10 a 1A-15, 2A-07, 2A-08, 2A-13).
- `src/ejercicios/jerarquia.js` (solo lectura): el estilo de los pasos escritos («(a + b) · c
  = S · c = R») y los nombres de los errores típicos, para el feedback del ejercicio 4. No
  hay evaluador general reutilizable: hay que escribirlo aquí.

## Cómo saber que ha terminado

- Test: para 3000 expresiones por ejercicio, `resultados` coincide con la fuerza bruta
  (evaluar cada árbol con aritmética directa y filtrar los inválidos); cada paso de `pasos`
  evalúa al mismo valor que el anterior (la igualdad es cierta línea a línea); toda
  colocación de paréntesis equilibrada se interpreta como uno de los árboles de `arboles`
  y toda agrupación de `arboles` se obtiene con alguna colocación de a lo sumo dos niveles;
  en el ejercicio 3 hay al menos un inválido y en el 1 exactamente 2 resultados; en el 4 el
  objetivo es alcanzable y distinto de `sinParentesis`.
- Navegador: cuatro números con sus huecos caben en 375 px con letra ≥ 1.3 rem; la
  resolución de 4 líneas se lee sin desplazamiento horizontal; «Pista» coloca un
  paréntesis visible.

## Trampas conocidas

- `5 − 2 + 3` y `5 − (2 + 3)` dan valores distintos, pero `5 + 2 + 3` agrupado de dos
  maneras da lo mismo: la deduplicación es por valor, no por árbol, y el mensaje «no cambia
  el resultado» tiene que salir en ese caso.
- El cuadrado de un grupo con cuatro números puede pasar de 10 000 ((9 + 8 · 7)² = 4225 vale;
  ((9 + 8) · 7)² = 14 161 no): el tope de 10 000 convierte ese árbol en inválido con la
  razón `grande`; mejor que el generador elija números para que no ocurra en los ejercicios
  1 y 2 (y el test lo compruebe).
- La resta y la división se leen de izquierda a derecha: `12 : 6 : 2` es 1, no 4. El
  evaluador tiene que respetarlo y el test comprobarlo con casos fijos.

## Prohibido (propio de esta tarea)

- Expresiones en el exponente, exponentes distintos de 2 y 3, raíces, o números negativos
  en ningún paso (nada que no se haya dado antes de la unidad 3).
- Penalizar probar: en los ejercicios 1 a 3 ninguna colocación cuenta como fallo.
- Usar `×`: punto medio, también aquí aunque sea repaso de la unidad 1 (decisión de Juan
  Luis, 2026-10-07).

## Salida esperada

- `practicas/parentesis/index.html`, `practica.js`, `logica.js`, `textos.js`, `estilos.css`
  (vacío si no hace falta nada propio). `logica.js` puro: sin DOM ni red.
- `tests/practicas-parentesis.test.js`: para cada ejercicio, al menos 1000 ítems generados con
  semilla fija y comprobados contra definiciones **independientes** por fuerza bruta (no
  contra las funciones de `aritmetica.js`): la respuesta correcta es verdad, cada opción
  dada por falsa es falsa (regla de oro), y no gana quien pulsa siempre lo mismo (ninguna
  opción es correcta en más del 70 % de los ítems de un ejercicio de elegir).
- `reparto-practicas-u2/salidas/19-parentesis/ENTREGA.md` con su marcador `.ok-<sid>`.
- En la terminada: la petición a la tarea 18 de poner `disponible: true` en el catálogo
  para `parentesis` (si la base usa ese campo), y cualquier propuesta de cambio del contrato.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 19, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-19.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/19--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/19--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/19-parentesis/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/19--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/19--<sid>.md` con hasta dónde llegaste, la línea
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
