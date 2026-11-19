// Caché local de lecturas de Firestore de las herramientas del profesor (tarea 210 de PU2):
// primera lectura completa, después solo lo nuevo con el margen de 2 días, nada si es reciente,
// completa otra vez cada 7 días, caché corrupta o de otra versión → completa, ninguna caché a
// medias si una lectura falla, y la carpeta siempre fuera del repositorio (es público).
// Sin Firestore: las lecturas son funciones de mentira. Los códigos son inventados.

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, statSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  leerConCache, rutaCache, ficheroCache, cargarCache, desdeIncremental, dentroDe, RAIZ_REPO, VERSION_CACHE,
  MARGEN_LECTURA, FRESCURA_MS, DIAS_LECTURA_COMPLETA, textoLectura,
} from '../herramientas/cache-lecturas.mjs';
import { ErrorFirestore, leerEspacio } from '../herramientas/informe-actividad.mjs';

const UID = 'AbC123profesor';
const DIA = 86400000;
const T0 = Date.UTC(2026, 10, 19, 10, 0);
const carpeta = () => mkdtempSync(join(tmpdir(), 'cache-lecturas-'));

/** Una nube de mentira: documentos por subcolección; cuenta lo que se pide. */
function nube(inicial) {
  const datos = Object.fromEntries(Object.entries(inicial).map(([s, l]) => [s, new Map(l.map(d => [d.id, d]))]));
  const pedidos = [];
  return {
    datos, pedidos,
    poner: (sub, d) => datos[sub].set(d.id, d),
    leerTodoDe: async sub => { pedidos.push(['todo', sub]); return [...datos[sub].values()]; },
    leerDesdeDe: async (sub, desde) => { pedidos.push(['desde', sub, desde]); return [...datos[sub].values()].filter(d => d.actualizado > desde); },
  };
}

const doc = (id, actualizado) => ({ id, estado: '{"ej":[]}', actualizado });

test('caché: la primera vez lee todo y la guarda (600, en carpeta 700); la segunda pide solo lo nuevo, con 2 días de margen', async () => {
  const dir = carpeta();
  const n = nube({ 'progreso-libre': [doc('recta--K7QM', T0 - 5 * DIA), doc('recta--H2N8', T0 - DIA)], 'progreso-tareas': [doc('t3--recta--K7QM', T0 - 3 * DIA)] });
  const subs = ['progreso-libre', 'progreso-tareas'];
  const r1 = await leerConCache({ uid: UID, subs, dir, ahora: T0, leerTodoDe: n.leerTodoDe, leerDesdeDe: n.leerDesdeDe });
  assert.deepEqual(n.pedidos, [['todo', 'progreso-libre'], ['todo', 'progreso-tareas']]);
  assert.deepEqual(Object.values(r1.informe).map(i => i.modo), ['completa', 'completa']);
  assert.equal(r1.pedidos, 3);
  const f = ficheroCache(dir, UID);
  assert.equal(statSync(f).mode & 0o777, 0o600);
  assert.equal(statSync(dir).mode & 0o777, 0o700);

  // Un documento nuevo y uno cambiado; una hora después.
  n.poner('progreso-libre', doc('recta--H2N8', T0 + 30 * 60000));
  n.poner('progreso-tareas', doc('t3--suma--P4RT', T0 + 40 * 60000));
  n.pedidos.length = 0;
  const T1 = T0 + 3600000;
  const r2 = await leerConCache({ uid: UID, subs, dir, ahora: T1, leerTodoDe: n.leerTodoDe, leerDesdeDe: n.leerDesdeDe });
  assert.deepEqual(n.pedidos.map(p => p.slice(0, 2)), [['desde', 'progreso-libre'], ['desde', 'progreso-tareas']], 'solo consultas incrementales');
  // Desde: lo último visto (mín. entre el actualizado más reciente y la hora de la lectura anterior) − 2 días.
  assert.equal(n.pedidos[0][2], T0 - DIA - MARGEN_LECTURA);
  assert.equal(n.pedidos[1][2], T0 - 3 * DIA - MARGEN_LECTURA);
  assert.equal(MARGEN_LECTURA, 2 * DIA);
  assert.deepEqual(r2.docs['progreso-libre'].map(d => [d.id, d.actualizado]).sort(), [['recta--H2N8', T0 + 30 * 60000], ['recta--K7QM', T0 - 5 * DIA]]);
  assert.equal(r2.docs['progreso-tareas'].length, 2);
  assert.equal(r2.informe['progreso-libre'].modo, 'incremental');
  assert.match(textoLectura(r2), /solo lo nuevo/);
  rmSync(dir, { recursive: true });
});

