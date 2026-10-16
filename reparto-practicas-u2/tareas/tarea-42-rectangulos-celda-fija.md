# Tarea 42 · Rectángulos (ej. 1): celda de tamaño fijo por ítem, para que el área se vea constante al cambiar el ancho

Actualizado: 2026-10-16
Precondición: ninguna (la 03 está LISTA; para este cambio la dueña de `practicas/rectangulos/` es esta tarea) · Disparo: MANUAL (sesión atendida)
Duración esperada: 45 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: 43
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/42-rectangulos-celda-fija/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/rectangulos/practica.js`, `practicas/rectangulos/logica.js` (el helper puro `ladoCelda`), `practicas/rectangulos/estilos.css`, `tests/practicas-rectangulos.test.js`

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
   printf 'sesión: %s\ntarea: 42\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/42--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/42--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 42 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/42--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

En «Descubre los rectángulos» (ejercicio 1) el alumno elige el ancho con el contador −/+ y
la rejilla pinta `ancho × ⌈n/ancho⌉` celdas. Hoy la rejilla usa el CSS común `.rejilla`
(`grid-template-columns: repeat(var(--columnas), minmax(0, 1fr))`, celdas con
`aspect-ratio: 1`): el rectángulo ocupa siempre todo el ancho de la tarjeta y **la celda
cambia de tamaño con cada ancho**. Con ancho 1 sale una columna de celdas gigantes (una por
fila, 60 filas); con ancho 10, celdas pequeñas. El área, que es lo que el ejercicio quiere
que se vea constante, parece cambiar. Lo vio Juan Luis el 2026-10-16.

Decidido con Juan Luis (maqueta vista por él, «variante C»): **la celda tiene un tamaño fijo
por ítem**, calculado para que el rectángulo `1 × n` quepa entero en el ancho disponible, y
no cambia mientras el alumno mueve el ancho. Lo que varía es el alto y el ancho del
rectángulo, que es lo que debe variar. Se descartó la celda de tamaño físico fijo (1 mm: no
se distinguen las celdas sobrantes; 2 mm: el 1×60 no cabe en un móvil).

## Siguiente paso

1. Lee `practicas/rectangulos/practica.js` (`montarRectangulos` y `pintarAncho`, líneas
   30-95), `practicas/rectangulos/estilos.css`, y en `practicas/_comun/estilos.css` las
   reglas `.rejilla` y `.rejilla__celda*` (líneas 142-158) y la de `max-width: 560px` (línea
   241). `practicas/_comun/` no se toca: todo va en el CSS propio con una clase modificadora.
2. `git status -sb` y `git log --oneline -3 -- practicas/rectangulos`: si hay cambios sin
   comitear de otra sesión, no los pises.
3. Helper puro y su test primero; después `practica.js` y el CSS; después el navegador.

## Qué hay que hacer

1. **Helper puro** en `logica.js`: `ladoCelda(disponible, n, tope = 20)` devuelve
   `Math.max(3, Math.min(tope, Math.floor(disponible / n)))` (píxeles CSS), y
   `huecoCelda(lado)` devuelve `2` si `lado >= 8`, `1` si `lado >= 5`, `0` si no. Exporta
   los dos. Son lo único de esta tarea que se testea.
2. **Clase modificadora** en la rejilla del ejercicio 1: `<div id="rejilla" class="rejilla
   rejilla--fija">`, con variables `--columnas` (ya existe), `--lado` y `--hueco` puestas
   desde JS. En `practicas/rectangulos/estilos.css`:
   ```css
   .rejilla--fija { grid-template-columns: repeat(var(--columnas), var(--lado)); grid-auto-rows: var(--lado);
     gap: var(--hueco); width: max-content; max-width: 100%; margin: 0 auto 1rem; }
   .rejilla--fija .rejilla__celda { aspect-ratio: auto; border-radius: 2px; font-size: 0; }
   .rejilla--fija .rejilla__celda--tachada { background: var(--error-claro); border-color: #f3b4b4; text-decoration: none; }
   ```
   (las celdas no llevan texto; el tachado no se ve a 5 px y el rojo claro sí). Si el lado
   es menor que 8, `border-radius: 0`.
3. **Cálculo en `montarRectangulos`**, una vez por ítem: `disponible = rejillaDiv.parentElement.clientWidth`
   (o el de `contenedor`, el que corresponda al ancho útil de la tarjeta; comprueba que no
   es 0 en el momento de montar; si lo fuera, calcula en el primer `pintarAncho` o en un
   `requestAnimationFrame`), `lado = ladoCelda(disponible, n)`, `hueco = huecoCelda(lado)`, y
   las dos variables en `rejillaDiv.style`. **El mismo lado para todos los anchos del ítem.**
   Al cambiar el tamaño de la ventana (`resize`, con un `ResizeObserver` sobre el
   contenedor o un listener que se quite al responder) se recalcula; no se recalcula al
   cambiar el ancho del rectángulo.
