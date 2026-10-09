// Práctica «¿Qué se hace primero?» (reparto-practicas-u2, tarea 20): la lógica se
// prueba con definiciones independientes (un analizador en árbol y `Function`),
// no con las funciones de la propia práctica.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  generarPasos1, generarPasos2, generarPasos3, generarInvisibles,
  trampaOrden, exigidos, lineal, combinaciones, cadena, toca, paso, validos, ambito, motivo, esNatural, texto,
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
  }).join(' ').replace(/Math\.sqrt\s+(\d+(?:\.\d+)?(?:e[+-]?\d+)?)/g, 'Math.sqrt($1)');
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

// ─── Pasos que valen: más de uno cuando las operaciones no se estorban ────────

const toks = s => s.split(' ');
const idx = (fichas, ...ops) => fichas.map((f, i) => (ops.includes(f) ? i : -1)).filter(i => i >= 0);

test('validos: los casos de la decisión de Juan Luis, por nombre', () => {
  // 3² + 5 · 4: valen el exponente y el producto, no la suma
  assert.deepEqual(validos(toks('3 ^2 + 5 * 4')), [1, 4]);
  // 10 − 4 + 6 · 16: valen el «−» y el «·»; el «+» no
  assert.deepEqual(validos(toks('10 - 4 + 6 * 16')), [1, 5]);
  // 2 + 3 · 4: solo el producto
  assert.deepEqual(validos(toks('2 + 3 * 4')), [3]);
  // 2 · 3²: solo el exponente
  assert.deepEqual(validos(toks('2 * 3 ^2')), [3]);
  // 20 : 4 · 5 y 10 − 4 + 3: cadenas, de izquierda a derecha
  assert.deepEqual(validos(toks('20 : 4 * 5')), [1]);
  assert.deepEqual(validos(toks('10 - 4 + 3')), [1]);
  // los dos casos de la reapertura: 7 · 14 − 3 · 10, 6 : 3 + 24 : 6
  assert.deepEqual(validos(toks('7 * 14 - 3 * 10')), [1, 5]);
  assert.deepEqual(validos(toks('6 : 3 + 24 : 6')), [1, 5]);
  // 4³ + √324 y √169 + 5³
  assert.deepEqual(validos(toks('4 ^3 + √ 324')), [1, 3]);
  assert.deepEqual(validos(toks('√ 169 + 5 ^3')), [0, 4]);
  // dentro del paréntesis que se cierra primero, y solo ahí
  assert.deepEqual(validos(toks('( 2 + 3 ) * 4 - 1')), [2]);
  assert.deepEqual(validos(toks('2 * ( 8 - 3 * 2 )')), [6]);
  assert.deepEqual(validos(toks('( 3 + 4 ) ^2')), [2]);
});

test('motivo: dice la razón cierta y nunca llama fallo a un paso que vale', () => {
  const m = (s, i) => motivo(toks(s), i);
  assert.equal(m('3 ^2 + 5 * 4', 1), null);
  assert.equal(m('10 - 4 + 6 * 16', 1), null);
  assert.deepEqual(m('2 + 3 * 4', 1), { clave: 'prioridad', nivel: 2, malo: '+' });
  assert.deepEqual(m('3 ^2 + 5 * 4', 2), { clave: 'prioridad', nivel: 3, malo: '+' });
  assert.deepEqual(m('20 : 4 * 5', 3), { clave: 'izquierda', nivel: 2 });
  assert.deepEqual(m('10 - 4 + 3', 3), { clave: 'izquierda', nivel: 1 });
  assert.deepEqual(m('10 - 4 + 6 * 16', 3), { clave: 'prioridad', nivel: 2, malo: '+' });
  assert.deepEqual(m('( 2 + 3 ) * 4', 4), { clave: 'parentesis' });
});

/** Evaluador independiente: ¿el valor se conserva al operar solo esa ficha con sus vecinos? Null si no se puede operar. */
function conservaValor(actual, i) {
  const f = actual[i];
  let desde, hasta, v;
  const num = k => (/^\d+$/.test(actual[k] ?? '') ? Number(actual[k]) : null);
  let minimo = Infinity;
  if (f === '√') { const a = num(i + 1); if (a === null) return null; desde = i; hasta = i + 1; v = Math.sqrt(a); }
  else if (f[0] === '^') { const a = num(i - 1); if (a === null) return null; desde = i - 1; hasta = i; v = a ** Number(f[1]); }
  else {
    const a = num(i - 1), b = num(i + 1);
    if (a === null || b === null) return null;
    desde = i - 1; hasta = i + 1;
    v = f === '+' ? a + b : f === '-' ? a - b : f === '*' ? a * b : a / b;
    if (f === '*' || f === ':') minimo = Math.min(a, b);
  }
  const despues = [...actual.slice(0, desde), `(${v})`, ...actual.slice(hasta + 1)];
  return { conserva: Math.abs(valorJs(despues) - valorJs(actual)) < 1e-9, v, bonito: Number.isInteger(v) && v >= 0 && v <= 999 };
}

/** Todos los estados por los que pasa un alumno que elige siempre uno cualquiera de los pasos válidos. */
function recorrido(fichas, rng) {
  const estados = [fichas];
  let t = fichas;
  while (t.length > 1) {
    const v = validos(t);
    assert.ok(v.length >= 1, `sin pasos válidos en ${texto(t)}`);
    t = paso(t, rng.elegir(v)).fichas;
    estados.push(t);
  }
  return estados;
}

