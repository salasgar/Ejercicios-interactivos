// «Coloca los paréntesis. Con decimales» (U5): los tres generadores cumplen las cotas de la ficha 202.
//   1. Operandos y operaciones de cada ejercicio, número de resultados, diana con objetivo distinto del de sin paréntesis.
//   2. Cotas de todo valor (intermedio o final): no negativo, ≤ 3 cifras decimales, ≤ 500; ninguna agrupación imposible.
//   3. Divisores de la U5 en todas las agrupaciones.
//   4. Alcanzables: todas las colocaciones del editor dan exactamente los chips, un chip por valor.
//   5. No repite el anterior, caídas en la reserva < 1 %, variedad.
//   6. Ningún caso del papel (hojas en claro, exámenes por huella) ni la reserva ni los ejemplos de la introducción.
//   7. Coma en español y punto en inglés, sin ceros de más.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { aDecimal, decimal, aTexto, comparar, sumar, restar, multiplicar } from '../practicas/_comun/decimales.js';
import { generar, M, CASOS_HOJA, HUELLAS_EXAMEN, DIVISORES, esCasoDelPapel, divisoresDeLaU5, TOPE, CIFRAS } from '../practicas/coloca-decimales/logica.js';
import { TX } from '../practicas/coloca-decimales/textos.js';

const N = 2000;
const plano = html => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const D = v => aDecimal(v).normalizar();
const cifras = v => D(v).k;
const items = (ejercicio, semilla = 11 * ejercicio) => {
  const rng = crearRng(semilla);
  const lista = [];
  let anterior = null;
  for (let i = 0; i < N; i++) { anterior = generar(ejercicio, rng, { anterior }); lista.push(anterior); }
  return lista;
};
const TODOS = [1, 2, 3].map(e => items(e));

const esNatural = n => cifras(n) === 0 && D(n).m >= 2 && D(n).m <= 10;
const esDecimal = n => cifras(n) >= 1 && cifras(n) <= 2 && comparar(D(n), decimal(1, 1)) >= 0 && comparar(D(n), decimal(999, 2)) <= 0;

test('operandos: decimales de 0,1 a 9,99 con una o dos cifras o naturales de 2 a 10 (o un divisor de la U5), al menos un decimal', () => {
  for (const lista of TODOS) {
    for (const it of lista) {
      assert.ok(it.numeros.some(n => cifras(n) > 0), 'al menos un decimal');
      it.numeros.forEach((n, i) => {
        const divisor = i > 0 && it.operaciones[i - 1] === '/';
        const ok = divisor ? DIVISORES.some(d => comparar(d, D(n)) === 0) : esNatural(n) || esDecimal(n);
        assert.ok(ok, `operando ${aTexto(D(n))} (${divisor ? 'divisor' : 'operando'})`);
      });
    }
  }
});

test('ej. 1: tres números, una operación de + − y otra de · :, exactamente 2 resultados', () => {
  for (const it of TODOS[0]) {
    assert.equal(it.tipo, 'todos');
    assert.equal(it.numeros.length, 3);
    assert.equal(it.exponente, null);
    assert.equal(it.operaciones.filter(o => o === '+' || o === '-').length, 1);
    assert.equal(it.operaciones.filter(o => o === '*' || o === '/').length, 1);
    assert.equal(it.resultados.length, 2);
  }
});

test('ej. 2: tres números con + − ·, cuadrado (cubo en pocos) al final, de 3 a 5 resultados', () => {
  let cubos = 0;
  for (const it of TODOS[1]) {
    assert.equal(it.tipo, 'todos');
    assert.equal(it.numeros.length, 3);
    assert.ok(it.operaciones.every(o => '+-*'.includes(o)));
    assert.ok(it.exponente === 2 || it.exponente === 3);
    if (it.exponente === 3) cubos++;
    assert.ok(it.resultados.length >= 3 && it.resultados.length <= 5, `${it.resultados.length}`);
  }
  assert.ok(cubos / N > 0.08 && cubos / N < 0.25, `cubos ${cubos / N}`);
});

