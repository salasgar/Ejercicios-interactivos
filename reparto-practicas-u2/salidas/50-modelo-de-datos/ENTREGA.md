# Entrega · Tarea 50 (tareas v2, I2): modelo de datos

Sesión `s-20261016T210113-630c095e` · commit **ae6c6f1** · solo datos y funciones puras; nada las usa todavía.

Ficheros: `practicas/_comun/{catalogo,tareas,nube}.js`, `tests/practicas-{semana,nube}.test.js`
(`practicas-comun.test.js` no hizo falta tocarlo).

## Funciones y datos nuevos (para las tareas 51-54)

`catalogo.js`
- `unidad` en cada fila (ids 0-15 → 2; 16-30 → 1; plantilla → `null`). Nombres sin la coletilla (`errores1` = «Caza el error»; `propiedades` conserva «(ampliación)»).
- `UNIDADES` = `[{ n, desde, titulo:{es,en} }]` (1: 2026-09-14, 2: 2026-10-13, 3: 2026-11-16; fechas de 1 y 2 de relleno, sin confirmar).
- `unidadActual(hoy, unidades = UNIDADES)` → n de la última unidad cuyo `desde` ha llegado (la primera si ninguna).

`tareas.js`
- Campos `unidad`, `hasta`, `asignada`, `progresoPorPractica` (tarea 1: `unidad 2`, `hasta 2026-10-22`, `progresoPorPractica: true`; 2, 3, 4: `unidad 2`, hasta 29-10, 5-11, 12-11). Tareas 11-14 (U1) pegadas, sin `desde` ni `hasta`.
- `estadoTarea(...)` devuelve además `diaEntrega` (día en que se cumplió por primera vez; 0 si no está cumplida). `dia` no cambia.
- `estadoPlazo(tarea, estado, hoyDia, asignadoAMi = false)` → `{ tipo: 'repaso'|'obligatoria'|'obligatoria_para_ti', entregada, fueraDePlazo, diasRetraso }`. `hoyDia` = día de `contador.js`. Un no asignado de una tarea `asignada` es 'repaso' y nunca tiene retraso.
- `diaDeFecha('AAAA-MM-DD')` → día de contador.js.
- `tareasPublicadas(hoy, tareas = TAREAS, unidad = null)`.
- `erroresTareas` comprueba `unidad`, `hasta` (formato y no anterior a `desde`), `asignada` (solo true), `progresoPorPractica` (solo la tarea 1, y la 1 lo necesita).

`nube.js`
- `COLECCION_PRACTICAS`, `COLECCION_TAREAS` (`practicas-tareas`), `COLECCION_ASIGNACIONES` (`practicas-asignaciones`).
- `idDocumentoPractica(slug, codigo)`, `idDocumentoTarea(tareaId, slug, codigo)` → `t<id>--<slug>--<código>`, `claveProgresoTarea(slug, codigo, tareaId)` → `practicas.v1.<slug>.<código>.t<id>`.
- `urlDocumento(slug, codigo, config, { coleccion, id })`, y `leerNube`/`escribirNube`/`subirFusionado` aceptan `coleccion` e `id` en sus opciones (por defecto, lo de siempre).
- `urlAsignacion(codigo)`, `leerAsignacionRest(json)`, `leerAsignacion(codigo, opciones)` → `{ tareas: [ids] }` o `null`.

## Regla de publicación
La tarea 1 queda igual: nadie lee los campos nuevos. Lo comprueba `tests/practicas-semana.test.js` («regla de publicación»).

## Probar
`npm test` (754 en verde al cerrar). Sin prueba en navegador: nada de la app usa estas funciones todavía, salvo que la portada y la página de la semana, que no filtran por unidad, ya listan las tareas 11-14 (sin `desde`).
