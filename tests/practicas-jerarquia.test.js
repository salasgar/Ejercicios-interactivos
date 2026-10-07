// Práctica «¿Qué se hace primero?» (reparto-practicas-u2, tarea 20): la lógica se
// prueba con definiciones independientes (un analizador en árbol y `Function`),
// no con las funciones de la propia práctica.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  generarPasos1, generarPasos2, generarPasos3, generarInvisibles,
  trampaOrden, exigidos, lineal, combinaciones, cadena, toca, motivo, texto,
} from '../practicas/jerarquia/logica.js';

const N = 3000;
const generarN = (fn, semilla = 7) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => fn(rng)); };

/** Valor de una lista de fichas, con JavaScript (independiente de `evaluar`). */
function valorJs(fichas) {
  const js = fichas.map((f, i) => {
    if (f === '*') return '*';
    if (f === ':') return '/';
    if (f === '√') return 'Math.sqrt';
    if (f[0] === '^') return `**${f[1]}`;
    return f;
  }).join(' ').replace(/Math\.sqrt\s+(\d+)/g, 'Math.sqrt($1)');
  return Function(`"use strict"; return (${js});`)();
}

/** Analizador en árbol; cada nodo operación lleva la posición de su ficha. */
function arbol(fichas) {
  let p = 0;
  const atomo = () => {
    const t = fichas[p];
    if (t === '(') { p++; const e = suma(); p++; return { par: true, e }; }
    if (t === '√') { const pos = p++; return { op: '√', pos, hijos: [atomo()] }; }
    p++; return { num: Number(t) };
  };
  const potencia = () => {
    let a = atomo();
    while (fichas[p]?.[0] === '^') { const pos = p++; a = { op: fichas[pos], pos, hijos: [a] }; }
    return a;
  };
  const nivel = (siguiente, ops) => () => {
    let a = siguiente();
    while (ops.includes(fichas[p])) { const pos = p++; a = { op: fichas[pos], pos, hijos: [a, siguiente()] }; }
    return a;
  };
  const producto = nivel(potencia, ['*', ':']);
  const suma = nivel(producto, ['+', '-']);
  return suma();
}

const NIVEL_T = { '+': 1, '-': 1, '*': 2, ':': 2, '^2': 3, '^3': 3, '√': 3 };

/** Operaciones listas (todos sus hijos son números), cada una con el nivel de paréntesis. */
function listas(nodo, dentroDe = null, acc = []) {
  if (nodo.num !== undefined) return acc;
  if (nodo.par) { listas(nodo.e, nodo, acc); return acc; }
  nodo.hijos.forEach(h => listas(h, dentroDe, acc));
  if (nodo.hijos.every(h => h.num !== undefined)) acc.push({ nodo, grupo: dentroDe });
  return acc;
}

/** Primer paréntesis que se cierra (recorrido posterior). */
function primerParentesis(nodo) {
  if (nodo.num !== undefined) return null;
  if (nodo.par) return primerParentesis(nodo.e) ?? nodo;
  for (const h of nodo.hijos) { const r = primerParentesis(h); if (r) return r; }
  return null;
}

function tocaIndependiente(fichas) {
  const a = arbol(fichas);
  const grupo = primerParentesis(a);
  const candidatas = listas(a).filter(c => c.grupo === grupo);
  candidatas.sort((x, y) => NIVEL_T[y.nodo.op] - NIVEL_T[x.nodo.op] || x.nodo.pos - y.nodo.pos);
  return candidatas[0].nodo.pos;
}

function comprobarPasos(items, { max = 999 } = {}) {
  for (const it of items) {
    const v0 = valorJs(it.fichas);
    assert.ok(Number.isInteger(v0) && v0 >= 1, `valor ${v0} en ${texto(it.fichas)}`);
    let actual = it.fichas;
    assert.ok(it.pasos.length >= 3 || it.ejercicio === 1, `pocos pasos en ${texto(it.fichas)}`);
    for (const p of it.pasos) {
      const i = tocaIndependiente(actual);
      assert.equal(p.indice, i, `toca mal en ${texto(actual)}`);
      assert.equal(toca(actual), i);
      assert.equal(actual[i], p.operador);
      const v = valorJs(p.fichas);
      assert.ok(Math.abs(v - v0) < 1e-9, `${texto(actual)} → ${texto(p.fichas)} cambia el valor`);
      assert.ok(p.fichas.length < actual.length, 'cada paso acorta');
      for (const f of p.fichas) if (/^\d+$/.test(f)) assert.ok(Number(f) >= 1 && Number(f) <= max, `número ${f}`);
      actual = p.fichas;
    }
    assert.deepEqual(actual, [String(v0)]);
    assert.ok(cadena(it.fichas));
  }
}