test('ej. 3: diana de cuatro números con + − · :, al menos 3 resultados y objetivo alcanzable distinto del de sin paréntesis', () => {
  for (const it of TODOS[2]) {
    assert.equal(it.tipo, 'diana');
    assert.equal(it.numeros.length, 4);
    assert.equal(it.exponente, null);
    assert.ok(it.resultados.length >= 3);
    assert.ok(it.resultados.some(v => M.mismoValor(v, it.objetivo)), 'alcanzable');
    assert.ok(!M.mismoValor(it.objetivo, it.sinParentesis), 'distinto del de sin paréntesis');
  }
});

/** Valor de un árbol con las operaciones de decimales.js, sin pasar por la aritmética del motor. */
function valorIndependiente(a) {
  if (a.v !== undefined) return D(a.v);
  if (a.pot) { const x = valorIndependiente(a.x); let r = decimal(1, 0); for (let i = 0; i < a.pot; i++) r = multiplicar(r, x); return r.normalizar(); }
  const l = valorIndependiente(a.l), r = valorIndependiente(a.r);
  if (a.op === '+') return sumar(l, r).normalizar();
  if (a.op === '-') return restar(l, r).normalizar();
  if (a.op === '*') return multiplicar(l, r).normalizar();
  const lm = BigInt(l.m) * 10n ** BigInt(Math.max(0, r.k - l.k)), rm = BigInt(r.m) * 10n ** BigInt(Math.max(0, l.k - r.k));
  assert.notEqual(rm, 0n, 'división entre 0');
  assert.equal((lm * 1000n) % rm, 0n, 'división no exacta a milésimas');
  return decimal(Number(lm * 1000n / rm), 3).normalizar();
}

test('todo valor, intermedio o final: no negativo, a lo sumo tres cifras decimales y hasta 500; ninguna agrupación imposible', () => {
  assert.equal(CIFRAS, 3);
  assert.equal(TOPE, 500);
  for (const lista of TODOS) {
    for (const it of lista.slice(0, 600)) {
      const an = M.analizar(M.expresionDe(it));
      assert.equal(an.invalidos.length, 0, 'sin agrupaciones imposibles a la vista');
      const visita = a => {
        if (a.v !== undefined) return;
        if (a.pot) visita(a.x); else { visita(a.l); visita(a.r); }
        const v = valorIndependiente(a);
        assert.ok(BigInt(v.m) >= 0n, 'negativo');
        assert.ok(v.k <= 3, `cifras ${v.k}`);
        assert.ok(Number(v.m) / 10 ** v.k <= 500, 'más de 500');
      };
      an.todos.forEach(visita);
    }
  }
});

test('los divisores de todas las agrupaciones son los de la U5', () => {
  for (const lista of TODOS) for (const it of lista) assert.ok(divisoresDeLaU5(M.expresionDe(it)), JSON.stringify(it.numeros.map(n => aTexto(D(n)))));
  const hay = lista => lista.some(it => it.operaciones.includes('/'));
  assert.ok(hay(TODOS[0]) && hay(TODOS[2]), 'aparece la división');
});

test('alcanzables: en 200 ítems por ejercicio, todas las colocaciones del editor dan exactamente los chips', () => {
  const ceros = n => ({ abre: Array(n).fill(0), cierra: Array(n).fill(0) });
  for (const lista of TODOS) {
    for (const it of lista.slice(0, 200)) {
      const e = M.expresionDe(it), n = e.numeros.length;
      const chips = new Set(it.resultados.map(v => M.clave(v)));
      assert.equal(chips.size, it.resultados.length, 'un chip por valor');
      const vistos = new Set(), claves = new Set();
      for (let m = 0; m < 9 ** n; m++) {
        const c = ceros(n);
        let r = m;
        for (let i = 0; i < n; i++) { c.abre[i] = r % 3; r = Math.floor(r / 3); c.cierra[i] = r % 3; r = Math.floor(r / 3); }
        const t = M.interpretar(e, c);
        if (t.error) continue;
        const k = M.claveArbol(t.arbol);
        if (vistos.has(k)) continue;
        vistos.add(k);
        const ev = M.evaluar(t.arbol);
        if (ev.valor !== undefined) claves.add(M.clave(ev.valor));
      }
      assert.deepEqual([...claves].sort(), [...chips].sort(), plano(M.htmlArbol(M.sinParentesis(e), 'es')));
    }
  }
});

