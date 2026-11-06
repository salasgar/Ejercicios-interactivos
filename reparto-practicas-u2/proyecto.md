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
sus destrezas se citan con los ids de `4. Fractions/inventario-unidad4.tsv`, **aprobado el 26-10 al mediodía en la tarea 02 de
aquel reparto** (73 destrezas, 36 nucleares; acta `4. Fractions/inventario-unidad4-revision.md`; F0 es la firma formal,
pendiente al escribir esto). Las fichas 99-108 citan las destrezas por descripción y la 98 pone los ids definitivos en
`DESTREZAS` y en el §7 de `docs/practicas-unidad4.md`. **Lo que el acta cambió para la app (26-10)**: el producto y las
potencias de base positiva pasan a la sesión 7 (jue 7-1, semana 2; el cociente sigue en la 9); las fracciones negativas entran
desde la semana 1 (escritura y signo, simplificar, comparar, recta), en la 2 (sumar y restar, también con resultado negativo)
y en la 3 (producto, cociente, combinadas); ni decimales ni números mixtos; cotas de realismo nuevas (clase 12-36 alumnos,
pizza 3-15 trozos, ahorros hasta 2000 €, instituto 200-3000, depósito de coche 20-90 L, botella hasta 3 L, garrafa hasta
50 L, 1000 km en coche); 6/6 es impropia; dividir por los dos métodos. Las fichas 98-112 se corrigieron ese día (sesión
`s-20261026T114336-7477f785`, la coordinadora de la U4).

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
se comprueba por valor, nunca con decimales); y, por el acta del 26-10, **ni decimales ni números mixtos; fracciones negativas
desde la semana 1 y potencias de base positiva en la sesión 7** (la base negativa, solo reto en las hojas: no en la app).

## Orden de prioridad de la unidad 4 (por los plazos de publicación)

0. **114** (fichas del parchís) puede ir ya: no depende de nada, pero no a la vez que la 98.
1. **98** (base; ALTO) con el inventario aprobado el 26-10 (ids definitivos; F0 es la firma formal), y, a la
   vez, **112** (MEDIO; con F0) y **113** (ALTO; con la 71 LISTA).
2. **Semana 1**: 99, 100, 101, 102, 108 → **109** publica el jueves 10-12.
3. **Semana 2**: 103, 104 → **110** (jueves 17-12).
4. **Semana 3**: 105, 106, 107 → **111** (martes 22-12; límite jueves 7-1).
Las tareas de Classroom de cada semana las programa la tarea 29 del reparto de la U4 cuando Juan Luis haya montado la tarea en el panel.

## Tarea 115: publicar las dos reabiertas de la unidad 3 (2026-10-26, s-20261026T114336-7477f785)

Las cuatro tareas de publicación de la U3 (93-96) cerraron dejando dos prácticas reabiertas y **sin publicador**: la 84
`dos-signos` (semana 2, publicada antes del **jue 19-11**) y la 90 `variacion` (semana 4, antes del **jue 3-12**). Juan Luis
decidió el 26-10 «arreglar y luego publicar»: primero una sesión MEDIO cierra las dos reabiertas (`PU2 T84+T90 (MEDIO)`,
como reabiertas, sin tocar `catalogo.js`) y después la **115** (ALTO) las verifica a mano con clics en el navegador, las
publica y confirma o corrige las propuestas de tarea de las semanas 2 y 4 (`salidas/94-…` y `salidas/96-…`). La 115 toca
`catalogo.js`: no a la vez que la 98 ni que las 109-111.


## Tareas 116-118: las tareas de la U3 en el panel y las siete prácticas de la U4 sin publicador (2026-10-30, s-20261030T074933-c1fcc2b1)

Dadas de alta el 30-10 por encargo de Juan Luis («vamos con las cuatro tareas de la U3 … dame las frases de arranque»).

- **116** (ALTO, MANUAL, con Juan Luis delante): montar en el panel, con Claude en Chrome y su sesión de Google iniciada, las cuatro
  tareas semanales de la U3 que proponen las ENTREGA de 93-96 (confirmadas por la 115). Las tareas viven en la nube
  (`practicas-tareas` de su espacio); no hay script que las cree y no se tocan ni `tareas.js` ni el código. Desbloquea la tarea 30 del
  reparto de la U3 (Classroom; plazo sáb 14-11). Si el editor de la 67 falla, reabierta de la 67 y plan B (él teclea, la sesión dicta).
- **117 → 118** (ALTO, en cadena): las publicaciones 109-111 cerraron con siete prácticas reabiertas y sin publicador; las reabiertas
  están cerradas desde el 29-10. La 117 revisa a mano y publica `equivalentes` y `compara` (semana 1, antes del jue 10-12) y
  `fraccion-de` y `suma-resta` (semana 2, antes del jue 17-12); la 118, `multiplica-divide`, `combinadas-fracciones` y `errores4`
  (semana 3, antes del mar 22-12). En serie porque comparten `catalogo.js` y `docs/practicas-unidad4.md`. Cada una deja al día la
  propuesta de la tarea de la app de su semana, que Juan Luis monta en el panel (como la 116 con la U3). Publicar antes del 14-12 no
  enseña nada a los alumnos: la portada oculta la U4 hasta esa fecha (`UNIDADES`).


## Tareas 119-121: segunda publicación de la U4 y sus tareas en el panel (2026-10-30, s-20261030T074933-c1fcc2b1)

