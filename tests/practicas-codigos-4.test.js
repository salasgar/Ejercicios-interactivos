// Códigos de 4 u 8 caracteres y el modo decidido por la nube (tarea 72 del reparto
// PU2). Juan Luis pasa al sistema nuevo con los códigos de 4 de siempre (la tarea 70
// los registra en `practicas-alumnos`), así que un código de 4 ya no dice por sí solo
// a qué sistema pertenece: lo dice la nube. Aquí se comprueba de punta a punta, con
// la `resolverCodigo` de verdad y un `fetch` de mentira, que:
//  - un código antiguo que la nube no conoce sigue EXACTAMENTE como hoy (mismo
//    contexto, mismas colecciones, mismos fallos);
//  - el mismo código, registrado, va al espacio de su profesor;
//  - uno de 4 generado al azar nunca acaba en las colecciones del modo antiguo
//    (sus reglas aceptan cualquier código de 4 símbolos);
//  - nadie decide ya el sistema por la longitud del código.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { codigoAlumno, codigoSecreto, leerCodigoAlumno } from '../practicas/_comun/codigos.js';
import { resolverCodigo } from '../practicas/_comun/espacio.js';
import { ubicacionProgreso } from '../practicas/_comun/base.js';
import { coleccionFallo, datosFallo } from '../practicas/_comun/registro.js';
import { configAJSON, TAREAS } from '../practicas/_comun/tareas.js';
import { identificar, contextoAntiguo } from '../practicas/vista-tareas.js';

const CONFIG = { apiKey: 'clave', projectId: 'proyecto' };
const UID = 'uidProfesorPrueba1';
const N_PRUEBA = 60;
const PRUEBA = codigoAlumno(N_PRUEBA - 1);   // 7NPD, el código de prueba 60 (nunca el de un alumno)
const CONFIG_A = { unidades: [{ n: 2, desde: '2026-10-13' }], tareas: [{ ...TAREAS[1], id: 2 }] };

function almacenFalso() {
  const datos = new Map();
  return { datos, getItem: k => datos.get(k) ?? null, setItem: (k, v) => { datos.set(k, String(v)); }, removeItem: k => { datos.delete(k); } };
}

/** La nube con los códigos registrados que se le den ({ código: n }) en el espacio de UID. */
function nube(registrados = {}) {
  const pedidos = [];
  const fetch = async url => {
    const ruta = new URL(url).pathname.split('/documents/')[1];
    pedidos.push(ruta);
    const [coleccion, id] = ruta.split('/');
    if (coleccion === 'practicas-alumnos' && id in registrados) {
      return { ok: true, status: 200, json: async () => ({ fields: { profesor: { stringValue: UID }, n: { integerValue: String(registrados[id]) }, alta: { integerValue: '1' } } }) };
    }
    if (ruta === `practicas-espacios/${UID}/config/tareas`) {
      return { ok: true, status: 200, json: async () => ({ fields: { json: { stringValue: configAJSON(CONFIG_A) } } }) };
    }
    return { ok: false, status: 404, json: async () => ({}) };
  };
  return { fetch, pedidos };
}

const resolverCon = (n, almacen) => codigo => resolverCodigo(codigo, { fetch: n.fetch, almacen, config: CONFIG });
const FALLO = { slug: 'semaforo', ejercicio: 1, idioma: 'es', item: { n: 51 }, html: '<p>51 = 3 · 17</p>', t: Date.UTC(2026, 9, 24), dia: 300 };

test('un código antiguo que la nube no conoce: todo exactamente como hoy', async () => {
  const n = nube();
  const almacen = almacenFalso();
  const c = await identificar(PRUEBA, { resolver: resolverCon(n, almacen) });
  assert.deepEqual(c, contextoAntiguo(N_PRUEBA - 1), 'el mismo contexto que antes de la tarea 72');
  assert.deepEqual(n.pedidos, [`practicas-alumnos/${PRUEBA}`], 'una sola pregunta, y por su propio código');
  // La base no pasa profesor (estado.espacio es null): las colecciones de siempre.
  assert.deepEqual(ubicacionProgreso('semaforo', c.codigo, null, c.profesor).nube, { coleccion: 'practicas', id: `semaforo--${PRUEBA}` });
  assert.deepEqual(ubicacionProgreso('semaforo', c.codigo, 3, c.profesor).nube, { coleccion: 'practicas-tareas', id: `t3--semaforo--${PRUEBA}` });
  assert.equal(coleccionFallo({ datos: datosFallo({ ...FALLO, codigo: c.codigo }) }, almacen), 'fallos');
  // La siguiente página no vuelve a preguntar.
  await identificar(PRUEBA, { resolver: resolverCon(n, almacen) });
  assert.equal(n.pedidos.length, 1);
});

test('el mismo código, registrado en un espacio: su profesor, su número, sus tareas y su espacio', async () => {
  const n = nube({ [PRUEBA]: N_PRUEBA });
  const almacen = almacenFalso();
  const c = await identificar(PRUEBA.toLowerCase(), { resolver: resolverCon(n, almacen) });
  assert.equal(c.modo, 'nuevo');
  assert.equal(c.codigo, PRUEBA);
  assert.equal(c.profesor, UID);
  assert.equal(c.indice, N_PRUEBA, 'en el sistema nuevo, el número de lista (desde 1), como los de 8');
  assert.deepEqual(c.tareas, CONFIG_A.tareas);
  assert.deepEqual(ubicacionProgreso('semaforo', c.codigo, null, c.profesor).nube, { coleccion: `practicas-espacios/${UID}/progreso-libre`, id: `semaforo--${PRUEBA}` });
  assert.deepEqual(ubicacionProgreso('semaforo', c.codigo, 2, c.profesor).nube, { coleccion: `practicas-espacios/${UID}/progreso-tareas`, id: `t2--semaforo--${PRUEBA}` });
  // Los fallos, a su espacio: con el profesor del fallo o con la copia que dejó resolverCodigo.
  const datos = datosFallo({ ...FALLO, codigo: c.codigo });
  assert.equal(coleccionFallo({ datos, profesor: c.profesor }), `practicas-espacios/${UID}/fallos`);
  assert.equal(coleccionFallo({ datos }, almacen), `practicas-espacios/${UID}/fallos`);
  // Si deja de estar registrado (se borra), vuelve al modo antiguo y se olvida la copia.
  const otra = nube();
  const d = await identificar(PRUEBA, { resolver: resolverCon(otra, almacen) });
  assert.deepEqual(d, contextoAntiguo(N_PRUEBA - 1));
  assert.equal(coleccionFallo({ datos }, almacen), 'fallos');
});

test('un código de 4 generado al azar nunca va a las colecciones del modo antiguo', async () => {
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

test('reglas: la sección de varios profesores acepta códigos de 4 u 8 y números hasta 1023; el modo antiguo no cambia', () => {
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
  // El modo antiguo sigue con sus códigos de 4 y nada más.
  assert.doesNotMatch(antiguo, /\{4\}\(\[A-HJ-NP-Z2-9\]\{4\}\)\?/);
  assert.match(antiguo, /match \/practicas\/\{doc\}[\s\S]*?doc\.matches\('\^\[a-z0-9-\]\+--\[A-HJ-NP-Z2-9\]\{4\}\$'\)/);
});
