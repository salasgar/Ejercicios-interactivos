# ENTREGA tarea 174 (s-20261112T224209-702e8221)

## Lo hecho
Commits: multiplica-divide-decimales c6ee7d1 · fraccion-decimal e11d5c0 · errores5 e28568d. `npm test` 1882/1882.
Los 13 ejercicios declaran `explicacion` (regla en una frase + cuenta del ítem + «La respuesta es …»); ninguno `sinAyuda`.
- multiplica-divide-decimales: ej.1, 2, 3, 5, 6 con `noLoSe` («No sé hacerlo»); ej.4 (¿está bien?) con el texto por defecto.
- fraccion-decimal: ej.1 y 2 con `noLoSe`; ej.3 (parejas) y ej.4 (<, =, >) por defecto.
- errores5: ej.3 con `noLoSe`; ej.1 y 2 por defecto. La función `explicacion` de practica.js pasó a `explicacionDe` en textos.js, idéntica, para reutilizarla.
Tests: tests/practicas-ayuda-<slug>.test.js (1000 ítems por ejercicio, es y en); lectura a mano de 8 por ejercicio, cuentas comprobadas.
**No hecho: la prueba en el navegador (paso 6)**: el clasificador denegó arrancar `python3 -m http.server`. Pendiente para la 190 o una sesión con permiso.

## Hallazgos fuera de criterio
- solucionComa (feedback existente) dice «1 decimal places» en inglés; no se ha tocado, la explicación nueva lo evita.
