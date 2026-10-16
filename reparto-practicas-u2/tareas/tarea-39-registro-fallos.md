# Tarea 39 · Registro de cada fallo (qué ítem, qué respondió, qué error) y su vista en el panel

Actualizado: 2026-10-15
Precondición: 38 LISTA (toca los mismos ficheros: `base.js`, el panel y `firestore.rules`); ninguna sesión fuera del reparto con cambios sin comitear en `practicas/_comun/` o `practicas/profesor.*` (`git status`) · Disparo: MANUAL (sesión atendida: Juan Luis tiene que publicar las reglas de Firestore y decidir el diseño de la colección nueva)
Sin plazo fijo, pero cuanto antes esté publicada, más fallos de la primera tarea semanal (19-22 de octubre) quedan registrados: lo anterior a la publicación no se recupera.
Duración esperada: 2 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: 38 (va justo después)
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/39-registro-fallos/` (solo `ENTREGA.md` y su marcador)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/{base.js,textos.js}`, `practicas/_comun/registro.js` (nuevo), `practicas/plantilla/practica.js` (solo comentarios del contrato), `practicas/profesor.html`, `practicas/profesor.js`, `practicas/resultados.js`, `firestore.rules` (un bloque nuevo `match` para la colección del registro, y nada más), `tests/practicas-comun.test.js`, `tests/practicas-registro.test.js` (nuevo), `docs/practicas-unidad2.md`, `README.md` (apartado de prácticas).

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
   printf 'sesión: %s\ntarea: 39\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/39--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/39--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 39 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/39--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Hoy la nube guarda solo recuentos por ejercicio (puntos, aciertos, fallos, reinicios). Juan
Luis quiere saber **en qué preguntas concretas fallan sus alumnos y con qué error**, para
cruzarlo con las destrezas del inventario de la unidad (lo que hacen las tareas «tras el
examen» del reparto de la unidad 2: resultados por destreza, refuerzo y registro de cada
alumno). Esta tarea registra cada fallo y le da una vista en el panel. No cambia nada de lo
que ve o hace el alumno.

## Siguiente paso

Lee la terminada de la 38, `docs/practicas-unidad2.md` (§2 a §4 y §7, la tabla de qué práctica
cubre qué destreza), `practicas/plantilla/practica.js` (el contrato de `api.responder`) y
`practicas/_comun/base.js` (dónde se llama a `responder`, qué tiene a mano del ítem: lo que
devolvió `generar`, el idioma, el ejercicio). Mira dos o tres prácticas para ver qué clase de
objeto devuelve `generar` y qué `html` mandan al fallar.

## Qué hay que hacer

1. **Qué se registra de cada fallo**, desde la base y sin tocar ninguna práctica: código de
   alumno, práctica, ejercicio, día y hora, idioma del ítem, el ítem (lo que devolvió `generar`,
   serializado y recortado a un tamaño fijo), lo que contestó el alumno si la base lo sabe, y el
   texto del feedback sin HTML (que ya dice qué ha pasado con esos números). Los aciertos no se
   registran uno a uno (ya están los recuentos).
2. **Contrato, ampliación compatible**: `api.responder` admite un campo opcional `error`
   (identificador corto del tipo de error, p. ej. `'confunde-mcd-mcm'`) y uno opcional
   `respuesta` (lo que contestó, en texto corto). Las prácticas que no lo pasan siguen igual. Se
   documenta en `plantilla/practica.js` y en `docs`. **No se cambia ninguna práctica para usarlo**:
   la terminada propone qué prácticas deberían adoptarlo primero y con qué identificadores
   (tareas MEDIO aparte, una por práctica).
3. **Dónde se guarda: propuesta a Juan Luis antes de escribir las reglas.** Opciones razonables:
   (a) un documento por fallo en una colección nueva (`fallos/{auto}`, solo `create` para el
   alumno, campos y tamaños fijados en la regla, lectura solo del profesor); (b) un documento por
   alumno y práctica con una lista de los últimos N fallos. Calcula para cada una el volumen
   (51 alumnos, del orden de cientos de fallos por semana) frente a las cuotas gratuitas de
   Firestore (lecturas, escrituras y almacenamiento por día) y lo que cuesta al panel leerlo.
   Recomienda una, explícasela en dos líneas y **espera su decisión**; mientras, escribe lo que no
   dependa de ella (la captura en la base, la función pura que agrega, los tests).
4. **Reglas**: el bloque nuevo en `firestore.rules`, con la validación de campos y tamaños.
   **Las publica Juan Luis** (consola de Firebase → Firestore → Reglas → pegar el fichero entero →
   Publicar): para y pídeselo con el bloque exacto. Si la escritura falla (sin red, reglas sin
   publicar), el alumno no nota nada.
