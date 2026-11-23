# Entrega de la tarea 242 · errores4, el fallo de cuenta en las columnas

Commit: 7f5124f. Ficheros: practicas/errores4/{logica,textos}.js, tests/practicas-errores4.test.js, tests/practicas-ayuda-errores4.test.js.

- Ejercicio 2 (columnas): con una sola columna mala con nombre y una ruta buena que no sale en el ítem, en la mitad de los casos se añade una columna con un fallo de cuenta (una sola columna bien, 3 columnas). Es la última cuenta de esa ruta con el numerador ±1 o ±2 (mismo denominador; el entero, si el resultado lo es).
- Nunca coincide con el resultado de otra columna, con el opuesto del bueno ni con lo que daría un error con nombre del catálogo (a los operandos de la última cuenta y a los del ítem, con `erroresQueExplican`).
- Sin pregunta tipo test ni regla en negrita. Explicación: «Se ha equivocado al hacer la cuenta.», «12/10 = 9/10, no 8/10.» y «Lo correcto es: = 9/10». El registro anota `fallo-de-cuenta`.
- Sale en 6 de las 7 familias (suma, resta, cantidad, unitaria, división, potencia; simplificar no tiene ninguna cuenta con operación) y en el 16,7 % de los ítems (semilla 5, 3000 ítems); el test exige más del 8 %.
- Prueba en 1 minuto: `node --test tests/practicas-errores4.test.js tests/practicas-ayuda-errores4.test.js` (29/29).
- **No probada en el navegador**: el clasificador de permisos denegó arrancar el servidor local (`python3 -m http.server 8080`). Queda pendiente la prueba en Chrome a 375 y 1200 px, es y en.
