# Coordinación de los tres materiales de cada unidad

Escrito el 2026-09-13, a petición de Juan Luis, para dejar fijada una decisión de
organización que afecta a este repositorio y a la carpeta de apuntes de iCloud.

## La idea

Este proyecto arrancó como una aplicación web de ejercicios autocorregibles. Alrededor
de ella han crecido dos materiales más para la misma asignatura (1.º ESO bilingüe), y
los tres viven en el mismo proyecto porque se retroalimentan:

| Material | Qué es | Dónde vive |
|---|---|---|
| **App web** | Ejercicios de opción múltiple generados al azar, con feedback por error y refuerzo automático. Este repositorio | `src/ejercicios/*.js`, publicada en GitHub Pages |
| **Exámenes tipo test y práctica** | Por semana: un examen en clase de 4 versiones (más una extra) y 4 versiones de práctica (8 en las semanas 1 a 3 de la unidad 1) con el mismo formato, en LaTeX (ver abajo) | iCloud: `apuntes-1eso-bilingue/<N>. <Unidad>/exámenes-semanales/semana-<N>/` |
| **Hojas de ejercicios** | Una hoja por semana de ejercicios abiertos, en tres niveles (L1, L2, L3), en LaTeX | iCloud: `apuntes-1eso-bilingue/<N>. <Unidad>/hojas-de-ejercicios/` |

**Cambio del 2026-09-17.** Los 20 cuestionarios por semana que se habían planificado
(`cuestionarios/PLAN-DE-ACTUACION.md`) se sustituyen por el paquete semanal de más abajo. De
aquel plan siguen valiendo, como fuentes, las salidas de su fase común
(`cuestionarios/comun/reparto/salidas/`): el banco de preguntas validadas, el inventario
único, los casos de operaciones combinadas y el verificador. Los repartos semanales de
cuestionarios no se llegan a montar.

Sí, es adecuado que vivan juntos, con una condición: **la coordinación es por
documentos con identificadores, no por sesiones que se hablen**. Cada sesión de Claude
Code trabaja en un solo material y no ve a las demás; lo único que comparten es lo que
está escrito en disco. Por eso hace falta una columna vertebral común.

## La columna vertebral: la secuenciación y el inventario único

Para cada unidad hay dos documentos que mandan sobre los tres materiales:

1. **La secuenciación** (`<Unidad>/secuenciación-unidadN.tex`): qué se enseña cada
   semana, en qué orden y con qué hilos transversales. Para la unidad 1: cuatro semanas,
   y el hilo de operaciones combinadas con dificultad creciente desde la semana 1.
   **Ningún material puede usar un contenido antes de la semana en que se enseña.**
2. **El inventario único de la unidad** (`<Unidad>/cuestionarios/comun/reparto/salidas/06-reserva/inventario-unidad1.tsv`
   cuando exista; lo produce la fase común del reparto de cuestionarios): una fila por
   destreza evaluable, con identificador `<semana><parte>-<nn>` (por ejemplo `1B-03`,
   `3C-12`, `2A-05`), descripción en español e inglés, dificultad, semana en que se
   enseña, fuente en la secuenciación y número de casos concretos disponibles.

Los tres materiales **citan esos identificadores**:

- Los exámenes y la práctica, en el campo `item` de cada posición de su generador
  (`generar.py`), que la clave de cada semana imprime.
- Las hojas de ejercicios, en un comentario `% 1C-04` delante de cada ejercicio.
- La app, en un campo `items: ['1A-01', '1A-03']` de cada generador (o de cada
  subtipo, donde un generador cubra varias destrezas).

Con eso se puede responder con un `grep` a «¿qué material practica la destreza `2C-07`?»
y a «¿qué destrezas de la semana 3 no tienen ningún ejercicio en la app?».

## Flujos de retroalimentación

| De | A | Qué pasa |
|---|---|---|
| Banco de 480 preguntas validadas, exámenes y práctica | Hojas | Se usan tal cual o se convierten en ejercicios abiertos («calcula y explica», «di qué opción es falsa y por qué») |
| Casos concretos calculados con `assert` (`casos-A.tsv`) y generadores de los exámenes | App | Son la especificación de un generador: rangos, condiciones (divisiones exactas, radicandos cuadrados perfectos), lo que la app calcula al azar |
| Catálogo de distractores con «por qué es falso» y soluciones explicadas de los exámenes | App | Son los mensajes de feedback por error de la app; el error que explica cada distractor es el `concepto` del refuerzo |
| App (`lenguaje_ingles.js`, `lenguaje_espanol.js`: listas de errores típicos) | Exámenes y práctica | Son la fuente de los distractores de la parte de lenguaje |
| App (resultados por concepto, CSV) | Secuenciación y hojas | Qué destrezas fallan más orienta qué se refuerza en la hoja de la semana siguiente |
| Hojas (retos L3) | Exámenes y práctica | Un reto bien planteado da varios casos concretos de una pregunta difícil |

