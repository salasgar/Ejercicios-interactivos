// Base de la unidad 3 (reparto-practicas-u2, tarea 79): `practicas/_comun/enteros.js`
// y la parte pura de `practicas/_comun/recta-enteros.js`. El evaluador se prueba
// contra una tabla calculada a mano y contra JavaScript (`Function`, con `**` y
// paréntesis explícitos, sacados del árbol del generador y no del analizador).

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { errorValido } from '../practicas/_comun/registro.js';
import {
  MENOS, fmt, fmtPar, leerEntero, analizar, evaluar, html, aTexto, num, valorLiteral, esLiteral,
  pasosPosibles, aplicarPaso, pasoCanonico, cadenaDePasos, nodoEn,
  terminos, deTerminos, quitarParentesis, quitarParentesisDeNumeros, bienEscrita,
  ERRORES_TIPICOS, distractores, ErrorEnteros,
  reglaSignosEnSuma, sumaValoresAbsolutos, olvidaElSigno, signoDelPrimero, opuestoDelOpuesto, valorAbsolutoNegativo,
  restarNegativo, sumarNegativo, signoDelMayorEnProducto, signoDelMayorEnCociente,
  potenciaParNegativa, potenciaImparPositiva, potenciaDePositivoNegativa, basePorExponente,
  menosEnLaBase, signosAntesDeLaPotencia, menosEnLaBaseDentro, mismoSignoDosVeces, menosSoloAlPrimero,
  inicialMenosFinal, diferenciaSinSigno, signoCambiado, comparaComoNaturales, ordenaComoNaturales,
  derechaAIzquierda, sinJerarquia, ignoraElParentesis,
} from '../practicas/_comun/enteros.js';
import {
  marcas, conNumero, geometria, marcaMasCercana, anchoNumero, ANCHO_RECTA, SEPARACION_TERMOMETRO,
} from '../practicas/_comun/recta-enteros.js';

const GUION = '-';
const N = 3000;
const limpio = v => (v === 0 ? 0 : v);

// --- Escritura y lectura ---------------------------------------------------------------

test('fmt y fmtPar: el menos es U+2212, nunca el guion, y nunca «+5»', () => {
  assert.equal(MENOS.codePointAt(0), 0x2212);
  assert.equal(fmt(-5), '−5');
  assert.equal(fmt(0), '0');
  assert.equal(fmt(-0), '0');
  assert.equal(fmt(5), '5');
  assert.equal(fmtPar(-5), '(−5)');
  assert.equal(fmtPar(5), '5');
  for (let n = -50; n <= 50; n++) {
    assert.ok(!fmt(n).includes(GUION) && !fmt(n).includes('+'), fmt(n));
    assert.equal(leerEntero(fmt(n)), n);
  }
});

test('leerEntero: -, − y –, un + delante y espacios; nada de decimales ni basura', () => {
  const bien = { '-5': -5, '−5': -5, '–5': -5, '+5': 5, '5': 5, ' − 12 ': -12, '0': 0, '-0': 0, '007': 7, '1 000': 1000 };
  for (const [t, v] of Object.entries(bien)) assert.equal(leerEntero(t), v, JSON.stringify(t));
  for (const t of ['', ' ', '-', '+', '5.2', '5,2', '−−5', '+-5', '5-', 'x', '1/2', '5a', null, undefined, '2³']) {
    assert.equal(leerEntero(t), null, JSON.stringify(t));
  }
  assert.ok(Object.is(leerEntero('-0'), 0), 'sin −0');
});

// --- El evaluador: tabla a mano ---------------------------------------------------------

