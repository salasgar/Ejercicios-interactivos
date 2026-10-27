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
