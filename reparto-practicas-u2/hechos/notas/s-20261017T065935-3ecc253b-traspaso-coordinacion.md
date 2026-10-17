# Traspaso — Coordinación del reparto PU2 (revisión de la app y app para varios profesores)

Actualizado: 2026-10-17 22:35 (hora peninsular) · Sesiones previas: 2 (coordinadoras s-20261016T122625-186b4bd8, Fable 5.1, 16-10 y 17-10; s-20261017T065935-3ecc253b, Opus 5.5, 17-10). Sustituye al traspaso `hechos/notas/s-20261016T122625-186b4bd8-traspaso-coordinacion.md`.

## Objetivo

Juan Luis revisa la app de prácticas (`practicas/`) y va diciendo lo que observa o decide. La sesión coordinadora le da su opinión, con desacuerdo razonado si lo hay, y convierte cada observación en una ficha nueva del reparto PU2, numerada al final (la siguiente libre es la **73**). Otras sesiones ejecutan esas fichas con su frase de arranque. Desde el 17-10 el reparto construye además la **app para varios profesores** (diseño de la 57, tareas 61-72). La coordinadora hace también lo que él pide fuera del reparto: Classroom, correos, comprobaciones en Chrome y Gmail.

## Estado actual

El estado de cada tarea está en `reparto-practicas-u2/_ESTADO.md`, que es una vista sacada de `hechos/`.

A las 22:30 del 17-10:
- **LISTAS:** de la 1 a la 68.
- **PENDIENTE:** la **72**. Es la única libre, sin reclamo, y Juan Luis ya tiene su frase.
- **BLOQUEADAS:**
  - la **69**, que espera a la 72;
  - la **70**, que espera a la 69 y a que él confirme la fecha;
  - la **71**, que espera a su paso al sistema nuevo y a su firma.

Fuera del reparto, hecho el 17-10:
- Informe diario comprobado: sale a las 21:3x, elige la tarea vigente y cuenta 51 alumnos.
- Material **«Códigos alumnos»** creado en borrador en Classroom (curso 877206244643, id 162774800422). Él tiene que borrar a mano el suyo, descuadrado (162774801636); la API no puede porque lo creó él en la web.
- Regla nueva de exámenes anotada en `comun/LECCIONES-Y-LISTA-DEL-PAQUETE.md` y en una nota de `2. Divisibility/reparto-unidad2/hechos/notas/`.
- Probadas en Chrome:
  - el panel con Google y la portada por unidades;
  - la 58 en el semáforo;
  - la 59, en la recta;
  - la 60, la barra en el idioma del ítem.

## Siguiente paso

1. Al retomar: `git fetch`, leer `_ESTADO.md`, listar `hechos/reclamos/` y `hechos/terminadas/`. Si la 72 ha cerrado, regenerar el tablón si nadie lo ha hecho y darle a Juan Luis la frase de la **69** (ALTO).
2. **Pendiente de su respuesta: ¿le va bien el fin de semana del 24-25-10 para su paso al sistema nuevo (tarea 70)?** Se le propuso porque la tarea 1 cierra el jueves 22-10 a las 23:59 y la tarea 2 abre el lunes 26-10 a las 8:00. La 70 se prepara y se ensaya antes, y se ejecuta con él delante.
3. **Pendiente de su respuesta: Unidad 2 fuera de la app.** Se le preguntó si lo hace esta sesión o va como tareas al reparto de la U2. Es:
   - la tarea de Classroom de la app para la semana 2 (del 26 al 29-10);
   - programar los correos de impresión a conserjería: exámenes 2 y 3 y el final, el jueves anterior a las 7:00; hojas 2-4, el lunes a las 7:00.
4. Seguir recibiendo sus observaciones: para cada una, opinión y ficha 73, 74…

Banda de modelo para retomar: ALTO (Opus 5, esfuerzo Alto). Hay que juzgar observaciones, coordinar la construcción de varios profesores (seguridad, paso de sus datos) y escribir fichas que otras sesiones ejecutan sin preguntar.

## Decisiones tomadas

