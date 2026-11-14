# ENTREGA · Tarea 199 · Motor y pantalla comunes de «Coloca los paréntesis», filas 80-82 y esqueletos

Sesión `s-20261114T231408-ded3ac53` (Opus 5.5, ALTO), 2026-11-14. Commit del código: **`9c849b0` en `origin/main`** (cherry-pick
desde un worktree limpio; en el `main` local del árbol compartido es `7f85f66`, mismo contenido). `npm test`: 2355/2355 en el árbol
compartido y 2353/2353 sobre `origin/main` con el cherry-pick.

## Qué queda hecho

| Fichero | Qué es |
|---|---|
| `practicas/_comun/parentesis-motor.js` | El motor (puro) y las cuatro aritméticas, en el mismo fichero. `huella` FNV-1a (base 36, la de `combinadas-fracciones` y `multiplica-divide-decimales`). |
| `practicas/_comun/parentesis-pantalla.js` | La pantalla (DOM): editor, «encuentra todos», diana, resumen y el «No lo sé». |
| `practicas/_comun/parentesis-textos.js` | Los textos comunes `{ es, en }`. |
| `tests/practicas-parentesis-motor.test.js` | Equivalencia con la U1, casos fijos, alcanzables, `buscar`. |
| `practicas/coloca-{enteros,fracciones,decimales}/` | Esqueletos: `index.html`, `estilos.css`, `logica.js`, `textos.js`, `practica.js`. **Desde ahora, cada carpeta es de su tarea (200, 201, 202).** |
| `practicas/_comun/catalogo.js` | Filas 80, 81 y 82, `disponible: false`, detrás de `parentesis-enteros`, `combinadas-fracciones` y `multiplica-divide-decimales`. |
| `tests/practicas-comun.test.js` | Solo la lista `[id, slug, nEjercicios]`. |
| `practicas/portada.js` | Cada slug en su bloque (U3 semana 3, U4 semana 3, U5 semana 2) y sus descripciones. |
| `tests/practicas-semana.test.js` | **No estaba en la ficha** y hacía falta: fija a mano los slugs de cada bloque de la portada (ver «Trampas»). |
| `practicas/_comun/registro.js` y `docs/practicas-unidad{3,4,5}.md` | `DESTREZAS` y §7 a la vez, y una fila «sin publicar» en la tabla de prácticas de cada unidad. |

`practicas/parentesis/` (U1): **sin un solo cambio** (`git diff --stat` vacío ahí).

## API real del motor (`_comun/parentesis-motor.js`)

```js
import { crearMotor, ARITMETICA_NATURALES, aritmeticaEnteros, aritmeticaFracciones, aritmeticaDecimales, huella, signo } from '../_comun/parentesis-motor.js';
const M = crearMotor(aritmeticaEnteros({ tope: 200 }));
```

Una **expresión** es `{ numeros, operaciones, exponente }` (operaciones en ASCII: `+ - * /`; exponente `null`, 2 o 3, sobre lo
último). Los números son valores de la aritmética: enteros JS, `Fraccion` o `Decimal` (también `{ num, den }` y `{ m, k }`
planos, lo que deja JSON). Un **árbol** es `{ v }`, `{ op, l, r }` o `{ pot, x }`; una **secuencia**, la lista plana con
`{ v }`, `{ g }`, `{ pot, base }` y las operaciones.

