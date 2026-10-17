// Tarea 70 del reparto PU2: «Pasar al sistema nuevo» con los códigos de siempre.
// Lógica pura del plan y el paso de punta a punta contra una nube falsa en memoria
// que imita lo que importa de las reglas (escribir en el espacio exige que el código
// esté registrado a nombre de su dueño; los fallos solo se crean; crear un código
// que ya existe no lo cambia). Datos inventados: ningún código de alumno real.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  leerNumeros, numerosDeLista, alumnosQuePasan, configDeJuanLuis, codigoDeDocumento, fusionDeProgreso, fusionDeAsignacion,
  planDelPaso, resumenDelPlan, planVacio, crearClienteRest, prepararPaso, ejecutarPaso, leerMisCodigos, idsPosibles,
  PRUEBA_JL, NUMEROS_PRUEBA_CLAUDE, TOPE_FALLOS, PALABRA,
} from '../practicas/profesor-migracion.js';
import { codigoAlumno } from '../practicas/_comun/codigos.js';
import { TAREAS, configDeJSON, configAJSON, erroresConfig } from '../practicas/_comun/tareas.js';
import { UNIDADES } from '../practicas/_comun/catalogo.js';
import { tareaDeFormulario, conservarSiBloqueada } from '../practicas/profesor-tareas.js';
import { leerCsvCodigos, listaDeSiempre } from '../herramientas/informe-actividad.mjs';

const UID = 'ProfesorJLdePrueba01';
const OTRO = 'OtroProfesorDePrueba2';
const cod = n => codigoAlumno(n - 1);

// --- Campos REST de prueba ------------------------------------------------------------

const ej = (puntos, terminado = false) => ({ puntos, objetivo: 10, vidas: 5, racha: 0, aciertos: puntos, fallos: 0, terminado, dia: terminado ? 900 : 0 });
const progreso = (lista, actualizado = 1000) => ({ estado: { stringValue: JSON.stringify({ v: 1, idioma: 'alterno', ej: lista }) }, actualizado: { integerValue: String(actualizado) } });
const asignacion = (ids, actualizado = 1000) => ({ tareas: { arrayValue: { values: ids.map(n => ({ integerValue: String(n) })) } }, actualizado: { integerValue: String(actualizado) } });
const fallo = (codigo, t = 1700000000000) => ({
  v: { integerValue: '1' }, alumno: { stringValue: codigo }, practica: { stringValue: 'recta' }, ejercicio: { integerValue: '1' },
  t: { integerValue: String(t) }, dia: { integerValue: '900' }, idioma: { stringValue: 'es' }, item: { stringValue: '¿12 es múltiplo de 4?' },
  feedback: { stringValue: '12 = 4 · 3' }, repeticion: { booleanValue: false },
});
const ejDe = fields => JSON.parse(fields.estado.stringValue).ej;

// --- Lo puro ---------------------------------------------------------------------------

test('leerNumeros: intervalos y sueltos; los de prueba de Claude (60-63) nunca pasan', () => {
  assert.deepEqual(leerNumeros('1-3, 5;7').numeros, [1, 2, 3, 5, 7]);
  const r = leerNumeros('58-65');
  assert.deepEqual(r.numeros, [58, 59, 64, 65]);
  assert.deepEqual(r.apartados, NUMEROS_PRUEBA_CLAUDE);
  assert.equal(leerNumeros('1-51').numeros.length, 51);
  for (const malo of ['0', '5-3', 'a', '1-1024', '3-']) assert.equal(leerNumeros(malo).errores.length, 1, malo);
  assert.deepEqual(leerNumeros('').numeros, []);
});

test('numerosDeLista: hasta la última línea con nombre (51 si no hay lista)', () => {
  assert.equal(numerosDeLista('Ana\n\nLuis\n\n'), '1-3');
  assert.equal(numerosDeLista(''), '1-51');
  assert.equal(numerosDeLista(null), '1-51');
});

test('alumnosQuePasan: el código de siempre de cada número y AJJN con el n.º 1000', () => {
  assert.equal(PRUEBA_JL.codigo, 'AJJN');
  assert.equal(PRUEBA_JL.n, 1000);
  const lista = alumnosQuePasan([1, 2, 51]);
  assert.deepEqual(lista, [{ codigo: cod(1), n: 1 }, { codigo: cod(2), n: 2 }, { codigo: cod(51), n: 51 }, { codigo: 'AJJN', n: 1000 }]);
  assert.deepEqual(alumnosQuePasan([1], { conPrueba: false }), [{ codigo: cod(1), n: 1 }]);
  assert.equal(alumnosQuePasan([1000]).filter(a => a.n === 1000).length, 1, 'AJJN no se repite');
});

