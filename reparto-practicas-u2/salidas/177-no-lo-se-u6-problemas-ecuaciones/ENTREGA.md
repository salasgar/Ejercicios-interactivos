# Entrega de la tarea 177: «No lo sé» en la unidad 6 (problemas-ecuaciones, errores6, leelo6)

## Lo hecho
Commits: leelo6 1d8a755 y 01edccd; errores6 8a5fffe; problemas-ecuaciones 85e1e21.

- **leelo6** (4 ejercicios, todos de elegir): `explicaLeelo(i)` en `textos.js`: lo que se pide, lo que dice el ítem (`solucion`), la opción buena y un consejo por ejercicio. Sin `noLoSe` propio.
- **errores6** (3 ejercicios): `explicaDonde`, `explicaQue`, `explicaCorrige`. La función `explicacion` y los ayudantes `cuenta`/`nombreError` se movieron de `practica.js` a `textos.js` sin cambiar su comportamiento. El ejercicio 3 (Corrígelo) lleva `noLoSe` «No sé hacerlo» y acaba en el valor de x.
- **problemas-ecuaciones** (5 ejercicios): `explicaIncognita`, `explicaEcuacion`, `explicaResuelve` (las cuatro fases; con `noLoSe`), `explicaPide`, `explicaSentido`; todas reutilizan las soluciones que ya tenía `logica.js`.
- Ningún `sinAyuda`. Tests: `tests/practicas-ayuda-{leelo6,errores6,problemas-ecuaciones}.test.js` (1000+ ítems por ejercicio, dos idiomas) y los tres «No lo sé en …» de `practicas-no-lo-se.test.js`; `npm test` 1923/1923.
- Leídas a mano varias explicaciones por ejercicio en los dos idiomas. **No se probó en el navegador** (sesión automática sin navegador).

## Hallazgos fuera de criterio (para Juan Luis / la 191)
- problemas-ecuaciones, ej. 4: el feedback existente da el resultado («Nora tiene 15 años») sin mostrar la cuenta (11 + 4); la explicación lo hereda.
- problemas-ecuaciones, ej. 2: la regla es general («el doble es 2x…»); no desglosa frase a frase el enunciado del ítem, porque el generador no guarda ese desglose.
- Mezcla de idiomas heredada en el ej. 1 de leelo6 (el significado va en español por diseño).
- La opción `enunciado` del ej. 5 de problemas-ecuaciones no la genera ningún ítem.