const TABLA = [
  ['−3²', -9], ['(−3)²', 9], ['−(−3)²', -9], ['−(−3²)', 9],
  ['30 : (−5) · 2', -12], ['30 : (−5 · 2)', -3],
  ['−2 − 3', -5], ['−3 + 5', 2], ['3 − 7', -4], ['−7 + 3', -4],
  ['5 − (−3)', 8], ['5 + (−3)', 2], ['(−4) − (+6) + (−2) − (−9)', -3],
  ['5 · (−2)', -10], ['(−2) · (−3)', 6], ['12 : (−3)', -4], ['−12 : (−4)', 3], ['0 : (−4)', 0],
  ['(−2)⁴', 16], ['−2⁴', -16], ['(−2)³', -8], ['(−5)²', 25], ['(−1)⁵', -1],
  ['2 − 4 + 3', 1], ['10 − 4 + 3', 9], ['4 − 5 · 2', -6], ['−3 + 4 · (−2)', -11], ['5 − 2³', -3], ['−2² + 6', 2],
  ['5 − (2 − 7)', 10], ['5 + (3 − 8)', 0], ['(3 + 5)²', 64], ['3 + 5²', 28], ['(−2 · 3)²', 36], ['−2 · 3²', -18],
  ['6 − (2 · (−3) + 1)', 11], ['[3 − (2 − 5)] · 2', 12], ['−[4 − (−3)²]', 5], ['(−2) · 3 · (−1) · (−5)', -30],
  ['3² + 5 · 4', 29], ['−6 : 2 · 3', -9], ['−(−4)', 4], ['+5 − 8', -3], ['2 · (−3)² − 4', 14],
  ['−1 − 1 − 1 − 1', -4], ['−3 − (−3)', 0], ['(−8) : (−2) : (−2)', -2], ['−(2 − 9) · 2', 14],
  // Lo que puede teclear el alumno: * x × / ÷ ^, el guion y la raya.
  ['4 - 5*2', -6], ['12 / (−3)', -4], ['3 x (−2)', -6], ['3 × (−2)', -6], ['−20 ÷ 4', -5], ['-3^2', -9], ['(–3)^2', 9],
];

test(`evaluar: ${TABLA.length} expresiones calculadas a mano (las del inventario incluidas)`, () => {
  assert.ok(TABLA.length >= 40);
  for (const [texto, valor] of TABLA) {
    assert.equal(evaluar(texto), valor, texto);
    assert.equal(evaluar(analizar(texto)), valor, `${texto} (árbol)`);
  }
});

test('analizar: los errores de escritura se dicen, y las divisiones que no se pueden hacer también', () => {
  for (const t of ['', '3 +', '(3 + 2', '3 + 2)', '2(3)', '(2)(3)', '3 a 2', '2^', '2^2^2', '3,5', '3.5', '[3 + 2)', '· 3', '3 ·']) {
    assert.throws(() => analizar(t), e => e instanceof ErrorEnteros && e.codigo === 'sintaxis', JSON.stringify(t));
  }
  assert.throws(() => evaluar('7 : 2'), e => e.codigo === 'division-no-exacta');
  assert.throws(() => evaluar('(−7) : 2'), e => e.codigo === 'division-no-exacta');
  assert.throws(() => evaluar('5 : 0'), e => e.codigo === 'division-entre-0');
  assert.throws(() => evaluar('5 : (3 − 3)'), e => e.codigo === 'division-entre-0');
  assert.equal(evaluar('0 : 5'), 0);
});

// --- El evaluador contra JavaScript -------------------------------------------------------

// Nivel de lo que puede ir en cada hueco, como lo lee `analizar`.
const NIVEL = n => (n.tipo === 'op' ? (n.op === '+' || n.op === '-' ? 1 : 2) : n.tipo === 'neg' || n.tipo === 'pos' ? 3 : n.tipo === 'pot' ? 4 : 5);
const parentesis = (n, rng) => ({ tipo: 'par', forma: rng.azar() < 0.8 ? '(' : '[', arg: n });

/** Un árbol al azar, ya con los paréntesis que hacen falta para que su texto se lea igual. */
function generar(rng, d) {
  const r = rng.azar();
  if (d <= 0 || r < 0.28) return num(rng.entero(0, 12));
  if (r < 0.42) return { tipo: 'neg', arg: generar(rng, d - 1) };
  if (r < 0.45) return { tipo: 'pos', arg: generar(rng, d - 1) };
  if (r < 0.5) return parentesis(generar(rng, d - 1), rng);
  if (r < 0.6) return { tipo: 'pot', base: generar(rng, d - 1), exp: rng.entero(0, 3) };
  return { tipo: 'op', op: rng.elegir(['+', '-', '+', '-', '*', ':']), izq: generar(rng, d - 1), der: generar(rng, d - 1) };
}

