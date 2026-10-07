# Entrega — Tarea 02: Semáforo de divisibilidad

Commit: `1b2d1a4`

## Ficheros
- `practicas/semaforo/index.html`, `practica.js`, `logica.js`, `textos.js`, `estilos.css` (vacío, copiado de la plantilla)
- `tests/practicas-semaforo.test.js`

## Qué tiene
Cuatro ejercicios:
1. Semáforo básico (2, 3, 5, 9, 10): U2-1C-05, 06, 07.
2. Con el 11 (añade el sexto botón): U2-1C-08.
3. Criterios compuestos (6, 15, 22, 30, 33) y la trampa «divisible entre 4 y 6, ¿entre 24?» (20 % de los ítems): U2-1C-09.
4. La cifra que falta (3 o 4 cifras, divisor simple o compuesto, cifra única garantizada): U2-1C-10.

Destrezas: U2-1C-05 a U2-1C-10. Errores que ataca: criterio del 3 por la última cifra,
«múltiplo de 3 luego de 9», «suma de cifras» para el 5, y la trampa del 4/6/24.

## Cómo probarlo en 1 minuto
```
npm run servir
```
Abrir http://localhost:8080/practicas/semaforo/ → «Probar sin código» → cualquier ejercicio.
Probado en 375 px y en 1024 px, en español e inglés, con Chrome headless (puppeteer-core
instalado fuera del repositorio, como indica la trampa de la ficha 01): los cuatro
ejercicios cargan, aciertan y fallan sin errores de consola.

## Tests
`node --test tests/practicas-comun.test.js tests/practicas-semaforo.test.js` → 46 tests, 0 fallos.
Incluye 3000 ítems por ejercicio con comprobación independiente (`n % d === 0` escrito aparte,
no importado de `aritmetica.js`), cuotas de variedad, la trampa, la unicidad de la cifra que
falta y la regla de oro (ninguna respuesta pasa del 70 %).

## Para la tarea 18
Pide poner `disponible: true` en el catálogo para `semaforo` (id 1).

## Propuestas
Ninguna: el contrato de la base (01) cubrió todo lo necesario sin cambios.
