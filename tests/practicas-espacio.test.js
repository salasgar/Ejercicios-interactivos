// Modelo puro de varios profesores (tarea 62 del reparto PU2): código secreto,
// tareas y fechas como parámetro, configuración del profesor, rutas del espacio
// y resolución de un código a su profesor. Nadie lo usa aún: lo que se comprueba
// aquí es que las piezas funcionan y que el modo antiguo (código de 4, lista
// por defecto) da lo mismo que antes.

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ALFABETO, codigoAlumno, leerCodigoAlumno, codigoSecreto, leerCodigoSecreto, mostrarCodigoSecreto, formatoDeCodigo, esCodigoAntiguo,
  codigoTarea, leerCodigoTarea, MAX_ALUMNOS,
} from '../practicas/_comun/codigos.js';
import {
  TAREAS, tareaPorId, tareasPublicadas, erroresTareas, configDeJSON, configAJSON, erroresConfig, configPlantilla, longitudDeCodigos,
} from '../practicas/_comun/tareas.js';
import { UNIDADES, unidadActual, unidadesCon } from '../practicas/_comun/catalogo.js';
import {
  coleccionEspacio, urlDocumento, urlBusqueda, urlConfig, urlAsignacion, leerNube, escribirNube, leerAsignacion,
  leerBusqueda, leerConfig, leerBusquedaRest, leerConfigRest,
} from '../practicas/_comun/nube.js';
import { resolverCodigo, claveEspacio, claveAntiguo, VIGENCIA_ANTIGUO } from '../practicas/_comun/espacio.js';

const CONFIG = { apiKey: 'clave', projectId: 'proyecto' };
const UID = 'AbC123profesor';
const CODIGO = 'K7QMP3XA';

// --- Código secreto ------------------------------------------------------------

test('codigoSecreto: 8 símbolos del alfabeto, uno por byte, sin sesgo', () => {
  // Cada byte b da el símbolo b & 31: los 256 bytes reparten 8 veces cada símbolo.
  const veces = Array(32).fill(0);
  for (let b = 0; b < 256; b++) veces[b & 31]++;
  assert.ok(veces.every(v => v === 8));
  const fijo = codigoSecreto(8, bytes => { bytes.set([0, 1, 31, 32, 255, 64, 65, 100]); return bytes; });
  assert.equal(fijo, `${ALFABETO[0]}${ALFABETO[1]}${ALFABETO[31]}${ALFABETO[0]}${ALFABETO[31]}${ALFABETO[0]}${ALFABETO[1]}${ALFABETO[4]}`);
  assert.equal(fijo.length, 8);
});

test('codigoSecreto: con el azar del sistema salen códigos válidos y distintos', () => {
  const vistos = new Set();
  for (let i = 0; i < 500; i++) {
    const c = codigoSecreto();
    assert.match(c, /^[A-HJ-NP-Z2-9]{8}$/);
    assert.equal(leerCodigoSecreto(c), c);
    vistos.add(c);
  }
  assert.ok(vistos.size > 495, 'prácticamente no se repiten');
});

test('codigoSecreto(4) (tarea 72): 4 símbolos al azar y nunca uno de los 1024 calculables', () => {
  const vistos = new Set();
  for (let i = 0; i < 20000; i++) {
    const c = codigoSecreto(4);
    assert.match(c, /^[A-HJ-NP-Z2-9]{4}$/);
    assert.equal(leerCodigoAlumno(c), null, `${c} es un código antiguo`);
    assert.equal(leerCodigoSecreto(c), c);
    vistos.add(c);
  }
  assert.ok(vistos.size > 19500, 'prácticamente no se repiten (hay 1 048 576 − 1024)');
  // Si el azar da un código antiguo, se descarta y se sortea otro.
  const antiguo = codigoAlumno(59);
  const bytesDe = c => [...c].map(s => ALFABETO.indexOf(s));
  const tiradas = [bytesDe(antiguo), bytesDe(codigoAlumno(0)), bytesDe('K7QM')];
  let usadas = 0;
  const c = codigoSecreto(4, bytes => { bytes.set(tiradas[usadas++]); return bytes; });
  assert.equal(c, 'K7QM');
  assert.equal(usadas, 3);
  // Los 1024 antiguos son exactamente los que se descartan.
  let antiguos = 0;
  for (const a of ALFABETO) for (const b of ALFABETO) for (const d of ALFABETO) for (const e of ALFABETO) if (esCodigoAntiguo(a + b + d + e)) antiguos++;
  assert.equal(antiguos, MAX_ALUMNOS);
  // Otra longitud no vale.
  for (const malo of [0, 5, 7, 9, '8']) assert.throws(() => codigoSecreto(malo), /4 u 8/);
});

