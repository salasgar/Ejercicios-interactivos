# Entrega · tarea 56 · botones de números, cuatro estados

Commit: c20fab4 · sesión s-20261017T082757-d15878d1

Ficheros: practicas/_comun/{estilos.css,piezas.js}, practicas/{semaforo,rectangulos}/{estilos.css,practica.js} (rectángulos: estilos.css y practica.js; semáforo igual), practicas/{constructor,baldosas}/practica.js, tests/practicas-botones.test.js (nuevo, 4 tests).

Qué hay: `claseCorreccion(pulsado, correcto)` en piezas.js; reglas bien/falta/mal en el CSS común (después de [aria-pressed] y :disabled, con button); copias de semáforo y rectángulos quitadas (las de .ninguno se quedan).
Semáforo ej. 4: si falla, la solución sale con borde de puntos (antes, rellena). Constructor ej. 2: ficha correcta sin pulsar pasa a «falta». Baldosas: el m.c.d. no elegido sale con borde de puntos.

SIN prueba en navegador (la hizo solo npm test: 784 en verde). Cómo probarlo en 2 minutos (npm run servir, http://localhost:8080/practicas/<slug>/, recarga forzada por la caché de Pages): semaforo ej. 1 con dos botones pulsados uno bueno y otro malo; semaforo ej. 4 fallando; rectangulos ej. 2; constructor ej. 2 (tipo a_suma); baldosas eligiendo un lado que no es el m.c.d.
