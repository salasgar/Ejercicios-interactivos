# ENTREGA · Tarea 207 · Revisión con clics y publicación del reto «Tabla de propiedades» (`tabla-propiedades`, 83)

## Tercera pasada — s-20261117T231500-7815143e (Opus 5.5, esfuerzo Alto), 17-11, 23:15Z-23:35Z. Revisa el commit `1efb384` de la 206.

### Veredicto: PUBLICADA

Commit **`c871c11`**: `disponible: true` en la fila 83 de `catalogo.js` (nada más de ese fichero), la fila y la línea de publicadas en
`docs/practicas-unidad2.md`, la fila de la tabla de la unidad 2 y el recuento («Treinta y dos… diecisiete de la unidad 2») en `README.md`,
y la aserción `disponible` del test de la 206 a `true`. **Fuera de la ficha, necesario:** `tests/practicas-semana.test.js` cuenta los bloques
publicados de la U2 en la portada; con el reto pasan de 6 a 7 y las prácticas de 18 a 19 (las dos cifras, una línea; sin eso `npm test` falla).
Enlace: https://salasgar.github.io/Ejercicios-interactivos/practicas/tabla-propiedades/ (en la portada, U2, bloque «Para toda la unidad · Reto opcional»).

### Lo revisado en esta pasada

- **Tests**: paso 2, 125/125; `npm test` 2465/2465 antes y después de publicar.
- **Cabeceras, medida propia** (guion fuera del repo, Chrome headless, `mobile`, la pieza real con el CSS real; cada una de las 38 etiquetas en la
  cabecera de columna `c0` y en la de fila `f0`; fallo = la palabra más larga, con la misma `font`, más ancha que el ancho útil de la pieza, sin
  margen de tolerancia; también se miran `scrollWidth` de la pieza y del documento): **de 300 a 800 px cada 4 px, más 400, 401, 560, 561 y 562
  (129 anchos), niveles 1-4, es y en: 1032 medidas. De 320 a 800 px, 0 cortes y 0 scroll horizontal**; letra mínima 9,0 px (a 300-320).
  Por debajo de 320 (no se pedía): «Compuesto» en la columna del nivel 2, +3,4 px a 300, +2,4 a 304, +1,4 a 308, +0,4 a 312 y 316; «Composite»
  +0,4 a 300. Control con una carga nueva por ancho (316, 320, 360, 375, 390, 401, 412, 414, 430, 480, 520, 560, 561, 564, 600, 768, 800): lo mismo.
- **Capturas del nivel 2** con «Compuesto»/«Composite» en la cabecera de columna a 412 y 430 px (es y en) y a 320: la palabra cabe entera dentro de
  la pieza; a 320 va justa, pero entera.
- **Recorridos completos** (el guion de la primera pasada sobre el CSS nuevo): 412 px con el dedo en español, 430 px con el dedo en inglés (con
  infografía de «triangular» y «Sí») y 1200 px con el ratón en inglés: los cuatro niveles con una solución distinta de la del generador, devolver
  piezas, un intento fallido por nivel, 6/20/35/54 puntos, «Comprobar» oculto al acertar; **sin problemas y consola limpia** en los tres.
- **Portada** tras publicar (375 es, 1200 en): sale el bloque «Para toda la unidad · Reto opcional» con «Tabla de propiedades (reto)», sin scroll.
- Ningún Chrome headless huérfano al terminar (`pgrep -fl 'headless=new'` vacío); servidor local cerrado.

### La propuesta para la tarea semanal (decide y la pone Juan Luis)

- **Tarea 18**, «U3 · Semana 3 · Potencias, jerarquía y paréntesis» (desde el lun 30-11, plazo jue 3-12), con `reto: [['tabla-propiedades', 1]]`.
  En el editor del panel: «Añadir como reto un ejercicio de otra unidad» → «Tabla de propiedades (reto)», que ya sale porque está publicada.
- **Releída de la nube el 17-11 a las 23:31Z** (cuenta lectora, `informe-actividad.mjs --tarea 18`): 5 ★ (potencias-enteros 1-3, jerarquia-enteros 3,
  ortografia 3) y 6 a elegir, con un máximo de 100 puntos, o sea `nElegir` 5; sin reto todavía. n = 10 y cada punto del reto vale un punto de la nota:
  `round(100 · 54 / (10 · 10))` = **+54** con el reto completo (nota máxima 154); por niveles, +6, +20, +35 y +54.
- Una línea para los alumnos: «**Reto opcional: suma puntos por encima de 100.**»
- Ojo si se pone en otra tarea: en una de menos ejercicios pesa más (con 3 ★ + 1, el reto completo daría +135). Es el hallazgo 1 de la ENTREGA de la 205.

