# Entrega de la tarea 106 · combinadas-fracciones

Sesión s-20261028T140117-cb4e5545 (relevó a s-20261027T155241-46d70523, cuyo código sin commit se heredó y se terminó). Commit de974f8.

Ficheros: practicas/combinadas-fracciones/{index.html,estilos.css,logica.js,textos.js,practica.js}, tests/practicas-combinadas-fracciones.test.js (13 tests propios; `npm test` 1322/1322).

Ejercicios (id 54 del catálogo, sin `disponible: true`): 1 «¿Cuál primero?» (tocar la operación; vale cualquiera de las independientes), 2 «Un paso cada vez» (tocar y elegir el valor entre opciones de errores típicos con nombre; un toque o valor mal falla el ítem y la app sigue con el paso bueno), 3 «Caza el error» (tocar la línea y decir si falla el orden o el cálculo). Destrezas: jerarquía y paréntesis con fracciones y combinadas de 2-3 operaciones, con negativas en ≥ 20 % de los ítems (U4-3C-10; ids en el inventario).

Cotas fijadas (sin contexto, de tamaño): operandos con denominador 2-12 (algún natural 1-4); todo paso intermedio, por cualquier orden válido, con numerador y denominador ≤ 72 y distinto de 0; final con denominador ≤ 36; 2-3 operaciones; nada de dividir entre 0; sin potencias, decimales ni mixtos.

Probar en 1 minuto: `npm run servir`, http://localhost:8080/practicas/combinadas-fracciones/ y «Probar sin código» (no se guarda nada); español e inglés (`?idioma=en`).
Probado en navegador con clics: acierto y fallo del 1, paso a paso del 2 (toque equivocado y valores), línea y tipo del 3, en ES y EN; sin desbordamiento a 375 px (iframe de 375 px; la ventana no se pudo estrechar).

Arreglado respecto a lo heredado: ejemplos con «=» en textos.js rompían la carga; el tipo de error del ejercicio 3 se sortea una vez por ítem (antes «orden» salía al 15 %); el feedback pinta las operaciones con raya; un test exigía algo falso para «(−x) −».


## Reabierta del 28-10 (s-20261028T224655-1b5cd5bb, commit b98d111)

Destrezas con los ids de `registro.js`: U4-3A-01, 3A-02, 3C-09, 3C-10 (el ej. 3 no nombra el error, así que U4-3C-11 sobra). Arreglado: sin la opción «izquierda a derecha» en los pasos del ej. 2 (queda en los ej. 1 y 3); pista de `signo-perdido` en · y : = regla de los signos (`pistaDe`); con un natural en una suma manda `natural-al-numerador`; `derecha-a-izquierda` solo si la operación de la izquierda se podía hacer ya; el natural 1 no va detrás de · o : ni delante de ·; `natural-al-numerador` en restas solo con natural positivo. Probada en Chrome headless con clics (es/en, 375 y 1100 px), sin desbordes. Para Juan Luis: un 8 % de los ítems obliga a un m.c.m. de 49 a 72 (propuesta: cota de pasos a 36 o 48) y negativas en el 31 % de los enunciados. Sospecha no medida: lo mismo de `derecha-a-izquierda` en `jerarquia-enteros/logica.js` ~217.

## Reabierta del 30-10 (s-20261102T093616-593b8de1, commit 68297e6)

Tres casos de la hoja 3 que podían salir en cualquiera de los tres ejercicios (comparten la
primera línea de la expresión), según `hechos/reabiertas/106--s-20261030T084305-921ac985-revision.md`:
ej. 8a (1/3 + 2/3 · 3/4), ej. 8e (−1/2 + 2/3 · 3/8) y ej. 12d (1/3 + 1/2 · 2/5). Se excluyen en
claro, comparando el texto exacto que produce `rellenar` (`EXPRESIONES_HOJA`), en el único punto
por el que pasan los tres ejercicios (`hastaQueValga`).

