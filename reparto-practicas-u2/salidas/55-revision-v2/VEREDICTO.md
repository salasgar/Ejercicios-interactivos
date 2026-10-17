# Veredicto de la tarea 55 · Revisión de extremo a extremo del modelo de tareas v2

Sesión `s-20261017T085758-fd6852c8`, 2026-10-17, de 08:58 a 10:2x UTC.

**Resultado: los 10 criterios PASAN. No se reabre ninguna tarea.** Lo que se vio fuera de
criterio está en `HALLAZGOS-FUERA-DE-CRITERIO.md` (decisiones pendientes para Juan Luis).

## Cómo se probó

- Código de `origin/main` en 933f763 (todo lo de las tareas 49-54 y 56), en un **worktree
  limpio** en el scratchpad de la sesión, servido en `localhost:8095`. Nada del árbol
  compartido se tocó para probar.
- **Dos tareas de prueba solo en ese worktree, sin comitear**: la **900** (unidad 2,
  `asignada: true`, `hasta: '2026-10-15'`, ya vencido; ★ `especiales` 1, a elegir `recta` 1
  y `semaforo` 3, `nElegir: 1`) y la **901** (unidad 2, repaso; ★ `semaforo` 1 y 2, a elegir
  `semaforo` 3). Ninguna existe en producción.
- **Dos «aparatos»**: el mismo Chrome con dos orígenes, `http://localhost:8095` y
  `http://127.0.0.1:8095`, que tienen almacenamiento del navegador separado. Contra el
  Firestore de verdad.
- Códigos de prueba de los números de lista 60-63: **7NPD** (60), **KTFN** (61), **XY4Z**
  (62), **B5YN** (63). Ningún código de alumno real.
- Las respuestas se dieron en la app de verdad (un contestador en JavaScript que lee el ítem
  y pulsa los botones, solo en el semáforo). Para tener tareas **cumplidas** sin hacer 10
  ejercicios se sembró el progreso en el navegador (formato exacto de la base) y se dejó que
  la página de la tarea lo subiera a la nube con su sincronización normal.
- Lo que hay en la nube se comprobó por REST sin cuenta (`get` de cada documento).
- Panel del profesor en el origen de prueba, con una lista de 63 nombres ficticios
  («Prueba 01»…); la sesión de Google del profesor ya estaba abierta en Chrome.

## Los criterios

| # | Criterio | Veredicto |
|---|---|---|
| 1 | Tarea 1 intacta | **PASA** |
| 2 | Progreso separado | **PASA** |
| 3 | Fusión entre aparatos en una tarea v2 | **PASA** |
| 4 | Repetir dentro de una tarea hecha | **PASA** |
| 5 | Plazo y retraso | **PASA** |
| 6 | Asignación de punta a punta | **PASA** |
| 7 | Panel y CSV | **PASA** |
| 8 | Informe | **PASA** |
| 9 | Portada | **PASA** |
| 10 | `npm test` en verde en `main` | **PASA** |

### 1. Tarea 1 intacta — PASA

- `semana.html?t=1&c=7NPD`: «Obligatoria · Plazo: jueves 22-10», 6 ★ y 8 de elegir,
  «· repaso U1» en `jerarquia` y `division`.
- Dos aciertos en la **práctica libre** del semáforo, ejercicio 1 (★ de la tarea 1): el
  documento `practicas/semaforo--7NPD` pasó a 2/10 y la tarea 1 enseña «2/10 puntos ·
  Seguir» y «2 de 100 puntos». Lo de la práctica libre le cuenta.
- Entrando desde la tarea 1 (`semaforo/?c=7NPD&ejercicio=1&semana=1&num=5`): sigue sobre el
  progreso de la práctica (3/10), botón «← Tarea de la semana». No aparece ningún documento
  `practicas-tareas/t1--…`.
- Tarea 1 cumplida (código 63, progreso sembrado): «✓ Entregada», código
  `SL9S-KTBX-PWDC-CVHH-NXXS` en el desplegable. Pegado en el panel, la fila del 63 dice
  «✓ cumplida · 100 pt» con fuente «código de la tarea + prácticas»; leído también con
  `leerCualquierCodigo`: tarea 1, alumno 63, 6 ★, 4 de elegir, día 46.

### 2. Progreso separado — PASA

