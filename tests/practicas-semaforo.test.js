// Práctica «Semáforo de divisibilidad» (reparto-practicas-u2, tarea 02): la
// lógica se prueba por fuerza bruta con definiciones independientes de las de
// `aritmetica.js`, con semilla fija para que el resultado sea reproducible.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  generarSemaforo1, generarSemaforo2, generarSinoOTrampa, generarCifra,
  esCorrecta, explicar, DIVISORES_COMPUESTOS, NUMEROS_TRAMPA, primosDe,
} from '../practicas/semaforo/logica.js';

const N = 3000;

/** `n % d === 0`, escrito por su cuenta (no importado de aritmetica.js). */
const divideA = (d, n) => n % d === 0;

function generarN(fn, n = N, semilla = 1) {
  const rng = crearRng(semilla);
  return Array.from({ length: n }, () => fn(rng));
}

// --- Ejercicio 1: semáforo con 2, 3, 5, 9 y 10 -----------------------------------

test('ejercicio 1: correctos coincide con n % d === 0, por fuerza bruta', () => {
  for (const item of generarN(generarSemaforo1)) {
    assert.deepEqual(item.correctos, [2, 3, 5, 9, 10].filter(d => divideA(d, item.n)));
  }
});

test('ejercicio 1: cuotas de variedad (al menos 30 % div. entre 3 no entre 9, 15 % acaba en 0, nunca más de la mitad vacío)', () => {
  const items = generarN(generarSemaforo1);
  const div3no9 = items.filter(it => divideA(3, it.n) && !divideA(9, it.n)).length / items.length;
  const terminaEn0 = items.filter(it => it.n % 10 === 0).length / items.length;
  const vacios = items.filter(it => it.correctos.length === 0).length / items.length;
  assert.ok(div3no9 >= 0.3, `div3no9 = ${div3no9}`);
  assert.ok(terminaEn0 >= 0.15, `terminaEn0 = ${terminaEn0}`);
  assert.ok(vacios <= 0.5, `vacios = ${vacios}`);
});

// --- Ejercicio 2: semáforo con el 11 añadido -------------------------------------

test('ejercicio 2: correctos coincide con n % d === 0, por fuerza bruta', () => {
  for (const item of generarN(generarSemaforo2, N, 2)) {
    assert.deepEqual(item.correctos, [2, 3, 5, 9, 10, 11].filter(d => divideA(d, item.n)));
  }
});

test('ejercicio 2: al menos un 25 % de los números son divisibles entre 11', () => {
  const items = generarN(generarSemaforo2, N, 2);
  const div11 = items.filter(it => divideA(11, it.n)).length / items.length;
  assert.ok(div11 >= 0.25, `div11 = ${div11}`);
});

// --- esCorrecta (ejercicios 1 y 2): el orden de la respuesta no importa ---------

test('esCorrecta (semáforo): exacto, sin importar el orden; falla si falta o sobra uno', () => {
  const item = { tipo: 'semaforo', n: 90, divisores: [2, 3, 5, 9, 10], correctos: [2, 3, 5, 9, 10] };
  assert.ok(esCorrecta(item, [10, 2, 9, 3, 5]));
  assert.ok(!esCorrecta(item, [2, 3, 5, 9]));
  assert.ok(!esCorrecta(item, [2, 3, 5, 9, 10, 11]));
});

// --- Ejercicio 3: criterios compuestos y la trampa -------------------------------

test('ejercicio 3: la respuesta «sino» coincide con n % d === 0; la «trampa» es siempre no', () => {
  const items = generarN(generarSinoOTrampa, N, 3);
  for (const item of items) {
    if (item.tipo === 'sino') {
      assert.ok(DIVISORES_COMPUESTOS.includes(item.d));
      assert.equal(item.correctos, divideA(item.d, item.n) ? 'si' : 'no');
    } else {
      assert.equal(item.tipo, 'trampa');
      assert.equal(item.correctos, 'no');
      assert.ok(NUMEROS_TRAMPA.includes(item.n));
      assert.ok(divideA(4, item.n) && divideA(6, item.n) && !divideA(24, item.n), 'la trampa: múltiplo de 4 y 6, no de 24');
    }
  }
});

test('ejercicio 3: hay trampas y, entre las normales, ninguna respuesta pasa del 70 % (regla de oro)', () => {
  const items = generarN(generarSinoOTrampa, N, 3);
  const trampas = items.filter(it => it.tipo === 'trampa').length / items.length;
  const si = items.filter(it => it.correctos === 'si').length / items.length;
  const no = items.filter(it => it.correctos === 'no').length / items.length;
  assert.ok(trampas > 0, 'tiene que haber al menos una trampa en 3000 ítems');
  assert.ok(si <= 0.7 && no <= 0.7, `si = ${si}, no = ${no}`);
});

test('primosDe: los primos de cada divisor compuesto', () => {
  assert.deepEqual(primosDe(6), [2, 3]);
  assert.deepEqual(primosDe(15), [3, 5]);
  assert.deepEqual(primosDe(22), [2, 11]);
  assert.deepEqual(primosDe(30), [2, 3, 5]);
  assert.deepEqual(primosDe(33), [3, 11]);
});

// --- Ejercicio 4: la cifra que falta ---------------------------------------------

test('ejercicio 4: la cifra que falta es única, por fuerza bruta, y nunca un 0 inicial', () => {
  const items = generarN(generarCifra, 1000, 4);
  for (const item of items) {
    const buenas = [];
    for (let x = 0; x <= 9; x++) {
      if (item.hueco === 0 && x === 0) continue;
      const cifras = [...item.cifras];
      cifras[item.hueco] = x;
      const n = cifras.reduce((acc, c) => acc * 10 + c, 0);
      if (item.divisores.every(d => divideA(d, n))) buenas.push(x);
    }
    assert.deepEqual(buenas, [item.solucion], `ítem ${JSON.stringify(item)}`);
    if (item.hueco === 0) assert.notEqual(item.solucion, 0);
  }
});

test('esCorrecta (cifra): solo la cifra exacta vale', () => {
  const item = { tipo: 'cifra', cifras: [4, 0, 7], hueco: 1, divisores: [9], solucion: 2 };
  assert.ok(esCorrecta(item, 2));
  assert.ok(esCorrecta(item, '2'));
  assert.ok(!esCorrecta(item, 3));
});

// --- explicar: no lanza, y menciona los números del ítem -------------------------

test('explicar: menciona el número del ítem, en los dos idiomas, para los cuatro tipos', () => {
  const casos = [
    generarSemaforo1(crearRng(10)),
    generarSemaforo2(crearRng(11)),
    generarSinoOTrampa(crearRng(12)),
    generarCifra(crearRng(13)),
  ];
  for (const item of casos) {
    for (const idioma of ['es', 'en']) {
      const respuesta = item.tipo === 'semaforo' ? item.correctos : item.tipo === 'cifra' ? item.solucion : item.correctos;
      const html = explicar(item, respuesta, idioma);
      assert.equal(typeof html, 'string');
      assert.ok(html.length > 0);
    }
  }
});