test('un operador vale si y solo si lo dicen tres definiciones independientes, en todos los estados de todos los recorridos', () => {
  let probados = 0, variosValidos = 0;
  for (const [fn, semilla] of [[generarPasos1, 11], [generarPasos2, 12], [generarPasos3, 13]]) {
    const rng = crearRng(semilla + 100);
    for (const it of generarN(fn, semilla).slice(0, 1500)) {
      for (const actual of recorrido(cadena(it.fichas)[0].fichas, rng).filter(t => t.length > 1)) {
        const a = arbol(actual);
        const grupo = primerParentesis(a);
        const listasEnGrupo = new Set(listas(a).filter(c => c.grupo === grupo).map(c => c.nodo.pos));
        const aceptados = validos(actual);
        if (aceptados.length > 1) variosValidos++;
        assert.ok(aceptados.includes(toca(actual)), `la canónica no vale en ${texto(actual)}`);
        const [desde, hasta] = ambito(actual);
        for (let i = 0; i < actual.length; i++) {
          if (!NIVEL_T[actual[i]]) continue;
          probados++;
          const dentro = i >= desde && i <= hasta;
          const nodoListo = listasEnGrupo.has(i);                           // (1) árbol: operandos ya son números
          const conserva = dentro ? conservaValor(actual, i) : null;        // (2) operarlo a mano
          const vale = aceptados.includes(i);
          const cadenaIgual = dentro && NIVEL_T[actual[i - 2]] === NIVEL_T[actual[i]] && NIVEL_T[actual[i]] < 3 && i - 2 >= desde;
          // Todo nodo del árbol con hijos ya numéricos se acepta; lo demás solo si es de una cadena y da lo mismo.
          if (nodoListo) assert.ok(vale, `no acepta un paso del árbol: ${texto(actual)} ficha ${i}`);
          if (vale) {
            assert.ok(conserva && conserva.conserva, `acepta un paso que cambia el valor: ${texto(actual)} ficha ${i}`);
            const p = paso(actual, i);                                      // (3) el resultado sigue siendo natural
            assert.ok(p && Number.isInteger(p.valor) && p.valor >= 0, `intermedio no natural en ${texto(actual)} ficha ${i}`);
            if (!nodoListo) {
              assert.ok(cadenaIgual, `acepta fuera del árbol sin ser cadena: ${texto(actual)} ficha ${i}`);
              assert.ok(conserva.bonito, `acepta un intermedio feo: ${texto(actual)} ficha ${i}`);
            }
          } else {
            // rechazado: o cambia el valor, o exige operar con algo que aún no es un número,
            // o es una cadena cuyo adelanto daría un intermedio feo (no natural, 0, ·1…)
            // o rompe la prioridad aunque el valor coincida por casualidad (17 − 13 · 3 : 3: el 13 · 3 : 3 vale 13)
            const mayorPegado = [i - 2, i - 1, i + 1, i + 2].some(j => j >= desde && j <= hasta && NIVEL_T[actual[j]] > NIVEL_T[actual[i]]);
            assert.ok(conserva === null || !conserva.conserva || (cadenaIgual && !conserva.bonito) || mayorPegado,
              `rechaza un paso correcto: ${texto(actual)} ficha ${i}`);
            assert.notEqual(motivo(actual, i), null);
          }
        }
      }
    }
  }
  assert.ok(probados > 20000, `probados = ${probados}`);
  assert.ok(variosValidos > 500, `estados con varios pasos válidos = ${variosValidos}`);
});

test('motivo: la razón que se da es cierta, por fuerza bruta', () => {
  let n = 0;
  for (const it of generarN(generarPasos1).concat(generarN(generarPasos2, 8), generarN(generarPasos3, 9)).slice(0, 6000)) {
    for (const actual of recorrido(cadena(it.fichas)[0].fichas, crearRng(5)).filter(t => t.length > 1)) {
      const [desde, hasta] = ambito(actual);
      for (let i = 0; i < actual.length; i++) {
        if (!NIVEL_T[actual[i]] || validos(actual).includes(i)) continue;
        const m = motivo(actual, i);
        n++;
        if (m.clave === 'parentesis') {
          assert.ok(i < desde || i > hasta, 'dentro del paréntesis que toca no puede ser «paréntesis»');
          assert.ok(actual.includes('('));
        } else if (m.clave === 'prioridad') {
          assert.ok(NIVEL_T[actual[i]] < m.nivel);
          // hay de verdad una operación de ese nivel pegada a la tocada
          const vecinos = [i - 2, i - 1, i + 1, i + 2].filter(j => j >= desde && j <= hasta && NIVEL_T[actual[j]] === m.nivel);
          assert.ok(vecinos.length > 0, `no hay vecino de nivel ${m.nivel} en ${texto(actual)} ficha ${i}`);
        } else {
          assert.equal(m.clave, 'izquierda');
          // seguidas: el vecino de la izquierda comparte operando y es del mismo nivel
          assert.equal(NIVEL_T[actual[i]], m.nivel);
          assert.equal(NIVEL_T[actual[i - 2]], m.nivel, `sin cadena a la izquierda en ${texto(actual)} ficha ${i}`);
        }
      }
    }
  }
  assert.ok(n > 5000, `rechazos probados = ${n}`);
});

test('esNatural: lo que sale con decimales o negativo no se escribe', () => {
  assert.ok(esNatural(9) && esNatural(0));
  assert.ok(!esNatural(3.55) && !esNatural(-8) && !esNatural(-0.25) && !esNatural(72 / 11));
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

test('a + b − b: tocar el − antes que el + no cambia el valor y no es fallo', () => {
  assert.deepEqual(validos(['9', '+', '8', '-', '8']), [1, 3]);
  assert.equal(motivo(['9', '+', '8', '-', '8'], 3), null);
  assert.deepEqual(validos(['9', '+', '8', '-', '3']), [1, 3]);
  assert.deepEqual(validos(['10', '-', '4', '+', '3']), [1]);
});
