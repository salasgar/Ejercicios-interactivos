# ENTREGA · Tarea 205 · Retos con puntos extra en las tareas de la semana

Sesiones: s-20261116T132219-1e827c44 (hizo el trabajo, 13:22-14:38Z, sin llegar a comitear; su reclamo caducó a las 18:22Z)
y s-20261116T184529-d4a7ae2f (relevo: verificó lo heredado, corrigió el editor, volvió a probar en el navegador, comiteó y cerró).
Commit del código: `df972d0`. `npm test`: 2422/2422.

## Ficheros de código

`practicas/_comun/tareas.js`, `practicas/_comun/contador.js`, `practicas/_comun/base.js`, `practicas/_comun/textos.js`,
`practicas/plantilla/practica.js` (contrato), `practicas/semana.js`, `practicas/portada.js`, `practicas/profesor.js`,
`practicas/profesor-tareas.js`, `practicas/resultados.js`, `tests/practicas-semana.test.js`, `tests/practicas-contador-reto.test.js`.
No hizo falta tocar `vista-tareas.js`, `profesor-hoy.js`, `codigos.js` ni `firestore.rules`.

## La API, para la 206

**En la tarea** (`_comun/tareas.js`): campo opcional `reto: [[slug, n], …]`, como `estrella` y `elegir`, tope `MAX_RETO = 3`.
`erroresTareas` comprueba que sea lista, el tope, el catálogo y que ningún `[slug, n]` del reto esté también en `estrella` o en `elegir`.
`estadoTarea` devuelve además `reto` (filas, cada una con `puntosReto`), `base` (la nota de siempre, sobre 100 y con tope),
`extra`, `puntosReto` y `puntos = base + extra`. El reto no cuenta para `cumplida`, `diaEntrega`, `fallos` ni `dia`, pero sí para `empezada`.

**En el ejercicio** (declaración de la práctica): `sinVidas: true`. Un intento fallido se cuenta en `fallos` y corta la racha,
pero no quita puntos ni vidas ni reinicia. No salen corazones; el menú y la fila dicen «sin vidas: un intento fallido no quita nada»;
el feedback de un fallo dice «No pierdes nada: inténtalo otra vez». `penalizacion` y `vidas` no se usan.

**En `montar`** (la `api` que recibe la práctica):
- `api.sumar(k, { html, espera })`: en lugar de `responder` en un acierto que vale varios puntos (una tabla completa, 1 por pieza).
  `k` es un entero ≥ 1. Cierra el ítem como acierto: feedback verde con `html` y «+k puntos», y por defecto espera a «Siguiente».
  En el contador cuenta como UN acierto y no mueve la racha. Al llegar al `objetivo`, el ejercicio queda terminado (con los puntos topados en el objetivo).
- `api.intentoFallido({ html, error, respuesta })`: un intento que no está bien y que **no cierra el ítem**. La práctica enseña
  su propio feedback (qué números no encajan y por qué) y el alumno sigue con la misma tabla. Se cuenta con las reglas del ejercicio
  (con `sinVidas` no quita nada) y queda en el registro de fallos del profesor con `html`, `error` y `respuesta`. Devuelve
  `{ ganados, perdidos, extra, reinicio, vidas }`, o `null` si el ítem ya estaba respondido.

Para la 206: `sinVidas: true`, `sinAyuda: '…'`, `objetivo: 54`, `nEjercicios: 1`; al comprobar, `api.intentoFallido` si hay errores
y `api.sumar(piezas)` si está entera bien.

## La fórmula

`extra = round(PUNTOS_TAREA · puntosReto / (PUNTOS_POR_EJERCICIO · n)) = round(100 · puntosReto / (10 · n))`, donde `n = ★ + nElegir`
y `puntosReto` son los puntos del contador en los ejercicios del reto (los del objetivo si está terminado). No tiene tope.
Con 6 ★ + 4, 1 punto del reto = 1 punto de la nota; con 5 ★ + 0, 1 = 2. **Suma siempre**, aunque la base no esté completa
(`RETO_SUMA_SIEMPRE = true` en `tareas.js`: si Juan Luis decide que solo cuente en una tarea cumplida, basta con ponerlo a `false`).
La penalización por retraso, que la aplica quien califica y no la app, recae sobre la nota total.

## Código de resultado

El reto **no viaja** en el código de 20 caracteres de la tarea: el formato no cambia y los códigos ya repartidos se leen igual.
En la página de la semana, en el desplegable del código de una tarea con reto, sale «Este código no lleva los puntos del reto:
tu profesor los ve en la nube». En el panel, el extra sale solo de la nube.

## Lo que ve cada uno

- **Alumno** (`semana.html`): debajo de los ★ y de los de elegir hay una sección «Reto (opcional)» / «Challenge (optional)»,
  con «No hace falta para cumplir la tarea… hasta N puntos más». Cada fila del reto lleva «+E puntos para tu nota». El marcador
  dice «75 de 100 puntos + 15 del reto = 90», y la barra solo enseña la base. En la portada, la fila de la tarea lleva «+E puntos para tu nota».
- **Profesor**: en la tabla de tareas, «112 pt (100 + 12 del reto)». El CSV de una tarea con reto lleva dos columnas más,
  «base (de 100)» y «extra del reto» (las de las tareas sin reto no cambian), y en ningún sitio se corta en 100. En el editor
  de tareas, cada ejercicio se puede marcar como «reto (opcional)». Además hay un desplegable «Añadir como reto un ejercicio de
  otra unidad» (este curso, el reto de la U2 va en una tarea de la U3). En una tarea ya empezada, el reto se puede poner y quitar,
  pero los ★ y los de elegir siguen bloqueados.

