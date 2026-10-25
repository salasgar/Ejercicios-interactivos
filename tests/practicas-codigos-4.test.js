// Códigos de 4 u 8 caracteres y el sistema decidido por la nube (tareas 72 y 71 del
// reparto PU2). Juan Luis pasó a su espacio con los códigos de 4 de siempre (la tarea
// 70 los registró en `practicas-alumnos`), y la tarea 71 quitó el modo antiguo: un
// código vale si la nube lo conoce, sea de 4 o de 8. Aquí se comprueba de punta a
// punta, con la `resolverCodigo` de verdad y un `fetch` de mentira, que:
//  - un código de 4 registrado (el 62, XY4Z, en el espacio de un profesor de prueba)
//    entra en su espacio y ve su progreso;
//  - uno de 4 sin registrar (el 60, 7NPD) no existe: ya no cae en las colecciones viejas;
//  - uno de 8 sigue igual;
//  - uno de 4 generado al azar, igual que uno de 8;
//  - nadie decide el sistema por la longitud del código.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { codigoAlumno, codigoSecreto, leerCodigoAlumno } from '../practicas/_comun/codigos.js';
import { resolverCodigo } from '../practicas/_comun/espacio.js';
import { ubicacionProgreso, sincronizarGuardado, progresoGuardado } from '../practicas/_comun/base.js';
import { coleccionFallo, datosFallo } from '../practicas/_comun/registro.js';
import { configAJSON, TAREAS } from '../practicas/_comun/tareas.js';
import { identificar } from '../practicas/vista-tareas.js';

const CONFIG = { apiKey: 'clave', projectId: 'proyecto' };
const UID = 'uidProfesorPrueba1';
const N_PRUEBA = 60;
const PRUEBA = codigoAlumno(N_PRUEBA - 1);   // 7NPD, el código de prueba 60 (nunca el de un alumno)
const N_REGISTRADO = 62;
const REGISTRADO = codigoAlumno(N_REGISTRADO - 1);   // XY4Z, el código de prueba 62, registrado en el espacio de A
const CONFIG_A = { unidades: [{ n: 2, desde: '2026-10-13' }], tareas: [{ ...TAREAS[1], id: 2 }] };

function almacenFalso() {
  const datos = new Map();
  return { datos, getItem: k => datos.get(k) ?? null, setItem: (k, v) => { datos.set(k, String(v)); }, removeItem: k => { datos.delete(k); } };
}

const docEstado = ej => ({ fields: { estado: { stringValue: JSON.stringify({ v: 1, idioma: 'alterno', ej }) }, actualizado: { integerValue: '1' } } });

/**
 * La nube con los códigos registrados que se le den ({ código: n }) en el espacio de UID
 * y los documentos de progreso que se le den ({ ruta: ej }). Sin regla para las
 * colecciones viejas (tarea 71): pedir una da 403, como el Firestore de verdad.
 */
function nube(registrados = {}, progreso = {}) {
  const pedidos = [];
  const VIEJAS = ['practicas', 'practicas-tareas', 'practicas-asignaciones', 'fallos', 'divisores'];
  const fetch = async (url, opciones = {}) => {
    const ruta = new URL(url).pathname.split('/documents/')[1];
    pedidos.push(ruta);
    const [coleccion, id] = ruta.split('/');
    if (VIEJAS.includes(coleccion)) return { ok: false, status: 403, json: async () => ({}) };
    if (opciones.method === 'PATCH') { progreso[ruta] = JSON.parse(JSON.parse(opciones.body).fields.estado.stringValue).ej; return { ok: true, status: 200, json: async () => ({}) }; }
    if (coleccion === 'practicas-alumnos' && id in registrados) {
      return { ok: true, status: 200, json: async () => ({ fields: { profesor: { stringValue: UID }, n: { integerValue: String(registrados[id]) }, alta: { integerValue: '1' } } }) };
    }
    if (ruta === `practicas-espacios/${UID}/config/tareas`) {
      return { ok: true, status: 200, json: async () => ({ fields: { json: { stringValue: configAJSON(CONFIG_A) } } }) };
    }
    if (ruta in progreso) return { ok: true, status: 200, json: async () => docEstado(progreso[ruta]) };
    return { ok: false, status: 404, json: async () => ({}) };
  };
  return { fetch, pedidos, progreso };
}

const resolverCon = (n, almacen) => codigo => resolverCodigo(codigo, { fetch: n.fetch, almacen, config: CONFIG });
const FALLO = { slug: 'semaforo', ejercicio: 1, idioma: 'es', item: { n: 51 }, html: '<p>51 = 3 · 17</p>', t: Date.UTC(2026, 9, 24), dia: 300 };
const terminado = { terminado: true, puntos: 10, objetivo: 10, aciertos: 10, fallos: 1, vidas: 4 };

function conAlmacen(fn) {
  const almacen = almacenFalso();
  globalThis.localStorage = almacen;
  return Promise.resolve(fn(almacen)).finally(() => { delete globalThis.localStorage; });
}

