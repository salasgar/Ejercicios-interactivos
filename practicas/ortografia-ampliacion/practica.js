// Ortografía: ampliación (id 68; ESQUELETO puesto por la tarea 134, 2026-11-03).
// Más allá de 1.º ESO; nunca es ★ en una tarea semanal. Los cuatro ejercicios, en
// orden de dificultad, los escribe la tarea 139:
//
//   1. porque, por qué, porqué, por que
//   2. Formas verbales mal escritas
//   3. Siglas, abreviaturas y prefijos
//   4. Puntuación avanzada
//
// Cada ejercicio con tres niveles (../_comun/nivel.js) y las piezas de
// ../_comun/ortografia.js. El contrato, en docs/practicas-ortografia.md, §3.

import { arrancar } from '../_comun/base.js';
import { enConstruccion } from '../_comun/ortografia.js';

arrancar({
  slug: 'ortografia-ampliacion',
  idioma: 'es',
  ejercicios: [enConstruccion(139), enConstruccion(139), enConstruccion(139), enConstruccion(139)],
});
