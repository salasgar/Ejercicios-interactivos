// Subtipos del generador `enteros` y destrezas del inventario de la unidad 3
// que declara cada uno (tarea 92 del reparto PU2). Fuerza bruta: 3000 ítems por
// subtipo, con el valor de la correcta recalculado aparte a partir del enunciado.

import test from 'node:test';
import assert from 'node:assert/strict';
// index.js primero: los generadores importan de él y el ciclo solo se resuelve así.
import { TIPOS, crearRng } from '../src/ejercicios/index.js';
import { SUBTIPOS, errores } from '../src/ejercicios/enteros.js';

const enteros = TIPOS.enteros;
const ID_U3 = /^U3-[1-4][ABC]-\d{2}$/;
const SEMILLAS = 3000;

// Formas de las sesiones 2-3: ni un paréntesis.
const SIN_PARENTESIS = ['resta_naturales', 'negativo_mas_positivo', 'negativo_menos_positivo', 'cadena_corta', 'cadena_larga'];

/** Valor de un enunciado en TeX neutro, calculado con JavaScript (sin usar la solución del generador). */
function evaluar(enunciado) {
  const js = enunciado.replace(/\\cdot/g, '*').replace(/\\div/g, '/');
  assert.match(js, /^[-+*/() \d]+$/, `enunciado raro: ${enunciado}`);
  return Function(`return (${js})`)();
}

test('enteros: cada subtipo declara destrezas con identificador U3-…', () => {
  assert.ok(SUBTIPOS.length > 0);
  for (const { id, items } of SUBTIPOS) {
    assert.ok(Array.isArray(items) && items.length > 0, `${id}: sin items`);
    for (const it of items) assert.match(it, ID_U3, `${id}: identificador raro «${it}»`);
    assert.equal(new Set(items).size, items.length, `${id}: items repetidos`);
  }
});

test('enteros: los subtipos tienen id único y `items` del módulo es su unión', () => {
  const ids = SUBTIPOS.map(s => s.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(enteros.items, [...new Set(SUBTIPOS.flatMap(s => s.items))].sort());
  assert.deepEqual(enteros.subtipos.map(s => s.id), ids);
});

for (const { id, generar } of SUBTIPOS) {
  test(`enteros/${id}: ${SEMILLAS} ítems con 4 opciones distintas, una correcta y bien calculada`, () => {
    const clavesDeError = new Set();
    for (let s = 1; s <= SEMILLAS; s++) {
      const ej = generar(crearRng(s));
      const donde = `semilla ${s}, «${ej.enunciado}»`;
      assert.equal(ej.opciones.length, 4, donde);
      const correctas = ej.opciones.filter(o => o.correcta);
      assert.equal(correctas.length, 1, `${donde}: ${correctas.length} correctas`);
      assert.equal(new Set(ej.opciones.map(o => o.tex)).size, 4, `${donde}: opciones repetidas`);
      // La correcta es el valor del enunciado, calculado aparte.
      assert.equal(Number(correctas[0].tex), evaluar(ej.enunciado), `${donde}: la correcta no es el valor`);
      // Ningún distractor vale lo mismo que la correcta, y todos los de error típico llevan pasos.
      for (const o of ej.opciones.filter(o => !o.correcta)) {
        assert.notEqual(Number(o.tex), evaluar(ej.enunciado), `${donde}: distractor igual a la correcta`);
        assert.ok(o.error, `${donde}: distractor sin error`);
        if (o.error.id !== 'generico') {
          assert.ok(errores[o.error.id], `${donde}: error ${o.error.id} sin definir`);
          clavesDeError.add(o.error.id);
        }
      }
      // Escritura: el producto con punto, nunca ×; ni «+8», ni letras en nada de lo que se pinta.
      const pintado = [ej.enunciado, ...ej.opciones.map(o => o.tex), ...ej.solucion.map(p => p.tex),
        ...ej.opciones.flatMap(o => (o.pasos ?? []).map(p => p.tex))].join(' | ');
      assert.ok(!/\\times|×/.test(pintado), `${donde}: ×`);
      assert.ok(!/[a-zA-Z]/.test(pintado.replace(/\\(cdot|div)/g, '')), `${donde}: letras en ${pintado}`);
      assert.ok(!/(^|\| )\+\d/.test(ej.opciones.map(o => o.tex).join(' | ')), `${donde}: «+n» como resultado`);
      assert.ok(!/=\s*\+\d/.test(pintado), `${donde}: «= +n»`);
      // Nada de dos signos seguidos sin paréntesis.
      assert.ok(!/[-+]\s*[-+]\s*\d/.test(pintado.replace(/\(\s*[-+]/g, '(')), `${donde}: dos signos seguidos`);
      if (SIN_PARENTESIS.includes(id)) {
        assert.ok(!/[()]/.test(pintado), `${donde}: paréntesis en una forma sin paréntesis`);
      }
    }
    assert.ok(clavesDeError.size > 0, `${id}: ningún error típico llegó a salir`);
  });
}

test('enteros: cada forma saca errores típicos distintos de los genéricos, no solo de relleno', () => {
  for (const { id, generar } of SUBTIPOS) {
    let conError = 0;
    for (let s = 1; s <= 300; s++) {
      const ej = generar(crearRng(s));
      conError += ej.opciones.filter(o => !o.correcta && o.error.id !== 'generico').length;
    }
    assert.ok(conError >= 300 * 2, `${id}: demasiados distractores genéricos (${conError} de ${300 * 3} con error típico)`);
  }
});
