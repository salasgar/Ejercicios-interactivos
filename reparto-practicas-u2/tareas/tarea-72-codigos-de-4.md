# Tarea 72 · Varios profesores: códigos de 4 u 8 caracteres y el modo decidido por la nube (para pasar ya a Juan Luis con sus códigos de siempre)

Actualizado: 2026-10-17
Precondición: 61-68 LISTAS (lo están). Atendida: Juan Luis publica las reglas durante la sesión · Disparo: MANUAL (sesión atendida)
Duración esperada: 2 h (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/72-codigos-de-4/` (`ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `firestore.rules` (solo la sección de varios profesores), `herramientas/probar-reglas.mjs`, `practicas/_comun/codigos.js`, `practicas/_comun/espacio.js`, `practicas/_comun/tareas.js` (solo el campo nuevo de la configuración), `practicas/_comun/base.js`, `practicas/_comun/textos.js`, `practicas/portada.js`, `practicas/semana.js`, `practicas/vista-tareas.js`, `practicas/profesor.js` y `practicas/resultados.js` (solo generar códigos y el ajuste de longitud), sus tests y `tests/practicas-codigos-4.test.js` (nuevo)

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
   printf 'sesión: %s\ntarea: 72\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/72--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/72--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 72 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/72--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Lo común a las tareas 61-72 (varios profesores)

- **La especificación es `reparto-practicas-u2/salidas/57-diseno-varios-profesores/DISENO.md`**, aprobado entero por Juan Luis el 2026-10-17. Léelo entero antes de empezar (no solo tu apartado). Lo que esté mal pensado se propone en la terminada; no se cambia por tu cuenta.
- **El modo antiguo no se rompe nunca**: hasta la migración de Juan Luis (vuelta de Navidad) sus 51 alumnos siguen con códigos de 4 caracteres, `tareas.js` y las colecciones `practicas`, `practicas-tareas`, `practicas-asignaciones` y `fallos`. Cada tarea lo comprueba con un test (la longitud del código decide el modo: 4, antiguo; 8, nuevo).
- **Nada de datos reales en el repositorio**: ni nombres, ni códigos de alumnos, ni uids de compañeros, ni contraseñas. Las cuentas de prueba y sus contraseñas, por variables de entorno.
- **Código de prueba del modo antiguo**: 60 (`7NPD`), 61-63. Nunca el de un alumno.
- Decisiones de Juan Luis posteriores al diseño (17-10): el centro ha dicho que **sí** se puede usar su proyecto de Firebase con alumnos de sus compañeros (G, resuelto); los compañeros empiezan el **lunes 14-12** (la 69 tiene que estar LISTA con «se entrega» antes); **códigos (17-10, noche): Juan Luis pasa YA al sistema nuevo, y sus alumnos conservan sus códigos de 4 de siempre, registrados en `practicas-alumnos` como si fueran al azar** («Nadie va a fisgonear en las tareas de mis alumnos; te lo garantizo»: acepta que esos códigos se puedan calcular). Sus alumnos nuevos de cursos próximos, códigos de 4 al azar; los de los compañeros, de 8 (tarea 72). El paso de Juan Luis lo hace la 70, en el fin de semana del 24-25 de octubre (entre el cierre de la tarea 1, jue 22-10 23:59, y la apertura de la tarea 2, lun 26-10 8:00), con él delante.
- Hay una sesión de Juan Luis fuera del reparto que el 17-10 por la tarde editaba `practicas/profesor.js`, `practicas/resultados.js` y su test: antes de tocar esos ficheros, `git status`; si hay cambios sin commit que no son tuyos, no los pises y avisa.

## Objetivo

Juan Luis, 2026-10-17 (cambia el diseño de la 57, B.1 y E). Primero: *«Me gustaría que mis alumnos no tuvieran que memorizar un código de 8 caracteres. Quiero que mis alumnos puedan entrar con su código de 4 caracteres. Si es necesario que los alumnos de mis compañeros usen 8 caracteres, de acuerdo.»* Y al final: *«Mi propuesta es que cambiemos ya al sistema de códigos generados aleatoriamente, pero les asignamos a mis alumnos los códigos que ya tienen, como si los hubiéramos generado aleatoriamente y casualmente hubieran coincidido así […]. Nadie va a fisgonear en las tareas de mis alumnos; te lo garantizo.»*

Lo decidido (no se rediscute; la coordinadora le explicó el riesgo y lo acepta):
1. En el sistema nuevo, un código de alumno puede tener **4 u 8 caracteres**. Cada profesor elige la longitud de los que genera (por defecto 8; Juan Luis, 4).
2. **Los códigos de 4 de siempre de Juan Luis pasan al sistema nuevo tal cual**: la tarea 70 los registra en `practicas-alumnos` con su número de lista. Por eso un código de 4 **ya no se puede clasificar sin mirar la nube**: uno con el control antiguo válido puede estar registrado (sistema nuevo) o no (modo antiguo, mientras dure).
3. Los códigos de 4 que se **generen** a partir de ahora no pueden ser de los 1024 calculables: se descartan.

Esta tarea deja el sistema preparado para eso; **no registra ni copia nada** (eso es la 70).

## Siguiente paso

1. Lee DISENO.md (B, C.2, E), las terminadas y entregas de la 61 (reglas, `probar-reglas.mjs`), la 62 (`codigoSecreto`, `modoDeCodigo`, `espacio.js`), la 64 y la 65 (cómo deciden la base y las páginas el modo) y la 66 («Mis alumnos»).
2. `grep -rn "modoDeCodigo\|codigoSecreto\|LONGITUD_SECRETO\|resolverCodigo\|{8}" practicas firestore.rules herramientas tests`: son todos los sitios que deciden el modo por la longitud o dan por hecho los 8 caracteres.

## Qué hay que hacer

1. **Formato** (`codigos.js`): `modoDeCodigo` pasa a decir solo si el **formato** es válido (`'4'`, `'8'` o `null`); el modo lo decide `resolverCodigo` (`espacio.js`), con red:
   - código de 8, o de 4 sin el control antiguo: búsqueda en `practicas-alumnos` → sistema nuevo, o «Ese código no existe…»;
   - código de 4 **con el control antiguo válido**: búsqueda primero; si está registrado → sistema nuevo; si da 404 → modo antiguo, como hoy (hasta la 71);
   - **sin red**: lo guardado en el navegador de la última vez; si no hay nada y el código es antiguo válido → modo antiguo, como hoy.
   Guarda la respuesta en el navegador para no buscar en cada página.
2. **Base y páginas** (`base.js`, `portada.js`, `semana.js`, `vista-tareas.js`): donde hoy se decide con `modoDeCodigo(…) === 'antiguo'`, pasar por `resolverCodigo`. Con un código no registrado del modo antiguo, todo exactamente como hoy (test).
3. **`codigoSecreto(longitud = 8)`** acepta 4 u 8; con 4, descarta los que pasen `leerCodigoAlumno` (test con muchos sorteos). La configuración del profesor (`tareas.js`) gana `longitudCodigo` (4 u 8; por defecto 8). En «Mis alumnos», el ajuste «Longitud de los códigos nuevos: 8 (más seguro) / 4 (más fácil de recordar)», con una línea que explique la diferencia; «Generar códigos» la usa. Los códigos ya generados no cambian.
4. **Reglas** (solo la sección de varios profesores): `codigoSecreto(c)` acepta `{4}` u `{8}`; los ids de `progreso-libre`, `progreso-tareas`, `asignaciones` y `fallos` del espacio y el campo `alumno` de los fallos, igual; en `practicas-alumnos`, `n` hasta **1023** (el alumno de prueba de Juan Luis, AJJN, es el número 1000; el código de resultado de la tarea admite hasta 1023). Pide a Juan Luis que publique (enlace en la ficha 61) y amplía `probar-reglas.mjs`: un código de 4 en el espacio de un profesor de prueba se lee, se escribe y se lista como uno de 8, y otro profesor no puede.
5. **Tests**: los casos del punto 1 con dobles de `fetch` (registrado, no registrado, sin red con y sin copia), `codigoSecreto(4)`, la configuración con y sin `longitudCodigo`, y que el modo antiguo no cambia para un código no registrado.

## Cómo saber que ha terminado

- `probar-reglas.mjs` en verde contra las reglas publicadas, con la salida literal en `ENTREGA.md`.
- En local: registra a mano en la nube (consola o script, en el espacio del profesor de prueba A) el código 60 (`7NPD`) con `n: 60`; con él, una práctica y una tarea de A guardan en el espacio de A. Bórralo después: el 60 vuelve al modo antiguo y todo es como hoy. Con un código de 4 al azar generado por A, lo mismo que con uno de 8.
- `npm test` en verde.

## Trampas conocidas

- El alfabeto (`ALFABETO`) es el mismo en los dos sistemas: por eso los de 4 generados descartan los calculables.
- AJJN (número 1000) es el alumno de prueba de Juan Luis: no lo uses ni lo registres (lo registra la 70).
- Una búsqueda más por alumno al entrar: va al navegador para no repetirla (cuotas, DISENO.md F.7).

## Prohibido (propio de esta tarea)

- Registrar o copiar los códigos de Juan Luis (es la 70) o tocar los bloques del modo antiguo de las reglas.
- Cambiar `codigoAlumno` o la longitud de códigos ya generados.

## Salida esperada

- Los ficheros de «Ficheros que toca» cambiados y comiteados, con `npm test` en verde.
- `reparto-practicas-u2/salidas/72-codigos-de-4/ENTREGA.md` (hash, ficheros, lo comprobado con su resultado literal, lo que queda para la tarea siguiente) y su marcador `ENTREGA.md.ok-<sid>`.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 72, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-72.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/72--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/72--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/72-codigos-de-4/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/72--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/72--<sid>.md` con hasta dónde llegaste, la línea
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
