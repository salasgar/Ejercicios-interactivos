// Práctica «División entera: cajas y resto» (reparto-practicas-u2, tarea 23).
// Las comprobaciones usan definiciones independientes: contar por fuerza bruta
// cuántas cajas llenas caben, no las funciones de la propia práctica.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  dividir, divTxt, generarCajas, generarPrueba, generarInversa, generarPruebaOInversa,
  generarSignificado, generarPuede, valeLaIgualdad, esPruebaDe, respuestaInversa,
  solucionSignificado, puedeSer, OPCIONES_INVERSA,
} from '../practicas/division/logica.js';

const N = 3000;
const generarN = (fn, semilla = 11) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => fn(rng)); };

/** Cajas llenas y sobrantes, contando de uno en uno. */
function repartir(D, d) {
  let quedan = D, cajas = 0;
  while (quedan >= d) { quedan -= d; cajas++; }
  return { q: cajas, r: quedan };
}

/** ¿Es (q, r) una división correcta de D entre d? D = d·q + r con 0 ≤ r < d. */
const esDivisionDe = (D, d, q, r) => D === d * q + r && r >= 0 && r < d;

/** Ninguna respuesta puede ganar siempre: la más frecuente no pasa del 70 %. */
function maximoFrecuencia(valores) {
  const cuenta = new Map();
  valores.forEach(v => cuenta.set(v, (cuenta.get(v) ?? 0) + 1));
  return Math.max(...cuenta.values()) / valores.length;
}

test('dividir y divTxt', () => {
  for (let D = 0; D <= 99; D++) for (let d = 1; d <= 9; d++) {
    const { q, r } = dividir(D, d);
    assert.deepEqual({ q, r }, repartir(D, d));
  }
  assert.equal(divTxt(47, 6, 'es'), '47 : 6');
  assert.equal(divTxt(47, 6, 'en'), '47 ÷ 6');
});

test('ejercicio 1: cociente y resto por fuerza bruta, D ≤ 60 y ≤ 10 cajas', () => {
  const items = generarN(generarCajas);
  let exactas = 0;
  for (const it of items) {
    assert.deepEqual(repartir(it.D, it.d), { q: it.q, r: it.r }, JSON.stringify(it));
    assert.ok(esDivisionDe(it.D, it.d, it.q, it.r));
    assert.ok(it.D <= 60 && it.D >= 3, `D=${it.D}`);
    assert.ok(it.d >= 2 && it.d <= 9);
    assert.ok(it.q >= 1 && it.q <= 10, `q=${it.q}`);
    if (it.r === 0) exactas++;
  }
  assert.ok(exactas / N > 0.12 && exactas / N < 0.3, `exactas ${exactas / N}`);
});

test('ejercicio 2 (prueba): exactamente una opción es la prueba y las otras son falsas', () => {
  const items = generarN(generarPrueba);
  const posiciones = [];
  for (const it of items) {
    assert.equal(it.opciones.length, 4);
    const verdaderas = it.opciones.filter(o => esPruebaDe(o, it.D, it.d));
    assert.equal(verdaderas.length, 1);
    assert.equal(it.opciones.findIndex(o => esPruebaDe(o, it.D, it.d)), it.solucion);
    // La buena es de verdad una división: D = d · q + r con r < d.
    assert.ok(esDivisionDe(it.D, it.d, it.q, it.r));
    // Regla de oro: las demás no valen NI como igualdad aritmética.
    it.opciones.forEach((o, i) => { if (i !== it.solucion) assert.ok(!valeLaIgualdad(o), JSON.stringify(o)); });
    // Ninguna opción repetida.
    const textos = it.opciones.map(o => `${o.izq}=${o.a}${o.signo === '+' ? 'x' : 'y'}${o.b}${o.signo}${o.c}`);
    assert.equal(new Set(textos).size, 4);
    assert.ok(it.r >= 1 && it.r < it.d);
    posiciones.push(it.solucion);
  }
  assert.ok(maximoFrecuencia(posiciones) < 0.4, 'la buena no está siempre en el mismo sitio');
});

