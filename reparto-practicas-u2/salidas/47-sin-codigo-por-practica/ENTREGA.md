# Entrega de la tarea 47 · sesión s-20261016T144921-bfb67163

Commit: d06a9af (10 ficheros): practicas/_comun/{codigos,base,catalogo}.js, practicas/profesor.{js,html}, practicas/semana.html, README.md, docs/practicas-unidad2.md, tests/practicas-comun.test.js, tests/practicas-semana.test.js.

Qué cambia
- Desaparece el código de resultado de práctica (16 caracteres): `codigoResultado` y su lectura de 16 en `codigos.js`; `leerCodigoResultado` solo lee los de 12 de divisores/. `leerCualquierCodigo` y `extraerCodigosResultado` buscan 20 y 12; uno de 16 pegado sale en el aviso de «no válidos».
- `base.js`: `cajaResultado` deja solo la frase «¡Has terminado los N ejercicios! Tu profesor ya puede verlo.»; `activarCopiar` fuera (semana.js tiene su propio manejador).
- `catalogo.js`: fuera `MAX_EJERCICIOS` y el tope de ids 0-31; los ids no se renumeran.
- Panel: el texto de «Códigos de resultado» ya no menciona los de 16; `.semana__pedir` fuera de semana.html.
- Docs y README: «El catálogo está lleno» fuera; «Los dos códigos de resultado» con una línea de historia.
- Tests: ids enteros distintos ≥ 0 en vez del tope; el de 16 ya no se lee; extracción con 12 y 20.

Cómo probarlo en 1 minuto
- `npm test` (746 en verde). `grep -rn codigoResultado practicas tests src` solo da el `codigoResultado` propio de divisores/ en tests/divisores.test.js y tests/practicas-*.test.js (`divisores.codigoResultado`).
- En el navegador (no probado en esta sesión): terminar los ejercicios de una práctica muestra solo la frase; semana.html?t=1 conserva el desplegable del código de la tarea.
