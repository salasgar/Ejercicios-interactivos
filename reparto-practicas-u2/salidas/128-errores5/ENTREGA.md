# Entrega de la tarea 128 · `errores5` («Caza el error», unidad 5)

Sesión `s-20261105T234257-c3df5030`, 2026-11-05. Commit del código: **`ccda550`**.

## Ficheros

`practicas/errores5/{index.html,practica.js,logica.js,textos.js,campo.js,estilos.css}` y `tests/practicas-errores5.test.js`.
No se ha tocado la base, el catálogo ni los docs.

## Ejercicios (id 62 del catálogo, 3 ejercicios) y destrezas

| # | Ejercicio | Destrezas |
|---|---|---|
| 1 | ¿Dónde está el error? Cálculo de 3 líneas; se toca la línea mala o «Todo está bien» (un tercio sin error; algunos con ceros finales, 3,50) | U5-2C-17, U5-2C-18 |
| 2 | ¿Qué error es? Mismo cálculo, 4 nombres de `ERRORES_TIPICOS`, solo uno verdadero | U5-2C-17 |
| 3 | Corrígelo: se teclea el resultado bueno (coma o punto, ceros finales vale; en redondeo, justo las cifras que pide la línea) | U5-2C-17 |

Once errores: `alinea-a-la-derecha`, `coma-mal-puesta`, `por-diez-anadiendo-cero`, `redondea-truncando`, `redondea-en-cadena`,
`olvida-coma-cociente`, `coma-solo-en-divisor`, `resto-sin-deshacer` (0,42 en vez de 0,0042), `fraccion-al-reves`,
`periodico-por-redondeo` (0,33 por 1/3) y `compara-por-cifras`. Las dos últimas no salen en el ejercicio 3 (la respuesta
buena no se puede teclear: periódico y relación). La línea 1 es siempre el enunciado; la mala es la 2 o la 3.

## Cotas de realismo

Sin contextos (solo cuentas), así que no hay cotas por contexto. Números de hasta cuatro cifras enteras (test).

## Hoja y examen

- Hoja de la semana 1 y 2: **excluida en claro** (`HOJA` en `logica.js`: sumas, productos, ×10, divisiones, fracciones, redondeos y
  comparaciones de ambas hojas y su repaso); sin importar el orden de los sumandos, factores o parejas, ni los ceros finales.
- Examen: **no existía** al escribirla (no hay `casos-examen*.tsv`; solo `destrezas-semana*.md`). `HUELLAS_EXAMEN` está vacío y la
  comprobación por huella FNV-1a de `claveCaso` ya funciona: **la tarea de publicación (131) tiene que cotejar** y, si hay casos, añadir
  las huellas (la clave es `tipo|operandos normalizados`, ver `claveCaso`).

## Cómo probarlo en 1 minuto

`node --test tests/practicas-errores5.test.js` (12 en verde). En el navegador, `npm run servir` y
http://localhost:8080/practicas/errores5/ → «Probar sin código» (también `?ejercicio=3`).

## Pruebas hechas

`npm test` 1543/1543. En navegador (ventana ancha, español): intro, ejercicio 1 (ítem sin error, fallo con feedback) y
ejercicio 3 (respuesta 3.15 con punto aceptada, feedback con la línea buena). **No probado**: 375 px, inglés y ejercicio 2 con clics.

## Propuestas

- Los errores `entre-diez-quitando-cero`, `redondea-otro-orden` y `numerador-como-decimas` solo salen como nombres falsos.
- Faltan por escribir de la base (no hacen falta aquí): jerarquía en las combinadas (ver «dónde van las combinadas», ENTREGA de la 122).
