# Entrega de la tarea 190 · Revisión del «No lo sé» de las unidades 4 y 5

Sesión `s-20261113T085456-88ebbbda` (Opus 5.5, ALTO). He revisado las diecisiete prácticas: las quince que escribieron las tareas
171-174 y las dos modelo de la coordinadora (`fraccion-de`, `multiplica-divide`). La lectura la hicieron cinco subagentes, uno por
tarea de escritura y otro para las dos modelo, con un guion de volcado fuera del repo: 20 explicaciones por ejercicio e idioma, más
un ítem de cada rama o plantilla. Después yo he leído una muestra de cada ejercicio con las cuentas, he retocado lo que se les había
escapado (abajo, «retoque de la sesión») y he hecho los clics.

**Las diecisiete han quedado corregidas.** En todas había algo que enseñaba mal o que incumplía `docs/no-lo-se.md`. Lo más grave:
- reglas falsas en general: «tercios, onceavos se leen como ordinal» en español; la coma «debajo de la del dividendo» cuando el
  dividendo no tiene coma; «se lee la parte entera, coma y la parte decimal» con una lectura por órdenes;
- tarjetas que no daban la respuesta o la daban dos veces;
- el atajo de las cadenas anunciado como regla en `combinadas-fracciones`;
- tarjetas sin la regla, o con la regla detrás.

Los generadores, las opciones y el feedback **no se han tocado**. Cuando el fallo venía de un feedback que se reutilizaba, la
tarjeta se ha escrito por su cuenta y el feedback va abajo, en los hallazgos.

## Lo hecho (veredicto por práctica)

