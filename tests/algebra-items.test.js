// Subtipos de los generadores de álgebra y destrezas del inventario de la unidad 6 que declara
// cada uno (tarea 161 del reparto PU2). Fuerza bruta: 3000 ítems por subtipo, con el valor de
// la correcta recalculado aparte (un pequeño evaluador de expresiones lineales en una letra con
// racionales exactos, sin usar nada del generador) y la regla de oro: ninguna opción equivale a
// otra (expresiones por forma canónica, soluciones por valor).

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
// index.js primero: los generadores importan de él y el ciclo solo se resuelve así.
import { TIPOS, crearRng } from '../src/ejercicios/index.js';
import { errores as erroresExp, SUBTIPOS as subExp } from '../src/ejercicios/expresiones_algebraicas.js';
import { errores as erroresEc, SUBTIPOS as subEc } from '../src/ejercicios/ecuaciones_primer_grado.js';

const TIPOS_ALGEBRA = ['expresiones_algebraicas', 'ecuaciones_primer_grado'];
const ERRORES = { expresiones_algebraicas: erroresExp, ecuaciones_primer_grado: erroresEc };
const ID_U6 = /^U6-[1-4][ABC]-\d{2}$/;
const SEMILLAS = 3000;
const INVENTARIO = (() => {
  // Ruta de los apuntes según ~/.config/docencia/rutas.json; sin él, el test se salta.
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config', 'docencia', 'rutas.json'), 'utf8'));
    return path.join(cfg.apuntes, '6. Algebra', 'inventario-unidad6.tsv');
  } catch (e) { return null; }
})();

// ---------------------------------------------------------------------------
// Racionales exactos y expresiones lineales, aparte del generador.

const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const F = (n, d = 1) => { assert.ok(d !== 0, 'división entre cero'); if (d < 0) { n = -n; d = -d; } const g = mcd(n, d) || 1; return { n: n / g, d: d / g }; };
const suma = (p, r) => F(p.n * r.d + r.n * p.d, p.d * r.d);
const prod = (p, r) => F(p.n * r.n, p.d * r.d);
const inv = p => { assert.ok(p.n !== 0, 'división entre cero'); return F(p.d, p.n); };
const cero = p => p.n === 0;
const igualF = (p, r) => p.n === r.n && p.d === r.d;
const claveF = p => `${p.n}/${p.d}`;

/** { a, b } = a·x + b. Si `valorX` es un racional, la x vale eso y todo es constante. */
function lineal(texto, valorX = null) {
  let i = 0;
  const ws = () => { while (texto[i] === ' ') i++; };
  const toma = t => { ws(); if (texto.startsWith(t, i)) { i += t.length; return true; } return false; };
  const exige = t => assert.ok(toma(t), `se esperaba «${t}» en «${texto}» (posición ${i})`);
  const sumaL = (p, r) => ({ a: suma(p.a, r.a), b: suma(p.b, r.b) });
  const mulL = (p, r) => {
    assert.ok(cero(p.a) || cero(r.a), `no es lineal: «${texto}»`);
    return { a: suma(prod(p.a, r.b), prod(r.a, p.b)), b: prod(p.b, r.b) };
  };
  const K = v => ({ a: F(0), b: v });
  const menos = p => mulL(p, K(F(-1)));
  const expr = () => {
    let v = term();
    for (;;) {
      if (toma('+')) v = sumaL(v, term());
      else if (toma('-')) v = sumaL(v, menos(term()));
      else return v;
    }
  };
  const term = () => {
    let v = unario();
    for (;;) {
      ws();
      if (toma('\\cdot')) v = mulL(v, unario());
      else if (toma('\\div')) { const r = unario(); assert.ok(cero(r.a), 'dividir entre una letra'); v = mulL(v, K(inv(r.b))); }
      else if (texto[i] === 'x' || texto[i] === '(') v = mulL(v, potencia());
      else return v;
    }
  };
  const unario = () => (toma('-') ? menos(unario()) : potencia());
  const potencia = () => {
    let v = atomo();
    if (toma('^{')) {
      const e = Number(/^\d+/.exec(texto.slice(i))[0]); i += String(e).length; exige('}');
      let r = K(F(1)); for (let k = 0; k < e; k++) r = mulL(r, v); v = r;
    }
    return v;
  };
  const atomo = () => {
    ws();
    if (toma('\\frac{')) {
      const a = expr(); exige('}{'); const b = expr(); exige('}');
      assert.ok(cero(b.a), 'letra en el denominador');
      return mulL(a, K(inv(b.b)));
    }
    if (toma('(')) { const v = expr(); exige(')'); return v; }
    if (texto[i] === 'x') { i++; return valorX === null ? { a: F(1), b: F(0) } : K(valorX); }
    const m = /^\d+/.exec(texto.slice(i));
    assert.ok(m, `número esperado en «${texto}» (posición ${i})`);
    i += m[0].length;
    return K(F(Number(m[0])));
  };
  const v = expr();
  ws();
  assert.equal(i, texto.length, `sobra texto en «${texto}»`);
  return v;
}
const igualL = (p, r) => igualF(p.a, r.a) && igualF(p.b, r.b);

