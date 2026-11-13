# Entrega de la tarea 191 · Revisión del «No lo sé» de la unidad 6

Sesión `s-20261112T232612-419f0576` (Opus 5.5, ALTO). He revisado las once prácticas de la U6 que escribieron las tareas
175, 176 y 177. Para cada ejercicio he leído, con un guion fuera del repo, 20 explicaciones en cada idioma, más todas las
plantillas distintas donde las había. **Ninguna práctica ha quedado como estaba**: en todas había algo que enseñaba mal o
que incumplía `docs/no-lo-se.md`. Cada corrección va en su propio commit, con su test reforzado.
Los generadores, las opciones y el feedback **no se han tocado**. Cuando el error venía del feedback que se reutiliza, la
tarjeta se corrige por su cuenta y el feedback queda en los hallazgos.

Ningún ejercicio lleva `sinAyuda` ni lo necesita: ninguno es un juego ni va por pasos con `sesion.aciertos`.
Los `noLoSe` están bien puestos: solo en los de procedimiento (escribir, resolver, completar, corregir) y en ninguno de
elegir, verdadero/falso o leer.

## Lo hecho (veredicto por práctica)

| Práctica | Veredicto | Qué se ha corregido | Commit |
|---|---|---|---|
| traduce | corregida | El consejo «de izquierda a derecha» era **falso** en «cinco menos que un número» (da 5 − x). Se quita, y «menos que» lleva ahora su propio aviso: «x − 5, no 5 − x». En «Elige la frase», x − n y n − x tienen regla propia (antes se hablaba de «menos que» en todos los ítems). En parejas y cantidades se repetía la expresión («Sara: x; 5 más: x + 5: x + 5»). En «Calcula lo que se paga» se decía «sustituye la letra», pero ese enunciado no tiene letra. Y x/2 sale como lo que se teclea. | d72ce50 |
| valor-numerico | corregida | Con k(x + c), la regla decía «primero se multiplica», que es falso: va primero el paréntesis. Tampoco hablaba bien de poner el negativo entre paréntesis. Inglés más natural. | 0f7ccef |
| terminos-semejantes | corregida | En «¿Semejantes?», el feedback que se reutilizaba decía «en 3 sin letra», una frase sin verbo. Ahora: «3 no tiene letra». El consejo salía dos veces. En «Reduce» desaparecen el «A = A» de cuando los términos ya estaban juntos y el resultado repetido. «Caza el error»: sin mayúscula tras los dos puntos. | 8f34a14 |
| es-solucion | corregida | En «¿Qué ecuación?», la regla decía «sustituye en la ecuación buena», que es justo lo que el alumno no sabe. Ahora: «en cada ecuación». En «¿Identidad o ecuación?» queda dicho que basta un valor que no cumpla. Inglés «Replace x with…». | 6ac5f04 |
| transposicion | corregida | Ej. 3: el primer paso salía con barra («x/3») y faltaba su cuenta antes del segundo; ahora «o sea, 2x = 20». Ej. 4: fracciones con raya. Ej. 5: ya no repite el feedback de `signo-cambiado`, que dice «es positivo (−4)» (ver hallazgo 1), y no lleva mayúscula tras «Estaba bien:». | f9d04c7 |
| resuelve | corregida | Fracciones con raya (la comprobación, que comparte con el feedback, las escribía con barra). En «Paso a paso», la división que no es entera se escribe como fracción y se simplifica a la vista («−26 : 4 = −26/4 = −13/2»). En «¿Está bien resuelta?», la opción va entre comillas («Paso 2», «Todo está bien»). | 5690923 |
| parentesis-algebra | corregida | Cuando hay algo delante del paréntesis, la tarjeta decía **«(−2) · 4 + (−2) · 4x = 2x − 8 − 8x», que es falso**: a la derecha se colaba el 2x de fuera (viene del feedback; hallazgo 2). Ahora dice «= −8 − 8x; con lo de delante, 2x − 8 − 8x», y el test evalúa la igualdad en dos valores. «Resuelve»: sin el «Primero…» dos veces y sin «La solución es −29/6» con barra justo antes de la respuesta. «Caza el error»: la opción entre comillas y el consejo al final. | 6e49f34 |
| denominadores | corregida | Con un solo denominador decía «El m.c.m. de 7 es 7»; ahora «El único denominador es 7». Falta el punto tras el ✓ de la comprobación. | 3b6e700 |
| problemas-ecuaciones | corregida | Ej. 1: «la x es lo que te piden calcular» no siempre es verdad, y el ej. 4 enseña justo eso; ahora «algo que todavía no sabes». Ej. 2: «palabra por palabra» y «menos es −» fallan con «menos que»; la regla habla ahora de cantidades. Ej. 5: «personas con decimales» pasa a «cosas que se cuentan», y las fracciones van con raya. | d1d9f16 |
| errores6 | corregida | «Corrígelo» saltaba de la línea buena a la respuesta. Ahora enseña cómo se sigue («Desde ahí: −4x = 44 − 24 → −4x = 20 → x = −5»); para eso `logica.js` gana `lineasBuenas`, una función pura que no cambia el generador. La solución va con raya. En la tarjeta, «−4 · (−6)» y no «−4 · −6». El inglés de la regla del ej. 1 queda como en el resto de la unidad. | b8c8f91 |
| leelo6 | corregida (poco) | Lo que dice el ítem («x/3 − 5 se lee…», «se escribe n/5») lleva ahora la fracción con raya, como la respuesta. El resto está bien. | 24bbbc7 |

