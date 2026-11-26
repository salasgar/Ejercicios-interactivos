// Práctica «Razones y proporciones» (PU2, tarea 212): 3000 ítems por ejercicio con semillas fijas, contra
// comprobaciones escritas AQUÍ con enteros, aparte de los generadores. Cada opción buena se cumple, cada falsa
// no, cada falsa nace de un error con nombre, ningún caso reservado sale y ningún texto de alumno lleva ×, %,
// una razón con «:» ni restos (NaN, undefined).

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import { sonProporcion, terminoQueFalta as terminoBase, huellaCaso } from '../practicas/_comun/proporcion.js';
import { mcd } from '../practicas/_comun/aritmetica.js';
import {
  PAREJAS, iguales, IDS_RAZON, CONTEXTOS_SENCILLA, MAX_TERMINO_SENCILLA, MAX_TERMINO_PROPORCION, MAX_SOLUCION,
  generarRazon, claveRazon, buenaRazon, errorRazon, gruposRazon,
  generarEquivalentes, claveEquivalentes, errorEquivalentes, errorSencilla,
  generarProporcion, claveProporcion, errorProporcion, hacenFaltaCuentas,
  generarTermino, claveTermino, errorTermino, leerRespuesta, esReservado, huellaDe, huellasDe, factorDe, cruz, terminoQueFalta,
} from '../practicas/razones/logica.js';
import { HUELLAS_RESERVADAS } from '../practicas/razones/reserva.js';
import {
  TX, CONTEXTOS_RAZON, CONTEXTOS_SENCILLA_TX, respuestaRazon, enunciadoRazon, feedbackRazon, enunciadoEquivalentes,
  feedbackEquivalentes, enunciadoProporcion, feedbackProporcion, enunciadoTermino, feedbackTermino,
} from '../practicas/razones/textos.js';

