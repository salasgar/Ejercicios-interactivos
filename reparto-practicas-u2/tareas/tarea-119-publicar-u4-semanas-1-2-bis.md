# Tarea 119 · Segunda publicación de `equivalentes` (100), `compara` (102), `fraccion-de` (103) y `suma-resta` (104), tras las reabiertas del 30-10, con las propuestas de tarea de las semanas 1 y 2 de la unidad 4 al día

Actualizado: 2026-10-30 (alta de la coordinadora s-20261030T074933-c1fcc2b1: la 117 cerró ese día sin publicar ninguna de las cuatro)
Precondición: las **reabiertas del 30-10** de 100, 102, 103 y 104 (`hechos/reabiertas/10[0-4]--s-20261030T081542-dab2aa98-revision.md`) cerradas con terminada nueva · no en paralelo con la 120 ni con ninguna otra que toque `catalogo.js` o `docs/practicas-unidad4.md` · Disparo: MANUAL · **Plazo: `equivalentes` y `compara` publicadas antes del jue 10-12; `fraccion-de` y `suma-resta`, antes del jue 17-12.** La portada no enseña la U4 hasta el 14-12: publicar antes no las pone delante de nadie.
Duración esperada: 1 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: 120
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/119-publicar-u4-semanas-1-2-bis/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/catalogo.js` (solo `disponible` de las cuatro), `docs/practicas-unidad4.md` (la línea «**Publicadas** (a …)» y las menciones de las reabiertas)

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
   printf 'sesión: %s\ntarea: 119\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/119--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/119--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 119 con `abierto:` más antiguo (o igual y sid menor), añade a tu
   reclamo una línea `CEDIDA a <sid del otro>` y elige otra tarea.
5. Si el reclamo que encuentras está caducado (RELEVABLE en el tablón), relévalo con la
   línea `releva a: <sid anterior>` **en tu propio reclamo**; el suyo no se toca. Después
   mira qué dejó hecho: `ls practicas/`, `git log --oneline -5`, `git status -sb`, y la
   carpeta de salida. Lo que haya con tests en verde se hereda y se dice en la terminada;
   lo que no, se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** (todas las filas contra `hechos/` y la
   hora real; banda y «encadenable» recopiadas de las fichas) antes de empezar, y sigue
   con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.
7. Idempotencia: comprueba si `practicas/<tu slug>/` o tu test ya existen (de una sesión
   caída) antes de crearlos. Si existen, léelos y continúa desde ahí.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/119--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.



## Objetivo

**Segunda ronda.** La 117 (30-10) comprobó que lo que pedían las reabiertas anteriores estaba hecho y se veía bien en el navegador,
y **no publicó ninguna** porque las cuatro sacaban casos de los **exámenes semanales, del examen final y de las hojas** de la U4 (regla 6
de las fichas; los exámenes se escribieron después de la revisión de la 109). Sus reabiertas (MEDIO) excluyen esos casos: los de las hojas
en claro y los de los exámenes **por huella FNV-1a**, nunca en claro, porque el repositorio es público. Esta tarea comprueba que la
exclusión es completa y correcta, repite la revisión en el navegador y publica. Lee primero la ENTREGA de la 117
(`$R/salidas/117-publicar-u4-semanas-1-2/ENTREGA.md`): dice qué hizo bien cada práctica, para no repetirlo entero.

Las publicaciones de la U4 cerraron sin publicar estas cuatro: la **109** publicó `que-fraccion`, `simplifica` y `leelo4` y reabrió
`equivalentes` (100) y `compara` (102); la **110** reabrió `fraccion-de` (103) y `suma-resta` (104) y no publicó nada. Las cuatro
reabiertas están cerradas con terminada nueva (28 y 29-10), pero **ninguna tarea las publica**: eso es esta. Es la revisión que
no puede hacer un test: el significado y el clic. Verifica y, si algo falla, **reabre; no corrige** (salvo erratas de una línea
en un texto, que se arreglan y se dicen). La que no pase se queda sin publicar con su reabierta nueva, y las demás se publican
igual.

## Siguiente paso

1. Lee las reabiertas de las cuatro (`ls $R/hechos/reabiertas/ | grep -E '^(100|102|103|104)--'`: qué fallaba y «Qué tiene que
   quedar»), las terminadas nuevas que las cierran y sus `ENTREGA.md`, y las propuestas de tarea de las semanas 1 y 2:
   `$R/salidas/109-publicar-u4-semana1/ENTREGA.md` y `$R/salidas/110-publicar-u4-semana2/ENTREGA.md` (si una carpeta no se
   llama así, `ls $R/salidas/ | grep -E '^(109|110)-'`).
2. `npm run servir` y abre cada práctica por su URL (`http://localhost:8080/practicas/<slug>/`) con el código de prueba 61
   (`KTFN`; nunca el de un alumno ni `AJJN`), o con «Probar sin código».

