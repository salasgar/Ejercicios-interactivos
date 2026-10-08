# Veredicto de la revisión final — tarea 18 (PU2)

Sesión `s-20261008T051928-1cba9950` · 2026-10-08.

**De las 31 prácticas, 3 SE ENTREGAN sin nada que corregir y 28 NO SE ENTREGAN.** De esas
28, 11 tienen un hallazgo grave (se penaliza una respuesta correcta, hay dos respuestas
defendibles o el ítem no se puede contestar) y **no se han enlazado desde la portada**; las
otras 17 tienen hallazgos menores (un texto, un feedback, el feedback que se sale de la
pantalla en el móvil) y **sí están enlazadas**. Cada NO SE ENTREGA tiene su reapertura en
`hechos/reabiertas/NN--s-20261008T051928-1cba9950.md`, con lo exacto que hay que corregir y
lo que no hay que rehacer.

Ningún hallazgo es de aritmética: en las 31 prácticas, la respuesta que el programa da por
buena es buena. Lo que falla es lo que los tests no pueden ver: el significado de los
enunciados, las respuestas correctas que el programa no esperaba, y la pantalla.

## Cómo se ha revisado

| Criterio | Qué se hizo |
|---|---|
| 1. Regla de oro | Seis revisores de solo lectura (bajo este sid) leyeron enteros `logica.js`, `textos.js` y `practica.js` de cada práctica, con su ficha y su entrega, y **muestrearon los generadores reales** (entre 400 y 6000 ítems por ejercicio) comprobando cada respuesta con aritmética propia. Los bancos de `clasificador`, `errores`, `imposibles`, `leelo`, `errores1` y las 51 plantillas de `expresion` se leyeron enteros en los dos idiomas. Cada hallazgo se verificó después en el código y los graves se reprodujeron con un script aparte. **No se han hecho a mano en el navegador los 15 ítems por ejercicio que pedía la ficha**: se sustituyeron por el muestreo, que ve muchos más ítems pero no los ve como un alumno |
| 2. Reglas de contenido | `grep` en `practicas/` y `divisores/` de `×`, HCF, GCF, «factor of», «primos entre sí», coprime, «divisible between» y criterios del 4 y del 25, más la lectura de los revisores |
| 3. Pantalla | Chrome sin ventana en 375 × 667 y en 1024 × 768, cada práctica, cada ejercicio, en español y en inglés: 8 ítems por ejercicio en móvil y 2 en escritorio, respondiendo cada uno y midiendo desbordes, botones pequeños y letra pequeña, con capturas. **No se ha probado en un móvil de verdad** ni el arrastre con el dedo. Las prácticas que se construyen en varios pasos (`arbol`, `parentesis`, `exponente`, `constructor`, `propiedades`, `venn`) solo se respondieron en parte, porque el robot no sabe terminarlas |

En escritorio (1024 px) no hay ningún desborde ni error de consola en ninguna práctica.

## Las que se entregan

| Práctica | Tarea | Veredicto | Qué se comprobó |
|---|---|---|---|
| `divisores` | 17 | **SE ENTREGA** | 5000 ítems por ejercicio sin discrepancias; el 0 y el 1 bien tratados; «múltiplo de» y «divisible entre» se aceptan las dos; sin desbordes |
| `arbol` | 06 | **SE ENTREGA** | Cualquier árbol válido se acepta (fuerza bruta de todos los repartos); salen 242, 286, 338 y 363; sin desbordes |
| `venn` | 09 | **SE ENTREGA** | 63 408 repartos del diagrama y 602 280 respuestas de contadores sin discrepancias; cada diagnóstico afirma algo cierto con los números del ítem; sin desbordes |

## Las que no se entregan, con hallazgo grave (no enlazadas desde la portada)

