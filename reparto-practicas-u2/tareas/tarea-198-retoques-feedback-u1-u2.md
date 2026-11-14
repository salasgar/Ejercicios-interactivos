# Tarea 198 · Retoques de una línea en el feedback de ocho prácticas de la U1 y la U2 (`rectangulos`, `arbol`, `divisiones`, `baldosas`, `leelo`, `jerarquia`, `raiz`, `distributiva`): concordancias, signos y unidades que encontró la 193

Actualizado: 2026-11-14 (alta de la coordinadora s-20261114T205046-d42ceb19; hallazgos 14, 17 y 18 de la revisión 193. Son ocho prácticas con un retoque o dos cada una: una sola tarea en vez de ocho reabiertas de diez minutos)
Precondición: ninguna tarea previa (la 193 está LISTA) · ningún reclamo vivo de otra tarea que toque esas ocho carpetas, ni cambios sin comitear en ellas (las quince reabiertas del 14-11 son de **otras** prácticas) · Disparo: MANUAL
Duración esperada: 1 h (tiempo de sesión) · Banda de modelo: MEDIO · Encadenable con: ninguna
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/198-retoques-feedback-u1-u2/` (solo `ENTREGA.md` y su marcador)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/rectangulos/textos.js`, `practicas/arbol/textos.js`, `practicas/divisiones/textos.js`, `practicas/baldosas/textos.js`, `practicas/leelo/textos.js`, `practicas/jerarquia/textos.js`, `practicas/raiz/textos.js`, `practicas/distributiva/textos.js`; `practicas/<slug>/logica.js` y `practica.js` de esas ocho solo donde se compone un texto (en `leelo/logica.js`, solo la `frase` de `divisor_pair`); y sus tests `tests/practicas-<slug>.test.js` y `tests/practicas-ayuda-<slug>.test.js`

La duración esperada no es informativa: de ella sale la caducidad del reclamo (2 ×), el plazo tras el cual otra
sesión puede relevarte si te cortas. **Este fichero es la fuente de la banda**: el tablón la copia de aquí cada vez que
se regenera. La tabla de bandas de `proyecto.md` la traduce al menú de hoy (ALTO = Opus 5.5, esfuerzo Alto; MEDIO =
Sonnet 5.5, esfuerzo Medio).

## Antes de empezar

Todas las rutas son relativas a la raíz del repositorio (`/Users/salasgar/Documents/git/Ejercicios-interactivos`).
`R=reparto-practicas-u2`. Las sesiones de este reparto trabajan en ese árbol, no en un worktree.

1. Lee `$R/proyecto.md` (al menos «Dónde está cada cosa», «Reglas de contenido comunes», «Tareas 171-194» y **«Decisiones del 14-11»**),
   `$R/_ESTADO.md`, `docs/no-lo-se.md` y los hallazgos de `$R/salidas/193-revision-no-lo-se/ENTREGA.md`, y lista `$R/hechos/`
   (`ls $R/hechos/*/`): la carpeta manda sobre la tabla.
2. `date -u` para la hora de verdad. `git fetch origin && git status -sb`; si hay commits que traer,
   `git pull --rebase origin main` (nunca `--autostash`). **Comprueba la precondición en el disco**:
   `git status --short practicas/rectangulos/ practicas/arbol/ practicas/divisiones/ practicas/baldosas/ practicas/leelo/ practicas/jerarquia/ practicas/raiz/ practicas/distributiva/` tiene que salir **vacío**, y ningún reclamo vivo de las tareas 03, 06, 07, 13, 15, 20, 22 ni 27 (las dueñas de esas carpetas).
   Si algo tuyo sale modificado, es trabajo de otra sesión: no lo toques y no reclames.
3. Abre tu reclamo generando el sid **en el mismo comando** (probado en este Mac):
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -v+120M +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 198\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/198--$sid.md; echo $sid
   ```
   (120 min = 2 × la duración esperada). Tu sid es el del nombre de ese fichero; no lo guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/ | grep '^198--'` — el comando, no la intención. Si hay otro reclamo vivo de la 198
   con `abierto:` más antiguo (o igual y sid menor), añade a tu reclamo `CEDIDA a <sid del otro>` y para.
5. Si el reclamo que encuentras está caducado (RELEVABLE), relévalo con `releva a: <sid anterior>` **en tu propio
   reclamo**. Mira qué dejó hecho (`git log --oneline -8`, `git status -sb`, su carpeta de salida): lo que esté
   comiteado con tests en verde se hereda y se dice en la terminada; lo demás se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** con el guion (`$R/hechos/notas/s-20261111T215225-39c1f4f5-regenerar-tablon.py`,
   ver su cabecera) y sigue con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/198--<sid>.md`) al
terminar cada paso grande. Si vas a tardar más de lo que te queda, añade antes una línea `caduca:` más allá. A tu reclamo
solo se añade (`>>`). Tras cualquier pausa: `date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

