# Entrega de la tarea 193 · Revisión del «No lo sé» de las unidades 1 y 2

Sesión `s-20261114T150738-c83636b9` (Opus 5.5, ALTO), relevada por `s-20261114T185703-a741c82e` (Opus 5.5, ALTO) cuando
su reclamo caducó con los clics a medias y la entrega sin cerrar. Lo del relevo va en su apartado, al final de «Lo hecho».
Lo que sigue, hasta ese apartado, es de la primera sesión. He revisado las treinta y tres prácticas que escribieron las tareas
183-189. Como en la 190 y la 192, la lectura la hicieron siete subagentes, uno por tarea de escritura, en carpetas disjuntas
y bajo mi sid. Usaron un guion de volcado fuera del repo (`/tmp/rev193/volcar.mjs`): 20 explicaciones por ejercicio e
idioma y, además, un ítem de cada rama o plantilla. Cada subagente corrigió y comiteó su práctica, sin push. Después, yo:
- he leído una muestra de cada lote;
- he pasado un escáner por las 33: respuesta ausente o repetida, «La respuesta es:» y texto detrás de la respuesta;
- he retocado dos tarjetas (redondeo y divisores);
- he comprobado que los generadores siguen dando los mismos ítems;
- he empezado los clics (los terminó el relevo);
- y, como soy la última de las cuatro revisiones, he quitado la línea del test genérico.

**Las treinta y tres han quedado corregidas.** Lo que más se repetía:
- «La respuesta es: X», con dos puntos entre el verbo y el atributo, en casi todas;
- la respuesta dos veces (al principio, porque se reutilizaba el feedback, y al final), o ninguna;
- la palabra del botón sin comillas y con mayúscula a media frase («La respuesta es Compuesto»).

Lo más grave eran las reglas o consejos falsos en general:
- en `expresion`, «si la frase no dice «todo», no hay paréntesis»;
- en `clasificador`, «si se reparte en partes iguales, m.c.d.» (falso en las trampas de m.c.m.);
- en `imposibles`, «con tres números ya no coincide»;
- en `potencias10`, «el «and» marca dónde empiezan las unidades sueltas»;
- en `mental`, «corrige la diferencia» en 27 · 99, que lleva a restar 1;
- en `dictado`, «si un grupo no aparece, pon ceros», que no cubre el cero dentro del grupo;
- en `exponente`, «2 elevado a 2 es 2 por sí mismo 2 veces (no 2 · 2)».

Había también letras antes de la U6:
- en `criba`, «p · p»;
- en `division`, «D = d · q + r».

**Lo que no se ha tocado:**
- los generadores, las opciones, los enunciados y el feedback;
- las exclusiones de casos de examen.

Los generadores están comprobados: 300 ítems por ejercicio con la misma semilla dan el mismo hash en `8543b2d` (el
reclamo) que en `a6e18aa`, en las 33. Cuando el fallo venía de un feedback que se reutilizaba, la tarjeta se ha escrito
por su cuenta y el feedback va abajo, en los hallazgos.

## Lo hecho (veredicto por práctica)

### Unidad 2

