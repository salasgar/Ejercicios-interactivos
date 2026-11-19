# Tarea 211 · Base de la unidad 7: catálogo, portada, destrezas y `_comun/proporcion.js` (razones, porcentajes y cantidades con unidad con fracciones exactas, lo que teclea el alumno, errores típicos, contextos con su cota)

Actualizado: 2026-11-19 (adaptada a la unidad 7 por la montadora del reparto de la unidad 7, s-20261118T221619-b66ec280, que la dio de alta el 18-11 a partir de la ficha 144 de la unidad 6, con sus trampas; **todo el contenido es la propuesta de partida de la montadora hasta el acta de la 02 de la U7**, que no existe)
Precondición: tarea 01 del reparto de la unidad 7 LISTA (existe la propuesta de inventario `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/inventario-unidad7.tsv`; con F0 firmada, mejor: ids definitivos y acta, que dice si la práctica `unidades` existe) · no en paralelo con otra tarea que toque `catalogo.js`, `portada.js` o `registro.js` (a 19-11: 203, 204, 206 y 207 si siguen EN CURSO, y cualquier publicación de la U3 a la U6; míralo en `hechos/` y en `.claude/sesiones/`) · Disparo: MANUAL (sesión atendida) · **Plazo: mar 22-12 (ideal; las quince prácticas van detrás y el paquete 1 se publica antes del mié 24-2); límite vie 5-2**
Duración esperada: 1 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/211-base-unidad7/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/proporcion.js` (nuevo), `practicas/_comun/catalogo.js` (quince filas, ids 84-98, y la unidad 7 en `UNIDADES`, con su comentario), `practicas/portada.js` (seis bloques y quince descripciones de la U7), `practicas/_comun/registro.js` (`DESTREZAS` de la U7 y su comentario), `practicas/<slug>/` de los quince slugs (solo el esqueleto: `index.html` y `practica.js`), `docs/practicas-unidad7.md` (nuevo, §7), `tests/practicas-proporcion.test.js` (nuevo), `tests/practicas-comun.test.js` (lista del catálogo y total de ejercicios de la U7), `tests/practicas-semana.test.js` (`UNIDADES`, `unidadActual` el 28-2 y el 1-3, y el test de los bloques), `tests/practicas-registro.test.js` (leer también la tabla de la U7), `tests/practicas-editor.test.js` (`tareasPorUnidad` cuenta las unidades) y, solo si hace falta, `tests/practicas-espacio.test.js` (`unidadesCon`: lección de la 98; mira la trampa de abajo)

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
   printf 'sesión: %s\ntarea: 211\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/211--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/211--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 211 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/211--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Preparar lo común para las quince prácticas de la **unidad 7, Proportionality and percentages** (tareas 212-226), de forma que
ninguna de ellas tenga que escribir en un fichero común y puedan ir las quince en paralelo (lección del 8-10: «un fichero común
con candado no se reparte entre sesiones en paralelo»). Es lo que la 98 fue para la unidad 4, la 122 para la 5 y la 144 para la
6: lee la ficha y la ENTREGA de la 144, que es el molde más reciente (`practicas/_comun/algebra.js`, 905 líneas, y
`tests/practicas-algebra.test.js`, 11 tests, son lo que hay que calcar en forma: módulo puro, cabecera con la API, errores con
nombre que devuelven `null`, `distractores`, `NO_ES_ERROR`, huella).

La unidad se da del **lun 1-3 al vie 23-4-2027** en **cinco paquetes** (el 3, doble: sesiones 9-11 antes de las vacaciones y
12-14 después), y la app lleva **seis tareas semanales** (lunes 1-3, 8-3, 15-3, 5-4, 12-4 y 19-4). «Semana N» en la portada
quiere decir «paquete N».

El catálogo de la unidad 7 (diseño de la montadora del 18-11, sección «Tareas 211-233» de `proyecto.md`; **propuesta hasta el
acta de la 02 de la U7**; Juan Luis puede cambiarlo):

| id | slug | nombre (es / en) | nEjercicios | paquete (bloque de la portada) | destrezas (descripción; ids tras F0) |
|---|---|---|---|---|---|
| 84 | `razones` | Razones y proporciones / Ratios and proportions | 4 | 1 | escribir la razón de una situación (parte-parte y parte-todo: 2 chicos por cada 3 chicas → 2/5 de la clase son chicos); razones equivalentes y la más sencilla; ¿forman proporción? (productos cruzados); el término que falta (`3/4 = x/20`, `x = 15`) |
| 85 | `tabla-proporcional` | Tablas de proporcionalidad / Proportion tables | 4 | 1 | ¿es una tabla de proporcionalidad directa? (cociente constante; cazar la que suma en vez de multiplicar); completar la tabla; la constante (el precio por unidad); situaciones que son o no son directamente proporcionales (kilos y precio, sí; edad y altura, no) |
| 86 | `regla-de-tres` | Problemas de proporcionalidad directa / Direct proportion problems | 4 | 1 | reducción a la unidad (¿cuánto cuesta 1?); elegir el planteamiento correcto de la regla de tres; resolver y contestar con la unidad (campo); ¿tiene sentido la respuesta? |
| 87 | `inversa` | Proporcionalidad inversa / Inverse proportion | 4 | 2 | ¿es una tabla de proporcionalidad inversa? (producto constante); completar la tabla; problemas de un paso (obreros y días, grifos y horas, velocidad y tiempo: todos al mismo ritmo, dicho en el enunciado); cazar el error de tratarla como directa |
| 88 | `directa-o-inversa` | ¿Directa, inversa o ninguna? / Direct, inverse or neither? | 3 | 2 | clasificar situaciones (tres casillas); clasificar tablas; elegir el planteamiento que corresponde a un problema |
| 89 | `repartos` | Repartos proporcionales / Sharing in a ratio | 4 | 2 | cuántas partes hay en total; cuánto vale una parte; repartir una cantidad en la razón 2 : 3 (dos campos); comprobar que las partes suman el total; cazar el error de repartir a partes iguales |
| 90 | `tres-escrituras` | Porcentaje, fracción y decimal / Percentage, fraction, decimal | 4 | 3 (tarea del 15-3) | pasar de porcentaje a fracción irreducible y a decimal y al revés; emparejar las tres escrituras; ordenar; los porcentajes fáciles (50, 25, 10, 20, 75 y 1 %) como fracción |
| 91 | `tanto-por-ciento` | El tanto por ciento de una cantidad / Percentage of an amount | 4 | 3 (tarea del 15-3) | cálculo mental (10 %, 50 %, 25 %, 1 % y sus múltiplos); con el decimal (`0,15 · 80 = 12`); elegir la operación que lo calcula; problemas de un paso |
| 92 | `que-porcentaje` | ¿Qué porcentaje? ¿De cuánto? / What percentage? Of how much? | 4 | 3 (tarea del 15-3) | qué porcentaje es una cantidad de otra; hallar el total cuando se conoce el porcentaje; ¿cuál de los tres problemas es? (la parte, el porcentaje o el total); problemas de un paso |
| 93 | `descuentos` | Descuentos y aumentos / Discounts and increases | 5 | 3 (tarea del 5-4) | el descuento y el precio final en dos pasos; el precio final en un paso (multiplicar por 0,80 o por 1,21); el IVA (4, 10 y 21 %); ¿piden el descuento o el precio final?; cazar el error («sube un 20 % y baja un 20 %: se queda igual») |
| 94 | `escalas` | Escalas / Scales | 4 | 4 | del plano a la realidad (con el cambio de unidad); de la realidad al plano; hallar la escala; elegir la escala sensata para un plano, un mapa o una maqueta |
| 95 | `unidades` | Cambia de unidad / Converting units | 5 | 4 | longitud; masa y capacidad (con dam, hm, dag, hg, daL, hL); superficie (cada salto, por 100); de complejo a incomplejo y al revés; elegir la unidad sensata. **Solo si el acta deja las unidades de medida en la U7** |
| 96 | `problemas-proporcion` | Problemas de toda la unidad / Mixed problems | 5 | 5 | ¿qué tipo de problema es? (directa, inversa, porcentaje, reparto, escala); velocidad, tiempo y distancia; cambio de moneda; el precio por unidad (la mejor oferta); interpretar la respuesta (la unidad, el redondeo, si tiene sentido) |
| 97 | `errores7` | Caza el error / Spot the mistake | 3 | 5 (toda la unidad) | los errores típicos de la unidad como resoluciones con un paso mal (sumar en vez de multiplicar, la inversa tratada como directa, `20 % = 0,02`, dar el descuento por el precio final, la escala sin cambio de unidad, el salto de superficie por 10) |
| 98 | `leelo7` | Léelo en inglés / Say it in English | 4 | toda la unidad (se publica con el paquete 1) | vocabulario: ratio, proportion, directly / inversely proportional, unit rate, per, for every, out of, percentage, discount, increase, decrease, sale price, VAT, scale, share in the ratio; leer `3/4` como razón (*three to four*), `20%` (*twenty per cent*) y `1 : 50 000` (*one to fifty thousand*); las consignas de examen |

Son 61 ejercicios (4 + 4 + 4 + 4 + 3 + 4 + 4 + 4 + 4 + 5 + 4 + 5 + 5 + 3 + 4); sin `unidades`, 56.

**La práctica `unidades` (id 95) depende del acta.** Si al reclamar esta tarea el acta existe y deja las unidades de medida en la
U7, se hace como las demás. Si el acta las manda a la U8, **no se crea ni su fila ni su esqueleto**: el id 95 queda reservado
(no se reutiliza ni se renumera nada), la U7 tiene catorce prácticas y 56 ejercicios, `cambiarUnidad` se queda en `proporcion.js`
solo con lo que las escalas necesitan (km, m, cm, mm), y lo dices en la ENTREGA. Si el acta todavía no existe (F0 sin firmar), se
crean la fila y el esqueleto con `disponible: false`, que no ve nadie, y la ENTREGA dice que la 230 no la publica sin el acta.

Sin práctica, a propósito: la lectura en voz alta (va a `leelo7`), y lo que hoy es punto a decidir de la 02 o está fuera de la
unidad (la proporcionalidad compuesta, los repartos inversos, el interés, los porcentajes encadenados más allá de lo que el acta
admita en `descuentos`, «el precio antes de la rebaja», las unidades de volumen y de tiempo): si el acta los admite, se proponen
en la ENTREGA como ejercicio extra de la práctica que toque, no como práctica nueva; si el acta **quita** algo de la tabla (la
inversa, los repartos, la velocidad, el cambio de moneda), su fila se crea igual con `disponible: false` y la ENTREGA lo dice,
para que la coordinadora recorte la ficha o marque la tarea como SUSTITUIDA. Si el §7 de `docs/practicas-unidad7.md` reparte las
destrezas de otra manera, el §7 manda y esta tabla se corrige en la ENTREGA.

## Siguiente paso

1. Lee la ficha de la tarea 144 (`tareas/tarea-144-base-unidad6.md`) y su `salidas/144-base-unidad6/ENTREGA.md` (la tabla de la API de `algebra.js` es el formato de la tuya) y, por encima, las de la 98 y la 122 (`salidas/98-base-unidad4/`, `salidas/122-base-unidad5/`): son el molde exacto (esqueletos, bloques, `DESTREZAS`, docs §7, tests, trampas de `UNIDADES`). Lee `practicas/_comun/algebra.js` (la forma del módulo), `practicas/_comun/fracciones.js` (`Fraccion`, `aFraccion`, `htmlFraccion`, `leerFraccion`, `sonEquivalentes`, `productosCruzados`, `fraccionDelDato`, `parteEntreElResto`: las razones y los porcentajes son fracciones exactas y se apoyan en él), `practicas/_comun/decimales.js` (`Decimal`, `aDecimal`, `aTexto` con coma o punto según el idioma, `dinero(d, idioma)`, `redondear` —5 o más, hacia arriba—, `aFraccion`, `deFraccion`, `mismoValor`: el dinero y los decimales exactos salen de ahí; **no los reescribas**; a 19-11 `aTexto` no separa los millares, así que el espacio fino lo pone `proporcion.js`), `practicas/_comun/aritmetica.js` (`mcd`, `mcm`), `practicas/_comun/piezas.js` (`leerNumero` solo lee naturales: no se toca; la cantidad se lee aparte) y `docs/no-lo-se.md` (los esqueletos tienen que declarar el «No lo sé»: punto 4 de abajo).
2. Lee `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/inventario-unidad7.tsv` (la propuesta de la 01, o el aprobado si la 02 ya cerró) y, si existe, el acta `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/inventario-unidad7-revision.md` (qué entra, el método, la notación, las cotas, si las unidades de medida van en la U7 y los ids que cambiaron): de ahí salen los ids de cada práctica. **Si el acta existe, manda sobre esta ficha**; si no existe, esta ficha es la propuesta y lo marcado como punto a decidir no entra.
3. `git status -sb` y `git log --oneline -3 -- practicas/_comun/ practicas/portada.js`: si hay cambios sin commit en esos ficheros que no son tuyos, no los pises y avisa. Mira `.claude/sesiones/` por si otra sesión tiene reservado `catalogo.js` (a 19-11 lo tocan la 203, la 204, la 206 y la 207, y lo tocará cada publicación de la U3 a la U6).

## Qué hay que hacer

1. **`practicas/_comun/proporcion.js`** (nuevo, puro, sin DOM, con la API en la cabecera, como `algebra.js`), con su test `tests/practicas-proporcion.test.js`. Todo valor es una `Fraccion` de `fracciones.js` (o un entero; **el dinero, en céntimos enteros**); ningún `Number` con coma, ningún `toFixed`, ningún `eval` ni `Function`. Piezas:
   - **La cantidad con unidad**: `Cantidad(valor, unidad)` inmutable (`cantidad(…)`, `aCantidad(x)`), con `unidad` nula (un número), `'%'`, `'€'` o una unidad de la tabla `UNIDADES_MEDIDA` (longitud: km, hm, dam, m, dm, cm, mm; masa: kg, hg, dag, g, dg, cg, mg; capacidad: kL, hL, daL, L, dL, cL, mL; superficie: km², hm², dam², m², dm², cm², mm²; tiempo: h, min; y las compuestas que usan los problemas: km/h, €/kg, L/100 km). Cada unidad declara su magnitud, su símbolo (el del SI, el litro con `L` mayúscula), su nombre en los dos idiomas (*metres, litres*, británico) y su **factor exacto** a la unidad base (potencias de 10; de 100 en superficie; 60 en el tiempo). `valorBase()`; **`mismoValor(a, b)`**: misma magnitud y mismo valor en la unidad base, con `p %` como la fracción `p/100` (`20 %` = `0,2` = `1/5`; `3/4` = `6/8` = `0,75` = `75 %`; `2,5 km` = `2500 m`; `12 €` = `12,00 €`; `1,5 h` = `1 h 30 min`); `0,33` nunca es `1/3`. Es la comparación de la regla 1: la usan `distractores`, los tests de las quince prácticas y la corrección de lo que se teclea.
   - **Lo que teclea el alumno**: `leerCantidad(texto, { unidad, magnitud, idioma, razon })` → `{ ok: true, valor, escrito }` o `{ ok: false, motivo, mensaje: { es, en } }`, y `deTexto(texto, opciones)` → `Cantidad` o `null` (como `leerExpresion` y `deTexto` de `algebra.js`). Acepta `20 %`, `20%`, `0,2`, `0.2`, `1/5`, `12 €`, `12,00 €`, `12.00`, `€12`, `12 euros`, `2,5 km`, `2500 m`, `2 500 m`, `1 h 30 min`, la unidad en mayúsculas o minúsculas (`KM`, `l`, `ml`) y, **solo con `razon: true`**, `3 : 4`, `3:4`, «3 a 4» y *3 to 4* (escalas y repartos: `1 : 50 000`, `1:50000`). Si el campo ya lleva la unidad o el signo (`{ unidad: '%' }`), el número solo vale (`20`). Motivos de rechazo, cada uno con su mensaje: `vacio`, `basura`, `unidad-que-no-toca` (metros en un campo de euros), `dos-comas`, `millares-con-punto` (`50.000` es ambiguo: «escribe 50000 o 50 000»), `periodico` (`0,333…`: nunca), `division-entre-0`, `expresion` (una cuenta sin hacer, `0,2 · 150`). **Guarda lo que se escribió** (`6/8` sigue siendo `6/8`: la práctica que pida «la razón más sencilla» o «la fracción irreducible» mira `escrito`); el valor, siempre exacto.
   - **La escritura**: `aTexto(x, idioma, opciones)` y `aHtml(x, idioma, opciones)` con la notación de la regla 3: `20 %` en español (con espacio de no separación) y `20%` en inglés; coma decimal en español y punto en inglés; **espacio fino (U+202F) entre grupos de tres desde las cinco cifras** (`50 000`, `1 000 000`) y los de cuatro sin separar (`2500`), en los dos idiomas; el dinero, con dos decimales (con `dinero` de `decimales.js`); la unidad separada del número con espacio de no separación (`3,5 km`, `90 km/h`); `razonATexto(a, b, idioma, forma)` con `forma` = `'fraccion'` (`htmlFraccion`), `'palabras'` («3 a 4» / *3 to 4*), `'de-cada'` («3 de cada 4» / *3 out of 4*) o `'dos-puntos'` (`3 : 4`, **solo escalas y repartos**); `escalaATexto(50000)` → `1 : 50 000`; `enPalabras(x, idioma)` y `lecturasValidas(x, idioma)` para lo que `leelo7` pide (*twenty per cent* / *percent*; *three to four*; *one to fifty thousand*). Ninguna función escribe `×`, ni un periódico, ni `1.5` en español.
   - **Las cuentas, cada una con sus pasos** (`{ resultado, pasos }`; `pasos` es la lista de líneas para el feedback y para el «No lo sé», **una operación por línea**): `sonProporcion(a, b, c, d)` y `terminoQueFalta(…)` (por productos cruzados: `3/4 = x/20` → `4x = 60` → `x = 15`; nunca despejando una `x` del denominador); `esTablaDirecta(tabla)`, `esTablaInversa(tabla)` y `constante(tabla)`; `proporcionDirecta({ a, b, c }, metodo)` con `metodo` = `'unidad'` (3 kg cuestan 4,50 € → 1 kg, `4,50 : 3 = 1,50 €` → 5 kg, `1,50 · 5 = 7,50 €`), `'regla-de-tres'` (las dos filas `3 kg ⟶ 4,50 €` / `5 kg ⟶ x` y los productos cruzados) o `'constante'`: **los tres dan lo mismo y el test lo comprueba**; `proporcionInversa({ a, b, c })` (6 obreros, 10 días → 4 obreros: `6 · 10 = 60`, `60 : 4 = 15` días); `porcentajeDe(p, cantidad)` (el 20 % de 150 es 30; como fracción, como decimal y por el 10 % y el 1 %); `quePorcentaje(parte, total)` (30 de 150 es el 20 %; devuelve `null` si no sale un porcentaje exacto); `totalDesdePorcentaje(p, parte)` (el 20 % son 30 → 150); `aplicarPorcentaje(cantidad, p, 'descuento' | 'aumento')` → `{ cambio, final, factor, pasosDosPasos, pasosUnPaso }` (45 € con un 20 % de descuento: 9 € y 36,00 €, o `45 · 0,80`; 50 € más el 21 % de IVA: 10,50 € y 60,50 €, o `50 · 1,21`); `repartir(total, [2, 3])` → las partes, el valor de una parte y la comprobación (120 € en la razón 2 : 3 → `120 : 5 = 24`, 48 € y 72 €; `null` si no sale exacto al céntimo); `realidad(medidaEnElPlano, escala, unidad)`, `enElPlano(medidaReal, escala, unidad)` y `hallarEscala(plano, real)` (3 cm a escala `1 : 50 000` son 150 000 cm = 1,5 km); `cambiarUnidad(cantidad, unidad)` con los saltos como pasos, `aComplejo(cantidad)` y `aIncomplejo(partes, unidad)` (`1,5 h` = 1 h 30 min; 3 km 250 m = 3250 m); y `redondear(x, cifras)` **al más cercano, la mitad hacia arriba** (apoyado en el de `decimales.js`), que solo se usa cuando el enunciado lo pide.
   - **Los errores típicos** de la regla 4, cada uno como función con nombre que da el resultado equivocado con los números del ítem, y la tabla `ERRORES_TIPICOS[id]` = `{ fn, devuelve, ejemplo, nombre: { es, en } }` como la de `algebra.js` (el id vale como `error` de `api.responder`): `razonar-sumando` (2 cuestan 5 € → 4 cuestan `5 + 2 = 7 €`, en vez de 10 €), `invertir-razon` (`4/3` por `3/4`), `parte-parte-como-parte-todo` (2 a 3 → 2/3 de la clase, en vez de 2/5), `productos-en-linea` (multiplicar numerador por numerador en vez de en cruz), `directa-en-inversa` (6 obreros, 10 días → 3 obreros: `10 : 2 = 5` días, en vez de 20) e `inversa-en-directa`, `no-proporcional-como-proporcional`, `dividir-entre-el-porcentaje` (el 20 % de 50 → `50 : 20 = 2,5`, en vez de 10), `porcentaje-entre-mil` y `porcentaje-sin-dividir` (`20 % = 0,02` y `= 2`), `porcentaje-entre-diez` (`5 % = 0,5`), `restar-el-porcentaje-como-numero` (`50 − 20 = 30`, en vez de 40), `descuento-por-precio-final` (9 € por 36,00 €) y `precio-final-por-descuento`, `aumento-por-descuento`, `sube-y-baja-se-queda-igual` (100 € → 120 € → 96 €, no 100 €), `sumar-encadenados` (solo si el acta admite los encadenados), `porcentaje-del-dato` (el 20 % son 30 → 6, en vez de 150), `porcentaje-al-reves` (150 de 30) y `fraccion-sin-pasar-a-porcentaje` (30 de 150 → `0,2` o `1/5` **cuando se pide el porcentaje**), `reparto-a-partes-iguales` (60 € y 60 €) y `reparto-sin-sumar-las-partes` (`120 : 2` y `120 : 3`), `escala-al-reves` (dividir cuando toca multiplicar), `escala-sin-cambio-de-unidad` (150 000 km), `subir-por-bajar` (m → km multiplicando), `superficie-por-diez`, `hora-decimal-como-minutos` (`1,5 h` → 1 h 50 min) y `contestar-otra-cosa` (la parte del otro, el precio de 1 kg cuando piden el de 5). **Cada función devuelve `null` cuando da lo mismo que la respuesta correcta, cuando no se aplica o cuando su resultado no es exacto** (un periódico nunca es una opción: `directa-en-inversa` con 6 obreros, 10 días y 4 obreros daría 6,666…, y devuelve `null`). Los ids definitivos, con la columna `nota` del inventario delante.
   - **`NO_ES_ERROR`** (lo que nunca es distractor ni fallo): una escritura equivalente cuando no se pide la forma, otro método, *percent* por *per cent*, `12 €` por `12,00 €`, una razón sin simplificar cuando no se pide la más sencilla, la misma cantidad en otra unidad cuando no se pide la unidad. **`distractores([[id, …args], …], correcta)`** (sin los `null`, sin lo que valga lo mismo que la correcta y sin dos iguales entre sí, **por `mismoValor`**) y **`hayEquivalentes(lista)`**, como en `algebra.js` y `decimales.js`.
   - **`huella(s)`** (la misma FNV-1a de `practicas/equivalentes/logica.js` y de `algebra.js`; el test lo comprueba) y **`huellaCaso(tipo, datos)`**, sobre el caso **normalizado por valor** de la regla 9 (tipo de problema y datos como fracciones irreducibles en un orden fijo: «el 20 % de 150», «el 20 % de 150 €» y «0,2 · 150» dan la misma; `3/4 = x/20` y `x/20 = 3/4`, también).
   - **`CONTEXTOS`**: el banco de contextos con **la cota de cada uno**, con la forma de `src/ejercicios/contextos_mcd_mcm.js` (léelo: cada contexto declara `id`, tipo, unidades `{ es, en }`, `rango` con sus mínimos y máximos, `origen` y el enunciado en los dos idiomas con las llaves de los datos y, en inglés, la palabra no matemática aclarada entre paréntesis). Las cotas de partida son las de la regla 7 de abajo, una por contexto: la compra al peso (0,80-6 €/kg, 0,5-5 kg), las recetas (2-12 personas, 50-1000 g, 0,1-2 L, 1-12 huevos), el consumo del coche (4-9 L cada 100 km, hasta 1000 km), los descuentos de una tienda (10, 15, 20, 25, 30, 40, 50, 60 y 70 %; una prenda 5-120 €, un móvil 80-1200 €), el IVA (4, 10 y 21 %), las subidas (1-20 %), un porcentaje de un grupo (1-99 %, **personas enteras**), los obreros, pintores, máquinas y grifos (1-12; 1-60 días o 1-24 horas; «todos al mismo ritmo» en el texto), los repartos (2-4 personas, proporcional a algo dicho, exacto al céntimo), las escalas (planos `1 : 50`, `1 : 100`, `1 : 200`; mapas de `1 : 25 000` a `1 : 1 000 000`; maquetas `1 : 18`, `1 : 24`, `1 : 43`, `1 : 87`; 0,5-30 cm en el plano), las velocidades (a pie 3-6 km/h, corriendo 8-15, en bici 10-30, en coche 30-120, en tren 80-300, en avión 700-900) y el cambio de moneda (un tipo inventado y dicho en el enunciado, entre 0,80 y 1,30). Con `generarDatos(contexto, rng)` (elige **primero la constante o el resultado** para que todo salga exacto) y `dentroDeCota(contexto, datos)`, que es lo que afirman los `assert` de las prácticas. Solo situaciones que **son** de proporcionalidad (regla 7). Los personajes, de una lista `NOMBRES` inventada (ningún nombre de alumno: lo vigila `tests/sin-nombres-de-alumnos.test.js`). **Qué contextos usa la app y cuáles se quedan en el papel es punto a decidir de la 02**: hasta el acta, el banco lleva los que piden las fichas 212-226 y la ENTREGA lista cuáles son.
2. **Test** de `proporcion.js`: una tabla de 40 casos calculados a mano (los ejemplos de esta ficha, entre otros) y 3000 casos aleatorios contra aritmética entera propia (`BigInt`) **por un segundo camino** (la regla de tres contra la constante; el precio final contra «precio menos descuento»; el reparto contra «las partes suman el total»; la escala de ida contra la de vuelta; el cambio de unidad de ida y vuelta); `mismoValor` con tabla (todas las parejas de la regla 1 y las que **no** lo son: `0,33` y `1/3`; `20 %` y `20`); `leerCantidad` con tabla (los dos idiomas, todas las escrituras aceptadas, cada motivo de rechazo); `aTexto` con tabla (el `%` según el idioma, el espacio fino, el dinero); cada error típico con su ejemplo y distinto del correcto cuando no devuelve `null`, en 3000 casos; `distractores` sin iguales entre sí ni con la correcta; `CONTEXTOS`: todos con cota, los dos idiomas completos, sin `×`, y 500 juegos de datos por contexto dentro de su cota y con resultado exacto (personas enteras, dinero al céntimo, porcentaje exacto).
3. **Catálogo** (`practicas/_comun/catalogo.js`): las quince filas de la tabla de arriba (catorce si el acta manda las unidades a la U8), `unidad: 7`, **`disponible: false`**, en ese orden, después de las filas de la U6 (69-79) y antes de la plantilla (id 31). Los ids 84-98 están libres a 19-11 (el mayor en uso es el 83, `tabla-propiedades`: `grep -o "id: [0-9]*" practicas/_comun/catalogo.js | sort -k2 -n | tail -3`; compruébalo al reclamar y, si otra tarea ha tomado alguno, para y dilo: los ids los dio Juan Luis). Y en `UNIDADES`, detrás de la 6, `{ n: 7, desde: '2027-03-01', titulo: { es: 'Proporcionalidad y porcentajes', en: 'Proportionality and percentages' } }`, con su fecha añadida al comentario de encima (hoy dice «el 16-11, el 14-12, el 18-1 y el 1-2 la portada cambia sola»). **Añadir una unidad rompe tests que cuentan unidades** (lección de la 98; lo que tocó de verdad la 144, abajo en las trampas).
4. **Un esqueleto por práctica**: `practicas/<slug>/` para los quince slugs, con `index.html` y `practica.js`, calcados de los que dejó la 144 (`git show 9a3dac2:practicas/traduce/practica.js`, 25 líneas, y su `index.html`): cargan, declaran su `slug` y sus `nEjercicios` con los nombres de los ejercicios de cada ficha (212-226) y enseñan «Este ejercicio está en preparación». **Novedad respecto a la 144**: desde que cerró la revisión 193 del «No lo sé», `tests/practicas-no-lo-se.test.js` carga **todas** las filas del catálogo, también las que tienen `disponible: false`, y exige que cada ejercicio declare `explicacion` o `sinAyuda` (y `base.js` exige que `sinAyuda` sea una frase de 10 caracteres o más): cada ejercicio del esqueleto lleva `sinAyuda: 'Esqueleto en preparación: la explicación la escribe la tarea NNN.'`, que la tarea de la práctica sustituye por su `explicacion` (las quince prácticas llevan el botón «No lo sé», M22, desde el principio). **Desde que esta tarea esté LISTA, cada carpeta es de su tarea (212-226)**; escríbelo en la ENTREGA.
5. **Portada** (`practicas/portada.js`): seis bloques de la unidad 7, `unidad: 7`, detrás de los de la U6 (con el comentario «Unidad 7 (PU2, tarea 211): cada práctica sale en su bloque cuando su tarea de publicación la publica (227-231)»): «Semana 1 · Razones, proporciones y proporcionalidad directa» / «Week 1 · Ratios, proportions and direct proportion»: `razones`, `tabla-proporcional`, `regla-de-tres`; «Semana 2 · Proporcionalidad inversa y repartos» / «Week 2 · Inverse proportion and sharing in a ratio»: `inversa`, `directa-o-inversa`, `repartos`; «Semana 3 · Porcentajes» / «Week 3 · Percentages»: `tres-escrituras`, `tanto-por-ciento`, `que-porcentaje`, `descuentos`; «Semana 4 · Escalas y unidades de medida» / «Week 4 · Scales and units»: `escalas`, `unidades`; «Semana 5 · Problemas de toda la unidad» / «Week 5 · Mixed problems»: `problemas-proporcion`; «Para toda la unidad · Errores y vocabulario» / «For the whole unit · Mistakes and vocabulary»: `errores7`, `leelo7`. («Semana N» es el paquete N; el bloque 3 dura dos semanas de clase, con las vacaciones en medio.) Y una línea de `DESCRIPCION` por práctica, en los dos idiomas, sacada de la ficha de su tarea: **sin fracciones con barra, sin guion delante de una cifra y sin `×`** (los tests de la portada de las unidades anteriores lo comprueban con `/-\d|×|\d\/\d/`: escribe «tres cuartos» o «del 1 al 20 %», no `3/4` ni `1-20 %`). Añade a `tests/practicas-semana.test.js` el test de los bloques de la U7, calcado del de la U6 (los de la U2-U6 y la sección «Ortografía» se conservan tal cual).
6. **Destrezas** (`practicas/_comun/registro.js`, `DESTREZAS`, y el comentario de encima, que cita cada unidad): las de la unidad 7 con los ids completos (`U7-1C-03`…), y **`docs/practicas-unidad7.md`** con su §7 («Qué práctica cubre qué destreza de la unidad 7», mismas columnas que el de la unidad 6, una fila por destreza del inventario, también las que no tienen práctica, con sus apartados «Lo que este reparto añade a las fichas» y «Destrezas de la unidad 7 sin práctica»); añade `[7, 'practicas-unidad7.md']` a la lista que recorre `tests/practicas-registro.test.js` (hoy llega hasta `[6, 'practicas-unidad6.md']`) y pon al día el nombre del test. El resto del documento lo escriben las tareas de publicación: deja los apartados con «Por escribir (tareas 227-231)». Si al cerrar F0 sigue sin firma, los ids son los de la propuesta: dilo en la ENTREGA y la 227 lo comprueba antes de publicar.
7. **`tests/practicas-comun.test.js`**: la lista del catálogo con las quince filas nuevas (es el test que fija ids, slugs y número de ejercicios), detrás de las de la U6 y antes de `[31, 'plantilla', 2]`, y el bloque de la unidad (`CATALOGO.filter(p => p.id >= 84 && p.id <= 98)`: todas `unidad === 7`, no transversales y **61 ejercicios** en total; 56 con ids 84-94 y 96-98 si no hay `unidades`).
8. **Los tests que cuentan unidades**: en `tests/practicas-semana.test.js`, `UNIDADES.map(u => u.n)` pasa a `[1, 2, 3, 4, 5, 6, 7]` y se añaden `unidadActual('2027-02-28') === 6` y `unidadActual('2027-03-01') === 7`; en `tests/practicas-editor.test.js`, la lista de `tareasPorUnidad` (`[1, 1, 0, 0, 0, 0]`) gana un cero.

## Datos de entrada

- El inventario de la unidad 7 (propuesta de la 01 o aprobado tras la 02), solo lectura: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/inventario-unidad7.tsv`; el acta `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/inventario-unidad7-revision.md` (léela entera si existe: a 19-11 no existe); la secuenciación `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/secuenciación-unidad7.pdf` (la escribe la 01); `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/reparto-unidad7/proyecto.md` (reglas de contenido, notación y cotas).
- `reparto-practicas-u2/tareas/tarea-212-razones.md` a `tarea-226-leelo7.md`: lo que cada práctica va a pedir a `proporcion.js` (léelas por encima antes de fijar la API; si una pide algo que aquí no está, entra en la base y se dice en la ENTREGA).
- `tareas/tarea-144-base-unidad6.md` y `salidas/144-base-unidad6/ENTREGA.md`, `practicas/_comun/algebra.js`, `tests/practicas-algebra.test.js` y `docs/practicas-unidad6.md` (el molde más reciente); `tareas/tarea-98-base-unidad4.md`, `tareas/tarea-122-base-unidad5.md` y sus ENTREGA; `practicas/_comun/fracciones.js`, `decimales.js` (existe desde la 122: `Decimal`, `dinero`, `redondear`) y `aritmetica.js`; `src/ejercicios/contextos_mcd_mcm.js` y `tests/contextos-mcd-mcm.test.js` (el modelo de las cotas por contexto y de su test); `practicas/problemas-ecuaciones/logica.js` (contextos con `cota: { min, max }` y dinero en céntimos, en una práctica).
- **Material de otros cursos de Juan Luis** (un vistazo; no es obligatorio usarlo): la sección 5 («banco de contextos») de `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/reparto-unidad7/hechos/notas/s-20261118T221619-b66ec280-inventario-material-otros-cursos.md` es la cantera de contextos para `CONTEXTOS`, con números nuevos y pasados por las cotas (la nota dice que 22 de sus problemas fallan el realismo: nada se copia sin filtrar).

