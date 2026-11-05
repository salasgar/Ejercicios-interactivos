# Tarea 133 · Generador `decimales.js` de la app principal al día con el inventario de la unidad 5 (`items`, distractores = errores típicos, nunca opciones del mismo valor)

Actualizado: 2026-11-03 (corregida con el acta de la tarea 02 de la U5 por la coordinadora de la U5, s-20261103T150058-71204ffa; alta del 2-11 por s-20261102T100120-6a6afb84)
Precondición: F0 del reparto de la U5 firmada (ids definitivos) · no en paralelo con otra tarea que toque `src/ejercicios/decimales.js` · Disparo: MANUAL (sesión atendida) · **Plazo: mar 22-12**
Duración esperada: 1 h (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/133-generador-decimales/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `src/ejercicios/decimales.js` y su test (`tests/decimales-items.test.js`, nuevo si no existe; si ya hay un test que lo cubra, ese)

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
   printf 'sesión: %s\ntarea: 133\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/133--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/133--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 133 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/133--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Lo que la 112 fue para los generadores de fracciones y la 92 para `enteros`: que el generador `decimales.js` de la app
principal (los ejercicios de la portada antigua, no las prácticas) cite las destrezas de la U5 con sus ids en `items`, que cada
distractor salga de un error típico del inventario (regla 4) y que **ninguna opción equivalga a otra por valor** (0,5 y 0,50;
0,25 y 1/4), con la aritmética en enteros escalados; y que respete la regla de oro de `CLAUDE.md` (`construirOpciones` toma los
tres primeros distractores: barajar el pool antes).

## Siguiente paso

Lee `src/ejercicios/decimales.js` entero, `docs/coordinacion-unidad1.md` (el campo `items`), la ficha y la ENTREGA de la 112 (`salidas/112-generadores-fracciones/`) y `tests/distractores.test.js` (lo que ya comprueba).

## Qué hay que hacer

1. Mapa de lo que genera hoy frente al inventario de la U5: qué destrezas cubre, con qué ids, qué no.
2. Corrige: `items` con ids de la U5; distractores desde errores típicos (comparar por cifras, coma mal puesta, ×10 con un cero, redondeo truncado o en cadena, el resto de la división sin coma dado como resto…; las reglas del acta del 3-11 de abajo: negativos nunca nucleares, cambios de unidad solo con los cinco pares, periódicos sin arco, cotas enteras); filtro por valor (nunca dos opciones iguales; nunca un distractor igual a la correcta; `float` fuera: enteros escalados o `Fraction`-like); coma en español y punto en inglés según el idioma de la app; cotas de realismo en los contextos.
3. Test por fuerza bruta (3000 ítems por tipo con semilla fija): opciones distintas por valor, distractores con nombre, `items` válidos, textos sin `×` ni porcentajes.
4. `npm test` sin fallos.

## Datos de entrada

- `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/5. Decimals/inventario-unidad5.tsv` (aprobado), `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/5. Decimals/inventario-unidad5-revision.md`; `src/ejercicios/decimales.js`, `src/ejercicios/index.js` (`construirOpciones`), `src/ejercicios/fracciones_*.js` (modelo de la 112).

## Cómo saber que ha terminado

`npm test` en verde; el test nuevo pasa con 3000 ítems por tipo; cada ejercicio del generador cita ids de la U5 en `items`.

## Trampas conocidas

- `construirOpciones` se planta en tres distractores: barajar el pool (`rng.barajar(pool).slice(0, 3)`), como dice `CLAUDE.md`; `tests/distractores.test.js` lo detecta.
- Un generador que compare con `Number` puede dejar pasar `0.1 + 0.2` como distinto de `0.3`: enteros escalados.
- (s-20261105T221026-1e864583, 5-11) `_comun/decimales.js` (tarea 122) no existía al hacer esta tarea, y la app principal no importa de `practicas/`: `decimales.js` lleva su propia aritmética `{ m, k }`. La clave de cada opción es su valor como fracción reducida (`claveFraccion(m, 10^k)`): así `construirOpciones` descarta solo 0,5 / 0,50 / 1/2. La excepción «a medias» de U5-2C-10 necesita una clave propia, o el motor la descarta por valer lo mismo que la correcta.
- (ídem) `tests/ejercicios.test.js` exige que los pasos acaben en «= valor»; el redondeo acaba en «\approx valor», y por eso el módulo declara `pasosLibres: true` (como `raices`). El test propio sí exige que acaben en «=» o «\approx».
- (ídem) La notación inglesa de la app (`aplicarNotacion`, `src/i18n/index.js`) pinta `\cdot` como `×` y `\div` como `÷`: no es de esta tarea (propuesta en la ENTREGA).

## Prohibido (propio de esta tarea)

- Tocar otros generadores, `index.js` o las prácticas.

## Salida esperada

- `src/ejercicios/decimales.js` y su test comiteados con `npm test` en verde.
- `reparto-practicas-u2/salidas/133-generador-decimales/ENTREGA.md` (hash, qué cubre cada ejercicio con sus ids, qué quedó fuera) y su marcador.

## Reglas de contenido de la unidad 5 (copia de `proyecto.md` de su reparto; lo común no se lee, por eso va aquí)

Corregidas el 2026-11-03 con el acta de la tarea 02 de aquel reparto (F0 firmada ese día) por la coordinadora de la U5,
s-20261103T150058-71204ffa. Las reglas 2-4 y 8-9 de la lista de la unidad 2 (signos `·` y `:`, inglés, regla de oro,
feedback, realismo) valen igual. La fuente es `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/5. Decimals/reparto-unidad5/proyecto.md` («Reglas de contenido comunes»)
y, por encima de ella, **el acta** `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/5. Decimals/inventario-unidad5-revision.md` (léela entera: si esta copia
y el acta discrepan, manda el acta). Ids: 54 destrezas, 27 nucleares (13 + 14); ninguna cambió de id en la revisión.

1. **Un mismo número tiene muchas escrituras, y todas son la misma respuesta.** 0,5 = 0,50 = 1/2 = 5/10; 2 = 2,0; 1,75 = 7/4.
   En cualquier ejercicio de elegir, emparejar o verdadero/falso, ninguna opción puede equivaler a otra: el test lo comprueba
   **por valor** con la aritmética exacta de `_comun/decimales.js` (enteros escalados, nunca `Number` con coma flotante ni
   `toFixed` para comparar). Cuando la respuesta tiene un número fijo de cifras («round to 2 decimal places», dinero), el
   enunciado lo dice y la corrección lo exige. **Excepciones del acta (punto k)**: en las de redondear, 0,5 y 0,50 nunca
   juntas; en «¿qué ceros cambian el valor?» (`U5-1C-05`) la escritura es justo lo que se pregunta; y **en «as a fraction in
   its simplest form» (`U5-2C-10`) la fracción a medio simplificar (75/100 para 0,75) vale como distractor**, solo con ese
   enunciado, como en la U4.
2. **Nada que no se haya dado**: cada ejercicio respeta la columna `sesion` de sus destrezas en el inventario. Semana 1
   (sesiones 1-3): leer y escribir, órdenes, fracción decimal, recta, comparar y ordenar (también negativos), redondear,
   sumar y restar (también con negativos), ×/÷ por 10, 100 y 1000 y los cambios de unidad (sesión 3). Semana 2: multiplicar
   (y ×/÷ por 0,1, 0,01 y 0,001), dividir, la división con prueba y **fracción → decimal (sesión 5)**; **decimal → fracción,
   periódicos, cuadrado y cubo, combinadas y problemas de varios pasos (sesión 6)**. **Ni porcentajes** («0,5 = 50 %» está
   prohibido hasta la U7), ni letras ni ecuaciones (hueco `□`), ni proporcionalidad. Lo que decidió el acta:
   - **Negativos: sí**, en todas las operaciones, con la regla de los signos de la U3, **nunca nucleares** (`U5-1C-17` comparar,
     ordenar y la recta; `U5-1C-18` sumar y restar, también con resultado negativo; `U5-2C-16` multiplicar, dividir y
     combinadas); sin paréntesis al empezar (−3,5 + 1,25, nunca (−3,5) + (+1,25)).
   - **Cambios de unidad: sí** (`U5-1A-04`, no nuclear), como aplicación de ×/÷ por 10, 100 y 1000, **solo km-m, m-cm, kg-g,
     L-mL y euros-céntimos**, de una unidad a la principal o a la contigua; sin superficie, volumen, hectáreas, dam, hg, dal ni
     horas.
   - **Periódicos**: solo reconocerlos al pasar de fracción a decimal (1/3 = 0,333…, «el 3 se repite siempre»), con puntos
     suspensivos, **sin arco**, sin clasificarlos en puros y mixtos y sin operar con ellos (`U5-2C-11`, no nuclear, `cuidado`:
     0,33 no es 1/3, es su redondeo).
   - **Potencias**: cuadrado y cubo de un decimal dentro de las combinadas (`U5-2C-13`, no nuclear); **raíces cuadradas solo
     exactas y solo como reto en las hojas**: en la app, no.
   - **Fracción ↔ decimal**: de fracción a decimal, cualquier fracción dividiendo; decimal exacto hasta las milésimas (3/4,
     7/20, 7/8, 9/4), o se reconoce como periódico, o se para en las centésimas. De decimal a fracción, solo exactos, hasta la
     irreducible, y **las impropias se quedan impropias** (1,25 = 5/4, sin mixtos). Pares de memoria: 1/2, 1/4, 3/4, 1/5,
     1/10 y 1/100.
   - **Redondeo**: a la unidad, a la décima y a la centésima (no a las milésimas ni a las decenas); el 9 que arrastra (2,96 →
     3,0) es `U5-1C-11`, no nuclear. **Estimar** (`U5-1C-12`) es destreza de hoja (`tipo_test = no`): solo para comprobar una
     suma, una resta o dónde va la coma.
   - **La división con dos decimales en el cociente y su prueba** (`U5-2C-07`, nuclear, `tipo_test = no`): dos cifras
     decimales **cortando**, sin redondear (cuando se quiera redondear, el enunciado dice *round*); **el resto es el de la
     división original** y la prueba se hace con los números originales: 6,384 : 0,49 → se hace 638,4 : 49 = 13,02, resto
     0,42 en esa división; el resto de la original es 0,42 : 100 = **0,0042**; prueba **0,49 · 13,02 + 0,0042 = 6,384**. Si
     el divisor ya es natural (7 : 4), no hay nada que deshacer.
   - **Calculadora: ninguna.** Desde la U5, precios con céntimos y medidas con decimales valen en cualquier enunciado.
3. **La coma y el punto**: en español, coma (`3,75`); en inglés, punto (`3.75`) y la lectura con *point* y las cifras una a
   una (*three point seven five*; *nought* y *zero* valen). `fmtDecimal` y `leerDecimal` de `_comun/decimales.js` lo hacen por
   idioma (el alumno puede teclear coma o punto en los dos idiomas: la base lo acepta). Nunca un punto de millares; **la coma
   de millares inglesa (40,800,013.9) solo en `U5-1B-01` y `U5-1B-05`**; en todo lo demás, números de hasta cuatro cifras
   enteras. Producto con `·`, nunca `×`; división con `:` también en inglés (`÷` solo en el vocabulario). Periódicos con
   puntos suspensivos.
4. **Regla de oro**: todo distractor, inequívocamente falso, y cada distractor sale de un **error típico** de la columna
   `nota` del inventario, calculado con los números del ítem y comprobado en el test (nunca un número al azar): comparar
   por el número de cifras (3,9 < 3,10); sumar o restar alineando a la derecha; colocar mal la coma al multiplicar (1,2 · 0,3
   = 3,6); ×10 añadiendo un cero (2,5 · 10 = 2,50); ÷10 quitando un cero; redondear truncando o en cadena (3,649 → 3,65 →
   3,7, el que se nombra); olvidar la coma del cociente; **en la división con prueba, dar como resto el de la división sin
   coma** (0,42 en vez de 0,0042); tomar 0,33 por 1/3; décimas por centésimas; 3/4 = 1,33; 0,75 = 75/10; «0,5 €» por 5
   céntimos. Los generadores de estos valores están en `_comun/decimales.js` (`ERRORES_TIPICOS`): úsalos, y **cada función
   dice cuándo no sirve** (devuelve `null` cuando el error da lo mismo que la respuesta). **Lo que no es un error**: 2,50 € por
   2,5 € (en dinero, la clave admite las dos), ni una escritura con ceros finales.
5. **Parejas válidas, que nunca se enfrentan**: *nought point five* / *zero point five* / *point five*; *round to one decimal
   place* / *round to the nearest tenth*; *decimal places* / *digits after the decimal point*; `÷` / `:`; *times* /
   *multiplied by*; *proof* / *test* (la prueba de la división); un decimal y su fracción; un decimal con y sin ceros finales;
   *metres* / *meters*. Y lo que se oye en la calle no es distractor limpio: *three point seventy-five* y *three seventy-five*
   (precios) no se enfrentan a *three point seven five*; la lectura se evalúa con opciones claramente falsas (*thirty-seven
   point five*, *seven point three five*).
6. **Inglés sencillo**; la palabra no matemática que decide la respuesta se aclara entre paréntesis (*change* (la vuelta),
   *per litre* (por litro), *nearest* (más cercano), *weighs* (pesa)), salvo que sea justo lo que se evalúa. Unidades en inglés
   británico (*metres, litres, kilograms, euros, cents*).
7. **Realismo** (regla de Juan Luis del 16-10): la situación tiene que ser posible y **todos** los números que pueda sacar el
   generador, creíbles, con una cota por contexto que el test comprueba (`assert` por contexto, como
   `src/ejercicios/contextos_mcd_mcm.js`). **Cotas aprobadas en el acta (punto l), enteras**: un producto de supermercado o
   papelería 0,20-30 €; fruta al peso 0,80-6 € el kilo, de 0,5 a 5 kg; una prenda 5-120 €, un móvil 80-1200 €, una entrada
   3-60 €; gasolina 1,20-2,00 € el litro, de 5 a 70 L; pagar con un billete de 5, 10, 20 o 50 € que cubra el total, la vuelta
   nunca negativa; una cena a partes iguales 10-200 €, entre 2 y 30 personas, exacto al céntimo o el enunciado dice que se
   redondea; un listón o una tabla 1-3 m, lo que queda nunca negativo; una persona 1,20-2,10 m y 30-120 kg, un recién nacido
   2,5-4,5 kg; una carrera de 100 m 9,58-20,00 s, **una vuelta a la pista 90-200 s**; botellas de 0,25, 0,33, 0,5, 0,75, 1, 1,5
   o 2 L, garrafas hasta 50 L, cuántas se llenan: un número entero; temperaturas de −10 a 45 °C con una decimal, el cuerpo
   35,0-42,0 °C; notas de 0 a 10 con una decimal; distancias a pie o en bici hasta 50 km, en coche hasta 1000 km. Y además:
   un vaso 0,2-0,33 L; una bañera 100-300 L; una habitación 2-10 m; un folio 21 × 29,7 cm; una piscina 25 o 50 m; una pieza de
   fruta 0,08-0,5 kg; una bolsa 0,5-5 kg; un paquete 0,1-30 kg; nunca horas con decimales salvo que el enunciado lo explique.
   El dinero, siempre con dos decimales en el enunciado. **Para la app se reservan los contextos de supermercado al peso y de
   gasolina**; la vuelta (del cambio), la cena y las botellas son del papel.
8. **Feedback ligado al error**, con los números del ítem («2,5 + 1,25: has alineado a la derecha; alinea las comas: 2,50 +
   1,25 = 3,75»), no una regla genérica. Frase sencilla antes que caso límite.
9. **Casos fijos** (frases, contextos, números) que no copien los de las hojas, los exámenes semanales ni el examen final de la
   unidad 5 (en `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/5. Decimals/hojas-de-ejercicios/`, `exámenes-semanales/`, `examen-final/`): los alumnos los verán en papel. **Los
   casos de las hojas se excluyen en claro; los de los exámenes, por huella FNV-1a calculada fuera del repositorio, nunca en
   claro** (regla de PU2 del 30-10; modelo: `practicas/equivalentes/logica.js` y `tests/practicas-equivalentes.test.js` tras el
   commit b0e4cfd, y la reabierta `hechos/reabiertas/100--s-20261030T081542-dab2aa98-revision.md`). Si al reclamar la hoja o el
   examen de tu semana no existen aún, dilo en la ENTREGA: la tarea de publicación de tu semana coteja y reabre si hace falta.
10. **Aritmética exacta**: los decimales se representan como enteros escalados (`{m, k}` = m / 10^k, con `m` también negativo)
    o céntimos/milésimas; nunca se suma, compara ni muestra con `Number` en coma flotante (0,1 + 0,2 ≠ 0,3). Los tests lo
    comprueban contra `BigInt` o aritmética entera propia.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 133, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-133.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/133--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/133--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/133-generador-decimales/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cotas de realismo, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/133--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/133--<sid>.md` con hasta dónde llegaste, la línea
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
  CDN; las prácticas no usan ni siquiera KaTeX (exponentes con `<sup>`).
- Las reglas de contenido de la unidad 5 (en esta ficha y en `proyecto.md` de su reparto): `×` en vez de `·`, letras,
  ecuaciones, porcentajes, proporcionalidad; aritmética en coma flotante; lo que el acta del 3-11 deja fuera (el arco de los
  periódicos, clasificarlos u operar con ellos; raíces en la app; cambios de unidad fuera de km-m, m-cm, kg-g, L-mL y
  euros-céntimos; números mixtos) o algo de una sesión posterior a la de la destreza; distractores que puedan ser
  verdad, y en especial **dos opciones con el mismo valor** (0,5 y 0,50; 0,25 y 1/4), que son dos respuestas correctas;
  casos de examen en claro en el repositorio.
