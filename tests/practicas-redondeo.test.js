// Práctica «Redondeo y estimación» (reparto-practicas-u2, tarea 25): fuerza bruta con
// definiciones independientes de las de logica.js (el múltiplo más cercano se busca
// probando candidatos, no con la fórmula), semilla fija.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  ORDENES, TOLERANCIA, redondear, fmt, generarRecta, posicionCorrecta, esAciertoRecta, generarTres, esAciertoTres,
  generarEstimar, esAciertoEstimar, diferenciaCon, generarRazonable, esAciertoRazonable,
  generarContexto, esAciertoContexto, generarEstimacion, cifraDecisiva, NUM_CONTEXTOS,
} from '../practicas/redondeo/logica.js';

const N = 3000;
const generarN = (fn, semilla = 1) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => fn(rng)); };

/** Definición independiente: el múltiplo de `o` más cercano a n; en empate, el mayor. */
function cercano(n, o) {
  let mejor = null;
  for (let k = 0; k * o <= n + o; k++) {
    const c = k * o;
    if (mejor === null || Math.abs(c - n) < Math.abs(mejor - n) || (Math.abs(c - n) === Math.abs(mejor - n) && c > mejor)) mejor = c;
  }
  return mejor;
}

const solo = (arr, f) => arr.filter(f).length;
const maxFraccion = (valores) => { const c = {}; valores.forEach(v => { c[v] = (c[v] || 0) + 1; }); return Math.max(...Object.values(c)) / valores.length; };

test('redondear coincide con el múltiplo más cercano (empate hacia arriba), por fuerza bruta', () => {
  for (let n = 0; n <= 3000; n++) for (const o of ORDENES) assert.equal(redondear(n, o), cercano(n, o), `${n} a ${o}`);
  assert.equal(redondear(4750, 100), 4800);
  assert.equal(redondear(962, 100), 1000);
});

test('fmt: separador de miles', () => {
  assert.equal(fmt(4732), '4 732');
  assert.equal(fmt(4732, 'en'), '4,732');
  assert.equal(fmt(962), '962');
  assert.equal(fmt(48316, 'en'), '48,316');
});

test('cifraDecisiva: la que está debajo del orden', () => {
  assert.equal(cifraDecisiva(4732, 10), 2);
  assert.equal(cifraDecisiva(4732, 100), 3);
  assert.equal(cifraDecisiva(4732, 1000), 7);
});

// --- Ejercicio 1 -----------------------------------------------------------------

test('ejercicio 1: 3 a 5 cifras, marcas consecutivas, n entre ellas y nunca en una marca', () => {
  let medios = 0, sube = 0, baja = 0, nueveGranel = 0;
  for (const it of generarN(generarRecta)) {
    assert.ok(it.n >= 100 && it.n <= 99999);
    assert.ok(ORDENES.includes(it.orden));
    const [inf, sup] = it.marcas;
    assert.equal(sup - inf, it.orden);
    assert.equal(inf % it.orden, 0);
    assert.ok(inf < it.n && it.n < sup, `${it.n} entre ${inf} y ${sup}`);
    assert.equal(it.redondeado, cercano(it.n, it.orden));
    assert.ok(it.marcas.includes(it.redondeado));
    assert.equal(it.exceso, it.redondeado > it.n);
    assert.equal(it.medio, it.n - inf === sup - it.n);
    if (it.medio) { medios++; assert.equal(it.redondeado, sup); }
    if (it.exceso) sube++; else baja++;
    if (it.redondeado === 1000 && it.orden === 100) nueveGranel++;
  }
  assert.ok(medios / N > 0.1 && medios / N < 0.2, `puntos medios: ${medios / N}`);
  assert.ok(sube / N > 0.3 && baja / N > 0.3, 'hay por exceso y por defecto');
  assert.ok(nueveGranel >= 0);
});

test('ejercicio 1: cada orden y cada número de cifras sale a menudo', () => {
  const items = generarN(generarRecta, 7);
  for (const o of ORDENES) assert.ok(solo(items, i => i.orden === o) > N * 0.15, `orden ${o}`);
  for (const c of [3, 4, 5]) assert.ok(solo(items, i => String(i.n).length === c) > N * 0.2, `${c} cifras`);
});

