// Árbol de factores (practicas/arbol/): generadores y comprobaciones por fuerza
// bruta, con definiciones independientes de las de logica.js y de
// _comun/aritmetica.js (no se prueba la función contra sí misma).

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { factorizar } from '../practicas/_comun/aritmetica.js';
import {
  generar, parejasPropias, arbolAlAzar, hojasPrimas, factorizacionDe, formaDe, tieneVariosArboles,
  rutasDe, nodoEn, porQueCompuesto, explicar, MAXIMO_DE_HOJAS, DISFRAZADOS, PRIMOS_GRANDES,
  esCorrectaCompletar, solucionCompletar, solucionesCompletar, ramasMal,
} from '../practicas/arbol/logica.js';

const N = 2000;

// --- Definiciones independientes, por fuerza bruta ------------------------------

const esPrimoBruto = n => {
  if (n < 2) return false;
  for (let d = 2; d < n; d++) if (n % d === 0) return false;
  return true;
};

/** Los factores primos de n, repetidos y de menor a mayor: 360 → [2, 2, 2, 3, 3, 5]. */
const primosBrutos = n => {
  const lista = [];
  for (let d = 2; n > 1; d++) while (n % d === 0) { lista.push(d); n /= d; }
  return lista;
};

/** [[2, 3], [3, 2]] → [2, 2, 2, 3, 3]. */
const desplegar = f => f.flatMap(([p, e]) => Array(e).fill(p));

/** Todo nodo partido vale el producto de sus dos hijos, y toda hoja es prima. */
const comprobarArbol = arbol => {
  if (!arbol.hijos.length) return assert.ok(esPrimoBruto(arbol.valor), `la hoja ${arbol.valor} no es prima`);
  assert.equal(arbol.hijos.length, 2);
  const [a, b] = arbol.hijos;
  assert.ok(a.valor > 1 && b.valor > 1, `${arbol.valor} partido con un 1`);
  assert.equal(a.valor * b.valor, arbol.valor);
  arbol.hijos.forEach(comprobarArbol);
};

/** Todas las formas de elegir k fichas distintas del banco, en orden. */
const repartosBrutos = (banco, k) => {
  if (k === 0) return [[]];
  return banco.flatMap((v, i) => repartosBrutos(banco.filter((_, j) => j !== i), k - 1).map(resto => [v, ...resto]));
};

/** ¿Cuadran todas las ramas del árbol con esos números en los huecos? Sin usar logica.js. */
const cuadraBruto = (item, valores) => {
  const valorEn = ruta => (item.huecos.includes(ruta) ? valores[item.huecos.indexOf(ruta)] : [...ruta].reduce((nodo, i) => nodo.hijos[i], item.arbol).valor);
  const revisar = (nodo, ruta) => !nodo.hijos.length
    || (valorEn(ruta + '0') * valorEn(ruta + '1') === valorEn(ruta) && nodo.hijos.every((h, i) => revisar(h, ruta + i)));
  return revisar(item.arbol, '');
};

// --- Árboles ---------------------------------------------------------------------

test('parejasPropias: todas las parejas de divisores salvo «1 · n», por fuerza bruta', () => {
  for (let n = 2; n <= 520; n++) {
    const brutas = [];
    for (let a = 2; a * a <= n; a++) if (n % a === 0) brutas.push([a, n / a]);
    assert.deepEqual(parejasPropias(n), brutas);
    assert.equal(parejasPropias(n).length === 0, esPrimoBruto(n));
  }
  assert.deepEqual(parejasPropias(60), [[2, 30], [3, 20], [4, 15], [5, 12], [6, 10]]);
  assert.deepEqual(parejasPropias(121), [[11, 11]]);
});

test('arbolAlAzar: en 2000 árboles cada nodo es el producto de sus hijos y la factorización es la de n', () => {
  const rng = crearRng(601);
  for (let i = 0; i < N; i++) {
    const n = rng.entero(2, 520);
    const arbol = arbolAlAzar(n, rng);
    assert.equal(arbol.valor, n);
    comprobarArbol(arbol);
    assert.deepEqual(hojasPrimas(arbol), primosBrutos(n));
    assert.deepEqual(factorizacionDe(arbol), factorizar(n));
    assert.deepEqual(desplegar(factorizacionDe(arbol)), primosBrutos(n));
  }
});

