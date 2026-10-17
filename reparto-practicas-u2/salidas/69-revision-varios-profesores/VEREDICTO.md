# Veredicto de la tarea 69 · Revisión de extremo a extremo del sistema de varios profesores

Sesión `s-20261017T215223-49ff9905` (PU2 T69, ALTO), 2026-10-17, de 21:52 a 22:5x UTC,
atendida: Juan Luis dio las claves de las dos cuentas de prueba y permiso para entrar con su
cuenta de Google de administrador en el panel local.

**Resultado: los 13 criterios PASAN. SE ENTREGA. No se reabre ninguna tarea.** Lo que se vio
fuera de criterio está en `HALLAZGOS-FUERA-DE-CRITERIO.md` (decisiones y limpieza para Juan
Luis; ninguna impide que empiecen los compañeros).

## Cómo se probó

- Código de `origin/main` en **8982a78** (todo lo de las tareas 60-68 y 72), en un **worktree
  limpio** en el scratchpad de la sesión, servido en el puerto 8096. Nada del árbol compartido
  se tocó para probar. Mientras se probaba llegaron a `main` la 74 (portada plegable) y el
  código de la 70 (herramienta del paso, solo para el administrador): se repitió lo esencial
  sobre **361f6c1** (ver el criterio 13).
- **Dos navegadores**: el mismo Chrome con dos orígenes, `http://127.0.0.1:8096` y
  `http://localhost:8096`, que no comparten almacenamiento (ni la sesión de Firebase, ni la
  lista, ni la caché del panel). Contra el **Firestore de verdad**, con las reglas publicadas
  por Juan Luis en la 72.
- **Profesores**: A y B, las cuentas de correo y contraseña de prueba que Juan Luis creó para
  la 72 (el panel solo ofrece Google: se entró con ellas desde la consola del navegador con el
  mismo SDK, `signInWithEmailAndPassword` sobre la app por defecto, y se recargó la página);
  **administrador**: la cuenta de Google de Juan Luis, con «Entrar con Google»; y un
  **compañero nuevo** desechable (`zz-69-companero-…@example.com`), creado y borrado en la
  prueba, para el camino solicitud → alta → entrar.
- **Alumnos de prueba** de A: «Prueba A uno/dos/tres» (nombres inventados), con los códigos
  que generó el panel (dos de 8 y uno de 4); y el **7NPD** (número 60, código antiguo de las
  sesiones de Claude) registrado a mano en el espacio de A y después borrado. Ningún código de
  alumno real; los 62 y 63 los usaba en paralelo la 70.
- Las respuestas se dieron en la app de verdad (un contestador en JavaScript que lee el número
  del semáforo y pulsa los botones, acertando o fallando a propósito).
- Lo que hay en la nube se comprobó con el SDK desde la consola, con la cuenta del profesor
  que tocaba en cada caso.

## Los criterios

| # | Criterio | Veredicto |
|---|---|---|
| 1 | Separación: cada profesor solo lo suyo, en el panel y por REST | **PASA** |
| 2 | Alta y baja | **PASA** |
| 3 | Generar códigos | **PASA** |
| 4 | Nombres cifrados: recuperados en otro navegador y no legibles en la nube | **PASA** |
| 5 | Editor de tareas y plantilla | **PASA** |
| 6 | Progreso libre y por tarea | **PASA** |
| 7 | Asignación | **PASA** |
| 8 | Fallos | **PASA** |
| 9 | «Hoy» | **PASA** |
| 10 | El modo antiguo, igual que antes (código 60, panel de Juan Luis, informe sin `--espacio`) | **PASA** |
| 11 | Códigos de 4 (tarea 72) | **PASA** |
| 12 | A 375 px y en los dos idiomas | **PASA** |
| 13 | `npm test` en verde, también sobre el `main` que llegó durante la revisión | **PASA** |

### 1. Separación — PASA

- **Banco REST** (`herramientas/probar-reglas.mjs`, lanzado por esta sesión con las variables
  `PROFE_A_*` y `PROFE_B_*`, 22:08Z): «**154 de 154** comprobaciones como se esperaba». Salida
  literal entera en `BANCO-REST.txt`. Incluye lo de la tabla de C.2 del diseño: B no lista el
  progreso, los códigos, las asignaciones ni los fallos de A; no se queda un código de A; un
  código de B no escribe en el espacio de A; el administrador no aparece en ningún bloque del
  espacio; el lector solo lee.
