# Tarea 136 · Bloque «Ortografía: las letras» (`ortografia-letras`, id 65, 4 ejercicios con tres niveles)

Actualizado: 2026-11-03 (alta de la coordinadora s-20261103T110729-ca61fe3e)
Precondición: **134 LISTA** (lee su ENTREGA) · Disparo: MANUAL (sesión atendida) · **Plazo: mar 26-1** (la 140 lo publica antes del jue 11-2; el primer ★ del bloque es el lun 22-2; ideal, antes de Navidad)
Duración esperada: 1 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/136-ortografia-letras/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/ortografia-letras/*` (sustituye el esqueleto de la 134), `tests/practicas-ortografia-letras.test.js` (nuevo)

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
   printf 'sesión: %s\ntarea: 136\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/136--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/136--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 136 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/136--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

El bloque de las **letras que se confunden**: la h, b/v, g/j y el resto (ll/y, m antes de p y b, r/rr, c/z/qu, -d/-z
final, cc, x/s). Cuatro ejercicios, de más fácil a más difícil, con tres niveles cada uno:

1. **hay, ahí, ay; a ver, haber** · *hay, ahí, ay; a ver, haber*. Hueco en una frase con dos o tres botones
   (`montarHueco`). Nivel 1: hay / ahí / ay (tres botones). Nivel 2: a ver / haber (dos). Nivel 3: repaso de las tres
   parejas de `ortografia` (a/ha, e/he, echo/hecho) con frases nuevas y más difíciles, y habría / abría.
2. **b o v** · *b or v*. La palabra con un hueco donde va la letra, en una frase corta cuando haga falta para el sentido, y
   dos botones (b, v). Cada ítem lleva la **regla** que lo decide, y la explicación la dice con esa palabra.
3. **g o j (y la diéresis)** · *g or j (and the dieresis)*. Igual: hueco con dos botones (g, j), y en el nivel 3 también
   gu / gü.
4. **Otras letras** · *Other letters*. Hueco con dos botones que cambian según el ítem: ll / y, m / n (antes de p y b),
   r / rr, c / z / qu, -d / -z final, c / cc, x / s.

## Siguiente paso

1. Lee la ENTREGA de la 134 y `docs/practicas-ortografia.md` (§2, §3, §6), `practicas/_comun/nivel.js` y
   `practicas/_comun/ortografia.js`, y `practicas/ortografia/logica.js` + `textos.js` (los bancos de a/ha, e/he, echo/hecho y
   sus explicaciones: el nivel 3 del ejercicio 1 los continúa con el mismo tono, **sin repetir ninguna frase**).
2. `ls practicas/ortografia-letras/`: sustituye el esqueleto empezando por `logica.js` (la tabla `REGLAS` y los bancos) y su
   test en verde, después `practica.js` y `textos.js`.
3. Copia la lista negra de `proyecto.md` a tu test.

## Qué hay que hacer

1. **`logica.js`**: una tabla `REGLAS` con cada regla ortográfica que usa el bloque: `{ id, letra, patron (RegExp sobre la
   palabra completa bien escrita), texto (la regla en una frase, con hueco para la palabra), excepciones: [...] }`. Cada ítem
   de los ejercicios 2-4 es `{ palabra: 'tam_ién', buena: 'b', otra: 'v', regla: 'mb', frase: 'Yo _ voy.' | null, nivel }`,
   y el test comprueba que la palabra bien escrita cumple el `patron` de su regla (o está en sus `excepciones`, declaradas).
   Para el ejercicio 1, frases con hueco como en `ortografia/logica.js`: `{ texto: 'Deja la mochila _.', buena: 'ahí',
   opciones: ['hay', 'ahí', 'ay'], nivel: 1 }`.
2. **Ejercicio 1** (banco `HACHES`): nivel 1, hay / ahí / ay (≥ 6 frases por palabra; «hay» seguido de nombre o cantidad, y
   también «hay que»; «ahí» con verbos de lugar; «ay» tras ¡ o seguido de coma); nivel 2, a ver / haber («vamos a ver»,
   «a ver si…», «voy a ver»; «tiene que haber», «debe de haber», «va a haber», «puede haber»); nivel 3, a/ha, e/he,
   echo/hecho con frases nuevas (ninguna de `ortografia/logica.js`: el test lo comprueba importando `PAREJAS`) y
   habría / abría («Si estudiara, _ aprobado» → habría; «La puerta se _ sola» → abría). Mismas prohibiciones que la
   práctica hermana («a ver»/«haber» solo en el nivel 2; nada de «ha de»; «había» no aparece en las frases de a/ha y e/he
   porque es la palabra del truco). `idError`: `<puesta>-por-<buena>` con `slug`.
3. **Ejercicio 2, b o v** (banco `BV`): nivel 1, -aba del imperfecto (cantaba, jugaba, estábamos), bu-/bur-/bus- (buscar,
   burbuja, butaca), m + b (también, cambiar, hombre, nombre), bl/br (blanco, brazo, pueblo, libro), n + v (invierno,
   envidia, convivir, enviar), bien-/bene- (bienvenido, beneficio); nivel 2, adjetivos en -ava/-ave/-avo/-eva/-eve/-evo/
   -iva/-ivo (octava, suave, nuevo, breve, activa, deportivo), verbos en -bir (escribir, recibir, prohibir), -bilidad
   (amabilidad, posibilidad), -bundo (vagabundo), iba/ibas/íbamos (de ir: con b), tuve/estuve/anduve (pretéritos con v),
   vice-/villa- (vicepresidenta, Villanueva); nivel 3, las **excepciones** (árabe, hervir, servir, vivir, movilidad,
   civilidad) y los **homófonos en frase** (tubo/tuvo, baca/vaca, bello/vello, bienes/vienes, cabo/cavo, grabar/gravar,
   rebelar/revelar, sabia/savia, basto/vasto, bota/vota, botar/votar), donde la frase fuerza la lectura. `idError`:
   `v-por-b`, `b-por-v`.
4. **Ejercicio 3, g o j** (banco `GJ`): nivel 1, -aje/-eje (garaje, viaje, paisaje, mensaje, equipaje), -jero/-jera/-jería
   (relojero, extranjera, cerrajería), -gen (origen, margen, imagen, virgen), gue/gui (guerra, guitarra, hoguera, águila),
   ejercicio/ejemplo/ejército/ejecutar (j); nivel 2, -ger/-gir (coger, recoger, elegir, corregir, dirigir, exigir, proteger,
   fingir), -gia/-gio/-gión (magia, colegio, región, religión), -logía (biología, geología), -gésimo (vigésimo, trigésimo),
   -geno/-gena (oxígeno, hidrógeno, indígena), pretéritos con j (dije, traje, conduje, produje, tradujo); nivel 3, la
   **diéresis** (pingüino, cigüeña, paragüero, vergüenza, lingüística, antigüedad, bilingüe; frente a guerra, guitarra,
   hoguera, águila sin diéresis: tres botones g / j / gü cuando toque), las **excepciones** (tejer, crujir) y las palabras
   «de memoria» con j ante e/i (jefe, jersey, jirafa, jinete, berenjena, jengibre, ajeno, mujer, objeto, sujeto, tarjeta).
   `idError`: `j-por-g`, `g-por-j`, `sin-dieresis`, `dieresis-de-mas`.
5. **Ejercicio 4, otras letras** (banco `OTRAS`, botones según el ítem): nivel 1, ll / y (yo, ya, ayer, hoy, mayo, playa,
   rey, reyes, llave, lluvia, calle, llevar, llegar, yendo; «_ he terminado» → ya, el error «lla» de los correos), m
   antes de p y b (campo, también, siempre, hombre, cambio, tiempo; n antes de v: invitar, envolver), r / rr (perro/pero,
   carro/caro, corro/coro en frase; rr solo entre vocales: Enrique, alrededor, honra con r); nivel 2, c / z / qu (zapato,
   cereza, cocina, quince, queso, quiero, aquí), los plurales en -ces (lápiz → lápices, vez → veces, luz → luces, pez →
   peces, feliz → felices, raíz → raíces); nivel 3, -d / -z final (verdad, pared, ciudad, Madrid, actitud; lápiz, feliz,
   arroz, cruz: el error «Madriz», «verdaz»), -cc- / -c- (acción, dirección, lección, colección, construcción, perfección;
   frente a afición, atención, canción, relación, condición), x / s (extraño, explicar, excursión, éxito, exacto, examen,
   extraordinario, exquisito, excelente; frente a espléndido, estrella, esplendor, estricto, espontáneo, escéptico).
   `idError`: `y-por-ll`, `ll-por-y`, `n-por-m`, `r-por-rr`, `rr-por-r`, `z-por-c`, `c-por-z`, `c-por-cc`, `cc-por-c`,
   `s-por-x`, `x-por-s`, `z-final-por-d`, `d-final-por-z`.
6. **`practica.js` y `textos.js`**: como la 135 (nombre/detalle `{ es, en }`, introducción con la regla y un ejemplo,
   `generar` con `elegirDeNivel`, `etiquetaNivel`, feedback con la regla aplicada a esa palabra y la palabra bien escrita
   en `<b>`; en los homófonos, también qué significa la otra: «“tuvo” es del verbo tener; “tubo” es el cilindro»).
7. **Test**: (a) cada ítem cumple el `patron` de su regla o está en sus `excepciones`; (b) las dos (o tres) opciones dan
   palabras distintas y solo una es la del banco; en los homófonos, las dos existen (tabla `HOMOFONOS` con su significado) y
   la frase es distinta para cada una; (c) ≥ 16 ítems por nivel y ejercicio, sin repetidos; (d) equilibrio por nivel
   (ningún botón acierta más del 60 %); (e) nunca por encima del nivel, por fuerza bruta; (f) ninguna frase del nivel 3 del
   ejercicio 1 está en `PAREJAS` de `practicas/ortografia/logica.js`; (g) `idError` con el patrón y explicaciones con la
   palabra bien escrita; (h) lista negra (cinc/zinc, biznieto/bisnieto, kilómetro/quilómetro, y lo demás de `proyecto.md`).

## Datos de entrada

- `$R/salidas/134-base-ortografia/ENTREGA.md`, `docs/practicas-ortografia.md`, `practicas/_comun/nivel.js`, `practicas/_comun/ortografia.js` (solo lectura).
- `practicas/ortografia/logica.js` y `textos.js` (solo lectura: las parejas que el nivel 3 del ejercicio 1 continúa sin repetir).
- Para dudas: `dle.rae.es`, `rae.es/dpd/`, `fundeu.es` (solo lectura).

## Cómo saber que ha terminado

- `node --test tests/practicas-comun.test.js tests/practicas-ortografia-letras.test.js` en verde y `npm test` sin fallos en tus ficheros.
- En local, los cuatro ejercicios en los tres niveles (`?nivel=`), a 375 px y en ancha; un ítem acertado y uno fallado en cada uno.
- Los recuentos por nivel en la ENTREGA.

## Trampas conocidas

- «árabe» acaba en -abe y lleva b; «hervir», «servir» y «vivir» llevan v aunque acaben en -vir; «movilidad» y «civilidad»
  llevan v aunque acaben en -ilidad: son el nivel 3, con la excepción dicha en la explicación, nunca el 1.
- «iba» (de ir) lleva b; «IVA» es otra cosa: la frase tiene que forzar el verbo.
- La diéresis solo sobre la u de güe/güi (pingüino, cigüeña); nunca sobre gua/guo (agua, antiguo).
- «tejer» y «crujir» son las excepciones de -ger/-gir; «berenjena» lleva j porque no es -gena de «gen».
- En Murcia c/z y s se distinguen al hablar: casa/caza, cocer/coser **no** son homófonos para estos alumnos y no entran.
- cinc/zinc, biznieto/bisnieto, kilómetro/quilómetro: dobles grafías válidas; fuera.
- La rr solo va entre vocales; tras n, l o s va r simple aunque suene fuerte (Enrique, alrededor, Israel).
- Nombres de persona inventados; «Villanueva» y «Madrid» son topónimos, no alumnos.
- Duración real de una práctica numérica de 4 ejercicios en la U4: 11-30 min; esta tiene bancos de prosa: cuenta con más.

## Prohibido (propio de esta tarea)

- Tocar `practicas/ortografia/*`, `practicas/_comun/*`, `catalogo.js`, `portada.js`, `tareas.js` o los docs. `disponible: true` lo pone la 140.
- Repetir una frase de `practicas/ortografia/logica.js` en el nivel 3 del ejercicio 1.
- Homófonos de seseo (casa/caza) o dobles grafías válidas como ítems.
- Cambiar el número de ejercicios (4) o su orden.

## Salida esperada

- `practicas/ortografia-letras/*` y `tests/practicas-ortografia-letras.test.js` comiteados, con `npm test` sin fallos en tus ficheros.
- `reparto-practicas-u2/salidas/136-ortografia-letras/ENTREGA.md` (hash, ficheros, los cuatro ejercicios con sus reglas e
  ítems por nivel, lo descartado y por qué, cómo probarlo en 1 minuto) y su marcador `ENTREGA.md.ok-<sid>`.

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
el mensaje «Tarea 136, a medias», escribe `$R/hechos/notas/<sid>-traspaso-136.md` con el
estado exacto (qué está hecho, qué falta, qué has descubierto, en qué orden seguir),
`$R/hechos/fallos/136--<sid>.md` con `parada por: sesión agotada` y la ruta de esa nota, y
`ABANDONADA` en tu reclamo. **Esta tarea es larga a propósito y está pensada para que una
sesión pueda parar entre dos ejercicios**: cada ejercicio es un módulo propio y la
siguiente sesión sigue por el primero que falte.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/136--<sid>.md` con `parada por: mal cortada`
y la ruta de la incidencia, `ABANDONADA` en tu reclamo, y díselo al usuario. Si un paso te
pide **decidir** algo que va a durar (un cambio del contrato de la base, otro número de
ejercicios que el del catálogo, otros umbrales de nivel para todas las prácticas) y esta
tarea no es de banda ALTA con el usuario delante, no lo decidas: entrégalo como propuesta en
tu terminada y sigue con lo que no dependa de ello.

## Al terminar

Por este orden (el del repositorio git):

1. `node --test tests/practicas-comun.test.js tests/practicas-ortografia-letras.test.js` en verde y `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con
   reclamo vivo no es tuyo: anótalo en la terminada). Prueba la práctica en el navegador con `npm run servir` y
   http://localhost:8080/practicas/ortografia-letras/ (los módulos ES no cargan abriendo el fichero), con «Probar
   sin código» (nunca el código de un alumno ni AJJN), en una ventana estrecha (375 px) y en una ancha,
   y haz al menos un ítem de **cada ejercicio y de cada nivel** acertando y fallando (`?nivel=3` fuerza
   el nivel en «Probar sin código», tarea 134). La práctica no sale en la portada (está con
   `disponible: false` hasta su tarea de publicación): se entra por la URL.
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas:
   `git add <rutas> && git commit -m "Práctica ortografia-letras: la h, b/v, g/j y otras letras" -- <rutas>`. Apunta el hash
   (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/136-ortografia-letras/ENTREGA.md` (ficheros entregados, hash, URL local, qué hay en cada
   ejercicio y nivel, decisiones y propuestas, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/136--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/136--<sid>.md` con hasta dónde llegaste, la línea
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
