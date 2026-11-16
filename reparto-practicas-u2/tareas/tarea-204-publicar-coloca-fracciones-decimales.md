# Tarea 204 · Revisión a mano (con clics) y publicación de «Coloca los paréntesis. Con fracciones» (`coloca-fracciones`, 81) y «Con decimales» (`coloca-decimales`, 82), con la propuesta de dónde entran en las tareas semanales de la U4 y la U5

Actualizado: 2026-11-14 (alta de la coordinadora s-20261114T212714-761c8123, por el encargo de Juan Luis del 14-11; decisiones en `proyecto.md`, «Decisiones del 14-11: colocar paréntesis en la U3, la U4 y la U5»)
Precondición: **201 LISTA** · **202 LISTA** (terminadas sin `PARCIAL`) · **no en paralelo con la 203** ni con ninguna otra que toque `catalogo.js`, `docs/practicas-unidad4.md`, `docs/practicas-unidad5.md` o `README.md` (mira los reclamos vivos, paso 2 de «Antes de empezar») · Disparo: MANUAL · **Plazo: mar 22-12** (U4: las combinadas son de la sesión 10, semana 3, desde el lun 11-1; límite jue 7-1) · U5: límite jue 21-1 (sesión 6, mar 26-1). La portada no enseña la U4 hasta el 14-12 ni la U5 hasta el 18-1: publicar antes no las pone delante de nadie.
Duración esperada: 1 h 15 min (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: 203 (si su precondición se cumple)
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/204-publicar-coloca-fracciones-decimales/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/catalogo.js` (solo `disponible` de las filas 81 y 82, `coloca-fracciones` y `coloca-decimales`), `docs/practicas-unidad4.md` y `docs/practicas-unidad5.md` (la línea de publicadas y la fila de la práctica), `README.md` (una fila en la tabla de la unidad 4 y su recuento; la de la 5, solo si el README ya tiene sección de la U5); y, solo para una errata de texto de una línea, `practicas/coloca-fracciones/textos.js` o `practicas/coloca-decimales/textos.js` (declarándolo en la terminada)

La duración esperada no es informativa: de ella sale la caducidad del reclamo (2 ×, mínimo 45 min), el plazo tras el cual otra
sesión puede relevarte si te cortas. **Este fichero es la fuente de la banda**: el tablón la copia de aquí cada vez que se regenera.
La tabla de bandas de `proyecto.md` la traduce al menú de hoy (ALTO = Opus 5.5, esfuerzo Alto; MEDIO = Sonnet 5.5, esfuerzo Medio).

## Antes de empezar

Todas las rutas son relativas a la raíz del repositorio (`/Users/salasgar/Documents/git/Ejercicios-interactivos`).
`R=reparto-practicas-u2`.

1. Lee `$R/proyecto.md` (al menos «Reglas de contenido comunes», «Tareas 98-114», «Tareas 122-133», «Tareas 169-170» —el criterio de
   reapertura— y **«Decisiones del 14-11: colocar paréntesis en la U3, la U4 y la U5»**) y `$R/_ESTADO.md` enteros, y **lista
   `$R/hechos/`** (`ls $R/hechos/*/`): la carpeta manda sobre la tabla.
2. `date -u` para saber la hora de verdad. `git fetch origin && git status -sb` (`git pull --rebase origin main` si hay commits que
   traer; nunca `--autostash`). **Comprueba la precondición en el disco**: las terminadas de la 201 y la 202 (`ls $R/hechos/terminadas/ | grep -E '^20[12]--'`,
   sin `PARCIAL`), ninguna reabierta de ellas posterior (`ls $R/hechos/reabiertas/ | grep -E '^20[12]--'`), ningún reclamo vivo de una tarea
   que toque `catalogo.js` (`grep -l 'catalogo.js' $R/tareas/*.md`, cruzado con `ls $R/hechos/reclamos/`), y
   `git status --short practicas/_comun/catalogo.js docs/practicas-unidad4.md docs/practicas-unidad5.md README.md practicas/coloca-fracciones practicas/coloca-decimales`
   tiene que salir **vacío**. Si algo sale modificado, es trabajo de otra sesión: no lo toques y no reclames.
3. Abre tu reclamo generando el sid **en el mismo comando** (probado en este Mac):
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -v+150M +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 204\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/204--$sid.md; echo $sid
   ```
   (150 min = 2 × la duración esperada). Tu sid es el del nombre de ese fichero; no lo guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro reclamo vivo de la 204 con `abierto:` más antiguo
   (o igual y sid menor), añade a tu reclamo `CEDIDA a <sid del otro>` y elige otra tarea. Si hay un reclamo vivo de una tarea que toque
   `catalogo.js` (la 203, por ejemplo), `CEDIDA (catalogo.js en uso por la NN)` y para.
5. Si el reclamo que encuentras está caducado (RELEVABLE en el tablón), relévalo con la línea `releva a: <sid anterior>` **en tu propio
   reclamo**; el suyo no se toca. Mira qué dejó hecho (`git log --oneline -5`, `git status -sb`, la carpeta de salida y
   `grep -n "slug: 'coloca-\(fracciones\|decimales\)'" practicas/_comun/catalogo.js`). Lo que haya con tests en verde se hereda y se dice.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** con el guion de la coordinadora (`$R/hechos/notas/s-20261111T215225-39c1f4f5-regenerar-tablon.py`,
   uso en su cabecera) y sigue con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/204--<sid>.md`) al terminar cada
paso grande. Si vas a tardar más de lo que te queda de caducidad, añade antes una línea `caduca:` más allá. A tu reclamo solo se añade
(`>>`). Tras un turno terminado o un «Continúa», `date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

`coloca-fracciones` (tarea 201) y `coloca-decimales` (tarea 202), sobre el motor común de la 199, son la práctica «Coloca los
paréntesis» de la U1, que tanto le gusta a Juan Luis, con fracciones y con decimales: dos ejercicios de «encuentra todos los
resultados» y una diana cada una. Nacen sin publicar. Esta tarea hace la revisión que no puede hacer un test —el significado y el clic—
y las publica, o reabre la que no pase (la otra se publica igual).

### Criterio de reapertura (el de la 169 y la 195; lo puede cambiar Juan Luis)

- **Se reabre** por un caso del papel que la práctica **pregunta** con los mismos datos (la misma cuenta sin paréntesis, en el mismo
  orden, con el signo en el mismo operando), por la regla de oro (dos chips del mismo valor: 3/4 y 6/8, 0,5 y 0,50; una diana cuyo
  objetivo no se pueda conseguir o sea el de sin paréntesis), por un fallo en pantalla (algo que se sale a 375 px, un chip que no se
  enciende, uno que falta), por un paso escrito mal (una fracción con barra, un resultado sin simplificar, la coma en inglés, un
  negativo sin su paréntesis), por algo que no se ha dado en la unidad (potencias en la U4, negativos o periódicos en la U5), o por
  **variedad** (un ítem en más del 10 % de 20 000 de un ejercicio).
- **No se reabre** por gusto en la redacción que sea correcta, ni por ver los mismos números que en otra práctica.
- **Si reabres una**, la terminada empieza por `PARCIAL:` y dice qué queda; cuando su reabierta esté cerrada, esta misma tarea se vuelve
  a reclamar (reclamo nuevo, «Antes de empezar» entero) para revisar **solo lo reabierto** y publicarla.

## Qué hay que hacer

1. Lee las ENTREGA de la 199, la 201 y la 202 (cotas, recuentos, la medida a 375 px, cómo se probó, hallazgos) y sus terminadas.
2. `node --test tests/practicas-comun.test.js tests/practicas-parentesis-motor.test.js tests/practicas-coloca-fracciones.test.js tests/practicas-ayuda-coloca-fracciones.test.js tests/practicas-coloca-decimales.test.js tests/practicas-ayuda-coloca-decimales.test.js tests/practicas-no-lo-se.test.js`.
3. **Tu propio barrido** (un guion **en el scratchpad**, nunca en el repo), 20 000 ítems por ejercicio con las funciones de cada
   `logica.js`: las cotas de las fichas 201 y 202, la variedad (el ítem más repetido, en %), que ningún par de chips tenga el mismo valor
   (comparado con `_comun/fracciones.js` y `_comun/decimales.js`, nunca con `Number`), y los casos del papel: lee **tú** los de las
   carpetas de la U4 y la U5 (hojas, banco, exámenes semanales `examen-u4-semanaN*.tex` y `examen-u5-semanaN*.tex` —renombrados el
   9-11—, `casos-examen-semana{1,2}.tsv` de la U5, `.tex` del final con `adaptado-A`, `dislexia` y `recuperacion`), cuenta cuántos lees
   de cada fichero, y ninguno puede salir. Mira también si el papel ha cambiado desde que la 201 y la 202 hicieron su barrido
   (`find … -newermt <fecha de su terminada>`): si sí, ese fichero entra entero. En la ENTREGA, solo recuentos.
4. **A mano**: al menos 20 ítems por ejercicio y en los dos idiomas, leyendo la expresión, cada línea de la resolución y los chips
   (fracciones irreducibles con raya, enteros como enteros; coma en español y punto en inglés, sin ceros de más), y 15 explicaciones del
   «No lo sé» por ejercicio e idioma, con las cuentas comprobadas una a una.
5. **En el navegador**, con clics de ratón (nunca Intro), a 375 px y a 1200 px, en español y en inglés, con «Probar sin código» (nunca el
   código de un alumno ni `AJJN`): en cada «todos», un ítem hasta encender **todos** los chips, una pista, el borrar y un paréntesis sin
   cerrar; en cada diana, un acierto y un fallo (el feedback dice qué da lo puesto y una colocación que sí da el objetivo); el «No lo sé»
   una vez en cada ejercicio; que cuatro fracciones con raya y cuatro decimales como 12,25 caben en una línea a 375 px; consola limpia.
6. **Publicar**: `disponible: true` en las filas 81 y 82 de `catalogo.js` de las que pasen (nada más de ese fichero). En
   `docs/practicas-unidad4.md` y `docs/practicas-unidad5.md`, la línea de publicadas y la fila de cada práctica; en `README.md`, la fila de
   `coloca-fracciones` en la tabla de la unidad 4 y su recuento («Diez prácticas más» pasa a once); la U5 no tiene sección en el README
   el 14-11: si sigue sin ella, no se crea (dilo en la ENTREGA), y si alguien la ha añadido, su fila. Commit con rutas
   explícitas. La comprobación es por URL (la portada oculta la U4 hasta el 14-12 y la U5 hasta el 18-1); si hace falta, cambiando la
   fecha solo en tu guion de prueba, nunca en el código.
7. **Las propuestas para las tareas semanales**: la de la semana 3 de la U4 (tarea 121, con la ENTREGA de la 170) y la de la semana 2 de la
   U5 (tarea 132, montada el 14-11 con la ENTREGA de la 195). Di en la ENTREGA qué ejercicios de cada práctica propones añadir y cómo (lo
   razonable: como «a elegir»; ★ solo si Juan Luis lo quiere), mirando que todo lo que citen esté publicado y que cada tarea siga
   puntuando sobre 100 (tarea 166). Si la tarea de esa semana aún no está montada, que la propuesta vaya a quien la monte. **Juan Luis
   las cambia en el panel**; tú no las tocas.

## Datos de entrada

- Las ENTREGA de la 199, la 201, la 202, la 170, la 121 y la 195 (y la 132), solo lectura.
- Carpetas de las unidades, solo lectura: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/4. Fractions/`
  y `…/5. Decimals/` — inventario y acta de cada una, `hojas-de-ejercicios/`, `exámenes-semanales/`, `examen-final/*.tex`.

## Cómo saber que ha terminado

- Cada una de las dos, o publicada (`disponible: true` en el `catalogo.js` comiteado y empujado) o con una reabierta nueva en
  `hechos/reabiertas/` con el motivo concreto según el criterio (ítem, chip, línea, por qué; nunca un caso de examen en claro), y entonces
  la terminada empieza por `PARCIAL:`.
- `npm test` sin fallos.
- Las dos propuestas en la ENTREGA, y dichas a Juan Luis en tu último mensaje con los enlaces
  https://salasgar.github.io/Ejercicios-interactivos/practicas/coloca-fracciones/?probar=1 y …/coloca-decimales/?probar=1 para que las pruebe.

## Trampas conocidas

- (de la coordinadora) **Dos escrituras del mismo número son la misma respuesta** (3/4 = 6/8; 0,5 = 0,50 = 1/2): un barrido que compare
  textos no ve los chips repetidos. Por valor, con las clases de `_comun`.
- (de la 130, 8-11) **Un ejemplo inventado puede ser un caso de examen**: antes de comitear la ENTREGA, las reabiertas o los docs, busca
  en ellos todos los números de los casos (pasó tres veces en la 130).
- (de la coordinadora, 11-11 y 13-11) Los `.tex` de los exámenes semanales de la U4 y la U5 cambiaron de nombre el 9-11
  (`examen-u4-semanaN*.tex`, `examen-u5-semanaN*.tex`): un guion con los nombres viejos no lee **ningún** examen y da cero coincidencias
  sin avisar. Cuenta los casos que lee de cada fichero.
- (de la 115) Clic de verdad en Chrome headless: `Input.dispatchMouseEvent` (moved, pressed, released) en el centro del
  `getBoundingClientRect()` del botón visible, no `element.click()`.
- (de la 169) **Guion de clics que no se queda viejo**: importa en la página las funciones de la propia práctica
  (`await import('/practicas/<slug>/logica.js')`) para saber qué colocación da cada chip. El idioma alterna **por bloques**.
- (de la 163) El 8080 suele estar ocupado: levanta tu servidor en otro puerto y copia un perfil de Chrome ya usado (borra sus
  `Singleton*`); con un perfil nuevo la primera carga pasa de 30 s. `python3 -m http.server` corta conexiones con CDP: mejor Node.
- (de la 162) `npm test` con otras sesiones en la máquina puede tardar más de 20 min: estira la caducidad **antes** de lanzarlo.
- (de la coordinadora, 5-11) `catalogo.js` lo comparten muchas tareas: edita, comitea con ruta explícita y suéltalo enseguida. Hay
  ENTREGA antiguas con casos de examen en claro: no copies a la tuya frases de otras sin leerlas.
- (de la 204, 16-11) **Mira el renglón a 375 px lo primero**: con fracciones y decimales se partía en casi todos los ítems (las dos
  `estilos.css` no tenían la regla de 375 px de `coloca-enteros`), y eso reabre sin más. Con fracciones, cuenta los renglones por el
  **centro** de cada `.celda` (`top + height / 2`), no por su `top`: la fracción es más alta que un natural y el `top` da renglones de más.
  Para saber cuánto falta, `flex-wrap: nowrap` y compara `scrollWidth` con `clientWidth` de `.expr`.
- (de la 204, 16-11) Para el guion de clics, el ítem se lee del DOM: la fracción, de los dos hijos de `.frac` (el `textContent` los pega:
  «34» es 3/4) y el signo, de delante; el decimal, con `deTexto` de `_comun/decimales.js`; el motor admite `{ num, den }` plano. El objetivo
  de la diana, comparando el `textContent` de `M.htmlValor(v)` de cada valor con el de `.objetivo`. Una colocación toda a cero no dispara
  la evaluación (no hay mensaje que esperar), y con todos los chips encendidos los huecos se bloquean: no se pueden esperar más mensajes.
- (de la 204, 16-11) **Regla de git del 16-11**: se escribe, comitea y empuja desde el árbol compartido (CLAUDE.md). La 203 y el
  principio de la 204 se hicieron en un worktree, y otra sesión tuvo que realinear el main.

## Prohibido (propio de esta tarea)

- Corregir el código de las prácticas o del motor (más allá de una errata de texto de una línea): se reabre.
- Publicar otras prácticas, o tocar en `catalogo.js` algo que no sea `disponible` de las filas 81 y 82.
- Comitear `catalogo.js` o `README.md` si `git status` los da modificados por otra sesión antes de tu cambio.
- Cambiar `UNIDADES`, la fecha desde la que la portada enseña la U4 o la U5, o las tareas semanales (en el panel o en `tareas.js`).
- Escribir un caso de examen en claro (en la ENTREGA, en un test, en un comentario, en un mensaje de commit).

## Reglas de contenido de la unidad 4 y de la unidad 5

Las de la ficha 106 (`$R/tareas/tarea-106-combinadas-fracciones.md`) y las de la ficha 130 (`$R/tareas/tarea-130-publicar-u5-semana1.md`),
que **se leen enteras antes de empezar**; si discrepan de las actas (`4. Fractions/inventario-unidad4-revision.md`,
`5. Decimals/inventario-unidad5-revision.md`), mandan las actas. Lo que más se mira: un mismo número con varias escrituras es una sola
respuesta; fracciones irreducibles con raya, ni decimales ni mixtos en la U4; coma en español y punto en inglés, ni negativos ni
periódicos en esta práctica de la U5; inglés sencillo; feedback con los números del ítem; los casos del papel, fuera.

## Si la sesión se alarga

Con una señal (releer lo ya leído, respuestas lentas, aviso de límite), termina esta tarea y no encadenes. Con varias, deja lo publicado
en un estado coherente (una práctica publicada y comiteada vale aunque la otra quede sin revisar), escribe
`$R/hechos/notas/<sid>-traspaso-204.md` con el estado exacto, `$R/hechos/fallos/204--<sid>.md` con `parada por: sesión agotada` y la ruta
de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si un paso te pide **decidir** algo que va a durar (otras cotas, otro número de ejercicios, cambiar una tarea semanal), no lo decidas:
hallazgo para Juan Luis en tu terminada, y sigue con lo que no dependa de ello. Si está mal cortada: `$R/hechos/incidencias/<sid>.md`,
`$R/hechos/fallos/204--<sid>.md` con `parada por: mal cortada`, `ABANDONADA`, y díselo al usuario.

## Al terminar

Por este orden (el del repositorio git):

1. Los tests del paso 2 en verde y `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con reclamo vivo no es tuyo:
   anótalo en la terminada).
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas:
   `git add <rutas> && git commit -m "Publicadas coloca-fracciones y coloca-decimales (tarea 204, U4 y U5)" -- <rutas>` (ajusta el
   mensaje a lo que de verdad publiques). Apunta el hash.
3. Escribe `$R/salidas/204-publicar-coloca-fracciones-decimales/ENTREGA.md` (veredicto por práctica, hash, recuentos del barrido sin casos
   en claro, variedad, cómo se probó en el navegador, las dos propuestas y los hallazgos fuera de criterio) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/204--<sid>.md`: hash, ficheros (lo que dice `git show --stat`), qué se publica y qué se reabre, tests,
   hora y **duración real** (de `abierto:` a ahora).
5. Añade `CERRADA` a tu reclamo (línea propia que empieza por esa palabra).
6. Choques encontrados → `$R/hechos/incidencias/<sid>.md`.
7. `git fetch origin`, relista `$R/hechos/` **ahora** y regenera `$R/_ESTADO.md` entero (el guion de la coordinadora).
8. Vuelca abajo, en «Trampas conocidas» de esta ficha, lo que hayas aprendido por las malas (es lo único de la ficha que editas, además
   de la duración).
9. Un solo commit con rutas explícitas de tus ficheros de `$R/hechos/` (por sid), tu carpeta de `$R/salidas/`, `$R/_ESTADO.md` y esta
   ficha, y `git push origin main`. Si el push se rechaza: `git pull --rebase origin main` (nunca `--autostash`), regenera el tablón
   otra vez desde `hechos/` (no lo fusiones a mano) y vuelve a comitear y empujar.
10. Dile al usuario la **foto del momento** en tres líneas («EN CURSO: … · LIBRES ahora: … · BLOQUEADAS: …») y, **solo para las LIBRES**,
    las frases de arranque de `proyecto.md` literales, en bloques de cita.
11. Decide si encadenas la 203 (solo en verde: misma banda, sin esperas, y si su precondición se cumple). Si encadenas, «Antes de empezar»
    entero otra vez, con reclamo nuevo, y di el nombre nuevo que te toca.

Si paras sin terminar: `$R/hechos/fallos/204--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni `practicas/_comun/` (esta, solo `disponible` de dos filas de
  `catalogo.js`), ni `css/estilos.css`, ni `firestore.rules` ni `src/firebase.js`, ni fichas ajenas, ni nada de la carpeta de apuntes de
  iCloud.
- `git add .`, `git add -A`, `git commit -a`, o un `add` separado del `commit`. El índice es compartido con otras sesiones del mismo árbol.
  Nunca `git stash`, `--autostash`, `git checkout -- .` ni `git reset --hard`.
- Editar el código con `sed -i` o heredocs desde el shell: el candado de sesiones solo ve Edit/Write. El código se edita con las
  herramientas de edición; `hechos/` sí se escribe desde el shell (un escritor).
- Reescribir un fichero de `hechos/` (solo `>>`), editar un reclamo ajeno, o regenerar el tablón de memoria sin relistar `hechos/`.
- Dependencias nuevas (npm, CDN). Nombres de alumnos reales en ningún fichero.
