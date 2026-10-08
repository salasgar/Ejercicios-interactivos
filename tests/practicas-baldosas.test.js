// Baldosas y cuerdas (practicas/baldosas/): generadores y comprobaciones por
// fuerza bruta, con definiciones independientes de las de logica.js y de
// ../practicas/_comun/aritmetica.js.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  generarBaldosa, esLaMasGrande, cabeEnLado,
  generarCuantas, esNumeroDeBaldosas,
  generarCuerdas, esCorteDeCuerdas,
} from '../practicas/baldosas/logica.js';

const N = 1200;

/** m.c.d. por fuerza bruta, independiente de ../practicas/_comun/aritmetica.js. */
function mcdBruto(...numeros) {
  let g = 1;
  for (let d = 1; d <= Math.min(...numeros); d++) if (numeros.every(n => n % d === 0)) g = d;
  return g;
}

function divisoresBruto(n) {
  const ds = [];
  for (let d = 1; d <= n; d++) if (n % d === 0) ds.push(d);
  return ds;
}

// --- Ejercicio 1: la baldosa más grande -----------------------------------------

test('baldosa: g es el m.c.d. por fuerza bruta, y solo él es la más grande', () => {
  const rng = crearRng(101);
  for (let i = 0; i < N; i++) {
    const item = generarBaldosa(rng);
    const { a, b, g, candidatos } = item;
    assert.ok(a >= 12 && a <= 90 && b >= 12 && b <= 90);
    assert.notEqual(a, b);
    assert.ok(g >= 2);
    assert.equal(g, mcdBruto(a, b));
    assert.equal(a % g, 0);
    assert.equal(b % g, 0);
    // Regla de oro: solo g es la baldosa más grande; cualquier otro candidato
    // o no divide a los dos, o divide a los dos pero no es el mayor común.
    for (const s of candidatos) {
      const esLaMayor = s === mcdBruto(a, b);
      assert.equal(esLaMasGrande(item, s), esLaMayor);
      if (s !== g) {
        const divideALosDos = a % s === 0 && b % s === 0;
        if (divideALosDos) assert.ok(s < g, `${s} divide a los dos pero no es menor que g=${g}`);
      }
    }
  }
});

test('baldosa: candidatos ordenados, sin repetidos, hasta 8, con g, un común menor y uno que falla', () => {
  const rng = crearRng(202);
  for (let i = 0; i < N; i++) {
    const { a, b, g, candidatos } = generarBaldosa(rng);
    assert.ok(candidatos.length >= 2 && candidatos.length <= 8);
    assert.deepEqual(candidatos, [...candidatos].sort((x, y) => x - y));
    assert.equal(new Set(candidatos).size, candidatos.length);
    assert.ok(candidatos.includes(g));
    assert.ok(candidatos.some(s => s < g && a % s === 0 && b % s === 0), 'falta un divisor común menor que g');
    assert.ok(candidatos.some(s => a % s !== 0 || b % s !== 0), 'falta un lado que no divide a alguno de los dos');
  }
});

test('cabeEnLado: cociente y resto por fuerza bruta', () => {
  const rng = crearRng(303);
  for (let i = 0; i < N; i++) {
    const { a } = generarBaldosa(rng);
    const lado = rng.entero(2, 9);
    const { cociente, resto, cabe } = cabeEnLado(a, lado);
    let c = 0;
    while ((c + 1) * lado <= a) c++;
    assert.equal(cociente, c);
    assert.equal(resto, a - c * lado);
    assert.equal(cabe, a % lado === 0);
  }
});

test('baldosa: variedad de rectángulos (no siempre el mismo)', () => {
  const rng = crearRng(404);
  const vistos = new Set();
  for (let i = 0; i < N; i++) { const { a, b } = generarBaldosa(rng); vistos.add(`${a}x${b}`); }
  assert.ok(vistos.size >= 30);
});

// --- Ejercicio 2: ¿cuántas baldosas? ---------------------------------------------

test('cuantas: (a/g)·(b/g) por fuerza bruta, y solo esa respuesta acierta', () => {
  const rng = crearRng(505);
  for (let i = 0; i < N; i++) {
    const item = generarCuantas(rng);
    const { a, b, g, cuantas, errorSuma } = item;
    assert.ok(a >= 12 && a <= 90 && b >= 12 && b <= 90);
    assert.notEqual(a, b);
    assert.ok(g >= 2);
    assert.equal(g, mcdBruto(a, b));
    const esperado = (a / g) * (b / g);
    assert.equal(cuantas, esperado);
    assert.ok(cuantas <= 72);
    assert.equal(errorSuma, a / g + b / g);
    assert.ok(esNumeroDeBaldosas(item, cuantas));
    assert.ok(!esNumeroDeBaldosas(item, cuantas - 1));
    assert.ok(!esNumeroDeBaldosas(item, errorSuma) || errorSuma === cuantas);
    assert.ok(!esNumeroDeBaldosas(item, g) || g === cuantas);
  }
});

