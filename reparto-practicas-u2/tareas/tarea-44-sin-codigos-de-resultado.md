# Tarea 44 · Quitar de la vista del alumno los códigos de resultado y la petición de enviarlos por correo (la nube ya lo cuenta)

Actualizado: 2026-10-16
Precondición: ninguna (38 LISTA: el progreso ya está en la nube) · Disparo: MANUAL (sesión atendida)
Duración esperada: 1 h (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/44-sin-codigos-de-resultado/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/base.js` (solo `cajaResultado`, `activarCopiar` y sus llamadas), `practicas/_comun/textos.js`, `practicas/semana.js`, `practicas/profesor.html` (texto de la sección «Códigos de resultado»), `docs/practicas-unidad2.md`, `README.md` (los párrafos de los códigos), `tests/practicas-comun.test.js` si algún test afirma los textos quitados

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
   printf 'sesión: %s\ntarea: 44\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/44--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/44--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 44 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/44--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

Hasta la tarea 38 el único camino de los resultados hasta el profesor era el **código de
resultado** (16 caracteres por práctica, 20 por tarea de la semana) que el alumno copiaba y
mandaba por correo. Desde la 38 el progreso de cada alumno está en Firestore
(`practicas/<slug>--<código>`) y el panel del profesor lo lee entero («Cargar la nube»), así
que Juan Luis decidió el 2026-10-16: **la app no da códigos de resultado a los alumnos ni
les pide que los envíen.** El correo que reciben con su código de alumno ya dice «No tienes
que mandarme nada: con tu código veo yo lo que llevas».

Lo que se conserva, decidido con él: `codigoResultado` y `codigoTarea` en `codigos.js`
(con sus tests) y la caja «Códigos de resultado» del panel donde se pegan, porque son la
red de seguridad si la nube falla (una red de aula que bloquee googleapis, por ejemplo). El
alumno solo verá el código si lo pide expresamente con un enlace discreto, y sin ninguna
frase que le mande enviarlo.

## Siguiente paso

1. Lee `practicas/_comun/base.js` líneas 440-480 (`cajaResultado`, `activarCopiar`) y las
   llamadas de las líneas 525 y 763; `practicas/_comun/textos.js` líneas 55-100 y 155-200
   (los textos `resultado_*`, `copiar`, `copiado`, `semana_cumplida*`, `semana_pedir`,
   `semana_parcial`, en los dos idiomas); `practicas/semana.js` líneas 120-200 (la caja del
   código de la tarea y su botón «Copiar»); `practicas/profesor.html` líneas 46-56.
2. `grep -n "resultado_\|semana_pedir\|semana_parcial\|semana_cumplida" tests/*.js` para ver
   qué afirman los tests.
3. `git status -sb`: si hay cambios sin comitear de otra sesión en esos ficheros, no los pises.

## Qué hay que hacer

1. **Fin de ejercicio y menú de una práctica** (`base.js`, `cajaResultado`): en lugar de la
   tarjeta con título «Tu código de resultado», el código grande y «Copiar», una línea
   discreta: cuando están todos los ejercicios terminados, «¡Has terminado los N ejercicios!
   Tu profesor ya puede verlo.» (texto nuevo `resultado_completo` sin la frase del código); si
   no, nada (quita `resultado_parcial`). Debajo, un `<details class="pequeno">` con
   `<summary>` «Código de resultado (solo si te lo pide tu profesor)» que al abrirse enseña
   el código y el botón «Copiar» de siempre. `activarCopiar` sigue sirviendo.
2. **Tarea de la semana** (`semana.js`): al cumplirla, «¡Tarea cumplida! Tu profesor ya puede
   verlo.» sin código; el mismo `<details>` discreto para el código de 20 caracteres. Quita
   el botón «Ver mi código (lo que llevo)» (`semana_pedir`) y el texto `semana_parcial`: el
   código parcial deja de existir para el alumno.
3. **Textos** (`textos.js`, ES y EN): `resultado_completo` → «¡Has terminado los N ejercicios!
   Tu profesor ya puede verlo.» / «You have finished the N exercises! Your teacher can
   already see it.»; `semana_cumplida_texto` → «Tu profesor ya puede verlo.» / «Your teacher
   can already see it.»; nuevo `resultado_desplegable` → «Código de resultado (solo si te lo
   pide tu profesor)» / «Result code (only if your teacher asks for it)». Borra
   `resultado_parcial`, `semana_pedir` y `semana_parcial` si ya no se usan en ningún sitio
   (grep antes).
4. **Panel** (`profesor.html`, sección «Códigos de resultado»): el párrafo pasa a decir que
   lo normal es «Cargar la nube» y que los códigos pegados son solo el respaldo para cuando
   la nube no llega (el alumno los tiene en un desplegable). Los textos de «Tareas de la
   semana» (línea 47) dejan de decir que el alumno «recibe un único código».
5. **Documentación**: `README.md` y `docs/practicas-unidad2.md`, los párrafos que describen el
   código como el camino de los resultados pasan a describirlo como respaldo. No reescribas
   la sección técnica «Los tres códigos de resultado»: sigue siendo cierta.
6. **Tests**: ajusta los que afirmen los textos quitados; añade uno en
   `tests/practicas-comun.test.js` que compruebe que los textos ES y EN no contienen
   «envíaselo», «send it to your teacher» ni «Copia este código» (para que no vuelvan).

## Datos de entrada

Solo lectura: `practicas/_comun/codigos.js` (no se toca), `practicas/profesor.js` (cómo carga la
nube: no se toca), la terminada de la 38 (`reparto-practicas-u2/hechos/terminadas/38--*.md`),
las «Reglas de contenido comunes» de `proyecto.md`.

## Cómo saber que ha terminado

- `npm test` en verde.
- En el navegador (`npm run servir`), con un código de alumno de prueba: termina un ejercicio
  de una práctica → aparece «¡Ejercicio terminado!» y, si están todos, la frase nueva; ningún
  código a la vista; el desplegable lo enseña y «Copiar» funciona. En
  `practicas/semana.html?t=1` con la tarea cumplida (o fuerza el estado) → «¡Tarea cumplida!
  Tu profesor ya puede verlo.», sin código ni botón «Ver mi código». En los dos idiomas y en
  375 px.
- `grep -rn "envíaselo\|send it to your teacher\|Copia este código" practicas/` no devuelve nada.

## Trampas conocidas

- `cajaResultado` devuelve '' cuando se viene de una tarea de la semana (`semana !== null`):
  mantenlo, la tarea tiene su propia caja en `semana.js`.
- `activarCopiar` busca `#copiar` y `#codigo-resultado`: dentro de un `<details>` siguen
  existiendo en el DOM aunque esté cerrado; no hace falta cambiarlo.
- El texto `semana_cumplida` («¡Tarea cumplida!») lo usa también el marcador: comprueba con
  grep antes de tocarlo.

## Prohibido (propio de esta tarea)

- Borrar `codigoResultado`, `codigoTarea`, sus tests o la caja de pegar códigos del panel.
- Tocar la lógica de guardado, la nube (`nube.js`), el contador o cualquier práctica.
- Dejar en cualquier idioma una frase que mande al alumno enviar algo por correo.

## Salida esperada

- Los ficheros de «Ficheros que toca» cambiados y comiteados.
- `reparto-practicas-u2/salidas/44-sin-codigos-de-resultado/ENTREGA.md` (hash, ficheros,
  capturas o descripción de las tres pantallas, cómo probarlo en 1 minuto) y su marcador
  `ENTREGA.md.ok-<sid>`.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 44, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-44.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/44--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/44--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/44-sin-codigos-de-resultado/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/44--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/44--<sid>.md` con hasta dónde llegaste, la línea
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
