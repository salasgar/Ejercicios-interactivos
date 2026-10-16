# Diseño del modelo de tareas v2 (tarea 45 del reparto PU2)

Sesión `s-20261016T144918-b59b6bef`, 2026-10-16. Decisiones de Juan Luis tomadas en la
conversación de esta sesión el mismo día (dos rondas de preguntas). Cada punto lleva
**[decidido por Juan Luis el 2026-10-16]**, **[propuesta pendiente]** (lo propone esta sesión
y queda aprobado o no con el diseño entero) o **[hecho del código]** (no se decide: es así hoy).

**Aprobado entero por Juan Luis el 2026-10-16** (al final de la conversación, después de
explicarle el apartado C.1). Los puntos marcados **[propuesta pendiente]** quedan aprobados con
el diseño: la etiqueta dice solo que la idea fue de esta sesión y no suya. Si al implementar
alguno resulta mal pensado, la sesión que lo implemente lo propone en su terminada y no lo
cambia por su cuenta.

Lo que cambia, en una frase: cada unidad tiene sus prácticas y sus tareas; una tarea es de
repaso, obligatoria para todos con plazo u obligatoria solo para los alumnos que se marquen
en el panel; el progreso de una tarea es suyo y no se mezcla con el de la práctica libre; y
el retraso de cada entrega queda medido en días.

---

## A. Unidades

1. **Campo `unidad`** (entero) en cada fila del catálogo (`practicas/_comun/catalogo.js`) y
   en cada tarea (`practicas/_comun/tareas.js`). Hoy: ids 0-15 → `unidad: 2`; ids 16-30 →
   `unidad: 1`; la plantilla (31) → `unidad: null` (no sale nunca en la portada).
   **[propuesta pendiente]**
2. **Lista de unidades** en `catalogo.js`:
   ```js
   export const UNIDADES = [
     { n: 1, desde: '2026-09-14', titulo: { es: 'Números naturales, potencias y raíces', en: 'Natural numbers, powers and roots' } },
     { n: 2, desde: '2026-10-13', titulo: { es: 'Divisibilidad', en: 'Divisibility' } },
     { n: 3, desde: '2026-11-16', titulo: { es: 'Números enteros', en: 'Integers' } },
   ];
   ```
   La **unidad actual** es la última cuyo `desde` ya ha llegado: el 16-11 la portada pasa
   sola a la unidad 3, sin tocar nada. Las fechas de la U1 y la U2 de arriba son de relleno
   y hay que confirmarlas al implementar (solo importa la de la unidad 3). Una unidad sin
   prácticas ni tareas publicadas no sale. **[propuesta pendiente]**
3. **Portada**: la unidad actual arriba, abierta, con «Tareas» y debajo «Prácticas»; las
   unidades anteriores debajo, **plegadas** (`<details>`), cada una con sus tareas y sus
   prácticas. Título de cada sección: «Unidad 2 · Divisibilidad» / «Unit 2 · Divisibility»
   (número y nombre). **[decidido por Juan Luis el 2026-10-16]** Que una unidad desplegada
   siga desplegada al volver se recuerda en el navegador (comodidad, nada más).
   **[propuesta pendiente]**
4. **Dentro de «Prácticas» de la unidad 2** se conservan como subtítulos los bloques de hoy
   (`BLOQUES` de `portada.js`: Semana 1…4 y Vocabulario), que ayudan a encontrar; las de la
   unidad 1 van en una lista sin subtítulos. `BLOQUES` gana el campo `unidad`; la sección
   «Repaso de la unidad 1» de `BLOQUES` desaparece (ya es la unidad 1). **[propuesta pendiente]**
5. **Fuera la coletilla** «(repaso de la unidad 1)» / «(unit 1 review)» de los nombres del
   catálogo: la sección ya lo dice. Dos excepciones: `errores1` pasa a llamarse «Caza el
   error» igual que `errores`, y `propiedades` se queda con «(ampliación)» / «(extension)»,
   porque la ampliación tiene que ir marcada. `SIN_COLETILLA` de `portada.js` sobra.
   **[propuesta pendiente]**
