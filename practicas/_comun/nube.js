// Progreso en la nube compartido entre aparatos (tarea 38 del reparto PU2).
//
// Cada alumno tiene, por práctica, un documento de Firestore
// `practicas/{slug}--{código}` con su progreso. Desde la tarea 38 el alumno
// puede LEER su documento (regla `allow get`, nunca `list`) y la app fusiona
// lo de la nube con lo del navegador antes de subir nada: así se puede seguir
// desde cualquier aparato entrando con el mismo código, y un aparato no
// machaca en la nube lo que subió otro.
//
// Todo por REST (sin el SDK de Firebase: los alumnos no tienen cuenta). Sin
// red, o sin documento (alumno nuevo, 404), se sigue con lo del navegador sin
// bloquear al alumno. Lo que no se resuelve: dos aparatos abiertos a la vez y
// respondiendo a la vez pueden pisarse (no hay transacciones por REST sin
// autenticación); cada subida vuelve a leer y fusionar, y lo que un aparato
// tenga en su navegador vuelve a subir en cuanto se entra con él.

import { firebaseConfig } from '../../src/config.js';

/** Lo que espera como mucho la lectura antes de seguir con lo del navegador. */
export const ESPERA_LECTURA = 4000;

/** Campos que se acumulan: en la fusión, el máximo de los dos. */
const ACUMULADOS = ['fallos', 'reinicios', 'repeticiones', 'rapidos', 'en_aciertos', 'en_fallos'];

const esObjeto = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const numero = x => (Number.isFinite(x) ? x : 0);

/** JSON con las claves ordenadas: dos objetos iguales dan el mismo texto. */
export function canonico(x) {
  if (Array.isArray(x)) return `[${x.map(canonico).join(',')}]`;
  if (esObjeto(x)) return `{${Object.keys(x).sort().map(k => `${JSON.stringify(k)}:${canonico(x[k])}`).join(',')}}`;
  return JSON.stringify(x ?? null);
}

/** Un ejercicio sin terminar nunca pasa de objetivo − 1 puntos (lo que dice el contador). */
function conTope(e) {
  if (!e.terminado && Number.isFinite(e.puntos) && Number.isFinite(e.objetivo) && e.puntos > e.objetivo - 1) {
    return { ...e, puntos: Math.max(0, e.objetivo - 1) };
  }
  return e;
}

/** Día de terminar para comparar: el más temprano gana; el 0 es «no se sabe» y pierde. */
const diaParaComparar = e => (e.dia > 0 ? e.dia : Infinity);

/**
 * Compara dos ejercicios: positivo si `a` va más avanzado que `b`. Orden total
 * (el último criterio es el texto canónico), para que la fusión sea conmutativa.
 *   - terminado gana a sin terminar;
 *   - entre dos terminados, el que se terminó antes (es el día de verdad);
 *   - entre dos sin terminar, más puntos; luego más aciertos y más vidas.
 */
function comparar(a, b) {
  if (Boolean(a.terminado) !== Boolean(b.terminado)) return a.terminado ? 1 : -1;
  if (a.terminado) {
    const da = diaParaComparar(a), db = diaParaComparar(b);
    if (da !== db) return da < db ? 1 : -1;
  } else {
    for (const campo of ['puntos', 'aciertos', 'vidas']) {
      const d = numero(a[campo]) - numero(b[campo]);
      if (d) return d;
    }
  }
  // Sin los acumulados: así el resultado de una fusión se compara con el otro
  // lado igual que el ganador (y fusionar otra vez no cambia nada).
  const ca = canonico(sinAcumulados(a)), cb = canonico(sinAcumulados(b));
  return ca === cb ? 0 : ca > cb ? 1 : -1;
}

function sinAcumulados(e) {
  const copia = { ...e };
  for (const campo of ACUMULADOS) delete copia[campo];
  return copia;
}

/**
 * Fusiona dos estados de UN ejercicio (tal como los guarda la base:
 * { puntos, objetivo, vidas, racha, aciertos, fallos, reinicios, terminado, dia… }).
 * Gana entero el más avanzado (puntos, vidas, racha, aciertos y día van juntos:
 * los ejercicios por pasos usan `aciertos` como número de paso); de los
 * acumulados (fallos, reinicios, repeticiones…) se queda el máximo.
 * Conmutativa, asociativa e idempotente; nunca deja sin terminar algo terminado.
 * Un lado nulo (no lo ha empezado en ese aparato) no cuenta.
 */
