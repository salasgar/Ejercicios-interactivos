// «No lo sé» en coloca-decimales: la explicación lleva los resultados del ítem (o, en la diana, el objetivo y
// una colocación que lo da), calculados aquí con el motor y escritos en su idioma (coma en español, punto en inglés).

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { aDecimal, aTexto } from '../practicas/_comun/decimales.js';
import { generar, M } from '../practicas/coloca-decimales/logica.js';
import { EXPLICACIONES } from '../practicas/coloca-decimales/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<sup>(.*?)<\/sup>/g, '^$1').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const N = 1000;
const FIN = { es: 'La respuesta es', en: 'The answer is' };
const Y = { es: ' y ', en: ' and ' };
const txt = (v, idioma) => aTexto(aDecimal(v).normalizar(), idioma);
const cuentas = (html, idioma, que) => {
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, `${que}: ${plano(html)}`);
  const m = html.match(new RegExp(`${FIN[idioma]} (.*)\\.</p>$`));
  assert.ok(m, `${que}: no acaba con la respuesta — ${plano(html)}`);
  return [...m[1].matchAll(/<span class="cuenta">(.*?)<\/span>/g)].map(x => plano(x[1]));
};
const lista = ej => { const rng = crearRng(31 * ej); let ant = null; return Array.from({ length: N }, () => (ant = generar(ej, rng, { anterior: ant }))); };

for (const ej of [1, 2]) {
  test(`ej. ${ej}: la explicación acaba con todos los resultados del ítem, en orden y en su idioma, y cada agrupación termina en uno`, () => {
    for (const it of lista(ej)) {
      const buenos = it.resultados.map(v => v);
      for (const idioma of IDIOMAS) {
        const html = EXPLICACIONES[ej - 1](it, ctx(idioma));
        assert.deepEqual(cuentas(html, idioma, `ej${ej} ${idioma}`), buenos.map(v => txt(v, idioma)));
        const lineas = [...html.matchAll(/<li><span class="cuenta">(.*?)<\/span><\/li>/g)].map(x => plano(x[1]));
        assert.ok(lineas.length >= buenos.length, 'una línea por resultado como mínimo');
        const finales = new Set(lineas.map(l => l.split(' = ').pop()));
        for (const v of buenos) assert.ok(finales.has(txt(v, idioma)), `${txt(v, idioma)} en ${[...finales]}`);
        if (idioma === 'es') assert.ok(!/\d\.\d/.test(plano(html)), plano(html));
        else assert.ok(!/\d,\d/.test(plano(html)), plano(html));
      }
    }
  });
}

test('ej. 3: la explicación dice el objetivo y una colocación que lo da, con su resolución', () => {
  for (const it of lista(3)) {
    for (const idioma of IDIOMAS) {
      const html = EXPLICACIONES[2](it, ctx(idioma));
      const objetivo = txt(it.objetivo, idioma);
      assert.ok(plano(html).includes(`${idioma === 'es' ? 'hasta que salga' : 'until you get'} ${objetivo}`), plano(html));
      const [colocacion] = cuentas(html, idioma, `ej3 ${idioma}`);
      const resolucion = plano(html.match(/<p><span class="cuenta">(.*?)<\/span><\/p>/)[1]);
      assert.ok(resolucion.startsWith(`${colocacion} = `), resolucion);
      assert.equal(resolucion.split(' = ').pop(), objetivo, resolucion);
      assert.ok(it.resultados.some(v => M.mismoValor(v, it.objetivo)));
    }
  }
});