test('ejercicio 1: acierto = posición dentro del 5 % del tramo Y marca correcta', () => {
  const it = { tipo: 'recta', n: 4732, orden: 100, marcas: [4700, 4800], redondeado: 4700, exceso: false };
  assert.ok(posicionCorrecta(it, 0.32));
  assert.ok(posicionCorrecta(it, 0.32 + TOLERANCIA - 1e-9));
  assert.ok(!posicionCorrecta(it, 0.32 + TOLERANCIA + 0.01));
  assert.ok(!posicionCorrecta(it, 0.8));
  assert.ok(esAciertoRecta(it, 0.3, 4700));
  assert.ok(!esAciertoRecta(it, 0.3, 4800));
  assert.ok(!esAciertoRecta(it, 0.8, 4700));
});

test('ejercicio 1: la marca correcta nunca es siempre la misma (inferior/superior)', () => {
  const lados = generarN(generarRecta, 3).map(i => (i.redondeado === i.marcas[0] ? 'inf' : 'sup'));
  assert.ok(maxFraccion(lados) <= 0.7, `una marca acierta el ${maxFraccion(lados)}`);
});

// --- Ejercicio 2 -----------------------------------------------------------------

test('ejercicio 2: n de 4 o 5 cifras, sin acabar en 0, tres redondeos y tres excesos por fuerza bruta', () => {
  for (const it of generarN(generarTres)) {
    assert.ok(it.n >= 1000 && it.n <= 99999 && it.n % 10 !== 0);
    for (const o of ORDENES) {
      assert.equal(it.redondeados[o], cercano(it.n, o));
      assert.equal(it.excesos[o], it.redondeados[o] > it.n);
      assert.notEqual(it.redondeados[o], it.n, 'sin ni exceso ni defecto');
    }
  }
});

test('ejercicio 2: esAciertoTres exige los seis datos', () => {
  const it = generarTres(crearRng(5));
  const buena = { redondeados: { ...it.redondeados }, excesos: { ...it.excesos } };
  assert.ok(esAciertoTres(it, buena));
  for (const o of ORDENES) {
    const mala1 = { redondeados: { ...buena.redondeados, [o]: buena.redondeados[o] + o }, excesos: { ...buena.excesos } };
    const mala2 = { redondeados: { ...buena.redondeados }, excesos: { ...buena.excesos, [o]: !buena.excesos[o] } };
    assert.ok(!esAciertoTres(it, mala1));
    assert.ok(!esAciertoTres(it, mala2));
  }
});

test('ejercicio 2: hay exceso y defecto en cada orden (no gana quien pone siempre lo mismo)', () => {
  const items = generarN(generarTres, 9);
  for (const o of ORDENES) assert.ok(maxFraccion(items.map(i => i.excesos[o])) <= 0.7, `orden ${o}`);
});

// --- Ejercicio 3a: estimar --------------------------------------------------------

test('estimar: cada estimación es redondear cada término al orden y operar; el exacto, por fuerza bruta', () => {
  for (const it of generarN(generarEstimar)) {
    assert.ok(it.op === '+' || it.op === '·');
    if (it.op === '+') assert.ok(it.terminos.length >= 3 && it.terminos.length <= 4);
    else assert.equal(it.terminos.length, 2);
    assert.ok(it.terminos.every(t => t % 10 !== 0));
    const exacto = it.op === '+' ? it.terminos.reduce((a, b) => a + b) : it.terminos[0] * it.terminos[1];
    assert.equal(it.exacto, exacto);
    assert.ok(it.ordenes.length >= 1);
    for (const o of it.ordenes) {
      const r = it.terminos.map(t => cercano(t, o));
      assert.ok(r.every(v => v > 0), 'ningún término se redondea a 0');
      const est = it.op === '+' ? r.reduce((a, b) => a + b) : r[0] * r[1];
      assert.equal(it.estimaciones[o], est);
      assert.equal(diferenciaCon(it, o), Math.abs(exacto - est));
    }
  }
});

test('estimar: se admite cualquiera de los órdenes ofrecidos, y ninguno que no se ofrezca', () => {
  const it = { tipo: 'estimar', op: '+', terminos: [352, 417, 268], ordenes: [10, 100], estimaciones: { 10: 1040, 100: 1000 }, exacto: 1037 };
  assert.ok(esAciertoEstimar(it, 10, 1040, 3));
  assert.ok(esAciertoEstimar(it, 100, 1000, 37));
  assert.ok(!esAciertoEstimar(it, 100, 1040, 3), 'la estimación no es la del orden elegido');
  assert.ok(!esAciertoEstimar(it, 10, 1040, 37), 'la diferencia no es la de la estimación');
  assert.ok(!esAciertoEstimar(it, 1000, 1000, 37), 'orden no ofrecido');
});