- **Con el SDK, como B, en el navegador** (lo que haría un compañero curioso desde la consola):
  ```
  B lista progreso-libre de A: permission-denied
  B lee nombres cifrados de A: permission-denied
  B lista fallos de A: permission-denied
  B lista asignaciones de A: permission-denied
  B consulta códigos de A: permission-denied
  B lista toda practicas-alumnos: permission-denied
  B lee espacio de A: permission-denied
  B lee config/tareas de A (público): PERMITIDO existe
  ```
  Lo último es lo previsto (C.1: las tareas no son datos de alumnos y la página del alumno las
  lee sin cuenta).
- **En el panel**, B en el mismo navegador donde acababa de estar A: lista vacía, ninguna
  tabla de códigos, «Aún no tienes tareas», «Cargados 0 registros… de 0 alumnos», y ni rastro
  de «Prueba A», 9PQC…, DBA2 ni 7NPD en toda la página. Sin la sección «Profesores».

### 2. Alta y baja — PASA

- **Compañero nuevo**, de punta a punta: cuenta desechable sin alta → el panel dice «Aún no
  tienes acceso. Juan Luis tiene que darte de alta.» y el botón pasa a «Volver a comprobar».
  En el panel del administrador, «Profesores → Solicitudes»: `Compañero de prueba 69 ·
  zz-69-companero-…@example.com · 18/10/2026 · Dar de alta · Rechazar`. «Dar de alta» → pasa a
  «Dados de alta … activo · Dar de baja». El compañero pulsa «Volver a comprobar» y entra en
  su espacio, **sin** la sección «Profesores», **sin** el selector de sistema y **sin** «Pasar
  al sistema nuevo».
- **Baja**: el administrador da de baja a B → la fila dice «de baja · Volver a dar de alta»;
  B, al entrar: «Tu acceso está desactivado. Habla con Juan Luis si crees que es un error.» y
  no ve su espacio. Banco con `--baja`: «8 de 8 comprobaciones como se esperaba» (B lee su alta
  con `activo: false`; crear código, escribir configuración, listar progreso y consultar
  códigos: 403). «Volver a dar de alta» → «activo» otra vez.
- El administrador entra con Google y se da de alta a sí mismo como un profesor más (A.4): fila
  «Tú · juanluis.salas@murciaeduca.es · 18/10/2026 · activo».
- Limpieza: las tres solicitudes de cuentas desechables del banco (17 y 18-10) se
  **rechazaron** desde el panel («No hay solicitudes pendientes»); el compañero desechable se
  dio de baja, su espacio lo borró él mismo antes y su cuenta de Authentication se borró
  (`user.delete()`).

### 3. Generar códigos — PASA

- A pega dos nombres, longitud 8, «Generar códigos (2 sin código)» → «2 códigos nuevos,
  guardados en la nube.» Tabla: `1 · Prueba A uno · 9PQC-E38L` y `2 · Prueba A dos · CDRF-5FJP`,
  con su enlace directo `…/practicas/?c=9PQCE38L`.
- Cambia la longitud a 4 → «Los códigos que generes a partir de ahora tendrán 4 caracteres.
  Los ya repartidos no cambian.» Añade una línea y genera → `3 · Prueba A tres · DBA2`. Los de
  8 no cambian. `esCodigoAntiguo('DBA2')` = `false` (no es de los 1024 calculables).
- En la nube, la consulta de A a `practicas-alumnos`: `9PQCE38L:1 CDRF5FJP:2 DBA2:3` (y
  `7NPD:60` mientras estuvo registrado, criterio 11). `config/tareas` guarda
  `longitudCodigo: 4` y lo conserva al guardar tareas después.
- En el otro navegador, A recupera los cuatro códigos sin hacer nada (criterio 4).

### 4. Nombres cifrados — PASA

- A guarda la lista con la contraseña «clave-de-prueba-69» → «Guardada en la nube, cifrada
  (18/10, 00:09).» El documento `practicas-espacios/<A>/privado/nombres` tiene solo
  `v, sal, iv, cifrado, actualizado`, `v = 1`, y **«Prueba» no aparece en ninguna parte** del
  documento (comprobado sobre el JSON entero). B no puede leerlo (criterio 1); el administrador
  no aparece en ese bloque de las reglas.
- **Otro navegador** (`localhost`), A sin nada guardado: la tabla sale con
  «(no está en la lista)» en cada código y el aviso «Tu lista de nombres está guardada cifrada
  en la nube (18/10, 00:09). Escribe tu contraseña para verla aquí.»; con la contraseña,
  «Descifrar» → la lista vuelve entera (`Prueba A uno / dos / tres`) y la tabla, con nombres.
- El cifrado es el del diseño: `practicas/_comun/cifrado.js`, PBKDF2-SHA-256 con 600 000
  vueltas y AES-GCM de 256 bits; la contraseña mala la cubren los tests (`practicas-cifrado`, 5).

### 5. Editor de tareas y plantilla — PASA

