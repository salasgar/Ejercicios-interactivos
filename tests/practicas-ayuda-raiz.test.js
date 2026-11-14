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
      // sin dos puntos entre «es» y la respuesta, y «sobra 1» en singular
      const sobran = resto === 1 ? 'sobra' : 'sobran';
      const fin = idioma === 'es'
        ? (resto === 0 ? `La respuesta es lado ${raiz} y no sobra ninguna.` : `La respuesta es lado ${raiz} y ${sobran} ${resto}.`)
        : (resto === 0 ? `The answer is side ${raiz} and none left over.` : `The answer is side ${raiz} and ${resto} left over.`);
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
      assert.doesNotMatch(texto, /\b(es|is):/, texto);
      if (item.tipo === 'puede') {
        assert.equal(item.puede, L.esPosible(item.raiz, item.resto));
        const boton = item.puede ? c.t.si : c.t.no;
        assert.ok(texto.endsWith(idioma === 'es' ? `La respuesta es «${boton}».` : `The answer is “${boton}”.`), texto);
        // no empieza repitiendo la pregunta del enunciado
        assert.ok(!texto.includes(plano(c.tt(X.TX.sin.puede_pregunta)(item.raiz, item.resto))), texto);
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
      // la frase de respuesta habla con las palabras del enunciado (baldosas, filas, cromos…)
      const enunciado = plano(ctx(idioma).tt(X.TX.prob[item.plantilla][item.variante])(item.n));
      const frase = texto.slice(texto.lastIndexOf(idioma === 'es' ? 'Respuesta: ' : 'Answer: '));
      const cosa = { es: ['baldosas', 'azulejos', 'sillas', 'fichas', 'cromos'], en: ['tiles', 'chairs', 'counters', 'stickers'] }[idioma]
        .find(p => enunciado.includes(p));
      assert.ok(cosa && frase.includes(` ${raiz} ${item.plantilla === 'sillas' && item.variante === 1 ? (idioma === 'es' ? 'filas' : 'rows') : cosa}`), frase);
      if (item.dosCampos) {
        const una = cosa.replace(/s$/, '');
        const r = idioma === 'es'
          ? `${resto === 1 ? 'sobra' : 'sobran'} ${resto} ${resto === 1 ? una : cosa}.`
          : `${resto} ${resto === 1 ? una : cosa} ${resto === 1 ? 'is' : 'are'} left over.`;
        assert.ok(frase.endsWith(r), frase);
      } else {
        assert.equal(resto, 0);
        assert.ok(frase.endsWith(idioma === 'es' ? 'en cada lado.' : 'on each side.'), frase);
      }
    }
  }
});