4. `pintarAncho` sigue igual (`--columnas`, celdas, tachadas, lista de parejas): solo cambia
   que ya no depende del CSS común para el tamaño.
5. **Test** (`tests/practicas-rectangulos.test.js`): `ladoCelda(343, 60) === 5`,
   `ladoCelda(528, 60) === 8`, `ladoCelda(343, 12) === 20` (tope), `ladoCelda(100, 60) === 3`
   (mínimo), y para todo n de 12 a 60 y disponible de 300 a 560: `ladoCelda(d, n) * n <= d` o
   bien el lado es el mínimo 3; `huecoCelda` en sus tres tramos.

## Datos de entrada

Solo lectura: `practicas/_comun/estilos.css` (`.rejilla`, líneas 142-158 y 241),
`practicas/_comun/piezas.js` (`pasos`), la maqueta que vio Juan Luis (no está en el repo; su
lógica es la del punto 1: `lado = min(tope, ⌊disponible / n⌋)`, hueco 2/1/0 px según el
lado, sobrantes en rojo claro), las «Reglas de contenido comunes» de `proyecto.md`.

## Cómo saber que ha terminado

En el navegador (`npm run servir`, http://localhost:8080/practicas/rectangulos/), ejercicio 1,
en una ventana de 375 px y en una ancha:

- Con un n grande (vuelve a «Siguiente» hasta que salga 60, 56 o 54): con ancho 1 el
  rectángulo es una columna de n celdas iguales que cabe entera sin scroll horizontal; al
  subir el ancho a 2, 3… las celdas **no cambian de tamaño**, el rectángulo se ensancha y se
  acorta, y las sobrantes se ven en rojo claro; con el ancho máximo (r + 3) todo sigue
  igual de grande.
- Con un n pequeño (12, 14, 15) las celdas son grandes (tope 20 px) y el 1×12 cabe.
- Al redimensionar la ventana con un ítem abierto, la rejilla se recalcula sin romperse.
- Los ejercicios 2 y 3 de la práctica no cambian (no usan `.rejilla--fija`); criba y recta
  tampoco (no se ha tocado el común).
- `node --test tests/practicas-comun.test.js tests/practicas-rectangulos.test.js` en verde
  y `npm test` sin fallos en tus ficheros.

## Trampas conocidas

- El ancho disponible leído con `clientWidth` antes de que el contenedor esté en el DOM o
  visible es 0: lee el ancho después de `contenedor.innerHTML = …` y, si sale 0, difiere el
  cálculo (`requestAnimationFrame`) o usa un valor de respaldo (343).
- El CSS común pone `.rejilla { max-width: 560px; margin-left/right: auto }` en pantallas
  anchas y las celdas `aspect-ratio: 1` con `minmax(0, 1fr)`: la clase modificadora tiene que
  ganar a las dos cosas (`grid-template-columns` y `grid-auto-rows` explícitos, `aspect-ratio:
  auto`). Comprueba en el inspector que no queda ninguna regla del común mandando sobre el
  tamaño.
- `gap: 0` con bordes de 1 px entre celdas vecinas da líneas de 2 px: aceptable a 3-4 px de
  lado, pero no pongas `gap` negativo ni quites el borde, que es lo que delimita la celda.

## Prohibido (propio de esta tarea)

- Tocar `practicas/_comun/estilos.css` o `.rejilla` del común (lo usan criba y recta).
- Cambiar la lógica del ejercicio (`parPara`, `todasLasClaves`, el contador, el máximo
  `r + 3`) o los ejercicios 2 y 3.
- Volver a un tamaño que dependa del ancho elegido, o a un tamaño físico fijo (mm): está
  decidido.

## Salida esperada

- Los ficheros de «Ficheros que toca» cambiados y comiteados.
- `reparto-practicas-u2/salidas/42-rectangulos-celda-fija/ENTREGA.md` (hash, ficheros, cómo
  probarlo en 1 minuto, el lado que sale a 375 px y a 560 px con n = 60 y con n = 12) y su
  marcador `ENTREGA.md.ok-<sid>`.
- En la terminada: si `.rejilla--fija` merecería pasar al común para otras prácticas
  (propuesta, no lo hagas).

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 42, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-42.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/42--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/42--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/42-rectangulos-celda-fija/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/42--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/42--<sid>.md` con hasta dónde llegaste, la línea
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