export function fusionarEjercicio(a, b) {
  if (!esObjeto(a)) return esObjeto(b) ? conTope(b) : null;
  if (!esObjeto(b)) return conTope(a);
  const [x, y] = [conTope(a), conTope(b)];
  const gana = comparar(x, y) >= 0 ? x : y;
  const otro = gana === x ? y : x;
  const fusion = { ...gana };
  for (const campo of ACUMULADOS) {
    if (gana[campo] !== undefined || otro[campo] !== undefined) fusion[campo] = Math.max(numero(gana[campo]), numero(otro[campo]));
  }
  return fusion;
}

/** Fusiona dos listas de ejercicios (una práctica), posición a posición. */
export function fusionarProgreso(a, b) {
  const la = Array.isArray(a) ? a : [], lb = Array.isArray(b) ? b : [];
  return Array.from({ length: Math.max(la.length, lb.length) }, (_, n) => fusionarEjercicio(la[n], lb[n]));
}

// --- Firestore por REST ------------------------------------------------------------

/** Colección del progreso de la práctica libre (y de la tarea 1). */
export const COLECCION_PRACTICAS = 'practicas';
/** Colección del progreso por tarea (modelo v2, tarea 50): un documento por alumno, tarea y práctica. */
export const COLECCION_TAREAS = 'practicas-tareas';
/** Colección de las asignaciones de tareas a alumnos (un documento por código). */
export const COLECCION_ASIGNACIONES = 'practicas-asignaciones';

/** Id del documento de una práctica libre: `{slug}--{código}`. */
export const idDocumentoPractica = (slug, codigo) => `${slug}--${codigo}`;

/** Id del documento de una práctica dentro de una tarea v2: `t{id}--{slug}--{código}`. */
export const idDocumentoTarea = (tareaId, slug, codigo) => `t${tareaId}--${slug}--${codigo}`;

/** Clave del navegador del progreso de una práctica dentro de una tarea: `practicas.v1.{slug}.{código}.t{id}`. */
export const claveProgresoTarea = (slug, codigo, tareaId) => `practicas.v1.${slug}.${codigo}.t${tareaId}`;

/**
 * URL REST de un documento, o null si no hay Firebase configurado. Por defecto
 * `practicas/{slug}--{código}`; con `coleccion` e `id` se apunta a otro (las
 * tareas v2 usan `practicas-tareas/t{id}--{slug}--{código}`).
 */
export function urlDocumento(slug, codigo, config = firebaseConfig, { coleccion = COLECCION_PRACTICAS, id = idDocumentoPractica(slug, codigo) } = {}) {
  if (!config?.apiKey || !config?.projectId) return null;
  return `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/${coleccion}/${id}?key=${config.apiKey}`;
}

/** URL REST de la asignación de un alumno, `practicas-asignaciones/{código}`, o null sin Firebase. */
export function urlAsignacion(codigo, config = firebaseConfig, coleccion = COLECCION_ASIGNACIONES) {
  return urlDocumento(null, codigo, config, { coleccion, id: codigo });
}

// --- Espacio de un profesor (varios profesores, tarea 62) --------------------------
//
// Los datos de cada profesor viven en subcolecciones de `practicas-espacios/{uid}`.
// Los lectores de arriba ya aceptan la colección como parámetro: basta con pasarles
// `coleccionEspacio(uid, 'progreso')`, que lleva barras y va tal cual en la URL.

/** Qué subcolecciones tiene un espacio (DISENO.md, C.1). */
export const SUBCOLECCIONES_ESPACIO = ['progreso', 'progreso-tareas', 'asignaciones', 'fallos'];
export const COLECCION_ESPACIOS = 'practicas-espacios';
export const COLECCION_BUSQUEDA = 'practicas-alumnos';

/** Ruta de una subcolección del espacio de `uid`: `practicas-espacios/{uid}/{que}`. */
export function coleccionEspacio(uid, que) {
  if (typeof uid !== 'string' || !/^[A-Za-z0-9]{1,128}$/.test(uid)) throw new Error('uid de profesor no válido');
  if (!SUBCOLECCIONES_ESPACIO.includes(que)) throw new Error(`subcolección desconocida: ${que}`);
  return `${COLECCION_ESPACIOS}/${uid}/${que}`;
}

/** URL REST de la fila de búsqueda de un código secreto (`practicas-alumnos/{código}`), o null sin Firebase. */
export function urlBusqueda(codigo, config = firebaseConfig) {
  return urlDocumento(null, codigo, config, { coleccion: COLECCION_BUSQUEDA, id: codigo });
}

