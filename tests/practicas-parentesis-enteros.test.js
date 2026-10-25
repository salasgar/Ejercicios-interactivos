// Paréntesis y corchetes (practicas/parentesis-enteros/). Las comprobaciones usan un
// evaluador INDEPENDIENTE (el de este fichero, sobre el texto) y no el de enteros.js:
// así un fallo de la jerarquía o de los signos en la base no pasa desapercibido.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { ERRORES_TIPICOS, analizar, aTexto, html as htmlExpr } from '../practicas/_comun/enteros.js';
import { TX } from '../practicas/parentesis-enteros/textos.js';
import {
  TOPE, generar, generarQuita, arbolQuita, signosBuenos, reescritura, errorQuita,
  generarCalcula, descomponer, operandoDentro, quitandoParentesis, erroresCalcula,
  generarPotencia, erroresPotencia, cadenaHtml,
  generarCorchetes, internos, pendientes, valorEn, calculado, erroresDe, erroresResto,
  generarColocar, colocaciones, buenas, textoColocado, errorDe,
} from '../practicas/parentesis-enteros/logica.js';

const N = 3000;

// --- Un evaluador independiente sobre el texto -----------------------------------

/** { valor, max }: el valor y el mayor valor absoluto que aparece en cualquier operación. */
function evaluarTexto(texto) {
  const t = texto.replace(/[−–]/g, '-').replace(/[·]/g, '*').replace(/[²³⁴]/g, c => `^${{ '²': 2, '³': 3, '⁴': 4 }[c]}`)
    .match(/\d+|[-+*:^()[\]]/g);
  let p = 0, max = 0;
  const mira = v => { max = Math.max(max, Math.abs(v)); return v; };
  const div = (a, b) => { assert.ok(b !== 0 && a % b === 0, `división no exacta en «${texto}»`); return a / b; };
  function atomo() {
    let v;
    if (t[p] === '(' || t[p] === '[') { p++; v = suma(); p++; } else v = Number(t[p++]);
    if (t[p] === '^') { p++; v = mira(v ** Number(t[p++])); }
    return v;
  }
  function signo() {
    if (t[p] === '-') { p++; return -signo(); }
    if (t[p] === '+') { p++; return signo(); }
    return atomo();
  }
  function producto() {
    let v = signo();
    while (t[p] === '*' || t[p] === ':') { const o = t[p++]; const w = signo(); v = mira(o === '*' ? v * w : div(v, w)); }
    return v;
  }
  function suma() {
    let v = producto();
    while (t[p] === '+' || t[p] === '-') { const o = t[p++]; const w = producto(); v = mira(o === '+' ? v + w : v - w); }
    return v;
  }
  const valor = suma();
  assert.equal(p, t.length, `sobra algo en «${texto}»`);
  return { valor: mira(valor) + 0, max };
}

