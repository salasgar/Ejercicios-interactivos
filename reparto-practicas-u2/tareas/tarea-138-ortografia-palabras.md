# Tarea 138 · Bloque «Ortografía: palabras que se confunden» (`ortografia-palabras`, id 67, 3 ejercicios con tres niveles)

Actualizado: 2026-11-03 (alta de la coordinadora s-20261103T110729-ca61fe3e)
Precondición: **134 LISTA** (lee su ENTREGA) · Disparo: MANUAL (sesión atendida) · **Plazo: mar 23-3** (la 142 lo publica antes del jue 15-4; el primer ★ del bloque es el lun 19-4; ideal, mucho antes)
Duración esperada: 1 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/138-ortografia-palabras/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/ortografia-palabras/*` (sustituye el esqueleto de la 134), `tests/practicas-ortografia-palabras.test.js` (nuevo)

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
   printf 'sesión: %s\ntarea: 138\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/138--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/138--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 138 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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
7. Idempotencia: comprueba si los ficheros de «Ficheros que toca» ya existen o ya tienen
   parte del trabajo (de una sesión caída) antes de empezar. Si es así, léelos y continúa desde ahí.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/138--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

El bloque de las **palabras que se confunden**: las que van juntas o separadas, las que suenan igual y se escriben distinto,
y los números y símbolos tal como se escriben en Matemáticas. Tres ejercicios con tres niveles:

1. **¿Junto o separado?** · *One word or two?* Hueco con dos (o tres) botones (`montarHueco`): «No es rojo, _ azul» → sino /
   si no.
2. **Suenan igual, se escriben distinto** · *Sound-alikes*. Hueco con dos botones, los dos homófonos: «El fontanero cambió el
   _» → tubo / tuvo.
3. **Números y símbolos** · *Numbers and symbols*. «¿Cuál está bien escrita?» (`montarElegir`) o hueco: numerales en letras,
   apócopes, ordinales y los símbolos de las unidades.

Es banda **ALTO** porque aquí es donde más dobles formas válidas hay (treintaiuno, enseguida, asimismo, adonde, undécimo,
onceavo, 12.000…): cada ítem exige cotejar con la RAE y la lista «Lo que nunca es distractor» de `proyecto.md`, y un ítem
con dos respuestas defendibles en un ★ semanal es una reclamación segura.

## Siguiente paso

1. Lee la ENTREGA de la 134 y `docs/practicas-ortografia.md` (§2, §3 y, sobre todo, §6), `practicas/_comun/nivel.js` y
   `practicas/_comun/ortografia.js`, y `practicas/ortografia/logica.js` (la pareja `porque` y sus reglas: el ejercicio 1 no
   la repite; la forma «porqué» sustantivo va en la ampliación, tarea 139).
2. `ls practicas/ortografia-palabras/`: sustituye el esqueleto empezando por `logica.js` y su test en verde (la lista negra
   **primero**).
3. Mira qué separador de millares y qué escritura de unidades usan los materiales del curso (`comun/clil1eso.sty` y una hoja
   cualquiera de `apuntes-1eso-bilingue/*/hojas-de-ejercicios/`, solo lectura): lo que el curso escribe de una manera no
   puede ser «mal» en la app.

## Qué hay que hacer

1. **`logica.js`**: bancos puros con la forma de `PAREJAS` de `ortografia/logica.js` donde valga, y para cada ítem el `nivel` y
   el `motivo` (una frase: «“sino” junto corrige o contrapone; “si no” es una condición negativa»). Exporta también la
   `LISTA_NEGRA` (copiada de `proyecto.md`) para que el test la use.
2. **Ejercicio 1, ¿junto o separado?** (banco `JUNTAS`): nivel 1, sino / si no, también / tan bien, tampoco / tan poco, y
   las que **siempre** van separadas y los alumnos juntan (a veces, o sea, en serio, de repente, por favor, a lo mejor, al
   menos, por fin, a menudo, de pronto, en medio, en fin, a gusto, a través) frente a las que siempre van juntas y los
   alumnos separan (alrededor, adelante, atrás, encima, debajo, detrás, conmigo, también, además, apenas, aunque, bienvenido);
   para estas, la «otra» opción es la forma errónea («aveces», «osea», «al rededor») y el motivo dice que no existe; nivel
   2, aparte / a parte, demás / de más, sobre todo / sobretodo (abrigo), mediodía / medio día, entorno / en torno,
   sinvergüenza / sin vergüenza, porqué (sustantivo, con determinante delante) frente a porque / por qué (tres botones),
   si quiera / siquiera (solo «ni siquiera»), haber / a ver **no** (está en la 136); nivel 3, conque / con que / con qué,
   por que (preposición + que, solo tras verbos que rigen «por»: preocuparse por, optar por, esforzarse por, votar por),
   a sí mismo frente a asimismo **solo cuando «también» no encaje de ninguna manera** («Se mira _ en el espejo» → a sí mismo),
   quehacer / que hacer, sinfín / sin fin («Un _ de problemas» → sinfín; «Una cinta _» → sin fin). **Fuera, por válidas las
   dos**: enseguida / en seguida, deprisa / de prisa, aprisa / a prisa, enfrente / en frente, asimismo / así mismo (como
   «también»), adonde / a donde, entretanto / entre tanto, bocabajo / boca abajo, sobremanera / sobre manera. Equilibrio
   por nivel: ninguna de las dos opciones acierta más del 60 %. `idError`: `<puesta>-por-<buena>` con `slug`
   (`si-no-por-sino`, `aveces-por-a-veces`).
3. **Ejercicio 2, suenan igual** (banco `HOMOFONOS`, con tabla `PARES` de significados): nivel 1, hola / ola, tubo / tuvo,
   hasta / asta, vaya / valla, hizo / izo, hierba / hierva; nivel 2, haya / halla, rallar / rayar, callado / cayado, bello /
   vello, baya (tres botones vaya / valla / baya), honda / onda, huso / uso, deshecho / desecho, hecho / echo **no** (está
   en `ortografia`); nivel 3, bienes / vienes, sabia / savia, grabar / gravar, rebelar / revelar, abría / habría (también
   en la 136 con otras frases: no repitas las suyas), hojear / ojear, cabo / cavo, errar / herrar, basto / vasto, bota /
   vota, bacilo / vacilo, baca / vaca. Cada frase fuerza una sola lectura (regla 2); la explicación da el significado de
   las dos («“tuvo” es del verbo tener; “tubo” es el cilindro»). **Fuera**: casa / caza, cocer / coser, abrazar / abrasar y
   cualquier par que solo sea homófono con seseo (en Murcia se distinguen). `idError`: `<puesta>-por-<buena>`.
4. **Ejercicio 3, números y símbolos** (bancos `NUMEROS` y `SIMBOLOS`): nivel 1, numerales en letras: del 16 al 29 en una
   palabra (dieciséis, veintidós: la mala es «diez y seis», «veinte y dos»), las centenas (quinientos, setecientos,
   novecientos: las malas «cincocientos», «sietecientos», «nuevecientos»), ciento / cien («cien euros», «ciento veinte»,
   «ciento uno»: las malas «ciento euros», «cien veinte», «cien uno»), «mil» invariable («dos mil»: la mala «dos miles»;
   «mil uno»), «dos mil veintiséis» (la mala «dos mil y veintiséis»); **nunca** «treinta y uno» frente a «treintaiuno» (las
   dos valen; la mala posible es «treintay uno» o «treinta i uno», que no vale la pena: no hagas ítems del 31 al 99 salvo
   con la y mal escrita); nivel 2, apócopes solo en masculino (veintiún alumnos / veintiuno alumnos; un, algún, ningún,
   cualquier; primer / primero, tercer / tercero: «el primer día», «el tercer piso»; **nada en femenino**: «veintiún
   alumnas» y «la primer vez» no son inequívocos), «millón de» («dos millones de personas»), «por ciento» en dos palabras
   («el cinco por ciento»; la mala «porciento», con la explicación de que en España se escribe en dos palabras), años sin
   punto («2026», la mala «2.026»); nivel 3, símbolos de unidades: sin punto, sin plural, en minúscula salvo los que no (kg,
   km, m, cm, mm, g, h, min, s, km/h, m²; las malas: «kgs», «Kg», «kg.», «mts», «cms», «grs», «hs», «seg», «sg», «mins»,
   «min.», «Km/h»), el símbolo detrás del número («5 €»: la mala «€5»), y los ordinales de dos palabras con tilde mal
   («decimotercero» ✓ frente a «décimotercero» ✗; **no** «décimo tercero», que vale). **Fuera**: l / L (litro), 5 % / 5%,
   5 € / 5€, 1.º / 1º, n.º / nº, 12.000 / 12 000 (la RAE pide espacio pero los materiales del curso llevan punto), undécimo /
   decimoprimero, duodécimo / decimosegundo, onceavo y doceavo como ordinales (el DLE los recoge), treintaiuno y compañía.
   `idError`: `numeral-separado`, `centena-mal`, `cien-por-ciento`, `ciento-por-cien`, `mil-en-plural`, `y-tras-mil`,
   `sin-apocope`, `porciento-junto`, `punto-en-ano`, `simbolo-con-punto`, `simbolo-en-plural`, `simbolo-en-mayuscula`,
   `simbolo-mal`, `simbolo-delante`, `tilde-en-compuesto`.
5. **`practica.js` y `textos.js`**: como las anteriores (nombre/detalle `{ es, en }`, introducción con la regla y un ejemplo,
   `generar` con `elegirDeNivel`, `etiquetaNivel`, feedback con el motivo del ítem y la buena a la vista).
6. **Test**: (a) en el 1, las dos opciones son iguales quitando espacios y tildes (pares junto/separado) o la «otra» está
   declarada como forma inexistente en una tabla `INEXISTENTES`; ninguna opción ni palabra del banco está en
   `LISTA_NEGRA`; (b) en el 2, cada par está en `PARES` con dos significados distintos y las dos palabras existen; ninguna
   del par de seseo; cada frase es distinta para cada palabra del par; (c) en el 3, las malas son la buena con un cambio
   declarado (tabla de errores con nombre) y ninguna buena ni mala está en `LISTA_NEGRA`; (d) ≥ 16 ítems por nivel y
   ejercicio, sin repetidos; equilibrio (≤ 60 % por botón); nunca por encima del nivel; `idError` con el patrón; las
   explicaciones contienen la forma buena; ninguna frase de la 136 (`HACHES`) ni de `ortografia` repetida (impórtalas).

## Datos de entrada

- `$R/salidas/134-base-ortografia/ENTREGA.md`, `docs/practicas-ortografia.md`, `practicas/_comun/nivel.js`, `practicas/_comun/ortografia.js` (solo lectura).
- `practicas/ortografia/logica.js` (la pareja `porque`) y, si la 136 está LISTA, `practicas/ortografia-letras/logica.js` (abría/habría, a ver/haber: no repetir frases).
- Los materiales del curso para ver cómo escriben números y unidades: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/comun/clil1eso.sty` y una hoja de cualquier unidad (solo lectura).
- Para dudas: `dle.rae.es`, `rae.es/dpd/`, `fundeu.es` (solo lectura). La Ortografía de 2010 es la norma: lo que un libro de texto viejo diga distinto, fuera.

