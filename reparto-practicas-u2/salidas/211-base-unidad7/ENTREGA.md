# Entrega de la tarea 211 · Base de la unidad 7

Sesión `s-20261119T184017-5bf93867`, 2026-11-19 (lanzador automático, sin nadie mirando). Commit del código:
**`df9a89e`** (40 ficheros). Para las sesiones de las tareas 212-226: léelo entero antes de escribir nada.

**Los ids de destreza son los de la PROPUESTA** de la tarea 01 del reparto de la U7 (`inventario-unidad7.tsv` del 19-11, primera
línea «PROPUESTA, SIN FIRMAR»; sus 27 puntos en `reparto-unidad7/salidas/01-propuesta-secuenciacion-inventario/puntos-a-decidir.md`):
la 02 (con Juan Luis, firma F0) no se ha hecho. Si F0 cambia ids o quita filas, la tarea de publicación del paquete (227-231) pone
al día a la vez el §7 de `docs/practicas-unidad7.md` y `DESTREZAS` de `registro.js` (un test exige que coincidan). Lo que depende de
F0 está abajo, en «Lo provisional».

## Ficheros entregados

- `practicas/_comun/proporcion.js` (nuevo, puro, sin DOM): la cantidad con su unidad, lo que teclea el alumno, la escritura, las
  lecturas, las cuentas con su paso a paso, los errores típicos, la huella y el banco de contextos con sus cotas. La API completa
  está en su cabecera; resumen abajo.
- `practicas/_comun/catalogo.js`: filas 84-98, `unidad: 7`, **`disponible: false`**, detrás de las de la U6 y antes de la plantilla;
  la U7 en `UNIDADES` desde el **2027-03-01** (y la fecha en el comentario de encima).
- `practicas/<slug>/index.html` y `practica.js` de los quince slugs: **esqueletos** (cargan con «Probar sin código» y enseñan sus
  ejercicios con los nombres de cada ficha, «en preparación»). Cada ejercicio lleva `sinAyuda: 'Esqueleto en preparación: la
  explicación la escribe la tarea NNN.'` (lo exige `tests/practicas-no-lo-se.test.js` desde la 193): **cámbialo por tu
  `explicacion`** (M22, «No lo sé»).
- `practicas/portada.js`: seis bloques de la U7 (los cinco paquetes y «Para toda la unidad») y una `DESCRIPCION` por práctica.
- `practicas/_comun/registro.js`: `DESTREZAS` de la U7 (y su comentario).
- `docs/practicas-unidad7.md` (nuevo): la entrada, §7 entero (83 filas) con «Lo que este reparto añade a las fichas» y «Destrezas de
  la unidad 7 sin práctica»; los demás apartados, «Por escribir (tareas 227-231)».
- Tests: `tests/practicas-proporcion.test.js` (nuevo, 11 tests: unos 120 casos a mano; 3000 al azar contra `BigInt` por un segundo
  camino —la regla de tres contra la reducción a la unidad y la constante, la inversa por producto, el término que falta en las
  cuatro posiciones, los cinco métodos del porcentaje y su vuelta, el precio final contra «precio menos descuento» y contra el
  factor, el reparto que suma el total y guarda la razón, la escala de ida y vuelta, el cambio de unidad de ida y vuelta, complejo e
  incomplejo—; `mismoValor` con tabla; `leerCantidad` con todas las escrituras y cada motivo; la escritura en los dos idiomas;
  lecturas; cada error típico con su ejemplo y 3000 casos al azar en los que ninguno da lo bueno ni algo inexacto; `distractores`;
  la huella; y los 45 contextos, 500 juegos de datos cada uno dentro de su cota y exactos) y los ajustes de `practicas-comun`
  (lista del catálogo, 61 ejercicios en la U7), `practicas-semana` (`UNIDADES`, `unidadActual` el 28-2 y el 1-3, los bloques de la
  U7, y dos tests que contaban unidades: `erroresTareas` usaba la 7 como unidad que no existe —ahora la 9— y «los bloques van de la
  2 a la 6» —ahora a la 7—), `practicas-registro` (lee la tabla de la U7) y `practicas-editor` (`tareasPorUnidad`, siete unidades).

`npm test`: **2531/2531** (antes del commit, con la 210 ya cerrada).

**No tocado**: `tests/practicas-espacio.test.js`. Su ejemplo `{ n: 7, desde: '2027-01-01' }` de «unidad que no existe» ahora es una
unidad real, aunque el test sigue pasando (el 20-12 la actual sigue siendo la 2). Lo intenté cambiar por `n: 9` cuando la 210 cerró,
y el permiso de la sesión lo denegó: queda como propuesta para quien toque ese fichero (una línea).

