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
      // Revisión 193: qué se pide, el m.c.d. con el método de los apuntes (listas con números pequeños,
      // factorización con los grandes), con su unidad, y la frase de respuesta sin dos puntos tras «es».
      assert.match(texto, new RegExp(`(La respuesta es|The answer is) ${g} dm: `), donde);
      assert.match(texto, /^(Se pide|You need)/, donde);
      assert.ok(texto.includes(`(${item.a}, ${item.b}) = `) && texto.includes(`${g} dm.`), donde);
      if (Math.max(item.a, item.b) <= 50) assert.ok(texto.includes(`${item.a}:`) && texto.includes(`${item.b}:`), `listas — ${donde}`);
      else assert.ok(new RegExp(`\\b${item.a} = [0-9 ·]+`).test(texto) && new RegExp(`\\b${item.b} = [0-9 ·]+`).test(texto), `factorización — ${donde}`);
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
      assert.match(texto, new RegExp(`(La respuesta es|The answer is) ${n} (baldosas|tiles): `), donde);
      assert.ok(texto.includes(`${item.a / g} · ${item.b / g} = ${n} ${idioma === 'es' ? 'baldosas' : 'tiles'}`), donde);
      assert.ok(texto.includes(`${item.a} : ${g} = ${item.a / g}`) && texto.includes(`${item.b} : ${g} = ${item.b / g}`), donde);
      assert.match(texto, /^(Se pide|You need)/, donde);
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
      assert.ok(texto.includes(idioma === 'es' ? `La respuesta es ${g} dm cada trozo y ${total} trozos en total.` : `The answer is ${g} dm for each piece and ${total} pieces in total.`), donde);
      for (const l of item.longitudes) assert.ok(texto.includes(`${l} : ${g} = ${l / g}`), donde);
      // Revisión 193: el m.c.d. no se da sin más: se descompone cada cuerda (factorización, como en los apuntes).
      for (const l of item.longitudes) assert.ok(new RegExp(`\\b${l} = [0-9 ·]+`).test(texto), `factorización de ${l} — ${donde}`);
      assert.ok(texto.includes(`(${item.longitudes.join(', ')}) = `) && texto.includes(`${g} dm.`), donde);
      assert.ok(texto.includes(`${item.longitudes.map(l => l / g).join(' + ')} = ${total}`), donde);
    }
  }
});
