# Entrega · Tarea 133 · Generador `decimales.js` al día con la unidad 5

Sesión `s-20261105T221026-1e864583` · commit `b25849f`

## Ficheros
- `src/ejercicios/decimales.js` (reescrito): exporta `SUBTIPOS`, `errores`, `preguntas` y `notas`, y declara `items` y `subtipos`, como `enteros.js` y los de fracciones (tarea 112).
- `tests/decimales-items.test.js` (nuevo): 24 tests; 3000 ítems por subtipo con un evaluador de fracciones exactas en `BigInt`, aparte del generador.

## Lo que había antes
Siete formas sin `items` (suma, resta, producto de dos décimas, ×/÷ por 10-1000, división entre natural y entre décima), todo con `Number` y `toFixed`, el feedback en inglés con `×`, y ni redondeo, ni fracción ↔ decimal, ni potencias, combinadas o negativos.

## Subtipos y destrezas
| Subtipo | Ejemplo | items | Distractores (errores de la columna `nota`) |
|---|---|---|---|
| fraccion_decimal | `375/100` → `3,75`; `0,09` → `9/100` | U5-1C-04 | contar ceros (9/10, 0,7 por 7/1000), olvidar la parte entera |
| redondear | `3,678` a la décima → `3,7` | U5-1C-10 | truncar, redondeo en cadena (3,649 → 3,65 → 3,7), redondear a otro orden |
| suma | `2,5 + 1,25` | U5-1C-13 | alinear a la derecha, parte decimal como natural, sin llevar* |
| resta | `7,3 - 2,85` | U5-1C-13 | la pequeña de la grande, alinear a la derecha, parte decimal como natural, sin llevar* |
| con_naturales | `5 - 0,37`; `12 + 0,8 + 3,05` | U5-1C-14 | el natural como última cifra decimal, la pequeña de la grande, sin llevar*, alinear a la derecha |
| por_potencia_de_diez | `2,5 · 10` | U5-1C-15 | añadir ceros (2,50), coma al revés, contar posiciones |
| entre_potencia_de_diez | `7 : 1000` | U5-1C-16 | coma al revés, contar posiciones |
| negativos_suma | `2,5 - 4,25`; `-1,2 - 0,35`; `-3,5 + 1,25` | U5-1C-18 | perder el signo, regla de los signos (-0,85), alinear a la derecha |
| producto_por_natural | `1,45 · 3` | U5-2C-01 | coma mal (43,5; 0,435), olvidar la coma, sumar |
| producto | `1,2 · 0,3` | U5-2C-02 | coma mal (3,6; 0,036), olvidar la coma, sumar |
| por_decima | `0,56 : 0,1`; `3,2 · 0,01` | U5-2C-03 | coma al revés, contar posiciones |
| division_entre_natural | `8,4 : 4` | U5-2C-04 | olvidar la coma (21), coma un lugar corrida (0,21; también «perder un cero»: 0,036 : 9 = 0,04), multiplicar |
| division_naturales | `7 : 4 = 1,75` | U5-2C-05 | el resto como decimales (1,3), olvidar la coma (175), coma corrida |
| division_entre_decimal | `8,4 : 0,16 = 840 : 16` | U5-2C-06 | mover solo en el divisor (0,525), de más en el dividendo, multiplicar |
| fraccion_a_decimal | `7/20` → `0,35` | U5-2C-08 | dividir al revés (3/4 = 1,33), numerador coma denominador (3,4), el denominador como decimales (1/4 = 0,4), coma corrida |
| de_memoria | `1/4` → `0,25` | U5-2C-09 | el denominador como decimales, numerador coma denominador, el decimal de otro par |
| decimal_a_fraccion | `0,75` → `3/4`; `1,25` → `5/4` | U5-2C-10 | **a medio simplificar (75/100 o 15/20, la excepción del acta, punto k)**, contar ceros (75/10 → 15/2; 0,05 = 1/2) |
| potencia | `0,3²`, `0,2³` | U5-2C-13 | sin contar los decimales (0,9; 0,08), multiplicar por el exponente (0,6) |
| combinada | `4,5 - 1,2 · 3` | U5-2C-14 | de izquierda a derecha, la coma del producto mal |
| negativos_producto | `-1,2 · 0,3`; `2,5 · (-4)`; `-8,4 : 4` | U5-2C-16 | perder el signo, la coma mal |

