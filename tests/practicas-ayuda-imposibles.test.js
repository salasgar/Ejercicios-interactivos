// «No lo sé» en imposibles: cada explicación lleva la solución del ítem, calculada aquí por
// fuerza bruta (no con las funciones de la práctica).

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { generarPuede, generarProducto, generarNombrar, explicaPuede, explicaProducto, explicaNombrar } from '../practicas/imposibles/logica.js';

const IDIOMAS = ['es', 'en'];
const N = 1000;
const plano = html => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
const mcdBruto = (a, b) => { for (let d = Math.min(a, b); d >= 1; d--) if (a % d === 0 && b % d === 0) return d; };
const mcmBruto = (a, b) => { for (let m = Math.max(a, b); ; m += Math.max(a, b)) if (m % a === 0 && m % b === 0) return m; };
const sinRestos = (html, donde) => {
  assert.ok(!/undefined|NaN|\[object|null/.test(html), donde);
  assert.ok(!html.includes('×'), donde);
};

test('imposibles, ejercicio 1: la explicación dice sí o no según el ítem, con su regla y sus números', () => {
  const rng = crearRng(41);
  let vistos = { si: 0, no: 0 };
  for (let i = 0; i < N; i++) {
    const item = generarPuede(rng);
    const verdad = item.cantidad === 'mcd' ? mcdBruto(item.a, item.b) : mcmBruto(item.a, item.b);
    const puedeBruto = item.propuesto === verdad
      || (item.cantidad === 'mcd' ? item.propuesto >= 1 && item.propuesto <= Math.min(item.a, item.b) && item.a % item.propuesto === 0 && item.b % item.propuesto === 0
        : item.propuesto >= Math.max(item.a, item.b) && item.propuesto % item.a === 0 && item.propuesto % item.b === 0);
    assert.equal(item.puede, puedeBruto, 'el ítem');
    vistos[item.puede ? 'si' : 'no']++;
    for (const idioma of IDIOMAS) {
      const html = explicaPuede(item, idioma);
      const texto = plano(html);
      const donde = `${idioma}: ${texto}`;
      sinRestos(html, donde);
      assert.match(texto, new RegExp(`(La respuesta es|The answer is): ${item.puede ? (idioma === 'es' ? 'Sí' : 'Yes') : 'No'}\\.`), donde);
      assert.ok(texto.includes(String(item.propuesto)), `lleva el número propuesto — ${donde}`);
    }
  }
  assert.ok(vistos.si > 100 && vistos.no > 100, JSON.stringify(vistos));
});

test('imposibles, ejercicio 2: la explicación lleva el producto y dice si cuadra', () => {
  const rng = crearRng(42);
  let tres = 0;
  for (let i = 0; i < N; i++) {
    const item = generarProducto(rng);
    const cuadraBruto = item.tipo === 'producto' && item.g * item.m === item.a * item.b;
    assert.equal(item.cuadra, cuadraBruto, 'el ítem');
    if (item.tipo === 'tres') tres++;
    for (const idioma of IDIOMAS) {
      const html = explicaProducto(item, idioma);
      const texto = plano(html);
      const donde = `${idioma}: ${texto}`;
      sinRestos(html, donde);
      const nombre = item.cuadra ? { es: 'Cuadra', en: 'It checks out' }[idioma] : { es: 'No cuadra', en: "It doesn't check out" }[idioma];
      assert.ok(texto.includes(`: ${nombre}.`), `respuesta «${nombre}» — ${donde}`);
      assert.ok(texto.includes(`${item.g} · ${item.m} = ${item.g * item.m}`), `lleva g · m — ${donde}`);
      if (item.tipo === 'producto') assert.ok(texto.includes(`${item.a} · ${item.b}`), donde);
      else assert.ok(texto.includes(`${item.a * item.b * item.c}`), donde);
    }
  }
  assert.ok(tres > 100);
});

test('imposibles, ejercicio 3: la explicación nombra el m.c.d. o el m.c.m. de verdad y su valor', () => {
  const rng = crearRng(43);
  for (let i = 0; i < N; i++) {
    const item = generarNombrar(rng);
    const valor = item.cantidad === 'mcd' ? mcdBruto(item.a, item.b) : mcmBruto(item.a, item.b);
    for (const idioma of IDIOMAS) {
      const html = explicaNombrar(item, idioma);
      const texto = plano(html);
      const nombre = item.cantidad === 'mcd' ? { es: 'm.c.d.', en: 'GCD' }[idioma] : { es: 'm.c.m.', en: 'LCM' }[idioma];
      const donde = `${idioma}: ${texto}`;
      sinRestos(html, donde);
      assert.ok(texto.includes(`${nombre}(${item.a}, ${item.b}) = ${valor}`), donde);
      assert.ok(texto.includes(`${nombre}(${item.a}, ${item.b}).`), `la respuesta — ${donde}`);
    }
  }
});
