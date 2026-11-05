// Subtipos del generador de decimales y destrezas del inventario de la unidad 5
// que declara cada uno (tarea 133 del reparto PU2). Fuerza bruta: 3000 ítems
// por subtipo, con el valor de cada opción recalculado aparte (un evaluador de
// fracciones exactas con BigInt, sin usar nada del generador) y la regla de
// oro de la unidad: ninguna opción vale lo mismo que otra (0,5, 0,50 y 1/2 son
// la misma respuesta).

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
// index.js primero: los generadores importan de él y el ciclo solo se resuelve así.
import { TIPOS, crearRng } from '../src/ejercicios/index.js';
import { errores, preguntas, SUBTIPOS } from '../src/ejercicios/decimales.js';

const tipo = TIPOS.decimales;
const ID_U5 = /^U5-[12][ABC]-\d{2}$/;
const SEMILLAS = 3000;
const INVENTARIO = (() => {
  // Ruta de los apuntes según ~/.config/docencia/rutas.json; sin él, el test se salta.
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config', 'docencia', 'rutas.json'), 'utf8'));
    return path.join(cfg.apuntes, '5. Decimals', 'inventario-unidad5.tsv');
  } catch (e) { return null; }
})();
const HAY_INVENTARIO = Boolean(INVENTARIO && fs.existsSync(INVENTARIO));
// La única excepción a «ningún distractor vale lo mismo que la correcta» (acta del 3-11, punto k):
// la fracción a medio simplificar, con el enunciado que pide la irreducible (U5-2C-10).
const EXCEPCION = 'simplificar_a_medias';
const NEGATIVOS = new Set(['negativos_suma', 'negativos_producto']);

// ---------------------------------------------------------------------------
// Fracciones exactas con BigInt, aparte del generador.

const mcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
const F = (n, d = 1n) => { assert.ok(d !== 0n, 'división entre cero'); if (d < 0n) { n = -n; d = -d; } const g = mcd(n, d) || 1n; return { n: n / g, d: d / g }; };
const sumaF = (a, b) => F(a.n * b.d + b.n * a.d, a.d * b.d);
const prodF = (a, b) => F(a.n * b.n, a.d * b.d);
const cocF = (a, b) => F(a.n * b.d, a.d * b.n);
const igualF = (a, b) => a.n === b.n && a.d === b.d;
const negF = a => F(-a.n, a.d);

/** Evalúa el TeX neutro: números con «{,}», + − \cdot \div \frac{}{} ^{} \left( \right). */
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
      else if (toma('-')) v = sumaF(v, negF(term()));
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
  const unario = () => (toma('-') ? negF(unario()) : potencia());
  const potencia = () => {
    let v = atomo();
    if (toma('^{')) {
      const e = Number(/^\d+/.exec(resto())[0]); i += String(e).length; exige('}');
      let r = F(1n); for (let k = 0; k < e; k++) r = prodF(r, v); v = r;
    }
    return v;
  };
  const atomo = () => {
    espacios();
    if (toma('\\frac{')) { const a = expr(); exige('}{'); const b = expr(); exige('}'); return cocF(a, b); }
    if (toma('\\left(')) { const v = expr(); exige('\\right)'); return v; }
    const m = /^(\d+)(?:\{,\}(\d+))?/.exec(resto());
    assert.ok(m, `número esperado en «${tex}» (posición ${i})`);
    i += m[0].length;
    const dec = m[2] ?? '';
    return F(BigInt(m[1] + dec), 10n ** BigInt(dec.length));
  };
  const v = expr();
  espacios();
  assert.equal(i, tex.length, `sobra texto en «${tex}»`);
  return v;
}

/** Redondeo «5 o más, hacia arriba» de un decimal positivo escrito en TeX, hecho con las cifras. */
function redondearCifras(tex, c) {
  const [ent, dec = ''] = tex.split('{,}');
  const cifras = BigInt(ent + dec.padEnd(c, '0').slice(0, c));
  const sube = dec.length > c && Number(dec[c]) >= 5 ? 1n : 0n;
  return F(cifras + sube, 10n ** BigInt(c));
}

const ORDEN = { redondea_unidad: 0, redondea_decima: 1, redondea_centesima: 2 };

/** El valor de la correcta según el enunciado y la pregunta. */
function valorEsperado(ej) {
  const clave = ej.texto.clave;
  if (clave in ORDEN) return redondearCifras(ej.enunciado, ORDEN[clave]);
  return evaluar(ej.enunciado);
}