La 117 y la 118 (30-10) revisaron las siete prácticas de la U4 y **no publicaron ninguna**: todas sacaban casos de las hojas o de los
exámenes de la U4 (regla 6), escritos después de la revisión de la 109. Dejaron siete reabiertas (MEDIO, carpetas disjuntas: caben a la
vez) con una regla nueva: **los casos de examen no se escriben en claro en el repositorio** (público); se excluyen por huella FNV-1a
calculada fuera del repo. Detrás de ellas:

- **119 → 120** (ALTO, en cadena por `catalogo.js`): la segunda publicación, semanas 1-2 y semana 3, con la comprobación de la exclusión
  (recuentos en la ENTREGA, nunca los casos) y las propuestas de tarea al día (plan A o B).
- **121** (ALTO, MANUAL, con Juan Luis delante): montar las tres tareas de la U4 en el panel, calcada de la 116, cuando la 119 y la 120
  digan qué prácticas quedan publicadas. Desbloquea la 29 del reparto de la U4 (F10 firmada). La 116 dejó dicho que los códigos de prueba
  60 y 61 no existen en el sistema nuevo: hace falta uno en el espacio de Juan Luis para probar sus tareas como alumno.


## Tareas 122-133: la unidad 5 (Decimals) en la app (2026-11-02, s-20261102T100120-6a6afb84)

Dadas de alta el 2-11 por la misma sesión que montó el reparto de la unidad 5
(`apuntes-1eso-bilingue/5. Decimals/reparto-unidad5/`), por decisión de Juan Luis («las piezas de la app se dan de alta como fichas
en `reparto-practicas-u2/`, no aquí»). La unidad 5 se da del **lun 18-1 al jue 28-1** (7 clases, dos semanas; prueba tipo test vie
22-1; examen final **jueves 28-1**, el 29 es festivo). Sus destrezas se citan con los ids de `5. Decimals/inventario-unidad5.tsv`,
**que aún no existe**: lo propone la tarea 01 de aquel reparto y lo aprueba la 02 con Juan Luis (firma F0; acta
`5. Decimals/inventario-unidad5-revision.md`). Las fichas 123-129 citan las destrezas por descripción y la 122 pone los ids
definitivos en `DESTREZAS` y en el §7 de `docs/practicas-unidad5.md`. **Hasta el acta no entran** los decimales periódicos, los
negativos, los cambios de unidad, las potencias ni las raíces de decimales (son puntos a decidir de la 02); si entran, se añaden
como ejercicio a la práctica que toque (propuesta en la ENTREGA), no como práctica nueva.

- **122** base de la unidad 5 (ALTO): `_comun/decimales.js` (decimal como **entero escalado**, inmutable; `deTexto` con coma o punto en
  los dos idiomas, `aTexto` por idioma, `enPalabras` y `lecturasValidas`, `comparar`, operar, `redondear`, `porPotenciaDe10`,
  `aFraccion`/`deFraccion` sobre `fracciones.js`, `ERRORES_TIPICOS`), `_comun/recta-decimales.js` (recta con décimas y centésimas),
  catálogo (ids **57-63**, `disponible: false`; `UNIDADES` con la U5 desde el 18-1), portada, `DESTREZAS`, esqueletos, tests (también
  `practicas-editor` y `practicas-espacio`, que cuentan unidades: lección de la 98).
- **123-129** las siete prácticas (MEDIO; carpetas disjuntas; todas en paralelo con la 122 LISTA): 123 `lee-decimales`, 124
  `compara-decimales`, 125 `suma-resta-decimales` (semana 1); 126 `multiplica-divide-decimales`, 127 `fraccion-decimal`, 128
  `errores5` (semana 2); 129 `leelo5` (toda la unidad). **Mejor con la hoja y el examen de su semana ya cerrados** en el reparto de
  la U5 (lección de la U4: las siete prácticas se reabrieron dos veces por copiar casos del papel escrito después): si existen,
  excluyen sus casos desde el principio (hoja en claro; examen por huella FNV-1a, nunca en claro).
- **130 → 131** revisión con clics y publicación por semana (ALTO, en cadena por `catalogo.js`), con el cotejo contra la hoja y los
  exámenes de la U5 y la propuesta de la tarea semanal (★ de ortografía: ejercicios 8 y 9; la de la semana 2 con entrega el **mié 27-1**):
  antes del **jue 14-1** y del **jue 21-1** (ideal, antes de Navidad; la portada no enseña la U5 hasta el 18-1).
- **132** las dos tareas de la U5 en el panel, con Juan Luis delante (ALTO, MANUAL), calcada de la 116 y la 121: desbloquea la tarea 24
  del reparto de la U5 (Classroom, firma F7).
- **133** el generador `src/ejercicios/decimales.js` de la app principal al día con el inventario (MEDIO; con F0), como la 112 con
  `fracciones_*`.

**Reglas de contenido de la unidad 5**: en cada ficha 122-133 (sección propia) y en `5. Decimals/reparto-unidad5/proyecto.md`. La
trampa propia de la unidad, heredera de la de las fracciones equivalentes: **un mismo número tiene muchas escrituras y todas son la
misma respuesta** (0,5 = 0,50 = 1/2; ninguna opción puede equivaler a otra por valor; aritmética en enteros escalados, nunca en
coma flotante); la coma en español y el punto en inglés (`three point seven five`); ni porcentajes ni proporcionalidad.