test('ejercicio 2 (inversa): la respuesta buena es única y se comprueba contando', () => {
  const items = generarN(generarInversa);
  const respuestas = [];
  for (const it of items) {
    assert.equal(it.D, it.a * it.b + it.r);
    assert.notEqual(it.a, it.b);
    // D : a es división con cociente b y resto r ⇔ r < a (y se verifica contando).
    const dA = repartir(it.D, it.a), dB = repartir(it.D, it.b);
    const valeA = dA.q === it.b && dA.r === it.r;
    const valeB = dB.q === it.a && dB.r === it.r;
    const buena = valeA && valeB ? 'ambas' : valeA ? 'a' : valeB ? 'b' : 'ninguna';
    assert.equal(it.solucion, buena, JSON.stringify(it));
    assert.ok(OPCIONES_INVERSA.includes(it.solucion));
    // Cada una de las demás opciones es falsa: «solo a» no vale si valen las dos, etc.
    OPCIONES_INVERSA.filter(o => o !== it.solucion).forEach(o => assert.notEqual(o, buena));
    respuestas.push(it.solucion);
  }
  assert.ok(maximoFrecuencia(respuestas) <= 0.5, 'ninguna respuesta domina');
  assert.equal(new Set(respuestas).size, 4);
  assert.equal(respuestaInversa({ a: 6, b: 7, r: 5 }), 'ambas');   // 47 = 6 · 7 + 5
});

test('ejercicio 2 mezclado: ambos tipos y ninguna sorpresa', () => {
  const items = generarN(generarPruebaOInversa);
  const tipos = new Set(items.map(i => i.tipo));
  assert.deepEqual([...tipos].sort(), ['inversa', 'prueba']);
});

test('ejercicio 3: la solución es la de contar cajas, y «una caja más» solo si sobra algo', () => {
  const items = generarN(generarSignificado);
  const pedidos = new Set();
  for (const it of items) {
    const { q, r } = repartir(it.D, it.d);
    assert.deepEqual({ q, r }, { q: it.q, r: it.r });
    assert.ok(it.D <= 60 && it.q >= 2 && it.q <= 10, JSON.stringify(it));
    pedidos.add(it.pide);
    if (it.pide === 'llenas') assert.equal(it.solucion, q);
    else if (it.pide === 'sueltos') assert.equal(it.solucion, r);
    else {
      // Cajas necesarias: la menor cantidad c con c · d ≥ D.
      let c = 0; while (c * it.d < it.D) c++;
      assert.equal(it.solucion, c, JSON.stringify(it));
    }
    assert.equal(solucionSignificado(it), it.solucion);
    assert.equal(it.escenario === 'caja', it.pide === 'hacen');
  }
  assert.deepEqual([...pedidos].sort(), ['hacen', 'llenas', 'sueltos']);
  // Entre los problemas de «una caja más» hay casos con resto 0 (donde no hace falta una más).
  const cajaExacta = items.filter(i => i.pide === 'hacen' && i.r === 0).length;
  assert.ok(cajaExacta > 50);
});

test('ejercicio 4: «puede» es falso exactamente cuando r ≥ d o d · q + r ≠ D', () => {
  const items = generarN(generarPuede);
  const respuestas = [];
  for (const it of items) {
    let buena;
    if (it.variante === 'resto') buena = it.r < it.d;
    else buena = it.r < it.d && it.d * it.q + it.r === it.D;
    assert.equal(it.solucion, buena, JSON.stringify(it));
    assert.equal(puedeSer(it), buena);
    if (it.variante === 'division' && it.solucion) assert.ok(esDivisionDe(it.D, it.d, it.q, it.r));
    if (it.variante === 'division' && !it.solucion) {
      // Es falso por una de las dos razones, o por las dos.
      assert.ok(it.r >= it.d || it.d * it.q + it.r !== it.D);
    }
    assert.ok(it.q === undefined || it.q >= 0);
    respuestas.push(it.solucion);
  }
  assert.ok(maximoFrecuencia(respuestas) <= 0.7, `Sí/No ${maximoFrecuencia(respuestas)}`);
  // Casos de las dos clases de «No» en la variante de la división entera.
  const noResto = items.filter(i => i.variante === 'division' && i.r >= i.d && i.d * i.q + i.r === i.D).length;
  const noCuenta = items.filter(i => i.variante === 'division' && i.r < i.d && i.d * i.q + i.r !== i.D).length;
  assert.ok(noResto > 50 && noCuenta > 50);
});