### Lo pendiente fuera del repositorio, a 17-11 23:30Z

1. Lanzador (`~/.claude/lanzador/notas_tarea_app.mjs`): **hecho** (lee los slugs del reto; comprobado en la línea 18).
2. `atender-correo` (`referencias/calificar.md`): **hecho** («Con reto puede pasar de 100», «base 100»).
3. Informe de actividad: **hecho** en la tarea 209 (32cf2ea).
4. **Sin hacer**: el párrafo del reto en `docs/practicas-guia-profesor.md` (en el repositorio, sin tarea que lo tenga; no es de esta ficha).
Reglas de Firestore: nada que publicar (lo dijo la 205).

### Hallazgos que siguen abiertos (de la primera pasada; no bloquean)

«Compuesto» sale en casi todas las tablas (93-99 %) y el 21 en el 44 % de las del nivel 4: si se quiere más variedad, la 206 propuso sacar
«triangular» del azar o añadir etiquetas difíciles con muchos números. Lo decide Juan Luis.

---

## Segunda pasada — s-20261117T222512-242d1d37 (Opus 5.5, esfuerzo Alto), 17-11, 22:25Z-23:00Z. Revisa el commit `30c0a08` de la 206.

### Veredicto: NO SE PUBLICA todavía

`disponible: false` sigue en la fila 83; no se ha tocado `catalogo.js`, `docs/practicas-unidad2.md` ni `README.md`. **Reabierta de la 206**:
`hechos/reabiertas/206--s-20261117T222512-242d1d37.md`. Lo que pedía la reabierta anterior está arreglado (de 320 a 400 px todo cabe), pero
el arreglo vive en `@media (max-width: 400px)` y **entre 401 y unos 520 px «Compuesto» vuelve a salirse de su cabecera en el nivel 2**
(+12 px a 412-414 px, +11,5 a 428-430, +9 a 480; a 540, todo cabe). Es el ancho de muchos móviles (Android de 412 px, iPhone de 414-430) y
«Compuesto» sale en el 93 % de las tablas del nivel 2. Niveles 1, 3 y 4: bien en todos los anchos. Arreglo propuesto en la reabierta (solo
`estilos.css`); la próxima pasada de la 207 mide de 300 a 800 px cada 4 px, mira una captura a 412 y publica. El plazo (vie 27-11) da.

### Lo revisado en esta pasada (bien)

- **Tests**: `practicas-comun`, `practicas-tabla-propiedades` y `practicas-semana`, 125/125; `npm test` 2465/2465 (una pasada anterior
  dio un fallo en `tests/herramientas-informe.test.js`, a medio escribir por la 209 en el mismo árbol; no es de esta práctica).
- **Cabeceras** (las 38 etiquetas con la pieza real, columna y fila, es y en, niveles 1-4): todo cabe a 320, 360, 375, 390, 400 y 768 px;
  a 300, Compuesto +3,4 en el nivel 2 (no se pedía). Mal de 401 a ~520 px en el nivel 2 (arriba). Sin scroll horizontal en ningún ancho.
- **Pantalla a 320 y 375 px** (capturas): casillas de 56 y 65 px de ancho; márgenes laterales de 5 y 8,5 px, justos pero legibles.
- **Reservas**: las cuatro, comprobadas a mano casilla por casilla: sin números repetidos y cada número cumple las dos propiedades.
- **Recorrido con el dedo a 375 px, español**: los cuatro niveles con una solución distinta de la del generador, devolver piezas, intento
  fallido; «Falta 1 pieza por colocar.», «46 : 3 no es exacta (da 15 y sobra 1)»; 6, 20, 35 y 54 puntos; consola limpia.

### Para la pasada que publique

- **El test de la 206 exige `disponible: false`** (`tests/practicas-tabla-propiedades.test.js`, test «catálogo: id 83…», línea `assert.equal(fila.disponible,
  false)`): al publicar hay que cambiar esa aserción a `true` en el mismo commit, o `npm test` falla y GitHub Actions no despliega. Hay
  precedente: la 140 hizo lo mismo con los de ortografía (d7561ed).
- Lo pendiente fuera del repo y la propuesta de tarea, abajo (primera pasada), siguen igual, salvo lo que haya cambiado la coordinadora el 17-11:
  según `proyecto.md` («Alta del 17-11: tarea 209»), los puntos 1 y 2 (lanzador y `atender-correo`) **ya están hechos**; el 3 (informe de actividad) es la
  tarea 209, en curso; el 4 (párrafo del reto en `docs/practicas-guia-profesor.md`) sigue sin hacer.

---

## Primera pasada — s-20261117T064522-40c5ab61

