# TABLÓN DE ESTADO — Prácticas interactivas de la Unidad 2 (PU2)

**VISTA DERIVADA. No se edita a mano y no es la fuente de verdad.** La verdad está en la
carpeta `hechos/`: un fichero por hecho, cada uno con el identificador de la sesión que
lo escribió en el nombre. Si la tabla de abajo contradice a `hechos/`, gana `hechos/` y
este tablón hay que regenerarlo entero. Reclamar una tarea **no** es escribir aquí: es
escribir un fichero propio en `hechos/reclamos/`; si este fichero está reservado por
otra sesión cuando te toque regenerarlo, no esperes —tu reclamo ya vale— y regenera
cuando puedas. Este párrafo se copia tal cual en cada regeneración.

Ficha del proyecto —rutas, reglas de contenido, frase de arranque—: `proyecto.md`
Autorizaciones firmadas: `autorizaciones.md`
Ninguno de los dos se regenera nunca; este fichero sí, entero.

Regenerado: 2026-10-08 19:31 UTC · por la sesión s-20261008T174225-f75f5cdb (coordinadora; **todas** las
filas recalculadas contra `hechos/` tras `git fetch`; da de alta la tarea 36). 33 LISTAS; EN
CURSO la 30 y la 33 (misma sesión; código comiteado, solo les falta la terminada); PENDIENTE
la 36. La coordinadora, por orden de Juan Luis, publicó en 2128eb6 las siete graves que
esperaban el candado del catálogo (07, 14, 20, 21, 27, 30, 33). La 32 sigue sin publicar.
**Quien coja una reabierta lee antes `hechos/notas/s-20261008T174225-f75f5cdb.md`**: la base
cambió a contador por puntos después de escribirse las reabiertas.
**NUNCA `--autostash` ni `git stash` en este árbol**: ver la incidencia de las 18:03Z, abajo.

## Antes de hacer nada

0. Lee `proyecto.md`: ahí están las rutas, las reglas del repositorio compartido y las
   reglas de contenido comunes a todas las prácticas.
1. Lee este fichero entero.
2. **Lista `hechos/reclamos/`, `hechos/terminadas/`, `hechos/reabiertas/`,
   `hechos/sustituidas/` y `hechos/fallos/`**, y compáralo con `salidas/` y con
   `practicas/`. Resuelve lo que no cuadre antes de coger tarea. Cuando haya varios
   rastros de una misma tarea, gana el más reciente por su fecha interna. Los recuentos y
   los hashes de una salida que vayas a usar se leen de `hechos/terminadas/`, nunca de
   este tablón.
3. Mira la hora de verdad: `date -u`. Toda hora que escribas la genera el comando con
   `$(date -u …)`; nunca la tecleas.
4. Genera tu identificador de sesión **en el mismo comando que escribe tu reclamo** y no
   lo cambies (el comando exacto, probado en este Mac, está en cada ficha de tarea,
   «Antes de empezar», paso 3). Nada de `$RANDOM`; nada de guardarlo en un fichero de
   nombre fijo.
5. Reclama tu tarea: crea el reclamo, ejecuta `sleep 30 && ls hechos/reclamos/` —el
   comando, no la intención— y cede si otra sesión llegó antes (apertura más antigua; a
   igualdad, sid menor). Si la frase de arranque te nombra una tarea o una cadena, esa
   reclamas.
6. Si ganas, **regenera este tablón entero** —relistando `hechos/` ahora, con `git fetch`
   antes— y sigue con la tarea hasta cerrarla o soltarla; **no termines el turno para
   pedir confirmación**. Si no hay tarea libre de tu banda, dilo —qué está vivo y cuándo
   caduca— y para.

El protocolo completo está en la skill `reparto`, fichero `referencias/concurrencia.md`.
Lo esencial: cada sesión escribe únicamente ficheros que llevan su identificador en el
nombre, nadie edita el fichero de nadie, y este tablón se regenera a partir de los demás.

## Reglas de operación

0. **Coge una tarea que encaje con el modelo con el que te han abierto.** La banda la dice
   el usuario en la frase de arranque; si no la dice, pregúntala en una línea antes de
   reclamar.
1. **Una sesión, una tarea, reclamada.** Reclamo en `hechos/reclamos/NN--<sid>.md` con
   `caduca:` = 2 × la duración esperada de la ficha (mínimo 45 min). Campos `sesión:`,
   `tarea:`, `abierto:`, `caduca:` con ese nombre exacto; el cierre es una línea propia que
   empieza por `CERRADA`, `CEDIDA` o `ABANDONADA`, palabras que no van en ningún latido.
2. **Un reclamo está vivo** si su último `caduca:` está en el futuro, no tiene línea de
   cierre y ningún reclamo lo nombra en un `releva a:`. Un reclamo caducado es RELEVABLE:
   se toma abriendo el tuyo con `releva a: <sid anterior>`; el suyo no se toca.
3. **Estira la caducidad antes de una operación larga** y late al terminar cada paso. Tras
   cualquier pausa (turno terminado, «Continúa»): `date -u`, tu reclamo, y tu sid en las
   líneas `releva a:`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.
