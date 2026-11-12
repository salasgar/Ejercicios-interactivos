# Entrega de la tarea 107 · errores4 («Caza el error», unidad 4)

Sesión s-20261028T175707-8523c0a8 (relevó a s-20261028T140139-2d3c242b y s-20261027T155250-47ffa5fc; no dejaron código, solo el esqueleto de la 98). Commit 7430dfc.

Ficheros: practicas/errores4/{index.html,estilos.css,campo.js,logica.js,textos.js,practica.js}, tests/practicas-errores4.test.js (12 tests propios; `npm test` 1334/1334). `campo.js` es una copia reducida de `campoFraccion` de suma-resta (la ficha pide copiar, no tocar otras prácticas).

Ejercicios (id 55, sin `disponible: true`): 1 «¿Bien o mal?» (igualdad o comparación; si es falsa, elegir entre tres nombres de error; mitad verdaderas, una de cada cinco una comparación), 2 «La línea mala» (cálculo de 3 líneas con una falsa, la 2 o la 3), 3 «Arréglalo» (se ve la igualdad falsa y se escribe el resultado bien, irreducible; casilla de natural para «fracción de una cantidad», dos casillas con «+/−» para el resto). Errores (12 plantillas + 3 de comparar): suma-arriba-y-abajo, signo-perdido (resultado negativo), suma-multiplicando-denominadores, simplifica-solo-numerador/denominador, se-queda-en-la-unitaria, multiplica-por-el-denominador, fraccion-de-al-reves, invierte-la-primera, no-invierte, invierte-las-dos, eleva-solo-el-numerador; y compara-solo-numeradores/denominadores e ignora-el-signo (solo ejercicio 1). Destrezas: U4-3C-09, 3C-11 y 3C-12 (esta, solo en las explicaciones y la introducción; ningún ítem es «no es error»: ver propuesta).

Cotas fijadas (sin contexto, de tamaño): operandos propios con denominador 2-8 (comparar 3-8); simplificar con m.c.d. 4, 6, 9, 10 o 12 y términos ≤ 90; «fracción de» con denominador ≤ 10, cantidad múltiplo del denominador entre 2·d y 120 (multiplica-por-el-denominador, ≤ 60 y resultado ≤ 600); potencias de base propia con numerador ≥ 2, exponente 2 (80 %) o 3; ningún número de una línea > 600; ni decimales ni mixtos ni letras.

Probar en 1 minuto: `npm run servir`, http://localhost:8080/practicas/errores4/ y «Probar sin código» (el código 7NPD no entra sin red/registro); `?ejercicio=1`, `2`, `3`; `?idioma=en`.
Probado en navegador con clics: ej. 1 (comparación falsa, nombre mal elegido, feedback), ej. 2 (fallo, feedback) y ej. 3 (acierto con casilla natural, en inglés); sin errores de consola. NO probado a 375 px (la ventana no se pudo estrechar) ni el «+/−» de la fracción con dos casillas.

## Reabierta del 28-10 (revisión de la 111): cerrada por s-20261028T224056-926a6873, commit 594484f

Las cinco cosas de `hechos/reabiertas/107--s-20261028T182802-3d6fcf1b-revision.md`, y los retoques de texto:
1. `suma-multiplicando-denominadores`: la explicación ya no dice que multiplicar los denominadores sea un error; dice que se multiplicaron los denominadores pero los numeradores se sumaron sin ampliarlos (el nombre del catálogo, «Ha multiplicado los denominadores en una suma», es verdad y no se toca: es de `_comun`).
2. `opcionesDeNombre` descarta todo nombre que, aplicado a los números del ítem, dé el valor mostrado (`erroresQueExplican`, la misma fuerza bruta de la revisión, ahora en `logica.js` y en el test). Cero ofrecidos que expliquen el resultado en 3000 ítems.
3 y 4. Las comparaciones `compara-solo-numeradores/denominadores` solo con numeradores **y** denominadores distintos (así «hay que mirar los dos términos» es verdad) y solo con pares en los que el error cambia la relación; nunca se muestra «=».
5. `suma-arriba-y-abajo`: en los ejercicios 1 y 3 la igualdad falsa es el error sobre las fracciones que se ven (`1/3 + 1/2 = 2/5`); en el 2 se conservan las tres líneas (error en el paso 2→3).
Textos: «una de las 6 partes iguales de 42», «Es el mismo resultado equivocado» / «That is the same wrong result as in the equality», «so it is greater», «the exponent applies to», el detalle del ej. 1 dice «igualdad o comparación», la introducción del ej. 3 usa `5/6 : 10/9` (no el ejemplo anterior, que era de un examen semanal), y en el ej. 2 la potencia se ve en la línea 2 (`2 · 2/3`, que es lo que hizo el compañero).
Pruebas: `node --test tests/practicas-comun.test.js tests/practicas-errores4.test.js` 62/62; `npm test` 1344/1344 (4 tests nuevos de fuerza bruta). Navegador (Chrome headless con clics, es/en, 375 y 1100 px, los tres ejercicios, acierto y fallo): sin desbordes ni errores de consola. Limitación de mi script: no pulsa «+/−», así que las respuestas negativas del ej. 3 no se comprobaron con clics (el campo no cambió).
Sigue sin publicar (`disponible`): lo hace la tarea de publicación de la semana 3.