## Qué hay que hacer

1. **Lo que pedían las reabiertas, comprobado en el navegador y con clics**, nunca con la tecla Intro (Chrome headless por el
   protocolo de depuración, como la 115, si la extensión no está): en cada práctica, los ejercicios que cambiaron.
2. **Regla de oro, a mano**, en los ejercicios que hayan cambiado y, en los demás, una muestra: genera al menos 30 ítems de cada
   ejercicio tocado (un script en el scratchpad con las funciones de su `logica.js`) y lee cada distractor: ¿podría darse por
   bueno? En fracciones, **compara por valor** (`Fraction` o `_comun/fracciones.js`): dos opciones equivalentes son la misma
   respuesta. Mira también el realismo con las cotas del acta y 3000 ítems, no con la muestra.
3. **En el navegador**, a 375 px y en ancho, en español y en inglés: un ítem acertado y uno fallado de **cada** ejercicio de las
   cuatro prácticas, mirando que el feedback dice qué ha pasado con esos números, que las fracciones se ven enteras y que no hay
   excepciones en la consola.
4. **Publicar**: `disponible: true` en `catalogo.js` de las que pasen (commit con rutas explícitas). La portada oculta la U4 hasta el
   14-12, así que la comprobación es por URL y, si hace falta, cambiando la fecha del sistema solo en tu guion de prueba (nunca
   en el código). En `docs/practicas-unidad4.md`, la línea de publicadas y las menciones de las reabiertas.
5. **Las propuestas de tarea de las semanas 1 y 2, al día**: di en la ENTREGA, para cada una, si la propuesta de la 109 o de la 110
   vale tal cual ahora que estas prácticas están publicadas, o qué cambia (los ★ que llevaban «tras la reabierta»). **Juan Luis
   las monta en el panel** (como la 116 con la U3); tú no las creas.

## Datos de entrada

