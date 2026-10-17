# Entrega de la tarea 51 · La base en el ámbito de una tarea (tareas v2, I3)

Sesión `s-20261017T065839-a86bc12f`, 2026-10-17. Commit **d828fd9**.

## Ficheros

`practicas/_comun/base.js`, `practicas/_comun/registro.js`, `practicas/_comun/textos.js`,
`tests/practicas-comun.test.js`, `tests/practicas-registro.test.js` (5 ficheros, +280 −27).

## Qué hace

- **Ámbito** (DISENO.md C.2). `ambitoDe(semana, tarea, slug, n)` → `{ tipo, tareaId, semana }`:
  - sin `&semana=` → práctica libre, como siempre;
  - **tarea 1** (`progresoPorPractica`) → práctica (clave y documento de siempre), `tareaId: 1`
    para los fallos, vuelta a la tarea al salir: **igual que hoy**;
  - tarea v2 con el ejercicio dentro (★ o elegir) → `tipo: 'tarea'`: clave
    `practicas.v1.<slug>.<código>.t<id>` y documento `practicas-tareas/t<id>--<slug>--<código>`;
    misma fusión, mismo tope, misma migración (`migrarProgreso` con los parámetros de la práctica);
  - tarea v2 sin ese ejercicio (enlace tocado a mano) → se ignora `semana`: práctica libre con su menú;
  - tarea que no existe → como hasta hoy (vuelve a `semana.html?t=<id>`, que lo dice), sin fallos apuntados.
- `ubicacionProgreso(slug, código, tareaId = null)` → `{ clave, nube: { coleccion, id } }`: lo único
  que usa la base dentro de `arrancar` para leer, guardar y subir.
- **Para la 52** (semana.js / portada.js no se tocan aquí): `progresoGuardado(slug, código, tareaId)`
  y `sincronizarGuardado(slug, código, { tareaId, ...opciones })` aceptan ya la tarea; sin `tareaId`
  hacen exactamente lo de antes. La 52 solo tiene que pasar `tarea.id` en las tareas sin
  `progresoPorPractica` (`tareaId: tarea.progresoPorPractica ? null : tarea.id`).
- **Repetir** dentro de una tarea hecha: como hoy, sobre el progreso de la tarea (solo suma `repeticiones`).
- **Sin avisos** de lo hecho fuera de la tarea: no se añade ninguno.
- **Fallos**: `datosFallo({ …, tarea })` manda `tarea` solo si es un entero 1-1023 (lo que acepta la
  regla); la base lo pasa siempre que la tarea exista (también la 1). `leerFallos(desde, token, { tarea })`
  filtra en el cliente (filtrar en la consulta pediría un índice compuesto) y `deLaTarea(fallos, tarea)`
  es la función pura. El panel de la 53 ya filtra por `tarea` en `agruparFallos`.

## Claves de texto nuevas (`T.es` / `T.en`, para la 52)

| Clave | es | en |
|---|---|---|
| `tarea_repaso` | Repaso | Review |
| `tarea_obligatoria` | Obligatoria | Required |
| `tarea_obligatoria_para_ti` | Obligatoria para ti | Required for you |
| `tarea_plazo(iso)` | Plazo: jueves 22-10 | Deadline: Thursday 22/10 |
| `tarea_fuera_de_plazo(dias)` | Fuera de plazo · 3 días de retraso | Past the deadline · 3 days late |
| `tarea_entregada_tarde(dias)` | Entregada con 3 días de retraso | Handed in 3 days late |
| `tarea_entregada` | ✓ Entregada | ✓ Handed in |
| `tarea_ejercicio_fuera_de_plazo` | fuera de plazo | late |
| `unidad_titulo(n, nombre)` | Unidad 2 · Divisibilidad | Unit 2 · Divisibility |
| `unidad_tareas` / `unidad_practicas` | Tareas / Prácticas | Tasks / Practices |
| `repaso_de_unidad(n)` | · repaso U1 | · U1 review |

`tarea_plazo` recibe la fecha `'AAAA-MM-DD'` de `hasta` tal cual; `fechaCorta(iso, idioma)` está
exportada por si hace falta la fecha sola. Los tipos van con mayúscula (son etiquetas); si la 52 los
mete dentro de una frase, que los pase a minúscula.

## Tests

54 en `practicas-comun` + `practicas-registro` (8 nuevos, 6 y 2: ámbito en los cinco casos, **regla de
publicación** con la tarea 1 real —clave y documento de la práctica para todos sus ejercicios—, id
del documento frente a la regla de Firestore, la base solo usa la ubicación del ámbito, `progresoGuardado`
y `sincronizarGuardado` con tarea, textos, `tarea` en los fallos y el filtro). `npm test`: 780 en verde.

## Probado en el navegador (código 60, `7NPD`, contra el Firestore de verdad)

1. `practicas/semaforo/?c=7NPD&ejercicio=3&semana=2&num=2`: el progreso va a la clave `….t2` y a
   `practicas-tareas/t2--semaforo--7NPD` (GET 404 → PATCH 200, luego GET/PATCH 200); terminado el
   ejercicio, el documento de la tarea lo tiene terminado y `practicas/semaforo--7NPD` sigue sin existir.
   Cada fallo, POST a `fallos` con `tarea: 2` → 200.
2. `practicas/semaforo/?c=7NPD`: el ejercicio 3 sale «Empezar», sin aviso; un acierto ahí va a la clave
   de la práctica y la de la tarea no cambia.
3. Otra vez el enlace de la tarea: repetición («Era una repetición…»), `repeticiones: 1` en la tarea.
4. `…&ejercicio=3&semana=1`: clave de la práctica, fallo con `tarea: 1`, «← Tarea de la semana».
5. `…&ejercicio=4&semana=2` (no está en la tarea 2): menú de la práctica libre.

No probado: dos navegadores a la vez (la fusión es la misma función de `nube.js`, con sus tests) ni
375 px (no cambia nada visible). Quedan en Firestore datos de prueba del código 60:
`practicas-tareas/t2--semaforo--7NPD`, `practicas/semaforo--7NPD` (1/10 en el ej. 3 si llegó a subirse)
y unos diez fallos de `7NPD` con `tarea` 1 y 2.

## Probarlo en 1 minuto

`npm run servir` y abre `http://localhost:8080/practicas/semaforo/?c=7NPD&ejercicio=3&semana=2`;
responde mal un ítem y mira en las herramientas del navegador, Application → Local Storage, que aparece
`practicas.v1.semaforo.7NPD.t2` y no cambia `practicas.v1.semaforo.7NPD`.
