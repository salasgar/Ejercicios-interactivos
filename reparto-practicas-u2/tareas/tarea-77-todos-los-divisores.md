# Tarea 77 · «Multiplica y divide por primos», ejercicio 5 nuevo: «Todos los divisores» (fabrica uno a uno los divisores de un número; se iluminan los que consigues)

Actualizado: 2026-10-18
Precondición: 76 LISTA (las dos tocan `practicas/_comun/catalogo.js` y `practicas/_comun/registro.js`) · Disparo: MANUAL (sesión atendida)
Duración esperada: 1 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/77-todos-los-divisores/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/por-primos/*`, `tests/practicas-por-primos.test.js`, `practicas/_comun/catalogo.js` (solo `nEjercicios` de la fila de `por-primos`), `practicas/_comun/registro.js` (solo la entrada de `por-primos`, si hace falta), `practicas/portada.js` (solo la `DESCRIPCION` de `por-primos`), `tests/practicas-comun.test.js` y `tests/practicas-semana.test.js` (solo las líneas de `por-primos`, si las hay)

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
   printf 'sesión: %s\ntarea: 77\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/77--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/77--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 77 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/77--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

Juan Luis, 2026-10-18, después de aprobar los cuatro ejercicios de la 75: *«Haz otro ejercicio tomando como base mi juego de scratch en el que el alumno tenga que construir la factorización de todos los divisores de un número. Aparecen en la pantalla todos los divisores del número, pero están con un color apagado. El alumno tendrá que ir pulsando los botones y, al pulsarlos, se irán iluminando los divisores que vaya consiguiendo. Si se pasa con los exponentes y construye un número que no es divisor, que salga un aviso o se ponga en rojo o algo así. El alumno tiene que conseguir que se queden iluminados todos los divisores.»*

Va como **ejercicio 5** de `por-primos`, **añadido al final**: los ejercicios 1-4 no cambian de número, así que el progreso guardado no se descuadra (si la lista guardada tiene 4, la quinta posición empieza vacía; compruébalo en el test). Nombre: «Todos los divisores» / «All the divisors». Destreza U2-3C-01 («Obtener todos los divisores de un número combinando sus factores primos»).

## Siguiente paso

1. Lee `practicas/por-primos/` entero (lo hizo la 75: `logica.js` con `BASES`, `TOPE`, `EJERCICIOS`, `botonesActivos`, `tocar`; `practica.js` con `pintarFact` y `montar`) y su test. Reutiliza los botones y el número actual: **no dupliques la lógica de tocar**.
2. `git status` y `git log --oneline -3 -- practicas/por-primos practicas/_comun/catalogo.js practicas/_comun/registro.js`. La 76 tiene que estar LISTA y sus cambios comiteados.

## Qué hay que hacer

**Ítem**: `{ ejercicio: 5, n, factN, divisores }`.
- n = 2ᵃ·3ᵇ·5ᶜ·7ᵈ, con a lo sumo tres primos distintos y n ≤ 300.
- **Entre 6 y 12 divisores**, exponentes ≤ 4. Con esas condiciones hay 41 números (calculado el 18-10): con 6 divisores, 12, 18, 20, 28, 45, 50, 63, 75, 98, 147, 175 y 245; con 8, 24, 30, 40, 42, 54, 56, 70, 105, 135, 189 y 250; con 9, 36, 100, 196 y 225; con 10, 48, 80, 112 y 162; con 12, 60, 72, 84, 90, 108, 126, 140, 150, 200 y 294. Reparto: la mitad de los ítems con 6 u 8 divisores, la otra mitad con 9-12. El test comprueba que el generador saca exactamente esta lista.

**Pantalla**:
- n arriba con su factorización: «60 = 2²·3·5».
- Debajo, **todos los divisores de n en una rejilla, de menor a mayor, con color apagado** (gris claro, como un botón desactivado, pero legibles).
- Debajo, el número que va construyendo el alumno con su factorización, y los botones «· 2 · 3 · 5 · 7» y «: 2 : 3 : 5 : 7» de la práctica. «: p» sigue apagado si el número no tiene p (nada de decimales), y «· p» si pasaría del tope.
- Un recuento: «Encontrados: 5 de 12» / «Found: 5 of 12».

**Al tocar**:
- Se empieza en **1**, que ya es divisor: el 1 sale iluminado desde el principio con la frase «El 1 es divisor de todos los números» / «1 is a divisor of every number».
- Si el número nuevo **es divisor** de n, su casilla **se ilumina y se queda iluminada**. Usa el verde de acierto de la base (`var(--correcto-claro)` de fondo y `var(--correcto)` de borde), con su factorización pequeña debajo del número («12» y debajo «2²·3»). La casilla del número actual lleva además un borde más grueso, para que se vea dónde está.
- Si **no es divisor** (se ha pasado de exponente o ha usado un primo que n no tiene), el número actual sale **en rojo**, con el aviso de la base debajo. En inglés sencillo, por ejemplo: «36 = 2²·3² no es divisor de 60 = 2²·3·5: 60 solo tiene un 3. Divide para volver.» / «36 = 2²·3² is not a divisor of 60 = 2²·3·5: 60 has only one 3. Divide to go back.» Con un primo que n no tiene: «60 no tiene ningún 7». No se ilumina nada.
- «Deshacer» y «Empezar de nuevo», como en los otros ejercicios. «Empezar de nuevo» vuelve al 1 y **no apaga** lo ya encontrado.

**Fin del ítem**: cuando están todos iluminados, sin botón «Comprobar». Resumen: «¡Los has fabricado todos! 60 = 2²·3·5 tiene 12 divisores: para el 2 hay 3 posibilidades (2⁰, 2¹, 2²), para el 3, 2 y para el 5, 2: 3·2·2 = 12.» Esa explicación prepara U2-3C-02 sin pedirla. Puntuación, criterio de la coordinadora (si Juan Luis lo cambia, manda él): **acierto si ha pasado como mucho 2 veces por un número que no es divisor; si fueron más, fallo**, con el feedback «Los tienes todos, pero te has pasado N veces: mira los exponentes de n antes de multiplicar». Di los dos números en el contador del ítem («Avisos: 1»).

**Introducción** del ejercicio, con un ejemplo en los dos idiomas: «12 = 2²·3. Sus divisores se fabrican con los mismos primos sin pasarse de los exponentes: 1, 2, 2², 3, 2·3, 2²·3, o sea 1, 2, 4, 3, 6 y 12.»

**Funciones** en `logica.js`, puras y con test: `generarTodos(rng)`, `esDivisorDe(nExps, actualExps)`, `explicarNoDivisor(item, actual, idioma)`, `resumenTodos(item, idioma)`. Si encaja, dentro de `EJERCICIOS` (`5: { sube: true, baja: true, … }`).

**Catálogo y portada**: `nEjercicios: 5` en la fila de `por-primos`. La `DESCRIPCION` de la portada añade «… o fabrica todos los divisores de un número» / «… or build all the divisors of a number». En `registro.js`, si las prácticas declaran sus destrezas, la de `por-primos` con U2-3C-01 (comprueba el formato con otra entrada).

**Test**:
- En 3000 ítems: de 6 a 12 divisores, n ≤ 300, a lo sumo tres primos, y el reparto mitad y mitad.
- Desde cualquier ítem se puede llegar a todos los divisores con los botones.
- Ninguna secuencia de toques da un decimal.
- `esDivisorDe` contra `n % d` por fuerza bruta.
- Una lista guardada de 4 ejercicios se carga con la quinta posición vacía.

## Datos de entrada

- `practicas/por-primos/*` (de la 75) y `practicas/_comun/*`: solo lectura, salvo lo declarado.
- `practicas/fabrica/` (ejercicio «¿Cuántos divisores tiene?», como referencia del texto de la cuenta): solo lectura.

## Cómo saber que ha terminado

- `npm test` sin fallos en tus ficheros.
- En local (`npm run servir`), http://localhost:8080/practicas/por-primos/ con el código de prueba 60 (`7NPD`; nunca el de un alumno), a 375 px y en ventana ancha, en español y en inglés:
  - en el ejercicio 5, completa un ítem sin pasarte y comprueba el resumen;
  - completa otro pasándote tres veces y comprueba que es fallo con su frase;
  - comprueba que «: p» está apagado sin p, y que los ejercicios 1-4 siguen igual con su progreso.
- Con 12 divisores la rejilla cabe sin scroll horizontal a 375 px.

## Trampas conocidas

- `.cuenta` no se parte (`nowrap`): las frases del aviso van como texto normal (lección de la 16).
- El progreso se guarda por posición (ver la 76): por eso el ejercicio nuevo va al final y no en otro sitio.
- Hay sesiones de Juan Luis fuera del reparto que tocan `practicas/`: no metas en tu commit nada que no sea tuyo.

## Prohibido (propio de esta tarea)

- Cambiar el orden o el comportamiento de los ejercicios 1-4.
- Meter el ejercicio en una tarea semanal (lo decide Juan Luis).
- Primos mayores que 7, letras o decimales en cualquier pantalla.

## Salida esperada

- Los ficheros de «Ficheros que toca» comiteados, con `npm test` sin fallos en tus ficheros.
- `reparto-practicas-u2/salidas/77-todos-los-divisores/ENTREGA.md` (hash, ficheros, cómo probarlo en 1 minuto, y el criterio de puntuación usado) y su marcador `ENTREGA.md.ok-<sid>`.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 77, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-77.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/77--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/77--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/77-todos-los-divisores/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/77--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/77--<sid>.md` con hasta dónde llegaste, la línea
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
