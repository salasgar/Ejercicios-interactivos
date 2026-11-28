// Práctica «Proporcionalidad inversa» (unidad 7, PU2 tarea 215): 3000 ítems por ejercicio con semillas fijas,
// contra comprobaciones escritas AQUÍ, aparte del generador (productos de enteros).

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  CONTEXTOS, DIRECTOS, generarEsInversa, claveEsInversa, respuestaEsInversa, errorEsInversa,
  generarCompleta, claveCompleta, valorHueco, unidadHueco, erroresDeCompleta, candidatosCompleta,
  generarProblema, claveProblema, errorDeProblema, solucionProblema, candidatosProblema,
  generarCaza, claveCaza, verdadCaza, errorCaza, ERRORES_PROPIOS, nombreError, dineroCelda, F, esReservado,
} from '../practicas/inversa/logica.js';
import {
  TX, explicaEsInversa, explicaCompleta, explicaProblema, explicaCaza, datoProblemaTx, preguntaProblema, enunciadoCaza, resolucionCaza,
} from '../practicas/inversa/textos.js';

const N = 3000;
const lote = (generar, semilla) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => generar(rng)); };
const sinHtml = s => String(s).replace(/<[^>]+>/g, '');
const LIMPIO = /undefined|NaN|\[object|×|÷|%|por ciento|percent|constante|\bk\b/;
const variedad = (items, clave) => {
  const m = new Map();
  items.forEach(it => m.set(clave(it), (m.get(clave(it)) ?? 0) + 1));
  return Math.max(...m.values()) / items.length;
};
const decimal = (v, i) => { const n = Number(v.num) / Number(v.den); return String(n).replace('.', i === 'es' ? ',' : '.'); };

test('ej. 1: la respuesta coincide con los productos y hay sí y no equilibrados', () => {
  const items = lote(generarEsInversa, 7);
  let si = 0;
  for (const it of items) {
    const xs = it.cols.map(c => c.x), ys = it.cols.map(c => c.y);
    assert.equal(new Set(xs).size, xs.length);
    assert.ok(xs.every((x, i) => i === 0 || x > xs[i - 1]));
    assert.ok(ys.every(y => Number.isInteger(y) && y > 0 && y <= 240));
    const verdad = xs.every((x, i) => x * ys[i] === xs[0] * ys[0]);
    assert.equal(respuestaEsInversa(it), verdad);
    assert.equal(it.si, verdad, `${it.tipo}: ${JSON.stringify(it.cols)}`);
    if (verdad) si++;
    assert.equal(errorEsInversa(it, verdad), null);
    assert.equal(errorEsInversa(it, !verdad), verdad ? 'inversa-como-no-inversa' : 'no-inversa-como-inversa');
    assert.equal(xs[it.par.j], it.par.m * xs[it.par.i]);
  }
  assert.ok(si / N > 0.45 && si / N < 0.55, `sí: ${si / N}`);
  assert.ok(variedad(items, claveEsInversa) <= 0.1);
});

test('ej. 2: cada hueco vale lo que dice el producto y los errores valen otra cosa', () => {
  const items = lote(generarCompleta, 9);
  for (const it of items) {
    const c = CONTEXTOS[it.ctx], m = c.din ? 100 : 1;
    assert.equal(it.huecos.length, 2);
    assert.equal(new Set([...it.huecos.map(h => h.col), it.ref]).size, 3);
    assert.deepEqual(it.huecos.map(h => h.que).sort(), ['x', 'y']);
    for (const col of it.cols) {
      assert.equal(col.x * col.y, it.P * m);
      assert.ok(col.x >= c.xMin && col.x <= c.xMax && col.y >= c.yMin && col.y <= c.yMax, `${it.ctx} ${col.x} ${col.y}`);
    }
    for (const idioma of ['es', 'en']) {
      const txt = it.huecos.map(h => {
        const v = valorHueco(it, h);
        return unidadHueco(it, h) === '€' ? dineroCelda(Math.round(Number(v.num) * 100 / Number(v.den)), idioma) : decimal(v, idioma);
      });
      assert.deepEqual(erroresDeCompleta(it, txt, idioma), [null, null]);
    }
    for (const h of it.huecos) for (const [id, v] of Object.entries(candidatosCompleta(it, h))) {
      assert.ok(!v.equals(valorHueco(it, h)), id);
      assert.ok(nombreError(id), id);
    }
  }
  assert.ok(variedad(items, claveCompleta) <= 0.1);
});

test('ej. 3: la solución es exacta, dentro de la cota, y los errores valen otra cosa', () => {
  const items = lote(generarProblema, 10);
  for (const it of items) {
    const c = CONTEXTOS[it.ctx], m = c.din ? 100 : 1;
    assert.notEqual(it.a, it.c);
    for (const x of [it.a, it.c]) {
      assert.ok(x >= c.xMin && x <= c.xMax, `${it.ctx} x=${x}`);
      const y = (it.P * m) / x;
      assert.ok(Number.isInteger(y) && y >= c.yMin && y <= c.yMax, `${it.ctx} y=${y}`);
    }
    if (it.ctx === 'coche') assert.ok(it.a % 5 === 0 && it.c % 5 === 0);
    const sol = solucionProblema(it);
    for (const idioma of ['es', 'en']) {
      const txt = c.din ? dineroCelda((it.P * m) / it.c, idioma) : decimal(sol, idioma);
      assert.equal(errorDeProblema(it, txt, idioma), null);
    }
    for (const [id, v] of Object.entries(candidatosProblema(it))) { assert.ok(!v.equals(sol), id); assert.ok(nombreError(id), id); }
    assert.equal(errorDeProblema(it, 'abc', 'es'), 'otra-respuesta');
  }
  assert.ok(variedad(items, claveProblema) <= 0.1);
});

test('ej. 4: las cuentas de la resolución están bien hechas y el tipo cuadra', () => {
  const items = lote(generarCaza, 11);
  const tipos = new Map();
  for (const it of items) {
    tipos.set(it.tipo, (tipos.get(it.tipo) ?? 0) + 1);
    const cx = it.esInv ? CONTEXTOS[it.ctx] : DIRECTOS[it.ctx], m = cx.din ? 100 : 1;
    assert.notEqual(it.a, it.c);
    assert.ok(Number.isInteger(it.bien) && it.bien > 0);
    if (it.esInv) { assert.equal(it.a * it.b, it.c * it.bien); assert.equal(it.a * it.b, it.P * m); }
    else assert.equal(it.b * it.c, it.bien * it.a);
    if (it.tipo === 'inversa-como-directa') assert.equal(it.mal * it.a, it.b * it.c);
    if (it.tipo === 'directa-como-inversa') assert.equal(it.mal * it.c, it.a * it.b);
    if (it.mal !== undefined && it.mal !== null) assert.notEqual(it.mal, it.bien);
    assert.equal(verdadCaza(it) === 'bien', it.mal === null);
    if (it.esInv) { assert.ok(it.b >= cx.yMin && it.b <= cx.yMax && it.bien >= cx.yMin && it.bien <= cx.yMax); assert.ok(it.a >= cx.xMin && it.c <= cx.xMax); }
    else if (cx.yMax) assert.ok(it.b <= cx.yMax && it.bien <= cx.yMax && (it.mal ?? 0) <= cx.yMax);
    assert.equal(errorCaza(it, verdadCaza(it)), null);
    for (const o of ['bien', 'mal-directa', 'mal-inversa']) if (o !== verdadCaza(it)) assert.ok(nombreError(errorCaza(it, o)), o);
  }
  for (const t of ['bien-inversa', 'inversa-como-directa', 'bien-directa', 'directa-como-inversa']) assert.ok(tipos.get(t) > N * 0.08, t);
  assert.ok(variedad(items, claveCaza) <= 0.1);
});

test('textos: sin restos ni signos prohibidos, coma en español y punto en inglés', () => {
  const rng = crearRng(12);
  for (let n = 0; n < 600; n++) {
    const a = generarEsInversa(rng), b = generarCompleta(rng), c = generarProblema(rng), d = generarCaza(rng);
    for (const idioma of ['es', 'en']) {
      const textos = [explicaEsInversa(a, { idioma }), explicaCompleta(b, { idioma }), explicaProblema(c, { idioma }), explicaCaza(d, { idioma }),
        datoProblemaTx(c, idioma), preguntaProblema(c, idioma), enunciadoCaza(d, idioma), resolucionCaza(d, idioma)].map(sinHtml);
      for (const x of textos) {
        assert.doesNotMatch(x, LIMPIO, x);
        if (idioma === 'es') assert.doesNotMatch(x, /\d\.\d{2}\b/, x);
        else assert.doesNotMatch(x, /\d,\d{2}\b/, x);
      }
    }
  }
  for (const ej of Object.values(TX)) for (const idioma of ['es', 'en']) assert.doesNotMatch(sinHtml(ej.introduccion[idioma]), /×|%|constante/);
  assert.ok(Object.keys(ERRORES_PROPIOS).length > 0);
  assert.ok(F(1).equals(F(2, 2)));
});

test('reserva: ningún ítem es un caso de la hoja 2 o del examen 2, y las cotas del enunciado se cumplen', () => {
  [generarEsInversa, generarCompleta, generarProblema, generarCaza].forEach((g, n) => {
    for (const it of lote(g, 31 + n)) assert.equal(esReservado(it, n + 1), false);
  });
  for (const it of lote(generarCaza, 35)) if (it.ctx === 'receta') assert.ok(it.b <= 1000 && it.bien <= 1000 && (it.mal ?? 0) <= 1000);
  for (const it of lote(generarProblema, 36)) assert.ok(it.ctx !== 'grifos' || !/piscina|pool/.test(datoProblemaTx(it, 'es') + datoProblemaTx(it, 'en')));
});

test('textos: caballos, coche y mayúscula tras los dos puntos', () => {
  for (const it of lote(generarCaza, 37)) for (const idioma of ['es', 'en']) {
    assert.doesNotMatch(sinHtml(explicaCaza(it, { idioma })), /(Está mal|It is wrong): [A-ZÁÉÍÓÚ]/);
  }
  for (const it of lote(generarProblema, 38)) {
    if (it.ctx === 'caballos') assert.match(datoProblemaTx(it, 'es'), /todos comen lo mismo/);
    if (it.ctx === 'coche') assert.match(preguntaProblema(it, 'es'), /mismo viaje/);
  }
});

test('textos: con 1 la unidad va en singular y la resolución del ej. 4 no lleva viñetas sueltas', () => {
  const MAL = /(^|[^\d.,])1 (horas|días|hours|days)\b/;
  const textos = [];
  for (const it of lote(generarProblema, 31)) for (const i of ['es', 'en']) textos.push(sinHtml(datoProblemaTx(it, i)), sinHtml(explicaProblema(it, { idioma: i })));
  for (const it of lote(generarCaza, 32)) for (const i of ['es', 'en']) {
    const r = resolucionCaza(it, i);
    assert.ok(!/<ul(?![^>]*class="resolucion-lineas")/.test(r), 'ul sin clase con estilo');
    textos.push(sinHtml(enunciadoCaza(it, i)), sinHtml(r), sinHtml(explicaCaza(it, { idioma: i })));
  }
  for (const x of textos) assert.ok(!MAL.test(x), x);
  assert.ok(textos.some(x => /\b1 (hora|día|hour|day)\b/.test(x)), 'el 1 tiene que salir alguna vez');
});
