# Entrega tarea 21 (reabierta) · exponente
Commit: b3dbb99. Ficheros: practicas/exponente/{logica,practica,textos}.js, tests/practicas-exponente.test.js.
URL local: http://localhost:8080/practicas/exponente/ (npm run servir).
Hechos 1 (enunciado de factores iguales a la base), 2 (aviso cuando la potencia puesta vale lo mismo), 3 (cuenta de la región tocada; generador sin coincidencias), 4 (botones − y +), 5 (feedback del valor elegido), 6 (variante (a·b)² sin dibujo; aria-label bilingüe). Fuera de criterio (9⁴) no tocado.
Pendiente: `disponible: true` en la fila de exponente de practicas/_comun/catalogo.js (candado de la sesión 96d0b712; ver hechos/notas/s-20261008T175053-b5cf65b2-catalogo-pendiente.md).

## Reabierta del 14-11 (e-veces-y-miles), sesión s-20261114T230322-89736f6e — commit c851e45

- `TX.repetida.bien`, `TX.valor.bien`, `TX.valor.mal`: ya no dicen «b multiplicado por sí mismo e veces»; dicen lo que la tarjeta: «b elevado a e es un producto de e factores, todos iguales a b: b · b · … = p» (`fraseProducto` en `textos.js`; la cuenta solo hasta 6 factores). `TX.potencia.bien`: «p es b elevado a e: un producto de e factores, todos iguales a b». Ninguna lleva «(no b · e)»; la tarjeta lo conserva solo con base ≠ exponente.
- `fmt(n, idioma)` en `logica.js`: separador de miles desde 5 cifras (español: espacio de no separación; inglés: coma; la RAE no separa las de 4). Lo usan `cuentaParte`, `cuentaErronea`, `cuentaTocada` (ahora con `idioma`), la tarjeta, el feedback del ej. 2 y los botones de «¿Cuánto vale?».
- Tests nuevos en `tests/practicas-ayuda-exponente.test.js` (base = exponente sin «(no …)», sin «por sí mismo N veces», ningún número de 5 cifras seguidas en 300 ítems por ejercicio, dos idiomas).
- No se tocaron generadores, exclusiones de casos de examen, `catalogo.js` ni `_comun/`.
- **No hecho: clic a 375 px y 1200 px en el navegador** (sesión no interactiva; el intento de Chrome headless solo carga la entrada por código). Queda comprobar a mano un acierto, un fallo y un «No lo sé» en los ejercicios 1 y 2, en los dos idiomas.
- `npm test`: 2330/2330.
