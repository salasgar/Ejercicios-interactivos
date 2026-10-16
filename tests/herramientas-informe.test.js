// Tests del informe de actividad (herramientas/informe-actividad.mjs): las
// funciones puras de cálculo, con documentos inventados. La lectura de
// Firestore no se prueba aquí.

import test from 'node:test';
import assert from 'node:assert/strict';
import { resumirEjercicio, ejerciciosDe, leerGrupos, agregar, formatear, UMBRALES } from '../herramientas/informe-actividad.mjs';
import { tareaPorId } from '../practicas/_comun/tareas.js';
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
  const r = agregar({ docs, tarea, alumnos: 3, desde: DESDE, grupos: leerGrupos('G:1-3') });
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
  const r = agregar({ docs, tarea, alumnos: 2, desde: DESDE });
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
  const r = agregar({ docs: new Map(entradas), tarea, alumnos: 30, desde: DESDE, grupos: leerGrupos('G:1-30') });
  assert.ok(r.alertas.some(a => a.startsWith('Poca actividad: solo 6 de 30')), r.alertas.join('\n'));
  assert.ok(r.alertas.some(a => a.includes('n.º 6') && a.includes('12 fallos')), r.alertas.join('\n'));
  const dificil = r.alertas.find(a => a.includes('semaforo ej. 1 ★'));
  assert.ok(dificil, r.alertas.join('\n'));
  assert.match(dificil, /% de fallos entre 6 alumnos/);
  // Un ejercicio probado por pocos no genera alerta aunque falle mucho.
  const pocos = agregar({ docs: new Map(docsDe(0, { recta: [ej(0, { aciertos: 1, fallos: 9 })] })), tarea, alumnos: 1, desde: DESDE });
  assert.ok(!pocos.alertas.some(a => a.includes('recta ej. 1')));
  assert.ok(UMBRALES.minimoIntentos > 1);
});

test('agregar: muchos reinicios sin ratio de fallos alto también avisa', () => {
  const entradas = [];
  for (let i = 0; i < 6; i++) entradas.push(...docsDe(i, { recta: [ej(5, { aciertos: 20, fallos: 8, reinicios: i < 3 ? 1 : 0 })] }));
  const r = agregar({ docs: new Map(entradas), tarea, alumnos: 6, desde: DESDE });
  assert.ok(r.alertas.some(a => a.startsWith('Muchos reinicios: recta ej. 1 ★: 3 de 6')), r.alertas.join('\n'));
});

test('formatear: Markdown con alertas, resumen, tabla por grupo, ejercicios y alumnos', () => {
  const docs = new Map(docsDe(0, { recta: [ej(10), ej(4, { fallos: 3 })] }));
  const r = agregar({ docs, tarea, alumnos: 4, desde: DESDE, grupos: leerGrupos('A:1-2,B:3-4') });
  const texto = formatear(r, { tarea, ahora: AHORA, horas: 24 });
  assert.match(texto, /^# Actividad en las prácticas/);
  assert.match(texto, /## ⚠ Alertas\n- Poca actividad: solo 1 de 4/);
  assert.match(texto, /Han entrado alguna vez: \*\*1 de 4\*\*/);
  assert.match(texto, /\| A \| 2 \| 1 \| 1 \| 0 \| 7\.0 \|/);
  assert.match(texto, /\| recta ej\. 1 ★ \| 1 \| 1 \| 0 % \(0\) \| 0 \|/);
  assert.match(texto, /- 1 · A · 14 pt · 1\/6 ★ \+ 0 · 3 fallos · .*✓/);
  assert.match(texto, /Nunca han entrado \(números de lista\): 2, 3, 4\./);
});
