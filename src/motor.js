// El motor de una tarea: genera la lista de ejercicios, registra respuestas y
// añade refuerzos. Es puro: no toca la pantalla ni la base de datos, y todas
// las funciones devuelven un progreso nuevo en vez de modificar el recibido.
//
// Un `progreso` es el documento que se guarda por alumno y tarea:
//   {
//     tareaId, titulo, semilla, idioma, notacion,   // idioma/notación fijados por la tarea (null = libre)
//     ejercicios: [{ n, tipo, refuerzo, origen, texto, enunciado, opciones }],
//     indice,                 // siguiente ejercicio por responder
//     respuestas: [{ n, tipo, refuerzo, elegida, correcta, errorId, concepto, ts }],
//     refuerzos: { concepto: cuántos se han añadido },
//     empezadaEn, terminadaEn,
//   }

import { TIPOS, CONCEPTOS, tipoPorConcepto, crearRng } from './ejercicios/index.js';
import { bilingue } from './i18n/index.js';

/** Ejercicios de refuerzo que se añaden por cada fallo con concepto. */
export const REFUERZOS_POR_FALLO = 2;
/** Tope de refuerzos por concepto y tarea, para que la tarea no crezca sin fin. */
export const TOPE_REFUERZOS_POR_CONCEPTO = 6;

function generarEjercicio(tipoId, rng) {
  const tipo = TIPOS[tipoId];
  if (!tipo) throw new Error(`Tipo de ejercicio desconocido: ${tipoId}`);
  const { texto, enunciado, opciones, solucion = null } = tipo.generar(rng);
  return { tipo: tipoId, texto, enunciado, opciones, solucion };
}

/**
 * Crea el progreso inicial de una tarea para un alumno.
 *   tarea: { id, titulo, ejercicios: [{ tipo, cantidad }] }
 */
export function generarTarea(tarea, semilla = Date.now(), ahora = Date.now()) {
  if (!tarea.ejercicios?.length) throw new Error('La tarea no tiene ejercicios');
  const rng = crearRng(semilla);
  const lista = [];
  for (const { tipo, cantidad } of tarea.ejercicios) {
    for (let i = 0; i < cantidad; i++) lista.push(generarEjercicio(tipo, rng));
  }
  const ejercicios = rng.barajar(lista).map((e, i) => ({ n: i + 1, refuerzo: false, origen: null, ...e }));
  return {
    tareaId: tarea.id,
    titulo: tarea.titulo,
    semilla,
    idioma: tarea.idioma ?? null,
    notacion: tarea.notacion ?? null,
    ejercicios,
    indice: 0,
    respuestas: [],
    refuerzos: {},
    empezadaEn: ahora,
    terminadaEn: null,
  };
}

export function ejercicioActual(progreso) {
  return progreso.ejercicios[progreso.indice] ?? null;
}

export function terminada(progreso) {
  return progreso.indice >= progreso.ejercicios.length;
}

/**
 * Registra la respuesta al ejercicio actual y devuelve el progreso nuevo.
 * Si la opción elegida lleva un concepto de error, añade refuerzos de ese
 * concepto al final de la tarea (hasta el tope).
 */
export function responder(progreso, indiceOpcion, ahora = Date.now()) {
  const ejercicio = ejercicioActual(progreso);
  if (!ejercicio) throw new Error('La tarea ya está terminada');
  const opcion = ejercicio.opciones[indiceOpcion];
  if (!opcion) throw new Error(`Opción inválida: ${indiceOpcion}`);

  const respuesta = {
    n: ejercicio.n,
    tipo: ejercicio.tipo,
    refuerzo: ejercicio.refuerzo,
    elegida: indiceOpcion,
    correcta: opcion.correcta,
    errorId: opcion.error?.id ?? null,
    concepto: opcion.error?.concepto ?? null,
    ts: ahora,
  };

  let ejercicios = progreso.ejercicios;
  const refuerzos = { ...progreso.refuerzos };
  const concepto = respuesta.concepto;
  if (concepto && CONCEPTOS[concepto]) {
    const ya = refuerzos[concepto] ?? 0;
    const nuevos = Math.min(REFUERZOS_POR_FALLO, TOPE_REFUERZOS_POR_CONCEPTO - ya);
    if (nuevos > 0) {
      // Semilla distinta por refuerzo para que no se repitan los números.
      const rng = crearRng((progreso.semilla + ejercicios.length * 7919 + progreso.respuestas.length * 104729) >>> 0);
      const tipo = tipoPorConcepto(concepto);
      const extra = [];
      for (let i = 0; i < nuevos; i++) {
        extra.push({ n: ejercicios.length + extra.length + 1, refuerzo: true, origen: concepto, ...generarEjercicio(tipo.id, rng) });
      }
      ejercicios = ejercicios.concat(extra);
      refuerzos[concepto] = ya + nuevos;
    }
  }

  const indice = progreso.indice + 1;
  return {
    ...progreso,
    ejercicios,
    indice,
    respuestas: progreso.respuestas.concat(respuesta),
    refuerzos,
    terminadaEn: indice >= ejercicios.length ? ahora : null,
  };
}

/** Resumen numérico de un progreso, para la pantalla final y para el CSV. */
export function resumen(progreso) {
  const hechos = progreso.respuestas.length;
  const aciertos = progreso.respuestas.filter(r => r.correcta).length;
  const erroresPorConcepto = {};
  for (const r of progreso.respuestas) {
    if (!r.correcta && r.concepto) erroresPorConcepto[r.concepto] = (erroresPorConcepto[r.concepto] ?? 0) + 1;
  }
  const refuerzosAnadidos = Object.values(progreso.refuerzos ?? {}).reduce((s, n) => s + n, 0);
  return {
    total: progreso.ejercicios.length,
    hechos,
    aciertos,
    porcentaje: hechos ? Math.round((100 * aciertos) / hechos) : 0,
    refuerzosAnadidos,
    erroresPorConcepto,
    terminada: terminada(progreso),
  };
}

/** Nombre legible de un concepto (en el idioma en vigor). */
export function nombreConcepto(concepto) {
  return CONCEPTOS[concepto] ? bilingue(CONCEPTOS[concepto].nombre) : concepto;
}