## Orden de prioridad de la unidad 5 (por los plazos de publicación)

1. **122** (base; ALTO) con la propuesta de inventario de la 01 de la U5 (con F0 firmada, mejor: ids definitivos), y a la vez **133**
   (MEDIO; con F0).
2. **Semana 1**: 123, 124, 125, 129 → **130** publica antes del jue 14-1.
3. **Semana 2**: 126, 127, 128 → **131** (jue 21-1).
4. **132** con Juan Luis, cuando la 130 y la 131 digan qué queda publicado.
Las tareas de Classroom de cada semana las programa la tarea 24 del reparto de la U5 cuando la 132 las haya montado.

## Tareas 134-143: la ortografía en bloques, con niveles adaptables (2026-11-03, s-20261103T110729-ca61fe3e)

Dadas de alta el 3-11 por encargo de Juan Luis: «Da de alta las tareas que sean necesarias para ampliar la sección de
ejercicios de ortografía. Que cubran todos los aspectos de la ortografía que deban dominar los alumnos de 1.º de ESO», con
cuatro preguntas de diseño hechas sobre la marcha y respondidas así (la coordinadora decide lo técnico y lo explica; lo de
aula es de él y puede cambiarlo):

1. **¿Dificultad creciente?** Sí, en dos planos. Dentro de cada bloque, los ejercicios van de más fácil a más difícil. Y
   dentro de cada ejercicio, **tres niveles** elegidos según cómo vaya el alumno (punto 3). En la secuencia de ★ semanales
   manda la urgencia (lo que más falla primero) y después la dificultad.
2. **¿Más allá de 1.º ESO para los avanzados?** Sí: el **nivel 3 de cada ejercicio** es «más allá de 1.º» (excepciones,
   cultismos, reglas finas) y solo llega a él quien va bien; y hay un **bloque de ampliación** entero (las cuatro formas de
   porque, formas verbales, siglas y prefijos, puntuación avanzada) que nunca es ★ y se ofrece aparte (la 142 propone cómo).
3. **¿Nivel adaptable?** Sí, y sale casi gratis: la base ya pasa a cada generador `sesion = { puntos, vidas, … }`. Con 0-2
   puntos, nivel 1; con 3-6, nivel 2; con 7 o más, nivel 3; y un tope por vidas (con 3 vidas, como mucho nivel 2; con 2 o
   menos, nivel 1). Quien falla no sube y no se desespera; quien acierta ve los tres últimos ítems del nivel 3 y no se aburre.
   Sin estado nuevo, sin tocar la base: `practicas/_comun/nivel.js` (tarea 134). Un alumno que falla cinco veces vuelve a
   empezar el ejercicio en el nivel 1, como hasta ahora.
4. **¿Subsecciones?** Sí, como **prácticas separadas** («bloques») bajo una sección «Ortografía» de la portada, y no como
   grupos del menú de una sola práctica: el progreso se guarda por posición y las tareas citan `['ortografia', n]`, así que en
   una práctica un ejercicio nuevo solo puede ir al final; con bloques, cada bloque se ordena por dificultad, un ejercicio
   futuro entra en el bloque que le toca, los menús son cortos y las tareas de contenido tocan carpetas disjuntas (caben a la
   vez). La práctica actual `ortografia` (45) no se toca: pasa a llamarse «Ortografía: lo más frecuente» y es el primer bloque.

### Los bloques

| id | slug | Bloque | Ejercicios (en orden de dificultad) | Tarea |
|---|---|---|---|---|
| 45 | `ortografia` | Ortografía: lo más frecuente | los 11 de siempre (a/ha, e/he, echo/hecho, ¿está bien escrita?, porque/por qué, vocativo, comas de significado, interrogativos, diacrítica, ¿? ¡! y espacios, sujeto-verbo) | hecha; niveles en la 143 |
| 64 | `ortografia-tildes` | Ortografía: las tildes | 1 la sílaba tónica (aguda, llana, esdrújula) · 2 ¿lleva tilde? (reglas generales) · 3 diptongos e hiatos · 4 las palabras de Matemáticas | 135 |
| 65 | `ortografia-letras` | Ortografía: las letras | 1 hay/ahí/ay, a ver/haber (y repaso de la h) · 2 b o v · 3 g o j y la diéresis · 4 otras letras (ll/y, mp/mb, r/rr, c/z/qu, -d/-z, cc, x/s) | 136 |
| 66 | `ortografia-puntuacion` | Ortografía: puntuación y mayúsculas | 1 mayúsculas · 2 el punto y la coma · 3 dos puntos, puntos suspensivos y el saludo · 4 el correo al profesor (y asunto/cuerpo) | 137 |
| 67 | `ortografia-palabras` | Ortografía: palabras que se confunden | 1 ¿junto o separado? · 2 suenan igual, se escriben distinto · 3 números y símbolos | 138 |
| 68 | `ortografia-ampliacion` | Ortografía: ampliación (más allá de 1.º; nunca ★) | 1 porque, por qué, porqué, por que · 2 formas verbales mal escritas · 3 siglas, abreviaturas y prefijos · 4 puntuación avanzada | 139 |

Los ids 57-63 son de la unidad 5 (tarea 122). Todos los bloques: `unidad: 3, transversal: true, seccion: 'ortografia'`,
`idioma: 'es'`, nombre y detalle en los dos idiomas.

