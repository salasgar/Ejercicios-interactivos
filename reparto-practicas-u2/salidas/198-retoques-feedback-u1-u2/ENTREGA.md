# Entrega de la tarea 198 · Retoques de feedback en ocho prácticas (U1 y U2)

Sesión s-20261114T231306-acc90cc9 · código en el commit a651262 (21 ficheros, solo textos y tests).

## Lo hecho

1. `rectangulos`: el «<» de «≤ n < …» va como `&lt;` en los cuatro textos que lo llevaban (parar.correcto, parar.incorrecto, la explicación de «No lo sé» y la introducción), en los dos idiomas.
2. `arbol`: «todas las puntas sean números primos» / «Ya todas las puntas son números primos» (ayuda.construir, en español; el inglés ya decía «prime»).
3. `divisiones` ej. 3: separador de miles desde 5 cifras (la RAE no separa los de 4; mismo criterio que `exponente`) con `miles()` nuevo en `divisiones/textos.js` (espacio duro en español, coma en inglés) en el enunciado «sí/no», las opciones numéricas, la explicación del feedback y la tarjeta. El valor interno no cambia.
4. `baldosas`: «baldosas de 8 dm de lado» / «tiles with a side of 8 dm» en la introducción y en la instrucción del ej. 2.
5. `leelo`: (a) «La frase correcta es «…»» / «The correct sentence is “…”», sin dos puntos (compuesto en `practica.js`); (b) `divisor_pair`: «4 and 8 are a ___ pair of 32». Opciones y números intactos: remainder y quotient siguen siendo falsas (un test lo recorre).
6. `jerarquia`: intro1 inglés, «a calculation» y «the calculation gets shorter».
7. `raiz`: «sobra 1» / «sobran n» en `TX.prob.respuesta`, `tu_respuesta` y `TX.comun.sobran` (español); en inglés «1 is left over» / «n are left over» en prob.respuesta y tu_respuesta.
8. `distributiva`: «se les quita una columna» / «se les quitan dos columnas» en `explicacion_producto`.

Tests nuevos (uno por práctica, al final de su `tests/practicas-<slug>.test.js`) y dos ajustados porque esperaban el texto antiguo: `practicas-baldosas` («tiles with a side of 8 dm») y `practicas-ayuda-divisiones` (el valor se compara sin separador de miles).

Pruebas: los 17 ficheros de la ficha en verde; `npm test` 2339/2339. Hash de 300 ítems por generador (semilla 11) antes y después, 35 generadores: **todos iguales** (en `leelo`, con la `frase` quitada del ítem, como pedía la ficha).

NO hecho: el clic a 375 px en los dos idiomas y la comprobación de las páginas publicadas (sesión sin navegador). Pendiente para quien revise.

## Hallazgos fuera de criterio

- En `leelo` `divisor_pair`, x e y pueden salir iguales («3 and 3 are a ___ pair of 9»); se deja como pedía la ficha.
- En `divisiones` los ejercicios 1 y 2 (`lineaComprobacion`, escalera) tampoco separan los miles de los números de cinco cifras o más; no estaban en la ficha y no se han tocado.
- Empujado desde un worktree limpio sobre origin/main (el árbol compartido diverge y tiene ficheros sin versionar ajenos).
