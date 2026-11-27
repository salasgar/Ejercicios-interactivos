# Prácticas interactivas de la unidad 7 (`practicas/`)

Empezado el 2026-11-19 por la tarea 211 del reparto PU2 (`reparto-practicas-u2/`), que deja
la base de la unidad 7: el catálogo, la portada, los esqueletos, la pieza común `proporcion.js` y la
tabla de destrezas (§7). Los apartados 1-6 y 8 los escriben las tareas de publicación (227-231),
al revisar cada paquete, con el mismo espíritu que [practicas-unidad6.md](practicas-unidad6.md).
La base común, el panel, los dos sistemas de códigos y los varios profesores son los de la
unidad 2: están en [practicas-unidad2.md](practicas-unidad2.md), y aquí solo se cuenta lo que cambia.

Son quince mini-aplicaciones para 1.º ESO bilingüe sobre la unidad 7, **Proporcionalidad y
porcentajes** (ids 84-98 del catálogo, tareas 212-226 de PU2; la portada las enseña por paquetes desde
el lunes 1-3-2027; `unidades`, la 95, solo si el acta de la 02 de la U7 deja las unidades de medida en
esta unidad), con una pieza común nueva en `practicas/_comun/`:

- `proporcion.js`: la **cantidad con su unidad** (un valor `Fraccion` exacto y una unidad de la tabla
  `UNIDADES_MEDIDA`: longitud, masa, capacidad, superficie, tiempo, dinero, `%` y las compuestas
  `km/h`, `L/100 km`, `€/kg`, `€/L`, `€/h`), comparada **por valor** (`20 %` = `0,2` = `1/5`;
  `2,5 km` = `2500 m`; `1,5 h` = `90 min`), que es la regla 1 de la unidad; leer lo que teclea el alumno
  sin `eval` (porcentajes, fracciones, decimales con coma o punto, dinero, cantidades con unidad,
  complejos como `1 h 30 min` y, si se pide, razones como `3 : 4`), con un motivo y un mensaje cuando no
  vale (`50.000`, `0,333…`, una cuenta sin hacer); escribir con la notación de la unidad (`20 %` en
  español y `20%` en inglés, el espacio fino de los millares, el dinero con dos decimales, `1 : 50 000`);
  decirlo en palabras (*twenty per cent*, *three to four*, *one to fifty thousand*) con todas las
  lecturas que valen; **las cuentas de la unidad con su paso a paso** (proporción y término que falta,
  tablas, directa por regla de tres, por reducción a la unidad o por la constante, inversa, porcentajes,
  descuentos y aumentos en dos pasos y en uno, repartos, escalas, cambios de unidad, complejo e
  incomplejo, redondeo); **los errores típicos** (columna `nota` del inventario), de donde salen los
  distractores, cada uno con `null` cuando no sirve; la huella FNV-1a del caso normalizado por valor,
  para excluir los casos de examen sin escribirlos; y **el banco de contextos con la cota de cada uno**
  (regla 7: la compra al peso, las recetas, el coche, la velocidad, la inversa al mismo ritmo, los
  porcentajes de un grupo, las rebajas, el IVA, las subidas, los repartos, las escalas y el cambio de
  moneda). La API está en su cabecera y en la ENTREGA de la tarea 211.

## 1. Qué ve el alumno

Lo mismo que en la unidad 2 (§1 de [practicas-unidad2.md](practicas-unidad2.md)): código,
10 puntos por ejercicio con 5 vidas, el idioma de cada ítem sorteado, el feedback con los
números del ítem, el botón «No lo sé» y la tarea de la semana. Lo propio de la unidad 7
(apartados 1-6 y 8 escritos por la tarea 227 el 2026-11-26, al revisar el paquete 1):

1. **La portada enseña la unidad 7 desde el lunes 1-3-2027** (`desde` de la unidad 7 en
   `UNIDADES`, `catalogo.js`). Antes, una práctica publicada solo se abre por su URL. Las
   prácticas salen por **paquetes**, los de las pruebas tipo test (`BLOQUES` en
   `practicas/portada.js`): paquete 1 (`razones`, `tabla-proporcional`, `regla-de-tres`), 2
   (`inversa`, `directa-o-inversa`, `repartos`), 3 (`tres-escrituras`, `tanto-por-ciento`,
   `que-porcentaje`, `descuentos`; dura del 15-3 al 8-4, con las vacaciones en medio), 4
   (`escalas`, `unidades`), 5 (`problemas-proporcion`) y «Para toda la unidad» (`errores7`,
   `leelo7`).
