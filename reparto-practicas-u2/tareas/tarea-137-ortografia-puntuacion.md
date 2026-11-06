# Tarea 137 · Bloque «Ortografía: puntuación y mayúsculas» (`ortografia-puntuacion`, id 66, 4 ejercicios con tres niveles)

Actualizado: 2026-11-03 (alta de la coordinadora s-20261103T110729-ca61fe3e)
Precondición: **134 LISTA** (lee su ENTREGA) · Disparo: MANUAL (sesión atendida) · **Plazo: mar 26-1** (la 140 lo publica antes del jue 11-2; el primer ★ del bloque, «Mayúsculas», es el lun 15-2, el primero de todos los nuevos; ideal, antes de Navidad)
Duración esperada: 1 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/137-ortografia-puntuacion/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/ortografia-puntuacion/*` (sustituye el esqueleto de la 134), `tests/practicas-ortografia-puntuacion.test.js` (nuevo)

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
   printf 'sesión: %s\ntarea: 137\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/137--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/137--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 137 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/137--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

El bloque de la **puntuación y las mayúsculas**, con el correo al profesor como remate (de ahí salieron los errores que
Juan Luis apuntó el 23-10: mayúsculas, espacios, signos). Cuatro ejercicios, de más fácil a más difícil, con tres niveles:

1. **Mayúsculas** · *Capital letters*. La frase con las palabras como botones (`montarTocar` con `multiple: true` y
   «Comprobar»): el alumno toca las palabras que están **mal** (una minúscula que debería ser mayúscula, o una mayúscula
   que debería ser minúscula) y comprueba. Correcto solo si marca exactamente las que están mal. Al comprobar, la frase
   corregida debajo.
2. **El punto y la coma** · *Full stop and comma*. «¿Cuál está bien escrita?» (`montarElegir`): dos o tres frases que solo
   se diferencian en puntos, comas y mayúsculas tras punto.
3. **Dos puntos, puntos suspensivos y el saludo** · *Colon, ellipsis and greetings*. Igual: dos o tres versiones de la misma
   frase o del arranque de un correo.
4. **El correo al profesor** · *An email to your teacher*. Tres versiones de un mensaje corto de dos o tres líneas (la de un
   alumno al profesor o a un compañero), solo una bien escrita; y, en el nivel 3, ítems de «¿Dónde va esto, en el asunto o
   en el cuerpo?» (dos botones), porque hay alumnos que escriben el correo entero en el asunto.

Todo lo que en `ortografia` ya está (coma del vocativo, comas que cambian el significado, ¿? ¡! y espacios, coma entre
sujeto y verbo) **no se repite aquí**: se cita en las explicaciones si hace falta («la coma del vocativo ya la conoces»).

## Siguiente paso

1. Lee la ENTREGA de la 134 y `docs/practicas-ortografia.md` (§2, §3, §6), `practicas/_comun/nivel.js` y
   `practicas/_comun/ortografia.js`, y `practicas/ortografia/comas.js`, `signos.js`, `sujeto.js` (los bancos de «¿cuál está
   bien escrita?» de la práctica hermana: la forma de las malas, «la buena con un cambio», y sus tests).
2. `ls practicas/ortografia-puntuacion/`: sustituye el esqueleto empezando por `logica.js` y su test en verde.
3. Copia la lista negra de `proyecto.md` a tu test, y lee también la memoria de la infografía «asunto y cuerpo» que cita la
   ficha en «Datos de entrada».

## Qué hay que hacer

1. **`logica.js`**: bancos puros. Mayúsculas: `{ texto: 'el lunes vamos a murcia con la profesora de lengua.', correcto: 'El
   lunes vamos a Murcia con la profesora de Lengua.', nivel }` (el test deriva qué palabras cambian: solo cambian en
   mayúscula/minúscula, nunca en letras). Frases de «¿cuál está bien escrita?»: `{ bien: '…', malas: [['…', 'motivo'], …],
   nivel }` como `SIGNOS` de `signos.js`, con el motivo de cada mala en una frase (la explicación lo dice). Correos: `{ bien:
   'Hola, Juan Luis:\n¿Puede decirme qué nota he sacado en el examen?\nGracias.', malas: [[…, motivo], …], nivel }`;
   asunto/cuerpo: `{ texto, donde: 'asunto' | 'cuerpo', nivel: 3 }`.
2. **Ejercicio 1, mayúsculas** (banco `MAYUSCULAS`): nivel 1, inicio de frase y tras punto, nombres de persona y de lugar
   (ciudades, países, ríos con su nombre), y la mezcla al revés (una mayúscula de más en un nombre común: «mi Perro»);
   nivel 2, días, meses y estaciones en **minúscula** (lunes, enero, verano), gentilicios e idiomas en minúscula (murciano,
   inglés), asignaturas en mayúscula **solo en contexto inequívoco de asignatura** («la profesora de Lengua», «aprobé
   Matemáticas», «tengo examen de Inglés»; nunca «me gustan las matemáticas», que es la ciencia), festividades (Navidad,
   Semana Santa), mayúsculas con tilde (Ángela, Álvaro, África); nivel 3, cargos y títulos en minúscula (el rey, la
   directora, la presidenta, el papa, la ministra), los genéricos geográficos en minúscula (río Segura, mar Mediterráneo,
   monte Everest, isla de Tabarca; **nunca «Mar Menor»**, que lleva el genérico dentro del nombre), instituciones con
   mayúscula (la Universidad de Murcia, el Instituto Salvador Sandoval, el Ministerio de Educación), títulos de obras (solo
   la primera palabra: «El principito», «Cien años de soledad»), la mayúscula tras los dos puntos del saludo («Hola, Marta:
   Te escribo…») y «yo» siempre en minúscula (el «I» inglés). Cada frase con **una a tres** palabras mal, y ≥ 25 % de las
   frases de cada nivel con una mayúscula **de más** (si todas fueran de menos, el alumno tocaría minúsculas sin leer).
   `idError`: `minuscula-en-nombre-propio`, `mayuscula-en-mes`, `mayuscula-en-dia`, `mayuscula-en-gentilicio`,
   `minuscula-tras-punto`, `mayuscula-en-cargo`, `minuscula-en-asignatura`, `minuscula-en-institucion`,
   `mayuscula-en-generico-geografico`, `tocadas-de-mas` (tocó una que estaba bien).
3. **Ejercicio 2, el punto y la coma** (banco `PUNTO_COMA`): nivel 1, la coma de las enumeraciones (entre los elementos y
   **no** antes de la «y» final: «Compré pan, leche, huevos y fruta»), el punto y seguido con mayúscula («Llegué tarde. El
   profesor ya había empezado.»); nivel 2, la coma antes de «pero», «aunque» y «sino» («Quería ir, pero llovía»), la coma
   tras un conector al principio («Sin embargo, …», «Además, …», «Por ejemplo, …», «Es decir, …», «Por último, …»), la
   coma tras «sí» y «no» al responder («Sí, voy.»), la coma del inciso de dos lados cuando la frase ya la trae (sin
   entrar en el significado, que es el 7 de `ortografia`); nivel 3, «etc.» con coma delante y punto detrás («lápices, gomas,
   etc.»), los conectores en medio de la frase entre comas («Iremos, sin embargo, por la tarde»), el punto fuera del
   paréntesis («Llegó tarde (como siempre).»), y la coma antes de «y» cuando lo que sigue **no es otro elemento de la
   lista** («Compré pan y leche, y después fui al cine»: solo con frases donde quitar la coma deja dos lecturas claramente
   peores; si la coma es opcional, la frase no vale). Las malas son la buena con un cambio (una coma de más o de menos, una
   minúscula tras punto, un punto por coma), y el test comprueba que sin signos las frases son iguales. `idError`:
   `coma-antes-de-y-final`, `sin-coma-enumeracion`, `minuscula-tras-punto`, `sin-coma-pero`, `sin-coma-conector`,
   `coma-criminal` (si una mala mete la coma entre sujeto y verbo), `punto-dentro-parentesis`, `sin-coma-etc`.
4. **Ejercicio 3, dos puntos, puntos suspensivos y el saludo** (banco `DOS_PUNTOS`): nivel 1, el saludo de carta y correo
   con la coma del vocativo y **dos puntos** («Hola, Juan Luis:» ✓; «Hola Juan Luis,» ✗ con dos motivos; «Hola, Juan
   Luis,» ✗: la coma tras el saludo es un anglicismo; «Hola, Juan Luis;» ✗) y la mayúscula en la línea siguiente; nivel 2,
   los dos puntos antes de una enumeración anunciada («Necesitas tres cosas: regla, compás y lápiz») y antes de una cita
   («Dijo: «Mañana no hay clase»»), los puntos suspensivos (**tres** puntos exactos, pegados a la palabra, y mayúscula
   después si cierran la frase; nunca «etc.» seguido de puntos suspensivos); nivel 3, el punto y coma en enumeraciones con
   comas dentro («Juan, el portero; Ana, la capitana, y Luis, el entrenador») y delante de «sin embargo», «no obstante», «por
   tanto» en frases largas (solo donde la coma sería claramente insuficiente: si vale la coma, la frase no sirve), la raya
   de diálogo (—, pegada a la primera palabra, y el inciso del narrador: «—Hola —dijo Ana.»; las malas, con guion corto o
   con espacios mal), la coma y el punto **fuera** de las comillas («“Mañana no hay clase”, dijo.» ✓). **Las comillas
   inglesas y las latinas valen las dos**: nunca son el único cambio entre la buena y una mala. `idError`:
   `coma-tras-saludo`, `sin-dos-puntos-saludo`, `sin-coma-vocativo-saludo`, `minuscula-tras-saludo`, `sin-dos-puntos-lista`,
   `puntos-suspensivos-mal`, `etc-con-puntos-suspensivos`, `guion-por-raya`, `espacio-tras-raya`, `coma-dentro-comillas`,
   `coma-por-punto-y-coma`.
5. **Ejercicio 4, el correo al profesor** (bancos `CORREOS` y `ASUNTO_CUERPO`): nivel 1, las abreviaturas del chat (k, q, xq,
   tb, x por «por», «porfa», «wapo») y la falta de ¿ ¡ y de mayúscula inicial, en mensajes de una o dos líneas: la buena, en
   español completo; nivel 2, tildes, mayúsculas, signos y comas en mensajes de dos o tres líneas con saludo, pregunta y
   «Gracias»; nivel 3, estructura y registro: saludo con dos puntos («Hola, Juan Luis:» / «Buenos días:»), cuerpo, despedida
   con coma y nombre en línea aparte («Un saludo,» / «Gracias,» + nombre), y los ítems **asunto / cuerpo** (dos botones): «Tarea
   de la semana 3» → asunto; «Hola, no puedo entregar la tarea porque…» → cuerpo; «Duda del ejercicio 4» → asunto; «¿Puede
   decirme la nota del examen?» → cuerpo; ≥ 12 ítems, mitad y mitad. Las tres versiones de un correo tienen las mismas
   palabras salvo las abreviaturas deshechas y los cambios de ortografía (el test compara sin tildes, mayúsculas ni signos,
   con las abreviaturas sustituidas por su tabla). `idError`: `abreviatura-de-chat`, `sin-mayuscula-inicial`,
   `sin-signo-apertura`, `sin-tilde-correo`, `sin-saludo-dos-puntos`, `despedida-sin-coma`, `asunto-por-cuerpo`,
   `cuerpo-por-asunto`.
6. **`practica.js` y `textos.js`**: como la 135 y la 136 (nombre/detalle `{ es, en }`, introducción con la regla y un
   ejemplo, `generar` con `elegirDeNivel`, `etiquetaNivel`, feedback con el motivo de la mala elegida y la buena a la vista).
   En el ejercicio 1, al comprobar, la frase corregida con las palabras cambiadas en `<b>`.
7. **Test**: (a) mayúsculas: `texto` y `correcto` difieren solo en mayúsculas/minúsculas, en 1-3 palabras, y ≥ 25 % de las
   frases por nivel tienen una mayúscula de más; ninguna frase con las palabras de la lista negra de contexto (Sol, Luna,
   Tierra, Internet, Ayuntamiento, Estado, Iglesia, Mar Menor, matemáticas como ciencia); (b) ejercicios 2-4: las malas son
   la buena con cambios solo de signos, espacios, mayúsculas o abreviaturas (letras iguales tras normalizar), cada mala con
   su motivo (> 20 caracteres), ≥ 1 y ≤ 2 malas; ninguna mala cuyo único cambio sea comillas inglesas por latinas, o una coma
   por un punto y coma en frase corta, o un espacio delante de % o €; (c) ≥ 16 ítems por nivel y ejercicio (≥ 12 en el 1 y
   en asunto/cuerpo), sin repetidos; (d) equilibrio: en el 1, la posición de la palabra mal reparte; en 2-4, la buena
   barajada (el generador baraja y el test lo comprueba: la buena no está siempre primera); (e) nunca por encima del nivel;
   (f) `idError` con el patrón; (g) ningún nombre de alumno real (el test común lo mira; aquí, además, los nombres de los
   saludos están en una lista corta de inventados).

## Datos de entrada

- `$R/salidas/134-base-ortografia/ENTREGA.md`, `docs/practicas-ortografia.md`, `practicas/_comun/nivel.js`, `practicas/_comun/ortografia.js` (solo lectura).
- `practicas/ortografia/comas.js`, `signos.js`, `sujeto.js` y `tests/practicas-ortografia.test.js` (solo lectura: la forma de
  «la buena con un cambio» y sus tests).
- La infografía del asunto y el cuerpo que Juan Luis manda a quien escribe el correo entero en el asunto:
  `docs/infografias/asunto-y-cuerpo/` (solo lectura; su texto es el criterio de los ítems asunto/cuerpo).
- Para dudas: `dle.rae.es`, `rae.es/dpd/`, `fundeu.es` (solo lectura).

## Cómo saber que ha terminado

- `node --test tests/practicas-comun.test.js tests/practicas-ortografia-puntuacion.test.js` en verde y `npm test` sin fallos en tus ficheros.
- En local, los cuatro ejercicios en los tres niveles (`?nivel=`), a 375 px y en ancha (los correos de tres líneas caben sin
  partir palabras); un ítem acertado y uno fallado en cada uno.
- Los recuentos por nivel en la ENTREGA.

## Trampas conocidas

- «Mar Menor» lleva mayúscula en «Mar» (el genérico es parte del nombre); el resto de los genéricos geográficos, en
  minúscula (río Segura, mar Mediterráneo). No metas «Mar Menor» en ningún ítem.
- Sol/sol, Luna/luna, Tierra/tierra, Internet/internet, Ayuntamiento/ayuntamiento, Estado/estado, Iglesia/iglesia dependen
  del sentido: fuera. «Las matemáticas» (la ciencia) va en minúscula y «Matemáticas» (la asignatura) en mayúscula: solo
  contextos inequívocos de asignatura.
- La coma tras el saludo («Hola, Marta,») es anglicismo: en español, dos puntos. La coma del vocativo («Hola, Marta:») sí va.
- Las comillas inglesas “ ” no son un error frente a las latinas « »: nunca son el único cambio de una mala.
- Coma frente a punto y coma: en frases cortas la coma vale; el punto y coma solo se exige donde la coma sería claramente
  insuficiente (enumeraciones con comas dentro). Si dudas, la frase no sirve.
- Los puntos suspensivos son un carácter (…) o tres puntos (...): acepta los dos en la buena y usa la misma forma en las malas.
- «etc.» nunca va seguido de puntos suspensivos ni duplicado («etc., etc.» sí existe pero no lo uses).
- `\n` en los correos: el `montar` los pinta como saltos de línea (`white-space: pre-line` en la opción), no como texto.
- Los nombres de los saludos, inventados (Marta, Lucía, Pablo, Marcos) o el del profesor (Juan Luis): nada de alumnos.
- Duración real de una práctica numérica de 4 ejercicios en la U4: 11-30 min; esta tiene bancos de prosa: cuenta con más.
  **Real (6-11): ~35 min** con los bancos escritos de una vez.
- Hecho por las malas: la frase corregida ya acaba en punto; al añadirle otro en la explicación salía «Murcia..».
- El navegador guarda los módulos ES: tras cambiar `logica.js`, `fetch(url, {cache:'reload'})` de cada módulo y recargar.
- Tras acertar, la base avanza sola; «Siguiente» solo sale tras un fallo (hay que esperar a que se active).

## Prohibido (propio de esta tarea)

- Tocar `practicas/ortografia/*`, `practicas/_comun/*`, `catalogo.js`, `portada.js`, `tareas.js` o los docs. `disponible: true` lo pone la 140.
- Repetir lo que ya hace `ortografia` (vocativo, comas de significado, ¿? ¡! y espacios, sujeto-verbo) como ejercicio o como ítem.
- Una mala cuyo único cambio sea una recomendación de la RAE y no una regla (comillas, espacio antes de %, 1.º / 1º).
- Cambiar el número de ejercicios (4) o su orden.

## Salida esperada

- `practicas/ortografia-puntuacion/*` y `tests/practicas-ortografia-puntuacion.test.js` comiteados, con `npm test` sin fallos en tus ficheros.
- `reparto-practicas-u2/salidas/137-ortografia-puntuacion/ENTREGA.md` (hash, ficheros, los cuatro ejercicios con sus ítems por
  nivel, lo descartado y por qué, cómo probarlo en 1 minuto) y su marcador `ENTREGA.md.ok-<sid>`.

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
el mensaje «Tarea 137, a medias», escribe `$R/hechos/notas/<sid>-traspaso-137.md` con el
estado exacto (qué está hecho, qué falta, qué has descubierto, en qué orden seguir),
`$R/hechos/fallos/137--<sid>.md` con `parada por: sesión agotada` y la ruta de esa nota, y
`ABANDONADA` en tu reclamo. **Esta tarea es larga a propósito y está pensada para que una
sesión pueda parar entre dos ejercicios**: cada ejercicio es un módulo propio y la
siguiente sesión sigue por el primero que falte.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/137--<sid>.md` con `parada por: mal cortada`
y la ruta de la incidencia, `ABANDONADA` en tu reclamo, y díselo al usuario. Si un paso te
pide **decidir** algo que va a durar (un cambio del contrato de la base, otro número de
ejercicios que el del catálogo, otros umbrales de nivel para todas las prácticas) y esta
tarea no es de banda ALTA con el usuario delante, no lo decidas: entrégalo como propuesta en
tu terminada y sigue con lo que no dependa de ello.

## Al terminar

Por este orden (el del repositorio git):

1. `node --test tests/practicas-comun.test.js tests/practicas-ortografia-puntuacion.test.js` en verde y `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con
   reclamo vivo no es tuyo: anótalo en la terminada). Prueba la práctica en el navegador con `npm run servir` y
   http://localhost:8080/practicas/ortografia-puntuacion/ (los módulos ES no cargan abriendo el fichero), con «Probar
   sin código» (nunca el código de un alumno ni AJJN), en una ventana estrecha (375 px) y en una ancha,
   y haz al menos un ítem de **cada ejercicio y de cada nivel** acertando y fallando (`?nivel=3` fuerza
   el nivel en «Probar sin código», tarea 134). La práctica no sale en la portada (está con
   `disponible: false` hasta su tarea de publicación): se entra por la URL.
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas:
   `git add <rutas> && git commit -m "Práctica ortografia-puntuacion: mayúsculas, punto y coma, dos puntos y saludo, el correo al profesor" -- <rutas>`. Apunta el hash
   (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/137-ortografia-puntuacion/ENTREGA.md` (ficheros entregados, hash, URL local, qué hay en cada
   ejercicio y nivel, decisiones y propuestas, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/137--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/137--<sid>.md` con hasta dónde llegaste, la línea
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
