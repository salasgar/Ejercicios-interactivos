# ENTREGA · Tarea 196 · Publicación de «Las tildes» (64), «Palabras que se confunden» (67) y «Ampliación» (68)

Sesión `s-20261114T113316-d58f9cb4` (Opus 5.5, esfuerzo Alto), 14-11-2026, desde las 11:33Z.

**Se publican `ortografia-palabras` (67) y `ortografia-ampliacion` (68), sin quitar ningún ítem. `ortografia-tildes` (64) NO se
publica**: tercera reabierta de la 135 (`hechos/reabiertas/135--s-20261114T113316-d58f9cb4.md`), y la terminada de esta tarea empieza por
`PARCIAL:`. Cuando esa reabierta esté cerrada, se vuelve a reclamar la 196 para revisar solo lo reabierto y publicar las tildes.

> **Segunda pasada (14-11, 12:08Z, sesión `s-20261114T120759-e1c97fc9`)**: la tercera reabierta se cerró (3bc3808), pero dos de sus
> sustitutos no valen. **Las tildes siguen sin publicar**: cuarta reabierta de la 135 (`hechos/reabiertas/135--s-20261114T120759-e1c97fc9.md`).
> Detalle al final, «Segunda pasada».

Commit del código: **ed3cc3f** (`hechos/terminadas/196--s-20261114T113316-d58f9cb4.md`). Ficheros: `practicas/_comun/catalogo.js`
(solo `disponible: true` de las filas 67 y 68), `tests/practicas-ortografia-comun.test.js` (solo `PUBLICADOS`), `docs/practicas-ortografia.md`
(§5: la decisión de la ampliación; §7: qué hay publicado) y `README.md` (el párrafo de la ortografía). Ningún `logica.js` tocado.

## Cómo se revisó

1. **Las reabiertas del 9-11, punto a punto, en el código** (las de la 141 y la 142):
   - Tildes (los 16 puntos de la primera y los 10 de la segunda): resueltos. *lámpara*, *cómetelo*, *explícaselo*, *ahínco*, *antiguo* y
     *además* ya no están; las descomposiciones «356 son 3 ___, 5 decenas y 6 unidades»; la regla del monosílabo («solo la llevan para
     distinguirse de otra que se escribe igual»); el diptongo «en cualquier orden»; «Las mayúsculas también llevan tilde» solo cuando la
     tilde va en la mayúscula; «las esdrújulas llevan tilde siempre» en el ej. 3. Las palabras quitadas están en `HOMOGRAFAS_SIN_TILDE` y
     `VOSEO` del test.
   - Palabras (los 10): resueltos. Fuera «¿_ has pintado el mural…?», «Un enunciado _…», «Este año es el…», «Estamos en el año…»;
     «Si el año no es bisiesto, febrero tiene _ días»; «algo más de _ kilómetros»; la introducción del ej. 3 con «salvo delante de *mil* y
     de *millones*»; las reglas de `cien-por-ciento`, `sin-apocope` («cualquier», también ante femenino), `simbolo-con-punto` y `huso`.
   - Ampliación (los 10): resueltos. El cuadrado «con cuatro lados iguales y cuatro ángulos rectos»; fuera «se distinguen _» y «siempre
     pregunta _»; las tres de punto y coma frente a dos puntos llevan ahora como mala unos dos puntos mal puestos; «avda.» en minúscula; motivos
     propios para «sub 16» y «anti OTAN» (`espacio-ante-cifra`, `sin-guion-ante-cifra`) y para «ex-primer ministro»
     (`guion-ante-varias-palabras`); «álbumes», el pretérito en -ste y «yendo».
2. **Los tres bancos enteros**, leídos con cada opción puesta por tres revisores en paralelo (uno por bloque, solo lectura, volcando los
   ítems con node), contra la regla de oro de la ortografía, la lista «Lo que nunca es distractor», datos falsos, frases que caducan y
   explicaciones que contradicen a la buena. Cada marca, comprobada por mí en el código y, si hacía falta, en el DLE o el DPD.
