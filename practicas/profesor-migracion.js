// «Pasar al sistema nuevo»: Juan Luis pasa a su espacio con los códigos de 4 de
// siempre (tarea 70 del reparto PU2; ficha 70, que sustituye a DISENO.md E.4).
//
// Sus alumnos no cambian de código ni de enlace: cada código de siempre
// (`codigoAlumno(n − 1)`) se registra en `practicas-alumnos` a su nombre, con su
// número de lista, y desde ese momento la app lo lleva a su espacio
// (`resolverCodigo`, tarea 72). Antes de nada, se copia a su espacio lo que hay en
// las colecciones del modo antiguo, con los mismos ids:
//   practicas/<slug>--<código>              → progreso-libre (la tarea 1 lo lee de aquí)
//   practicas-tareas/t<id>--<slug>--<código> → progreso-tareas
//   practicas-asignaciones/<código>         → asignaciones
//   fallos/<código>-<hora>-<azar>           → fallos (si no son demasiados: TOPE_FALLOS)
// y sus tareas (`TAREAS`, con la 1 tal cual, `progresoPorPractica` incluido) y las
// fechas de `UNIDADES` van a su configuración, con `longitudCodigo: 4`.
//
// Orden: las reglas solo dejan escribir en el espacio documentos de códigos ya
// registrados a nombre de su dueño (`alumnoDe`), así que primero se registra y
// después se copia. Copiar FUSIONA con lo que ya hubiera en el espacio (gana lo
// más avanzado, como al cambiar de aparato), nunca lo pisa: repetir el paso no
// duplica nada y recoge lo que algún alumno haya escrito en el modo antiguo
// después (un navegador recuerda una hora que su código era del modo antiguo).
// Las colecciones del modo antiguo no se tocan: las limpia la tarea 71, con firma.
//
// Todo va por REST con el token de la sesión (`getIdToken()` en el panel; el
// inicio de sesión por contraseña en `herramientas/ensayar-migracion.mjs`), así
// que la misma lógica sirve en el panel y en el ensayo con un profesor de prueba.
// Las funciones de cálculo son puras y están probadas en tests/practicas-migracion.test.js.

import { codigoAlumno, MAX_ALUMNOS } from './_comun/codigos.js';
import { CATALOGO, UNIDADES } from './_comun/catalogo.js';
import { TAREAS, configAJSON, configDeJSON, erroresConfig } from './_comun/tareas.js';
import { fusionarProgreso, canonico, coleccionEspacio, COLECCION_ESPACIOS, COLECCION_BUSQUEDA, COLECCION_PRACTICAS, COLECCION_TAREAS, COLECCION_ASIGNACIONES } from './_comun/nube.js';
import { firebaseConfig } from '../src/config.js';

/** Números de lista de los códigos de prueba de Claude (7NPD, KTFN, XY4Z, B5YN): nunca van al espacio de Juan Luis. */
export const NUMEROS_PRUEBA_CLAUDE = [60, 61, 62, 63];
/** El alumno de prueba de Juan Luis: no está en la lista; entra con el número 1000. */
export const PRUEBA_JL = { codigo: codigoAlumno(999), n: 1000 };
/** Más fallos que estos no se copian sin preguntar (cuota del plan gratuito: 20 000 escrituras al día). */
export const TOPE_FALLOS = 8000;
/** Escrituras diarias del plan gratuito de Firebase y el tope que se permite gastar en el paso (75 %). */
export const ESCRITURAS_DIA = 20000;
export const TOPE_ESCRITURAS = 15000;
/** Lo que hay que escribir para confirmar el paso. */
export const PALABRA = 'PASAR';

/** De dónde sale cada subcolección del espacio en el modo antiguo. */
export const ORIGENES = {
  'progreso-libre': COLECCION_PRACTICAS,
  'progreso-tareas': COLECCION_TAREAS,
  'asignaciones': COLECCION_ASIGNACIONES,
  'fallos': 'fallos',
};

// --- Cálculo puro --------------------------------------------------------------------

/**
 * Los números de lista de un texto como «1-51» o «1-29, 30-46, 47-51, 52»:
 * { numeros: [n] ordenados y sin repetir, apartados: [n] (los de prueba de
 * Claude, que nunca pasan), errores: [frase] }.
 */
export function leerNumeros(texto) {
  const numeros = new Set();
  const errores = [];
  for (const trozo of String(texto ?? '').split(/[,;\s]+/).filter(Boolean)) {
    const m = trozo.match(/^(\d+)(?:-(\d+))?$/);
    const desde = m ? Number(m[1]) : NaN;
    const hasta = m ? Number(m[2] ?? m[1]) : NaN;
    if (!m || desde < 1 || hasta < desde || hasta > MAX_ALUMNOS - 1) { errores.push(`«${trozo}» no es un número de lista ni un intervalo (de 1 a ${MAX_ALUMNOS - 1})`); continue; }
    for (let n = desde; n <= hasta; n++) numeros.add(n);
  }
  const apartados = NUMEROS_PRUEBA_CLAUDE.filter(n => numeros.has(n));
  for (const n of apartados) numeros.delete(n);
  return { numeros: [...numeros].sort((a, b) => a - b), apartados, errores };
}

