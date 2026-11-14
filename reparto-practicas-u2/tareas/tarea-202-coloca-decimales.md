# Tarea 202 · Práctica de la unidad 5 «Coloca los paréntesis. Con decimales» (`coloca-decimales`, id 82): todos los resultados con tres números, con un cuadrado, y una diana

Actualizado: 2026-11-14 (alta de la coordinadora s-20261114T212714-761c8123, por el encargo de Juan Luis del 14-11; decisiones en `proyecto.md`, «Decisiones del 14-11: colocar paréntesis en la U3, la U4 y la U5»)
Precondición: **199 LISTA** (deja el motor común, la fila 82 del catálogo y el esqueleto de esta carpeta) · `git status --short practicas/coloca-decimales/` vacío · Disparo: MANUAL · **Plazo: vie 18-12** (la 204 la publica, con la de la U4, antes del mar 22-12; límite jue 21-1: las combinadas de la U5 son de la sesión 6, mar 26-1)
Duración esperada: 1 h 15 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: 200, 201 (misma banda, carpetas disjuntas)
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/202-coloca-decimales/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/coloca-decimales/*` (sustituye el esqueleto de la 199: desde que la 199 está LISTA, la dueña de esa carpeta es esta tarea), `tests/practicas-coloca-decimales.test.js` (nuevo), `tests/practicas-ayuda-coloca-decimales.test.js` (nuevo)

La duración esperada no es informativa: de ella sale la caducidad del reclamo (2 ×), el plazo tras el cual otra
sesión puede relevarte si te cortas. **Este fichero es la fuente de la banda**: el tablón la copia de aquí cada vez que
se regenera. La tabla de bandas de `proyecto.md` la traduce al menú de hoy (ALTO = Opus 5.5, esfuerzo Alto; MEDIO =
Sonnet 5.5, esfuerzo Medio).

## Antes de empezar

Todas las rutas son relativas a la raíz del repositorio (`/Users/salasgar/Documents/git/Ejercicios-interactivos`).
`R=reparto-practicas-u2`. Las sesiones de este reparto trabajan en ese árbol, no en un worktree.

1. Lee `$R/proyecto.md` (al menos «Dónde está cada cosa», «Reglas de contenido comunes», «Tareas 122-133» y **«Decisiones del 14-11:
   colocar paréntesis en la U3, la U4 y la U5»**), `$R/_ESTADO.md`, `docs/no-lo-se.md`, la **ENTREGA de la 199**
   (`$R/salidas/199-motor-coloca-parentesis/ENTREGA.md`: la API real del motor y de la pantalla), la sección «Reglas de contenido de la
   unidad 5» de `$R/tareas/tarea-130-publicar-u5-semana1.md` y lista `$R/hechos/` (`ls $R/hechos/*/`): la carpeta manda sobre la tabla.
2. `date -u` para la hora de verdad. `git fetch origin && git status -sb`; si hay commits que traer, `git pull --rebase origin main`
   (nunca `--autostash`). **Comprueba la precondición en el disco**: `ls $R/hechos/terminadas/ | grep '^199--'` y
   `git status --short practicas/coloca-decimales/ tests/practicas-coloca-decimales.test.js tests/practicas-ayuda-coloca-decimales.test.js`
   **vacío**. Si algo sale modificado, es trabajo de otra sesión: no lo toques y no reclames.
3. Abre tu reclamo generando el sid **en el mismo comando** (probado en este Mac):
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -v+150M +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 202\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/202--$sid.md; echo $sid
   ```
   (150 min = 2 × la duración esperada). Tu sid es el del nombre de ese fichero; no lo guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/ | grep '^202--'` — el comando, no la intención. Si hay otro reclamo vivo de la 202 con
   `abierto:` más antiguo (o igual y sid menor), añade a tu reclamo `CEDIDA a <sid del otro>` y para.
5. Si el reclamo que encuentras está caducado (RELEVABLE), relévalo con `releva a: <sid anterior>` **en tu propio reclamo**. Mira
   qué dejó hecho (`git log --oneline -8`, `git status -sb`, su carpeta de salida): lo comiteado con tests en verde se hereda y se
   dice en la terminada; lo demás se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** con el guion (`$R/hechos/notas/s-20261111T215225-39c1f4f5-regenerar-tablon.py`,
   ver su cabecera) y sigue con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/202--<sid>.md`) al terminar cada
