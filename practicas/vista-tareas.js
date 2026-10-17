// Lo que comparten la página de la tarea (`semana.js`) y la portada (`portada.js`)
// para enseñar una tarea v2: de dónde se lee su progreso, la asignación del
// alumno, las frases de plazo y retraso y el agrupado por unidades. Son
// funciones sin DOM (se prueban en `tests/practicas-semana.test.js`).
//
// Reglas (DISENO.md, B y D):
//  - la tarea 1 (`progresoPorPractica`) lee el progreso de la práctica, como
//    siempre; las demás, el de su propia tarea;
//  - quien no está asignado a una tarea `asignada` la ve como un repaso más, sin
//    ninguna marca de que otros la tienen obligatoria.

import { CATALOGO, ID_PLANTILLA, UNIDADES, unidadActual } from './_comun/catalogo.js';
import { leer, escribir, progresoGuardado } from './_comun/base.js';
import { leerAsignacion } from './_comun/nube.js';
import { diaDeFecha, estadoPlazo, tareasPublicadas } from './_comun/tareas.js';

/** Qué `tareaId` se pasa a la base para leer el progreso: null en la tarea 1 (práctica), el id en las v2. */
export const ambitoDeTarea = tarea => (tarea.progresoPorPractica ? null : tarea.id);

/** `progresoDe(slug, n)` para `estadoTarea`, leído de donde guarda esta tarea. */
export function progresoDeTarea(tarea, codigo, leerProgreso = progresoGuardado) {
  const cache = new Map();
  return (slug, n) => {
    if (!cache.has(slug)) cache.set(slug, leerProgreso(slug, codigo, ambitoDeTarea(tarea)));
    return cache.get(slug)[n - 1] ?? null;
  };
}

// --- Asignación -----------------------------------------------------------------------

export const claveAsignacion = codigo => `practicas.asignacion.${codigo}`;

/** La copia de la asignación guardada en el navegador: lista de ids de tarea, o null si no hay. */
export function asignacionGuardada(codigo, leerClave = leer) {
  try {
    const valor = JSON.parse(leerClave(claveAsignacion(codigo)));
    return Array.isArray(valor) && valor.every(Number.isInteger) ? valor : null;
  } catch { return null; }
}

/**
 * Lee la asignación de la nube (como mucho 4 s), la copia en el navegador y
 * devuelve la lista de ids. Sin red, sin documento o sin permiso se sigue con
 * la copia (o null si tampoco hay copia: todas las asignadas salen como repaso).
 */
export async function cargarAsignacion(codigo, { leerRemota = leerAsignacion, leerClave = leer, escribirClave = escribir } = {}) {
  const remota = await leerRemota(codigo);
  if (remota && Array.isArray(remota.tareas)) {
    escribirClave(claveAsignacion(codigo), JSON.stringify(remota.tareas));
    return remota.tareas;
  }
  return asignacionGuardada(codigo, leerClave);
}

/** ¿Está el alumno marcado en esta tarea? (Solo tiene sentido en las `asignada`.) */
export const asignadaAMi = (tarea, asignacion) => Boolean(tarea.asignada && asignacion?.includes(tarea.id));

// --- Plazo y retraso ------------------------------------------------------------------

/**
 * Lo que se pinta del plazo de una tarea para el alumno. `t` es `T[idioma]`.
 *   tipo      'repaso' | 'obligatoria' | 'obligatoria_para_ti'
 *   etiqueta  Repaso / Obligatoria / Obligatoria para ti
 *   frase     «Plazo: jueves 22-10», «Fuera de plazo · 3 días de retraso»,
 *             «Entregada con 3 días de retraso» o «✓ Entregada»; '' si no hay plazo
 *   estado    'plazo' | 'fuera' | 'tarde' | 'entregada' | '' (clase de color)
 */
export function vistaPlazo(tarea, estado, hoyDia, asignado, t) {
  const p = estadoPlazo(tarea, estado, hoyDia, asignado);
  const etiqueta = t[`tarea_${p.tipo}`] ?? t.tarea_repaso;
  const conPlazo = p.tipo !== 'repaso' && Boolean(tarea.hasta);
  let frase = '', clase = '';
  if (conPlazo) {
    if (p.entregada) [frase, clase] = p.fueraDePlazo ? [t.tarea_entregada_tarde(p.diasRetraso), 'tarde'] : [t.tarea_entregada, 'entregada'];
    else [frase, clase] = p.fueraDePlazo ? [t.tarea_fuera_de_plazo(p.diasRetraso), 'fuera'] : [t.tarea_plazo(tarea.hasta), 'plazo'];
  }
  return { tipo: p.tipo, etiqueta, frase, estado: clase, ...p };
}

/** ¿Se terminó este ejercicio después del plazo? Solo cuenta en una tarea con plazo que es obligatoria para el alumno. */
export function ejercicioFueraDePlazo(tarea, ej, tipo) {
  return tipo !== 'repaso' && Boolean(tarea.hasta) && Boolean(ej?.terminado) && (ej.dia ?? 0) > diaDeFecha(tarea.hasta);
}

/** Cuando la práctica es de otra unidad que la tarea, el nombre lleva «· repaso U1». */
export const esRepasoDeOtraUnidad = (ficha, tarea) => Boolean(ficha?.unidad) && ficha.unidad !== tarea.unidad;

// --- Portada por unidades -------------------------------------------------------------

/**
 * Las secciones de la portada el día `hoy`: la unidad actual primero y las
 * anteriores después (de la más reciente a la más antigua). No salen las
 * unidades que aún no han llegado ni las que no tienen nada publicado.
 */
export function seccionesPorUnidad(hoy, { catalogo = CATALOGO, tareas, unidades = UNIDADES } = {}) {
  const actual = unidadActual(hoy, unidades);
  const publicadas = catalogo.filter(p => p.disponible && p.id !== ID_PLANTILLA && p.unidad);
  const secciones = unidades.filter(u => u.n <= actual).map(u => ({
    unidad: u,
    actual: u.n === actual,
    tareas: tareasPublicadas(hoy, tareas, u.n),
    practicas: publicadas.filter(p => p.unidad === u.n),
  })).filter(s => s.tareas.length || s.practicas.length);
  return [...secciones.filter(s => s.actual), ...secciones.filter(s => !s.actual).sort((a, b) => b.unidad.n - a.unidad.n)];
}

export const CLAVE_ABIERTAS = 'practicas.portada.abiertas';

/** Qué unidades plegables dejó abiertas el alumno: { '1': true }. */
export function unidadesAbiertas(leerClave = leer) {
  try {
    const v = JSON.parse(leerClave(CLAVE_ABIERTAS));
    return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
  } catch { return {}; }
}

export function recordarUnidad(n, abierta, { leerClave = leer, escribirClave = escribir } = {}) {
  escribirClave(CLAVE_ABIERTAS, JSON.stringify({ ...unidadesAbiertas(leerClave), [n]: Boolean(abierta) }));
}
