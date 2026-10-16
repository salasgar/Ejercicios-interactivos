# Entrega · Tarea 54 (tareas v2, I6): informe diario

Sesión `s-20261016T222323-77a81485` · commit **1d380bd** · ficheros: `herramientas/informe-actividad.mjs`, `tests/herramientas-informe.test.js`.

## Qué hace ahora
- **Documentos por tarea**: tarea 1 (`progresoPorPractica`) → `practicas/<slug>--<código>`; las demás → `practicas-tareas/t<id>--<slug>--<código>` (`claveDocumento`).
- **Asignadas**: si la tarea es `asignada`, lee `practicas-asignaciones/<código>` de cada alumno (`leerAsignacion`); los no asignados no se leen ni cuentan en nada, y el informe dice cuántos son.
- **Retraso**: por alumno «entregada a tiempo / N días tarde / sin entregar, N días de retraso» (`estadoPlazo` + `diaEntrega`) y, en el resumen, «Plazo vencido: X a tiempo, Y con retraso, Z sin entregar». Pasado el plazo no salta «Poca actividad».
- **`--tarea` opcional**: sin él, `tareaVigente(hoy)` = la obligatoria (con `hasta`, no `asignada`) de plazo abierto más próximo; si ninguna, la última vencida. Lo dice en el informe. `--alumnos`, `--tarea`, `--horas`, `--grupos` y `--json` siguen igual.
- `agregar` acepta `asignaciones` y `ahora`; `formatear` acepta `motivo`. Nuevas exportadas: `claveDocumento`, `tareaVigente`, `fechaMadrid`, `textoEntrega`.

## Probar
`npm test` (761 en verde). `node herramientas/informe-actividad.mjs --horas 48` da el informe de la tarea 1 (es la vigente hoy). `--tarea 2` da uno vacío; mientras las reglas de la 49 no estén publicadas, avisa de lecturas con HTTP 403 (esperado).

## Informe de ejemplo (real, 17-10 00:26, tarea 1)
```
# Actividad en las prácticas · 17/10, 00:27 (hora peninsular)

Tarea: U2 · Semana 1 · Múltiplos, divisores y criterios. Ventana: últimas 48 h (desde 15/10, 00:27).
Tarea elegida automáticamente: la obligatoria con el plazo abierto más próximo (hasta el 2026-10-22).

## ⚠ Alertas
- Poca actividad: solo 3 de 51 alumnos han hecho algo en la ventana (3 han entrado alguna vez).

## Resumen
- Han entrado alguna vez: **3 de 51** (6 %).
- Activos en la ventana: **3** (6 %).
- Tarea completa (100 puntos): **1**. Ejercicios terminados en la ventana: 11.
- Plazo: hasta el 2026-10-22. Entregadas: 1; sin entregar: 50.

| Grupo | Alumnos | Han entrado | Activos | Completas | Puntos medios |
|---|---|---|---|---|---|
| 1.º A | 29 | 1 | 1 | 0 | 0.0 |
| E1CB | 17 | 2 | 2 | 1 | 6.5 |
| E1DB | 5 | 0 | 0 | 0 | 0.0 |

## Ejercicios de la tarea
| Ejercicio | Prueban | Terminan | Fallos | Reinician |
|---|---|---|---|---|
| divisores ej. 4 ★ | 2 | 2 | 5 % (1) | 0 |
| recta ej. 1 ★ | 1 | 1 | 17 % (2) | 0 |
| recta ej. 2 ★ | 1 | 1 | 27 % (4) | 0 |
| rectangulos ej. 2 ★ | 1 | 1 | 9 % (1) | 0 |
| semaforo ej. 1 ★ | 1 | 1 | 30 % (6) | 1 |
```
