// Divisores por parejas con rectángulos (practicas/rectangulos/): generadores
// y comprobaciones por fuerza bruta, con definiciones independientes de las
// de logica.js (no se prueba la función contra sí misma).

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  generarRectangulos, parPara, clavePar, todasLasClaves, sonTodasLasParejas,
  generarBanco, generarParar, generarCuadrado, generarParte3,
} from '../practicas/rectangulos/logica.js';

const N = 1200;

// --- Definiciones independientes, por fuerza bruta ------------------------------

const esPrimoBruto = n => {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
};

const divisoresBrutos = n => Array.from({ length: n }, (_, i) => i + 1).filter(d => n % d === 0);

const parejasBrutas = n => {
  const parejas = [];
  for (const w of divisoresBrutos(n)) {
    const h = n / w;
    if (w <= h) parejas.push([w, h]);
  }
  return parejas;
};

const raizEnteraBruta = n => {
  let r = 0;
  while ((r + 1) * (r + 1) <= n) r++;
  return r;
};

// --- Ejercicio 1: descubre los rectángulos --------------------------------------

test('rectangulos: n entre 12 y 60, nunca primo, con cuadrados perfectos presentes', () => {
  const rng = crearRng(101);
  let cuadrados = 0;
  for (let i = 0; i < N; i++) {
    const item = generarRectangulos(rng);
    assert.equal(item.tipo, 'rectangulos');
    assert.ok(item.n >= 12 && item.n <= 60);
    assert.ok(!esPrimoBruto(item.n), `${item.n} no debería ser primo`);
    const r = raizEnteraBruta(item.n);
    if (r * r === item.n) cuadrados++;
  }
  assert.ok(cuadrados > N * 0.1 && cuadrados < N * 0.3);
});

test('parPara: coincide con la división exacta por fuerza bruta', () => {
  for (let n = 12; n <= 60; n++) {
    for (let w = 1; w <= n; w++) {
      const par = parPara(w, n);
      if (n % w === 0) {
        const h = n / w;
        assert.deepEqual(par, w <= h ? [w, h] : [h, w]);
      } else {
        assert.equal(par, null);
      }
    }
  }
});

test('todasLasClaves y sonTodasLasParejas: coinciden con la enumeración por fuerza bruta', () => {
  for (let n = 12; n <= 120; n++) {
    const brutas = parejasBrutas(n).map(clavePar);
    const claves = todasLasClaves(n);
    assert.deepEqual([...claves].sort(), [...brutas].sort());
    assert.ok(sonTodasLasParejas(claves, n));
    assert.ok(sonTodasLasParejas([...claves].reverse(), n)); // el orden no importa
    if (claves.length > 1) {
      assert.ok(!sonTodasLasParejas(claves.slice(1), n)); // falta una
    }
    assert.ok(!sonTodasLasParejas([...claves, 'inventada'], n)); // sobra una
  }
});

// --- Ejercicio 2: sin dibujo, las parejas ---------------------------------------

test('banco: 12 números distintos, contiene todos los divisores y los demás no dividen', () => {
  const rng = crearRng(202);
  for (let i = 0; i < N; i++) {
    const item = generarBanco(rng);
    assert.equal(item.tipo, 'banco');
    assert.ok(item.n >= 20 && item.n <= 120);
    assert.ok(!esPrimoBruto(item.n));
    assert.equal(item.banco.length, 12);
    assert.equal(new Set(item.banco).size, 12, 'los 12 tienen que ser distintos');
    const divisoresBrutosN = divisoresBrutos(item.n);
    assert.deepEqual([...item.divisoresN].sort((a, b) => a - b), divisoresBrutosN);
    for (const d of divisoresBrutosN) assert.ok(item.banco.includes(d), `${d} tiene que estar en el banco`);
    for (const x of item.banco) {
      if (!divisoresBrutosN.includes(x)) assert.notEqual(item.n % x, 0, `${x} no debería dividir a ${item.n}`);
    }
  }
});

// --- Ejercicio 3: ¿dónde se para? ------------------------------------------------

test('parar: la solución es la raíz entera por fuerza bruta, y las cuatro opciones son distintas', () => {
  const rng = crearRng(303);
  for (let i = 0; i < N; i++) {
    const item = generarParar(rng);
    assert.equal(item.tipo, 'parar');
    assert.ok(item.n >= 20 && item.n <= 150);
    assert.equal(item.solucion, raizEnteraBruta(item.n));
    assert.equal(item.opciones.length, 4);
    assert.equal(new Set(item.opciones).size, 4);
    assert.ok(item.opciones.includes(item.solucion));
    assert.ok(item.opciones.every(o => o >= 1 && o !== item.n));
  }
});

test('cuadrado: n es un cuadrado perfecto de raíz entre 4 y 12; la solución es siempre 1', () => {
  const rng = crearRng(404);
  for (let i = 0; i < N; i++) {
    const item = generarCuadrado(rng);
    assert.equal(item.tipo, 'cuadrado');
    assert.ok(item.r >= 4 && item.r <= 12);
    assert.equal(item.n, item.r * item.r);
    assert.equal(raizEnteraBruta(item.n), item.r);
    assert.equal(item.solucion, 1);
    assert.deepEqual([...item.opciones].sort((a, b) => a - b), [0, 1, 2, item.r].sort((a, b) => a - b));
    assert.equal(new Set(item.opciones).size, 4, 'con r >= 4 los cuatro valores son distintos');
  }
});

test('parte3: mezcla los dos subtipos, y ninguna opción correcta domina más del 70 %', () => {
  const rng = crearRng(505);
  const cuenta = { parar: 0, cuadrado: 0 };
  const correctasPorValor = new Map();
  for (let i = 0; i < N; i++) {
    const item = generarParte3(rng);
    cuenta[item.tipo]++;
    correctasPorValor.set(item.solucion, (correctasPorValor.get(item.solucion) || 0) + 1);
  }
  assert.ok(cuenta.parar > N * 0.35 && cuenta.parar < N * 0.65);
  assert.ok(cuenta.cuadrado > N * 0.35 && cuenta.cuadrado < N * 0.65);
  for (const total of correctasPorValor.values()) assert.ok(total < N * 0.7);
});

// --- Reabierta de la tarea 03: textos --------------------------------------------

test('textos: «falta/faltan» concuerdan y el número es el de celdas tachadas (no el resto)', async () => {
  const { TX } = await import('../practicas/rectangulos/textos.js');
  assert.match(TX.rect.sobran.es(5, 1, 24), /falta 1 celda /);
  assert.match(TX.rect.sobran.es(5, 2, 23), /faltan 2 celdas /);
  assert.match(TX.rect.sobran.en(5, 1, 24), /1 cell is missing/);
  assert.match(TX.rect.sobran.en(5, 2, 23), /2 cells are missing/);
  assert.doesNotMatch(JSON.stringify(TX.rect.como.en), /«|»|integer square root/);
});
