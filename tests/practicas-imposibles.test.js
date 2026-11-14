// Práctica «Detector de imposibles»: se comprueba por fuerza bruta contra
// definiciones de m.c.d./m.c.m. independientes de `aritmetica.js` (no se
// reutiliza la implementación que también usa `logica.js`).

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { generarPuede, generarProducto, generarNombrar, valorExpr } from '../practicas/imposibles/logica.js';
import { BANCO_NOMBRAR } from '../practicas/imposibles/textos.js';

function mcdBF(...ns) {
  const minimo = Math.min(...ns);
  for (let d = minimo; d >= 1; d--) if (ns.every(n => n % d === 0)) return d;
  return 1;
}

function mcmBF(...ns) {
  let k = Math.max(...ns);
  while (!ns.every(n => k % n === 0)) k += 1;
  return k;
}

// ─── Ejercicio 1: ¿Puede ser? ───────────────────────────────────────────────

test('ejercicio 1: "puede" es verdad exactamente cuando propuesto === verdadero (fuerza bruta)', () => {
  const rng = crearRng(101);
  for (let i = 0; i < 3000; i++) {
    const item = generarPuede(rng);
    const real = item.cantidad === 'mcd' ? mcdBF(item.a, item.b) : mcmBF(item.a, item.b);
    assert.equal(item.verdadero, real);
    assert.equal(item.puede, item.propuesto === item.verdadero);
  }
});

test('ejercicio 1: cuando "puede" es falso, el propuesto viola de verdad una desigualdad', () => {
  const rng = crearRng(202);
  for (let i = 0; i < 3000; i++) {
    const item = generarPuede(rng);
    if (item.puede) continue;
    if (item.cantidad === 'mcd') {
      assert.ok(item.propuesto === 0 || item.propuesto > Math.min(item.a, item.b), JSON.stringify(item));
    } else {
      assert.ok(item.propuesto < Math.max(item.a, item.b), JSON.stringify(item));
    }
    assert.notEqual(item.propuesto, item.verdadero);
  }
});

test('ejercicio 1: un m.c.m. propuesto igual al mayor dato nunca se trata como violación', () => {
  const rng = crearRng(303);
  for (let i = 0; i < 3000; i++) {
    const item = generarPuede(rng);
    if (item.cantidad === 'mcm' && !item.puede) assert.notEqual(item.propuesto, Math.max(item.a, item.b));
  }
});

test('ejercicio 1: "sí" y "no" salen entre el 40 % y el 60 % en 3000 ítems', () => {
  const rng = crearRng(404);
  let si = 0;
  for (let i = 0; i < 3000; i++) if (generarPuede(rng).puede) si++;
  const p = si / 3000;
  assert.ok(p >= 0.4 && p <= 0.6, `proporción de "sí": ${p}`);
});

test('ejercicio 1: los contextos usan la plantilla de su propia clase (mcd/mcm)', () => {
  const rng = crearRng(505);
  for (let i = 0; i < 1000; i++) {
    const item = generarPuede(rng);
    if (item.contexto === null) continue;
    assert.ok(['mcd', 'mcm'].includes(item.cantidad));
    assert.ok(item.contexto >= 0);
  }
});

// ─── Ejercicio 2: la comprobación del producto ─────────────────────────────

test('ejercicio 2: "cuadra" coincide con g · m === a · b (o a · b · c en "tres")', () => {
  const rng = crearRng(606);
  for (let i = 0; i < 3000; i++) {
    const item = generarProducto(rng);
    if (item.tipo === 'producto') {
      assert.equal(item.cuadra, item.g * item.m === item.a * item.b);
    } else {
      assert.equal(item.tipo, 'tres');
      assert.equal(item.cuadra, false);
      assert.notEqual(item.g * item.m, item.a * item.b * item.c);
      assert.equal(item.g, mcdBF(item.a, item.b, item.c));
      assert.equal(item.m, mcmBF(item.a, item.b, item.c));
    }
  }
});