test('caché: un aparato con el reloj adelantado no deja fuera lo de los demás (el desde no pasa de la última lectura)', () => {
  const entrada = { completa: T0, leida: T0, docs: [doc('a--K7QM', T0 + 365 * DIA), doc('b--K7QM', T0 - DIA)] };
  assert.equal(desdeIncremental(entrada), T0 - MARGEN_LECTURA);
  assert.equal(desdeIncremental({ completa: T0, leida: T0, docs: [] }), T0 - MARGEN_LECTURA, 'sin documentos: desde la última lectura');
});

test('caché: con una lectura de hace menos de 10 min no se pide nada (freno a los bucles), y se dice', async () => {
  const dir = carpeta();
  const n = nube({ 'progreso-libre': [doc('recta--K7QM', T0)] });
  await leerConCache({ uid: UID, subs: ['progreso-libre'], dir, ahora: T0, leerTodoDe: n.leerTodoDe, leerDesdeDe: n.leerDesdeDe });
  const antes = readFileSync(ficheroCache(dir, UID), 'utf8');
  n.pedidos.length = 0;
  for (let i = 1; i <= 35; i++) {
    const r = await leerConCache({ uid: UID, subs: ['progreso-libre'], dir, ahora: T0 + i * 1000, leerTodoDe: n.leerTodoDe, leerDesdeDe: n.leerDesdeDe });
    assert.equal(r.informe['progreso-libre'].modo, 'cache');
    assert.equal(r.pedidos, 0);
  }
  assert.equal(n.pedidos.length, 0, '35 ejecuciones seguidas: ninguna lectura');
  assert.equal(readFileSync(ficheroCache(dir, UID), 'utf8'), antes, 'ni se reescribe');
  const r = await leerConCache({ uid: UID, subs: ['progreso-libre'], dir, ahora: T0 + FRESCURA_MS + 1, leerTodoDe: n.leerTodoDe, leerDesdeDe: n.leerDesdeDe });
  assert.equal(r.informe['progreso-libre'].modo, 'incremental');
  assert.match(textoLectura({ informe: { 'progreso-libre': { modo: 'cache', pedidos: 0, edad: 4 * 60000 } }, pedidos: 0 }), /de la caché \(leída hace 4 min\)/);
  rmSync(dir, { recursive: true });
});

test('caché: lectura completa a los 7 días (borrados), con leerTodo, y si falta una subcolección', async () => {
  const dir = carpeta();
  const n = nube({ 'progreso-libre': [doc('recta--K7QM', T0), doc('recta--H2N8', T0)], asignaciones: [doc('K7QM', T0)] });
  const op = { uid: UID, dir, leerTodoDe: n.leerTodoDe, leerDesdeDe: n.leerDesdeDe };
  await leerConCache({ ...op, subs: ['progreso-libre'], ahora: T0 });
  // Un alumno dado de baja: su documento desaparece. La incremental no lo ve…
  n.datos['progreso-libre'].delete('recta--H2N8');
  const r1 = await leerConCache({ ...op, subs: ['progreso-libre'], ahora: T0 + DIA });
  assert.equal(r1.docs['progreso-libre'].length, 2);
  // …la completa de los 7 días sí.
  const r2 = await leerConCache({ ...op, subs: ['progreso-libre'], ahora: T0 + DIAS_LECTURA_COMPLETA * DIA + 1 });
  assert.equal(r2.informe['progreso-libre'].modo, 'completa');
  assert.deepEqual(r2.docs['progreso-libre'].map(d => d.id), ['recta--K7QM']);
  // leerTodo fuerza la completa aunque sea reciente.
  const r3 = await leerConCache({ ...op, subs: ['progreso-libre'], ahora: T0 + DIAS_LECTURA_COMPLETA * DIA + 2, leerTodo: true });
  assert.equal(r3.informe['progreso-libre'].modo, 'completa');
  // Una subcolección que no estaba en la caché se lee entera; la que estaba, no.
  n.pedidos.length = 0;
  const r4 = await leerConCache({ ...op, subs: ['progreso-libre', 'asignaciones'], ahora: T0 + DIAS_LECTURA_COMPLETA * DIA + 3 * FRESCURA_MS });
  assert.deepEqual([r4.informe['progreso-libre'].modo, r4.informe.asignaciones.modo], ['incremental', 'completa']);
  rmSync(dir, { recursive: true });
});