| Práctica | Veredicto | Qué se ha corregido | Commit |
|---|---|---|---|
| divisores | corregida | Ej. 1: la respuesta salía dos veces. Ej. 2-4: con x = y (1 · 4 = 4) valen las tres relaciones y decía «las dos valen», y la pregunta del paso 1 era «¿el 4 en la tabla del 4, o el 4 en la tabla del 4?». Ej. 5: la pareja de la tarjeta era la primera del orden barajado («12 es múltiplo de 2» con 24 : 12 = 2, contra el propio consejo); ahora `solucionExplicada`, el grande con un pequeño. **Retoque de la sesión**: «Una solución es…» pasa a «La respuesta es …, por ejemplo». Ej. 6 (juego), `sinAyuda`. | 97616c8, 597c881 |
| semaforo | corregida | Ej. 1-2: «Ninguno» como el botón. La lista de 5-6 líneas se queda: es una línea por botón y es lo que el alumno tiene que hacer. Ej. 4, reescrita: antes era «prueba cifras hasta que se cumpla», con la cifra al principio, y el criterio del 11 hablaba de «las cifras» y no de sus sumas. Ahora sigue el método de los apuntes (suma lo que ves y qué cifra falta; la única par; el 11 con las sumas de lugar par e impar). | 25cd229 |
| rectangulos | corregida | Ej. 1: las parejas salían dos veces; ahora nombra los anchos que cierran y un ejemplo. | a967678 |
| recta | corregida | Ej. 1-2: la lista termina en «y». | 15e0886 |
| criba | corregida | «p · p» pasa a «multiplicado por sí mismo (hasta su raíz entera)». Ej. 3: la cuenta mezclaba la raíz entera con el primo siguiente («9 · 9 = 81 ≤ 91 < 11 · 11»); ahora «7 · 7 = 49 no pasa de 91, pero 11 · 11 = 121 sí». Los compuestos, en dos pasos y una sola frase final. Ej. 1 sigue con `sinAyuda` (comprobado: va por pasos con `sesion.aciertos`). | 1be9f93 |
| arbol | corregida | Ej. 1: «vale cualquiera; aquí, empezando por el primo más pequeño». Ej. 2: la respuesta, como los botones. Ej. 3: solo enseñaba las ramas rellenas; ahora deduce cada hueco en orden con su cuenta (`pasosCompletar`, comprobado en 3000 ítems). | b4d25d9 |
| divisiones | corregida | Ej. 1: «2 es el menor primo que divide a 360» era una tautología repetida en cada paso. Ahora: «prueba los primos en orden», el criterio de cada paso, la respuesta como se pulsa y la factorización con potencias. | 0a3f426 |
| fabrica | corregida | Ej. 1: la respuesta dos veces, con un número que no está en el enunciado. Ej. 2: «5 = 5» pasa a «5 es primo», y «One is not enough» pasa a «Not all of them are enough»; **pierde `noLoSe`** (es un sí/no de leer la factorización). **Retoque del relevo**: con un solo primo en el divisor, «Vale» / «No vale» en vez de «Todos valen» / «Alguno no vale». | 463bcbd, 2ceb108 |
| por-primos | corregida | Ej. 1-2: «esta es la más corta. La respuesta es…» la presentaba como la única; ahora «La respuesta es …, por ejemplo: es la que necesita menos toques, pero vale cualquier múltiplo (divisor) de …» (cierto: la práctica deja multiplicar y dividir). «Los demás primos ya están bien» solo cuando los hay. Ej. 4 con m.c.d. 1, la frase del feedback. | 90df1d7 |
| venn | corregida | Ej. 1 daba el m.c.d., pero lo que se contesta es dónde va cada ficha. Ej. 2-4: la regla se aplica con los primos del ítem y no se repite; sin primos comunes, «La respuesta es m.c.d. = 1». | 3365fdb |
| imposibles | corregida | Ej. 1: la segunda línea repetía la regla. Ej. 2: con tres números usaba el feedback, que da una regla falsa (3, 4, 5); ahora tiene su propia cuenta. Ej. 3: «partes iguales, lo más grande posible» era falso en las plantillas del «mayor número de bolsas»; ahora usa la pregunta clave de los apuntes. | a2ce8d9 |
| clasificador | corregida | Ej. 1-2: el consejo era falso en las trampas de m.c.m.; ahora «“mayor” y “menor” no deciden; ¿partes iguales (m.c.d.) o un múltiplo de todos (m.c.m.)?». Ej. 3: la respuesta es el texto de la razón elegida. | 5a1258a |
| reloj | corregida | Los tres dicen qué se pide y acaban en la frase de respuesta. Ej. 1: las listas paran en el primer múltiplo común. Ej. 2: el m.c.m. por factorización (no salía de ninguna cuenta); pasa los minutos a horas y suma parando en la hora en punto. Ej. 3: en «uno es múltiplo del otro», la división. | f752ffb |
| baldosas | corregida | Qué se pide, cuentas en dm y frase de respuesta. Ej. 1: el m.c.d. por listas hasta 50 y por factorización con números mayores. Ej. 3: el m.c.d. de las cuerdas salía sin cuenta. | 31cbcdf |
| errores | corregida | La tarjeta era el feedback tal cual, sin regla y sin respuesta, y el ej. 3 decía el nombre dos veces. Ahora hay una tarjeta por ejercicio: regla, línea mala, «bien hecho sería…» y la respuesta. Con «m.c.d. = 0», dice que el 1 es el **único** divisor común. | d059ce3 |
| leelo | corregida | Ej. 1-2: la regla va delante («cada símbolo con su palabra, en orden») y la coma de GCD(a, b) se lee «and». El consejo -teen/-ty salía con el 20, que no tiene pareja, y faltaba con fifty; ahora sale solo si la hay. Ej. 3: la palabra y la frase completa. «zero_multiple», como los apuntes. | 0f0617e |
| factorizaciones | corregida | La comprobación iba detrás de la respuesta y ahora va dentro, entre paréntesis. Ej. 2: la regla delante y fuera el «Sí:»/«No:» inicial. | 13bdd58 |
| fichas-de-pablo (`fichas-del-parchis/`) | corregida | Ninguna tarjeta terminaba en la respuesta, y el ej. 5 ni decía sí o no. Arrastraba «125 : 25 = 5 = 5», «quedan 1 amarilla» y «7 = 7». La regla del producto decía «sin sumar nada» y ahora dice «las de uno más las del otro». | a67fcea |