3. **DLE y DPD con Claude in Chrome** (`fetch` dentro de una pestaña de dle.rae.es y rae.es/dpd; la búsqueda sin tilde del DLE lleva al lema
   si la forma existe), 14-11-2026:
   - «jamas» → **jama** (f., coloq. Cuba y Nicaragua) y **jamar** (tr., coloq., 'comer'): *jamás* tiene dos respuestas (tildes, ej. 2).
   - «sofar», «carcelar»: no existen (solo sugerencias); *sofá* y *cárcel* se quedan.
   - «compas» → plural de **compa**: *compás* no sirve como sustituto. *autobús*, *cojín* y *menú*, sí.
   - «sinfín»: solo «m. Gran cantidad de personas o cosas»; «La cinta _ de la caja…» (sin fin) y «Fue una espera _» se quedan.
   - «malentender»: está (ya lo quitó la reabierta de la 138).
   - DPD «coma», § 2.6 (elisión verbal): el ejemplo con dos miembros es «Su hijo mayor es rubio; el pequeño, moreno», con punto y coma;
     DPD «punto y coma», § 3b: las partes que llevan coma dentro se separan con punto y coma. Los cuatro ítems de dos miembros del ej. 4 de
     la ampliación («Mi padre trabaja de mañana; mi madre, de tarde»…) se quedan.
4. **Variedad** (criterio nuevo del 13-11): 3000 ítems por ejercicio y nivel con el generador como lo llama la base. Ningún ítem pasa del
   10 %. Máximos (N1 / N2 / N3): tildes 7,2-7,3 / 4,8-5,0 / 4,6-5,1 %; palabras 3,5 / 2,5 / 3,5 (ej. 1), 5,1 / 3,1 / 2,9 (ej. 2), 4,3 / 3,7 /
   2,8 (ej. 3); ampliación 6,4-7,4 / 4,4-5,0 / 4,7-5,0 %. El generador nunca da un ítem por encima del nivel (0 casos).
5. **Clics**: ver «Prueba en el navegador».

## Veredicto (contra los criterios de la ficha y solo contra ellos)

### `ortografia-palabras` (67): SE PUBLICA
Recuento: ej. 1 38 / 37 / 23 · ej. 2 24 / 29 / 30 · ej. 3 27 / 23 / 30. Ninguna opción falsa que valga en su frase; ningún par de la lista
negra (los avisos del barrido eran falsos positivos, como «cinc» dentro de «veinticinco»); ninguna frase que caduque ni dato falso. Lo dudoso
que se miró y se queda: «Tú pon la mesa; de lo _ me encargo yo» (demás: «de lo de más» no se sostiene), «sin fin» / «sinfín» (DLE),
«Este año mi tío ha recorrido _ kilómetros» (no se vuelve falsa con el año).

### `ortografia-ampliacion` (68): SE PUBLICA
Recuento: ej. 1 16 / 16 / 16 · ej. 2 19 / 18 / 17 · ej. 3 17 / 17 / 16 · ej. 4 16 / 16 / 17. Aviso «Ampliación» en las cuatro introducciones.
Ningún MAL. Lo dudoso que se miró y se queda:
- «¿Me dices _ te has enfadado conmigo?» y «Averigua _ no funciona la impresora» (por qué): *decir* y *averiguar* piden complemento, así que
  «porque» causal no cabe sin un «lo» que no está. Es distinto de «Le pregunté _» y «siempre pregunta _», que sí funcionan sin complemento.
- Los cuatro de dos miembros con verbo elidido (DPD, arriba).
- «Solo quiero una cosa; que aprobéis todos» como mala: el punto y coma es falso (lo que sigue no es una oración); el motivo «para anunciar lo
  que viene después se usan dos puntos» es verdad para esta frase.
- «Te voy a decir: la verdad no he estudiado» como mala: sin coma tras «la verdad» no es correcta en ningún caso.
- «exjugador de baloncesto», «exprofesora de Inglés»: el prefijo va separado solo ante una unidad de varias palabras (*ex primer ministro*);
  *jugador de baloncesto* no lo es.
- Equilibrio del ej. 1: cuatro formas con 5 de 16 (31,25 %) frente al «18-31 %» que entregó la 139: es el redondeo de 5/16, y el test
  comprueba 15-60 %.

### `ortografia-tildes` (64): NO SE PUBLICA · tercera reabierta de la 135
Las dos reabiertas anteriores están resueltas (arriba), pero:
- **MAL**: ej. 2, N1, *jamás*: «Ninguna» también vale (*jamas*, DLE).
- **Lista negra**: ej. 2, N3, *pie* (de *piar*, en la lista de monosílabos de la Ortografía de 2010, como *fie* y *hui*); ej. 3, N1, *Luis*
  (la estructura de *hui*; «Luís» se veía escrito).
- **Dato falso**: ej. 4, N3, «Si una cantidad se duplica y la otra también, la relación es directamente ___»: no basta, y el ★ de este
  ejercicio cae en la U7, que es proporcionalidad.
