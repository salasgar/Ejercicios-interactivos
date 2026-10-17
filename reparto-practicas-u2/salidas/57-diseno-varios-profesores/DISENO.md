# Diseño de la app para varios profesores (tarea 57 del reparto PU2)

Sesión `s-20261017T085824-72f01790`, 2026-10-17, atendida con Juan Luis delante (dos rondas
de preguntas). Cada punto lleva **[decidido por Juan Luis el 2026-10-17]**, **[decidido por
Juan Luis el 2026-10-17, antes de esta tarea]** (lo que contestó a la coordinadora y la ficha
da por cerrado), **[propuesta pendiente]** (lo propone esta sesión; queda aprobado o no con el
diseño entero) o **[hecho del código]** (no se decide: es así hoy, comprobado en `main` a las
09:00 UTC del 17-10, con las tareas 49-54 cerradas).

**Aprobado entero por Juan Luis el 2026-10-17**, al final de la conversación, después de leer
este documento. Los puntos **[propuesta pendiente]** quedan aprobados con el diseño: la
etiqueta dice solo que la idea fue de esta sesión y no suya. Siguen pendientes de él, aparte,
tres cosas que no son de diseño: la fecha en que empiezan sus compañeros (H.1), el día de enero
de su migración (E.1) y la consulta en el centro sobre protección de datos (G). Si al
implementar algo resulta mal pensado, la sesión que lo implemente lo propone en su terminada y
no lo cambia por su cuenta.

Construye sobre el modelo de tareas v2 (`salidas/45-diseno-tareas-v2/DISENO.md`, implementado
en las tareas 49-54) y no cambia nada de lo que este decidió. Lo único que cambia es **dónde
viven** los datos y **cómo se llama** cada alumno.

Lo que cambia, en una frase: cada profesor entra en el panel con su cuenta de Google y tiene
un **espacio propio** en la nube con sus alumnos, sus tareas, sus fechas y sus resultados;
cada alumno entra con un **código secreto de 8 caracteres** que genera el panel de su
profesor y que no se puede calcular; los nombres viajan **cifrados** con una contraseña que
solo sabe cada profesor.

Glosario para lo de abajo: *espacio* = la parte de la nube de un profesor; *código secreto*
= el código nuevo, de 8 caracteres al azar; *código antiguo* = el de 4 caracteres, sacado del
número de lista con `codigoAlumno`; *modo antiguo* = todo lo de hoy (códigos antiguos,
colecciones `practicas`, `practicas-tareas`, `practicas-asignaciones` y `fallos`, tareas en
`tareas.js`).

---

## Lo que hay hoy y por qué no basta

- **[hecho del código]** `firestore.rules` deja leer con `get`, sin cuenta, cualquier documento
  de `practicas/`, `practicas-tareas/` y `practicas-asignaciones/` cuyo id lleve un código
  antiguo. Los 1024 códigos antiguos salen de `codigoAlumno(indice)` (`practicas/_comun/codigos.js`,
  sal pública), así que cualquiera que sepa programar puede leer el progreso de cualquier
  número de lista. Es lo que hace `herramientas/informe-actividad.mjs`.
- **[hecho del código]** `fallos/` ya está cerrado: solo lo lee el profesor (uid fijo en las
  reglas); los alumnos solo crean.
- **[hecho del código]** El panel (`practicas/profesor.js`) lee **las colecciones enteras**
  (`src/firebase.js`: `getDocs(col('practicas'))`, `practicas-tareas`, `practicas-asignaciones`,
  `fallos`). Con un solo profesor de 51 alumnos va bien; con cuatro y unos 400 alumnos, cada
  apertura del panel leería los documentos de todos.
- **[hecho del código]** Un solo profesor: `esProfesor()` en las reglas y `PROFESOR_UID` en
  `src/config.js` llevan el uid de Juan Luis.
- **[hecho del código]** Las tareas y su calendario están en `practicas/_comun/tareas.js`
  (`TAREAS`) y las fechas de las unidades en `catalogo.js` (`UNIDADES`): ficheros del
  repositorio que cambia una sesión de Claude.

Con la separación estricta (un profesor no puede leer los datos de los alumnos de otro, ni
sabiendo programar) **[decidido por Juan Luis el 2026-10-17, antes de esta tarea]**, el código
del alumno tiene que dejar de poder calcularse, y el panel tiene que leer solo lo de su
profesor.

**Lo que no puede prometer ningún diseño [hecho del código]:** Juan Luis es el dueño del
proyecto de Firebase, y desde la consola de Firebase el dueño ve todos los documentos, digan
lo que digan las reglas (las reglas solo valen para la app y para REST). Lo que sí garantiza
este diseño es que en la nube **nunca hay un nombre legible**: códigos, números de lista y
resultados; los nombres van cifrados con la contraseña de cada profesor (F.1). Así, ni desde
la consola se puede saber de quién es cada dato. Se le dijo así a Juan Luis en la conversación.

---

## A. Quién es profesor

1. **Cuenta de Google** (la de murciaeduca de cada uno), con el inicio de sesión que ya tiene el
   panel (`src/firebase.js`, `signInWithPopup`). **[decidido por Juan Luis el 2026-10-17]**
   (lo aceptó con el resto de la propuesta; la ficha ya lo proponía).
2. **Alta sin intercambiar identificadores** **[propuesta pendiente]**:
   - El compañero abre el panel y entra con Google. Si no está dado de alta, el panel le dice
     «Aún no tienes acceso. Juan Luis tiene que darte de alta» y deja una **solicitud** en la
     nube con su correo y su nombre de Google (`practicas-solicitudes/{uid}`).
   - Juan Luis ve en su panel una sección «Profesores» (solo la ve él): las solicitudes, con
     un botón «Dar de alta», y la lista de profesores con «Dar de baja» / «Volver a dar de alta».
   - Dar de alta escribe `practicas-profesores/{uid}` con `{ activo: true, alta }`. Dar de baja
     pone `activo: false`: el compañero deja de poder entrar en su espacio, pero sus datos no
     se borran (los borra él antes, si quiere, o Juan Luis desde la consola).
   - Así Juan Luis no teclea nada: ni uids ni correos.
