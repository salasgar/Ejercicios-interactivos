// Práctica «La recta y el termómetro» (reparto-practicas-u2, tarea 80): fuerza bruta,
// 3000 ítems por ejercicio con semillas fijas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { fmt } from '../practicas/_comun/enteros.js';
import { marcas } from '../practicas/_comun/recta-enteros.js';
import {
  generarColoca, escritos, errorColoca, RECTAS,
  generarTemperatura, errorTemperatura, CONTEXTOS_TEMPERATURA,
  generarComparar, simbolo, errorComparar,
  generarOrden, ordenCorrecto, ordenBien, errorOrden, cadenaOrden,
  generarClases, cajaDe, escribe, fallosClases, errorClases,
} from '../practicas/termometro/logica.js';
import { TX } from '../practicas/termometro/textos.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';

const N = 3000;
const generarN = (fn, semilla = 1) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => fn(rng)); };

test('el catálogo declara cinco ejercicios para termometro', () => {
  assert.equal(CATALOGO.find(f => f.slug === 'termometro').nEjercicios, 5);
});

// --- Ejercicio 1 ---------------------------------------------------------------

test('ej. 1: la respuesta está en una marca de la recta y no lleva su número escrito', () => {
  for (const item of generarN(generarColoca)) {
    assert.ok(marcas(item).includes(item.objetivo), `${item.objetivo} fuera de la recta`);
    assert.ok(!item.numeros.includes(item.objetivo));
    assert.notEqual(item.objetivo, 0);
    assert.ok(item.numeros.includes(0), 'el 0 siempre está escrito');
    assert.deepEqual(item.numeros, escritos(item));
  }
});

test('ej. 1: salen las dos rectas, positivos y negativos, y el simétrico es una marca tocable', () => {
  const items = generarN(generarColoca);
  for (const r of RECTAS) assert.ok(items.some(i => i.paso === r.paso), `falta la recta de ${r.paso} en ${r.paso}`);
  assert.ok(items.filter(i => i.objetivo < 0).length > N * 0.5);
  assert.ok(items.filter(i => i.objetivo > 0).length > N * 0.3);
  for (const i of items) assert.ok(marcas(i).includes(-i.objetivo));
});

test('ej. 1: errorColoca distingue el simétrico, la vecina y otra', () => {
  const item = { min: -10, max: 10, paso: 1, objetivo: -3 };
  assert.equal(errorColoca(item, 3), 'signo-cambiado');
  assert.equal(errorColoca(item, -4), 'marca-vecina');
  assert.equal(errorColoca(item, 8), 'otra-marca');
});

// --- Ejercicio 2 ---------------------------------------------------------------

test('ej. 2: el valor cae en una marca, dentro de la escala y de la cota de su contexto', () => {
  for (const item of generarN(generarTemperatura)) {
    assert.ok(marcas(item).includes(item.valor), `${item.valor} no es marca de ${item.min}..${item.max} de ${item.paso}`);
    assert.ok(item.valor % item.paso === 0);
    const cota = CONTEXTOS_TEMPERATURA[item.contexto];
    assert.ok(item.valor >= cota.min && item.valor <= cota.max, `${item.valor} fuera de la cota de ${item.contexto}`);
    assert.ok(item.min === -item.max && item.min < 0 && item.max > 0, 'la escala incluye el 0');
  }
});

test('ej. 2: un tercio, aproximadamente, de las escalas es de 2 en 2 o de 5 en 5, y salen los tres pasos', () => {
  const items = generarN(generarTemperatura);
  const otros = items.filter(i => i.paso > 1).length / N;
  assert.ok(otros > 0.25 && otros < 0.45, `proporción ${otros}`);
  for (const p of [1, 2, 5]) assert.ok(items.some(i => i.paso === p));
  assert.ok(items.filter(i => i.valor < 0).length > N * 0.5);
});

test('ej. 2: errorTemperatura', () => {
  const item = { paso: 5, valor: -10 };
  assert.equal(errorTemperatura(item, 10), 'signo-cambiado');
  assert.equal(errorTemperatura(item, -2), 'cuenta-marcas');
  assert.equal(errorTemperatura(item, -7), 'lectura-incorrecta');
});

