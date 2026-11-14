# Entrega · Tarea 161 · Generadores de álgebra al día con la unidad 6

Sesión `s-20261114T113420-fca06614` · commit `6efce4b`

## Ficheros
- `src/ejercicios/expresiones_algebraicas.js` y `src/ejercicios/ecuaciones_primer_grado.js` (reescritos): cada uno exporta `SUBTIPOS`, `errores`, `preguntas` y `notas`, y declara `items` y `subtipos`, como `enteros.js` y los de fracciones y decimales (112, 133).
- `tests/algebra-items.test.js` (nuevo): 26 tests; 3000 ítems por subtipo con un evaluador de expresiones lineales y racionales exactos, aparte del generador.

## Lo que había antes
Tres formas de valor numérico, una de reducir, una de traducir y cuatro de ecuaciones, sin `items`; la clave de las ecuaciones era `redondear(v)` en coma flotante (con dos decimales en `x en los dos miembros`) y los distractores, en parte, no eran errores del inventario.

## Aritmética exacta
Racionales `{n, d}` de enteros pequeños (`Q`, `qSuma`… exportados de `expresiones_algebraicas.js`); términos `tX`, `tN`, `tP` (paréntesis) y `texTerminos`. La clave de cada opción es su valor reducido (`n/d`) o su forma canónica `a|b`; ya no hay `redondear` ni `Number` con coma. La solución sale como fracción irreducible o entero (`-\frac{5}{2}`), nunca un decimal ni un periódico; la ecuación se genera eligiendo antes la solución y `ejercicio()` lanza un error si el método no da esa solución.

## Subtipos y destrezas
| Generador | Subtipo | Ejemplo | items |
|---|---|---|---|
| expresiones | valor_natural | `1 + 2x`, x = 9 | U6-1C-05 |
| | valor_negativo | `5 - 2x`, x = -3 | U6-1C-06 |
| | valor_cuadrado | `2x²` con x = 6; `x² - 4`; x² con x = -4 | U6-1C-09 |
| | reducir_x | `x - 7x`, `3x + x - 5x` | U6-1C-13 |
| | reducir_mezcla | `x + 9 - x + 7` | U6-1C-14 |
| | parentesis_numero | `-4(x + 2)`, `2(4 + 3x)` | U6-3C-06 |
| | parentesis_menos | `7 - (-x + 9)`, `-(x - 2)` | U6-3C-07 |
| | traducir_una | el doble, la mitad, n más que, n menos que | U6-1A-01 |
| | traducir_dos | el doble / triple / la mitad, más o menos b | U6-1A-02 |
| ecuaciones | suma_resta | `x + 9 = 4`, `5 + x = 3` | U6-2C-07 |
| | producto_cociente | `3x = 12`, `-2x = 8`, `x/2 = 5` | U6-2C-08 |
| | dos_pasos | `2x + 5 = 17`, `17 = 2x + 5`, `x/3 + 2 = 6` | U6-2C-09 |
| | x_negativa | `9 - x = 15`, `-x + 4 = 1` | U6-2C-10 |
| | solucion_fraccion | `12x = 3` → `1/4`; `-4x = 6` → `-3/2` | U6-2C-11 |
| | dos_miembros | `5x - 3 = x + 13` (solución entera positiva) | U6-3C-01 |
| | dos_miembros_dificil | `3x - 4 = 15x - 6` (negativa o fraccionaria) | U6-3C-02 |
| | con_parentesis | `3(x - 2) = 12`, `4 - (x + 1) = 8` | U6-3C-09 |
| | un_denominador | `x/4 = 3`, `2x/3 = 4`, `x/4 - 1 = 2` | U6-3C-11 |
| | varios_denominadores | `x/2 + x/3 = 5`, `3x/4 + x/6 = 22` | U6-3C-12 |