3. **Juan Luis como administrador no ve los datos de los alumnos de sus compañeros**: solo da
   altas y bajas. En su panel ve únicamente lo suyo. **[decidido por Juan Luis el 2026-10-17]**
   (Con la salvedad de la consola, arriba.)
4. Juan Luis es además un profesor más, con su espacio, igual que los demás.
   **[propuesta pendiente]**
5. El uid de administrador es el que ya está en las reglas (`esProfesor()`); se queda escrito
   en las reglas y en `src/config.js` como hoy. **[hecho del código]**

---

## B. Cómo se identifica el alumno y a qué profesor pertenece

### B.1 Lo decidido: código secreto de 8 caracteres **[decidido por Juan Luis el 2026-10-17]**

Comparadas en la conversación (en llano, como «qué cambia para el alumno»):

| Opción | Para el alumno | Para el profesor | Veredicto |
|---|---|---|---|
| **B1. Código secreto por profesor** | Igual que hoy: sin cuenta, entra con su enlace; si lo teclea, 8 caracteres en vez de 4 | Genera los códigos en su panel | **Elegida** |
| B2. Sesión anónima de Firebase + código | Igual que B1 (al cambiar de aparato hace falta el código igualmente) | Igual, con más piezas | Descartada: lo mismo que B1, más complicado |
| B3. Cuenta de Google del alumno | Iniciar sesión en cada aparato (el móvil de sus padres…); no todos recuerdan la contraseña | Sin códigos | Descartada: los correos de los alumnos (datos personales) acabarían en la nube, y hoy entran sin cuenta |

Cómo es el código **[propuesta pendiente]**:

- 8 símbolos del alfabeto de hoy (`ALFABETO`: sin I, O, 0 ni 1), escritos `K7QM-P3XA` (este es
  un ejemplo inventado). Son 32⁸ ≈ 1,1 billones de códigos posibles para unos 400 alumnos: probar
  códigos al azar no encuentra ninguno en la práctica (y cada prueba es una lectura que se
  nota en la consola).
- Los genera **el navegador del profesor** con `crypto.getRandomValues` (no con `Math.random`),
  al azar, sin fórmula ni sal. No se pueden calcular a partir de nada.
- Sin dígito de control: si el alumno teclea mal, la app no encuentra el código y dice «Ese
  código no existe. Copia el de tu correo o usa tu enlace».
- La longitud distingue los dos sistemas: 4 caracteres, modo antiguo; 8, el nuevo. Mientras
  convivan (apartado E), la app decide por la longitud.

### B.2 A qué profesor pertenece el código **[propuesta pendiente]**

Un documento por alumno en una colección común de **búsqueda**:
`practicas-alumnos/{código}` = `{ profesor: <uid>, n: <número de lista>, alta }`.

- El alumno (sin cuenta) lo lee con `get` al entrar: así la app sabe en qué espacio están
  sus datos y su número de lista (que va dentro del código de resultado de la tarea, como
  hoy). Se guarda en el navegador para no leerlo cada vez.
- Nadie puede **listar** esa colección salvo cada profesor sus propias filas (consulta
  `profesor == su uid`). Sin poder listarla, no hay forma de sacar los códigos de otro.
- La crea el panel del profesor al generar los códigos. Un código ya creado no lo puede
  «quedarse» otro profesor (crear sobre uno que existe es una modificación, y solo la puede
  hacer su dueño).
- El enlace del alumno sigue siendo corto: `semana.html?t=3&c=K7QMP3XA`. No lleva el uid.

### B.3 Lo que sigue igual **[hecho del código]**

- Quien tiene el código de un alumno puede leer y escribir el progreso de ese alumno (es lo
  que le deja seguir desde otro aparato, tarea 38). Es el mismo trato que hoy, pero ahora el
  código hay que **tenerlo**: no se puede calcular.
- El **código de resultado de la tarea** (20 caracteres, `codigoTarea`) no cambia de formato:
  lleva el número de lista del alumno **dentro de la lista de su profesor** y el id de la
  tarea **de ese profesor**. Solo lo interpreta el panel de ese profesor. **[propuesta pendiente]**

---

## C. Dónde viven los datos de cada profesor

### C.1 Colecciones **[propuesta pendiente]**

| Qué | Ruta | Quién lee | Quién escribe |
|---|---|---|---|
| Solicitudes de alta | `practicas-solicitudes/{uid}` = `{ email, nombre, pedido }` | el propio interesado (`get`) y el administrador | el propio interesado |
| Profesores dados de alta | `practicas-profesores/{uid}` = `{ activo, alta }` | el propio profesor (`get`) y el administrador | el administrador |
| Búsqueda de códigos | `practicas-alumnos/{código}` = `{ profesor, n, alta }` | cualquiera con `get`; listar, cada profesor lo suyo | el profesor dueño |
| Espacio del profesor | `practicas-espacios/{uid}` = `{ lectores: [uids], actualizado }` | su dueño | su dueño |
| Sus tareas y fechas | `practicas-espacios/{uid}/config/tareas` = `{ json, actualizado }` | cualquiera con `get` (no hay datos de alumnos) | su dueño |
| Su lista de nombres, cifrada | `practicas-espacios/{uid}/privado/nombres` = `{ v, sal, iv, cifrado, actualizado }` | **solo su dueño** (ni lectores ni administrador) | su dueño |
| Progreso de práctica libre | `practicas-espacios/{uid}/progreso/{slug}--{código}` | el alumno con `get`; listar, el dueño y sus lectores | el alumno (si el código es de ese profesor) |
| Progreso por tarea (v2) | `practicas-espacios/{uid}/progreso-tareas/t{id}--{slug}--{código}` | ídem | ídem |
| Asignaciones | `practicas-espacios/{uid}/asignaciones/{código}` = `{ tareas, actualizado }` | el alumno con `get`; listar, el dueño y sus lectores | el dueño |
| Registro de fallos | `practicas-espacios/{uid}/fallos/{código}-{hora}-{azar}` | el dueño y sus lectores | el alumno, solo crear |

