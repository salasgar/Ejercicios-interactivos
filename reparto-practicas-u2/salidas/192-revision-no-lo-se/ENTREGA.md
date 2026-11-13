# Entrega de la tarea 192 · Revisión del «No lo sé» de la unidad 3 y la ortografía

Sesiones `s-20261113T074721-a71b7338` (Opus 5.5, ALTO; hizo la revisión y los 18 commits, y caducó a las 10:47Z sin
cerrar) y `s-20261113T170145-b187d221` (Opus 5.5, ALTO; la relevó a las 17:01Z: segunda lectura, dos correcciones más,
los clics con resultado y el cierre; lo suyo está en el apartado «Segunda pasada», al final de «Lo hecho»). La primera ha revisado las dieciocho prácticas que escribieron las tareas 178-182.
La lectura la hicieron cinco subagentes, uno por tarea de escritura, con un guion de volcado fuera del repo: 20 explicaciones
por ejercicio e idioma, y además un ítem de cada rama o plantilla (en ortografía, los bancos enteros donde son finitos). Después
yo he leído una muestra de cada ejercicio, he corregido lo que se les había escapado (abajo, «retoque de la sesión») y he hecho
los clics.

**Las dieciocho han quedado corregidas.** En todas había algo que enseñaba mal o que incumplía `docs/no-lo-se.md`. Lo más grave
eran los consejos que solo son verdad en algunos ítems y las reglas de ortografía falsas en general. Los generadores, las opciones
y el feedback **no se han tocado**. Cuando el fallo venía de un feedback que se reutilizaba, la tarjeta se ha corregido por su
cuenta y el feedback va abajo, en los hallazgos.

## Lo hecho (veredicto por práctica)