### Qué aspecto de la ortografía de 1.º ESO se trabaja dónde

Inventario hecho con los saberes básicos de Lengua Castellana del Real Decreto 217/2022 (corrección ortográfica en la
producción escrita; reflexión sobre la lengua) y del Decreto 235/2022 de la Región de Murcia, tal como los despliegan los
libros de texto de 1.º ESO, más los errores que Juan Luis ha ido apuntando en los textos de sus alumnos (memoria «Ejercicio
de ortografía», 23 y 25-10). El texto literal de los decretos no se consultó: la búsqueda del 3-11 no dio el párrafo exacto.

| Aspecto | Dónde | Nivel 3 (más allá de 1.º) |
|---|---|---|
| Sílaba tónica; agudas, llanas y esdrújulas | tildes 1 | sobresdrújulas, compuestos, cuatro sílabas con diptongo |
| Reglas generales de acentuación | tildes 2 | monosílabos sin tilde (fue, dio, ti), -y y -s tras consonante, adverbios en -mente, mayúsculas con tilde |
| Diptongos, triptongos e hiatos | tildes 3 | hiatos con h, triptongos, ui/iu, aún/aun en frase |
| Tilde diacrítica | ortografia 9 (hecho) | — |
| Interrogativos y exclamativos | ortografia 8 (hecho) | — |
| Vocabulario de Matemáticas y numerales con tilde | tildes 4 | raíz, isósceles, algoritmo, decimotercero… |
| La h: hay/ahí/ay, a ver/haber; a/ha, e/he, echo/hecho | letras 1; ortografia 1-4 (hecho) | habría/abría, repaso con frases difíciles |
| b/v | letras 2 | excepciones (árabe, hervir, movilidad) y homófonos |
| g/j, gue/gui, güe/güi | letras 3 | diéresis, excepciones (tejer, crujir), palabras «de memoria» |
| ll/y, m ante p y b, r/rr, c/z/qu, -d/-z final, cc, x/s | letras 4 | -d/-z final, cc/c, x/s |
| Mayúsculas | puntuación 1 | cargos, genéricos geográficos, instituciones, títulos de obras, tras los dos puntos del saludo |
| Punto, coma en enumeraciones, coma con pero/aunque y conectores | puntuación 2 (vocativo: ortografia 6; significado: 7; sujeto-verbo: 11) | etc., conectores en medio, punto fuera del paréntesis |
| Dos puntos, puntos suspensivos, saludo de carta y correo | puntuación 3 | punto y coma, raya de diálogo, signos fuera de las comillas |
| ¿? ¡! y espacios | ortografia 10 (hecho) | — |
| Escritura digital: del chat al correo; asunto y cuerpo | puntuación 4 | registro, despedida, asunto/cuerpo |
| porque / por qué | ortografia 5 (hecho) | porqué y por que: ampliación 1 |
| Palabras juntas y separadas | palabras 1 | conque/con que/con qué, por que, a sí mismo, sinfín |
| Homófonos | palabras 2 | bienes/vienes, sabia/savia, grabar/gravar… |
| Numerales en letras, apócopes, ordinales, símbolos de unidades | palabras 3 | símbolos (kg, km, h, min, s), €, compuestos con tilde |
| Formas verbales que se escriben mal | ampliación 2 | impersonales de haber |
| Siglas, abreviaturas, prefijos | ampliación 3 | guion ante mayúscula o cifra, currículums |
| Punto y coma, raya, comillas, paréntesis | ampliación 4 | inciso del narrador, dos puntos frente a punto y coma |

**Fuera**: la gramática (leísmo, dequeísmo, concordancia, «si tendría»), salvo las impersonales de haber en la ampliación;
la separación silábica a final de línea; los extranjerismos y los latinismos. Si Juan Luis quiere alguno, es un ejercicio más
en el bloque que toque (al final del bloque), no un bloque nuevo.

### Plan de ★ semanales (propuesta; la fecha la fija la tarea del panel de cada unidad con la ENTREGA de la publicación)

Sigue al calendario del 25-10 (`apuntes-1eso-bilingue/comun/CALENDARIO-CURSO-2026-27.md`), que llega hasta `ortografia` 11
en la U6 · 2. Orden: primero lo que más falla y lo más fácil; la ampliación nunca.

| Semana | ★ | Lo publica |
|---|---|---|
| U6 · 3 (lun 15-2) | `['ortografia-puntuacion', 1]` Mayúsculas | 140 (jue 11-2) |
| U6 · 4 (lun 22-2) | `['ortografia-letras', 1]` hay, ahí, ay; a ver, haber | 140 |
| U7 · 1 (lun 1-3) | `['ortografia-tildes', 1]` La sílaba tónica | 141 (jue 25-2) |
| U7 · 2 (lun 8-3) | `['ortografia-tildes', 2]` ¿Lleva tilde? | 141 |
| U7 · 3 (15-3 o tras Semana Santa) | `['ortografia-tildes', 3]` Diptongos e hiatos | 141 |
| U7 · 4 (lun 12-4) | `['ortografia-tildes', 4]` Las palabras de Matemáticas | 141 |
| U7 · 5 (lun 19-4) | `['ortografia-palabras', 1]` ¿Junto o separado? | 142 (jue 15-4) |
| U8 · 1 (lun 26-4) | `['ortografia-letras', 2]` b o v | 140 |
| U8 · 2 (mar 4-5) | `['ortografia-letras', 3]` g o j | 140 |
| U8 · 3 (lun 10-5) | `['ortografia-letras', 4]` Otras letras | 140 |
| U8 · 4 (lun 17-5) | `['ortografia-puntuacion', 2]` El punto y la coma | 140 |
| U8 · 5 (lun 24-5) | `['ortografia-puntuacion', 3]` Dos puntos, puntos suspensivos y el saludo | 140 |
| U8 · 6 (lun 31-5) | `['ortografia-palabras', 2]` Suenan igual, se escriben distinto | 142 |
| Junio · 1 (lun 14-6) | `['ortografia-palabras', 3]` Números y símbolos | 142 |
| Junio · 2 (lun 21-6) | `['ortografia-puntuacion', 4]` El correo al profesor | 140 |

