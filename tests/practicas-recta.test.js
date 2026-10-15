// Práctica «Múltiplos y divisores en la recta» (reparto-practicas-u2, tarea
// 04): fuerza bruta con definiciones independientes de las de
// `aritmetica.js`, semilla fija para que el resultado sea reproducible.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  generarMultiplos, generarDivisores, generarVF, esCorrecta, explicar, NUMEROS_DIVISORES,
} from '../practicas/recta/logica.js';

const N = 3000;

function generarN(fn, n = N, semilla = 1) {
  const rng = crearRng(semilla);
  return Array.from({ length: n }, () => fn(rng));
}

const divideA = (d, n) => n % d === 0;
const divisoresBrutos = n => Array.from({ length: n }, (_, i) => i + 1).filter(d => divideA(d, n));

// --- Ejercicio 1: marca los múltiplos --------------------------------------------

test('ejercicio 1: los correctos son exactamente los múltiplos de n entre 0 y 60, con el 0', () => {
  for (const item of generarN(generarMultiplos)) {
    assert.ok(item.n >= 3 && item.n <= 12);
    const esperados = [];
    for (let v = 0; v <= 60; v += item.n) esperados.push(v);
    assert.deepEqual(item.correctos, esperados);
    assert.ok(item.correctos.includes(0), 'el 0 siempre es múltiplo');
  }
});

test('esCorrecta (multiplos): exacto, sin importar el orden; falla si falta el 0', () => {
  const item = { tipo: 'multiplos', n: 7, hasta: 60, correctos: [0, 7, 14, 21, 28, 35, 42, 49, 56] };
  assert.ok(esCorrecta(item, [56, 0, 7, 49, 14, 42, 21, 35, 28]));
  assert.ok(!esCorrecta(item, [7, 14, 21, 28, 35, 42, 49, 56])); // falta el 0
  assert.ok(!esCorrecta(item, [0, 7, 14, 21, 28, 35, 42, 49, 56, 63])); // sobra uno fuera de rango
});

// --- Ejercicio 2: marca los divisores --------------------------------------------

test('ejercicio 2: los correctos son exactamente los divisores de n, por fuerza bruta, sin el 0', () => {
  for (const item of generarN(generarDivisores, N, 2)) {
    assert.ok(NUMEROS_DIVISORES.includes(item.n));
    assert.equal(item.hasta, item.n + 4);
    assert.deepEqual(item.correctos, divisoresBrutos(item.n));
    assert.ok(!item.correctos.includes(0));
    assert.ok(item.correctos.includes(1) && item.correctos.includes(item.n));
  }
});

test('esCorrecta (divisores): falla si incluye el 0, o si falta el 1 o el propio n', () => {
  const item = { tipo: 'divisores', n: 24, hasta: 28, correctos: [1, 2, 3, 4, 6, 8, 12, 24] };
  assert.ok(esCorrecta(item, [24, 12, 8, 6, 4, 3, 2, 1]));
  assert.ok(!esCorrecta(item, [0, 1, 2, 3, 4, 6, 8, 12, 24]));
  assert.ok(!esCorrecta(item, [2, 3, 4, 6, 8, 12, 24])); // falta el 1
  assert.ok(!esCorrecta(item, [1, 2, 3, 4, 6, 8, 12])); // falta el 24
});

// --- Ejercicio 3: verdadero o falso -----------------------------------------------

test('ejercicio 3: cada plantilla fija, con su verdad calculada aparte', () => {
  const items = generarN(generarVF, N, 3);
  for (const item of items) {
    assert.equal(item.tipo, 'vf');
    if (item.a === undefined) {
      // Una de las ocho frases fijas.
      if (item.plantilla === 'uno_divisor') assert.equal(item.verdad, true);
      if (item.plantilla === 'uno_multiplo') assert.equal(item.verdad, false);
      if (item.plantilla === 'cero_multiplo') assert.equal(item.verdad, true);
      if (item.plantilla === 'cero_divisor') assert.equal(item.verdad, false);
      if (item.plantilla === 'mult_si_mismo') assert.equal(item.verdad, true);
      if (item.plantilla === 'div_si_mismo') assert.equal(item.verdad, true);
      if (item.plantilla === 'multiplos_se_acaban') assert.equal(item.verdad, false);
      if (item.plantilla === 'divisores_se_acaban') assert.equal(item.verdad, true);
    } else {
      // Relación entre a y b, comprobada por fuerza bruta frente a la definición de la plantilla.
      const esperada = item.plantilla === 'divisor' ? divideA(item.a, item.b) : divideA(item.b, item.a);
      assert.equal(item.verdad, esperada);
    }
  }
});

test('ejercicio 3: ninguna plantilla contiene «de 0» ni «entre 0» como divisor/multiplicando de 0 prohibido', () => {
  // Las únicas frases con 0 son «0 es múltiplo de n» y «0 es divisor de n» (con 0 como SUJETO, nunca
  // como divisor en «divisible entre 0» ni como «múltiplo de 0»).
  const items = generarN(generarVF, 1000, 4);
  for (const item of items) {
    if (item.a !== undefined) { assert.notEqual(item.a, 0); assert.notEqual(item.b, 0); }
  }
});

