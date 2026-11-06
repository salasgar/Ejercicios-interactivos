# La ortografía en la app (`practicas/`, sección «Ortografía»)

Empezado el 2026-11-03 y terminado el 2026-11-05 por la tarea 134 del reparto PU2
(`reparto-practicas-u2/`), que deja la base: el catálogo, la sección de la portada, los
niveles adaptables, las piezas comunes y los esqueletos de los cinco bloques nuevos. Los
bloques los escriben las tareas 135-139, los publican la 140, la 141 y la 142 (que rellenan
el §7) y la 143 pone niveles a la práctica de siempre. La base común, el panel y los
códigos son los de la unidad 2: están en [practicas-unidad2.md](practicas-unidad2.md).

Las decisiones de diseño, con su porqué, están en `reparto-practicas-u2/proyecto.md`,
«Tareas 134-143» (preguntas de Juan Luis del 3-11). Aquí se resumen.

## 1. Qué es la sección

La ortografía española no es de Matemáticas, pero lleva un ejercicio ★ en cada tarea
semanal desde la unidad 3. Desde la tarea 134 tiene **una sección propia en la portada**,
«Ortografía» (*Spanish spelling* en inglés), con seis prácticas («bloques»):

| id | `slug` | Bloque | Ejercicios (de más fácil a más difícil) | Tarea |
|---|---|---|---|---|
| 45 | `ortografia` | Ortografía: lo más frecuente | los 11 de siempre (a/ha, e/he, echo/hecho, ¿está bien escrita?, porque/por qué, vocativo, comas de significado, interrogativos, diacrítica, ¿? ¡! y espacios, sujeto-verbo) | hecha; niveles en la 143 |
| 64 | `ortografia-tildes` | Ortografía: las tildes | 1 la sílaba tónica · 2 ¿lleva tilde? · 3 diptongos e hiatos · 4 las palabras de Matemáticas | 135 |
| 65 | `ortografia-letras` | Ortografía: las letras | 1 hay/ahí/ay, a ver/haber · 2 b o v · 3 g o j y la diéresis · 4 otras letras | 136 |
| 66 | `ortografia-puntuacion` | Ortografía: puntuación y mayúsculas | 1 mayúsculas · 2 el punto y la coma · 3 dos puntos, puntos suspensivos y el saludo · 4 el correo al profesor | 137 |
| 67 | `ortografia-palabras` | Ortografía: palabras que se confunden | 1 ¿junto o separado? · 2 suenan igual, se escriben distinto · 3 números y símbolos | 138 |
| 68 | `ortografia-ampliacion` | Ortografía: ampliación (más allá de 1.º; nunca ★) | 1 porque, por qué, porqué, por que · 2 formas verbales · 3 siglas, abreviaturas y prefijos · 4 puntuación avanzada | 139 |

En el catálogo (`practicas/_comun/catalogo.js`) las seis llevan `unidad: 3`,
`transversal: true` y `seccion: 'ortografia'`:

- `seccion` saca la práctica de la sección de su unidad y la pone en la suya
  (`SECCIONES` en el catálogo; `seccionesPropias` en `practicas/vista-tareas.js`). La
  sección sale **debajo de la unidad actual y encima de las anteriores**, plegada (el
  alumno llega a los ejercicios por la tarea semanal; la sección es para practicar por su
  cuenta) y recuerda si el alumno la abrió, como las unidades anteriores. No depende del
  día: sale en cuanto tiene algo publicado.
- `transversal` hace que en la tarea semanal de otra unidad no salga como «repaso U3».
- `unidad: 3` ya no decide nada en la portada; se queda porque el editor de tareas y las
  tareas guardadas cuentan con él.

**Por qué bloques y no una práctica de 30 ejercicios**: el progreso se guarda por posición
y las tareas semanales citan `['ortografia', n]`, así que en una práctica un ejercicio nuevo
solo podría ir al final. Con bloques, cada bloque se ordena por dificultad, un ejercicio
futuro entra en el bloque que le toca, los menús son cortos y las tareas de contenido
tocan carpetas disjuntas. La 45 no cambia de slug, id, orden ni número de ejercicios:
solo de nombre.

Todas van **solo en español** (`idioma: 'es'` en `arrancar`); el `nombre` y el `detalle`
de cada ejercicio van en `{ es, en }`, con el inglés empezando por «Spanish spelling: …»,
porque los usan la portada y la tarea semanal.

