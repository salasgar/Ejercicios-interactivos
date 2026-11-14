// «No lo sé» en `arbol` (tarea 184): la explicación lleva la solución que el ejercicio da por buena,
// calculada con la lógica de la práctica. 1000+ ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import { factorizar, htmlFact, esPrimo } from '../practicas/_comun/aritmetica.js';
import * as L from '../practicas/arbol/logica.js';
import * as X from '../practicas/arbol/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
const generar = (fn, semilla, n = 1200) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };

test('arbol · ejercicio 1: la explicación parte hasta los primos y lleva la factorización', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarConstruir, 1)) {
      const html = X.explicaConstruir(item, ctx(idioma));
      const f = `${item.n} = ${htmlFact(factorizar(item.n))}`;
      assert.ok(html.endsWith(`<strong>`) === false);
      assert.ok(plano(html).endsWith(`${plano(f)}.`), `${item.n}: ${plano(html)}`);
      const pasos = [...html.matchAll(/<li>/g)].length;
      assert.equal(pasos, L.numeroDeHojas(item.n) - 1, 'un paso por cada partición');
      for (const [, c, p, r] of plano(html).matchAll(/(\d+) = (\d+) · (\d+):/g)) {
        assert.equal(Number(p) * Number(r), Number(c));
        assert.ok(esPrimo(Number(p)));
      }
    }
  }
});

test('arbol · ejercicio 2: la explicación dice si está terminada y, si no, cuál es el compuesto', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarTerminada, 2)) {
      const html = plano(X.explicaTerminada(item, ctx(idioma)));
      // Revisión 193: la respuesta con el texto de los botones, entre comillas, una sola vez.
      assert.equal((html.match(/respuesta es|answer is/g) || []).length, 1, html);
      if (item.terminada) {
        assert.ok(item.igualdad.every(([b]) => esPrimo(b)));
        assert.ok(html.endsWith(idioma === 'es' ? `La respuesta es «${X.TX.terminada.si.es}».` : `The answer is “${X.TX.terminada.si.en}”.`), html);
      } else {
        assert.ok(!esPrimo(item.compuesto));
        const fin = idioma === 'es'
          ? `La respuesta es «${X.TX.terminada.no.es}», y el factor que no es primo es el ${item.compuesto}.`
          : `The answer is “${X.TX.terminada.no.en}”, and the factor that is not prime is ${item.compuesto}.`;
        assert.ok(html.endsWith(fin), `${item.n}: ${html}`);
        const [p, q] = L.porQueCompuesto(item.compuesto);
        assert.ok(html.includes(`${item.compuesto} = ${p} · ${q}`), 'la cuenta del compuesto');
      }
    }
  }
});

test('arbol · ejercicio 3: la explicación da la cuenta de cada hueco y los números de los huecos', () => {
  const items = generar(L.generarCompletar, 3, 1000);
  for (const idioma of IDIOMAS) {
    for (const item of items) {
      const html = plano(X.explicaCompletar(item, ctx(idioma)).replace(/<\/li>/g, ' '));
      const faltan = L.solucionCompletar(item);
      assert.ok(L.esCorrectaCompletar(item, faltan));
      // Revisión 193: los números de la respuesta son los de los huecos (en el orden en que se deducen).
      const dicho = html.match(idioma === 'es' ? /La respuesta es (.*)\.$/ : /The answer is (.*)\.$/)?.[1] ?? '';
      const numeros = dicho.split(/, | y | and /).map(Number);
      assert.deepEqual([...numeros].sort((a, b) => a - b), [...faltan].sort((a, b) => a - b), html);
      // Un paso por hueco (la pareja de hermanos cuenta por dos) y cada cuenta, verdad.
      const pasos = X.pasosCompletar(item);
      assert.equal(pasos.reduce((s, p) => s + (p.tipo === 'pareja' ? 2 : 1), 0), item.huecos.length);
      assert.equal([...X.explicaCompletar(item, ctx(idioma)).matchAll(/<li>/g)].length, pasos.length);
      for (const [, c, a, b] of html.matchAll(/(\d+) = (\d+) · (\d+)/g)) assert.equal(Number(a) * Number(b), Number(c));
      for (const [, a, b, c] of html.matchAll(/(\d+) · (\d+) = (\d+)/g)) assert.equal(Number(a) * Number(b), Number(c));
      for (const [, a, b, c] of html.matchAll(/(\d+) [:÷] (\d+) = (\d+)/g)) assert.equal(Number(a) / Number(b), Number(c));
      // Cada división parte de una rama con su hueco a la vista.
      for (const [, a, b] of html.matchAll(/(\d+) [:÷] (\d+) = /g)) assert.match(html, new RegExp(`${a} = (□ · ${b}|${b} · □) → ${a} [:÷] ${b}`));
    }
  }
});

test('arbol · ejercicio 1: la regla dice que vale cualquier producto (revisión 193)', () => {
  for (const idioma of IDIOMAS) {
    const html = X.explicaConstruir({ tipo: 'construir', n: 60 }, ctx(idioma));
    assert.match(html, idioma === 'es' ? /vale cualquiera/ : /any product works/);
  }
});