| Práctica | Veredicto | Qué se ha corregido | Commit |
|---|---|---|---|
| fraccion-de (modelo) | corregida | Ej. 4 (problema): sin regla, sin «La respuesta es» y sin unidad; ahora regla por variante delante, respuesta con unidad («203 páginas») y consejo solo donde sirve. Ej. 2: lo que se pide lleva la unidad. Ej. 3: dice que se simplifica dividiendo entre el m.c.d. Test nuevo `practicas-ayuda-fraccion-de`. | a087f7b |
| multiplica-divide (modelo) | corregida | Ninguna tarjeta acababa en «La respuesta es», y en el ej. 1 la regla iba detrás. Ahora la regla va delante, se dice entre qué se simplifica («entre 4, el m.c.d. de 88 y 36») y la tarjeta acaba en la respuesta. Ej. 3: «Las respuestas son 5/6 y 1». Test nuevo `practicas-ayuda-multiplica-divide`. | 2d0fb64 |
| que-fraccion | corregida | Ej. 4: en los ítems en español decía que tercios u onceavos «se leen como un ordinal» (falso) y llamaba «caso especial» a tres cuartos; ahora, la regla de los apuntes («medios, tercios… hasta décimos; desde el 11, -avos»). El consejo «el denominador nunca se dice como un número normal» era falso con «partido por». Ej. 2: «hay que sombrear» tres veces y sin regla. Ej. 3: «Ojo: abajo va el total (13), no los demás (6)». | c0227cc |
| equivalentes | corregida | Ej. 1 dice qué término pasa a cuál. Ej. 2: regla de los productos cruzados delante y completa. Ej. 4: el m.c.m. con los múltiplos («7, 14, 21, 28: el primero que es múltiplo de 4») en vez de «está en las tablas de los dos»; fuera «12 · 1 = 12». Ej. 3 (repartir en cajas) pierde «No sé hacerlo»: es clasificar. | 65a997e |
| simplifica | corregida | Ej. 1: un paso por botón, con el divisor («Entre 2: …; entre 3: …») y la respuesta. Ej. 2: el «Ojo: dos impares no basta» salía en cada fracción; ahora una vez, y se dice cuáles marcar. Ej. 3: el m.c.d. por factorización, como en la U2; fuera «7/20 = 7/20». | e437127 |
| compara | corregida | Ej. 1 no daba la respuesta; con dos negativas enseña las equivalentes. Ej. 2: la regla hablaba de «la mitad del denominador» y las cuentas doblaban el numerador; ahora la regla es la de las cuentas, caja por caja. Ej. 3: con una sola negativa ya no habla de «dos negativas». Ej. 4: cuenta los huecos y el sentido. | 99a5ffb |
| suma-resta | corregida | Ej. 1 repetía la regla. Ej. 2: tres pasos en lista y cada fracción ampliada a la vista. Ej. 3: «el natural es una fracción con un 1 abajo… de denominador 10» se contradecía. Ej. 4 saltaba la simplificación. Ej. 5 da la cuenta bien hecha y la razón que hay que elegir. | d38fed9 |
| combinadas-fracciones | corregida | La regla no decía «de izquierda a derecha». Ej. 1 anunciaba el atajo de las cadenas («pueden ir primero: …; vale cualquiera»), que generalizado falla en a : b · c (mismo criterio que la 192 en jerarquia-enteros); ahora nombra la que va primero y por qué. Ej. 3: fuera la pista «no se puede ir de izquierda a derecha sin más», que choca con la regla. | 2bce446 |
| errores4 | corregida | La respuesta iba al principio, con «Se llama: Ha…» (mayúscula tras los dos puntos). Con una verdadera no decía por qué. Ahora: regla de la operación, cuenta bien hecha paso a paso (`pasosBien`, comprobada por test) y respuesta al final. | dec9a31 |
| leelo4 | corregida | «El denominador con un ordinal» era falso en 1/2 y 3/4: se añaden half y quarter. Dictado: «en el orden en que se dicen» era falso con «subtract… from…», y la pista usaba letras (U6). En inglés, «“1/2 of 38” is 1/2 of 38» pasa a «means 1/2 · 38». **Retoque de la sesión**: el ejemplo del dictado era siempre «three fifths»; ahora es la primera fracción de la frase del ítem (y el test lo vigila). | c1aa204 |
| lee-decimales | corregida | Ej. 1: con una lectura por órdenes («doce unidades y treinta y cuatro centésimas») la regla era «parte entera, coma, parte decimal»; ahora «el nombre del final dice cuántas cifras decimales hay», y avisa de los ceros de delante. Ej. 2: «son 1 centésima» → «1 centésima = 0,01». Ej. 4: el consejo, delante de la respuesta. Comillas inglesas en inglés. | 62cb79a |
| compara-decimales | corregida | La respuesta salía dos veces en los cuatro ejercicios. Ej. 1: con partes enteras distintas, «la parte entera ya decide»; si no, qué cifra decide. Ej. 3 («Entre dos»): deja claro que vale cualquiera («entre ellos están 12,81; …; 12,99»), y la regla «una cifra decimal más» era falsa con 11,3 y 11,31. Ej. 4: dice qué cifra se mira y el arrastre del 9. | c998ad4 |
| suma-resta-decimales | corregida | Ej. 1 repetía la regla; con tres números, dos pasos. Ej. 2: con un solo importe decía «primero suma lo que has gastado». Ej. 3: «trozo» en una botella. Ej. 4: la regla delante, y «354 no tiene coma: está al final». | 4516197 |
| leelo5 | corregida | Ej. 2: el consejo, siempre el mismo, era falso en el dinero y en las lecturas en español; ahora uno por plantilla. La respuesta entre comillas y con la coma o el punto del idioma de la tarjeta. La fracción de «Pasa … a decimal» ya no sale escapada en la tarjeta. | b19d842 |
| multiplica-divide-decimales | corregida | Ej. 2: «88 : 5 = 17,6: la coma del cociente va debajo de la del dividendo», y 88 no tiene coma; ahora la división larga paso a paso (`pasosDivision`, pura, en `logica.js`; el test reconstruye el cociente). Ej. 1: la cuenta sin comas y «1 cifra decimal y 9 no tiene ninguna». Ej. 4: la respuesta es «Está bien»/«Está mal», como el botón, y si está mal, por qué. Ej. 5: dinero con dos decimales (14,80 €). | a241d38 |
| fraccion-decimal | corregida | Ej. 1: «0,555….», la respuesta como el botón («Exacto»/«Periódico»), qué cifra se repite y un consejo cierto siempre (un resto que vuelve). Ej. 2: la regla delante. Ej. 3: una sola lista. Ej. 4: compara los dos decimales cifra a cifra. | cc23ed1 |
| errores5 | corregida | Sin error, solo decía «Está todo bien»; ahora dice por qué cuadra con los números del ítem. Copiaba el feedback, que en dos casos enseña mal (ver hallazgos 8 y 9); ahora la tarjeta se arma con `comoSeHace` (pura, en `logica.js`): línea mala, cómo se hace y línea buena. | dff9cfc |

`noLoSe` («No sé hacerlo») queda solo en los de procedimiento: se ha quitado en equivalentes ej. 3. Se queda en los mixtos (compara-decimales
ej. 3 y 4, suma-resta-decimales con opción de elegir) y en fraccion-de ej. 4 (un problema que se calcula, aunque se conteste eligiendo).
Ningún ejercicio lleva `sinAyuda` ni lo necesita: ninguno es un juego ni va por pasos con `sesion.aciertos`.