/** Mete entre paréntesis lo que no puede ir en su hueco sin ellos (y el signo que no va el primero). */
function ajustar(n, minimo, primero, rng) {
  let m;
  switch (n.tipo) {
    case 'op': {
      const nivel = NIVEL(n);
      m = { ...n, izq: ajustar(n.izq, nivel, primero, rng), der: ajustar(n.der, nivel + 1, false, rng) };
      break;
    }
    case 'neg': case 'pos': m = { ...n, arg: ajustar(n.arg, 4, false, rng) }; break;
    case 'pot': m = { ...n, base: ajustar(n.base, 5, false, rng) }; break;
    case 'par': m = { ...n, arg: ajustar(n.arg, 1, true, rng) }; break;
    default: m = n;
  }
  const signoMalPuesto = (m.tipo === 'neg' || m.tipo === 'pos') && !primero;
  return NIVEL(m) < minimo || signoMalPuesto ? parentesis(ajustar(n, 1, true, rng), rng) : m;
}

/** El mismo árbol en JavaScript, con todos los paréntesis (la división, exacta o error). */
function js(n) {
  switch (n.tipo) {
    case 'num': return `(${n.valor})`;
    case 'neg': return `(-${js(n.arg)})`;
    case 'pos': return `(+${js(n.arg)})`;
    case 'par': return js(n.arg);
    case 'pot': return `(${js(n.base)}**${n.exp})`;
    default: return n.op === ':' ? `D(${js(n.izq)},${js(n.der)})` : `(${js(n.izq)}${n.op}${js(n.der)})`;
  }
}
const D = (a, b) => { if (b === 0 || a % b !== 0) throw new Error('división'); return a / b; };
const valorJs = n => { try { return limpio(Function('D', `return ${js(n)}`)(D)); } catch { return null; } };
const valorNuestro = n => { try { return evaluar(n); } catch (e) { assert.ok(e instanceof ErrorEnteros, e.message); return null; } };

function arboles(semilla, d = 4) {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, () => ajustar(generar(rng, d), 1, true, rng));
}

test(`evaluar: igual que JavaScript en ${N} expresiones al azar, y el texto se vuelve a leer igual`, () => {
  let calculadas = 0;
  for (const arbol of arboles(79)) {
    const texto = aTexto(arbol);
    assert.deepEqual(analizar(texto), arbol, texto);
    const esperado = valorJs(arbol);
    if (esperado !== null && !Number.isSafeInteger(esperado)) continue;
    assert.equal(valorNuestro(analizar(texto)), esperado, texto);
    if (esperado !== null) calculadas++;
    const h = html(arbol);
    assert.ok(!h.includes(GUION), `guion en ${h}`);
    assert.ok(!h.includes('*') && !h.includes('×'), h);
  }
  assert.ok(calculadas > N / 2, `solo ${calculadas} con valor`);
});

test('html: −, ·, : y <sup>; un resultado negativo que no va el primero, entre paréntesis', () => {
  assert.equal(html('−3^2 + 5 * (−2) / 2'), '−3<sup>2</sup> + 5 · (−2) : 2');
  assert.equal(html('12 : (−3)', { dividir: '÷' }), '12 ÷ (−3)');
  assert.equal(aTexto('(-2)^3 - [4 - 1]'), '(−2)³ − [4 − 1]');
  // Un paso que deja un negativo en medio: con paréntesis; al principio, sin ellos.
  assert.equal(aTexto(aplicarPaso('3 + 4 · (−2) · 2', 0)), '3 + (−8) · 2');
  assert.equal(aTexto(aplicarPaso('(3 − 5) · 4', 0)), '−2 · 4');
  assert.equal(aTexto(aplicarPaso('(1 − 4)²', 0)), '(−3)²');
  assert.equal(aTexto(aplicarPaso('−(2 − 5)', 0)), '−(−3)');
  assert.equal(aTexto(num(-7)), '−7');
});

test('html: marcarOperadores pone cada operación en un span con su ruta; envolver resalta un trozo', () => {
  const h = html('3² + 5 · 4', { marcarOperadores: true });
  assert.equal(h, '3<span class="ent-op" data-ruta="izq"><sup>2</sup></span> <span class="ent-op" data-ruta="">+</span> 5 <span class="ent-op" data-ruta="der">·</span> 4');
  // −3: el menos de un número no es una operación; −3²: sí (va después de la potencia).
  assert.ok(!html('−3 + 2', { marcarOperadores: true }).startsWith('<span'));
  assert.ok(html('−3²', { marcarOperadores: true }).startsWith('<span class="ent-op" data-ruta="">−</span>'));
  // La base de −3² es 3 y la de (−3)² es −3 (U3-3C-12): se ve en el árbol.
  assert.equal(nodoEn('−3²', 'arg.base').valor, 3);
  assert.equal(html('−3²', { envolver: { 'arg.base': 'base' } }), '−<span class="base">3</span><sup>2</sup>');
  assert.equal(valorLiteral(nodoEn('(−3)²', 'base')), -3);
  assert.equal(html('(−3)²', { envolver: { base: 'base' } }), '<span class="base">(−3)</span><sup>2</sup>');
});