paso grande. Si vas a tardar más de lo que te queda, añade antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`).
Tras cualquier pausa: `date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de `$R/hechos/reclamos/*.md`; si te han
relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

La práctica «Coloca los paréntesis» de la U1 (`parentesis`; pruébala antes:
https://salasgar.github.io/Ejercicios-interactivos/practicas/parentesis/?ejercicio=1&probar=1), con decimales. Juan Luis: «Los
ejercicios de colocar paréntesis me gustan mucho». El alumno ve una combinada como 3,6 − 0,8 · 2, coloca paréntesis, ve la
resolución línea a línea y enciende **todos los resultados posibles** (U5-2C-14 y 2C-15); con un cuadrado al final, ve que el
exponente se aplica a lo que tiene delante (U5-2C-13: 0,4² frente a (1,1 + 0,4)²); y en la diana calcula de verdad, con fallo y
feedback.

## Qué hay que hacer

Sobre el motor y la pantalla de la 199, con `aritmeticaDecimales({ cifras: 3, negativos: false, … })`. Tres ejercicios: dos
«encuentra todos» (`objetivo: 5, penalizacion: 0`) y una diana (normal, con fallos):

| Ej. | Nombre (es / en) | Expresión | Resultados distintos |
|---|---|---|---|
| 1 | Tres números / Three numbers | a ∘ b ∘ c; una operación de + − y otra de · : | exactamente 2 |
| 2 | Con un cuadrado / With a square | a ∘ b ∘ c² (³ en un 15 %); operaciones de + − · | de 3 a 5 |
| 3 | Una sola diana / One target | cuatro números, operaciones de + − · : | al menos 3; el objetivo, uno que **no** sea el de sin paréntesis |

- **Operandos**: decimales con una o dos cifras decimales (de 0,1 a 9,99: 0,5, 1,2, 2,25, 0,75…) y naturales de 2 a 10; al menos un
  decimal en cada ítem (lo normal, dos). Los divisores de la U5 son los de `multiplica-divide-decimales` ej. 6 (`DIVISORES_COMBINADA`:
  2, 4, 5, 8, 0,5, 0,25, 0,2) o un grupo que valga uno de ellos; el generador lo comprueba por división exacta, no por la lista.
- **Cotas** (todo valor, intermedio o final): **nunca negativo**, **como mucho tres cifras decimales** (milésimas), **divisiones
  exactas**, y entre 0 y 500. Un árbol que no las cumpla y la expresión se descarta: en esta práctica **no hay agrupaciones imposibles
  a la vista** (una división que da un periódico es de la sesión 6 solo para reconocerlo, no para operar; un negativo, nunca nuclear
  en la U5: aquí no salen). El cuadrado de algo con dos cifras decimales pasa de tres: se descarta solo.
- **Escritura**: coma decimal en español y punto en inglés (`aTexto` por idioma), **sin ceros de más** en los resultados (1,5, no
  1,50) y nunca «,5» sin el 0; producto `·`, división `:` en español y `÷` en inglés; exponentes con `<sup>`.
- **Regla de oro, versión decimales**: un mismo número tiene muchas escrituras y todas son la misma respuesta (0,5 = 0,50; 3 = 3,0):
  un solo chip por valor; en la diana, vale cualquier colocación que dé el objetivo. Aritmética en enteros escalados (`_comun/decimales.js`),
  **nunca** `Number` con coma flotante (0,1 + 0,2).
- **No repetir el ítem anterior** (`sesion.anterior`) y **variedad**: ningún ítem en más del 10 % de 20 000 de un ejercicio, y las
  caídas en la reserva de `buscar`, por debajo del 1 %.
- **Casos del papel, fuera**: ningún ítem puede tener la misma cuenta sin paréntesis (números en orden, operaciones y exponente) que
  una combinada o una potencia de las hojas de la U5 (`hoja-unidad5-semana{1,2}.tex`), de los exámenes semanales
  (`examen-u5-semanaN*.tex`, renombrados el 9-11, y `casos-examen-semana{1,2}.tsv`) o de los `.tex` del final (modelos 1 y 2,
  `adaptado-A`, `modeloK-dislexia`, `recuperacion`). Hojas en claro o por huella; **exámenes, solo por huella FNV-1a calculada fuera
  del repositorio** (modelo: `HUELLAS_EXAMEN` y `COMBINADAS_HOJA` de `practicas/multiplica-divide-decimales/logica.js`). En la
  ENTREGA, solo recuentos. Ojo: los ejemplos del inventario (columna `ejemplo` de U5-2C-13 a 2C-15) son los de clase: **tampoco pueden salir**.
- **Introducciones, textos y «No lo sé»** en `textos.js` (`{ es, en }`; «brackets» en inglés): en los «todos», todas las agrupaciones
  con su resultado; en la diana, una colocación que da el objetivo y su resolución (`noLoSe: { es: 'No sé hacerlo', en: 'I don’t know how' }`).
  El feedback de un fallo en la diana: qué da lo que ha puesto el alumno (con sus pasos) y una colocación que sí da el objetivo.
- **Tests**:
  - `tests/practicas-coloca-decimales.test.js`: 2000 ítems por ejercicio con las cotas (operandos, operaciones, número de resultados,
    ningún árbol inválido, ningún valor negativo, ≤ 3 cifras decimales, ≤ 500); **alcanzables** (para 200 ítems por ejercicio, todas
    las colocaciones del editor dan exactamente los chips); **ningún par de chips del mismo valor**; la diana con objetivo alcanzable
    y distinto del de sin paréntesis; no repite el anterior; ningún caso del papel (por huella); caídas en la reserva < 1 %; la coma
    en español y el punto en inglés, sin ceros de más.
  - `tests/practicas-ayuda-coloca-decimales.test.js`: 1000 ítems por ejercicio y en los dos idiomas; la explicación lleva los
    resultados del ítem (o, en la diana, el objetivo y una colocación que lo da), calculados con el motor, escritos en su idioma.
  - Fuera del test, un barrido de 20 000 ítems por ejercicio en tu scratchpad para la variedad; el resultado, en la ENTREGA.
- **En el navegador** (`?probar=1&ejercicio=N`), con clics de ratón, a 375 px y a 1200 px, en español y en inglés: un ítem de cada
  «todos» hasta encender todos, una pista, el borrar, un paréntesis sin cerrar; en la diana, un acierto y un fallo; el «No lo sé» una
  vez en cada ejercicio; consola limpia. Que cuatro números como 12,25 con sus huecos quepan en una línea a 375 px.

## Datos de entrada

- La ENTREGA de la 199 (API), `practicas/parentesis/` (el modelo), `practicas/multiplica-divide-decimales/` (huellas, hoja y
  divisores de la U5; solo lectura), `practicas/_comun/decimales.js`.
- Carpeta de la unidad, solo lectura: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/5. Decimals/`
  — `inventario-unidad5.tsv` y el acta `inventario-unidad5-revision.md` (U5-2C-13 a 2C-16; puntos (b) periódicos, (c) negativos y
  (f) potencias), `hojas-de-ejercicios/`, `exámenes-semanales/semana-{1,2}/`, `examen-final/*.tex`.

## Cómo saber que ha terminado

- Los tres ejercicios con las cotas de la tabla, los dos tests nuevos y `npm test` en verde, comiteado y empujado. La práctica sigue
  con `disponible: false` (la publica la 204) y funciona por URL:
  https://salasgar.github.io/Ejercicios-interactivos/practicas/coloca-decimales/?probar=1 (la portada no enseña la U5 hasta el 18-1).
- La ENTREGA dice las cotas finales, los recuentos (barrido, variedad, casos del papel excluidos) y cómo se probó en el navegador,
  para que la 204 la revise con clics.

## Trampas conocidas

- (de la coordinadora) **0,5 y 0,50 son el mismo chip**, y 0,1 + 0,2 no es 0,30000000000000004: todo por valor y en enteros escalados.
- (de la coordinadora) `1 : 0,3` o `2 : 3` no dan un decimal exacto: con «todas las agrupaciones se pueden», la expresión se
  descarta. Con los divisores de la U5 (2, 4, 5, 8, 0,5, 0,25, 0,2) el generador encuentra ítems enseguida; con cualquier divisor,
  cae mucho en la reserva. Cuenta las caídas.
- (de la 130, 13-11) **Un ejemplo inventado puede ser un caso de examen**: antes de comitear la ENTREGA o un test, busca tus decimales
  en las claves de los exámenes (pasó tres veces en la 130).
- (de la coordinadora, 13-11) Los `.tex` de los exámenes semanales de la U5 se llaman `examen-u5-semanaN*.tex` desde el 9-11: un guion
  con los nombres viejos no lee ninguno y da cero coincidencias sin avisar. Cuenta los casos que lee de cada fichero.
- (de la 88) `.cuenta` no se parte (`nowrap`): las frases del feedback, como texto normal, o se salen de 375 px.
- (de la coordinadora) Hay varias sesiones en este árbol: no metas en tu commit nada que no sea tuyo, y nada de `git stash`.

## Prohibido (propio de esta tarea)

- Tocar `practicas/_comun/` (el motor es de la 199; si le falta algo, propuesta en la terminada), `catalogo.js` (ni el
  `disponible`), `practicas/parentesis/` o `practicas/multiplica-divide-decimales/`.
- Negativos, periódicos, fracciones a la vista, porcentajes, letras.
- Escribir un caso de examen en claro (en el código, un test, la ENTREGA o un mensaje de commit).

## Reglas de contenido de la unidad 5

Las de la ficha de la 130 (`$R/tareas/tarea-130-publicar-u5-semana1.md`, «Reglas de contenido de la unidad 5», diez reglas copiadas
del acta), que **se leen enteras antes de empezar**; si discrepan del acta (`5. Decimals/inventario-unidad5-revision.md`), manda el
acta. Lo que más se mira aquí: un mismo número tiene muchas escrituras y todas son la misma respuesta; coma en español y punto en
inglés; ni porcentajes, ni letras, ni lo de una sesión posterior; feedback con los números del ítem; los casos del papel, fuera.

## Si la sesión se alarga

Si no te cabe todo, comitea lo que esté con tests en verde (la práctica no está publicada), escribe `$R/hechos/fallos/202--<sid>.md`
con lo que queda y `parada por: sesión agotada`, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

No recortes tú. Termina lo que quepa, escribe `$R/hechos/incidencias/<sid>.md` (tamaño real y dónde está el corte natural),
`$R/hechos/fallos/202--<sid>.md` con `parada por: mal cortada`, `ABANDONADA` en tu reclamo, y díselo a Juan Luis. Si un paso te
pide **decidir** algo que va a durar (otras cotas, negativos, otro número de ejercicios), no lo decidas: hallazgo para la
coordinadora en la terminada, y sigue con lo demás.

## Al terminar

1. `node --test tests/practicas-coloca-decimales.test.js tests/practicas-ayuda-coloca-decimales.test.js tests/practicas-parentesis-motor.test.js tests/practicas-no-lo-se.test.js tests/practicas-comun.test.js`
   en verde y `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con reclamo vivo no es tuyo: anótalo en la terminada).
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas y en la misma orden:
   `git add <rutas> && git commit -m "Coloca los paréntesis con decimales (tarea 202, U5)" -- <rutas>`. Apunta el hash.
3. Escribe `$R/salidas/202-coloca-decimales/ENTREGA.md` y su marcador vacío `ENTREGA.md.ok-<sid>`: **lo hecho** (ejercicios, cotas,
   hash, recuentos, cómo se probó) y **hallazgos fuera de criterio**, para la coordinadora. Nunca un caso de examen en claro.
4. Escribe `$R/hechos/terminadas/202--<sid>.md`: hash, ficheros (lo que dice `git show --stat`), tests, hora y **duración real**.
   Si queda algo sin hacer, empieza por `PARCIAL:` y di qué.
5. Añade `CERRADA` a tu reclamo (línea propia que empieza por esa palabra).
6. Choques encontrados → `$R/hechos/incidencias/<sid>.md`.
7. `git fetch origin`, relista `$R/hechos/` **ahora** y regenera `$R/_ESTADO.md` entero con el guion.
8. Vuelca en «Trampas conocidas» lo que hayas aprendido por las malas (es lo único de la ficha que editas, además de la duración).
9. Un solo commit con rutas explícitas de tus ficheros de `$R/hechos/` (por sid), tu carpeta de `$R/salidas/`, `$R/_ESTADO.md` y esta
   ficha, y `git push origin main`. Si el push se rechaza: `git pull --rebase origin main` (nunca `--autostash`), regenera el tablón
   otra vez desde `hechos/` y vuelve a comitear y empujar.
10. Dile al usuario la **foto del momento** en tres líneas («EN CURSO: … · LIBRES ahora: … · BLOQUEADAS: …») y, solo para las LIBRES,
    las frases de arranque de `proyecto.md`. Decide si encadenas la 200 o la 201 (solo en verde: misma banda, precondición cumplida,
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