La tabla del calendario en los apuntes **no se edita desde este reparto** (condición de `autorizaciones.md`): la actualiza
Juan Luis o una sesión de los apuntes con las ENTREGA de 140-142.

### Las tareas

- **134** base (ALTO, 2 h; no en paralelo con 122, 130, 131): catálogo (64-68, `seccion`, nombre de la 45), sección
  «Ortografía» de la portada, `_comun/nivel.js` (umbrales, tope por vidas, `?nivel=` en «Probar sin código», `elegirDeNivel`,
  `etiquetaNivel`), `_comun/ortografia.js` (hueco, elegir, tocar, dos pasos), esqueletos, `docs/practicas-ortografia.md`, tests.
- **135-139** los cinco bloques (carpetas disjuntas; todas en paralelo con la 134 LISTA): 135 tildes (MEDIO), 136 letras
  (MEDIO), 137 puntuación (MEDIO), 138 palabras (**ALTO**: es donde más dobles formas válidas hay), 139 ampliación (**ALTO**,
  última en prioridad). Bancos con `nivel` en cada ítem, ≥ 16 por nivel, equilibrados, nunca por encima del nivel; cada
  ficha trae el reparto de ítems por nivel y sus trampas de la RAE.
- **140 → 141 → 142** revisión con clics, **lectura de todos los ítems** y publicación (ALTO, en cadena por `catalogo.js`),
  con la propuesta de ★ de su tramo y, en la 142, cómo ofrecer la ampliación.
- **143** niveles en los 11 ejercicios de la 45 (MEDIO, sin plazo, última): solo `nivel` en los ítems aprobados y frases
  nuevas donde un nivel quede corto; nada aprobado se toca.

### Reglas de contenido de la ortografía

Valen las comunes 4, 8 y 9. Y además (copiadas en cada ficha 135-143):

1. **Solo español**: `idioma: 'es'`; nombre y detalle en `{ es, en }` («Spanish spelling: …»).
2. **Regla de oro, versión ortografía**: ninguna opción puede ser también correcta; nunca como hueco ni como distractor dos
   formas que la RAE admita (lista de abajo); si la forma depende del sentido, la frase fuerza una sola lectura o se
   descarta (o va como «¿qué frase dice esto?»).
3. **Tres niveles por ejercicio** (1: lo que todo alumno de 1.º debe dominar y lo que más falla; 2: el resto de 1.º; 3: más
   allá), ≥ 16 ítems por nivel (≥ 12 si es de tocar o de tres opciones), equilibrados (≤ 60 % por botón), y el generador
   nunca da un ítem por encima del nivel de `nivelDe(sesion)`; el test lo comprueba por fuerza bruta.
4. **Frases cortas de la vida del instituto y de casa**, nombres inventados, nada ofensivo; realismo.
5. **Feedback ligado al ítem**: la regla aplicada a esa palabra o frase, con la buena en `<b>` y a la vista tras el fallo.
6. **`error` estable por confusión** (`v-por-b`, `sin-tilde-llana`), `^[a-z0-9-]{1,40}$`; `respuesta`, lo que puso el alumno.
7. **Palabras de uso en 1.º ESO**; las de Matemáticas, del vocabulario del curso.
8. **Dudas en `dle.rae.es`, `rae.es/dpd/` y `fundeu.es`** (solo lectura): lo que la RAE admita de dos maneras, fuera; lo dudoso,
   fuera; lo que un libro viejo diga distinto de la Ortografía de 2010, fuera.
9. **Nada de gramática** salvo lo que la ficha de la ampliación nombre; nada de división silábica a final de línea.

### Lo que nunca es distractor (dos formas válidas, o recomendación y no regla)

