// Panel del profesor, modelo de tareas v2 (tarea 53 del reparto PU2): el reparto del
// id `t12--semaforo--K7QM`, `juntarTareas` con las dos clases de tarea (la 1 desde el
// progreso de práctica; las v2 desde `practicas-tareas`), el retraso, la vista
// «Retrasos» con tres alumnos, las asignaciones y el filtro de fallos por tarea.

import test from 'node:test';
import assert from 'node:assert/strict';
import { practicaPorSlug } from '../practicas/_comun/catalogo.js';
import { codigoAlumno, leerCodigoAlumno } from '../practicas/_comun/codigos.js';
import { TAREAS, diaDeFecha } from '../practicas/_comun/tareas.js';
import {
  juntarTareas, calcularRetrasos, asignacionesParaGuardar, leerDocumentos, leerAsignaciones, partirIdTarea,
  filtrarFallos, agruparFallos, juntarFallos, tareaPublicada, cumplidasDe,
  indicesDeCodigos, filasMisAlumnos, faltanCodigos, repartirCodigos, fusionarLeidos, desdeParaLeer, MARGEN_LECTURA,
  leerCodigoTareaEspacio,
} from '../practicas/resultados.js';
import { codigoTarea } from '../practicas/_comun/codigos.js';

test('«Obligatorias» y «Repaso»: solo las publicadas; las asignadas, si está marcado; el repaso sin total', () => {
  const hoy = diaDeFecha('2026-10-17');
  const tareas = [
    { id: 1, desde: '2026-10-16', hasta: '2026-10-22' },          // obligatoria publicada
    { id: 2, desde: '2026-10-26', hasta: '2026-10-29' },          // aún no publicada
    { id: 5, hasta: '2026-10-15', asignada: true },              // asignada
    { id: 11 },                                                  // repaso
    { id: 12 },                                                  // repaso
  ];
  assert.deepEqual(tareas.map(t => tareaPublicada(t, hoy)), [true, false, true, true, true]);
  const fila = tipos => ({ tareas: tareas.map((t, i) => ({ id: t.id, ...tipos[i] })) });
  const ob = (cumplida = false) => ({ tipo: 'obligatoria', cumplida });
  const rep = (cumplida = false) => ({ tipo: 'repaso', cumplida });
  // Marcado en la 5: dos obligatorias (la 1 y la 5); la 2 no cuenta aunque la haya hecho.
  assert.deepEqual(cumplidasDe(fila([ob(true), ob(true), { tipo: 'obligatoria_para_ti', cumplida: false }, rep(true), rep()]), tareas, hoy),
    { entregadas: 1, debidas: 2, repaso: 1 });
  // No marcado en la 5: la ve como repaso (y si la completa, cuenta como repaso).
  assert.deepEqual(cumplidasDe(fila([ob(true), ob(), { tipo: 'repaso', cumplida: true, noAsignado: true }, rep(true), rep(true)]), tareas, hoy),
    { entregadas: 1, debidas: 1, repaso: 3 });
});

const SEMAFORO = practicaPorSlug('semaforo').id;
const PLAZO = diaDeFecha('2026-10-22');

// Una tarea de un solo ejercicio ★ (semáforo 1), sin ejercicios a elegir.
const base = { unidad: 2, titulo: { es: 'Prueba', en: 'Test' }, estrella: [['semaforo', 1]], elegir: [], nElegir: 0 };
const v2 = { ...base, id: 90, hasta: '2026-10-22' };
const antigua = { ...base, id: 91, hasta: '2026-10-22', progresoPorPractica: true };
const asignada = { ...base, id: 92, hasta: '2026-10-22', asignada: true };

const ej = (dia) => [{ terminado: true, dia, aciertos: 10, fallos: 0 }];
const deTarea = (tarea, indice, dia) => ({ tarea, practica: SEMAFORO, indice, ej: ej(dia) });
const columnas = (filas, indice) => filas.find(f => f.indice === indice).tareas;

test('el id t12--semaforo--K7QM se parte en tarea, práctica y código', () => {
  assert.deepEqual(partirIdTarea('t12--semaforo--K7QM'), { tarea: 12, slug: 'semaforo', codigo: 'K7QM' });
  assert.equal(partirIdTarea('semaforo--K7QM'), null, 'el de práctica tiene dos trozos');
  assert.equal(partirIdTarea('12--semaforo--K7QM'), null);
  assert.equal(partirIdTarea('t12--semaforo--K7QM--x'), null);
});

