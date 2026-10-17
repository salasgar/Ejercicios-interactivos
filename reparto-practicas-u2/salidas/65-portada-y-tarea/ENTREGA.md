# Entrega de la tarea 65 · Portada y página de la tarea con las tareas del profesor

Sesión `s-20261017T171734-29bc0f33`. Commit **`4c2348c`**.

## Ficheros
practicas/{portada,semana,vista-tareas}.js, practicas/_comun/textos.js (3 frases), tests/practicas-semana.test.js (9 tests nuevos). `index.html` y `semana.html` no hicieron falta.

## Qué hace
- `vista-tareas.js`: `identificar(texto)` (4 → TAREAS/UNIDADES sin red; 8 → `resolverCodigo`: tareas y fechas del profesor con `unidadesCon`, uid, n), `contextoGuardado` (copia del navegador, para pintar sin esperar), `cargarAsignacion(código, { profesor })` (lee `practicas-espacios/{uid}/asignaciones/{código}`).
- Portada: pinta al instante con la copia, resuelve y repinta; código inexistente → se olvida y aviso; sin red ni copia → prácticas sin tareas + aviso.
- Página de la tarea: busca `t` entre las tareas del profesor («Esa tarea no existe» + sus tareas); la entrada acepta 4 u 8 (`maxlength` 12); pasa `profesor` a `sincronizarGuardado`; sin caja de código de resultado si el número de lista no cabe.
- Enlaces `semana.html?t=1&c=<4>` y `?t=1` intactos.

## Comprobado
- `npm test`: 850 de 850; `tests/practicas-semana.test.js`: 45 de 45.
- Navegador (servidor local con Firestore falso, código inventado K7QMP3XA, profesor uidProfesorA0001): portada con código de 8 → GET practicas-alumnos, config/tareas, asignaciones; sale «Solo para algunos» (Obligatoria para ti) y «Tarea del profe A» (plazo 30-10); `semana.html?t=1` → ejercicios y progreso en `progreso-tareas/t1--…`; `t=11` con código de 8 → «Esa tarea no existe» + sus tareas; `t=11&c=7NPD` → lo de hoy, solo `practicas-tareas/`; `?c=ZZZZ-ZZZZ` → «Ese código no existe…».
## No comprobado
Contra la nube real; sin red real en navegador (solo en tests del resolver de la 62); 375 px.
