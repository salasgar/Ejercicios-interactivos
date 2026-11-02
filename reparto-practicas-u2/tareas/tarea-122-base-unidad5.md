# Tarea 122 · Base de la unidad 5: catálogo, portada, destrezas, `_comun/decimales.js` y `_comun/recta-decimales.js`

Actualizado: 2026-11-02 (alta de la montadora del reparto de la unidad 5, s-20261102T100120-6a6afb84)
Precondición: tarea 01 del reparto de la unidad 5 LISTA (existe la propuesta de inventario `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/5. Decimals/inventario-unidad5.tsv`; con F0 firmada, mejor: ids definitivos) · no en paralelo con otra tarea que toque `catalogo.js`, `portada.js` o `registro.js` (119, 120 si siguen EN CURSO) · Disparo: MANUAL (sesión atendida) · **Plazo: mar 1-12 (las siete prácticas van detrás y la semana 1 se publica antes del jue 14-1)**
Duración esperada: 1 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/122-base-unidad5/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/decimales.js` (nuevo), `practicas/_comun/recta-decimales.js` (nuevo), `practicas/_comun/catalogo.js` (siete filas y la unidad 5 en `UNIDADES`), `practicas/portada.js` (bloques y descripciones de la U5), `practicas/_comun/registro.js` (`DESTREZAS` de la U5), `practicas/<slug>/` de los siete slugs (solo el esqueleto), `docs/practicas-unidad5.md` (nuevo, §7), `tests/practicas-decimales.test.js` (nuevo), `tests/practicas-comun.test.js` (lista del catálogo), `tests/practicas-semana.test.js` (el test de los bloques), `tests/practicas-registro.test.js` (leer también la tabla de la U5), `tests/practicas-editor.test.js` (`tareasPorUnidad` cuenta las unidades) y `tests/practicas-espacio.test.js` (`unidadesCon`: lección de la 98)

La duración esperada no es informativa: de ella sale la caducidad del reclamo (2 ×, mínimo
45 min), el plazo tras el cual otra sesión puede relevarte si te cortas. **Este fichero es
la fuente de la banda**: el tablón la copia de aquí cada vez que se regenera. La banda
dice con qué modelo conviene abrir la sesión; la tabla de bandas de `proyecto.md` la
traduce al menú de hoy (ALTO = Opus 5.5, esfuerzo Alto; MEDIO = Sonnet 5.5, esfuerzo Medio).

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
   printf 'sesión: %s\ntarea: 122\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/122--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/122--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 122 con `abierto:` más antiguo (o igual y sid menor), añade a tu
   reclamo una línea `CEDIDA a <sid del otro>` y elige otra tarea.
5. Si el reclamo que encuentras está caducado (RELEVABLE en el tablón), relévalo con la
   línea `releva a: <sid anterior>` **en tu propio reclamo**; el suyo no se toca. Después
   mira qué dejó hecho: `ls practicas/`, `git log --oneline -5`, `git status -sb`, y la
   carpeta de salida. Lo que haya con tests en verde se hereda y se dice en la terminada;
   lo que no, se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** (todas las filas contra `hechos/` y la
   hora real; banda y «encadenable» recopiadas de las fichas) antes de empezar, y sigue
   con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.
   Si hay otras sesiones en el árbol (`.claude/sesiones/`), retoque de tus filas y del registro, no regeneración completa.
7. Idempotencia: comprueba si `practicas/<tu slug>/` o tu test ya existen (de una sesión
   caída) antes de crearlos. Si existen, léelos y continúa desde ahí.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/122--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Preparar lo común para las siete prácticas de la **unidad 5, Decimals** (tareas 123-129), de forma que ninguna de ellas
tenga que escribir en un fichero común y puedan ir las siete en paralelo (lección del 8-10: «un fichero común con candado no
se reparte entre sesiones en paralelo»). Es lo que la 98 fue para la unidad 4: léela y lee su ENTREGA.

El catálogo de la unidad 5 (diseño de la montadora del 2-11; Juan Luis puede cambiarlo):

| id | slug | nombre (es / en) | nEjercicios | semana (bloque de la portada) | destrezas (descripción; ids tras F0) |
|---|---|---|---|---|---|
| 57 | `lee-decimales` | Lee y escribe decimales / Read and write decimals | 4 | 1 | órdenes de unidades (units, tenths, hundredths, thousandths); el valor de cada cifra y la descomposición; leer en inglés (*three point seven five*) y escribir desde la lectura; la fracción decimal (3,75 = 375/100); la recta |
| 58 | `compara-decimales` | Compara, ordena y redondea / Compare, order and round | 4 | 1 | comparar (la trampa 3,9 frente a 3,10); ordenar; intercalar un decimal entre dos; redondear a la unidad, a la décima y a la centésima; estimar |
| 59 | `suma-resta-decimales` | Suma y resta decimales / Add and subtract decimals | 4 | 1 | alinear la coma; con naturales; dinero (total y cambio) y medidas; multiplicar y dividir por 10, 100 y 1000 (mover la coma; si el acta lo pasa a la semana 2, va a la 60) |
| 60 | `multiplica-divide-decimales` | Multiplica y divide decimales / Multiply and divide decimals | 5 | 2 | colocar la coma en el producto; dividir entre un natural hasta las centésimas; dividir entre un decimal (mover la coma en los dos); la comprobación (cociente · divisor + resto); problemas (precio por kilo, reparto) |
| 61 | `fraccion-decimal` | De fracción a decimal y vuelta / Fractions and decimals | 4 | 2 | de fracción a decimal dividiendo (exactos); de decimal a fracción irreducible; los pares de memoria (1/2 = 0,5…); comparar una fracción con un decimal |
| 62 | `errores5` | Caza el error / Spot the mistake | 3 | 2 (toda la unidad) | los errores típicos de la unidad como cálculos con un paso mal (la coma, el redondeo, la comparación, la división) |
| 63 | `leelo5` | Léelo en inglés / Say it in English | 4 | toda la unidad | vocabulario: decimal point, tenths, hundredths, thousandths, round to the nearest, decimal places, estimate, nought, change, per litre; la lectura de decimales y de dinero |

Sin práctica, a propósito: la lectura en voz alta (va a `leelo5` como «elige la lectura correcta»), la estimación como destreza
suelta (va dentro de `compara-decimales`), y lo que el acta deje fuera (periódicos, negativos, cambios de unidad, potencias:
si entran, se proponen en la ENTREGA como ejercicio extra de la práctica que toque, no como práctica nueva). Si el §7 de
`docs/practicas-unidad5.md` reparte las destrezas de otra manera, el §7 manda y esta tabla se corrige en la ENTREGA.

## Siguiente paso

1. Lee la ficha de la tarea 98 (`tareas/tarea-98-base-unidad4.md`) y su `salidas/98-base-unidad4/ENTREGA.md`: es el molde exacto (esqueletos, bloques, `DESTREZAS`, docs §7, tests, trampas de `UNIDADES`). Lee `practicas/_comun/fracciones.js` (`Fraccion`, `htmlFraccion`: la conversión decimal ↔ fracción se apoya en él), `practicas/_comun/aritmetica.js` (`mcd`) y `practicas/_comun/piezas.js` (`leerNumero` solo lee naturales: no se toca; el decimal se lee aparte).
2. Lee `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/5. Decimals/inventario-unidad5.tsv` (la propuesta de la 01, o el aprobado si la 02 ya cerró) y, si existe, el acta `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/5. Decimals/inventario-unidad5-revision.md` (qué entra y los ids que cambiaron): de ahí salen los ids de cada práctica.
3. `git status` y `git log --oneline -3 -- practicas/_comun/ practicas/portada.js`: si hay cambios sin commit en esos ficheros que no son tuyos, no los pises y avisa. Mira `.claude/sesiones/` por si otra sesión tiene reservado `catalogo.js`.

## Qué hay que hacer

1. **`practicas/_comun/decimales.js`** (nuevo, puro, sin DOM), con su test `tests/practicas-decimales.test.js`: una fábrica `Decimal(mantisa, cifras)` **inmutable, como entero escalado** (`{m, k}` = m / 10^k, con `m` entero seguro y `k` ≥ 0; nunca un `Number` con coma flotante por dentro), con `normalizar()` (quita ceros finales), `equals(otro)` (por valor), `comparar(a, b)`, `ordenar(lista)`, `sumar`, `restar`, `multiplicar`, `dividir(a, b, cifras)` (exacta si termina; si no, devuelve el cociente truncado a `cifras` y el resto, para la comprobación), `porPotenciaDe10(d, n)` (n entero, negativo para dividir), `redondear(d, cifras)`, `truncar(d, cifras)`, `cifrasDecimales(d)`, `descomponer(d)` (unidades, décimas, centésimas, milésimas: para «el valor de la cifra»), `aFraccion(d)` (devuelve una `Fraccion` de `fracciones.js`, irreducible) y `deFraccion(f)` (solo si el decimal es exacto; si no, `null`), `entreDos(a, b)` (un decimal estrictamente entre dos: para intercalar), `deTexto(texto, idioma)` → `Decimal` o `null` (acepta `3,75` y `3.75` **en los dos idiomas**, naturales, un cero inicial opcional en inglés (`.5`), espacios; rechaza puntos de millares, dos separadores, vacío, basura; nunca `Number(texto)`), `aTexto(d, idioma, cifras?)` (coma en español, punto en inglés; con `cifras`, ceros finales fijos: dinero con dos), `enPalabras(d, idioma)` (inglés: *three point seven five*, *nought point five*; español: *tres coma setenta y cinco*) y `lecturasValidas(d, idioma)` (todas las que valen: *nought* / *zero* / *point five*; *tres coma setenta y cinco* / *tres unidades y setenta y cinco centésimas*), `dinero(d)` (texto con dos decimales y €; *three euros seventy-five* en inglés). **Los errores típicos** de la regla 4, cada uno como función con nombre que da el cálculo equivocado (`compararPorCifras`, `alinearDerecha`, `comaMalPuesta(a, b, desplazamiento)`, `porDiezAnadiendoCero`, `entreDiezQuitandoCero`, `redondearTruncando`, `redondearEnCadena`, `olvidarComaCociente`, `decimasPorCentesimas`, `fraccionAlReves`, `denominadorEquivocado`, `centimosPorEuros`…) y una tabla `ERRORES_TIPICOS` con su nombre `{ es, en }` en frase corta; cada función devuelve `null` si da lo mismo que la respuesta correcta.
2. **Test** de `decimales.js`: contra una tabla de 40 casos calculados a mano y contra `BigInt` en 3000 casos aleatorios (suma, resta, producto, comparación, redondeo, ×/÷ por potencias de 10); `equals` por valor (0,5 = 0,50); `deTexto` y `enPalabras` con tabla (los dos idiomas, coma y punto, `.5`, rechazos); `aFraccion`/`deFraccion` contra `Fraccion`; cada error típico distinto del correcto cuando no devuelve `null`.
3. **`practicas/_comun/recta-decimales.js`** (nuevo, con DOM, SVG): una recta de `a` a `b` (naturales consecutivos, o décimas consecutivas) con marcas en las décimas o en las centésimas, puntos con etiqueta y marcas que se pueden tocar (`alTocar(i)`); se ve bien a 375 px con hasta 10 marcas grandes y 10 pequeñas entre cada dos. Parte de `practicas/_comun/recta-enteros.js` (misma idea, otros valores); la parte pura (qué marca está más cerca de un toque, posición de cada marca, valor de la marca i como `Decimal`) va en funciones exportadas con su test, en `tests/practicas-decimales.test.js`. **En un SVG, lo que se dibuja encima se queda el clic**: capas con `pointer-events: none` (lección de la 79).
4. **Catálogo** (`practicas/_comun/catalogo.js`): las siete filas de la tabla de arriba, `unidad: 5`, **`disponible: false`**, en ese orden, después de la fila 56 (`leelo4`) y antes de la plantilla; los ids 57-63 están libres. Y en `UNIDADES`, `{ n: 5, desde: '2027-01-18', titulo: { es: 'Números decimales', en: 'Decimals' } }`. **Añadir una unidad rompe dos tests más** (lección de la 98): `tareasPorUnidad` en `tests/practicas-editor.test.js` y `unidadesCon` en `tests/practicas-espacio.test.js`: ajústalos.
5. **Un esqueleto por práctica**: `practicas/<slug>/` para los siete slugs, copia mínima de `practicas/plantilla/` que carga y declara su `slug` y sus `nEjercicios` (un test de `tests/practicas-semana.test.js` carga el `practica.js` de cada fila del catálogo). **Desde que esta tarea esté LISTA, cada carpeta es de su tarea (123-129)**; escríbelo en la ENTREGA.
6. **Portada** (`practicas/portada.js`): tres bloques de la unidad 5, `unidad: 5`: «Semana 1 · Leer, comparar, redondear, sumar y restar» / «Week 1 · Reading, comparing, rounding, adding and subtracting»: `lee-decimales`, `compara-decimales`, `suma-resta-decimales`; «Semana 2 · Multiplicar, dividir, fracciones y decimales, errores» / «Week 2 · Multiplying, dividing, fractions and decimals, mistakes»: `multiplica-divide-decimales`, `fraccion-decimal`, `errores5`; «Para toda la unidad · Vocabulario» / «For the whole unit · Vocabulary»: `leelo5`. Y una línea de `DESCRIPCION` por práctica, en los dos idiomas, sacada de la ficha de su tarea. Ajusta los tests de `tests/practicas-semana.test.js` que fijen los bloques por unidad (los de la U2-U4 se conservan tal cual).
7. **Destrezas** (`practicas/_comun/registro.js`, `DESTREZAS`): las de la unidad 5 con los ids completos (`U5-1C-03`…), y **`docs/practicas-unidad5.md`** con su §7 («Qué práctica cubre qué destreza de la unidad 5», mismas columnas que el de la unidad 4, una fila por destreza del inventario, también las que no tienen práctica); cambia `tests/practicas-registro.test.js` para que lea también la tabla de la U5. El resto del documento lo escribe la 131; deja los apartados con «por escribir (tarea 131)». Si al cerrar F0 sigue sin firma, los ids son los de la propuesta: dilo en la ENTREGA y la 130 lo comprueba antes de publicar.
8. **`tests/practicas-comun.test.js`**: la lista del catálogo con las siete filas nuevas (es el test que fija ids, slugs y número de ejercicios).

## Datos de entrada

- El inventario de la unidad 5 (propuesta de la 01 o aprobado tras la 02), solo lectura: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/5. Decimals/inventario-unidad5.tsv`; el acta `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/5. Decimals/inventario-unidad5-revision.md` (léela entera si existe); la secuenciación `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/5. Decimals/secuenciación-unidad5.pdf`; `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/5. Decimals/reparto-unidad5/proyecto.md` (reglas de contenido y cotas).
- `reparto-practicas-u2/tareas/tarea-123-…` a `tarea-129-…`: lo que cada práctica va a pedir a `decimales.js` y a `recta-decimales.js` (léelas por encima antes de fijar la API).
- `tareas/tarea-98-base-unidad4.md`, `salidas/98-base-unidad4/ENTREGA.md`, `practicas/_comun/fracciones.js`, `recta-enteros.js`, `dibujo-fracciones.js`, `aritmetica.js`, `docs/practicas-unidad4.md`: el molde.

