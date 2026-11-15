// «Coloca los paréntesis. Con fracciones» (U4): los tres generadores cumplen las cotas de la ficha 201.
//   1. Operandos y operaciones de cada ejercicio; solo el primero negativo (≈30 %); número de resultados; diana.
//   2. Todo valor, intermedio o final, irreducible con denominador ≤ 36 y |numerador| ≤ 60; ninguna agrupación imposible.
//   3. Alcanzables: todas las colocaciones del editor dan exactamente los chips; un chip por valor, ninguno equivalente a otro.
//   4. No repite el anterior, caídas en la reserva < 1 %, variedad.
//   5. Ningún caso del papel (hojas en claro, exámenes por huella), ni la reserva.
//   6. Escritura: raya, nunca barra ni «×»; el menos U+2212.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { fraccion, htmlFraccion, Fraccion } from '../practicas/_comun/fracciones.js';
import { generar, M, TOPE_NUM, TOPE_DEN, esCasoDelPapel } from '../practicas/coloca-fracciones/logica.js';
import { CASOS_HOJA, HUELLAS_EXAMEN } from '../practicas/coloca-fracciones/papel.js';

const N = 2000;
const items = (ejercicio, semilla = 11 * ejercicio) => {
  const rng = crearRng(semilla);
  const lista = [];
  let anterior = null;
  for (let i = 0; i < N; i++) { anterior = generar(ejercicio, rng, { anterior }); lista.push(anterior); }
  return lista;
};
const TODOS = [1, 2, 3].map(e => items(e));

const esNatural = n => n.den === 1 && n.num >= 2 && n.num <= 5;
const esFraccion = n => {
  const a = Math.abs(n.num);
  return n.den >= 2 && [2, 3, 4, 5, 6, 8, 10, 12].includes(n.den) && a >= 1 && a < 2 * n.den && a % n.den !== 0 && n.esIrreducible();
};

test('operandos: fracciones irreducibles (den. de 2 a 6, o 8, 10, 12) y naturales de 2 a 5; al menos dos fracciones; solo el primero negativo', () => {
  const maxNaturales = [1, 2, 2];
  for (const [i, lista] of TODOS.entries()) {
    let negativos = 0;
    for (const it of lista) {
      assert.ok(it.numeros.every(n => n instanceof Fraccion), 'son fracciones');
      assert.ok(it.numeros.every((n, k) => (k === 0 ? esNatural(new Fraccion(Math.abs(n.num), n.den)) || esFraccion(n) : esNatural(n) || esFraccion(n))), JSON.stringify(it.numeros));
      const naturales = it.numeros.filter(n => n.den === 1).length;
      assert.ok(naturales <= maxNaturales[i], `naturales ${naturales}`);
      assert.ok(it.numeros.length - naturales >= 2, 'al menos dos fracciones');
      assert.ok(it.numeros.slice(1).every(n => n.num > 0), 'solo el primero puede ser negativo');
      if (it.numeros[0].num < 0) negativos++;
    }
    assert.ok(negativos / N > 0.22 && negativos / N < 0.38, `ej. ${i + 1}: primero negativo ${negativos / N}`);
  }
});

test('ej. 1: tres operandos con + − ·, un · al menos, exactamente 2 resultados', () => {
  for (const it of TODOS[0]) {
    assert.equal(it.tipo, 'todos');
    assert.equal(it.numeros.length, 3);
    assert.equal(it.exponente, null);
    assert.ok(it.operaciones.every(o => '+-*'.includes(o)) && it.operaciones.includes('*'));
    assert.equal(it.resultados.length, 2);
  }
});

test('ej. 2: cuatro operandos con + − · :, un «:» al menos, de 3 a 5 resultados', () => {
  for (const it of TODOS[1]) {
    assert.equal(it.tipo, 'todos');
    assert.equal(it.numeros.length, 4);
    assert.ok(it.operaciones.every(o => '+-*/'.includes(o)) && it.operaciones.includes('/'));
    assert.ok(it.resultados.length >= 3 && it.resultados.length <= 5, `${it.resultados.length}`);
  }
});

test('ej. 3: diana de cuatro operandos, al menos 3 resultados y objetivo alcanzable distinto del de sin paréntesis', () => {
  for (const it of TODOS[2]) {
    assert.equal(it.tipo, 'diana');
    assert.equal(it.numeros.length, 4);
    assert.ok(it.operaciones.every(o => '+-*/'.includes(o)));
    assert.ok(it.resultados.length >= 3);
    assert.ok(it.resultados.some(v => M.mismoValor(v, it.objetivo)), 'alcanzable');
    assert.ok(!M.mismoValor(it.objetivo, it.sinParentesis), 'distinto del de sin paréntesis');
  }
});

