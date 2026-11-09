# Entrega 147 · «Términos semejantes» (terminos-semejantes, id 71)

Ficheros: `practicas/terminos-semejantes/{index.html,practica.js,logica.js,textos.js,estilos.css}`, `tests/practicas-terminos-semejantes.test.js` (commit 633806d). Sigue `disponible: false`.

## Qué hay
1. ¿Semejantes? (U6-1C-12): dos términos, sí/no; casos: misma letra, dos números, letra y número, x e y.
2. Coeficiente y parte literal (U6-1C-01/04): «¿cuál es el coeficiente?» (con −x, x y signo) y «¿cuál es la parte literal?»; 3 o 4 opciones, cada falsa con su error con nombre.
3. Reduce (U6-1C-13/14): se teclea el resultado; una letra o x e y, con y sin números; avisa si aún hay semejantes sin juntar; nombra el error (sumar no semejantes, perder un signo, contar una letra sin número como 0).
4. Caza el error (U6-1C-15): una reducción en una línea, buena un cuarto de las veces; opciones: «No hay error» o uno de tres errores. Cada error cae en uno solo (test).
Sin x², sin paréntesis, sin «1x»; coeficientes enteros de 1 a 9.

## Hoja y examen de la semana 1
No existían en el reparto de la U6 (ni `6. Algebra/hojas-de-ejercicios` ni `exámenes-semanales`): `CASOS_HOJA` y `HUELLAS_EXAMEN` están vacíos pero operativos (`reservado`, probado). La 156 (publicación) debe cotejar y rellenarlos.

## Decisiones a revisar
- El ejercicio 4 es una sola afirmación «A = B» con «No hay error» o tres errores, no la elección entre varias líneas.
- Ejercicio 2: con coeficiente positivo distinto de 1 solo hay 3 opciones (no hay un cuarto distractor honesto).
- No he podido probar la interfaz en navegador (sin herramienta en esta sesión): `node --check` y tests de lógica en verde, pero falta mirar 375 px y ES/EN a ojo.
- `npm test`: 1706/1706.