// --- Ejercicio 3 ---------------------------------------------------------------

test('ej. 3: dos números distintos, entre −10 y 10, y el reparto de casos', () => {
  const items = generarN(generarComparar);
  for (const { a, b } of items) {
    assert.notEqual(a, b);
    assert.ok(Math.abs(a) <= 10 && Math.abs(b) <= 10);
  }
  const dosNeg = items.filter(i => i.a < 0 && i.b < 0).length / N;
  const conCero = items.filter(i => i.a === 0 || i.b === 0).length / N;
  const mixtaGrande = items.filter(i => (i.a < 0) !== (i.b < 0) && i.a !== 0 && i.b !== 0
    && Math.abs(Math.min(i.a, i.b)) > Math.max(i.a, i.b)).length / N;
  assert.ok(dosNeg >= 0.3, `dos negativos ${dosNeg}`);
  assert.ok(conCero >= 0.1, `con cero ${conCero}`);
  assert.ok(mixtaGrande >= 0.2, `positivo contra negativo grande ${mixtaGrande}`);
  assert.ok(items.some(i => i.a < 0 && i.b < 0 && i.a < i.b) && items.some(i => i.a < 0 && i.b < 0 && i.a > i.b));
});

test('ej. 3: el símbolo es el correcto y el contrario es siempre un error con nombre', () => {
  for (const item of generarN(generarComparar)) {
    const buena = simbolo(item);
    assert.equal(buena, item.a < item.b ? '<' : '>');
    assert.equal(errorComparar(item, buena), null);
    const mala = buena === '<' ? '>' : '<';
    assert.match(errorComparar(item, mala), /^(compara-como-naturales|compara-valor-absoluto)$/);
  }
});

// --- Ejercicio 4 ---------------------------------------------------------------

test('ej. 4: de cuatro a seis números distintos con negativos, y el orden correcto', () => {
  const items = generarN(generarOrden);
  for (const item of items) {
    assert.ok(item.numeros.length >= 4 && item.numeros.length <= 6);
    assert.equal(new Set(item.numeros).size, item.numeros.length, 'repetidos');
    assert.ok(item.numeros.filter(v => v < 0).length >= 2);
    assert.ok(item.numeros.some(v => v > 0));
    assert.ok(item.numeros.every(v => Math.abs(v) <= 15));
    const bien = ordenCorrecto(item);
    assert.ok(ordenBien(item, bien));
    assert.ok(!ordenBien(item, bien.slice(0, -1)));
    assert.ok(bien.every((v, i) => i === 0 || (item.creciente ? bien[i - 1] < v : bien[i - 1] > v)));
  }
  assert.ok(items.some(i => i.creciente) && items.some(i => !i.creciente));
  assert.ok(items.some(i => i.numeros.includes(0)));
});

test('ej. 4: errorOrden reconoce ordenar los negativos como naturales y el orden al revés', () => {
  const item = { numeros: [3, -7, 0, -2], creciente: true };
  assert.equal(errorOrden(item, [-2, -7, 0, 3]), 'ordena-como-naturales');
  assert.equal(errorOrden(item, [3, 0, -2, -7]), 'orden-al-reves');
  assert.equal(errorOrden(item, [0, 3, -7, -2]), 'orden-incorrecto');
  assert.equal(cadenaOrden(item), '−7 &lt; −2 &lt; 0 &lt; 3');
});

// --- Ejercicio 5 ---------------------------------------------------------------

test('ej. 5: ocho números distintos, el 0 siempre, y al menos uno de cada caja', () => {
  const items = generarN(generarClases);
  for (const item of items) {
    assert.equal(item.numeros.length, 8);
    const valores = item.numeros.map(n => n.valor);
    assert.equal(new Set(valores).size, 8);
    assert.ok(valores.includes(0));
    for (const caja of ['positivo', 'negativo', 'ninguno']) assert.ok(valores.some(v => cajaDe(v) === caja), caja);
    assert.ok(valores.filter(v => v > 0).length >= 2 && valores.filter(v => v < 0).length >= 2);
    assert.ok(valores.every(v => Number.isInteger(v)));
    for (const n of item.numeros) if (n.mas) assert.ok(n.valor > 0, 'solo los positivos llevan +');
  }
  const conMas = items.filter(i => i.numeros.some(n => n.mas)).length / N;
  assert.ok(conMas > 0.4 && conMas < 0.6, `con + escrito ${conMas}`);
});