test('configDeJuanLuis: sus tareas con los mismos ids (la 1 con progresoPorPractica), las fechas y códigos de 4; válida en un espacio', () => {
  const c = configDeJuanLuis();
  assert.deepEqual(c.tareas.map(t => t.id), TAREAS.map(t => t.id));
  assert.equal(c.tareas.find(t => t.id === 1).progresoPorPractica, true);
  assert.notEqual(c.tareas[0], TAREAS[0], 'es una copia');
  assert.deepEqual(c.unidades, UNIDADES.map(u => ({ n: u.n, desde: u.desde })));
  assert.equal(c.longitudCodigo, 4);
  assert.deepEqual(erroresConfig(c), []);
  const vuelta = configDeJSON(configAJSON(c));
  assert.equal(vuelta.longitudCodigo, 4);
  assert.equal(vuelta.tareas[0].progresoPorPractica, true);
});

test('codigoDeDocumento: el código en el id de cada colección', () => {
  assert.equal(codigoDeDocumento('progreso-libre', 'recta--SF3A'), 'SF3A');
  assert.equal(codigoDeDocumento('progreso-tareas', 't2--criba--SF3A'), 'SF3A');
  assert.equal(codigoDeDocumento('asignaciones', 'SF3A'), 'SF3A');
  assert.equal(codigoDeDocumento('fallos', 'SF3A-abc123-zz99', fallo('SF3A')), 'SF3A');
});

test('fusionDeProgreso: copia si no hay nada; fusiona sin retroceder; nada si el espacio ya va igual o por delante', () => {
  const viejo = progreso([ej(10, true), ej(4)], 100);
  assert.deepEqual(fusionDeProgreso(viejo, null), { fields: viejo });
  assert.equal(fusionDeProgreso(viejo, viejo), null);
  const adelantado = progreso([ej(10, true), ej(7)], 200);
  assert.equal(fusionDeProgreso(viejo, adelantado), null, 'lo del espacio va por delante');
  const atrasado = progreso([ej(3), ej(8)], 300);
  const r = fusionDeProgreso(viejo, atrasado);
  assert.deepEqual(ejDe(r.fields).map(e => [e.puntos, e.terminado]), [[10, true], [8, false]]);
  assert.equal(r.fields.actualizado.integerValue, '300');
  assert.deepEqual(fusionDeProgreso({ estado: { stringValue: 'basura' }, actualizado: { integerValue: '1' } }, atrasado), { ilegible: true });
});

test('fusionDeAsignacion: la unión de las tareas', () => {
  assert.equal(fusionDeAsignacion(asignacion([5]), asignacion([5, 6])), null);
  const r = fusionDeAsignacion(asignacion([5, 7]), asignacion([6]));
  assert.deepEqual(r.fields.tareas.arrayValue.values.map(v => Number(v.integerValue)), [5, 6, 7]);
});

const ORIGEN = () => ({
  'progreso-libre': [
    { id: `recta--${cod(1)}`, fields: progreso([ej(10, true)], 111) },
    { id: `semaforo--${cod(2)}`, fields: progreso([ej(5)], 222) },
    { id: 'recta--AJJN', fields: progreso([ej(2)], 333) },
    { id: `recta--${cod(60)}`, fields: progreso([ej(9)], 444) },   // de Claude: no pasa
  ],
  'progreso-tareas': [{ id: `t2--criba--${cod(1)}`, fields: progreso([null, ej(3)], 555) }],
  'asignaciones': [{ id: cod(2), fields: asignacion([5]) }],
  'fallos': [
    { id: `${cod(1)}-k1a2b3-aaaa`, fields: fallo(cod(1)) },
    { id: `${cod(60)}-k1a2b3-bbbb`, fields: fallo(cod(60)) },
  ],
});
const VACIO = () => ({ codigos: [], 'progreso-libre': [], 'progreso-tareas': [], asignaciones: [], fallos: [], config: null });

