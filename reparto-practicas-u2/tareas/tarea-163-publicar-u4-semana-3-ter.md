# Tarea 163 · Publicar `multiplica-divide` (105), `combinadas-fracciones` (106) y `errores4` (107) tras sus reabiertas del 2-11, con la propuesta de la tarea de la semana 3 de la unidad 4 al día

Actualizado: 2026-11-05 (alta de la coordinadora s-20261105T221931-c3838727, pedida por Juan Luis: «PU2: tarea de publicación. Dala de alta.»; la 120 reabrió las tres el 2-11 y las dejó sin publicador)
Precondición: las **reabiertas del 2-11** de 105, 106 y 107 (`hechos/reabiertas/10[5-7]--s-20261102T141053-b5277421-revision.md`) cerradas con terminada nueva (lo están: `hechos/terminadas/105--s-20261102T151807-d87a1a7a.md`, `106--s-20261102T152008-77e362a1.md`, `107--s-20261102T152304-2a463f3b.md`) · **162 LISTA** (comparten `catalogo.js` y `docs/practicas-unidad4.md`, en cadena detrás de ella; y la propuesta de la semana 3 lleva un «a elegir» de `suma-resta`, que publica la 162) · no en paralelo con ninguna otra que toque `catalogo.js` o `docs/practicas-unidad4.md` (122, 130, 131, 140-142, 144, 156-159; mira los reclamos vivos) · Disparo: MANUAL · **Plazo: publicadas antes del mar 22-12 (límite jue 7-1); mejor antes del mar 8-12**, que es el plazo de la 121 (Juan Luis monta la tarea de la semana 3 en el panel con esta ENTREGA, y la tarea 29 del reparto de la U4 la programa en Classroom para el lun 11-1). La portada no enseña la U4 hasta el 14-12: publicar antes no las pone delante de nadie.
Duración esperada: 40 min (tiempo de sesión, no de persona; tres prácticas, 11 ejercicios) · Banda de modelo: ALTO · Encadenable con: 162 (antes)
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/163-publicar-u4-semana-3-ter/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/catalogo.js` (solo `disponible` de las filas 53 `multiplica-divide`, 54 `combinadas-fracciones` y 55 `errores4`), `docs/practicas-unidad4.md` (la línea «**Publicadas** (a …)» y las menciones de las reabiertas, §6); y, solo para una errata de texto de una línea, `practicas/{multiplica-divide,combinadas-fracciones,errores4}/{textos,logica}.js` (declarándolo en la terminada)

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
   si hay commits que traer (`git pull --rebase origin main` si los hay; nunca `--autostash`).
   **Comprueba la precondición en el disco, no solo en el tablón**:
   `ls $R/hechos/terminadas/ | grep '^162--'` tiene que dar una terminada, ningún reclamo vivo de otra tarea que toque
   `catalogo.js` (lista de la precondición), y
   `git status --short practicas/_comun/catalogo.js docs/practicas-unidad4.md` tiene que salir **vacío**.
   Si `catalogo.js` sale modificado, es trabajo de otra sesión: no lo toques y no reclames.
3. Abre tu reclamo generando el sid **en el mismo comando** (probado en este Mac):
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -d '+80 minutes' +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -v+80M +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 163\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/163--$sid.md; echo $sid
   ```
   (80 min = 2 × la duración esperada). A partir de aquí tu sid es el del nombre de ese
   fichero (`ls $R/hechos/reclamos/163--*`); no lo guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 163 con `abierto:` más antiguo (o igual y sid menor), añade a tu
   reclamo una línea `CEDIDA a <sid del otro>` y elige otra tarea. Mira también que no haya
   ningún reclamo vivo de una tarea que toque `catalogo.js` (lista de la precondición): si lo
   hay, `CEDIDA (catalogo.js en uso por la NN)` y para.
