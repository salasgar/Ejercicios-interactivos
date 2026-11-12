// «No lo sé» en errores5: cada explicación acaba con la respuesta del ítem. El valor bueno de cada
// plantilla ya lo comprueba a mano `tests/practicas-errores5.test.js` (enteros con BigInt); aquí se
// comprueba que la explicación lleva justo esa respuesta, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { ERRORES_TIPICOS, aTexto } from '../practicas/_comun/decimales.js';
import * as L from '../practicas/errores5/logica.js';
import * as X from '../practicas/errores5/textos.js';

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

test('ej. 1: acaba con la línea mala, o con «todo está bien»; y dice cómo se llama el error', () => {
  let sinError = 0;
  for (const item of items(L.generarDonde, 1)) {
    assert.equal(item.falsa === null, item.error === null);
    if (item.falsa === null) sinError++;
    for (const idioma of IDIOMAS) {
      const esperado = item.falsa === null
        ? { es: 'que todo está bien', en: 'that everything is right' }[idioma]
        : { es: `la línea ${item.falsa + 1}`, en: `line ${item.falsa + 1}` }[idioma];
      const html = X.explicaDonde(item, ctx(idioma));
      comprobar(html, idioma, esperado, `ej1 ${idioma}`);
      if (item.falsa !== null) assert.ok(html.includes(ERRORES_TIPICOS[item.error].nombre[idioma]), `ej1 ${idioma}: falta el nombre del error`);
    }
  }
  assert.ok(sinError > 100 && sinError < N - 100, 'salen ítems con y sin error');
});

test('ej. 2: acaba con el nombre del error verdadero', () => {
  for (const item of items(L.generarQue, 2)) {
    assert.ok(item.opciones.includes(item.solucion));
    for (const idioma of IDIOMAS) {
      comprobar(X.explicaQue(item, ctx(idioma)), idioma, `«${ERRORES_TIPICOS[item.solucion].nombre[idioma]}»`, `ej2 ${idioma}`);
    }
  }
});

test('ej. 3: acaba con el resultado bien, con las cifras decimales que pide la línea', () => {
  for (const item of items(L.generarCorrige, 3)) {
    for (const idioma of IDIOMAS) {
      const esperado = aTexto(L.resultadoBueno(item), idioma, item.cifras);
      comprobar(X.explicaCorrige(item, ctx(idioma)), idioma, esperado, `ej3 ${idioma}`);
    }
  }
});