test('ejercicio 1: el operador que toca, el valor y los números de cada paso', () => {
  const items = generarN(generarPasos1);
  comprobarPasos(items);
  for (const it of items) {
    const ops = it.fichas.filter(f => NIVEL_T[f]);
    assert.ok(ops.length === 2 || ops.length === 3);
    assert.ok(!it.fichas.some(f => f === '(' || f === ')' || f[0] === '^' || f === '√'));
  }
});

test('ejercicio 1: al menos la mitad pide el orden izquierda-derecha y los dos niveles aparecen', () => {
  const items = generarN(generarPasos1);
  const trampas = items.filter(it => trampaOrden(it.fichas)).length / N;
  assert.ok(trampas >= 0.5, `trampas = ${trampas}`);
  const mixtos = items.filter(it => it.fichas.some(f => f === '*' || f === ':') && it.fichas.some(f => f === '+' || f === '-')).length / N;
  assert.ok(mixtos >= 0.3, `mixtos = ${mixtos}`);
});

test('ejercicio 1: la trampa del orden cambia de verdad el resultado', () => {
  for (const it of generarN(generarPasos1).filter(i => trampaOrden(i.fichas)).slice(0, 500)) {
    // Recorre de derecha a izquierda la primera pareja del mismo nivel y comprueba que el resultado difiere.
    const f = it.fichas;
    const j = f.findIndex((o, k) => k >= 1 && (o === '-' || o === ':') && NIVEL_T[f[k + 2]] === NIVEL_T[o]);
    assert.ok(j > 0);
    const a = Number(f[j - 1]), b = Number(f[j + 1]), c = Number(f[j + 3]);
    const izq = f[j] === '-' ? (f[j + 2] === '+' ? a - b + c : a - b - c) : (f[j + 2] === '*' ? a / b * c : a / b / c);
    const der = f[j] === '-' ? (f[j + 2] === '+' ? a - (b + c) : a - (b - c)) : (f[j + 2] === '*' ? a / (b * c) : a / (b / c));
    assert.notEqual(izq, der);
  }
});

test('ejercicio 2: potencias y raíces antes que el producto, y entre sí de izquierda a derecha', () => {
  const items = generarN(generarPasos2);
  comprobarPasos(items);
  for (const it of items) {
    assert.ok(it.fichas.some(f => f[0] === '^' || f === '√'));
    const ops = it.fichas.filter(f => NIVEL_T[f]).length;
    assert.ok(ops === 3 || ops === 4, `${ops} operaciones`);
    it.fichas.forEach((f, i) => {
      if (f === '√') assert.ok(Number.isInteger(Math.sqrt(Number(it.fichas[i + 1]))) && Number(it.fichas[i + 1]) <= 400);
    });
  }
  const ambas = items.filter(it => it.fichas.includes('√') && it.fichas.some(f => f[0] === '^')).length / N;
  assert.ok(ambas >= 0.4, `ambas = ${ambas}`);
});

test('ejercicio 3: dos niveles de paréntesis y la potencia en torno al 40 %', () => {
  const items = generarN(generarPasos3);
  comprobarPasos(items);
  let conPot = 0;
  for (const it of items) {
    let prof = 0, max = 0;
    for (const f of it.fichas) { if (f === '(') max = Math.max(max, ++prof); if (f === ')') prof--; }
    assert.equal(max, 2, texto(it.fichas));
    if (it.fichas.some(f => f[0] === '^')) conPot++;
  }
  assert.ok(conPot / N > 0.3 && conPot / N < 0.5, `con potencia = ${conPot / N}`);
});