test('caché: corrupta, de otra versión, de otro espacio o con la hora en el futuro → lectura completa', async () => {
  const dir = carpeta();
  const n = nube({ 'progreso-libre': [doc('recta--K7QM', T0)] });
  const op = { uid: UID, subs: ['progreso-libre'], dir, ahora: T0, leerTodoDe: n.leerTodoDe, leerDesdeDe: n.leerDesdeDe };
  const f = ficheroCache(dir, UID);
  const buena = sub => ({ version: VERSION_CACHE, uid: UID, subs: { 'progreso-libre': sub } });
  const casos = [
    'esto no es JSON',
    JSON.stringify({ ...buena({ completa: T0, leida: T0, docs: [] }), version: VERSION_CACHE + 1 }),
    JSON.stringify({ ...buena({ completa: T0, leida: T0, docs: [] }), uid: 'OtroProfesor' }),
    JSON.stringify(buena({ completa: T0, leida: T0, docs: 'no es lista' })),
    JSON.stringify(buena({ completa: T0, leida: T0, docs: [{ sinId: true }] })),
    JSON.stringify(buena({ completa: T0 + DIA, leida: T0 + DIA, docs: [] })),
  ];
  for (const contenido of casos) {
    writeFileSync(f, contenido);
    n.pedidos.length = 0;
    const r = await leerConCache(op);
    assert.equal(r.informe['progreso-libre'].modo, 'completa', contenido.slice(0, 60));
    assert.deepEqual(n.pedidos, [['todo', 'progreso-libre']]);
    assert.equal(r.docs['progreso-libre'].length, 1);
  }
  assert.deepEqual(cargarCache(join(dir, 'no-existe'), UID).subs, {});
  rmSync(dir, { recursive: true });
});

test('caché: un 429 o un 500 en cualquier lectura lanza y NO toca la caché (ni la crea)', async () => {
  for (const status of [429, 500]) {
    const dir = carpeta();
    const f = ficheroCache(dir, UID);
    const n = nube({ 'progreso-libre': [doc('recta--K7QM', T0)], 'progreso-tareas': [doc('t3--recta--K7QM', T0)] });
    const falla = async sub => { if (sub === 'progreso-tareas') throw new ErrorFirestore(status, sub); return n.leerTodoDe(sub); };
    const subs = ['progreso-libre', 'progreso-tareas'];
    // Sin caché: no se crea a medias.
    await assert.rejects(leerConCache({ uid: UID, subs, dir, ahora: T0, leerTodoDe: falla, leerDesdeDe: n.leerDesdeDe }), e => e.motivo === (status === 429 ? 'cuota' : 'servidor'));
    assert.equal(existsSync(f), false, `HTTP ${status}: ninguna caché a medias`);
    // Con caché: queda como estaba.
    await leerConCache({ uid: UID, subs, dir, ahora: T0, leerTodoDe: n.leerTodoDe, leerDesdeDe: n.leerDesdeDe });
    const antes = readFileSync(f, 'utf8');
    n.poner('progreso-libre', doc('recta--H2N8', T0 + DIA));
    const fallaDesde = async (sub, desde) => { if (sub === 'progreso-tareas') throw new ErrorFirestore(status, sub); return n.leerDesdeDe(sub, desde); };
    await assert.rejects(leerConCache({ uid: UID, subs, dir, ahora: T0 + DIA, leerTodoDe: n.leerTodoDe, leerDesdeDe: fallaDesde }), ErrorFirestore);
    assert.equal(readFileSync(f, 'utf8'), antes, `HTTP ${status}: la caché no cambia, ni con lo que sí se leyó`);
    rmSync(dir, { recursive: true });
  }
});

