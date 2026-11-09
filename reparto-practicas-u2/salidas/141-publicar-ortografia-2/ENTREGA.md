# ENTREGA · Tarea 141 · Revisión y publicación de la ortografía 2 («Las tildes» y lo reabierto por la 140)

Sesión `s-20261109T101428-e1825b21` (Opus 5.5, lanzador automático, sin nadie delante). 9-11-2026, de 10:14Z a 10:50Z.

Commit del código: **`9d51347`** (empujado a `main`). Ficheros (`git show --stat`):
- `practicas/_comun/catalogo.js`: `disponible: true` en la fila 66 (`ortografia-puntuacion`). La 64 (`ortografia-tildes`) sigue en `false`.
- `practicas/ortografia-puntuacion/logica.js`: 1 ítem quitado (abajo). **Fuera de la lista de la ficha, declarado**: la ficha solo
  prevé recortes en `ortografia-tildes`; la 141 publica también «lo que la 140 dejara reabierto y cerrado», y el recorte es el mismo caso.
- `tests/practicas-ortografia-comun.test.js` (**fuera de la lista, declarado**, como hizo la 140): `PUBLICADOS` pasa a
  `['ortografia-letras', 'ortografia-puntuacion']`. **La 142 tiene que ampliarlo** con lo que publique.
- `docs/practicas-ortografia.md` §7 y `README.md` (párrafo de la sección Ortografía; no hay tabla de filas).

Tests propios (común + ortografía común + puntuación + tildes): 113/113. `npm test`: 1715/1715.

Cómo se probó con clics: **sin Claude in Chrome** (no estaba conectado en esta sesión). Chrome sin ventana (perfil aparte en `/tmp`,
cerrado al acabar) manejado por el protocolo de depuración desde Node: «Probar sin código», `?nivel=1|2|3`, cada ejercicio acertando y
fallando, a 375 px y a 1200 px, con capturas. Ni desbordamientos ni errores en la consola. Las consultas a la RAE, en el DLE con ese mismo navegador.

## Veredicto (contra los criterios de la ficha y solo contra ellos)

### `ortografia-tildes` (64): NO SE PUBLICA. Reabierta la 135
Leídos todos: 195 ítems (ej. 1: 48 · ej. 2: 48 · ej. 3: 51 · ej. 4: 48). **14 dudosos o mal y dos fallos de texto.** Lista exacta, fuentes y
arreglos: **`hechos/reabiertas/135--s-20261109T101428-e1825b21.md`**. Resumen:
- **El problema de fondo**: los ejercicios 1, 2 y 3 enseñan la palabra sin tildes y sin frase, y varias de esas formas son otra palabra
  con otra tónica: *medico/medicó* (médico), *musica* (música, de musicar, DLE), *cantara* (cantará), *canto* (cantó), *ordenes* (órdenes),
  *vehiculo* (vehículo, de vehicular¹, DLE), *peiné* (peine), *descuidó* (descuido). Son dos respuestas defendibles. Además, *cuidate*
  (voseo) y «Lucía aún está en clase» (fuerza «todavía» solo a medias).
- **Ej. 4**: «El 7 de 0,7 es una décima» es matemáticamente falso (son siete décimas). Y la mala «paralelógramo» la recoge el DLE como
  variante (Chile). Quitar el de la décima deja el nivel 2 en 15 (mínimo 16): por eso no es un recorte.
- **Lo ve el alumno sin fallar**: el detalle del ej. 1 en `textos.js` dice **«TÉ-le-fo-no»** (es y en), en el menú, la portada y el editor
  de tareas. Y al fallar el paso 1, el feedback escribe la palabra sin tilde («En **decimoseptimo** la sílaba que más se oye…»).
No se ha quitado nada de `ortografia-tildes` (`logica.js` sin tocar).

