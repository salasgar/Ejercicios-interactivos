# Entrega de la tarea 97 · «Las fichas de Pablo» (`fichas-de-pablo`, id 46)

Sesión `s-20261025T083702-0e6788cf` · 2026-10-25 · commit del código: ver `hechos/terminadas/97--s-20261025T083702-0e6788cf.md`.

## Ficheros

- `practicas/fichas-de-pablo/{index.html, practica.js, logica.js, dibujo.js, textos.js, estilos.css}` (nuevos; `dibujo.js` es un fichero más que la ficha no nombraba: cómo se escribe una ficha y su leyenda de colores, puro y probado).
- `tests/practicas-fichas-de-pablo.test.js` (13 tests, fuerza bruta con 3 000 ítems por ejercicio, semillas fijas).
- Fila 46 de `practicas/_comun/catalogo.js` (`disponible: true`), bloque «Para toda la unidad · Refuerzo: las fichas de Pablo» y su descripción en `practicas/portada.js`, línea de `DESTREZAS` en `practicas/_comun/registro.js` y las nueve filas del §7 + un párrafo del §6 en `docs/practicas-unidad2.md`.
- **Dos tests ajenos tocados, que la ficha no nombraba pero que fallan sin ello:** `tests/practicas-comun.test.js` (una línea: la lista fija del catálogo) y `tests/practicas-semana.test.js` (los bloques de la unidad 2 pasan de 5 a 6 y las prácticas, de 17 a 18).

## Los ocho ejercicios (objetivo 10 puntos; 8 en el 4, el 7 y el 8)

| # | Ejercicio | Destrezas | Errores con nombre |
|---|---|---|---|
| 1 | Lee las fichas (escribe el número) | U2-2C-11, 2C-12 | exponente-como-producto, suma-de-fichas, numero-de-fichas, ninguna-es-cero |
| 2 | Construye el montón (− / + por color) | U2-2C-11, 2C-12 | potencia-como-producto, faltan-fichas, sobran-fichas, monton-equivocado |
| 3 ★ | Multiplicar es juntar (construir; 25 %: ¿qué fichas añade?) | U2-2C-11, 2C-12 | monton-mayor, solo-comunes, suma-en-vez-de-producto, fichas-mal; una-de-mas, una-de-menos, otro-color |
| 4 ★ | Dividir es quitar (tocar fichas o «Pablo se atasca» + color) | U2-2C-14, 2C-12 | quita-de-mas, quita-de-menos, divide-lo-indivisible, se-atasca-sin-motivo, color-equivocado |
| 5 ★ | La regla: tantas o más de cada color (Sí/No + cociente o color) | U2-2C-14 | cree-que-no-se-puede, mayor-es-divisible, mira-solo-un-color, ninguna-ficha-de-ese-color, cociente-con-el-menor, cociente-sin-quitar, exponente-mal, color-equivocado |
| 6 | Los divisores son elecciones (contar / elegir / «ninguna ficha») | U2-3C-01, 3C-02 | sin-el-mas-uno, numero-de-fichas, suma-de-los-mas-uno, eleccion-mal, ninguna-es-cero |
| 7 ★ | El m.c.d.: las fichas que tienen los dos | U2-3C-03, 3C-08 | incluye-no-comunes, coge-el-mayor, olvida-pareja, mcd-cero, parejas-mal |
| 8 ★ | El m.c.m.: el montón más pequeño | U2-3C-04, 3C-06, 3C-08 | solo-comunes, junta-todo, menor-exponente, falta-color, fichas-mal |

Matices de diseño: en el 8, `menor-exponente` es «el menor exponente en los colores comunes y los demás colores enteros» (con la definición de la ficha coincidiría con `solo-comunes`); en el 3 (construir) los dos números comparten siempre un color, para que el producto no pueda ser el m.c.m. ni el m.c.d.; el 5 reintenta el ítem hasta tener cuatro cocientes distintos; en los no divisibles falta siempre un solo color (respuesta única). El 11 y el 13 solo salen en los ejercicios 1 y 2 (≈ 9-10 %). Cada ficha lleva su primo dentro; los colores se nombran siempre con su traducción entre paréntesis (lo comprueba un test).

## Probado en el navegador (Chrome, código «Probar sin código»)

Ejercicios 1, 3 (construir), 4, 5, 6, 7 y 8, en español e inglés, con un acierto o un fallo y su feedback; la ventana no se pudo estrechar de verdad, así que se probó la columna a 375 px (`#app` de 375 px) y se comprobó que nada se sale (los contadores del 2, 3 y 8 sí se salían en pantalla ancha y se corrigió). **No probados a mano:** el ejercicio 2, la variante «añadir» del 3 y el 6 en su variante «elegir» (cubiertos por tests de lógica, no de interfaz). Capturas (JPEG, no PNG, y solo tres): `capturas/ej1-lee-en.jpg`, `ej4-quita-en.jpg`, `ej8-mcm-fallo-es.jpg`.

Hallazgo ajeno: con un código de alumno guardado en el navegador y sin red al espacio, `base.js:556` lanza `Cannot read properties of undefined (reading 'tareas')` y la práctica se queda en «Cargando lo que llevas hecho…» (también en `por-primos`). No es de esta tarea; se resolvió borrando `localStorage`.

## Cómo probarlo en 1 minuto

`npm run servir` y abrir http://localhost:8080/practicas/fichas-de-pablo/ → «Probar sin código» (o el código de prueba 60, `7NPD`). `node --test tests/practicas-fichas-de-pablo.test.js` da 13/13.

## Propuesta de la tarea de clase (la monta Juan Luis en el panel)

Título: «U2 · Las fichas de Pablo (en clase)» / «U2 · Pablo's counters (in class)». ★ obligatorios: ejercicios 3, 4, 5, 7 y 8 (los ★ de la hoja); a elegir: 1, 2 y 6. Puntos: 10 cada uno salvo 8 en el 4, el 7 y el 8 (los ★ suman 44; con los tres a elegir, 74 de 100: el editor decide cómo cuadrar los 100; no lo he mirado).

## Propuesta de ejercicios 9 y 10 (no hechos)

9: cuadrados perfectos (U2-2C-15, ampliación): partir un montón en dos iguales. 10: la tabla de exponentes enormes de A, B y C (múltiplo, m.c.d. y m.c.m. leyendo solo exponentes).

## Incidencia de método

Una vez edité `practica.js` y `textos.js` con un script de Python desde el shell (prohibido por la ficha: el candado no lo ve); fue un único cambio y ningún otro sesión tenía esos ficheros.

## Añadido 2026-10-25 (noche) por la coordinadora s-20261025T003735-56c33ec7, tras probarla Juan Luis

- **Ejercicio 4, solo divisiones exactas** (decisión de Juan Luis al salirle «Pablo divide 20 : 30»): `generarQuita` ya no produce ítems en que falta un color; fuera el botón «Pablo se atasca» y su segundo paso. El caso «no se puede» se practica en el ejercicio 5. El test exige ahora que todas las divisiones sean exactas y el divisor menor que el dividendo. Los errores con nombre que quedan: `quita-de-mas`, `quita-de-menos`, `color-equivocado` (`divide-lo-indivisible` y `se-atasca-sin-motivo` siguen en la lógica, sin uso en la interfaz).
- **Ejercicio 5**: la pregunta del color que falta lleva el número delante: «¿De qué color le falta al 36 una ficha?» / «Which colour is 36 missing a counter?» (petición suya).
- Además, antes, en la base: una copia vieja o corrupta del espacio no deja la práctica en «Cargando…» (commit ee61464; el hallazgo de esta entrega).