| Decisión | Por qué |
|---|---|
| Las observaciones van al reparto PU2 como tareas numeradas al final, y también la construcción de varios profesores (61-72) | Lo decidió Juan Luis el 17-10: un solo tablón, sin choques entre repartos |
| La coordinadora no escribe código del producto; todo va por ficha. Excepciones antiguas: `herramientas/informe-actividad.mjs` y `desde` de la semana 1 | Que cada fichero tenga un dueño |
| Repaso de realismo en todo problema de enunciado (regla 9 de `proyecto.md`) | Cuatro enunciados imposibles el 16-10 |
| Cuatro estados visuales tras Check en toda la app: verde relleno, rojo tachado, verde punteado (faltaba) y gris, en el CSS común, con `claseCorreccion` en `piezas.js` (T56) | Con el color solo no basta; el tachado se lee en blanco y negro |
| «Comprobar» se oculta al responder en todas las prácticas, y un test lo vigila (T58, T59) | Dos botones azules confundían |
| La barra del ejercicio y el pie van en el idioma del ítem (T60) | Para él era un fallo |
| Modelo de tareas v2: pool por unidad, tareas repaso, obligatoria o asignada, progreso por tarea, retraso en días (45-55, hecho) | Aprobado el 16-10 |
| App para varios profesores: espacio por profesor, alta por solicitud, nombres cifrados, caché y lectura de solo lo nuevo, editor de tareas, «Hoy», informe con cuenta lectora (`salidas/57-diseno-varios-profesores/DISENO.md`) | Diseño aprobado entero el 17-10 |
| **Códigos, decisión final del 17-10 por la noche:** Juan Luis pasa YA al sistema nuevo y sus alumnos **conservan sus códigos de 4 de siempre**, registrados en `practicas-alumnos` como si fueran al azar. Sus alumnos nuevos de próximos cursos: 4 al azar. Los de los compañeros: 8 (T72, y T70 rehecha) | No quiere que memoricen otro código. Acepta que sus códigos se pueden calcular: «Nadie va a fisgonear…; te lo garantizo» |
| Sus compañeros empiezan el **lunes 14-12** | Lo decidió él el 17-10, «en principio» |
| Su paso al sistema nuevo: fin de semana del 24-25-10 (**propuesto, sin confirmar**) | Ventana entre la tarea 1 y la tarea 2 |
| El centro permite usar su proyecto de Firebase con alumnos de sus compañeros | Respuesta del centro, comunicada el 17-10 |
| **Exámenes semanales iguales para todos**, sin versión de dislexia ni de Federico. Las adaptaciones (dislexia, una por alumno, y la de Federico), solo en el **examen final** de cada unidad | Lo decidió él el 17-10 |
| Fechas de inicio de las unidades: U1 14-09, U2 13-10, U3 16-11 (las de `catalogo.js`) | Confirmadas el 17-10 |
| Alumno de prueba de Juan Luis: **AJJN** (número 1000). Los de las sesiones de Claude: 60-63 (7NPD, KTFN, XY4Z, B5YN) | Confirmado el 17-10; nunca se prueba con AJJN ni con 1-51 |
| Informe diario: solo números de lista, grupos y códigos, nunca nombres | El repositorio es público |

## Descartado — no volver a proponer

| Se descartó | Motivo |
|---|---|
| Dar códigos nuevos (de 4 u 8) a los alumnos actuales de Juan Luis | Quiere que conserven los suyos; acepta el riesgo |
| Esperar a junio o septiembre para pasar a Juan Luis al sistema nuevo | Quiere el sistema cambiado ya, sin trabajo en verano |
| El paso del 1 de enero con códigos nuevos y correo a los alumnos | Sustituido por el paso inmediato con sus códigos |
| Un reparto aparte para varios profesores (PVP) | Lo eligió él: en PU2 |
| Emulador de Firestore (Java) para probar las reglas | No quiere instalar Java; se prueba por REST (`herramientas/probar-reglas.mjs`) |
| Versiones adaptadas (dislexia, Federico) de los exámenes semanales | Solo en el final |
| Negritas simuladas con caracteres Unicode en Classroom | Al copiar un código se copiarían caracteres raros |
| Celdas de 1 o 2 mm fijos en Rectángulos; metrónomo en segundos; «two by three» y otros distractores válidos en alguna variante; esconder el código por práctica en vez de eliminarlo; pedir códigos de resultado por correo; tareas de la U1 con plazo; avisar de ejercicios ya hechos en otra tarea | Ya decidido antes del 17-10 (ver el traspaso anterior) |

## Archivos

