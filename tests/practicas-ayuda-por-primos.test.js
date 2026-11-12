// «No lo sé» en `por-primos` (tarea 184): la explicación lleva una respuesta que el ejercicio da por buena,
// comprobada con la lógica de la práctica. 1000+ ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import { valorDe } from '../practicas/_comun/aritmetica.js';
import * as L from '../practicas/por-primos/logica.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<\/li>/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
const RESP = /(?:La respuesta es|The answer is) (.*)\.$/;

for (const j of [1, 2, 3, 4]) {
  test(`por-primos · ejercicio ${j}: los toques de la explicación llevan a una respuesta correcta y mínima`, () => {
    const rng = crearRng(10 + j);
    for (const idioma of IDIOMAS) {
      for (let i = 0; i < 1200; i++) {
        const item = L.generar(j, rng);
        const { pasos, final } = L.planAyuda(item);
        assert.ok(L.esCorrecta(item, final), `${JSON.stringify(item)}`);
        assert.equal(pasos.reduce((s, [, , , n]) => s + n, 0), L.toquesMinimos(item));
        const html = plano(L.explicaToques(item, ctx(idioma)));
        const dicho = html.match(RESP)?.[1] ?? '';
        assert.ok(dicho.startsWith(String(valorDe(final))), html);
        assert.ok(!html.includes('undefined') && !html.includes('NaN'));
      }
    }
  });
}

test('por-primos · ejercicio 5: la respuesta es la lista de todos los divisores', () => {
  const rng = crearRng(15);
  for (const idioma of IDIOMAS) {
    for (let i = 0; i < 1200; i++) {
      const item = L.generarTodos(rng);
      const html = plano(L.explicaTodos(item, ctx(idioma)));
      const dicho = html.match(RESP)?.[1];
      const real = []; for (let d = 1; d <= item.n; d++) if (item.n % d === 0) real.push(d);
      assert.equal(dicho, real.join(', '), html);
      assert.equal(item.divisores.length, real.length);
    }
  }
});
