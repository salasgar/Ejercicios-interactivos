# Entrega de la tarea 124 · Compara, ordena y redondea (`compara-decimales`, id 58)

Sesión `s-20261105T234146-c1bb832d`, 2026-11-06. Commit del código: ver la terminada (`hechos/terminadas/124--s-20261105T234146-c1bb832d.md`).

## Ficheros

`practicas/compara-decimales/{index.html, practica.js, logica.js, textos.js, estilos.css}` y `tests/practicas-compara-decimales.test.js` (13 tests; 3000 ítems por ejercicio con semillas fijas, comparando con enteros escalados escritos en el propio test).

## Ejercicios y destrezas

| Ej. | Nombre | Qué hace | Destrezas |
|---|---|---|---|
| 1 | ¿Cuál es mayor? | `<`, `=`, `>`; 40 % trampa de las cifras, 18 % normal, 12 % iguales (2,5 y 2,50: único sitio con `=`), 10 % cero en medio (2,05 y 2,5), 20 % con negativos | U5-1C-07, U5-1C-05; **U5-1C-17 propuesta** |
| 2 | Ordena | 4-5 decimales, misma parte entera, distintas cifras; creciente o decreciente; 25 % con negativos | U5-1C-08; U5-1C-17 propuesta |
| 3 | Entre dos | escribir (55 %) o elegir entre cuatro (45 %) un decimal estrictamente entre dos | U5-1C-09 |
| 4 | Redondea | a la unidad, décima o centésima; escribir (exactamente c cifras) o elegir; 25 % con 9 que arrastra | U5-1C-10, U5-1C-11 |

Errores con nombre: ids de la base (`compara-por-cifras`, `redondea-truncando`, `redondea-en-cadena`, `redondea-otro-orden`) y propios (lista en la cabecera de `logica.js`).

## Cotas de realismo
Sin contexto, solo números: parte entera 0-20, hasta 3 cifras decimales, negativos hasta −20; en «entre», extremos de 1-2 cifras.

## Casos excluidos
- **Hoja 1 (en claro):** todas las parejas, grupos (≥ 3 del mismo grupo) de comparar y ordenar, parejas de «entre» y números de redondear.
- **Examen semana 1:** al escribirla no existía `casos-examen-semana1.tsv` (solo `destrezas-semana1.md`, con ejemplos ilustrativos). Las huellas FNV-1a (`HUELLAS_*`) están **vacías y preparadas**; la clave de cada caso está documentada en `logica.js`. **La 130 tiene que cotejar** y rellenarlas.

## Decisiones / propuestas para Juan Luis
1. **Estimar (U5-1C-12): sin ítem**, como manda el acta y la ENTREGA de la 122 (la ficha se contradecía).
2. **Negativos (U5-1C-17)** dentro de los ejercicios 1 y 2, sin cambiar `nEjercicios` (4).
3. En «escribir» del ej. 4 la respuesta exige exactamente las cifras pedidas (5,4 en vez de 5,40 es un fallo con feedback propio, `cifras-distintas`), como pide la regla 1.
4. «Elegir» a la unidad usa siempre 3 cifras decimales (con menos no hay tres distractores distintos).

## Probarlo en 1 minuto
`node --test tests/practicas-comun.test.js tests/practicas-compara-decimales.test.js`; en el navegador `npm run servir` y http://localhost:8080/practicas/compara-decimales/ → «Probar sin código» (`?ejercicio=N`). Probado en Chrome en ES y EN, ventana ancha, con un fallo en los ejercicios 1, 2 y 4 y un vistazo al 3; no probado a 375 px.
