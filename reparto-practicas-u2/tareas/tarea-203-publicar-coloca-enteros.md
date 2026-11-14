# Tarea 203 · Revisión a mano (con clics) y publicación de «Coloca los paréntesis. Con enteros» (`coloca-enteros`, 80), con la propuesta de dónde entra en la tarea semanal de la U3

Actualizado: 2026-11-14 (alta de la coordinadora s-20261114T212714-761c8123, por el encargo de Juan Luis del 14-11; decisiones en `proyecto.md`, «Decisiones del 14-11: colocar paréntesis en la U3, la U4 y la U5»)
Precondición: **200 LISTA** (terminada sin `PARCIAL`) · **no en paralelo con la 204** ni con ninguna otra que toque `catalogo.js`, `docs/practicas-unidad3.md` o `README.md` (mira los reclamos vivos, paso 2 de «Antes de empezar») · Disparo: MANUAL · **Plazo: jue 3-12** (U3-4A-04 y 4A-06 son de la sesión 13, semana 4, mié 9-12; así Juan Luis tiene tiempo de meterla en la tarea de esa semana)
Duración esperada: 1 h (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: 204 (si su precondición se cumple)
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/203-publicar-coloca-enteros/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/catalogo.js` (solo `disponible` de la fila 80, `coloca-enteros`), `docs/practicas-unidad3.md` (la línea de publicadas y la fila de la práctica), `README.md` (una fila en la tabla de la unidad 3 y el recuento de su párrafo); y, solo para una errata de texto de una línea, `practicas/coloca-enteros/textos.js` (declarándolo en la terminada, como la 119)

La duración esperada no es informativa: de ella sale la caducidad del reclamo (2 ×, mínimo 45 min), el plazo tras el cual otra
sesión puede relevarte si te cortas. **Este fichero es la fuente de la banda**: el tablón la copia de aquí cada vez que se regenera.
La tabla de bandas de `proyecto.md` la traduce al menú de hoy (ALTO = Opus 5.5, esfuerzo Alto; MEDIO = Sonnet 5.5, esfuerzo Medio).

## Antes de empezar

Todas las rutas son relativas a la raíz del repositorio (`/Users/salasgar/Documents/git/Ejercicios-interactivos`).
`R=reparto-practicas-u2`.

1. Lee `$R/proyecto.md` (al menos «Reglas de contenido comunes», «Reglas de contenido de la unidad 3», «Tareas 169-170» —el
   criterio de reapertura— y **«Decisiones del 14-11: colocar paréntesis en la U3, la U4 y la U5»**) y `$R/_ESTADO.md` enteros, y
   **lista `$R/hechos/`** (`ls $R/hechos/*/`): la carpeta manda sobre la tabla.
2. `date -u` para saber la hora de verdad. `git fetch origin && git status -sb` (`git pull --rebase origin main` si hay commits que
   traer; nunca `--autostash`). **Comprueba la precondición en el disco**: la terminada de la 200 (`ls $R/hechos/terminadas/ | grep '^200--'`,
   sin `PARCIAL`), ninguna reabierta de la 200 posterior a ella (`ls $R/hechos/reabiertas/ | grep '^200--'`), ningún reclamo vivo de una
   tarea que toque `catalogo.js` (`grep -l 'catalogo.js' $R/tareas/*.md` da las fichas; cruza sus números con `ls $R/hechos/reclamos/`), y
   `git status --short practicas/_comun/catalogo.js docs/practicas-unidad3.md README.md practicas/coloca-enteros` tiene que salir
   **vacío**. Si algo sale modificado, es trabajo de otra sesión: no lo toques y no reclames.
3. Abre tu reclamo generando el sid **en el mismo comando** (probado en este Mac):
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -v+120M +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 203\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/203--$sid.md; echo $sid
   ```
   (120 min = 2 × la duración esperada). Tu sid es el del nombre de ese fichero; no lo guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro reclamo vivo de la 203 con `abierto:` más antiguo
   (o igual y sid menor), añade a tu reclamo `CEDIDA a <sid del otro>` y elige otra tarea. Si hay un reclamo vivo de una tarea que toque
   `catalogo.js` (la 204, por ejemplo), `CEDIDA (catalogo.js en uso por la NN)` y para.
5. Si el reclamo que encuentras está caducado (RELEVABLE en el tablón), relévalo con la línea `releva a: <sid anterior>` **en tu propio
   reclamo**; el suyo no se toca. Mira qué dejó hecho (`git log --oneline -5`, `git status -sb`, la carpeta de salida y
   `grep -n "slug: 'coloca-enteros'" practicas/_comun/catalogo.js`). Lo que haya con tests en verde se hereda y se dice en la terminada.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** con el guion de la coordinadora (`$R/hechos/notas/s-20261111T215225-39c1f4f5-regenerar-tablon.py`,
   uso en su cabecera) y sigue con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/203--<sid>.md`) al terminar cada
paso grande. Si vas a tardar más de lo que te queda de caducidad, añade antes una línea `caduca:` más allá. A tu reclamo solo se añade
(`>>`). Tras un turno terminado o un «Continúa», `date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

`coloca-enteros` (tarea 200, sobre el motor común de la 199) es la práctica «Coloca los paréntesis» de la U1, que tanto le gusta a
Juan Luis, con enteros: tres ejercicios de «encuentra todos los resultados» (tres números, con una potencia, con división). Nace sin
publicar. Esta tarea hace la revisión que no puede hacer un test —el significado y el clic— y la publica, o la reabre.

### Criterio de reapertura (el de la 169 y la 195; lo puede cambiar Juan Luis)

- **Se reabre** por un caso del papel que la práctica **pregunta** con los mismos datos (la misma cuenta sin paréntesis, en el mismo
  orden), por un fallo en pantalla (algo que no se ve, que se sale a 375 px, un chip que no se puede encender, uno que falta), por
  un paso escrito mal (un negativo sin su paréntesis detrás de una operación, un `−2²` donde va `(−2)²`, un `(+5)`), por algo que no
  se ha dado en la unidad, o por **variedad** (un ítem en más del 10 % de 20 000 de un ejercicio).
- **No se reabre** por gusto en la redacción que sea correcta, ni por ver los mismos números que en otra práctica.
- **Si reabres**, la terminada empieza por `PARCIAL:` y dice qué queda; cuando su reabierta esté cerrada, esta misma tarea se vuelve a
  reclamar (reclamo nuevo, «Antes de empezar» entero) para revisar **solo lo reabierto** y publicarla.

## Qué hay que hacer

1. Lee la ENTREGA de la 199 (`$R/salidas/199-motor-coloca-parentesis/ENTREGA.md`) y la de la 200 (`$R/salidas/200-coloca-enteros/ENTREGA.md`:
   cotas, recuentos, cómo se probó, hallazgos), y la terminada de la 200.
2. `node --test tests/practicas-comun.test.js tests/practicas-parentesis-motor.test.js tests/practicas-coloca-enteros.test.js tests/practicas-ayuda-coloca-enteros.test.js tests/practicas-no-lo-se.test.js`.
3. **Tu propio barrido** (un guion **en el scratchpad**, nunca en el repo), 20 000 ítems por ejercicio con las funciones de
   `practicas/coloca-enteros/logica.js`: las cotas de la ficha 200 (número de resultados, |valor| ≤ 200, el 40 % de base negativa en el
   ej. 2, inválidos solo en el ej. 3), la variedad (el ítem más repetido, en %) y los casos del papel: lee **tú** los de la carpeta de la
   U3 (hojas, banco, exámenes semanales 3 y 4, `.tex` del final con `adaptado-A`, `modelo1-dislexia` y `recuperacion`) y cuenta cuántos
   lees de cada fichero; ninguno puede salir. En la ENTREGA, solo recuentos.
4. **A mano**: al menos 20 ítems por ejercicio y en los dos idiomas, leyendo la expresión, cada línea de la resolución (signos,
   paréntesis de los negativos, potencias de base negativa) y los chips; y 15 explicaciones del «No lo sé» por ejercicio e idioma, con
   las cuentas comprobadas una a una.
5. **En el navegador**, con clics de ratón (nunca Intro), a 375 px y a 1200 px, en español y en inglés, con «Probar sin código» (nunca el
   código de un alumno ni `AJJN`): en cada ejercicio, un ítem hasta encender **todos** los chips, una pista, el borrar, un paréntesis sin
   cerrar, una agrupación que no se puede (ej. 3) y el «No lo sé» una vez (la explicación sale y el ítem siguiente es otro); que la
   expresión de cuatro números con un negativo delante cabe en una línea a 375 px; consola limpia.
6. **Publicar**: `disponible: true` en la fila 80 de `catalogo.js` (nada más de ese fichero), si pasa. En `docs/practicas-unidad3.md`, la
   línea de publicadas y la fila de la práctica; en `README.md`, la fila de `coloca-enteros` en la tabla de la unidad 3 (semana 3-4) y el
   recuento del párrafo («Doce prácticas más» pasa a trece). Commit con rutas explícitas. La U3 está en la portada desde el 16-11: **lo
   empujado lo ven los alumnos**, así que se publica solo con todo lo anterior en verde.
7. **La propuesta para la tarea semanal**: la tarea de la semana 4 de la U3 ya está montada en el panel (tarea 116, con la ENTREGA de la
   96; desde el mié 9-12). Di en la ENTREGA qué ejercicios de `coloca-enteros` propones añadir y cómo (lo razonable: como «a elegir»;
   ★ solo si Juan Luis lo quiere), mirando que todo lo que cite esté publicado y que la tarea siga puntuando sobre 100 (tarea 166: cada
   ejercicio que cuenta pesa 100 / (★ + a elegir)). **Juan Luis la cambia en el panel**; tú no la tocas.

## Datos de entrada

- Las ENTREGA de la 199 y la 200, y la de la 96 (la tarea de la semana 4 de la U3), solo lectura.
- Carpeta de la unidad, solo lectura: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/3. Integers/`
  — `inventario-unidad3.tsv`, `hojas-de-ejercicios/`, `exámenes-semanales/semana-{3,4}/`, `examen-final/*.tex`.

## Cómo saber que ha terminado

- `coloca-enteros` publicada (`disponible: true` en el `catalogo.js` comiteado y empujado, y la práctica en la portada, bloque de la semana
  3 de la U3) o con una reabierta nueva en `hechos/reabiertas/` con el motivo concreto según el criterio (ítem, línea, por qué; nunca un caso
  de examen en claro), y entonces la terminada empieza por `PARCIAL:`.
- `npm test` sin fallos.
- La propuesta para la tarea de la semana 4 en la ENTREGA, y dicha a Juan Luis en tu último mensaje, con el enlace
  https://salasgar.github.io/Ejercicios-interactivos/practicas/coloca-enteros/?probar=1 para que la pruebe.

## Trampas conocidas

- (de la 115) Clic de verdad en Chrome headless: `Input.dispatchMouseEvent` (moved, pressed, released) en el centro del
  `getBoundingClientRect()` del botón visible, no `element.click()`.
- (de la 169) **Guion de clics que no se queda viejo**: importa en la página las funciones de la propia práctica
  (`await import('/practicas/coloca-enteros/logica.js')`) para saber qué colocación da cada chip, en vez de leer la pantalla con expresiones
  regulares. El idioma alterna **por bloques**: haz otra pasada hasta ver los dos.
- (de la 163) El 8080 suele estar ocupado por el servidor de otra sesión: levanta el tuyo en otro puerto y copia un perfil de Chrome ya
  usado (borra sus `Singleton*`). `python3 -m http.server` corta conexiones con CDP: mejor un servidor estático de Node.
- (de la 162) `npm test` con otras sesiones en la máquina puede tardar más de 20 min: estira la caducidad **antes** de lanzarlo.
- (de la coordinadora, 5-11) `catalogo.js` lo comparten muchas tareas: edita, comitea con ruta explícita y suéltalo enseguida.
- (de la coordinadora, 5-11) Hay ENTREGA antiguas con casos de examen en claro: no copies a la tuya frases de otras sin leerlas.

## Prohibido (propio de esta tarea)

- Corregir el código de la práctica o del motor (más allá de una errata de texto de una línea): se reabre.
- Publicar otras prácticas, o tocar en `catalogo.js` algo que no sea `disponible` de la fila 80.
- Comitear `catalogo.js` o `README.md` si `git status` los da modificados por otra sesión antes de tu cambio.
- Cambiar la tarea semanal en el panel o en `tareas.js`: la propuesta es para Juan Luis.
- Escribir un caso de examen en claro (en la ENTREGA, en un test, en un comentario, en un mensaje de commit).

## Reglas de contenido de la unidad 3

Las de `proyecto.md`, «Reglas de contenido de la unidad 3», que se leen enteras. Lo que más se mira: sin paréntesis al empezar y nunca
`(+5)`; el negativo que no va el primero, entre paréntesis; `(−a)ⁿ` frente a `−aⁿ`; nada de fracciones ni decimales; el menos U+2212;
inglés sencillo; feedback con los números del ítem; los casos del papel, fuera.

## Si la sesión se alarga

Con una señal (releer lo ya leído, respuestas lentas, aviso de límite), termina esta tarea y no encadenes. Con varias, deja lo publicado
en un estado coherente, escribe `$R/hechos/notas/<sid>-traspaso-203.md` con el estado exacto, `$R/hechos/fallos/203--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si un paso te pide **decidir** algo que va a durar (otras cotas, otro número de ejercicios, cambiar la tarea semanal), no lo decidas:
hallazgo para Juan Luis en tu terminada, y sigue con lo que no dependa de ello. Si está mal cortada: `$R/hechos/incidencias/<sid>.md`,
`$R/hechos/fallos/203--<sid>.md` con `parada por: mal cortada`, `ABANDONADA`, y díselo al usuario.

## Al terminar

Por este orden (el del repositorio git):

1. Los tests del paso 2 en verde y `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con reclamo vivo no es tuyo:
   anótalo en la terminada).
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas:
   `git add <rutas> && git commit -m "Publicada coloca-enteros (tarea 203, U3)" -- <rutas>`. Apunta el hash.
3. Escribe `$R/salidas/203-publicar-coloca-enteros/ENTREGA.md` (veredicto, hash, recuentos del barrido sin casos en claro, variedad,
   cómo se probó en el navegador, la propuesta para la tarea de la semana 4 y los hallazgos fuera de criterio) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/203--<sid>.md`: hash, ficheros (lo que dice `git show --stat`), qué se publica o se reabre, tests, hora
   y **duración real** (de `abierto:` a ahora).
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
11. Decide si encadenas la 204 (solo en verde: misma banda, sin esperas, y si su precondición se cumple). Si encadenas, «Antes de empezar»
    entero otra vez, con reclamo nuevo, y di el nombre nuevo que te toca.

Si paras sin terminar: `$R/hechos/fallos/203--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni `practicas/_comun/` (esta, solo `disponible` de una fila de
  `catalogo.js`), ni `css/estilos.css`, ni `firestore.rules` ni `src/firebase.js`, ni fichas ajenas, ni nada de la carpeta de apuntes de
  iCloud.
- `git add .`, `git add -A`, `git commit -a`, o un `add` separado del `commit`. El índice es compartido con otras sesiones del mismo árbol.
  Nunca `git stash`, `--autostash`, `git checkout -- .` ni `git reset --hard`.
- Editar el código con `sed -i` o heredocs desde el shell: el candado de sesiones solo ve Edit/Write. El código se edita con las
  herramientas de edición; `hechos/` sí se escribe desde el shell (un escritor).
- Reescribir un fichero de `hechos/` (solo `>>`), editar un reclamo ajeno, o regenerar el tablón de memoria sin relistar `hechos/`.
- Dependencias nuevas (npm, CDN). Nombres de alumnos reales en ningún fichero.