La revisión 193 corrigió las tarjetas del «No lo sé» y dejó apuntado el feedback que ya estaba mal. Lo gordo va en quince reabiertas;
esto es lo menudo de ocho prácticas que no tienen reabierta. **Solo textos**: ningún número de ningún generador, ninguna opción, ninguna exclusión de
examen. Todas están publicadas y siguen publicadas.

## Qué hay que hacer

Los números de línea son del 14-11 y pueden haberse movido: busca por el nombre o por la frase.

1. **`rectangulos`**, `TX.parar.correcto` (línea ~57): «… = 81 ≤ 91 < …», con el «<» sin escapar dentro de HTML. Escápalo (`&lt;`) en
   los dos idiomas; el texto no cambia (ahí el «<» es el símbolo, y los alumnos lo conocen).
2. **`arbol`**, `ayuda.construir` (línea ~106) y `puntas` (línea ~113): «todas las puntas sean primos» / «son primos» → «todas las
   puntas sean números primos» / «son números primos».
3. **`divisiones`**, ej. 3: los números de cinco cifras o más salen sin espacio de miles (11979). Con el formateador de la base que ya
   use la práctica o la base (`fmt`), en los dos idiomas, en enunciado, feedback y tarjeta. Si el número se escribe en una caja o se
   compara como texto, que el formato no cambie lo que se da por bueno.
4. **`baldosas`**, la instrucción del ej. 2 (línea ~56) y el ejemplo de la introducción (línea ~46): «baldosas de lado 12», sin
   unidad → «baldosas de 12 dm de lado» / «tiles with a side of 12 dm», como ya dice la tarjeta (línea ~120).
5. **`leelo`**: (a) `correcta_fue` (línea ~23), «La frase correcta es: …» → sin dos puntos entre el verbo y lo que sigue, como la
   tarjeta («La frase correcta es «…»»; mira cómo se compone). (b) la plantilla `divisor_pair` (`logica.js`, línea ~419; es la **frase del ítem**):
   «4 · 8 is a ___ pair of 32» → «4 and 8 are a ___ pair of 32» (la pareja son los dos números, no su producto). Los números y las
   opciones no cambian. **Regla de oro**: con la frase nueva, «remainder» y «quotient» siguen siendo inequívocamente falsas; compruébalo.
   Además, x e y pueden salir iguales (3 y 3): déjalo como está, pero dilo en la ENTREGA.
6. **`jerarquia`**, `intro1` en inglés (línea ~28): «a sum with several operations» → «a calculation with several operations» (y «the
   calculation gets shorter»).
7. **`raiz`**, `TX.prob.respuesta` y `TX.comun.sobran`: «sobran 1» → «sobra 1»; en inglés «1 is left over». La tarjeta ya lo hace.
8. **`distributiva`**, `TX.compensar.explicacion_producto` (línea ~112): «se les quita dos columnas» → «se les quitan dos columnas»
   (con una columna, «se les quita una columna»). La tarjeta ya lo hace (línea ~171).
9. En cada una, un test que vigile lo corregido (por ejemplo: ningún «sobran 1»; ningún «<» fuera de etiqueta en el feedback; ningún
   número de cinco cifras seguidas; «dm de lado»), sobre 300 ítems por ejercicio o recorriendo los casos.
10. Hash de 300 ítems por ejercicio con la misma semilla, antes y después, en las ocho: iguales (solo cambian textos), salvo
    `leelo` ej. 3, donde cambia la frase de `divisor_pair` y nada más (compruébalo comparando los ítems sin la frase).
11. Clic a 375 px en los ejercicios tocados, en los dos idiomas.

Un commit por práctica (rutas explícitas de su carpeta y sus tests), o uno solo con las ocho; el push, al final, con todo en verde.

## Cómo saber que ha terminado

- Los ocho retoques hechos y vigilados por test, los generadores con el mismo hash, `npm test` en verde, comiteado y empujado, y las
  ocho prácticas cargan en https://salasgar.github.io/Ejercicios-interactivos/practicas/<slug>/.

## Trampas conocidas

- (de la coordinadora) **No es de esta tarea** el feedback común de `practicas/_comun/relaciones.js` (`explicacionCompleta`, en `recta`
  ej. 3 y `divisores`): encadena varias frases con dos puntos, pero es correcto y se deja (decisión del 14-11).
- (de la coordinadora) Los signos sueltos a 375 px detrás de una cuenta son de la base (tarea 197): no los parchees aquí.
- (de la coordinadora) Si al leer encuentras algo más que un retoque de texto (una regla falsa, un ítem imposible), no lo arregles:
  hallazgo en la ENTREGA, y la coordinadora reabre a la dueña.
