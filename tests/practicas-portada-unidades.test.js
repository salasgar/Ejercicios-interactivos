import { test } from 'node:test';
import assert from 'node:assert/strict';
import { unidadSaleAbierta } from '../practicas/portada.js';

const actual = { actual: true, unidad: { n: 2 } };
const anterior = { actual: false, unidad: { n: 1 } };

test('la unidad actual sale abierta aunque el alumno la plegara', () => {
  assert.equal(unidadSaleAbierta(actual, { 2: false }), true);
  assert.equal(unidadSaleAbierta(actual, {}), true);
  assert.equal(unidadSaleAbierta(actual), true);
});

test('una unidad anterior sale plegada sin dato y abierta si el alumno la abrió', () => {
  assert.equal(unidadSaleAbierta(anterior, {}), false);
  assert.equal(unidadSaleAbierta(anterior, { 1: false }), false);
  assert.equal(unidadSaleAbierta(anterior, { 1: true }), true);
});
