// Tareas de la semana (practicas/semana.html, practicas/_comun/tareas.js): los
// datos frente al catálogo y frente a lo que declara cada práctica, el estado
// («cumplida») en los casos límite, el código de resultado de la tarea (20
// caracteres) y el panel, que lee mezclados los tres tipos de código.
// También los arreglos de la base de la tarea 37 (campo numérico, progreso
// guardado) y que las 31 prácticas siguen declarándose bien.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as divisores from '../divisores/logica.js';
import { CATALOGO, ID_PLANTILLA, UNIDADES, unidadActual, practicaPorSlug } from '../practicas/_comun/catalogo.js';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  codigoAlumno, leerCodigoResultado, codigoTarea, leerCodigoTarea, leerCualquierCodigo, extraerCodigosResultado,
} from '../practicas/_comun/codigos.js';
import {
  TAREAS, PUNTOS_POR_EJERCICIO, MAX_ESTRELLA, MAX_ELEGIR, tareaPorId, tareasPublicadas, estadoTarea, estadoPlazo, diaDeFecha, erroresTareas, enlaceEjercicio, fechaISO,
} from '../practicas/_comun/tareas.js';
import { declaracionDe, progresoGuardado, claveProgreso, urlSemana } from '../practicas/_comun/base.js';
import { leerNumero } from '../practicas/_comun/piezas.js';
import { juntarTareas } from '../practicas/resultados.js';

// --- Los datos de tareas.js ------------------------------------------------------------

test('tareas: coherentes con el catálogo, sin repetidos y dentro de los topes', () => {
  assert.deepEqual(erroresTareas(), []);
  assert.ok(TAREAS.length >= 1);
  for (const t of TAREAS) {
    assert.ok(t.estrella.length <= MAX_ESTRELLA && t.elegir.length <= MAX_ELEGIR);
    assert.ok(t.nElegir <= t.elegir.length);
    assert.equal(tareaPorId(t.id), t);
  }
  assert.equal(tareaPorId(999), null);
});

test('tareas: las cuatro semanas de la nota de temporización, 6 ★ + 4 de 8, 100 puntos', () => {
  const u2 = TAREAS.filter(t => t.unidad === 2);
  assert.deepEqual(u2.map(t => [t.id, t.estrella.length, t.elegir.length, t.nElegir]), [[1, 6, 8, 4], [2, 6, 8, 4], [3, 6, 8, 4], [4, 6, 8, 4]]);
  for (const t of TAREAS) assert.equal(estadoTarea(t, () => null).maximo, 100);
  // Muestras copiadas de la nota (slug/n), una por lista y semana.
  assert.deepEqual(tareaPorId(1).estrella[0], ['divisores', 4]);
  assert.deepEqual(tareaPorId(2).elegir.at(-1), ['especiales', 1]);
  assert.deepEqual(tareaPorId(3).estrella.slice(0, 4), [['venn', 1], ['venn', 2], ['venn', 3], ['venn', 4]]);
  assert.deepEqual(tareaPorId(4).elegir[5], ['criba', 3]);
});

test('tareas de la unidad 1 (propuesta de la tarea 46, ids 11-14): 6 ★ + 4 a elegir, sin desde ni hasta', () => {
  const u1 = TAREAS.filter(t => t.unidad === 1);
  assert.deepEqual(u1.map(t => [t.id, t.estrella.length, t.elegir.length, t.nElegir]), [[11, 6, 6, 4], [12, 6, 7, 4], [13, 6, 8, 4], [14, 6, 8, 4]]);
  for (const t of u1) {
    assert.equal(t.desde, undefined);
    assert.equal(t.hasta, undefined);
    assert.equal(t.asignada, undefined);
    assert.match(t.titulo.es, /^U1 · Semana \d · /);
    assert.equal(estadoTarea(t, () => null).maximo, 100);
  }
  assert.deepEqual(TAREAS.map(t => t.unidad), [2, 2, 2, 2, 1, 1, 1, 1]);
});

test('regla de publicación: la tarea 1 conserva el modelo de hoy (progresoPorPractica) y erroresTareas falla si se le quita', () => {
  const t1 = tareaPorId(1);
  assert.equal(t1.progresoPorPractica, true);
  assert.equal(t1.unidad, 2);
  assert.equal(t1.hasta, '2026-10-22');
  assert.equal(t1.desde, '2026-10-16', 'su día de publicación no cambia');
  assert.deepEqual(TAREAS.filter(t => t.progresoPorPractica).map(t => t.id), [1], 'solo la tarea 1');
  const sin = { ...t1 }; delete sin.progresoPorPractica;
  assert.match(erroresTareas([sin]).join(), /tarea 1.*progresoPorPractica/);
  assert.match(erroresTareas([{ ...tareaPorId(2), progresoPorPractica: true }]).join(), /progresoPorPractica/);
  assert.deepEqual(erroresTareas(), []);
  // Plazos del diseño (B.1): la 1 como Classroom, las demás el jueves de su semana.
  assert.deepEqual([2, 3, 4].map(id => tareaPorId(id).hasta), ['2026-10-29', '2026-11-05', '2026-11-12']);
});

test('tareas: erroresTareas avisa de lo que está mal', () => {
  const buena = { id: 9, unidad: 2, titulo: { es: 'a', en: 'b' }, estrella: [['recta', 1]], elegir: [['recta', 2], ['recta', 3]], nElegir: 1 };
  assert.deepEqual(erroresTareas([buena]), []);
  const mal = cambios => erroresTareas([{ ...buena, ...cambios }]).join(' | ');
  assert.match(mal({ estrella: [['recta', 4]] }), /recta no tiene ejercicio 4/);
  assert.match(mal({ estrella: [['inventada', 1]] }), /no está en el catálogo/);
  assert.match(mal({ elegir: [['recta', 1], ['recta', 2]] }), /recta\/1 está repetido/);
  assert.match(mal({ nElegir: 3 }), /nElegir/);
  assert.match(mal({ id: 0 }), /id/);
  assert.match(mal({ titulo: 'solo' }), /titulo/);
  assert.match(mal({ desde: '19/10/2026' }), /desde/);
  assert.match(mal({ unidad: 7 }), /unidad/);
  assert.match(mal({ unidad: undefined }), /unidad/);
  assert.match(mal({ hasta: '22/10/2026' }), /hasta/);
  assert.match(mal({ desde: '2026-10-20', hasta: '2026-10-19' }), /hasta.*anterior/);
  assert.deepEqual(erroresTareas([{ ...buena, desde: '2026-10-20', hasta: '2026-10-20' }]), [], 'el plazo puede ser el mismo día');
  assert.match(mal({ asignada: false }), /asignada/);
  assert.deepEqual(erroresTareas([{ ...buena, asignada: true }]), []);
  assert.match(mal({ progresoPorPractica: true }), /progresoPorPractica/);
  assert.match(mal({ estrella: Array.from({ length: 11 }, (_, i) => ['divisores', 1 + (i % 6)]) }), /más de 10/);
  assert.match(erroresTareas([buena, { ...buena }]).join(), /id repetido/);
});

test('tareas: la portada enseña las que han llegado a su día', () => {
  // Calendario retrasado una semana (2026-10-15), y la semana 1 adelantada al
  // viernes 16-10 (publicada en Classroom ese día); las demás, en sus lunes.
  // (De la unidad 2; las de la unidad 1 no llevan `desde`, así que salen siempre.)
  const u2 = hoy => tareasPublicadas(hoy, TAREAS, 2).map(t => t.id);
  assert.deepEqual(u2('2026-10-15'), []);
  assert.deepEqual(u2('2026-10-16'), [1]);
  assert.deepEqual(u2('2026-10-19'), [1]);
  assert.deepEqual(u2('2026-10-26'), [1, 2]);
  assert.deepEqual(u2('2026-11-08'), [1, 2, 3]);
  assert.deepEqual(u2('2026-11-09'), [1, 2, 3, 4]);
  assert.deepEqual(u2('2026-12-01'), [1, 2, 3, 4]);
  assert.deepEqual(tareasPublicadas('2026-10-15').map(t => t.id), [11, 12, 13, 14], 'sin filtrar: las de la unidad 1 y las que han llegado');
  assert.deepEqual(tareasPublicadas('2026-10-16', TAREAS, 1).map(t => t.id), [11, 12, 13, 14]);
  assert.deepEqual(tareasPublicadas('2020-01-01', [{ id: 7 }]).map(t => t.id), [7], 'sin «desde», siempre');
  assert.equal(fechaISO(new Date(2026, 9, 5)), '2026-10-05');
});

