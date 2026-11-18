# ENTREGA tarea 159 · Revisión y publicación de la semana 4 de la unidad 6

Sesión s-20261118T131928-cf1250cf (18-11, de 13:33Z a 13:52Z, encadenada tras la segunda pasada de la 158). **PARCIAL**: se publica
`leelo6`. `problemas-ecuaciones` (153) y `errores6` (154) se escribieron antes que el papel, tienen las listas de reserva vacías y sacan casos
de las hojas, de los exámenes y de los finales en todos sus ejercicios. Las dos quedan **reabiertas**, con sus listas de reserva ya calculadas.

Commit: **3287b96**.
- `practicas/_comun/catalogo.js`: `disponible: true` en la id 79 (`leelo6`).
- `docs/practicas-unidad6.md`: las cotas de `problemas-ecuaciones` y `errores6` en §6, el párrafo «Semana 4» y la línea «**Publicadas**».

`npm test` 2482/2482. Tests propios (las tres prácticas y sus ayudas): 55/55.

`leelo6` no estaba en «Ficheros que toca» de esta ficha, que solo nombra las otras dos. La publica la 159 porque así lo decidieron la ENTREGA
de la 156 (propuesta 1 y cuarta pasada), la terminada de la 155 y `docs/practicas-unidad6.md`: es de toda la unidad, tiene vocabulario de los
problemas de la sesión 13 y no filtra por sesión. La 156 pedía a la coordinadora que lo añadiera a esta ficha y no se había añadido.

Precondiciones comprobadas:
- la 153 y la 154 están LISTAS, la 155 también (7c36e41), y la 158 cerró LISTA (08197e9 y f83b5ae);
- en el reparto de la U6, la hoja 4 (tarea 09), el tipo test 4 (21) y el examen final (24) están cerrados, sin reabiertas;
- nada a medias en `catalogo.js` ni en `docs/practicas-unidad6.md`.

El regenerador del tablón aún daba la 159 por bloqueada con una nota del 11-11 («el papel de la semana 4 aún no existe»). Hay una copia con mi
sid y las 156-159 cumplidas: `hechos/notas/s-20261118T131928-cf1250cf-regenerar-tablon.py`.

## Qué se ha revisado y cómo

Los scripts están en /tmp/pu2-158/ (`p159-*.mjs`, junto a los de la 158). Llevan casos de examen en claro, así que no salen de /tmp, y /tmp se
borra al reiniciar el Mac.

- **El papel de toda la U6** (`p159-papel.mjs`). Se leen:
  - las ecuaciones de los enunciados de las hojas 1-4, sin los recuadros;
  - la primera línea de cada resolución de sus soluciones (`\res`, `\resp`, `\respw`), que en un problema es la ecuación planteada;
  - las líneas `\item` de los exámenes 1-4 y sus extra;
  - la primera ecuación del modelo de respuesta de cada pregunta (`\modelo` del resuelto-explicado, con su destreza de `\barra`);
  - los cinco finales: la versión del alumno y la fase 3 de las soluciones, que es la ecuación.

  En un problema de enunciado la ecuación no aparece en el enunciado, por eso para `problemas-ecuaciones` cuenta la ecuación planteada en
  las soluciones. Es la que mira `reservado`.
- **Cotejo de casos** (`p159-barrido.mjs`): 20000 ítems por ejercicio, con semilla fija (159001-159008). «Mismo caso» es la misma ecuación
  con cada miembro reducido, coeficientes exactos (BigInt) y los miembros en cualquier orden. Se cuenta también la ecuación escrita igual,
  término a término.
- **Listas de reserva** (`p159-reservas.mjs`): las de la hoja van en claro, con las dos claves; las de los exámenes, solo como
  `huellaCanonica`. Se comprobó sobre 80000 ítems (20000 problemas y 60000 de `errores6`) que la clave y la huella de las listas coinciden
  con las que calcula la práctica: 80000 de 80000.
- **Regla de oro** (`p159-oro.mjs`), con aritmética propia, en 20000 ítems por ejercicio:
  - `problemas-ecuaciones`:
    - ej. 2: una sola ecuación con la solución del problema, y ninguna repetida por su solución;
    - ej. 4: una sola cantidad buena, y ninguna repetida;
    - ej. 5: «sí tiene sentido» solo con la ecuación buena, y «la ecuación no recoge el enunciado» solo con una que no equivale.
  - `errores6`:
    - ej. 1: solo la línea marcada rompe la equivalencia con la de arriba;
    - ej. 2: cuatro nombres distintos y uno solo verdadero;
    - ej. 3: la respuesta es la solución del enunciado, y la última línea del compañero no lo es.
  - `leelo6`:
    - la regla de la 156 (`/tmp/pu2-156c/leelo6/regla.mjs`), con lo mismo que entonces y nada nuevo;
    - ej. 3: ninguna opción repite a otra, ni siquiera como el principio de otra;
    - ej. 4: no sale «one years» ni «1 años».

  **0 fallos**.