test('ejercicio 2: cuando no cuadra ("producto"), exactamente uno de g o m es el verdadero', () => {
  const rng = crearRng(707);
  for (let i = 0; i < 3000; i++) {
    const item = generarProducto(rng);
    if (item.tipo !== 'producto' || item.cuadra) continue;
    const gReal = mcdBF(item.a, item.b);
    const mReal = mcmBF(item.a, item.b);
    const gBien = item.g === gReal;
    const mBien = item.m === mReal;
    assert.notEqual(gBien, mBien, JSON.stringify(item));
  }
});

test('ejercicio 2: "cuadra" y "no cuadra" se quedan por debajo del 70 % en 3000 ítems', () => {
  const rng = crearRng(808);
  let cuadra = 0;
  for (let i = 0; i < 3000; i++) if (generarProducto(rng).cuadra) cuadra++;
  const p = cuadra / 3000;
  assert.ok(p < 0.7 && 1 - p < 0.7, `proporción de "cuadra": ${p}`);
});

// ─── Ejercicio 3: nómbralo ──────────────────────────────────────────────────

test('ejercicio 3: el banco tiene 12 plantillas, 6 m.c.d. y 6 m.c.m., sin tokens prohibidos', () => {
  const prohibido = ['×', 'HCF', 'factor of'];
  assert.equal(BANCO_NOMBRAR.length, 12);
  assert.equal(BANCO_NOMBRAR.filter(p => p.clase === 'mcd').length, 6);
  assert.equal(BANCO_NOMBRAR.filter(p => p.clase === 'mcm').length, 6);
  const rng = crearRng(909);
  for (const plantilla of BANCO_NOMBRAR) {
    const [a, b] = plantilla.numeros(rng);
    const r = valorExpr(plantilla.clase, a, b);
    for (const texto of [plantilla.es(a, b, r), plantilla.en(a, b, r)]) {
      assert.equal(typeof texto, 'string');
      for (const t of prohibido) assert.ok(!texto.includes(t), `«${t}» en: ${texto}`);
    }
  }
});

test('ejercicio 3: realismo (regla 9): nada de canicas con pulseras ni de corredores con segundos', () => {
  const rng = crearRng(31);
  for (const plantilla of BANCO_NOMBRAR) {
    const [a, b] = plantilla.numeros(rng);
    const r = valorExpr(plantilla.clase, a, b);
    const texto = plantilla.es(a, b, r);
    assert.ok(!(/canicas/i.test(texto) && /pulseras/i.test(texto)), texto);
    assert.ok(!/corredor/i.test(texto), texto);
  }
});

test('ejercicio 3: el valor de la opción correcta es la respuesta real, y las otras tres son distintas', () => {
  const rng = crearRng(1010);
  for (let i = 0; i < 2000; i++) {
    const item = generarNombrar(rng);
    assert.equal(item.opciones.length, 4);
    const valores = item.opciones.map(o => valorExpr(o.fn, o.x, o.y));
    assert.equal(new Set(valores).size, 4, JSON.stringify(item));
    const correcta = item.opciones.find(o => o.valor === item.solucion);
    const real = item.cantidad === 'mcd' ? mcdBF(item.a, item.b) : mcmBF(item.a, item.b);
    assert.equal(valorExpr(correcta.fn, correcta.x, correcta.y), real);
    assert.equal(correcta.fn, item.cantidad);
    assert.equal(correcta.x, item.a);
    assert.equal(correcta.y, item.b);
  }
});

test('ejercicio 3: la clase correcta (m.c.d./m.c.m.) sale entre el 30 % y el 70 % en 2000 ítems', () => {
  const rng = crearRng(1111);
  let mcdCount = 0;
  for (let i = 0; i < 2000; i++) if (generarNombrar(rng).cantidad === 'mcd') mcdCount++;
  const p = mcdCount / 2000;
  assert.ok(p >= 0.3 && p <= 0.7, `proporción m.c.d.: ${p}`);
});

// ─── Reapertura de la tarea 10 ──────────────────────────────────────────────

import { TX } from '../practicas/imposibles/textos.js';

