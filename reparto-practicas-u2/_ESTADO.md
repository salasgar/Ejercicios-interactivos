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

Regenerado: 2026-10-07 19:09 UTC · por la sesión s-20261007T184632-fa5a1491 (montaje)

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
| 01 | Base común, panel único del profesor y práctica de plantilla | tareas/tarea-01-base-comun.md | ninguna | 2 h 30 min | ALTO | — | practicas/_comun/, practicas/plantilla/, portada y panel; salidas/01-base-comun/ | PENDIENTE | |
| 02 | Semáforo de divisibilidad (criterios, compuestos, cifra que falta) | tareas/tarea-02-semaforo.md | 01 LISTA | 1 h 30 min | MEDIO | 04 | practicas/semaforo/; salidas/02-semaforo/ | BLOQUEADA | |
| 03 | Divisores por parejas con rectángulos | tareas/tarea-03-rectangulos.md | 01 LISTA | 2 h | MEDIO | — | practicas/rectangulos/; salidas/03-rectangulos/ | BLOQUEADA | |
| 04 | Múltiplos y divisores en la recta (0 y 1, V/F) | tareas/tarea-04-recta.md | 01 LISTA | 1 h 30 min | MEDIO | 02 | practicas/recta/; salidas/04-recta/ | BLOQUEADA | |
| 05 | Criba de Eratóstenes y flashcards primo/compuesto | tareas/tarea-05-criba.md | 01 LISTA | 2 h | MEDIO | — | practicas/criba/; salidas/05-criba/ | BLOQUEADA | |
| 06 | Árbol de factores libre | tareas/tarea-06-arbol.md | 01 LISTA | 2 h 30 min | ALTO | — | practicas/arbol/; salidas/06-arbol/ | BLOQUEADA | |
| 07 | Divisiones sucesivas guiadas | tareas/tarea-07-divisiones.md | 01 LISTA | 2 h | MEDIO | 08 | practicas/divisiones/; salidas/07-divisiones/ | BLOQUEADA | |
| 08 | Fábrica de divisores | tareas/tarea-08-fabrica.md | 01 LISTA | 1 h 30 min | MEDIO | 07 | practicas/fabrica/; salidas/08-fabrica/ | BLOQUEADA | |
| 09 | m.c.d. y m.c.m. con factores primos (Venn) | tareas/tarea-09-venn.md | 01 LISTA | 2 h 30 min | ALTO | — | practicas/venn/; salidas/09-venn/ | BLOQUEADA | |
| 10 | Detector de imposibles | tareas/tarea-10-imposibles.md | 01 LISTA | 1 h 30 min | MEDIO | 08 | practicas/imposibles/; salidas/10-imposibles/ | BLOQUEADA | |
| 11 | ¿m.c.d. o m.c.m.? Clasificador de enunciados | tareas/tarea-11-clasificador.md | 01 LISTA | 2 h | MEDIO | — | practicas/clasificador/; salidas/11-clasificador/ | BLOQUEADA | |
| 12 | Reloj de coincidencias | tareas/tarea-12-reloj.md | 01 LISTA | 2 h | MEDIO | — | practicas/reloj/; salidas/12-reloj/ | BLOQUEADA | |
| 13 | Baldosas y cuerdas | tareas/tarea-13-baldosas.md | 01 LISTA | 2 h | MEDIO | — | practicas/baldosas/; salidas/13-baldosas/ | BLOQUEADA | |
| 14 | Caza el error | tareas/tarea-14-errores.md | 01 LISTA | 2 h | MEDIO | — | practicas/errores/; salidas/14-errores/ | BLOQUEADA | |
| 15 | Léelo en inglés | tareas/tarea-15-leelo.md | 01 LISTA | 1 h 30 min | MEDIO | 16 | practicas/leelo/; salidas/15-leelo/ | BLOQUEADA | |
| 16 | Operar con factorizaciones | tareas/tarea-16-factorizaciones.md | 01 LISTA | 2 h | MEDIO | 15 | practicas/factorizaciones/; salidas/16-factorizaciones/ | BLOQUEADA | |
| 17 | Migrar divisores/ a la base común | tareas/tarea-17-migrar-divisores.md | 01 LISTA; la sesión que editaba divisores/ ha terminado; firma 17 | 1 h 30 min | MEDIO | — | divisores/; salidas/17-migrar-divisores/ | BLOQUEADA | |
| 18 | Revisión final, portada, README y documentación | tareas/tarea-18-revision-final.md | 02-17 LISTAS; firma 18 | 1 h 30 min | ALTO | — | catalogo.js (disponible), portada, README, docs/practicas-unidad2.md; salidas/18-revision-final/ | BLOQUEADA | |

Bandas hoy (de `proyecto.md`, comprobado el 2026-09-20): ALTO = Opus 5, esfuerzo Alto ·
MEDIO = Sonnet 5, esfuerzo Medio · BAJO = Haiku 4.5, esfuerzo Medio (sin tareas BAJO aquí).

Cuántas sesiones caben a la vez: hasta que la 01 esté LISTA, **una**. Después, las tareas
02-16 tocan carpetas disjuntas y pueden ir todas en paralelo (en la práctica, 3 o 4
sesiones). Cadenas sugeridas (misma banda, cortas, independientes): 02+04, 08+10,
15+16, 07+08 (si la 08 no se encadenó con la 10).

## Registro de finalizaciones

Derivado de `hechos/terminadas/`. Una línea por fichero, más reciente arriba.

Formato: `LISTA · tarea NN · AAAA-MM-DD HH:MM · sid · hash del commit · ficheros · duración real`

(vacío todavía)

## Incidencias de coordinación

Derivado de `hechos/incidencias/`.

(vacío todavía)

Los automatismos y las rutas del proyecto están en `proyecto.md`, no aquí: este fichero
se regenera entero y se los llevaría por delante.