const pintado = ej => [ej.enunciado, ...ej.opciones.map(o => o.tex), ...ej.solucion.map(p => p.tex),
  ...ej.opciones.flatMap(o => (o.pasos ?? []).map(p => p.tex))].join(' | ');
const sinEspacios = s => s.replace(/\s+/g, '');
const acabaEn = (tex, valor) => ['=', '\\approx'].some(r => sinEspacios(tex).endsWith(sinEspacios(r + valor)));

// ---------------------------------------------------------------------------

test('decimales: cada subtipo declara destrezas con identificador U5-… y el módulo es su unión', () => {
  assert.ok(tipo.subtipos?.length > 0, 'sin subtipos');
  const ids = tipo.subtipos.map(s => s.id);
  assert.equal(new Set(ids).size, ids.length, 'ids de subtipo repetidos');
  for (const { id, items } of tipo.subtipos) {
    assert.ok(Array.isArray(items) && items.length > 0, `${id}: sin items`);
    for (const it of items) assert.match(it, ID_U5, `${id}: identificador raro «${it}»`);
  }
  assert.deepEqual(tipo.items, [...new Set(tipo.subtipos.flatMap(s => s.items))].sort());
  for (const p of Object.values(preguntas)) assert.ok(p.es && p.en);
});

test('decimales: los ids existen en el inventario de la U5, van a tipo test y los negativos no son nucleares', { skip: !HAY_INVENTARIO && 'sin el inventario (carpeta de iCloud)' }, () => {
  const filas = fs.readFileSync(INVENTARIO, 'utf8').normalize('NFC').split('\n');
  const cab = filas[0].split('\t');
  const col = n => cab.indexOf(n);
  const porId = new Map(filas.slice(1).filter(Boolean).map(f => { const c = f.split('\t'); return [c[0], c]; }));
  for (const { id, items } of tipo.subtipos) {
    for (const it of items) {
      const fila = porId.get(it);
      assert.ok(fila, `${it} no está en el inventario`);
      assert.notEqual(fila[col('tipo_test')], 'no', `${id}: ${it} no va a tipo test`);
      if (NEGATIVOS.has(id)) assert.equal(fila[col('nuclear')], 'no', `${id}: ${it} es nuclear y lleva negativos`);
    }
  }
});