test('tareas: el enlace de cada ejercicio abre ese ejercicio y vuelve a la tarea', () => {
  assert.equal(enlaceEjercicio('recta', 2, 1, 'ABCD'), 'recta/?c=ABCD&ejercicio=2&semana=1');
  assert.equal(enlaceEjercicio('divisores', 4, 1), '../divisores/?ejercicio=4&semana=1');
  // Con el número que tiene en la lista de la tarea, para la cabecera del ejercicio.
  assert.equal(enlaceEjercicio('recta', 2, 1, 'ABCD', 3), 'recta/?c=ABCD&ejercicio=2&semana=1&num=3');
  assert.match(urlSemana(3, 'ABCD'), /\/practicas\/semana\.html\?t=3&c=ABCD$/);
});

// --- Estado de una tarea -----------------------------------------------------------------

const TAREA = { id: 50, titulo: { es: 'x', en: 'x' }, estrella: [['recta', 1], ['recta', 2]], elegir: [['semaforo', 1], ['semaforo', 2], ['semaforo', 3]], nElegir: 2 };
const hecho = (fallos = 0, dia = 40) => ({ puntos: 10, objetivo: 10, aciertos: 10, fallos, terminado: true, dia });
const medias = (puntos, objetivo = 10, fallos = 1) => ({ puntos, objetivo, aciertos: puntos, fallos, terminado: false, dia: 0 });
const con = mapa => (slug, n) => mapa[`${slug}/${n}`] ?? null;

test('estado: sin nada, a medias, cumplida justo y con elegidos de sobra', () => {
  const nada = estadoTarea(TAREA, con({}));
  assert.deepEqual([nada.cumplida, nada.empezada, nada.puntos, nada.maximo, nada.fallos, nada.dia], [false, false, 0, 40, 0, 0]);

  // Todos los de elegir terminados pero falta un ★: no está cumplida.
  const sinEstrella = estadoTarea(TAREA, con({ 'recta/1': hecho(), 'semaforo/1': hecho(), 'semaforo/2': hecho(), 'semaforo/3': hecho() }));
  assert.equal(sinEstrella.cumplida, false);
  assert.equal(sinEstrella.puntos, 30, 'los de elegir de sobra no suman más de nElegir × 10');

  // Los ★ terminados y uno de elegir menos de los que hacen falta.
  const casi = estadoTarea(TAREA, con({ 'recta/1': hecho(), 'recta/2': hecho(2), 'semaforo/3': hecho(1, 44) }));
  assert.deepEqual([casi.cumplida, casi.estrellaHechos, casi.elegirHechos, casi.fallos, casi.dia], [false, 2, 1, 3, 44]);

  // Justo: los ★ y exactamente nElegir.
  const justo = estadoTarea(TAREA, con({ 'recta/1': hecho(), 'recta/2': hecho(), 'semaforo/1': hecho(), 'semaforo/3': hecho() }));
  assert.deepEqual([justo.cumplida, justo.puntos], [true, 40]);

  // Con nElegir 0 basta con los ★; sin ★, basta con los de elegir.
  assert.equal(estadoTarea({ ...TAREA, nElegir: 0 }, con({ 'recta/1': hecho(), 'recta/2': hecho() })).cumplida, true);
  assert.equal(estadoTarea({ ...TAREA, estrella: [] }, con({ 'semaforo/1': hecho(), 'semaforo/2': hecho() })).cumplida, true);
});

test('estado: diaEntrega es el día en que se cumplió por primera vez, aunque se siguiera después', () => {
  // ★ el 40 y el 41; de elegir (nElegir 2) el 38, el 45 y el 50: se cumple el 45.
  const mapa = { 'recta/1': hecho(0, 40), 'recta/2': hecho(0, 41), 'semaforo/1': hecho(0, 45), 'semaforo/2': hecho(0, 38), 'semaforo/3': hecho(0, 50) };
  const e = estadoTarea(TAREA, con(mapa));
  assert.equal(e.cumplida, true);
  assert.equal(e.dia, 50, 'dia sigue siendo el del último ejercicio terminado');
  assert.equal(e.diaEntrega, 45, 'diaEntrega, el del momento de cumplirla');
  // Si el último ★ llega después que los de elegir, manda el ★.
  assert.equal(estadoTarea(TAREA, con({ ...mapa, 'recta/2': hecho(0, 47) })).diaEntrega, 47);
  // Sin cumplir: 0. Con nElegir 0, basta el último ★.
  assert.equal(estadoTarea(TAREA, con({ 'recta/1': hecho(0, 40) })).diaEntrega, 0);
  assert.equal(estadoTarea({ ...TAREA, nElegir: 0 }, con({ 'recta/1': hecho(0, 40), 'recta/2': hecho(0, 43), 'semaforo/1': hecho(0, 60) })).diaEntrega, 43);
  assert.equal(estadoTarea(TAREA, con({})).diaEntrega, 0);
});

test('estadoPlazo: repaso, obligatoria y obligatoria para ti, con los días de retraso', () => {
  const plazo = '2026-10-22';
  const dPlazo = diaDeFecha(plazo);
  assert.equal(dPlazo, 51, '1-9-2026 es el día 0');
  const hecha = (diaEntrega) => ({ cumplida: true, diaEntrega });
  const sinHacer = { cumplida: false, diaEntrega: 0 };
  const base = { ...TAREA, unidad: 2 };
  const repaso = { ...base };
  const obligatoria = { ...base, hasta: plazo };
  const asignada = { ...base, hasta: plazo, asignada: true };
  const asignadaSinPlazo = { ...base, asignada: true };

  // Los cuatro casos de la tabla (B.1).
  assert.deepEqual(estadoPlazo(repaso, sinHacer, dPlazo + 10, false), { tipo: 'repaso', entregada: false, fueraDePlazo: false, diasRetraso: 0 });
  assert.equal(estadoPlazo(obligatoria, sinHacer, dPlazo - 3, false).tipo, 'obligatoria');
  assert.equal(estadoPlazo(asignada, sinHacer, dPlazo - 3, true).tipo, 'obligatoria_para_ti');
  assert.equal(estadoPlazo(asignada, sinHacer, dPlazo - 3, false).tipo, 'repaso', 'un no asignado la ve como repaso');
  assert.equal(estadoPlazo(asignadaSinPlazo, sinHacer, dPlazo, true).tipo, 'obligatoria_para_ti');
  assert.equal(estadoPlazo(asignadaSinPlazo, sinHacer, dPlazo, false).tipo, 'repaso');
  // Un no asignado nunca va fuera de plazo, aunque haya pasado.
  assert.deepEqual(estadoPlazo(asignada, sinHacer, dPlazo + 9, false), { tipo: 'repaso', entregada: false, fueraDePlazo: false, diasRetraso: 0 });
  // Sin plazo no hay retraso.
  assert.deepEqual(estadoPlazo(asignadaSinPlazo, sinHacer, dPlazo + 9, true), { tipo: 'obligatoria_para_ti', entregada: false, fueraDePlazo: false, diasRetraso: 0 });

  // A tiempo: el mismo día del plazo cuenta (el plazo es hasta el final de ese día).
  assert.deepEqual(estadoPlazo(obligatoria, hecha(dPlazo), dPlazo + 5, false), { tipo: 'obligatoria', entregada: true, fueraDePlazo: false, diasRetraso: 0 });
  assert.deepEqual(estadoPlazo(obligatoria, sinHacer, dPlazo, false), { tipo: 'obligatoria', entregada: false, fueraDePlazo: false, diasRetraso: 0 }, 'el día del plazo aún no hay retraso');
  // Entregada tarde: 3 días de retraso, y no sube con los días que pasan.
  assert.deepEqual(estadoPlazo(obligatoria, hecha(dPlazo + 3), dPlazo + 9, false), { tipo: 'obligatoria', entregada: true, fueraDePlazo: true, diasRetraso: 3 });
  // Sin entregar 2 días después del plazo: 2 «y subiendo» (con hoy).
  assert.deepEqual(estadoPlazo(obligatoria, sinHacer, dPlazo + 2, false), { tipo: 'obligatoria', entregada: false, fueraDePlazo: true, diasRetraso: 2 });
  assert.equal(estadoPlazo(obligatoria, sinHacer, dPlazo + 7, false).diasRetraso, 7);
  // Obligatoria para ti, entregada tarde.
  assert.deepEqual(estadoPlazo(asignada, hecha(dPlazo + 1), dPlazo + 4, true), { tipo: 'obligatoria_para_ti', entregada: true, fueraDePlazo: true, diasRetraso: 1 });
  // Repaso entregada: entregada y nada más.
  assert.deepEqual(estadoPlazo(repaso, hecha(40), 60, false), { tipo: 'repaso', entregada: true, fueraDePlazo: false, diasRetraso: 0 });
});

