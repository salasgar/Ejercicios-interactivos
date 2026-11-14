// «No lo sé» en `fabrica` (tarea 184): la explicación lleva la solución que el ejercicio da por buena,
// calculada con la lógica de la práctica. 1000+ ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import { declaracionDe } from '../practicas/_comun/base.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import * as L from '../practicas/fabrica/logica.js';
import * as X from '../practicas/fabrica/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<\/li>/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
const generar = (fn, semilla, n = 1200) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };
const RESP = /(?:La respuesta es|The answer is) (.*)\.$/;

test('fabrica · ejercicio 1: la respuesta es el número de divisores', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarContar, 1)) {
      const html = plano(X.explicaContar(item, ctx(idioma)));
      assert.equal(html.match(RESP)?.[1], String(item.solucion), html);
      // Revisión 193: la respuesta una sola vez (sin «132 tiene 12 divisores» delante).
      assert.doesNotMatch(html, /tiene \d+ divisores|has \d+ divisors/, html);
      assert.equal(L.divisores(item.n).length, item.solucion);
      for (const [, e] of item.fact) assert.ok(html.includes(`${e} + 1 = ${e + 1}`), html);
    }
  }
});

test('fabrica · ejercicio 2: la respuesta es Sí/No según los exponentes y coincide con la división', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarDivisible, 2)) {
      const html = plano(X.explicaDivisible(item, ctx(idioma)));
      // Revisión 193: el texto del botón, entre comillas.
      const boton = item.divisible ? (idioma === 'es' ? 'Sí' : 'Yes') : 'No';
      assert.equal(html.match(RESP)?.[1], idioma === 'es' ? `«${boton}»` : `“${boton}”`, html);
      assert.equal(item.n % item.d === 0, item.divisible);
      // Revisión 193: nada de «5 = 5» cuando el divisor es primo.
      assert.doesNotMatch(html, new RegExp(`(^|[^\\d])${item.d} = ${item.d}\\.`), html);
      // Relevo de la revisión 193: «Todos valen» / «Alguno no vale» solo si el divisor tiene más de un primo.
      const varios = /Todos valen|Alguno no vale|All of them are enough|Not all of them are enough/.test(html);
      assert.equal(varios, item.factD.length > 1, html);
    }
  }
});

test('fabrica · revisión 193: «Sin dividir» es un sí/no de leer la factorización, sin «No sé hacerlo»', async () => {
  const practica = await declaracionDe(CATALOGO.find(f => f.slug === 'fabrica'));
  const [contar, divisible] = practica.ejercicios;
  assert.ok(contar.noLoSe, 'contar es un procedimiento: lleva «No sé hacerlo»');
  assert.equal(divisible.noLoSe, undefined);
  assert.equal(typeof divisible.explicacion, 'function');
});