4. **Cada sesión escribe solo lo suyo.** A un fichero de `hechos/` solo se añade (`>>`).
5. **Cada ficha declara los ficheros que toca; dos tareas que compartan uno no van en
   paralelo.** El código de cada práctica vive en `practicas/<slug>/` y su test en
   `tests/practicas-<slug>.test.js`; nadie más los toca. `salidas/NN-…/` lleva `ENTREGA.md`
   con su marcador `.ok-<sid>`.
6. **Idempotencia obligatoria.** Antes de crear `practicas/<slug>/`, mira si ya existe.
7. **El índice de git es compartido**: `add` nunca separado de `commit`; siempre rutas
   explícitas; nunca `git add .`, `-A` ni `commit -a`. Orden de cierre: `npm test` →
   commit del código → terminada con el hash, `CERRADA`, tablón, trampas en la ficha → un
   commit con rutas explícitas (`hechos/` por sid, `salidas/NN-…/`, `_ESTADO.md`, la ficha)
   → `git push origin main`; si se rechaza, `pull --rebase`, regenerar el tablón otra vez y
   volver a empujar.
8. **Nada se borra sin firma en `autorizaciones.md`** (línea `Firma y fecha:` rellena). Las
   tareas 17 y 18 la necesitan; ninguna otra borra nada. Lo que sobra va a `_papelera/`.
9. **Si una tarea falla o se queda a medias**, `hechos/fallos/NN--<sid>.md` con la línea
   `parada por: sesión agotada | avería | mal cortada` y `ABANDONADA` en tu reclamo.
   Choques → `hechos/incidencias/<sid>.md`. Los subagentes trabajan bajo tu sid y no
   reclaman.
10. **Un cierre en falso se anula con `hechos/reabiertas/NN--<sid>.md`**, nunca borrando.
11. **Una tarea mal cortada no se renumera ni se borra**: incidencia, fallo con `parada
    por: mal cortada`, `ABANDONADA`, y avisar. El recorte lo decide el usuario en una
    sesión sin reclamo que firma `hechos/sustituidas/`; las nuevas van al final.
12. **No modificar nunca** la carpeta de apuntes de iCloud (`inventario-unidad2.tsv`,
    hojas, apuntes): es fuente de solo lectura. Ni `divisores/` salvo la tarea 17, ni
    `practicas/_comun/` salvo la 01, ni `css/estilos.css` nunca.
13. **Cerrada tu tarea, encadena otra solo en verde** (misma banda, corta, sin esperas; si
    tu frase nombra la cadena, encadenas por defecto). Antes, «Antes de hacer nada» entero
    con reclamo nuevo. Si no, da la foto del momento y las frases de arranque **solo para
    las LIBRES**, una por sesión que quepa, y para.
14. **Un reclamo vivo es una sesión viva**, aunque no aparezca en `.claude/sesiones/`. Lo
    que deje preparado (ficheros sin commit) no se materializa por iniciativa ajena.
15. **Quien monta o coordina no reclama ni escribe en `salidas/`**; sus ficheros son las
    fichas, `proyecto.md`, este tablón al montar y en `hechos/` sus `notas/`, `sustituidas/`,
    `reabiertas/`, `incidencias/`.
16. **Los mensajes entre sesiones valen para resolver un choque**, siempre que el
    resultado acabe escrito en `hechos/`.

## Tabla de tareas

Vista derivada. LISTA si el rastro más reciente es una terminada; EN CURSO si hay reclamo
vivo; RELEVABLE si su reclamo más reciente está caducado sin cierre ni relevo (la fila dice
el sid y a qué hora caducó); REABIERTA si el rastro más reciente es una reabierta (la fila
dice qué corregir); si es un fallo, su `parada por:` decide: A MEDIAS (`sesión agotada`,
cogible), MAL CORTADA (`mal cortada`, espera al usuario), FALLIDA (`avería` o sin línea);
SUSTITUIDA si lo es una sustituida; BLOQUEADA si le falta una precondición; PENDIENTE en lo
demás. Se regenera al reclamar y al cerrar, recalculando **todas** las filas contra
`hechos/` y `date -u`. **Las columnas «Banda» y «Encadenable con» no salen de `hechos/`:
se copian de las fichas** al regenerar; la leyenda de bandas, de `proyecto.md`.