/** URL REST de la configuración de tareas de un profesor (`practicas-espacios/{uid}/config/tareas`), o null sin Firebase. */
export function urlConfig(uid, config = firebaseConfig) {
  coleccionEspacio(uid, 'progreso');   // solo para validar el uid
  return urlDocumento(null, null, config, { coleccion: `${COLECCION_ESPACIOS}/${uid}/config`, id: 'tareas' });
}

/** Lo que dice una fila de búsqueda leída por REST: { profesor, n } o null si no se entiende. */
export function leerBusquedaRest(json) {
  const profesor = json?.fields?.profesor?.stringValue;
  const n = Number(json?.fields?.n?.integerValue);
  return typeof profesor === 'string' && profesor && Number.isInteger(n) && n >= 1 ? { profesor, n } : null;
}

/** El texto JSON de la configuración leída por REST, o null si no se entiende. */
export function leerConfigRest(json) {
  const texto = json?.fields?.json?.stringValue;
  return typeof texto === 'string' ? texto : null;
}

/** GET con tiempo máximo: { estado: 'ok', json } | 'vacio' (404) | 'prohibido' (403) | 'error'. Nunca lanza. */
async function pedirJson(url, { fetch: pedir = globalThis.fetch, espera = ESPERA_LECTURA } = {}) {
  if (!url || typeof pedir !== 'function') return { estado: 'error', json: null };
  const control = typeof AbortController === 'function' ? new AbortController() : null;
  let reloj;
  try {
    const tiempo = new Promise((_, rechazar) => { reloj = setTimeout(() => { control?.abort(); rechazar(new Error('tiempo')); }, espera); });
    const respuesta = await Promise.race([pedir(url, { method: 'GET', signal: control?.signal, cache: 'no-store' }), tiempo]);
    if (respuesta.status === 404) return { estado: 'vacio', json: null };
    if (respuesta.status === 403) return { estado: 'prohibido', json: null };
    if (!respuesta.ok) return { estado: 'error', json: null };
    return { estado: 'ok', json: await Promise.race([respuesta.json(), tiempo]) };
  } catch {
    return { estado: 'error', json: null };
  } finally {
    clearTimeout(reloj);
  }
}

/** Lee a qué profesor pertenece un código secreto: { estado, profesor, n } (estados de `pedirJson`; 'error' si es ilegible). */
export async function leerBusqueda(codigo, { config = firebaseConfig, ...opciones } = {}) {
  const r = await pedirJson(urlBusqueda(codigo, config), opciones);
  if (r.estado !== 'ok') return { estado: r.estado, profesor: null, n: null };
  const leido = leerBusquedaRest(r.json);
  return leido ? { estado: 'ok', ...leido } : { estado: 'error', profesor: null, n: null };
}

/** Lee la configuración de tareas de un profesor: { estado, json } con el texto JSON sin interpretar. */
export async function leerConfig(uid, { config = firebaseConfig, ...opciones } = {}) {
  const r = await pedirJson(urlConfig(uid, config), opciones);
  if (r.estado !== 'ok') return { estado: r.estado, json: null };
  const texto = leerConfigRest(r.json);
  return texto === null ? { estado: 'error', json: null } : { estado: 'ok', json: texto };
}

/** Lo que dice una asignación leída por REST: { tareas: [ids] } o null si no se entiende. */
export function leerAsignacionRest(json) {
  const valores = json?.fields?.tareas?.arrayValue?.values;
  if (valores === undefined && json?.fields?.tareas?.arrayValue) return { tareas: [] };   // lista vacía: Firestore omite «values»
  if (!Array.isArray(valores)) return null;
  const tareas = valores.map(v => Number(v?.integerValue));
  return tareas.every(Number.isInteger) ? { tareas } : null;
}

/**
 * Lee la asignación de tareas de un alumno, con el mismo tiempo máximo que el
 * progreso. Devuelve { tareas: [ids] } o null (sin documento, sin permiso,
 * sin red o ilegible: se sigue con la copia del navegador). Nunca lanza.
 */
export async function leerAsignacion(codigo, { fetch: pedir = globalThis.fetch, espera = ESPERA_LECTURA, config = firebaseConfig, coleccion } = {}) {
  const url = urlAsignacion(codigo, config, coleccion);
  if (!url || typeof pedir !== 'function') return null;
  const control = typeof AbortController === 'function' ? new AbortController() : null;
  let reloj;
  try {
    const tiempo = new Promise((_, rechazar) => { reloj = setTimeout(() => { control?.abort(); rechazar(new Error('tiempo')); }, espera); });
    const respuesta = await Promise.race([pedir(url, { method: 'GET', signal: control?.signal, cache: 'no-store' }), tiempo]);
    if (!respuesta.ok) return null;
    return leerAsignacionRest(await Promise.race([respuesta.json(), tiempo]));
  } catch {
    return null;
  } finally {
    clearTimeout(reloj);
  }
}

