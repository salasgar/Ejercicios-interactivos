# Tarea 156 · Revisión a mano (con clics) y publicación de las prácticas de la semana 1 de la unidad 6 (`traduce`, `valor-numerico`, `terminos-semejantes`, `leelo6`), con la propuesta de la tarea semanal 1

Actualizado: 2026-11-03 (alta de la montadora del reparto de la unidad 6, s-20261103T140356-12629e13)
Precondición: 145, 146, 147, 155 LISTAS · la hoja 1 y el examen 1 (tareas 06 y 12) LISTOS en el reparto de la U6 (para el cotejo de casos) · no en paralelo con nada que toque `catalogo.js` o `docs/practicas-unidad6.md` · Disparo: MANUAL (sesión atendida) · **Plazo: mié 27-1 (la U6 empieza el lun 1-2 y la tarea semanal 1 sale ese día; la portada no enseña la U6 hasta esa fecha: publicar antes no la pone delante de nadie; ideal antes de Navidad)**
Duración esperada: 1 h 15 min (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: 157
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/156-publicar-u6-semana1/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/catalogo.js` (solo `disponible` de las 4), `docs/practicas-unidad6.md` (apartados 1-6 y 8, que la 144 dejó «por escribir», y la línea «**Publicadas** (a …)»)

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
   printf 'sesión: %s\ntarea: 156\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/156--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/156--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 156 con `abierto:` más antiguo (o igual y sid menor), añade a tu
   reclamo una línea `CEDIDA a <sid del otro>` y elige otra tarea.
5. Si el reclamo que encuentras está caducado (RELEVABLE en el tablón), relévalo con la
   línea `releva a: <sid anterior>` **en tu propio reclamo**; el suyo no se toca. Después
   mira qué dejó hecho: `ls practicas/`, `git log --oneline -5`, `git status -sb`, y la
   carpeta de salida. Lo que haya con tests en verde se hereda y se dice en la terminada;
   lo que no, se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** (todas las filas contra `hechos/` y la
   hora real; banda y «encadenable» recopiadas de las fichas) antes de empezar, y sigue
   con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.
   Si hay otras sesiones en el árbol (`.claude/sesiones/`), retoque de tus filas y del registro, no regeneración completa.
7. Idempotencia: comprueba si `practicas/<tu slug>/` o tu test ya existen (de una sesión
   caída) antes de crearlos. Si existen, léelos y continúa desde ahí.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/156--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Lo que la 130/131 son para la U5: revisar **a mano, con clics**, las prácticas de la semana 1 (en español y en inglés,
a 375 px y en ventana ancha, un ítem acertado y uno fallado por ejercicio), **cotejar sus casos** contra la hoja 1 (en claro) y
el examen 1 (por huella FNV-1a de la forma canónica, calculada fuera del repo; recuentos en la ENTREGA, nunca los casos),
ponerlas `disponible: true`, escribir lo que falta de `docs/practicas-unidad6.md` y dejar al día la **propuesta de la tarea semanal
1** para el panel (plan A con todas; plan B si alguna se reabre), con el ★ de ortografía **ejercicio 10 («Signos ¿ ¡ y espacios»): `['ortografia', 10]`** y 100 puntos (sale el lun 1-2 8:00,
entrega **jue 4-2 23:59**). Si una práctica no pasa, **reabierta** (`hechos/reabiertas/NNN--<sid>-revision.md`, con lo exacto) y no se publica.

## Siguiente paso

Lee las fichas 130 y 131 y sus ENTREGA (`salidas/130-…`, `salidas/131-…` si cerraron), la ENTREGA de la 144 y las de las prácticas de esta semana; `docs/practicas-unidad4.md` (el modelo del documento). Comprueba en `reparto-unidad6/hechos/terminadas/` que la hoja 1 y el examen 1 (las tareas 06 y 12) de la U6 cerraron.

## Qué hay que hacer

1. Por cada práctica: `node --test tests/practicas-<slug>.test.js`; navegador con clics (`npm run servir`, «Probar sin código»); realismo de los contextos; notación del acta; ninguna opción equivalente a otra; inglés sin ambigüedad; nada de porcentajes ni de lo que el acta deje fuera.
2. Cotejo de casos: los de la hoja 1 (`hoja-unidad6-semana1.tex` y sus soluciones) en claro contra las ecuaciones y expresiones generadas, **por forma canónica** (barrido de 20 000 ítems por ejercicio con semilla fija); los del examen 1 (`casos-examen-semana1.tsv`) por huella FNV-1a de la forma canónica calculada en el scratchpad (modelo: las reabiertas de la U4 y `practicas/equivalentes/logica.js`): 0 coincidencias, con los recuentos en la ENTREGA.
3. `catalogo.js`: `disponible: true` de las 4. `docs/practicas-unidad6.md`: apartados 1-6 y 8 como los de la U4, y la línea «**Publicadas** (a <fecha>): …».
4. Propuesta de la tarea semanal 1 en la ENTREGA (título «U6 · Semana 1 …», ★ obligatorios de cada práctica, `ejercicio 10 («Signos ¿ ¡ y espacios»): `['ortografia', 10]``, 100 puntos; entrega jue 4-2 23:59): la monta Juan Luis en el panel (tarea 160) y la programa en Classroom la tarea 34 del reparto de la U6.

## Datos de entrada

- Las ENTREGA de las prácticas de la semana (145, 146, 147, 155) y `salidas/144-base-unidad6/ENTREGA.md`; `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/6. Algebra/hojas-de-ejercicios/`, `exámenes-semanales/semana-1/` (solo lectura; los casos de examen nunca en claro en el repo); `docs/practicas-unidad4.md` (modelo).

## Cómo saber que ha terminado

Las 4 prácticas con `disponible: true` (o reabiertas, con su fichero), `npm test` en verde, el cotejo con 0 coincidencias documentado por recuentos, `docs/practicas-unidad6.md` al día, y la propuesta de la tarea 1 en la ENTREGA.

## Trampas conocidas

- (U4, 117/118) Publicar sin cotejar contra las hojas y los exámenes escritos después obligó a reabrir las siete prácticas de la U4 y a una segunda publicación (119/120): aquí la precondición exige la hoja y el examen cerrados.
- `catalogo.js` lo tocan varias tareas de publicación (130, 131, 140-142, y las 156-159 entre sí): nunca a la vez; mira `.claude/sesiones/` y `git log -3 -- practicas/_comun/catalogo.js`.
- La portada oculta la U6 hasta el 1-2 (`UNIDADES.desde`): para verla, fecha de prueba en `unidadActual`.
- Con álgebra, «el mismo caso» es la misma forma canónica (coeficientes como fracciones irreducibles) o la misma ecuación equivalente: la huella se calcula sobre eso, no sobre el texto.

## Prohibido (propio de esta tarea)

- Corregir tú una práctica ajena: reabierta con lo exacto.
- Escribir un caso de examen en claro (en la ENTREGA, en un test, en un comentario).

## Salida esperada

- `catalogo.js` y `docs/practicas-unidad6.md` comiteados; las reabiertas que hagan falta en `hechos/reabiertas/`.
- `reparto-practicas-u2/salidas/156-publicar-u6-semana1/ENTREGA.md` (qué se publicó, recuentos del cotejo, hallazgos, la propuesta de la tarea semanal 1) y su marcador.

## Reglas de contenido de la unidad 6 (copia de `proyecto.md` de su reparto; lo común no se lee, por eso va aquí)

Las reglas 2-4 y 8-9 de la lista de la unidad 2 (signos `·` y `:`, inglés, regla de oro, feedback, realismo) valen igual.
La fuente es `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/6. Algebra/reparto-unidad6/proyecto.md` («Reglas de contenido comunes») y, cuando exista, el acta
`/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/6. Algebra/inventario-unidad6-revision.md` (lo que Juan Luis decida en la tarea 02 de aquel reparto: las letras, las sucesiones,
las potencias de letras, el método —balanza o transposición—, los casos sin solución, hasta dónde los paréntesis y los
denominadores, los problemas, la notación, las cotas de realismo, los ids). **Hasta el acta, nada de eso entra.**

1. **Dos expresiones equivalentes son la misma respuesta, y dos ecuaciones con la misma solución también.** `2x + 3` y `3 + 2x`;
   `x/2`, `½x` y `0,5x`; `3 · x` y `3x`; `x + x` y `2x`; `2(x + 1)` y `2x + 2`; `x + 3 = 10` y `2x + 6 = 20`; y una solución `3/2`,
   `1,5` o `6/4`. En cualquier ejercicio de elegir, emparejar o verdadero/falso, ninguna opción puede equivaler a otra: el test lo
   comprueba **por forma canónica** (`a·x + b` con las fracciones exactas de `_comun/algebra.js`, nunca `Number` en coma flotante)
   y **por solución**. Solo si el ejercicio evalúa la forma escrita («¿cuál está reducida?», «la fracción irreducible») cuenta la
   escritura, y el enunciado lo dice. Lo que teclea el alumno se lee con `deTexto` y se compara por forma canónica: `3 + 2x` vale
   como `2x + 3`, y `6/4` vale como `3/2` salvo que la consigna pida la irreducible.
2. **Nada que no se haya dado**: cada ejercicio respeta la columna `sesion` de sus destrezas en el inventario (semana 1: traducir,
   la letra, valor numérico, términos semejantes; semana 2: ecuación y solución, transposición, una y dos operaciones, `12x = 3`,
   negativas; semana 3: `x` en los dos miembros, paréntesis, denominadores; semana 4: problemas). **Ni porcentajes ni
   proporcionalidad** (U7), ni geometría con fórmula (U8), ni segundo grado, sistemas, inecuaciones ni dos incógnitas (2.º ESO);
   `x²`, las sucesiones, los casos `ax = b` con `a` o `b` nulos, los denominadores con paréntesis y `x` en el denominador solo si el
   acta los admite y en la sesión que diga. Se saben la jerarquía (U1), el m.c.m. (U2), los enteros (U3), las fracciones (U4) y los
   decimales (U5).
3. **Notación**: coeficiente delante y pegado (`3x`, `−2x`), `x` por `1x`, `·` solo entre números, la división con letras como
   fracción (`htmlFraccion` de `fracciones.js` con `x` en el numerador; en texto, `x/2`), `3(x − 2)` sin punto; en inglés `2x` se lee
   *two x* (o *twice x*), `x/2` *x over two* o *half of x*; *solve for x*, *both sides*, *like terms*, *expand the brackets*. El
   alumno puede teclear `2x+3`, `3+2x`, `2·x + 3`, `2*x+3` o `x/2`: `deTexto` los acepta todos; nunca `eval`.
4. **Regla de oro**: todo distractor, inequívocamente falso, y cada distractor sale de un **error típico** de la columna `nota`
   del inventario, calculado con los números del ítem y comprobado en el test (nunca un número al azar): sumar términos no
   semejantes (`3x + 2 = 5x`); `x · x = 2x`; yuxtaponer al sustituir (`3x` con `x = 4` → 34); transponer sin cambiar el signo
   (`x + 3 = 10 → x = 13`); pasar un factor restando (`3x = 12 → x = 9`); multiplicar en vez de dividir; invertir `12x = 3 → x = 4`;
   distribuir solo al primer término (`3(x − 2) = 3x − 2`); el signo menos delante del paréntesis (`−(x − 2) = −x − 2`); multiplicar
   por el m.c.m. solo los términos con denominador; contestar `x` cuando el problema pide otra cosa; traducir «tres menos que un
   número» como `3 − x`. Los generadores de estos valores están en `_comun/algebra.js` (`ERRORES_TIPICOS`): úsalos, y **cada
   función dice cuándo no sirve** (devuelve `null` cuando el error da lo mismo que la respuesta). **Lo que no es un error**: `x · 3`
   por `3x`, `1x` por `x`, una solución sin simplificar cuando no se pide la irreducible.
5. **Parejas válidas, que nunca se enfrentan**: *brackets* / *parentheses*; *solve* / *work out*; *twice* / *double*; *like terms* /
   *similar terms*; *both sides* / *each side*; `x : 2` / `x/2` (si el acta admite las dos); una fracción irreducible y su decimal
   exacto; una expresión y cualquier reordenación suya; dos ecuaciones equivalentes.
6. **Inglés sencillo**; la palabra no matemática que decide la respuesta se aclara entre paréntesis (*twice* (el doble), *three less
   than* (tres menos que), *consecutive* (seguidos), *altogether* (en total), *each* (cada uno), *in three years' time* (dentro de tres
   años)), salvo que sea justo lo que se evalúa. **El enunciado en inglés no puede ser ambiguo**: *twice a number, plus five*
   (`2x + 5`) frente a *twice the sum of a number and five* (`2(x + 5)`).
7. **Realismo** (regla de Juan Luis del 16-10): la situación tiene que ser posible y **todos** los números que pueda sacar el
   generador, creíbles, con una cota por contexto que el test comprueba. Orientativas hasta el acta (la sesión fija las suyas y
   las escribe en su ENTREGA): edades de 1 a 100 (un alumno 6-18, un padre o una madre 25-60, un abuelo 55-95; la diferencia
   padre-hijo entre 18 y 50; «dentro de n años» y «hace n años» con n de 1 a 20 y nadie con edad negativa); dinero (la paga 1-50 €;
   precios como en la U5; ahorros hasta 2000 €; con dos decimales si no es entero; un reparto que salga exacto); cantidades de
   cosas (caramelos, canicas, cromos: 1-200; una clase 12-36 personas; un equipo 5-25); números («pienso un número», consecutivos:
   enteros de −50 a 200); perímetros con palabras (lados de 1 a 50; nunca con fórmula ni áreas). **La solución de un problema es un
   natural (o dinero con dos decimales)**: nunca una edad fraccionaria ni un número negativo de personas. Los personajes llevan
   nombres inventados (no de alumnos reales).
8. **Feedback ligado al error**, con los números del ítem («`x + 3 = 10`: al pasar el 3 al otro lado cambia de signo: `x = 10 − 3 =
   7`»), no una regla genérica. Frase sencilla antes que caso límite.
9. **Casos fijos** (frases, contextos, números) que no copien los de las hojas, los exámenes semanales ni el examen final de la
   unidad 6 (en `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/6. Algebra/hojas-de-ejercicios/`, `exámenes-semanales/`, `examen-final/`): los alumnos los verán en papel. **Los casos de
   las hojas se excluyen en claro; los de los exámenes, por huella FNV-1a calculada fuera del repositorio, nunca en claro** (regla de
   PU2 del 30-10; modelo: `practicas/equivalentes/logica.js` y `tests/practicas-equivalentes.test.js` tras el commit b0e4cfd, y la
   reabierta `hechos/reabiertas/100--s-20261030T081542-dab2aa98-revision.md`). Con álgebra, la huella se calcula sobre la **forma
   canónica** de la ecuación o la expresión (coeficientes como fracciones irreducibles, en un orden fijo), no sobre el texto. Si al
   reclamar la hoja o el examen de tu semana no existen aún, dilo en la ENTREGA: la tarea de publicación de tu semana coteja y
   reabre si hace falta.
10. **Aritmética exacta**: los coeficientes y las soluciones son `Fraccion` de `_comun/fracciones.js` (o enteros); nunca se compara
    ni se muestra con `Number` en coma flotante; nunca `eval` sobre lo que teclea el alumno. Los tests lo comprueban contra
    `BigInt` o aritmética entera propia.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 156, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-156.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/156--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/156--<sid>.md` con `parada por: mal cortada`
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
   `git add <rutas> && git commit -m "<qué>" -- <rutas>`. Apunta el hash
   (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/156-publicar-u6-semana1/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cotas de realismo, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/156--<sid>.md`: hash del commit, ficheros (lo que dice
   `git show --stat`, no lo que crees), número de tests propios en verde, hora y
   **duración real** (de `abierto:` a ahora), y propuestas pendientes si las hay.
5. Añade `CERRADA` a tu reclamo (línea propia que empieza por esa palabra).
6. Choques encontrados → `$R/hechos/incidencias/<sid>.md`.
7. `git fetch origin`, relista `$R/hechos/` **ahora** y regenera `$R/_ESTADO.md` (entero si
   no hay otras sesiones en el árbol; si las hay, retoque de tus filas y del registro):
   banda y «encadenable» recopiadas de las fichas, leyenda de bandas de `proyecto.md`. Anota qué
   tareas pasan de BLOQUEADA a PENDIENTE. Si tu duración real difiere mucho de la estimada,
   díselo al usuario.
8. Vuelca abajo, en «Trampas conocidas» de esta ficha, lo que hayas aprendido por las
   malas (es lo único de la ficha que editas, además de la duración).
9. Un solo commit con rutas explícitas de tus ficheros de `$R/hechos/` (por sid), tu
   carpeta de `$R/salidas/`, `$R/_ESTADO.md` y esta ficha, y `git push origin main`. Si el
   push se rechaza: `git pull --rebase origin main`, regenera el tablón otra vez desde
   `hechos/` (no lo fusiones a mano) y vuelve a comitear y empujar. **Nunca si `main` lleva
   commits ajenos sin empujar**: incidencia y díselo al usuario.
10. Dile al usuario la **foto del momento** en tres líneas («EN CURSO: … · LIBRES ahora: … ·
    BLOQUEADAS: …»), sacada de la lectura de `hechos/` del paso 7, y después, **solo para las
    LIBRES**, las frases de arranque de `proyecto.md` literales, en bloques de cita, una por
    sesión que quepa a la vez, con la tarea o la cadena, la banda traducida y el nombre de
    sesión delante.
11. Decide si encadenas (solo en verde: misma banda, tarea corta, sin esperas; si tu frase
    de arranque nombra la cadena, encadenas por defecto) o paras. Si encadenas, «Antes de
    empezar» entero otra vez, con reclamo nuevo, y di el nombre nuevo que te toca.

Si paras sin terminar: `$R/hechos/fallos/156--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni
  `practicas/_comun/` (salvo la tarea 01; en cada unidad, su base y sus tareas de publicación; cada una en lo que declara), ni `css/estilos.css`, ni `README.md` (salvo
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
  CDN; las prácticas no usan ni siquiera KaTeX (exponentes con `<sup>`; las fracciones con
  `htmlFraccion`).
- Las reglas de contenido de la unidad 6 (en esta ficha y en `proyecto.md` de su reparto): `×` en vez de `·`, porcentajes,
  proporcionalidad, segundo grado, sistemas, dos incógnitas; `eval` o coma flotante; lo que el acta deje fuera (`x²`, sucesiones,
  casos sin solución, `x` en el denominador) o algo de una sesión posterior a la de la destreza; distractores que puedan ser
  verdad, y en especial **dos opciones equivalentes** (`2x + 3` y `3 + 2x`; dos ecuaciones con la misma solución), que son dos
  respuestas correctas; casos de examen en claro en el repositorio.