## Cómo saber que ha terminado

- `npm test` sin fallos (el árbol entero: con los esqueletos, todas las filas cargan, también en `tests/practicas-no-lo-se.test.js`).
- `node --test tests/practicas-proporcion.test.js` en verde, con la tabla a mano y los 3000 casos.
- En local (`npm run servir`), la portada no enseña nada nuevo (todo `disponible: false`; la U7 no llega hasta el 1-3), y una página de prueba tuya (no comiteada) pinta `20 %`, `1 : 50 000`, una razón como fracción y `12,00 €` con `aHtml()` en los dos idiomas y lee lo que se teclea con `leerCantidad` a 375 px.

## Trampas conocidas (211)

- **La unidad 7 no aparece en la portada hasta el 1-3** (`UNIDADES.desde`): para verla antes en local, pásale a `unidadActual` una fecha de prueba o mira `bloquesPublicados(CATALOGO, 7)` en la consola.
- (U6, tarea 144) Si otra sesión tiene reservado `catalogo.js` (una publicación, una reabierta o una sesión de Juan Luis fuera del reparto), espera o haz antes todo lo demás (`proporcion.js`, esqueletos, docs) y deja el catálogo para el final del commit.
- (U6, tarea 144; aquí con cantidades) El teclado del móvil: el alumno teclea la coma o el punto, con o sin espacio antes del `%` y de la unidad, `€` delante o detrás, la unidad en mayúsculas o minúsculas, y el espacio de los millares o ninguno: acepta todo eso; rechaza lo ambiguo (`50.000`) con un mensaje claro. `inputmode="decimal"` solo en los campos que no admiten `%`, `/`, `:` ni unidad; en los demás, `inputmode="text"`.
- (U6, tarea 144) Para probar en el navegador sin dejar nada en el árbol compartido: servir una carpeta del scratchpad con enlaces a `practicas/`, `css/`, `src/`, `divisores/` y `herramientas/`; Chrome guarda en caché los módulos: `fetch(url, { cache: 'reload' })`. Sin la extensión: Chrome headless con perfil propio (`--user-data-dir=<scratchpad>/perfil`), matando el proceso al acabar (un headless huérfano bloquea el Chrome normal). En este Mac no hay `timeout`.
- (U6, tarea 144) En Chrome headless, `--screenshot` sale antes de que cargue la base (se ve «Cargando…»); para ver un esqueleto, `--virtual-time-budget=15000 --dump-dom "…/practicas/<slug>/?probar=1"`.
- (U6, tarea 144) En zsh una variable con varias rutas no se parte en palabras: `F=(a b c); git commit -m "…" -- "${F[@]}"`.
- (U6, tarea 144) **El test de `practicas-espacio` no hizo falta tocarlo** (tampoco en la 122); los que sí cambiaron al añadir una unidad fueron `practicas-editor` (`tareasPorUnidad`), `practicas-semana` (`UNIDADES`, `unidadActual` y el test de los bloques), `practicas-comun` (la lista y el total de ejercicios) y `practicas-registro` (la tabla de la unidad). El commit de la 144 (`9a3dac2`, 32 ficheros) es la lista exacta: `git show --stat 9a3dac2`.
- (previsión de la montadora, leída en el código el 19-11, sin ejecutar) `tests/practicas-espacio.test.js`, en «unidadesCon: títulos comunes y fechas del profesor», usa `{ n: 7, desde: '2027-01-01' }` como ejemplo de **unidad que no existe**. Con la U7 en `UNIDADES` deja de serlo; a ojo los `assert` siguen pasando (el 20-12 la actual sigue siendo la 2), pero el ejemplo ya no prueba lo que quería: cámbialo por una unidad que no exista (`n: 9`) y dilo en la terminada.
- (previsión de la montadora, leída en el código el 19-11, sin ejecutar) El esqueleto de la 144 es anterior al botón «No lo sé»: copiado tal cual, hoy rompe `tests/practicas-no-lo-se.test.js` («falta «explicacion» (o «sinAyuda» con el motivo)»). Lleva `sinAyuda` en cada ejercicio (punto 4).
- (U6, tarea 144; traducida a esta unidad) **El lector guarda lo que se escribió, sin simplificar**: en álgebra, simplificar `6/4` al leer hizo que `pasos()` se inventara un paso. Aquí, si `leerCantidad` simplifica `6/8` a `3/4` o pasa `0,75` a fracción y olvida la forma, ya no se puede corregir «la razón más sencilla», «escribe como porcentaje» ni «expresa en metros». El valor se compara aparte, con `mismoValor`.
- (U6, tarea 144; traducida a esta unidad) **`distractores` compara todo en el mismo espacio**: en álgebra, `x = 13` y `13` salían como dos distractores distintos hasta que las ecuaciones se compararon por su solución. Aquí, `9 €`, `9,00 €`, `900 céntimos` y un `9` en un campo de euros son el mismo valor, y `0,2`, `1/5` y `20 %`, también.
- Duración real de la 144 en la U6: **~20 min** de la estimación de 1 h 30 min (8-11, s-20261108T104950-2488e1d7, con F0 sin firmar: los ids eran los de la propuesta, y dos días después hubo que quitar cinco de `DESTREZAS` con el acta). Esta base es mayor (quince esqueletos, unidades, dinero, contextos con cota), así que la estimación se queda en 1 h 30 min.

