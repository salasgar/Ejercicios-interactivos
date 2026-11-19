// «No lo sé» de «Escalas» (PU2 tarea 222): la explicación de cada ítem contiene la solución y el cambio de unidad, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { generarARealidad, generarAlPlano, generarQueEscala, generarEncaja, escalaTxt } from '../practicas/escalas/logica.js';
import { explicaARealidad, explicaAlPlano, explicaQueEscala, explicaEncaja, NO_SE_HACERLO } from '../practicas/escalas/textos.js';

const N = 1000;
const IDIOMAS = ['es', 'en'];
const texto = h => h.replace(/<[^>]+>/g, '').replace(/ /g, ' ');
const lote = (generar, semilla) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => generar(rng)); };
const RESP = { es: 'La respuesta es', en: 'The answer is' };
const CAMBIO = { es: 'Cambio de unidad', en: 'Change of unit' };

for (const [n, gen, exp, sem, cambio] of [[1, generarARealidad, explicaARealidad, 51, true], [2, generarAlPlano, explicaAlPlano, 52, true]]) {
  test(`ej. ${n}: pasos con cuenta, cambio de unidad y respuesta`, () => {
    for (const it of lote(gen, sem)) for (const i of IDIOMAS) {
      const h = exp(it, { idioma: i }), x = texto(h);
      assert.ok(h.includes('<ol class="pasos-ayuda">') && h.includes('<span class="cuenta">'));
      assert.ok(x.includes(CAMBIO[i]) === cambio, x);
      assert.ok(x.includes(RESP[i]), x);
      assert.ok(!/undefined|NaN|null|×/.test(x), x);
    }
  });
}

test('ej. 3: da la escala correcta', () => {
  for (const it of lote(generarQueEscala, 53)) for (const i of IDIOMAS) {
    const x = texto(explicaQueEscala(it, { idioma: i }));
    assert.ok(x.includes(`${RESP[i]} ${escalaTxt(it.D)}`), x);
    assert.ok(x.includes(CAMBIO[i]) || x.includes(i === 'es' ? 'centímetros' : 'centimetres'), x);
  }
});

test('ej. 4: da la escala que encaja', () => {
  for (const it of lote(generarEncaja, 54)) for (const i of IDIOMAS) {
    const x = texto(explicaEncaja(it, { idioma: i }));
    assert.ok(x.toLowerCase().includes(`${RESP[i]} ${escalaTxt(it.D)}`.toLowerCase()), x);
    assert.ok(!/undefined|NaN|null/.test(x), x);
  }
});

test('«No sé hacerlo» en los dos idiomas', () => {
  assert.ok(NO_SE_HACERLO.es && NO_SE_HACERLO.en);
});