Regla común a los tres: **todo distractor y toda respuesta modelo tienen que ser
inequívocamente correctos o falsos** (la regla de oro de `CLAUDE.md` y del memorándum
de pruebas tipo test). Un material que falla ahí contamina a los otros dos.

## Estado de la app respecto a la unidad 1

Tipos que ya existen y a qué semana de la secuenciación de la unidad 1 corresponden:

| Tipo | Semana | Observación |
|---|---|---|
| `lenguaje_ingles`, `lenguaje_espanol` | 1 (números), 2 (operaciones), 3 (potencias y raíces) | Cubren las preguntas de lenguaje de los exámenes; falta etiquetar cada subtipo con su semana |
| `jerarquia` | 1 a 4 (hilo de operaciones combinadas) | Hace falta poder pedir el **nivel**, que lo marca el número de operaciones (decisión 5 del 2026-09-14): semana 1, exactamente 2, ya con potencias sencillas y raíces exactas, que vieron en Primaria; semana 2, hasta 3; semana 3, hasta 4, con la raya de fracción; semana 4, hasta 5, con anidados |
| `potencias` | 3 | El exponente negativo y cero es de 2.º ESO; en 1.º solo exponentes naturales |
| `raices` | 3 | Raíz exacta y raíz entera con resto |

Generadores que **faltan** para cubrir la unidad 1 (backlog, en orden de la
secuenciación; no se hacen en esta fase):

1. Valor posicional: valor de una cifra, descomposición polinómica, escribir con cifras un
   número con ceros interiores, construir el mayor o el menor número con condiciones.
2. Redondeo y estimación: redondear a un orden dado, estimar un producto o una suma,
   diferencia entre la estimación y el valor exacto.
3. División con cociente y resto, y la prueba de la división (elegir la comprobación
   correcta; detectar un resto mayor que el divisor).
4. Propiedades de las operaciones: reconocer la propiedad aplicada, sacar factor común,
   contraejemplos de la conmutativa y la asociativa.
5. Cálculo mental: compensación y descomposición (elegir la estrategia correcta).
6. Problemas de enunciado: elegir la expresión que modela el problema; paréntesis
   imprescindible; interpretar el resto.

Y una función nueva de la app que da sentido a todo lo anterior: **la tarea semanal**,
que el profesor crea eligiendo una semana de una unidad y que reúne los generadores cuyos
`items` pertenecen a esa semana o a semanas anteriores, con el nivel de jerarquía que le
corresponde.

## El paquete de cada semana

Decidido por Juan Luis el 2026-09-17. Para cada semana de la unidad hace falta:

1. **Inventario** de los contenidos de la semana (extracto del inventario único) y un PDF
   adaptado para los alumnos, a modo de lista de «sé hacerlo», sin casos de examen.
2. **Examen en clase**: 4 versiones de 20 preguntas tipo test (`.tex` y PDF), con el
   **orden de las preguntas barajado** en cada versión. Folio a doble cara con franja
   recortable de respuestas; la infografía del procedimiento sirve para todo el curso.
3. **Examen resuelto** (`.tex` y PDF), para Classroom **después** del examen (los dos grupos lo
   hacen el mismo día): cruces, opción correcta y **explicación de cada opción**.
4. **Versión extra** del examen, con su resuelto, para quien falte.
5. **Tabla de claves** de todas las versiones, para corregir.
6. **Cuestionarios** (hasta el 2026-09-20 se llamaban «práctica»; los ficheros ya hechos
   conservan el nombre `practica-semanaN.*`, y la carpeta `cuestionarios/` de la unidad 1 es el
   plan antiguo, que se conserva como banco de ejercicios): **4 versiones** con el mismo formato, que entre las cuatro cubren el inventario
   de la semana, también con el orden barajado para que no se aprenda la plantilla. Un PDF con
   las 4 y otro con sus soluciones explicadas; se suben el lunes avisando de que son los
   contenidos de la semana. (Decisión de Juan Luis del 2026-09-20: las semanas 1 a 3 de la
   unidad 1 se hicieron con 8, en dos bloques de 4; desde entonces se hacen 4 y, **solo si los
   alumnos piden más**, se produce un segundo bloque de otras 4.)