5. Si el reclamo que encuentras está caducado (RELEVABLE en el tablón), relévalo con la
   línea `releva a: <sid anterior>` **en tu propio reclamo**; el suyo no se toca. Después
   mira qué dejó hecho: `git log --oneline -5`, `git status -sb`, la carpeta de salida y
   `grep -n "slug: '\(multiplica-divide\|combinadas-fracciones\|errores4\)'" practicas/_comun/catalogo.js`. Lo que haya
   con tests en verde se hereda y se dice en la terminada; lo que no, se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** (todas las filas contra `hechos/` y la
   hora real; banda y «encadenable» recopiadas de las fichas) antes de empezar, y sigue
   con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/163--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

`multiplica-divide`, `combinadas-fracciones` y `errores4` son las tres prácticas de la **semana 3** de la U4 y siguen sin publicar: las han
revisado la 111 (28-10), la 118 (30-10) y la 120 (2-11), y cada vez salía algún caso del papel (hojas o exámenes) que la práctica podía
generar. La 120 las reabrió por última vez el 2-11: a `multiplica-divide` le faltaba el ej. 11 de la hoja 2 y tres respuestas de U4-3C-11
del examen semanal 3; `combinadas-fracciones` sacaba dos casos de examen reordenados; `errores4`, tres igualdades de la hoja 2 con los
sumandos en otro orden. Las tres reabiertas se cerraron ese mismo día (commits d5106a2, 7b5c1e7 y 8fda62a), pero **ninguna tarea las
publicaba**: eso es esta.

Misma forma que la 162: verificar a mano (significado y clic) y publicar; si algo falla, **reabrir, no corregir** (salvo erratas de una
línea). La que no pase se queda sin publicar con su reabierta nueva, y las demás se publican igual. Sin esta publicación no puede
avanzar la 121 para la semana 3 (la tarea en el panel), ni, detrás, la tarea 29 del reparto de la U4 (Classroom).

## Siguiente paso

1. Lee la ENTREGA de la 162 (lo que aprendió y cómo probó) y la de la 120 (`$R/salidas/120-publicar-u4-semana-3-bis/ENTREGA.md`: el
   barrido del 2-11 y sus claves), las reabiertas del 2-11 de las tres (`ls $R/hechos/reabiertas/ | grep -E '^(105|106|107)--'`, la última
   de cada una: qué fallaba y qué tiene que quedar), las terminadas que las cierran y el apartado del 2-11 de sus ENTREGA
   (`$R/salidas/105-multiplica-divide/`, `106-combinadas-fracciones/`, `107-errores4/`), y la propuesta de la tarea de la semana 3
   (`$R/salidas/111-publicar-u4-semana3/ENTREGA.md`, «Propuesta de la tarea de la semana 3», confirmada por la 118 y la 120).
2. Mira si el papel ha cambiado desde el último barrido (2-11, 15:00Z): `find "<base>/4. Fractions/exámenes-semanales" "<base>/4. Fractions/examen-final" "<base>/4. Fractions/hojas-de-ejercicios" -type f \( -name '*.tex' -o -name '*.tsv' \) -newermt '2026-11-02 15:00'`
   (`<base>` = `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue`). El 5-11 no
   salía nada; si sale algo, ese fichero entra entero en el barrido.
3. `node --test tests/practicas-comun.test.js tests/practicas-multiplica-divide.test.js tests/practicas-combinadas-fracciones.test.js tests/practicas-errores4.test.js`
   (104/104 el 5-11) y `npm run servir`; abre cada práctica por su URL (`http://localhost:8080/practicas/<slug>/`) con «Probar sin código»
   (nunca el código de un alumno ni `AJJN`).

## Qué hay que hacer

1. **Lo que pedían las reabiertas, comprobado de verdad**: en `multiplica-divide`, que no sale ningún producto del ej. 11 de la hoja 2
   (en ningún orden) ni ninguna de las cuentas mal hechas de U4-3C-11 del examen semanal 3, y que el ej. 5 (potencias) es solo de base
   positiva; en `combinadas-fracciones`, que no sale ningún caso de U4-3A-01 y 3A-02 de los exámenes ni de la hoja 3 **reordenado**, y que la
   jerarquía sigue la regla de Juan Luis (saltarse un paso solo es fallo si cambia el valor); en `errores4`, que las igualdades de la hoja 2
   no salen con los sumandos en otro orden y que cada «error» es de verdad un error y uno solo. **Con tu propio barrido**, no con la clave
   de la práctica: un guion **en el scratchpad** (nunca en el repo) que lee los tres `casos-examen-semanaN.tsv` (con la columna
   `correcta`), los `examen-semanaN*.tex`, los `.tex` del final (también `adaptado-A`) y las tres hojas sin recuadros de apoyo, y genera
   20000 ítems por ejercicio (100000 en `combinadas-fracciones`) con las funciones de su `logica.js`. En la ENTREGA, solo recuentos.