### Unidad 1

| Práctica | Veredicto | Qué se ha corregido | Commit |
|---|---|---|---|
| parentesis | corregida | Ej. 3: «resta negativa» (en la U1 no hay negativos) pasa a «se quita más de lo que hay». La tarjeta enseña ahora una agrupación imposible del propio ítem, con su motivo (`agrupacionImposible`). Las listas terminan en «y». | a0579f3 |
| jerarquia | corregida | Ej. 4: «Falta el paréntesis del numerador; Falta…» hablaba como si el alumno hubiera fallado y no decía por qué. Ahora explica cada grupo con sus números («sin ellos, solo se dividiría entre 3») y resuelve la línea. Ninguna tarjeta anuncia el atajo de las cadenas. | 0a90c91 |
| exponente | corregida | Ej. 1: nombra el paréntesis. Ej. 2: con base = exponente decía «(no 2 · 2)», que es justo 2²; «multiplicado por sí mismo e veces» pasa a «un producto de e factores iguales a b», como los apuntes; **gana `noLoSe`** (los tres subtipos son de calcular o construir). | ec9e92c |
| raiz | corregida | Ej. 2 («¿puede ser?»): la regla delante y el botón entre comillas. Ej. 3: la frase de respuesta usa las palabras del enunciado («se forman 15 filas y sobran 9 sillas»), con singular para 1. | ec4e39e |
| division | corregida | Ej. 2 y 4 usaban letras («D = d · q + r»). Ej. 1 dice por qué no cabe otra caja. Ej. 2 inverso dice por qué no vale la otra división. Ej. 3, con unidad y singular. Ej. 4: la regla salía dos veces, la segunda con la glosa inglesa; ahora sale una vez. | 5617f68 |
| expresion | corregida | Ej. 1: «la frase no dice «todo», así que no hay paréntesis» es falso («31 menos la suma de 8 y 2», del ej. 2). Ahora usa la jerarquía. | 572a5e3 |
| redondeo | corregida | Ej. 3: «La respuesta es Sí» y, en contexto, «(la cifra decisiva es 1)» sin respuesta. **Retoque de la sesión**: en «estimar», «Mi estimación es…» pasa a «La respuesta es 17 900 de estimación y 114 de diferencia», y cuando se elige el orden, «(o a cualquier otro orden de los que se ofrecen)». | 18118f1, 76618fa |
| constructor | corregida | Ej. 1: la respuesta, al final. «Más cercano a…» no daba método; ahora, el vecino de abajo y el de arriba con sus distancias. Ej. 2: la regla salía dos veces y faltaba la respuesta. Ej. 3: los grupos iban separados con «·», que en la U1 es el producto. **Retoque del relevo**: en «par más pequeño» e «impar más grande» decía «la mejor es el 8» sin porqué; ahora, la par más grande (la impar más pequeña) al final para que las pequeñas (las grandes) vayan delante, y la excepción del 0 con las dos cuentas («con el 2 al final saldría 3 092…; con el 0 al final, 2 390»). | 5add3ef, 1980429 |
| distributiva | corregida | Ej. 1 (resta): hablaba de dos trozos que se suman. Ej. 3: arrastraba «se les quita dos columnas». | c3b4d5a |
| potencias10 | corregida | Ej. 1: el número dos veces. Ej. 2: la regla del «and» era falsa en «five hundred and sixty thousand», y los grupos iban con «·». Ej. 3: minúscula y «Are different numbers». En ningún sitio dice que billion sea 10¹². | 93ecd81 |
| dictado | corregida | Ej. 1 y 3: los grupos, delante y detrás de «thousand»/«mil»; el de detrás siempre lleva tres cifras (17 095), sin «·». Ej. 2: la regla, delante. Ej. 3 (fichas): «un» e «y» no son «mal escritas»; ahora dice «sobran», con el porqué de cada una. | d327a96 |
| mental | corregida | Ej. 1: el consejo no decía qué se resta («27 · 99 = 27 · 100 − 27, no − 1»). | 88982d4 |
| especiales | corregida (poco) | Un párrafo acababa en dos puntos. | 2d371bd |
| errores1 | corregida | Igual que `errores`: la regla delante, la línea mala, «bien hecho sería…» y la respuesta una vez. En el ej. 4, la línea que falta. | 4c4a6b4 |
| propiedades | corregida | Ej. 1: la regla, como en la hoja de la U1 semana 3; la nota de la base ajena va delante. Ej. 2: «mira primero si hay potencias de potencias» no era una regla; ahora sí, con la cuenta de la hoja. Ej. 3: la regla de la tabla, delante. | 5b69045, eb458b8 |

