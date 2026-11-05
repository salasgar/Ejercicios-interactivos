// Ortografía: puntuación y mayúsculas (id 66; ESQUELETO puesto por la tarea 134, 2026-11-03).
// Los cuatro ejercicios, en orden de dificultad, los escribe la tarea 137:
//
//   1. Mayúsculas
//   2. El punto y la coma
//   3. Dos puntos, puntos suspensivos y el saludo
//   4. El correo al profesor (y asunto / cuerpo)
//
// Cada ejercicio con tres niveles (../_comun/nivel.js) y las piezas de
// ../_comun/ortografia.js. El contrato, en docs/practicas-ortografia.md, §3.

import { arrancar } from '../_comun/base.js';
import { enConstruccion } from '../_comun/ortografia.js';

arrancar({
  slug: 'ortografia-puntuacion',
  idioma: 'es',
  ejercicios: [enConstruccion(137), enConstruccion(137), enConstruccion(137), enConstruccion(137)],
});
