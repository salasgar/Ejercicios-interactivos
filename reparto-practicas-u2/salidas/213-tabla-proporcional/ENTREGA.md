# Entrega de la tarea 213 · Tablas de proporcionalidad

Sesión `s-20261119T191941-76bd61d9`, 2026-11-19 (lanzador automático, sin nadie mirando). Commit del código: **`e4eb054`** (7 ficheros).
Práctica `practicas/tabla-proporcional/` (id 85 del catálogo, SIN publicar: `disponible: true` lo pone la 227).

## Los cuatro ejercicios
1. **¿Es proporcional?** (Sí/No). Tabla de 4 columnas, siempre con un par «doble/triple» (x_j = m · x_i). ~50 % sí; los no son
   «sumar siempre lo mismo» (números a secas), parte fija (taxi, gimnasio) y una casilla alterada. Mitad números, mitad contextos.
   Respuesta por productos cruzados de enteros. Sin «No lo sé» propio de procedimiento (texto por defecto), con explicación.
2. **Completa la tabla.** Dos huecos (uno por fila, en columnas distintas) y una columna de referencia completa. Contextos: peso/precio,
   entradas, cuadernos, arroz por persona, gasolina (km múltiplos de 100, «cada 100 km»). Acepta 7,5 / 7,50 / 7,50 € (€7.50 en EN).
   Errores con nombre: razonar-sumando, operacion-contraria. Con «No sé hacerlo».
3. **Lo que vale 1.** Frase o tabla sin la columna del 1; el alumno escribe el precio/cantidad de 1 (sin letras ni «constante»).
   Errores con nombre: dividir-al-reves, restar, multiplicar, sin-pasar-a-cada-100. Con «No sé hacerlo».
4. **¿Directamente proporcionales?** Banco fijo de 25 situaciones bilingües (13 sí, 12 no), con dos pares de números en los no. Sin
   inversas, sin porcentajes ni geometría.

## Cotas fijadas (las comprueba el test)
fruta 0,80-3,50 €/kg (1-8 kg); entradas 4-15 € (1-10); cuadernos 0,70-2,50 € (1-10); arroz 60-125 g/persona (2-12 personas, ≤ 1200 g);
coche 4-9 L/100 km (100-800 km); taxi 2-4 € de bajada + 1-2 €/km (1-20 km); gimnasio 20-30 € de alta + 15-30 €/mes (1-12 meses);
números a secas: k 2-9, y ≤ 100. Ej. 3: fruta 0,80-6 €/kg, entrada 3-60 €, cuaderno 0,50-4 €, receta 25-150 g/persona (≤ 1000 g),
coche 4-9 L/100 km; nunca la columna del 1.

## Tests
`node --test tests/practicas-comun.test.js tests/practicas-tabla-proporcional.test.js tests/practicas-ayuda-tabla-proporcional.test.js tests/practicas-no-lo-se.test.js`: 169/169.
`npm test`: 2569/2569. 3000 ítems por ejercicio, variedad ≤ 10 % por clave, 45-55 % de «sí», distractores/errores distintos de la solución.

## Destrezas (propuesta del inventario, F0 sin firmar)
U7-1C-07 (reconocer directa en una tabla), 1C-08 (situaciones no proporcionales), 1C-09 (completar la tabla), 1C-10 (precio de 1).
La 227 las comprueba antes de publicar.

## Lo que no existía al escribirla (la 227 coteja)
No había hojas de ejercicios, exámenes semanales ni acta (`inventario-unidad7-revision.md`) de la U7: no se excluyó ningún caso de hoja ni
de examen. Si salen con tablas parecidas, hay que excluirlas aquí (huella por valor, como en la U6).

## No comprobado
No se probó en navegador (no se arrancó servidor ni Chrome en esta sesión): falta mirar a 375 px y en inglés las tablas con campos,
el campo con su etiqueta («€ el kilo») y los botones Sí/No. Está probado todo lo puro y que `arrancar` carga con 4 ejercicios y «No lo sé».

## Propuestas
- Si las tablas van antes de «lo que vale 1» en el aula, el ej. 3 no pide ya la palabra «constante»; si JL la quiere, se añade en la intro.
- Contextos más (receta de otra cosa, entradas de otro sitio) se añaden en `CONTEXTOS` / `CTX_CONSTANTE` con su cota y el test los comprueba solo.