El test genérico: `tests/practicas-no-lo-se.test.js` ya no se salta ninguna práctica (a6e18aa). **Esta es la última de las
cuatro revisiones (190-193) en cerrar**: las 89 pruebas pasan sin la línea, porque todas las prácticas del catálogo declaran el
«No lo sé».

`noLoSe` / `sinAyuda`:
- `noLoSe` queda solo en los de procedimiento: fabrica ej. 2 lo pierde y exponente ej. 2 lo gana. Las dudas de la ENTREGA de
  la 184 están decididas: arbol ej. 2 y criba ej. 2 y 3 se quedan sin él.
- Se quedan con `noLoSe` los mixtos donde predomina calcular: semaforo 1-2, raiz 2, divisiones 3 y baldosas 1.
- `sinAyuda` solo en divisores ej. 6 (juego) y criba ej. 1 (por pasos), los dos comprobados en el código.

Lo que **no** se ha cambiado a propósito: el consejo detrás de la respuesta («La respuesta es 12. Consejo: …»). Es lo que
hace el modelo `fraccion-de`, ya revisado en la 190.

### Lo que hizo el relevo (`s-20261114T185703-a741c82e`)

- Heredados, sin tocarlos: los 37 commits de la primera sesión (`8543b2d`..`a6e18aa`), con `npm test` en verde y los generadores
  intactos. Los he subido yo, junto con lo mío.
- Clics de las 33 prácticas (ver «Cómo se ha probado»), pasada del escáner de la primera sesión por las 33 (no sale nada nuevo:
  lo que marca es lo que ella dejó a propósito, el consejo detrás de la respuesta y las frases de respuesta con otra forma, como
  «La respuesta, hasta el 60, es…» o «Respuesta: el lado tiene…») y lectura de las capturas.
