# Entrega de la tarea 52 · Página de la tarea v2 y portada por unidades

Sesión `s-20261017T082741-51bbe95f`, 2026-10-17. Commit **bf65a9f**.

## Ficheros
practicas/{semana.js,semana.html,portada.js,index.html}, tests/practicas-semana.test.js y **practicas/vista-tareas.js (nuevo)**.
Desvío de la ficha: la lógica común de página y portada (ámbito del progreso, asignación, frases de plazo, secciones por unidad) va en ese fichero nuevo, sin DOM, para no duplicarla; no estaba en «Ficheros que toca» pero no pertenece a ninguna otra tarea. No se ha tocado `_comun/textos.js`: las claves de la 51 bastaban.

## Qué hace
- Tarea 1 (`progresoPorPractica`): progreso de la práctica, código de resultado con el día de siempre (`est.dia`). Tareas v2: progreso y nube de su tarea (`tareaId`), código con `diaEntrega`.
- Página: etiqueta Repaso / Obligatoria / Obligatoria para ti + frase de plazo (Plazo / Fuera de plazo · N días / Entregada con N días de retraso / ✓ Entregada); «fuera de plazo» por ejercicio; «· repaso U1» cuando la unidad de la práctica no es la de la tarea.
- Asignación: `leerAsignacion` (4 s) copiada en `practicas.asignacion.<código>`; un no asignado ve la tarea como Repaso, sin plazo ni marca.
- Portada: unidad actual arriba y abierta; anteriores en `<details>` plegados (se recuerda cuáles abre el alumno); U2 conserva los bloques por semana, U1 lista plana; fuera «Repaso de la unidad 1» y SIN_COLETILLA; una unidad vacía o futura no sale.

## Probado
npm test 793 en verde (nuevos: 9 en practicas-semana). Navegador (localhost, código 60): portada con U2 abierta y U1 plegada; `semana.html?t=1` con «Obligatoria · Plazo: jueves 22-10» y «· repaso U1»; `?t=2` con su progreso separado (★ 1 de 6, el ejercicio de prueba de la 51) y «Plazo: jueves 29-10». No probado: asignación real en Firestore, estados «fuera de plazo» en pantalla (solo en test), 375 px (la ventana no se estrechó), inglés en navegador.

## Propuestas
- El título de la portada (`portada_titulo`, «Prácticas de la unidad 2») ya no encaja con varias unidades; cambiarlo es de textos.js.
- `practicas/expresion/index.html` aún dice «(repaso de la unidad 1)» en su título.
