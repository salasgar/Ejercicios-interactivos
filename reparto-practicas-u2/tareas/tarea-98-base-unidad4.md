# Tarea 98 · Base de la unidad 4: catálogo, portada, destrezas, `_comun/fracciones.js` y `_comun/dibujo-fracciones.js`

Actualizado: 2026-10-26
Precondición: tarea 01 del reparto de la unidad 4 LISTA (existe la propuesta de inventario `4. Fractions/inventario-unidad4.tsv`; con F0 firmada, mejor: ids definitivos) · no en paralelo con otra tarea que toque `catalogo.js`, `portada.js` o `registro.js` (la 96 si sigue EN CURSO, la 71, la 114) · Disparo: MANUAL (sesión atendida)
Duración esperada: 1 h 45 min (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/98-base-unidad4/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/fracciones.js` (nuevo), `practicas/_comun/dibujo-fracciones.js` (nuevo), `practicas/_comun/catalogo.js` (diez filas y la unidad 4 en `UNIDADES`), `practicas/portada.js` (bloques y descripciones de la U4), `practicas/_comun/registro.js` (`DESTREZAS` de la U4), `practicas/<slug>/` de los diez slugs (solo el esqueleto), `docs/practicas-unidad4.md` (nuevo, §7), `tests/practicas-fracciones.test.js` (nuevo), `tests/practicas-comun.test.js` (lista del catálogo), `tests/practicas-semana.test.js` (el test de los bloques), `tests/practicas-registro.test.js` (leer también la tabla de la U4)

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
   printf 'sesión: %s\ntarea: 98\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/98--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/98--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 98 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/98--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.



## Objetivo

Preparar lo común para las diez prácticas de la **unidad 4, Fractions** (tareas 99-108), de forma que ninguna de ellas
tenga que escribir en un fichero común y puedan ir las diez en paralelo (lección del 8-10: «un fichero común con candado no
se reparte entre sesiones en paralelo»). Es lo que la 79 fue para la unidad 3: léela y lee su ENTREGA.

El catálogo de la unidad 4 (diseño de la montadora del 26-10; Juan Luis pidió el alta en el traspaso del 25-10):

| id | slug | nombre (es / en) | nEjercicios | semana (bloque de la portada) | destrezas (descripción; ids tras F0) |
|---|---|---|---|---|---|
| 47 | `que-fraccion` | ¿Qué fracción es? / What fraction is it? | 4 | 1 | parte de un todo en figuras; escribir y leer en inglés; propia e impropia; «out of» |
| 48 | `equivalentes` | Fracciones equivalentes / Equivalent fractions | 4 | 1 | ampliar y reducir; el término que falta (□); ¿son equivalentes? (productos cruzados); común denominador |
| 49 | `simplifica` | Simplifica / Simplify | 3 | 1 | dividir arriba y abajo por el mismo número; irreducible; de una vez con el m.c.d.; también una negativa, con el signo delante (`U4-1C-22`) |
| 50 | `compara` | Compara y ordena / Compare and order | 4 | 1 | mismo denominador, mismo numerador, común denominador; frente a 1 y a 1/2; ordenar; la recta; con alguna negativa (`U4-1C-23`) y la recta con negativas (`U4-1C-24`) |
| 51 | `fraccion-de` | La fracción de una cantidad / A fraction of a quantity | 4 | 2 | dividir y multiplicar; la fracción que representa una parte; problemas de contexto |
| 52 | `suma-resta` | Suma y resta / Adding and subtracting | 5 | 2 | igual denominador; distinto denominador paso a paso; con naturales; con negativas, también resultado negativo (`U4-2C-07`); parte que queda; problemas |
| 53 | `multiplica-divide` | Multiplica y divide / Multiply and divide | 5 | 3 (se publica con la semana 3, mar 22-12; el producto y las potencias son de la sesión 7, jue 7-1, y el cociente de la 9) | producto (simplificar antes o después); fracción de una fracción; **potencias de base positiva** (`U4-2C-12`; ejercicio 5, nuevo el 26-10); la inversa; cociente por los dos métodos; **con negativas** (`U4-3C-10`) |
| 54 | `combinadas-fracciones` | ¿Qué se hace primero? Con fracciones / What comes first? With fractions | 3 | 3 | jerarquía y paréntesis con fracciones, un paso cada vez; con negativas (`U4-3C-10`) |
| 55 | `errores4` | Caza el error / Spot the mistake | 3 | 3 (toda la unidad) | los errores típicos de la unidad como cálculos con un paso mal (también los de negativas y potencias) |
| 56 | `leelo4` | Léelo en inglés / Say it in English | 4 | toda la unidad | vocabulario: numerator, denominator, three fifths, a half, a quarter, equivalent, simplify, lowest terms, common denominator, reciprocal, of, out of, proper / improper |

Sin práctica, a propósito: la lectura en voz alta (va a `leelo4` como «elige la lectura correcta»), y lo que el acta del
26-10 deja fuera (decimales, números mixtos, potencias de base negativa). La tabla de arriba se corrigió el 26-10 con el
acta (negativas, potencias, el producto en la sesión 7); si el §7 de `docs/practicas-unidad4.md` la reparte de otra manera,
el §7 manda y esta se corrige en la ENTREGA.

## Siguiente paso

1. Lee la ficha de la tarea 79 (`tareas/tarea-79-base-unidad3.md`) y su `salidas/79-base-unidad3/ENTREGA.md`: es el molde exacto (esqueletos, bloques, `DESTREZAS`, docs §7, tests). Lee `practicas/_comun/aritmetica.js` (`mcd`, `mcm`, `factorizar`: no los dupliques) y `practicas/_comun/enteros.js` (`fmt`, `leerEntero`, el evaluador: el de fracciones se apoya en él, porque el acta mete negativas).
2. Lee `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/4. Fractions/inventario-unidad4.tsv` (aprobado el 26-10) y el acta `4. Fractions/inventario-unidad4-revision.md` (qué entra y los ids que cambiaron: `3C-01` a `3C-04` y `3A-05` son huecos; el producto es `2C-08` a `2C-11`, las potencias `2C-12`, las negativas `1C-22` a `1C-24`, `2C-07` y `3C-10`): de ahí salen los ids de cada práctica.
3. `git status` y `git log --oneline -3 -- practicas/_comun/ practicas/portada.js`: si hay cambios sin commit en esos ficheros que no son tuyos, no los pises y avisa. Mira `.claude/sesiones/` por si otra sesión tiene reservado `catalogo.js`.

## Qué hay que hacer

**1. `practicas/_comun/fracciones.js`** (nuevo, puro, sin DOM), con su test `tests/practicas-fracciones.test.js`:
- Una clase o fábrica `Fraccion(num, den)` **inmutable, siempre con `den > 0` y el signo en el numerador** (las negativas
  entran desde la semana 1, acta del 26-10: `Fraccion(5, -12)` es `−5/12`), con `simplificar()` (usa `mcd` de
  `aritmetica.js`; conserva el signo), `esIrreducible()`, `equals(otra)` (por valor), `comparar(a, b)` (−1, 0, 1), `sumar`, `restar`,
  `multiplicar`, `dividir`, `inversa()`, `valor()` (solo para ordenar; nunca para mostrar), `esPropia()`, `deNatural(n)`,
  `de(cantidad)` (la fracción de una cantidad: error si no es exacta), `comunDenominador(a, b)` (con el m.c.m.: devuelve las
  dos equivalentes y el m.c.m.), `equivalentePor(k)` y `amplificaciones(hasta)`; y, nuevos el 26-10, `opuesta()`,
  `esNegativa()` y `potencia(n)` (n natural, 2 o 3; base positiva: la usa la práctica 105).
- `htmlFraccion(f, { compacta })` → `<span class="frac"><span>3</span><span>5</span></span>` (raya horizontal con CSS en
  `css/estilos.css` **no**: el estilo va en un bloque de `practicas/_comun/estilos.css`, que ya existe y es común; si no cabe
  ahí, en cada práctica); un natural se pinta sin raya; una negativa lleva el signo delante de la raya, a su altura, nunca
  dentro; `htmlCuenta(partes)` para `1/2 + 1/3 = 5/6` en línea.
- `leerFraccion(texto)` → `Fraccion` o `null`: acepta `3/5`, `3 / 5`, `⁄`, naturales, espacios, y las tres escrituras de una
  negativa (`-5/12`, `(-5)/12`, `5/(-12)`, también con `−`) como el mismo número; rechaza decimales, `0` en el
  denominador, vacío y basura. `leerNumero` de `piezas.js` no se toca.
- `enPalabras(f, idioma)`: «three fifths», «a half», «a quarter», «three quarters» (y «one half», «one fourth», «three fourths»
  como variantes válidas: `lecturasValidas(f)` devuelve todas), «tres quintos», «un medio», «un cuarto», «tres cuartos»; una
  negativa, «minus three fifths» / «menos tres quintos».
- **Los errores típicos** de la regla 4 de abajo, cada uno como función con nombre que da el cálculo equivocado a partir de
  las fracciones (`sumarArribaYAbajo(a, b)`, `simplificarSoloNumerador(f, k)`, `fraccionDeAlReves(f, n)`,
  `compararSoloNumeradores`, `inversaComoOpuesta`, `soloDenominadorAlReducir`, `invertirLaPrimera`, `noInvertir`,
  `contarMarcas`, y los de negativas y potencias, nuevos el 26-10: `signoPerdido` (olvidar el signo al simplificar, sumar o
  multiplicar una negativa), `ignoraElSigno` (comparar −3/4 y 1/2 por el valor absoluto), `elevarSoloElNumerador(f, n)`,
  `basePorExponente(f, n)`…) y una tabla `ERRORES_TIPICOS` con su nombre `{ es, en }` en frase corta; cada función dice cuándo no sirve
  (devuelve `null` si da lo mismo que la respuesta correcta).
- Test: la aritmética contra `fractions.Fraction` de Python no está a mano: contra una tabla de 40 casos calculados a mano y
  contra `BigInt` o aritmética entera propia en 3000 casos aleatorios; `equals` por valor; cada error típico distinto del
  correcto cuando no devuelve `null`; `leerFraccion` y `enPalabras` con tabla.

**2. `practicas/_comun/dibujo-fracciones.js`** (nuevo, con DOM, SVG): barras divididas en n partes con k sombreadas (y
varias barras para impropias), círculos («pizzas») en sectores, cuadrículas, y una recta de 0 a 1 (o de 0 a n) con marcas
en los múltiplos de 1/d, puntos con etiqueta, y marcas y partes que se pueden tocar (`alTocar(i)`). Tiene que verse bien a
375 px con hasta 12 partes en una barra y 24 marcas en la recta. La parte pura (qué parte o marca está más cerca de un
toque, posición de cada marca) va en funciones exportadas con su test, en el mismo `tests/practicas-fracciones.test.js`.
**En un SVG, lo que se dibuja encima se queda el clic**: las capas de dibujo llevan `pointer-events: none` (lección de la 79).

**3. Catálogo** (`practicas/_comun/catalogo.js`): las diez filas de la tabla de arriba, `unidad: 4`, **`disponible: false`**,
en ese orden, después de la fila 45 (`ortografia`) y antes de la plantilla; los ids 47-56 están libres (46 es
`fichas-de-pablo`). Y en `UNIDADES`, `{ n: 4, desde: '2026-12-14', titulo: { es: 'Fracciones', en: 'Fractions' } }`.

**4. Un esqueleto por práctica**: `practicas/<slug>/` para los diez slugs, copia mínima de `practicas/plantilla/` que carga y
declara su `slug` y sus `nEjercicios` (un test de `tests/practicas-semana.test.js` carga el `practica.js` de cada fila del
catálogo). **Desde que esta tarea esté LISTA, cada carpeta es de su tarea (99-108)**; escríbelo en la ENTREGA.

**5. Portada** (`practicas/portada.js`): cuatro bloques de la unidad 4, `unidad: 4`:
- «Semana 1 · Qué es una fracción, equivalentes y comparar» / «Week 1 · What a fraction is, equivalent fractions and
  comparing»: `que-fraccion`, `equivalentes`, `simplifica`, `compara`.
- «Semana 2 · La fracción de una cantidad, sumas y restas» / «Week 2 · Fraction of a quantity, adding and subtracting»:
  `fraccion-de`, `suma-resta`.
- «Semana 3 · Multiplicar, dividir, combinadas y errores» / «Week 3 · Multiplying, dividing, mixed operations and
  mistakes»: `multiplica-divide`, `combinadas-fracciones`, `errores4`.
- «Para toda la unidad · Vocabulario» / «For the whole unit · Vocabulary»: `leelo4`.
Y una línea de `DESCRIPCION` por práctica, en los dos idiomas, sacada de la ficha de su tarea. Ajusta los tests de
`tests/practicas-semana.test.js` que fijen los bloques por unidad (los de la U2 y la U3 se conservan tal cual).

**6. Destrezas** (`practicas/_comun/registro.js`, `DESTREZAS`): las de la unidad 4 con los ids completos (`U4-1C-03`…), y
**`docs/practicas-unidad4.md`** con su §7 («Qué práctica cubre qué destreza de la unidad 4», mismas columnas que el de la
unidad 3, una fila por destreza del inventario, también las que no tienen práctica); cambia `tests/practicas-registro.test.js`
para que lea también la tabla de la U4. El resto del documento lo escribe la 111; deja los apartados con «por escribir
(tarea 111)». Los ids son los del inventario aprobado el 26-10 (definitivos aunque F0 se firme después); si al cerrar F0
sigue sin firma, dilo en la ENTREGA y la 109 lo comprueba antes de publicar.

**7. `tests/practicas-comun.test.js`**: la lista del catálogo con las diez filas nuevas (es el test que fija ids, slugs y
número de ejercicios).

## Datos de entrada

- El inventario de la unidad 4 (aprobado el 26-10), solo lectura: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/4. Fractions/inventario-unidad4.tsv`; el acta `inventario-unidad4-revision.md` (léela entera: puntos c, e, i, j y la tabla de ids que cambiaron); la secuenciación `secuenciación-unidad4.pdf`.
- `reparto-practicas-u2/tareas/tarea-99-…` a `tarea-108-…`: lo que cada práctica va a pedir a `fracciones.js` y a `dibujo-fracciones.js` (léelas por encima antes de fijar la API: la 99 necesita figuras que se tocan, la 50 la recta, la 52 el común denominador paso a paso, la 55 los errores con nombre).
- `tareas/tarea-79-base-unidad3.md`, `salidas/79-base-unidad3/ENTREGA.md`, `practicas/_comun/enteros.js`, `recta-enteros.js`, `aritmetica.js`, `docs/practicas-unidad3.md`: el molde.

## Cómo saber que ha terminado

- `npm test` sin fallos (el árbol entero: con el esqueleto, todas las filas cargan).
- `node --test tests/practicas-fracciones.test.js` en verde, con la tabla a mano y los 3000 casos.
- En local (`npm run servir`), la portada no enseña nada nuevo (todo `disponible: false`; la U4 no llega hasta el 14-12), y una página de prueba tuya (no comiteada) pinta una barra, una pizza y la recta a 375 px.

## Trampas conocidas

- **La unidad 4 no aparece en la portada hasta el 14-12** (`UNIDADES.desde`): para verla antes en local, pásale a `unidadActual` una fecha de prueba o mira `bloquesPublicados(CATALOGO, 4)` en la consola.
- Si otra sesión tiene reservado `catalogo.js` (la 96, la 114 o una de Juan Luis fuera del reparto), espera o haz antes todo lo demás (`fracciones.js`, `dibujo-fracciones.js`, esqueletos, docs) y deja el catálogo para el final del commit.
- `-` y `−`, `/` y `⁄` se parecen: en los tests busca por código.
- Para probar en el navegador sin dejar nada en el árbol compartido: servir una carpeta del scratchpad con enlaces a `practicas/`, `css/`, `src/`, `divisores/` y `herramientas/` (sin `src/` la base se queda en «Cargando…»); Chrome guarda en caché los módulos: `fetch(url, { cache: 'reload' })`.
- En zsh una variable con varias rutas no se parte en palabras: `F=(a b c); git add "${F[@]}"`.

## Prohibido (propio de esta tarea)

- Escribir ninguna práctica de verdad (solo los esqueletos) o poner `disponible: true`.
- Cambiar lo que hacen hoy `leerNumero`, `campoNumero`, `enteros.js`, el catálogo de las unidades 1-3 o sus bloques.
- Usar decimales (`valor()`) para comparar o mostrar fracciones en ninguna práctica: solo para ordenar internamente.

## Salida esperada

- Los ficheros de «Ficheros que toca» comiteados, con `npm test` sin fallos.
- `reparto-practicas-u2/salidas/98-base-unidad4/ENTREGA.md` (hash, ficheros, la API de `fracciones.js` y de `dibujo-fracciones.js` en una tabla, la tabla slug → ids definitivos de cada práctica, qué dejó provisional y cómo probarlo en 1 minuto) y su marcador `ENTREGA.md.ok-<sid>`.

## Reglas de contenido de la unidad 4 (copia de `proyecto.md`; lo común no se lee, por eso va aquí)

Las reglas 2-4 y 8-9 de la lista de la unidad 2 (signos `·` y `:`, inglés, regla de oro, feedback, realismo) valen igual.
La fuente es `4. Fractions/reparto-unidad4/proyecto.md` («Reglas de contenido comunes») y el acta
`4. Fractions/inventario-unidad4-revision.md` (lo que Juan Luis decidió el 26-10: negativas desde la semana 1, potencias de
base positiva en la sesión 7, ni decimales ni mixtos, cotas de realismo, ids que cambiaron).

1. **Dos fracciones equivalentes son la misma respuesta.** En cualquier ejercicio de elegir, emparejar o verdadero/falso,
   ninguna opción puede equivaler a otra: el test lo comprueba por valor (`Fraction` de `_comun/fracciones.js`, nunca con
   decimales ni a ojo), y en los de «simplifica» la consigna pide la **fracción irreducible**. Un número mixto y su
   fracción impropia, lo mismo (si entran).
2. **Nada que no se haya dado**: cada ejercicio respeta la columna `sesion` de sus destrezas en el inventario. Ninguna suma
   o resta de fracciones antes de la sesión 5, ningún producto ni potencia antes de la 7 (jue 7-1), ningún cociente antes
   de la 9, ninguna combinada antes de la 10. **Acta del 26-10: ni decimales ni números mixtos; fracciones negativas desde
   la semana 1 (escritura y signo, simplificar, comparar, recta), en la 2 (sumar y restar, también resultado negativo) y
   en la 3 (producto, cociente, combinadas); potencias solo de base positiva (sesión 7).** Ni letras ni ecuaciones (el término que falta es un hueco `□`), ni porcentajes.
3. **Escritura**: la fracción en pantalla con raya horizontal (`htmlFraccion` de `_comun/fracciones.js`, tarea 98: `<span
   class="frac"><span>3</span><span>5</span></span>`), nunca `3/5` con barra salvo en una frase en inglés hablado («3 out
   of 5»). El alumno puede teclear `3/5`, `3 / 5` o un natural (`leerFraccion`). Producto con `·`, nunca `×`; división
   con `:` (en inglés también `÷`); «of» = multiplicar («3/5 of 40»).
4. **Regla de oro**: todo distractor, inequívocamente falso, y cada distractor sale de un **error típico** de la columna
   `nota` del inventario, calculado con los números del ítem y comprobado en el test (nunca un número al azar): sumar
   numeradores y denominadores (`1/2 + 1/3 = 2/5`); simplificar solo un término; multiplicar en cruz al sumar; «3/5 de
   40» dividiendo entre 3 y multiplicando por 5; comparar solo numeradores o solo denominadores; confundir la inversa con
   la opuesta; cambiar solo el denominador al reducir; invertir la primera fracción al dividir (o ninguna); contar marcas
   en vez de huecos en la recta. Los generadores de estos valores están en `_comun/fracciones.js` (`ERRORES_TIPICOS`):
   úsalos, y **cada función dice cuándo no sirve** (cuando el error da lo mismo que la respuesta). **Lo que no es un error**:
   dividir numerador entre numerador y denominador entre denominador cuando las dos divisiones son exactas (`6/8 : 2/4 =
   3/2`); comparar por denominadores cuando los numeradores son iguales.
5. **Parejas válidas, que nunca se enfrentan**: *three quarters* / *three fourths*; *a half* / *one half*; *a quarter* /
   *one fourth*; *simplify* / *reduce* / *cancel*; *lowest terms* / *simplest form*; `÷` / `:`; *times* / *multiplied by*;
   `3/5 · 40` / `3/5 of 40`; «3 out of 5» / «three fifths»; una fracción y cualquier equivalente suya.
6. **Inglés sencillo**; la palabra no matemática que decide la respuesta se aclara entre paréntesis (*shaded (sombreado)*,
   *left (que queda)*, *the rest (el resto)*), salvo que sea justo lo que se evalúa. Las fracciones se leen con ordinales
   (*three fifths*), salvo *a half* y *a quarter*.
7. **Realismo** (regla de Juan Luis del 16-10): la situación tiene que ser posible y **todos** los números que pueda sacar el
   generador, creíbles, con una cota por contexto que el test comprueba. Orientativas (la sesión fija las suyas y las
   escribe en su ENTREGA): una cantidad de la que se toma una fracción es múltiplo del denominador; las partes de un todo
   suman como mucho 1 y «lo que queda» no es negativo; una clase tiene 12-36 alumnos y cada fracción da un entero; un
   instituto, 200-3000; una pizza o una tarta tiene de 3 a 15 trozos; una hora se parte en medias, cuartos, tercios, sextos
   y doceavos; un depósito, de 1 a 500 litros (el de un coche, 20-90); una botella, hasta 3 L; una garrafa, hasta 50 L; un
   recorrido, hasta 50 km a pie o en bici y 1000 en coche; un ahorro, hasta 2000 € enteros (cotas aprobadas el 26-10, acta
   punto j). Cantera de contextos: los 41 problemas transcritos en la nota de la montadora de la U4 (apartado 4).
8. **Feedback ligado al error**, con los números del ítem («1/2 + 1/3: has sumado arriba y abajo; los sextos: 3/6 + 2/6 =
   5/6»), no una regla genérica. Frase sencilla antes que caso límite.
9. **Casos fijos** (frases, contextos, dibujos con números) que no copien los de las hojas, los exámenes semanales ni el
   examen final de la unidad 4 (en la carpeta de la unidad: `hojas-de-ejercicios/`, `exámenes-semanales/`,
   `examen-final/`): los alumnos los verán en papel.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 98, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-98.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/98--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/98--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/98-base-unidad4/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/98--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/98--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni
  `practicas/_comun/` (salvo la tarea 01; en la unidad 3, la 79 y las de publicación 93-96; en la unidad 4, la 98 y las de publicación 109-111; la 114 en una fila del catálogo; cada una en lo que declara), ni `css/estilos.css`, ni `README.md` (salvo
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
- Las reglas de contenido de la unidad 4 (en esta ficha y en `proyecto.md`): `×` en vez de `·`, letras,
  ecuaciones, porcentajes; decimales y números mixtos (fuera por el acta del 26-10); potencias de base negativa;
  fracciones negativas o potencias de base positiva en una sesión anterior a la suya (acta: negativas desde la semana 1,
  potencias en la sesión 7); algo de una sesión posterior a la de la destreza; distractores que
  puedan ser verdad, y en especial **dos opciones equivalentes** (`4/8` y `1/2`), que son dos respuestas correctas.