/**
 * Lo que dice un documento leído por REST: { ej, idioma } o null si no se entiende.
 */
export function leerDocumentoRest(json) {
  try {
    const estado = JSON.parse(json?.fields?.estado?.stringValue);
    return Array.isArray(estado?.ej) ? { ej: estado.ej, idioma: estado.idioma ?? null } : null;
  } catch { return null; }
}

/**
 * Lee el documento de un alumno en una práctica, con un tiempo máximo.
 * Devuelve { estado, ej, idioma }:
 *   'ok'        el documento existe (ej e idioma, lo que dice);
 *   'vacio'     no existe (alumno que no ha subido nada de esa práctica);
 *   'prohibido' las reglas no dejan leerlo (las de antes de la tarea 38);
 *   'error'     sin red, tiempo agotado, documento ilegible u otro fallo.
 * Nunca lanza.
 */
export async function leerNube(slug, codigo, { fetch: pedir = globalThis.fetch, espera = ESPERA_LECTURA, config = firebaseConfig, coleccion, id } = {}) {
  const url = urlDocumento(slug, codigo, config, { coleccion, id });
  if (!url || typeof pedir !== 'function') return { estado: 'error', ej: null, idioma: null };
  const control = typeof AbortController === 'function' ? new AbortController() : null;
  let reloj;
  try {
    const tiempo = new Promise((_, rechazar) => { reloj = setTimeout(() => { control?.abort(); rechazar(new Error('tiempo')); }, espera); });
    const respuesta = await Promise.race([pedir(url, { method: 'GET', signal: control?.signal, cache: 'no-store' }), tiempo]);
    if (respuesta.status === 404) return { estado: 'vacio', ej: null, idioma: null };
    if (respuesta.status === 403) return { estado: 'prohibido', ej: null, idioma: null };
    if (!respuesta.ok) return { estado: 'error', ej: null, idioma: null };
    const leido = leerDocumentoRest(await Promise.race([respuesta.json(), tiempo]));
    return leido ? { estado: 'ok', ...leido } : { estado: 'error', ej: null, idioma: null };
  } catch {
    return { estado: 'error', ej: null, idioma: null };
  } finally {
    clearTimeout(reloj);
  }
}

/**
 * Escribe el documento (PATCH, que lo crea si no existe). `keepalive` para que
 * llegue aunque el alumno cambie de página justo después. No espera respuesta
 * útil: si falla, el progreso sigue en el navegador y vuelve a subir la próxima vez.
 */
export function escribirNube(slug, codigo, ej, idioma, { fetch: pedir = globalThis.fetch, config = firebaseConfig, coleccion, id } = {}) {
  const url = urlDocumento(slug, codigo, config, { coleccion, id });
  if (!url || typeof pedir !== 'function') return Promise.resolve(false);
  const fields = {
    estado: { stringValue: JSON.stringify({ v: 1, idioma: idioma ?? 'alterno', ej }) },
    actualizado: { integerValue: String(Date.now()) },
  };
  try {
    return Promise.resolve(pedir(url, { method: 'PATCH', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields }) }))
      .then(r => Boolean(r?.ok), () => false);
  } catch {
    return Promise.resolve(false);
  }
}

/**
 * Sube el progreso de una práctica sin machacar lo de otro aparato: vuelve a
 * leer el documento, fusiona con `ej` y escribe la fusión (solo si cambia algo
 * respecto de la nube). Si no se ha podido leer, escribe `ej` fusionado con lo
 * último que se supo de la nube (`ultimo`). Devuelve { ej: lo que queda en la
 * nube (o se intentó), lectura: el resultado de leerNube }.
 */
export async function subirFusionado(slug, codigo, ej, idioma, { ultimo = null, ...opciones } = {}) {
  const lectura = await leerNube(slug, codigo, opciones);
  const remoto = lectura.estado === 'ok' ? lectura.ej : ultimo;
  const fusion = fusionarProgreso(ej, remoto);
  if (lectura.estado !== 'ok' || canonico(fusion) !== canonico(lectura.ej)) await escribirNube(slug, codigo, fusion, idioma, opciones);
  return { ej: fusion, lectura };
}