test('leerDocumentos: cada colección con su forma de id, sin mezclarlas', () => {
  const estado = JSON.stringify({ v: 1, ej: ej(5) });
  // `indiceDe` de prueba: el de los códigos de 4 calculables (como los de siempre de Juan Luis).
  const leer = (docs, coleccion) => leerDocumentos(docs, coleccion, leerCodigoAlumno);
  const delaTarea = leer([{ id: `t2--semaforo--${codigoAlumno(3)}`, estado, actualizado: 7 }], 'progreso-tareas');
  assert.equal(delaTarea.length, 1);
  assert.deepEqual([delaTarea[0].tarea, delaTarea[0].practica, delaTarea[0].indice], [2, SEMAFORO, 3]);
  // Un documento de tarea metido en `progreso-libre` no se lee como progreso de práctica libre.
  assert.deepEqual(leer([{ id: `t2--semaforo--${codigoAlumno(3)}`, estado }], 'progreso-libre'), []);
  // Y uno de práctica en `progreso-tareas` tampoco se lee como de una tarea.
  assert.deepEqual(leer([{ id: `semaforo--${codigoAlumno(3)}`, estado }], 'progreso-tareas'), []);
  const libre = leer([{ id: `semaforo--${codigoAlumno(3)}`, estado }], 'progreso-libre');
  assert.equal(libre[0].tarea, undefined);
  assert.deepEqual(leer([{ id: `t2--semaforo--${codigoAlumno(3)}`, estado: 'no es json' }], 'progreso-tareas'), []);
  // Las colecciones del modo antiguo ya no se leen (tarea 71).
  for (const vieja of ['practicas', 'practicas-tareas', 'divisores', undefined]) assert.throws(() => leer([], vieja), /colección desconocida/);
});

test('leerAsignaciones: el id es el código y las tareas, una lista de enteros', () => {
  const r = leerAsignaciones([{ id: codigoAlumno(4), tareas: [92, 7] }, { id: 'ZZZZ', tareas: [1] }, { id: codigoAlumno(5), tareas: [] }, { id: codigoAlumno(6) }], leerCodigoAlumno);
  assert.deepEqual(r, [{ indice: 4, tareas: [92, 7] }, { indice: 5, tareas: [] }]);
});

test('REGLA DE PUBLICACIÓN: la tarea 1 se junta desde los documentos de práctica, y las v2 no los miran', () => {
  const tarea1 = TAREAS.find(t => t.id === 1);
  assert.equal(tarea1.progresoPorPractica, true);
  // Un alumno con TODOS los ejercicios de la tarea 1 terminados en sus documentos de práctica.
  const deNube = [];
  for (const [slug, n] of [...tarea1.estrella, ...tarea1.elegir]) {
    const p = practicaPorSlug(slug);
    let doc = deNube.find(d => d.practica === p.id);
    if (!doc) deNube.push(doc = { practica: p.id, indice: 0, ej: Array.from({ length: p.nEjercicios }, () => ({})) });
    doc.ej[n - 1] = { terminado: true, dia: PLAZO - 1, aciertos: 10, fallos: 0 };
  }
  const filas = juntarTareas(['Ana'], [], [], deNube, TAREAS, { hoyDia: PLAZO });
  const t1 = columnas(filas, 0).find(c => c.id === 1);
  assert.equal(t1.cumplida, true);
  assert.equal(t1.puntos, 100);
  assert.equal(t1.fuente, 'prácticas');
  assert.equal(t1.entrega, 'a tiempo');
  // Las mismas prácticas no hacen cumplida ninguna tarea v2 que lleve esos ejercicios.
  const v2conLosMismos = { ...base, id: 93, estrella: tarea1.estrella, elegir: tarea1.elegir, nElegir: tarea1.nElegir };
  const otra = juntarTareas(['Ana'], [], [], deNube, [v2conLosMismos], { hoyDia: PLAZO });
  assert.equal(columnas(otra, 0)[0].cumplida, false);
  assert.equal(columnas(otra, 0)[0].empezada, false);
});

test('juntarTareas: una tarea v2 cuenta lo de su documento y no lo de la práctica libre', () => {
  const libre = [{ practica: SEMAFORO, indice: 0, ej: ej(PLAZO - 2) }];
  const solo = juntarTareas(['Ana'], [], [], libre, [v2, antigua], { hoyDia: PLAZO });
  const [c2, c1] = columnas(solo, 0);
  assert.equal(c2.cumplida, false, 'v2: lo de la práctica libre no cuenta');
  assert.equal(c1.cumplida, true, 'tarea con progreso por práctica: sí cuenta');
  const conTarea = juntarTareas(['Ana'], [], [], [], [v2, antigua], { hoyDia: PLAZO, deNubeTareas: [deTarea(90, 0, PLAZO - 2), deTarea(91, 0, PLAZO - 2)] });
  const [d2, d1] = columnas(conTarea, 0);
  assert.equal(d2.cumplida, true);
  assert.equal(d2.fuente, 'tarea');
  assert.equal(d1.cumplida, false, 'el documento de otra tarea no cuenta en una tarea con progreso por práctica');
  // El documento de la tarea 91 no cuenta en la 90.
  const otra = juntarTareas(['Ana'], [], [], [], [v2], { hoyDia: PLAZO, deNubeTareas: [deTarea(91, 0, PLAZO - 2)] });
  assert.equal(columnas(otra, 0)[0].cumplida, false);
});

