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
| **ALTO** | Opus 5 · Alto | La base común (01), el árbol de factores (06), el Venn de factores primos (09), la revisión final (18) |
| **MEDIO** | Sonnet 5 · Medio | Las demás aplicaciones (incluida la 19), y la migración de `divisores/` (17) |
| **BAJO** | Haiku 4.5 · Medio | No hay tareas de esta banda (la 34 pasó a MEDIO porque toca el test común) |

En VS Code, «Default (recommended)» y «Opus (1M context)» son el mismo Opus 5. El
esfuerzo es el deslizador de debajo de la lista de modelos.

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
