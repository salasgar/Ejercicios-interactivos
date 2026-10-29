// Subtipos de los generadores de fracciones y destrezas del inventario de la
// unidad 4 que declara cada uno (tarea 112 del reparto PU2). Fuerza bruta: 3000
// ítems por subtipo, con el valor de la correcta recalculado aparte (un pequeño
// evaluador de fracciones exactas, sin usar nada del generador) y la regla de
// oro: ninguna opción tiene el mismo valor que otra.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
// index.js primero: los generadores importan de él y el ciclo solo se resuelve así.
import { TIPOS, crearRng } from '../src/ejercicios/index.js';
import { errores as erroresEq, SUBTIPOS as subEq } from '../src/ejercicios/fracciones_equivalentes.js';
import { errores as erroresSuma, SUBTIPOS as subSuma } from '../src/ejercicios/suma_fracciones.js';
import { errores as erroresProd, SUBTIPOS as subProd } from '../src/ejercicios/producto_division_fracciones.js';

const TIPOS_FRACCIONES = ['fracciones_equivalentes', 'suma_fracciones', 'producto_division_fracciones'];
const ERRORES = { fracciones_equivalentes: erroresEq, suma_fracciones: erroresSuma, producto_division_fracciones: erroresProd };
const ID_U4 = /^U4-[1-3][ABC]-\d{2}$/;
const SEMILLAS = 3000;
const INVENTARIO = (() => {
  // Ruta de los apuntes según ~/.config/docencia/rutas.json; sin él, el test se salta.
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config', 'docencia', 'rutas.json'), 'utf8'));
    return path.join(cfg.apuntes, '4. Fractions', 'inventario-unidad4.tsv');
  } catch (e) { return null; }
})();
// La única excepción a «ningún distractor equivale a la correcta» (inventario, U4-1C-13 y U4-1C-14):
// una equivalente a medio simplificar, en un enunciado que pide la irreducible.
const EXCEPCION = 'simplificar_a_medias';

// ---------------------------------------------------------------------------
// Fracciones exactas, aparte del generador.

const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const F = (n, d = 1) => { assert.ok(d !== 0, 'división entre cero'); if (d < 0) { n = -n; d = -d; } const g = mcd(n, d) || 1; return { n: n / g, d: d / g }; };
const sumaF = (a, b) => F(a.n * b.d + b.n * a.d, a.d * b.d);
const prodF = (a, b) => F(a.n * b.n, a.d * b.d);
const cocF = (a, b) => F(a.n * b.d, a.d * b.n);
const igualF = (a, b) => a.n === b.n && a.d === b.d;

/** Evalúa el TeX neutro de los enunciados: + − \cdot \div \frac{}{} ^{} \left( \right). */
function evaluar(tex) {
  let i = 0;
  const resto = () => tex.slice(i);
  const espacios = () => { while (tex[i] === ' ') i++; };
  const toma = s => { espacios(); if (resto().startsWith(s)) { i += s.length; return true; } return false; };
  const exige = s => assert.ok(toma(s), `se esperaba «${s}» en «${tex}» (posición ${i})`);
  const expr = () => {
    let v = term();
    for (;;) {
      if (toma('+')) v = sumaF(v, term());
      else if (toma('-')) v = sumaF(v, prodF(term(), F(-1)));
      else return v;
    }
  };
  const term = () => {
    let v = unario();
    for (;;) {
      if (toma('\\cdot')) v = prodF(v, unario());
      else if (toma('\\div')) v = cocF(v, unario());
      else return v;
    }
  };
  const unario = () => (toma('-') ? prodF(unario(), F(-1)) : potencia());
  const potencia = () => {
    let v = atomo();
    if (toma('^{')) {
      const e = Number(/^\d+/.exec(resto())[0]); i += String(e).length; exige('}');
      let r = F(1); for (let k = 0; k < e; k++) r = prodF(r, v); v = r;
    }
    return v;
  };
  const atomo = () => {
    espacios();
    if (toma('\\frac{')) { const a = expr(); exige('}{'); const b = expr(); exige('}'); return cocF(a, b); }
    if (toma('\\left(') || toma('(')) { const v = expr(); if (!toma('\\right)')) exige(')'); return v; }
    const m = /^\d+/.exec(resto());
    assert.ok(m, `número esperado en «${tex}» (posición ${i})`);
    i += m[0].length;
    return F(Number(m[0]));
  };
  const v = expr();
  espacios();
  assert.equal(i, tex.length, `sobra texto en «${tex}»`);
  return v;
}

