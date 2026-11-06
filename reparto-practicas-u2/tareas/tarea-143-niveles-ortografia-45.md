# Tarea 143 · Niveles adaptables en los 11 ejercicios de «Ortografía: lo más frecuente» (`ortografia`, id 45), sin cambiar ningún ítem aprobado

Actualizado: 2026-11-03 (alta de la coordinadora s-20261103T110729-ca61fe3e)
Precondición: **134 LISTA** (`_comun/nivel.js` y su contrato) · Disparo: MANUAL (sesión atendida) · **Sin plazo** (mejor antes del lun 1-2, cuando los ejercicios 10 y 11 son ★ en la U6, pero no hace falta: los ejercicios siguen funcionando igual sin esto). Es la última en prioridad de la ortografía
Duración esperada: 1 h (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/143-niveles-ortografia-45/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/ortografia/logica.js`, `comas.js`, `tildes.js`, `signos.js`, `sujeto.js`, `practica.js`, `textos.js` (solo lo que diga «Qué hay que hacer») y `tests/practicas-ortografia.test.js`

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
   printf 'sesión: %s\ntarea: 143\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/143--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/143--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 143 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/143--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Que los 11 ejercicios que ya existen (y que Juan Luis aprobó entre el 23 y el 25-10) también se adapten al alumno como los
bloques nuevos: los ítems fáciles primero y los difíciles para quien va bien, con `nivelDe` y `elegirDeNivel` de
`practicas/_comun/nivel.js`. **Ningún ítem aprobado se quita ni se reescribe**; solo se le pone `nivel` a cada uno y se
añaden, donde un nivel quede corto, ítems nuevos con las mismas reglas de siempre (las de la cabecera de cada fichero).
Estos ejercicios son ★ de tareas semanales desde el 16-11 (U3 a U6): cambiar el orden en que salen los ítems no cambia lo
que se evalúa, pero el ejercicio tiene que seguir llamándose igual, en la misma posición y con los mismos `idError`.

## Siguiente paso

1. Lee la ENTREGA de la 134 (el contrato de `nivel.js`), `practicas/_comun/nivel.js` y su test, y los siete ficheros de
   `practicas/ortografia/` con `tests/practicas-ortografia.test.js` entero (es largo: dice qué comprueba de cada banco, y
   todo eso tiene que seguir en verde).
2. `node --test tests/practicas-comun.test.js tests/practicas-ortografia.test.js` antes de tocar nada.

## Qué hay que hacer

1. **Etiquetar** cada ítem de cada banco con su `nivel` (1, 2 o 3) **sin cambiar su texto ni su respuesta**. Como los bancos son
   listas de arrays (`['frase', 'buena']`), añade el nivel como tercer (o siguiente) elemento o pasa a objetos manteniendo
   `partes`, `frase`, etc.; lo que sea más limpio sin tocar las funciones públicas que usa el test. Criterios por ejercicio:
   - 1 a/ha: nivel 1, «ha» + participio regular (-ado/-ido) y «a» + lugar o persona («voy a casa», «a mi hermana»); nivel 2,
     participios irregulares («ha hecho», «ha roto») y «a» + infinitivo o hora («vamos a jugar», «a las ocho»); nivel 3,
     «¿quién ha…», «se ha…», «se me ha…» y los pronombres entre medias.
   - 2 e/he: nivel 1, «e» ante i- de nombres comunes y «he» + participio regular; nivel 2, «e» ante hi- («padres e hijos») y
     «he» + irregular; nivel 3, «e» que une dos verbos («llegué a casa e hice…») y «he» tras adverbio («nunca he…», «ya he…»).
   - 3 echo/hecho: nivel 1, «he/has/ha hecho» y «yo echo» + cosa; nivel 2, «está hecho», «bien hecho», «echo de menos»; nivel
     3, «un hecho», «de hecho», «echo a correr», «echo un vistazo», «echo una mano».
   - 4 ¿está bien escrita?: el nivel del ítem es el de la frase que mezcla (hereda de 1-3).
   - 5 porque/por qué: nivel 1, pregunta directa con ¿ y causa clara; nivel 2, «porque» dentro de una pregunta («¿Lloras
     porque…?»); nivel 3, indirectas sin ¿ («Dime por qué…», «Me pregunto por qué…»).
   - 6 vocativo y 7 comas de significado: en el 6, nivel 1, vocativo al principio; 2, al final; 3, en medio y los pares de
     significado; en el 7, nivel 1-2 por longitud de la frase y 3 los pares con contexto.
   - 8 y 9 tildes: nivel 1, hueco con ¿ o ¡ a la vista; nivel 2, hueco sin signos (indirectas, «no sé qué», «sí/si»); nivel 3,
     los pares «¿qué frase dice esto?» y las preguntas de sí o no (ya existen con `tipo`).
   - 10 signos y 11 sujeto: nivel por número de fallos de la mala y por longitud (1, un fallo evidente; 2, dos fallos o
     frase larga; 3, el inciso con las dos comas en el 11).
   Si un nivel se queda con menos de 8 ítems en un ejercicio, **añade** frases nuevas de ese nivel con las reglas de la
   cabecera del fichero (ninguna con «había» en 1-2, nada de «a ver»/«haber», «e» solo ante i-/hi- + consonante…), hasta 8
   como mínimo; los mínimos de la regla 3 (16 por nivel) no se exigen aquí porque los bancos aprobados son como son.
2. **Generadores**: los que devuelven `rng => …` pasan a `(rng, sesion) => …` y eligen con `elegirDeNivel` (la base ya pasa
   `sesion`); el ejercicio 4 hereda el nivel de la frase; los de `tipo` (pares, preguntas, escrita/significado) mantienen sus
   proporciones **dentro** del nivel donde estén. `practica.js` pinta `etiquetaNivel` en cada ítem (una línea en los `montar`
   existentes o en el `enunciado`). **Nada más cambia en `practica.js`**: ni nombres, ni orden, ni `clave`, ni `idError`.
3. **`textos.js`**: la frase de introducción puede añadir «Empieza fácil y sube de nivel si aciertas», si cabe en una línea;
   nada más.
4. **Test**: todo lo de `tests/practicas-ortografia.test.js` sigue en verde **sin tocar sus aserciones** (si una falla porque
   cambiaste la forma del banco, adapta el acceso, no la comprobación); y añade: cada ítem tiene `nivel` 1-3; ≥ 8 por nivel y
   ejercicio; por fuerza bruta con `sesion` simulada, nunca por encima del nivel y las proporciones de los `tipo` se
   mantienen dentro de cada nivel; las frases nuevas cumplen las mismas reglas de forma que las viejas (los tests existentes
   las recorren todas).
5. **Antes del commit**, el `diff` de los bancos: solo añadidos y el campo `nivel`; ninguna frase aprobada cambiada ni quitada
   (`git diff -- practicas/ortografia/ | grep '^-' | grep -v '^---'` no debe mostrar ninguna frase borrada; lo dices en la terminada).

## Datos de entrada

- `$R/salidas/134-base-ortografia/ENTREGA.md`, `practicas/_comun/nivel.js` y `tests/practicas-nivel.test.js` (solo lectura).
- La memoria de Juan Luis de los errores apuntados (sus pares de tildes del 25-10 y el criterio «si las dos formas son
  correctas con distinto sentido, nunca como hueco»): está resumida en las cabeceras de `tildes.js` y `logica.js`.
- `docs/practicas-ortografia.md` §2 y §3.

## Cómo saber que ha terminado

- `node --test tests/practicas-comun.test.js tests/practicas-ortografia.test.js` en verde (las aserciones antiguas intactas) y `npm test` sin fallos en tus ficheros.
- En local, los 11 ejercicios con `?nivel=1|2|3`; la etiqueta de nivel se ve; un ítem acertado y uno fallado en cada uno.
- La ENTREGA lleva la tabla de ítems por nivel y ejercicio (viejos y añadidos) y la confirmación del `diff` (nada quitado ni cambiado).

## Trampas conocidas

- Estos ejercicios están en uso como ★ (U3 desde el 16-11): un cambio que rompa `clave` o `idError` cambia el registro de
  fallos del panel y la detección de ítems repetidos. No se tocan.
- `generarRevision` (ejercicio 4) elige pareja y frase: el nivel es el de la frase elegida; con `elegirDeNivel` sobre la unión
  de las tres parejas se mantiene la mezcla, pero el test «el ejercicio 4 sigue mezclando solo las tres primeras parejas» tiene
  que seguir pasando.
- Los `tipo` del 8 y el 9 (`hueco`, `par`, `pregunta`) tienen proporciones comprobadas por el test (la mitad huecos, etc.):
  mantenlas dentro de cada nivel o el test antiguo falla.
- La cabecera de cada fichero lleva las reglas de las frases (sin «había», sin «a ver», «e» solo ante i-/hi- + consonante,
  el hueco nunca al principio…): las frases nuevas las cumplen y el test antiguo las recorre.

- (Aprendido en la ejecución, 2026-11-06) Los tests antiguos llaman `generar(rng)` sin `sesion`: `elegirNivel` (en `logica.js`) trata eso como «sin nivel» y da cualquier ítem. Con `sesion`, los pares y las preguntas de sí o no (8 y 9) son de nivel 3 y solo salen en el 3. Un ítem nuevo va al FINAL de su lista (la clave es la posición). Las tareas 135-139 pueden reutilizar `elegirNivel`.

## Prohibido (propio de esta tarea)

- Quitar o reescribir una frase aprobada; cambiar nombres, orden, `clave` o `idError` de los ejercicios; tocar `practicas/_comun/*`.
- Cambiar una aserción del test antiguo para que pase.
- Añadir ejercicios a `ortografia` (los nuevos van a los bloques).

## Salida esperada

- Los ficheros de «Ficheros que toca» comiteados, con `npm test` sin fallos en tus ficheros.
- `reparto-practicas-u2/salidas/143-niveles-ortografia-45/ENTREGA.md` (hash, ficheros, ítems por nivel y ejercicio, frases añadidas,
  confirmación del diff, cómo probarlo en 1 minuto) y su marcador `ENTREGA.md.ok-<sid>`.

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
el mensaje «Tarea 143, a medias», escribe `$R/hechos/notas/<sid>-traspaso-143.md` con el
estado exacto (qué está hecho, qué falta, qué has descubierto, en qué orden seguir),
`$R/hechos/fallos/143--<sid>.md` con `parada por: sesión agotada` y la ruta de esa nota, y
`ABANDONADA` en tu reclamo. **Esta tarea es larga a propósito y está pensada para que una
sesión pueda parar entre dos ejercicios**: cada ejercicio es un módulo propio y la
siguiente sesión sigue por el primero que falte.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/143--<sid>.md` con `parada por: mal cortada`
y la ruta de la incidencia, `ABANDONADA` en tu reclamo, y díselo al usuario. Si un paso te
pide **decidir** algo que va a durar (un cambio del contrato de la base, otro número de
ejercicios que el del catálogo, otros umbrales de nivel para todas las prácticas) y esta
tarea no es de banda ALTA con el usuario delante, no lo decidas: entrégalo como propuesta en
tu terminada y sigue con lo que no dependa de ello.

## Al terminar

Por este orden (el del repositorio git):

1. `node --test tests/practicas-comun.test.js tests/practicas-ortografia.test.js` en verde y `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con
   reclamo vivo no es tuyo: anótalo en la terminada). Prueba la práctica en el navegador con `npm run servir` y http://localhost:8080/practicas/ortografia/, con «Probar sin
   código», en los tres niveles (`?nivel=`), a 375 px y en ancha, y haz al menos un ítem de cada ejercicio acertando y fallando.
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas:
   `git add <rutas> && git commit -m "Práctica ortografia: niveles adaptables en los 11 ejercicios, sin cambiar los ítems aprobados" -- <rutas>`. Apunta el hash
   (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/143-niveles-ortografia-45/ENTREGA.md` (ficheros entregados, hash, URL local, qué hay en cada
   ejercicio y nivel, decisiones y propuestas, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/143--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/143--<sid>.md` con hasta dónde llegaste, la línea
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