7. **Hoja de ejercicios** abiertos (L1/L2/L3) con **solucionario explicado** para alumnos.
8. **Vocabulario**: glosario completo en PDF y diapositiva 16:9 para la pizarra, solo con
   términos de las 4 versiones del examen.

Calendario: clases los lunes, martes, jueves y viernes, con los dos grupos seguidos (no
hay tiempo para pasarse las preguntas). El examen tipo test es **el viernes** y el paquete de la
semana se sube a Classroom **el sábado anterior**. **Todas las semanas de todas las unidades tienen su examen tipo test**,
también la última (decisión de Juan Luis del 2026-09-20): se produce siempre, y es él quien
decide después si lo usa o si esa semana solo hace el **examen de preguntas abiertas** de la
unidad, que pesa bastante más en la nota. La corrección con app (ZipGrade) está pendiente de una prueba.

Puntuación del examen: acierto $+1$, fallo $-1/(N-1)$ ($-1/3$ con 4 opciones), en blanco 0; la
nota nunca baja de 0. Duración: 55 minutos de clase, unos 50 efectivos. Las pruebas semanales
pesan poco en la nota: tras el primer examen se revisa el acierto por pregunta y por versión
para mejorar el material, sin exigir equivalencia exacta.

## Añadidos al paquete y a la unidad (decisiones del 2026-09-20)

La lista completa de lo que se produce en una unidad, con las lecciones de la unidad 1, está en
`…/apuntes-1eso-bilingue/comun/LECCIONES-Y-LISTA-DEL-PAQUETE.md`: **es lo primero que lee una sesión
que vaya a producir material.** Lo que ese día se añadió a lo de arriba:

- **Refuerzo**: sin regla fija; cada semana se decide, con los resultados de la anterior, qué se
  refuerza ya (lo que es requisito de lo que viene) y qué espera a un repaso antes del examen
  final. Por bloques de destreza; cada alumno hace solo los que falló.
- **Versiones adaptadas a dislexia** del examen semanal y, sobre todo, del examen final. Los
  alumnos con dislexia **pueden usar calculadora** en los exámenes.
- **Versión de recuperación** del examen final (los dos modelos ya están comprometidos: examen y
  ejemplo).
- **Mini-test de vocabulario el lunes**, 5 minutos con la app: necesita los subtipos de
  `lenguaje_ingles` etiquetados por semana.
- **Hoja de la unidad para el alumno**, al empezar: por semanas, solo las destrezas nucleares.
- **Itinerario mínimo ★** en cada hoja de ejercicios, desde la unidad 2.
- **Informe de resultados por destreza** al cerrar la unidad, cuando estén corregidas las semanas.

## El inglés de los enunciados

Decisión de Juan Luis del 2026-09-20, a raíz de la pregunta del «smallest **even** number» del
examen de la semana 1 (12 % de aciertos con *even* en negrita y en el glosario: midió vocabulario
y no valor posicional). Vale para todas las unidades:

- **En los exámenes, el lenguaje tiene que ser sencillo**: enunciados cortos, que se entiendan
  sin un vocabulario amplio (el básico y el de la unidad). Es donde hay que estar más atento.
- **La palabra no matemática de la que depende la respuesta se aclara en el propio enunciado**,
  entre paréntesis: «(*even number* = número par)». No se aclara lo que la pregunta evalúa.
- **En los cuestionarios de práctica y en las hojas** también se procura un lenguaje sencillo,
  pero no pasa nada si algún ejercicio lo tiene algo más complejo: en casa pueden traducirlo.
- En la app, lo mismo que en los exámenes: el alumno contesta sin ayuda.

## Cómo llega cada material a los alumnos

Decisiones de Juan Luis del 2026-09-17:

- **Hojas de ejercicios**: impresas a doble cara (por eso cada hoja ocupa **exactamente dos
  páginas**; no deben crecer) y además subidas a Classroom.
- **Soluciones de las hojas**, con las explicaciones paso a paso: **solo en Classroom**, para
  no gastar papel (ocupan 6-7 páginas por semana).

Qué es obligatorio y cómo se usa cada cosa (Juan Luis, 2026-09-20), para que el volumen no
engañe:

