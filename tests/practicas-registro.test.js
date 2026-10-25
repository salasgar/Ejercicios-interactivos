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
  registrarFallo, enviarPendientes, tareaValida, coleccionFallo,
} from '../practicas/_comun/registro.js';
import { agruparFallos } from '../practicas/resultados.js';

const CONFIG = { apiKey: 'clave', projectId: 'proyecto' };
const REGLAS = readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8');
// Desde la tarea 71 la única colección de fallos es la del espacio de cada profesor.
const BLOQUE = (() => {
  const desde = REGLAS.indexOf('match /fallos/{id}', REGLAS.indexOf('match /practicas-espacios/{uid}'));
  return REGLAS.slice(desde, REGLAS.indexOf('\n      }', desde));
})();
const UID_A = 'uidProfesorA0001';

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
  const doc = { name: `projects/p/databases/(default)/documents/practicas-espacios/${UID_A}/fallos/KTFN-abc123-zz00`, fields: camposRest(datos) };
  assert.deepEqual(datosDeDocumento(doc), { ...datos, id: 'KTFN-abc123-zz00' });
  assert.equal(datosDeDocumento({ fields: { alumno: { stringValue: 'X' } } }), null);
});

// --- La regla, frente a lo que manda la app ------------------------------------------------

test('regla: existe, el alumno solo crea, y acepta lo que manda la app', () => {
  assert.ok(BLOQUE.includes('allow read: if esDueno(uid) || esLector(uid);'));
  assert.ok(BLOQUE.includes('allow delete: if esDueno(uid);'));
  assert.ok(BLOQUE.includes('allow create:'));
  assert.ok(!/allow (update|write|get|list)/.test(BLOQUE), 'nadie cambia un fallo, y el alumno no puede leerlo');
  // Fuera del espacio no hay regla de fallos (tarea 71): Firestore la deniega.
  assert.equal(REGLAS.indexOf('match /fallos/{id}'), REGLAS.indexOf('match /fallos/{id}', REGLAS.indexOf('match /practicas-espacios/{uid}')), 'el único match de fallos es el del espacio');
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
  const profesor = UID_A;
  await registrarFallo(datosFallo(FALLO), { profesor, fetch: nube.fetch, config: CONFIG, almacen });
  assert.equal(nube.docs.size, 1);
  assert.deepEqual(pendientes(almacen), []);
  // Sin red: se queda en la cola.
  const sinRed = async () => { throw new TypeError('sin red'); };
  await registrarFallo(datosFallo({ ...FALLO, t: FALLO.t + 1 }), { profesor, fetch: sinRed, config: CONFIG, almacen });
  await registrarFallo(datosFallo({ ...FALLO, t: FALLO.t + 2 }), { profesor, fetch: sinRed, config: CONFIG, almacen });
  assert.equal(pendientes(almacen).length, 2);
  // Vuelve la red: se mandan los dos.
  await enviarPendientes({ fetch: nube.fetch, config: CONFIG, almacen });
  assert.equal(nube.docs.size, 3);
  assert.deepEqual(pendientes(almacen), []);
  // Un reintento de algo que ya había llegado (409) no duplica y sale de la cola.
  const id = [...nube.docs.keys()][0];
  almacen.setItem('practicas.fallos.pendientes', JSON.stringify([{ id, datos: datosFallo(FALLO), profesor }]));
  await enviarPendientes({ fetch: nube.fetch, config: CONFIG, almacen });
  assert.equal(nube.docs.size, 3);
  assert.deepEqual(pendientes(almacen), []);
});

test('cola: lo que la regla rechaza se descarta; un 500 se reintenta; nunca más de MAX_PENDIENTES', async () => {
  const almacen = almacenFalso();
  const profesor = UID_A;
  await registrarFallo(datosFallo(FALLO), { profesor, fetch: nubeFalsa(() => ({ ok: false, status: 403 })).fetch, config: CONFIG, almacen });
  assert.deepEqual(pendientes(almacen), [], '403 (reglas sin publicar o datos raros): no se reintenta siempre');
  await registrarFallo(datosFallo(FALLO), { profesor, fetch: nubeFalsa(() => ({ ok: false, status: 503 })).fetch, config: CONFIG, almacen });
  assert.equal(pendientes(almacen).length, 1);
  const sinRed = async () => { throw new Error('x'); };
  for (let i = 0; i < MAX_PENDIENTES + 10; i++) await registrarFallo(datosFallo({ ...FALLO, t: FALLO.t + i }), { profesor, fetch: sinRed, config: CONFIG, almacen });
  assert.equal(pendientes(almacen).length, MAX_PENDIENTES);
  // Sin almacén (modo privado bloqueado) no lanza.
  await registrarFallo(datosFallo(FALLO), { profesor, fetch: sinRed, config: CONFIG, almacen: null });
});

// --- Destrezas y panel ---------------------------------------------------------------------