## Cómo saber que ha terminado

- `node --test tests/practicas-comun.test.js tests/practicas-ortografia-palabras.test.js` en verde y `npm test` sin fallos en tus ficheros.
- En local, los tres ejercicios en los tres niveles (`?nivel=`), a 375 px y en ancha; un ítem acertado y uno fallado en cada uno.
- La ENTREGA lleva los recuentos por nivel y **la lista de lo que descartaste por tener dos formas válidas**, con la fuente.

## Trampas conocidas

- La Ortografía de 2010 admite «treintaiuno», «cuarentaidós»… en una palabra (poco frecuente pero válido) y los ordinales
  13.º-29.º en una o dos palabras (decimotercero / décimo tercero): ninguno de esos pares es un ítem.
- «undécimo» y «decimoprimero», «duodécimo» y «decimosegundo» valen los dos; «onceavo» y «doceavo» como ordinales están en el
  DLE aunque se desaconsejen: fuera.
- «porciento» está en el DLE como americanismo («el porciento»); en España la expresión es «por ciento». Ítem solo con la
  explicación «en España, dos palabras», y en el nivel 2.
- «veintiún alumnas» y «la primer vez» se oyen y se escriben en América y la RAE no las condena del todo: solo masculino.
- La RAE escribe 12 000 con espacio y desaconseja 12.000, pero las hojas y exámenes del curso llevan punto: el separador de
  millares no entra en la app como error.
