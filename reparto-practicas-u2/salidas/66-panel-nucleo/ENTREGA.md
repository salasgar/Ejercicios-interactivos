# Entrega de la tarea 66 · Varios profesores, N6: panel, núcleo

Sesión `s-20261017T170731-ac14a523`. Commits **`02585c8`** (el panel) y **`89eb25e`** (el código
de resultado de un alumno de 8 lleva `n`, como lo escribe la 65).

## Ficheros (git show --stat 02585c8 89eb25e)

- `practicas/profesor.html`: barra con el selector «Sistema actual / Sistema nuevo» (solo el
  administrador), cuenta y «Salir»; pantalla «Entrar»; el panel de hoy envuelto en
  `#modo-antiguo` **sin cambiar una letra**; `#modo-nuevo` con «Profesores», «Mis alumnos»,
  «Hoy» (`#panel-hoy`) y «Tareas» (`#tabla-tareas-espacio` + `#editor-tareas`); las vistas
  (Resultados, Asignar tareas, Fallos) en `#vistas`, comunes; CSS de impresión de las tarjetas.
- `practicas/profesor.js`: una «fuente» por sistema (`antigua`, `espacio`) con nombres,
  códigos, tareas y datos; las vistas de hoy leen de `fuente`. Entrar y alta, «Profesores»,
  «Mis alumnos» (generar códigos, CSV, tarjetas, lista cifrada), caché en IndexedDB y lectura
  de solo lo nuevo, y la llamada a los dos esqueletos.
- `practicas/_comun/cifrado.js` (nuevo): PBKDF2-SHA-256 600 000 vueltas, sal de 16 bytes al
  azar → AES-GCM 256, iv de 12 bytes al azar; `{ v: 1, sal, iv, cifrado }` en base64;
  `ContrasenaIncorrecta`; contraseña de 10 caracteres como mínimo.
- `practicas/profesor-tareas.js`, `practicas/profesor-hoy.js` (nuevos, esqueleto):
  `montar(contenedor, contexto)` vacío; `contexto` documentado en `profesor-tareas.js`.
- `practicas/resultados.js`: `leerDocumentos`/`leerAsignaciones` con `indiceDe` (por defecto, el
  del modo antiguo) y las colecciones `progreso-libre`/`progreso-tareas`; nuevas
  `indicesDeCodigos`, `filasMisAlumnos`, `faltanCodigos`, `repartirCodigos`, `fusionarLeidos`,
  `desdeParaLeer` (`MARGEN_LECTURA` = 2 días), `leerCodigoTareaEspacio`.
- `tests/practicas-cifrado.test.js` (nuevo, 5 tests) y `tests/practicas-resultados.test.js`
  (+7 tests).

## Cómo funciona, en corto

- **Qué sistema abre la página**: el último usado en ese navegador
  (`practicas.profesor.modo`); la primera vez, el actual si hay lista del panel antiguo
  (`divisores.profesor.lista`, los navegadores de Juan Luis) y el nuevo si no. El actual abre
  como siempre, **sin cargar Firebase** y sin entrar; la pantalla «Entrar» tiene un botón
  «Abrir el sistema actual» por si la red bloquea Google.
- **Entrar** (`estadoProfesor()`): sin alta → «Aún no tienes acceso. Juan Luis tiene que darte
  de alta», deja la solicitud (`pedirAlta`) y ofrece «Volver a comprobar» / «Entrar con otra
  cuenta»; de baja → «Tu acceso está desactivado»; activo → su espacio, sin selector;
  administrador → selector y «Profesores».
- **El administrador también tiene espacio** (A.4): al abrirlo, si no está en
  `practicas-profesores` como activo, se da de alta a sí mismo (las reglas lo piden para
  `esDueno`).
- **«Profesores»**: las solicitudes no se borran al dar de alta (son lo único que guarda el
  correo y el nombre de cada uno); «Pendientes» = solicitudes sin fila en
  `practicas-profesores`. «Rechazar» sí borra la solicitud.
- **«Mis alumnos»**: la línea es el número de lista; `indice = n − 1` en todo el panel, igual
  que en el modo antiguo. «Generar códigos» reparte con `codigoSecreto` y `crearCodigos` (hasta
  5 vueltas si alguno choca). CSV: número, nombre, código (`K7QM-P3XA`), enlace. Tarjetas:
  nombre, código y enlace a la portada, con `window.print()`.
- **Lista cifrada**: en el navegador, la lista sin cifrar (`practicas.profesor.<uid>.lista`) y
  lo último subido o bajado (`…lista-subida`: texto y fecha). Al abrir, si en la nube hay una
  lista más nueva (o la de aquí está vacía) pide la contraseña. Guardar pide dos veces la
  contraseña; en la misma visita recuerda la de antes **en memoria** (nunca se guarda). Si en
  la nube hay una más nueva sin descifrar, el primer clic avisa y el segundo sustituye.
- **Caché y solo lo nuevo**: IndexedDB `practicas-panel-<uid>`, un almacén por colección
  (`progreso-libre`, `progreso-tareas`, `asignaciones`, `fallos`). Al abrir: la caché al
  momento y después `leerDesde(sub, último actualizado − 2 días)` (el margen, por si el reloj
  de un alumno va atrasado: `actualizado` lo pone su aparato). Los fallos, desde el día elegido,
  con la misma idea. «Volver a leer todo» vacía la caché.
- **Las vistas de hoy** (Resumen, prácticas, Tareas de la semana, Retrasos, Qué falla más,
  Asignar tareas, Fallos uno a uno, CSV) sobre los datos del espacio y `config.tareas`. Los
  avisos y los códigos pegados de cada sistema se guardan al cambiar de uno a otro.