test('ejercicio 3: V y F salen cada uno entre el 35 % y el 65 % en 3000 ítems', () => {
  const items = generarN(generarVF, N, 5);
  const v = items.filter(it => it.verdad).length / items.length;
  assert.ok(v >= 0.35 && v <= 0.65, `v = ${v}`);
});

test('esCorrecta (vf): coincide con item.verdad', () => {
  assert.ok(esCorrecta({ tipo: 'vf', verdad: true }, true));
  assert.ok(!esCorrecta({ tipo: 'vf', verdad: true }, false));
  assert.ok(esCorrecta({ tipo: 'vf', verdad: false }, false));
});

// --- explicar: no lanza, y menciona los números del ítem -------------------------

test('explicar: devuelve una explicación no vacía, en los dos idiomas, para los tres tipos', () => {
  const casos = [generarMultiplos(crearRng(10)), generarDivisores(crearRng(11)), generarVF(crearRng(12))];
  for (const item of casos) {
    for (const idioma of ['es', 'en']) {
      const respuesta = item.tipo === 'vf' ? null : item.correctos;
      const html = explicar(item, respuesta, idioma);
      assert.equal(typeof html, 'string');
      assert.ok(html.length > 0);
    }
  }
});

// --- Reabierta de la tarea 04: feedback ligado al error -----------------------------

test('explicar (multiplos y divisores): dice cuál de los números marcados sobra y por qué', () => {
  const m = { tipo: 'multiplos', n: 4, hasta: 20, correctos: [0, 4, 8, 12, 16, 20] };
  assert.match(explicar(m, [0, 4, 14], 'es'), /14 no es múltiplo de 4: no está en la tabla del 4 \(queda entre 12 y 16\)\./);
  // El que sabe que 2 y 4 van juntos pero no en qué sentido: se le dice que es al revés.
  assert.match(explicar(m, [0, 2, 4], 'es'), /2 no es múltiplo de 4: no está en la tabla del 4 \(queda entre 0 y 4\)\. Es al revés: 4 es múltiplo de 2 \(<span class="cuenta">4 = 2 · 2<\/span>\)\./);
  assert.match(explicar(m, [0, 4, 14], 'en'), /14 is not a multiple of 4/);
  const d = { tipo: 'divisores', n: 12, correctos: [1, 2, 3, 4, 6, 12] };
  assert.match(explicar(d, [1, 5, 12], 'es'), /5 no es divisor de 12: <span class="cuenta">12 : 5 = 2, resto 2<\/span>; la división no es exacta\./);
  assert.match(explicar({ ...d, hasta: 16 }, [1, 12, 13], 'es'), /13 no es divisor de 12: el 12 no está en la tabla del 13\./);
});

test('explicar (divisores): los avisos del español empiezan en mayúscula tras un punto', () => {
  const d = { tipo: 'divisores', n: 12, correctos: [1, 2, 3, 4, 6, 12] };
  const html = explicar(d, [0, 2], 'es');
  assert.doesNotMatch(html, /\. [a-záéíóú]/);
});

test('explicar (vf): sin letras ni «> 1» en 1 múltiplo, y el 0 divisor cita el número', () => {
  const uno = explicar({ tipo: 'vf', plantilla: 'uno_multiplo', n: 7, verdad: false }, null, 'es');
  assert.match(uno, /los múltiplos de 7 son 0, 7, 14, 21…/);
  assert.doesNotMatch(uno, /\bk\b/);
  assert.match(explicar({ tipo: 'vf', plantilla: 'cero_divisor', n: 9, verdad: false }, null, 'es'), /de 9/);
});

// Definiciones de clase en el V/F (Juan Luis, 2026-10-14): la tabla, la división exacta y «al revés».
test('explicar (vf): los falsos con dos números usan la tabla y avisan si es al revés', () => {
  const sin = s => s.replace(/<[^>]+>/g, '');
  assert.equal(sin(explicar({ tipo: 'vf', plantilla: 'multiplo', a: 4, b: 12, verdad: false }, null, 'es')),
    '4 no es múltiplo de 12; «múltiplo de 12» quiere decir que está en la tabla del 12, y el 4 no está: los múltiplos de 12 son 0, 12, 24, 36… '
    + 'Es al revés: 12 es múltiplo de 4 (12 = 4 · 3).');
  assert.match(sin(explicar({ tipo: 'vf', plantilla: 'divisor', a: 7, b: 30, verdad: false }, null, 'en')),
    /^7 is not a divisor of 30; “a divisor of 30” means you can divide 30 by 7 and the division is exact; here it is not: 30 : 7 = 4, remainder 2\.$/);
  assert.match(sin(explicar({ tipo: 'vf', plantilla: 'divisible', a: 6, b: 18, verdad: false }, null, 'es')),
    /Es al revés: 18 es divisible entre 6 \(18 : 6 = 3, resto 0\)\.$/);
  // Por fuerza bruta: nada de «undefined», ni «·» entre frases, ni dos puntos seguidos.
  const rng = crearRng(5);
  for (let i = 0; i < 3000; i++) {
    const item = generarVF(rng);
    for (const idioma of ['es', 'en']) {
      const t = sin(explicar(item, null, idioma));
      assert.doesNotMatch(t, /undefined|NaN|\.\.|…\./, t);
      assert.doesNotMatch(t, /·(?! ?\d)|(?<!\d )·/, t);
    }
  }
});