**El motor `acentuar`, bien**: 33 palabras a mano, las 12 de la ficha (bíceps, robots, jersey, cuídate, estudiáis, prohíbe, fue, dio,
exámenes, carácter/caracteres, fácilmente, Ángel) y guion, rehusar/rehúso, baúl, hay, virrey, estoy, tranvía, caída, Raúl, acordeón,
feo, creer, reír, cafés, acción, vivir, tórax… Todas como manda la Ortografía de 2010. Ej. 1 a 375 px con seis sílabas
(«de-ci-mo-sep-ti-mo»): los botones caben. Ej. 4 leído con la otra opción puesta: *numero*, *calculo*, *formula* no caben en sus frases; los fallos son los de arriba.

### `ortografia-puntuacion` (66): SE PUBLICA, con 1 ítem quitado
La reabierta de la 137 (s-20261109T101419-76cca97f, commit d8b86f5, sin navegador) quitó los 29 ítems de la lista de la 140 y escribió
otros. **Leído el diff entero** (lo nuevo y lo cambiado); lo que no cambió lo leyó la 140 entero esta mañana. Los 16 correos del nivel 3
se han sacado con sus dos malas y se han leído uno a uno.
- Quitado (≤ 5, sin escribir ninguno): ej. 1, nivel 3, **«Subimos a la Sierra de Espuña.»** (buena: «la sierra de Espuña»). En Murcia el
  nombre es «Sierra Espuña» (Parque Regional de Sierra Espuña) y el genérico funciona como parte del nombre, como en «Mar Menor», que está
  en la lista negra. Es dudoso, así que fuera. El nivel 3 de mayúsculas se queda en 18 (mínimo 12).
- Bien: profesiones (Enfermera, Cocinero, Veterinaria), instituciones (Ministerio de Sanidad, Congreso de los Diputados, Cruz Roja, Tribunal
  Supremo), títulos («La isla del tesoro», «Harry Potter y la piedra filosofal», como la edición española), «Mañana yo…», «río
  Guadalquivir». También «Mi vecina, la del tercero, trabaja en Lorca» (ninguna mala admite el vocativo), «¡Silencio!».» y «¿Has comido?».»
  con el punto (DPD «comillas» 2.d), y los suspensivos con malas de cuatro puntos o espacio delante. Los correos con fallos de saludo, tilde,
  mayúscula o signo de apertura son inequívocos.
- **Mirado y que se queda**: correo 9, la mala «No tengo claro **que** hay que estudiar para la prueba». Para leerla con «que»
  conjunción («no estoy seguro de que haya que estudiar») hace falta el indicativo tras «no tengo claro», que se aparta de la norma (lo
  normal es «haya»). En un correo al profesor, la mala es inequívocamente falsa. Si Juan Luis no lo ve así, se quita con un recorte y la
  reabierta de un ítem del test (`porNivel(CORREOS, 3) >= 16` impide quitarlo sin tocar el test).
Ítems que quedan (1 / 2 / 3): ej. 1 15 / 16 / 18 · ej. 2 16 / 16 / 17 · ej. 3 16 / 17 / 17 · ej. 4 16 / 16 / 32 (16 correos y 16 de asunto o cuerpo).

## Propuesta de ★ (para las tareas del panel de la U6 y la U7)

**U6** (la 140 cambió el orden; ahora la puntuación ya está publicada, así que vale su plan A):

| Semana | ★ | Ejercicio | Bloque publicado | Título sugerido |
|---|---|---|---|---|
| U6 · 3 (lun 15-2) | `['ortografia-letras', 1]` | hay, ahí, ay; a ver, haber | **sí** (9-11, 140) | Ortografía: hay, ahí, ay; a ver, haber |
| U6 · 4 (lun 22-2) | `['ortografia-puntuacion', 1]` | Mayúsculas | **sí** (9-11, 141) | Ortografía: las mayúsculas |

Si Juan Luis prefiere el orden del plan inicial (Mayúsculas en la U6 · 3), ya se puede: las dos están publicadas.

**U7, paquetes 1-4**: el plan es `['ortografia-tildes', 1]` … `['ortografia-tildes', 4]`, **sin publicar** (reabierta la 135). La propuesta
nombra **paquetes, no fechas**: el paquete 3 cae el 15-3 o tras Semana Santa (6-4), según cómo se monte la U7.