Sesión s-20261117T064522-40c5ab61 (Opus 5.5, esfuerzo Alto), 17-11, 06:45Z-08:30Z. Revisa el commit `d956422` de la 206.

### Veredicto: NO SE PUBLICA todavía

`disponible: false` sigue en la fila 83; no se ha tocado `catalogo.js`, `docs/practicas-unidad2.md` ni `README.md`.
**Reabierta de la 206**: `hechos/reabiertas/206--s-20261117T064522-40c5ab61.md`. El motivo es de pantalla, no de corrección: a 360-375 px,
en la tabla de 2 × 4 del nivel 2, la cabecera `Compuesto` / `Composite` no cabe y se ve cortada (+14 px a 375 px), y `Compuesto` sale en el 93 %
de las tablas de ese nivel. Van con ella dos faltas en castellano («Faltan 1 pieza», «sobran 1») y la tabla de reserva, que repite números
(no ha salido nunca, pero dejaría al alumno sin poder terminar). Con eso arreglado, la próxima pasada de la 207 solo revisa esos puntos y publica;
el plazo (vie 27-11) da de sobra: el reto no se usa hasta el lun 30-11.

### Lo que sí está bien (no hace falta repetirlo)

**Tests**: `node --test` de `practicas-comun`, `practicas-tabla-propiedades` y `practicas-semana`, 124/124; `npm test` 2461/2461.

**Barrido propio** (guion fuera del repositorio; definiciones propias: primos < 100, cuadrados, triangulares, divisores contados en un bucle;
emparejamiento propio). 20 000 tablas por nivel, 80 000 en total:
- Las 38 etiquetas, contra mis definiciones en 1-100: 0 diferencias.
- Sin solución: 0. Casillas imposibles: 0 (mínimo de candidatos por casilla del diseño: 4). Etiquetas equivalentes: 0. Etiqueta que cumplen todos
  los números: 0. Números repetidos o fuera de 1-100: 0. Tamaños, puntos y dificultades por nivel: 0 errores. Triangular fuera del nivel 4: 0
  (en el nivel 4, en el 37 % de las tablas). Repetir la tabla anterior: 0. Tabla de reserva usada: 0.
- **El corrector**: para cada tabla, una solución propia por cada reparto de etiquetas en filas y columnas que la admite (otro orden y otros
  números): **323 462 soluciones distintas de la del generador, todas aceptadas, ninguna rechazada**. Y 240 000 colocaciones al azar comparadas
  casilla a casilla con mis definiciones: **0 falsos fallos y 0 falsos aciertos**. Ninguna colocación válida se marca como fallo.
- Dificultad: de los repartos de etiquetas posibles, admiten solución el 18 % en el nivel 2, el 25 % en el 3 y el 24 % en el 4 (hay que pensar
  dónde va cada etiqueta, pero siempre hay varias salidas).
- Variedad: combinación de etiquetas más repetida, 0,8 % (nivel 1), 0,4 % (2), 0,6 % (3) y 0,9 % (4). Número más repetido: 80 en el 11,9 % (1),
  81 en el 14,3 % (2), 81 en el 21,7 % (3) y 21 en el 43,9 % (4).

**A mano**: 20 tablas por nivel en los dos idiomas (etiquetas claras, ninguna equivalente; casillas del nivel 4 comprobadas con los divisores
listados) y 30 frases de feedback con las cuentas una a una (divisores, factorizaciones, cocientes y restos, cuadrados vecinos, el 1 «ni primo ni
compuesto», «igual que»): todas verdaderas. Faltas: «sobran 1» (dos veces de 30).

**En el navegador** (Chrome headless por CDP, servidor local, Firestore bloqueado, `?probar=1`; nunca un código de alumno ni AJJN). Seis
pasadas: 375 px con el dedo (toques CDP, `pointerType` touch) en español y en inglés, 375 px con el ratón en inglés, 1200 px con el ratón en
español y con el dedo en inglés, y 1200 px con «triangular» forzado. En cada una, los cuatro niveles completos con una solución propia
distinta de la del generador (otro reparto de etiquetas en los niveles 2-4 y otros números en el 1), alternando arrastrar y tocar-tocar; un
intento fallido por nivel (las casillas en rojo son exactamente las que fallan, el número de frases es el de propiedades incumplidas, ninguna
frase habla de un número que encaja, ninguna pieza vuelve sola a la bandeja); el arreglo arrastrando un número sobre otro (se intercambian);
una pieza devuelta a la bandeja arrastrándola y otra tocándola y tocando la bandeja, con «Comprobar» desactivado y «Faltan…» mientras falta
algo; el marcador por 6, 20, 35 y 54 (+6, +14, +15, +19) y «Comprobar» que desaparece al acertar. Infografía de «triangular» con «Sí»
(recordado: tras recargar, la tabla sale sin infografía) y con «No» (explicación larga y «Entendido: al puzle», sin recordar).
**Consola limpia** en todas (salvo `ERR_CONNECTION_RESET` del servidor de Python en frío, que no es de la práctica). Sin scroll horizontal en
ningún ancho. **Lo único que falla: las cabeceras a 375 px** (arriba y en la reabierta).

