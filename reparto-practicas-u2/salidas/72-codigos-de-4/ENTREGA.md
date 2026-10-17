# Entrega de la tarea 72 · Códigos de 4 u 8 y el modo decidido por la nube

Sesión `s-20261017T203326-a548941f` (PU2 T72, ALTO), 2026-10-17, atendida.
Commit del código: **`fb6fef0`** (subido a `main`). Reglas **publicadas por Juan Luis** el 17-10
(~21:00Z; comprobado: `get practicas-alumnos/ZZAB` sin cuenta pasó de 403 a 404).

## Qué cambia

- **Formato y sistema, separados** (`practicas/_comun/codigos.js`). `modoDeCodigo` desaparece
  (a propósito: quien lo siguiera importando falla al cargar, en vez de equivocarse en silencio):
  - `formatoDeCodigo(texto)` → `'4'`, `'8'` o `null` (solo el formato, 4 u 8 símbolos de `ALFABETO`);
  - `esCodigoAntiguo(texto)` → uno de los 1024 calculables (los de `codigoAlumno`);
  - `leerCodigoSecreto` acepta 4 u 8; `mostrarCodigoSecreto('K7QM')` = `K7QM`;
  - `codigoSecreto(longitud = 8, azar)` acepta 4 u 8; con 4 descarta los calculables y sortea otro.
    **La firma cambia**: el azar inyectado pasa a ser el segundo argumento.
  - `limpiar(null)` daba `'NULL'` (¡4 símbolos válidos!); ahora `null`/`undefined` son «nada».
- **El sistema lo decide la nube** (`resolverCodigo`, `practicas/_comun/espacio.js`):
  - código de 8, o de 4 sin el control antiguo: como hasta ahora (búsqueda → nuevo o `no-existe`);
  - código de 4 **antiguo**: búsqueda primero; registrado → sistema nuevo (su profesor, su `n` desde 1,
    sus tareas); 404 → `{ modo: 'antiguo', n: índice }` y se recuerda **una hora** en el navegador
    (`practicas.v1.antiguo.<código>`, `VIGENCIA_ANTIGUO`) para no preguntar en cada página;
  - sin red, 403 (reglas sin publicar) o nube caída: la copia del navegador si se sabe que está
    registrado; si no, modo antiguo (código antiguo) o `sin-red` (los demás). Sin respuesta no se recuerda nada.
- **Base y páginas** (`base.js`, `vista-tareas.js`, `portada.js`, `semana.js`): todas pasan por
  `resolverCodigo`/`identificar`; nadie decide ya por la longitud (lo vigila un test).
  - `ubicacionProgreso`: con profesor, su espacio; sin profesor, las colecciones de siempre **solo**
    si el código es antiguo; cualquier otro, sin nube (las reglas antiguas aceptan cualquier código de 4
    símbolos: un código de 4 generado nunca debe acabar ahí).
  - `registro.js` (`coleccionFallo`): con profesor (del fallo o de la copia), su espacio; sin él, `fallos`
    si es antiguo y la cola si no.
  - La portada pinta al momento con la copia del navegador (o como antigua) y corrige al resolver.
- **Configuración del profesor** (`tareas.js`): `longitudCodigo` (4; sin el campo, 8).
  `configDeJSON`/`configAJSON` solo lo llevan si es 4 (el JSON de siempre no cambia);
  `longitudDeCodigos(config)`; `erroresConfig` rechaza otra longitud.
- **Panel** (`profesor.html`, `profesor.js`): en «Mis alumnos», «Longitud de los códigos nuevos:
  8 (más seguro) / 4 (más fácil de recordar)» con una línea que explica la diferencia; se guarda en
  `config/tareas` (solo con la configuración ya leída y entendida) y «Generar códigos» la usa. Los ya
  repartidos no cambian. `profesor-tareas.js` conserva los campos que no son suyos al guardar.
- **`src/firebase.js`**: `crearCodigos` acepta 4 u 8; `n` hasta 1023 (antes 250) en crear y cambiar.
- **Reglas** (solo la sección de varios profesores): `codigoSecreto(c)` = 4 u 8; ids de
  `progreso-libre`, `progreso-tareas`, `fallos` y el campo `alumno`, igual; `practicas-alumnos.n`
  de 1 a 1023 al crear y al cambiar. El modo antiguo, intacto.

Ficheros (`git show --stat fb6fef0`, 20): `firestore.rules`, `herramientas/probar-reglas.mjs`,
`practicas/_comun/{base,codigos,espacio,registro,tareas}.js`, `practicas/{portada,profesor-tareas,profesor,semana,vista-tareas}.js`,
`practicas/profesor.html`, `src/firebase.js`, `tests/practicas-{codigos-4 (nuevo),comun,espacio,nube,registro,semana}.test.js`.
**Fuera de la lista de la ficha** (los cuatro de tareas cerradas, sin reclamo vivo): `registro.js` y
`src/firebase.js` (decidían por la longitud), `profesor.html` (el ajuste) y `profesor-tareas.js` (sin
el cambio, guardar una tarea borraba la longitud elegida). `textos.js` y `resultados.js` no hizo falta tocarlos.

## Lo comprobado

