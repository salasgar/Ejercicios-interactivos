# Tarea 233 · Generadores `proporcionalidad.js` y `porcentajes.js` de la app principal al día con el inventario de la U7 (`items`, distractores = errores típicos, nunca dos opciones con el mismo valor, aritmética exacta, cada contexto con su cota)

Actualizado: 2026-11-19 (adaptada a la unidad 7 por la montadora del reparto de la unidad 7, s-20261118T221619-b66ec280, que la dio de alta el 18-11 a partir de la ficha 161 de la unidad 6, con sus trampas; el apartado «Lo que tienen hoy» sale de leer los dos ficheros el 19-11, commit `e1b439d`)
Precondición: F0 del reparto de la U7 firmada (ids definitivos y acta `7. Proportionality/inventario-unidad7-revision.md`: qué entra, el método, las cotas) · no en paralelo con otra tarea que toque esos dos ficheros · Disparo: MANUAL (sesión atendida) · **Plazo: vie 12-2 (límite; puede ir a la vez que la 211, no depende de ella)**
Duración esperada: 1 h 15 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/233-generadores-proporcionalidad/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `src/ejercicios/proporcionalidad.js`, `src/ejercicios/porcentajes.js`, `src/ejercicios/contextos_proporcionalidad.js` (nuevo: el banco de contextos con su cota, como `contextos_mcd_mcm.js`) y sus tests (`tests/proporcionalidad-items.test.js`, nuevo: a 19-11 ningún test propio cubre estos dos ficheros, solo los genéricos `tests/ejercicios.test.js` y `tests/distractores.test.js`, que no se tocan)

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
   printf 'sesión: %s\ntarea: 233\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/233--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/233--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 233 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/233--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Lo que la 112 fue para los generadores de fracciones, la 133 para `decimales.js` y la 161 para los de álgebra: que los dos
generadores de la unidad 7 de la app principal (los ejercicios de la portada antigua, no las prácticas; **ya existen, de antes de
las decisiones del curso**: regla de tres directa con kilos de fruta, inversa con obreros y días, y reparto proporcional; el tanto
por ciento de una cantidad, un aumento o un descuento, el interés simple, dos cambios encadenados y el interés compuesto) citen
las destrezas de la U7 con sus ids en `items`, que cada distractor salga de un error típico del inventario (regla 4), que
**ninguna opción valga lo mismo que otra** (por valor: una razón, una fracción, un decimal y un porcentaje que valen lo mismo son
la misma opción), que la aritmética sea exacta (enteros, racionales y **céntimos enteros**; nada de coma flotante), que **cada
contexto lleve su cota** y un test la compruebe (regla 7, como `src/ejercicios/contextos_mcd_mcm.js`), y que respeten la regla de
oro de `CLAUDE.md` (`construirOpciones` toma los tres primeros distractores: barajar el pool antes). Lo que el acta deje fuera de
la unidad, sale de los generadores; lo que el inventario aprobado tenga y los generadores no (el término que falta, qué
porcentaje es, hallar el total, el IVA), se añade como subtipo nuevo si cabe en la hora; si no, propuesta en la ENTREGA.

## Lo que tienen hoy y hay que cambiar (leídos el 19-11, commit `e1b439d`; los recuentos son de recorrer todos los datos posibles)

En los dos:

- **Sin `items` ni subtipos**: `generar` elige al azar entre una lista `FORMAS` y nada dice qué destreza trabaja cada forma. El
  modelo es `SUBTIPOS` de `src/ejercicios/expresiones_algebraicas.js` (cada forma con su `id` y sus `items`, y el generador con
  `items` y `subtipos`), que dejó la 161.
