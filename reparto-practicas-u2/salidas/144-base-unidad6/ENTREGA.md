# Entrega de la tarea 144 · Base de la unidad 6

Sesión `s-20261108T104950-2488e1d7`, 2026-11-08 (lanzador automático, sin nadie mirando). Commit del código:
**`9a3dac2`** (32 ficheros). Para las sesiones de las tareas 145-155: léelo entero antes de escribir nada.

**Los ids de destreza son los de la PROPUESTA** de la tarea 01 del reparto de la U6 (`inventario-unidad6.tsv` del 6-11, primera
línea «PROPUESTA, SIN FIRMAR»): la 02 (con Juan Luis, firma F0) no se ha hecho. Si F0 cambia ids o quita filas, la tarea de
publicación de la semana (156-159) pone al día a la vez el §7 de `docs/practicas-unidad6.md` y `DESTREZAS` de `registro.js` (un test
exige que coincidan). Lo que depende de F0 lleva «(pendiente de F0)» abajo.

## Ficheros entregados

- `practicas/_comun/algebra.js` (nuevo, puro, sin DOM): la expresión lineal, los términos, la ecuación, lo que teclea el alumno,
  la escritura, las lecturas, los errores típicos, `FRASES` y la huella. La API completa está en su cabecera; resumen abajo.
- `practicas/_comun/catalogo.js`: filas 69-79, `unidad: 6`, **`disponible: false`**; la U6 en `UNIDADES` desde el **2027-02-01**.
- `practicas/<slug>/index.html` y `practica.js` de los once slugs: **esqueletos** (cargan con «Probar sin código» y enseñan sus
  ejercicios con los nombres de cada ficha, «en preparación»).
- `practicas/portada.js`: cinco bloques de la unidad 6 (los de la ficha) y una `DESCRIPCION` por práctica.
- `practicas/_comun/registro.js`: `DESTREZAS` de la unidad 6.
- `docs/practicas-unidad6.md` (nuevo): la entrada, §7 entero (78 filas) con «Lo que este reparto añade a las fichas» y «Destrezas de
  la unidad 6 sin práctica»; los demás apartados, «Por escribir (tareas 156-159)».
- Tests: `tests/practicas-algebra.test.js` (nuevo, 11 tests: 42 casos a mano, 3000 al azar contra BigInt —reducir con dos letras,
  evaluar, expandir, leer lo escrito, resolver, `esSolucion`, cada paso de `pasos()` equivalente y el último `x = solución`—, lo
  que teclea el alumno, escritura, lecturas, errores, distractores y `FRASES`) y los ajustes de `practicas-comun` (lista del
  catálogo, 44 ejercicios en la U6), `practicas-semana` (`UNIDADES`, `unidadActual` el 31-1 y el 1-2, bloques de la U6),
  `practicas-registro` (lee la tabla de la U6) y `practicas-editor` (`tareasPorUnidad`, seis unidades). `practicas-espacio` no
  hizo falta tocarlo (su ejemplo sigue valiendo, como en la 122).

`npm test`: **1674/1674**.

## Traspaso de titularidad

**Desde que esta tarea está LISTA, cada carpeta `practicas/<slug>/` es de su tarea (145-155)**, que la sustituye entera (empezando
por `logica.js` y su test). Cada práctica pone su `disponible: true` solo cuando la publique su tarea de la semana (156-159).

## Lo que tienes que saber de `algebra.js`

