// Práctica «Dos signos seguidos» (unidad 3, tarea 84): fuerza bruta con semillas fijas.
// Las comprobaciones usan `evaluar` y `bienEscrita` de la base, que no son de la práctica.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  evaluar, analizar, aTexto, bienEscrita, quitarParentesisDeNumeros, fmt, leerEntero, ERRORES_TIPICOS,
} from '../practicas/_comun/enteros.js';
import {
  generarUnSigno, generarNegativo, generarQuita, generarBienEscrita,
  errorDeSigno, errorDeValor, errorDeNegativo, errorDeValorNegativo, errorDeTermino, esReescrituraCorrecta, primerFallo,
  textoSinParentesis, valorConSignos, ERROR_DOS_SIGNOS, ERROR_OTRO,
} from '../practicas/dos-signos/logica.js';
import {
  TX, feedbackSigno, feedbackUnSigno, feedbackNegativo, feedbackValorNegativo, feedbackQuita, feedbackValorQuita, feedbackBien,
} from '../practicas/dos-signos/textos.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';

const N = 3000;
const generarN = (fn, semilla = 1) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => fn(rng)); };
const ctx = idioma => ({ tt: o => o[idioma], t: {}, idioma });
const IDIOMAS = ['es', 'en'];

test('el catálogo declara 4 ejercicios para dos-signos', () => {
  assert.equal(CATALOGO.find(p => p.slug === 'dos-signos').nEjercicios, 4);
});

// --- Ejercicio 1 ------------------------------------------------------------------

test('ejercicio 1: el valor coincide con evaluar y está entre −30 y 30; el signo que queda es el de la regla', () => {
  let solos = 0, conA = 0;
  const vistos = new Set();
  for (const item of generarN(generarUnSigno)) {
    const dato = item.solo ? item.texto : item.texto;
    assert.equal(evaluar(dato), item.valor, item.texto);
    assert.ok(Math.abs(item.valor) <= 30, item.texto);
    // Regla independiente: signos iguales dan +, distintos dan −.
    assert.equal(item.signo, item.op === item.interno ? '+' : '-');
    assert.equal(evaluar(item.reescrita), item.valor, `${item.texto} → ${item.reescrita}`);
    assert.ok(item.b >= 1 && item.b <= 9 && (item.solo || (item.a >= 1 && item.a <= 20)));
    item.solo ? solos++ : conA++;
    vistos.add(`${item.op}${item.interno}`);
  }
  assert.ok(solos > 500 && conA > 500, 'salen las dos formas');
  assert.equal(vistos.size, 4, 'salen los cuatro pares de signos');
});

test('ejercicio 1: los errores de signo y de valor se nombran con errores típicos de la base o con otro-error', () => {
  const conocidos = new Set([...Object.keys(ERRORES_TIPICOS), ERROR_OTRO]);
  for (const item of generarN(generarUnSigno, 2)) {
    assert.ok(conocidos.has(errorDeSigno(item)), errorDeSigno(item));
    for (const r of [item.valor, -item.valor, item.valor + 1, item.a === null ? -item.b : item.a - item.b]) {
      if (r !== item.valor) assert.ok(conocidos.has(errorDeValor(item, r)), `${item.texto} ${r}`);
    }
  }
  // 5 − (−3) = 5 − 3, el error de Juan Luis.
  const item = { solo: false, a: 3, op: '-', interno: '-', b: 2, signo: '+', valor: 5 };
  assert.equal(errorDeValor(item, 1), 'restar-negativo');
  assert.equal(errorDeValor({ solo: true, a: null, op: '-', interno: '-', b: 9, signo: '+', valor: 9 }, -9), 'opuesto-del-opuesto');
});

// --- Ejercicio 2 ------------------------------------------------------------------

test('ejercicio 2: sumar un negativo es restar y restar un negativo es sumar; el valor coincide con evaluar', () => {
  let negativos = 0;
  for (const item of generarN(generarNegativo)) {
    assert.equal(evaluar(item.texto), item.valor, item.texto);
    assert.equal(evaluar(item.reescrita), item.valor, `${item.texto} → ${item.reescrita}`);
    assert.ok(Math.abs(item.valor) <= 30, item.texto);
    assert.equal(item.signo, item.op === '+' ? '-' : '+');
    assert.ok(item.b >= 1 && item.b <= 9 && Math.abs(item.a) >= 1 && Math.abs(item.a) <= 20);
    if (item.a < 0) negativos++;
    // Las dos reescrituras ofrecidas dan valores distintos: solo una es buena.
    assert.notEqual(evaluar(`${fmt(item.a)} + ${item.b}`), evaluar(`${fmt(item.a)} − ${item.b}`));
    assert.equal(errorDeNegativo(item), item.op === '+' ? 'sumar-negativo' : 'restar-negativo');
  }
  assert.ok(negativos > 300, 'a veces el primer número es negativo');
});

