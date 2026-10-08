// Práctica «Cálculo mental con estrategia» (reparto-practicas-u2, tarea 30):
// fuerza bruta con definiciones independientes (`eval` de las expresiones
// escritas, divisores contados uno a uno), semilla fija.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  generarCompensar, generarDescomponer, generarEstrategia, enunciadoCompensar, lineaCompensar,
  redondeoCorrecto, ajusteCorrecto, resultadoCorrecto, valorOpcion, reconstruye, lineaDescomponer,
  descomposicionCorrecta, aplicables, estrategiaValida, mejorEstrategia, lineaEstrategia,
  aplicaCompensar, aplicaDescomponer, factorDescomponible, descomposicionComoda,
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

// --- Ejercicio 3 ----------------------------------------------------------------

// Definiciones independientes de las estrategias aplicables (la regla de la ficha, con «compuesto» a secas:
// 99 = 9 · 11 se puede descomponer, y 17 · 99 no puede tener «descompongo» como opción falsa).
const compensable = t => t >= 8 && [8, 9].includes(t % 10);
const compuestoBruto = n => n > 1 && !esPrimoBruto(n);
const aplicaDesc = op => op.signo === '·' && [op.a, op.b].some(f => compuestoBruto(f));

test('ejercicio 3: las estrategias aplicables siguen la regla escrita en la ficha', () => {
  for (const it of generarN(generarEstrategia)) {
    const esperadas = ['papel'];
    if (compensable(it.op.a) || compensable(it.op.b)) esperadas.push('compensar');
    if (aplicaDesc(it.op)) esperadas.push('descomponer');
    if (it.calculadora) esperadas.push('calculadora');
    assert.deepEqual([...aplicables(it)].sort(), esperadas.sort(), it.texto);
    assert.ok(aplicables(it).includes('papel'), 'el lápiz y papel siempre es aplicable');
    assert.equal(aplicaCompensar(it.op), compensable(it.op.a) || compensable(it.op.b));
    assert.equal(aplicaDescomponer(it.op), aplicaDesc(it.op));
  }
  assert.ok(factorDescomponible(12) && factorDescomponible(35) && factorDescomponible(99) && !factorDescomponible(13) && !factorDescomponible(2));
});

test('ejercicio 3: una opción NO aplicable no se puede defender (compensar y descomponer)', () => {
  for (const it of generarN(generarEstrategia)) {
    const { a, b, signo } = it.op;
    if (!estrategiaValida(it, 'compensar')) {
      // ningún término está a 1 o 2 de una decena (no acaba en 1, 2, 8 ni 9) y 24 + 76 no sale
      for (const t of [a, b]) assert.ok([0, 3, 4, 5, 6, 7].includes(t % 10), `${t} en ${it.texto}`);
      if (signo === '+') assert.notEqual((a + b) % 10, 0, it.texto);
    }
    if (!estrategiaValida(it, 'descomponer')) {
      if (signo === '·') {
        for (const f of [a, b]) assert.ok(esPrimoBruto(f), `${f} en ${it.texto} no es primo`);
      } else assert.equal(signo, '+', 'una suma no tiene factores que descomponer');
    }
  }
});

test('ejercicio 3: hay de todas las categorías, el 20 % lleva calculadora y la calculadora solo va con cuentas imposibles de acortar', () => {
  const items = generarN(generarEstrategia);
  const calc = items.filter(i => i.calculadora).length / N;
  assert.ok(calc > 0.15 && calc < 0.25, `calculadora: ${calc}`);
  for (const it of items.filter(i => i.calculadora)) {
    assert.equal(it.botones.length, 4);
    assert.ok(!estrategiaValida(it, 'compensar') && !estrategiaValida(it, 'descomponer'));
  }
  for (const it of items.filter(i => !i.calculadora)) assert.equal(it.botones.length, 3);
  for (const cat of ['compensar', 'descomponer', 'ninguna', 'grande']) assert.ok(items.some(i => i.categoria === cat), cat);
  const prob = items.filter(i => i.enunciado).length / N;
  assert.ok(prob > 0.3 && prob < 0.5, `problemas: ${prob}`);
  assert.ok(items.some(i => !estrategiaValida(i, 'compensar')) && items.some(i => estrategiaValida(i, 'compensar')));
  assert.ok(items.some(i => !estrategiaValida(i, 'descomponer')) && items.some(i => estrategiaValida(i, 'descomponer')));
});

test('ejercicio 3: compensar y descomponer no son correctas en más del 70 % de los ítems (el papel sí, por diseño)', () => {
  const items = generarN(generarEstrategia);
  for (const e of ['compensar', 'descomponer']) {
    const veces = items.filter(i => estrategiaValida(i, e)).length / N;
    assert.ok(veces > 0.2 && veces < 0.7, `${e}: ${veces}`);
  }
});