solo / sólo · este, ese, aquel con y sin tilde · aún / aun fuera de contexto · guion, truhan, hui, fie, rio, frio, Sion, Ruan
(monosílabos sin tilde desde 2010) · período / periodo, vídeo / video, cardíaco / cardiaco, olimpíada / olimpiada, alvéolo /
alveolo, policíaco / policiaco, fútbol / futbol, chófer / chofer, icono / ícono, élite / elite · kilómetro / quilómetro,
octógono / octágono, cinc / zinc, biznieto / bisnieto · enseguida / en seguida, deprisa / de prisa, aprisa / a prisa, enfrente /
en frente, asimismo / así mismo (como «también»), adonde / a donde, entretanto / entre tanto, bocabajo / boca abajo, sobremanera
/ sobre manera, alrededor / al rededor, en medio / enmedio (estas dos, desde el 6-11: propuesta de la 138, DPD 2.ª ed.) · treintaiuno / treinta y uno (y todos los 31-99) · undécimo / decimoprimero, duodécimo / decimosegundo,
decimotercero / décimo tercero (13.º-29.º), onceavo y doceavo como ordinales (el DLE los recoge) · imprimido / impreso, freído /
frito, proveído / provisto, iros / idos, los imperativos con -ros · posguerra / postguerra, clubs / clubes, OVNI / ovni, los
extranjerismos (wasap / WhatsApp, güisqui / whisky) · l / L (litro), 5 % / 5%, 5 € / 5€, 1.º / 1º, n.º / nº, 12 000 / 12.000
(la RAE pide espacio; los materiales del curso llevan punto) · veintiún alumnas / veintiuna alumnas, la primer vez · comillas
inglesas / latinas · coma / punto y coma en frases cortas · casa / caza, cocer / coser y todo par que solo sea homófono con
seseo (en Murcia se distinguen) · «Mar Menor» (el genérico es parte del nombre) · Sol / sol, Luna / luna, Tierra / tierra,
Internet / internet, Ayuntamiento / ayuntamiento, Estado / estado, Iglesia / iglesia (dependen del sentido) · «examen de
Matemáticas» / «las matemáticas» (asignatura frente a ciencia: solo contextos inequívocos de asignatura).

## Orden de prioridad de la ortografía (por los plazos de publicación)

1. **134** (base; ALTO; LIBRE desde el 3-11; plazo mar 1-12). Mientras, nada más puede empezar.
2. Con la 134 LISTA, **a la vez**: 136 y 137 (MEDIO; plazo mar 26-1), 135 (MEDIO; mar 9-2), 138 y 139 (ALTO; mar 23-3) y 143
   (MEDIO; sin plazo). Caben seis sesiones sin estorbarse (carpetas disjuntas); por plazos, primero 137 y 136.
3. **140** (jue 11-2) → **141** (jue 25-2) → **142** (jue 15-4), en cadena por `catalogo.js`.
4. La tarea del panel de cada unidad (U6, U7, U8: las dan de alta sus montadoras en este reparto) monta los ★ con las ENTREGA
   de 140-142; la tabla del calendario de los apuntes la actualiza Juan Luis o una sesión de los apuntes.

## Tareas 144-161: la unidad 6 (Algebra) en la app (2026-11-03, s-20261103T140356-12629e13)

Dadas de alta el 3-11 por la misma sesión que montó el reparto de la unidad 6
(`apuntes-1eso-bilingue/6. Algebra/reparto-unidad6/`), por la regla de Juan Luis del 2-11 («las piezas de la app se dan de alta
como fichas en `reparto-practicas-u2/`, no en el reparto de la unidad»). La unidad 6 se da del **lun 1-2 al vie 26-2** (16 clases,
cuatro semanas; pruebas tipo test los viernes 5-2, 12-2 y 19-2; tipo test 4 sin día; examen final el **viernes 26-2**). Es la
primera unidad con letras. Sus destrezas se citan con los ids de `6. Algebra/inventario-unidad6.tsv`, **que aún no existe**: lo
propone la tarea 01 de aquel reparto y lo aprueba la 02 con Juan Luis (firma F0; acta `6. Algebra/inventario-unidad6-revision.md`).
Las fichas 145-155 citan las destrezas por descripción y la 144 pone los ids definitivos en `DESTREZAS` y en el §7 de
`docs/practicas-unidad6.md`. **Hasta el acta no entran** `x²`, las sucesiones, los casos `ax = b` sin solución o con infinitas, `x`
en el denominador ni los denominadores con paréntesis (son puntos a decidir de la 02); si entran, se añaden como ejercicio a la
práctica que toque (propuesta en la ENTREGA), no como práctica nueva. Los números 134-143 y los ids 64-68 son de la ampliación de
la ortografía (otra coordinadora, el mismo día; acordado por mensaje): su tarea 140 publica los ★ de ortografía de las semanas 3 y
4 de la U6.

