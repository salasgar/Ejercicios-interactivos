// Progreso en la nube compartido entre aparatos (tarea 38 del reparto PU2):
// la fusión de lo del navegador con lo de la nube (conmutativa, idempotente,
// nunca deja sin terminar algo terminado, respeta el tope de un ejercicio sin
// terminar, entiende los estados antiguos), la lectura y la escritura por REST
// contra un Firestore de mentira, la página de la semana poniendo de acuerdo
// navegador y nube, y en el panel los puntos de la tarea (la misma cuenta que
// el marcador del alumno) y «qué falla más».

import test from 'node:test';
import assert from 'node:assert/strict';
import { practicaPorSlug } from '../practicas/_comun/catalogo.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { ejercicioNuevo, anotar, migrarProgreso } from '../practicas/_comun/contador.js';
import { estadoTarea } from '../practicas/_comun/tareas.js';
import {
  fusionarEjercicio, fusionarProgreso, canonico, leerNube, escribirNube, subirFusionado, urlDocumento, leerDocumentoRest,
  idDocumentoTarea, idDocumentoPractica, claveProgresoTarea, urlAsignacion, leerAsignacion, leerAsignacionRest,
  COLECCION_TAREAS, COLECCION_ASIGNACIONES,
} from '../practicas/_comun/nube.js';
import { sincronizarGuardado, adoptarIdioma, claveProgreso, claveIdiomaFijo, progresoGuardado } from '../practicas/_comun/base.js';
import { juntarTareas, juntarFallos } from '../practicas/resultados.js';

const CONFIG = { apiKey: 'clave', projectId: 'proyecto' };

/** Un ejercicio tras una serie de respuestas (true = acierto), como lo deja la base. */
function tras(respuestas, dia = 50) {
  return respuestas.reduce((e, r) => anotar(e, r, dia), ejercicioNuevo());
}

/** Estados al azar, de todo tipo: sin empezar, a medias, con reinicios, terminados, antiguos. */
function estadoAlAzar(rng) {
  const tipo = rng.entero(0, 5);
  if (tipo === 0) return null;
  if (tipo === 1) return { pendientes: rng.entero(0, 20), fallos: rng.entero(0, 6), terminado: false };   // modelo antiguo
  if (tipo === 2) return { pendientes: 0, fallos: rng.entero(0, 6), terminado: true, dia: rng.entero(30, 60) };   // antiguo terminado
  const respuestas = Array.from({ length: rng.entero(1, 30) }, () => rng.entero(0, 3) > 0);
  const e = tras(respuestas, rng.entero(30, 60));
  if (rng.entero(0, 3) === 0) e.repeticiones = rng.entero(1, 3);
  if (rng.entero(0, 3) === 0) Object.assign(e, { en_aciertos: rng.entero(0, 5), en_fallos: rng.entero(0, 3) });
  return e;
}

// --- La fusión ------------------------------------------------------------------------------

test('fusión: terminado gana a sin terminar, y entre dos sin terminar, más puntos', () => {
  const hecho = tras(Array(10).fill(true), 48);
  const medias = tras([true, true, false, true]);
  assert.equal(fusionarEjercicio(hecho, medias).terminado, true);
  assert.equal(fusionarEjercicio(medias, hecho).terminado, true);
  assert.equal(fusionarEjercicio(medias, hecho).dia, 48);
  assert.equal(fusionarEjercicio(hecho, medias).fallos, 1, 'los fallos del otro aparato se conservan (máximo)');
  const mas = tras([true, true, true, true, true, true]);
  assert.equal(fusionarEjercicio(medias, mas).puntos, mas.puntos);
  assert.equal(fusionarEjercicio(mas, medias).puntos, mas.puntos);
  assert.equal(fusionarEjercicio(mas, medias).fallos, 1);
  // El que gana va entero: puntos, vidas, racha y aciertos (número de paso en la criba) juntos.
  const f = fusionarEjercicio(medias, mas);
  assert.deepEqual([f.puntos, f.vidas, f.racha, f.aciertos], [mas.puntos, mas.vidas, mas.racha, mas.aciertos]);
  // Un lado vacío no cuenta.
  assert.deepEqual(fusionarEjercicio(null, medias), medias);
  assert.deepEqual(fusionarEjercicio(medias, undefined), medias);
  assert.equal(fusionarEjercicio(null, null), null);
});

