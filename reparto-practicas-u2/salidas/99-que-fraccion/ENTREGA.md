# Entrega de la tarea 99 · «¿Qué fracción es?» (`que-fraccion`, id 47)

Sesión `s-20261027T082738-14ce7cde`, 2026-10-27. Commit del código: **dc36d80**.

## Ficheros
`practicas/que-fraccion/{index.html,practica.js,logica.js,textos.js,estilos.css}` y `tests/practicas-que-fraccion.test.js` (13 tests, 3000 ítems por ejercicio con semillas fijas).

## Ejercicios y destrezas
| # | Ejercicio | Destrezas |
|---|---|---|
| 1 | Lee la figura (barra, pizza, cuadrícula; escribir arriba y abajo; ¼ de impropias en 1-2 figuras, 6/6 incluida; mitad «cuenta las partes, no simplifiques», mitad «vale una equivalente») | U4-1C-01, 1C-02, 1C-05 |
| 2 | Sombrea la fracción (figura con n·m partes; vale cualquier posición, cuenta la cantidad) | U4-1C-01, 1C-03 |
| 3 | De la frase a la fracción (5 contextos; 60 % elegir entre 4, 40 % escribir; sin simplificar, una equivalente vale al escribir y se avisa) | U4-1C-04 |
| 4 | Léela (fracción→lectura y lectura→fracción; 1/3 de ítems 1/2, 1/4, 3/4) | U4-1B-02, 1B-03 |

## Cotas de realismo (las comprueba el test)
Clase 12-36 alumnos (gafas, bici); tarta 3-15 trozos; equipo 11-25; caja 6-24. La parte de cada contexto va en una fracción creíble del total (`frac`), nunca la mitad exacta (sería equivalente a su resto).

## Decisiones a revisar (propuestas)
- **Ej. 4 en el idioma del ítem**: la ficha dice «cuatro lecturas en inglés», pero 1B-03 (leer en español) está asignada a esta práctica en la tabla de la 98. El generador usa `sesion.idioma`: ítems en inglés (three fifths) o en español (tres quintos).
- Ej. 3: la ficha decía «elegir o escribir»; salen las dos (60/40).
- Los campos de la fracción son dos (arriba y abajo, con la raya) y no un texto «3/5»: en el móvil el teclado numérico no tiene barra. Se lee con `fraccion(a, b)` (la `leerFraccion` de la base no hace falta).
- Errores propios (no están en `ERRORES_TIPICOS`): `terminos-al-reves`, `cuenta-todas-las-partes`, `simplificada-sin-pedirlo`, `solo-el-numerador`, `sombrea-el-resto`, `la-parte-que-falta`, `lee-con-cardinales`, `ordinal-en-el-numerador`, `otro-denominador`, `otro-numerador`, `otra-fraccion`, `otra-cantidad`. El 107 puede reutilizarlos.
- Fuera de ejemplos y de los casos reservados del reparto de la U4: no salen 9/11 (lectura), 13/13, 17/5, 8 de 20 con gafas ni 12 de 30.

## Cómo probarlo en 1 minuto
`npm run servir` y http://localhost:8080/practicas/que-fraccion/ → «Probar sin código» (o el 60, `7NPD`) → `?ejercicio=1..4`. Probada en navegador a 420 px en español e inglés: acierto y fallo en los cuatro ejercicios (feedback con los números del ítem). No sale en la portada (`disponible: false`).