| id | slug | nombre (es / en) | nEjercicios | semana (bloque de la portada) | destrezas (descripción; ids tras F0) |
|---|---|---|---|---|---|
| 69 | `traduce` | Del enunciado al álgebra / From words to algebra | 4 | 1 | traducir una frase a una expresión (el doble, la mitad, tres más que, tres menos que, el siguiente, consecutivos) y una expresión a una frase; situaciones (un plan de 5 € al mes más 2 € por giga: `5 + 2g`); si el acta las admite, sucesiones (`2n + 1`) |
| 70 | `valor-numerico` | Valor numérico / Evaluate | 3 | 1 | sustituir un valor (natural, entero, fracción sencilla según el acta) en `ax + b`, `a(x ± b)` y, si el acta lo admite, `x² ± c`; completar una tabla de valores; «¿para qué valor vale…?» (tanteo, preludio de la ecuación, solo si el acta lo admite) |
| 71 | `terminos-semejantes` | Términos semejantes / Like terms | 4 | 1 | ¿son semejantes?; reducir (`5x + 2x − 3x`, `7x + 2y − 3x + y`); coeficiente y parte literal; cazar el error (`3x + 2 = 5x`, `x · x = 2x`) |
| 72 | `es-solucion` | ¿Es solución? / Is it a solution? | 4 | 2 | comprobar sustituyendo; ¿qué ecuación tiene solución 5? (opciones con soluciones distintas); identidad o ecuación (si el acta); escribe una ecuación con solución dada (campo libre: cualquier ecuación válida) |
| 73 | `transposicion` | Pasa al otro lado / Move it across | 5 | 2 | los cuatro niveles del guión con números (`3 + 2 = 5 → 3 = 5 − □`; `3 · 2 = 6 → 3 = 6 : □`; bidireccional; con jerarquía); ecuaciones de una operación; de dos operaciones paso a paso; `3x = 12` frente a `12x = 3` (fracción irreducible) |
| 74 | `resuelve` | Resuelve / Solve it | 4 | 3 | `x` en los dos miembros sin paréntesis ni denominadores: elegir el paso siguiente correcto; escribir la solución (negativa o fracción); ¿cuál es el primer paso?; comprobar |
| 75 | `parentesis-algebra` | Paréntesis / Brackets | 4 | 3 | quitar paréntesis (`3(x − 2)`, `−(x − 2)`, `−2(3 − x)` con enteros); elegir el desarrollo correcto; resolver con paréntesis; cazar el error (`3(x − 2) = 3x − 2`) |
| 76 | `denominadores` | Quita denominadores / Clear the fractions | 4 | 3 | el m.c.m. por el que hay que multiplicar; elegir la ecuación equivalente sin denominadores; resolver `x/2 + x/3 = 5`; `x/7 = 24/7` |
| 77 | `problemas-ecuaciones` | Problemas con ecuaciones / Word problems | 5 | 4 | qué es `x`; qué ecuación plantea el problema (opciones no equivalentes); resolver y contestar (campo); interpretar (¿qué pide: la edad de la hermana, no `x`?); ¿tiene sentido la solución? (7,5 personas) |
| 78 | `errores6` | Caza el error / Spot the mistake | 3 | 4 (toda la unidad) | los errores típicos de la unidad como resoluciones con un paso mal (el signo al transponer, el factor que pasa restando, la distributiva, el m.c.m., los términos no semejantes) |
| 79 | `leelo6` | Léelo en inglés / Say it in English | 4 | toda la unidad | vocabulario: unknown, like terms, coefficient, solve for x, both sides, twice, three more than, consecutive, equation, solution, check, brackets, expand; leer `2x + 3` (*two x plus three*) y `x/2` (*x over two*); las consignas de examen |

- **144** base de la unidad 6 (ALTO): `_comun/algebra.js` (expresión lineal `a·x + b` y ecuación con **fracciones exactas** de
  `fracciones.js`; `deTexto` sin `eval` para lo que teclea el alumno; `aTexto`/`aHtml` con la notación del acta; `enPalabras` y
  `lecturasValidas` en los dos idiomas; `expandir`, `reducir`, `resolver`, `esSolucion`, `pasos`, `sinDenominadores`;
  `ERRORES_TIPICOS`; `FRASES` del hilo de traducción), catálogo (ids **69-79**, `disponible: false`; `UNIDADES` con la U6 desde el
  1-2), portada (cinco bloques), `DESTREZAS`, esqueletos, tests (también `practicas-editor` y `practicas-espacio`, que cuentan
  unidades: lección de la 98).
- **145-155** las once prácticas (MEDIO; carpetas disjuntas; todas en paralelo con la 144 LISTA): 145 `traduce`, 146
  `valor-numerico`, 147 `terminos-semejantes` (semana 1); 148 `es-solucion`, 149 `transposicion` (semana 2); 150 `resuelve`, 151
  `parentesis-algebra`, 152 `denominadores` (semana 3); 153 `problemas-ecuaciones` (semana 4); 154 `errores6`, 155 `leelo6` (toda la
  unidad). **Mejor con la hoja y el examen de su semana ya cerrados** en el reparto de la U6 (lección de la U4): si existen, excluyen
  sus casos desde el principio (hoja en claro; examen por huella FNV-1a de la forma canónica, nunca en claro).
- **156 → 157 → 158 → 159** revisión con clics y publicación por semana (ALTO, en cadena por `catalogo.js`), con el cotejo contra la
  hoja y los exámenes de la U6 y la propuesta de la tarea semanal (★ de ortografía: `['ortografia', 10]` y `['ortografia', 11]` en
  las semanas 1 y 2; `['ortografia-puntuacion', 1]` y `['ortografia-letras', 1]` en las 3 y 4, de la ENTREGA de la 140): antes del
  **mié 27-1**, **jue 4-2**, **jue 11-2** y **jue 18-2** (la portada no enseña la U6 hasta el 1-2).
- **160** las cuatro tareas de la U6 en el panel, con Juan Luis delante (ALTO, MANUAL), calcada de la 116, la 121 y la 132; se puede
  montar por semanas; desbloquea la tarea 34 del reparto de la U6 (Classroom, firma F11).
- **161** los generadores `src/ejercicios/expresiones_algebraicas.js` y `ecuaciones_primer_grado.js` de la app principal al día con
  el inventario (MEDIO; con F0), como la 112 con `fracciones_*` y la 133 con `decimales.js`: `items`, distractores de errores típicos,
  nunca opciones equivalentes, fracciones exactas en vez de `redondear`.