for (const { id, generar } of SUBTIPOS) {
  test(`decimales/${id}: ${SEMILLAS} ítems con 4 opciones de valor distinto, una correcta y bien calculada`, () => {
    let conErrorTipico = 0;
    for (let s = 1; s <= SEMILLAS; s++) {
      const ej = generar(crearRng(s));
      const donde = `semilla ${s}, «${ej.enunciado}»`;
      assert.equal(ej.opciones.length, 4, donde);
      const correctas = ej.opciones.filter(o => o.correcta);
      assert.equal(correctas.length, 1, `${donde}: ${correctas.length} correctas`);
      assert.equal(new Set(ej.opciones.map(o => o.tex)).size, 4, `${donde}: opciones repetidas`);
      assert.ok(ej.texto.clave === 'calcula' || preguntas[ej.texto.clave], `${donde}: pregunta sin texto`);

      // La correcta es el valor del enunciado, calculado aparte.
      const correcta = correctas[0];
      const vc = evaluar(correcta.tex);
      assert.ok(igualF(vc, valorEsperado(ej)), `${donde}: la correcta ${correcta.tex} no es el valor`);
      const fraccion = /^\\frac\{(\d+)\}\{(\d+)\}$/.exec(correcta.tex);
      if (ej.texto.clave === 'como_fraccion_irreducible') {
        assert.ok(fraccion || /^\d+$/.test(correcta.tex), `${donde}: la correcta no es una fracción`);
        if (fraccion) assert.equal(mcd(BigInt(fraccion[1]), BigInt(fraccion[2])), 1n, `${donde}: la correcta no es irreducible`);
        assert.ok(!/\d\s*\\frac/.test(correcta.tex), `${donde}: número mixto`);
      }
      if (ej.texto.clave === 'como_fraccion_decimal') {
        const decimales = (ej.enunciado.split('{,}')[1] ?? '').length;
        assert.ok(fraccion && fraccion[2] === String(10 ** decimales), `${donde}: no es la fracción decimal sin simplificar`);
      }
      // La correcta, en su forma más corta (sin ceros finales): ninguna escritura de más.
      assert.ok(!/\{,\}\d*0$/.test(correcta.tex), `${donde}: la correcta lleva ceros finales`);
      assert.ok(acabaEn(ej.solucion.at(-1).tex, correcta.tex), `${donde}: la solución no acaba en la correcta`);

      // Regla de oro: ningún distractor equivale a la correcta ni a otro distractor.
      const distractores = ej.opciones.filter(o => !o.correcta);
      const valores = distractores.map(o => evaluar(o.tex));
      distractores.forEach((o, k) => {
        assert.ok(o.error && o.error.id !== 'generico', `${donde}: distractor sin error típico`);
        assert.ok(errores[o.error.id], `${donde}: error ${o.error.id} sin definir`);
        conErrorTipico++;
        assert.ok(o.pasos?.some(p => p.mal) && o.pasos.some(p => acabaEn(p.tex, o.tex)), `${donde}: los pasos de ${o.error.id} no llevan a ${o.tex}`);
        if (o.error.id === EXCEPCION) {
          assert.equal(id, 'decimal_a_fraccion', `${donde}: la excepción solo vale en «decimal_a_fraccion»`);
          assert.ok(igualF(valores[k], vc), `${donde}: la «a medias» debería valer lo mismo`);
          const m = /^\\frac\{(\d+)\}\{(\d+)\}$/.exec(o.tex);
          assert.ok(m && mcd(BigInt(m[1]), BigInt(m[2])) > 1n, `${donde}: la «a medias» ya es irreducible`);
        } else {
          assert.ok(!igualF(valores[k], vc), `${donde}: distractor ${o.tex} igual a la correcta`);
        }
        for (let j = k + 1; j < valores.length; j++) {
          assert.ok(!igualF(valores[k], valores[j]), `${donde}: dos distractores del mismo valor (${o.tex} y ${distractores[j].tex})`);
        }
        // Fuera de los subtipos de negativos, nada negativo, tampoco un distractor.
        if (!NEGATIVOS.has(id)) assert.ok(valores[k].n >= 0n, `${donde}: distractor negativo ${o.tex}`);
      });

      // Escritura: producto con punto, división con \div (sale «:»), sin porcentajes, sin letras,
      // números de hasta cuatro cifras enteras y sin paréntesis al empezar.
      const todo = pintado(ej);
      assert.ok(!/\\times|×|%|\\%/.test(todo), `${donde}: × o porcentaje en ${todo}`);
      assert.ok(!/[a-zA-Z]/.test(todo.replace(/\\(frac|cdot|div|left|right|approx|to|text\{mcd\}|quad)/g, '')), `${donde}: letras en ${todo}`);
      for (const t of [ej.enunciado, correcta.tex]) {
        for (const m of t.replace(/\{,\}\d+/g, '').matchAll(/\d+/g)) assert.ok(m[0].length <= 4, `${donde}: número de más de cuatro cifras enteras (${m[0]})`);
      }
      assert.ok(!/^\s*\\left\(/.test(ej.enunciado), `${donde}: paréntesis al empezar`);
      if (!NEGATIVOS.has(id)) assert.ok(!ej.enunciado.includes('-') || id === 'resta' || id === 'con_naturales' || id === 'combinada', `${donde}: signo menos fuera de su sitio`);
      if (NEGATIVOS.has(id)) assert.ok(vc.n < 0n || ej.enunciado.startsWith('-'), `${donde}: en los de negativos no hay ningún negativo`);
    }
    assert.ok(conErrorTipico === SEMILLAS * 3, `${id}: algún distractor no es un error típico`);
  });
}

// Los de memoria son seis, y las potencias, de bases con una cifra decimal (0,1-1,9 al cuadrado, 0,1-0,9 al cubo).
const POCOS = { de_memoria: 6, potencia: 28 };

test('decimales: cada subtipo, con variedad (más de 200 enunciados distintos en 3000, salvo los de memoria y las potencias)', () => {
  for (const { id, generar } of SUBTIPOS) {
    const vistos = new Set();
    for (let s = 1; s <= SEMILLAS; s++) vistos.add(generar(crearRng(s)).enunciado);
    assert.ok(vistos.size >= (POCOS[id] ? POCOS[id] - 2 : 200), `${id}: solo ${vistos.size} enunciados`);
  }
});

test('decimales: aritmética exacta (0,1 + 0,2 = 0,3 y el redondeo con cifras, no con coma flotante)', () => {
  assert.ok(igualF(evaluar('0{,}1 + 0{,}2'), evaluar('0{,}3')));
  assert.ok(igualF(redondearCifras('3{,}649', 1), evaluar('3{,}6')));
  assert.ok(igualF(redondearCifras('2{,}675', 2), evaluar('2{,}68'))); // con Number, 2.675.toFixed(2) da 2.67
});
