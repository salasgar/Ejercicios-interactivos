# FICHA DEL PROYECTO — Prácticas interactivas de la Unidad 2 (PU2)

Este fichero **no se regenera nunca**. Guarda lo que el tablón no puede guardar, porque
el tablón se reescribe entero cada vez que se reclama o termina una tarea. Se escribió al
montar el reparto (2026-10-07, sesión `s-20261007T184632-fa5a1491`) y solo cambia cuando
cambia el reparto.

## Qué se construye

Treinta y una mini-aplicaciones web para que los alumnos de 1.º ESO (programa bilingüe)
practiquen los conceptos y procedimientos de la Unidad 2, Divisibilidad (dieciséis, tareas 02-17) y repasen la
unidad 1 (quince, tareas 19-33, dadas de alta el 2026-10-07 a petición suya), cada una con
una interacción propia (tocar, arrastrar, construir) y no solo tipo test. Se publican en
GitHub Pages dentro del repositorio `Ejercicios-interactivos`, bajo `practicas/`, con una
**base común** (entrada por código de alumno, menú de ejercicios, contador 20/+5, código
de resultado, guardado en el navegador y en Firestore, español/inglés) y **un único panel
del profesor**. La práctica ya existente `divisores/` («divisor, múltiplo, divisible»)
es el modelo de todo esto y se migra a la base al final.

**Desde el 2026-10-21, también la unidad 3 (Integers)**: doce prácticas más (tareas 80-91, ids 33-44
del catálogo), con su base común (79), el generador `enteros` de la aplicación principal (92) y una
revisión y publicación por semana (93-96). La unidad empieza el lunes 16-11; las de la semana 1 tienen
que estar publicadas el jueves 12-11. Sus destrezas se citan con los ids del inventario de la unidad 3
(`U3-1C-03`…): `<iCloud>/mat/1º ESO/apuntes-1eso-bilingue/3. Integers/inventario-unidad3.tsv`. El
reparto de la unidad 3 (`3. Integers/reparto-unidad3/`) no toca la app: su `proyecto.md` lo manda aquí.

Las destrezas que cubre cada aplicación se citan con los identificadores del inventario
de la unidad (`U2-1C-05`, etc.), que está en
`<iCloud>/mat/1º ESO/apuntes-1eso-bilingue/2. Divisibility/inventario-unidad2.tsv`
(solo lectura; ruta completa más abajo).

## Dónde está cada cosa

| Qué | Ruta exacta (relativa a la raíz del repositorio) | Quién llega |
|---|---|---|
| Carpeta del reparto | `reparto-practicas-u2/` | todas |
| Tablón | `reparto-practicas-u2/_ESTADO.md` | todas |
| Hechos (la fuente de verdad) | `reparto-practicas-u2/hechos/` | **todas, obligatoriamente** |
| Fichas de tarea | `reparto-practicas-u2/tareas/tarea-NN-<nombre>.md` | todas (solo la propia se edita, y solo «Trampas conocidas» y «Duración esperada») |
| Salidas (marcadores y nota de entrega) | `reparto-practicas-u2/salidas/NN-<nombre>/` | la dueña de la tarea |
| Código de las prácticas | `practicas/<slug>/` y `practicas/_comun/` | la dueña de la tarea que lo declara |
| Tests | `tests/practicas-<slug>.test.js`, `tests/practicas-comun.test.js` | la dueña |
| Papelera | `reparto-practicas-u2/_papelera/` | la vacía el usuario a mano |
| Autorizaciones | `reparto-practicas-u2/autorizaciones.md` | las firma el usuario a mano |

Raíz del repositorio en este Mac: `/Users/salasgar/Documents/git/Ejercicios-interactivos`.
Las sesiones son de Claude Code abiertas en esa carpeta, así que las rutas de arriba se
usan tal cual desde la raíz.

Carpeta de apuntes de la unidad (solo lectura, fuera del repositorio; hay que añadirla
como directorio de trabajo adicional si la sesión no la tiene ya):
`/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/2. Divisibility/`
Ahí están `inventario-unidad2.tsv`, `contenidos-unidad2-resumen.tex` (apartado «Errores
más frecuentes»), las hojas de ejercicios (`hojas-de-ejercicios/hoja-unidad2-semanaN.tex`)
y los apuntes. **Nada de eso se modifica desde este reparto.**

**En código, «una tarea, una carpeta de salida, un dueño» se traduce en «cada ficha
declara los ficheros que toca, y dos tareas que compartan uno no van en paralelo».** Las
30 tareas de aplicación (02-16 y 19-33) tocan carpetas disjuntas; los únicos ficheros comunes
(`practicas/_comun/*`, `practicas/index.html`, `practicas/profesor.*`,
`firestore.rules`, `src/firebase.js`, `README.md`) los toca una sola tarea cada vez: la 01
al montar la base, la 34 al añadir las filas de la unidad 1 al catálogo, la 17 al migrar
`divisores/`, la 18 al cerrar.

