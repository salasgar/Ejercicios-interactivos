# ENTREGA · Tarea 164 · Enlace «probar» por ejercicio en el editor de tareas

Sesión `s-20261106T144100-115a5f2e` (Sonnet 5.5, Medio) · commit **8881183**.

## Qué se hizo
- `practicas/profesor-tareas.js`: `enlaceProbar(practica, n)` (`<ruta>?probar=1&ejercicio=N`, relativa a `practicas/`) y, junto a cada ejercicio de la tabla del editor, el enlace «probar · *try it*» (`target="_blank"`, `rel="noopener"`).
- `practicas/_comun/base.js`: `modoPrueba(busqueda)` (`?probar=1`) y `entrarSinCodigo()`, que es lo que ya hacía el botón «Probar sin código» (ahora comparten función). Con `?probar=1` el arranque entra directo sin código, **antes** de mirar `?c=` o el código recordado. Se reutiliza el `?ejercicio=N` que ya existía.
- `tests/practicas-probar.test.js` (nuevo, 4 tests).

## Cómo se probó
- `node --test tests/practicas-probar.test.js tests/practicas-comun.test.js tests/practicas-editor.test.js`: 65/65.
- `npm test`: 1586/1589; los 3 fallos son de la tarea 166 (en curso, a medias en `tareas.js` y `practicas-semana.test.js`/`practicas-nube.test.js`), no de esta.
- Chrome con clics en servidor local, con el código `ABCD` recordado en el navegador: `semaforo` ej. 2 (U2, también con `&c=` en la dirección), `fraccion-de` ej. 1 (U4), `compara-decimales` ej. 2 (U5) y `ortografia` ej. 1 abren directamente ese ejercicio, sin pedir código; al terminar el código recordado seguía intacto y no se creó ninguna clave nueva en el almacén. U3 (`dos-signos`) y el enlace dibujado en el editor del panel **no** se probaron en navegador (el panel exige iniciar sesión); el HTML del enlace es una sola plantilla y su URL la cubre el test para todos los ejercicios de las U2-U5.

## Hallazgos para Juan Luis
- Nada fuera de criterio. El modo de prueba no guarda ni sube nada porque con `estado.codigo = null` `guardar()` y `subir()` no escriben (lo comprueba un test sobre el código).
