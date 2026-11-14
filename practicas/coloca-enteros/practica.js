// Coloca los paréntesis. Con enteros (U3): los tres ejercicios, todos «encuentra todos los
// resultados». La pantalla y el motor son los comunes (`_comun/parentesis-*.js`).

import { arrancar } from '../_comun/base.js';
import { TX, P, EXPLICACIONES } from './textos.js';
import { generar } from './logica.js';

const EJERCICIOS = TX.ejercicios.map((x, i) => ({
  nombre: x.nombre,
  detalle: x.detalle,
  introduccion: x.introduccion,
  // Sin fallos: solo cuentan las pistas (cinco expresiones), como en la U1.
  objetivo: 5,
  penalizacion: 0,
  generar: (rng, sesion) => generar(i + 1, rng, sesion),
  montar: P.montarTodos,
  enunciado: P.enunciadoTodos,
  // «No lo sé»: colocar los paréntesis es de procedimiento (construir).
  explicacion: EXPLICACIONES[i],
  noLoSe: { es: 'No sé hacerlo', en: 'I don’t know how' },
}));

arrancar({ slug: 'coloca-enteros', ejercicios: EJERCICIOS });