- **Lo único obligatorio es la hoja de ejercicios semanal** (los ejercicios abiertos).
- **Los cuestionarios de práctica son voluntarios.**
- **Del examen resuelto explicado, a cada alumno le basta con leer las preguntas que falló.**
  Por eso puede ser largo (24 páginas) sin ser una carga: es material de consulta, con enlaces
  por código de versión.
- **Pendiente**: comprobar cuánto de todo ese material usan de verdad los alumnos, antes de
  ampliarlo.

## Lo que se practica pero no se evalúa

Contenidos que aparecen en las hojas o en sus soluciones como **ampliación para los alumnos
más aventajados**, y que **no pueden aparecer en los exámenes semanales ni en sus versiones
de práctica** (y tampoco conviene que la app los exija):

| Contenido | Dónde aparece | Qué sí entra en el examen |
|---|---|---|
| La regla general **«el resto de una raíz entera es como mucho $2\times$ raíz»** | Soluciones de la semana 3, ejercicio 12 | La destreza `3C-22` solo en su forma concreta: comprobar que con un resto demasiado grande se llega al cuadrado siguiente (raíz 4 y resto 9 da $16+9=25=5^2$, así que la raíz era 5). Nunca la fórmula general. |

## La tercera línea: adaptación al perfil de cada alumno

Queda registrada como objetivo del proyecto, **sin diseñar todavía**. Lo que ya existe
apunta en esa dirección (refuerzo automático por concepto fallado, resultados por
alumno y concepto). Cuando se diseñe, la unidad de adaptación debería ser el
identificador del inventario: «este alumno falla `1A-03` y `2C-07`» es lo que permite
elegir qué generar, qué hoja recomendar y qué preguntas del banco poner en su repaso.

**Idea de Juan Luis, 2026-09-18, apuntada para otra sesión (sin diseñar ni implementar):**
todo el material que se está generando para las unidades (exámenes semanales de 4+1
versiones, sus 8 versiones de práctica, las hojas de ejercicios L1/L2/L3 con solucionario,
el banco de 480 preguntas validadas, `casos-A.tsv` y el catálogo de distractores) es, a la
vez que material de clase, **un banco de ejercicios para la app**: cada pregunta o ejercicio
ya viene con su identificador del inventario, su explicación por opción o por paso, y (en el
caso de las preguntas tipo test) su distractor con el error concreto que corrige. Eso es
justo la materia prima que le falta a un generador de la app para cubrir una destreza nueva
sin inventar el ejercicio desde cero (ver la tabla «Flujos de retroalimentación» más arriba,
que ya apunta esto para las hojas; la idea es extenderlo a todo el material, no solo a las
hojas).

Sobre esa base, la app podría dar un paso más allá del refuerzo actual (que solo repite el
mismo tipo de ejercicio tras un fallo, hasta 6 veces): a partir del histórico de aciertos y
fallos de cada alumno por destreza (identificador del inventario), **personalizar** tres
cosas a la vez:
- **El feedback**: no solo el mensaje fijo del distractor concreto, sino elegir, entre las
  explicaciones ya escritas para esa destreza (soluciones de examen, de hojas, «Cómo se
  hace»), la que mejor corresponda al error que ha cometido esta vez.
- **La enseñanza**: si un alumno falla una destreza de forma sostenida (no un fallo suelto),
  ofrecerle la explicación del contenido (el «Cómo se hace» o el recuadro «¡Ojo!» de la hoja
  o del examen resuelto correspondiente a esa destreza) antes de darle más ejercicios de lo
  mismo, en vez de limitarse a repetir.
- **Los ejercicios propuestos**: elegir el siguiente ejercicio (de qué destreza, de qué
  dificultad) en función de qué está fallando o dominando ese alumno en concreto, tirando del
  banco de todos los materiales y no solo del generador aleatorio de su tipo.

Nada de esto se ha diseñado: falta decidir, entre otras cosas, cómo pasar preguntas en LaTeX
(exámenes, hojas) al formato de generador de la app (¿un tipo nuevo por destreza, un `banco`
de preguntas fijas en vez de generadas al azar, o un generador que parametriza los casos ya
validados de `casos-A.tsv`?), qué guardar en Firestore para el histórico por destreza y
alumno (ahora se guarda por concepto, no por destreza fina), y cómo evitar que la
personalización choque con la regla de que cada alumno hace **una sola versión** del examen
o de la práctica (los ejercicios de la app no tienen ese problema, al generarse al azar).
Queda para cuando se retome esta tercera línea; no tocar el motor de refuerzo actual
(`src/motor.js`) mientras tanto.