- **La aritmética**: no llaman a `redondear` (a diferencia de `ecuaciones_primer_grado.js` antes de la 161), pero todos los
  valores son `Number` y todo lo que se pinta pasa por `tex()` de `index.js`, que hace `redondear(n).toString()` (`toFixed(8)`
  sobre un flotante). Hoy sale bien solo porque **todos los datos se eligen para que todo sea entero** (precio por kilo entero;
  `cantidadLimpia`), salvo `total / 2` en el reparto. La consecuencia es que **no hay ni un céntimo**: ni «3 kg cuestan 4,50 €»,
  ni «60,50 €», ni dinero con dos decimales. En cuanto entren los céntimos, el dinero va en céntimos enteros y se pinta con una
  función propia (dos decimales siempre); nunca `precio * 1.21` ni `tex(60.5)`, que escribiría `60{,}5`.
- **Opciones que valen lo mismo**: la `clave` de cada opción es su número, y `construirOpciones` descarta el distractor cuya
  clave ya está. Como cada forma declara **justo tres** distractores y ningún `genericos`, una coincidencia deja dos,
  `construirOpciones` devuelve `null` y `conReintentos` prueba con otros números. O sea: hoy no salen dos opciones iguales, pero
  **los casos con una coincidencia no salen nunca, en silencio** (abajo, cuáles). Y como son tres justos, hoy no hay distractores
  muertos; los habrá en cuanto el pool pase de tres si no se baraja.
- **Los distractores** tienen nombre y pasos, pero varios no son errores de la regla 4 (abajo) y faltan los más típicos.
- **La notación**: `{p}%` pegado también en español (es `20 %` en español y `20%` en inglés); el dinero como `{precio} €` o
  «{b} euros», sin dos decimales, igual en los dos idiomas; ninguna palabra inglesa aclarada entre paréntesis.
- **Ningún contexto tiene cota** y ningún test propio los cubre (solo los genéricos: `tests/ejercicios.test.js`, que los tiene en
  `CON_PASOS`, y `tests/distractores.test.js`).

`proporcionalidad.js` (tres formas: `directa`, `inversa`, `repartoProporcional`, dos veces cada una en `FORMAS`):

- **`directa`** («Si {a} kg de fruta cuestan {b} euros, ¿cuánto cuestan {c} kg?»): `a` de 2 a 9, precio por kilo **entero** de 2
  a 9 €, `c` de 2 a 15. Fuera de la cota de la fruta (0,80-6 €/kg) en 336 de los 896 casos (7, 8 y 9 €/kg). En 64, `c = a` y la
  respuesta es el dato del enunciado. Distractores: `b · c`, `precio + c` y `a · c`; ninguno es «razonar sumando» (`b + (c − a)`:
  si 2 kg cuestan 6 €, 4 kg cuestan 8 €, en vez de 12 €), que es el primero de la regla 4. `a · c` vale lo mismo que la correcta
  cuando `a` es igual al precio por kilo, y `precio + c` cuando los dos son 2: **119 casos que no salen nunca** («3 kg cuestan
  9 €» no existe), y 14 más con dos distractores iguales.
- **`inversa`** («Si {a} obreros hacen un trabajo en {b} días, ¿cuántos días tardarán {c} obreros?»): `a` y los días de 2 a 9, y
  `c` cualquier divisor del producto: **hasta 81 obreros** (más de 12 en 92 de los 266 casos; la cota es de 1 a 12). No dice que
  todos trabajan al mismo ritmo (regla 6). Distractores: los mismos días, `días + (c − a)` (**negativo en 23 casos y 0 en 7**:
  «−5 días») y `c` (igual a la correcta en 4 casos, cuando `c · c = a · días`); en 78 de los 266 (el 29 %) dos distractores
  coinciden y el caso no sale. Falta el error de la regla 4, tratarla como directa (`días · c : a`), que sale exacto en 139 de los
  266 casos y en los demás no puede ser opción (sería un periódico).
- **`repartoProporcional`** («Reparte {total} € en partes proporcionales a {a} y {b}. ¿Cuánto corresponde a la primera parte?»):
  sin contexto y sin decir **proporcional a qué** (regla 6). Distractores: `total : 2`, que **no es entero en 280 de los 1008
  casos** (sale «4,5», dinero con un decimal); la otra parte; y `total · a` (hasta 2295 €; con `a = 1`, 112 casos, es el propio
  total). No hay coincidencias de valor.
