// Del código del alumno a su profesor y a sus tareas (varios profesores, tareas 62
// y 72 del reparto PU2; DISENO.md, B.2 y F.2).
//
// Un código del sistema nuevo (4 u 8 caracteres) no dice nada por sí mismo, así
// que se pregunta a la nube de quién es (`practicas-alumnos/{código}`) y cuáles son
// las tareas de ese profesor (`config/tareas`). Las dos cosas se guardan en el
// navegador para seguir sin red y para no preguntar de más.
//
// Un código de 4 con la comprobación del modo antiguo puede estar registrado (los
// de Juan Luis pasan al sistema nuevo tal cual, tarea 70) o no (modo antiguo, como
// siempre, hasta la tarea 71): también se pregunta. Si la nube no lo conoce (404),
// es del modo antiguo y se recuerda un rato (`VIGENCIA_ANTIGUO`) para no preguntar
// en cada página; sin red, sin permiso (reglas aún sin publicar) o con la nube
// caída, vale lo último que se supo de él y, si no se supo nada, el modo antiguo.
//
// Todo por REST y sin cuenta (los alumnos no tienen). `fetch`, `almacen` y `ahora`
// se inyectan en los tests.

import { leerCodigoAlumno, leerCodigoSecreto, esCodigoAntiguo } from './codigos.js';
import { leerBusqueda, leerConfig } from './nube.js';
import { configDeJSON } from './tareas.js';

/** Clave del navegador de lo que se sabe de un código secreto. */
export const claveEspacio = codigo => `practicas.v1.espacio.${codigo}`;

/** La configuración de un profesor que aún no ha guardado ninguna. */
const configVacia = () => ({ unidades: [], tareas: [] });

/** `localStorage` si se puede usar (puede faltar o lanzar en navegación privada); si no, `null`. */
export function almacenDelNavegador() {
  try {
    const a = globalThis.localStorage;
    return a && typeof a.getItem === 'function' ? a : null;
  } catch {
    return null;
  }
}

function leerCache(almacen, codigo) {
  try {
    const dato = JSON.parse(almacen?.getItem(claveEspacio(codigo)));
    const config = configDeJSON(dato?.json);
    return typeof dato?.profesor === 'string' && Number.isInteger(dato?.n) && config ? { profesor: dato.profesor, n: dato.n, config } : null;
  } catch {
    return null;
  }
}

function guardarCache(almacen, codigo, profesor, n, json) {
  try { almacen?.setItem(claveEspacio(codigo), JSON.stringify({ profesor, n, json })); } catch { /* sin almacén: se pregunta cada vez */ }
}

function olvidarCache(almacen, codigo) {
  try { almacen?.removeItem(claveEspacio(codigo)); } catch { /* nada que olvidar */ }
}

/** Cuánto se recuerda que la nube no conoce un código antiguo (ms): una hora de práctica sin preguntar. */
export const VIGENCIA_ANTIGUO = 60 * 60 * 1000;

/** Clave del navegador del momento en que la nube dijo que un código de 4 antiguo no está registrado. */
export const claveAntiguo = codigo => `practicas.v1.antiguo.${codigo}`;

function antiguoReciente(almacen, codigo, ahora) {
  try {
    const cuando = Number(almacen?.getItem(claveAntiguo(codigo)));
    return Number.isFinite(cuando) && cuando > 0 && ahora - cuando >= 0 && ahora - cuando < VIGENCIA_ANTIGUO;
  } catch { return false; }
}
function recordarAntiguo(almacen, codigo, ahora) {
  try { almacen?.setItem(claveAntiguo(codigo), String(ahora)); } catch { /* sin almacén: se pregunta cada vez */ }
}
function olvidarAntiguo(almacen, codigo) {
  try { almacen?.removeItem(claveAntiguo(codigo)); } catch { /* nada que olvidar */ }
}

/**
 * Resuelve un código tecleado o llegado por enlace:
 *   { modo: 'antiguo', n }                              código de 4 del modo antiguo que la nube
 *                                                       no conoce (o sin red y sin copia); `n` es
 *                                                       su índice de `codigoAlumno` (desde 0);
 *   { modo: 'nuevo', profesor, n, config, desdeCache }  código registrado (4 u 8); `n`, su número
 *                                                       de lista (desde 1); `config`, { unidades,
 *                                                       tareas, longitudCodigo } del profesor;
 *   { error: 'no-valido' }   no tiene el formato de un código;
 *   { error: 'no-existe' }   la nube no conoce ese código (404) y no es del modo antiguo;
 *   { error: 'sin-red' }     no se ha podido preguntar y no hay copia en el navegador.
 * Sin red, o si la nube falla, se sigue con la copia del navegador si la hay. Nunca lanza.
 */
export async function resolverCodigo(codigo, { fetch, almacen = almacenDelNavegador(), espera, config, ahora = Date.now() } = {}) {
  const secreto = leerCodigoSecreto(codigo);
  if (secreto === null) return { error: 'no-valido' };
  const antiguo = esCodigoAntiguo(secreto) ? { modo: 'antiguo', n: leerCodigoAlumno(secreto) } : null;
  const copia = leerCache(almacen, secreto);
  // Hace poco que la nube no lo conocía: modo antiguo sin preguntar (salvo que se sepa que ya es del nuevo).
  if (antiguo && !copia && antiguoReciente(almacen, secreto, ahora)) return antiguo;

  const modo = 'nuevo';
  const opciones = { ...(fetch && { fetch }), ...(espera && { espera }), ...(config && { config }) };
  const busqueda = await leerBusqueda(secreto, opciones);

  if (busqueda.estado === 'vacio') {
    olvidarCache(almacen, secreto);
    if (antiguo) recordarAntiguo(almacen, secreto, ahora);
    return antiguo ?? { error: 'no-existe' };
  }
  if (busqueda.estado !== 'ok') {
    // Sin red, sin permiso o respuesta ilegible: lo último que se supo, si se sabe algo;
    // si no, un código antiguo sigue en el modo antiguo, como siempre.
    if (copia) return { modo, ...copia, desdeCache: true };
    return antiguo ?? { error: 'sin-red' };
  }
  olvidarAntiguo(almacen, secreto);

  const lectura = await leerConfig(busqueda.profesor, opciones);
  if (lectura.estado === 'ok') {
    const leida = configDeJSON(lectura.json);
    if (leida) {
      guardarCache(almacen, secreto, busqueda.profesor, busqueda.n, lectura.json);
      return { modo, profesor: busqueda.profesor, n: busqueda.n, config: leida, desdeCache: false };
    }
  }
  if (lectura.estado === 'vacio') {
    // El profesor aún no ha guardado tareas: no es un fallo, y la copia anterior ya no vale.
    guardarCache(almacen, secreto, busqueda.profesor, busqueda.n, JSON.stringify(configVacia()));
    return { modo, profesor: busqueda.profesor, n: busqueda.n, config: configVacia(), desdeCache: false };
  }
  // La búsqueda ha ido bien pero la configuración no: la copia solo vale si es del mismo profesor.
  if (copia && copia.profesor === busqueda.profesor) return { modo, ...copia, n: busqueda.n, desdeCache: true };
  return { modo, profesor: busqueda.profesor, n: busqueda.n, config: configVacia(), desdeCache: false, sinConfig: true };
}