**Reglas de contenido de la unidad 6**: en cada ficha 144-161 (sección propia) y en `6. Algebra/reparto-unidad6/proyecto.md`. La
trampa propia de la unidad, heredera de la de las fracciones equivalentes y las escrituras de un decimal: **dos expresiones
equivalentes son la misma respuesta, y dos ecuaciones con la misma solución también** (`2x + 3` y `3 + 2x`; `x/2` y `½x`; forma
canónica con fracciones exactas, nunca coma flotante ni `eval`); la notación del acta (`3x`, `x/2` como fracción, `·` solo entre
números); ni porcentajes, ni segundo grado, ni sistemas, ni dos incógnitas.

## Orden de prioridad de la unidad 6 (por los plazos de publicación)

1. **144** (base; ALTO) con la propuesta de inventario de la 01 de la U6 (con F0 firmada, mejor: ids definitivos), y a la vez **161**
   (MEDIO; con F0).
2. **Semana 1**: 145, 146, 147, 155 → **156** publica antes del mié 27-1.
3. **Semana 2**: 148, 149 → **157** (jue 4-2). **Semana 3**: 150, 151, 152 → **158** (jue 11-2). **Semana 4**: 153, 154 → **159** (jue 18-2).
4. **160** con Juan Luis, por semanas, cuando cada publicación diga qué queda publicado (la semana 1 antes del mié 27-1).
Las tareas de Classroom de cada semana las programa la tarea 34 del reparto de la U6 cuando la 160 las haya montado.

## Tareas 162-163: tercera publicación de la U4, las cinco prácticas sin publicador (2026-11-05, s-20261105T221931-c3838727)

Dadas de alta el 5-11 por encargo de Juan Luis («PU2: tarea de publicación. Dala de alta.»). La 119 y la 120 (2-11) publicaron
`equivalentes` y `compara` y reabrieron otra vez las cinco prácticas de las semanas 2 y 3 de la U4; las cinco reabiertas se cerraron ese
mismo día (LISTAS, sin publicar) y ninguna tarea las publicaba. Sin publicarlas no avanzan la 121 (semanas 2 y 3 en el panel) ni la tarea
29 del reparto de la U4 (Classroom).

- **162 → 163** (ALTO, en cadena por `catalogo.js` y `docs/practicas-unidad4.md`, como 119 → 120): la 162 publica `fraccion-de` y
  `suma-resta` (semana 2; antes del jue 17-12) y la 163 `multiplica-divide`, `combinadas-fracciones` y `errores4` (semana 3; antes del mar
  22-12, límite jue 7-1), mejor las dos antes del mar 8-12 (plazo de la 121). Cada una deja al día la propuesta de la tarea de su semana,
  que la 121 monta con Juan Luis. **No van a la vez que la 122** (base de la U5, EN CURSO desde el 5-11 a las 22:20Z), que también toca
  `catalogo.js`: la 162 se coge cuando la 122 esté LISTA (la 134, que tenía `catalogo.js` sin commitear, cerró el 5-11, 43a2c00).

## Tareas 164-168: lo que Juan Luis decidió el 6-11 sobre las propuestas pendientes (2026-11-06, s-20261106T125246-dae3dde3)

Dadas de alta el 6-11 por la coordinadora s-20261106T125246-dae3dde3, con Juan Luis respondiendo a la lista de decisiones pendientes de todos
los repartos («Hazlo tú», «Resuélvelo», «Decide tú»). Detalle y porqués en `hechos/notas/s-20261106T125246-dae3dde3-altas-164-168.md`.

- **164** (MEDIO, 45 min) enlace «probar» por ejercicio en el editor de tareas, y **165** (MEDIO, 25 min)
  `docs/practicas-como-empezar.md` en una línea: las propuestas 1 y 2 de la 113, aprobadas el 6-11; antes del lun 14-12.
  Encadenables (ficheros disjuntos); la 165 no va a la vez que la 140 o la 141 (`README.md`).
- **166** (MEDIO, 1 h) **toda tarea puntúa sobre 100** (decisión de Juan Luis: «Las tareas deben puntuarse sobre 100»): cada
  ejercicio que cuenta pesa 100 / (★ + `nElegir`); las de 6 ★ + 4 no cambian de nota.
- **167** (MEDIO, 45 min, con Juan Luis para la ejecución) el banco REST (`herramientas/probar-reglas.mjs`) guarda y restaura lo
  que encuentra en la cuenta de prueba A, en vez de borrarlo (propuesta 10 de la 113).
- **168** (ALTO, 50 min) revisar los ~45 ítems nuevos de la 143 (Juan Luis: «resuélvelo tú de manera autónoma») y poner
  alrededor / en medio en el §6 de `docs/practicas-ortografia.md`. La 140 la espera por ese fichero.

Decisiones del 6-11 que cambian fichas existentes (sin tarea nueva):
- **126**: ejercicio 6 «Combinadas» (opción (b) de la ENTREGA de la 122, punto 1; Juan Luis), `nEjercicios` 5 → 6 en
  `catalogo.js` y el total de la U5 en `tests/practicas-comun.test.js` lo cambia la propia 126, que por eso **no va a la vez
  que la 162 ni la 163** (ni ninguna otra con `catalogo.js`).
- **125 y 126, contextos** (Juan Luis lo dejó a la coordinadora): la cena y las botellas, solo en el papel; **la vuelta entra en la
  app solo dentro de la fruta al peso y la gasolina**, porque U5-1A-01 es nuclear y sin ella la app no la practicaría, y así los
  contextos del papel (tienda de varios artículos, cena, botellas) siguen sin verse antes del examen.