test('unidades: la actual es la última cuyo desde ha llegado, y todas las filas del catálogo tienen la suya', () => {
  assert.deepEqual(UNIDADES.map(u => u.n), [1, 2, 3]);
  assert.equal(unidadActual('2026-10-15'), 2);
  assert.equal(unidadActual('2026-11-15'), 2);
  assert.equal(unidadActual('2026-11-16'), 3);
  assert.equal(unidadActual('2026-09-01'), 1, 'antes del curso: la primera');
  for (const u of UNIDADES) assert.ok(u.titulo.es && u.titulo.en && /^\d{4}-\d{2}-\d{2}$/.test(u.desde));
  assert.deepEqual(CATALOGO.filter(p => p.id <= 15).map(p => p.unidad), Array(16).fill(2));
  assert.deepEqual(CATALOGO.filter(p => p.id >= 16 && p.id <= 30).map(p => p.unidad), Array(15).fill(1));
  assert.equal(practicaPorSlug('plantilla').unidad, null);
});

test('catálogo: los nombres no llevan la coletilla «repaso de la unidad 1», salvo la ampliación', () => {
  for (const p of CATALOGO) {
    assert.doesNotMatch(p.nombre.es, /repaso de la unidad 1|\(unidad 1\)/);
    assert.doesNotMatch(p.nombre.en, /unit 1 review|\(unit 1\)/);
  }
  assert.deepEqual(practicaPorSlug('errores1').nombre, { es: 'Caza el error', en: 'Spot the mistake' });
  assert.deepEqual(practicaPorSlug('errores').nombre, practicaPorSlug('errores1').nombre, 'los dos «Caza el error» se llaman igual');
  assert.deepEqual(practicaPorSlug('propiedades').nombre, { es: 'Propiedades de las potencias (ampliación)', en: 'Laws of indices (extension)' });
  assert.deepEqual(practicaPorSlug('parentesis').nombre, { es: 'Coloca los paréntesis', en: 'Place the brackets' });
});

test('estado: los puntos de un ejercicio a medias son proporcionales y nunca llegan a 10', () => {
  const p = mapa => estadoTarea(TAREA, con(mapa)).puntos;
  assert.equal(p({ 'recta/1': medias(5) }), 5);
  assert.equal(p({ 'recta/1': medias(9) }), 9);
  assert.equal(p({ 'recta/1': medias(10) }), 9, 'diez puntos sin «terminado» (no debería pasar) no cuentan como terminado');
  assert.equal(p({ 'recta/1': medias(3, 6) }), 5, 'objetivo distinto de 10 (el árbol pide 6)');
  assert.equal(p({ 'recta/1': medias(0, 10, 4) }), 0);
  // De los de elegir cuentan los nElegir mejores, terminados o no.
  assert.equal(p({ 'semaforo/1': medias(2), 'semaforo/2': medias(7), 'semaforo/3': hecho() }), 17);
  const empezado = estadoTarea(TAREA, con({ 'semaforo/2': medias(0, 10, 1) }));
  assert.deepEqual([empezado.empezada, empezado.puntos, empezado.elegir[1].empezado], [true, 0, true], 'con un fallo y 0 puntos ya está empezado');
  assert.equal(PUNTOS_POR_EJERCICIO, 10);
});

// --- El código de resultado de la tarea ------------------------------------------------------

const azar = (rng, n) => Array.from({ length: n }, () => rng.azar() < 0.5);

test('código de tarea: ida y vuelta para todos los alumnos y todas las tareas', () => {
  const rng = crearRng(37);
  for (const t of TAREAS) {
    for (let indice = 0; indice < 1024; indice++) {
      const datos = { estrella: azar(rng, t.estrella.length), elegir: azar(rng, t.elegir.length), fallos: rng.entero(0, 1023), dia: rng.entero(0, 1023) };
      const codigo = codigoTarea(t.id, indice, datos);
      assert.match(codigo, /^([A-HJ-NP-Z2-9]{4}-){4}[A-HJ-NP-Z2-9]{4}$/);
      assert.deepEqual(leerCodigoTarea(codigo), { tarea: t.id, indice, ...datos, tope: datos.fallos === 1023 });
    }
  }
});

test('código de tarea: los extremos, los fallos con tope y cualquier forma de escribirlo', () => {
  const t = TAREAS[0];
  const todo = { estrella: t.estrella.map(() => true), elegir: t.elegir.map(() => true), fallos: 0, dia: 1023 };
  const nada = { estrella: t.estrella.map(() => false), elegir: t.elegir.map(() => false), fallos: 0, dia: 0 };
  for (const datos of [todo, nada]) assert.deepEqual(leerCodigoTarea(codigoTarea(t.id, 0, datos)), { tarea: t.id, indice: 0, ...datos, tope: false });
  const muchos = leerCodigoTarea(codigoTarea(t.id, 5, { ...nada, fallos: 5000 }));
  assert.deepEqual([muchos.fallos, muchos.tope], [1023, true]);
  const c = codigoTarea(t.id, 5, todo);
  assert.deepEqual(leerCodigoTarea(c.toLowerCase().replaceAll('-', ' ')), leerCodigoTarea(c));
  assert.deepEqual(leerCodigoTarea(c.replaceAll('-', '')), leerCodigoTarea(c));
  // Una tarea con 10 ★ y 15 de elegir (los topes) también cabe.
  assert.throws(() => codigoTarea(t.id, 0, { estrella: Array(11).fill(true) }), /más ejercicios/);
});

test('código de tarea: no vale con un carácter cambiado, de otro alumno, de otra tarea ni de una que no existe', () => {
  const t = TAREAS[1];
  const datos = { estrella: [true, false, true, true, false, true], elegir: [true, true, false, false, false, false, false, true], fallos: 12, dia: 45 };
  const codigo = codigoTarea(t.id, 33, datos);
  const limpio = codigo.replaceAll('-', '');
  let cazados = 0, total = 0;
  for (let i = 0; i < limpio.length; i++) {
    for (const otro of 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789') {
      if (otro === limpio[i]) continue;
      total++;
      if (leerCodigoTarea(limpio.slice(0, i) + otro + limpio.slice(i + 1)) === null) cazados++;
    }
  }
  assert.equal(cazados, total, 'un error de copia siempre se detecta (30 bits de control)');
  assert.equal(leerCodigoTarea(codigoTarea(t.id, 34, datos)).indice, 34);
  assert.notEqual(codigoTarea(t.id, 34, datos), codigo, 'dice de quién es');
  assert.notEqual(codigoTarea(TAREAS[2].id, 33, datos), codigo, 'y de qué tarea');
  assert.equal(leerCodigoTarea(codigoTarea(999, 33, datos)), null, 'de una tarea que no está en tareas.js');
  // Un ★ terminado que la tarea no tiene (el 7.º de seis): no vale.
  assert.equal(leerCodigoTarea(codigoTarea(t.id, 33, { ...datos, estrella: [...datos.estrella, true] })), null);
  assert.equal(leerCodigoTarea(codigoTarea(t.id, 33, { ...datos, elegir: [...datos.elegir, true] })), null);
  for (const malo of ['', 'ABCD-EFGH-JKLM-NPQR', 'ABCD-EFGH-JKLM-NPQR-STUV', `${codigo}-ABCD`, codigo.slice(0, -1) + '1']) assert.equal(leerCodigoTarea(malo), null);
});

