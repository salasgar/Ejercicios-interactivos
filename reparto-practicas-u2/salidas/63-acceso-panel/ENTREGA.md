# Entrega de la tarea 63 · Varios profesores, N3: acceso a datos del panel

Sesión `s-20261017T164322-6e87b824` · commit **`a5d3284`** · fichero: `src/firebase.js` (+~190 líneas; ninguna función existente tocada).

## Qué hay
`crearAccesoPanel({ Fs, db, auth, esAdmin })` (exportada, para probarla sin red) y `iniciarFirebase()`
la expone como **`api.datos.panel`**. Nadie la usa aún (la usará la 66). Funciones:

- Alta: `estadoProfesor()` ('admin'|'activo'|'baja'|'sin-alta'), `pedirAlta()`, y solo administrador `listarSolicitudes()`, `listarProfesores()`, `darDeAlta(uid)`, `darDeBaja(uid)` (ambas conservan la fecha de alta), `borrarSolicitud(uid)`.
- Espacio: `crearEspacio()`, `leerLectores()`, `guardarLectores(uids)` (máx. 5).
- Códigos: `listarMisCodigos()`, `crearCodigos([{codigo,n}])` → `{creados, chocan}` (una transacción por código: no pisa ni los de otro profesor ni los propios), `cambiarNumero`, `borrarCodigo`.
- Config: `leerConfig()` → `{json, actualizado}`|null, `guardarConfig(jsonTexto)`.
- Nombres: `leerNombresCifrados()`, `guardarNombresCifrados({v,sal,iv,cifrado})` (no cifra: es de la 66).
- Lectura incremental: `leerDesde(que, desdeMs, {uid})` con `que` = progreso(-libre) | progreso-tareas | asignaciones | fallos; filtra por `actualizado` (en `fallos`, por `t`). `guardarAsignacion(codigo, tareas)` en el espacio propio.

Notas: la subcolección es `progreso-libre` (nota de la 61); `progreso` se acepta como sinónimo. `guardarAsignacion` de `datos.panel` es distinta de la antigua `datos.guardarAsignacion` (colección vieja).

## Comprobado
- `npm test`: 824 de 824, 0 fallos.
- Lógica de cada función con un Firestore simulado (guion fuera del repositorio): OK — campos exactos que piden las reglas, transacción que detecta choques con códigos propios y ajenos, validaciones, filtro por tiempo, error claro sin sesión.

## NO comprobado (honesto)
- **Contra el proyecto real**: la ficha lo pedía con una cuenta de prueba, y esta sesión no tiene las credenciales (`PROFE_A_*` no están en el entorno; no se guardan en el repositorio). Las reglas y los campos están contrastados con `firestore.rules` y la ENTREGA de la 61, pero ninguna llamada se ha hecho con el SDK real. Tampoco con la cuenta de Google de Juan Luis (panel de hoy, modo antiguo): el código antiguo no cambia, pero no se ha abierto el panel.
- Posible índice: `where('actualizado','>',…)` sobre una sola subcolección no pide índice compuesto; si Firestore lo pidiera, saldrá en el error con enlace.
