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

## Reapertura (sesión s-20261008T175110-97bf1924, commit dcc3821, catálogo publicado en 2128eb6)

Corregido todo lo de hechos/reabiertas/30--s-20261008T051928-1cba9950.md: (1) «compenso» vale con cualquier término acabado en 8 o 9 (redondeo a la decena) y las cuentas donde es falso usan solo términos acabados en 0, 3-7 y sumas que no dan decena exacta; (2) «la más corta es descomponer» solo si lleva a un producto por 10 o 100; (3) textos en inglés («two 25s», «calculation»); (4) mensaje «la otra» reescrito; lápiz y papel con atajo → pistas: 1 (opción a); móvil: cadenas partidas por los «=». Tests propios: 17.
