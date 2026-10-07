// Coloca los paréntesis (practicas/parentesis/): las comprobaciones usan
// definiciones INDEPENDIENTES de las de logica.js (programación dinámica por
// intervalos para los resultados, un evaluador de texto para las líneas de la
// resolución) y no las funciones de la práctica.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  generar, expresionDe, arboles, evaluar, resultados, interpretar, colocacion, alcanzable,
  clave, textoArbol, sinParentesis, arbolQueDa, formatear, textoPasos, textoColocacion, pistaPara, TOPE,
} from '../practicas/parentesis/logica.js';

const N = 3000;

// --- Definiciones independientes -------------------------------------------------

/** Evalúa un texto («(5+6)^2», «8-3*2») con la jerarquía normal. En modo estricto devuelve null si alguna operación no se puede en los naturales. */
function evaluarTexto(texto, estricto = false) {
  const t = texto.match(/\d+|[-+*/()^]/g);
  let p = 0, malo = false;
  const op = (o, a, b) => {
    let r;
    if (o === '+') r = a + b;
    else if (o === '*') r = a * b;
    else if (o === '-') r = a - b;
    else { if (b === 0 || a % b !== 0) malo = true; r = a / b; }
    if (r < 0 || r > TOPE) malo = true;
    return r;
  };
  const base = () => {
    let v;
    if (t[p] === '(') { p++; v = suma(); p++; } else v = Number(t[p++]);
    if (t[p] === '^') { p++; const e = Number(t[p++]); let r = 1; for (let i = 0; i < e; i++) r *= v; if (r > TOPE) malo = true; v = r; }
    return v;
  };
  const prod = () => {
    let v = base();
    while (t[p] === '*' || t[p] === '/') { const o = t[p++]; v = op(o, v, base()); }
    return v;
  };
  const suma = () => {
    let v = prod();
    while (t[p] === '+' || t[p] === '-') { const o = t[p++]; v = op(o, v, prod()); }
    return v;
  };
  const v = suma();
  if (p !== t.length) return null;
  return estricto && malo ? null : v;
}

/** Los textos de TODAS las colocaciones equilibradas de paréntesis (de 0 a 2 seguidos en cada hueco). */
function colocacionesBrutas({ numeros, operaciones, exponente }) {
  const n = numeros.length;
  const textos = [];
  for (let m = 0; m < 3 ** (2 * n); m++) {
    const d = [];
    let r = m;
    for (let i = 0; i < 2 * n; i++) { d.push(r % 3); r = Math.floor(r / 3); }
    let nivel = 0, ok = true, texto = '';
    for (let i = 0; i < n; i++) {
      texto += '('.repeat(d[i]);
      nivel += d[i];
      texto += numeros[i];
      nivel -= d[n + i];
      if (nivel < 0) { ok = false; break; }
      texto += ')'.repeat(d[n + i]);
      if (i === n - 1 && exponente) texto += `^${exponente}`;
      if (i < n - 1) texto += operaciones[i];
    }
    if (ok && nivel === 0) textos.push(texto);
  }
  return textos;
}

/** Valores que se pueden conseguir con algún paréntesis colocado y todas las operaciones en naturales. */
function resultadosBrutos(expresion) {
  const valores = new Set();
  for (const texto of colocacionesBrutas(expresion)) {
    const v = evaluarTexto(texto, true);
    if (v !== null) valores.add(v);
  }
  return [...valores].sort((x, y) => x - y);
}

const memoria = new Map();
const items = ej => {
  if (!memoria.has(ej)) {
    const rng = crearRng(1000 + ej);
    memoria.set(ej, Array.from({ length: N }, () => generar(ej, rng)));
  }
  return memoria.get(ej);
};

// --- Casos fijos -------------------------------------------------------------------

