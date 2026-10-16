# Entrega tarea 43 — Léelo en inglés: distractores con los mismos números

Sesión: s-20261016T140250-59457f0d · commit d94b7fc
Ficheros: practicas/leelo/logica.js, tests/practicas-leelo.test.js (practica.js y textos.js sin tocar).

## Qué hace
- Ejercicio 2: tres falsas por ítem, en el estilo del ítem: ≥1 de la familia A (inglés incorrecto,
  lista cerrada de la ficha), 1 de B si existe (exponentes intercambiados; GCD↔LCM) y la tercera
  de A, B o C (-teen/-ty, cifras invertidas). Ejercicio 1: B y C primero, mutación antigua solo de relleno.
- `generarPar`: 55 % de las veces un número «especial».
- Las falsas van en `item.falsas` como propiedad NO enumerable (practica.js usa `JSON.stringify(item)`
  como clave anti-repetición). Si el ítem llega sin ellas, se derivan de una semilla del contenido.

## Probarlo en 1 minuto
`node --test tests/practicas-leelo.test.js` (21 tests) · en el navegador: `npm run servir`, http://localhost:8080/practicas/leelo/

## Ejemplos del ejercicio 2 (✔ correcta, ✘ falsas)
1. 20 = 2²·5 — ✔ twenty equals two squared times five · ✘ twenty is equal two squared times five · ✘ twenty equals two times five squared · ✘ twenty equals two to the two times five
2. 198 — ✔ …equals two times three squared times eleven · ✘ …multiplicated by… · ✘ two squared times three times eleven · ✘ three to the two
3. 150 — ✔ …is equal to two multiplied by three multiplied by five squared · ✘ five elevated to two · ✘ three squared…five · ✘ multiplied for
4. GCD(27, 9)=9 — ✔ the greatest common divisor of twenty-seven and nine is equal to nine · ✘ …is the same that nine · ✘ the least common multiple of… · ✘ …twenty-seven with nine…
5. GCD(32, 23)=1 — ✔ …equals one · ✘ the maximum common divisor… · ✘ the lowest common multiple… · ✘ …is equal one
6. 363 — ✔ …is equal to three multiplied by eleven squared · ✘ equals to… · ✘ three squared multiplied by eleven · ✘ eleven elevated to two
7. LCM(39, 30)=390 — ✔ the LCM of thirty-nine and thirty is three hundred and ninety · ✘ the LCM from… · ✘ the GCD of… · ✘ the LCM of ninety-three and thirty…
8. LCM(18, 22)=198 — ✔ the least common multiple… · ✘ …from eighteen… · ✘ the greatest common divisor… · ✘ …is the same that…
9. LCM(38, 23)=874 — ✔ …is equal to eight hundred and seventy-four · ✘ least common multiply · ✘ greatest common divisor · ✘ equals to
10. LCM(35, 26)=910 — ✔ the lowest common multiple… equals nine hundred and ten · ✘ from… · ✘ greatest common divisor… · ✘ is equal nine hundred and ten

Sin prueba en navegador (solo lógica; practica.js no cambia).