/** El intervalo que se propone para una lista de nombres: «1-N», con N la última línea con nombre (o 51). */
export function numerosDeLista(texto, porDefecto = 51) {
  const lineas = String(texto ?? '').split('\n').map(l => l.trim());
  let ultima = 0;
  lineas.forEach((l, i) => { if (l) ultima = i + 1; });
  return `1-${ultima || porDefecto}`;
}

/** Los alumnos que pasan, [{ codigo, n }]: su código de siempre y, si se pide, el de prueba de Juan Luis. */
export function alumnosQuePasan(numeros, { conPrueba = true } = {}) {
  const lista = numeros.map(n => ({ codigo: codigoAlumno(n - 1), n }));
  if (conPrueba && !lista.some(a => a.n === PRUEBA_JL.n)) lista.push({ ...PRUEBA_JL });
  return lista;
}

/** La configuración de Juan Luis en su espacio: sus tareas de siempre (la 1 tal cual), las fechas de las unidades y códigos de 4. */
export function configDeJuanLuis(tareas = TAREAS, unidades = UNIDADES) {
  return {
    unidades: unidades.map(u => ({ n: u.n, desde: u.desde })),
    tareas: JSON.parse(JSON.stringify(tareas)),
    longitudCodigo: 4,
  };
}

/** El código de alumno de un documento del modo antiguo (o del espacio), o null. */
export function codigoDeDocumento(sub, id, fields = null) {
  if (sub === 'progreso-libre') return id.split('--')[1] ?? null;
  if (sub === 'progreso-tareas') return id.split('--')[2] ?? null;
  if (sub === 'asignaciones') return id;
  if (sub === 'fallos') return fields?.alumno?.stringValue ?? id.split('-')[0] ?? null;
  return null;
}

const enteroDe = v => Number(v?.integerValue ?? v?.doubleValue ?? 0) || 0;
const idsDeTareas = fields => (fields?.tareas?.arrayValue?.values ?? []).map(v => Number(v.integerValue ?? v.doubleValue)).filter(Number.isInteger);

function estadoDe(fields) {
  try {
    const e = JSON.parse(fields?.estado?.stringValue);
    return Array.isArray(e?.ej) ? e : null;
  } catch { return null; }
}

/**
 * Lo que hay que escribir para llevar un documento de progreso `origen` (campos REST)
 * a donde ya está `destino` (campos REST o null): los campos que escribir, o null si
 * no hace falta (lo del espacio ya está igual o más avanzado). Fusiona como la base al
 * cambiar de aparato: gana lo más avanzado, ejercicio a ejercicio; nunca retrocede.
 * `{ ilegible: true }` si el de origen no se entiende y en el destino ya hay algo.
 */
export function fusionDeProgreso(origen, destino) {
  if (!destino) return { fields: origen };
  const a = estadoDe(origen), b = estadoDe(destino);
  if (!a) return { ilegible: true };
  if (!b) return { fields: origen };
  const ej = fusionarProgreso(a.ej, b.ej);
  if (canonico(ej) === canonico(b.ej)) return null;
  const estado = JSON.stringify({ v: 1, idioma: b.idioma ?? a.idioma ?? 'alterno', ej });
  if (estado.length >= 4000) return { grande: true };
  return { fields: { estado: { stringValue: estado }, actualizado: { integerValue: String(Math.max(enteroDe(origen.actualizado), enteroDe(destino.actualizado))) } } };
}

/** Lo mismo con una asignación: la unión de las tareas asignadas en los dos sitios (o null si ya están todas). */
export function fusionDeAsignacion(origen, destino) {
  if (!destino) return { fields: origen };
  const ya = new Set(idsDeTareas(destino));
  const todas = [...new Set([...ya, ...idsDeTareas(origen)])].sort((x, y) => x - y);
  if (todas.length === ya.size) return null;
  return { fields: { tareas: { arrayValue: { values: todas.map(n => ({ integerValue: String(n) })) } }, actualizado: { integerValue: String(Math.max(enteroDe(origen.actualizado), enteroDe(destino.actualizado))) } } };
}

