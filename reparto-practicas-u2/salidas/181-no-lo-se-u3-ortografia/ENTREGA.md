# Entrega de la tarea 181 · «No lo sé» en ortografia, ortografia-letras y ortografia-puntuacion

Sesión s-20261112T233551-692b3b53 · commits 18efcd0 (letras), 5f65db3 (puntuación), 2e07ae2 (ortografía).

## Lo hecho

Los 19 ejercicios declaran `explicacion` (ninguno `sinAyuda`; ninguno `noLoSe`: todos son de elegir o reconocer).
Cada explicación reutiliza la que ya daba el banco (con la regla delante) y termina con la respuesta explícita.

- `ortografia` (11 ejercicios; función en el fichero nuevo `practicas/ortografia/ayuda.js`): huecos a/ha, e/he, echo/hecho y porque/por qué (1-3, 5), «¿está bien escrita?» (4), comas (6-7), tildes (8-9: hueco, par de significado y sí/no), signos (10) y sujeto/inciso (11).
- `ortografia-letras` (4): `ayudaHaches` y `ayudaLetras` en `logica.js`.
- `ortografia-puntuacion` (4): `ayudaMayusculas` y `ayudaElegir` en `logica.js`.

Pruebas: `tests/practicas-ayuda-ortografia{,-letras,-puntuacion}.test.js` (1000 ítems por ejercicio, solución calculada con los bancos) y `tests/practicas-no-lo-se.test.js` en verde. `npm test`: 2067 de 2069; los 2 fallos son de `parentesis-algebra` (ejercicios 3 y 4), tarea ajena.
Leídas a mano 4 explicaciones distintas de cada ejercicio (muestra, no las 15 por ejercicio y práctica).

## Hallazgos fuera de criterio

- **No se ha probado en el navegador** (paso 6 de la ficha): la sesión era automática y sin navegador. Pendiente de la revisión 192 o de Juan Luis.
- Las explicaciones de a/ha, e/he, echo/hecho de `ortografia` ya existían y enseñan la frase con «había» donde no tiene sentido («Dale las gracias había tu abuelo ✗»). Es el feedback de siempre, no se ha tocado.
- Mayúsculas: «hay que tocar» nombra las palabras tal como salen en pantalla (con la mayúscula o minúscula mal puesta), mientras la regla las nombra ya corregidas.