test('planDelPaso: qué se registra, qué se copia y con qué ruta; lo de otros códigos no', () => {
  const alumnos = alumnosQuePasan([1, 2]);
  const plan = planDelPaso({ uid: UID, alumnos, origen: ORIGEN(), destino: VACIO() });
  assert.deepEqual(plan.bloqueos, []);
  assert.deepEqual(plan.registrar.map(a => [a.codigo, a.n]), [[cod(1), 1], [cod(2), 2], ['AJJN', 1000]]);
  assert.deepEqual(plan.escrituras.map(w => w.ruta), [
    `practicas-espacios/${UID}/progreso-libre/recta--${cod(1)}`,
    `practicas-espacios/${UID}/progreso-libre/semaforo--${cod(2)}`,
    `practicas-espacios/${UID}/progreso-libre/recta--AJJN`,
    `practicas-espacios/${UID}/progreso-tareas/t2--criba--${cod(1)}`,
    `practicas-espacios/${UID}/asignaciones/${cod(2)}`,
  ]);
  assert.equal(plan.escrituras[0].fields.actualizado.integerValue, '111', 'se conserva la hora: el informe no lo cuenta como actividad de hoy');
  assert.deepEqual(plan.fallos.map(f => f.ruta), [`practicas-espacios/${UID}/fallos/${cod(1)}-k1a2b3-aaaa`]);
  assert.ok(!JSON.stringify(plan).includes(cod(60)), 'nada del código de prueba 60');
  assert.equal(plan.config.tareas, TAREAS.length);
  assert.equal(plan.escriturasTotales, 3 + 5 + 1 + 1);
  assert.ok(resumenDelPlan(plan).some(l => /Escrituras: 10/.test(l)));
  assert.equal(planVacio(plan), false);
});

test('planDelPaso: bloqueos (código de otro profesor, otro número, número ocupado) y nada que hacer si ya está todo', () => {
  const alumnos = alumnosQuePasan([1, 2, 3], { conPrueba: false });
  const destino = { ...VACIO(), codigos: [
    { id: cod(1), profesor: OTRO, n: 1 },
    { id: cod(2), profesor: UID, n: 7 },
    { id: 'K7QMP3XA', profesor: UID, n: 3 },
  ] };
  const plan = planDelPaso({ uid: UID, alumnos, origen: ORIGEN(), destino });
  assert.equal(plan.bloqueos.length, 3);
  assert.match(plan.bloqueos.join('|'), /otro profesor/);
  assert.match(plan.bloqueos.join('|'), /n\.º 7/);
  assert.match(plan.bloqueos.join('|'), /K7QMP3XA/);
  // Todo hecho: plan vacío.
  const hecho = {
    codigos: alumnosQuePasan([1, 2]).map(a => ({ id: a.codigo, profesor: UID, n: a.n })),
    'progreso-libre': ORIGEN()['progreso-libre'], 'progreso-tareas': ORIGEN()['progreso-tareas'], asignaciones: ORIGEN().asignaciones,
    fallos: [{ id: `${cod(1)}-k1a2b3-aaaa` }], config: { json: configAJSON(configDeJuanLuis()) },
  };
  assert.ok(planVacio(planDelPaso({ uid: UID, alumnos: alumnosQuePasan([1, 2]), origen: ORIGEN(), destino: hecho })));
});

test('planDelPaso: con más de TOPE_FALLOS fallos no se copian salvo que se pida; sin permiso, tampoco', () => {
  const muchos = { ...ORIGEN(), fallos: Array.from({ length: TOPE_FALLOS + 1 }, (_, i) => ({ id: `${cod(1)}-k${String(i).padStart(6, '0')}-aaaa`, fields: fallo(cod(1)) })) };
  const alumnos = alumnosQuePasan([1], { conPrueba: false });
  const plan = planDelPaso({ uid: UID, alumnos, origen: muchos, destino: VACIO() });
  assert.equal(plan.fallos.length, 0);
  assert.match(plan.fallosNota, /más de 8000/);
  assert.equal(planDelPaso({ uid: UID, alumnos, origen: muchos, destino: VACIO(), opciones: { fallos: 'si' } }).fallos.length, TOPE_FALLOS + 1);
  const sinPermiso = planDelPaso({ uid: UID, alumnos, origen: { ...ORIGEN(), fallos: null }, destino: VACIO() });
  assert.equal(sinPermiso.fallos.length, 0);
  assert.match(sinPermiso.fallosNota, /administrador/);
});

