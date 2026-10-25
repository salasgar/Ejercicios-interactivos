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
