// Práctica «Subidas, bajadas y diferencias» (PU2, tarea 90): la lógica y los textos se prueban por
// fuerza bruta con semillas fijas (3000 ítems por ejercicio). Las cuentas se calculan con un
// evaluador propio (JavaScript), no con las funciones de la práctica.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { ERRORES_TIPICOS } from '../practicas/_comun/enteros.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import * as L from '../practicas/variacion/logica.js';
import { txt, NOMBRES, INTRODUCCION } from '../practicas/variacion/textos.js';

const N = 3000;
const generar = (fn, semilla = 23) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => fn(rng)); };
const js = texto => Function(`"use strict"; return (${texto.replace(/−/g, '-').replace(/·/g, '*').replace(/:/g, '/')});`)();

test('contextos: cotas coherentes y enCota', () => {
  for (const ctx of L.IDS) {
    const c = L.CONTEXTOS[ctx];
    assert.ok(c.min < c.max && c.maxVar > 0);
    assert.ok(L.enCota(ctx, c.min) && L.enCota(ctx, c.max));
    assert.ok(!L.enCota(ctx, c.min - 1) && !L.enCota(ctx, c.max + 1) && !L.enCota(ctx, 1.5));
  }
});

test('ejercicio 1: dentro de la cota, nunca variación 0, la frase buena concuerda con el signo y las otras dos son errores con nombre', () => {
  const vistos = new Set();
  for (const item of generar(L.generarCambio)) {
    const c = L.CONTEXTOS[item.ctx];
    vistos.add(item.ctx);
    for (const x of [item.i, item.f]) assert.ok(L.enCota(item.ctx, x) && x !== 0 && x % c.paso === 0, `${item.ctx}: ${x}`);
    assert.equal(item.v, item.f - item.i);
    assert.ok(item.v !== 0 && Math.abs(item.v) <= c.maxVar);
    assert.equal(item.opciones.length, 3);
    assert.equal(new Set(item.opciones.map(o => `${o.dir}|${o.k}`)).size, 3, 'frases repetidas');
    const buenas = item.opciones.filter(o => o.error === null);
    assert.equal(buenas.length, 1);
    assert.equal(item.opciones[item.solucion], buenas[0]);
    assert.equal(buenas[0].dir, item.f > item.i ? 'sube' : 'baja');
    assert.equal(buenas[0].k, Math.abs(item.f - item.i));
    for (const o of item.opciones.filter(o => o.error)) {
      assert.ok(ERRORES_TIPICOS[o.error] || L.ERRORES_PROPIOS[o.error], o.error);
      assert.ok(L.nombreError(o.error).es && L.nombreError(o.error).en);
      assert.ok(o.k > 0);
    }
  }
  assert.deepEqual([...vistos].sort(), [...L.IDS].sort());
});

test('ejercicio 2: el mayor menos el menor, siempre positivo, con cada par en su rango', () => {
  const vistos = new Set();
  for (const item of generar(L.generarDiferencia)) {
    const par = L.PARES[item.par];
    vistos.add(item.par);
    assert.ok(item.lo >= par.bajo.rango[0] && item.lo <= par.bajo.rango[1] && item.lo !== 0);
    assert.ok(item.hi >= par.alto.rango[0] && item.hi <= par.alto.rango[1]);
    assert.ok(item.hi > item.lo);
    assert.equal(item.d, item.hi - item.lo);
    assert.ok(item.d > 0);
    if (par.tipo === 'altura') assert.ok(item.lo % 10 === 0 && item.hi % 10 === 0);
    if (par.tipo === 'planta') assert.ok(item.hi <= L.CONTEXTOS.planta.max && item.lo >= L.CONTEXTOS.planta.min);
    // Los errores se reconocen y nunca coinciden con la respuesta buena.
    assert.equal(L.errorDiferencia(item, item.d), null);
    assert.equal(L.errorDiferencia(item, -item.d), 'inicial-menos-final');
    assert.notEqual(L.errorDiferencia(item, Math.abs(Math.abs(item.lo) - Math.abs(item.hi))), 'suma-sin-signo');
  }
  assert.equal(vistos.size, Object.keys(L.PARES).length);
  // Rangos que no se solapan: «cuánto más» no puede ser negativo.
  for (const p of Object.values(L.PARES)) assert.ok(p.bajo.rango[1] < p.alto.rango[0]);
  // Temperaturas creíbles para esas ciudades.
  for (const k of ['burgos-malaga', 'moscu-murcia']) for (const lado of ['bajo', 'alto']) {
    const [a, b] = L.PARES[k][lado].rango;
    assert.ok(a >= -30 && b <= 45);
  }
});

