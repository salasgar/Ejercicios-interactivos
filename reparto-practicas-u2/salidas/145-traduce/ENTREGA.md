# Entrega 145 · «Del enunciado al álgebra» (traduce, id 69)

Ficheros: `practicas/traduce/{index.html,practica.js,logica.js,textos.js,estilos.css}`, `tests/practicas-traduce.test.js`. Sigue `disponible: false`.

## Qué hay
1. Elige la expresión (U6-1A-01/02/1B-02): frases de `FRASES` de la 144, sin paréntesis, sin `doble-de-la-suma` ni `suma-consecutivos`.
2. Escríbela: con `leerExpresion`; vale cualquier forma equivalente y cualquier letra única; 25 % son parejas (U6-1A-04).
3. Elige la frase (U6-1C-03): frases con coma cuando hay dos operaciones («twice a number, plus three»).
4. Situaciones: tarifas (expresión, sesión 1; valor U6-1A-05, sesión 2) y cantidades con letra (edades, precios).
Cada opción falsa lleva `error` con nombre (los de `ERRORES_TIPICOS` y los propios `ERRORES_TRADUCE`) y `por_que` con los números del ítem.

## Hoja y examen de la semana 1
No existían en el reparto de la U6: `CASOS_HOJA` y `HUELLAS_EXAMEN` están vacíos pero operativos (`reservado`, probado). Cuando existan, hay que añadir formas canónicas (hoja) y huellas FNV-1a (examen).

## Realismo
Cotas por contexto en `COTAS` (parte fija, precio, cantidad, tope), comprobadas por test con 3000 ítems.

## Decisiones a revisar
- Sin sucesiones (U6-1C-10) ni paréntesis: dependen del acta F0 / sesión 10.
- El ejercicio 4 mezcla sesión 1 (expresión, cantidad) y sesión 2 (valor): el campo `sesion` del ítem lo marca.
- No he podido probar la interfaz en navegador (sin herramienta en esta sesión): `node --check` y tests de lógica en verde, pero falta mirar 375 px y ES/EN a ojo.
- `npm test`: el único fallo es de `ortografia-letras` (tareas 140-142, de otra sesión).

## Reabierta del 10-11 (acta de la U6)
- Dinero con dos decimales (`4,00 €` / `€4.00`) en enunciados, opciones y feedback del ejercicio 4; `frases` {es,en} en las opciones de valor; test de 3000 ítems.
- «cuatro veces más» pasa a «el cuádruple» (test: ningún texto español con «veces más»).
- Sucesiones (U6-1C-10) siguen fuera: las quita la reabierta de la 144. Sin probar en navegador.

## Reabierta del 16-11 (revisión de la 156)
- **Coma en español** en las frases de dos operaciones («el doble de un número, más siete»), en los cuatro ejercicios: `esDe` en `logica.js` (no se toca `_comun/algebra.js`). Test sobre ~9000 textos.
  **Propuesta a la coordinadora (para la ENTREGA de la 156):** corregir `FRASES` de `_comun/algebra.js` (`doble-mas`, `mitad-menos`) para que lleven coma en español.
- **Reserva por clave = la tarea con sus datos** (`mas-que:9`, `doble-menos:8`, `hermano:4`…), igual en los dos sentidos (ej. 1-2 y 3). Las construcciones sin número propio no se reservan (dicho en la cabecera de `logica.js`). Cada ítem lleva `reserva`.
- `CASOS_HOJA`: 15 claves (en claro, leídas en la hoja 1). `HUELLAS_EXAMEN`: 11 huellas (examen 1 y final; calculadas fuera del repo con `huella`). No hay casos de examen en claro.
- **Consecuencia:** `cantidad-caramelos` (multiplicadores 2-4) queda entera reservada (hoja y examen 1 usan 2, 3 y 4) y deja de salir. Propuesta: ampliar a «cinco veces…» con una redacción sin «veces más», o dejarla fuera.
- `COTAS.feria.f` pasa a [3, 10] (entrada de 3,00 € en adelante). Solución de las tarifas en expresión: «La parte fija es 6,00 € y la que depende de g es 2,00 € por g» (en: €6.00).
- Quitado el distractor `yuxtaponer-al-sustituir` de las tarifas de valor; si los datos dejan menos de tres errores distintos se sortea otra vez.
- Barrido de 80000 ítems: 0 casos reservados, siempre 4 opciones y una buena. `npm test` 2428/2428.
- **Sin probar en navegador** (la sesión no pudo levantar un servidor local): solo cambia lógica y textos, no el DOM; falta mirar 375 px y ES/EN a ojo.