## Prohibido (propio de esta tarea)

- Escribir ninguna práctica de verdad (solo los esqueletos) o poner `disponible: true`.
- Cambiar lo que hacen hoy `leerNumero`, `campoNumero`, `enteros.js`, `fracciones.js`, `decimales.js`, `algebra.js`, el catálogo de las unidades 1-6, la ortografía o `tabla-propiedades`, o sus bloques.
- Usar `eval` o `Function` sobre lo que teclea el alumno, o calcular, comparar o mostrar con `Number` en coma flotante (`1.21 * 50`, `toFixed`): fracciones exactas y céntimos enteros siempre.
- Meter en la base lo que el acta deje fuera, o lo que hoy es punto a decidir sin que el acta lo admita (encadenados, «el precio antes de la rebaja», interés, repartos inversos, proporcionalidad compuesta, volumen).
- Un contexto sin cota, o una situación que no es de proporcionalidad (el corredor que mantiene el ritmo 42 km, la tarta que se hornea en la mitad de tiempo con el doble de temperatura).

## Salida esperada

- Los ficheros de «Ficheros que toca» comiteados, con `npm test` sin fallos.
- `reparto-practicas-u2/salidas/211-base-unidad7/ENTREGA.md` (hash, ficheros, la API de `proporcion.js` en una tabla, la lista de errores típicos con su ejemplo, la tabla de contextos con sus cotas, la tabla slug → ids definitivos de cada práctica, el traspaso de titularidad de las carpetas a las tareas 212-226, qué dejó provisional —F0, `unidades`— y cómo probarlo en 1 minuto) y su marcador `ENTREGA.md.ok-<sid>`.

