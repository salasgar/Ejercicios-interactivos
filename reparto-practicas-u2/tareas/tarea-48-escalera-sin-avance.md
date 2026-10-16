# Tarea 48 · La escalera de divisiones (divisiones, ej. 1): al fallar, el número se queda; y divisores compuestos como distractores

Actualizado: 2026-10-16
Precondición: ninguna (la 07 está LISTA; para este cambio la dueña de `practicas/divisiones/` es esta tarea) · Disparo: MANUAL (sesión atendida)
Duración esperada: 1 h (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: 47
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/48-escalera-sin-avance/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/divisiones/practica.js` (solo `montarEscalera`), `practicas/divisiones/logica.js` (ejercicio 1), `practicas/divisiones/textos.js`, `tests/practicas-divisiones.test.js`

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
   printf 'sesión: %s\ntarea: 48\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/48--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/48--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 48 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/48--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

Juan Luis, revisando la app el 2026-10-16 con el 81: pulsó varias veces un primo equivocado
y «aun así el número se fue dividiendo entre 3». Es el diseño actual de `montarEscalera`
(`practica.js`, líneas 20-76): cuando el alumno falla, la app hace ella misma el paso
correcto (`avanzar(correcto)`) y el ítem termina siempre al llegar a 1, con fallo si hubo
algún error. Él quiere lo contrario, y tiene razón pedagógicamente: **al fallar, el número se
queda como está**, con el mensaje de por qué no vale, esperando a que pulse el primo
adecuado. El alumno hace la escalera entera él.

Segunda petición suya: el error típico al descomponer es dividir entre un **divisor no
primo** (4, 6, 9, 10…). Hoy los botones son siempre los seis primos 2, 3, 5, 7, 11 y 13, así
que ese error no se puede cometer ni corregir. Hay que ofrecer también divisores compuestos
del número como distractores, con un feedback que diga que sí dividen al número pero no son
primos.

## Siguiente paso

1. Lee `practicas/divisiones/practica.js` líneas 1-76 y 160-200 (la declaración del ejercicio
   1), `practicas/divisiones/logica.js` líneas 1-124 (`PRIMOS_ESCALERA`, generadores,
   `pasoCorrecto`, `evaluarEleccion`, `razonNoDivide`, `razonNoMenor`, `explicarEscalera`),
   `practicas/divisiones/textos.js` (bloque `escalera`) y `tests/practicas-divisiones.test.js`.
2. `git status -sb` y `git log --oneline -3 -- practicas/divisiones`: si hay cambios sin
   comitear de otra sesión, no los pises.
3. Primero la lógica (botones del ítem y la evaluación con el caso «compuesto») y su test en
   verde; después `montarEscalera`; después el navegador.

## Qué hay que hacer

1. **Sin avance al fallar.** En `manejar(p)`: si `resultado` no es `correcto`, `errores++`, se
   pinta el mensaje y **no se llama a `avanzar`**; el número y los botones se quedan. Solo
   avanza con el primo correcto (el menor que divide). El ítem termina al llegar a 1 como
   ahora, con `acierto: errores === 0` (un ítem, un punto: varios fallos en el mismo ítem
   cuestan un punto y una vida, no uno por fallo; es lo que ya hace y no se cambia).
2. **Botones del ítem**: los seis primos de siempre más **hasta dos divisores compuestos de n**
   elegidos al generar el ítem (`generarEscalera`, con el `rng`; guardados en el ítem como
   `distractores`): preferir 4, 6, 8, 9, 10, 12, 14, 15, 18, 20, 25 cuando dividan a n; si n no
   tiene divisores compuestos ≤ 25 (por ejemplo, n = 2 · 13 · 11), cero distractores. Los
   botones se ordenan de menor a mayor, mezclados con los primos, para que no se vean «los de
   la derecha son trampa». Los distractores no cambian al bajar por la escalera (si dejan de
   dividir al número actual, al pulsarlos sale el mensaje de «no divide», que sigue siendo
   verdad).
3. **Evaluación**: `evaluarEleccion(m, x)` devuelve también `'compuesto'` cuando `x` divide a
   `m` pero no es primo (prioridad: primero «no divide», luego «compuesto», luego «no es el
   menor»). Texto nuevo `razonCompuesto(m, x, idioma)`: «9 divide a 81, pero 9 no es primo
   (9 = 3 · 3): hay que dividir entre un primo» / «9 divides 81, but 9 is not prime (9 = 3 · 3):
   you must divide by a prime». Usa `factorizar`/`htmlFact` de `aritmetica.js` para el
   paréntesis.
4. **Mensaje**: el `#mensaje` se borra al acertar (ya lo hace) y la explicación final sigue
   listando solo los pasos realizados (que ahora son todos correctos) y la factorización.
5. **Instrucción**: se queda («Pulsa el MENOR primo que divide a este número»); si quieres
   reforzarlo, un `detalle` en `textos.js` puede decir «Cuidado: no todos los botones son
   primos» en los dos idiomas (opcional, propónlo).
6. **Tests**: (a) con semilla fija, 1000 ítems: cada distractor divide a n, no es primo y está
   entre 4 y 25; nunca más de dos; nunca coincide con un primo de la lista; (b)
   `evaluarEleccion(81, 9)` → `compuesto`, `(81, 5)` → `no_divide`, `(45, 5)` → `no_menor`,
   `(45, 3)` → `correcto`, `(12, 4)` → `compuesto`, `(12, 6)` → `compuesto`; (c) `razonCompuesto`
   en los dos idiomas con 81 y 9. El DOM no se testea.

## Datos de entrada

Solo lectura: `practicas/_comun/aritmetica.js` (`factorizar`, `htmlFact`, `esPrimo`),
`practicas/_comun/estilos.css` (`.botones-numeros`), las «Reglas de contenido comunes» de
`proyecto.md` (regla 4, de oro: cada distractor tiene que ser inequívocamente erróneo como
«menor primo», y un divisor compuesto lo es).

## Cómo saber que ha terminado

- Tests en verde y `npm test` sin fallos en tus ficheros.
- En el navegador (`npm run servir`, http://localhost:8080/practicas/divisiones/), ejercicio 1,
  en los dos idiomas y a 375 px: con un número como 81 (repite «Siguiente» hasta que salga
  uno con el 9 entre los botones): pulso 5 → mensaje «no divide», el 81 se queda; pulso 9 →
  mensaje «divide pero no es primo», el 81 se queda; pulso 3 → pasa a 27 y el mensaje se
  borra; sigo hasta 1 → fallo (hubo errores), con la escalera 81, 27, 9, 3 en la explicación.
  Un ítem sin errores → acierto. Con ocho botones la fila cabe a 375 px (dos filas si hace
  falta).

## Trampas conocidas

- `avanzar` también decide el final (`m === 1`): al dejar de llamarla en los fallos, comprueba
  que un ítem con n primo (no sale: n ≥ 10 y nunca primo, mira el generador) o con n = 1 no
  se queda colgado.
- `pasoCorrecto(m)` es el menor primo que divide a `m`: no hace falta que esté entre los
  botones si se mantiene la lista 2-13 y los n se generan con esos primos; comprueba que el
  generador no usa primos mayores (mira `nCon11o13`, `nAlAzar`).
- La tarea de la semana 2 (lunes 26-10) lleva divisiones ej. 1 y 2 como ★: esto tiene que
  estar en `main` antes.

## Prohibido (propio de esta tarea)

- Tocar los ejercicios 2 y 3 de la práctica, `practicas/_comun/` o la puntuación.
- Distractores que no dividan a n, o primos fuera de la lista como distractores.
- Avanzar la escalera por el alumno en ningún caso.

## Salida esperada

- Los ficheros de «Ficheros que toca» cambiados y comiteados.
- `reparto-practicas-u2/salidas/48-escalera-sin-avance/ENTREGA.md` (hash, ficheros, cómo
  probarlo en 1 minuto con un n que tenga distractores) y su marcador `ENTREGA.md.ok-<sid>`.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 48, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-48.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/48--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/48--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/48-escalera-sin-avance/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/48--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/48--<sid>.md` con hasta dónde llegaste, la línea
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
