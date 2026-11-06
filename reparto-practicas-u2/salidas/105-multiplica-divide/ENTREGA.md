# Entrega de la tarea 105 · «Multiplica y divide» (`multiplica-divide`, id 53)

Sesión `s-20261027T082835-a51cdb75`, 2026-10-27. Commit del código: **d7c9aad**.

## Ficheros
`practicas/multiplica-divide/` (`index.html`, `practica.js`, `logica.js`, `textos.js`, `campo.js`, `estilos.css`) y `tests/practicas-multiplica-divide.test.js` (16 tests, 3000 ítems por ejercicio).
`campo.js` es un campo de fracción con raya (dos cuadros + botón +/−; denominador vacío = natural) que lee con `leerFraccion`; la base no lo trae.

## Ejercicios y destrezas (ids de la ENTREGA de la 98)
1. **Multiplica** (U4-2C-08, 2C-09, 2C-10; +3C-10 con negativa): `2/3 · 3/4`, `5 · 2/7`, `3/4 · 5`; escribir la irreducible; botón «Simplifica antes» (tacha en cruz, solo si hay algo que tachar). 25 % con una fracción negativa. Errores: cruz, sumar denominadores, sumar en vez de multiplicar, natural por ambos, signo perdido.
2. **La fracción de una fracción** (U4-2C-11, 2A-06): cuadrícula b × d (tableta ≤ 24 trozos, bandeja ≤ 20, huerto ≤ 24); se pintan c columnas y al responder se marcan las a filas. Error propio: dividir en vez de multiplicar.
3. **La inversa** (U4-3C-05; +2C-09): escribir la inversa y comprobar `f · inversa = 1` (un solo `responder`; si falla el paso 1 termina). Naturales (25 %) y negativas (25 %). Errores: inversa como opuesta, inversa del natural, signo perdido.
4. **Divide** (U4-3C-06, 3C-07, 3C-10): `2/3 : 4/5`, `5 : 3/4`, `3/4 : 5`; dos ayudas opcionales (por la inversa / en cruz; no cuentan como pista). Errores: invertir la primera, no invertir, invertir las dos, signo perdido. 25 % negativas.
5. **Potencias** (U4-2C-12): `(2/3)²`, `(3/5)³`; base positiva irreducible con numerador ≥ 2, exponente 2 (términos ≤ 9) o 3 (≤ 5). Errores: elevar solo el numerador, base por exponente.

Un resultado con el valor bueno pero sin simplificar cuenta como fallo (`sin-simplificar`): la consigna pide la irreducible.

## Cotas de realismo fijadas
Cuentas: numeradores 1-12, denominadores 2-12, naturales 2-12. Ejercicio 2: `max` por contexto (24 / 20 / 24), mínimo 4 trozos, b ∈ 2-4 filas, d ∈ 2-6 columnas, ambas fracciones irreducibles. Las comprueba el test.

## Errores nuevos (no están en `ERRORES_TIPICOS`; propuesta para la base)
`sin-simplificar`, `divide-en-vez-de-multiplicar`, `producto-no-es-uno`. El registro de fallos acepta cualquier id con la forma `[a-z0-9-]{1,40}` (`errorValido`): los tres la cumplen.

## Probarlo en 1 minuto
`node --test tests/practicas-multiplica-divide.test.js`; `python3 -m http.server 8087` y `http://localhost:8087/practicas/multiplica-divide/?idioma=es` → «Probar sin código» (el código 7NPD no existe sin red). Hecho en Chrome: los cinco ejercicios, acierto y fallo, en ES y EN. **La ventana no bajó de 570 px** (el redimensionado a 375 no se aplicó): el ancho de móvil real queda sin ver; el campo mide unos 150 px y la cuadrícula es un SVG que escala.


## Reabierta del 28-10 (s-20261028T224043-5954bc06, commit f89cf47)

Ej. 2: cada frase pide la irreducible (es/en); 1 trozo/parcela en singular; «parcelas» en el huerto; aviso de «en cruz» y de «dividir» unificado (dan el mismo valor). Ej. 5: numerador ≥ 2 en la base (con 1, los dos errores coincidían). Ej. 1: sin frase de signos si el error no es de signo. Casos fijos de las introducciones cambiados (inversa de 2/7 y de 6; 3/4 : 5/6; (3/4)²). Test nuevo del ej. 2. Pendientes que no son de esta práctica: `naturalPorAmbos` de la base pierde el signo con natural negativo; el ej. 1 con negativas es de las sesiones 9-10.

Probada en Chrome headless con clics (acierto y fallo de los 5 ejercicios, es/en, 375 y 1100 px): sin desbordes ni errores de consola.

## Reabierta del 30-10 (s-20261102T092222-c4bdab3c, commit 3fb9856)

Casos de los exámenes semanales 2 y 3, del examen final y de las hojas 2 y 3 que podían salir en
los ejercicios 1, 4 y 5 (`hechos/reabiertas/105--s-20261030T084305-921ac985-revision.md`).

