# Tarea 114 · «Las fichas de Pablo» pasa a llamarse «Las fichas del parchís» / «Ludo counters», y su ejercicio 6 se reforma: la tabla de divisores con fichas que se encienden

Actualizado: 2026-10-26
Precondición: ninguna (la 97 está LISTA) · no en paralelo con la 98 ni con otra tarea que toque `catalogo.js` (comparten una fila: espera a que cierre o coordina) · Disparo: MANUAL (sesión atendida)
Duración esperada: 2 h (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/114-fichas-parchis-ej6/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/fichas-de-pablo/*` (el slug `fichas-de-pablo` **no cambia**: va en las URL, en el progreso guardado y en las tareas; solo cambia el nombre visible), `tests/practicas-fichas-de-pablo.test.js`, `practicas/_comun/catalogo.js` (solo el `nombre` de la fila 46), `practicas/portada.js` (el título del bloque «Refuerzo: las fichas de Pablo» y la `DESCRIPCION` de `fichas-de-pablo`), `docs/practicas-unidad2.md` (las menciones al nombre y el §6 del ejercicio 6)

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
   printf 'sesión: %s\ntarea: 114\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/114--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/114--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 114 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/114--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.



## Objetivo

Dos encargos de Juan Luis del 25-10 por la noche, sobre la práctica de refuerzo de la unidad 2 (tarea 97, id 46):

**1. El nombre.** La actividad pasa a llamarse **«Las fichas del parchís» / «Ludo counters»** (parchís en inglés británico es
*Ludo*; *Parcheesi* es la marca americana). Cambia el nombre visible en el catálogo, la portada, la cabecera de la práctica y
los textos; **Pablo sigue siendo el niño que juega** en los enunciados («Pablo divide…») salvo que Juan Luis diga lo contrario
(pregúntaselo al cerrar y dilo en la ENTREGA). El slug, el id y la carpeta no cambian.

**2. El ejercicio 6, «Los divisores son elecciones», se rehace entero** con la dinámica de su boceto (foto del 25-10):

> Halla los divisores de 847 seleccionando las fichas adecuadamente: 847 = 7 · 11²

- Se da un número **factorizado**, con pocos divisores (**de 4 a 12**; depende de cuántas casillas quepan: con 12 divisores
  son 6 filas de 2 casillas a 375 px, o 4 de 3 en ancho).
- Debajo, una **tabla con tantas casillas como divisores** tiene el número. En cada casilla están **todas las fichas primas del
  número, con su multiplicidad** (para 847: una del 7 y dos del 11), todas **apagadas**; a la derecha de cada casilla, el
  **producto de las fichas encendidas**, que empieza en **1** (ninguna encendida).
- El alumno enciende fichas tocándolas: con el 7 y un 11 encendidos, al lado aparece 77; con los dos 11, 121; con las tres, 847;
  con ninguna, 1. El producto se actualiza al instante.
- Objetivo: que las casillas muestren **todos los divisores, cada uno una vez**, en cualquier orden. Al pulsar «Comprobar»: los
  divisores que faltan y los repetidos se marcan (sin decir cuáles faltan: solo cuántos); cada comprobación con fallos es un
  fallo (`api.responder` con `error`: `faltan-divisores`, `divisor-repetido`); el ítem termina cuando están todos. Que el
  número de casillas sea el número de divisores es una ayuda a propósito (enseña la fórmula del número de divisores).
- Destrezas: las mismas del ejercicio 6 actual (U2-3C-01, 3C-02: los divisores como elecciones de fichas, el número de
  divisores) y U2-3C-… (hallar todos los divisores a partir de la factorización): léelas en el inventario de la U2.
- Lo que había en el ejercicio 6 (contar elecciones / elegir / «ninguna ficha») desaparece de la práctica; si algún texto de
  la introducción («un divisor es una elección de fichas») sirve, se conserva como introducción del nuevo.

## Siguiente paso

1. Lee `tareas/tarea-97-fichas-de-pablo.md`, `salidas/97-fichas-de-pablo/ENTREGA.md` (los ocho ejercicios y los errores con nombre) y `practicas/fichas-de-pablo/` entero (`logica.js`: `generarDivisores`, `diagnosticarContar`, `diagnosticarNinguna`, `diagnosticarElige`; `dibujo.js`: cómo se pinta una ficha y su leyenda de colores; `textos.js`, sección 6).
2. Mira `.claude/sesiones/` y `git log -3 -- practicas/fichas-de-pablo/`: el 25-10 por la noche otra sesión tenía reservados `logica.js`, `practica.js` y `textos.js` de esta práctica (commit 5119367): si siguen reservados, espera.

## Qué hay que hacer

1. **Nombre**: `catalogo.js` fila 46, `nombre: { es: 'Las fichas del parchís', en: 'Ludo counters' }`; `portada.js` (bloque y
   descripción); `textos.js` (cabecera, introducciones); `docs/practicas-unidad2.md`. `grep -rn "fichas de Pablo\|Pablo's counters"
   practicas/ docs/ README.md` para no dejar ninguno. Las frases con Pablo como personaje se quedan.
2. **Ejercicio 6 nuevo** en `logica.js`: `generarTablaDivisores(rng)` → un número con 4-12 divisores (factorizaciones con 1-3
   primos de `PRIMOS_BASICOS`, exponentes 1-3, producto ≤ 1000; incluir siempre casos con 11 y 13 como en el resto de la
   práctica), sus fichas con multiplicidad, su lista de divisores; estado = por casilla, qué fichas están encendidas;
   `productoCasilla(fichas, encendidas)`; `diagnosticarTabla(item, estado)` → `{ faltan: n, repetidos: [...], ok }`.
3. `practica.js`: la tabla (filas de 2 casillas a 375 px; de 3 en ancho), las fichas con `dibujo.js` (apagadas en gris o con
   opacidad; encendidas a su color), el producto a la derecha en grande (1 al principio), «Comprobar» que marca faltan /
   repetidos y se vuelve a poder pulsar; el ítem acaba al estar todos. Sin «Pablo se atasca».
4. `textos.js`: consigna en los dos idiomas («Find all the divisors of 847 by switching on (encendiendo) the right counters»),
   feedback con los números («847 tiene 6 divisores: tienes 4 distintos y uno repetido»), introducción con el ejemplo de 28.
5. Test: 3000 ítems: número de divisores entre 4 y 12 y producto ≤ 1000; `productoCasilla` coincide con el producto de las
   fichas; `diagnosticarTabla` detecta faltan y repetidos; un estado con todos los divisores da `ok`; ningún texto con `×`.
6. `npm test`; prueba en el navegador (375 px y ancho, ES y EN); `nEjercicios` sigue siendo 8 (no cambia el catálogo).

## Datos de entrada

- `practicas/fichas-de-pablo/*`, `salidas/97-fichas-de-pablo/ENTREGA.md`, el inventario de la U2 (`2. Divisibility/inventario-unidad2.tsv`, solo lectura), la hoja de refuerzo «Pablo's counters» (`2. Divisibility/hojas-de-ejercicios/`, para que el ejercicio nuevo no contradiga el papel).

## Cómo saber que ha terminado

- `npm test` sin fallos; en el navegador, el ejercicio 6 funciona con 847 = 7 · 11² tal como describe el boceto (1 → 77 → 121 → 847) y con un número de 12 divisores a 375 px; ningún «Pablo's counters» ni «fichas de Pablo» queda como nombre de la práctica.

## Trampas conocidas

- El progreso guardado es por posición de ejercicio: el 6 sigue siendo el 6 y `nEjercicios` no cambia, así que no hace falta `quitados`.
- `catalogo.js` lo tocan a la vez la 98 (diez filas nuevas) y las publicaciones de la U3: una sola línea, pero si el hook lo tiene reservado, espera y no lo edites desde el shell.
- La hoja de refuerzo en papel sigue llamándose «Pablo's counters» (decisión pendiente de Juan Luis sobre si se imprime): no la toques desde aquí.

## Prohibido (propio de esta tarea)

- Cambiar el slug, el id, la carpeta o el número de ejercicios.
- Tocar los ejercicios 1-5, 7 y 8 salvo por el nombre.
- Quitar a Pablo de los enunciados sin que Juan Luis lo diga.

## Salida esperada

- Los ficheros de «Ficheros que toca» comiteados; `reparto-practicas-u2/salidas/114-fichas-parchis-ej6/ENTREGA.md` (hash, qué cambió, la pregunta de Pablo como personaje, cómo probarlo en 1 minuto) y su marcador.

## Reglas de contenido de la unidad 4 (copia de `proyecto.md`; lo común no se lee, por eso va aquí)

Las reglas 2-4 y 8-9 de la lista de la unidad 2 (signos `·` y `:`, inglés, regla de oro, feedback, realismo) valen igual.
La fuente es `4. Fractions/reparto-unidad4/proyecto.md` («Reglas de contenido comunes») y, en cuanto exista, el acta
`4. Fractions/inventario-unidad4-revision.md` (lo que Juan Luis decidió: decimales, negativas, mixtos).

1. **Dos fracciones equivalentes son la misma respuesta.** En cualquier ejercicio de elegir, emparejar o verdadero/falso,
   ninguna opción puede equivaler a otra: el test lo comprueba por valor (`Fraction` de `_comun/fracciones.js`, nunca con
   decimales ni a ojo), y en los de «simplifica» la consigna pide la **fracción irreducible**. Un número mixto y su
   fracción impropia, lo mismo (si entran).
2. **Nada que no se haya dado**: cada ejercicio respeta la columna `sesion` de sus destrezas en el inventario. Ninguna suma
   o resta de fracciones antes de la sesión 5, ningún producto o cociente antes de la 9, ninguna combinada antes de la 10.
   **Mientras el acta no diga otra cosa: ni decimales, ni fracciones negativas, ni números mixtos, ni potencias de
   fracciones.** Ni letras ni ecuaciones (el término que falta es un hueco `□`), ni porcentajes.
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
   suman como mucho 1 y «lo que queda» no es negativo; una clase tiene 20-30 alumnos y cada fracción da un entero; una
   pizza o una tarta tiene de 4 a 12 trozos; una hora se parte en medias, cuartos, tercios, sextos y doceavos; un depósito,
   de 1 a 500 litros; un recorrido, hasta 50 km; un ahorro, hasta 300 €. Cantera de contextos: los 41 problemas transcritos
   en la nota de la montadora de la U4 (apartado 4).
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
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 114, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-114.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/114--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/114--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/114-fichas-parchis-ej6/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/114--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/114--<sid>.md` con hasta dónde llegaste, la línea
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
  ecuaciones, porcentajes; decimales, fracciones negativas, números mixtos o potencias de fracciones mientras el
  acta del inventario no diga que entran; algo de una sesión posterior a la de la destreza; distractores que
  puedan ser verdad, y en especial **dos opciones equivalentes** (`4/8` y `1/2`), que son dos respuestas correctas.
