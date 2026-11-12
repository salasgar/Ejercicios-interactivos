// «No lo sé» en `potencias-enteros` (tarea 179): la explicación de cada ejercicio lleva la solución
// del ítem, calculada con la lógica de la práctica. Por fuerza bruta: 1000+ ítems, dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { fmt } from '../practicas/_comun/enteros.js';
import * as L from '../practicas/potencias-enteros/logica.js';
import * as X from '../practicas/potencias-enteros/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const generar = (fn, semilla, n = 1200) => {
  const rng = crearRng(semilla);
  return Array.from({ length: n }, (_, i) => fn(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] }));
};
const limpio = html => !/undefined|NaN|\[object|×|null/.test(html);

test('potencias-enteros · ejercicio 1: la explicación lleva el producto', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarProducto, 401)) {
      const html = X.explicaProducto(item, ctx(idioma));
      assert.ok(plano(html).includes(`= ${fmt(L.producto(item))}`), 'el resultado');
      assert.ok(html.includes(L.expresionProducto(item)), 'la cuenta');
      assert.ok(limpio(html));
    }
  }
});

test('potencias-enteros · ejercicio 2: la explicación lleva el valor y el signo por el exponente', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarPotencia, 402)) {
      const html = X.explicaPotencia(item, ctx(idioma));
      assert.equal(L.valorPotencia(item), item.base ** item.exp);
      assert.ok(plano(html).includes(`= ${fmt(L.valorPotencia(item))}`), 'el valor');
      assert.equal(/\b(par|even)\b/.test(plano(html)), item.exp % 2 === 0);
      assert.ok(limpio(html));
    }
  }
});

test('potencias-enteros · ejercicio 3: la explicación lleva la base y el valor', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarBase, 403)) {
      const html = X.explicaBase(item, ctx(idioma));
      assert.ok(plano(html).includes(`= ${fmt(L.valorBase(item))}`), 'el valor');
      assert.ok(plano(html).includes(fmt(L.baseDeItem(item))), 'la base');
      assert.ok(limpio(html));
    }
  }
});

test('potencias-enteros · ejercicio 4: la explicación lleva los enteros, la raíz o «no existe»', () => {
  const vistos = new Set();
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarRaiz, 404)) {
      const html = X.explicaRaiz(item, ctx(idioma));
      vistos.add(item.tipo);
      if (item.tipo === 'cuadrados') assert.ok(plano(html).includes(`${item.r} , −${item.r}`.replace(' ,', ',')) || plano(html).includes(`${item.r}, −${item.r}`));
      else if (item.tipo === 'raiz') assert.ok(plano(html).includes(`= ${item.r}`));
      else assert.ok(plano(html).includes(X.TX.ej4.no_existe[idioma]));
      assert.ok(limpio(html));
    }
  }
  assert.equal(vistos.size, 3);
});
