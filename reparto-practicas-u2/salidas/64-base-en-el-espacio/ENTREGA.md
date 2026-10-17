# Entrega de la tarea 64 · Varios profesores, N4: la base y el registro de fallos en el espacio del profesor

Sesión `s-20261017T164354-d4766809`. Commit **`13e0f39`**.

## Ficheros entregados (git show --stat 13e0f39)

- `practicas/_comun/base.js` (+180 −52 en total con los demás): entrada con 4 u 8 caracteres,
  `resolverCodigo` (de la 62) al entrar con 8, ubicación en el espacio, ámbito con las tareas
  del profesor, reintento sin red.
- `practicas/_comun/registro.js`: los fallos de un código de 8 van a
  `practicas-espacios/{uid}/fallos`; sin profesor conocido esperan en la cola.
- `practicas/_comun/textos.js`: `entrada_no_existe` (es/en, la frase del diseño) y dos frases
  de la entrada sin «4 caracteres» (ver «Cambios visibles en el modo antiguo»).
- `tests/practicas-comun.test.js` y `tests/practicas-registro.test.js`: 6 tests nuevos y uno
  adaptado.

## Por dónde pasa el código del alumno (el «dibujo» que pedía la ficha)

1. Entrada (`?c=`, `practicas.codigo` o lo tecleado) → `entrar(texto)` → `modoDeCodigo`:
   4 → `codigoAlumno(indice)`, `estado.espacio = null`, `fijarAmbito(TAREAS)`;
   8 → `resolverCodigo` → `estado.espacio = { profesor, n, config, sinConfig }`,
   `fijarAmbito(config.tareas)` (o la tarea supuesta si no se sabe).
2. `ubicacion()` = `ubicacionProgreso(slug, código, tareaDelProgreso, estado.espacio?.profesor)`:
   clave del navegador (la misma de siempre) y `{ coleccion, id }` de la nube (`null` si es un
   código de 8 sin profesor).
3. `leerYFusionar` → `leerNube(…, nube)`; `subir` → `subirFusionado(…, { ultimo, ...nube })`.
4. `anotarFallo` → `registrarFallo(datosFallo(…), { profesor })` → cola → `coleccionFallo`
   (`fallos`, el espacio, o esperar).

## Qué hace

| Situación | Lo que pasa |
|---|---|
| Código de 4 (`7NPD`) | Todo como antes: `practicas/`, `practicas-tareas/`, `fallos/`, tareas de `tareas.js`. Ninguna lectura del espacio |
| Código de 8 que existe | `GET practicas-alumnos/{código}`, `GET …/config/tareas`, y el progreso en `practicas-espacios/{uid}/progreso-libre/{slug}--{código}` o `…/progreso-tareas/t{id}--{slug}--{código}`; fallos en `…/fallos/{código}-{t36}-{azar}` |
| Código de 8 que no existe | Vuelve a la entrada con «Ese código no existe. Copia el de tu correo o usa tu enlace»; lo olvida del navegador y lo quita de la dirección |
| Código de 8 sin red y sin copia | Deja practicar; guarda en el navegador (misma clave); no pide nada más; los fallos esperan en la cola. Al volver a la pestaña en el menú (o al entrar otra vez) pregunta de nuevo, sube lo hecho y manda los fallos |
| Enlace de tarea con código de 8 | El ámbito sale de las tareas **de su profesor**: su tarea 1 (v2) va a `progreso-tareas/t1--…`, aunque la tarea 1 de `tareas.js` sea `progresoPorPractica` |

La entrada acepta el código con o sin guion y en minúsculas (`maxlength` 12 para que quepa
`K7QM-P3XA` pegado con espacios).

## Lo comprobado, con su resultado

**Tests**: `node --test tests/practicas-comun.test.js tests/practicas-registro.test.js` → 60 de
60; `npm test` → 830 de 830.

**Navegador** (Chrome, servidor local con una página de prueba que sustituye Firestore por uno
falso en memoria y anota cada petición; código inventado `K7QMP3XA` del profesor de prueba
`uidProfesorA0001`; la página y el servidor quedaron en el scratchpad de la sesión, fuera del
repositorio). Peticiones anotadas, literales:

- Entrar con `?c=K7QM-P3XA`: `GET practicas-alumnos/K7QMP3XA`,
  `GET practicas-espacios/uidProfesorA0001/config/tareas`,
  `GET practicas-espacios/uidProfesorA0001/progreso-libre/semaforo--K7QMP3XA`.
