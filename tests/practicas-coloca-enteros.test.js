// Coloca los paréntesis. Con enteros (U3): las cotas de los tres ejercicios, que no se escape ningún
// valor ni se quede ninguno sin chip, la escritura de los pasos y que no salga ningún caso del papel.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { huella } from '../practicas/_comun/parentesis-motor.js';
import { M, TOPE, generar, elevaNegativo, reservado } from '../practicas/coloca-enteros/logica.js';
import { CASOS_HOJA, HUELLAS_EXAMEN, delPapel } from '../practicas/coloca-enteros/papel.js';

const N = 2000;
const EJERCICIOS = [1, 2, 3];
const plano = html => html.replace(/<sup>(\d)<\/sup>/g, '^$1').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const ceros = n => ({ abre: Array(n).fill(0), cierra: Array(n).fill(0) });

function items(ejercicio, semilla, n = N) {
  const rng = crearRng(semilla);
  const lista = [];
  let anterior = null;
  for (let i = 0; i < n; i++) { anterior = generar(ejercicio, rng, { anterior }); lista.push(anterior); }
  return lista;
}

const OPS_3 = new Set(['+', '-', '*']);
const DE_1 = new Set(['+*', '*+', '-*', '*-', '**', '--', '-+']);

test('ej. 1: tres números, dos operaciones de la lista y exactamente 2 resultados, ninguno inválido', () => {
  for (const it of items(1, 11)) {
    assert.equal(it.numeros.length, 3);
    assert.ok(it.numeros[0] !== 0 && Math.abs(it.numeros[0]) <= 9, `primero ${it.numeros[0]}`);
    assert.ok(it.numeros.slice(1).every(x => x >= 2 && x <= 9));
    assert.ok(DE_1.has(it.operaciones.join('')), it.operaciones.join(''));
    assert.equal(it.exponente, null);
    assert.equal(it.resultados.length, 2);
    const an = M.analizar(M.expresionDe(it));
    assert.equal(an.invalidos.length, 0);
  }
  const negativos = items(1, 12).filter(it => it.numeros[0] < 0).length;
  assert.ok(negativos > N * 0.3 && negativos < N * 0.7, `primero negativo: ${negativos}`);
});

test('ej. 2: a ∘ b ∘ c² (³ a veces), de 3 a 5 resultados y al menos el 40 % eleva un negativo', () => {
  const lista = items(2, 21);
  let tres = 0, negativa = 0;
  for (const it of lista) {
    assert.equal(it.numeros.length, 3);
    const [a, b, c] = it.numeros;
    assert.ok(a !== 0 && Math.abs(a) <= 9 && b >= 2 && b <= 6 && c >= 2 && c <= 5, it.numeros.join());
    assert.ok(it.operaciones.every(o => OPS_3.has(o)));
    assert.ok(it.exponente === 2 || it.exponente === 3);
    if (it.exponente === 3) tres++;
    assert.ok(it.resultados.length >= 3 && it.resultados.length <= 5, `resultados ${it.resultados.length}`);
    const an = M.analizar(M.expresionDe(it));
    assert.equal(an.invalidos.length, 0);
    if (elevaNegativo(an)) negativa++;
  }
  assert.ok(negativa >= N * 0.4, `base negativa al agrupar: ${negativa}/${N}`);
  assert.ok(tres > N * 0.08 && tres < N * 0.25, `cubos: ${tres}`);
});

test('ej. 3: cuatro números, un «:» al menos, de 3 a 6 resultados y alguna agrupación que no se puede', () => {
  for (const it of items(3, 31)) {
    assert.equal(it.numeros.length, 4);
    assert.ok(it.numeros[0] !== 0 && Math.abs(it.numeros[0]) <= 12);
    assert.ok(it.numeros.slice(1).every(x => x >= 2 && x <= 12));
    assert.ok(it.operaciones.includes('/'));
    assert.equal(it.exponente, null);
    assert.ok(it.resultados.length >= 3 && it.resultados.length <= 6, `resultados ${it.resultados.length}`);
    const an = M.analizar(M.expresionDe(it));
    assert.ok(an.invalidos.length >= 1, 'alguna agrupación que no se puede');
    assert.ok(an.invalidos.every(x => ['inexacta', 'cero'].includes(x.r.invalido.razon)), 'solo «inexacta» o «cero»');
    assert.equal(an.hayGrande, false);
  }
});