## Reglas de contenido de la unidad 7 (copia de `proyecto.md` de su reparto; lo común no se lee, por eso va aquí)

Las reglas 2-4 y 8-9 de la lista de la unidad 2 (signos `·` y `:`, inglés, regla de oro, feedback, realismo) valen igual.
La fuente es `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/reparto-unidad7/proyecto.md` («Reglas de contenido comunes») y el acta
`/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/inventario-unidad7-revision.md`, **que todavía no existe**: la tarea 02 de aquel reparto la
escribe con Juan Luis (firma F0). **Si esta copia y el acta discrepan, manda el acta.** **Hasta el acta, todo lo que esta copia
dice de qué entra, en qué sesión, con qué notación y con qué cotas es la propuesta de partida de la montadora (18-11-2026)**, no
una decisión de Juan Luis, y **lo marcado como «punto a decidir» no entra en ninguna práctica**. La coordinadora pone al día
esta copia cuando exista el acta. Calendario de la unidad: del lun 1-3 al vie 23-4-2027, 23 clases en cinco paquetes; el
paquete 3 es doble (sesiones 9-11 del 15 al 18 de marzo y 12-14 del 5 al 8 de abril, con vacaciones del 19-3 al 2-4); pruebas
tipo test los viernes 5-3, 12-3, 9-4 y 16-4 y examen final el vie 23-4; y **seis tareas semanales de la app** (propuesta), una
por lunes lectivo (1-3, 8-3, 15-3, 5-4, 12-4 y 19-4), con entrega el jueves.

