// Junta en una sola tabla lo que se sabe de cada alumno: la lista de nombres,
// los códigos de resultado y los datos de la nube. Puro, para poder probarlo.

import { practicaPorSlug } from './_comun/catalogo.js';
import { leerCodigoAlumno } from './_comun/codigos.js';

const hechosDe = ejercicios => ejercicios.filter(e => e.terminado).length;

/**
 * Resultados de UNA práctica.
 *
 * @param nombres     lista de nombres; la posición es el número de alumno
 * @param deCodigos   [{ indice, ejercicios: [{ terminado, fallos }], dia }]
 * @param deNube      [{ indice, ej: [{ puntos, objetivo, vidas, reinicios, aciertos, fallos, terminado, dia }] }]
 * @param nEjercicios cuántos ejercicios tiene la práctica
 * @returns una fila por alumno de la lista (haya hecho algo o no) y por cada
 *          código que no esté en ella, ordenadas por número de alumno.
 */
export function juntarResultados(nombres, deCodigos, deNube, nEjercicios) {
  const numeros = Array.from({ length: nEjercicios }, (_, i) => i);
  const filas = new Map();
  nombres.forEach((nombre, indice) => {
    if (nombre) filas.set(indice, { indice, nombre, ejercicios: numeros.map(() => ({ terminado: false })), hechos: 0, dia: 0, fuente: '' });
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
    poner(c.indice, numeros.map(i => ({ terminado: false, fallos: 0, ...c.ejercicios[i], tope: (c.ejercicios[i]?.fallos ?? 0) >= 15 })), c.dia, 'código');
  }
  for (const n of deNube) {
    if (!Array.isArray(n.ej)) continue;
    const ejercicios = numeros.map(i => ({ terminado: false, fallos: 0, aciertos: 0, ...n.ej[i] }));
    poner(n.indice, ejercicios, Math.max(0, ...ejercicios.filter(e => e.terminado).map(e => e.dia ?? 0)), 'nube');
  }
  return [...filas.values()].sort((a, b) => a.indice - b.indice);
}

/**
 * Resumen de TODAS las prácticas: una fila por alumno con lo que lleva hecho
 * en cada una.
 *
 * @param nombres   lista de nombres
 * @param deCodigos [{ practica, indice, ejercicios, dia }]   (`practica` es el id del catálogo)
 * @param deNube    [{ practica, indice, ej }]
 * @param practicas [{ id, nEjercicios }]: las columnas, en orden
 * @returns [{ indice, nombre, practicas: [{ id, hechos, n, empezada }], completas }]
 */
export function juntarResumen(nombres, deCodigos, deNube, practicas) {
  const filas = new Map();
  practicas.forEach((p, columna) => {
    const suyas = juntarResultados(nombres, deCodigos.filter(c => c.practica === p.id), deNube.filter(n => n.practica === p.id), p.nEjercicios);
    for (const f of suyas) {
      if (!filas.has(f.indice)) filas.set(f.indice, { indice: f.indice, nombre: f.nombre, practicas: practicas.map(q => ({ id: q.id, hechos: 0, n: q.nEjercicios, empezada: false })), completas: 0 });
      const empezada = f.hechos > 0 || f.ejercicios.some(e => (e.aciertos ?? 0) + (e.fallos ?? 0) > 0);
      filas.get(f.indice).practicas[columna] = { id: p.id, hechos: f.hechos, n: p.nEjercicios, empezada };
    }
  });
  const lista = [...filas.values()].sort((a, b) => a.indice - b.indice);
  for (const f of lista) f.completas = f.practicas.filter(p => p.hechos === p.n).length;
  return lista;
}

/**
 * Documentos de Firestore → datos planos para las dos funciones de arriba.
 * En la colección `practicas` el id es `<slug>--<código>`; en la antigua
 * `divisores`, el código a secas (y es la práctica 0). Lo ilegible se descarta.
 */
export function leerDocumentos(docs, coleccion = 'practicas') {
  return docs.map(doc => {
    const [slug, codigo] = coleccion === 'divisores' ? ['divisores', doc.id] : String(doc.id).split('--');
    const practica = practicaPorSlug(slug);
    const indice = leerCodigoAlumno(codigo ?? '');
    if (!practica || indice === null) return null;
    try { return { practica: practica.id, indice, ...JSON.parse(doc.estado), actualizado: doc.actualizado }; } catch { return null; }
  }).filter(Boolean);
}
