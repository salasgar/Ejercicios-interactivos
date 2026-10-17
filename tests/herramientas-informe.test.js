// Tests del informe de actividad (herramientas/informe-actividad.mjs): las
// funciones puras de cálculo, con documentos inventados. La lectura de
// Firestore no se prueba aquí.

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resumirEjercicio, ejerciciosDe, leerGrupos, agregar, formatear, UMBRALES, claveDocumento, tareaVigente, fechaMadrid, textoEntrega,
  documentosAMapa, asignacionesAMapa, listaDeCodigos, leerCsvCodigos, listaDeDocumentos, listarSubcoleccion,
} from '../herramientas/informe-actividad.mjs';
import { calcularHoy, etiqueta } from '../practicas/profesor-hoy.js';
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

// --- Espacio de un profesor (tarea 68): códigos secretos, «Hoy» y `--espacio` ------------------------

const SECRETOS = ['K7QMP3XA', 'H2N8WRTB', 'ZC4D9EFG'];   // inventados; el alfabeto no tiene I, O, 0 ni 1
const estadoDe = ejs => JSON.stringify({ ej: ejs });
/** Un documento crudo como lo da el SDK del panel o la lista REST. */
const crudo = (id, ejs, actualizado = AHORA - 1000) => ({ id, estado: estadoDe(ejs), actualizado });

test('documentosAMapa y asignacionesAMapa: de los crudos al Map de agregar; lo ilegible se descarta', () => {
  const docs = documentosAMapa(
    [crudo('recta--K7QMP3XA', [ej(10)])],
    [crudo('t77--recta--K7QMP3XA', [ej(5)]), { id: 't77--recta--H2N8WRTB', estado: 'no es json', actualizado: 1 }, { id: 'x', estado: '{"sin":"ej"}', actualizado: 1 }],
  );
  assert.deepEqual([...docs.keys()], ['recta--K7QMP3XA', 't77--recta--K7QMP3XA']);
  assert.equal(docs.get('t77--recta--K7QMP3XA').ej[0].puntos, 5);
  assert.equal(docs.get('t77--recta--K7QMP3XA').actualizado, AHORA - 1000);
  const asig = asignacionesAMapa([{ id: 'K7QMP3XA', tareas: [77, '3'] }, { id: 'sin-tareas' }]);
  assert.deepEqual([...asig.keys()], ['K7QMP3XA']);
  assert.deepEqual(asig.get('K7QMP3XA'), { tareas: [77, 3] });
});

test('listaDeCodigos, leerCsvCodigos y listaDeDocumentos: de dónde sale la lista de códigos', () => {
  assert.deepEqual(listaDeCodigos([{ id: SECRETOS[1], n: 2 }, { id: SECRETOS[0], n: 1 }, { id: 'x', n: 0 }, { n: 3 }]), [{ numero: 1, codigo: SECRETOS[0] }, { numero: 2, codigo: SECRETOS[1] }]);
  // El CSV de «Mis alumnos» trae los nombres: no se leen, solo el número y el código (con o sin guion).
  const csv = 'número,nombre,código,enlace\n1,"Prueba Uno, Ana",K7QM-P3XA,https://x.example/?c=K7QMP3XA\n2;Prueba Dos;H2N8WRTB;https://x.example\n\nsin,numero,ZC4D9EFG';
  assert.deepEqual(leerCsvCodigos(csv), [{ numero: 1, codigo: 'K7QMP3XA' }, { numero: 2, codigo: 'H2N8WRTB' }]);
  assert.ok(!JSON.stringify(leerCsvCodigos(csv)).includes('Prueba'));
  const docs = new Map([['t77--recta--K7QMP3XA', {}], ['recta--H2N8WRTB', {}]]);
  assert.deepEqual(listaDeDocumentos(docs, new Map([['ZC4D9EFG', { tareas: [] }]])), SECRETOS.slice().sort().map(codigo => ({ numero: null, codigo })));
});

