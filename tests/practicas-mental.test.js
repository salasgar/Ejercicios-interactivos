// Práctica «Cálculo mental con estrategia» (reparto-practicas-u2, tarea 30):
// fuerza bruta con definiciones independientes (`eval` de las expresiones
// escritas, divisores contados uno a uno), semilla fija.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  generarCompensar, generarDescomponer, enunciadoCompensar, lineaCompensar,
  redondeoCorrecto, ajusteCorrecto, resultadoCorrecto, valorOpcion, reconstruye, lineaDescomponer,
  descomposicionCorrecta,
} from '../practicas/mental/logica.js';

const N = 3000;
const generarN = (fn, n = N, semilla = 1) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };
const evaluar = expr => Function(`"use strict"; return (${expr.replaceAll('·', '*').replaceAll('−', '-')});`)();
const divisoresBrutos = n => Array.from({ length: n }, (_, i) => i + 1).filter(d => n % d === 0);
const esPrimoBruto = n => n >= 2 && divisoresBrutos(n).length === 2;

// --- Ejercicio 1 ----------------------------------------------------------------

test('ejercicio 1: la buena compensación da el valor y las otras dos no (regla de oro)', () => {
  const items = generarN(generarCompensar);
  for (const it of items) {
    assert.equal(evaluar(enunciadoCompensar(it)), it.valor);
    assert.equal(it.ajustes.length, 3);
    assert.equal(it.ajustes.filter(o => o.correcta).length, 1);
    assert.equal(it.redondeos.filter(o => o.correcta).length, 1);
    for (const o of it.ajustes) {
      const v = evaluar(o.expr);
      assert.equal(v, o.valor, o.expr);
      if (o.correcta) assert.equal(v, it.valor, o.expr);
      else assert.notEqual(v, it.valor, `${o.expr} vale lo mismo que ${enunciadoCompensar(it)}`);
    }
    assert.equal(new Set(it.ajustes.map(o => o.valor)).size, 3);
    // El redondeo bueno es la centena más cercana a k; los otros dos no lo son.
    const cercana = Math.round(it.k / 100) * 100;
    assert.equal(it.redondeos.find(o => o.correcta).valor, cercana);
    for (const o of it.redondeos.filter(r => !r.correcta)) assert.notEqual(o.valor % 100, 0);
  }
});

test('ejercicio 1: a + 99 = a + 100 − 1 y a · 99 = a · 100 − a en todos los ítems', () => {
  for (const it of generarN(generarCompensar)) {
    const buena = it.ajustes.find(o => o.correcta);
    assert.equal(evaluar(buena.expr), it.valor);
    if (it.variante === 'producto') assert.equal(it.n * it.k, it.n * it.R - it.falta * it.n);
    else assert.equal(it.n + it.k, it.n + it.R - it.falta);
  }
  const it = { variante: 'suma', n: 47, k: 99, R: 100 };
  assert.equal(lineaCompensar(it, { expr: '47 + 100 − 1' }), '47 + 99 = 47 + 100 − 1');
});

test('ejercicio 1: hay sumas con 98, 99 y 199 y productos (en torno al 30 %) con 99 y 98; el ajuste del producto es «− n»', () => {
  const items = generarN(generarCompensar);
  const productos = items.filter(i => i.variante === 'producto').length / N;
  assert.ok(productos > 0.2 && productos < 0.4, `productos: ${productos}`);
  assert.ok([98, 99, 199].every(k => items.some(i => i.variante === 'suma' && i.k === k)));
  assert.ok([98, 99].every(k => items.some(i => i.variante === 'producto' && i.k === k)));
  for (const it of items.filter(i => i.variante === 'producto' && i.k === 99)) {
    assert.ok(it.ajustes.find(o => o.correcta).texto.endsWith(String(it.n)));
    assert.ok(it.ajustes.some(o => o.texto === '− 1'), 'el «− 1» es un distractor del producto');
  }
});

test('ejercicio 1: ninguna posición es la correcta en más del 70 %', () => {
  const items = generarN(generarCompensar);
  for (const campo of ['ajustes', 'redondeos']) {
    for (let pos = 0; pos < 3; pos++) {
      const veces = items.filter(i => i[campo][pos].correcta).length / N;
      assert.ok(veces < 0.5, `${campo} ${pos}: ${veces}`);
    }
  }
});

