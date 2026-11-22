# Entrega 239 · errores6: el error también en las líneas de en medio

Commit: 7ad5076. Ficheros: `practicas/errores6/logica.js`, `tests/practicas-errores6.test.js`.

**Qué cambia.** Cada ítem lleva `p.v` (0-3). `previas(q0, v)` antepone líneas buenas *sin reducir* (una constante partida,
un coeficiente de x partido, o las dos cosas reducidas una a una: «2x + x − 1 = 3x + 8 + 2» → «3x − 1 = …» → …). La primera hace de
enunciado. En `cadenaFinal` (error en el despeje, siempre al final) alarga la resolución: el error cae en la 4.ª, 5.ª o 6.ª línea.
En `cadenaPrimera` (transponer-sin-signo, mcm-solo-denominadores, olvidar-numerador, suma-no-semejantes; `vMin: 1`) el error pasa a la
3.ª o 4.ª línea y las de después siguen de él. Se rechazan los ítems de menos de 3 líneas y los `vMin` cuyo error siga siendo la 2.ª.
Las dos plantillas de paréntesis (distribuir-solo-primero, signo-solo-primero) siguen con el error en la 2.ª línea (solo el enunciado
lleva paréntesis) y en el ejercicio 1 salen la mitad de veces.

**Reparto real (3000 ítems del ejercicio 1, semilla 31, 1 986 con error):** 2.ª 143 · 3.ª 649 · 4.ª 458 · 5.ª 512 · 6.ª 224;
ni 2.ª ni última: 37,6 %; máximo 6 líneas. Test nuevo en `tests/practicas-errores6.test.js` (semilla 32).

Sin columnas (decisión de Juan Luis): no hay familias ni reparto 2/3/4 columnas. Ejercicios 2 y 3 sin cambios de código; sus tests en verde.

**No probado en navegador** (sesión del lanzador, sin Chrome): hay que mirar un ítem de 6 líneas en 375 px y en español/inglés.
`practica.js`, `textos.js` y `_comun/` sin tocar.
