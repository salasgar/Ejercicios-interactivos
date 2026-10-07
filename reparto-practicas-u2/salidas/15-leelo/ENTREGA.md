# Entrega — Tarea 15: Léelo en inglés

Commit: `15d353b`
Ficheros: `practicas/leelo/{index.html,practica.js,logica.js,textos.js,estilos.css}`, `tests/practicas-leelo.test.js`

## Qué tiene

Tres ejercicios, todos con el inglés como único idioma de lo que se oye/lee
(la interfaz y el feedback son bilingües, como pide la ficha):

1. **Escúchalo**: botón «▶ Listen» (voz en-GB si existe, si no cualquier en-*,
   si no la por defecto; sin voz, modo lectura automático tras hasta 1 s de
   espera a `voiceschanged`). Lee en voz alta una factorización, un GCD o un
   LCM; cuatro opciones en notación (`60 = 2² · 3 · 5`, `GCD(24, 36) = 12`,
   `LCM(4, 6) = 12`), los distractores cambian solo una potencia o un número,
   nunca el orden de los factores.
2. **¿Cómo se lee?**: se ve la notación, se elige la lectura correcta en
   inglés entre cuatro; todas las opciones de un mismo ítem usan el mismo
   estilo (equals/is equal to, times/multiplied by, GCD/greatest common
   divisor/HCF, LCM/lowest common multiple/least common multiple) para no
   enfrentar nunca dos formas válidas entre sí.
3. **Completa la frase**: 11 plantillas (divisible by/between/of, divisor
   of/by/in, multiple of/by/for, goes into, GCD/LCM stands for, 1 is...,
   divisor pair, criba, 0 es múltiplo de todo, el primo más pequeño), con
   datos al azar donde los hay.

Destrezas: U2-2B-03, U2-3B-03, U2-1B-01, U2-1B-02, U2-1B-05, U2-2B-01,
U2-2B-02 (ver ficha §Objetivo).

## Decisión de alcance (no es un cambio del contrato)

La ficha menciona ejemplos de frase para «primo»/«compuesto» («seven is a
prime number», «fifty-one is a composite number») en el ejercicio 1, pero el
ejercicio 2 solo da ejemplos de notación para `fact`/`gcd`/`lcm`. Para que
las opciones de los ejercicios 1 y 2 sean siempre «notación» consistente, los
generadores de esos dos ejercicios usan solo esas tres clases; `primo` y
`compuesto` no se usan (no estaban obligadas por ninguna destreza del
inventario fuera de esos ejemplos). Si se prefiere añadirlas, es una tarea
corta de ampliación, no un cambio de contrato.

## Cómo probarlo en 1 minuto

```
npm run servir
```
`http://localhost:8080/practicas/leelo/?c=AAAA` → «Try without a code» →
ejercicio 1 (escuchar, requiere voz del sistema o aparece el modo lectura),
ejercicio 2 (ver notación, elegir lectura), ejercicio 3 (completar frase).
Probado en el navegador (Chrome, vía MCP) en ES y EN, acertando y fallando
en los tres ejercicios; sin errores en consola.

## Tests

`node --test tests/practicas-comun.test.js tests/practicas-leelo.test.js` →
51/51 en verde (12 propios de `leelo`, incluidos los 20 casos fijos de
`leer()` y ~15000 ítems de fuerza bruta entre los tres ejercicios).

## Para la tarea 18

Pide poner `disponible: true` en `practicas/_comun/catalogo.js` para el slug
`leelo` (id 14) cuando se publique.

## Nota de coordinación (no es mío)

`npm test` completo, a mitad de mi trabajo, tuvo 3 fallos en
`tests/practicas-comun.test.js` (contador 20/5/40 vs 10/2/20): era la tarea
35 editando `_comun/contador.js` en caliente con reclamo vivo
(`s-20261007T205921-9d74da56`). Al cerrar yo, `npm test` completo ya está en
verde (51/51 solo con mis ficheros + comun; no he corrido el resto del
repositorio).