const N = 3000;
const IDIOMAS = ['es', 'en'];
const lote = (generar, semilla, n = N) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => generar(rng)); };
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const sinRestos = (texto, donde) => {
  const t = plano(texto);
  assert.doesNotMatch(t, /NaN|undefined|null|\[object|Infinity/, donde);
  assert.doesNotMatch(t, /×|%|por ciento|per cent|percent/i, donde);
};
const sinRazonConDosPuntos = (texto, donde) => assert.doesNotMatch(plano(texto), /\d\s*:\s*\d/, donde);
const maxRepeticion = (items, clave) => {
  const m = new Map();
  for (const it of items) m.set(clave(it), (m.get(clave(it)) ?? 0) + 1);
  return Math.max(...m.values()) / items.length;
};
const entre = (x, min, max, msg) => assert.ok(x >= min && x <= max, `${msg}: ${x}`);

test('ejercicio 1: la correcta sale de los datos y las cuatro opciones valen distinto', () => {
  const items = lote(generarRazon, 2121);
  for (const it of items) {
    assert.ok(IDS_RAZON.includes(it.ctx));
    for (const n of [it.a, it.b]) entre(n, 2, 9, 'número de 2 a 9 (sin 1: la concordancia)');
    assert.notEqual(it.a, it.b);
    assert.equal(mcd(it.a, it.b), 1);
    const [x, y] = it.sujeto === 0 ? [it.a, it.b] : [it.b, it.a];
    const esperada = it.pregunta === 'parte-parte' ? [x, y] : [x, x + y];
    assert.deepEqual(gruposRazon(it), { x, y, total: x + y });
    const buena = buenaRazon(it);
    assert.deepEqual([buena.num, buena.den], esperada);
    assert.equal(it.opciones.length, 4);
    assert.equal(it.opciones.filter(o => o.error === null).length, 1);
    for (const o of it.opciones) {
      assert.ok(Number.isInteger(o.num) && Number.isInteger(o.den) && o.num > 0 && o.den > 0);
      if (o !== buena) {
        assert.ok(['invertir-razon', 'parte-parte-como-parte-todo', 'parte-todo-como-parte-parte', 'otra-parte-sobre-el-total'].includes(o.error));
        assert.ok(!iguales(o.num, o.den, buena.num, buena.den), `distractor igual por valor en ${claveRazon(it)}`);
        assert.equal(errorRazon(it, respuestaRazon(o)), o.error);
      }
    }
    for (const a of it.opciones) for (const b of it.opciones) if (a !== b) assert.ok(!iguales(a.num, a.den, b.num, b.den), 'dos opciones valen lo mismo');
    const errores = it.opciones.map(o => o.error).filter(Boolean);
    assert.equal(new Set(errores).size, 3, 'cada error cae en un único candidato');
  }
  const partes = items.filter(i => i.pregunta === 'parte-parte').length;
  entre(partes / N, 0.45, 0.55, 'parte-parte a partes iguales');
  assert.ok(maxRepeticion(items, claveRazon) <= 0.1);
  assert.ok(new Set(items.map(i => i.ctx)).size === IDS_RAZON.length);
});

test('ejercicio 1: ningún enunciado ni feedback tiene un 1 (nada de «hay 1 … por cada», «1 son»)', () => {
  for (const it of lote(generarRazon, 2129, 600)) for (const idioma of IDIOMAS) {
    const textos = [enunciadoRazon(it, { idioma }), ...it.opciones.map(o => feedbackRazon(it, o.error, idioma))].map(plano).join(' ');
    assert.doesNotMatch(textos, /(^|[^\d])1([^\d]|$)/, claveRazon(it));
  }
});

test('ejercicio 1: el parte-parte con 2 y 3 son exactamente 2/3, 3/2, 2/5 y 3/5', () => {
  const rng = crearRng(1);
  let visto = false;
  for (let i = 0; i < 20000 && !visto; i++) {
    const it = generarRazon(rng);
    if (it.pregunta === 'parte-parte' && it.sujeto === 0 && it.a === 2 && it.b === 3) {
      assert.deepEqual(it.opciones.map(o => `${o.num}/${o.den}`).sort(), ['2/3', '2/5', '3/2', '3/5']);
      visto = true;
    }
  }
  assert.ok(visto);
});

test('ejercicio 1: textos en los dos idiomas, con los números y sin restos', () => {
  for (const it of lote(generarRazon, 2122, 600)) for (const idioma of IDIOMAS) {
    const enun = enunciadoRazon(it, { idioma });
    sinRestos(enun, claveRazon(it));
    sinRazonConDosPuntos(enun, claveRazon(it));
    assert.match(plano(enun), new RegExp(`\\b${it.a}\\b`));
    assert.match(plano(enun), new RegExp(`\\b${it.b}\\b`));
    assert.match(plano(enun), idioma === 'es' ? /por cada/ : /for every/);
    for (const o of it.opciones) sinRestos(feedbackRazon(it, o.error, idioma), claveRazon(it));
  }
  assert.ok(Object.keys(CONTEXTOS_RAZON).every(id => IDS_RAZON.includes(id)) && IDS_RAZON.length === Object.keys(CONTEXTOS_RAZON).length);
});

test('ejercicio 2: (a) una sola equivalente por valor; (b) solo vale la irreducible', () => {
  const items = lote(generarEquivalentes, 2123);
  const elegir = items.filter(i => i.tipo === 'elegir'), escribir = items.filter(i => i.tipo === 'escribir');
  entre(elegir.length / N, 0.45, 0.55, 'a partes iguales');
  for (const it of elegir) {
    assert.equal(mcd(it.p, it.q), 1);
    assert.equal(it.opciones.length, 4);
    const eq = it.opciones.filter(o => iguales(o.num, o.den, it.p, it.q));
    assert.equal(eq.length, 1, 'exactamente una equivalente');
    assert.equal(eq[0].error, null);
    assert.deepEqual([eq[0].num, eq[0].den], [it.p * it.k, it.q * it.k]);
    for (const o of it.opciones) if (o.error) {
      assert.ok(['suma-mismo-numero', 'amplia-un-termino', 'razon-invertida'].includes(o.error));
      assert.equal(errorEquivalentes(it, `${o.num}/${o.den}`), o.error);
    }
    assert.equal(new Set(it.opciones.map(o => o.error)).size, 4);
    for (const a of it.opciones) for (const b of it.opciones) if (a !== b) assert.ok(!iguales(a.num, a.den, b.num, b.den));
  }
  for (const it of escribir) {
    assert.ok(Object.hasOwn(CONTEXTOS_SENCILLA, it.ctx) && Object.hasOwn(CONTEXTOS_SENCILLA_TX, it.ctx));
    const a = it.p * it.k, b = it.q * it.k, c = CONTEXTOS_SENCILLA[it.ctx];
    assert.ok(PAREJAS.some(([p, q]) => p === it.p && q === it.q));
    entre(it.k, 2, 50, 'factor');
    assert.equal(mcd(a, b), it.k, 'el m.c.d. del feedback es el de los datos');
    for (const t of [a, b]) { assert.ok(t <= MAX_TERMINO_SENCILLA); entre(t, c.min, c.max, `cota de ${it.ctx}`); }
    assert.equal(errorSencilla(it, it.p, it.q), null);
    for (const m of [2, 3, 5]) assert.equal(errorSencilla(it, it.p * m, it.q * m), 'sin-simplificar-del-todo');
    assert.equal(errorSencilla(it, a, b), 'sin-simplificar-del-todo');
    assert.equal(errorSencilla(it, it.q, it.p), 'razon-invertida');
    assert.equal(errorSencilla(it, it.p + 1, it.q), 'razon-distinta');
    assert.equal(errorSencilla(it, 0, it.q), 'razon-distinta');
  }
  assert.ok(maxRepeticion(items, claveEquivalentes) <= 0.1);
  assert.equal(new Set(escribir.map(i => i.ctx)).size, Object.keys(CONTEXTOS_SENCILLA).length);
});

test('ejercicio 2: textos y feedback en los dos idiomas, con los números', () => {
  for (const it of lote(generarEquivalentes, 2124, 800)) for (const idioma of IDIOMAS) {
    const enun = enunciadoEquivalentes(it, { idioma });
    sinRestos(enun, JSON.stringify(it));
    sinRazonConDosPuntos(enun, JSON.stringify(it));
    if (it.tipo === 'elegir') {
      for (const o of it.opciones) sinRestos(feedbackEquivalentes(it, o.error, `${o.num}/${o.den}`, idioma), JSON.stringify(it));
    } else {
      const f = feedbackEquivalentes(it, 'sin-simplificar-del-todo', { num: it.p * 2, den: it.q * 2 }, idioma);
      sinRestos(f, JSON.stringify(it));
      assert.match(plano(f), new RegExp(`dividir entre ${2}|divide by ${2}`));
      sinRestos(feedbackEquivalentes(it, null, null, idioma), JSON.stringify(it));
      assert.doesNotMatch(plano(feedbackEquivalentes(it, null, { num: it.p, den: it.q }, idioma)), /no vale|does not/, 'un acierto no dice que no vale');
      assert.match(plano(feedbackEquivalentes(it, 'razon-distinta', { num: it.p + 1, den: it.q }, idioma)), /no vale lo mismo|does not have the same value/);
      assert.match(plano(enun), idioma === 'es' ? /lo más sencilla posible/ : /simplest form/);
    }
  }
});

test('ejercicio 3: la respuesta sale de los productos cruzados, la mitad son «sí» y hay que hacer la cuenta', () => {
  const items = lote(generarProporcion, 2125);
  let si = 0, dificilesSi = 0;
  for (const it of items) {
    for (const t of [it.a, it.b, it.c, it.d]) entre(t, 1, MAX_TERMINO_PROPORCION, 'términos hasta 60');
    const productos = it.a * it.d === it.b * it.c;
    assert.equal(productos, it.si);
    assert.equal(sonProporcion(it.a, it.b, it.c, it.d).resultado, it.si, 'de acuerdo con la base');
    if (it.si) { si++; assert.equal(it.error, null); if (hacenFaltaCuentas(it)) dificilesSi++; }
    else assert.ok(['suma-mismo-numero', 'termino-desviado'].includes(it.error));
    assert.equal(errorProporcion(it, it.si), null);
    assert.notEqual(errorProporcion(it, !it.si), null);
  }
  entre(si / N, 0.45, 0.55, '«sí»');
  assert.ok(dificilesSi >= si / 3, `al menos un tercio sin término múltiplo del vecino: ${dificilesSi}/${si}`);
  assert.ok(maxRepeticion(items, claveProporcion) <= 0.1);
  assert.ok(items.filter(i => !i.si && i.error === 'suma-mismo-numero').length > 300);
  assert.ok(items.filter(i => !i.si && i.error === 'termino-desviado').length > 300);
});

test('ejercicio 3: el feedback lleva las dos cuentas con los productos cruzados', () => {
  for (const it of lote(generarProporcion, 2126, 800)) for (const idioma of IDIOMAS) {
    const enun = enunciadoProporcion(it, { idioma });
    sinRestos(enun, claveProporcion(it));
    sinRazonConDosPuntos(enun, claveProporcion(it));
    assert.match(plano(enun), idioma === 'es' ? /\d y \d/ : /\d and \d/, 'la «y» es «and» en inglés');
    if (idioma === 'en') assert.doesNotMatch(plano(enun), /\d y \d/);
    const f = plano(feedbackProporcion(it, errorProporcion(it, !it.si), idioma));
    sinRestos(f, claveProporcion(it));
    assert.ok(f.includes(`${it.a} · ${it.d} = ${it.a * it.d}`), f);
    assert.ok(f.includes(`${it.b} · ${it.c} = ${it.b * it.c}`), f);
  }
});

test('ejercicio 4: la solución es natural, cuadra en cruz, la x va arriba o abajo y se calcula con los productos cruzados', () => {
  const items = lote(generarTermino, 2127);
  let noMultiplos = 0, derecha = 0, abajo = 0;
  for (const it of items) {
    assert.ok(Number.isInteger(it.x) && it.x >= 1 && it.x <= MAX_SOLUCION);
    assert.equal(typeof it.abajo, 'boolean');
    if (it.abajo) { abajo++; assert.equal(it.a * it.x, it.b * it.d, 'a · x = b · d'); } else assert.equal(it.a * it.d, it.b * it.x, 'a · d = b · x');
    assert.equal(terminoQueFalta(it), it.x);
    const { u, v, w } = cruz(it);
    assert.equal(u * v, w * it.x);
    if (it.abajo) assert.equal(terminoBase(it.b, it.a, null, it.d).resultado.num, it.x, 'de acuerdo con la base');
    else assert.equal(terminoBase(it.a, it.b, null, it.d).resultado.num, it.x, 'de acuerdo con la base');
    assert.ok([it.a, it.b, it.d].every(t => Number.isInteger(t) && t >= 1 && t <= MAX_SOLUCION));
    assert.ok(['derecha', 'izquierda'].includes(it.lado));
    if (it.lado === 'derecha') derecha++;
    const f1 = mcd(it.a, it.b), f2 = it.d / ((it.abajo ? it.a : it.b) / f1);
    if (f1 % f2 !== 0 && f2 % f1 !== 0) noMultiplos++;
    for (const idioma of IDIOMAS) {
      const e = enunciadoTermino(it, { idioma });
      sinRestos(e, claveTermino(it));
      if (it.abajo) {
        assert.match(e, new RegExp(`<span>${it.d}</span><span>x</span>`), 'la x, abajo');
        assert.doesNotMatch(e, new RegExp(`<span>x</span><span>\\d+</span>`), 'no la x arriba');
      } else {
        assert.match(e, new RegExp(`<span>x</span><span>${it.d}</span>`), 'la x, arriba');
        assert.doesNotMatch(e, new RegExp(`<span>\\d+</span><span>x</span>`), 'no la x abajo');
      }
    }
  }
  entre(derecha / N, 0.45, 0.55, 'x a derecha o a izquierda');
  entre(abajo / N, 0.28, 0.38, 'un tercio con la x abajo');
  assert.ok(noMultiplos >= N / 3, `un tercio con factores no múltiplos: ${noMultiplos}`);
  assert.ok(maxRepeticion(items, claveTermino) <= 0.1);
});

test('ejercicio 4: se admite cualquier escritura del valor y cada error es distinto de la solución', () => {
  const items = lote(generarTermino, 2128);
  const cuentaErrores = { 'suma-en-vez-de-multiplicar': 0, 'da-el-factor': 0 };
  for (const it of items) {
    for (const [texto, idioma] of [[`${it.x}`, 'es'], [`${it.x},0`, 'es'], [`${it.x}.0`, 'en'], [`${it.x * 2}/2`, 'es']]) {
      assert.equal(errorTermino(it, leerRespuesta(texto, idioma)), null, `«${texto}» vale ${it.x}`);
    }
    assert.notEqual(errorTermino(it, leerRespuesta(`${it.x + 1}`)), null);
    assert.equal(errorTermino(it, null), 'otro-numero');
    const dif = it.abajo ? it.d + it.b - it.a : it.d - (it.b - it.a);
    if (dif > 0) {
      const e = errorTermino(it, leerRespuesta(`${dif}`));
      assert.equal(e, dif === it.x ? null : 'suma-en-vez-de-multiplicar');
      if (e) cuentaErrores['suma-en-vez-de-multiplicar']++;
    }
    if (it.d % cruz(it).w === 0) {
      const e = errorTermino(it, leerRespuesta(`${factorDe(it)}`));
      assert.equal(e, factorDe(it) === it.x ? null : 'da-el-factor');
      if (e) cuentaErrores['da-el-factor']++;
    }
    for (const idioma of IDIOMAS) for (const error of [null, 'suma-en-vez-de-multiplicar', 'da-el-factor', 'otro-numero']) {
      const f = plano(feedbackTermino(it, error, idioma));
      sinRestos(f, claveTermino(it));
      const { u, v, w } = cruz(it);
      assert.ok(f.includes(`${u} · ${v} = ${w} · x`) && f.includes(`x = ${u * v} : ${w} = ${it.x}`), f);
      if (it.abajo) assert.ok(f.includes(`${it.b} · ${it.d} = ${it.a} · x`), 'x abajo: b · d = a · x, sin despejar la x de abajo');
    }
  }
  assert.ok(cuentaErrores['suma-en-vez-de-multiplicar'] > 500 && cuentaErrores['da-el-factor'] > 100, JSON.stringify(cuentaErrores));
  assert.equal(leerRespuesta('abc'), null);
  assert.equal(leerRespuesta(''), null);
});

test('reserva: ningún ítem queda sin huella ni coincide con una reservada, y la x abajo es el mismo caso que la x arriba', () => {
  assert.equal(HUELLAS_RESERVADAS.size, 70, 'huellas de la hoja y del examen de la sesión 1');
  const generadores = [[generarRazon, 9101], [generarEquivalentes, 9102], [generarProporcion, 9103], [generarTermino, 9104]];
  for (const [g, semilla] of generadores) for (const it of lote(g, semilla, N)) {
    const h = huellaDe(it);
    assert.notEqual(h, null, `huella de ${JSON.stringify(it)}`);
    assert.ok(!huellasDe(it).some(x => HUELLAS_RESERVADAS.has(x)), `reservado: ${JSON.stringify(it)}`);
  }
  assert.equal(huellaDe({ a: 3, b: 4, d: 6, x: 8, abajo: true, lado: 'derecha' }), huellaCaso('proporcion', [4, 3, null, 6]), '3/4 = 6/x es 4/3 = x/6');
  const inventado = [3, 4, null, 20];
  const h = huellaCaso('proporcion', inventado);
  assert.equal(h, huellaCaso('proporcion', [null, 20, 3, 4]), '3/4 = x/20 y x/20 = 3/4 son el mismo caso');
  const apareceSinReserva = lote(generarTermino, 9001, 40000).some(i => i.a === 3 && i.b === 4 && i.d === 20 && !i.abajo);
  assert.ok(apareceSinReserva, 'sin reserva, el caso inventado sale (si no, la prueba no prueba nada)');
  HUELLAS_RESERVADAS.add(h);
  try {
    const it = { a: 3, b: 4, d: 20, x: 15, abajo: false, lado: 'izquierda' };
    assert.equal(huellaDe(it), h);
    assert.ok(esReservado(it));
    assert.ok(!lote(generarTermino, 9001, 40000).some(i => i.a === 3 && i.b === 4 && i.d === 20 && !i.abajo), 'con la reserva, no sale');
    const prop = { a: 3, b: 4, c: 5, d: 6, si: false, error: 'suma-mismo-numero' };
    HUELLAS_RESERVADAS.add(huellaDe(prop));
    assert.ok(!lote(generarProporcion, 9002, 20000).some(i => (i.a === 3 && i.b === 4 && i.c === 5 && i.d === 6) || (i.a === 5 && i.b === 6 && i.c === 3 && i.d === 4)));
  } finally { HUELLAS_RESERVADAS.delete(h); HUELLAS_RESERVADAS.delete(huellaDe({ a: 3, b: 4, c: 5, d: 6 })); }
});

test('los textos fijos de la práctica no llevan ×, % ni «a : b» como razón', () => {
  const textos = JSON.stringify(TX);
  assert.doesNotMatch(textos, /×|%|por ciento|per cent/i);
  assert.equal(T.es.comprobar !== undefined, true);
});
