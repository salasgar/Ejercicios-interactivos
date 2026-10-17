# Entrega tarea 75 · Multiplica y divide por primos

Commit: e9890fb. Ficheros: practicas/por-primos/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-por-primos.test.js, fila id 32 en practicas/_comun/catalogo.js (nEjercicios 4, unidad 2), portada.js (semana 3 + DESCRIPCION).
Además, dos ajustes de tests ajenos que la fila nueva obliga a hacer: practicas-comun.test.js (lista del catálogo y practicaPorId(32)→33 como primer id libre) y practicas-semana.test.js (16→17 prácticas de la U2 en la portada).

Ejercicios: 1 Hazlo múltiplo (U2-2C-14), 2 Hazlo divisor (U2-2C-14), 3 El múltiplo más pequeño = m.c.m. con solo · p (U2-3C-04), 4 El divisor común más grande = m.c.d. con solo : p (U2-3C-03).
Probar en 1 minuto: npm run servir → http://localhost:8080/practicas/por-primos/?ejercicio=3 (código de prueba 60, 7NPD). Si el navegador da «no está en el catálogo», recarga sin caché.
Fallos de Scratch evitados (con test): «: p» solo activo si el exponente > 0 (nunca decimales); nunca sale resuelto y el objetivo ≥ 4; «· p» se apaga si pasaría de 100 000 y los exponentes se pintan con <sup>.
Comprobar deja los cuatro estados en los primos del número final (verde, punteado, rojo tachado).