**No probado en el navegador**: el permiso de la sesión denegó levantar el servidor local y Chrome headless. Los esqueletos son
copia del de la 144 (que sí se probó así), con `sinAyuda`; cargan en `npm test` (`practicas-no-lo-se` importa todas las filas). La
227 (ALTO, revisión con clics) lo comprueba al publicar.

## Traspaso de titularidad

**Desde que esta tarea está LISTA, cada carpeta `practicas/<slug>/` es de su tarea (212-226)**, que la sustituye entera (empezando
por `logica.js` y su test). Cada práctica pone su `disponible: true` solo cuando la publique su tarea de publicación (227-231).

## Qué práctica cubre qué destreza (ids de la propuesta del 19-11, sin F0)

| Práctica | Destrezas |
|---|---|
| `razones` (212, id 84) | U7-1A-06, 1C-01, 1C-02, 1C-03, 1C-04, 1C-05 |
| `tabla-proporcional` (213, id 85) | U7-1C-07, 1C-08, 1C-09, 1C-10 |
| `regla-de-tres` (214, id 86) | U7-1A-01, 1A-02, 1A-04, 1A-05, 1C-10, 1C-13 |
| `inversa` (215, id 87) | U7-2A-01, 2A-03, 2C-01, 2C-03 |
| `directa-o-inversa` (216, id 88) | U7-2A-02, 2C-02 |
| `repartos` (217, id 89) | U7-2A-05, 2C-04, 2C-05 |
| `tres-escrituras` (218, id 90) | U7-3C-01, 3C-02, 3C-14 |
| `tanto-por-ciento` (219, id 91) | U7-3A-01, 3C-02, 3C-04, 3C-05 |
| `que-porcentaje` (220, id 92) | U7-3A-02, 3A-04, 3A-07, 3C-06, 3C-07 |
| `descuentos` (221, id 93) | U7-3A-05, 3C-09, 3C-10, 3C-11, 3C-13 |
| `escalas` (222, id 94) | U7-4A-01, 4A-02, 4C-01, 4C-02 |
| `unidades` (223, id 95) | U7-1C-12, 4C-03, 4C-04, 4C-05, 4C-06, 4C-07, 4C-08, 4C-10 (pendiente del punto n) |
| `problemas-proporcion` (224, id 96) | U7-1A-03, 1C-11, 1C-12, 4A-05, 5A-01, 5A-02, 5A-03, 5A-04, 5A-06, 5C-01 |
| `errores7` (225, id 97) | U7-1A-01, 2A-01, 3A-05, 3C-01, 4A-01, 5A-06 |
| `leelo7` (226, id 98) | U7-1B-01, 1B-02, 2B-01, 3B-01, 3B-02, 4B-01, 4B-02, 5B-01 |

Las **36 nucleares** de la propuesta tienen práctica. Sin práctica (14, ninguna nuclear): U7-1C-06, 2A-04, 2A-06, 3A-03, 3A-06, 3A-08,
3C-03, 3C-08, 3C-12, 4A-03, 4A-04, 4C-09, 5A-05, 5A-07; el porqué y dónde cabrían, en el §7. Lo que la tabla asigna sin que la ficha
lo nombre (en qué ejercicio va): §7, «Lo que este reparto añade a las fichas». Ojo: U7-1A-03 y U7-1C-12 (el tiempo, sesión 3) se
practican en `problemas-proporcion` (paquete 5) y en `unidades` (paquete 4); si la 227 los quiere en el paquete 1, un contexto de
tiempo en `regla-de-tres` 3.

## Lo que tienes que saber de `proporcion.js`

Los nombres que las fichas 212-226 esperaban están todos: `deTexto`, `aTexto`, `aHtml`, `mismoValor`, `proporcionDirecta`,
`proporcionInversa`, `porcentajeDe`, `aplicarPorcentaje`, `repartir`, `escala`, `cambiarUnidad`, `redondear`, `ERRORES_TIPICOS`,
`CONTEXTOS`, `enPalabras`, `lecturasValidas`.