- Dos retoques, uno por práctica, con su test:
  - `fabrica` ej. 2 (2ceb108): con un solo primo en el divisor, «Todos valen» / «Alguno no vale» sonaba raro; ahora «Vale» /
    «No vale». El test comprueba que la frase de «todos» sale solo con dos o más primos.
  - `constructor` ej. 1 (1980429): en «par más pequeño» e «impar más grande» la tarjeta decía «la mejor es el 8» sin decir cómo
    se elige, así que no servía para el siguiente. Ahora da el método: al final, la par más grande (la impar más pequeña), para
    que las pequeñas (las grandes) vayan delante. Lo he comprobado en 20 000 ítems y es verdad siempre, salvo un caso con el 0:
    con 2, 0, 9, 3 el menor par es 2 390, no 3 092. Para ese caso la tarjeta pone las dos cuentas. El test comprueba las tres
    ramas en 6000 ítems. El feedback de acierto o fallo sigue con su frase de antes (no se toca).

## Cómo se ha probado

- **Lectura**: 20 explicaciones por ejercicio e idioma y una de cada rama, con las cuentas comprobadas. Después he leído una
  muestra de cada lote (semaforo 4, divisores 5, jerarquia 4, parentesis 3, redondeo 3, por-primos 1, divisiones 1, reloj 2,
  venn 1, propiedades 2 y mental 1) y he pasado el escáner de las 33 (300 ítems por ejercicio e idioma).
- **Tests**: los 33 `tests/practicas-ayuda-<slug>.test.js` vigilan ahora lo corregido. Por ejemplo:
  - ningún «La respuesta es:», y la respuesta una sola vez;
  - las cuentas de los pasos, evaluadas;
  - la cifra única de semaforo 4;
  - los huecos de arbol 3;
  - la agrupación imposible de parentesis, que de verdad falla;
  - los grupos de dictado, que reconstruyen el número;
  - nada de letras, y que billion nunca sea 10¹².

  `node --test tests/practicas-no-lo-se.test.js` con los de ayuda y los propios: en verde en cada lote. `npm test`:
  **2294/2294** tras `a6e18aa` y **2295/2295** tras los retoques del relevo (`1980429`).
- **Generadores intactos**: el hash de 300 ítems por ejercicio coincide en las 33 entre `8543b2d` y `a6e18aa`, y en `fabrica` y
  `constructor` también tras los retoques del relevo.
- **Clics** (los hizo el relevo; los de la primera sesión murieron con ella en la cuarta práctica): las 33 prácticas,
  cada ejercicio a 375 px y a 1200 px, con Chrome headless por CDP sobre `python3 -m http.server 8193` y
  `?probar=1&ejercicio=<k>` (guion de la 192 con tiempos de espera y diálogos atendidos, en el scratchpad). En cada ejercicio,
  cuatro «No lo sé» seguidos con «Siguiente» entre medias: **224 de 224 bien**. En los 220 que llevan botón: sale la tarjeta las
  cuatro veces, el ítem queda inerte, la tercera ayuda avisa del punto («Ayuda número 3: no pierdes puntos (estás en 0)»), el
  botón de traducción da la otra versión, nada desborda a 375 px, el ítem siguiente es otro y la consola está limpia. Los dos
  idiomas salen en todas (el modo de prueba los alterna). Los 4 sin botón son los `sinAyuda` (divisores ej. 6 y criba ej. 1).
  En `dictado` ej. 1 y 3 el guion marcó «ítem igual al anterior», pero es un falso aviso: el número se oye y no se ve, así que el
  texto del ítem es siempre el mismo; las tarjetas sí cambian. `errores` se repitió con ocho ayudas seguidas: bien. Tras los dos
  retoques del relevo, `fabrica` y `constructor` se volvieron a clicar: bien. Capturas a 375 px de cada ejercicio, leídas a ojo
  una muestra de cada lote.

## Hallazgos fuera de criterio (para Juan Luis)

Son feedback, generadores o textos que ya estaban así y que esta tarea no toca. La tarjeta del «No lo sé» ya dice bien lo
que aquí sale mal. Recomendación general, la misma de la 190 y la 192: **reabrir la tarea dueña de cada práctica para que su
feedback diga lo mismo que la tarjeta**. Los marcados con ★ enseñan algo falso y son los primeros.

