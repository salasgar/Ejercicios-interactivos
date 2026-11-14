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
        assert.match(plano(h), k === 0 ? /La respuesta es no ?\.$/ : /The answer is no ?\.$/);
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

// ─── Revisión de la tarea 193 ─────────────────────────────────────────────────

const FIN = ['La respuesta es', 'The answer is'];
const REGLA = [
  [/^Para multiplicar sin calcular/, /^To multiply without calculating/],
  [/^Un número es múltiplo de otro si/, /^A number is a multiple of another if/],
  [/^Para dividir sin calcular/, /^To divide without calculating/],
];

test('factorizaciones: la regla delante y la respuesta (con su comprobación) cierra la tarjeta, una sola vez', () => {
  [[generarProducto, explicaProducto], [generarMultiplo, explicaMultiplo], [generarCociente, explicaCociente]].forEach(([gen, fn], ej) => {
    for (const item of generar(gen, 1931 + ej)) {
      IDIOMAS.forEach((idioma, k) => {
        const h = fn(item, { idioma }), p = plano(h).trim();
        assert.match(p, REGLA[ej][k], `regla delante: ${p}`);
        assert.equal(p.split(FIN[k]).length - 1, 1, 'una sola respuesta');
        const fin = p.slice(p.indexOf(FIN[k]));
        // Tras la respuesta solo queda su comprobación, entre paréntesis, y el punto final.
        if (item.tipo !== 'multiplo' || item.esMultiplo) assert.match(fin, k === 0 ? /\(compruébalo: [^()]+\) ?\.$/ : /\(check it: [^()]+\) ?\.$/, fin);
        assert.doesNotMatch(p, /\. (Compruébalo|Check it):/, 'la comprobación no va detrás de la respuesta');
      });
    }
  });
});

test('factorizaciones, ejercicio 2: el «sí»/«no» sale solo en la respuesta (sin el «No:»/«Sí:» del feedback)', () => {
  for (const item of generar(generarMultiplo, 1934)) {
    IDIOMAS.forEach((idioma, k) => {
      const p = plano(explicaMultiplo(item, { idioma }));
      assert.doesNotMatch(p, /(^|\. )(No|Sí|Yes): /, p);
      if (item.esMultiplo) assert.ok(p.includes(k === 0 ? `Todos los primos de ${item.b} están en ${item.a}` : `All the primes of ${item.b} are in ${item.a}`), p);
    });
  }
});
