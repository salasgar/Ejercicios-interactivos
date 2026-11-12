// «No lo sé» en `divisiones` (tarea 184): la explicación lleva la solución que el ejercicio da por buena,
// calculada con la lógica de la práctica. 1000+ ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import { factorizar, valorDe } from '../practicas/_comun/aritmetica.js';
import * as L from '../practicas/divisiones/logica.js';
import * as X from '../practicas/divisiones/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<\/li>/g, ' ').replace(/<sup>/g, '^').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
const generar = (fn, semilla, n = 1200) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };
const RESP = /(?:La respuesta es|The answer is) (.*)\.$/;

test('divisiones · ejercicio 1: cada paso divide entre el menor primo y la respuesta es la lista de primos', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarEscalera, 1)) {
      const html = plano(X.explicaEscalera(item, ctx(idioma)));
      const dicho = html.match(RESP)?.[1];
      assert.equal(dicho, `${item.n} = ${item.pasos.map(([, p]) => p).join(' · ')}`, html);
      for (const [m, p] of item.pasos) {
        assert.equal(L.pasoCorrecto(m), p);
        assert.ok(html.includes(`${m} ${idioma === 'es' ? ':' : '÷'} ${p} = ${m / p}`), html);
      }
      assert.equal(item.pasos.reduce((a, [, p]) => a * p, 1), item.n);
    }
  }
});

test('divisiones · ejercicio 2: cuenta las veces de cada primo y la respuesta es la forma de potencias', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarPotencias, 2)) {
      const html = plano(X.explicaPotencias(item, ctx(idioma)));
      const dicho = html.match(RESP)?.[1];
      const esperado = item.factorizacion.map(([p, e]) => (e === 1 ? `${p}` : `${p}^${e}`)).join(' · ');
      assert.equal(dicho, `${item.n} = ${esperado}`, html);
      assert.equal(valorDe(item.factorizacion), item.n);
      for (const [p, e] of item.factorizacion) {
        assert.equal(item.lista.filter(x => x === p).length, e);
        assert.ok(html.includes(idioma === 'es' ? `el ${p} aparece ${e} ` : `${p} appears ${e} `), html);
      }
    }
  }
});

test('divisiones · ejercicio 3: la respuesta es el valor (o Sí/No) que el ejercicio da por bueno', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarEjercicio3, 3)) {
      const html = plano(X.explicaComprobar(item, ctx(idioma)));
      const dicho = html.match(RESP)?.[1];
      const valor = valorDe(item.factorizacion);
      if (item.tipo === 'valor') {
        assert.equal(dicho, String(valor), html);
        assert.equal(item.solucion, valor);
      } else {
        assert.equal(dicho, (item.valorMostrado === valor) === item.igualdadCorrecta ? (item.igualdadCorrecta ? (idioma === 'es' ? 'Sí' : 'Yes') : 'No') : 'imposible', html);
        assert.equal(item.igualdadCorrecta, item.valorMostrado === valor);
      }
      assert.equal(factorizar(valor).length > 0, true);
    }
  }
});
