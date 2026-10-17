# Hallazgos fuera de criterio · tarea 69

Sesión `s-20261017T215223-49ff9905`, 2026-10-17. Lo que se vio al revisar y no estaba entre
los criterios de la ficha. **Ninguno impide entregar**; son decisiones o limpieza para Juan
Luis (o para la coordinadora, si hacen falta tareas). Ordenados de más a menos importante.

## 1. Dónde se añade la cuenta lectora del informe (resuelto por la 70)

El diseño (F.3) dice que Juan Luis añade la cuenta lectora del informe «desde su panel». En el
código revisado (8982a78) no había ninguna pantalla que usara `guardarLectores` (`src/firebase.js`);
la 66 ya lo había avisado. **La 70 lo añadió mientras se revisaba** (dc260d2): «Cuenta lectora
del informe diario → Añadir como lectora», dentro de «Pasar al sistema nuevo», solo para el
administrador. Los compañeros no lo necesitan (no reciben informe; tienen «Hoy»). No se probó en
el navegador; las reglas de los lectores, sí (banco REST, sección «Lectores»).

## 2. Limpieza que queda en la nube (solo desde la consola)

Lo que esta sesión creó y pudo borrar, lo borró (los 11 documentos del espacio de A: progreso
libre y por tarea, asignaciones, fallos, configuración, lista cifrada y sus 3 códigos; la cuenta
del compañero desechable; las tres solicitudes de cuentas desechables). Queda, porque las reglas
no dejan borrarlo desde la app:

- `practicas-profesores/<uid del compañero desechable>` (de baja; su cuenta ya no existe) y su
  `practicas-solicitudes/<mismo uid>` (fila «Compañero de prueba 69» en «Profesores»).
- `practicas-espacios/<uid de B>` (el documento del espacio, vacío; lo crea el panel al entrar).

No hay que borrar: el espacio y el alta de Juan Luis («Tú», creados al entrar como
administrador el 18-10; la 70 los necesita), ni las altas de A y B mientras se usen.

## 3. Las cuentas de prueba A y B

Sus contraseñas son adivinables (lo avisó la 61) y en esta sesión pasaron por el chat. Con
ellas solo se entra en dos espacios de prueba vacíos, pero conviene **cambiarlas o borrar las
cuentas** (Authentication) cuando la 70 haya terminado su ensayo; si se borran, borrar también
sus `practicas-profesores` y `practicas-espacios`.

## 4. La sesión de Google de Juan Luis en `http://localhost:8096`

Para probar el panel del administrador se entró con su cuenta en ese origen local. No se pudo
cerrar desde la sesión (el panel estaba en el sistema actual, que no arranca Firebase hasta
pedirlo). No da acceso a nada fuera de su navegador; se cierra con «Salir» en
`localhost:8096/practicas/profesor.html` si alguna vez sirve algo en ese puerto.

## 5. «Hoy»: «han entrado» solo mira la tarea

En una tarea v2, «Han entrado alguna vez» y «Aún no han entrado» cuentan solo el progreso de
**esa tarea**: el alumno 3 había hecho el ejercicio ★ de la tarea en la **práctica libre** (6
aciertos) y salía en «Aún no han entrado». Es coherente con el modelo v2 (cada tarea lleva su
progreso y lo de la práctica libre no cuenta), pero un profesor puede leerlo como «no sabe
entrar». **Decisión de Juan Luis:** dejarlo, o cambiar la frase a «Aún no han empezado la
tarea».

## 6. Detalles de texto (menores)

- Al generar un solo código: «Un código nuevo, guardados en la nube.» (concordancia: «guardado»).
- En la página de una tarea con un solo ejercicio a elegir: «Los que tú quieras: cuentan los 1
  que lleves mejor.» (con 1, «cuenta el que lleves mejor»).
- La portada enseña el código de 8 sin guion («Tu código: 9PQCE38L»); el panel y las tarjetas,
  con guion (`9PQC-E38L`), como dice el diseño (B.1). Para un alumno que copia del correo da
  igual (se aceptan los dos), pero al dictarlo en clase se lee mejor con guion.

## 7. Altas hechas a mano en la consola

A y B se dieron de alta a mano (sin solicitud y con `alta: 0`): en «Profesores» salen sin nombre,
con el uid en la columna del correo y «De alta desde 1/1/1970». Es lo esperado; los compañeros de
verdad pasan por la solicitud y salen con su nombre, su correo y la fecha (comprobado con el
compañero desechable).

## 8. «Abrir el sistema actual» en la pantalla de entrar

La pantalla de entrar enseña a todo el mundo «Sistema actual, con los códigos de 4 caracteres
(solo Juan Luis): Abrir el sistema actual». A un compañero no le sirve de nada (sin la cuenta de
Juan Luis no carga nada), pero puede despistarle. Desaparece con la limpieza del modo antiguo
(tarea 71); si molesta antes, se puede esconder fuera del navegador de Juan Luis.