Cómo se ha probado:
- **Lectura**: 20 explicaciones por ejercicio e idioma, más una de cada rama o plantilla, con las cuentas comprobadas (en A, todas las
  «a · b = c», «a : b = c» y «a < b» de 300 ítems por ejercicio, a máquina). Yo, después, 2-4 por ejercicio e idioma de las diecisiete.
- **Tests**: los diecisiete `tests/practicas-ayuda-<slug>.test.js` (dos nuevos: fraccion-de y multiplica-divide) vigilan ahora lo
  corregido: la regla delante y la respuesta al final y una sola vez, que los pasos de las cuentas den lo que dicen, nada de «X = X»,
  ni ordinales en los ítems en español, ni el atajo de las cadenas, ni fracciones con barra, ni letras, «vale cualquiera» en «Entre dos»…
  `npm test`: **2150/2150** tras el último commit.
- **Clics** (Chrome headless por CDP con el guion de la 192, servidor `python3 -m http.server 8190`, `?probar=1&ejercicio=<k>`): cada
  ejercicio de las diecisiete, a 375 px y a 1200 px, con cuatro «No lo sé» seguidos: botón, tarjeta, ítem apagado (`inert`), traducción
  con contenido, aviso de la tercera ayuda, ítem siguiente distinto, nada desborda, consola limpia. Resultado: ver la terminada.

## Hallazgos fuera de criterio (para Juan Luis)

Son opciones, feedback o enunciados que ya estaban así y que esta tarea no toca. La tarjeta del «No lo sé» ya dice bien lo que aquí sale
mal. Recomendación general: **reabrir la tarea dueña de cada práctica para que su feedback diga lo mismo que la tarjeta**.

1. **leelo5, ej. 3 «La consigna»: los botones de `consigna_convertir` enseñan el marcado HTML en crudo** («Pasa <span class="frac…">…
   a decimal»). Sale en 1 de cada 8 ítems del ej. 3 y la práctica está publicada. Es lo único urgente. **Abierta reabierta de la 129**
   (`hechos/reabiertas/129--s-20261113T085456-88ebbbda-revision.md`), con dos menores de la misma práctica: «Hugo… Her ___» (ya lo dijo
   la 173) y «Ordena 8,447, 1,495 y 4,05» con comas.
2. **que-fraccion, ej. 4**: el feedback (`por_que['lee-con-cardinales']`) y la introducción en español dicen que el denominador «se dice
   como ordinal», falso para tercios u onceavos. Que digan lo de la tarjeta.
3. **combinadas-fracciones, ej. 1: decisión tuya.** El ejercicio acepta el atajo de las cadenas, y la introducción y el feedback
   (`TX.podian`) lo anuncian. Es el mismo caso que el hallazgo 6 de la 192 (jerarquia-enteros). Recomiendo que el feedback use
   `pasosPosibles(…, { cadenas: false })`, como la tarjeta, y seguir aceptando el atajo sin anunciarlo.
4. **combinadas-fracciones, ej. 3**: `generarError` saca, unas 10 de cada 4000 veces, errores entre naturales que nadie comete
   («2 + 2 = 2», «1 · 2 = 1/2»), explicados con pistas de denominadores. Recomiendo excluir esas falsas cuando los dos operandos son naturales.
5. **fraccion-de, ej. 4, variante «restante»**: el feedback dice «Si he hecho 3/4, falta 1/4» también con los alumnos que «han entregado»;
   en «dos» da «5/12 de 540 = 225» sin la cuenta. `tests/practicas-no-lo-se.test.js` exige que la tarjeta lleve ese feedback tal cual, así
   que la tarjeta lo arrastra. Recomiendo una frase neutra en `solucionProblema` («Ya están 3 de las 4 partes; falta 1/4») y `cuentaDe` en «dos».
6. **fraccion-de, ej. 1**: el 22 % de los ítems sale con fracción reducible (4/6 de 24); el ej. 2 usa `numeradorIrreducible` y el ej. 1 no.
   Si se quería irreducible (el commit eb33bf0 lo dice), que `generarCalculo` lo use también.
7. **multiplica-divide-decimales, feedback**: `solucionComa` dice «1 cifras decimales» / «1 decimal places» (ya lo dijo la 174);
   `solucionEntre`, «la coma del cociente va debajo de la del dividendo» aunque no tenga coma; `cuentaProblema`, «14,8 €».
8. **errores5, redondeo en cadena (`porque`)**: enseña mal la cadena: «(14,2745 → 14,275 → 14,27) da 14,28». El bucle redondea siempre
   desde el número original.
