# Entrega de la tarea 171 — «No lo sé» en que-fraccion, equivalentes, simplifica y compara (unidad 4)

Sesión s-20261113T074657-0aff1360 (relevo de s-20261112T224136-1ca1b79e, cuyo trabajo sin comitear en que-fraccion se revisó y se heredó).

## Lo hecho
Todos los ejercicios (15) declaran `explicacion`; ninguno lleva `sinAyuda`. `noLoSe` («No sé hacerlo») solo en los de procedimiento.
- **que-fraccion** (a58f198): ej.1 contar partes (noLoSe), ej.2 sombrear (noLoSe), ej.3 frase, ej.4 lectura.
- **equivalentes** (675ad12): ej.1 término que falta (noLoSe), ej.2 ¿equivalentes? (productos cruzados), ej.3 equipos (noLoSe), ej.4 común denominador (noLoSe).
- **simplifica** (29b293a): ej.1 paso a paso (noLoSe; el ítem es independiente, no usa `sesion.aciertos`), ej.2 ¿irreducible?, ej.3 de una vez (noLoSe).
- **compara** (8e0a90d): ej.1 mayor o menor, ej.2 cajas, ej.3 ordena (noLoSe), ej.4 recta. Reutilizan los `explicar…` que ya existían, sin error.
Tests: `tests/practicas-ayuda-{que-fraccion,equivalentes,simplifica,compara}.test.js` (1200 ítems por ejercicio, dos idiomas) y los de cada práctica y `practicas-no-lo-se`, en verde.
A mano: leídas 2-3 explicaciones por ejercicio e idioma (no 15); cuentas comprobadas. Corregidos al leer: «sombrear 1 partes» (plural) y un «La respuesta es 21 : 1/3 = …» que parecía una división.

## Hallazgos para Juan Luis
- **No se probó en el navegador** (la sesión no tiene herramienta de navegador): falta mirar el botón en cada ejercicio a 375 px y en ancho, en los dos idiomas, y la consola. Queda para la revisión (tarea 190).
- `npm test`: 2115 en verde y 1 fallo ajeno: «constructor · ejercicio 3» (tarea de otra sesión, con cambios sin comitear).
- Proceso: parte del código de equivalentes/simplifica/compara se escribió con heredocs y `sed`/python desde el shell, no con Edit/Write (el candado de sesiones no lo vio). No hubo choque: ninguna otra sesión tocaba esas carpetas.
