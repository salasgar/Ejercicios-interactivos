# Entrega de la tarea 183 (sesión s-20261114T113337-30cf7e80)

## Lo hecho (commit 1de989c, empujado)
- **divisores** (6 ejercicios): 1 «de/entre» → `explicaPreposicion`; 2, 3, 4 (elegir relación) → `explicaEleccion` (cuenta de cada relación verdadera, nombra las dos cuando valen «múltiplo» y «divisible»); 5 arrastrar → `explicaArrastrar` con `solucionArrastrar` (`noLoSe`: «No sé hacerlo»); 6 bichos → `sinAyuda` (juego).
- **semaforo** (4): 1 y 2 → `explicaSemaforo` (reutiliza `explicar` + regla + lista de la respuesta; `noLoSe`); 3 → `explicaSino` (primos del compuesto / trampa del 24); 4 → `explicaCifra` (`noLoSe`).
- **rectangulos** (3): 1 → `explicaRectangulos` (`noLoSe`), 2 → `explicaBanco` (`noLoSe`), 3 → `explicaParar` (hasta la raíz entera / la raíz exacta se escribe una vez).
- **recta** (3): 1 → `explicaMultiplos` (`noLoSe`), 2 → `explicaDivisores` (`noLoSe`), 3 → `explicaVF` (reutiliza `explicar`).
- Tests nuevos: `tests/practicas-ayuda-{divisores,semaforo,rectangulos,recta}.test.js` (1200 ítems por ejercicio, es/en; la solución se compara con `logica.js`). `npm test`: 2196/2196.
- Leídas a mano 4-6 explicaciones de cada ejercicio en ambos idiomas (guion en el scratchpad); corregidos «Correcto:» en la ayuda de rectángulos 3, el hueco sin preposición en divisores 1 y el 10 en la regla del semáforo.

## NO hecho: prueba en el navegador
El sistema denegó levantar `python3 -m http.server`, así que NO se ha pulsado el botón en ningún ejercicio (375 px / ancho, es/en, consola). La carga de cada `practica.js` y la validación del contrato sí pasan en `practicas-no-lo-se.test.js`. Queda para la 193 o para Juan Luis.

## Hallazgos fuera de criterio
- Ninguna decisión de `sinAyuda` fuera de «juego» (divisores 6).
- En semáforo 1-2 la lista de criterios tiene 5-6 líneas (reutiliza el feedback): más de las 3-4 de la guía.