// Un código de 16 caracteres, como los que daba cada práctica hasta el 2026-10-16: ya no vale.
const DE_16_ANTIGUO = 'ABCD-EFGH-JKLM-NPQR';

test('códigos: los dos tipos no se confunden y el de práctica de 16 ya no existe', () => {
  const t = TAREAS[0];
  const deTarea = codigoTarea(t.id, 7, { estrella: [true], elegir: [], fallos: 3, dia: 44 });
  const deDivisores = divisores.codigoResultado(7, divisores.EJERCICIOS.map(() => ({ terminado: true, fallos: 0 })), 44);
  assert.equal(leerCodigoResultado(deTarea), null, 'uno de tarea no es de práctica');
  assert.equal(leerCodigoTarea(deDivisores), null);
  assert.equal(leerCodigoResultado(DE_16_ANTIGUO), null);
  assert.equal(leerCualquierCodigo(DE_16_ANTIGUO), null);
  assert.equal(leerCualquierCodigo(deTarea).tipo, 'tarea');
  assert.equal(leerCualquierCodigo(deTarea).tarea, 1);
  assert.deepEqual([leerCualquierCodigo(deDivisores).tipo, leerCualquierCodigo(deDivisores).practica], ['practica', 0]);
  assert.equal(leerCualquierCodigo('ABCD-EFGH-JKLM-NPQR-STUV'), null);
  // Al azar, ninguna tira de 20 símbolos es un código de tarea (30 bits de control).
  const rng = crearRng(5);
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for (let i = 0; i < 20000; i++) assert.equal(leerCodigoTarea(Array.from({ length: 20 }, () => rng.elegir([...alfabeto])).join('')), null);
});

test('extraerCodigosResultado: encuentra los de 12 y 20 mezclados en un texto cualquiera', () => {
  const t = TAREAS[0];
  const de20 = codigoTarea(t.id, 2, { estrella: [true, true], elegir: [false, true], fallos: 7, dia: 44 });
  const otro20 = codigoTarea(TAREAS[3].id, 9, { estrella: [true], elegir: [], fallos: 0, dia: 50 });
  const de12 = divisores.codigoResultado(3, divisores.EJERCICIOS.map(() => ({ terminado: true, fallos: 0 })), 36);
  const texto = `Hola profe, mi tarea: ${de20.toLowerCase()}.
    Luis: ${otro20.replaceAll('-', ' ')} para la semana 4 (y otra vez ${de20})
    Divisores: ${de12} gracias`;
  assert.deepEqual(extraerCodigosResultado(texto), [de20, otro20, de12]);
  // Un código de 16 (el de práctica, que ya no existe) sale como no válido (con sus 12 primeros
  // caracteres) y no tapa a los demás.
  assert.deepEqual(extraerCodigosResultado(`Mi práctica: ${DE_16_ANTIGUO}`), ['ABCD-EFGH-JKLM']);
  assert.deepEqual(extraerCodigosResultado(`${DE_16_ANTIGUO} ${de20}`), ['ABCD-EFGH-JKLM', de20]);
  assert.deepEqual(extraerCodigosResultado(`${de20} ${DE_16_ANTIGUO}`), [de20, 'ABCD-EFGH-JKLM']);
  // Pegados con un espacio: uno de 12 y uno de 20.
  assert.deepEqual(extraerCodigosResultado(`${de12} ${de20}`), [de12, de20]);
  assert.deepEqual(extraerCodigosResultado(`casa ${de20} para`), [de20]);
  assert.deepEqual(extraerCodigosResultado(`${de20.replaceAll('-', '')}`), [de20]);
  // Uno de 20 mal copiado sale como inválido, entero.
  const malo = `${de20.slice(0, -1)}${de20.at(-1) === 'A' ? 'B' : 'A'}`;
  assert.deepEqual(extraerCodigosResultado(`Mi código: ${malo}`), [malo]);
  assert.equal(leerCualquierCodigo(malo), null);
});

// --- Panel --------------------------------------------------------------------------------

test('panel: tareas de la semana con códigos de tarea, de práctica y la nube', () => {
  const tarea = { ...TAREA, id: 1, progresoPorPractica: true };  // recta/1, recta/2 ★; semaforo/1-3, elegir 2
  const sin = { terminado: false, fallos: 0 };
  const filas = juntarTareas(
    ['Ana', 'Luis', 'Eva', 'Paco'],
    [
      // Ana mandó un código de la tarea a medias y otro después, cumplida.
      { tarea: 1, indice: 0, estrella: [true, false], elegir: [true, false, false], fallos: 2, tope: false, dia: 40 },
      { tarea: 1, indice: 0, estrella: [true, true], elegir: [true, false, true], fallos: 3, tope: false, dia: 42 },
      { tarea: 2, indice: 3, estrella: [true], elegir: [], fallos: 0, tope: false, dia: 41 },   // de otra tarea
    ],
    // Luis no mandó código de la tarea, pero sí el de la recta (los ★) y uno del semáforo.
    [
      { practica: practicaPorSlug('recta').id, indice: 1, ejercicios: [{ terminado: true, fallos: 1 }, { terminado: true, fallos: 0 }, sin], dia: 43 },
      { practica: practicaPorSlug('semaforo').id, indice: 1, ejercicios: [{ terminado: true, fallos: 4 }, sin, sin, sin], dia: 43 },
    ],
    // Eva solo tiene la nube, con un ejercicio empezado.
    [{ practica: practicaPorSlug('semaforo').id, indice: 2, ej: [{ puntos: 3, objetivo: 10, aciertos: 3, fallos: 1, terminado: false, dia: 0 }] }],
    [tarea],
  );
  const de = i => filas.find(f => f.indice === i).tareas[0];
  assert.deepEqual(filas.map(f => [f.indice, f.nombre]), [[0, 'Ana'], [1, 'Luis'], [2, 'Eva'], [3, 'Paco']]);
  assert.deepEqual([de(0).cumplida, de(0).estrellaHechos, de(0).elegirHechos, de(0).fallos, de(0).dia, de(0).fuente], [true, 2, 2, 3, 42, 'código de la tarea']);
  assert.deepEqual([de(1).cumplida, de(1).estrellaHechos, de(1).elegirHechos, de(1).fallos, de(1).fuente], [false, 2, 1, 5, 'prácticas']);
  assert.deepEqual([de(2).cumplida, de(2).empezada, de(2).estrellaHechos, de(2).fuente], [false, true, 0, 'prácticas']);
  assert.deepEqual([de(3).empezada, de(3).fuente], [false, ''], 'Paco solo mandó el código de otra tarea');
  // Mezcla: el código de la tarea y una práctica se suman.
  const mezcla = juntarTareas([], [{ tarea: 1, indice: 9, estrella: [true, false], elegir: [false, false, false], fallos: 0, tope: false, dia: 40 }],
    [{ practica: practicaPorSlug('recta').id, indice: 9, ejercicios: [sin, { terminado: true, fallos: 0 }, sin], dia: 41 }], [], [tarea]);
  assert.deepEqual([mezcla[0].tareas[0].estrellaHechos, mezcla[0].tareas[0].fuente], [2, 'código de la tarea + prácticas']);
  assert.deepEqual(juntarTareas([], [], [{ practica: practicaPorSlug('venn').id, indice: 4, ejercicios: [sin], dia: 0 }], [], [tarea]), [], 'una práctica que no está en ninguna tarea no añade filas');
});

// --- Lo que la tarea 37 añade a la base ----------------------------------------------------

