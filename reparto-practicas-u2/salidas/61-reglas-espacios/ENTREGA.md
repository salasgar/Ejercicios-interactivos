# Entrega de la tarea 61 · Varios profesores, N1: reglas de los espacios y banco de pruebas por REST

Sesión `s-20261017T155008-0017d46d`, atendida con Juan Luis delante. Commit **`5e88caf`**.

## Ficheros entregados (git show --stat 5e88caf)

- `firestore.rules` (+187): sección nueva **al final**, después de `match /tareas/{tareaId}`.
  Los bloques de hoy no cambian (ni una línea: el diff solo añade).
- `herramientas/probar-reglas.mjs` (+393, nuevo): Node sin dependencias.
- `tests/practicas-registro.test.js`: **no** hizo falta tocarlo (su lectura de `fallos/` llega
  hasta el primer `match /tareas/`, antes de la sección nueva).

**Publicadas por Juan Luis** en la consola el 17-10 hacia las 16:00Z (comprobado por REST sin
cuenta antes de lanzar el banco: las rutas nuevas dan 404 en vez de 403).

## Qué cambia respecto al borrador de DISENO.md (C.2)

1. **`progreso` → `progreso-libre`** (la subcolección del progreso de práctica libre). Las reglas
   de hoy tienen, de la aplicación antigua de `src/`, `match /{ruta=**}/progreso/{tareaId}
   { allow read: if esProfesor(); }`, y `src/firebase.js` (`todosLosProgresos`) hace
   `collectionGroup(db, 'progreso')`. Las reglas se suman: con el nombre del borrador el
   administrador habría podido leer desde la app el progreso de los alumnos de los compañeros, y
   su exportación antigua se lo habría traído. Ese bloque es de hoy y no se toca. Avisada la 62
   (lo adoptó en d789a1a); nota `hechos/notas/s-20261017T155008-0017d46d-para-62-63-64.md`.
   La ficha de la 64 (línea «Cómo saber…») todavía dice `…/progreso/…`.
2. **Lectores con el dueño de baja**: `esLector(uid)` exige además que el dueño esté activo. Si
   no, un profesor de baja seguiría leyendo a través de una segunda cuenta suya puesta como
   lectora (fila «Un profesor dado de baja sigue entrando»).
3. `activo(uid)` como función, de la que salen `profesorActivo()` y `esDueno(uid)` (misma lógica).
4. `practicas-profesores`: `create, update` en vez de `write` (borrar no pasaba la regla de todos
   modos; se da de baja con `activo: false`).
5. `practicas-alumnos`: `alta is int` también al actualizar (el borrador solo lo miraba al crear).
6. `privado/nombres`: tipos de `v` (entero), `sal` e `iv` (texto ≤ 200, **en base64**). Contrato
   para la 66 (`cifrado.js`).
7. `fallos/{id}` del espacio, completo: los mismos campos y topes que `fallos/` de hoy, con
   `{8}` en `id` y en `alumno`, y `alumnoDe(uid, alumno)`.

## Contratos para las tareas siguientes (63, 64, 66, 68)

| Ruta | Campos (exactos, `hasOnly`) | Quién escribe |
|---|---|---|
| `practicas-solicitudes/{uid}` | `email` (= el del token), `nombre` (≤ 100), `pedido` (entero) | el propio interesado |
| `practicas-profesores/{uid}` | `activo` (bool), `alta` (entero) | el administrador (en la consola, hasta la 66) |
| `practicas-alumnos/{código 8}` | `profesor` (= su uid), `n` (1-250), `alta` (entero) | el profesor; listar solo con `where profesor == uid` |
| `practicas-espacios/{uid}` | `lectores` (lista ≤ 5 uids), `actualizado` (entero) | el dueño |
| `…/config/tareas` | `json` (texto < 200 000), `actualizado` | el dueño; `get` sin cuenta |
| `…/privado/nombres` | `v` (entero), `sal`, `iv` (base64 ≤ 200), `cifrado` (< 100 000), `actualizado` | el dueño; solo él lee |
| `…/progreso-libre/{slug}--{código 8}` | `estado` (texto < 4000), `actualizado` | el alumno, si el código es de ese profesor |
| `…/progreso-tareas/t{id}--{slug}--{código 8}` | ídem | ídem |
| `…/asignaciones/{código 8}` | `tareas` (lista ≤ 1023), `actualizado` | el dueño, solo a códigos suyos |
| `…/fallos/{código 8}-{t36}-{azar 4}` | los de `fallos/` de hoy (`datosFallo`), `alumno` de 8 | el alumno, solo crear (POST con `documentId`) |