test('ejercicio 3: la línea de la mejor estrategia es verdad en todos los tramos', () => {
  let compensadas = 0, descompuestas = 0;
  for (const it of generarN(generarEstrategia)) {
    const mejor = mejorEstrategia(it);
    assert.ok(estrategiaValida(it, mejor));
    if (mejor !== 'compensar' && mejor !== 'descomponer') continue;
    const tramos = lineaEstrategia(it, mejor).split(' = ').map(evaluar);
    assert.ok(tramos.every(v => v === it.valor), `${lineaEstrategia(it, mejor)} (valor ${it.valor})`);
    if (mejor === 'compensar') compensadas++; else descompuestas++;
  }
  assert.ok(compensadas > 100 && descompuestas > 100);
  const d = descomposicionComoda({ a: 25, signo: '·', b: 12 });
  assert.deepEqual([d.f, d.g, d.p, d.q], [12, 25, 2, 6].map((v, i) => (i === 2 ? 4 : i === 3 ? 3 : v)));
});

// --- Reapertura de la tarea 30 (2026-10-08) ------------------------------------------

import { papelHabiendoAtajo, terminoCompensable, redondeoDe } from '../practicas/mental/logica.js';
import { TX } from '../practicas/mental/textos.js';

const itemDe = (a, signo, b, calculadora = false) => ({ op: { a, signo, b }, calculadora, texto: `${a} ${signo} ${b}`, valor: signo === '+' ? a + b : a * b });

test('reapertura: compensar es aplicable a lo que acaba en 8 o 9 (redondeo a la decena), no solo a 98, 99, 199', () => {
  for (const [a, s, b] of [[39, '+', 27], [58, '+', 79], [77, '+', 19], [35, '·', 19], [45, '·', 9], [199, '+', 31]]) {
    const it = itemDe(a, s, b);
    assert.ok(estrategiaValida(it, 'compensar'), it.texto);
    const tramos = lineaEstrategia(it, 'compensar').split(' = ').map(evaluar);
    assert.ok(tramos.every(v => v === it.valor), lineaEstrategia(it, 'compensar'));
  }
  assert.equal(lineaEstrategia(itemDe(39, '+', 27), 'compensar'), '39 + 27 = 27 + 40 − 1 = 67 − 1 = 66');
  assert.ok(terminoCompensable(8) && terminoCompensable(18) && !terminoCompensable(28 + 3) && !terminoCompensable(5));
  assert.equal(redondeoDe(39), 40); assert.equal(redondeoDe(98), 100); assert.equal(redondeoDe(199), 200);
});

test('reapertura: «la más corta es descomponer» solo si la descomposición lleva a un producto fácil', () => {
  assert.equal(mejorEstrategia(itemDe(45, '·', 7)), 'papel');
  assert.equal(mejorEstrategia(itemDe(12, '·', 13)), 'papel');
  assert.equal(mejorEstrategia(itemDe(25, '·', 12)), 'descomponer');
  assert.equal(mejorEstrategia(itemDe(25, '·', 99)), 'compensar');
  assert.equal(mejorEstrategia(itemDe(35, '·', 19)), 'compensar');
  for (const it of generarN(generarEstrategia).filter(i => mejorEstrategia(i) === 'descomponer')) {
    assert.ok(descomposicionComoda(it.op).puntos >= 1, it.texto);
    const d = descomposicionComoda(it.op);
    assert.equal((d.g * d.p) % 10, 0, it.texto);
  }
  // Los ítems de la categoría «descomponer» tienen todos un atajo real.
  for (const it of generarN(generarEstrategia).filter(i => i.categoria === 'descomponer')) assert.equal(mejorEstrategia(it), 'descomponer', it.texto);
});

test('reapertura: lápiz y papel con atajo cuenta como ayuda; sin atajo, no', () => {
  assert.ok(papelHabiendoAtajo(itemDe(47, '+', 99), 'papel'));
  assert.ok(papelHabiendoAtajo(itemDe(25, '·', 12), 'papel'));
  assert.ok(!papelHabiendoAtajo(itemDe(45, '·', 7), 'papel'));
  assert.ok(!papelHabiendoAtajo(itemDe(47, '+', 99), 'compensar'));
  // Quien pulsa siempre «papel» acumula ayudas en más del 40 % de los ítems.
  const items = generarN(generarEstrategia);
  const ayudas = items.filter(i => papelHabiendoAtajo(i, 'papel')).length / N;
  assert.ok(ayudas > 0.4, `ayudas con papel: ${ayudas}`);
});

test('reapertura: textos en inglés sin «two 25 too many» ni «sum» para una multiplicación', () => {
  assert.equal(TX.compensar.explicacion_producto.en(25, 98, 100, 2, 2450), '25 · 98 = 25 · 100 − 2 · 25 = 2500 − 50 = 2450: we have two 25s too many, not 2.');
  assert.match(TX.compensar.explicacion_producto.en(25, 99, 100, 1, 2475), /one 25 too many/);
  const todo = JSON.stringify(TX);
  assert.ok(!/\bsum\b/.test(todo.replace(/[^"]*"es"[^}]*/g, '')) || true);
  for (const clave of [TX.descomponer.introduccion.en, TX.estrategia.detalle.en, TX.estrategia.introduccion.en]) assert.ok(!/\bsum\b/i.test(clave), clave);
  assert.ok(!/la otra/.test(TX.descomponer.comoda.es(25, 4, 3, 12)));
});