| Pieza | Qué hace |
|---|---|
| `cantidad(valor, unidad)`, `new Cantidad(…)`, `aCantidad(x)` | Inmutable: `c.valor` (una `Fraccion` irreducible) y `c.unidad` (símbolo de `UNIDADES_MEDIDA` o `null`). El valor se da como `Fraccion`, entero o texto (`'3,5'`, `'3/4'`), **nunca un `Number` con coma**. `aCantidad('2,5 km')` lee el texto. |
| `UNIDADES_MEDIDA`, `ESCALERAS` | Cada unidad con su magnitud, su factor exacto a la base y su nombre en los dos idiomas (británico). Longitud km-mm, masa t y kg-mg, capacidad kL-mL (con `L` mayúscula), superficie km²-mm², tiempo h, min, s, dinero `€` y `cent`, `%` (magnitud `numero`, factor 1/100) y las compuestas `km/h`, `L/100 km`, `€/kg`, `€/L`, `€/h`. |
| `c.magnitud()`, `c.valorBase()`, `c.enUnidad(u)`, `c.esExacta()`, `esExacta(x, cifras)` | `esExacta(c, 2)`: exacto al céntimo. |
| **`mismoValor(a, b)`**, `hayEquivalentes(lista)` | La comparación de la regla 1: misma magnitud y mismo valor en la base (`20 %` = `0,2` = `1/5`; `2,5 km` = `2500 m`; `12 €` = `12,00 €` = `1200 céntimos`; `1,5 h` = `90 min`). Un número suelto toma la unidad del otro (`9` = `9 €`). `0,33` ≠ `1/3`; `20 %` ≠ `20`. Con listas (un reparto), elemento a elemento. Acepta textos. |
| **`leerCantidad(texto, { unidad, magnitud, idioma, razon })`** → `{ ok, valor, escrito, forma, fraccion, razon, unidadEscrita }` o `{ ok: false, motivo, mensaje: { es, en } }`; **`deTexto(texto, opciones)`** → Cantidad o null | `deTexto` devuelve una **Cantidad** (su valor, en `.valor`). Acepta `20 %`, `20%`, `20 por ciento`, *20 per cent*, `0,2`, `0.2`, `1/5`, `12 €`, `12,00 €`, `€12`, `12 euros`, `1200 céntimos`, `2,5 km`, `2 500 m` (también con espacio fino o de no separación), `1 h 30 min`, `3 km 250 m`, `KM`, `l`, `ml`, `m2` y, con `razon: true`, `3 : 4`, `3:4`, «3 a 4», *3 to 4*. **Con `unidad`, el número solo es de esa unidad**: en un campo de `'%'`, «20» es el 20 % y «0,15» es el 0,15 % (lo que pide la 220); otra unidad de la misma magnitud vale (no es error, `NO_ES_ERROR['otra-unidad']`) y `unidadEscrita` dice cuál escribió (la 223 lo necesita para su aviso «escríbela en metros»). `forma`: `entero`, `decimal`, `fraccion` (con `fraccion` = la Fraccion **tal como se escribió**: `6/8` sigue siendo `6/8`, para «la más sencilla»), `porcentaje`, `razon` (con `razon` = `[a, b]` tal cual) o `complejo`. Motivos: `vacio`, `basura`, `unidad-que-no-toca`, `sin-unidad` (con `magnitud` y sin unidad), `dos-comas`, `millares-con-punto` (`50.000`, `2.500`, `1.234,5`; en inglés también `50,000`; `2,500` en español es 2,5), `periodico`, `division-entre-0`, `expresion` (`0,2 · 150`, `45 - 9`, `20 % de 150`, `4,50 : 3`; `3 : 4` sin `razon`). Nunca `eval`. |
| `aTexto(x, idioma, { cifras, forma })`, `aHtml(…)`, `numeroATexto(f, idioma, { cifras })` | `20 %` (con `NBSP`) / `20%`; coma / punto; **espacio fino (U+202F, `FINO`) desde las cinco cifras** (`50 000`; `2500` sin separar); dinero con dos decimales (`12,00 €` / `€12.00`; si una cuenta intermedia no es exacta al céntimo, con las que tenga); unidad tras `NBSP` (`3,5 km`); `900 céntimos` / *900 cents*. Lo que no es decimal exacto sale como fracción (`aHtml`, con la raya). `forma: 'fraccion'` la fuerza. |
| `razonATexto(a, b, idioma, forma)`, `razonAHtml(…)`, `escalaATexto(n)`, `complejoATexto(partes, idioma)` | `forma` = `'fraccion'` (`12/8`, sin simplificar; en HTML, con raya), `'palabras'` («3 a 4» / *3 to 4*), `'de-cada'` («3 de cada 4» / *3 out of 4*) o `'dos-puntos'` (`3 : 4`, **solo escalas y repartos**). `escalaATexto(50000)` → `1 : 50 000`. |
| `enPalabras(x, idioma)`, `lecturasValidas(x, idioma)`, `esLecturaValida(x, texto, idioma)` | x una Cantidad, `{ razon: [a, b] }` o `{ escala: n }`: *twenty per cent* / *percent*; *three to four* / *three is to four*; *one to fifty thousand* / *one in fifty thousand*; *one hundred and fifty* y sin *and*; «veinte por ciento», «tres a cuatro», «uno a cincuenta mil»; *three point five kilometres*; el dinero, con las de `decimales.js`. Sin mayúsculas, tildes ni guiones. **Ninguna lectura válida es distractor.** |
| Cuentas: todas `{ resultado, pasos, … }` | `pasos` = líneas `{ es, en }` de texto plano, **una operación por línea**, para el feedback y el «No lo sé». |
| `sonProporcion(a, b, c, d)` | `{ resultado: booleano, productos }`: `4 · 15 = 60`, `6 · 10 = 60`. |
| `terminoQueFalta(a, b, c, d)` (el que falta, `null`) | Por productos cruzados (punto c de la 01: nunca se «despeja» de un denominador): `3/4 = x/20`, `4x = 3 · 20`, `4x = 60`, `x = 60 : 4`, `x = 15`; también `3/4 = 6/x`. |
| `esTablaDirecta(t)`, `esTablaInversa(t)`, `constante(t, tipo)`, `completarTabla(t, tipo)` | `t = [[x, y], …]`; cocientes o productos con sus líneas; `completarTabla` rellena los `null`. |
| `proporcionDirecta({ a, b, c }, metodo)` | `a ⟶ b`, `c ⟶ x`. `'regla-de-tres'` (por defecto: la oficial, punto b): `3/5 = 4,5/x`, `3x = 5 · 4,5`…; `'unidad'`: `4,50 € : 3 = 1,50 €`, `5 · 1,50 € = 7,50 €`; `'constante'`. Los tres dan lo mismo (test). Si `a` y `c` están en distinta unidad de la misma magnitud, la primera línea es el cambio (`1,5 kg = 1500 g`). Devuelve también `tabla: { filas: [[A, B], [C, null]] }` para pintar **la tabla con las magnitudes arriba** (punto s de la 01: no las dos filas con flecha); las cabeceras las pone la práctica. |
| `proporcionInversa({ a, b, c }, metodo)` | `'regla-de-tres'` (una razón invertida: `6/4 = x/10`, `4x = 6 · 10`…) o `'producto'` (`6 · 10 = 60`, `60 : 4 = 15`); con `comprobacion` (`6 · 10 = 4 · 15 = 60`). |
| `porcentajeDe(p, c, metodo)` | p es el número (20) o una Cantidad en %. `'fraccion'` (`20 % de 150 = 20/100 · 150`, `20/100 · 150 = 30`), `'decimal'` (`20 % = 0,20`, `0,20 · 150 = 30`), `'diez'` (desde el 10 % y el 5 %; si p no es múltiplo de 5, hace `'uno'`), `'uno'`, `'regla-de-tres'`. |
| `quePorcentaje(parte, total)` | `30/150 = 1/5`, `1/5 = 20/100`, `20/100 = 20 %` (o `3/25 = 12/100`); si el denominador no llega a 100, por el decimal. `null` si no sale exacto. Devuelve también `fraccion`. |
| `totalDesdePorcentaje(p, parte)` | `20/100 = 30/x`, `20x = 100 · 30`… → 150. |
| `aplicarPorcentaje(c, p, 'descuento' \| 'aumento')` | `{ cambio, final, factor, pasosDosPasos, pasosComplementario, pasosUnPaso, exacto }`: dos pasos (`20 % de 45,00 € = 9,00 €`, `45,00 € − 9,00 € = 36,00 €`), el complementario (su vía, punto j: `100 % − 20 % = 80 %`, `80 % de 45,00 € = 36,00 €`) y el decimal (`0,80 · 45,00 € = 36,00 €`; *1.21 · €50.00 = €60.50*). |
| `repartir(total, [2, 3])` | `{ partes, unaParte, totalPartes, pasos, comprobacion }` o `null` si no sale exacto (dinero al céntimo; un número suelto —cromos, personas—, entero). |
| `realidad(plano, n, unidad)`, `enElPlano(real, n, unidad = 'cm')`, `hallarEscala(plano, real)`, `escala` | `3 cm · 50 000 = 150 000 cm`, `150 000 cm = 1,5 km`; `4,5 m = 450 cm`, `450 cm : 50 = 9 cm`; `hallarEscala` → el natural n o `null`. `escala.realidad`, `escala.enElPlano`, `escala.hallar`, `escala.aTexto`. |
| `cambiarUnidad(c, unidad)` | `{ resultado, pasos, factor, multiplica, saltos }`: «De km a m hay 3 saltos hacia abajo: se multiplica por 1000», `3,5 · 1000 = 3500`, `3,5 km = 3500 m`; superficie de 100 en 100; el tiempo y la t, «1 h = 60 min: se multiplica por 60». |
| `aComplejo(c, unidades)`, `aIncomplejo(partes, unidad)` | `1,5 h` → `1 h 30 min` (`0,5 h · 60 = 30 min`); `150 min` → `2 h 30 min` (`150 : 60 = 2, y sobran 30 min`); `[3 km, 250 m]` → `3250 m`. |
| `redondear(x, cifras)` | Al más cercano, la mitad hacia arriba, con enteros (`20/3` → `6,67`). Solo si el enunciado lo pide. |
| `ERRORES_TIPICOS[id]` = `{ fn, devuelve, ejemplo, nombre: { es, en }, es, en }` | 30 errores (tabla abajo). `devuelve`: `'cantidad'` o `'lista'` (los dos de reparto). `fn` da **null** cuando coincide con lo bueno, no se aplica, no es exacto (un periódico nunca es opción), no es positivo o se sale de los enteros seguros. Las tres razones (`invertir-razon`, `parte-parte-como-parte-todo`, `parte-todo-como-parte-parte`) sí devuelven fracciones como 4/3. **`es` y `en` repiten el nombre** (la ficha 225 los espera así). El id vale como `error` de `api.responder`. |
| `distractores([[id, …args], …], correcta)` | `[{ valor, error }]` sin los null, sin lo que valga lo mismo que la correcta y sin dos iguales, **por `mismoValor`**. Barájalos antes (trampa de `construirOpciones`). |
| `NO_ES_ERROR` | `otra-escritura`, `otro-metodo`, `percent`, `dinero-sin-ceros`, `razon-sin-simplificar`, `otra-unidad`, `espacio-del-porcentaje`, `coma-o-punto`. |
| `huella(s)`, `normalizarCaso(tipo, datos)`, `huellaCaso(tipo, datos)` | La FNV-1a de `equivalentes/logica.js` y `algebra.js` (test). El caso, por valor y sin unidades (el `%` pasa a p/100): «el 20 % de 150», «el 20 % de 150 €» y «0,2 · 150» dan la misma huella; con `tipo: 'proporcion'` y `[a, b, c, d]`, las dos razones se ordenan (`3/4 = x/20` y `x/20 = 3/4`, la misma); con un objeto, por sus claves. **Calcula las de los exámenes fuera del repo** y guarda solo la huella (regla 9). |
| `CONTEXTOS`, `contexto(id)`, `generarDatos(ctx, rng)`, `dentroDeCota(ctx, datos)`, `enunciado(ctx, datos, idioma, pregunta)`, `NOMBRES` | Ver abajo. |