| Función | Qué devuelve |
|---|---|
| `M.arboles(e)` | todas las agrupaciones (con el exponente donde se puede escribir) |
| `M.evaluar(arbol)` | `{ valor, pasos }` o `{ invalido: { paso, razon, a, op, b }, pasos }`; **los pasos son secuencias** |
| `M.resultados(e)` | valores distintos **por clave**, ordenados con `comparar` |
| `M.analizar(e)` | `{ todos, evaluados, validos, invalidos, valores, defecto, razones (Set), hayGrande }` |
| `M.sinParentesis(e)`, `M.interpretar(e, p)` | como la U1 (`p = { abre: [..], cierra: [..] }`) |
| `M.colocacion(arbol, n)`, `M.alcanzable(arbol, n)` | como la U1 |
| `M.arbolQueDa(e, valor)` | el de menos paréntesis que da ese valor (por clave), o `null` |
| `M.pistaPara(e, actual, faltan)` | **`faltan` es un Set de CLAVES** (`M.clave(v)`), no de valores |
| `M.htmlSecuencia(sec, idioma, { compacta })`, `M.htmlArbol(arbol, idioma)`, `M.htmlPasos(pasos, idioma)` | HTML con la escritura de la aritmética; `htmlPasos` da los `<div class="paso">` de la U1 |
| `M.cadenaPasos(pasos, idioma)` | `a = b = c` en una línea (para el «No lo sé») |
| `M.htmlOperacion(a, op, b, idioma)` | «−7 : 2», «5 · (−2)», «(−3)²» (para los mensajes de «no se puede») |
| `M.htmlColocacion(e, p, idioma)`, `M.textoColocacion(e, p)` | lo que ha puesto el alumno, en HTML o en texto plano ASCII |
| `M.htmlValor(v, idioma, { detras, base, compacta })` | un número suelto (el objetivo de la diana, un chip) |
| `M.clave(v)`, `M.mismoValor(a, b)`, `M.claveSecuencia(sec)`, `M.claveArbol(arbol)` | claves de texto plano |
| `M.claveExpresion(e)` | números (por valor), operaciones y exponente: para no repetir y para las **huellas** (`huella(M.claveExpresion(e))`) |
| `M.expresionDe(item)`, `M.itemDe(tipo, e, extra)` | ítem `{ tipo, numeros, operaciones, exponente, resultados, sinParentesis, objetivo: null, ...extra }` |
| `M.buscar(rng, hacer, vale, reserva, { anterior, intentos = 20000 })` | como la U1 (defecto calculable, todos los árboles alcanzables, `vale(an, e)`) **y** distinta de `anterior` (ítem o expresión); cuenta en `M.estadisticas = { llamadas, caidas }` |

**Escritura** (la decide la aritmética, no el motor): un número justo detrás de una operación va con `detras` (un negativo,
entre paréntesis: `5 · (−2)`, `4 − (−3)`, `1/2 · (−1/3)`); el primero de la línea o de un grupo, sin paréntesis de más
(`(−3 + 2) · 4`); la base de una potencia va con `base` (negativa o fracción, entre paréntesis), así que cuando el grupo se
queda en un número sigue escrito `(−2)²` y nunca `−2²`.

### Las aritméticas, con un ejemplo cada una

| Aritmética | Razones de «no se puede» | Ejemplo |
|---|---|---|
| `ARITMETICA_NATURALES` | `negativo`, `inexacta`, `cero`, `grande` (> 10 000) | `12 : 6 : 2 = 1`; `6 − (1 − 8)` → `negativo` |
| `aritmeticaEnteros({ tope = 200 })` | `inexacta` (el cociente no es entero), `cero`, `grande` (\|v\| > tope) | `6 − (1 − 8) = 6 − (−7) = 13`; `(−3 + 1)² = (−2)² = 4`; `7 : 2` → `inexacta` |
| `aritmeticaFracciones({ topeNum = 60, topeDen = 36 })` | `cero`, `grande` (el irreducible pasa de los topes) | `1/2 + 1/4 = 3/4` (irreducible; 3/4 y 6/8, un chip); un entero se escribe como entero |
| `aritmeticaDecimales({ cifras = 3, tope = 500, negativos = false })` | `inexacta` (no termina o pasa de `cifras` cifras, también en una potencia), `cero`, `negativo`, `grande` | `0,5 · 3 = 1,5` (0,5 y 0,50, un chip); `1 : 3` → `inexacta`; `0,25³` → `inexacta`; coma en español, punto en inglés |

Cada aritmética es `{ nombre, operar(a, op, b) → { valor } | { razon }, potencia(base, e), clave(v), comparar(a, b), html(v, { idioma, detras, base, compacta }), texto?(v) }`.
Para una aritmética nueva basta con eso.

## API real de la pantalla (`_comun/parentesis-pantalla.js`)

```js
import { crearPantalla } from '../_comun/parentesis-pantalla.js';
const P = crearPantalla(M, PROPIOS);   // PROPIOS: textos { es, en } que mandan sobre los de parentesis-textos.js
```

- `P.montarTodos`, `P.enunciadoTodos`: «encuentra todos» (en la definición del ejercicio, `objetivo: 5, penalizacion: 0`).
- `P.montarDiana`, `P.enunciadoDiana`: la diana (`item.objetivo`, un valor de la aritmética; nunca el de sin paréntesis). El fallo
  pasa `respuesta: M.textoColocacion(…)` a `api.responder`.
