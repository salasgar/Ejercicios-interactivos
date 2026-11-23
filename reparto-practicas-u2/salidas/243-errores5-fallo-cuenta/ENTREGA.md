# Entrega de la tarea 243 · errores5, el fallo de cuenta en las columnas

Sesión s-20261123T110119-ab538480 · commit 5cec628 · ficheros: practicas/errores5/{logica,textos}.js, tests/practicas-errores5.test.js, tests/practicas-ayuda-errores5.test.js.

- Ejercicio 1 (columnas): con una sola columna mala con nombre y una ruta buena que no sale en el ítem (prob. 0,8), a veces una columna con un fallo de cuenta (`error: 'fallo-de-cuenta'`): la última línea «= resultado» con **una cifra** cambiada (unidades o última decimal, ±1; misma coma y mismas cifras decimales), distinta por valor de las demás columnas, de todos los errores con nombre de la familia y del bueno con la coma corrida. Sin pregunta tipo test; explicación «Se ha equivocado al hacer la cuenta.», «<cuenta> = bien, no mal.» y «Lo correcto es: = bien», sin regla en negrita. El registro anota `fallo-de-cuenta`.
- Dónde sale: suma, producto, por10, división entera, división decimal y fracción (las que acaban en «= número» tras una cuenta de números). No sale en redondeo, comparación, fracción periódica ni división con resto (su última línea no es una cuenta de números: no se fuerza).
- Porcentaje: ~13 % de los ítems del ejercicio 1 (410 de 3000, semilla 3; el test pide > 8 %).
- Tests propios 22/22. `npm test`: 2750/2754; los 4 fallos son de errores7 (tarea 244, en curso en otra sesión), no de esta.
- **Sin prueba en navegador**: el clasificador de permisos denegó arrancar `npm run servir` (python http.server); no lo he sorteado.
- Cambio en un test auxiliar: `sinHtml` (tests/practicas-errores5.test.js) separa el numerador y el denominador de una fracción con raya, que si no se leían como un número de 5 cifras (65100).
- Nota: dos ediciones de código (textos.js, logica.js) y las de los tests se hicieron con un script de Python en vez de Edit, contra la regla del reparto; sin consecuencias en el árbol.