/** Solución del hueco de «a/b = □/D» o «a/b = N/□», con productos cruzados. */
function resolverHueco(enunciado) {
  const m = /^\\frac\{(\d+)\}\{(\d+)\} = \\frac\{(\\square|\d+)\}\{(\\square|\d+)\}$/.exec(enunciado);
  assert.ok(m, `hueco raro: ${enunciado}`);
  const [, a, b, n, d] = m;
  return n === '\\square' ? (Number(a) * Number(d)) / Number(b) : (Number(n) * Number(b)) / Number(a);
}

const valorDeOpcion = (ej, o) => (/^\d+$/.test(o.tex) || /^-?\d+$/.test(o.tex) ? F(Number(o.tex)) : evaluar(o.tex));

// ---------------------------------------------------------------------------

for (const id of TIPOS_FRACCIONES) {
  const tipo = TIPOS[id];

  test(`${id}: cada subtipo declara destrezas con identificador U4-… y el módulo es su unión`, () => {
    assert.ok(tipo.subtipos?.length > 0, `${id}: sin subtipos`);
    const ids = tipo.subtipos.map(s => s.id);
    assert.equal(new Set(ids).size, ids.length, 'ids de subtipo repetidos');
    for (const { id: sid, items } of tipo.subtipos) {
      assert.ok(Array.isArray(items) && items.length > 0, `${sid}: sin items`);
      for (const it of items) assert.match(it, ID_U4, `${sid}: identificador raro «${it}»`);
      assert.equal(new Set(items).size, items.length, `${sid}: items repetidos`);
    }
    assert.deepEqual(tipo.items, [...new Set(tipo.subtipos.flatMap(s => s.items))].sort());
  });

  test(`${id}: todos los ids existen en el inventario de la unidad 4 (si está el fichero)`, { skip: !(INVENTARIO && fs.existsSync(INVENTARIO)) && 'sin el inventario (carpeta de iCloud)' }, () => {
    const filas = fs.readFileSync(INVENTARIO, 'utf8').normalize('NFC').split('\n').slice(1);
    const existentes = new Set(filas.map(f => f.split('\t')[0]).filter(Boolean));
    for (const it of tipo.items) assert.ok(existentes.has(it), `${it} no está en el inventario`);
  });
}

const subtipos = [
  ...subEq.map(s => ({ tipoId: 'fracciones_equivalentes', ...s })),
  ...subSuma.map(s => ({ tipoId: 'suma_fracciones', ...s })),
  ...subProd.map(s => ({ tipoId: 'producto_division_fracciones', ...s })),
];