- Dudosos, de paso: «Dos rectas que nunca se cortan son ___» (solo en el plano) y «Aun los más pequeños pueden hacerlo» (cabe «todavía»).
Quitar *jamás* y *pie* deja el ej. 2 en 15 en los niveles 1 y 3 (mínimo 16, test línea 136): hay que escribir, no es un recorte.
Plazo de la reabierta: jue 18-2; de la publicación, jue 25-2 (★ de la U7 · 1 el lun 1-3).

## Prueba en el navegador

Chrome sin ventana por el protocolo de depuración (guion en el scratchpad de la sesión, basado en el de la 192,
`hechos/notas/s-20261113T074721-a71b7338-clics-no-lo-se.mjs`), `python3 -m http.server 8196`, «Probar sin código»
(`?probar=1&ejercicio=N&nivel=1|2|3`, nunca un código de alumno ni AJJN). **Cada ejercicio de los tres bloques, en los tres niveles, a 375 y a
1200 px: 66 recorridos**, cada uno con 7 ítems contestados al azar (salen aciertos y fallos en todos los recorridos de palabras y ampliación;
en el ej. 1 de las tildes el azar casi nunca pasa el paso 1, trampa conocida) y un «No lo sé».
- **Consola: cero errores** en los 66. **Ningún desborde horizontal.**
- Etiqueta «Nivel N · ●●○» visible en todos los ítems; aviso «Ampliación» en la introducción de los cuatro ejercicios de la ampliación.
- Tras cada fallo, la buena queda a la vista (en verde en el hueco, o marcada entre las opciones): 0 fallos sin la buena.
- «No lo sé»: la tarjeta de ayuda sale y el ítem siguiente es otro en los 66.
- Feedback leído en una muestra de cada ejercicio y nivel: dice la regla con la palabra o la frase del ítem.
- A mano con Claude in Chrome: el ej. 1 de las tildes acertando los dos pasos (tónica y clase), suma el punto.
Capturas a 375 px de la introducción y del primer fallo de cada ejercicio, en el scratchpad (no se suben).

## Tabla de ★ al día (para las tareas del panel de la U7, la U8 y junio)

**Publicados hoy**: `ortografia` (45), `ortografia-letras` (65), `ortografia-puntuacion` (66), `ortografia-palabras` (67) y
`ortografia-ampliacion` (68). Sin publicar: `ortografia-tildes` (64), con reabierta MEDIO y plazo jue 18-2.

**Plan A** (las tildes publicadas antes del jue 25-2): el de siempre. Líneas literales para el editor del panel:

| Paquete | ★ (línea literal) | Ejercicio | Bloque publicado hoy |
|---|---|---|---|
| U7 · 1 (lun 1-3) | `['ortografia-tildes', 1]` | La sílaba tónica | no |
| U7 · 2 | `['ortografia-tildes', 2]` | ¿Lleva tilde? | no |
| U7 · 3 | `['ortografia-tildes', 3]` | Diptongos e hiatos | no |
| U7 · 4 | `['ortografia-tildes', 4]` | Las palabras de Matemáticas | no |
| U7 · 5 (lun 19-4) | `['ortografia-palabras', 1]` | ¿Junto o separado? | **sí** |
| U8 · 1 (lun 26-4) | `['ortografia-letras', 2]` | ¿b o v? | **sí** |
| U8 · 2 (desde el mar 4-5; el 3-5 es festivo) | `['ortografia-letras', 3]` | ¿g o j? Y la diéresis | **sí** |
| U8 · 3 | `['ortografia-letras', 4]` | Otras letras: ll, y, rr, c, z, x… | **sí** |
| U8 · 4 | `['ortografia-puntuacion', 2]` | El punto y la coma | **sí** |
| U8 · 5 | `['ortografia-puntuacion', 3]` | Dos puntos, puntos suspensivos y el saludo | **sí** |
| U8 · 6 | `['ortografia-palabras', 2]` | Suenan igual, se escriben distinto | **sí** |
| Junio · repaso 1 (lun 14-6) | `['ortografia-palabras', 3]` | Números y símbolos | **sí** |
| Junio · repaso 2 (lun 21-6) | `['ortografia-puntuacion', 4]` | El correo al profesor | **sí** |

**Plan B** (si las tildes no están publicadas el jue 25-2), el de la 141 y la 142: la U7 · 1-4 adelanta los cuatro ★ ya publicados de la U8
(`['ortografia-letras', 2]`, `['ortografia-letras', 3]`, `['ortografia-letras', 4]`, `['ortografia-puntuacion', 2]`) y las tildes pasan a la
U8 · 1-4. Desde hoy la U7 · 5 (`['ortografia-palabras', 1]`) ya no depende de nada: está publicado.
**Regla de sustitución**: si el ★ de un paquete es de un bloque sin publicar, va el siguiente ★ del plan que ya esté publicado, y el saltado
ocupa el primer hueco libre. Los paquetes, no las fechas.

