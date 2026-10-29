// Práctica «Compara y ordena» (reparto-practicas-u2, tarea 102): la lógica se prueba por fuerza
// bruta (3000 ítems por ejercicio, semillas fijas) con comparaciones por productos cruzados
// escritas aquí, no las de la base.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { fraccion } from '../practicas/_comun/fracciones.js';
import {
  generarComparar, simboloComparar, errorComparar, explicarComparar,
  generarCajas, cajaDe, fallosCajas, errorCajas, explicarCajas,
  generarOrden, ordenCorrecto, ordenBien, errorOrden, explicarOrden,
  generarRecta, fraccionRecta, errorRecta, explicarRecta,
} from '../practicas/compara/logica.js';
import { marcasRecta } from '../practicas/_comun/dibujo-fracciones.js';
import { TX } from '../practicas/compara/textos.js';

const N = 3000;
const generarN = (fn, semilla = 1, n = N) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };
const sinEtiquetas = s => s.replace(/<[^>]*>/g, ' ');
/** a/b contra c/d con productos cruzados (denominadores > 0): −1, 0 o 1. */
const cmp = (a, b) => Math.sign(a.num * b.den - b.num * a.den);
const mismoValor = (a, b) => a.num * b.den === b.num * a.den;
const f = ({ num, den }) => fraccion(num, den);

// --- Ejercicio 1: mayor o menor ---------------------------------------------------

test('mayor o menor: reparto de los tres casos ≥ 25 %, ≥ 20 % con negativa, siempre distintas por valor', () => {
  const items = generarN(generarComparar);
  for (const caso of ['mismo-den', 'mismo-num', 'distinto']) {
    assert.ok(items.filter(i => i.caso === caso).length >= N * 0.25, caso);
  }
  assert.ok(items.filter(i => i.a.num < 0 || i.b.num < 0).length >= N * 0.2, 'negativas');
  for (const { a, b, caso } of items) {
    assert.ok(a.den >= 2 && a.den <= 12 && b.den >= 2 && b.den <= 12);
    assert.equal(mismoValor(a, b), false, `${a.num}/${a.den} y ${b.num}/${b.den} valen lo mismo`);
    if (caso === 'mismo-den') assert.equal(a.den, b.den);
    if (caso === 'mismo-num') assert.equal(Math.abs(a.num), Math.abs(b.num));
    if (caso === 'distinto') assert.ok(a.den !== b.den && Math.abs(a.num) !== Math.abs(b.num));
  }
});

test('mayor o menor: el símbolo bueno coincide con los productos cruzados y el error se nombra', () => {
  const nombres = new Set();
  for (const item of generarN(generarComparar, 2)) {
    const c = cmp(item.a, item.b);
    const buena = c < 0 ? '<' : '>';
    const mala = c < 0 ? '>' : '<';
    assert.equal(simboloComparar(item), buena);
    assert.equal(errorComparar(item, buena), null);
    const e = errorComparar(item, mala);
    assert.ok(['ignora-el-signo', 'compara-solo-numeradores', 'compara-solo-denominadores', 'compara-mal'].includes(e), e);
    nombres.add(e);
    // El error típico del caso da de verdad la respuesta mala
    const positivos = item.a.num > 0 && item.b.num > 0;
    if (item.caso === 'distinto' && positivos) assert.equal(e, 'compara-solo-numeradores');
    if (item.caso === 'mismo-num' && positivos) assert.equal(e, 'compara-solo-denominadores');
    if (item.a.num < 0 || item.b.num < 0) assert.equal(e, 'ignora-el-signo');
  }
  assert.ok(nombres.has('ignora-el-signo') && nombres.has('compara-solo-numeradores') && nombres.has('compara-solo-denominadores'));
});

// --- Ejercicio 2: frente a 1 y a 1/2 ----------------------------------------------

