// Práctica «Valor numérico» de la unidad 6 (PU2, tarea 146): 3000 ítems por ejercicio con semillas fijas,
// contra comprobaciones escritas AQUÍ, aparte del generador: un evaluador propio (BigInt, racionales) lee
// la expresión tal como se muestra. En cada ítem la opción buena vale lo que dice, cada falsa vale otra
// cosa y nace de un error con nombre, nunca se repiten valores en la tabla, ningún caso reservado sale, y
// ningún texto de alumno lleva ×, %, 1x, «+ −», x² ni coma en inglés / punto en español.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { ERRORES_TIPICOS } from '../practicas/_comun/algebra.js';
import { TX, cuenta, solucionTabla, xIgual } from '../practicas/valor-numerico/textos.js';
import {
  F, numTexto, textoDe, htmlDe, valorDe, claveExpr, candidatos, ERRORES_PROPIOS, nombreError,
  HUELLAS_RESERVADAS, huellaCaso, esReservado, generarSustituye, generarTabla, generarQueValor,
  errorDeSustituye, erroresDeTabla, claveDe,
} from '../practicas/valor-numerico/logica.js';

const N = 3000;
const lote = (generar, semilla) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => generar(rng)); };
const sinHtml = t => t.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');

// ─── Un evaluador propio: racionales con BigInt, leyendo el texto tal como se ve ──────────────

const mcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a || 1n; };
const R = (n, d = 1n) => { if (d < 0n) { n = -n; d = -d; } const g = mcd(n, d); return [n / g, d / g]; };
const suma = (a, b) => R(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const resta = (a, b) => R(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const por = (a, b) => R(a[0] * b[0], a[1] * b[1]);
const igualR = (a, b) => a[0] === b[0] && a[1] === b[1];
const deItem = p => R(BigInt(p.num), BigInt(p.den));

function evaluar(texto, x) {
  const toks = texto.replace(/−/g, '-').replace(/·/g, '*').match(/\d+(?:[.,]\d+)?|x|[()+\-*]/g);
  let i = 0;
  const expr = () => {
    let v = term();
    while (toks[i] === '+' || toks[i] === '-') { const op = toks[i++]; const t = term(); v = op === '+' ? suma(v, t) : resta(v, t); }
    return v;
  };
  const term = () => {
    let v = factor();
    while (i < toks.length && !['+', '-', ')'].includes(toks[i])) { if (toks[i] === '*') i++; v = por(v, factor()); }
    return v;
  };
  const factor = () => {
    const t = toks[i++];
    if (t === '-') { const f = factor(); return R(-f[0], f[1]); }
    if (t === '(') { const v = expr(); assert.equal(toks[i++], ')'); return v; }
    if (t === 'x') return x;
    assert.match(t, /^\d+([.,]\d+)?$/);
    const [e, f = ''] = t.replace(',', '.').split('.');
    return R(BigInt(e + f), 10n ** BigInt(f.length));
  };
  const v = expr();
  assert.equal(i, toks.length, `sobran símbolos en «${texto}»`);
  return v;
}

/** Los valores sucesivos de una cadena «a = b = c»: todos tienen que coincidir. */
const valoresDeCadena = (cad, x) => sinHtml(cad).split('=').map(p => p.trim()).map(p => evaluar(p, x));

const NOMBRADOS = new Set([...Object.keys(ERRORES_TIPICOS), ...Object.keys(ERRORES_PROPIOS)].filter(k => k !== 'otra-respuesta'));

function textosProhibidos(t, idioma, donde) {
  const s = sinHtml(t);
  assert.ok(!/×/.test(s), `× en ${donde}: ${s}`);
  assert.ok(!/%/.test(s), `% en ${donde}: ${s}`);
  assert.ok(!/(^|[^\d.,])1x/.test(s), `1x en ${donde}: ${s}`);
  assert.ok(!/[+−-] ?[−-]\d/.test(s.replace(/\(−/g, '(')), `signo doble en ${donde}: ${s}`);
  assert.ok(!/(^|[\s(=:])-\d/.test(s), `guion en vez de signo menos en ${donde}: ${s}`);
  assert.ok(!/x²|x\^2|\^/.test(s), `x² en ${donde}: ${s}`);
  if (idioma === 'en') assert.ok(!/\d,\d/.test(s), `coma decimal en inglés en ${donde}: ${s}`);
  else assert.ok(!/\d\.\d/.test(s), `punto decimal en español en ${donde}: ${s}`);
  assert.ok(!/undefined|NaN|\[object/.test(s), `basura en ${donde}: ${s}`);
}

const vTexto = (item, idioma) => ({ num: item.v.num, den: item.v.den, idioma });

// ─── Ejercicio 1 ──────────────────────────────────────────────────────────────────────────────

test('ej. 1: el resultado es el valor exacto de la expresión que se ve', () => {
  for (const item of lote(generarSustituye, 11)) {
    assert.ok(igualR(evaluar(textoDe(item.e), deItem(item.v)), deItem(item.resultado)), `${textoDe(item.e)} con x = ${numTexto(item.v)}`);
    assert.ok(Math.abs(item.resultado.num / item.resultado.den) <= 60, 'resultado poco creíble');
  }
});

test('ej. 1: la cuenta del feedback se calcula bien, paso a paso, en los dos idiomas', () => {
  for (const item of lote(generarSustituye, 12).slice(0, 1000)) {
    for (const idioma of ['es', 'en']) {
      const x = deItem(item.v);
      const vals = valoresDeCadena(cuenta(item.e, item.v, idioma), x);
      assert.ok(vals.length === 3 && vals.every(v => igualR(v, vals[0])), `cuenta ${cuenta(item.e, item.v, idioma)}`);
      assert.ok(igualR(vals[0], deItem(item.resultado)));
    }
  }
});

test('ej. 1: con elegir, exactamente una buena y tres falsas de errores con nombre, todas con valor distinto', () => {
  const items = lote(generarSustituye, 13).filter(i => i.tipo === 'elegir');
  assert.ok(items.length > 1000);
  for (const item of items) {
    assert.equal(item.opciones.length, 4);
    assert.equal(item.opciones.filter(o => o.correcta).length, 1);
    const valores = item.opciones.map(o => deItem(o.r));
    for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) assert.ok(!igualR(valores[a], valores[b]), 'dos opciones con el mismo valor');
    const buena = item.opciones.find(o => o.correcta);
    assert.ok(igualR(deItem(buena.r), deItem(item.resultado)));
    for (const o of item.opciones.filter(x => !x.correcta)) {
      assert.ok(NOMBRADOS.has(o.error), `error sin nombre: ${o.error}`);
      assert.equal(errorDeSustituye(item, F(o.r)), o.error);
      assert.ok(nombreError(o.error).es && nombreError(o.error).en);
    }
  }
});

test('ej. 1: los errores salen con las cuentas que dice la ficha (yuxtaponer, jerarquía, signo)', () => {
  for (const item of lote(generarSustituye, 14)) {
    if (item.e.forma !== 'lineal') continue;
    const { a, b } = item.e, v = item.v.num;
    const c = candidatos(item.e, item.v);
    const de = id => c.find(k => k.error === id)?.valor;
    if (item.v.den === 1 && v > 0 && a > 1 && de('yuxtaponer-al-sustituir')) {
      assert.ok(igualR(deItem({ num: de('yuxtaponer-al-sustituir').num, den: de('yuxtaponer-al-sustituir').den }), R(BigInt(`${a}${v}`) + BigInt(b))));
    }
    if (v < 0 && de('signo-al-sustituir')) {
      assert.ok(igualR(deItem(de('signo-al-sustituir')), R(BigInt(a * -v + b))), 'signo');
    }
    if (de('jerarquia-al-sustituir') && item.v.den === 1) {
      const esperado = a < 0 ? (b + a) * v : (item.e.delante ? (b + a) * v : a * (v + b));
      assert.ok(igualR(deItem(de('jerarquia-al-sustituir')), R(BigInt(esperado))), 'jerarquía');
    }
  }
});

test('ej. 1: salen todas las formas, los tres tipos de valor y todos los errores', () => {
  const items = lote(generarSustituye, 15);
  const formas = new Set(items.map(i => (i.e.forma === 'parentesis' ? 'P' : i.e.a < 0 ? 'C' : i.e.b < 0 ? 'B' : i.e.delante ? 'A-delante' : 'A')));
  assert.deepEqual([...formas].sort(), ['A', 'A-delante', 'B', 'C', 'P']);
  assert.ok(items.some(i => i.v.den === 1 && i.v.num > 0));
  assert.ok(items.some(i => i.v.num < 0));
  assert.ok(items.some(i => i.v.den === 2));
  const errores = new Set(items.flatMap(i => (i.opciones ?? []).filter(o => !o.correcta).map(o => o.error)));
  for (const id of ['yuxtaponer-al-sustituir', 'signo-al-sustituir', 'jerarquia-al-sustituir', 'suma-en-vez-de-multiplicar', 'resta-al-reves', 'multiplica-solo-el-primero', 'olvida-el-factor']) {
    assert.ok(errores.has(id), `no sale el error ${id}`);
  }
  assert.ok(new Set(items.map(claveDe)).size > 300, 'poca variedad');
});

test('ej. 1: ningún texto lleva ×, %, 1x, signos dobles, x² ni el separador decimal del otro idioma', () => {
  for (const item of lote(generarSustituye, 16).slice(0, 1500)) {
    for (const idioma of ['es', 'en']) {
      const tt = o => o[idioma];
      textosProhibidos(htmlDe(item.e) + ' ' + xIgual(item.v, idioma), idioma, 'enunciado');
      textosProhibidos(tt(TX.ej1.correcto)(item), idioma, 'correcto');
      for (const o of item.opciones ?? []) {
        textosProhibidos(numTexto(o.r, idioma), idioma, 'opción');
        if (!o.correcta) textosProhibidos(tt(TX.ej1.por_que[o.error])(item, F(o.r)) + tt(TX.ej1.solucion)(item), idioma, `por_que ${o.error}`);
      }
      textosProhibidos(tt(TX.ej1.por_que['otra-respuesta'])(item, F({ num: 7, den: 1 })), idioma, 'otra');
    }
  }
  for (const k of ['ej1', 'ej2', 'ej3']) for (const idioma of ['es', 'en']) textosProhibidos(TX[k].introduccion[idioma], idioma, `introducción ${k}`);
});

// ─── Ejercicio 2 ──────────────────────────────────────────────────────────────────────────────

test('ej. 2: la tabla tiene x distintas, valores exactos, sin repetidos, y dos huecos distintos', () => {
  for (const item of lote(generarTabla, 21)) {
    assert.equal(item.xs.length, 4);
    assert.equal(new Set(item.xs).size, 4);
    assert.equal(item.huecos.length, 2);
    assert.notEqual(item.huecos[0], item.huecos[1]);
    const vs = item.xs.map((x, j) => {
      const esperado = evaluar(textoDe(item.e), R(BigInt(x)));
      assert.ok(igualR(esperado, deItem(item.valores[j])), `${textoDe(item.e)} con x = ${x}`);
      return `${esperado[0]}/${esperado[1]}`;
    });
    assert.equal(new Set(vs).size, 4, 'valores repetidos en la tabla');
    assert.ok(item.valores.every(r => Math.abs(r.num / r.den) <= 60));
  }
});

test('ej. 2: lo correcto no da error y un fallo se nombra con el error que lo explica', () => {
  for (const item of lote(generarTabla, 22).slice(0, 1500)) {
    const bien = item.huecos.map(col => F(item.valores[col]));
    assert.deepEqual(erroresDeTabla(item, bien), [null, null]);
    for (let k = 0; k < 2; k++) {
      const col = item.huecos[k];
      const v = { num: item.xs[col], den: 1 };
      const mal = bien.map(f => f);
      mal[k] = bien[k].sumar(1);
      const e = erroresDeTabla(item, mal);
      assert.equal(e[1 - k], null);
      assert.ok(e[k] === 'otra-respuesta' || NOMBRADOS.has(e[k]));
      for (const c of candidatos(item.e, v)) {
        if (!c.valor || c.valor.equals(bien[k])) continue;
        const m2 = bien.map(f => f);
        m2[k] = c.valor;
        assert.equal(erroresDeTabla(item, m2)[k], candidatos(item.e, v).find(z => z.valor && z.valor.equals(c.valor)).error);
      }
    }
  }
});

test('ej. 2: los textos de la tabla y su solución no llevan nada prohibido', () => {
  for (const item of lote(generarTabla, 23).slice(0, 1000)) {
    for (const idioma of ['es', 'en']) {
      textosProhibidos(htmlDe(item.e), idioma, 'tabla');
      textosProhibidos(solucionTabla(item, idioma), idioma, 'solución tabla');
      textosProhibidos(item.valores.map(r => numTexto(r, idioma)).join(' '), idioma, 'valores');
    }
  }
});

// ─── Ejercicio 3 ──────────────────────────────────────────────────────────────────────────────

test('ej. 3: exactamente una de las cuatro expresiones vale N, y las falsas valen otra cosa', () => {
  for (const item of lote(generarQueValor, 31)) {
    const x = deItem(item.v), Nn = deItem(item.N);
    assert.equal(item.opciones.length, 4);
    const dan = item.opciones.filter(o => igualR(evaluar(textoDe(o.e), x), Nn));
    assert.equal(dan.length, 1, `varias dan ${numTexto(item.N)} con x = ${item.v.num}`);
    assert.ok(dan[0].correcta);
    assert.equal(new Set(item.opciones.map(o => claveExpr(o.e))).size, 4, 'expresiones repetidas');
    assert.equal(new Set(item.opciones.map(o => textoDe(o.e))).size, 4);
    assert.ok(Math.abs(item.N.num / item.N.den) <= 60);
  }
});

test('ej. 3: cada falsa nace de un error con nombre: calculada con ese error, da N', () => {
  const vistos = new Set();
  for (const item of lote(generarQueValor, 32)) {
    const Nn = F(item.N);
    for (const o of item.opciones.filter(x => !x.correcta)) {
      assert.ok(NOMBRADOS.has(o.error), `error sin nombre ${o.error}`);
      const c = candidatos(o.e, item.v).find(k => k.error === o.error);
      assert.ok(c?.valor?.equals(Nn), `${textoDe(o.e)} con ${o.error} no da ${numTexto(item.N)}`);
      vistos.add(o.error);
    }
    assert.equal(new Set(item.opciones.filter(o => !o.correcta).map(o => o.error)).size, 3, 'tres errores distintos');
  }
  assert.ok(vistos.size >= 4, `solo salen ${[...vistos]}`);
});

test('ej. 3: los textos no llevan nada prohibido y el feedback es coherente', () => {
  for (const item of lote(generarQueValor, 33).slice(0, 1500)) {
    for (const idioma of ['es', 'en']) {
      const tt = o => o[idioma];
      textosProhibidos(tt(TX.ej3.instruccion)(item), idioma, 'instrucción');
      textosProhibidos(tt(TX.ej3.correcto)(item), idioma, 'correcto');
      for (const o of item.opciones) {
        textosProhibidos(htmlDe(o.e), idioma, 'opción');
        if (!o.correcta) textosProhibidos(tt(TX.ej3.por_que)(item, o) + tt(TX.ej3.solucion)(item), idioma, `por_que ${o.error}`);
      }
    }
  }
});

// ─── Comunes ──────────────────────────────────────────────────────────────────────────────────

test('casos reservados: hoy no hay hoja ni examen, y una huella añadida excluye el caso', () => {
  assert.equal(HUELLAS_RESERVADAS.size, 0);
  const e = { forma: 'lineal', a: 3, b: 2, delante: false }, v = { num: 4, den: 1 };
  assert.equal(esReservado(e, v), false);
  HUELLAS_RESERVADAS.add(huellaCaso(e, v));
  assert.equal(esReservado(e, v), true);
  assert.equal(esReservado({ ...e, delante: true }, v), true, '2 + 3x es la misma expresión que 3x + 2');
  assert.equal(esReservado(e, { num: 5, den: 1 }), false);
  HUELLAS_RESERVADAS.delete(huellaCaso(e, v));
});

test('las semillas dan siempre los mismos ítems', () => {
  for (const g of [generarSustituye, generarTabla, generarQueValor]) {
    const a = lote(g, 99).slice(0, 200).map(claveDe), b = lote(g, 99).slice(0, 200).map(claveDe);
    assert.deepEqual(a, b);
  }
});

test('valorDe coincide con el evaluador propio en todas las formas', () => {
  const rng = crearRng(5);
  for (let i = 0; i < 2000; i++) {
    const item = generarSustituye(rng);
    assert.ok(igualR(deItem({ num: valorDe(item.e, item.v).num, den: valorDe(item.e, item.v).den }), evaluar(textoDe(item.e), deItem(item.v))));
  }
});
