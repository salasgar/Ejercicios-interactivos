# Tarea 76 · Fábrica de divisores: quitar el ejercicio 1 («Construye el divisor») sin descuadrar el progreso guardado, y la tarea 2 con árbol 2 como ★

Actualizado: 2026-10-18
Precondición: ninguna, pero **plazo: antes del lunes 26-10 a las 8:00** (abre la tarea 2, que lleva la Fábrica) y, si se puede, **antes del paso de Juan Luis al sistema nuevo** (tarea 70, que copia `TAREAS` a su espacio). Si `practicas/profesor.js` tiene cambios sin commit de la 70, no lo toques: ver «Qué hay que hacer», 5 · Disparo: MANUAL (sesión atendida)
Duración esperada: 1 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/76-fabrica-sin-ej1/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/fabrica/*`, `tests/practicas-fabrica.test.js`, `practicas/_comun/catalogo.js` (solo la fila de `fabrica` y, si hace falta, un campo nuevo documentado arriba), `practicas/_comun/base.js` y `practicas/_comun/nube.js` (solo lo de leer un progreso guardado con el número de ejercicios de antes), `practicas/_comun/registro.js` (solo la entrada `fabrica` de las destrezas), `practicas/_comun/tareas.js` (solo las tareas 2 y 3), `practicas/portada.js` (solo la `DESCRIPCION` de `fabrica`), `practicas/resultados.js` (si el panel lee los progresos por posición), `tests/practicas-comun.test.js` y `tests/practicas-semana.test.js` (solo las líneas de `fabrica`), `tests/practicas-renumerar.test.js` (nuevo)

La duración esperada no es informativa: de ella sale la caducidad del reclamo (2 ×, mínimo
45 min), el plazo tras el cual otra sesión puede relevarte si te cortas. **Este fichero es
la fuente de la banda**: el tablón la copia de aquí cada vez que se regenera. La banda
dice con qué modelo conviene abrir la sesión; la tabla de bandas de `proyecto.md` la
traduce al menú de hoy (ALTO = Opus 5, esfuerzo Alto; MEDIO = Sonnet 5, esfuerzo Medio).

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
   printf 'sesión: %s\ntarea: 76\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/76--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/76--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 76 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/76--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

Juan Luis, 2026-10-18: *«En la práctica "Fábrica de divisores", el ejercicio "Ejercicio 1 · Construye el divisor" en realidad no construye ningún divisor. Lo que tiene que hacer el alumno es factorizar el número que ahí aparece.»* Tiene razón: `montarConstruir` nunca enseña el número n del que se fabrica el divisor. Solo pone «Construye el 12» y un control por cada primo de n, así que el alumno factoriza el 12 y ya. Se le propuso arreglarlo y **eligió eliminarlo**. Para la tarea 2 de la app (lun 26-10 a jue 29-10), donde era obligatorio, eligió **subir `['arbol', 2]` a ★**.

Resultado: la Fábrica se queda con **2 ejercicios**: 1 = «¿Cuántos divisores tiene?» (el 2 de antes) y 2 = «Sin dividir» (el 3 de antes).

**El riesgo es descuadrar datos.** El progreso de cada práctica se guarda **por posición**: `ej` es una lista, en el navegador (`claveProgreso`) y en la nube (`practicas/<slug>--<código>` en el modo antiguo, `progreso-libre` en un espacio), y `fusionarProgreso` fusiona posición a posición. Si se quita el primer ejercicio sin más, lo que un alumno lleva en el 2 de antes aparecería como el 1 nuevo, y el 1 de antes como el 1 nuevo. Pasa lo mismo con lo que se lea por posición en el panel y con los fallos (`ejercicio` empieza en 1).

## Siguiente paso

1. `git status`, `git log --oneline -5` y `ls reparto-practicas-u2/hechos/reclamos/70--*`. Mira si la 70 sigue EN CURSO y si tiene cambios sin commit en `practicas/profesor.js` o en `practicas/_comun/textos.js`.
2. Busca **todo** lo que lee un `ej` guardado por posición: `grep -rn "\.ej\b\|ej:\|fusionarProgreso\|progresoGuardado" practicas/`. Ya hay un precedente de migración: en `progresoGuardado` (`base.js`), `divisores` lee también la clave de antes de la tarea 17.

## Qué hay que hacer

1. **Fábrica:** quita el ejercicio `construir` de `practica.js`, de `logica.js` (y sus exportaciones), de `textos.js` y del test. El 2 y el 3 de antes pasan a ser el 1 y el 2, sin cambiar nada más. En el catálogo, `nEjercicios: 2`. `DESCRIPCION` de la portada: «Cuenta los divisores de un número con su factorización y decide sin dividir si uno es divisor de otro.» / «Count the divisors of a number from its factorisation and decide without dividing if one number is a divisor of another.» En `registro.js`, la lista de destrezas de `fabrica`, sin la del ejercicio quitado (comprueba cuál era por posición).
2. **Leer lo guardado con el número de antes**, en un solo sitio y genérico. Por ejemplo, un campo del catálogo `quitados: { antes: 3, posiciones: [1] }` (documentado en la cabecera de `catalogo.js`) y una función pura `adaptarProgreso(ficha, ej)`: si `ej.length === antes`, quita esas posiciones; si no, lo deja como está. Se aplica a **todo** lo que lee un `ej` guardado (navegador, nube y espacio) antes de fusionar o contar. Así, la primera vez que el alumno abre la Fábrica, su progreso se corrige solo y se vuelve a guardar con 2. Test `tests/practicas-renumerar.test.js`:
   - lista de 3 → 2, con el 2 y el 3 de antes en su sitio nuevo;
   - lista de 2 → igual;
   - fusión local de 3 con nube de 2 → bien;
   - las demás prácticas, intactas.
3. **Tareas** (`tareas.js`):
   - Tarea 2: `estrella` sin `['fabrica', 1]` y con `['arbol', 2]`; `elegir` sin `['arbol', 2]` y con `['fabrica', 1]` en vez de `['fabrica', 2]`. Quedan 6 ★ y elegir 4 de 7.
   - Tarea 3: `['fabrica', 3]` → `['fabrica', 2]`.
   - Busca en `tareas.js` y en sus tests cualquier otra referencia a la Fábrica por número. Las líneas de `tests/practicas-semana.test.js` (448-451) y de `tests/practicas-comun.test.js` (44) se ajustan.
4. **Fallos ya registrados** de la Fábrica (colección `fallos`, y en un espacio si ya existe): **cuéntalos por número de ejercicio, sin cambiarlos**, por REST con la lectura que ya usa `herramientas/informe-actividad.mjs`, y pon el recuento en la entrega. Si hay alguno, propón a Juan Luis qué hacer (renumerar 2→1 y 3→2, y apartar los del 1) y **no escribas nada en la nube sin su visto bueno**. Si no hay ninguno, dilo y listo.
5. **El panel**: si `resultados.js` o `profesor.js` leen el `ej` de la nube por posición, aplica allí también `adaptarProgreso`. Si eso pide tocar `profesor.js` y la 70 lo tiene con cambios sin commit, deja esa parte para cuando la 70 cierre, dilo en la terminada y avisa a la coordinadora.
6. **Si el paso de Juan Luis (70) ya se ha hecho** cuando cierres, su configuración de tareas ya está en su espacio y `tareas.js` ya no manda para él. Dilo en la terminada, en negrita, para que la tarea 2 se corrija también allí (en el editor de tareas del panel o por la herramienta de la 70) antes del lunes 26-10.

## Datos de entrada

- `practicas/_comun/nube.js` (`fusionarProgreso`), `practicas/_comun/base.js` (`progresoGuardado`, carga y fusión hacia las líneas 390-460), `practicas/_comun/espacio.js` y `practicas/resultados.js`: lee antes de tocar.
- La descripción de la tarea 2 en Classroom («of the other 8» → «of the other 7») **la corrige la coordinadora por la API**; no es de esta tarea.

## Cómo saber que ha terminado

- `npm test` sin fallos en tus ficheros.
- En local (`npm run servir`) con el código de prueba 60 (`7NPD`; nunca el de un alumno):
  - antes del cambio, deja hechos algunos puntos en los ejercicios 2 y 3 de la Fábrica, o simula en `localStorage` una lista `ej` de 3;
  - después, el menú tiene 2 ejercicios, «¿Cuántos divisores tiene?» lleva lo que llevaba el 2 y «Sin dividir» lo del 3;
  - la portada dice «n de 2»;
  - `semana.html?t=2` enseña 6 ★ (con «Árbol de factores» ej. 2) y 7 para elegir 4.
- A 375 px.

## Trampas conocidas

- La 70 copia `TAREAS` y los progresos al espacio de Juan Luis el día del paso. Con `adaptarProgreso` en la lectura, los progresos copiados con 3 posiciones se corrigen igual al abrirlos. La configuración de tareas copiada, no: ver el paso 6.
- Hay sesiones de Juan Luis fuera del reparto que tocan `practicas/`: no metas en tu commit nada que no sea tuyo.
- (76, 2026-10-17) `DESTREZAS` de `registro.js` está atada por test (`practicas-registro.test.js`) al §7 de `docs/practicas-unidad2.md`: quitar una destreza obliga a tocar también esa tabla, que no estaba en «Ficheros que toca». Tenía el candado de la sesión de la 69 (cerrada): se esperó a que caducara (30 min) y se comiteó aparte.
- (76) Los tests `practicas-semana` cuentan los ejercicios de las tareas (56 en total, «6 ★ + 4 de 8», un código de tarea con 8 de elegir): al cambiar una tarea hay que tocar esas líneas además de las de `fabrica`.
- (76) Sin documento en la nube, la base no reescribía lo del navegador: `cargarProgreso` guarda ahora si adaptó. Y Chrome sirve el `practica.js` viejo de caché: recarga con cmd+shift+r antes de mirar. La ventana de Chrome no baja de ~1358 px: los 375 px se prueban en un iframe.
- (76) `fallos/` no se puede leer por REST sin la cuenta del profesor: el recuento se hace con los documentos de progreso (sí legibles con `get`) y el panel.

## Prohibido (propio de esta tarea)

- Escribir o borrar en la nube sin el visto bueno de Juan Luis (fallos, progresos).
- Cambiar la numeración de otra práctica o el orden de los ejercicios que quedan.
- Tocar `profesor.js` mientras la 70 tenga cambios sin commit en él.

## Salida esperada

- Los ficheros de «Ficheros que toca» comiteados, con `npm test` sin fallos en tus ficheros.
- `reparto-practicas-u2/salidas/76-fabrica-sin-ej1/ENTREGA.md` (hash, ficheros, cómo se adapta el progreso guardado y dónde, el recuento de fallos de la Fábrica por ejercicio, y si el paso 6 aplica) y su marcador `ENTREGA.md.ok-<sid>`.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 76, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-76.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/76--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/76--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/76-fabrica-sin-ej1/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/76--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/76--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni
  `practicas/_comun/` (salvo la tarea 01), ni `css/estilos.css`, ni `README.md` (salvo
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
- Las reglas de contenido de `proyecto.md`: «factor» por «divisor», HCF en vez de GCD, `×`
  en vez de `·`, letras o ecuaciones, «primos entre sí», distractores que puedan ser
  verdad, excluir el 0 de los múltiplos, preguntar «múltiplo de 0».
