# Test que falla: «constructor · ejercicio 3: comas y palabras llevan la solución»

Anotado el 2026-11-13 por la sesión que añadió la línea de comprobación a `divisiones` (cambio pedido por Juan Luis tras el examen final de la U2).

- Dónde: `tests/practicas-constructor.test.js` (assert `actual: false, expected: true`). Sigue fallando el 13-11 con `node --test tests/practicas-constructor.test.js tests/practicas-ayuda-constructor.test.js` (24 pasan, 1 falla).
- Contexto: `practicas/constructor/practica.js` y `textos.js` están modificados sin commitear, y `tests/practicas-ayuda-constructor.test.js` está sin seguir. Parece trabajo en curso del «No lo sé» de `constructor`, no un fallo de `divisiones`.
- Qué hacer: quien cierre la tarea del «No lo sé» de `constructor` debe dejar este test en verde antes de comitear, o decir en su cierre si el fallo es previo.
- No lo he tocado: no es de mis archivos.
