// Práctica «Opuesto y valor absoluto» (reparto-practicas-u2, tarea 81): fuerza bruta,
// 3000 ítems por ejercicio con semillas fijas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { fmt } from '../practicas/_comun/enteros.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import {
  RECTA, rectaPara, generarOpuesto, opuestoDe, errorOpuesto, generarDistancia, errorDistancia,
  generarOpuestoYAbsoluto, errorHueco, generarDistancias, aMarcar, mayorDe, errorMarcar, marcarBien,
} from '../practicas/opuestos/logica.js';
import { TX } from '../practicas/opuestos/textos.js';

const N = 3000;
const generarN = (fn, semilla = 1) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => fn(rng)); };
const cabe = v => v >= RECTA.min && v <= RECTA.max;

test('el catálogo declara cuatro ejercicios para opuestos', () => {
  assert.equal(CATALOGO.find(f => f.slug === 'opuestos').nEjercicios, 4);
});

// --- Ejercicio 1 ---------------------------------------------------------------

test('ej. 1: el punto nunca es el 0 y el opuesto cabe en la recta', () => {
  const items = generarN(generarOpuesto);
  for (const item of items) {
    assert.notEqual(item.n, 0);
    assert.ok(cabe(item.n) && cabe(opuestoDe(item)));
    assert.equal(opuestoDe(item), -item.n);
    if (item.modo === 'doble') assert.ok(item.n < 0, '−(−n) solo con n negativo');
  }
  const dobles = items.filter(i => i.modo === 'doble').length / N;
  assert.ok(dobles > 0.28 && dobles < 0.39, `dobles ${dobles}`);
  assert.ok(items.some(i => i.modo === 'toca' && i.n > 0) && items.some(i => i.modo === 'toca' && i.n < 0));
});

test('ej. 1: errores', () => {
  assert.equal(errorOpuesto({ modo: 'doble', n: -9 }, -9), 'opuesto-del-opuesto');
  assert.equal(errorOpuesto({ modo: 'toca', n: 4 }, 4), 'sin-cambiar-el-signo');
  assert.equal(errorOpuesto({ modo: 'toca', n: 4 }, 3), 'opuesto-incorrecto');
});

// --- Ejercicio 2 ---------------------------------------------------------------

test('ej. 2: el punto cabe en la recta; mitad negativos; el valor absoluto nunca es negativo', () => {
  const items = generarN(generarDistancia);
  for (const { n } of items) { assert.ok(cabe(n)); assert.ok(Math.abs(n) >= 0); }
  const neg = items.filter(i => i.n < 0).length / N;
  assert.ok(neg > 0.45 && neg < 0.6, `negativos ${neg}`);
  assert.ok(items.some(i => i.n === 0) && items.filter(i => i.n === 0).length / N < 0.15);
});

test('ej. 2: errorDistancia', () => {
  assert.equal(errorDistancia({ n: -4 }, -4), 'valor-absoluto-negativo');
  assert.equal(errorDistancia({ n: 4 }, -4), 'valor-absoluto-negativo');
  assert.equal(errorDistancia({ n: -4 }, 3), 'distancia-incorrecta');
});

// --- Ejercicio 3 ---------------------------------------------------------------

test('ej. 3: el valor absoluto nunca es negativo y el reparto positivo/negativo es de un 50 %', () => {
  const items = generarN(generarOpuestoYAbsoluto);
  for (const { n } of items) { assert.ok(n !== 0 && Math.abs(n) <= 20); assert.ok(Math.abs(n) > 0); }
  const neg = items.filter(i => i.n < 0).length / N;
  assert.ok(neg > 0.45 && neg < 0.55, `negativos ${neg}`);
  for (const item of items) {
    const m = rectaPara([item.n]);
    assert.ok(item.n >= m.min && item.n <= m.max && -item.n >= m.min && -item.n <= m.max);
  }
});

test('ej. 3: con un negativo, opuesto y valor absoluto dan lo mismo; con un positivo, no (y errorHueco)', () => {
  for (const { n } of generarN(generarOpuestoYAbsoluto)) {
    assert.equal(-n === Math.abs(n), n < 0);
    assert.equal(errorHueco({ n }, 'opuesto', -n), null);
    assert.equal(errorHueco({ n }, 'absoluto', Math.abs(n)), null);
  }
  assert.equal(errorHueco({ n: -6 }, 'opuesto', -6), 'opuesto-del-opuesto');
  assert.equal(errorHueco({ n: 6 }, 'opuesto', 6), 'sin-cambiar-el-signo');
  assert.equal(errorHueco({ n: -6 }, 'absoluto', -6), 'valor-absoluto-negativo');
  assert.equal(errorHueco({ n: 6 }, 'absoluto', -6), 'valor-absoluto-negativo');
  assert.equal(errorHueco({ n: 6 }, 'absoluto', 5), 'distancia-incorrecta');
});