## Cómo saber que ha terminado

- `npm test` sin fallos (el árbol entero: con el esqueleto, todas las filas cargan).
- `node --test tests/practicas-decimales.test.js` en verde, con la tabla a mano y los 3000 casos.
- En local (`npm run servir`), la portada no enseña nada nuevo (todo `disponible: false`; la U5 no llega hasta el 18-1), y una página de prueba tuya (no comiteada) pinta la recta a 375 px.

## Trampas conocidas

- **La unidad 5 no aparece en la portada hasta el 18-1** (`UNIDADES.desde`): para verla antes en local, pásale a `unidadActual` una fecha de prueba o mira `bloquesPublicados(CATALOGO, 5)` en la consola.
- Si otra sesión tiene reservado `catalogo.js` (119, 120 o una de Juan Luis fuera del reparto), espera o haz antes todo lo demás (`decimales.js`, `recta-decimales.js`, esqueletos, docs) y deja el catálogo para el final del commit.
- `,` y `.` como separador decimal: `deTexto` acepta los dos en los dos idiomas (el teclado del móvil en español saca coma; en inglés, punto), pero un texto con los dos (`1.234,5`) o con dos iguales se rechaza; el teclado numérico del móvil puede no tener coma: en los campos de respuesta, `inputmode="decimal"`.
- Para probar en el navegador sin dejar nada en el árbol compartido: servir una carpeta del scratchpad con enlaces a `practicas/`, `css/`, `src/`, `divisores/` y `herramientas/`; Chrome guarda en caché los módulos: `fetch(url, { cache: 'reload' })`. Sin la extensión: Chrome headless con perfil propio (`--user-data-dir=<scratchpad>/perfil`), matando el proceso al acabar (un headless huérfano bloquea el Chrome normal). En este Mac no hay `timeout`.
- En zsh una variable con varias rutas no se parte en palabras: `F=(a b c); git add "${F[@]}"`.
- Duración real de la 98 en la U4: ~30 min de la estimación de 1 h 45 min.