1. **Una misma razón tiene muchas escrituras, y todas son la misma respuesta.** `3/4`, `6/8`, `0,75`, `75 %` y «3 de cada 4»;
   `1/5`, `0,2` y `20 %`; «aumentar un 20 %» y «multiplicar por 1,2»; «rebajar un 25 %» y «pagar el 75 %»; la escala `1 : 50 000`
   y «1 cm son 500 m»; `1,5 h` y «1 h 30 min»; `2,5 km` y `2500 m`; `1,50 €/kg` y «2 kg por 3,00 €». Es la trampa propia de la
   unidad: una pregunta con `0,2` y `20 %` entre las opciones, o con `1/4` y `25 %`, tiene dos respuestas correctas. En cualquier
   ejercicio de elegir, emparejar o verdadero/falso, ninguna opción puede valer lo mismo que otra: el test lo comprueba **por
   valor**, con las fracciones exactas de `_comun/fracciones.js` (nunca `Number` en coma flotante), después de pasar cada opción
   a un número con su unidad (`p %` es la fracción `p/100`; una cantidad con unidad se pasa a la unidad base). El módulo base
   de la unidad será `practicas/_comun/proporcion.js`, que escribe la tarea 211: úsalo, no lo dupliques. Solo si el ejercicio
   evalúa la forma escrita («escribe como porcentaje», «la razón más sencilla», «expresa en metros») cuenta la escritura, y el
   enunciado lo dice. **Y la trampa hermana: dos métodos correctos** (reducción a la unidad, regla de tres, la constante, la
   fracción equivalente, los productos cruzados) **dan el mismo resultado**: nunca se enfrentan como opciones ni se corrige el
   método, salvo que el enunciado lo pida.
   **Lo que teclea el alumno** se interpreta sin `eval` y se compara por valor: vale cualquier escritura equivalente salvo que
   el ejercicio pida una forma (`20 %`, `0,2` o `1/5`; `12 €`, `12,00 €` o `12`; `20 %`, `20%` o, si el campo ya lleva el signo,
   `20`; con coma o con punto decimal, que al mostrar van según el idioma); **un periódico con puntos suspensivos, nunca** (ni
   como respuesta que se muestra ni como opción: los datos se eligen para que salga exacto), y `0,33` no es `1/3` (es su
   redondeo): nunca equivalen. En un ejercicio de elegir, **nunca dos opciones con el mismo valor**: no simplificar una razón
   nunca es un distractor cuando no se pide la más sencilla.
