# ENTREGA tarea 148 — práctica «¿Es solución?» (es-solucion, unidad 6)

Commit: 3327fcd. Ficheros: `practicas/es-solucion/{practica.js,logica.js,textos.js,estilos.css}` (el `index.html` ya existía) y `tests/practicas-es-solucion.test.js`. `disponible` sigue en `false` (lo cambia la 157).
Probar: `npm run servir` → http://localhost:8080/practicas/es-solucion/?probar=1 (sin código) → Empezar.

## Ejercicios
1. **Compruébalo**: «¿Es x = 4 solución de 3x + 2 = 14?», Sí / No. La mitad de los ítems lo son; las que no, usan un valor que sale de un error típico de resolver (transponer sin signo, pasar el factor restando, multiplicar en vez de dividir, dividir al revés, perder el signo). El feedback hace la cuenta de cada miembro con ese x y compara.
2. **¿Qué ecuación?**: dado x = s, cuatro ecuaciones y solo una se cumple. Cada falsa es una ecuación a la que un error típico le da justo s; las cuatro tienen soluciones distintas.
3. **¿Identidad o ecuación?**: `2x + 3x = 5x` frente a `x + 5 = 9`. El feedback prueba dos valores y lo ve. **Ver «Decisiones a revisar».**
4. **Inventa una**: «escribe una ecuación cuya solución sea x = 5» (a veces con «que tenga un número delante de la x»). Se corrige resolviendo lo que escribe, no comparando con una respuesta; `x = 5` tal cual y las erratas de escritura se avisan sin contar como fallo.

Destrezas: U6-2C-02 (1, 2), 2C-03 (3), 2C-04 (4); ids provisionales: F0 sin firmar.

## Decisiones a revisar
- **Ejercicio 3 (identidad)** depende del punto (f) de F0, que no está firmado. Si F0 lo rechaza: quitar el ejercicio (basta sacarlo de `ejercicios` en `practica.js`) o cambiarlo por un segundo ítem del 1.
- **«Nada que no se haya dado»**: la ficha pedía incluir paréntesis y x en los dos miembros; en los ejercicios 1, 2 y 4-ejemplos las ecuaciones llevan la x en UN miembro y sin paréntesis (los dos aún no se han dado en la semana 2). Solo el ejercicio 3 pone la x en los dos miembros, porque no se despeja: se sustituye.
- Hoja y examen de la U6, semana 2, **no existen aún**: no hay casos que excluir. `HUELLAS_RESERVADAS` (logica.js) está vacío; la 156 debe cotejar y, si hay casos, añadir sus huellas (`huellaEcuacion`) y reabrir esta tarea.
- Ejercicio 4: el alumno puede escribir ecuaciones con la x en los dos miembros o con paréntesis si él quiere; se corrige igual (solo importa la solución).

## Cotas de realismo (no hay contexto de la vida real)
|c| ≤ 60 y |valor probado| ≤ 60 en todos los ítems; coeficientes 2-9 (−2…−5 si negativo), constantes 1-12 (hasta 20 en `b − ax`); soluciones −6…12, nunca 0.

## Pruebas
12 tests propios (3000 ítems por ejercicio, evaluador propio con BigInt que lee el texto mostrado): lo que se ve se cumple o no según dice; las falsas nacen de un error nombrado; en el 2 solo una se cumple y las cuatro tienen soluciones distintas; el 3, identidades se cumplen con 51 de 51 valores y las ecuaciones con exactamente uno; el 4, 15 casos de escritura; cuentas del feedback evaluadas; sin ×, %, 1x, «+ −», x², guion por menos ni separador decimal del otro idioma. `npm test` 1727/1727.
**No probada en navegador** (sesión lanzada sin supervisión): la reviso la 157 con clics, a 375 px y ancho, ES y EN, acierto y fallo en los cuatro ejercicios. Especialmente: el aviso rojo bajo el campo del ejercicio 4 y los botones Sí/No.