test('leerCodigoSecreto y mostrarCodigoSecreto: mayúsculas, guiones y espacios; 4 u 8 símbolos', () => {
  assert.equal(leerCodigoSecreto('k7qm-p3xa'), CODIGO);
  assert.equal(leerCodigoSecreto(' K7QM P3XA '), CODIGO);
  assert.equal(mostrarCodigoSecreto(CODIGO), 'K7QM-P3XA');
  assert.equal(leerCodigoSecreto('k7qm'), 'K7QM');
  assert.equal(leerCodigoSecreto(codigoAlumno(59)), codigoAlumno(59));
  assert.equal(mostrarCodigoSecreto('k7qm'), 'K7QM');
  for (const malo of ['K7Q', 'K7QMP', 'K7QM-P3X', 'K7QM-P3XAB', 'K7QM-P3X0', 'K7QM-P3XI', 'K7Q1', '', null, undefined]) {
    assert.equal(leerCodigoSecreto(malo), null, String(malo));
  }
});

test('formatoDeCodigo (tarea 72): solo el formato, 4 u 8; el sistema lo decide la nube', () => {
  assert.equal(formatoDeCodigo(codigoAlumno(0)), '4');
  assert.equal(formatoDeCodigo(codigoAlumno(59)), '4');
  assert.equal(formatoDeCodigo('ABCD'), '4', 'sin la comprobación antigua también: puede ser un código de 4 generado');
  assert.equal(formatoDeCodigo('k7qm'), '4');
  assert.equal(formatoDeCodigo(CODIGO), '8');
  assert.equal(formatoDeCodigo('K7QM-P3XA'), '8');
  for (const malo of ['K7QMP3X', 'K7QMP', 'AB1D', 'ABOD', '', null]) assert.equal(formatoDeCodigo(malo), null, String(malo));
  for (let i = 0; i < MAX_ALUMNOS; i += 7) {
    assert.equal(leerCodigoAlumno(codigoAlumno(i)), i);
    assert.equal(esCodigoAntiguo(codigoAlumno(i)), true);
  }
  assert.equal(esCodigoAntiguo('ABCD'), false);
  assert.equal(esCodigoAntiguo(CODIGO), false);
});

test('configuración (tarea 72): longitudCodigo 4 u 8, por defecto 8, y solo se guarda si es 4', () => {
  const base = { unidades: [{ n: 2, desde: '2026-12-14' }], tareas: [] };
  assert.equal(longitudDeCodigos(base), 8);
  assert.equal(longitudDeCodigos(null), 8);
  assert.equal(longitudDeCodigos({ ...base, longitudCodigo: 4 }), 4);
  assert.equal(longitudDeCodigos({ ...base, longitudCodigo: 8 }), 8);
  assert.equal(longitudDeCodigos({ ...base, longitudCodigo: '4' }), 8, 'solo el número 4');
  // Sin el campo, el JSON de siempre; con 4, el campo; con 8, sin campo.
  assert.equal(configAJSON(base), JSON.stringify(base));
  assert.equal(configAJSON({ ...base, longitudCodigo: 8 }), JSON.stringify(base));
  assert.deepEqual(JSON.parse(configAJSON({ ...base, longitudCodigo: 4 })), { ...base, longitudCodigo: 4 });
  assert.deepEqual(configDeJSON(configAJSON({ ...base, longitudCodigo: 4 })), { ...base, longitudCodigo: 4 });
  assert.deepEqual(configDeJSON(configAJSON(base)), base);
  assert.deepEqual(configDeJSON(JSON.stringify({ ...base, longitudCodigo: 6 })), base, 'una longitud rara se lee como 8');
  assert.deepEqual(erroresConfig({ ...base, longitudCodigo: 4 }), erroresConfig(base));
  assert.deepEqual(erroresConfig({ ...base, longitudCodigo: 8 }), erroresConfig(base));
  assert.ok(erroresConfig({ ...base, longitudCodigo: 6 }).includes('longitudCodigo: tiene que ser 4 u 8'));
});

// --- Tareas y fechas como parámetro ----------------------------------------------