## Reabierta del 30-10 (s-20261102T094541-1e9efc9c, commit 1fc3711)

Un caso de la hoja 2 y uno de examen que podían salir en los tres ejercicios, según
`hechos/reabiertas/107--s-20261030T084305-921ac985-revision.md` («clave: la igualdad entera, la
de la izquierda y el resultado mostrado»). En vez de comparar el texto renderizado (distinto en
cada ejercicio: ej. 1 y 3 muestran «igualdad», el 2 muestra tres líneas), la exclusión va al
origen común: la pareja (plantilla, parámetros) que produce `conParams`, de la que salen `izq`,
`der` y las `lineas` de los tres ejercicios por igual. Un solo punto de corte cubre los tres.

**Hoja 2 (en claro, los alumnos ya la tienen en papel):** ej. 8 («Does it make sense?»), las dos
igualdades `3/5 + 1/3 = 4/8` y `2/3 + 3/4 = 5/7`; ej. 3 (la respuesta de Ana), `2/5 + 1/4 = 3/9`.
Las tres son la plantilla `suma-arriba-y-abajo` con sus parámetros exactos (`PARAMS_HOJA`).

**Examen final (por huella, nunca en claro):** un paso intermedio de una caja «Find the mistake» del modelo 1
(también `suma-arriba-y-abajo`), una huella en `HUELLAS_EXAMEN`. Revisadas y
descartadas por no poder producirse con las cotas actuales (denominador 2-8 para las sumas, 3-6
para las potencias): U4-2C-06 (seis variantes, denominadores 9 a 12) y U4-3C-11 (los seis casos:
dos de `suma-arriba-y-abajo` con denominadores 9-11; dos de división, sin plantilla en esta
práctica; uno de potencia, `(7/9)²`, denominador 9 fuera de rango; uno de comparación). Las otras
cajas 5b (Pablo/Marta del modelo 2, Hugo/Nora de la recuperación) y la caja de Leo (modelo 1) no
tienen ningún paso de dos términos que coincida con una plantilla de esta práctica (división sin
plantilla propia, o fracciones impropias/de tres términos fuera de lo que generan `dosDistintas` y
`propia`); comprobado a mano, no por fuerza bruta.

`node --test tests/practicas-comun.test.js tests/practicas-errores4.test.js`: 64/64 (dos tests
nuevos: que las listas detectan de verdad un caso conocido y no marcan uno cualquiera, y que
3000 ítems de cada uno de los tres ejercicios no repiten ningún caso). `npm test`: 1364/1364.
Probado en `npm run servir` con Chrome (vía claude-in-chrome), «Probar sin código»: ejercicio 1,
una comparación falsa acertada, ES.

## Reabierta del 2-11 (s-20261102T141053-b5277421; cierra s-20261102T152304-2a463f3b, commit 8fda62a)

`hechos/reabiertas/107--s-20261102T141053-b5277421-revision.md`. Los casos de la hoja 2 (8a, 8b y la respuesta de Ana del ej. 3) salían con los
sumandos en el otro orden. `claveParams` ordena ahora las dos fracciones de las plantillas de suma (`suma-*`, 4 parámetros); `PARAMS_HOJA` y
`HUELLAS_EXAMEN` se construyen con ella (3 claves de hoja y 1 huella, como antes). Las que no son sumas conservan el orden. Barrido: 60000
ítems (20000 por ejercicio, semilla 2026) sin ninguna coincidencia; el test (3000 por ejercicio) comprueba los casos de la hoja en los dos
órdenes. **Casos de examen en claro quitados** del código: el comentario y la llamada `huella(claveParams(..., [...]))` del examen final
escribían la cuenta; ahora es solo la huella. Esa cuenta (y, en `combinadas-fracciones`, un U4-3A-01) **siguen en el historial de git**
(commits de las reabiertas del 28 y 30-10): decide Juan Luis si hace falta reescribirlo. `node --test tests/practicas-comun.test.js
tests/practicas-errores4.test.js`: 64/64. `npm test`: 1368/1368. Sin tocar `catalogo.js`. Sin publicar (sin publicador, mar 22-12).

## Reabierta del 6-11 (s-20261106T144236-e32305eb; cierra s-20261106T155734-dd5fe362, commit 8d8d9ba)

`hechos/reabiertas/107--s-20261106T144236-e32305eb-revision.md`. La exclusión pasa de la plantilla y sus parámetros a **lo que ve el alumno**
(`claveVista(l0)`): suma y producto sin orden, resta y cociente con orden, potencia por base y exponente. Así un caso excluido lo está en las
tres plantillas de «la fracción de una cantidad» (`p/d · n`) y en las sumas, restas y cocientes que escriban lo mismo.
- **Hojas (en claro, `CLAVES_HOJA`, 13 claves):** hoja 1 ej. 5 (cinco cantidades), hoja 2 (4e, 5a, 9a, 10a, 12c, 13b) y hoja 3 (12f y el «Write in words» del cociente).
- **Exámenes (por huella FNV-1a de `claveVista`, `HUELLAS_VISTA_EXAMEN`, 18 huellas; nunca en claro):** todas las variantes, extras incluidas, de U4-1C-08 (6),
  U4-1A-01 (6) y U4-2C-12 (6). Calculadas fuera del repo leyendo los TSV de los exámenes semanales 1 y 3. Se conservan `PARAMS_HOJA` y `HUELLAS_EXAMEN` anteriores.