## 2. Los niveles

Cada ejercicio de un bloque tiene **tres niveles**, y elige sus ítems según cómo vaya el
alumno en ese ejercicio (`practicas/_comun/nivel.js`):

| Nivel | Qué es |
|---|---|
| 1 | Lo que todo alumno de 1.º ESO tiene que dominar, y lo que más falla en sus textos |
| 2 | El resto de lo que marca 1.º ESO |
| 3 | Más allá de 1.º ESO (lo de 2.º-3.º: excepciones, cultismos, reglas finas), siempre con una sola respuesta defendible |

**Cómo se decide** (`nivelDe(sesion)`), sin estado nuevo: el contador ya mide cómo va el
alumno, y la base pasa a cada generador `sesion = { puntos, vidas, … }`.

- Por puntos, con el objetivo de siempre (10): **0-2 → nivel 1, 3-6 → nivel 2, 7-10 →
  nivel 3** (menos del 30 % del objetivo, menos del 70 %, el resto).
- Tope por vidas, con las 5 de siempre: **5 o 4 vidas, sin tope; 3, como mucho el
  nivel 2; 2 o menos, el nivel 1**. En el código se cuentan las vidas *perdidas* (0-1, 2,
  3 o más), para que un ejercicio que declare otras `vidas` no empiece ya con tope.

Así quien falla no sube (no se desespera) y quien va bien ve los últimos ítems en el
nivel 3 (no se aburre): el nivel 3 lo alcanza quien llega a 7 puntos habiendo fallado una
vez como mucho. Quien pierde las cinco vidas vuelve a empezar el ejercicio, en el nivel 1,
como hasta ahora. Los umbrales son constantes de `nivel.js`, con su porqué al lado; no se
cambian sin dejarlo escrito allí.

**Cómo se elige el ítem** (`elegirDeNivel`): un 70 % de las veces, del nivel del alumno;
un 30 %, de los niveles de debajo (si los hay); **nunca de uno de arriba**. Si el nivel del
alumno no tiene ítems en ese banco, baja al más alto que los tenga.

**`?nivel=1`, `?nivel=2`, `?nivel=3`** en la dirección fija el nivel, **solo practicando sin
código** («Probar sin código»): sirve para revisar los ítems de un nivel (tareas 140-142) y
para enseñarlo en clase. Con código (en la dirección, `?c=`, o recordado en el navegador)
no hace nada: la base no le dice al generador si hay código y no se toca, así que
`nivelForzado` mira lo mismo que mira la base al arrancar (`hayCodigoEnLaPagina`). Un valor
que no sea 1, 2 o 3 se ignora.

En la esquina del ítem, `etiquetaNivel(nivel)` pinta «Nivel 2 · ●●○».

## 3. El contrato para escribir un ejercicio de ortografía

Es el de cualquier práctica (`practicas/plantilla/practica.js`), con tres añadidos: el
banco lleva niveles, el generador usa `elegirDeNivel` y el `montar` usa las piezas de
`practicas/_comun/ortografia.js`.

**El banco** (en `logica.js`, puro, sin DOM): una lista de ítems, cada uno con
`nivel: 1 | 2 | 3`, los datos de la pregunta, la explicación ligada a ese ítem y el `idError`
de cada respuesta mala.

**El generador**:

```js
import { elegirDeNivel, nivelForzado } from '../_comun/nivel.js';
import { barajarOpciones } from '../_comun/ortografia.js';

generar: (rng, sesion) => {
  const { item, actual } = elegirDeNivel(rng, BANCO, sesion, { forzado: nivelForzado() });
  return { i: BANCO.indexOf(item), nivel: actual, opciones: barajarOpciones(rng, item.opciones) };
}
```

Devuelve `{ item, nivel, actual }`: `nivel` es el del ítem y `actual` el del alumno (el que
se enseña en la etiqueta). El ítem que devuelve `generar` tiene que ser pequeño y
serializable (la base lo compara con el anterior para no repetir).

**El `montar`**, con las piezas comunes. Todas reciben el `api` de la base, pintan la
corrección (la buena en verde, lo elegido mal en rojo) y llaman **una vez** a
`api.responder` con `error` y `respuesta` al fallar. `explicacion` e `idError` pueden ser un
texto o una función de lo que contestó el alumno; `etiqueta` (opcional) es el HTML de
`etiquetaNivel`, arriba del todo.