De paso, y aunque la reabierta decía «hoy no sale ninguno», también se excluyen por huella (nunca
en claro) las 23 expresiones de examen que pedía revisar: U4-3A-01 y U4-3A-02 de
`exámenes-semanales/semana-3/casos-examen-semana3.tsv` (los seis casos de cada una) y, de los tres
modelos del examen final, los apartados 3a/3b («Step by step») y las dos cajas de «Find the
mistake» (Leo/Sara, Pablo/Marta, Hugo/Nora; la 3a del modelo 2 lleva una potencia y no puede salir
en esta práctica, así que no se incluyó). La huella es sobre el texto canónico de la expresión
(`aTextoExpresion`, igual que la clave que usa `valida`): comprobado con un guion de scratchpad que
no se comitea, pasando cada caso por el analizador real de la base para no adivinar el formato.

`node --test tests/practicas-comun.test.js tests/practicas-combinadas-fracciones.test.js`: 65/65
(dos tests nuevos: que las listas detectan de verdad un caso conocido y no marcan uno cualquiera, y
que la primera línea del ejercicio 3 nunca es uno de los casos). `npm test`: 1362/1362. Probado en
`npm run servir` con Chrome (vía claude-in-chrome), «Probar sin código»: ejercicios 1 y 3, un
acierto cada uno, ES y EN.

## Reabierta del 2-11 (s-20261102T141053-b5277421; cierra s-20261102T152008-77e362a1, commit 7b5c1e7)

`hechos/reabiertas/106--s-20261102T141053-b5277421-revision.md`. Dos casos de examen (una caja del 5b del final y un U4-3A-01) salían con
los factores o los sumandos cambiados de sitio. La clave de exclusión pasa a ser **sin orden**: el conjunto de números, el de operaciones y
el valor de la expresión (`claveSinOrden`, sobre el árbol de `analizar`). Las 23 huellas de `HUELLAS_EXAMEN_COMBINADAS` se recalculan con
ella (mismo número: 23; U4-3A-01 y U4-3A-02 de la semana 3, 12 casos, y 3a/3b y las dos cajas 5b de los modelos 1 y 2 y la recuperación del
final, menos la 3a del modelo 2, que lleva una potencia; el adaptado-A repite los del modelo 1); la lista de la hoja 3 (en claro) se compara
también por esa clave. Nunca en claro: solo huellas. `esCasoReservado` es el único punto de comprobación (no falla con ÷ 0).
**De paso:** el test heredado escribía en claro un caso de U4-3A-01 de la semana 3 (en un comentario y en un `assert`); quitado en este
commit, pero **sigue en el historial de git** (commit 68297e6): decide Juan Luis si hace falta reescribirlo.
`node --test tests/practicas-comun.test.js tests/practicas-combinadas-fracciones.test.js`: 66/66. `npm test`: 1366/1366. Sin tocar
`catalogo.js`. Sin publicar (sin publicador, mar 22-12).

## Reabierta del 6-11 (s-20261106T144236-e32305eb; cierra s-20261106T160018-570bb569, commit 373d35d)

`hechos/reabiertas/106--s-20261106T144236-e32305eb-revision.md`. `EXPRESIONES_HOJA` pasa de 3 a 11: hoja 3 ej. 8a-8e y 9a-9d, 12d y la cadena de la hoja 2 (U4-2C-04), con la clave sin orden.
En el ej. 3, `generarError` descarta el ítem si **cualquier línea con 2 o más operaciones** es un caso reservado (antes solo miraba `lineas[0]`) o si algún paso
«línea k → línea k+1» es uno de las cajas «Find the mistake» (5b) de los modelos 1 y 2 y de la recuperación del final (el adaptado-A repite la de Leo). Nuevas
`esPasoReservado`, `huellaPaso` y `HUELLAS_PASOS_EXAMEN` (14 huellas de la clave sin orden de la línea k + valor de la k+1, calculadas con un guion de scratchpad desde los cuatro
`.tex`; nunca en claro). Barrido: 5 semillas × 20000 ítems del ej. 3 (y 100000 de los ej. 1 y 2): 0 líneas, 0 pasos, 0 expresiones reservadas.
`node --test tests/practicas-comun.test.js tests/practicas-combinadas-fracciones.test.js`: 68/68. `npm test`: 1644/1644. Sin navegador (solo cambia la exclusión de ítems, no la interfaz).
Sin tocar `catalogo.js`. Sin publicar: sigue sin publicador (mar 22-12).