## Prohibido (propio de esta tarea)

- Escribir ninguna práctica de verdad (solo los esqueletos) o poner `disponible: true`.
- Cambiar lo que hacen hoy `leerNumero`, `campoNumero`, `enteros.js`, `fracciones.js`, el catálogo de las unidades 1-4 o sus bloques.
- Representar o comparar decimales con `Number` en coma flotante en ninguna práctica: enteros escalados siempre.

## Salida esperada

- Los ficheros de «Ficheros que toca» comiteados, con `npm test` sin fallos.
- `reparto-practicas-u2/salidas/122-base-unidad5/ENTREGA.md` (hash, ficheros, la API de `decimales.js` y de `recta-decimales.js` en una tabla, la tabla slug → ids definitivos de cada práctica, qué dejó provisional y cómo probarlo en 1 minuto) y su marcador `ENTREGA.md.ok-<sid>`.

## Reglas de contenido de la unidad 5 (copia de `proyecto.md` de su reparto; lo común no se lee, por eso va aquí)

Las reglas 2-4 y 8-9 de la lista de la unidad 2 (signos `·` y `:`, inglés, regla de oro, feedback, realismo) valen igual.
La fuente es `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/5. Decimals/reparto-unidad5/proyecto.md` («Reglas de contenido comunes») y, cuando exista, el acta
`/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/5. Decimals/inventario-unidad5-revision.md` (lo que Juan Luis decida en la tarea 02 de aquel reparto: periódicos, negativos,
cambios de unidad, potencias de decimales, calculadora, cotas de realismo, ids). **Hasta el acta, nada de eso entra.**

