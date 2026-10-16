// Registro de cada fallo (tarea 39 del reparto PU2): qué se captura de un fallo
// y con qué tamaños, la cola del navegador que se reintenta sin duplicar, la
// regla de Firestore frente a lo que manda la app, la tabla de destrezas frente
// a la documentación y el agregado de la vista «Fallos» del panel.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { practicaPorSlug } from '../practicas/_comun/catalogo.js';
import {
  LIMITES, MAX_PENDIENTES, DESTREZAS, recortar, textoPlano, itemTexto, errorValido, idFallo, datosFallo, camposRest, datosDeDocumento,
  registrarFallo, enviarPendientes, consultaDesde, leerConsulta,
} from '../practicas/_comun/registro.js';
import { agruparFallos } from '../practicas/resultados.js';

const CONFIG = { apiKey: 'clave', projectId: 'proyecto' };
const REGLAS = readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8');
const BLOQUE = REGLAS.slice(REGLAS.indexOf('match /fallos/{id}'), REGLAS.indexOf('match /tareas/'));

function almacenFalso() {
  const m = new Map();
  return { getItem: k => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k), m };
}
const pendientes = almacen => JSON.parse(almacen.getItem('practicas.fallos.pendientes') ?? '[]');

/** Un Firestore de mentira para la colección fallos: crea por id y responde 409 si ya existe. */
function nubeFalsa(respuesta = null) {
  const docs = new Map();
  const fetch = async (url, op) => {
    if (respuesta) return respuesta(url, op);
    const id = new URL(url).searchParams.get('documentId');
    if (docs.has(id)) return { ok: false, status: 409 };
    docs.set(id, JSON.parse(op.body).fields);
    return { ok: true, status: 200 };
  };
  return { fetch, docs };
}

const FALLO = { codigo: 'KTFN', slug: 'semaforo', ejercicio: 2, idioma: 'en', item: { n: 51, d: 3, f: () => 1 }, html: '<span class="cuenta">51 = 3 · 17</span>: the sum of the digits is 6.', t: 1760590000000, dia: 45 };

// --- Qué se captura ----------------------------------------------------------------------

test('registro: el feedback se guarda en texto plano', () => {
  assert.equal(textoPlano('<strong>2<sup>3</sup> · 5</strong> = 40<br>Fíjate &middot; bien&nbsp;&lt;aquí&gt; &#215; &amp;'), '2³ · 5 = 40 / Fíjate · bien <aquí> × &');
  assert.equal(textoPlano('<p>Uno</p><p>Dos</p>'), 'Uno / Dos');
  assert.equal(textoPlano(null), '');
  assert.equal(recortar('abcdef', 4), 'abc…');
  assert.equal(recortar('abc', 4), 'abc');
});

test('registro: el ítem se guarda en JSON, sin funciones ni ciclos, y recortado', () => {
  assert.equal(itemTexto({ n: 51, f: () => 1, d: [3] }), '{"n":51,"d":[3]}');
  const ciclo = { a: 1 };
  ciclo.yo = ciclo;
  assert.equal(itemTexto(ciclo), '{"a":1,"yo":"[…]"}');
  assert.equal(itemTexto({ texto: 'x'.repeat(1000) }).length, LIMITES.item);
  assert.equal(itemTexto(undefined), '');
});

test('registro: los datos de un fallo, con y sin error y respuesta (una práctica que no los pasa sigue igual)', () => {
  const sin = datosFallo(FALLO);
  assert.deepEqual(Object.keys(sin).sort(), ['alumno', 'dia', 'ejercicio', 'feedback', 'idioma', 'item', 'practica', 'repeticion', 't', 'v']);
  assert.deepEqual([sin.alumno, sin.practica, sin.ejercicio, sin.idioma, sin.item, sin.feedback, sin.repeticion], ['KTFN', 'semaforo', 2, 'en', '{"n":51,"d":3}', '51 = 3 · 17: the sum of the digits is 6.', false]);
  const con = datosFallo({ ...FALLO, error: 'Criterio-3-Ultima-Cifra', respuesta: '<b>No</b>', repeticion: true });
  assert.deepEqual([con.error, con.respuesta, con.repeticion], ['criterio-3-ultima-cifra', 'No', true]);
  assert.equal(datosFallo({ ...FALLO, error: 'con espacios' }).error, undefined, 'un error mal formado no se guarda (la regla lo rechazaría)');
  assert.equal(datosFallo({ ...FALLO, respuesta: '' }).respuesta, undefined);
  assert.equal(datosFallo({ ...FALLO, respuesta: 'r'.repeat(200) }).respuesta.length, LIMITES.respuesta);
  assert.equal(datosFallo({ ...FALLO, html: 'f'.repeat(2000) }).feedback.length, LIMITES.feedback);
  assert.equal(datosFallo({ ...FALLO, idioma: 'fr' }).idioma, 'es');
  assert.equal(errorValido('a'.repeat(41)), '');
});

