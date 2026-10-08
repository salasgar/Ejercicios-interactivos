// Práctica «Distributiva con rectángulos» (reparto-practicas-u2, tarea 27):
// fuerza bruta con definiciones independientes (sumas de celdas, `eval` de la
// expresión escrita), semilla fija.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  generarPartir, generarFactorValido, generarCompensar, corteCorrecto, totalCorrecto, igualdad,
  juntarCorrecto, formasValidas, textoFichas, sumaDeProductos, compensarCorrecto, enunciadoCompensar,
  leerEntero, fmt, valorFichas,
} from '../practicas/distributiva/logica.js';

const N = 3000;
const generarN = (fn, n = N, semilla = 1) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };

/** Evalúa «25 · 100 − 25» con el operador de JavaScript, independiente de logica.js. */
const evaluar = expr => Function(`"use strict"; return (${expr.replaceAll('·', '*').replaceAll('−', '-')});`)();

// Área contada celda a celda.
const celdas = (filas, columnas) => { let n = 0; for (let f = 0; f < filas; f++) for (let c = 0; c < columnas; c++) n++; return n; };

// --- Ejercicio 1 -------------------------------------------------------------------

test('ejercicio 1: el rectángulo cabe, el corte está dentro y el total es el área de las celdas', () => {
  for (const it of generarN(generarPartir)) {
    assert.ok(it.a >= 2 && it.a <= 9);
    assert.ok(it.largo <= 20 && it.largo >= 3);
    assert.ok(it.b >= 1 && it.c >= 1);
    assert.ok(it.corte >= 1 && it.corte <= it.largo - 1);
    if (it.resta) {
      assert.equal(it.largo, it.b);
      assert.equal(it.corte, it.b - it.c);
      assert.equal(it.solucion, celdas(it.a, it.corte));
      // a · (b − c) = a · b − a · c
      assert.equal(it.solucion, celdas(it.a, it.b) - celdas(it.a, it.c));
    } else {
      assert.equal(it.largo, it.b + it.c);
      assert.equal(it.corte, it.b);
      assert.equal(it.solucion, celdas(it.a, it.b) + celdas(it.a, it.c));
      assert.equal(it.solucion, celdas(it.a, it.largo));
    }
  }
});

test('ejercicio 1: hay restas (en torno al 30 %) y sumas', () => {
  const items = generarN(generarPartir);
  const restas = items.filter(i => i.resta).length / N;
  assert.ok(restas > 0.2 && restas < 0.4, `restas: ${restas}`);
});

test('ejercicio 1: corte y total, solo lo exacto', () => {
  const it = { a: 4, b: 6, c: 3, resta: false, largo: 9, corte: 6, solucion: 36 };
  assert.ok(corteCorrecto(it, 6));
  assert.ok(corteCorrecto(it, 3), 'con la suma vale cortar con 3 a la izquierda: 3 + 6');
  assert.ok(!corteCorrecto(it, 4));
  assert.ok(totalCorrecto(it, '36'));
  assert.ok(!totalCorrecto(it, '24'));
  // con la resta, el trozo de la derecha es el que se quita: solo vale un corte
  const r = { a: 4, b: 9, c: 3, resta: true, largo: 9, corte: 6, solucion: 24 };
  assert.ok(corteCorrecto(r, 6));
  assert.ok(!corteCorrecto(r, 3));
});

test('ejercicio 1: con la suma, todo corte válido parte el lado en {b, c} y da el mismo total; con la resta, solo uno', () => {
  for (const it of generarN(generarPartir)) {
    const validos = [];
    for (let p = 1; p < it.largo; p++) if (corteCorrecto(it, p)) validos.push(p);
    if (it.resta) assert.deepEqual(validos, [it.b - it.c]);
    else {
      // definición independiente: el corte reparte las celdas en dos trozos de tamaño {b, c}
      const buenos = [];
      for (let p = 1; p < it.largo; p++) if ((p === it.b && it.largo - p === it.c) || (p === it.c && it.largo - p === it.b)) buenos.push(p);
      assert.deepEqual(validos, buenos);
    }
  }
});

test('leerEntero y fmt: separadores de miles, nunca decimales ni negativos', () => {
  for (const t of ['1188', '1.188', '1,188', '1 188', '1 188', ' 1188 ']) assert.equal(leerEntero(t), 1188, t);
  for (const t of ['1.18', '1,1', '-5', '', 'abc', '1..188', '11.88']) assert.equal(leerEntero(t), null, t);
  assert.equal(fmt(2475), '2 475');
  assert.equal(fmt(2475, 'en'), '2,475');
  assert.equal(fmt(99), '99');
  for (const n of [1000, 2475, 5940, 99999]) {
    assert.equal(leerEntero(fmt(n, 'es')), n);
    assert.equal(leerEntero(fmt(n, 'en')), n);
  }
  assert.ok(compensarCorrecto({ valor: 1188 }, '1.188') && compensarCorrecto({ valor: 1188 }, '1188') && !compensarCorrecto({ valor: 1188 }, '1.18'));
});

