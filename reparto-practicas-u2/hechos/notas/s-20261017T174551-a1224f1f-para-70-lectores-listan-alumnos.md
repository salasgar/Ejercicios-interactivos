# Para la coordinadora y la tarea 70: que los lectores puedan listar `practicas-alumnos`

De la sesión de la 68 (`s-20261017T174551-a1224f1f`), por decisión de Juan Luis el 2026-10-17 («haz lo que recomiendas»).

## Problema
El informe con `--espacio` lee con una cuenta lectora. Las reglas de `practicas-alumnos` solo dejan LISTAR al profesor dueño
(`profesorActivo() && resource.data.profesor == request.auth.uid`), no a sus lectores. Sin la lista de códigos el informe no sabe
quién no ha entrado (su función principal). Hoy lo salva `--codigos <CSV>`, que obliga a guardar y mantener un CSV en la rutina.

## Propuesta: meterlo en la tarea 70 (ALTO, ya toca `firestore.rules`)
1. Regla (borrador, SIN probar):
   `allow list: if (profesorActivo() && resource.data.profesor == request.auth.uid) || esLector(resource.data.profesor);`
   Con `esLector(uid)` la que ya existe para las subcolecciones. El lector tiene que consultar con `where('profesor', '==', uid)`
   (REST: `runQuery` con ese filtro). Comprobar en el banco `herramientas/probar-reglas.mjs`: lector de A lista los de A;
   lector de A NO lista los de B; sin ser lector, 403; que el lector no pueda crear, cambiar ni borrar.
2. Juan Luis publica las reglas (como en la 61).
3. Informe (`herramientas/informe-actividad.mjs`): con `--espacio`, si no se pasa `--codigos`, listar `practicas-alumnos` con
   `runQuery` y la cuenta lectora, y construir la `lista` ([{ numero: n, codigo }]) con `listaDeCodigos` (ya existe). Entonces
   `listaCompleta` es true y el informe dice quién no ha entrado. `--codigos` se queda como alternativa.
4. Ojo con el límite de lecturas de reglas por consulta (`get()` de `esLector`): se evalúa una vez por consulta, no por documento,
   pero hay que verlo en el banco.

## Qué NO cambia
La pestaña «Hoy» del panel (usa la sesión del propio profesor) y el informe actual de códigos de 4 (hasta la migración).