// --- Ejercicio 3: cuerdas ---------------------------------------------------------

test('cuerdas: g es el m.c.d. de todas por fuerza bruta, y los trozos se suman', () => {
  const rng = crearRng(606);
  let dosVistas = false, tresVistas = false;
  for (let i = 0; i < N; i++) {
    const item = generarCuerdas(rng);
    const { longitudes, g, porCuerda, trozosTotal } = item;
    assert.ok(longitudes.length === 2 || longitudes.length === 3);
    if (longitudes.length === 2) dosVistas = true; else tresVistas = true;
    assert.equal(new Set(longitudes).size, longitudes.length);
    for (const l of longitudes) assert.ok(l >= 2 && l <= 160);
    assert.equal(g, mcdBruto(...longitudes));
    assert.ok(g >= 3);
    porCuerda.forEach((p, idx) => assert.equal(p, longitudes[idx] / g));
    const sumaBruta = porCuerda.reduce((s, x) => s + x, 0);
    assert.equal(trozosTotal, sumaBruta);
    assert.ok(esCorteDeCuerdas(item, g, trozosTotal));
    assert.ok(!esCorteDeCuerdas(item, g + 1, trozosTotal));
    assert.ok(!esCorteDeCuerdas(item, g, trozosTotal + 1));
    assert.ok(!esCorteDeCuerdas(item, g - 1, trozosTotal));
  }
  assert.ok(dosVistas && tresVistas, 'faltan casos de 2 o de 3 cuerdas');
});

test('cuerdas: variedad de longitudes', () => {
  const rng = crearRng(707);
  const vistos = new Set();
  for (let i = 0; i < N; i++) vistos.add(generarCuerdas(rng).longitudes.join(','));
  assert.ok(vistos.size >= 30);
});

test('textos: la introducción del ejercicio 2 no usa letras, y los mensajes citan los números del ítem', async () => {
  const { TX } = await import('../practicas/baldosas/textos.js');
  for (const idioma of ['es', 'en']) {
    const intro = TX.cuantas.introduccion[idioma].replace(/<[^>]*>/g, ' ');
    assert.doesNotMatch(intro, /\(a, b\)|a : |b : /);
    assert.match(intro, /40 : 8 = 5/);
    assert.match(intro, /56 : 8 = 7/);
  }
  // Sin «Lado 7:» repetido ni «no cabe» duplicado cuando no cabe en ninguno.
  const fa = TX.baldosa.resto_en.es(40, 7, 5, 5), fb = TX.baldosa.resto_en.es(30, 7, 4, 2);
  const dos = TX.baldosa.sobra_dos.es(7, fa, fb);
  assert.equal(dos, 'Lado 7: 40 : 7 = 5, sobran 5 dm; 30 : 7 = 4, sobran 2 dm. No cabe en ninguno de los dos.');
  assert.equal((dos.match(/Lado/g) || []).length, 1);
  assert.match(TX.baldosa.incorrecto_no_cabe.es(7, fa), /^7 no vale: 40 : 7 = 5, sobran 5 dm/);
  assert.match(TX.cuantas.instruccion.en(40, 56, 8), /tiles of side 8/);
  // 5 baldosas a lo largo y 7 a lo ancho: el dibujo tiene 7 filas de 5.
  assert.match(TX.cuantas.error_suma.es(5, 7, 35), /7 filas de 5 son 35/);
  assert.match(TX.cuantas.error_suma.en(5, 7, 35), /7 rows of 5 is 35/);
  assert.match(TX.cuerdas.pista_total_coherente.es(6, [5, 7], 12), /bien hecha \(5 \+ 7 = 12\).*no es el más largo/);
});

test('práctica.js: cada dibujo lleva ids de pattern únicos (no fijos)', async () => {
  const { readFile } = await import('node:fs/promises');
  const src = await readFile(new URL('../practicas/baldosas/practica.js', import.meta.url), 'utf8');
  assert.doesNotMatch(src, /id="baldosas-(cuadricula|rayado)"/);
  assert.match(src, /id="\$\{id\}-cuadricula"/);
});
