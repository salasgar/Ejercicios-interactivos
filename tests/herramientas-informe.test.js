// Tests del informe de actividad (herramientas/informe-actividad.mjs): las
// funciones puras de cálculo, con documentos inventados. La lectura de
// Firestore no se prueba aquí.

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resumirEjercicio, ejerciciosDe, leerGrupos, agregar, formatear, UMBRALES, claveDocumento, tareaVigente, fechaMadrid, textoEntrega,
} from '../herramientas/informe-actividad.mjs';
import { tareaPorId, diaDeFecha } from '../practicas/_comun/tareas.js';
import { codigoAlumno } from '../practicas/_comun/codigos.js';
import { diaDe } from '../practicas/_comun/contador.js';

const tarea = tareaPorId(1);
const AHORA = Date.UTC(2026, 9, 20, 19, 30); // 20-10-2026 19:30Z
const DESDE = AHORA - 24 * 3600 * 1000;
const HOY = diaDe(new Date(AHORA));

const ej = (puntos, extra = {}) => ({ puntos, objetivo: 10, vidas: 5, racha: 0, aciertos: puntos, fallos: 0, reinicios: 0, terminado: puntos >= 10, dia: puntos >= 10 ? HOY : 0, repeticiones: 0, ...extra });

test('resumirEjercicio: formato nuevo, formato antiguo (pendientes) y vacío', () => {
  assert.deepEqual(resumirEjercicio(ej(7, { fallos: 2 })), { puntos: 7, aciertos: 7, fallos: 2, reinicios: 0, terminado: false, dia: 0, intentado: true });
  assert.equal(resumirEjercicio({ pendientes: 6, aciertos: 4, fallos: 1 }).puntos, 4);
  assert.equal(resumirEjercicio({ pendientes: 11, aciertos: 1, fallos: 1 }).puntos, 0); // nunca negativo
  assert.equal(resumirEjercicio({ terminado: true, aciertos: 12, fallos: 3 }).puntos, 10); // terminado = objetivo
  assert.equal(resumirEjercicio(undefined).intentado, false);
  assert.equal(resumirEjercicio(null).puntos, 0);
});

test('ejerciciosDe: 6 ★ y 8 de elegir en la tarea 1, con n desde 1', () => {
  const e = ejerciciosDe(tarea);
  assert.equal(e.length, 14);
  assert.equal(e.filter(x => x.estrella).length, 6);
  assert.ok(e.every(x => Number.isInteger(x.n) && x.n >= 1));
});

test('leerGrupos', () => {
  assert.deepEqual(leerGrupos('1.º A:1-29,E1CB:30-46'), [{ nombre: '1.º A', desde: 1, hasta: 29 }, { nombre: 'E1CB', desde: 30, hasta: 46 }]);
  assert.deepEqual(leerGrupos(''), []);
});

/** Documentos de un alumno: { slug: [ej…] } → entradas del Map. */
function docsDe(indice, porSlug, actualizado = AHORA - 1000) {
  const codigo = codigoAlumno(indice);
  return Object.entries(porSlug).map(([slug, ejs]) => [`${slug}--${codigo}`, { ej: ejs, actualizado }]);
}

test('agregar: puntos de la tarea = ★ + los 4 mejores de elegir, con tope 10 por ejercicio', () => {
  // Alumno 0: todas las ★ hechas (60) y 6 de elegir hechas (solo cuentan 4: 40) → 100, tarea completa.
  const docs = new Map([
    ...docsDe(0, {
      divisores: [null, null, null, ej(10)],
      recta: [ej(10), ej(10), ej(10)],
      rectangulos: [ej(10), ej(10)],
      semaforo: [ej(10), ej(10), null, ej(10)],
      clasificador: [ej(10)],
      reloj: [ej(10)],
      leelo: [null, ej(10)],
      jerarquia: [ej(13)], // más de 10 no cuenta
    }),
  ]);
  const r = agregar({ docs, tarea, alumnos: 3, desde: DESDE, ahora: AHORA, grupos: leerGrupos('G:1-3') });
  const a0 = r.alumnos[0];
  assert.equal(a0.puntos, 100);
  assert.equal(a0.terminadosEstrella, 6);
  assert.equal(a0.terminadosElegir, 4);
  assert.equal(a0.completa, true);
  assert.equal(a0.activo, true);
  assert.equal(r.alumnos[1].existe, false);
  assert.equal(r.alumnos[1].puntos, 0);
  assert.equal(r.hanEntrado, 1);
  assert.equal(r.activos, 1);
});

