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

import { CATALOGO, ID_PLANTILLA, UNIDADES, unidadActual, unidadesCon } from './_comun/catalogo.js';
import { leer, escribir, progresoGuardado } from './_comun/base.js';
import { leerAsignacion, coleccionEspacio } from './_comun/nube.js';
import { TAREAS, configDeJSON, diaDeFecha, estadoPlazo, tareasPublicadas } from './_comun/tareas.js';
import { codigoAlumno, leerCodigoSecreto, MAX_ALUMNOS } from './_comun/codigos.js';
import { claveEspacio, resolverCodigo } from './_comun/espacio.js';

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
export async function cargarAsignacion(codigo, { profesor = null, leerRemota, leerClave = leer, escribirClave = escribir } = {}) {
  // Con profesor (código de 8), la asignación está en su espacio; sin él, en `practicas-asignaciones`.
  const leerDeNube = leerRemota ?? (profesor ? c => leerAsignacion(c, { coleccion: coleccionEspacio(profesor, 'asignaciones') }) : leerAsignacion);
  const remota = await leerDeNube(codigo);
  if (remota && Array.isArray(remota.tareas)) {
    escribirClave(claveAsignacion(codigo), JSON.stringify(remota.tareas));
    return remota.tareas;
  }
  return asignacionGuardada(codigo, leerClave);
}

/** ¿Está el alumno marcado en esta tarea? (Solo tiene sentido en las `asignada`.) */
export const asignadaAMi = (tarea, asignacion) => Boolean(tarea.asignada && asignacion?.includes(tarea.id));

// --- Quién es el alumno y cuáles son sus tareas ----------------------------------------

/**
 * Lo que enseñan la portada y la página de la tarea de un alumno (tarea 65):
 *   codigo    el código normalizado (4 o 8 caracteres, mayúsculas, sin guion);
 *   modo      'antiguo' (código de 4 que la nube no conoce) | 'nuevo' (registrado, de 4 u 8);
 *   indice    número de lista (el del código de resultado), o null si no cabe en él;
 *   profesor  uid de su espacio (sistema nuevo) o null;
 *   tareas    las tareas de su profesor (o `TAREAS`, en el modo antiguo);
 *   unidades  las unidades con las fechas de su profesor (o `UNIDADES`);
 *   sinConfig el espacio no ha podido dar las tareas (se sigue sin ellas);
 * o { error: 'no-valido' | 'no-existe' | 'sin-red' }.
 */
export function contextoAntiguo(indice) {
  return { codigo: codigoAlumno(indice), modo: 'antiguo', indice, profesor: null, tareas: TAREAS, unidades: UNIDADES, sinConfig: false };
}

function contextoDeResuelto(codigo, r) {
  return {
    codigo, modo: 'nuevo', indice: Number.isInteger(r.n) && r.n >= 0 && r.n < MAX_ALUMNOS ? r.n : null,
    profesor: r.profesor, tareas: r.config.tareas, unidades: unidadesCon(r.config.unidades),
    sinConfig: Boolean(r.sinConfig), desdeCache: Boolean(r.desdeCache),
  };
}

/** Lo que se sabe de un código registrado (4 u 8) sin red ni espera: la copia del navegador, o null. Para pintar sin esperar. */
export function contextoGuardado(texto, leerClave = leer) {
  const codigo = leerCodigoSecreto(texto);
  if (codigo === null) return null;
  try {
    const dato = JSON.parse(leerClave(claveEspacio(codigo)));
    const config = configDeJSON(dato?.json);
    return typeof dato?.profesor === 'string' && Number.isInteger(dato?.n) && config ? contextoDeResuelto(codigo, { profesor: dato.profesor, n: dato.n, config, desdeCache: true }) : null;
  } catch { return null; }
}

/**
 * Resuelve un código tecleado o de enlace (4 o 8 caracteres): pregunta a la nube
 * (`resolverCodigo`), también con un código de 4 del modo antiguo, que puede estar
 * ya registrado en el sistema nuevo. Nunca lanza.
 */
export async function identificar(texto, { resolver = resolverCodigo } = {}) {
  const codigo = leerCodigoSecreto(texto);
  if (codigo === null) return { error: 'no-valido' };
  const r = await resolver(codigo);
  if (r?.error) return { error: r.error };
  if (r?.modo === 'antiguo') return contextoAntiguo(r.n);
  return r?.modo === 'nuevo' ? contextoDeResuelto(codigo, r) : { error: 'sin-red' };
}

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