| Pieza | Para qué | Lo esencial |
|---|---|---|
| `montarHueco(contenedor, api, { antes, despues, opciones, buena, explicacion, idError })` | La frase con un hueco | Botones `si-no` si son dos, `elecciones` si son más; la buena se escribe en verde en el hueco |
| `montarElegir(contenedor, api, { instruccion, contexto, pregunta, opciones, buena, explicacion, idError })` | «¿Cuál está bien escrita?», «¿Qué frase dice esto?» | `opciones`: `[{ k, texto }]` ya barajadas (`barajarOpciones`), o `[{ k, html }]`; `buena` es una `k` |
| `montarTocar(contenedor, api, { piezas, buenas, multiple, ninguna, unidas, explicacion, idError })` | Tocar sílabas, palabras o letras | `buenas`: índices (`[]` si es «Ninguna»); `multiple: true` añade «Comprobar» y acierta solo si coincide el conjunto; `unidas: true`, como una palabra partida (la-piz) |
| `montarDosPasos(contenedor, api, { paso1, paso2, etiqueta })` | Primero tocar y, si se acierta, elegir | Si el primero falla, el ítem termina con su explicación; lo usa «La sílaba tónica» |

Las piezas ponen sus estilos en la página la primera vez (`ESTILOS`): el `estilos.css` de
cada bloque es solo para lo propio. `TXO` tiene los textos comunes («¿Qué palabra va en el
hueco?», «¿Cuál está bien escrita?», «Comprobar», «Ninguna»…) y `slug(texto)` hace un
`idError` de un texto, igual que el de la 45.

**`idError`**: estable **por confusión**, no por frase (`v-por-b`, `sin-tilde-llana`,
`mayuscula-en-mes`), con el patrón `^[a-z0-9-]{1,40}$`. Es lo que el panel agrupa en «Qué
falla más». `respuesta`, lo que puso el alumno (las piezas lo ponen solas).

**Los tests mínimos de un bloque** (`tests/practicas-ortografia-<bloque>.test.js`):

1. Forma: cada ítem del banco con `nivel` 1-3, sus campos y una sola respuesta buena.
2. Niveles: **≥ 16 ítems por nivel** (≥ 12 si el ejercicio es de tocar piezas o tiene tres o
   más opciones).
3. Equilibrio: ningún botón acierta más del 60 % de las veces dentro de su nivel.
4. **Nunca por encima del nivel**: ≥ 3000 ítems por ejercicio con una `sesion` simulada en
   cada nivel, y ninguno de nivel mayor que `nivelDe(sesion)`.
5. Lista negra: ninguna opción ni hueco con una pareja de «Lo que nunca es distractor» (§6).
6. Los `idError`, con el patrón; la explicación, con la forma buena en `<b>`.

Los `montar` se prueban con clics en el navegador: `npm run servir` y
`http://localhost:8080/practicas/ortografia-<bloque>/?nivel=N`, con «Probar sin código».

**Los esqueletos**: hasta que su tarea los escriba, cada bloque declara sus N ejercicios
como `enConstruccion(tarea)` (de `_comun/ortografia.js`), que pintan «Este ejercicio todavía
no está». Quien escriba el bloque sustituye cada uno por el suyo, en su sitio y sin cambiar
el número (lo fija el catálogo).

## 4. Qué aspecto de la ortografía de 1.º ESO se trabaja dónde

Inventario hecho con los saberes básicos de Lengua Castellana del Real Decreto 217/2022 y
del Decreto 235/2022 de la Región de Murcia, tal como los despliegan los libros de texto de
1.º ESO, más los errores que Juan Luis ha ido apuntando en los textos de sus alumnos. El
texto literal de los decretos no se consultó.