test('leerNumero: acepta los millares con punto o espacio, y la coma solo en inglés', () => {
  const casos = [['4730', 4730], ['4.730', 4730], ['4 730', 4730], [' 12.345.678 ', 12345678], ['12 345 678', 12345678], ['0', 0], ['007', 7], ['4 730', 4730]];
  for (const [texto, n] of casos) assert.equal(leerNumero(texto), n, texto);
  for (const malo of ['', '   ', '4.73', '4,730', '47.30', '4..730', '12a', '-5', '4.7300', '.730', '1e3', '4,5']) assert.equal(leerNumero(malo), null, malo);
  assert.equal(leerNumero('4,730', 'en'), 4730);
  assert.equal(leerNumero('4,73', 'en'), null);
  assert.equal(leerNumero('99999999999999999999'), null, 'demasiado grande para ser exacto');
});

test('progresoGuardado: lee lo que guarda la base y junta las dos claves de divisores/', () => {
  const almacen = new Map();
  globalThis.localStorage = { getItem: k => almacen.get(k) ?? null, setItem: (k, v) => almacen.set(k, String(v)), removeItem: k => almacen.delete(k) };
  try {
    assert.deepEqual(progresoGuardado('recta', 'ABCD'), []);
    almacen.set(claveProgreso('recta', 'ABCD'), JSON.stringify({ ej: [hecho(1), medias(4)] }));
    assert.deepEqual(progresoGuardado('recta', 'ABCD').map(e => e.puntos), [10, 4]);
    almacen.set(claveProgreso('criba', 'ABCD'), '{roto');
    assert.deepEqual(progresoGuardado('criba', 'ABCD'), []);
    // divisores: la clave nueva y la de antes de la tarea 17; gana el terminado.
    almacen.set(claveProgreso('divisores', 'ABCD'), JSON.stringify({ ej: [medias(3), medias(2), null, null, null, medias(1)] }));
    almacen.set('divisores.v1.ABCD', JSON.stringify({ ej: [hecho(), { pendientes: 4, aciertos: 2, fallos: 5, terminado: false }] }));
    const d = progresoGuardado('divisores', 'ABCD');
    assert.deepEqual(d.map(e => e?.terminado ?? null), [true, false, null, null, null, false]);
    assert.equal(d[1].fallos, 5, 'sin terminar en ninguna, la que tiene más fallos');
  } finally {
    delete globalThis.localStorage;
  }
});

test('estilos de la base: «Comprobar» se esconde con hidden y las cuentas no ensanchan la página', () => {
  const css = readFileSync(new URL('../practicas/_comun/estilos.css', import.meta.url), 'utf8');
  assert.match(css, /\.comprobar\[hidden\]\s*\{\s*display:\s*none;?\s*\}/);
  const cuenta = css.match(/\n\.cuenta\s*\{([^}]*)\}/)[1];
  assert.doesNotMatch(cuenta, /nowrap/);
  assert.match(cuenta, /max-width:\s*100%/);
});

test('base: generar recibe el idioma del ítem, elegido antes de generarlo', () => {
  const base = readFileSync(new URL('../practicas/_comun/base.js', import.meta.url), 'utf8');
  const siguiente = base.slice(base.indexOf('function siguiente()'), base.indexOf('function pintarEjercicio()'));
  assert.ok(siguiente.indexOf('actual.idioma =') < siguiente.indexOf('def.generar('), 'el idioma se elige antes de generar');
  assert.match(siguiente, /const sesion = \{[^}]*idioma: actual\.idioma[^}]*\}/);
});

// --- Las 31 prácticas siguen declarándose bien, y los nombres de la semana existen ----------

test('las 31 prácticas (y la plantilla) cargan y declaran lo que dice el catálogo', async () => {
  for (const ficha of CATALOGO) {
    const d = await declaracionDe(ficha);
    assert.ok(d, `${ficha.slug}: su practica.js no carga`);
    assert.equal(d.slug, ficha.slug);
    assert.equal(d.ejercicios.length, ficha.nEjercicios, `${ficha.slug}: ejercicios declarados`);
    for (const e of d.ejercicios) {
      assert.ok(typeof e.nombre?.es === 'string' && typeof e.nombre?.en === 'string', `${ficha.slug}: nombre { es, en }`);
      assert.equal(typeof e.generar, 'function');
    }
  }
  assert.ok(CATALOGO.some(p => p.id === ID_PLANTILLA));
});

test('tareas: cada ejercicio de una tarea tiene el nombre que dice la nota de temporización', async () => {
  // Los nombres de la nota (2026-10-09), para cazar un ejercicio que cambió de número.
  // (divisores/4, «Mezcla» en la nota, se llama «Multiplicaciones y divisiones»: es la mezcla de las dos anteriores.)
  const esperado = {
    'divisores/4': 'Multiplicaciones y divisiones', 'recta/1': 'múltiplos', 'recta/2': 'divisores', 'rectangulos/2': 'Sin dibujo', 'semaforo/1': 'básico',
    'clasificador/1': 'limpios', 'semaforo/2': '11', 'semaforo/4': 'cifra', 'recta/3': 'falso', 'rectangulos/1': 'rectángulos',
    'reloj/1': 'Predice', 'leelo/2': 'lee', 'jerarquia/1': 'Sin paréntesis', 'division/2': 'prueba',
    'criba/2': 'Primo o compuesto', 'semaforo/3': 'ompuestos', 'arbol/1': 'Construye', 'divisiones/1': 'scalera', 'divisiones/2': 'potencias',
    'fabrica/1': 'Construye', 'criba/1': 'criba', 'arbol/2': 'terminad', 'arbol/3': 'Completa', 'divisiones/3': 'multiplicando',
    'fabrica/2': 'Cuántos', 'factorizaciones/2': 'múltiplo', 'exponente/2': 'repetida', 'especiales/1': 'erdadero',
    'venn/1': 'Reparte', 'venn/2': 'm.c.d.', 'venn/3': 'm.c.m.', 'venn/4': 'Mezcla', 'imposibles/1': 'Puede ser', 'factorizaciones/1': 'producto',
    'imposibles/2': 'producto', 'imposibles/3': 'Nómbralo', 'factorizaciones/3': 'cociente', 'fabrica/3': 'Sin dividir', 'leelo/3': 'Completa',
    'divisores/6': 'miente', 'parentesis/1': 'Tres', 'raiz/2': 'Sin dibujo',
    'clasificador/2': 'trampa', 'reloj/2': 'hora', 'baldosas/1': 'más grande', 'baldosas/2': 'Cuántas', 'errores/1': 'error',
    'errores/2': 'paso', 'clasificador/3': 'Justif', 'reloj/3': 'días', 'baldosas/3': 'Cuerdas', 'errores/3': 'Nombra', 'leelo/1': 'Escúchalo',
    'criba/3': 'probar', 'expresion/1': 'Dos operaciones', 'errores1/1': 'error',
  };
  const vistos = new Set();
  for (const t of TAREAS.filter(t => t.unidad === 2)) {
    for (const [slug, n] of [...t.estrella, ...t.elegir]) {
      const d = await declaracionDe(practicaPorSlug(slug));
      const nombre = d.ejercicios[n - 1].nombre.es;
      const clave = `${slug}/${n}`;
      assert.ok(clave in esperado, `${clave} no está en la lista de la nota`);
      assert.ok(nombre.toLowerCase().includes(esperado[clave].toLowerCase()), `${clave} se llama «${nombre}», no «…${esperado[clave]}…»`);
      vistos.add(clave);
    }
  }
  assert.equal(vistos.size, 56, 'las cuatro semanas: 14 ejercicios cada una, sin repetir ninguno entre semanas');
});

// --- Página de la tarea y portada por unidades (tarea 52) ----------------------------------

import {
  ambitoDeTarea, progresoDeTarea, asignacionGuardada, cargarAsignacion, asignadaAMi, vistaPlazo,
  ejercicioFueraDePlazo, esRepasoDeOtraUnidad, seccionesPorUnidad, unidadesAbiertas, recordarUnidad, claveAsignacion,
} from '../practicas/vista-tareas.js';
import { claveProgresoTarea } from '../practicas/_comun/nube.js';
import { T } from '../practicas/_comun/textos.js';