**Decisión tuya**
1. **«·» o «×» en la U1.** `docs/no-lo-se.md` dice que la U1 usa «×», pero todas las prácticas de la U1 (enunciados, opciones y
   feedback) escriben «·». Las tarjetas siguen a la práctica para no mezclar. Si quieres «×» en la U1, es un cambio de las
   prácticas enteras, no de la tarjeta. Mi recomendación: dejar «·», que es lo que verán desde la U2.
2. **Decimales en la U1**: `constructor`, `generarComa`, rama `decimal`, saca 689,6 / 689.6 en una práctica de la U1. Va
   contra «nada que no se haya dado» (decimales, desde la U5). Recomendación: quitar esa rama del generador o pasarla a la U5.
3. **Glosa inglesa en el feedback español** de `division` (`TX.puede.no_puede`, `TX.puede.mal_resto`): «(the remainder is always
   less than the divisor)». En la tarjeta la he quitado; en el feedback, ¿se queda como vocabulario?

**Realismo de los contextos (regla del 16-10)**
4. ★ `imposibles`, `generarPuedeNumeros` (ej. 1 con contexto): salen parejas con m.c.d. 1 en el «mayor número de grupos/bolsas»
   (16 y 7: «¿puede salir 1 grupo?»).
5. `clasificador`, LIMPIOS_MCM: «riegas un rosal cada N días» con N hasta 20.
6. `reloj`, `MULTIPLOS` y `TRIOS`: atracciones de la feria que se repiten cada 60 u 80 días (una feria no dura tanto).

**Feedback que enseña mal**
7. ★ `expresion`, `TX.sin.introduccion` y el `explica` de `frase_mas_por`, `frase_menos_por` y `frase_mas_entre` (los usa el
   feedback): «si la frase no dice «todo», no hay paréntesis». Es falso con «la suma de…» del ej. 2. El test propio comprueba
   la frase de la introducción, así que cambiarla es también tocar ese test.
8. ★ `imposibles`, `TX.producto.feedbackTres`: «con tres números ya no coincide» es falso (3, 4, 5). Además, `generarTres` puede
   repetir un número (8, 5, 8).
9. ★ `clasificador`: las razones del BANCO (el feedback) llevan «» en inglés y empiezan en minúscula. `TX.detalle.trampa.en` y
   las opciones `dice_mayor`/`dice_menor` en inglés llevan «».
10. `exponente`, `TX.valor.bien`/`mal`: «multiplicado por sí mismo e veces», y con base = exponente, «(no 2 · 2)».
11. `fichas-del-parchis`, `quedaTxt` (ej. 4 y 5): «125 : 25 = 5 = 5» y «quedan 1 amarilla». `TX.mcd.buena`: «7 = 7 no tienen
    ninguna ficha en común». `TX.mcm.buena`: repite la regla de la introducción.
12. `errores`, `e-mcd-cero` (corregida): dice que el 1 divide a los dos, sin decir que es el único. El comentario del banco dice
    29 plantillas y hay 28. `b-lcm-nombres` en inglés lleva comillas rectas.
13. `errores1`, `explicacion` (feedback): «Bien hecho sería: Con 5…», con mayúscula, y el número de línea dos veces. `par()`
    puede dar «7² y 7² no dependen una de otra».
14. `criba`, `TX.raiz.explicacion` (feedback del ej. 3): «9 · 9 = 81 ≤ 91 < 11 · 11 = 121» mezcla la raíz entera con el primo
    siguiente, y lleva un «<» sin escapar. Lo mismo, «<» sin escapar, en `rectangulos` (`TX.parar`) e `imposibles`
    (`TX.feedbackPuede`).
15. `semaforo`, `explicarCifra` (feedback del ej. 4): empieza por la cifra («La cifra que falta es X») y no da el método.
    `divisores`, `solucionArrastrar` (feedback de fallo del ej. 5): enseña la primera pareja del orden barajado.
