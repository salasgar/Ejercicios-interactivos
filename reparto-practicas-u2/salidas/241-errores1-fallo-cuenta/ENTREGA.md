# Entrega 241 · errores1: el fallo de cuenta en las columnas

Commit da80cbb. Ficheros: practicas/errores1/{logica,textos}.js, tests/practicas-errores1.test.js, tests/practicas-ayuda-errores1.test.js.

- Ejercicio 2 (columnas): con una sola columna mala con nombre y una ruta buena que no sale en el ítem, a veces (40 % de esos ítems; ~11 % de todos) una columna más con la última cuenta mal (±1, ±2, ±10 del bueno). Sale en las siete familias. Se baja del 80 % del modelo al 40 % para que los ítems de 2 columnas sigan por encima del 8 % que exige el test existente.
- Nunca vale lo de otra columna, lo de ningún error con nombre de la familia, ni otra operación sobre la última cuenta (a+b, a−b, b−a, a·b) ni b·e en una potencia.
- Sin pregunta tipo test; explicación «Se ha equivocado al hacer la cuenta.», «cuenta = bien, no mal.» y «Lo correcto es: = bien». Al fallar se registra error «fallo-de-cuenta».
- Probar: npm run servir → /practicas/errores1/?probar=1&ejercicio=2&idioma=es (sale en ~1 de cada 9 ítems).
- Sin probar en navegador: el clasificador de permisos denegó lanzar Chrome headless.
