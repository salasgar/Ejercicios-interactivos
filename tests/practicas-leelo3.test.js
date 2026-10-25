// Práctica «Léelo en inglés» de la unidad 3: 3000 ítems por ejercicio con semillas fijas,
// contra lectores de inglés escritos AQUÍ, aparte del generador: la opción buena dice lo que
// se pide, cada falsa dice otra cosa (o es un calco que no es inglés), nunca se enfrentan
// dos formas válidas, ningún número en letra pasa de cien y no sale ni ×, ni el guion como
// menos, ni «(+».

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { evaluar, leerEntero, fmt } from '../practicas/_comun/enteros.js';
import {
  numeroAIngles, leerOperacion, leerOperando, numerosParecidos, nombreDe, ESTA_DEFINIDO,
  generarEnteros, generarOperaciones, generarPotencias, generarPalabras,
  PLANTILLAS_ENTEROS, PLANTILLAS_OPERACIONES, PLANTILLAS_POTENCIAS, PLANTILLAS_PALABRAS, claveDe,
} from '../practicas/leelo3/logica.js';
import { TX } from '../practicas/leelo3/textos.js';

const N = 3000;
const EJERCICIOS = [
  ['Los enteros', generarEnteros, PLANTILLAS_ENTEROS],
  ['Sumas, restas y productos', generarOperaciones, PLANTILLAS_OPERACIONES],
  ['Potencias', generarPotencias, PLANTILLAS_POTENCIAS],
  ['Palabras y símbolos', generarPalabras, PLANTILLAS_PALABRAS],
];

function items(generar, semilla) {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, () => generar(rng));
}

// ─── Lectores de inglés (independientes del generador) ───────────────────────────────

const PALABRAS = new Map(Array.from({ length: 101 }, (_, k) => [numeroAIngles(k), k]));
const NUM = '(?:[a-z]+(?:-[a-z]+)?(?: hundred)?)';
const SIGNO = '(?:negative |minus )';
const palabraANumero = p => { assert.ok(PALABRAS.has(p), `número en letra desconocido: «${p}»`); return PALABRAS.get(p); };
const conSigno = (s, p) => (s ? -palabraANumero(p) : palabraANumero(p));
const quitaHtml = t => t.replace(/<sup>(\d+)<\/sup>/g, '^$1').replace(/<[^>]+>/g, '');

/** «negative seven» → −7, «seven» → 7, «positive seven» → 7; null si no es una lectura. */
function leerEnteroEn(t) {
  let m = t.match(new RegExp(`^(${SIGNO}|positive )?(${NUM})$`));
  if (m && PALABRAS.has(m[2])) return conSigno(m[1] && m[1] !== 'positive ', m[2]);
  m = t.match(new RegExp(`^(${NUM}) below zero$`));
  if (m && PALABRAS.has(m[1])) return -palabraANumero(m[1]);
  return null;
}

/** Grados: «minus three degrees», «three degrees below zero», «three degrees above zero», «three degrees». */
function leerGradosEn(t) {
  let m = t.match(new RegExp(`^(${SIGNO})?(${NUM}) degrees(?: (below|above) zero)?$`));
  if (!m || !PALABRAS.has(m[2])) return null;
  const n = palabraANumero(m[2]);
  if (m[3] === 'below') return m[1] ? NaN : -n;
  if (m[3] === 'above') return m[1] ? NaN : n;
  return m[1] ? -n : n;
}

const VERBOS = { plus: '+', minus: '-', 'take away': '-', times: '*', 'multiplied by': '*', 'divided by': ':' };

/** «five minus negative three» → { a: 5, op: '-', b: −3 }; null si no es una operación. */
function leerOperacionEn(t) {
  const m = t.match(new RegExp(`^(${SIGNO})?(${NUM}) (plus|minus|take away|times|multiplied by|divided by) (${SIGNO})?(${NUM})$`));
  if (!m || !PALABRAS.has(m[2]) || !PALABRAS.has(m[5])) return null;
  return { a: conSigno(m[1], m[2]), op: VERBOS[m[3]], b: conSigno(m[4], m[5]) };
}

const valorOp = ({ a, op, b }) => evaluar(`${a < 0 ? `-${-a}` : a} ${op} ${b < 0 ? `(-${-b})` : b}`);

