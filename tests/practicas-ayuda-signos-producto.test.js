// «No lo sé» en `signos-producto` (tarea 179): la explicación de cada ejercicio lleva la solución
// del ítem, calculada con la lógica de la práctica y no copiada de la explicación. Por fuerza
// bruta: 1000+ ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { fmt } from '../practicas/_comun/enteros.js';
import * as L from '../practicas/signos-producto/logica.js';
import * as X from '../practicas/signos-producto/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

const generar = (fn, semilla, n = 1200) => {
  const rng = crearRng(semilla);
  return Array.from({ length: n }, (_, i) => fn(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] }));
};

test('signos-producto · ejercicio 1: la explicación lleva el producto', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarMultiplica, 301)) {
      const html = X.explicaMultiplica(item, ctx(idioma));
      assert.equal(item.a * item.b, item.valor);
      assert.equal(L.errorDeValorProducto(item, item.valor), 'otro-error', 'el valor bueno no es un error');
      assert.ok(html.includes(`${item.texto} = ${fmt(item.valor)}`), 'la cuenta y su resultado');
      const iguales = (item.a < 0) === (item.b < 0);
      assert.equal(/same|iguales/.test(plano(html)), iguales, 'iguales o distintos');
      assert.equal(/different|distintos/.test(plano(html)), !iguales);
    }
  }
});

test('signos-producto · ejercicio 2: la explicación lleva el cociente, el 0 o «no se puede»', () => {
  const vistos = new Set();
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarDivide, 302)) {
      const html = X.explicaDivide(item, ctx(idioma));
      vistos.add(item.especial ?? 'normal');
      if (item.especial === 'entre-cero') {
        assert.equal(item.valor, null);
        assert.ok(plano(html).includes(X.TX.no_se_puede[idioma]), 'la respuesta es «no se puede»');
      } else if (item.especial === 'cero-entre') {
        assert.ok(0 / item.b === 0);
        assert.ok(html.includes(`${item.texto} = 0`));
      } else {
        assert.equal(item.a / item.b, item.valor);
        assert.ok(html.includes(`${item.texto} = ${fmt(item.valor)}`), 'la cuenta y su resultado');
      }
    }
  }
  assert.equal(vistos.size, 3, 'salen los tres casos');
});

test('signos-producto · ejercicio 3: la explicación lleva el factor que falta', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarFalta, 303)) {
      const html = X.explicaFalta(item, ctx(idioma));
      assert.equal(item.k * item.valor, item.p, 'es el factor que da por bueno el ejercicio');
      assert.ok(html.includes(`${fmt(item.p)} : ${item.k < 0 ? `(${fmt(item.k)})` : item.k} = ${fmt(item.valor)}`), 'la división');
      assert.ok(html.includes(` = ${fmt(item.p)}`), 'la comprobación');
    }
  }
});

test('signos-producto · ejercicio 4: la explicación lleva qué es la cuenta y su valor', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarSumaOProducto, 304)) {
      const html = X.explicaMezcla(item, ctx(idioma));
      const valor = item.producto ? item.a * item.b : (item.clase === 'suma' ? item.a + item.b : item.a - item.b);
      assert.equal(valor, item.valor);
      assert.ok(html.includes(`${item.texto} = ${fmt(valor)}`), 'la cuenta y su resultado');
      assert.equal(item.texto.includes('·'), item.producto, 'el punto solo si es un producto');
      assert.equal(/regla de los signos|rule of signs/.test(html), true);
      assert.equal(/no hay punto|no dot/i.test(plano(html)), !item.producto, 'dice qué es');
    }
  }
});

test('signos-producto · ejercicio 5: la explicación lleva el producto bien escrito', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarBienEscrito, 305)) {
      const html = X.explicaBien(item, ctx(idioma));
      const buenas = item.opciones.filter(o => o.bien);
      assert.equal(buenas.length, 1);
      assert.equal(buenas[0].texto, item.buena);
      assert.ok(html.includes(item.buena));
      for (const o of item.opciones.filter(o => !o.bien)) assert.ok(!html.includes(o.texto), 'no cita las malas');
    }
  }
});

test('signos-producto · las explicaciones no usan × ni dejan restos', () => {
  const pares = [[X.explicaMultiplica, L.generarMultiplica], [X.explicaDivide, L.generarDivide], [X.explicaFalta, L.generarFalta], [X.explicaMezcla, L.generarSumaOProducto], [X.explicaBien, L.generarBienEscrito]];
  for (const idioma of IDIOMAS) {
    for (const [fn, gen] of pares) {
      for (const item of generar(gen, 306, 200)) {
        assert.ok(!/undefined|NaN|\[object|×|null/.test(fn(item, ctx(idioma))));
      }
    }
  }
});
