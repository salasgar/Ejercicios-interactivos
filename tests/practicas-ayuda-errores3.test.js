// «No lo sé» en errores3: cada explicación acaba con la respuesta que el ejercicio da por buena
// (línea, nombre del error o bien/error) y, si hay error, trae la línea mala y cómo queda bien.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { ERRORES_TIPICOS } from '../practicas/_comun/enteros.js';
import * as L from '../practicas/errores3/logica.js';
import * as X from '../practicas/errores3/textos.js';

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
  const m = html.match(new RegExp(`${FIN[idioma]} <strong>(.*?)</strong>\\.$`));
  assert.ok(m, `${que}: no acaba con la respuesta — ${plano(html)}`);
  assert.equal(m[1], esperado, `${que}: ${plano(html)}`);
}

test('ej. 1: acaba con la línea falsa y dice cómo se llama el error', () => {
  for (const item of items(L.generarDonde, 1)) {
    assert.notEqual(item.falsa, null);
    for (const idioma of IDIOMAS) {
      const esperado = idioma === 'es' ? `la línea ${item.falsa + 1}` : `line ${item.falsa + 1}`;
      const html = X.explicaDonde(item, ctx(idioma));
      comprobar(html, idioma, esperado, `ej1 ${idioma}`);
      assert.ok(plano(html).includes(plano(X.nombreError(item.error, obj => obj[idioma]))), `ej1 ${idioma}: falta el nombre del error`);
    }
  }
});

test('ej. 2: acaba con el nombre del error verdadero', () => {
  for (const item of items(L.generarCual, 2)) {
    assert.ok(item.opciones.includes(item.solucion));
    for (const idioma of IDIOMAS) {
      comprobar(X.explicaCual(item, ctx(idioma)), idioma, `«${ERRORES_TIPICOS[item.solucion].nombre[idioma]}»`, `ej2 ${idioma}`);
    }
  }
});

test('ej. 3: acaba con «hay un error» o «está bien», según el ítem', () => {
  let bien = 0;
  for (const item of items(L.generarSiNo, 3)) {
    if (item.solucion === 'bien') bien++;
    for (const idioma of IDIOMAS) {
      const esperado = { bien: { es: '«Está bien»', en: '«It is right»' }, error: { es: '«Hay un error»', en: '«There is a mistake»' } }[item.solucion][idioma];
      comprobar(X.explicaSiNo(item, ctx(idioma)), idioma, esperado, `ej3 ${idioma}`);
    }
  }
  assert.ok(bien > 100 && bien < N - 100, 'salen ítems con y sin error');
});