\* «sin llevar» no está en la `nota` del inventario: ver propuestas.

## Reglas comprobadas en el test
- **Ninguna opción vale lo mismo que otra**, comprobado por valor con fracciones exactas (0,5 = 0,50 = 1/2), salvo la «a medias» de `decimal_a_fraccion`, que el test exige que valga lo mismo y no sea irreducible, y solo ahí. La clave de cada opción del generador es su valor como fracción reducida.
- **Aritmética exacta**: un decimal es `{ m, k }` = m/10^k; nada de `Number` con coma ni `toFixed`. El redondeo del test se hace con las cifras (2,675 → 2,68, que con `toFixed` daría 2,67).
- Los tres distractores, siempre de un error con nombre y con sus pasos (nunca genéricos); el pool se baraja (regla de oro de `CLAUDE.md`).
- `items` existen en el inventario, ninguno tiene `tipo_test = no`; los dos subtipos con negativos citan destrezas **no nucleares** (U5-1C-18, U5-2C-16) y fuera de ellos no sale nada negativo, ni siquiera un distractor. Sin paréntesis al empezar.
- Sin `×`, sin porcentajes, sin letras; enunciado y correcta con hasta cuatro cifras enteras; la correcta sin ceros finales.
- Redondeo: cifras del 1 al 8, así que nunca arrastra un 9 (U5-1C-11, que el inventario deja para el papel) ni sale «3,0» junto a «3».

## Qué queda fuera (sin forma)
U5-1C-01 (valor de cada cifra), 1C-02 (en décimas, centésimas…), 1C-05 (qué ceros cambian el valor), 1C-06 (recta), **1C-07 y 1C-08 (comparar y ordenar, nucleares)**, 1C-09 (intercalar), 1C-11 (el 9 que arrastra), 1C-17 (comparar negativos), los B (lectura en inglés y vocabulario), todos los A (problemas), 2C-11 (periódicos), 2C-12 (comparar fracciones y decimales), 2C-15 (combinadas con paréntesis), 2C-17 y 2C-18 (nombrar el error). 1C-12 y 2C-07 son `tipo_test = no`. Comparar y ordenar piden otra pregunta («¿cuál es el mayor?») con opciones que no salen de una cuenta; valdrían un generador aparte, como el `comparar_fracciones` que propuso la 112.

## Propuestas (decide Juan Luis)
1. **«Sin llevar»** (olvidar la llevada en la suma o la resta) no está en la `nota` de U5-1C-13 ni de 1C-14: hace falta para tener tres distractores con nombre en la suma. Si no lo quiere, la suma se queda con dos errores del inventario y uno genérico.
2. **La notación inglesa de la app principal convierte `\cdot` en `\times` y deja `\div` como `÷`** (`aplicarNotacion` en `src/i18n/index.js`, fuera de esta tarea). Choca con la regla 3 de la U5 («producto con `·`, nunca `×`; división con `:` también en inglés») y con la del curso desde la U2. Afecta a todos los generadores de la app, no solo a este: sería una tarea aparte.
3. Contextos: ninguno. El acta reserva para la app los de supermercado al peso y gasolina (U5-1A-01, 2A-01, 2A-02), con sus cotas; un generador de problemas sería otra tarea.
4. Casos fijos: ninguno (todo es aleatorio), así que no hay nada que cotejar con las hojas ni con los exámenes de la U5.

## Cómo probarlo en 1 minuto
```bash
node --test tests/decimales-items.test.js                          # 24 tests
node --test tests/ejercicios.test.js tests/distractores.test.js    # 123 tests
npm test                                                           # 1411/1411 el 5-11 a las 22:2x UTC
```
Sin prueba en el navegador: es un generador de la app principal y lo cubren los tests (se miró, además, cómo salen pregunta, enunciado, opciones y feedback con `preguntaDe`, `aplicarNotacion` y `feedbackDe` en los dos idiomas).