test('ejercicio 1: con contexto nunca se propone 0, y con 1 el sustantivo va en singular', () => {
  const rng = crearRng(1212);
  let unos = 0;
  for (let i = 0; i < 6000; i++) {
    const item = generarPuede(rng);
    if (item.contexto === null) continue;
    assert.notEqual(item.propuesto, 0, JSON.stringify(item));
    const p = TX.contextos[item.cantidad][item.contexto];
    for (const texto of [p.es(item.a, item.b, item.propuesto), p.en(item.a, item.b, item.propuesto)]) {
      assert.ok(!/\b1 (grupos|bolsas|minutos|segundos|groups|bags|minutes|seconds)\b/.test(texto), texto);
      assert.ok(!/Pueden salir 1 /.test(texto), texto);
      if (item.propuesto === 1 && item.cantidad === 'mcd') assert.match(texto, /Puede salir 1 |Can there be 1 /);
      assert.ok(!/de cada cosa|of each\b/.test(texto), texto);
    }
    if (item.propuesto === 1) unos++;
  }
  assert.ok(unos > 0, 'el caso 1 tiene que salir alguna vez para que el test valga');
});

test('ejercicio 1: el enunciado de m.c.d. dice «todos con el mismo número de…», y el feedback nombra la cantidad', () => {
  const p = TX.contextos.mcd[0];
  assert.ok(p.es(24, 36, 12).includes('todos con el mismo número de lápices y todos con el mismo número de gomas'));
  assert.ok(p.en(24, 36, 12).includes('all with the same number of pencils and all with the same number of erasers'));
  assert.ok(TX.feedbackPuede.contexto.mcd.es(24, 36).includes('m.c.d.(24, 36)'));
  assert.ok(TX.feedbackPuede.correcto.mcd.es(12, 24, 36).includes('12 divide a 24 y a 36'));
  assert.ok(TX.feedbackPuede.correcto.mcm.es(72, 24, 36).includes('múltiplo de 24 y de 36'));
});

test('ejercicio 3: en los mini-problemas de m.c.d. con bolsas/cestas/cajas/pulseras, r es el NÚMERO de piezas, con «el mayor número posible»', () => {
  const rng = crearRng(1313);
  const nombres = /bolsas|cestas|cajas|pulseras/;
  let revisadas = 0;
  for (const p of BANCO_NOMBRAR) {
    const [a, b] = p.numeros(rng);
    const r = valorExpr(p.clase, a, b);
    const es = p.es(a, b, r), en = p.en(a, b, r);
    assert.ok(!/de cada cosa|of each\b|piezas de cada/.test(es + en), es);
    if (p.clase === 'mcd' && nombres.test(es)) {
      revisadas++;
      assert.ok(es.includes('el mayor número posible de'), es);
      assert.ok(en.includes('the largest possible number of'), en);
      assert.ok(es.includes(`salen ${r} `) && en.includes(`you get ${r} `), es);
      // Por fuerza bruta: el mayor número de bolsas iguales sin sobras es r.
      let mejor = 0;
      for (let n = 1; n <= Math.min(a, b); n++) if (a % n === 0 && b % n === 0) mejor = n;
      assert.equal(mejor, r);
    }
  }
  assert.equal(revisadas, 4);
});

test('ejercicio 1: el prefijo del feedback de m.c.d. nombra lo que dice el enunciado (grupos / bolsas)', () => {
  const f = TX.feedbackPuede.contexto.mcd;
  assert.match(f.es(24, 36, 0), /número de grupos/);
  assert.match(f.es(13, 11, 1), /número de bolsas/);
  assert.match(f.en(24, 36, 0), /number of groups/);
  assert.match(f.en(13, 11, 1), /number of bags/);
});

// ─── Reapertura de la tarea 10 (decisiones del 14-11) ───────────────────────

import { feedbackPuede, feedbackProducto } from '../practicas/imposibles/logica.js';