| # | Tarea | Fichero | Precondición | Duración esperada | Banda | Encadenable con | Salida (dueño único) | Estado | Reclamo vivo (sid · caduca) |
|---|---|---|---|---|---|---|---|---|---|
| 01 | Base común, panel único del profesor y práctica de plantilla | tareas/tarea-01-base-comun.md | ninguna | 2 h 30 min | ALTO | — | practicas/_comun/, practicas/plantilla/, portada y panel; salidas/01-base-comun/ | LISTA | terminada 19:45Z · commit 914d5b0 |
| 02 | Semáforo de divisibilidad (criterios, compuestos, cifra que falta) | tareas/tarea-02-semaforo.md | 01 LISTA | 1 h 30 min | MEDIO | 04 | practicas/semaforo/; salidas/02-semaforo/ | LISTA | terminada 17:52Z (8-oct) · commit 66909b0 (reabierta corregida, s-20261008T175130-24159fac) |
| 03 | Divisores por parejas con rectángulos | tareas/tarea-03-rectangulos.md | 01 LISTA | 2 h | MEDIO | — | practicas/rectangulos/; salidas/03-rectangulos/ | LISTA | terminada 17:56Z (8-oct) · commit efeac7d (reabierta corregida, s-20261008T175449-a7f61077) |
| 04 | Múltiplos y divisores en la recta (0 y 1, V/F) | tareas/tarea-04-recta.md | 01 LISTA | 1 h 30 min | MEDIO | 02 | practicas/recta/; salidas/04-recta/ | LISTA | terminada 17:54Z (8-oct) · commit 206a833 (reabierta corregida, s-20261008T175300-552e729c) |
| 05 | Criba de Eratóstenes y flashcards primo/compuesto | tareas/tarea-05-criba.md | 01 LISTA | 2 h | MEDIO | — | practicas/criba/; salidas/05-criba/ | LISTA | terminada 17:55Z (8-oct) · commit 3817f7e (reabierta corregida, s-20261008T175224-7b4cac18) |
| 06 | Árbol de factores libre | tareas/tarea-06-arbol.md | 01 LISTA | 2 h 30 min | ALTO | — | practicas/arbol/; salidas/06-arbol/ | LISTA | terminada 21:36Z · commit 5ad984c |
| 07 | Divisiones sucesivas guiadas | tareas/tarea-07-divisiones.md | 01 LISTA | 2 h | MEDIO | 08 | practicas/divisiones/; salidas/07-divisiones/ | LISTA | terminada 17:53Z (8-oct) · commit 3b63f58 (reabierta corregida, s-20261008T175029-316f6500) · publicada (catálogo: 2128eb6) |
| 08 | Fábrica de divisores | tareas/tarea-08-fabrica.md | 01 LISTA | 1 h 30 min | MEDIO | 07 | practicas/fabrica/; salidas/08-fabrica/ | LISTA | terminada 18:03Z (8-oct) · commit 07b8a60 (reabierta corregida, s-20261008T175537-2deb69bd) |
| 09 | m.c.d. y m.c.m. con factores primos (Venn) | tareas/tarea-09-venn.md | 01 LISTA | 2 h 30 min | ALTO | — | practicas/venn/; salidas/09-venn/ | LISTA | terminada 21:44Z · commit f5748e7 |
| 10 | Detector de imposibles | tareas/tarea-10-imposibles.md | 01 LISTA | 1 h 30 min | MEDIO | 08 | practicas/imposibles/; salidas/10-imposibles/ | LISTA | terminada 18:2xZ (8-oct) · commit c7d3f78 (reabierta corregida, s-20261008T181148-b5c3656b) |
| 11 | ¿m.c.d. o m.c.m.? Clasificador de enunciados | tareas/tarea-11-clasificador.md | 01 LISTA | 2 h | MEDIO | — | practicas/clasificador/; salidas/11-clasificador/ | LISTA | terminada 17:52Z (8-oct) · commit a8e309d (reabierta corregida, s-20261008T174848-5f71fd85) |
| 12 | Reloj de coincidencias | tareas/tarea-12-reloj.md | 01 LISTA | 2 h | MEDIO | — | practicas/reloj/; salidas/12-reloj/ | LISTA | terminada (8-oct) · commit 3053f48 + df1bdfa (reabierta corregida, s-20261008T175226-2fefd40a) |
| 13 | Baldosas y cuerdas | tareas/tarea-13-baldosas.md | 01 LISTA | 2 h | MEDIO | — | practicas/baldosas/; salidas/13-baldosas/ | LISTA | terminada 18:25 Z (8-oct) · commit fa3c9265 (reabierta corregida; «×» pendiente de Juan Luis) |
| 14 | Caza el error | tareas/tarea-14-errores.md | 01 LISTA | 2 h | MEDIO | — | practicas/errores/; salidas/14-errores/ | LISTA | terminada 17:56Z (8-oct) · commit 84d80c5 (reabierta corregida, s-20261008T175029-316f6500) · publicada (catálogo: 2128eb6) |
| 15 | Léelo en inglés | tareas/tarea-15-leelo.md | 01 LISTA | 1 h 30 min | MEDIO | 16 | practicas/leelo/; salidas/15-leelo/ | LISTA | terminada 18:01Z (8-oct) · commit a12fb0c (reabierta corregida, s-20261008T175739-b443cac1) |
| 16 | Operar con factorizaciones | tareas/tarea-16-factorizaciones.md | 01 LISTA | 2 h | MEDIO | 15 | practicas/factorizaciones/; salidas/16-factorizaciones/ | LISTA | terminada 18:14Z (8-oct) · commit b5a878e (reabierta corregida, s-20261008T180351-55d4decb) |
| 17 | Migrar divisores/ a la base común | tareas/tarea-17-migrar-divisores.md | 01 LISTA; la sesión que editaba divisores/ ha terminado; firma 17 | 1 h 30 min | MEDIO | — | divisores/; salidas/17-migrar-divisores/ | LISTA | terminada 21:22Z · commit edfbfa3 |
| 18 | Revisión final, portada, README y documentación | tareas/tarea-18-revision-final.md | 02-17 y 19-33 LISTAS; firma 18 | 3 h | ALTO | — | catalogo.js (disponible), portada, README, docs/practicas-unidad2.md; salidas/18-revision-final/ | LISTA | terminada 06:01Z (8-oct) · commit f7df3ba |
| 19 | Coloca los paréntesis (repaso de la unidad 1) | tareas/tarea-19-parentesis.md | 01 LISTA | 2 h | MEDIO | 16 | practicas/parentesis/; salidas/19-parentesis/ | LISTA | terminada 17:54Z (8-oct) · commit 58a3c84 (reabierta corregida, s-20261008T175226-a4d30107) |
| 20 | ¿Qué se hace primero? Jerarquía paso a paso y agrupadores invisibles (U1) | tareas/tarea-20-jerarquia.md | 34 LISTA | 2 h | MEDIO | 21 | practicas/jerarquia/; salidas/20-jerarquia/ | LISTA | terminada 18:5xZ · commit 3f44274 · publicada (catálogo: 2128eb6) |
| 21 | El exponente y su base (U1) | tareas/tarea-21-exponente.md | 34 LISTA | 2 h | MEDIO | 22 | practicas/exponente/; salidas/21-exponente/ | LISTA | commit b3dbb99 · publicada (catálogo: 2128eb6) |
| 22 | Raíz cuadrada con cuadrados (U1) | tareas/tarea-22-raiz.md | 34 LISTA | 2 h | MEDIO | 21 | practicas/raiz/; salidas/22-raiz/ | LISTA | terminada 17:56Z (8-oct) · commit 13c02b1 (reabierta corregida, s-20261008T175509-17233e62) |
| 23 | División entera: cajas y resto (U1) | tareas/tarea-23-division.md | 34 LISTA | 2 h | MEDIO | — | practicas/division/; salidas/23-division/ | LISTA | terminada 18:02Z (8-oct) · commit c375695 (reabierta corregida, s-20261008T175638-31aa7d6c) |
| 24 | Del enunciado a la expresión (U1) | tareas/tarea-24-expresion.md | 34 LISTA | 2 h 30 min | ALTO | — | practicas/expresion/; salidas/24-expresion/ | LISTA | terminada 17:58Z (8-oct) · commit b1c0a36 (reabierta corregida, s-20261008T175319-8ec41ac6) |
| 25 | Redondeo y estimación (U1) | tareas/tarea-25-redondeo.md | 34 LISTA | 2 h | MEDIO | 26 | practicas/redondeo/; salidas/25-redondeo/ | LISTA | terminada 18:04Z (8-oct) · commit 964d744 (reabierta corregida, s-20261008T180207-0a6e88aa) |
| 26 | Constructor de números (U1) | tareas/tarea-26-constructor.md | 34 LISTA | 2 h | MEDIO | 25 | practicas/constructor/; salidas/26-constructor/ | LISTA | terminada 17:55Z (8-oct) · commit de5fe08 (reabierta corregida, s-20261008T175256-7d4d2bd8) |
| 27 | Distributiva con rectángulos (U1) | tareas/tarea-27-distributiva.md | 34 LISTA | 2 h | MEDIO | 30 | practicas/distributiva/; salidas/27-distributiva/ | LISTA | commit 6bd325b · publicada (catálogo: 2128eb6) |
| 28 | Potencias de 10 y números grandes (U1) | tareas/tarea-28-potencias10.md | 34 LISTA | 1 h 30 min | MEDIO | 29 | practicas/potencias10/; salidas/28-potencias10/ | LISTA | terminada 17:58Z (8-oct) · commit a6fb8cd (reabierta corregida, s-20261008T175617-aa2c36f9) |
| 29 | Dictado de números (U1) | tareas/tarea-29-dictado.md | 34 LISTA | 2 h | MEDIO | 28 | practicas/dictado/; salidas/29-dictado/ | LISTA | terminada 18:03Z (8-oct) · commit 2b6dc4a (reabierta corregida, s-20261008T180106-eb3c46a4) |
| 30 | Cálculo mental con estrategia (U1) | tareas/tarea-30-mental.md | 34 LISTA | 1 h 30 min | MEDIO | 27 | practicas/mental/; salidas/30-mental/ | EN CURSO | s-20261008T175110-97bf1924 · caduca 2026-10-08T20:51:10Z · código comiteado (dcc3821) y publicada por la coordinadora (2128eb6); falta solo que su sesión escriba la terminada |
| 31 | Potencias especiales, verdadero o falso (U1) | tareas/tarea-31-especiales.md | 34 LISTA | 1 h | MEDIO | 30 | practicas/especiales/; salidas/31-especiales/ | LISTA | terminada 18:05Z (8-oct) · commit 7709ce6 (reabierta corregida, s-20261008T180343-5bede6f2) |
| 32 | Caza el error de la unidad 1 | tareas/tarea-32-errores1.md | 34 LISTA | 2 h | MEDIO | — | practicas/errores1/; salidas/32-errores1/ | LISTA | terminada 18:02Z (8-oct) · commit e9dbc4f (reabierta corregida, s-20261008T175029-316f6500) · NO publicada a propósito: espera la decisión «saltoPaso» de Juan Luis |
| 33 | Propiedades de las potencias y última cifra (ampliación U1) | tareas/tarea-33-propiedades.md | 34 LISTA | 1 h 30 min | MEDIO | 31 | practicas/propiedades/; salidas/33-propiedades/ | EN CURSO | s-20261008T175832-42994f44 · caduca 2026-10-08T20:58:32Z · código comiteado (99576ba) y publicada por la coordinadora (2128eb6); falta solo que su sesión escriba la terminada |
| 34 | Filas 17-30 del catálogo (repaso U1) y las tres líneas del test común | tareas/tarea-34-catalogo-u1.md | 01 LISTA | 30 min | MEDIO | — | practicas/_comun/catalogo.js + tests/practicas-comun.test.js; salidas/34-catalogo-u1/ | LISTA | terminada 20:51Z · commit 9c26890 |
| 35 | Base: 10 aciertos (+2, tope 20) e idioma alterno por ítem sin selector | tareas/tarea-35-base-10-e-idioma-alterno.md | 01 LISTA | 1 h | MEDIO | — | practicas/_comun/{base,contador,textos}.js, plantilla (comentarios), panel, tests/practicas-comun.test.js, README (apartado); salidas/35-base-10-e-idioma-alterno/ | LISTA | terminada 21:32Z · commit 6cfc713 |
| 36 | Segunda revisión: comprobar las 28 reaperturas | tareas/tarea-36-segunda-revision.md | las 28 reabiertas con terminada, o con código comiteado (30, 33) | 1 h 30 min | ALTO | — | practicas/_comun/catalogo.js (solo `disponible`, solo para retirar); salidas/36-segunda-revision/ | PENDIENTE | — |

