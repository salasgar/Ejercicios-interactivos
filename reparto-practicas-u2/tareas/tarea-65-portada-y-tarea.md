# Tarea 65 · Varios profesores, N5: portada y página de la tarea con código de 8: tareas del profesor desde la nube y asignaciones del espacio

Actualizado: 2026-10-17
Precondición: 64 LISTA (comparte `textos.js`) · Disparo: MANUAL (sesión atendida)
Duración esperada: 2 h (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/65-portada-y-tarea/` (`ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/portada.js`, `practicas/index.html`, `practicas/semana.js`, `practicas/semana.html`, `practicas/vista-tareas.js`, `practicas/_comun/textos.js`, `tests/practicas-semana.test.js`

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
   printf 'sesión: %s\ntarea: 65\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/65--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/65--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 65 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/65--<sid>.md`)
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
- Decisiones de Juan Luis posteriores al diseño (17-10): el centro ha dicho que **sí** se puede usar su proyecto de Firebase con alumnos de sus compañeros (G, resuelto); los compañeros empiezan el **lunes 14-12** (decidido por Juan Luis el 17-10, «en principio»: la 69 tiene que estar LISTA con «se entrega» antes); el día de enero de su migración, pendiente.
- Hay una sesión de Juan Luis fuera del reparto que el 17-10 por la tarde editaba `practicas/profesor.js`, `practicas/resultados.js` y su test: antes de tocar esos ficheros, `git status`; si hay cambios sin commit que no son tuyos, no los pises y avisa.

## Objetivo

Que el alumno con código de 8 vea en la portada y en la página de la tarea **las tareas de su profesor** (de `config/tareas` de su espacio, con copia en el navegador) y su asignación del espacio; con código de 4, lo de hoy (DISENO.md, D.7, F.2; lista H.2, N5).

## Siguiente paso

1. Lee DISENO.md entero; después `portada.js`, `semana.js`, `vista-tareas.js` (de la 52) y `espacio.js` (62), y lo que hizo la 64 en la base (su terminada).
2. Enlaces que no pueden cambiar: `semana.html?t=1&c=<código de 4>` y `semana.html?t=1` (repartidos a los alumnos de Juan Luis).

## Qué hay que hacer

1. Al entrar con un código de 8 (en la portada o con `?c=`), `resolverCodigo` y, con su `config`, la portada agrupa por unidades con las **fechas de ese profesor** (`unidadesCon`) y sus tareas (`tareasPublicadas(hoy, config.tareas, …)`); la página de la tarea busca `t` en las tareas del profesor y, si no existe, «Esta tarea no existe» en los dos idiomas.
2. La asignación del alumno, del espacio (`asignaciones/<código>`); con 4, la de hoy.
3. Sin red, la copia guardada; sin copia, un aviso claro y la portada con las prácticas (sin tareas).
4. **Tests** (`practicas-semana.test.js`, funciones sin DOM de `vista-tareas.js`): con una configuración de profesor inventada, qué tareas salen y en qué orden, plazos con sus fechas, y que con código de 4 sale lo de hoy.

## Cómo saber que ha terminado

- En local, con el profesor de prueba A: carga una configuración inventada (con el script de la 61 o a mano en la consola) y un código de 8; la portada y `semana.html?t=<id>&c=<código>` enseñan sus tareas y fechas. Con el código 60, lo de hoy. A 375 px y en los dos idiomas.
- `npm test` en verde.

## Trampas conocidas

- `portada.js` y `semana.js` comparten lógica en `vista-tareas.js` (52): pon ahí lo nuevo, que se prueba sin DOM.
- La tarea 1 de Juan Luis (`progresoPorPractica`) solo existe en el modo antiguo.

## Prohibido (propio de esta tarea)

- Cambiar los enlaces del modo antiguo o lo que enseñan.
- Tocar la base (`base.js`): si falta algo, se propone en la terminada.

## Salida esperada

- Los ficheros de «Ficheros que toca» cambiados y comiteados, con `npm test` en verde.
- `reparto-practicas-u2/salidas/65-portada-y-tarea/ENTREGA.md` (hash, ficheros, lo comprobado con su resultado literal, lo que queda para la tarea siguiente) y su marcador `ENTREGA.md.ok-<sid>`.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 65, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-65.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/65--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/65--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/65-portada-y-tarea/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/65--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/65--<sid>.md` con hasta dónde llegaste, la línea
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