test('agregar con lista de códigos secretos: mismos cálculos, sin tocar los códigos de 4', () => {
  const lista = SECRETOS.map((codigo, i) => ({ numero: i + 1, codigo }));
  const docs = new Map([
    ['t77--recta--K7QMP3XA', { ej: [ej(10), ej(10)], actualizado: AHORA - 1000 }],
    ['t77--recta--H2N8WRTB', { ej: [ej(0, { aciertos: 0, fallos: 12 })], actualizado: AHORA - 1000 }],
  ]);
  const nombres = new Map([[2, 'Prueba Dos, Luis']]);
  const r = agregar({ docs, tarea: TAREA_V2, lista, nombres, desde: DESDE, ahora: AHORA });
  assert.deepEqual([r.total, r.hanEntrado, r.activos], [3, 2, 2]);
  assert.deepEqual(r.alumnos.map(f => f.codigo), SECRETOS);
  assert.equal(r.alumnos[0].puntos, 20);
  assert.equal(r.alumnos[1].nombre, 'Prueba Dos, Luis');
  assert.ok(r.alertas.some(a => a.startsWith('Prueba Dos, Luis (n.º 2, código H2N8WRTB) lleva 12 fallos')), r.alertas.join('\n'));
  assert.ok(!('nombre' in r.alumnos[0]), 'sin nombre, la fila no lleva el campo (la salida del informe no cambia)');
  assert.equal('listaCompleta' in r, false);
});

test('agregar sin número de lista (lista deducida de los documentos): no inventa quién falta ni avisa de poca actividad', () => {
  const lista = listaDeDocumentos(new Map([['t77--recta--K7QMP3XA', {}]]));
  const docs = new Map([['t77--recta--K7QMP3XA', { ej: [ej(10)], actualizado: AHORA - 1000 }]]);
  const r = agregar({ docs, tarea: TAREA_V2, lista, listaCompleta: false, desde: DESDE - 99 * 3600 * 1000, ahora: AHORA });
  assert.equal(r.alumnos[0].numero, null);
  assert.equal(r.alumnos[0].grupo, '?');
  assert.deepEqual(r.alertas, []);
  const texto = formatear(r, { tarea: TAREA_V2, ahora: AHORA, horas: 24, fuente: 'practicas-espacios/UID' });
  assert.match(texto, /- K7QMP3XA · \? · 10 pt/);
  assert.match(texto, /No se sabe quién no ha entrado/);
  assert.doesNotMatch(texto, /Nunca han entrado/);
  assert.match(texto, /Fuente: documentos practicas-espacios\/UID/);
});

test('calcularHoy («Hoy» del panel): vacíos, nombres y lo mismo que el informe', () => {
  const alumnos = [{ n: 1, nombre: 'Prueba Uno, Ana', codigo: SECRETOS[0] }, { n: 2, nombre: 'Prueba Dos, Luis', codigo: SECRETOS[1] }, { n: 3, nombre: 'Prueba Tres', codigo: null }];
  const documentos = {
    'progreso-libre': [crudo(`recta--${SECRETOS[0]}`, [ej(10), ej(10)])],
    'progreso-tareas': [crudo(`t77--recta--${SECRETOS[0]}`, [ej(10), ej(10)])],
    asignaciones: [],
  };
  const base = { tareas: [TAREA_V2], alumnos, documentos, ahora: AHORA };
  assert.deepEqual(calcularHoy({ ...base, tareas: [] }), { motivoVacio: 'tareas' });
  assert.deepEqual(calcularHoy({ ...base, alumnos: [{ n: 1, nombre: 'Ana', codigo: null }] }), { motivoVacio: 'alumnos' });
  const hoy = calcularHoy(base);
  assert.equal(hoy.tarea.id, 77);
  assert.match(hoy.motivo, /plazo abierto más próximo/);
  // El alumno 3 no tiene código: no cuenta. El 2 no ha entrado; el 1, sí.
  assert.deepEqual([hoy.resumen.total, hoy.resumen.hanEntrado], [2, 1]);
  assert.deepEqual(hoy.resumen.alumnos.filter(f => !f.existe).map(etiqueta), ['Prueba Dos, Luis']);
  // Mismo resultado que llamando al informe con los mismos datos.
  const directo = agregar({
    docs: new Map([[`t77--recta--${SECRETOS[0]}`, { ej: [ej(10), ej(10)], actualizado: AHORA - 1000 }], [`recta--${SECRETOS[0]}`, { ej: [ej(10), ej(10)], actualizado: AHORA - 1000 }]]),
    tarea: TAREA_V2, lista: SECRETOS.slice(0, 2).map((codigo, i) => ({ numero: i + 1, codigo })), desde: AHORA - 24 * 3600 * 1000, ahora: AHORA,
  });
  assert.deepEqual(hoy.resumen.alumnos.map(f => f.puntos), directo.alumnos.map(f => f.puntos));
  assert.equal(etiqueta({ numero: 4 }), 'n.º 4');
  // Elegir la tarea a mano manda sobre la vigente.
  assert.equal(calcularHoy({ ...base, tareas: [TAREA_V2, { ...TAREA_V2, id: 78 }], tareaId: 78 }).tarea.id, 78);
});