test('cajas: seis fracciones, al menos una por caja, ninguna igual a 1/2 ni a 1, sin negativas ni equivalentes', () => {
  for (const item of generarN(generarCajas)) {
    assert.equal(item.fracs.length, 6);
    const cajas = item.fracs.map(cajaDe);
    for (const c of ['menor', 'entre', 'mayor']) assert.ok(cajas.includes(c), c);
    for (const g of item.fracs) {
      assert.ok(g.num >= 1 && g.den >= 2 && g.den <= 12, `${g.num}/${g.den}`);
      assert.notEqual(2 * g.num, g.den, 'igual a 1/2');
      assert.notEqual(g.num, g.den, 'igual a 1');
      // la caja, comprobada con productos cruzados
      const frenteMedio = cmp(g, { num: 1, den: 2 }), frenteUno = cmp(g, { num: 1, den: 1 });
      assert.equal(cajaDe(g), frenteMedio < 0 ? 'menor' : frenteUno < 0 ? 'entre' : 'mayor');
    }
    for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) assert.equal(mismoValor(item.fracs[i], item.fracs[j]), false);
  }
});

test('cajas: la colocación buena no falla; una mala se explica con los números y se nombra', () => {
  let solo = 0;
  for (const item of generarN(generarCajas, 3)) {
    const buenas = item.fracs.map(cajaDe);
    assert.deepEqual(fallosCajas(item, buenas), []);
    const mal = [...buenas];
    mal[0] = buenas[0] === 'menor' ? 'entre' : 'menor';
    const fallos = fallosCajas(item, mal);
    assert.equal(fallos.length, 1);
    const e = errorCajas(item, fallos);
    assert.ok(e === 'compara-solo-numeradores' || e === 'caja-mal');
    if (e === 'compara-solo-numeradores') solo++;
    const t = sinEtiquetas(explicarCajas(item, fallos, 'es'));
    assert.match(t, new RegExp(`${item.fracs[0].num} · 2 = ${2 * item.fracs[0].num}|${item.fracs[0].num} es mayor que ${item.fracs[0].den}`));
  }
  assert.ok(solo > 0);
});

// --- Ejercicio 3: ordena ----------------------------------------------------------

test('ordena: de 3 a 5 tarjetas, sin equivalentes, parecidas, un único orden correcto (también con negativas)', () => {
  const items = generarN(generarOrden);
  assert.ok(items.filter(i => i.fracs.some(g => g.num < 0)).length >= N * 0.18, 'negativas');
  assert.ok(items.filter(i => i.creciente).length > N * 0.4 && items.filter(i => !i.creciente).length > N * 0.4);
  const tamanos = new Set(items.map(i => i.fracs.length));
  assert.deepEqual([...tamanos].sort(), [3, 4, 5]);
  for (const item of items) {
    const n = item.fracs.length;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) assert.notEqual(cmp(item.fracs[i], item.fracs[j]), 0, 'valores repetidos');
    assert.ok(new Set(item.fracs.map(g => g.den)).size >= 2);
    for (const g of item.fracs) assert.ok(Math.abs(g.num) < g.den && g.den <= 36 && Math.abs(g.num) >= 1);
    // el orden: ordenar con productos cruzados da lo mismo
    const esperado = item.fracs.map((_, i) => i).sort((i, j) => cmp(item.fracs[i], item.fracs[j]));
    if (!item.creciente) esperado.reverse();
    assert.deepEqual(ordenCorrecto(item), esperado);
    assert.equal(ordenBien(item, esperado), true);
    assert.equal(errorOrden(item, esperado), null);
  }
});

test('ordena: los órdenes malos se nombran; el feedback lleva el común denominador y el orden', () => {
  const nombres = new Set();
  for (const item of generarN(generarOrden, 2)) {
    const buena = ordenCorrecto(item);
    const al = [...buena].reverse();
    const eR = errorOrden(item, al);
    assert.ok(['orden-al-reves', 'ordena-por-denominadores', 'ordena-por-numeradores', 'ignora-el-signo'].includes(eR), eR);
    nombres.add(eR);
    const rng = crearRng(5);
    const otro = rng.barajar(buena);
    if (!ordenBien(item, otro)) nombres.add(errorOrden(item, otro));
    const t = sinEtiquetas(explicarOrden(item, al, 'es')).replace(/\s+/g, ' ');
    assert.match(t, /denominador común \d+/);
  }
  assert.ok(nombres.size >= 2, [...nombres].join());
});