for (const { tipoId, id, generar } of subtipos) {
  test(`${tipoId}/${id}: ${SEMILLAS} ítems con 4 opciones de valor distinto, una correcta y bien calculada`, () => {
    const errores = ERRORES[tipoId];
    let conErrorTipico = 0;
    for (let s = 1; s <= SEMILLAS; s++) {
      const ej = generar(crearRng(s));
      const donde = `semilla ${s}, «${ej.enunciado}»`;
      assert.equal(ej.opciones.length, 4, donde);
      const correctas = ej.opciones.filter(o => o.correcta);
      assert.equal(correctas.length, 1, `${donde}: ${correctas.length} correctas`);
      assert.equal(new Set(ej.opciones.map(o => o.tex)).size, 4, `${donde}: opciones repetidas`);

      // La correcta es el valor del enunciado, calculado aparte; irreducible cuando es una fracción.
      const esHueco = ej.enunciado.includes('\\square');
      if (esHueco) {
        assert.equal(Number(correctas[0].tex), resolverHueco(ej.enunciado), `${donde}: el hueco no vale eso`);
      } else {
        const vc = valorDeOpcion(ej, correctas[0]);
        assert.ok(igualF(vc, evaluar(ej.enunciado)), `${donde}: la correcta ${correctas[0].tex} no es el valor`);
        assert.ok(!/\\frac\{-/.test(correctas[0].tex), `${donde}: signo dentro del numerador`);
        const m = /^-?\\frac\{(\d+)\}\{(\d+)\}$/.exec(correctas[0].tex);
        // («equivalente» pide una equivalente cualquiera, no la irreducible.)
        if (m && id !== 'equivalente') assert.equal(mcd(Number(m[1]), Number(m[2])), 1, `${donde}: la correcta no es irreducible`);
      }

      // Regla de oro: ningún distractor equivale a la correcta ni a otro distractor.
      const distractores = ej.opciones.filter(o => !o.correcta);
      const valores = distractores.map(o => (esHueco ? F(Number(o.tex)) : valorDeOpcion(ej, o)));
      const vcorrecta = esHueco ? F(Number(correctas[0].tex)) : valorDeOpcion(ej, correctas[0]);
      distractores.forEach((o, k) => {
        assert.ok(o.error, `${donde}: distractor sin error`);
        if (o.error.id === EXCEPCION) {
          assert.equal(id, 'irreducible', `${donde}: la excepción solo vale en «irreducible»`);
          assert.ok(igualF(valores[k], vcorrecta), `${donde}: la «a medias» debería valer lo mismo`);
          const m = /^\\frac\{(\d+)\}\{(\d+)\}$/.exec(o.tex);
          assert.ok(m && mcd(Number(m[1]), Number(m[2])) > 1, `${donde}: la «a medias» ya es irreducible`);
        } else {
          assert.ok(!igualF(valores[k], vcorrecta), `${donde}: distractor ${o.tex} igual a la correcta`);
        }
        if (o.error.id !== 'generico') {
          assert.ok(errores[o.error.id], `${donde}: error ${o.error.id} sin definir`);
          conErrorTipico++;
        }
        for (let j = k + 1; j < valores.length; j++) {
          assert.ok(!igualF(valores[k], valores[j]), `${donde}: dos distractores equivalentes (${o.tex} y ${distractores[j].tex})`);
        }
      });

      // Escritura: producto con punto, sin ×, sin letras, sin decimales ni números mixtos.
      const pintado = [ej.enunciado, ...ej.opciones.map(o => o.tex), ...ej.solucion.map(p => p.tex),
        ...ej.opciones.flatMap(o => (o.pasos ?? []).map(p => p.tex))].join(' | ');
      assert.ok(!/\\times|×/.test(pintado), `${donde}: ×`);
      const sinOrdenes = pintado.replace(/\\(frac|cdot|div|left|right|square|ne|text)\b/g, '').replace(/\\text\{[^}]*\}/g, '');
      assert.ok(!/[a-zA-Z]/.test(sinOrdenes.replace(/mc[dm]/g, '')), `${donde}: letras en ${pintado}`);
      assert.ok(!/\{,\}|\d\.\d/.test(pintado), `${donde}: decimales en ${pintado}`);
      // Un natural pegado a una fracción sin operador sería un número mixto (2\frac{1}{3}).
      assert.ok(!/\d\s*\\frac/.test(pintado), `${donde}: número mixto en ${pintado}`);
    }
    assert.ok(conErrorTipico > 0, `${id}: ningún error típico llegó a salir`);
  });
}

test('fracciones: cada subtipo saca errores típicos, no solo de relleno', () => {
  for (const { tipoId, id, generar } of subtipos) {
    let conError = 0;
    for (let s = 1; s <= 300; s++) {
      const ej = generar(crearRng(s));
      conError += ej.opciones.filter(o => !o.correcta && o.error.id !== 'generico').length;
    }
    assert.equal(conError, 300 * 3, `${tipoId}/${id}: algún distractor es genérico`);
  }
});

test('fracciones: la forma «irreducible» pide la fracción irreducible en el enunciado', () => {
  const { preguntas } = TIPOS.fracciones_equivalentes;
  assert.match(preguntas.simplifica.es, /irreducible/);
  assert.match(preguntas.simplifica.en, /lowest terms/);
});
