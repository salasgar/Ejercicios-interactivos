# Tarea 38 · Progreso en la nube compartido entre aparatos, y puntos y «qué falla más» en el panel

Actualizado: 2026-10-15
Precondición: 37 LISTA (lo está desde el 2026-10-15 20:18Z); ninguna sesión fuera del reparto con cambios sin comitear en `practicas/_comun/`, `practicas/semana.*` o `practicas/profesor.*` (`git status`) · Disparo: MANUAL (sesión atendida: Juan Luis tiene que publicar las reglas de Firestore a mano en la consola)
**Plazo: antes del lunes 19-10-2026 a las 8:00 peninsular** (06:00Z). A esa hora salen los 51 correos con el código de cada alumno, y una frase del correo depende de esta tarea.
Duración esperada: 2 h (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: 39 (misma banda; va justo después y toca los mismos ficheros)
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/38-progreso-nube/` (solo `ENTREGA.md` y su marcador)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/{base.js,textos.js}`, `practicas/_comun/nube.js` (nuevo, si conviene sacar ahí la lectura y la fusión), `practicas/semana.js`, `practicas/profesor.html`, `practicas/profesor.js`, `practicas/resultados.js`, `firestore.rules` (solo el bloque `match /practicas/{doc}`), `tests/practicas-comun.test.js`, `tests/practicas-nube.test.js` (nuevo), `docs/practicas-unidad2.md`, `README.md` (apartado de prácticas).

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
   printf 'sesión: %s\ntarea: 38\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/38--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/38--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 38 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/38--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Hoy el progreso de cada práctica vive en el navegador del alumno y se **copia** en Firestore
(`practicas/{slug}--{código}`), pero esa copia solo la lee el profesor. Consecuencias, dichas
a Juan Luis el 2026-10-15:

1. Un alumno que empieza en el móvil y sigue en el ordenador **empieza de cero**.
2. Peor: el ordenador **sobrescribe** en la nube lo que subió el móvil, y el panel del
   profesor ve solo lo del último aparato. La nota de la tarea semanal sale de ahí.

Juan Luis quiere que el alumno pueda entrar con su código desde cualquier aparato y seguir
donde lo dejó. Además quiere ver en el panel **cuántos puntos lleva cada alumno** y **en qué
ejercicios falla más la clase**.

`salasgar.github.io` es GitHub Pages (estático): no guarda nada. La nube es Firestore, que ya
existe; lo que falta es que el alumno pueda **leer su propio documento** y que la app lo
fusione con lo que hay en el navegador antes de subir nada.

## Siguiente paso

Lee `docs/practicas-unidad2.md` (§1 a §4, y lo que la 37 añadió en §2 sobre la tarea de la
semana), `practicas/_comun/base.js` (sobre todo `cargarProgreso`, `guardar`, `subir` y
`documentoNube`), `practicas/_comun/contador.js` (`ejercicioNuevo`, `migrarProgreso`),
`practicas/semana.js` (de dónde lee el progreso de cada práctica), `practicas/profesor.js` y
`practicas/resultados.js` (`juntarResultados`), y el bloque `match /practicas/{doc}` de
`firestore.rules`. Y la terminada de la 37: `hechos/terminadas/37--s-20261015T173031-efad3f35.md`.

## Qué hay que hacer

### A. Leer y fusionar el progreso de la nube

1. **Reglas** (`firestore.rules`, bloque `match /practicas/{doc}`): añadir `allow get` con la
   misma condición de nombre de documento que ya tiene la escritura (`slug--CÓDIGO`). **Solo
   `get`, nunca `list`**: listar la colección sigue siendo solo del profesor. Nada más del
   fichero cambia. En el documento solo hay números (puntos, aciertos, fallos), sin nombres:
   leerlo conociendo el código no expone nada personal (escribirlo conociendo el código ya
   era posible).
2. **Publicar las reglas: lo hace Juan Luis.** En cuanto el bloque esté escrito y comiteado,
   **para y pídeselo**, con el bloque exacto para pegar y los pasos (consola de Firebase →
   Firestore → Reglas → pegar el fichero `firestore.rules` entero → Publicar). Mientras tanto
   sigue con lo que no dependa de la nube real (fusión, tests, panel). No des la tarea por
   terminada sin comprobar en el navegador que la lectura funciona con las reglas publicadas.
3. **Fusión** (función pura, con sus tests): por ejercicio, se queda con «lo más avanzado» de
   lo local y lo de la nube. Terminado gana a no terminado; entre dos sin terminar, más puntos;
   `fallos`, `aciertos`, `reinicios` y `repeticiones`, el máximo; `dia`, el del que gana. Tiene
   que ser **idempotente y conmutativa** (fusionar A con B = B con A; fusionar dos veces = una) y
   **no bajar nunca nada que estuviera terminado**. Ojo con `migrarProgreso` (estados antiguos)
   y con el tope de puntos de un ejercicio sin terminar (`objetivo − 1`).
4. **Al entrar con código** (base y página de la semana): antes de la primera subida de la
   sesión, `GET` del documento de cada práctica que se vaya a mostrar, fusión, guardar en el
   navegador y, si la fusión cambió algo respecto de la nube, subir. **No se sube nada antes de
   haber intentado leer**: eso es lo que hoy machaca el progreso de otro aparato. Sin red, o si
   el documento no existe (404), se sigue con lo local, sin bloquear al alumno y sin mensajes
   alarmantes. La página de la semana lee los documentos de todas las prácticas de la tarea (en
   paralelo; son unas 10-14 peticiones).
5. **Textos**: donde hoy se avisa de que el progreso queda en el navegador, decir que se puede
   seguir desde cualquier aparato entrando con el mismo código. Español e inglés.

### B. El panel del profesor

6. **Puntos de la tarea semanal**: en la vista «Tareas de la semana», los puntos de cada alumno
   (sobre 100), calculados igual que el marcador del alumno (la regla está en la terminada de
   la 37: 10 por ejercicio terminado, la parte proporcional a medias, de los de elegir cuentan
   los `nElegir` mejores). Columna también en el CSV. Una sola función para el marcador y el
   panel, no dos copias.
7. **«Qué falla más»**: una vista (o un bloque bajo cada tarea y bajo cada práctica) con una fila
   por ejercicio: cuántos alumnos lo han empezado, cuántos lo han terminado, fallos totales,
   fallos por alumno que lo empezó, y reinicios (veces que se quedaron sin vidas). Ordenable o
   ya ordenada por fallos por alumno. Con CSV. Sale de lo que el panel ya junta (nube y códigos).

## Datos de entrada

- `docs/practicas-unidad2.md`, la terminada de la 37 y `hechos/notas/s-20261008T173817-contador-contador-por-puntos.md`.
- El correo a los alumnos (fuera del repositorio; no lo toques):
  `…/apuntes-1eso-bilingue/Curso 2026-2027/codigos-app/borradores_codigos.py`. Dice hoy «Hazlo
  siempre desde el mismo móvil u ordenador: lo que llevas se guarda en ese aparato, y si cambias
  de aparato empiezas de cero». Esta tarea es la que permite cambiarlo.

## Salida esperada

- El código, con `tests/practicas-nube.test.js` (fusión: conmutativa, idempotente, nunca baja un
  terminado, respeta el tope sin terminar, estados antiguos; puntos de la tarea iguales en el
  marcador y en el panel; agregado de «qué falla más» en casos pequeños hechos a mano).
- `firestore.rules` con el `allow get` y **publicado por Juan Luis** (que lo diga la terminada).
- `ENTREGA.md` + `.ok-<sid>`: cómo probar en un minuto el cambio de aparato (dos navegadores, o
  una ventana normal y otra privada, con el mismo código).
- En el mensaje de cierre a Juan Luis, **en una línea aparte**: «Ya se puede cambiar la frase de
  los aparatos del correo del lunes» (el cambio del correo lo hace la sesión que lo preparó, no tú).

## Cómo saber que ha terminado

- `npm test` en verde; las 31 prácticas siguen arrancando.
- Probado en el navegador con las reglas publicadas: con el código de prueba, terminar un
  ejercicio en una ventana, abrir otra ventana privada con el mismo código y ver ese ejercicio
  terminado, en la práctica y en la página de la semana; hacer algo en la segunda y comprobar
  que la primera no lo machaca al volver a entrar. Sin red: la práctica funciona igual.
- En el panel: la columna de puntos y la vista «qué falla más», con los datos de esa prueba.
- `git push` hecho y la página publicada (GitHub Pages tarda unos minutos).

## Trampas conocidas

- Una lectura con `keepalive` no existe: la subida actual usa `fetch(..., { keepalive: true })`
  al navegar; la lectura va al entrar, con `await` y un tiempo máximo (unos 4 s) para no dejar
  al alumno esperando si la red va mal.
- Firestore REST devuelve 404 si el documento no existe: es lo normal para un alumno nuevo.
- El código de prueba que usen las sesiones deja documentos en la nube con ese código: usa uno
  alto de la lista (los alumnos reales ocupan del 1 al 51) y dilo en la terminada.
- Dos aparatos abiertos a la vez y respondiendo a la vez pueden pisarse en la nube (no hay
  transacciones por REST sin autenticación). Con la fusión al entrar, lo peor que pasa es perder
  lo de la última sesión del otro aparato hasta que vuelva a entrar. Se acepta y se documenta.
- iCloud evacúa ficheros de este árbol (`ls -lO` → `dataless`) y deja copias en conflicto
  dentro de `.git/`; nunca `git stash` ni `--autostash` (`proyecto.md`, «Repositorio git»).
- (Aprendido en la sesión s-20261015T204306-1ed3fc83.) El shell es **zsh**: `echo =====` falla
  («= not found»), y `F="a b c"; git add $F` pasa UNA ruta con espacios (hay que usar un array
  `F=(a b c)`). Y un heredoc **sin comillas** (`<<EOF`) ejecuta lo que vaya entre comillas
  invertidas: para escribir una terminada con `código` dentro, `<<'EOF'`.
- La sesión que cerró la 37 se quedó con el candado de `profesor.js`, `README.md`, `docs/` y
  `_ESTADO.md` unos 30 min después de su último commit: se puede adelantar todo lo demás y
  esperar con un bucle en segundo plano que mire la hora de su `.claude/sesiones/<id>.json`.
- Para saber si Juan Luis ya publicó las reglas sin preguntarle: GET por REST de un documento
  que no existe (`practicas/recta--KTFN`) da 403 con las reglas viejas y 404 con las nuevas.
- Hay un `stash@{0}: autostash` antiguo y un reclamo ajeno sin comitear
  (`hechos/reclamos/23--s-20261007T214947-e0ab035d.md`): no son tuyos, no los toques.

## Prohibido (propio de esta tarea)

- Nota: «Ficheros que toca», arriba, manda sobre «Prohibido (común)», abajo. Esta tarea sí toca
  `practicas/_comun/`, el panel, `README.md` y `firestore.rules`, pero solo lo que declara.
- Editar cualquier fichero de `practicas/<slug>/` o de `divisores/`.
- Cambiar el formato de los códigos (de alumno, de práctica o de tarea) o el contador.
- Abrir `list` de la colección `practicas` a los alumnos, o tocar en `firestore.rules` algo que no
  sea el bloque `match /practicas/{doc}`.
- Publicar tú las reglas en la consola, o tocar el correo de los alumnos.
- Registrar cada fallo (qué ítem, qué respuesta): eso es la tarea 39.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 38, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-38.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/38--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/38--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/38-progreso-nube/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/38--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/38--<sid>.md` con hasta dónde llegaste, la línea
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

- En «Al terminar», los pasos 1 y 2 no son los de una práctica: en la 38 los tests propios son `tests/practicas-comun.test.js` y `tests/practicas-semana.test.js`, y lo que se prueba en el navegador es `practicas/semana.html` y un par de prácticas.