1. **Un mismo número tiene muchas escrituras, y todas son la misma respuesta.** 0,5 = 0,50 = 1/2 = 5/10; 2 = 2,0; 1,75 = 7/4.
   En cualquier ejercicio de elegir, emparejar o verdadero/falso, ninguna opción puede equivaler a otra: el test lo comprueba
   **por valor** con la aritmética exacta de `_comun/decimales.js` (enteros escalados, nunca `Number` con coma flotante ni
   `toFixed` para comparar). Solo si el ejercicio evalúa la forma escrita («¿cuántas cifras decimales tiene?») cuenta la
   escritura, y el enunciado lo dice. Cuando la respuesta tiene un número fijo de cifras («round to 2 decimal places», dinero),
   el enunciado lo dice y la corrección lo exige.
2. **Nada que no se haya dado**: cada ejercicio respeta la columna `sesion` de sus destrezas en el inventario (semana 1:
   leer y escribir, órdenes, fracción decimal, recta, comparar, redondear, sumar y restar, ×/÷ por 10-100-1000; semana 2:
   multiplicar, dividir, fracción ↔ decimal, combinadas, problemas). **Ni porcentajes** («0,5 = 50 %» está prohibido hasta la
   U7), ni letras ni ecuaciones (hueco `□`), ni proporcionalidad; periódicos, negativos, cambios de unidad, potencias y
   raíces de decimales solo si el acta los admite y en la sesión que diga.