5. **Panel**: vista «Fallos» con filtros por tarea semanal, práctica, ejercicio y alumno: los
   fallos más repetidos (agrupados por `error` cuando lo haya y, si no, por ejercicio), cada uno
   con ejemplos reales (el ítem y el feedback), y por alumno qué ejercicios le cuestan. Con CSV
   que lleve la práctica, el ejercicio y, cuando se pueda, la destreza (de la tabla de §7 de
   `docs/practicas-unidad2.md`; si una práctica cubre varias destrezas y no se sabe cuál, se deja
   la de la práctica).

## Datos de entrada

- La terminada de la 38 y `docs/practicas-unidad2.md`.
- El inventario de destrezas de la unidad 2 (solo lectura, carpeta de apuntes):
  `…/apuntes-1eso-bilingue/2. Divisibility/inventario-unidad2.tsv`.

## Salida esperada

- El código, con `tests/practicas-registro.test.js` (qué se captura de un fallo; recorte de
  tamaños; agregado del panel con casos hechos a mano; una práctica sin `error` sigue funcionando).
- La regla nueva **publicada por Juan Luis** y la opción de almacenamiento que eligió, en la terminada.
- `ENTREGA.md` + `.ok-<sid>`: cómo provocar tres fallos con el código de prueba y verlos en el panel.
- En la terminada: la lista propuesta de prácticas que deberían pasar `error`, con sus identificadores.

## Cómo saber que ha terminado

- `npm test` en verde; las 31 prácticas siguen arrancando y el alumno no nota ningún cambio.
- Probado con las reglas publicadas: tres fallos con el código de prueba en dos prácticas
  distintas aparecen en la vista «Fallos» con su ítem y su feedback, y en el CSV.
- `git push` hecho y la página publicada.

## Trampas conocidas

- El código de prueba deja datos en la nube: usa uno alto de la lista (los alumnos reales ocupan
  del 1 al 51) y dilo en la terminada, para que el panel o Juan Luis puedan descartarlo.
- El `html` del feedback lleva fórmulas y etiquetas: guarda texto plano recortado, no HTML.
- La escritura va al responder, no al salir: no puede retrasar el paso al ítem siguiente.
- iCloud evacúa ficheros de este árbol (`ls -lO` → `dataless`) y deja copias en conflicto
  dentro de `.git/`; nunca `git stash` ni `--autostash` (`proyecto.md`, «Repositorio git»).
- (Aprendido en la sesión s-20261016T050222-d0960de2.) El panel publicado guarda los módulos
  en caché: tras subir un cambio de `profesor.js`, recargar la página no basta; hay que
  pedirlo con `fetch('profesor.js', { cache: 'reload' })` (o recarga forzada) antes de probar.
- Con la lista de nombres escrita, el código de prueba no sale en «Fallos» salvo que se elija
  a mano en «Alumno» (así se diseñó; antes de 90be2b0 no salía ni eligiéndolo).
- Saber si las reglas nuevas están publicadas sin preguntar: crear por REST un fallo válido
  con id fijo (`fallos/KTFN-zzzzzz-prue`, t = 1, no sale en el panel): 403 antes, 200 después.
- Hay un `stash@{0}: autostash` antiguo y un reclamo ajeno sin comitear
  (`hechos/reclamos/23--s-20261007T214947-e0ab035d.md`): no son tuyos, no los toques.

## Prohibido (propio de esta tarea)

- Nota: «Ficheros que toca», arriba, manda sobre «Prohibido (común)», abajo. Esta tarea sí toca
  `practicas/_comun/`, el panel, `README.md` y `firestore.rules`, pero solo lo que declara.
- Editar cualquier fichero de `practicas/<slug>/` (salvo `plantilla/`, solo comentarios) o de `divisores/`.
- Cambiar lo que ve el alumno, el contador o el formato de los códigos.
- Elegir tú el almacenamiento sin que Juan Luis lo decida, o publicar tú las reglas.
- Guardar nombres de alumnos en la nube: solo el código.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 39, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-39.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/39--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/39--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/39-registro-fallos/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/39--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/39--<sid>.md` con hasta dónde llegaste, la línea
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

- En «Al terminar», los pasos 1 y 2 no son los de una práctica: en la 39 los tests propios son `tests/practicas-comun.test.js` y `tests/practicas-semana.test.js`, y lo que se prueba en el navegador es `practicas/semana.html` y un par de prácticas.