// --- Paso a paso ---------------------------------------------------------------------

const operaciones = t => pasosPosibles(t).map(p => p.operacion);

test('pasosPosibles: lo independiente vale; en las cadenas, de izquierda a derecha salvo que dé lo mismo', () => {
  assert.deepEqual(operaciones('3² + 5 · 4'), ['3²', '5 · 4'], 'regla de Juan Luis (8-10): las dos valen');
  assert.deepEqual(operaciones('2 − 4 + 3'), ['2 − 4'], 'adelantar 4 + 3 cambia el valor (2 − 7)');
  assert.deepEqual(operaciones('10 − 4 + 3'), ['10 − 4']);
  assert.deepEqual(operaciones('10 · 8 : 4'), ['10 · 8', '8 : 4'], 'en 10 · 8 : 4 da igual');
  assert.deepEqual(operaciones('−3 + 5 − 2'), ['−3 + 5', '5 − 2']);
  assert.deepEqual(operaciones('30 : (−5) · 2'), ['30 : (−5)'], '(−5) · 2 primero cambia el valor (U3-3C-20)');
  assert.deepEqual(operaciones('30 : (−5 · 2)'), ['−5 · 2']);
  assert.deepEqual(operaciones('−3²'), ['3²'], 'primero la potencia, después el signo');
  assert.deepEqual(operaciones('−(−3)²'), ['(−3)²']);
  assert.deepEqual(operaciones('−(−4) + 3'), ['−(−4)']);
  assert.deepEqual(operaciones('4 − 5 · 2'), ['5 · 2']);
  assert.deepEqual(operaciones('−7'), []);
  assert.deepEqual(operaciones('(−7)'), []);
  assert.deepEqual(pasosPosibles('10 · 8 : 4', { cadenas: false }).map(p => p.operacion), ['10 · 8']);
  assert.deepEqual(operaciones('7 : 2 + 1'), [], 'una división que no es exacta no es un paso');
  assert.deepEqual(operaciones('(−2) · 3 · (−1)'), ['−2 · 3', '3 · (−1)'], 'en la operación suelta, el primero va sin paréntesis');
});

test('pasoCanonico y cadenaDePasos: el paréntesis de dentro, después lo de más nivel, de izquierda a derecha', () => {
  const textos = t => cadenaDePasos(t).map(e => aTexto(e.arbol));
  assert.deepEqual(textos('[3 − (2 − 5)] · 2 − 3²'), ['[3 − (2 − 5)] · 2 − 3²', '[3 − (−3)] · 2 − 3²', '6 · 2 − 3²', '6 · 2 − 9', '12 − 9', '3'].map(s => s.replace(/−/g, MENOS)));
  assert.deepEqual(textos('30 : (−5) · 2'), ['30 : (−5) · 2', '−6 · 2', '−12'].map(s => s.replace(/−/g, MENOS)));
  assert.deepEqual(textos('−(−3)²'), ['−(−3)²', '−9'].map(s => s.replace(/−/g, MENOS)));
  assert.deepEqual(textos('−(−3²)'), ['−(−3²)', '−(−9)', '9'].map(s => s.replace(/−/g, MENOS)));
  assert.equal(pasoCanonico('3² + 5 · 4').operacion, '3²');
  assert.equal(pasoCanonico('−5'), null);
});

test(`pasos: en ${N} expresiones al azar, cada paso posible conserva el valor y la cadena acaba en él`, () => {
  let probadas = 0;
  for (const arbol of arboles(80, 3)) {
    const valor = valorJs(arbol);
    if (valor === null || !Number.isSafeInteger(valor)) continue;
    probadas++;
    for (const paso of pasosPosibles(arbol)) {
      const despues = aplicarPaso(arbol, paso);
      assert.equal(evaluar(despues), valor, `${aTexto(arbol)} → ${aTexto(despues)}`);
      assert.equal(evaluar(analizar(aTexto(despues))), valor, `se vuelve a leer: ${aTexto(despues)}`);
      assert.ok(!html(despues).includes(GUION));
    }
    const estados = cadenaDePasos(arbol);
    assert.equal(valorLiteral(estados.at(-1).arbol), valor, aTexto(arbol));
    assert.ok(estados.slice(1).every(e => evaluar(e.arbol) === valor));
    if (!esLiteral(arbol)) assert.ok(pasosPosibles(arbol).length >= 1);
  }
  assert.ok(probadas > N / 2);
});

