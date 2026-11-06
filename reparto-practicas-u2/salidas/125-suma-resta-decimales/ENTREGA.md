# Entrega de la tarea 125 · Suma y resta decimales (`suma-resta-decimales`, id 59)

Sesión `s-20261106T145557-8a485a9d`, 2026-11-06. Commit del código: **3cd03e3**.

## Ficheros

`practicas/suma-resta-decimales/{index.html, practica.js, logica.js, textos.js, estilos.css}` y `tests/practicas-suma-resta-decimales.test.js` (15 tests, 3000 ítems por ejercicio con semillas fijas, comprobados con BigInt aparte del generador).

## Ejercicios y destrezas

| Ej. | Nombre | Qué hace | Destrezas |
|---|---|---|---|
| 1 | Alinea la coma | a ± b (a veces un natural), escribir o elegir; y a ± b ± c escribiendo | U5-1C-13, 1C-14 |
| 2 | En el súper | fruta al peso (2-3 importes) y gasolina (dos repostajes, o uno con billete); total o vuelta (billete de 5, 10, 20 o 50 €) | U5-1A-01 |
| 3 | Medidas | listón, botella con dos vasos, dos personas (cuánto más), dos paquetes; escribir o elegir | U5-1A-02 |
| 4 | Mueve la coma | ·/: por 10, 100 y 1000; escribir o elegir | U5-1C-15, 1C-16 |

Errores con nombre (los de la base y los propios de `logica.js`): alinear a la derecha, sumar por separado enteros y decimales, restar la cifra pequeña de la grande, coma olvidada o corrida, céntimos sin llevar, restar al revés, dar el total en lugar de la vuelta, quitar solo un trozo, dar lo cortado, sumar en vez de restar, y los tres de mover la coma (un lugar, al revés, de más) más el cero añadido.

## Cotas de realismo (las comprueba el test)

- Fruta al peso: cada importe de 0,50 a 15,00 €, total hasta 40 €. Gasolina: cada repostaje de 6,00 a 48,00 €. La vuelta, solo con 5, 10, 20 o 50 € y el billete siempre cubre el total.
- Listón 1-3 m con trozos de 0,10 a 1,50 m (queda al menos 0,10 m). Botella de 1, 1,5 o 2 L y vasos de 0,20 a 0,33 L (quedan al menos 0,5 L). Personas 1,20-2,10 m con diferencia de 3 a 90 cm. Paquetes de 0,1 a 30 kg.
- Ej. 4: dato sin cero final, resultado con a lo sumo 4 cifras decimales.

## Casos excluidos

- **Hoja de la semana 1, en claro**: los cálculos de «Work out», los ejemplos del recuadro de apoyo, las dos estimaciones, el problema del cuaderno y el de la tabla, y los movimientos de la coma y los cambios de unidad de la hoja.
- **Examen de la semana 1 y final: no existían** (no hay `casos-examen-semana1.tsv`). `HUELLAS_EXAMEN` está vacío; las claves son `s:<cálculo>` y `m:<movimiento>` (formato en el test). **La 130 coteja y rellena.**

## Propuestas (no decididas aquí)

1. Cambios de unidad (U5-1A-04): como ítems del ejercicio 4. **No incluidos** (la ficha pide proponerlos).
2. Negativos (U5-1C-18): como ítems del ejercicio 1. No incluidos: el test dice «resultado positivo».
3. La vuelta de la fruta no lleva el peso (importe ya calculado, como pide la ficha), así que no se ve la cuenta kg · €/kg.

## Cómo probarlo en 1 minuto

`npm run servir` y http://localhost:8080/practicas/suma-resta-decimales/ → «Probar sin código». Probado en Chrome (ES y EN, ancho de 570 px, sin desplazamiento horizontal): acierto y fallo en los ejercicios 1 y 2, y fallo en el 3 y el 4. **No probado a 375 px** (la ventana no baja de 570 px).
