# ENTREGA 173 · «No lo sé» en las cuatro prácticas de la unidad 5

Commit de código: adca3cc (empujado). Sesión s-20261112T224156-5e5700d3.

## Lo hecho
Cada práctica tiene un `ayuda.js` nuevo con funciones puras exportadas, conectado en `practica.js` (`explicacion`, y `noLoSe` donde se indica). Ninguna usa `sinAyuda`.

- **lee-decimales** (4 ej.): 1 Léelo, 2 Cifra, 3 Fracción decimal: `explicacion` (elegir, texto por defecto). 4 En la recta: `explicacion` + `noLoSe` («No sé hacerlo»).
- **compara-decimales** (4 ej.): 1 ¿Cuál es mayor?: `explicacion`. 2 Ordena, 3 Entre dos, 4 Redondea: `explicacion` + `noLoSe` (procedimiento; 3 y 4 mezclan escribir y elegir). Reutilizan el paso a paso del feedback (`explicar*`) y añaden la respuesta. En «entre dos» la respuesta es un ejemplo (vale cualquier número entre los dos).
- **suma-resta-decimales** (4 ej.): los cuatro con `explicacion` + `noLoSe`; regla delante, cuenta del feedback (`TX.exN.solucion`) y respuesta con unidad.
- **leelo5** (4 ej.): los cuatro con `explicacion` (todos de elegir): la explicación que ya trae el ítem (`item.solucion`), un consejo corto y la opción buena.

Añadido `no_se_hacerlo` a `textos.js` de lee-decimales y compara-decimales (no se tocaron generadores, opciones, feedback ni exclusiones).

Pruebas: un `tests/practicas-ayuda-<slug>.test.js` por práctica (1000 ítems por ejercicio, ES y EN, la solución calculada con su lógica); `tests/practicas-no-lo-se.test.js` en verde para las cuatro; `npm test` 1882/1882. A mano: 4-6 explicaciones por ejercicio en cada idioma leídas y cuentas comprobadas (no 15). Navegador (Chrome, iframe de 375 px, ES y EN): botón y tarjeta presentes en los ejercicios probados, sin scroll horizontal; no se revisó la consola sistemáticamente ni el ancho grande.

## Hallazgos fuera de criterio (para Juan Luis)
- leelo5, ej. 4 «Completa» (`completa_cambio`): el enunciado dice «Hugo pays… Her ___ is…» (pronombre «Her» con nombre masculino); ocurre con otros nombres.
- suma-resta-decimales, ej. 4: «329 · 1000: la coma se mueve 3 lugares» con un entero sin coma; es del texto ya existente.
- compara-decimales, ej. 1: hay ítems «13 = 13,0», con distinta escritura del mismo número (intencionado por el caso «iguales», pero conviene que lo confirme la revisión 190).
- El navegador no pudo comprobar visualmente en ancho grande ni mirar la consola con garantías: lo cubre la 190.