// --- Términos y paréntesis --------------------------------------------------------------

test('terminos y deTerminos: los términos con su signo, y de vuelta', () => {
  const t = terminos('−3 + 5 − (−2) − 2 · 4');
  assert.deepEqual(t.map(x => [x.signo, aTexto(x.arbol)]), [[-1, '3'], [1, '5'], [-1, `(${MENOS}2)`], [-1, '2 · 4']]);
  assert.equal(evaluar(deTerminos(t)), evaluar('−3 + 5 − (−2) − 2 · 4'));
  assert.equal(aTexto(deTerminos(t)), `${MENOS}3 + 5 ${MENOS} (${MENOS}2) ${MENOS} 2 · 4`);
});

test('quitarParentesis: precedido de +, igual; de −, cambian todos los signos (y nunca solo el primero)', () => {
  assert.equal(aTexto(quitarParentesis('5 − (3 − 8)', 'der')), `5 ${MENOS} 3 + 8`);
  assert.equal(aTexto(quitarParentesis('5 + (3 − 8)', 'der')), `5 + 3 ${MENOS} 8`);
  assert.equal(aTexto(quitarParentesis('(−2 + 4) − 1', 'izq')), `${MENOS}2 + 4 ${MENOS} 1`);
  assert.equal(aTexto(quitarParentesis('−(−2 + 4) + 3', 'izq.arg')), `2 ${MENOS} 4 + 3`);
  assert.equal(aTexto(quitarParentesis('6 − (2 · (−3) + 1)', 'der')), `6 ${MENOS} 2 · (${MENOS}3) ${MENOS} 1`);
  assert.equal(aTexto(quitarParentesis('[3 − (2 − 5)] · 2', 'izq.arg.der')), `[3 ${MENOS} 2 + 5] · 2`);
  assert.equal(quitarParentesis('2 · (3 − 1)', 'der'), null, 'en un producto no se quita así');
  assert.equal(quitarParentesis('5 − 3', 'der'), null);
  // Al azar: el valor no cambia, y no coincide con «el menos solo al primero».
  const rng = crearRng(81);
  for (let i = 0; i < N; i++) {
    const [a, b, c, d] = [rng.entero(-12, 12), rng.entero(-12, 12), rng.entero(1, 12), rng.entero(1, 12)];
    const signo = rng.elegir(['+', '−']), dentro = rng.elegir(['+', '−']);
    const texto = `${fmt(a)} ${signo} (${fmt(b)} ${dentro} ${c} + ${d})`;
    const sin = quitarParentesis(texto, 'der');
    assert.equal(evaluar(sin), evaluar(texto), texto);
    assert.ok(!aTexto(sin).includes('('), aTexto(sin));
  }
});

test('quitarParentesisDeNumeros: 5 − (−3) + (+2) → 5 + 3 + 2; los de los productos se quedan', () => {
  assert.equal(aTexto(quitarParentesisDeNumeros('(−4) − (+6) + (−2) − (−9)')), `${MENOS}4 ${MENOS} 6 ${MENOS} 2 + 9`);
  assert.equal(aTexto(quitarParentesisDeNumeros('+5 − (+3)')), `5 ${MENOS} 3`);
  assert.equal(aTexto(quitarParentesisDeNumeros('5 · (−2) − (−1)')), `5 · (${MENOS}2) + 1`);
  const rng = crearRng(82);
  for (let i = 0; i < N; i++) {
    const n = rng.entero(3, 5);
    const partes = Array.from({ length: n }, (_, k) => `${k ? `${rng.elegir(['+', '−'])} ` : ''}(${rng.elegir(['+', '−'])}${rng.entero(1, 15)})`);
    const texto = partes.join(' ');
    const sin = quitarParentesisDeNumeros(texto);
    assert.equal(evaluar(sin), evaluar(texto), texto);
    assert.ok(!aTexto(sin).includes('(') && !aTexto(sin).includes('+ +') && bienEscrita(sin), aTexto(sin));
  }
});

