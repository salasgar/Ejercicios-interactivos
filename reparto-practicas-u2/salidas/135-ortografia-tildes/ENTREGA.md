# ENTREGA · Tarea 135 · Ortografía: las tildes (`ortografia-tildes`, id 64)

Sesión: `s-20261105T234411-1c82015c`. Fecha: 2026-11-06. Sin publicar (`disponible: false`; la publica la 141).

## Ficheros entregados

`practicas/ortografia-tildes/{logica,practica,textos}.js` (sustituyen el esqueleto de la 134; `index.html` y `estilos.css`
sin cambios) y `tests/practicas-ortografia-tildes.test.js` (28 tests).

## Ítems por ejercicio y nivel

| Ejercicio | Nivel 1 | Nivel 2 | Nivel 3 |
|---|---|---|---|
| 1 La sílaba tónica (dos pasos) | 16 (5 agudas, 5 llanas, 6 esdrújulas) | 16 (5, 5, 6) | 16 (4 agudas, 4 llanas, 4 esdrújulas, 4 sobresdrújulas) |
| 2 ¿Lleva tilde? | 16 (8 con, 8 sin) | 16 (8, 8) | 16 (8, 8: 4 adverbios en -mente, 4 monosílabos, 4 mayúsculas) |
| 3 Diptongos e hiatos | 16 (8, 8) | 16 (8, 8) | 15 palabras (8, 7) + 4 frases aún/aun (2 y 2) |
| 4 Palabras de Matemáticas | 16 (8 con tilde, 8 sin) | 16 (8, 8) | 16 (8, 8) |

## Cómo está hecho

- `acentuar(silabas, tonica)`: el motor de reglas (agudas, llanas, esdrújulas, sobresdrújulas, hiato con i/u tónica, monosílabos,
  la y final y la s tras consonante como consonantes, u muda de que/qui/gue/gui). Cada palabra de los bancos se escribe a mano
  con partición, tónica **y forma correcta** (`"'lá-piz"`, `"'fá-cil|mente"`); el test comprueba que el motor da esa forma en los
  195 ítems, más una tabla aparte de 55 palabras, y que cada sílaba tiene un solo núcleo. Las explicaciones salen del motivo
  (`razon`), así que dicen la regla de **esa** palabra.
- El ejercicio 4 usa la misma notación: la explicación y el test también pasan por el motor, no solo por la tilde de la cadena.

## Decisiones donde la ficha dejaba margen

1. **Ejercicio 3: se toca la letra, no la sílaba.** Con las sílabas partidas ya se vería si hay hiato o diptongo (`di-a` / `rui-do`)
   y no habría nada que decidir; con las letras, el alumno decide pronunciando. Piezas: las letras de la palabra (≤ 10), `unidas`.
2. **Ejercicio 1, nivel 3: cuatro botones** (aguda, llana, esdrújula, **sobresdrújula**). Con tres, una sobresdrújula tendría dos
   respuestas defendibles. Niveles 1 y 2, tres botones.
3. **Nivel 3 del ejercicio 3** lleva 4 frases de aún/aun (dos y dos) como hueco, con «todavía»/«incluso» en la explicación.
4. **`río` y `frío` no entran** (aunque la ficha los nombra en el nivel 1 del 3): su forma sin tilde, «rio»/«frio», está en la lista de lo
   que nunca es distractor. Sustituidos por día, tía, país, raíz, maíz, oír, baúl, María.
5. **Ejercicio 4 sin «más»** (la ficha lo nombra): su tilde es diacrítica (la 45 la trabaja) y el motor no la modela; entra «también».
6. `veintiún` se escribe como 2 sílabas (vein-tiún); `ci-lin-dro`, `trian-gu-lo` y demás particiones, a mano y revisadas.

## Cómo probarlo

`npm run servir`, `http://localhost:8080/practicas/ortografia-tildes/?nivel=1|2|3` → «Probar sin código».
Hecho con clics (Chrome): ej. 1 acertando los dos pasos; ej. 2, 3 y 4 fallando (feedback con la regla de la palabra);
sin errores; a 375 px sin desbordar.

## Propuestas (no hechas)

- Los nombres «Luis», «Lucía», «María», «Ángel», «Óscar» y «Úrsula» están en los bancos: `sin-nombres-de-alumnos` en verde, pero si un
  alumno real se llama así, que lo decida Juan Luis (son nombres corrientes).
- La 141 debería leer **todas las frases del ejercicio 4** (48) y las particiones silábicas; el motor no las puede juzgar.

## Reabierta del 9-11 (sesión `s-20261109T104904-d4069022`, commit d553c8a)

Lo hizo la 135 por la reabierta de la 141 (`hechos/reabiertas/135--s-20261109T101428-e1825b21.md`). **Lo publica la 142** (o una tarea
de publicación nueva): al publicar, la 64 sale con 4 ej. × 3 niveles, sin ítems quitados (todos los bancos siguen con ≥ 16 por nivel).

**Quitado y cambiado por palabras cuya forma sin tilde no es otra palabra:**
- Ej. 1: médico → plátano, música → lámpara, cantará → vivirá, cantó → dormirán, órdenes → rápido, vehículo → próximo.
  Además, por el mismo motivo (no estaban en la lista de la 141): libro (*libró*) → cama.
