# Entrega — Tarea 08: Fábrica de divisores

Commit: `c180f14`

Ficheros entregados:
- `practicas/fabrica/{index.html,practica.js,logica.js,textos.js,estilos.css}`
- `tests/practicas-fabrica.test.js`

URL local: `http://localhost:8080/practicas/fabrica/` (servidor: `npm run servir`)

## Qué tiene

Catálogo id 7, slug `fabrica`, 3 ejercicios:

1. **Construye el divisor** — steppers por cada primo de n (tope = su exponente en n)
   hasta formar el divisor objetivo; feedback con la cláusula de cada primo. Un ~10 %
   pide el 1 (todo a cero) y otro ~10 % pide el propio n. Destreza U2-3C-01.
2. **¿Cuántos divisores tiene?** — teclado numérico propio (0-9 + borrar), el alumno
   escribe ∏(e+1). Si escribe ∏e (sin sumar 1), mensaje específico sobre ese error. Tras
   acertar, un 50 % de las veces se premia con la lista ordenada de divisores. Destreza
   U2-3C-02.
3. **Sin dividir** — ¿es n divisible entre d?, mirando los exponentes de la
   factorización (sin calcular la división). La mitad de los ítems viola la condición
   por un exponente demasiado alto o por un primo que no está en n. Destreza U2-2C-14.

## Cómo probarlo en 1 minuto

`npm run servir`, abrir `http://localhost:8080/practicas/fabrica/`, «Probar sin
código», entrar en cualquier ejercicio y responder un ítem.

## Tests

`node --test tests/practicas-comun.test.js tests/practicas-fabrica.test.js`: 7 tests
propios en verde (46 con los de la base), por fuerza bruta (división directa n % d,
recuento de divisores por fuerza bruta), independientes de `aritmetica.js`. `npm test`
completo: 351 tests, todos en verde.

Probado en el navegador con `puppeteer-core` (Chrome del sistema, Firestore cortado):
los tres ejercicios, en español e inglés, en 375 px y en 1280 px, acertando y fallando.
Sin errores de consola.

## Propuestas pendientes

- Pide a la tarea 18 que ponga `disponible: true` para `fabrica` en el catálogo.
- Ningún cambio del contrato de la base.