6. **Ejercicios de otra unidad dentro de una tarea** (ya funciona; la tarea 1 lleva
   `jerarquia` y `division`): en la página de la tarea, la línea pequeña con el nombre de la
   práctica añade «· repaso U1» / «· U1 review» cuando la unidad de la práctica no es la de
   la tarea. Así se distinguen los dos «Caza el error» de la semana 4. **[propuesta pendiente]**

---

## B. Estados de una tarea

### B.1 Los campos de `tareas.js`

| Campo | Qué es | Hoy |
|---|---|---|
| `unidad` | la unidad a la que pertenece (sección de la portada) | no existe |
| `desde` | opcional, `'AAAA-MM-DD'`: desde ese día la portada la enseña | existe |
| `hasta` | opcional, `'AAAA-MM-DD'`: **plazo, hasta el final de ese día** (hora local) | no existe |
| `asignada` | opcional, `true`: es obligatoria **solo** para los alumnos marcados en el panel | no existe |
| `progresoPorPractica` | `true` solo en la tarea 1 (apartado D) | no existe |

El estado sale de esos campos, sin guardar nada más:

| `asignada` | `hasta` | Para un alumno asignado (o para todos si no es `asignada`) | Para un alumno no asignado |
|---|---|---|---|
| no | no | **repaso**: voluntaria, sin plazo | — |
| no | sí | **obligatoria** hasta el plazo | — |
| sí | sí | **obligatoria para ti** hasta el plazo | **repaso** |
| sí | no | **obligatoria para ti**, sin plazo | **repaso** |

- Los no asignados ven la tarea asignada **como una tarea de repaso más**, sin ninguna marca
  de que otros la tienen obligatoria. **[decidido por Juan Luis el 2026-10-16]**
- Un único plazo por tarea, el de `tareas.js`, para todos los asignados (sin plazos por
  alumno). **[decidido por Juan Luis el 2026-10-16]**
- El título de una tarea asignada no dice nunca «refuerzo» ni nada que señale a quien la
  tiene: la ven todos. **[propuesta pendiente]**
- `erroresTareas` (y por tanto `npm test`) comprueba además: `unidad` existe en `UNIDADES`;
  `hasta` con formato válido y no anterior a `desde`; `asignada` solo `true` o ausente;
  `progresoPorPractica` solo en la tarea 1 (y la tarea 1 no puede perderlo). **[propuesta pendiente]**
- Plazos de las tareas que ya existen: tarea 1 `hasta: '2026-10-22'` (el de Classroom); las
  2, 3 y 4, el jueves de su semana, como la 1: `'2026-10-29'`, `'2026-11-05'` y `'2026-11-12'`.
  **[decidido por Juan Luis el 2026-10-16]**

### B.2 Plazo y retraso

Lo que haga el alumno después del plazo **sigue contando**; lo terminado después del plazo
sale marcado **«fuera de plazo»** y se registra **cuántos días de retraso** pasaron hasta
que la entregó (o hasta hoy, si aún no la ha entregado). Al final de cada evaluación se
analizarán las estadísticas de retrasos y se decidirá un criterio para calificar las tareas
con retraso: cuanto más retraso, peor nota. **[decidido por Juan Luis el 2026-10-16]**

Cómo se mide (todo con el `dia` que ya guarda la base al terminar un ejercicio; días
contados desde el 1-9-2026, `contador.js`): **[propuesta pendiente]**

- **Entregada** = cumplida (todos los ★ y al menos `nElegir` de los de elegir terminados).
- **Día de entrega** = el día en que se cumplió por primera vez: el mayor de (el último ★
  terminado, el `nElegir`-ésimo de elegir terminado, por orden de día). Hoy `estadoTarea`
  da el día del **último** ejercicio terminado, que no es lo mismo si el alumno siguió
  haciendo ejercicios de elegir después de cumplirla: `estadoTarea` gana `diaEntrega`.
