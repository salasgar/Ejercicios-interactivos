# Entrega de la tarea 107 · errores4 («Caza el error», unidad 4)

Sesión s-20261028T175707-8523c0a8 (relevó a s-20261028T140139-2d3c242b y s-20261027T155250-47ffa5fc; no dejaron código, solo el esqueleto de la 98). Commit 7430dfc.

Ficheros: practicas/errores4/{index.html,estilos.css,campo.js,logica.js,textos.js,practica.js}, tests/practicas-errores4.test.js (12 tests propios; `npm test` 1334/1334). `campo.js` es una copia reducida de `campoFraccion` de suma-resta (la ficha pide copiar, no tocar otras prácticas).

Ejercicios (id 55, sin `disponible: true`): 1 «¿Bien o mal?» (igualdad o comparación; si es falsa, elegir entre tres nombres de error; mitad verdaderas, una de cada cinco una comparación), 2 «La línea mala» (cálculo de 3 líneas con una falsa, la 2 o la 3), 3 «Arréglalo» (se ve la igualdad falsa y se escribe el resultado bien, irreducible; casilla de natural para «fracción de una cantidad», dos casillas con «+/−» para el resto). Errores (12 plantillas + 3 de comparar): suma-arriba-y-abajo, signo-perdido (resultado negativo), suma-multiplicando-denominadores, simplifica-solo-numerador/denominador, se-queda-en-la-unitaria, multiplica-por-el-denominador, fraccion-de-al-reves, invierte-la-primera, no-invierte, invierte-las-dos, eleva-solo-el-numerador; y compara-solo-numeradores/denominadores e ignora-el-signo (solo ejercicio 1). Destrezas: U4-3C-09, 3C-11 y 3C-12 (esta, solo en las explicaciones y la introducción; ningún ítem es «no es error»: ver propuesta).

Cotas fijadas (sin contexto, de tamaño): operandos propios con denominador 2-8 (comparar 3-8); simplificar con m.c.d. 4, 6, 9, 10 o 12 y términos ≤ 90; «fracción de» con denominador ≤ 10, cantidad múltiplo del denominador entre 2·d y 120 (multiplica-por-el-denominador, ≤ 60 y resultado ≤ 600); potencias de base propia con numerador ≥ 2, exponente 2 (80 %) o 3; ningún número de una línea > 600; ni decimales ni mixtos ni letras.

Probar en 1 minuto: `npm run servir`, http://localhost:8080/practicas/errores4/ y «Probar sin código» (el código 7NPD no entra sin red/registro); `?ejercicio=1`, `2`, `3`; `?idioma=en`.
Probado en navegador con clics: ej. 1 (comparación falsa, nombre mal elegido, feedback), ej. 2 (fallo, feedback) y ej. 3 (acierto con casilla natural, en inglés); sin errores de consola. NO probado a 375 px (la ventana no se pudo estrechar) ni el «+/−» de la fracción con dos casillas.
