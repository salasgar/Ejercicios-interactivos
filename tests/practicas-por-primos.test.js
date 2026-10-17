// Práctica «Multiplica y divide por primos» (reparto-practicas-u2, tarea 75):
// fuerza bruta con definiciones independientes de las de `aritmetica.js`,
// semilla fija para que el resultado sea reproducible.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { mcm, mcd } from '../practicas/_comun/aritmetica.js';
import {
  BASES, TOPE, generar, factDe, expsDe, botonesActivos, tocar, esCorrecta, toquesMinimos, explicar, estadoPrimos,
} from '../practicas/por-primos/logica.js';

const N = 3000;
const valor = f => f.reduce((v, [p, e]) => v * p ** e, 1);
const cuota = (lista, pred) => lista.filter(pred).length / lista.length;
const items = (j, semilla = 1) => { const rng = crearRng(semilla + j); return Array.from({ length: N }, () => generar(j, rng)); };

for (const j of [1, 2, 3, 4]) {
  test(`ejercicio ${j}: cotas del generador y nunca resuelto al salir`, () => {
    for (const it of items(j)) {
      const o = valor(it.objetivo), p = valor(it.partida);
      assert.ok(o >= 4 && o <= 300 && o !== 1, `objetivo ${o}`);
      assert.ok(p >= 2 && p <= 300 && p !== o, `partida ${p}`);
      for (const f of [it.objetivo, it.partida]) for (const [q, e] of f) { assert.ok(BASES.includes(q)); assert.ok(e >= 1 && e <= 3); }
      const primos = new Set([...it.objetivo, ...it.partida].map(([q]) => q));
      assert.ok(primos.size <= 3);
      assert.equal(esCorrecta(it, it.partida), false, 'sale resuelto');
      // Independiente de esCorrecta: por definición, con %.
      if (j === 1) assert.notEqual(p % o, 0);
      if (j === 2) assert.notEqual(o % p, 0);
      if (j === 3) assert.notEqual(mcm(o, p), p);
      if (j === 4) assert.notEqual(mcd(o, p), p);
      const t = toquesMinimos(it);
      assert.ok(t >= 1 && t <= 4, `toques ${t}`);
    }
  });

  test(`ejercicio ${j}: toquesMinimos coincide con una búsqueda en anchura`, () => {
    for (const it of items(j).slice(0, 600)) {
      const sube = j !== 4, baja = j !== 3;
      const ini = expsDe(it.partida);
      const visto = new Set([ini.join()]);
      let frontera = [ini], pasos = 0, hallado = null;
      while (hallado === null && frontera.length) {
        if (frontera.some(e => esCorrecta(it, factDe(e)))) { hallado = pasos; break; }
        const nueva = [];
        for (const e of frontera) for (let i = 0; i < 4; i++) for (const d of [sube ? 1 : 0, baja ? -1 : 0].filter(Boolean)) {
          const n = e.slice(); n[i] += d;
          if (n[i] < 0 || valor(factDe(n)) > TOPE || visto.has(n.join())) continue;
          visto.add(n.join()); nueva.push(n);
        }
        frontera = nueva; pasos++;
      }
      assert.equal(toquesMinimos(it), hallado);
    }
  });
}

test('esCorrecta coincide con %, mcm y mcd por fuerza bruta (todos los números alcanzables)', () => {
  for (const j of [1, 2, 3, 4]) {
    for (const it of items(j).slice(0, 300)) {
      const o = valor(it.objetivo), p = valor(it.partida);
      for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) for (let c = 0; c < 3; c++) {
        const f = factDe([a, b, c, 0]), v = valor(f);
        const bruto = j === 1 ? v % o === 0 : j === 2 ? o % v === 0 : j === 3 ? v === mcm(o, p) : v === mcd(o, p);
        assert.equal(esCorrecta(it, f), bruto, `ej ${j}: ${v} contra ${o} y ${p}`);
      }
    }
  }
});

test('cuotas: m.c.m. = objetivo en menos del 30 %, m.c.m. ≤ 5000, m.c.d. = 1 en menos del 15 %', () => {
  const tres = items(3);
  assert.ok(tres.every(it => mcm(valor(it.objetivo), valor(it.partida)) <= 5000));
  assert.ok(cuota(tres, it => mcm(valor(it.objetivo), valor(it.partida)) === valor(it.objetivo)) <= 0.3);
  const cuatro = items(4);
  assert.ok(cuota(cuatro, it => mcd(valor(it.objetivo), valor(it.partida)) === 1) <= 0.15);
});