test('agregar: activo solo si actualizado está dentro de la ventana; terminadosHoy cuenta por día', () => {
  const docs = new Map([
    ...docsDe(0, { recta: [ej(10), ej(3)] }, DESDE - 5000),             // actividad vieja
    ...docsDe(1, { recta: [ej(10, { dia: HOY - 3 }), ej(10)] }, AHORA), // una ★ de hace 3 días y otra de hoy
  ]);
  const r = agregar({ docs, tarea, alumnos: 2, desde: DESDE, ahora: AHORA });
  assert.equal(r.alumnos[0].existe, true);
  assert.equal(r.alumnos[0].activo, false);
  assert.equal(r.alumnos[1].activo, true);
  assert.equal(r.alumnos[1].terminadosHoy, 1);
});

test('agregar: alertas de poca actividad, alumno que no se aclara y ejercicio con muchos fallos', () => {
  const entradas = [];
  // 6 alumnos prueban semaforo ej. 1 con muchos fallos; el alumno 5 además lleva 0 puntos y 12 fallos.
  for (let i = 0; i < 6; i++) {
    const fallos = i === 5 ? 12 : 6;
    entradas.push(...docsDe(i, { semaforo: [ej(i === 5 ? 0 : 2, { aciertos: i === 5 ? 0 : 2, fallos })] }));
  }
  const r = agregar({ docs: new Map(entradas), tarea, alumnos: 30, desde: DESDE, ahora: AHORA, grupos: leerGrupos('G:1-30') });
  assert.ok(r.alertas.some(a => a.startsWith('Poca actividad: solo 6 de 30')), r.alertas.join('\n'));
  assert.ok(r.alertas.some(a => a.includes('n.º 6') && a.includes('12 fallos')), r.alertas.join('\n'));
  const dificil = r.alertas.find(a => a.includes('semaforo ej. 1 ★'));
  assert.ok(dificil, r.alertas.join('\n'));
  assert.match(dificil, /% de fallos entre 6 alumnos/);
  // Un ejercicio probado por pocos no genera alerta aunque falle mucho.
  const pocos = agregar({ docs: new Map(docsDe(0, { recta: [ej(0, { aciertos: 1, fallos: 9 })] })), tarea, alumnos: 1, desde: DESDE, ahora: AHORA });
  assert.ok(!pocos.alertas.some(a => a.includes('recta ej. 1')));
  assert.ok(UMBRALES.minimoIntentos > 1);
});

test('agregar: muchos reinicios sin ratio de fallos alto también avisa', () => {
  const entradas = [];
  for (let i = 0; i < 6; i++) entradas.push(...docsDe(i, { recta: [ej(5, { aciertos: 20, fallos: 8, reinicios: i < 3 ? 1 : 0 })] }));
  const r = agregar({ docs: new Map(entradas), tarea, alumnos: 6, desde: DESDE, ahora: AHORA });
  assert.ok(r.alertas.some(a => a.startsWith('Muchos reinicios: recta ej. 1 ★: 3 de 6')), r.alertas.join('\n'));
});