## La ampliación entre los «a elegir» de la U8 (decisión de Juan Luis del 13-11)

Nunca ★. Un ejercicio de la ampliación por paquete, en la lista `elegir` de la tarea, junto al ★ de ortografía con el que tiene que ver
(cuenta como cualquier «a elegir» si el alumno lo elige; `elegir` admite hasta 15). Cuatro ejercicios para seis paquetes: los dos primeros
paquetes de la geometría sin ampliación no pierden nada, y así cada uno cae después del ★ que lo prepara.

| Paquete | ★ de ortografía de esa semana | A elegir (línea literal) | Ejercicio de la ampliación | Por qué ahí |
|---|---|---|---|---|
| U8 · 1 | `['ortografia-letras', 2]` ¿b o v? | — | — | primera semana de la unidad |
| U8 · 2 | `['ortografia-letras', 3]` ¿g o j? | `['ortografia-ampliacion', 2]` | Formas verbales que se escriben mal | *dijiste*, *condujo*, *tradujeron*, *yendo*: letras (j, y) en verbos |
| U8 · 3 | `['ortografia-letras', 4]` Otras letras | `['ortografia-ampliacion', 3]` | Siglas, abreviaturas y prefijos | *antirrobo*, *semirrecta* (r / rr tras prefijo) |
| U8 · 4 | `['ortografia-puntuacion', 2]` El punto y la coma | — | — | el punto y coma lo prepara el ★ de esta semana |
| U8 · 5 | `['ortografia-puntuacion', 3]` Dos puntos… | `['ortografia-ampliacion', 4]` | Puntuación avanzada | punto y coma, dos puntos, raya, comillas: después de los dos ★ de puntuación |
| U8 · 6 | `['ortografia-palabras', 2]` Suenan igual… | `['ortografia-ampliacion', 1]` | porque, por qué, porqué, por que | palabras que se confunden |

Si las tildes van por el plan B y ocupan la U8 · 1-4, la ampliación se queda en los mismos paquetes: no depende del ★ de la semana para
funcionar, solo lo aprovecha.

**La tabla de ★ del calendario del curso** (`apuntes-1eso-bilingue/comun/CALENDARIO-CURSO-2026-27.md`, «Ortografía en las tareas semanales
de la app») **no se edita desde este reparto**: la actualiza Juan Luis, o una sesión de los apuntes con esta tabla.

## Hallazgos fuera de criterio (decide Juan Luis)

1. **Erratas en el texto que se ve al fallar en «Suenan igual, se escriben distinto»** (`explicacionHomofono` de `ortografia-palabras/logica.js`):
   la segunda frase empieza en minúscula tras punto («Aquí va <b>hola</b>: el saludo. «ola» es…»); «hasta: la palabra que marca un límite:
   hasta mañana» lleva dos dos puntos seguidos; y ««bienes» es las cosas que alguien tiene» no concuerda. No es regla de oro ni contradice a
   la buena (por eso se publica), pero en una práctica de ortografía se nota. La ayuda de «No lo sé» ya lo hace bien (`porQueHomofono`, tarea
   192). Propuesta: una reabierta MEDIO corta de la 138 que use en el feedback la misma frase que en la ayuda.
   En los clics se ve lo mismo en otros feedback: tras «✗ No es correcto.» la explicación empieza en minúscula («tan bien, separado, es…»,
   «diecisiete, no «diez y siete»…» en palabras; «haya, no «haiga»…» en la ampliación): citan la palabra al principio y en minúscula. En
   «Las letras», ya publicada, las reglas empiezan en mayúscula. Si Juan Luis quiere igualarlo, cabe en esa misma reabierta (y otra de la 139).
2. **Regla de la apócope** (`ERRORES['sin-apocope']`): «delante de un nombre masculino se escribe la forma corta: primer, tercer, algún,
   ningún, veintiún» no dice «en singular», y el alumno conoce «los primeros días». Es verdad para cada ítem que la usa. Mejorable en la misma
   reabierta del punto 1.
3. **Frases sobre «el instituto»** en «Números y símbolos»: «En el instituto hay quinientos alumnos», «El salón de actos tiene doscientas
   butacas», «Hoy celebramos el decimoquinto aniversario del instituto». El alumno las leerá como del suyo. No es un dato que se pueda
   comprobar como falso, pero si los números no cuadran con el IES, mejor «mi colegio de antes» o «el club».