/**
 * El plan del paso, sin escribir nada.
 *   uid       el profesor (su espacio).
 *   alumnos   [{ codigo, n }] que pasan.
 *   origen    { 'progreso-libre': [{ id, fields }], 'progreso-tareas': [...], asignaciones: [...],
 *               fallos: [...] | null (sin permiso para leerlos) }, del modo antiguo.
 *   destino   { codigos: [{ id, profesor, n }] (búsqueda de esos códigos y los propios),
 *               'progreso-libre', 'progreso-tareas', asignaciones, fallos: [{ id, fields }] del espacio,
 *               config: { json } | null }.
 *   opciones  { config: 'sustituir' | 'no', configNueva, fallos: 'auto' | 'si' | 'no' }.
 * Devuelve { registrar, yaRegistrados, bloqueos, escrituras, fallos, fallosNota, config,
 * omitidos, cuentas, escriturasTotales }. Con `bloqueos` no vacío no se ejecuta nada.
 */
export function planDelPaso({ uid, alumnos, origen, destino, opciones = {} }) {
  const { config: queConfig = 'sustituir', configNueva = configDeJuanLuis(), fallos: queFallos = 'auto' } = opciones;
  const bloqueos = [];
  const registrar = [];
  const yaRegistrados = [];
  const codigos = new Map((destino.codigos ?? []).map(c => [c.id, c]));
  const numerosOcupados = new Map((destino.codigos ?? []).filter(c => c.profesor === uid).map(c => [c.n, c.id]));
  for (const a of alumnos) {
    const fila = codigos.get(a.codigo);
    if (!fila) {
      const otro = numerosOcupados.get(a.n);
      if (otro && otro !== a.codigo) bloqueos.push(`El n.º ${a.n} ya tiene otro código en tu espacio (${otro}): bórralo en «Mis alumnos» antes de pasar.`);
      else registrar.push(a);
    } else if (fila.profesor !== uid) bloqueos.push(`El código ${a.codigo} (n.º ${a.n}) ya está registrado a nombre de otro profesor.`);
    else if (fila.n !== a.n) bloqueos.push(`El código ${a.codigo} ya está en tu espacio con el n.º ${fila.n}, no con el ${a.n}.`);
    else yaRegistrados.push(a);
  }

  const queda = new Set(alumnos.map(a => a.codigo));
  const omitidos = { ilegibles: 0, grandes: 0, otros: 0 };
  const escrituras = [];
  const cuentas = {};
  for (const sub of ['progreso-libre', 'progreso-tareas', 'asignaciones']) {
    const enDestino = new Map((destino[sub] ?? []).map(d => [d.id, d.fields]));
    const c = cuentas[sub] = { origen: 0, nuevos: 0, fusionados: 0, iguales: 0 };
    for (const d of origen[sub] ?? []) {
      if (!queda.has(codigoDeDocumento(sub, d.id, d.fields))) { omitidos.otros++; continue; }
      c.origen++;
      const ya = enDestino.get(d.id) ?? null;
      const r = sub === 'asignaciones' ? fusionDeAsignacion(d.fields, ya) : fusionDeProgreso(d.fields, ya);
      if (r === null) { c.iguales++; continue; }
      if (r.ilegible) { omitidos.ilegibles++; continue; }
      if (r.grande) { omitidos.grandes++; continue; }
      (ya ? c.fusionados++ : c.nuevos++);
      escrituras.push({ sub, id: d.id, codigo: codigoDeDocumento(sub, d.id, d.fields), ruta: `${coleccionEspacio(uid, sub)}/${d.id}`, fields: r.fields });
    }
  }

  // Los fallos solo se crean (las reglas no dejan cambiarlos): los que ya están, se dejan.
  let fallos = [];
  let fallosNota = '';
  const cf = cuentas.fallos = { origen: 0, nuevos: 0, fusionados: 0, iguales: 0 };
  if (origen.fallos === null || origen.fallos === undefined) {
    fallosNota = 'No se han podido leer los fallos del sistema actual (solo los lee el administrador): no se copian.';
  } else {
    const yaEstan = new Set((destino.fallos ?? []).map(d => d.id));
    for (const d of origen.fallos) {
      if (!queda.has(codigoDeDocumento('fallos', d.id, d.fields))) { omitidos.otros++; continue; }
      cf.origen++;
      if (yaEstan.has(d.id)) { cf.iguales++; continue; }
      fallos.push({ sub: 'fallos', id: d.id, codigo: codigoDeDocumento('fallos', d.id, d.fields), ruta: `${coleccionEspacio(uid, 'fallos')}/${d.id}`, fields: d.fields });
    }
    if (queFallos === 'no' || (queFallos === 'auto' && fallos.length > TOPE_FALLOS)) {
      fallosNota = queFallos === 'no'
        ? `Los ${fallos.length} fallos no se copian (elegido así): se quedan en la colección «fallos» del sistema actual.`
        : `Son ${fallos.length} fallos, más de ${TOPE_FALLOS}: no se copian salvo que lo pidas (cuota de escrituras). Descarga antes el CSV de «Qué falla más»; la colección «fallos» se queda donde está.`;
      fallos = [];
    }
    cf.nuevos = fallos.length;
  }

  let config = null;
  if (queConfig === 'sustituir') {
    const errores = erroresConfig(configNueva);
    if (errores.length) bloqueos.push(`La configuración de tareas no es válida: ${errores.join('; ')}.`);
    const json = configAJSON(configNueva);
    const antes = destino.config ? configDeJSON(destino.config.json) : null;
    if (!antes || canonico(JSON.parse(configAJSON(antes))) !== canonico(JSON.parse(json))) {
      config = { json, antes: destino.config?.json ?? null, tareasAntes: antes?.tareas.length ?? 0, tareas: configNueva.tareas.length };
    }
  }

  const escriturasTotales = registrar.length + escrituras.length + fallos.length + (config ? 1 : 0);
  if (escriturasTotales > TOPE_ESCRITURAS) {
    bloqueos.push(`Serían ${escriturasTotales} escrituras, más de ${TOPE_ESCRITURAS} (el 75 % de las ${ESCRITURAS_DIA} diarias del plan gratuito). Pasa sin los fallos, o en dos noches.`);
  }
  return { uid, alumnos, registrar, yaRegistrados, bloqueos, escrituras, fallos, fallosNota, config, omitidos, cuentas, escriturasTotales };
}

