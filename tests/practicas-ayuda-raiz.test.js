// «No lo sé» en `raiz` (tarea 187): la explicación lleva la solución que el ejercicio da por buena,
// calculada con la lógica de la práctica. 1000+ ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/raiz/logica.js';
import * as X from '../practicas/raiz/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<sup>(\d)<\/sup>/g, '^$1').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/ ([.,:])/g, '$1').trim();
const N = 1000;
const sano = html => assert.doesNotMatch(html, /undefined|NaN|\[object|null/, plano(html));

test('ej. 1: la explicación da el lado y el resto que calcula la lógica', () => {
  const rng = crearRng(501);
  for (let n = 0; n < N; n++) {
    const item = L.generarForma(rng);
    const { raiz, resto } = L.cuadradoMasGrande(item.n);
    assert.deepEqual([raiz, resto], [item.raiz, item.resto]);
    for (const idioma of IDIOMAS) {
      const html = X.explicaForma(item, ctx(idioma));
      sano(html);
      const fin = idioma === 'es'
        ? (resto === 0 ? `lado ${raiz} y no sobra ninguna.` : `lado ${raiz} y sobran ${resto}.`)
        : (resto === 0 ? `side ${raiz} and none left over.` : `side ${raiz} and ${resto} left over.`);
      assert.ok(plano(html).endsWith(fin), plano(html));
    }
  }
});

test('ej. 2: la explicación de cada subtipo lleva su solución', () => {
  const rng = crearRng(502);
  const vistos = new Set();
  for (let n = 0; n < N; n++) {
    const item = L.generarSinDibujo(rng);
    vistos.add(item.tipo);
    for (const idioma of IDIOMAS) {
      const c = ctx(idioma);
      const texto = plano(X.explicaSinDibujo(item, c));
      sano(texto);
      if (item.tipo === 'puede') {
        assert.equal(item.puede, L.esPosible(item.raiz, item.resto));
        assert.ok(texto.endsWith(`${item.puede ? c.t.si : c.t.no}.`), texto);
      } else if (item.tipo === 'exacta') {
        assert.equal(L.cuadradoMasGrande(item.n).resto, 0);
        assert.ok(texto.endsWith(`${item.raiz}.`), texto);
      } else {
        const { raiz, resto } = L.cuadradoMasGrande(item.n);
        assert.ok(texto.endsWith(`${raiz}, ${idioma === 'es' ? 'resto' : 'remainder'} ${resto}.`), texto);
      }
    }
  }
  assert.deepEqual([...vistos].sort(), ['entera', 'exacta', 'puede']);
});

test('ej. 3: la explicación lleva la frase de respuesta con el lado y lo que sobra', () => {
  const rng = crearRng(503);
  for (let n = 0; n < N; n++) {
    const item = L.generarProblema(rng);
    const { raiz, resto } = L.cuadradoMasGrande(item.n);
    for (const idioma of IDIOMAS) {
      const texto = plano(X.explicaProblema(item, ctx(idioma)));
      sano(texto);
      const fin = idioma === 'es'
        ? (item.dosCampos ? `Respuesta: lado ${raiz} y sobran ${resto}.` : `Respuesta: ${raiz} en cada lado.`)
        : (item.dosCampos ? `Answer: side ${raiz}, and ${resto} left over.` : `Answer: ${raiz} on each side.`);
      assert.ok(texto.endsWith(fin), texto);
    }
  }
});