- **Días de retraso** = días naturales entre el plazo y el día de entrega (0 si se entregó a
  tiempo). Sin entregar y pasado el plazo: días entre el plazo y hoy, «y subiendo».
- **Por ejercicio**: «fuera de plazo» si su `dia` es posterior al plazo.
- Se cuentan **días naturales**. El CSV lleva además las fechas (plazo y entrega), para que
  al decidir el criterio se puedan contar días lectivos si se prefiere.

Qué se ve:

- **El alumno** (página de la tarea y portada): antes del plazo, «Plazo: jueves 22-10»;
  pasado el plazo sin entregar, «Fuera de plazo · 3 días de retraso»; entregada tarde,
  «Entregada con 3 días de retraso»; a tiempo, «✓ Entregada». Que el alumno vea los días:
  **[decidido por Juan Luis el 2026-10-16]**; las frases exactas, **[propuesta pendiente]**.
- **El panel**, en «Tareas de la semana»: cada celda añade el retraso («★ 6 de 6 · 4 de 4 ·
  100 pt · 2 d tarde»); el CSV, por tarea: plazo, fecha de entrega, días de retraso y estado
  (a tiempo / con retraso / sin entregar). **[propuesta pendiente]**
- **Una vista nueva del panel, «Retrasos»**, para el análisis de final de evaluación: por
  alumno, cuántas tareas con plazo tenía, cuántas entregó a tiempo, cuántas con retraso,
  cuántas sin entregar, días de retraso en total, la media y el máximo; y por tarea, cuántos
  la entregaron a tiempo y con cuántos días los demás. Con su CSV. Solo cuenta, para cada
  alumno, las tareas que eran obligatorias para él. **[propuesta pendiente]**

### B.3 La asignación a alumnos concretos

- **Dónde se decide**: en el panel, una tabla de alumnos (los nombres de la lista del panel)
  por tareas `asignada`, con **casillas**; botón «Guardar asignaciones».
  **[decidido por Juan Luis el 2026-10-16]**
- **Dónde se guarda**: en Firestore, no en el repositorio (que es público): un documento por
  alumno, `practicas-asignaciones/<código>`, con `{ tareas: [7, 9], actualizado }`. Lo escribe
  solo el profesor (con su cuenta, desde el panel); el alumno lo lee con `get` (como su
  progreso), nunca con `list`. **[propuesta pendiente]**
- **Lo que protege y lo que no** **[hecho del código]**: el código de cada alumno sale de su
  número de lista con `codigoAlumno` (`codigos.js`, en el repositorio público), así que quien
  sepa programar puede calcular los 51 códigos y leer, sin cuenta, el progreso de cada número
  de lista. Es lo que hace hoy `herramientas/informe-actividad.mjs`. Las asignaciones quedan
  igual de expuestas que el progreso: sin nombres, por número de lista. Por eso el título de
  una tarea asignada no puede delatar nada (B.1). Esconderlo de verdad exige que los alumnos
  tengan cuenta, que es justo lo que estas prácticas evitan.
- **Cómo lo lee la app**: la portada y la página de la tarea, al entrar con el código, leen
  ese documento (como mucho 4 s, como la nube) y lo copian en el navegador; sin red, se usa
  la copia. Si no hay ni red ni copia, la tarea asignada sale como repaso (la tarea de
  Classroom sigue diciéndole al alumno que es para él). **[propuesta pendiente]**
- El panel, en «Tareas de la semana» y en «Retrasos», muestra a los no asignados de una tarea
  asignada con «—» (o su avance voluntario en gris), y no los cuenta. El informe diario, igual.
  **[propuesta pendiente]**

---

## C. Progreso por tarea