// --- Ejercicio 4: en la recta -----------------------------------------------------

test('recta: la fracción cae en una marca dibujada; d de 2 a 12; en −1 a 1 la pedida es la negativa', () => {
  const items = generarN(generarRecta);
  const por = { '0:1': 0, '0:2': 0, '-1:1': 0 };
  for (const item of items) {
    por[`${item.min}:${item.max}`]++;
    assert.ok(item.den >= 2 && item.den <= 12);
    const marcas = marcasRecta({ min: item.min, max: item.max, den: item.den });
    assert.ok(marcas.some(m => m.equals(fraccionRecta(item))), 'cae en una marca');
    assert.ok(marcas.length <= 13, `${marcas.length} marcas`);
    assert.notEqual(item.num % item.den, 0, 'no es un entero');
    if (item.min < 0) assert.ok(item.num < 0 && item.num > -item.den, 'negativa entre −1 y 0');
    else assert.ok(item.num > 0 && item.num < item.max * item.den);
  }
  assert.ok(por['-1:1'] >= N * 0.2 && por['0:1'] >= N * 0.3 && por['0:2'] >= N * 0.25, JSON.stringify(por));
});

test('recta: los toques malos se nombran (marcas, simétrico, desde el −1) y el feedback cuenta los huecos', () => {
  const nombres = new Set();
  for (const item of generarN(generarRecta, 2)) {
    const buena = fraccionRecta(item);
    assert.equal(errorRecta(item, buena), null);
    assert.equal(errorRecta(item, buena.equivalentePor(1)), null);
    const marcas = marcasRecta({ min: item.min, max: item.max, den: item.den });
    for (const m of marcas) {
      if (m.equals(buena)) continue;
      const e = errorRecta(item, m);
      nombres.add(e);
      if (m.equals(buena.opuesta())) assert.equal(e, 'toca-el-simetrico');
    }
    const t = sinEtiquetas(explicarRecta(item, buena.opuesta(), 'es')).replace(/\s+/g, ' ');
    assert.match(t, new RegExp(`${Math.abs(item.num)} huecos?`));
  }
  for (const e of ['contar-marcas', 'toca-el-simetrico', 'contar-desde-menos-uno', 'marca-mal']) assert.ok(nombres.has(e), e);
});

// --- Textos -----------------------------------------------------------------------

test('textos: nada de ×, de variables, de decimales ni de «/» como fracción; todo con números del ítem', () => {
  const textos = [];
  for (const idioma of ['es', 'en']) {
    for (const item of generarN(generarComparar, 9, 500)) {
      textos.push(explicarComparar(item, null, idioma), explicarComparar(item, simboloComparar(item) === '<' ? '>' : '<', idioma));
    }
    for (const item of generarN(generarCajas, 9, 500)) {
      const buenas = item.fracs.map(cajaDe);
      const mal = buenas.map(c => (c === 'menor' ? 'mayor' : 'menor'));
      textos.push(explicarCajas(item, fallosCajas(item, mal), idioma), explicarCajas(item, [], idioma));
    }
    for (const item of generarN(generarOrden, 9, 500)) {
      const ord = ordenCorrecto(item);
      textos.push(explicarOrden(item, null, idioma), explicarOrden(item, [...ord].reverse(), idioma));
    }
    for (const item of generarN(generarRecta, 9, 500)) {
      const b = fraccionRecta(item);
      textos.push(explicarRecta(item, null, idioma), explicarRecta(item, b.opuesta(), idioma), explicarRecta(item, fraccion(b.num - Math.sign(b.num), b.den), idioma));
    }
  }
  for (const t of textos) {
    const plano = sinEtiquetas(t).replace(/&[lg]t;/g, ' ');
    assert.ok(!plano.includes('×'), plano);
    assert.ok(!/\d\s*\/\s*\d/.test(plano.replace(/menor que 1\/2|mayor que 1\/2|less than 1\/2/g, '')), `barra de fracción: ${plano}`);
    assert.ok(!/\d[.,]\d/.test(plano), `decimal: ${plano}`);
    assert.ok(!/(^|[^A-Za-zÁ-úñ])[xznk]([^A-Za-zÁ-úñ]|$)/.test(plano), `letra suelta: ${plano}`);
    assert.ok(!/undefined|NaN|null/.test(plano), plano);
    assert.ok(!/\bfactor/i.test(plano), plano);
  }
});