test('bienEscrita: dos signos seguidos sin paréntesis, no (U3-2C-10, U3-2C-16)', () => {
  for (const t of ['5 − (−3)', '−5 · 2', '5 · (−2)', '(+6) − (−4)', '−3²', '+5', '−(−4)']) assert.equal(bienEscrita(t), true, t);
  for (const t of ['5 − −3', '5 −− 3', '5 · −2', '5 + −3', '−−3', '5 − +3', '3 +', '']) assert.equal(bienEscrita(t), false, t);
});

// --- Errores típicos ---------------------------------------------------------------------

test('errores típicos: los ejemplos del inventario y de las fichas', () => {
  assert.equal(reglaSignosEnSuma(-2, -3), 5);
  assert.equal(reglaSignosEnSuma(-2, 3), null, 'en −2 + 3 la regla de los signos da lo mismo: no sirve de distractor');
  assert.equal(sumaValoresAbsolutos(-7, 3), -10);
  assert.equal(olvidaElSigno(3, -7), 4);
  assert.equal(signoDelPrimero(-3, 5), -2);
  assert.equal(opuestoDelOpuesto(-9), -9);
  assert.equal(valorAbsolutoNegativo(-4), -4);
  assert.equal(valorAbsolutoNegativo(4), null);
  assert.equal(restarNegativo(3, -2), 1);
  assert.equal(sumarNegativo(5, -3), 8);
  assert.equal(signoDelMayorEnProducto(5, -2), 10);
  assert.equal(signoDelMayorEnProducto(-2, -3), -6);
  assert.equal(signoDelMayorEnProducto(-4, 4), null);
  assert.equal(signoDelMayorEnCociente(12, -3), 4);
  assert.equal(potenciaParNegativa(-2, 4), -16);
  assert.equal(potenciaImparPositiva(-2, 3), 8);
  assert.equal(potenciaDePositivoNegativa(4, 3), -64);
  assert.equal(basePorExponente(-5, 2), -10);
  assert.equal(basePorExponente(2, 2), null, '2² = 2 · 2: no sirve');
  assert.equal(menosEnLaBase(3, 2), 9);
  assert.equal(menosEnLaBase(3, 3), null);
  assert.equal(signosAntesDeLaPotencia(-3, 2), 9);
  assert.equal(menosEnLaBaseDentro(3, 2), -9);
  assert.equal(mismoSignoDosVeces(4, 10), 14);
  assert.equal(menosSoloAlPrimero(5, 2, -7), -4);
  assert.equal(inicialMenosFinal(-3, 5), -8);
  assert.equal(diferenciaSinSigno(5, -3), 2);
  assert.equal(signoCambiado(-5), 5);
  assert.equal(signoCambiado(0), null);
  assert.equal(comparaComoNaturales(-5, -2), '>');
  assert.equal(comparaComoNaturales(3, -8), null);
  assert.deepEqual(ordenaComoNaturales([3, -5, -2]), [-2, -5, 3]);
  assert.equal(ordenaComoNaturales([3, 1, 2]), null);
  assert.equal(derechaAIzquierda('2 − 4 + 3'), -5);
  assert.equal(derechaAIzquierda('2 + 4 + 3'), null);
  assert.equal(sinJerarquia('3 + 4 · 2'), 14);
  assert.equal(sinJerarquia('3 · 4 + 2'), null);
  assert.equal(ignoraElParentesis('30 : (−5 · 2)'), -12);
  assert.equal(ignoraElParentesis('(3 + 5)²'), 28);
  assert.equal(ignoraElParentesis('5 − (2 − 7)'), -4);
  assert.equal(ignoraElParentesis('(−3)²'), null, 'el paréntesis de un número no agrupa ninguna operación');
});

// La cuenta buena de cada error de números, escrita aparte (no con las funciones del módulo).
const BUENA = {
  'regla-signos-en-suma': (a, b) => a + b, 'suma-valores-absolutos': (a, b) => a + b, 'olvida-el-signo': (a, b) => a + b,
  'signo-del-primero': (a, b) => a + b, 'opuesto-del-opuesto': n => -n, 'valor-absoluto-negativo': n => Math.abs(n),
  'restar-negativo': (a, b) => a - b, 'sumar-negativo': (a, b) => a + b, 'signo-del-mayor-producto': (a, b) => a * b,
  'signo-del-mayor-cociente': (a, b) => a / b, 'potencia-par-negativa': (b, n) => b ** n, 'potencia-impar-positiva': (b, n) => b ** n,
  'potencia-positiva-negativa': (b, n) => b ** n, 'base-por-exponente': (b, n) => b ** n, 'menos-en-la-base': (a, n) => -(a ** n),
  'signos-antes-de-la-potencia': (b, n) => -(b ** n), 'menos-en-la-base-dentro': (a, n) => -(-(a ** n)),
  'mismo-signo-dos-veces': (a, p) => a - p, 'menos-solo-al-primero': (a, b, c) => a - (b + c),
  'inicial-menos-final': (i, f) => f - i, 'diferencia-sin-signo': (a, b) => Math.abs(a - b), 'signo-cambiado': v => v,
};

