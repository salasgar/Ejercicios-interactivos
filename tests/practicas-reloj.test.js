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

// --- Reapertura de la tarea 12 ---------------------------------------------------

import {
  MAX_DECENAS, MAX_UNIDADES, minutosEnContadores, minutosDeContadores, multiplosHasta,
} from '../practicas/reloj/logica.js';
import { TX } from '../practicas/reloj/textos.js';

test('hora: TODA solución se puede marcar con los contadores de decenas (0-5) y unidades (0-9)', () => {
  const rng = crearRng(8008);
  const minutosVistos = new Set();
  for (let i = 0; i < 3000; i++) {
    const item = generarHora(rng);
    const { h, m } = item.horaSolucion;
    const { decenas, unidades } = minutosEnContadores(m);
    assert.ok(decenas >= 0 && decenas <= MAX_DECENAS && unidades >= 0 && unidades <= MAX_UNIDADES, `${h}:${m}`);
    assert.equal(minutosDeContadores(decenas, unidades), m);
    assert.ok(comprobarHora(item, h, minutosDeContadores(decenas, unidades)));
    minutosVistos.add(m);
  }
  assert.ok([...minutosVistos].some(m => m % 5 !== 0));
  assert.equal((MAX_DECENAS + 1) * (MAX_UNIDADES + 1), 60);
});

test('hora: el ejemplo de la ficha (21 y 28 a las 10:50) da las 12:14 y se puede marcar', () => {
  assert.deepEqual(sumarMinutos(10, 50, mcmBruto(21, 28)), { h: 12, m: 14 });
  assert.deepEqual(minutosEnContadores(14), { decenas: 1, unidades: 4 });
});

test('multiplosHasta: lista por fuerza bruta', () => {
  for (let p = 2; p <= 12; p++) {
    const esperado = [];
    for (let n = 1; n <= 60; n++) if (n % p === 0) esperado.push(n);
    assert.deepEqual(multiplosHasta(p, 60), esperado);
  }
});

test('ejercicio 3 con tres datos: la lista de múltiplos del mayor acaba en la solución y ningún anterior sirve', () => {
  const rng = crearRng(9009);
  for (let i = 0; i < N; i++) {
    const item = generarTres(rng);
    const [a, b, c] = item.periodos;
    const lista = multiplosHasta(c, item.solucion);
    assert.equal(lista.at(-1), item.solucion);
    for (const n of lista.slice(0, -1)) assert.ok(!(n % a === 0 && n % b === 0));
    const cuenta = TX.tres.cuenta_tres(a, b, c, lista, item.solucion);
    assert.ok(cuenta.es.includes(`m.c.m.(${a}, ${b}, ${c}) = ${item.solucion}`));
    assert.ok(cuenta.en.includes(`LCM(${a}, ${b}, ${c}) = ${item.solucion}`));
  }
});

test('textos: «por primera vez», 24 horas y la cuenta del m.c.m. en el feedback de la hora', () => {
  const pr = TX.linea.pregunta(3, 4);
  assert.ok(pr.es.includes('por primera vez') && pr.en.includes('for the first time'));
  const ph = TX.hora.pregunta(21, 28, 10, 50);
  assert.ok(ph.es.includes('por primera vez') && ph.es.includes('24 horas'));
  assert.ok(ph.en.includes('for the first time') && ph.en.includes('24-hour'));
  assert.ok(TX.linea.primera_vez(12).es.includes('vuelven a coincidir'));
  assert.ok(!TX.hora.aviso_100.es.includes('no se puede sumar'));
  const rng = crearRng(1212);
  for (let i = 0; i < 3000; i++) {
    const item = generarHora(rng);
    const [a, b] = item.periodos;
    const hExtra = Math.floor(item.solucion / 60), mExtra = item.solucion % 60;
    const inter = sumarMinutos(item.inicio.h, item.inicio.m, hExtra * 60);
    const d = TX.hora.descomposicion(a, b, item.solucion, hExtra, mExtra, item.inicio, inter, item.horaSolucion);
    assert.ok(d.es.startsWith(`m.c.m.(${a}, ${b}) = ${item.solucion} min`));
    assert.ok(d.en.startsWith(`LCM(${a}, ${b}) = ${item.solucion} min`));
    for (const t of [d.es, d.en]) assert.ok(!/\b0 h\b/.test(t) && !/\+ 0 min/.test(t), t);
  }
  for (const t of [TX.tres.nombre.en, TX.tres.pregunta_tres(2, 3, 4).en, TX.tres.pregunta_multiplo(3, 6).en]) {
    assert.ok(!/every how many/i.test(t), t);
  }
});