async function conAlmacen(prueba) {
  const almacen = new Map();
  globalThis.localStorage = { getItem: k => almacen.get(k) ?? null, setItem: (k, v) => almacen.set(k, String(v)), removeItem: k => almacen.delete(k) };
  try { return await prueba(almacen); } finally { delete globalThis.localStorage; }
}

test('regla de publicación: con t=1 se lee el progreso de la práctica; con una tarea v2, el de la tarea', async () => {
  assert.equal(ambitoDeTarea(tareaPorId(1)), null);
  for (const t of TAREAS.filter(x => x.id !== 1)) assert.equal(ambitoDeTarea(t), t.id);
  await conAlmacen(almacen => {
    // El mismo ejercicio terminado en la práctica libre y NO en la tarea 2.
    almacen.set(claveProgreso('semaforo', 'ABCD'), JSON.stringify({ ej: [hecho(), hecho(), hecho(), hecho()] }));
    const t1 = estadoTarea(tareaPorId(1), progresoDeTarea(tareaPorId(1), 'ABCD'));
    assert.ok(t1.estrella.find(e => e.slug === 'semaforo').terminado, 'la tarea 1 cuenta lo de la práctica libre');
    const t2 = estadoTarea(tareaPorId(2), progresoDeTarea(tareaPorId(2), 'ABCD'));
    assert.equal(t2.estrella.find(e => e.slug === 'semaforo').terminado, false, 'una tarea v2 no cuenta lo de la práctica libre');
    // Y al revés: lo hecho dentro de la tarea 2 se lee de su clave.
    almacen.set(claveProgresoTarea('semaforo', 'ABCD', 2), JSON.stringify({ ej: [null, null, hecho(0, 60)] }));
    const t2b = estadoTarea(tareaPorId(2), progresoDeTarea(tareaPorId(2), 'ABCD'));
    assert.ok(t2b.estrella.find(e => e.slug === 'semaforo' && e.n === 3).terminado);
    assert.equal(t2b.estrella.find(e => e.slug === 'semaforo' && e.n === 3).ej.dia, 60);
  });
});

test('vistaPlazo: las frases en los cuatro estados, en los dos idiomas', () => {
  const tarea = { ...TAREA, unidad: 2, hasta: '2026-10-22' };
  const d = diaDeFecha('2026-10-22');
  const hecha = dia => ({ cumplida: true, diaEntrega: dia });
  const sin = { cumplida: false, diaEntrega: 0 };
  const es = T.es, en = T.en;
  const f = (est, hoy, asig = false, t = es) => vistaPlazo(tarea, est, hoy, asig, t);
  assert.equal(f(sin, d - 2).frase, 'Plazo: jueves 22-10');
  assert.equal(f(sin, d - 2, false, en).frase, 'Deadline: Thursday 22/10');
  assert.equal(f(sin, d).frase, 'Plazo: jueves 22-10', 'el día del plazo aún vale');
  assert.equal(f(sin, d + 3).frase, 'Fuera de plazo · 3 días de retraso');
  assert.equal(f(sin, d + 1).frase, 'Fuera de plazo · 1 día de retraso');
  assert.equal(f(sin, d + 3, false, en).frase, 'Past the deadline · 3 days late');
  assert.equal(f(hecha(d + 3), d + 9).frase, 'Entregada con 3 días de retraso');
  assert.equal(f(hecha(d), d + 9).frase, '✓ Entregada');
  assert.equal(f(hecha(d + 3), d + 9, false, en).frase, 'Handed in 3 days late');
  assert.deepEqual([f(sin, d - 2).estado, f(sin, d + 3).estado, f(hecha(d + 3), d + 9).estado, f(hecha(d), d).estado], ['plazo', 'fuera', 'tarde', 'entregada']);
  assert.equal(f(sin, d - 2).etiqueta, 'Obligatoria');
  // Repaso (sin plazo): etiqueta y nada más.
  const repaso = vistaPlazo({ ...TAREA, unidad: 1 }, sin, d + 40, false, es);
  assert.deepEqual([repaso.tipo, repaso.etiqueta, repaso.frase, repaso.fueraDePlazo], ['repaso', 'Repaso', '', false]);
  // Asignada: obligatoria para ti al asignado; al resto, repaso sin plazo ni marca (aunque haya pasado).
  const asignada = { ...tarea, asignada: true };
  const mia = vistaPlazo(asignada, sin, d + 3, true, es);
  assert.deepEqual([mia.etiqueta, mia.frase], ['Obligatoria para ti', 'Fuera de plazo · 3 días de retraso']);
  const ajena = vistaPlazo(asignada, sin, d + 3, false, es);
  assert.deepEqual([ajena.tipo, ajena.etiqueta, ajena.frase, ajena.estado], ['repaso', 'Repaso', '', '']);
  assert.doesNotMatch(JSON.stringify(ajena), /obligatoria|asignad|required/i, 'a un no asignado nada le dice que otros la tienen obligatoria');
});

test('ejercicioFueraDePlazo: solo lo terminado después del plazo, y solo si hay plazo para ese alumno', () => {
  const tarea = { ...TAREA, hasta: '2026-10-22' };
  const d = diaDeFecha('2026-10-22');
  assert.equal(ejercicioFueraDePlazo(tarea, { terminado: true, dia: d }, 'obligatoria'), false);
  assert.equal(ejercicioFueraDePlazo(tarea, { terminado: true, dia: d + 1 }, 'obligatoria'), true);
  assert.equal(ejercicioFueraDePlazo(tarea, { terminado: false, dia: d + 1 }, 'obligatoria'), false);
  assert.equal(ejercicioFueraDePlazo(tarea, { terminado: true, dia: d + 1 }, 'repaso'), false);
  assert.equal(ejercicioFueraDePlazo(TAREA, { terminado: true, dia: 999 }, 'obligatoria'), false, 'sin plazo');
});

test('«· repaso U1» solo cuando la práctica es de otra unidad que la tarea', () => {
  const t1 = tareaPorId(1);
  assert.equal(esRepasoDeOtraUnidad(practicaPorSlug('jerarquia'), t1), true);
  assert.equal(esRepasoDeOtraUnidad(practicaPorSlug('semaforo'), t1), false);
  assert.equal(esRepasoDeOtraUnidad(practicaPorSlug('errores1'), tareaPorId(14)), false);
  assert.equal(esRepasoDeOtraUnidad(practicaPorSlug('errores'), tareaPorId(4)), false);
  assert.equal(T.es.repaso_de_unidad(1), '· repaso U1');
});

test('asignación: copia en el navegador, nube con prioridad y sin red se sigue con la copia', async () => {
  const tarea = { id: 7, asignada: true };
  assert.equal(asignadaAMi(tarea, [3, 7]), true);
  assert.equal(asignadaAMi(tarea, [3]), false);
  assert.equal(asignadaAMi(tarea, null), false, 'sin red ni copia, como repaso');
  assert.equal(asignadaAMi({ id: 7 }, [7]), false, 'una tarea que no es asignada no se marca');
  await conAlmacen(async almacen => {
    assert.equal(asignacionGuardada('ABCD'), null);
    assert.deepEqual(await cargarAsignacion('ABCD', { leerRemota: async () => null }), null, 'ni nube ni copia');
    assert.deepEqual(await cargarAsignacion('ABCD', { leerRemota: async () => ({ tareas: [7, 9] }) }), [7, 9]);
    assert.equal(almacen.get(claveAsignacion('ABCD')), '[7,9]', 'la copia se guarda');
    assert.deepEqual(asignacionGuardada('ABCD'), [7, 9]);
    assert.deepEqual(await cargarAsignacion('ABCD', { leerRemota: async () => null }), [7, 9], 'sin red: la copia');
    assert.deepEqual(await cargarAsignacion('ABCD', { leerRemota: async () => ({ tareas: [] }) }), [], 'la nube vacía quita la asignación');
    almacen.set(claveAsignacion('ABCD'), '{roto');
    assert.equal(asignacionGuardada('ABCD'), null);
  });
});