/** Cómo se escribe una expresión reducida (x primero y el número después), aparte del generador. */
function textoReducido({ a, b }) {
  const partes = [];
  if (!cero(a)) {
    const n = Math.abs(a.n);
    const cuerpo = a.d === 1 ? (n === 1 ? 'x' : `${n}x`) : (n === 1 ? `\\frac{x}{${a.d}}` : `\\frac{${n}x}{${a.d}}`);
    partes.push({ neg: a.n < 0, t: cuerpo });
  }
  if (!cero(b) || partes.length === 0) partes.push({ neg: b.n < 0, t: b.d === 1 ? String(Math.abs(b.n)) : `\\frac{${Math.abs(b.n)}}{${b.d}}` });
  return partes.map((p, k) => (k === 0 ? (p.neg ? '-' : '') + p.t : ` ${p.neg ? '-' : '+'} ${p.t}`)).join('');
}

/** Lo que tiene que valer la correcta de cada traducción. */
function traduccion(clave, params) {
  const x = { a: F(1), b: F(0) };
  const lin = (a, b) => ({ a: a, b: b });
  const n = params?.n, b = params?.b;
  const tabla = {
    doble: lin(F(2), F(0)),
    mitad: lin(F(1, 2), F(0)),
    mas_que: lin(F(1), F(n ?? 0)),
    menos_que: lin(F(1), F(-(n ?? 0))),
    doble_mas: lin(F(2), F(b ?? 0)), doble_menos: lin(F(2), F(-(b ?? 0))),
    triple_mas: lin(F(3), F(b ?? 0)), triple_menos: lin(F(3), F(-(b ?? 0))),
    mitad_mas: lin(F(1, 2), F(b ?? 0)), mitad_menos: lin(F(1, 2), F(-(b ?? 0))),
  };
  assert.ok(tabla[clave], `traducción desconocida: ${clave}`);
  assert.ok(x);
  return tabla[clave];
}

// ---------------------------------------------------------------------------

for (const id of TIPOS_ALGEBRA) {
  const tipo = TIPOS[id];

  test(`${id}: cada subtipo declara destrezas con identificador U6-… y el módulo es su unión`, () => {
    assert.ok(tipo.subtipos?.length > 0, `${id}: sin subtipos`);
    const ids = tipo.subtipos.map(s => s.id);
    assert.equal(new Set(ids).size, ids.length, 'ids de subtipo repetidos');
    for (const { id: sid, items } of tipo.subtipos) {
      assert.ok(Array.isArray(items) && items.length > 0, `${sid}: sin items`);
      for (const it of items) assert.match(it, ID_U6, `${sid}: identificador raro «${it}»`);
      assert.equal(new Set(items).size, items.length, `${sid}: items repetidos`);
    }
    assert.deepEqual(tipo.items, [...new Set(tipo.subtipos.flatMap(s => s.items))].sort());
  });

  test(`${id}: todos los ids existen en el inventario de la unidad 6 y ninguno es tipo_test = no (si está el fichero)`, { skip: !(INVENTARIO && fs.existsSync(INVENTARIO)) && 'sin el inventario (carpeta de iCloud)' }, () => {
    const filas = fs.readFileSync(INVENTARIO, 'utf8').normalize('NFC').split('\n').slice(1).filter(Boolean).map(f => f.split('\t'));
    const porId = new Map(filas.map(f => [f[0], f]));
    for (const it of tipo.items) {
      assert.ok(porId.has(it), `${it} no está en el inventario`);
      assert.notEqual(porId.get(it)[8], 'no', `${it} es tipo_test = no`);
    }
  });
}