test('«: p» nunca está activo con el exponente de p a 0 y «· p» se apaga al pasar de 100 000', () => {
  for (const j of [1, 2, 3, 4]) {
    for (let a = 0; a < 6; a++) for (let b = 0; b < 6; b++) for (let c = 0; c < 6; c++) for (let d = 0; d < 6; d++) {
      const e = [a, b, c, d], f = factDe(e), act = botonesActivos(j, f);
      BASES.forEach((p, i) => {
        if (act.div) assert.equal(act.div[i], e[i] > 0);
        else assert.equal(tocar(j, f, p, -1), null);
        if (act.mult) assert.equal(act.mult[i], valor(f) * p <= TOPE);
        else assert.equal(tocar(j, f, p, 1), null);
      });
    }
  }
});

test('ningún valor alcanzable desde ningún ítem es decimal ni menor que 1', () => {
  for (const j of [1, 2, 3, 4]) {
    for (const it of items(j).slice(0, 100)) {
      let fronteras = [it.partida];
      const visto = new Set();
      for (let paso = 0; paso < 8; paso++) {
        const nueva = [];
        for (const f of fronteras) for (const p of BASES) for (const s of [1, -1]) {
          const g = tocar(j, f, p, s);
          if (!g) continue;
          const v = valor(g);
          assert.ok(Number.isInteger(v) && v >= 1 && v <= TOPE);
          assert.ok(g.every(([, e]) => Number.isInteger(e) && e >= 1));
          const k = v; if (!visto.has(k)) { visto.add(k); nueva.push(g); }
        }
        fronteras = nueva;
      }
    }
  }
});

test('estadoPrimos: los cuatro estados', () => {
  const it = { ejercicio: 3, objetivo: [[2, 1], [3, 2]], partida: [[2, 2], [3, 1]] };   // m.c.m. = 36
  assert.deepEqual(estadoPrimos(it, [[2, 2], [3, 1], [5, 1]]).map(c => [c.p, c.estado]), [[2, 'bien'], [3, 'falta'], [5, 'mal']]);
  assert.deepEqual(estadoPrimos(it, [[2, 2], [3, 2]]).map(c => c.estado), ['bien', 'bien']);
});

test('explicar: frases con los números del ítem, en los dos idiomas, sin factor ni HCF ni ×', () => {
  const casos = [
    [{ ejercicio: 1, objetivo: [[2, 2], [3, 1]], partida: [[2, 1], [3, 1], [5, 1]] }, [[2, 1], [3, 1], [5, 1]]],
    [{ ejercicio: 2, objetivo: [[2, 2], [3, 1], [5, 1]], partida: [[2, 3], [3, 1]] }, [[2, 3], [3, 1]]],
    [{ ejercicio: 3, objetivo: [[2, 1], [3, 2]], partida: [[2, 2], [3, 1]] }, [[2, 2], [3, 2], [5, 1]]],
    [{ ejercicio: 3, objetivo: [[2, 1], [3, 2]], partida: [[2, 2], [3, 1]] }, [[2, 2], [3, 2]]],
    [{ ejercicio: 4, objetivo: [[2, 2], [3, 1], [5, 1]], partida: [[2, 3], [3, 1]] }, [[2, 1], [3, 1]]],
    [{ ejercicio: 4, objetivo: [[2, 2], [3, 1], [5, 1]], partida: [[2, 3], [3, 1]] }, [[2, 2], [3, 1]]],
    [{ ejercicio: 4, objetivo: [[5, 1], [7, 1]], partida: [[2, 1], [3, 1]] }, []],
  ];
  for (const [it, actual] of casos) for (const idioma of ['es', 'en']) {
    const txt = explicar(it, actual, idioma);
    assert.ok(txt.length > 20 && !txt.includes('undefined') && !txt.includes('NaN'), txt);
    assert.ok(!/HCF|×|\bfactor\b/.test(txt), txt);
  }
  assert.match(explicar(casos[2][0], casos[2][1], 'es'), /sobra un 5/);
  assert.match(explicar(casos[4][0], casos[4][1], 'es'), /no hacía falta quitar un 2/);
  assert.match(explicar(casos[3][0], casos[3][1], 'en'), /LCM of 12 and 18/);
});
