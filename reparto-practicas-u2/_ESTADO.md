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

Regenerado: 2026-10-07 21:41 UTC · por la sesión s-20261007T213810-ffd13ae0 (reclama la
21, encadena la 22; con tanta sesión a la vez, 06, 08, 14 y 35 también estaban LISTA en
`hechos/` y la tabla no lo reflejaba: corregido. La regeneración de la 06 (21:37Z) dejó
rota la línea «Formato:» del registro, con la entrada de la 14 pegada encima: corregido
también).

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
| 02 | Semáforo de divisibilidad (criterios, compuestos, cifra que falta) | tareas/tarea-02-semaforo.md | 01 LISTA | 1 h 30 min | MEDIO | 04 | practicas/semaforo/; salidas/02-semaforo/ | LISTA | terminada 20:42Z · commit 1b2d1a4 |
| 03 | Divisores por parejas con rectángulos | tareas/tarea-03-rectangulos.md | 01 LISTA | 2 h | MEDIO | — | practicas/rectangulos/; salidas/03-rectangulos/ | LISTA | terminada 20:43Z · commit 9fa847a |
| 04 | Múltiplos y divisores en la recta (0 y 1, V/F) | tareas/tarea-04-recta.md | 01 LISTA | 1 h 30 min | MEDIO | 02 | practicas/recta/; salidas/04-recta/ | LISTA | terminada 21:07Z · commit a980c20 |
| 05 | Criba de Eratóstenes y flashcards primo/compuesto | tareas/tarea-05-criba.md | 01 LISTA | 2 h | MEDIO | — | practicas/criba/; salidas/05-criba/ | LISTA | terminada 21:25Z · commit cf1cfa5 |
| 06 | Árbol de factores libre | tareas/tarea-06-arbol.md | 01 LISTA | 2 h 30 min | ALTO | — | practicas/arbol/; salidas/06-arbol/ | LISTA | terminada 21:36Z · commit 5ad984c |
| 07 | Divisiones sucesivas guiadas | tareas/tarea-07-divisiones.md | 01 LISTA | 2 h | MEDIO | 08 | practicas/divisiones/; salidas/07-divisiones/ | EN CURSO | s-20261007T212221-4246d6aa · 2026-10-08T01:22:21Z |
| 08 | Fábrica de divisores | tareas/tarea-08-fabrica.md | 01 LISTA | 1 h 30 min | MEDIO | 07 | practicas/fabrica/; salidas/08-fabrica/ | LISTA | terminada 21:33Z · commit c180f14 |
| 09 | m.c.d. y m.c.m. con factores primos (Venn) | tareas/tarea-09-venn.md | 01 LISTA | 2 h 30 min | ALTO | — | practicas/venn/; salidas/09-venn/ | EN CURSO | s-20261007T212116-b15e0069 · 2026-10-08T02:21:16Z |
| 10 | Detector de imposibles | tareas/tarea-10-imposibles.md | 01 LISTA | 1 h 30 min | MEDIO | 08 | practicas/imposibles/; salidas/10-imposibles/ | LISTA | terminada 21:23Z · commit 7b2a9f3 |
| 11 | ¿m.c.d. o m.c.m.? Clasificador de enunciados | tareas/tarea-11-clasificador.md | 01 LISTA | 2 h | MEDIO | — | practicas/clasificador/; salidas/11-clasificador/ | LISTA | terminada 20:47Z · commit 47b0494 |
| 12 | Reloj de coincidencias | tareas/tarea-12-reloj.md | 01 LISTA | 2 h | MEDIO | — | practicas/reloj/; salidas/12-reloj/ | LISTA | terminada 20:42Z · commit d6e06ae |
| 13 | Baldosas y cuerdas | tareas/tarea-13-baldosas.md | 01 LISTA | 2 h | MEDIO | — | practicas/baldosas/; salidas/13-baldosas/ | LISTA | terminada 21:23Z · commit 7f427aa |
| 14 | Caza el error | tareas/tarea-14-errores.md | 01 LISTA | 2 h | MEDIO | — | practicas/errores/; salidas/14-errores/ | LISTA | terminada 21:36Z · commit f682746 |
| 15 | Léelo en inglés | tareas/tarea-15-leelo.md | 01 LISTA | 1 h 30 min | MEDIO | 16 | practicas/leelo/; salidas/15-leelo/ | LISTA | terminada 21:27Z · commit 15d353b |
| 16 | Operar con factorizaciones | tareas/tarea-16-factorizaciones.md | 01 LISTA | 2 h | MEDIO | 15 | practicas/factorizaciones/; salidas/16-factorizaciones/ | EN CURSO | s-20261007T212934-840982ce · 2026-10-08T01:29:34Z |
| 17 | Migrar divisores/ a la base común | tareas/tarea-17-migrar-divisores.md | 01 LISTA; la sesión que editaba divisores/ ha terminado; firma 17 | 1 h 30 min | MEDIO | — | divisores/; salidas/17-migrar-divisores/ | LISTA | terminada 21:22Z · commit edfbfa3 |
| 18 | Revisión final, portada, README y documentación | tareas/tarea-18-revision-final.md | 02-17 y 19-33 LISTAS; firma 18 | 3 h | ALTO | — | catalogo.js (disponible), portada, README, docs/practicas-unidad2.md; salidas/18-revision-final/ | BLOQUEADA | |
| 19 | Coloca los paréntesis (repaso de la unidad 1) | tareas/tarea-19-parentesis.md | 01 LISTA | 2 h | MEDIO | 16 | practicas/parentesis/; salidas/19-parentesis/ | EN CURSO | s-20261007T212734-78b63f57 · 2026-10-08T01:27:34Z |
| 20 | ¿Qué se hace primero? Jerarquía paso a paso y agrupadores invisibles (U1) | tareas/tarea-20-jerarquia.md | 34 LISTA | 2 h | MEDIO | 21 | practicas/jerarquia/; salidas/20-jerarquia/ | EN CURSO | s-20261007T213029-7aeb6b17 · 2026-10-08T01:30:29Z |
| 21 | El exponente y su base (U1) | tareas/tarea-21-exponente.md | 34 LISTA | 2 h | MEDIO | 22 | practicas/exponente/; salidas/21-exponente/ | EN CURSO | s-20261007T213810-ffd13ae0 · 2026-10-08T01:38:10Z |
| 22 | Raíz cuadrada con cuadrados (U1) | tareas/tarea-22-raiz.md | 34 LISTA | 2 h | MEDIO | 21 | practicas/raiz/; salidas/22-raiz/ | PENDIENTE | |
| 23 | División entera: cajas y resto (U1) | tareas/tarea-23-division.md | 34 LISTA | 2 h | MEDIO | — | practicas/division/; salidas/23-division/ | PENDIENTE | |
| 24 | Del enunciado a la expresión (U1) | tareas/tarea-24-expresion.md | 34 LISTA | 2 h 30 min | ALTO | — | practicas/expresion/; salidas/24-expresion/ | EN CURSO | s-20261007T213246-c81731a7 · 2026-10-08T02:32:46Z |
| 25 | Redondeo y estimación (U1) | tareas/tarea-25-redondeo.md | 34 LISTA | 2 h | MEDIO | 26 | practicas/redondeo/; salidas/25-redondeo/ | PENDIENTE | |
| 26 | Constructor de números (U1) | tareas/tarea-26-constructor.md | 34 LISTA | 2 h | MEDIO | 25 | practicas/constructor/; salidas/26-constructor/ | PENDIENTE | |
| 27 | Distributiva con rectángulos (U1) | tareas/tarea-27-distributiva.md | 34 LISTA | 2 h | MEDIO | 30 | practicas/distributiva/; salidas/27-distributiva/ | PENDIENTE | |
| 28 | Potencias de 10 y números grandes (U1) | tareas/tarea-28-potencias10.md | 34 LISTA | 1 h 30 min | MEDIO | 29 | practicas/potencias10/; salidas/28-potencias10/ | PENDIENTE | |
| 29 | Dictado de números (U1) | tareas/tarea-29-dictado.md | 34 LISTA | 2 h | MEDIO | 28 | practicas/dictado/; salidas/29-dictado/ | PENDIENTE | |
| 30 | Cálculo mental con estrategia (U1) | tareas/tarea-30-mental.md | 34 LISTA | 1 h 30 min | MEDIO | 27 | practicas/mental/; salidas/30-mental/ | PENDIENTE | |
| 31 | Potencias especiales, verdadero o falso (U1) | tareas/tarea-31-especiales.md | 34 LISTA | 1 h | MEDIO | 30 | practicas/especiales/; salidas/31-especiales/ | LISTA | terminada 21:13Z · commit c35b796 |
| 32 | Caza el error de la unidad 1 | tareas/tarea-32-errores1.md | 34 LISTA | 2 h | MEDIO | — | practicas/errores1/; salidas/32-errores1/ | PENDIENTE | |
| 33 | Propiedades de las potencias y última cifra (ampliación U1) | tareas/tarea-33-propiedades.md | 34 LISTA | 1 h 30 min | MEDIO | 31 | practicas/propiedades/; salidas/33-propiedades/ | PENDIENTE | |
| 34 | Filas 17-30 del catálogo (repaso U1) y las tres líneas del test común | tareas/tarea-34-catalogo-u1.md | 01 LISTA | 30 min | MEDIO | — | practicas/_comun/catalogo.js + tests/practicas-comun.test.js; salidas/34-catalogo-u1/ | LISTA | terminada 20:51Z · commit 9c26890 |
| 35 | Base: 10 aciertos (+2, tope 20) e idioma alterno por ítem sin selector | tareas/tarea-35-base-10-e-idioma-alterno.md | 01 LISTA | 1 h | MEDIO | — | practicas/_comun/{base,contador,textos}.js, plantilla (comentarios), panel, tests/practicas-comun.test.js, README (apartado); salidas/35-base-10-e-idioma-alterno/ | LISTA | terminada 21:32Z · commit 6cfc713 |

