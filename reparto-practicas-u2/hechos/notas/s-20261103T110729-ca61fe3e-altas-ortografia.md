# Nota de coordinación · s-20261103T110729-ca61fe3e · 2026-11-03T11:07:29Z

Sesión de coordinación (Fable 5.1), sin reclamo, sin tocar `salidas/` ni código. Papel: dar de alta las tareas de la ampliación de la ortografía
(encargo de Juan Luis del 3-11: «Da de alta las tareas que sean necesarias para ampliar la sección de ejercicios de ortografía. Que cubran
todos los aspectos de la ortografía que deban dominar los alumnos de 1º de ESO», más cuatro preguntas de diseño hechas sobre la marcha:
dificultad creciente, nivel superior al de 1.º ESO para los avanzados, nivel adaptable, subsecciones).

Relistado `hechos/` con `git fetch` a las 11:07:29Z: ningún reclamo con `caduca:` en el futuro (el de la 113 caducó el 2-11 a las 15:16Z y está sin
comitear en el árbol, como el 106 y el 23 antiguos). Otra sesión de Claude Code en el mismo árbol (bb116caf…, desde las 07:28Z) sin ficheros reclamados.

(El detalle de las altas se añade abajo al terminar; a este fichero solo se añade.)

## Qué di de alta (cerrado a las 14:54:02Z)

Las tareas **134-143**, la ortografía en bloques con niveles adaptables. Fichas en `tareas/tarea-134-…` a `tarea-143-…` (generadas
con un script del scratchpad a partir de la ficha 128 y la 121; desde ahora se editan a mano), carpetas de salida creadas (vacías,
no se commitean), sección «Tareas 134-143» + «Orden de prioridad de la ortografía» al final de `proyecto.md`, diez filas al final del
tablón (tras la 133) y una línea «Actualizado» en su cabecera (retoque, no regeneración completa: hay otra sesión en el árbol).

- **134** base (ALTO, 2 h): sección «Ortografía» en la portada, filas 64-68 del catálogo con `seccion: 'ortografia'` y esqueletos,
  nombre nuevo de la 45 («Ortografía: lo más frecuente»), `_comun/nivel.js` (niveles por puntos y vidas, `?nivel=` en «Probar sin
  código», `elegirDeNivel`, `etiquetaNivel`), `_comun/ortografia.js` (hueco, elegir, tocar, dos pasos), `docs/practicas-ortografia.md`.
- **135-139** los cinco bloques (135 tildes MEDIO, 136 letras MEDIO, 137 puntuación y mayúsculas MEDIO, 138 palabras que se
  confunden ALTO, 139 ampliación ALTO), carpetas disjuntas, todas en paralelo con la 134 LISTA.
- **140 → 141 → 142** revisión con clics y lectura de todos los ítems, y publicación (ALTO, cadena por `catalogo.js`), con la
  propuesta de ★ de su tramo; la 142 propone cómo ofrecer la ampliación.
- **143** niveles en los 11 ejercicios de la 45 (MEDIO, sin plazo, última).

## Decisiones (el porqué largo, en `proyecto.md`)

- Respuestas a las cuatro preguntas de Juan Luis del 3-11: dificultad creciente dentro de cada bloque y de cada ejercicio; el
  nivel 3 de cada ejercicio es «más allá de 1.º» y hay un bloque de ampliación que nunca es ★; niveles adaptables por puntos
  (0-2 → 1, 3-6 → 2, ≥ 7 → 3) con tope por vidas (3 vidas → máx. 2; ≤ 2 → 1), sin estado nuevo ni tocar la base; subsecciones
  como prácticas separadas bajo una sección «Ortografía» de la portada, porque el progreso va por posición y las tareas citan
  `['ortografia', n]`.
- Ids 64-68 (57-63 son de la 122). La U6 (otra sesión, s-20261103T140356-12629e13) toma 144-161 e ids 69-79, acordado por mensaje.
- Bandas: contenido de tildes, letras y puntuación MEDIO (reglas mecánicas y comprobables por forma); palabras y ampliación ALTO
  (es donde más dobles formas válidas admite la RAE). La lista «Lo que nunca es distractor» está en `proyecto.md` y cada ficha la
  manda copiar al test como lista negra.
- El calendario de ★ de los apuntes (`comun/CALENDARIO-CURSO-2026-27.md`) no se edita desde este reparto (condición de
  `autorizaciones.md`): el plan de ★ hasta junio está en `proyecto.md` y lo entregan 140-142; lo actualiza Juan Luis o una sesión
  de los apuntes.
- Fuera de alcance: gramática (salvo impersonales de haber en la ampliación), división silábica a final de línea, extranjerismos.

## Órdenes de las fichas: cuáles ejecuté en este Mac y cuáles no

Ejecutadas: el comando del reclamo (sid con `/dev/urandom` y `od`; `date -u -v+NM`). NO ejecutadas (son las mismas de las fichas
98-133, ya probadas por sus sesiones): `npm test`, `node --test`, `npm run servir`. El `node -e "import(…)"` de la 134 es nuevo y no
lo probé: si falla, la sesión de la 134 lo anota como trampa.

## El tablón

Al dar de alta no había ningún reclamo vivo y el tablón estaba limpio en el árbol (`git status`). Añadí mi cabecera y mis diez filas
con retoque y **sí comiteo el tablón** (la U6 empuja después y rebasa: acordado por mensaje). Si al regenerarlo faltaran las filas
134-143, se recopian de las fichas `tareas/tarea-134-…` a `tarea-143-…` (son la fuente).