test('errores típicos: con números, nunca dan la cuenta buena (si no sirven, null)', () => {
  const r = [];
  for (let i = -12; i <= 12; i++) r.push(i);
  for (const [id, buena] of Object.entries(BUENA)) {
    const fn = ERRORES_TIPICOS[id].fn;
    let sirven = 0;
    const probar = (...args) => {
      if (id === 'signo-del-mayor-cociente' && (args[1] === 0 || args[0] % args[1] !== 0)) return;
      const mal = fn(...args);
      if (mal === null) return;
      sirven++;
      assert.ok(Number.isInteger(mal), `${id}(${args}) = ${mal}`);
      assert.notEqual(mal, limpio(buena(...args)), `${id}(${args})`);
    };
    if (fn.length === 1) r.forEach(a => probar(a));
    else if (/potencia|base|menos-en|signos-antes/.test(id)) r.forEach(b => [0, 1, 2, 3, 4, 5].forEach(n => probar(b, n)));
    else if (fn.length === 3) r.forEach(a => r.forEach(b => r.forEach(c => probar(a, b, c))));
    else r.forEach(a => r.forEach(b => probar(a, b)));
    assert.ok(sirven > 0, `${id} no sirve nunca`);
  }
  // Los que no son de números: comparar, ordenar y las expresiones.
  for (let a = -9; a <= 9; a++) for (let b = -9; b <= 9; b++) {
    const mal = comparaComoNaturales(a, b);
    if (mal !== null) assert.notEqual(mal, a < b ? '<' : '>');
  }
  for (const arbol of arboles(83, 3)) {
    const bien = valorJs(arbol);
    for (const fn of [derechaAIzquierda, sinJerarquia, ignoraElParentesis]) {
      const mal = fn(arbol);
      if (mal !== null) assert.notEqual(mal, bien, `${fn.name}: ${aTexto(arbol)}`);
    }
  }
});

