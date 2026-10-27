# Entrega de la tarea 105 · «Multiplica y divide» (`multiplica-divide`, id 53)

Sesión `s-20261027T082835-a51cdb75`, 2026-10-27. Commit del código: **d7c9aad**.

## Ficheros
`practicas/multiplica-divide/` (`index.html`, `practica.js`, `logica.js`, `textos.js`, `campo.js`, `estilos.css`) y `tests/practicas-multiplica-divide.test.js` (16 tests, 3000 ítems por ejercicio).
`campo.js` es un campo de fracción con raya (dos cuadros + botón +/−; denominador vacío = natural) que lee con `leerFraccion`; la base no lo trae.

## Ejercicios y destrezas (ids de la ENTREGA de la 98)
1. **Multiplica** (U4-2C-08, 2C-09, 3C-10): `2/3 · 3/4`, `5 · 2/7`, `3/4 · 5`; escribir la irreducible; botón «Simplifica antes» (tacha en cruz, solo si hay algo que tachar). 25 % con una fracción negativa. Errores: cruz, sumar denominadores, sumar en vez de multiplicar, natural por ambos, signo perdido.
2. **La fracción de una fracción** (U4-2A-06, 2C-10): cuadrícula b × d (tableta ≤ 24 trozos, bandeja ≤ 20, huerto ≤ 24); se pintan c columnas y al responder se marcan las a filas. Error propio: dividir en vez de multiplicar.
3. **La inversa** (U4-2C-11, 3C-05, 3C-06 parcial): escribir la inversa y comprobar `f · inversa = 1` (un solo `responder`; si falla el paso 1 termina). Naturales (25 %) y negativas (25 %). Errores: inversa como opuesta, inversa del natural, signo perdido.
4. **Divide** (U4-2C-12 cociente, 3C-06, 3C-07, 3C-10): `2/3 : 4/5`, `5 : 3/4`, `3/4 : 5`; dos ayudas opcionales (por la inversa / en cruz; no cuentan como pista). Errores: invertir la primera, no invertir, invertir las dos, signo perdido. 25 % negativas.
5. **Potencias** (U4-2C-12 potencias en la ficha; el id exacto lo fija el §7): `(2/3)²`, `(1/2)³`; base positiva irreducible, exponente 2 (términos ≤ 9) o 3 (≤ 5). Errores: elevar solo el numerador, base por exponente.

Un resultado con el valor bueno pero sin simplificar cuenta como fallo (`sin-simplificar`): la consigna pide la irreducible.

## Cotas de realismo fijadas
Cuentas: numeradores 1-12, denominadores 2-12, naturales 2-12. Ejercicio 2: `max` por contexto (24 / 20 / 24), mínimo 4 trozos, b ∈ 2-4 filas, d ∈ 2-6 columnas, ambas fracciones irreducibles. Las comprueba el test.

## Errores nuevos (no están en `ERRORES_TIPICOS`; propuesta para la base)
`sin-simplificar`, `divide-en-vez-de-multiplicar`, `producto-no-es-uno`. El registro de fallos acepta cualquier id con la forma `[a-z0-9-]{1,40}` (`errorValido`): los tres la cumplen.

## Probarlo en 1 minuto
`node --test tests/practicas-multiplica-divide.test.js`; `python3 -m http.server 8087` y `http://localhost:8087/practicas/multiplica-divide/?idioma=es` → «Probar sin código» (el código 7NPD no existe sin red). Hecho en Chrome: los cinco ejercicios, acierto y fallo, en ES y EN. **La ventana no bajó de 570 px** (el redimensionado a 375 no se aplicó): el ancho de móvil real queda sin ver; el campo mide unos 150 px y la cuadrícula es un SVG que escala.