2. **Nada que no se haya dado**: cada ejercicio respeta la columna `sesion` de sus destrezas en el inventario aprobado; hasta
   el acta, el calendario propuesto (semana 1, sesiones 1-3: razón parte-parte y parte-todo, razones equivalentes, proporción,
   productos cruzados y el término que falta, magnitudes directamente proporcionales, la tabla y la constante, lo que no es
   proporcional, problemas de directa por reducción a la unidad y regla de tres; semana 2, sesiones 5-7: magnitudes
   inversamente proporcionales, la tabla y el producto constante, problemas de inversa, «¿directa, inversa o ninguna?», repartos
   directamente proporcionales; semana 3, en dos tareas de la app: sesiones 9-11, el porcentaje como fracción y como decimal,
   los porcentajes fáciles, el tanto por ciento de una cantidad, qué porcentaje es una cantidad de otra y hallar el total;
   sesiones 12-14, descuentos y aumentos en dos pasos y en uno, el IVA, problemas mezclados; semana 4, sesiones 16-18: escalas
   y unidades de medida; semana 5, sesiones 20-21: velocidad, cambio de moneda, precio por unidad, problemas de toda la unidad).
   **Ninguna magnitud inversa antes de la sesión 5, ningún reparto antes de la 7, ningún porcentaje antes de la 9** (ni «la
   mitad es el 50 %» de pasada), **ningún aumento o descuento antes de la 12, ninguna escala antes de la 16**, ninguna unidad
   «rara» (dam, hm, dag, hg, daL, hL), de superficie o de volumen antes de la 17 y la 18.
   **Fuera de la unidad** (propuesta; hasta que el acta diga otra cosa): la proporcionalidad compuesta, los repartos
   inversamente proporcionales, el interés compuesto, las funciones y la gráfica de `y = kx` (2.º ESO), la probabilidad y la
   estadística, y **la geometría con fórmula** (áreas, perímetros con fórmula, Pitágoras: U8; una escala se aplica a longitudes,
   nunca a un área). **Puntos a decidir en la 02, que no entran en ninguna práctica hasta el acta:**
   - **el método** que se enseña (reducción a la unidad, regla de tres o la constante) y cómo se presenta `3/4 = 6/x`;
   - **la inversa**: si entra y hasta dónde;
   - **los porcentajes encadenados** y **«el precio antes de la rebaja»**;
   - **las unidades de medida** (si van aquí o en la U8; el volumen y el tiempo), **la velocidad** y **el cambio de moneda**;
   - **la calculadora**, la notación del `%` y de la razón (regla 3) y **cómo se reparte el paquete 3** (las seis tareas de la
     app son parte de esa propuesta).
   Se saben la jerarquía y las potencias (U1), el m.c.d. y el m.c.m. (U2: simplificar una razón), los enteros (U3), las
   fracciones (U4: equivalentes, fracción de una cantidad, producto y cociente), los decimales (U5: multiplicar y dividir, por
   10, 100 y 1000, redondear, fracción ↔ decimal, y los cambios km-m, m-cm, kg-g, L-mL y euros-céntimos) y el álgebra (U6: se
   pueden usar letras; saben resolver `3x = 24`). **Ojo con la `x` en el denominador**: la U6 la dejó fuera, así que `3/4 = 6/x`
   no se «despeja»: se resuelve con los productos cruzados (`3x = 24`, `x = 8`) o se escribe con la `x` arriba.
