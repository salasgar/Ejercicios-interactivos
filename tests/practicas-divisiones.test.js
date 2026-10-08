// Práctica «Divisiones sucesivas guiadas» (reparto-practicas-u2, tarea 07): la
// lógica se prueba por fuerza bruta con definiciones independientes de las de
// `aritmetica.js`, con semilla fija para que el resultado sea reproducible.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  PRIMOS_ESCALERA, generarEscalera, pasoCorrecto, evaluarEleccion, razonNoDivide, razonNoMenor, explicarEscalera,
  generarPotencias, exponenteDe, esFactorizacionCorrecta, explicarPotencias,
  generarEjercicio3, generarValor, generarSino, distractoresEj3, explicarEj3,
} from '../practicas/divisiones/logica.js';

const N = 1500;

function generarN(fn, n = N, semilla = 1) {
  const rng = crearRng(semilla);
  return Array.from({ length: n }, () => fn(rng));
}

/** Factorización por fuerza bruta, escrita aquí (no importada de aritmetica.js). */
function factorizarIndep(n) {
  const f = [];
  let m = n;
  for (let p = 2; p * p <= m; p++) {
    let e = 0;
    while (m % p === 0) { m /= p; e++; }
    if (e) f.push([p, e]);
  }
  if (m > 1) f.push([m, 1]);
  return f;
}

const valorIndep = f => f.reduce((v, [p, e]) => v * p ** e, 1);
const menorPrimoQueDivideIndep = (m, primos) => primos.find(p => m % p === 0);

// --- Ejercicio 1: la escalera de divisiones --------------------------------------

test('escalera: n tiene 2 o 3 cifras, hasta 600, y solo factores de PRIMOS_ESCALERA', () => {
  for (const item of generarN(generarEscalera)) {
    assert.ok(item.n >= 10 && item.n <= 600, `n = ${item.n}`);
    for (const [p] of factorizarIndep(item.n)) assert.ok(PRIMOS_ESCALERA.includes(p), `factor ${p} de ${item.n} fuera de la lista`);
  }
});

test('escalera: la lista de primos de `pasos` es la factorización no decreciente de n, por fuerza bruta', () => {
  for (const item of generarN(generarEscalera)) {
    const esperada = factorizarIndep(item.n).flatMap(([p, e]) => Array(e).fill(p));
    assert.deepEqual(item.pasos.map(([, p]) => p), esperada, `n = ${item.n}`);
    // y cada "numero" del paso es el cociente acumulado correcto
    let m = item.n;
    for (const [numero, p] of item.pasos) {
      assert.equal(numero, m);
      m /= p;
    }
    assert.equal(m, 1);
  }
});

test('escalera: en cada paso, el primo es el MENOR de PRIMOS_ESCALERA que divide al número actual', () => {
  for (const item of generarN(generarEscalera, 500, 2)) {
    let m = item.n;
    for (const [, p] of item.pasos) {
      assert.equal(p, menorPrimoQueDivideIndep(m, PRIMOS_ESCALERA), `m = ${m}`);
      assert.equal(pasoCorrecto(m), p);
      m /= p;
    }
  }
});

test('escalera: cuotas de variedad (al menos 28 % con factor 11 o 13, 13 % con un factor repetido 3+ veces)', () => {
  const items = generarN(generarEscalera);
  const con11o13 = items.filter(it => it.n % 11 === 0 || it.n % 13 === 0).length / items.length;
  const conRepetido = items.filter(it => factorizarIndep(it.n).some(([, e]) => e >= 3)).length / items.length;
  assert.ok(con11o13 >= 0.28, `con11o13 = ${con11o13}`);
  assert.ok(conRepetido >= 0.13, `conRepetido = ${conRepetido}`);
});

test('escalera: nunca un primo solo; la cuota de 11 o 13 es la de la ficha (~30 %), no el 76 %', () => {
  const items = generarN(generarEscalera, 3000, 7);
  const esPrimo = n => factorizarIndep(n).length === 1 && factorizarIndep(n)[0][1] === 1;
  for (const it of items) assert.ok(!esPrimo(it.n), `n = ${it.n} es primo`);
  assert.ok(items.every(it => it.pasos.length >= 2));
  const con11o13 = items.filter(it => it.n % 11 === 0 || it.n % 13 === 0).length / items.length;
  assert.ok(con11o13 >= 0.27 && con11o13 <= 0.36, `con11o13 = ${con11o13}`);
});

test('evaluarEleccion: no divide, divide pero no es el menor, y correcto', () => {
  assert.deepEqual(evaluarEleccion(72, 5), { resultado: 'no_divide', correcto: 2 });
  assert.deepEqual(evaluarEleccion(72, 3), { resultado: 'no_menor', correcto: 2 });
  assert.deepEqual(evaluarEleccion(72, 2), { resultado: 'correcto', correcto: 2 });
  // 1001 = 7 · 11 · 13: el 11 divide pero no es el menor (7 sí lo es).
  assert.deepEqual(evaluarEleccion(1001, 11), { resultado: 'no_menor', correcto: 7 });
  assert.deepEqual(evaluarEleccion(1001, 7), { resultado: 'correcto', correcto: 7 });
});

test('razonNoDivide y razonNoMenor: no lanzan, y mencionan los números, en los dos idiomas', () => {
  for (const idioma of ['es', 'en']) {
    assert.ok(razonNoDivide(350, 3, idioma).includes('350'));
    assert.ok(razonNoDivide(143, 7, idioma).includes('143'));
    const r = razonNoMenor(12, 3, 2, idioma);
    assert.ok(r.includes('12') && r.includes('3') && r.includes('2'), r);
    assert.match(r, /^[A-Z]/);
  }
});

