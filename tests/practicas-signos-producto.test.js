// Práctica «La regla de los signos» (unidad 3, tarea 85): fuerza bruta con semillas fijas.
// Las comprobaciones usan `evaluar` y `bienEscrita` de la base, que no son de la práctica.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { evaluar, bienEscrita, fmt, ERRORES_TIPICOS } from '../practicas/_comun/enteros.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import {
  generarMultiplica, generarDivide, generarFalta, generarSumaOProducto, generarBienEscrito,
  errorDeSignoProducto, errorDeValorProducto, errorDeDivide, errorDeFalta, errorDeClase, errorDeValorSumaProducto,
  ERROR_OTRO, ERROR_DOS_SIGNOS, ERROR_DIVIDE_ENTRE_0,
} from '../practicas/signos-producto/logica.js';
import {
  TX, feedbackMultiplica, feedbackDivide, feedbackFalta, feedbackClase, feedbackValorSumaProducto, feedbackBien,
} from '../practicas/signos-producto/textos.js';

const N = 3000;
const generarN = (fn, semilla = 1) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => fn(rng)); };
const ctx = idioma => ({ tt: o => o[idioma], t: {}, idioma });
const IDIOMAS = ['es', 'en'];
const conocidos = new Set([...Object.keys(ERRORES_TIPICOS), ERROR_OTRO, ERROR_DOS_SIGNOS, ERROR_DIVIDE_ENTRE_0]);

test('el catálogo declara 5 ejercicios para signos-producto', () => {
  assert.equal(CATALOGO.find(p => p.slug === 'signos-producto').nEjercicios, 5);
});

test('ejercicio 1: factores entre −12 y 12, valor y signo coinciden con evaluar; el negativo no primero va entre paréntesis', () => {
  const pares = new Set();
  for (const item of generarN(generarMultiplica)) {
    assert.ok(Math.abs(item.a) >= 2 && Math.abs(item.a) <= 12 && Math.abs(item.b) >= 2 && Math.abs(item.b) <= 12);
    assert.equal(evaluar(item.texto), item.valor, item.texto);
    assert.equal(item.signo, item.valor < 0 ? '-' : '+');
    assert.ok(bienEscrita(item.texto), item.texto);
    if (item.b < 0) assert.ok(item.texto.includes('(−'), item.texto);
    pares.add(`${item.a < 0}${item.b < 0}`);
    assert.ok(conocidos.has(errorDeSignoProducto(item)));
    assert.ok(conocidos.has(errorDeValorProducto(item, -item.valor)));
  }
  assert.equal(pares.size, 4);
  assert.equal(errorDeValorProducto({ a: 5, b: -2, valor: -10 }, 10), 'signo-del-mayor-producto');
});

test('ejercicio 2: cocientes exactos; 0 : d en 1 de cada 6 y d : 0 en 1 de cada 12; «no se puede» solo con divisor 0', () => {
  let ceros = 0, entreCero = 0;
  for (const item of generarN(generarDivide)) {
    if (item.especial === 'entre-cero') {
      entreCero++;
      assert.equal(item.b, 0);
      assert.equal(item.valor, null);
      assert.ok(item.a !== 0 && Math.abs(item.a) <= 12);
      assert.match(item.texto, / : 0$/);
      assert.equal(errorDeDivide(item, 'no-se-puede'), null);
      assert.equal(errorDeDivide(item, 3), ERROR_DIVIDE_ENTRE_0);
      continue;
    }
    assert.ok(item.b !== 0 && Math.abs(item.b) >= 2 && Math.abs(item.b) <= 12);
    assert.ok(item.a % item.b === 0);
    assert.equal(evaluar(item.texto), item.valor, item.texto);
    assert.equal(errorDeDivide(item, 'no-se-puede'), ERROR_DIVIDE_ENTRE_0);
    if (item.especial === 'cero-entre') { ceros++; assert.equal(item.valor, 0); }
    else assert.ok(Math.abs(item.valor) >= 1 && Math.abs(item.valor) <= 12 && Math.abs(item.a) <= 144);
    assert.ok(conocidos.has(errorDeDivide(item, 99)));
  }
  assert.ok(Math.abs(ceros / N - 1 / 6) < 0.03, `ceros ${ceros}`);
  assert.ok(Math.abs(entreCero / N - 1 / 12) < 0.02, `entre cero ${entreCero}`);
});

test('ejercicio 3: el factor que falta da el producto; factores de 2 a 10', () => {
  const huecos = new Set();
  for (const item of generarN(generarFalta)) {
    assert.ok(Math.abs(item.k) >= 2 && Math.abs(item.k) <= 10 && Math.abs(item.valor) >= 2 && Math.abs(item.valor) <= 10);
    const lleno = item.texto.replace('□', fmt(item.valor).replace(/^−(.*)$/, '(−$1)'));
    assert.equal(evaluar(lleno.replace(/ = .*/, '')), evaluar(lleno.replace(/.* = /, '')), `${item.texto} con ${item.valor}`);
    assert.equal(item.k * item.valor, item.p);
    assert.ok(item.texto.includes('□'));
    // El hueco es único: ningún otro entero lo completa.
    const otros = [];
    for (let x = -12; x <= 12; x++) if (item.k * x === item.p) otros.push(x);
    assert.deepEqual(otros, [item.valor]);
    huecos.add(item.hueco);
    assert.ok(conocidos.has(errorDeFalta(item, -item.valor)));
  }
  assert.equal(huecos.size, 2);
});

