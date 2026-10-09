// Práctica «Léelo en inglés»: `leer` se comprueba con 20 casos fijos; los
// generadores de los tres ejercicios, con 1000+ ítems contra reglas
// independientes de fuerza bruta (no contra las propias funciones de
// `aritmetica.js`): la opción correcta es verdad, cada falsa es falsa, nunca
// se enfrentan dos formas válidas, y ninguna opción domina más del 70 %.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  leer, leerExponente, notacion,
  generarEscuchar, opcionesEscuchar,
  generarLeer, opcionesLeer,
  generarCompletar, comprobarCompletar,
  ESTILOS,
} from '../practicas/leelo/logica.js';

// ─── `leer`: 20 casos fijos ─────────────────────────────────────────────────

test('leer: 20 casos fijos (squared, cubed, to the power of, números con guion)', () => {
  const casos = [
    [{ clase: 'fact', n: 60, f: [[2, 2], [3, 1], [5, 1]] }, 'sixty equals two squared times three times five'],
    [{ clase: 'gcd', a: 24, b: 36, valor: 12 }, 'the GCD of twenty-four and thirty-six is twelve'],
    [{ clase: 'lcm', a: 4, b: 6, valor: 12 }, 'the LCM of four and six is twelve'],
    [{ clase: 'primo', n: 7 }, 'seven is a prime number'],
    [{ clase: 'compuesto', n: 51 }, 'fifty-one is a composite number'],
    [{ clase: 'fact', n: 8, f: [[2, 3]] }, 'eight equals two cubed'],
    [{ clase: 'fact', n: 16, f: [[2, 4]] }, 'sixteen equals two to the power of four'],
    [{ clase: 'fact', n: 1000, f: [[2, 3], [5, 3]] }, 'one thousand equals two cubed times five cubed'],
    [{ clase: 'fact', n: 242, f: [[2, 1], [11, 2]] }, 'two hundred and forty-two equals two times eleven squared'],
    [{ clase: 'fact', n: 338, f: [[2, 1], [13, 2]] }, 'three hundred and thirty-eight equals two times thirteen squared'],
    [{ clase: 'gcd', a: 21, b: 14, valor: 7 }, 'the GCD of twenty-one and fourteen is seven'],
    [{ clase: 'lcm', a: 12, b: 18, valor: 36 }, 'the LCM of twelve and eighteen is thirty-six'],
    [{ clase: 'primo', n: 97 }, 'ninety-seven is a prime number'],
    [{ clase: 'compuesto', n: 91 }, 'ninety-one is a composite number'],
    [{ clase: 'fact', n: 72, f: [[2, 3], [3, 2]] }, 'seventy-two equals two cubed times three squared'],
    [{ clase: 'fact', n: 100, f: [[2, 2], [5, 2]] }, 'one hundred equals two squared times five squared'],
    [{ clase: 'gcd', a: 8, b: 12, valor: 4 }, 'the GCD of eight and twelve is four'],
    [{ clase: 'lcm', a: 9, b: 6, valor: 18 }, 'the LCM of nine and six is eighteen'],
    [{ clase: 'fact', n: 11, f: [[11, 1]] }, 'eleven equals eleven'],
    [{ clase: 'compuesto', n: 363 }, 'three hundred and sixty-three is a composite number'],
  ];
  for (const [expresion, esperado] of casos) assert.equal(leer(expresion), esperado, JSON.stringify(expresion));
});

test('leerExponente: squared, cubed, to the power of, y la base sola', () => {
  assert.equal(leerExponente(2, 1), 'two');
  assert.equal(leerExponente(2, 2), 'two squared');
  assert.equal(leerExponente(2, 3), 'two cubed');
  assert.equal(leerExponente(2, 4), 'two to the power of four');
  assert.equal(leerExponente(3, 5), 'three to the power of five');
});

