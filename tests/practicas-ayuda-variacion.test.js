// «No lo sé» en variacion: cada explicación acaba con la respuesta que el ejercicio da por buena,
// calculada aquí con las fórmulas del enunciado y no copiada de la explicación.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { fmt } from '../practicas/_comun/enteros.js';
import * as L from '../practicas/variacion/logica.js';
import * as X from '../practicas/variacion/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const N = 1000;
const items = (fn, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, () => fn(rng));
};
const FIN = { es: 'La respuesta es', en: 'The answer is' };

function comprobar(html, idioma, esperado, que) {
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, `${que}: ${plano(html)}`);
  const m = html.match(new RegExp(`${FIN[idioma]} <span class="cuenta">(.*?)</span>\\.$`));
  assert.ok(m, `${que}: no acaba con la respuesta — ${plano(html)}`);
  assert.equal(m[1], esperado, `${que}: ${plano(html)}`);
}

test('ej. 1: la variación es final − inicial y la respuesta es la frase de esa variación', () => {
  for (const item of items(L.generarCambio, 1)) {
    assert.equal(item.v, item.f - item.i);
    const o = item.opciones[item.solucion];
    assert.equal(o.dir, item.v > 0 ? 'sube' : 'baja');
    assert.equal(o.k, Math.abs(item.v));
    for (const idioma of IDIOMAS) {
      const html = X.explicaCambio(item, ctx(idioma));
      const frase = X.txt(idioma).cambio.frase(item.ctx, o.dir, o.k).replace(/\.$/, '');
      comprobar(html, idioma, idioma === 'es' ? `«${frase}»` : `“${frase}”`, `ej1 ${idioma}`);
      assert.ok(html.includes(`${fmt(item.f)} − `), `ej1 ${idioma}: falta la cuenta`);
    }
  }
});

test('ej. 2: la respuesta es el mayor menos el menor, con su unidad', () => {
  for (const item of items(L.generarDiferencia, 2)) {
    assert.equal(item.d, item.hi - item.lo);
    for (const idioma of IDIOMAS) {
      comprobar(X.explicaDiferencia(item, ctx(idioma)), idioma, `${item.hi - item.lo} ${X.txt(idioma).unidad(item)}`, `ej2 ${idioma}`);
    }
  }
});

test('ej. 3: la respuesta es el valor que falta, hacia delante o al revés', () => {
  let final = 0, inicial = 0;
  for (const item of items(L.generarFalta, 3)) {
    const esperado = item.subtipo === 'final' ? item.x + item.dir * item.k : item.x - item.dir * item.k;
    assert.equal(item.r, esperado);
    if (item.subtipo === 'final') final++; else inicial++;
    for (const idioma of IDIOMAS) {
      const html = X.explicaFalta(item, ctx(idioma));
      assert.match(html, new RegExp(`${FIN[idioma]} <span class="cuenta">.*${fmt(esperado).replace('−', '\\u2212')}.*</span>\\.$`), plano(html));
      assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, plano(html));
    }
  }
  assert.ok(final > 100 && inicial > 100, 'salen los dos subtipos');
});

test('ej. 4: la respuesta son los años entre las dos fechas, quitando 1 si cruza el año 0', () => {
  for (const item of items(L.generarAnios, 4)) {
    const esperado = item.era === 'cruza' ? item.a + item.b - 1 : Math.abs(item.a - item.b);
    assert.equal(item.d, esperado);
    for (const idioma of IDIOMAS) {
      comprobar(X.explicaAnios(item, ctx(idioma)), idioma, `${esperado} ${X.txt(idioma).unidad(item)}`, `ej4 ${idioma}`);
    }
  }
});

test('ej. 5: la respuesta es la cuenta buena con su resultado', () => {
  for (const item of items(L.generarCuenta, 5)) {
    for (const idioma of IDIOMAS) {
      const html = X.explicaCuenta(item, ctx(idioma));
      comprobar(html, idioma, `${item.opciones[item.solucion].texto} = ${fmt(item.r)}`, `ej5 ${idioma}`);
      assert.ok(html.includes(item.r > 0 ? { es: 'positivo', en: 'positive' }[idioma] : { es: 'negativo', en: 'negative' }[idioma]), `ej5 ${idioma}: falta el signo`);
    }
  }
});