## Lo comprobado, con su resultado

**Tests**: `node --test tests/practicas-comun.test.js tests/practicas-resultados.test.js
tests/practicas-cifrado.test.js` → 68 de 68 (antes de la corrección); `npm test` → **851 de
851**, 0 fallos (con los commits de la 65 ya en el árbol).

**Navegador** (Chrome; servidor local en el scratchpad que sirve el repositorio y cambia
`src/firebase.js` por uno falso: `crearAccesoPanel` **real** de la 63 sobre un Firestore en
memoria en el servidor, compartido entre pestañas, que imita lo esencial de las reglas: dueño
activo para el espacio, administrador para listar profesores y solicitudes, `profesor ==` para
listar códigos. Tres orígenes, `localhost`, `127.0.0.1` y `[::1]`, como tres ordenadores.
Nombres inventados «Prueba Uno, Ana»…; ninguna cuenta ni código real):

- Profesor B y profesor A sin alta: «Aún no tienes acceso. Juan Luis tiene que darte de alta»
  y «Le ha llegado tu solicitud con tu correo (profe.b@prueba.example)…».
- Administrador: «Solicitudes» con A y B; «Dados de alta» con «Tú … activo» (se dio de alta
  solo); «Dar de alta» a los dos → «No hay solicitudes pendientes» y A y B «activo».
- A: sin selector ni «Profesores»; pega 3 nombres → «Generar códigos (3 sin código)» → «3
  códigos nuevos, guardados en la nube…»; en la nube, `n=1,n=2,n=3`. Contraseña «corta» →
  «La contraseña tiene que tener al menos 10 caracteres.»; distintas → «Las dos contraseñas no
  coinciden.»; bien → «Guardada en la nube, cifrada (17/10, 19:27).» El documento de la nube
  tiene solo `v, sal, iv, cifrado, actualizado` y no contiene ningún nombre.
- A en «otro ordenador» (`[::1]`, nada en el navegador): las 3 filas «(no está en la lista)»
  con su código y el aviso «Tu lista de nombres está guardada cifrada en la nube…»; contraseña
  mala → «Esa no es la contraseña de la lista…»; buena → la lista, los nombres en su código.
  Lee solo sus 2 documentos sembrados (no el del espacio de B). Resumen, «Qué falla más» y
  «Fallos, uno a uno» con esos datos.
- Solo lo nuevo: un documento sembrado con `actualizado` de hace 5 días **no** entra al recargar
  (2 registros); «Volver a leer todo» → 3. Al recargar, la sesión y la lista siguen sin pedir
  contraseña.
- Con la plantilla del curso como configuración de A (una tarea marcada «asignada» a mano):
  «Tareas» con 8 filas, «Tareas de la semana» con sus columnas, «Asignar tareas» → «Guardadas
  las asignaciones de 1 alumno»; en la nube, `practicas-espacios/<A>/asignaciones/<código del
  n.º 2>` = `[2]`.
- B (activo): su espacio vacío, «Aún no tienes tareas.», 0 registros. El administrador, en su
  espacio: 0 registros (no ve los de A). «Dar de baja» a B → B: «Tu acceso está desactivado…».
- Tarjetas (con `window.print` sustituido): 3 tarjetas «Prueba Uno, Ana · Tu código: XXXX-XXXX ·
  …/practicas/?c=…». Sin errores en la consola.
- **Sistema actual idéntico**: la versión anterior (`git show HEAD:practicas/profesor.*`)
  servida al lado y comparada con la nueva con la misma lista: el texto de la página, 135
  líneas, **ninguna diferencia**; las **46 vistas** del desplegable «Ver» (con dos códigos de
  tarea pegados y uno no válido), «Asignar tareas» y el filtro de fallos, **iguales**. Abre sin
  pedir ninguna petición a Firebase. El administrador carga la nube en el actual, pasa al nuevo
  (avisos y pegados vacíos, «Volver a leer todo» visible) y vuelve (sus pegados y su aviso,
  restaurados).

## NO comprobado (honesto)

- **Contra el proyecto real**: no hay cuentas de prueba en esta sesión (como en la 63 y la 64).
  Lo de arriba usa la `crearAccesoPanel` real, pero sobre un Firestore falso: falta ver con el
  SDK de verdad las reglas (sobre todo `crearCodigos` en transacción, `leerDesde` con `where`, y
  la autoalta del administrador). Ni con la cuenta de Juan Luis: **que él abra el panel** y
  mire que el sistema actual está igual y que «Profesores» sale. Queda para la 69.
- A 375 px: la ventana de Chrome no se deja estrechar (lo mismo le pasó a la 64). El marcado
  nuevo usa `flex-wrap` y las tablas van en `.tabla`, como el resto del panel.
- `window.print()` de verdad (el diálogo bloquea la automatización): solo el contenido.

## Para las tareas siguientes

- **67 y 68**: solo tocan su módulo; `contexto` está documentado en `profesor-tareas.js`. Al
  guardar tareas, la 67 llama a `contexto.cambiarConfig(config)` y el panel repinta enlaces,
  vistas y «Asignar tareas». `contexto.alCargar(fn)` avisa al terminar cada lectura de la nube.
- **69**: el código de resultado de un alumno de 8 lleva `n` (desde 1; lo decidió la 65 en
  `vista-tareas.js`), y el del modo antiguo la posición (desde 0). El panel lo resuelve con
  `leerCodigoTareaEspacio`; conviene dejarlo escrito en la documentación.
- **Lectores** (la cuenta del informe, F.3): el panel aún no tiene dónde añadirlos
  (`guardarLectores` existe en la 63). No estaba en esta ficha: lo necesita la 68 o la 70.