test('idsPosibles: práctica libre de todo el catálogo y las parejas tarea-práctica de las tareas v2 (no la 1)', () => {
  const ids = idsPosibles(['XY4Z']);
  assert.ok(ids['progreso-libre'].includes('recta--XY4Z'));
  assert.ok(ids['progreso-tareas'].includes('t2--criba--XY4Z'));
  assert.ok(!ids['progreso-tareas'].some(id => id.startsWith('t1--')));
  assert.deepEqual(ids.asignaciones, ['XY4Z']);
});

// --- De punta a punta, contra una nube falsa --------------------------------------------

function nubeFalsa(uid, inicial = {}) {
  const docs = new Map(Object.entries(inicial));   // ruta → fields
  const peticiones = [];
  const BASE = '/databases/(default)/documents';
  const responder = (status, json = {}) => ({ status, ok: status >= 200 && status < 300, json: async () => json });
  const registradoA = c => docs.get(`practicas-alumnos/${c}`)?.profesor?.stringValue;
  function permitidoEscribir(ruta, fields) {
    const m = ruta.match(/^practicas-espacios\/([^/]+)\/([^/]+)\/(.+)$/);
    if (!m) return true;
    const [, dueno, sub, id] = m;
    if (dueno !== uid) return false;
    if (sub === 'config') return true;
    const c = codigoDeDocumento(sub, id, fields);
    return registradoA(c) === dueno;   // alumnoDe(uid, código)
  }
  async function fetch(url, { method = 'GET', body } = {}) {
    const u = new URL(url);
    const ruta = decodeURIComponent(u.pathname.split(BASE)[1] ?? '').replace(/^\//, '');
    const cuerpo = body ? JSON.parse(body) : null;
    peticiones.push(`${method} ${ruta}`);
    if (ruta === ':runQuery' || u.pathname.endsWith(':runQuery')) {
      const quien = cuerpo.structuredQuery.where.fieldFilter.value.stringValue;
      return responder(200, [...docs].filter(([r, f]) => r.startsWith('practicas-alumnos/') && f.profesor?.stringValue === quien)
        .map(([r, f]) => ({ document: { name: `x${BASE}/${r}`, fields: f } })));
    }
    if (method === 'GET') {
      if (docs.has(ruta)) return responder(200, { name: `x${BASE}/${ruta}`, fields: docs.get(ruta) });
      const hijos = [...docs].filter(([r]) => r.startsWith(`${ruta}/`) && !r.slice(ruta.length + 1).includes('/'));
      if (hijos.length || /^(practicas|practicas-tareas|practicas-asignaciones|fallos)$|\/(progreso-libre|progreso-tareas|asignaciones|fallos)$/.test(ruta)) {
        return responder(200, { documents: hijos.map(([r, f]) => ({ name: `x${BASE}/${r}`, fields: f })) });
      }
      return responder(404);
    }
    if (method === 'PATCH') {
      if (!permitidoEscribir(ruta, cuerpo.fields)) return responder(403, { error: { message: 'PERMISSION_DENIED' } });
      if (u.searchParams.get('currentDocument.exists') === 'false' && docs.has(ruta)) return responder(400, { error: { message: 'FAILED_PRECONDITION' } });
      if (/\/fallos\//.test(ruta) && docs.has(ruta)) return responder(403, { error: { message: 'los fallos no se cambian' } });
      docs.set(ruta, cuerpo.fields);
      return responder(200, { name: ruta, fields: cuerpo.fields });
    }
    if (method === 'POST') {
      const destino = `${ruta}/${u.searchParams.get('documentId')}`;
      if (docs.has(destino)) return responder(409, { error: { message: 'ALREADY_EXISTS' } });
      docs.set(destino, cuerpo.fields);
      return responder(200, { name: destino, fields: cuerpo.fields });
    }
    return responder(405);
  }
  return { docs, fetch, peticiones };
}

function sembrarAntiguo() {
  const o = ORIGEN();
  const inicial = {};
  for (const [sub, coleccion] of [['progreso-libre', 'practicas'], ['progreso-tareas', 'practicas-tareas'], ['asignaciones', 'practicas-asignaciones'], ['fallos', 'fallos']]) {
    for (const d of o[sub]) inicial[`${coleccion}/${d.id}`] = d.fields;
  }
  return inicial;
}

async function pasoCompleto(nube, alumnos, opciones = {}, listar = true) {
  const token = async () => 'token-de-prueba';
  const cliente = crearClienteRest({ token, fetch: nube.fetch, config: { projectId: 'p', apiKey: 'k' } });
  const misCodigos = await leerMisCodigos(UID, { token, fetch: nube.fetch, config: { projectId: 'p', apiKey: 'k' } });
  return { cliente, ...(await prepararPaso(cliente, { uid: UID, alumnos, listar, opciones, misCodigos })) };
}

test('de punta a punta: registra, copia con los mismos ids y repetir no escribe nada', async () => {
  const nube = nubeFalsa(UID, sembrarAntiguo());
  const antes = new Map([...nube.docs].filter(([r]) => !r.startsWith('practicas-espacios/')));
  const alumnos = alumnosQuePasan([1, 2]);
  const { cliente, plan } = await pasoCompleto(nube, alumnos);
  assert.deepEqual(plan.bloqueos, []);
  const r = await ejecutarPaso(cliente, plan, { ahora: 5000 });
  assert.deepEqual(r.errores, []);
  assert.deepEqual([r.registrados, r.escritos, r.fallosCopiados, r.config], [3, 5, 1, true]);
  // Los códigos de siempre, a su nombre y con su número; AJJN con el 1000; el 60 no.
  assert.equal(nube.docs.get(`practicas-alumnos/${cod(1)}`).profesor.stringValue, UID);
  assert.equal(nube.docs.get('practicas-alumnos/AJJN').n.integerValue, '1000');
  assert.ok(!nube.docs.has(`practicas-alumnos/${cod(60)}`));
  assert.deepEqual(nube.docs.get(`practicas-espacios/${UID}/progreso-libre/recta--${cod(1)}`), ORIGEN()['progreso-libre'][0].fields);
  assert.ok(nube.docs.has(`practicas-espacios/${UID}/progreso-tareas/t2--criba--${cod(1)}`));
  assert.ok(nube.docs.has(`practicas-espacios/${UID}/fallos/${cod(1)}-k1a2b3-aaaa`));
  assert.ok(!nube.docs.has(`practicas-espacios/${UID}/fallos/${cod(60)}-k1a2b3-bbbb`));
  const config = configDeJSON(nube.docs.get(`practicas-espacios/${UID}/config/tareas`).json.stringValue);
  assert.equal(config.tareas[0].progresoPorPractica, true);
  assert.equal(config.longitudCodigo, 4);
  // El modo antiguo no se toca.
  for (const [ruta, fields] of antes) assert.deepEqual(nube.docs.get(ruta), fields, ruta);
  // Repetir: plan vacío y ninguna escritura.
  const { cliente: c2, plan: otra } = await pasoCompleto(nube, alumnos);
  assert.ok(planVacio(otra), resumenDelPlan(otra).join(' | '));
  nube.peticiones.length = 0;
  const r2 = await ejecutarPaso(c2, otra);
  assert.deepEqual([r2.registrados, r2.escritos, r2.fallosCopiados, r2.config], [0, 0, 0, false]);
  assert.ok(!nube.peticiones.some(p => /^(PATCH|POST) /.test(p)), nube.peticiones.join(', '));
});

test('lo escrito en el modo antiguo después del paso se recoge al repetir, sin retroceder lo del espacio', async () => {
  const nube = nubeFalsa(UID, sembrarAntiguo());
  const alumnos = alumnosQuePasan([1, 2], { conPrueba: false });
  let { cliente, plan } = await pasoCompleto(nube, alumnos);
  await ejecutarPaso(cliente, plan);
  // El alumno 2 sigue en el espacio (más puntos) y, con una pestaña vieja, también en el antiguo (otro ejercicio).
  nube.docs.set(`practicas-espacios/${UID}/progreso-libre/semaforo--${cod(2)}`, progreso([ej(9)], 900));
  nube.docs.set(`practicas/semaforo--${cod(2)}`, progreso([ej(5), ej(10, true)], 950));
  ({ cliente, plan } = await pasoCompleto(nube, alumnos));
  assert.equal(plan.escrituras.length, 1);
  await ejecutarPaso(cliente, plan);
  const final = ejDe(nube.docs.get(`practicas-espacios/${UID}/progreso-libre/semaforo--${cod(2)}`));
  assert.deepEqual(final.map(e => [e.puntos, e.terminado]), [[9, false], [10, true]]);
});

test('el orden importa: sin registrar no se puede copiar (las reglas lo impiden), y un código ajeno no se copia', async () => {
  const nube = nubeFalsa(UID, { ...sembrarAntiguo(), [`practicas-alumnos/${cod(2)}`]: { profesor: { stringValue: OTRO }, n: { integerValue: '2' }, alta: { integerValue: '1' } } });
  const cliente = crearClienteRest({ token: async () => 't', fetch: nube.fetch, config: { projectId: 'p', apiKey: 'k' } });
  await assert.rejects(cliente.escribir(`practicas-espacios/${UID}/progreso-libre/recta--${cod(1)}`, progreso([ej(1)])), e => e.status === 403);
  // Un plan con el n.º 2 ajeno está bloqueado; ejecutarlo a la fuerza no escribe.
  const { plan } = await pasoCompleto(nube, alumnosQuePasan([1, 2], { conPrueba: false }));
  assert.match(plan.bloqueos.join(), /otro profesor/);
  await assert.rejects(ejecutarPaso(cliente, plan), /bloqueos/);
  assert.ok(![...nube.docs.keys()].some(r => r.startsWith('practicas-espacios/')));
});

test('sin poder listar (profesor de prueba): el origen se lee documento a documento y los fallos no se copian', async () => {
  const nube = nubeFalsa(UID, sembrarAntiguo());
  const alumnos = alumnosQuePasan([1], { conPrueba: false });
  const { cliente, plan } = await pasoCompleto(nube, alumnos, { config: 'no' }, false);
  assert.equal(plan.config, null);
  assert.deepEqual(plan.escrituras.map(w => w.id).sort(), [`recta--${cod(1)}`, `t2--criba--${cod(1)}`].sort());
  assert.equal(plan.fallos.length, 0);
  const r = await ejecutarPaso(cliente, plan);
  assert.deepEqual([r.registrados, r.escritos, r.config], [1, 2, false]);
});

// --- Alrededor del paso ------------------------------------------------------------------

test('el editor conserva progresoPorPractica de la tarea 1 al guardarla (y sus ejercicios si ya empezó)', () => {
  const t1 = configDeJuanLuis().tareas[0];
  const editada = tareaDeFormulario(t1, { tituloEs: 'Otra', tituloEn: 'Other', unidad: 2, desde: t1.desde, hasta: '2026-10-23', asignada: false, nElegir: 4, marcas: [] });
  assert.equal(editada.progresoPorPractica, true);
  const guardada = conservarSiBloqueada(t1, editada, '2026-10-19');
  assert.deepEqual(guardada.estrella, t1.estrella);
  assert.equal(guardada.progresoPorPractica, true);
  assert.equal(tareaDeFormulario({ id: 9 }, { tituloEs: 'x', tituloEn: 'x', unidad: 2, nElegir: 0, marcas: [] }).progresoPorPractica, undefined);
});

test('informe: los códigos de siempre con --alumnos y los de 4 en el CSV (de su columna o del enlace, nunca un nombre)', () => {
  assert.deepEqual(listaDeSiempre(2), [{ numero: 1, codigo: cod(1) }, { numero: 2, codigo: cod(2) }]);
  const csv = `N.º,Alumno,Código,Enlace\n1,"Prueba, Juan",${cod(1)},https://x/?c=${cod(1)}\n2;Juan;${cod(2)};x\n3,Ana,,https://x/semana.html?t=1&c=${cod(3)}\n4,Juan,K7QM-P3XA,`;
  assert.deepEqual(leerCsvCodigos(csv), [{ numero: 1, codigo: cod(1) }, { numero: 2, codigo: cod(2) }, { numero: 3, codigo: cod(3) }, { numero: 4, codigo: 'K7QMP3XA' }]);
  assert.deepEqual(leerCsvCodigos('5,Juan,,'), [], '«Juan» no es un código');
});

test('panel: la sección solo para el administrador, montada desde profesor.js, y confirmación escrita', () => {
  const html = readFileSync(new URL('../practicas/profesor.html', import.meta.url), 'utf8');
  assert.match(html, /<section class="tarjeta" id="seccion-migracion" hidden>/);
  const js = readFileSync(new URL('../practicas/profesor.js', import.meta.url), 'utf8');
  assert.match(js, /\$\('seccion-migracion'\)\.hidden = !esAdmin;/);
  assert.match(js, /if \(esAdmin && !migracionMontada\)/);
  assert.equal(PALABRA, 'PASAR');
  const mig = readFileSync(new URL('../practicas/profesor-migracion.js', import.meta.url), 'utf8');
  assert.ok(!/deleteDoc|method: 'DELETE'|'DELETE'/.test(mig), 'la herramienta no borra nada (eso es la tarea 71)');
});
