# Entrega de la tarea 104 · Suma y resta (suma-resta)

Sesión `s-20261027T084016-0fea8c8e`, 2026-10-27. Commit del código: **4f1c3bc**.

## Ficheros
`practicas/suma-resta/{index.html,practica.js,logica.js,textos.js,campo.js,estilos.css}` y `tests/practicas-suma-resta.test.js` (9 tests, 3000 ítems por ejercicio). `campo.js` es propio: la fracción en dos casillas con botón «+/−».

## Ejercicios y destrezas
1. **Mismo denominador** (U4-2C-01, 2C-07): 3/8 + 1/8; 25 % con negativa (resultado negativo o primer término negativo, sin paréntesis); la mitad pide la irreducible. Errores: suma-arriba-y-abajo, signo-perdido, signo-del-primero, sin-simplificar.
2. **Distinto denominador, paso a paso** (U4-1C-16, 2C-02, **2C-04** en versión pequeña): m.c.m., equivalentes (numerador y denominador), resultado; 1/3 de los ítems con denominador múltiplo del otro y 20 % con tres fracciones (m.c.m. ≤ 60). Cada paso se corrige solo y solo cuenta un fallo (el primero).
3. **Con naturales** (U4-2C-03, 2C-07): 1 + 2/3, 2 − 3/4, 3/5 + 1, 1/2 − 2 (25 % negativos); fracción irreducible, resultado irreducible.
4. **¿Qué queda?** (U4-2A-01, 2A-04): dos partes que suman < 1; se pregunta por lo que queda o por lo que suman; cuatro opciones irreducibles y no equivalentes, errores con nombre.
5. **Caza el error** (U4-3C-11): suma en tres líneas; la mitad sin error; se toca la línea y se elige entre dos razones.

## Propuestas (no hechas)
- **U4-2C-04 completa** («denominadores grandes, m.c.m. por factorización», p. ej. 15/168 + 15/140 − 15/21): el ejercicio 2 se queda en denominadores de 2 a 12 y m.c.m. ≤ 60 como pedía la ficha; queda sin cubrir la versión grande.
- El ejercicio 3 no lleva el caso «2 + 1/3 = 3/4» como error propio salvo `suma-arriba-y-abajo` (sí está).

## Probarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/suma-resta/ → «Probar sin código». `node --test tests/practicas-suma-resta.test.js`.