test('leer con otro estilo: "is equal to" / "multiplied by" / "greatest common divisor" / "lowest common multiple"', () => {
  const estilo = ESTILOS[1];
  assert.equal(leer({ clase: 'fact', n: 12, f: [[2, 2], [3, 1]] }, estilo), 'twelve is equal to two squared multiplied by three');
  assert.equal(leer({ clase: 'gcd', a: 10, b: 15, valor: 5 }, estilo), 'the greatest common divisor of ten and fifteen equals five');
  assert.equal(leer({ clase: 'lcm', a: 4, b: 6, valor: 12 }, estilo), 'the lowest common multiple of four and six equals twelve');
});

// ─── Ejercicio 1: Escúchalo ─────────────────────────────────────────────────

test('ejercicio 1: la notación correcta coincide con el ítem y ninguna falsa vale lo mismo', () => {
  const rng = crearRng(101);
  for (let i = 0; i < 1500; i++) {
    const item = generarEscuchar(rng);
    const { correcta, pool } = opcionesEscuchar(item);
    assert.equal(correcta, notacion(item));
    assert.ok(pool.length >= 3, `pool pequeño: ${JSON.stringify(item)}`);
    assert.ok(!pool.includes(correcta));
    assert.equal(new Set(pool).size, pool.length); // sin repetidos
    // Fuerza bruta, independiente de `notacion`: ninguna falsa representa el mismo valor.
    for (const texto of pool) {
      if (item.clase === 'fact') {
        const m = texto.match(/^(\d+) = (.+)$/);
        assert.ok(m, texto);
        const terminos = [...m[2].matchAll(/(\d+)(?:<sup>(\d+)<\/sup>)?/g)]
          .map(t => [Number(t[1]), t[2] ? Number(t[2]) : 1]);
        const valor = terminos.reduce((v, [p, e]) => v * p ** e, 1);
        assert.notEqual(valor, Number(m[1]), texto);
      } else {
        const m = texto.match(/^(GCD|LCM)\((\d+), (\d+)\) = (\d+)$/);
        assert.ok(m, texto);
        assert.equal(m[1], item.clase.toUpperCase());
      }
    }
  }
});

test('ejercicio 1: clases fact/gcd/lcm equilibradas, sin que ninguna domine', () => {
  const rng = crearRng(202);
  const cuenta = { fact: 0, gcd: 0, lcm: 0 };
  const N = 3000;
  for (let i = 0; i < N; i++) cuenta[generarEscuchar(rng).clase]++;
  for (const clase of ['fact', 'gcd', 'lcm']) {
    const p = cuenta[clase] / N;
    assert.ok(p > 0.05 && p < 0.75, `${clase}: ${p}`);
  }
});

// ─── Ejercicio 2: ¿Cómo se lee? ─────────────────────────────────────────────

test('ejercicio 2: la lectura correcta coincide con `leer(item, estilo)`, y las falsas usan el mismo estilo', () => {
  const rng = crearRng(303);
  for (let i = 0; i < 1500; i++) {
    const item = generarLeer(rng);
    const { correcta, pool } = opcionesLeer(item);
    assert.equal(correcta, leer(item, item.estilo));
    assert.ok(pool.length >= 3, JSON.stringify(item));
    assert.ok(!pool.includes(correcta));
    assert.equal(new Set(pool).size, pool.length);
  }
});

test('ejercicio 2: nunca se enfrentan "GCD"/"greatest common divisor"/"HCF" ni "lowest"/"least" entre sí', () => {
  // Para un mismo ítem, el nombre del GCD o del LCM es siempre el del estilo elegido:
  // no puede aparecer un segundo nombre válido distinto en las opciones falsas.
  const rng = crearRng(404);
  for (let i = 0; i < 800; i++) {
    const item = generarLeer(rng);
    if (item.clase !== 'gcd' && item.clase !== 'lcm') continue;
    const { pool } = opcionesLeer(item);
    const nombre = item.clase === 'gcd' ? item.estilo.gcd : item.estilo.lcm;
    const otrosNombres = (item.clase === 'gcd' ? ESTILOS.map(e => e.gcd) : ESTILOS.map(e => e.lcm))
      .filter(n => n !== nombre);
    for (const texto of pool) {
      for (const otro of otrosNombres) assert.ok(!texto.includes(otro), `«${otro}» en: ${texto}`);
    }
  }
});

