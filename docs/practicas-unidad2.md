# Prácticas interactivas de la unidad 2 (`practicas/`)

Escrito el 2026-10-08, al cerrar el reparto PU2 (`reparto-practicas-u2/`). Es el documento
que la coordinación de la unidad necesita sobre las prácticas, con el mismo espíritu que
[coordinacion-unidad1.md](coordinacion-unidad1.md): qué hay, cómo se amplía, cómo se leen los
resultados y qué destreza del inventario practica cada una.

Son 31 mini-aplicaciones sin cuentas para 1.º ESO bilingüe: 16 de la unidad 2
(Divisibilidad) y 15 de repaso de la unidad 1. Todas se apoyan en una **base común**
(`practicas/_comun/`) y comparten **un solo panel del profesor** (`practicas/profesor.html`).

- Portada: https://salasgar.github.io/Ejercicios-interactivos/practicas/
- En local: `npm run servir` y http://localhost:8080/practicas/ (los módulos ES no cargan
  abriendo el fichero).

## 1. Qué ve el alumno

1. Entra con su **código de 4 caracteres** (el mismo en todas, y el que ya tenía en
   `divisores/`). El enlace que reparte el panel es `practicas/?c=ABCD`: la portada guarda el
   código y las prácticas lo encuentran. También puede «probar sin código» (no se guarda nada).
2. Cada práctica tiene entre 2 y 5 ejercicios. En cada uno hay que **llegar a 10 puntos**:
   cada acierto da 1 punto y **5 aciertos seguidos dan 1 extra** (con felicitación). Cada
   fallo **quita 1 punto** (nunca por debajo de 0) **y una vida**; hay **5 vidas** y, si se
   pierden todas, el ejercicio vuelve a empezar desde 0 (los fallos acumulados se conservan
   para el profesor). Un ejercicio puede declarar otro objetivo (el árbol de factores pide 6
   árboles). Las constantes viven en `practicas/_comun/contador.js`, para ajustarlas cuando se
   vea cómo reaccionan los alumnos; un ejercicio terminado con unas normas sigue terminado
   aunque cambien. Este modelo sustituyó el 2026-10-08, antes de que ningún alumno usara las
   prácticas, al de «10 aciertos, +2 por fallo, tope 20».
3. El **idioma de cada ítem lo sortea la base** (modo alterno, en bloques equilibrados de
   cuatro: dos en español y dos en inglés). El alumno no lo elige; después de responder puede
   ver el mismo ítem en el otro idioma. El profesor puede fijarlo para un alumno con
   `?idioma=es` o `?idioma=en` en el enlace (queda guardado para ese código;
   `?idioma=alterno` lo quita).
4. Al fallar, el mensaje dice qué ha pasado **con los números de ese ítem**, no una regla
   genérica, y la base añade unas palabras de ánimo.
5. Al terminar un ejercicio aparece el **código de resultado** (16 caracteres), que el alumno
   copia y envía.

## 2. Cómo lee el profesor los resultados

En `practicas/profesor.html`:

1. **Alumnos y sus códigos.** Se pega la lista de clase (un nombre por línea; no sale del
   navegador). El panel asigna un código a cada línea y da el enlace de cada alumno; el
   selector «Idioma de los enlaces» los genera todos en alterno, en español o en inglés. La
   lista es la misma que usaba el panel antiguo de `divisores/`: mismos alumnos, mismos
   códigos.
2. **Resultados**, de dos fuentes que el panel junta:
   - los **códigos de resultado** que mandan los alumnos, pegados tal cual (el mensaje entero
     vale: el panel extrae los códigos). Cada código dice de quién es, de qué práctica, qué
     ejercicios ha terminado, con cuántos fallos (hasta 15 por ejercicio) y qué día. Lee
     mezclados los de 16 caracteres y los antiguos de 12 de `divisores/`;
   - la **nube**: el progreso se copia en Firestore (`practicas/{práctica}--{código}`, regla
     en `firestore.rules`) y el panel lo lee entrando con la cuenta del profesor. Si la nube
     falla no se pierde nada: el código de resultado lleva lo necesario para calificar.
3. La vista «Resumen de todas las prácticas» da una fila por alumno; eligiendo una práctica
   se ve ejercicio a ejercicio. Las dos tablas se descargan en CSV.

