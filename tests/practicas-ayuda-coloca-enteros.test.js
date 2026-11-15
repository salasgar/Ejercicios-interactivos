// «No lo sé» en coloca-enteros: cada explicación lleva todos los resultados del ítem, calculados con
// el motor (no copiados de la explicación), una agrupación para cada uno y, en el ej. 3, una que no se puede.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { M, generar } from '../practicas/coloca-enteros/logica.js';
import { EXPLICACIONES, TX } from '../practicas/coloca-enteros/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<sup>(\d)<\/sup>/g, '^$1').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const N = 1000;

function items(ejercicio, semilla) {
  const rng = crearRng(semilla);
  let anterior = null;
  return Array.from({ length: N }, () => (anterior = generar(ejercicio, rng, { anterior })));
}

for (const ej of [1, 2, 3]) {
  test(`ej. ${ej}: la explicación lleva todos los resultados del ítem y una agrupación para cada uno`, () => {
    for (const it of items(ej, 300 + ej)) {
      for (const idioma of IDIOMAS) {
        const html = EXPLICACIONES[ej - 1](it, ctx(idioma));
        assert.doesNotMatch(html, /undefined|NaN|\[object|null|×|-\d|\(\+/, plano(html));
        const filas = html.match(/<li>.*?<\/li>/g) ?? [];
        assert.equal(filas.length, it.resultados.length, `una fila por resultado — ${plano(html)}`);
        const e = M.expresionDe(it);
        it.resultados.forEach((v, i) => {
          const fila = plano(filas[i]);
          assert.ok(fila.endsWith(plano(M.htmlValor(v, idioma))), `la fila ${i} acaba en ${M.clave(v)}: ${fila}`);
        });
        const final = plano(html.match(/<p>[^<]*<span class="cuenta">[^]*$/)?.[0] ?? html);
        for (const v of it.resultados) assert.ok(final.includes(plano(M.htmlValor(v, idioma))), `${M.clave(v)} en la frase final`);
        assert.ok(e.numeros.length >= 3);
      }
    }
  });
}

test('ej. 3: la explicación enseña una agrupación que no se puede y por qué', () => {
  for (const it of items(3, 333)) {
    for (const idioma of IDIOMAS) {
      const t = plano(EXPLICACIONES[2](it, ctx(idioma)));
      const no = idioma === 'es' ? /no da un número entero|entre 0/ : /does not give an integer|by 0/;
      assert.match(t, no, t);
    }
  }
});

test('los textos de los tres ejercicios existen en los dos idiomas, con «brackets» en inglés', () => {
  assert.equal(TX.ejercicios.length, 3);
  for (const x of TX.ejercicios) for (const campo of ['nombre', 'detalle', 'introduccion']) {
    for (const idioma of IDIOMAS) assert.ok(x[campo][idioma].length > 5);
  }
  for (const x of TX.ejercicios) assert.doesNotMatch(x.introduccion.en, /parenthes/i);
});