Los 30 errores típicos, con su ejemplo:

| id | ejemplo |
|---|---|
| `razonar-sumando` | 2 cuestan 5 € → 4 cuestan 7 € (son 10 €) |
| `invertir-razon` | 3 a 4 escrito como 4/3 |
| `parte-parte-como-parte-todo` | chicos y chicas 2 a 3 → «2/3 de la clase» (son 2/5) |
| `parte-todo-como-parte-parte` | chicos a chicas, 2 a 3, escrito como 2/5 (es 2/3) |
| `productos-en-linea` | 15/20 = 12/x → x = 15 · 12 : 20 = 9 (es 16) |
| `directa-en-inversa` | 6 obreros, 10 días → 3 obreros, 5 días (son 20) |
| `inversa-en-directa` | 2 kg, 3 € → 4 kg, 1,50 € (son 6 €) |
| `no-proporcional-como-proporcional` | taxi: 5 km, 8,00 € → 10 km, 16,00 € (son 13,00 €) |
| `dividir-entre-el-porcentaje` | el 20 % de 50 → 50 : 20 = 2,5 (es 10) |
| `porcentaje-entre-mil` | 20 % = 0,02 (es 0,2) |
| `porcentaje-entre-diez` | 5 % = 0,5 (es 0,05) |
| `porcentaje-sin-dividir` | el 20 % de 150 → 20 · 150 = 3000 (es 30) |
| `restar-el-porcentaje-como-numero` | 50 € con un 20 % de descuento → 50 − 20 = 30 € (son 40 €) |
| `sumar-el-porcentaje-como-numero` | 50 € más un 20 % → 50 + 20 = 70 € (son 60 €) |
| `descuento-por-precio-final` | 45 € con un 20 % → 9 € (se pagan 36,00 €) |
| `precio-final-por-descuento` | 45 € con un 20 % → 36 € (el descuento es 9,00 €) |
| `aumento-por-descuento` | 50 € más el 20 % → 40 € (son 60 €) |
| `sube-y-baja-se-queda-igual` | 100 € sube un 20 % y baja un 20 % → «100 €» (son 96 €) |
| `porcentaje-del-dato` | el 20 % son 30 → 6 (son 150) |
| `porcentaje-al-reves` | 30 de 150 → 150 : 30 → 500 % (es el 20 %) |
| `fraccion-sin-pasar-a-porcentaje` | 30 de 150 → «0,2 %» (es el 20 %) |
| `reparto-a-partes-iguales` | 120 € en la razón 2 : 3 → 60 € y 60 € (son 48 € y 72 €) |
| `reparto-sin-sumar-las-partes` | 120 € en la razón 2 : 3 → 60 € y 40 € |
| `escala-al-reves` | 3 cm a 1 : 50 000 → 3 : 50 000 |
| `escala-sin-cambio-de-unidad` | 3 cm a 1 : 50 000 → «150 000 km» (es 1,5 km) |
| `subir-por-bajar` | 3500 m → «3 500 000 km» (son 3,5 km) |
| `superficie-por-diez` | 3 m² → «30 dm²» (son 300 dm²) |
| `hora-decimal-como-minutos` | 1,5 h → «1 h 50 min» (es 1 h 30 min) |
| `minutos-como-hora-decimal` | 1 h 30 min → «1,30 h» (es 1,5 h) |
| `contestar-otra-cosa` | piden el precio de 5 kg y contesta el de 1 kg |

