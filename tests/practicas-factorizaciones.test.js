// Práctica «Operar con factorizaciones» (reparto-practicas-u2, tarea 16):
// fuerza bruta con definiciones independientes de las de `aritmetica.js`,
// semilla fija para que el resultado sea reproducible.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  generarProducto, generarMultiplo, generarCociente, esCorrecta, explicar, primosDe, POOL,
} from '../practicas/factorizaciones/logica.js';

const N = 3000;

function generarN(fn, n = N, semilla = 1) {
  const rng = crearRng(semilla);
  return Array.from({ length: n }, () => fn(rng));
}

// Definiciones propias, sin pasar por aritmetica.js.
const valor = f => f.reduce((v, [p, e]) => v * p ** e, 1);
const exponenteBruto = (n, p) => { let e = 0; while (n % p === 0) { n /= p; e++; } return e; };
const primosBrutos = n => POOL.filter(p => n % p === 0);
const exp = (f, p) => f.find(([q]) => q === p)?.[1] ?? 0;
const cuota = (lista, pred) => lista.filter(pred).length / lista.length;

function factorizacionCoincide(f, n) {
  assert.equal(valor(f), n);
  for (const [p, e] of f) assert.equal(exponenteBruto(n, p), e, `exponente de ${p} en ${n}`);
  assert.deepEqual(f.map(([p]) => p), primosBrutos(n)); // bases de menor a mayor, sin primos de más
}

// --- Ejercicio 1: el producto ----------------------------------------------------

test('ejercicio 1: la solución vale a · b, con a · b ≤ 100 000, y suma los exponentes', () => {
  for (const item of generarN(generarProducto)) {
    factorizacionCoincide(item.fa, item.a);
    factorizacionCoincide(item.fb, item.b);
    assert.equal(valor(item.solucion), item.a * item.b);
    assert.ok(item.a * item.b <= 100000);
    const primos = new Set([...item.fa, ...item.fb].map(([p]) => p));
    assert.ok(primos.size <= 3);
    assert.ok([...item.fa, ...item.fb].every(([, e]) => e <= 3));
    for (const p of primos) assert.equal(exp(item.solucion, p), exp(item.fa, p) + exp(item.fb, p));
    assert.ok(item.fa.some(([p]) => exp(item.fb, p) > 0), 'comparten algún primo');
  }
});

test('ejercicio 1: esCorrecta acepta la suma de exponentes y nada más', () => {
  for (const item of generarN(generarProducto, 300, 11)) {
    const primos = primosDe(item);
    const buenos = primos.map(p => exp(item.solucion, p));
    assert.ok(esCorrecta(item, buenos));
    buenos.forEach((_, i) => {
      for (const d of [-1, 1]) {
        const mal = [...buenos]; mal[i] += d;
        if (mal[i] < 0) continue;
        assert.ok(!esCorrecta(item, mal));
      }
    });
  }
});

// --- Ejercicio 2: ¿es múltiplo? -----------------------------------------------------

test('ejercicio 2: esMultiplo coincide con a % b por fuerza bruta; sí y no entre el 40 % y el 60 %', () => {
  const items = generarN(generarMultiplo, N, 2);
  for (const item of items) {
    factorizacionCoincide(item.fa, item.a);
    factorizacionCoincide(item.fb, item.b);
    assert.equal(item.esMultiplo, item.a % item.b === 0);
    assert.ok(item.a <= 10000 && item.a >= 2 && item.b >= 2);
    if (item.esMultiplo) assert.equal(valor(item.solucion), item.a / item.b);
    else assert.deepEqual(item.solucion, []);
  }
  const si = cuota(items, i => i.esMultiplo);
  assert.ok(si > 0.4 && si < 0.6, `cuota de «sí»: ${si}`);
});

test('ejercicio 2: el primo que falla es de verdad el que impide que sea múltiplo, y hay de los dos tipos', () => {
  const noes = generarN(generarMultiplo, N, 3).filter(i => !i.esMultiplo);
  for (const item of noes) {
    const { p, ea, eb } = item.primoQueFalla;
    assert.equal(exponenteBruto(item.a, p), ea);
    assert.equal(exponenteBruto(item.b, p), eb);
    assert.ok(ea < eb);
    // Es el único: quitando ese primo de b, el resto sí divide a a.
    const resto = item.fb.filter(([q]) => q !== p).reduce((v, [q, e]) => v * q ** e, 1);
    assert.equal(item.a % resto, 0);
  }
  assert.ok(cuota(noes, i => i.primoQueFalla.ea === 0) > 0.35);
  assert.ok(cuota(noes, i => i.primoQueFalla.ea > 0) > 0.35);
});

