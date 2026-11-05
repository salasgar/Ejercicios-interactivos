// Ortografía: las letras (id 65; ESQUELETO puesto por la tarea 134, 2026-11-03).
// Los cuatro ejercicios, en orden de dificultad, los escribe la tarea 136:
//
//   1. hay, ahí, ay; a ver, haber (y repaso de la h)
//   2. b o v
//   3. g o j, y la diéresis
//   4. Otras letras (ll/y, mp/mb, r/rr, c/z/qu, -d/-z, cc, x/s)
//
// Cada ejercicio con tres niveles (../_comun/nivel.js) y las piezas de
// ../_comun/ortografia.js. El contrato, en docs/practicas-ortografia.md, §3.

import { arrancar } from '../_comun/base.js';
import { enConstruccion } from '../_comun/ortografia.js';

arrancar({
  slug: 'ortografia-letras',
  idioma: 'es',
  ejercicios: [enConstruccion(136), enConstruccion(136), enConstruccion(136), enConstruccion(136)],
});