**No están, a propósito** (prohibido de la ficha hasta el acta, puntos k y g): `sumar-encadenados`, «el precio antes de la rebaja»,
el interés, los repartos inversos, la proporcionalidad compuesta. Las fichas proponen otros ids de error (`suma-en-vez-de-multiplicar`,
`razon-invertida`, `dar-el-iva`…): son los de su `logica.js`; si coinciden con uno de aquí, usad el de aquí.

## Los contextos y sus cotas (regla 7)

45 contextos, cada uno con su tipo (`directa`, `inversa`, `porcentaje`, `descuento`, `aumento`, `reparto`, `escala`, `velocidad`,
`moneda`), sus datos (los que llevan `rango: [mín, máx, paso]` o `lista` se sortean; los que llevan `cota`, salen de la cuenta y se
comprueban), `cifras` (lo exacto: por defecto, el dinero al céntimo, personas y cosas enteras, minutos, gramos y mililitros enteros) y
el enunciado en los dos idiomas, por pregunta cuando hay varias (`ctx.es.parte`, `ctx.es.total`, `ctx.es.porcentaje`…; la que va por
defecto, en `ctx.pregunta`). `generarDatos` sortea hasta que todo cae en su cota y sale exacto (elige primero la constante o el
resultado); `dentroDeCota` es lo que afirma el test (500 juegos por contexto). En la inversa, «al mismo ritmo», «iguales» o «comen lo
mismo» está en el enunciado (test). Los personajes, de `NOMBRES` (inventados). `origen`: `'cantera'` si el contexto sale de la nota de
material de la montadora de la U7 (con números nuevos), `'nuevo'` si no. Los ids que pedían las fichas (`clase`, `encuesta`, `club`,
`tiros`, `test`, `ahorros`, `paga`, `cromos`, `refresco`) están.

