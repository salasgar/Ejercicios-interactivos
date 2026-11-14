// «No lo sé» en `recta` (tarea 183): la explicación lleva la solución que el ejercicio da por buena,
// calculada con su `logica.js`. 1000+ ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import { declaracionDe } from '../practicas/_comun/base.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import * as L from '../practicas/recta/logica.js';
import * as X from '../practicas/recta/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<\/(li|p)>/g, ' ').replace(/<br>/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const generar = (fn, semilla, total = 1200) => { const rng = crearRng(semilla); return Array.from({ length: total }, () => fn(rng)); };
const RESP = /(?:La respuesta(?:, hasta el \d+,)? es|The answer(?:, up to \d+,)? is): (.*)\.$/;

test('recta · ejercicio 1: la respuesta son los múltiplos del 0 al 60, con el 0', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarMultiplos, 1)) {
      const html = plano(X.explicaMultiplos(item, ctx(idioma)));
      const dichos = html.match(RESP)?.[1].split(', ').map(Number);
      const reales = [];
      for (let v = 0; v <= 60; v += item.n) reales.push(v);
      assert.deepEqual(dichos, reales, html);
      assert.deepEqual([...item.correctos].sort((a, b) => a - b), reales);
      assert.ok(html.includes(`0 = ${item.n} · 0`), html);
    }
  }
});

test('recta · ejercicio 2: la respuesta son los divisores (sin el 0), con sus parejas', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarDivisores, 2)) {
      const html = plano(X.explicaDivisores(item, ctx(idioma)));
      const dichos = html.match(RESP)?.[1].split(', ').map(Number);
      const reales = [];
      for (let d = 1; d <= item.n; d++) if (item.n % d === 0) reales.push(d);
      assert.deepEqual(dichos, reales, html);
      assert.deepEqual([...item.correctos].sort((a, b) => a - b), reales);
      for (const d of reales) assert.ok(html.includes(`${Math.min(d, item.n / d)} · ${Math.max(d, item.n / d)} = ${item.n}`), html);
      assert.ok(item.hasta >= 3 * item.n, 'la recta enseña 2n y 3n');
    }
  }
});

test('recta · ejercicio 3: la respuesta es Verdadero/Falso según el ítem, y la cuenta lo justifica', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarVF, 3)) {
      const html = plano(X.explicaVF(item, ctx(idioma)));
      const dicho = html.match(/(?:La respuesta es «|The answer is “)([^»”]+)[»”]\.$/)?.[1];
      assert.equal(dicho, item.verdad ? T[idioma].verdadero : T[idioma].falso, html);
      if (item.a !== undefined) {
        const { plantilla, a, b } = item;
        const esVerdad = plantilla === 'divisor' ? b % a === 0 : a % b === 0;
        assert.equal(esVerdad, item.verdad);
        assert.ok(html.includes(String(a)) && html.includes(String(b)), html);
      }
    }
  }
});

test('recta: «No lo sé» declarado en los tres ejercicios', async () => {
  const practica = await declaracionDe(CATALOGO.find(f => f.slug === 'recta'));
  assert.equal(practica.ejercicios.length, 3);
  practica.ejercicios.forEach(d => assert.equal(typeof d.explicacion, 'function'));
});
