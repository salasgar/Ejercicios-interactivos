// Ortografía: palabras que se confunden (id 67; ESQUELETO puesto por la tarea 134, 2026-11-03).
// Los tres ejercicios, en orden de dificultad, los escribe la tarea 138:
//
//   1. ¿Junto o separado?
//   2. Suenan igual, se escriben distinto
//   3. Números y símbolos
//
// Cada ejercicio con tres niveles (../_comun/nivel.js) y las piezas de
// ../_comun/ortografia.js. El contrato, en docs/practicas-ortografia.md, §3.

import { arrancar } from '../_comun/base.js';
import { enConstruccion } from '../_comun/ortografia.js';

arrancar({
  slug: 'ortografia-palabras',
  idioma: 'es',
  ejercicios: [enConstruccion(138), enConstruccion(138), enConstruccion(138)],
});
