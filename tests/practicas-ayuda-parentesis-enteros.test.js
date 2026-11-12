// «No lo sé» en parentesis-enteros: cada explicación acaba con la respuesta que el ejercicio da por
// buena, calculada aquí con el evaluador y no copiada de la explicación.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { evaluar, aTexto, fmt } from '../practicas/_comun/enteros.js';
import * as L from '../practicas/parentesis-enteros/logica.js';
import * as X from '../practicas/parentesis-enteros/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const N = 1000;
const items = (fn, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, () => fn(rng));
};
const FIN = { es: 'La respuesta es', en: 'The answer is' };

/** Lo que va en el último «cuenta» tras «La respuesta es», en texto plano. */
function final(html, idioma, que) {
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, `${que}: ${plano(html)}`);
  const m = html.match(new RegExp(`${FIN[idioma]} <span class="cuenta">(.*?)</span>\\.</p>$`));
  assert.ok(m, `${que}: no acaba con la respuesta — ${plano(html)}`);
  return plano(m[1]);
}
const quieto = s => s.replace(/\s+/g, '');

test('ej. 1: la respuesta es la cuenta sin paréntesis con los signos buenos y vale lo mismo', () => {
  for (const item of items(L.generarQuita, 1)) {
    const signos = item.dentro.map(t => t.signo * item.signoPar);
    for (const idioma of IDIOMAS) {
      const r = final(X.explicaQuita(item, ctx(idioma)), idioma, `ej1 ${idioma}`);
      const esperado = L.reescritura(item, signos);
      assert.equal(quieto(r), quieto(aTexto(esperado)));
      assert.equal(evaluar(r), evaluar(item.expr));
      assert.ok(!r.includes('('), r);
    }
  }
});

test('ej. 2: la respuesta es el valor de la cuenta', () => {
  for (const item of items(L.generarCalcula, 2)) {
    for (const idioma of IDIOMAS) {
      const html = X.explicaCalcula(item, ctx(idioma));
      assert.equal(final(html, idioma, `ej2 ${idioma}`), fmt(evaluar(item.expr)));
    }
  }
});

test('ej. 3: la respuesta son los valores de las cuentas, en orden', () => {
  let parejas = 0, solas = 0;
  for (const item of items(L.generarPotencia, 3)) {
    const valores = item.exprs.map(e => evaluar(e));
    for (const idioma of IDIOMAS) {
      const r = final(X.explicaPotencia(item, ctx(idioma)), idioma, `ej3 ${idioma}`);
      assert.equal(r, valores.length === 2 ? `A = ${fmt(valores[0])}; B = ${fmt(valores[1])}` : fmt(valores[0]));
    }
    if (valores.length === 2) parejas++; else solas++;
  }
  assert.ok(parejas > 100 && solas > 100, 'salen parejas y cuentas solas');
});

test('ej. 5: la respuesta es una colocación que da el objetivo', () => {
  for (const item of items(L.generarColocar, 5)) {
    for (const idioma of IDIOMAS) {
      const trozos = final(X.explicaColocar(item, ctx(idioma)), idioma, `ej5 ${idioma}`).split(' = ');
      assert.ok(trozos[0].includes('('), trozos[0]);
      assert.equal(evaluar(trozos[0]), item.objetivo);
      assert.equal(trozos[trozos.length - 1], fmt(item.objetivo));
      assert.notEqual(quieto(trozos[0]), quieto(item.expr));
    }
  }
});
