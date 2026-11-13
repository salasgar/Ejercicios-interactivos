# Entrega de la tarea 194 (sesión s-20261113T085454-4d9f9bad)

## Lo hecho (commit 826db4a)
- `resultados.js`: `juntarFallos` devuelve `ayudas` (suma por ejercicio; cuenta también a quien solo pulsó la ayuda). `juntarResultados` ya conservaba `ayudas` de la nube (spread).
- `profesor.js`: celda por alumno con « · ?N» y `title` si N > 0 (también si solo hay ayudas); columna «No lo sé» en la tabla de más fallados. Orden y CSV sin cambios.
- `profesor-hoy.js`: `calcularHoy` suma `ayudas` de los mismos documentos y la tabla pinta « · ?N» tras el % de fallos. Sin title (las celdas se crean con textContent).
- Tests: 2 nuevos en `tests/practicas-resultados.test.js`. `npm test` 2130/2130.
- NO probado en el navegador (sin sesión de cuenta de prueba); solo tests con datos inventados.

## Hallazgos fuera de criterio
- `herramientas/informe-actividad.mjs` (`agregar`/`resumirEjercicio`) no cuenta `ayudas`, y no está en los ficheros de esta ficha: por eso «Hoy» las suma en `calcularHoy`. Si se quiere en el informe diario por correo, es otra tarea.
- Esta sesión añadió código con heredoc/`sed -i` solo en el test (no en el código de las vistas, que se editó con Edit).
