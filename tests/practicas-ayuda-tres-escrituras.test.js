// «No lo sé» en tres-escrituras: cada explicación acaba con la respuesta del ítem, calculada aquí con
// enteros propios (no con la lógica de la práctica).

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { declaracionDe } from '../practicas/_comun/base.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const N = 1000;
const practica = await declaracionDe(CATALOGO.find(f => f.slug === 'tres-escrituras'));
const [ej1, ej2, ej3, ej4] = practica.ejercicios;
const items = (def, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, (_, i) => def.generar(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] }));
};
const FIN = { es: 'La respuesta es', en: 'The answer is' };
const mcd = (a, b) => (b === 0 ? a : mcd(b, a % b));
const pct = (p, idioma) => (idioma === 'es' ? `${p} %` : `${p}%`);
const dec = (p, idioma) => {
  const t = String(p).padStart(2, '0').replace(/0$/, '');
  return `0${idioma === 'es' ? ',' : '.'}${t}`;
};
const sana = t => assert.doesNotMatch(t, /undefined|NaN|\[object|null|×/, t);
const final = (html, idioma) => {
  const t = html.replace(/<[^>]+>/g, '');
  const i = t.lastIndexOf(FIN[idioma]);
  assert.ok(i >= 0, t);
  return t.slice(i + FIN[idioma].length).replace(/\.\s*$/, '').trim();
};

for (const idioma of IDIOMAS) {
  test(`ayuda tres-escrituras (${idioma}): ejercicio 1, termina con la fracción o el porcentaje`, () => {
    for (const item of items(ej1, 1)) {
      const html = ej1.explicacion(item, ctx(idioma));
      sana(plano(html));
      const g = mcd(item.p, 100);
      const f = final(html, idioma);
      if (item.sentido === 'pf') assert.equal(f.replace(/\s+/g, ''), `${item.p / g}${100 / g}`, plano(html));
      else assert.equal(f, pct(item.p, idioma));
    }
  });
  test(`ayuda tres-escrituras (${idioma}): ejercicio 2, termina con la respuesta pedida`, () => {
    for (const item of items(ej2, 2)) {
      const html = ej2.explicacion(item, ctx(idioma));
      sana(plano(html));
      const f = final(html, idioma);
      const g = mcd(item.p, 100);
      if (item.a === 'd') assert.equal(f, dec(item.p, idioma));
      else if (item.a === 'p') assert.equal(f, pct(item.p, idioma));
      else assert.equal(f.replace(/\s+/g, ''), `${item.p / g}${100 / g}`);
    }
  });
  test(`ayuda tres-escrituras (${idioma}): ejercicios 3 y 4, contienen la solución completa`, () => {
    for (const item of items(ej3, 3)) {
      const t = plano(ej3.explicacion(item, ctx(idioma)));
      sana(t);
      for (const p of item.ps) {
        assert.ok(t.includes(pct(p, idioma).replace(/ /g, ' ')) || t.includes(pct(p, idioma)), `${p}: ${t}`);
        assert.ok(t.includes(dec(p, idioma)), `${p}: ${t}`);
      }
    }
    for (const item of items(ej4, 4)) {
      const t = plano(ej4.explicacion(item, ctx(idioma)));
      sana(t);
      assert.ok(t.includes(FIN[idioma]));
      assert.equal(t.slice(t.lastIndexOf(FIN[idioma])).split(item.orden === 'menor-mayor' ? '&lt;' : '&gt;').length, 4);
    }
  });
}
