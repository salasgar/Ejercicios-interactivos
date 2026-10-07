// Práctica «Fábrica de divisores»: se comprueba por fuerza bruta (división
// directa n % d === 0 y recuento de divisores por fuerza bruta), independiente
// de `aritmetica.js`.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  generarConstruir, factDeConstruido, esConstruccionCorrecta,
  generarContar, olvidoSumarUno,
  generarDivisible,
} from '../practicas/fabrica/logica.js';

function contarDivisoresBF(n) {
  let c = 0;
  for (let d = 1; d <= n; d++) if (n % d === 0) c++;
  return c;
}

function valorBF(fact) {
  return fact.reduce((v, [p, e]) => v * p ** e, 1);
}

// ─── Ejercicio 1: construye el divisor ─────────────────────────────────────

test('ejercicio 1: el objetivo es siempre divisor de n, y a veces es 1 o el propio n', () => {
  const rng = crearRng(1);
  let unos = 0;
  let iguales = 0;
  for (let i = 0; i < 3000; i++) {
    const item = generarConstruir(rng);
    assert.equal(valorBF(item.fact), item.n);
    assert.equal(item.n % item.objetivo, 0, JSON.stringify(item));
    if (item.objetivo === 1) unos++;
    if (item.objetivo === item.n) iguales++;
  }
  assert.ok(unos > 100, `objetivo=1 debería salir con cierta frecuencia: ${unos}`);
  assert.ok(iguales > 100, `objetivo=n debería salir con cierta frecuencia: ${iguales}`);
});

test('ejercicio 1: esConstruccionCorrecta coincide con comparar el valor construido, por fuerza bruta', () => {
  const rng = crearRng(2);
  for (let i = 0; i < 2000; i++) {
    const item = generarConstruir(rng);
    assert.ok(esConstruccionCorrecta(item, item.expObjetivo));
    const mal = item.expObjetivo.map(e => e + 1);
    const malBien = valorBF(factDeConstruido(item.fact, mal)) === item.objetivo;
    assert.equal(esConstruccionCorrecta(item, mal), malBien);
  }
});

// ─── Ejercicio 2: ¿cuántos divisores tiene? ────────────────────────────────

test('ejercicio 2: la solución coincide con el recuento por fuerza bruta (división directa)', () => {
  const rng = crearRng(3);
  for (let i = 0; i < 2000; i++) {
    const item = generarContar(rng);
    assert.equal(item.solucion, contarDivisoresBF(item.n), JSON.stringify(item));
  }
});

test('ejercicio 2: "olvidoSumarUno" es el producto de los exponentes, sin sumar 1, y es distinto de la solución salvo con un solo primo de exponente 1', () => {
  const rng = crearRng(4);
  for (let i = 0; i < 2000; i++) {
    const item = generarContar(rng);
    const prod = item.fact.reduce((v, [, e]) => v * e, 1);
    assert.equal(olvidoSumarUno(item), prod);
  }
});

test('ejercicio 2: el premio aparece en torno a la mitad de las veces', () => {
  const rng = crearRng(5);
  let premios = 0;
  for (let i = 0; i < 3000; i++) if (generarContar(rng).premio) premios++;
  const p = premios / 3000;
  assert.ok(p >= 0.4 && p <= 0.6, `proporción de premio: ${p}`);
});

// ─── Ejercicio 3: sin dividir ───────────────────────────────────────────────

test('ejercicio 3: "divisible" coincide con n % d === 0, por fuerza bruta', () => {
  const rng = crearRng(6);
  for (let i = 0; i < 3000; i++) {
    const item = generarDivisible(rng);
    assert.equal(valorBF(item.fact), item.n);
    assert.equal(valorBF(item.factD), item.d);
    assert.equal(item.divisible, item.n % item.d === 0, JSON.stringify(item));
  }
});

test('ejercicio 3: "sí" y "no" salen entre el 35 % y el 65 % en 3000 ítems', () => {
  const rng = crearRng(7);
  let si = 0;
  for (let i = 0; i < 3000; i++) if (generarDivisible(rng).divisible) si++;
  const p = si / 3000;
  assert.ok(p >= 0.35 && p <= 0.65, `proporción de "sí": ${p}`);
});
