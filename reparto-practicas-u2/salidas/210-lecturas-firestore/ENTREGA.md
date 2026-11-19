# Entrega 210 · Menos lecturas de Firestore, y la app de los alumnos protegida ante una cuota agotada

Sesión s-20261119T131255-2fa96690 (Opus 5.5) · commit de código **6c618b7** · 19-11-2026.
Relevo y cierre: s-20261119T184002-bcbd58ef (Opus 5.5), tras caducar a las 18:12Z el reclamo anterior sin cierre. Revisado lo
heredado (el commit, esta ENTREGA, las dos copias, la caché y la skill), `npm test` 2504/2504, pasada 2 y cierre.

## Hecho

1. **Varias tareas en una lectura.**
   - `~/.claude/lanzador/notas_tarea_app.mjs 15 16 17` → `{ "tareas": [{ id, titulo, hasta, alumnos }, …] }`, en el orden pedido.
     Con un solo número, la salida de siempre (`{ titulo, hasta, alumnos }`, mismas claves por alumno; lo comprueba un test sobre
     `notasDeTarea`). Un número que no es de la app → mensaje y salida 2, antes de leer las subcolecciones.
   - `informe-actividad.mjs --tareas 1,2,3`: una lectura, los informes uno tras otro separados por `---`; con `--json`, última
     línea `{ "tareas": [{ id, titulo, resumen }] }`. `--tarea N` y sin opción, como siempre. Documentado en la cabecera.
   - El cálculo de las notas pasó al repo (`notasDeTarea` en `informe-actividad.mjs`, probado); el script de fuera queda fino.
2. **Caché local con lectura incremental** (`herramientas/cache-lecturas.mjs`, nuevo; la cabecera lo explica):
   - primera vez, todo; después `runQuery` con `where actualizado > desde` (nuevo `consultarDesde`, REST), con
     `desde = mín(actualizado más reciente, hora de la última lectura) − 2 días` (`MARGEN_LECTURA` del panel, importado de
     `practicas/resultados.js`). El `mín` evita que un aparato con el reloj adelantado deje fuera lo de los demás (ver hallazgos);
   - **freno a los bucles**: si la última lectura es de hace menos de 10 min, no se pide nada y se dice en stderr («de la
     caché (leída hace N min)»). Las 35 ejecuciones del 18-11 habrían hecho 1 lectura completa y 34 de cero (hay test);
   - **borrados**: lectura completa cada 7 días desde la última completa, o con `--leer-todo`. Solo el profesor borra
     (bajas de códigos), y un documento de más solo añade un alumno que ya no está: no cambia la nota de nadie;
   - caché ilegible, de otra versión, de otro espacio, con docs sin `id` o con horas en el futuro → lectura completa;
   - se escribe entera (temporal + `rename`) o no se toca; carpeta `~/.claude/cache/firestore-practicas/` (700), fichero
     `<uid>.json` (600). `rutaCache` y `leerConCache` **se niegan** a una carpeta dentro del repo (test);
   - `informe-actividad.mjs`: caché **solo con `--cache`** (o `--leer-todo`). Sin ella, lo de siempre: así sigue la rutina
     de las 21:30 en la nube, que no tiene disco propio. El módulo de caché usa `node:fs` y se carga con `import()` dinámico:
     el navegador (pestaña «Hoy») sigue importando `informe-actividad.mjs` sin `node:*` (el test de siempre lo comprueba).
   - `notas_tarea_app.mjs`: caché **por defecto**; `--leer-todo` y `--sin-cache` (lo de antes).
   - **Esquema real comprobado** (pasada 1): los 1 308 documentos llevan `actualizado` (0 sin él, 0 con fecha futura). Las
     reglas lo exigen entero en toda escritura (`estadoValido`, asignaciones), así que un documento antiguo sin él solo
     podría venir de una migración: entra en la lectura completa y no cambia sin una escritura que se lo ponga.
