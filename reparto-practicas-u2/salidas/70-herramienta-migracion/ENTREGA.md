# Entrega de la tarea 70 · Juan Luis pasa al sistema nuevo con sus códigos de siempre

Sesión `s-20261017T215325-bbc75a2d` (PU2 T70, ALTO), 17-18 de octubre de 2026, atendida.
Commits del código: **`dc260d2`** (herramienta, ensayo, informe, tests) y **`e41349a`** (la fusión
adapta el progreso de la Fábrica, aviso de la 76). Los dos subidos a `main` y publicados.

**El paso está HECHO**: Juan Luis lo ejecutó desde su panel publicado el domingo 18-10 hacia las
9:35 (hora peninsular; de día, por decisión suya), con la 69 en «se entrega».

## Qué se ha hecho

- **`practicas/profesor-migracion.js`** (nuevo): la herramienta «Pasar al sistema nuevo».
  - Lógica pura: `leerNumeros` (intervalos; los 60-63 de Claude siempre fuera),
    `alumnosQuePasan` (código de siempre `codigoAlumno(n − 1)` y AJJN con n 1000),
    `configDeJuanLuis` (sus `TAREAS` tal cual, la 1 con `progresoPorPractica`, fechas de `UNIDADES`,
    `longitudCodigo: 4`), `planDelPaso` (qué se registra, qué se copia y con qué id; bloqueos si un
    código es de otro profesor, tiene otro número o el número ya tiene otro código; tope de fallos
    8000 y de escrituras 15 000), `fusionDeProgreso` (gana lo más avanzado, nunca retrocede; adapta
    las prácticas con ejercicios quitados) y `fusionDeAsignacion` (unión).
  - Por REST con el token de la sesión (`getIdToken()` en el panel): la misma lógica sirve en el
    panel y en el ensayo desde Node.
  - Pantalla (solo el administrador, en su espacio): números de lista, AJJN, «1. Ensayo (no escribe
    nada)», confirmación escrita `PASAR`, «2. Pasar al sistema nuevo» y comprobación automática (el
    plan repetido tiene que salir vacío); «Copiar aquí la lista de nombres del sistema actual»;
    «Cuenta lectora del informe diario» (no había dónde añadirla en el panel: hallazgo 1 de la 69).
- **`practicas/profesor.html`** y **`practicas/profesor.js`**: la sección y su enganche (solo `esAdmin`).
- **`herramientas/informe-actividad.mjs`**: con `--espacio`, `--alumnos N` da la lista de los códigos
  de siempre 1..N (sin CSV); `leerCsvCodigos` acepta códigos de 4, tomados solo de la columna «Código»
  o del enlace (`?c=`), nunca de un nombre como «Juan».
- **`herramientas/ensayar-migracion.mjs`** (nuevo): el ensayo con el profesor de prueba A y los
  códigos 62 y 63 (`--sembrar`, `--ejecutar`, `--config`, `--restaurar <fichero>`).
- **Fuera de la lista de la ficha** (sin reclamos vivos sobre ellos):
  - `practicas/_comun/tareas.js`: `erroresConfig` acepta `progresoPorPractica: true` en la tarea 1 de
    un espacio (antes la rechazaba). Sin esto la tarea 1 de Juan Luis no podía seguir leyendo el
    progreso de la práctica libre, que es lo que pide la ficha.
  - `practicas/profesor-tareas.js`: el editor conserva `progresoPorPractica` al guardar la tarea 1
    (antes se lo quitaba en silencio).
  - `tests/practicas-espacio.test.js`: su test daba por mala justo esa configuración.
- `practicas/_comun/textos.js` no hizo falta tocarlo.

## Lo que cambia respecto a la ficha

- **Primero se registra y después se copia** (la ficha decía lo contrario). Las reglas solo dejan
  escribir en el espacio documentos de códigos ya registrados a nombre del dueño (`alumnoDe`), así
  que copiar antes es imposible. Lo que la ficha buscaba («si algo falla a medias, se puede repetir
  sin duplicar») lo da la fusión: copiar nunca pisa lo que ya hay en el espacio y repetir no escribe
  nada (test y comprobación en el ensayo y en el paso).

## Lo comprobado

- `npm test`: **930 de 930** (tras `e41349a`). `tests/practicas-migracion.test.js`: 19 de 19, con una
  nube falsa que imita las reglas (escribir en el espacio exige el código registrado; los fallos solo
  se crean; crear un código existente da 409).
- **Ensayo** (lanzado por Juan Luis el 18-10, ~00:45, con el profesor de prueba A): 14 de 14.
  Literal: «Registrados 2 (ya lo estaban 0), copiados 10 documentos y 0 fallos, configuración
  guardada.» · «✓ el plan repetido sale vacío» · 7 de progreso libre y 1 por tarea «está en el espacio
  y no retrocede» · 2 asignaciones · «✓ la app resuelve XY4Z al espacio de A con el n.º 62», ídem B5YN
  con el 63 · «✓ la configuración de A tiene la tarea 1 con progresoPorPractica y códigos de 4» ·
  «Todo como se esperaba.»
