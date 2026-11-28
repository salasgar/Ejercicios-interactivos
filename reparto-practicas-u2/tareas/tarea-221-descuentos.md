# Tarea 221 · Práctica de la unidad 7 «Descuentos y aumentos» (descuentos)

Actualizado: 2026-11-19 (adaptada a la unidad 7 por la montadora de su reparto, s-20261118T221619-b66ec280, que la dio de alta el 18-11 a partir de la ficha 153 de la unidad 6, con sus trampas; **el acta de la 02 de la U7 no existe todavía: los ejercicios de abajo son la propuesta de partida**)
Precondición: 211 LISTA · mejor con la hoja y el examen de su paquete ya LISTOS en el reparto de la U7 (paquete 3: la parte 2 de la hoja 3, tarea 09, y el examen 3, tarea 20): si existen, excluye sus casos desde el principio (hoja en claro, examen por huella del caso normalizado por valor); si no, dilo en la ENTREGA y lo coteja la tarea de publicación de tu paquete (229) · Disparo: MANUAL (sesión atendida) · **Plazo: vie 29-1 (ideal); límite vie 26-2**
Duración esperada: 1 h 30 min (tiempo de sesión, no de persona; la ficha de origen de la U6 decía 1 h 15 min, y aquí se escriben además las explicaciones del «No lo sé», que en la U6 fueron tarea aparte) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/221-descuentos/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/descuentos/*` (sustituye el esqueleto que deja la 211: desde que la 211 está LISTA, la dueña de esa carpeta es esta tarea), `tests/practicas-descuentos.test.js` y `tests/practicas-ayuda-descuentos.test.js` (nuevos)

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
   printf 'sesión: %s\ntarea: 221\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/221--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/221--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 221 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/221--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Práctica **«Descuentos y aumentos» / «Discounts and increases»** (`descuentos`, id 93 del catálogo, 5 ejercicios) para la **unidad 7, Proportionality and percentages**, que
empieza el lunes 1-3-2027. Paquete 3, que es doble: esta es **la única de su segunda mitad** (sesiones 12-14, del lun 5-4 al jue 8-4, a la vuelta de las vacaciones; entra en la tarea semanal del lun 5-4, con repaso de las otras tres, y en la prueba 3, vie 9-4). Tiene que estar LISTA antes del plazo de la tarea de publicación
de su paquete, la 229, que publica juntas las cuatro prácticas de porcentajes **antes de las vacaciones** (**jue 11-3**; las demás: 227, mié 24-2; 228, jue 4-3; 230, jue 8-4; 231, jue 15-4), y mejor antes del vie 29-1.

Destrezas (descripción; los ids definitivos, en el inventario tras F0 y en la ENTREGA de la 211): el descuento y el precio final en dos pasos; el precio final en un paso (multiplicar por 0,80 o por 1,21); el IVA (4, 10 y 21 %); ¿piden el descuento o el precio final?; cazar el error («sube un 20 % y baja un 20 %: se queda igual»). El texto exacto
de cada una, su sesión y su nota (errores típicos y riesgos) están en el inventario: léelas antes de escribir nada.

**Es un diseño propuesto por la montadora (18/19-11) y dado de alta por encargo de Juan Luis; él puede cambiarlo, y todavía no lo ha visto ejercicio a ejercicio.** La lista de
ejercicios de abajo es la propuesta de `proyecto.md` (sección de las tareas 211-233); **con F0 firmada, manda el acta de la 02 de la U7**
(`/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/inventario-unidad7-revision.md`). Lo que esa acta tiene que decidir y toca a esta práctica:
- **«El precio antes de la rebaja»** (en sus exámenes de 2022-23 y 2025) y **los porcentajes encadenados**: puntos a decidir; **no entran hasta el acta**. La única excepción es el ejercicio 5, el de cazar el error «sube un 20 % y baja un 20 %», que está en la tabla de `proyecto.md` y **se resuelve calculando en dos pasos**, uno detrás de otro, nunca sumando ni multiplicando porcentajes. Si el acta admite alguno de los dos, entra como ejercicio o como ítems de esta práctica (propuesta en la ENTREGA), no como práctica nueva; si quita también el ejercicio 5, dilo y propón su sustituto (cazar «dar el descuento por el precio final» en una resolución escrita).
- **El multiplicador** (`· 0,80`, `· 1,21`) y **el IVA** son novedad de los apuntes de julio: Juan Luis no los ha puesto nunca en un examen (su método es la regla de tres). Si el acta quita uno, su ejercicio (el 2 o el 3) no se escribe y se propone otro.
- **La calculadora**: aquí, precios que se hacen sin ella.

Si al hacerla ves que un ejercicio no se sostiene (dos respuestas correctas inevitables, algo de una sesión posterior, algo
que el acta del inventario dejó fuera), no lo cambies por tu cuenta: entrégalo como propuesta en la terminada y sigue con lo
demás. El número de ejercicios (5) está fijado en el catálogo por la 211; otro número también es propuesta.

Modelo de interfaz: `practicas/problemas-ecuaciones/` de la U6 (problemas con contexto y cotas con `assert`; elegir entre cuatro cantidades), `practicas/valor-numerico/` (varios campos en un mismo ítem) y `practicas/fraccion-de/` de la U4 (el «No lo sé» modelo).

## Siguiente paso

1. Lee la ficha de la tarea 01 (§3, el contrato de `arrancar(practica)` y la `api` de `montar`), la `ENTREGA.md` de la 211 (`reparto-practicas-u2/salidas/211-base-unidad7/`) y el módulo que dejó: `practicas/_comun/proporcion.js` (según su ficha: porcentajes y cantidades con unidad con las fracciones exactas de `fracciones.js`, `deTexto`, `aTexto`/`aHtml` con la notación de cada idioma, `mismoValor`, `porcentajeDe` y `aplicarPorcentaje` con sus pasos, `redondear`, `ERRORES_TIPICOS` y `CONTEXTOS` con la cota de cada uno; **los nombres de verdad son los de su ENTREGA**, no los de esta lista). **No lo reescribas**: si te falta algo, cópialo en tu `logica.js` y proponlo en la terminada.
2. Lee `practicas/plantilla/` entero y las prácticas modelo que cita el Objetivo; `practicas/_comun/piezas.js` (`elecciones`, `campoNumero`, `leerNumero`, `claseCorreccion`: los cuatro estados tras comprobar) y cómo ocultan «Comprobar» al responder las prácticas de la U5 y la U6. Y `docs/no-lo-se.md` entero: esta práctica nace con el botón «No lo sé» (paso 7 de abajo).
3. `ls practicas/descuentos/`: la 211 dejó un esqueleto que carga y declara tus ejercicios. Sustitúyelo empezando por `logica.js` y su test, en verde; después `practica.js` (`montar`) y `textos.js`.
4. Mira si existen ya el acta (`inventario-unidad7-revision.md`: qué dice del multiplicador, del IVA, de los encadenados y de «el precio antes de la rebaja») y la hoja y el examen de tu paquete en `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/` (`hojas-de-ejercicios/hoja-unidad7-semana3-parte2.tex`, `exámenes-semanales/semana-3/casos-examen-semana3.tsv`; el 19-11 no existía ninguno de los tres): si sí, sus casos se excluyen desde el principio (regla 9).

## Qué hay que hacer

**Dinero exacto al céntimo, siempre.** Todo se calcula en **céntimos enteros** y los datos se eligen para que no haya nada que redondear: el precio `P`, en céntimos, es un múltiplo de `100 : m.c.d.(p, 100)` (con el 21 %, euros enteros; con el 15 %, múltiplos de 0,20 €; con el 4 % y el 25 %, de 0,25 € y 0,04 €; lo más sencillo, euros enteros o acabados en ,50 cuando el porcentaje lo permita). **Porcentajes** (regla 7; con el acta, los suyos): descuentos del 10, 15, 20, 25, 30, 40, 50, 60 y 70 %; subidas de un precio o de una cuota, del 5, 10, 15 y 20 %; IVA, solo el 4, el 10 y el 21 %. **Contextos**, cada uno con su cota y su `assert` (si la 211 los trae en `CONTEXTOS`, de allí): una prenda (5,00 a 120,00 €), un móvil (80,00 a 1200,00 €), un videojuego o un libro (8,00 a 70,00 €), una entrada (3,00 a 60,00 €), una bicicleta (100,00 a 600,00 €), una cuota mensual (10,00 a 60,00 €). El enunciado dice siempre «rebajado un 20 %» o «con un 20 % de descuento» y «sube un 10 %» (nunca «un 20 % más barato», «baja al 80 %» ni un descuento «sobre el precio ya rebajado»: regla 6). El precio, con dos decimales en el enunciado y en la respuesta que se enseña; el alumno puede teclear `36`, `36 €` o `36,00 €`.

1. **En dos pasos** · *In two steps* (sesión 12). «Una sudadera cuesta 45,00 € y está rebajada un 20 %» y **dos campos**: el descuento (9,00 €) y el precio final (36,00 €). Uno de cada cuatro ítems es una subida («la cuota del gimnasio es de 30,00 € al mes y sube un 10 %»: la subida, 3,00 €; la cuota nueva, 33,00 €). Feedback por error reconocido por valor: `restar-el-porcentaje` (`45 − 20 = 25`), `campos-cambiados` (36 y 9), `subir-por-bajar` (54,00 € de precio final) y los del porcentaje de una cantidad (`45 : 20`, `0,02 · 45`).
2. **En un paso** · *In one step* (sesión 13). La mitad de los ítems, **elegir el número por el que se multiplica**: «Rebajar un 20 % es multiplicar el precio por…» con cuatro opciones de valores distintos (`0,80`, la buena; `0,20`, que da el descuento; `1,20`, que es subir; `0,08`); «Subir un 5 % es multiplicar por…» (`1,05`, la buena; `1,5`; `0,05`; `0,95`). **Nunca `0,8` y `0,80` juntas**: valen lo mismo. La otra mitad, **calcular el precio final** con un campo («45,00 € rebajados un 20 %» → `0,80 · 45 = 36,00 €`; «30,00 € que suben un 10 %» → `1,10 · 30 = 33,00 €`); vale llegar en dos pasos: solo se mira el resultado, y el feedback enseña el camino de un paso.
3. **El IVA** · *VAT* (sesión 13). «Un libro cuesta 20,00 € sin IVA. El IVA de los libros es el 4 %. ¿Cuánto cuesta con IVA?» y un campo (20,80 €). **El tipo va siempre dicho en el enunciado y es el que ese producto tiene de verdad en España** (lista corta y cerrada, que se revisa al escribirla: 4 %, libros, pan, leche y fruta; 10 %, el menú de un restaurante, un billete de autobús o de tren y una entrada de cine; 21 %, ropa, un móvil, un videojuego y una bicicleta). Ejemplos: 50,00 € más el 21 % → 60,50 €; un menú de 12,00 € más el 10 % → 13,20 €. Errores con nombre: `dar-el-iva` (10,50 €), `sumar-el-porcentaje` (`50 + 21 = 71`), `bajar-por-subir` (39,50 €) y `unidades-como-decimas` (el 4 % como `1,4 · 20 = 28`). **Nunca al revés** (del precio con IVA al precio sin IVA): es «el precio antes de…», punto a decidir.
4. **¿Qué piden?** · *What are they asking for?* (sesión 14). Un problema de rebaja, de subida o de IVA con **una de dos preguntas** («¿Cuánto se ahorra?» o «¿Cuánto paga?»; «¿Cuánto es el IVA?» o «¿Cuánto cuesta con IVA?») y **cuatro cantidades**: para 45,00 € con un 20 % de descuento, `9,00 €` (el descuento), `36,00 €` (el precio final), `54,00 €` (`subir-por-bajar`) y `25,00 €` (`restar-el-porcentaje`). La buena depende de la pregunta; el error de la destreza es dar la otra. **Nunca con el 50 %** (el descuento y el precio final coinciden y habría dos opciones iguales), y cada distractor devuelve `null` cuando coincide con otra opción (se sustituye por `coma-de-mas`, 0,90 €).
5. **Caza el error** · *Spot the mistake* (sesión 14). «Una bici cuesta 200,00 €. Sube un 20 % y después baja un 20 %. Leo dice que vuelve a costar 200,00 €. Compruébalo» y **dos campos**: el precio después del primer cambio (240,00 €) y el precio final (192,00 €). La mitad, al revés (baja y luego sube: 160,00 € y 192,00 €). El porcentaje, 5, 10, 15 o 20 % (es una subida: cota del 20 %); el precio, un múltiplo de 100,00 € dentro de la cota de su contexto, para que los dos pasos salgan exactos (100,00 € con el 15 %: 115,00 € y 97,75 €). El error que se caza es teclear el precio inicial (`se-queda-igual`): el feedback dice que **el segundo porcentaje se calcula sobre el precio nuevo** (`20 % de 240 = 48`, no 40) y acaba con «no se queda igual: cuesta 8,00 € menos». **Se hace en dos pasos, uno detrás de otro**: ni se suman ni se multiplican porcentajes, y no sale ningún otro encadenado.
6. **Para todos los ejercicios**: introducción con un ejemplo resuelto en los dos idiomas; el ítem en el idioma que le toque (la base alterna); «Comprobar» que se oculta al responder; los cuatro estados tras comprobar donde haya opciones; feedback con los números del ítem (el paso corregido); cada fallo pasado a `api.responder` con su `error` (el nombre del error típico) y la `respuesta` del alumno, para el registro de fallos. Los campos, con `campoNumero` y lectura con el `deTexto` de `proporcion.js` (sin `eval`; **comparación por valor, en céntimos enteros**: `36`, `36 €` y `36,00 €` son lo mismo, con coma o con punto). Nunca `1.21 * 50` ni `toFixed` sobre un flotante (regla 10). Tras un fallo, el feedback da el método antes que la cifra («el 20 % de 45 € son 9 €, que es el descuento: se pagan `45 − 9 = 36,00 €`») y **reutiliza la función de la explicación del «No lo sé»**, no una tercera versión (decisiones del 14-11).
7. **El botón «No lo sé»** (M22; `docs/no-lo-se.md`), desde el principio y en los cinco ejercicios: cada uno declara su `explicacion(item, { idioma, t, tt, esc })`, pura y exportada desde `textos.js` o `logica.js`, que resuelve **ese ítem**, una operación por línea (`<ol class="pasos-ayuda">`), y acaba con la solución tal como la da por buena el ejercicio: en el 1, el descuento y la resta (`0,20 · 45 = 9`; `45 − 9 = 36`); en el 2, de dónde sale el número (`100 % − 20 % = 80 % = 0,80`) y, si se pide, el producto; en el 3, el IVA y la suma, con la frase de respuesta; en el 4, qué pide la pregunta y su cuenta; en el 5, los dos pasos y la conclusión. `noLoSe: { es: 'No sé hacerlo', en: 'I don’t know how' }` en el 1, el 3 y el 5 (son de calcular); en el 2 y el 4, el texto por defecto. Ningún `sinAyuda`. No hay nada que decidir sobre retos ni puntos extra: el `reto` es un campo de la tarea semanal (decisiones del 16-11), no de la práctica.
8. **Test** `tests/practicas-descuentos.test.js` (por fuerza bruta, 3000 ítems por ejercicio con semillas fijas) y `tests/practicas-ayuda-descuentos.test.js` (1000 ítems por ejercicio y por idioma: la explicación contiene la solución, calculada con `logica.js`):
- Todos: precios y porcentajes dentro de la cota de su contexto (`assert` por contexto) y de las listas de arriba; **todas las cantidades, céntimos enteros sin redondear**; cada precio final, comprobado **por un segundo camino** con enteros o `BigInt` (el de un paso, `P · (100 ∓ p) : 100`, contra «precio menos descuento» o «precio más subida»).
- Ej. 1: los dos campos aceptan cualquier escritura de su valor; `campos-cambiados` se reconoce como tal; ningún error con nombre da el valor bueno (cada uno devuelve `null` cuando coincide).
- Ej. 2: las cuatro opciones, con valores distintos dos a dos (`0,8` y `0,80` son la misma) y exactamente una igual a `(100 ∓ p) : 100`; el *pool*, barajado.
- Ej. 3: el tipo de IVA es 4, 10 o 21 y es el de la lista para ese producto; el precio con IVA, exacto al céntimo.
- Ej. 4: las cuatro cantidades, distintas dos a dos; la buena es la que corresponde a la pregunta del ítem; el 50 % no sale nunca; las dos preguntas, a partes iguales (± 5 %).
- Ej. 5: los dos pasos, exactos; el precio final es siempre distinto del inicial (y menor); teclear el inicial se reconoce como `se-queda-igual`.
- Ningún texto de alumno con `×`, con un precio sin sus dos decimales, con restos de coma flotante, con un redondeo o un «aproximadamente», con el `%` mal escrito para su idioma, con un porcentaje fuera de las listas, ni con lo que no entra hasta el acta («¿cuánto costaba antes?», «¿cuál era el precio sin IVA?», un porcentaje «sobre el precio ya rebajado» fuera del ejercicio 5) o con lo que el acta deje fuera (regla 2); recorre los textos generados en los dos idiomas.
- Todo distractor distinto de la respuesta correcta **por valor** y sacado de un error típico con nombre; ningún par de opciones con el mismo valor.
- **Variedad** (criterio del 13-11): ningún ítem (misma `clave`) sale en más del 10 % de los de su ejercicio.
- Los casos de la hoja del paquete (en claro) y los del examen (por huella FNV-1a del caso normalizado por valor —el tipo de problema, el precio y el porcentaje como fracciones irreducibles, sin el contexto—, calculada fuera del repo) no salen nunca (si existen al escribirla).

## Datos de entrada

- El inventario de la unidad 7, solo lectura: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/inventario-unidad7.tsv` (**el 19-11 no existía**: lo propone la tarea 01 de su reparto; ids definitivos tras la firma F0; la ENTREGA de la 211 dice cuáles son los tuyos).
- Carpeta de la unidad (solo lectura): `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/` — cuando existan, `secuenciación-unidad7.pdf` (qué se da en cada sesión), `inventario-unidad7-revision.md` (el acta: qué entra, la notación y las cotas), los contenidos y apuntes que deje la tarea 04 de su reparto (errores típicos) y las hojas y exámenes (para no repetir sus casos). Hasta entonces, `reparto-unidad7/proyecto.md` (calendario y reglas 1-18).
- Material de otros cursos, por si sirve (no es obligatorio): la nota `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/reparto-unidad7/hechos/notas/s-20261118T221619-b66ec280-inventario-material-otros-cursos.md` (sus exámenes de 2016 a 2025: el precio original tras una rebaja, en 2022-23 y 2025; el IVA y los encadenados, nunca; y un banco de 241 problemas, de los que 22 fallan el realismo: cantera de contextos, con precios nuevos).
- `practicas/_comun/*` y `practicas/plantilla/*`: solo lectura.

## Cómo saber que ha terminado

- `node --test tests/practicas-comun.test.js tests/practicas-descuentos.test.js tests/practicas-ayuda-descuentos.test.js tests/practicas-no-lo-se.test.js` en verde y `npm test` sin fallos en tus ficheros.
- En local (`npm run servir`), http://localhost:8080/practicas/descuentos/ con «Probar sin código» (nunca el código de un alumno ni AJJN), a 375 px y en ventana ancha, en español y en inglés; en cada ejercicio, un ítem acertado, uno fallado y uno con «No lo sé», mirando el feedback y la tarjeta. La práctica **no sale en la portada** (está con `disponible: false` hasta su tarea de publicación): se entra por la URL.
- A mano: 15 ítems de cada ejercicio en cada idioma, con las cuentas comprobadas una a una, y el repaso de realismo (¿es creíble cada precio, cada rebaja y cada subida que puede salir, no solo el ejemplo? ¿lleva cada producto su IVA de verdad?).

## Trampas conocidas

- Los personajes llevan nombres inventados y la lista de nombres de la práctica se coteja contra los alumnos reales si la sesión llega a la carpeta de datos (si no, nombres poco habituales); nunca un nombre de alumno real en el repositorio público.
- `.cuenta` no se parte (`nowrap`): solo cuentas cortas; las frases del feedback van como texto normal o se salen de 375 px. Del signo de puntuación que sigue a una cuenta se ocupa la base (`pegarSignos` de `piezas.js`, que llama ella, no la práctica): no lo parchees a mano.
- `-` y `−`, `*` y `·` se parecen: en los tests busca por código; lo que teclea el alumno pasa por `deTexto`, que los normaliza.
- Puede haber varias sesiones a la vez en este árbol (las prácticas 212-226 van en paralelo): no metas en tu commit nada que no sea tuyo, y nada de `git stash`. Si el `http.server` del 8080 de otra sesión se cae, levanta el tuyo en otro puerto y mátalo al acabar.
- El test compara **por valor** (el dinero, en céntimos enteros): dos escrituras del mismo valor (`36 €` y `36,00 €`; `0,8` y `0,80`) son la misma respuesta, y dos opciones con el mismo valor son un fallo del test, no un caso raro.
- (U4) Las prácticas se reabrieron en bloque el 28-10 y el 30-10 por copiar casos de las hojas y de los exámenes escritos después: excluye lo que exista al escribirla y deja la huella de examen lista para que la publicación solo tenga que cotejar.
- (U6, tarea 153, reabierta del 13-11) En contextos de dinero, ninguna línea ni solución con fracción: se descarta el caso si no son céntimos exactos y las líneas de `ERRORES_TIPICOS` se pasan a decimales. Una cantidad pedida que no es el dato directo enseña su cuenta.
- (U6, tarea 146) En zsh `git add $F` no separa palabras: usa un array `F=(ruta1 ruta2)` y `"${F[@]}"`. Chrome headless cachea los módulos: tras corregir, `Network.setCacheDisabled` o ves el fallo viejo. Una fila con varios inputs se sale a 375 px: reduce padding, fuente y ancho del input.
- (previsión de la montadora, sin comprobar) Los tipos de IVA de un producto cambian por ley de vez en cuando: por eso el enunciado dice siempre el tipo y la lista de productos es corta; si al escribirla dudas de uno, quítalo de la lista en vez de buscarlo. Y el espacio del `20 %` español es de no separación (`&nbsp;`): en los tests, por código.
- Duración real de una práctica de 4 ejercicios en la U4 sobre la base ya hecha: 11-30 min; en la U6, la 145 (4 ejercicios) duró unos 40 min, **sin** las explicaciones del «No lo sé».
- (221, hecho) Con P = 100,00 € restar «p euros» da el mismo precio que el p %: el generador nunca da 100,00 € (salvo el ej. 5, donde no hay ese error). Con el 50 %, descuento y precio final valen lo mismo: el ej. 1 no marca «campos cambiados» y el 2 y el 4 no usan el 50 %.
- Duración real de la 221: unos 35 min con las explicaciones del «No lo sé», sobre el modelo de la 217 y la 218.

## Prohibido (propio de esta tarea)

- Tocar otras prácticas, la base (`practicas/_comun/`), `catalogo.js`, `portada.js`, `registro.js`, `tareas.js` o los docs: lo que haga falta ahí es propuesta en la terminada. `disponible: true` lo pone la tarea de publicación de su semana, no esta.
- Meter la práctica en una tarea semanal.
- Escribir casos de examen en claro en el repositorio (ni en tests, ni en comentarios, ni en la ENTREGA).

## Salida esperada

- `practicas/descuentos/*`, `tests/practicas-descuentos.test.js` y `tests/practicas-ayuda-descuentos.test.js` comiteados **en este árbol y empujados desde él** (regla de git del 16-11, `CLAUDE.md`: nada de worktrees), con `npm test` sin fallos en tus ficheros.
- `reparto-practicas-u2/salidas/221-descuentos/ENTREGA.md` (hash, ficheros, los ejercicios y sus destrezas con id, las cotas de realismo que has fijado, qué casos de hoja/examen excluye y qué faltaba al escribirla, cómo probarlo en 1 minuto) y su marcador `ENTREGA.md.ok-<sid>`.

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
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 221, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-221.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/221--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/221--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/221-descuentos/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cotas de realismo, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/221--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/221--<sid>.md` con hasta dónde llegaste, la línea
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
- Saltarse las reglas de contenido de la unidad 7 (en esta ficha y en `proyecto.md` de su reparto): `×` en vez de `·`; `eval` o coma flotante (`1.21 * 50`, `toFixed`); un redondeo o un «aproximadamente»; lo que el acta deje fuera y los puntos a decidir mientras no haya acta (aquí: **«el precio antes de la rebaja»**, el precio sin IVA a partir del precio con IVA, **los porcentajes encadenados** fuera del ejercicio 5, el interés) o algo de una sesión posterior a la de la destreza; un IVA que no sea el 4, el 10 o el 21 %, o un descuento de más del 70 %; distractores que puedan ser
  verdad, y en especial **dos opciones con el mismo valor** (`0,8` y `0,80`; `36 €` y `36,00 €`; «rebajar un 25 %» y «pagar el 75 %»), que son dos
  respuestas correctas; casos de examen en claro en el repositorio.
- (U6, 13-11, reabierta de la 153) En contextos de dinero, ninguna línea ni solución con fracción: se descarta el caso si no son céntimos exactos y se pasan a decimales las líneas de ERRORES_TIPICOS.
- (221, 28-11) `practicas/_comun/proporcion.js` exporta `NBSP` (el espacio duro de verdad): no declares `const NBSP = ' '` a mano, el editor lo deja como espacio normal. Un `reserva.js` nuevo no entra en `git commit -- rutas` sin `git add` del fichero. Un caso de introducción puede ser de la hoja sin parecerlo (30,00 € con IVA del 21 % es el casco): pasa las introducciones por `esReservado` en el test.
- (221, 28-11) Duración real de la reabierta: ≈ 15 min.
