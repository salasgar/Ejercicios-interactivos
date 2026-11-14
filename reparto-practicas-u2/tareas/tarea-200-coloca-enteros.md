# Tarea 200 · Práctica de la unidad 3 «Coloca los paréntesis. Con enteros» (`coloca-enteros`, id 80): todos los resultados con tres números, con una potencia y con división

Actualizado: 2026-11-14 (alta de la coordinadora s-20261114T212714-761c8123, por el encargo de Juan Luis del 14-11; decisiones en `proyecto.md`, «Decisiones del 14-11: colocar paréntesis en la U3, la U4 y la U5»)
Precondición: **199 LISTA** (deja el motor común, la fila 80 del catálogo y el esqueleto de esta carpeta) · `git status --short practicas/coloca-enteros/` vacío · Disparo: MANUAL · **Plazo: vie 27-11** (la 203 la publica antes del jue 3-12; la semana 4 de la U3 empieza el mié 9-12)
Duración esperada: 1 h 15 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: 201, 202 (misma banda, carpetas disjuntas)
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/200-coloca-enteros/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/coloca-enteros/*` (sustituye el esqueleto de la 199: desde que la 199 está LISTA, la dueña de esa carpeta es esta tarea), `tests/practicas-coloca-enteros.test.js` (nuevo), `tests/practicas-ayuda-coloca-enteros.test.js` (nuevo)

La duración esperada no es informativa: de ella sale la caducidad del reclamo (2 ×), el plazo tras el cual otra
sesión puede relevarte si te cortas. **Este fichero es la fuente de la banda**: el tablón la copia de aquí cada vez que
se regenera. La tabla de bandas de `proyecto.md` la traduce al menú de hoy (ALTO = Opus 5.5, esfuerzo Alto; MEDIO =
Sonnet 5.5, esfuerzo Medio).

## Antes de empezar

Todas las rutas son relativas a la raíz del repositorio (`/Users/salasgar/Documents/git/Ejercicios-interactivos`).
`R=reparto-practicas-u2`. Las sesiones de este reparto trabajan en ese árbol, no en un worktree.

1. Lee `$R/proyecto.md` (al menos «Dónde está cada cosa», «Reglas de contenido comunes», **«Reglas de contenido de la unidad 3»** y
   **«Decisiones del 14-11: colocar paréntesis en la U3, la U4 y la U5»**), `$R/_ESTADO.md`, `docs/no-lo-se.md`, la **ENTREGA de la
   199** (`$R/salidas/199-motor-coloca-parentesis/ENTREGA.md`: la API real del motor y de la pantalla) y lista `$R/hechos/`
   (`ls $R/hechos/*/`): la carpeta manda sobre la tabla.
2. `date -u` para la hora de verdad. `git fetch origin && git status -sb`; si hay commits que traer, `git pull --rebase origin main`
   (nunca `--autostash`). **Comprueba la precondición en el disco**: `ls $R/hechos/terminadas/ | grep '^199--'` y
   `git status --short practicas/coloca-enteros/ tests/practicas-coloca-enteros.test.js tests/practicas-ayuda-coloca-enteros.test.js`
   **vacío**. Si algo sale modificado, es trabajo de otra sesión: no lo toques y no reclames.
3. Abre tu reclamo generando el sid **en el mismo comando** (probado en este Mac):
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -v+150M +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 200\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/200--$sid.md; echo $sid
   ```
   (150 min = 2 × la duración esperada). Tu sid es el del nombre de ese fichero; no lo guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/ | grep '^200--'` — el comando, no la intención. Si hay otro reclamo vivo de la 200 con
   `abierto:` más antiguo (o igual y sid menor), añade a tu reclamo `CEDIDA a <sid del otro>` y para.
5. Si el reclamo que encuentras está caducado (RELEVABLE), relévalo con `releva a: <sid anterior>` **en tu propio reclamo**. Mira
   qué dejó hecho (`git log --oneline -8`, `git status -sb`, su carpeta de salida): lo comiteado con tests en verde se hereda y se
   dice en la terminada; lo demás se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** con el guion (`$R/hechos/notas/s-20261111T215225-39c1f4f5-regenerar-tablon.py`,
   ver su cabecera) y sigue con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/200--<sid>.md`) al terminar cada
paso grande. Si vas a tardar más de lo que te queda, añade antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`).
Tras cualquier pausa: `date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de `$R/hechos/reclamos/*.md`; si te han
relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