- No cubren: la razón, la proporción y el término que falta, las tablas y la constante, «¿directa, inversa o ninguna?», las
  escalas ni las unidades.

`porcentajes.js` (cinco formas: `calcularPorcentaje`, `aumentoDescuento`, `interesSimple`, `aumentosSucesivos`, `interesCompuesto`):

- Todas sacan `p` de la misma lista, `[5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 4, 8]`, y la cantidad de `cantidadLimpia` (de 4 a
  500, elegida para que todo salga entero), sin mirar para qué es.
- **`calcularPorcentaje`**: distractores `cantidad · p`, `cantidad : 2` («toma la mitad», que no es un error de la regla 4 y **vale
  lo mismo que la correcta cuando `p` = 50**: el 50 % de una cantidad no sale nunca, 10 de 120 casos) y `cantidad + p`. Faltan los
  de la regla 4: `cantidad : p` (el 20 % de 50 → 2,5), `20 % = 0,02` y `5 % = 0,5`.
- **`aumentoDescuento`** («Un artículo de {precio} € tiene un descuento del {p}%» / «sube un {p}%»): el mismo `p` para subir y
  para bajar: **sube un 75 %, un 60 %, un 50 %** (la cota de las subidas es del 1 al 20 %) y hay descuentos del 4, el 8 y el 75 %
  (la cota: 10, 15, 20, 25, 30, 40, 50, 60 y 70). «Un artículo» de 4 a 500 €, sin contexto. Sin IVA. Distractores: el cambio
  (igual a la correcta en el descuento del 50 %, que por eso no sale nunca), el sentido contrario y `precio ± precio · p` sin
  dividir entre 100, que **en todos los descuentos es un precio negativo** (120 de 240 casos: 40 € con un 20 % → `40 − 800 =
  −760`). Falta «restar el porcentaje como si fuera un número» (`50 − 20 = 30`, en vez de 40).
- **`interesSimple`**: un capital de 4 a 500 € al 4-75 % anual durante 2-8 años. El interés es punto a decidir de la 02, y un 75 %
  anual no es creíble en ningún caso. En 20 de 840 casos, dos distractores iguales.
- **`aumentosSucesivos`** (cuatro preguntas: sube-sube, sube-baja, baja-sube, baja-baja): los encadenados son punto a decidir de
  la 02. De las 5760 combinaciones descarta 4224 porque no salen enteras; en 55 de las 1536 que quedan un distractor es un precio
  negativo; faltan «sumar los dos porcentajes» y «sube y baja lo mismo: se queda igual».
- **`interesCompuesto`**: fuera de la unidad (regla 2).
- No cubren: las tres escrituras (porcentaje, fracción y decimal), qué porcentaje es una cantidad de otra, hallar el total, el
  IVA, el precio final en un paso.

## Siguiente paso

Lee `src/ejercicios/proporcionalidad.js` y `porcentajes.js` enteros; en `src/ejercicios/index.js`, `construirOpciones`, `conReintentos`, `tex`, `redondear` y `texFraccion`; `src/ejercicios/contextos_mcd_mcm.js` y `tests/contextos-mcd-mcm.test.js` (el modelo de las cotas por contexto: cada contexto declara su rango y un test lo recorre); `src/ejercicios/expresiones_algebraicas.js` (`SUBTIPOS`, los racionales `Q`…, y su `barajarPool` interno) y `tests/algebra-items.test.js` (el modelo del test: 3000 ítems por subtipo y el valor de la correcta recalculado aparte); `docs/coordinacion-unidad1.md` (el campo `items`); la ENTREGA de la 161 (`salidas/161-generadores-algebra/`), y por encima las de la 112 y la 133 (`salidas/112-generadores-fracciones/`, `salidas/133-generador-decimales/`); `tests/distractores.test.js` y `tests/ejercicios.test.js` (lo que ya comprueban). Y el inventario aprobado y el acta de la U7 (Datos de entrada): **lo que diga el acta manda sobre esta ficha**.