test('listarSubcoleccion: pagina, devuelve los crudos de siempre y avisa si la cuenta no es lectora', async () => {
  const paginas = [
    { documents: [{ name: 'projects/p/databases/(default)/documents/practicas-espacios/U1/progreso-tareas/t77--recta--K7QMP3XA', fields: { estado: { stringValue: estadoDe([ej(5)]) }, actualizado: { integerValue: '12345' } } }], nextPageToken: 'SIGUE' },
    { documents: [{ name: 'projects/p/databases/(default)/documents/practicas-espacios/U1/progreso-tareas/t77--recta--H2N8WRTB', fields: { estado: { stringValue: estadoDe([]) }, actualizado: { integerValue: '9' } } }] },
  ];
  const pedidas = [];
  const pedir = async (url, opciones) => {
    pedidas.push([url, opciones.headers.Authorization]);
    return { ok: true, status: 200, json: async () => paginas[pedidas.length - 1] };
  };
  const config = { projectId: 'p' };
  const docs = await listarSubcoleccion('U1', 'progreso-tareas', 'TOKEN', { pedir, config });
  assert.deepEqual(docs.map(d => [d.id, d.actualizado]), [['t77--recta--K7QMP3XA', 12345], ['t77--recta--H2N8WRTB', 9]]);
  assert.equal(pedidas.length, 2);
  assert.ok(pedidas[0][0].includes('/practicas-espacios/U1/progreso-tareas?pageSize=300'));
  assert.ok(pedidas[1][0].includes('pageToken=SIGUE'));
  assert.ok(pedidas.every(([, auth]) => auth === 'Bearer TOKEN'));
  const asignaciones = await listarSubcoleccion('U1', 'asignaciones', 'T', {
    pedir: async () => ({ ok: true, status: 200, json: async () => ({ documents: [{ name: '.../asignaciones/K7QMP3XA', fields: { tareas: { arrayValue: { values: [{ integerValue: '77' }] } } } }] }) }), config,
  });
  assert.deepEqual(asignaciones, [{ id: 'K7QMP3XA', estado: undefined, actualizado: 0, tareas: [77] }]);
  await assert.rejects(listarSubcoleccion('U1', 'fallos', 'T', { pedir: async () => ({ ok: false, status: 403 }), config }), /403.*no es lectora/);
  await assert.rejects(listarSubcoleccion('U1', 'privado', 'T', { pedir, config }), /subcolección desconocida/);
});

test('el informe también lo importa el navegador: ninguna importación de node:* ni uso de process fuera de main', async () => {
  const { readFileSync } = await import('node:fs');
  const fuente = readFileSync(new URL('../herramientas/informe-actividad.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(fuente, /^import .* from 'node:/m);
  assert.match(fuente, /typeof process !== 'undefined'/);
  assert.doesNotMatch(fuente.split('function argumento')[0], /process\./);
});