3. **La coma y el punto**: en español, coma (`3,75`); en inglés, punto (`3.75`) y la lectura con *point* y las cifras una a
   una (*three point seven five*; *nought* y *zero* valen). `fmtDecimal` y `leerDecimal` de `_comun/decimales.js` lo hacen por
   idioma (el alumno puede teclear coma o punto en los dos idiomas: la base lo acepta). Nunca un punto de millares.
   Producto con `·`, nunca `×`; división con `:` (en inglés también `÷`).
4. **Regla de oro**: todo distractor, inequívocamente falso, y cada distractor sale de un **error típico** de la columna
   `nota` del inventario, calculado con los números del ítem y comprobado en el test (nunca un número al azar): comparar
   por el número de cifras (3,9 < 3,10); sumar o restar alineando a la derecha; colocar mal la coma al multiplicar (1,2 · 0,3
   = 3,6); ×10 añadiendo un cero (2,5 · 10 = 2,50); ÷10 quitando un cero; redondear truncando o en cadena; olvidar la coma
   del cociente; décimas por centésimas; 3/4 = 1,33; 0,75 = 75/10; «0,5 €» por 5 céntimos. Los generadores de estos valores
   están en `_comun/decimales.js` (`ERRORES_TIPICOS`): úsalos, y **cada función dice cuándo no sirve** (devuelve `null`
   cuando el error da lo mismo que la respuesta). **Lo que no es un error**: 2,50 € por 2,5 € (en dinero, la clave admite las
   dos), ni una escritura con ceros finales.
