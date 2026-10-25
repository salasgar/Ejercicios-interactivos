# Entrega de la tarea 85 · La regla de los signos
Sesión `s-20261025T001231-27e0902e`. Commit del código: **5e01341**.

Ficheros: `practicas/signos-producto/{logica,textos,practica}.js`, `tests/practicas-signos-producto.test.js` (8 tests, 3000 ítems por ejercicio). También retoqué una línea de `tests/practicas-dos-signos.test.js` (falso positivo de «letra de variable» con la «y» española).

Ejercicios: 1 Multiplica (U3-2C-15, 17; signo y valor; intro con el patrón de U3-2C-17) · 2 Divide (U3-2C-18, 20; 1/6 de `0 : d`, 1/12 de `d : 0` con botón «No se puede») · 3 El factor que falta (U3-2C-19; factores de 2 a 10, hueco único) · 4 ¿Suma o producto? (U3-2C-21; reparto 1/3 resta, suma, producto; primero qué es, luego el valor) · 5 ¿Cuál está bien escrito? (U3-2C-16; una sola con paréntesis).

Cotas (sin contexto): factores 2-12, cocientes 1-12, sumas y restas con números 1-9; en el ej. 4 las sumas y restas no llevan paréntesis.

Cómo probarlo: `npm run servir` → http://localhost:8080/practicas/signos-producto/ con el código 60 (7NPD). **No probada en navegador** (extensión de Chrome desconectada).
