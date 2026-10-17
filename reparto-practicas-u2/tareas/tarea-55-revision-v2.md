# Tarea 55 · Modelo de tareas v2, I7: revisión de extremo a extremo con códigos de prueba y dos navegadores, y documentación

Actualizado: 2026-10-16
Precondición: 51, 52, 53 y 54 LISTAS · Disparo: MANUAL (sesión atendida)
Duración esperada: 1 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/55-revision-v2/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `docs/practicas-unidad2.md`, `README.md`; la salida con el veredicto

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
   printf 'sesión: %s\ntarea: 55\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/55--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/55--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 55 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/55--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## La especificación es el diseño aprobado

Todo lo que esta ficha pide está detallado en
`reparto-practicas-u2/salidas/45-diseno-tareas-v2/DISENO.md` (tarea 45, **aprobado entero
por Juan Luis el 2026-10-16**): léelo antes que nada, entero, y después los apartados que
cita esta ficha. Si algo del diseño resulta mal pensado al implementarlo, **no lo cambies por
tu cuenta**: hazlo como está si funciona, o propón el cambio en tu terminada y para en ese
punto si no funciona. Lo que el diseño marca «decidido por Juan Luis» no se discute.

**Regla de publicación (DISENO.md, D):** cada commit a `main` se publica solo en GitHub Pages y
hay 51 alumnos haciendo la **tarea 1** hasta el jueves 22-10. La tarea 1 se queda con el modelo
de hoy para siempre (`progresoPorPractica: true`): su progreso sigue en `practicas/<slug>--<código>`,
lo de la práctica libre le cuenta, su código de resultado no cambia y los enlaces
`semana.html?t=1&c=<código>` y `semana.html?t=1` siguen igual. **Al cerrar, tu tarea deja la
tarea 1 funcionando exactamente como hoy y lo comprueba con un test.** No hay ventana de
publicación: se publica cuanto antes sin tocar la tarea 1 (decisión de Juan Luis que sustituye
a la ventana 23-25 de octubre que aparece en la ficha 45).

## Objetivo

Comprobar el modelo v2 entero antes de que la semana 2 (lunes 26-10) lo use con 51 alumnos, y
documentarlo. Dos salidas separadas: el **veredicto** contra los criterios de abajo, y los
**hallazgos fuera de criterio**, que se le dicen a Juan Luis como decisiones pendientes y no se
entierran en el informe.

## Siguiente paso

1. Lee DISENO.md entero y las terminadas y `ENTREGA.md` de la 49 a la 54.
2. `npm run servir`; dos navegadores (o uno normal y uno privado); códigos de prueba de los
   números de lista 60 a 63 (`codigoAlumno(59..62)`); una tarea de prueba v2 si las fichas
   anteriores la dejaron (id alto, `desde` lejano) o la tarea 2 por enlace directo.

## Criterios del veredicto (cada uno PASA o FALLA, con lo observado)

1. **Tarea 1 intacta**: `semana.html?t=1&c=<código 60>` lee y escribe en `practicas/`, lo hecho
   en práctica libre le cuenta, el código de 20 del desplegable se lee en el panel, plazo
   22-10 visible.
2. **Progreso separado**: un ejercicio terminado dentro de una tarea v2 no aparece en la
   práctica libre ni al revés; el documento `practicas-tareas/t<id>--<slug>--<código>` existe
   y el de `practicas/` no cambia.
3. **Fusión entre aparatos** dentro de una tarea v2: dos navegadores, el mismo código, cada uno
   avanza un ejercicio distinto; al recargar, los dos ven los dos.
4. **Repetir** dentro de una tarea hecha: modo práctica, suma `repeticiones`, no cambia puntos.
5. **Plazo y retraso**: con fechas forzadas en los tests (no en producción) los cuatro estados
   y los días de retraso cuadran con B.2; en la app, antes del plazo se ve «Plazo: …».
6. **Asignación de punta a punta**: en el panel, asignar la tarea de prueba al 60 y guardar;
   entrar con el 60 → «obligatoria para ti»; con el 61 → repaso, sin marca.
7. **Panel y CSV**: «Tareas de la semana» con retraso, «Retrasos» y su CSV, «qué falla más» por
   tarea, con los códigos 60-63.
8. **Informe**: `node herramientas/informe-actividad.mjs` elige la tarea vigente y, con
   `--tarea <prueba>`, cuenta solo asignados.
9. **Portada**: por unidades, la actual abierta, las anteriores plegadas, nombres sin coletilla,
   en los dos idiomas y a 375 px.
10. `npm test` en verde en `main`.

Si algo FALLA, no lo arregles tú: `hechos/reabiertas/NN--<sid>.md` de la tarea responsable con
qué corregir, y díselo a Juan Luis.

## Documentación

`docs/practicas-unidad2.md` y `README.md`: el modelo v2 (colecciones, claves, estados, plazo y
retraso, asignación), la tarea 1 como excepción, el informe diario y la rutina. Sin reescribir
lo que sigue siendo cierto.

## Trampas conocidas

- Deja limpio lo que crees con los códigos de prueba, o anótalo (documentos en
  `practicas-tareas/` y `practicas-asignaciones/` de los códigos 60-63): solo el profesor puede
  borrarlos; pídeselo a Juan Luis en la terminada.
- (s-20261017T085758-fd6852c8) Lo que salió bien y conviene repetir: probar desde un
  **worktree limpio** de `origin/main` en el scratchpad, con tareas de prueba **solo ahí**
  (ids 900+, sin comitear), servido en otro puerto (8095); así no se toca el árbol compartido.
  **Dos aparatos** = dos orígenes del mismo Chrome (`localhost:8095` y `127.0.0.1:8095`), que
  tienen almacenamiento separado.
- Tras cambiar `tareas.js` en el worktree, una pestaña que ya lo había cargado sigue con el
  módulo viejo en caché: el enlace `&semana=<id nuevo>` se trata como «tarea que no existe» y
  el avance va a la práctica libre. Recarga sin caché (cmd+shift+R) antes de probar.
- La ventana de Chrome no baja de ~570 px: los 375 px se prueban con un `<iframe>` de 375 px
  en el mismo origen, midiendo `scrollWidth` dentro.
- La base sube a la nube cada 5 respuestas o al terminar: tras 1-4 respuestas, el documento
  no cambia hasta que se abre la tarea (que sincroniza). No es un fallo.
- Para leer un CSV del panel sin descargar nada: envolver `URL.createObjectURL` en la página y
  leer el `Blob` (el enlace se revoca enseguida, `fetch` del href falla).
- La extensión de Chrome bloquea las salidas de JavaScript que parecen datos sensibles
  (códigos de 4 letras en tablas, URLs con `?c=`): devolver recuentos o filtrar antes.
- El panel no pidió inicio de sesión: la sesión de Google del profesor ya estaba abierta en
  Chrome. Si no lo está, lo tiene que hacer Juan Luis (no se introducen credenciales).
- Duración real: ~1 h 22 min (estimada 1 h 30 min).

## Prohibido (propio de esta tarea)

- Tocar código: solo documentación y la salida. Lo que falle se reabre.
- Usar códigos de alumnos reales en las pruebas.

## Salida esperada

- `reparto-practicas-u2/salidas/55-revision-v2/VEREDICTO.md` (los 10 criterios con PASA/FALLA y
  lo observado) y `HALLAZGOS-FUERA-DE-CRITERIO.md`; `ENTREGA.md` y su marcador; los dos ficheros
  de documentación comiteados.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 55, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-55.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/55--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/55--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/55-revision-v2/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/55--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/55--<sid>.md` con hasta dónde llegaste, la línea
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
