# Entrega — Tarea 04: Múltiplos y divisores en la recta numérica

Commit: `a980c20`

## Ficheros
- `practicas/recta/index.html`, `practica.js`, `logica.js`, `textos.js`, `estilos.css` (copiado de la plantilla)
- `tests/practicas-recta.test.js`

## Qué tiene
Tres ejercicios:
1. Marca los múltiplos de n (3 a 12) en una recta de 0 a 60, con el 0 incluido.
2. Marca los divisores de n (12, 16, 18, 20, 24, 28, 30) en una recta de 0 a n+4, sin el 0.
3. Verdadero o falso: ocho frases fijas (1 divisor de todo, 0 múltiplo de todo, no se
   puede dividir entre 0, un número es múltiplo y divisor de sí mismo, los múltiplos no
   se acaban y los divisores sí) más frases con dos números relacionados o no (y el par
   al revés, U2-1C-02).

Destrezas: U2-1C-02, U2-1C-03, U2-1C-04.

## Decisión de diseño (trampa de la ficha, resuelta)
La recta de 0 a 60 se pinta en filas de 10 (como una tabla de centenas): en 375 px da
celdas de ~28,7 px, justo el mínimo tocable, sin desplazamiento horizontal. Reutiliza
`.rejilla`/`.rejilla__celda` de `_comun/estilos.css`. Lo mismo para la recta más corta
del ejercicio 2.

## Cómo probarlo en 1 minuto
```
npm run servir
```
http://localhost:8080/practicas/recta/ → «Probar sin código» → cualquier ejercicio.
Probado con Chrome headless (puppeteer-core fuera del repositorio) en 375 px y 1024 px,
español e inglés: siete filas de 10 celdas en el ejercicio 1, sin scroll horizontal, sin
errores de consola, acierto y fallo en los tres ejercicios.

## Tests
`node --test tests/practicas-comun.test.js tests/practicas-recta.test.js` → 44 tests, 0
fallos. 3000 ítems por ejercicio con comprobación independiente de `aritmetica.js`,
cuota de V/F entre 35 % y 65 %, y la verificación de que ninguna frase usa 0 como
divisor o como "múltiplo de" (solo como sujeto: «0 es múltiplo de n» / «0 es divisor de n»).
`npm test` completo: 278/278 (incluye el trabajo de otras tareas en curso).

## Para la tarea 18
Pide poner `disponible: true` en el catálogo para `recta` (id 3).

## Propuestas
Ninguna.