/** El plan en frases, para enseñarlo antes de pasar (y después, como comprobación). */
export function resumenDelPlan(plan) {
  const L = [];
  const n = plan.alumnos.length;
  L.push(`Alumnos: ${n} (${plan.yaRegistrados.length} ya en tu espacio, ${plan.registrar.length} por registrar).`);
  const nombre = { 'progreso-libre': 'Progreso de práctica libre (y tarea 1)', 'progreso-tareas': 'Progreso por tarea', 'asignaciones': 'Asignaciones', 'fallos': 'Fallos' };
  for (const [sub, c] of Object.entries(plan.cuentas)) {
    L.push(`${nombre[sub]}: ${c.origen} en el sistema actual → ${c.nuevos} por copiar${c.fusionados ? `, ${c.fusionados} por fusionar con lo que ya hay` : ''}${c.iguales ? `, ${c.iguales} ya están` : ''}.`);
  }
  if (plan.fallosNota) L.push(plan.fallosNota);
  if (plan.config) {
    L.push(plan.config.antes
      ? `Tareas y fechas: se sustituyen las ${plan.config.tareasAntes} tareas que hay ahora en tu espacio por las ${plan.config.tareas} de siempre (con códigos de 4).`
      : `Tareas y fechas: se copian a tu espacio tus ${plan.config.tareas} tareas de siempre, con los mismos números, y las fechas de las unidades (con códigos de 4).`);
  } else L.push('Tareas y fechas: ya están en tu espacio.');
  const o = plan.omitidos;
  if (o.ilegibles || o.grandes) L.push(`No se copian ${o.ilegibles + o.grandes} documentos (${o.ilegibles} ilegibles, ${o.grandes} demasiado grandes al fusionar).`);
  L.push(`Escrituras: ${plan.escriturasTotales} (${Math.round((plan.escriturasTotales / ESCRITURAS_DIA) * 100)} % de las ${ESCRITURAS_DIA} diarias).`);
  for (const b of plan.bloqueos) L.push(`⛔ ${b}`);
  return L;
}

/** ¿Queda algo por hacer? (Después de pasar, el plan repetido tiene que salir vacío.) */
export const planVacio = plan => !plan.registrar.length && !plan.escrituras.length && !plan.fallos.length && !plan.config;

// --- Firestore por REST, con el token de la sesión ------------------------------------

/** Un error de REST con su código HTTP. */
export class ErrorRest extends Error {
  constructor(status, mensaje) { super(mensaje); this.status = status; }
}

/**
 * Cliente REST mínimo: `token()` da el token de la sesión (se pide en cada
 * petición: el SDK lo renueva solo). Rutas relativas a `documents/`.
 */
