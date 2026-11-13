// «No lo sé» en `dictado` (tarea 189): la explicación lleva la solución del ítem, calculada con la lógica.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/dictado/logica.js';
import * as X from '../practicas/dictado/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const A = n => L.agrupar(n).replace(/\s/g, ' ');
const generar = (fn, semilla, n = 1500) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };
const RESP = { es: 'La respuesta es', en: 'The answer is' };

test('dictado · ejercicio 1: la explicación lleva el número que da por bueno el ejercicio', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarDictado, 1)) {
    const t = plano(X.explicaDictado(item, ctx(idioma)));
    assert.ok(L.esRespuestaDictado(item, String(item.n)));
    assert.ok(t.includes(`${RESP[idioma]} ${A(item.n)}.`), t);
    assert.ok(t.includes(item.texto), t);
    assert.ok(!/undefined|NaN/.test(t), t);
  }
});

test('dictado · ejercicio 2: -teen/-ty y escritura llevan su solución', () => {
  const vistos = {};
  for (const idioma of IDIOMAS) for (const item of generar(rng => (rng.azar() < 0.5 ? L.generarTeen(rng) : L.generarEscritura(rng)), 2, 2400)) {
    vistos[item.tipo] = (vistos[item.tipo] ?? 0) + 1;
    const t = plano(X.explicaTeenOEscritura(item, ctx(idioma)));
    assert.ok(!/undefined|NaN/.test(t), t);
    if (item.tipo === 'teen') {
      assert.equal(item.opciones[item.solucion], item.n);
      assert.ok(t.includes(`${RESP[idioma]} ${A(item.n)}.`), t);
    } else {
      const buena = item.opciones[item.solucion];
      assert.equal(buena, L.enNum(item.n));
      assert.ok(t.includes(`${RESP[idioma]} ${buena}.`), t);
    }
  }
  assert.deepEqual(Object.keys(vistos).sort(), ['escritura', 'teen']);
});

test('dictado · ejercicio 3: las fichas llevan el texto del número y el dictado en español, la cifra', () => {
  const vistos = {};
  for (const idioma of IDIOMAS) for (const item of generar(rng => (rng.azar() < 0.6 ? L.generarFichas(rng) : L.generarDictadoEs(rng)), 3, 2400)) {
    vistos[item.tipo] = (vistos[item.tipo] ?? 0) + 1;
    const t = plano(X.explicaFichasODictadoEs(item, ctx(idioma)));
    assert.ok(!/undefined|NaN/.test(t), t);
    assert.equal(item.texto, L.esNum(item.n));
    if (item.tipo === 'fichas') {
      assert.ok(L.esSecuenciaCorrecta(item, item.texto.split(' ')));
      assert.ok(t.includes(`${RESP[idioma]}: ${item.texto}.`), t);
    } else {
      assert.ok(t.includes(`${RESP[idioma]} ${A(item.n)}.`), t);
    }
  }
  assert.deepEqual(Object.keys(vistos).sort(), ['dictado_es', 'fichas']);
});