**La tarea y la práctica libre van por separado del todo**: un ejercicio terminado dentro de
una tarea **no** sale como hecho en la práctica libre, y lo hecho en la práctica libre **no**
cuenta para una tarea (salvo en la tarea 1, apartado D). Se puede hacer dos veces el mismo
ejercicio sin que la una sepa de la otra. **[decidido por Juan Luis el 2026-10-16]**

### C.1 Dónde se guarda **[decidido por Juan Luis el 2026-10-16, a propuesta de esta sesión]**

**Aprobado por Juan Luis el 2026-10-16: un documento por alumno, tarea y práctica**, en una **colección nueva**
`practicas-tareas/t<id>--<slug>--<código>` (por ejemplo `practicas-tareas/t2--semaforo--K7QM`),
con **exactamente el formato** de los de `practicas/` (`estado`: JSON `{ v, idioma, ej }`, con
`ej` la lista de ejercicios **de la práctica**, posición = número de ejercicio − 1;
`actualizado`). En el navegador, la clave `practicas.v1.<slug>.<código>.t<id>`.

Por qué así:

- La base, la fusión entre aparatos (`nube.js`: `fusionarProgreso`, el tope, `subirFusionado`)
  y la migración de cada ejercicio (`migrarProgreso` con los parámetros de **su** práctica)
  se quedan como están: lo único que cambia es el nombre del documento y de la clave. Es lo
  que menos riesgo tiene con 51 alumnos dentro.
- **Colección aparte y no dentro de `practicas/`** **[hecho del código]**: el panel de hoy lee
  la colección `practicas` partiendo el id por `--` (`leerDocumentos` de `resultados.js`), así
  que un `semaforo--K7QM--t2` metido ahí se leería como progreso de práctica libre y lo
  mezclaría. Con colección aparte, ni el panel viejo ni las reglas viejas se enteran.
- El prefijo `practicas-` evita confundirla con la colección `tareas/` y con
  `alumnos/*/progreso/` de la aplicación con cuentas, que ya existen en las mismas reglas
  **[hecho del código]**.
- Coste: la página de una tarea lee un documento por práctica distinta de la tarea (hasta 8
  hoy), lo mismo que ya hace. Unos 51 × 4 × 8 ≈ 1600 documentos por unidad: nada para Firestore.

Alternativa (la de la ficha): un documento por alumno y tarea, `practicas-tareas/t<id>--<código>`,
con `ej` indexado por la posición en la tarea (★ primero, luego los de elegir). Una sola
lectura por tarea en vez de ocho, pero la base tendría que traducir «ejercicio n de la
práctica s» a «posición p de la tarea» al cargar, al guardar y al fusionar; los 14 ejercicios
de una tarea rozan el tope de 4000 caracteres de la regla actual, y un fallo de esa traducción
mezclaría ejercicios de prácticas distintas. Se descarta salvo que Juan Luis prefiera menos
lecturas a menos código.

Y la que ya descartaba la ficha: guardar las tareas dentro del documento de la práctica
(`estado.tareas`). Complica la fusión y obliga a cambiar los documentos de `practicas/`, que
son los de la tarea 1 en curso.

### C.2 Qué hace la base **[propuesta pendiente]**

- Abierta con `?ejercicio=n&semana=<id>` de una tarea v2 (sin `progresoPorPractica`), la base
  trabaja en el **ámbito de esa tarea**: carga, guarda, lee y sube el documento de la tarea, no
  el de la práctica. El idioma fijado sigue siendo del alumno (no de la tarea).
- **Comprobación**: si el ejercicio `n` de esa práctica no está en la tarea `<id>` (enlace
  tocado a mano), se ignora `semana` y se abre en práctica libre.
- En el ámbito de una tarea **no se enseña nunca el menú de la práctica**: al salir o al
  terminar se vuelve a la tarea (ya lo hace hoy). Repetir un ejercicio ya terminado en la
  tarea funciona como hoy (modo práctica, solo suma `repeticiones`).