export function crearClienteRest({ token, fetch: pedir = globalThis.fetch, config = firebaseConfig }) {
  const base = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents`;
  async function peticion(metodo, ruta, { cuerpo, consulta = '' } = {}) {
    const t = await token();
    const r = await pedir(`${base}${ruta}${consulta ? `?${consulta}` : ''}`, {
      method: metodo,
      headers: { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) },
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
    });
    let json = null;
    try { json = await r.json(); } catch { /* sin cuerpo */ }
    return { status: r.status, ok: r.ok, json };
  }
  const idDe = d => d.name.split('/').at(-1);
  const fallo = (r, que) => new ErrorRest(r.status, `${que}: HTTP ${r.status}${r.json?.error?.message ? ` (${r.json.error.message})` : ''}`);
  return {
    /** Todos los documentos de una colección, [{ id, fields }]. */
    async listar(coleccion) {
      const docs = [];
      let pagina = '';
      do {
        const r = await peticion('GET', `/${coleccion}`, { consulta: `pageSize=300${pagina}` });
        if (!r.ok) throw fallo(r, `leer «${coleccion}»`);
        for (const d of r.json?.documents ?? []) docs.push({ id: idDe(d), fields: d.fields ?? {} });
        pagina = r.json?.nextPageToken ? `&pageToken=${encodeURIComponent(r.json.nextPageToken)}` : '';
      } while (pagina);
      return docs;
    },
    /** Los campos de un documento, o null si no existe. */
    async leer(ruta) {
      const r = await peticion('GET', `/${ruta}`);
      if (r.status === 404) return null;
      if (!r.ok) throw fallo(r, `leer «${ruta}»`);
      return r.json?.fields ?? {};
    },
    /** Escribe (crea o sustituye) un documento entero; con `nuevo`, solo si no existe. */
    async escribir(ruta, fields, { nuevo = false } = {}) {
      const r = await peticion('PATCH', `/${ruta}`, { cuerpo: { fields }, consulta: nuevo ? 'currentDocument.exists=false' : '' });
      if (!r.ok) throw fallo(r, `escribir «${ruta}»`);
    },
    /** Crea un documento si no existe: 'creado' | 'existe'. */
    async crear(coleccion, id, fields) {
      const r = await peticion('POST', `/${coleccion}`, { cuerpo: { fields }, consulta: `documentId=${encodeURIComponent(id)}` });
      if (r.ok) return 'creado';
      if (r.status === 409) return 'existe';
      throw fallo(r, `crear «${coleccion}/${id}»`);
    },
  };
}

/** Hace `fn` con todos los elementos, `n` a la vez. Devuelve los errores ([{ item, error }]). */
export async function enParalelo(items, n, fn) {
  const errores = [];
  let i = 0;
  async function obrero() {
    while (i < items.length) {
      const item = items[i++];
      try { await fn(item); } catch (error) { errores.push({ item, error }); }
    }
  }
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, obrero));
  return errores;
}

/** Los ids que pueden existir en el modo antiguo para unos códigos (cuando no se puede listar: profesor de prueba). */
export function idsPosibles(codigos, tareas = TAREAS) {
  const slugs = CATALOGO.map(p => p.slug);
  const pares = [];
  for (const t of tareas) if (!t.progresoPorPractica) for (const s of new Set([...t.estrella, ...t.elegir].map(([slug]) => slug))) pares.push([t.id, s]);
  return {
    'progreso-libre': codigos.flatMap(c => slugs.map(s => `${s}--${c}`)),
    'progreso-tareas': codigos.flatMap(c => pares.map(([id, s]) => `t${id}--${s}--${c}`)),
    'asignaciones': [...codigos],
  };
}

/**
 * Lee del modo antiguo lo de esos alumnos. `listar: true` (el administrador)
 * lee las colecciones enteras; si no (un profesor de prueba, que no puede
 * listarlas), documento a documento con `get`, y los fallos no se leen.
 */
export async function leerOrigen(cliente, alumnos, { listar = true, tareas = TAREAS, alAvanzar = () => {} } = {}) {
  const codigos = new Set(alumnos.map(a => a.codigo));
  const origen = {};
  if (listar) {
    for (const [sub, coleccion] of Object.entries(ORIGENES)) {
      alAvanzar(`Leyendo «${coleccion}» del sistema actual…`);
      origen[sub] = (await cliente.listar(coleccion)).filter(d => codigos.has(codigoDeDocumento(sub, d.id, d.fields)));
    }
    return origen;
  }
  const ids = idsPosibles([...codigos], tareas);
  for (const sub of ['progreso-libre', 'progreso-tareas', 'asignaciones']) {
    alAvanzar(`Leyendo «${ORIGENES[sub]}» del sistema actual, documento a documento (${ids[sub].length})…`);
    const encontrados = [];
    const errores = await enParalelo(ids[sub], 8, async id => {
      const fields = await cliente.leer(`${ORIGENES[sub]}/${id}`);
      if (fields) encontrados.push({ id, fields });
    });
    if (errores.length) throw errores[0].error;
    origen[sub] = encontrados.sort((a, b) => (a.id < b.id ? -1 : 1));
  }
  origen.fallos = null;
  return origen;
}

/** Lee del espacio lo que hace falta para el plan: la búsqueda de esos códigos, lo ya copiado y la configuración. */
export async function leerDestino(cliente, uid, alumnos, { alAvanzar = () => {} } = {}) {
  alAvanzar('Leyendo tu espacio…');
  const destino = { codigos: [] };
  const errores = await enParalelo(alumnos, 8, async a => {
    const f = await cliente.leer(`${COLECCION_BUSQUEDA}/${a.codigo}`);
    if (f) destino.codigos.push({ id: a.codigo, profesor: f.profesor?.stringValue, n: enteroDe(f.n) });
  });
  if (errores.length) throw errores[0].error;
  for (const sub of ['progreso-libre', 'progreso-tareas', 'asignaciones', 'fallos']) destino[sub] = await cliente.listar(coleccionEspacio(uid, sub));
  const config = await cliente.leer(`${COLECCION_ESPACIOS}/${uid}/config/tareas`);
  destino.config = config ? { json: config.json?.stringValue ?? '' } : null;
  return destino;
}

/** Los números de lista de un profesor ya ocupados por otros códigos (para el plan): consulta `profesor == uid`. */
export async function leerMisCodigos(uid, { token, fetch: pedir = globalThis.fetch, config = firebaseConfig } = {}) {
  const t = await token();
  const r = await pedir(`https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents:runQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
    body: JSON.stringify({ structuredQuery: { from: [{ collectionId: COLECCION_BUSQUEDA }], where: { fieldFilter: { field: { fieldPath: 'profesor' }, op: 'EQUAL', value: { stringValue: uid } } } } }),
  });
  const json = await r.json().catch(() => null);
  if (!r.ok) throw new ErrorRest(r.status, `leer tus códigos: HTTP ${r.status}`);
  return (json ?? []).filter(x => x.document).map(x => ({ id: x.document.name.split('/').at(-1), profesor: uid, n: enteroDe(x.document.fields?.n) }));
}