test('ejercicio 1: con contexto de m.c.d., mcd(a, b) ≥ 2 siempre; sin contexto sigue saliendo el m.c.d. 1', () => {
  const rng = crearRng(1414);
  let sinContextoCoprimos = 0;
  const veces = new Map();
  let contextoMcd = 0;
  for (let i = 0; i < 20000; i++) {
    const item = generarPuede(rng);
    if (item.contexto !== null) {
      assert.ok(item.a >= 3 && item.a <= 20 && item.b >= 3 && item.b <= 20, JSON.stringify(item));
      if (item.cantidad === 'mcd') {
        assert.ok(mcdBF(item.a, item.b) >= 2, JSON.stringify(item));
        assert.equal(item.verdadero, mcdBF(item.a, item.b));
        contextoMcd++;
        const clave = `${Math.min(item.a, item.b)}-${Math.max(item.a, item.b)}`;
        veces.set(clave, (veces.get(clave) || 0) + 1);
      }
    } else if (mcdBF(item.a, item.b) === 1) sinContextoCoprimos++;
  }
  assert.ok(contextoMcd > 2000, `ítems de m.c.d. con contexto: ${contextoMcd}`);
  assert.ok(sinContextoCoprimos > 0, 'sin contexto el m.c.d. 1 tiene que salir');
  assert.ok(Math.max(...veces.values()) / contextoMcd < 0.1, 'ninguna pareja pasa del 10 %');
  assert.ok(veces.size > 40, `parejas distintas: ${veces.size}`);
});

test('ejercicio 2, tres números: distintos, g · m ≠ a · b · c siempre, y los valores son los de verdad', () => {
  const rng = crearRng(1515);
  let tres = 0;
  for (let i = 0; i < 5000; i++) {
    const item = generarProducto(rng);
    if (item.tipo !== 'tres') continue;
    tres++;
    assert.equal(new Set([item.a, item.b, item.c]).size, 3, JSON.stringify(item));
    assert.equal(item.g, mcdBF(item.a, item.b, item.c));
    assert.equal(item.m, mcmBF(item.a, item.b, item.c));
    assert.notEqual(item.g * item.m, item.a * item.b * item.c, JSON.stringify(item));
    assert.equal(item.cuadra, false);
  }
  assert.ok(tres > 500, `ítems de tres números: ${tres}`);
});

test('ejercicio 2, tres números: el feedback dice que la comprobación no vale, sin la regla falsa, y hace la cuenta', () => {
  const item = { tipo: 'tres', a: 6, b: 8, c: 10, g: 2, m: 120, cuadra: false };
  for (const idioma of ['es', 'en']) {
    const f = feedbackProducto(item, idioma);
    assert.ok(!/ya no coincide|no longer matches|2, 4, 8|2, 4 and 8/.test(f), f);
    assert.ok(f.includes('2 · 120 = 240') && f.includes('6 · 8 · 10 = 480'), f);
  }
  assert.match(feedbackProducto(item, 'es'), /a veces coincide y a veces no/);
  assert.match(feedbackProducto(item, 'en'), /sometimes it matches and sometimes it does not/);
});

test('ejercicio 1: ningún feedback lleva «<» ni «>» sueltos (HTML mal formado)', () => {
  const rng = crearRng(1616);
  for (let i = 0; i < 3000; i++) {
    const item = generarPuede(rng);
    for (const idioma of ['es', 'en']) {
      const f = feedbackPuede(item, idioma);
      assert.ok(!/[<>]/.test(f), f);
    }
  }
  for (const idioma of ['es', 'en']) {
    assert.match(feedbackPuede({ cantidad: 'mcm', puede: false, violacion: 'menor', propuesto: 12, a: 18, b: 24, contexto: null }, idioma), idioma === 'es' ? /12 es menor que 24/ : /12 is smaller than 24/);
    assert.match(feedbackPuede({ cantidad: 'mcd', puede: false, violacion: 'mayor', propuesto: 72, a: 24, b: 36, contexto: null }, idioma), idioma === 'es' ? /72 es mayor que 24/ : /72 is bigger than 24/);
  }
});