- **Sin avisos sobre lo hecho fuera de la tarea.** **[decidido por Juan Luis el 2026-10-16]**
  Sus palabras: al entrar en una tarea, el alumno tiene que hacer los puntos que le pide la
  tarea (100) con sus ejercicios obligatorios, los haya hecho o no en otra tarea, y algunos de
  los voluntarios; que antes hiciera o no un ejercicio no afecta en nada a la tarea, y no hay
  que avisarle de que ya lo hizo ni de que tenía que haberlo hecho en una tarea anterior. (Esta
  sesión había propuesto un aviso en la práctica libre; queda descartado.)
- **Para practicar más**, el alumno vuelve a entrar en una tarea que ya ha hecho y repite
  ejercicios, aunque no le cuente en la nota: es lo que ya hace hoy «Repetir» (modo práctica,
  solo suma `repeticiones`). **[decidido por Juan Luis el 2026-10-16]**
- **Tareas sin voluntarios**: una tarea puede ser solo de obligatorios (por ejemplo, 10 ★ y
  `nElegir: 0`, 100 puntos). **[decidido por Juan Luis el 2026-10-16]** Ya lo admite
  `erroresTareas` **[hecho del código]**: hasta 10 ★, `elegir` vacío y `nElegir: 0`.
- **Tareas de repaso** (voluntarias u obligatorias) de ciertos contenidos: repasar una unidad
  antes de su examen final, o lo que muchos fallaron en un examen. Son tareas como las demás
  (B.1), con la unidad que toque y ejercicios de cualquier unidad.
  **[decidido por Juan Luis el 2026-10-16]**
- **Registro de fallos**: cada fallo hecho dentro de una tarea lleva `tarea: <id>` (también en
  la tarea 1). El panel puede filtrar «qué falla más» por tarea con datos de la tarea y no
  de la práctica.

---

## D. Migración y publicación

- **La tarea 1 se queda con el modelo de hoy para siempre**: `progresoPorPractica: true`. Su
  progreso sigue en `practicas/<slug>--<código>`, lo hecho en la práctica libre le sigue
  contando, y el panel y el informe la leen como hoy. Los enlaces `semana.html?t=1&c=<código>`
  y `semana.html?t=1` no cambian. **[propuesta pendiente]** (la ficha ya lo proponía).
- Las tareas 2, 3 y 4 de la U2 y todas las nuevas usan el modelo v2 desde el principio.
  Ninguna se ha enseñado aún a los alumnos (sus `desde` son 26-10, 2-11 y 9-11), así que no
  hay nada que migrar.
- **Se publica lo antes posible, aunque sea antes del jueves 22-10, sin tocar la tarea 1.**
  **[decidido por Juan Luis el 2026-10-16]** (Sustituye a la ventana del vie 23 al dom 25 que
  dejó escrita la coordinadora.)
- Consecuencia para la implementación **[propuesta pendiente]**: cada commit a `main` se
  publica solo (GitHub Pages), así que **cada tarea de implementación deja la tarea 1
  funcionando como hoy** al cerrar, y lo comprueba con un test (la tarea 1 lee de
  `practicas/`, cuenta lo de la práctica libre y su código de resultado no cambia). Las tareas
  2-4 no se ven en la portada hasta su `desde`, así que un estado intermedio no lo nota ningún
  alumno salvo que tenga el enlace.
- **Orden de publicación**: primero las reglas de Firestore (las publica Juan Luis a mano en la
  consola), después el código que las usa. Al revés, la app escribiría en una colección que las
  reglas no permiten y el alumno perdería el progreso en la nube (no en el navegador).
- **Prueba antes de publicar**: con códigos de prueba (números de lista que no son de ningún
  alumno, por ejemplo del 60 al 63), una tarea de prueba con id alto y `desde` lejano, en dos
  aparatos.

---

## E. Lo que cambia alrededor