3. **Parada en 429 y 5xx.** `ErrorFirestore` (motivo `cuota`/`servidor`) en `listarSubcoleccion` (cualquier página: ya no
   puede quedar una lista corta), en `consultarDesde` (también un `RESOURCE_EXHAUSTED` dentro del flujo de `runQuery`) y en la
   lectura de `config/tareas` (`leerConfig` trae ahora `motivo`). Mensaje en una línea («Cuota de Firestore agotada hasta las
   9:00 de Madrid (HTTP 429 al leer «…»): NO reintentes.»), salida **3** (cuota) o **4** (servidor), sin JSON ni caché a
   medias. La guarda del 18-11 de `notas_tarea_app.mjs` se conserva (mismo texto si no hay motivo) y ahora distingue.
4. **App de los alumnos** (`nube.js`): ver la decisión abajo. `pedirJson`, `leerNube` y `leerConfig` añaden `motivo:
   'cuota' | 'servidor'` junto a `estado: 'error'` cuando el servidor contesta 429/5xx; sin red, sin `motivo`. El estado no
   cambia, así que nadie que no mire `motivo` cambia de comportamiento. Nuevo `motivoDeFallo(status)`.
   `espacio.js` **no se ha tocado**: `resolverCodigo` con un 429 se comporta como sin red (copia del navegador si la hay; si
   no, `sin-red`), y no escribe nada en la nube, así que no hay nada que proteger. Hay test del caso 429.
5. **Tests**: 4 nuevos en `herramientas-informe.test.js`, 8 en `herramientas-cache-lecturas.test.js` (nuevo), 3 en
   `practicas-nube.test.js`, y el caso 429 en `practicas-espacio.test.js`. Ninguno toca Firestore (fetch simulado y carpetas
   temporales). Códigos de alumno inventados.

## Decisión del punto 4: `subirFusionado` con la lectura fallida por cuota o servidor

**Decidido: no escribe si la lectura falló por 429 o 5xx y no se sabe nada de la nube (`ultimo` null); devuelve
`pendiente: true`. Si `ultimo` se conoce, escribe como siempre. Sin red, como siempre.**

Razón:
- Con la cuota de **lecturas** agotada, las **escrituras** siguen entrando (son otra cuota del plan Spark). Así que hoy, en
  un aparato que no ha podido leer nunca la nube, `subirFusionado` escribiría **solo lo de ese aparato** encima del documento:
  el profesor vería menos de lo que el alumno hizo en el otro aparato hasta que ese otro aparato volviera a entrar (y si era
  un ordenador del aula con el perfil borrado, nunca). Sin red ese riesgo no existe: la escritura tampoco llega.
- No escribir no pierde nada de este aparato: `base.js` guarda en el navegador **antes** de subir (`guardarSesion` →
  `guardar()` → `subir()`), la siguiente subida (cada 5 respuestas o al terminar un ejercicio) vuelve a leer e intentarlo,
  y al volver a entrar o a la pestaña `leerYFusionar` lee, fusiona y sube lo que la nube no tenga. Ese es el «pendiente de
  subir»: el progreso guardado en el navegador y distinto de la nube; no hace falta otra marca.
- El día de cada ejercicio va dentro del progreso (`dia`), y el plazo se mide con él (`estadoPlazo`): subirlo a las 9:00 del
  día siguiente no lo vuelve «fuera de plazo».
- Lo que sí se pierde si no se escribe: si el alumno usa navegación privada (o borra los datos) y no vuelve con ese aparato,
  lo de esa sesión. Es menos grave y menos probable que machacar en la nube el trabajo de otro aparato, que además no se ve.
- Con `ultimo` conocido (la nube se leyó bien antes en esa misma sesión), la fusión con lo último leído solo puede perder lo
  que otro aparato subiera justo entretanto: es el riesgo de siempre, aceptado en la cabecera de `nube.js`. Ahí escribir
  gana: lo hecho durante el corte llega a la nube y el profesor lo ve.