test('la vista «Retrasos»: a tiempo, 3 días tarde y sin entregar, con una tarea asignada a uno solo', () => {
  const hoyDia = PLAZO + 5;
  const nombres = ['Ana', 'Beto', 'Carla'];
  const opciones = {
    hoyDia,
    deNubeTareas: [
      deTarea(90, 0, PLAZO - 1), deTarea(90, 1, PLAZO + 3),                    // Ana a tiempo; Beto 3 días tarde; Carla nada
      deTarea(92, 1, PLAZO + 1),                                               // Beto hizo la asignada, 1 día tarde
      deTarea(92, 2, PLAZO),                                                   // Carla la hizo sin estar asignada (voluntaria)
    ],
    asignaciones: [{ indice: 1, tareas: [92] }],
  };
  const filas = juntarTareas(nombres, [], [], [], [v2, asignada], opciones);

  const [a90, a92] = columnas(filas, 0);
  assert.deepEqual([a90.entrega, a90.diasRetraso, a90.diaEntrega], ['a tiempo', 0, PLAZO - 1]);
  assert.equal(a92.noAsignado, true);
  assert.equal(a92.entrega, '', 'no asignada: sin plazo para ella');
  const [b90, b92] = columnas(filas, 1);
  assert.deepEqual([b90.entrega, b90.diasRetraso], ['con retraso', 3]);
  assert.deepEqual([b92.noAsignado, b92.tipo, b92.entrega, b92.diasRetraso], [false, 'obligatoria_para_ti', 'con retraso', 1]);
  const [c90, c92] = columnas(filas, 2);
  assert.deepEqual([c90.entrega, c90.diasRetraso], ['sin entregar', 5], 'sin entregar: los días hasta hoy');
  assert.equal(c92.noAsignado, true);
  assert.equal(c92.cumplida, true, 'su avance voluntario se ve, pero no cuenta');

  const r = calcularRetrasos(filas, [v2, asignada], hoyDia);
  const por = Object.fromEntries(r.alumnos.map(a => [a.nombre, a]));
  assert.deepEqual([por.Ana.conPlazo, por.Ana.aTiempo, por.Ana.conRetraso, por.Ana.sinEntregar, por.Ana.dias], [1, 1, 0, 0, 0]);
  assert.deepEqual([por.Beto.conPlazo, por.Beto.aTiempo, por.Beto.conRetraso, por.Beto.sinEntregar, por.Beto.dias, por.Beto.maximo], [2, 0, 2, 0, 4, 3]);
  assert.equal(por.Beto.media, 2);
  assert.deepEqual([por.Carla.conPlazo, por.Carla.aTiempo, por.Carla.sinEntregar, por.Carla.dias, por.Carla.maximo], [1, 0, 1, 5, 5], 'la asignada no es suya: no cuenta');
  const t90 = r.tareas.find(t => t.id === 90);
  assert.deepEqual([t90.conPlazo, t90.aTiempo, t90.conRetraso, t90.sinEntregar, t90.dias], [3, 1, 1, 1, 8]);
  const t92 = r.tareas.find(t => t.id === 92);
  assert.deepEqual([t92.conPlazo, t92.aTiempo, t92.conRetraso, t92.dias], [1, 0, 1, 1], 'solo cuenta el alumno asignado');
});

test('«Retrasos»: lo pendiente (plazo sin llegar) no es retraso y lo no publicado no cuenta', () => {
  const futura = { ...v2, id: 94, hasta: '2026-11-05' };
  const nopublicada = { ...v2, id: 95, desde: '2026-12-01', hasta: '2026-12-10' };
  const hoyDia = PLAZO;
  const filas = juntarTareas(['Ana'], [], [], [], [futura, nopublicada], { hoyDia });
  const [f, n] = columnas(filas, 0);
  assert.deepEqual([f.entrega, f.diasRetraso], ['pendiente', 0]);
  const r = calcularRetrasos(filas, [futura, nopublicada], hoyDia);
  assert.deepEqual([r.alumnos[0].conPlazo, r.alumnos[0].pendientes, r.alumnos[0].sinEntregar, r.alumnos[0].dias], [1, 1, 0, 0]);
  assert.deepEqual(r.tareas.map(t => t.id), [94]);
  assert.ok(n);   // la columna existe, pero la vista no la cuenta
});