Notas:

- **Mismo formato de documento que hoy** en progreso, progreso por tarea, asignaciones y
  fallos (`estado` JSON + `actualizado`; los mismos campos de `fallos`, con el código de 8).
  Cambia solo la ruta. En `nube.js` la ruta ya es un parámetro (`coleccion`, `id`, de la
  tarea 50): basta con pasar `practicas-espacios/{uid}/progreso` como colección.
- **Subcolecciones dentro del espacio** y no colecciones planas con un campo `profesor`: así
  la regla de «listar» es solo «eres el dueño de este espacio», y el panel no puede leer lo
  de otro aunque se equivoque en una consulta.
- **Los lectores** (`lectores` del espacio) son cuentas de solo lectura que el dueño añade
  desde su panel. Hoy solo hay una prevista: la del informe diario de Juan Luis (F.3).
- El prefijo `practicas-` sigue evitando choques con `alumnos/`, `tareas/` y `credenciales/`
  de la aplicación antigua de `src/`, y con las colecciones del modo antiguo, que no se tocan
  hasta la migración (E). **[hecho del código]**
- Las tareas de un profesor se pueden leer sabiendo su uid. No son datos de alumnos (títulos,
  ejercicios y fechas, como hoy en el repositorio público), y así la página del alumno las
  carga sin cuenta.

### C.2 Reglas en borrador **[propuesta pendiente]**

Se **añaden** a `firestore.rules`; los bloques de hoy no se tocan hasta la migración (E).
Borrador para la tarea de reglas (N1), sin probar: la N1 lo ajusta, lo prueba y lo deja
publicar a Juan Luis.

```
    // ===== Varios profesores (diseño de la tarea 57 de PU2) =====

    function esAdmin() {
      return esProfesor();   // el uid de Juan Luis, el mismo de siempre
    }
    function profesorActivo() {
      return autenticado()
        && get(/databases/$(db)/documents/practicas-profesores/$(request.auth.uid)).data.activo == true;
    }
    function esDueno(uid) {
      return autenticado() && request.auth.uid == uid && profesorActivo();
    }
    function esLector(uid) {
      return autenticado()
        && request.auth.uid in get(/databases/$(db)/documents/practicas-espacios/$(uid)).data.lectores;
    }
    function codigoSecreto(c) {
      return c is string && c.matches('^[A-HJ-NP-Z2-9]{8}$');
    }
    // El código es de un alumno de ese profesor (una lectura más por escritura).
    function alumnoDe(uid, c) {
      return codigoSecreto(c)
        && get(/databases/$(db)/documents/practicas-alumnos/$(c)).data.profesor == uid;
    }
    function estadoValido() {
      return request.resource.data.keys().hasOnly(['estado', 'actualizado'])
        && request.resource.data.estado is string
        && request.resource.data.estado.size() < 4000
        && request.resource.data.actualizado is int;
    }

    match /practicas-solicitudes/{uid} {
      allow get: if autenticado() && request.auth.uid == uid;
      allow read, delete: if esAdmin();
      allow create, update: if autenticado() && request.auth.uid == uid
        && request.resource.data.keys().hasOnly(['email', 'nombre', 'pedido'])
        && request.resource.data.email == request.auth.token.email
        && request.resource.data.nombre is string && request.resource.data.nombre.size() <= 100
        && request.resource.data.pedido is int;
    }

    match /practicas-profesores/{uid} {
      allow get: if autenticado() && request.auth.uid == uid;
      allow read: if esAdmin();
      allow write: if esAdmin()
        && request.resource.data.keys().hasOnly(['activo', 'alta'])
        && request.resource.data.activo is bool
        && request.resource.data.alta is int;
    }

    match /practicas-alumnos/{codigo} {
      allow get: if codigoSecreto(codigo);
      allow list: if profesorActivo() && resource.data.profesor == request.auth.uid;
      allow create: if profesorActivo() && codigoSecreto(codigo)
        && request.resource.data.keys().hasOnly(['profesor', 'n', 'alta'])
        && request.resource.data.profesor == request.auth.uid
        && request.resource.data.n is int && request.resource.data.n >= 1 && request.resource.data.n <= 250
        && request.resource.data.alta is int;
      allow update: if profesorActivo() && resource.data.profesor == request.auth.uid
        && request.resource.data.keys().hasOnly(['profesor', 'n', 'alta'])
        && request.resource.data.profesor == request.auth.uid
        && request.resource.data.n is int && request.resource.data.n >= 1 && request.resource.data.n <= 250;
      allow delete: if profesorActivo() && resource.data.profesor == request.auth.uid;
    }

    match /practicas-espacios/{uid} {
      allow get, delete: if esDueno(uid);
      allow create, update: if esDueno(uid)
        && request.resource.data.keys().hasOnly(['lectores', 'actualizado'])
        && request.resource.data.lectores is list
        && request.resource.data.lectores.size() <= 5
        && request.resource.data.actualizado is int;

      match /config/{doc} {
        allow get: if doc == 'tareas';
        allow read, delete: if esDueno(uid);
        allow create, update: if esDueno(uid) && doc == 'tareas'
          && request.resource.data.keys().hasOnly(['json', 'actualizado'])
          && request.resource.data.json is string
          && request.resource.data.json.size() < 200000
          && request.resource.data.actualizado is int;
      }

      // La lista de nombres, cifrada en el navegador del profesor: solo él.
      match /privado/{doc} {
        allow read, delete: if esDueno(uid);
        allow create, update: if esDueno(uid) && doc == 'nombres'
          && request.resource.data.keys().hasOnly(['v', 'sal', 'iv', 'cifrado', 'actualizado'])
          && request.resource.data.cifrado is string
          && request.resource.data.cifrado.size() < 100000
          && request.resource.data.actualizado is int;
      }

      match /progreso/{doc} {
        allow get: if doc.matches('^[a-z0-9-]+--[A-HJ-NP-Z2-9]{8}$');
        allow read: if esDueno(uid) || esLector(uid);
        allow delete: if esDueno(uid);
        allow create, update: if doc.matches('^[a-z0-9-]+--[A-HJ-NP-Z2-9]{8}$')
          && alumnoDe(uid, doc.split('--')[1])
          && estadoValido();
      }

      match /progreso-tareas/{doc} {
        allow get: if doc.matches('^t[0-9]{1,4}--[a-z0-9-]+--[A-HJ-NP-Z2-9]{8}$');
        allow read: if esDueno(uid) || esLector(uid);
        allow delete: if esDueno(uid);
        allow create, update: if doc.matches('^t[0-9]{1,4}--[a-z0-9-]+--[A-HJ-NP-Z2-9]{8}$')
          && alumnoDe(uid, doc.split('--')[2])
          && estadoValido();
      }

      match /asignaciones/{codigo} {
        allow get: if codigoSecreto(codigo);
        allow read: if esDueno(uid) || esLector(uid);
        allow delete: if esDueno(uid);
        allow create, update: if esDueno(uid) && alumnoDe(uid, codigo)
          && request.resource.data.keys().hasOnly(['tareas', 'actualizado'])
          && request.resource.data.tareas is list
          && request.resource.data.tareas.size() <= 1023
          && request.resource.data.actualizado is int;
      }

      // Como el `fallos/` de hoy, con el código de 8 y comprobando que el
      // alumno es de este profesor. (Copiar entero el bloque de campos de hoy,
      // cambiando {4} por {8} en `id` y en `alumno`.)
      match /fallos/{id} {
        allow read: if esDueno(uid) || esLector(uid);
        allow delete: if esDueno(uid);
        allow create: if id.matches('^[A-HJ-NP-Z2-9]{8}-[a-z0-9]{6,12}-[a-z0-9]{4}$')
          && alumnoDe(uid, request.resource.data.alumno)
          && id.matches('^' + request.resource.data.alumno + '-.*')
          // … los mismos campos y topes que el bloque `fallos/` de hoy …
          ;
      }
    }
```