- `base.js` no necesita cambios: con `pendiente`, `subirFusionado` devuelve `ej: ultimo` (null), así que `ultimoRemoto` no
  finge que la nube tiene lo que no tiene.

## Lecturas medidas (pasadas reales con la cuenta lectora)

- **Pasada 1** (13:22Z, `notas_tarea_app.mjs 15 16`, sin caché previa): 1 lectura de `config/tareas` + **1 308 documentos**
  (335 de `progreso-libre`, 973 de `progreso-tareas`) para **dos** tareas. Antes, dos ejecuciones: ~2 618.
- **Pasada 2** (18:43Z, la misma orden, con la caché de la pasada 1, leída hacía 5 h 20 min): 1 lectura de `config/tareas` +
  **159 documentos** (15 de `progreso-libre`, 144 de `progreso-tareas`: lo cambiado desde dos días antes), salida 0, las dos
  tareas con sus 51 alumnos. La caché queda con 336 + 999 documentos (1 y 26 nuevos desde las 13:22Z), todos con `actualizado`.
  Un 88 % menos que una lectura completa. Una tercera ejecución en menos de 10 min no habría leído ningún documento (solo
  `config/tareas`); no se ha probado contra Firestore para no pasar de dos pasadas (lo cubre un test).
- Lo que más pesa ahora es el margen de 2 días: cada lectura incremental baja todo lo tocado en los dos últimos días (hoy,
  jueves de una semana de clase, 159 documentos; un solo dato, sin medir otros días).
- Contadas por documentos devueltos (la consola de Firebase las cuenta con retraso).

## `notas_tarea_app.mjs` (fuera del repo, no se comitea)

Ruta: `~/.claude/lanzador/notas_tarea_app.mjs`. Copias en esta carpeta, sin credenciales (la clave viene del llavero; el uid
y la apiKey ya están en el repo): `notas_tarea_app.antes.mjs` (la del 18-11) y `notas_tarea_app.despues.mjs`.
La skill local `~/.claude/skills/atender-correo/` (no está en claude.ai: depende de scripts locales) se ha actualizado:
`referencias/calificar.md` dice que se pasen todas las tareas en una ejecución, lo de la caché y los códigos 3/4; `SKILL.md`,
una línea en «Cambios».

## Hallazgos fuera de criterio

- **`profesor.js` (panel), reloj adelantado**: `desdeParaLeer` toma el `actualizado` más reciente de la caché, que pone el
  reloj del aparato del alumno. Un aparato con el reloj adelantado (p. ej. un año) deja el «desde» en el futuro y el panel
  deja de ver lo nuevo de todos hasta «Volver a leer todo». Aquí se ha resuelto con `mín(…, hora de la última lectura)`; el
  panel necesitaría lo mismo (guardar la hora de la última lectura por subcolección). No se ha tocado (solo lectura).
- **La app de los alumnos es probablemente la mayor lectora**: cada subida hace un GET antes de escribir (cada 5 respuestas o
  al terminar un ejercicio), y la página de la semana lee un documento por práctica y tarea al abrir. No se ha medido; si la
  cuota vuelve a apretar, ahí está el siguiente sitio donde mirar (p. ej. no releer si la última lectura del mismo documento
  es de hace segundos).
- **Rutina de las 21:30** (`trig_018p4Y73wGMvZu7Uxjf27Tc1`): sin cambios, sigue leyendo todo (~1 300 + asignaciones) una vez al
  día. Si alguna vez se quiere en local, `--cache`.
- `informe-actividad.mjs` sin `--cache` ni `--tareas` sigue costando una lectura completa: quien lo lance a mano o desde un
  subagente debería añadir `--cache` (lo dice la cabecera y la skill).
- `--json` con `--tareas` de una sola tarea saca el formato de varias (`{ tareas: [...] }`): es a propósito, para que quien pide
  `--tareas` reciba siempre lo mismo.
