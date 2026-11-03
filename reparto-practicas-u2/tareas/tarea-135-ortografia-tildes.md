# Tarea 135 · Bloque «Ortografía: las tildes» (`ortografia-tildes`, id 64, 4 ejercicios con tres niveles)

Actualizado: 2026-11-03 (alta de la coordinadora s-20261103T110729-ca61fe3e)
Precondición: **134 LISTA** (lee su ENTREGA: el contrato de `nivel.js` y de `_comun/ortografia.js`) · Disparo: MANUAL (sesión atendida) · **Plazo: mar 9-2** (la 141 lo publica antes del jue 25-2; el primer ★ del bloque es el lun 1-3; ideal, antes de Navidad)
Duración esperada: 1 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/135-ortografia-tildes/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/ortografia-tildes/*` (sustituye el esqueleto que deja la 134: desde que la 134 está LISTA, la dueña de esa carpeta es esta tarea), `tests/practicas-ortografia-tildes.test.js` (nuevo)

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
   printf 'sesión: %s\ntarea: 135\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/135--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/135--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 135 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/135--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

El bloque de las **tildes**, lo más gordo de la ortografía de 1.º ESO y lo que más falla en lo que escriben (tenia, dia,
habia, examenes, numero). Cuatro ejercicios, de más fácil a más difícil, cada uno con tres niveles (regla 3 de contenido):

1. **La sílaba tónica** · *Spanish spelling: the stressed syllable*. Dos pasos (`montarDosPasos`): la palabra partida en
   sílabas como botones, el alumno toca la **tónica**; si acierta, elige **aguda, llana o esdrújula** (tres botones). Si falla
   el primer paso, el ítem termina ahí con la explicación.
2. **¿Lleva tilde?** · *Does it take an accent?* La palabra **sin tildes**, partida en sílabas como botones, y el botón
   «Ninguna»: el alumno toca la sílaba que lleva la tilde o «Ninguna» (`montarTocar` con `ninguna`). La explicación aplica la
   regla a esa palabra («“lápiz” es llana, lá-piz, y acaba en z, que no es n ni s: lleva tilde»).
3. **Diptongos e hiatos** · *Diphthongs and hiatuses*. Igual que el 2, pero todas las palabras tienen dos vocales juntas:
   hay que decidir si van en la misma sílaba (diptongo, reglas generales) o se separan (hiato con i/u tónica: tilde siempre).
4. **Las palabras de Matemáticas** · *The words of Maths*. Hueco en una frase de clase con dos botones, la palabra con y sin
   tilde (`montarHueco`): «El _ 36 es múltiplo de 9» → número / numero. La frase fuerza el sentido (regla 2: «numero» a
   secas también es una palabra, del verbo numerar).

Lo que decide todo el bloque: **un motor de reglas en `logica.js`**, `acentuar(silabas, tonica)`, que a partir de la
palabra partida en sílabas (sin tildes) y de la posición de la tónica devuelve la palabra escrita como manda la
Ortografía: aguda con tilde si acaba en vocal, n o s (no si acaba en s precedida de consonante, ni en y); llana con tilde
si no acaba en vocal, n ni s (sí si acaba en s precedida de consonante: bíceps, cómics); esdrújula y sobresdrújula siempre;
hiato de vocal cerrada tónica junto a abierta: tilde siempre en la cerrada (dí-a, pa-ís, ra-íz, o-ír); en un diptongo la
tilde va en la abierta (tam-bién, hués-ped) o en la segunda cerrada (cuí-da-te); monosílabos sin tilde (los diacríticos
no entran en este bloque: están en `ortografia` 9). **Cada palabra del banco se escribe con su partición y su tónica, y el
test comprueba que la forma escrita es la que da el motor**: así una tilde mal puesta en el banco no llega al alumno.
También comprueba que las sílabas concatenadas dan la palabra y que cada sílaba tiene un solo núcleo vocálico (i/u átonas
junto a a/e/o forman diptongo; dos abiertas o una cerrada tónica junto a otra vocal, hiato: sílabas distintas).

## Siguiente paso

1. Lee la ENTREGA de la 134 (`$R/salidas/134-base-ortografia/ENTREGA.md`: el contrato en una página), `docs/practicas-ortografia.md`
   (§2 niveles, §3 contrato, §6 lo que nunca es distractor), `practicas/_comun/nivel.js` y `practicas/_comun/ortografia.js`
   con sus tests, y `practicas/ortografia/tildes.js` + `textos.js` (cómo están escritos los bancos y las explicaciones de la
   práctica hermana: mismo tono, mismo tipo de frases).
2. `ls practicas/ortografia-tildes/`: la 134 dejó un esqueleto que carga y declara 4 ejercicios. Sustitúyelo empezando por
   `logica.js` (el motor `acentuar` y su test en verde **antes** de escribir un solo ítem), después los bancos, después
   `practica.js` y `textos.js`.
3. Repasa la lista «Lo que nunca es distractor» de `proyecto.md` y cópiala a tu test como lista negra de palabras
   (período/periodo, vídeo/video, cardíaco/cardiaco, olimpíada/olimpiada, alvéolo/alveolo, policíaco/policiaco,
   fútbol/futbol, chófer/chofer, icono/ícono, élite/elite, guion, truhan, hui, fie, rio, frio, Sion, Ruan, solo, este, ese,
   aquel y sus formas, aun/aún fuera de contexto).

## Qué hay que hacer

1. **`logica.js`**: `silabasDe`? **No**: no escribas un silabeador automático (es largo y falla en lo raro). Cada ítem del
   banco lleva la partición hecha a mano: `{ s: ['lá','piz'] … }` no: la forma es `{ silabas: ['la', 'piz'], tonica: 0,
   nivel: 2, pista: 'llana-consonante' }` (sílabas **sin** tildes; la forma escrita la calcula `acentuar`). Exporta
   `acentuar(silabas, tonica)`, `clase(silabas, tonica)` ('aguda' | 'llana' | 'esdrujula' | 'sobresdrujula'),
   `tieneHiato(silabas)`, `nucleos(silaba)` (cuántas vocales tónicas o grupos cuenta) y los bancos `TONICA`, `TILDE`,
   `VOCALES`, `MATES` (este, frases con hueco: `{ antes, despues, con: 'número', sin: 'numero', buena: 'con', nivel }`).
   Las palabras de un banco pueden repetirse en otro si el ejercicio es distinto (no dentro del mismo).
2. **Ejercicio 1, la sílaba tónica** (banco `TONICA`): nivel 1, palabras de dos y tres sílabas de la vida diaria con tónica
   clara (casa, mesa, papel, reloj, ventana, cocina, lápiz, médico, árbol, camión, sábado); nivel 2, palabras más largas,
   formas verbales (cantará / cantaba / cantó: la misma raíz con tres tónicas), plurales que cambian de clase (examen →
   exámenes, joven → jóvenes, imagen → imágenes); nivel 3, cuatro sílabas o más con diptongos (ciudadano, cuidadoso,
   murciélago), sobresdrújulas (devuélvemelo, cómetelo) y compuestos (balompié, decimoséptimo). **Fuera** los adverbios en
   -mente (tienen dos acentos: van en el 2 como regla) y las palabras con dos acentuaciones válidas (lista negra).
   `idError`: `tonica-mal` (paso 1), `clase-<dicha>-por-<buena>` (paso 2: `clase-aguda-por-llana`).
3. **Ejercicio 2, ¿lleva tilde?** (banco `TILDE`): nivel 1, agudas acabadas en vocal, n o s (camión, canción, sofá, después,
   jamás, además) y esdrújulas (música, sábado, número, teléfono, pájaro, Matemáticas), más agudas sin tilde (reloj, pared,
   verdad, cantar, azul, feliz) y llanas sin tilde (examen, joven, margen, imagen, origen, volumen, resumen, cosa, lunes);
   nivel 2, llanas con tilde por acabar en consonante distinta de n o s (árbol, lápiz, fácil, difícil, cárcel, césped,
   álbum, mártir) y los plurales esdrújulos (exámenes, jóvenes, imágenes, orígenes, volúmenes, resúmenes); nivel 3,
   monosílabos sin tilde (fue, dio, vio, fe, ti, da, pie, dios, fui), agudas acabadas en y o en s tras consonante (jersey,
   virrey, robots) y llanas acabadas en s tras consonante (bíceps, cómics), adverbios en -mente (fácilmente, rápidamente
   con tilde; tranquilamente, solamente sin: conservan la del adjetivo: la regla, en la explicación), mayúsculas con tilde
   (Ángel, África, Óscar, Úrsula: «las mayúsculas también llevan tilde»). Equilibrio por nivel: entre el 40 % y el 60 % de
   los ítems llevan tilde (si no, «Ninguna» o «siempre una sílaba» acierta solo). `idError`: `sin-tilde-<clase>`
   (`sin-tilde-llana`, `sin-tilde-esdrujula`), `tilde-de-mas-<clase>`, `tilde-en-otra-silaba`, `tilde-en-monosilabo`.
4. **Ejercicio 3, diptongos e hiatos** (banco `VOCALES`; `montarTocar` con «Ninguna», como el 2): nivel 1, hiatos de
   cerrada tónica con tilde (día, tía, río, frío, país, raíz, maíz, oír, reír, baúl, María, Lucía, tenía, había, comía,
   sabía, leía, creía) frente a diptongos sin tilde (Luis, fui, ruido, cuidado, ciudad, fuimos, juicio, aire, causa, peine);
   nivel 2, diptongos con tilde por las reglas generales (también, después, canción, camión, náutico, huésped, murciélago,
   cuídate, estudiáis) e hiatos de dos abiertas que siguen las reglas generales (león, aéreo, héroe, océano, poeta y toalla
   sin tilde); nivel 3, hiatos con h en medio (prohíbe, búho, vehículo, ahínco, rehén), triptongos (estudiáis, cambiéis,
   averiguáis), «ui/iu» (huida, jesuita, construido, viuda, sin tilde: siempre diptongo) y aún/aun **solo en frase** (como
   hueco con dos botones dentro de este ejercicio: «_ no ha llegado» → aún; «_ así, aprobó» → aun; es el único ítem de
   hueco del ejercicio, y la frase fuerza la lectura). **Fuera**: guion, truhan, hui, fie, rio, frio, Sion, Ruan
   (monosílabos ortográficos desde 2010) y las dobles acentuaciones. `idError`: `sin-tilde-hiato`, `tilde-en-diptongo`,
   `tilde-en-otra-vocal`, `aun-por-aun-con-tilde` y su inverso.
5. **Ejercicio 4, las palabras de Matemáticas** (banco `MATES`, `montarHueco`): nivel 1, número, división, múltiplo, máximo,
   mínimo, común, Matemáticas, cálculo (en «el cálculo mental»), también, más (en una cuenta: «tres _ cuatro» → más;
   «mas» sin tilde es «pero»: la frase fuerza), dieciséis, veintidós, veintitrés, veintiséis; nivel 2, área, ángulo,
   triángulo, rectángulo, perímetro, kilómetro, decímetro, milímetro, décima, centésima, milésima, símbolo, fórmula,
   gráfica, fracción, razón, proporción, ecuación, millón, veintiún; nivel 3, raíz, cúbico, numérico, estadística,
   polígono, pentágono, hexágono, diámetro, vértice, isósceles, equilátero, simétrico, algoritmo (sin tilde: el error es
   «algorítmo»), decimotercero (sin tilde: el error es «décimotercero»), vigésimo, trigésimo, centésimo, milésimo. Las dos
   opciones son la palabra con y sin tilde; **la frase tiene que forzar la buena** (regla 2): «numero», «calculo»,
   «grafica», «mas», «practica» existen como otras palabras. Equilibrio: mitad de ítems donde la buena es la que lleva
   tilde y mitad donde no (algoritmo, decimotercero, examen, cociente, divisor, exponente, potencia, decimal, cardinal…).
   `idError`: `sin-tilde-mates`, `tilde-de-mas-mates`. **Fuera**: período/periodo, octógono/octágono, kilómetro/quilómetro.
6. **`practica.js`**: los cuatro ejercicios con `nombre`/`detalle` `{ es, en }`, `introduccion` en español con la regla en
   cuatro líneas y un ejemplo (modelo: `practicas/ortografia/textos.js`), `generar: (rng, sesion) => elegirDeNivel(…)`,
   `clave`, `montar` con las piezas de `_comun/ortografia.js` y `etiquetaNivel` en el ítem, `enunciado`. Cada fallo con su
   `error` y su `respuesta`. En el feedback del 1 y del 2, la palabra bien escrita en `<b>` y partida en sílabas con la
   tónica marcada.
7. **Test `tests/practicas-ortografia-tildes.test.js`**: (a) `acentuar` contra una tabla de 40 palabras conocidas de todas
   las clases (incluidas bíceps, robots, jersey, cuídate, estudiáis, prohíbe, fue, dio); (b) para **cada** ítem de los
   bancos, las sílabas concatenadas dan la palabra, cada sílaba tiene un solo núcleo, la forma escrita (`acentuar`) es la
   que el ítem usa en las opciones o en la explicación, el `nivel` es 1, 2 o 3, y ninguna palabra está en la lista negra;
   (c) ≥ 16 ítems por nivel y ejercicio (≥ 12 en el 3), sin repetidos dentro de un ejercicio; (d) equilibrio por nivel
   (40-60 % con tilde en el 2 y el 3; en el 4, 40-60 % con la buena con tilde; en el 1, cada clase ≥ 25 %); (e) por fuerza
   bruta con `sesion` simulada (`{ puntos, vidas }` para cada nivel, 3000 tiradas) el generador nunca da un ítem de nivel
   superior; (f) `idError` cumple el patrón y la explicación de cada ítem contiene la palabra bien escrita; (g) en el 4,
   las dos opciones difieren solo en una tilde.

## Datos de entrada

- `$R/salidas/134-base-ortografia/ENTREGA.md`, `docs/practicas-ortografia.md`, `practicas/_comun/nivel.js`,
  `practicas/_comun/ortografia.js` (solo lectura: si te falta algo, cópialo a tu `logica.js` y proponlo en la terminada).
- `practicas/ortografia/tildes.js`, `textos.js`, `practica.js` (solo lectura: el tono y la forma de la práctica hermana).
- El vocabulario matemático del curso: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/*/Repaso de todo/contenidos-unidadN-resumen.tex` (solo lectura; nada se escribe en iCloud).
- Para dudas: `dle.rae.es`, `rae.es/dpd/`, `fundeu.es` (solo lectura).

## Cómo saber que ha terminado

- `node --test tests/practicas-comun.test.js tests/practicas-ortografia-tildes.test.js` en verde y `npm test` sin fallos en tus ficheros.
- En local, los cuatro ejercicios funcionan en los tres niveles (`?nivel=1|2|3` con «Probar sin código»), a 375 px y en
  ancha; en cada uno, un ítem acertado y uno fallado mirando el feedback.
- Los recuentos del test (ítems por nivel) están en la ENTREGA, ejercicio a ejercicio.

## Trampas conocidas

- Los adverbios en -mente tienen dos sílabas tónicas: **no** van en el ejercicio 1; en el 2 van como regla («conservan la
  tilde del adjetivo») y la pieza que se toca es la del adjetivo.
- Desde la Ortografía de 2010, guion, truhan, hui, fie, rio (de reír), frio (de freír), Sion y Ruan son monosílabos **sin**
  tilde, y «solo» y los demostrativos no la llevan (y desde 2023 la RAE admite ponerla si quien escribe ve ambigüedad): nada
  de eso entra en ningún banco, ni como buena ni como mala.
- «examen» no lleva tilde y «exámenes» sí; «carácter» → «caracteres» (cambia la tónica): el 1 lo aprovecha, el 2 lo evita
  o lo explica.
- Las agudas acabadas en -y (jersey, virrey, Paraguay) **no** llevan tilde (la y cuenta como consonante); las acabadas en -s
  tras consonante tampoco (robots, zigzags); las llanas acabadas en -s tras consonante sí (bíceps, fórceps, cómics). Nivel 3.
- Diptongos de dos cerradas (ui, iu): la tilde, si toca por las reglas generales, va en la segunda (cuídate, jesuítico);
  «huida», «construido», «jesuita», «viuda» no llevan.
- Hiato con h en medio: la h no impide el hiato (bú-ho, pro-hí-be, ve-hí-cu-lo).
- Los nombres de persona del banco, inventados o muy comunes (María, Lucía, Ángel, Óscar): `tests/sin-nombres-de-alumnos.test.js`.
- `.cuenta` no se parte (`nowrap`): las sílabas como botones caben a 375 px solo si la palabra tiene ≤ 6 sílabas.
- (U4) Duración real de una práctica de 4 ejercicios numéricos sobre la base ya hecha: 11-30 min. Esta tiene bancos de prosa:
  cuenta con más.

## Prohibido (propio de esta tarea)

- Tocar `practicas/ortografia/*`, `practicas/_comun/*`, `catalogo.js`, `portada.js`, `tareas.js` o los docs: lo que haga
  falta ahí es propuesta en la terminada. `disponible: true` lo pone la 141.
- Un silabeador automático en vez de la partición a mano: falla en lo raro y el motor no puede comprobarlo.
- Meter en el banco una palabra con dos acentuaciones válidas, un monosílabo ortográfico de 2010, «solo» o un demostrativo.
- Cambiar el número de ejercicios (4) o su orden: lo fija el catálogo (134) y el plan de ★.

## Salida esperada

- `practicas/ortografia-tildes/*` y `tests/practicas-ortografia-tildes.test.js` comiteados, con `npm test` sin fallos en tus ficheros.
- `reparto-practicas-u2/salidas/135-ortografia-tildes/ENTREGA.md` (hash, ficheros, los cuatro ejercicios con sus ítems por
  nivel, las palabras descartadas y por qué, dudas de la RAE que hayas resuelto, cómo probarlo en 1 minuto) y su marcador
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
el mensaje «Tarea 135, a medias», escribe `$R/hechos/notas/<sid>-traspaso-135.md` con el
estado exacto (qué está hecho, qué falta, qué has descubierto, en qué orden seguir),
`$R/hechos/fallos/135--<sid>.md` con `parada por: sesión agotada` y la ruta de esa nota, y
`ABANDONADA` en tu reclamo. **Esta tarea es larga a propósito y está pensada para que una
sesión pueda parar entre dos ejercicios**: cada ejercicio es un módulo propio y la
siguiente sesión sigue por el primero que falte.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/135--<sid>.md` con `parada por: mal cortada`
y la ruta de la incidencia, `ABANDONADA` en tu reclamo, y díselo al usuario. Si un paso te
pide **decidir** algo que va a durar (un cambio del contrato de la base, otro número de
ejercicios que el del catálogo, otros umbrales de nivel para todas las prácticas) y esta
tarea no es de banda ALTA con el usuario delante, no lo decidas: entrégalo como propuesta en
tu terminada y sigue con lo que no dependa de ello.

## Al terminar

Por este orden (el del repositorio git):

1. `node --test tests/practicas-comun.test.js tests/practicas-ortografia-tildes.test.js` en verde y `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con
   reclamo vivo no es tuyo: anótalo en la terminada). Prueba la práctica en el navegador con `npm run servir` y
   http://localhost:8080/practicas/ortografia-tildes/ (los módulos ES no cargan abriendo el fichero), con «Probar
   sin código» (nunca el código de un alumno ni AJJN), en una ventana estrecha (375 px) y en una ancha,
   y haz al menos un ítem de **cada ejercicio y de cada nivel** acertando y fallando (`?nivel=3` fuerza
   el nivel en «Probar sin código», tarea 134). La práctica no sale en la portada (está con
   `disponible: false` hasta su tarea de publicación): se entra por la URL.
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas:
   `git add <rutas> && git commit -m "Práctica ortografia-tildes: la sílaba tónica, ¿lleva tilde?, diptongos e hiatos, las palabras de Matemáticas" -- <rutas>`. Apunta el hash
   (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/135-ortografia-tildes/ENTREGA.md` (ficheros entregados, hash, URL local, qué hay en cada
   ejercicio y nivel, decisiones y propuestas, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/135--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/135--<sid>.md` con hasta dónde llegaste, la línea
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