**Exámenes (excluidos por huella, nunca en claro):** 15 huellas en el ejercicio 1 (U4-2C-08 y
U4-2C-09 de la semana 2, los seis casos de cada una; y los apartados 2a de los modelos 1 y de
recuperación y 2e del modelo 2 del examen final), 21 en el ejercicio 4 (U4-3C-06, U4-3C-07 y
U4-3C-10 de la semana 3, los seis casos de cada una; y el 2b de los tres modelos del final) y 6 en
el ejercicio 5 (U4-2C-12 de la semana 3, los seis casos). Clave: en el 1, los dos factores sin
orden; en el 4, dividendo y divisor con orden; en el 5, base y exponente. Huellas calculadas con
un guion de scratchpad (no se comitea) a partir de los TSV de casos y los `.tex` del final;
`huellaMultiplica`/`huellaDivide`/`huellaPotencia` y los tres `HUELLAS_EXAMEN_*` quedan exportados
de `logica.js` para que el test las recorra.

**Hojas y banco (en claro, los alumnos ya los tienen en papel):** ejercicio 1, hoja 3 ej. 1a, 7b y
7d, banco B11b (4 parejas); ejercicio 4, hoja 3 ej. 3a/3d/3e/3f, 4a/4b/4c/4e/4f, 5b/5b2/5b3, 6e y
7c2, banco B11a y B11c (16 parejas, con orden); ejercicio 2, hoja 2 ej. 12c (1/3 de 3/5; las demás
parejas de las hojas tienen denominador fuera de la cota de esta práctica y no podían salir).

**Se arregla de paso:** el ejemplo de la introducción del ejercicio 5 pasa de `(3/4)² = 9/16`
(coincidía con el recuadro «Recuerda» de la hoja 2) a `(2/3)² = 4/9`.

`node --test tests/practicas-comun.test.js tests/practicas-multiplica-divide.test.js`: 65/65. `npm
test`: 1357/1357. Probado en `npm run servir` con Chrome (vía claude-in-chrome), código de prueba
7NPD sin red disponible en este entorno así que se usó «Probar sin código»: ejercicios 1, 4 y 5, un
acierto y un fallo, ES y EN, 375×700 px.

Propuesta pendiente (no se decide aquí): el ejercicio 5 saca 11 de sus 48 potencias posibles en las
hojas 2 y 3 (acertado, no bloquea, según la reabierta); si Juan Luis quiere quitarlas también, hace
falta ampliar antes las bases o los exponentes del ejercicio.

## Reabierta del 2-11 (s-20261102T141053-b5277421; cierra s-20261102T151807-d87a1a7a, commit d5106a2)

`hechos/reabiertas/105--s-20261102T141053-b5277421-revision.md`. **Hoja 2, ej. 11** (a-h, productos): las ocho parejas pasan a
`PAREJAS_HOJA_MULTIPLICA` (en claro; sin orden). **U4-3C-11 del examen semanal 3**: de las seis variantes, tres piden como «cuenta mal
hecha» una división (2 huellas nuevas en `HUELLAS_EXAMEN_DIVIDE`, 21 → 23) y una una potencia (1 en `HUELLAS_EXAMEN_POTENCIA`, 6 → 7);
las otras tres son suma o comparación y no pueden salir en esta práctica. Nunca en claro: solo las huellas. Las claves de producto no
dependen del orden (`huellaMultiplica` ordena; `esParejaHoja` mira los dos órdenes); test nuevo con la hoja 2 en los dos órdenes.
`node --test tests/practicas-comun.test.js tests/practicas-multiplica-divide.test.js`: 66/66. `npm test`: 1365/1365. Sin tocar
`catalogo.js`. Sin publicar: sigue sin publicador (mar 22-12).

## Reabierta del 6-11 (s-20261106T144236-e32305eb; cierra s-20261106T155741-13a7f159, commit 9c7d5c6)

`hechos/reabiertas/105--s-20261106T144236-e32305eb-revision.md`. **Las claves ya no dependen del sitio del signo:** `huellaMultiplica` =
(|a|, |b| sin orden, signo del producto) y `huellaDivide` = (|a|, |b| con orden, signo del cociente); `esParejaHoja` y `coincideDivide`
comparan igual. Los dos `HUELLAS_EXAMEN_*` (15 y 23) se recalcularon invirtiendo las huellas viejas por fuerza bruta sobre todas las
fracciones de numerador ±30 y denominador 30 (las 15 y las 23 se invirtieron; ninguna quedó sin pareja), sin tocar los TSV ni escribir nada en claro.
Hoja 3 añadida en claro: 3b, 3c, 6c y 12b al cociente; 6b y 7a al producto. Test nuevo del sitio del signo.
Barrido independiente con las huellas VIEJAS de `HEAD`: 5 semillas × 20000 ítems por ejercicio, con el menos en cualquier operando: 0 coincidencias.
`node --test tests/practicas-comun.test.js tests/practicas-multiplica-divide.test.js`: 67/67. `npm test`: 1640/1640. Sin navegador (solo cambia
lógica de exclusión, no la interfaz). Sin tocar `catalogo.js`. Sin publicar: sigue sin publicador (mar 22-12).