- El inventario y el acta de la unidad 4, solo lectura: `apuntes-1eso-bilingue/4. Fractions/inventario-unidad4.tsv` y
  `apuntes-1eso-bilingue/4. Fractions/inventario-unidad4-revision.md` (ruta base: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/`).
- Carpeta de la unidad, solo lectura: `apuntes-1eso-bilingue/4. Fractions/` (hojas, exámenes semanales, examen final: casos que no se copian).

## Cómo saber que ha terminado

- Cada una de las cuatro prácticas, o publicada (`disponible: true`) o con una reabierta nueva en `hechos/reabiertas/` y el motivo
  concreto (ítem, distractor, por qué).
- `npm test` sin fallos.
- Las dos propuestas de tarea, confirmadas o corregidas en la ENTREGA, y dichas a Juan Luis en tu último mensaje con su fecha
  (semana 1: tarea del lun 14-12 al jue 17-12; semana 2: del lun 21-12 al jue 7-1, con la Navidad en medio).

## Trampas conocidas

- (de la 115) Clic de verdad en Chrome headless: `Input.dispatchMouseEvent` (moved, pressed, released) en el centro del
  `getBoundingClientRect()` del botón visible, no `element.click()`. Tras un acierto la base pasa sola al siguiente ítem: el botón
  «Siguiente» solo sale tras un fallo. Un guion que resuelve el ítem leyendo el enunciado con expresiones regulares se queda viejo
  cuando cambian los textos: mira el enunciado que imprime antes de sacar conclusiones.
- (de la 109) Erratas de texto de una línea se arreglan y se dicen; cualquier otra cosa, reabierta.
- (de la U4) Dos fracciones equivalentes entre las opciones es el fallo típico de esta unidad y los tests lo buscan por valor: si una
  reabierta pedía ese filtro, comprueba con 3000 ítems que no queda ningún par equivalente.
- Si reabres una, se queda **sin publicador** otra vez: dilo en la terminada con su plazo, para que la coordinadora decida.
- (de la 119, 30-10) **Los exámenes se escriben después que las prácticas**: la regla 6 no se mide solo con los `RESERVADOS` de
  `comprobar-semanaN.py`, sino con los casos de verdad, `exámenes-semanales/semana-N/casos-examen-semanaN.tsv` (columna `enunciado_tex`)
  y los `.tex` del examen final. Un barrido de 20000 ítems por ejercicio con la clave «misma tarea, mismos datos» los encuentra en
  minutos. **Nunca escribas un caso de examen en claro en el repositorio** (código, tests, ENTREGA, hechos, mensaje de commit): es
  público y Pages sirve también `reparto-practicas-u2/`. Di dónde está y cuántos salen; en el código, por su huella.
- (de la 119) Un conjunto de claves escrito a mano tiene que normalizarse con la **misma función** que la clave del ítem: `pareja()`
  ordena cadenas y `'10/15' < '6/9'`, así que «6/9 y 10/15» no filtraba nada, y el test, con la misma lista, pasaba en verde.
- (de la 119) En el menú de una práctica, `[data-ejercicio]` empieza en **0**. Para leer el ítem en pantalla, `.operacion .frac` y sus
  dos `span`; el signo de una negativa está en el `.frac-neg` padre. Los puntos de la recta son `.fd-toque` con `aria-label` («0», «−1», «3/5»).

- (de la 117) **Los casos de examen no se escriben en claro en el repositorio**: ni en tu ENTREGA, ni en `hechos/`, ni en un mensaje de
  commit, ni en un test. Para comprobar la exclusión, un guion **en el scratchpad** lee los casos de `4. Fractions/exámenes-semanales/semana-*/
  casos-examen-semana*.tsv` y de `4. Fractions/examen-final/*.tex` (solo lectura), calcula las huellas con la misma función `huella()` de la
  práctica y las compara con su `HUELLAS_EXAMEN`; después genera 3000 ítems por ejercicio y comprueba que ninguno cae. En la ENTREGA solo
  recuentos («6 de 6 casos de U4-1C-12 excluidos; 0 de 3000 ítems coinciden»).
- (de la 117) La clave que se excluye tiene que ser la **misma** que genera la práctica (misma función de ordenar, mismo formato), o el
  filtro no filtra aunque el test pase: `equivalentes` ordenaba parejas como cadenas y «10/15 y 6/9» se le escapaba. Comprueba la clave
  con un caso cuyo orden de cadena no sea el natural.
- (de la 117) Los casos de las **hojas** sí van en claro (los alumnos ya las tienen): compáralos con los ejercicios de
  `4. Fractions/hojas-de-ejercicios/hoja-unidad4-semana*.tex`, por valor y por los dos huecos posibles de una igualdad.

## Prohibido (propio de esta tarea)

- Corregir el código de una práctica (más allá de una errata de texto de una línea): se reabre.
- Publicar otras prácticas, o tocar en `catalogo.js` algo que no sea `disponible` de estas cuatro.
- Crear las tareas de la semana en el panel o en `tareas.js`: las propuestas son para Juan Luis.
- Cambiar `UNIDADES` o la fecha desde la que la portada enseña la U4.

## Reglas de contenido de la unidad 4 (copia de `proyecto.md` y del acta del 26-10; lo común no se lee, por eso va aquí)

1. **Dos fracciones equivalentes son la misma respuesta**: ninguna opción puede equivaler a otra, y se comprueba **por valor**
   (`Fraction` o `_comun/fracciones.js`), nunca con decimales. Única excepción admitida por el acta: 42/63 en `U4-1C-13`/`1C-14`
   cuando se pide «la fracción irreducible».
2. **Ni decimales ni números mixtos.** Fracciones **negativas desde la semana 1** (escritura y signo, simplificar, comparar, recta),
   en la 2 sumar y restar (también con resultado negativo) y en la 3 producto, cociente y combinadas. **Potencias solo de base
   positiva** (sesión 7, jue 7-1); la base negativa no va en la app. 6/6 es impropia. Dividir por los dos métodos (inversa y en
   cruz) son respuestas equivalentes válidas.
3. **Regla de oro**: todo distractor inequívocamente falso y salido de un error típico (`ERRORES_TIPICOS` de `_comun/fracciones.js`)
   calculado con los números del ítem; nunca un número al azar.
4. **Realismo** (acta del 26-10): clase de 12 a 36 alumnos, pizza de 3 a 15 trozos, ahorros hasta 2000 €, instituto de 200 a 3000,
   depósito de coche de 20 a 90 L, botella hasta 3 L, garrafa hasta 50 L, 1000 km en coche; valen «la mitad», «un cuarto de hora»,
   «media pizza» en cualquier enunciado. La cota de cada contexto la comprueba su test con **todos** los ítems, no una muestra.
5. **Escritura e inglés**: producto con `·`, división con `:` (en inglés también `÷`); fracciones con `htmlFraccion`; inglés sencillo
   y la palabra no matemática que decide la respuesta aclarada entre paréntesis. Feedback ligado al error con los números del ítem.
6. **Casos que no copien** las hojas, los exámenes semanales ni el final de la U4 (`4. Fractions/hojas-de-ejercicios/`,
   `exámenes-semanales/`, `examen-final/`): los alumnos los verán en papel.
7. El ★ de **ortografía** de las tareas de la U4 son los ejercicios 5, 6 y 7 de `ortografia` (calendario en
   `apuntes-1eso-bilingue/comun/CALENDARIO-CURSO-2026-27.md`).

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 119, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-119.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/119--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/119--<sid>.md` con `parada por: mal cortada`
y la ruta de la incidencia, `ABANDONADA` en tu reclamo, y díselo al usuario. Si un paso te
pide **decidir** algo que va a durar (un cambio del contrato de la base, otro número de
ejercicios que el del catálogo, una colección nueva en Firestore) y esta tarea no es de
banda ALTA con el usuario delante, no lo decidas: entrégalo como propuesta en tu terminada
y sigue con lo que no dependa de ello.

## Al terminar

Por este orden (el del repositorio git):

1. `node --test tests/practicas-comun.test.js tests/practicas-<tu slug>.test.js` en verde y
   `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con reclamo vivo no
   es tuyo: anótalo en la terminada). Prueba la práctica en el navegador con
   `npm run servir` y http://localhost:8080/practicas/<slug>/ (los módulos ES no cargan
   abriendo el fichero), en una ventana estrecha (375 px) y en una ancha, en español y en
   inglés, y haz al menos un ítem de cada ejercicio acertando y fallando.
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas:
   `git add <rutas> && git commit -m "Práctica <slug>: <qué>" -- <rutas>`. Apunta el hash
   (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/119-publicar-u4-semanas-1-2-bis/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/119--<sid>.md`: hash del commit, ficheros (lo que dice
   `git show --stat`, no lo que crees), número de tests propios en verde, hora y
   **duración real** (de `abierto:` a ahora), y propuestas pendientes si las hay.
5. Añade `CERRADA` a tu reclamo (línea propia que empieza por esa palabra).
6. Choques encontrados → `$R/hechos/incidencias/<sid>.md`.
7. `git fetch origin`, relista `$R/hechos/` **ahora** y regenera `$R/_ESTADO.md` entero:
   todas las filas, el registro con una línea por fichero de `terminadas/`, banda y
   «encadenable» recopiadas de las fichas, leyenda de bandas de `proyecto.md`. Anota qué
   tareas pasan de BLOQUEADA a PENDIENTE. Si tu duración real difiere mucho de la estimada,
   díselo al usuario.
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

Si paras sin terminar: `$R/hechos/fallos/119--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni
  `practicas/_comun/` (salvo la tarea 01 y, en la unidad 3, la 79 y las de publicación 93-96 y la 115, y, en la unidad 4, las 109-111, 119 y 120, cada una en lo que declara), ni `css/estilos.css`, ni `README.md` (salvo
  01 y 18), ni `firestore.rules` ni `src/firebase.js` (salvo 01), ni fichas ajenas, ni
  nada de la carpeta de apuntes de iCloud. Si la base te falta algo, se propone en la
  terminada; no se parchea.
- `git add .`, `git add -A`, `git commit -a`, o un `add` separado del `commit`. El índice
  es compartido con otras sesiones del mismo árbol.
- Editar el código con `sed -i` o heredocs desde el shell: el candado de sesiones solo
  ve Edit/Write, y así otra sesión no sabe que el fichero está en uso. El código se edita
  con las herramientas de edición; `hechos/` sí se escribe desde el shell (un escritor).
- Reescribir un fichero de `hechos/` (solo `>>`), editar un reclamo ajeno, o regenerar el
  tablón de memoria sin relistar `hechos/`.
- Dependencias nuevas (npm, CDN): la app no tiene build y solo carga KaTeX y Firebase por
  CDN; las prácticas no usan ni siquiera KaTeX (exponentes con `<sup>`).
- Las reglas de contenido de la unidad que toque (en esta ficha y en `proyecto.md`): en la U4, opciones
  equivalentes por valor, decimales o números mixtos, potencias de base negativa, algo de una sesión posterior a la
  de la destreza, distractores que puedan ser verdad.
