# Entrega tarea 19 · Coloca los paréntesis
Commit: e902014 · sesión s-20261007T212734-78b63f57
Ficheros: practicas/parentesis/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-parentesis.test.js
URL local: npm run servir → http://localhost:8080/practicas/parentesis/
Ejercicios: 1 tres números (2 resultados) · 2 tres números con ² o ³ (4-5 resultados) · 3 cuatro números con resta/división (hay agrupaciones imposibles) · 4 diana (contador por defecto).
Destrezas: 1A-10, 1A-11, 1A-12, 2A-07, 2A-08, 2A-13 (de rebote 1A-14, 1A-15).
Probar en 1 minuto: entrar sin código, ejercicio 3, tocar el hueco ( antes del 2.º número y ) tras el último; pulsar Pista hasta encender todos los chips.
Desviaciones de la ficha (decisión de la sesión):
- Ej. 2 usa TRES números (como el ejemplo 5+2·3²): con cuatro y exponente salen 14 agrupaciones, no 4-5 resultados.
- Ej. 1 sin exponente: con ² nunca hay exactamente 2 resultados.
- El ² solo se aplica al último número o al grupo cuyo ) lo precede; agrupaciones con ² dentro de un paréntesis no existen.
- Ej. 4 usa los parámetros por defecto de la base (10, +2), no 20/+5, tras la tarea 35.
- Razón extra de agrupación imposible: 'cero' (dividir entre 0).
Petición a la 18: disponible: true para parentesis. El menú muestra «5 aciertos · cada fallo, +0» en los ej. 1-3 (cosmético, de la base).