2. **Una razón, una fracción, un decimal y un porcentaje que valen lo mismo son la misma
   respuesta** (`3/4`, `6/8`, `0,75`, `75 %`; `2,5 km` y `2500 m`; `1,5 h` y `90 min`). Lo que
   teclea el alumno se lee con `leerCantidad`/`deTexto` de `proporcion.js` y se compara **por
   valor**: vale `15`, `15,0`, `15.0` o `30/2`, y `12 €` como `12,00 €`, salvo que la consigna
   pida una forma («la razón más sencilla»). Ninguna opción vale lo mismo que otra (los tests lo
   comprueban con fracciones exactas, nunca con coma flotante), y dos métodos correctos (la
   regla de tres y la reducción a la unidad) nunca se enfrentan.
3. **La notación del acta de la unidad** (23-11): el porcentaje con espacio en español (`20 %`)
   y pegado en inglés (`20%`); la razón como fracción o con palabras («3 a 4», *3 to 4*, «3 de
   cada 4», *3 out of 4*), y `3 : 2` solo detrás de «razón» o «escala» (`:` es dividir); el
   dinero con dos decimales en el enunciado (`12,00 €` / `€12.00`); las unidades del SI
   separadas del número; `·` y `:` entre números; la incógnita, x; la constante se llama
   «precio por unidad» (*unit rate*), sin la letra k.
4. **El método oficial es la regla de tres en su tabla** (las magnitudes arriba, la proporción
   y los productos cruzados), y la **reducción a la unidad** se enseña al lado y vale igual; la
   proporción con la x abajo también se resuelve con los productos cruzados (`3/4 = 6/x →
   3x = 24`), nunca «despejando». Con tiempo, todo a minutos antes de plantear.
5. **Realismo**: cada contexto tiene su cota (las del acta: fruta 0,80-6 € el kilo, recetas
   para 2 a 12 personas, consumo de 4 a 9 L cada 100 km…) y el resultado es exacto (dinero al
   céntimo, personas y objetos enteros, tiempos en minutos enteros).
6. **Cada ejercicio empieza con su introducción**, en los dos idiomas, y el feedback de un fallo
   nombra el error con los números del ítem («si 2 cuestan 5,00 €, 4 no cuestan 7,00 €: se ha
   sumado en vez de multiplicar»).

## 2. Cómo lee el profesor los resultados

Igual que en las unidades 2-6 (§2 de [practicas-unidad2.md](practicas-unidad2.md)): el panel
`practicas/profesor.html`, la nube del espacio de cada profesor y la vista «Fallos» con «qué
falla más». **Cada fallo lleva el id de un error típico** en el campo `error`
(`api.responder({ error })`):

- los de la tabla de la unidad, en `ERRORES_TIPICOS` de `practicas/_comun/proporcion.js`, cada
  uno con su nombre `{ es, en }`, un ejemplo y su función, que devuelve `null` cuando ese error
  da lo mismo que la respuesta (sumar en vez de multiplicar, la razón invertida, parte-parte por
  parte-todo, la regla de tres directa en una inversa, los del porcentaje, el reparto a partes
  iguales, la escala sin cambio de unidad…);
- los propios de una práctica, en su `logica.js` (los de `razones`, `tabla-proporcional`,
  `regla-de-tres`…). Como en las unidades 3-6, el panel no traduce todavía estos ids a su nombre.

## 3. La base común de la unidad 7

Un módulo nuevo en `practicas/_comun/` (tarea 211), puro: **`proporcion.js`** (descrito arriba).
La API completa está en su cabecera y en la ENTREGA de la tarea 211
(`reparto-practicas-u2/salidas/211-base-unidad7/ENTREGA.md`); lo esencial:

| Qué | Cómo |
|---|---|
| La cantidad | `cantidad(valor, unidad)` con un `Fraccion` exacto y una unidad de `UNIDADES_MEDIDA`; `mismoValor` compara por valor en la unidad base (`2,5 km` = `2500 m`) |
| Lo que teclea el alumno | `deTexto` y `leerCantidad`, sin `eval`: porcentajes, fracciones, decimales con coma o punto, dinero, cantidades con unidad, `1 h 30 min`; lo que no vale (`50.000`, una cuenta sin hacer) no cuenta como fallo: sale un aviso con el motivo |
| Escribir y decir | `aTexto`/`aHtml` con la notación de §1.3 en los dos idiomas; las lecturas (*three to four*, *twenty per cent*) con todas las que valen |
| Las cuentas | `proporcionDirecta`, `proporcionInversa`, `porcentajeDe`, `aplicarPorcentaje`, `repartir`, `escala`, `cambiarUnidad`, con sus pasos para el feedback y el «No lo sé»; `redondear` al más cercano, la mitad hacia arriba |
| Los errores típicos | `ERRORES_TIPICOS` (§2) y `distractores` (sin dos que valgan lo mismo entre sí ni con la buena) |
| Los contextos | `CONTEXTOS`, cada uno con su tipo, sus datos con `rango` o `cota` y lo exacto (`cifras`), como `src/ejercicios/contextos_mcd_mcm.js`; `NOMBRES` inventados |
| Los casos reservados | `huellaCaso(tipo, datos)`: la FNV-1a del caso **normalizado por valor** (`3/4 = x/20` y `x/20 = 3/4` dan la misma; el 20 % de 150 y `0,2 · 150`, también), para excluir los casos de examen sin escribirlos |