test('portada: la unidad actual arriba y las anteriores detrás; sin nada publicado, una unidad no sale', () => {
  const ids = (hoy, opciones) => seccionesPorUnidad(hoy, opciones).map(s => `${s.unidad.n}${s.actual ? '*' : ''}`);
  assert.deepEqual(ids('2026-10-17', { tareas: TAREAS }), ['2*', '1']);
  assert.deepEqual(ids('2026-09-20', { tareas: TAREAS }), ['1*'], 'antes de la unidad 2, solo la 1');
  // El 16-11 la actual pasa a ser la 3, pero sin prácticas ni tareas publicadas no sale.
  assert.deepEqual(ids('2026-11-16', { tareas: TAREAS }), ['2', '1']);
  const u3 = { id: 21, unidad: 3, titulo: { es: 'x', en: 'x' }, estrella: [['recta', 1]], elegir: [], nElegir: 0 };
  assert.deepEqual(ids('2026-11-16', { tareas: [...TAREAS, u3] }), ['3*', '2', '1']);
  assert.deepEqual(ids('2026-10-17', { tareas: [...TAREAS, u3] }), ['2*', '1'], 'una unidad que no ha llegado no sale');
  const [u2, u1] = seccionesPorUnidad('2026-10-17', { tareas: TAREAS });
  assert.deepEqual(u2.tareas.map(t => t.id), [1], 'el 17-10 solo ha llegado la semana 1');
  assert.deepEqual(u1.tareas.map(t => t.id), [11, 12, 13, 14]);
  assert.ok(u2.practicas.every(p => p.unidad === 2 && p.id !== ID_PLANTILLA));
  assert.equal(u1.practicas.length, 15);
  assert.ok(![...u1.practicas, ...u2.practicas].some(p => p.slug === 'plantilla'));
});

test('portada: tareas de la unidad actual, de la más nueva a la más antigua; las de las anteriores, en su orden', async () => {
  const { ordenTareas } = await import('../practicas/portada.js');
  const [u2, u1] = seccionesPorUnidad('2026-10-17', { tareas: TAREAS });
  assert.deepEqual(ordenTareas(u1.tareas, u1.actual).map(t => t.id), [11, 12, 13, 14], 'la U1, de la semana 1 a la 4');
  assert.deepEqual(ordenTareas([{ id: 1 }, { id: 2 }], true).map(t => t.id), [2, 1]);
  assert.equal(u2.actual, true);
});

test('portada: los bloques de la unidad 2 se conservan y la unidad 1 va en una lista sin subtítulos', async () => {
  const { bloquesPublicados, BLOQUES } = await import('../practicas/portada.js');
  assert.ok(BLOQUES.every(b => b.unidad === 2), 'ya no hay bloque «Repaso de la unidad 1»');
  const u2 = bloquesPublicados(CATALOGO, 2);
  assert.equal(u2.length, 5);
  assert.equal(u2.reduce((s, b) => s + b.practicas.length, 0), 16);
  assert.ok(u2.every(b => b.titulo));
  const u1 = bloquesPublicados(CATALOGO, 1);
  assert.equal(u1.length, 1);
  assert.equal(u1[0].titulo, null);
  assert.equal(u1[0].practicas.length, 15);
  // Una práctica de la U2 que no esté en ningún bloque no se pierde.
  const extra = [...CATALOGO, { id: 99, slug: 'nueva', ruta: 'nueva/', unidad: 2, nombre: { es: 'N', en: 'N' }, nEjercicios: 1, disponible: true }];
  const otras = bloquesPublicados(extra, 2).at(-1);
  assert.deepEqual(otras.practicas.map(p => p.slug), ['nueva']);
});

test('portada: se recuerda qué unidades plegables ha abierto el alumno', () => conAlmacen(() => {
  assert.deepEqual(unidadesAbiertas(), {});
  recordarUnidad(1, true);
  recordarUnidad(3, false);
  assert.deepEqual(unidadesAbiertas(), { 1: true, 3: false });
  recordarUnidad(1, false);
  assert.deepEqual(unidadesAbiertas(), { 1: false, 3: false });
  globalThis.localStorage.setItem('practicas.portada.abiertas', '[1,2]');
  assert.deepEqual(unidadesAbiertas(), {}, 'una lista no vale');
}));

test('semana.js: pasa el ámbito de la tarea a la base y deja la tarea 1 con el día de siempre', () => {
  const fuente = readFileSync(new URL('../practicas/semana.js', import.meta.url), 'utf8');
  assert.match(fuente, /sincronizarGuardado\(slug, suyo, \{ tareaId: ambitoDeTarea\(tarea\), profesor \}\)/);
  assert.match(fuente, /progresoDeTarea\(tarea, codigo\)/);
  assert.match(fuente, /tarea\.progresoPorPractica \? est\.dia : est\.diaEntrega/);
  assert.doesNotMatch(fuente, /semana__pedir/);
});

// --- Portada y página de la tarea con el código de 8: las tareas del profesor (tarea 65) ----

import { identificar, contextoGuardado, contextoAntiguo } from '../practicas/vista-tareas.js';
import { claveEspacio } from '../practicas/_comun/espacio.js';
import { leerCodigoAlumno } from '../practicas/_comun/codigos.js';
import { UNIDADES as UNIDADES_CURSO } from '../practicas/_comun/catalogo.js';

const CODIGO8 = 'K7QMP3XA';
const tareaDe = (id, unidad, extra = {}) => ({
  id, unidad, titulo: { es: `Tarea ${id}`, en: `Task ${id}` }, estrella: [['recta', 1], ['semaforo', 1]], elegir: [['criba', 1], ['arbol', 1]], nElegir: 1, ...extra,
});
// Un profesor inventado: la unidad 2 empieza más tarde que en el curso, y sus tareas llevan sus fechas.
const CONFIG_A = {
  unidades: [{ n: 1, desde: '2026-09-14' }, { n: 2, desde: '2026-11-02' }],
  tareas: [
    tareaDe(1, 1, { hasta: '2026-10-30' }),
    tareaDe(2, 1),
    tareaDe(3, 2, { desde: '2026-11-02', hasta: '2026-11-06' }),
    tareaDe(4, 2, { desde: '2026-11-09', hasta: '2026-11-13' }),
    tareaDe(5, 2, { desde: '2026-11-09', asignada: true, hasta: '2026-11-13' }),
  ],
};
const resolverA = async codigo => (codigo === CODIGO8
  ? { modo: 'nuevo', profesor: 'uidProfesorA0001', n: 7, config: CONFIG_A, desdeCache: false }
  : { error: 'no-existe' });

test('identificar: con 4 caracteres es lo de hoy (TAREAS y UNIDADES) y no pregunta a nadie', async () => {
  const c = await identificar('7NPD', { resolver: () => assert.fail('no debe preguntar') });
  assert.equal(c.modo, 'antiguo');
  assert.equal(c.codigo, '7NPD');
  assert.equal(c.profesor, null);
  assert.equal(c.tareas, TAREAS);
  assert.equal(c.unidades, UNIDADES_CURSO);
  assert.equal(c.indice, leerCodigoAlumno('7NPD'));
  assert.deepEqual(contextoAntiguo(3).codigo, codigoAlumno(3));
});

test('identificar: con 8 caracteres salen las tareas y las fechas de su profesor (también con guion y en minúsculas)', async () => {
  for (const texto of [CODIGO8, 'K7QM-P3XA', ' k7qm p3xa ']) {
    const c = await identificar(texto, { resolver: resolverA });
    assert.equal(c.modo, 'nuevo');
    assert.equal(c.codigo, CODIGO8, 'el código se guarda sin guion y en mayúsculas');
    assert.equal(c.profesor, 'uidProfesorA0001');
    assert.equal(c.indice, 7);
    assert.deepEqual(c.tareas.map(t => t.id), [1, 2, 3, 4, 5]);
    assert.equal(c.unidades.find(u => u.n === 2).desde, '2026-11-02', 'la fecha es la suya');
    assert.equal(c.unidades.find(u => u.n === 3).desde, UNIDADES_CURSO.find(u => u.n === 3).desde, 'la que no fija conserva la del curso');
    assert.deepEqual(c.unidades.map(u => u.titulo.es), UNIDADES_CURSO.map(u => u.titulo.es), 'los títulos son comunes');
  }
});