test('ejercicio 1: pasos y resultado, solo lo exacto', () => {
  const it = generarN(generarCompensar, 1)[0];
  assert.ok(resultadoCorrecto(it, String(it.valor)));
  assert.ok(!resultadoCorrecto(it, it.valor + 1));
  const bien = it.redondeos.findIndex(o => o.correcta);
  assert.ok(redondeoCorrecto(it, bien));
  assert.ok(ajusteCorrecto(it, it.ajustes.findIndex(o => o.correcta)));
  assert.ok(!ajusteCorrecto(it, it.ajustes.findIndex(o => !o.correcta)));
});

// --- Ejercicio 2 ----------------------------------------------------------------

test('ejercicio 2: toda descomposición marcada como correcta reconstruye el factor, y la mala no', () => {
  const items = generarN(generarDescomponer);
  for (const it of items) {
    assert.equal(it.opciones.length, 3);
    assert.equal(it.valor, it.a * it.b);
    for (const o of it.opciones) {
      const v = o.clase === 'producto' ? o.x * o.y : o.x + o.y;
      assert.equal(valorOpcion(o), v);
      assert.equal(o.correcta, v === it.b, o.texto);
      assert.equal(reconstruye(it, o), o.correcta);
    }
    assert.equal(it.opciones.filter(o => o.correcta).length, 2);
    assert.equal(new Set(it.opciones.map(o => o.texto)).size, 3);
    assert.ok(it.b > 11);
  }
});

test('ejercicio 2: la línea ejecutada es verdad en todos los tramos, y 10 · 2 = 20 no vale como 12', () => {
  for (const it of generarN(generarDescomponer, 1000)) {
    for (const o of it.opciones.filter(x => x.correcta)) {
      const tramos = lineaDescomponer(it, o).split(' = ').map(evaluar);
      assert.ok(tramos.every(v => v === it.valor), lineaDescomponer(it, o));
    }
  }
  const it = { a: 25, b: 12, valor: 300, opciones: [{ clase: 'producto', x: 10, y: 2 }] };
  assert.ok(!descomposicionCorrecta(it, 0, 300), '10 · 2 = 20, no 12');
  const bueno = { a: 25, b: 12, valor: 300, opciones: [{ clase: 'producto', x: 4, y: 3 }] };
  assert.ok(descomposicionCorrecta(bueno, 0, '300'));
  assert.ok(!descomposicionCorrecta(bueno, 0, 275));
  assert.equal(lineaDescomponer(bueno, bueno.opciones[0]), '25 · 12 = 25 · 4 · 3 = 100 · 3 = 300');
});

test('ejercicio 2: ninguna posición es la correcta en más del 70 % (dos buenas y una mala)', () => {
  const items = generarN(generarDescomponer);
  for (let pos = 0; pos < 3; pos++) {
    const veces = items.filter(i => i.opciones[pos].correcta).length / N;
    assert.ok(veces < 0.8 && veces > 0.55, `posición ${pos}: ${veces}`);
  }
});

// --- Reapertura de la tarea 30 (2026-10-08) ------------------------------------------

import { TX } from '../practicas/mental/textos.js';
import { readFileSync } from 'node:fs';

test('reapertura: textos en inglés sin «two 25 too many» ni «sum» para una multiplicación', () => {
  assert.equal(TX.compensar.explicacion_producto.en(25, 98, 100, 2, 2450), '25 · 98 = 25 · 100 − 2 · 25 = 2500 − 50 = 2450: we have two 25s too many, not 2.');
  assert.match(TX.compensar.explicacion_producto.en(25, 99, 100, 1, 2475), /one 25 too many/);
  assert.ok(!/\bsum\b/i.test(TX.descomponer.introduccion.en), TX.descomponer.introduccion.en);
  assert.ok(!/la otra/.test(TX.descomponer.comoda.es(25, 4, 3, 12)));
});

test('decisión del 9-10: la práctica tiene dos ejercicios (sin «¿Qué conviene?») y el catálogo lo dice', async () => {
  const src = readFileSync(new URL('../practicas/mental/practica.js', import.meta.url), 'utf8');
  assert.equal((src.match(/^\s+generar: /gm) || []).length, 2);
  assert.equal(TX.estrategia, undefined);
  assert.doesNotMatch(src, /TX\.estrategia|montarEstrategia|generarEstrategia/);
  const { CATALOGO } = await import('../practicas/_comun/catalogo.js');
  assert.equal(CATALOGO.find(p => p.slug === 'mental').nEjercicios, 2);
});