for (const ej of EJERCICIOS) {
  test(`ej. ${ej}: todo valor, intermedio o final, entre −${TOPE} y ${TOPE}`, () => {
    for (const it of items(ej, 41 + ej, 500)) {
      const an = M.analizar(M.expresionDe(it));
      for (const { r } of an.validos) {
        for (const sec of r.pasos) for (const x of sec) if (typeof x !== 'string' && x.v !== undefined) assert.ok(Math.abs(x.v) <= TOPE);
        assert.ok(Math.abs(r.valor) <= TOPE);
      }
      assert.ok(it.resultados.every(v => Math.abs(v) <= TOPE));
    }
  });

  test(`ej. ${ej}: alcanzables — en 200 ítems, las colocaciones del editor dan exactamente los chips`, () => {
    for (const it of items(ej, 51 + ej, 200)) {
      const e = M.expresionDe(it);
      const n = e.numeros.length;
      const chips = it.resultados.map(M.clave);
      assert.equal(new Set(chips).size, chips.length, 'un chip por valor');
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
      assert.deepEqual([...claves].sort(), [...chips].sort(), plano(M.htmlArbol(M.sinParentesis(e))));
    }
  });

  test(`ej. ${ej}: escritura de los pasos (U+2212, negativos entre paréntesis, nunca −2²)`, () => {
    for (const it of items(ej, 61 + ej, 200)) {
      const an = M.analizar(M.expresionDe(it));
      for (const idioma of ['es', 'en']) {
        for (const { r } of an.validos) {
          const t = plano(M.htmlPasos(r.pasos, idioma));
          assert.doesNotMatch(t, /-/, `guion ASCII: ${t}`);
          assert.doesNotMatch(t, /[+−·:÷] −\d/, `negativo sin paréntesis tras una operación: ${t}`);
          assert.doesNotMatch(t, /−\d+\^/, `−2²: ${t}`);
          assert.doesNotMatch(t, /\(\+|undefined|NaN/, t);
        }
        const inicial = plano(M.htmlArbol(M.sinParentesis(M.expresionDe(it)), idioma));
        assert.doesNotMatch(inicial, /\(\+|[+−·:÷] −\d|−\d+\^/, inicial);
      }
    }
  });

  test(`ej. ${ej}: no repite el ítem anterior`, () => {
    const lista = items(ej, 71 + ej, 500);
    for (let i = 1; i < lista.length; i++) assert.notEqual(M.claveExpresion(M.expresionDe(lista[i])), M.claveExpresion(M.expresionDe(lista[i - 1])));
  });

  test(`ej. ${ej}: ningún caso de las hojas ni de los exámenes de la U3`, () => {
    for (const it of items(ej, 81 + ej)) assert.equal(reservado(M.expresionDe(it)), false, M.claveExpresion(M.expresionDe(it)));
  });
}

test('caídas en la reserva por debajo del 1 %, y la reserva no es del papel', () => {
  const llamadas = M.estadisticas.llamadas;
  assert.ok(llamadas >= N * 3, `llamadas ${llamadas}`);
  assert.ok(M.estadisticas.caidas / llamadas < 0.01, `caídas ${M.estadisticas.caidas}/${llamadas}`);
  for (const k of ['-4 3 7|*+|', '-5 2 3|+*|2', '-12 6 2 3|+/-|']) assert.equal(delPapel(k), false, k);
});

test('papel: las hojas en claro, los exámenes solo por huella, y la huella es la del motor', () => {
  assert.ok(CASOS_HOJA.size > 100);
  assert.ok(HUELLAS_EXAMEN.size > 100);
  for (const h of HUELLAS_EXAMEN) assert.match(h, /^[0-9a-z]+$/);
  assert.ok([...CASOS_HOJA].every(k => /^-?\d+( -?\d+){2,3}\|[-+*/]{2,3}\|[23]?$/.test(k)), 'formato de las claves');
  const k = [...CASOS_HOJA][0];
  assert.equal(delPapel(k), true);
  assert.equal(delPapel(k + 'x'), false);
  assert.equal(typeof huella(k), 'string');
});
