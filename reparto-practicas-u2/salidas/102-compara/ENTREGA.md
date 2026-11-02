# Entrega de la tarea 102 · «Compara y ordena» (`compara`, id 50)

Sesión `s-20261027T083547-ff91a340`, 2026-10-27. Commit del código: **78f8ff8**.

## Ficheros
`practicas/compara/{index.html,practica.js,logica.js,textos.js,estilos.css}` y `tests/practicas-compara.test.js` (11 tests, 3000 ítems por ejercicio). Los nombres de los ejercicios no cambian respecto al esqueleto.

## Ejercicios y destrezas
| Ej. | Nombre | Destrezas |
|---|---|---|
| 1 | Mayor o menor | U4-1C-17, U4-1C-19, U4-1C-23 (28 % con negativa) |
| 2 | Frente a 1 y a un medio | U4-1C-18 (sin negativas) |
| 3 | Ordena | U4-1C-20, U4-1C-23 (25 % con una o dos negativas) |
| 4 | En la recta | U4-1C-21, U4-1C-24 (de 0 a 1, de 0 a 2 y de −1 a 1) |

## Cotas (sin contexto, solo números)
Denominadores de 2 a 12 (ej. 3: hasta 36 antes de simplificar, común denominador ≤ 72). En la recta, d de 2 a 12 en 0-1 y de 2 a 6 en 0-2 y −1-1 (13 marcas como mucho).

## Decisiones
- Ej. 1: un tercio por caso (mismo denominador, mismo numerador, distinto); el ítem se regenera si el error típico del caso daría la respuesta buena por casualidad. Sin «=»: nunca equivalentes.
- Ej. 2: seis fracciones, al menos una por caja; ninguna igual a 1/2 ni a 1. Se toca la fracción y luego la caja (como `termometro`).
- Ej. 3: fracciones «parecidas» generadas como m/D con D en {12, 18, 20, 24, 30, 36} y simplificadas (salen 11/18, 7/12, 2/3…).
- Ej. 4: se toca una marca (se puede cambiar) y se pulsa «Comprobar»; solo llevan número los enteros.
- Errores registrados: de la 98 (`compara-solo-numeradores`, `compara-solo-denominadores`, `ignora-el-signo`, `contar-marcas`, `contar-desde-menos-uno`) y propios: `compara-mal`, `caja-mal`, `ordena-por-denominadores`, `ordena-por-numeradores`, `orden-al-reves`, `orden-mal`, `toca-el-simetrico`, `marca-mal`.

## Cómo probarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/compara/?ejercicio=N → «Probar sin código» (no guarda nada). Probado en navegador un ítem de cada ejercicio (fallo, con feedback), en español y en inglés.

## Propuestas
- En el ej. 1 aparece alguna vez 2/2 (= 1) o una impropia: es válido, pero si Juan Luis prefiere solo propias se cambia el rango en `generarComparar`.

## Reabierta del 28-10 (sesión `s-20261028T223951-1b094c4a`, commit c2573cf)
Cerrada punto por punto contra `hechos/reabiertas/102--s-20261028T135932-e77025db-revision.md`:
1. Ej. 2: `errorCajas` usa `=== 1` (el numerador solo engaña cuando la comparación solo por numeradores diría «mayor»); una 1/d mal puesta da `caja-mal` con su razón y sin «Ojo: …numerador…». Test con todas las 1/d y las demás «menor» de 3000 ítems.
2. Ej. 4: una marca entera tocada se nombra como entero («Has tocado −1», «1», «0»), no «−6/6». Test en 3000 ítems, ES y EN.
3. Erratas: «Compared with 1 and with a half» (antes «Against 1 and a half»); el «½» de `solo_num` es ahora la fracción con raya; test de que no quedan.
Probado en navegador con clics: ej. 4 (tocar el 1, «You tapped 1, which is not…») y ej. 2 (1/6 mal puesta: solo «1/6 is less than 1/2»). Sin probar a 375 px.

## Reabierta del 30-10 (sesión `s-20261102T093031-d95013ff`, commit dc9df94, encadenada tras la 100)
Cerrada contra `hechos/reabiertas/102--s-20261030T081542-dab2aa98-revision.md`. No probado en navegador (cambio puramente de lógica de generación, sin tocar `practica.js`, `index.html` ni `textos.js`): `node --test` y `npm test` cubren el resultado.

1. **Ej. 1 (mayor o menor)**: nuevas parejas reservadas de la hoja (hoja 1, ej. 10 y 12a, y hoja 2, ej. 1b) y huellas de examen (U4-1C-17 y U4-1C-19 de las semanas 1 y 2, y el apartado 1b del examen final modelo 2; la numeración por letra de `\ap` hace que la pregunta de ordenar sea «b)», no la de `\cajaop`; «d)» es la de `<`/`>`). Los ejemplos de los recuadros «Recuerda» se quedan, como pedía la reabierta.
2. **Ej. 3 (ordena)**: conjuntos reservados de la hoja (hoja 1, ej. 11) y huellas de examen (U4-1C-20 de las semanas 1 y 3, y el apartado 1b de los tres modelos del examen final, incluido el que lleva una negativa).
3. **Mecanismo**: nuevas `parejaFracciones`/`claveConjunto` y `huella` (FNV-1a de 32 bits, el mismo algoritmo que en `practicas/equivalentes/logica.js`, exportado), calculadas sobre el valor con signo de las fracciones, nunca sobre el orden en que el generador las produce ni sobre `creciente`. Las huellas de examen se calcularon en un guion del scratchpad (no comiteado); el código publicado no lleva ninguna fracción de examen en claro.
4. Comprobado con un barrido de 20000 ítems por ejercicio (semilla 117, como pide la reabierta): 0 coincidencias en el ej. 1 y el ej. 3. El ej. 4 no necesita exclusión, como ya decía la reabierta.

No se ha tocado `catalogo.js`.
