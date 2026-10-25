# Entrega de la tarea 86 · «Productos y potencias con signo» (`potencias-enteros`)

Sesión `s-20261025T000408-848db748`, 2026-10-25. Commit del código: **909e866**.

## Ficheros

`practicas/potencias-enteros/` (`index.html`, `practica.js`, `logica.js`, `textos.js`, `estilos.css`) y
`tests/practicas-potencias-enteros.test.js` (18 tests, 3000 ítems por ejercicio con semilla fija).

## Ejercicios y destrezas

1. **Cuenta los negativos** (U3-3C-02, U3-3C-03): 3-5 factores; se tocan los negativos y se escribe el
   resultado con `campoEntero`. Acierta si el conjunto tocado y el valor son los buenos. Uno de cada
   cinco ítems lleva un 0 o un −1.
2. **Potencia de base negativa** (U3-3C-10, U3-3C-11): se elige el signo (Positivo/Negativo), aparece el
   campo y se escribe el valor. Bases −1 a −10, exponente 2-4 (5 solo con −1 y −2).
3. **¿Cuál es la base?** (U3-3C-12, U3-3C-15): `(−a)ⁿ`, `−aⁿ` y `−(−a)ⁿ`; se elige la base (−a o a), después
   el valor; al responder, la base se resalta en la expresión con `envolver`.
4. **Cuadrados y raíces** (U3-3C-13, U3-3C-14): mitad «¿qué enteros al cuadrado dan n?» (se marcan los
   dos, 5-6 botones); la otra mitad `√n = □` (35 %) o `√(−n) = □` (15 %), con campo y botón «No existe».

## Cotas de realismo (no hay contexto: son de tamaño)

|producto| ≤ 500 con |factor| ≤ 5; potencias y cuadrados |valor| ≤ 1000; cuadrados perfectos de 1 a 144 (r de
1 a 12). Las comprueba el test.

## Decisiones propias (la ficha lo dejaba abierto)

- **Distractores**: los ejercicios 1-3 no tienen opciones falsas (se escribe el valor), así que no hay
  distractores. Los errores típicos se detectan por lo que escribe el alumno y van a `api.responder({ error })`
  con los ids de `ERRORES_TIPICOS` (`potencia-par-negativa`, `potencia-impar-positiva`, `base-por-exponente`,
  `menos-en-la-base`, `signos-antes-de-la-potencia`, `signo-cambiado`) más propios de la práctica
  (`cuenta-mal-los-negativos`, `producto-mal-calculado`, `base-equivocada`, `solo-un-signo`, `raiz-negativa`,
  `raiz-no-existe`, `raiz-de-negativo-negativa/positiva`…).
- **Ejercicio 4, opciones falsas** (2-3 por ítem): 2r, −2r (base por exponente), n (cuadrado en vez de raíz),
  n/2 (mitad). Ninguna eleva al cuadrado a n; el test lo comprueba.
- **«No existe»** responde al instante (no pasa por «Comprobar»); en 2-3 el campo de valor aparece al elegir
  el signo o la base.

## Cómo probarlo en 1 minuto

`node --test tests/practicas-potencias-enteros.test.js`. En el navegador, `npm run servir` y
http://localhost:8080/practicas/potencias-enteros/ con el código 60 (`7NPD`); no sale en la portada.

## Qué NO se ha hecho

- **Sin prueba visual a 375 px**: la extensión de Chrome no estaba conectada. Sí se ejecutaron los `montar`
  de verdad en Chrome headless con una base falsa (60 ítems por ejercicio acertando y fallando, en es/en
  y con el feedback en el otro idioma): sin excepciones y con los textos bien. Falta mirar el aspecto.
- `npm test` completo: 15 fallos en `practicas-{codigos-4,espacio,migracion,nube,registro,semana}` y
  `practicas-comun`, por ficheros de `_comun/` que otra sesión tiene a medias; los 18 tests míos pasan.
