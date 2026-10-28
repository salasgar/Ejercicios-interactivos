// Práctica «Multiplica y divide» (unidad 4, tarea 105): fuerza bruta con semillas fijas (3000 ítems
// por ejercicio). Las comprobaciones usan `Fraccion` de la base, que no es de la práctica: siempre
// por valor, con enteros y nunca con decimales.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { fraccion, ERRORES_TIPICOS, hayEquivalentes, distractores } from '../practicas/_comun/fracciones.js';
import { mcd } from '../practicas/_comun/aritmetica.js';
import { leerCampoFraccion } from '../practicas/multiplica-divide/campo.js';
import {
  F, par, generarMultiplica, generarParte, generarInversa, generarDivide, generarPotencia,
  errorDeMultiplica, errorDeParte, errorDeInversa, errorDeProductoInversa, errorDeDivide, errorDePotencia,
  distractoresPotencia, tachado, cancelaciones, pasosDivide, partesDeLaParte, contextoDe, CONTEXTOS_PARTE,
  dividirEnVezDeMultiplicar, ERROR_OTRO, ERROR_SIN_SIMPLIFICAR, ERROR_DIVIDE_EN_VEZ_DE_MULTIPLICAR, ERROR_PRODUCTO_NO_ES_UNO,
} from '../practicas/multiplica-divide/logica.js';
import {
  TX, fraseParte, htmlTachado, htmlPorLaInversa, htmlEnCruz,
  feedbackMultiplica, feedbackParte, feedbackInversa, feedbackProductoInversa, feedbackDivide, feedbackPotencia,
} from '../practicas/multiplica-divide/textos.js';

const N = 3000;
const generarN = (fn, semilla = 1) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => fn(rng)); };
const ctx = idioma => ({ tt: o => o[idioma], t: {}, idioma });
const IDIOMAS = ['es', 'en'];
const conocidos = new Set([...Object.keys(ERRORES_TIPICOS), ERROR_OTRO, ERROR_SIN_SIMPLIFICAR, ERROR_DIVIDE_EN_VEZ_DE_MULTIPLICAR, ERROR_PRODUCTO_NO_ES_UNO]);
const irreducible = ([n, d]) => mcd(Math.abs(n), d) === 1;
const sinEtiquetas = html => html.replace(/<[^>]*>/g, ' ');