Cómo se ha probado:
- Las 20 explicaciones de cada ejercicio, en cada idioma, leídas con las cuentas comprobadas. Donde el ejercicio tiene
  plantillas, también un ítem de cada plantilla (por ejemplo, las 103 claves de «Elige la frase» de `traduce`).
- Los once `tests/practicas-ayuda-<slug>.test.js` vigilan ahora lo que se ha corregido: nada de «izquierda a derecha»,
  la igualdad de los productos se evalúa, no hay fracciones con barra, «primero el paréntesis» sale con k(x + c),
  «· (−n)», las líneas buenas de «Corrígelo»…
- `node --test tests/practicas-no-lo-se.test.js tests/practicas-ayuda-*.test.js` y `npm test`: ver la terminada.
- **No se ha probado en el navegador.** El clasificador de permisos denegó levantar el servidor local
  (`python3 -m http.server 8191`), como les pasó a 175, 176 y 177. Falta el paso 4 de la ficha: el botón en cada
  ejercicio, a 375 px y en ancho, en los dos idiomas; que la tercera ayuda avise del punto; que el ítem siguiente sea
  otro; y la consola limpia. Como las once prácticas tienen `disponible: false`, ningún alumno las ve todavía.

## Hallazgos fuera de criterio (para Juan Luis)

1. **transposicion: el feedback de `signo-cambiado` es falso cuando la solución es negativa.** En la forma «producto»
   (5x = −20 → x = 4), dice «has cambiado el signo: x = −20 : 5 = −4 es positivo (−4)». El problema está en
   `logica.js` (`candidatos`, caso producto): usa `signo-cambiado` sin mirar el signo de la solución, mientras que en
   suma/resta sí elige entre `signo-de-la-solucion` y `signo-cambiado`. Lo ve quien falla los ejercicios 2 y 5. La
   tarjeta ya no lo repite. **Recomendación**: reabrir la tarea dueña de `transposicion` para elegir el error según el
   signo, como en suma/resta.
2. **parentesis-algebra: el feedback dice una igualdad falsa** cuando hay algo delante del paréntesis
   (`solucionDeDesarrollo`, rama del producto con `pre`): «(−2) · 4 + (−2) · 4x = 2x − 8 − 8x». Sale en el feedback de
   los ejercicios 1, 2 y 4. **Recomendación**: que la rama haga lo mismo que la tarjeta («= −8 − 8x; con lo de
   delante, 2x − 8 − 8x»).
3. **Fracciones con barra en el feedback y en los enunciados** de `transposicion` (ej. 4), `resuelve` (comprobación),
   `parentesis-algebra` (ej. 3), `problemas-ecuaciones` (enunciado y feedback del ej. 5: «Solución: x = 322/3») y
   `leelo6` (lo que dice el ítem). Las tarjetas ya van con raya, pero el resto de la pantalla no.
4. **problemas-ecuaciones, ej. 5, problemas de dinero**: el generador enseña líneas como «6x = 29/4 + 67/20» y
   «x = 53/30 (el precio de un cuaderno)». Son los decimales del enunciado (7,25 y 3,35) pasados a fracción. Para 1.º
   ESO eso es raro: un precio con fracción no se lee como «no tiene sentido», sino como «no entiendo nada».
   **Recomendación**: que en los contextos de dinero la línea mala y la solución salgan con decimales.
5. **problemas-ecuaciones, ej. 4** (ya lo dijo la 177): el feedback da «Eva tiene 13 años» sin la cuenta (7 + 6).
   Los pedidos de las plantillas no guardan la cuenta, así que la tarjeta no puede enseñarla. **Recomendación**:
   añadir a cada `pedido` la expresión que lo calcula (`x + 6`), y que el feedback y la tarjeta digan «7 + 6 = 13».
6. **es-solucion**: la comprobación escribe «(−4) + 11» con un paréntesis que no hace falta al principio
   (`cuentaMiembro`, compartida con el feedback). Es menor; no se ha tocado.
7. **errores6**: el porqué que comparten feedback y tarjeta escribe «−4 · −6» (dos signos seguidos). La tarjeta ya
   lo pone entre paréntesis; el feedback no.
8. Lo que dijeron 175-177, comprobado: el `item.solucion` de «reduce» se repetía (resuelto en la tarjeta). La «y» en
   español del inglés de `resuelve` ya la arregló la 176. La opción `enunciado` del ej. 5 de problemas-ecuaciones
   sigue sin salir en ningún ítem.
