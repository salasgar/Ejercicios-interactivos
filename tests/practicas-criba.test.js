// Práctica «Criba de Eratóstenes»: cada ejercicio se comprueba por fuerza
// bruta contra una definición independiente, no contra las propias funciones
// de logica.js.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { PRIMOS } from '../practicas/_comun/aritmetica.js';
import {
  PASOS, generarCriba, aciertaTachar,
  generarFlashcard, claseDe, TRAMPOSOS,
  generarRaiz,
} from '../practicas/criba/logica.js';

function esPrimoBruto(n) {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}

function divisoresBrutos(n) {
  const d = [];
  for (let i = 1; i <= n; i++) if (n % i === 0) d.push(i);
  return d;
}

/** Marca con una criba independiente los compuestos cuyo menor factor está en `previos`. */
function tachadosBrutos(previos) {
  const marcados = new Set();
  for (let n = 2; n <= 100; n++) {
    for (const p of previos) {
      if (n > p && n % p === 0) { marcados.add(n); break; }
    }
  }
  return marcados;
}

test('ejercicio 1: cada paso tacha exactamente los múltiplos que quedan de ese primo', () => {
  for (let paso = 0; paso < PASOS.length; paso++) {
    const item = generarCriba(crearRng(1), { aciertos: paso });
    assert.equal(item.tipo, 'tachar');
    const p = PASOS[paso];
    assert.equal(item.primo, p);
    const marcadosPrevios = tachadosBrutos(PASOS.slice(0, paso));
    const esperado = [];
    for (let n = 2 * p; n <= 100; n += p) if (!marcadosPrevios.has(n)) esperado.push(n);
    assert.deepEqual([...item.objetivo].sort((a, b) => a - b), esperado.sort((a, b) => a - b));
    assert.ok(aciertaTachar(item, item.objetivo));
    assert.ok(!aciertaTachar(item, item.objetivo.slice(1)));
  }
});

test('ejercicio 1: el paso del 7 tacha exactamente {49, 77, 91}', () => {
  const item = generarCriba(crearRng(1), { aciertos: 3 });
  assert.deepEqual([...item.objetivo].sort((a, b) => a - b), [49, 77, 91]);
});

test('ejercicio 1: a los 5 aciertos sale la pregunta del 11, con las cuatro opciones', () => {
  const item = generarCriba(crearRng(2), { aciertos: 5 });
  assert.equal(item.tipo, 'pregunta11');
  assert.deepEqual([...item.opciones].sort(), ['buena', 'impar', 'no_primo', 'por2']);
});

test('ejercicio 1: un fallo (aciertos sin cambiar) repite el mismo paso', () => {
  const a = generarCriba(crearRng(3), { aciertos: 1 });
  const b = generarCriba(crearRng(9), { aciertos: 1 });
  assert.equal(a.primo, b.primo);
  assert.deepEqual(a.objetivo, b.objetivo);
});

test('ejercicio 2: la clasificación coincide con la definición por número de divisores (1..500)', () => {
  for (let n = 1; n <= 500; n++) {
    const divisores = divisoresBrutos(n);
    const esperada = divisores.length === 1 ? 'ninguno' : divisores.length === 2 ? 'primo' : 'compuesto';
    assert.equal(claseDe(n), esperada, `n=${n}`);
  }
});

test('ejercicio 2: en 3000 ítems, los tramposos aparecen al menos un 25 %', () => {
  const rng = crearRng(1234);
  let tramposos = 0;
  for (let i = 0; i < 3000; i++) if (TRAMPOSOS.includes(generarFlashcard(rng).n)) tramposos++;
  assert.ok(tramposos / 3000 >= 0.25, `proporción de tramposos: ${tramposos / 3000}`);
});

test('ejercicio 2: en 3000 ítems el 1 y el 2 aparecen (pesos del 5 %) y ninguna opción gana siempre', () => {
  const rng = crearRng(4321);
  let unos = 0, doses = 0;
  const cuentas = { primo: 0, compuesto: 0, ninguno: 0 };
  for (let i = 0; i < 3000; i++) {
    const n = generarFlashcard(rng).n;
    if (n === 1) unos++;
    if (n === 2) doses++;
    cuentas[claseDe(n)]++;
  }
  assert.ok(unos > 50 && unos < 250, `apariciones del 1: ${unos}`);
  assert.ok(doses > 50 && doses < 250, `apariciones del 2: ${doses}`);
  for (const clase of ['primo', 'compuesto', 'ninguno']) assert.ok(cuentas[clase] / 3000 < 0.7, `${clase}: ${cuentas[clase]}`);
});

test('ejercicio 3: la lista correcta es exactamente los primos p con p·p ≤ n, y las cuatro opciones son distintas', () => {
  const rng = crearRng(55);
  for (let i = 0; i < 500; i++) {
    const item = generarRaiz(rng);
    assert.ok(item.n >= 50 && item.n <= 200);
    assert.equal(esPrimoBruto(item.n), !item.compuesto);
    const esperada = PRIMOS.filter(p => p * p <= item.n);
    const opcionCorrecta = item.opciones.find(o => o.correcta);
    assert.ok(opcionCorrecta);
    assert.equal(opcionCorrecta.tipo, 'lista');
    assert.deepEqual(opcionCorrecta.lista, esperada);
    assert.equal(item.opciones.length, 4);
    const claves = item.opciones.map(o => JSON.stringify(o.tipo === 'mitad' ? ['mitad'] : o.lista));
    assert.equal(new Set(claves).size, 4, `opciones repetidas: ${claves}`);
  }
});

test('ejercicio 3: en 3000 ítems, aproximadamente un 30 % de los n son compuestos', () => {
  const rng = crearRng(99);
  let compuestos = 0;
  for (let i = 0; i < 3000; i++) if (generarRaiz(rng).compuesto) compuestos++;
  const proporcion = compuestos / 3000;
  assert.ok(proporcion >= 0.2 && proporcion <= 0.4, `proporción de compuestos: ${proporcion}`);
});