**Tarea de prueba con `reto`** (como la 18: 5 ★ + 5 de 6, `reto: [['tabla-propiedades', 1]]`, con `disponible: true` solo en el árbol de
trabajo durante la prueba; `espacio.js` servido cambiado, como en la 205): la página de la semana enseña la sección «Reto (opcional)» con «hasta
54 puntos más»; el reto se abre desde su fila, el nivel 1 se juega dentro de la tarea y se guarda; después el marcador dice «100 de 100
puntos + 6 del reto = 106» y, con el reto completo, **«100 de 100 puntos + 54 del reto = 154»** y «+54 puntos para tu nota», a 375 y a 1200 px,
sin cortarse en 100 ni desbordar. **Panel**: pide entrar con Google, así que se probó en Node con `juntarTareas` y la `celdaTarea` de
`profesor.js`: «✓ cumplida · 154 pt (100 + 54 del reto)», «120 pt (100 + 20 del reto)» y, sin la base, «35 pt (0 + 35 del reto)».

### La propuesta para la tarea semanal (decide y la pone Juan Luis)

- **Tarea 18**, «U3 · Semana 3 · Potencias, jerarquía y paréntesis» (desde el lun 30-11, plazo jue 3-12), con
  `reto: [['tabla-propiedades', 1]]`. En el editor del panel: «Añadir como reto un ejercicio de otra unidad» → «Tabla de propiedades (reto)»
  (saldrá en cuanto se publique).
- **Puntos extra del reto completo en esa tarea**: la 18 tiene 5 ★ y `nElegir` 5 (leída de la nube el 17-11 con la cuenta lectora), así que
  n = 10 y cada punto del reto vale un punto de la nota: `round(100 · 54 / (10 · 10))` = **+54** (nota máxima 154). Por niveles: +6, +20, +35 y +54.
- Una línea para los alumnos: «**Reto opcional: suma puntos por encima de 100.**»
- Ojo con la fórmula si se pone en otra tarea: en una de menos ejercicios pesa más (con 3 ★ + 1, el reto completo daría +135). Es el hallazgo 1
  de la ENTREGA de la 205, sin decidir.

### Lo pendiente fuera del repositorio (de la 205; sigue sin hacer a 17-11)

Sin esto, la nota de más de 100 no llega a Classroom:
1. `~/.claude/lanzador/notas_tarea_app.mjs`, línea 17: los `slugs` salen de `ejerciciosDe(tarea)`, que no incluye el reto, y **el extra sale 0
   sin avisar**. Cambio propuesto en la ENTREGA de la 205.
2. `~/.claude/skills/atender-correo/referencias/calificar.md`, «Tareas de la app»: dice «sobre 100»; con reto puede pasar de 100 y se sube tal
   cual; «solo a quien ya tiene 100» pasa a «100 o más».
3. `herramientas/informe-actividad.mjs` (en el repositorio, sin dueña en el reparto): no ve los ejercicios del reto (no califica mal, pero el
   informe diario no cuenta esa actividad).
4. `docs/practicas-guia-profesor.md`: sigue sin el párrafo del reto que propuso la 205.
Reglas de Firestore: no hace falta publicar nada (lo dijo la 205).

### Hallazgos fuera de criterio (deciden Juan Luis o la coordinadora; no bloquean)

1. **«Compuesto» sale en casi todas las tablas**: en el 93 % del nivel 2 y en el 99 % de los niveles 3 y 4 («Múltiplo de 3», en el 78-84 %; «Tiene
   4 divisores», en el 80 % del nivel 4). Es efecto de los pesos del generador (las etiquetas con muchos números pesan más). No es un error, pero
   el alumno verá casi siempre las mismas dos o tres etiquetas medias.
2. **Números repetidos en el nivel 4**: el 21 sale en el 44 % de las tablas (por encima del 15 % de la ficha 206; la 206 lo explicó y fijó el test
   en 60 %). Como el reto se juega una vez por alumno y la combinación de etiquetas casi nunca se repite (≤ 0,9 %), no deja copiar una tabla; si se
   quiere más variedad, la 206 propuso sacar «triangular» del azar o añadir etiquetas difíciles con muchos números.
