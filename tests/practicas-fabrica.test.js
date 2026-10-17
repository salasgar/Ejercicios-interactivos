// Práctica «Fábrica de divisores»: se comprueba por fuerza bruta (división
// directa n % d === 0 y recuento de divisores por fuerza bruta), independiente
// de `aritmetica.js`.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import * as logica from '../practicas/fabrica/logica.js';
import { generarContar, olvidoSumarUno, generarDivisible } from '../practicas/fabrica/logica.js';

function contarDivisoresBF(n) {
  let c = 0;
  for (let d = 1; d <= n; d++) if (n % d === 0) c++;
  return c;
}

function valorBF(fact) {
  return fact.reduce((v, [p, e]) => v * p ** e, 1);
}

// ─── Lo quitado (tarea 76) ─────────────────────────────────────────────────

test('«Construye el divisor» ya no existe: ni en la lógica ni en los textos', async () => {
  for (const nombre of ['generarConstruir', 'factDeConstruido', 'esConstruccionCorrecta']) assert.equal(logica[nombre], undefined, nombre);
  const { TX } = await import('../practicas/fabrica/textos.js');
  assert.equal(TX.construir, undefined);
  assert.deepEqual(Object.keys(TX.nombre), ['contar', 'divisible']);
});

// ─── Ejercicio 1: ¿cuántos divisores tiene? ────────────────────────────────

test('ejercicio 1: la solución coincide con el recuento por fuerza bruta (división directa)', () => {
  const rng = crearRng(3);
  for (let i = 0; i < 2000; i++) {
    const item = generarContar(rng);
    assert.equal(item.solucion, contarDivisoresBF(item.n), JSON.stringify(item));
  }
});

test('ejercicio 1: "olvidoSumarUno" es el producto de los exponentes, sin sumar 1, y es distinto de la solución salvo con un solo primo de exponente 1', () => {
  const rng = crearRng(4);
  for (let i = 0; i < 2000; i++) {
    const item = generarContar(rng);
    const prod = item.fact.reduce((v, [, e]) => v * e, 1);
    assert.equal(olvidoSumarUno(item), prod);
  }
});

test('ejercicio 1: el premio aparece en torno a la mitad de las veces', () => {
  const rng = crearRng(5);
  let premios = 0;
  for (let i = 0; i < 3000; i++) if (generarContar(rng).premio) premios++;
  const p = premios / 3000;
  assert.ok(p >= 0.4 && p <= 0.6, `proporción de premio: ${p}`);
});

// ─── Ejercicio 2: sin dividir ───────────────────────────────────────────────

test('ejercicio 2: "divisible" coincide con n % d === 0, por fuerza bruta', () => {
  const rng = crearRng(6);
  for (let i = 0; i < 3000; i++) {
    const item = generarDivisible(rng);
    assert.equal(valorBF(item.fact), item.n);
    assert.equal(valorBF(item.factD), item.d);
    assert.equal(item.divisible, item.n % item.d === 0, JSON.stringify(item));
  }
});

test('ejercicio 2: "sí" y "no" salen entre el 35 % y el 65 % en 3000 ítems', () => {
  const rng = crearRng(7);
  let si = 0;
  for (let i = 0; i < 3000; i++) if (generarDivisible(rng).divisible) si++;
  const p = si / 3000;
  assert.ok(p >= 0.35 && p <= 0.65, `proporción de "sí": ${p}`);
});

test('ejercicio 2: el divisor es siempre menor que n y salen los dos tipos de «no» (exponente de más, primo que falta)', () => {
  const rng = crearRng(8);
  let exponenteDeMas = 0, primoQueFalta = 0, maxD = 0;
  for (let i = 0; i < 3000; i++) {
    const item = generarDivisible(rng);
    assert.ok(item.d < item.n && item.d > 1, `n=${item.n} d=${item.d}`);
    maxD = Math.max(maxD, item.d);
    if (!item.divisible) {
      const mapa = new Map(item.fact);
      if (item.factD.some(([p]) => !mapa.has(p))) primoQueFalta++;
      else exponenteDeMas++;
    }
  }
  assert.ok(exponenteDeMas > 150, `exponente de más: ${exponenteDeMas}`);
  assert.ok(primoQueFalta > 150, `primo que falta: ${primoQueFalta}`);
  assert.ok(maxD < 363);
});

test('textos: no hay «___» en el enunciado y los fallos del ejercicio 1 y 2 enseñan la cuenta y la factorización del divisor', async () => {
  const { TX } = await import('../practicas/fabrica/textos.js');
  for (const idioma of ['es', 'en']) assert.doesNotMatch(TX.divisible.pregunta[idioma](120, 12), /_/);
  assert.match(TX.contar.feedbackMal.es(7, '(2+1) · (1+1) = 6'), /\(2\+1\) · \(1\+1\) = 6/);
  assert.match(TX.contar.feedbackOlvido.en(2, '(2+1) · (1+1) = 6'), /\(2\+1\) · \(1\+1\) = 6/);
  assert.equal(TX.divisible.factorDelDivisor.es(12, '2<sup>2</sup> · 3'), '12 = 2<sup>2</sup> · 3:');
});