test('modo antiguo: con la lista por defecto todo da lo mismo que antes', () => {
  for (const t of TAREAS) {
    assert.equal(tareaPorId(t.id), t);
    assert.equal(tareaPorId(t.id, TAREAS), t);
  }
  assert.equal(tareaPorId(999), null);
  assert.deepEqual(erroresTareas(), []);
  assert.deepEqual(erroresTareas(TAREAS, { tareaUnoAntigua: true }), []);
  assert.deepEqual(tareasPublicadas('2026-11-01'), tareasPublicadas('2026-11-01', TAREAS));
  assert.equal(unidadActual('2026-10-20'), unidadActual('2026-10-20', UNIDADES));
  const t = tareaPorId(2);
  const codigo = codigoTarea(t.id, 12, { estrella: [true, true, false, false, false, false], elegir: [true, false, false, false, false, false, false, false], fallos: 3, dia: 40 });
  assert.deepEqual(leerCodigoTarea(codigo), leerCodigoTarea(codigo, TAREAS));
  assert.equal(leerCodigoTarea(codigo).tarea, 2);
  assert.equal(leerCodigoTarea(codigo).indice, 12);
});

test('leerCodigoTarea y tareaPorId con la lista de un profesor', () => {
  const suya = [{ ...TAREAS[1], id: 7 }, { ...TAREAS[2], id: 8 }];
  const codigo = codigoTarea(7, 3, { estrella: [true, false, false, false, false, false], dia: 41 });
  assert.equal(leerCodigoTarea(codigo), null, 'con la lista por defecto no hay tarea 7');
  const leido = leerCodigoTarea(codigo, suya);
  assert.equal(leido.tarea, 7);
  assert.equal(leido.indice, 3);
  assert.deepEqual(leido.estrella, [true, false, false, false, false, false]);
  assert.equal(tareaPorId(8, suya), suya[1]);
  assert.equal(tareaPorId(2, suya), null);
  // La tarea 2 de la plantilla ya no existe para este profesor.
  assert.equal(leerCodigoTarea(codigoTarea(2, 3, {}), suya), null);
});

// --- Configuración del profesor ----------------------------------------------------

test('configPlantilla: las tareas y fechas de hoy, válidas como configuración', () => {
  const plantilla = configPlantilla();
  assert.equal(plantilla.tareas.length, TAREAS.length);
  assert.deepEqual(plantilla.unidades, UNIDADES.map(u => ({ n: u.n, desde: u.desde })));
  assert.deepEqual(erroresConfig(plantilla), []);
  assert.ok(plantilla.tareas.every(t => t.progresoPorPractica === undefined));
  assert.notEqual(plantilla.tareas[0], TAREAS[0], 'es una copia');
  assert.equal(TAREAS[0].progresoPorPractica, true, 'la plantilla original no se toca');
});

test('configAJSON y configDeJSON: ida y vuelta', () => {
  const plantilla = configPlantilla();
  const texto = configAJSON(plantilla);
  assert.deepEqual(configDeJSON(texto), plantilla);
  assert.deepEqual(configDeJSON(configAJSON({ unidades: [{ n: 1, desde: '2026-12-14', otro: 'x' }], tareas: [] })), { unidades: [{ n: 1, desde: '2026-12-14' }], tareas: [] });
  for (const malo of ['', 'no es json', '[]', 'null', '{"unidades":[]}', '{"tareas":[]}', '{"unidades":3,"tareas":[]}', null, undefined]) {
    assert.equal(configDeJSON(malo), null, String(malo));
  }
});

test('erroresConfig: fechas de unidad y lo de erroresTareas', () => {
  const buena = () => configPlantilla();
  assert.deepEqual(erroresConfig(buena()), []);
  assert.deepEqual(erroresConfig({ unidades: [], tareas: [] }).length, 0 + erroresTareas([], { tareaUnoAntigua: false }).length);
  const con = (cambio) => { const c = buena(); cambio(c); return erroresConfig(c); };
  assert.match(con(c => { c.unidades[0].desde = '2026-02-30'; }).join('|'), /unidad 1.*desde/);
  assert.match(con(c => { c.unidades[0].desde = 'ayer'; }).join('|'), /unidad 1.*desde/);
  assert.match(con(c => { c.unidades.push({ n: 1, desde: '2026-12-01' }); }).join('|'), /unidad 1: repetida/);
  assert.match(con(c => { c.unidades.push({ n: 9, desde: '2026-12-01' }); }).join('|'), /unidad 9/);
  assert.match(con(c => { c.tareas[0].estrella.push(['noexiste', 1]); }).join('|'), /noexiste/);
  assert.match(con(c => { c.tareas[1].id = c.tareas[0].id; }).join('|'), /repetido/);
  assert.match(con(c => { c.tareas[0].hasta = '2020-01-01'; }).join('|'), /anterior/);
  assert.ok(erroresConfig(null).length > 0);
  assert.ok(erroresConfig({ tareas: [] }).length > 0);
});