test('caché: la carpeta por defecto cuelga de ~/.claude, nunca del repositorio (es público); dentro del repo, se niega', async () => {
  const porDefecto = rutaCache({});
  assert.ok(porDefecto.endsWith(join('.claude', 'cache', 'firestore-practicas')));
  assert.equal(dentroDe(porDefecto, RAIZ_REPO), false, 'la ruta por defecto no está en el repo');
  assert.equal(rutaCache({}, '/casa/de/alguien'), '/casa/de/alguien/.claude/cache/firestore-practicas');
  assert.equal(rutaCache({ CACHE_LECTURAS_FIRESTORE: '/otra/parte' }), '/otra/parte');
  assert.throws(() => rutaCache({ CACHE_LECTURAS_FIRESTORE: join(RAIZ_REPO, 'tmp-cache') }), /dentro del repositorio/);
  assert.throws(() => rutaCache({}, join(RAIZ_REPO, 'x')), /dentro del repositorio/, 'ni con una casa dentro del repo');
  await assert.rejects(leerConCache({ uid: UID, subs: [], dir: join(RAIZ_REPO, 'herramientas'), leerTodoDe: async () => [], leerDesdeDe: async () => [] }), /dentro del repositorio/);
  assert.equal(dentroDe('/a/b/c', '/a/b'), true);
  assert.equal(dentroDe('/a/bc', '/a/b'), false);
  assert.throws(() => ficheroCache('/x', '../fuera'), /uid de profesor no válido/);
});

test('leerEspacio con caché (210): la primera vez listados; la segunda, runQuery con where; un 429 para sin caché a medias', async () => {
  const dir = carpeta();
  const config = { projectId: 'p' };
  const nombre = (sub, id) => `projects/p/databases/(default)/documents/practicas-espacios/${UID}/${sub}/${id}`;
  const fila = (sub, id, a) => ({ name: nombre(sub, id), fields: { estado: { stringValue: '{"ej":[]}' }, actualizado: { integerValue: String(a) } } });
  const urls = [];
  let cuota = false;
  const pedir = async (url, op = {}) => {
    urls.push([op.method ?? 'GET', url]);
    if (cuota) return { ok: false, status: 429, json: async () => ({}) };
    if (url.endsWith(':runQuery')) return { ok: true, status: 200, json: async () => [{ document: fila(JSON.parse(op.body).structuredQuery.from[0].collectionId, 'recta--H2N8', T0) }] };
    const sub = url.split('/').at(-1).split('?')[0];
    return { ok: true, status: 200, json: async () => ({ documents: [fila(sub, 'recta--K7QM', T0 - DIA)] }) };
  };
  const subs = ['progreso-libre', 'progreso-tareas'];
  const r1 = await leerEspacio(UID, subs, 'T', { cache: true, pedir, config, dir, ahora: T0 });
  assert.ok(urls.every(([m, u]) => m === 'GET' && u.includes('?pageSize=300')));
  assert.equal(r1.lectura.pedidos, 2);
  urls.length = 0;
  const r2 = await leerEspacio(UID, subs, 'T', { cache: true, pedir, config, dir, ahora: T0 + 3600000 });
  assert.ok(urls.length === 2 && urls.every(([m, u]) => m === 'POST' && u.endsWith(`practicas-espacios/${UID}:runQuery`)));
  assert.deepEqual(r2.docs['progreso-libre'].map(d => d.id).sort(), ['recta--H2N8', 'recta--K7QM']);
  const antes = readFileSync(ficheroCache(dir, UID), 'utf8');
  cuota = true;
  await assert.rejects(leerEspacio(UID, subs, 'T', { cache: true, pedir, config, dir, ahora: T0 + 2 * 3600000 }), /Cuota de Firestore agotada/);
  assert.equal(readFileSync(ficheroCache(dir, UID), 'utf8'), antes);
  rmSync(dir, { recursive: true });
});