Lo que comprueba cada pieza de la separación estricta:

| Intento | Qué lo para |
|---|---|
| Un profesor lista el progreso de otro | `esDueno(uid)`: el uid de la ruta no es el suyo |
| Un profesor lista los códigos de otro | `list` de `practicas-alumnos` solo con `profesor == su uid` |
| Un profesor se «queda» un código de otro | `create` falla si existe; `update` exige ser el dueño |
| Alguien sin cuenta calcula códigos | ya no hay fórmula: los códigos son al azar |
| Alguien sin cuenta prueba códigos al azar | 32⁸ posibilidades; ninguna fórmula; cada intento es una lectura visible en la consola |
| Alguien escribe basura en un espacio | `alumnoDe`: el código tiene que ser de ese profesor |
| Un profesor dado de baja sigue entrando | `profesorActivo()` en todo lo del dueño |
| Juan Luis lee los alumnos de otro desde la app | `esAdmin()` no aparece en ningún bloque del espacio |
| Alguien lee nombres | solo están cifrados, y solo los lee el dueño |

### C.3 Cómo se prueban **[propuesta pendiente]**

Hay que probar con **dos profesores de prueba** que cada uno ve lo suyo y no lo del otro: no
basta con mirar que la app funciona. Dos caminos:

1. Con el emulador de Firestore: reglas probadas en el Mac, sin tocar el proyecto real.
   Necesita **Java**, que este Mac no tiene (comprobado el 17-10: `java -version` falla).
   **Descartado: Juan Luis prefiere no instalar Java [decidido por Juan Luis el 2026-10-17].**
2. **Sin emulador, el elegido** (como hizo la tarea 49): Juan Luis publica las reglas y la sesión comprueba
   por REST en el proyecto real con dos cuentas de prueba de correo y contraseña (creadas en
   la consola, Authentication → Add user; dadas de alta como profesores) y sin cuenta. La
   lista de comprobaciones es la misma tabla de C.2, con el resultado esperado (200 / 403 /
   404) de cada una. Deja datos de prueba en la nube, que se borran desde la consola.

En los dos casos, la tarea de reglas deja escrito el resultado literal de cada comprobación.

---

## D. Tareas y calendario por profesor

1. **Cada profesor tiene sus tareas y sus fechas**, en la nube, en su espacio.
   **[decidido por Juan Luis el 2026-10-17, antes de esta tarea]**
2. **Juan Luis también pasa al editor**: desde su cambio de sistema (E), sus tareas viven en su
   espacio y las hace en el panel, sin pedírselo a Claude. **[decidido por Juan Luis el 2026-10-17]**
3. **`tareas.js` queda como plantilla del curso** (y, hasta la migración de Juan Luis, como
   la fuente de sus tareas del modo antiguo). **[propuesta pendiente]**
