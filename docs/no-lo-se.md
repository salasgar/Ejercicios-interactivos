# El botón «No lo sé» de las prácticas

Decisión de Juan Luis del 2026-11-12. Guía para quien escriba o revise la explicación de un ejercicio.
El código común ya está hecho (`practicas/_comun/contador.js`, `ayudar`; `practicas/_comun/base.js`, `pedirAyuda`);
el contrato, con un ejemplo que funciona, en `practicas/plantilla/practica.js`; los modelos de verdad, en
`practicas/fraccion-de/` y `practicas/multiplica-divide/` (funciones `explica…` de sus `textos.js`).

## Qué hace

Debajo de cada ejercicio que declara `explicacion` sale el botón «No lo sé» / «I don't know». Al pulsarlo, el ítem
se cierra sin contestar (queda a la vista, apagado) y aparece la tarjeta «Así se hace:» con la explicación de **ese
ítem**. No es un fallo: no quita vida ni se suma a `fallos`; corta la racha, y **cada 3 ayudas quitan 1 punto**
(nunca por debajo de 0). Las ayudas se cuentan aparte, en `ayudas`. El ítem siguiente es otro.

## Cómo se declara (en el `arrancar` de `practica.js`, por ejercicio)

- `explicacion(item, { idioma, t, tt, esc })` → HTML. La misma firma que `enunciado`. Tiene que ser **pura**: solo
  depende del ítem y del idioma (la base la llama también para la traducción).
- `noLoSe: { es: 'No sé hacerlo', en: 'I don’t know how' }` → solo en los ejercicios **de procedimiento** (calcular,
  construir, escribir un resultado). En los de reconocer, elegir, verdadero/falso o leer, no se pone: vale el texto
  por defecto.
- `sinAyuda: '<motivo, una frase>'` → en vez de `explicacion`, cuando el ejercicio no debe llevar el botón. Solo en
  dos casos: **es un juego**, o **va por pasos** (su `generar` usa `sesion.aciertos` como número de paso, así que
  «el siguiente es otro» no se cumple). Cualquier otra duda no la decide quien escribe: se pone
  `sinAyuda: 'Pendiente de decisión: …'` y se dice en la ENTREGA como hallazgo para Juan Luis.
- Una práctica que declara una de las dos cosas en un ejercicio tiene que declarar una en **todos**.

La función que construye la explicación vive en `textos.js` (o `logica.js`) de la práctica, **exportada**, para poder
probarla; `practica.js` solo la conecta.

## Qué tiene que decir la explicación

1. **Resuelve ese ítem, con sus números.** No teoría general. Quien la lea tiene que poder hacer el siguiente.
2. **Paso a paso** cuando haya más de un paso: `<ol class="pasos-ayuda"><li>…</li></ol>` (el estilo ya existe).
   Cada cuenta, dentro de `<span class="cuenta">…</span>`.
3. **La solución, explícita y al final** («La respuesta es …» / «The answer is …»), tal como la da por buena el
   ejercicio (la misma fracción irreducible, la misma opción, la misma palabra).
4. **Como mucho un consejo**, corto, de cómo atacar ese tipo de ejercicio.
5. **Tres o cuatro líneas** en un móvil de 375 px. Si el feedback de acierto que ya tiene el ejercicio es un paso a
   paso, se reutiliza y se le pone delante la regla en una frase (así está hecho `multiplica-divide`).
6. Según el tipo:
   - **Elegir / verdadero-falso / clasificar:** cuál es la buena y por qué, con los datos del ítem. No hace falta
     repasar por qué fallan las demás.
   - **«Caza el error» (`errores*`):** dónde está el error y cómo queda la cuenta bien hecha.
   - **«Léelo» (`leelo*`):** cómo se lee o se escribe, y la regla que lo decide.
   - **Problemas con contexto:** qué se pide, las cuentas con sus unidades y la frase de respuesta.
   - **Ejercicios con dos pasos dentro del mismo ítem:** la explicación cubre los dos.
   - **Ortografía** (`idioma: 'es'`): la explicación del ítem que ya da el banco, con la regla delante.
7. **En los dos idiomas**, salvo las prácticas de `idioma` fijo. Inglés sencillo: frases cortas, y la palabra no
   matemática que decide la respuesta, aclarada entre paréntesis como en los enunciados.

## Reglas de contenido (las de siempre; la explicación no las relaja)

- Producto con «·» y división con «:» desde la unidad 2; **la unidad 1 usa «×»**, como el resto de su material.
- «Divisor», no «factor», para la relación entre números; GCD y LCM, no HCF.
- Fracciones con raya (`htmlFraccion`), nunca con barra; enteros sin paréntesis que no hagan falta.
- **Nada que no se haya dado** en esa unidad: ni letras ni ecuaciones antes de la unidad 6 (hueco □), ni decimales
  antes de la 5, ni un método que los apuntes de esa unidad no usen.
- Frase sencilla antes que caso límite; «;» para separar frases, nunca «·».
- La explicación **no cambia qué ítems salen**: no se tocan los generadores, ni las opciones, ni el feedback que ya
  hay, ni las exclusiones de casos de examen.

## Cómo se prueba

- `tests/practicas-no-lo-se.test.js` (no se edita) carga cada práctica y prueba cada `explicacion` con 200 ítems:
  sin restos (`undefined`, `NaN`…), etiquetas cerradas, sin «×» desde la unidad 2, distinta en cada idioma, y que
  ningún ejercicio se quede sin declarar.
- **Que lleve la solución del ítem** se prueba en un fichero propio por práctica, `tests/practicas-ayuda-<slug>.test.js`:
  1000 ítems o más por ejercicio, en los idiomas de la práctica, y la explicación contiene la solución que el
  ejercicio da por buena (calculada con las funciones de su `logica.js`, no copiada de la explicación).
- **A mano:** leer 15 explicaciones de cada ejercicio en cada idioma y comprobar las cuentas una a una.
- **En el navegador:** `http://localhost:<puerto>/practicas/<slug>/?probar=1&ejercicio=<n>`, pulsar el botón en cada
  ejercicio, a 375 px y en ancho, en español y en inglés («See in English» / «Ver en español»), con la consola limpia.
  Nunca con el código de un alumno.