2. **Regla de oro, a mano**, con al menos 30 ítems de cada ejercicio tocado y una muestra de los demás, comparando fracciones **por
   valor**; realismo con las cotas del acta sobre 3000 ítems.
3. **En el navegador**, con clics de ratón (nunca Intro), a 375 px y en ancho, en español y en inglés: un ítem acertado y uno fallado de
   **cada** ejercicio de las tres (11 ejercicios), feedback con los números del ítem, fracciones enteras en pantalla, consola limpia.
4. **Publicar**: `disponible: true` en `catalogo.js` de las que pasen (filas 53, 54 y 55; nada más de ese fichero). Commit con rutas
   explícitas; comprobación por URL (la portada oculta la U4 hasta el 14-12). En `docs/practicas-unidad4.md`, la línea de publicadas y las
   menciones de las reabiertas.
5. **La propuesta de la tarea de la semana 3, al día**: di en la ENTREGA si el plan A de la 111 (7 ★ + 3 a elegir, `['ortografia', 7]` el
   primer ★; tarea del **lun 11-1 al jue 14-1**, el final es el vie 15-1) vale tal cual ahora, o qué cambia; su «a elegir»
   `['suma-resta', 4]` vale solo si la 162 publicó `suma-resta`. Si alguna no se publica, el plan B (sin `multiplica-divide` no hay tarea de
   la semana 3 que valga). **Juan Luis la monta en el panel** (tarea 121); tú no la creas.

## Datos de entrada

