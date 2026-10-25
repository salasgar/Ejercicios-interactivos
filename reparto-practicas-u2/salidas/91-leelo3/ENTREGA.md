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
`node --test tests/practicas-leelo3.test.js`; en local, http://localhost:8080/practicas/leelo3/ con el código 7NPD. Probado en navegador (ver abajo). No sale en la portada (`disponible: false`).

## Prueba en navegador (reabierta del 25-10, sesión `s-20261025T004424-86ebc86d`)
Chrome headless por CDP contra `npm run servir`, «Probar sin código» (la base a medias de la 71 impide el 7NPD), a 375 px (móvil) y 1000 px, con `?idioma=es` y `?idioma=en`, los cuatro ejercicios: en cada uno, hasta ver un acierto y un fallo. Capturas a 375 px en `capturas/ejN-acierto.png` y `ejN-fallo.png`.
- Sin desbordamiento horizontal (scrollWidth = 375 / 1000), botones de opción de 56 px de alto como mínimo, ninguna excepción ni error en consola.
- No hay botón «Comprobar»: se responde al tocar la opción, se pintan la correcta (verde) y la elegida (roja) y sale «Siguiente»; los aciertos pasan solos.
- El feedback cita los números del ítem («−9 − 17 = −26: ha restado al revés…», «60 + 50 = 110…») y, si el alumno falla, da la lectura buena; negative / minus y las demás parejas válidas se dicen como «las dos valen».
- Exponentes (`<sup>`), menos U+2212 y punto medio se ven bien.
- **Defecto propio corregido**: «La cociente / La producto de 35 y 5…» → «El cociente / El producto» (artículo según el nombre); commit en la terminada.
- Nada que proponer a la base.

## Reabierta del 25-10 (sesión s-20261025T084951-ef0df707, commit e23f871)
- **Ej. 1**: toda temperatura que se ve (la buena y las falsas) queda entre −30 y 45 °C (`COTA_TEMPERATURA`). En `palabras_a_entero` con grados, n ≤ 30 y el número parecido también cabe (se elige n entre los que tienen alguno que quepa); en `leer_temperatura`, la falsa de `numero-parecido` solo si cabe (q ≤ 30). Sin grados (`leer_entero`, `palabras_a_entero` a secas) no cambia nada.
- **Ej. 4, `cuanto_mas`**: cada pareja de ciudades lleva su cota de un mismo día de invierno (`CIUDADES`): Madrid 5-18 °C con Oslo −15…−1; Rome 5-18 con Moscow −15…−1; Cairo 12-25 con Helsinki −15…−1; Lima 18-30 con Toronto −15…−1; Athens 5-18 con Warsaw −15…−1.
- Tests: 3 semillas × 3000 ítems, toda temperatura en °C dentro de la cota (más de 1000 ítems con grados comprobados); cada pareja de ciudades dentro de sus dos cotas y las cinco parejas salen. 63 propios en verde, `npm test` 1165/1165.
- Prueba en navegador (Chrome headless por CDP, «Probar sin código», 375 px): ej. 1 en español con «minus twelve degrees» y fallo; ej. 4 en inglés con «How much warmer is Rome (10 °C) than Moscow (−15 °C)?» y fallo; sin desbordamiento (375) ni errores de consola. Capturas nuevas en `capturas/` (`ej1-grados-es-*`, `ej4-ciudades-en-*`).
- `catalogo.js` no se toca: la publica la 94.