La carpeta `salidas/NN-<nombre>/` de cada tarea contiene solo `ENTREGA.md` (qué ficheros
de código entregó, hash del commit, cómo probarlo) y su marcador `ENTREGA.md.ok-<sid>`.
El código no lleva marcadores: su marcador es el commit cuyo hash figura en la terminada.

`hechos/` está en el disco (dentro del repositorio) porque todas las sesiones son
atendidas y corren en este Mac. **No puede haber dos.**

Renombrar ficheros aquí: **sí** (comprobado con `mv` el 2026-10-07; `rm` también
funciona, pero no se usa: lo que sobra va a `_papelera/`).

Sesiones en **un solo dispositivo**. Carpeta **sincronizada con iCloud Drive** (corregido el
2026-10-08: `~/Documents` es la carpeta de iCloud «Escritorio y Documentos»). Con un solo
dispositivo la espera del reclamo sigue siendo `sleep 30`. **Trampa real, vista la noche del
7 al 8 de octubre:** con «Optimizar almacenamiento del Mac» activado, iCloud evacuó a la nube
casi todos los ficheros de `hechos/` y parte de la base, y al caerse la red cualquier lectura
de esos ficheros se quedaba colgada minutos; las diez sesiones que trabajaban terminaron su
turno con error y hubo que retomarlas a mano con «Continúa». Remedio: en el Finder, botón
derecho sobre `Ejercicios-interactivos` → «Mantener descargado». Para saber si un fichero está
evacuado sin leerlo: `ls -lO` muestra `dataless`.

Dónde corren las operaciones largas: en el propio shell de Claude Code, que sobrevive a
la llamada. Aquí no hay nada que dure más de un minuto (`npm test` tarda un segundo).

**Candados de fichero del entorno: sí.** Un hook de Claude Code (`~/.claude/hooks/sesiones.sh`)
reserva cada fichero que una sesión edita con Edit/Write y bloquea a las demás sesiones
del mismo árbol durante 30 minutos sin actividad. Solo vigila las herramientas de edición,
no el shell. Con las fichas bien seguidas (ficheros disjuntos) no contiende nunca. Si al
regenerar el tablón te lo encuentras reservado por otra sesión, no esperes: tu reclamo ya
vale, regenera cuando puedas.

**Repositorio git: sí, todas las sesiones en el mismo árbol de trabajo, sin worktrees.**
Consecuencias:
- El índice de git es compartido: `add` nunca separado de `commit`. Siempre
  `git commit -m "…" -- ruta1 ruta2` con rutas explícitas, o `git add rutas && git commit`
  en la misma orden. Nunca `git add .`, `git add -A` ni `git commit -a`.
- Orden de cierre: `npm test` en verde → commit del código (solo los ficheros de
  «Ficheros que toca»; sale el hash) → terminada con el hash, `CERRADA`, tablón, trampas
  en la ficha → un commit con rutas explícitas (tus ficheros de `hechos/` por sid,
  `salidas/NN-…/`, `_ESTADO.md`, tu ficha) → `git push origin main`. Si el push se
  rechaza, `git pull --rebase origin main`, regenera `_ESTADO.md` otra vez desde `hechos/`
  y vuelve a comitear.
- `npm test` ejecuta **todos** los tests, incluidos los ficheros a medio escribir de
  otras sesiones del mismo árbol. Si falla un test de un fichero que no es tuyo y su
  tarea tiene reclamo vivo, no es tu fallo: anótalo en tu terminada y sigue. Lo que tiene
  que pasar entero es `node --test tests/practicas-comun.test.js tests/practicas-<tu slug>.test.js`
  y, antes del commit, `npm test` sin fallos en tus ficheros. La publicación (GitHub
  Actions) corre `npm test` sobre el commit, no sobre el árbol: un fichero ajeno a medias
  no llega al commit si solo comiteas tus rutas.
- **Nunca `git stash`, `--autostash`, `git checkout -- .` ni `git reset --hard` en este árbol**
  (incidencia `hechos/incidencias/s-20261008T175319-8ec41ac6.md`, 2026-10-08): un
  `pull --rebase --autostash` se llevó a un stash el trabajo sin comitear de seis sesiones. Si
  el push se rechaza y el árbol tiene ficheros ajenos a medias, se espera y se reintenta, o se
  empuja desde un worktree limpio (`git worktree add <tmp> origin/main`, cherry-pick del commit
  propio, push desde allí).