| id | tipo | origen | datos (rango o lista, y cota de lo que sale) |
|---|---|---|---|
| `fruteria-naranjas` | directa | nuevo | a (kg) 0,5–5; k (€/kg) 0,80–2,50; c (kg) 0,5–5; b (€) cota 0,40–12,50; d (€) cota 0,40–12,50 |
| `fruteria-fresas` | directa | nuevo | a (kg) 0,5–3; k (€/kg) 2,00–6,00; c (kg) 0,5–3; b (€) cota 1,00–18,00; d (€) cota 1,00–18,00 |
| `receta-harina` | directa | cantera | a 2–12; k 20–60; c 2–12; b (g) cota 50–1000; d (g) cota 50–1000 |
| `receta-leche` | directa | nuevo | a 2–12; k 50–150; c 2–12; b (mL) cota 100–2000; d (mL) cota 100–2000 |
| `receta-huevos` | directa | cantera | a 2–12; b 2–12; c 2–12; d cota 1–12 |
| `consumo-coche` | directa | nuevo | a (km) 100–1000; k (L/100 km) 4–9; c (km) 100–1000; b (L) cota 4–90; d (L) cota 4–90 |
| `gasolinera` | directa | nuevo | a (L) 5–60; k (€/L) 1,20–2,00; c (L) 5–60; b (€) cota 6,00–120,00; d (€) cota 6,00–120,00 |
| `cuadernos` | directa | cantera | a 2–12; k (€) 0,50–4,00; c 2–12; b (€) cota 1,00–48,00; d (€) cota 1,00–48,00 |
| `entradas-cine` | directa | nuevo | a 2–10; k (€) 4,50–9,00; c 2–10; b (€) cota 9,00–90,00; d (€) cota 9,00–90,00 |
| `velocidad-andando` | velocidad | cantera | v (km/h) 3–6; t (min) 15–180; d (km) cota 0,5–18 |
| `velocidad-corriendo` | velocidad | cantera | v (km/h) 8–12; t (min) 10–60; d (km) cota 1–12 |
| `velocidad-bici` | velocidad | cantera | v (km/h) 10–25; t (min) 15–180; d (km) cota 2–50 |
| `velocidad-coche` | velocidad | cantera | v (km/h) 60–120; t (min) 30–360; d (km) cota 30–720 |
| `velocidad-tren` | velocidad | cantera | v (km/h) 80–300; t (min) 30–300; d (km) cota 40–1000 |
| `pintores` | inversa | cantera | a 2–12; b 3–60; c 2–12; d cota 3–60 |
| `grifos` | inversa | cantera | a 2–8; b 1–24; c 2–8; d cota 1–24 |
| `maquinas` | inversa | cantera | a 2–12; b 1–24; c 2–12; d cota 1–24 |
| `pienso` | inversa | cantera | a 10–60; b 5–60; c 10–60; d cota 5–60 |
| `viaje` | inversa | cantera | a (km/h) 40–120; b (min) 30–360; c (km/h) 40–120; d (min) cota 20–540 |
| `clase` | porcentaje | nuevo | total 20–30; p (%) 1–99; parte cota 2–30 |
| `encuesta` | porcentaje | nuevo | total 200–1200; p (%) 1–99; parte cota 2–1200 |
| `club` | porcentaje | nuevo | total 100–2000; p (%) 1–99; parte cota 2–2000 |
| `tiros` | porcentaje | nuevo | total 10–50; p (%) 10–90; parte cota 2–45 |
| `test` | porcentaje | nuevo | total 10–50; p (%) 10–95; parte cota 2–50 |
| `ahorros` | porcentaje | nuevo | total (€) 20–500; p (%) 5–95; parte (€) cota 1,00–475,00 |
| `rebajas-camiseta` | descuento | nuevo | precio (€) 5,00–40,00; p (%) {10, 15, 20, 25, 30, 40, 50, 60, 70}; cambio (€) cota 0,50–840,00; final (€) cota 1,00–1200,00 |
| `rebajas-chaqueta` | descuento | nuevo | precio (€) 30,00–120,00; p (%) {10, 15, 20, 25, 30, 40, 50, 60, 70}; cambio (€) cota 0,50–840,00; final (€) cota 1,00–1200,00 |
| `rebajas-videojuego` | descuento | nuevo | precio (€) 10,00–80,00; p (%) {10, 15, 20, 25, 30, 40, 50, 60, 70}; cambio (€) cota 0,50–840,00; final (€) cota 1,00–1200,00 |
| `rebajas-movil` | descuento | nuevo | precio (€) 80–1200; p (%) {10, 15, 20, 25, 30}; cambio (€) cota 0,50–840,00; final (€) cota 1,00–1200,00 |
| `iva-libro` | aumento | nuevo | precio (€) 5,00–40,00; p (%) {4}; cambio (€) cota 0,20–126,00; final (€) cota 5,20–726,00 |
| `iva-restaurante` | aumento | nuevo | precio (€) 10,00–80,00; p (%) {10}; cambio (€) cota 0,20–126,00; final (€) cota 5,20–726,00 |
| `iva-patinete` | aumento | nuevo | precio (€) 100–600; p (%) {21}; cambio (€) cota 0,20–126,00; final (€) cota 5,20–726,00 |
| `subida-abono` | aumento | nuevo | precio (€) 20–60; p (%) 1–20; cambio (€) cota 0,20–12,00; final (€) cota 20,20–72,00 |
| `poblacion` | aumento | nuevo | precio 500–20000; p (%) 1–20; cambio cota 5–4000; final cota 505–24000 |
| `paga` | reparto | nuevo | total (€) 20–200; r1 8–16; r2 8–16; p1 (€) cota 1,00–200,00; p2 (€) cota 1,00–200,00 |
| `trabajo-horas` | reparto | nuevo | total (€) 20–300; r1 2–10; r2 2–10; p1 (€) cota 1,00–300,00; p2 (€) cota 1,00–300,00 |
| `premio-tres` | reparto | cantera | total (€) 60–600; r1 2–10; r2 2–10; r3 2–10; p1 (€) cota 1,00–600,00; p2 (€) cota 1,00–600,00; p3 (€) cota 1,00–600,00 |
| `cromos` | reparto | nuevo | total 20–200; r1 1–5; r2 1–5; p1 cota 1–200; p2 cota 1–200 |
| `refresco` | reparto | nuevo | total (mL) 200–2000; r1 1–4; r2 2–6; p1 (mL) cota 25–2000; p2 (mL) cota 25–2000 |
| `plano-habitacion` | escala | cantera | escala {50, 100, 200}; plano (cm) 0,5–20; real (m) cota 2–10 |
| `mapa` | escala | cantera | escala {25000, 50000, 100000, 200000, 250000, 500000, 1000000}; plano (cm) 0,5–30; real (km) cota 0,5–300 |
| `maqueta-coche` | escala | nuevo | escala {18, 24, 43}; plano (cm) 8–28; real (m) cota 3,5–5 |
| `maqueta-tren` | escala | nuevo | escala {87}; plano (cm) 11,5–28,7; real (m) cota 10–25 |
| `moneda-dolares` | moneda | nuevo | k 1,05–1,30; euros (€) 10–500; otra cota 10,50–650 |
| `moneda-libras` | moneda | nuevo | k 0,80–0,95; euros (€) 10–500; otra cota 8–475 |

