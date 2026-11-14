# Tarea 201 · Práctica de la unidad 4 «Coloca los paréntesis. Con fracciones» (`coloca-fracciones`, id 81): todos los resultados con tres números, con división, y una diana

Actualizado: 2026-11-14 (alta de la coordinadora s-20261114T212714-761c8123, por el encargo de Juan Luis del 14-11; decisiones en `proyecto.md`, «Decisiones del 14-11: colocar paréntesis en la U3, la U4 y la U5»)
Precondición: **199 LISTA** (deja el motor común, la fila 81 del catálogo y el esqueleto de esta carpeta) · `git status --short practicas/coloca-fracciones/` vacío · Disparo: MANUAL · **Plazo: vie 18-12** (la 204 la publica antes del mar 22-12; las combinadas de la U4 son de la sesión 10, semana 3, desde el lun 11-1)
Duración esperada: 1 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: 200, 202 (misma banda, carpetas disjuntas)
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/201-coloca-fracciones/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/coloca-fracciones/*` (sustituye el esqueleto de la 199: desde que la 199 está LISTA, la dueña de esa carpeta es esta tarea), `tests/practicas-coloca-fracciones.test.js` (nuevo), `tests/practicas-ayuda-coloca-fracciones.test.js` (nuevo)

La duración esperada no es informativa: de ella sale la caducidad del reclamo (2 ×), el plazo tras el cual otra
sesión puede relevarte si te cortas. **Este fichero es la fuente de la banda**: el tablón la copia de aquí cada vez que
se regenera. La tabla de bandas de `proyecto.md` la traduce al menú de hoy (ALTO = Opus 5.5, esfuerzo Alto; MEDIO =
Sonnet 5.5, esfuerzo Medio).

## Antes de empezar

Todas las rutas son relativas a la raíz del repositorio (`/Users/salasgar/Documents/git/Ejercicios-interactivos`).
`R=reparto-practicas-u2`. Las sesiones de este reparto trabajan en ese árbol, no en un worktree.

1. Lee `$R/proyecto.md` (al menos «Dónde está cada cosa», «Reglas de contenido comunes», «Tareas 98-114» con sus reglas de la
   unidad 4 y **«Decisiones del 14-11: colocar paréntesis en la U3, la U4 y la U5»**), `$R/_ESTADO.md`, `docs/no-lo-se.md`, la
   **ENTREGA de la 199** (`$R/salidas/199-motor-coloca-parentesis/ENTREGA.md`: la API real del motor y de la pantalla, y la medida
   del editor con fracciones a 375 px), la sección «Reglas de contenido de la unidad 4» de `$R/tareas/tarea-106-combinadas-fracciones.md`
   y lista `$R/hechos/` (`ls $R/hechos/*/`): la carpeta manda sobre la tabla.
2. `date -u` para la hora de verdad. `git fetch origin && git status -sb`; si hay commits que traer, `git pull --rebase origin main`
   (nunca `--autostash`). **Comprueba la precondición en el disco**: `ls $R/hechos/terminadas/ | grep '^199--'` y
   `git status --short practicas/coloca-fracciones/ tests/practicas-coloca-fracciones.test.js tests/practicas-ayuda-coloca-fracciones.test.js`
   **vacío**. Si algo sale modificado, es trabajo de otra sesión: no lo toques y no reclames.
3. Abre tu reclamo generando el sid **en el mismo comando** (probado en este Mac):
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -v+180M +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 201\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/201--$sid.md; echo $sid
   ```
   (180 min = 2 × la duración esperada). Tu sid es el del nombre de ese fichero; no lo guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/ | grep '^201--'` — el comando, no la intención. Si hay otro reclamo vivo de la 201 con
   `abierto:` más antiguo (o igual y sid menor), añade a tu reclamo `CEDIDA a <sid del otro>` y para.
5. Si el reclamo que encuentras está caducado (RELEVABLE), relévalo con `releva a: <sid anterior>` **en tu propio reclamo**. Mira
   qué dejó hecho (`git log --oneline -8`, `git status -sb`, su carpeta de salida): lo comiteado con tests en verde se hereda y se
   dice en la terminada; lo demás se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** con el guion (`$R/hechos/notas/s-20261111T215225-39c1f4f5-regenerar-tablon.py`,
   ver su cabecera) y sigue con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/201--<sid>.md`) al terminar cada
paso grande. Si vas a tardar más de lo que te queda, añade antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`).
Tras cualquier pausa: `date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de `$R/hechos/reclamos/*.md`; si te han
relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