9. **errores5, otros `porque`**: «Añadir un cero (9,5000)» cuando son tres; «Dividir 20 : 31 da 0,64» como si fuera exacto; «<» y «>» sin
   escapar en el HTML. El nombre de `periodico-por-redondeo` en `_comun/decimales.js` lleva «1/3» con barra y nombra 1/3 aunque el ítem
   sea 2/3. La intro de «Corrígelo» escribe «3/4» con barra.
10. **compara-decimales, feedback**: «the hundredth digit» (se lee «la centésima cifra»; mejor «hundredths digit»); «Resultado:» antes
    del arrastre; ceros de relleno aunque las partes enteras ya decidan.
11. **suma-resta-decimales, ej. 4** (ya lo dijo la 173): «329 · 1000: la coma se mueve 3 lugares» con un entero sin coma. La tarjeta ya dice
    «354 no tiene coma: está al final». **compara-decimales, ej. 1, «13 = 13,0»** (también de la 173): es el caso «iguales», correcto; dejarlo.
12. **lee-decimales, feedback del ej. 2** (`TX.cifra.vale`): «son 1 centésima».
13. **equivalentes, feedback**: `TX.ej4.solucion1` sigue con «está en las tablas de los dos» y `solucion2` con «12 · 1 = 12»; `TX.ej1.solucion`
    dice «el otro término» sin decir cuál. **compara, feedback**: `metodo.negativas` dice «(con denominador 20)» sin las equivalentes,
    `explicarOrden` escribe «13/8 = 13/8» y `orden.negativas` habla de «dos negativas» con una sola. **simplifica**: `explicarIrreducibles`
    repite el «Ojo» en cada fracción.
14. **suma-resta, feedback**: `solucionQueda` salta la simplificación («= 6/10. La respuesta es 3/5»); `explicaCaza` no da la línea bien
    hecha. **errores4, feedback**: «Se llama: Ha…» con mayúscula; con una verdadera, sin el porqué. **leelo4, `logica.js`**: la solución
    inglesa de «of» es «“1/2 of 38” is 1/2 of 38» (la tarjeta ya lo arregla).
15. **Dudas de `noLoSe` (decisión tuya, por defecto se quedan así)**: compara ej. 4 (tocar la marca en la recta) no lo lleva; que-fraccion
    ej. 3 mezcla ítems de elegir y de escribir y no lo lleva; fraccion-de ej. 4 lo lleva aunque se conteste eligiendo. Como fraccion-de es
    el modelo, lo que decidas ahí vale para las demás.
16. **Longitud**: algunas tarjetas pasan de cuatro líneas a 375 px. Son los ítems de tres fracciones o de dos pasos: suma-resta ej. 2,
    combinadas ej. 3, errores4 ej. 2, errores5, ordenar cinco decimales. Recortarlas quitaría pasos. Las alturas medidas están en la terminada.

## Relevo y clics (sesión s-20261113T170133-3d38e018, 2026-11-13T17:25:08Z)

La sesión anterior caducó (11:54Z) con las diecisiete prácticas comiteadas y esta ENTREGA escrita, pero sin marcador, sin terminada y sin
anotar los clics. Esta sesión la ha relevado, ha comprobado que ninguna de las diecisiete carpetas tiene cambios sin comitear ni commits
posteriores a dff9cfc, ha pasado los tests (338/338 de ayuda; `npm test` 2154/2154) y ha repetido los clics con el guion de la 192
(Chrome headless por CDP, servidor `python3 -m http.server 8190`): los 63 ejercicios de las diecisiete prácticas, a 375 px y a 1200 px,
cuatro «No lo sé» seguidos en cada uno. En todos: botón presente, cuatro tarjetas, ítem `inert`, aviso de la tercera ayuda («Ayuda número 3…»,
en los dos idiomas, porque los ítems salen en los dos), traducción con contenido, nada desborda, consola limpia. Un único «ítem igual al
anterior» (que-fraccion ej1 a 1200 px) es un falso positivo: el texto del ítem es solo la instrucción y lo que cambia es el dibujo.
Alturas de las tarjetas a 375 px: entre 198 y 705 px; las más altas, suma-resta ej2 (569-705), simplifica ej2 (534-560), combinadas ej3
(483-543), errores5 ej2 (456-535) y compara-decimales ej2 (405-508), que son las del hallazgo 16.

El hallazgo 1 (leelo5, ej. 3) está comprobado en el código (`consignaConvertir` mete la fracción en HTML dentro de `texto` y `practica.js`
la escapa) y su reabierta de la 129 queda comiteada con este cierre.
