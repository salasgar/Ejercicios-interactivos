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

## Trampa conocida del motor

`construirOpciones` (en [src/ejercicios/index.js](src/ejercicios/index.js))
toma los distractores **en orden** y se planta en tres. Si un generador declara
más de tres, los sobrantes son código muerto que no ve ningún alumno: hay que
barajar el *pool* antes de pasarlo (`rng.barajar(pool).slice(0, 3)`). El tercer
test de `distractores.test.js` detecta este caso.