| Aspecto | Dónde | Nivel 3 (más allá de 1.º) |
|---|---|---|
| Sílaba tónica; agudas, llanas y esdrújulas | tildes 1 | sobresdrújulas, compuestos, cuatro sílabas con diptongo |
| Reglas generales de acentuación | tildes 2 | monosílabos sin tilde (fue, dio, ti), -y y -s tras consonante, adverbios en -mente, mayúsculas con tilde |
| Diptongos, triptongos e hiatos | tildes 3 | hiatos con h, triptongos, ui/iu, aún/aun en frase |
| Tilde diacrítica | ortografia 9 (hecho) | — |
| Interrogativos y exclamativos | ortografia 8 (hecho) | — |
| Vocabulario de Matemáticas y numerales con tilde | tildes 4 | raíz, isósceles, algoritmo, decimotercero… |
| La h: hay/ahí/ay, a ver/haber; a/ha, e/he, echo/hecho | letras 1; ortografia 1-4 (hecho) | habría/abría, repaso con frases difíciles |
| b/v | letras 2 | excepciones (árabe, hervir, movilidad) y homófonos |
| g/j, gue/gui, güe/güi | letras 3 | diéresis, excepciones (tejer, crujir), palabras «de memoria» |
| ll/y, m ante p y b, r/rr, c/z/qu, -d/-z final, cc, x/s | letras 4 | -d/-z final, cc/c, x/s |
| Mayúsculas | puntuación 1 | cargos, genéricos geográficos, instituciones, títulos de obras, tras los dos puntos del saludo |
| Punto, coma en enumeraciones, coma con pero/aunque y conectores | puntuación 2 (vocativo: ortografia 6; significado: 7; sujeto-verbo: 11) | etc., conectores en medio, punto fuera del paréntesis |
| Dos puntos, puntos suspensivos, saludo de carta y correo | puntuación 3 | punto y coma, raya de diálogo, signos fuera de las comillas |
| ¿? ¡! y espacios | ortografia 10 (hecho) | — |
| Escritura digital: del chat al correo; asunto y cuerpo | puntuación 4 | registro, despedida, asunto/cuerpo |
| porque / por qué | ortografia 5 (hecho) | porqué y por que: ampliación 1 |
| Palabras juntas y separadas | palabras 1 | conque/con que/con qué, por que, a sí mismo, sinfín |
| Homófonos | palabras 2 | bienes/vienes, sabia/savia, grabar/gravar… |
| Numerales en letras, apócopes, ordinales, símbolos de unidades | palabras 3 | símbolos (kg, km, h, min, s), €, compuestos con tilde |
| Formas verbales que se escriben mal | ampliación 2 | impersonales de haber |
| Siglas, abreviaturas, prefijos | ampliación 3 | guion ante mayúscula o cifra, currículums |
| Punto y coma, raya, comillas, paréntesis | ampliación 4 | inciso del narrador, dos puntos frente a punto y coma |

**Fuera**: la gramática (leísmo, dequeísmo, concordancia, «si tendría»), salvo las
impersonales de haber en la ampliación; la separación silábica a final de línea; los
extranjerismos y los latinismos. Lo que se quiera añadir es un ejercicio más al final del
bloque que toque, no un bloque nuevo.

## 5. Plan de ★ semanales (propuesta)

**Es una propuesta**: la fecha la fija la tarea del panel de cada unidad con la ENTREGA de
la publicación (140-142), y la tabla del calendario de los apuntes
(`apuntes-1eso-bilingue/comun/CALENDARIO-CURSO-2026-27.md`) la actualiza Juan Luis. Sigue a
ese calendario, que llega hasta `ortografia` 11 en la U6 · 2. Orden: primero lo que más
falla y lo más fácil; la ampliación, nunca.