- **Un fichero común con candado no se reparte entre sesiones en paralelo** (2026-10-08): ocho
  graves terminaron su código y no pudieron poner su `disponible: true` porque el candado de
  `practicas/_comun/catalogo.js` lo tuvo una sola sesión más de una hora. La próxima vez, ese
  cambio es una tarea aparte, de una sola sesión, al final.
- **iCloud deja copias en conflicto dentro de `.git/`** (`refs/heads/main 2`): rompen `git fetch`
  con «bad object». Se apartan a `.git/conflictos-icloud/` tras comprobar que su commit es
  antepasado de `HEAD`.
- Tope de procesos: ninguno.
- Un reclamo vivo es una sesión viva aunque no aparezca en `.claude/sesiones/`.

Vigía: ninguno al montar. La sesión montadora puede dejar uno (`/loop` cada 30 min que
lista `hechos/`, compara `caduca:` con `date -u` y solo avisa); muere al cerrar esa
conversación.

Duración real observada: sin medir aún. La caducidad sale siempre de la ficha. **La
primera terminada recalibra**: quien regenere el tablón después de ella compara la
duración real con la estimada y, si difieren mucho, se lo dice al usuario.

## Bandas de modelo (copiado de la skill `reparto`, comprobado el 2026-09-20)

| Banda | Modelo · esfuerzo | Para qué, en este reparto |
|---|---|---|
| **ALTO** | Opus 5 · Alto | La base común (01), el árbol de factores (06), el Venn de factores primos (09), la revisión final (18), la segunda revisión (36), la tarea de la semana y los arreglos de base (37), el progreso en la nube (38) y el registro de fallos (39) |
| **MEDIO** | Sonnet 5 · Medio | Las demás aplicaciones (incluida la 19), y la migración de `divisores/` (17) |
| **BAJO** | Haiku 4.5 · Medio | No hay tareas de esta banda (la 34 pasó a MEDIO porque toca el test común) |

En VS Code, «Default (recommended)» y «Opus (1M context)» son el mismo Opus 5. El
esfuerzo es el deslizador de debajo de la lista de modelos.

**Puesta al día del 2026-10-21** (coordinadora s-20261021T195149-596ac86a): el menú ya da **Opus 5.5**
y **Sonnet 5.5** en el sitio de Opus 5 y Sonnet 5 (la sesión que lo escribe corre en Opus 5.5, y la
del 19-10 en Sonnet 5.5). Desde ahí: ALTO = Opus 5.5, esfuerzo Alto; MEDIO = Sonnet 5.5, esfuerzo
Medio; BAJO, sin cambios. Las fichas 79-96 ya lo dicen así; las anteriores dicen «Opus 5» y
«Sonnet 5», que hoy son esos mismos huecos del menú.

## Nombres de sesión

Abreviatura del proyecto: **`PU2`**. El nombre va como prefijo de la frase de arranque y
la sesión lo repite si cambia lo que hace («renómbrame a …»).

| Sesión | Nombre | Ejemplo |
|---|---|---|
| Una tarea | `PU2 T<NN> (<BANDA>)` | `PU2 T02 (MEDIO)` |
| Una cadena | las tareas unidas con `+` | `PU2 T02+T04 (MEDIO)` |
| Quien monta, recorta o coordina | `PU2 Coordinadora <rangos> (<BANDA>)` | `PU2 Coordinadora T01-T18 (ALTO)` |

## Frase de arranque (una por sesión; se rellenan la tarea o la cadena, la banda y el nombre)

> `PU2 T<NN> (<BANDA>)` — Trabaja en el reparto `reparto-practicas-u2/` de este
> repositorio (Ejercicios-interactivos). He abierto esta sesión con un modelo de banda
> <BANDA> (<modelo>, esfuerzo <esfuerzo>) y el nombre de esta sesión es el que encabeza
> este mensaje. Lee `reparto-practicas-u2/proyecto.md` y `reparto-practicas-u2/_ESTADO.md`,
> lista `reparto-practicas-u2/hechos/`, reclama la tarea <NN> siguiendo el protocolo del
> tablón <y, al cerrarla, encadena la <MM>>, dime en tu primer mensaje qué tarea has
> reclamado —o por qué no has podido— y con qué identificador de sesión, y sigue con
> ella hasta cerrarla o soltarla sin esperar confirmación.

La banda va dentro de la frase porque una sesión no puede saber en qué modelo corre. La
traducción entre paréntesis es para el usuario: le dice qué elegir en el menú.

## Reglas de contenido comunes a todas las prácticas

Se repiten en la sección «Prohibido» de cada ficha porque lo común no se lee, pero la
fuente es esta:

