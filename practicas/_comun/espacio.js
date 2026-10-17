// Del código del alumno a su profesor y a sus tareas (varios profesores, tarea 62
// del reparto PU2; DISENO.md, B.2 y F.2). Piezas puras: nadie las usa todavía.
//
// Un código de 4 caracteres es del modo antiguo y no necesita red: el número de
// lista sale del propio código. Uno de 8 es secreto: no dice nada por sí mismo,
// así que se pregunta a la nube de quién es (`practicas-alumnos/{código}`) y cuáles
// son las tareas de ese profesor (`config/tareas`). Las dos cosas se guardan en el
// navegador para seguir sin red y para no preguntar de más.
//
// Todo por REST y sin cuenta (los alumnos no tienen). `fetch` y `almacen` se
// inyectan en los tests.

import { modoDeCodigo, leerCodigoAlumno, leerCodigoSecreto } from './codigos.js';
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

/**
 * Resuelve un código tecleado o llegado por enlace:
 *   { modo: 'antiguo', n }                              4 caracteres, sin red;
 *   { modo: 'nuevo', profesor, n, config, desdeCache }  8 caracteres; `config` es
 *                                                       { unidades, tareas } del profesor;
 *   { error: 'no-valido' }   no es un código de ninguno de los dos modos;
 *   { error: 'no-existe' }   la nube no conoce ese código (404);
 *   { error: 'sin-red' }     no se ha podido preguntar y no hay copia en el navegador.
 * Sin red, o si la nube falla, se sigue con la copia del navegador si la hay. Nunca lanza.
 */
export async function resolverCodigo(codigo, { fetch, almacen = almacenDelNavegador(), espera, config } = {}) {
  const modo = modoDeCodigo(codigo);
  if (modo === 'antiguo') return { modo, n: leerCodigoAlumno(codigo) };
  if (modo !== 'nuevo') return { error: 'no-valido' };

  const secreto = leerCodigoSecreto(codigo);
  const opciones = { ...(fetch && { fetch }), ...(espera && { espera }), ...(config && { config }) };
  const copia = leerCache(almacen, secreto);
  const busqueda = await leerBusqueda(secreto, opciones);

  if (busqueda.estado === 'vacio') {
    olvidarCache(almacen, secreto);
    return { error: 'no-existe' };
  }
  if (busqueda.estado !== 'ok') {
    // Sin red, sin permiso o respuesta ilegible: lo último que se supo, si se sabe algo.
    return copia ? { modo, ...copia, desdeCache: true } : { error: 'sin-red' };
  }

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
