# Tarea 110 · Revisión y publicación de las prácticas de la semana 2 de la unidad 4, y propuesta de su tarea

Actualizado: 2026-10-26
Precondición: 103 y 104 LISTAS · 109 LISTA · Disparo: MANUAL (sesión atendida)
Duración esperada: 1 h (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/110-publicar-u4-semana2/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/catalogo.js` (solo `disponible` de `fraccion-de`, `suma-resta`)

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
   printf 'sesión: %s\ntarea: 110\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/110--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/110--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 110 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/110--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.



## Objetivo

Revisar a mano y publicar las prácticas de la **semana 2 de la unidad 4** — 103 (`fraccion-de`), 104 (`suma-resta`) — antes del
**jueves 17-12**, para que Juan Luis pueda montar con ellas la tarea de la app de la semana (editor del panel). Y proponerle esa tarea.

Es la revisión que no puede hacer un test: el significado. Verifica y, si algo falla, **reabre; no corrige** (salvo
erratas de una línea en un texto, que se arreglan y se dicen). Una práctica que no pasa se queda sin publicar y con su
reabierta; las demás se publican igual. Publica también las que la publicación anterior reabrió, si ya cerraron, verificadas
otra vez. La tarea de esta semana cruza la Navidad (lun 21-12 → jue 7-1): en la propuesta, dilo y propón si conviene que sea algo más larga. El producto y las potencias se dan el jue 7-1, el último día de esa tarea (acta del 26-10): la tarea de la semana 2 no lleva producto; la práctica 105 (`multiplica-divide`) va en la de la semana 3.

## Siguiente paso

1. Lee las fichas de las tareas de la semana, sus terminadas y sus `ENTREGA.md` (propuestas que han dejado: algunas son para ti, como un número de ejercicios distinto; otras para Juan Luis).
2. `npm run servir` y abre cada práctica por su URL con el código de prueba 61 (`KTFN`; nunca el de un alumno ni AJJN).

## Qué hay que hacer

1. **Regla de oro, a mano**, ejercicio por ejercicio: genera al menos 30 ítems de cada uno (en la consola o con un
   script en el scratchpad, con las funciones de su `logica.js`) y lee cada distractor: ¿podría darse por bueno? **¿Hay dos
   opciones con el mismo valor?** Las parejas válidas y los riesgos están en las reglas de abajo.
2. **Nada que no se haya dado**: cada ejercicio contra la columna `sesion` de sus destrezas en el inventario y la secuenciación
   (`secuenciación-unidad4.pdf`), y contra el acta (decimales, negativas, mixtos). Un ejercicio de una sesión posterior dentro
   de una práctica de esta semana es normal: lo que no puede pasar es que la tarea de la semana lo mande antes de tiempo.
3. **Realismo**: las cotas de cada contexto, leídas en el código, y diez enunciados de cada contexto leídos enteros; un script
   de 3000 ítems que cuente lo que se sale (también en los distractores).
4. **En el navegador**, a 375 px y en ancho, en español y en inglés: un ítem acertado y uno fallado de cada ejercicio, mirando
   que el feedback dice qué ha pasado con esos números y que las fracciones con raya se leen.
5. **Publicar**: `disponible: true` en `catalogo.js` de las que pasen (commit con rutas explícitas), y comprobar en la portada
   local que salen en el bloque de su semana (la U4 no es la unidad actual hasta el 14-12: pásale una fecha de prueba a
   `unidadActual` o mira `bloquesPublicados(CATALOGO, 4)`).
6. **Propuesta de la tarea de la semana 2** para Juan Luis, en `ENTREGA.md`: qué ejercicios con ★ (obligatorios) y cuáles a
   elegir, con la destreza de cada uno, que sumen 100 puntos (10 por ejercicio), solo con ejercicios cuyas destrezas ya se
   hayan dado el día de publicación de la tarea (lunes de la semana), y la lista de destrezas nucleares de la semana que no
   cubre ninguna práctica. **Ortografía (decisión de Juan Luis del 23-10 y 25-10; calendario en
   `apuntes-1eso-bilingue/comun/CALENDARIO-CURSO-2026-27.md`):** la propuesta lleva entre los ★ el ejercicio 6 («La coma del vocativo») de la práctica
   `ortografia` (id 45; vale 10 de los 100 puntos; el resto suma 90). **Él la monta en el panel** (editor de tareas); tú no la creas.
   La tarea 29 del reparto de la U4 la programa en Classroom cuando exista (lunes 8:00 → jueves 23:59).

## Datos de entrada

- El inventario de la unidad 4, solo lectura: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/4. Fractions/inventario-unidad4.tsv`; `4. Fractions/inventario-unidad4-revision.md` (qué entra).
- Carpeta de la unidad, solo lectura: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/4. Fractions/` (secuenciación, contenidos, hojas, exámenes que existan).
- `tareas/tarea-93-publicar-semana1.md` a `tarea-96-publicar-semana4.md` y sus ENTREGA: el molde (con sus trampas: el driver headless `salidas/89-errores3/capturas/cdp.mjs`, los tests de portada que suponen «sin publicar»).

## Cómo saber que ha terminado

- Cada práctica de la semana, o publicada (`disponible: true`, en el bloque de su semana) o con su reabierta en `hechos/reabiertas/` y el motivo concreto (ítem, distractor, por qué).
- `npm test` sin fallos.
- La propuesta de tarea, en la ENTREGA, y dicha a Juan Luis en tu último mensaje.

## Trampas conocidas

- Una reabierta tuya vuelve a ser cogible por una sesión MEDIO; quien la cierre no puede publicarla (no toca `catalogo.js`). La publica la tarea de publicación siguiente: díselo a Juan Luis si la semana corre prisa (la última semana no tiene siguiente: si reabres en la 111, la coordinadora da de alta una publicación más).
- Publicar puede romper tests de portada que suponen una unidad sin publicar (pasó en la 93): el arreglo es comprobar «sin publicar» sobre una copia del catálogo.
- La cota de realismo hay que medirla también en los **distractores**, no solo en la respuesta.
- El servidor del puerto 8080 puede ser de otra sesión: levanta uno propio en otro puerto (`python3 -m http.server 8093`). Chrome headless por CDP con el WebSocket de Node basta (driver en `salidas/89-errores3/capturas/cdp.mjs`).
- (s-20261028T175638-13228212, 28-10) **«Dentro de la cota» no es «≤ max»**: cuando la pregunta es el total (hallar el todo desde una parte), los
  distractores tienen que estar también por encima del **mínimo** del contexto y del propio dato; un filtro `x >= 2 && x <= max` deja pasar
  «una clase de 3 alumnos». Mídelo con un script que compare cada opción con `[min, max]` del escenario según qué se pregunta.
- Las cotas del acta del 26-10 (punto j) no son solo rangos: la **botella** tiene una lista de tamaños y la **hora** una lista de
  denominadores. Léelas en `inventario-unidad4-revision.md` (líneas 52-67), no en la ficha, que las resume.
- Los casos reservados para el examen están en `RESERVADOS_ANTERIORES` de `4. Fractions/hojas-de-ejercicios/comprobar-semana3.py`
  (los de las hojas 1 y 2 juntos): cuéntalos en 3000 ítems de cada generador.
- En zsh, `echo =====` falla («= not found»): es la expansión `=cmd`. Para separar salidas, `echo "-----"`.

## Prohibido (propio de esta tarea)

- Corregir el código de una práctica (más allá de una errata de texto de una línea): se reabre.
- Publicar prácticas de otra semana (salvo las que reabrió la publicación anterior, verificadas otra vez), o tocar en `catalogo.js` algo que no sea `disponible`.
- Crear la tarea de la semana en el panel o en `tareas.js`: la propuesta es para Juan Luis.

## Salida esperada

- El commit de `catalogo.js` (y, en la 111, de los docs) con rutas explícitas; las reabiertas que procedan.
- `reparto-practicas-u2/salidas/110-publicar-u4-semana2/ENTREGA.md` (qué se publicó, qué se reabrió y por qué, la propuesta de la tarea de la semana con sus ★ y puntos) y su marcador.

## Reglas de contenido de la unidad 4 (copia de `proyecto.md`; lo común no se lee, por eso va aquí)

Las reglas 2-4 y 8-9 de la lista de la unidad 2 (signos `·` y `:`, inglés, regla de oro, feedback, realismo) valen igual.
La fuente es `4. Fractions/reparto-unidad4/proyecto.md` («Reglas de contenido comunes») y el acta
`4. Fractions/inventario-unidad4-revision.md` (lo que Juan Luis decidió el 26-10: negativas desde la semana 1, potencias de
base positiva en la sesión 7, ni decimales ni mixtos, cotas de realismo, ids que cambiaron).

1. **Dos fracciones equivalentes son la misma respuesta.** En cualquier ejercicio de elegir, emparejar o verdadero/falso,
   ninguna opción puede equivaler a otra: el test lo comprueba por valor (`Fraction` de `_comun/fracciones.js`, nunca con
   decimales ni a ojo), y en los de «simplifica» la consigna pide la **fracción irreducible**. Un número mixto y su
   fracción impropia, lo mismo (si entran).
2. **Nada que no se haya dado**: cada ejercicio respeta la columna `sesion` de sus destrezas en el inventario. Ninguna suma
   o resta de fracciones antes de la sesión 5, ningún producto ni potencia antes de la 7 (jue 7-1), ningún cociente antes
   de la 9, ninguna combinada antes de la 10. **Acta del 26-10: ni decimales ni números mixtos; fracciones negativas desde
   la semana 1 (escritura y signo, simplificar, comparar, recta), en la 2 (sumar y restar, también resultado negativo) y
   en la 3 (producto, cociente, combinadas); potencias solo de base positiva (sesión 7).** Ni letras ni ecuaciones (el término que falta es un hueco `□`), ni porcentajes.
3. **Escritura**: la fracción en pantalla con raya horizontal (`htmlFraccion` de `_comun/fracciones.js`, tarea 98: `<span
   class="frac"><span>3</span><span>5</span></span>`), nunca `3/5` con barra salvo en una frase en inglés hablado («3 out
   of 5»). El alumno puede teclear `3/5`, `3 / 5` o un natural (`leerFraccion`). Producto con `·`, nunca `×`; división
   con `:` (en inglés también `÷`); «of» = multiplicar («3/5 of 40»).
4. **Regla de oro**: todo distractor, inequívocamente falso, y cada distractor sale de un **error típico** de la columna
   `nota` del inventario, calculado con los números del ítem y comprobado en el test (nunca un número al azar): sumar
   numeradores y denominadores (`1/2 + 1/3 = 2/5`); simplificar solo un término; multiplicar en cruz al sumar; «3/5 de
   40» dividiendo entre 3 y multiplicando por 5; comparar solo numeradores o solo denominadores; confundir la inversa con
   la opuesta; cambiar solo el denominador al reducir; invertir la primera fracción al dividir (o ninguna); contar marcas
   en vez de huecos en la recta. Los generadores de estos valores están en `_comun/fracciones.js` (`ERRORES_TIPICOS`):
   úsalos, y **cada función dice cuándo no sirve** (cuando el error da lo mismo que la respuesta). **Lo que no es un error**:
   dividir numerador entre numerador y denominador entre denominador cuando las dos divisiones son exactas (`6/8 : 2/4 =
   3/2`); comparar por denominadores cuando los numeradores son iguales.
5. **Parejas válidas, que nunca se enfrentan**: *three quarters* / *three fourths*; *a half* / *one half*; *a quarter* /
   *one fourth*; *simplify* / *reduce* / *cancel*; *lowest terms* / *simplest form*; `÷` / `:`; *times* / *multiplied by*;
   `3/5 · 40` / `3/5 of 40`; «3 out of 5» / «three fifths»; una fracción y cualquier equivalente suya.
6. **Inglés sencillo**; la palabra no matemática que decide la respuesta se aclara entre paréntesis (*shaded (sombreado)*,
   *left (que queda)*, *the rest (el resto)*), salvo que sea justo lo que se evalúa. Las fracciones se leen con ordinales
   (*three fifths*), salvo *a half* y *a quarter*.
7. **Realismo** (regla de Juan Luis del 16-10): la situación tiene que ser posible y **todos** los números que pueda sacar el
   generador, creíbles, con una cota por contexto que el test comprueba. Orientativas (la sesión fija las suyas y las
   escribe en su ENTREGA): una cantidad de la que se toma una fracción es múltiplo del denominador; las partes de un todo
   suman como mucho 1 y «lo que queda» no es negativo; una clase tiene 12-36 alumnos y cada fracción da un entero; un
   instituto, 200-3000; una pizza o una tarta tiene de 3 a 15 trozos; una hora se parte en medias, cuartos, tercios, sextos
   y doceavos; un depósito, de 1 a 500 litros (el de un coche, 20-90); una botella, hasta 3 L; una garrafa, hasta 50 L; un
   recorrido, hasta 50 km a pie o en bici y 1000 en coche; un ahorro, hasta 2000 € enteros (cotas aprobadas el 26-10, acta
   punto j). Cantera de contextos: los 41 problemas transcritos en la nota de la montadora de la U4 (apartado 4).
8. **Feedback ligado al error**, con los números del ítem («1/2 + 1/3: has sumado arriba y abajo; los sextos: 3/6 + 2/6 =
   5/6»), no una regla genérica. Frase sencilla antes que caso límite.
9. **Casos fijos** (frases, contextos, dibujos con números) que no copien los de las hojas, los exámenes semanales ni el
   examen final de la unidad 4 (en la carpeta de la unidad: `hojas-de-ejercicios/`, `exámenes-semanales/`,
   `examen-final/`): los alumnos los verán en papel.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 110, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-110.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/110--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/110--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/110-publicar-u4-semana2/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/110--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/110--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni
  `practicas/_comun/` (salvo la tarea 01; en la unidad 3, la 79 y las de publicación 93-96; en la unidad 4, la 98 y las de publicación 109-111; la 114 en una fila del catálogo; cada una en lo que declara), ni `css/estilos.css`, ni `README.md` (salvo
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
- Las reglas de contenido de la unidad 4 (en esta ficha y en `proyecto.md`): `×` en vez de `·`, letras,
  ecuaciones, porcentajes; decimales y números mixtos (fuera por el acta del 26-10); potencias de base negativa;
  fracciones negativas o potencias de base positiva en una sesión anterior a la suya (acta: negativas desde la semana 1,
  potencias en la sesión 7); algo de una sesión posterior a la de la destreza; distractores que
  puedan ser verdad, y en especial **dos opciones equivalentes** (`4/8` y `1/2`), que son dos respuestas correctas.