- El inventario y el acta de la unidad 4, solo lectura: `apuntes-1eso-bilingue/4. Fractions/inventario-unidad4.tsv` y
  `apuntes-1eso-bilingue/4. Fractions/inventario-unidad4-revision.md` (ruta base: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/`).
- Carpeta de la unidad, solo lectura: `apuntes-1eso-bilingue/4. Fractions/` — `exámenes-semanales/semana-{1,2,3}/casos-examen-semanaN.tsv`
  y sus `.tex`, `examen-final/*.tex` (modelo 1, modelo 2, recuperación y adaptado-A), `hojas-de-ejercicios/hoja-unidad4-semana{1,2,3}.tex`:
  casos que no se copian.
- Las ENTREGA de 105, 106, 107, 111, 120 y 162 (solo lectura).

## Cómo saber que ha terminado

- Cada una de las tres prácticas, o publicada (`disponible: true` en el `catalogo.js` comiteado y empujado) o con una reabierta nueva en
  `hechos/reabiertas/` y el motivo concreto (ítem, distractor, por qué; nunca un caso de examen en claro).
- `npm test` sin fallos.
- La propuesta de la semana 3 confirmada o corregida en la ENTREGA, y dicha a Juan Luis en tu último mensaje con su fecha y con el aviso
  de que la 121 ya puede montarla.

## Trampas conocidas

- (de la 115) Clic de verdad en Chrome headless: `Input.dispatchMouseEvent` (moved, pressed, released) en el centro del
  `getBoundingClientRect()` del botón visible, no `element.click()`. Tras un acierto la base pasa sola al siguiente ítem: el botón
  «Siguiente» solo sale tras un fallo. Un guion que resuelve el ítem leyendo el enunciado con expresiones regulares se queda viejo
  cuando cambian los textos: mira el enunciado que imprime antes de sacar conclusiones.
- (de la 109) Erratas de texto de una línea se arreglan y se dicen; cualquier otra cosa, reabierta.
- (de la U4) Dos fracciones equivalentes entre las opciones es el fallo típico de esta unidad y los tests lo buscan por valor: comprueba
  con 3000 ítems que no queda ningún par equivalente.
- Si reabres una, se queda **sin publicador** otra vez: dilo en la terminada con su plazo, para que la coordinadora decida.
- (de la 119, 30-10) **Los exámenes se escriben después que las prácticas**: la regla 6 no se mide solo con los `RESERVADOS` de
  `comprobar-semanaN.py`, sino con los casos de verdad, `exámenes-semanales/semana-N/casos-examen-semanaN.tsv` (columna `enunciado_tex`)
  y los `.tex` del examen final. Un barrido de 20000 ítems por ejercicio con la clave «misma tarea, mismos datos» los encuentra en
  minutos. **Nunca escribas un caso de examen en claro en el repositorio** (código, tests, ENTREGA, hechos, mensaje de commit): es
  público y Pages sirve también `reparto-practicas-u2/`. Di dónde está y cuántos salen; en el código, por su huella.
- (de la 117) La clave que se excluye tiene que ser la **misma** que genera la práctica (misma función de ordenar, mismo formato), o el
  filtro no filtra aunque el test pase: `equivalentes` ordenaba parejas como cadenas y «10/15 y 6/9» se le escapaba (`'10/15' < '6/9'`).
  Comprueba la clave con un caso cuyo orden de cadena no sea el natural.
- (de la 117) Los casos de las **hojas** sí van en claro (los alumnos ya las tienen): compáralos con los ejercicios de
  `4. Fractions/hojas-de-ejercicios/hoja-unidad4-semana*.tex`, por valor y por los dos huecos posibles de una igualdad.
- (de la 119, 2-11) **No compruebes la exclusión con la clave de la práctica, sino con una tuya, sacada de los datos**: fracciones con
  signo, operación y orden, y las sumas **sin orden** («a + b» = «b + a», «−a + n» = «n − a»). Las sesiones que cierran las reabiertas
  filtran cada caso en el orden en que está escrito, y `suma-resta` sacaba «1 + 5/6» de la hoja 2 aunque «5/6 + 1» estuviera filtrado.
- (de la 119) **Un caso excluido en un ejercicio puede salir en otro con otra clave**: `fraccion-de` excluía los casos de U4-1A-01 en los
  ej. 1 y 2 (`n/d de total`) y el ej. 4 los sacaba en su variante `queda` (`n/d|total`). Cruza cada destreza con todos los ejercicios que
  puedan generar sus datos, no solo con el que la cita.
- (de la 119) En los casos de opción múltiple (U4-1C-17 y 1C-19), la columna `enunciado_tex` del TSV solo dice «Which one is true?»: la
  pareja buena está en `correcta` y las demás en las `\opciones` de `examen-semanaN.tex`. Y en `examen-final/` hay un
  `examen-final-unidad4-adaptado-A.tex` (30-10) que también cuenta.
- (de la 119) Comparar «por conjuntos de números» da cientos de falsos positivos (mismos números, otra tarea): restringe cada clave a su
  destreza (la de la fila del TSV o el `% U4-…` que precede a la línea del `.tex`) y quita los recuadros `apoyo` de las hojas.
- (de la 120) **U4-3C-11** («tres son correctas, ¿cuál está mal?»): la respuesta, en la columna `correcta` del TSV, es una cuenta mal
  hecha; si la práctica pide esa cuenta, su solución da la respuesta. Se cruza con todos los ejercicios de cálculo (`multiplica-divide`,
  `errores4`…), no solo con «caza el error».
- (de la 120) Expresiones combinadas: compáralas por **números, operaciones y valor**, que encuentra cualquier reordenación sin escribir un
  analizador de expresiones con conmutatividad. Al leer el TSV, quita los dos puntos de «Work out:» y el `{\small(…)}` final, o se leen como
  división y paréntesis.
- (de la 120, 30-10) Cuando un ejercicio tiene pocos ítems posibles (potencias: 48), quitar los de las hojas lo vacía: se quitan los de
  examen y se pregunta lo demás. **Nunca escribas un caso de examen en claro, tampoco de pasada** («es un paso del 2d del modelo 1» ya dice
  qué hay en el examen).
- (de la 120) En `combinadas-fracciones` los operadores son `.frac-op` con `data-ruta` (no botones); un toque malo aplica el paso bueno y
  sigue, así que tocar siempre el primero recorre la cadena hasta el final. En `multiplica-divide`, el campo de fracción son
  `.campo-fraccion__arriba` y `__abajo`, con el botón `+/−` aparte.
- (de la 119) Guion de clics: pulsa en el **título** de una caja (`.eq-titulo`, `.caja__titulo`), no en su centro, que puede caer sobre
  una tarjeta ya colocada; los puntos de la recta (`.fd-toque`) son SVG y no tienen `offsetParent`; el «Comprobar» activo es el último
  sin `disabled`. En el menú de una práctica, `[data-ejercicio]` empieza en **0**. Para leer el ítem en pantalla, `.operacion .frac` y sus
  dos `span`; el signo de una negativa está en el `.frac-neg` padre. La portada tarda en salir por Firebase: espera a `#probar` hasta 30 s,
  y no lances más de dos Chrome a la vez.
- (de la 120) Con un perfil de Chrome nuevo la primera carga de la portada pasa de 30 s (Firebase por CDN): reutiliza un perfil ya usado.
- (de la coordinadora, 5-11) **Hay ENTREGA antiguas con casos de examen en claro** (la de la 107 y la de la 111; avisado a Juan Luis el
  5-11): no copies a tu ENTREGA frases de ENTREGA anteriores sin leerlas, y no las cites literalmente.
- (de la coordinadora, 5-11) `catalogo.js` lo comparten muchas tareas (la base de cada unidad, la ortografía, cada publicación): el
  candado de sesiones lo reserva 30 min a quien lo edita. Edita, comitea con ruta explícita y suéltalo enseguida; si te lo encuentras
  reservado, no esperes razonando: latido y vuelve a mirar en 10 min.
- (de la 109) Si `npm test` falla por el `disponible`, mira cómo lo resolvió la 109 (26306eb: el test de la portada trabaja sobre una copia
  del catálogo); si aun así falla un test que no es de tus ficheros, no lo arregles: dilo en la terminada.

## Prohibido (propio de esta tarea)

- Corregir el código de una práctica (más allá de una errata de texto de una línea): se reabre.
- Publicar otras prácticas, o tocar en `catalogo.js` algo que no sea `disponible` de las filas 53, 54 y 55.
- Comitear `catalogo.js` si `git status` lo da modificado por otra sesión antes de tu cambio.
- Crear la tarea de la semana en el panel o en `tareas.js`: la propuesta es para Juan Luis (tarea 121).
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
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja lo
publicado en un estado coherente (una práctica publicada y comiteada vale aunque las otras
queden sin revisar), escribe `$R/hechos/notas/<sid>-traspaso-163.md` con el estado exacto
(qué está hecho, qué falta, qué has descubierto, en qué orden seguir),
`$R/hechos/fallos/163--<sid>.md` con `parada por: sesión agotada` y la ruta de esa nota, y
`ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/163--<sid>.md` con `parada por: mal cortada`
y la ruta de la incidencia, `ABANDONADA` en tu reclamo, y díselo al usuario. Si un paso te
pide **decidir** algo que va a durar (quitar más casos que los del papel, cambiar cotas o
el número de ejercicios), no lo decidas: entrégalo como hallazgo para Juan Luis en tu
terminada y sigue con lo que no dependa de ello.

## Al terminar

Por este orden (el del repositorio git):

1. `node --test tests/practicas-comun.test.js tests/practicas-multiplica-divide.test.js tests/practicas-combinadas-fracciones.test.js tests/practicas-errores4.test.js`
   en verde y `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con reclamo vivo no es tuyo: anótalo en la
   terminada).
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas:
   `git add <rutas> && git commit -m "Publicadas multiplica-divide, combinadas-fracciones y errores4 (tarea 163, semana 3 de la U4)" -- <rutas>`
   (ajusta el mensaje a lo que de verdad publiques). Apunta el hash (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/163-publicar-u4-semana-3-ter/ENTREGA.md` (veredicto por práctica, hash, recuentos del barrido sin casos
   en claro, cómo se probó en el navegador, la propuesta de la semana 3 al día y los hallazgos fuera de criterio) y su marcador
   vacío `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/163--<sid>.md`: hash del commit, ficheros (lo que dice `git show --stat`, no lo que crees),
   qué se publica y qué se reabre, tests, hora y **duración real** (de `abierto:` a ahora), y propuestas pendientes si las hay.
5. Añade `CERRADA` a tu reclamo (línea propia que empieza por esa palabra).
6. Choques encontrados → `$R/hechos/incidencias/<sid>.md`.
7. `git fetch origin`, relista `$R/hechos/` **ahora** y regenera `$R/_ESTADO.md` entero:
   todas las filas, el registro con una línea por fichero de `terminadas/`, banda y
   «encadenable» recopiadas de las fichas, leyenda de bandas de `proyecto.md`. Anota qué
   tareas pasan de BLOQUEADA a PENDIENTE (la 121, para la semana 3). Si tu duración
   real difiere mucho de la estimada, díselo al usuario.
8. Vuelca abajo, en «Trampas conocidas» de esta ficha, lo que hayas aprendido por las
   malas (es lo único de la ficha que editas, además de la duración).
9. Un solo commit con rutas explícitas de tus ficheros de `$R/hechos/` (por sid), tu
   carpeta de `$R/salidas/`, `$R/_ESTADO.md` y esta ficha, y `git push origin main`. Si el
   push se rechaza: `git pull --rebase origin main` (nunca `--autostash`), regenera el tablón
   otra vez desde `hechos/` (no lo fusiones a mano) y vuelve a comitear y empujar.
10. Dile al usuario la **foto del momento** en tres líneas («EN CURSO: … · LIBRES ahora: … ·
    BLOQUEADAS: …»), sacada de la lectura de `hechos/` del paso 7, y después, **solo para las
    LIBRES**, las frases de arranque de `proyecto.md` literales, en bloques de cita, una por
    sesión que quepa a la vez, con la tarea o la cadena, la banda traducida y el nombre de
    sesión delante.
11. Decide si encadenas otra (solo en verde: misma banda, tarea corta, sin esperas; si tu frase
    de arranque nombra la cadena, encadenas por defecto) o paras. Si encadenas, «Antes de
    empezar» entero otra vez, con reclamo nuevo, y di el nombre nuevo que te toca. La 121 no se
    encadena: va con Juan Luis delante.

Si paras sin terminar: `$R/hechos/fallos/163--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni
  `practicas/_comun/` (salvo la tarea 01 y, en la unidad 3, la 79 y las de publicación 93-96 y la 115, y, en la unidad 4, las 109-111, 119, 120, 162 y 163, cada una en lo que declara), ni `css/estilos.css`, ni `README.md` (salvo
  01 y 18), ni `firestore.rules` ni `src/firebase.js` (salvo 01), ni fichas ajenas, ni
  nada de la carpeta de apuntes de iCloud. Si la base te falta algo, se propone en la
  terminada; no se parchea.
- `git add .`, `git add -A`, `git commit -a`, o un `add` separado del `commit`. El índice
  es compartido con otras sesiones del mismo árbol. Nunca `git stash`, `--autostash`,
  `git checkout -- .` ni `git reset --hard`.
- Editar el código con `sed -i` o heredocs desde el shell: el candado de sesiones solo
  ve Edit/Write, y así otra sesión no sabe que el fichero está en uso. El código se edita
  con las herramientas de edición; `hechos/` sí se escribe desde el shell (un escritor).
- Reescribir un fichero de `hechos/` (solo `>>`), editar un reclamo ajeno, o regenerar el
  tablón de memoria sin relistar `hechos/`.
- Dependencias nuevas (npm, CDN).
- Las reglas de contenido de la unidad: opciones equivalentes por valor, decimales o números mixtos, potencias de base
  negativa, algo de una sesión posterior a la de la destreza, distractores que puedan ser verdad, casos del papel.