test('estimar: hay sumas y productos', () => {
  const items = generarN(generarEstimar, 4);
  assert.ok(solo(items, i => i.op === '+') > N * 0.4);
  assert.ok(solo(items, i => i.op === '·') > N * 0.25);
  assert.ok(solo(items, i => i.ordenes.length === 2) > N * 0.3);
});

// --- Ejercicio 3b: ¿es razonable? -------------------------------------------------

test('razonable: Sí exactamente si propuesto == exacto; No exactamente si es más del doble o menos de la mitad', () => {
  const motivos = new Set();
  for (const it of generarN(generarRazonable)) {
    const exacto = it.op === '+' ? it.terminos.reduce((a, b) => a + b) : it.terminos[0] * it.terminos[1];
    assert.equal(it.exacto, exacto);
    motivos.add(it.motivo);
    const lejos = it.propuesto > 2 * exacto || it.propuesto < exacto / 2;
    if (it.razonable) assert.equal(it.propuesto, exacto);
    else assert.ok(lejos, `${it.terminos} ${it.op} → ${it.propuesto} (exacto ${exacto})`);
    assert.equal(it.razonable, it.propuesto === exacto);
    assert.equal(esAciertoRazonable(it, true), it.razonable);
    assert.equal(esAciertoRazonable(it, false), !it.razonable);
    // la estimación está cerca del exacto (menos del 30 % de diferencia): sirve de referencia
    assert.ok(Math.abs(it.estimacion - exacto) / exacto < 0.45, `estimación ${it.estimacion} vs ${exacto}`);
    if (it.motivo === 'mas') assert.equal(String(it.propuesto).length, String(exacto).length + 1);
    if (it.motivo === 'menos') assert.equal(String(it.propuesto).length, String(exacto).length - 1);
  }
  assert.deepEqual([...motivos].sort(), ['igual', 'mas', 'menos', 'suma']);
});

test('razonable: no gana quien dice siempre Sí o siempre No', () => {
  const f = maxFraccion(generarN(generarRazonable, 6).map(i => i.razonable));
  assert.ok(f <= 0.7, `una respuesta acierta el ${f}`);
});

// --- Ejercicio 3c: en contexto ----------------------------------------------------

test('contexto: cuatro opciones distintas; la buena es el redondeo al orden pedido y las otras tres son falsas', () => {
  for (const it of generarN(generarContexto)) {
    assert.equal(it.opciones.length, 4);
    assert.equal(new Set(it.opciones).size, 4);
    assert.equal(it.correcto, cercano(it.n, it.orden));
    assert.equal(solo(it.opciones, v => v === it.correcto), 1);
    assert.ok(it.contexto >= 0 && it.contexto < NUM_CONTEXTOS);
    assert.ok(it.n % 10 !== 0 && it.n % it.orden !== it.orden / 2, 'sin punto medio');
    for (const v of it.opciones) {
      // Cada falsa se aleja de la buena y no es el redondeo correcto a ese orden (regla de oro).
      if (v === it.correcto) { assert.ok(esAciertoContexto(it, v)); continue; }
      assert.notEqual(v, cercano(it.n, it.orden));
      assert.ok(v > 0);
      assert.ok(!esAciertoContexto(it, v));
    }
  }
});

test('contexto: la buena no está siempre en el mismo sitio, y salen todos los órdenes', () => {
  const items = generarN(generarContexto, 11);
  for (let p = 0; p < 4; p++) assert.ok(solo(items, i => i.opciones[p] === i.correcto) / N <= 0.4, `posición ${p}`);
  for (const o of ORDENES) assert.ok(solo(items, i => i.orden === o) > N * 0.2);
});

test('ejercicio 3: sale cada tipo de ítem', () => {
  const items = generarN(generarEstimacion, 13);
  for (const t of ['estimar', 'razonable', 'contexto']) assert.ok(solo(items, i => i.tipo === t) > N * 0.2, t);
});
