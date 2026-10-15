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
 * Tareas de la semana: una fila por alumno con lo que lleva en cada tarea.
 *
 * Un ejercicio de una tarea cuenta como terminado si lo dice un código de la
 * tarea O lo que se sabe de su práctica (códigos de práctica y nube): así se
 * ve el avance de quien no ha mandado el código de la tarea, y un ejercicio
 * terminado antes de que existiera la tarea cuenta.
 *
 * @param nombres         lista de nombres
 * @param deCodigosTarea  [{ tarea, indice, estrella: [bool], elegir: [bool], fallos, tope, dia }]
 * @param deCodigos       [{ practica, indice, ejercicios: [{ terminado, fallos }], dia }]
 * @param deNube          [{ practica, indice, ej }]
 * @param tareas          las columnas, en orden (de `_comun/tareas.js`)
 * @returns [{ indice, nombre, tareas: [{ id, estrellaHechos, nEstrella, elegirHechos, nElegir,
 *            cumplida, empezada, fallos, tope, dia, fuente }] }]
 */
export function juntarTareas(nombres, deCodigosTarea, deCodigos, deNube, tareas) {
  // Lo que se sabe de cada ejercicio por su práctica: «practica|indice» → [{ terminado, empezado, fallos, dia }].
  const porPractica = new Map();
  const anotarEj = (practica, indice, n, e, dia) => {
    const clave = `${practica}|${indice}`;
    if (!porPractica.has(clave)) porPractica.set(clave, []);
    const lista = porPractica.get(clave);
    const previo = lista[n] ?? { terminado: false, empezado: false, fallos: 0, dia: 0 };
    lista[n] = {
      terminado: previo.terminado || Boolean(e?.terminado),
      empezado: previo.empezado || Boolean(e?.terminado) || (e?.aciertos ?? 0) + (e?.fallos ?? 0) > 0,
      fallos: Math.max(previo.fallos, e?.fallos ?? 0),
      dia: Math.max(previo.dia, e?.terminado ? (e.dia ?? dia ?? 0) : 0),
    };
  };
  for (const c of deCodigos) c.ejercicios.forEach((e, n) => anotarEj(c.practica, c.indice, n, e, c.dia));
  for (const d of deNube) if (Array.isArray(d.ej)) d.ej.forEach((e, n) => anotarEj(d.practica, d.indice, n, e, 0));

  const indices = new Set(nombres.map((nombre, i) => (nombre ? i : null)).filter(i => i !== null));
  for (const c of deCodigosTarea) indices.add(c.indice);
  const enAlgunaTarea = new Set(tareas.flatMap(t => [...t.estrella, ...t.elegir]).map(([slug]) => practicaPorSlug(slug)?.id));
  for (const d of [...deCodigos, ...deNube]) if (enAlgunaTarea.has(d.practica)) indices.add(d.indice);

  const columna = (tarea, indice) => {
    const suyos = deCodigosTarea.filter(c => c.tarea === tarea.id && c.indice === indice);
    const deTarea = (lista, i) => suyos.some(c => c[lista][i]);
    const dePractica = ([slug, n]) => porPractica.get(`${practicaPorSlug(slug)?.id}|${indice}`)?.[n - 1] ?? null;
    const hecho = (lista, par, i) => deTarea(lista, i) || Boolean(dePractica(par)?.terminado);
    const estrella = tarea.estrella.map((par, i) => hecho('estrella', par, i));
    const elegir = tarea.elegir.map((par, i) => hecho('elegir', par, i));
    const practicas = [...tarea.estrella, ...tarea.elegir].map(dePractica);
    const estrellaHechos = estrella.filter(Boolean).length;
    const elegirHechos = elegir.filter(Boolean).length;
    const conPracticas = practicas.some(p => p?.empezado);
    return {
      id: tarea.id,
      estrellaHechos,
      nEstrella: tarea.estrella.length,
      elegirHechos,
      nElegir: tarea.nElegir,
      cumplida: estrellaHechos === tarea.estrella.length && elegirHechos >= tarea.nElegir,
      empezada: suyos.length > 0 || conPracticas,
      fallos: Math.max(0, ...suyos.map(c => c.fallos), practicas.reduce((s, p) => s + (p?.fallos ?? 0), 0)),
      tope: suyos.some(c => c.tope),
      dia: Math.max(0, ...suyos.map(c => c.dia), ...practicas.map(p => p?.dia ?? 0)),
      fuente: [suyos.length ? 'código de la tarea' : '', conPracticas ? 'prácticas' : ''].filter(Boolean).join(' + '),
    };
  };
  return [...indices].sort((a, b) => a - b).map(indice => ({
    indice,
    nombre: nombres[indice] ?? '',
    tareas: tareas.map(t => columna(t, indice)),
  }));
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