- «5%», «5€», «1º», «nº» frente a «5 %», «5 €», «1.º», «n.º»: recomendaciones de la RAE, no errores inequívocos; fuera.
- En Murcia c/z y s se distinguen: casa/caza, cocer/coser no son homófonos aquí.
- «asimismo» = «también»: en casi cualquier frase con «a sí mismo» encaja también «asimismo» (= «también se lo dijo»): solo
  frases donde «también» sea imposible («Se mira a sí mismo en el espejo»).
- «sobretodo» es un abrigo (válido): la frase tiene que forzar «sobre todo» (= especialmente).
- Duración real de una práctica numérica en la U4: 11-30 min; esta exige cotejar con la RAE ítem a ítem: cuenta con más.

## Prohibido (propio de esta tarea)

- Tocar `practicas/ortografia/*`, otras prácticas, `practicas/_comun/*`, `catalogo.js`, `portada.js`, `tareas.js` o los docs. `disponible: true` lo pone la 142.
- Un ítem cuya mala sea una forma que la RAE admite (la lista negra) o una recomendación y no una regla.
- Ítems del 31 al 99 en letras, salvo con la «y» mal escrita; ítems de apócope en femenino; separador de millares.
- Cambiar el número de ejercicios (3) o su orden.

## Salida esperada