/** El plan entero desde la nube: origen, destino (con los códigos propios) y el cálculo. */
export async function prepararPaso(cliente, { uid, alumnos, listar = true, opciones = {}, misCodigos = [], alAvanzar = () => {} }) {
  const origen = await leerOrigen(cliente, alumnos, { listar, alAvanzar });
  const destino = await leerDestino(cliente, uid, alumnos, { alAvanzar });
  const vistos = new Set(destino.codigos.map(c => c.id));
  destino.codigos.push(...misCodigos.filter(c => !vistos.has(c.id)));
  return { plan: planDelPaso({ uid, alumnos, origen, destino, opciones }), origen, destino };
}

/**
 * Ejecuta un plan sin bloqueos: configuración, registro de los códigos, progreso y
 * asignaciones, y fallos. Lo que falla no para lo demás (se puede repetir).
 * Devuelve { config, registrados, existian, escritos, fallosCopiados, errores: [frase] }.
 */
export async function ejecutarPaso(cliente, plan, { alAvanzar = () => {}, ahora = Date.now() } = {}) {
  if (plan.bloqueos.length) throw new Error('El plan tiene bloqueos: no se escribe nada.');
  const r = { config: false, registrados: 0, existian: 0, escritos: 0, fallosCopiados: 0, errores: [] };
  const anotar = errores => r.errores.push(...errores.map(e => `${e.item.ruta ?? e.item.codigo}: ${e.error.message}`));

  if (plan.config) {
    alAvanzar('Guardando tus tareas y fechas…');
    try {
      await cliente.escribir(`${COLECCION_ESPACIOS}/${plan.uid}/config/tareas`, { json: { stringValue: plan.config.json }, actualizado: { integerValue: String(ahora) } });
      r.config = true;
    } catch (e) { r.errores.push(`configuración: ${e.message}`); }
  }

  alAvanzar(`Registrando ${plan.registrar.length} códigos…`);
  const sinRegistrar = new Set();
  anotar(await enParalelo(plan.registrar, 6, async a => {
    const hecho = await cliente.crear(COLECCION_BUSQUEDA, a.codigo, { profesor: { stringValue: plan.uid }, n: { integerValue: String(a.n) }, alta: { integerValue: String(ahora) } })
      .catch(e => { sinRegistrar.add(a.codigo); throw e; });
    if (hecho === 'creado') { r.registrados++; return; }
    // Ya existía: solo vale si es suyo con el mismo número (otra pasada, o una carrera).
    const f = await cliente.leer(`${COLECCION_BUSQUEDA}/${a.codigo}`);
    if (f?.profesor?.stringValue === plan.uid && enteroDe(f.n) === a.n) { r.existian++; return; }
    sinRegistrar.add(a.codigo);
    throw new Error(`el código ${a.codigo} ya estaba registrado de otra manera: no se copia nada suyo`);
  }));

  const deRegistrados = x => !sinRegistrar.has(x.codigo);
  const docs = plan.escrituras.filter(deRegistrados);
  alAvanzar(`Copiando ${docs.length} documentos de progreso y asignaciones…`);
  let hechos = 0;
  anotar(await enParalelo(docs, 8, async w => {
    await cliente.escribir(w.ruta, w.fields);
    r.escritos++;
    if (++hechos % 50 === 0) alAvanzar(`Copiando documentos… ${hechos} de ${docs.length}`);
  }));

  const fallos = plan.fallos.filter(deRegistrados);
  if (fallos.length) alAvanzar(`Copiando ${fallos.length} fallos…`);
  hechos = 0;
  anotar(await enParalelo(fallos, 8, async w => {
    await cliente.escribir(w.ruta, w.fields, { nuevo: true });
    r.fallosCopiados++;
    if (++hechos % 200 === 0) alAvanzar(`Copiando fallos… ${hechos} de ${fallos.length}`);
  }));
  return r;
}