test('fusión: entre dos terminados, el día en que se terminó primero; reinicios y repeticiones, el máximo', () => {
  const a = { ...tras(Array(10).fill(true), 45), repeticiones: 2 };
  const b = { ...tras([false, ...Array(10).fill(true)], 47), reinicios: 1 };
  for (const f of [fusionarEjercicio(a, b), fusionarEjercicio(b, a)]) {
    assert.deepEqual([f.terminado, f.dia, f.fallos, f.repeticiones, f.reinicios], [true, 45, 1, 2, 1]);
  }
  // Un día 0 («no se sabe») pierde contra uno conocido.
  assert.equal(fusionarEjercicio({ ...a, dia: 0 }, b).dia, 47);
});

test('fusión: conmutativa, idempotente y nunca deja sin terminar algo terminado (2000 pares al azar)', () => {
  const rng = crearRng(20261015);
  for (let i = 0; i < 2000; i++) {
    const [a, b, c] = [estadoAlAzar(rng), estadoAlAzar(rng), estadoAlAzar(rng)];
    const ab = fusionarEjercicio(a, b);
    assert.equal(canonico(ab), canonico(fusionarEjercicio(b, a)), `conmutativa: ${canonico(a)} · ${canonico(b)}`);
    assert.equal(canonico(fusionarEjercicio(ab, ab)), canonico(ab), 'fusionar consigo mismo no cambia nada');
    assert.equal(canonico(fusionarEjercicio(ab, b)), canonico(ab), 'fusionar otra vez con lo mismo no cambia nada');
    assert.equal(canonico(fusionarEjercicio(a, ab)), canonico(ab));
    if (a?.terminado || b?.terminado) assert.equal(ab.terminado, true);
    for (const campo of ['fallos', 'reinicios', 'repeticiones']) {
      if (ab) assert.equal(ab[campo] ?? 0, Math.max(a?.[campo] ?? 0, b?.[campo] ?? 0), campo);
    }
    // Da igual el orden en que lleguen tres aparatos.
    assert.equal(canonico(fusionarEjercicio(fusionarEjercicio(a, b), c)), canonico(fusionarEjercicio(fusionarEjercicio(c, b), a)));
  }
});

test('fusión: un ejercicio sin terminar no pasa de objetivo − 1 puntos', () => {
  const raro = { ...ejercicioNuevo(), puntos: 12, objetivo: 10, aciertos: 12 };
  assert.equal(fusionarEjercicio(raro, null).puntos, 9);
  assert.equal(fusionarEjercicio(raro, tras([true])).puntos, 9);
  assert.equal(fusionarEjercicio(raro, tras([true])).terminado, false);
});

test('fusión: estados antiguos (sin puntos) se fusionan y la base los migra bien después', () => {
  const antiguo = { pendientes: 7, fallos: 4, terminado: false };
  const nuevo = tras([true, true, true]);
  const f = fusionarEjercicio(antiguo, nuevo);
  assert.deepEqual([f.puntos, f.fallos], [3, 4]);
  assert.deepEqual(migrarProgreso({ ...ejercicioNuevo(), ...f }), { ...nuevo, fallos: 4 });
  const antiguoHecho = { pendientes: 0, fallos: 2, terminado: true, dia: 40 };
  const g = fusionarEjercicio(nuevo, antiguoHecho);
  assert.equal(g.terminado, true);
  const migrado = migrarProgreso(g);
  assert.deepEqual([migrado.terminado, migrado.puntos, migrado.fallos, migrado.dia], [true, 10, 2, 40]);
});

test('fusión de prácticas: posición a posición, con listas de distinto largo', () => {
  const hecho = tras(Array(10).fill(true));
  const f = fusionarProgreso([hecho], [null, tras([true]), tras([false])]);
  assert.equal(f.length, 3);
  assert.deepEqual([f[0].terminado, f[1].puntos, f[2].fallos], [true, 1, 1]);
  assert.deepEqual(fusionarProgreso(undefined, null), []);
});

// --- Firestore por REST, de mentira -------------------------------------------------------

