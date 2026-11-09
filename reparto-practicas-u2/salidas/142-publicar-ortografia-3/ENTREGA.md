# ENTREGA · Tarea 142 · Revisión y publicación de la ortografía 3 («Palabras que se confunden», «Ampliación» y «Las tildes»)

Sesión `s-20261109T105938-1997ca78` (Opus 5.5, lanzador automático, sin nadie delante). 9-11-2026, desde las 10:59Z.
Por la frase de arranque, la 142 revisa también «Las tildes» (64), cuya reabierta de la 135 se cerró en d553c8a.

**No se publica nada.** Los tres bloques tienen más de lo que la ficha deja quitar con un recorte (≤ 5 ítems por bloque, sin escribir
ninguno nuevo), o tienen reglas mal dichas que ve el alumno. Por eso **no hay commit de código**: `catalogo.js`, `docs/practicas-ortografia.md`
§7, `README.md`, los `logica.js` y `PUBLICADOS` de `tests/practicas-ortografia-comun.test.js` siguen sin tocar. El único commit es el de
cierre del reparto (reabiertas, terminada, esta ENTREGA, tablón y ficha).

Tests propios (común, ortografía común, palabras, ampliación y tildes): **103/103**, antes y después (no ha cambiado ningún fichero de código).

## Cómo se probó con clics
Sin Claude in Chrome (no está en esta sesión): Chrome sin ventana, con un perfil aparte en `/tmp`, manejado desde Node con el protocolo
de depuración (como la 141). `python3 -m http.server` en local, «Probar sin código» (nunca un código de alumno ni AJJN), **cada ejercicio
de los tres bloques en los tres niveles** (`?nivel=1|2|3`), a **375 px y a 1200 px**, acertando y fallando (de 3 a 8 ítems por ejercicio
hasta ver las dos cosas), con capturas. Resultado: **cero errores en la consola, ningún desborde horizontal**, la etiqueta «Nivel N ·
●○○» visible en todos, el feedback nombra la palabra del ítem y, tras fallar, la buena queda en verde en el hueco y la mala en rojo.
Que `error` y `respuesta` llegan a `api.responder` lo cubren los tests de `idError` de cada bloque (la base no los escribe en la consola;
ya lo dijeron la 140 y la 141).

El DLE y el DPD **no se dejan abrir** desde aquí: WebFetch recibe 403 y el Chrome sin ventana se queda en la verificación de Cloudflare.
Las fuentes se citan por la entrada; lo que no he podido confirmar va marcado «comprobar» en las reabiertas, y la regla es la de siempre:
si dudas, fuera.

## Veredicto (contra los criterios de la ficha y solo contra ellos)

### `ortografia-palabras` (67): NO SE PUBLICA · reabierta la 138
Leídos los 263 ítems (ej. 1: 38 / 37 / 25 · ej. 2: 24 / 29 / 30 · ej. 3: 27 / 23 / 30), cada frase con todas sus opciones puestas.
**Paso 9 de la ficha (la lista negra), limpio**: ningún 31-99 en letras, ningún separador de millares (los años sin punto son una regla
aparte, DPD «números»), ni enseguida, alrededor, en medio, aún, solo, decimotercero / décimo tercero; ningún homófono que dependa del
seseo. Los símbolos (kg, km, cm, h, min, km/h) no chocan con las hojas del curso.
Fallan **6 ítems** y **3 reglas** (lista exacta en `hechos/reabiertas/138--s-20261109T105938-1997ca78.md`):
- «¿_ has pintado el mural, con témperas?» admite también «conque» (pregunta de sorpresa, DPD «conque»).
- «Un enunciado _ lleva a una respuesta equivocada» (buena «mal entendido»): el DLE tiene «malentender», así que «malentendido» es
  también participio.
- **Tres frases caducan**: «Este año es el dos mil veintiséis» y «Estamos en el año 2026» dejan de ser verdad el 1-1-2027 (el ★ de
  «Números y símbolos» es de junio), y «Este año, febrero tiene veintiocho días» es falsa en 2028.