test('el árbol cambia pero la factorización no: 360 tiene muchos árboles y todos dan 2³ · 3² · 5', () => {
  const rng = crearRng(602);
  const formas = new Set();
  for (let i = 0; i < 300; i++) {
    const arbol = arbolAlAzar(360, rng);
    formas.add(formaDe(arbol));
    assert.deepEqual(factorizacionDe(arbol), [[2, 3], [3, 2], [5, 1]]);
  }
  assert.ok(formas.size > 10);
});

test('formaDe no distingue el orden de las ramas; tieneVariosArboles acierta con 8, 12, 16, 143', () => {
  const hoja = valor => ({ valor, hijos: [] });
  const a = { valor: 12, hijos: [hoja(3), { valor: 4, hijos: [hoja(2), hoja(2)] }] };
  const b = { valor: 12, hijos: [{ valor: 4, hijos: [hoja(2), hoja(2)] }, hoja(3)] };
  const c = { valor: 12, hijos: [hoja(2), { valor: 6, hijos: [hoja(2), hoja(3)] }] };
  assert.equal(formaDe(a), formaDe(b));
  assert.notEqual(formaDe(a), formaDe(c));
  assert.deepEqual([8, 27, 143, 13].map(tieneVariosArboles), [false, false, false, false]);
  assert.deepEqual([12, 16, 30, 242].map(tieneVariosArboles), [true, true, true, true]);
  // Por fuerza bruta: hay varios árboles si al generar muchos sale más de una forma.
  const rng = crearRng(603);
  for (let n = 4; n <= 120; n++) {
    const formas = new Set(Array.from({ length: 60 }, () => formaDe(arbolAlAzar(n, rng))));
    assert.equal(tieneVariosArboles(n), formas.size > 1, `n = ${n}`);
  }
});

test('rutasDe y nodoEn recorren el árbol entero', () => {
  const rng = crearRng(604);
  const arbol = arbolAlAzar(360, rng);
  const rutas = rutasDe(arbol);
  assert.equal(rutas[0], '');
  assert.equal(rutas.length, 11);                      // 6 hojas y 5 nodos partidos
  assert.equal(new Set(rutas).size, rutas.length);
  assert.equal(nodoEn(arbol, '').valor, 360);
  for (const ruta of rutas.slice(1)) assert.ok(nodoEn(arbol, ruta.slice(0, -1)).hijos.includes(nodoEn(arbol, ruta)));
});

// --- Ejercicio 1: construye el árbol ----------------------------------------------

test('construir: n compuesto con 3 a 6 hojas, y uno de cada cuatro con factor 11 o 13', () => {
  const rng = crearRng(611);
  let onceTrece = 0;
  const vistos = new Set();
  for (let i = 0; i < N; i++) {
    const item = generar('construir', rng);
    assert.equal(item.tipo, 'construir');
    const primos = primosBrutos(item.n);
    assert.ok(item.n >= 24 && item.n <= 507, `n = ${item.n}`);
    assert.ok(primos.length >= 3 && primos.length <= MAXIMO_DE_HOJAS, `${item.n} tiene ${primos.length} hojas`);
    assert.ok(primos.at(-1) <= 19, `${item.n} tiene un primo demasiado grande`);
    if (item.n > 400) assert.ok([429, 455, 507].includes(item.n));
    if (primos.includes(11) || primos.includes(13)) onceTrece++;
    vistos.add(item.n);
    // El alumno siempre tiene dónde elegir, y nunca «1 · n».
    assert.ok(parejasPropias(item.n).length >= 1);
  }
  assert.ok(onceTrece > N * 0.2 && onceTrece < N * 0.3, `con 11 o 13: ${onceTrece}`);
  for (const n of [242, 286, 338, 363, 385, 360]) assert.ok(vistos.has(n), `nunca sale ${n}`);
  assert.ok(!vistos.has(384), '384 tiene 8 hojas: no cabe en 375 px');
});