- **Test nuevo:** 3000 ítems por ejercicio con las semillas 163, 7 y 11 (27000 en total) sin ninguna coincidencia; y un test de la clave. Sin el filtro habría salido una
  coincidencia en 1877 de 37812 números generados (comprobado: el filtro no es vacuo).
- `node --test tests/practicas-comun.test.js tests/practicas-errores4.test.js`: 66/66. `npm test`: 1642/1642. Sin tocar `catalogo.js`. **No probada de nuevo en el navegador:**
  el cambio es solo del filtro de números en `logica.js`; la interfaz no se ha tocado. Sin publicar (sin publicador, mar 22-12).
- **No cuentan (como en la 162):** sumas que son el segundo paso de una combinada de la hoja 3; simplificar −24/30 (la práctica da 24/30); las tres potencias que son un paso de una cuenta del examen final (decide Juan Luis).
- **Aviso:** como en las reabiertas anteriores, los casos de examen escritos en claro en commits antiguos siguen en el historial público de git.

## Reabierta del 12-11 (s-20261112T010355-f006a9a8, revisión de la 170): cerrada por s-20261112T013340-1542cdde, commit 65595c6

Solo `practicas/errores4/logica.js` y `tests/practicas-errores4.test.js`; `catalogo.js` sin tocar. Los casos de examen, solo como huellas FNV-1a.
- `HUELLAS_VISTA_EXAMEN` pasa de 18 a 35 huellas de `claveVista`: las sumas, restas, cocientes, productos, fracciones sueltas y potencias de los exámenes finales (modelos 1 y 2, recuperación, adaptado-A) y de los semanales 1-3 (incluidos los `extra` y los `casos-examen-semanaN.tsv`) que la práctica puede escribir. Entre ellas, la suma de la caja de Sara, que ahora vale para todas las plantillas que la escriben (suma-arriba-y-abajo y suma-multiplicando-denominadores). `HUELLAS_EXAMEN` se conserva.
- `claveVista` devuelve `N|n/d` (sin reducir) para la fracción suelta de las plantillas de simplificar; `CLAVES_HOJA` pasa de 13 a 17: `F|1/4|52` (hoja 1, 5b, en palabras), `N|60/84` (hoja 1, 8e), `N|24/30` (hoja 2, 1a) y `N|8/12` (hoja 2, 11b, simplificar antes de sumar). Revisadas las hojas 1-3 en busca de «half/a quarter/a third of»: solo hay «a quarter of 52».
- Comparaciones: `claveComparacion` (pareja sin orden y con signo, `C|a|b`) y `HUELLAS_COMPARACION` (9 huellas) de todas las variantes de U4-1C-17 y U4-1C-19 de los semanales (de `correcta` y de las `\opciones`); `prohibido` la aplica a las tres plantillas de comparación, y por tanto a `generarBienMal`.
- Huellas que lee el guion (claves, y comparaciones donde las hay, no solo las que la práctica puede producir): adaptado-A 32, modelo1 39, modelo2 58, recuperación 37; semanal 1: examen 661, extra 166, casos 123; semanal 2: 459, 149, 226; semanal 3: 434, 183, 244. De ellas, 13 claves y 9 comparaciones de los semanales y 8 claves de los finales son producibles por la práctica (644 claves y 172 parejas producibles en total).
- Pruebas: `node --test tests/practicas-comun.test.js tests/practicas-errores4.test.js` 66/66; `npm test` 1807/1807. Comprobación aparte (guion fuera del repo, 60000 ítems por ejercicio, semilla 2026): 0 casos de examen y 0 de las cuatro claves de hoja nuevas, por lo que ve el alumno. Los tests del repo (3000 por ejercicio, tres semillas) comprueban lo mismo con las listas.
- Sin navegador: el cambio es solo de listas de exclusión, sin tocar DOM ni textos; el clic de la 170 (375 y 1100 px, ES y EN) sigue valiendo. Sigue sin publicar: la 170 se vuelve a reclamar.
- Lo que el guion lee de las hojas pero no se excluye (fuera de lo pedido): sumas y restas de los recuadros y ejercicios de las hojas 2-3 con denominadores que la práctica sí usa (p. ej. `1/2 + 1/3`) y algún `N|…` de ejercicios de equivalentes; la revisión del 12-11 solo pedía simplificaciones y fracciones de una cantidad. Lo de «No bloquea» de la revisión (suma de Marta sin menos, hoja 2 ej. 2a, U4-2B-02, comparaciones de U4-1C-20, `3 · 3 · 3/4`) sigue sin tocar, para Juan Luis.
