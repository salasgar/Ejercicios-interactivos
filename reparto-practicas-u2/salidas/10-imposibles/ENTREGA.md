# Entrega — Tarea 10: Detector de imposibles

Commit: `7b2a9f3`

Ficheros entregados:
- `practicas/imposibles/{index.html,practica.js,logica.js,textos.js,estilos.css}`
- `tests/practicas-imposibles.test.js`

URL local: `http://localhost:8080/practicas/imposibles/` (servidor: `npm run servir`)

## Qué tiene

Tres ejercicios, catálogo id 9, slug `imposibles`:

1. **¿Puede ser?** — V/F sobre un m.c.d./m.c.m. propuesto. Mitad de los ítems cumplen
   (propuesto = valor real), mitad violan una desigualdad real (m.c.d. > menor dato,
   m.c.m. < mayor dato, o m.c.d. = 0). Un 30 % en contexto (grupos iguales / coincidencias
   periódicas) con la misma lógica. Destrezas U2-3C-10, U2-4C-03.
2. **La comprobación del producto** — g · m frente a a · b, con g y m etiquetados GCD y
   LCM (a veces uno de los dos está mal). Un 20 % de los ítems usan tres números para
   mostrar que la comprobación no vale con tres (ejemplo fijo: m.c.d.(2,4,8)·m.c.m.(2,4,8)
   = 16 ≠ 64). Destreza U2-3C-11.
3. **Nómbralo** — mini-problema (banco de 12, 6 m.c.d. + 6 m.c.m., bilingüe) donde hay que
   elegir, entre cuatro expresiones (GCD/LCM/producto con los datos del ítem), la que
   nombra el resultado ya calculado. Las cuatro tienen valores distintos por construcción
   (se regenera el ítem si no se puede garantizar). Destreza U2-1A-04.

## Cómo probarlo en 1 minuto

`npm run servir`, abrir `http://localhost:8080/practicas/imposibles/`, «Probar sin
código», entrar en cualquier ejercicio y responder un ítem.

## Tests

`node --test tests/practicas-comun.test.js tests/practicas-imposibles.test.js`: 11 tests
propios en verde (46 con los de la base), por fuerza bruta contra definiciones de
m.c.d./m.c.m. independientes de `aritmetica.js` (no se reutiliza la implementación).

Probado también en el navegador con `puppeteer-core` (Chrome del sistema, peticiones a
Firestore cortadas): menú, los tres ejercicios, acertando y fallando, en español e
inglés, en 375 px y en 1280 px. Sin errores de consola.

## Propuestas pendientes

- Pide a la tarea 18 que ponga `disponible: true` para `imposibles` en el catálogo.
- Ningún cambio del contrato de la base.

## Reabierta del 14-11 (sesión s-20261114T210553-2c36437d, commit 06f266b)
- Feedback de tres números = el de la tarjeta (reutiliza `TX.ayuda.cuentaTres`): «la comprobación no vale: a veces coincide y a veces no» + la cuenta del ítem. Fuera el ejemplo fijo 2, 4, 8 y la regla falsa.
- `generarTres`: se enumeran los tríos de 3..10 con números distintos y g·m ≠ a·b·c (246) y se sortea; sin bucle ni tope. Test sobre 5000 ítems.
- Ej. 1 con contexto de m.c.d.: se sortea de las 108 parejas de 3..20 con m.c.d. ≥ 2 (54 sin orden); en 20000 ítems la más repetida es el 2,6 % de los ítems de ese tipo. Sin contexto sigue saliendo el m.c.d. 1 (test). Contexto de m.c.m., sin cambios.
- Realismo repasado: contextos con a, b en 3..20 (grupos de 1 a 10; autobuses y luces cada 3 a 20 min o s, coincidencia hasta 380); propuestos «No» en 1..40 grupos, creíbles como pregunta. No hace falta cota nueva.
- «<» y «>» de `feedbackPuede` pasan a palabras («72 es mayor que 24»); sin más «<» sueltos (test sobre 3000 ítems).
- Hash de 300 ítems por ejercicio (semilla por ítem, antes/después): iguales ej. 3, ej. 2 de dos números, ej. 1 sin contexto y ej. 1 con contexto de m.c.m.; cambian solo ej. 1 con contexto m.c.d. y ej. 2 de tres números, como se pedía. La práctica no tiene casos de examen excluidos (no había nada que quitar).
- npm test 2301/2301. Navegador a 375 px: ej. 2 (fallo, en inglés) y el feedback nuevo renderizado; no hice los clics en los dos idiomas de cada ejercicio ni a 1200 px. Tras el push, la URL publicada responde 200.
