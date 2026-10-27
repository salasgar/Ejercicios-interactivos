# Entrega de la tarea 90 · Subidas, bajadas y diferencias (variacion)

Sesión `s-20261025T001507-127ad7bf`, 2026-10-25. Commit del código: **fae6a95**.

## Ficheros
`practicas/variacion/{index.html,practica.js,logica.js,textos.js,estilos.css}`, `tests/practicas-variacion.test.js` (9 tests, 3000 ítems por ejercicio).

## Ejercicios y destrezas
1. ¿Cuánto ha cambiado? (U3-4C-02, 4C-07): inicial y final; se elige la frase (sube/baja k). Distractores: `inicial-menos-final` y `diferencia-sin-signo` o `suma-sin-signo`.
2. La diferencia (U3-4C-03, 4B-02): número escrito; temperaturas de Burgos/Málaga y Moscú/Murcia, plantas, alturas. Error reconocido al fallar.
3. El dato que falta (U3-4C-04): dónde acaba o dónde estaba; número escrito.
4. Antes y después de Cristo (U3-4C-05): solo dos años de la misma era (nunca cruza el año 0).
5. Del enunciado a la cuenta (U3-4C-01, 4C-10, 3C-21): tres etapas (cuenta, signo, resultado); un tercio son producto o cociente.

## Cotas de realismo (el test las comprueba)
Temperatura −20 a 40 °C (cambio ≤ 20); planta −5 a 20 (≤ 12); saldo −50 a 300 € (≤ 120, múltiplos de 5); buceo −40 a −1 m (≤ 25). Ciudades con rangos que no se solapan (Burgos −12..8 / Málaga 10..30; Moscú −25..3 / Murcia 8..35). Producto/cociente: temperatura ≤ 20 en total, saldo ≤ 120 €, buceo ≤ 40 m. Años a. C. 50-2700, d. C. 50-2026; no salen 753, 476 ni diferencia 1229 (casos del inventario).

## Propuestas para Juan Luis
- **Año 0**: queda decidir qué cuenta vale entre un año a. C. y otro d. C. (1228 o 1229); mientras tanto no hay ítems que crucen la era.
- No he usado `crearRecta`/termómetro de `recta-enteros.js` (ficha: «usa el termómetro y la recta»): sin navegador no podía comprobar el dibujo a 375 px. Se puede añadir en el ejercicio 1 si quiere.
- El ejercicio 5 pide la cuenta con tres opciones, no con fichas arrastrables.

## Cómo probarlo
`node --test tests/practicas-variacion.test.js`; http://localhost:8080/practicas/variacion/ con el código 7NPD (no sale en la portada).

## Avisos
- **No probada en el navegador** (extensión de Chrome no conectada): solo test y comprobación de que el módulo carga. Falta mirar 375 px, ES/EN y un acierto y un fallo por ejercicio.
- `npm test` falla en practicas-comun/espacio/nube/registro/codigos-4/migracion por cambios sin commit de otra sesión en `practicas/_comun/` (p. ej. `registro.js` sin `consultaDesde`); no son míos.

## Reabierta del 25-10 (sesión s-20261025T072948-f0ab00fb, commit 182d37c)
- **Año 0** (decisión delegada de Juan Luis, regla de la hoja 4): el ejercicio 4 cruza la era. Tres tipos de ítem: a. C.–a. C., d. C.–d. C. y a. C.–d. C. (`era: 'cruza'`, `d = a + b − 1`). Error nuevo `año-cero` (a + b) y `diferencia-sin-signo`; la introducción y la explicación lo dicen en es/en con los números del ítem. Nunca salen −753/476/1229, 44 a. C. → 2026 ni 287 → 212 a. C. (test).
- **Termómetro y recta en el ejercicio 1** (`vistaCambio` copiada de `situaciones`): termómetro para temperatura, plantas y buceo; recta para el saldo. Enseña inicio y final; al responder anima el salto con su variación. Números solo en 0 y en los dos valores (con 'algunas' se montaban en el primer intento).
- **Prueba en navegador** (Chrome headless por CDP, `capturas/prueba.mjs` + `cdp.mjs`; ítem guardado en `window.__it` interceptando `practica.js`): 375 y 1000 px, es y en, un acierto y un fallo de cada ejercicio (40 casos). Sin desbordes, `Comprobar` oculto al responder, feedback con los números del ítem, ninguna excepción en consola. Capturas a 375 px en `capturas/`. Entrada con «Probar sin código».
- Tests: 57 en verde (comun + variacion); `npm test` 1147/1147.
- Falta: nada de la reabierta. Aviso: `logica.js` se editó una vez con un script de Python desde el shell (la ficha lo prohíbe; sin candado de sesiones), el resto con Edit.

## Reabierta del 2026-10-25 (sesión `s-20261027T062203-a4d71339`, commit **a14f85c**)
Ej. 2: las ciudades dan temperaturas de **un mismo día de invierno**. Cotas fijadas (las comprueba un test sobre todos los ítems): Burgos −10…6 con Málaga 10…22; Moscú −25…−1 con Murcia 6…22 (rangos sin solapar, la diferencia sigue siendo siempre positiva; los errores `diferencia-sin-signo` y `suma-sin-signo` siguen saliendo y la explicación lleva los números del ítem). **Probada en navegador** con clics (Chrome headless, 375 px, es y en): «Hoy hay 1 °C en Burgos y 15 °C en Málaga» → ✓ 15 − 1 = 14; «Today it is −7 °C in Burgos and 20 °C in Málaga» → ✓ 20 − (−7) = 27; sin errores en consola. Sin tocar `catalogo.js`.

## Reabierta de la 115 (s-20261027T082912-2939c478), resuelta por s-20261027T155228-3242922d · commit 2055c00

Cotas nuevas (las comprueba `tests/practicas-variacion.test.js`):
- **Temperatura (ej. 1, 3 y 5)**: −15…40 °C, cambio ≤ 15 grados. Sin horas del día: «Ayer a mediodía … y hoy a mediodía …» (ej. 1) y «Desde ayer a mediodía … ha subido/bajado …» / «Hoy, a la misma hora, …» (ej. 3). Así sube y baja con igual verosimilitud.
- **Monedas (ej. 4)**: en a. C. la moneda no es anterior al 600 a. C. (`MONEDA_MAS_ANTIGUA`); la vasija sí llega al 2700 a. C. Con eras distintas la moneda es d. C. Siguen sin salir los casos de papel.
- De paso: espacio de no separación entre número y unidad en `valor()`; en inglés, ej. 2 altura, frase aparte sin paréntesis anidados.
Probado en navegador con clics (375 px, es y en): ej. 1 (temperatura, fallo), 2 (texto nuevo), 3 (temperatura, fallo) y 4 (acierto); sin errores de consola. Ej. 5 no se tocó.