1. **Terminología (desde la Unidad 2):** «divisor», no «factor», para la relación entre
   números («6 es divisor de 24»); se queda *factor* en *prime factor*, *factor tree* y el
   factor de un producto. **GCD**, no HCF (HCF y GCF se aceptan como respuestas válidas
   pero no se enseñan). *Lowest* y *least common multiple* valen las dos.
2. **Producto con punto medio** `·` (en HTML, `&middot;` o el carácter ·), nunca `×`.
   División con `:` en español y `÷` o `:` en inglés, como hace `divisores/textos.js`.
3. **Inglés sencillo** en los enunciados; la palabra no matemática que decide la
   respuesta se aclara entre paréntesis en el texto inglés cuando haga falta
   («even number (número par)»). Español e inglés siempre, con el selector ES/EN de la
   base; los textos viven en `textos.js` de cada práctica como `{ es, en }`.
4. **Regla de oro de las opciones:** en cualquier ejercicio de elegir entre opciones,
   todo distractor es inequívocamente falso. Dos formas que se pronuncian igual, dos
   nombres equivalentes (GCD/HCF, factorise/factorize, equals/is equal to), dos árboles
   distintos del mismo número o el orden de los factores **nunca** son distractores. El
   test de cada práctica lo comprueba por fuerza bruta donde se pueda; el significado se
   revisa a mano.
5. **Nada que no se haya dado:** sin letras ni ecuaciones (el hueco es `□`), sin «primos
   entre sí» como nombre (se dice «su único divisor común es 1»), sin criterios del 4 ni
   del 25 salvo donde la ficha lo pida como ampliación marcada.
6. **El 0 es múltiplo de todo número y el 1 es divisor de todo número.** Ninguna opción
   falsa puede apoyarse en excluir el 0 de los múltiplos. Nunca se pregunta «múltiplo de
   0» ni «divisible entre 0».
7. **Factorizaciones:** bases de menor a mayor; el orden de los factores no es un error;
   incluir siempre casos con factores 11 y 13 (242, 286, 338, 363) y no solo 2, 3, 5 y 7.
8. **Feedback ligado al error:** cuando el alumno falla, el mensaje dice qué ha pasado
   con los números de ese ítem («51 = 3 · 17: la suma de las cifras es 6»), no una regla
   genérica. Es lo que distingue estas prácticas de un test en papel.
9. **Repaso de realismo de los problemas de enunciado (regla de Juan Luis, 2026-10-16):**
   antes de dar por terminado un enunciado con contexto, comprobar que **la situación es
   posible** (dos cabinas de una noria nunca pasan a la vez; no se hacen pulseras con
   canicas) y que **todos los números que puede sacar el generador son creíbles en ese
   contexto**, no solo el ejemplo que se mira: periodos (una noria no da una vuelta en
   3 segundos; un metrónomo va de 20 a 240 clics por minuto; una vuelta a la pista son
   90-200 s), longitudes (una manguera no mide 12 cm), cantidades (un m.c.d. de 1 hace
   absurdo «el mayor número de pulseras»). Si el rango común no le vale a un contexto, ese
   contexto lleva su propia cota o se cambia de contexto; nunca se deja. Lo revisa la
   sesión que escribe el banco y lo comprueba el test cuando la cota es numérica.

## Reglas de contenido de la unidad 3 (tareas 79-96)

Se repiten en cada ficha de la unidad 3; la fuente es esta. Salen de `3. Integers/reparto-unidad3/proyecto.md`
(«Reglas de contenido comunes») y de los «Avisos para quien escriba preguntas» de `3. Integers/PLAN-UNIDAD3.md`.
Las reglas 2-4 y 8-9 de la lista anterior (signos, inglés, regla de oro, feedback, realismo) valen igual.

1. **La suma y la resta empiezan sin paréntesis**: `5 + 3`, `5 − 3`, `−5 + 3`, `−5 − 3`. **Nunca**
   `(+5) + (+3) = +8`, ni `+8` como resultado. El paréntesis de un número (`5 − (−3)`, `5 · (−2)`)
   aparece en la sesión 6, como algo que se quita; `(+6)` y compañía, solo en el ejercicio que
   enseña a quitarlos (U3-2C-08). Un negativo que no va el primero en un producto o un cociente va
   entre paréntesis: `5 · (−2)`, `12 : (−3)`. El opuesto del opuesto, `−(−4)`, es de la sesión 1.
2. **Nada que no se haya dado**: cada ejercicio respeta la columna `sesion` de sus destrezas en el
   inventario. Ningún producto o cociente de enteros antes de la sesión 6, ningún paréntesis que
   envuelva una operación antes de la 11 (salvo `30 : (−5 · 2)` en la 9), ninguna potencia de base
   negativa antes de la 10, corchetes solo en la 13. Ni letras ni ecuaciones (el número que falta es
   un hueco `□`), ni decimales, fracciones ni porcentajes.
