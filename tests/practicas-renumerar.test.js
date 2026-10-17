// Quitar un ejercicio de una práctica sin descuadrar el progreso guardado
// (tarea 76 del reparto PU2: la Fábrica pierde su ejercicio 1, «Construye el
// divisor», el 2026-10-18).
//
// El progreso se guarda por posición (lista `ej`), en el navegador y en la nube.
// Una lista de 3 guardada antes del cambio tiene que leerse como la de 2 de
// ahora: el 2 de antes en el 1 y el 3 de antes en el 2. Se comprueba la función
// pura (`adaptarProgreso`, catalogo.js) y cada sitio que lee un `ej` guardado:
// el navegador (`progresoGuardado`), la nube y el espacio (`leerNube`,
// `subirFusionado`, `sincronizarGuardado`) y el panel (`leerDocumentos`).

import test from 'node:test';
import assert from 'node:assert/strict';
import { CATALOGO, practicaPorSlug, adaptarProgreso } from '../practicas/_comun/catalogo.js';
import { TAREAS, tareaPorId } from '../practicas/_comun/tareas.js';
import { codigoAlumno } from '../practicas/_comun/codigos.js';
import { fusionarProgreso, leerNube, escribirNube, subirFusionado, leerDocumentoRest, canonico } from '../practicas/_comun/nube.js';
import { sincronizarGuardado, claveProgreso, progresoGuardado } from '../practicas/_comun/base.js';
import { leerDocumentos } from '../practicas/resultados.js';

const CONFIG = { apiKey: 'clave', projectId: 'proyecto' };

/** Un ejercicio como lo guarda la base. */
const ej = (puntos, { terminado = false, fallos = 0, dia = 0 } = {}) => ({ puntos, objetivo: 10, vidas: 5, racha: 0, aciertos: puntos, fallos, reinicios: 0, terminado, dia });
// La lista de antes: construir (terminado), contar (a medias), sin dividir (empezado).
const CONSTRUIR = ej(10, { terminado: true, dia: 20380 });
const CONTAR = ej(6, { fallos: 2 });
const DIVISIBLE = ej(1, { fallos: 4 });
const ANTES = [CONSTRUIR, CONTAR, DIVISIBLE];

// --- La función pura ----------------------------------------------------------------

test('renumerar: la Fábrica tiene 2 ejercicios y declara que se le quitó el 1 de 3', () => {
  const f = practicaPorSlug('fabrica');
  assert.equal(f.nEjercicios, 2);
  assert.deepEqual(f.quitados, { antes: 3, posiciones: [1] });
});

test('renumerar: una lista de 3 de la Fábrica pasa a 2, con el 2 y el 3 de antes en su sitio nuevo', () => {
  assert.deepEqual(adaptarProgreso('fabrica', ANTES), [CONTAR, DIVISIBLE]);
  // Con huecos (ejercicios sin empezar en ese aparato) igual.
  assert.deepEqual(adaptarProgreso('fabrica', [null, null, DIVISIBLE]), [null, DIVISIBLE]);
  assert.deepEqual(adaptarProgreso('fabrica', [CONSTRUIR, null, null]), [null, null]);
});

test('renumerar: una lista de 2 (ya nueva) no cambia, ni ninguna otra cosa', () => {
  const nueva = [CONTAR, DIVISIBLE];
  assert.equal(adaptarProgreso('fabrica', nueva), nueva, 'la misma lista');
  for (const raro of [[], [CONTAR], undefined, null, 'x', { ej: ANTES }]) assert.equal(adaptarProgreso('fabrica', raro), raro);
  assert.equal(adaptarProgreso('no-existe', ANTES), ANTES);
});

test('renumerar: las demás prácticas, intactas (con cualquier largo de lista)', () => {
  for (const p of CATALOGO.filter(p => p.slug !== 'fabrica')) {
    assert.equal(p.quitados, undefined, `${p.slug} no declara quitados`);
    for (let largo = 0; largo <= 7; largo++) {
      const lista = Array.from({ length: largo }, (_, i) => ej(i));
      assert.equal(adaptarProgreso(p.slug, lista), lista, `${p.slug} con ${largo}`);
    }
  }
});

test('renumerar: «quitados» bien formado (posiciones dentro de antes, y antes = hoy + quitadas)', () => {
  for (const p of CATALOGO.filter(p => p.quitados)) {
    const { antes, posiciones } = p.quitados;
    assert.ok(posiciones.length > 0 && posiciones.every(n => Number.isInteger(n) && n >= 1 && n <= antes), p.slug);
    assert.equal(new Set(posiciones).size, posiciones.length, p.slug);
    assert.equal(antes - posiciones.length, p.nEjercicios, `${p.slug}: si vuelve a tener ${antes} ejercicios, las listas nuevas se confundirían con las viejas`);
  }
});

