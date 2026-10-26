# Entrega de la tarea 114 · «Las fichas del parchís» y ejercicio 6 nuevo

Sesión s-20261026T093512-94d2c6f9 · commit a80b030.

- Nombre visible: catálogo (fila 46), portada, index.html, textos (introducción del ej. 1), docs. Slug, id, carpeta y nº de ejercicios, sin cambios. Pablo sigue de personaje en los enunciados; quitada la mención «las fichas de Pablo» solo en la consigna y el detalle del ej. 1 (ahora «las fichas»).
- Ej. 6: `generarTablaDivisores`, `productoCasilla`, `diagnosticarTabla` (logica.js); tabla en practica.js (casillas de fichas apagadas/encendidas, producto a la derecha); estilos; textos ES/EN. 4-12 divisores, valor ≤ 1000, 35 % con 11 o 13. Con 7 u 11 divisores no sale nada (exigirían 2^6 / 2^10).
- `api.responder` solo vale una vez por ítem: las comprobaciones fallidas se cuentan; al acertar se cierra con acierto=false si hubo fallos (error `divisor-repetido`; `faltan-divisores` queda sin uso porque con una casilla por divisor faltar implica repetir) y `pistas` = fallidas − 1, o acierto si ninguna.
- Tests: 14/14 propios; `npm test` 1167/1167. Probado en navegador con 33 = 3·11 (fallo con casillas marcadas, luego acierto); no probado a 375 px real ni en inglés ni con 12 divisores (ventana de 400 px reportada como ancha: tabla de 3 columnas).
- Pregunta para Juan Luis: ¿Pablo sigue como personaje? (se ha dejado).
- Cómo probarlo: `npm run servir`, http://localhost:8080/practicas/fichas-de-pablo/ → «Probar sin código» → ejercicio 6.