3. **Notación en pantalla** (propuesta; la fija la 02): el porcentaje, **en español con cifra, espacio y signo** (`20 %`, con
   espacio de no separación, `&nbsp;`) y **en inglés pegado** (`20%`, que se lee *twenty per cent*). La razón, **como fracción**
   (`htmlFraccion` de `fracciones.js`) o con palabras («3 a 4», *3 to 4*, «3 de cada 4», *3 out of 4*); **`3 : 4` como razón,
   solo en las escalas** (`1 : 50 000`, «uno a cincuenta mil») **y en los repartos** («en la razón 2 : 3»), nunca en una línea
   que lleve también una división (en este curso «:» es el signo de dividir entre números). La regla de tres, en dos filas con
   las magnitudes arriba (`3 kg ⟶ 4,50 €` / `5 kg ⟶ x`), y **una operación por línea** en el paso a paso. **Los números de
   cinco cifras o más, con espacio fino entre grupos de tres** (`50 000`, `1 000 000`; `&#8239;`), en los dos idiomas; nunca
   punto ni coma de millares; los de cuatro cifras, sin separar (`2500`). **Coma decimal en español y punto en inglés** (`3,50`
   / `3.50`). **El dinero, siempre con dos decimales en el enunciado** (`12,00 €`; en inglés `12.00`). Las unidades, con su
   símbolo del SI, sin punto y **separadas del número** (`3,5 km`, `250 g`, `90 km/h`), el litro con `L` mayúscula; en inglés
   británico (*metres, litres, kilometres per hour*). **El producto entre números con `·`, nunca `×`**; la división entre
   números con `:`; entre número y letra, nada (`3x`). La constante se llama `k` solo si el enunciado la define. En inglés:
   *ratio*, *proportion*, *directly / inversely proportional*, *unit rate*, *per*, *for every*, *out of*, *percentage*,
   *discount*, *increase*, *decrease*, *sale price*, *VAT*, *scale*, *map*, *share in the ratio*. El alumno puede teclear `20%`,
   `20 %`, `0,2`, `0.2` o `1/5`: el lector de `proporcion.js` los acepta todos; nunca `eval`.
4. **Regla de oro**: todo distractor, inequívocamente falso, y cada distractor sale de un **error típico** de la columna `nota`
   del inventario, calculado con los números del ítem y comprobado en el test (nunca un número al azar): **razonar sumando en
   vez de multiplicando** (si 2 cuestan 5 €, 4 cuestan 7 €, en vez de 10 €); invertir la razón (`4/3` por `3/4`); confundir
   parte-parte con parte-todo (chicos y chicas en razón 2 a 3 → «2/3 de la clase son chicos», en vez de 2/5); aplicar la regla
   de tres directa a una situación inversa (6 obreros, 10 días → 4 obreros, «6,67 días», en vez de 15) y al revés; dar por
   proporcional lo que no lo es (la edad y la altura; el taxi con bajada de bandera); el 20 % de 50 como `50 : 20 = 2,5` (es
   10); `20 % = 0,02` o `= 2`; `5 % = 0,5`; restar el porcentaje como si fuera un número (`50 − 20 % = 30`, en vez de 40); dar
   el descuento cuando se pide el precio final (45 € con un 20 % → 9 €, en vez de 36,00 €) y al revés; «sube un 20 % y luego
   baja un 20 %: se queda igual»; sumar porcentajes encadenados; para hallar el total, calcular el porcentaje del dato (el 20 %
   son 30 → 6, en vez de 150); para «qué porcentaje», dividir al revés o dejar la fracción sin pasar a tanto por ciento; en un
   reparto, a partes iguales (120 € en la razón 2 : 3 → 60 € y 60 €, en vez de 48 € y 72 €); en una escala, multiplicar cuando
   toca dividir u olvidar el cambio de unidad (3 cm a escala `1 : 50 000` → «150 000 km», en vez de 1,5 km); en las unidades,
   subir cuando toca bajar, multiplicar por 10 en las de superficie, y **`1,5 h` leído como 1 h 50 min**. Los generadores de
   estos valores estarán en `_comun/proporcion.js` (`ERRORES_TIPICOS`, como en `_comun/algebra.js`): úsalos, y **cada función
   dice cuándo no sirve** (devuelve `null` cuando el error da lo mismo que la respuesta: el 50 % de 100 y `100 : 50` no, pero
   «sumar en vez de multiplicar» coincide a veces). **Lo que no es un error**: una escritura equivalente cuando no se pide la
   forma (`0,2` o `1/5` por `20 %`); un método distinto del explicado; *percent* por *per cent*; `12 €` por `12,00 €`; una
   razón sin simplificar cuando no se pide la más sencilla.
5. **Parejas válidas, que nunca se enfrentan**: *per cent* / *percent*; «tanto por ciento» / «porcentaje»; *ratio 3 to 4* /
   `3 : 4` / `3/4`; *VAT* / IVA; *discount* / *reduction*; «regla de tres» / «reducción a la unidad» / «productos cruzados»;
   *directly proportional* / *in direct proportion*; una fracción irreducible, su decimal exacto y su porcentaje; una cantidad
   y la misma en otra unidad. «Cinco veces más que» no se usa (es ambiguo); en inglés, *five times as many as*.