5. **Parejas válidas, que nunca se enfrentan**: *nought point five* / *zero point five* / *point five*; *round to one decimal
   place* / *round to the nearest tenth*; *decimal places* / *digits after the decimal point*; `÷` / `:`; *times* /
   *multiplied by*; un decimal y su fracción; un decimal con y sin ceros finales; *metres* / *meters*. Y lo que se oye en la
   calle no es distractor limpio: *three point seventy-five* y *three seventy-five* (precios) no se enfrentan a *three point
   seven five*; la lectura se evalúa con opciones claramente falsas (*thirty-seven point five*, *seven point three five*).
6. **Inglés sencillo**; la palabra no matemática que decide la respuesta se aclara entre paréntesis (*change* (la vuelta),
   *per litre* (por litro), *nearest* (más cercano), *weighs* (pesa)), salvo que sea justo lo que se evalúa. Unidades en inglés
   británico (*metres, litres, kilograms, euros, cents*).
7. **Realismo** (regla de Juan Luis del 16-10): la situación tiene que ser posible y **todos** los números que pueda sacar el
   generador, creíbles, con una cota por contexto que el test comprueba. Orientativas hasta el acta (la sesión fija las suyas y
   las escribe en su ENTREGA): precios en euros con dos decimales (un producto del supermercado 0,20-30 €; una prenda 5-120 €;
   una entrada 3-60 €; gasolina 1,20-2,00 €/L, depósitos 5-70 L; el cambio nunca negativo); pesos (una pieza de fruta 0,08-0,5
   kg; una bolsa 0,5-5 kg; un paquete 0,1-30 kg; un recién nacido 2,5-4,5 kg; una persona 30-120 kg); longitudes (una persona
   1,20-2,10 m; una habitación 2-10 m; un folio 21 × 29,7 cm); distancias (a pie o en bici hasta 50 km, en coche hasta 1000 km);
   tiempos (100 m lisos 9,58-20,00 s); temperaturas (−10 a 45 °C con una decimal; el cuerpo 35,0-42,0; negativas solo si el acta
   las admite); capacidades (un vaso 0,2-0,33 L; una botella 0,33-2 L); notas de 0 a 10 con una decimal.
8. **Feedback ligado al error**, con los números del ítem («2,5 + 1,25: has alineado a la derecha; alinea las comas: 2,50 +
   1,25 = 3,75»), no una regla genérica. Frase sencilla antes que caso límite.
