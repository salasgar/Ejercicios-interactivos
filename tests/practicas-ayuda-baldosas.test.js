// «No lo sé» en baldosas: cada explicación lleva la solución del ítem, calculada aquí por fuerza bruta.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { generarBaldosa, generarCuantas, generarCuerdas, explicaBaldosa, explicaCuantas, explicaCuerdas } from '../practicas/baldosas/logica.js';

const IDIOMAS = ['es', 'en'];
const N = 1000;
const plano = html => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
const mcdBruto = lista => { for (let d = Math.min(...lista); d >= 1; d--) if (lista.every(x => x % d === 0)) return d; };
const sinRestos = (html, donde) => assert.ok(!/undefined|NaN|\[object|null|×/.test(html), donde);

test('baldosas, ejercicio 1: la explicación lista los divisores y da el m.c.d. como lado', () => {
  const rng = crearRng(71);
  for (let i = 0; i < N; i++) {
    const item = generarBaldosa(rng);
    const g = mcdBruto([item.a, item.b]);
    for (const idioma of IDIOMAS) {
      const html = explicaBaldosa(item, idioma);
      const texto = plano(html);
      const donde = `${idioma}: ${texto}`;
      sinRestos(html, donde);
      assert.match(texto, new RegExp(`(La respuesta es|The answer is): (lado|side) ${g} dm\\.`), donde);
      assert.ok(texto.includes(`${item.a}:`) && texto.includes(`${item.b}:`), donde);
      assert.ok(texto.includes(`${g}.`), donde);
    }
  }
});

test('baldosas, ejercicio 2: la explicación da (a:g)·(b:g) baldosas', () => {
  const rng = crearRng(72);
  for (let i = 0; i < N; i++) {
    const item = generarCuantas(rng);
    const g = mcdBruto([item.a, item.b]);
    const n = (item.a / g) * (item.b / g);
    for (const idioma of IDIOMAS) {
      const html = explicaCuantas(item, idioma);
      const texto = plano(html);
      const donde = `${idioma}: ${texto}`;
      sinRestos(html, donde);
      assert.match(texto, new RegExp(`(La respuesta es|The answer is): ${n} (baldosas|tiles)\\.`), donde);
      assert.ok(texto.includes(`${item.a / g} · ${item.b / g} = ${n}`), donde);
    }
  }
});

test('baldosas, ejercicio 3: la explicación da el trozo (m.c.d.) y la suma de trozos', () => {
  const rng = crearRng(73);
  for (let i = 0; i < N; i++) {
    const item = generarCuerdas(rng);
    const g = mcdBruto(item.longitudes);
    const total = item.longitudes.reduce((s, l) => s + l / g, 0);
    for (const idioma of IDIOMAS) {
      const html = explicaCuerdas(item, idioma);
      const texto = plano(html);
      const donde = `${idioma}: ${texto}`;
      sinRestos(html, donde);
      assert.match(texto, new RegExp(`(La respuesta es|The answer is): (trozos de|pieces of) ${g} dm, ${total} (trozos|pieces) (en total|in total)\\.`), donde);
      for (const l of item.longitudes) assert.ok(texto.includes(`${l} : ${g} = ${l / g}`), donde);
    }
  }
});