- `reparto-practicas-u2/_ESTADO.md`: el tablón. `proyecto.md`: reglas, bandas, frase de arranque.
- `reparto-practicas-u2/tareas/tarea-56-…` a `tarea-72-…`: las fichas de esta sesión. Las 61-72 comparten la sección «Lo común a las tareas 61-72».
- `reparto-practicas-u2/hechos/notas/s-20261017T065935-3ecc253b.md`: nota de esta coordinadora, con cada alta y su hora.
- `reparto-practicas-u2/salidas/57-diseno-varios-profesores/DISENO.md`: el diseño de varios profesores. **Los códigos y el paso de Juan Luis los cambian las fichas 72 y 70.**
- `herramientas/probar-reglas.mjs`: las comprobaciones REST de las reglas (de la 61). `herramientas/informe-actividad.mjs`: el informe diario.
- Rutina del informe: https://claude.ai/code/routines/trig_018p4Y73wGMvZu7Uxjf27Tc1 (21:30, hora de Madrid). Pasa a `--espacio` con la cuenta lectora el día del paso (70).
- `…/apuntes-1eso-bilingue/Curso 2026-2027/codigos-app/codigos-alumnos.tsv` y `lista-para-el-panel.txt`: nombres y códigos. **Datos sensibles: nunca al repositorio.**
- `…/apuntes-1eso-bilingue/2. Divisibility/reparto-unidad2/`: el reparto de lo que falta de la U2 (exámenes, Forms, Classroom, impresión). Las tareas 19-21, 23 y 24 esperan a los exámenes del 23-10, 30-10, 6-11 y 13-11.
- Memoria de Claude: `app-varios-profesores.md`, `codigos-de-prueba-app.md`, `examen-personalizado-federico.md`, `alumnos-dislexia.md`, `rutina-informe-actividad-practicas.md`.

## Preferencias para este proyecto

- Tutearle; las horas, en hora peninsular (los hechos van en UTC: convertir).
- Si no estás de acuerdo con una observación, dilo con el motivo y propón otra cosa; él decide. Cuando decide, no se rediscute.
- Las fichas se generan copiando las secciones comunes de `tarea-40-semaforo-ninguno.md`, sustituyendo el número. El generador está en el scratchpad de esta sesión (`gen_fichas.py`) y no se conserva: se rehace igual. Cabecera completa, objetivo con su frase literal y la fecha, pasos concretos, tests, «Cómo saber que ha terminado» con prueba en el navegador, trampas y prohibido.
- Frases de arranque literales, una por sesión libre, con `PU2 T<NN> (<BANDA>)` delante y la banda traducida (ALTO = Opus 5, esfuerzo Alto; MEDIO = Sonnet 5, esfuerzo Medio). Antes, la foto del momento sacada de `hechos/` con `git fetch`.
- Las sesiones cierran en 10-30 minutos y a menudo sin probar en el navegador. **Cuando él pida comprobarlo, la coordinadora lo prueba en Chrome**: en local con `python3 -m http.server` y el código 60, o en solo lectura en Pages. Si algo se ve viejo, hacer una recarga forzada: pasó dos veces el 17-10.
- Al regenerar el tablón: relistar `hechos/` primero, y comprobar que las filas cuadran con las terminadas. El 17-10, la 59 cerró, cambió la cabecera y dejó su fila como PENDIENTE.
- Commits con rutas explícitas. No empujar si hay commits locales de otra sesión sin subir (`git log origin/main..HEAD`).
- Lo que publica o envía (Classroom, correos, impresión), siempre con su visto bueno explícito antes.

## Contexto que no está en los archivos

- La tarea 1 (U2, semana 1) está viva hasta el jueves 22-10 a las 23:59. El examen 1 es el viernes 23-10. La tarea 2 de la app va del lunes 26-10 a las 8:00 al jueves 29-10.
- El 17-10, 7 de 51 alumnos habían entrado. Del informe, a él le preocupan rectángulos ej. 2 (73 % de fallos), divisores ej. 4 (50 %) y el nº 17 (189 fallos).
- Propuesta en el aire, sin respuesta: el recuento de la recta dice «2 are wrong (in red)» justo cuando el 2 es uno de los marcados. Se le propuso escribirlo con letras («Two numbers are wrong»).
- Fuera de este reparto, pendientes de su memoria: comentar la encuesta del ambiente de clase (desde el 17-10); montar el reparto de la Unidad 3 (PU3) la última semana de octubre, con Fable.
- Hay sesiones suyas fuera del reparto que tocan `practicas/` (por ejemplo, 2e96c8e: lo decisivo en `<strong>` en seis enunciados). Antes de una ficha que toque esos ficheros, `git log` y `git status`.
