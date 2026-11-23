// «No lo sé» de «Cambia de unidad» (PU2 tarea 223): la explicación de cada ítem contiene la solución que el ejercicio da por buena, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { cantidad, aTexto } from '../practicas/_comun/proporcion.js';
import {
  generarLongitud, generarMasaCapacidad, generarTiempo, generarComplejo, generarUnidad, buenoComplejo,
} from '../practicas/unidades/logica.js';
import { explicaCambio, explicaTiempo, explicaComplejo, explicaUnidad, NO_SE_HACERLO } from '../practicas/unidades/textos.js';

const N = 1000;
const IDIOMAS = ['es', 'en'];
const texto = h => h.replace(/<[^>]+>/g, '').replace(/ /g, ' ');
const lote = (generar, semilla) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => generar(rng)); };
const RESP = { es: 'La respuesta es', en: 'The answer is' };

const CASOS = [
  [1, generarLongitud, explicaCambio, it => cantidad(it.res, it.a), 71],
  [2, generarMasaCapacidad, explicaCambio, it => cantidad(it.res, it.a), 72],
  [3, generarTiempo, explicaTiempo, it => cantidad(it.res, it.a), 73],
  [4, generarComplejo, explicaComplejo, it => cantidad(buenoComplejo(it), it.pequena), 74],
  [5, generarUnidad, explicaUnidad, it => cantidad(it.caso.n, it.caso.u), 75],
];
for (const [n, gen, exp, solucion, sem] of CASOS) {
  test(`ej. ${n}: pasos con cuenta y la solución al final, en es y en`, () => {
    for (const it of lote(gen, sem)) for (const i of IDIOMAS) {
      const h = exp(it, { idioma: i }), x = texto(h);
      assert.ok(h.includes('<ol class="pasos-ayuda">'), x);
      assert.ok(n === 5 || h.includes('<span class="cuenta">'), x);
      assert.ok(x.includes(`${RESP[i]} ${aTexto(solucion(it), i)}.`), x);
      assert.ok(!/undefined|NaN|null|×|\[object/.test(x), x);
    }
  });
}

test('el texto del botón de los ejercicios de calcular', () => {
  assert.deepEqual(NO_SE_HACERLO, { es: 'No sé hacerlo', en: 'I don’t know how' });
});

test('ej. 1: la explicación habla de los saltos de ese ítem', () => {
  for (const it of lote(generarLongitud, 76)) {
    const x = texto(explicaCambio(it, { idioma: 'es' }));
    assert.ok(x.includes(`De ${it.de} a ${it.a} hay`) && x.includes('cada salto es por 10'), x);
  }
});