La práctica «Coloca los paréntesis» de la U1 (`parentesis`; pruébala antes:
https://salasgar.github.io/Ejercicios-interactivos/practicas/parentesis/?ejercicio=1&probar=1), con fracciones. Juan Luis: «Los
ejercicios de colocar paréntesis me gustan mucho». El alumno ve una combinada como 5/6 − 2/3 : 4 + 1/2 (con raya), coloca
paréntesis, ve la resolución línea a línea y enciende **todos los resultados posibles**. Con fracciones todo se puede calcular
(salvo dividir entre 0, que el generador evita): lo que se ve es cuánto cambia el resultado según el paréntesis, que es lo que
practican U4-3A-01 y U4-3A-02 (y, con un negativo delante, U4-3C-10). La diana obliga a calcular de verdad, con fallo y feedback.

## Qué hay que hacer

Sobre el motor y la pantalla de la 199, con `aritmeticaFracciones`. Tres ejercicios: dos «encuentra todos» (`objetivo: 5,
penalizacion: 0`) y una diana (normal, con fallos):

| Ej. | Nombre (es / en) | Expresión | Resultados distintos |
|---|---|---|---|
| 1 | Tres números / Three numbers | tres operandos, operaciones de + − ·, con un · al menos | exactamente 2 |
| 2 | Con división / With division | cuatro operandos, operaciones de + − · :, con un «:» al menos | de 3 a 5 |
| 3 | Una sola diana / One target | cuatro operandos, operaciones de + − · : | al menos 3; el objetivo, uno que **no** sea el de sin paréntesis |

- **Operandos**: fracciones con denominador de 2 a 6 (y 8, 10 o 12 de vez en cuando), numerador de 1 a 2 · denominador − 1, nunca
  múltiplo del denominador, escritas irreducibles; y naturales de 2 a 5 (como mucho uno en el ej. 1 y dos en los ej. 2 y 3; al
  menos dos fracciones en cada ítem). **Solo el primero puede ser negativo** (en un 30 % de los ítems, como `combinadas-fracciones`):
  `−1/2 + 1/3 · 3`, nunca `(−1/2)` al empezar.
- **Cotas** (todo valor, intermedio o final, en su forma irreducible): denominador ≤ 36 y numerador entre −60 y 60. Un árbol que se
  pase es `grande` y **la expresión se descarta**; un árbol que divida entre 0, también. En esta práctica **no hay agrupaciones
  imposibles a la vista**: todas las de un ítem se pueden calcular. (Si las cotas dejan el generador sin variedad, ajústalas y
  dilo en la ENTREGA con los recuentos.)
- **Escritura**: fracciones **con raya** (`htmlFraccion`; en los chips, compacta), nunca con barra; resultados **irreducibles** y
  un entero como entero (2, no 2/1); cada paso, una operación, con su resultado ya simplificado; un negativo detrás de una operación,
  entre paréntesis (`1/2 · (−1/3)`); el menos U+2212; producto `·`, división `:` en español y `÷` en inglés.
- **Ni potencias** (en la U4 solo de base positiva y sueltas, U4-2C-12; la combinada con potencias no es una destreza de la unidad y
  `combinadas-fracciones` tampoco las mezcla), **ni decimales, ni números mixtos**.
- **Regla de oro, versión fracciones**: dos fracciones equivalentes son **la misma respuesta** (3/4 y 6/8, un solo chip; en la diana,
  vale cualquier colocación que dé el objetivo, escrita como sea). Lo garantiza el motor por valor; tu test lo comprueba.
- **No repetir el ítem anterior** (`sesion.anterior`) y **variedad**: ningún ítem en más del 10 % de 20 000 de un ejercicio, y las
  caídas en la reserva de `buscar`, por debajo del 1 %.
- **Casos del papel, fuera**: ningún ítem puede tener la misma cuenta sin paréntesis (operandos en orden, con su signo, y
  operaciones) que una combinada de las hojas de la U4 (`hoja-unidad4-semana{1,2,3}.tex`, `banco-ejercicios-unidad4.tex`), de los
  exámenes semanales (`examen-u4-semanaN*.tex`: se renombraron el 9-11) o de los `.tex` del final (modelos 1 y 2, `adaptado-A`,
  `recuperacion`). Hojas en claro o por huella; **exámenes, solo por huella FNV-1a calculada fuera del repositorio** (modelo:
  `HUELLAS_EXAMEN_COMBINADAS` de `practicas/combinadas-fracciones/logica.js`, que además ya tiene las claves de su hoja). En la
  ENTREGA, solo recuentos. Ojo: los ejemplos del inventario (columna `ejemplo` de U4-3A-01, 3A-02 y 3C-10) son los de clase: **tampoco pueden salir**.
- **Introducciones, textos y «No lo sé»** en `textos.js` (`{ es, en }`; «brackets» en inglés): en los «todos», todas las agrupaciones
  con su resultado; en la diana, una colocación que da el objetivo y su resolución (`noLoSe: { es: 'No sé hacerlo', en: 'I don’t know how' }`).
  El feedback de un fallo en la diana: qué da lo que ha puesto el alumno (con sus pasos) y una colocación que sí da el objetivo.
- **El ancho**: cuatro fracciones con sus ocho huecos tienen que caber en una línea a 375 px (la 199 deja la medida). Si no caben,
  arréglalo en el `estilos.css` de la práctica (huecos más estrechos en pantallas pequeñas, raya compacta), nunca en `_comun`.
- **Tests**:
  - `tests/practicas-coloca-fracciones.test.js`: 2000 ítems por ejercicio con las cotas (operandos, operaciones, número de
    resultados, ningún árbol inválido, denominador ≤ 36 y |numerador| ≤ 60 en todos los pasos, solo el primero negativo, el 30 %);
    **alcanzables** (para 200 ítems por ejercicio, todas las colocaciones del editor dan exactamente los chips); **ningún par de
    chips equivalentes** y todos irreducibles; la diana con objetivo alcanzable y distinto del de sin paréntesis; no repite el
    anterior; ningún caso del papel (por huella); caídas en la reserva < 1 %; sin «×» ni barra «/» a la vista.
  - `tests/practicas-ayuda-coloca-fracciones.test.js`: 1000 ítems por ejercicio y en los dos idiomas; la explicación lleva los
    resultados del ítem (o, en la diana, el objetivo y una colocación que lo da), calculados con el motor, con `htmlFraccion`.
  - Fuera del test, un barrido de 20 000 ítems por ejercicio en tu scratchpad para la variedad; el resultado, en la ENTREGA.
- **En el navegador** (`?probar=1&ejercicio=N`), con clics de ratón, a 375 px y a 1200 px, en español y en inglés: un ítem de cada
  «todos» hasta encender todos, una pista, el borrar, un paréntesis sin cerrar; en la diana, un acierto y un fallo; el «No lo sé» una
  vez en cada ejercicio; consola limpia.

## Datos de entrada

- La ENTREGA de la 199 (API y medida a 375 px), `practicas/parentesis/` (el modelo), `practicas/combinadas-fracciones/` (huellas,
  hoja y estilo de la U4; solo lectura), `practicas/_comun/fracciones.js` (`Fraccion`, `htmlFraccion`, `htmlCuenta`).
- Carpeta de la unidad, solo lectura: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/4. Fractions/`
  — `inventario-unidad4.tsv` y el acta `inventario-unidad4-revision.md` (U4-3A-01, 3A-02, 3C-10; fracciones negativas; ni decimales
  ni mixtos), `hojas-de-ejercicios/`, `exámenes-semanales/semana-{1,2,3}/`, `examen-final/*.tex`.

## Cómo saber que ha terminado

- Los tres ejercicios con las cotas de la tabla, los dos tests nuevos y `npm test` en verde, comiteado y empujado. La práctica sigue
  con `disponible: false` (la publica la 204) y funciona por URL:
  https://salasgar.github.io/Ejercicios-interactivos/practicas/coloca-fracciones/?probar=1 (la portada no enseña la U4 hasta el 14-12).
- La ENTREGA dice las cotas finales, los recuentos (barrido, variedad, casos del papel excluidos), la medida a 375 px y cómo se probó
  en el navegador, para que la 204 la revise con clics.

## Trampas conocidas

- (de la coordinadora) **3/4 y 6/8 son el mismo chip.** Si algo compara fracciones con `===`, con `Number` o por su texto sin
  simplificar, salen dos chips iguales: la regla de oro de la unidad. Compara por valor con `_comun/fracciones.js`.
- (de la coordinadora) Un grupo que da 0 delante de un «:» hace imposible esa agrupación: el generador descarta la expresión entera
  (no hay imposibles a la vista en la U4). Con un natural y una resta (`2 − 4/2`) pasa más de lo que parece.
- (de la 117-120) **Los casos de examen no se escriben en claro en el repositorio**, ni en un comentario ni en un test ni en la ENTREGA.
  Y un ejemplo inventado puede ser un caso de examen: antes de comitear, busca tus ejemplos en las claves.
- (de la coordinadora, 11-11) Los `.tex` de los exámenes semanales de la U4 se llaman `examen-u4-semanaN*.tex` desde el 9-11: un guion
  con los nombres viejos no lee ninguno y da cero coincidencias sin avisar. Cuenta los casos que lee de cada fichero.
- (de la 88) `.cuenta` no se parte (`nowrap`): las frases del feedback, como texto normal, o se salen de 375 px.
- (de la coordinadora) Hay varias sesiones en este árbol: no metas en tu commit nada que no sea tuyo, y nada de `git stash`.

## Prohibido (propio de esta tarea)

- Tocar `practicas/_comun/` (el motor es de la 199; si le falta algo, propuesta en la terminada), `catalogo.js` (ni el
  `disponible`), `practicas/parentesis/` o `practicas/combinadas-fracciones/`.
- Potencias, decimales, números mixtos, la barra «/» a la vista.
- Escribir un caso de examen en claro (en el código, un test, la ENTREGA o un mensaje de commit).

## Reglas de contenido de la unidad 4

Las de la ficha 106 (`$R/tareas/tarea-106-combinadas-fracciones.md`, «Reglas de contenido de la unidad 4»), que **se leen enteras
antes de empezar**; si discrepan del acta (`4. Fractions/inventario-unidad4-revision.md`), manda el acta. Lo que más se mira aquí:
dos fracciones equivalentes son la misma respuesta; resultados irreducibles con raya; fracciones negativas sí (semana 3), sin
paréntesis al empezar; ni decimales ni números mixtos; inglés sencillo; feedback con los números del ítem; los casos del papel, fuera.

## Si la sesión se alarga

Si no te cabe todo, comitea lo que esté con tests en verde (la práctica no está publicada), escribe `$R/hechos/fallos/201--<sid>.md`
con lo que queda y `parada por: sesión agotada`, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

No recortes tú. Termina lo que quepa, escribe `$R/hechos/incidencias/<sid>.md` (tamaño real y dónde está el corte natural),
`$R/hechos/fallos/201--<sid>.md` con `parada por: mal cortada`, `ABANDONADA` en tu reclamo, y díselo a Juan Luis. Si un paso te
pide **decidir** algo que va a durar (otras cotas, otro número de ejercicios, potencias), no lo decidas: hallazgo para la
coordinadora en la terminada, y sigue con lo demás.

## Al terminar

1. `node --test tests/practicas-coloca-fracciones.test.js tests/practicas-ayuda-coloca-fracciones.test.js tests/practicas-parentesis-motor.test.js tests/practicas-no-lo-se.test.js tests/practicas-comun.test.js`
   en verde y `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con reclamo vivo no es tuyo: anótalo en la terminada).
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas y en la misma orden:
   `git add <rutas> && git commit -m "Coloca los paréntesis con fracciones (tarea 201, U4)" -- <rutas>`. Apunta el hash.
3. Escribe `$R/salidas/201-coloca-fracciones/ENTREGA.md` y su marcador vacío `ENTREGA.md.ok-<sid>`: **lo hecho** (ejercicios, cotas,
   hash, recuentos, medida, cómo se probó) y **hallazgos fuera de criterio**, para la coordinadora. Nunca un caso de examen en claro.
4. Escribe `$R/hechos/terminadas/201--<sid>.md`: hash, ficheros (lo que dice `git show --stat`), tests, hora y **duración real**.
   Si queda algo sin hacer, empieza por `PARCIAL:` y di qué.
5. Añade `CERRADA` a tu reclamo (línea propia que empieza por esa palabra).
6. Choques encontrados → `$R/hechos/incidencias/<sid>.md`.
7. `git fetch origin`, relista `$R/hechos/` **ahora** y regenera `$R/_ESTADO.md` entero con el guion.
8. Vuelca en «Trampas conocidas» lo que hayas aprendido por las malas (es lo único de la ficha que editas, además de la duración).
9. Un solo commit con rutas explícitas de tus ficheros de `$R/hechos/` (por sid), tu carpeta de `$R/salidas/`, `$R/_ESTADO.md` y esta
   ficha, y `git push origin main`. Si el push se rechaza: `git pull --rebase origin main` (nunca `--autostash`), regenera el tablón
   otra vez desde `hechos/` y vuelve a comitear y empujar.
10. Dile al usuario la **foto del momento** en tres líneas («EN CURSO: … · LIBRES ahora: … · BLOQUEADAS: …») y, solo para las LIBRES,
    las frases de arranque de `proyecto.md`. Decide si encadenas la 200 o la 202 (solo en verde: misma banda, precondición cumplida,
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
