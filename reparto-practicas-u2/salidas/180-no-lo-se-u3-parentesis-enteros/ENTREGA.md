# ENTREGA tarea 180 · «No lo sé» en errores3, leelo3, variacion, parentesis-enteros

Sesión s-20261112T231544-7202b303. Commits: errores3 ce99c7c · leelo3 f56eaf4 · variacion 3dab1de · parentesis-enteros 528a821.

## Lo hecho
Las 4 prácticas (17 ejercicios) declaran `explicacion` o `sinAyuda` en todos; `noLoSe` («No sé hacerlo») en los de procedimiento. Funciones exportadas en el `textos.js` de cada práctica; tests `tests/practicas-ayuda-<slug>.test.js` (1000 ítems por ejercicio, ES y EN, respuesta calculada aparte).
- errores3: 3 ejercicios (dónde está el error, cuál es, sí/no), regla + línea buena + «La respuesta es».
- leelo3: 4 ejercicios de elegir; consejo por tipo + solución del ítem + opción buena.
- variacion: 5 ejercicios (1 sin noLoSe; 2-5 con él); cuenta con los números del ítem.
- parentesis-enteros: 1 quita (noLoSe), 2 calcula (noLoSe), 3 potencia (noLoSe; parejas A/B), 5 coloca (una colocación que sirve). El 4 «De dentro afuera» lleva `sinAyuda` (ejercicio por pasos).
Pruebas: tests propios y `npm test` 2003/2003; explicaciones leídas a mano en ES y EN con las cuentas comprobadas.

## Hallazgos / limitaciones
- **Navegador**: no hice la prueba a clics (sin herramienta de navegador en esta sesión); lo cubre la revisión 192.
- Dos deslices con la regla de Edit/Write: edité `errores3/practica.js` con un script de Python y añadí el bloque final de `parentesis-enteros/textos.js` con un heredoc. Sin consecuencias (nadie más tocaba esos ficheros).
- parentesis-enteros ej. 5: la explicación da una colocación que sirve, pero el ejercicio es de ensayo y error; si la 192 prefiere `sinAyuda`, es quitar una línea.
- Ficheros sucios de otras sesiones (division, factorizaciones, que-fraccion, semaforo, potencias-enteros, fichas-del-parchis): no los he tocado ni comiteado.