- «La media maratón tiene veintiún kilómetros» (son 21,0975; el ítem del maratón dice «un poco más de 42»).
- La introducción del ej. 3 enseña «delante de otro número, ciento» y el banco pide «cien mil»; la regla `cien-por-ciento` dice «solo
  va delante de un nombre…»; la de `sin-apocope` mete «cualquier» entre las formas cortas «delante de un nombre masculino».
Seis son más de cinco, y las reglas son texto nuevo (una en `textos.js`): no es un recorte.

### `ortografia-ampliacion` (68): NO SE PUBLICA · reabierta la 139
La 139 está LISTA. Leídos los 201 ítems (ej. 1: 16 / 16 / 16 · ej. 2: 19 / 18 / 17 · ej. 3: 17 / 17 / 16 · ej. 4: 16 / 16 / 17). El ej. 2
(formas verbales) está limpio. Fallan **7 ítems** y **2 explicaciones que contradicen a la buena en 9 ítems** (lista en
`hechos/reabiertas/139--s-20261109T105938-1997ca78.md`):
- «Un cuadrado se caracteriza por que tiene sus cuatro lados iguales»: falso, el rombo también los tiene.
- «Los números primos se distinguen _ …» y «Mi hermano pequeño siempre pregunta _ …» admiten «porque» (el mismo caso que el fichero
  ya excluye con «Le pregunté _»).
- Tres de punto y coma frente a dos puntos con anuncio: el punto y coma no es inequívocamente falso ahí (preferencia, no regla).
- «Mi tía vive en la Avda. de la Libertad»: la buena tiene que ir en minúscula, «avda.».
- Al fallar «sub 16» el alumno lee «el prefijo va pegado a la palabra», y al fallar «ex-primer ministro», lo mismo. En los dos casos
  la buena no va pegada.

### `ortografia-tildes` (64): NO SE PUBLICA · reabierta otra vez la 135
**Los 16 puntos de la primera reabierta están resueltos en el código**, comprobados uno a uno: te-LÉ-fo-no, la palabra bien escrita en
el feedback, «Un euro son cien céntimos», «cubo / cúbo» y la lista `HOMOGRAFAS_SIN_TILDE` en el test. Pero (lista en
`hechos/reabiertas/135--s-20261109T105938-1997ca78.md`):
- Una de las palabras nuevas cae en el mismo caso que *música*: *lámpara* (*lampara*, de *lampar*, DLE).
- Quedan dos sobresdrújulas que en voseo son la misma palabra con otra tónica, el caso de *cuídate*: *cómetelo* (comételo) y
  *explícaselo* (explicáselo).
- Hay que comprobar en el DLE tres más del tipo de *musicar*: *ahínco* (ahincó), *antiguo* (antiguó) y *además* (ademas, de *adema*).
- «En 356 hay 5 decenas» (con el rigor de «décima», son 35).
- La explicación de los monosílabos dice «las palabras de una sílaba no llevan tilde», que choca con la diacrítica que enseña la 45.
Quitar *lámpara* deja el N1 del ej. 1 en 15 (mínimo 16): hay que escribir, no es un recorte.

**Lo que no he quitado, y por qué** (decisión mía, para que Juan Luis la vea): *casa*, *cocina*, *causa* e *idea*, que en voseo dan
**otra** palabra (casá, cociná, causá, ideá). El precedente de *cuídate* es «la misma palabra en voseo». Con el criterio amplio se caería
casi todo nombre en -a que tenga un verbo detrás, y en Murcia ningún alumno lo lee así.

## Propuesta de ★ (para las tareas del panel de la U7, la U8 y junio)

**Hoy hay publicados** `ortografia` (45), `ortografia-letras` (65) y `ortografia-puntuacion` (66). Sin publicar: `ortografia-tildes` (64),
`ortografia-palabras` (67) y `ortografia-ampliacion` (68), las tres con reabierta MEDIO y **sin publicador** (abajo).

