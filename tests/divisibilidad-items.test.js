// Destrezas del inventario de la unidad 2 que declara el generador de
// divisibilidad (tarea 14 del reparto de la unidad 2). Es un dato declarativo:
// el filtrado por semana lo hace (o lo hará) el motor.

import test from 'node:test';
import assert from 'node:assert/strict';
// index.js primero: los generadores importan de él y el ciclo solo se resuelve así.
import { TIPOS } from '../src/ejercicios/index.js';
import { SUBTIPOS } from '../src/ejercicios/divisibilidad.js';

const divisibilidad = TIPOS.divisibilidad;

const ID_U2 = /^U2-[1-4][ABC]-\d{2}$/;

test('divisibilidad: cada subtipo declara destrezas con identificador U2-…', () => {
  assert.ok(SUBTIPOS.length > 0);
  for (const { id, items } of SUBTIPOS) {
    assert.ok(Array.isArray(items) && items.length > 0, `${id}: sin items`);
    for (const it of items) assert.match(it, ID_U2, `${id}: identificador raro «${it}»`);
    assert.equal(new Set(items).size, items.length, `${id}: items repetidos`);
  }
});

test('divisibilidad: los subtipos tienen id único y `items` del módulo es su unión', () => {
  const ids = SUBTIPOS.map(s => s.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(divisibilidad.items, [...new Set(SUBTIPOS.flatMap(s => s.items))].sort());
  assert.deepEqual(divisibilidad.subtipos.map(s => s.id), ids);
});