| Práctica | Veredicto | Qué se ha corregido | Commit |
|---|---|---|---|
| termometro | corregida | Ej. 4: «los negativos van antes que el 0» era **falso** al ordenar de mayor a menor; ahora el consejo depende del sentido. Ej. 3: con «0 □ 10» hablaba de negativos sin que hubiera ninguno, y repetía la frase. Ej. 1: «1 marcas». Ej. 2: la temperatura salía dos veces. Ej. 5 (clasificar) pierde «No sé hacerlo». | 55cdbe4 |
| opuestos | corregida | −(−4): ahora dice que el − de delante es «el opuesto de». Ej. 2 cuenta saltos, como el enunciado. Ej. 3 no repite la regla. Ej. 4: las cuentas ya no salen pegadas y pierde «No sé hacerlo», porque es de elegir. | 3979a22 |
| situaciones | corregida | Dice cuál es el cero de cada situación. Fuera la frase en minúscula detrás de punto, «below zero is below zero» y la frase de la respuesta repetida. Usa el verbo de su enunciado. | 3787ce2 |
| saltos | corregida | Con dos negativos, «4 y 1 se suman hacia abajo» pasa a «ya estás 4 por debajo del 0 y bajas 1 más». Solo los verbos del contexto. Sin mayúscula detrás de los dos puntos. Un saldo negativo es «debes». | c862994 |
| dos-signos | corregida (poco) | Sin mayúscula detrás de los dos puntos. La regla del ej. 3 dice qué signos se juntan. | 012d4d3 |
| signos-producto | corregida | En inglés decía «no sum □ · 0 gives −2». «¿Suma o producto?» no decía la opción que hay que elegir. El signo del producto salía separado del resultado. | 6f676e6 |
| potencias-enteros | corregida | Ej. 1 no decía qué factores se tocan. Even/odd aclarados. Ej. 3 dice por qué esa es la base y hace el paso del menos de fuera. Las respuestas, entre comillas. Retoque de la sesión: «1 es impar» → «Hay 1, un número impar». | aa6b62e |
| jerarquia-enteros | corregida | Ej. 1 citaba como «también valdría» el atajo de las cadenas (en `10 : 2 · (−3) : 3`, hacer antes `−3 : 3`). El ejercicio lo acepta porque no cambia el valor, pero generalizado falla (`24 : 4 : 2`): la tarjeta dice ahora «de izquierda a derecha». Tras −b² sale lo que queda. Retoque de la sesión: la regla va **delante** de los pasos, no detrás. | 35804e8 |
| parentesis-enteros | corregida | Ej. 1: con «(15 − 7) + 18» decía «delante hay un +»; ahora, «no hay signo: es como un +». Ej. 2-3: sale el paso intermedio («7 − (−1) + 12 = 7 + 1 + 12 = 20»). **Ej. 4: deja `sinAyuda`**, porque su `generar` no usa `sesion.aciertos` y los pasos son del mismo ítem; lleva explicación y «No sé hacerlo». Ej. 5: enseña todas las colocaciones que sirven, con «valen las dos» cuando hay dos (pasa en 1 de cada 400 ítems). Así no da a entender que la suya es la única. Retoque de la sesión: inglés del consejo. | 777dafa |
| errores3 | corregida | La tarjeta copiaba el feedback entero, con «Se llama: …», que en el ej. 2 repetía la respuesta. Ahora lleva la línea mala, el porqué, cómo quedaría bien y la respuesta. Retoque de la sesión: comillas inglesas en inglés. | f924d89 |
| variacion | corregida | Fuera las reglas repetidas con el feedback. «Resta el mayor menos el menor» pasa a «se hace el mayor menos el menor». El cruce del año 0 cabe en una línea. Producto: «las veces, por lo que cambia». | 1e3cb12 |
| leelo3 | corregida | El consejo iba por instrucción y salía falso o vacío: «negative o minus» en −(−39) o en 6². Ahora hay uno por plantilla. «12 − 4 = 8 es una resta: su resultado se llama difference». | 9918cb9 |
| ortografia | corregida | Fuera «La respuesta es:», con dos puntos entre el verbo y el atributo. La frase buena salía dos o tres veces y ahora sale una. El sí/no da la respuesta una sola vez. **Segunda pasada**: ej. 10, «A las frases mal escritas: le falta…» no concordaba y no decía qué frase tenía cada fallo; ahora «En *X*, le falta…». | 2bda00b, 95aba43 |
| ortografia-letras | corregida | Siete reglas que no son verdad siempre. Por ejemplo, «después de m solo b» (campo, himno), «delante de las demás consonantes, n» (himno, gimnasio), «bl y br son sílabas», «del latín *bien*», «sílaba, como los verbos en -aba» (lava, octava) y «hay que = algo existe». Retoque de la sesión: la y final («detrás de a, e u o» dejaba fuera *muy*; ahora es «el sonido i átono detrás de otra vocal»), y gue/gui dice qué sonido daría la j. | cd171e3 |
| ortografia-puntuacion | corregida | La regla del nombre común estaba al revés: decía «aunque no sea la primera palabra». En «Mayúsculas», las palabras se nombran como salen y como se escriben. La frase buena sale una vez. **Segunda pasada**: en los ej. 2 y 3, cuando las dos malas fallan en lo mismo (20 de los 99 ítems), el motivo salía dos veces palabra por palabra y ahora sale una («En *X* y en *Y* …»). En el ej. 4, «faltan tildes: «qué», «cuándo», «explicación»…» era la misma lista en todos los correos; ahora nombra las de ese correo («falta la tilde de «médico»»). | 27b8107, fd3dc24 |
| ortografia-tildes | corregida | Algunos consejos fallaban: en -mente (*fácilmente*), en los monosílabos, en los hiatos (*día*, *raíz*) y en *raíz*, que es aguda en z. Retoque de la sesión: sin «La respuesta es:». | 999b4c9 |
| ortografia-palabras | corregida | Las frases citadas llevaban «.».». En los homófonos, una frase empezaba en minúscula detrás de punto. | 0a6f979 |
| ortografia-ampliacion | corregida | Al consejo de porque/por qué le faltaba el cuarto caso, «por que». En siglas y puntuación avanzada ya no se copian las frases malas enteras ni se repite el motivo: sale la regla que cumple la buena. Fuera «.».» y, como retoque de la sesión, «La respuesta es:». | 62267ea |

Los `noLoSe` quedan solo en los ejercicios de procedimiento. Quedan también en saltos ej. 2, que empieza eligiendo el signo pero
termina pidiendo el resultado. Ningún ejercicio lleva ya `sinAyuda`.

Cómo se ha probado:
- **Lectura**: 20 explicaciones por ejercicio e idioma, más una de cada rama, con las cuentas comprobadas. Las reglas de ortografía
  se han cotejado con la Ortografía de 2010.
