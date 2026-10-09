# Entrega tarea 16 — Operar con factorizaciones

Sesión s-20261007T212934-840982ce · commit d02332e

Ficheros: practicas/factorizaciones/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-factorizaciones.test.js

URL local: `npm run servir` y http://localhost:8080/practicas/factorizaciones/

Ejercicios (destrezas U2-2C-14, 2C-11, 2C-12; prepara U2-3C-03/04):
1. El producto: steppers con tope = suma de exponentes; feedback por primo.
2. ¿Es múltiplo?: Sí/No; si es sí y es verdad, segunda parte (construir a:b). Los «no» señalan el primo que falla.
3. El cociente: 10 % a = b, 20 % un primo desaparece, 20 % un primo pasa entero.

Probar en 1 minuto: entrar con «Probar sin código», abrir cada ejercicio y acertar/fallar uno.

Petición a la tarea 18: poner `disponible: true` para `factorizaciones` en catalogo.js.

## Reabierta (2026-10-08, sesión s-20261008T180351-55d4decb) — commit `b5a878e`

Corregidos los cuatro puntos de `hechos/reabiertas/16--s-20261008T051928-1cba9950.md`: (1) las frases del feedback ya no van en `.cuenta` (se parten en 375 px; solo las cuentas cortas); (2) sin igualdad repetida («56 ÷ 28 = 2», no «= 2 = 2»), sin espacio antes del punto y con ÷ en inglés; (3) con todos los exponentes a 0 la pantalla enseña «1», no «□»; (4) en los «no» del ejercicio 2, b < a (y ≤ 10000).
Commit: 2dbb223 (reabierta del 9-10): puntuación del feedback.