/** Un Firestore en memoria que responde como el REST de verdad (404 si no existe). */
function nubeFalsa({ prohibido = false } = {}) {
  const docs = new Map();
  const peticiones = [];
  const fetch = async (url, opciones = {}) => {
    const doc = decodeURIComponent(new URL(url).pathname.split('/').pop());
    peticiones.push([opciones.method, doc]);
    if (prohibido && opciones.method === 'GET') return { ok: false, status: 403, json: async () => ({}) };
    if (opciones.method === 'PATCH') {
      docs.set(doc, JSON.parse(opciones.body));
      return { ok: true, status: 200, json: async () => ({}) };
    }
    if (!docs.has(doc)) return { ok: false, status: 404, json: async () => ({ error: { status: 'NOT_FOUND' } }) };
    return { ok: true, status: 200, json: async () => docs.get(doc) };
  };
  const ej = doc => leerDocumentoRest(docs.get(doc))?.ej ?? null;
  return { fetch, docs, peticiones, ej };
}

test('nube: URL del documento y lectura del formato REST', () => {
  assert.equal(urlDocumento('recta', 'ABCD', CONFIG), 'https://firestore.googleapis.com/v1/projects/proyecto/databases/(default)/documents/practicas/recta--ABCD?key=clave');
  assert.equal(urlDocumento('recta', 'ABCD', {}), null);
  assert.deepEqual(leerDocumentoRest({ fields: { estado: { stringValue: '{"v":1,"idioma":"es","ej":[]}' } } }), { ej: [], idioma: 'es' });
  assert.equal(leerDocumentoRest({ fields: { estado: { stringValue: 'basura' } } }), null);
  assert.equal(leerDocumentoRest(null), null);
});

test('nube: colección e id del documento como parámetros (tareas v2); sin ellos, lo de siempre', async () => {
  // Ids y claves nuevos.
  assert.equal(idDocumentoTarea(2, 'semaforo', 'K7QM'), 't2--semaforo--K7QM');
  assert.equal(idDocumentoPractica('semaforo', 'K7QM'), 'semaforo--K7QM');
  assert.equal(claveProgresoTarea('semaforo', 'K7QM', 2), 'practicas.v1.semaforo.K7QM.t2');
  assert.equal(COLECCION_TAREAS, 'practicas-tareas');
  assert.equal(COLECCION_ASIGNACIONES, 'practicas-asignaciones');
  const base = 'https://firestore.googleapis.com/v1/projects/proyecto/databases/(default)/documents/';
  assert.equal(urlDocumento('semaforo', 'K7QM', CONFIG, { coleccion: COLECCION_TAREAS, id: idDocumentoTarea(2, 'semaforo', 'K7QM') }), `${base}practicas-tareas/t2--semaforo--K7QM?key=clave`);
  assert.equal(urlDocumento('semaforo', 'K7QM', CONFIG, {}), urlDocumento('semaforo', 'K7QM', CONFIG), 'sin opciones, practicas/{slug}--{código}');
  assert.equal(urlDocumento('semaforo', 'K7QM', CONFIG, { coleccion: undefined, id: undefined }), `${base}practicas/semaforo--K7QM?key=clave`);
  assert.equal(urlAsignacion('K7QM', CONFIG), `${base}practicas-asignaciones/K7QM?key=clave`);
  assert.equal(urlAsignacion('K7QM', {}), null);

  // Una nube de mentira que distingue la colección: el progreso de la tarea y el de la práctica libre no se mezclan.
  const docs = new Map();
  const fetch = async (url, opciones = {}) => {
    const ruta = new URL(url).pathname.split('/documents/')[1];
    if (opciones.method === 'PATCH') { docs.set(ruta, JSON.parse(opciones.body)); return { ok: true, status: 200, json: async () => ({}) }; }
    return docs.has(ruta) ? { ok: true, status: 200, json: async () => docs.get(ruta) } : { ok: false, status: 404, json: async () => ({}) };
  };
  const op = { fetch, config: CONFIG };
  const deTarea = { ...op, coleccion: COLECCION_TAREAS, id: idDocumentoTarea(2, 'semaforo', 'K7QM') };
  await escribirNube('semaforo', 'K7QM', [tras([true, true])], 'es', deTarea);
  assert.deepEqual([...docs.keys()], ['practicas-tareas/t2--semaforo--K7QM']);
  assert.equal((await leerNube('semaforo', 'K7QM', op)).estado, 'vacio', 'la práctica libre no ve lo de la tarea');
  assert.equal((await leerNube('semaforo', 'K7QM', deTarea)).ej[0].puntos, 2);
  await subirFusionado('semaforo', 'K7QM', [tras([true])], 'es', op);
  assert.deepEqual([...docs.keys()].sort(), ['practicas-tareas/t2--semaforo--K7QM', 'practicas/semaforo--K7QM']);
  assert.equal(leerDocumentoRest(docs.get('practicas-tareas/t2--semaforo--K7QM')).ej[0].puntos, 2, 'subir a la práctica libre no toca el documento de la tarea');
  await subirFusionado('semaforo', 'K7QM', [tras([true, true, true])], 'es', deTarea);
  assert.equal(leerDocumentoRest(docs.get('practicas-tareas/t2--semaforo--K7QM')).ej[0].puntos, 3);
  assert.equal(leerDocumentoRest(docs.get('practicas/semaforo--K7QM')).ej[0].puntos, 1);
});