const sinMenosRaro = texto => !/(^|[\s([])-\d/.test(texto) && !texto.includes('×') && !texto.includes('(+');
const sinLetras = texto => !/[a-zA-Z]/.test(texto.replace(/<\/?sup>/g, ''));
const puro = texto => texto.replace(/<[^>]+>/g, '');

function paraTodos(n, f, semilla = 1) {
  const rng = crearRng(semilla * 7919 + n);
  for (let i = 0; i < N; i++) f(generar(n, rng), i);
}

const textosDe = x => (typeof x === 'string' ? [x] : Array.isArray(x) ? x.flatMap(textosDe) : x && typeof x === 'object' ? Object.values(x).flatMap(textosDe) : []);

// --- Catálogo --------------------------------------------------------------------

test('catálogo: 5 ejercicios, id 41, unidad 3', () => {
  const fila = CATALOGO.find(c => c.slug === 'parentesis-enteros');
  assert.equal(fila.id, 41);
  assert.equal(fila.unidad, 3);
  assert.equal(fila.nEjercicios, 5);
  assert.equal(TX.ejercicios.length, 5);
});

// --- Ejercicio 1 -----------------------------------------------------------------

test('ej. 1: la reescritura buena vale lo mismo que la original y no tiene paréntesis', () => {
  const rng = crearRng(11);
  let conMenos = 0, conMas = 0;
  for (let i = 0; i < N; i++) {
    const item = generarQuita(rng);
    const original = evaluarTexto(item.expr);
    assert.ok(original.max <= TOPE, item.expr);
    const bien = aTexto(reescritura(item, signosBuenos(item)));
    assert.ok(!/[()[\]]/.test(bien), bien);
    assert.equal(evaluarTexto(bien).valor, original.valor, `${item.expr} ≠ ${bien}`);
    assert.equal(evaluarTexto(aTexto(arbolQuita(item))).valor, original.valor);
    assert.equal(errorQuita(item, signosBuenos(item)), null);
    assert.ok(sinMenosRaro(item.expr) && sinMenosRaro(bien), `${item.expr} / ${bien}`);
    if (item.signoPar < 0) conMenos++; else conMas++;
  }
  assert.ok(conMenos > conMas, 'el menos delante tiene que ser lo más frecuente');
});

test('ej. 1: cada fallo tiene su error y un texto; solo-primero, cambia-con-mas y ignora el menos salen', () => {
  const rng = crearRng(12);
  const vistos = new Set();
  for (let i = 0; i < N; i++) {
    const item = generarQuita(rng);
    const buenos = signosBuenos(item);
    for (let m = 0; m < 2 ** buenos.length; m++) {
      const signos = buenos.map((s, k) => (m >> k & 1 ? -s : s));
      const error = errorQuita(item, signos);
      assert.equal(error === null, m === 0);
      if (error) { assert.ok(TX.quita.error[error], error); vistos.add(error); }
    }
  }
  for (const e of ['cambia-con-mas', 'ignora-el-menos-de-delante', 'menos-solo-al-primero', 'signos-a-medias']) assert.ok(vistos.has(e), e);
});

test('ej. 1: lo que el alumno ve sale con − (U+2212), sin letras ni +( ', () => {
  paraTodos(1, item => {
    for (const s of [puro(htmlExpr(item.expr)), puro(htmlExpr(reescritura(item, signosBuenos(item))))]) assert.ok(sinMenosRaro(s) && sinLetras(s), s);
  });
});

// --- Ejercicio 2 -----------------------------------------------------------------

test('ej. 2: las dos rutas dan el valor de la original; los errores, otro valor y sin repetir', () => {
  let conMenos = 0;
  paraTodos(2, item => {
    const original = evaluarTexto(item.expr);
    assert.ok(original.max <= TOPE, item.expr);
    const dentro = aTexto(operandoDentro(item)), quito = aTexto(quitandoParentesis(item));
    assert.equal(evaluarTexto(dentro).valor, original.valor, `${item.expr} → ${dentro}`);
    assert.equal(evaluarTexto(quito).valor, original.valor, `${item.expr} → ${quito}`);
    assert.ok(!/[()[\]]/.test(quito), quito);
    assert.ok(/\(/.test(item.expr));
    const errores = erroresCalcula(item);
    assert.equal(new Set(errores.map(e => e.valor)).size, errores.length);
    for (const e of errores) {
      assert.notEqual(e.valor, original.valor, `${e.id} en ${item.expr}`);
      assert.ok(TX.calcula.error[e.id], e.id);
    }
    if (descomponer(item).some(t => t.par && t.signo < 0)) conMenos++;
    for (const s of [item.expr, dentro, quito]) assert.ok(sinMenosRaro(s) && sinLetras(s), s);
  });
  assert.ok(conMenos > N * 0.7, `solo ${conMenos} con un paréntesis precedido de −`);
});

test('ej. 2: ningún paréntesis envuelve un solo número ni hay corchetes', () => {
  paraTodos(2, item => {
    assert.ok(!/[[\]]/.test(item.expr));
    for (const t of descomponer(item)) if (t.par) assert.ok(t.dentro.length >= 2);
  });
});

// --- Ejercicio 3 -----------------------------------------------------------------

test('ej. 3: valores dentro de ±200, parejas con valores distintos y errores bien formados', () => {
  const tipos = new Set();
  paraTodos(3, item => {
    tipos.add(item.tipo);
    assert.ok(item.exprs.length === (item.tipo === 'sola' ? 1 : 2));
    item.exprs.forEach((e, i) => {
      const { valor, max } = evaluarTexto(e);
      assert.ok(max <= TOPE, e);
      assert.equal(valor, item.valores[i], e);
      assert.ok(sinMenosRaro(e) && sinLetras(puro(htmlExpr(e))), e);
      const errores = erroresPotencia(item, i);
      for (const x of errores) {
        assert.notEqual(x.valor, valor, `${x.id} en ${e}`);
        assert.ok(TX.potencia.error[x.id], x.id);
      }
      assert.equal(new Set(errores.map(x => x.valor)).size, errores.length);
      const cadena = puro(cadenaHtml(e)).split(' = ');
      assert.equal(evaluarTexto(cadena.at(-1)).valor, valor);
    });
    if (item.exprs.length === 2) assert.notEqual(item.valores[0], item.valores[1]);
  });
  assert.deepEqual([...tipos].sort(), ['par-pot', 'prod-neg', 'sola']);
});

test('ej. 3: en la pareja con potencia, las dos cuentas solo se distinguen por dónde está el exponente', () => {
  paraTodos(3, item => {
    if (item.tipo !== 'par-pot') return;
    const { b } = item.meta;
    assert.ok(b >= 2, 'con b = 1, b^n = b y las dos cuentas valdrían lo mismo');
  });
});

// --- Ejercicio 4 -----------------------------------------------------------------

test('ej. 4: de dentro afuera hasta el número final, sin salirse de ±200', () => {
  let maximo = 0;
  paraTodos(4, item => {
    const original = evaluarTexto(item.expr);
    assert.ok(original.max <= TOPE, item.expr);
    assert.ok(/\[/.test(item.expr) && /\(/.test(item.expr), 'tiene que haber corchetes y un paréntesis dentro');
    let arbol = analizar(item.expr);
    let pasos = 0;
    while (pendientes(arbol).length) {
      const dentro = internos(arbol);
      assert.ok(dentro.length >= 1);
      for (const r of dentro) {
        const v = valorEn(arbol, r);
        for (const e of erroresDe(arbol, r)) assert.notEqual(e.valor, v);
        assert.ok(Math.abs(v) <= TOPE);
      }
      arbol = calculado(arbol, dentro[0], valorEn(arbol, dentro[0]));
      assert.equal(evaluarTexto(aTexto(arbol)).valor, original.valor);
      pasos++;
    }
    assert.ok(pasos >= 2);
    maximo = Math.max(maximo, pasos);
    for (const e of erroresResto(arbol)) assert.notEqual(e.valor, original.valor);
    assert.ok(sinMenosRaro(item.expr), item.expr);
  });
  assert.ok(maximo >= 4, 'tiene que haber ítems de cuatro paréntesis');
});

// --- Ejercicio 5 -----------------------------------------------------------------

test('ej. 5: hay una colocación que da el resultado y el resultado no sale sin paréntesis', () => {
  let conNegativo = 0;
  paraTodos(5, item => {
    const sin = evaluarTexto(item.expr).valor;
    assert.notEqual(item.objetivo, sin);
    assert.ok(Math.abs(item.objetivo) <= TOPE);
    const todas = colocaciones(item);
    assert.ok(todas.length >= 2);
    const independientes = todas.map(c => evaluarTexto(c.texto));
    todas.forEach((c, i) => {
      assert.equal(c.valor, independientes[i].valor, c.texto);
      assert.ok(independientes[i].max <= TOPE, c.texto);
    });
    assert.ok(buenas(item).length >= 1);
    for (const b of buenas(item)) assert.equal(evaluarTexto(b.texto).valor, item.objetivo);
    assert.equal(textoColocado(item, -1, -1), item.expr);
    assert.ok(item.ops.includes('·') && item.ops.some(o => o !== '·'));
    // solo el primer número puede ser negativo (los demás irían con signo delante de otro)
    assert.ok(item.numeros.slice(1).every(v => v > 0));
    if (item.numeros[0] < 0) conNegativo++;
    assert.ok(sinMenosRaro(item.expr), item.expr);
  });
  assert.ok(conNegativo > 0);
});

// --- Textos y errores ------------------------------------------------------------

test('textos: sin × ni guion como signo, sin +( ; cada ejercicio, en los dos idiomas', () => {
  const todos = textosDe(TX).filter(s => typeof s === 'string');
  assert.ok(todos.length > 50);
  for (const s of todos) {
    assert.ok(!s.includes('×'), s);
    assert.ok(!/(^|[\s>(])-\d/.test(puro(s)), `guion como signo en «${s}»`);
    assert.ok(!s.includes('(+'), s);
  }
  for (const e of TX.ejercicios) {
    for (const k of ['nombre', 'detalle', 'introduccion']) { assert.ok(e[k].es && e[k].en, k); }
  }
  // cada texto {es, en} está en los dos idiomas
  (function rec(x, ruta) {
    if (x && typeof x === 'object' && !Array.isArray(x)) {
      if ('es' in x || 'en' in x) { assert.ok('es' in x && 'en' in x, `falta un idioma en ${ruta}`); return; }
      for (const [k, v] of Object.entries(x)) rec(v, `${ruta}.${k}`);
    } else if (Array.isArray(x)) x.forEach((v, i) => rec(v, `${ruta}[${i}]`));
  }(TX, 'TX'));
});

test('textos con números: las funciones dan texto en español e inglés', () => {
  const meta = { c: 3, a: 4, b: 2, n: 2, o: '+', s: '−' };
  for (const idioma of ['es', 'en']) {
    for (const f of [TX.potencia.nota_par_pot, TX.potencia.nota_prod_neg]) {
      const s = f[idioma](meta);
      assert.ok(typeof s === 'string' && !s.includes('undefined') && !s.includes('×'), s);
    }
    assert.ok(!TX.calcula.tuyo[idioma]('−3').includes('undefined'));
  }
});

test('ejemplos de las introducciones: las cuentas son ciertas', () => {
  const igualdades = [
    '7 + (4 − 9) = 7 + 4 − 9', '7 − (4 − 9) = 7 − 4 + 9',
    '20 − (6 − 11 + 4) + (−3 + 5) = 23', '20 − 6 + 11 − 4 − 3 + 5 = 23',
    '2 − (4 + 2)^2 = −34', '2 − (4 + 2^2) = −6',
    '[12 − (9 − 4)] − 3 = 4',
    '3 + 4 · 5 = 23', '(3 + 4) · 5 = 35',
  ];
  for (const ig of igualdades) {
    const [izq, der] = ig.split(' = ');
    assert.equal(evaluarTexto(izq).valor, evaluarTexto(der).valor, ig);
  }
});

test('los errores con nombre: o están en ERRORES_TIPICOS o tienen texto propio', () => {
  for (const id of ['derecha-a-izquierda', 'olvida-el-signo', 'suma-valores-absolutos', 'signo-cambiado', 'ignora-el-parentesis', 'sin-jerarquia', 'menos-solo-al-primero', 'restar-negativo']) {
    assert.ok(ERRORES_TIPICOS[id], id);
  }
  for (const id of ['derecha-a-izquierda', 'olvida-el-signo', 'suma-valores-absolutos', 'signo-cambiado']) assert.ok(TX.corchetes.error[id], id);
  assert.equal(errorDe([{ id: 'x', valor: 3 }], 3), 'x');
  assert.equal(errorDe([{ id: 'x', valor: 3 }], 4), 'otro');
});