test('ejercicio 3: dentro de la cota, ni dato ni resultado en 0, y los errores se reconocen', () => {
  const por = {};
  for (const item of generar(L.generarFalta)) {
    por[item.subtipo] = (por[item.subtipo] ?? 0) + 1;
    const c = L.CONTEXTOS[item.ctx];
    assert.ok(L.enCota(item.ctx, item.x) && L.enCota(item.ctx, item.r) && item.x !== 0 && item.r !== 0);
    assert.ok(item.k >= 1 && item.k <= c.maxVar && item.k % c.paso === 0);
    assert.ok(item.dir === 1 || item.dir === -1);
    assert.equal(item.r, item.subtipo === 'final' ? item.x + item.dir * item.k : item.x - item.dir * item.k);
    assert.equal(L.errorFalta(item, item.r), null);
    assert.equal(L.errorFalta(item, -item.r), 'signo-cambiado');
    const mal = item.subtipo === 'final' ? item.x - item.dir * item.k : item.x + item.dir * item.k;
    if (mal !== item.r && mal !== -item.r) assert.equal(L.errorFalta(item, mal), 'resta-en-vez-de-suma');
  }
  assert.ok(por.final > N * 0.45 && por.inicial > N * 0.45, JSON.stringify(por));
});

test('ejercicio 4: años de la misma era, el más antiguo primero, nunca los de la hoja y sin cruzar el año 0', () => {
  const eras = {};
  for (const item of generar(L.generarAnios)) {
    eras[item.era] = (eras[item.era] ?? 0) + 1;
    for (const y of [item.a, item.b]) {
      assert.ok(y >= 50 && y <= (item.era === 'aC' ? 2700 : 2026), `${item.era} ${y}`);
      assert.ok(y !== 753 && y !== 476);
    }
    assert.ok(item.d >= 20 && item.d !== 1229);
    assert.equal(item.d, Math.abs(item.a - item.b));
    // El más antiguo va primero: en a. C. es el número mayor; en d. C., el menor.
    if (item.era === 'aC') assert.ok(item.a > item.b); else assert.ok(item.a < item.b);
    assert.equal(L.errorAnios(item, item.d), null);
    assert.equal(L.errorAnios(item, item.a + item.b), 'suma-sin-signo');
  }
  assert.ok(eras.aC > N * 0.45 && eras.dC > N * 0.45, JSON.stringify(eras));
});

test('ejercicio 5: la cuenta buena vale el resultado, las malas no, y un tercio son producto o cociente', () => {
  const por = {};
  for (const item of generar(L.generarCuenta)) {
    por[item.tipo] = (por[item.tipo] ?? 0) + 1;
    assert.equal(item.opciones.length, 3);
    assert.equal(new Set(item.opciones.map(o => o.texto)).size, 3);
    const buena = item.opciones[item.solucion];
    assert.equal(buena.error, null);
    assert.equal(js(buena.texto), item.r, buena.texto);
    for (const o of item.opciones.filter((_, i) => i !== item.solucion)) {
      assert.notEqual(js(o.texto), item.r, `${o.texto} vale lo mismo que ${buena.texto}`);
      assert.ok(o.error && (ERRORES_TIPICOS[o.error] || L.ERRORES_PROPIOS[o.error]), o.error);
    }
    assert.ok(item.r !== 0);
    assert.equal(item.signo, item.r > 0 ? 'positivo' : 'negativo');
    if (item.tipo === 'cadena') {
      const [s, t2, t3] = item.terminos;
      assert.equal(js(L.terminos(item.terminos)), item.r);
      assert.equal(s + t2 + t3, item.r);
      for (const v of [s, s + t2, item.r]) assert.ok(L.enCota(item.ctx, v), `${item.ctx}: ${v}`);
      assert.ok(s !== 0 && Math.abs(t2) >= 1 && Math.abs(t3) >= 1);
    } else {
      const p = L.PRODUCTO[item.ctx];
      assert.ok(p, item.ctx);
      assert.ok(Math.abs(item.n * item.c) <= p.total || Math.abs(item.total) <= p.total);
      assert.ok(item.n >= p.n[0] && item.n <= p.n[1]);
      if (item.tipo === 'producto') {
        assert.equal(item.r, item.n * item.c);
        assert.ok(Math.abs(item.c) >= p.d[0] && Math.abs(item.c) <= p.d[1]);
      } else {
        assert.ok(item.total % item.n === 0, 'cociente no exacto');
        assert.equal(item.r, item.total / item.n);
        assert.ok(item.total < 0);
      }
    }
  }
  const resto = (por.producto ?? 0) + (por.cociente ?? 0);
  assert.ok(resto > N * 0.28 && resto < N * 0.38, `producto/cociente: ${resto}`);
  assert.ok(por.cadena && por.producto && por.cociente);
});

