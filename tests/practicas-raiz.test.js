// Práctica «Raíz cuadrada con cuadrados» (reparto-practicas-u2, tarea 22): la
// lógica se prueba por fuerza bruta, con definiciones independientes (un bucle
// que busca el mayor k con k · k ≤ n), no con las funciones de la propia práctica.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  generarForma, generarExacta, generarEntera, generarPuede, generarSinDibujo, generarProblema,
  cuadradoMasGrande, fichasEnLado, esPosible, MAX_FICHAS, LADO_MAXIMO, PLANTILLAS,
} from '../practicas/raiz/logica.js';
import { practicaPorSlug } from '../practicas/_comun/catalogo.js';

const N = 3000;
const generarN = (fn, semilla = 11) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => fn(rng)); };

/** Fuerza bruta: el mayor k con k · k ≤ n. */
function raizBruta(n) {
  let k = 0;
  while ((k + 1) * (k + 1) <= n) k++;
  return k;
}

function coherente(it) {
  const k = raizBruta(it.n);
  assert.equal(it.raiz, k, `raíz entera de ${it.n}`);
  assert.equal(it.resto, it.n - k * k, `resto de ${it.n}`);
  assert.ok(it.resto >= 0 && it.resto <= 2 * k, `resto ${it.resto} fuera de 0..${2 * k}`);
}

test('el catálogo tiene la práctica raiz con 3 ejercicios', () => {
  assert.equal(practicaPorSlug('raiz').nEjercicios, 3);
});

test('cuadradoMasGrande y fichasEnLado coinciden con la fuerza bruta', () => {
  for (let n = 0; n <= 450; n++) {
    const k = raizBruta(n);
    assert.deepEqual(cuadradoMasGrande(n), { raiz: k, resto: n - k * k });
    for (let s = 1; s <= LADO_MAXIMO; s++) {
      const f = fichasEnLado(n, s);
      assert.equal(f.completo, s * s <= n);
      assert.equal(f.dentro, Math.min(n, s * s));
      assert.equal(f.sobran, n - f.dentro);
    }
  }
});

test('esPosible: hay un n con raíz entera k y resto r si y solo si 0 ≤ r ≤ 2k', () => {
  for (let k = 1; k <= 25; k++) {
    for (let r = -2; r <= 3 * k + 3; r++) {
      const n = k * k + r;
      const existe = n >= 0 && raizBruta(n) === k && n - k * k === r;
      assert.equal(esPosible(k, r), existe, `k=${k} r=${r}`);
    }
  }
});

test('ejercicio 1: ítems coherentes, n ≤ 150 y el lado cabe en el deslizador', () => {
  const items = generarN(generarForma);
  for (const it of items) {
    assert.equal(it.tipo, 'forma');
    coherente(it);
    assert.ok(it.n >= 4 && it.n <= MAX_FICHAS, `n=${it.n}`);
    assert.ok(it.raiz + 1 <= LADO_MAXIMO, 'el lado siguiente tiene que poder elegirse');
  }
  const exactos = items.filter(i => i.resto === 0).length / N;
  assert.ok(exactos > 0.35 && exactos < 0.45, `cuota de cuadrados perfectos ${exactos}`);
  assert.ok(new Set(items.map(i => i.n)).size > 60, 'poca variedad de n');
  assert.ok(items.some(i => i.raiz === 12 && i.resto > 0), 'falta algún 12 con resto');
});

test('ejercicio 2: raíz exacta, cuadrados perfectos hasta 400, sin tipos repetidos', () => {
  for (const it of generarN(generarExacta)) {
    coherente(it);
    assert.equal(it.resto, 0);
    assert.ok(it.n >= 4 && it.n <= 400);
    assert.ok(Number.isInteger(Math.sqrt(it.n)));
  }
});

test('ejercicio 2: raíz entera y resto, n ≤ 400', () => {
  const items = generarN(generarEntera);
  for (const it of items) { coherente(it); assert.ok(it.n <= 400 && it.n >= 9); }
  const exactos = items.filter(i => i.resto === 0).length / N;
  assert.ok(exactos > 0.1 && exactos < 0.2, `exactos ${exactos}`);
});

test('ejercicio 2: «¿puede ser?» es Sí exactamente cuando el resto no llega a 2k + 1', () => {
  const items = generarN(generarPuede);
  for (const it of items) {
    // Definición independiente: ¿existe algún n con raíz entera k y resto r?
    let existe = false;
    for (let n = it.raiz * it.raiz; n <= it.raiz * it.raiz + 3 * it.raiz + 3; n++) {
      if (raizBruta(n) === it.raiz && n - it.raiz * it.raiz === it.resto) existe = true;
    }
    assert.equal(it.puede, existe, `k=${it.raiz} r=${it.resto}`);
    assert.equal(it.n, it.raiz * it.raiz + it.resto);
    if (!it.puede) assert.ok(it.resto >= 2 * it.raiz + 1);
  }
  const si = items.filter(i => i.puede).length / N;
  assert.ok(si > 0.4 && si < 0.6, `cuota de Sí ${si}`);
  // Los casos del borde salen: resto 2k (Sí) y resto 2k + 1 (No).
  assert.ok(items.some(i => i.puede && i.resto === 2 * i.raiz));
  assert.ok(items.some(i => !i.puede && i.resto === 2 * i.raiz + 1));
});

test('ejercicio 2: la mezcla tiene los tres tipos y ninguna respuesta Sí/No domina', () => {
  const items = generarN(generarSinDibujo);
  const cuenta = tipo => items.filter(i => i.tipo === tipo).length / N;
  assert.ok(Math.abs(cuenta('exacta') - 0.3) < 0.05);
  assert.ok(Math.abs(cuenta('entera') - 0.4) < 0.05);
  assert.ok(Math.abs(cuenta('puede') - 0.3) < 0.05);
  for (const it of items) if (it.tipo !== 'puede') coherente(it);
  const puede = items.filter(i => i.tipo === 'puede');
  const si = puede.filter(i => i.puede).length / puede.length;
  assert.ok(si < 0.7 && si > 0.3, `Sí ${si}`);
});

test('ejercicio 3: problemas coherentes, con uno o dos campos según la plantilla', () => {
  const items = generarN(generarProblema);
  for (const it of items) {
    coherente(it);
    assert.ok(PLANTILLAS.includes(it.plantilla));
    if (it.plantilla === 'lado') {
      assert.equal(it.dosCampos, false);
      assert.equal(it.resto, 0);
      assert.ok(it.n >= 25 && it.n <= 400);
    } else {
      assert.equal(it.dosCampos, true);
      assert.ok(it.resto >= 1);
    }
  }
  for (const p of PLANTILLAS) {
    const cuota = items.filter(i => i.plantilla === p).length / N;
    assert.ok(cuota > 0.25 && cuota < 0.42, `${p} ${cuota}`);
  }
});

test('con la misma semilla salen los mismos ítems (y con otra, distintos)', () => {
  const a = generarN(generarSinDibujo, 5).slice(0, 50);
  const b = generarN(generarSinDibujo, 5).slice(0, 50);
  const c = generarN(generarSinDibujo, 6).slice(0, 50);
  assert.deepEqual(a, b);
  assert.notDeepEqual(a, c);
});