- «Cargar la plantilla del curso» (con el aviso de confirmación) → las 8 tareas de `tareas.js`
  (1-4 de la unidad 2 con sus fechas, 11-14 de la unidad 1) y las fechas de las tres unidades;
  en la nube, `config/tareas` con las 8 y `longitudCodigo: 4` intacto.
- «Nueva tarea en la unidad 2»: título es/en, visible desde 17-10, plazo 25-10, «Obligatoria
  solo para algunos alumnos», ★ semáforo 1 y a elegir semáforo 2, 1 de elegir → «Tarea 15
  guardada.» En la nube:
  `{"id":15,"unidad":2,"titulo":{"es":"Prueba 69 asignada","en":"Test 69 assigned"},"desde":"2026-10-17","hasta":"2026-10-25","asignada":true,"estrella":[["semaforo",1]],"elegir":[["semaforo",2]],"nElegir":1}`
  (id = el mayor, 14, + 1). La lista da el enlace común `…/practicas/semana.html?t=15`.
- El bloqueo de ejercicios desde `desde`, «Duplicar» y los avisos los cubren los 14 tests de
  `practicas-editor.test.js`; en el navegador no se probaron.

### 6. Progreso libre y por tarea — PASA

- **Por tarea**: alumno 1 de A, desde la tarea 15 (`semaforo/?c=…&ejercicio=1&semana=15`):
  aciertos y un fallo → en la nube `practicas-espacios/<A>/progreso-tareas/t15--semaforo--9PQCE38L`
  con `puntos: 3`. La portada dice «Prueba 69 asignada · Obligatoria para ti · Plazo: domingo
  25-10 · 3 de 20 puntos».
- **Libre**: alumno 3 de A (DBA2, código de 4 generado), semáforo ejercicio 1 → en la nube
  `practicas-espacios/<A>/progreso-libre/semaforo--DBA2`. Nada en las colecciones antiguas.
- El panel de A, «Cargar de la nube»: «Cargados 1 registros de práctica y 1 de tareas, de 2
  alumnos, y las asignaciones de 2. De la nube se han pedido 4 documentos (lo cambiado desde la
  última lectura…)» — la lectura de solo lo nuevo.

### 7. Asignación — PASA

- Antes de asignar, el alumno 1 ve la tarea 15 como «Repaso». En el panel, «Asignar tareas»
  (tras «Cargar de la nube») da una columna «T15 · Prueba 69 asignada · plazo 25/10/2026»;
  marcados el 1 y el 3 → «Guardadas las asignaciones de 2 alumnos». En la nube:
  `asignaciones/9PQCE38L: [15]` y `asignaciones/DBA2: [15]`.
- El alumno 1, en la página de la tarea: «Obligatoria para ti · Plazo: domingo 25-10»; el 3
  (DBA2), igual en la portada.

### 8. Fallos — PASA

- Un fallo a propósito del alumno 1 en la tarea 15 (ítem en inglés) → documento en
  `practicas-espacios/<A>/fallos/9PQCE38L-…` con `tarea: 15` y la explicación que vio: «2: no
  (it ends in 3, which is an odd digit) / 3: no (the sum of its digits is 7 + 5 + 5 + 3 = 20,
  which is not a multiple of 3) / …» — ligada a los números del ítem.
- En el panel, «Cargar fallos»: «Los fallos más repetidos (1 fallos)» con el ítem (`7553`), las
  destrezas `U2-1C-05 … U2-1C-10` y el ejemplo; «Qué le cuesta a cada alumno: 1 · Prueba A uno
  (9PQC-E38L) · 1 · Semáforo de divisibilidad 1 (Semáforo básico): 1».

### 9. «Hoy» — PASA

Tarea 15, últimas 24 h: «Tarea asignada: cuentan solo los 2 alumnos asignados (2 no asignados,
fuera de todas las cifras). Sin alertas … Han entrado alguna vez: 1 de 2 (50 %). Activos en la
ventana: 1 (50 %). Tarea completa (20 puntos): 0. Plazo: hasta el 2026-10-25. Entregadas: 0; sin
entregar: 2. Aún no han entrado: Prueba A tres …» y la tabla por ejercicio
(`semaforo ej. 1 ★ · 1 · 0 · 20 % (1) · 0`). Con «La vigente (automática)» elige la tarea 1 (la
obligatoria de plazo más próximo). Los «2 no asignados» son el 2 y el 7NPD (n.º 60, registrado
en ese momento); ver hallazgo 5 sobre «han entrado».

### 10. El modo antiguo, igual que antes — PASA

- **Código 60** sin registrar (`semaforo/?c=7NPD`, navegador sin nada guardado de él): la app
  pide `practicas-alumnos/7NPD` (404) y lee `practicas/semaforo--7NPD`, como siempre.