## Qué hay que hacer

1. **Mapa** de lo que generan hoy frente al inventario de la U7: qué destrezas cubren, con qué ids, qué no, y qué formas quedan fuera con el acta en la mano (el interés compuesto, seguro; el interés simple, los encadenados, la inversa y los repartos, lo que diga el acta).
2. **`SUBTIPOS` e `items`**, como en los de álgebra: cada forma con su `id` y los ids de la U7 que trabaja; el generador con `items` y `subtipos`; `generar` elige entre los subtipos. Las formas que el acta deje fuera se quitan **con sus `preguntas`, sus `notas` y sus errores** (un error declarado que no sale rompe `tests/distractores.test.js`).
3. **Aritmética exacta**: los datos y las claves, enteros o racionales (los `Q` de `expresiones_algebraicas.js` o unos propios) y **el dinero en céntimos enteros**, con una función que lo pinte con dos decimales; la clave de cada opción, su valor reducido con su unidad (para que `0,2`, `1/5` y `20 %` tengan la misma clave si alguna vez coinciden en un ítem); ningún `/` que pueda dar un decimal no previsto (`total / 2`), ningún `tex()` sobre un flotante.
4. **Distractores desde los errores típicos de la regla 4**, calculados con los números del ítem y con sus pasos: en la directa, razonar sumando, multiplicar sin hallar la unidad, contestar el precio de 1 kg; en la inversa, tratarla como directa (solo cuando sale exacto), no cambiar los días, contestar el total de jornadas; en el reparto, a partes iguales (solo si sale al céntimo), la parte del otro, dividir entre cada número sin sumar las partes; en el tanto por ciento, `cantidad : p`, dividir entre 1000 o entre 10, no dividir; en descuentos y aumentos, dar el cambio por el precio final, el sentido contrario, restar el porcentaje como un número. **Un pool de más de tres por forma, barajado** (`rng.barajar(pool).slice(0, 3)`, o un `barajarPool` como el de los de álgebra, que no se exporta: se copia la idea), filtrado antes: fuera el que valga lo mismo que la correcta o que otro, el que no sea exacto y el que sea absurdo en su contexto (**un precio o unos días negativos o nulos**, más obreros que la cota). Así los casos que hoy no salen nunca (el 50 %, «3 kg cuestan 9 €») vuelven a salir. Cada error con su mensaje en los dos idiomas, ligado a los números (regla 8).
5. **Cada contexto con su cota**, en `src/ejercicios/contextos_proporcionalidad.js`, con la forma de `contextos_mcd_mcm.js` (id, tipo, unidades, rango con mínimos y máximos, origen y el enunciado en los dos idiomas) y las cotas de la regla 7 que apruebe el acta: la compra al peso (0,80-6 €/kg, con céntimos: 3 kg a 4,50 € → 5 kg a 7,50 €), las recetas (2-12 personas, 50-1000 g), el consumo de un coche (4-9 L cada 100 km), los descuentos de una tienda (10-70 % de la lista; una prenda 5-120 €, un móvil 80-1200 €: 45 € con un 20 % → 36,00 €), el IVA (4, 10 y 21 %: 50 € más el 21 % → 60,50 €), las subidas (1-20 %) y un porcentaje de un grupo (personas enteras); y, si el acta deja la inversa y los repartos también en la app, obreros, pintores o grifos (1-12, «todos al mismo ritmo» en el enunciado: 6 obreros, 10 días → 4 obreros, 15 días) y repartos entre 2-4 personas **proporcionales a algo dicho** y exactos al céntimo (120 € en la razón 2 : 3 → 48 € y 72 €). Los datos se generan **eligiendo primero la constante o el resultado**. Varios contextos por forma, para que quien practique mucho no vea siempre la fruta. Solo situaciones que son de proporcionalidad de verdad. Sin nombres propios, o inventados.
6. **La notación de la regla 3** en los textos y en el `tex`: `20 %` en el texto español y `20%` en el inglés; el dinero con dos decimales en el enunciado (`4,50 €`); las unidades con su símbolo y separadas; `\cdot` entre números y la división con `\div` (que la app pinta `:` en español); la palabra inglesa no matemática que decide la respuesta, aclarada entre paréntesis (*discount* (descuento), *at the same rate* (al mismo ritmo), *share* (repartir)); ningún enunciado ambiguo («un 20 % más barato», ¿de qué precio?).
7. **Subtipos nuevos, si caben en la hora** (si no, propuesta en la ENTREGA, por orden): el término que falta en una proporción (`3/4 = x/20`, `x = 15`); qué porcentaje es una cantidad de otra (datos elegidos para que salga exacto: 30 de 150, el 20 %) y hallar el total (el 20 % son 30 → 150), con «calcular el porcentaje del dato» y «dividir al revés» como errores; el IVA.
8. **Test por fuerza bruta** (`tests/proporcionalidad-items.test.js`, 3000 ítems por subtipo con semilla fija, con la forma de `tests/algebra-items.test.js`): el valor de la correcta, recalculado aparte **por un segundo camino** y con enteros (la regla de tres contra la constante; el precio final contra «precio menos descuento»; el reparto contra «las partes suman el total»); ninguna opción vale lo mismo que otra (por valor, no por texto); todo distractor con nombre, con pasos y distinto de la correcta; **todos los datos y el resultado dentro de la cota de su contexto**, y el resultado exacto (personas y obreros, naturales; dinero, al céntimo; ningún periódico; ningún número negativo en ninguna opción); `items` válidos contra el inventario (su ruta sale de `~/.config/docencia/rutas.json`, como en `algebra-items`; sin él, ese test se salta); los textos, sin `\times`, con el `%` según el idioma y con los dos idiomas completos; y cada subtipo sale (ninguno se queda sin ejercicio en `conReintentos`).
9. `npm test` sin fallos (`tests/ejercicios.test.js` y `tests/distractores.test.js` incluidos).