test('ejercicio 4: reparto equilibrado de suma, resta y producto; ningún producto sin paréntesis en el negativo', () => {
  const cuenta = { suma: 0, resta: 0, producto: 0 };
  for (const item of generarN(generarSumaOProducto)) {
    cuenta[item.clase]++;
    assert.equal(evaluar(item.texto), item.valor, item.texto);
    assert.equal(item.producto, item.clase === 'producto');
    assert.equal(item.producto, item.texto.includes('·'));
    assert.ok(bienEscrita(item.texto), item.texto);
    if (item.producto) assert.ok(item.a < 0 || item.b < 0);
    else assert.ok(!item.texto.includes('('), 'las sumas y restas no llevan paréntesis');
    assert.ok(conocidos.has(errorDeClase(item)));
    assert.ok(conocidos.has(errorDeValorSumaProducto(item, -item.valor)));
  }
  for (const n of Object.values(cuenta)) assert.ok(Math.abs(n / N - 1 / 3) < 0.04, JSON.stringify(cuenta));
  // El error central: −2 − 3 = 5.
  assert.equal(errorDeValorSumaProducto({ producto: false, clase: 'resta', a: -2, b: 3, valor: -5 }, 5), 'regla-signos-en-suma');
});

test('ejercicio 5: tres escrituras del mismo producto, exactamente una bien escrita', () => {
  for (const item of generarN(generarBienEscrito)) {
    assert.equal(item.opciones.length, 3);
    const textos = item.opciones.map(o => o.texto);
    assert.equal(new Set(textos).size, 3, textos.join(' | '));
    assert.equal(item.opciones.filter(o => bienEscrita(o.texto)).length, 1, textos.join(' | '));
    for (const o of item.opciones) {
      assert.equal(o.bien, bienEscrita(o.texto), o.texto);
      assert.equal(o.bien, o.texto === item.buena);
      if (!o.bien) assert.equal(o.error, ERROR_DOS_SIGNOS);
      assert.equal(o.texto.replace(/[()\s]/g, ''), item.buena.replace(/[()\s]/g, ''));
    }
    assert.equal(evaluar(item.buena), item.valor);
  }
});

function todosLosTextos() {
  const salida = [];
  const rng = crearRng(7);
  for (const idioma of IDIOMAS) {
    const c = ctx(idioma);
    for (let i = 0; i < 400; i++) {
      const m = generarMultiplica(rng);
      salida.push(m.texto, feedbackMultiplica(m, c, true), feedbackMultiplica(m, c, false));
      const d = generarDivide(rng);
      salida.push(d.texto, feedbackDivide(d, c, true), feedbackDivide(d, c, false));
      const f = generarFalta(rng);
      salida.push(f.texto, feedbackFalta(f, c, true), feedbackFalta(f, c, false));
      const s = generarSumaOProducto(rng);
      salida.push(s.texto, feedbackClase(s, c), feedbackValorSumaProducto(s, c, true), feedbackValorSumaProducto(s, c, false));
      const b = generarBienEscrito(rng);
      salida.push(...b.opciones.map(o => o.texto), ...b.opciones.map(o => feedbackBien(b, c, o.texto)));
    }
    for (const bloque of [TX.introduccion, TX.enunciado, TX.nombres, TX.detalles]) for (const v of Object.values(bloque)) salida.push(c.tt(v));
    salida.push(c.tt(TX.resultado), c.tt(TX.no_se_puede), c.tt(TX.es_producto), c.tt(TX.es_suma));
  }
  return salida;
}

test('ningún texto de alumno lleva ×, guion como signo, letras de variable ni +N como resultado', () => {
  const textos = todosLosTextos();
  assert.ok(textos.length > 5000);
  for (const t of textos) {
    const plano = t.replace(/<[^>]+>/g, '');
    assert.ok(!plano.includes('×'), plano);
    assert.ok(!/(^|[\s(])-\s?\d|\d\s?-(\s|\d|$)|\s-\s/.test(plano), `guion como signo en: ${plano}`);
    assert.ok(!/=\s*\+\d/.test(plano), plano);
    assert.ok(!/\d[xn]\b|\b[xn]\s*=|=\s*[xn]\b/.test(plano), plano);
    assert.ok(!/\(\+\d/.test(plano), `(+N fuera de la ficha 84: ${plano}`);
  }
});

test('el feedback lleva los números del ítem, en los dos idiomas', () => {
  const rng = crearRng(11);
  for (let i = 0; i < 500; i++) {
    const m = generarMultiplica(rng);
    for (const idioma of IDIOMAS) assert.ok(feedbackMultiplica(m, ctx(idioma), false).includes(fmt(m.valor)));
    const f = generarFalta(rng);
    for (const idioma of IDIOMAS) assert.ok(feedbackFalta(f, ctx(idioma), false).includes(fmt(f.valor)));
  }
});
