# Entrega tarea 29 · Dictado de números

Commit: 15f01d9
Ficheros: practicas/dictado/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-dictado.test.js
URL local: http://localhost:8080/practicas/dictado/ (`npm run servir`; «Probar sin código»)

Ejercicios:
1. Dictado en inglés (voz en-GB; sin voz, modo lectura; teclado de botones; 40 % con ceros interiores) · 1B-01, 1B-03, 1B-04, 1B-07.
2. -teen o -ty (oído) y «cómo se escribe» (guion, decenas y teens mal escritos, plural de hundred/thousand) · 1B-08, 1B-09, 1B-21, 1B-22.
3. Fichas de palabras en español (miles, «un mil», «y» de más, sietecientos…) y dictado en español (es-ES) · 1B-17 a 1B-20, 1B-23.

Los nombres de número salen de practicas/potencias10/logica.js (import de solo lectura; tarea 28).
Probar en 1 minuto: entrar sin código, abrir cada ejercicio, acertar y fallar un ítem.
Tests: node --test tests/practicas-dictado.test.js (9, con analizadores y ortografía independientes).
No cubierto: 1B-02, 1B-05, 1B-06, 1B-10 (no se enfrenta «fourteen hundred»).

## Reabierta del 14-11 (s-20261114T211453-78365b52 · commit f03cbf2)
Feedbacks en `feedbackDictado`/`feedbackEscritura`/`feedbackFichas` (textos.js); grupos compartidos con la tarjeta (`gruposDelDictado`); punto tras «fifty = 50»; comillas del idioma.