**Plan A** (las tildes publicadas antes del jue 25-2 y las palabras antes del jue 15-4): el de la ficha, sin cambios.

| Paquete | ★ (línea literal para el editor) | Ejercicio | Título sugerido | Bloque publicado hoy |
|---|---|---|---|---|
| U7 · 1 (lun 1-3) | `['ortografia-tildes', 1]` | La sílaba tónica | Ortografía: la sílaba tónica | no |
| U7 · 2 | `['ortografia-tildes', 2]` | ¿Lleva tilde? | Ortografía: ¿lleva tilde? | no |
| U7 · 3 | `['ortografia-tildes', 3]` | Diptongos e hiatos | Ortografía: diptongos e hiatos | no |
| U7 · 4 | `['ortografia-tildes', 4]` | Las palabras de Matemáticas | Ortografía: las palabras de Matemáticas | no |
| U7 · 5 (lun 19-4) | `['ortografia-palabras', 1]` | ¿Junto o separado? | Ortografía: ¿junto o separado? | no |
| U8 · 1 (lun 26-4) | `['ortografia-letras', 2]` | b o v | Ortografía: ¿b o v? | **sí** |
| U8 · 2 (desde el mar 4-5; el 3-5 es festivo) | `['ortografia-letras', 3]` | g o j y la diéresis | Ortografía: ¿g o j? | **sí** |
| U8 · 3 | `['ortografia-letras', 4]` | Otras letras | Ortografía: otras letras | **sí** |
| U8 · 4 | `['ortografia-puntuacion', 2]` | El punto y la coma | Ortografía: el punto y la coma | **sí** |
| U8 · 5 | `['ortografia-puntuacion', 3]` | Dos puntos, puntos suspensivos y el saludo | Ortografía: dos puntos y el saludo | **sí** |
| U8 · 6 | `['ortografia-palabras', 2]` | Suenan igual, se escriben distinto | Ortografía: suenan igual, se escriben distinto | no |
| Junio · repaso 1 (lun 14-6) | `['ortografia-palabras', 3]` | Números y símbolos | Ortografía: números y símbolos | no |
| Junio · repaso 2 (lun 21-6) | `['ortografia-puntuacion', 4]` | El correo al profesor | Ortografía: el correo al profesor | **sí** |

**Plan B** (si las tildes no llegan al jue 25-2: el de la 141), que adelanta los ★ de la U8 ya publicados:

| Paquete | ★ | Bloque publicado hoy |
|---|---|---|
| U7 · 1-4 | `['ortografia-letras', 2]`, `['ortografia-letras', 3]`, `['ortografia-letras', 4]`, `['ortografia-puntuacion', 2]` | **sí** |
| U7 · 5 | `['ortografia-palabras', 1]` (si no está publicado: `['ortografia-puntuacion', 3]`) | no / **sí** |
| U8 · 1-4 | `['ortografia-tildes', 1]` … `['ortografia-tildes', 4]` | no |
| U8 · 5 | `['ortografia-puntuacion', 3]` (o `['ortografia-palabras', 1]` si se cambió con la U7 · 5) | **sí** / no |
| U8 · 6 | `['ortografia-palabras', 2]` | no |
| Junio · 1 y 2 | `['ortografia-palabras', 3]`, `['ortografia-puntuacion', 4]` | no / **sí** |

**Regla de sustitución**, para no rehacer la tabla cada vez: si el ★ de una semana es de un bloque sin publicar, se pone el siguiente ★
del plan que ya esté publicado, y el que se salta ocupa el primer hueco que quede libre. Los paquetes, no las fechas: el 3 de la U7 cae
según cómo se monte la unidad, y la U8 · 2 empieza el martes 4-5.

**Junio**: según el calendario, del 7 al 11 de junio es la semana de recuperaciones y del 14 al 25 hay repaso con los exámenes tipo test.
Si en junio no hay tareas de la app, los dos últimos ★ (palabras 3 y puntuación 4) se quedan como **repaso libre** en la portada.