4. **El formato no cambia** **[propuesta pendiente]**: la configuración del profesor es el mismo
   objeto de hoy, `{ unidades: [{ n, desde }], tareas: [ …mismos campos que TAREAS… ] }`,
   guardado como JSON en `config/tareas`. Las mismas comprobaciones de `erroresTareas` antes de
   guardar. Los títulos de las unidades siguen siendo comunes (`UNIDADES` de `catalogo.js`); de
   cada profesor son solo las fechas de comienzo.
5. **El editor de tareas, en el panel** **[propuesta pendiente]**:
   - Lista de sus tareas por unidad, con «Nueva», «Duplicar» y «Editar».
   - Una tarea: título (es/en), unidad, ejercicios ★ y de elegir escogidos del catálogo común
     (por unidad y práctica, con el nombre de cada ejercicio), cuántos de elegir, `desde`,
     `hasta` y «solo para algunos alumnos» (asignada). Avisa con las mismas reglas de
     `erroresTareas` (hasta 10 ★, hasta 15 de elegir, sin repetidos, plazo no anterior al
     comienzo…).
   - **Una tarea que ya han empezado los alumnos no cambia de ejercicios** (lo dice `tareas.js`
     hoy: el código de resultado dice «el 3.º ★ terminado»). El editor la bloquea en cuanto
     llega su `desde`: se pueden cambiar el título y las fechas, no los ejercicios. Para
     cambiarlos, «Duplicar» (id nuevo y enlace nuevo).
   - Los ids los pone el editor (el mayor + 1) y no se reutilizan nunca.
   - «Cargar la plantilla del curso»: copia las tareas de `tareas.js` (las de Juan Luis de este
     curso, que ya son públicas) para cambiarles solo las fechas.
   - Fechas de comienzo de cada unidad, en la misma pantalla.
6. **Qué puede tocar un compañero**: todo lo de su espacio (sus tareas, con cualquier ejercicio
   del catálogo; sus fechas; sus asignaciones). Nada común: ni el catálogo ni las prácticas, que
   son iguales para todos. **[propuesta pendiente]**
7. **Qué ve el alumno**: la portada y la página de la tarea cargan las tareas de **su**
   profesor (`config/tareas` del espacio de su código) y las guardan en el navegador; sin red,
   usan la copia. Un alumno solo ve las tareas de su profesor. **[propuesta pendiente]**

---

## E. Migración de Juan Luis

1. **Fecha: a la vuelta de Navidad**, al empezar la 2.ª evaluación. Hasta entonces Juan Luis
   sigue en el modo antiguo, sin cambiar nada. **[decidido por Juan Luis el 2026-10-17]**
   Día exacto: **pendiente de Juan Luis** (el primer día lectivo de enero, o el que él elija).
2. **Sus compañeros empiezan antes, en cuanto el sistema nuevo esté listo** (previsto en la
   primera quincena de diciembre, ver H). **[decidido por Juan Luis el 2026-10-17]**
   Consecuencia: **durante unas semanas conviven los dos sistemas** (el modo antiguo para
   Juan Luis y el nuevo para sus compañeros). La app distingue por la longitud del código.
3. **Lo que hay que decirle claro, y se le dijo:** mientras Juan Luis siga en el modo antiguo,
   el progreso de sus alumnos sigue siendo legible con la fórmula pública, como hoy (solo
   números de lista, sin nombres), **también para sus compañeros**. Lo de sus compañeros, en
   cambio, está separado desde el primer día. Lo de Juan Luis queda separado el día de su
   migración.
4. **Cómo se migra** **[propuesta pendiente]**, en una sesión atendida el día elegido:
   - Su panel, con un botón «Pasar al sistema nuevo» (solo para el administrador, y una sola
     vez): genera un código secreto para cada número de su lista **con el mismo número**, copia
     a su espacio el progreso de práctica libre, el progreso por tarea y las asignaciones de
     cada alumno (de `practicas/`, `practicas-tareas/` y `practicas-asignaciones/`), y copia
     sus tareas de `tareas.js` y las fechas de `UNIDADES` a su configuración.
   - Los **fallos** de la 1.ª evaluación no se copian (son miles de documentos): antes de
     migrar se descarga el CSV de «Qué falla más», y la colección `fallos/` de hoy se queda
     donde está (ya solo la lee él) hasta que decida borrarla.
   - La **tarea 1** (`progresoPorPractica`) se copia como está: su progreso está en los
     documentos de práctica libre, que también se copian.
   - Sus alumnos reciben **el código nuevo por correo**, como el de esta semana: el panel
     exporta el CSV (número, código, enlace) que usa su script de correos.
   - **Los enlaces viejos** (`?c=<código de 4>`) dejan de entrar y dicen «Tu código ha
     cambiado. Busca el nuevo en tu correo». No pueden llevar al código nuevo: la relación
     entre el viejo (calculable) y el nuevo delataría el nuevo.
   - Ese mismo día Juan Luis publica las reglas que **cierran** las colecciones del modo
     antiguo (`get` sin cuenta, fuera). Desde ahí sus datos quedan tan separados como los
     de los demás.
5. **Borrar los datos viejos** (`practicas/`, `practicas-tareas/`, `practicas-asignaciones/`,
   `fallos/`, `divisores/`): después de comprobar la migración (propuesta: una semana), con su
   firma en `autorizaciones.md`. **[propuesta pendiente]**

---

## F. Lo que cambia alrededor

### F.1 El panel **[propuesta pendiente salvo lo marcado]**

- **Entrar**: con Google. Sin alta, la pantalla de solicitud (A.2). Con alta, su espacio.
- **«Mis alumnos»**: la lista de nombres pegada como hoy (un nombre por línea, en orden), y
  «Generar códigos» para las líneas que aún no tienen. Los códigos se guardan en la nube
  (`practicas-alumnos`, con el número de línea): desde otro ordenador el profesor recupera sus
  códigos sin hacer nada.