/** Valor de un árbol con las operaciones de Fraccion, sin pasar por la aritmética del motor. */
function valorIndependiente(a) {
  if (a.v !== undefined) return a.v.simplificar();
  const l = valorIndependiente(a.l), r = valorIndependiente(a.r);
  if (a.op === '+') return l.sumar(r).simplificar();
  if (a.op === '-') return l.restar(r).simplificar();
  if (a.op === '*') return l.multiplicar(r).simplificar();
  assert.ok(!r.esCero(), 'división entre 0');
  return l.dividir(r).simplificar();
}

test(`todo valor, intermedio o final: irreducible, denominador ≤ ${TOPE_DEN}, |numerador| ≤ ${TOPE_NUM}; ninguna agrupación imposible`, () => {
  assert.equal(TOPE_NUM, 60);
  assert.equal(TOPE_DEN, 36);
  for (const lista of TODOS) {
    for (const it of lista.slice(0, 600)) {
      const an = M.analizar(M.expresionDe(it));
      assert.equal(an.invalidos.length, 0, 'sin agrupaciones imposibles a la vista');
      const visita = a => {
        if (a.v !== undefined) return;
        visita(a.l); visita(a.r);
        const v = valorIndependiente(a);
        assert.ok(v.den <= TOPE_DEN, `denominador ${v.den}`);
        assert.ok(Math.abs(v.num) <= TOPE_NUM, `numerador ${v.num}`);
      };
      an.todos.forEach(visita);
    }
  }
});

test('alcanzables: en 200 ítems por ejercicio, todas las colocaciones del editor dan exactamente los chips; ningún par equivalente; todos irreducibles', () => {
  const ceros = n => ({ abre: Array(n).fill(0), cierra: Array(n).fill(0) });
  for (const lista of TODOS) {
    for (const it of lista.slice(0, 200)) {
      const e = M.expresionDe(it), n = e.numeros.length;
      const chips = new Set(it.resultados.map(v => M.clave(v)));
      assert.equal(chips.size, it.resultados.length, 'un chip por valor (3/4 y 6/8 son el mismo)');
      for (const v of it.resultados) assert.ok(v.esIrreducible() && !(v.den === 1 && v.num === 0 && false), `irreducible ${M.clave(v)}`);
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
      assert.deepEqual([...claves].sort(), [...chips].sort(), M.claveExpresion(e));
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
    assert.ok(cuenta.size > N * 0.6, `distintos ${cuenta.size}`);
  }
});

test('ningún caso del papel: ni los ítems ni la reserva; el filtro detecta los de la hoja y los cambiados de orden', () => {
  for (const lista of TODOS) for (const it of lista) assert.ok(!esCasoDelPapel(M.expresionDe(it)), M.claveExpresion(it));
  assert.ok(CASOS_HOJA.size >= 20 && HUELLAS_EXAMEN.size >= 300, `leídos ${CASOS_HOJA.size} de hoja y ${HUELLAS_EXAMEN.size} de examen`);
  const x = (numeros, operaciones) => ({ numeros, operaciones, exponente: null });
  const f = fraccion;
  assert.ok(esCasoDelPapel(x([f(1, 2), f(1, 3), f(3, 4)], ['+', '*'])), 'ejemplo del inventario');
  assert.ok(esCasoDelPapel(x([f(2, 3), f(3, 4), f(1, 3)], ['*', '+'])), 'caso de la hoja 3 con los términos cambiados de sitio');
  const reservas = [x([f(3, 4), f(1, 2), fraccion(3, 1)], ['-', '*']), x([f(3, 4), f(1, 2), f(2, 3), f(1, 6)], ['-', '*', '/']),
    x([f(1, 2), f(1, 3), fraccion(2, 1), f(1, 4)], ['+', '*', '-'])];
  for (const e of reservas) {
    assert.ok(!esCasoDelPapel(e), M.claveExpresion(e));
    assert.equal(M.analizar(e).invalidos.length, 0);
  }
});

test('escritura: fracciones con raya, nunca barra ni «×»; el menos es U+2212', () => {
  for (const lista of TODOS) {
    for (const it of lista.slice(0, 300)) {
      const html = M.htmlColocacion(M.expresionDe(it), { abre: it.numeros.map(() => 0), cierra: it.numeros.map(() => 0) }, 'es');
      assert.ok(html.includes('class="frac'), 'raya');
      assert.doesNotMatch(html.replace(/<[^>]+>/g, ''), /\d\/\d|×|-\d/);
      for (const v of it.resultados) {
        assert.ok(M.htmlValor(v).length > 0);
        assert.doesNotMatch(M.htmlValor(v).replace(/<[^>]+>/g, ''), /\/|-/);
      }
    }
  }
  assert.ok(htmlFraccion(fraccion(-3, 4)).includes('−'));
});
