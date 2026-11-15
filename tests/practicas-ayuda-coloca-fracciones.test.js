// «No lo sé» en coloca-fracciones: la explicación lleva los resultados del ítem (o, en la diana, el objetivo y
// una colocación que lo da), calculados aquí con el motor y escritos con raya, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { htmlFraccion } from '../practicas/_comun/fracciones.js';
import { generar, M } from '../practicas/coloca-fracciones/logica.js';
import { EXPLICACIONES } from '../practicas/coloca-fracciones/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const N = 1000;
const FIN = { es: 'La respuesta es', en: 'The answer is' };
const lista = ej => { const rng = crearRng(31 * ej); let ant = null; return Array.from({ length: N }, () => (ant = generar(ej, rng, { anterior: ant }))); };
const sinFallos = (html, que) => assert.doesNotMatch(plano(html), /undefined|NaN|\[object|null|×|\d\/\d/, `${que}: ${plano(html)}`);

for (const ej of [1, 2]) {
  test(`ej. ${ej}: la explicación acaba con todos los resultados del ítem, con raya, y cada agrupación termina en uno`, () => {
    for (const it of lista(ej)) {
      for (const idioma of IDIOMAS) {
        const html = EXPLICACIONES[ej - 1](it, ctx(idioma));
        sinFallos(html, `ej${ej} ${idioma}`);
        const final = html.slice(html.lastIndexOf(FIN[idioma]));
        assert.ok(html.includes(FIN[idioma]), `${idioma}: sin frase final`);
        for (const v of it.resultados) assert.ok(final.includes(M.htmlValor(v)), `falta ${M.clave(v)} en la frase final: ${plano(final)}`);
        const lineas = [...html.matchAll(/<li><span class="cuenta">(.*?)<\/span><\/li>/g)].map(x => x[1]);
        assert.ok(lineas.length >= it.resultados.length, 'una línea por resultado como mínimo');
        for (const v of it.resultados) assert.ok(lineas.some(l => l.endsWith(M.htmlValor(v))), `ninguna línea termina en ${M.clave(v)}`);
      }
    }
  });
}

test('ej. 3: la explicación dice el objetivo y una colocación que lo da, con su resolución', () => {
  for (const it of lista(3)) {
    for (const idioma of IDIOMAS) {
      const html = EXPLICACIONES[2](it, ctx(idioma));
      sinFallos(html, `ej3 ${idioma}`);
      assert.ok(html.includes(M.htmlValor(it.objetivo)), 'lleva el objetivo');
      const resolucion = html.match(/<p><span class="cuenta">(.*?)<\/span><\/p>/);
      assert.ok(resolucion, plano(html));
      assert.ok(resolucion[1].endsWith(M.htmlValor(it.objetivo)), plano(resolucion[1]));
      assert.ok(it.resultados.some(v => M.mismoValor(v, it.objetivo)));
    }
  }
  assert.ok(htmlFraccion);
});
