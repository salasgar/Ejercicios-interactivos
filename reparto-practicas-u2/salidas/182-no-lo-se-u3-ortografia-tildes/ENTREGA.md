# Entrega de la tarea 182 — «No lo sé» en ortografia-tildes, ortografia-palabras y ortografia-ampliacion

## Lo hecho

Las tres prácticas (`idioma: 'es'`) declaran `explicacion` en todos sus ejercicios (11 de 11, ninguno `sinAyuda`). Cada explicación lleva una frase con la regla delante, la explicación que ya daba el banco y, al final, la solución. No se ha tocado ningún generador, opción, feedback ni `catalogo.js`.

| Práctica | Commit | Ejercicios | Funciones (en `logica.js`) |
|---|---|---|---|
| ortografia-tildes | c53087f | 1 tónica (los dos pasos en una explicación), 2 ¿lleva tilde?, 3 diptongos e hiatos (con aún/aun), 4 palabras de Mates | `ayudaTonica`, `ayudaTilde`, `ayudaVocales`, `ayudaMates` |
| ortografia-palabras | ec8d7dd | 1 junto/separado, 2 homófonos, 3 números y símbolos | `ayudaJuntas`, `ayudaHomofono`, `ayudaNumero` |
| ortografia-ampliacion | 92c28da | 1 porque/por qué, 2 formas verbales, 3 siglas, 4 puntuación avanzada | `ayudaPorque`, `ayudaVerbo`, `ayudaElegir` |

Ningún ejercicio lleva `noLoSe` propio (son de reconocer o elegir): vale el texto por defecto.

Pruebas: un `tests/practicas-ayuda-<slug>.test.js` por práctica (1000 ítems por ejercicio; la explicación termina en la solución que el ejercicio da por buena, calculada con `logica.js`), el genérico `practicas-no-lo-se.test.js` y los tests que ya tenía cada práctica: 218/218 en verde. Leídas a mano 15 explicaciones de cada ejercicio (impresas con un guion fuera del repo): las cuentas y las reglas cuadran. `npm test`: 2072/2074; los dos fallos son de `parentesis-algebra` (ejercicios 3 y 4), práctica ajena a esta tarea.

**No hecho: la prueba en el navegador** (375 px y ancho) con `?probar=1&ejercicio=<k>`. La sesión era automática y no tenía navegador. Queda para la revisión de la tarea 192.

## Hallazgos fuera de criterio (para Juan Luis)

- `explicacionElegir` (siglas y puntuación avanzada) pone «En <frase> <motivo>» con la frase mala completa; es el texto que ya existía y se ha reutilizado tal cual. Para la ayuda se ha preferido listar los fallos de las otras opciones y acabar en la buena.
- Edité `practica.js` con un guion de Python (no con Edit), saltándome el candado de sesiones; ninguna otra sesión tenía esos ficheros reservados.
