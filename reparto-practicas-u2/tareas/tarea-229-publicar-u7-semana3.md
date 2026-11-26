# Tarea 229 · Revisión a mano (con clics) y publicación de las prácticas del paquete 3 de la unidad 7 (`tres-escrituras`, `tanto-por-ciento`, `que-porcentaje`, `descuentos`), con la propuesta de las dos tareas semanales del paquete (lun 15-3 y lun 5-4)

> **CORRECCIÓN DE LA COORDINADORA (s-20261126T162834-4b1cc936, 26-11-2026; manda sobre lo que diga esta ficha más abajo).** El acta de la 02 de la U7 (`apuntes-1eso-bilingue/7. Proportionality/inventario-unidad7-revision.md`, punto u) decidió **una sola hoja 3** (`hoja-unidad7-semana3.*`, sin «parte», hecha por la tarea 08 de la U7; su 09 está SUSTITUIDA) y **cinco tareas semanales de la app, una por paquete** (no seis): lun 1-3 → jue 4-3, lun 8-3 → jue 11-3, **lun 15-3 8:00 → jue 8-4 23:59** (paquete 3, abierta en vacaciones), lun 12-4 → jue 15-4 y lun 19-4 → jue 22-4. **No hay tarea del lun 5-4.** Esta tarea propone **una** tarea semanal (la del 15-3 → 8-4, que cubre las seis sesiones del paquete), no dos, y coteja contra la hoja 3 única.