- Ej. 2: música → plátano.
- Ej. 3: peine → treinta, aire (*airé*) → cuatro, cuídate (voseo *cuidate*) → destruí, descuido → buitre, vehículo → caída;
  «Lucía aún está en clase» → «Son las tres y Lucía aún no ha salido de clase.».
- Ej. 4: «El 7 de 0,7 es una décima» (falso) → «Un euro son cien céntimos.»; paralelogramo (variante *paralelógramo*) → cubo
  («Un dado tiene forma de cubo.», mala *cúbo*).

**Textos:** «TÉ-le-fo-no» → «te-LÉ-fo-no» (es y en); «mú-si-ca» → «MÚ-si-ca»; en la introducción del ej. 3, «cuí-da-te» → «des-truí».
`explicacionTonica1` y el paso 2 del ej. 1 ya no escriben la palabra sin tilde: usan `item.escrita` y `silabasMarcadas` («MÉ-di-co»).

**Test nuevo:** `HOMOGRAFAS_SIN_TILDE` (médico, música, cantará…, libro, aire, décima, paralelogramo…): falla si alguna vuelve a un banco.
Tests propios 75/75 con `practicas-comun`; `npm test` 1741/1741. Sin repetir los clics en el navegador (los `montar` no cambian salvo
la pregunta del paso 2 del ej. 1, que ahora usa `silabasMarcadas`; `node --check` en verde).

**Pendiente de revisión a mano por la 142:** las 8 palabras nuevas del ej. 1 y las dos de las frases del ej. 4 (céntimos, cubo).

## Reabierta 2 del 9-11 (sesión `s-20261109T114919-4bdd2b23`, commit b8965f3)

Por la segunda reabierta, la de la 142 (`hechos/reabiertas/135--s-20261109T105938-1997ca78.md`). **No se publica aquí**: lo hace la
tarea de publicación nueva que propone la terminada de la 142 (64, 67 y 68). `catalogo.js` sin tocar.

**Cotejadas en el DLE** (Chrome, dle.rae.es, 9-11): *ahincar*, *antiguar* (desusado) y *adema* (= ademe) están, así que *ahínco*,
*antiguo* y *además* salen. La búsqueda del DLE lematiza (*lampara* → lampar, *musica* → musicar, *ahinco* → ahincar), y con ella se
comprobaron los sustitutos: *piramide*, *ciempies*, *lenguaje*, *raton* y *miercoles* solo dan su propio lema; *muestraselo* da
mostrar y *digamelo*, decir (la misma palabra).

**Quitado y cambiado:**
- Ej. 1, N1: lámpara (*lampara*, de lampar) → **pirámide**.
- Ej. 1, N3: además (*ademas*) → **ciempiés** (aguda); antiguo (*antiguó*) → **lenguaje** (llana); cómetelo y explícaselo (voseo
  *comételo*, *explicáselo*) → **muéstraselo** (voseo *mostráselo*, otras letras) y **dígamelo** (de usted). Siguen 4 por clase.
- Ej. 2, N1: además → **ratón** (aguda con tilde; el nivel sigue 8 con / 8 sin).
- Ej. 3, N3: ahínco (*ahincó*) fuera, sin sustituto: 14 de tocar (7 con, 7 sin) + 4 de aún.
- Ej. 4, N2: las tres frases «En 356 hay 5 / 3 / 6 ___» (en 356 hay 35 decenas y 356 unidades) → «748 son 7 centenas, 4 ___ y 8
  unidades.», «356 son 3 ___, 5 decenas y 6 unidades.», «295 son 2 centenas, 9 decenas y 5 ___.».

**Reglas que ve el alumno:**
- Monosílabos (ej. 2): «*fue* tiene una sola sílaba y no lleva tilde: las palabras de una sílaba solo la llevan para distinguirse de
  otra que se escribe igual (tú / tu).»
- Diptongo (introducción del ej. 3, y el comentario de `nucleoValido`): «una abierta y una cerrada, en cualquier orden, o dos cerradas».
- «Las mayúsculas también llevan tilde» solo cuando la tilde va en la mayúscula (`letraConTilde(item) === 0`): sale en Ángel, África,
  Óscar y Úrsula, ya no en Matemáticas (ej. 2 y ej. 4).
- Ej. 3, esdrújulas (náutico, aéreo, héroe): «Es esdrújula, y las esdrújulas llevan tilde siempre», sin «acaba en vocal».

**Recuento:** ej. 1 16/16/16 · ej. 2 16/16/16 · ej. 3 16/16/14 (+4 de aún) · ej. 4 16/16/16. Motor sin tocar.

**Test:** `HOMOGRAFAS_SIN_TILDE` con lampara, ahinco, antiguo y ademas; lista propia `VOSEO` (cuidate, cometelo, explicaselo); y
asertos nuevos para las cuatro reglas y para que ninguna frase del ej. 4 sea «En N hay N ___». Propios 75/75 con `practicas-comun`;
`npm test` 1791/1791. Sin clics en el navegador (solo cambian palabras y textos; `node --check` en verde).

**Sin cambiar, como decidió la 142:** casa, cocina, causa, idea (en voseo dan *otra* palabra).