- `npm test`: **884 de 884** (antes del commit). `tests/practicas-codigos-4.test.js` (nuevo, 5 tests):
  de punta a punta con la `resolverCodigo` real y un `fetch` falso — antiguo no registrado = exactamente
  `contextoAntiguo` y las colecciones de siempre; registrado = su espacio (y al borrarse, vuelve);
  generado de 4 nunca a las colecciones antiguas; ningún fichero de `practicas/` usa `modoDeCodigo` ni
  `LONGITUD_SECRETO`; las reglas. En `practicas-espacio.test.js`: `codigoSecreto(4)` con 20 000 sorteos
  y el descarte forzado, los 1024 antiguos contados, `formatoDeCodigo`, la configuración con y sin
  `longitudCodigo`, y `resolverCodigo` con un código de 4 (404 + vigencia de una hora y reloj atrasado,
  registrado, sin red / 403 / 500 con y sin copia, sin almacén, generado de 4).
- **Navegador** (Chrome, servidor local, proyecto real, **antes** de publicar las reglas):
  `semaforo/?c=7NPD`, `semana.html?t=1&c=7NPD` y la portada: modo antiguo con su progreso de la nube,
  sin errores en la consola; peticiones: `practicas-alumnos/7NPD` (403) y `practicas/semaforo--7NPD`.
  `semaforo/?c=ZZAB`: búsqueda 403 → se practica solo en el navegador, sin escribir en `practicas/`.
  Después de publicar, el mismo `get` da 404 (→ «Ese código no existe»).
- **Banco REST** (`herramientas/probar-reglas.mjs`, ampliado; lanzado por Juan Luis desde Terminal con
  dos cuentas de prueba nuevas): **154 de 154** como se esperaba. Sección nueva «Códigos de 4 (tarea 72)»,
  literal:

```
A crea un código de 4 (n.º 3)                       · 200      · 200      · ✓
B crea un código de 4 (n.º 2)                       · 200      · 200      · ✓
B se queda el código de 4 de A                      · 403      · 403      · ✓
sin cuenta: get del código de 4                     · 200      · 200      · ✓  (n = 3)
alumno de 4 de A guarda su progreso                 · 200      · 200      · ✓
alumno de 4 de A lo lee (get)                       · 200      · 200      · ✓
alumno de 4 de A guarda la tarea 2                  · 200      · 200      · ✓
alumno de 4 de A la lee (get)                       · 200      · 200      · ✓
alumno de 4 de A registra un fallo                  · 200      · 200      · ✓
A asigna la tarea 2 a su alumno de 4                · 200      · 200      · ✓
alumno de 4 de A lee su asignación (get)            · 200      · 200      · ✓
código de 4 de B escribe en el espacio de A         · 403      · 403      · ✓
código de 4 de B registra un fallo en A             · 403      · 403      · ✓
B asigna en el espacio de A a un código de 4        · 403      · 403      · ✓
A asigna en su espacio a un código de 4 de B        · 403      · 403      · ✓
A lista su progreso libre (con el de 4)             · 200      · 200      · ✓  (2 documento(s), con semaforo--ZZM5)
A consulta sus códigos (con el de 4)                · 200      · 200      · ✓  (el suyo sí, el de B no)
B lista el progreso libre de A                      · 403      · 403      · ✓
B borra el código de 4 de A                         · 403      · 403      · ✓
A crea un código de 4 con n = 1000                  · 200      · 200      · ✓
A registra el código antiguo de prueba              · 200      · 200      · ✓
su alumno guarda en el espacio de A                 · 200      · 200      · ✓
y lo lee (get)                                      · 200      · 200      · ✓
y registra un fallo en A                            · 200      · 200      · ✓
el modo antiguo sigue leyéndose                     · 200 o 404 · 200      · ✓
A borra su progreso en el espacio                   · 200      · 200      · ✓
A lo borra                                          · 200      · 200      · ✓
ya no escribe en el espacio de A                    · 403      · 403      · ✓
```

  Además, en «Códigos de los alumnos»: `n = 1024` → 403, `n.º 2` → 1023 → 200, → 1024 → 403, códigos de
  5 y 7 → 403. El resto, como en la 61 (código de 4 sin registrar en el espacio → 403). Final literal:
  «154 de 154 comprobaciones como se esperaba. … Quedan en la nube: una solicitud de la cuenta desechable
  en practicas-solicitudes». Las cuentas de prueba de la 61 ya no entraban (INVALID_LOGIN_CREDENTIALS);
  Juan Luis creó dos nuevas y las dio de alta.

## NO comprobado (honesto)

- La prueba en el **navegador** con `7NPD` registrado en el espacio de A (la ficha la pedía): lo cubren
  el banco REST (registrar, escribir, leer, fallo, borrar) y los tests de punta a punta, pero no la
  página con el SDK real. Para la 69.
- El ajuste de longitud del panel en el navegador (necesita entrar con Google): para la 69.

## Para las tareas siguientes

- **70**: `herramientas/informe-actividad.mjs` (`--codigos`) solo reconoce códigos de 8
  (`/^[A-HJ-NP-Z2-9]{8}$/`, línea ~333): con los códigos de 4 de Juan Luis hay que ampliarlo (está en su
  ficha). `crearCodigos` ya acepta los de 4 antiguos y `n` hasta 1023 (AJJN = 1000).
- **70**: un alumno que entró en modo antiguo lo recuerda **una hora**; justo después del paso, durante
  esa hora, aún escribe en las colecciones antiguas. O se hace el paso de noche (como prevé la ficha), o se
  recopia después lo que llegue a `practicas/` y `practicas-tareas/` esa hora.
- **69**: probar en el navegador lo de arriba; borrar la solicitud de la cuenta desechable.

## Cómo probarlo en un minuto

`npm test`; `node --test tests/practicas-codigos-4.test.js tests/practicas-espacio.test.js`.
En el navegador: `npm run servir` → http://localhost:8080/practicas/semaforo/?c=7NPD (modo antiguo,
como siempre) y …/?c=ZZAB («Ese código no existe»).
