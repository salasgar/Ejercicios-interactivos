# ENTREGA tarea 212: práctica `razones` («Razones y proporciones»)

Sesión s-20261119T191939-f09e9b6e · commit del código **8d02667** · 19-11-2026.

## Ficheros
practicas/razones/{logica.js, textos.js, practica.js, estilos.css, reserva.js, index.html} · tests/practicas-razones.test.js (11 pruebas, 3000 ítems por ejercicio) · tests/practicas-ayuda-razones.test.js (4 pruebas, 1200 ítems por ejercicio y idioma). `npm test`: 2555/2555.

## Ejercicios (ids de la propuesta sin F0: U7-1A-06, U7-1C-01..05; la 227 los comprueba)
1. **La razón**: parte-parte o parte-todo, 4 fracciones. Errores: invertir-razon, parte-parte-como-parte-todo, parte-todo-como-parte-parte, otra-parte-sobre-el-total. 6 contextos.
2. **Equivalentes y la más sencilla**: (a) elegir la equivalente (suma-mismo-numero, amplia-un-termino, razon-invertida); (b) escribir la sencilla en dos campos (sin-simplificar-del-todo, razon-invertida, razon-distinta). Con «No sé hacerlo».
3. **¿Forman proporción?**: sí/no con `espera:'boton'`, ~50 % «sí», ≥ 1/3 de los «sí» sin término múltiplo del vecino, términos ≤ 60; «no» por suma del mismo número o término desviado.
4. **El término que falta**: `a/b = x/d` o `x/d = a/b`, x siempre arriba, solución natural 1-100, se admite 15, 15,0, 15.0 o 30/2; errores suma-en-vez-de-multiplicar, da-el-factor. Con «No sé hacerlo».

## Realismo (cotas por contexto)
Ex. 2(b): clase 4-30, azúcar 50-300, bolsa 4-60, zumo 50-300, concierto 20-300, biblioteca 20-300; términos ≤ 300. Ex. 1: números de 1 a 9, primos entre sí. Un test comprueba las cotas.

## Reserva de casos de la hoja y del examen
**Vacía**: al escribirla no existían la hoja 1 ni el examen 1 de la U7. El mecanismo funciona (probado con un caso inventado, normalizado por valor: `3/4 = x/20` ≡ `x/20 = 3/4`). **La 227 debe cotejarlos** y añadir las huellas FNV-1a (nunca en claro) en `practicas/razones/reserva.js`.

## Navegador
**No probado en navegador** (no hay herramienta de navegador en el repo y la sesión es desatendida). Lo que sí se ha hecho: `import` de todo, las pruebas de lógica y ayuda, `practicas-no-lo-se` y `practicas-comun` verdes, y lectura a mano de explicaciones en ES y EN. La 227 debe mirar con clics: 375 px y ancho, ES/EN, los dos campos del ex. 2(b), el campo de texto de x en el ex. 4 y el botón «Siguiente» del ex. 3.

## Probar en 1 minuto
`npm run servir` y abrir `http://localhost:8080/practicas/razones/?probar=1`.

## Decisiones
- Las razones con denominador 1 se pintan siempre con raya (`conUno:true`): «7/1», no «7».
- La x en el denominador queda fuera hasta que el acta de la U7 la admita.
- `disponible` sigue sin tocar (tarea 227); no está en ninguna tarea semanal.

## Propuestas para `proporcion.js` (no tocado)
Una función `leerEnteroOFraccion` compartida con `leerCantidad` para campos de x sin unidad; hoy `razones` usa `leerCantidad` y descarta la unidad.

## Corrección de la reabierta (s-20261126T210403-cb37bd51, commit a304d9d, 26-11-2026)
Relevo de s-20261126T165400-c1370efb (su código sin comitear, con tests en verde salvo el de ayuda del ej. 4, heredado y completado).
1. Reserva: 70 huellas en `reserva.js` (hoja en claro, examen solo por huella); `huellaDe` cubre los cuatro ejercicios y `huellasDe` los dos modos de escribir el ej. 4. Test: ningún ítem sin huella ni reservado (3000 por ejercicio).
2. Ej. 2 (b): el acierto ya no dice «no vale lo mismo» (solo con `razon-distinta`).
3. Ej. 3 en inglés: «and» en vez de «y».
4. Ej. 1: sin 1 en los números (nada de «hay 1 … por cada», «1 son»); test sobre enunciado y feedback.
5. Ej. 4: la x también abajo (un tercio), con productos cruzados (`cruz`) en feedback, «No lo sé» y explicación; la introducción lo enseña. Decisión anterior «x abajo fuera» anulada por el acta de la U7.
No probado en navegador (sesión desatendida): la 227/228 debe mirar con clics el ej. 2 (b), el ej. 3 en inglés y el ej. 4 con la x abajo.