test('nube: la asignación de tareas de un alumno se lee con el mismo tiempo máximo y sin lanzar nunca', async () => {
  const doc = ids => ({ fields: { tareas: { arrayValue: ids.length ? { values: ids.map(i => ({ integerValue: String(i) })) } : {} }, actualizado: { integerValue: '1' } } });
  assert.deepEqual(leerAsignacionRest(doc([7, 9])), { tareas: [7, 9] });
  assert.deepEqual(leerAsignacionRest(doc([])), { tareas: [] }, 'lista vacía: Firestore no manda «values»');
  assert.equal(leerAsignacionRest({ fields: {} }), null);
  assert.equal(leerAsignacionRest({ fields: { tareas: { arrayValue: { values: [{ stringValue: 'x' }] } } } }), null);
  assert.equal(leerAsignacionRest(null), null);

  const sirve = json => async url => { assert.match(url, /\/practicas-asignaciones\/K7QM\?key=clave$/); return { ok: true, status: 200, json: async () => json }; };
  assert.deepEqual(await leerAsignacion('K7QM', { fetch: sirve(doc([3])), config: CONFIG }), { tareas: [3] });
  assert.equal(await leerAsignacion('K7QM', { fetch: async () => ({ ok: false, status: 404, json: async () => ({}) }), config: CONFIG }), null, 'sin documento');
  assert.equal(await leerAsignacion('K7QM', { fetch: async () => ({ ok: false, status: 403, json: async () => ({}) }), config: CONFIG }), null, 'sin permiso');
  assert.equal(await leerAsignacion('K7QM', { fetch: async () => { throw new TypeError('sin red'); }, config: CONFIG }), null);
  assert.equal(await leerAsignacion('K7QM', { fetch: sirve(doc([3])), config: {} }), null, 'sin Firebase configurado');
  const inicio = Date.now();
  assert.equal(await leerAsignacion('K7QM', { fetch: () => new Promise(() => {}), espera: 30, config: CONFIG }), null);
  assert.ok(Date.now() - inicio < 1000, 'no deja esperando más de lo pedido');
});

test('nube: leer da ok, vacio (404), prohibido (403) o error (sin red, tiempo agotado), sin lanzar nunca', async () => {
  const nube = nubeFalsa();
  const op = { fetch: nube.fetch, config: CONFIG };
  assert.equal((await leerNube('recta', 'ABCD', op)).estado, 'vacio');
  await escribirNube('recta', 'ABCD', [tras([true])], 'es', op);
  const leido = await leerNube('recta', 'ABCD', op);
  assert.deepEqual([leido.estado, leido.idioma, leido.ej[0].puntos], ['ok', 'es', 1]);
  assert.equal((await leerNube('recta', 'ABCD', { fetch: nubeFalsa({ prohibido: true }).fetch, config: CONFIG })).estado, 'prohibido');
  assert.equal((await leerNube('recta', 'ABCD', { fetch: async () => { throw new TypeError('sin red'); }, config: CONFIG })).estado, 'error');
  const inicio = Date.now();
  const colgada = await leerNube('recta', 'ABCD', { fetch: () => new Promise(() => {}), espera: 30, config: CONFIG });
  assert.equal(colgada.estado, 'error');
  assert.ok(Date.now() - inicio < 1000, 'no deja esperando más de lo pedido');
  assert.equal((await leerNube('recta', 'ABCD', { fetch: async () => ({ ok: false, status: 500 }), config: CONFIG })).estado, 'error');
  assert.equal((await leerNube('recta', 'ABCD', { fetch: nube.fetch, config: {} })).estado, 'error', 'sin Firebase configurado');
});

