// Junta en una sola tabla lo que se sabe de cada alumno: la lista de nombres,
// los códigos de resultado y los datos de la nube. Puro, para poder probarlo.

import { EJERCICIOS } from './logica.js';

const hechosDe = ejercicios => ejercicios.filter(e => e.terminado).length;

/**
 * @param nombres   lista de nombres; la posición es el número de alumno
 * @param deCodigos [{ indice, ejercicios: [{ terminado, fallos }], dia }]
 * @param deNube    [{ indice, ej: [{ pendientes, aciertos, fallos, terminado, dia }] }]
 * @returns una fila por alumno de la lista (haya hecho algo o no) y por cada
 *          código que no esté en ella, ordenadas por número de alumno.
 */
export function juntarResultados(nombres, deCodigos, deNube) {
  const filas = new Map();
  nombres.forEach((nombre, indice) => {
    if (nombre) filas.set(indice, { indice, nombre, ejercicios: EJERCICIOS.map(() => ({ terminado: false })), hechos: 0, dia: 0, fuente: '' });
  });
  const poner = (indice, ejercicios, dia, fuente) => {
    const previa = filas.get(indice);
    const hechos = hechosDe(ejercicios);
    // Entre dos fuentes del mismo alumno gana la que tiene más ejercicios
    // terminados; a igualdad, la nube, que trae más detalle.
    if (previa?.fuente && (previa.hechos > hechos || (previa.hechos === hechos && fuente === 'código'))) return;
    filas.set(indice, { indice, nombre: previa?.nombre ?? nombres[indice] ?? '', ejercicios, hechos, dia, fuente });
  };
  for (const c of deCodigos) {
    poner(c.indice, c.ejercicios.map(e => ({ ...e, tope: e.fallos >= 15 })), c.dia, 'código');
  }
  for (const n of deNube) {
    if (!Array.isArray(n.ej)) continue;
    const ejercicios = EJERCICIOS.map(i => ({ terminado: false, fallos: 0, aciertos: 0, pendientes: 20, ...n.ej[i] }));
    poner(n.indice, ejercicios, Math.max(0, ...ejercicios.filter(e => e.terminado).map(e => e.dia ?? 0)), 'nube');
  }
  return [...filas.values()].sort((a, b) => a.indice - b.indice);
}
