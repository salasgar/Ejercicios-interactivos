# Tarea 223 · Práctica de la unidad 7 «Cambia de unidad» (unidades)

Actualizado: 2026-11-19 (adaptada a la unidad 7 por un subagente de la montadora: ejercicios, cotas, tests y trampas; **todo su contenido es propuesta hasta el acta de la 02 de la U7, y la tarea entera depende de ella**). Antes: 2026-11-18 (alta de la montadora del reparto de la unidad 7, s-20261118T221619-b66ec280, a partir de la ficha 149 de la unidad 6, con sus trampas)
Precondición: 211 LISTA · **solo si el acta de la 02 de la U7 (`/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/inventario-unidad7-revision.md`) existe y deja las unidades de medida en la U7**: sin acta no se reclama, y si el acta las manda a la U8 la práctica no se escribe (la coordinadora marca la tarea como SUSTITUIDA, sin renumerar) · mejor con la hoja y el examen de su paquete ya LISTOS en el reparto de la U7 (paquete 4: tareas 10 y 23 de aquel reparto): si existen, excluye sus casos desde el principio (hoja en claro, examen por huella FNV-1a del caso normalizado por valor); si no, dilo en la ENTREGA y lo coteja la tarea de publicación de tu paquete (la 230) · Disparo: MANUAL (sesión atendida) · **Plazo: vie 29-1 (ideal); límite vie 12-3**
Duración esperada: 1 h 15 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/223-unidades/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/unidades/*` (sustituye el esqueleto que deja la 211: desde que la 211 está LISTA, la dueña de esa carpeta es esta tarea), `tests/practicas-unidades.test.js` (nuevo), `tests/practicas-ayuda-unidades.test.js` (nuevo: el del botón «No lo sé»)

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
   printf 'sesión: %s\ntarea: 223\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/223--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/223--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 223 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/223--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Práctica **«Cambia de unidad» / «Converting units»** (`unidades`, id 95 del catálogo, 5 ejercicios) para la **unidad 7, Proportionality and percentages**, que
se da del lunes 1-3 al viernes 23-4-2027. Paquete 4 (sesiones 16-18; las unidades, en la 17 y la 18; va en la tarea semanal del lunes 12-4). Tiene que estar LISTA antes del plazo de la tarea de publicación
de su paquete, la 230 (paquete 1: **mié 24-2**; paquete 2: **jue 4-3**; paquete 3: **jue 11-3**; paquete 4: **jue 8-4**, mejor antes de las vacaciones, jue 18-3; paquete 5: **jue 15-4**), y mejor antes del vie 29-1.

**Esta práctica existe solo si el acta de la 02 de la U7 deja las unidades de medida en la U7.** Es uno de los puntos a decidir de
aquel reparto (U7 o U8, con la geometría): si el acta las manda a la U8, no se escribe nada (ni se borra el esqueleto ni la fila
del catálogo: eso es de la coordinadora y de la 211); si las deja aquí, el acta dice además **qué unidades** (longitud, masa,
capacidad y superficie es la propuesta; **el volumen y el tiempo son otro punto a decidir y no entran** si el acta no los nombra).

Destrezas (descripción; los ids definitivos, en el inventario tras F0 y en la ENTREGA de la 211): cambios de unidad de longitud; de masa y de capacidad (con dam, hm, dag, hg, daL y hL); de superficie (cada salto, por 100); de complejo a incomplejo y al revés; elegir la unidad sensata. El texto exacto
de cada una, su sesión y su nota (errores típicos y riesgos) están en el inventario: léelas antes de escribir nada.

**Es un diseño propuesto por la montadora del reparto de la U7 (18/19-11), sin acta todavía: la lista de ejercicios de abajo es la
propuesta de `proyecto.md` («Tareas 211-233») y, con F0 firmada, manda el acta**; Juan Luis puede cambiarlo.
Si al hacerla ves que un ejercicio no se sostiene (dos respuestas correctas inevitables, algo de una sesión posterior, algo
que el acta del inventario dejó fuera), no lo cambies por tu cuenta: entrégalo como propuesta en la terminada y sigue con lo
demás. El número de ejercicios (5) está fijado en el catálogo por la 211; otro número también es propuesta.

Modelo de interfaz: `practicas/multiplica-divide-decimales/` de la U5 (multiplicar y dividir por 10, 100 y 1000: la cuenta que hay debajo de cada cambio) y `practicas/fraccion-de/` de la U4 (el modelo del botón «No lo sé»).

## Siguiente paso

1. **Lo primero, el acta** (`…/7. Proportionality/inventario-unidad7-revision.md`): comprueba que deja las unidades de medida en la U7 y apunta en tu reclamo qué magnitudes y qué unidades admite. Si no existe o las manda a la U8, no sigas: `ABANDONADA` en tu reclamo, una línea en `hechos/fallos/` con el motivo, y díselo al usuario.
2. Lee la ficha de la tarea 01 (§3, el contrato de `arrancar(practica)` y la `api` de `montar`), `docs/no-lo-se.md` (el botón «No lo sé», mejora M22: lo llevan todas las prácticas de la U7 desde el principio), la `ENTREGA.md` de la 211 (`reparto-practicas-u2/salidas/211-base-unidad7/`), `docs/practicas-unidad7.md` y el módulo que dejó: `practicas/_comun/proporcion.js` (cantidades con unidad y razones con fracciones exactas; `deTexto`, `aTexto`, `aHtml`, `mismoValor`, `cambiarUnidad` con sus pasos, `redondear`, `ERRORES_TIPICOS`, `CONTEXTOS` con la cota de cada uno; los nombres exactos, los que diga su ENTREGA). **No lo reescribas**: si te falta algo (una unidad, una magnitud), cópialo en tu `logica.js` y proponlo en la terminada.
3. Lee `practicas/plantilla/` entero y las prácticas modelo que cita el Objetivo; `practicas/_comun/piezas.js` (`elecciones`, `campoNumero`, `claseCorreccion`: los cuatro estados tras comprobar) y cómo ocultan «Comprobar» al responder las prácticas de la U5 y la U6.
4. `ls practicas/unidades/`: la 211 dejó un esqueleto que carga y declara tus ejercicios. Sustitúyelo empezando por `logica.js` y su test, en verde; después `practica.js` (`montar`) y `textos.js`.
5. Mira si existen ya la hoja y el examen de tu paquete en `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/` (`hojas-de-ejercicios/hoja-unidad7-semana4.tex` y sus soluciones, `exámenes-semanales/semana-4/casos-examen-semana4.tsv`): si sí, sus casos se excluyen desde el principio (regla 9).

## Qué hay que hacer

**Las unidades y sus símbolos, los del SI** (regla 3), sin punto y separados del número: longitud `km`, `hm`, `dam`, `m`, `dm`, `cm`, `mm`; masa `kg`, `hg`, `dag`, `g`, `dg`, `cg`, `mg`; capacidad `kL`, `hL`, `daL`, `L`, `dL`, `cL`, `mL` (**el litro, siempre con `L` mayúscula**: `hL` y `daL`, nunca `hl` ni `dal`); superficie `km²`, `hm²`, `dam²`, `m²`, `dm²`, `cm²`, `mm²` (el exponente con `<sup>`). En inglés británico: *metres, litres, grams*. Los km-m, m-cm, kg-g, L-mL ya se saben de la U5; lo nuevo son las unidades «raras» y la superficie. **Fuera** mientras el acta no los nombre: el volumen (`m³`), el tiempo (`1,5 h` = 1 h 30 min), la tonelada, la hectárea y las unidades no decimales. **Los números**: el dato, con tres cifras significativas como mucho; el resultado, exacto, con tres decimales como mucho, entre 0,001 y 1 000 000; los de cinco cifras o más, con espacio fino. Son superficies como dato o como medida, nunca calculadas: nada de áreas con fórmula (U8).

1. **Longitud** · *Length*. «Expresa en metros: 3,5 km»: campo de número con la unidad de llegada a la derecha. De uno a tres saltos, en los dos sentidos, con todas las unidades de `km` a `mm`: 3,5 km = 3500 m; 240 cm = 2,4 m; 0,75 hm = 75 m; 45 dam = 450 m. Aquí **sí cuenta la forma** (el enunciado dice en qué unidad): vale `3500` o `3500 m`; si el alumno teclea la misma cantidad en otra unidad (`3,5 km`), no es fallo ni acierto: aviso «es la misma cantidad; escríbela en metros» y sigue en el ítem (si la base no lo permite, propuesta en la ENTREGA). Errores con nombre para el feedback (de `ERRORES_TIPICOS`): subir cuando toca bajar (dividir en vez de multiplicar: `3,5 : 1000 = 0,0035`), un salto de menos o de más (`350`, `35 000`).
2. **Masa y capacidad** · *Mass and capacity*. «2,5 hL = ___ L»: elegir entre cuatro cantidades, todas en la unidad de llegada. Correcta: 250 L. Distractores, cada uno un error con nombre calculado con el dato: un salto de menos (25 L), un salto de más (2500 L), subir cuando toca bajar (0,025 L). Otros ejemplos: 350 dag = 3,5 kg; 75 cL = 0,75 L; 4 hg = 400 g. Al menos la mitad de los ítems lleva una unidad «rara» (`hg`, `dag`, `dg`, `cg`, `hL`, `daL`, `dL`, `cL`, `kL`).
3. **Superficie** · *Area units*. «3 m² = ___ dm²»: elegir entre cuatro. Correcta: 300 dm² (un salto, por 100). Distractores: **el salto por 10** (30 dm², el error de la unidad), un salto de más (30 000 dm²), subir cuando toca bajar (0,03 dm²). Con dos saltos, 2,5 hm² = 25 000 m²: el salto por 10 da 250 m² y «un salto de menos» da también 250 m², así que una de las dos funciones devuelve `null` y entra «un salto de más» (2 500 000 m²). Al revés: 45 000 cm² = 4,5 m². Uno o dos saltos, nunca más (los números se disparan).
4. **Complejo e incomplejo** · *Mixed units*. Dos formas, a partes iguales, las dos con campo de número: de complejo a incomplejo («3 km 250 m = ___ m» → 3250; «4 L 5 cL = ___ cL» → 405) y de incomplejo a complejo con la primera parte ya puesta («2,3 kg = 2 kg ___ g» → 300), para que haya una sola respuesta. Errores con nombre: pegar las cifras («3 km 25 m» → 325 en vez de 3025; por eso un tercio de los ítems lleva un cero intermedio), leer el decimal como la unidad pequeña («2,3 kg = 2 kg 3 g»), y los del ej. 1. Solo longitud, masa y capacidad; con el tiempo (`1,5 h` = 1 h 30 min, y su error «1 h 50 min») **solo si el acta lo admite**.
5. **¿Qué unidad?** · *Which unit makes sense?* Una medida de la vida real con el número ya puesto y cuatro unidades de la misma magnitud («Una botella de agua: 1,5 ___» → L, con mL, cL y kL de falsas; «La altura de una puerta: 2 ___» → m; «De Murcia a Cartagena: 50 ___» → km; «Una manzana: 180 ___» → g; «Una cucharada de jarabe: 5 ___» → mL, con dL, L y kL de falsas). **Banco fijo de 24 casos o más** (ocho por magnitud; con menos, alguno pasa del 10 % de los ítems), cada uno con su intervalo creíble `[mín, máx]` en la unidad base: la correcta cae dentro y **cada falsa queda al menos cinco veces por debajo del mínimo o por encima del máximo** (5 cL de jarabe serían 50 mL: demasiado cerca; por eso no es opción). Sin superficie en este ejercicio (qué superficie es «sensata» es de la U8).
6. **Para todos los ejercicios**: introducción con un ejemplo resuelto en los dos idiomas (la escalera de unidades de la magnitud, en una línea); el ítem en el idioma que le toque (la base alterna); «Comprobar» que se oculta al responder; los cuatro estados tras comprobar donde haya opciones; cada fallo pasado a `api.responder` con su `error` (el nombre del error típico) y la `respuesta` del alumno, para el registro de fallos. **Feedback con los números del ítem**, el método antes que la cifra y una operación por línea: «de hL a L se bajan dos escalones: se multiplica por 100; `2,5 · 100 = 250`»; en superficie, «cada escalón es por 100: `3 · 100 = 300`». Coma decimal en español y punto en inglés. Los campos, con `inputmode="text"` y lectura con `deTexto` de `proporcion.js` (coma o punto, con o sin unidad; comparación con fracciones exactas, nunca `Number`: `0,1 + 0,2` no se calcula en coma flotante).
7. **Botón «No lo sé»** (decisión del 12-11; `docs/no-lo-se.md`): los cinco ejercicios declaran `explicacion(item, { idioma, t, tt, esc })`, pura y exportada desde `textos.js`; el 1 y el 4, además, `noLoSe: { es: 'No sé hacerlo', en: 'I don’t know how' }` (son de calcular); el 2, el 3 y el 5, el texto por defecto. La explicación resuelve ese ítem en tres líneas (cuántos escalones y en qué sentido; por cuánto se multiplica o se divide; la cuenta) y acaba con la respuesta tal como la da por buena el ejercicio; en el ej. 5, cuál es la buena y por qué, con una referencia conocida («una botella grande de agua es 1,5 L»). **El feedback del fallo reutiliza la misma función** (decisión del 14-11: no se inventa una tercera versión). Ningún `sinAyuda`.
8. **Test** `tests/practicas-unidades.test.js` (por fuerza bruta, 3000 ítems por ejercicio con semillas fijas):
- Ej. 1-4: el resultado, exacto y comprobado **por un segundo camino** con `BigInt` (todo pasado a la unidad más pequeña de la magnitud: `mm`, `mg`, `mL`, `mm²`), sin coma flotante; dato y resultado dentro de las cotas de arriba (`assert`).
- Ej. 2 y 3: las cuatro opciones, distintas **por valor** en la unidad base (`mismoValor`); cada distractor sale de un error con nombre y la función devuelve `null` cuando coincide con la correcta o con otro distractor (el caso de los dos saltos de superficie); en el ej. 3, el salto por 10 es distractor siempre que no coincida.
- Ej. 4: de complejo a incomplejo, la suma de las dos partes en la unidad pequeña; al revés, la parte que se pide es menor que un salto entero (300 < 1000) y única.
- Ej. 5: en cada caso del banco, exactamente una unidad cae en el intervalo creíble y las otras tres quedan fuera con el margen de cinco veces; las cuatro son de la misma magnitud.
- Símbolos: ningún texto de alumno con `hl`, `dal`, `dl`, `cl`, `ml`, `kl` o `l` como litro en minúscula, con `Km`, `Kg`, `Dam` o `Hm`, con `mts`, con un símbolo con punto ni con la unidad pegada al número; `²` siempre con `<sup>`.
- Ningún texto de alumno con `×`, con `m³`, con horas o minutos (salvo que el acta admita el tiempo), con «área de» o un cálculo de superficie, con un número de cinco cifras o más sin su espacio fino ni con un periódico; ni con lo que el acta deje fuera (regla 2).
- Variedad (criterio del 13-11): ningún ítem sale en más del 10 % de los de su ejercicio (ojo con el banco fijo del ej. 5).
- Los casos de la hoja del paquete (en claro) y los del examen (por huella FNV-1a del **caso normalizado por valor**: magnitud, unidad de partida, unidad de llegada y la cantidad en la unidad base como fracción irreducible; calculada fuera del repo) no salen nunca: `CASOS_HOJA`, `HUELLAS_EXAMEN` y `esReservado` existen desde el principio y **todos** los generadores los consultan, aunque estén vacíos al escribirla.
- `tests/practicas-ayuda-unidades.test.js`: 1000 ítems por ejercicio e idioma; la explicación contiene la solución que el ejercicio da por buena, calculada con `logica.js`.

## Datos de entrada

- El inventario de la unidad 7, solo lectura: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/inventario-unidad7.tsv` (lo propone la tarea 01 de aquel reparto y lo aprueba la 02: ids definitivos tras la firma F0; la ENTREGA de la 211 dice cuáles son los tuyos).
- Carpeta de la unidad (solo lectura): `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/` — `secuenciación-unidad7.pdf` (qué se da en cada sesión), `inventario-unidad7-revision.md` (el acta: **si las unidades van en la U7**, qué magnitudes entran, la notación y las cotas), `../Repaso de todo/contenidos-unidad7.tex` si ya existe (errores típicos) y las hojas y exámenes que existan (para no repetir sus casos).
- Material de otros cursos, por si sirve (no es obligatorio): la nota `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/reparto-unidad7/hechos/notas/s-20261118T221619-b66ec280-inventario-material-otros-cursos.md` (el apartado 3.5 resume su hoja de unidades de medida y sus tablas de conversión; el 5.I, contextos sueltos de unidades. Ojo: aquel material escribe `Dam`, `Hl`, `Kg`; aquí, los símbolos del SI).
- `practicas/_comun/*` y `practicas/plantilla/*`: solo lectura.

## Cómo saber que ha terminado

- `node --test tests/practicas-comun.test.js tests/practicas-unidades.test.js tests/practicas-ayuda-unidades.test.js tests/practicas-no-lo-se.test.js` en verde y `npm test` sin fallos en tus ficheros.
- En local (`npm run servir`), http://localhost:8080/practicas/unidades/ con «Probar sin código» (nunca el código de un alumno ni AJJN), a 375 px y en ventana ancha, en español y en inglés; en cada ejercicio, un ítem acertado y uno fallado, mirando el feedback, y el botón «No lo sé» pulsado una vez (`?probar=1&ejercicio=<n>`), con la consola limpia. La práctica **no sale en la portada** (está con `disponible: false` hasta su tarea de publicación, la 230): se entra por la URL.
- A mano: 15 explicaciones de cada ejercicio en cada idioma, con las cuentas comprobadas una a una, y los 24 casos del ej. 5 leídos uno a uno con criterio de realismo.

## Trampas conocidas

- `.cuenta` no se parte (`nowrap`): solo cuentas cortas; las frases del feedback van como texto normal o se salen de 375 px. Comprueba a 375 px la línea más larga que saque tu generador y la altura de `m<sup>2</sup>`; los signos pegados a una cuenta los junta la base (`pegarSignos`, tarea 197), no la práctica.
- `-` y `−`, `*` y `·` se parecen, y el espacio fino (`&#8239;`) y el de no separación no se ven: en los tests busca por código; lo que teclea el alumno pasa por `deTexto`, que los normaliza.
- Puede haber varias sesiones a la vez en este árbol (las prácticas 212-226 van en paralelo): no metas en tu commit nada que no sea tuyo, y nada de `git stash`. Si el `http.server` del 8080 de otra sesión se cae, levanta el tuyo en otro puerto y mátalo al acabar. Se escribe, se comitea y se empuja **desde este árbol** (regla del 16-11 en `proyecto.md` y en el `CLAUDE.md` de la raíz): nada de worktrees, salvo la salida que describe `proyecto.md` cuando el push se rechaza, y después se realinea.
- El test compara **por valor** (`mismoValor` de `proporcion.js`, con fracciones exactas y la unidad pasada a la base): dos opciones equivalentes con distinta escritura (`250 L` y `2,5 hL`) son un fallo del test, no un caso raro.
- (U4) Las prácticas se reabrieron en bloque el 28-10 y el 30-10 por copiar casos de las hojas y de los exámenes escritos después: excluye lo que exista al escribirla y deja la huella de examen lista para que la publicación solo tenga que cotejar.
- (U6, tareas 153, 154 y 155) Las tres se escribieron antes que el papel con la reserva vacía y se reabrieron al publicar (en `leelo6`, además, parte de los generadores no llamaba a `esReservado`): deja `CASOS_HOJA`, `HUELLAS_EXAMEN` y `esReservado` conectados en todos los generadores y con su test, para que la 230 solo tenga que rellenarlos.
- (U6, tarea 154) El campo de «Corrígelo» rechazaba el decimal exacto y solo aceptaba la fracción: prueba a mano cada campo con todas las escrituras válidas (`2,4`, `2.4`, `2,4 m`).
- (U6, tareas 153 y 154) En la sesión no se pudo probar a 375 px porque la ventana no cambió de ancho: si te pasa, dilo en la ENTREGA; lo mira la revisión con clics de la 230.
- Duración real de una práctica de 4 ejercicios en la U4 sobre la base ya hecha: 11-30 min; en la U6, la primera pasada de las de origen duró de 11 a 29 min (la 149, 19 min frente a 75 estimados), pero casi todas se reabrieron de dos a cinco veces tras la revisión con el papel ya escrito.
- (previsión de la montadora, sin comprobar) Un test que busque el litro en minúscula con una expresión regular choca con palabras («el», «al», *will*): búscalo solo detrás de un número y un espacio, o en la lista de símbolos de `logica.js`.

## Prohibido (propio de esta tarea)

- Tocar otras prácticas, la base (`practicas/_comun/`), `catalogo.js`, `portada.js`, `registro.js`, `tareas.js` o los docs: lo que haga falta ahí es propuesta en la terminada. `disponible: true` lo pone la tarea de publicación de su paquete (la 230), no esta.
- Meter la práctica en una tarea semanal.
- Escribir casos de examen en claro en el repositorio (ni en tests, ni en comentarios, ni en la ENTREGA).
- Escribirla sin acta, o con un acta que mande las unidades a la U8; y meter el volumen, el tiempo o cualquier magnitud que el acta no nombre.
- El litro en minúscula (`hl`, `dal`, `ml`) o un símbolo que no sea el del SI; calcular un área (U8).

## Salida esperada

- `practicas/unidades/*`, `tests/practicas-unidades.test.js` y `tests/practicas-ayuda-unidades.test.js` comiteados, con `npm test` sin fallos en tus ficheros.
- `reparto-practicas-u2/salidas/223-unidades/ENTREGA.md` (hash, ficheros, los ejercicios y sus destrezas con id, las cotas de realismo que has fijado, qué casos de hoja/examen excluye y qué faltaba al escribirla, cómo probarlo en 1 minuto) y su marcador `ENTREGA.md.ok-<sid>`.

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
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 223, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-223.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/223--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/223--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/223-unidades/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cotas de realismo, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/223--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/223--<sid>.md` con hasta dónde llegaste, la línea
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
- Las reglas de contenido de la unidad 7 (en esta ficha y en `proyecto.md` de su reparto): `×` en vez de `·`; `eval` o coma
  flotante; un periódico con puntos suspensivos; lo que es punto a decidir mientras no haya acta, lo que el acta deje fuera
  (la proporcionalidad compuesta, los repartos inversos, el interés compuesto, la geometría con fórmula, una escala aplicada a un
  área) o algo de una sesión posterior a la de la destreza; distractores que puedan ser
  verdad, y en especial **dos opciones con el mismo valor** (`0,2` y `20 %`; `2,5 km` y `2500 m`; dos métodos correctos enfrentados), que son dos
  respuestas correctas; casos de examen en claro en el repositorio.
- (U7, tarea 223) El acta manda sobre la ficha: la superficie va a la U8 y el tiempo (sesión 18) entra; el ej. 3 se hizo «Horas y minutos». Los errores de «cien en vez de sesenta» y «pegar cifras» dan a veces el mismo número (2 h 30 min → 230): en el test acepta cualquiera de los errores con ese valor.
- (U7, tarea 223) Un `\d{5}` genérico en el test de textos choca con distractores legítimos como `0,00338 dL`; no lo uses. En zsh, `git add $VARIABLE` no separa por espacios: escribe las rutas.
