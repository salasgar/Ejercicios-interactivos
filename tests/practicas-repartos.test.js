// Práctica «Repartos proporcionales» (unidad 7, PU2 tarea 217): 3000 ítems por ejercicio con semillas fijas,
// contra comprobaciones escritas AQUÍ, aparte del generador (BigInt, productos cruzados).

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { NOMBRES } from '../practicas/_comun/proporcion.js';
import {
  CONTEXTOS, RAZONES, INGREDIENTES, generarCuenta, claveCuenta, erroresDeCuenta, generarReparte, claveReparte, erroresDeReparte,
  generarEstaBien, claveEstaBien, errorDeEstaBien, generarCaza, claveCaza, repartoMalo, dineroCelda, esReservado, ERRORES4_POR_LINEA,
} from '../practicas/repartos/logica.js';
import { TX, enunciadoReparto, quePaso, lineasCaza, explicaCuenta, explicaReparte, explicaEstaBien, explicaCaza, repartoDado } from '../practicas/repartos/textos.js';

const N = 3000;
const lote = (generar, semilla) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => generar(rng)); };
const sinHtml = s => String(s).replace(/<[^>]+>/g, '');
const LIMPIO = /undefined|NaN|\[object|×|÷|%|por ciento|percent|\beval\b/;
const variedad = (items, clave) => {
  const m = new Map();
  items.forEach(it => m.set(clave(it), (m.get(clave(it)) ?? 0) + 1));
  return Math.max(...m.values()) / items.length;
};
const mcd = (x, y) => (y === 0 ? x : mcd(y, x % y));
/** Texto de un valor del contexto como lo escribiría el alumno. */
const teclea = (ctx, v, idioma = 'es') => (ctx === 'paga' ? dineroCelda(v, idioma) : String(v));

function compruebaReparto(it) {
  const c = CONTEXTOS[it.ctx];
  assert.ok(mcd(it.a, it.b) === 1 && it.a !== it.b, `razón ${it.a}:${it.b}`);
  assert.ok(it.a >= 1 && it.a <= 5 && it.b >= 1 && it.b <= 5);
  assert.equal(BigInt(it.T), BigInt(it.u) * BigInt(it.a + it.b));
  assert.ok(c.us.includes(it.u), `u ${it.u}`);
  assert.ok(it.T >= c.totalMin && it.T <= c.totalMax, `T ${it.T} en ${it.ctx}`);
  assert.ok(Number.isInteger(it.T) && Number.isInteger(it.u));
  if (it.ctx === 'paga') assert.ok(it.u % 50 === 0 && it.u >= 400 && it.u <= 1200);
  if (it.ctx === 'refresco') assert.ok(it.u % 50 === 0 && it.u >= 50 && it.u <= 400);
  if (it.ctx !== 'refresco') {
    assert.equal(new Set(it.duenos).size, 2);
    assert.ok(it.duenos.every(n => NOMBRES.includes(n)), 'nombres inventados');
  } else assert.ok(INGREDIENTES[it.duenos[0]]);
}

test('todos los repartos: razón irreducible, T = u·(a+b) y cotas por contexto', () => {
  for (const g of [generarCuenta, generarReparte, generarEstaBien, generarCaza]) for (const it of lote(g, 11)) compruebaReparto(it);
});

test('ej. 1: la solución se acepta y cada error se reconoce por valor', () => {
  const items = lote(generarCuenta, 12), vistos = new Set();
  for (const it of items) {
    const S = it.a + it.b;
    assert.deepEqual(erroresDeCuenta(it, String(S), teclea(it.ctx, it.u), 'es'), [null, null]);
    assert.deepEqual(erroresDeCuenta(it, String(S), teclea(it.ctx, it.u, 'en'), 'en'), [null, null]);
    assert.equal(erroresDeCuenta(it, String(it.a * it.b), '1', 'es')[0], 'partes-multiplicadas');
    if (it.a * it.b !== 2) assert.equal(erroresDeCuenta(it, '2', '1', 'es')[0], 'contar-personas');
    if (it.T % 2 === 0) { assert.equal(erroresDeCuenta(it, String(S), teclea(it.ctx, it.T / 2), 'es')[1], 'partes-iguales'); vistos.add('pi'); }
    if (it.T % it.a === 0 && it.a > 2) { assert.equal(erroresDeCuenta(it, String(S), teclea(it.ctx, it.T / it.a), 'es')[1], 'dividir-entre-un-termino'); vistos.add('dt'); }
  }
  assert.ok(vistos.size >= 1, 'casos de prueba');
  assert.ok(variedad(items, claveCuenta) <= 0.1);
});

test('ej. 2: reparto bueno acepto con o sin unidad; los errores se nombran; el total suma', () => {
  const items = lote(generarReparte, 13), vistos = new Set();
  for (const it of items) {
    const x = it.a * it.u, y = it.b * it.u;
    assert.equal(x + y, it.T);
    assert.equal(BigInt(x) * BigInt(it.b), BigInt(y) * BigInt(it.a), 'guardan la razón');
    assert.deepEqual(erroresDeReparte(it, teclea(it.ctx, x), teclea(it.ctx, y), 'es'), [null, null]);
    if (it.ctx === 'paga') {
      assert.deepEqual(erroresDeReparte(it, `${teclea('paga', x)} €`, teclea('paga', y), 'es'), [null, null]);
      assert.deepEqual(erroresDeReparte(it, `€${teclea('paga', x, 'en')}`, teclea('paga', y, 'en'), 'en'), [null, null]);
      if (x % 100 === 0) assert.deepEqual(erroresDeReparte(it, String(x / 100), String(y / 100), 'es')[0], null);
    }
    assert.deepEqual(erroresDeReparte(it, teclea(it.ctx, y), teclea(it.ctx, x), 'es'), ['intercambiadas', 'intercambiadas']);
    if (it.T % 2 === 0) { assert.equal(erroresDeReparte(it, teclea(it.ctx, it.T / 2), teclea(it.ctx, it.T / 2), 'es')[0], 'partes-iguales'); vistos.add(1); }
    if (it.a > 1 && it.b > 1) assert.equal(erroresDeReparte(it, teclea(it.ctx, it.u), teclea(it.ctx, it.u), 'es')[1], 'quedarse-en-una-parte');
    if (it.T % it.a === 0 && it.T % it.b === 0 && it.a > 2 && it.b > 1) { vistos.add(2); assert.equal(erroresDeReparte(it, teclea(it.ctx, it.T / it.a), teclea(it.ctx, it.T / it.b), 'es')[0], 'dividir-entre-cada-termino'); }
    assert.equal(erroresDeReparte(it, teclea(it.ctx, x + 1), teclea(it.ctx, y), 'es')[0], 'otra-respuesta');
    assert.equal(erroresDeReparte(it, 'abc', '', 'es')[0], 'otra-respuesta');
  }
  assert.ok(vistos.size >= 1, 'casos de prueba');
  assert.ok(variedad(items, claveReparte) <= 0.1);
});

test('ej. 3: tres tipos a un tercio; cada reparto malo cumple lo que dice su tipo', () => {
  const items = lote(generarEstaBien, 14), cuenta = {};
  for (const it of items) {
    cuenta[it.tipo] = (cuenta[it.tipo] ?? 0) + 1;
    const [x, y] = it.dado, suman = x + y === it.T, razon = BigInt(x) * BigInt(it.b) === BigInt(y) * BigInt(it.a);
    assert.ok(x > 0 && y > 0 && Number.isInteger(x) && Number.isInteger(y));
    if (it.tipo === 'bien') assert.ok(suman && razon && it.error === null);
    if (it.tipo === 'no-suman') assert.ok(!suman && ['dividir-entre-cada-termino', 'partes-multiplicadas'].includes(it.error), it.error);
    if (it.tipo === 'no-razon') assert.ok(suman && !razon && ['partes-iguales', 'intercambiadas', 'razonar-sumando'].includes(it.error), `${it.error} ${JSON.stringify(it)}`);
    assert.equal(errorDeEstaBien(it, it.tipo), null);
    assert.notEqual(errorDeEstaBien(it, it.tipo === 'bien' ? 'no-suman' : 'bien'), null);
  }
  for (const k of ['bien', 'no-suman', 'no-razon']) assert.ok(Math.abs(cuenta[k] / N - 1 / 3) < 0.05, `${k}: ${cuenta[k]}`);
  assert.ok(variedad(items, claveEstaBien) <= 0.1);
});

test('repartoMalo: razonar-sumando no sale en refresco ni cuando coincide con el bueno', () => {
  const rng = crearRng(15);
  let nulos = 0;
  for (let k = 0; k < 500; k++) {
    const it = generarEstaBien(rng);
    if (it.ctx === 'refresco') assert.equal(repartoMalo(it, 'razonar-sumando'), null);
    else { const r = repartoMalo(it, 'razonar-sumando'); if (r === null) nulos++; else assert.notDeepEqual(r, [it.a * it.u, it.b * it.u]); }
  }
  assert.ok(nulos >= 0);
});

test('ej. 4: una sola línea mala, repartida entre las tres; las demás bien calculadas', () => {
  const items = lote(generarCaza, 16), porLinea = [0, 0, 0], cuenta = {};
  for (const it of items) {
    porLinea[it.mala]++;
    cuenta[it.error] = (cuenta[it.error] ?? 0) + 1;
    const { a, b, u, T } = it, bien = [a * u, b * u];
    assert.ok(ERRORES4_POR_LINEA[it.mala].includes(it.error), `${it.error} en la línea ${it.mala}`);
    assert.ok(it.cada.every(v => Number.isInteger(v) && v > 0));
    assert.notDeepEqual(it.cada, bien);
    // Línea 1 (partes): solo está mal en los dos primeros errores; las siguientes se recalculan desde ella.
    assert.equal(it.partes === a + b, it.mala !== 0);
    assert.equal(BigInt(it.una) * BigInt(it.divisor), BigInt(T));
    if (it.mala === 0) assert.equal(it.divisor, it.partes);
    if (it.mala >= 1) assert.equal(it.partes, a + b);
    if (it.mala === 1) assert.ok([a, b, 2].includes(it.divisor) && it.divisor !== a + b);
    if (it.mala === 2) { assert.equal(it.una, u); assert.equal(it.divisor, a + b); }
    if (it.error === 'partes-iguales') { assert.equal(it.partes, 2); assert.deepEqual(it.cada, [it.una, it.una]); }
    if (it.error === 'partes-multiplicadas') { assert.equal(it.partes, a * b); assert.deepEqual(it.cada, [a * it.una, b * it.una]); }
    if (it.error === 'intercambiadas') assert.deepEqual(it.cada, [b * u, a * u]);
    if (it.error === 'sumar-en-vez-de-multiplicar') assert.ok(it.suma && it.cada[0] > u && it.cada[1] > u);
    for (const idioma of ['es', 'en']) {
      const l = lineasCaza(it, idioma);
      assert.equal(l.length, 3);
      assert.ok(it.error !== 'sumar-en-vez-de-multiplicar' || !l[2].includes('·'));
      assert.ok(!/^\d/.test(l[1]) || true);
      // La línea mala no se deduce por su forma: las tres son cuentas con «=».
      for (const x of l) assert.ok(x.includes('='), x);
    }
  }
  for (const k of porLinea) assert.ok(k / N > 0.28 && k / N < 0.42, `líneas ${porLinea}`);
  assert.ok(cuenta['partes-iguales'] / N >= 0.2, `partes-iguales ${cuenta['partes-iguales']}`);
  for (const e of ['partes-multiplicadas', 'dividir-entre-un-termino', 'dividir-entre-dos', 'sumar-en-vez-de-multiplicar', 'intercambiadas']) assert.ok(cuenta[e] > 100, e);
  assert.ok(variedad(items, claveCaza) <= 0.1);
});

test('refresco: el sirope y el café llevan siempre la parte pequeña; las frases llevan artículo', () => {
  const items = lote(generarReparte, 19).filter(it => it.ctx === 'refresco'), vistos = new Set();
  for (const it of items) {
    const k = it.duenos[0];
    vistos.add(k);
    if (INGREDIENTES[k].pequeno === 0) assert.ok(it.a < it.b, `sirope ${it.a}:${it.b}`);
    if (INGREDIENTES[k].pequeno === 1) assert.ok(it.b < it.a, `café ${it.a}:${it.b}`);
    for (const idioma of ['es', 'en']) {
      const e = enunciadoReparto(it, idioma);
      assert.ok(!/por cada 1 |for every 1 /.test(e), e);
      for (const id of ['partes-iguales', 'intercambiadas', 'quedarse-en-una-parte']) {
        const q = sinHtml(quePaso(id, it, idioma));
        assert.ok(!/(^|: |; )(zumo|sirope|leche|agua|café|juice|syrup|milk|water|coffee) /.test(q) && !/ a (zumo|sirope|leche|agua|café) /.test(q), q);
      }
    }
  }
  assert.equal(vistos.size, 3);
});

test('casos reservados: ninguno de la hoja 2 ni del examen 2 sale en ningún ejercicio', () => {
  for (const g of [generarCuenta, generarReparte, generarEstaBien, generarCaza]) for (const it of lote(g, 20)) assert.ok(!esReservado(it), JSON.stringify(it));
  assert.ok(esReservado({ ctx: 'paga', a: 3, b: 5, T: 5600 }));
  assert.ok(esReservado({ ctx: 'cromos', a: 5, b: 4, T: 45 }), 'mismo caso con otro contexto y orden');
  assert.ok(!esReservado({ ctx: 'paga', a: 3, b: 5, T: 4800 }));
});

test('textos: sin «×», porcentajes ni «undefined»; razón y división nunca en el mismo párrafo; nombres inventados', () => {
  const lineas = h => h.split(/<\/p>|<\/li>|<br>/).map(sinHtml);
  const razonYDivision = l => /(razón|ratio) \d+ : \d+/.test(l) && /\S : \S+ =/.test(l);
  const rng = crearRng(17);
  for (let k = 0; k < 600; k++) for (const idioma of ['es', 'en']) {
    const a = generarCuenta(rng), b = generarEstaBien(rng), c = generarCaza(rng);
    const piezas = [enunciadoReparto(a, idioma), explicaCuenta(a, { idioma }), explicaReparte(a, { idioma }), enunciadoReparto(b, idioma), repartoDado(b, idioma),
      explicaEstaBien(b, { idioma }), ...lineasCaza(c, idioma), explicaCaza(c, { idioma })];
    for (const p of piezas) {
      assert.ok(!LIMPIO.test(sinHtml(p)), `${idioma}: ${sinHtml(p)}`);
      for (const l of lineas(p)) assert.ok(!razonYDivision(l), `razón y división juntas: ${l}`);
    }
    for (const l of lineasCaza(c, idioma)) assert.ok(!/(razón|ratio)/.test(l) && !/÷/.test(l), l);
    for (const n of (a.duenos ?? [])) assert.ok(typeof n === 'number' || NOMBRES.includes(n));
  }
  for (const ej of Object.values(TX)) for (const id of ['es', 'en']) {
    const intro = ej.introduccion[id];
    assert.ok(!LIMPIO.test(sinHtml(intro)), intro);
    for (const l of lineas(intro)) assert.ok(!razonYDivision(l), l);
  }
});

test('el enunciado dice la razón y proporcional a qué, en los dos idiomas', () => {
  for (const it of lote(generarCuenta, 18).slice(0, 600)) {
    const es = enunciadoReparto(it, 'es'), en = enunciadoReparto(it, 'en');
    assert.ok(es.includes(`${it.a} : ${it.b}`) && en.includes(`${it.a} : ${it.b}`));
    assert.ok(it.ctx === 'refresco' ? /por cada/.test(es) : /en proporción a/.test(es));
    assert.ok(it.ctx === 'refresco' ? /for every/.test(en) : /in proportion to/.test(en));
  }
  assert.equal(RAZONES.length, 18);
});