test('destrezas: la tabla de registro.js es la del §7 de docs/practicas-unidad2.md y la de docs/practicas-unidad3.md', () => {
  const deDocs = {};
  const filas = {};
  for (const [unidad, fichero] of [[2, 'practicas-unidad2.md'], [3, 'practicas-unidad3.md']]) {
    const docs = readFileSync(new URL(`../docs/${fichero}`, import.meta.url), 'utf8');
    filas[unidad] = 0;
    for (const linea of docs.split('\n')) {
      const c = linea.split('|').map(s => s.trim());
      if (!new RegExp(`^U${unidad}-`).test(c[1] ?? '')) continue;
      filas[unidad]++;
      for (const slug of (c[5].match(/`([a-z0-9-]+)`/g) ?? []).map(x => x.slice(1, -1))) (deDocs[slug] ??= []).push(c[1]);
    }
  }
  assert.deepEqual(filas, { 2: 78, 3: 81 }, 'una fila por destreza de cada inventario');
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

// --- La tarea desde la que se falló (tarea 51) ----------------------------------------------

test('registro: «tarea» viaja en el fallo solo si es un id que la regla acepta', () => {
  assert.equal(datosFallo(FALLO).tarea, undefined, 'práctica libre: sin campo');
  assert.equal(datosFallo({ ...FALLO, tarea: 1 }).tarea, 1, 'también la tarea 1');
  assert.equal(datosFallo({ ...FALLO, tarea: 1023 }).tarea, 1023);
  for (const mala of [0, 1024, 2.5, '3', null, undefined]) assert.equal(datosFallo({ ...FALLO, tarea: mala }).tarea, undefined, String(mala));
  assert.equal(tareaValida(7), 7);
  assert.equal(tareaValida(-1), null);
  // Ida y vuelta por Firestore REST: llega como entero.
  const datos = datosFallo({ ...FALLO, tarea: 2 });
  assert.equal(camposRest(datos).tarea.integerValue, '2');
  assert.equal(datosDeDocumento({ name: 'x/KTFN-1-aaaa', fields: camposRest(datos) }).tarea, 2);
});

// --- Varios profesores: los fallos van al espacio del profesor del código (tarea 64) ---

const SECRETO = 'K7QMP3XA';   // inventado
const BLOQUE_ESPACIO = BLOQUE;

/** Ruta de Firestore de una petición REST (lo que va detrás de /documents/). */
const rutaDe = url => new URL(url).pathname.split('/documents/')[1];

test('espacio: un fallo con código de 8 y profesor va a practicas-espacios/{uid}/fallos, con lo que pide la regla', async () => {
  const almacen = almacenFalso();
  const urls = [];
  const nube = nubeFalsa();
  const fetch = async (url, op) => { urls.push(rutaDe(url)); return nube.fetch(url, op); };
  const datos = datosFallo({ ...FALLO, codigo: SECRETO, tarea: 3 });
  await registrarFallo(datos, { profesor: UID_A, fetch, config: CONFIG, almacen });
  assert.deepEqual(urls, [`practicas-espacios/${UID_A}/fallos`]);
  assert.deepEqual(pendientes(almacen), []);
  // Lo que comprueba la regla del espacio (tarea 61), leído de firestore.rules.
  assert.ok(BLOQUE_ESPACIO.includes('alumnoDe(uid, request.resource.data.alumno)'), 'la regla mira que el código es de ese profesor');
  const id = [...nube.docs.keys()][0];
  assert.match(id, new RegExp(BLOQUE_ESPACIO.match(/id\.matches\('([^']+)'\)/)[1]));
  assert.ok(id.startsWith(`${SECRETO}-`), 'el id empieza por el código (id.matches(^ + alumno + -))');
  assert.ok(BLOQUE_ESPACIO.includes('codigoSecreto(request.resource.data.alumno)'), 'el alumno es un código secreto (4 u 8, tarea 72)');
  const patronSecreto = new RegExp(REGLAS.match(/function codigoSecreto\(c\) \{\s*return c is string && c\.matches\('([^']+)'\)/)[1]);
  assert.match(datos.alumno, patronSecreto);
  for (const bueno of ['K7QM', 'K7QMP3XA', 'KTFN']) assert.match(bueno, patronSecreto);
  for (const malo of ['K7Q', 'K7QMP', 'K7QMP3X', 'K7QMP3XAB', 'K7QO', 'k7qm']) assert.doesNotMatch(malo, patronSecreto);
  const lista = campo => BLOQUE_ESPACIO.match(new RegExp(`keys\\(\\)\\.${campo}\\(\\[([^\\]]+)\\]\\)`))[1].match(/'([a-z]+)'/g).map(s => s.slice(1, -1));
  const campos = Object.keys(nube.docs.get(id));
  for (const c of lista('hasAll')) assert.ok(campos.includes(c), `falta ${c}`);
  for (const c of campos) assert.ok(lista('hasOnly').includes(c), `sobra ${c}`);
  assert.equal(nube.docs.get(id).tarea.integerValue, '3');
});

test('espacio (tarea 71): un código de 4 calculable sin profesor conocido ya no va a «fallos»: espera en la cola (aunque haya profesor guardado de otro código)', async () => {
  const almacen = almacenFalso();
  almacen.setItem(`practicas.v1.espacio.${SECRETO}`, JSON.stringify({ profesor: UID_A, n: 3, json: '{"unidades":[],"tareas":[]}' }));
  const urls = [];
  const fetch = async (url, op) => { urls.push(rutaDe(url)); return nubeFalsa().fetch(url, op); };
  const datos = datosFallo(FALLO);
  await registrarFallo(datos, { fetch, config: CONFIG, almacen });
  assert.deepEqual(urls, []);
  assert.equal(pendientes(almacen).length, 1);
  assert.equal(coleccionFallo({ datos }), null);
});

test('espacio (tarea 72): un código de 4 registrado va al espacio de su profesor; uno de 4 sin profesor espera', async () => {
  const almacen = almacenFalso();
  const antiguo = datosFallo(FALLO);   // KTFN: de los de 4 calculables (como los de siempre de Juan Luis)
  assert.equal(coleccionFallo({ datos: antiguo, profesor: UID_A }), `practicas-espacios/${UID_A}/fallos`, 'registrado: a su espacio');
  almacen.setItem(`practicas.v1.espacio.${antiguo.alumno}`, JSON.stringify({ profesor: UID_A, n: 60, json: '{"unidades":[],"tareas":[]}' }));
  assert.equal(coleccionFallo({ datos: antiguo }, almacen), `practicas-espacios/${UID_A}/fallos`, 'o por la copia del navegador');
  const nuevo4 = datosFallo({ ...FALLO, codigo: 'K7QM' });
  assert.equal(coleccionFallo({ datos: nuevo4 }, almacenFalso()), null, 'sin profesor no va a «fallos»: espera');
  assert.equal(coleccionFallo({ datos: nuevo4, profesor: UID_A }), `practicas-espacios/${UID_A}/fallos`);
  // Y sale de verdad, con un id que acepta la regla del espacio.
  const nube = nubeFalsa();
  const urls = [];
  await registrarFallo(nuevo4, { profesor: UID_A, fetch: async (url, op) => { urls.push(rutaDe(url)); return nube.fetch(url, op); }, config: CONFIG, almacen });
  assert.deepEqual(urls, [`practicas-espacios/${UID_A}/fallos`]);
  const id = [...nube.docs.keys()][0];
  assert.ok(id.startsWith('K7QM-'));
  assert.match(id, new RegExp(BLOQUE_ESPACIO.match(/id\.matches\('([^']+)'\)/)[1]));
});

test('espacio: sin saber el profesor, el fallo espera en la cola; en cuanto el navegador lo sabe (espacio.js), sale a su espacio', async () => {
  const almacen = almacenFalso();
  const urls = [];
  const nube = nubeFalsa();
  const fetch = async (url, op) => { urls.push(rutaDe(url)); return nube.fetch(url, op); };
  await registrarFallo(datosFallo({ ...FALLO, codigo: SECRETO }), { fetch, config: CONFIG, almacen });
  await registrarFallo(datosFallo({ ...FALLO, codigo: SECRETO, t: FALLO.t + 1 }), { profesor: null, fetch, config: CONFIG, almacen });
  assert.deepEqual(urls, [], 'ni a «fallos» ni a ningún espacio');
  assert.equal(pendientes(almacen).length, 2);
  // Un código de 4 sin profesor conocido, en la misma cola, también espera (tarea 71).
  await registrarFallo(datosFallo(FALLO), { fetch, config: CONFIG, almacen });
  assert.deepEqual(urls, []);
  assert.equal(pendientes(almacen).length, 3);
  // Vuelve la red: resolverCodigo deja la copia del navegador, y la cola ya sabe adónde ir.
  almacen.setItem(`practicas.v1.espacio.${SECRETO}`, JSON.stringify({ profesor: UID_A, n: 3, json: '{"unidades":[],"tareas":[]}' }));
  await enviarPendientes({ fetch, config: CONFIG, almacen });
  assert.deepEqual(urls, [`practicas-espacios/${UID_A}/fallos`, `practicas-espacios/${UID_A}/fallos`]);
  assert.deepEqual(pendientes(almacen).map(p => p.datos.alumno), ['KTFN'], 'el de 4 sigue esperando a saber su profesor');
  // Un uid ilegible no se manda a ninguna parte (se queda, y la cola tiene tope).
  assert.equal(coleccionFallo({ datos: { alumno: SECRETO }, profesor: '../otro' }), null);
});