| Paquete | Plan A (si las tildes se publican antes del jue 25-2) | Bloque publicado | Plan B (si no) | Bloque publicado |
|---|---|---|---|---|
| U7 · 1 | `['ortografia-tildes', 1]` La sílaba tónica | **no** | `['ortografia-letras', 2]` ¿b o v? | **sí** |
| U7 · 2 | `['ortografia-tildes', 2]` ¿Lleva tilde? | **no** | `['ortografia-letras', 3]` g o j | **sí** |
| U7 · 3 | `['ortografia-tildes', 3]` Diptongos e hiatos | **no** | `['ortografia-letras', 4]` Otras letras | **sí** |
| U7 · 4 | `['ortografia-tildes', 4]` Las palabras de Matemáticas | **no** | `['ortografia-puntuacion', 2]` El punto y la coma | **sí** |
| U7 · 5 | `['ortografia-palabras', 1]` ¿Junto o separado? (lo publica la 142) | no | el mismo | no |

El plan B adelanta los cuatro ★ de la U8 · 1-4 (todos publicados desde hoy), y las tildes pasan a la U8 · 1-4 cuando estén publicadas.
Títulos sugeridos: «Ortografía: » + el nombre del ejercicio. El editor del panel lista las transversales al final: se marcan por
`['slug', n]`, no por posición.

Del resto del plan, publicados desde hoy y sin cambio: `['ortografia-puntuacion', 2]` (U8 · 4), `3` (U8 · 5) y `4` (junio · 2).

**La tabla de ★ del calendario del curso** (`apuntes-1eso-bilingue/comun/CALENDARIO-CURSO-2026-27.md`, «Ortografía en las tareas
semanales de la app») **no se edita desde este reparto**: la actualiza Juan Luis o una sesión de los apuntes con estas tablas.

## Hallazgos fuera de criterio (decide Juan Luis)
1. **Quién publica las tildes.** Ninguna tarea de publicación las tiene ya. Propuesta: que la 142 (publica 67 y 68, plazo jue 15-4, pero
   libre desde ahora) publique también la 64 si su reabierta está cerrada, igual que la 141 ha hecho con la 66. Si no, la coordinadora da
   de alta una tarea. Plazo útil: jue 25-2.
2. **Distractores que nadie escribe** en el ej. 4 de las tildes: *divisór*, *decimál*, *cuádrado*, *diagonál*, *hexagonál*, *unidádes*… Son
   inequívocamente falsos, pero tan raros que el ítem no enseña nada. Los errores reales son los otros: *exámen*, *algorítmo*, *carácteres*,
   *examenes*, *dieciseis*. Se puede reescribir la mitad «sin tilde» del ejercicio con errores que se ven en los cuadernos.
3. **«En 356 hay 5 decenas» y «En 356 hay 6 unidades»** (ej. 4, nivel 2). Así se dice en la descomposición, pero en Primaria «¿cuántas
   decenas hay en 356?» es 35. Para evitar la discusión: «356 son 3 centenas, 5 ___ y 6 unidades».
4. **Voseo**: además de *cuidate*, una sobresdrújula con pronombres como «explícaselo» es esdrújula en voseo («explicáselo»). Es de nivel
   3 y muy lejano a 1.º ESO; lo dejo apuntado por si se quiere una regla general («nada de imperativos con pronombres»).
5. La base no escribe `error` y `respuesta` en la consola (la ficha lo daba por hecho). Lo cubren los tests de `idError` de cada bloque,
   como ya dijo la 140.

## Cómo probarlo en 1 minuto
https://salasgar.github.io/Ejercicios-interactivos/practicas/ → sección «Ortografía» → «Ortografía: puntuación y mayúsculas» → «Probar sin
código». En local, `npm run servir` → http://localhost:8080/practicas/ortografia-puntuacion/?nivel=3 (y `ortografia-tildes/?nivel=1`,
ejercicio 1, para ver «me-di-co»).