- `practicas/ortografia-palabras/*` y `tests/practicas-ortografia-palabras.test.js` comiteados, con `npm test` sin fallos en tus ficheros.
- `reparto-practicas-u2/salidas/138-ortografia-palabras/ENTREGA.md` (hash, ficheros, los tres ejercicios con sus ítems por
  nivel, lo descartado por doble forma válida con su fuente, cómo probarlo en 1 minuto) y su marcador `ENTREGA.md.ok-<sid>`.

## Reglas de contenido de la ortografía (copia de `proyecto.md`, «Reglas de contenido de la ortografía»; lo común no se lee, por eso va aquí)

Las reglas comunes 4 (regla de oro), 8 (feedback ligado al ítem) y 9 (realismo) de `proyecto.md` valen igual. Y además:

1. **Solo español.** `idioma: 'es'` en `arrancar`; `nombre` y `detalle` de cada ejercicio en `{ es, en }` (el `en`
   empieza por «Spanish spelling: …», como en `practicas/ortografia/textos.js`): los usan la portada y la tarea semanal.
2. **Regla de oro, versión ortografía.** Ninguna opción puede ser también correcta. **Nunca** como hueco ni como distractor
   dos formas que la RAE admita las dos (la lista «Lo que nunca es distractor» de `proyecto.md`; cópiala al test como lista
   negra). Si la forma correcta depende del sentido, el contexto de la frase tiene que **forzar una sola** lectura; si no se
   consigue, la frase se descarta o va como «¿qué frase dice esto?» (el patrón de los ejercicios 7 y 8 de `ortografia`).
   Al añadir una frase, léela con todas las opciones puestas.