| Semana | ★ | Lo publica |
|---|---|---|
| U6 · 3 (lun 15-2) | `['ortografia-puntuacion', 1]` Mayúsculas | 140 (jue 11-2) |
| U6 · 4 (lun 22-2) | `['ortografia-letras', 1]` hay, ahí, ay; a ver, haber | 140 |
| U7 · 1 (lun 1-3) | `['ortografia-tildes', 1]` La sílaba tónica | 141 (jue 25-2) |
| U7 · 2 (lun 8-3) | `['ortografia-tildes', 2]` ¿Lleva tilde? | 141 |
| U7 · 3 (15-3 o tras Semana Santa) | `['ortografia-tildes', 3]` Diptongos e hiatos | 141 |
| U7 · 4 (lun 12-4) | `['ortografia-tildes', 4]` Las palabras de Matemáticas | 141 |
| U7 · 5 (lun 19-4) | `['ortografia-palabras', 1]` ¿Junto o separado? | 142 (jue 15-4) |
| U8 · 1 (lun 26-4) | `['ortografia-letras', 2]` b o v | 140 |
| U8 · 2 (mar 4-5) | `['ortografia-letras', 3]` g o j | 140 |
| U8 · 3 (lun 10-5) | `['ortografia-letras', 4]` Otras letras | 140 |
| U8 · 4 (lun 17-5) | `['ortografia-puntuacion', 2]` El punto y la coma | 140 |
| U8 · 5 (lun 24-5) | `['ortografia-puntuacion', 3]` Dos puntos, puntos suspensivos y el saludo | 140 |
| U8 · 6 (lun 31-5) | `['ortografia-palabras', 2]` Suenan igual, se escriben distinto | 142 |
| Junio · 1 (lun 14-6) | `['ortografia-palabras', 3]` Números y símbolos | 142 |
| Junio · 2 (lun 21-6) | `['ortografia-puntuacion', 4]` El correo al profesor | 140 |

## 6. Lo que nunca es distractor

Dos formas que la RAE admite las dos, o una recomendación y no una regla. **Nunca** van como
hueco ni como distractor; cada bloque copia la lista a su test como lista negra. Si la forma
correcta depende del sentido, el contexto de la frase tiene que forzar una sola lectura; si
no se consigue, la frase se descarta o va como «¿qué frase dice esto?».

- solo / sólo · este, ese, aquel con y sin tilde · aún / aun fuera de contexto
- guion, truhan, hui, fie, rio, frio, Sion, Ruan (monosílabos sin tilde desde 2010)
- período / periodo, vídeo / video, cardíaco / cardiaco, olimpíada / olimpiada, alvéolo /
  alveolo, policíaco / policiaco, fútbol / futbol, chófer / chofer, icono / ícono, élite / elite
- kilómetro / quilómetro, octógono / octágono, cinc / zinc, biznieto / bisnieto
- enseguida / en seguida, deprisa / de prisa, aprisa / a prisa, enfrente / en frente,
  asimismo / así mismo (como «también»), adonde / a donde, entretanto / entre tanto,
  bocabajo / boca abajo, sobremanera / sobre manera, alrededor / al rededor, en medio / enmedio
  (estas dos, desde el 6-11: propuesta de la 138, DPD 2.ª ed.)
- treintaiuno / treinta y uno (y todos los 31-99)
- undécimo / decimoprimero, duodécimo / decimosegundo, decimotercero / décimo tercero
  (13.º-29.º), onceavo y doceavo como ordinales (el DLE los recoge)
- imprimido / impreso, freído / frito, proveído / provisto, iros / idos, los imperativos con -ros
- posguerra / postguerra, clubs / clubes, OVNI / ovni, los extranjerismos (wasap / WhatsApp,
  güisqui / whisky)
- l / L (litro), 5 % / 5%, 5 € / 5€, 1.º / 1º, n.º / nº, 12 000 / 12.000 (la RAE pide
  espacio; los materiales del curso llevan punto)
- veintiún alumnas / veintiuna alumnas, la primer vez
- comillas inglesas / latinas · coma / punto y coma en frases cortas
- casa / caza, cocer / coser y todo par que solo sea homófono con seseo (en Murcia se
  distinguen)
- «Mar Menor» (el genérico es parte del nombre)
- Sol / sol, Luna / luna, Tierra / tierra, Internet / internet, Ayuntamiento / ayuntamiento,
  Estado / estado, Iglesia / iglesia (dependen del sentido)
- «examen de Matemáticas» / «las matemáticas» (asignatura frente a ciencia: solo contextos
  inequívocos de asignatura)

Las dudas se resuelven en `dle.rae.es`, el Diccionario panhispánico de dudas
(`rae.es/dpd/`) y `fundeu.es`: lo que la RAE admita de dos maneras, fuera; lo dudoso, fuera;
lo que un libro de texto viejo diga distinto que la Ortografía de 2010, fuera.

## 7. Qué hay publicado

Hasta ahora, solo la 45 («lo más frecuente», 11 ejercicios, sin niveles todavía). Los
bloques 64-68 están en el catálogo con `disponible: false` y son esqueletos «En
construcción». Este apartado lo rellenan las tareas 140, 141 y 142 al publicar.