El código de resultado **no es criptografía** (el programa es público): impide inventárselo
a ojo o copiar el de un compañero, no a quien lea el código fuente.

## 3. La base común (`practicas/_comun/`)

| Fichero | Qué pone |
|---|---|
| `base.js` | `arrancar(practica)`: entrada por código, menú, contador, feedback, traducción, código de resultado, guardado en el navegador y en Firestore. También `validarPractica`, `parametrosDe`, `claveProgreso`, `documentoNube`, `leer`/`escribir`/`borrar` y `URL_PORTADA` |
| `catalogo.js` | Las 32 filas (31 prácticas y la plantilla): `id`, `slug`, `ruta`, `nombre { es, en }`, `nEjercicios`, `disponible` |
| `codigos.js` | Código de alumno (4 caracteres, misma sal que `divisores/`) y de resultado (16) |
| `contador.js` | `OBJETIVO = 10`, `PENALIZACION = 1`, `VIDAS = 5`, `RACHA = 5`, `EXTRA = 1`; `ejercicioNuevo`, `anotar`, `queHaPasado`, `migrarProgreso`, fechas |
| `aritmetica.js` | `esPrimo`, `factorizar`, `divisores`, `parejasDivisores`, `mcd`, `mcm`, `criterio(n, d)` con `CRITERIOS = [2, 3, 5, 9, 10, 11]`, y las operaciones con factorizaciones (`multiplicarFact`, `dividirFact`, `mcdFact`, `mcmFact`, `htmlFact`…) |
| `piezas.js` | `elecciones` (botones de elegir, con `marcar`) y `pasos` (contador −/valor/+) |
| `textos.js` | Textos comunes `T[idioma]`, `unir(frases, idioma, 'y' \| 'o')`, `esc` |
| `rng.js` | `crearRng(semilla)`: `azar()`, `entero(min, max)`, `elegir(lista)`, `barajar(lista)` |
| `estilos.css` | Lo que comparten: `.instruccion`, `.operacion`, `.elecciones`, `.si-no`, `.pasos`, `.rejilla`, `.hueco`, `.ficha`, `.comprobar`, `.cuenta`… (la lista está en su cabecera) |

**El catálogo está lleno.** El código de resultado reserva 5 bits para la práctica (ids 0 a
31) y los 32 están ocupados. Una práctica más exige cambiar el formato del código de
resultado (`codigos.js`, el panel y sus tests), y los códigos ya repartidos dejarían de
leerse si no se conserva el formato antiguo. Los `id` **no se renumeran ni se reordenan**:
viajan dentro de los códigos. El orden en que la portada enseña las prácticas no es el del
catálogo: está en `BLOQUES`, en `practicas/portada.js`.

## 4. El contrato de una práctica