| Pieza | Cambio |
|---|---|
| `firestore.rules` | Dos bloques nuevos: `practicas-tareas/{doc}` (id `^t[0-9]{1,4}--[a-z0-9-]+--[A-HJ-NP-Z2-9]{4}$`, mismas comprobaciones que `practicas/`: `get` por id, `create/update` con `estado` texto `< 4000` y `actualizado` entero; `read` del profesor) y `practicas-asignaciones/{codigo}` (id del código; `get` cualquiera; `read` y `write` solo el profesor; `tareas` lista de enteros, `actualizado` entero). En `fallos/`, el campo opcional `tarea` (entero 1-1023) en `hasOnly` |
| `src/firebase.js` | Listar `practicas-tareas` y `practicas-asignaciones`; guardar una asignación (SDK, con la cuenta del profesor) |
| `practicas/_comun/nube.js` | Las funciones de lectura y escritura reciben la colección y el id del documento (por defecto, `practicas` y `<slug>--<código>`, para no romper nada); una lectura sencilla para la asignación |
| `practicas/_comun/catalogo.js` | `unidad` en cada fila, `UNIDADES`, nombres sin coletilla (A) |
| `practicas/_comun/tareas.js` | `unidad`, `hasta`, `asignada`, `progresoPorPractica`; `estadoTarea` con `diaEntrega`; función pura del estado de plazo (`estadoPlazo`: repaso / obligatoria / obligatoria para ti / fuera de plazo, días de retraso); comprobaciones nuevas en `erroresTareas`; `tareasPublicadas` por unidad |
| `practicas/_comun/base.js` | Ámbito de tarea (C.2), `tarea` en los fallos |
| `practicas/_comun/registro.js` | Campo `tarea` en `datosFallo` y en el filtro de `leerFallos`/`agruparFallos` |
| `practicas/_comun/textos.js` | Frases de plazo, retraso, «obligatoria para ti», títulos de unidad (es/en) |
| `practicas/_comun/codigos.js` | **Sin cambio de formato**: `codigoTarea` sigue en versión 1. Su campo `dia` pasa a llevar el día de entrega (`diaEntrega`), que coincide con el de hoy salvo si se siguió después de cumplirla. Lo de la tarea 47 (fuera el código por práctica) no se toca |
| `practicas/semana.js`, `semana.html` | Lee el progreso v2 (documentos de la tarea) salvo en la tarea 1; plazo y retraso; lee la asignación |
| `practicas/portada.js`, `index.html` | Por unidades (A); estado de cada tarea (B); lee la asignación |
| `practicas/profesor.{js,html}`, `practicas/resultados.js` | Lee `practicas-tareas`; `juntarTareas` usa los documentos de la tarea en las v2 y los de práctica en la 1; retraso en «Tareas de la semana»; vista «Retrasos»; sección «Asignar tareas»; «qué falla más» por tarea con el campo `tarea` |
| `herramientas/informe-actividad.mjs` | Lee los documentos de la tarea si es v2; cuenta solo a los asignados en las `asignada`; días de retraso; sin `--tarea`, la tarea obligatoria vigente por fecha (así la rutina diaria no se queda leyendo la tarea 1). La rutina en la nube usa el script de `main`: no hay que tocarla si no pasa `--tarea` fijo |
| `docs/practicas-unidad2.md`, `README.md` | El modelo nuevo; la tarea 1 como excepción |

Nota sin decisión: el `dia` de `contador.js` se guarda en 10 bits desde el 1-9-2026, así que
llega hasta junio de 2029. Vale para este curso y el que viene; para más, hay que moverle el
origen. **[hecho del código]**

---

## F. Tareas de implementación

Para que la coordinadora las dé de alta tal cual. Números provisionales **I1-I7**: si no hay
otras altas entretanto, serán la **49-55**. Todas dejan la tarea 1 funcionando como hoy al
cerrar (D) y lo comprueban con un test. Las que tocan `practicas/_comun/base.js` o `textos.js`
van en serie entre sí y después de la 47 (en curso, toca `base.js`, `catalogo.js`, `codigos.js`,
`textos.js`, el panel, `resultados.js`, `semana.html`, README y docs).

