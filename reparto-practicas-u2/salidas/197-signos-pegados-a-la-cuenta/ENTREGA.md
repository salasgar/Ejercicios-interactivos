# ENTREGA · Tarea 197 · El signo va pegado a la cuenta (base común)

Sesión `s-20261114T211653-2333dc16` (encadenada tras la 24), 2026-11-14. Commit del código: **eabecac** en `origin/main`
(5e5a158 en el `main` local del árbol compartido, que va divergente; mismo contenido).

## Lo hecho

### El arreglo

- **`practicas/_comun/piezas.js`, `pegarSignos(html)`**: trabaja sobre el HTML como texto, en dos pasos.
  1. Cada `.cuenta` / `.cuenta-frac` (la más externa) se lleva dentro los signos que la siguen (`. , ; : ) » ” ! ? …`) y los
     que la preceden (`( « “ ¿ ¡`), también si entre medias hay etiquetas en línea (`<strong>…cuenta…</strong>.`, el caso de
     `fraccion-decimal` ej. 3). Van en un `<span class="signo-cuenta">`, sin negrita.
  2. Cada `.frac` (dentro o fuera de una cuenta) se junta con el signo pegado a ella en un `<span class="frac-y-signo">`
     (`inline-block`). La fracción es `inline-flex`, una columna: el signo no puede ir dentro.
  Solo toca las cuentas más externas. El HTML sin cuentas ni fracciones sale igual, el texto visible no cambia y es idempotente.
- **`practicas/_comun/base.js`**: la base lo aplica a los cinco `innerHTML` de la caja `#feedback`: tarjeta del «No lo sé»,
  traducción, acierto, acierto con `espera: 'boton'` (el que añadió Juan Luis esta tarde, 7fc94b9) y fallo.
  **Ninguna práctica se toca.**
- **`practicas/_comun/estilos.css`**: `.cuenta > .signo-cuenta { font-weight: 400 }` (en negrita solo si lo que rodea a la
  cuenta lo está) y `.frac-y-signo { display: inline-block }`. `.cuenta` y `.cuenta-frac` no cambian: siguen sin `nowrap`.

Por qué así y no `nowrap`: un bloque en línea no se parte por dentro si cabe en el renglón, y a la vez no ensancha la página si
no cabe (la 37). Lo que fallaba era el corte justo *detrás* del bloque; con el signo dentro, ese corte deja de existir. Probé
también un U+2060 (*word joiner*) entre la fracción y el signo. En Chrome no basta: la fracción y el signo se separaron en 5
de 261 anchos, igual que sin él. Con `inline-block`, en 0.

### El «×» de la unidad 1

`tests/practicas-no-lo-se.test.js` ya no exceptúa la U1: el «×» queda prohibido en todas las explicaciones. Las quince
prácticas de la U1 pasan. Comentario del test y frase de `docs/no-lo-se.md` («sin «×» en ninguna unidad (también la 1)») al día.

### Tests

Cinco tests nuevos en `tests/practicas-comun.test.js`:
- cuenta con punto; con coma y texto; paréntesis y comillas alrededor; `¿…?`;
- dos cuentas seguidas; cuenta al final sin signo; clase con más nombres; `.cuenta-frac`; cuenta dentro de cuenta; `<sup>` y `<br>` dentro;
- `<strong>` en medio; fracción suelta; fracción dentro de cuenta seguida de «)»;
- HTML sin cuentas, y clases parecidas (`cuenta-campo`, `juntador__cuenta`, `cuentas`): sale igual;
- idempotencia, y que el texto visible no cambia;
- en el CSS: las dos reglas nuevas, y `.cuenta` / `.cuenta-frac` siguen con `inline-block` + `overflow-wrap: anywhere` y sin `nowrap`.

`node --test tests/practicas-comun.test.js tests/practicas-no-lo-se.test.js`: 140/140. `npm test`: **2323/2323**, en el árbol
compartido y sobre `origin/main` con el cherry-pick.

### La medida

Chrome headless por CDP, `?probar=1&ejercicio=<k>`, **con la caché desactivada** (ver «Trampas»). Por ejercicio, seis «No lo
sé» seguidos, con la traducción abierta. Se cuenta como signo suelto:
- un signo de cierre que empieza renglón por debajo del carácter anterior;
- un signo de apertura que acaba renglón por encima del siguiente;
- siempre dentro del mismo párrafo. No cuenta el «:» de dividir, que lleva espacio delante.

