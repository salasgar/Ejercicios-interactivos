# Tarea 100 · Práctica de la unidad 4 «Fracciones equivalentes» (equivalentes)

Actualizado: 2026-10-26
Precondición: 98 LISTA · Disparo: MANUAL (sesión atendida)
Duración esperada: 1 h 15 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: 99 (misma banda, cortas, independientes)
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/100-equivalentes/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/equivalentes/*` (sustituye el esqueleto que deja la 98: desde que la 98 está LISTA, la dueña de esa carpeta es esta tarea), `tests/practicas-equivalentes.test.js` (nuevo)

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
   printf 'sesión: %s\ntarea: 100\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/100--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/100--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 100 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/100--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.



## Objetivo

Práctica **«Fracciones equivalentes» / «Equivalent fractions»** (`equivalentes`, id 48 del catálogo, 4 ejercicios) para la
**unidad 4, Fractions**, que empieza el lunes 14-12. Semana 1 (sesión 2). Tiene que estar LISTA antes del plazo de la
tarea de publicación de su semana (semana 1: **jue 10-12**; semana 2: **jue 17-12**; semana 3: **mar 22-12**, límite jue 7-1).

Destrezas (descripción; los ids definitivos, en el inventario tras F0 y en la ENTREGA de la 98): obtener equivalentes multiplicando o dividiendo arriba y abajo; el término que falta (□); decidir si dos fracciones son equivalentes (productos cruzados o simplificando); reducir a común denominador con el m.c.m.. El texto exacto
de cada una, su sesión y su nota (errores típicos y riesgos) están en el inventario: léelas antes de escribir nada.

**Es un diseño propuesto por la montadora (26-10) y aprobado en bloque por Juan Luis al pedir el alta; él puede cambiarlo.**
Si al hacerla ves que un ejercicio no se sostiene (dos respuestas correctas inevitables, algo de una sesión posterior, algo
que el acta del inventario dejó fuera), no lo cambies por tu cuenta: entrégalo como propuesta en la terminada y sigue con lo
demás. El número de ejercicios (4) está fijado en el catálogo por la 98; otro número también es propuesta.

Modelo de interfaz: `practicas/factorizaciones/` (unidad 2: operar paso a paso) y el juego de equipos de «Fracciones equivalentes.xlsx» de su material (emparejar las de un mismo equipo).

## Siguiente paso

1. Lee la ficha de la tarea 01 (§3, el contrato de `arrancar(practica)` y la `api` de `montar`), la `ENTREGA.md` de la 98 (`reparto-practicas-u2/salidas/98-base-unidad4/`) y los módulos que dejó: `practicas/_comun/fracciones.js` (`Fraccion`, `simplificar`, `equivalentes`, `comparar`, `sumar`, `restar`, `multiplicar`, `dividir`, `htmlFraccion`, `leerFraccion`, `enPalabras`, `ERRORES_TIPICOS`) y `practicas/_comun/dibujo-fracciones.js` (barras, círculos, cuadrículas, recta 0-1 y 0-n). **No los reescribas**: si te falta algo, cópialo en tu `logica.js` y proponlo en la terminada.
2. Lee `practicas/plantilla/` entero y la práctica modelo que cita el Objetivo; `practicas/_comun/piezas.js` (`elecciones`, `claseCorreccion`: los cuatro estados tras comprobar) y cómo ocultan «Comprobar» al responder las prácticas de la unidad 3.
3. `ls practicas/<tu slug>/`: la 98 dejó un esqueleto que carga y declara tus ejercicios. Sustitúyelo empezando por `logica.js` y su test, en verde; después `practica.js` (`montar`) y `textos.js`.

## Qué hay que hacer

1. **El término que falta** · *The missing number*. `3/5 = □/20` o `12/18 = 2/□` (ampliar o reducir, mitad y mitad); el
   alumno escribe el número. Feedback con el factor: «×4 arriba y abajo».
2. **¿Son equivalentes?** · *Are they equivalent?* Dos fracciones, Sí/No; la mitad equivalentes (una es la otra ampliada por
   2-6) y la mitad no (distractores de verdad: sumar el mismo número arriba y abajo, `2/3` y `3/4`; cambiar solo un
   término). Tras responder, la comprobación por productos cruzados con los números.
3. **Equipos** · *Teams*. Ocho fracciones en tarjetas que se arrastran a dos o tres cajas (una por valor); todas las de una
   caja son equivalentes entre sí y ninguna caja comparte valor con otra. Feedback por tarjeta mal puesta.
4. **Común denominador** · *Common denominator*. Dos fracciones con denominadores de 2 a 12 (no uno múltiplo del otro en al
   menos la mitad de los ítems); el alumno escribe el m.c.m. y después las dos equivalentes (dos pasos). Error típico:
   cambiar solo el denominador; usar el producto en vez del m.c.m. (vale, pero el feedback dice que hay uno menor y la
   consigna pide «the smallest»).

**Para todos los ejercicios**: introducción con un ejemplo resuelto en los dos idiomas; el ítem en el idioma que le toque (la
base alterna); «Comprobar» que se oculta al responder; los cuatro estados tras comprobar donde haya opciones; feedback con
los números del ítem; cada fallo pasado a `api.responder` con su `error` (el nombre del error típico) y la `respuesta` del
alumno, para el registro de fallos.

**Test** `tests/practicas-equivalentes.test.js` (por fuerza bruta, 3000 ítems por ejercicio con semillas fijas):
- Ej. 1: el factor es entero de 2 a 6 y el resultado tiene denominador ≤ 60.
- Ej. 2: reparto 50/50; en los «No», los productos cruzados son distintos de verdad.
- Ej. 3: ninguna fracción de una caja equivale a una de otra caja; sin repetidas.
- Ej. 4: el m.c.m. pedido es el de los dos denominadores y las equivalentes son correctas (`equals`).
- Ningún texto de alumno con `×`, con `/` como fracción fuera de las frases en inglés, con letras de variable, con decimales
  ni con fracciones negativas (esta práctica no las lleva) ni mixtas (recorre los textos generados en los dos idiomas).
- Todo distractor distinto de la respuesta correcta **por valor** y sacado de un error típico con nombre; ningún par de
  opciones equivalente.

## Datos de entrada

- El inventario de la unidad 4, solo lectura: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/4. Fractions/inventario-unidad4.tsv` (ids definitivos tras la firma F0 de su reparto; la ENTREGA de la 98 dice cuáles son los tuyos).
- Carpeta de la unidad (solo lectura): `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/4. Fractions/` — `secuenciación-unidad4.pdf` (qué se da en cada sesión), `inventario-unidad4-revision.md` (qué entra), `Repaso de todo/contenidos-unidad4.tex` (errores típicos) y las hojas `hojas-de-ejercicios/` que existan (para no repetir sus casos).
- Material de otros cursos, por si sirve (no es obligatorio): la nota `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/4. Fractions/reparto-unidad4/hechos/notas/s-20261025T214721-c42a0135-inventario-material-otros-cursos.md` (concursos en Excel, 41 problemas, exámenes).
- `practicas/_comun/*` y `practicas/plantilla/*`: solo lectura.

## Cómo saber que ha terminado

- `node --test tests/practicas-comun.test.js tests/practicas-equivalentes.test.js` en verde y `npm test` sin fallos en tus ficheros.
- En local (`npm run servir`), http://localhost:8080/practicas/equivalentes/ con el código de prueba 60 (`7NPD`; nunca el de un alumno ni AJJN), a 375 px y en ventana ancha, en español y en inglés; en cada ejercicio, un ítem acertado y uno fallado, mirando el feedback. La práctica **no sale en la portada** (está con `disponible: false` hasta su tarea de publicación): se entra por la URL.

## Trampas conocidas

- `.cuenta` no se parte (`nowrap`): solo cuentas cortas; las frases del feedback van como texto normal o se salen de 375 px.
- Una fracción con raya ocupa dos líneas de alto: en una lista de opciones a 375 px caben cuatro, no seis; en una cuenta en línea, usa el tamaño compacto de `htmlFraccion`.
- `t(null)` no usa el valor por defecto: la barra va en el idioma del ítem (T60, `idiomaBarra()`).
- Puede haber hasta diez sesiones a la vez en este árbol (las prácticas 99-108 van en paralelo): no metas en tu commit nada que no sea tuyo, y nada de `git stash`.
- El test compara fracciones **por valor** (`Fraccion.equals`): dos opciones con el mismo valor y distinta escritura son un fallo del test, no un caso raro.
- (s-20261027T082738-14ce7cde) Entre dos fracciones mostradas no pongas «·»: se lee como producto. Se usa «y»/«and» (ej. 2) o «;» (ej. 4). El campo de un hueco dentro de `htmlRaya` se crea con `campoNumero` sobre un `<span data-hueco>`; el enunciado traducido lo lleva vacío.
- Las equipos (ej. 3) usan el mismo arrastre por `pointer` que `venn` (toque = elegir tarjeta y tocar caja). Para probarlo por script: `pointerdown` + `pointerup` sin mover sobre la tarjeta y `click` en la caja.
- Duración real ≈ 25 min de reloj (estimada 1 h 15 min).

## Prohibido (propio de esta tarea)

- Tocar otras prácticas, la base (`practicas/_comun/`), `catalogo.js`, `portada.js`, `registro.js`, `tareas.js` o los docs: lo que haga falta ahí es propuesta en la terminada. `disponible: true` lo pone la tarea de publicación de su semana, no esta.
- Meter la práctica en una tarea semanal.

## Salida esperada

- `practicas/equivalentes/*` y `tests/practicas-equivalentes.test.js` comiteados, con `npm test` sin fallos en tus ficheros.
- `reparto-practicas-u2/salidas/100-equivalentes/ENTREGA.md` (hash, ficheros, los ejercicios y sus destrezas con id, las cotas de realismo que has fijado, cómo probarlo en 1 minuto) y su marcador `ENTREGA.md.ok-<sid>`.

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
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 100, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-100.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/100--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/100--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/100-equivalentes/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/100--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/100--<sid>.md` con hasta dónde llegaste, la línea
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