const SUF = { squared: 2, cubed: 3 };
/** «negative three, squared» → { b: −3, e: 2 }, «the opposite of three squared» → { opuesto: true, b: 3, e: 2 }. */
function leerPotenciaEn(t) {
  const exp = '(squared|cubed|to the power of ([a-z]+))';
  let m = t.match(new RegExp(`^the opposite of (${NUM}) ${exp}$`));
  if (m) return { opuesto: true, b: palabraANumero(m[1]), e: SUF[m[2]] ?? palabraANumero(m[3]) };
  m = t.match(new RegExp(`^(${SIGNO})?(${NUM})(?:, | )${exp}$`));
  if (m && PALABRAS.has(m[2])) return { opuesto: false, b: conSigno(m[1], m[2]), e: SUF[m[3]] ?? palabraANumero(m[4]) };
  return null;
}
const valorPot = p => (p.opuesto ? -1 : 1) * Math.pow(p.b, p.e);

/** Formas que significan lo mismo, para ver que no se enfrentan. */
function canonica(t) {
  return t
    .replace(/(\w+) degrees below zero/g, 'minus $1 degrees')
    .replace(/\bnegative\b/g, 'minus').replace(/\btake away\b/g, 'minus')
    .replace(/\bmultiplied by\b/g, 'times').replace(/\bindex\b/g, 'exponent')
    .replace(/\bbrackets\b/g, 'parentheses').replace(/\bpositive\b/g, '');
}

const textosDe = it => [it.frase, it.notacion, it.solucion.es, it.solucion.en,
  ...it.opciones.flatMap(o => [o.texto, o.html ?? '', o.por_que?.es ?? '', o.por_que?.en ?? ''])];

// ─── Comprobaciones generales a los cuatro ejercicios ────────────────────────────────

