# Entrega de la tarea 101 · «Simplifica» (`simplifica`, id 49)

Sesión `s-20261027T082741-1507bbb1`, 2026-10-27. Commit del código: **36eba0d**.

## Ficheros
`practicas/simplifica/{index.html,practica.js,logica.js,textos.js,estilos.css}` y `tests/practicas-simplifica.test.js` (13 tests, 3000 ítems por ejercicio).

## Ejercicios y destrezas
| Ej. | Nombre | Destrezas |
|---|---|---|
| 1 | Paso a paso | U4-1C-13, U4-1C-15 (reconocer cuándo pararse), U4-1C-22 (30 % negativas) |
| 2 | ¿Irreducible? | U4-1C-15, U4-1C-22 (una negativa en ~50 % de los ítems) |
| 3 | De una vez | U4-1C-14, U4-1C-22 (30 % negativas; un tercio con m.c.d. 1) |

## Cotas de realismo (sin contexto, solo números)
Términos de 1 a 100 (ej. 2: hasta 99). Ej. 1: m.c.d. solo con primos 2, 3, 5, 7 (los botones), fracciones propias. Ej. 3: m.c.d. de 2 a 25.

## Decisiones
- Ej. 1: cada intento malo (dividir entre algo que no divide a los dos, o «Es irreducible» antes de tiempo) cuenta como fallo y se explica con los números; el ítem es acierto solo sin fallos.
- Ej. 3: el signo menos se pone con un botón «−» y la fracción son dos campos (el teclado numérico del móvil no tiene «/» ni «−»). Solo es acierto con m.c.d. y fracción bien.
- Errores registrados: los de la 98 (`simplifica-a-medias`, `simplifica-solo-numerador/denominador`, `signo-perdido-al-simplificar`) y propios: `no-divide-a-los-dos`, `cree-irreducible`, `cree-irreducible-si-impares`, `cree-reducible`, `signo-cambiado`, `irreducible-mal`, `mcd-no-es-el-mayor`, `mcd-mal`.
- Se usa el distractor «equivalente a medio simplificar» solo como error al corregir (`simplifica-a-medias`); ninguna opción equivale a otra (ej. 2, por valor y sin signo).

## Cómo probarlo en 1 minuto
`npm run servir` y http://localhost:8080/practicas/simplifica/ → «Probar sin código» (el 60 / 7NPD no fue aceptado al probar: mirar si sigue siendo válido). Probado en navegador: ej. 1 (fallo y acierto), 2 y 3 (fallo) en inglés a ancho normal y estrecho; el español comparte los textos con tests.

## Propuestas
- Ninguna sobre catálogo. La práctica sigue `disponible: false`.