Lo aprendido en la revisión del paquete 1 (tarea 227):

- **Las cuatro prácticas del paquete 1 se escribieron antes que el acta, la hoja 1 y el examen 1**
  (19-11) y dejaron sus listas de casos reservados vacías. Con proporcionalidad «el mismo caso» es
  el mismo tipo de problema con los mismos datos por valor (la razón irreducible y qué se pide; la
  ecuación de productos cruzados sin importar el orden; los tres datos de una regla de tres en
  cualquier contexto), no el mismo texto, y un generador con números de 1 a 9 o de 1 a 60 tropieza
  con el papel mucho más que uno de álgebra: hay que cotejar **todo** el espacio del generador.
- El feedback de un **acierto** también se lee: en `razones` decía que la respuesta buena «no vale
  lo mismo».
- En una regla de tres, «el mismo caso» son los tres números **en cualquier contexto y en cualquier
  unidad**: «3 min, 75 páginas → 8 min» sale tal cual como «3 personas, 75 g → 8». Por eso la reserva
  lleva dos huellas por caso, la de los números como se escriben y la de la unidad base. En una tabla, el
  mismo precio por unidad con las columnas del papel dentro de las del ítem.
- La notación se mira también en las introducciones y en el paso a paso: `tabla-proporcional` dividía con
  «÷» en español y escribía el dinero sin decimales en sus ejemplos.

Tests: `tests/practicas-proporcion.test.js` (la base de la unidad) y dos por práctica (lógica y
«No lo sé»).

## 4. El contrato de una práctica

El de siempre: [practicas-unidad2.md](practicas-unidad2.md) y `practicas/plantilla/practica.js`.

## 5. Cómo se añade una práctica

Como en la unidad 2 (§5 de [practicas-unidad2.md](practicas-unidad2.md)): copiar
`practicas/plantilla/`, fila en `catalogo.js` con `unidad: 7` y `disponible: false`, `logica.js`
y su test antes que la interfaz, la línea de `DESTREZAS` en `registro.js` y la fila de §7 en el
mismo commit (lo exige `tests/practicas-registro.test.js`), su `slug` en un bloque de `BLOQUES`
y, al publicarla, `disponible: true`. Lo propio de la unidad 7:

1. Las cantidades, con `cantidad` y `Fraccion`; el dinero, en céntimos enteros: **nunca `Number`
   en coma flotante, `toFixed` ni `eval`**. Los tests comprueban la aritmética contra `BigInt` o
   enteros propios, aparte del generador.
2. **Cada distractor, de un error típico** de `ERRORES_TIPICOS` (o uno propio con su nombre
   `{ es, en }`), calculado con los números del ítem, y el mismo id en `api.responder({ error })`.
   Ninguna opción que valga lo mismo que otra **por valor** (ni la buena con una falsa ni dos
   falsas entre sí), y ninguna pareja válida como distractor (*per cent* / *percent*, *ratio 3 to
   4* / `3/4`, regla de tres / reducción a la unidad).
3. Las reglas de contenido de la unidad 7 (en cada ficha 211-233 y, por encima, el acta de la
   unidad del 23-11, `7. Proportionality/inventario-unidad7-revision.md`): cada ejercicio respeta la
   `sesion` de sus destrezas (ninguna inversa antes de la sesión 5, ningún reparto antes de la 7,
   ningún porcentaje antes de la 9, ningún aumento o descuento antes de la 12, ninguna escala antes
   de la 16, ningún interés ni m/s antes de la 20); ni proporcionalidad compuesta ni repartos
   inversos; el **realismo** con una cota por contexto que el test comprueba y el resultado exacto.
4. **Los casos fijos no copian las hojas ni los exámenes** de la unidad: los de las hojas, en
   claro; los de los exámenes semanales y del final, por huella del caso normalizado por valor
   (`huellaCaso`), calculada fuera del repositorio.
5. Probarla en el navegador **pulsando cada botón con un clic**, a 375 px y en ancho, en los dos
   idiomas, y leer el feedback de un acierto y el de un fallo.

## 6. Las quince prácticas

Una fila por práctica, en el orden de los paquetes de la portada. Los ejercicios y las cotas de cada una los
escribe la tarea que la publica (227-231), al revisarla; hasta entonces, su ENTREGA en
`reparto-practicas-u2/salidas/NN-<slug>/`.