- **Los nombres, cifrados en la nube** **[decidido por Juan Luis el 2026-10-17]**: la lista se
  cifra en el navegador con una contraseña que solo sabe el profesor y se sube cifrada
  (`privado/nombres`). En otro ordenador, al entrar, el panel pide esa contraseña y descifra.
  Cómo **[propuesta pendiente]**: Web Crypto del navegador (PBKDF2 con SHA-256 y 600 000
  vueltas para sacar la clave de la contraseña; AES-GCM de 256 bits); contraseña de al menos
  10 caracteres y distinta de la de Google; nada que añadir a la app. Si el profesor la olvida,
  vuelve a pegar la lista y pone otra contraseña: los códigos no se pierden (van por número de
  línea). Ni Juan Luis ni nadie más puede descifrarla. En el navegador se sigue guardando la
  lista descifrada, como hoy, para no pedir la contraseña cada vez.
- **Lee solo lo nuevo**: hoy el panel lee las colecciones enteras en cada apertura. El nuevo
  guarda lo leído en el navegador (IndexedDB: con 100 alumnos no cabe en `localStorage`) y
  pide a la nube solo los documentos con `actualizado` posterior a la última lectura. Los
  fallos, por tarea o de los últimos 30 días. Es lo que hace caber a cuatro profesores en el
  plan gratuito (F.7).
- **Las vistas de hoy** (Tareas de la semana, Retrasos, Asignar tareas, Qué falla más, CSV)
  no cambian, salvo que leen del espacio y usan las tareas del profesor.
- **«Hoy»**: una pestaña nueva con lo que cuenta el informe diario (quién no ha entrado, qué
  ejercicios fallan demasiado, entregas), para los compañeros, que no reciben correo (F.3).
- **«Tareas»**: el editor de D.5.
- **«Profesores»**: solo la ve Juan Luis (A.2).
- **Repartir los códigos**: el panel exporta un CSV (número, nombre, código, enlace) para
  combinar correspondencia o pegar en Classroom, e imprime tarjetas para recortar (nombre,
  código y enlace corto; sin QR, que pediría una biblioteca nueva). El script de correos de Juan Luis lee ese CSV.

### F.2 La portada y la página de la tarea **[propuesta pendiente]**

- Al entrar con un código de 8: `get` de `practicas-alumnos/{código}` (profesor y número),
  `get` de la configuración de su profesor, y a partir de ahí lo de hoy con la ruta del
  espacio. Las tres cosas se guardan en el navegador.
- Un código de 4: modo antiguo, como hoy, hasta la migración de Juan Luis; después, el aviso
  «Tu código ha cambiado».
- La base (`base.js`) y el registro de fallos (`registro.js`) cambian solo la ruta.

### F.3 El informe diario **[decidido por Juan Luis el 2026-10-17: solo para él, con cuenta]**

- Sigue llegándole solo a Juan Luis. Ya no puede leer sin cuenta: entra con una **cuenta de
  solo lectura** (correo y contraseña de Firebase, creada en la consola), que Juan Luis añade
  como lectora de su espacio desde su panel. Lee solo lo de Juan Luis; ni escribe ni ve los
  nombres.
- La contraseña de esa cuenta se guarda en la configuración de la rutina en la nube (no en el
  repositorio). Quien la tuviera podría leer lo mismo que el informe: códigos y resultados de
  los alumnos de Juan Luis, sin nombres. **[propuesta pendiente]**
- Hasta la migración de Juan Luis el informe sigue como hoy (modo antiguo). El cambio del
  informe va con la migración.
- Los compañeros ven lo mismo en la pestaña «Hoy» de su panel (F.1).

### F.4 `divisores/` **[propuesta pendiente]**

La aplicación vieja de `divisores/` (colección `divisores/`, sus códigos de 4) es solo de Juan
Luis y no la usan los compañeros: sus ejercicios ya están en `practicas/divisores/`. Se queda
como está hasta la migración de Juan Luis; ese día su `index.html` pasa a llevar a
`practicas/`, y su colección se borra con lo demás (E.5).

### F.5 La aplicación antigua de `src/`

Fuera de alcance: no se toca, y sus reglas (`alumnos/`, `tareas/`, `credenciales/`) siguen
como están. **[propuesta pendiente]** (la ficha ya lo proponía). `src/firebase.js` sí se toca,
porque el panel de las prácticas usa sus funciones de acceso.

### F.6 El correo con los códigos

Hoy es un script local de Juan Luis. Cada compañero reparte los suyos con el CSV o las
tarjetas del panel (F.1); Juan Luis sigue con su script, que leerá el CSV nuevo el día de su
migración. **[propuesta pendiente]**

### F.7 Las cuotas del plan gratuito de Firebase **[decidido por Juan Luis el 2026-10-17: gratis y medir]**

Límites del plan gratuito (Spark), por día: 50 000 lecturas, 20 000 escrituras, 20 000
borrados; 1 GiB guardado. Cálculo a ojo **[propuesta pendiente]** para un día en que practiquen
**todos** los ~400 alumnos de los cuatro profesores (el peor caso; un día normal, la tercera
parte):

| Por alumno y día activo | Escrituras | Lecturas |
|---|---|---|
| Progreso (cada 5 respuestas y al terminar un ejercicio: ~18) | 18 | 18 (cada subida lee antes) |
| Fallos (~15) | 15 | — |
| Comprobación de las reglas (`alumnoDe`, una por escritura) | — | 33 |
| Abrir portada y páginas de tarea (búsqueda, configuración, documentos) | — | ~30 |
| **Total por alumno** | **~33** | **~80** |
| **× 400 alumnos** | **~13 000 (65 %)** | **~32 000 (64 %)** |

