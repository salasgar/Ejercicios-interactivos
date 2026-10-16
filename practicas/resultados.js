// Junta en una sola tabla lo que se sabe de cada alumno: la lista de nombres,
// los códigos de resultado y los datos de la nube. Puro, para poder probarlo.

import { practicaPorSlug } from './_comun/catalogo.js';
import { leerCodigoAlumno } from './_comun/codigos.js';
import { estadoTarea } from './_comun/tareas.js';

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
 * Los puntos de cada tarea (sobre `maximo`, 100 en las de 6 ★ + 4) salen de
 * `estadoTarea`, la misma función del marcador del alumno: 10 por ejercicio
 * terminado y, a medias, la parte proporcional (eso solo lo sabe la nube).
 *
 * @param tareas          las columnas, en orden (de `_comun/tareas.js`)
 * @returns [{ indice, nombre, tareas: [{ id, estrellaHechos, nEstrella, elegirHechos, nElegir,
 *            cumplida, empezada, puntos, maximo, fallos, tope, dia, fuente }] }]
 */
export function juntarTareas(nombres, deCodigosTarea, deCodigos, deNube, tareas) {
  // Lo que se sabe de cada ejercicio por su práctica: «practica|indice» →
  // [{ terminado, empezado, fallos, dia, puntos, objetivo }] (puntos y objetivo:
  // los del intento a medias que va mejor, para los puntos de la tarea).
  const porPractica = new Map();
  const anotarEj = (practica, indice, n, e, dia) => {
    const clave = `${practica}|${indice}`;
    if (!porPractica.has(clave)) porPractica.set(clave, []);
    const lista = porPractica.get(clave);
    const previo = lista[n] ?? { terminado: false, empezado: false, fallos: 0, dia: 0, puntos: 0, objetivo: 0 };
    const fraccion = x => (x.objetivo > 0 ? x.puntos / x.objetivo : 0);
    const medias = !e?.terminado && e?.puntos > 0 && e?.objetivo > 0 && fraccion(e) > fraccion(previo) ? e : previo;
    lista[n] = {
      terminado: previo.terminado || Boolean(e?.terminado),
      empezado: previo.empezado || Boolean(e?.terminado) || (e?.aciertos ?? 0) + (e?.fallos ?? 0) > 0,
      fallos: Math.max(previo.fallos, e?.fallos ?? 0),
      dia: Math.max(previo.dia, e?.terminado ? (e.dia ?? dia ?? 0) : 0),
      puntos: medias.puntos,
      objetivo: medias.objetivo,
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
    // Los puntos, con la función del marcador: lo que esa función espera de cada ejercicio.
    const hechoDe = new Map([...tarea.estrella.map(([s, n], i) => [`${s}/${n}`, estrella[i]]), ...tarea.elegir.map(([s, n], i) => [`${s}/${n}`, elegir[i]])]);
    const marcador = estadoTarea(tarea, (slug, n) => {
      const p = dePractica([slug, n]);
      return { terminado: hechoDe.get(`${slug}/${n}`), puntos: p?.puntos ?? 0, objetivo: p?.objetivo ?? 0, fallos: p?.fallos ?? 0, dia: p?.dia ?? 0 };
    });
    return {
      id: tarea.id,
      estrellaHechos,
      nEstrella: tarea.estrella.length,
      elegirHechos,
      nElegir: tarea.nElegir,
      cumplida: estrellaHechos === tarea.estrella.length && elegirHechos >= tarea.nElegir,
      empezada: suyos.length > 0 || conPracticas,
      puntos: marcador.puntos,
      maximo: marcador.maximo,
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
 * «Qué falla más»: una fila por ejercicio con lo que ha hecho la clase.
 *
 * De cada alumno se toma lo mismo que enseña la tabla de su práctica
 * (`juntarResultados`: entre código y nube, la fuente con más terminados). Si
 * la lista de nombres tiene alguno, solo cuentan los alumnos de la lista (así
 * el código de prueba del profesor no ensucia la cuenta); si está vacía, todos.
 *
 * @param nombres    lista de nombres
 * @param deCodigos  [{ practica, indice, ejercicios, dia }]
 * @param deNube     [{ practica, indice, ej }]
 * @param ejercicios [{ practica: { id, nEjercicios }, n }]: las filas (n empieza en 1)
 * @returns [{ practica (id), n, empezados, terminados, fallos, fallosPorAlumno, reinicios, tope }],
 *          ordenadas de más a menos fallos por alumno que lo empezó (y luego por fallos).
 *          `tope`: algún código de resultado contaba 15 fallos o más (el código no cuenta más).
 */
export function juntarFallos(nombres, deCodigos, deNube, ejercicios) {
  const conLista = nombres.some(Boolean);
  const porPractica = new Map();
  const filasDe = practica => {
    if (!porPractica.has(practica.id)) {
      const filas = juntarResultados(nombres, deCodigos.filter(c => c.practica === practica.id), deNube.filter(d => d.practica === practica.id), practica.nEjercicios);
      porPractica.set(practica.id, conLista ? filas.filter(f => f.nombre) : filas);
    }
    return porPractica.get(practica.id);
  };
  return ejercicios.map(({ practica, n }) => {
    const suyos = filasDe(practica).map(f => f.ejercicios[n - 1]).filter(Boolean);
    const empezados = suyos.filter(e => e.terminado || (e.aciertos ?? 0) + (e.fallos ?? 0) > 0);
    const fallos = empezados.reduce((s, e) => s + (e.fallos ?? 0), 0);
    return {
      practica: practica.id,
      n,
      empezados: empezados.length,
      terminados: empezados.filter(e => e.terminado).length,
      fallos,
      fallosPorAlumno: empezados.length ? fallos / empezados.length : 0,
      reinicios: empezados.reduce((s, e) => s + (e.reinicios ?? 0), 0),
      tope: empezados.some(e => e.tope),
    };
  }).sort((a, b) => b.fallosPorAlumno - a.fallosPorAlumno || b.fallos - a.fallos || a.practica - b.practica || a.n - b.n);
}

/**
 * Vista «Fallos» (registro de cada fallo, tarea 39): los fallos más repetidos y
 * qué le cuesta a cada alumno.
 *
 * @param fallos  [{ alumno (código), practica (slug), ejercicio (desde 1), t, item, feedback, respuesta?, error?, repeticion }]
 * @param filtros { ejercicios: [[slug, n]] (los de una tarea), practica: slug, ejercicio: n, alumno: código,
 *                  alumnos: Set de códigos (solo esos; p. ej. los de la lista) }; todos opcionales
 * @param ejemplos cuántos ejemplos por grupo (los más recientes)
 * @returns { total, grupos: [{ practica, ejercicio, error, veces, alumnos, ejemplos }],
 *            porAlumno: [{ alumno, total, ejercicios: [{ practica, ejercicio, veces }] }] }
 *          Grupos: por `error` cuando la práctica lo da y, si no, por ejercicio; de más a
 *          menos veces. Por alumno: de más a menos fallos, y sus ejercicios igual.
 */
export function agruparFallos(fallos, filtros = {}, ejemplos = 3) {
  const enTarea = filtros.ejercicios ? new Set(filtros.ejercicios.map(([s, n]) => `${s}/${n}`)) : null;
  const vale = f => (!enTarea || enTarea.has(`${f.practica}/${f.ejercicio}`))
    && (!filtros.practica || f.practica === filtros.practica)
    && (!filtros.ejercicio || f.ejercicio === filtros.ejercicio)
    && (!filtros.alumno || f.alumno === filtros.alumno)
    && (!filtros.alumnos || filtros.alumnos.has(f.alumno));
  const elegidos = fallos.filter(vale).sort((a, b) => (b.t ?? 0) - (a.t ?? 0));

  const grupos = new Map();
  const alumnos = new Map();
  for (const f of elegidos) {
    const clave = `${f.practica}|${f.ejercicio}|${f.error ?? ''}`;
    if (!grupos.has(clave)) grupos.set(clave, { practica: f.practica, ejercicio: f.ejercicio, error: f.error ?? '', veces: 0, deQuien: new Set(), ejemplos: [] });
    const g = grupos.get(clave);
    g.veces++;
    g.deQuien.add(f.alumno);
    if (g.ejemplos.length < ejemplos) g.ejemplos.push({ alumno: f.alumno, t: f.t, item: f.item, feedback: f.feedback, respuesta: f.respuesta ?? '' });

    if (!alumnos.has(f.alumno)) alumnos.set(f.alumno, { alumno: f.alumno, total: 0, porEjercicio: new Map() });
    const a = alumnos.get(f.alumno);
    a.total++;
    const e = `${f.practica}|${f.ejercicio}`;
    a.porEjercicio.set(e, (a.porEjercicio.get(e) ?? 0) + 1);
  }
  const porPracticaEj = (x, y) => x.practica.localeCompare(y.practica) || x.ejercicio - y.ejercicio;
  return {
    total: elegidos.length,
    grupos: [...grupos.values()]
      .map(({ deQuien, ...g }) => ({ ...g, alumnos: deQuien.size }))
      .sort((x, y) => y.veces - x.veces || y.alumnos - x.alumnos || porPracticaEj(x, y) || x.error.localeCompare(y.error)),
    porAlumno: [...alumnos.values()]
      .map(a => ({
        alumno: a.alumno,
        total: a.total,
        ejercicios: [...a.porEjercicio].map(([e, veces]) => { const [practica, n] = e.split('|'); return { practica, ejercicio: Number(n), veces }; })
          .sort((x, y) => y.veces - x.veces || porPracticaEj(x, y)),
      }))
      .sort((x, y) => y.total - x.total || x.alumno.localeCompare(y.alumno)),
  };
}

/**
 * Documentos de Firestore → datos planos para las funciones de arriba.
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