| Paquete | Práctica | id | Tarea | Ejercicios | Cotas de realismo |
|---|---|---|---|---|---|
| 1 | `razones` | 84 | 212 | La razón · Equivalentes y la más sencilla · ¿Forman proporción? · El término que falta | ej. 1, términos de 2 a 9 sin divisor común (nunca 1); ej. 2 (b), clase 4-30, azúcar y zumo 50-300, bolsa 4-60, concierto y biblioteca 20-300, términos ≤ 300; la x del ej. 4, entera, también abajo (un tercio) |
| 1 | `tabla-proporcional` | 85 | 213 | ¿Es proporcional? · Completa la tabla · Lo que vale 1 · ¿Directamente proporcionales? (banco de 25 frases) | fruta 0,80-3,50 € el kilo (1-8 kg); entradas 4-15 €; cuadernos 0,70-2,50 €; arroz 60-125 g por persona; coche 4-9 L cada 100 km (100-800 km); taxi y gimnasio con cuota fija; en «Lo que vale 1», fruta hasta 6 €, entrada 3-60 €, cuaderno 0,50-4 €, receta ≤ 1000 g |
| 1 | `regla-de-tres` | 86 | 214 | ¿Cuánto cuesta 1? · ¿Qué planteamiento? · Resuelve y contesta · ¿Tiene sentido? | los nueve contextos directos de `proporcion.js`, cada uno con su cota; resultado exacto (dinero al céntimo) |
| 2 | `inversa` | 87 | 215 | ¿Es inversa? · Completa la tabla · Problemas · Caza el error | obreros 2-12 y 2-60 días; grifos 2-6 y 1-24 h (un depósito); caballos 2-12 y 5-60 días; amigos 2-8 y 1,50-60 € cada uno (total 12-120 €); coche 30-120 km/h y 1-10 h (60-900 km); todos al mismo ritmo, dicho en el enunciado; en «Caza el error», también problemas directos (fruta 0,80-3,50 € el kilo, 1-8 kg; receta para 2-12 personas, ≤ 1000 g) |
| 2 | `directa-o-inversa` | 88 | 216 | Clasifica la situación (banco de 32) · Clasifica la tabla · ¿Qué planteamiento? | en el ej. 1, cada situación con una sola casilla defendible y un par de casos que lo demuestra; en el ej. 3, los contextos de `proporcion.js` con su cota (fruta, pintores, grifos, máquinas, recetas, consumo, pienso, gasolinera); dinero con dos decimales |
| 2 | `repartos` | 89 | 217 | Cuenta las partes · Reparte · ¿Está bien repartido? · Caza el error | entre 2 personas, en una razón de términos 1-5; paga 4-12 € la hora (total 12-108 €); refresco 50-400 mL la parte (total 0,5-2 L; el sirope y el café, siempre la parte pequeña); cromos 4-8 por sobre (total 12-108); todo reparto exacto (al céntimo) |
| 3 | `tres-escrituras` | 90 | 218 | (la 229) | |
| 3 | `tanto-por-ciento` | 91 | 219 | (la 229) | |
| 3 | `que-porcentaje` | 92 | 220 | (la 229) | |
| 3 | `descuentos` | 93 | 221 | (la 229) | |
| 4 | `escalas` | 94 | 222 | (la 230) | |
| 4 | `unidades` | 95 | 223 | (la 230) | |
| 5 | `problemas-proporcion` | 96 | 224 | (la 231) | |
| toda | `errores7` | 97 | 225 | (la 231) | |
| toda | `leelo7` | 98 | 226 | La palabra · Léelo · La consigna · Completa | cada ítem sale desde el lunes de su paquete (`PAQUETES_DESDE`); el consejo del «No lo sé» no nombra nada de un paquete posterior; el dinero en euros con dos decimales |

**Publicadas** (a 2026-11-27): `razones` y `leelo7` (tarea 227); `tabla-proporcional`, `regla-de-tres`, `directa-o-inversa`,
`repartos` e `inversa` (tarea 228). `leelo7` es de toda la unidad, pero filtra por fecha: el 1-3 solo enseña lo de las sesiones 1-3, y cada
paquete se abre su lunes. `tabla-proporcional` y `regla-de-tres` se quedaron sin publicar en la 227 por casos de la hoja 1 y del
examen 1, y las tres del paquete 2 y las del paquete 1 se cotejaron después contra la hoja 2 y el examen 2 (también su repaso del
paquete 1): todas reservan esos casos por huella (`reserva.js` de cada práctica). `inversa` se quedó sin publicar por un caso del
repaso del examen 2 en su «Caza el error» (reabierta de la 228, cerrada en b45a69e) y se publicó después, con una reabierta de
redacción que no la retira («1 horas» y la viñeta suelta de la resolución).