test('ejercicio 2: en los «sí», el cociente es a / b; esCorrecta lo acepta y rechaza lo demás', () => {
  const sies = generarN(generarMultiplo, 600, 4).filter(i => i.esMultiplo);
  for (const item of sies) {
    const buenos = primosDe(item).map(p => exp(item.solucion, p));
    assert.ok(esCorrecta(item, buenos));
    assert.ok(!esCorrecta(item, buenos.map(e => e + 1)));
    assert.notEqual(item.a, item.b);
  }
});

// --- Ejercicio 3: el cociente ----------------------------------------------------------

test('ejercicio 3: la solución vale a / b y a es siempre múltiplo de b', () => {
  for (const item of generarN(generarCociente, N, 5)) {
    factorizacionCoincide(item.fa, item.a);
    factorizacionCoincide(item.fb, item.b);
    assert.equal(item.a % item.b, 0);
    assert.equal(valor(item.solucion), item.a / item.b);
    assert.ok(item.a <= 10000);
    for (const [p, e] of item.fa) assert.equal(exp(item.solucion, p), e - exp(item.fb, p));
  }
});

test('ejercicio 3: cuotas de casos especiales (10 % a = b, 20 % desaparece, 20 % pasa entero)', () => {
  const items = generarN(generarCociente, 5000, 6);
  const igual = i => i.a === i.b;
  const desaparece = i => !igual(i) && i.fa.some(([p, e]) => exp(i.fb, p) === e);
  const pasa = i => i.fa.some(([p]) => exp(i.fb, p) === 0);
  for (const [nombre, pred, objetivo] of [['igual', igual, 0.1], ['desaparece', desaparece, 0.2], ['pasa', pasa, 0.2]]) {
    const c = cuota(items, pred);
    assert.ok(Math.abs(c - objetivo) < 0.04, `${nombre}: ${c}`);
  }
  // Las categorías declaradas coinciden con lo que se mide por fuerza bruta.
  for (const i of items) {
    assert.equal(i.categoria === 'igual', igual(i));
    assert.equal(i.categoria === 'desaparece', desaparece(i));
    assert.equal(i.categoria === 'pasa', pasa(i));
  }
  assert.ok(items.some(i => i.solucion.length === 0), 'cuando a = b el cociente es 1 (lista vacía)');
});

test('los tres ejercicios usan también el 7 y el 11, no solo 2, 3 y 5', () => {
  for (const fn of [generarProducto, generarMultiplo, generarCociente]) {
    const usados = new Set(generarN(fn, 2000, 7).flatMap(i => [...i.fa, ...i.fb].map(([p]) => p)));
    assert.ok(usados.has(11) && usados.has(7));
  }
});

// --- Feedback --------------------------------------------------------------------------

test('explicar: da números del ítem, sin letras sueltas ni ×, y en los dos idiomas', () => {
  for (const fn of [generarProducto, generarMultiplo, generarCociente]) {
    for (const item of generarN(fn, 500, 8)) {
      for (const idioma of ['es', 'en']) {
        const nulo = explicar(item, null, idioma);
        const sinHtml = nulo.replace(/<[^>]+>/g, '');
        assert.ok(!sinHtml.includes('×'));
        assert.ok(!/\bfactor\b/i.test(sinHtml));
        assert.ok(sinHtml.includes(String(item.a)) || item.tipo === 'producto');
        assert.ok(!/undefined|NaN/.test(nulo));
      }
    }
  }
});

test('explicar: si el alumno se equivoca, dice cuánto vale lo suyo', () => {
  const item = generarN(generarProducto, 1, 9)[0];
  const mal = primosDe(item).map(() => 1);
  const txt = explicar(item, mal.map((e, i) => (i === 0 ? e + 3 : e)), 'es');
  assert.match(txt, /Lo que has escrito vale/);
});
