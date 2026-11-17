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

## Segunda entrega (revisión de la 156, sesión s-20261117T000030-38aa1fca, 2026-11-17T00:14:09Z) — commit badfdcb
Corregido lo que reabrió `hechos/reabiertas/147--s-20261116T233507-987369cb-revision.md`:
1. **Ej. 4, dos respuestas correctas**: ahora los tres errores se calculan sobre la suma y se descarta el ítem si el resultado lo explican dos errores distintos (`−8x − x − x = −8x` ya no sale; test).
2. **«Perder un signo» = un menos leído como un más** en UN término que resta (no el primero): una entrada por término; el feedback dice cuál («−x se ha sumado como +x»). Misma definición en el ej. 3 (diagnóstico) y en el 4. Nombre de la opción: «Ha leído un menos como un más».
3. **Reserva por tarea con sus datos** en los cuatro ejercicios (`clavePar`, `claveCoeficiente`, `claveSuma`, `claveError`): pareja sin orden; «coeficiente|término» (x, −x y números no se reservan); suma sin reducir con términos ordenados; suma + resultado mostrado. Hoja 1 en claro (`CASOS_HOJA`: 63 claves); exámenes semanales 1-4 (incl. extras y cuestionarios), repaso del examen 2 y los cinco finales por huella FNV-1a (`HUELLAS_EXAMEN`: 175 huellas, calculadas fuera del repo, también con los resultados distractores de esos exámenes). Los casos no figuran en claro en código, tests ni mensajes. `sinReservar` lanza error si no encuentra ítem libre.
4. **Ej. 1**: la `y` sale también en parejas semejantes (`3y`, `−y`); entre las parejas con `y`, sí ≈ 36 %, no ≈ 64 % (test: ni uno ni otro > 80 %).
5. **Erratas**: «−1 no tiene letra y x tiene la letra x» (`solucionSemejantes`); sin «A = A» cuando los términos ya están juntos (`solucionReducir`; `pasosReduce` de textos.js adaptado).
6. Cabecera de `logica.js` corregida (la y, la reserva y lo que no se reserva).

Pruebas: `node --test tests/practicas-comun.test.js tests/practicas-terminos-semejantes.test.js tests/practicas-ayuda-terminos-semejantes.test.js` 66/66. `npm test`: solo fallan tests ajenos (otras tareas a medias: `tabla-propiedades` sin ocultar «Comprobar», portada). Navegador (localhost:8080, «Probar sin código»): 8 cargas (4 ejercicios × es/en) a 375 px sin desbordes y un acierto del ej. 4 con la etiqueta nueva; el feedback del fallo solo comprobado por test (el cuadro de la pestaña no admite menos de 570 px, se usó un iframe de 375). No se tocó `catalogo.js` ni `_comun/`.

## Tercera entrega (revisión de la 156, sesión s-20261117T030519-b53fc08f)
Corregido lo que reabrió `hechos/reabiertas/147--s-20261117T023530-f7aa1ea7-revision.md`:
1. **Casos de examen fuera del test**: la reserva de examen se prueba con `HUELLAS_EXAMEN.size` y con una suma inventada cuya huella se añade al conjunto solo dentro del test (y se quita); el último test usa un caso de la hoja. Comprobado con grep (todas las expresiones de los `casos-examen-semana*.tsv` y de los finales, normalizadas) contra `practicas/terminos-semejantes/`, el test y esta ENTREGA: ninguna aparece en claro fuera de lo que ya figura en la hoja (`CASOS_HOJA`).
2. **Ej. 4 y ej. 3, una sola explicación**: `candidatosDe` prueba «contar como 0» con **cualquier subconjunto no vacío** de los términos ±1 y «un menos como un más» con cada término que resta; el ítem se descarta si el resultado sale de dos errores. Test independiente de 2 × 3000 ítems con esas familias calculadas a mano (ej. 4) y 3000 del ej. 3 (lo tecleable lo explica un solo error; si lo explican dos, queda como «otra expresión»).
3. **Ej. 3**: el feedback de «un menos como un más» lleva el término («−x se ha sumado como +x»), en es y en (`explicaErrorConTermino`; `corregirReducir` devuelve `signo`).
4. **Ej. 4**: «No hay ningún error» sale una sola vez (el aviso previo se quita: lo dice la solución).
5. **Ej. 4**: ya no hay dos «:» seguidos ni mayúscula tras los dos puntos: «… no es 15x. Has leído un menos como un más: … (…). Bien hecho: …».
6. **Ej. 2**: el porqué del 0 («Sin número delante, la letra no vale 0: lleva un número escondido.») ya no repite la solución.
Barrido de 20000 ítems por ejercicio (semillas 156002-156003): 0 casos de los defectos 4, 5 y 6. `npm test` 2456/2456; `node --test tests/practicas-comun.test.js tests/practicas-terminos-semejantes.test.js` en verde.
**Sin probar con clics a 375 px**: esta sesión no pudo lanzar un Chrome con depuración (el sistema lo denegó) y no lo ha forzado. Lo único de interfaz que cambia es texto del feedback y la quita del aviso del ej. 4 (`practica.js`, 3 líneas); la 156 debe hacer la prueba con clics, es y en, al publicar. No se tocó `catalogo.js` ni `_comun/`.
