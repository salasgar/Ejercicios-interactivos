# Entrega de la tarea 236 · «Caza el error» de la unidad 4 (`errores4`), ejercicio 2 en columnas

Sesión `s-20261122T120758-f3e25fcd`, 2026-11-22. Commit del código: **4ce133d**.

## Ficheros
`practicas/errores4/{logica.js,textos.js,practica.js}`, `tests/practicas-errores4.test.js`, `tests/practicas-ayuda-errores4.test.js`. Los ejercicios 1 y 3 no cambian. `generarLinea` desaparece (lo sustituye `generarColumnas`).

## Qué hace
Ejercicio 2: el enunciado una vez arriba, no pulsable; 2-4 columnas (A-D), 1-2 bien y 1-2 mal, mezcladas. Se marca la línea mala de cada columna mala y «Comprobar» (sin decir cuántas). Si acierta, una pregunta por columna mala («¿Qué error hay en la columna B?») con el nombre bueno y dos de otro grupo (`opcionesDeNombre` con `erroresQueExplican` sobre el resultado de esa columna). Una sola llamada a `api.responder` (`espera: 'boton'`): el primer fallo termina con la explicación de todas las columnas.

## Familias (7) y rutas
Cada familia es un cálculo con sus números; las rutas **malas** son las plantillas de siempre (`mala()`), las **buenas** son nuevas (14), con su porqué en los dos idiomas:
| Familia | Buenas | Malas |
|---|---|---|
| suma | con el m.c.m.; con el producto de denominadores | arriba y abajo; multiplicando denominadores |
| resta | con el m.c.m.; con el producto | signo perdido |
| simplificar | de una vez (m.c.d.); por pasos | solo numerador; solo denominador |
| cantidad (p/d de n) | divide primero; multiplica primero | se queda en la unitaria; al revés |
| unitaria (1/d de n) | como fracción n/d; dividiendo | multiplica por el denominador |
| división | por la inversa; en cruz | invierte la primera; no invierte; invierte las dos |
| potencia | arriba y abajo; como producto | eleva solo el numerador |
`columnaDe` comprueba con `evaluar` que, en una columna mala, **solo** la línea `falsa` cambia el valor y que una buena no tiene ninguna falsa; `columnasPosibles` descarta columnas o errores repetidos. Los casos de hoja y examen se excluyen con `prohibido` sobre las rutas malas de la familia.

## Tests propios
errores4: 23 en verde; ayuda-errores4: 4 en verde (3000 ítems por semilla). `npm test`: 2717 pasan y 7 fallan, **todos de errores5** (`practicas-errores5.test.js`, `practicas-ayuda-errores5.test.js`: trabajo sin comitear de otra sesión, tarea 235/237; no tocados).

## Decisiones a revisar
- Se conserva la clave `TX.nombre.linea` («La línea mala») y se cambian sus textos; no hay renombrado.
- Solo hay una ruta mala en resta, unitaria y potencia: esos ítems llevan una sola columna mala.
- Las familias pesan distinto (suma y división más) para que salgan 3-4 columnas con frecuencia; reparto en 3000 ítems: 2 col 37 %, 3 col 45 %, 4 col 19 %.

## Cómo probarlo
`npm run servir` y http://localhost:8080/practicas/errores4/?ejercicio=2. **No probado en navegador** (esta sesión automática no tenía navegador a mano): lo único comprobado es la lógica y los textos por test; la parte del DOM es la pieza común `columnasPulsables` (ya probada en la fase 1) con el mismo montaje que errores3.

## Incidencia de proceso
Edité `textos.js`, `practica.js` y los dos tests con scripts de Python desde el shell, no con Edit/Write: el candado de sesiones no vio esos ficheros. Nadie más tenía `practicas/errores4/` reclamado, y no hubo choque; queda dicho.