EJERCICIOS.forEach(([nombre, generar, plantillas], i) => {
  test(`${nombre}: estructura, errores con nombre, parejas y escritura (3000 ítems)`, () => {
    const lista = items(generar, 4000 + i);
    const vistas = new Set();
    for (const it of lista) {
      vistas.add(it.plantilla);
      assert.ok(TX.instrucciones[it.instruccion], `instrucción desconocida: ${it.instruccion}`);
      assert.ok(it.opciones.length >= 2 && it.opciones.length <= 4, `${it.plantilla}: ${it.opciones.length} opciones`);
      assert.equal(it.opciones.filter(o => o.correcta).length, 1, `${it.plantilla}: una sola correcta`);
      assert.equal(new Set(it.opciones.map(o => o.texto)).size, it.opciones.length, `${it.plantilla}: textos repetidos`);
      const buena = it.opciones.find(o => o.correcta);
      const canBuena = canonica(buena.texto);
      for (const o of it.opciones.filter(x => !x.correcta)) {
        assert.ok(ESTA_DEFINIDO(o.error), `${it.plantilla}: error sin nombre «${o.error}»`);
        assert.ok(nombreDe(o.error).es && nombreDe(o.error).en);
        assert.notEqual(canonica(o.texto), canBuena, `${it.plantilla}: «${o.texto}» es otra forma de «${buena.texto}»`);
        assert.ok(o.por_que.es && o.por_que.en, `${it.plantilla}: falta por_que`);
      }
      assert.ok(it.solucion.es && it.solucion.en);
      for (const t of textosDe(it)) {
        assert.ok(!t.includes('×'), `× en «${t}»`);
        assert.ok(!/(^|[\s(,:])-\d/.test(t), `guion como menos en «${t}»`);
        assert.ok(!t.includes('(+'), `«(+» en «${t}»`);
        assert.ok(!/(?<!one )hundred|thousand/.test(t), `número en letra mayor que cien en «${t}»`);
      }
      // Las notaciones son solo números y signos.
      for (const t of [it.notacion, ...it.opciones.map(o => o.html).filter(Boolean)]) {
        assert.match(quitaHtml(t), /^[\d\s·:+−()|^°C,-]*$/, `notación rara «${t}»`);
      }
      assert.equal(typeof claveDe(it), 'string');
    }
    assert.deepEqual([...vistas].sort(), [...new Set(lista.map(x => x.plantilla))].sort());
    assert.ok(vistas.size >= plantillas.length - 1, `faltan plantillas: ${vistas.size} de ${plantillas.length}`);
  });

  test(`${nombre}: la buena no cae siempre en el mismo sitio`, () => {
    const lista = items(generar, 5000 + i).filter(it => it.opciones.length === 4);
    if (lista.length < 300) return;
    const cuentas = [0, 0, 0, 0];
    for (const it of lista) cuentas[it.opciones.findIndex(o => o.correcta)]++;
    for (const c of cuentas) assert.ok(c / lista.length < 0.4, `posición dominante: ${cuentas}`);
  });
});

// ─── Ejercicio 1 ─────────────────────────────────────────────────────────────────────

test('Los enteros: cada ítem dice lo que se pide y cada falsa dice otra cosa', () => {
  for (const it of items(generarEnteros, 11)) {
    const buena = it.opciones.find(o => o.correcta);
    const falsas = it.opciones.filter(o => !o.correcta);
    switch (it.plantilla) {
      case 'leer_entero': {
        const v = leerEntero(it.notacion);
        assert.equal(leerEnteroEn(buena.texto), v);
        for (const f of falsas) {
          const x = leerEnteroEn(f.texto);
          if (x === null) assert.equal(f.error, 'calco-del-espanol', f.texto);
          else assert.notEqual(x, v, `«${f.texto}» vale ${v}`);
        }
        break;
      }
      case 'leer_temperatura': {
        const v = leerEntero(it.notacion.replace(' °C', ''));
        assert.equal(leerGradosEn(buena.texto), v);
        for (const f of falsas) {
          const x = leerGradosEn(f.texto);
          if (x === null) assert.equal(f.error, 'calco-del-espanol', f.texto);
          else assert.notEqual(x, v, `«${f.texto}» vale ${v}`);
        }
        assert.ok(v >= -25 && v <= -2, 'realismo: temperatura de −25 a −2');
        break;
      }
      case 'palabras_a_entero': {
        const f0 = it.frase;
        const v = f0.includes('degrees') ? leerGradosEn(f0) : leerEnteroEn(f0);
        assert.equal(leerEntero(buena.texto.replace(' °C', '')), v);
        for (const f of falsas) assert.notEqual(leerEntero(f.texto.replace(' °C', '')), v);
        break;
      }
      case 'comparar': {
        const m = it.frase.match(/^(−?\d+)( °C)? is ___ than (−?\d+)/);
        const a = leerEntero(m[1]), b = leerEntero(m[3]);
        const alto = ['warmer', 'greater'];
        assert.equal(alto.includes(buena.texto), a > b);
        assert.equal(falsas.length, 1);
        assert.equal(alto.includes(falsas[0].texto), a < b);
        assert.ok(Math.abs(a) <= 20 && Math.abs(b) <= 20);
        break;
      }
      case 'orden': {
        const m = it.frase.match(/^(.*): which list is in (ascending|descending) order\?$/);
        const l = m[1].split(', ').map(leerEntero);
        const bien = [...l].sort((x, y) => (m[2] === 'ascending' ? x - y : y - x));
        assert.deepEqual(buena.texto.split(', ').map(leerEntero), bien);
        for (const f of falsas) {
          const x = f.texto.split(', ').map(leerEntero);
          assert.deepEqual([...x].sort((p, q) => p - q), [...l].sort((p, q) => p - q), 'mismos números');
          assert.notDeepEqual(x, bien);
        }
        break;
      }
      case 'absoluto_opuesto': {
        const abs = it.notacion.startsWith('|');
        const k = abs ? leerEntero(it.notacion.slice(1, -1)) : leerEntero(quitaHtml(it.notacion).replace(/^−\(/, '').replace(/\)$/, ''));
        const m = buena.texto.match(new RegExp(`^the (absolute value|opposite) of (.+)$`));
        assert.equal(m[1], abs ? 'absolute value' : 'opposite');
        assert.equal(leerEnteroEn(m[2]), k);
        for (const f of falsas) {
          const g = f.texto.match(new RegExp(`^the (absolute value|opposite) of (.+)$`));
          if (!g) { assert.equal(f.error, 'calco-del-espanol', f.texto); continue; }
          assert.ok(g[1] !== m[1] || leerEnteroEn(g[2]) !== k, `«${f.texto}» es igual a la buena`);
        }
        break;
      }
      default: assert.fail(it.plantilla);
    }
  }
});

test('numerosParecidos: 13↔30, 41↔14 y nada fuera de rango', () => {
  assert.deepEqual(numerosParecidos(13).sort(), [30, 31]);
  assert.ok(numerosParecidos(30).includes(13));
  assert.ok(numerosParecidos(41).includes(14));
  assert.deepEqual(numerosParecidos(7), []);
  assert.deepEqual(numerosParecidos(22), []);
});

// ─── Ejercicio 2 ─────────────────────────────────────────────────────────────────────

test('leerOperacion: casos fijos con negative / minus, take away y times / multiplied by', () => {
  const e = { neg: 'negative', restar: 'minus', por: 'times' };
  assert.equal(leerOperacion(5, '-', -3, e), 'five minus negative three');
  assert.equal(leerOperacion(5, '-', -3, { ...e, restar: 'take away' }), 'five take away negative three');
  assert.equal(leerOperacion(5, '-', -3, { ...e, neg: 'minus' }), 'five minus minus three');
  assert.equal(leerOperacion(-5, '+', 3, e), 'negative five plus three');
  assert.equal(leerOperacion(5, '*', -2, e), 'five times negative two');
  assert.equal(leerOperacion(5, '*', -2, { ...e, por: 'multiplied by' }), 'five multiplied by negative two');
  assert.equal(leerOperacion(12, ':', -3, e), 'twelve divided by negative three');
  assert.equal(leerOperando(-21, e), 'negative twenty-one');
  assert.equal(leerOperando(40, e), 'forty');
});

test('Sumas, restas y productos: cada ítem dice lo que se pide y cada falsa dice otra cosa', () => {
  for (const it of items(generarOperaciones, 12)) {
    const buena = it.opciones.find(o => o.correcta);
    const falsas = it.opciones.filter(o => !o.correcta);
    switch (it.plantilla) {
      case 'leer_expresion':
      case 'leer_producto': {
        const v = evaluar(quitaHtml(it.notacion));
        const mn = quitaHtml(it.notacion).match(/^(−?\d+) ([+−·:]) (\(?−?\d+\)?)$/);
        const lb = leerOperacionEn(buena.texto);
        assert.equal(valorOp(lb), v, buena.texto);
        assert.equal(lb.a, leerEntero(mn[1]));
        assert.equal(lb.b, leerEntero(mn[3].replace(/[()]/g, '')));
        for (const f of falsas) {
          const x = leerOperacionEn(f.texto);
          assert.notEqual(valorOp(x), v, `«${f.texto}» vale lo mismo que ${it.notacion}`);
        }
        if (it.plantilla === 'leer_producto') assert.ok(lb.op === '*' || lb.op === ':');
        else assert.ok(lb.op === '+' || lb.op === '-');
        break;
      }
      case 'take_away_from': {
        const m = it.frase.match(/^(?:take ([a-z-]+) away from ([a-z-]+)|subtract ([a-z-]+) from ([a-z-]+))$/);
        const b = palabraANumero(m[1] ?? m[3]), a = palabraANumero(m[2] ?? m[4]);
        assert.equal(evaluar(buena.texto), a - b);
        for (const f of falsas) assert.notEqual(evaluar(f.texto), a - b, f.texto);
        assert.equal(new Set(it.opciones.map(o => evaluar(o.texto))).size, it.opciones.length, 'valores distintos');
        break;
      }
      case 'nombre_resultado': {
        const m = it.frase.match(/^The ___ of (\d+) and (\d+) is (\d+)$/);
        const [a, b, r] = [Number(m[1]), Number(m[2]), Number(m[3])];
        const op = { sum: a + b, difference: a - b, product: a * b, quotient: a / b };
        assert.equal(op[buena.texto], r);
        for (const f of falsas) assert.notEqual(op[f.texto], r, `«${f.texto}» también da ${r}`);
        break;
      }
      case 'regla_de_signos': {
        const m = it.frase.match(/^When you (multiply|divide) two numbers with (the same|different) signs, the result is ___$/);
        assert.equal(buena.texto, m[2] === 'the same' ? 'positive' : 'negative');
        assert.equal(falsas.length, 1);
        break;
      }
      default: assert.fail(it.plantilla);
    }
  }
});

// ─── Ejercicio 3 ─────────────────────────────────────────────────────────────────────

test('Potencias: cada ítem dice lo que se pide y cada falsa dice otra cosa', () => {
  for (const it of items(generarPotencias, 13)) {
    const buena = it.opciones.find(o => o.correcta);
    const falsas = it.opciones.filter(o => !o.correcta);
    const pot = () => {
      const m = quitaHtml(it.notacion).match(/^(\(?−?\d+\)?)\^(\d+)$/);
      return { b: leerEntero(m[1].replace(/[()]/g, '')), e: Number(m[2]) };
    };
    switch (it.plantilla) {
      case 'leer_potencia': {
        const { b, e } = pot();
        const lb = leerPotenciaEn(buena.texto);
        assert.equal(lb.opuesto, false);
        assert.equal(lb.b, b);
        assert.equal(lb.e, e);
        for (const f of falsas) {
          const x = leerPotenciaEn(f.texto);
          if (x) { assert.notEqual(valorPot(x), Math.pow(b, e), `«${f.texto}» vale lo mismo que ${it.notacion}`); continue; }
          const t = f.texto.match(new RegExp(`^(${SIGNO})?(${NUM}) times (${NUM})$`));
          if (t) { assert.equal(f.error, 'base-por-exponente'); assert.notEqual(conSigno(t[1], t[2]) * palabraANumero(t[3]), Math.pow(b, e)); continue; }
          assert.equal(f.error, 'calco-del-espanol', f.texto);
          assert.ok(!/(squared|cubed|to the power of)$/.test(f.texto), f.texto);
        }
        break;
      }
      case 'base_exponente': {
        const { b, e } = pot();
        const parte = it.frase.match(/the (base|exponent|index) is/)[1];
        assert.equal(leerEntero(buena.texto), parte === 'base' ? b : e);
        for (const f of falsas) assert.notEqual(leerEntero(f.texto), parte === 'base' ? b : e);
        break;
      }
      case 'cuadrado_cubo': {
        const m = it.frase.match(/^([a-z]+) (squared|cubed)$/);
        const b = palabraANumero(m[1]), k = SUF[m[2]];
        const veces = t => t.split(' · ').map(Number);
        const esBuena = t => { const x = veces(t); return x.length === k && x.every(y => y === b); };
        assert.ok(esBuena(buena.texto));
        for (const f of falsas) assert.ok(!esBuena(f.texto), f.texto);
        break;
      }
      case 'par_impar': {
        if (it.notacion) {
          const { e } = pot();
          assert.equal(buena.texto, e % 2 === 0 ? 'even' : 'odd');
        } else {
          const m = it.frase.match(/with an (even|odd) \((par|impar)\) exponent/);
          assert.equal(buena.texto, m[1] === 'even' ? 'positive' : 'negative');
          assert.equal(m[1] === 'even', m[2] === 'par');
        }
        assert.equal(falsas.length, 1);
        break;
      }
      default: assert.fail(it.plantilla);
    }
  }
});

test('Potencias: even y odd se aclaran entre paréntesis salvo donde se evalúan', () => {
  for (const it of items(generarPotencias, 14)) {
    const evalua = it.frase.includes('is an ___ number');
    if (evalua) assert.ok(!it.frase.includes('(par)') && !it.frase.includes('(impar)'));
    else if (/\b(even|odd)\b/.test(it.frase)) assert.match(it.frase, /\((par|impar)\)/);
  }
});

// ─── Ejercicio 4 ─────────────────────────────────────────────────────────────────────

test('Palabras y símbolos: cada ítem dice lo que se pide y cada falsa dice otra cosa', () => {
  for (const it of items(generarPalabras, 15)) {
    const buena = it.opciones.find(o => o.correcta);
    const falsas = it.opciones.filter(o => !o.correcta);
    const nGrados = t => Number(t.replace(/ (degrees?|m)$/, '').replace('−', '-'));
    const nEuros = t => Number(t.replace(/ €$/, '').replace('−', '-'));
    switch (it.plantilla) {
      case 'frase_potencia': {
        const v = valorPot(leerPotenciaEn(it.frase));
        assert.equal(evaluar(buena.texto), v);
        for (const f of falsas) assert.notEqual(evaluar(f.texto), v, f.texto);
        break;
      }
      case 'frase_operacion': {
        const v = valorOp(leerOperacionEn(it.frase));
        assert.equal(evaluar(buena.texto), v);
        for (const f of falsas) assert.notEqual(evaluar(f.texto), v, f.texto);
        break;
      }
      case 'cambio': {
        const m = it.frase.match(/was (−?\d+) °C\. At 20:00 it was (−?\d+) °C/);
        const [x, y] = [leerEntero(m[1]), leerEntero(m[2])];
        assert.equal(nGrados(buena.texto), y - x);
        for (const f of falsas) assert.notEqual(nGrados(f.texto), y - x);
        assert.ok(Math.abs(y - x) <= 20 && Math.abs(x) <= 30 && Math.abs(y) <= 45, 'realismo: cambio en un día');
        break;
      }
      case 'cuanto_mas': {
        const m = it.frase.match(/\((−?\d+) °C\).*\((−?\d+) °C\)/);
        const d = Math.abs(leerEntero(m[1]) - leerEntero(m[2]));
        assert.equal(nGrados(buena.texto), d);
        for (const f of falsas) assert.notEqual(nGrados(f.texto), d);
        assert.ok(Math.abs(leerEntero(m[1])) <= 35 && Math.abs(leerEntero(m[2])) <= 35);
        break;
      }
      case 'saldo': {
        const retirar = it.frase.includes('withdraw');
        const m = it.frase.match(/balance is (−?\d+) €\. You (?:withdraw|deposit) \((?:retiras|ingresas)\) (\d+) €/);
        const v = leerEntero(m[1]) + (retirar ? -1 : 1) * Number(m[2]);
        assert.equal(nEuros(buena.texto), v);
        for (const f of falsas) assert.notEqual(nEuros(f.texto), v);
        assert.ok(v >= -50 && v <= 300, `realismo: saldo ${v}`);
        break;
      }
      case 'profundidad': {
        let m = it.frase.match(/at (−\d+) m\. She swims (\d+) m deeper/);
        if (m) {
          const v = leerEntero(m[1]) - Number(m[2]);
          assert.equal(nGrados(buena.texto), v);
          for (const f of falsas) assert.notEqual(nGrados(f.texto), v);
          assert.ok(v >= -40 && v <= 0, `realismo: buceo ${v}`);
        } else {
          m = it.frase.match(/at (−\d+) m and a turtle is at (−\d+) m/);
          const d = leerEntero(m[2]) - leerEntero(m[1]);
          assert.equal(nGrados(buena.texto), d);
          for (const f of falsas) assert.notEqual(nGrados(f.texto), d);
          assert.ok(leerEntero(m[1]) >= -40 && leerEntero(m[2]) <= -2);
        }
        break;
      }
      case 'beneficio_perdida': {
        const m = it.frase.match(/profit of (\d+) €.*loss of (\d+) €/);
        const v = Number(m[1]) - Number(m[2]);
        assert.equal(nEuros(buena.texto), v);
        for (const f of falsas) assert.notEqual(nEuros(f.texto), v);
        assert.ok(Number(m[1]) <= 200 && Number(m[2]) <= 200);
        break;
      }
      default: assert.fail(it.plantilla);
    }
  }
});

test('Palabras y símbolos: las palabras no matemáticas que deciden la respuesta llevan su aclaración', () => {
  for (const it of items(generarPalabras, 16)) {
    if (/\bwithdraw\b/.test(it.frase)) assert.match(it.frase, /withdraw \(retiras\)/);
    if (/\bdeposit\b/.test(it.frase)) assert.match(it.frase, /deposit \(ingresas\)/);
  }
});

test('Ejercicio 4 de la práctica: nombres de los errores en los dos idiomas', () => {
  assert.equal(fmt(-3), '−3');
  assert.ok(nombreDe('inicial-menos-final').en);
  assert.ok(nombreDe('calco-del-espanol').es);
});