| Práctica | Tarea | Lo más grave | Reabierta |
|---|---|---|---|
| `reloj` | 12 | Ejercicio 2: el contador de minutos va de 5 en 5 y **el 43 % de las horas correctas no se pueden marcar** (reproducido: 1286 de 3000). Ejercicio 1: no dice «por primera vez» y hay otra coincidencia en la línea en el 70 % de los ítems; en el móvil, las celdas miden 7 × 7 px | `12--…` |
| `jerarquia` | 20 | Con dos operaciones del mismo nivel en términos distintos (`7 · 14 − 3 · 10`, `4³ + √324`) solo se acepta la de la izquierda, con el mensaje «se hace primero la de la izquierda», falso como regla. Afecta al 91 % de los ítems del ejercicio 2. El feedback del ejercicio 4 enseña decimales y negativos | `20--…` |
| `distributiva` | 27 | Con a = b o a = c hay dos fichas con el mismo número y **se rechaza una respuesta idéntica a la correcta** (reproducido: `5 · (12 − 5)` es acierto o fallo según qué 5 se toque; 18 % de los ítems de fichas). El feedback se sale de la pantalla en el móvil | `27--…` |
| `propiedades` | 33 | Reto de la última cifra: «el patrón se repite cada…» solo acepta el periodo mínimo, y los múltiplos también son verdad (la mitad de los ítems). El feedback se sale de la pantalla en el móvil | `33--…` |
| `exponente` | 21 | «Escribe 2⁴ como producto»: `2 · 8` se puede formar con las fichas y se rechaza. «4 · 4 es 4², no lo que has puesto» ante 2⁴. «Lo que has tocado daría…» no corresponde a lo tocado | `21--…` |
| `clasificador` | 11 | 12 de los 36 enunciados no piden lo que dice la clave: «bolsas iguales lo más grandes posible» es una sola bolsa; el m.c.d. da el mayor NÚMERO de bolsas. En «Justifícalo», la razón dada por buena es falsa para 6 de ellos | `11--…` |
| `imposibles` | 10 | Cuatro mini-problemas afirman algo imposible («33 lápices y 18 gomas… cada bolsa lleva 3 de cada cosa»). «¿Pueden salir 1 grupos?» | `10--…` |
| `errores` | 14 | En dos plantillas la línea marcada no es la única defendible; «ha dicho que un impar es primo» sale como distractor verdadero; el ejercicio 2 no dice «la primera línea». Las líneas largas se salen de la pantalla en el móvil | `14--…` |
| `errores1` | 32 | Cuatro plantillas dan por erróneo un desarrollo con todas las igualdades verdaderas, y otra plantilla «sin error» hace el mismo salto (**decisión de Juan Luis**). Un enunciado de cajas es defendible como correcto. Líneas que se salen de la pantalla en el móvil | `32--…` |
| `mental` | 30 | «Compenso» se da por falso en 39 + 27 («no hay nada que compensar»): 22 % de los ítems del ejercicio 3. «Lápiz y papel» siempre acierta. El feedback se sale de la pantalla en el móvil | `30--…` |
| `divisiones` | 07 | Ejercicio 2: el exponente 0 se ve «3» y el 1 se ve «3¹», sin expresión que se vaya formando: quien deja el «3» falla habiendo pensado bien. El 31 % de los ítems del ejercicio 1 son n = 11 o n = 13 | `07--…` |

## Las que no se entregan, con hallazgos menores (enlazadas desde la portada)