16. «·» como separador de grupos en la U1, donde es el producto: `constructor` (`TX.coma.grupos_nombres`), `potencias10`
    (`TX.and.grupos`, `TX.and.por_que`) y `dictado` (`explicarDictado`).
17. Concordancias y puntuación del feedback:
    - `distributiva`, `TX.compensar.explicacion_producto`: «se les quita dos columnas».
    - «sobran 1» en `raiz` (`TX.prob.respuesta`, `TX.comun.sobran`) y en `division` (`TX.cajas.correcto`).
    - `leelo`, feedback del ej. 3: «La frase correcta es: …».
    - `dictado`: «fifty = 50 Ojo…» sin punto (`TX.teen.escritura_ok`), y comillas rectas en `TX.fichas.notas`.
    - `potencias10`: comillas rectas en inglés (`TX.billion.nota_trillion`, `TX.and`).
    - `arbol`, `ayuda.construir`: «todas las puntas sean primos».
18. Menores:
    - `jerarquia`, `intro1` en inglés: «a sum with several operations» (mejor «a calculation»).
    - Números de cinco cifras sin espacio de miles: `exponente` (`cuentaParte`) y `divisiones` ej. 3 (11979).
    - `baldosas`: «baldosas de lado 12» sin unidad.
    - `leelo`, `divisor_pair`: «4 · 8 is a divisor pair of 32» (la pareja es 4 y 8, no su producto).
    - El feedback común de `_comun/relaciones.js` (`explicacionCompleta`), en recta 3 y en divisores: encadena tres o cuatro
      frases con dos puntos. Es correcto, pero pesado.

**Del relevo**
19. **Signos sueltos a 375 px (de la base, no de las tarjetas).** `.cuenta` es `inline-block` (`practicas/_comun/estilos.css`):
    el navegador puede partir el renglón entre la cuenta y el signo que la sigue, y el punto o la coma quedan solos al principio
    del renglón siguiente. Pasa siempre cuando la cuenta llena el renglón, y a veces con cuentas cortas. Lo he medido con seis
    «No lo sé» por ejercicio a 375 px, tarjeta y traducción: **118 signos sueltos en 35 de los 109 ejercicios medidos**
    (son los 110 con botón menos `constructor` ej. 1, que en esa pasada no cargó porque el servidor de prueba cortó la conexión). Los que
    más: `reloj` ej. 2 (18; «= 2 h 56 min» y en la línea de abajo «.»), `leelo` ej. 2 (16), `distributiva` ej. 1 (12), `baldosas`
    ej. 3 (10). También pasa en el feedback, que usa la misma clase. No se lee mal, pero se ve feo. No lo he parcheado práctica a
    práctica, porque la ficha manda proponerlo a la base. Propuesta: que la base pegue el signo a la cuenta (un ayudante que meta
    «cuenta + signo» en un mismo bloque sin corte), en vez de tocar las 33 prácticas.
20. `constructor`, `TX.construir.por_que.menor_par` y `mayor_impar` (el feedback de acierto o fallo del ej. 1): siguen diciendo
    «la mejor es el 8» sin decir por qué. La tarjeta ya da el método (retoque del relevo); el feedback podría decir lo mismo.

**`noLoSe` en ejercicios mixtos** (sin acción; lo digo por si prefieres el otro criterio): con «No sé hacerlo» se quedan
semaforo 1-2, raiz 2, exponente 2, divisiones 3 y baldosas 1, porque predomina calcular. Sin él se quedan expresion 3,
constructor 2-3, distributiva 2, factorizaciones 2 y fichas 5, porque predomina elegir. Cambiarlo es una línea por ejercicio.

**Sobre el método**: los siete subagentes editaron el código con Edit/Write y comitearon cada uno lo suyo con rutas
explícitas, sin push. La primera sesión no llegó a subirlos; los subió el relevo al cerrar, junto con sus dos retoques. Durante la sesión, `practicas-no-lo-se` se puso en rojo un momento en
`dictado`, `divisiones`, `por-primos` y `reloj`, porque eran ficheros que otro subagente tenía a medio editar. En la pasada
final, todo en verde.