- **Textos** (3000 ítems por ejercicio, todas las cadenas del ítem). Se ha buscado:
  - el guion del teclado como signo;
  - «: −» y «· −» sin paréntesis;
  - dobles espacios y «×»;
  - mayúscula tras los dos puntos;
  - «one years»;
  - personas mezcladas;
  - porcentajes.
- **Realismo**: una muestra de 16 problemas de las ocho plantillas, y las cotas del test de la 153. Todo creíble.
- **Con clics** (CDP, ratón de verdad, Chrome sin ventana, sobre una copia de HEAD con `base.js` parcheado solo en la copia; planes nuevos en
  `clics.mjs` para las tres): todos los ejercicios de las tres, en español y en inglés, a 375 y a 1100 px, con un ítem acertado y uno fallado.
  - **48 de 48 recorridos bien**: sin errores de JavaScript, sin diálogos y sin desbordes horizontales.
  - Un recorrido (`errores6` ej. 1, en, 375 px) se repitió porque el servidor de Python cortó la carga de `textos.js`; en la repetición, bien.
  - Se leyeron los feedbacks de fallo a 375 px y se miraron las capturas.

## Resultado

Casos del papel por ejercicio: casos distintos · ítems de 20000; entre paréntesis, la misma ecuación escrita igual. El detalle por fuente
está en las reabiertas.

| Práctica | Casos del papel | Regla de oro | Variedad (máx.) | Clics | Veredicto |
|---|---|---|---|---|---|
| `problemas-ecuaciones` (153) | en los 5 ejercicios: hojas 2 y 4, exámenes 2, 3 y 4 con sus extra, finales; sumando las fuentes, de 51 a 57 casos y de 571 a 690 ítems por ejercicio (de 26 a 31 casos escritos igual) | 0 fallos | 0,26 % | 20/20 | **reabierta** |
| `errores6` (154) | en los 3 ejercicios: las cuatro hojas, exámenes 2, 3 y 4 con sus extra, finales; sumando las fuentes, de 56 a 67 casos y de 138 a 158 ítems por ejercicio (de 33 a 41 escritos igual) | 0 fallos | 0,27 % | 12/12 | **reabierta** |
| `leelo6` (155, 7c36e41) | 0 en los ej. 2-4 (cotejo de la 156, cuarta pasada; 7c36e41 no cambia las reservas) | 0 fallos | 1,5 % (156) | 16/16 | **publicada** |

## Reabiertas

Están en `hechos/reabiertas/`, con las listas de reserva ya calculadas en `hechos/notas/s-20261118T131928-cf1250cf-<slug>-reserva.txt`. La hoja
va en claro, con sus dos claves; los exámenes, solo como `huellaCanonica`. Arreglarlas es sobre todo pegar las listas y añadir un test: MEDIO, cortas.

- **`153--s-20261118T131928-cf1250cf-revision.md`** (`problemas-ecuaciones`): 198 claves de las hojas y 168 huellas. Además:
  - `marcapáginas` va en femenino en `reparto-tres` («las marcapáginas», «¿Cuántas ha hecho…?»);
  - «Ese número es {cantidad}, pero se pregunta {cantidad}» no concuerda con ninguna cantidad, por ejemplo «Ese número es las de los tres
    juntos»;
  - en `pienso` sale a veces el guion del teclado («2x = -4»): 60 de 20000 ítems del ej. 2 y 5 del ej. 5.
- **`154--s-20261118T131928-cf1250cf-revision.md`** (`errores6`): 298 claves de las hojas y 662 huellas. No tiene nada más que bloquee. Conviene
  cambiar el «so it passes dividing» del inglés.

Cuando cierren las dos, **una segunda pasada de la 159** repite el barrido con las mismas semillas y los clics, y publica. Los scripts de
/tmp/pu2-158/ sirven tal cual si el Mac no se ha reiniciado:
- `node p159-papel.mjs`;
- `node p159-barrido.mjs`;
- `node p159-oro.mjs`;
- `node scan159.mjs`;
- rehacer `arbol/` con `git archive HEAD | tar -x`, volver a meter `window.__item = actual.item;` delante del `montar` de `base.js`, servirlo
  con `python3 -m http.server 8458` y `node clics.mjs problemas-ecuaciones errores6`.