Bandas hoy (de `proyecto.md`, comprobado el 2026-09-20): ALTO = Opus 5, esfuerzo Alto ·
MEDIO = Sonnet 5, esfuerzo Medio · BAJO = Haiku 4.5, esfuerzo Medio (sin tareas BAJO).

Cuántas sesiones caben a la vez: una, la de la tarea 36 (ALTO). No hay más tareas libres. La
32 (errores1) queda sin publicar hasta que Juan Luis decida sobre las plantillas «saltoPaso».

Fuera del reparto: el commit 58a9da2 (2026-10-08) cambió la base a contador por puntos (10
puntos, −1 por fallo, 5 vidas, racha de 5 con extra); `inicial` y `maximo` ya no existen.
Nota: `hechos/notas/s-20261008T173817-contador-contador-por-puntos.md`. La propuesta de
«tarea 36 puntos» queda sin objeto.

No es de ninguna tarea todavía: un arreglo corto de la base (`practicas/_comun/`) que pide
la revisión (`salidas/18-revision-final/HALLAZGOS-FUERA-DE-CRITERIO.md`, apartado 2). Lo da
de alta la coordinadora, como tarea 36, si Juan Luis lo quiere.

## Registro de finalizaciones

Derivado de `hechos/terminadas/`. Una línea por fichero, más reciente arriba.

