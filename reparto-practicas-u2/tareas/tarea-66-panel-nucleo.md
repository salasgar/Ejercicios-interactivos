# Tarea 66 · Varios profesores, N6: panel, núcleo: entrar y alta, «Profesores», «Mis alumnos» con códigos y nombres cifrados, caché y lectura de solo lo nuevo

Actualizado: 2026-10-17
Precondición: 63 LISTA · Disparo: MANUAL (sesión atendida)
Duración esperada: 2 h 30 min (real: ~28 min el 17-10; tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/66-panel-nucleo/` (`ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/profesor.js`, `practicas/profesor.html`, `practicas/resultados.js`, `practicas/_comun/cifrado.js` (nuevo), `practicas/profesor-tareas.js` y `practicas/profesor-hoy.js` (nuevos, **solo como esqueleto**: ver punto 6), `tests/practicas-resultados.test.js`, `tests/practicas-cifrado.test.js` (nuevo)

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
   printf 'sesión: %s\ntarea: 66\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/66--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/66--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 66 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/66--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Lo común a las tareas 61-71 (varios profesores)

- **La especificación es `reparto-practicas-u2/salidas/57-diseno-varios-profesores/DISENO.md`**, aprobado entero por Juan Luis el 2026-10-17. Léelo entero antes de empezar (no solo tu apartado). Lo que esté mal pensado se propone en la terminada; no se cambia por tu cuenta.
- **El modo antiguo no se rompe nunca**: hasta la migración de Juan Luis (vuelta de Navidad) sus 51 alumnos siguen con códigos de 4 caracteres, `tareas.js` y las colecciones `practicas`, `practicas-tareas`, `practicas-asignaciones` y `fallos`. Cada tarea lo comprueba con un test (la longitud del código decide el modo: 4, antiguo; 8, nuevo).
- **Nada de datos reales en el repositorio**: ni nombres, ni códigos de alumnos, ni uids de compañeros, ni contraseñas. Las cuentas de prueba y sus contraseñas, por variables de entorno.
- **Código de prueba del modo antiguo**: 60 (`7NPD`), 61-63. Nunca el de un alumno.
- Decisiones de Juan Luis posteriores al diseño (17-10): el centro ha dicho que **sí** se puede usar su proyecto de Firebase con alumnos de sus compañeros (G, resuelto); los compañeros empiezan el **lunes 14-12** (la 69 tiene que estar LISTA con «se entrega» antes); **cambio de los códigos (17-10, tarde): este curso los alumnos de Juan Luis se quedan con sus códigos de 4 de siempre; desde el curso 2027-28 sus alumnos nuevos tendrán códigos de 4 al azar, y los de los compañeros, de 8 (tarea 72)**. Qué se hace el 1 de enero de 2027 (fecha que había fijado para pasarse al sistema nuevo) queda pendiente de él tras ese cambio: la 70 no se lanza sin esa decisión.
- Hay una sesión de Juan Luis fuera del reparto que el 17-10 por la tarde editaba `practicas/profesor.js`, `practicas/resultados.js` y su test: antes de tocar esos ficheros, `git status`; si hay cambios sin commit que no son tuyos, no los pises y avisa.

## Objetivo

El panel para varios profesores (DISENO.md, A.2, F.1; lista H.2, N6). Con la cuenta de Juan Luis, el panel de hoy (modo antiguo) **sigue entero** hasta su migración, y además ve «Profesores» y su espacio nuevo vacío; con la de un compañero dado de alta, solo su espacio.

## Siguiente paso

1. Lee DISENO.md entero (sobre todo A y F.1); después `profesor.js`, `profesor.html`, `resultados.js` y las funciones de la 63 en `src/firebase.js`.
2. `git status`: si hay cambios sin commit en `profesor.js` o `resultados.js` (otra sesión de Juan Luis los editaba el 17-10), no empieces hasta que estén comiteados.

## Qué hay que hacer

1. **Entrar**: con Google; según `estadoProfesor()`: sin alta, la pantalla «Aún no tienes acceso. Juan Luis tiene que darte de alta» con `pedirAlta()`; de baja, «Tu acceso está desactivado»; activo o administrador, el panel.
2. **Dos modos en el panel de Juan Luis**: un selector «Sistema actual (códigos de 4) / Sistema nuevo (mi espacio)». El actual es el panel de hoy, sin cambios. Los compañeros solo tienen el nuevo.
3. **«Profesores»** (solo el administrador): solicitudes con «Dar de alta» y lista con «Dar de baja» / «Volver a dar de alta».
4. **«Mis alumnos»**: pegar la lista (un nombre por línea, como hoy); «Generar códigos» para las líneas sin código (`codigoSecreto` de la 62, `crearCodigos` de la 63; si choca, otro); CSV (número, nombre, código, enlace) y tarjetas para imprimir (nombre, código, enlace corto; sin QR). **Nombres cifrados** en `cifrado.js`: PBKDF2-SHA-256 con 600 000 vueltas y sal al azar → clave AES-GCM de 256 bits; iv al azar por cifrado; contraseña de al menos 10 caracteres; al entrar en otro ordenador, la pide y descifra; si la olvida, vuelve a pegar la lista y pone otra (los códigos siguen por número de línea). La lista descifrada se guarda en el navegador como hoy.
5. **Caché y solo lo nuevo**: IndexedDB (un almacén por espacio y colección); al abrir, `leerDesde(que, último actualizado)`; un botón «Volver a leer todo». Las vistas de hoy (Tareas de la semana, Retrasos, Asignar tareas, Qué falla más, CSV) sobre los datos del espacio y las tareas del profesor (`config.tareas`).
6. **Esqueleto para la 67 y la 68**: dos secciones vacías en `profesor.html` («Tareas» y «Hoy») y dos módulos `profesor-tareas.js` y `profesor-hoy.js` que exportan `montar(contenedor, contexto)` sin hacer nada, ya importados y llamados desde `profesor.js`. Así la 67 y la 68 solo tocan su módulo y pueden ir a la vez. Documenta `contexto` (uid, config, alumnos, funciones de la 63) en un comentario.
7. **Tests**: `cifrado.js` (cifrar y descifrar; contraseña mala falla; sal e iv distintos cada vez) y lo que toques de `resultados.js`.

## Cómo saber que ha terminado

- Con el profesor de prueba A en una ventana y el B en otra: cada uno ve solo lo suyo; A genera tres códigos, pone contraseña, abre el panel en otra ventana privada y recupera nombres y códigos con la contraseña. Con la cuenta de Juan Luis (pídele que lo mire él si no puedes entrar con ella): el panel de hoy, igual; «Profesores» con las solicitudes de prueba.
- `npm test` en verde.

## Trampas conocidas

- No uses `localStorage` para la caché de resultados (no cabe con 100 alumnos): IndexedDB.
- Web Crypto (`crypto.subtle`) solo funciona en contexto seguro: GitHub Pages y `localhost` lo son; `127.0.0.1` también.
- Las tarjetas se imprimen con `window.print()` y CSS de impresión; no añadas bibliotecas.
- (s-20261017T170731-ac14a523) `display: flex` de `.botonera` o de una barra anula el atributo `hidden`: hace falta `.profesor [hidden] { display: none !important; }` (está en el `<style>` de `profesor.html`).
- (s-20261017T170731-ac14a523) El código de resultado de 20 de un alumno de 8 lleva `n` (desde 1; lo decidió la 65 en `vista-tareas.js`); el del modo antiguo, la posición (desde 0). El panel usa `leerCodigoTareaEspacio` (`resultados.js`), que resta 1.
- (s-20261017T170731-ac14a523) Para probar sin cuentas: servidor en el scratchpad que sirve el repositorio y cambia `/src/firebase.js` por uno falso que usa la `crearAccesoPanel` real sobre un Firestore en memoria en el servidor; `localhost`, `127.0.0.1` y `[::1]` hacen de tres ordenadores (cada uno con su almacén y su IndexedDB, y los tres son contexto seguro). Para comparar el modo antiguo, `git show HEAD:practicas/profesor.*` servido al lado. La herramienta de JavaScript de Chrome bloquea las salidas con `?c=…`: tapar los enlaces antes de devolverlos.
- (s-20261017T170731-ac14a523) En zsh, `F="a b c"; git add $F` no parte en palabras: rutas escritas una a una.

## Prohibido (propio de esta tarea)

- Cambiar el panel de hoy (modo antiguo) más allá de envolverlo en el selector.
- Rellenar el editor de tareas o «Hoy» (son de la 67 y la 68).

## Salida esperada

- Los ficheros de «Ficheros que toca» cambiados y comiteados, con `npm test` en verde.
- `reparto-practicas-u2/salidas/66-panel-nucleo/ENTREGA.md` (hash, ficheros, lo comprobado con su resultado literal, lo que queda para la tarea siguiente) y su marcador `ENTREGA.md.ok-<sid>`.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 66, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-66.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/66--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/66--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/66-panel-nucleo/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/66--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/66--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni
  `practicas/_comun/` (salvo la tarea 01 y, en esta, lo declarado en «Ficheros que toca»), ni `css/estilos.css`, ni `README.md` (salvo
  01, 18 y lo declarado arriba), ni `firestore.rules` ni `src/firebase.js` (salvo 01 y lo declarado arriba), ni fichas ajenas, ni
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
