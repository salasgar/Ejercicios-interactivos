# Entrega — Tarea 05: Criba de Eratóstenes y flashcards

Commit: `cf1cfa5`

## Ficheros

- `practicas/criba/{index.html,practica.js,logica.js,textos.js,estilos.css}`
- `tests/practicas-criba.test.js`

## Qué tiene

Tres ejercicios:

1. **La criba, paso a paso** (secuencial, `inicial: 5, penalizacion: 1`). Tabla 1-100
   tocable (tocar celda a celda o arrastrar); cada paso tacha los múltiplos que quedan
   de 2, 3, 5 y 7 (el paso lo decide `sesion.aciertos`: un fallo repite el mismo paso).
   Paso final: por qué no hace falta tachar los múltiplos del 11, con la criba completa
   (25 primos) al terminar.
2. **¿Primo, compuesto o ninguno?** Flashcards 1-150 con los compuestos «tramposos»
   (51, 57, 87, 91, 119, 133, 143, 121, 169, 111, 117, 123, 129, 141, 147) al 30 %, el 1
   y el 2 al 5 % cada uno.
3. **¿Hasta qué primo hay que probar?** n entre 50 y 200; la lista correcta son los
   primos p con p · p ≤ n; cuatro opciones (la correcta, una de más, una de menos y
   «todos los primos hasta n : 2»). Un 30 % de los n son compuestos: si la lista es
   correcta, se pregunta además si el número es primo (Sí/No).

Destrezas: U2-2C-01 a U2-2C-07, U2-2B-01.

## Cómo probarlo

`npm run servir` y abrir `http://localhost:8080/practicas/criba/?c=<código>` (por
ejemplo el de `codigoAlumno(0)` de `practicas/_comun/codigos.js`). Probado en 375 px y
1024 px, en español y en inglés (el idioma alterna por ítem desde la tarea 35; hereda
el cambio sin tocar nada), con los tres ejercicios en acierto y en fallo.

## Tests

9 tests propios en `tests/practicas-criba.test.js` (fuerza bruta independiente, no
contra las funciones de `logica.js`): el paso del 7 tacha exactamente {49, 77, 91}, la
clasificación del ejercicio 2 coincide con el número de divisores en 1..500, los
tramposos aparecen ≥ 25 % en 3000 ítems, y la lista correcta del ejercicio 3 es
exactamente `PRIMOS.filter(p => p·p ≤ n)` con las cuatro opciones distintas.

## Propuestas pendientes

- Pedir a la tarea 18 que ponga `disponible: true` para `criba` en el catálogo.
- Nada más: no se ha tocado el contrato de la base.

## Incidencia observada (no es de esta tarea)

Al cerrar, `tests/practicas-comun.test.js` tiene un fallo («base: parámetros del
contador…») porque la tarea 35 cambió los valores por defecto de `contador.js`
(`inicial: 20→?`, `penalizacion: 5→2`, `maximo: 40→20`) mientras esta tarea estaba en
curso; su reclamo (`s-20261007T205921-9d74da56`) seguía vivo al terminar. No se ha
tocado ningún fichero de la 35.
