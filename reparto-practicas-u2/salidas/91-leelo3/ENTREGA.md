# Entrega de la tarea 91 · «Léelo en inglés» de la unidad 3 (`leelo3`)

Sesión `s-20261025T000251-aa812b6d`. Commit del código: **2ed0b53**. Ficheros: `practicas/leelo3/{logica,textos,practica}.js` (el `index.html` del esqueleto se queda) y `tests/practicas-leelo3.test.js` (17 tests).

## Ejercicios (todos de elegir; 2-4 opciones; el idioma del ítem lo pone la base)
1. **Los enteros** (S1; U3-1B-01/02/03): leer −7 (negative / minus), −3 °C (minus / negative / below zero), de la frase al número, greater / less y warmer / colder, ascending / descending, valor absoluto y opuesto.
2. **Sumas, restas y productos** (S2; U3-2B-01/02/03): leer 5 − (−3) y 5 · (−2) (minus / take away, times / multiplied by), «take 9 away from 4», sum / difference / product / quotient, regla de signos (same / different signs).
3. **Potencias** (S3; U3-3B-02): leer (−2)³ y 2⁴, base / exponent / index, squared / cubed, even / odd.
4. **Palabras y símbolos** (S4; U3-4B-01/02): de la frase a −3² / (−3)² y a una suma o resta (nunca al revés), change, how much warmer / colder, balance, deeper, profit / loss.

## Reglas cumplidas
Distractores con error con nombre (ERRORES_TIPICOS o ERRORES_LECTURA de logica.js) y `por_que` con los números del ítem; en las expresiones, un distractor nunca tiene el mismo valor que la buena; parejas válidas nunca enfrentadas (el test normaliza negative/minus, take away, multiplied by, index); sin ×, sin guion como menos, sin «(+»; números en letra ≤ cien; deposit y withdraw aclarados; even/odd aclarados salvo donde se evalúan. Cada fallo pasa `error` y `respuesta` a `api.responder`.

## Cotas de realismo (las comprueba el test)
Temperatura de −25 a −2 °C; cambio en el día ≤ 20 grados con extremos −12…+12; ciudades de −15 a 30 °C; saldo resultante de −50 a 300 €; buceo hasta −40 m; beneficio y pérdida de 20 a 200 €.

## Probar en 1 minuto
`node --test tests/practicas-leelo3.test.js`; en local, http://localhost:8080/practicas/leelo3/ con el código 7NPD. **No probado en navegador** (la extensión de Chrome no estaba conectada): solo tests y la carga de `practica.js` por `practicas-comun`. No sale en la portada (`disponible: false`).