3. **Tres niveles por ejercicio**, con `nivel: 1 | 2 | 3` en cada ítem del banco y `elegirDeNivel` de
   `practicas/_comun/nivel.js` (tarea 134): **1** = lo que todo alumno de 1.º ESO tiene que dominar y lo que más falla en
   sus textos; **2** = el resto de lo que marca 1.º ESO; **3** = más allá de 1.º ESO (lo de 2.º-3.º: excepciones, cultismos,
   reglas finas), siempre con una sola respuesta defendible. Cada nivel con **≥ 16 ítems** (≥ 12 si el ejercicio es de tocar
   piezas o tiene tres o más opciones) y **equilibrado**: ningún botón acierta más del 60 % de las veces dentro de su nivel.
   El test lo comprueba por fuerza bruta (≥ 3000 ítems por ejercicio con `sesion` simulada en cada nivel) y comprueba
   también que el generador **nunca da un ítem de nivel superior** al que dice `nivelDe(sesion)`.
4. **Frases de la vida del instituto y de casa**, cortas (≤ 14 palabras), con nombres de persona **inventados** (nunca de
   alumnos reales: lo vigila `tests/sin-nombres-de-alumnos.test.js` cuando la carpeta de datos está) y sin datos reales;
   nada ofensivo ni que ridiculice a nadie. El realismo de la regla 9 vale para las situaciones.
5. **Feedback ligado al ítem**: la regla aplicada a **esa** palabra o frase («“lápiz” es llana, lá-piz, y acaba en z, que no
   es n ni s: lleva tilde»), con la forma buena en `<b>` y, tras un fallo, la buena a la vista en el hueco o tachando la mala
   (como hace `montarRevision` de `ortografia`). Nunca una regla genérica sola.
6. **`error` de `api.responder`**: identificador corto y **estable por confusión**, no por frase (`v-por-b`,
   `sin-tilde-llana`, `mayuscula-en-mes`): minúsculas, cifras y guiones, ≤ 40 caracteres (patrón `^[a-z0-9-]{1,40}$`);
   `respuesta`: lo que puso el alumno. Es lo que el panel agrupa en «Qué falla más».
7. **Palabras de uso en 1.º ESO** (nada raro ni técnico salvo en el nivel 3 y con su explicación); las de Matemáticas, del
   vocabulario de las unidades del curso (números naturales, divisibilidad, enteros, fracciones, decimales, álgebra,
   proporcionalidad, geometría).
8. **Dudas**: `dle.rae.es`, el Diccionario panhispánico de dudas (`rae.es/dpd/`) y `fundeu.es`, solo lectura. Lo que la RAE
   admita de dos maneras, fuera; lo dudoso, fuera; lo que un libro de texto viejo diga distinto que la Ortografía de 2010
   (guion, solo, demostrativos), fuera.
9. **Nada de gramática** (leísmo, dequeísmo, concordancia, «si tendría») salvo lo que la ficha de la ampliación nombre, y
   nada de separación silábica a final de línea.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; un ejercicio a medias se