test('una tarea sin plazo no genera retraso aunque esté sin hacer', () => {
  const repaso = { ...base, id: 96 };
  const filas = juntarTareas(['Ana'], [], [], [], [repaso], { hoyDia: PLAZO + 100 });
  const c = columnas(filas, 0)[0];
  assert.deepEqual([c.conPlazo, c.entrega, c.diasRetraso], [false, '', 0]);
});

test('asignacionesParaGuardar: conserva lo que no se puede marcar aquí', () => {
  assert.deepEqual(asignacionesParaGuardar([3, 92], [92, 95], [95]), [3, 95]);
  assert.deepEqual(asignacionesParaGuardar([], [92], [92]), [92]);
  assert.deepEqual(asignacionesParaGuardar([92], [92], []), []);
  assert.deepEqual(asignacionesParaGuardar([92, 92], [92], [92, 92]), [92]);
});

test('«qué falla más» por tarea: el campo `tarea` de los fallos', () => {
  const f = (alumno, tarea, extra = {}) => ({ alumno, practica: 'semaforo', ejercicio: 1, t: 1, item: 'x', feedback: 'y', ...(tarea === undefined ? {} : { tarea }), ...extra });
  const fallos = [f('AAAA', 1), f('BBBB', 2), f('CCCC', 2), f('DDDD'), f('EEEE', undefined, { ejercicio: 3 })];
  assert.equal(filtrarFallos(fallos, { tarea: 2 }).length, 2, 'una tarea v2: solo los que traen su id');
  assert.equal(filtrarFallos(fallos, { tarea: 'ninguna' }).length, 2, 'sin tarea: los que no traen campo');
  assert.equal(filtrarFallos(fallos, {}).length, 5);
  // La tarea 1 (progreso por práctica) cuenta también los anteriores al campo que sean de sus ejercicios.
  const tarea1 = filtrarFallos(fallos, { tarea: 1, ejercicios: [['semaforo', 1]] });
  assert.deepEqual(tarea1.map(x => x.alumno).sort(), ['AAAA', 'DDDD']);
  // Sin `tarea`, `ejercicios` filtra por sí solo, como antes.
  assert.equal(filtrarFallos(fallos, { ejercicios: [['semaforo', 3]] }).length, 1);
  assert.equal(agruparFallos(fallos, { tarea: 2 }).total, 2);
});

// --- Espacio del profesor (tarea 66) ---------------------------------------------------
// Códigos inventados, con la forma de los de 8 (ninguno es de un alumno).
const MIS = [{ id: 'K7QMP3XA', n: 1 }, { id: 'B2C3D4E5', n: 3 }, { id: 'ZZZZ9999', n: 7 }];

test('espacio: código de 8 ↔ posición en la lista (n − 1); uno ajeno da null', () => {
  const { codigoDe, indiceDe } = indicesDeCodigos(MIS);
  assert.equal(indiceDe('K7QMP3XA'), 0);
  assert.equal(indiceDe('b2c3-d4e5'), 2, 'con guion y en minúsculas también');
  assert.equal(indiceDe('AAAABBBB'), null);
  assert.equal(indiceDe(codigoAlumno(0)), null, 'un código de 4 no es del espacio');
  assert.equal(codigoDe(6), 'ZZZZ9999');
  assert.equal(codigoDe(1), null);
  assert.equal(indicesDeCodigos(undefined).codigoDe(0), null);
});

test('espacio: leerDocumentos y leerAsignaciones con los códigos del profesor', () => {
  const { indiceDe } = indicesDeCodigos(MIS);
  const estado = JSON.stringify({ ej: [{ terminado: true, fallos: 1 }] });
  const libre = leerDocumentos([{ id: 'semaforo--B2C3D4E5', estado, actualizado: 5 }, { id: 'semaforo--AAAABBBB', estado }], 'progreso-libre', indiceDe);
  assert.deepEqual(libre.map(d => [d.practica, d.indice, d.actualizado]), [[practicaPorSlug('semaforo').id, 2, 5]]);
  const deTarea = leerDocumentos([{ id: 't4--semaforo--K7QMP3XA', estado }], 'progreso-tareas', indiceDe);
  assert.deepEqual(deTarea.map(d => [d.tarea, d.indice]), [[4, 0]]);
  assert.deepEqual(leerDocumentos([{ id: 'semaforo--K7QMP3XA', estado }], 'progreso-tareas', indiceDe), []);
  // Un código que no es del profesor no se lee.
  assert.deepEqual(leerDocumentos([{ id: 'semaforo--ZZZZZZZZ', estado }], 'progreso-libre', indiceDe), []);
  assert.deepEqual(leerAsignaciones([{ id: 'ZZZZ9999', tareas: [2, 5] }, { id: 'AAAABBBB', tareas: [1] }], indiceDe), [{ indice: 6, tareas: [2, 5] }]);
});