Si /tmp se ha borrado, el modelo es esta ENTREGA y la de la 158.

## Propuesta de la tarea semanal 4 (para Juan Luis; no está creada: la monta la 160 en el panel y la programa en Classroom la tarea 34 del reparto de la U6)

`U6 · Semana 4 · Problemas con ecuaciones` / `U6 · Week 4 · Word problems with equations` · `unidad: 6` · `desde: '2027-02-22'` ·
`hasta: '2027-02-25'`. Sale el **lun 22-2 a las 8:00** y se entrega el **jue 25-2 a las 23:59**, la víspera del examen final (vie 26-2).

Sesiones: la 13, el lun 22-2 (las fases; números y consecutivos, repartos, perímetros), y la 14, el mar 23-2 (edades, monedas, «cuántos tiene
que darle», el dinero; interpretar la solución). La 15, el jue 25-2, es de repaso y no trae nada nuevo, así que todo lo de la semana puede ser
★: no hace falta la regla de «lo del mismo día del plazo va a elegir».

Los ★ de repaso son los dos de `denominadores` que la tarea 3 dejó «a elegir» (U6-3C-11 y 3C-12, nucleares), como dijo la 158, y uno de
`errores6`, que repasa toda la unidad para el final.

El ★ de ortografía es `['ortografia-letras', 1]`, «hay, ahí, ay; a ver, haber». Es el de la ficha y el de `docs/practicas-ortografia.md`, y está
publicado (id 65). Cada ejercicio vale 10 puntos.

### Plan A (con las tres publicadas): 8 ★ + 2 a elegir = 100 puntos