Formato: `LISTA · tarea 25 · 2026-10-08 18:04 · s-20261008T180207-0a6e88aa · 964d744 · practicas/redondeo/{logica.js,practica.js,textos.js}, tests/practicas-redondeo.test.js (4 ficheros) · reabierta corregida

LISTA · tarea 29 · 2026-10-08 18:03 · s-20261008T180106-eb3c46a4 · 2b6dc4a · practicas/dictado/{practica.js,textos.js}, tests/practicas-dictado.test.js (3 ficheros) · reabierta corregida

LISTA · tarea 23 · 2026-10-08 18:02 · s-20261008T175638-31aa7d6c · c375695 · practicas/division/{textos.js,practica.js} (2 ficheros) · reabierta corregida

LISTA · tarea 15 · 2026-10-08 18:01 · s-20261008T175739-b443cac1 · a12fb0c · practicas/leelo/logica.js, tests/practicas-leelo.test.js · reabierta corregida

LISTA · tarea 28 · 2026-10-08 17:58 · s-20261008T175617-aa2c36f9 · a6fb8cd · practicas/potencias10/{practica.js,textos.js}, tests/practicas-potencias10.test.js (3 ficheros) · reabierta corregida

LISTA · tarea 24 · 2026-10-08 17:58 · s-20261008T175319-8ec41ac6 · b1c0a36 · practicas/expresion/{logica.js,textos.js,practica.js}, tests/practicas-expresion.test.js (4 ficheros, git show --stat b1c0a36) · reabierta corregida

LISTA · tarea 22 · 2026-10-08 17:56 · s-20261008T175509-17233e62 · 13c02b1 · practicas/raiz/textos.js (1 fichero) · reabierta corregida

LISTA · tarea 14 · 2026-10-08 17:56 · s-20261008T175029-316f6500 · 84d80c5 · practicas/errores/{textos.js,practica.js,estilos.css}, tests/practicas-errores.test.js (4 ficheros) · reabierta corregida

LISTA · tarea 03 · 2026-10-08 17:56 · s-20261008T175449-a7f61077 · efeac7d · practicas/rectangulos/{textos.js,practica.js}, tests/practicas-rectangulos.test.js · reabierta corregida

LISTA · tarea 26 · 2026-10-08 17:55 · s-20261008T175256-7d4d2bd8 · de5fe08 · practicas/constructor/{logica.js,practica.js,textos.js}, tests/practicas-constructor.test.js (4 ficheros, +67 −10) · reabierta corregida

LISTA · tarea 19 · 2026-10-08 17:54 · s-20261008T175226-a4d30107 · 58a3c84 · practicas/parentesis/{practica.js,textos.js,estilos.css} (3 ficheros; la reabierta no tocó logica.js ni el test) · reabierta corregida

LISTA · tarea 04 · 2026-10-08 17:54 · s-20261008T175300-552e729c · 206a833 · practicas/recta/logica.js, tests/practicas-recta.test.js · reabierta corregida

LISTA · tarea 07 · 2026-10-08 17:53 · s-20261008T175029-316f6500 · 3b63f58 · practicas/divisiones/{logica.js,practica.js}, tests/practicas-divisiones.test.js (3 ficheros, git show --stat 3b63f58) · reabierta corregida

LISTA · tarea 11 · 2026-10-08 17:52 · s-20261008T174848-5f71fd85 · a8e309d · practicas/clasificador/{textos.js,logica.js}, tests/practicas-clasificador.test.js, practicas/_comun/catalogo.js (solo disponible:true de la fila 10) (4 ficheros, ver git show --stat a8e309d) · reabierta corregida

LISTA · tarea 02 · 2026-10-08 17:52 · s-20261008T175130-24159fac · 66909b0 · practicas/semaforo/{logica.js,textos.js}, tests/practicas-semaforo.test.js · reabierta corregida

LISTA · tarea NN · AAAA-MM-DD HH:MM · sid · hash del commit · ficheros · duración real`