- **Tests**: los dieciocho `tests/practicas-ayuda-<slug>.test.js` vigilan ahora lo corregido. Por ejemplo: el sentido del consejo en
  «Ordena», que las cuentas de los pasos y la línea corregida de errores3 se evalúan, ninguna regla falsa de letras, ningún
  «respuesta es:» ni «.».», y que en el ej. 5 de parentesis-enteros salen todas las colocaciones.
  `node --test tests/practicas-no-lo-se.test.js` con los de ayuda y los propios de las 18: **473/473**. `npm test`: **2127/2128**.
  El único fallo es `constructor · ejercicio 3`, un fichero de otra sesión sin comitear.
- **Clics** (Chrome headless por CDP, servidor `python3 -m http.server 8192`, `?probar=1&ejercicio=<k>`): cada ejercicio de las 18,
  a 375 px y a 1200 px, con cuatro «No lo sé» seguidos. Se ha comprobado que el botón sale, que sale la tarjeta y que el ítem queda
  apagado (`inert`). También que la traducción se abre con contenido (salvo en ortografía, que es solo en español), que la tercera
  ayuda avisa («Ayuda número 3…»), que el ítem siguiente es otro, que nada desborda a 375 px y que la consola está limpia. Además,
  capturas a 375 px de la primera tarjeta de cada ejercicio. El guion queda en
  `hechos/notas/s-20261113T074721-a71b7338-clics-no-lo-se.mjs`, para que 190 y 193 no se queden sin clics como la 191.
  **Resultado** (los pasó la sesión de relevo, entre las 17:04Z y las 17:12Z, sobre el código ya empujado): **81 ejercicios ×
  2 anchos, todo bien**. En cada uno sale el botón y una tarjeta por ayuda, el ítem queda `inert`, la tercera ayuda avisa
  («Ayuda número 3: no pierdes puntos (estás en 0)», o su versión inglesa), la traducción se abre con contenido (salvo en
  ortografía, que no tiene botón de traducción), nada desborda a 375 px, el ítem siguiente es otro y la consola está limpia.
  Dos avisos de la primera tanda que no eran de la app. Los `ERR_CONNECTION_RESET` de termometro ej. 1 y ortografia ej. 1-2
  salían de `python3 -m http.server`, que es de un solo hilo y no aguanta tres Chrome a la vez; repetidos solos, salen limpios.
  El «ítem igual al anterior» de saltos ej. 4 salía porque el guion compara los 120 primeros caracteres, y en ese ejercicio son
  las instrucciones, iguales para todos los ítems. Comparando el texto entero, sale 0, y el generador no repite ningún ítem
  seguido en 2000. ortografia y ortografia-puntuacion se repitieron después de la segunda pasada, con el mismo resultado.

### Segunda pasada (sesión de relevo `s-20261113T170145-b187d221`)

La sesión anterior dejó en `main` los 18 commits y esta ENTREGA, pero sin clics con resultado, terminada ni cierre. Lo heredado
con tests en verde se queda tal cual. Para no fiarme de una lectura ajena, he vuelto a leer una muestra nueva (otra semilla) de
cada ejercicio de las 18: 3 ítems por ejercicio e idioma en la U3 y 4 en ortografía, con las cuentas comprobadas una a una. En
la U3 no he encontrado nada más que corregir. En ortografía, lo de las dos filas de arriba marcadas como «Segunda pasada»
(95aba43 y fd3dc24, con sus tests). Tests: los de las 18 y el genérico, 475/475 antes de los cambios; `npm test`, **2154/2154**
después.

## Hallazgos fuera de criterio (para Juan Luis)

Son feedback o bancos que ya estaban así y que esta tarea no toca. La tarjeta del «No lo sé» ya dice bien lo que aquí sale mal.
Recomendación general: **reabrir la tarea dueña de cada práctica para que su feedback diga lo mismo que la tarjeta**.

1. **ortografia-letras: el feedback de fallo sigue con reglas falsas.** Son `REGLAS` mb, bl-br, n-otras, y-final y bien, las notas
   de *sílaba* e *ingeniero*, y `EXPLICA_H.hay` («algo existe»). Es lo más importante: es una práctica de ortografía y la regla es
   falsa en palabras corrientes (*himno*, *gimnasio*, *fui*). **Recomendación**: pasar al banco los textos de `AYUDA_REGLAS` y `AYUDA_NOTAS`.
2. **ortografia-puntuacion**: la regla `mayuscula-en-nombre-comun` del feedback dice «aunque no sea la primera palabra», al revés.
   Además, «Quería preguntarle una duda» (DOS_PUNTOS) es poco recomendable: mejor «hacerle una pregunta». Y la mala «q wapo es tu
   perro» lleva varios fallos, no solo abreviaturas.
