# Tarea 35 · Base: 10 aciertos en vez de 20, y el idioma de cada ítem al azar sin que el alumno pueda elegirlo

Actualizado: 2026-10-07
Precondición: 01 LISTA · Disparo: MANUAL (sesión atendida)
Duración esperada: 1 h (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/35-base-10-e-idioma-alterno/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/base.js`, `practicas/_comun/contador.js`, `practicas/_comun/textos.js`, `practicas/_comun/estilos.css` (si hace falta), `practicas/plantilla/practica.js` (solo comentarios), `practicas/profesor.js` y `practicas/profesor.html` (opción de idioma en los enlaces), `tests/practicas-comun.test.js`, `README.md` (solo el apartado «Prácticas de la unidad 2»)

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
   printf 'sesión: %s\ntarea: 35\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/35--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/35--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 35 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/35--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

Dos decisiones de Juan Luis del 2026-10-07 tras probar la práctica de divisores en el
móvil: **veinte repeticiones son demasiadas; se dejan en diez**, y **el idioma no lo elige el
alumno: cada ítem sale en español o en inglés al azar**, para que aprenda el vocabulario en
los dos. Se cambia en la base, y así lo heredan las treinta prácticas y la migración de
`divisores/` (tarea 17, que pasa a depender de esta).

## Siguiente paso

Lee `practicas/_comun/base.js`, `contador.js`, `textos.js` y `practicas/plantilla/practica.js`,
y la addenda de la ficha 01 (el contrato real). Comprueba qué tests de
`tests/practicas-comun.test.js` fijan los valores 20, 5 y 40 (líneas ~192, 226, 384, 425-427)
y el idioma: son los que vas a cambiar.

## Qué hay que hacer

### 1. Contador: 10 / +2 / tope 20 por defecto

En `contador.js`: `INICIAL = 10`, `PENALIZACION = 2`, `MAXIMO = 20`. Los tres se eligen a juego
con lo que `divisores/` tiene publicado hoy (+2 con frase de ánimo y tope de 40 para 20
aciertos: el tope se reduce en la misma proporción). Las prácticas que declaren `inicial`,
`penalizacion` o `maximo` propios (la criba, 5 y 1) no cambian. `menu_regla(inicial,
penalizacion, maximo)` ya está parametrizado: comprueba que el menú muestra «acertar 10
veces» y «hasta un máximo de 20».

**Progreso guardado con 20:** un alumno que tenga guardado `pendientes: 17` de la versión
anterior debe seguir sin quedar bloqueado. Al cargar el progreso, si `pendientes > maximo`,
se recorta a `maximo`; si `aciertos + pendientes > 2 · inicial` sin terminar, se recorta
igual. Escríbelo en `base.js` al cargar y testéalo.

### 2. Idioma alterno por ítem

- **Modo por defecto «alterno»:** la base sortea el idioma de cada ítem con una baraja
  equilibrada (bloques de 4: dos `es` y dos `en` barajados), de modo que en 10 ítems salen 5 y
  5 y nunca más de 4 seguidos del mismo. El idioma del ítem se fija al generarlo y se guarda
  con él (`actual.idioma`), así un recargado no lo cambia.
- **Dentro del ejercicio todo va en el idioma del ítem:** instrucción, enunciado, botones
  comunes (Comprobar, Siguiente) y feedback. `api.idioma`, `api.t` y `api.tt` reflejan el
  idioma del ítem, no un ajuste global. Las prácticas no cambian nada: ya reciben el idioma
  por la `api`.
- **Fuera del ejercicio** (entrada, menú, fin, código de resultado) la interfaz va en
  español, lengua del centro, salvo que el idioma esté fijado (abajo).
- **El selector ES/EN de la cabecera desaparece para el alumno.** En su lugar, durante un
  ítem, una etiqueta no pulsable con el idioma del ítem («ES» / «EN»), que en el modo fijo no
  aparece.
- **Traducción después de responder:** cuando el ítem ya está respondido aparece un botón
  discreto «Ver en español» / «See in English» que vuelve a montar **el mismo ítem** en el
  otro idioma dentro de una caja plegable de solo lectura (una segunda llamada a `montar`
  con una `api` cuyo `responder` no hace nada y `respondido()` devuelve `true`), para que el
  alumno vea el enunciado traducido. El feedback de la práctica no se traduce (lo escribió la
  práctica en un idioma); se traduce lo común. Antes de responder no hay traducción: si no,
  nadie leería el inglés.
- **Idioma fijo** para alumnos concretos (dislexia, recién llegados): el parámetro de URL
  `?idioma=es` o `?idioma=en`, que se guarda en `localStorage` junto al código
  (`practicas.idioma_fijo.<código>`) y fija todos los ítems y la interfaz; `?idioma=alterno`
  lo quita. En el panel del profesor, junto a la tabla de enlaces directos, un selector
  «Idioma de los enlaces: alterno (por defecto) / español / inglés» que añade el parámetro a
  **todos** los enlaces generados; para fijarlo a un alumno concreto, el profesor copia su
  enlace y lo cambia a mano (una línea de ayuda lo dice).
- El documento de Firestore guarda el idioma de cada respuesta no: basta con guardar en
  `ej[n]` dos contadores nuevos, `en_aciertos` y `en_fallos`, para saber cuánto se hizo en
  inglés; el panel los muestra en la vista de detalle si caben («EN: 5/0»). Los códigos de
  resultado no cambian.

### 3. Lo demás

- `practicas/plantilla/practica.js`: actualiza los comentarios del contrato (idioma por
  ítem, 10/+2/20, traducción tras responder). El código de la plantilla no necesita cambiar.
- `README.md`, apartado «Prácticas de la unidad 2»: la regla nueva en dos líneas.
- Tests: ajusta los que fijaban 20/5/40; añade tests de la baraja equilibrada (en 1000
  secuencias de 10, cinco y cinco y ninguna racha mayor que 4), del recorte del progreso
  antiguo, de `?idioma=` (función pura que decide el modo a partir de la URL y lo guardado)
  y del panel con el selector.

## Datos de entrada

- `practicas/_comun/*`, `practicas/plantilla/*`, `tests/practicas-comun.test.js` (la base tal
  como la dejó la tarea 01, commit 914d5b0, y su addenda en la ficha 01).
- `divisores/logica.js` (solo lectura): `PENALIZACION = 2`, `MAXIMO = 40` publicados hoy.
- Las prácticas ya terminadas (`practicas/semaforo/`, etc., solo lectura): pruébalas en el
  navegador con el modo alterno para comprobar que no se rompe nada.

## Salida esperada

- Los ficheros de «Ficheros que toca», con `npm test` en verde (incluidos los tests de las
  prácticas ya terminadas, que no se tocan).
- `reparto-practicas-u2/salidas/35-base-10-e-idioma-alterno/ENTREGA.md` + `.ok-<sid>`.

## Cómo saber que ha terminado

- `npm test` en verde; en `http://localhost:8080/practicas/plantilla/` el menú dice «acertar
  10 veces», los ítems alternan idioma sin selector, tras responder aparece la traducción, y
  con `?idioma=en` todo sale en inglés sin etiqueta. `…/practicas/semaforo/` (ya LISTA)
  funciona igual con el modo alterno.
- Un progreso guardado a mano en `localStorage` con `pendientes: 17` se carga recortado a
  10 sin romper nada.

## Trampas conocidas

- Tres o cuatro sesiones están construyendo prácticas sobre la base mientras haces esto:
  no toques el contrato de `montar` ni la `api` (solo añades la etiqueta y la traducción,
  que viven en la base). Si una práctica terminada falla con tu cambio, es tu cambio.
- `sleep 30` y volver a mirar antes de reclamar: esta tarea comparte `tests/practicas-comun.test.js`
  con la 34, que por eso pasa a depender de ti.
- **Bloques de 4 y «10 ítems salen 5 y 5» no es exacto**: con `inicial=10` sin
  fallos hay 10 ítems = dos bloques completos (8, exactos 4/4) + los dos
  primeros de un tercer bloque al azar, que pueden caer los dos del mismo
  lado. Es 5/5 en el caso típico, no una garantía matemática; el test lo
  comprueba sobre 8 (dos bloques completos) y, en 10, solo el equilibrio
  aproximado y la racha máxima de 4.
- **El navegador cachea el módulo `base.js` agresivamente**: tras cada cambio,
  `cmd+shift+r` (hard reload) o el DevTools con «disable cache»; un reload
  normal (o incluso navegar a otra URL) puede seguir sirviendo la versión
  anterior del módulo y hacer pensar que un cambio no se ha aplicado.
- `python3 -m http.server 8080` puede fallar con «Address already in use» aunque
  `lsof -iTCP:8080` no muestre nada (proceso zombi de otra sesión): mata
  cualquier `http.server 8080` antes de lanzar el tuyo y compruébalo con
  `curl` antes de usar el navegador.

## Prohibido (propio de esta tarea)

- Cambiar el formato del código de resultado o los códigos de alumno.
- Tocar `practicas/<slug>/` de ninguna práctica, ni `divisores/`.
- Mostrar la traducción antes de que el alumno responda.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 35, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-35.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/35--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/35--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/35-base-10-e-idioma-alterno/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/35--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/35--<sid>.md` con hasta dónde llegaste, la línea
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