3. **Escritura**: el menos que se ve en pantalla es U+2212 `−` (`fmt` de `practicas/_comun/enteros.js`,
   de la tarea 79); el alumno puede teclear `-`, `−` o `–` (`leerEntero`). Producto con `·`, nunca
   `×`; división con `:` (en inglés, `÷` o `:`, como el resto de la app). Exponentes con `<sup>`.
4. **Regla de oro**: todo distractor, inequívocamente falso, y cada distractor sale de un **error
   típico** de la columna `nota` del inventario, calculado con los números del ítem y comprobado en el
   test (nunca un número al azar): `−2 − 3 = +5`, `5 · (−2) = 10`, `(−2)⁴ = −16`, `(−2)³ = +8`,
   `(−5)² = −10`, `−(−3)² = 9`, `5 − (2 − 4) = 5 − 2 − 4`, `2 − 4 + 3 = 2 − 7`, `4 − 5 · 2 = 4 − (−10)`,
   `3 − (−2) = 3 − 2`, `|−4| = −4`, `−(−9) = −9`. Los generadores de estos valores están en
   `_comun/enteros.js` (tarea 79): úsalos.
5. **Parejas válidas, que nunca se enfrentan** (U3-4C-09): *negative three* / *minus three*;
   *subtract* / *take away*; *times* / *multiplied by*; *exponent* / *index*; *brackets* /
   *parentheses*; `÷` / `:`; `+5` / `5`; agrupar positivos y negativos / ir de izquierda a derecha;
   operar dentro del paréntesis / quitarlo. **Riesgos de dos respuestas correctas** (las destrezas
   con `cuidado` en la columna `tipo_test`): `√49` con 7 y ±7 a la vez entre las opciones; colocar
   paréntesis (varias colocaciones pueden dar lo mismo: vale cualquiera que dé el resultado); años
   a. C. (no hubo año 0); la escritura de dos signos seguidos (solo como «¿cuál está bien escrita?»).
6. **Inglés sencillo**; la palabra no matemática que decide la respuesta se aclara entre paréntesis
   (*to owe (deber)*, *rose (subió)*), salvo que sea justo lo que se evalúa. *Even* y *odd* se aclaran
   siempre salvo en su pregunta.
7. **Realismo** (regla de Juan Luis del 16-10): la situación tiene que ser posible y **todos** los
   números que pueda sacar el generador, creíbles en su contexto, con una cota por contexto que el
   test comprueba. Orientativas (la sesión fija las suyas y las escribe en su ENTREGA): temperatura de
   una ciudad, de −30 a 45 °C, y su cambio en un día, de 1 a 20 grados; plantas de un edificio, de −5
   a 20; buceo, de 0 a −40 m; saldo de un alumno, de −50 a 300 €; altitudes, de −400 m (mar Muerto) a
   8849 m; años, de 3000 a. C. a 2026, sin año 0.
8. **Feedback ligado al error**, con los números del ítem («−2 − 3: vas hacia abajo dos veces; 2 + 3 =
   5, así que el resultado es −5»), no una regla genérica. Frase sencilla antes que caso límite: «el
   valor absoluto es siempre positivo» se queda aunque |0| = 0 (decisión de Juan Luis del 17-10; no
   vale para los distractores).
9. **Casos fijos** (frases, contextos, cálculos con error) que no copien los de las hojas, los
   exámenes semanales ni el examen final de la unidad 3 (en la carpeta de la unidad: `hojas-de-ejercicios/`,
   `exámenes-semanales/`, `examen-final/`): los alumnos los verán en papel.

## Decisiones de reparto

- **Una base común y un panel único** en vez de dieciséis copias de `divisores/`: el
  profesor tiene una lista de alumnos y unos códigos; dieciséis listas y dieciséis paneles
  serían inmanejables. Los códigos de alumno de 4 caracteres se conservan (misma sal y
  misma permutación que `divisores/logica.js`), así que los alumnos entran en todas las
  prácticas con el código que ya tienen.
- **El catálogo de prácticas está fijado en la ficha de la tarea 01** (ids numéricos,
  slugs, número de ejercicios) para que las tareas 02-16 no tengan que escribir en ningún
  fichero común. Si una práctica necesita otro número de ejercicios que el del catálogo,
  es una decisión que no es de la sesión: se entrega como propuesta en la terminada y la
  resuelve la coordinadora.
- **`divisores/` se migra al final (tarea 17)**, cuando la sesión que lo estaba editando
  el 2026-10-07 haya terminado. Mientras tanto se lee como modelo y no se toca.