test('ejercicio 1 y 2: ningún tramo de la igualdad es largo (cabe en 375 px dentro de un .cuenta)', () => {
  let max = 0;
  for (const it of generarN(generarPartir, 3000)) for (const t of igualdad(it).split(' = ')) max = Math.max(max, t.length);
  for (const it of generarN(generarFactorValido, 3000, 2)) for (const t of igualdad(it).split(' = ')) max = Math.max(max, t.length);
  assert.ok(max <= 22, `tramo más largo: ${max} caracteres`);
});

test('ejercicio 1: la igualdad escrita evalúa a lo mismo en todos los tramos', () => {
  for (const it of generarN(generarPartir, 500)) {
    const partes = igualdad(it).split(' = ');
    const valores = partes.map(evaluar);
    assert.equal(partes.length, 4);
    assert.ok(valores.every(v => v === it.solucion), igualdad(it));
  }
  assert.equal(igualdad({ a: 4, b: 6, c: 3, resta: false }), '4 · (6 + 3) = 4 · 6 + 4 · 3 = 24 + 12 = 36');
});

// --- Ejercicio 2 -------------------------------------------------------------------

test('ejercicio 2: b y c distintos, restas con b > c, ambos tipos presentes, 30 % de restas', () => {
  const items = generarN(generarFactorValido);
  for (const it of items) {
    assert.notEqual(it.b, it.c);
    if (it.resta) assert.ok(it.b > it.c);
    assert.equal(it.valor, it.resta ? it.a * it.b - it.a * it.c : it.a * it.b + it.a * it.c);
  }
  const restas = items.filter(i => i.resta).length / N;
  assert.ok(restas > 0.2 && restas < 0.4, `restas: ${restas}`);
  assert.ok(items.some(i => i.tipo === 'juntar') && items.some(i => i.tipo === 'factor'));
});

test('ejercicio 2 (factor): la correcta vale lo mismo y las otras tres, distinto (regla de oro)', () => {
  for (const it of generarN(generarFactorValido).filter(i => i.tipo === 'factor')) {
    assert.equal(it.opciones.length, 4);
    const buenas = it.opciones.filter(o => o.correcta);
    assert.equal(buenas.length, 1);
    for (const o of it.opciones) {
      const v = evaluar(o.expr);
      assert.equal(v, o.valor, o.expr);
      if (o.correcta) assert.equal(v, it.valor, o.expr);
      else assert.notEqual(v, it.valor, `${o.expr} vale lo mismo que ${it.valor}`);
    }
    assert.equal(new Set(it.opciones.map(o => o.valor)).size, 4);
  }
});

test('ejercicio 2 (factor): ninguna posición es la correcta en más del 70 %', () => {
  const items = generarN(generarFactorValido).filter(i => i.tipo === 'factor');
  for (let pos = 0; pos < 4; pos++) {
    const veces = items.filter(i => i.opciones[pos].correcta).length / items.length;
    assert.ok(veces < 0.4, `posición ${pos}: ${veces}`);
  }
});

test('ejercicio 2 (juntar): las formas válidas evalúan al valor y las ficticias no se aceptan', () => {
  for (const it of generarN(generarFactorValido, 500).filter(i => i.tipo === 'juntar')) {
    assert.equal(new Set(it.fichas).size, 7);
    assert.deepEqual([...it.fichas].sort(), ['(', ')', P_(), 'a', 'b', 'c', it.resta ? '−' : '+'].sort());
    for (const forma of formasValidas(it)) {
      const fichas = forma.split(' ');
      assert.ok(juntarCorrecto(it, fichas));
      assert.equal(evaluar(textoFichas(it, fichas)), it.valor);
    }
  }
  const it = { a: 6, b: 7, c: 3, resta: false };
  assert.ok(juntarCorrecto(it, ['a', '·', '(', 'b', '+', 'c', ')']));
  assert.ok(juntarCorrecto(it, ['(', 'c', '+', 'b', ')', '·', 'a']));
  assert.ok(!juntarCorrecto(it, ['a', '·', 'b', '+', 'c']));
  assert.ok(!juntarCorrecto(it, ['a', '+', '(', 'b', '·', 'c', ')']));
  const r = { a: 6, b: 7, c: 3, resta: true };
  assert.ok(juntarCorrecto(r, ['a', '·', '(', 'b', '−', 'c', ')']));
  assert.ok(!juntarCorrecto(r, ['a', '·', '(', 'c', '−', 'b', ')']), '3 − 7 no es lo mismo');
  assert.equal(textoFichas(it, ['a', '·', '(', 'b', '+', 'c', ')']), '6 · (7 + 3)');
  assert.equal(sumaDeProductos(it), '6 · 7 + 6 · 3');
});

function P_() { return '·'; }