El registro cuenta terminadas: una tarea REABIERTA sigue teniendo aquí su línea de cuando
se cerró. Su estado de hoy es el de la tabla.

LISTA · tarea 13 · 2026-10-08 18:25 · s-20261008T181518-7bafe7d1 · fa3c9265 · 3 ficheros (practicas/baldosas/{practica.js,textos.js}, tests/practicas-baldosas.test.js) · ~20 min · reabierta corregida (7 puntos)

LISTA · tarea 16 · 2026-10-08 18:14 · s-20261008T180351-55d4decb · b5a878e · 3 ficheros (practicas/factorizaciones/{logica.js,practica.js}, tests/practicas-factorizaciones.test.js) · ~8 min · reabierta corregida (4 puntos)

LISTA · tarea 08 · 2026-10-08 18:03 · s-20261008T175537-2deb69bd · 07b8a60 · 4 ficheros (practicas/fabrica/{logica.js,practica.js,textos.js}, tests/practicas-fabrica.test.js) · ~15 min · reabierta corregida (4 puntos de 08--s-20261008T051928-1cba9950)

LISTA · tarea 05 · 2026-10-08 17:58 · s-20261008T175224-7b4cac18 · 3817f7e · 4 ficheros (practicas/criba/{logica.js,practica.js,textos.js}, tests/practicas-criba.test.js) · ~10 min · reabierta corregida (5 puntos de 05--s-20261008T051928-1cba9950)

LISTA · tarea 10 · 2026-10-08 · s-20261008T181148-b5c3656b · c7d3f78 · reabierta corregida (4 ficheros + catálogo) · ~15 min

LISTA · tarea 12 · 2026-10-08 · s-20261008T175226-2fefd40a · 3053f48, df1bdfa · reabierta corregida (4 ficheros + test + catálogo) · ~25 min (con un autostash ajeno en medio)

LISTA · tarea 18 · 2026-10-08 06:01 · s-20261008T051928-1cba9950 · f7df3ba · 5 ficheros (README.md, docs/practicas-unidad2.md, practicas/_comun/catalogo.js, practicas/index.html, practicas/portada.js) · 43 min (estimada: 3 h) · veredicto: 3 SE ENTREGAN, 28 reabiertas

LISTA · tarea 26 · 2026-10-08 05:15 · s-20261008T050750-ded5a656 · 510ffe1 · 6 ficheros (practicas/constructor/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-constructor.test.js) · ~8 min de reloj (abierto 05:07Z; estimada: 2 h)

LISTA · tarea 21 · 2026-10-08 05:15 · s-20261008T051103-54f70e26 · a59a580 · 6 ficheros (practicas/exponente/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-exponente.test.js) · ~12 min tras relevar a s-20261007T213810-ffd13ae0 (estimada: 2 h)

