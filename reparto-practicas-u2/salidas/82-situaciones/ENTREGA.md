# Entrega de la tarea 82 · «Enteros en la vida real» (`situaciones`)

Sesión `s-20261025T000128-4fcbd99e`, 2026-10-25. Commit del código: **f2c6b95**.

## Ficheros
`practicas/situaciones/{logica,textos,practica}.js`, `estilos.css`, `index.html` (enlaza `estilos.css`) y
`tests/practicas-situaciones.test.js` (21 tests, 3000 ítems por ejercicio, semillas fijas).

## Ejercicios y destrezas
1. **¿Qué entero es?** (U3-1C-01, U3-1B-04): una situación → el entero, con `campoEntero` («+/−»).
2. **¿Qué situación es?** (U3-1C-01): un entero y un tema → una de tres frases (la buena, el sentido
   contrario `signo-cambiado`, y otro tema `contexto-equivocado`, ambos con −n).
3. **Un paso** (U3-1C-16, U3-1B-04): temperatura y ascensor en el termómetro, dinero en la recta; botón que
   anima el salto; el alumno escribe el resultado y elige entre dos frases («Ahora hace 2 grados» /
   «…2 grados bajo cero»). Acierta solo si las dos cosas están bien. Cuenta sin paréntesis (`−3 + 5`).

## Cotas de realismo (en `CONTEXTOS` y comprobadas por el test)
temperatura −30…45 °C (cambio 1-20); plantas −5…20 (sótanos hasta el quinto, «el segundo sótano» / «basement 2»);
saldo −50…300 € (sin 0; cambios de 5 en 5, 5-100); nivel del mar −400…4000 m (de 10 en 10); buceo −40…30 m
(buceador / gaviota); años −3000…2026, nunca el año 0. En el ej. 2 la opción de sentido contrario y la de
otro tema también caben en su cota (si no, se saca otro ítem). En el ej. 3, `r` y `−r` caben en la cota
(la frase equivocada también tiene que poder darse): resultados de plantas de −5 a 5, de saldo de −50 a 50.

## Cómo probarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/situaciones/ («Probar sin código»; 7NPD dijo «ese código no
existe» en la prueba, sin haber mirado por qué). Probado con Chrome headless por CDP a 375 y 1000 px, en es y en: un ítem
acertado y uno fallado por ejercicio, sin errores de consola. La práctica sigue con `disponible: false`.

## Propuestas / avisos
- El error `contexto-equivocado` (y `otro-error`) son propios de la práctica, no del inventario: la ficha pedía
  ese distractor. Si se quieren en la base, `ERRORES_TIPICOS` es de la 79.
- Años: se escribe 50 a. C. como −50 (convención del inventario U3-1C-01); la cuenta con años sigue siendo la 90.
- Ex. 3 con 0 como resultado queda fuera (las dos frases serían equivalentes); el 0 sale solo como inicio.
- `npm test` tiene 20 fallos ajenos (nube/espacio/registro/semana) por ficheros de la base a medias de otra sesión.
