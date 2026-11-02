# Entrega de la tarea 104 · Suma y resta (suma-resta)

Sesión `s-20261102T093653-1cf72a2f`, 2026-11-02. Corrige la reabierta del 30-10
(`hechos/reabiertas/104--s-20261030T081542-dab2aa98-revision.md`). Commit del código: **c41e1b3**.
Encadenada tras la tarea 103 (misma sesión).

## Qué corrige

1. **Casos de examen por huella (FNV-1a, regla nueva)**: `HUELLAS_EJ3` (ejercicio 3, clave
   `tipo|natural|n/d`) y `HUELLAS_EJ4` (ejercicio 4, clave las dos fracciones sin orden), igual
   que en la 103. Cubren `U4-2C-03` (semana 2) y el «2e» de `modelo1` y `recuperacion` del final
   (ejercicio 3); `U4-2A-01` y `U4-2A-02` (semana 2), `U4-2A-04` (semana 2) y `U4-2A-02`
   (semana 3) (ejercicio 4). Las huellas se calcularon con un guion de scratchpad (no
   comiteado); ningún caso en claro entra en el repositorio.
2. **Casos de la hoja 2 (en claro) añadidos a `RESERVADOS`**: `mismo` (3/11+5/11, 3/10+9/10),
   `pasos` (2/5+1/4, 1/2+2/7, 4/5−1/6, 3/4+5/6, 9/10−2/5) y una lista nueva `RESERVADOS.naturales`
   (2+3/5, 1−4/7, 2/9−1) con su detector `esReservadoNaturales`, conectado a `generarNaturales`
   (el ejercicio 3 no comprobaba ningún caso reservado hasta ahora).
3. **«l.c.m.» → «LCM» en el texto inglés** (`textos.js`, 7 sitios): en inglés es LCM, como en el
   resto de la app; el español («m.c.m.») no se toca.

## Pendiente (no es de esta reabierta, se deja anotado)

- La ficha menciona «revisar, aunque hoy no salga ninguno» los casos `U4-2C-01/02/04` de las
  semanas 2-3 (ejercicios 1 y 2) y el «2c» de los tres modelos del final. No han salido en los
  3000 ítems de prueba de cada ejercicio y no se han añadido huellas para ellos: si en el futuro
  aparecen, hace falta una reabierta nueva.
- Las propuestas de la entrega anterior (U4-2C-04 completa; el caso «2 + 1/3 = 3/4» como error
  propio del ejercicio 3) siguen pendientes.

## Ficheros
`practicas/suma-resta/{logica.js,textos.js}` (no se tocó `index.html`, `practica.js`, `campo.js`
ni `estilos.css`) y `tests/practicas-suma-resta.test.js` (61 tests; uno nuevo: huellas de
examen, sobre 3000 ítems con semilla fija).

## Probarlo en 1 minuto
`node --test tests/practicas-comun.test.js tests/practicas-suma-resta.test.js` (61/61) y
`npm test` (1362/1362). En el navegador (`npm run servir` →
http://localhost:8080/practicas/suma-resta/ → «Probar sin código»): ejercicio 3 con un ítem
acertado (3 − 1/4 = 11/4, 4 + 3/4 = 19/4) y ejercicio 4 fallando a propósito (1/2 y 2/5: queda
1/10, se comprobó la opción «9/10»).