4. **La introducción de los homófonos usa como ejemplo dos frases del banco** («El fontanero cambió el _ del lavabo», «Mi tía _ gemelos el año
   pasado»): quien la lee tiene esos dos ítems resueltos.
5. **Frases con «hoy» raras fuera de su día** («Hoy es el _ día de clase», «Hoy, por fin, empiezan las vacaciones») y en la ampliación «Llovía a
   cántaros; no obstante, salimos al patio». Menores.
6. **Tildes, ej. 4**: «Dividir por pasos, siempre igual, es un ___» (algoritmo) y «Con los datos de la clase hacemos una tabla de ___»
   (estadística) son forzadas, y en el nivel 1 dos frases empiezan por «En 17 : 5», donde la del cociente ya dice el resto. Puede ir en la
   reabierta de la 135 si quien la cierra quiere.
7. **La etiqueta de nivel dice el nivel del alumno, no el del ítem**: con `?nivel=3` puede salir «mesa» (nivel 1) con «Nivel 3 · ●●●». Es lo que
   hace `elegirDeNivel` a propósito (mezcla los inferiores) y lo mismo en los bloques ya publicados; lo digo por si choca al probar.

## Cómo probarlo en 1 minuto
https://salasgar.github.io/Ejercicios-interactivos/practicas/ → sección «Ortografía»: salen «Palabras que se confunden» y «Ampliación». En local:
`python3 -m http.server 8196` → `http://127.0.0.1:8196/practicas/ortografia-ampliacion/?probar=1&ejercicio=1&nivel=2`.

## Segunda pasada: solo lo de la tercera reabierta de la 135 (14-11, sesión `s-20261114T120759-e1c97fc9`)

Reclamada otra vez la 196 a las 12:08Z, tras la terminada `hechos/terminadas/135--s-20261114T115719-c2e98c78.md` (commit 3bc3808). Revisado
**solo lo reabierto**: los seis cambios de 3bc3808, en el código, con la explicación y la ayuda de «No lo sé» que salen para cada ítem (volcadas
con node), y los tests (`node --test tests/practicas-ortografia-comun.test.js tests/practicas-ortografia-tildes.test.js`: 36/36).

| Punto de la tercera reabierta | Cambio en 3bc3808 | Veredicto |
|---|---|---|
| 1. *jamás* (ej. 2, N1) | → *menú* | bien (*menu* no existe; la 196 lo había cotejado en el DLE) |
| 2. *pie* (ej. 2, N3) | → *bien* | bien |
| 3. *Luis* (ej. 3, N1) | → *triunfo* | **MAL**: tocar la «o» da *triunfó*, que también vale (como *descuido / descuidó*) |
| 4. «se duplica y la otra también» (ej. 4, N3) | → «Si al doble de una cantidad le corresponde el doble de la otra, y al triple el triple, son directamente ___» (*proporcional*) | **frase mal construida**: «son … proporcional», sin concordancia; el nivel 3 tiene 16 (el mínimo) y no se puede quitar |
| 5. «Dos rectas que nunca se cortan» (ej. 4, N2) | → «Dos rectas de un plano que nunca se cortan son ___» | bien |
| 6. «Aún los más pequeños pueden hacerlo» (ej. 3, N3) | → «Aun los más pequeños lo entienden a la primera» | bien: «todavía» ya no cabe |

Veredicto: **`ortografia-tildes` (64) NO SE PUBLICA**. *triunfo* sola se podía quitar aquí (el ej. 3, N1, quedaba en 15 ≥ 12, con un 53 % con
tilde), pero *proporcional* hay que escribirlo, y con el bloque parado de todas formas es mejor que la reabierta sustituya las dos y el nivel 1 se
quede en 16. Cuarta reabierta de la 135, MEDIO, ~20 min, plazo jue 18-2: `hechos/reabiertas/135--s-20261114T120759-e1c97fc9.md`. Cuando se cierre,
otra vez la 196 para revisar solo esos dos ítems y publicar.

Sin cambios en el código ni en `catalogo.js`: esta pasada no tiene commit de código. Sin prueba en el navegador (no se publica nada; los dos
fallos se ven en el banco). La tabla de ★ y la propuesta de la ampliación de arriba siguen igual: el plan A sigue a tiempo (las tildes hacen falta
publicadas el jue 25-2).

**Para quien publique las tildes la próxima vez**: además de los dos sustitutos nuevos, pasa a cada palabra suelta de los ej. 2 y 3 la prueba de
«la tilde en cada vocal (o en cada sílaba): ¿sale alguna palabra del DLE?». Es lo que se le escapó a *triunfo*.