LISTA · tarea 24 · 2026-10-08 05:13 · s-20261007T213246-c81731a7 · d5f2caf · 6 ficheros (practicas/expresion/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-expresion.test.js) · ~35 min de trabajo (estimada: 2 h 30 min)

LISTA · tarea 07 · 2026-10-08 05:10 · s-20261007T212221-4246d6aa · d9ef271 · 6 ficheros (practicas/divisiones/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-divisiones.test.js) · ~7 h 48 min de reloj con una pausa larga (estimada: 2 h)

LISTA · tarea 29 · 2026-10-08 05:08 · s-20261007T215326-f363ef2d · 15f01d9 · 6 ficheros (practicas/dictado/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-dictado.test.js) · ~25 min de trabajo (estimada: 2 h)

LISTA · tarea 30 · 2026-10-08 05:06 · s-20261007T214832-8296db7c · 0c0e437 · 6 ficheros (practicas/mental/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-mental.test.js) · ~15 min de trabajo (estimada: 1 h 30 min)

LISTA · tarea 33 · 2026-10-08 05:06 · s-20261007T214647-e3919d35 · 3aefc1a · 6 ficheros (practicas/propiedades/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-propiedades.test.js) · ~25 min de trabajo (estimada: 1 h 30 min)

LISTA · tarea 28 · 2026-10-07 21:52 · s-20261007T214144-b7a0e172 · 7bfe7c7 · 6 ficheros (practicas/potencias10/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-potencias10.test.js) · ~11 min (estimada: 1 h 30 min)

LISTA · tarea 19 · 2026-10-07 21:49 · s-20261007T212734-78b63f57 · e902014 · 6 ficheros (practicas/parentesis/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-parentesis.test.js) · ~22 min (estimada: 2 h)

LISTA · tarea 25 · 2026-10-08 05:10 · s-20261007T214109-30fcacbb · 1ae08ff · 6 ficheros (practicas/redondeo/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-redondeo.test.js) · ~25 min de trabajo (estimada: 2 h)

LISTA · tarea 23 · 2026-10-08 05:09 · s-20261008T050250-c37a11e9 · b8577a5 · 6 ficheros (practicas/division/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-division.test.js) · 7 min de esta sesión (relevó a una caída; estimada: 2 h)

LISTA · tarea 27 · 2026-10-07 21:48 · s-20261007T214112-0da18c09 · eea70ea · 6 ficheros (practicas/distributiva/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-distributiva.test.js) · ~7 min (estimada: 2 h)

LISTA · tarea 22 · 2026-10-08 05:07 · s-20261007T214806-1c7e320e · 18a55a6 · 6 ficheros (practicas/raiz/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-raiz.test.js) · ~20 min de trabajo efectivo (estimada: 2 h)

LISTA · tarea 32 · 2026-10-08 05:08 · s-20261007T214541-bbfb1e44 · de3094f · 6 ficheros (practicas/errores1/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-errores1.test.js) · ~35 min (estimada: 2 h)

LISTA · tarea 09 · 2026-10-07 21:44 · s-20261007T212116-b15e0069 · f5748e7 · 6 ficheros (practicas/venn/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-venn.test.js) · 24 min (estimada: 2 h 30 min)

LISTA · tarea 16 · 2026-10-07 21:43 · s-20261007T212934-840982ce · d02332e · 6 ficheros (practicas/factorizaciones/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-factorizaciones.test.js) · ~25 min (estimada: 2 h)

LISTA · tarea 20 · 2026-10-07 21:40 · s-20261007T213029-7aeb6b17 · ac95a98 · 6 ficheros (practicas/jerarquia/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-jerarquia.test.js) · 10 min (estimada: 2 h)

LISTA · tarea 06 · 2026-10-07 21:36 · s-20261007T212058-817d27db · 5ad984c · 6 ficheros (practicas/arbol/{estilos.css,index.html,logica.js,practica.js,textos.js}, tests/practicas-arbol.test.js) · 16 min (estimada: 2 h 30 min)

LISTA · tarea 35 · 2026-10-07 21:32 · s-20261007T205921-9d74da56 · 6cfc713 · 9 ficheros (practicas/_comun/{base,contador,estilos,textos}.*, practicas/plantilla/practica.js, practicas/profesor.{js,html}, tests/practicas-comun.test.js, README.md) · 33 min (estimada: 1 h)

LISTA · tarea 14 · 2026-10-07 21:36 · s-20261007T212631-9f1904c0 · f682746 · 6 ficheros (practicas/errores/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-errores.test.js) · 10 min (estimada: 2 h)

LISTA · tarea 08 · 2026-10-07 21:33 · s-20261007T212619-e5db1e81 · c180f14 · 6 ficheros (practicas/fabrica/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-fabrica.test.js) · 7 min (estimada: 1 h 30 min)

LISTA · tarea 15 · 2026-10-07 21:27 · s-20261007T205606-bd06959b · 15d353b · 6 ficheros (practicas/leelo/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-leelo.test.js) · 32 min (estimada: 1 h 30 min)