- `practicas-tareas/t2--semaforo--7NPD` tiene el ejercicio 3 terminado (de la prueba de la 51)
  y `practicas/semaforo--7NPD` lo tiene a 1/10: el menú de la práctica libre enseña «1/10
  puntos · Seguir» en ese ejercicio, la tarea 2 «✓ Terminado».
- Código 61: tras avanzar tres ejercicios en la tarea 901, la práctica libre del semáforo
  (en el otro aparato) los enseña todos «Empezar». Un acierto en la práctica libre del
  ejercicio 2 no cambia la tarea 901 (sigue 3/10) ni su documento.

### 3. Fusión entre aparatos — PASA

Código 61, tarea 901. El aparato B abrió el ejercicio 2 y contestó 3 (3/10). Luego, con las
dos páginas cargadas antes de contestar, A hizo 2 en el ejercicio 1 y B 2 en el ejercicio 3
(la página de B no sabía lo de A). Al recargar la tarea, **los dos ven 2/10, 3/10 y 2/10**
(«7 de 30 puntos»), y `practicas-tareas/t901--semaforo--KTFN` tiene los tres.

(Primer intento descartado: la pestaña A tenía en caché un `tareas.js` de antes de añadir la
901 y su avance fue a la práctica libre. Es un efecto de la prueba; ver hallazgo 6.)

### 4. Repetir dentro de una tarea hecha — PASA

Código 60, tarea 2, «Practicar otra vez» en el semáforo 3 (ya terminado): un fallo a
propósito y 9 aciertos hasta terminar; la base dice «Era una repetición para practicar: tu
resultado guardado no cambia». En `practicas-tareas/t2--semaforo--7NPD`, `repeticiones` pasó
de 1 a 2; puntos (10/10), fallos (4) y día (46) no cambiaron; `practicas/semaforo--7NPD`
tampoco.

### 5. Plazo y retraso — PASA

- Tests con fechas forzadas: `tests/practicas-semana.test.js`, «estadoPlazo: repaso,
  obligatoria y obligatoria para ti, con los días de retraso» (los tres tipos, el día del
  plazo sin retraso, entregada tarde, sin entregar y pasada, el no asignado sin retraso),
  «diaEntrega es el día en que se cumplió por primera vez» y «vistaPlazo: las frases en los
  cuatro estados, en los dos idiomas». Cuadran con B.2.
- El conteo de días no se desplaza con el cambio de hora (`diaDe` va por fecha UTC): 24, 25 y
  26-10-2026 y 28-3-2027 dan días consecutivos con `TZ=Europe/Madrid`.
- En la app, antes del plazo: tarea 1 «Plazo: jueves 22-10», tarea 2 «Plazo: jueves 29-10».
  Con la tarea 900 vencida, los cuatro estados en pantalla (criterio 6).

### 6. Asignación de punta a punta — PASA

- Antes de asignar, la 900 sale «Repaso», sin plazo, para todos.
- Panel → «Asignar tareas»: columna «T900 · … plazo 15/10/2026»; marcados 60, 62 y 63;
  «Guardadas las asignaciones de 3 alumnos». Por REST: `practicas-asignaciones/{7NPD,XY4Z,B5YN}`
  = `[900]`; `practicas-asignaciones/KTFN` no existe.
- En el otro aparato (sin nada en su navegador):
  - 60: «Obligatoria para ti · Entregada con 2 días de retraso», y «fuera de plazo» en los
    dos ejercicios terminados (días 45 y 46; plazo, día 44);
  - 62: «Obligatoria para ti · Fuera de plazo · 2 días de retraso»;
  - 63 (en inglés): «Required for you · ✓ Handed in»;
  - **61, no asignado: «Repaso», sin plazo ni ninguna marca.**
- Portada del 60: la 900 con «Required for you · Handed in 2 days late».

### 7. Panel y CSV — PASA

- «Cargar de la nube»: «… 8 de tareas … y las asignaciones de 3».
- «Tareas de la semana», columna 900: 60 «✓ cumplida · 20 pt · 2 d tarde», 61 «—», 62 «★ 0
  de 1 · 0 de 1 · 4 pt · 2 d de retraso», 63 «✓ cumplida · 20 pt». CSV: estado, puntos (de
  20), día, fuente «tarea», plazo 15/10/2026, entrega 17/10 y 14/10, días 2 / 2 / 0, entrega
  «con retraso» / «sin entregar» / «a tiempo»; el 61, «no asignada».
