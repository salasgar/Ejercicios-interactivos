# Notas para Claude

Proyecto y arquitectura: ver [README.md](README.md). Tests: `npm test`.

## Regla de oro al escribir ejercicios tipo test

**Todo distractor tiene que ser inequívocamente falso.** Antes de dar por
terminado cualquier ejercicio nuevo, hay que verificar **todos** sus
distractores uno a uno: si alguno puede darse por bueno, la pregunta tiene dos
respuestas correctas y el alumno acierta o falla por azar.

El caso típico es una diferencia que no cambia la respuesta:

> «¿Cómo se escribe 43 en inglés?» → correcta: `forty-three`.
> Poner `forty three` como distractor **no vale**: también es correcta.

Cuidado especial con:

- **Guiones, espacios y tildes**: `twenty-one` / `twentyone`, `décimo` / `decimo`.
  Solo valen como distractor si la pregunta evalúa la forma **escrita**
  («¿cuál está bien escrito?», «¿cómo se escribe…?»). En una pregunta de
  **lectura** («¿cómo se lee…?») dos formas que se pronuncian igual son dos
  respuestas correctas.
- **Variantes regionales**: `percent` es correcto en inglés americano, aunque
  el material use el británico `per cent`. `decimoprimero` y `undécimo` son
  ambos válidos en español. No se marcan como error.
- **Enunciados de opción múltiple en papel** (pruebas en LaTeX, no solo la
  app): la regla es la misma.

Tres de estas comprobaciones están automatizadas en
[tests/distractores.test.js](tests/distractores.test.js) y se ejecutan con
`npm test`. Lo que el test **no** puede comprobar es el significado, así que la
revisión a mano sigue siendo obligatoria.

## Repaso de realismo en los problemas de enunciado

Regla de Juan Luis (2026-10-16), para la app, las hojas y los exámenes: antes de dar por
terminado un enunciado con contexto, comprobar **que la situación es posible** (dos cabinas
de una noria no pasan a la vez por abajo; no se hacen pulseras con canicas) y **que todos
los números que puede sacar el generador son creíbles en ese contexto**, no solo el
ejemplo que se mira. Referencias que ya han fallado: una noria no da una vuelta en
3 segundos; un metrónomo va de 20 a 240 clics por minuto (0,25-3 s); una vuelta a la pista
de atletismo son 90-200 s; un semáforo no cambia cada 2 s; una manguera no mide 12 cm; con
m.c.d. 1, «el mayor número de pulseras» es 1 y el contexto se vuelve absurdo. Si el rango
común no le vale a un contexto, ese contexto lleva su propia cota (y un test la comprueba)
o se cambia de contexto; nunca se deja. `src/ejercicios/contextos_mcd_mcm.js` es el modelo:
cada contexto declara su `max` creíble.

## Trampa conocida del motor

`construirOpciones` (en [src/ejercicios/index.js](src/ejercicios/index.js))
toma los distractores **en orden** y se planta en tres. Si un generador declara
más de tres, los sobrantes son código muerto que no ve ningún alumno: hay que
barajar el *pool* antes de pasarlo (`rng.barajar(pool).slice(0, 3)`). El tercer
test de `distractores.test.js` detecta este caso.

## Coordinación con los cuestionarios y las hojas de ejercicios

La app, los cuestionarios tipo test semanales y las hojas de ejercicios de cada unidad
se coordinan por un inventario único de destrezas con identificadores. Está explicado en
[docs/coordinacion-unidad1.md](docs/coordinacion-unidad1.md); léelo antes de añadir o
cambiar generadores de la unidad 1.

## Nombres de alumnos: nunca en el repo

El repo es público y GitHub Pages sirve la rama main entera. Ningún archivo versionado
(tests, ejemplos, comentarios, notas de reparto, capturas) lleva nombres, apellidos,
identificadores ni correos de alumnos reales: se usan **inventados**. Lo que lleve nombres
vive en «Curso 2026-2027/» de los apuntes, fuera de git. El 2026-10-29 hubo que quitar
de `tests/corrector.test.js` cinco nombres reales que llevaban un mes publicados.
