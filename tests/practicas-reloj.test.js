// Reloj de coincidencias (practicas/reloj/): generadores y comprobaciones por
// fuerza bruta, con definiciones independientes de las de logica.js.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  generarLinea, comprobarLinea,
  generarHora, comprobarHora, sumarMinutos,
  generarTres, generarMultiplo, generarTresOMultiplo, comprobarTresOMultiplo,
} from '../practicas/reloj/logica.js';

const N = 1200;

// --- Definiciones independientes, por fuerza bruta -----------------------------

function mcmBruto(...numeros) {
  const limite = Math.max(...numeros) * numeros.reduce((p, n) => p * n, 1);
  for (let m = Math.max(...numeros); m <= limite; m++) {
    if (numeros.every(n => m % n === 0)) return m;
  }
  throw new Error('no encontrado');
}

/** Suma minutos a una hora sumando de uno en uno, con acarreo manual. */
function sumarMinutosBruto(h, m, incremento) {
  for (let i = 0; i < incremento; i++) {
    m++;
    if (m === 60) { m = 0; h++; }
    if (h === 24) h = 0;
  }
  return { h, m };
}

// --- Ejercicio 1: línea de tiempo ------------------------------------------------

test('línea: la solución es el m.c.m. por fuerza bruta, y solo ella acierta', () => {
  const rng = crearRng(1001);
  for (let i = 0; i < N; i++) {
    const item = generarLinea(rng);
    const [a, b] = item.periodos;
    assert.ok(a >= 2 && a < b && b <= 12);
    assert.equal(item.solucion, mcmBruto(a, b));
    assert.ok(item.solucion <= 60);
    assert.ok(comprobarLinea(item, item.solucion));
    assert.ok(!comprobarLinea(item, item.solucion - 1));
    assert.ok(!comprobarLinea(item, item.solucion + 1));
  }
});

test('línea: variedad de pares (no siempre el mismo)', () => {
  const rng = crearRng(2002);
  const vistos = new Set();
  for (let i = 0; i < N; i++) vistos.add(generarLinea(rng).periodos.join(','));
  assert.ok(vistos.size >= 10);
});

// --- Ejercicio 2: la hora de reloj ------------------------------------------------

test('hora: m.c.m. de dos cifras entre 40 y 180, y la hora de llegada por fuerza bruta', () => {
  const rng = crearRng(3003);
  for (let i = 0; i < N; i++) {
    const item = generarHora(rng);
    const [a, b] = item.periodos;
    assert.ok(a >= 10 && a < b);
    const mcmBr = mcmBruto(a, b);
    assert.equal(item.solucion, mcmBr);
    assert.ok(mcmBr >= 40 && mcmBr <= 180);
    assert.ok(item.inicio.h >= 0 && item.inicio.h <= 23);
    assert.equal(item.inicio.m % 5, 0);
    const bruta = sumarMinutosBruto(item.inicio.h, item.inicio.m, mcmBr);
    assert.deepEqual(item.horaSolucion, bruta);
    assert.ok(comprobarHora(item, bruta.h, bruta.m));
    assert.ok(!comprobarHora(item, bruta.h, (bruta.m + 1) % 60));
    // Como el m.c.m. es como mucho 180 min (3 h) y la hora inicial no pasa de
    // las 20 h, nunca se cruza la medianoche.
    assert.equal(item.inicio.h * 60 + item.inicio.m + mcmBr < 24 * 60, true);
  }
});

test('sumarMinutos: coincide con la suma a pulso (acarreo de minutos y de medianoche)', () => {
  const casos = [[23, 55, 10], [10, 50, 84], [0, 0, 1440], [12, 30, 1500], [9, 40, 90]];
  for (const [h, m, incremento] of casos) {
    assert.deepEqual(sumarMinutos(h, m, incremento), sumarMinutosBruto(h, m, incremento));
  }
});

test('hora: el error típico (sumar como si la hora tuviera 100 minutos), cuando existe, no es la solución', () => {
  const rng = crearRng(4004);
  let conError = 0;
  for (let i = 0; i < N; i++) {
    const item = generarHora(rng);
    if (!item.errorTipico) continue;
    conError++;
    assert.ok(item.errorTipico.h !== item.horaSolucion.h || item.errorTipico.m !== item.horaSolucion.m);
    assert.ok(!comprobarHora(item, item.errorTipico.h, item.errorTipico.m));
  }
  assert.ok(conError > 0);
});

// --- Ejercicio 3: tres datos pequeños, o uno múltiplo del otro -------------------

test('tres: la solución es el m.c.m. de los tres por fuerza bruta', () => {
  const rng = crearRng(5005);
  for (let i = 0; i < N; i++) {
    const item = generarTres(rng);
    const [a, b, c] = item.periodos;
    assert.ok(a < b && b < c);
    assert.equal(item.solucion, mcmBruto(a, b, c));
    assert.ok(item.solucion <= 60);
    assert.ok(comprobarTresOMultiplo(item, item.solucion));
    assert.ok(!comprobarTresOMultiplo(item, item.solucion + 1));
  }
});

test('multiplo: la solución es el mayor, que es múltiplo exacto del menor', () => {
  const rng = crearRng(6006);
  for (let i = 0; i < N; i++) {
    const item = generarMultiplo(rng);
    const [p1, p2] = item.periodos;
    const menor = Math.min(p1, p2), mayor = Math.max(p1, p2);
    assert.equal(item.solucion, mayor);
    assert.equal(mayor % menor, 0);
    assert.notEqual(menor, mayor);
    assert.ok(comprobarTresOMultiplo(item, mayor));
    assert.ok(!comprobarTresOMultiplo(item, menor));
  }
});

test('tresOMultiplo: aparecen los dos subtipos, en proporciones parecidas', () => {
  const rng = crearRng(7007);
  const cuenta = { tres: 0, multiplo: 0 };
  for (let i = 0; i < N; i++) cuenta[generarTresOMultiplo(rng).tipo]++;
  assert.ok(cuenta.tres > N * 0.3 && cuenta.tres < N * 0.7);
  assert.ok(cuenta.multiplo > N * 0.3 && cuenta.multiplo < N * 0.7);
});