| Práctica | Tarea | Qué hay que corregir | Reabierta |
|---|---|---|---|
| `semaforo` | 02 | «Enciende los divisores de 2, 3, 5, 9 y 10» dice lo contrario de lo que se pide | `02--…` |
| `rectangulos` | 03 | «Sobran 1 celda»; «sobran» no es el resto sino lo que falta para cerrar el rectángulo | `03--…` |
| `recta` | 04 | «7 · k nunca da 1 si 7 > 1» (una letra); feedback sin los números del ítem; minúscula tras punto | `04--…` |
| `criba` | 05 | «todos los primos hasta n : 2» (una letra); «¿qué primos hay que probar?» no dice «la lista más corta»; fallo al tachar sin números | `05--…` |
| `fabrica` | 08 | «120 = ___. ¿Es divisible entre 12?» con los guiones a la vista; al fallar no se enseña la cuenta; divisores mayores que el número | `08--…` |
| `baldosas` | 13 | Letras a y b en una introducción; mensaje duplicado («Lado 7: Lado 7: … no cabe. no cabe.»); filas y columnas cambiadas respecto del dibujo | `13--…` |
| `leelo` | 15 | Un «×» en «3 × 4 is a ___ pair of 12» | `15--…` |
| `factorizaciones` | 16 | El feedback se sale de la pantalla en el móvil; «36 : 36 = 1 = 1»; «¿Es 3087 múltiplo de 65219?» | `16--…` |
| `parentesis` | 19 | «Estos paréntesis no cambian el resultado» sale cuando sí lo cambian; huecos de 20 px de ancho en el móvil | `19--…` |
| `raiz` | 22 | Los dos enunciados de sillas no dicen «el cuadrado más grande posible» | `22--…` |
| `division` | 23 | «¿Cuántos cajas quedan completamente llenos?»: 8 de las 12 preguntas del ejercicio 3 sin concordancia | `23--…` |
| `expresion` | 24 | Una plantilla puede dar 22,5 bolsas; la suma repetida se rechaza con «solo por casualidad» | `24--…` |
| `redondeo` | 25 | «4.730» con punto de millar se lee 4,73 y es fallo; «order» por orden de unidades | `25--…` |
| `constructor` | 26 | «cuatrocientos uno mil» (2,4 % de los ítems de palabras); feedback de «menor par» falso cuando hay un 0 | `26--…` |
| `potencias10` | 28 | El feedback se sale de la pantalla en el móvil | `28--…` |
| `dictado` | 29 | El feedback se sale de la pantalla en el móvil; sin voz dice «el número que oyes»; ejemplo fijo «fourTEEN / FORty» | `29--…` |
| `especiales` | 31 | Un «×» en el feedback inglés; «sea cual sea la base» afirma 0⁰ = 1 | `31--…` |

## Reglas de contenido: lo que dio el `grep`

- `×`: `leelo/logica.js:217` y `especiales/textos.js:88` (reabiertas). En `baldosas`,
  «Suelo de 40 × 56 dm» como notación de medidas: decisión de Juan Luis.
- HCF: solo en `errores` (plantilla que lo da por válido) y en el tercer estilo de lectura
  de `leelo`, donde es la lectura obligada de «GCD(…)» en el 8 % de los ítems: decisión de
  Juan Luis.
- «factor» por «divisor»: solo `errores`, plantilla `b-factor-divisor`, que lo da por
  no-error como pedía la ficha: decisión de Juan Luis. En `venn` y `arbol`, «prime factor»
  y «factores de una factorización», que la regla permite.
- «primos entre sí», coprime, «divisible between», criterios del 4 y del 25: no aparecen
  (el 4 solo en la trampa «divisible entre 4 y entre 6», que es de la ficha).
- Letras: `recta` (k), `criba` (n), `baldosas` (a, b), `errores` (p), `imposibles` (g, m, a,
  b). Todas en reabierta.
- Todo texto visible está en español y en inglés, salvo las frases de `leelo`, que son solo
  inglesas a propósito.

## Lo que pedían las terminadas a la 18

- `disponible: true`: puesto en las 20 prácticas sin hallazgo grave. Las otras 11 lo
  ponen sus reaperturas al cerrar (autorizado en cada reabierta, solo su fila).
- Propuestas de cambio en la base (no son de esta tarea, que no puede tocar
  `practicas/_comun/`): están en `HALLAZGOS-FUERA-DE-CRITERIO.md`, apartado «La base».