test('formatear: Markdown con alertas, resumen, tabla por grupo, ejercicios y alumnos', () => {
  const docs = new Map(docsDe(0, { recta: [ej(10), ej(4, { fallos: 3 })] }));
  const r = agregar({ docs, tarea, alumnos: 4, desde: DESDE, ahora: AHORA, grupos: leerGrupos('A:1-2,B:3-4') });
  const texto = formatear(r, { tarea, ahora: AHORA, horas: 24 });
  assert.match(texto, /^# Actividad en las prácticas/);
  assert.match(texto, /## ⚠ Alertas\n- Poca actividad: solo 1 de 4/);
  assert.match(texto, /Han entrado alguna vez: \*\*1 de 4\*\*/);
  assert.match(texto, /\| A \| 2 \| 1 \| 1 \| 0 \| 7\.0 \|/);
  assert.match(texto, /\| recta ej\. 1 ★ \| 1 \| 1 \| 0 % \(0\) \| 0 \|/);
  assert.match(texto, /- 1 · A · 14 pt · 1\/6 ★ \+ 0 · 3 fallos · .*✓/);
  assert.match(texto, /Nunca han entrado \(números de lista\): 2, 3, 4\./);
});

// --- Modelo v2 (tarea 54): documentos de la tarea, asignadas, retraso y tarea vigente ------------

const TAREA_V2 = {
  id: 77, unidad: 2, titulo: { es: 'Tarea de prueba', en: 'Test task' }, hasta: '2026-10-22',
  estrella: [['recta', 1], ['recta', 2]], elegir: [['semaforo', 1], ['semaforo', 2]], nElegir: 1,
};
const PLAZO = diaDeFecha('2026-10-22');
const AHORA_TARDE = Date.UTC(2026, 9, 26, 12, 0); // 26-10: 4 días después del plazo

/** Documentos de un alumno en una tarea, con la clave que corresponda a la tarea. */
function docsTarea(t, indice, porSlug, actualizado = AHORA_TARDE - 1000) {
  const codigo = codigoAlumno(indice);
  return Object.entries(porSlug).map(([slug, ejs]) => [claveDocumento(t, slug, codigo), { ej: ejs, actualizado }]);
}
/** Todos los ejercicios de TAREA_V2 terminados el día `dia` (recta 1-2 y semaforo 1). */
const entregadaEl = dia => ({ recta: [ej(10, { dia }), ej(10, { dia })], semaforo: [ej(10, { dia })] });

test('claveDocumento: la tarea 1 lee practicas/<slug>--<código>; las demás, practicas-tareas/t<id>--<slug>--<código>', () => {
  assert.equal(claveDocumento(tarea, 'recta', 'ABCD'), 'recta--ABCD');
  assert.equal(claveDocumento(TAREA_V2, 'recta', 'ABCD'), 't77--recta--ABCD');
  // Un documento de la práctica libre no cuenta en una tarea v2.
  const codigo = codigoAlumno(0);
  const libre = new Map([[`recta--${codigo}`, { ej: [ej(10), ej(10)], actualizado: AHORA }]]);
  const r = agregar({ docs: libre, tarea: TAREA_V2, alumnos: 1, desde: DESDE, ahora: AHORA });
  assert.deepEqual([r.alumnos[0].existe, r.alumnos[0].puntos], [false, 0]);
  const deTarea = new Map(docsTarea(TAREA_V2, 0, { recta: [ej(10), ej(10)] }, AHORA));
  const r2 = agregar({ docs: deTarea, tarea: TAREA_V2, alumnos: 1, desde: DESDE, ahora: AHORA });
  assert.deepEqual([r2.alumnos[0].existe, r2.alumnos[0].puntos, r2.alumnos[0].terminadosEstrella], [true, 20, 2]);
});

test('asignada: solo cuentan los asignados (dos de cinco); los demás no entran en ninguna cifra ni alerta', () => {
  const asignada = { ...TAREA_V2, asignada: true };
  const asignaciones = new Map([
    [codigoAlumno(1), { tareas: [77, 3] }],
    [codigoAlumno(3), { tareas: [77] }],
    [codigoAlumno(4), { tareas: [3] }],   // asignado a otra tarea, no a esta
    [codigoAlumno(2), null],                // sin documento
  ]);
  const entradas = [
    ...docsTarea(asignada, 1, entregadaEl(PLAZO - 1)),
    ...docsTarea(asignada, 0, entregadaEl(PLAZO - 1)),                // no asignado, aunque haya hecho la tarea
    ...docsTarea(asignada, 4, { recta: [ej(0, { aciertos: 0, fallos: 30 })] }),   // no asignado: ni «no se aclara»
  ];
  const r = agregar({ docs: new Map(entradas), tarea: asignada, alumnos: 5, desde: DESDE, asignaciones, ahora: AHORA });
  assert.deepEqual([r.total, r.noAsignados, r.alumnos.length], [2, 3, 2]);
  assert.deepEqual(r.alumnos.map(f => f.numero), [2, 4]);
  assert.deepEqual([r.hanEntrado, r.activos], [1, 1]);
  assert.ok(!r.alertas.some(a => a.includes('n.º 5')), r.alertas.join('\n'));
  const texto = formatear(r, { tarea: asignada, ahora: AHORA, horas: 24 });
  assert.match(texto, /Tarea asignada: cuentan solo los 2 alumnos asignados \(3 no asignados/);
  assert.match(texto, /Han entrado alguna vez: \*\*1 de 2\*\*/);
  assert.match(texto, /Nunca han entrado \(números de lista\): 4\./);
  // Sin asignaciones leídas, nadie está asignado.
  assert.equal(agregar({ docs: new Map(), tarea: asignada, alumnos: 5, desde: DESDE, ahora: AHORA }).total, 0);
});

test('retraso: a tiempo, tarde y sin entregar; pasado el plazo no avisa de poca actividad', () => {
  const entradas = [
    ...docsTarea(TAREA_V2, 0, entregadaEl(PLAZO - 2)),   // a tiempo
    ...docsTarea(TAREA_V2, 1, entregadaEl(PLAZO)),       // el mismo día del plazo: a tiempo
    ...docsTarea(TAREA_V2, 2, entregadaEl(PLAZO + 3)),   // 3 días tarde
    ...docsTarea(TAREA_V2, 3, { recta: [ej(10, { dia: PLAZO - 1 }), ej(4)] }),   // a medias
  ];
  const r = agregar({ docs: new Map(entradas), tarea: TAREA_V2, alumnos: 5, desde: AHORA_TARDE - 24 * 3600 * 1000, ahora: AHORA_TARDE });
  const [a, b, c, d, e] = r.alumnos.map(f => f.entrega);
  assert.deepEqual([a.entregada, a.fueraDePlazo, a.diasRetraso], [true, false, 0]);
  assert.deepEqual([b.entregada, b.fueraDePlazo, b.diasRetraso], [true, false, 0]);
  assert.deepEqual([c.entregada, c.fueraDePlazo, c.diasRetraso], [true, true, 3]);
  assert.deepEqual([d.entregada, d.fueraDePlazo, d.diasRetraso], [false, true, 4], 'sin entregar: 4 días y subiendo');
  assert.deepEqual([e.entregada, e.diasRetraso], [false, 4], 'quien nunca entró también lleva retraso');
  assert.deepEqual(r.plazo, { hasta: '2026-10-22', vencido: true, aTiempo: 2, conRetraso: 1, sinEntregar: 2 });
  assert.ok(!r.alertas.some(x => x.startsWith('Poca actividad')), 'pasado el plazo no se avisa');
  const texto = formatear(r, { tarea: TAREA_V2, ahora: AHORA_TARDE, horas: 24 });
  assert.match(texto, /Plazo vencido \(hasta el 2026-10-22\): \*\*2 a tiempo, 1 con retraso, 2 sin entregar\*\*/);
  assert.match(texto, /entregada 3 días tarde/);
  assert.match(texto, /entregada a tiempo/);
  assert.match(texto, /sin entregar, 4 días de retraso/);
  // Antes del plazo, con la misma poca actividad, sí avisa.
  const viejas = [...docsTarea(TAREA_V2, 0, entregadaEl(PLAZO - 2), DESDE - 5000), ...docsTarea(TAREA_V2, 2, entregadaEl(PLAZO + 3), DESDE - 5000)];
  const antes = agregar({ docs: new Map(viejas), tarea: TAREA_V2, alumnos: 5, desde: DESDE, ahora: AHORA });
  assert.ok(antes.alertas.some(x => x.startsWith('Poca actividad')), antes.alertas.join('\n'));
  assert.equal(antes.plazo.vencido, false);
  assert.deepEqual([antes.alumnos[4].entrega.fueraDePlazo, antes.alumnos[2].entrega.diasRetraso], [false, 3], 'antes del plazo no hay retraso, y una entrega con 3 días tarde conserva los 3');
});

test('textoEntrega: a tiempo, N días tarde, sin entregar; nada en un repaso', () => {
  assert.equal(textoEntrega({ tipo: 'repaso', entregada: true, fueraDePlazo: false, diasRetraso: 0 }), '');
  assert.equal(textoEntrega({ tipo: 'obligatoria', entregada: true, fueraDePlazo: false, diasRetraso: 0 }), 'entregada a tiempo');
  assert.equal(textoEntrega({ tipo: 'obligatoria', entregada: true, fueraDePlazo: true, diasRetraso: 1 }), 'entregada 1 día tarde');
  assert.equal(textoEntrega({ tipo: 'obligatoria', entregada: false, fueraDePlazo: false, diasRetraso: 0 }), 'sin entregar');
  assert.equal(textoEntrega({ tipo: 'obligatoria_para_ti', entregada: false, fueraDePlazo: true, diasRetraso: 2 }), 'sin entregar, 2 días de retraso');
});

test('tareaVigente: la obligatoria con el plazo abierto más próximo, o la última vencida', () => {
  const id = hoy => tareaVigente(hoy).tarea.id;
  assert.equal(id('2026-10-16'), 1);
  assert.equal(id('2026-10-22'), 1, 'el día del plazo aún está abierto');
  assert.equal(id('2026-10-23'), 1, 'publicada 2: aún no (su desde es el 26-10); vence la 1, la única publicada');
  assert.equal(id('2026-10-27'), 2);
  assert.equal(id('2026-11-03'), 3);
  assert.equal(id('2026-11-14'), 4, 'ninguna abierta: la última vencida');
  assert.equal(id('2026-12-20'), 4);
  assert.match(tareaVigente('2026-10-27').motivo, /plazo abierto más próximo \(hasta el 2026-10-29\)/);
  assert.match(tareaVigente('2026-11-14').motivo, /venció \(el 2026-11-12\)/);
  assert.equal(id('2026-10-01'), 1, 'antes de todo: la primera con plazo');
  // Las de repaso (sin plazo) y las asignadas no son «la obligatoria vigente».
  assert.ok([11, 12, 13, 14].every(n => tareaVigente('2026-10-27').tarea.id !== n));
  const propias = [{ id: 5, hasta: '2026-10-10', asignada: true }, { id: 6, hasta: '2026-10-12' }, { id: 7 }];
  assert.equal(tareaVigente('2026-10-11', propias).tarea.id, 6);
});

test('fechaMadrid: la fecha en la hora peninsular, no en UTC', () => {
  assert.equal(fechaMadrid(Date.UTC(2026, 9, 16, 23, 30)), '2026-10-17');   // 01:30 del 17 en horario de verano
  assert.equal(fechaMadrid(Date.UTC(2026, 9, 17, 21, 0)), '2026-10-17');
});

test('regla de publicación: el informe de la tarea 1 es el de siempre (documentos de la práctica, sin tarea elegida, entrega a la vista)', () => {
  const docs = new Map(docsDe(0, { recta: [ej(10), ej(10)], divisores: [null, null, null, ej(10)] }));
  const r = agregar({ docs, tarea, alumnos: 2, desde: DESDE, ahora: AHORA });
  assert.equal(r.alumnos[0].puntos, 30);
  assert.equal(r.total, 2);
  assert.equal(r.noAsignados, 0);
  const texto = formatear(r, { tarea, ahora: AHORA, horas: 24 });
  assert.doesNotMatch(texto, /elegida automáticamente|Tarea asignada/);
  assert.match(texto, /Fuente: documentos practicas\/<slug>--<código>/);
  assert.match(texto, /Plazo: hasta el 2026-10-22/);
});

test('«Tarea completa» dice lo que vale la tarea, no siempre 100 puntos', () => {
  const r = agregar({ docs: new Map(), tarea: TAREA_V2, alumnos: 3, desde: DESDE, ahora: AHORA });
  assert.match(formatear(r, { tarea: TAREA_V2, ahora: AHORA, horas: 24 }), /Tarea completa \(30 puntos\)/);
  assert.match(formatear(agregar({ docs: new Map(), tarea, alumnos: 3, desde: DESDE, ahora: AHORA }), { tarea, ahora: AHORA, horas: 24 }), /Tarea completa \(100 puntos\)/);
});