queda como esqueleto «En construcción», nunca registrado a medias), commitea tus rutas con
el mensaje «Tarea 138, a medias», escribe `$R/hechos/notas/<sid>-traspaso-138.md` con el
estado exacto (qué está hecho, qué falta, qué has descubierto, en qué orden seguir),
`$R/hechos/fallos/138--<sid>.md` con `parada por: sesión agotada` y la ruta de esa nota, y
`ABANDONADA` en tu reclamo. **Esta tarea es larga a propósito y está pensada para que una
sesión pueda parar entre dos ejercicios**: cada ejercicio es un módulo propio y la
siguiente sesión sigue por el primero que falte.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/138--<sid>.md` con `parada por: mal cortada`
y la ruta de la incidencia, `ABANDONADA` en tu reclamo, y díselo al usuario. Si un paso te
pide **decidir** algo que va a durar (un cambio del contrato de la base, otro número de
ejercicios que el del catálogo, otros umbrales de nivel para todas las prácticas) y esta
tarea no es de banda ALTA con el usuario delante, no lo decidas: entrégalo como propuesta en
tu terminada y sigue con lo que no dependa de ello.

## Al terminar

Por este orden (el del repositorio git):

1. `node --test tests/practicas-comun.test.js tests/practicas-ortografia-palabras.test.js` en verde y `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con
   reclamo vivo no es tuyo: anótalo en la terminada). Prueba la práctica en el navegador con `npm run servir` y
   http://localhost:8080/practicas/ortografia-palabras/ (los módulos ES no cargan abriendo el fichero), con «Probar
   sin código» (nunca el código de un alumno ni AJJN), en una ventana estrecha (375 px) y en una ancha,
   y haz al menos un ítem de **cada ejercicio y de cada nivel** acertando y fallando (`?nivel=3` fuerza
   el nivel en «Probar sin código», tarea 134). La práctica no sale en la portada (está con
   `disponible: false` hasta su tarea de publicación): se entra por la URL.
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas:
   `git add <rutas> && git commit -m "Práctica ortografia-palabras: junto o separado, homófonos, números y símbolos" -- <rutas>`. Apunta el hash
   (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/138-ortografia-palabras/ENTREGA.md` (ficheros entregados, hash, URL local, qué hay en cada
   ejercicio y nivel, decisiones y propuestas, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/138--<sid>.md`: hash del commit, ficheros (lo que dice
   `git show --stat`, no lo que crees), número de tests propios en verde, hora y
   **duración real** (de `abierto:` a ahora), y propuestas pendientes si las hay.
5. Añade `CERRADA` a tu reclamo (línea propia que empieza por esa palabra).
6. Choques encontrados → `$R/hechos/incidencias/<sid>.md`.
7. `git fetch origin`, relista `$R/hechos/` **ahora** y regenera `$R/_ESTADO.md` entero
   (o retoque de tus filas y del registro si hay otras sesiones en el árbol): todas las filas,
   el registro con una línea por fichero de `terminadas/`, banda y «encadenable» recopiadas
   de las fichas, leyenda de bandas de `proyecto.md`. Anota qué tareas pasan de BLOQUEADA a
   PENDIENTE. Si tu duración real difiere mucho de la estimada, díselo al usuario.
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

Si paras sin terminar: `$R/hechos/fallos/138--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni
  `practicas/_comun/` (salvo las tareas de base —01, 79, 98, 122 y, en la ortografía, la 134— y
  las de publicación —93-96, 109-111, 115, 117-120, 130-131 y, en la ortografía, 140-142—, cada
  una en lo que declara), ni `css/estilos.css`, ni `README.md` (salvo las de base y publicación),
  ni `firestore.rules` ni `src/firebase.js` (salvo 01), ni fichas ajenas, ni nada de la carpeta
  de apuntes de iCloud. Si la base te falta algo, se propone en la terminada; no se parchea.
- `git add .`, `git add -A`, `git commit -a`, o un `add` separado del `commit`. El índice
  es compartido con otras sesiones del mismo árbol.
- Editar el código con `sed -i` o heredocs desde el shell: el candado de sesiones solo
  ve Edit/Write, y así otra sesión no sabe que el fichero está en uso. El código se edita
  con las herramientas de edición; `hechos/` sí se escribe desde el shell (un escritor).
- Reescribir un fichero de `hechos/` (solo `>>`), editar un reclamo ajeno, o regenerar el
  tablón de memoria sin relistar `hechos/`.
- Dependencias nuevas (npm, CDN): la app no tiene build y solo carga KaTeX y Firebase por
  CDN; las prácticas no usan ni siquiera KaTeX.
- Las reglas de contenido de la ortografía (sección propia de esta ficha y «Reglas de contenido
  de la ortografía» en `proyecto.md`): dos formas que la RAE admita, nunca como hueco ni como
  distractor; una sola respuesta defendible por ítem; frases con nombres inventados.