test('ERRORES_TIPICOS: id válido para el registro de fallos, nombre en los dos idiomas y ejemplo sin guion', () => {
  const ids = Object.keys(ERRORES_TIPICOS);
  assert.ok(ids.length >= 20);
  for (const id of ids) {
    const e = ERRORES_TIPICOS[id];
    assert.equal(errorValido(id), id, `${id}: lo admite api.responder({ error })`);
    assert.equal(typeof e.fn, 'function');
    assert.ok(['numeros', 'expresion'].includes(e.entrada));
    assert.ok(e.nombre.es.length > 10 && e.nombre.en.length > 10 && e.nombre.es !== e.nombre.en, id);
    assert.ok(!e.ejemplo.includes(GUION) && !e.nombre.es.includes(GUION) && !e.nombre.en.includes(GUION), id);
    assert.doesNotMatch(e.ejemplo, /×|\(\+/, id);
  }
  assert.equal(new Set(ids.map(id => ERRORES_TIPICOS[id].nombre.es)).size, ids.length, 'nombres distintos');
  assert.ok(Object.keys(BUENA).every(id => ids.includes(id)));
});

test('distractores: sin null, sin la buena y sin repetidos; cada uno con su error', () => {
  const d = distractores([['regla-signos-en-suma', -2, -3], ['olvida-el-signo', -2, -3], ['signo-cambiado', -5], ['signo-del-primero', -2, -3], ['suma-valores-absolutos', -2, -3]], -5);
  assert.deepEqual(d, [{ valor: 5, error: 'regla-signos-en-suma' }]);
  const e = distractores([['signo-del-mayor-producto', 5, -2], ['signo-cambiado', -10], ['base-por-exponente', 5, -2]], -10);
  assert.deepEqual(e.map(x => x.valor), [10]);
  assert.throws(() => distractores([['no-existe', 1]], 0));
});

// --- La recta y el termómetro (parte pura) ---------------------------------------------------

test('recta: marcas, qué marcas llevan número y la marca más cercana a un toque', () => {
  assert.deepEqual(marcas({ min: -10, max: 10 }).length, 21);
  assert.deepEqual(marcas({ min: -30, max: 45, paso: 5 }).slice(0, 3), [-30, -25, -20]);
  assert.throws(() => marcas({ min: 3, max: 3 }));
  const op = { min: -10, max: 10, paso: 1 };
  assert.deepEqual(marcas(op).filter(v => conNumero(v, op)), [-10, -5, 0, 5, 10], 'algunas: 0, extremos y de 5 en 5');
  assert.deepEqual(marcas(op).filter(v => conNumero(v, { ...op, numeros: 'cero' })), [0]);
  assert.equal(marcas(op).filter(v => conNumero(v, { ...op, numeros: 'todas' })).length, 21);
  assert.deepEqual(marcas(op).filter(v => conNumero(v, { ...op, numeros: [-3, 0, 4] })), [-3, 0, 4]);
  assert.deepEqual(marcas({ min: -20, max: 20, paso: 2 }).filter(v => conNumero(v, { min: -20, max: 20, paso: 2 })), [-20, -10, 0, 10, 20]);
  for (const tipo of ['recta', 'termometro']) {
    for (const [min, max, paso] of [[-10, 10, 1], [-20, 20, 1], [-20, 20, 2], [-30, 45, 5], [-5, 20, 1], [-14, 15, 1]]) {
      const o = { tipo, min, max, paso };
      const g = geometria(o);
      const lista = marcas(o);
      for (const v of lista) {
        assert.equal(g.valorEn(g.coord(v)), v);
        assert.equal(marcaMasCercana(g.coord(v) + 0.45 * g.separacion, o), v, `${tipo} ${v}`);
        assert.equal(marcaMasCercana(g.coord(v) - 0.45 * g.separacion, o), v, `${tipo} ${v}`);
      }
      assert.equal(g.valorEn(-1000), tipo === 'recta' ? min : max, 'fuera del dibujo: el extremo');
      assert.equal(g.valorEn(10000), tipo === 'recta' ? max : min);
      if (tipo === 'recta') assert.ok(g.coord(min) >= 0 && g.coord(max) <= ANCHO_RECTA);
      else assert.ok(g.coord(max) < g.coord(min), 'en el termómetro, lo de arriba es mayor');
    }
  }
});

test('recta a 375 px: hasta 21 marcas en horizontal sin números montados; termómetro de 30 marcas', () => {
  const casos = [
    [-10, 10, 1, 'todas'], [-10, 10, 1, 'algunas'], [-20, 20, 2, 'todas'], [-20, 20, 1, 'algunas'], [-30, 45, 5, 'todas'], [-15, 5, 1, 'todas'],
  ];
  for (const [min, max, paso, numeros] of casos) {
    const o = { min, max, paso, numeros };
    const g = geometria(o);
    assert.ok(g.fuente >= 9, 'la letra nunca baja de 9');
    const numerados = marcas(o).filter(v => conNumero(v, o));
    for (const fila of [0, 1]) {
      const enFila = numerados.filter(v => g.filaDe(v) === fila);
      for (let i = 1; i < enFila.length; i++) {
        const hueco = g.coord(enFila[i]) - g.coord(enFila[i - 1]);
        assert.ok(hueco >= (anchoNumero(enFila[i], g.fuente) + anchoNumero(enFila[i - 1], g.fuente)) / 2, `${JSON.stringify(o)}: ${enFila[i - 1]} y ${enFila[i]} se montan`);
      }
    }
    assert.ok(g.alto <= 125);
  }
  assert.equal(geometria({ min: -10, max: 10, numeros: 'algunas' }).filas, 1);
  assert.equal(geometria({ min: -10, max: 10, numeros: 'algunas' }).fuente, 14, 'con pocos números, letra grande aunque haya 21 marcas');
  assert.equal(geometria({ min: -10, max: 10, numeros: 'todas' }).fuente, 14, 'con todos, en dos filas y letra grande, mejor que en una y diminuta');
  assert.equal(geometria({ min: -20, max: 20, paso: 2, numeros: 'todas' }).filas, 2, 'de −20 a 20 de 2 en 2: dos filas');
  const t = geometria({ tipo: 'termometro', min: -14, max: 15 });
  assert.equal(t.n, 30);
  assert.ok(t.separacion === SEPARACION_TERMOMETRO && t.fuente < t.separacion);
  assert.ok(t.alto <= 450, `termómetro de ${t.alto}`);
});
