# Entrega de la tarea 55 · Revisión de extremo a extremo del modelo de tareas v2 y documentación

Sesión `s-20261017T085758-fd6852c8`, 2026-10-17. Commit de la documentación **`17d97af`**.

## Ficheros entregados

- `docs/practicas-unidad2.md` (+150 líneas netas): §1 nuevo apartado «Unidades, plazos,
  asignación y progreso por tarea (modelo v2)» (unidades y portada, los tres tipos de tarea,
  plazo y retraso, asignación, progreso por tarea, la tarea 1 como excepción, cómo se añade
  una tarea); §2 con «Retrasos», «Asignar tareas», el retraso en «Tareas de la semana», el
  filtro por tarea de los fallos y un punto 7 nuevo sobre el **informe diario y su rutina**;
  §3 con los campos y funciones nuevos de `base`, `nube`, `catalogo` y `tareas`,
  `vista-tareas.js` y una **tabla de las colecciones de Firestore** (quién lee y escribe);
  el día del código de 20 caracteres (último terminado en la 1, día de entrega en las v2).
  Lo que seguía siendo cierto no se ha reescrito.
- `README.md` (+20): dos puntos nuevos en «Prácticas de la unidad 2» (tareas v2 e informe
  diario) y las colecciones del progreso.
- `salidas/55-revision-v2/VEREDICTO.md`: **los 10 criterios PASAN**, con lo observado.
- `salidas/55-revision-v2/HALLAZGOS-FUERA-DE-CRITERIO.md`: 5 decisiones para Juan Luis y 4
  avisos.

No se ha tocado código. No se reabre ninguna tarea.

## Tests

`npm test` en un worktree limpio de `origin/main`: 792 de 792 en 933f763 (lo probado) y
793 de 793 en 175835b (al cerrar, con la 57 y la 58 ya comiteadas). La documentación no
lleva tests.

## Cómo se probó (resumen; detalle en VEREDICTO.md)

Worktree limpio en el scratchpad con dos tareas de prueba **sin comitear** (900 asignada con
plazo vencido, 901 de repaso), servido en el puerto 8095; dos «aparatos» = los orígenes
`localhost` y `127.0.0.1`; códigos de prueba 60-63 (7NPD, KTFN, XY4Z, B5YN) contra el
Firestore de verdad; panel con 63 nombres ficticios y la sesión de Google ya abierta;
asignaciones guardadas desde el panel y vaciadas al terminar; informe con `--tarea 900`.

## Pendiente de Juan Luis

- Los hallazgos 1-5 (sobre todo el 1: la rutina del informe elige la tarea por su cuenta).
- Si quiere, borrar en la consola de Firebase los datos de prueba de los códigos 60-63
  (lista en VEREDICTO.md, al final). Ninguno estorba.

## Probarlo en 1 minuto

Leer `docs/practicas-unidad2.md`, §1 «Unidades, plazos, asignación y progreso por tarea» y
§2 punto 7.