test('nube: dos aparatos que suben por turnos no se machacan (cada subida lee y fusiona)', async () => {
  const nube = nubeFalsa();
  const op = { fetch: nube.fetch, config: CONFIG };
  const movil = [tras(Array(10).fill(true)), null, null];
  const ordenador = [tras([true, false]), tras([true, true, true]), null];
  await subirFusionado('recta', 'ABCD', movil, 'alterno', op);
  await subirFusionado('recta', 'ABCD', ordenador, 'alterno', op);
  const enNube = nube.ej('recta--ABCD');
  assert.equal(enNube[0].terminado, true, 'el ordenador no deja sin terminar lo que terminó el móvil');
  assert.equal(enNube[0].fallos, 1);
  assert.equal(enNube[1].puntos, 3);
  // Si la nube ya lo tiene todo, no se vuelve a escribir.
  const antes = nube.peticiones.filter(([m]) => m === 'PATCH').length;
  await subirFusionado('recta', 'ABCD', movil, 'alterno', op);
  assert.equal(nube.peticiones.filter(([m]) => m === 'PATCH').length, antes);
  // Sin poder leer (reglas antiguas), se sube lo de este aparato fusionado con lo último que se supo.
  const sinGet = nubeFalsa({ prohibido: true });
  await subirFusionado('recta', 'ABCD', ordenador, 'alterno', { fetch: sinGet.fetch, config: CONFIG, ultimo: movil });
  assert.equal(sinGet.ej('recta--ABCD')[0].terminado, true);
});

// --- La página de la semana: navegador y nube de acuerdo ------------------------------------------

function conAlmacen(fn) {
  const almacen = new Map();
  globalThis.localStorage = { getItem: k => almacen.get(k) ?? null, setItem: (k, v) => almacen.set(k, String(v)), removeItem: k => almacen.delete(k) };
  return Promise.resolve(fn(almacen)).finally(() => { delete globalThis.localStorage; });
}

test('semana: en un aparato nuevo trae lo de la nube, y lo que solo está aquí lo sube', () => conAlmacen(async almacen => {
  const nube = nubeFalsa();
  const op = { fetch: nube.fetch, config: CONFIG };
  // El móvil terminó recta/1 y lo subió; este ordenador no tiene nada de la recta,
  // pero sí el semáforo/1 a medias, que la nube no tiene.
  await escribirNube('recta', 'ABCD', [tras(Array(10).fill(true), 49)], 'alterno', op);
  almacen.set(claveProgreso('semaforo', 'ABCD'), JSON.stringify({ ej: [tras([true, true])] }));
  assert.equal((await sincronizarGuardado('recta', 'ABCD', op)).estado, 'ok');
  assert.equal((await sincronizarGuardado('semaforo', 'ABCD', op)).estado, 'vacio');
  assert.equal(progresoGuardado('recta', 'ABCD')[0].terminado, true, 'el ordenador ve lo del móvil');
  assert.equal(nube.ej('semaforo--ABCD')[0].puntos, 2, 'la nube recibe lo del ordenador');
  // Una práctica sin nada en ningún sitio no crea documentos.
  await sincronizarGuardado('criba', 'ABCD', op);
  assert.equal(nube.docs.has('criba--ABCD'), false);
  // Sin red, no se toca nada.
  const antes = almacen.get(claveProgreso('recta', 'ABCD'));
  assert.equal((await sincronizarGuardado('recta', 'ABCD', { fetch: async () => { throw new Error('sin red'); }, config: CONFIG })).estado, 'error');
  assert.equal(almacen.get(claveProgreso('recta', 'ABCD')), antes);
}));

test('semana: el idioma fijado en otro aparato se adopta si aquí no hay nada dicho', () => conAlmacen(async () => {
  adoptarIdioma('ABCD', 'es');
  assert.equal(localStorage.getItem(claveIdiomaFijo('ABCD')), 'es');
  localStorage.setItem(claveIdiomaFijo('EFGH'), 'alterno');
  adoptarIdioma('EFGH', 'en');
  assert.equal(localStorage.getItem(claveIdiomaFijo('EFGH')), 'alterno', '«alterno» puesto a propósito no se pisa');
  adoptarIdioma('JKLM', 'alterno');
  assert.equal(localStorage.getItem(claveIdiomaFijo('JKLM')), null);
}));

// --- El panel -----------------------------------------------------------------------------