test('la jerarquía y el orden de izquierda a derecha', () => {
  const e = (numeros, operaciones, exponente = null) => ({ numeros, operaciones, exponente });
  // 12 : 6 : 2 = 1, no 4
  assert.equal(evaluar(sinParentesis(e([12, 6, 2], ['/', '/']))).valor, 1);
  assert.equal(evaluar(sinParentesis(e([20, 5, 3], ['-', '-']))).valor, 12);
  assert.equal(evaluar(sinParentesis(e([5, 2, 3], ['+', '*']))).valor, 11);
  assert.equal(evaluar(sinParentesis(e([5, 2, 3], ['+', '*'], 2))).valor, 23);
  assert.deepEqual(resultados(e([5, 2, 3], ['+', '*'], 2)), [23, 41, 63, 121, 441]);
});

test('la resolución de (5 + 2 · 3)² es la del enunciado', () => {
  const e = { numeros: [5, 2, 3], operaciones: ['+', '*'], exponente: 2 };
  const { arbol } = interpretar(e, { abre: [1, 0, 0], cierra: [0, 0, 1] });
  assert.deepEqual(evaluar(arbol).pasos, ['(5 + 2 * 3)^2', '(5 + 6)^2', '11^2', '121']);
  assert.equal(formatear('(5 + 2 * 3)^2'), '(5 + 2 · 3)<sup>2</sup>');
  assert.equal(formatear('6 / 3', 'es'), '6 : 3');
  assert.equal(formatear('6 / 3', 'en'), '6 ÷ 3');
  assert.match(textoPasos(['1 + 2', '3']), /= 3/);
});

test('las razones de los árboles inválidos', () => {
  const e = { numeros: [8, 15, 7, 2], operaciones: ['-', '+', '/'], exponente: null };
  const razones = arboles(e).map(a => evaluar(a).invalido?.razon);
  assert.ok(razones.includes('negativo') && razones.includes('inexacta'));
  const grande = evaluar(interpretar({ numeros: [9, 8, 7], operaciones: ['+', '*'], exponente: 2 }, { abre: [2, 0, 0], cierra: [0, 1, 1] }).arbol);
  assert.equal(grande.invalido.razon, 'grande');   // ((9 + 8) · 7)² = 14 161
  const cero = evaluar(sinParentesis({ numeros: [5, 5, 2, 3], operaciones: ['-', '+', '/'], exponente: null }));
  assert.equal(cero.valor, undefined === cero.valor ? undefined : cero.valor);
});

test('paréntesis desequilibrados o que no agrupan nada', () => {
  const e = { numeros: [5, 2, 3], operaciones: ['+', '*'], exponente: null };
  assert.equal(interpretar(e, { abre: [1, 0, 0], cierra: [0, 0, 0] }).error, 'desequilibrados');
  assert.equal(interpretar(e, { abre: [0, 0, 0], cierra: [1, 0, 0] }).error, 'desequilibrados');
  assert.equal(interpretar(e, { abre: [0, 1, 0], cierra: [1, 0, 0] }).error, 'desequilibrados');
  assert.equal(interpretar({ numeros: [], operaciones: [], exponente: null }, null).error, 'vacio');
  assert.equal(interpretar(e, { abre: [0, 1, 0], cierra: [0, 0, 1] }).redundantes, true);   // 5 + (2 · 3)
  assert.equal(interpretar(e, { abre: [1, 0, 0], cierra: [0, 0, 1] }).redundantes, true);   // (5 + 2 · 3)
  assert.equal(interpretar(e, { abre: [1, 0, 0], cierra: [1, 0, 0] }).redundantes, true);   // (5) + 2 · 3
  assert.equal(interpretar(e, { abre: [1, 0, 0], cierra: [0, 1, 0] }).redundantes, false);  // (5 + 2) · 3
  const c = { ...e, exponente: 2 };
  assert.equal(interpretar(c, { abre: [1, 0, 0], cierra: [0, 0, 1] }).redundantes, false);  // (5 + 2 · 3)²
  assert.equal(interpretar(c, { abre: [0, 0, 1], cierra: [0, 0, 1] }).redundantes, true);   // 5 + 2 · (3)²
});

// --- Por ejercicio, con fuerza bruta ------------------------------------------------

