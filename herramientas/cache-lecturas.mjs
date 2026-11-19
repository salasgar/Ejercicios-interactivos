// Caché local de las lecturas de Firestore de las herramientas del profesor (tarea 210 de PU2).
//
// Por qué: el 18-11-2026 se agotó la cuota diaria de lecturas (plan Spark, ~50 000; se renueva a las 9:00
// de Madrid) con 35 ejecuciones seguidas de `informe-actividad.mjs` y `notas_tarea_app.mjs`: cada una bajaba
// ENTERAS `progreso-libre` y `progreso-tareas` (~1 300 documentos, y creciendo). Con la cuota agotada la app
// de los alumnos se queda sin leer.
//
// Cómo (el modelo es el panel del profesor, `practicas/profesor.js`, `cargarEspacio`):
//   - la primera vez se lee todo y se guarda;
//   - las siguientes, solo los documentos con `actualizado` posterior a lo último visto MENOS dos días
//     (`MARGEN_LECTURA`, el mismo del panel: `actualizado` lo pone el reloj del aparato del alumno, que
//     puede ir atrasado). «Lo último visto» es el menor entre el `actualizado` más reciente de la caché y la
//     hora de la última lectura: un aparato con el reloj adelantado no deja fuera lo de los demás;
//   - si la última lectura es de hace menos de `FRESCURA_MS` (10 min), no se lee nada: se usa la caché y se
//     dice (es lo que evita que un bucle de un subagente vuelva a agotar la cuota);
//   - los borrados no salen en una consulta incremental: cada `DIAS_LECTURA_COMPLETA` (7) días desde la
//     última lectura completa se vuelve a leer todo; también con `leerTodo: true` (`--leer-todo`).
//     Solo el profesor borra (códigos de alumnos dados de baja), y un documento de más solo puede añadir
//     un alumno que ya no está: no cambia la nota de nadie.
//   - una caché ilegible, de otra versión o de otro espacio se descarta y se lee todo.
//
// Documentos sin `actualizado`: no salen en un `where actualizado > …`. Las reglas (`estadoValido`, y las
// asignaciones) exigen `actualizado` entero en toda escritura, así que todo documento escrito o cambiado
// por la app lo lleva; uno antiguo sin él (de una migración) entra en la lectura completa y, como no
// puede cambiar sin una escritura que se lo ponga, la caché no se queda vieja con él.
//
// La caché lleva códigos y progreso de alumnos (sin nombres): vive FUERA del repositorio, que es público,
// en `~/.claude/cache/firestore-practicas/<uid>.json`, carpeta 700 y fichero 600. Se escribe entera o no se
// toca: si una lectura falla (429, 5xx, sin red), no se escribe nada y el error sube a quien llama.
//
// Este módulo usa `node:fs`: solo para Node. `informe-actividad.mjs` (que también lo importa el navegador)
// lo pide con `import()` dinámico y solo con `--cache`.

import { mkdirSync, readFileSync, writeFileSync, renameSync, chmodSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve, relative, isAbsolute, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MARGEN_LECTURA } from '../practicas/resultados.js';

export { MARGEN_LECTURA };
export const VERSION_CACHE = 1;
export const DIAS_LECTURA_COMPLETA = 7;
export const FRESCURA_MS = 10 * 60 * 1000;
const DIA = 86400000;

/** La raíz del repositorio (este fichero está en `herramientas/`). */
export const RAIZ_REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** ¿Está `ruta` dentro de `raiz` (o es ella)? */
export function dentroDe(ruta, raiz) {
  const r = relative(resolve(raiz), resolve(ruta));
  return r === '' || (!r.startsWith('..') && !isAbsolute(r));
}

/**
 * La carpeta de la caché: `CACHE_LECTURAS_FIRESTORE` si está en el entorno, si no
 * `~/.claude/cache/firestore-practicas`. Nunca dentro del repositorio: lanza si lo está.
 */
export function rutaCache(entorno = process.env, casa = homedir()) {
  const ruta = resolve(entorno.CACHE_LECTURAS_FIRESTORE || join(casa, '.claude', 'cache', 'firestore-practicas'));
  if (dentroDe(ruta, RAIZ_REPO)) throw new Error(`La caché de lecturas no puede estar dentro del repositorio (es público): ${ruta}`);
  return ruta;
}

/** El fichero de la caché de un espacio. */
export const ficheroCache = (dir, uid) => {
  if (typeof uid !== 'string' || !/^[A-Za-z0-9]{1,128}$/.test(uid)) throw new Error('uid de profesor no válido');
  return join(dir, `${uid}.json`);
};

const esEntrada = e => e && Array.isArray(e.docs) && Number.isFinite(e.completa) && Number.isFinite(e.leida)
  && e.docs.every(d => d && typeof d.id === 'string');

/** La caché de un espacio, o una vacía si no hay, no se entiende, es de otra versión o de otro espacio. */
export function cargarCache(dir, uid) {
  try {
    const dato = JSON.parse(readFileSync(ficheroCache(dir, uid), 'utf8'));
    if (dato?.version !== VERSION_CACHE || dato?.uid !== uid || typeof dato?.subs !== 'object' || !dato.subs) return { version: VERSION_CACHE, uid, subs: {} };
    const subs = {};
    for (const [sub, e] of Object.entries(dato.subs)) if (esEntrada(e)) subs[sub] = e;
    return { version: VERSION_CACHE, uid, subs };
  } catch {
    return { version: VERSION_CACHE, uid, subs: {} };
  }
}

