// «No lo sé» en `division` (tarea 187): la explicación lleva la solución que el ejercicio da por buena,
// calculada con la lógica de la práctica. 1000+ ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/division/logica.js';
import * as X from '../practicas/division/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const N = 1000;
const sano = html => assert.doesNotMatch(html, /undefined|NaN|\[object|null/, plano(html));

test('ej. 1: la explicación da el cociente, el resto y la prueba que calcula la lógica', () => {
  const rng = crearRng(601);
  for (let n = 0; n < N; n++) {
    const item = L.generarCajas(rng);
    const { q, r } = L.dividir(item.D, item.d);
    assert.deepEqual([q, r], [item.q, item.r]);
    for (const idioma of IDIOMAS) {
      const html = X.explicaCajas(item, ctx(idioma));
      sano(html);
      assert.ok(plano(html).endsWith(`${item.D} = ${item.d} · ${q} + ${r}.`), plano(html));
      assert.match(plano(html), new RegExp(`${item.D} − ${item.d * q} = ${r}`));
    }
  }
});

test('ej. 2: la explicación da la prueba buena o el veredicto de la inversa', () => {
  const rng = crearRng(602);
  const vistos = new Set();
  for (let n = 0; n < N; n++) {
    const item = L.generarPruebaOInversa(rng);
    vistos.add(item.tipo);
    for (const idioma of IDIOMAS) {
      const texto = plano(X.explicaPrueba(item, ctx(idioma)));
      sano(texto);
      if (item.tipo === 'prueba') {
        assert.ok(L.esPruebaDe(item.opciones[item.solucion], item.D, item.d));
        assert.ok(texto.endsWith(`${item.D} = ${item.d} · ${item.q} + ${item.r}.`), texto);
      } else {
        assert.equal(item.solucion, L.respuestaInversa(item));
        const fin = {
          a: L.divTxt(item.D, item.a, idioma), b: L.divTxt(item.D, item.b, idioma),
        };
        if (item.solucion === 'a' || item.solucion === 'b') {
          assert.ok(texto.endsWith(`${idioma === 'es' ? 'Solo de' : 'Only'} ${fin[item.solucion]}.`), texto);
        } else {
          const buscado = { ambas: { es: 'De las dos', en: 'Both of them' }, ninguna: { es: 'De ninguna', en: 'Neither of them' } }[item.solucion][idioma];
          assert.ok(texto.endsWith(`${buscado}.`), texto);
        }
      }
    }
  }
  assert.deepEqual([...vistos].sort(), ['inversa', 'prueba']);
});

test('ej. 3: la explicación da el número que el ejercicio da por bueno', () => {
  const rng = crearRng(603);
  for (let n = 0; n < N; n++) {
    const item = L.generarSignificado(rng);
    const solucion = L.solucionSignificado(item);
    assert.equal(solucion, item.solucion);
    for (const idioma of IDIOMAS) {
      const texto = plano(X.explicaSignificado(item, ctx(idioma)));
      sano(texto);
      assert.ok(texto.endsWith(`${idioma === 'es' ? 'La respuesta es' : 'The answer is'} ${solucion}.`), texto);
    }
  }
});

test('ej. 4: la explicación da Sí o No según la lógica', () => {
  const rng = crearRng(604);
  for (let n = 0; n < N; n++) {
    const item = L.generarPuede(rng);
    assert.equal(item.solucion, L.puedeSer(item));
    for (const idioma of IDIOMAS) {
      const c = ctx(idioma);
      const texto = plano(X.explicaPuede(item, c));
      sano(texto);
      assert.ok(texto.endsWith(`: ${item.solucion ? c.t.si : c.t.no}.`), texto);
    }
  }
});
