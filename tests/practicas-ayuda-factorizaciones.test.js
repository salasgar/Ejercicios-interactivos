// «No lo sé» en «Operar con factorizaciones» (tarea 186): la explicación de cada ejercicio lleva la
// solución del ítem, calculada de forma independiente (factorizando el número, no con item.solucion).

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { factorizar, htmlFact } from '../practicas/_comun/aritmetica.js';
import { generarProducto, generarMultiplo, generarCociente, explicaProducto, explicaMultiplo, explicaCociente } from '../practicas/factorizaciones/logica.js';

const IDIOMAS = ['es', 'en'];
const N = 1000;
const plano = h => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const generar = (fn, semilla) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => fn(rng)); };
const limpio = (h, donde) => {
  assert.doesNotMatch(h, /undefined|NaN|\[object|null|×/, `${donde}: ${plano(h)}`);
  assert.ok(plano(h).length > 60, `${donde}: demasiado corta`);
};

test('factorizaciones, ejercicio 1: la explicación lleva la factorización del producto y su comprobación', () => {
  for (const item of generar(generarProducto, 1861)) {
    const valor = item.a * item.b;
    const esperado = htmlFact(factorizar(valor));
    const hs = IDIOMAS.map(idioma => explicaProducto(item, { idioma }));
    hs.forEach((h, k) => {
      limpio(h, `producto ${IDIOMAS[k]}`);
      assert.ok(h.includes(`<span class="cuenta">${esperado}</span>`), `lleva ${esperado}: ${plano(h)}`);
      assert.ok(plano(h).includes(`= ${valor}`), 'la comprobación vale el producto');
      assert.ok(h.includes('+'), 'suma exponentes');
    });
    assert.notEqual(hs[0], hs[1]);
  }
});

test('factorizaciones, ejercicio 2: sí o no, y por qué número se multiplica', () => {
  let si = 0, no = 0;
  for (const item of generar(generarMultiplo, 1862)) {
    const esMultiplo = item.a % item.b === 0;
    assert.equal(esMultiplo, item.esMultiplo, 'el ítem sabe si es múltiplo');
    const hs = IDIOMAS.map(idioma => explicaMultiplo(item, { idioma }));
    hs.forEach((h, k) => {
      limpio(h, `multiplo ${IDIOMAS[k]}`);
      if (esMultiplo) {
        const q = item.a / item.b;
        assert.ok(h.includes(htmlFact(factorizar(q))), `lleva la factorización de ${q}`);
        assert.ok(plano(h).includes(`${q} · ${item.b} = ${item.a}`), 'la comprobación');
        assert.match(plano(h), k === 0 ? /sí, y/ : /yes, and/);
      } else {
        assert.match(plano(h), k === 0 ? /La respuesta es No ?\./ : /The answer is No ?\./);
        const { p } = item.primoQueFalla;
        assert.ok(plano(h).includes(`${p}`), 'nombra el primo que falla');
      }
    });
    if (esMultiplo) si++; else no++;
  }
  assert.ok(si > 300 && no > 300, `salen sí (${si}) y no (${no})`);
});

test('factorizaciones, ejercicio 3: la explicación lleva el cociente y su comprobación', () => {
  for (const item of generar(generarCociente, 1863)) {
    const q = item.a / item.b;
    assert.ok(Number.isInteger(q));
    const hs = IDIOMAS.map(idioma => explicaCociente(item, { idioma }));
    hs.forEach((h, k) => {
      limpio(h, `cociente ${IDIOMAS[k]}`);
      const f = htmlFact(factorizar(q));
      assert.ok(h.includes(`${item.a} ${k === 0 ? ':' : '÷'} ${item.b} = ${f === String(q) ? q : `${f} = ${q}`}`), `lleva el cociente: ${plano(h)}`);
      assert.ok(plano(h).includes(`${q} · ${item.b} = ${item.a}`), 'la comprobación');
    });
    assert.notEqual(hs[0], hs[1]);
  }
});