- **Panel de Juan Luis**: con su cuenta, selector «Sistema actual (códigos de 4)» → «Cargar de
  la nube»: «Cargados 58 registros de práctica y 9 de tareas, de 13 alumnos, y las asignaciones
  de 3», sin errores en la consola. (No se miró ningún dato de alumno: solo el recuento.)
- **Informe sin `--espacio`**: `node herramientas/informe-actividad.mjs --alumnos 51 --tarea 1`
  con el script actual y con el de antes de la 68 (`52ecbef^`) dan **la misma salida** (52
  líneas; solo cambia el minuto de la cabecera). Repetido sobre 361f6c1 (con los cambios de la
  70 en el informe): igual.
- Las frases de la entrada del modo antiguo cambiadas por la 64 (sin «4 caracteres») son las
  únicas diferencias visibles, ya aceptadas en su cierre.

### 11. Códigos de 4 (tarea 72) — PASA

- **Generado de 4** (DBA2, de A): entra en el sistema nuevo — portada con las tareas de A, la
  15 «Obligatoria para ti», progreso en el espacio de A (criterio 6).
- **De los de siempre, registrado a mano** (7NPD con `n: 60` en el espacio de A, escrito con el
  SDK como A → «registrado»): `semaforo/?c=7NPD` entra en el sistema nuevo y su fallo va a
  `practicas-espacios/<A>/fallos/7NPD-…` («2: no (acaba en 5, que es una cifra impar)…»).
- **El mismo sin registrar** (A lo borra; `get` sin cuenta → 404): `semaforo/?c=7NPD` vuelve al
  modo antiguo (`practicas/semaforo--7NPD`), en un navegador que lo había visto registrado.
- Banco REST, sección «Códigos de 4 (tarea 72)»: todas ✓ (en `BANCO-REST.txt`).

### 12. A 375 px y en los dos idiomas — PASA

Ventana de 375 px de ancho; en cada página, `scrollWidth` = 375 (sin desplazamiento lateral):
portada con código de 8 (y con `?idioma=en`), página de la tarea 15 en alterno y en inglés
(«Test 69 assigned · Required for you · Deadline: Sunday 25/10 · Finish the exercise with ★ and
1 more from the list…»), el semáforo en inglés («Which of these is 627 divisible by?… None ·
Check»), la portada del código 7NPD en modo antiguo y el panel. La portada sale en español con
`?idioma=en` en los dos sistemas (igual que antes: solo los ítems y la página de la tarea siguen
el idioma). Un código de 8 que no existe: «Ese código no existe. Copia el de tu correo o usa tu
enlace.»

### 13. `npm test` — PASA

- Sobre 8982a78: **884 de 884**.
- Sobre 361f6c1 (con la 74 y el código de la 70): **904 de 904**; y en el navegador, con ese
  código: B entra en su espacio sin «Pasar al sistema nuevo» ni «Profesores» (las dos secciones
  `hidden`), sin errores en la consola; la portada del alumno 1 igual («3 de 20 puntos»); el
  informe sin `--espacio`, igual que antes de la 68.

## Lo que no se probó (honesto)

- **Descargar el CSV** y **las tarjetas** del panel: descargan o imprimen un fichero; no se
  pulsaron. Cubiertos por los tests de `resultados`.
- **Sin red** en el navegador con un código de 8 (lo probó la 64 con Firestore falso).
- **El informe con `--espacio`** y una cuenta lectora: el banco REST prueba que un lector lee
  sin escribir (sección «Lectores»), pero no hay cuenta lectora; el campo para añadirla lo
  puso la 70 durante la revisión y no se probó (hallazgo 1). Es cosa del paso de Juan Luis,
  no de los compañeros.
- **Un compañero con cuenta de Google de murciaeduca** que no sea Juan Luis: el compañero
  desechable era de correo y contraseña. El camino del panel es el mismo (`estadoProfesor`,
  `pedirAlta`); lo que no se ha visto es la ventana de Google de otra cuenta del centro.
- El bloqueo de ejercicios de una tarea empezada y «Duplicar», en el navegador (sí en tests).

## Conclusión

**Se entrega.** El sistema de varios profesores cumple el diseño (DISENO.md de la 57, con los
cambios de la 72) y la separación aguanta tanto en el panel como desde la consola o por REST.
Los compañeros pueden empezar (previsto el lunes 14-12) con `docs/practicas-como-empezar.md`.
Antes conviene que Juan Luis haga la limpieza de los hallazgos 2 y 3 (unos documentos de
prueba que solo se borran desde la consola, y las contraseñas de las cuentas de prueba).
Para el paso de Juan Luis (tarea 70), este veredicto es el «se entrega» que pide su ficha.