- **Sin worktrees.** Ficheros disjuntos por tarea; el hook de sesiones no contiende.
- **Las tareas 02-16 y 19 dependen de la 01; las 20-33, de la 34 (que depende de la 01).** La 01 define el contrato
  (`practicas/_comun/base.js`) y las utilidades aritméticas comunes; hasta que esté
  LISTA solo puede trabajar una sesión en este reparto.

- **Tarea 19 (2026-10-07, 19:30 UTC):** «Coloca los paréntesis», repaso de la unidad 1 sobre la
  misma base, id 16 del catálogo. Al darla de alta se añadió al contrato de la base el campo
  opcional `pistas` de `responder` (ficha 01, §3), porque en esa práctica el ítem se termina
  siempre y lo que se mide son las ayudas. La 01 tenía reclamo vivo desde las 19:26 UTC
  (sid s-20261007T192646-341f1b98): se le avisó del cambio por mensaje entre sesiones y la
  terminada de la 01 debe confirmar que la fila 16 y el campo `pistas` están en la base.

- **Tareas 20-34 (2026-10-07, 20:00 UTC):** quince prácticas de repaso de la unidad 1 (fichas
  20-33) y la tarea 34, que añade sus filas al catálogo para que no dependan de otro aviso a
  la sesión de la 01. Banda ALTO solo la 24 (del enunciado a la expresión). La 34 es MEDIO: además del catálogo
  toca tres líneas de `tests/practicas-comun.test.js` en el mismo commit (nota de la 01,
  `hechos/notas/s-20261007T192646-341f1b98-para-la-34.md`).
- **El catálogo queda lleno con las filas 17-30** (ids 0-31; el código de resultado reserva 5
  bits para la práctica). Una práctica más exige cambiar el formato del código de resultado
  (una tarea nueva de banda ALTO que toque `_comun/codigos.js`, el panel y sus tests).

## Orden de prioridad (Juan Luis, 2026-10-07: «este lunes empiezo la unidad 2; primero lo de la semana 1»)

Cuando haya varias tareas libres de la misma banda, se cogen por este orden, y las frases
de arranque que dé cada sesión al cerrar nombran primero las de arriba:

0. **Antes que nada, la 35** (base: 10 aciertos e idioma alterno): es corta y lo que las
   prácticas ya hechas heredan al instante. `divisores/` publicado tendrá 10 aciertos cuando la 17 (ya en curso) y la 35 hayan
   cerrado las dos.
1. **Semana 1 de la unidad 2:** 02 semaforo, 04 recta, 03 rectangulos (cadena sugerida
   02+04), y después 11 clasificador (sus enunciados limpios son la destreza 1A-01), 12
   reloj (coincidencias con listas, 1A-02), 10 imposibles (nombrar la respuesta, 1A-04), 15
   leelo (vocabulario 1B). `divisores/` ya está publicada y cubre 1B-01 y 1C-02.
2. **Semanas 2 y 3 de la unidad 2:** 05, 06, 07, 08, 16, 09.
3. **Semana 4 de la unidad 2:** 13, 14.
4. **Repaso de la unidad 1:** 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33.
5. **Cierre:** 17, 18.

- **Tarea 35 (2026-10-07, 20:50 UTC), decisión de Juan Luis tras probar `divisores/` en el móvil:**
  10 aciertos por ejercicio (no 20), +2 por fallo, tope 20; y el idioma de cada ítem al azar,
  equilibrado, sin selector para el alumno, con traducción del enunciado solo después de
  responder y un modo fijo por URL (`?idioma=es|en`) para alumnos concretos. Se hace en la
  base y lo heredan todas las prácticas. La 34 cerró antes de que existiera la 35 y la 17 ya estaba en curso cuando se dio de
  alta, así que ninguna depende de ella: la 17 hereda el cambio al no declarar parámetros.

- **Tarea 36 (2026-10-08, 19:35 UTC), pedida por Juan Luis:** segunda revisión, limitada a lo
  que cambiaron las 28 reaperturas de la tarde del 8 de octubre. Verifica y reabre; no corrige.
  Es de un solo uso: va después de las reaperturas y antes de mandar las prácticas como tarea
  semanal. Si reabre algo, esas reaperturas son MEDIO y se dan en cadena, como las anteriores.
- **Publicación de las graves (2026-10-08):** por orden de Juan Luis la coordinadora puso
  `disponible: true` a 07, 14, 20, 21, 27, 30 y 33 (commit 2128eb6). La 32 (errores1) queda
  sin publicar hasta que él decida sobre las cuatro plantillas `saltoPaso`.