test('ejercicio 2: el error de valor coincide con 3 − (−2) = 3 − 2 y con 5 + (−3) = 8', () => {
  assert.equal(errorDeValorNegativo({ a: 3, op: '-', b: 2, signo: '+', valor: 5 }, 1), 'restar-negativo');
  assert.equal(errorDeValorNegativo({ a: 5, op: '+', b: 3, signo: '-', valor: 2 }, 8), 'sumar-negativo');
  assert.equal(errorDeValorNegativo({ a: 5, op: '+', b: 3, signo: '-', valor: 2 }, 7), ERROR_OTRO);
});

// --- Ejercicio 3 ------------------------------------------------------------------

test('ejercicio 3: la expresión sin paréntesis coincide con la de la base y con evaluar', () => {
  const longitudes = new Set();
  for (const item of generarN(generarQuita)) {
    longitudes.add(item.terminos.length);
    assert.ok(item.terminos.length >= 3 && item.terminos.length <= 5);
    assert.equal(evaluar(item.texto), item.valor, item.texto);
    assert.ok(Math.abs(item.valor) <= 30, item.texto);
    const finales = item.terminos.map(t => t.signo);
    const sin = textoSinParentesis(finales, item.terminos);
    assert.equal(evaluar(sin), item.valor, `${item.texto} → ${sin}`);
    assert.equal(aTexto(quitarParentesisDeNumeros(item.texto)), aTexto(analizar(sin)), `${item.texto} → ${sin}`);
    assert.ok(!sin.includes('('), 'ya no quedan paréntesis');
    assert.ok(bienEscrita(sin), sin);
    assert.ok(bienEscrita(item.texto), item.texto);
    // Al menos un menos al quitar los paréntesis (el botón empieza en +) y los dos signos interiores.
    assert.ok(finales.includes('-'));
    assert.ok(item.terminos.some(t => t.interno === '+') && item.terminos.some(t => t.interno === '-'));
    assert.ok(esReescrituraCorrecta(item, finales));
    assert.equal(valorConSignos(item, finales), item.valor);
    assert.equal(primerFallo(item, finales), null);
    // Reescribir +5 como 5 al empezar: el texto no lleva '+' delante.
    assert.ok(!/^\+/.test(sin));
  }
  assert.deepEqual([...longitudes].sort(), [3, 4, 5]);
});

test('ejercicio 3: cambiar un solo signo es siempre un fallo y se señala ese término', () => {
  for (const item of generarN(generarQuita, 3).slice(0, 500)) {
    const finales = item.terminos.map(t => t.signo);
    item.terminos.forEach((t, i) => {
      const mios = [...finales];
      mios[i] = mios[i] === '+' ? '-' : '+';
      assert.ok(!esReescrituraCorrecta(item, mios));
      assert.equal(primerFallo(item, mios), i);
      assert.notEqual(valorConSignos(item, mios), item.valor, 'cambiar un signo cambia el valor');
    });
  }
  assert.equal(errorDeTermino({ op: '-', interno: '-' }), 'restar-negativo');
  assert.equal(errorDeTermino({ op: '+', interno: '-' }), 'sumar-negativo');
  assert.equal(errorDeTermino({ op: null, interno: '-' }), 'signo-cambiado');
});

// --- Ejercicio 4 ------------------------------------------------------------------

test('ejercicio 4: tres opciones de la misma cuenta, exactamente una bien escrita, sin repetidas', () => {
  for (const item of generarN(generarBienEscrita)) {
    assert.equal(item.opciones.length, 3);
    const textos = item.opciones.map(o => o.texto);
    assert.equal(new Set(textos).size, 3, textos.join(' | '));
    assert.equal(item.opciones.filter(o => bienEscrita(o.texto)).length, 1, textos.join(' | '));
    assert.equal(item.opciones.filter(o => o.bien).length, 1);
    for (const o of item.opciones) {
      assert.equal(o.bien, bienEscrita(o.texto), o.texto);
      assert.equal(o.bien, o.texto === item.buena);
      if (!o.bien) assert.equal(o.error, ERROR_DOS_SIGNOS);
    }
    // La buena es de verdad esa cuenta; las malas no se evalúan (no son expresiones válidas
    // para la jerarquía de clase), solo se dice cuál está bien escrita.
    assert.equal(evaluar(item.buena), item.valor);
    assert.ok(Math.abs(item.valor) <= 30);
    // Las malas tienen los mismos números y signos que la buena, solo que sin paréntesis.
    const esqueleto = x => x.replace(/[()\s]/g, '');
    for (const o of item.opciones) assert.equal(esqueleto(o.texto), esqueleto(item.buena), o.texto);
  }
});

