# Tarea 71 · Varios profesores, N11: limpieza del modo antiguo y borrado de los datos viejos (con firma)

Actualizado: 2026-10-18 (**revisada por la coordinadora** s-20261017T203500-e4f6b02c, tras el paso de la 70)
Precondición: paso de Juan Luis hecho y comprobado (**sí**: tarea 70 LISTA, paso el 18-10 hacia las 07:35Z, recopia sin nada pendiente a las 13:48Z) · firma de la 71 en `autorizaciones.md` (**sí**: «Juan Luis Salas García, 18-10-26») · **no antes del domingo 25-10**, una semana después del paso, por si queda algún aparato o enlace viejo escribiendo en el modo antiguo; antes de que empiecen los compañeros (14-12) · 78 LISTA (comparte `profesor-hoy.js` y el informe) · Disparo: MANUAL, **con Juan Luis delante** (publica las reglas y borra en la consola)
Duración esperada: 2 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/71-limpieza-modo-antiguo/` (`ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/{base,registro,codigos,espacio,nube,tareas,textos}.js`, `practicas/{portada,semana,vista-tareas,profesor,profesor-hoy,profesor-tareas,profesor-migracion,resultados}.js`, `practicas/profesor.html`, `divisores/profesor.html` (solo para que lleve al panel nuevo), `src/firebase.js` (solo las funciones de las colecciones viejas), `firestore.rules` (solo los bloques viejos), `herramientas/informe-actividad.mjs`, `herramientas/probar-reglas.mjs`, `docs/practicas-unidad2.md`, `README.md`, y los tests de todo eso

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
   printf 'sesión: %s\ntarea: 71\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/71--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/71--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 71 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/71--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Lo común a las tareas 61-71 (varios profesores)

> **Para esta tarea (revisión del 18-10):** lo de «el modo antiguo no se rompe nunca» ya no vale. El paso de Juan Luis está hecho y esta tarea quita el modo antiguo; mandan el objetivo y sus correcciones.

- **La especificación es `reparto-practicas-u2/salidas/57-diseno-varios-profesores/DISENO.md`**, aprobado entero por Juan Luis el 2026-10-17. Léelo entero antes de empezar (no solo tu apartado). Lo que esté mal pensado se propone en la terminada; no se cambia por tu cuenta.
- **El modo antiguo no se rompe nunca**: hasta la migración de Juan Luis (vuelta de Navidad) sus 51 alumnos siguen con códigos de 4 caracteres, `tareas.js` y las colecciones `practicas`, `practicas-tareas`, `practicas-asignaciones` y `fallos`. Cada tarea lo comprueba con un test (la longitud del código decide el modo: 4, antiguo; 8, nuevo).
- **Nada de datos reales en el repositorio**: ni nombres, ni códigos de alumnos, ni uids de compañeros, ni contraseñas. Las cuentas de prueba y sus contraseñas, por variables de entorno.
- **Código de prueba del modo antiguo**: 60 (`7NPD`), 61-63. Nunca el de un alumno.
- Decisiones de Juan Luis posteriores al diseño (17-10): el centro ha dicho que **sí** se puede usar su proyecto de Firebase con alumnos de sus compañeros (G, resuelto); los compañeros empiezan el **lunes 14-12** (la 69 tiene que estar LISTA con «se entrega» antes); **códigos (17-10, noche): Juan Luis pasa YA al sistema nuevo, y sus alumnos conservan sus códigos de 4 de siempre, registrados en `practicas-alumnos` como si fueran al azar** («Nadie va a fisgonear en las tareas de mis alumnos; te lo garantizo»: acepta que esos códigos se puedan calcular). Sus alumnos nuevos de cursos próximos, códigos de 4 al azar; los de los compañeros, de 8 (tarea 72). El paso de Juan Luis lo hace la 70 **lo antes posible** (Juan Luis, 17-10 noche: «Me va bien cualquier momento. Cuanto antes, mejor»): la herramienta y el ensayo de la 70 se preparan **en paralelo con la 69** en cuanto la 72 esté LISTA (la 69 prueba con los códigos 60 y 61; el ensayo de la 70, con el 62 y el 63), y el paso se ejecuta con él delante en cuanto la 69 dé «se entrega», de noche (después del informe de las 21:30 y antes de las 7:00), aunque la tarea 1 siga abierta.
- Hay una sesión de Juan Luis fuera del reparto que el 17-10 por la tarde editaba `practicas/profesor.js`, `practicas/resultados.js` y su test: antes de tocar esos ficheros, `git status`; si hay cambios sin commit que no son tuyos, no los pises y avisa.

## Objetivo

Quitar el modo antiguo ahora que nadie lo usa (DISENO.md, E.5; lista H.2, N11) y **borrar las colecciones viejas** (`practicas`, `practicas-tareas`, `practicas-asignaciones`, `fallos` y `divisores`), con la firma de Juan Luis del 18-10. Borrar es **irreversible**: antes, copia completa y comprobación de que no se ha escrito nada nuevo en ellas.

**Correcciones de la revisión a DISENO.md** (las ha visto la coordinadora el 18-10; mandan sobre el diseño):
1. **Los códigos de 4 caracteres NO se quitan.** Los alumnos de Juan Luis siguen con sus códigos de 4 de siempre, registrados en `practicas-alumnos` (tarea 72), y sus alumnos nuevos tendrán códigos de 4 al azar. Lo que se quita es el **modo antiguo**: un código **sin registrar** ya no cae en las colecciones viejas, sino en «ese código no existe». `codigoSecreto(4)` sigue descartando los códigos calculables.
2. **`divisores/index.html` NO se redirige.** Es la práctica viva `divisores` (id 0 del catálogo, `ruta: '../divisores/'`): es obligatoria (★) en la tarea 1 y está en la 3. F.4 del diseño se equivocaba al decir que estaba en `practicas/divisores/`, que no existe. Solo `divisores/profesor.html`, el panel viejo de esa mini-app, pasa a llevar a `practicas/profesor.html`. La colección `divisores` es de la mini-app de antes de la tarea 17 y sí se borra, con copia.
3. `tareas.js` se queda como plantilla de los profesores nuevos (y de los tests). Juan Luis ya lee su configuración de su espacio.
4. `adaptarProgreso` y `quitados` (tarea 76) se quedan: valen para cualquier práctica que pierda un ejercicio.

## Siguiente paso

1. `date -u`: si es antes del domingo 25-10, no empieces. Comprueba la firma en `autorizaciones.md` (línea de la tarea 71) y lee la terminada de la 70 (`hechos/terminadas/70--*.md`) y `salidas/70-herramienta-migracion/ENTREGA.md`.
2. Lee DISENO.md (E, F) con las correcciones de arriba, y la nota `hechos/notas/s-20261017T174551-a1224f1f-para-70-lectores-listan-alumnos.md`.

## Qué hay que hacer

Por este orden; cada paso, con su resultado literal en la entrega.

1. **¿Ha escrito alguien en las colecciones viejas después del paso?** Lista por REST, con la cuenta lectora o con la de Juan Luis (pídesela; nunca al repositorio), los documentos de las cinco colecciones con `updateTime` posterior a 2026-10-18T07:35Z.
   - Si hay alguno: **para**, averigua de quién es (un aparato viejo, un enlace guardado) y pásalo con la herramienta «Pasar al sistema nuevo» de la 70. Es repetible y no duplica. Vuelve a comprobar.
   - Si no hay ninguno, sigue.
2. **Copia completa** de las cinco colecciones, documento a documento y en JSON, en `~/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/Curso 2026-2027/copias-firestore/<fecha>/`. Lleva datos de alumnos: **nunca al repositorio**. Añade el recuento por colección y comprueba que cuadra con un recuento independiente. Confirma con Juan Luis que tiene guardado el CSV de «Qué falla más» del 18-10 (la 70 lo descargó antes del paso).
3. **Código**: quita las ramas del modo antiguo.
   - En la base, la portada, la página de la tarea, el registro de fallos y la nube: un código de 4 sin registrar → «no existe».
   - En el panel: las vistas, lecturas y exportaciones de las colecciones viejas, y la herramienta de la 70, que ya no tiene nada que pasar. Su botón se va; deja el código en el historial de git.
   - En el informe (`informe-actividad.mjs`): solo el modo `--espacio`.
   - En `src/firebase.js`: las funciones de las colecciones viejas, entre ellas `listarPracticaDivisores` y `listarPracticas`.
   - **Tests**:
     - fuera los del modo antiguo;
     - nuevos: un código de 4 registrado (el 62 o el 63, en el espacio del profesor de prueba A) entra y ve su progreso; uno de 4 sin registrar da «no existe»; uno de 8 sigue igual.
   - `npm test` en verde.
4. **Reglas**: `firestore.rules` sin los bloques de las colecciones viejas; `probar-reglas.mjs` ajustado (fuera las comprobaciones viejas, y una nueva: las colecciones viejas no se leen ni se escriben). **Las publica Juan Luis** en la consola. Después, el banco REST entero en verde.
5. **Publicar el código** (commit y `git push`) y comprobar en Pages, con recarga forzada:
   - con los códigos 62 y 63: portada, una práctica, `semana.html?t=2` y la Fábrica;
   - el panel de Juan Luis (que lo abra él): «Mis alumnos», «Hoy», «Qué falla más»;
   - el informe de esa noche, que llega.
   - Nunca con AJJN ni con los números 1-51.
6. **Borrar**: con todo lo anterior en verde y **Juan Luis delante**, él borra en la consola de Firebase las cinco colecciones viejas (Firestore → la colección → «Eliminar colección»), una a una, y tú compruebas por REST que ya no hay documentos.
7. **Documentación**: `docs/practicas-unidad2.md` y `README.md` sin el modo antiguo; en DISENO.md no se escribe (es de la 57): las correcciones van en tu entrega.

## Cómo saber que ha terminado

- `npm test` en verde, banco REST en verde con las reglas publicadas.
- Las cinco colecciones viejas, vacías, y su copia en `Curso 2026-2027/copias-firestore/` con el recuento cuadrado.
- Las comprobaciones del paso 5, con su resultado literal en la entrega.

## Trampas conocidas

- Los alumnos de Juan Luis tienen códigos de 4 **registrados**: «quitar los códigos de 4» rompería a los 51. Lo que se quita es el camino de los no registrados.
- `divisores/` es una práctica viva: no se redirige (ver el objetivo).
- El «antiguo» se recordaba 1 h en el navegador (nota de la 72). Con el código nuevo ya no importa, pero si en el paso 1 aparecen escrituras recientes, ese es el sospechoso.
- Las cuentas de prueba A y B siguen vivas y con contraseña nueva (18-10): las contraseñas, por variables de entorno.

## Prohibido (propio de esta tarea)

- Borrar nada antes de los pasos 1-5 en verde, sin la copia o sin Juan Luis delante.
- Quitar el soporte de los códigos de 4 registrados o redirigir `divisores/index.html`.
- Tocar la aplicación antigua de `src/` (`alumnos/`, `tareas/`, `credenciales/`), salvo las funciones de las colecciones viejas en `src/firebase.js`.

## Salida esperada

- Los ficheros de «Ficheros que toca» cambiados y comiteados, con `npm test` en verde.
- `reparto-practicas-u2/salidas/71-limpieza-modo-antiguo/ENTREGA.md` (hash, ficheros, cada paso con su resultado literal, recuentos de la copia, lo que queda) y su marcador `ENTREGA.md.ok-<sid>`.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 71, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-71.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/71--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/71--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/71-limpieza-modo-antiguo/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/71--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/71--<sid>.md` con hasta dónde llegaste, la línea
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