- `P.explicaTodos(item, ctx, { consejo, extra })`, `P.explicaImposibles(item, ctx, { consejo })` (añade una agrupación que no se
  puede, con su motivo), `P.explicaDiana(item, ctx, { consejo })` (`consejo` puede ser `{ es: n => …, en: n => … }` con el objetivo).
- `P.agrupacionImposible(e)`, `P.resumenHtml(item, textos, formas)`, `P.crearEditor(...)`, `P.TX` (los textos mezclados).
- `PROPIOS.imposible[razon]` y `PROPIOS.motivo[razon]` cambian, razón a razón, la frase de «no se puede» del mensaje y la del
  «No lo sé» (los enteros lo usan: «−7 : 2 no da un número entero»). Cualquier otra clave de `parentesis-textos.js` se puede
  cambiar igual (`consejo_todos`, `no_agrupan`…).
- Los chips llevan `data-k` (su posición en `item.resultados`), nunca el valor. El mismo comportamiento que la U1: 400 ms por
  línea, hasta dos paréntesis por hueco, pista, borrar, el de sin paréntesis encendido, «no agrupan / ya lo tenías / ya con otros».
- Sin CSS en `_comun`: cada práctica trae su `estilos.css` (copiado de la U1; el de fracciones, con los paréntesis puestos más
  grandes para que abarquen la raya).

El esqueleto de cada práctica es el ejemplo de uso completo: `logica.js` (aritmética, `M`, generadores con `buscar`),
`textos.js` (introducciones, `PROPIOS`, `P`, `EXPLICACIONES`) y `practica.js` (la definición de los tres ejercicios).

## Los esqueletos

Cumplen ya las cotas de las fichas 200-202 por `buscar` (sin casos del papel fuera, que es de las 200-202). Barrido de 4000
(enteros) o 3000 (fracciones, decimales) ítems por ejercicio, con `anterior`:

| Práctica | Ej. | Resultados | Caídas en la reserva | Ítem más repetido | Otros |
|---|---|---|---|---|---|
| enteros | 1 | 2 siempre | 0 | 0,13 % | sin inválidos |
| enteros | 2 | 3: 42 %, 4: 49 %, 5: 10 % | 0 | 0,25 % | **82 %** con base negativa al agrupar (pide ≥ 40 %; el generador pide una la mitad de las veces) |
| enteros | 3 | 3: 76 %, 4: 24 % (nunca 5-6) | 0 | 0,07 % | siempre algún inválido, nunca `grande` |
| fracciones | 1 | 2 siempre | 0 | 0,10 % | primero negativo 30 % |
| fracciones | 2 | 3: 38 %, 4: 21 %, 5: 41 % | 0 | 0,07 % | sin inválidos |
| fracciones | 3 (diana) | 3-5 | 0 | 0,07 % | objetivo ≠ sin paréntesis |
| decimales | 1 | 2 siempre | 0 | 0,07 % | siempre algún decimal |
| decimales | 2 | 3: 80 %, 4: 14 %, 5: 7 % | 0 | 0,07 % | sin inválidos |
| decimales | 3 (diana) | 3: 64 %, 4: 32 %, 5: 4 % | 0 | 0,03 % | objetivo ≠ sin paréntesis |

Lo que falta en cada uno (es de las 200-202): casos del papel por huella, divisores de la U5 (`DIVISORES_COMBINADA`), los tests
propios y de ayuda, las introducciones definitivas y el repaso de realismo/variedad de 20 000.

## Lo que mide el test (`tests/practicas-parentesis-motor.test.js`, 13 tests, unos 3 s)

1. **Equivalencia con la U1**: 3000 ítems de cada ejercicio de `parentesis/logica.js` (`generar(1..4)`): mismos árboles (por
   clave), mismos resultados, misma validez, razón y paso del fallo, **los mismos pasos** (`claveSecuencia` = el texto de la U1),
   misma colocación y alcanzabilidad, mismo `arbolQueDa` para cada resultado, la misma pista desde vacío, desde la primera pista y
   desde una colocación al azar, el mismo `interpretar` / «no agrupan» y la misma escritura sin paréntesis.
