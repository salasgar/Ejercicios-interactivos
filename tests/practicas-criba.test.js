// Práctica «Criba de Eratóstenes»: cada ejercicio se comprueba por fuerza
// bruta contra una definición independiente, no contra las propias funciones
// de logica.js.

import test from 'node:test';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { PRIMOS } from '../practicas/_comun/aritmetica.js';
import {
  PASOS, generarCriba, aciertaTachar,
  generarFlashcard, claseDe, TRAMPOSOS,
  generarRaiz,
} from '../practicas/criba/logica.js';
import { TX } from '../practicas/criba/textos.js';

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

test('ejercicio 2: todos los tramposos están en el rango 1-150 que anuncia el texto', () => {
  for (const n of TRAMPOSOS) assert.ok(n >= 1 && n <= 150 && !esPrimoBruto(n), `n=${n}`);
  const rng = crearRng(7);
  for (let i = 0; i < 3000; i++) assert.ok(generarFlashcard(rng).n <= 150);
});

test('textos: mensajes de fallo citan una celda concreta, sin letras y con la forma correcta', () => {
  const f = TX.criba.mal_faltan, s = TX.criba.mal_sobran;
  assert.match(f.es(3, { n: 51, p: 3 }), /Te faltan 3 celdas por tachar, por ejemplo el .*51 = 3 · 17/);
  assert.match(f.es(1, { n: 51, p: 3 }), /^Te falta por tachar el .*51 = 3 · 17/);
  assert.match(f.en(2, { n: 91, p: 7 }), /^You are missing 2 cells, for example .*91 = 7 · 13/);
  assert.equal(s.es(1, { n: 53, primo: true, p: 3 }), 'Has tachado 1 celda de más: el 53 es primo.');
  assert.equal(s.es(2, { n: 35, primo: false, p: 3 }), 'Has tachado 2 celdas de más; por ejemplo, el 35 no es múltiplo de 3.');
  assert.equal(s.en(1, { n: 35, primo: false, p: 3 }), 'You crossed out 1 extra cell: 35 is not a multiple of 3.');
  assert.equal(TX.flash.no_divisible.es(['2', '3']), 'no es divisible entre 2 ni 3');
  assert.equal(TX.flash.no_divisible.es(['2', '3', '5']), 'no es divisible entre 2, 3 ni 5');
  assert.equal(TX.flash.no_divisible.en(['2', '3']), 'it is not divisible by 2 or 3');
  assert.equal(TX.flash.no_divisible.es(['2']), 'no es divisible entre 2');
});

test('ejercicio 3: instrucción pide la lista más corta y la opción «mitad» cita el número del ítem', () => {
  assert.match(TX.raiz.instruccion.es(113), /más corta/);
  assert.match(TX.raiz.instruccion.en(113), /shortest/);
  assert.equal(TX.raiz.mitad.es(113), 'todos los primos hasta la mitad de 113');
  assert.equal(TX.raiz.mitad.en(113), 'all the primes up to half of 113');
  for (const idioma of ['es', 'en']) assert.doesNotMatch(TX.raiz.mitad[idioma](113), /\bn\b/);
  // Con «más corta», cada distractor es falso: o no basta (le falta el último) o no es la más corta (le sobra un primo o es mucho más larga).
  const rng = crearRng(11);
  for (let i = 0; i < 500; i++) {
    const item = generarRaiz(rng);
    const buena = PRIMOS.filter(p => p * p <= item.n);
    for (const o of item.opciones.filter(x => !x.correcta)) {
      if (o.tipo === 'mitad') continue; // siempre más larga que la buena: n/2 ≥ 25 > raíz de 200
      assert.notDeepEqual(o.lista, buena);
    }
  }
});

test('ejercicio 3: en 5000 ítems, ninguna lista falsa que no sea más larga que la buena contiene un divisor de n', () => {
  const rng = crearRng(2026);
  for (let i = 0; i < 5000; i++) {
    const item = generarRaiz(rng);
    const buena = item.opciones.find(o => o.correcta).lista;
    for (const o of item.opciones.filter(x => !x.correcta && x.tipo === 'lista')) {
      if (o.lista.length > buena.length) continue;
      assert.ok(!o.lista.some(p => item.n % p === 0),
        `n=${item.n}: la lista corta ${o.lista} ya basta y es más corta que ${buena}`);
    }
  }
});

test('ejercicio 3: el texto de cada opción pintada nunca contiene «undefined»', () => {
  const rng = crearRng(7);
  for (let i = 0; i < 300; i++) {
    const item = generarRaiz(rng);
    for (const o of item.opciones.filter(x => x.tipo === 'mitad')) {
      for (const idioma of ['es', 'en']) assert.doesNotMatch(TX.raiz.mitad[idioma](item.n), /undefined/);
    }
  }
  // textoOpcion recibe el ítem (antes usaba una variable inexistente): lo comprobamos en el código fuente.
  const src = readFileSync(new URL('../practicas/criba/practica.js', import.meta.url), 'utf8');
  assert.match(src, /function textoOpcion\(o, item, api\)/);
  assert.match(src, /textoOpcion\(o, item, api\)/);
});

test('ejercicio 2: la explicación de un primo lleva espacio tras la coma', () => {
  const src = readFileSync(new URL('../practicas/criba/practica.js', import.meta.url), 'utf8');
  assert.doesNotMatch(src, /\)\},\$\{tt\(TX\.flash\.se_pasa/);
});
