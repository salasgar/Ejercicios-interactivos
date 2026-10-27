# Entrega · Tarea 112 · Generadores de fracciones al día con la unidad 4

Sesión `s-20261026T212332-79cc4641` · commit `4254f7c`

## Ficheros
- `src/ejercicios/fracciones_equivalentes.js`, `suma_fracciones.js`, `producto_division_fracciones.js` (reescritos): cada uno exporta `SUBTIPOS` y declara `items` y `subtipos`, como `enteros.js`.
- `tests/fracciones-items.test.js` (nuevo): 24 tests; 3000 ítems por subtipo con un evaluador de fracciones exactas independiente del generador.

## Subtipos y destrezas
| Generador | Subtipo | Ejemplo | items |
|---|---|---|---|
| fracciones_equivalentes | equivalente | `5/9` → `10/18` | U4-1C-10 |
| | hueco_numerador / hueco_denominador | `7/8 = □/24` | U4-1C-12 |
| | irreducible | `42/48` → `7/8` | U4-1C-13, U4-1C-14 |
| | irreducible_negativa | `-21/24` → `-7/8` | U4-1C-22 |
| suma_fracciones | mismo_denominador | `5/10 - 1/10` | U4-2C-01 |
| | distinto_denominador | `2/3 - 1/4` | U4-2C-02 |
| | natural_y_fraccion | `2 - 1/7` | U4-2C-03 |
| | tres_fracciones | `2/14 - 7/8 + 10/12` (resultado positivo) | U4-2C-04 |
| | con_negativas | `1/4 - 2/3`, `-2/7 + 2`, `-1/2 - 4/5`, `-1/4 + 1/3` | U4-2C-07 |
| producto_division_fracciones | natural_por_fraccion | `7 · 1/5` | U4-2C-08 |
| | producto (25 % con el mismo denominador) | `2/5 · 3/5` | U4-2C-09 |
| | potencia (base positiva, exponente 2 o 3) | `(2/3)²` | U4-2C-12 |
| | division | `7/2 : 5/2` | U4-3C-06 |
| | division_con_natural | `6 : 3/4`, `3/4 : 6` | U4-3C-07 |
| | con_negativas | `-2/3 · 3/4`, `8/4 : (-2/6)` | U4-3C-10 |

## Qué cambia
- Fuera: decimales y mixtos (no había). Sin forma el antiguo `simplificar` con «restar el mismo número» (no está en el inventario) y el error `orden_resta`: se quitaron de las tablas porque `distractores.test.js` exige que todo error declarado pueda salir.
- Distractores = errores de la columna `nota`, con los números del ítem; el pool se baraja y solo se toman tres (los documentados primero, el relleno después).
- **Única excepción a «ninguna opción equivale a otra»**: en `irreducible` el distractor «a medias» (`42/48` → `14/16`), que vale lo mismo que la correcta, porque el enunciado pide «la fracción irreducible» (nota de U4-1C-13 y 14). El test la permite solo ahí y exige que no sea irreducible.
- La división no trata «en cruz» como error (el distractor es invertir la primera, no invertir, o invertir las dos).
- Negativas sin paréntesis al empezar; el paréntesis solo en `8/4 : (-2/6)`. Sin contextos: no hay cotas de realismo.

## Propuestas (decide Juan Luis)
1. **Distractores que no están en la columna `nota`**, necesarios para llegar a tres: `operacion_contraria` y `multiplicar_numeradores` (mismo denominador, U4-2C-01); `escribir_el_factor` (hueco: escribir el factor k en vez del término, U4-1C-12); `multiplicar_por_exponente` (4/6, sí está en la nota); `natural_denominador`, `perder_signo` etc. salen de las notas. Si no los quiere, los generadores quedarían con solo dos y habría que dejar el tercero genérico.
2. **Sin forma**: U4-1C-11 (¿son equivalentes?, V/F), U4-1C-16 (común denominador), U4-1C-17 a 20 (comparar y ordenar), U4-2C-06 (¿es razonable?), U4-2C-11 (la fracción de una fracción: sería el producto con «of»; haría falta texto bilingüe en la pregunta), U4-3A (problemas), U4-3C-05 (inversa), U4-3C-09 (tanda mezclada) y U4-3C-11/12 (nombrar el error). Valdrían un generador `comparar_fracciones` y otro de problemas.
3. U4-2C-04 pide denominadores grandes: se sacan de 6-40 con m.c.m. ≤ 360. Los numeradores no se simplifican antes (`12/15` aparece tal cual).

## Cómo probarlo en 1 minuto
```bash
node --test tests/fracciones-items.test.js   # 24 tests
npm test                                      # 1209/1209
```