const subtipos = [
  ...subExp.map(s => ({ tipoId: 'expresiones_algebraicas', ...s })),
  ...subEc.map(s => ({ tipoId: 'ecuaciones_primer_grado', ...s })),
];

/** Valor de una opción: expresión lineal, o null si no es lineal (x²). */
function valorOpcion(tex) {
  try { return lineal(tex); } catch (e) { return null; }
}

for (const { tipoId, id, generar } of subtipos) {
  test(`${tipoId}/${id}: ${SEMILLAS} ítems con 4 opciones no equivalentes, una correcta y bien calculada`, () => {
    const errores = ERRORES[tipoId];
    const esEcuacion = tipoId === 'ecuaciones_primer_grado';
    let conErrorTipico = 0;
    for (let s = 1; s <= SEMILLAS; s++) {
      const ej = generar(crearRng(s));
      const donde = `semilla ${s}, «${ej.enunciado}» (${ej.texto.clave})`;
      assert.equal(ej.opciones.length, 4, donde);
      const correctas = ej.opciones.filter(o => o.correcta);
      assert.equal(correctas.length, 1, `${donde}: ${correctas.length} correctas`);
      assert.equal(new Set(ej.opciones.map(o => o.tex)).size, 4, `${donde}: opciones repetidas`);
      const correcta = correctas[0];

      // La correcta es lo que sale del enunciado, calculado aparte.
      if (esEcuacion) {
        const [izq, der] = ej.enunciado.split(' = ');
        const l = lineal(izq), r = lineal(der);
        const A = suma(l.a, prod(r.a, F(-1))), C = suma(r.b, prod(l.b, F(-1)));
        assert.ok(!cero(A), `${donde}: la x se va`);
        const solucion = prod(C, inv(A));
        const vc = lineal(correcta.tex);
        assert.ok(cero(vc.a) && igualF(vc.b, solucion), `${donde}: la correcta ${correcta.tex} no es la solución ${claveF(solucion)}`);
        // Fracción irreducible con el signo delante, nunca decimales.
        const m = /^-?\\frac\{(\d+)\}\{(\d+)\}$/.exec(correcta.tex);
        if (m) assert.equal(mcd(Number(m[1]), Number(m[2])), 1, `${donde}: la correcta no es irreducible`);
        assert.ok(!/\{,\}|\d\.\d/.test(correcta.tex), `${donde}: decimal en la solución`);
        // Sin ecuaciones que dependan de x² ni de más de una letra.
        assert.ok(!/\^/.test(ej.enunciado), `${donde}: potencia en una ecuación`);
      } else if (id.startsWith('valor_')) {
        const esperado = lineal(ej.enunciado, F(ej.texto.params.x));
        assert.ok(cero(esperado.a), donde);
        const vc = lineal(correcta.tex);
        assert.ok(cero(vc.a) && igualF(vc.b, esperado.b), `${donde}: la correcta ${correcta.tex} no vale ${claveF(esperado.b)} con x = ${ej.texto.params.x}`);
      } else if (id.startsWith('traducir_')) {
        assert.equal(ej.enunciado, '', donde);
        assert.ok(igualL(lineal(correcta.tex), traduccion(ej.texto.clave, ej.texto.params)), `${donde}: la correcta ${correcta.tex} no traduce la frase`);
        assert.equal(correcta.tex, textoReducido(lineal(correcta.tex)), `${donde}: la correcta no está en forma reducida`);
      } else {
        const esperado = lineal(ej.enunciado);
        assert.ok(igualL(lineal(correcta.tex), esperado), `${donde}: la correcta ${correcta.tex} no equivale al enunciado`);
        assert.equal(correcta.tex, textoReducido(esperado), `${donde}: la correcta no está en forma reducida`);
        assert.ok(!/\(/.test(correcta.tex), `${donde}: paréntesis en la correcta`);
      }

      // Regla de oro: ninguna opción equivale a otra (expresiones por forma canónica, números por valor).
      const claves = ej.opciones.map(o => {
        const v = valorOpcion(o.tex);
        return v ? `${claveF(v.a)}|${claveF(v.b)}` : `no-lineal:${o.tex}`;
      });
      assert.equal(new Set(claves).size, 4, `${donde}: dos opciones equivalentes (${ej.opciones.map(o => o.tex).join(' · ')})`);
      for (const o of ej.opciones) {
        if (o.correcta) continue;
        assert.ok(o.error, `${donde}: distractor sin error`);
        assert.notEqual(o.error.id, 'generico', `${donde}: distractor genérico`);
        assert.ok(errores[o.error.id], `${donde}: error ${o.error.id} sin definir`);
        assert.ok(o.pasos?.some(p => p.mal), `${donde}: distractor ${o.error.id} sin paso erróneo`);
        conErrorTipico++;
      }

      // Escritura: producto con punto solo entre números, sin ×, sin %, sin letras que no sean x,
      // sin decimales y x² solo donde toca (valor numérico y la frase «el doble»).
      const pintado = [ej.enunciado, ...ej.opciones.map(o => o.tex), ...ej.solucion.map(p => `${p.tex} ${p.calculo ?? ''}`),
        ...ej.opciones.flatMap(o => (o.pasos ?? []).map(p => p.tex))].join(' | ');
      assert.ok(!/\\times|×|%|\\%/.test(pintado), `${donde}: × o porcentaje`);
      assert.ok(!/x\s*\\cdot|\\cdot\s*x/.test(pintado), `${donde}: punto junto a la letra en ${pintado}`);
      const sinOrdenes = pintado.replace(/\\text\{[^}]*\}/g, '').replace(/\\(frac|cdot|div|left|right|square|text)\b/g, '');
      assert.ok(!/[a-wyzA-Z]/.test(sinOrdenes), `${donde}: letras que no son x en ${pintado}`);
      assert.ok(!/\{,\}|\d\.\d/.test(pintado), `${donde}: decimales en ${pintado}`);
      if (!(id === 'valor_cuadrado' || id === 'traducir_una')) assert.ok(!/\^/.test(pintado), `${donde}: potencia fuera del valor numérico`);
      if (id === 'traducir_una') assert.ok(!/\^/.test(ej.enunciado), donde);
    }
    assert.ok(conErrorTipico > 0, `${id}: ningún error típico llegó a salir`);
  });
}