test('ej. 5: fallosClases y errorClases', () => {
  const item = { numeros: [{ valor: 0, mas: false }, { valor: 5, mas: true }, { valor: -3, mas: false }] };
  assert.deepEqual(fallosClases(item, ['ninguno', 'positivo', 'negativo']), []);
  const f = fallosClases(item, ['positivo', 'positivo', 'negativo']);
  assert.equal(f.length, 1);
  assert.equal(errorClases(f), 'cero-con-signo');
  assert.equal(errorClases(fallosClases(item, ['ninguno', 'ninguno', 'negativo'])), 'mas-no-es-positivo');
  assert.equal(escribe(item.numeros[1]), '+5');
  assert.equal(escribe(item.numeros[2]), '−3');
});

// --- Textos de alumno: nada prohibido --------------------------------------------

function textosGenerados() {
  const salida = [];
  const plano = s => String(s).replace(/<[^>]+>/g, '');
  const dos = f => ['es', 'en'].forEach(i => salida.push(plano(f(i))));
  const rng = crearRng(7);
  for (const x of ['ej1', 'ej2', 'ej3', 'ej4', 'ej5']) dos(i => `${TX[x].nombre[i]} ${TX[x].detalle[i]} ${TX[x].introduccion[i]}`);
  for (let k = 0; k < 400; k++) {
    const c = generarColoca(rng); const toque = -c.objetivo;
    dos(i => `${TX.ej1.pregunta[i](c.objetivo)} ${TX.ej1.bien[i](c.objetivo, c.paso)} ${TX.ej1.simetrico[i](c.objetivo, toque)} ${TX.ej1.vecina[i](c.objetivo, c.objetivo + c.paso)} ${TX.ej1.otra[i](c.objetivo, 0)}`);
    const t = generarTemperatura(rng);
    dos(i => `${TX.ej2.contexto[t.contexto][i]} ${TX.ej2.escala[i](t.paso)} ${TX.ej2.bien[i](t.valor, t.paso)} ${TX.ej2.signo[i](t.valor)} ${TX.ej2.marcas[i](t.valor, -3, t.paso)} ${TX.ej2.otro[i](-t.valor)}`);
    const m = generarComparar(rng);
    dos(i => `${TX.ej3.bien[i](m.a, m.b)} ${TX.ej3.naturales[i](m.a, m.b)} ${TX.ej3.absoluto[i](m.a, m.b)}`);
    const o = generarOrden(rng);
    dos(i => `${TX.ej4.pregunta[i](o.creciente)} ${TX.ej4.bien[i](cadenaOrden(o))} ${TX.ej4.suyo[i](o.numeros.map(fmt).join(', '))}`);
    const q = generarClases(rng);
    dos(i => `${q.numeros.map(escribe).join(' ')} ${TX.ej5.mas[i](5)} ${TX.ej5.otro[i](q.numeros[0].valor, TX.ej5.cajaTexto.positivo[i])}`);
  }
  return salida;
}

test('ningún texto lleva ×, guion como signo, «(+» ni letras de variable', () => {
  for (const t of textosGenerados()) {
    assert.ok(!t.includes('×'), `× en: ${t}`);
    assert.ok(!/(^|[\s(=<>])-\d/.test(t), `guion como signo en: ${t}`);
    assert.ok(!t.includes('(+'), `(+ en: ${t}`);
    assert.ok(!/\b\d[xyn]\b|\b[xyn]\d/.test(t), `letra de variable en: ${t}`);
  }
});

test('el «+5» solo se escribe en el ejercicio 5 (y en su introducción)', () => {
  for (const x of ['ej1', 'ej2', 'ej3', 'ej4']) {
    for (const i of ['es', 'en']) assert.ok(!/(^|\s)\+\d/.test(TX[x].introduccion[i].replace(/<[^>]+>/g, '')), `${x} ${i}`);
  }
});
