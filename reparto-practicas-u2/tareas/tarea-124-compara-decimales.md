# Tarea 124 · Práctica de la unidad 5 «Compara, ordena y redondea» (compara-decimales)

Actualizado: 2026-11-02 (alta de la montadora del reparto de la unidad 5, s-20261102T100120-6a6afb84)
Precondición: 122 LISTA · mejor con la hoja y el examen de su semana ya LISTOS en el reparto de la U5 (semana 1: tareas 06 y 10; semana 2: 07 y 13; toda la unidad: las dos): si existen, excluye sus casos desde el principio (hoja en claro, examen por huella); si no, dilo en la ENTREGA y lo coteja la tarea de publicación de tu semana · Disparo: MANUAL (sesión atendida) · **Plazo: mar 15-12**
Duración esperada: 1 h (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/124-compara-decimales/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/compara-decimales/*` (sustituye el esqueleto que deja la 122: desde que la 122 está LISTA, la dueña de esa carpeta es esta tarea), `tests/practicas-compara-decimales.test.js` (nuevo)

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
   printf 'sesión: %s\ntarea: 124\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/124--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/124--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 124 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/124--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Práctica **«Compara, ordena y redondea» / «Compare, order and round»** (`compara-decimales`, id 58 del catálogo, 4 ejercicios) para la **unidad 5, Decimals**, que
empieza el lunes 18-1. Semana 1 (sesiones 2-3). Tiene que estar LISTA antes del plazo de la tarea de publicación de su semana (semana 1:
**jue 14-1**; semana 2: **jue 21-1**), y mejor antes de Navidad, como todo lo de la U5.

Destrezas (descripción; los ids definitivos, en el inventario tras F0 y en la ENTREGA de la 122): comparar dos decimales (la trampa de las cifras); ordenar varios; intercalar un decimal entre dos; redondear a la unidad, a la décima y a la centésima; estimar un resultado. El texto exacto
de cada una, su sesión y su nota (errores típicos y riesgos) están en el inventario: léelas antes de escribir nada.

**Es un diseño propuesto por la montadora (2-11) y aprobado en bloque por Juan Luis al pedir el alta; él puede cambiarlo.**
Si al hacerla ves que un ejercicio no se sostiene (dos respuestas correctas inevitables, algo de una sesión posterior, algo
que el acta del inventario dejó fuera), no lo cambies por tu cuenta: entrégalo como propuesta en la terminada y sigue con lo
demás. El número de ejercicios (4) está fijado en el catálogo por la 122; otro número también es propuesta.

Modelo de interfaz: `practicas/compara/` (comparar y ordenar fracciones, con la recta) y `practicas/redondeo/` de la U1 si existe (redondear naturales).

## Siguiente paso

1. Lee la ficha de la tarea 01 (§3, el contrato de `arrancar(practica)` y la `api` de `montar`), la `ENTREGA.md` de la 122 (`reparto-practicas-u2/salidas/122-base-unidad5/`) y los módulos que dejó: `practicas/_comun/decimales.js` (`Decimal`, `deTexto`, `aTexto`, `enPalabras`, `lecturasValidas`, `comparar`, `sumar`, `restar`, `multiplicar`, `dividir`, `redondear`, `porPotenciaDe10`, `aFraccion`, `deFraccion`, `ERRORES_TIPICOS`) y `practicas/_comun/recta-decimales.js`. **No los reescribas**: si te falta algo, cópialo en tu `logica.js` y proponlo en la terminada.
2. Lee `practicas/plantilla/` entero y la práctica modelo que cita el Objetivo; `practicas/_comun/piezas.js` (`elecciones`, `claseCorreccion`: los cuatro estados tras comprobar) y cómo ocultan «Comprobar» al responder las prácticas de la U4.
3. `ls practicas/compara-decimales/`: la 122 dejó un esqueleto que carga y declara tus ejercicios. Sustitúyelo empezando por `logica.js` y su test, en verde; después `practica.js` (`montar`) y `textos.js`.
4. Mira si existen ya la hoja y el examen de tu semana en `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/5. Decimals/` (`hojas-de-ejercicios/hoja-unidad5-semanaN.tex`, `exámenes-semanales/semana-N/casos-examen-semanaN.tsv`): si sí, sus casos se excluyen desde el principio (regla 9).

## Qué hay que hacer

1. **¿Cuál es mayor?** · *Which is bigger?* Pares con la trampa de las cifras (3.9 y 3.10; 0.5 y 0.125; 2.45 y 2.5) y pares fáciles; el alumno elige (o `<`, `>`, `=`: con `=` solo cuando son el mismo valor con distinta escritura, 2.5 y 2.50, y entonces el feedback lo explica). Error típico: comparar por el número de cifras.
2. **Ordena** · *Put them in order*. Cuatro o cinco decimales parecidos (misma parte entera, distinto número de cifras) para ordenar de menor a mayor (la interfaz de `compara/`); ninguno repetido por valor.
3. **Entre dos** · *In between*. «Write a decimal between 3.4 and 3.5» (campo libre; vale cualquiera estrictamente entre los dos: `entreDos` para el feedback; error típico: «no hay ninguno»; también elegir entre cuatro cuál está entre dos dados).
4. **Redondea** · *Round it*. Redondear a la unidad, a la décima o a la centésima («to the nearest tenth» / «to one decimal place»: las dos consignas, nunca enfrentadas); escribir o elegir; distractores: truncar (3.678 → 3.67), redondear en cadena (3.649 → 3.65 → 3.7), redondear al orden equivocado. Un ítem de cada cuatro es **estimar** una suma o un producto redondeando antes (elegir la estimación razonable entre cuatro: los distractores, estimaciones de otro orden de magnitud).
5. **Para todos los ejercicios**: introducción con un ejemplo resuelto en los dos idiomas; el ítem en el idioma que le toque (la base alterna; en español coma, en inglés punto); «Comprobar» que se oculta al responder; los cuatro estados tras comprobar donde haya opciones; feedback con los números del ítem; cada fallo pasado a `api.responder` con su `error` (el nombre del error típico) y la `respuesta` del alumno, para el registro de fallos. Los campos de respuesta con `inputmode="decimal"` y lectura con `deTexto` (coma o punto).
6. **Test** `tests/practicas-compara-decimales.test.js` (por fuerza bruta, 3000 ítems por ejercicio con semillas fijas): 
- Ej. 1: los dos decimales distintos por valor salvo en los ítems de `=`, marcados; la mitad de los pares con la trampa de las cifras.
- Ej. 2: cuatro o cinco valores distintos; ninguno con más de 3 cifras decimales.
- Ej. 3: el intervalo no está vacío en décimas o centésimas; cualquier respuesta entre los dos se acepta.
- Ej. 4: el redondeo correcto y cada distractor distintos por valor (el truncado puede coincidir con el correcto: entonces `null` y otro distractor); la consigna dice el orden.
- Ningún texto de alumno con `×`, con letras de variable, con porcentajes, con un punto de millares, con coma en una frase en inglés ni punto en una frase en español (recorre los textos generados en los dos idiomas), ni con lo que el acta deje fuera.
- Todo distractor distinto de la respuesta correcta **por valor** y sacado de un error típico con nombre; ningún par de opciones del mismo valor (0,5 y 0,50; 0,25 y 1/4).
- Los casos de la hoja de la semana (en claro) y los del examen (por huella FNV-1a calculada fuera del repo) no salen nunca (si existen al escribirla).

## Datos de entrada

- El inventario de la unidad 5, solo lectura: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/5. Decimals/inventario-unidad5.tsv` (ids definitivos tras la firma F0 de su reparto; la ENTREGA de la 122 dice cuáles son los tuyos).
- Carpeta de la unidad (solo lectura): `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/5. Decimals/` — `secuenciación-unidad5.pdf` (qué se da en cada sesión), `inventario-unidad5-revision.md` (qué entra y las cotas), `../Repaso de todo/contenidos-unidad5.tex` (errores típicos) y las hojas y exámenes que existan (para no repetir sus casos).
- Material de otros cursos, por si sirve (no es obligatorio): la nota `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/5. Decimals/reparto-unidad5/hechos/notas/s-20261102T100120-6a6afb84-inventario-material-otros-cursos.md` (sus exámenes y hojas de decimales; casi sin problemas con contexto: las cotas de realismo son la cantera).
- `practicas/_comun/*` y `practicas/plantilla/*`: solo lectura.

## Cómo saber que ha terminado

- `node --test tests/practicas-comun.test.js tests/practicas-compara-decimales.test.js` en verde y `npm test` sin fallos en tus ficheros.
- En local (`npm run servir`), http://localhost:8080/practicas/compara-decimales/ con «Probar sin código» (nunca el código de un alumno ni AJJN), a 375 px y en ventana ancha, en español y en inglés; en cada ejercicio, un ítem acertado y uno fallado, mirando el feedback. La práctica **no sale en la portada** (está con `disponible: false` hasta su tarea de publicación): se entra por la URL.

## Trampas conocidas

- `.cuenta` no se parte (`nowrap`): solo cuentas cortas; las frases del feedback van como texto normal o se salen de 375 px.
- El teclado numérico del móvil en español saca coma y en inglés punto: `deTexto` acepta los dos; `inputmode="decimal"` en los campos. `-` y `−`, `,` y `.` se parecen: en los tests busca por código.
- Puede haber varias sesiones a la vez en este árbol (las prácticas 123-129 van en paralelo): no metas en tu commit nada que no sea tuyo, y nada de `git stash`. Si el `http.server` del 8080 de otra sesión se cae, levanta el tuyo en otro puerto y mátalo al acabar.
- El test compara decimales **por valor** (`Decimal.equals`): dos opciones con el mismo valor y distinta escritura son un fallo del test, no un caso raro.
- (U4) Las prácticas se reabrieron en bloque el 28-10 y el 30-10 por copiar casos de las hojas y de los exámenes escritos después: excluye lo que exista al escribirla y deja la huella de examen lista para que la publicación solo tenga que cotejar.
- Duración real de una práctica de 4 ejercicios en la U4 sobre la base ya hecha: 11-30 min.

## Prohibido (propio de esta tarea)

- Tocar otras prácticas, la base (`practicas/_comun/`), `catalogo.js`, `portada.js`, `registro.js`, `tareas.js` o los docs: lo que haga falta ahí es propuesta en la terminada. `disponible: true` lo pone la tarea de publicación de su semana, no esta.
- Meter la práctica en una tarea semanal.
- Escribir casos de examen en claro en el repositorio (ni en tests, ni en comentarios, ni en la ENTREGA).

## Salida esperada

- `practicas/compara-decimales/*` y `tests/practicas-compara-decimales.test.js` comiteados, con `npm test` sin fallos en tus ficheros.
- `reparto-practicas-u2/salidas/124-compara-decimales/ENTREGA.md` (hash, ficheros, los ejercicios y sus destrezas con id, las cotas de realismo que has fijado, qué casos de hoja/examen excluye y qué faltaba al escribirla, cómo probarlo en 1 minuto) y su marcador `ENTREGA.md.ok-<sid>`.

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
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 124, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-124.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/124--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/124--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/124-compara-decimales/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cotas de realismo, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/124--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/124--<sid>.md` con hasta dónde llegaste, la línea
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