- «Retrasos en las tareas»: por alumno (60: 1 con retraso, 2 días; 62: 1 sin entregar, 2
  días; 63: 2 a tiempo) y por tarea (T900: 3 con plazo, 1 a tiempo, 1 con retraso, 1 sin
  entregar, 4 días, media 2, máximo 2). CSV con las tres tablas.
- «Qué falla más · tarea 2» y «· tarea 901»: sacadas de los documentos de cada tarea (901:
  empezados 1, terminados 0, como en la nube).
- Sección «Fallos, uno a uno» desde el 17-10: 17 fallos; el filtro por tarea separa «Sin
  tarea (práctica libre)», «Tarea 1» y «Tarea 2» (el fallo a propósito de la repetición).
- Los CSV se leyeron en la página interceptando la descarga (no se bajó ningún fichero).

### 8. Informe — PASA

- `node herramientas/informe-actividad.mjs --horas 24` (sin `--tarea`): «Tarea elegida
  automáticamente: la obligatoria con el plazo abierto más próximo (hasta el 2026-10-22)», la
  tarea 1, leyendo `practicas/`.
- `--tarea 900 --alumnos 63`: antes de asignar, «cuentan solo los 0 alumnos asignados (63 no
  asignados…)»; después, 3 asignados, «Plazo vencido: 1 a tiempo, 1 con retraso, 1 sin
  entregar», y por alumno «entregada 2 días tarde» / «entregada a tiempo» / «sin entregar, 2
  días de retraso». El 61 no sale en nada.
- Con las tareas reales, `tareaVigente` elige la 1 hasta el 25-10, la 2 del 26-10 en
  adelante, y la última vencida si no hay ninguna abierta.
- La rutina de la nube (leída, no tocada) **no** pasa `--tarea 1` fijo, pero elige la tarea
  con su propia regla: hallazgo 1.

### 9. Portada — PASA

- Unidad 2 · Divisibilidad arriba y abierta, con «Tareas» y «Prácticas» (5 subbloques por
  semanas); Unidad 1 debajo, en un `<details>` plegado, con sus 4 tareas y 15 prácticas en
  una lista. Las tareas 2-4 (desde futuro) no salen.
- Nombres sin «(repaso de la unidad 1)»; `propiedades` con «(extension)»; los dos «Caza el
  error» / «Spot the mistake».
- En inglés: «Unit 2 · Divisibility», «Tasks», «Practices», «Week 1 · …», «Review»,
  «Required · Deadline: Thursday 22/10».
- A 375 px (iframe de 375 px; la ventana de Chrome no baja de 570): portada y página de la
  tarea con `scrollWidth` 373 y ningún elemento que se salga.

### 10. `npm test` en verde en `main` — PASA

- 933f763 (lo probado): 792 de 792.
- Al cerrar, sobre `origin/main` actualizado: ver `ENTREGA.md`.

## Datos de prueba que quedan en Firestore

Las reglas no dejan borrar a nadie salvo desde la consola. Todos son de los códigos 60-63
(ningún alumno real) y ninguno estorba (no salen en el informe, que lee los códigos 1-51, ni
en el panel salvo que la lista tenga más de 59 líneas). Si se quieren borrar, en la consola
de Firebase:

- `practicas-tareas/`: `t900--especiales--7NPD`, `t900--recta--7NPD`, `t900--especiales--XY4Z`,
  `t900--especiales--B5YN`, `t900--semaforo--B5YN`, `t901--semaforo--KTFN`; de antes,
  `t2--semaforo--7NPD` (tarea 51) y `t999--semaforo--7NPD` (tarea 49).
- `practicas/`: `semaforo--7NPD`, `semaforo--KTFN`, `recta--KTFN` (de antes),
  `divisores--B5YN`, `recta--B5YN`, `rectangulos--B5YN`, `semaforo--B5YN`, `clasificador--B5YN`.
- `practicas-asignaciones/`: `7NPD`, `XY4Z`, `B5YN`, vaciados al terminar (`tareas: []`).
- `fallos/`: los de `7NPD` del 17-10 (unos diez de la prueba de la 51, con `tarea` 1 y 2, y
  uno de esta, en la repetición de la tarea 2), además de los dos de la 49 con `t = 1000`.