**Candidato concreto para alimentar esta línea, apuntado el 2026-09-18:** la lista de «sé
hacerlo» del paquete semanal (ver más arriba, punto 1 de «El paquete de cada semana») es hoy
un PDF que el alumno rellena en papel y se queda para sí mismo, sin nota y sin que el
profesor la vea. Está construida sobre los mismos ids del inventario que todo lo demás, así
que es una candidata natural a convertirse en **autoevaluación dentro de la app**: el alumno
marca, destreza a destreza, si cree que sabe hacerla. Ese dato —lo que el alumno **cree** que
sabe— cotejado con lo que la app mide que **realmente** sabe (aciertos/fallos por destreza) da
una señal más rica que cualquiera de las dos por separado: un alumno que se marca «sé
hacerlo» y falla sistemáticamente necesita algo distinto (corregir el exceso de confianza)
que uno que se marca «no sé» y efectivamente falla (reforzar sabiendo que es consciente).
Mientras esta digitalización no exista, la lista sigue en PDF, en papel, autoevaluación pura
del alumno sin recogerla ni puntuarla — no cambia nada de lo que ya está en marcha para la
semana 2. Depende del mismo trabajo de diseño pendiente de arriba (histórico por destreza
fina en Firestore, no solo por concepto).

**Para reflexionar, apuntado el 2026-09-18 (sin decidir si merece la pena):** en vez de una
respuesta dicotómica SÍ/NO por destreza, una escala de dominio más matizada:

| Nivel | Significado |
|---|---|
| 0 | No sé hacerlo y no me suena. |
| 1 | Me suena, pero no sé hacerlo. |
| 2 | Más o menos sé hacerlo, pero no lo entiendo bien. |
| 3 | Sé hacerlo, pero no sé explicarlo. |
| 4 | Sé hacerlo y sé explicarlo. |

Encajaría con la idea de arriba (autoevaluación cotejada con el desempeño real): un 0-1 que
falla es coherente y solo necesita explicación de cero; un 3-4 que falla es la señal de
exceso de confianza más clara; y la distinción «sé hacerlo / sé explicarlo» separa la
destreza mecánica del dominio del porqué, que es justo lo que ya distinguen las soluciones
explicadas de examen y de hojas («Cómo se hace» frente al resultado). Pendiente de valorar
si una escala de 5 niveles es manejable para alumnos de 12 años sin que se conviertan en un
SÍ/NO disfrazado (marcar siempre 4 o siempre 0), y si el cotejo con el desempeño real
necesita los 5 niveles o le basta una versión más simple (por ejemplo, 3 niveles).

## Dónde está cada cosa (unidad 1)

- **Herramientas de todo el curso** (desde el 2026-09-20): `…/apuntes-1eso-bilingue/comun/`, con el
  generador común de exámenes (`examen.py`), el exportador de claves para el corrector, el
  original de `clil1eso.sty` (las demás copias las hace `sincronizar_estilos.py`) y la infografía
  del examen. Cada unidad solo tiene en `exámenes-semanales/comun/` dos lanzadores sin lógica.
  Explicado en el `LEEME.md` de esa carpeta.
- **Inventario de la unidad 2**: `…/2. Divisibility/inventario-unidad2.tsv` (80 destrezas, 36
  nucleares, ids `U2-<semana><parte>-<nn>`; columnas en el `LEEME.md` de la unidad).
- Secuenciación y resumen para familias:
  `~/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/1. Natural numbers, powers and roots/`
- Exámenes, práctica y vocabulario: `…/1. Natural numbers, powers and roots/exámenes-semanales/`
  (una carpeta por semana; la semana 1 tiene `generar.py`, que produce examen, resuelto,
  versión extra y clave).
- Fuentes heredadas del plan de cuestionarios, de solo lectura:
  `…/1. Natural numbers, powers and roots/cuestionarios/comun/reparto/salidas/` (banco,
  inventario único, casos de combinadas, verificador).
- Hojas: `…/1. Natural numbers, powers and roots/hojas-de-ejercicios/` (encargo en
  `ENCARGO-hojas-semanales.md`).
- Archivo de la tanda anterior de cuestionarios, de solo lectura:
  `…/apuntes-1eso-bilingue/pruebas-oc/`.

Las sesiones que producen exámenes, práctica u hojas **no escriben en este repositorio**;
solo lo leen (las listas de errores). Los cambios en la app se hacen desde sesiones
abiertas en el repositorio, con `npm test`.