## Distractores
Cada distractor sale de un error con nombre, calculado con los números del ítem y con sus pasos (nunca genéricos; el test lo exige en 300 × 19 ítems). El pool se baraja y se toman tres: primero los de la columna `nota` del inventario (yuxtaponer, jerarquía, perder el signo, transponer sin signo, pasar un factor restando, multiplicar en vez de dividir, invertir, distribuir solo el primero, signo solo del primero, m.c.m. solo a los términos con denominador, olvidar el numerador…), después, si faltan, los de relleno.
- **Ninguna opción equivale a otra**: expresiones por forma canónica, números por valor (`1/4` = `3/12`); comprobado en el test con un evaluador independiente. Sin excepciones.
- Nada de `x²` al reducir ni en ecuaciones (el test lo comprueba: `^` solo en `valor_cuadrado` y en una opción de «el doble de un número», el error `x²` de la nota de U6-1A-01).
- Sin `×`, sin porcentajes, sin letras que no sean x, sin decimales, producto con `\cdot` solo entre números.
- Aritmética de la solución comprobada en el test: la correcta, irreducible, y el enunciado se resuelve aparte.

## Realismo y casos fijos
Sin contextos, así que no hay cotas de realismo (ninguna frase habla de edades, dinero ni objetos). Casos fijos: ninguno (todo es aleatorio), así que no hay nada que cotejar con las hojas ni con los exámenes de la U6; la tarea de publicación de cada semana comprobará coincidencias si le interesa.

## Qué queda fuera (sin forma)
- Contextos y problemas (nada aquí lleva texto con personajes): U6-1A-03 a 1A-06, 2A-01 a 2A-04, 3A, 4A. Valdría un generador `problemas_ecuaciones` con las cotas del acta, como el que propuso la 112 para las fracciones.
- Conceptuales o de nombrar: U6-1C-01 a 1C-04 (letra, términos, coeficiente), 1C-12 (reconocer semejantes), 1C-15 a 1C-17, 2C-01 a 2C-06 (ecuación y solución, identidad, balanza, transposición con números), 2C-12 (reducir antes de resolver), 3C-03 a 3C-05 (solución 0, ninguna o infinitas, hallar el error), 3C-08, 3C-10 (paréntesis en los dos miembros), 3C-13 a 3C-16, y los B (lectura en inglés).
- Valor numérico con fracción, decimal o dos letras (U6-1C-07, 1C-08), y sucesiones (1C-10, 1C-11).
- «El siguiente» y «el anterior» de U6-1A-01: se dejaron porque no salían tres distractores con nombre decentes (todos eran relleno).

## Propuestas (decide Juan Luis)
1. **Distractores que no están en la columna `nota`**, necesarios para tener tres con nombre: `ignora_coeficiente`, `suma_en_vez_de_multiplicar` (valor natural; la nota de 1C-06 sí la trae), `exponente_ignorado`, `olvida_termino` (`x = b`), `divide_solo_la_x`, `olvida_multiplicar_al_final`, `multiplica_un_solo_miembro`, `multiplica_solo_el_ultimo` (en 3C-06 y 3C-07), `resta_al_reves`, `escala_al_numero_fijo` y `mete_b_en_parentesis` (de las traducciones, ya existentes). Si no los quiere, esos subtipos se quedarían con dos distractores y el tercero genérico.
2. **La notación inglesa de la app convierte `\cdot` en `\times`** (`aplicarNotacion`, `src/i18n/index.js`), y choca con la regla del curso (`·` siempre); ya lo propuso la 133. Fuera de esta tarea.
3. Los `items` no distinguen «reto» (U6-3C-14, 3C-16) ni los decimales de U6-3C-15 (no incluidos).
4. La frase de «el doble de un número» incluye la opción `x²` (error de la nota de U6-1A-01); si Juan Luis prefiere ninguna `x²` fuera del valor numérico, se quita `doble_como_cuadrado` y el doble se queda con dos distractores documentados y uno de relleno.

## Cómo probarlo en 1 minuto
```bash
node --test tests/algebra-items.test.js                            # 26 tests
node --test tests/ejercicios.test.js tests/distractores.test.js    # 123 tests
npm test                                                           # 2231/2231 el 14-11 a las 11:4x UTC
```