test('registro: ida y vuelta por el formato de Firestore REST', () => {
  const datos = datosFallo({ ...FALLO, error: 'x' });
  const doc = { name: 'projects/p/databases/(default)/documents/fallos/KTFN-abc123-zz00', fields: camposRest(datos) };
  assert.deepEqual(datosDeDocumento(doc), { ...datos, id: 'KTFN-abc123-zz00' });
  assert.equal(datosDeDocumento({ fields: { alumno: { stringValue: 'X' } } }), null);
  assert.deepEqual(leerConsulta([{ document: doc }, { readTime: 'x' }]).map(f => f.id), ['KTFN-abc123-zz00']);
  assert.deepEqual(leerConsulta({ error: 1 }), []);
  const q = consultaDesde(1000).structuredQuery;
  assert.deepEqual([q.from[0].collectionId, q.where.fieldFilter.value.integerValue, q.orderBy[0].direction], ['fallos', '1000', 'DESCENDING']);
});

// --- La regla, frente a lo que manda la app ------------------------------------------------

test('regla: existe, solo deja crear, y acepta lo que manda la app', () => {
  assert.ok(BLOQUE.includes('allow read: if esProfesor();'));
  assert.ok(BLOQUE.includes('allow create:'));
  assert.ok(!/allow (update|delete|write|get|list)/.test(BLOQUE), 'el alumno no puede leer, cambiar ni borrar');
  // El id que genera la app cumple el patrón de la regla.
  const patron = new RegExp(BLOQUE.match(/id\.matches\('([^']+)'\)/)[1]);
  for (let i = 0; i < 200; i++) assert.match(idFallo('KTFN', Date.now() + i * 1e9, Math.random), patron);
  assert.match(idFallo('KTFN', 0), /^KTFN-0-/);
  // Los campos obligatorios y permitidos de la regla son los de datosFallo.
  const lista = nombre => JSON.parse(BLOQUE.match(new RegExp(`${nombre}\\((\\[[^\\]]+\\])\\)`))[1].replace(/'/g, '"'));
  assert.deepEqual(lista('hasAll').sort(), Object.keys(datosFallo(FALLO)).sort());
  // «tarea» (tarea 49): la regla lo admite ya; datosFallo lo manda desde la tarea 51.
  assert.deepEqual(lista('hasOnly').sort(), [...new Set([...Object.keys(datosFallo({ ...FALLO, error: 'x', respuesta: 'y', tarea: 1 })), 'tarea'])].sort());
  assert.match(BLOQUE, /data\.tarea is int && request\.resource\.data\.tarea >= 1 && request\.resource\.data\.tarea <= 1023/);
  // Los topes de la regla dejan pasar los de la app (con margen por si cuentan bytes).
  for (const [campo, tope] of Object.entries({ item: LIMITES.item, feedback: LIMITES.feedback, respuesta: LIMITES.respuesta })) {
    const enRegla = Number(BLOQUE.match(new RegExp(`data\\.${campo}\\.size\\(\\) <= (\\d+)`))[1]);
    assert.ok(enRegla >= 3 * tope, `${campo}: ${enRegla} frente a ${tope}`);
  }
});

// --- La cola del navegador ---------------------------------------------------------------

test('cola: lo que llega sale de la cola; sin red se queda y se manda la próxima vez, sin duplicar', async () => {
  const almacen = almacenFalso();
  const nube = nubeFalsa();
  await registrarFallo(datosFallo(FALLO), { fetch: nube.fetch, config: CONFIG, almacen });
  assert.equal(nube.docs.size, 1);
  assert.deepEqual(pendientes(almacen), []);
  // Sin red: se queda en la cola.
  const sinRed = async () => { throw new TypeError('sin red'); };
  await registrarFallo(datosFallo({ ...FALLO, t: FALLO.t + 1 }), { fetch: sinRed, config: CONFIG, almacen });
  await registrarFallo(datosFallo({ ...FALLO, t: FALLO.t + 2 }), { fetch: sinRed, config: CONFIG, almacen });
  assert.equal(pendientes(almacen).length, 2);
  // Vuelve la red: se mandan los dos.
  await enviarPendientes({ fetch: nube.fetch, config: CONFIG, almacen });
  assert.equal(nube.docs.size, 3);
  assert.deepEqual(pendientes(almacen), []);
  // Un reintento de algo que ya había llegado (409) no duplica y sale de la cola.
  const id = [...nube.docs.keys()][0];
  almacen.setItem('practicas.fallos.pendientes', JSON.stringify([{ id, datos: datosFallo(FALLO) }]));
  await enviarPendientes({ fetch: nube.fetch, config: CONFIG, almacen });
  assert.equal(nube.docs.size, 3);
  assert.deepEqual(pendientes(almacen), []);
});

test('cola: lo que la regla rechaza se descarta; un 500 se reintenta; nunca más de MAX_PENDIENTES', async () => {
  const almacen = almacenFalso();
  await registrarFallo(datosFallo(FALLO), { fetch: nubeFalsa(() => ({ ok: false, status: 403 })).fetch, config: CONFIG, almacen });
  assert.deepEqual(pendientes(almacen), [], '403 (reglas sin publicar o datos raros): no se reintenta siempre');
  await registrarFallo(datosFallo(FALLO), { fetch: nubeFalsa(() => ({ ok: false, status: 503 })).fetch, config: CONFIG, almacen });
  assert.equal(pendientes(almacen).length, 1);
  const sinRed = async () => { throw new Error('x'); };
  for (let i = 0; i < MAX_PENDIENTES + 10; i++) await registrarFallo(datosFallo({ ...FALLO, t: FALLO.t + i }), { fetch: sinRed, config: CONFIG, almacen });
  assert.equal(pendientes(almacen).length, MAX_PENDIENTES);
  // Sin almacén (modo privado bloqueado) no lanza.
  await registrarFallo(datosFallo(FALLO), { fetch: sinRed, config: CONFIG, almacen: null });
});

// --- Destrezas y panel ---------------------------------------------------------------------

test('destrezas: la tabla de registro.js es la del §7 de docs/practicas-unidad2.md', () => {
  const docs = readFileSync(new URL('../docs/practicas-unidad2.md', import.meta.url), 'utf8');
  const deDocs = {};
  for (const linea of docs.split('\n')) {
    const c = linea.split('|').map(s => s.trim());
    if (!/^U2-/.test(c[1] ?? '')) continue;
    for (const slug of (c[5].match(/`([a-z0-9-]+)`/g) ?? []).map(x => x.slice(1, -1))) (deDocs[slug] ??= []).push(c[1]);
  }
  assert.deepEqual(DESTREZAS, deDocs);
  for (const slug of Object.keys(DESTREZAS)) assert.ok(practicaPorSlug(slug), slug);
});

test('panel: «Fallos» agrupa por error cuando lo hay y si no por ejercicio, con ejemplos y por alumno', () => {
  const f = (alumno, practica, ejercicio, t, extra = {}) => ({ alumno, practica, ejercicio, t, item: `{"t":${t}}`, feedback: `fb ${t}`, ...extra });
  const fallos = [
    f('AAAA', 'semaforo', 1, 1, { error: 'criterio-3' }),
    f('BBBB', 'semaforo', 1, 2, { error: 'criterio-3', respuesta: 'Sí' }),
    f('AAAA', 'semaforo', 1, 3, { error: 'criterio-3' }),
    f('AAAA', 'semaforo', 1, 4),
    f('BBBB', 'recta', 2, 5),
    f('BBBB', 'recta', 2, 6),
    f('KTFN', 'recta', 2, 7),   // código de prueba
  ];
  const r = agruparFallos(fallos, {}, 2);
  assert.equal(r.total, 7);
  assert.deepEqual(r.grupos.map(g => [g.practica, g.ejercicio, g.error, g.veces, g.alumnos]), [
    ['recta', 2, '', 3, 2],
    ['semaforo', 1, 'criterio-3', 3, 2],
    ['semaforo', 1, '', 1, 1],
  ]);
  assert.deepEqual(r.grupos[1].ejemplos.map(e => [e.alumno, e.t, e.respuesta]), [['AAAA', 3, ''], ['BBBB', 2, 'Sí']], 'los más recientes, hasta 2');
  assert.deepEqual(r.porAlumno.map(a => [a.alumno, a.total, a.ejercicios.map(e => `${e.practica}/${e.ejercicio}:${e.veces}`).join(' ')]), [
    ['AAAA', 3, 'semaforo/1:3'],
    ['BBBB', 3, 'recta/2:2 semaforo/1:1'],
    ['KTFN', 1, 'recta/2:1'],
  ]);
  // Filtros: los de la lista, una tarea, una práctica, un ejercicio, un alumno.
  assert.equal(agruparFallos(fallos, { alumnos: new Set(['AAAA', 'BBBB']) }).total, 6);
  assert.equal(agruparFallos(fallos, { ejercicios: [['recta', 2]] }).total, 3);
  assert.equal(agruparFallos(fallos, { practica: 'semaforo', ejercicio: 1, alumno: 'AAAA' }).total, 3);
  assert.deepEqual(agruparFallos([], {}), { total: 0, grupos: [], porAlumno: [] });
});