// --- Ejercicio 4 ---------------------------------------------------------------

test('ej. 4: los dos puntos marcables caben, nunca valor absoluto 0; los negativos a comparar son distintos', () => {
  const items = generarN(generarDistancias);
  for (const item of items) {
    if (item.modo === 'marcar') {
      assert.ok(item.k >= 1 && item.k <= 10);
      const [a, b] = aMarcar(item);
      assert.ok(cabe(a) && cabe(b) && a === -b && a !== 0);
      assert.ok(marcarBien(item, [b, a]));
      assert.ok(!marcarBien(item, [b]));
    } else {
      assert.ok(item.a < 0 && item.b < 0 && item.a !== item.b && cabe(item.a) && cabe(item.b));
      assert.equal(mayorDe(item), Math.abs(item.a) < Math.abs(item.b) ? item.a : item.b);
    }
  }
  const marcar = items.filter(i => i.modo === 'marcar').length / N;
  assert.ok(marcar > 0.45 && marcar < 0.55, `marcar ${marcar}`);
});

test('ej. 4: errorMarcar', () => {
  assert.equal(errorMarcar({ k: 5 }, [5]), 'solo-uno');
  assert.equal(errorMarcar({ k: 5 }, [5, 4]), 'marca-mal');
  assert.equal(errorMarcar({ k: 5 }, [4]), 'marca-mal');
});

// --- Textos de alumno: nada prohibido --------------------------------------------

function textosGenerados() {
  const salida = [];
  const plano = s => String(s).replace(/<[^>]+>/g, '');
  const dos = f => ['es', 'en'].forEach(i => salida.push(plano(f(i))));
  const rng = crearRng(9);
  for (const x of ['ej1', 'ej2', 'ej3', 'ej4']) dos(i => `${TX[x].nombre[i]} ${TX[x].detalle[i]} ${TX[x].introduccion[i]}`);
  for (let k = 0; k < 400; k++) {
    const o = generarOpuesto(rng);
    dos(i => `${TX.ej1.toca[i](o.n)} ${TX.ej1.doble[i](o.n)} ${TX.ej1.bien[i](o.n)} ${TX.ej1.bienDoble[i](o.n)} ${TX.ej1.sinCambiar[i](o.n)} ${TX.ej1.delOpuesto[i](o.n)} ${TX.ej1.otro[i](o.n, -o.n + 1)}`);
    const d = generarDistancia(rng);
    dos(i => `${TX.ej2.bien[i](d.n)} ${TX.ej2.negativo[i](d.n)} ${TX.ej2.otro[i](-3)}`);
    const q = generarOpuestoYAbsoluto(rng);
    dos(i => `${TX.ej3.opuestoDe[i](q.n)} ${TX.ej3.absolutoDe[i](q.n)} ${TX.ej3.bien[i](q.n)} ${TX.ej3.explica[i](q.n)} ${TX.ej3.sinCambiar[i](q.n)} ${TX.ej3.delOpuesto[i](q.n)} ${TX.ej3.comoOpuesto[i](q.n)}`);
    const m = generarDistancias(rng);
    if (m.modo === 'marcar') dos(i => `${TX.ej4.marcar[i](m.k)} ${TX.ej4.bienMarcar[i](m.k)}`);
    else dos(i => `${TX.ej4.comparar[i](m.a, m.b)} ${TX.ej4.bienComparar[i](m.a, m.b)} ${TX.ej4.naturales[i](m.a, m.b)}`);
  }
  return salida;
}

test('ningún texto lleva ×, guion como signo, «(+» ni letras de variable', () => {
  for (const t of textosGenerados()) {
    assert.ok(!t.includes('×'), `× en: ${t}`);
    assert.ok(!/(^|[\s(=<>|])-\d/.test(t), `guion como signo en: ${t}`);
    assert.ok(!t.includes('(+'), `(+ en: ${t}`);
    assert.ok(!/\|[a-z]\||\b\d[xyn]\b|\b[xn]\d/.test(t), `letra de variable en: ${t}`);
    assert.ok(!/(^|\s)\+\d/.test(t), `más delante de un número en: ${t}`);
  }
});

test('fmt: el menos es U+2212', () => { assert.equal(fmt(-4), '−4'); });
