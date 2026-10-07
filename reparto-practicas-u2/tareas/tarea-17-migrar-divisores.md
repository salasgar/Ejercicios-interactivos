# Tarea 17 · Migrar la práctica «divisor, múltiplo, divisible» a la base común, conservando la URL y los códigos

Actualizado: 2026-10-07
Precondición: 01 LISTA; la sesión que editaba divisores/ el 2026-10-07 ha terminado (su trabajo está en main y git status no muestra cambios en divisores/); firma de la tarea 17 en autorizaciones.md · Disparo: MANUAL (sesión atendida)
Duración esperada: 1 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/17-migrar-divisores/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `divisores/*` (todos), `tests/divisores.test.js`

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
   printf 'sesión: %s\ntarea: 17\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/17--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/17--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 17 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/17--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

Que `divisores/` deje de ser una copia aparte y pase a ser la práctica 0 del catálogo
sobre `practicas/_comun/base.js`, con la misma URL (`…/divisores/`), los mismos códigos
de alumno, los mismos cinco ejercicios y el mismo comportamiento que los alumnos ya
conocen, con los parámetros nuevos de la base (10 aciertos, +2 por fallo con frase de ánimo,
tope de 20; decisión de Juan Luis del 2026-10-07 tras probarla; la penalización por tiempo está en suspenso y no se reactiva aquí: ver la nota
de memoria `dilema-penalizacion-por-tiempo`, que es una decisión de Juan Luis). Así el panel único del profesor es el único panel y las mejoras de la base
llegan también aquí.

## Siguiente paso

**Aviso de la coordinadora (2026-10-07, 20:55 UTC):** la tarea 35 va a cambiar la base a 10
aciertos, +2, tope 20 e idioma alterno por ítem. Esta tarea no tiene que esperarla: basta con
**no declarar** `inicial`, `penalizacion` ni `maximo` en los ejercicios de `divisores/practica.js`
(que tomen los valores por defecto de la base) y no añadir selector de idioma propio. Así, cuando
la 35 cierre, `divisores/` lo hereda sin tocar nada más.

Comprueba la precondición entera antes de reclamar: (1) `01--*` en `hechos/terminadas/`;
(2) `git status --short divisores/ tests/divisores.test.js` vacío y `ls .claude/sesiones/`
sin ninguna sesión que tenga reclamados ficheros de `divisores/` (si la hay, no es una
sesión de este reparto: espera a que termine; no la releves); (3) la línea «Firma y
fecha:» de la tarea 17 en `reparto-practicas-u2/autorizaciones.md` rellena. Si falta
cualquiera de las tres, no reclames: dilo y para.

## Qué hay que hacer

1. Lee `divisores/*` y `tests/divisores.test.js` como están en `main` ahora (pueden haber
   cambiado desde que se montó el reparto: lo que hay es lo que se migra).
2. Reescribe `divisores/practica.js` (nuevo) con el contrato de la base: `slug: 'divisores'`,
   los cinco ejercicios en el mismo orden (0 «de» o «entre»; 1 multiplicaciones; 2
   divisiones; 3 mezcla; 4 arrastrar), cada uno con `generar` y `montar` sacados de
   `app.js` y `logica.js`. `logica.js` conserva los generadores y **los códigos**
   (`codigoAlumno`, `leerCodigoAlumno`, `codigoResultado` de 12 caracteres,
   `leerCodigoResultado`, `extraerCodigosResultado`) porque `practicas/_comun/codigos.js` los
   importa; puedes quitar de `logica.js` lo que ya esté en `_comun` (rng, contador) si
   actualizas los imports de `codigos.js`… no: `_comun` es de la tarea 01 y no se toca aquí;
   deja en `logica.js` todo lo que `_comun/codigos.js` importe.
3. `divisores/index.html` carga la base como las demás prácticas. `divisores/app.js` queda
   reducido a `import './practica.js'` o se elimina (y entonces `index.html` apunta a
   `practica.js`). `divisores/profesor.html` pasa a redirigir a `../practicas/profesor.html`
   (meta refresh + enlace); `profesor.js` y `resultados.js` se eliminan si el panel único
   cubre todo lo que hacían (compruébalo: códigos de 12, nube `divisores`, CSV).
4. Guardado: la base guarda en `practicas/divisores--<código>`; los datos antiguos están
   en `divisores/<código>`. Al entrar, si no hay progreso en la clave nueva de
   `localStorage` y sí en la antigua (`divisores.v1.<código>`), se copia. El panel único
   ya lee las dos colecciones (tarea 01, §7).
5. Los textos propios (`textos.js`) se quedan; los comunes salen de `_comun/textos.js`.
6. `tests/divisores.test.js` se adapta a los imports nuevos sin perder ninguna
   comprobación (mismo número de tests o más).

## Datos de entrada

- `practicas/plantilla/` y `practicas/_comun/` (solo lectura): el contrato.
- `reparto-practicas-u2/hechos/terminadas/01--*.md`: cambios del contrato, si los hubo.

## Salida esperada

- `divisores/{index.html,practica.js,logica.js,textos.js,estilos.css,profesor.html}` y los
  que decidas conservar; `tests/divisores.test.js` adaptado.
- `reparto-practicas-u2/salidas/17-migrar-divisores/ENTREGA.md` + `.ok-<sid>`.

## Cómo saber que ha terminado

- `npm test` en verde; `tests/divisores.test.js` sigue comprobando que `codigoAlumno(i)` no
  ha cambiado para los 1024 índices (compara con una tabla de 20 valores fijos copiados
  del código **antes** de tocarlo) y que los códigos de resultado de 12 caracteres
  generados antes siguen leyéndose (3 códigos reales generados con el código viejo,
  pegados como constantes en el test).
- En el navegador, `…/divisores/?c=<código>` entra, muestra el progreso que ya había en
  `localStorage` y los cinco ejercicios funcionan igual que antes; `…/divisores/profesor.html`
  lleva al panel único.

## Trampas conocidas

- La ficha se escribió el 2026-10-07 con `divisores/` en su primera versión; si la otra
  sesión añadió ejercicios o cambió el formato del código, manda lo que haya en `main`.

## Prohibido (propio de esta tarea)

- Cambiar la sal, el paso o el desfase de los códigos de alumno, o el formato del código
  de resultado de 12 caracteres: los alumnos ya tienen códigos y el profesor, resultados.
- Tocar `practicas/_comun/`: si la base necesita algo para esta migración, propuesta en la
  terminada y la tarea se suelta con `BLOQUEADA por decisión` si no se puede seguir.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 17, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-17.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/17--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/17--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/17-migrar-divisores/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/17--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/17--<sid>.md` con hasta dónde llegaste, la línea
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