/** Todas las permutaciones de una lista (para probar todas las respuestas posibles con las 7 fichas). */
function permutaciones(lista) {
  if (lista.length <= 1) return [lista];
  return lista.flatMap((x, i) => permutaciones([...lista.slice(0, i), ...lista.slice(i + 1)]).map(r => [x, ...r]));
}

test('ejercicio 2 (juntar): toda respuesta que se VE igual que una válida es válida, también con a = b o a = c', () => {
  const todos = generarN(generarFactorValido, 6000).filter(i => i.tipo === 'juntar');
  const colision = todos.filter(i => i.a === i.b || i.a === i.c);
  assert.ok(colision.length >= 100, `ítems con colisión: ${colision.length}`);
  const muestra = [...colision.slice(0, 60), ...todos.filter(i => i.a !== i.b && i.a !== i.c).slice(0, 20)];
  for (const it of muestra) {
    // definición independiente: lo que se ve, escrito desde los números, no desde las letras
    const op = it.resta ? '−' : '+';
    const buenos = new Set([`${it.a} · (${it.b} ${op} ${it.c})`, `(${it.b} ${op} ${it.c}) · ${it.a}`]);
    if (!it.resta) { buenos.add(`${it.a} · (${it.c} + ${it.b})`); buenos.add(`(${it.c} + ${it.b}) · ${it.a}`); }
    for (const fichas of permutaciones(it.fichas)) {
      const visto = textoFichas(it, fichas);
      assert.equal(juntarCorrecto(it, fichas), buenos.has(visto), `${visto} (${fichas.join(' ')})`);
    }
  }
});

test('ejercicio 2 (juntar): lo que vale lo escrito es su valor, y lo incompleto da null', () => {
  const it = { a: 6, b: 7, c: 3, resta: false };
  assert.equal(valorFichas(it, ['a', '·', '(', 'b', '+', 'c', ')']), 60);
  assert.equal(valorFichas(it, ['a', '+', '(', 'b', '·', 'c', ')']), 27);
  assert.equal(valorFichas(it, ['a', '·', 'b', '+', 'c']), 45);
  assert.equal(valorFichas(it, ['a', '·', '(', 'b', '+', 'c']), null);
  assert.equal(valorFichas(it, ['(', 'a', '+', ')']), null);
  assert.equal(valorFichas(it, ['a', '+', 'b', ')', '·', '(', 'c']), null, 'paréntesis desbalanceados');
  for (const x of generarN(generarFactorValido, 300).filter(i => i.tipo === 'juntar')) {
    for (const fichas of permutaciones(x.fichas).filter((_, k) => k % 97 === 0)) {
      const v = valorFichas(x, fichas);
      assert.ok(v === null || Number.isFinite(v));
      if (v !== null) assert.equal(v, evaluar(textoFichas(x, fichas)), textoFichas(x, fichas));
    }
  }
});

// --- Ejercicio 3 -------------------------------------------------------------------

test('ejercicio 3: el valor es el de la cuenta y la buena escritura lo da', () => {
  const items = generarN(generarCompensar);
  for (const it of items) {
    assert.ok(it.k === 99 || it.k === 98);
    assert.equal(it.valor, it.tipo === 'producto' ? it.n * it.k : it.n + it.k);
    assert.equal(evaluar(enunciadoCompensar(it)), it.valor);
    assert.equal(it.opciones.length, 3);
    assert.equal(it.opciones.filter(o => o.correcta).length, 1);
    for (const o of it.opciones) {
      const v = evaluar(o.expr);
      assert.equal(v, o.valor, o.expr);
      if (o.correcta) assert.equal(v, it.valor, o.expr);
      else assert.notEqual(v, it.valor, `${o.expr} vale lo mismo que ${enunciadoCompensar(it)}`);
    }
    assert.equal(new Set(it.opciones.map(o => o.valor)).size, 3);
  }
  assert.ok(items.some(i => i.tipo === 'producto') && items.some(i => i.tipo === 'suma'));
  assert.ok(items.some(i => i.k === 98) && items.some(i => i.k === 99));
});

test('ejercicio 3: 25 · 99 = 25 · 100 − 25 y los dos errores típicos siguen siendo errores', () => {
  const it = { tipo: 'producto', n: 25, k: 99, valor: 2475 };
  assert.ok(compensarCorrecto(it, '2475'));
  assert.ok(!compensarCorrecto(it, 2500));
  assert.equal(evaluar('25 · 100 − 25'), 2475);
  assert.notEqual(evaluar('25 · 100 − 1'), 2475);
  assert.notEqual(evaluar('25 · 100 − 100'), 2475);
});

test('ejercicio 3: ninguna posición es la correcta en más del 70 %', () => {
  const items = generarN(generarCompensar);
  for (let pos = 0; pos < 3; pos++) {
    const veces = items.filter(i => i.opciones[pos].correcta).length / items.length;
    assert.ok(veces < 0.5, `posición ${pos}: ${veces}`);
  }
});