- (de la 198, s-20261114T231306-acc90cc9) Un test que quita las etiquetas con `''` puede pegar dos números vecinos y ver cifras de más: quítalas con `' '`. El `<` suelto de rectangulos estaba en cuatro textos, no solo en `parar.correcto`.
- (de la 198) `git pull --rebase` falla si hay ficheros sin versionar ajenos con el mismo nombre que los de origin: empuja desde un worktree limpio (`git worktree add /tmp/wt origin/main`, cherry-pick, `npm test`, regenerar el tablón allí).

## Prohibido (propio de esta tarea)

- Tocar generadores, opciones, exclusiones de casos de examen, `catalogo.js` o cualquier práctica que no sea una de las ocho.

## Si la sesión se alarga

Si no te cabe todo, comitea lo que esté con tests en verde, escribe `$R/hechos/fallos/198--<sid>.md` con lo que queda y
`parada por: sesión agotada`, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

No recortes tú. Termina lo que quepa, escribe `$R/hechos/incidencias/<sid>.md` (tamaño real y dónde está el corte
natural), `$R/hechos/fallos/198--<sid>.md` con `parada por: mal cortada`, `ABANDONADA` en tu reclamo, y díselo a Juan Luis.

## Al terminar

1. `node --test tests/practicas-rectangulos.test.js tests/practicas-ayuda-rectangulos.test.js tests/practicas-arbol.test.js tests/practicas-ayuda-arbol.test.js tests/practicas-divisiones.test.js tests/practicas-ayuda-divisiones.test.js tests/practicas-baldosas.test.js tests/practicas-ayuda-baldosas.test.js tests/practicas-leelo.test.js tests/practicas-ayuda-leelo.test.js tests/practicas-jerarquia.test.js tests/practicas-ayuda-jerarquia.test.js tests/practicas-raiz.test.js tests/practicas-ayuda-raiz.test.js tests/practicas-distributiva.test.js tests/practicas-ayuda-distributiva.test.js tests/practicas-no-lo-se.test.js` en verde y `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con reclamo vivo no es tuyo:
   anótalo en la terminada).
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas y en la misma orden:
   `git add <rutas> && git commit -m "Retoques de feedback en <slug> (tarea 198)" -- <rutas>`; y `git push origin main` (si se rechaza,
   `git pull --rebase origin main`, nunca `--autostash`). Apunta el hash (`git rev-parse --short HEAD`). **Lo empujado
   lo ven los alumnos en las prácticas publicadas**: no empujes nada sin sus tests en verde.
3. Escribe `$R/salidas/198-retoques-feedback-u1-u2/ENTREGA.md` y su marcador vacío `ENTREGA.md.ok-<sid>`. Dos apartados separados:
   **lo hecho** (qué se cambió, hash, cómo se probó, con las medidas) y **hallazgos fuera de criterio**, que son para Juan Luis.
   Nunca un caso de examen en claro.
4. Escribe `$R/hechos/terminadas/198--<sid>.md`: hashes, ficheros (lo que dice `git show --stat`), tests, hora y
   **duración real** (de `abierto:` a ahora). Si queda algo sin hacer, empieza por `PARCIAL:` y di qué.
5. Añade `CERRADA` a tu reclamo (línea propia que empieza por esa palabra).
6. Choques encontrados → `$R/hechos/incidencias/<sid>.md`.
7. `git fetch origin`, relista `$R/hechos/` **ahora** y regenera `$R/_ESTADO.md` entero con el guion.
8. Vuelca en «Trampas conocidas» lo que hayas aprendido por las malas (es lo único de la ficha que editas, además de la duración).
9. Un solo commit con rutas explícitas de tus ficheros de `$R/hechos/` (por sid), tu carpeta de `$R/salidas/`,
   `$R/_ESTADO.md` y esta ficha, y `git push origin main`. Si el push se rechaza: `git pull --rebase origin main`,
   regenera el tablón otra vez desde `hechos/` (no lo fusiones a mano) y vuelve a comitear y empujar.
10. Dile al usuario la **foto del momento** en tres líneas («EN CURSO: … · LIBRES ahora: … · BLOQUEADAS: …»), sacada
    de la lectura de `hechos/` del paso 7.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `practicas/_comun/`, ni `tests/practicas-no-lo-se.test.js`, ni `docs/`, ni `catalogo.js`, ni `css/`, ni `README.md`, ni
  `firestore.rules`, ni fichas ajenas, ni nada de la carpeta de apuntes de iCloud.
- `git add .`, `git add -A`, `git commit -a`, o un `add` separado del `commit`. El índice es compartido con otras
  sesiones del mismo árbol. Nunca `git stash`, `--autostash`, `git checkout -- .` ni `git reset --hard`.
- Editar el código con `sed -i` o heredocs desde el shell: el candado de sesiones solo ve Edit/Write. El código se
  edita con las herramientas de edición; `hechos/` sí se escribe desde el shell (un escritor).
- Reescribir un fichero de `hechos/` (solo `>>`), editar un reclamo ajeno, o regenerar el tablón de memoria.
- Dependencias nuevas (npm, CDN). Nombres de alumnos reales en ningún fichero.