/** Reglas de escritura de los textos para el alumno (en los dos idiomas). */
function comprobarTexto(html, donde) {
  const t = sinEtiquetas(html);
  assert.ok(!t.includes('×'), `${donde}: «×» en «${t}»`);
  assert.ok(!/\d\s*\/\s*\d/.test(t), `${donde}: una fracción con barra en «${t}»`);
  assert.ok(!/\d[.,]\d/.test(t), `${donde}: decimales en «${t}»`);
  assert.ok(!/\d\s+\d+\s*\/\s*\d+/.test(t), `${donde}: número mixto en «${t}»`);
  assert.ok(!/(^|[\s(·:=])-\d/.test(t), `${donde}: menos con guion en «${t}»`);
  assert.ok(!/%/.test(t), `${donde}: porcentaje en «${t}»`);
  assert.ok(t.trim().length > 0, donde);
}

test('el catálogo declara 5 ejercicios para multiplica-divide', () => {
  assert.equal(CATALOGO.find(p => p.slug === 'multiplica-divide').nEjercicios, 5);
});

// ─── Ejercicio 1 ───────────────────────────────────────────────────────────────

test('ejercicio 1: términos de 1 a 12, operandos irreducibles, valor = producto irreducible, negativas en ≥ 20 %', () => {
  let negativos = 0, naturales = 0, conTachado = 0;
  for (const item of generarN(generarMultiplica)) {
    for (const x of [item.a, item.b]) {
      assert.ok(Math.abs(x[0]) >= 1 && Math.abs(x[0]) <= 12 && x[1] >= 1 && x[1] <= 12, JSON.stringify(item));
      assert.ok(irreducible(x));
      if (x[1] === 1) { naturales++; assert.ok(Math.abs(x[0]) >= 2); }
    }
    assert.ok(!(item.a[1] === 1 && item.b[1] === 1), 'un producto de dos naturales no es de fracciones');
    // Cuenta independiente, con enteros.
    const n = item.a[0] * item.b[0], d = item.a[1] * item.b[1], g = mcd(Math.abs(n), d);
    assert.deepEqual(item.valor, [n / g, d / g]);
    assert.ok(irreducible(item.valor));
    const negs = [item.a, item.b].filter(x => x[0] < 0).length;
    assert.ok(negs <= 1);
    if (negs) negativos++;
    assert.equal(item.valor[0] < 0, negs === 1, 'el signo del resultado');
    if (cancelaciones(item.a, item.b).hay) conTachado++;
    // Tachar en cruz da el producto irreducible.
    const t = tachado(item);
    const nn = t.a[0] * t.b[0], dd = t.a[1] * t.b[1];
    assert.deepEqual([nn, dd], item.valor, JSON.stringify(item));
  }
  assert.ok(negativos / N >= 0.2, `negativas ${negativos / N}`);
  assert.ok(naturales > 0.2 * N * 0.5);
  assert.ok(conTachado / N >= 0.4, `con algo que tachar ${conTachado / N}`);
});

test('ejercicio 1: los errores típicos dan valores distintos del bueno y se reconocen; falta de simplificar es fallo', () => {
  const vistos = new Set();
  for (const item of generarN(generarMultiplica, 2)) {
    const a = F(item.a), b = F(item.b), buena = F(item.valor);
    assert.equal(errorDeMultiplica(item, buena), null);
    // Sin simplificar: el producto tal cual, si no es ya irreducible.
    const bruto = a.multiplicar(b);
    if (!bruto.esIrreducible()) assert.equal(errorDeMultiplica(item, bruto), ERROR_SIN_SIMPLIFICAR);
    const candidatos = [['multiplica-en-cruz', a, b], ['multiplica-sumando-denominadores', a, b], ['suma-en-vez-de-multiplicar', a, b], ['signo-perdido', buena]];
    if (item.a[1] === 1) candidatos.push(['natural-por-ambos', item.a[0], b]);
    if (item.b[1] === 1) candidatos.push(['natural-por-ambos', item.b[0], a]);
    const ds = distractores(candidatos, buena);
    assert.ok(!hayEquivalentes([buena, ...ds.map(d => d.valor)]));
    for (const d of ds) {
      assert.ok(!d.valor.equals(buena), `${d.error} da lo mismo que la respuesta buena`);
      assert.ok(conocidos.has(errorDeMultiplica(item, d.valor)));
      assert.equal(errorDeMultiplica(item, d.valor), d.error);
      vistos.add(d.error);
    }
  }
  for (const id of ['multiplica-en-cruz', 'multiplica-sumando-denominadores', 'suma-en-vez-de-multiplicar', 'natural-por-ambos', 'signo-perdido']) assert.ok(vistos.has(id), `nunca sale ${id}`);
});

test('ejercicio 1: ejemplo fijo con los números del enunciado', () => {
  const item = { tipo: 'multiplica', a: [3, 4], b: [2, 9], valor: [1, 6] };
  assert.equal(errorDeMultiplica(item, fraccion(6, 36)), ERROR_SIN_SIMPLIFICAR);
  assert.equal(errorDeMultiplica(item, fraccion(27, 8)), 'multiplica-en-cruz');
  assert.equal(errorDeMultiplica(item, fraccion(6, 13)), 'multiplica-sumando-denominadores');
  assert.deepEqual(tachado(item), { g1: 3, g2: 2, a: [1, 2], b: [1, 3] });
});

// ─── Ejercicio 2 ───────────────────────────────────────────────────────────────

test('ejercicio 2: cuadrícula b × d dentro de la cota del contexto; valor = (a·c)/(b·d); partes coherentes con el dibujo', () => {
  const usados = new Set();
  for (const item of generarN(generarParte)) {
    const ctxP = contextoDe(item.contexto);
    usados.add(item.contexto);
    const total = item.filas * item.columnas;
    assert.ok(total >= 4 && total <= ctxP.max, `${item.contexto}: ${total} trozos`);
    assert.ok(item.filas >= 2 && item.filas <= 4 && item.columnas >= 2 && item.columnas <= 6);
    assert.equal(item.a[1], item.filas);
    assert.equal(item.c[1], item.columnas);
    assert.ok(item.a[0] >= 1 && item.a[0] < item.a[1] && item.c[0] >= 1 && item.c[0] < item.c[1]);
    assert.ok(irreducible(item.a) && irreducible(item.c), 'las dos fracciones, irreducibles');
    const n = item.a[0] * item.c[0], g = mcd(n, total);
    assert.deepEqual(item.valor, [n / g, total / g]);
    const { x, y } = partesDeLaParte(item);
    assert.equal(x.length, item.c[0] * item.filas, 'X son c columnas completas');
    assert.equal(y.length, n, 'a/b de X son a·c trozos');
    assert.ok(y.every(i => x.includes(i)));
    assert.ok(F([y.length, total]).equals(F(item.valor)), 'el dibujo da la misma fracción');
    assert.ok(Math.max(...x) < total);
  }
  assert.equal(usados.size, CONTEXTOS_PARTE.length);
  // Cotas de realismo: nada que no sea un reparto en trozos creíbles.
  for (const c of CONTEXTOS_PARTE) assert.ok(c.max >= 12 && c.max <= 24, c.id);
});

test('ejercicio 2: dividir en vez de multiplicar es un error reconocido y distinto del bueno', () => {
  const vistos = new Set();
  for (const item of generarN(generarParte, 3)) {
    const buena = F(item.valor);
    assert.equal(errorDeParte(item, buena), null);
    const bruto = F(item.a).multiplicar(F(item.c));
    if (!bruto.esIrreducible()) assert.equal(errorDeParte(item, bruto), ERROR_SIN_SIMPLIFICAR);
    const dividido = dividirEnVezDeMultiplicar(item.a, item.c);
    if (!dividido.equals(buena)) {
      assert.equal(errorDeParte(item, dividido), ERROR_DIVIDE_EN_VEZ_DE_MULTIPLICAR);
      vistos.add(ERROR_DIVIDE_EN_VEZ_DE_MULTIPLICAR);
    }
    for (const [id, ...args] of [['suma-en-vez-de-multiplicar', F(item.a), F(item.c)], ['multiplica-en-cruz', F(item.a), F(item.c)]]) {
      const v = ERRORES_TIPICOS[id].fn(...args);
      if (v && !v.equals(buena) && !v.equals(dividido)) assert.equal(errorDeParte(item, v), id);
    }
  }
  assert.ok(vistos.size === 1);
});

test('ejercicio 2: la frase sale en los dos idiomas con las dos fracciones y sin la barra', () => {
  for (const item of generarN(generarParte, 4).slice(0, 300)) {
    for (const idioma of IDIOMAS) {
      const frase = fraseParte(item, ctx(idioma));
      comprobarTexto(frase, `parte ${idioma}`);
      assert.ok(frase.includes('class="frac"'), 'la fracción lleva raya');
    }
  }
});

test('ejercicio 2: el enunciado pide la irreducible y 2/12 en un valor 1/6 dice «falta simplificar»', () => {
  const pide = { es: /irreducible/, en: /simplest form/ };
  for (const item of generarN(generarParte, 5).slice(0, 300)) {
    for (const idioma of IDIOMAS) assert.match(fraseParte(item, ctx(idioma)), pide[idioma]);
    const bruto = F(item.a).multiplicar(F(item.c));
    if (!bruto.esIrreducible()) {
      assert.equal(errorDeParte(item, bruto), ERROR_SIN_SIMPLIFICAR);
      for (const idioma of IDIOMAS) assert.match(feedbackParte(item, ctx(idioma), ERROR_SIN_SIMPLIFICAR), /simplif/);
    }
  }
  const item = { tipo: 'parte', contexto: 'bandeja', a: [2, 3], c: [1, 4], filas: 3, columnas: 4, valor: [1, 6] };
  assert.equal(errorDeParte(item, fraccion(2, 12)), ERROR_SIN_SIMPLIFICAR);
});

test('ejercicio 2: concordancia con 1 trozo y parcelas en el huerto', () => {
  const base = { tipo: 'parte', a: [1, 3], c: [1, 5], filas: 3, columnas: 5, valor: [1, 15] };
  assert.match(feedbackParte({ ...base, contexto: 'tableta' }, ctx('es'), undefined), /1 trozo de 15/);
  assert.match(feedbackParte({ ...base, contexto: 'tableta' }, ctx('en'), undefined), /1 piece out of 15/);
  assert.match(feedbackParte({ ...base, contexto: 'huerto' }, ctx('es'), undefined), /1 parcela de 15/);
  assert.match(feedbackParte({ ...base, contexto: 'huerto', a: [2, 3] }, ctx('en'), undefined), /2 plots out of 15/);
});

// ─── Ejercicio 3 ───────────────────────────────────────────────────────────────

test('ejercicio 3: la inversa y el producto = 1; naturales y negativas', () => {
  let naturales = 0, negativos = 0;
  for (const item of generarN(generarInversa)) {
    const f = F(item.f), inv = F(item.valor);
    assert.ok(f.multiplicar(inv).equals(1));
    assert.ok(f.multiplicar(inv).simplificar().mismaForma(fraccion(1, 1)));
    assert.ok(irreducible(item.f) && f.num !== 0);
    assert.ok(Math.abs(item.f[0]) >= 1 && Math.abs(item.f[0]) <= 12 && item.f[1] >= 1 && item.f[1] <= 12);
    assert.ok(!(Math.abs(item.f[0]) === 1 && item.f[1] === 1), 'la inversa de 1 es 1: no sirve');
    assert.equal(inv.num < 0, f.num < 0, 'la inversa lleva el mismo signo');
    if (item.f[1] === 1) naturales++;
    if (item.f[0] < 0) negativos++;
    // Errores
    assert.equal(errorDeInversa(item, inv), ERROR_OTRO);
    const opuesta = f.opuesta();
    if (!opuesta.equals(inv)) assert.equal(errorDeInversa(item, opuesta), 'inversa-como-opuesta');
    if (item.f[1] === 1) assert.ok(['inversa-del-natural', 'inversa-como-opuesta'].includes(errorDeInversa(item, f)));
    assert.equal(errorDeProductoInversa(item, fraccion(0)), ERROR_PRODUCTO_NO_ES_UNO);
  }
  assert.ok(naturales / N > 0.15 && naturales / N < 0.4);
  assert.ok(negativos / N >= 0.2, `negativas ${negativos / N}`);
});

test('ejercicio 3: la inversa de 3 es 1/3 y no 3/1; la de −3/4 es −4/3 y no 3/4', () => {
  assert.equal(errorDeInversa({ f: [3, 1], valor: [1, 3] }, fraccion(3, 1)), 'inversa-del-natural');
  assert.equal(errorDeInversa({ f: [-3, 4], valor: [-4, 3] }, fraccion(3, 4)), 'inversa-como-opuesta');
  assert.equal(errorDeInversa({ f: [-3, 4], valor: [-4, 3] }, fraccion(4, 3)), 'signo-perdido');
});

// ─── Ejercicio 4 ───────────────────────────────────────────────────────────────

test('ejercicio 4: valor irreducible; los dos métodos dan el mismo resultado; negativas en ≥ 20 %', () => {
  let negativos = 0;
  for (const item of generarN(generarDivide)) {
    for (const x of [item.a, item.b]) {
      assert.ok(Math.abs(x[0]) >= 1 && Math.abs(x[0]) <= 12 && x[1] >= 1 && x[1] <= 12);
      assert.ok(irreducible(x));
    }
    assert.ok(!(item.a[1] === 1 && item.b[1] === 1));
    const negs = [item.a, item.b].filter(x => x[0] < 0).length;
    assert.ok(negs <= 1);
    if (negs) negativos++;
    const a = F(item.a), b = F(item.b), buena = F(item.valor);
    assert.ok(buena.esIrreducible());
    assert.equal(buena.num < 0, negs === 1);
    // Método 1: por la inversa. Método 2: en cruz. El mismo valor.
    const p = pasosDivide(item);
    assert.ok(a.multiplicar(F(p.inversa)).equals(buena));
    assert.ok(F(p.inversa).equals(b.inversa()));
    assert.ok(F(p.producto).equals(buena));
    const cruz = fraccion((p.cruz.negativo ? -1 : 1) * p.cruz.arriba[0] * p.cruz.arriba[1], p.cruz.abajo[0] * p.cruz.abajo[1]);
    assert.ok(cruz.equals(buena), `${JSON.stringify(item)} en cruz`);
    assert.ok(cruz.mismaForma(F(p.producto)));
  }
  assert.ok(negativos / N >= 0.2, `negativas ${negativos / N}`);
});

test('ejercicio 4: los errores se reconocen; «no invertir» nunca se da por error cuando da lo mismo (división exacta)', () => {
  const vistos = new Set();
  for (const item of generarN(generarDivide, 5)) {
    const a = F(item.a), b = F(item.b), buena = F(item.valor);
    assert.equal(errorDeDivide(item, buena), null);
    const bruto = F(pasosDivide(item).producto);
    if (!bruto.esIrreducible()) assert.equal(errorDeDivide(item, bruto), ERROR_SIN_SIMPLIFICAR);
    const ds = distractores([['invierte-la-primera', a, b], ['no-invierte', a, b], ['invierte-las-dos', a, b], ['signo-perdido', buena]], buena);
    assert.ok(!hayEquivalentes([buena, ...ds.map(d => d.valor)]));
    for (const d of ds) {
      assert.ok(!d.valor.equals(buena));
      assert.equal(errorDeDivide(item, d.valor), d.error);
      vistos.add(d.error);
    }
    // Si dividir término a término es exacto, ese resultado es el bueno y no es un error.
    assert.equal(ERRORES_TIPICOS['no-invierte'].fn(a, b)?.equals(buena) ?? false, false);
  }
  for (const id of ['invierte-la-primera', 'no-invierte', 'invierte-las-dos', 'signo-perdido']) assert.ok(vistos.has(id), `nunca sale ${id}`);
  // 6/8 : 2/4 = 3/2 de las dos formas: ni «no invertir» ni «invertir la primera» valen como error del 3/2.
  const item = { tipo: 'divide', a: [3, 4], b: [1, 2], valor: [3, 2] };
  assert.equal(errorDeDivide(item, fraccion(3, 8)), 'no-invierte');
});

test('ejercicio 4: las ayudas enseñan los dos métodos con los números del ítem', () => {
  const item = { tipo: 'divide', a: [2, 3], b: [4, 5], valor: [5, 6] };
  const inv = htmlPorLaInversa(item), cruz = htmlEnCruz(item);
  assert.ok(sinEtiquetas(inv).replace(/\s+/g, ' ').includes('2 3 : 4 5') || inv.includes('>2<'));
  assert.ok(cruz.includes('2 · 5') && cruz.includes('3 · 4'));
  const neg = { tipo: 'divide', a: [-2, 3], b: [4, 5], valor: [-5, 6] };
  assert.ok(htmlEnCruz(neg).includes('−'));
  comprobarTexto(inv, 'inversa');
  comprobarTexto(cruz, 'cruz');
});

// ─── Ejercicio 5 ───────────────────────────────────────────────────────────────

test('ejercicio 5: base positiva e irreducible, exponente 2 o 3, valor = potencia; los distractores, distintos del bueno por valor', () => {
  const exps = new Set();
  for (const item of generarN(generarPotencia)) {
    exps.add(item.exp);
    assert.ok(item.exp === 2 || item.exp === 3);
    const [n, d] = item.base;
    assert.ok(n >= 2 && d >= 2 && irreducible(item.base));
    assert.ok(n <= (item.exp === 2 ? 9 : 5) && d <= (item.exp === 2 ? 9 : 5));
    assert.deepEqual(item.valor, [n ** item.exp, d ** item.exp]);
    assert.ok(irreducible(item.valor));
    const buena = F(item.valor);
    const ds = distractoresPotencia(item);
    assert.equal(ds.length, 2, 'con numerador ≥ 2 los dos errores dan valores distintos');
    assert.ok(!hayEquivalentes([buena, ...ds.map(x => x.valor)]));
    for (const x of ds) {
      assert.ok(!x.valor.equals(buena));
      assert.equal(errorDePotencia(item, x.valor), x.error);
    }
    assert.equal(errorDePotencia(item, buena), null);
  }
  assert.deepEqual([...exps].sort(), [2, 3]);
  assert.equal(errorDePotencia({ base: [2, 3], exp: 2, valor: [4, 9] }, fraccion(4, 3)), 'eleva-solo-el-numerador');
  assert.equal(errorDePotencia({ base: [2, 3], exp: 2, valor: [4, 9] }, fraccion(4, 6)), 'base-por-exponente');
});

// ─── El campo y los textos ─────────────────────────────────────────────────────

test('el campo lee numerador y denominador (vacío = natural) y rechaza lo que no es una fracción', () => {
  const v = (a, b) => leerCampoFraccion(a, b);
  assert.ok(v('3', '5').mismaForma(fraccion(3, 5)));
  assert.ok(v('−3', '5').mismaForma(fraccion(-3, 5)));
  assert.ok(v('-3', '5').mismaForma(fraccion(-3, 5)));
  assert.ok(v('6', '36').mismaForma(fraccion(6, 36)), 'no simplifica lo que escribe');
  assert.ok(v('5', '').mismaForma(fraccion(5, 1)));
  assert.ok(v(' 5 ', ' ').mismaForma(fraccion(5, 1)));
  for (const [a, b] of [['', ''], ['', '5'], ['3', '0'], ['3,5', '2'], ['3', '2,5'], ['a', '2'], ['3 4', '5']]) assert.equal(v(a, b), null, `${a}/${b}`);
});

test('todos los feedback salen en los dos idiomas con los números del ítem y respetan las reglas de escritura', () => {
  const todos = [
    ['multiplica', generarMultiplica, feedbackMultiplica, ['multiplica-en-cruz', 'multiplica-sumando-denominadores', 'suma-en-vez-de-multiplicar', 'natural-por-ambos', 'producto-denominador-comun', 'signo-perdido', ERROR_SIN_SIMPLIFICAR, ERROR_OTRO]],
    ['parte', generarParte, feedbackParte, [ERROR_DIVIDE_EN_VEZ_DE_MULTIPLICAR, 'suma-en-vez-de-multiplicar', 'multiplica-en-cruz', 'multiplica-sumando-denominadores', ERROR_SIN_SIMPLIFICAR, ERROR_OTRO]],
    ['inversa', generarInversa, feedbackInversa, ['inversa-como-opuesta', 'inversa-del-natural', 'signo-perdido', ERROR_OTRO]],
    ['producto-inversa', generarInversa, feedbackProductoInversa, ['suma-en-vez-de-multiplicar', ERROR_PRODUCTO_NO_ES_UNO]],
    ['divide', generarDivide, feedbackDivide, ['invierte-la-primera', 'no-invierte', 'invierte-las-dos', 'signo-perdido', ERROR_SIN_SIMPLIFICAR, ERROR_OTRO]],
    ['potencia', generarPotencia, feedbackPotencia, ['eleva-solo-el-numerador', 'base-por-exponente', ERROR_SIN_SIMPLIFICAR, ERROR_OTRO]],
  ];
  for (const [nombre, generar, feedback, errores] of todos) {
    const rng = crearRng(7);
    for (let i = 0; i < 400; i++) {
      const item = generar(rng);
      for (const idioma of IDIOMAS) {
        for (const error of [undefined, ...errores]) {
          const html = feedback(item, ctx(idioma), error);
          comprobarTexto(html, `${nombre} ${idioma} ${error}`);
          assert.ok(!html.includes('undefined') && !html.includes('NaN'), `${nombre}: ${html}`);
        }
      }
    }
  }
  // Y el resto de textos fijos.
  for (const grupo of [TX.nombres, TX.detalles, TX.introduccion, TX.enunciado]) {
    for (const [clave, o] of Object.entries(grupo)) {
      for (const idioma of IDIOMAS) { assert.ok(o[idioma], `${clave} ${idioma}`); comprobarTexto(o[idioma], `${clave} ${idioma}`); }
    }
  }
  for (const item of generarN(generarMultiplica, 8).filter(i => cancelaciones(i.a, i.b).hay).slice(0, 200)) comprobarTexto(htmlTachado(item), 'tachado');
});

test('el feedback de un fallo lleva los números del ítem', () => {
  const item = { tipo: 'multiplica', a: [3, 4], b: [2, 9], valor: [1, 6] };
  const html = feedbackMultiplica(item, ctx('es'), 'multiplica-en-cruz');
  assert.ok(html.includes('>36<') && html.includes('>6<'), html);
  const div = { tipo: 'divide', a: [2, 3], b: [4, 5], valor: [5, 6] };
  const h2 = feedbackDivide(div, ctx('en'), 'invierte-la-primera');
  assert.ok(h2.includes('>10<') && h2.includes('>12<') && h2.includes('>5<'), h2);
});
