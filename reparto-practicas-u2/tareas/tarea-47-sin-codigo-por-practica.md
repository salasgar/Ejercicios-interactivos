# Tarea 47 · Eliminar el código de resultado por práctica (y con él el tope de 32 prácticas del catálogo)

Actualizado: 2026-10-16
Precondición: 44 LISTA (lo está: 3ad179c) · Disparo: MANUAL (sesión atendida)
Duración esperada: 1 h (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: 48
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/47-sin-codigo-por-practica/` (solo `ENTREGA.md` y su marcador). Toma la titularidad de los ficheros de la 44 para este cambio.
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/codigos.js`, `practicas/_comun/base.js` (solo lo que quede de `cajaResultado`/`activarCopiar`), `practicas/_comun/catalogo.js`, `practicas/_comun/textos.js`, `practicas/profesor.js`, `practicas/profesor.html`, `practicas/resultados.js` (si lee códigos de 16), `practicas/semana.html` (la regla `.semana__pedir` que quedó sin uso), `README.md`, `docs/practicas-unidad2.md`, `tests/practicas-comun.test.js` y el test de códigos

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
   printf 'sesión: %s\ntarea: 47\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/47--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/47--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 47 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/47--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

La tarea 44 (commit 3ad179c) quitó de la vista los códigos de resultado y los dejó en un
desplegable discreto. Diez minutos antes de que cerrara, Juan Luis decidió, a la pregunta
«¿son necesarios esos códigos?», que **el código de resultado por práctica (16 caracteres)
no lo es y se elimina**. El de la tarea de la semana (20 caracteres) sí se queda, en su
desplegable, como único respaldo si la nube no llega. Eliminar el de práctica libera el
tope del catálogo: hoy los 5 bits de práctica del código limitan a 32 prácticas (ids 0-31) y
están todos ocupados; sin ese código, las unidades 3 y siguientes pueden añadir prácticas.

## Siguiente paso

1. Lee la terminada de la 44 (`reparto-practicas-u2/hechos/terminadas/44--*.md`) y
   `git show --stat 3ad179c`; después `practicas/_comun/codigos.js` entero, `base.js` líneas
   440-480 (`cajaResultado`, `activarCopiar`), `catalogo.js` (dónde se afirma el tope de 32),
   `profesor.js` y `resultados.js` (dónde se leen códigos de 16 y de 12), y en
   `docs/practicas-unidad2.md` «El catálogo está lleno» y «Los tres códigos de resultado».
2. `grep -rn "codigoResultado\|leerCodigoResultado" practicas/ tests/ src/ divisores/` para
   tener la lista completa de usos antes de borrar nada.

## Qué hay que hacer

1. **Base:** `cajaResultado` desaparece de `base.js`; queda solo la frase «¡Has terminado los N
   ejercicios! Tu profesor ya puede verlo.» cuando están todos terminados. `activarCopiar` se
   mueve a `semana.js` o se deja en la base solo si `semana.js` la importa de ahí.
2. **Códigos:** borra `codigoResultado` (y su lector) de `codigos.js` con sus tests; deja
   `codigoAlumno`, `leerCodigoAlumno`, `codigoTarea` y su lector, y la lectura de los códigos
   antiguos de 12 de «divisores». Si el formato del código de la tarea comparte piezas con
   el borrado, consérvalas.
3. **Catálogo:** quita el tope de 32 ids (la constante y la comprobación del test común que lo
   afirme). Los `id` existentes no se renumeran ni se reordenan: los usa el progreso guardado
   (`practicas/<slug>--<código>` guarda por slug, pero el panel y `BLOQUES` usan ids).
4. **Panel:** `profesor.js`/`resultados.js` dejan de aceptar códigos de 16 al pegar (siguen los
   de 20 y los de 12); el texto de «Códigos de resultado» en `profesor.html` lo dice.
5. **Limpieza:** la regla `.semana__pedir` de `semana.html` que la 44 dejó sin uso.
6. **Documentación:** `README.md` y `docs/practicas-unidad2.md`: fuera «El catálogo está lleno»;
   «Los tres códigos de resultado» pasa a dos (tarea y divisores antiguo) con una línea de
   historia («el de práctica existió hasta el 2026-10-16»).
7. **Tests:** los de códigos sin `codigoResultado`; en `tests/practicas-comun.test.js`, en vez
   del tope de 32, comprueba que los ids del catálogo son enteros distintos ≥ 0.

## Datos de entrada

Solo lectura: la ficha y la terminada de la 44; `practicas/_comun/nube.js` (no se toca);
`reparto-practicas-u2/tareas/tarea-45-diseno-tareas-v2.md` (el formato del código de la
tarea puede cambiar después: aquí no se toca).

## Cómo saber que ha terminado

- `grep -rn "codigoResultado" practicas/ tests/ src/` no devuelve nada; `npm test` en verde.
- En el navegador (`npm run servir`): al terminar todos los ejercicios de una práctica sale
  la frase y ningún código ni desplegable; en `semana.html?t=1` sigue el desplegable del
  código de la tarea; en el panel, pegar un código de 20 funciona y uno de 16 se ignora con
  aviso. En los dos idiomas y a 375 px.

## Trampas conocidas

- `divisores/logica.js` exporta `leerCodigoResultado` (los de 12): es otro código y se queda.
- La terminada de la 44 avisa de un test ajeno en rojo (`practicas-semana.test.js`): la
  coordinadora lo arregló en el commit siguiente a 19074b5; si lo ves en rojo, trae `main`.

## Prohibido (propio de esta tarea)

- Tocar `codigoTarea`, `nube.js`, el contador, el progreso o cualquier práctica.
- Renumerar o reordenar ids del catálogo.
- Dejar en ningún idioma una frase que mande enviar algo por correo.

## Salida esperada

- Los ficheros de «Ficheros que toca» cambiados y comiteados; `ENTREGA.md` con hash, ficheros
  y cómo probarlo en 1 minuto, y su marcador `ENTREGA.md.ok-<sid>`.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 47, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-47.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/47--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/47--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/47-sin-codigo-por-practica/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/47--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/47--<sid>.md` con hasta dónde llegaste, la línea
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