for (const ej of [1, 2, 3, 4]) {
  test(`ejercicio ${ej}: los resultados coinciden con la fuerza bruta y las líneas de la resolución son ciertas`, () => {
    items(ej).forEach((item, k) => {
      const e = expresionDe(item);
      // con cuatro números hay 6561 colocaciones por ítem: la fuerza bruta se hace con los primeros 400
      if (e.numeros.length === 3 || k < 400) assert.deepEqual(item.resultados, resultadosBrutos(e), JSON.stringify(item));
      assert.deepEqual(resultados(e), item.resultados);
      const por = evaluar(sinParentesis(e));
      assert.equal(por.valor, item.sinParentesis);
      assert.ok(item.resultados.includes(item.sinParentesis));
      for (const a of arboles(e)) {
        const r = evaluar(a);
        if (r.valor !== undefined) {
          // toda la resolución vale lo mismo, y la última línea es el valor
          assert.ok(r.pasos.every(l => evaluarTexto(l) === r.valor), `${r.pasos.join(' = ')}`);
          assert.equal(r.pasos.at(-1), String(r.valor));
        } else {
          // la línea del problema contiene la operación imposible
          assert.equal(r.invalido.paso, r.pasos.length - 1);
          const { a: x, op, b: y } = r.invalido;
          assert.ok(r.pasos.at(-1).includes(op.startsWith('^') ? `${x}${op}` : `${x} ${op} ${y}`), `${r.pasos.at(-1)} / ${JSON.stringify(r.invalido)}`);
        }
      }
    });
  });

  test(`ejercicio ${ej}: toda agrupación se escribe con a lo sumo dos paréntesis seguidos y cada colocación es una agrupación`, () => {
    for (const item of items(ej).slice(0, ej < 3 ? 600 : 100)) {
      const e = expresionDe(item);
      const n = e.numeros.length;
      const claves = new Set(arboles(e).map(clave));
      // todas las agrupaciones se pueden escribir
      for (const a of arboles(e)) {
        assert.ok(alcanzable(a, n), `${textoArbol(a)} necesita más de dos niveles`);
        const { arbol } = interpretar(e, colocacion(a, n));
        assert.equal(clave(arbol), clave(a), textoArbol(a));
      }
      // y toda colocación equilibrada es una de ellas
      const vistas = new Set();
      const huecos = 2 * n;
      for (let m = 0; m < 3 ** huecos; m++) {
        const d = [];
        let r = m;
        for (let i = 0; i < huecos; i++) { d.push(r % 3); r = Math.floor(r / 3); }
        const p = { abre: d.slice(0, n), cierra: d.slice(n) };
        const x = interpretar(e, p);
        if (x.error) continue;
        assert.ok(claves.has(clave(x.arbol)), `${JSON.stringify(p)} → ${clave(x.arbol)}`);
        vistas.add(clave(x.arbol));
      }
      assert.equal(vistas.size, claves.size, 'alguna agrupación no se puede colocar');
    }
  });
}

test('ejercicio 1: tres números y exactamente 2 resultados', () => {
  for (const item of items(1)) {
    assert.equal(item.tipo, 'todos');
    assert.equal(item.numeros.length, 3);
    assert.equal(item.exponente, null);
    assert.equal(item.resultados.length, 2);
    assert.ok(item.operaciones.every(o => o === '+' || o === '*'));
  }
});

test('ejercicio 2: tres números con exponente, 4 o 5 resultados, todos los árboles válidos', () => {
  for (const item of items(2)) {
    const e = expresionDe(item);
    assert.equal(item.numeros.length, 3);
    assert.ok(item.exponente === 2 || item.exponente === 3);
    assert.ok(item.resultados.length >= 4 && item.resultados.length <= 5, JSON.stringify(item));
    assert.ok(arboles(e).every(a => evaluar(a).valor !== undefined), JSON.stringify(item));
    assert.ok(item.operaciones.every(o => o === '+' || o === '*'));
  }
});