Más el panel: con la lectura de solo lo nuevo (F.1), unos cientos de lecturas por apertura.
Cabe, con poco margen en el peor caso. Al pasar del límite **la app no se rompe**: el progreso
queda en el navegador y sube al día siguiente (a partir de las 9:00 hora peninsular, cuando
Firebase reinicia el contador). Medidas:

- La lectura de solo lo nuevo en el panel (F.1) y la caché en el navegador de la búsqueda y
  de la configuración (F.2).
- **Medir** la primera semana de los compañeros: Juan Luis mira en la consola (Firestore →
  Uso) las lecturas y escrituras de cada día; la revisión N9 deja escrito cómo. Si pasa del
  70 % algún día, se decide entonces (bajar escrituras o el plan de pago con alerta de gasto).

### F.8 `docs/` y `README.md` **[propuesta pendiente]**

`docs/practicas-unidad2.md`: el modelo de espacios, el código secreto y cómo dar de alta a un
profesor. `README.md`: cómo publicar las reglas nuevas y qué hacer al dar de alta a alguien.
Una página corta para los compañeros («Cómo empezar»: entrar, pegar la lista, generar códigos,
poner la contraseña de los nombres, cargar la plantilla de tareas, repartir los enlaces), que
Juan Luis les pueda mandar.

---

## G. Protección de datos

- En la nube **nunca hay un nombre legible**: códigos al azar, números de lista, progreso,
  fallos (con lo que tecleó el alumno en la respuesta) y la lista de nombres **cifrada** con la
  contraseña de cada profesor. Los nombres solo se leen en el navegador de su profesor.
  **[hecho del diseño]**
- Sí hay datos de los **profesores**: su cuenta de Google en Firebase Authentication, y su
  correo y su nombre en la solicitud de alta. **[hecho del diseño]**
- Una lista de nombres cifrada sigue siendo, en sentido legal, un dato personal (seudonimizado),
  aunque nadie pueda leerla sin la contraseña. **[hecho del diseño]**
- **Pendiente de Juan Luis, no es una decisión técnica:** consultar en el centro (equipo
  directivo y, si hace falta, el delegado de protección de datos de la Consejería) si se puede
  usar **su** proyecto de Firebase para alumnos de otros profesores, con lo de arriba. Conviene
  llevar también **en qué región** están los datos (la consola lo dice en Firestore →
  Configuración; se eligió al crear el proyecto y no se puede cambiar).
- Este documento no lleva nombres de alumnos ni de compañeros ni códigos reales (el código de
  B.1 es inventado).

---

## H. Calendario y tareas de implementación

### H.1 Calendario **[propuesta pendiente]**

- **Antes**: termina el reparto PU2 (la 55 en curso) y el reparto de la Unidad 3 (PU3) se diseña
  la última semana de octubre y se construye la primera de noviembre. Esto no lo pisa.
- **Semanas del 9 y del 16 de noviembre**: N1 a N5 (reglas, modelo, acceso, base y páginas).
  La N1 necesita a Juan Luis para publicar las reglas (unos minutos).
- **Semana del 23 de noviembre**: N6 a N8 (panel, editor de tareas, «Hoy»).
- **Semana del 30 de noviembre**: N9, revisión de extremo a extremo con dos profesores de
  prueba; si Juan Luis quiere, con uno de sus compañeros como piloto.
- **Los compañeros empiezan en cuanto pase la N9**: previsto el lunes 14-12 (la semana del 7
  tiene el festivo del martes 8). Fecha exacta: **pendiente de Juan Luis**, con ellos.
- **Diciembre**: N10 (la herramienta de migración de Juan Luis), sin ejecutarla.
- **Vuelta de Navidad**: se ejecuta la migración de Juan Luis (E.4), en una sesión atendida.
- **Una o dos semanas después**: N11 (limpieza del modo antiguo y borrado de datos viejos, con
  firma).

### H.2 Tareas **[propuesta pendiente]**

Números provisionales N1-N11; si no hay otras altas entretanto, serían la 59-69. Todas dejan
funcionando el modo antiguo (los alumnos de Juan Luis siguen con lo de hoy hasta su migración)
y lo comprueban con un test. Ficheros nuevos marcados con *(nuevo)*.