test('ejercicio 2: ninguna opción domina más del 70 % (posición de la correcta tras barajar)', () => {
  const rng = crearRng(505);
  const posiciones = [0, 0, 0, 0];
  const N = 2000;
  for (let i = 0; i < N; i++) {
    const item = generarLeer(rng);
    const { correcta, pool } = opcionesLeer(item);
    const cuatro = rng.barajar([correcta, ...rng.barajar(pool).slice(0, 3)]);
    posiciones[cuatro.indexOf(correcta)]++;
  }
  for (const p of posiciones) assert.ok(p / N < 0.7, posiciones);
});

// ─── Ejercicio 3: Completa la frase ─────────────────────────────────────────

test('ejercicio 3: al menos 10 plantillas, 3 opciones sin repetir, y la frase con la solución es verdad', () => {
  const rng = crearRng(606);
  const plantillas = new Set();
  for (let i = 0; i < 2000; i++) {
    const item = generarCompletar(rng);
    plantillas.add(item.plantilla);
    assert.equal(item.opciones.length, 3);
    assert.equal(new Set(item.opciones).size, 3);
    assert.ok(item.opciones.includes(item.solucion));
    assert.ok(item.frase.includes('___'));
    assert.ok(comprobarCompletar(item), JSON.stringify(item));
  }
  assert.ok(plantillas.size >= 10, `solo ${plantillas.size} plantillas distintas`);
});

test('ejercicio 3: ninguna opción correcta domina más del 70 % de 2000 ítems', () => {
  const rng = crearRng(707);
  let correctas0 = 0;
  const N = 2000;
  for (let i = 0; i < N; i++) {
    const item = generarCompletar(rng);
    if (item.opciones[0] === item.solucion) correctas0++;
  }
  const p = correctas0 / N;
  assert.ok(p < 0.7, `posición 0 correcta el ${p * 100}% de las veces`);
});

test('ejercicio 3: nunca se enfrentan "divisor"/"factor" ni "lowest"/"least" como opciones', () => {
  const rng = crearRng(808);
  for (let i = 0; i < 1500; i++) {
    const item = generarCompletar(rng);
    for (const opcion of item.opciones) {
      assert.ok(!opcion.includes('factor') || item.plantilla === 'sieve_composite', opcion);
      assert.ok(!(opcion.includes('lowest') && opcion.includes('least')), opcion);
    }
  }
});

test('ejercicio 3: "divisible by" nunca "divisible between" (regla U2-1B-02)', () => {
  const rng = crearRng(909);
  let visto = false;
  for (let i = 0; i < 500; i++) {
    const item = generarCompletar(rng);
    if (item.plantilla !== 'divisible_by') continue;
    visto = true;
    assert.equal(item.solucion, 'by');
    assert.ok(item.opciones.includes('between')); // falso: solo como distractor, nunca correcto
  }
  assert.ok(visto, 'no salió la plantilla divisible_by en 500 ítems');
});

// --- Reabierta de la tarea 15: símbolos y frases ------------------------------------

test('ejercicio 3: ninguna frase lleva «×» y el 2 se dice «twice»', () => {
  const rng = crearRng(15);
  let twice = 0;
  for (let i = 0; i < 3000; i++) {
    const { frase } = generarCompletar(rng);
    assert.ok(!frase.includes('×'), frase);
    assert.ok(!/\btwo times\b/.test(frase), frase);
    if (/\btwice\b/.test(frase)) twice++;
  }
  assert.ok(twice > 0);
});

test('decisión del 9-10: HCF no sale como lectura (ni "highest common factor") en ninguna opción', () => {
  const rng = crearRng(909);
  for (let i = 0; i < 3000; i++) {
    const item = generarLeer(rng);
    const { correcta, pool } = opcionesLeer(item);
    for (const texto of [correcta, ...pool]) assert.ok(!/HCF|highest common factor/i.test(texto), texto);
  }
  for (const e of ESTILOS) assert.ok(!/HCF|highest common factor/i.test(e.gcd));
});