## 7. Qué práctica cubre qué destreza de la unidad 7

Una fila por destreza de `inventario-unidad7.tsv` (83; **propuesta de la tarea 01 del reparto de la
U7, del 2026-11-19, sin firmar**: la aprueba Juan Luis en la tarea 02, firma F0, y el acta será
`inventario-unidad7-revision.md`), con las prácticas que la trabajan según la ficha de cada tarea
(diseño de la montadora de la U7 del 18-11, con el reparto de la tarea 211, porque las fichas citan las
destrezas por descripción; ver abajo). «—» quiere decir que ninguna práctica la trabaja de forma expresa.
`practicas/_comun/registro.js` (`DESTREZAS`) tiene que coincidir con esta tabla: lo comprueba
`tests/practicas-registro.test.js`. **Si F0 cambia los ids o quita filas, la tarea de publicación del
paquete (227-231) pone al día esta tabla y `DESTREZAS` a la vez.** Las 36 nucleares de la propuesta
tienen práctica.

| Destreza | Sem. | Nuclear | Qué es | Prácticas |
|---|---|---|---|---|
| U7-1A-01 | 1 | sí | Resolver problemas de proporcionalidad directa con la regla de tres: tabla con el nombre de las mag… | `regla-de-tres`, `errores7` |
| U7-1A-02 | 1 | sí | Resolver problemas de directa por reducción a la unidad: calcular cuánto es uno y multiplicar | `regla-de-tres` |
| U7-1A-03 | 1 | sí | Resolver problemas de directa con tiempo: pasar las horas y minutos a minutos antes de plantear y d… | `problemas-proporcion` |
| U7-1A-04 | 1 | no | Resolver problemas de directa con un cambio de unidad dentro (km-m, kg-g, L-mL de la unidad 5) | `regla-de-tres` |
| U7-1A-05 | 1 | sí | Contestar con una frase completa, con la unidad, y comprobar que la respuesta es creíble | `regla-de-tres` |
| U7-1A-06 | 1 | no | Resolver problemas de partes y mezclas: recetas y mezclas en una razón dada | `razones` |
| U7-1B-01 | 1 | no | Leer y escribir en inglés una razón y una proporción: ratio, to, for every, out of | `leelo7` |
| U7-1B-02 | 1 | no | Usar en inglés el vocabulario de la proporcionalidad directa: directly proportional, unit rate, per… | `leelo7` |
| U7-1C-01 | 1 | sí | Escribir la razón entre dos cantidades, parte con parte y parte con el todo | `razones` |
| U7-1C-02 | 1 | sí | Simplificar una razón con el m.c.d. y escribir razones equivalentes | `razones` |
| U7-1C-03 | 1 | no | Reconocer si dos razones forman una proporción comparando los productos cruzados | `razones` |
| U7-1C-04 | 1 | sí | Hallar el término que falta en una proporción con los productos cruzados | `razones` |
| U7-1C-05 | 1 | sí | Pasar de una razón parte-parte a una fracción del total y calcular cada parte | `razones` |
| U7-1C-06 | 1 | no | Distinguir una magnitud de su unidad y de lo que no es una magnitud | — |
| U7-1C-07 | 1 | sí | Reconocer si dos magnitudes son directamente proporcionales: al doble, el doble, y el cociente es s… | `tabla-proporcional` |
| U7-1C-08 | 1 | sí | Reconocer situaciones que no son proporcionales aunque las dos cantidades crezcan | `tabla-proporcional` |
| U7-1C-09 | 1 | no | Completar una tabla de proporcionalidad directa | `tabla-proporcional` |
| U7-1C-10 | 1 | no | Calcular el precio por unidad (la constante de proporcionalidad) y usarlo | `tabla-proporcional`, `regla-de-tres` |
| U7-1C-11 | 1 | no | Comparar dos tasas para decidir cuál es mayor (ritmo, rendimiento) | `problemas-proporcion` |
| U7-1C-12 | 1 | sí | Pasar de horas y minutos a minutos y al revés, con las horas decimales sencillas (y media, y cuarto… | `unidades`, `problemas-proporcion` |
| U7-1C-13 | 1 | no | Colocar los datos de un problema en la tabla de la regla de tres y elegir la proporción que le corr… | `regla-de-tres` |
| U7-2A-01 | 2 | sí | Resolver problemas de proporcionalidad inversa: tabla, proporción con una razón invertida y comprob… | `inversa`, `errores7` |
| U7-2A-02 | 2 | sí | Decidir antes de resolver si un problema es de proporcionalidad directa o inversa, y resolverlo | `directa-o-inversa` |
| U7-2A-03 | 2 | sí | Resolver problemas de inversa con tiempo en horas y minutos | `inversa` |
| U7-2A-04 | 2 | no | Resolver problemas de inversa con un cambio de unidad encadenado (semanas y días) | — |
| U7-2A-05 | 2 | no | Resolver problemas de repartos directamente proporcionales a lo que puso cada uno o a lo que trabajó | `repartos` |
| U7-2A-06 | 2 | no | Resolver un reparto al revés: conocida la parte de uno, hallar la de los otros y el total | — |
| U7-2B-01 | 2 | no | Usar en inglés el vocabulario de la inversa y de los repartos: inversely proportional, the more… th… | `leelo7` |
| U7-2C-01 | 2 | sí | Reconocer si dos magnitudes son inversamente proporcionales: al doble, la mitad, y el producto es s… | `inversa` |
| U7-2C-02 | 2 | sí | Clasificar pares de magnitudes en directamente proporcionales, inversamente proporcionales o no pro… | `directa-o-inversa` |
| U7-2C-03 | 2 | no | Completar una tabla de proporcionalidad inversa con el producto constante | `inversa` |
| U7-2C-04 | 2 | sí | Repartir una cantidad en una razón dada | `repartos` |
| U7-2C-05 | 2 | no | Comprobar un reparto: las partes suman el total y están en la razón pedida | `repartos` |
| U7-3A-01 | 3 | sí | Resolver problemas de porcentaje de una cantidad con la parte y el resto | `tanto-por-ciento` |
| U7-3A-02 | 3 | sí | Resolver problemas de hallar el total conocidos la parte y el porcentaje | `que-porcentaje` |
| U7-3A-03 | 3 | no | Hallar el total desde el porcentaje complementario («los que no…») | — |
| U7-3A-04 | 3 | no | Resolver problemas de qué porcentaje es una cantidad de otra | `que-porcentaje` |
| U7-3A-05 | 3 | sí | Resolver problemas de rebajas y subidas en dos pasos: calcular el porcentaje y restarlo o sumarlo | `descuentos`, `errores7` |
| U7-3A-06 | 3 | no | Hallar el precio original conocido el precio rebajado o subido | — |
| U7-3A-07 | 3 | sí | Distinguir en un enunciado si se pide la parte, el total o el porcentaje, y resolverlo | `que-porcentaje` |
| U7-3A-08 | 3 | no | Calcular el porcentaje de una medida y dar el resultado en otra unidad | — |
| U7-3B-01 | 3 | no | Leer y escribir porcentajes en inglés: per cent, percentage, out of a hundred | `leelo7` |
| U7-3B-02 | 3 | no | Usar en inglés el vocabulario de las rebajas, las subidas y el IVA: discount, 20% off, sale price… | `leelo7` |
| U7-3C-01 | 3 | sí | Escribir un porcentaje como fracción de denominador 100, como fracción irreducible y como decimal… | `tres-escrituras`, `errores7` |
| U7-3C-02 | 3 | sí | Calcular los porcentajes fáciles como fracciones: el 50 %, el 25 %, el 10 %, el 20 %, el 75 % y el… | `tres-escrituras`, `tanto-por-ciento` |
| U7-3C-03 | 3 | no | Interpretar porcentajes mayores que 100 y menores que 1 | — |
| U7-3C-04 | 3 | sí | Calcular el tanto por ciento de una cantidad como fracción, como decimal y con la regla de tres | `tanto-por-ciento` |
| U7-3C-05 | 3 | no | Calcular porcentajes mentalmente a partir del 10 % | `tanto-por-ciento` |
| U7-3C-06 | 3 | sí | Calcular qué porcentaje es una cantidad de otra | `que-porcentaje` |
| U7-3C-07 | 3 | sí | Hallar el total conocidos la parte y el porcentaje | `que-porcentaje` |
| U7-3C-08 | 3 | no | Calcular porcentajes con decimales sencillos | — |
| U7-3C-09 | 3 | no | Calcular un descuento o una subida en un paso con el porcentaje complementario: pagar el 80 % o el… | `descuentos` |
| U7-3C-10 | 3 | no | Calcular un descuento o una subida multiplicando por el decimal: por 0,80 o por 1,21 | `descuentos` |
| U7-3C-11 | 3 | no | Calcular el precio con IVA con los tipos de España (21 %, 10 % y 4 %) | `descuentos` |
| U7-3C-12 | 3 | no | Calcular el porcentaje de descuento o de subida conocidos el precio de antes y el de después | — |
| U7-3C-13 | 3 | no | Saber que subir y bajar el mismo porcentaje no deja el precio igual y que los porcentajes encadenad… | `descuentos` |
| U7-3C-14 | 3 | no | Comparar y ordenar fracciones, decimales y porcentajes | `tres-escrituras` |
| U7-4A-01 | 4 | sí | Resolver problemas de escala del plano o del mapa a la realidad, con el cambio de unidad | `escalas`, `errores7` |
| U7-4A-02 | 4 | sí | Resolver problemas de escala de la realidad al plano o a la maqueta | `escalas` |
| U7-4A-03 | 4 | no | Resolver problemas de mapas sin escala escrita, como una proporcionalidad directa | — |
| U7-4A-04 | 4 | no | Resolver problemas de proporcionalidad con un cambio de unidad que no es de los de la unidad 5 | — |
| U7-4A-05 | 4 | no | Resolver problemas de directa o inversa que dan el resultado en horas y minutos | `problemas-proporcion` |
| U7-4B-01 | 4 | no | Leer y usar en inglés el vocabulario de las escalas: scale, map, plan, scale model, one to fifty th… | `leelo7` |
| U7-4B-02 | 4 | no | Usar en inglés los nombres de las unidades y del tiempo: metres, litres, kilograms, an hour and a h… | `leelo7` |
| U7-4C-01 | 4 | sí | Interpretar una escala: cuánto es en la realidad un centímetro del plano o del mapa | `escalas` |
| U7-4C-02 | 4 | no | Hallar la escala de un plano o un mapa | `escalas` |
| U7-4C-03 | 4 | no | Elegir la unidad adecuada para medir algo y estimar su medida | `unidades` |
| U7-4C-04 | 4 | sí | Cambiar de unidad en la escalera de longitud: km, m, dm, cm y mm | `unidades` |
| U7-4C-05 | 4 | sí | Cambiar de unidad en la escalera de masa: t, kg, g y mg | `unidades` |
| U7-4C-06 | 4 | sí | Cambiar de unidad en la escalera de capacidad: L, dL, cL y mL | `unidades` |
| U7-4C-07 | 4 | no | Reconocer y usar las unidades menos frecuentes: dam, hm, dag, hg, daL y hL | `unidades` |
| U7-4C-08 | 4 | no | Pasar una medida de forma compleja a incompleja y al revés (longitud y masa) | `unidades` |
| U7-4C-09 | 4 | no | Sumar y restar medidas dadas en unidades distintas | — |
| U7-4C-10 | 4 | sí | Pasar el tiempo de forma compleja a incompleja y al revés: horas, minutos y segundos | `unidades` |
| U7-5A-01 | 5 | sí | Resolver problemas de velocidad constante: distancia recorrida y tiempo empleado, sin fórmula con l… | `problemas-proporcion` |
| U7-5A-02 | 5 | no | Resolver problemas de cambio de moneda con el tipo de cambio dado en el enunciado | `problemas-proporcion` |
| U7-5A-03 | 5 | no | Comparar dos ofertas por su precio por unidad | `problemas-proporcion` |
| U7-5A-04 | 5 | sí | Elegir el método de un problema de la unidad: directa, inversa, porcentaje, reparto o escala | `problemas-proporcion` |
| U7-5A-05 | 5 | no | Resolver problemas de varios pasos que juntan un porcentaje y una proporcionalidad | — |
| U7-5A-06 | 5 | no | Interpretar la solución de un problema y detectar una respuesta que no es creíble | `problemas-proporcion`, `errores7` |
| U7-5A-07 | 5 | no | Leer un tique o una factura sencilla con IVA | — |
| U7-5B-01 | 5 | no | Usar en inglés el vocabulario de la velocidad, el cambio de moneda y las compras: speed, kilometres… | `leelo7` |
| U7-5C-01 | 5 | sí | Calcular la velocidad media en kilómetros por hora conocidos la distancia y el tiempo | `problemas-proporcion` |

### Lo que este reparto añade a las fichas

Las fichas 212-226 citan las destrezas por descripción; estas son las que la tabla les asigna sin
que la ficha las nombre del todo, y dónde encajan sin cambiar el número de ejercicios:

- `razones`: **U7-1A-06** (partes y mezclas: una receta en una razón dada) en el ejercicio 4, «El término
  que falta», como término que falta en contexto (`2/3 = x/450`).
- `regla-de-tres`: **U7-1A-04** (un cambio de unidad dentro, de los de la unidad 5) en el ejercicio 3;
  `proporcionDirecta` ya pone la línea del cambio (`1,5 kg = 1500 g`). **U7-1C-10** (el precio por unidad)
  en el ejercicio 1, además de en `tabla-proporcional` 3.
- `inversa`: **U7-2A-03** (la inversa con horas y minutos) en el ejercicio 3, con el contexto `viaje` o
  con máquinas y minutos, si el acta admite el tiempo en el paquete 2 (puntos o y p).
- `problemas-proporcion`: **U7-1A-03** y **U7-1C-12** (la directa con horas y minutos; pasar de horas y
  minutos a minutos), **U7-4A-05** (resultados en horas y minutos) en el ejercicio 2, y **U7-1C-11**
  (comparar dos tasas) en el ejercicio 4, «La mejor oferta». **Ojo**: U7-1A-03 y U7-1C-12 son de la
  sesión 3 (paquete 1) y aquí se practican en el paquete 5 (y U7-1C-12, también en `unidades`, paquete 4).
  Si la 227 quiere que salgan ya en el paquete 1, cabe un contexto de tiempo en `regla-de-tres` 3 (los
  `CONTEXTOS` `velocidad-*` sirven, si el acta deja la velocidad en la sesión 3: punto p).
- `unidades`: **U7-1C-12** en el ejercicio 4, «Complejo e incomplejo». El ejercicio 3, «Superficie», no
  tiene destreza en la propuesta: la 01 manda la superficie a la U8 (punto n). Si el acta lo confirma,
  ese ejercicio sale de la práctica (la coordinadora recorta la ficha 223).
- `errores7`: **U7-1A-01** (razonar sumando), **U7-2A-01** (la inversa como directa), **U7-3C-01**
  (`20 % = 0,02`), **U7-3A-05** (el descuento por el precio final), **U7-4A-01** (la escala sin cambio de
  unidad) y **U7-5A-06** (una respuesta que no es creíble): cada plantilla de la ficha 225 con la destreza
  donde se comete su error.
- `leelo7`: **U7-4B-02** (los nombres de las unidades y del tiempo) depende del punto n del acta.

### Destrezas de la unidad 7 sin práctica

- **U7-1C-06** (magnitud y unidad): andamiaje de la hoja 1 (punto b de la propuesta); cabría en
  `tabla-proporcional` 4 si Juan Luis lo quiere.
- **U7-2A-04** (la inversa con semanas y días), **U7-4A-04** (un cambio de unidad que no es de la
  unidad 5 dentro de un problema) y **U7-5A-05** (problemas de varios pasos): nivel 3, del papel (punto t:
  los problemas de varios pasos son del papel).
- **U7-2A-06** (el reparto al revés): reto; cabría en `repartos` 2 como ítem difícil.
- **U7-3A-03** (el total desde el complementario, «los que no…»): cabría en `que-porcentaje` 2.
- **U7-3A-06** (el precio antes de la rebaja) y **U7-3C-12** (el porcentaje de la rebaja conocidos los dos
  precios): punto k del acta; si entran, en `descuentos` (propuesta en la ENTREGA de la 221), no como
  práctica nueva. `proporcion.js` no los trae hasta el acta.
- **U7-3A-08** (el porcentaje de una medida, en otra unidad), **U7-3C-03** (porcentajes mayores que 100 y
  menores que 1) y **U7-3C-08** (porcentajes con decimales sencillos: 2,5 %, 12,5 %): cabrían en
  `tanto-por-ciento` 2 y 4; `porcentajeDe` ya los calcula.
- **U7-4A-03** (el mapa sin escala escrita, como una directa): cabría en `escalas` 1.
- **U7-4C-09** (sumar y restar medidas en unidades distintas): cabría en `unidades` 4 (`aIncomplejo`).
- **U7-5A-07** (un tique con IVA): del papel (punto l); cabría en `descuentos` 3.

## 8. Dónde está lo demás

- El reparto con el que se hacen: `reparto-practicas-u2/` (tareas 211-233; las reglas de la
  unidad 7 en cada ficha, lo entregado en `salidas/NN-<slug>/ENTREGA.md`). El reparto de la
  unidad en el material del curso (`7. Proportionality/reparto-unidad7/`) no toca la app.
- La revisión y publicación de cada paquete, con la **propuesta de la tarea de la app** de ese
  paquete (cinco, una por paquete: acta, punto u): tareas 227-231; la 232 las monta en el panel
  con Juan Luis.
- El inventario de la unidad (solo lectura, fuera del repositorio):
  `<iCloud>/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/inventario-unidad7.tsv`, con el
  acta de su revisión (`inventario-unidad7-revision.md`, decisiones del 23-11, firma F0 del 24-11:
  el método, la razón, la inversa, los repartos, los porcentajes, el interés, las unidades, la
  notación y las cotas) y la secuenciación por sesiones (`secuenciación-unidad7.pdf`) en la misma
  carpeta.
- Tests: `tests/practicas-proporcion.test.js` (la base de la unidad), `tests/practicas-<slug>.test.js`
  y `tests/practicas-ayuda-<slug>.test.js` (por práctica) y `tests/practicas-registro.test.js`
  (§7 contra `DESTREZAS`).