La práctica «Coloca los paréntesis» de la U1 (`parentesis`; pruébala antes:
https://salasgar.github.io/Ejercicios-interactivos/practicas/parentesis/?ejercicio=1&probar=1), con enteros. Juan Luis: «Los
ejercicios de colocar paréntesis me gustan mucho». El alumno ve una operación como −4 · 3 + 7, toca los huecos de los lados de cada
número para poner y quitar paréntesis, ve la resolución línea a línea y enciende uno a uno **todos los resultados posibles**. Con
enteros cambia una cosa que conviene que se vea: **la resta ya siempre se puede** (4 − 6 = −2), así que los paréntesis dan
negativos, y un negativo detrás de una operación se escribe entre paréntesis (`8 : (−4)`, `5 − (−3)`); la división sigue sin poder
ser inexacta.

Sin diana: el «coloca un par de paréntesis para que dé N» (U3-4A-04) ya es el ej. 5 de `parentesis-enteros`.

## Qué hay que hacer

Sobre el motor y la pantalla de la 199 (`_comun/parentesis-motor.js`, `parentesis-pantalla.js`, `parentesis-textos.js`), con
`aritmeticaEnteros`. Tres ejercicios, los tres «encuentra todos» (`objetivo: 5, penalizacion: 0`, como los tres primeros de la U1):

| Ej. | Nombre (es / en) | Expresión | Resultados distintos | Árboles inválidos |
|---|---|---|---|---|
| 1 | Tres números / Three numbers | a ∘ b ∘ c; el primero, de −9 a 9 sin el 0 (negativo la mitad de las veces); b y c, de 2 a 9; las dos operaciones, de + − ·, con un · al menos, o − − , o − + | exactamente 2 | ninguno |
| 2 | Con una potencia / With a power | a ∘ b ∘ c² (³ en un 15 %); a de −9 a 9 sin el 0, b de 2 a 6, c de 2 a 5; operaciones de + − · | de 3 a 5 | ninguno |
| 3 | Con división / With division | cuatro números; el primero, de −12 a 12 sin el 0; los demás, de 2 a 12; operaciones de + − · :, con un «:» al menos | de 3 a 6 | al menos uno (`inexacta` o `cero`) |

- **Cota de tamaño**: todo valor, intermedio o final, entre −200 y 200 (como `parentesis-enteros`); un árbol que se pase es
  `grande` y la expresión se descarta (nunca un `grande` a la vista). La potencia, de un número o de un grupo; en el ej. 2, **al
  menos el 40 % de los ítems** tiene alguna agrupación que eleva un negativo (`(−2)²`, `(3 − 5)³`): es U3-3C-10 y la razón de ser
  del ejercicio. Mídelo.
- **Lo que no se ha dado no sale** (reglas de la unidad 3): solo el primer número puede ser negativo, y se escribe sin paréntesis
  (`−3 + 2 · 4`); nunca `(+5)` ni `+8`; un negativo que aparezca en un paso detrás de una operación, entre paréntesis; la base
  negativa de una potencia, entre paréntesis (`(−2)²`; **nunca** `−2²`, que es otro número); el menos, U+2212; producto `·`,
  división `:` en español y `÷` en inglés, como la U1.
- **«No se puede»** (ej. 3), con los números del ítem: `−7 : 2` no da un número entero; entre 0 no se divide. La introducción del ej. 3
  dice la diferencia con la U1: allí 8 − 15 no se podía; con enteros, sí (da −7).
- **No repetir el ítem anterior** (`sesion.anterior`) y **variedad**: ningún ítem en más del 10 % de 20 000 de un ejercicio, y las
  caídas en la reserva de `buscar`, por debajo del 1 %.
- **Casos del papel, fuera**: ningún ítem puede tener la misma cuenta sin paréntesis (números en orden, operaciones y exponente) que
  un caso de combinada con paréntesis o de «coloca paréntesis» de las hojas de la U3, del banco de ejercicios, de los exámenes
  semanales 3 y 4 y de los `.tex` del final (modelos 1 y 2, `adaptado-A`, `modelo1-dislexia`, `recuperacion`). Los de las hojas
  pueden ir en claro; **los de los exámenes, solo por huella FNV-1a calculada fuera del repositorio** (el modelo es
  `HUELLAS_EXAMEN` de `practicas/multiplica-divide-decimales/logica.js`). En la ENTREGA, solo recuentos.
- **Introducciones y textos** en `textos.js` (`{ es, en }`; «brackets» en inglés, como la U1), y la **explicación del «No lo
  sé»** de cada ejercicio (`docs/no-lo-se.md`): todas las agrupaciones con su resultado y, en el ej. 3, una que no se puede y por
  qué; `noLoSe: { es: 'No sé hacerlo', en: 'I don’t know how' }`, como la U1.
- **Tests**:
  - `tests/practicas-coloca-enteros.test.js`: 2000 ítems por ejercicio con las cotas de la tabla (números, operaciones, número de
    resultados, inválidos, |valor| ≤ 200, el 40 % de base negativa del ej. 2); **alcanzables** (para 200 ítems por ejercicio,
    todas las colocaciones del editor dan exactamente los chips: ni sobra ni falta ninguno); escritura (ningún «− −», «· −» ni
    «: −» sin paréntesis, ningún `−2²` en un paso, el menos U+2212); no repite el anterior; ningún caso del papel (por huella);
    caídas en la reserva < 1 %.
  - `tests/practicas-ayuda-coloca-enteros.test.js`: 1000 ítems por ejercicio y en los dos idiomas; la explicación lleva todos los
    resultados del ítem, calculados con el motor (no copiados de la explicación).
  - Fuera del test, un barrido de 20 000 ítems por ejercicio en tu scratchpad para la variedad; el resultado, en la ENTREGA.
- **En el navegador** (`npm run servir` o tu propio puerto; `?probar=1&ejercicio=N`), con clics de ratón, a 375 px y a 1200 px,
  en español y en inglés: un ítem de cada ejercicio hasta encender todos, una pista, el borrar, un paréntesis sin cerrar, una
  agrupación que no se puede (ej. 3) y el «No lo sé» una vez en cada ejercicio; consola limpia. Que la expresión de cuatro números
  con un negativo delante quepa en una línea a 375 px.

## Datos de entrada

- La ENTREGA de la 199 (API), `practicas/parentesis/` (el modelo; solo lectura), `practicas/parentesis-enteros/` (para no
  pisar su ej. 5; solo lectura), `practicas/_comun/enteros.js` (`fmt`, `MENOS`).
- Carpeta de la unidad, solo lectura: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/3. Integers/`
  — `inventario-unidad3.tsv` (U3-3A-01, 3C-10, 3C-16, 4A-04, 4A-06 y sus errores típicos), `hojas-de-ejercicios/`,
  `exámenes-semanales/semana-{3,4}/`, `examen-final/*.tex`, `hojas-de-ejercicios/banco-ejercicios-unidad3.tex`.

## Cómo saber que ha terminado

- Los tres ejercicios hechos con las cotas de la tabla, los dos tests nuevos y `npm test` en verde, comiteado y empujado.
  La práctica sigue con `disponible: false` (la publica la 203) y funciona por URL:
  https://salasgar.github.io/Ejercicios-interactivos/practicas/coloca-enteros/?probar=1
- La ENTREGA dice las cotas finales, los recuentos (barrido, variedad, casos del papel excluidos, base negativa del ej. 2) y cómo se
  probó en el navegador, para que la 203 la revise con clics.

## Trampas conocidas

- (de la coordinadora) `(−3 + 1)²`: cuando el grupo se queda en un número, el paso tiene que escribir `(−2)²`, nunca `−2²`. Lo
  resuelve el motor de la 199; compruébalo igual en tu test de escritura.
- (de la coordinadora) Con el primer número negativo, el hueco «(» de su izquierda vale: `(−3 + 2) · 4`. Un paréntesis solo
  alrededor de −3 no agrupa nada y tiene que salir «no agrupan».
- (de la 19) Dos agrupaciones pueden dar el mismo valor: se cuentan una vez (chips por valor).
- (de la 88) `.cuenta` no se parte (`nowrap`): las frases del feedback, como texto normal, o se salen de 375 px.
- (de la coordinadora) Hay hasta doce sesiones en este árbol: no metas en tu commit nada que no sea tuyo, y nada de `git stash`.

## Prohibido (propio de esta tarea)

- Tocar `practicas/_comun/` (el motor es de la 199; si le falta algo, propuesta en la terminada), `catalogo.js` (ni el
  `disponible`), `practicas/parentesis/` o `practicas/parentesis-enteros/`.
- Escribir un caso de examen en claro (en el código, un test, la ENTREGA o un mensaje de commit).

## Reglas de contenido de la unidad 3

Las de `proyecto.md`, «Reglas de contenido de la unidad 3», que se leen enteras. Lo que más se mira aquí: sin paréntesis al empezar
y nunca `(+5)`; el negativo que no va el primero, entre paréntesis; la potencia de base negativa con su paréntesis; nada de
fracciones ni decimales (una división inexacta **no se puede**, no da «3,5»); el menos U+2212; inglés sencillo; feedback con los
números del ítem.

## Si la sesión se alarga

Si no te cabe todo, comitea lo que esté con tests en verde (la práctica no está publicada: no la ve ningún alumno), escribe
`$R/hechos/fallos/200--<sid>.md` con lo que queda y `parada por: sesión agotada`, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

No recortes tú. Termina lo que quepa, escribe `$R/hechos/incidencias/<sid>.md` (tamaño real y dónde está el corte natural),
`$R/hechos/fallos/200--<sid>.md` con `parada por: mal cortada`, `ABANDONADA` en tu reclamo, y díselo a Juan Luis. Si un paso te
pide **decidir** algo que va a durar (otras cotas, otro número de ejercicios), no lo decidas: hallazgo para la coordinadora en la
terminada, y sigue con lo demás.

## Al terminar

1. `node --test tests/practicas-coloca-enteros.test.js tests/practicas-ayuda-coloca-enteros.test.js tests/practicas-parentesis-motor.test.js tests/practicas-no-lo-se.test.js tests/practicas-comun.test.js`
   en verde y `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con reclamo vivo no es tuyo: anótalo en la terminada).
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas y en la misma orden:
   `git add <rutas> && git commit -m "Coloca los paréntesis con enteros (tarea 200, U3)" -- <rutas>`. Apunta el hash.
3. Escribe `$R/salidas/200-coloca-enteros/ENTREGA.md` y su marcador vacío `ENTREGA.md.ok-<sid>`: **lo hecho** (ejercicios, cotas,
   hash, recuentos, cómo se probó) y **hallazgos fuera de criterio**, para la coordinadora. Nunca un caso de examen en claro.
4. Escribe `$R/hechos/terminadas/200--<sid>.md`: hash, ficheros (lo que dice `git show --stat`), tests, hora y **duración real**.
   Si queda algo sin hacer, empieza por `PARCIAL:` y di qué.
5. Añade `CERRADA` a tu reclamo (línea propia que empieza por esa palabra).
6. Choques encontrados → `$R/hechos/incidencias/<sid>.md`.
7. `git fetch origin`, relista `$R/hechos/` **ahora** y regenera `$R/_ESTADO.md` entero con el guion (la 203 pasa a PENDIENTE).
8. Vuelca en «Trampas conocidas» lo que hayas aprendido por las malas (es lo único de la ficha que editas, además de la duración).
9. Un solo commit con rutas explícitas de tus ficheros de `$R/hechos/` (por sid), tu carpeta de `$R/salidas/`, `$R/_ESTADO.md` y esta
   ficha, y `git push origin main`. Si el push se rechaza: `git pull --rebase origin main` (nunca `--autostash`), regenera el tablón
   otra vez desde `hechos/` y vuelve a comitear y empujar.
10. Dile al usuario la **foto del momento** en tres líneas («EN CURSO: … · LIBRES ahora: … · BLOQUEADAS: …») y, solo para las LIBRES,
    las frases de arranque de `proyecto.md`. Decide si encadenas la 201 o la 202 (solo en verde: misma banda, precondición cumplida,
    sin reclamo vivo); si encadenas, «Antes de empezar» entero otra vez, con reclamo nuevo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `practicas/_comun/`, ni `tests/practicas-no-lo-se.test.js`, ni `docs/`,
  ni `catalogo.js`, ni `css/`, ni `README.md`, ni `firestore.rules`, ni fichas ajenas, ni nada de la carpeta de apuntes de iCloud.
- `git add .`, `git add -A`, `git commit -a`, o un `add` separado del `commit`. El índice es compartido con otras sesiones del mismo
  árbol. Nunca `git stash`, `--autostash`, `git checkout -- .` ni `git reset --hard`.
- Editar el código con `sed -i` o heredocs desde el shell: el candado de sesiones solo ve Edit/Write. El código se edita con las
  herramientas de edición; `hechos/` sí se escribe desde el shell (un escritor).
- Reescribir un fichero de `hechos/` (solo `>>`), editar un reclamo ajeno, o regenerar el tablón de memoria.
- Dependencias nuevas (npm, CDN). Nombres de alumnos reales en ningún fichero.