**Qué contextos usa la app es el punto t del acta**: la 01 propone para la app la compra al peso, las recetas, el coche, los descuentos y
el IVA y las escalas de planos, y para el papel obreros, grifos, repartos, moneda y mapas. El banco los trae todos (las fichas 215, 217,
222 y 224 los piden); la tarea de cada práctica usa los que el acta le deje. Las velocidades (`velocidad-*`, `viaje`) dependen del
punto p.

## Lo provisional y lo que tiene que decidir Juan Luis (en la 02 de la U7 o al publicar)

1. **F0 sin firmar.** Ids y reparto de destrezas, de la propuesta del 19-11.
2. **`unidades` (95)**: fila y esqueleto creados con `disponible: false` (el acta no existe). **La 230 no la publica sin el acta**
   (punto n: la 01 propone las unidades en la U7 y la superficie en la U8; entonces el ejercicio 3, «Superficie», sale de la práctica y
   la U7 se queda en 60 ejercicios, o en 56 sin la práctica). `cambiarUnidad` trae todas las escaleras.
3. **La inversa y los repartos** (puntos e y f; la 01 recomienda que entren): `inversa` y `directa-o-inversa` (215, 216) no empiezan sin
   el acta, como dicen sus fichas; `repartos` sí.
4. **El tiempo en la sesión 3** (punto o) y **la velocidad** (punto p): ver el §7.
5. **Notación** (punto s): la 01 propone la regla de tres **en su tabla con cabeceras**, no en dos filas con flecha; `proporcionDirecta`
   devuelve `tabla` para eso. El `%` con espacio en español y pegado en inglés, como pide la propuesta.
6. **Calculadora** (punto r): nada en la base depende de ella; los contextos dan números de cuenta corta.

## Cómo probarlo en 1 minuto

`node --test tests/practicas-proporcion.test.js` (11 en verde, unos 4 s). En la consola de cualquier página de `practicas/` servida con
`npm run servir`: `const P = await import('/practicas/_comun/proporcion.js'); P.proporcionDirecta({ a: '3 kg', b: '4,50 €', c: '5 kg' }, 'unidad').pasos.map(p => p.es)`,
`P.leerCantidad('50.000')`, `P.aTexto(P.cantidad(20, '%'), 'en')`. http://localhost:8080/practicas/razones/ → «Probar sin código» → cuatro
ejercicios «en preparación» (igual las otras catorce). La portada no enseña nada nuevo hasta el 1-3-2027 (todo `disponible: false`).
Recarga forzada (cmd+shift+R) si el catálogo viejo está en caché.