test('tarea 71: un código de 4 registrado (el 62) entra en su espacio y ve su progreso', () => conAlmacen(async almacen => {
  const ruta = `practicas-espacios/${UID}/progreso-libre/semaforo--${REGISTRADO}`;
  const n = nube({ [REGISTRADO]: N_REGISTRADO }, { [ruta]: [terminado, null] });
  const c = await identificar(REGISTRADO, { resolver: resolverCon(n, almacen) });
  assert.equal(c.profesor, UID);
  assert.equal(c.indice, N_REGISTRADO);
  assert.deepEqual(c.tareas, CONFIG_A.tareas);
  // Lo que hizo en otro aparato llega a este navegador (como en la página de la tarea).
  const lectura = await sincronizarGuardado('semaforo', c.codigo, { profesor: c.profesor, fetch: n.fetch, config: CONFIG });
  assert.equal(lectura.estado, 'ok');
  assert.equal(progresoGuardado('semaforo', c.codigo)[0].terminado, true);
  assert.ok(n.pedidos.every(p => p.startsWith('practicas-alumnos/') || p.startsWith(`practicas-espacios/${UID}/`)), `nada fuera de su espacio: ${n.pedidos.join(', ')}`);
}));

test('tarea 71: un código de 4 sin registrar (el 60) no existe, y no deja nada en el navegador', async () => {
  const n = nube();
  const almacen = almacenFalso();
  assert.deepEqual(await identificar(PRUEBA, { resolver: resolverCon(n, almacen) }), { error: 'no-existe' });
  assert.deepEqual(n.pedidos, [`practicas-alumnos/${PRUEBA}`], 'una sola pregunta, y por su propio código');
  assert.equal(almacen.datos.size, 0);
  // Sin profesor no hay nube: ni las colecciones viejas ni «fallos».
  assert.equal(ubicacionProgreso('semaforo', PRUEBA).nube, null);
  assert.equal(ubicacionProgreso('semaforo', PRUEBA, 3).nube, null);
  assert.equal(coleccionFallo({ datos: datosFallo({ ...FALLO, codigo: PRUEBA }) }, almacen), null);
  // Y la página siguiente vuelve a preguntar (no se recuerda como «antiguo»).
  await identificar(PRUEBA, { resolver: resolverCon(n, almacen) });
  assert.equal(n.pedidos.length, 2);
});

test('tarea 71: un código de 8 sigue igual (registrado, a su espacio; sin registrar, no existe)', async () => {
  const OCHO = 'K7QMP3XA';
  const c = await identificar(OCHO, { resolver: resolverCon(nube({ [OCHO]: 5 }), almacenFalso()) });
  assert.deepEqual([c.codigo, c.profesor, c.indice], [OCHO, UID, 5]);
  assert.deepEqual(ubicacionProgreso('semaforo', OCHO, null, UID).nube, { coleccion: `practicas-espacios/${UID}/progreso-libre`, id: `semaforo--${OCHO}` });
  assert.deepEqual(await identificar(OCHO, { resolver: resolverCon(nube(), almacenFalso()) }), { error: 'no-existe' });
});

test('el mismo código, registrado en un espacio: su profesor, su número, sus tareas y su espacio', async () => {
  const n = nube({ [PRUEBA]: N_PRUEBA });
  const almacen = almacenFalso();
  const c = await identificar(PRUEBA.toLowerCase(), { resolver: resolverCon(n, almacen) });
  assert.equal(c.codigo, PRUEBA);
  assert.equal(c.profesor, UID);
  assert.equal(c.indice, N_PRUEBA, 'el número de lista (desde 1), como los de 8');
  assert.deepEqual(c.tareas, CONFIG_A.tareas);
  assert.deepEqual(ubicacionProgreso('semaforo', c.codigo, null, c.profesor).nube, { coleccion: `practicas-espacios/${UID}/progreso-libre`, id: `semaforo--${PRUEBA}` });
  assert.deepEqual(ubicacionProgreso('semaforo', c.codigo, 2, c.profesor).nube, { coleccion: `practicas-espacios/${UID}/progreso-tareas`, id: `t2--semaforo--${PRUEBA}` });
  // Los fallos, a su espacio: con el profesor del fallo o con la copia que dejó resolverCodigo.
  const datos = datosFallo({ ...FALLO, codigo: c.codigo });
  assert.equal(coleccionFallo({ datos, profesor: c.profesor }), `practicas-espacios/${UID}/fallos`);
  assert.equal(coleccionFallo({ datos }, almacen), `practicas-espacios/${UID}/fallos`);
  // Si deja de estar registrado (se borra), no existe y se olvida la copia: sus fallos esperan.
  const otra = nube();
  assert.deepEqual(await identificar(PRUEBA, { resolver: resolverCon(otra, almacen) }), { error: 'no-existe' });
  assert.equal(coleccionFallo({ datos }, almacen), null);
});