El guion: `hechos/notas/s-20261114T211653-2333dc16-medir-signos-sueltos.mjs`. Muestra de 33 ejercicios:
- los cuatro peores de la 193 (`reloj` ej. 2, `leelo` ej. 2, `distributiva` ej. 1, `baldosas` ej. 3);
- dos prácticas de fracciones enteras (`multiplica-divide` 1-5, `fraccion-decimal` 1-4);
- veinte más de las seis unidades: `jerarquia` 2, `exponente` 1, `division` 2, `expresion` 1, `semaforo` 1, `criba` 3,
  `errores` 1, `factorizaciones` 2, `saltos` 2, `signos-producto` 3, `jerarquia-enteros` 2, `variacion` 1, `suma-resta` 2,
  `combinadas-fracciones` 1, `equivalentes` 2, `suma-resta-decimales` 2, `multiplica-divide-decimales` 3, `leelo5` 1,
  `transposicion` 1, `valor-numerico` 1.

| | Tarjetas | Signos sueltos | Junto a una cuenta | Ejercicios con alguno | Desbordan |
|---|---|---|---|---|---|
| Antes, 375 px | 198 | 98 | 97 | 13 de 33 | 0 |
| Después, 375 px | 198 | **0** | **0** | 0 | 0 |
| Después, 1200 px | 198 | 1* | 1* | 1* | 0 |
| Después, feedback de acierto/fallo (opciones al azar), 375 px | 56 en 11 ejercicios, 118 cuentas | **0** | 0 | 0 | 0 |

\* Falso positivo de `leelo` ej. 2: la coma es el símbolo que se lee (la cuenta «, → and»), al principio de su propia cuenta, no
detrás de otra.

Antes, los cuatro peores tenían 17, 26, 12 y 7, como en la 193 (18, 16, 12 y 10). Del total de antes, 3 eran el «:» de dividir,
que la primera versión del guion contaba.

Capturas a 375 px en `capturas/`: `antes-*` y `despues-*` de los cuatro peores. `despues-equivalentes-frac-y-signo-375.png`
muestra una fracción con sus «:» (alineación en vertical, igual que antes).

**Fuera de las zonas de la base** (punto 3 de la ficha): en las introducciones y los enunciados de la misma muestra (195
ítems a 375 px) no hay **ningún** signo suelto. No hace falta nada más.

## Hallazgos fuera de criterio (para Juan Luis)

1. **`distributiva`, ej. 1 (la tarjeta del «No lo sé»)**: «el trozo de la derecha (1 celdas) se quita» / «(1 cells)» cuando el
   trozo es de una celda (`textos.js`, línea 136). La 198 no lo tiene. Es una línea en la carpeta de la **27**
   (`distributiva`): se puede añadir a la 198, que ya toca ese fichero.
2. **El arreglo también cubre fracciones sueltas**, fuera de cuenta: «… son equivalentes. ⅓ y ²⁄₆:» (`equivalentes`) y «La
   respuesta es **⅓**.» (`multiplica-divide`). La ficha solo hablaba de `.cuenta` y `.cuenta-frac`. Lo he metido porque era el
   mismo defecto y se arregla en el mismo sitio, con una regla CSS de una línea.
3. **El test de la 37** que cita la ficha («hay un test de eso en `tests/practicas-comun.test.js`») no existe en ese fichero.
   He añadido uno que comprueba en el CSS que `.cuenta` y `.cuenta-frac` siguen sin `nowrap`.
4. Detalle de estilo: un signo que estaba fuera de un `<strong>` y ahora entra (para ir con la cuenta) sale en negrita si la
   cuenta está dentro del `<strong>`. Un punto en negrita no se distingue; no he añadido más CSS por eso.

## Lo que no se ha tocado

Ninguna carpeta de práctica, ni `catalogo.js`, ni `practicas/_comun/relaciones.js`. Tampoco el resto de `estilos.css`, salvo
las dos reglas nuevas y el comentario de cabecera de `.cuenta`.