// --- Ejercicio 2: ¿está terminada? --------------------------------------------------

test('terminada: la igualdad siempre es verdad, y está terminada exactamente cuando todos los factores son primos', () => {
  const rng = crearRng(621);
  let si = 0, disfrazados = 0, grandes = 0, onceTrece = 0;
  for (let i = 0; i < N; i++) {
    const item = generar('terminada', rng);
    assert.equal(item.tipo, 'terminada');
    const bases = item.igualdad.map(([base]) => base);
    const producto = item.igualdad.reduce((v, [base, e]) => v * base ** e, 1);
    assert.equal(producto, item.n, 'la igualdad es falsa como producto');
    assert.ok(item.n <= 999);
    assert.ok(item.igualdad.length >= 2 || item.igualdad[0][1] >= 2, `${item.n} con un solo factor`);
    for (const [base, e] of item.igualdad) assert.ok(base > 1 && e >= 1);
    const todosPrimos = bases.every(esPrimoBruto);
    assert.equal(item.terminada, todosPrimos);
    if (item.terminada) {
      si++;
      assert.equal(item.compuesto, null);
      // Terminada de verdad: es la factorización de n, con las bases de menor a mayor y sin repetir.
      assert.deepEqual(item.igualdad, factorizar(item.n));
      assert.deepEqual(desplegar(item.igualdad), primosBrutos(item.n));
      if (bases.some(b => PRIMOS_GRANDES.includes(b))) grandes++;
    } else {
      // Regla de oro de la segunda parte: hay un solo factor compuesto que tocar, y algún primo que no tocar.
      const compuestos = bases.filter(b => !esPrimoBruto(b));
      assert.deepEqual(compuestos, [item.compuesto]);
      assert.ok(bases.some(esPrimoBruto), `${item.n}: todos los factores son compuestos`);
      assert.equal(item.igualdad.find(([b]) => b === item.compuesto)[1], 1);
      if (DISFRAZADOS.includes(item.compuesto)) disfrazados++;
      const [p, q] = porQueCompuesto(item.compuesto);
      assert.ok(p > 1 && q > 1 && p * q === item.compuesto && esPrimoBruto(p));
      assert.deepEqual(explicar(item).pareja, [p, q]);
    }
    assert.deepEqual(desplegar(explicar(item).factorizacion), primosBrutos(item.n));
    if (primosBrutos(item.n).some(p => p === 11 || p === 13)) onceTrece++;
  }
  // No gana quien pulsa siempre lo mismo.
  assert.ok(si > N * 0.3 && si < N * 0.7, `terminadas: ${si}`);
  assert.ok(disfrazados > N * 0.35 && disfrazados < N * 0.45, `disfrazados: ${disfrazados}`);
  assert.ok(grandes > N * 0.1, `terminadas con un primo grande: ${grandes}`);
  assert.ok(onceTrece > N * 0.3);
});

test('terminada: los disfrazados son compuestos y los primos grandes son primos', () => {
  for (const c of DISFRAZADOS) assert.ok(!esPrimoBruto(c) && c % 2 && c % 3 && c % 5, `${c}`);
  for (const p of PRIMOS_GRANDES) assert.ok(esPrimoBruto(p), `${p}`);
  assert.deepEqual(porQueCompuesto(121), [11, 11]);
  assert.deepEqual(porQueCompuesto(143), [11, 13]);
  assert.deepEqual(porQueCompuesto(91), [7, 13]);
});

// --- Ejercicio 3: completa el árbol ---------------------------------------------------