test('textos: toda negativa lleva el signo delante de la raya (htmlFraccion), nunca dentro', () => {
  for (const item of generarN(generarComparar, 4)) {
    const t = explicarComparar(item, null, 'es');
    assert.ok(!/<span>−/.test(t), 'signo dentro del numerador');
    if (item.a.num < 0) assert.match(t, /frac-neg/);
  }
});

test('textos: todo texto propio existe en español y en inglés', () => {
  const revisa = (obj, ruta) => {
    for (const [k, v] of Object.entries(obj)) {
      if (v && typeof v === 'object' && !('es' in v && 'en' in v)) revisa(v, `${ruta}.${k}`);
      else if (v && typeof v === 'object') {
        assert.equal(typeof v.es, typeof v.en, `${ruta}.${k}`);
        assert.ok(v.es && v.en, `${ruta}.${k}`);
      }
    }
  };
  revisa(TX, 'TX');
});

// --- Reabierta del 28-10 ------------------------------------------------------------

test('cajas: una 1/d mal puesta no dice que el numerador engaña (es el mismo que el de 1/2); 4/9 y similares sí', () => {
  let unos = 0, otros = 0;
  for (const item of generarN(generarCajas, 77)) {
    item.fracs.forEach((fr, i) => {
      if (cajaDe(fr) !== 'menor') return;
      const fallos = [{ i, puesto: 'medio', correcta: 'menor' }];
      if (fr.num === 1) { unos++; assert.equal(errorCajas(item, fallos), 'caja-mal', `${fr.num}/${fr.den}`); }
      else { otros++; assert.equal(errorCajas(item, fallos), 'compara-solo-numeradores', `${fr.num}/${fr.den}`); }
    });
  }
  assert.ok(unos > 100 && otros > 100, `${unos} / ${otros}`);
  for (const idioma of ['es', 'en']) {
    const item = { fracs: [{ num: 1, den: 7 }, { num: 3, den: 4 }, { num: 5, den: 3 }, { num: 2, den: 9 }, { num: 3, den: 7 }, { num: 4, den: 3 }] };
    assert.ok(!/numera/i.test(sinEtiquetas(explicarCajas(item, [{ i: 0, puesto: 'medio', correcta: 'menor' }], idioma))), idioma);
  }
});

test('recta: una marca entera tocada se nombra como entero («−1», «1», «0»), no como −6/6', () => {
  let casos = 0;
  for (const item of generarN(generarRecta, 78)) {
    for (let m = item.min; m <= item.max; m++) {
      const toque = fraccion(m * item.den, item.den);
      if (errorRecta(item, toque) !== 'marca-mal') continue;
      casos++;
      for (const idioma of ['es', 'en']) {
        const t = sinEtiquetas(explicarRecta(item, toque, idioma)).replace(/\s+/g, ' ');
        const nombre = String(m).replace('-', '−');
        assert.ok(t.startsWith(`Has tocado ${nombre},`) || t.startsWith(`You tapped ${nombre},`), t);
      }
    }
  }
  assert.ok(casos > 500, `casos: ${casos}`);
});

test('textos: «½» y «1 and a half» no aparecen en los textos de alumno', () => {
  const todo = JSON.stringify(TX) + [explicarCajas({ fracs: [{ num: 4, den: 9 }, { num: 1, den: 3 }, { num: 5, den: 8 }, { num: 7, den: 5 }, { num: 8, den: 7 }, { num: 3, den: 7 }] }, [{ i: 0, puesto: 'medio', correcta: 'menor' }], 'es')].join('');
  assert.ok(!todo.includes('½') && !/1 and a half/.test(todo));
});
