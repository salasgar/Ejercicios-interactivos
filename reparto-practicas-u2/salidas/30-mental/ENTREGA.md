# Entrega · tarea 30 · Cálculo mental con estrategia

Sesión: s-20261007T214832-8296db7c · commit: 0c0e437

Ficheros: practicas/mental/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-mental.test.js.
URL local: http://localhost:8080/practicas/mental/ (npm run servir).

Ejercicios:
1. Compensar (2C-20, 2C-21, 2C-30): tres pasos (redondeo, ajuste, resultado); sumas con 98/99/199 y 30 % de productos con 99/98; ajustes fijos «− n» / «− 1» / «− 100».
2. Descomponer (2C-22): tres opciones (producto cómodo, suma 10 + …, y una que no reconstruye, p. ej. 10 · 2 = 20); se ejecuta y se teclea el resultado.
3. ¿Qué conviene? (2C-23, 2C-24, 2C-31, 2B-21, 2B-22): compensar / descomponer / lápiz y papel (+ calculadora en el 20 %); solo falla la no aplicable; 40 % con problema corto.

Probar en 1 minuto: abrir la URL, «Probar sin código», un ítem de cada ejercicio.
Probado en el navegador: ejercicios 1, 2 y 3 (acierto y fallo); sin capturas (el renderer dio timeout), solo por DOM; ancho de 375 px sin revisar.
Tests: 13 propios en verde.

Decisiones y avisos (ver terminada): regla de «descomponer» ampliada a «factor compuesto»; «lápiz y papel» siempre vale, así que se puede ganar pulsándolo siempre.