test('erroresConfig: la tarea 1 de un profesor es una más', () => {
  const c = configPlantilla();
  assert.equal(c.tareas[0].id, 1);
  assert.deepEqual(erroresConfig(c), []);
  // Y «progresoPorPractica» no vale en un espacio.
  c.tareas[0].progresoPorPractica = true;
  assert.match(erroresConfig(c).join('|'), /progresoPorPractica/);
});

test('unidadesCon: títulos comunes y fechas del profesor', () => {
  const suyas = unidadesCon([{ n: 2, desde: '2026-12-14' }, { n: 3, desde: '2027-02-01' }, { n: 7, desde: '2027-01-01' }]);
  assert.equal(suyas.length, UNIDADES.length);
  assert.equal(suyas.find(u => u.n === 2).desde, '2026-12-14');
  assert.equal(suyas.find(u => u.n === 1).desde, UNIDADES[0].desde, 'sin fecha suya, la del curso');
  assert.deepEqual(suyas.map(u => u.titulo), UNIDADES.map(u => u.titulo));
  assert.deepEqual(unidadesCon(), UNIDADES);
  assert.equal(UNIDADES.find(u => u.n === 2).desde, '2026-10-13', 'no toca UNIDADES');
  assert.equal(unidadActual('2026-12-20', suyas), 2);
  assert.equal(unidadActual('2026-12-01', suyas), 1);
});

// --- Rutas del espacio -------------------------------------------------------------

test('coleccionEspacio: cuatro subcolecciones y un uid razonable', () => {
  assert.equal(coleccionEspacio(UID, 'progreso-libre'), `practicas-espacios/${UID}/progreso-libre`);
  assert.equal(coleccionEspacio(UID, 'progreso-tareas'), `practicas-espacios/${UID}/progreso-tareas`);
  assert.equal(coleccionEspacio(UID, 'asignaciones'), `practicas-espacios/${UID}/asignaciones`);
  assert.equal(coleccionEspacio(UID, 'fallos'), `practicas-espacios/${UID}/fallos`);
  assert.throws(() => coleccionEspacio(UID, 'privado'));
  assert.throws(() => coleccionEspacio('a/b', 'progreso-libre'));
  assert.throws(() => coleccionEspacio('', 'progreso-libre'));
  assert.throws(() => coleccionEspacio(undefined, 'progreso-libre'));
});

test('las URL REST: documento con colección con barras, búsqueda y configuración', () => {
  const base = 'https://firestore.googleapis.com/v1/projects/proyecto/databases/(default)/documents';
  assert.equal(
    urlDocumento('semaforo', CODIGO, CONFIG, { coleccion: coleccionEspacio(UID, 'progreso-libre'), id: `semaforo--${CODIGO}` }),
    `${base}/practicas-espacios/${UID}/progreso-libre/semaforo--${CODIGO}?key=clave`);
  assert.equal(urlAsignacion(CODIGO, CONFIG, coleccionEspacio(UID, 'asignaciones')), `${base}/practicas-espacios/${UID}/asignaciones/${CODIGO}?key=clave`);
  assert.equal(urlAsignacion('7NPD', CONFIG), `${base}/practicas-asignaciones/7NPD?key=clave`, 'sin colección, la de siempre');
  assert.equal(urlBusqueda(CODIGO, CONFIG), `${base}/practicas-alumnos/${CODIGO}?key=clave`);
  assert.equal(urlConfig(UID, CONFIG), `${base}/practicas-espacios/${UID}/config/tareas?key=clave`);
  assert.equal(urlBusqueda(CODIGO, {}), null);
  assert.equal(urlConfig(UID, {}), null);
  assert.throws(() => urlConfig('../x', CONFIG));
});

