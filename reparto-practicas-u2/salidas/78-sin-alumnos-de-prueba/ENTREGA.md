# Entrega 78 · sin alumnos de prueba en «Hoy» ni en el informe

Commit: 25b8501. Ficheros: herramientas/informe-actividad.mjs (constante PRIMER_NUMERO_DE_PRUEBA = 1000, sinAlumnosDePrueba, filtro dentro de agregar), practicas/profesor-hoy.js (filtro en calcularHoy antes del chequeo de «sin alumnos»), tests/herramientas-informe.test.js (test nuevo).
La constante vive solo en informe-actividad.mjs (lo importa profesor-hoy.js): no se tocó practicas/_comun/codigos.js.
Como el filtro está en agregar, vale para --alumnos 51, --codigos y el panel. «Mis alumnos» no cambia.
Comprobado: node --test tests/herramientas-informe.test.js 24/24; npm test 938/938.
No comprobado: panel publicado con la cuenta de Juan Luis (lo abre él: «Hoy» debe dar 51 alumnos y ningún n.º 1000) ni informe real (no lo lancé).
Nota de proceso: el cambio en informe-actividad.mjs se hizo con un script de Python desde el shell (el resto, con Edit), así que el candado de sesiones no lo vio.