test('renumerar: fusionar una lista local de 3 con una de la nube de 2 (adaptando antes) cuadra', () => {
  // En el móvil (sin abrir desde el cambio): la lista vieja. En la nube: lo hecho después en el ordenador.
  const nube = [ej(8), ej(3, { fallos: 1 })];
  const fusion = fusionarProgreso(adaptarProgreso('fabrica', ANTES), adaptarProgreso('fabrica', nube));
  assert.equal(fusion.length, 2);
  assert.equal(fusion[0].puntos, 8, 'contar: gana el más avanzado (el de la nube)');
  assert.equal(fusion[0].fallos, 2, 'contar: de los fallos, el máximo');
  assert.equal(fusion[1].puntos, 3, 'sin dividir: gana el de la nube');
  assert.equal(fusion[1].fallos, 4, 'sin dividir: los fallos del móvil se conservan');
  assert.ok(!fusion.some(e => e?.terminado), 'el «construir» terminado de antes no se cuela en ningún sitio');
});

// --- La nube y el espacio, de mentira -------------------------------------------------

/** Un Firestore en memoria que responde como el REST de verdad (como en practicas-nube.test.js). */
function nubeFalsa() {
  const docs = new Map();
  const escrituras = [];
  const fetch = async (url, opciones = {}) => {
    const ruta = decodeURIComponent(new URL(url).pathname.split('/documents/')[1]);
    if (opciones.method === 'PATCH') {
      docs.set(ruta, JSON.parse(opciones.body));
      escrituras.push(ruta);
      return { ok: true, status: 200, json: async () => ({}) };
    }
    if (!docs.has(ruta)) return { ok: false, status: 404, json: async () => ({ error: { status: 'NOT_FOUND' } }) };
    return { ok: true, status: 200, json: async () => docs.get(ruta) };
  };
  const ejDe = ruta => leerDocumentoRest(docs.get(ruta))?.ej ?? null;
  return { fetch, docs, escrituras, ejDe };
}

function conAlmacen(fn) {
  const almacen = new Map();
  globalThis.localStorage = { getItem: k => almacen.get(k) ?? null, setItem: (k, v) => almacen.set(k, String(v)), removeItem: k => almacen.delete(k) };
  return Promise.resolve(fn(almacen)).finally(() => { delete globalThis.localStorage; });
}

test('renumerar: leerNube adapta lo leído y avisa (`adaptado`) para que se reescriba; en el modo antiguo y en un espacio', async () => {
  const nube = nubeFalsa();
  const op = { fetch: nube.fetch, config: CONFIG };
  const c = codigoAlumno(13);
  await escribirNube('fabrica', c, ANTES, 'alterno', op);
  const vieja = await leerNube('fabrica', c, op);
  assert.equal(vieja.estado, 'ok');
  assert.deepEqual(vieja.ej, [CONTAR, DIVISIBLE]);
  assert.equal(vieja.adaptado, true);
  // En un espacio (progreso libre y de una tarea): igual, porque el slug viaja aparte.
  for (const [coleccion, id] of [['practicas-espacios/uidA/progreso-libre', `fabrica--${c}`], ['practicas-espacios/uidA/progreso-tareas', `t2--fabrica--${c}`]]) {
    await escribirNube('fabrica', c, ANTES, 'alterno', { ...op, coleccion, id });
    const leida = await leerNube('fabrica', c, { ...op, coleccion, id });
    assert.deepEqual(leida.ej, [CONTAR, DIVISIBLE], coleccion);
    assert.equal(leida.adaptado, true, coleccion);
  }
  // Una lista ya nueva, u otra práctica: sin `adaptado`.
  await escribirNube('fabrica', c, [CONTAR, DIVISIBLE], 'alterno', op);
  assert.equal((await leerNube('fabrica', c, op)).adaptado, undefined);
  await escribirNube('criba', c, ANTES, 'alterno', op);
  const criba = await leerNube('criba', c, op);
  assert.deepEqual(criba.ej, ANTES);
  assert.equal(criba.adaptado, undefined);
});

test('renumerar: al subir, un documento viejo de la nube se reescribe con 2 aunque la fusión no cambie nada', async () => {
  const nube = nubeFalsa();
  const op = { fetch: nube.fetch, config: CONFIG };
  const c = codigoAlumno(20);
  await escribirNube('fabrica', c, ANTES, 'alterno', op);
  nube.escrituras.length = 0;
  const { ej: enNube } = await subirFusionado('fabrica', c, [CONTAR, DIVISIBLE], 'alterno', op);
  assert.deepEqual(enNube, [CONTAR, DIVISIBLE]);
  assert.deepEqual(nube.escrituras, [`practicas/fabrica--${c}`]);
  assert.deepEqual(nube.ejDe(`practicas/fabrica--${c}`), [CONTAR, DIVISIBLE]);
  // Y la siguiente vez ya no hace falta escribir.
  nube.escrituras.length = 0;
  await subirFusionado('fabrica', c, [CONTAR, DIVISIBLE], 'alterno', op);
  assert.deepEqual(nube.escrituras, []);
});