// --- Textos y feedback --------------------------------------------------------------

function todosLosTextos() {
  const salida = [];
  const rng = crearRng(7);
  const limite = 400;
  for (const idioma of IDIOMAS) {
    const c = ctx(idioma);
    const tt = c.tt;
    for (let i = 0; i < limite; i++) {
      const u = generarUnSigno(rng);
      salida.push(u.texto, u.reescrita, feedbackSigno(u, c), feedbackUnSigno(u, c, true), feedbackUnSigno(u, c, false));
      const n = generarNegativo(rng);
      salida.push(n.texto, n.reescrita, feedbackNegativo(n, c), feedbackValorNegativo(n, c, true), feedbackValorNegativo(n, c, false));
      const q = generarQuita(rng);
      const signos = q.terminos.map(t => t.signo);
      salida.push(q.texto, textoSinParentesis(signos, q.terminos), feedbackValorQuita(q, c, true), feedbackValorQuita(q, c, false));
      q.terminos.forEach((_, k) => salida.push(feedbackQuita(q, c, signos, k)));
      const b = generarBienEscrita(rng);
      salida.push(...b.opciones.map(o => o.texto), feedbackBien(b, c, b.buena), ...b.opciones.map(o => feedbackBien(b, c, o.texto)));
    }
    for (const bloque of [TX.introduccion, TX.enunciado, TX.nombres, TX.detalles]) {
      for (const v of Object.values(bloque)) salida.push(tt(v));
    }
    salida.push(tt(TX.resultado), tt(TX.signo_de), tt(TX.comprobar_signos));
  }
  return salida;
}

test('ningún texto de alumno lleva ×, guion como signo, letras de variable ni +N como resultado', () => {
  const textos = todosLosTextos();
  assert.ok(textos.length > 5000);
  for (const t of textos) {
    const plano = t.replace(/<[^>]+>/g, '');
    assert.ok(!plano.includes('×'), plano);
    // El guion '-' solo puede ir en palabras («Comprueba-», «sub-»), nunca pegado a un número ni entre espacios.
    assert.ok(!/(^|[\s(])-\s?\d|\d\s?-(\s|\d|$)|\s-\s/.test(plano), `guion como signo en: ${plano}`);
    assert.ok(!/=\s*\+\d/.test(plano), `+N como resultado en: ${plano}`);
    // Ninguna letra de variable pegada a un número.
    assert.ok(!/\b\d+\s?[xyn]\b/.test(plano), plano);
  }
});

test('«(+N)» solo aparece como dato de una cuenta, nunca como resultado', () => {
  for (const t of todosLosTextos()) {
    const plano = t.replace(/<[^>]+>/g, '');
    assert.ok(!/=\s*\(\+/.test(plano), plano);
    assert.ok(!/\(\+\d+\)\s*$/.test(plano) || /[+−]\s?\(\+\d+\)\s*$/.test(plano) || /^\(\+\d+\)/.test(plano) || /^[+−]\(\+\d+\)/.test(plano), plano);
  }
});

test('el feedback lleva los números del ítem, en los dos idiomas', () => {
  const rng = crearRng(11);
  for (let i = 0; i < 500; i++) {
    const n = generarNegativo(rng);
    for (const idioma of IDIOMAS) {
      const t = feedbackNegativo(n, ctx(idioma));
      assert.ok(t.includes(String(n.b)) && t.includes(fmt(n.valor)), t);
    }
    const b = generarBienEscrita(rng);
    const mala = b.opciones.find(o => !o.bien).texto;
    for (const idioma of IDIOMAS) assert.ok(feedbackBien(b, ctx(idioma), mala).includes(mala));
  }
});

test('leerEntero acepta el menos de teclado, el real y el de rayita (el campo del resultado)', () => {
  assert.equal(leerEntero('-3'), -3);
  assert.equal(leerEntero('−3'), -3);
  assert.equal(leerEntero('–3'), -3);
  assert.equal(leerEntero('3'), 3);
  assert.equal(leerEntero(''), null);
});