2. **Casos fijos** de la ficha: `12 : 6 : 2 = 1`; `6 − (1 − 8) = 13` (y su escritura `6 − (−7)`); `(−3 + 1)²` escrito `(−2)²`;
   `−4 · 2 + 3 · 2² = 4` y `(−4 · 2 + 3) · 2² = −20`; `1/2 + 1/4` y `3/4` el mismo chip; `0,5 · 3` y `1,50`; `7 : 2` y `−7 : 2`
   `inexacta` en enteros; `1 : 3`, `0,1 : 3`, `1 : 16` y `0,25³` `inexacta` en decimales (`1 : 8 = 0,125` sí); `2 − 5` `negativo` en
   decimales; ninguna división entre 0 en ninguna aritmética; raya en las fracciones (nunca barra), coma y punto, U+2212.
3. **Alcanzables**: con cada aritmética, 200 expresiones al azar (tres y cuatro números, con y sin exponente, con agrupaciones
   imposibles): las 9ⁿ colocaciones del editor dan exactamente los valores de `resultados`, y un chip por valor.
4. `buscar` con `anterior` (300 seguidas, ninguna igual a la anterior), el recuento de caídas, `claveExpresion` por valor y la
   huella; los ítems sobreviven a `JSON` (la base los compara y los registra así).

## Navegador

Chrome headless por CDP, `?probar=1&ejercicio=k&idioma=es|en`, a 375 y 1200 px: los tres ejercicios de cada esqueleto y los
ej. 1, 3 y 4 de la U1. En cada uno: un «(» sin cerrar (sale «Falta algún paréntesis…» / en la diana «Los paréntesis no están
completos…»), borrar, **pistas hasta encender todos** (en todos los «encuentra todos», todos los chips encendidos y el resumen
final), la diana sin paréntesis (fallo: «Eso da …, no …», una agrupación que da el objetivo con su resolución) y el «No lo sé» en
el ítem siguiente. **48 páginas** (12 ejercicios × 2 anchos × 2 idiomas): consola limpia en todas, todos los chips encendidos en
los 36 «encuentra todos», las 8 dianas con su diagnóstico y el «No lo sé» en las 48. La U1 se comporta igual que antes.
La diana se probó con fallo; el acierto (una rama de una línea, la misma de la U1) queda para la revisión con clics de la 203/204.
Las capturas se miraron a mano (fracciones con raya en el editor, la resolución, los chips y el resumen; enteros con `6 : (−2)`).

**Medidas a 375 px** (la `.expr` tiene 324 px de ancho; nada se sale de la pantalla en ningún caso). Ancho natural de la expresión
sin partir, en 6 ítems de cada uno:

| Ejercicio | Ancho natural | Renglones |
|---|---|---|
| U1 `parentesis` 3 (cuatro números, la referencia) | 390-422 px | **2** (ya era así) |
| `coloca-enteros` 3 (cuatro enteros, el primero negativo) | 380-438 px | 2 |
| `coloca-decimales` 3 (cuatro números) | 413-458 px | 2 |
| `coloca-fracciones` 1 (tres fracciones) | 324-361 px | 1 o 2 |
| `coloca-fracciones` 2 y 3 (cuatro fracciones) | 410-465 px | 2 (122 px de alto) |

**Para las 200-202**: con cuatro números no cabe nada en un renglón a 375 px, tampoco la U1 publicada. Se parte entre una celda y
un signo (el signo se queda al final del primer renglón), se lee bien y no se sale. Para que quepa haría falta ganar unos 90-140 px:
los ocho huecos de 32 px se llevan 256. Una opción, en el `estilos.css` de cada práctica: huecos de 24 px por debajo de 400 px de
ancho (son 64 px menos) y la letra de `.expr` a 1.25rem. La ficha 200 pide que la de enteros quepa en un renglón: la 200 lo decide
con su medida.

## Propuestas

1. **Pasar la U1 al motor** (`parentesis/logica.js` → `crearMotor(ARITMETICA_NATURALES)`; `practica.js` → `crearPantalla`). El test de
   equivalencia ya demuestra que da lo mismo en 12 000 ítems; quedaría la escritura (la U1 usa `formatear` sobre texto). No es de
   esta tarea: la U1 está publicada y gusta como está.
2. `api.responder` de la diana manda ya `respuesta` (la colocación del alumno en texto) para el registro de fallos; la U1 no lo
   hace. Si se quiere en la U1, es una línea.
