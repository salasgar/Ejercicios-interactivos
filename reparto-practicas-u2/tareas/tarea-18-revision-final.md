# Tarea 18 · Revisión final: regla de oro a mano en las dieciséis prácticas, portada, README y lista de comprobación en el móvil

Actualizado: 2026-10-07
Precondición: 02 a 17 LISTAS (si la 17 no está LISTA y Juan Luis lo decide, puede cerrarse sin ella y se anota); firma de la tarea 18 en autorizaciones.md · Disparo: MANUAL (sesión atendida)
Duración esperada: 1 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/18-revision-final/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/catalogo.js` (solo el campo `disponible`), `practicas/index.html`, `practicas/portada.js`, `README.md` (apartado de prácticas), `docs/practicas-unidad2.md` (nuevo)

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
   printf 'sesión: %s\ntarea: 18\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/18--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/18--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 18 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/18--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

Verificar el conjunto como lo verá un alumno y como lo corregirá el profesor, antes de
darlo por entregado: que ninguna opción falsa pueda ser verdad (regla de oro, que los
tests no pueden comprobar en el significado), que el vocabulario cumple las reglas de la
unidad, que todo cabe en el móvil, y que la portada y el README cuentan lo que hay. Es
ALTO porque juzga significado y porque es la última mirada antes de que lo usen los
alumnos.

## Siguiente paso

`ls practicas/` y compáralo con el catálogo; lee las dieciséis `ENTREGA.md` de
`reparto-practicas-u2/salidas/` y las terminadas: ahí están las propuestas pendientes
(cambios del contrato, `disponible: true`) que esta tarea resuelve.

## Qué hay que hacer

1. **Regla de oro a mano**, práctica por práctica. Con `npm run servir`, haz al menos 15
   ítems de cada ejercicio que tenga opciones (elegir, Sí/No, V/F, nombres) y para cada
   ítem pregúntate si alguna opción dada por falsa podría defenderse. Anota cada hallazgo
   con práctica, ejercicio y el ítem concreto. Lee además los bancos de plantillas de
   `clasificador`, `errores`, `imposibles` y `leelo` enteros, en los dos idiomas.
2. **Reglas de contenido** de `proyecto.md`: `grep -rn` en `practicas/` de `×`, `HCF`
   (fuera de las equivalencias aceptadas), `factor of` como relación, «primos entre sí»,
   «coprime», `divisible between` fuera de la plantilla de error, letras como incógnita.
   Comprueba que todo texto visible existe en `es` y en `en`.
3. **Móvil**: ventana de 375 × 667 en el navegador, cada práctica, cada ejercicio, español
   e inglés: nada se sale, todo se toca con el pulgar, el feedback se lee sin hacer zoom.
   Y una pasada en 1024 px.
4. **Portada y catálogo**: `disponible: true` en las prácticas que existen (o quitar el
   campo si la 01 optó por comprobar con `fetch`); orden de la portada por semana de la
   unidad (semana 1: semaforo, rectangulos, recta; semana 2: criba, arbol, divisiones,
   fabrica, factorizaciones; semana 3: venn, imposibles; semana 4: clasificador, reloj,
   baldosas, errores; transversal: leelo, divisores), con una línea por práctica que diga
   qué se practica; enlace al panel del profesor discreto al pie.
5. **README**: el apartado «Prácticas de la unidad 2» con la tabla de las dieciséis (slug,
   nombre, destrezas principales) y el enlace a `docs/practicas-unidad2.md`.
6. **`docs/practicas-unidad2.md`** (nuevo): el contrato de la base tal como quedó (copiado
   de `plantilla/practica.js` y de la terminada de la 01), cómo se añade una práctica, cómo
   lee el profesor los resultados, y qué práctica cubre qué destrezas del inventario (tabla
   id de destreza → práctica/ejercicio). Es el documento que la coordinación de la unidad
   (`docs/coordinacion-unidad1.md`, mismo espíritu) necesita.
7. **Corrige solo lo tuyo**: los hallazgos de 1 a 3 **no se corrigen aquí** (las carpetas
   de las prácticas son de sus tareas): van al veredicto, y para cada uno escribes
   `hechos/reabiertas/NN--<sid>.md` con lo exacto que hay que corregir y lo que no hay que
   rehacer, y la tarea vuelve a ser cogible. Si un hallazgo es menor y de texto (una
   errata), también va a la reabierta: una palabra puede ser la que decide la respuesta.

## Datos de entrada

- Todo `practicas/` y `divisores/` (solo lectura salvo lo declarado arriba).
- `reparto-practicas-u2/salidas/*/ENTREGA.md` y `hechos/terminadas/*`.
- `inventario-unidad2.tsv` (carpeta de apuntes, solo lectura) para la tabla de destrezas.

## Salida esperada

Dos salidas separadas, las dos en `reparto-practicas-u2/salidas/18-revision-final/`:

- `VEREDICTO.md` + `.ok-<sid>`: por práctica, SE ENTREGA / NO SE ENTREGA contra los
  criterios 1-3, con la lista de hallazgos y la reabierta que los recoge.
- `HALLAZGOS-FUERA-DE-CRITERIO.md` + `.ok-<sid>`: todo lo que observes y no estaba
  previsto (dos prácticas que se solapan, un ejercicio demasiado largo, una idea de
  feedback mejor, algo que «funciona» pero no debería), **dicho también al usuario en el
  mensaje de cierre como decisiones pendientes**, no enterrado en el fichero.
- El código: `catalogo.js` (`disponible`), portada, README, `docs/practicas-unidad2.md`.
- `ENTREGA.md` + `.ok-<sid>`.

## Cómo saber que ha terminado

- Las dieciséis prácticas tienen veredicto; cada NO SE ENTREGA tiene su `reabiertas/`.
- `npm test` en verde; la portada muestra todas las prácticas existentes y ninguna rota.
- `git push` hecho (firma de la 18 en `autorizaciones.md` comprobada antes).

## Trampas conocidas

- Es tentador corregir una errata en `practicas/<slug>/textos.js` de paso: no lo hagas,
  ese fichero tiene dueña; reabre.

## Prohibido (propio de esta tarea)

- Editar cualquier fichero de `practicas/<slug>/` o de `divisores/`.
- Dar SE ENTREGA con un hallazgo de regla de oro sin reabierta.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 18, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-18.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/18--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/18--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/18-revision-final/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/18--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/18--<sid>.md` con hasta dónde llegaste, la línea
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

- En «Al terminar», paso 1, el test propio de esta tarea no es `tests/practicas-<slug>.test.js`: en la 17 es `tests/divisores.test.js`; la 18 no tiene test propio y corre `npm test` entero.