test('un código de 4 generado al azar es como uno de 8', async () => {
  const generado = codigoSecreto(4);
  assert.equal(leerCodigoAlumno(generado), null);
  // Sin profesor conocido (sin red al entrar): ni nube ni «fallos», solo el navegador y la cola.
  assert.equal(ubicacionProgreso('semaforo', generado).nube, null);
  assert.equal(ubicacionProgreso('semaforo', generado, 2).nube, null);
  assert.equal(coleccionFallo({ datos: datosFallo({ ...FALLO, codigo: generado }) }, almacenFalso()), null);
  // Registrado: su espacio. No registrado: no existe.
  const n = nube({ [generado]: 3 });
  const c = await identificar(generado, { resolver: resolverCon(n, almacenFalso()) });
  assert.equal(c.profesor, UID);
  assert.equal(c.indice, 3);
  assert.deepEqual(await identificar(generado, { resolver: resolverCon(nube(), almacenFalso()) }), { error: 'no-existe' });
});

test('nadie decide ya el sistema por la longitud del código', () => {
  const ficheros = [
    ...readdirSync(new URL('../practicas/', import.meta.url)).filter(f => f.endsWith('.js')).map(f => `practicas/${f}`),
    ...readdirSync(new URL('../practicas/_comun/', import.meta.url)).filter(f => f.endsWith('.js')).map(f => `practicas/_comun/${f}`),
  ];
  for (const f of ficheros) {
    const texto = readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
    assert.doesNotMatch(texto, /modoDeCodigo/, `${f}: modoDeCodigo ya no existe (formatoDeCodigo + resolverCodigo)`);
    if (f !== 'practicas/_comun/codigos.js') assert.doesNotMatch(texto, /LONGITUD_SECRETO/, `${f}: la longitud no dice el sistema`);
  }
});

test('reglas: la sección de varios profesores acepta códigos de 4 u 8 y números hasta 1023; el modo antiguo ya no tiene reglas', () => {
  const reglas = readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8');
  const corte = reglas.indexOf('// ===== Varios profesores');
  const antiguo = reglas.slice(0, corte);
  const nuevo = reglas.slice(corte);
  // Ningún {8} suelto en la sección nueva: todo pasa por 4 u 8.
  assert.doesNotMatch(nuevo, /Z2-9\]\{8\}/);
  const patron = new RegExp(nuevo.match(/function codigoSecreto\(c\) \{\s*return c is string && c\.matches\('([^']+)'\)/)[1]);
  for (const bueno of [PRUEBA, 'K7QM', 'K7QMP3XA', codigoSecreto(4), codigoSecreto(8)]) assert.match(bueno, patron);
  for (const malo of ['K7Q', 'K7QMP', 'K7QMP3X', 'K7QMP3XAB', 'K7Q0', 'k7qm', '']) assert.doesNotMatch(malo, patron);
  const doc = new RegExp(nuevo.slice(nuevo.indexOf('match /progreso-libre/')).match(/doc\.matches\('([^']+)'\)/)[1]);
  for (const id of [`semaforo--${PRUEBA}`, 'semaforo--K7QMP3XA']) assert.match(id, doc);
  assert.doesNotMatch('semaforo--K7QMP', doc);
  const tarea = new RegExp(nuevo.slice(nuevo.indexOf('match /progreso-tareas/')).match(/doc\.matches\('([^']+)'\)/)[1]);
  for (const id of [`t2--semaforo--${PRUEBA}`, 't2--semaforo--K7QMP3XA']) assert.match(id, tarea);
  const fallo = new RegExp(nuevo.slice(nuevo.indexOf('match /fallos/{id}')).match(/id\.matches\('([^']+)'\)/)[1]);
  for (const id of [`${PRUEBA}-mgx1abc-a1b2`, 'K7QMP3XA-mgx1abc-a1b2']) assert.match(id, fallo);
  assert.doesNotMatch('K7QMP-mgx1abc-a1b2', fallo);
  // practicas-alumnos: n de 1 a 1023 al crear y al cambiar (AJJN, el alumno de prueba de Juan Luis, es el 1000).
  const alumnos = nuevo.slice(nuevo.indexOf('match /practicas-alumnos/'), nuevo.indexOf('match /practicas-espacios/'));
  assert.equal((alumnos.match(/request\.resource\.data\.n >= 1 && request\.resource\.data\.n <= 1023/g) ?? []).length, 2);
  assert.doesNotMatch(alumnos, /<= 250/);
  // Antes de la sección nueva solo queda la aplicación antigua de src/: ninguna colección del modo antiguo de las prácticas (tarea 71).
  for (const vieja of ['divisores', 'practicas', 'practicas-tareas', 'practicas-asignaciones', 'fallos']) {
    assert.doesNotMatch(antiguo, new RegExp(`match /${vieja}/\\{`), `${vieja} sin regla: Firestore la deniega`);
  }
});