## Datos de entrada

- `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/inventario-unidad7.tsv` (aprobado) y el acta `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/inventario-unidad7-revision.md` (a 19-11 no existen: los escriben la 01 y la 02 del reparto de la U7; por eso esta tarea espera a F0).
- `src/ejercicios/proporcionalidad.js`, `porcentajes.js`, `src/ejercicios/index.js` (`construirOpciones`, `tex`), `src/ejercicios/contextos_mcd_mcm.js` (modelo de las cotas), `src/ejercicios/expresiones_algebraicas.js` y `ecuaciones_primer_grado.js` (modelo de la 161), `src/ejercicios/fracciones_*.js` y `decimales.js` (modelos de la 112 y la 133).
- **Material de otros cursos de Juan Luis** (un vistazo; no es obligatorio usarlo): la sección 5 de `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/reparto-unidad7/hechos/notas/s-20261118T221619-b66ec280-inventario-material-otros-cursos.md` es la cantera de contextos, con números nuevos y pasados por las cotas.
- Si la 211 ya cerró, `practicas/_comun/proporcion.js` y su ENTREGA (solo para leer: las mismas cotas y los mismos nombres de error; la app principal no importa de `practicas/`).

## Cómo saber que ha terminado

`npm test` en verde; el test nuevo pasa con 3000 ítems por subtipo; cada subtipo de los dos generadores cita ids de la U7 en `items`; ningún contexto sin cota; la ENTREGA dice qué formas han salido y por qué punto del acta.

## Trampas conocidas