Listar (`read`) progreso-libre, progreso-tareas, asignaciones y fallos: el dueño activo y sus
lectores (con el dueño activo). Borrar: el dueño. `get()` de un documento que no existe en una
regla deniega: un profesor sin `practicas-profesores/{uid}` no entra en nada.

## Cómo se prueba (1 minuto)

```
PROFE_A_EMAIL=… PROFE_A_CLAVE=… PROFE_B_EMAIL=… PROFE_B_CLAVE=… node herramientas/probar-reglas.mjs
```

Sin las variables hace solo las tres comprobaciones sin red (sale con código 2). `--dejar` no
borra los datos de prueba; `--baja` comprueba un profesor de baja (B con `activo: false` en la
consola). Las cuentas A y B son de correo y contraseña, creadas por Juan Luis en
Authentication y dadas de alta a mano en `practicas-profesores` (sus correos y contraseñas no
están en el repositorio). El script crea además por REST una cuenta desechable «sin alta»
(`zz-sin-alta-…@example.com`) y la borra al terminar.

## Resultado literal (17-10, hacia las 16:15Z)

```

## Lectura de firestore.rules (sin red)

comprobación                                        · esperado · obtenido · ✓/✗
la sección nueva va después de match /tareas/       · sí       · sí       · ✓
esAdmin/esProfesor no aparecen en el espacio        · sí       · sí       · ✓  (el administrador no lee lo de otros)
ningún comodín ** alcanza el espacio                · sí       · sí       · ✓  (subcolecciones: practicas-espacios, config, privado, progreso-libre, progreso-tareas, asignaciones, fallos; comodines: progreso)

## Modo antiguo intacto

comprobación                                        · esperado · obtenido · ✓/✗
sin cuenta: get practicas/semaforo--7NPD            · 200 o 404 · 200      · ✓
sin cuenta: get practicas-tareas/t2--semaforo--7NPD · 200 o 404 · 200      · ✓
sin cuenta: get practicas-asignaciones/7NPD         · 200 o 404 · 200      · ✓
sin cuenta: listar practicas                        · 403      · 403      · ✓
A (profesor nuevo) lista practicas                  · 403      · 403      · ✓
A lista practicas-tareas                            · 403      · 403      · ✓
A lista fallos (de hoy)                             · 403      · 403      · ✓

## Alta de profesores

comprobación                                        · esperado · obtenido · ✓/✗
A lee su alta                                       · 200      · 200      · ✓  (activo: true)
B lee su alta                                       · 200      · 200      · ✓  (activo: true)
A lee el alta de B                                  · 403      · 403      · ✓
A lista practicas-profesores                        · 403      · 403      · ✓
sin cuenta: lee el alta de A                        · 403      · 403      · ✓
A se escribe su propia alta                         · 403      · 403      · ✓
A lista practicas-solicitudes                       · 403      · 403      · ✓
C (sin alta) deja su solicitud                      · 200      · 200      · ✓
C lee su solicitud                                  · 200      · 200      · ✓
A lee la solicitud de C                             · 403      · 403      · ✓
C deja una solicitud a nombre de A                  · 403      · 403      · ✓
C deja su solicitud con otro correo                 · 403      · 403      · ✓
C se escribe su alta                                · 403      · 403      · ✓
C crea un código                                    · 403      · 403      · ✓
C crea su espacio                                   · 403      · 403      · ✓
C escribe su configuración                          · 403      · 403      · ✓

## Códigos de los alumnos (practicas-alumnos)

comprobación                                        · esperado · obtenido · ✓/✗
A crea un código suyo (n.º 1)                       · 200      · 200      · ✓
A crea otro (n.º 2)                                 · 200      · 200      · ✓
B crea un código suyo (n.º 1)                       · 200      · 200      · ✓
B se queda un código de A                           · 403      · 403      · ✓
A crea un código a nombre de B                      · 403      · 403      · ✓
A crea un código con I y O                          · 403      · 403      · ✓
A crea un código de 4                               · 403      · 403      · ✓
A crea con n = 0                                    · 403      · 403      · ✓
A crea con n = 251                                  · 403      · 403      · ✓
A crea con un campo de más                          · 403      · 403      · ✓
sin cuenta: get de un código                        · 200      · 200      · ✓  (n = 1)
sin cuenta: get de un código que no existe          · 404      · 404      · ✓
sin cuenta: crea un código                          · 403      · 403      · ✓
A consulta sus códigos (profesor == A)              · 200      · 200      · ✓  (2 códigos, todos de A)
A lista practicas-alumnos sin filtro                · 403      · 403      · ✓
A consulta los códigos de B                         · 403      · 403      · ✓
sin cuenta: consulta los códigos de A               · 403      · 403      · ✓
B borra un código de A                              · 403      · 403      · ✓

## Espacio del profesor

comprobación                                        · esperado · obtenido · ✓/✗
A lista su progreso libre sin espacio creado        · 200      · 200      · ✓
A crea su espacio                                   · 200      · 200      · ✓
A lee su espacio                                    · 200      · 200      · ✓
B lee el espacio de A                               · 403      · 403      · ✓
B escribe el espacio de A                           · 403      · 403      · ✓
sin cuenta: lee el espacio de A                     · 403      · 403      · ✓
A pone 6 lectores                                   · 403      · 403      · ✓
listar practicas-espacios (A)                       · 403      · 403      · ✓

## Configuración de tareas (config/tareas)

comprobación                                        · esperado · obtenido · ✓/✗
A guarda sus tareas                                 · 200      · 200      · ✓
sin cuenta: lee las tareas de A                     · 200      · 200      · ✓
sin cuenta: lista config de A                       · 403      · 403      · ✓
B escribe las tareas de A                           · 403      · 403      · ✓
A guarda config/otra                                · 403      · 403      · ✓

## Lista de nombres cifrada (privado/nombres)

comprobación                                        · esperado · obtenido · ✓/✗
A guarda su lista                                   · 200      · 200      · ✓
A lee su lista                                      · 200      · 200      · ✓
B lee la lista de A                                 · 403      · 403      · ✓
sin cuenta: lee la lista de A                       · 403      · 403      · ✓
A guarda la lista sin sal válida                    · 403      · 403      · ✓
A guarda privado/otra                               · 403      · 403      · ✓

## Progreso de práctica libre (alumno sin cuenta)

comprobación                                        · esperado · obtenido · ✓/✗
alumno de A guarda su progreso                      · 200      · 200      · ✓
alumno de A lee su progreso (get)                   · 200      · 200      · ✓
código de B escribe en el espacio de A              · 403      · 403      · ✓
código que no existe escribe                        · 403      · 403      · ✓
código de 4 escribe en el espacio                   · 403      · 403      · ✓
progreso con un campo de más                        · 403      · 403      · ✓
subcolección «progreso» (nombre viejo)              · 403      · 403      · ✓
sin cuenta: lista el progreso de A                  · 403      · 403      · ✓
A lista su progreso libre                           · 200      · 200      · ✓  (1 documento(s))
B lista el progreso libre de A                      · 403      · 403      · ✓
B borra un progreso de A                            · 403      · 403      · ✓

## Progreso por tarea (alumno sin cuenta)

comprobación                                        · esperado · obtenido · ✓/✗
alumno de A guarda la tarea 2                       · 200      · 200      · ✓
alumno de A la lee (get)                            · 200      · 200      · ✓
código de B escribe en el espacio de A              · 403      · 403      · ✓
id sin «t<n>--»                                     · 403      · 403      · ✓
A lista su progreso por tarea                       · 200      · 200      · ✓
B lista el progreso por tarea de A                  · 403      · 403      · ✓
sin cuenta: lo lista                                · 403      · 403      · ✓

## Asignaciones

comprobación                                        · esperado · obtenido · ✓/✗
A asigna la tarea 2 a su alumno                     · 200      · 200      · ✓
alumno de A lee su asignación (get)                 · 200      · 200      · ✓
A asigna en su espacio a un código de B             · 403      · 403      · ✓
B asigna en el espacio de A                         · 403      · 403      · ✓
sin cuenta: escribe una asignación                  · 403      · 403      · ✓
A lista sus asignaciones                            · 200      · 200      · ✓
B lista las asignaciones de A                       · 403      · 403      · ✓

## Registro de fallos (alumno sin cuenta)

comprobación                                        · esperado · obtenido · ✓/✗
alumno de A registra un fallo                       · 200      · 200      · ✓
código de B registra en el espacio de A             · 403      · 403      · ✓
id de un código y alumno de otro                    · 403      · 403      · ✓
fallo con un campo de más                           · 403      · 403      · ✓
fallo con tarea = 1024                              · 403      · 403      · ✓
fallo con código de 4                               · 403      · 403      · ✓
sin cuenta: lee un fallo                            · 403      · 403      · ✓
sin cuenta: cambia un fallo                         · 403      · 403      · ✓
A lista sus fallos                                  · 200      · 200      · ✓  (1 documento(s))
B lista los fallos de A                             · 403      · 403      · ✓

## Lectores (B, lector del espacio de A)

comprobación                                        · esperado · obtenido · ✓/✗
A pone a B de lector                                · 200      · 200      · ✓
B lista el progreso libre de A                      · 200      · 200      · ✓
B lista el progreso por tarea de A                  · 200      · 200      · ✓
B lista las asignaciones de A                       · 200      · 200      · ✓
B lista los fallos de A                             · 200      · 200      · ✓
B lee la lista de nombres de A                      · 403      · 403      · ✓
B lee el espacio de A                               · 403      · 403      · ✓
B escribe las tareas de A                           · 403      · 403      · ✓
B asigna en el espacio de A                         · 403      · 403      · ✓
B borra un fallo de A                               · 403      · 403      · ✓
B consulta los códigos de A                         · 403      · 403      · ✓
A quita a B de lector                               · 200      · 200      · ✓
B ya no lista el progreso de A                      · 403      · 403      · ✓

## Limpieza (el dueño borra lo suyo)

comprobación                                        · esperado · obtenido · ✓/✗
A borra el fallo                                    · 200      · 200      · ✓
A borra la asignación                               · 200      · 200      · ✓
A borra el progreso por tarea                       · 200      · 200      · ✓
A borra el progreso libre                           · 200      · 200      · ✓
A borra su lista de nombres                         · 200      · 200      · ✓
A borra sus tareas                                  · 200      · 200      · ✓
A borra su espacio                                  · 200      · 200      · ✓
A borra sus códigos                                 · 200      · 200      · ✓
B borra su código                                   · 200      · 200      · ✓

120 de 120 comprobaciones como se esperaba.
Códigos de prueba de esta ejecución (inventados): ZZ2Z8GLT, ZZ6X9ZTJ, ZZSAEH8A, ZZL2XCDF.
Quedan en la nube:
- una solicitud de la cuenta desechable en practicas-solicitudes (solo la borra el administrador, desde su panel o la consola)
```