// --- Pantalla (solo el administrador, en su espacio) ------------------------------------

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/**
 * Monta la herramienta en `contenedor`. `contexto` (de profesor.js):
 *   uid, token() (de la sesión), listaAntigua() (la lista del sistema actual, en este
 *   navegador), listaEspacio(), ponerListaEspacio(texto), cambiarConfig(config),
 *   recargarTodo() (vuelve a leer todo el espacio), datos (leerLectores, guardarLectores).
 */
export function montar(contenedor, contexto) {
  let plan = null;
  let ocupado = false;
  const $ = sel => contenedor.querySelector(sel);

  contenedor.innerHTML = `
    <p class="pequeno">Pasa a tus alumnos a tu espacio <strong>con los códigos de siempre</strong>: no cambian ni sus códigos ni sus enlaces, y no hay que mandarles nada. Se registra cada código a tu nombre, se copia a tu espacio su progreso (práctica libre y tarea 1, tareas, asignaciones y fallos) y tus tareas de siempre, con los mismos números. Lo del sistema actual no se borra. Hazlo de noche (después del informe de las 21:30), con el sistema actual sin abrir en otra pestaña. Antes, descarga el CSV de «Qué falla más» en el sistema actual.</p>
    <div class="selector"><label for="mig-numeros">Números de lista que pasan:</label> <input id="mig-numeros" style="width: 12rem"></div>
    <label class="pequeno"><input type="checkbox" id="mig-prueba" checked> También tu alumno de prueba ${esc(PRUEBA_JL.codigo)} (con el n.º ${PRUEBA_JL.n})</label>
    <p class="pequeno">Los códigos de prueba de Claude (n.º ${NUMEROS_PRUEBA_CLAUDE.join(', ')}) no pasan nunca a tu espacio.</p>
    <div class="botonera"><button type="button" class="secundario" id="mig-ensayo">1. Ensayo (no escribe nada)</button></div>
    <div id="mig-plan"></div>
    <label class="pequeno" id="mig-caja-fallos" hidden><input type="checkbox" id="mig-fallos"> Copiar los fallos aunque sean muchos</label>
    <div class="contrasenas">
      <input id="mig-confirmar" placeholder="Escribe ${PALABRA} para confirmar" autocomplete="off">
      <button type="button" id="mig-pasar" disabled>2. Pasar al sistema nuevo</button>
    </div>
    <p class="pequeno" id="mig-estado" aria-live="polite"></p>
    <h3>Después de pasar</h3>
    <p class="pequeno">Se puede repetir sin duplicar nada: al día siguiente, «Ensayo» y, si queda algo por copiar (un alumno que practicó con el sistema actual abierto), «Pasar» otra vez.</p>
    <div class="botonera"><button type="button" class="secundario" id="mig-lista">Copiar aquí la lista de nombres del sistema actual</button></div>
    <p class="pequeno" id="mig-estado-lista"></p>
    <h4>Cuenta lectora del informe diario</h4>
    <p class="pequeno">El informe de cada noche lee tu espacio con una cuenta de solo lectura (correo y contraseña, creada en la consola de Firebase → Authentication). Pega aquí su uid (columna «User UID»): solo podrá leer tu progreso y tus fallos, nunca los nombres.</p>
    <div class="contrasenas">
      <input id="mig-lector" placeholder="uid de la cuenta lectora" autocomplete="off">
      <button type="button" class="secundario" id="mig-lector-guardar">Añadir como lectora</button>
    </div>
    <p class="pequeno" id="mig-lectores"></p>`;

  $('#mig-numeros').value = numerosDeLista(contexto.listaAntigua());
  const cliente = crearClienteRest({ token: contexto.token });
  const estado = texto => { $('#mig-estado').textContent = texto; };
  const alumnos = () => {
    const { numeros, apartados, errores } = leerNumeros($('#mig-numeros').value);
    return { lista: alumnosQuePasan(numeros, { conPrueba: $('#mig-prueba').checked }), apartados, errores };
  };
  const puedePasar = () => Boolean(plan && !plan.bloqueos.length && !planVacio(plan) && $('#mig-confirmar').value.trim() === PALABRA && !ocupado);
  const repintarBoton = () => { $('#mig-pasar').disabled = !puedePasar(); };

  function pintarPlan(p, cabecera) {
    $('#mig-plan').innerHTML = `<div class="aviso${p.bloqueos.length ? ' aviso--error' : ''}"><p><strong>${esc(cabecera)}</strong></p><ul>${resumenDelPlan(p).map(l => `<li class="pequeno">${esc(l)}</li>`).join('')}</ul></div>`;
    $('#mig-caja-fallos').hidden = !/más de \d+: no se copian/.test(p.fallosNota) && !$('#mig-fallos').checked;
  }

  async function ensayo() {
    const { lista, apartados, errores } = alumnos();
    if (errores.length) { estado(errores.join('. ')); return null; }
    ocupado = true; repintarBoton();
    try {
      const token = contexto.token;
      const misCodigos = await leerMisCodigos(contexto.uid, { token });
      const { plan: p } = await prepararPaso(cliente, {
        uid: contexto.uid, alumnos: lista, misCodigos, alAvanzar: estado,
        opciones: { fallos: $('#mig-fallos').checked ? 'si' : 'auto' },
      });
      plan = p;
      estado(apartados.length ? `Apartados (códigos de prueba de Claude): n.º ${apartados.join(', ')}.` : '');
      return p;
    } catch (e) {
      estado(`No se ha podido leer: ${e.message}`);
      return null;
    } finally {
      ocupado = false; repintarBoton();
    }
  }

  $('#mig-ensayo').addEventListener('click', async () => {
    const p = await ensayo();
    if (p) pintarPlan(p, planVacio(p) ? 'No queda nada por pasar: todo está ya en tu espacio.' : p.bloqueos.length ? 'No se puede pasar todavía:' : 'Esto es lo que se hará:');
    repintarBoton();
  });
  $('#mig-confirmar').addEventListener('input', repintarBoton);
  $('#mig-numeros').addEventListener('input', () => { plan = null; repintarBoton(); });
  $('#mig-prueba').addEventListener('change', () => { plan = null; repintarBoton(); });
  $('#mig-fallos').addEventListener('change', () => { plan = null; repintarBoton(); });

  $('#mig-pasar').addEventListener('click', async () => {
    if (!puedePasar()) return;
    ocupado = true; repintarBoton();
    const hecho = plan;
    let r;
    try {
      r = await ejecutarPaso(cliente, hecho, { alAvanzar: estado });
    } catch (e) {
      ocupado = false; repintarBoton();
      estado(`No se ha podido pasar: ${e.message}`);
      return;
    }
    ocupado = false;
    if (r.config) { const c = configDeJSON(hecho.config.json); if (c) contexto.cambiarConfig(c); }
    $('#mig-confirmar').value = '';
    // Comprobación: el mismo plan otra vez tiene que salir vacío.
    const p = await ensayo();
    const resultado = `Hecho: ${r.registrados} códigos registrados${r.existian ? ` (${r.existian} ya lo estaban)` : ''}, ${r.escritos} documentos copiados, ${r.fallosCopiados} fallos${r.config ? ', tareas y fechas guardadas' : ''}.`
      + (r.errores.length ? ` ${r.errores.length} cosas han fallado (vuelve a pulsar «Pasar» para reintentarlas): ${r.errores.slice(0, 5).join('; ')}${r.errores.length > 5 ? '…' : ''}` : '');
    if (p) pintarPlan(p, planVacio(p) ? 'Comprobado: no queda nada por pasar.' : 'Comprobación: aún queda algo por pasar.');
    estado(resultado);
    try { await contexto.recargarTodo(); } catch { /* el panel dice lo suyo */ }
    repintarBoton();
  });

  $('#mig-lista').addEventListener('click', () => {
    const antigua = contexto.listaAntigua();
    const salida = $('#mig-estado-lista');
    if (!antigua.trim()) { salida.textContent = 'En este navegador no hay lista del sistema actual.'; return; }
    if (contexto.listaEspacio().trim() && contexto.listaEspacio() !== antigua && !globalThis.confirm?.('Ya tienes una lista en «Mis alumnos». ¿Sustituirla por la del sistema actual?')) return;
    contexto.ponerListaEspacio(antigua);
    salida.textContent = 'Copiada en «Mis alumnos». Para tenerla en otro ordenador, guárdala cifrada con tu contraseña (abajo, en «Mis alumnos»).';
  });

  async function pintarLectores() {
    try {
      const lectores = await contexto.datos.leerLectores();
      $('#mig-lectores').textContent = lectores.length ? `Lectoras ahora: ${lectores.join(', ')}.` : 'Aún no hay ninguna cuenta lectora.';
    } catch (e) { $('#mig-lectores').textContent = `No se han podido leer las lectoras: ${e.message}`; }
  }
  $('#mig-lector-guardar').addEventListener('click', async () => {
    const uid = $('#mig-lector').value.trim();
    if (!/^[A-Za-z0-9]{10,128}$/.test(uid)) { $('#mig-lectores').textContent = 'Eso no parece un uid (solo letras y números, sin espacios).'; return; }
    try {
      const ya = await contexto.datos.leerLectores();
      await contexto.datos.guardarLectores([...ya, uid]);
      $('#mig-lector').value = '';
    } catch (e) { $('#mig-lectores').textContent = `No se ha podido guardar: ${e.message}`; return; }
    pintarLectores();
  });
  pintarLectores();
}