- `construirOpciones` se planta en tres distractores: barajar el pool (`rng.barajar(pool).slice(0, 3)`), como dice `CLAUDE.md`; `tests/distractores.test.js` lo detecta («toda opción declarada como distractor puede llegar a salir»).
- `tex(n)` de `index.js` pasa por `redondear` (coma flotante) y no pone dos decimales ni separa los millares: para el dinero y para los números de cinco cifras o más hace falta una función propia en el generador (o en el banco de contextos); `index.js` no se toca.
- (previsión de la montadora, sin comprobar) `aplicarNotacion` de `src/i18n/index.js` cambia en inglés `{,}` por punto y `\cdot` por `\times`: lo segundo choca con la regla del curso y ya lo propusieron la 133 y la 161; está fuera de esta tarea, y el test de los textos tiene que mirar el `tex` del generador, no lo ya traducido.
- (previsión de la montadora, sin comprobar) El `%` dentro de un `tex` de KaTeX se escribe `\%`; en los textos con llaves (`{p} %`), tal cual, con espacio de no separación en español.

## Prohibido (propio de esta tarea)

- Tocar otros generadores, `index.js`, `src/i18n/`, `README.md` (sus filas de estos dos generadores hablan del interés compuesto y de los encadenados: lo que haya que cambiar, propuesta en la ENTREGA) o las prácticas.
- Dejar un contexto sin cota, o una forma que el acta deja fuera.

## Salida esperada

- Los dos generadores, el banco de contextos y su test comiteados con `npm test` en verde.
- `reparto-practicas-u2/salidas/233-generadores-proporcionalidad/ENTREGA.md` (hash, qué cubre cada subtipo con sus ids y un ejemplo, la tabla de contextos con sus cotas, qué había antes, qué quedó fuera y qué se propone) y su marcador.

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
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 233, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-233.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/233--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/233--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/233-generadores-proporcionalidad/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cotas de realismo, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/233--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/233--<sid>.md` con hasta dónde llegaste, la línea
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
  funciones y gráficas, geometría con fórmula) o es punto a decidir de la 02 y el acta no admite; algo de una sesión posterior a
  la de la destreza; distractores que puedan ser verdad, y en especial **dos opciones que valen lo mismo** (`0,2` y `20 %`; `1/4`
  y `25 %`; `2,5 km` y `2500 m`; dos métodos correctos enfrentados), que son dos respuestas correctas; casos de examen en claro
  en el repositorio.

## Trampas conocidas (233; las que dejó la 161 de la U6 al cerrar, el 14-11)

- (U6, tarea 161) `expresiones_algebraicas.js` exporta unos racionales exactos mínimos (`Q`, `qSuma`, `qResta`, `qPor`, `qEntre`, `qEsEntero`, `qClave`, `qTex`) que `ecuaciones_primer_grado.js` importa: se pueden importar también desde los dos generadores de esta tarea, **sin tocar sus firmas** (ese fichero no es tuyo).
- (U6, tarea 161) `distractores.test.js` exige que todo error declarado **llegue a salir** con `concepto`: un error que solo es relleno tiene que salir alguna vez en 3000 ítems, o se quita de la tabla. Vale para los errores que hoy están en las dos tablas y dejen de usarse (los del interés y los encadenados, si el acta los deja fuera): se borran de la tabla.
- (U6, tarea 161) Un distractor con paso `mal` necesita una línea que termine en `= valor` (`ejercicios.test.js`, que comprueba `proporcionalidad` y `porcentajes` en su lista `CON_PASOS`): si el valor lleva unidad o `%`, la línea termina igualmente en el valor tal como lo escribe la opción.
- (U6, tarea 161) Duración real: ~15 min de la estimación de 1 h 15 min, con los dos ficheros reescritos y un test nuevo de 26 tests. Aquí hay además un banco de contextos con cotas y dinero en céntimos: la estimación se queda.
- (U6, tarea 161) Su sesión retocó los generadores con scripts desde el shell y lo confesó en la terminada: el código se edita con las herramientas de edición (Prohibido común).
- El `\cdot` nunca va junto a la `x` (`x \cdot 2`): el test nuevo lo comprueba en todo lo que se pinta, también en los pasos de los distractores.
- No hay contextos: no hay cotas de realismo ni casos de hoja o examen que excluir; si algún día entra un generador de problemas, será otra tarea con sus cotas.