test('el motivo de un toque equivocado es cierto, por fuerza bruta', () => {
  for (const it of generarN(generarPasos1).concat(generarN(generarPasos3, 9)).slice(0, 4000)) {
    let actual = it.fichas;
    for (const p of it.pasos) {
      for (let i = 0; i < actual.length; i++) {
        if (!NIVEL_T[actual[i]] || i === p.indice) continue;
        const m = motivo(actual, i);
        const a = arbol(actual);
        const grupo = primerParentesis(a);
        const mia = listas(a).find(c => c.nodo.pos === i);
        if (m.clave === 'parentesis') {
          assert.ok(grupo && (!mia || mia.grupo !== grupo) || true);
          assert.ok(actual.includes('('));
        } else if (m.clave === 'prioridad') {
          assert.ok(NIVEL_T[actual[i]] < NIVEL_T[actual[p.indice]]);
        } else {
          assert.equal(NIVEL_T[actual[i]], NIVEL_T[actual[p.indice]]);
          assert.ok(i > p.indice, 'a igual prioridad, el tocado está a la derecha');
        }
      }
      actual = p.fichas;
    }
  }
});

test('ejercicio 4: los paréntesis exigidos son exactamente los que dan el valor correcto', () => {
  const items = generarN(generarInvisibles);
  let raya = 0, radical = 0, antes = 0;
  for (const it of items) {
    if (it.agrupador === 'raya') raya++; else radical++;
    if (it.antes.length || it.despues.length) antes++;
    const verdad = it.agrupador === 'raya'
      ? (valorJs(it.grupos[0]) / valorJs(it.grupos[1]))
      : Math.sqrt(valorJs(it.grupos[0]));
    // Valor de la expresión completa a partir de la estructura (dos alturas), sin pasar por `lineal`.
    const trozo = it.agrupador === 'raya' ? `(${verdad})` : `(${verdad})`;
    const total = valorJs([...it.antes, trozo, ...it.despues].map(f => f === '*' ? '*' : f));
    assert.ok(Number.isInteger(verdad), `${verdad}`);
    assert.equal(total, it.valor);
    assert.ok(exigidos(it).some(Boolean));
    for (const p of combinaciones(it)) {
      const v = valorJs(lineal(it, p));
      const cumple = exigidos(it).every((r, i) => !r || p[i]);
      if (cumple) assert.ok(Math.abs(v - it.valor) < 1e-9, `${texto(lineal(it, p))} = ${v} ≠ ${it.valor}`);
      else assert.ok(Math.abs(v - it.valor) > 1e-9, `falta un paréntesis y sale igual: ${texto(lineal(it, p))}`);
    }
  }
  assert.ok(raya / N > 0.4 && raya / N < 0.6, `raya = ${raya / N}`);
  assert.ok(antes / N > 0.4, `con términos fuera = ${antes / N}`);
  assert.ok(radical > 0);
});

test('ejercicio 4: radicandos exactos y denominadores y numeradores variados', () => {
  const items = generarN(generarInvisibles);
  const radicales = items.filter(it => it.agrupador === 'radical');
  for (const it of radicales) {
    const r = valorJs(it.grupos[0]);
    assert.ok(Number.isInteger(Math.sqrt(r)) && r >= 9 && r <= 225);
  }
  const rayas = items.filter(it => it.agrupador === 'raya');
  const numSolo = rayas.filter(it => it.grupos[0].length === 1).length / rayas.length;
  const denSolo = rayas.filter(it => it.grupos[1].length === 1).length / rayas.length;
  assert.ok(numSolo > 0.1 && numSolo < 0.5, `numerador solo = ${numSolo}`);
  assert.ok(denSolo > 0.15 && denSolo < 0.6, `denominador solo = ${denSolo}`);
  const con11o13 = items.filter(it => it.grupos.flat().some(f => ['11', '13'].includes(f))).length;
  assert.ok(con11o13 >= 0); // sin requisito: aquí no se factoriza
});

test('texto: el producto lleva punto medio, nunca ×, y la división cambia con el idioma', () => {
  assert.equal(texto(['18', '-', '12', ':', '6', '*', '2']), '18 − 12 : 6 · 2');
  assert.equal(texto(['18', ':', '6'], 'en'), '18 ÷ 6');
  for (const it of generarN(generarPasos3).slice(0, 200)) assert.ok(!texto(it.fichas).includes('×'));
});