- **Decisiones de Juan Luis del 2026-10-09** sobre lo que la 18 dejó pendiente: ocho reaperturas
  `hechos/reabiertas/NN--s-20261008T174225-f75f5cdb-decisiones.md` (13, 14, 15, 24, 26, 30, 31,
  32), todas de banda MEDIO. `mental` pierde su ejercicio 3 (queda con dos) y `errores1` gana
  un cuarto, «¿Paso a paso?», donde todas las igualdades son verdaderas y solo se pregunta si
  se ha saltado un paso (criterio de las destrezas 4A-12 y 4A-13 de la unidad 1); en los demás
  ejercicios saltarse un paso deja de ser un error. La 30 y la 32 van en la misma sesión, en
  serie: las dos tocan `catalogo.js` y `tests/practicas-comun.test.js`. Estas reaperturas se
  lanzan DESPUÉS de que cierre la 36, para corregir de una vez lo suyo y lo que ella reabra.
- **Tarea 37 (2026-10-09):** página «tarea de la semana» (ejercicios ★ obligatorios más N a
  elegir, marcador, un único código de resultado por tarea, vista en el panel) y los cuatro
  arreglos de base del apartado 2 de los hallazgos de la 18. La semana 1 se manda sin ella,
  con la portada. Qué ejercicios lleva cada semana: `hechos/notas/s-20261008T174225-f75f5cdb-temporizacion.md`
  (borrador de la coordinadora; lo decide Juan Luis). Va después de la 36 y de las
  reaperturas de la 30 y la 32.
- **Tareas 38 y 39 (2026-10-15, 20:40 UTC), pedidas por Juan Luis** al preparar la primera tarea semanal
  con la app (correo a cada alumno con su código, lunes 19-10 a las 8:00; semana 1 de la app del 19 al
  22-10, que cuenta para nota). La **38** hace que el alumno lea su propio documento de `practicas/` en
  Firestore (`allow get`, nunca `list`) y fusione al entrar, para seguir desde cualquier aparato y que un
  aparato no machaque lo de otro en la nube; añade al panel los puntos de la tarea y «qué falla más». Tiene
  **plazo: antes del lunes 19-10 a las 8:00**, porque cambia una frase del correo. La **39** registra cada
  fallo (ítem, respuesta, feedback, tipo de error opcional en `api.responder`) en una colección nueva que
  elige Juan Luis, con su vista en el panel. Las dos son ALTO, atendidas (él publica las reglas) y en serie:
  tocan `base.js`, el panel y `firestore.rules`.

- **Tareas 79-96, prácticas de la unidad 3 (2026-10-21, coordinadora s-20261021T195149-596ac86a)**, pedidas por
  Juan Luis el 19-10 («dar de alta tareas en el reparto para hacer las prácticas de la unidad 3») y
  confirmadas el 21-10. Parten del diseño del traspaso `hechos/notas/s-20261019T210346-894df6be-traspaso-alta-u3.md`,
  con estos cambios: (1) **la 79 deja un esqueleto en cada `practicas/<slug>/`**, porque `npm test` carga el
  `practica.js` de cada fila del catálogo y sin él no podría añadir las doce filas de una vez; desde que la
  79 está LISTA, cada carpeta es de su práctica (traspaso de titularidad, como en la skill); (2) la 79
  escribe también `DESTREZAS` de la U3 en `registro.js` y el §7 de un `docs/practicas-unidad3.md` nuevo,
  porque un test exige que las dos tablas coincidan; (3) la 79 es **ALTO**, no MEDIO: fija el evaluador
  y los errores típicos que usan las doce; (4) la «propuesta de tareas» (93) y la «revisión final» (94)
  del traspaso pasan a ser **cuatro tareas de revisión y publicación, una por semana (93-96)**, porque
  una sola revisión al final no llegaba al plazo de la semana 1; cada una propone a Juan Luis la tarea
  de su semana, que él monta en el panel (editor de la 67); (5) **número de ejercicios fijado** por
  práctica (51 en total) y destrezas de vocabulario (1B-01, 1B-03, 2B-01, 2B-03) y U3-1C-02, que el
  diseño dejaba sin práctica, asignadas a la 91 y a la 80. Sin práctica, a propósito: U3-2A-04, 2C-09 y
  2C-17 como explicación. **Años a. C./d. C. (U3-4C-05)**: la 90 no cruza el año 0 hasta que Juan Luis
  decida qué cuenta vale.

## Orden de prioridad de la unidad 3 (por los plazos de publicación)

1. **79** (base; ALTO) y, a la vez, **92** (generador `enteros`; MEDIO).
2. **Semana 1**: 83 `saltos` (la central), 80 `termometro`, 81 `opuestos`, 82 `situaciones`, 91 `leelo3` →
   **93** publica el jueves 12-11.