test('álgebra: cada subtipo saca solo errores con nombre, nunca genéricos', () => {
  for (const { tipoId, id, generar } of subtipos) {
    let conError = 0;
    for (let s = 1; s <= 300; s++) {
      const ej = generar(crearRng(s));
      conError += ej.opciones.filter(o => !o.correcta && o.error.id !== 'generico').length;
    }
    assert.equal(conError, 300 * 3, `${tipoId}/${id}: algún distractor es genérico`);
  }
});

test('álgebra: la solución de una ecuación es siempre exacta: fracción irreducible o entero, nunca un periódico', () => {
  const vistas = new Set();
  for (const { tipoId, generar } of subtipos.filter(s => s.tipoId === 'ecuaciones_primer_grado')) {
    for (let s = 1; s <= 500; s++) {
      for (const o of generar(crearRng(s)).opciones) {
        assert.match(o.tex, /^-?(\d+|\\frac\{\d+\}\{\d+\})$/, `${tipoId}: opción rara «${o.tex}»`);
        vistas.add(o.tex);
      }
    }
  }
  assert.ok([...vistas].some(t => t.includes('\\frac')), 'ninguna fracción en las opciones');
});

test('álgebra: los errores de las dos tablas tienen mensaje en español y en inglés', () => {
  for (const id of TIPOS_ALGEBRA) {
    for (const [eid, e] of Object.entries(TIPOS[id].errores)) {
      assert.ok(e.es?.length > 10 && e.en?.length > 10, `${id}.${eid}: mensaje incompleto`);
    }
  }
});
