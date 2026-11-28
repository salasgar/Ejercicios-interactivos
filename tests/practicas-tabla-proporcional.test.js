// Práctica «Tablas de proporcionalidad» (unidad 7, PU2 tarea 213): 3000 ítems por ejercicio con semillas fijas,
// contra comprobaciones escritas AQUÍ, aparte del generador (productos cruzados de enteros).

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  CONTEXTOS, CTX_CONSTANTE, BANCO, generarEsProporcional, claveEsProporcional, respuestaEsProporcional, errorEsProporcional,
  generarCompleta, claveCompleta, valorHueco, unidadHueco, erroresDeCompleta, candidatosCompleta,
  generarConstante, claveConstante, solucionConstante, errorDeConstante, candidatosConstante,
  generarDirectas, claveDirectas, ERRORES_PROPIOS, nombreError, dineroCelda, decimal, F, huellasDe,
} from '../practicas/tabla-proporcional/logica.js';
import { HUELLAS_RESERVADAS } from '../practicas/tabla-proporcional/reserva.js';
import { TX, explicaEsProporcional, explicaCompleta, explicaConstante, explicaDirectas, preguntaDirectas, datoConstante, preguntaConstante } from '../practicas/tabla-proporcional/textos.js';

const N = 3000;
const lote = (generar, semilla) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => generar(rng)); };
const sinHtml = s => String(s).replace(/<[^>]+>/g, '');
const LIMPIO = /undefined|NaN|\[object|×|%|por ciento|percent|inversa|inverse|constante|\bk\b/;
const variedad = (items, clave) => {
  const m = new Map();
  items.forEach(it => m.set(clave(it), (m.get(clave(it)) ?? 0) + 1));
  return Math.max(...m.values()) / items.length;
};

test('ej. 1: la respuesta de cada tabla coincide con la verdad (productos cruzados)', () => {
  const items = lote(generarEsProporcional, 7);
  let si = 0;
  for (const it of items) {
    const xs = it.cols.map(c => c.x), ys = it.cols.map(c => c.y);
    assert.equal(new Set(xs).size, xs.length, 'x repetidas');
    assert.ok(xs.every((x, i) => i === 0 || x > xs[i - 1]), 'columnas sin ordenar');
    assert.ok(ys.every(y => Number.isInteger(y) && y > 0));
    const verdad = ys.every((y, i) => BigInt(y) * BigInt(xs[0]) === BigInt(ys[0]) * BigInt(xs[i]));
    assert.equal(respuestaEsProporcional(it), verdad);
    assert.equal(it.si, verdad, `${it.tipo}: ${JSON.stringify(it.cols)}`);
    // el par «doble/triple» existe de verdad
    const { i, j, m } = it.par;
    assert.equal(xs[j], m * xs[i]);
    assert.ok(m === 2 || m === 3);
    if (verdad) si++;
    assert.equal(errorEsProporcional(it, verdad), null);
    assert.equal(errorEsProporcional(it, !verdad), verdad ? 'proporcional-como-no-proporcional' : 'no-proporcional-como-proporcional');
    if (!verdad) assert.notEqual(ys[j], m * ys[i]);
  }
  assert.ok(si / N > 0.45 && si / N < 0.55, `sí: ${si / N}`);
  assert.ok(variedad(items, claveEsProporcional) <= 0.1);
});

test('ej. 1: cotas creíbles por contexto y dinero en céntimos enteros', () => {
  for (const it of lote(generarEsProporcional, 8)) {
    const c = CONTEXTOS[it.ctx];
    const us = it.cols.map(col => col.x / c.xMul);
    assert.ok(us.every(Number.isInteger) && us.every(u => u >= 1 && u <= c.umax), `${it.ctx}: ${us}`);
    if (c.din) assert.ok(it.cols.every(col => col.y >= 10 && col.y <= 100000 && Number.isInteger(col.y)));
    if (it.ctx === 'receta') assert.ok(it.cols.every(col => col.y <= 1500));
    if (it.ctx === 'num') assert.ok(it.cols.every(col => col.y <= 100));
    if (it.ctx === 'coche') assert.ok(it.cols.every(col => col.x >= 100 && col.x <= 800 && col.x % 100 === 0));
    if (it.ctx === 'taxi') { const ys = it.cols.map(col => col.y); assert.ok(ys.every(y => y % 100 === 0)); }
  }
});

test('ej. 2: cada hueco vale lo que dice la proporcionalidad y la columna de referencia está completa', () => {
  const items = lote(generarCompleta, 9);
  for (const it of items) {
    const c = CONTEXTOS[it.ctx];
    assert.equal(it.huecos.length, 2);
    const cs = it.huecos.map(h => h.col);
    assert.equal(new Set([...cs, it.ref]).size, 3, 'huecos y referencia en columnas distintas');
    assert.deepEqual(it.huecos.map(h => h.que).sort(), ['x', 'y']);
    for (const col of it.cols) assert.equal(BigInt(col.y) * 1n, BigInt(it.k) * BigInt(col.x / c.xMul));
    const ref = it.cols[it.ref];
    for (const h of it.huecos) {
      const col = it.cols[h.col];
      const sol = valorHueco(it, h);
      const esperado = h.que === 'x' ? F(ref.x * col.y, ref.y) : F(ref.y * col.x, ref.x);
      const esp = c.din && h.que === 'y' ? esperado.dividir(F(100)) : esperado;
      assert.ok(sol.equals(esp), `${it.ctx} ${h.que}`);
    }
    // cotas
    assert.ok(it.cols.every(col => col.x / c.xMul <= c.umax));
    if (it.ctx === 'receta') assert.ok(it.cols.every(col => col.y <= 1000));
    // lo que escribe un alumno bien se acepta, en los dos idiomas
    for (const idioma of ['es', 'en']) {
      const txt = it.huecos.map(h => {
        const v = valorHueco(it, h);
        return unidadHueco(it, h) === '€' ? dineroCelda(Math.round(Number(v.num) * 100 / Number(v.den)), idioma) : decimal(v, idioma);
      });
      assert.deepEqual(erroresDeCompleta(it, txt, idioma), [null, null]);
    }
    // los errores con nombre valen otra cosa que la solución
    for (const h of it.huecos) for (const [id, v] of Object.entries(candidatosCompleta(it, h))) {
      assert.ok(!v.equals(valorHueco(it, h)), id);
      assert.ok(nombreError(id), id);
    }
  }
  assert.ok(variedad(items, claveCompleta) <= 0.1);
});

test('ej. 3: la solución es un decimal exacto y los errores valen otra cosa', () => {
  const items = lote(generarConstante, 10);
  let formas = new Set();
  for (const it of items) {
    const c = CTX_CONSTANTE[it.ctx], sol = solucionConstante(it);
    formas.add(it.forma);
    const u0 = it.cols[0].x / (c.xMul ?? 1), u1 = it.cols[1].x / (c.xMul ?? 1);
    assert.notEqual(u0, u1);
    assert.ok(u0 >= 2 && u1 >= 2 && u0 <= c.umax && u1 <= c.umax, 'nunca la columna del 1');
    for (const col of it.cols) assert.equal(BigInt(col.y), BigInt(it.k) * BigInt(col.x / (c.xMul ?? 1)));
    if (c.yMax) assert.ok(it.cols.every(col => col.y <= c.yMax));
    for (const idioma of ['es', 'en']) {
      assert.equal(errorDeConstante(it, decimal(sol, idioma), idioma), null);
      if (c.din) assert.equal(errorDeConstante(it, dineroCelda(it.k, idioma), idioma), null);
    }
    for (const [id, v] of Object.entries(candidatosConstante(it))) { assert.ok(!v.equals(sol), id); assert.ok(nombreError(id), id); }
    assert.equal(errorDeConstante(it, 'abc', 'es'), 'otra-respuesta');
  }
  assert.deepEqual([...formas].sort(), ['frase', 'tabla']);
  assert.ok(variedad(items, claveConstante) <= 0.1);
});

test('ej. 4: banco equilibrado, sin repetidos y sin porcentajes ni inversas', () => {
  assert.ok(BANCO.length >= 20);
  assert.equal(new Set(BANCO.map(b => b.id)).size, BANCO.length);
  const si = BANCO.filter(b => b.si).length;
  assert.ok(si >= 10 && BANCO.length - si >= 10);
  for (const b of BANCO) for (const campo of ['cond', 'a', 'b', 'por']) {
    assert.ok(b[campo].es.length > 5 && b[campo].en.length > 5, `${b.id}.${campo}`);
    assert.doesNotMatch(b[campo].es + b[campo].en, LIMPIO);
  }
  const items = lote(generarDirectas, 11);
  const claves = new Set(items.map(claveDirectas));
  assert.equal(claves.size, BANCO.length);
  assert.ok(variedad(items, claveDirectas) <= 0.1);
});

test('textos: sin restos ni signos prohibidos, coma en español y punto en inglés', () => {
  const rng = crearRng(12);
  for (let n = 0; n < 600; n++) {
    const a = generarEsProporcional(rng), b = generarCompleta(rng), c = generarConstante(rng), d = generarDirectas(rng);
    for (const idioma of ['es', 'en']) {
      const textos = [explicaEsProporcional(a, { idioma }), explicaCompleta(b, { idioma }), explicaConstante(c, { idioma }),
        explicaDirectas(d, { idioma }), preguntaDirectas(d, idioma), datoConstante(c, idioma), preguntaConstante(c, idioma)].map(sinHtml);
      for (const x of textos) {
        assert.doesNotMatch(x, LIMPIO, x);
        if (idioma === 'es') assert.doesNotMatch(x, /\d\.\d{2}\b/, x);
        else assert.doesNotMatch(x, /\d,\d{2}\b/, x);
      }
    }
  }
  for (const ej of Object.values(TX)) for (const idioma of ['es', 'en']) assert.doesNotMatch(sinHtml(ej.introduccion[idioma]), /×|%|inversa|inverse|constante/);
  assert.ok(Object.keys(ERRORES_PROPIOS).length > 0);
});

test('reserva: ningún ítem de los ej. 1-3 repite un caso de la hoja o del examen, y todos tienen huella', () => {
  assert.equal(HUELLAS_RESERVADAS.size, 31);
  for (const g of [generarEsProporcional, generarCompleta, generarConstante]) for (const it of lote(g, 31)) {
    const hs = huellasDe(it);
    if (g !== generarEsProporcional) assert.ok(hs.length > 0);
    assert.ok(!hs.some(h => HUELLAS_RESERVADAS.has(h)), JSON.stringify(it));
  }
});

test('reserva: 3000 ítems por ejercicio sin ningún caso de la hoja 2 ni del examen 2', () => {
  for (const [g, semilla] of [[generarEsProporcional, 51], [generarCompleta, 52], [generarConstante, 53]]) {
    const rng = crearRng(semilla);
    for (let n = 0; n < 3000; n++) {
      const it = g(rng);
      assert.ok(!huellasDe(it).some(h => HUELLAS_RESERVADAS.has(h)), JSON.stringify(it));
    }
  }
});

test('ej. 1: ninguna casilla pasa de yMax del contexto (3000 ítems)', () => {
  const rng = crearRng(41);
  for (let n = 0; n < 3000; n++) {
    const it = generarEsProporcional(rng), c = CONTEXTOS[it.ctx];
    if (c.yMax) assert.ok(it.cols.every(col => col.y <= c.yMax), JSON.stringify(it));
  }
});

test('textos: ni «÷» ni dinero sin dos decimales (es y en) en el banco y en las introducciones', () => {
  const textos = [];
  for (const b of BANCO) for (const k of ['cond', 'por']) textos.push(b[k].es, b[k].en);
  for (const e of [TX.ej2, TX.ej3]) textos.push(e.introduccion.es, e.introduccion.en);
  for (const x of textos) {
    assert.ok(!x.includes('÷'), x);
    assert.ok(!/(?<![,.\d])\d+[ \u00a0]€/.test(x) && !/€\d+(?![\d.])/.test(x) && !/€\d+\.\d(?!\d)/.test(x) && !/\d+,\d(?!\d)[ \u00a0]€/.test(x), x);
  }
});