Código de salida: 0.

## App de hoy (modo antiguo) en el navegador

`npm run servir` → http://localhost:8080/practicas/semaforo/?c=7NPD (código 60): carga el
progreso de la nube (`GET practicas/semaforo--7NPD` → 200), un ítem del ejercicio 3 acertado y
el progreso sube (`PATCH practicas/semaforo--7NPD` → 200). Consola sin errores.

## Lo que no se ha probado

- Nada como **administrador** (la cuenta de Google de Juan Luis): que `esAdmin()` no lea el
  espacio se comprueba leyendo las reglas (fila «esAdmin/esProfesor no aparecen en el espacio» y
  «ningún comodín ** alcanza el espacio»), no por REST. Lo probará la 69 con el panel.
- Un profesor **de baja** (`activo: false`): el banco lo prueba con `--baja` cuando Juan Luis
  ponga a B de baja en la consola. Sin alta (documento que no existe) sí está probado, con la
  cuenta desechable; las dos situaciones pasan por la misma función `activo()`.
- La solicitud y el alta con cuenta de **Google** (las de prueba son de correo y contraseña).

## Lo que queda en la nube

- `practicas-solicitudes/<uid de la cuenta desechable>` (solo la borra el administrador; la
  cuenta ya está borrada). Se borra desde la consola si se quiere.
- `practicas-profesores/<uid A>` y `<uid B>` (las altas de prueba; hacen falta para volver a
  pasar el banco en la 64 y la 69).
- Las dos cuentas de prueba de Authentication.
