# Entrega de la tarea 106 · combinadas-fracciones

Sesión s-20261028T140117-cb4e5545 (relevó a s-20261027T155241-46d70523, cuyo código sin commit se heredó y se terminó). Commit de974f8.

Ficheros: practicas/combinadas-fracciones/{index.html,estilos.css,logica.js,textos.js,practica.js}, tests/practicas-combinadas-fracciones.test.js (13 tests propios; `npm test` 1322/1322).

Ejercicios (id 54 del catálogo, sin `disponible: true`): 1 «¿Cuál primero?» (tocar la operación; vale cualquiera de las independientes), 2 «Un paso cada vez» (tocar y elegir el valor entre opciones de errores típicos con nombre; un toque o valor mal falla el ítem y la app sigue con el paso bueno), 3 «Caza el error» (tocar la línea y decir si falla el orden o el cálculo). Destrezas: jerarquía y paréntesis con fracciones y combinadas de 2-3 operaciones, con negativas en ≥ 20 % de los ítems (U4-3C-10; ids en el inventario).

Cotas fijadas (sin contexto, de tamaño): operandos con denominador 2-12 (algún natural 1-4); todo paso intermedio, por cualquier orden válido, con numerador y denominador ≤ 72 y distinto de 0; final con denominador ≤ 36; 2-3 operaciones; nada de dividir entre 0; sin potencias, decimales ni mixtos.

Probar en 1 minuto: `npm run servir`, http://localhost:8080/practicas/combinadas-fracciones/ y «Probar sin código» (no se guarda nada); español e inglés (`?idioma=en`).
Probado en navegador con clics: acierto y fallo del 1, paso a paso del 2 (toque equivocado y valores), línea y tipo del 3, en ES y EN; sin desbordamiento a 375 px (iframe de 375 px; la ventana no se pudo estrechar).

Arreglado respecto a lo heredado: ejemplos con «=» en textos.js rompían la carga; el tipo de error del ejercicio 3 se sortea una vez por ítem (antes «orden» salía al 15 %); el feedback pinta las operaciones con raya; un test exigía algo falso para «(−x) −».
