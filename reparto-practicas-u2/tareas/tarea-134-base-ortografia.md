# Tarea 134 · Base de la ortografía en bloques: sección «Ortografía» en la portada, cinco bloques nuevos en el catálogo, niveles adaptables (`_comun/nivel.js`) y piezas comunes (`_comun/ortografia.js`)

Actualizado: 2026-11-03 (alta de la coordinadora s-20261103T110729-ca61fe3e)
Precondición: ninguna · **no en paralelo con la 122, la 130, la 131 ni ninguna otra que toque `catalogo.js`, `portada.js`, `vista-tareas.js` o `tests/practicas-comun.test.js`** (mira los reclamos vivos) · Disparo: MANUAL (sesión atendida) · **Plazo: mar 1-12** (ideal: cuanto antes, para que los bloques se escriban antes de Navidad; el primer ★ de un bloque nuevo es el lun 15-2 y su publicación, la 140, el jue 11-2)
Duración esperada: 2 h (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/134-base-ortografia/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/catalogo.js` (cinco filas nuevas, el campo `seccion` y el `nombre` de la 45), `practicas/_comun/nivel.js` (nuevo), `practicas/_comun/ortografia.js` (nuevo), `practicas/portada.js` y `practicas/vista-tareas.js` (la sección «Ortografía»), `practicas/profesor-tareas.js` solo si el editor lo necesita, `practicas/ortografia-tildes/`, `practicas/ortografia-letras/`, `practicas/ortografia-puntuacion/`, `practicas/ortografia-palabras/` y `practicas/ortografia-ampliacion/` (esqueletos: `index.html`, `estilos.css`, `practica.js`, `logica.js`, `textos.js`), `tests/practicas-comun.test.js` (la lista fija del catálogo), `tests/practicas-nivel.test.js` (nuevo), `tests/practicas-ortografia-comun.test.js` (nuevo), `tests/practicas-portada-unidades.test.js` y `tests/practicas-editor.test.js` solo si la sección nueva los rompe, `docs/practicas-ortografia.md` (nuevo) y una línea en `README.md`

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
   printf 'sesión: %s\ntarea: 134\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/134--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/134--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 134 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/134--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Que la ortografía deje de ser una práctica de 11 ejercicios en un bloque «Otras» de la unidad 3 y pase a ser una
**sección propia de la portada, «Ortografía»**, con seis prácticas («bloques»): la actual `ortografia` (id 45, que no se
toca y pasa a llamarse «Ortografía: lo más frecuente») y cinco nuevas, vacías todavía, que escriben las tareas 135-139:

| id | slug | nombre `es` | nombre `en` | nEjercicios |
|---|---|---|---|---|
| 64 | `ortografia-tildes` | Ortografía: las tildes | Spanish spelling: accents | 4 |
| 65 | `ortografia-letras` | Ortografía: las letras | Spanish spelling: letters | 4 |
| 66 | `ortografia-puntuacion` | Ortografía: puntuación y mayúsculas | Spanish spelling: punctuation and capitals | 4 |
| 67 | `ortografia-palabras` | Ortografía: palabras que se confunden | Spanish spelling: confusable words | 3 |
| 68 | `ortografia-ampliacion` | Ortografía: ampliación | Spanish spelling: going further | 4 |

Los ids 57-63 están reservados para la unidad 5 (tarea 122): no se usan aquí.

Y que exista lo que los cinco bloques necesitan para no repetirlo cinco veces: **los niveles adaptables** (un ejercicio
elige sus ítems según cómo vaya el alumno: `practicas/_comun/nivel.js`) y **las piezas de interfaz de la ortografía**
(rellenar un hueco, elegir la frase bien escrita, tocar sílabas o palabras: `practicas/_comun/ortografia.js`).

Por qué bloques separados y no una práctica de 30 ejercicios (decisión del 3-11, `proyecto.md`, «Tareas 134-143»): el
progreso se guarda por posición y las tareas semanales citan `['ortografia', n]`, así que en una práctica un ejercicio nuevo
solo puede ir al final; con bloques, cada bloque se ordena de más fácil a más difícil, un ejercicio nuevo entra en el bloque
que le toca, el menú de cada bloque es corto y las tareas 135-139 tocan carpetas disjuntas (caben a la vez).

Por qué los niveles van por puntos y vidas, sin estado nuevo (decisión técnica del 3-11, explicada a Juan Luis): el contador
ya mide cómo va el alumno. Con 0-2 puntos, nivel 1; con 3-6, nivel 2; con 7 o más, nivel 3. Y un tope por vidas: con 4 o 5
vidas no hay tope; con 3, como mucho nivel 2; con 2 o menos, nivel 1. Así quien falla no sube (no se desespera) y quien va
bien ve los tres últimos ítems de nivel 3, que es «más allá de 1.º ESO». El nivel 3 lo alcanza quien llega a 7 puntos habiendo
fallado una vez como mucho. Los umbrales son constantes en `nivel.js` con su porqué al lado.

## Siguiente paso

1. Lee entero `practicas/plantilla/practica.js` (el contrato de `arrancar` y de la `api`; fíjate en que `generar` ya recibe
   `sesion = { aciertos, fallos, puntos, vidas, anterior, idioma }`: **la base no se toca**), `practicas/_comun/base.js`
   (cómo valida los ejercicios y cómo llama a `generar`), `practicas/_comun/contador.js` (`OBJETIVO`, `VIDAS`),
   `practicas/_comun/catalogo.js` (el comentario de `transversal`, `UNIDADES`), `practicas/portada.js` (`BLOQUES`, `OTRAS`,
   `bloquesPublicados`, cómo pinta una sección), `practicas/vista-tareas.js` (`seccionesPorUnidad`, `esRepasoDeOtraUnidad`),
   `practicas/profesor-tareas.js` (`practicasDeUnidad`, línea ~93: ya lista las transversales al final) y
   `practicas/ortografia/practica.js` (los `montar` que vas a generalizar: `montarHueco`, `montarRevision`, `montarEscrita`).
2. `npm test` antes de tocar nada, para saber qué está en verde (el 2-11 eran 1368/1368).
3. Lee la sección «Tareas 134-143» de `$R/proyecto.md` entera: las decisiones, el inventario de aspectos, el plan de ★ y
   la lista «Lo que nunca es distractor» son lo que `docs/practicas-ortografia.md` tiene que recoger.

## Qué hay que hacer

1. **Catálogo.** Las cinco filas de la tabla del Objetivo, todas con `unidad: 3, transversal: true, seccion: 'ortografia',
   disponible: false` y su `ruta`. En la fila 45, `seccion: 'ortografia'` y el nombre nuevo (`{ es: 'Ortografía: lo más
   frecuente', en: 'Spanish spelling: the most frequent slips' }`); **slug, id, orden y `nEjercicios: 11` de la 45 no cambian**
   (las tareas de la U3 a la U6 la citan por slug y posición). Comenta qué es `seccion`. Actualiza la lista fija de
   `tests/practicas-comun.test.js` («catálogo: los ids y los slugs fijados por el reparto») con las cinco filas.
2. **La sección «Ortografía» de la portada.** Las prácticas con `seccion: 'ortografia'` dejan de salir en la sección de su
   unidad (hoy la 45 cae en «Otras» de la U3) y salen en una sección propia, plegable, titulada `{ es: 'Ortografía', en:
   'Spanish spelling' }`, **debajo de la unidad actual y encima de las unidades anteriores**, cerrada por defecto (el alumno
   llega a los ejercicios por la tarea semanal; la sección es para quien quiera practicar por su cuenta), que recuerde si el
   alumno la abrió como hacen las unidades (`recordarUnidad`). Dentro, las prácticas publicadas de la sección en el orden del
   catálogo (la 45 primero), con el mismo aspecto que una práctica de unidad (progreso incluido). Las tareas semanales no
   cambian: `esRepasoDeOtraUnidad` sigue valiendo (transversal), y el editor (`practicasDeUnidad`) sigue listando las
   transversales al final; si al probarlo el editor las enseña sin separar, un subtítulo «Ortografía» en su lista es
   bienvenido, pero no obligatorio. Si `tests/practicas-portada-unidades.test.js` o `tests/practicas-editor.test.js` cuentan
   secciones o prácticas por unidad, ajústalos (es la lección de la 98: los tests que cuentan unidades).
3. **`practicas/_comun/nivel.js`** (puro, sin DOM):
   - `export const NIVELES = 3;`
   - `nivelDe(sesion, { objetivo = OBJETIVO } = {})`: por puntos, `< 30 %` del objetivo → 1, `< 70 %` → 2, si no → 3; tope
     por vidas: `vidas >= 4` sin tope, `vidas === 3` → máximo 2, `vidas <= 2` → máximo 1. Con `sesion` vacía o sin campos,
     nivel 1. Con `OBJETIVO = 10`: 0-2 → 1, 3-6 → 2, 7-10 → 3.
   - `nivelForzado(busqueda = location.search, hayCodigo)`: devuelve 1-3 si la URL lleva `?nivel=N` **y no hay código de
     alumno** (modo «Probar sin código»); si no, `null`. Sirve para revisar (tareas 140-142) y para que Juan Luis enseñe un
     nivel en clase. `nivelDe` lo respeta si se le pasa (`nivelDe(sesion, { forzado })`). Cómo saber en `generar` si hay
     código: documenta la forma que uses (la base guarda el código en `estado.codigo`; si hace falta exponerlo en `sesion`,
     eso sería tocar la base: entonces **no** lo hagas y deja `nivelForzado` solo con la URL, anotándolo como propuesta).
   - `elegirDeNivel(rng, banco, sesion, { nivelDe: item => item.nivel, forzado } = {})`: devuelve un ítem del banco: con
     probabilidad 0,7 uno del nivel actual y 0,3 uno de un nivel inferior (si hay); **nunca** uno de nivel superior; si el nivel
     actual no tiene ítems, baja al más alto que los tenga. Devuelve también el `nivel` elegido (`{ item, nivel }`) para que el
     ejercicio lo pinte.
   - `etiquetaNivel(nivel, esc)`: HTML pequeño («Nivel 2 · ●●○») para la esquina del ítem; y `TX_NIVEL` con el texto de
     «¡Subes al nivel 3!» por si un ejercicio quiere decirlo en el feedback.
   - Test `tests/practicas-nivel.test.js`: los umbrales uno a uno (puntos 0, 2, 3, 6, 7, 10; vidas 5, 4, 3, 2, 1, 0; objetivo
     distinto de 10), `elegirDeNivel` por fuerza bruta (10 000 tiradas por nivel: nunca por encima, 60-80 % del nivel actual
     cuando hay inferiores, 100 % cuando no; nivel vacío → baja), `nivelForzado` con y sin código y con valores raros
     (`?nivel=7`, `?nivel=abc`), `etiquetaNivel` escapa.
4. **`practicas/_comun/ortografia.js`** (los `montar` de la ortografía, generalizados de `practicas/ortografia/practica.js`,
   que **no se modifica**; en el `_comun` solo lo que necesita DOM va aquí, y lo puro se exporta aparte para probarlo):
   - `montarHueco(contenedor, api, { antes, despues, opciones, buena, explicacion, idError, respuestaDe, espera = 2600,
     instruccion = TXO.hueco })`: la frase con el hueco, los botones (clase `si-no` si son dos, `elecciones` si son más),
     la buena en verde en el hueco al responder, `api.responder` con `error`/`respuesta` al fallar.
   - `montarElegir(contenedor, api, { instruccion, contexto, opciones: [{ k, texto }], buena, explicacion(k), idError(k),
     espera = 3500 })`: «¿Cuál está bien escrita?» o «¿Qué frase dice esto?»; opciones ya barajadas por el generador.
   - `montarTocar(contenedor, api, { instruccion, piezas: [texto], buenas: [índices], multiple = false, ninguna = null,
     explicacion, idError, espera })`: las piezas (sílabas, palabras, letras) como botones; con `multiple: false`, una
     pulsación responde; con `multiple: true`, se conmutan y hay botón «Comprobar» (correcto solo si el conjunto coincide);
     `ninguna` añade un botón «Ninguna» (para «¿dónde va la tilde?»). Al responder, las piezas buenas en verde y las elegidas
     mal en rojo (`claseCorreccion` de `piezas.js`).
   - `montarDosPasos(contenedor, api, { paso1: {…tocar}, paso2: {…elegir}, … })`: el patrón de la U3 (si falla el primero,
     el ítem termina con su explicación); lo usa «La sílaba tónica» de la 135.
   - `TXO`: textos comunes en español («¿Qué palabra va en el hueco?», «¿Cuál está bien escrita?», «Toca…», «Comprobar»,
     «Ninguna», «Está bien», «Está mal»), y `slug(texto)` (copiado de `practicas/ortografia/logica.js`) para los `idError`.
   - Lo puro (`barajarOpciones`, `conjuntoIgual`, `slug`, los textos) con test `tests/practicas-ortografia-comun.test.js`;
     los `montar` se prueban con clics en el paso 8 sobre un esqueleto (un ejercicio de demostración temporal que no se
     commitea, o el ejercicio de prueba de la plantilla).
5. **Esqueletos** de los cinco bloques, copiados de `practicas/ortografia/` (`index.html` con su título, letra del icono y
   `lang="es"`; `estilos.css` con un comentario; `textos.js` con `TX` vacío; `logica.js` vacío con la cabecera que diga qué
   va ahí): `practica.js` con `arrancar({ slug, idioma: 'es', ejercicios: [N × enConstruccion()] })`, donde
   `enConstruccion()` devuelve un ejercicio válido para `validarPractica` (`nombre: { es: 'En construcción', en: 'Under
   construction' }`, `detalle`, `generar: () => ({ n: 0 })`, `montar` que pinta «Este ejercicio todavía no está: lo escribe la
   tarea NNN del reparto»). N = los `nEjercicios` de la tabla. Cada esqueleto carga sin error en el navegador.
6. **`docs/practicas-ortografia.md`** (nuevo; modelo `docs/practicas-unidad4.md`): §1 qué es la sección (seis bloques, ids,
   slugs, por qué bloques); §2 los niveles (umbrales, tope por vidas, `?nivel=`, por qué así); §3 el contrato para escribir
   un ejercicio de ortografía (banco con `nivel` en cada ítem, `generar` con `elegirDeNivel`, `montar` con las piezas de
   `_comun/ortografia.js`, `idError` estable por confusión, tests mínimos: forma, niveles, equilibrio, nunca por encima del
   nivel, lista negra); §4 el inventario de la ortografía de 1.º ESO y dónde se trabaja cada aspecto (la tabla de
   `proyecto.md`, «Tareas 134-143»); §5 el plan de ★ semanales propuesto (la tabla de `proyecto.md`; **propuesta**: la fecha
   la fija cada unidad); §6 «Lo que nunca es distractor» (la lista de `proyecto.md`); §7 «Qué hay publicado» (vacío: lo
   rellenan 140-142). Y una línea en el índice de prácticas de `README.md` que apunte al doc.
7. `npm test` en verde (tests nuevos y los que hayas tenido que ajustar).
8. En el navegador (`npm run servir`): la portada enseña la sección «Ortografía» con la 45 dentro (es el único cambio
   visible para el alumno: la 45 deja «Otras» de la U3), plegada, a 375 px y en ancha, en español y en inglés; los cinco
   esqueletos cargan por URL y dicen «En construcción»; una tarea semanal con `['ortografia', n]` (la 16 de la U3, por
   ejemplo; o una de prueba en `tareas.js` local que no se commitea) sigue funcionando; el editor del panel sigue listando la
   45 al final (`profesor.html` en local sin iniciar sesión enseña al menos la lista). Recarga forzada (cmd+shift+R): los
   módulos ES se cachean.
9. **ENTREGA**: hash, ficheros, las decisiones que hayas tomado donde la ficha dejaba margen (dónde exactamente va la
   sección, cómo sabe `nivelForzado` si hay código, nombres definitivos de las funciones), **el contrato en una página** para
   que las tareas 135-139 lo lean sin abrir el código, y lo que propones y no has hecho.

## Datos de entrada

- `practicas/ortografia/*` (solo lectura: el modelo de los `montar` y de los textos; **no se modifica**).
- `practicas/plantilla/*`, `practicas/_comun/*`, `practicas/portada.js`, `practicas/vista-tareas.js`, `practicas/profesor-tareas.js`.
- `$R/proyecto.md`, sección «Tareas 134-143» (decisiones, inventario, plan de ★, «Lo que nunca es distractor»).
- La ficha de la tarea 98 y la ENTREGA de la 98 (`$R/salidas/98-base-unidad4/`): cómo se añadieron filas al catálogo y
  esqueletos la última vez, y los tests que cuentan unidades.

## Cómo saber que ha terminado

- `npm test` en verde, con `tests/practicas-nivel.test.js` y `tests/practicas-ortografia-comun.test.js` nuevos.
- El catálogo tiene las filas 64-68 y la 45 con `seccion`; `node -e "import('./practicas/_comun/catalogo.js').then(m => console.log(m.CATALOGO.filter(p => p.seccion === 'ortografia').map(p => p.slug)))"` lista los seis slugs.
- La portada en local enseña la sección «Ortografía» con la 45 dentro y las unidades como antes; los cinco esqueletos cargan.
- `docs/practicas-ortografia.md` existe con sus siete secciones y la ENTREGA tiene el contrato en una página.

## Trampas conocidas

- Los ids **57-63 son de la unidad 5** (tarea 122, bloqueada hasta su F0): la ortografía usa 64-68. Si la 122 ha cerrado
  antes que tú, su lista en `tests/practicas-comun.test.js` ya tiene las suyas: añade las tuyas sin tocar las otras.
- `validarPractica` exige que cada ejercicio tenga `nombre`, `detalle`, `generar` y `montar`, y que el número coincida con
  `nEjercicios`: los esqueletos tienen que declarar los N exactos.
- `tests/practicas-editor.test.js` y `tests/practicas-espacio.test.js` cuentan **unidades** (lección de la 98); una sección
  que no es unidad no debería tocarlos, pero compruébalo con `npm test` antes y después.
- `seccionesPorUnidad` filtra por `p.unidad`: una práctica con `seccion` tiene `unidad: 3` y hay que **excluirla** de la
  sección de la U3 además de pintarla en la suya, o saldrá dos veces.
- La base pasa `sesion` a `generar` desde el 2026-10-08 (`base.js`, ~línea 731): `def.generar(rng, sesion)`. Los generadores
  antiguos que ignoran el segundo argumento siguen funcionando.
- No existe hoy ninguna forma de saber en `generar` si hay código de alumno: `nivelForzado` puede acabar leyendo solo la URL,
  y eso también vale (un alumno con código que escriba `?nivel=3` a mano solo se perjudica a sí mismo). Decide y anótalo.
- Caché de módulos ES: tras un cambio, recarga forzada; `location.reload()` no basta.
- Duración real de la base de la U4 (98) y de la U3 (79): 1 h-1 h 30 de sesión cada una; esta tiene más piezas.

## Prohibido (propio de esta tarea)

- Tocar `practicas/ortografia/*` (sus 11 ejercicios, su orden, sus `idError`), `practicas/_comun/base.js` ni
  `practicas/_comun/contador.js`: los niveles viven en `nivel.js` porque el generador ya recibe `sesion`.
- Renumerar o reutilizar ids (57-63 son de la 122); cambiar el slug de la 45.
- Publicar (`disponible: true`) ningún bloque: eso lo hacen 140-142 tras revisarlos.
- Escribir ítems de contenido en los esqueletos: el contenido es de 135-139.
- Cambiar los umbrales de nivel sin dejar escrito el porqué en `nivel.js` y en la ENTREGA (son una decisión explicada a Juan Luis el 3-11).

## Salida esperada

- Los ficheros de «Ficheros que toca» comiteados, con `npm test` en verde.
- `reparto-practicas-u2/salidas/134-base-ortografia/ENTREGA.md` (hash, ficheros, decisiones, el contrato en una página para
  las tareas 135-139, propuestas) y su marcador `ENTREGA.md.ok-<sid>`.

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
el mensaje «Tarea 134, a medias», escribe `$R/hechos/notas/<sid>-traspaso-134.md` con el
estado exacto (qué está hecho, qué falta, qué has descubierto, en qué orden seguir),
`$R/hechos/fallos/134--<sid>.md` con `parada por: sesión agotada` y la ruta de esa nota, y
`ABANDONADA` en tu reclamo. **Esta tarea es larga a propósito y está pensada para que una
sesión pueda parar entre dos ejercicios**: cada ejercicio es un módulo propio y la
siguiente sesión sigue por el primero que falte.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/134--<sid>.md` con `parada por: mal cortada`
y la ruta de la incidencia, `ABANDONADA` en tu reclamo, y díselo al usuario. Si un paso te
pide **decidir** algo que va a durar (un cambio del contrato de la base, otro número de
ejercicios que el del catálogo, otros umbrales de nivel para todas las prácticas) y esta
tarea no es de banda ALTA con el usuario delante, no lo decidas: entrégalo como propuesta en
tu terminada y sigue con lo que no dependa de ello.

## Al terminar

Por este orden (el del repositorio git):

1. `node --test tests/practicas-comun.test.js tests/practicas-nivel.test.js tests/practicas-ortografia-comun.test.js tests/practicas-portada-unidades.test.js tests/practicas-editor.test.js` en verde y `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con
   reclamo vivo no es tuyo: anótalo en la terminada). Prueba en el navegador con `npm run servir`: http://localhost:8080/practicas/ (la sección «Ortografía»),
   http://localhost:8080/practicas/ortografia-tildes/ y los otros cuatro esqueletos, a 375 px y en ventana ancha, en español
   y en inglés, con «Probar sin código».
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas:
   `git add <rutas> && git commit -m "Tarea 134: sección Ortografía, bloques 64-68, niveles y piezas comunes" -- <rutas>`. Apunta el hash
   (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/134-base-ortografia/ENTREGA.md` (ficheros entregados, hash, URL local, qué hay en cada
   ejercicio y nivel, decisiones y propuestas, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/134--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/134--<sid>.md` con hasta dónde llegaste, la línea
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
