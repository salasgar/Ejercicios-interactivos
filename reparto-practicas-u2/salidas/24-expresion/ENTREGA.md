# Entrega de la tarea 24 · Del enunciado a la expresión (repaso de la unidad 1)

Sesión: s-20261007T213246-c81731a7 · commit del código: **d5f2caf**

## Ficheros entregados (git show --stat d5f2caf: 6 ficheros, 1907 líneas)

- `practicas/expresion/index.html`, `practica.js`, `logica.js`, `textos.js`, `estilos.css`
- `tests/practicas-expresion.test.js` (17 tests)

URL local: `npm run servir` y http://localhost:8080/practicas/expresion/

## Qué tiene

El alumno lee un enunciado y **monta con fichas la expresión que lo modela, sin calcularla**:
fichas con los números del problema, `+ − · :`, `( )` y, en el ejercicio 3, `²` y `√`. Tocar
una ficha la añade al final de la línea; tocar una ya colocada la quita; `⌫` quita la última
y «Borrar» las quita todas. Una expresión mal escrita (dos signos seguidos, paréntesis sin
cerrar…) se avisa y **no cuenta como fallo**.

| Ejercicio | Qué pide | Destrezas |
|---|---|---|
| 1 · Dos operaciones | Sin paréntesis: suma de productos, producto ± cantidad, cantidad − producto, tres factores, multiplicar-dividir-multiplicar, y frases sin «todo» (16 plantillas) | 1A-17, 2C-25 a 2C-28, 4C-04 a 4C-08, 4B-17 |
| 2 · ¿Hace falta el paréntesis? | Paréntesis imprescindible: reparto de un coste conjunto, «todo multiplicado por / dividido entre», cantidad menos una suma… (15 plantillas). En el 30 %, un enunciado donde el paréntesis **sobra** (5 plantillas): se puede poner o no, y la app comenta que no hacía falta | 2A-16, 4A-17, 4B-01, 4B-02, 4B-18, 4C-02, 4C-03, 4C-09 |
| 3 · Cuadrados y raíces | El cuadrado de la suma frente a la suma de los cuadrados, la raíz de la suma frente a la suma de las raíces, 3 · 4² frente a (3 · 4)², en frases y en contexto (15 plantillas). En el 30 %, **elegir** entre el modelo y su «gemela» | 3A-16, 4B-03, 4B-04, 4C-24, 4C-10, 4A-16, 2C-29, 4C-01, 4C-22 |

51 plantillas en total (se pedían 30), todas en español y en inglés.

## Cómo se corrige (lo que hace ALTO a esta tarea)

**Nunca por el valor.** Cada número se trata como si fuera una letra y las dos expresiones se
desarrollan hasta un cociente de polinomios (`equivalentes` en `logica.js`). Vale lo mismo
que el modelo todo lo que es *la misma expresión*: la conmutativa y la asociativa de + y ·,
los paréntesis que sobran, `a − b − c` por `a − (b + c)` y la distributiva
(`12 · 5 + 3 · 5` por `(12 + 3) · 5`). Se rechaza lo que solo coincide en el resultado
(`2 · 2 · 3` por `(2 + 2) · 3`), y entonces el feedback dice que es una casualidad.

Va más allá de lo que pedía la ficha («conmutatividad y paréntesis redundantes»): con solo
eso se marcaría como fallo `50 − 12 − 3` en «50 € menos un libro de 12 y un estuche de 3», que
es un planteamiento correcto. La regla de oro manda: no dar por mala una respuesta buena.

Feedback de fallo: lo que ha escrito el alumno con su valor, qué tipo de error es (falta el
paréntesis, agrupa lo que no va junto, operación cambiada, resta o división al revés, el
cuadrado o la raíz sobre otra cosa), si se ha dejado algún número, y la explicación del
modelo con los números de ese ítem.

## Revisión a mano de las 51 plantillas (regla de oro)

Hecha, una por una, en los dos idiomas: ninguna admite dos modelos distintos (salvo formas
equivalentes, que se aceptan). Puntos que se miraron con cuidado:

- Las frases sin «todo» / «all» («8 más 40 dividido entre 5») siguen la convención de la
  unidad (4B-02, 4B-17): sin «todo» no hay paréntesis. La tarjeta de introducción del
  ejercicio 2 lo recuerda.
- «camisetas»: el descuento es **por camiseta** («cada camiseta tiene 5 € de descuento»), para
  que `a · c − b` sea inequívocamente falso.
- «autobuses», «huevos», «lápices»: «además» separa la cantidad suelta, para que no se lea
  como «por cada caja».
- «salón» (17 filas de 17 sillas): vale `17² − 5` y `17 · 17 − 5`.
- «la diferencia de a y b» siempre con a > b.
- Inglés: se aclaran entre paréntesis *each*, *left*, *equally*, *taken*, *broken*, *cheaper* y
  *ride*, que son las palabras no matemáticas que deciden la respuesta.
- En todos los ítems los números son distintos entre sí, el resultado es un natural y ninguna
  de las expresiones erróneas declaradas da lo mismo que el modelo (test con 5000 ítems).

El test comprueba además cada plantilla contra el resultado del problema **escrito a mano
aparte** (tabla `RESULTADO` del test, leída del enunciado y no de la familia).

## Cómo probarlo en 1 minuto

1. `npm run servir` y abrir http://localhost:8080/practicas/expresion/ → «Probar sin código».
2. Ejercicio 2: en un enunciado de reparto, montar la expresión **sin** paréntesis → fallo
   con la explicación; con paréntesis → acierto. En una frase «… más el producto de …»,
   poner el paréntesis de más → acierto con el comentario «no hacía falta».
3. Escribir `7 +` y «Comprobar» → aviso amarillo, sin fallo.
4. Ejercicio 3: esperar a que salga uno de elegir (dos botones).

## Comprobado

- `node --test tests/practicas-comun.test.js tests/practicas-expresion.test.js`: 56 de 56.
  `npm test`: 558 de 558 (2026-10-08 05:06 UTC).
- Chrome sin ventana (puppeteer-core), a 375 px y a 1100 px, en español, en inglés y en modo
  alterno: los tres ejercicios, acertando y fallando, montar y elegir, expresión mal formada,
  quitar tocando / ⌫ / Borrar, paréntesis que sobra y la traducción tras responder. Sin
  desplazamiento horizontal y sin errores de consola. Las escrituras a Firestore se cortaron.

## Pendiente para otros

- **Tarea 18:** poner `disponible: true` a `expresion` en `practicas/_comun/catalogo.js`.
- Sin propuestas de cambio del contrato de la base.