9. **Casos fijos** (frases, contextos, números) que no copien los de las hojas, los exámenes semanales ni el examen final de la
   unidad 5 (en `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/5. Decimals/hojas-de-ejercicios/`, `exámenes-semanales/`, `examen-final/`): los alumnos los verán en papel. **Los
   casos de las hojas se excluyen en claro; los de los exámenes, por huella FNV-1a calculada fuera del repositorio, nunca en
   claro** (regla de PU2 del 30-10; modelo: `practicas/equivalentes/logica.js` y `tests/practicas-equivalentes.test.js` tras el
   commit b0e4cfd, y la reabierta `hechos/reabiertas/100--s-20261030T081542-dab2aa98-revision.md`). Si al reclamar la hoja o el
   examen de tu semana no existen aún, dilo en la ENTREGA: la tarea de publicación de tu semana coteja y reabre si hace falta.
10. **Aritmética exacta**: los decimales se representan como enteros escalados (`{m, k}` = m / 10^k) o céntimos/milésimas;
    nunca se suma, compara ni muestra con `Number` en coma flotante (0,1 + 0,2 ≠ 0,3). Los tests lo comprueban contra `BigInt`
    o aritmética entera propia.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 122, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-122.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/122--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/122--<sid>.md` con `parada por: mal cortada`
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
   `git add <rutas> && git commit -m "<qué>" -- <rutas>`. Apunta el hash
   (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/122-base-unidad5/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cotas de realismo, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/122--<sid>.md`: hash del commit, ficheros (lo que dice
   `git show --stat`, no lo que crees), número de tests propios en verde, hora y
   **duración real** (de `abierto:` a ahora), y propuestas pendientes si las hay.
5. Añade `CERRADA` a tu reclamo (línea propia que empieza por esa palabra).
6. Choques encontrados → `$R/hechos/incidencias/<sid>.md`.
7. `git fetch origin`, relista `$R/hechos/` **ahora** y regenera `$R/_ESTADO.md` (entero si
   no hay otras sesiones en el árbol; si las hay, retoque de tus filas y del registro):
   banda y «encadenable» recopiadas de las fichas, leyenda de bandas de `proyecto.md`. Anota qué
   tareas pasan de BLOQUEADA a PENDIENTE. Si tu duración real difiere mucho de la estimada,
   díselo al usuario.
8. Vuelca abajo, en «Trampas conocidas» de esta ficha, lo que hayas aprendido por las
   malas (es lo único de la ficha que editas, además de la duración).
9. Un solo commit con rutas explícitas de tus ficheros de `$R/hechos/` (por sid), tu
   carpeta de `$R/salidas/`, `$R/_ESTADO.md` y esta ficha, y `git push origin main`. Si el
   push se rechaza: `git pull --rebase origin main`, regenera el tablón otra vez desde
   `hechos/` (no lo fusiones a mano) y vuelve a comitear y empujar. **Nunca si `main` lleva
   commits ajenos sin empujar**: incidencia y díselo al usuario.
10. Dile al usuario la **foto del momento** en tres líneas («EN CURSO: … · LIBRES ahora: … ·
    BLOQUEADAS: …»), sacada de la lectura de `hechos/` del paso 7, y después, **solo para las
    LIBRES**, las frases de arranque de `proyecto.md` literales, en bloques de cita, una por
    sesión que quepa a la vez, con la tarea o la cadena, la banda traducida y el nombre de
    sesión delante.
11. Decide si encadenas (solo en verde: misma banda, tarea corta, sin esperas; si tu frase
    de arranque nombra la cadena, encadenas por defecto) o paras. Si encadenas, «Antes de
    empezar» entero otra vez, con reclamo nuevo, y di el nombre nuevo que te toca.

Si paras sin terminar: `$R/hechos/fallos/122--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni
  `practicas/_comun/` (salvo la tarea 01; en cada unidad, su base y sus tareas de publicación; cada una en lo que declara), ni `css/estilos.css`, ni `README.md` (salvo
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
- Las reglas de contenido de la unidad 5 (en esta ficha y en `proyecto.md` de su reparto): `×` en vez de `·`, letras,
  ecuaciones, porcentajes, proporcionalidad; aritmética en coma flotante; lo que el acta deje fuera (periódicos, negativos,
  cambios de unidad, potencias, raíces) o algo de una sesión posterior a la de la destreza; distractores que puedan ser
  verdad, y en especial **dos opciones con el mismo valor** (0,5 y 0,50; 0,25 y 1/4), que son dos respuestas correctas;
  casos de examen en claro en el repositorio.