Manda `practicas/plantilla/practica.js`, que es un ejemplo que funciona
(http://localhost:8080/practicas/plantilla/). Lo que sigue está copiado de su cabecera y de
la terminada de la tarea 01, tal como quedó tras la tarea 35.

Una práctica son cinco ficheros en `practicas/<slug>/` y un test:

```
logica.js    generadores y comprobaciones, PUROS (se prueban con npm test)
textos.js    textos propios, siempre { es, en }
practica.js  los `montar` (la interfaz) y la llamada a `arrancar`
estilos.css  lo que no esté ya en ../_comun/estilos.css
index.html   el armazón (copiado de la plantilla)
tests/practicas-<slug>.test.js
```

`arrancar({ slug, ejercicios })`:

- `slug`: el del catálogo. De ahí salen el id, el título y cuántos ejercicios tiene que
  haber; si no coincide, la base lo dice en pantalla y no arranca.
- Cada ejercicio declara:

| Campo | |
|---|---|
| `nombre`, `detalle` | `{ es, en }`, una línea cada uno (salen en el menú) |
| `objetivo`, `penalizacion`, `vidas` | opcionales; por defecto 10 puntos, −1 por fallo y 5 vidas. Si no se declaran, la práctica hereda cualquier cambio futuro de la base. (`inicial` y `maximo`, del modelo antiguo, hacen que la base no arranque) |
| `introduccion` | opcional, `{ es: html, en: html }`: una tarjeta con botón «Empezar» cada vez que se abre el ejercicio |
| `generar(rng, sesion)` | devuelve el ítem, que son **datos puros**. `sesion` es `{ aciertos, fallos, puntos, vidas, anterior }` (`aciertos` son los del intento en curso: vuelven a 0 al perder las vidas, así que valen como número de paso): sirve para graduar la dificultad o para un ejercicio por pasos. **No recibe el idioma**: el ítem tiene que valer para los dos |
| `clave(item)` | opcional (por defecto `JSON.stringify`): la base no repite la clave anterior (lo intenta hasta 5 veces) |
| `montar(contenedor, item, api)` | pinta el ítem e instala sus eventos |

Lo que recibe `montar` en `api`:

- `api.idioma`: `'es'` o `'en'`, el idioma **de este ítem**, no un ajuste global.
- `api.t`: textos comunes en ese idioma (`comprobar`, `siguiente`, `si`, `no`, `verdadero`,
  `falso`, `borrar`, `fijate`…). `api.tt(obj)`: atajo para los textos propios `{ es, en }`.
- `api.esc(texto)`, `api.respondido()`.
- `api.responder({ acierto, html, espera, pistas })`: **una vez por ítem**. `html` es la
  explicación con los números de ese ítem. Acierto: feedback verde y pasa solo al siguiente a
  los `espera` ms (1300 por defecto; algo más si hay punto extra por la racha, que se anuncia).
  Fallo: feedback rojo con los puntos perdidos y las vidas que quedan (o el aviso de que el
  ejercicio vuelve a empezar), el ánimo y el botón «Siguiente». `pistas` (entero ≥ 0) son las
  ayudas usadas: se suman a los fallos sin tocar los puntos ni las vidas.

Cosas que conviene saber, aprendidas al escribir las 31:

- La base **monta el mismo ítem dos veces** cuando el alumno pide la traducción (la segunda,
  de solo lectura, con `api.respondido()` ya en `true` y un `api.responder` que no hace
  nada). `montar` no puede depender de un `id` único en el documento ni dar por hecho que el
  ítem está sin responder.
- La base no toca nada del contenedor después de montar: marcar en verde o en rojo y
  bloquear los botones es cosa de `montar`, **antes** de llamar a `api.responder`.
- Si `montar` lanza una excepción, la base enseña un aviso y un botón «Siguiente» sin
  penalizar.
- `.comprobar { display: block }` de la base anula el atributo `hidden`: un
  `boton.hidden = true` no esconde «Comprobar». Varias prácticas lo resuelven en su CSS
  (`.comprobar[hidden] { display: none }`); está propuesto llevarlo a la base.
- El fallo se anota al responder: quien sale al menú a mitad de un ítem que se construye en
  varios pasos no pierde ni puntos ni vidas.

## 5. Cómo se añade una práctica

1. Hoy no cabe ninguna más (apartado 3). Si se libera o se amplía el catálogo: copiar
   `practicas/plantilla/` a `practicas/<slug>/`, dar de alta la fila en `catalogo.js` con
   `disponible: false` y actualizar las listas de `tests/practicas-comun.test.js`.
2. Escribir `logica.js` (puro) y su test **antes** que la interfaz. El test tiene que
   comprobar por fuerza bruta, con muchos ítems, que la respuesta dada por buena lo es y que
   ninguna otra opción lo es también.
3. Cumplir las reglas de contenido (las ocho de `reparto-practicas-u2/proyecto.md`):
   «divisor» y no «factor» para la relación entre números; GCD y no HCF; producto con `·`;
   inglés sencillo; **todo distractor es inequívocamente falso**; nada que no se haya dado
   (sin letras: el hueco es `□`); el 0 es múltiplo de todos y el 1 divisor de todos;
   feedback con los números del ítem.
4. Probarla en 375 px y en 1024 px, en español y en inglés (`?idioma=es`, `?idioma=en`),
   acertando y fallando en cada ejercicio.
5. Añadir su `slug` a un bloque de `BLOQUES` y su línea a `DESCRIPCION` en
   `practicas/portada.js`, y poner `disponible: true`.

## 6. Las 31 prácticas

`id` es el del catálogo (el que viaja en el código de resultado). El orden es el de la
portada.

### Unidad 2 · Divisibilidad

| Semana | `slug` | id | Ejercicios |
|---|---|---|---|
| 1 | `semaforo` | 1 | Semáforo básico (2, 3, 5, 9, 10) · Con el 11 · Criterios compuestos (6, 15, 22, 30, 33) · La cifra que falta |
| 1 | `rectangulos` | 2 | Descubre los rectángulos · Sin dibujo: las parejas · ¿Dónde se para? |
| 1 | `recta` | 3 | Marca los múltiplos (del 0 al 60) · Marca los divisores · ¿Verdadero o falso? |
| 2 | `criba` | 4 | La criba de Eratóstenes · ¿Primo o compuesto? · ¿Hasta qué primo hay que probar? |
| 2 | `arbol` | 5 | Construye el árbol · ¿Está terminada? · Completa el árbol |
| 2 | `divisiones` | 6 | La escalera de divisiones · La forma de potencias · Comprobar multiplicando |
| 2 | `fabrica` | 7 | Construye el divisor · ¿Cuántos divisores tiene? · Sin dividir |
| 2 | `factorizaciones` | 15 | El producto · ¿Es múltiplo? · El cociente |
| 3 | `venn` | 8 | Reparte los factores · El m.c.d. con factores primos · El m.c.m. con factores primos · Mezcla y comprobación |
| 3 | `imposibles` | 9 | ¿Puede ser? · La comprobación del producto · Nómbralo |
| 4 | `clasificador` | 10 | Enunciados limpios · Con trampa («mayor» y «menor» no deciden) · Justifícalo |
| 4 | `reloj` | 11 | Predice la coincidencia · La hora de reloj · Cada cuántos días (tres datos) |
| 4 | `baldosas` | 12 | La baldosa más grande · ¿Cuántas baldosas? · Cuerdas |
| 4 | `errores` | 13 | ¿Hay un error? · Señala el paso · Nombra el error |
| toda | `leelo` | 14 | Escúchalo · ¿Cómo se lee? · Completa la frase |
| toda | `divisores` | 0 | «De» o «entre» · Con multiplicaciones · Con divisiones · Mezcla · Arrastrar a «__ es múltiplo de __» |

`divisores` vive en `divisores/` (su URL de siempre) y desde la tarea 17 está montada sobre
la base. Las demás, en `practicas/<slug>/`.

**Publicadas en la portada el 2026-10-08: 20 de las 31.** Las otras once existen y se abren
por su URL, pero siguen con `disponible: false` en el catálogo porque la revisión final
encontró en ellas algo que penaliza una respuesta correcta o que no se puede contestar:
`divisiones`, `imposibles`, `clasificador`, `reloj` y `errores` (unidad 2), y `jerarquia`,
`exponente`, `distributiva`, `mental`, `errores1` y `propiedades` (repaso). Cada una tiene su
reapertura en `reparto-practicas-u2/hechos/reabiertas/`, con lo que hay que corregir; quien
la cierre pone su `disponible: true`. El detalle, en el veredicto de la tarea 18 (apartado 8).

### Repaso de la unidad 1

| `slug` | id | Ejercicios | Destrezas del inventario de la unidad 1 |
|---|---|---|---|
| `jerarquia` | 17 | Sin paréntesis · Potencias y raíces · Con paréntesis · Agrupadores invisibles | 1A-03, 1A-04, 1A-09, 1A-14, 1A-15, 2A-14, 2A-15, 3A-07 a 3A-10, 3A-13, 3A-14, 4A-09, 4A-10, 4A-14, 4A-15 |
| `parentesis` | 16 | Tres números · Con un cuadrado · Con resta y división · Una sola diana | 1A-10 a 1A-15, 2A-07, 2A-08, 2A-13 |
| `exponente` | 18 | ¿A qué afecta el exponente? · Multiplicación repetida · El cuadrado de la suma, con áreas | 3C-01, 3C-04, 3C-05, 3A-05, 3A-06, 4A-04, 1A-12, 3A-12, 4A-05, 3B-01 a 3B-03, 3B-05, 3B-11 |
| `raiz` | 19 | Forma el cuadrado · Sin dibujo · Problemas | 3C-11 a 3C-14, 3C-20 a 3C-23, 3C-27 a 3C-29, 4C-14, 4C-15, 3B-07 a 3B-09, 3B-12, 3B-22 |
| `division` | 20 | Reparte en cajas · La prueba de la división · ¿Qué significa el resto? · ¿Puede ser? | 2C-01 a 2C-09, 4C-11, 4C-12, 2B-04, 2B-05, 2B-15, 2B-17 a 2B-19, 2B-25 |
| `expresion` | 21 | Dos operaciones · ¿Hace falta el paréntesis? · Cuadrados y raíces | 4C-01 a 4C-10, 4C-22, 4C-24, 2C-29, 2A-16, 1A-17, 4A-16, 4A-17, 4B-01 a 4B-04, 4B-17, 4B-18 |
| `redondeo` | 22 | En la recta · A tres órdenes · Estimar y cazar el error | 1C-09 a 1C-19, 1C-21, 1C-22, 4C-16, 4C-17, 4C-20, 1B-12, 1B-13, 1B-24 |
| `constructor` | 23 | Construye el número · Valor de las cifras · Comas, puntos y palabras | 1C-01 a 1C-08, 1C-24, 1C-25, 1B-05, 1B-11, 1B-16 |
| `distributiva` | 24 | Parte el rectángulo · Saca factor común · Compensa con 99 | 2A-01 a 2A-04, 2C-17 a 2C-21, 2C-30, 4C-18, 2B-12, 2B-20 |
| `potencias10` | 25 | El deslizador de ceros · El «and» y los ceros · Billion, million y trillion | 3C-10, 3B-13 a 3B-18, 1B-14, 1B-15, 1B-25, 1B-26, 1C-24 |
| `dictado` | 26 | Dictado en inglés · -teen o -ty, y cómo se escribe · Ortografía española | 1B-01 a 1B-04, 1B-06 a 1B-10, 1B-17 a 1B-23 |
| `mental` | 27 | Compensar · Descomponer · ¿Qué conviene? | 2C-20 a 2C-24, 2C-30, 2C-31, 2B-21, 2B-22 |
| `especiales` | 28 | ¿Verdadero o falso? · ¿Cuál es la falsa? | 3C-01, 3C-05 a 3C-10, 3C-29, 3C-30, 3B-01 a 3B-03 |
| `errores1` | 29 | ¿Hay un error? · Señala el paso · Nombra el error | 4A-10 a 4A-13, 4B-16, 4C-22, y como repaso 1A-03 a 1A-05, 1A-12, 2C-03, 2C-05, 3A-06, 3C-01, 3C-11 |
| `propiedades` | 30 | Junta las potencias · Potencia de potencia y cadenas · ★ La última cifra (reto) | 3C-15 a 3C-19, 3B-06 (ampliación) |

Los identificadores de la unidad 1 son los de `inventario-unidad1.tsv` (en la carpeta de
apuntes, `1. Natural numbers, powers and roots/cuestionarios/comun/reparto/salidas/06-reserva/`),
tal como los cita la ficha de cada tarea en `reparto-practicas-u2/tareas/`.

## 7. Qué práctica cubre qué destreza de la unidad 2

Una fila por destreza de `inventario-unidad2.tsv` (78), con las prácticas que la trabajan
según la ficha de cada tarea. «—» quiere decir que ninguna práctica la trabaja de forma
expresa.

| Destreza | Sem. | Nuclear | Qué es | Prácticas |
|---|---|---|---|---|
| U2-1A-01 | 1 | sí | Decidir sin calcular si el número que se busca cabe en los datos (divisor común) o los contiene (múltiplo… | `clasificador` |
| U2-1A-02 | 1 | sí | Resolver con listas de múltiplos un problema de coincidencia con dos datos hasta 50 | `reloj` |
| U2-1A-03 | 1 | sí | Resolver con listas de divisores un problema de grupos iguales con dos datos hasta 50 | — |
| U2-1A-04 | 1 |  | Dar la respuesta de un problema con su nombre: es un m.c.d. (GCD) o es un m.c.m. (LCM) | `imposibles`, `clasificador` |
| U2-1B-01 | 1 | sí | Vocabulario básico de la divisibilidad en los dos idiomas: multiple, divisor (también factor), divisible… | `leelo`, `divisores` |
| U2-1B-02 | 1 |  | Decir «divisible by», nunca «divisible between» | `leelo` |
| U2-1B-03 | 1 | sí | Vocabulario de los criterios: digit, last digit, sum of the digits, ends in, even / odd | — |
| U2-1B-04 | 1 |  | Vocabulario de lo común: divisor pair, common divisor, common multiple | `rectangulos` |
| U2-1B-05 | 1 | sí | Nombres y siglas del m.c.d. y el m.c.m. en los dos idiomas: GCD (también HCF y GCF) y LCM (lowest o least) | `leelo` |
| U2-1B-06 | 1 |  | Distinguir las dos acepciones de «divisor» (el de una división cualquiera y el de un número) y de «factor»… | — |
| U2-1C-01 | 1 |  | Reconocer la relación de divisibilidad a partir de una división exacta (la prueba de la división con resto 0) | `divisores` |
| U2-1C-02 | 1 | sí | No confundir múltiplo, divisor y divisible: si a es múltiplo de b, entonces a es divisible entre b y b es… | `recta`, `divisores` |
| U2-1C-03 | 1 | sí | Escribir los primeros múltiplos de un número y decidir si un número es múltiplo de otro | `recta` |
| U2-1C-04 | 1 | sí | Hechos generales, sin darles la vuelta: el 1 es DIVISOR de todos y el 0 es MÚLTIPLO de todos (no al… | `recta` |
| U2-1C-05 | 1 | sí | Aplicar los criterios del 2, del 5 y del 10 (la última cifra) | `semaforo` |
| U2-1C-06 | 1 | sí | Aplicar el criterio del 3 (la suma de las cifras, no la última cifra) | `semaforo` |
| U2-1C-07 | 1 | sí | Aplicar el criterio del 9 y distinguirlo del criterio del 3: todo múltiplo de 9 lo es de 3, pero no al revés | `semaforo` |
| U2-1C-08 | 1 |  | Aplicar el criterio del 11 | `semaforo` |
| U2-1C-09 | 1 |  | Aplicar los criterios compuestos (6, 15, 22, 30, 33) y saber cuándo no se pueden combinar: divisible entre… | `semaforo` |
| U2-1C-10 | 1 |  | Hallar la cifra que falta para que un número sea divisible | `semaforo` |
| U2-1C-11 | 1 |  | Explicar con la descomposición polinómica por qué funcionan los criterios del 2, 5, 10, 3 y 9 | — |
| U2-1C-12 | 1 |  | Ampliación: criterios del 4 y del 25 | — |
| U2-1C-13 | 1 | sí | Hallar todos los divisores de un número por parejas, sin olvidar el 1 ni el propio número | `rectangulos` |
| U2-1C-14 | 1 |  | Saber cuándo parar al buscar divisores: en la raíz entera; en un cuadrado perfecto la pareja central se… | `rectangulos` |
| U2-1C-15 | 1 |  | Hallar con listas los divisores comunes y los múltiplos comunes de dos números | — |
| U2-1C-16 | 1 | sí | Calcular con listas el m.c.d. y el m.c.m. de dos números pequeños | — |
| U2-2A-01 | 2 | sí | Resolver problemas de m.c.d. y m.c.m. con dos datos hasta 100, con listas acortadas con los criterios y… | — |
| U2-2A-02 | 2 |  | Responder la segunda pregunta: cuántos grupos salen y cuántos de cada tipo hay en cada grupo | `baldosas` |
| U2-2A-03 | 2 |  | Resolver una coincidencia con tres datos pequeños | `reloj` |
| U2-2A-04 | 2 |  | Reconocer los datos que no tienen más divisor común que el 1 | — |
| U2-2B-01 | 2 | sí | Vocabulario de los primos: prime number, composite number, neither prime nor composite, sieve of… | `criba`, `leelo` |
| U2-2B-02 | 2 |  | Vocabulario de la factorización: prime factor, factor tree, branch, repeated division, prime… | `arbol`, `divisiones`, `leelo` |
| U2-2B-03 | 2 |  | Leer en voz alta una factorización en inglés | `leelo` |
| U2-2C-01 | 2 | sí | Definir número primo y número compuesto por su número de divisores | `criba` |
| U2-2C-02 | 2 | sí | Saber que el 1 no es primo ni compuesto | `criba` |
| U2-2C-03 | 2 | sí | Saber que el 2 es el único primo par y que primo no es lo mismo que impar | `criba` |
| U2-2C-04 | 2 |  | Construir la criba de Eratóstenes hasta 100 y explicar por qué basta tachar los múltiplos de 2, 3, 5 y 7 | `criba` |
| U2-2C-05 | 2 | sí | Reconocer los primos menores que 100 (de memoria, los menores que 50) | `criba` |
| U2-2C-06 | 2 |  | Decidir si un número es primo probando los primos hasta su raíz entera | `criba` |
| U2-2C-07 | 2 | sí | Detectar los compuestos que parecen primos: 51, 57, 87 (criterio del 3) y 91, 119, 143 (hay que probar el… | `criba` |
| U2-2C-08 | 2 | sí | Descomponer un número con un árbol de factores, o completar un árbol | `arbol` |
| U2-2C-09 | 2 | sí | Reconocer una factorización sin terminar: no pueden quedar factores compuestos, tampoco los que solo se… | `arbol` |
| U2-2C-10 | 2 | sí | Descomponer un número con divisiones sucesivas, eligiendo el menor primo con los criterios | `divisiones` |
| U2-2C-11 | 2 | sí | Escribir la factorización con potencias, las bases de menor a mayor; las potencias de 10 se factorizan solas | `arbol`, `divisiones`, `factorizaciones` |
| U2-2C-12 | 2 | sí | Comprobar una factorización multiplicando, sin tratar la potencia como un producto | `divisiones`, `factorizaciones` |
| U2-2C-13 | 2 |  | Saber que la factorización es única aunque el árbol cambie | `arbol` |
| U2-2C-14 | 2 |  | Leer la factorización para decidir sin dividir si un número es divisible entre otro | `fabrica`, `factorizaciones` |
| U2-2C-15 | 2 |  | Reconocer un cuadrado perfecto en su factorización: todos los exponentes son pares | — |
| U2-3A-01 | 3 | sí | Resolver por factorización un problema de m.c.d. (repartir o cortar) con datos que ya no se pueden listar | `baldosas` |
| U2-3A-02 | 3 | sí | Resolver por factorización un problema de m.c.m. (coincidencia) con datos de dos cifras | — |
| U2-3A-03 | 3 |  | Resolver un problema de m.c.d. o m.c.m. con tres datos | — |
| U2-3A-04 | 3 |  | Resolver a simple vista un problema en el que un dato es múltiplo del otro | `reloj` |
| U2-3B-01 | 3 | sí | Vocabulario de las dos reglas: common prime factors, lowest power, highest power, common and non-common… | `venn` |
| U2-3B-03 | 3 |  | Leer en voz alta un m.c.d. o un m.c.m. en inglés | `leelo` |
| U2-3B-04 | 3 |  | Justificar en inglés el método elegido: I chose ... because ... | — |
| U2-3C-01 | 3 |  | Obtener todos los divisores de un número combinando sus factores primos | `fabrica` |
| U2-3C-02 | 3 |  | Contar los divisores a partir de los exponentes: se suma 1 a cada uno y se multiplica | `fabrica` |
| U2-3C-03 | 3 | sí | Calcular el m.c.d. por factorización (solo los primos comunes, con el menor exponente) y saber por qué | `factorizaciones`, `venn` |
| U2-3C-04 | 3 | sí | Calcular el m.c.m. por factorización (todos los primos, comunes y no comunes, con el mayor exponente) y… | `factorizaciones`, `venn` |
| U2-3C-05 | 3 | sí | No cruzar las dos reglas | `venn` |
| U2-3C-06 | 3 |  | No calcular el m.c.m. solo con los primos comunes | `venn` |
| U2-3C-07 | 3 |  | Calcular el m.c.d. y el m.c.m. de tres números | — |
| U2-3C-08 | 3 |  | Caso especial: si uno es divisor del otro, el m.c.d. es el pequeño y el m.c.m. el grande | `venn` |
| U2-3C-10 | 3 | sí | Comprobar con las desigualdades, también en contexto: el m.c.d. no pasa del menor dato y los divide a… | `venn`, `imposibles` |
| U2-3C-11 | 3 |  | Comprobar con m.c.d. x m.c.m. = a x b, sabiendo que con tres números no vale | `imposibles` |
| U2-3C-12 | 3 |  | Elegir el método (listas, factorización o a simple vista) | — |
| U2-4A-01 | 4 | sí | Decidir m.c.d. o m.c.m. cuando el enunciado empuja al revés: «mayor» y «menor» no deciden | `clasificador` |
| U2-4A-02 | 4 | sí | Resolver una coincidencia y dar la respuesta en hora de reloj | `reloj` |
| U2-4A-03 | 4 |  | Resolver un problema de cortar en trozos iguales lo más largos posible | `baldosas` |
| U2-4A-04 | 4 |  | Resolver un problema de cubrir un rectángulo con cuadrados iguales lo más grandes posible | `baldosas` |
| U2-4A-05 | 4 |  | Hallar la menor cantidad que se puede repartir de varias formas sin que sobre | — |
| U2-4A-06 | 4 |  | Resolver un problema de nivel 4 con tres datos | — |
| U2-4A-07 | 4 | sí | Responder la segunda pregunta en los problemas de la semana: cuántos trozos, cuántas baldosas, qué hora | `reloj`, `baldosas` |
| U2-4B-01 | 4 | sí | Vocabulario de los problemas: to coincide again, at the same time, share equally, cut into equal pieces,… | `clasificador` |
| U2-4B-02 | 4 |  | Explicar en inglés por qué un problema es un «GCD problem» o un «LCM problem» | `clasificador` |
| U2-4C-01 | 4 | sí | Reconocer y nombrar el error en un procedimiento: la tabla de errores típicos de toda la unidad | `errores` |
| U2-4C-02 | 4 |  | Saber lo que NO es un error: las parejas válidas de la sección 7 | `errores` |
| U2-4C-03 | 4 |  | Comprobar que el resultado de un problema es razonable | `imposibles`, `errores` |

### Destrezas de la unidad 2 sin práctica

Diecisiete de las 78. Cinco son **nucleares**:

- **U2-1A-03** — problema de grupos iguales con listas de divisores (dos datos hasta 50).
- **U2-1B-03** — vocabulario de los criterios (*digit, last digit, sum of the digits, ends
  in, even / odd*): aparece en el feedback de `semaforo`, pero ningún ejercicio lo pregunta.
- **U2-1C-16** — calcular con listas el m.c.d. y el m.c.m. de dos números pequeños.
- **U2-2A-01** — problemas de m.c.d. y m.c.m. con dos datos hasta 100.
- **U2-3A-02** — problema de m.c.m. por factorización con datos de dos cifras (`reloj` lo
  resuelve con listas y con datos hasta 50).

Las demás no son nucleares: U2-1B-06, U2-1C-11 y U2-1C-12 (fuera a propósito: explicar por
qué funcionan los criterios y los criterios del 4 y del 25 son de la hoja y de ampliación),
U2-1C-15, U2-2A-04, U2-2C-15, U2-3A-03, U2-3B-04, U2-3C-07, U2-3C-12, U2-4A-05 y U2-4A-06.
Casi todas son de tres datos o de justificar por escrito.

Para practicarlas hoy quedan las hojas de ejercicios y los cuestionarios; una práctica nueva
no cabe en el catálogo (apartado 3), así que cubrirlas pasa por añadir un ejercicio a una
práctica existente (hay sitio: el código de resultado admite hasta seis por práctica).

## 8. Dónde está lo demás

- El reparto con el que se hicieron: `reparto-practicas-u2/` (`proyecto.md`, las fichas en
  `tareas/`, lo entregado por cada tarea en `salidas/NN-<slug>/ENTREGA.md`).
- La revisión final (tarea 18): `reparto-practicas-u2/salidas/18-revision-final/`, con el
  veredicto práctica a práctica (`VEREDICTO.md`) y lo observado fuera de criterio
  (`HALLAZGOS-FUERA-DE-CRITERIO.md`).
- Tests: `tests/practicas-comun.test.js` (la base) y `tests/practicas-<slug>.test.js`
  (`tests/divisores.test.js` para `divisores/`). `npm test` los corre todos.