- **Navegador** (Chrome, servidor local, nube real, con el navegador sin nada guardado de esos códigos):
  `semana.html?t=1&c=B5YN` → «★ 6 de 6 · a elegir 4 de 4 · 100 de 100 puntos · ¡Tarea cumplida!»,
  leyendo `practicas-alumnos/B5YN`, `config/tareas` y `progreso-libre` del espacio de A;
  `semana.html?t=2&c=XY4Z` → criba ej. 2 con «3/10 puntos» (de `progreso-tareas`); `recta/?c=XY4Z` →
  ej. 1 hecho, ej. 2 «6/10»; portada `?c=XY4Z` → tarea 1 «16 de 100 puntos»; 0 peticiones a las
  colecciones antiguas; sin errores en la consola. La sección del panel se pintó a 1400 px (montada
  con un contexto falso, sin escribir).
- **El paso de verdad** (Juan Luis, panel publicado, 18-10 ~9:35): ensayo previo «Alumnos: 52 (0 ya en
  tu espacio, 52 por registrar) · Progreso de práctica libre (y tarea 1): 47 → 47 por copiar ·
  Progreso por tarea: 0 · Asignaciones: 0 · Fallos: 282 → 282 por copiar · Tareas y fechas: se copian
  tus 8 tareas de siempre · Escrituras: 382 (2 %)». Resultado literal: «Hecho: 52 códigos registrados,
  47 documentos copiados, 282 fallos, tareas y fechas guardadas.»
- **Después del paso, por REST y sin cuenta** (como la app de un alumno): AJJN a nombre de Juan Luis
  con n 1000; 60 y 61 sin registrar, 62 y 63 en el espacio de A (no en el suyo); su configuración es
  la de `main` tras la 76 (tarea 2 con `['fabrica', 1]`), tarea 1 con `progresoPorPractica`,
  `longitudCodigo: 4`; dos alumnos al azar (n.º 4 y 18): todos sus documentos iguales en el espacio y
  `resolverCodigo` los lleva a su espacio con su número. El n.º 44 empezó a practicar a las 9:56,
  después del paso, y su progreso fue directo al espacio (primer alumno real en el sistema nuevo).
- **Panel** («Hoy», sistema nuevo): 52 alumnos, 8 han entrado, 2 tareas completas; el informe del
  sistema actual daba 7 de 51 y 2: la diferencia es AJJN.
- **Informe con la cuenta lectora** (Juan Luis en Terminal): «Han entrado alguna vez: 8 de 51 · Activos
  en la ventana: 5 · Tarea completa: 2 · Plazo: hasta el 2026-10-22» (el 8.º, el n.º 44 de esa mañana).
- **CSV de «Qué falla más»** descargado antes del paso: 232 filas (los fallos de los alumnos de la lista
  del 16-10 al 17-10), en su carpeta del curso.

## Lo hecho fuera del código

- Cuenta lectora creada por Juan Luis en la consola y añadida como lectora desde el panel.
- Rutina `trig_018p4Y73wGMvZu7Uxjf27Tc1`: el paso 1 pasa a
  `node herramientas/informe-actividad.mjs --espacio <uid de JL> --alumnos 51 --horas 24 --grupos "1.º A:1-29,E1CB:30-46,E1DB:47-51"`.
  `LECTOR_EMAIL` y `LECTOR_CLAVE`, en las variables del entorno en la nube «Default» (la API de las
  rutinas no admite variables en la rutina). Juan Luis añadió también `firestore.googleapis.com` e
  `identitytoolkit.googleapis.com` a los dominios permitidos.
- Lista de nombres copiada a «Mis alumnos» y guardada cifrada (contraseña en su llavero).

## NO comprobado / pendiente

- La recopia de lo que algún alumno escriba en el sistema actual durante la hora siguiente al paso
  (el navegador recuerda una hora su modo): a las 8:2x UTC no había ningún documento antiguo más
  nuevo que su copia. Juan Luis la repite con «Ensayo» y, si hace falta, «Pasar».
- El informe de las 21:30 con la cuenta lectora en la nube: lanzado a mano por la sesión; resultado en
  la terminada.
- La pestaña «Copiar aquí la lista…» y «Añadir como lectora», probadas por Juan Luis en su panel, no
  por la sesión.

## Para las tareas siguientes

- **71** (limpieza): las colecciones del modo antiguo siguen intactas (`practicas`, `practicas-tareas`,
  `practicas-asignaciones`, `fallos`, `divisores`). Ya nadie escribe en ellas salvo una pestaña vieja.
- **Propuesta aprobada por Juan Luis el 18-10**: que «Hoy» (y el informe) no cuenten los números de
  1000 en adelante (AJJN), que hoy suman 1 a los alumnos y a «sin entregar».
- Cambiar o borrar las cuentas de prueba A y B (sus contraseñas pasaron por el chat; lo pide la 69).
- En la nube, del ensayo: XY4Z y B5YN registrados en el espacio de A, sus 10 documentos y la
  configuración de A; y en el modo antiguo, `practicas/recta--XY4Z` y `practicas-tareas/t2--criba--XY4Z`
  sembrados.

## Cómo probarlo en un minuto

`npm test`; `node --test tests/practicas-migracion.test.js`. El ensayo:
`PROFE_A_EMAIL=… PROFE_A_CLAVE=… node herramientas/ensayar-migracion.mjs` (sin `--ejecutar`, solo el plan).
En el panel publicado, sistema nuevo de Juan Luis: «Pasar al sistema nuevo» → «1. Ensayo» tiene que
decir «No queda nada por pasar».