/** Escribe la caché entera de golpe (fichero temporal y `rename`), con permisos 600 en una carpeta 700. */
export function guardarCache(dir, uid, cache) {
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  chmodSync(dir, 0o700);
  const destino = ficheroCache(dir, uid);
  const temporal = `${destino}.${process.pid}.${Date.now()}.tmp`;
  try {
    writeFileSync(temporal, JSON.stringify(cache), { mode: 0o600 });
    chmodSync(temporal, 0o600);
    renameSync(temporal, destino);
  } catch (e) {
    rmSync(temporal, { force: true });
    throw e;
  }
}

/** Junta lo de la caché con lo recién leído, por `id`; lo leído gana (como `fusionarLeidos` del panel). */
function juntar(previos, nuevos) {
  const porId = new Map(previos.map(d => [d.id, d]));
  for (const d of nuevos) porId.set(d.id, d);
  return [...porId.values()];
}

/**
 * Desde qué `actualizado` (ms) pedir lo nuevo de una subcolección en caché: el menor entre
 * el `actualizado` más reciente que se tiene y la hora de la última lectura, menos el margen.
 */
export function desdeIncremental(entrada, margen = MARGEN_LECTURA) {
  const ultimo = entrada.docs.map(d => d.actualizado).filter(Number.isFinite).reduce((a, b) => Math.max(a, b), -Infinity);
  const base = ultimo === -Infinity ? entrada.leida : Math.min(ultimo, entrada.leida);
  return Math.max(0, base - margen);
}

/**
 * Lee las subcolecciones `subs` de un espacio con la caché. `leerTodoDe(sub)` y
 * `leerDesdeDe(sub, desdeMs)` hacen las lecturas de verdad (devuelven documentos
 * crudos `{ id, actualizado, … }`; lanzan si fallan).
 * Devuelve { docs: { sub: [...] }, informe: { sub: { modo, pedidos, edad } }, pedidos }:
 *   modo 'completa' (se ha leído todo), 'incremental' (solo lo nuevo) o 'cache' (nada: lectura reciente);
 *   pedidos: documentos que han llegado de la nube; edad: ms desde la última lectura (en 'cache').
 * Si alguna lectura falla, lanza su error y NO toca la caché.
 */
export async function leerConCache({ uid, subs, leerTodoDe, leerDesdeDe, dir = rutaCache(), ahora = Date.now(), leerTodo = false,
  frescura = FRESCURA_MS, diasCompleta = DIAS_LECTURA_COMPLETA, margen = MARGEN_LECTURA }) {
  if (dentroDe(dir, RAIZ_REPO)) throw new Error(`La caché de lecturas no puede estar dentro del repositorio (es público): ${dir}`);
  const cache = cargarCache(dir, uid);
  const resultados = await Promise.all(subs.map(async sub => {
    const e = cache.subs[sub];
    const caducada = !e || ahora - e.completa > diasCompleta * DIA || e.leida > ahora || e.completa > ahora;
    if (leerTodo || caducada) {
      const docs = await leerTodoDe(sub);
      return [sub, { completa: ahora, leida: ahora, docs }, { modo: 'completa', pedidos: docs.length }];
    }
    if (ahora - e.leida < frescura) return [sub, e, { modo: 'cache', pedidos: 0, edad: ahora - e.leida }];
    const nuevos = await leerDesdeDe(sub, desdeIncremental(e, margen));
    return [sub, { completa: e.completa, leida: ahora, docs: juntar(e.docs, nuevos) }, { modo: 'incremental', pedidos: nuevos.length }];
  }));
  // Todo leído sin error: ahora sí, la caché entera de una vez.
  const nueva = { version: VERSION_CACHE, uid, subs: { ...cache.subs } };
  for (const [sub, entrada] of resultados) nueva.subs[sub] = entrada;
  if (resultados.some(([, , i]) => i.modo !== 'cache')) guardarCache(dir, uid, nueva);
  return {
    docs: Object.fromEntries(resultados.map(([sub, e]) => [sub, e.docs])),
    informe: Object.fromEntries(resultados.map(([sub, , i]) => [sub, i])),
    pedidos: resultados.reduce((s, [, , i]) => s + i.pedidos, 0),
  };
}

/** Una línea para stderr con lo que ha hecho la caché. */
export function textoLectura({ informe, pedidos }) {
  const partes = Object.entries(informe).map(([sub, i]) => (i.modo === 'cache'
    ? `${sub}: de la caché (leída hace ${Math.round(i.edad / 60000)} min)`
    : `${sub}: ${i.modo === 'completa' ? 'lectura completa' : 'solo lo nuevo'}, ${i.pedidos} documentos`));
  return `Lecturas de Firestore: ${pedidos} documentos (${partes.join('; ')}). --leer-todo fuerza una lectura completa.`;
}