test('«Mis alumnos»: filas por número, también códigos sin línea; qué líneas faltan por código', () => {
  const nombres = ['Ana', 'Luis', '', 'Marta'];
  assert.deepEqual(filasMisAlumnos(nombres, MIS), [
    { n: 1, nombre: 'Ana', codigo: 'K7QMP3XA' },
    { n: 2, nombre: 'Luis', codigo: null },
    { n: 3, nombre: '', codigo: 'B2C3D4E5' },
    { n: 4, nombre: 'Marta', codigo: null },
    { n: 7, nombre: '', codigo: 'ZZZZ9999' },
  ]);
  assert.deepEqual(faltanCodigos(nombres, MIS), [2, 4]);
  assert.deepEqual(faltanCodigos(nombres, []), [1, 2, 4]);
  assert.deepEqual(faltanCodigos(nombres, [], 2), [1, 2], 'no pasa de 250 (lo que dejan las reglas)');
});

test('repartirCodigos: uno por número, sin repetir los ya usados ni entre ellos', () => {
  const salen = ['K7QMP3XA', 'K7QMP3XA', 'NUEVO222', 'NUEVO222', 'NUEVO333'];
  const r = repartirCodigos([2, 4], ['K7QMP3XA'], () => salen.shift());
  assert.deepEqual(r, [{ codigo: 'NUEVO222', n: 2 }, { codigo: 'NUEVO333', n: 4 }]);
});

test('código de resultado de un alumno de 8: lleva n (desde 1, como lo escribe semana.js) y el panel lo pone en n − 1', () => {
  // Las tareas de un profesor, con un id que no está en tareas.js.
  const mias = [{ id: 40, titulo: { es: 'x', en: 'x' }, estrella: [['semaforo', 1], ['criba', 1]], elegir: [['recta', 1]], nElegir: 1 }];
  const texto = codigoTarea(40, 3, { estrella: [true, false], elegir: [true], fallos: 2, dia: 50 });
  const dato = leerCodigoTareaEspacio(texto, mias);
  assert.deepEqual([dato.tipo, dato.tarea, dato.indice, dato.estrella, dato.elegir], ['tarea', 40, 2, [true, false], [true]]);
  assert.equal(leerCodigoTareaEspacio(texto, TAREAS), null, 'con las tareas de otro, no vale');
  assert.equal(leerCodigoTareaEspacio(codigoTarea(40, 0, {}), mias), null, 'el n.º 0 no es de nadie');
});

test('caché del panel: lo leído gana por id; desde cuándo pedir lo nuevo', () => {
  const previos = [{ id: 'a', actualizado: 10 }, { id: 'b', actualizado: 20 }];
  assert.deepEqual(fusionarLeidos(previos, [{ id: 'b', actualizado: 30 }, { id: 'c', actualizado: 5 }]),
    [{ id: 'a', actualizado: 10 }, { id: 'b', actualizado: 30 }, { id: 'c', actualizado: 5 }]);
  assert.deepEqual(fusionarLeidos(undefined, [{ id: 'x' }]), [{ id: 'x' }]);
  assert.equal(desdeParaLeer([]), 0, 'sin caché, todo');
  const ahora = 1_800_000_000_000;
  assert.equal(desdeParaLeer([{ actualizado: ahora - 5 }, { actualizado: ahora }]), ahora - MARGEN_LECTURA);
  assert.equal(desdeParaLeer([{ t: 1000 }], 't'), 0, 'el margen no baja de 0');
  assert.equal(desdeParaLeer([{ t: ahora }, { sin: 1 }], 't', 0), ahora);
});

test('«qué falla más» de una tarea v2 con los documentos de la tarea', () => {
  const p = practicaPorSlug('semaforo');
  const deNube = [{ practica: p.id, indice: 0, ej: [{ terminado: false, aciertos: 1, fallos: 4 }] }];
  const filas = juntarFallos(['Ana'], [], deNube, [{ practica: p, n: 1 }]);
  assert.deepEqual([filas[0].empezados, filas[0].fallos], [1, 4]);
});