## Pruebas

- `npm test` 2422/2422. `tests/practicas-semana.test.js` cubre una tarea con reto (base + extra; 6 ★ + 4 y 5 ★ + 0; reto sin
  empezar = 0; suma con la base incompleta; reto repetido con un ★ → error; tope de 3; sin reto, exactamente lo de antes; ámbito de
  la base; panel con más de 100; página de la semana). `tests/practicas-contador-reto.test.js` cubre `sumar`, `sinVidas` (20 fallos
  sin perder nada), la fusión y la migración del progreso, la validación de la base y el editor.
- Chrome headless por CDP (`/tmp/rev205/clics.mjs` y `/tmp/rev205/editor.mjs`, fuera del repositorio), a 375 y 1200 px, con la red
  de Google cortada (nada se escribe en la nube): semana con y sin reto, en español y en inglés; portada; la plantilla convertida en
  reto (`sinVidas`, tres `intentoFallido` sin perder nada y `sumar(6)` con «+6 puntos»); el editor con una tarea empezada y con un
  reto de otra unidad. No desborda nada y la consola queda limpia en la pasada completa. Algunas cargas dieron
  `ERR_CONNECTION_RESET`: es del servidor local de Python en frío y se repitió hasta tener una pasada limpia en los dos anchos.
- **Sin probar en el navegador: la tabla de notas del panel** (`profesor.html` pide entrar con Google). Su lógica (`juntarTareas`
  con notas por encima de 100) está en los tests; el HTML de `celdaTarea` y el CSV, solo leídos.

## Fuera del repositorio: qué hay que cambiar (no se ha editado nada)

1. **`~/.claude/lanzador/notas_tarea_app.mjs`, línea 17** (`const slugs = [...new Set(ejerciciosDe(tarea).map(e => e.slug))];`).
   `ejerciciosDe` (de `herramientas/informe-actividad.mjs`) no incluye el reto, así que no se leen los documentos de la práctica
   del reto y **el extra sale 0 sin avisar**. Cambio: `const slugs = [...new Set([...tarea.estrella, ...tarea.elegir, ...(tarea.reto ?? [])].map(([s]) => s))];`.
   En la línea 23, `puntos: e.puntos` ya es base + extra; conviene añadir `base: e.base, extra: e.extra`.
2. **`~/.claude/skills/atender-correo/referencias/calificar.md`, «Tareas de la app»**. Donde dice «la nota es la que ve el alumno
   en la app, sobre 100», añadir que con reto puede pasar de 100 y que se sube tal cual (Classroom lo admite). En la regla 4,
   «antes del plazo, solo a quien ya tiene 100» pasa a «100 o más». La penalización por retraso se aplica a la nota total.
3. **`herramientas/informe-actividad.mjs`** (en el repositorio, pero no está entre los ficheros de esta ficha; lo usa la rutina
   del informe diario `trig_018p4Y73wGMvZu7Uxjf27Tc1`): no ve los ejercicios del reto. Su «puntos» no es la nota, así que no
   califica mal, pero el informe no cuenta la actividad en los retos. Propuesta para una tarea aparte: `ejerciciosDe` con el reto
   marcado (`reto: true`) y fuera de la suma de ★ y de elegir.
4. Sin cambios: `classroom_pendientes.py` y `nota_puesta.py` (lanzador), y `comun/gestion/` (`calificar_classroom.py` es de los
   exámenes y `actualizar_registro.py` no promedia las tareas de la app). Ninguno corta en 100.

## Reglas de Firestore

**No hace falta publicar nada.** `config/tareas` se guarda como texto JSON (< 200 000 caracteres) y el progreso como texto
(< 4000), sin validar campos dentro. `sumar` topa los puntos en el objetivo, como siempre. Los fallos de `intentoFallido` usan el
mismo esquema que los de `responder`.

## Pendiente dentro del repositorio

- **`docs/practicas-guia-profesor.md`**: falta un párrafo sobre el reto. No se ha tocado porque la sesión se abrió con la orden de no
  tocar `docs/` mientras la 203 está en curso. Propuesta de texto: «**Reto (opcional).** En el editor, un ejercicio marcado como
  “reto” no hace falta para cumplir la tarea; lo que el alumno gane en él se suma encima de los 100, con el peso de un punto de
  un ejercicio normal de la tarea, y la nota puede pasar de 100. Hasta 3 por tarea, también de otra unidad. No va en el código
  de resultado: se ve por la nube».
- `README.md`: no lo toca esta tarea. El cambio sin comitear que hay es de la 203 (`coloca-enteros`).

## Hallazgos fuera de criterio (deciden Juan Luis o la coordinadora)

1. **En una tarea con pocos ejercicios, el reto pesa mucho.** Con la fórmula, cada punto del reto vale `10 / n` puntos de la nota.
   El reto de la 206 (54 puntos) da +54 en una tarea de 6 ★ + 4, pero +135 en una de 3 ★ + 1 y +270 en una de 1 ★ + 1. Es lo que
   dice la regla («como un punto normal de esa tarea») y no se ha cambiado. Si se quiere evitar, las salidas son poner un tope al
   extra o pesar siempre como en 6 + 4 (1 = 1). Ninguna de las dos se ha aplicado.
2. Antes de empezar el reto, el marcador dice «… + 0 del reto». Se ha dejado así porque avisa de que el reto existe; si molesta, se quita con un `if`.
3. La penalización por retraso se aplica también a los puntos del reto ganados después del plazo, porque recae sobre la nota total,
   como decía la ficha. Si Juan Luis prefiere que el premio no pierda nada, lo tiene que decir el agente de correo, no la app.