3. **ortografia (`signos.js`)**: «detrás de un signo de cierre va **siempre** un espacio» es falso en «¿Vienes?, dijo».
   La tarjeta del ej. 10 lo sigue diciendo así, porque usa el motivo del banco: `docs/no-lo-se.md` pide «frase sencilla antes que
   caso límite», y lo he dejado. Si prefieres quitar el «siempre», es un cambio de una palabra en `SIN_ESPACIO` y arregla a la vez
   el feedback y la tarjeta.
4. **ortografia-ampliacion, `explicacionElegir`** (feedback de los ej. 3 y 4): copia la frase mala entera con su punto en medio, y
   repite el motivo cuando las dos malas fallan en lo mismo (ONGs / ONG's). **Recomendación**: que use `REGLA_ELEGIR` / `reglasElegir`.
   Duda: «Marta es la delegada; Pablo, el subdelegado» contra la versión con coma. La coma que sustituye al verbo obliga al punto y
   coma, así que creo que la mala sí es falta, pero que lo confirmes.
5. **ortografia-palabras, `explicacionHomofono`**: empieza frase en minúscula detrás de punto en los 83 ítems. **Recomendación**:
   `porQueHomofono`.
6. **jerarquia-enteros, feedback del ej. 1** (`montarPrimero`): en las cadenas lista «Podían ir primero: −5 · 8, 8 : 4» justo después
   de decir «se hace antes la de la izquierda». **Decisión tuya**: seguir aceptando el atajo (es tu regla del 08-10) sin anunciarlo,
   con `pasosPosibles(…, { cadenas: false })` en el feedback, o dejarlo como está.
7. **termometro**: `TX.ej1.bien` dice «1 unidades» y «going up in 2s» hacia la izquierda; `TX.ej3.absoluto`, «aunque su número sea
   grande».
8. **opuestos**: `TX.ej2.bien` dice «El 0 está en el 0: no hay que saltar:», con dos dos puntos; `TX.ej4.bienMarcar` pega las cuentas.
9. **situaciones**: `TX.situacion.bien` dice «below zero is below zero», y `TX.entero.razon` empieza en minúscula.
10. **saltos**: `camino` dice «se suman hacia abajo»; los verbos del feedback de los ej. 3 y 5 son todos y no los del contexto; el
    saldo negativo, «tienes −25 €», sin decir «debes».
11. **parentesis-enteros**: `TX.quita.razon_mas` dice «delante hay un +» cuando el paréntesis va el primero; `nota_par_pot` con base
    2 dice «el 2 es solo de 2».
12. **leelo3**: `nombreResultado` dice «es el difference (resta)», cuando debería ser «la»; `baseExponente` dice «no la del
    exponente». `beneficio_perdida` escribe «Beneficio (profit) = +200»: ¿vale el «+n» ahí?
13. **potencias-enteros**: el feedback en inglés dice even/odd sin aclarar; `negativa_ejemplo` une dos frases con una coma.
14. **signos-producto**: el primer negativo va sin paréntesis en el ej. 1 (`−8 · 10`) y con paréntesis en los ej. 3 y 4 (`(−5) · □`).
    Es una incoherencia menor del generador.
15. **errores3**: «olvida-el-signo» con −1 − 3 lo justifica por el valor absoluto, y sería más natural «vas hacia abajo dos veces».
    «derecha-a-izquierda» presenta el izquierda-a-derecha como lo único, y agrupar positivos y negativos también vale.
16. **variacion**: en el inglés de los enunciados conviven «€20» y «20 €».
17. Dudas menores de ortografía, sin acción: el truco «sé → sabes» da «Yo no sabes nadar». El «ya que» de porque/por qué queda raro
    en las preguntas con «si». Y en «Lo que más me gusta… son los problemas», llamar sujeto a «lo que más me gusta» se discute.

**Sobre el método**: las tareas 178-182 dicen que editaron código con guiones de Python o heredocs, saltándose el candado. Aquí todo
se ha editado con Edit/Write. `practicas/ortografia/ayuda.js` no está en la lista de la ficha (solo `practica.js`, `textos.js` y
`logica.js`), pero es el fichero de la explicación que creó la 181, así que lo he tratado como suyo.

**No soy la última revisión en cerrar**: la 190 y la 193 siguen sin terminada (a las 17:12Z, la 190 tiene reclamo vivo
de `s-20261113T170133-3d38e018` y la 193 está BLOQUEADA). No he tocado `tests/practicas-no-lo-se.test.js`.