LISTA · tarea 05 · 2026-10-07 21:25 · s-20261007T205649-fabde281 · cf1cfa5 · 6 ficheros (practicas/criba/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-criba.test.js) · 28 min (estimada: 2 h)

LISTA · tarea 13 · 2026-10-07 21:23 · s-20261007T205810-6457f4dd · 7f427aa · 6 ficheros (practicas/baldosas/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-baldosas.test.js) · 48 min (estimada: 2 h)

LISTA · tarea 10 · 2026-10-07 21:23 · s-20261007T205307-4e1f8d32 · 7b2a9f3 · 6 ficheros (practicas/imposibles/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-imposibles.test.js) · 30 min (estimada: 1 h 30 min)

LISTA · tarea 17 · 2026-10-07 21:22 · s-20261007T204920-8ed7ce1e · edfbfa3 · 9 ficheros (divisores/{practica.js,textos.js,index.html,profesor.html,estilos.css}, _papelera/divisores-{app,profesor,resultados}.js.pre-tarea17, tests/divisores.test.js) · 41 min (estimada: 1 h 30 min)

LISTA · tarea 31 · 2026-10-07 21:13 · s-20261007T205249-552c0378 · c35b796 · 6 ficheros (practicas/especiales/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-especiales.test.js) · 21 min (estimada: 1 h)

LISTA · tarea 04 · 2026-10-07 21:07 · s-20261007T204357-12dccba9 · a980c20 · 6 ficheros (practicas/recta/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-recta.test.js) · 13 min (estimada: 1 h 30 min)

LISTA · tarea 34 · 2026-10-07 20:51 · s-20261007T204612-a270171a · 9c26890 · 2 ficheros (practicas/_comun/catalogo.js, tests/practicas-comun.test.js) · 4 min (estimada: 30 min)

LISTA · tarea 11 · 2026-10-07 20:47 · s-20261007T203059-03e5af6d · 47b0494 · 6 ficheros (practicas/clasificador/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-clasificador.test.js) · 16 min (estimada: 2 h)

LISTA · tarea 12 · 2026-10-07 20:42 · s-20261007T203121-2e2ea2ab · d6e06ae · 6 ficheros (practicas/reloj/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-reloj.test.js) · 11 min (estimada: 2 h)

LISTA · tarea 03 · 2026-10-07 20:43 · s-20261007T203023-29ff0ec2 · 9fa847a · 6 ficheros (practicas/rectangulos/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-rectangulos.test.js) · 13 min (estimada: 2 h)

LISTA · tarea 02 · 2026-10-07 20:42 · s-20261007T203003-4ee158cb · 1b2d1a4 · 6 ficheros (practicas/semaforo/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-semaforo.test.js) · 12 min (estimada: 1 h 30 min)

LISTA · tarea 01 · 2026-10-07 19:45 · s-20261007T192646-341f1b98 · 914d5b0 · 23 ficheros (practicas/_comun/, portada, panel, practicas/plantilla/, tests/practicas-comun.test.js, firestore.rules, src/firebase.js, README.md) · 19 min (estimada: 2 h 30 min)

Recalibración (primera terminada): la 01 ha durado 19 min de reloj frente a 2 h 30 min
estimados. Las estimaciones de las fichas son holgadas; la caducidad de los reclamos (2 ×)
da margen de sobra. Todas las terminadas siguientes confirman lo mismo: entre 4 y 48
minutos reales frente a estimaciones de 30 minutos a 2 horas y media.

## Incidencias de coordinación

Derivado de `hechos/incidencias/`.

- `s-20261008T175319-8ec41ac6.md` (tarea 24, 2026-10-08 18:03Z): un `git pull --rebase --autostash` de la
  sesión de la 28 (17:58Z) se llevó cambios sin comitear de varias sesiones (reloj, jerarquia, fabrica,
  leelo, corrector/) y no los reaplicó. Están en el commit 58bd3a4 (`refs/rescate/autostash-20261008T1758`);
  cada sesión recupera solo lo suyo con `git show 58bd3a4:<ruta> > <ruta>`. Sin `stash pop/drop`.

- `s-20261007T184632-fa5a1491-huerfanos.md` (coordinadora, 2026-10-08 05:09Z): las sesiones de
  la 07, la 29 y la 32 cerraron en disco y murieron antes del commit final de sus ficheros de
  `hechos/`; la coordinadora los comiteó tal cual. No fue un relevo.

Sin incidencia, pero conviene saberlo: `hechos/reclamos/23--s-20261007T214947-e0ab035d.md`
(reclamo caducado de la 23, relevado por s-20261008T050250-c37a11e9) está en disco sin
seguir por git; es de su sesión y nadie más lo comitea. Los reclamos de la 03, la 31, la 34
y el primero de la 21 no tienen línea de cierre, pero están caducados y hay terminada
posterior: no son relevables.

Los automatismos y las rutas del proyecto están en `proyecto.md`, no aquí: este fichero
se regenera entero y se los llevaría por delante.