test('identificar: código mal escrito, que no existe o sin red ni copia', async () => {
  assert.deepEqual(await identificar('ABC', { resolver: resolverA }), { error: 'no-valido' });
  assert.deepEqual(await identificar('7NPE', { resolver: resolverA }), { error: 'no-valido' });
  assert.deepEqual(await identificar('ZZZZ-ZZZZ', { resolver: resolverA }), { error: 'no-existe' });
  assert.deepEqual(await identificar(CODIGO8, { resolver: async () => ({ error: 'sin-red' }) }), { error: 'sin-red' });
  // Un número de lista que no cabe en el código de resultado no se usa.
  const grande = await identificar(CODIGO8, { resolver: async () => ({ modo: 'nuevo', profesor: 'u', n: 5000, config: CONFIG_A }) });
  assert.equal(grande.indice, null);
});

test('portada con la configuración del profesor: qué tareas salen cada día, con sus fechas y en qué orden', async () => {
  const c = await identificar(CODIGO8, { resolver: resolverA });
  const ids = (hoy, n) => seccionesPorUnidad(hoy, { tareas: c.tareas, unidades: c.unidades }).find(s => s.unidad.n === n)?.tareas.map(t => t.id);
  // El 17-10 (con las fechas del curso ya sería la unidad 2) para este profesor aún es la 1.
  const el17 = seccionesPorUnidad('2026-10-17', { tareas: c.tareas, unidades: c.unidades });
  assert.deepEqual(el17.map(s => `${s.unidad.n}${s.actual ? '*' : ''}`), ['1*']);
  assert.deepEqual(ids('2026-10-17', 1), [1, 2]);
  // El 2-11 llega su unidad 2 con la tarea 3; la 4 y la 5 esperan al 9-11.
  assert.deepEqual(ids('2026-11-02', 2), [3]);
  assert.deepEqual(ids('2026-11-09', 2), [3, 4, 5]);
  const [u2, u1] = seccionesPorUnidad('2026-11-09', { tareas: c.tareas, unidades: c.unidades });
  assert.equal(u2.actual, true);
  assert.deepEqual(u1.tareas.map(t => t.id), [1, 2]);
  // Con las tareas del curso (código de 4) el mismo día sale lo de hoy, no lo del profesor.
  const antiguo = contextoAntiguo(0);
  const deHoy = seccionesPorUnidad('2026-10-17', { tareas: antiguo.tareas, unidades: antiguo.unidades });
  assert.deepEqual(deHoy.map(s => s.unidad.n), [2, 1]);
  assert.deepEqual(deHoy[1].tareas.map(t => t.id), [11, 12, 13, 14]);
});

test('página de la tarea: la tarea se busca entre las del profesor; una que no tiene no existe', async () => {
  const c = await identificar(CODIGO8, { resolver: resolverA });
  assert.equal(tareaPorId(3, c.tareas).titulo.es, 'Tarea 3');
  assert.equal(tareaPorId(11, c.tareas), null, 'la tarea 11 del curso no es de este profesor');
  assert.ok(tareaPorId(11, TAREAS), 'pero con un código de 4 sí');
  assert.equal(tareaPorId(NaN, c.tareas), null);
});

test('plazo con las fechas del profesor y asignación del espacio', async () => {
  const c = await identificar(CODIGO8, { resolver: resolverA });
  const t = T.es;
  const tarea3 = tareaPorId(3, c.tareas), tarea5 = tareaPorId(5, c.tareas);
  const sinNada = estadoTarea(tarea3, () => null);
  assert.equal(vistaPlazo(tarea3, sinNada, diaDeFecha('2026-11-04'), false, t).estado, 'plazo');
  assert.equal(vistaPlazo(tarea3, sinNada, diaDeFecha('2026-11-09'), false, t).estado, 'fuera');
  // La 5 es asignada: solo es obligatoria para quien está marcado en el espacio.
  const lista = await cargarAsignacion(CODIGO8, { profesor: 'uidProfesorA0001', leerRemota: async () => ({ tareas: [5] }), escribirClave: () => {} });
  assert.deepEqual(lista, [5]);
  assert.equal(vistaPlazo(tarea5, sinNada, diaDeFecha('2026-11-10'), asignadaAMi(tarea5, lista), t).tipo, 'obligatoria_para_ti');
  assert.equal(vistaPlazo(tarea5, sinNada, diaDeFecha('2026-11-10'), asignadaAMi(tarea5, []), t).tipo, 'repaso');
});

test('la asignación de un código de 8 se lee de las asignaciones de su espacio', async () => {
  const pedidos = [];
  const anterior = globalThis.fetch;
  globalThis.fetch = async url => { pedidos.push(String(url)); return { ok: true, json: async () => ({ fields: { tareas: { arrayValue: { values: [{ integerValue: '5' }] } } } }) }; };
  try {
    await conAlmacen(async () => {
      assert.deepEqual(await cargarAsignacion(CODIGO8, { profesor: 'uidProfesorA0001' }), [5]);
      assert.deepEqual(await cargarAsignacion('7NPD'), [5]);
    });
  } finally { globalThis.fetch = anterior; }
  if (pedidos.length) {   // sin configuración de Firebase en el entorno de pruebas no se llega a pedir nada
    assert.match(pedidos[0], /\/practicas-espacios\/uidProfesorA0001\/asignaciones\/K7QMP3XA\?/);
    assert.match(pedidos[1], /\/practicas-asignaciones\/7NPD\?/, 'con 4, la colección de siempre');
  }
});

test('sin red se sigue con la copia del navegador; sin copia, las prácticas sin tareas', async () => {
  await conAlmacen(almacen => {
    assert.equal(contextoGuardado(CODIGO8), null, 'sin copia no hay nada');
    almacen.set(claveEspacio(CODIGO8), JSON.stringify({ profesor: 'uidProfesorA0001', n: 7, json: JSON.stringify(CONFIG_A) }));
    const c = contextoGuardado('k7qm-p3xa');
    assert.equal(c.profesor, 'uidProfesorA0001');
    assert.deepEqual(c.tareas.map(t => t.id), [1, 2, 3, 4, 5]);
    assert.equal(c.desdeCache, true);
    almacen.set(claveEspacio(CODIGO8), '{roto');
    assert.equal(contextoGuardado(CODIGO8), null, 'una copia rota no vale');
    assert.equal(contextoGuardado('7NPD'), null, 'el modo antiguo no usa copia');
  });
});

test('portada.js y semana.js: aceptan los dos códigos, mantienen los enlaces del modo antiguo y no tocan la base', () => {
  const semana = readFileSync(new URL('../practicas/semana.js', import.meta.url), 'utf8');
  const portada = readFileSync(new URL('../practicas/portada.js', import.meta.url), 'utf8');
  assert.match(semana, /maxlength="12"/, 'con guion, un código de 8 mide 9');
  assert.match(semana, /await identificar\(texto\)/);
  assert.match(semana, /tareaPorId\(idTarea, tareas\)/);
  assert.match(semana, /cargarAsignacion\(suyo, \{ profesor \}\)/);
  assert.match(portada, /seccionesPorUnidad\(fechaISO\(new Date\(\)\), \{ tareas, unidades \}\)/);
  assert.match(portada, /cargarAsignacion\(suyo, \{ profesor \}\)/);
  // Los enlaces de siempre siguen valiendo: t=<id> y c=<código>.
  assert.match(semana, /params\.get\('c'\) \?\? leer\('practicas\.codigo'\)/);
  assert.match(portada, /href="semana\.html\?t=\$\{tarea\.id\}\$\{codigo \? `&c=\$\{codigo\}` : ''\}"/);
});

test('textos del código de 8: sin red y sin tareas, en los dos idiomas', () => {
  for (const idioma of ['es', 'en']) {
    for (const clave of ['espacio_sin_red', 'espacio_sin_tareas', 'entrada_no_existe']) {
      assert.ok(typeof T[idioma][clave] === 'string' && T[idioma][clave].length > 10, `${idioma}.${clave}`);
    }
  }
});