/** Un fetch de mentira: responde según la URL y apunta lo que se pide. */
function fetchFalso(respuestas) {
  const pedidos = [];
  const fn = async (url, opciones = {}) => {
    pedidos.push({ url, metodo: opciones.method ?? 'GET', cuerpo: opciones.body });
    const clave = Object.keys(respuestas).find(k => url.includes(k));
    const r = clave ? respuestas[clave] : { status: 404 };
    if (r instanceof Error) throw r;
    return { status: r.status ?? 200, ok: (r.status ?? 200) < 300, json: async () => r.json };
  };
  fn.pedidos = pedidos;
  return fn;
}

const docEstado = ej => ({ fields: { estado: { stringValue: JSON.stringify({ v: 1, idioma: 'es', ej }) } } });

test('leerNube, escribirNube y leerAsignacion con la colección del espacio', async () => {
  const coleccion = coleccionEspacio(UID, 'progreso-libre');
  const id = `semaforo--${CODIGO}`;
  const ej = [{ puntos: 3, objetivo: 10, terminado: false }];
  const f = fetchFalso({ [`practicas-espacios/${UID}/progreso-libre/${id}`]: { json: docEstado(ej) } });
  const leido = await leerNube('semaforo', CODIGO, { fetch: f, config: CONFIG, coleccion, id });
  assert.equal(leido.estado, 'ok');
  assert.deepEqual(leido.ej, ej);
  assert.match(f.pedidos[0].url, new RegExp(`documents/practicas-espacios/${UID}/progreso-libre/${id}\\?`));

  assert.equal(await escribirNube('semaforo', CODIGO, ej, 'es', { fetch: f, config: CONFIG, coleccion, id }), true);
  assert.equal(f.pedidos[1].metodo, 'PATCH');
  assert.match(f.pedidos[1].url, new RegExp(`/practicas-espacios/${UID}/progreso-libre/${id}\\?`));

  const g = fetchFalso({ [`practicas-espacios/${UID}/asignaciones/${CODIGO}`]: { json: { fields: { tareas: { arrayValue: { values: [{ integerValue: '5' }] } } } } } });
  assert.deepEqual(await leerAsignacion(CODIGO, { fetch: g, config: CONFIG, coleccion: coleccionEspacio(UID, 'asignaciones') }), { tareas: [5] });
  assert.equal(await leerAsignacion(CODIGO, { fetch: g, config: CONFIG }), null, 'sin colección, la antigua: 404');
  assert.match(g.pedidos[1].url, /practicas-asignaciones\//);

  const vacio = fetchFalso({});
  assert.equal((await leerNube('semaforo', CODIGO, { fetch: vacio, config: CONFIG, coleccion, id })).estado, 'vacio');
});

test('leerBusqueda y leerConfig: los cuatro estados', async () => {
  const fila = { fields: { profesor: { stringValue: UID }, n: { integerValue: '14' }, alta: { integerValue: '1' } } };
  assert.deepEqual(leerBusquedaRest(fila), { profesor: UID, n: 14 });
  assert.equal(leerBusquedaRest({ fields: { profesor: { stringValue: UID } } }), null);
  assert.equal(leerBusquedaRest({ fields: { profesor: { stringValue: UID }, n: { integerValue: '0' } } }), null);
  assert.equal(leerBusquedaRest(null), null);
  assert.equal(leerConfigRest({ fields: { json: { stringValue: '{}' } } }), '{}');
  assert.equal(leerConfigRest({ fields: {} }), null);

  const ok = fetchFalso({ [`practicas-alumnos/${CODIGO}`]: { json: fila }, [`${UID}/config/tareas`]: { json: { fields: { json: { stringValue: '{"a":1}' } } } } });
  assert.deepEqual(await leerBusqueda(CODIGO, { fetch: ok, config: CONFIG }), { estado: 'ok', profesor: UID, n: 14 });
  assert.deepEqual(await leerConfig(UID, { fetch: ok, config: CONFIG }), { estado: 'ok', json: '{"a":1}' });

  assert.equal((await leerBusqueda(CODIGO, { fetch: fetchFalso({}), config: CONFIG })).estado, 'vacio');
  assert.equal((await leerBusqueda(CODIGO, { fetch: fetchFalso({ [CODIGO]: { status: 403 } }), config: CONFIG })).estado, 'prohibido');
  assert.equal((await leerBusqueda(CODIGO, { fetch: fetchFalso({ [CODIGO]: { status: 500 } }), config: CONFIG })).estado, 'error');
  assert.equal((await leerBusqueda(CODIGO, { fetch: fetchFalso({ [CODIGO]: new Error('sin red') }), config: CONFIG })).estado, 'error');
  assert.equal((await leerBusqueda(CODIGO, { fetch: fetchFalso({ [CODIGO]: { json: { fields: {} } } }), config: CONFIG })).estado, 'error');
  assert.equal((await leerBusqueda(CODIGO, { fetch: ok, config: {} })).estado, 'error', 'sin Firebase configurado');
  assert.equal((await leerConfig(UID, { fetch: fetchFalso({}), config: CONFIG })).estado, 'vacio');
});

// --- resolverCodigo -----------------------------------------------------------------

/** Un almacén de mentira, como localStorage. */
function almacenFalso() {
  const datos = new Map();
  return { datos, getItem: k => datos.get(k) ?? null, setItem: (k, v) => { datos.set(k, String(v)); }, removeItem: k => { datos.delete(k); } };
}

const CONFIG_PROFESOR = { unidades: [{ n: 2, desde: '2026-12-14' }], tareas: [{ ...TAREAS[1], id: 1 }] };
const filaBusqueda = { fields: { profesor: { stringValue: UID }, n: { integerValue: '14' }, alta: { integerValue: '1' } } };
const nubeBuena = () => fetchFalso({
  [`practicas-alumnos/${CODIGO}`]: { json: filaBusqueda },
  [`practicas-espacios/${UID}/config/tareas`]: { json: { fields: { json: { stringValue: configAJSON(CONFIG_PROFESOR) } } } },
});

// Tarea 72: un código de 4 del modo antiguo puede estar registrado (los de Juan Luis
// pasan tal cual) o no; uno de 4 generado al azar es como uno de 8.
const ANTIGUO = codigoAlumno(13);
const filaAntiguo = { fields: { profesor: { stringValue: UID }, n: { integerValue: '60' }, alta: { integerValue: '1' } } };
const nubeConAntiguo = () => fetchFalso({
  [`practicas-alumnos/${ANTIGUO}`]: { json: filaAntiguo },
  [`practicas-espacios/${UID}/config/tareas`]: { json: { fields: { json: { stringValue: configAJSON(CONFIG_PROFESOR) } } } },
});
const AHORA = Date.UTC(2026, 9, 24, 10, 0);

test('resolverCodigo: un código de 4 antiguo que la nube no conoce (404) es del modo antiguo, como siempre, y se recuerda un rato', async () => {
  const almacen = almacenFalso();
  const f = fetchFalso({});
  const r = await resolverCodigo(ANTIGUO, { fetch: f, almacen, config: CONFIG, ahora: AHORA });
  assert.deepEqual(r, { modo: 'antiguo', n: 13 });
  assert.equal(f.pedidos.length, 1);
  assert.ok(f.pedidos[0].url.includes(`practicas-alumnos/${ANTIGUO}`), 'pregunta por el propio código');
  assert.equal(almacen.datos.get(claveAntiguo(ANTIGUO)), String(AHORA));
  assert.equal(almacen.datos.has(claveEspacio(ANTIGUO)), false);
  // Dentro de la vigencia, sin preguntar (otra página, otra práctica…).
  const g = fetchFalso({});
  assert.deepEqual(await resolverCodigo(ANTIGUO.toLowerCase(), { fetch: g, almacen, config: CONFIG, ahora: AHORA + VIGENCIA_ANTIGUO - 1 }), { modo: 'antiguo', n: 13 });
  assert.equal(g.pedidos.length, 0);
  // Pasada la vigencia, se vuelve a preguntar: si entretanto lo han registrado (tarea 70), ya es del sistema nuevo.
  const h = nubeConAntiguo();
  const s = await resolverCodigo(ANTIGUO, { fetch: h, almacen, config: CONFIG, ahora: AHORA + VIGENCIA_ANTIGUO });
  assert.equal(s.modo, 'nuevo');
  assert.equal(s.profesor, UID);
  assert.equal(s.n, 60);
  assert.equal(h.pedidos.length, 2);
  assert.equal(almacen.datos.has(claveAntiguo(ANTIGUO)), false, 'ya no se recuerda como antiguo');
  assert.ok(almacen.datos.has(claveEspacio(ANTIGUO)));
  // Una hora rara (reloj cambiado hacia atrás) no alarga la vigencia.
  const k = fetchFalso({});
  const almacen2 = almacenFalso();
  almacen2.setItem(claveAntiguo(ANTIGUO), String(AHORA + 1000));
  await resolverCodigo(ANTIGUO, { fetch: k, almacen: almacen2, config: CONFIG, ahora: AHORA });
  assert.equal(k.pedidos.length, 1);
});

test('resolverCodigo: un código de 4 antiguo ya registrado es del sistema nuevo, con su profesor, su número y sus tareas', async () => {
  const almacen = almacenFalso();
  const r = await resolverCodigo(ANTIGUO, { fetch: nubeConAntiguo(), almacen, config: CONFIG, ahora: AHORA });
  assert.deepEqual(r, { modo: 'nuevo', profesor: UID, n: 60, config: CONFIG_PROFESOR, desdeCache: false });
  // Con la copia del navegador de que es del nuevo, se pregunta siempre (aunque hubiera un «antiguo» reciente).
  almacen.setItem(claveAntiguo(ANTIGUO), String(AHORA));
  const f = nubeConAntiguo();
  assert.equal((await resolverCodigo(ANTIGUO, { fetch: f, almacen, config: CONFIG, ahora: AHORA })).modo, 'nuevo');
  assert.equal(f.pedidos.length, 2);
});

test('resolverCodigo: un código de 4 antiguo sin red, sin permiso o con la nube caída: la copia si la hay; si no, el modo antiguo', async () => {
  const sinRed = fetchFalso({ [ANTIGUO]: new Error('sin red') });
  const prohibido = fetchFalso({ [ANTIGUO]: { status: 403 } });   // reglas aún sin publicar
  const caida = fetchFalso({ [ANTIGUO]: { status: 500 } });
  for (const f of [sinRed, prohibido, caida]) {
    const almacen = almacenFalso();
    assert.deepEqual(await resolverCodigo(ANTIGUO, { fetch: f, almacen, config: CONFIG, ahora: AHORA }), { modo: 'antiguo', n: 13 });
    assert.equal(almacen.datos.size, 0, 'sin respuesta de la nube no se recuerda nada');
  }
  // Con copia de que está registrado: la copia.
  const almacen = almacenFalso();
  await resolverCodigo(ANTIGUO, { fetch: nubeConAntiguo(), almacen, config: CONFIG, ahora: AHORA });
  const r = await resolverCodigo(ANTIGUO, { fetch: sinRed, almacen, config: CONFIG, ahora: AHORA });
  assert.equal(r.modo, 'nuevo');
  assert.equal(r.desdeCache, true);
  assert.equal(r.n, 60);
  // Sin almacén (navegación privada), tampoco rompe.
  assert.deepEqual(await resolverCodigo(ANTIGUO, { fetch: sinRed, almacen: null, config: CONFIG }), { modo: 'antiguo', n: 13 });
});

test('resolverCodigo: un código de 4 generado (sin la comprobación antigua) es como uno de 8', async () => {
  const NUEVO4 = 'K7QM';
  assert.equal(leerCodigoAlumno(NUEVO4), null);
  const nube4 = () => fetchFalso({
    [`practicas-alumnos/${NUEVO4}`]: { json: filaBusqueda },
    [`practicas-espacios/${UID}/config/tareas`]: { json: { fields: { json: { stringValue: configAJSON(CONFIG_PROFESOR) } } } },
  });
  const almacen = almacenFalso();
  const r = await resolverCodigo('k7qm', { fetch: nube4(), almacen, config: CONFIG, ahora: AHORA });
  assert.deepEqual(r, { modo: 'nuevo', profesor: UID, n: 14, config: CONFIG_PROFESOR, desdeCache: false });
  const sinRed = fetchFalso({ [NUEVO4]: new Error('sin red') });
  assert.equal((await resolverCodigo(NUEVO4, { fetch: sinRed, almacen, config: CONFIG, ahora: AHORA })).desdeCache, true);
  assert.deepEqual(await resolverCodigo(NUEVO4, { fetch: sinRed, almacen: almacenFalso(), config: CONFIG, ahora: AHORA }), { error: 'sin-red' });
  // 404: no existe (no hay modo antiguo al que volver), y no se recuerda como antiguo.
  const vacio = almacenFalso();
  assert.deepEqual(await resolverCodigo(NUEVO4, { fetch: fetchFalso({}), almacen: vacio, config: CONFIG, ahora: AHORA }), { error: 'no-existe' });
  assert.equal(vacio.datos.size, 0);
  await resolverCodigo(NUEVO4, { fetch: fetchFalso({}), almacen, config: CONFIG, ahora: AHORA });
  assert.equal(almacen.datos.has(claveEspacio(NUEVO4)), false, 'la copia se olvida');
});

test('resolverCodigo: un código que no tiene el formato de ninguno', async () => {
  const f = fetchFalso({});
  for (const malo of ['', 'ABC', 'AB1D', 'ABCDE', 'K7QMP3X', 'K7QMP3X0', null]) {
    assert.deepEqual(await resolverCodigo(malo, { fetch: f, almacen: almacenFalso(), config: CONFIG }), { error: 'no-valido' }, String(malo));
  }
  assert.equal(f.pedidos.length, 0);
});

test('resolverCodigo: un código de 8 lee profesor, número y tareas, y los guarda', async () => {
  const almacen = almacenFalso();
  const f = nubeBuena();
  const r = await resolverCodigo('k7qm-p3xa', { fetch: f, almacen, config: CONFIG });
  assert.equal(r.modo, 'nuevo');
  assert.equal(r.profesor, UID);
  assert.equal(r.n, 14);
  assert.deepEqual(r.config, CONFIG_PROFESOR);
  assert.equal(r.desdeCache, false);
  assert.equal(f.pedidos.length, 2);
  assert.ok(almacen.datos.has(claveEspacio(CODIGO)));
  assert.ok(!JSON.stringify([...almacen.datos]).includes('nombre'), 'solo profesor, número y tareas');
});

test('resolverCodigo: sin red sigue con la copia del navegador', async () => {
  const almacen = almacenFalso();
  await resolverCodigo(CODIGO, { fetch: nubeBuena(), almacen, config: CONFIG });
  const sinRed = fetchFalso({ [CODIGO]: new Error('sin red') });
  const r = await resolverCodigo(CODIGO, { fetch: sinRed, almacen, config: CONFIG });
  assert.equal(r.modo, 'nuevo');
  assert.equal(r.desdeCache, true);
  assert.equal(r.profesor, UID);
  assert.equal(r.n, 14);
  assert.deepEqual(r.config, CONFIG_PROFESOR);
  // Sin copia y sin red: no se puede saber.
  assert.deepEqual(await resolverCodigo(CODIGO, { fetch: sinRed, almacen: almacenFalso(), config: CONFIG }), { error: 'sin-red' });
  // Sin almacén (navegación privada) tampoco rompe.
  assert.deepEqual(await resolverCodigo(CODIGO, { fetch: sinRed, almacen: null, config: CONFIG }), { error: 'sin-red' });
  assert.equal((await resolverCodigo(CODIGO, { fetch: nubeBuena(), almacen: null, config: CONFIG })).profesor, UID);
});

test('resolverCodigo: la búsqueda da 404 → no existe, y se olvida la copia', async () => {
  const almacen = almacenFalso();
  await resolverCodigo(CODIGO, { fetch: nubeBuena(), almacen, config: CONFIG });
  const r = await resolverCodigo(CODIGO, { fetch: fetchFalso({}), almacen, config: CONFIG });
  assert.deepEqual(r, { error: 'no-existe' });
  assert.equal(almacen.datos.size, 0);
});

test('resolverCodigo: la configuración falla o no existe', async () => {
  // Búsqueda bien, configuración caída y copia del mismo profesor: la copia.
  const almacen = almacenFalso();
  await resolverCodigo(CODIGO, { fetch: nubeBuena(), almacen, config: CONFIG });
  const configCaida = fetchFalso({ [`practicas-alumnos/${CODIGO}`]: { json: filaBusqueda }, [`${UID}/config/tareas`]: { status: 500 } });
  const r = await resolverCodigo(CODIGO, { fetch: configCaida, almacen, config: CONFIG });
  assert.equal(r.desdeCache, true);
  assert.deepEqual(r.config, CONFIG_PROFESOR);
  // Sin copia: configuración vacía y aviso.
  const s = await resolverCodigo(CODIGO, { fetch: configCaida, almacen: almacenFalso(), config: CONFIG });
  assert.deepEqual(s.config, { unidades: [], tareas: [] });
  assert.equal(s.sinConfig, true);
  assert.equal(s.profesor, UID);
  // Profesor que aún no ha guardado tareas (404): vacía, sin aviso.
  const sinTareas = fetchFalso({ [`practicas-alumnos/${CODIGO}`]: { json: filaBusqueda } });
  const v = await resolverCodigo(CODIGO, { fetch: sinTareas, almacen, config: CONFIG });
  assert.deepEqual(v.config, { unidades: [], tareas: [] });
  assert.equal(v.sinConfig, undefined);
  assert.equal(v.desdeCache, false);
});