test('explicarEscalera: no lanza y menciona n, en los dos idiomas', () => {
  const item = generarEscalera(crearRng(5));
  for (const idioma of ['es', 'en']) {
    const html = explicarEscalera(item.n, item.pasos, idioma);
    assert.equal(typeof html, 'string');
    assert.ok(html.includes(String(item.n)));
  }
});

// --- Ejercicio 2: la forma de potencias ------------------------------------------

test('potencias: n coincide con el valor de la factorización, por fuerza bruta', () => {
  for (const item of generarN(generarPotencias, N, 3)) {
    assert.equal(item.n, valorIndep(item.factorizacion));
    assert.deepEqual(item.lista, item.factorizacion.flatMap(([p, e]) => Array(e).fill(p)));
  }
});

test('potencias: `bases` son las de la factorización más exactamente una que no aparece, y están ordenadas', () => {
  for (const item of generarN(generarPotencias, N, 3)) {
    const basesF = item.factorizacion.map(([p]) => p);
    const extra = item.bases.filter(p => !basesF.includes(p));
    assert.equal(extra.length, 1, `bases = ${item.bases}, factorizacion = ${JSON.stringify(item.factorizacion)}`);
    assert.deepEqual(item.bases, [...item.bases].sort((a, b) => a - b));
  }
});

test('potencias: un 20 % son potencias de 10 (2^n · 5^n)', () => {
  const items = generarN(generarPotencias, N, 3);
  const deDiez = items.filter(it => it.factorizacion.length === 2 && it.factorizacion[0][0] === 2 && it.factorizacion[1][0] === 5
    && it.factorizacion[0][1] === it.factorizacion[1][1]).length / items.length;
  assert.ok(deDiez >= 0.1, `deDiez = ${deDiez}`);
});

test('esFactorizacionCorrecta: exacta en cada base, 0 para la que no aparece', () => {
  const item = generarPotencias(crearRng(7));
  const buenos = item.bases.map(p => exponenteDe(item.factorizacion, p));
  assert.ok(esFactorizacionCorrecta(item, buenos));
  const malos = [...buenos];
  malos[0] += 1;
  assert.ok(!esFactorizacionCorrecta(item, malos));
});

test('explicarPotencias: no lanza y cuenta cada base', () => {
  const item = generarPotencias(crearRng(8));
  for (const idioma of ['es', 'en']) {
    const html = explicarPotencias(item.factorizacion, idioma);
    assert.equal(typeof html, 'string');
    for (const [p] of item.factorizacion) assert.ok(html.includes(String(p)));
  }
});

// --- Ejercicio 3: comprobar multiplicando ----------------------------------------

test('valor: las cuatro opciones son distintas, y la correcta es el único valor que coincide con la factorización', () => {
  for (const item of generarN(generarValor, N, 4)) {
    assert.equal(new Set(item.opciones).size, 4, `opciones repetidas: ${item.opciones}`);
    assert.equal(item.solucion, valorIndep(item.factorizacion));
    const coinciden = item.opciones.filter(v => v === valorIndep(item.factorizacion));
    assert.deepEqual(coinciden, [item.solucion]);
  }
});

test('valor: ninguna posición dentro de las opciones es la correcta más del 70 % de las veces (regla de oro)', () => {
  const items = generarN(generarValor, N, 4);
  const porPosicion = [0, 0, 0, 0];
  for (const item of items) porPosicion[item.opciones.indexOf(item.solucion)]++;
  for (const veces of porPosicion) assert.ok(veces / items.length <= 0.7, `posiciones = ${porPosicion}`);
});

test('distractoresEj3: los tres distractores clásicos son siempre distintos entre sí y del valor correcto', () => {
  for (const item of generarN(generarValor, N, 5)) {
    const correcto = valorIndep(item.factorizacion);
    const { total, intercambio, masMenos } = distractoresEj3(item.factorizacion);
    assert.equal(new Set([correcto, total, intercambio, masMenos]).size, 4, `factorizacion = ${JSON.stringify(item.factorizacion)}`);
    assert.ok(masMenos > 0);
  }
});

test('sino: igualdadCorrecta coincide con valorMostrado === valor de la factorización, y hay de los dos tipos', () => {
  const items = generarN(generarSino, N, 6);
  for (const item of items) assert.equal(item.igualdadCorrecta, item.valorMostrado === valorIndep(item.factorizacion));
  const si = items.filter(it => it.igualdadCorrecta).length / items.length;
  assert.ok(si >= 0.3 && si <= 0.7, `si = ${si}`);
});

test('ejercicio3: hay de las dos variantes (valor y sino), aproximadamente 60/40', () => {
  const items = generarN(generarEjercicio3, N, 9);
  const valor = items.filter(it => it.tipo === 'valor').length / items.length;
  assert.ok(valor >= 0.45 && valor <= 0.75, `valor = ${valor}`);
});

test('explicarEj3: no lanza, y menciona el valor correcto, en los dos idiomas', () => {
  const item = generarValor(crearRng(10));
  for (const idioma of ['es', 'en']) {
    const html = explicarEj3(item.factorizacion, idioma);
    assert.equal(typeof html, 'string');
    assert.ok(html.includes(String(item.solucion)));
  }
});

test('explicarEj3: con exponente 1 no escribe «3 = 3»', () => {
  const html = explicarEj3([[2, 3], [3, 1]], 'es');
  assert.ok(html.includes('2<sup>3</sup> = 8'));
  assert.ok(!html.includes('3 = 3'), html);
  assert.ok(html.includes('8 · 3 = 24'));
});