3. **Semana 2**: 84, 85 → **94** (jueves 19-11).
4. **Semana 3**: 86, 87, 88 → **95** (jueves 26-11).
5. **Semana 4**: 89, 90 → **96** (jueves 3-12).
Las prácticas no dependen unas de otras: con la 79 LISTA pueden ir todas a la vez.

## Tareas 98-114: la unidad 4 (Fractions) y las fichas del parchís (2026-10-26, s-20261025T214721-c42a0135)

Dadas de alta la noche del 25 al 26-10 por la misma sesión que montó el reparto de la unidad 4
(`apuntes-1eso-bilingue/4. Fractions/reparto-unidad4/`), siguiendo el traspaso de Juan Luis del 25-10 («dar de alta las
piezas de la app en el reparto del repositorio»). La unidad 4 se da del **lun 14-12 al vie 15-1**, partida por la Navidad;
sus destrezas se citan con los ids de `4. Fractions/inventario-unidad4.tsv`, **que a 26-10 no existe**: la tarea 01 de aquel
reparto escribe la propuesta y la 02 la revisa con Juan Luis (firma F0). Por eso las fichas 99-108 citan las destrezas por
descripción y la 98 pone los ids (provisionales si F0 no está) en `DESTREZAS` y en el §7 de `docs/practicas-unidad4.md`.

- **98** base de la unidad 4 (ALTO): `_comun/fracciones.js` (modelo de fracción inmutable, comparar, operar, `htmlFraccion`,
  `leerFraccion`, `enPalabras`, `ERRORES_TIPICOS`), `_comun/dibujo-fracciones.js` (barras, pizzas, cuadrículas, recta),
  catálogo (ids **47-56**, `disponible: false`; `UNIDADES` con la U4 desde el 14-12), portada, `DESTREZAS`, esqueletos, tests.
- **99-108** las diez prácticas (MEDIO; carpetas disjuntas; todas en paralelo con la 98 LISTA): 99 `que-fraccion`, 100
  `equivalentes`, 101 `simplifica`, 102 `compara` (semana 1); 103 `fraccion-de`, 104 `suma-resta` (semana 2); 105
  `multiplica-divide`, 106 `combinadas-fracciones`, 107 `errores4` (semana 3); 108 `leelo4` (toda la unidad).
- **109-111** revisión y publicación por semana (ALTO), con la propuesta de la tarea de la semana para el panel y el ★ de
  ortografía (ejercicios 5, 6 y 7): antes del **jue 10-12**, del **jue 17-12** y del **mar 22-12** (límite jue 7-1).
- **112** generadores `fracciones_equivalentes`, `suma_fracciones` y `producto_division_fracciones` de la app principal al día
  con el inventario (MEDIO; con F0), como la 92 con `enteros`.
- **113** guía para los compañeros del departamento, que entran el **14-12**, y prueba del circuito de un profesor nuevo con
  las cuentas A y B (ALTO; con la 71 LISTA y Juan Luis delante).
- **114** «Las fichas de Pablo» pasa a llamarse **«Las fichas del parchís» / «Ludo counters»** (el slug `fichas-de-pablo` no
  cambia) y su ejercicio 6 se rehace con la tabla de divisores del boceto de Juan Luis del 25-10 (MEDIO; no en paralelo con
  la 98: comparten `catalogo.js`).

**Reglas de contenido de la unidad 4**: en cada ficha 98-112 (sección propia) y en `4. Fractions/reparto-unidad4/proyecto.md`.
La trampa propia de la unidad: **dos fracciones equivalentes son la misma respuesta** (ninguna opción puede equivaler a otra;
se comprueba por valor, nunca con decimales); y hasta que el acta del inventario lo diga, ni decimales, ni fracciones
negativas, ni números mixtos, ni potencias de fracciones.

## Orden de prioridad de la unidad 4 (por los plazos de publicación)

0. **114** (fichas del parchís) puede ir ya: no depende de nada, pero no a la vez que la 98.
1. **98** (base; ALTO) en cuanto exista la propuesta de inventario de la U4 (tarea 01 de aquel reparto; mejor con F0), y, a la
   vez, **112** (MEDIO; con F0) y **113** (ALTO; con la 71 LISTA).
2. **Semana 1**: 99, 100, 101, 102, 108 → **109** publica el jueves 10-12.
3. **Semana 2**: 103, 104 → **110** (jueves 17-12).
4. **Semana 3**: 105, 106, 107 → **111** (martes 22-12; límite jueves 7-1).
Las tareas de Classroom de cada semana las programa la tarea 29 del reparto de la U4 cuando Juan Luis haya montado la tarea en el panel.
