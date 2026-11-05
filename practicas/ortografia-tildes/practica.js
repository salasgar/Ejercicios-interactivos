// Ortografía: las tildes (id 64; ESQUELETO puesto por la tarea 134, 2026-11-03).
// Los cuatro ejercicios, en orden de dificultad, los escribe la tarea 135:
//
//   1. La sílaba tónica (aguda, llana, esdrújula)
//   2. ¿Lleva tilde? (reglas generales)
//   3. Diptongos e hiatos
//   4. Las palabras de Matemáticas
//
// Cada ejercicio con tres niveles (../_comun/nivel.js) y las piezas de
// ../_comun/ortografia.js. El contrato, en docs/practicas-ortografia.md, §3.

import { arrancar } from '../_comun/base.js';
import { enConstruccion } from '../_comun/ortografia.js';

arrancar({
  slug: 'ortografia-tildes',
  idioma: 'es',
  ejercicios: [enConstruccion(135), enConstruccion(135), enConstruccion(135), enConstruccion(135)],
});
