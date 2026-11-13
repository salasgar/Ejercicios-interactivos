// «No lo sé» en `opuestos` (tarea 178): la explicación de cada ejercicio lleva la solución del ítem,
// calculada con la lógica de la práctica. 1000+ ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { fmt } from '../practicas/_comun/enteros.js';
import * as L from '../practicas/opuestos/logica.js';
import * as X from '../practicas/opuestos/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const generar = (fn, semilla, n = 1200) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };

test('opuestos · ejercicio 1: la explicación lleva el opuesto que el ejercicio da por bueno', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarOpuesto, 1)) {
      const html = plano(X.explicaOpuesto(item, ctx(idioma)));
      const bueno = L.opuestoDe(item);
      assert.notEqual(bueno, item.n);
      assert.ok(html.includes(`${fmt(bueno)}`), 'el opuesto');
      assert.ok(/(respuesta es|answer is)[^.]*\./.test(html) && html.includes(`${fmt(bueno)}`));
      if (item.modo === 'doble') {
        assert.ok(html.includes(`−(${fmt(item.n)}) = ${fmt(bueno)}`));
        // Revisión 192: dice qué significa el − de delante.
        assert.match(html, /quiere decir «el opuesto de»|means “the opposite of”/);
      }
    }
  }
});

test('opuestos · ejercicio 2: la explicación lleva el valor absoluto', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarDistancia, 2)) {
      const html = plano(X.explicaDistancia(item, ctx(idioma)));
      assert.ok(html.includes(`|${fmt(item.n)}| = ${Math.abs(item.n)}`));
      assert.ok(html.endsWith(`${Math.abs(item.n)}.`), 'la respuesta, al final');
      // Revisión 192: se cuentan saltos, como pide el enunciado; sin «El 0 está en el 0: … :» ni «1 saltos».
      assert.doesNotMatch(html, /El 0 está en el 0|0 is at 0|\b1 (saltos|jumps)\b/);
      if (item.n !== 0) assert.ok(html.includes(`${Math.abs(item.n)} salto`) || html.includes(`${Math.abs(item.n)} jump`));
    }
  }
});

test('opuestos · ejercicio 3: la explicación lleva el opuesto y el valor absoluto', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarOpuestoYAbsoluto, 3)) {
      const html = plano(X.explicaDoble(item, ctx(idioma)));
      assert.equal(L.errorHueco(item, 'opuesto', -item.n), null);
      assert.equal(L.errorHueco(item, 'absoluto', Math.abs(item.n)), null);
      assert.ok(html.includes(`${fmt(item.n)} es ${fmt(-item.n)} y su valor absoluto es ${Math.abs(item.n)}.`) || html.includes(`${fmt(item.n)} is ${fmt(-item.n)} and its absolute value is ${Math.abs(item.n)}.`));
      // Revisión 192: la regla no se repite con otras palabras, y la tarjeta no pasa de cinco frases.
      assert.doesNotMatch(html, /el punto del otro lado|the point on the other side/);
      assert.ok(html.split(/\. /).length <= 5, html);
    }
  }
});

test('opuestos · ejercicio 4: la explicación lleva los enteros a marcar o el mayor', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarDistancias, 4)) {
      const html = plano(X.explicaDistancias(item, ctx(idioma)));
      if (item.modo === 'marcar') {
        assert.ok(L.marcarBien(item, L.aMarcar(item)));
        assert.ok(html.endsWith(`${fmt(-item.k)} y ${fmt(item.k)}.`) || html.endsWith(`${fmt(-item.k)} and ${fmt(item.k)}.`));
        // Revisión 192: las dos cuentas, unidas («|−4| = 4 y |4| = 4»), no pegadas una a otra.
        const k = item.k;
        assert.ok(html.includes(`|${fmt(-k)}| = ${k} y |${fmt(k)}| = ${k}`) || html.includes(`|${fmt(-k)}| = ${k} and |${fmt(k)}| = ${k}`));
      } else {
        assert.ok(html.endsWith(`${fmt(L.mayorDe(item))}.`), 'el mayor');
        assert.ok(L.mayorDe(item) < 0);
      }
    }
  }
});