| | Ejercicio | Destreza (sesión) |
|---|---|---|
| ★ | `['ortografia-letras', 1]` hay, ahí, ay; a ver, haber | — (ortografía) |
| ★ | `['problemas-ecuaciones', 1]` ¿Qué es x? | U6-4A-01 nuclear (13) |
| ★ | `['problemas-ecuaciones', 2]` ¿Qué ecuación? | U6-4C-01 nuclear (13); 2A-01, 3A-01 |
| ★ | `['problemas-ecuaciones', 3]` Resuelve y contesta | U6-4A-01, 4A-02, 4A-03, 4A-05 nucleares, 4A-04, 4A-09 (13-14) |
| ★ | `['problemas-ecuaciones', 4]` ¿Qué pide? | U6-4A-01 nuclear, 4A-08 (13-14) |
| ★ | `['denominadores', 3]` Resuélvela (repaso) | U6-3C-11, 3C-12 nucleares (11) |
| ★ | `['denominadores', 4]` Paso a paso (repaso) | U6-3C-11, 3C-12 nucleares (11) |
| ★ | `['errores6', 1]` ¿Dónde está el error? (repaso) | U6-3C-05 y los errores típicos de toda la unidad |
| elegir | `['problemas-ecuaciones', 5]` ¿Tiene sentido? | U6-4A-08 (14) |
| elegir | `['errores6', 2]` ¿Qué error es? | toda la unidad |
| elegir | `['errores6', 3]` Corrígelo | toda la unidad |
| elegir | `['leelo6', 1]` La palabra | vocabulario de la unidad (U6-nB) |
| elegir | `['leelo6', 3]` La consigna | consignas de examen en inglés |
| elegir | `['leelo6', 4]` Completa | U6-4B-01 (*n years ago*, *in n years' time*) y vocabulario |

U6-4A-06 (monedas) y 4A-07 («cuántos tiene que darle») no tienen práctica (lo dijo la 153); en papel están en la hoja 4 y en el tipo test 4.

### Plan B (si falta una el jue 18-2)

- **Sin `problemas-ecuaciones`**: la semana se queda sin práctica de lo suyo (sesiones 13 y 14), y se avisa.
  - ★: la ortografía, `['denominadores', 3]` y `4`, `['errores6', 1]`, `2` y `3`, `['parentesis-algebra', 3]` (repaso, U6-3C-09) y
    `['leelo6', 4]` (U6-4B-01). Son 8.
  - A elegir: `['leelo6', 1]` y `3`, y `['resuelve', 4]`.
- **Sin `errores6`**: el plan A, con `['parentesis-algebra', 3]` en el lugar del ★ de `errores6`. A elegir quedan `['problemas-ecuaciones', 5]`
  y `leelo6`.
- **Sin `leelo6`**: el plan A tal cual, porque solo estaba en «a elegir».

### Plan C (sin `problemas-ecuaciones` ni `errores6`)

- ★: la ortografía, `['denominadores', 3]` y `4`, `['parentesis-algebra', 3]`, `['resuelve', 3]` y `['leelo6', 4]`.
- A elegir: `['leelo6', 1]` y `3`, `['resuelve', 4]` y `['transposicion', 4]`.

Son 6 ★, así que hay que bajar a 60 puntos o añadir dos ★ de repaso: por ejemplo `['transposicion', 3]` y `['resuelve', 2]`. Se avisa:
la semana 4 se queda sin práctica de problemas.

Si el lun 22-2 están publicadas las tres, plan A; si falta alguna, el plan que toque.

## Hallazgos fuera de criterio (para Juan Luis)

- **`leelo6`**: siguen enfrentándose *letter* y *unknown* (129 de 20000 ítems del ej. 1) y *letter* y *variable* (126). El glosario de la hoja 1
  da *letter* y *variable* como lo mismo. Ya lo señaló la 156, que lo dejó como «vigilar» y no como error. Si quieres que no se enfrenten
  nunca, es una reabierta corta.
- **`problemas-ecuaciones`**: no hay práctica de U6-4A-06 (monedas) ni de 4A-07 («cuántos tiene que darle»), ni de 3A-02 y 3A-03, como dijo
  la 153. Las dos primeras salen en la hoja 4 y en el tipo test 4. Si las quieres en la app, es una tarea nueva.
- **`errores6`** reserva 662 huellas, porque es de toda la unidad y entran todas las ecuaciones de los cuatro exámenes. Es más que ninguna otra
  práctica, pero son ecuaciones de un `Set`, sin coste.

## Cómo comprobarlo en 1 minuto

`npm run servir` y http://localhost:8080/practicas/leelo6/?probar=1 (y `problemas-ecuaciones/`, `errores6/`), con «Probar sin código». La
portada no enseña la U6 hasta el 1-2-2027 (`UNIDADES.desde`).

## Segunda pasada (s-20261118T140330-da0f6f36, 18-11, de 14:03Z a 16:17:Z): PARCIAL, no se publica nada

Tras las reabiertas 153 (07442a5) y 154 (1aede25). Sin commit de código: `catalogo.js` y `docs/practicas-unidad6.md` no cambian.

| Práctica | Casos del papel (20000 ítems por ejercicio, semillas 159001-159008) | Regla de oro | Variedad (máx.) | Clics | Veredicto |
|---|---|---|---|---|---|
| `problemas-ecuaciones` (07442a5) | en los 5 ejercicios: de 19 a 23 casos y de 260 a 282 ítems por ejercicio (hojas 2 y 4, exámenes 2-4 con extra, finales) | 0 fallos | 0,27 % | 20/20 | **reabierta** (tercera vez) |
| `errores6` (1aede25) | 0 en los 3 ejercicios | 0 fallos | 0,27 % | 12/12 | **reabierta** (notación) |

- **`problemas-ecuaciones`**: la lista que dio la primera pasada (198 claves y 168 huellas) solo recogía las preguntas de problemas. Su propio
  barrido contaba además las ecuaciones de los enunciados (hoja 4, línea 139) y las de otras destrezas que, reducidas, son iguales. Con la lista
  de `errores6` (298 claves y 662 huellas), simulada en /tmp sin tocar el código: **0 casos** en los cinco ejercicios, variedad máx. 0,28 % y
  ninguna excepción. Además, en el feedback del ej. 2 con dinero sale el guion del teclado («x = -4,00», 268 de 20000 ítems), y `decimalDe`
  rompe los negativos con céntimos.
- **`errores6`**: en las pistas de `distribuir-solo-primero` y `signo-solo-primero` el factor negativo va sin paréntesis («6 · −4»,
  «−3 · −8»), en un 8 % de los ítems.
- Comprobado y bien: lo demás de la reabierta anterior de la 153 (marcapáginas, «Has contestado con…», el guion en lo que no es feedback).
  Tests 82/82 (las dos y la común).
- Clics con ratón de verdad (CDP) sobre una copia de HEAD 67b115a en /tmp/pu2-159b, servida en 8459: 32 de 32 recorridos bien (es/en,
  375/1100 px, acierto y fallo), sin errores ni desbordes.

Reabiertas: `hechos/reabiertas/153--s-20261118T140330-da0f6f36-revision.md` y `hechos/reabiertas/154--s-20261118T140330-da0f6f36-revision.md`, las dos MEDIO, de unos 10 min.
**Tercera pasada**: cuando cierren las dos, repetir `node p159-barrido.mjs`, `node p159-oro.mjs` y el barrido de feedbacks (las funciones,
no solo el ítem), y los clics con `/tmp/pu2-158/clics159b.mjs` (rehacer `/tmp/pu2-159b/arbol` desde HEAD con el parche de `window.__item`).
Después, publicar las dos.

La propuesta de la tarea semanal 4 de arriba sigue valiendo: plan A con las tres, o el plan B que toque.

## Tercera y cuarta pasada (s-20261118T214819-b3d2ac7b, 18-11, de 21:48Z a 22:14Z): LISTA, la semana 4 entera

Commits: **9bd566e** (publicada `errores6`, id 78, sobre b837244) y **ee3c0ac** (publicada `problemas-ecuaciones`, id 77, sobre 6f5ac4b).
`catalogo.js` (`disponible: true` de las dos) y `docs/practicas-unidad6.md` (la línea «**Publicadas**» y el párrafo de la semana 4). En 9bd566e
va también una línea de `tests/practicas-errores6.test.js`, fuera de «Ficheros que toca»: la aserción `disponible, false` («la publica la tarea
de la semana») pasa a `true`, como hizo la 207 con la suya en c871c11. Sin ese cambio `npm test` sale en rojo al publicar. `npm test` 2489/2489.

| Práctica | Casos del papel (20000 ítems por ejercicio, semillas 159001-159008) | Regla de oro | Feedbacks | Variedad (máx.) | Clics | Veredicto |
|---|---|---|---|---|---|---|
| `errores6` (b837244) | 0 en los 3 ejercicios, reducidos y término a término | 0 fallos | limpios | 0,27 % | 12/12 | **publicada** (9bd566e) |
| `problemas-ecuaciones` (e62b43a) | 0 en los 5 ejercicios | 0 fallos | ej. 2 con dinero mal | 0,28 % | 19/20 (*) | **reabierta** (cuarta) |
| `problemas-ecuaciones` (6f5ac4b) | 0 en los 5 ejercicios | 0 fallos | limpios | 0,28 % | 20/20 | **publicada** (ee3c0ac) |

(*) Un recorrido se quedó sin ítem porque el servidor de Python cortó la carga de un módulo (`ERR_CONNECTION_RESET`), igual que en la primera pasada.
En la repetición, sobre 6f5ac4b, bien.

- **Feedbacks** (nuevo en esta pasada, como pedía la trampa de la segunda): un barrido que llama a todas las funciones que escriben explicaciones,
  con todas las opciones falsas y respuestas mal tecleadas (3000 ítems por ejercicio y por idioma). Busca el guion del teclado, el factor negativo
  sin paréntesis, «×», dobles espacios, porcentajes, `undefined`/`NaN`, «one years», decimales rotos y el separador colgando. Funciones de
  `problemas-ecuaciones`: `solucionIncognita`, `porQueDato`, `solucionEcuacion`, `porQueEcuacion`, `feedbackResuelve` (con y sin `corregirResuelve`),
  `solucionPide`, `porQuePide`, `solucionSentido` y `absurdo`. De `errores6`: `porque`, `htmlLinea` de las líneas del compañero y de las buenas, y
  `corregirCorrige`. Los guiones que quedan están en `valor`, `parse` y `clave`, que son internos y no se ven. El script está en el scratchpad de
  la sesión (`feedbacks.mjs`).
- **Lo que sacaron los clics y no los barridos**: en el ej. 2 de `problemas-ecuaciones`, el porqué de una ecuación falsa con dinero escribía la
  solución en céntimos y con el separador colgando («Esa ecuación da x = 188,, y…» por 1,88 €; en inglés «x = 970., and»). Afectaba a 6534 de
  14739 opciones falsas con dinero, en 3482 de 20000 ítems (17 %). Ya estaba antes de hoy. Reabierta
  `hechos/reabiertas/153--s-20261118T214819-b3d2ac7b-revision.md`, arreglada en 6f5ac4b (el porqué usa `solTexto`, como el ej. 5).
  Comprobado después: 0 de 14739.

**La propuesta de la tarea semanal 4 de arriba vale tal cual: plan A**, con las tres publicadas (`leelo6`, `errores6`, `problemas-ecuaciones`):
8 ★ + 2 a elegir = 100 puntos, ★ de ortografía `['ortografia-letras', 1]`, del lun 22-2 al jue 25-2. La monta la 160 en el panel.
