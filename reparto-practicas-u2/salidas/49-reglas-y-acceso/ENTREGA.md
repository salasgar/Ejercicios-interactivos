# Entrega de la tarea 49 · Tareas v2, I1: reglas de Firestore y acceso a datos

Sesión `s-20261016T210110-64cbee4b`. Commit **`bee396f`** (en `origin/main`).

## Ficheros entregados (git show --stat bee396f)

- `firestore.rules` (+36 −3): bloques nuevos `practicas-tareas/{doc}` y
  `practicas-asignaciones/{codigo}`; campo opcional `tarea` (entero 1-1023) en `fallos/{id}`.
  Los bloques `practicas/{doc}` y `divisores/{codigo}` (tarea 1) no se tocan.
- `src/firebase.js` (+25): `datos.listarPracticasTareas()`, `datos.listarAsignaciones()` y
  `datos.guardarAsignacion(codigo, tareas)` (setDoc de `{ tareas, actualizado }`; normaliza la
  lista a enteros ≥ 1, sin repetir, ordenados; devuelve la lista guardada). Nadie las usa aún:
  las usará el panel (tarea 53).
- `tests/practicas-registro.test.js` (+3 −1), **fuera de los ficheros de la ficha**: el test
  exigía que `hasOnly` de la regla de `fallos/` fuera exactamente lo que manda hoy
  `datosFallo`; con `tarea` en la regla fallaba, y `npm test` en rojo para la publicación de
  GitHub Pages (pages.yml). Ahora admite `tarea` como opcional (sigue pasando cuando la 51 haga
  que `datosFallo` lo mande) y comprueba el rango 1-1023 de la regla. El fichero es de la 51,
  que no tenía reclamo.

## Reglas

- `practicas-tareas/{doc}`: id `^t[0-9]{1,4}--[a-z0-9-]+--[A-HJ-NP-Z2-9]{4}$`; `get` cualquiera
  con ese id; `read` (listar) solo el profesor; `create, update` con `hasOnly(['estado',
  'actualizado'])`, `estado` texto < 4000, `actualizado` entero. Sin `delete` (como `practicas/`).
- `practicas-asignaciones/{codigo}`: id del código; `get` cualquiera; `read` solo el profesor;
  `write` solo el profesor, con `hasOnly(['tareas', 'actualizado'])`, `tareas` lista (≤ 1023
  elementos), `actualizado` entero. **Las reglas no pueden comprobar que cada elemento sea
  entero** (no recorren listas): lo asegura `guardarAsignacion`. Borrar no pasa la regla (no hay
  `request.resource`): para «sin tareas» se guarda `tareas: []`.

**Publicadas por Juan Luis** en la consola (Firestore Database → Reglas) entre el 16-10 a las
21:05Z y el 17-10 a las 06:55Z.

## Comprobación REST sin autenticación (código de prueba 7NPD = n.º 60)

Antes de publicar (16-10, 21:03Z): las 13 peticiones de abajo daban 403.
Con las reglas publicadas (17-10, 06:55Z), resultado literal:

```
404 GET  practicas-tareas/t999--semaforo--7NPD  (NOT_FOUND)
200 PATCH practicas-tareas/t999--semaforo--7NPD (estado, actualizado)
200 GET  practicas-tareas/t999--semaforo--7NPD (después)
403 PATCH practicas-tareas/t999--semaforo--7NPD con un campo de más  (PERMISSION_DENIED)
403 PATCH practicas-tareas/semaforo--7NPD (id sin «t<n>--»)  (PERMISSION_DENIED)
403 GET  practicas-tareas (list)  (PERMISSION_DENIED)
404 GET  practicas-asignaciones/7NPD  (NOT_FOUND)
403 GET  practicas-asignaciones (list)  (PERMISSION_DENIED)
403 PATCH practicas-asignaciones/7NPD sin cuenta  (PERMISSION_DENIED)
200 POST fallos/7NPD-mvc1lstd-4e40 con sin tarea (control)
200 POST fallos/7NPD-mvc1lsx0-sqll con tarea: 1
403 POST fallos/7NPD-mvc1lt03-bf3q con tarea: 'x'  (PERMISSION_DENIED)
403 POST fallos/7NPD-mvc1lt2s-l70k con tarea: 0  (PERMISSION_DENIED)
403 POST fallos/7NPD-mvc1lt5q-73xw con tarea: 1024  (PERMISSION_DENIED)
```

Tarea 1 sin cambios: `GET practicas/semaforo--7NPD` → 404, `GET practicas/recta--KTFN` → 200,
listar `practicas` → 403 (como antes).

Lo que no se ha probado: la escritura de `practicas-asignaciones` con la cuenta del profesor
(SDK). La probará el panel (tarea 53) o la revisión (55).

## Datos de prueba que quedan en la nube (ninguno de alumnos reales)

- `practicas-tareas/t999--semaforo--7NPD` (`ej: []`). Las reglas no dejan borrarlo a nadie;
  se borra a mano en la consola si se quiere (no estorba: no hay tarea 999).
- `fallos/7NPD-mvc1lstd-4e40` y `fallos/7NPD-mvc1lsx0-sqll`, con `t = 1000` (año 1970): no
  salen en el panel, que carga los fallos desde una fecha.

## Cómo probarlo en 1 minuto

`node <script>` con el script de la sesión (scratchpad, no versionado), o a mano con `curl`
contra `https://firestore.googleapis.com/v1/projects/ejercicios-interactivos/databases/(default)/documents/practicas-tareas/t999--semaforo--7NPD?key=<apiKey de src/config.js>`
(200) y la misma URL sin el id (403).
