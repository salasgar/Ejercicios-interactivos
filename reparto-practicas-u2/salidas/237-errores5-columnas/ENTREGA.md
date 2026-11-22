# Entrega de la tarea 237 · «Caza el error» de la unidad 5 (`errores5`), ejercicio 1 en columnas

Sesión `s-20261122T120758-f6f541d1`, 2026-11-22. Commit del código: **3c3d307**.

## Ficheros
`practicas/errores5/{logica.js,textos.js,practica.js}`, `tests/practicas-errores5.test.js`, `tests/practicas-ayuda-errores5.test.js`. Los ejercicios 2 y 3 no cambian. `_comun/` sin tocar (no ha hecho falta nada nuevo).

## Qué hace
Ejercicio 1: el enunciado una vez arriba, no pulsable; 2-4 columnas (A-D), 1-2 bien (por rutas distintas) y 1-2 mal (errores distintos). Se marca la línea mala de cada columna mala y «Comprobar» (sin decir cuántas). Si acierta, una pregunta por columna mala con el nombre bueno y dos errores de otra clase. Una sola llamada a `api.responder` (`espera: 'boton'`): el primer fallo termina con la explicación de todas las columnas; acierto total = 1 punto. «Todo está bien» desaparece del ejercicio 1.

## Familias (10) y rutas
| Familia | Buenas | Malas |
|---|---|---|
| suma | con ceros; por partes | alinea a la derecha |
| producto | sin comas; entre potencia | coma mal puesta |
| por10 | mueve la coma; de diez en diez | añade un cero |
| división entera | sin la coma; entre potencia | olvida la coma del cociente |
| división decimal | mover la coma; directa | coma solo en el divisor; quita la coma |
| división con resto | resto original | resto sin deshacer |
| redondeo | de la suma; cifra siguiente | truncando; en cadena; otro orden (catálogo) |
| fracción | numerador entre denominador; denominador 10 | al revés; numerador como décimas (catálogo) |
| fracción periódica | fracción periódica | periódico por redondeo |
| comparación | igualando cifras; cifra a cifra | compara por cifras |
Total: 14 rutas buenas nuevas y 17 malas, todas del catálogo de errores de la unidad (los dos errores sin plantilla, `numerador-como-decimas` y `redondea-otro-orden`, entran como `EXTRA`). El test evalúa con racionales BigInt que toda línea es cierta salvo la marcada.

## Reparto real (3000 ítems, semilla 17)
2 columnas 1372 (45,7 %) · 3 columnas 1393 (46,4 %) · 4 columnas 235 (7,8 %). Combinaciones: 1+1 1372, 1+2 165, 2+1 1228, 2+2 235. Familias: fracción 455, redondeo 430, suma 414, por10 324, comparación 299, producto 270, división entera 269, división decimal 265, fracción periódica 147, división con resto 127.

## Tests propios
errores5 y ayuda-errores5: 70 en verde (con comun). `npm test`: 2726 pasan, 0 fallan.

## Decisiones a revisar
- Solo 7,8 % de ítems con 4 columnas: hay pocos errores del catálogo por familia; más familias con 2 errores malos subirían la cifra.
- La explicación de las columnas buenas reutiliza `COMO_SE_HACE` cuando el porqué propio llevaría «añadir un cero» o cadenas con «→».

## Cómo probarlo
`npm run servir` y http://localhost:8080/practicas/errores5/?ejercicio=1. **No probado en navegador**: el intento de lanzar Chrome headless desde esta sesión automática fue denegado por el clasificador de permisos y no se reintentó por otra vía. Lo comprobado es la lógica y los textos por test; el DOM es la pieza común `columnasPulsables` con el mismo montaje que errores3.
