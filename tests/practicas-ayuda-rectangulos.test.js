// «No lo sé» en `rectangulos` (tarea 183): la explicación lleva la solución que el ejercicio da por buena,
// calculada con su `logica.js`. 1000+ ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import { declaracionDe } from '../practicas/_comun/base.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import * as L from '../practicas/rectangulos/logica.js';
import * as X from '../practicas/rectangulos/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<\/(li|p)>/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const generar = (fn, semilla, total = 1200) => { const rng = crearRng(semilla); return Array.from({ length: total }, () => fn(rng)); };

test('rectangulos · ejercicio 1: la respuesta son todas las parejas, y no sobra ninguna', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarRectangulos, 1)) {
      const html = plano(X.explicaRectangulos(item, ctx(idioma)));
      const fin = html.split(idioma === 'es' ? 'La respuesta son ' : 'The answer is ')[1];
      assert.ok(fin, html);
      const dichas = fin.replace(/^\d+ \w+: /, '').replace(/\.$/, '').split(', ');
      const esperadas = [];
      for (let w = 1; w * w <= item.n; w++) if (item.n % w === 0) esperadas.push(`${w} · ${item.n / w}`);
      assert.deepEqual(dichas, esperadas, html);
      assert.deepEqual(L.todasLasClaves(item.n), esperadas.map(c => c.replace(' · ', 'x')));
      const r = L.raizEntera(item.n);
      assert.ok(html.includes(`${r} · ${r} = ${r * r}`), html);
    }
  }
});

test('rectangulos · ejercicio 2: la respuesta son exactamente los divisores, y están en el banco', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarBanco, 2)) {
      const html = plano(X.explicaBanco(item, ctx(idioma)));
      const y = idioma === 'es' ? ' y ' : ' and ';
      const m = html.match(/(?:La respuesta es|The answer is): (.*?)\.(?: Consejo| Tip|$)/);
      assert.ok(m, html);
      const dichos = m[1].split(y).flatMap((t, i, a) => (i < a.length - 1 ? t.split(', ') : [t])).map(Number);
      const reales = item.banco.filter(x => item.n % x === 0).sort((a, b) => a - b);
      assert.deepEqual(dichos, reales, html);
    }
  }
});

test('rectangulos · ejercicio 3: la respuesta es la solución del ítem', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarParte3, 3)) {
      const html = plano(X.explicaParar(item, ctx(idioma)));
      const dicho = html.match(/(?:La respuesta es|The answer is) (\d+)\.$/)?.[1];
      assert.equal(Number(dicho), item.solucion, html);
      assert.ok(item.opciones.includes(item.solucion));
      if (item.tipo === 'parar') assert.equal(item.solucion, L.raizEntera(item.n));
      else assert.equal(item.solucion, 1);
    }
  }
});

test('rectangulos: «No lo sé» declarado en los tres ejercicios', async () => {
  const practica = await declaracionDe(CATALOGO.find(f => f.slug === 'rectangulos'));
  assert.equal(practica.ejercicios.length, 3);
  practica.ejercicios.forEach(d => assert.equal(typeof d.explicacion, 'function'));
});