test('todos los textos, en los dos idiomas: sin ×, sin guion como menos, sin (+, sin undefined ni NaN', () => {
  const textos = [];
  const recoger = o => { if (o && typeof o === 'object') for (const t of ['es', 'en']) textos.push(o[t]); };
  for (const [i, tipo] of [[0, L.generarCambio], [1, L.generarDiferencia], [2, L.generarFalta], [3, L.generarAnios], [4, L.generarCuenta]]) {
    recoger(NOMBRES.nombre[i]); recoger(NOMBRES.detalle[i]); recoger(INTRODUCCION[i]);
    for (const item of generar(tipo, 7 + i).slice(0, 600)) {
      for (const idioma of ['es', 'en']) {
        const T = txt(idioma);
        const bloque = {
          cambio: () => [T.cambio.enunciado(item), T.cambio.explica(item), ...item.opciones.map(o => T.cambio.frase(item.ctx, o.dir, o.k))],
          diferencia: () => [T.diferencia.enunciado(item), T.diferencia.explica(item), T.unidad(item)],
          falta: () => [T.falta.enunciado(item), T.falta.explica(item)],
          anios: () => [T.anios.enunciado(item), T.anios.explica(item), T.unidad(item)],
          cadena: () => [T.cuenta.enunciado(item), T.cuenta.explica(item)],
          producto: () => [T.cuenta.enunciado(item), T.cuenta.explica(item)],
          cociente: () => [T.cuenta.enunciado(item), T.cuenta.explica(item)],
        }[item.tipo]();
        textos.push(...bloque);
        for (const o of item.opciones ?? []) if (o.error) textos.push(T.errorNombre(o.error));
      }
    }
  }
  for (const t of textos) {
    assert.ok(typeof t === 'string' && t.length > 3, String(t));
    assert.doesNotMatch(t, /×/, t);
    assert.doesNotMatch(t, /\(\+/, t);
    assert.doesNotMatch(t, /(^|[\s(])-\d/, `guion como menos: ${t}`);
    assert.doesNotMatch(t, /undefined|NaN|\[object/, t);
  }
});

test('el inglés aclara las palabras que deciden la respuesta (balance, bajo el nivel del mar, BC, AD)', () => {
  const en = txt('en');
  assert.match(en.cambio.enunciado({ ctx: 'saldo', i: 10, f: 20 }), /balance \(saldo\)/);
  assert.match(en.diferencia.enunciado({ par: 'altura', lo: -50, hi: 600 }), /below sea level \(bajo el nivel del mar\)/);
  assert.match(en.anios.enunciado({ era: 'aC', a: 500, b: 200 }), /BC \(a\. C\.\)/);
  assert.match(en.anios.enunciado({ era: 'dC', a: 500, b: 800 }), /AD \(d\. C\.\)/);
  assert.match(en.diferencia.enunciado({ par: 'planta', lo: -2, hi: 5 }), /floors/);
});

test('el catálogo declara 5 ejercicios y la práctica los tiene todos', () => {
  assert.equal(CATALOGO.find(f => f.slug === 'variacion').nEjercicios, 5);
  assert.equal(NOMBRES.nombre.length, 5);
  assert.equal(INTRODUCCION.length, 5);
  const [a, b] = generar(L.generarCambio, 3);
  assert.notEqual(L.claveItem(a), L.claveItem(b));
});