Bandas hoy (de `proyecto.md`, comprobado el 2026-09-20): ALTO = Opus 5, esfuerzo Alto ·
MEDIO = Sonnet 5, esfuerzo Medio · BAJO = Haiku 4.5, esfuerzo Medio (sin tareas BAJO).

Cuántas sesiones caben a la vez: 01 y 34 están LISTA, así que las PENDIENTE (22, 23, 25,
26, 27, 28, 29, 30, 32, 33) tocan carpetas disjuntas y pueden ir en paralelo entre sí y
con las EN CURSO (07, 09, 16, 19, 20, 21, 24). Cadenas sugeridas entre lo libre: 25+26,
27+30, 28+29. La 22 es la pareja de la 21 (esta sesión la encadenará al cerrar la 21).
Cuando cierren 02-17 y 19-33, la 18 (firma ya dada) queda libre.

## Registro de finalizaciones

Derivado de `hechos/terminadas/`. Una línea por fichero, más reciente arriba.

Formato: `LISTA · tarea NN · AAAA-MM-DD HH:MM · sid · hash del commit · ficheros · duración real`

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

(vacío todavía; nota: varias terminadas (05, 06, 10, 13, 15, 17) registraron que
`tests/practicas-comun.test.js` falló un rato por el reclamo vivo de la tarea 35, que
cambió los valores por defecto de `contador.js`; ya cerrada la 35 (6cfc713), ese fallo
no debería reproducirse)

Los automatismos y las rutas del proyecto están en `proyecto.md`, no aquí: este fichero
se regenera entero y se los llevaría por delante.