test('completar: dos o tres huecos (nunca la raíz), una sola solución salvo hermanos, y los dos que sobran no encajan', () => {
  const rng = crearRng(631);
  let conOtro = 0, tres = 0, hermanos = 0;
  for (let i = 0; i < N; i++) {
    const item = generar('completar', rng);
    assert.equal(item.tipo, 'completar');
    assert.equal(item.arbol.valor, item.n);
    comprobarArbol(item.arbol);
    assert.ok(primosBrutos(item.n).length <= 5);
    assert.ok(item.huecos.length === 2 || item.huecos.length === 3);
    assert.equal(new Set(item.huecos).size, item.huecos.length);
    assert.ok(!item.huecos.includes(''), 'la raíz no puede ser un hueco');
    if (item.huecos.length === 3) tres++;

    const faltan = solucionCompletar(item);
    assert.deepEqual(faltan, item.huecos.map(ruta => nodoEn(item.arbol, ruta).valor));
    assert.equal(item.banco.length, faltan.length + 2);
    const sobran = [...item.banco];
    for (const v of faltan) sobran.splice(sobran.indexOf(v), 1);
    assert.equal(sobran.length, 2, 'en el banco no están todos los que faltan');
    assert.equal(new Set(sobran).size, 2);
    for (const s of sobran) assert.ok(s > 1 && !faltan.includes(s), `el distractor ${s} es uno de los que faltan`);

    // Fuerza bruta: todos los repartos del banco en los huecos.
    assert.ok(esCorrectaCompletar(item, faltan));
    assert.ok(cuadraBruto(item, faltan));
    const ordenados = [...faltan].sort((a, b) => a - b).join(',');
    let buenos = 0;
    for (const reparto of repartosBrutos(item.banco, item.huecos.length)) {
      const cuadra = cuadraBruto(item, reparto);
      assert.equal(esCorrectaCompletar(item, reparto), cuadra);
      assert.equal(ramasMal(item, reparto).length === 0, cuadra);
      if (!cuadra) continue;
      buenos++;
      // Regla de oro: ningún reparto correcto usa uno de los que sobran…
      assert.equal([...reparto].sort((a, b) => a - b).join(','), ordenados, `${item.n}: un distractor encaja`);
      // …y si no es el previsto, solo cambia de sitio huecos hermanos.
      reparto.forEach((v, h) => {
        if (v === faltan[h]) return;
        const ruta = item.huecos[h];
        const hermano = item.huecos.indexOf(ruta.slice(0, -1) + (1 - Number(ruta.at(-1))));
        assert.ok(hermano >= 0 && reparto[hermano] === faltan[h] && reparto[h] === faltan[hermano], `${item.n}: otra solución que no es de hermanos`);
      });
    }
    assert.ok(buenos >= 1);
    if (buenos > 1) hermanos++;
    assert.equal(solucionesCompletar(item).length, 1);

    if (item.otro) {
      conOtro++;
      assert.equal(item.otro.valor, item.n);
      comprobarArbol(item.otro);
      assert.notEqual(formaDe(item.otro), formaDe(item.arbol));
      assert.deepEqual(factorizacionDe(item.otro), factorizacionDe(item.arbol));
    }
  }
  assert.ok(conOtro > N * 0.3 && conOtro <= N * 0.55, `con otro árbol: ${conOtro}`);
  assert.ok(tres > N * 0.1, `con tres huecos: ${tres}`);
  assert.ok(hermanos > 0, 'nunca salen huecos hermanos intercambiables');
});

test('completar: ramasMal dice la cuenta de la rama que falla', () => {
  const hoja = valor => ({ valor, hijos: [] });
  const arbol = { valor: 45, hijos: [hoja(3), { valor: 15, hijos: [hoja(3), hoja(5)] }] };
  const item = { tipo: 'completar', n: 45, arbol, huecos: ['0', '1'], banco: [3, 15, 2, 9] };
  assert.ok(esCorrectaCompletar(item, [3, 15]));
  assert.ok(!esCorrectaCompletar(item, [15, 3]));          // 15 no es 3 · 5 si va a la izquierda… y el 3 no es 3 · 5
  assert.deepEqual(ramasMal(item, [2, 15]), [{ ruta: '', a: 2, b: 15, producto: 30, valor: 45 }]);
  assert.ok(!esCorrectaCompletar(item, [3]));
  assert.ok(!esCorrectaCompletar(item, [3, null]));
  // Dos hojas hermanas: cualquier orden vale.
  const dos = { tipo: 'completar', n: 45, arbol, huecos: ['10', '11'], banco: [3, 5, 2, 7] };
  assert.ok(esCorrectaCompletar(dos, [3, 5]) && esCorrectaCompletar(dos, [5, 3]));
  assert.equal(solucionesCompletar(dos).length, 1);
});