6. **Inglés sencillo**; la palabra no matemática que decide la respuesta se aclara entre paréntesis (*discount* (descuento),
   *sale* (rebajas), *increase* (subida), *each* (cada uno), *altogether* (en total), *share* (repartir), *per* (por cada),
   *at the same rate* (al mismo ritmo), *tap* (grifo), *recipe* (receta)), salvo que sea justo lo que se evalúa. **El enunciado
   no puede ser ambiguo, y en esta unidad lo es con facilidad**: «aumenta un 50 %» frente a «aumenta al 150 %»; «un 20 % más
   barato» (¿de qué precio?); «el 30 % de descuento sobre el precio ya rebajado»; en la inversa, **hay que decir que todos
   trabajan al mismo ritmo** (o que los grifos son iguales); en un reparto, **proporcional a qué**.
7. **Realismo** (regla de Juan Luis del 16-10): la situación tiene que ser posible y **todos** los números que pueda sacar el
   generador, creíbles, con **una cota por contexto que el test comprueba** (un `assert` en cada generador, como
   `src/ejercicios/contextos_mcd_mcm.js`). **Una situación solo es de proporcionalidad si lo es de verdad**: un corredor no
   mantiene en 42 km el ritmo de 2 km; diez albañiles no levantan un muro en dos minutos; una tarta no se hornea en la mitad de
   tiempo con el doble de temperatura. **Cotas de partida** (las aprueba la 02; si discrepan, manda el acta): descuentos del 5
   al 70 % (10, 15, 20, 25, 30, 40, 50, 60 y 70; nunca más del 100 %); IVA, el de España: 4, 10 o 21 %; subidas de un precio,
   un sueldo o una población del 1 al 20 %; una propina del 5 al 15 %; un porcentaje de un grupo del 1 al 99 %, con el resultado
   **en personas enteras**; recetas para 2 a 12 personas, con cantidades de cocina (50-1000 g, 0,1-2 L, 1-12 huevos); obreros,
   pintores, máquinas o grifos de 1 a 12, de 1 a 60 días o de 1 a 24 horas, **todos al mismo ritmo y dicho en el enunciado**;
   consumo de un coche de 4 a 9 L cada 100 km; velocidades: a pie 3-6 km/h, corriendo 8-15, en bici 10-30, en coche 30-120, en
   tren 80-300, en avión 700-900; escalas: planos `1 : 50`, `1 : 100` y `1 : 200`, mapas de `1 : 25 000` a `1 : 1 000 000`,
   maquetas `1 : 18`, `1 : 24`, `1 : 43` y `1 : 87`, con una medida en el plano de 0,5 a 30 cm y una real creíble (una
   habitación 2-10 m; de Murcia a Cartagena, unos 50 km); cambio de moneda con un tipo inventado y dicho en el enunciado, entre
   0,80 y 1,30 para dólares y libras; repartos entre 2-4 personas, proporcionales a algo dicho, **exactos al céntimo**; dinero y
   medidas como en la U5 y la U6 (un producto 0,20-30 €, fruta 0,80-6 €/kg, una prenda 5-120 €, un móvil 80-1200 €, una entrada
   3-60 €, gasolina 1,20-2,00 €/L, una persona 1,20-2,10 m y 30-120 kg, temperaturas de −10 a 45 °C, distancias a pie o en bici
   hasta 50 km y en coche hasta 1000 km). **El resultado de un problema es creíble y exacto**: personas, obreros y objetos, un
   número natural; días u horas, un natural o «y media»; dinero, exacto al céntimo (50 € más el 21 % de IVA son 60,50 €); **los
   datos se eligen para que el porcentaje salga exacto** (nada de `33,333… %` ni de «aproximadamente», salvo que se evalúe el
   redondeo, y entonces el enunciado dice a qué se redondea). **Contextos de la app** (propuesta; punto a decidir): la compra al
   peso, las recetas, el consumo del coche, los descuentos y el IVA de una tienda y las escalas de planos, generados eligiendo
   primero la constante o el resultado, y, **en problemas de un solo paso**, los obreros y los grifos, los repartos, las
   escalas de mapas y el cambio de moneda (prácticas `inversa`, `repartos`, `escalas`, `problemas-proporcion`); esos mismos
   contextos en problemas de varios pasos o con tabla son del papel. Los personajes llevan nombres inventados (no de alumnos reales).
8. **Feedback ligado al error**, con los números del ítem («el 20 % de 150 no es `150 : 20`: es `20/100 · 150 = 30`»; «el 20 %
   de 45 € son 9 €, que es el descuento: se pagan `45 − 9 = 36,00 €`»), no una regla genérica. Frase sencilla antes que caso
   límite.
9. **Casos fijos** (frases, contextos, números) que no copien los de las hojas, los exámenes semanales ni el examen final de la
   unidad 7 (en `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/hojas-de-ejercicios/`, `exámenes-semanales/`, `examen-final/`): los alumnos los verán en papel. **Los casos de
   las hojas se excluyen en claro; los de los exámenes, por huella FNV-1a calculada fuera del repositorio, nunca en claro** (regla de
   PU2 del 30-10; modelo: `practicas/equivalentes/logica.js` y `tests/practicas-equivalentes.test.js` tras el commit b0e4cfd, y la
   reabierta `hechos/reabiertas/100--s-20261030T081542-dab2aa98-revision.md`). Con proporcionalidad, la huella se calcula sobre el
   **caso normalizado por valor** (tipo de problema y datos como fracciones irreducibles en un orden fijo), no sobre el texto: «el
   20 % de 150», «el 20 % de 150 €» y «0,2 · 150» son el mismo caso; `3/4 = x/20` y `x/20 = 3/4`, también; y una regla de tres con
   los mismos tres datos en otro contexto, también. Si al reclamar la hoja o el examen de tu paquete no existen aún, dilo en la
   ENTREGA: la tarea de publicación de tu paquete coteja y reabre si hace falta.
10. **Aritmética exacta**: las razones, los porcentajes y los resultados son `Fraccion` de `_comun/fracciones.js` (o enteros;
    **el dinero, en céntimos enteros**); nunca se compara ni se muestra con `Number` en coma flotante (`1.21 * 50`, `0.1 + 0.2`);
    **el redondeo, al más cercano (la mitad, hacia arriba) y solo cuando el enunciado lo pida, nunca `toFixed` sobre un
    flotante** ni truncando; nunca `eval` sobre lo que teclea el alumno. Cada resultado se comprueba en el test **por un segundo
    camino** (la regla de tres contra la constante; el precio final contra «precio menos descuento»; el reparto contra «las
    partes suman el total»), con `BigInt` o aritmética entera propia.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 211, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-211.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/211--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/211--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/211-base-unidad7/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cotas de realismo, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/211--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/211--<sid>.md` con hasta dónde llegaste, la línea
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
  CDN; las prácticas no usan ni siquiera KaTeX (exponentes con `<sup>`; las fracciones con
  `htmlFraccion`).
- Saltarse las reglas de contenido de la unidad 7 (en esta ficha y en `proyecto.md` de su reparto): `×` en vez de `·`; `eval` o
  coma flotante; un periódico o un «aproximadamente» donde no se evalúa el redondeo; un contexto sin cota o una situación que no
  es de proporcionalidad; lo que está fuera de la unidad (proporcionalidad compuesta, repartos inversos, interés compuesto,
  funciones y gráficas, geometría con fórmula, una escala aplicada a un área) o es punto a decidir de la 02 mientras el acta no
  lo admita; algo de una sesión posterior a la de la destreza; distractores que puedan ser verdad, y en especial **dos opciones
  que valen lo mismo** (`0,2` y `20 %`; `1/4` y `25 %`; `2,5 km` y `2500 m`; dos métodos correctos enfrentados), que son dos
  respuestas correctas; casos de examen en claro en el repositorio.
