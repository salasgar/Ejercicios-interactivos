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

## Segunda reabierta (2-11, sesión `s-20261102T151801-c080c1cd`; commit **c013a46**)
Reabierta de la 119 (`hechos/reabiertas/104--s-20261102T141053-b5277421-revision.md`, con el añadido de la 120): el filtro comparaba
los casos de la hoja 2 solo en el orden escrito. Ahora `reservadoEn` y `esReservadoNaturales` usan una **clave sin orden** (los términos con
su signo, ordenados: «a + b» = «b + a», «n − a» = «−a + n», «a − b + c» = «c + a − b»; para los naturales, `nat+f` = `f+nat`).
`RESERVADOS` gana, en claro (la hoja ya la tienen los alumnos): ej. 1, 13/16 − 5/16 y 11/14 − 3/14; ej. 2, 7/8 + 1/12, 7/10 − 4/15, 4/9 − 1/6,
3/5 + 1/3, 5/6 + 1/3 − 1/4, 7/15 + 3/10 − 1/6, 11/18 − 5/12 + 2/9, 9/20 + 7/30 − 5/12, 4/6 + 6/10 y 15/20 − 8/12; ej. 3, 5/6 + 1 y 2 − 5/6.
Los de los ejercicios 1 y 2 se comprueban contra las dos listas. Los casos de examen entran **por huella** (`HUELLAS_SUMAS`, 32, FNV-1a de la
clave sin orden, calculadas fuera del repo): las sumas y restas de dos fracciones que muestran los exámenes semanales en U4-1A-01, 2A-02,
2A-04, 2B-01, 2B-02, 3A-02, 3C-09 y 3C-11 (la de U4-3C-11 que pedía la 120 incluida). Se comprueban en los ej. 1 y 2. Test nuevo: conmutadas y
barrido de 3 × 2000 ítems en los ej. 1-3; `RESERVADOS.pasos.length` pasa de 9 a 19.
Barrido independiente (guion de scratchpad, 3 × 20000 ítems por ejercicio contra la hoja 2, extraída del .tex, y las sumas de los tres
`casos-examen-semanaN.tsv`): 0 coincidencias con la hoja y 0 con las sumas de examen, salvo 206 con subexpresiones de U4-3A-01 («a + b · c»:
la suma no es una cuenta aparte; no cuenta). Ej. 4: la pizza de la hoja 2 sigue reservada en cualquier orden. Tests propios 60/60 y
`npm test` 1368/1368. Sin probar en navegador: el cambio es solo el filtro de ítems. No se tocó `catalogo.js`.

## Reabierta del 6-11 (sesión `s-20261106T144258-b4b550f9`, commit **4309164**)

Corrige `hechos/reabiertas/104--s-20261106T124028-694d9f2a-revision.md`. Una sola exclusión **sin orden** (términos con signo; el signo de una
fracción negativa se combina con el de la operación) aplicada en los **cinco** ejercicios:
- **Ej. 3**: `HUELLAS_EJ3` recalculadas con la clave sin orden (la de antes llevaba el tipo, y «f + n» pasaba aunque el examen escribía «n + f»); +3
  cuentas del final (`−a + n`). Un test comprueba que la huella no depende del orden.
- **Ej. 4**: la pareja {a, b} se mira como suma contra `RESERVADOS` y `HUELLAS_SUMAS` (además de las huellas de contexto de antes).
- **Ej. 5**: `generarCaza` descarta `esReservadoCaza` (nuevo).
- **Ej. 1 y 2**: igual que antes, con `RESERVADOS` ampliado.
- `RESERVADOS` (en claro; las hojas ya las tienen los alumnos): +25 sumas de las hojas 2 y 3 (`pasos`, que también vale para el ej. 1) y +5 naturales (`naturales`).
- `HUELLAS_SUMAS` +18: cuentas de los tres modelos del final y la recuperación, el error de U4-3C-11 del modelo 1, los problemas y las opciones de
  U4-2A-04 y U4-3C-11 que halló el barrido. Los casos de examen no están en claro.
- Lo de U4-3C-11 (trampa de la 120) queda cruzado con los ej. 1, 2, 3 y 5.

Barrido independiente (guion de scratchpad, fuera del repo): todas las cadenas de 2-3 términos con una fracción de `casos-examen*.tsv`, `examen-semana*.tex`,
los cuatro finales y las hojas 2 y 3, contra 8 × 20000 ítems en cada ejercicio: **0 coincidencias**. Tests propios 62/62, `npm test` 1613/1613.
Sin probar en navegador: la interfaz no cambia, solo qué ítems se descartan. No se tocó `catalogo.js`.
