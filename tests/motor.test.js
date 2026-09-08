import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generarTarea, responder, resumen, ejercicioActual, terminada, REFUERZOS_POR_FALLO, TOPE_REFUERZOS_POR_CONCEPTO } from '../src/motor.js';

const TAREA = {
  id: 't1',
  titulo: 'Prueba',
  ejercicios: [{ tipo: 'jerarquia', cantidad: 3 }, { tipo: 'potencias', cantidad: 2 }],
};

function indiceOpcion(ej, filtro) {
  const i = ej.opciones.findIndex(filtro);
  assert.ok(i >= 0, 'no hay opción que cumpla el filtro');
  return i;
}

test('generarTarea crea la lista con las cantidades pedidas, numerada y reproducible', () => {
  const p = generarTarea(TAREA, 7, 1000);
  assert.equal(p.ejercicios.length, 5);
  assert.equal(p.ejercicios.filter(e => e.tipo === 'jerarquia').length, 3);
  assert.equal(p.ejercicios.filter(e => e.tipo === 'potencias').length, 2);
  assert.deepEqual(p.ejercicios.map(e => e.n), [1, 2, 3, 4, 5]);
  assert.ok(p.ejercicios.every(e => e.refuerzo === false));
  assert.equal(p.indice, 0);
  assert.equal(p.empezadaEn, 1000);
  assert.deepEqual(generarTarea(TAREA, 7, 1000), p);
});

test('acertar no añade refuerzos y avanza', () => {
  const p0 = generarTarea(TAREA, 7);
  const p1 = responder(p0, indiceOpcion(ejercicioActual(p0), o => o.correcta), 5);
  assert.equal(p1.ejercicios.length, 5);
  assert.equal(p1.indice, 1);
  assert.equal(p1.respuestas.length, 1);
  assert.equal(p1.respuestas[0].correcta, true);
  assert.equal(p1.respuestas[0].errorId, null);
  assert.equal(p1.respuestas[0].ts, 5);
  // Inmutable: el progreso original no cambia.
  assert.equal(p0.indice, 0);
  assert.equal(p0.respuestas.length, 0);
});

test('fallar con concepto añade 2 ejercicios de ese concepto al final', () => {
  const p0 = generarTarea(TAREA, 7);
  const ej = ejercicioActual(p0);
  const i = indiceOpcion(ej, o => o.error?.concepto);
  const concepto = ej.opciones[i].error.concepto;
  const p1 = responder(p0, i);
  assert.equal(p1.ejercicios.length, 5 + REFUERZOS_POR_FALLO);
  const extra = p1.ejercicios.slice(5);
  assert.ok(extra.every(e => e.refuerzo && e.origen === concepto && e.tipo === concepto));
  assert.deepEqual(extra.map(e => e.n), [6, 7]);
  assert.equal(p1.refuerzos[concepto], 2);
  assert.equal(p1.respuestas[0].concepto, concepto);
  assert.equal(p1.respuestas[0].correcta, false);
  // Los dos refuerzos no son iguales entre sí.
  assert.notEqual(extra[0].texto + extra[0].enunciado + extra[0].opciones.map(o => o.tex).join(), extra[1].texto + extra[1].enunciado + extra[1].opciones.map(o => o.tex).join());
});

test('fallar con error genérico no añade refuerzos', () => {
  // Buscamos una semilla en la que el primer ejercicio tenga un distractor genérico.
  for (let s = 1; s < 200; s++) {
    const p0 = generarTarea(TAREA, s);
    const ej = ejercicioActual(p0);
    const i = ej.opciones.findIndex(o => o.error && !o.error.concepto);
    if (i < 0) continue;
    const p1 = responder(p0, i);
    assert.equal(p1.ejercicios.length, 5);
    assert.equal(p1.respuestas[0].errorId, 'generico');
    return;
  }
  assert.fail('no se encontró ningún distractor genérico');
});

test('el tope de refuerzos por concepto se respeta', () => {
  let p = generarTarea({ id: 't', titulo: 't', ejercicios: [{ tipo: 'potencias', cantidad: 20 }] }, 3);
  let fallosConConcepto = 0;
  while (!terminada(p)) {
    const ej = ejercicioActual(p);
    const i = ej.opciones.findIndex(o => o.error?.concepto === 'potencias');
    if (i >= 0) fallosConConcepto++;
    p = responder(p, i >= 0 ? i : ej.opciones.findIndex(o => o.correcta));
  }
  assert.ok(fallosConConcepto > 3);
  assert.equal(p.refuerzos.potencias, TOPE_REFUERZOS_POR_CONCEPTO);
  assert.equal(p.ejercicios.length, 20 + TOPE_REFUERZOS_POR_CONCEPTO);
  assert.ok(p.terminadaEn);
  assert.throws(() => responder(p, 0));
});

test('resumen cuenta aciertos, porcentaje y errores por concepto', () => {
  let p = generarTarea(TAREA, 11);
  const ej = ejercicioActual(p);
  p = responder(p, indiceOpcion(ej, o => o.error?.concepto));
  p = responder(p, indiceOpcion(ejercicioActual(p), o => o.correcta));
  const r = resumen(p);
  assert.equal(r.hechos, 2);
  assert.equal(r.aciertos, 1);
  assert.equal(r.porcentaje, 50);
  assert.equal(r.total, 7);
  assert.equal(r.refuerzosAnadidos, 2);
  assert.equal(r.terminada, false);
  assert.equal(Object.values(r.erroresPorConcepto).reduce((s, n) => s + n, 0), 1);
});

test('retomar: responder sobre un progreso serializado (JSON) funciona igual', () => {
  const p0 = generarTarea(TAREA, 5);
  const p1 = responder(p0, indiceOpcion(ejercicioActual(p0), o => o.correcta));
  const copia = JSON.parse(JSON.stringify(p1));
  const p2 = responder(copia, indiceOpcion(ejercicioActual(copia), o => o.correcta));
  assert.equal(p2.indice, 2);
  assert.equal(p2.respuestas.length, 2);
});