test('no repite el ítem anterior; caídas en la reserva por debajo del 1 %; variedad', () => {
  for (const [i, lista] of TODOS.entries()) {
    for (let j = 1; j < lista.length; j++) assert.notEqual(M.claveExpresion(lista[j]), M.claveExpresion(lista[j - 1]), `ej. ${i + 1}`);
  }
  M.estadisticas.llamadas = 0; M.estadisticas.caidas = 0;
  const lotes = [1, 2, 3].map(e => items(e, 900 + e));
  assert.ok(M.estadisticas.caidas / (3 * N) < 0.01, `caídas ${M.estadisticas.caidas} de ${M.estadisticas.llamadas}`);
  for (const lista of lotes) {
    const cuenta = new Map();
    for (const it of lista) cuenta.set(M.claveExpresion(it), (cuenta.get(M.claveExpresion(it)) ?? 0) + 1);
    assert.ok(Math.max(...cuenta.values()) / N < 0.10, 'ningún ítem en más del 10 %');
    assert.ok(cuenta.size > N * 0.9, `distintos ${cuenta.size}`);
  }
});

test('ningún caso del papel: ni los ítems, ni la reserva, ni los ejemplos de las introducciones', () => {
  for (const lista of TODOS) for (const it of lista) assert.ok(!esCasoDelPapel(M.expresionDe(it)), M.claveExpresion(it));
  assert.ok(CASOS_HOJA.size >= 30 && HUELLAS_EXAMEN.size >= 150, `leídos ${CASOS_HOJA.size} de hoja y ${HUELLAS_EXAMEN.size} de examen`);
  const x = (numeros, operaciones, exponente = null) => ({ numeros: numeros.map(t => aDecimal(t)), operaciones, exponente });
  const reservas = [x([decimal(15, 1), decimal(5, 1), 2], ['+', '*']), x([decimal(5, 1), 2, 3], ['+', '*'], 2),
    x([decimal(25, 1), 2, decimal(5, 1), 4], ['+', '*', '+']),
    x([1, decimal(5, 1), 2], ['+', '*'], 2), x([decimal(15, 1), decimal(5, 1), 2], ['+', '*'])];
  for (const e of reservas) {
    assert.ok(!esCasoDelPapel(e), M.claveExpresion(e));
    assert.equal(M.analizar(e).invalidos.length, 0);
  }
  const ej = TX.ejercicios.map(t => t.introduccion.es).join(' ');
  assert.match(ej, /1,5 \+ 0,5 · 2/);
});

test('escritura: coma en español, punto en inglés, sin ceros de más y nunca «,5» sin el 0', () => {
  for (const lista of TODOS) {
    for (const it of lista.slice(0, 300)) {
      for (const v of [...it.resultados, ...it.numeros]) {
        const es = aTexto(D(v), 'es'), en = aTexto(D(v), 'en');
        assert.ok(!/^[,.]/.test(es) && !/^[,.]/.test(en));
        assert.ok(!/[,.]\d*0$/.test(es), `cero de más: ${es}`);
        assert.ok(!es.includes('.') && !en.includes(','), `${es} / ${en}`);
        assert.equal(es.replace(',', '.'), en);
      }
      const html = M.htmlColocacion(M.expresionDe(it), { abre: it.numeros.map(() => 0), cierra: it.numeros.map(() => 0) }, 'es');
      assert.ok(!/\d\.\d/.test(plano(html)), plano(html));
    }
  }
});
