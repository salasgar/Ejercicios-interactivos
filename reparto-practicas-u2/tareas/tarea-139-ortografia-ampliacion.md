# Tarea 139 · Bloque «Ortografía: ampliación» (`ortografia-ampliacion`, id 68, 4 ejercicios con tres niveles; más allá de 1.º ESO, nunca ★)

Actualizado: 2026-11-03 (alta de la coordinadora s-20261103T110729-ca61fe3e)
Precondición: **134 LISTA** (lee su ENTREGA) · Disparo: MANUAL (sesión atendida) · **Plazo: mar 23-3** (la 142 lo publica con el bloque de palabras si está LISTA; si no, lo publica una tarea nueva de la coordinadora). No bloquea ningún ★: es la última en prioridad
Duración esperada: 1 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/139-ortografia-ampliacion/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/ortografia-ampliacion/*` (sustituye el esqueleto de la 134), `tests/practicas-ortografia-ampliacion.test.js` (nuevo)

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
   printf 'sesión: %s\ntarea: 139\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/139--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/139--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 139 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/139--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

El bloque **para los que van bien en ortografía**: lo que no se espera de un alumno de 1.º ESO pero sí de uno de 3.º o de
4.º, para que quien ya domina lo básico tenga adónde ir (decisión de Juan Luis del 3-11: «para los alumnos más avanzados
habría que llegar a un nivel superior al que se espera de un alumno de 1.º»). Nunca es ★ de una tarea semanal; cómo se
ofrece (tarea `asignada` a los alumnos que él marque, «a elegir» en las tareas de la U8, o libre en la portada) lo decide
Juan Luis con la ENTREGA de la 142. Aun así, sus tres niveles van de lo que un buen alumno de 1.º ya puede a lo de 4.º.
Cuatro ejercicios:

1. **porque, por qué, porqué y por que** · *The four «porque»*. Hueco con cuatro botones (`montarHueco`): las cuatro
   formas. Nivel 1, porque / por qué con frases nuevas y más difíciles que las de `ortografia` (preguntas indirectas sin ¿?,
   «porque» dentro de una pregunta); nivel 2, más «porqué» sustantivo (siempre con determinante delante: el porqué, los
   porqués, un porqué, su porqué); nivel 3, más «por que» (preposición + que: tras verbos y nombres que rigen «por»:
   preocuparse por que, optar por que, esforzarse por que, votar por que, «las ganas por que llegue el verano»).
2. **Formas verbales que se escriben mal** · *Verb forms that get misspelt*. Hueco con dos botones, la forma buena y el error
   habitual, con una tabla `ERRORES` que dice por qué (la buena, la mala, la regla): nivel 1, dijiste / dijistes, hiciste /
   hicistes, anduve / andé, haya / haiga; nivel 2, cupo / cabió, conduje / conducí, aprieta / apreta, quepo / cabo, sé /
   sabo, produjo / producí, tradujo / traducí, suelda / solda, friega / frega; nivel 3, hubo / hubieron y había / habían
   impersonales («_ muchas fiestas» → hubo), prever / preveer y prevé / prevee, satisfizo / satisfació, deshizo / deshació,
   yendo / llendo, ve / vé (imperativo de ir sin tilde, monosílabo). **Fuera, por válidas las dos**: iros / idos (RAE 2020),
   freído / frito, imprimido / impreso, proveído / provisto, y los imperativos con -ros («callaros»), que son coloquiales y
   discutidos.
3. **Siglas, abreviaturas y prefijos** · *Acronyms, abbreviations and prefixes*. «¿Cuál está bien escrita?» (`montarElegir`):
   nivel 1, siglas sin puntos ni plural (DNI, no D.N.I.; las ONG, no las ONGs ni las ONG's; los DVD), abreviaturas con punto
   (etc., pág., Sr., Sra., dpto., tel.) y «etc.» sin puntos suspensivos detrás; nivel 2, prefijos pegados a la palabra
   (exalumno, exnovio, exjugador, antivirus, superbién, vicepresidenta, posventa; las malas «ex alumno», «ex-alumno»,
   «anti virus») y «ex primer ministro» separado porque la base tiene dos palabras; nivel 3, el guion ante mayúscula o cifra
   (anti-OTAN, sub-21, pro-Obama), «currículums» frente a «currícula» (que no es plural en español), «cómics», «pósteres»,
   siglas que se leen como palabras y pasan a minúscula solo cuando el DLE las recoge así (ovni, sida, láser: pero **no**
   hagas ítems con ellas, porque OVNI en mayúsculas no es error claro). **Fuera**: posguerra / postguerra, clubs / clubes,
   los extranjerismos (fútbol / futbol, güisqui / whisky, wasap / WhatsApp), ovni / OVNI.
4. **Puntuación avanzada** · *Advanced punctuation*. «¿Cuál está bien escrita?»: nivel 1, la raya de diálogo (—, pegada,
   frente al guion corto y a los espacios mal) y el punto fuera del paréntesis; nivel 2, el punto y coma en enumeraciones
   con comas dentro y la coma o el punto fuera de las comillas («…», dijo.); nivel 3, el punto y coma delante de «sin
   embargo», «no obstante», «por tanto» en frases largas, el inciso del narrador en medio del diálogo («—Ven —dijo Ana— que
   te lo explico.»), los dos puntos frente al punto y coma donde solo uno vale (anunciar frente a separar). **Fuera**:
   comillas inglesas frente a latinas, coma frente a punto y coma en frases cortas, «¿Vienes?, ¿o te quedas?» frente a
   «¿Vienes? ¿O te quedas?» (valen las dos).

Es banda **ALTO** porque es el bloque con más terreno dudoso: aquí sobre todo manda la regla 8 (lo que la RAE admita de dos
maneras, fuera; lo dudoso, fuera), y cada ítem se coteja.

## Siguiente paso

1. Lee la ENTREGA de la 134 y `docs/practicas-ortografia.md` (§2, §3, §6), `practicas/_comun/nivel.js` y
   `practicas/_comun/ortografia.js`, `practicas/ortografia/logica.js` (la pareja `porque`: sus frases no se repiten) y, si
   están LISTAS, las ENTREGA de la 137 (puntuación: lo que el nivel 3 de aquella ya cubre del punto y coma y la raya, para
   no repetir frases) y la 138 (palabras).
2. `ls practicas/ortografia-ampliacion/`: sustituye el esqueleto empezando por `logica.js` y su test en verde (la lista negra
   primero).

## Qué hay que hacer

1. **`logica.js`**: bancos puros con `nivel` y `motivo` en cada ítem, la tabla `ERRORES` del ejercicio 2 (`{ buena, mala,
   regla }`), la tabla `PREFIJOS` y la `LISTA_NEGRA` copiada de `proyecto.md` (ampliada con lo propio de este bloque: iros,
   freído, imprimido, proveído, callaros, posguerra, clubs, ovni, los extranjerismos).
2. **Ejercicio 1, las cuatro formas** (banco `PORQUES`): cuatro botones siempre («porque», «por qué», «porqué», «por que»),
   ≥ 16 frases por nivel, y en cada nivel las cuatro respuestas presentes al menos una vez; las reglas de forma del test:
   «por qué» en pregunta directa o indirecta (¿, o tras preguntar/saber/explicar/dime/no sé), «porqué» con determinante
   delante (el, los, un, su, este, cada…) y nada detrás que lo convierta en pregunta, «por que» tras un verbo o nombre de la
   lista que rige «por» (`RIGEN_POR`) y seguido de verbo en subjuntivo, «porque» en los demás casos y nunca justo tras ¿.
   Ninguna frase de `PAREJAS.porque` de `ortografia`. `idError`: `<puesta>-por-<buena>` con `slug`.
3. **Ejercicio 2, formas verbales** (banco `VERBOS` sobre `ERRORES`): cada ítem es una frase con hueco y los dos botones, la
   buena y la mala de `ERRORES`; la explicación dice la regla («“andar” es irregular en el pretérito: anduve, como tuve y
   estuve»; «el verbo haber impersonal va siempre en singular: hubo fiestas, había muchos»). El nivel 3 con las impersonales
   es gramática: va porque es lo que más se oye y Juan Luis lo pidió como ampliación; lo demás gramatical (leísmo, dequeísmo,
   «si tendría»), fuera. `idError`: `<mala>-por-<buena>` con `slug`.
4. **Ejercicio 3, siglas, abreviaturas y prefijos** (banco `SIGLAS`): la forma de `SIGNOS` de `ortografia/signos.js` (la
   buena y una o dos malas con su motivo); el test comprueba que las malas son la buena con un cambio (puntos, plural,
   espacio, guion, mayúsculas) y que ninguna buena ni mala está en la lista negra. `idError`: `puntos-en-sigla`,
   `plural-en-sigla`, `abreviatura-sin-punto`, `etc-con-puntos-suspensivos`, `prefijo-separado`, `prefijo-con-guion`,
   `prefijo-pegado-a-dos-palabras`, `sin-guion-ante-mayuscula`, `plural-mal`.
5. **Ejercicio 4, puntuación avanzada** (banco `AVANZADA`): igual forma; malas con un cambio de signo o espacio; ninguna
   mala cuyo único cambio sea comillas inglesas por latinas o coma por punto y coma en frase corta. `idError`:
   `guion-por-raya`, `espacio-tras-raya`, `punto-dentro-parentesis`, `coma-por-punto-y-coma`, `coma-dentro-comillas`,
   `inciso-narrador-mal`, `punto-y-coma-por-dos-puntos`.
6. **`practica.js` y `textos.js`**: como las anteriores. La introducción de cada ejercicio dice en una línea que esto es
   «más de lo que se pide en 1.º»: que el alumno sepa que está en la ampliación.
7. **Test**: lista negra; reglas de forma del ejercicio 1; `ERRORES` completo (cada mala distinta de la buena, cada regla
   > 20 caracteres); malas = buena con un cambio en 3 y 4; ≥ 16 ítems por nivel y ejercicio (≥ 12 en el 1 por lo de las
   cuatro respuestas); equilibrio (≤ 60 % por botón; en el 1, cada forma ≥ 15 % por nivel); nunca por encima del nivel;
   `idError` con el patrón; ninguna frase de `ortografia` ni de la 137 ni de la 138 repetida (impórtalas si existen).

## Datos de entrada

- `$R/salidas/134-base-ortografia/ENTREGA.md`, `docs/practicas-ortografia.md`, `practicas/_comun/nivel.js`, `practicas/_comun/ortografia.js` (solo lectura).
- `practicas/ortografia/logica.js` y `signos.js`; las ENTREGA de la 137 y la 138 si existen (solo lectura: no repetir frases).
- Para dudas: `dle.rae.es`, `rae.es/dpd/`, `fundeu.es` (solo lectura). Para los prefijos, la Ortografía de 2010 (prefijos
  pegados; separados ante base pluriverbal; con guion ante mayúscula o cifra).

## Cómo saber que ha terminado

- `node --test tests/practicas-comun.test.js tests/practicas-ortografia-ampliacion.test.js` en verde y `npm test` sin fallos en tus ficheros.
- En local, los cuatro ejercicios en los tres niveles (`?nivel=`), a 375 px y en ancha; un ítem acertado y uno fallado en cada uno.
- La ENTREGA lleva los recuentos por nivel, lo descartado por doble forma válida con su fuente, y **una propuesta en tres
  líneas de cómo ofrecer el bloque** (asignada / a elegir / libre), que la 142 le pasa a Juan Luis.

## Trampas conocidas

- La RAE admitió «iros» en 2020; «freído/frito», «imprimido/impreso», «proveído/provisto» valen los dos; «callaros» y
  compañía son coloquiales y discutidos: ninguno es ítem.
- «OVNI» en mayúsculas no es un error claro aunque el DLE recoja «ovni»: fuera. Igual «posguerra/postguerra», «clubs/clubes»
  y los extranjerismos adaptados.
- Prefijos (Ortografía de 2010): pegados a una palabra (exalumno, antivirus), separados ante base de varias palabras (ex
  primer ministro, anti pena de muerte), con guion ante mayúscula o cifra (anti-OTAN, sub-21). Antes de 2010 se escribía
  «ex alumno»: los libros viejos no mandan.
- «por que» (preposición + que) es raro y suena mal a muchos: solo tras verbos y nombres que rigen «por» y con subjuntivo
  detrás; si la frase admite «por el que / por la que» con el mismo sentido, la RAE también admite «por que» pero el ítem
  queda dudoso: fuera.
- Las impersonales de haber («hubo fiestas», «había muchos») son gramática, no ortografía: van porque lo pidió Juan Luis
  como ampliación; nada más de gramática.
- Los diálogos con raya a 375 px: frases cortas (≤ 10 palabras) para que caben las tres versiones sin partir.
- Duración real de una práctica numérica en la U4: 11-30 min; esta exige cotejar con la RAE ítem a ítem: cuenta con más.

## Prohibido (propio de esta tarea)

- Tocar `practicas/ortografia/*`, otras prácticas, `practicas/_comun/*`, `catalogo.js`, `portada.js`, `tareas.js` o los docs. `disponible: true` lo pone la 142 (o la tarea que la coordinadora dé de alta).
- Un ítem cuya mala sea una forma que la RAE admite, una recomendación y no una regla, o una forma que la RAE haya cambiado en 2010 o después y los libros viejos sigan enseñando al revés.
- Gramática fuera de las impersonales de haber y de la tabla `ERRORES`.
- Cambiar el número de ejercicios (4) o su orden; meter el bloque en una tarea semanal como ★.

## Salida esperada

- `practicas/ortografia-ampliacion/*` y `tests/practicas-ortografia-ampliacion.test.js` comiteados, con `npm test` sin fallos en tus ficheros.
- `reparto-practicas-u2/salidas/139-ortografia-ampliacion/ENTREGA.md` (hash, ficheros, los cuatro ejercicios con sus ítems por
  nivel, lo descartado con su fuente, la propuesta de cómo ofrecer el bloque, cómo probarlo en 1 minuto) y su marcador
  `ENTREGA.md.ok-<sid>`.

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
el mensaje «Tarea 139, a medias», escribe `$R/hechos/notas/<sid>-traspaso-139.md` con el
estado exacto (qué está hecho, qué falta, qué has descubierto, en qué orden seguir),
`$R/hechos/fallos/139--<sid>.md` con `parada por: sesión agotada` y la ruta de esa nota, y
`ABANDONADA` en tu reclamo. **Esta tarea es larga a propósito y está pensada para que una
sesión pueda parar entre dos ejercicios**: cada ejercicio es un módulo propio y la
siguiente sesión sigue por el primero que falte.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/139--<sid>.md` con `parada por: mal cortada`
y la ruta de la incidencia, `ABANDONADA` en tu reclamo, y díselo al usuario. Si un paso te
pide **decidir** algo que va a durar (un cambio del contrato de la base, otro número de
ejercicios que el del catálogo, otros umbrales de nivel para todas las prácticas) y esta
tarea no es de banda ALTA con el usuario delante, no lo decidas: entrégalo como propuesta en
tu terminada y sigue con lo que no dependa de ello.

## Al terminar

Por este orden (el del repositorio git):

1. `node --test tests/practicas-comun.test.js tests/practicas-ortografia-ampliacion.test.js` en verde y `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con
   reclamo vivo no es tuyo: anótalo en la terminada). Prueba la práctica en el navegador con `npm run servir` y
   http://localhost:8080/practicas/ortografia-ampliacion/ (los módulos ES no cargan abriendo el fichero), con «Probar
   sin código» (nunca el código de un alumno ni AJJN), en una ventana estrecha (375 px) y en una ancha,
   y haz al menos un ítem de **cada ejercicio y de cada nivel** acertando y fallando (`?nivel=3` fuerza
   el nivel en «Probar sin código», tarea 134). La práctica no sale en la portada (está con
   `disponible: false` hasta su tarea de publicación): se entra por la URL.
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas:
   `git add <rutas> && git commit -m "Práctica ortografia-ampliacion: los cuatro porque, formas verbales, siglas y prefijos, puntuación avanzada" -- <rutas>`. Apunta el hash
   (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/139-ortografia-ampliacion/ENTREGA.md` (ficheros entregados, hash, URL local, qué hay en cada
   ejercicio y nivel, decisiones y propuestas, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/139--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/139--<sid>.md` con hasta dónde llegaste, la línea
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