**La tabla de ★ del calendario del curso** (`apuntes-1eso-bilingue/comun/CALENDARIO-CURSO-2026-27.md`, «Ortografía en las tareas
semanales de la app») **no se edita desde este reparto** (condición de `autorizaciones.md`): la actualiza Juan Luis, o una sesión de
los apuntes con estas tablas y las de la 140 y la 141.

## Cómo ofrecer la ampliación (decide Juan Luis; nunca es ★)
- **(a)** Una tarea `asignada: true` del panel, solo para los alumnos que él marque. Es lo que mejor casa con «los más avanzados». La
  monta él en el editor, y los nombres no van a ningún fichero.
- **(b)** Sus ejercicios entre los «a elegir» de las tareas de la U8, como alternativa para quien ya tenga el ★ de ortografía.
- **(c)** Solo en la portada, sin puntos. Cada introducción lleva su aviso «Ampliación».
**Hasta que decida, (c)**, cuando se publique. La 139 recomendaba también (c).

## Quién publica ahora (propuesta para la coordinadora)
Las tres reabiertas son MEDIO y tocan carpetas disjuntas, así que caben a la vez. Ninguna tarea de publicación queda viva. Propuesta:
**una tarea nueva de publicación (ALTO, ~1 h 15 min) para la 64, la 67 y la 68**, que se pueda coger cuando estén cerradas las tres
reabiertas, o las que lo estén. Tendría la misma ficha que esta y estos plazos:
- jue 25-2 para las tildes (el ★ de la U7 · 1 es el lun 1-3);
- jue 15-4 para las palabras;
- la ampliación, sin plazo.
Esa tarea amplía `PUBLICADOS` en `tests/practicas-ortografia-comun.test.js` con lo que publique. Así lo hicieron la 140 y la 141, fuera
de su lista y declarándolo.

## Hallazgos fuera de criterio (decide Juan Luis)
1. **Voseo**: ¿vale el criterio estrecho de arriba (fuera la misma palabra en voseo, no las que solo en voseo son otra)? Si quiere
   el amplio, se caen *casa*, *cocina*, *causa*, *idea* y muchas más de los tres bloques de tildes.
2. **Los símbolos (kg, km, cm, h, min) están en el nivel 3** de «Números y símbolos» («más allá de 1.º»), y son de 1.º, incluso de
   Primaria. Lo de 3.º son los ordinales compuestos. Propuesta: pasar los símbolos al nivel 2 en la reabierta, si Juan Luis quiere.
3. **Distractores que no escribe nadie**: en palabras, «a trás», «de trás», «que haceres» (lo que escriben los alumnos es «atras» sin
   tilde). En las tildes, la 141 apuntó *divisór*, *decimál*, *cuádrado*. Enseñan poco.
4. **Niveles**: «sobretodo» (el abrigo) en el nivel 2 es una palabra que a los 12 años casi nadie conoce; en la ampliación, «sabo / sé»
   en el nivel 2 es más fácil que buena parte del 1, y «exjugadora de la selección» en el 3 es igual que los «ex-» del 2.
5. **Frases casi repetidas o raras**: «Está lloviendo, _ cogeré el paraguas» (así que) y «Está lloviendo mucho, _ coge el paraguas»
   (conque); «Quedan dos invitados por venir y empezamos a cenar»; «la cinta sin fin de la caja del supermercado no para de girar»;
   «En el equipo de fútbol hay veintiún jugadores» (el alumno piensa en once); «Vino a la charla un ex primer ministro» (en España
   no hay).
6. **Una regla para todos los bancos**: ninguna frase con el año en curso ni con «este año» ligado a un dato que cambie. Solo la tenía
   «Palabras»; en los bloques publicados no hay ninguna.

## Cómo probarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/ortografia-palabras/?nivel=1 → «Probar sin código» → ej. 3. Lo mismo con
`ortografia-ampliacion/?nivel=3` (ej. 1, «Un cuadrado se caracteriza…») y `ortografia-tildes/?nivel=1` (ej. 1). Ninguno sale en la
portada publicada: los tres siguen con `disponible: false`.