test('panel: los puntos de la tarea son los mismos que ve el alumno en su marcador', () => {
  const tarea = { id: 1, progresoPorPractica: true, estrella: [['recta', 1], ['recta', 2]], elegir: [['semaforo', 1], ['semaforo', 2], ['semaforo', 3]], nElegir: 2 };
  const rng = crearRng(38);
  for (let i = 0; i < 200; i++) {
    const recta = [estadoAlAzar(rng), estadoAlAzar(rng), null].map(e => (e?.puntos === undefined ? null : e));
    const semaforo = [estadoAlAzar(rng), estadoAlAzar(rng), estadoAlAzar(rng), null].map(e => (e?.puntos === undefined ? null : e));
    const local = { recta, semaforo };
    const delAlumno = estadoTarea(tarea, (slug, n) => local[slug][n - 1] ?? null);
    const nube = [{ practica: practicaPorSlug('recta').id, indice: 5, ej: recta }, { practica: practicaPorSlug('semaforo').id, indice: 5, ej: semaforo }];
    const [fila] = juntarTareas(['', '', '', '', '', 'Ana'], [], [], nube, [tarea]);
    assert.deepEqual([fila.tareas[0].puntos, fila.tareas[0].maximo], [delAlumno.puntos, delAlumno.maximo]);
  }
  // A mano: recta/1 terminado (10), recta/2 con 5 de 10 (5), de elegir uno terminado (10) y otro con 3 (3).
  const nube = [
    { practica: practicaPorSlug('recta').id, indice: 0, ej: [{ terminado: true, puntos: 10, objetivo: 10, fallos: 0 }, { terminado: false, puntos: 5, objetivo: 10, aciertos: 5, fallos: 0 }] },
    { practica: practicaPorSlug('semaforo').id, indice: 0, ej: [{ terminado: false, puntos: 3, objetivo: 10, aciertos: 3, fallos: 0 }, null, { terminado: true, puntos: 10, objetivo: 10, fallos: 2 }] },
  ];
  assert.equal(juntarTareas(['Ana'], [], [], nube, [tarea])[0].tareas[0].puntos, 28);
  // Un código de la tarea que dice «terminado» cuenta 10 aunque la nube no lo sepa.
  const conCodigo = juntarTareas(['Ana'], [{ tarea: 1, indice: 0, estrella: [true, true], elegir: [true, false, true], fallos: 0, tope: false, dia: 50 }], [], nube, [tarea]);
  assert.equal(conCodigo[0].tareas[0].puntos, 40);
});

test('panel: «qué falla más», una fila por ejercicio, de más a menos fallos por alumno', () => {
  const recta = practicaPorSlug('recta');
  const nube = [
    // Ana: ej. 1 terminado con 2 fallos; ej. 2 a medias con 6 fallos y 1 reinicio.
    { practica: recta.id, indice: 0, ej: [{ terminado: true, fallos: 2, aciertos: 10 }, { terminado: false, fallos: 6, aciertos: 1, reinicios: 1 }] },
    // Luis: ej. 1 a medias con 4 fallos.
    { practica: recta.id, indice: 1, ej: [{ terminado: false, fallos: 4, aciertos: 2 }] },
    // El código de prueba del profesor (no está en la lista): no cuenta.
    { practica: recta.id, indice: 60, ej: [{ terminado: false, fallos: 50, aciertos: 0 }] },
  ];
  // Eva solo mandó un código de resultado: ej. 3 terminado con 15 fallos o más.
  const codigos = [{ practica: recta.id, indice: 2, ejercicios: [{ terminado: false, fallos: 0 }, { terminado: false, fallos: 0 }, { terminado: true, fallos: 15 }], dia: 50 }];
  const filas = juntarFallos(['Ana', 'Luis', 'Eva', 'Paco'], codigos, nube, [1, 2, 3].map(n => ({ practica: recta, n })));
  assert.deepEqual(filas.map(f => [f.n, f.empezados, f.terminados, f.fallos, f.fallosPorAlumno, f.reinicios, f.tope]), [
    [3, 1, 1, 15, 15, 0, true],
    [2, 1, 0, 6, 6, 1, false],
    [1, 2, 1, 6, 3, 0, false],
  ]);
  // Sin lista de nombres cuenta todo lo que haya (también el código 60).
  const todos = juntarFallos([], codigos, nube, [{ practica: recta, n: 1 }]);
  assert.deepEqual([todos[0].empezados, todos[0].fallos], [3, 56]);
});