| # | Tarea | Ficheros que toca | Banda | Duración | Precondición | En paralelo con |
|---|---|---|---|---|---|---|
| I1 | **Reglas y acceso a datos**: los dos bloques nuevos y el campo `tarea` de `fallos` (E); funciones de `src/firebase.js`. Atendida: Juan Luis publica las reglas en la consola y la sesión comprueba con REST que un `get` y un `create` de prueba pasan y un `list` no | `firestore.rules`, `src/firebase.js` | ALTO | 45 min | ninguna | 47, I2 |
| I2 | **Modelo de datos**: `unidad` y `UNIDADES` en el catálogo y nombres sin coletilla; en `tareas.js` los campos de B.1, `diaEntrega`, `estadoPlazo`, `erroresTareas` y los plazos; `nube.js` con colección e id de documento como parámetro y la lectura de la asignación. Solo funciones puras y datos, con sus tests; nadie las usa todavía | `practicas/_comun/{catalogo,tareas,nube}.js`, `tests/practicas-{semana,nube,comun}.test.js` | MEDIO | 1 h 30 min | 47 LISTA | I1 |
| I3 | **Base: ámbito de tarea**: C.2 entero (documento y clave de la tarea, comprobación del ejercicio, sin menú), `tarea` en el registro de fallos, frases nuevas | `practicas/_comun/{base,registro,textos}.js`, `tests/practicas-{comun,registro}.test.js` | ALTO | 2 h | I1 (reglas publicadas) y I2 LISTAS | I5, I6 |
| I4 | **Página de la tarea y portada por unidades**: `semana.js` v2 (salvo tarea 1), plazo, retraso y asignación en la página y en la portada; portada por unidades plegables (A) | `practicas/{semana.js,semana.html,portada.js,index.html}`, `practicas/_comun/textos.js`, `tests/practicas-semana.test.js` | MEDIO | 2 h | I3 LISTA (comparte `textos.js` y el test de la semana) | I5, I6 |
| I5 | **Panel**: lectura de `practicas-tareas`, `juntarTareas` v2, retraso en «Tareas de la semana», vista «Retrasos» con CSV, sección «Asignar tareas» con casillas, «qué falla más» por `tarea` | `practicas/{profesor.js,profesor.html,resultados.js}`, test nuevo `tests/practicas-resultados.test.js` | MEDIO | 2 h 30 min | I1 e I2 LISTAS | I3, I4, I6 |
| I6 | **Informe diario**: documentos v2, asignadas, retraso, tarea vigente por defecto | `herramientas/informe-actividad.mjs`, `tests/herramientas-informe.test.js` | MEDIO | 1 h | I2 LISTA | I3, I4, I5 |
| I7 | **Revisión de extremo a extremo y documentación**: con códigos de prueba y dos aparatos (o dos navegadores), una tarea de prueba v2 y la tarea 1: progreso separado, fusión entre aparatos, repetir dentro de una tarea hecha, plazo y retraso, asignación de punta a punta (panel → alumno), panel y CSV, informe. Veredicto contra estos criterios y hallazgos fuera de criterio aparte. Después, `docs/practicas-unidad2.md` y `README.md` | `docs/practicas-unidad2.md`, `README.md`; salida con el veredicto | ALTO | 1 h 30 min | I3, I4, I5 e I6 LISTAS | — |

Encadenables: I2 → I6 (misma banda, cortas). Con la 47 cerrada caben a la vez I1 e I2; tras
ellas, I3, I5 e I6 a la vez; I4 después de I3; I7 al final. La duración de las fichas, como
en todo el reparto, es holgada: las últimas tareas se han cerrado en la mitad o menos.

Lo que **no** entra en estas tareas: las tareas de la unidad 1 (las propone la tarea 46 y,
aprobadas, se añaden a `tareas.js` con `unidad: 1` después de I2) y las prácticas de la
unidad 3 (otro reparto).