| Pieza | Qué hace |
|---|---|
| `lineal(a, b, letra = 'x')`, `new Lineal({ x: 7, y: 2 }, b)`, `aLineal(x)` | Expresión **siempre reducida**, inmutable, coeficientes `Fraccion` irreducibles. `e.a`, `e.b`, `e.letra`, `e.coefs`. `aLineal` acepta un Lineal, un número, un texto (con dos letras) o una lista de términos. |
| `clave()` / `canonica()`, `equals(otra)` | Forma canónica `'x:3\|b:2'`: `2x + 3` = `3 + 2x`, `x/2` = `½x` = `0,5x` = `x : 2`, `x + x` = `2x`. |
| `evaluar(v)` | Exacto (`Fraccion`). Con dos letras, `evaluar({ a: 2, b: −1 })`. |
| `sumar`, `restar`, `porNumero`, `opuesta`, `expandir(k, expr)`, `expandirTerminos(k, expr)` | `expandir(−2, '3 − x')` = `2x − 6`; `expandirTerminos` conserva el orden escrito (`−6 + 2x`) para enseñarlo. |
| **Términos**: `termino(coef, letra \| null)`, `aTerminos`, `sumaDeTerminos`, `terminosATexto`, `terminosAHtml` | Una suma **sin reducir**, en el orden en que se escribe (`5x + 2x − 3x`). Los coeficientes se guardan tal como se escribieron (`6/4` sigue siendo `6/4`: la práctica puede pedir la irreducible con `t.coef.esIrreducible()`). |
| `reducir(términos \| texto)` | `{ resultado, grupos: [{ letra, terminos, total }], agrupados }`: la línea intermedia del feedback y cada grupo de semejantes con su total. |
| `aTexto(idioma, { constanteDelante })`, `aHtml()` | `3x + 2`, `−x`, `x/2 − 3`, `3x/4`; sin `1x`, sin `+ −`, con el menos U+2212; `5 + 2g` con `constanteDelante`. En HTML la letra en `<i>` y los coeficientes fraccionarios con `htmlRaya` (la `x` arriba). |
| `enPalabras(idioma)`, `lecturasValidas(idioma)`, `esLecturaValida(texto, idioma)` | *two x plus three*, *x over two*, *minus x plus four*; *dos equis más tres*, *equis partido por dos*. Valen también *twice x*, *double x*, *two times x*, *half of x*, *x divided by two*, *x take away three*, *el doble de equis*, *la mitad de equis*, *equis entre dos*, *i griega*/*ye*, y el otro orden (*three plus two x*). **Ninguna lectura válida puede ser distractor**; el test comprueba que ninguna lectura de una expresión lo es de otra distinta en una muestra de doce. |
| `leerExpresion(texto, { letras, variasLetras })` → `{ ok, valor, terminos }` o `{ ok: false, motivo, mensaje: { es, en } }`; `deTexto(texto)` → Lineal o null | Acepta `2x+3`, `3 + 2x`, `2·x`, `2*x`, `2 x`, `X`, `x·3`, `-x`/`−x`/`–x`, `x/2`, `3x/4`, `x : 2`, `½x`, `0,5x`, `1.5`, `6/4`, `x - -2`. Motivos: `vacio`, `x2`, `potencia` (`x²`, `x^2`), `producto-letras` (`x·x`, `xy`), `dos-letras` (sin `variasLetras`), `letra-no-valida` (con `letras`), `parentesis`, `ambiguo` (`1/2x`, `3/4x`: «escribe 3x/4»), `letra-en-denominador`, `division-entre-0`, `ecuacion` (un `=`), `basura`. Nunca `eval` ni `Number(texto)`. |
| `leerEcuacion(texto)`, `deEcuacion(texto)`, `ecuacion(izq, der)`, `new Ecuacion(izq, der)`, `aEcuacion` | La ecuación **se guarda como términos, tal como se escribe** (`x/2 + x/3 = 5`, `3 + x = 10`). Una sola letra (dos letras lanzan). Motivos extra: `sin-igual`, `dos-iguales`. |
| `q.izq`, `q.der`, `q.forma()` → `{ A, C }`, `q.resolver()` | Miembros reducidos; `A·x = C` con todo pasado; la solución irreducible, o `{ tipo: 'ninguna' }` (0x = 2) o `{ tipo: 'infinitas' }` (0x = 0). |
| `q.esSolucion(v)`, `q.equivalente(otra)` | Sustituyendo en los dos miembros escritos; misma solución (`x + 3 = 10` y `2x + 6 = 20`). |
| `q.pasos()` | `[{ tipo, ecuacion }]` con `'denominadores'` (y `mcm`), `'cambiar-miembros'` (la x a la izquierda: `5 = 2x + 1`), `'transponer'` (las x a la izquierda, los números a la derecha, con el signo cambiado y sin reducir: `3x − 5x = −6 − 2`), `'reducir'`, `'despejar'` (y `divisor`), `'simplificar'` (`x = 12/8 → x = 3/2`) y, si la x se va, `'sin-solucion'` o `'infinitas'`. El último es `x = solución`. Es **un** camino; otros también valen (`NO_ES_ERROR['otro-camino']`). |
| `q.sinDenominadores(m?)`, `q.mcmDenominadores()`, `q.porNumero(k)` | Todos los términos por m (por defecto el m.c.m.): `x/2 + 1 = x/3` → `3x + 6 = 2x`; con 12, `6x + 12 = 4x`. |
| `q.aTexto()`, `q.aHtml()`, `q.enPalabras()`, `q.lecturasValidas()`, `q.clave()` | *two x plus three equals seven* / *is equal to* / *is*; *es igual a* / *igual a*. `clave()`: los dos miembros reducidos, en ese orden. |
| `huella(s)`, `huellaCanonica(x)` | La FNV-1a de `equivalentes/logica.js` (el test lo comprueba) y la de la **forma canónica** de una expresión o una ecuación: `3 + x = 10` y `x + 3 = 10` dan la misma; `2x + 6 = 20`, otra. Para excluir los casos de examen sin escribirlos (regla 9): calcúlalas fuera del repo con `huellaCanonica('…')`. |
| `ERRORES_TIPICOS[id]` = `{ fn, devuelve, ejemplo, nombre: { es, en } }` | 27 errores (lista abajo). `devuelve`: `'lineal'`, `'numero'` (Fraccion) o `'ecuacion'` (el **paso** equivocado; su `resolver()` da la solución equivocada). `fn` devuelve **null** cuando da lo mismo que lo bueno o no se aplica. El id vale como `error` de `api.responder`. |
| `distractores([[id, …args], …], correcta)`, `hayEquivalentes(lista)` | Sin los null, sin el equivalente de la correcta y sin dos equivalentes entre sí: expresiones por forma canónica, números por valor y **ecuaciones por su solución** (así `x = 13` y `13` son el mismo valor). |
| `NO_ES_ERROR` | `x · 3` por `3x`, `1x` por `x`, otro orden, la solución sin simplificar cuando no se pide, otro camino, `3 · (x − 2)`. |
| `FRASES` | 15 construcciones: `doble`, `triple`, `mitad`, `tercio`, `mas-que`, `menos-que`, `siguiente`, `anterior`, `doble-mas`, `doble-de-la-suma`, `mitad-menos`, `suma-consecutivos` y tres parejas (`consecutivos`, `pares-consecutivos`, `numero-y-doble`). Cada una: `es(n)`, `en(n)` (el número en letra; n ≥ 2), `glosa` (*twice (el doble)*…), `expresion(n, letra)` (o `pareja(n, letra)`), `errores(n)` (candidatos de `distractores`). Las frases inglesas no son ambiguas (*twice a number, plus five* / *twice the sum of a number and five*). |
| `MENSAJES`, `LETRAS_ES`, `lecturasDeTerminos`, `terminosEnPalabras`, `esLecturaDe` | Los textos de los motivos; el nombre de cada letra en español; las lecturas de una suma de términos. |

Los 27 errores típicos: `suma-no-semejantes` (3x + 2 = 5x), `x-por-x-dos-x`, `yuxtaponer-al-sustituir` (3x con x = 4 → 34),
`signo-al-sustituir` (5 − x con x = −2 → 3), `jerarquia-al-sustituir` (2 + 3x con x = 4 → 20), `por-como-mas` (el doble: x + 2),
`mas-como-por`, `entre-como-por` (la mitad: 2x), `entre-como-menos`, `menos-que-al-reves` (tres menos que: 3 − x),
`siguiente-y-anterior`, `parentesis-olvidado` (2x + 5 por 2(x + 5)), `parentesis-de-mas`, `distribuir-solo-primero` (3(x − 2) =
3x − 2), `signo-solo-primero` (−(x − 2) = −x − 2; −2(3 − x) = −6 − 2x), `multiplicar-solo-la-x`, `sumar-antes-del-parentesis` (4 +
4(5 − 2x) = 8(5 − 2x)), `transponer-sin-signo` (x + 3 = 10 → x = 10 + 3), `pasar-factor-restando` (3x = 12 → x = 12 − 3),
`multiplicar-en-vez-de-dividir`, `invertir-coeficiente` (12x = 3 → x = 4), `signo-al-dividir` (−2x = 8 → x = 4), `cero-x-como-x`
(0x = 2 → x = 2), `mcm-solo-denominadores`, `olvidar-numerador` (3x/4 por 12 → 3x), `signo-de-la-solucion`, `contestar-x`.
`x + x = x²` no tiene función (x² no es lineal): si `terminos-semejantes` lo quiere como distractor de texto, lo escribe aparte.

## Qué práctica cubre qué destreza (ids de la propuesta del 6-11, sin F0)

| Práctica | Destrezas |
|---|---|
| `traduce` (145) | U6-1A-01, 1A-02, 1A-03, 1A-04, **1A-05**, 1B-02, 1C-03, 1C-10 (pendiente de F0, punto c) |
| `valor-numerico` (146) | U6-1C-05, 1C-06, 1C-07, 1C-09 (pendiente de F0, punto d) |
| `terminos-semejantes` (147) | U6-**1C-01**, 1C-04, 1C-12, 1C-13, 1C-14, 1C-15, **1C-16** |
| `es-solucion` (148) | U6-**2C-01**, 2C-02, 2C-03, 2C-04 |
| `transposicion` (149) | U6-2C-06, 2C-07, 2C-08, 2C-09, 2C-10, 2C-11 |
| `resuelve` (150) | U6-2C-12, 3C-01, 3C-02, **3C-03**, 3C-05 |
| `parentesis-algebra` (151) | U6-3C-06, 3C-07, 3C-08, 3C-09, 3C-10 |
| `denominadores` (152) | U6-3C-11, 3C-12, 3C-13 |
| `problemas-ecuaciones` (153) | U6-2A-01, 2A-02, 2A-03, 3A-01, 3A-03, 4A-01, 4A-02, 4A-03, 4A-04, 4A-05, 4A-08, 4A-09, 4C-01 |
| `errores6` (154) | U6-1C-15, 3C-05 |
| `leelo6` (155) | U6-1B-01, 1B-02, 1B-03, 1B-04, 1C-03, 2B-01, 2B-02, 2B-03, 3B-01, **3B-02** (pendiente de F0), 4B-01 |

Las **34 nucleares** de la propuesta tienen práctica. En negrita, las que la ficha no nombraba del todo (en qué ejercicio va cada
una: §7 de `docs/practicas-unidad6.md`, «Lo que este reparto añade a las fichas»). Sin práctica (14, ninguna nuclear): U6-1A-06,
1C-02, 1C-08, 1C-11, 1C-17, 2A-04, 2C-05, 2C-13, 3A-02, 3C-04, 3C-14, 3C-15, 4A-06, 4A-07; el porqué y dónde cabrían, en el mismo §7.

## Lo provisional y lo que tiene que decidir Juan Luis (en la 02 de la U6 o al publicar)

1. **F0 sin firmar.** Todo lo de arriba sale de la propuesta del 6-11. Lo que la propuesta deja a F0 y toca a la app: sucesiones
   (c: U6-1C-10 en `traduce`), `x²` solo en el valor numérico (d: U6-1C-09), los casos `0x = 2` y `0x = 0` (f: U6-3C-04 y U6-3B-02;
   `resolver()` ya los da, y el error `cero-x-como-x`), coeficientes decimales (h: U6-3C-15, sin práctica), numeradores con paréntesis
   (j: fuera de la app), problemas desde la semana 2 (k: U6-2A-02, 2A-03 en `problemas-ecuaciones`, que se publica en la semana 4;
   si la 157 quiere que se practiquen en la semana 2, entran en la tarea de esa semana como «repaso» de una práctica no publicada,
   lo que hoy no se puede: tendría que publicar `problemas-ecuaciones` antes).
2. **U6-3A-02 (frases con paréntesis, sesión 10) y `traduce` (semana 1).** `FRASES` trae `doble-de-la-suma`, pero si `traduce` lo
   usa desde el principio enseña algo de la semana 3 en la semana 1. Propuesta: que la 145 lo deje fuera de los ítems al azar o lo
   marque para la semana 3 (decide la 156 al publicar).
3. **U6-1A-05 (el valor de una tarifa)**: la propongo en `traduce` 4, «Situaciones». Si la 145 no la mete, cabe en `valor-numerico` 1.
4. **Dinero en los problemas** (`traduce` 4, `problemas-ecuaciones`): `decimales.js` de la U5 existe (tarea 122) y sirve para
   escribirlo (`dinero(d, idioma)`: `3,75 €` / `€3.75`, siempre dos decimales, como pide la propuesta, punto o); `algebra.js` no lo
   reescribe. Para resolver con céntimos, pásalos a `Fraccion` (`aFraccion` de `decimales.js`).

## Cómo probarlo en 1 minuto

`node --test tests/practicas-algebra.test.js` (11 en verde). En la consola de cualquier página de `practicas/` servida con
`npm run servir`: `const A = await import('/practicas/_comun/algebra.js'); A.deEcuacion('3x/4 + x/6 = 22').pasos().map(p => p.tipo + ': ' + p.ecuacion.aTexto())`
y `A.leerExpresion('x2')`. http://localhost:8080/practicas/traduce/ → «Probar sin código» → cuatro ejercicios «en preparación»
(igual los otros diez). La portada no enseña nada nuevo hasta el 1-2. Recarga forzada (cmd+shift+R) si el catálogo viejo está en
caché. Probado así en Chrome headless a 375 px (una página de prueba fuera del árbol pinta `x/2 + x/3 = 5` con raya y lee `3 + 2x`
como `2x + 3`, *two x plus three*).

## Cotas de realismo

Esta tarea no genera ítems: las cotas son de cada práctica (regla 7 de la ficha; las de la U5 para el dinero). `FRASES` no lleva
números de contexto, solo `n` (de 2 en adelante).
