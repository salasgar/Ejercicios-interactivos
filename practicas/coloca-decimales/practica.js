// Coloca los paréntesis. Con decimales (U5): dos «encuentra todos los resultados» y una diana.
// La pantalla y el motor son los comunes (`_comun/parentesis-*.js`).

import { arrancar } from '../_comun/base.js';
import { TX, P, EXPLICACIONES } from './textos.js';
import { generar } from './logica.js';

const EJERCICIOS = TX.ejercicios.map((x, i) => ({
  nombre: x.nombre,
  detalle: x.detalle,
  introduccion: x.introduccion,
  // En los dos primeros no hay fallos: solo cuentan las pistas (cinco expresiones), como en la U1.
  ...(i < 2 ? { objetivo: 5, penalizacion: 0 } : {}),
  generar: (rng, sesion) => generar(i + 1, rng, sesion),
  montar: i < 2 ? P.montarTodos : P.montarDiana,
  enunciado: i < 2 ? P.enunciadoTodos : P.enunciadoDiana,
  // «No lo sé»: colocar los paréntesis es de procedimiento (construir).
  explicacion: EXPLICACIONES[i],
  noLoSe: { es: 'No sé hacerlo', en: 'I don’t know how' },
}));

arrancar({ slug: 'coloca-decimales', ejercicios: EJERCICIOS });