- Un fallo en el ejercicio 1: `POST practicas-espacios/uidProfesorA0001/fallos/K7QMP3XA-mvcnbtxn-0vbc`
  (campo `alumno` = `K7QMP3XA`).
- A la quinta respuesta: `GET` y `PATCH …/progreso-libre/semaforo--K7QMP3XA`.
- «Otro aparato» (borrado todo `practicas.*` del navegador y recarga): el menú enseña
  «4/10 puntos», leído del espacio.
- `?c=K7QMP3XA&ejercicio=1&semana=1&num=1`: `GET …/progreso-tareas/t1--semaforo--K7QMP3XA`, el
  fallo lleva `tarea: 1`, y el botón dice «← Tarea de la semana».
- `?c=ZZZZ-ZZZZ`: aviso «Ese código no existe…»; tecleando después `k7qm-p3xa` entra.
- Sin red (`fetch` que falla) y sin copia: deja practicar (1 fallo y 4 aciertos, 4 puntos en el
  navegador), cero peticiones con éxito, el fallo en la cola con `profesor: null`. Vuelve la red
  y `visibilitychange` en el menú: `GET practicas-alumnos/…`, `GET …/config/tareas`,
  `GET`+`PATCH …/progreso-libre/…`, `POST …/fallos/K7QMP3XA-mvcndkt9-umr3`; cola vacía.
- Modo antiguo, `?c=7NPD&ejercicio=1&semana=1`: `GET practicas/semaforo--7NPD` y
  `POST fallos/7NPD-…` (la tarea 1 sigue con el progreso de la práctica);
  `?c=7NPD&ejercicio=3&semana=2`: `GET practicas-tareas/t2--semaforo--7NPD`. Ninguna petición
  a `practicas-alumnos` ni a espacios.
- En inglés (`?idioma=en`): «That code does not exist. Copy the one in your email or use your link.»

**No comprobado**: contra la nube real con el profesor de prueba A de la 61 (la ficha lo pedía):
esta sesión no tiene las cuentas de prueba (van por variables de entorno que solo tiene Juan
Luis). Las rutas, los ids y los campos se comparan en los tests con las reglas publicadas de
`firestore.rules` (patrones de `progreso-libre`, `progreso-tareas` y `fallos/{id}` del espacio,
`hasAll`/`hasOnly`), pero falta ver un 200 de verdad. Queda para la 69 (revisión de extremo a
extremo), o para una sesión con `PROFE_A_EMAIL`/`PROFE_A_CLAVE`: crear un código para A
(`practicas-alumnos/{código}` con `n`), abrir `practicas/semaforo/?c=<código>` y mirar en la
consola de Firebase. Tampoco a 375 px: la ventana de Chrome no se dejó estrechar; el marcado de
la entrada es el de antes salvo el texto y `maxlength`.

## Cambios visibles en el modo antiguo

Solo de texto, en la pantalla de entrada (la de la base y la de `semana.js`, que usa las
mismas frases): «Es el código de 4 caracteres que te ha dado tu profesor» → «Es el código que
te ha dado tu profesor», y «Ese código no es correcto. Revísalo: son 4 letras o números» →
«…Revísalo letra a letra» (igual en inglés). Con códigos de 8 en circulación, decir «4» confunde
a los alumnos de los compañeros. Rutas, claves, formato y `codigoTarea`: sin cambios.

## Para las tareas siguientes

- **65 (portada y página de la tarea)**: `sincronizarGuardado(slug, código, { tareaId, profesor })`
  ya va al espacio con `profesor` (sin él, con un código de 8, no pregunta a nadie y devuelve
  `estado: 'error'`); `progresoGuardado` no cambia (las claves del navegador son las mismas). El
  `<input>` de `semana.js` sigue con `maxlength="8"`: con guion (`K7QM-P3XA`, 9) no cabe. Y
  `semana.js`/`portada.js` aún leen el código con `leerCodigoAlumno` (solo 4).
- **66/69**: `leerFallos` de `registro.js` sigue leyendo solo `fallos/` (modo antiguo); la
  lectura de los fallos del espacio está en `src/firebase.js` (63).
- La ficha de la 64 decía `…/progreso/…`; lo publicado es `progreso-libre` (nota de la 61), y es
  lo que usa la base.