Actualizado: 2026-11-19 (adaptada a la unidad 7; alta de la montadora del reparto de la unidad 7, s-20261118T221619-b66ec280, a partir de la ficha 158 de la unidad 6, con sus trampas)
Precondición: 218, 219, 220 y 221 LISTAS · la hoja 3 (una sola) y el examen 3 (tareas 08 y 20) LISTOS en el reparto de la U7 (para el cotejo de casos) · no en paralelo con nada que toque `catalogo.js` o `docs/practicas-unidad7.md` · **228 LISTA** (comparten `catalogo.js` y `docs/practicas-unidad7.md`; en cadena detrás de ella) · Disparo: MANUAL (sesión atendida) · **Plazo: jue 11-3 (la primera tarea semanal del paquete sale el lun 15-3; la segunda, el lun 5-4, a la vuelta de las vacaciones)**
Duración esperada: 1 h 30 min (tiempo de sesión, no de persona; en la U6 cada pasada de la 158 fueron 12-17 min, pero hicieron falta dos, y aquí son cuatro prácticas, 17 ejercicios y dos propuestas de tarea) · Banda de modelo: ALTO · Encadenable con: 228 (antes), 230 (después)
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/229-publicar-u7-semana3/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/catalogo.js` (solo `disponible` de las 4, y de lo que la 228 dejara reabierto y ya esté cerrado), `docs/practicas-unidad7.md` (el paquete 3 y la línea «**Publicadas** (a …)») y, solo si el test de una práctica que publicas exige `disponible: false`, esa línea de `tests/practicas-<slug>.test.js`, en el mismo commit (lección de la 159)

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
   printf 'sesión: %s\ntarea: 229\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/229--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/229--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 229 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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
7. Idempotencia: comprueba si `practicas/<tu slug>/` o tu test ya existen (de una sesión
   caída) antes de crearlos. Si existen, léelos y continúa desde ahí.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/229--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Lo que la 156-159 fueron para la U6: revisar **a mano, con clics**, las prácticas del paquete 3 (en español y en inglés,
a 375 px y en ventana ancha, un ítem acertado y uno fallado por ejercicio), **cotejar sus casos** contra las dos partes de la
hoja 3 (en claro) y el examen 3 (por huella FNV-1a del caso normalizado por valor, calculada fuera del repo; recuentos en la
ENTREGA, nunca los casos), ponerlas `disponible: true`, escribir lo que falta de `docs/practicas-unidad7.md` y dejar al día la
**propuesta de las dos tareas semanales del paquete** para el panel (plan A con todas; plan B si alguna se reabre), cada una con
su ★ de ortografía (el que diga `comun/CALENDARIO-CURSO-2026-27.md` de los apuntes; ver el paso 4) y 100 puntos. **El paquete 3
es doble y lo parten las vacaciones** (del vie 19-3 al vie 2-4): la primera tarea sale el **lun 15-3 a las 8:00** y se entrega
el **jue 18-3 23:59**; la segunda sale el **lun 5-4 a las 8:00** y se entrega el **jue 8-4 23:59**; la prueba 3 es el vie 9-4.
Nada con entrega en vacaciones. Si una práctica no pasa, **reabierta** (`hechos/reabiertas/NNN--<sid>-revision.md`, con lo
exacto) y no se publica.

Qué se revisa (según el acta de la 02 de la U7, `7. Proportionality/inventario-unidad7-revision.md`; **hasta que exista, la
propuesta de `proyecto.md` de PU2, «Tareas 211-233»**, y lo que allí es punto a decidir —los porcentajes encadenados, «el precio
antes de la rebaja», el interés— no entra):

| Tarea | id | Práctica | Ejercicios | Sesiones | Tarea semanal |
|---|---|---|---|---|---|
| 218 | 90 | `tres-escrituras` | 4 | 9 (lun 15-3) | la del 15-3 |
| 219 | 91 | `tanto-por-ciento` | 4 | 10 (mar 16-3) | la del 15-3 |
| 220 | 92 | `que-porcentaje` | 4 | 11 (jue 18-3) | la del 15-3 |
| 221 | 93 | `descuentos` | 5 | 12-14 (lun 5-4, mar 6-4, jue 8-4) | la del 5-4 |

Las cuatro se publican juntas antes del jue 11-3, aunque `descuentos` sea de abril: así queda todo hecho antes de las
vacaciones. **Ojo**: la portada enseña la U7 desde el 1-3, así que `descuentos` estará a la vista tres semanas antes de su
sesión; si la portada no la deja en su bloque sin más aviso, dilo en la ENTREGA como hallazgo para Juan Luis (no toques la
portada: no es de esta tarea). Y **lo que la 228 dejara reabierto** y ya esté cerrado se revisa entero y se publica aquí.

## Siguiente paso

Lee la ficha 158 y su ENTREGA (`salidas/158-publicar-u6-semana3/ENTREGA.md`: dos pasadas, las listas de reserva en `hechos/notas/`, los planes A, B y C) y `salidas/228-publicar-u7-semana2/ENTREGA.md` (cómo cotejó, qué dejó reabierto, qué scripts dejó y dónde), la ENTREGA de la 211 y las de las prácticas de este paquete; `docs/practicas-unidad7.md` como lo dejó la 228. Comprueba en `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/reparto-unidad7/hechos/terminadas/` que la hoja 3 (parte 1 y parte 2: tareas 08 y 09) y el examen 3 (tarea 20) de la U7 cerraron; si Juan Luis decidió en la 02 una sola hoja 3, la 09 estará SUSTITUIDA y la hoja entera es la de la 08. Antes de revisar nada, `gh run list --limit 3`: la publicación de GitHub Pages tiene que estar en verde.

## Qué hay que hacer

1. Por cada práctica: `node --test tests/practicas-<slug>.test.js`; navegador con clics (`npm run servir`, «Probar sin código»), sobre una copia de HEAD y en un puerto libre; y, con barridos de 20 000 ítems por ejercicio y aritmética propia (enteros o `BigInt`, nunca coma flotante):
   - **regla de oro por valor** (regla 1), que aquí es donde más aprieta: **`0,2`, `1/5` y `20 %` son la misma opción**, y «rebajar un 25 %» y «pagar el 75 %», y «aumentar un 20 %» y «multiplicar por 1,2»; ninguna opción vale lo mismo que otra, ni la buena con una falsa **ni dos falsas entre sí**, salvo que el ejercicio evalúe la forma escrita y el enunciado lo diga (`tres-escrituras`: «escribe como porcentaje»). Cada distractor es un error típico de la regla 4 con los números del ítem (el 20 % de 150 como `150 : 20 = 7,5`, cuando es 30; `20 % = 0,02`; `5 % = 0,5`; `50 − 20 % = 30` en vez de 40; el 20 % son 30 → «6» en vez de 150; 45 € con un 20 % de descuento → «9 €», el descuento, cuando se pide el precio final, 36,00 €) y **devuelve `null` cuando da lo mismo que la buena** (el 50 % de descuento: descuento y precio final coinciden);
   - **nada que no se haya dado** (regla 2): ningún aumento ni descuento en `tres-escrituras`, `tanto-por-ciento` ni `que-porcentaje` (sesiones 9-11); en `descuentos`, ni encadenados ni «el precio antes de la rebaja» si el acta no los admite (su ej. 5, «sube un 20 % y baja un 20 %», es cazar un error, no calcular un encadenado: mira que el acta lo deje);
   - **realismo** (regla 7): descuentos del 5 al 70 %, IVA del 4, 10 o 21 %, subidas del 1 al 20 %, propinas del 5 al 15 %; **el porcentaje sale exacto** (personas enteras; dinero al céntimo: 50 € más el 21 % de IVA son 60,50 €), nunca «33,333… %»; el precio, creíble para lo que se compra;
   - **enunciados sin ambigüedad** (regla 6): «aumenta un 50 %» frente a «aumenta al 150 %»; «un 20 % más barato», ¿de qué precio?;
   - **notación** (regla 3) y textos: `20 %` con espacio en español y `20%` pegado en inglés, en todas las cadenas del ítem **y en las que se calculan al corregir** (feedback, pistas, la tarjeta del «No lo sé»); el dinero con dos decimales y **en euros, no en céntimos** (compara el valor escrito con el de la opción, una por una: lección de la 159); el guion del teclado como signo, `×`, dobles espacios, mayúscula tras dos puntos;
   - **variedad** (criterio de la coordinadora del 13-11): ningún ítem sale en más del 10 % de los de un ejercicio (con los porcentajes fáciles —50, 25, 10, 20, 75 y 1 %— es fácil pasarse: míralo);
   - **el botón «No lo sé»** (M22; `docs/no-lo-se.md`, `tests/practicas-no-lo-se.test.js`): cada ejercicio tiene su `explicacion` (o un `sinAyuda` de los dos casos admitidos); lee a mano las tarjetas de varios ítems por ejercicio e idioma.
   Lee los feedbacks de fallo a 375 px, no solo los cuentes.
2. Cotejo de casos, **por valor** (reglas 1 y 9 de abajo y regla 7 de `proyecto.md` de la U7): «el 20 % de 150», «el 20 % de 150 €» y «0,2 · 150» son el mismo caso; el tipo de problema (la parte, el porcentaje o el total; descuento, aumento o IVA) y sus datos como fracciones irreducibles, en un orden fijo. Los de la hoja 3 (`hoja-unidad7-semana3-parte1.tex`, `hoja-unidad7-semana3-parte2.tex` y sus `soluciones-unidad7-semana3-parte1.tex` y `-parte2.tex`), en claro, contra lo que generan las prácticas (barrido de 20 000 ítems por ejercicio con semilla fija) y contra los ejemplos fijos de las introducciones; los del examen 3 (`casos-examen-semana3.tsv`), por huella FNV-1a del caso normalizado calculada en el scratchpad (modelo: `practicas/equivalentes/logica.js` y las ENTREGA de la 157 y la 159): **0 coincidencias**, con los recuentos en la ENTREGA. **Además, las prácticas de los paquetes 1 y 2 ya publicadas, contra las preguntas de repaso del examen 3.** Si una práctica saca casos del papel, deja en `hechos/notas/` la lista de reserva ya calculada (la hoja en claro; el examen, solo huellas), simulada contra la propia práctica (tiene que dar 0).
3. `catalogo.js`: `disponible: true` de las que pasen. `docs/practicas-unidad7.md`: el paquete 3 y «Publicadas». Tras el push, `gh run list --limit 3` otra vez.
4. **Dos** propuestas de tarea semanal en la ENTREGA, con la forma de la de la 158 (10 puntos por ejercicio, 8 ★ + 2 a elegir = 100 puntos, la destreza y la sesión de cada ejercicio, plan A y un plan B por cada práctica que pueda faltar); **los nombres los decide Juan Luis en la 232** (propuesta: «U7 · 3a» y «U7 · 3b», para que cuadren con el paquete del papel):
   - **la del lun 15-3** (`unidad: 7`, `desde: '2027-03-15'`, `hasta: '2027-03-18'`; propuesta de título: «U7 · 3a · Porcentajes» / «U7 · 3a · Percentages»): `tres-escrituras`, `tanto-por-ciento` y `que-porcentaje`. Lo de la sesión 11 (`que-porcentaje`), que se da **el mismo día** del plazo (jue 18-3), va «a elegir»; entre los ★, uno o dos de repaso del paquete 2.
   - **la del lun 5-4** (`desde: '2027-04-05'`, `hasta: '2027-04-08'`; «U7 · 3b · Descuentos y aumentos» / «U7 · 3b · Discounts and increases»): `descuentos` y **repaso de las otras tres** (es la vuelta de vacaciones y la prueba 3, el vie 9-4, pesa igual lo de marzo que lo de abril: como ★, los ejercicios de `que-porcentaje` que la primera dejó «a elegir» y uno de cada una de las otras dos). Lo de la sesión 14 (jue 8-4, el día del plazo), «a elegir».
   - **El ★ de ortografía de cada una**: el de su fila en `comun/CALENDARIO-CURSO-2026-27.md` de los apuntes, si la tarea 03 de la U7 ya la ha puesto (a 18-11 la tabla acaba en la U6). Si no está, **se propone y se dice**: para la del 15-3, el de «U7 · 3» de la tabla de ★ de `salidas/196-publicar-ortografia-4/ENTREGA.md` (`['ortografia-tildes', 3]`, publicado). **Para la del 5-4 esa tabla no tiene fila**: va por paquetes (cinco ★ para la U7) y las tareas son seis. No lo inventes en silencio: propón el siguiente ★ del plan de la 196 que esté publicado (su regla de sustitución va por paquetes y en orden), di en la ENTREGA qué ★ de las tareas siguientes de la U7 y de la U8 se corre con eso, y que lo decide Juan Luis (o la tarea 03 de la U7 al poner al día el calendario). En los dos casos, comprueba en `catalogo.js` que el bloque sigue con `disponible: true`.
   Las monta Juan Luis en el panel (tarea 232) y las programa en Classroom la tarea 40 del reparto de la U7.

## Datos de entrada

- Las ENTREGA de las prácticas del paquete (218, 219, 220, 221), `salidas/211-base-unidad7/ENTREGA.md` y `salidas/228-publicar-u7-semana2/ENTREGA.md`; `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/hojas-de-ejercicios/`, `exámenes-semanales/semana-3/` (solo lectura; los casos de examen nunca en claro en el repo); el acta `7. Proportionality/inventario-unidad7-revision.md` y `inventario-unidad7.tsv` (columna `sesion`); `comun/CALENDARIO-CURSO-2026-27.md` de los apuntes y `salidas/196-publicar-ortografia-4/ENTREGA.md` (los ★ de ortografía); `docs/practicas-unidad6.md` (modelo); `docs/no-lo-se.md`.

## Cómo saber que ha terminado

Las 4 prácticas con `disponible: true` (o reabiertas, con su fichero), `npm test` en verde y la publicación de Pages también, el cotejo con 0 coincidencias documentado por recuentos, `docs/practicas-unidad7.md` al día, y **las dos** propuestas de tarea (lun 15-3 y lun 5-4) en la ENTREGA, cada una con de dónde sale su ★ de ortografía.

## Trampas conocidas

- (U4, 117/118) Publicar sin cotejar contra las hojas y los exámenes escritos después obligó a reabrir las siete prácticas de la U4 y a una segunda publicación (119/120): aquí la precondición exige la hoja y el examen cerrados.
- `catalogo.js` lo tocan varias tareas de publicación (las 227-231 entre sí y cualquier otra publicación que esté viva ese día): nunca a la vez; mira `.claude/sesiones/` y `git log -3 -- practicas/_comun/catalogo.js`.
- La portada ya enseña la U7 desde el 1-3 (`UNIDADES.desde`): lo que publiques después de ese día lo ven los alumnos en cuanto Pages lo sirva. Para verla antes, fecha de prueba en `unidadActual`.
- Con proporcionalidad, «el mismo caso» es el mismo caso normalizado por valor (tipo de problema y datos como fracciones irreducibles en un orden fijo, cada cantidad en su unidad base): la huella se calcula sobre eso, no sobre el texto ni sobre el contexto (regla 9).
- (U6, tarea 158; adaptada) El ★ de ortografía puede ser de un bloque que no esté publicado cuando toque: allí dependía de otra publicación con plazo el mismo día. Aquí los bloques de la tabla de la 196 están publicados desde el 14-11, pero compruébalo en `catalogo.js`; si alguno no lo está, la regla de sustitución de aquella ENTREGA, y se dice.
- (U6, tarea 158, 18-11, s-20261118T084149-af8e25f2) Las tres prácticas se escribieron antes que el papel, con `CASOS_HOJA` y `HUELLAS_EXAMEN` vacíos: la primera pasada solo pudo reabrirlas. Deja las listas calculadas en `hechos/notas/` (la hoja en claro, los exámenes como huella) para que la reabierta sea pegar y probar, y comprueba que tu clave coincide con la de la práctica sobre ítems generados.
- (U6, tarea 158; traducida) Una clave que depende del orden deja pasar el mismo caso escrito al revés (allí, los miembros de la ecuación; aquí, los dos lados de una proporción o el orden de los datos). Las notas llevan los órdenes que la práctica pueda generar; en la segunda pasada, barre en cualquier orden.
- (U6, tarea 158; traducida) Una clave por valor reserva de más (allí juntaba dos ecuaciones distintas con el mismo miembro reducido; aquí junta «el 20 % de 150» con «0,2 · 150» y «1/5 de 150», que es lo que pide la regla): no hace daño. Para contar las coincidencias de verdad en la ENTREGA, compara también como está escrito.
- (U6, tarea 158) Los scripts de la primera pasada (allí, en /tmp/pu2-158/: papel, barrido, regla de oro, clics) llevan casos de examen en claro y se pierden al reiniciar el Mac; el modelo que queda en el repositorio son las ENTREGA de la 157, la 158 y la 159.
- (U6, tarea 158, segunda pasada, s-20261118T131928-cf1250cf) Con los scripts aún en /tmp, la segunda pasada fueron 12 min: rehacer `arbol/` con `git archive HEAD | tar -x` y volver a meter `window.__item = actual.item;` delante del `montar` de `base.js`, solo en la copia. `python3 -m http.server` corta a veces una petición (ERR_CONNECTION_RESET) y un recorrido sale «sin ítem»: se repite y ya está, no es de la práctica. macOS no trae `timeout`. Un barrido de los textos del ítem (todas las cadenas, con regex: «: Mayúscula», guion del teclado, «: −») encuentra en un segundo lo que los clics, con un ítem por ejercicio, no ven.
- (U6, tarea 156, 18-11) Antes de revisar, `gh run list --limit 3`: la publicación de Pages llevaba siete horas en rojo por un fichero nuevo
  importado y sin comitear (un fichero nuevo no entra en `git commit -- rutas` si no se nombra). Y en la regla de oro se miran también las
  parejas de opciones **falsas** que valen lo mismo.
- (U6, tarea 159) El feedback no está en el ítem: un barrido de las cadenas del ítem no ve las pistas ni los «por qué» que se calculan al
  corregir; hay que llamar también a las funciones que los escriben, con todas las opciones falsas. Y hay que **leerlos**: un porqué escribía
  la solución en céntimos («x = 188,» por 1,88 €, en el 17 % de los ítems) y ninguna regex lo vio.
- (U6, del 14 al 16-11; historia) Varias sesiones escribieron en este árbol y comitearon y empujaron desde worktrees: `main` se separó de
  `origin/main` y el lanzador dejó de ver tareas. Regla vigente (`CLAUDE.md` de la raíz y `proyecto.md`, «Se sube desde el mismo árbol en el
  que se escribe»): se escribe, se comitea con rutas explícitas y se empuja desde aquí; si `git status -sb` dice «ahead N, behind M», se
  realinea como dice allí antes de empezar.

## Prohibido (propio de esta tarea)

- Corregir tú una práctica ajena: reabierta con lo exacto.
- Escribir un caso de examen en claro (en la ENTREGA, en un test, en un comentario).

## Salida esperada

- `catalogo.js` y `docs/practicas-unidad7.md` comiteados; las reabiertas que hagan falta en `hechos/reabiertas/` (y sus listas de reserva en `hechos/notas/`).
- `reparto-practicas-u2/salidas/229-publicar-u7-semana3/ENTREGA.md` (qué se publicó, recuentos del cotejo, hallazgos, las propuestas de las tareas semanales del lun 15-3 y del lun 5-4 con sus planes y sus ★ de ortografía) y su marcador.

## Reglas de contenido de la unidad 7 (copia de `proyecto.md` de su reparto; lo común no se lee, por eso va aquí)

Las reglas 2-4 y 8-9 de la lista de la unidad 2 (signos `·` y `:`, inglés, regla de oro, feedback, realismo) valen igual.
La fuente es `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/reparto-unidad7/proyecto.md` («Reglas de contenido comunes») y, cuando exista, el acta
`/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/inventario-unidad7-revision.md` (lo que Juan Luis decida en la tarea 02 de aquel reparto, firma F0:
el método —reducción a la unidad, regla de tres o constante—, la inversa, los repartos, los porcentajes encadenados y «el
precio antes de la rebaja», el IVA, las escalas, si las unidades de medida van aquí o en la U8, la velocidad, el cambio de
moneda, la calculadora, la notación, las cotas de realismo, los ids, cómo se reparte el paquete 3). **Si esta copia y el acta
discrepan, manda el acta. Hasta el acta, todo lo de aquí es la propuesta de partida de la montadora (18-11-2026) y lo marcado
como «punto a decidir» no entra.** Calendario: del lun 1-3 al vie 23-4-2027, 23 clases, cinco paquetes (el 3, doble: sesiones
9-11 del 15 al 18 de marzo y 12-14 del 5 al 8 de abril, con vacaciones del 19-3 al 2-4); pruebas los viernes 5-3, 12-3, 9-4 y
16-4, final el vie 23-4; **seis tareas semanales de la app** (propuesta), una por lunes lectivo (1-3, 8-3, 15-3, 5-4, 12-4, 19-4).

1. **Una misma razón tiene muchas escrituras, y todas son la misma respuesta.** `3/4`, `6/8`, `0,75`, `75 %` y «3 de cada 4»;
   `1/5`, `0,2` y `20 %`; «aumentar un 20 %» y «multiplicar por 1,2»; «rebajar un 25 %» y «pagar el 75 %»; `1 : 50 000` y «1 cm
   son 500 m»; `1,5 h` y «1 h 30 min»; `2,5 km` y `2500 m`. En cualquier ejercicio de elegir, emparejar o verdadero/falso,
   ninguna opción puede valer lo mismo que otra: el test lo comprueba **por valor**, con las fracciones exactas de
   `_comun/fracciones.js` (nunca `Number` en coma flotante) y cada cantidad en su unidad base; el módulo base de la unidad será
   `practicas/_comun/proporcion.js` (tarea 211). Solo si el ejercicio evalúa la forma escrita («escribe como porcentaje», «la
   razón más sencilla») cuenta la escritura, y el enunciado lo dice. **Dos métodos correctos nunca se enfrentan.** Lo que teclea
   el alumno se interpreta sin `eval` y se compara por valor: `20 %`, `0,2` y `1/5` valen igual, y `12 €` como `12,00 €`, salvo
   que la consigna pida una forma.
2. **Nada que no se haya dado**: cada ejercicio respeta la columna `sesion` de sus destrezas en el inventario (hasta el acta, el
   calendario propuesto: semana 1, razón, proporción y proporcionalidad directa; semana 2, inversa y repartos directos; semana 3,
   porcentajes, en dos tareas de la app: sesiones 9-11, los tres problemas de porcentajes, y 12-14, aumentos, descuentos e IVA;
   semana 4, escalas y unidades de medida; semana 5, velocidad, cambio de moneda y problemas mezclados). **Ninguna inversa antes
   de la sesión 5, ningún reparto antes de la 7, ningún porcentaje antes de la 9, ningún aumento o descuento antes de la 12,
   ninguna escala antes de la 16.** Ni proporcionalidad compuesta, repartos inversos, interés compuesto ni funciones (2.º ESO),
   ni geometría con fórmula (U8); los encadenados, «el precio antes de la rebaja», las unidades de medida, la velocidad y el
   cambio de moneda, solo si el acta los admite y en la sesión que diga. Se saben la jerarquía (U1), el m.c.d. y el m.c.m. (U2),
   los enteros (U3), las fracciones (U4), los decimales (U5) y el álgebra (U6; `3/4 = 6/x` se resuelve con los productos
   cruzados, `3x = 24`, nunca «despejando» una `x` del denominador).
3. **Notación** (propuesta): `20 %` con espacio en español y `20%` pegado en inglés (*twenty per cent*); la razón, como fracción
   (`htmlFraccion` de `fracciones.js`) o con palabras («3 a 4», *3 to 4*, «3 de cada 4», *3 out of 4*), y `1 : 50 000` solo en
   escalas y repartos; espacio fino en los números de cinco cifras o más (`50 000`; `2500` sin separar); coma decimal en español
   y punto en inglés; el dinero, con dos decimales (`12,00 €`); las unidades del SI, separadas del número (`3,5 km`, `90 km/h`,
   `L` mayúscula); `·` y `:` entre números. El alumno puede teclear `20%`, `20 %`, `0,2`, `0.2` o `1/5`; nunca `eval`.
4. **Regla de oro**: todo distractor, inequívocamente falso, y cada distractor sale de un **error típico** de la columna `nota`
   del inventario, calculado con los números del ítem y comprobado en el test (nunca un número al azar): **razonar sumando en
   vez de multiplicando** (si 2 cuestan 5 €, 4 cuestan 7 €, en vez de 10 €); invertir la razón (`4/3` por `3/4`); confundir
   parte-parte con parte-todo (chicos y chicas en razón 2 a 3 → «2/3 de la clase son chicos», en vez de 2/5); aplicar la regla
   de tres directa a una situación inversa (6 obreros, 10 días → 4 obreros, «6,67 días», en vez de 15) y al revés; dar por
   proporcional lo que no lo es; el 20 % de 50 como `50 : 20 = 2,5` (es 10); `20 % = 0,02` o `= 2`; `5 % = 0,5`; restar el
   porcentaje como si fuera un número (`50 − 20 % = 30`, en vez de 40); dar el descuento cuando se pide el precio final (45 €
   con un 20 % → 9 €, en vez de 36,00 €) y al revés; para hallar el total, calcular el porcentaje del dato (el 20 % son 30 → 6,
   en vez de 150); para «qué porcentaje», dividir al revés; en un reparto, a partes iguales (120 € en la razón 2 : 3 → 60 € y
   60 €, en vez de 48 € y 72 €); en una escala, multiplicar cuando toca dividir u olvidar el cambio de unidad (3 cm a escala
   `1 : 50 000` → «150 000 km», en vez de 1,5 km); `1,5 h` leído como 1 h 50 min. Los generadores de estos valores estarán en
   `_comun/proporcion.js` (`ERRORES_TIPICOS`): úsalos, y **cada función dice cuándo no sirve** (devuelve `null` cuando el error
   da lo mismo que la respuesta). **Lo que no es un error**: una escritura equivalente cuando no se pide la forma, un método
   distinto del explicado, *percent* por *per cent*, `12 €` por `12,00 €`, una razón sin simplificar cuando no se pide.
5. **Parejas válidas, que nunca se enfrentan**: *per cent* / *percent*; «tanto por ciento» / «porcentaje»; *ratio 3 to 4* /
   `3 : 4` / `3/4`; *VAT* / IVA; *discount* / *reduction*; «regla de tres» / «reducción a la unidad» / «productos cruzados»;
   *directly proportional* / *in direct proportion*; una fracción irreducible, su decimal exacto y su porcentaje.
6. **Inglés sencillo**; la palabra no matemática que decide la respuesta se aclara entre paréntesis (*discount* (descuento),
   *sale* (rebajas), *increase* (subida), *each* (cada uno), *altogether* (en total), *share* (repartir), *per* (por cada),
   *at the same rate* (al mismo ritmo), *tap* (grifo), *recipe* (receta)), salvo que sea justo lo que se evalúa. **El enunciado
   no puede ser ambiguo**: «aumenta un 50 %» frente a «aumenta al 150 %»; «un 20 % más barato» (¿de qué precio?); en la
   inversa, todos trabajan al mismo ritmo y se dice; en un reparto, proporcional a qué.
7. **Realismo** (regla de Juan Luis del 16-10): la situación tiene que ser posible (y de proporcionalidad de verdad) y **todos**
   los números que pueda sacar el generador, creíbles, con una cota por contexto que el test comprueba. Orientativas hasta el
   acta: descuentos del 5 al 70 %; IVA del 4, 10 o 21 %; subidas del 1 al 20 %; propina del 5 al 15 %; un porcentaje de un
   grupo, con el resultado en personas enteras; recetas para 2 a 12 personas (50-1000 g, 0,1-2 L, 1-12 huevos); obreros o
   grifos de 1 a 12, de 1 a 60 días o de 1 a 24 horas; consumo de 4 a 9 L cada 100 km; velocidades: a pie 3-6 km/h, en bici
   10-30, en coche 30-120, en tren 80-300; escalas: planos `1 : 50` a `1 : 200`, mapas `1 : 25 000` a `1 : 1 000 000`, con 0,5 a
   30 cm en el plano; cambio de moneda entre 0,80 y 1,30, dicho en el enunciado; repartos entre 2-4 personas, exactos al
   céntimo; precios como en la U5 y la U6. **El resultado de un problema es creíble y exacto**: personas y objetos, un natural;
   dinero, exacto al céntimo (50 € más el 21 % de IVA son 60,50 €); los datos se eligen para que el porcentaje salga exacto.
   Los personajes llevan nombres inventados (no de alumnos reales).
8. **Feedback ligado al error**, con los números del ítem («el 20 % de 150 no es `150 : 20`: es `20/100 · 150 = 30`»), no una
   regla genérica. Frase sencilla antes que caso límite.
9. **Casos fijos** (frases, contextos, números) que no copien los de las hojas, los exámenes semanales ni el examen final de la
   unidad 7 (en `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/hojas-de-ejercicios/`, `exámenes-semanales/`, `examen-final/`): los alumnos los verán en papel. **Los casos de
   las hojas se excluyen en claro; los de los exámenes, por huella FNV-1a calculada fuera del repositorio, nunca en claro** (regla de
   PU2 del 30-10; modelo: `practicas/equivalentes/logica.js` y `tests/practicas-equivalentes.test.js` tras el commit b0e4cfd, y la
   reabierta `hechos/reabiertas/100--s-20261030T081542-dab2aa98-revision.md`). Con proporcionalidad, la huella se calcula sobre el
   **caso normalizado por valor** (tipo de problema y datos como fracciones irreducibles en un orden fijo), no sobre el texto. Si
   al reclamar la hoja o el examen de tu paquete no existen aún, dilo en la ENTREGA: la tarea de publicación de tu paquete coteja y
   reabre si hace falta.
10. **Aritmética exacta**: las razones, los porcentajes y los resultados son `Fraccion` de `_comun/fracciones.js` (o enteros; el
    dinero, en céntimos enteros); nunca se compara ni se muestra con `Number` en coma flotante; el redondeo, al más cercano (la
    mitad, hacia arriba) y solo si el enunciado lo pide, nunca `toFixed` sobre un flotante; nunca `eval` sobre lo que teclea el
    alumno. Los tests lo comprueban contra `BigInt` o aritmética entera propia.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 229, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-229.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/229--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/229--<sid>.md` con `parada por: mal cortada`
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
   `git add <rutas> && git commit -m "<qué>" -- <rutas>`. Apunta el hash
   (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/229-publicar-u7-semana3/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cotas de realismo, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/229--<sid>.md`: hash del commit, ficheros (lo que dice
   `git show --stat`, no lo que crees), número de tests propios en verde, hora y
   **duración real** (de `abierto:` a ahora), y propuestas pendientes si las hay.
5. Añade `CERRADA` a tu reclamo (línea propia que empieza por esa palabra).
6. Choques encontrados → `$R/hechos/incidencias/<sid>.md`.
7. `git fetch origin`, relista `$R/hechos/` **ahora** y regenera `$R/_ESTADO.md` (entero si
   no hay otras sesiones en el árbol; si las hay, retoque de tus filas y del registro):
   banda y «encadenable» recopiadas de las fichas, leyenda de bandas de `proyecto.md`. Anota qué
   tareas pasan de BLOQUEADA a PENDIENTE. Si tu duración real difiere mucho de la estimada,
   díselo al usuario.
8. Vuelca abajo, en «Trampas conocidas» de esta ficha, lo que hayas aprendido por las
   malas (es lo único de la ficha que editas, además de la duración).
9. Un solo commit con rutas explícitas de tus ficheros de `$R/hechos/` (por sid), tu
   carpeta de `$R/salidas/`, `$R/_ESTADO.md` y esta ficha, y `git push origin main`. Si el
   push se rechaza: `git pull --rebase origin main`, regenera el tablón otra vez desde
   `hechos/` (no lo fusiones a mano) y vuelve a comitear y empujar. **Nunca si `main` lleva
   commits ajenos sin empujar**: incidencia y díselo al usuario.
10. Dile al usuario la **foto del momento** en tres líneas («EN CURSO: … · LIBRES ahora: … ·
    BLOQUEADAS: …»), sacada de la lectura de `hechos/` del paso 7, y después, **solo para las
    LIBRES**, las frases de arranque de `proyecto.md` literales, en bloques de cita, una por
    sesión que quepa a la vez, con la tarea o la cadena, la banda traducida y el nombre de
    sesión delante.
11. Decide si encadenas (solo en verde: misma banda, tarea corta, sin esperas; si tu frase
    de arranque nombra la cadena, encadenas por defecto) o paras. Si encadenas, «Antes de
    empezar» entero otra vez, con reclamo nuevo, y di el nombre nuevo que te toca.

Si paras sin terminar: `$R/hechos/fallos/229--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni
  `practicas/_comun/` (salvo la tarea 01; en cada unidad, su base y sus tareas de publicación; cada una en lo que declara), ni `css/estilos.css`, ni `README.md` (salvo
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
  CDN; las prácticas no usan ni siquiera KaTeX (exponentes con `<sup>`; las fracciones con
  `htmlFraccion`).
- Las reglas de contenido de la unidad 7 (en esta ficha y en `proyecto.md` de su reparto): `×` en vez de `·`; algo de una sesión
  posterior a la de la destreza (ninguna inversa antes de la sesión 5, ningún reparto antes de la 7, ningún porcentaje antes de
  la 9, ningún aumento o descuento antes de la 12, ninguna escala antes de la 16); proporcionalidad compuesta, repartos inversos,
  interés compuesto, funciones o geometría con fórmula; lo que el acta deje fuera (hasta el acta, los puntos a decidir: los
  encadenados, «el precio antes de la rebaja», las unidades de medida, la velocidad, el cambio de moneda); `eval` o coma
  flotante; un contexto sin su cota o un resultado que no sea exacto; distractores que puedan ser verdad, y en especial **dos
  opciones que valen lo mismo** (`0,2` y `20 %`; `3/4` y `75 %`; `2,5 km` y `2500 m`), que son dos respuestas correctas, o dos
  métodos correctos enfrentados; casos de examen en claro en el repositorio.