| # | Tarea | Ficheros que toca | Banda | Duración | Precondición | En paralelo con |
|---|---|---|---|---|---|---|
| N1 | **Reglas de los espacios y su banco de pruebas** (C.2 y C.3). Atendida: Juan Luis publica; la sesión comprueba por REST, en el proyecto real, cada fila de la tabla de C.2 con dos cuentas de prueba de correo y contraseña que Juan Luis crea en la consola (C.3, camino 2; sin emulador). Solo añade bloques: los de hoy no cambian | `firestore.rules`, `herramientas/probar-reglas.mjs` *(nuevo: las comprobaciones REST, repetibles)* | ALTO | 1 h 30 min | la 55 LISTA | N2 |
| N2 | **Modelo puro**: código secreto (`codigoSecreto` con `crypto.getRandomValues`, `leerCodigoSecreto`, la longitud decide el modo); `leerCodigoTarea` y todo `tareas.js` con la lista de tareas como parámetro (por defecto `TAREAS`); configuración del profesor de/a JSON con `erroresTareas`; fechas de unidad por profesor; `nube.js` con las rutas del espacio y la lectura de la búsqueda y de la configuración; módulo `espacio.js` *(nuevo)* que resuelve un código a {profesor, n, configuración} con caché en el navegador. Funciones puras con sus tests; nadie las usa aún | `practicas/_comun/{codigos,tareas,catalogo,nube,espacio}.js`, `tests/practicas-{semana,nube,comun,espacio}.test.js` | MEDIO | 2 h | ninguna | N1 |
| N3 | **Acceso a datos del panel** (SDK con la cuenta del profesor): solicitud, alta y baja, generar y listar códigos, configuración, lista cifrada, lectura de solo lo nuevo de progreso/progreso por tarea/asignaciones/fallos del espacio, guardar asignación, lectores | `src/firebase.js` | MEDIO | 1 h 30 min | N1 (reglas publicadas) y N2 LISTAS | N4 |
| N4 | **Base y registro en el espacio**: con código de 8, ruta del espacio para progreso, progreso por tarea y fallos; con código de 4, como hoy. Frases nuevas («Ese código no existe…») | `practicas/_comun/{base,registro,textos}.js`, `tests/practicas-{comun,registro}.test.js` | ALTO | 2 h | N1 (publicadas) y N2 LISTAS | N3 |
| N5 | **Portada y página de la tarea**: entrada con código de 8, tareas del profesor desde la nube (con copia en el navegador), asignaciones del espacio; con código de 4, como hoy | `practicas/{portada.js,index.html,semana.js,semana.html}`, `practicas/_comun/textos.js`, `tests/practicas-semana.test.js` | MEDIO | 2 h | N4 LISTA (comparte `textos.js`) | N3, N6 |
| N6 | **Panel, núcleo**: entrar y solicitud de alta; sección «Profesores» (solo administrador); «Mis alumnos» con generar códigos, nombres cifrados (Web Crypto) y CSV/tarjetas; caché en IndexedDB y lectura de solo lo nuevo; las vistas de hoy leyendo del espacio | `practicas/{profesor.js,profesor.html,resultados.js}`, `practicas/_comun/cifrado.js` *(nuevo)*, `tests/practicas-{resultados,cifrado}.test.js` | ALTO | 2 h 30 min | N3 LISTA | N5 |
| N7 | **Editor de tareas** (D.5): lista por unidad, nueva/duplicar/editar, selector de ejercicios del catálogo, bloqueo de ejercicios desde `desde`, fechas de unidades, «Cargar la plantilla del curso» | `practicas/profesor-tareas.js` *(nuevo)*, `practicas/profesor.html` (solo la sección nueva), `tests/practicas-editor.test.js` *(nuevo)* | MEDIO | 2 h 30 min | N6 LISTA (comparte `profesor.html`) | N8 |
| N8 | **«Hoy» en el panel e informe con cuenta lectora**: las funciones de cálculo del informe, compartidas con la pestaña «Hoy»; el informe lee con la cuenta lectora (inicio de sesión por REST con correo y contraseña) cuando se le pasa `--espacio` | `herramientas/informe-actividad.mjs`, `practicas/profesor-hoy.js` *(nuevo)*, `tests/herramientas-informe.test.js` | MEDIO | 1 h 30 min | N6 LISTA | N7 |
| N9 | **Revisión de extremo a extremo y documentación**: dos profesores de prueba y códigos de prueba en dos navegadores; separación (cada uno solo lo suyo, también por REST), alta y baja, generar códigos, nombres cifrados en otro navegador, editor y plantilla, progreso libre y por tarea, asignación, fallos, «Hoy», y que el modo antiguo sigue igual. Veredicto; cómo medir las cuotas. Después `docs/practicas-unidad2.md`, `README.md` y la página «Cómo empezar» | `docs/practicas-unidad2.md`, `README.md`, `docs/practicas-como-empezar.md` *(nuevo)*; salida con el veredicto | ALTO | 2 h | N1-N8 LISTAS | — |
| N10 | **Herramienta de migración de Juan Luis** (E.4), sin ejecutarla: botón «Pasar al sistema nuevo» (códigos nuevos con los mismos números, copia de progreso, progreso por tarea, asignaciones, tareas y fechas; CSV para el correo); aviso «Tu código ha cambiado» preparado tras un interruptor; reglas que cierran el modo antiguo, escritas y sin publicar. Prueba con una copia de prueba (números 60-63) | `practicas/profesor-migracion.js` *(nuevo)*, `practicas/profesor.html` (botón), `practicas/_comun/{espacio,textos}.js`, `firestore.rules` (bloque comentado), `tests/practicas-migracion.test.js` *(nuevo)* | ALTO | 2 h | N9 LISTA | — |
| N11 | **Limpieza del modo antiguo**, una o dos semanas después de la migración: quitar el código de 4 caracteres de la base, las páginas, el panel y el informe; `tareas.js` solo como plantilla; reglas sin los bloques antiguos; `divisores/` lleva a `practicas/`; borrar las colecciones viejas (con firma en `autorizaciones.md`) | la base, las páginas, el panel, el informe, `firestore.rules`, `divisores/index.html`, sus tests | MEDIO | 2 h | migración hecha y comprobada | — |

Encadenables: N2 → N3 (misma banda) si la N1 ya está publicada. Caben a la vez N1 y N2; luego
N3 y N4; luego N5 y N6; luego N7 y N8. La N1 y la N10 llevan a Juan Luis delante (publicar
reglas). Las duraciones son holgadas, como en todo el reparto.

Lo que **no** entra: la Unidad 3 (su reparto) ni la aplicación antigua de `src/`.

### H.3 Dónde van las tareas **[propuesta pendiente]**

Es un trabajo nuevo, de otro tamaño que las prácticas de la Unidad 2. Se puede dar de alta en
este mismo reparto (fichas 59-69) o abrir un reparto propio (por ejemplo `reparto-profesores/`,
abreviatura `PVP`). Lo decide la coordinadora con Juan Luis; las fichas, con esta tabla, son
las mismas en los dos casos.
