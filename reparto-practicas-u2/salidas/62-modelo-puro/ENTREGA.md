# Entrega de la tarea 62 — Varios profesores, N2: modelo puro

Sesión `s-20261017T154931-b615b118` · commit `c8acd61` · sin prueba en navegador (ninguna página usa lo nuevo).

## Ficheros
- `practicas/_comun/codigos.js`: `codigoSecreto(azar)`, `leerCodigoSecreto`, `mostrarCodigoSecreto`, `modoDeCodigo`, `LONGITUD_SECRETO`; `leerCodigoTarea(texto, tareas = TAREAS)`.
- `practicas/_comun/tareas.js`: `tareaPorId(id, tareas = TAREAS)`; `erroresTareas(tareas, { tareaUnoAntigua = true })`; `configDeJSON`, `configAJSON`, `erroresConfig`, `configPlantilla`.
- `practicas/_comun/catalogo.js`: `unidadesCon(fechas)`.
- `practicas/_comun/nube.js`: `coleccionEspacio(uid, que)`, `urlBusqueda`, `urlConfig`, `leerBusqueda`, `leerConfig` (+ `leerBusquedaRest`, `leerConfigRest`, constantes); `urlAsignacion` y `leerAsignacion` aceptan `coleccion`.
- `practicas/_comun/espacio.js` (nuevo): `resolverCodigo(codigo, { fetch, almacen, espera, config })`, `claveEspacio`, `almacenDelNavegador`.
- `tests/practicas-espacio.test.js` (nuevo, 21 tests). No se tocaron `tests/practicas-{semana,nube,comun}.test.js`: lo nuevo está todo en el test nuevo.

## Comprobado
- `node --test tests/practicas-espacio.test.js`: 21 de 21. `npm test`: 824 de 824, 0 fallos.
- Modo antiguo: con código de 4 y lista por defecto, `tareaPorId`, `erroresTareas`, `tareasPublicadas`, `unidadActual`, `leerCodigoTarea` dan lo mismo (test «modo antiguo»).
- Sin sesgo en `codigoSecreto`: 256 es múltiplo de 32, `byte & 31` reparte 8 veces cada símbolo (test y comentario).

## Para la tarea siguiente (63, 64, 65)
- `resolverCodigo` devuelve `{ modo:'antiguo', n }`, `{ modo:'nuevo', profesor, n, config:{unidades,tareas}, desdeCache, sinConfig? }` o `{ error: 'no-valido' | 'no-existe' | 'sin-red' }`. Un profesor sin `config/tareas` (404) da configuración vacía.
- Rutas del espacio: `coleccionEspacio(uid,'progreso'|'progreso-tareas'|'asignaciones'|'fallos')`, que se pasa tal cual como `coleccion` a `leerNube`/`escribirNube`/`leerAsignacion`.
- Clave del navegador: `practicas.v1.espacio.<CÓDIGO>` = `{ profesor, n, json }`.