test('renumerar: en el navegador, progresoGuardado lee la lista de 3 como la de 2 (práctica libre y tarea)', () => conAlmacen(almacen => {
  const c = codigoAlumno(5);
  almacen.set(claveProgreso('fabrica', c), JSON.stringify({ ej: ANTES }));
  assert.deepEqual(progresoGuardado('fabrica', c), [CONTAR, DIVISIBLE]);
  almacen.set(`practicas.v1.fabrica.${c}.t2`, JSON.stringify({ ej: ANTES }));
  assert.deepEqual(progresoGuardado('fabrica', c, 2), [CONTAR, DIVISIBLE]);
  // Otra práctica de 3, intacta.
  almacen.set(claveProgreso('criba', c), JSON.stringify({ ej: ANTES }));
  assert.deepEqual(progresoGuardado('criba', c), ANTES);
}));

test('renumerar: sincronizarGuardado (página de la tarea) con lo viejo en los dos sitios deja 2 en los dos', () => conAlmacen(async almacen => {
  const nube = nubeFalsa();
  const op = { fetch: nube.fetch, config: CONFIG };
  const c = codigoAlumno(7);
  await escribirNube('fabrica', c, [null, ej(9), null], 'alterno', op);
  almacen.set(claveProgreso('fabrica', c), JSON.stringify({ ej: ANTES }));
  assert.equal((await sincronizarGuardado('fabrica', c, op)).estado, 'ok');
  const local = JSON.parse(almacen.get(claveProgreso('fabrica', c))).ej;
  assert.equal(local.length, 2);
  assert.equal(local[0].puntos, 9, 'contar: lo de la nube (el 2 de antes) en el 1');
  assert.deepEqual(local[1], DIVISIBLE);
  assert.equal(canonico(nube.ejDe(`practicas/fabrica--${c}`)), canonico(local), 'la nube, igual que el navegador');
}));

test('renumerar: el panel (leerDocumentos) lee lo viejo con los ejercicios de hoy, en todas las colecciones', () => {
  const c = codigoAlumno(3);
  const estado = JSON.stringify({ v: 1, idioma: 'alterno', ej: ANTES });
  const [libre] = leerDocumentos([{ id: `fabrica--${c}`, estado, actualizado: 5 }]);
  assert.deepEqual(libre.ej, [CONTAR, DIVISIBLE]);
  assert.equal(libre.practica, 7);
  assert.equal(libre.actualizado, 5);
  const [deTarea] = leerDocumentos([{ id: `t2--fabrica--${c}`, estado, actualizado: 5 }], 'practicas-tareas');
  assert.deepEqual(deTarea.ej, [CONTAR, DIVISIBLE]);
  assert.equal(deTarea.tarea, 2);
  const [criba] = leerDocumentos([{ id: `criba--${c}`, estado, actualizado: 5 }]);
  assert.deepEqual(criba.ej, ANTES, 'otra práctica, intacta');
  // Un documento sin `ej` sigue como antes (no se inventa la lista).
  const [sinEj] = leerDocumentos([{ id: `fabrica--${c}`, estado: JSON.stringify({ v: 1 }), actualizado: 1 }]);
  assert.equal('ej' in sinEj, false);
});

// --- Las tareas -------------------------------------------------------------------------

test('renumerar: tarea 2 con el árbol 2 como ★ y 7 para elegir 4; tarea 3 con la Fábrica 2 («Sin dividir»)', () => {
  const t2 = tareaPorId(2), t3 = tareaPorId(3);
  assert.equal(t2.estrella.length, 6);
  assert.ok(t2.estrella.some(([s, n]) => s === 'arbol' && n === 2));
  assert.ok(!t2.estrella.some(([s]) => s === 'fabrica'));
  assert.equal(t2.elegir.length, 7);
  assert.equal(t2.nElegir, 4);
  assert.ok(t2.elegir.some(([s, n]) => s === 'fabrica' && n === 1));
  assert.ok(!t2.elegir.some(([s, n]) => s === 'arbol' && n === 2));
  assert.ok(t3.elegir.some(([s, n]) => s === 'fabrica' && n === 2));
  // Ninguna tarea apunta a un ejercicio de la Fábrica que ya no existe.
  for (const t of TAREAS) for (const [s, n] of [...t.estrella, ...t.elegir]) if (s === 'fabrica') assert.ok(n <= 2, `tarea ${t.id}: fabrica ${n}`);
});