test('ejercicio 3: cuatro números, algún árbol inválido en naturales y al menos 3 resultados', () => {
  let conResta = 0, conDivision = 0;
  for (const item of items(3)) {
    const e = expresionDe(item);
    assert.equal(item.numeros.length, 4);
    assert.ok(item.operaciones.some(o => o === '-' || o === '/'));
    const evaluados = arboles(e).map(evaluar);
    assert.ok(evaluados.some(r => r.valor === undefined), JSON.stringify(item));
    assert.ok(evaluados.every(r => !r.invalido || r.invalido.razon !== 'grande'));
    assert.ok(item.resultados.length >= 3);
    if (item.operaciones.includes('-')) conResta++;
    if (item.operaciones.includes('/')) conDivision++;
  }
  assert.ok(conResta > N / 4 && conDivision > N / 8, `resta ${conResta}, división ${conDivision}`);
});

test('ejercicio 4: el objetivo se puede conseguir y no es el valor sin paréntesis', () => {
  const formas = new Set();
  for (const item of items(4)) {
    const e = expresionDe(item);
    assert.equal(item.tipo, 'diana');
    assert.notEqual(item.objetivo, item.sinParentesis);
    assert.ok(resultadosBrutos(e).includes(item.objetivo));
    const a = arbolQueDa(e, item.objetivo);
    assert.equal(evaluar(a).valor, item.objetivo);
    formas.add(item.exponente ? 'con exponente' : 'sin exponente');
  }
  assert.equal(formas.size, 2);
});

test('las expresiones varían y ningún resultado es siempre el mismo', () => {
  for (const ej of [1, 2, 3, 4]) {
    const todos = items(ej);
    assert.ok(new Set(todos.map(i => JSON.stringify([i.numeros, i.operaciones, i.exponente]))).size > 100, `ejercicio ${ej}`);
  }
});

test('la pista añade un paréntesis cada vez y acaba consiguiendo un resultado que faltaba', () => {
  for (const ej of [1, 2, 3]) {
    for (const item of items(ej).slice(0, 150)) {
      const e = expresionDe(item);
      const n = e.numeros.length;
      const faltan = new Set(item.resultados.filter(v => v !== item.sinParentesis));
      let p = { abre: Array(n).fill(0), cierra: Array(n).fill(0) };
      let valor = null;
      for (let paso = 1; paso <= 8; paso++) {
        const sig = pistaPara(e, p, faltan);
        assert.ok(sig, JSON.stringify(item));
        const cuantos = q => [...q.abre, ...q.cierra].reduce((x, y) => x + y, 0);
        assert.equal(cuantos(sig), cuantos(p) + 1, 'añade exactamente un paréntesis');
        assert.ok([...sig.abre, ...sig.cierra].every(k => k <= 2));
        p = sig;
        const r = interpretar(e, p);
        if (!r.error) { valor = evaluar(r.arbol).valor; break; }
      }
      assert.ok(faltan.has(valor), `la pista llegó a ${valor} en ${JSON.stringify(item)}`);
    }
  }
});

test('la expresión tal como la escribe el alumno, con sus paréntesis', () => {
  const e = { numeros: [5, 2, 3], operaciones: ['+', '*'], exponente: 2 };
  assert.equal(textoColocacion(e, { abre: [1, 0, 0], cierra: [0, 1, 0] }), '(5 + 2) * 3^2');
  assert.equal(textoColocacion(e, { abre: [2, 0, 0], cierra: [0, 1, 1] }), '((5 + 2) * 3)^2');
  assert.equal(formatear(textoColocacion(e, { abre: [0, 0, 0], cierra: [0, 0, 0] })), '5 + 2 · 3<sup>2</sup>');
});

test('sin × ni «factor» en los textos de la práctica', () => {
  for (const f of ['logica.js', 'textos.js', 'practica.js']) {
    let s;
    try { s = readFileSync(new URL(`../practicas/parentesis/${f}`, import.meta.url), 'utf8'); } catch { continue; }
    assert.ok(!s.includes('×'), `${f} usa ×`);
    assert.ok(!/\bfactor\b/i.test(s.replace(/prime factor|factor tree/gi, '')), `${f} usa «factor»`);
  }
});
