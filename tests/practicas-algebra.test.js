// Álgebra de la unidad 6 (practicas/_comun/algebra.js, tarea 144): una tabla de casos hechos
// a mano, 3000 casos al azar contra aritmética propia con BigInt, lo que teclea el alumno, la
// escritura y la lectura en los dos idiomas, el método paso a paso, los errores típicos y la
// tabla de traducción.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as A from '../practicas/_comun/algebra.js';
import { fraccion, Fraccion } from '../practicas/_comun/fracciones.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { huella as huellaEquivalentes } from '../practicas/equivalentes/logica.js';

const e = t => { const x = A.deTexto(t, { variasLetras: true }); assert.ok(x, `«${t}» no se lee`); return x; };
const q = t => { const x = A.deEcuacion(t); assert.ok(x, `«${t}» no se lee`); return x; };
const txt = x => (x instanceof Fraccion ? A.terminosATexto([A.termino(x)]) : x.aTexto());

test('álgebra: el modelo es inmutable, reducido, y compara por forma canónica', () => {
  const x = A.lineal(3, 2);
  assert.ok(Object.isFrozen(x) && Object.isFrozen(x.coefs));
  assert.deepEqual([x.a.num, x.b.num, x.letra], [3, 2, 'x']);
  assert.ok(x.equals(e('2 + 3x')), '3x + 2 = 2 + 3x');
  assert.ok(e('x/2').equals(e('½x')) && e('x/2').equals(e('0,5x')) && e('x/2').equals(e('x : 2')), 'x/2 = ½x = 0,5x = x : 2');
  assert.ok(e('3 · x').equals(e('3x')) && e('x · 3').equals(e('3x')) && e('x + x').equals(e('2x')), '3 · x, x · 3 y x + x');
  assert.ok(e('6x/4').equals(e('3x/2')), 'coeficiente irreducible');
  assert.ok(A.expandir(2, 'x + 1').equals('2x + 2'), '2(x + 1) = 2x + 2');
  assert.ok(!e('2x + 3').equals(e('2x + 5')));
  assert.ok(!e('x').equals(e('n')), 'la letra cuenta');
  assert.equal(A.lineal(0, 5).esConstante(), true);
  assert.equal(A.lineal(fraccion(6, 4), 0).a.den, 2, 'el coeficiente se guarda irreducible');
  assert.equal(new A.Lineal({ x: 7, y: 2 }, 0).aTexto(), '7x + 2y');
  assert.equal(e('3y + 4x').clave(), e('4x + 3y').clave());
  assert.ok(A.ecuacion('x + 3', 10).equivalente('2x + 6 = 20'), 'dos ecuaciones con la misma solución');
  assert.ok(!A.ecuacion('x + 3', 10).equivalente('x + 3 = 11'));
  assert.equal(A.huellaCanonica('3 + x = 10'), A.huellaCanonica('x + 3 = 10'), 'la huella es de la forma canónica');
  assert.notEqual(A.huellaCanonica('x + 3 = 10'), A.huellaCanonica('2x + 6 = 20'), 'pero no de la solución');
  for (const s of ['abc', 'x:3|b:2=b:10', 'ñandú']) assert.equal(A.huella(s), huellaEquivalentes(s), 'la misma FNV-1a que equivalentes/logica.js');
});

// Hechos a mano: [entrada, qué se hace, resultado esperado].
const TABLA = [
  ['5x + 2x − 3x', 'reducir', '4x'], ['7x + 2y − 3x + y', 'reducir', '4x + 3y'], ['3x + 2 − x + 5', 'reducir', '2x + 7'],
  ['x + x + x', 'reducir', '3x'], ['4x − 4x + 3', 'reducir', '3'], ['x/2 + x/3', 'reducir', '5x/6'], ['2x − 5 − 2x + 5', 'reducir', '0'],
  ['−x − x', 'reducir', '−2x'], ['3', 'reducir', '3'], ['x/4 + 3x/4', 'reducir', 'x'],
  [[3, 'x − 2'], 'expandir', '3x − 6'], [[-1, 'x − 2'], 'expandir', '−x + 2'], [[-2, '3 − x'], 'expandir', '2x − 6'],
  [[4, '5 − 2x'], 'expandir', '−8x + 20'], [[6, 'x/2 + x/3'], 'expandir', '5x'], [[fraccion(1, 2), '4x − 6'], 'expandir', '2x − 3'],
  [['2x + 3', 4], 'evaluar', '11'], [['3x', 4], 'evaluar', '12'], [['5 − x', -2], 'evaluar', '7'], [['−2x + 1', -3], 'evaluar', '7'],
  [['x/2 + 1', 3], 'evaluar', '5/2'], [['3x − 1', fraccion(1, 3)], 'evaluar', '0'], [['2a + 3b', { a: 2, b: -1 }], 'evaluar', '1'],
  ['x + 3 = 10', 'resolver', '7'], ['x + 9 = 4', 'resolver', '−5'], ['3x = 12', 'resolver', '4'], ['12x = 3', 'resolver', '1/4'],
  ['−2x = 8', 'resolver', '−4'], ['−x = 7', 'resolver', '−7'], ['2x + 5 = 17', 'resolver', '6'], ['5 = 2x + 1', 'resolver', '2'],
  ['3x + 2 = 5x − 6', 'resolver', '4'], ['7x − 3 = 4x + 9', 'resolver', '4'], ['x/2 + x/3 = 5', 'resolver', '6'],
  ['x/7 = 24/7', 'resolver', '24'], ['3x/4 + x/6 = 22', 'resolver', '24'], ['2x + 1 = 2x + 3', 'resolver', 'ninguna'],
  ['3x − 3 = 3x − 3', 'resolver', 'infinitas'], ['4x + 1 = 1', 'resolver', '0'], ['1,2x − 4 = −0,8x', 'resolver', '2'],
  ['6x = 4', 'resolver', '2/3'], ['−21x = 14', 'resolver', '−2/3'],
];

test('álgebra: la tabla hecha a mano (reducir, expandir, evaluar y resolver)', () => {
  assert.ok(TABLA.length >= 40);
  for (const [entrada, op, esperado] of TABLA) {
    let r;
    if (op === 'reducir') r = A.reducir(entrada).resultado.aTexto();
    if (op === 'expandir') r = A.expandir(...entrada).aTexto();
    if (op === 'evaluar') r = txt(e(entrada[0]).evaluar(entrada[1]));
    if (op === 'resolver') { const s = q(entrada).resolver(); r = s instanceof Fraccion ? txt(s) : s.tipo; }
    assert.equal(r, esperado, `${op} ${JSON.stringify(entrada)}`);
  }
});

// ─── Aritmética propia, con BigInt ─────────────────────────────────────────────

const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
const R = (n, d = 1n) => { if (d < 0n) { n = -n; d = -d; } const g = gcd(n, d) || 1n; return [n / g, d / g]; };
const rs = ([a, b], [c, d]) => R(a * d + c * b, b * d);
const rm = ([a, b], [c, d]) => R(a * c, b * d);
const rd = ([a, b], [c, d]) => R(a * d, b * c);
const big = f => R(BigInt(f.num), BigInt(f.den));
const igual = (f, r) => { const [n, d] = big(f); return n === r[0] && d === r[1]; };

test('álgebra: 3000 casos al azar contra BigInt (canónica, evaluar, expandir, reducir, resolver, esSolucion, pasos)', () => {
  const rng = crearRng(20261108);
  const ent = (a, b) => rng.entero(a, b);
  const coef = () => (rng.entero(0, 3) === 0 ? fraccion(ent(-9, 9), ent(1, 6)) : fraccion(ent(-12, 12), 1));
  for (let i = 0; i < 3000; i++) {
    // Reducir una suma de 1 a 6 términos con x, y o número.
    const ts = Array.from({ length: ent(1, 6) }, () => A.termino(coef(), ['x', 'y', null][ent(0, 2)]));
    const suma = { x: R(0n), y: R(0n), b: R(0n) };
    for (const t of ts) suma[t.letra ?? 'b'] = rs(suma[t.letra ?? 'b'], big(t.coef));
    const red = A.reducir(ts).resultado;
    assert.ok(igual(red.coefs.x ?? fraccion(0), suma.x) && igual(red.coefs.y ?? fraccion(0), suma.y) && igual(red.b, suma.b), A.terminosATexto(ts));
    assert.ok(A.deTexto(A.terminosATexto(ts), { variasLetras: true }).equals(red), `se lee lo que se escribe: ${A.terminosATexto(ts)}`);
    // Una expresión de una letra: evaluar y expandir.
    const a = coef(), b = coef(), v = coef(), k = coef();
    const ex = A.lineal(a, b);
    assert.ok(igual(ex.evaluar(v), rs(rm(big(a), big(v)), big(b))));
    const xk = A.expandir(k, ex);
    assert.ok(igual(xk.a, rm(big(k), big(a))) && igual(xk.b, rm(big(k), big(b))));
    assert.ok(A.deTexto(ex.aTexto()).equals(ex), `aTexto → deTexto: ${ex.aTexto()}`);
    // Una ecuación a1·x + b1 = a2·x + b2.
    const [a1, b1, a2, b2] = [coef(), coef(), coef(), coef()];
    const ec = A.ecuacion(A.lineal(a1, b1), A.lineal(a2, b2));
    const den = rs(big(a1), R(-big(a2)[0], big(a2)[1]));
    const num = rs(big(b2), R(-big(b1)[0], big(b1)[1]));
    const s = ec.resolver();
    if (den[0] === 0n) assert.equal(s.tipo, num[0] === 0n ? 'infinitas' : 'ninguna');
    else {
      assert.ok(igual(s, rd(num, den)), ec.aTexto());
      assert.ok(ec.esSolucion(s) && !ec.esSolucion(s.sumar(1)), `esSolucion: ${ec.aTexto()}`);
      const pasos = ec.pasos();
      for (const p of pasos) assert.ok(p.ecuacion.equivalente(ec), `cada paso, equivalente: ${ec.aTexto()} → ${p.ecuacion.aTexto()}`);
      const ultima = pasos.length ? pasos[pasos.length - 1].ecuacion : ec;
      assert.equal(ultima.aTexto(), `x = ${txt(s)}`, `el último paso es la solución: ${ec.aTexto()}`);
    }
  }
});

test('álgebra: los pasos del método, como en el guion', () => {
  const tipos = t => q(t).pasos().map(p => `${p.tipo}: ${p.ecuacion.aTexto()}`);
  assert.deepEqual(tipos('x + 3 = 10'), ['transponer: x = 10 − 3', 'reducir: x = 7']);
  assert.deepEqual(tipos('3x = 12'), ['despejar: x = 4']);
  assert.deepEqual(tipos('3x + 2 = 5x − 6'), ['transponer: 3x − 5x = −6 − 2', 'reducir: −2x = −8', 'despejar: x = 4']);
  assert.deepEqual(tipos('5 = 2x + 1'), ['cambiar-miembros: 2x + 1 = 5', 'transponer: 2x = 5 − 1', 'reducir: 2x = 4', 'despejar: x = 2']);
  assert.deepEqual(tipos('x/2 + x/3 = 5'), ['denominadores: 3x + 2x = 30', 'reducir: 5x = 30', 'despejar: x = 6']);
  assert.deepEqual(tipos('2x + 1 = 2x + 3'), ['transponer: 2x − 2x = 3 − 1', 'reducir: 0x = 2', 'sin-solucion: 0x = 2']);
  assert.deepEqual(tipos('x = 12/8'), ['simplificar: x = 3/2']);
  assert.deepEqual(tipos('x = 5'), []);
  assert.equal(q('x/2 + x/3 = 5').pasos()[0].mcm, 6);
  assert.equal(q('x/2 + 1 = x/3').sinDenominadores().aTexto(), '3x + 6 = 2x');
  assert.equal(q('x/2 + 1 = x/3').sinDenominadores(12).aTexto(), '6x + 12 = 4x', 'por un múltiplo del m.c.m. también vale');
});

// ─── Lo que teclea el alumno ───────────────────────────────────────────────────

test('álgebra: deTexto acepta todas las escrituras y rechaza con un motivo', () => {
  const vale = {
    '2x+3': '2x + 3', '3 + 2x': '2x + 3', '2·x + 3': '2x + 3', '2*x+3': '2x + 3', '2 x + 3': '2x + 3', '2X+3': '2x + 3',
    'x·3': '3x', '-x': '−x', '−x': '−x', '–x': '−x', 'x/2': 'x/2', '3x/4': '3x/4', 'x : 2': 'x/2', '½x': 'x/2', '0,5x': 'x/2',
    '0.5x': 'x/2', '1.5': '3/2', '1,5': '3/2', '6/4': '3/2', '−3/2': '−3/2', 'x - -2': 'x + 2', ' 5 + 2g ': '2g + 5', '1x': 'x', '0x + 4': '4',
    '-2x-6': '−2x − 6', '.5': '1/2',
  };
  for (const [t, esperado] of Object.entries(vale)) assert.equal(A.deTexto(t)?.aTexto(), esperado, t);
  assert.equal(A.deTexto('7x + 2y'), null, 'dos letras: solo con variasLetras');
  assert.equal(A.deTexto('7x + 2y', { variasLetras: true }).aTexto(), '7x + 2y');
  assert.equal(A.deTexto('2n + 1', { letras: 'x' }), null, 'la letra del ejercicio');
  assert.equal(A.deTexto('2n + 1', { letras: ['x', 'n'] }).aTexto(), '2n + 1');
  const motivos = {
    '': 'vacio', '   ': 'vacio', x2: 'x2', '3x2': 'x2', 'x²': 'potencia', 'x^2': 'potencia', 'x·x': 'producto-letras', xx: 'producto-letras',
    '2(x + 1)': 'parentesis', '(x+1)': 'parentesis', '1/2x': 'ambiguo', '3/4x': 'ambiguo', '6/x': 'letra-en-denominador',
    'x/0': 'division-entre-0', '2x = 3': 'ecuacion', '2 3': 'basura', '2x +': 'basura', '+': 'basura', 'x/2.5': 'basura',
    '2,': 'basura', '€': 'basura', '2**x': 'basura', '1,2,3': 'basura', '7x + 2y': 'dos-letras',
  };
  for (const [t, m] of Object.entries(motivos)) {
    const r = A.leerExpresion(t);
    assert.equal(r.ok, false, t);
    assert.equal(r.motivo, m, t);
    assert.ok(r.mensaje.es && r.mensaje.en, `${t}: mensaje en los dos idiomas`);
  }
  for (const m of Object.values(A.MENSAJES)) assert.ok(!/×|\bx2\b(?!,)/.test(m.es.replace('no x2', '')), 'mensajes sin ×');
  assert.equal(A.leerEcuacion('2x + 3').motivo, 'sin-igual');
  assert.equal(A.leerEcuacion('x = 2 = 3').motivo, 'dos-iguales');
  assert.equal(A.leerEcuacion('x + n = 3').motivo, 'dos-letras');
  assert.equal(A.deEcuacion('3 + x = 10').aTexto(), '3 + x = 10', 'la ecuación se guarda tal como se escribe');
  assert.equal(A.leerExpresion('6/4').terminos[0].coef.den, 4, 'los términos guardan la fracción tal como se escribió');
  assert.ok(A.leerExpresion('6/4').valor.equals('3/2'), 'y el valor es el mismo');
  assert.throws(() => A.ecuacion('x', 'y'), /una sola incógnita/);
});

test('álgebra: la escritura (texto y HTML) sigue la notación del acta', () => {
  const casos = [
    [A.lineal(3, 2), '3x + 2'], [A.lineal(1, 0), 'x'], [A.lineal(-1, 0), '−x'], [A.lineal(-1, 5), '−x + 5'], [A.lineal(2, -3), '2x − 3'],
    [A.lineal(fraccion(1, 2), 0), 'x/2'], [A.lineal(fraccion(-3, 4), 1), '−3x/4 + 1'], [A.lineal(0, 0), '0'], [A.lineal(0, -7), '−7'],
    [A.lineal(2, fraccion(1, 3), 'n'), '2n + 1/3'],
  ];
  for (const [x, t] of casos) assert.equal(x.aTexto(), t);
  assert.equal(A.lineal(2, 5, 'g').aTexto('es', { constanteDelante: true }), '5 + 2g');
  assert.equal(A.terminosATexto([A.termino(5, 'x'), A.termino(2, 'x'), A.termino(-3, 'x')]), '5x + 2x − 3x');
  assert.equal(A.lineal(3, -2).aHtml(), '3<i>x</i> − 2');
  assert.equal(A.lineal(fraccion(3, 4), 0).aHtml(), '<span class="frac"><span>3<i>x</i></span><span>4</span></span>');
  assert.equal(A.lineal(fraccion(-1, 2), 0).aHtml(), '−<span class="frac"><span><i>x</i></span><span>2</span></span>');
  assert.equal(q('x/2 + x/3 = 5').aTexto(), 'x/2 + x/3 = 5');
  for (const [x] of casos) assert.ok(!/1x|\+ −|×|·|-/.test(x.aTexto() + x.aHtml()), `${x.aTexto()}: sin 1x, sin + −, sin × ni guion`);
});

test('álgebra: en palabras y lecturas válidas, en los dos idiomas', () => {
  const casos = [
    ['2x + 3', 'two x plus three', 'dos equis más tres'], ['x − 5', 'x minus five', 'equis menos cinco'],
    ['−x + 4', 'minus x plus four', 'menos equis más cuatro'], ['x/2', 'x over two', 'equis partido por dos'],
    ['3x/4 − 1', 'three x over four minus one', 'tres equis partido por cuatro menos uno'], ['2n + 1', 'two n plus one', 'dos ene más uno'],
    ['21x', 'twenty-one x', 'veintiún equis'], ['3/4', 'three quarters', 'tres cuartos'],
  ];
  for (const [t, en, es] of casos) {
    assert.equal(e(t).enPalabras('en'), en, t);
    assert.equal(e(t).enPalabras('es'), es, t);
    assert.ok(e(t).esLecturaValida(en, 'en') && e(t).esLecturaValida(es, 'es'), t);
  }
  const x2 = e('2x');
  for (const l of ['twice x', 'double x', 'two times x', 'Two-x']) assert.ok(x2.esLecturaValida(l, 'en'), l);
  for (const l of ['el doble de equis', 'dos por equis']) assert.ok(x2.esLecturaValida(l, 'es'), l);
  const mitad = e('x/2');
  for (const l of ['half of x', 'x divided by two', 'a half of x']) assert.ok(mitad.esLecturaValida(l, 'en'), l);
  for (const l of ['la mitad de equis', 'equis entre dos']) assert.ok(mitad.esLecturaValida(l, 'es'), l);
  assert.ok(e('2x + 3').esLecturaValida('three plus two x', 'en'), 'otro orden: la misma expresión');
  assert.ok(e('x − 3').esLecturaValida('x take away three', 'en'));
  assert.ok(!e('x − 3').esLecturaValida('three minus x', 'en'), '3 − x no es x − 3');
  assert.ok(!e('2x').esLecturaValida('x plus two', 'en'));
  assert.ok(e('2y').esLecturaValida('dos i griega', 'es') && e('2y').esLecturaValida('dos ye', 'es'), 'ye e i griega');
  const ec = q('2x + 3 = 7');
  assert.equal(ec.enPalabras('en'), 'two x plus three equals seven');
  assert.equal(ec.enPalabras('es'), 'dos equis más tres es igual a siete');
  assert.ok(ec.esLecturaValida('twice x plus three is equal to seven', 'en'));
  // Ninguna lectura de una expresión es lectura de otra distinta (si no, una sería distractor válido).
  const muestras = ['2x', 'x + 2', 'x/2', '2x + 1', '2(x + 1)', 'x − 2', '2 − x', '3x', 'x + 3', 'x/3', '3x/4', '4x/3'].map(s => (s.includes('(') ? A.expandir(2, 'x + 1') : e(s)));
  for (const x of muestras) for (const y of muestras) {
    if (x.equals(y)) continue;
    for (const idioma of ['en', 'es']) {
      const comunes = x.lecturasValidas(idioma).filter(l => y.esLecturaValida(l, idioma));
      assert.deepEqual(comunes, [], `${x.aTexto()} y ${y.aTexto()} (${idioma})`);
    }
  }
});

// ─── Errores típicos ───────────────────────────────────────────────────────────

test('álgebra: cada error típico da lo del ejemplo, y null cuando no sirve', () => {
  const T = (id, ...args) => { const v = A.ERRORES_TIPICOS[id].fn(...args); return v === null ? null : txt(v); };
  assert.equal(T('suma-no-semejantes', '3x + 2'), '5x');
  assert.equal(T('suma-no-semejantes', '3x'), null);
  assert.equal(T('x-por-x-dos-x'), '2x');
  assert.equal(T('yuxtaponer-al-sustituir', '3x', 4), '34');
  assert.equal(T('yuxtaponer-al-sustituir', '3x + 1', 4), '35');
  assert.equal(T('yuxtaponer-al-sustituir', 'x', 4), null, 'con coeficiente 1 no hay nada que pegar');
  assert.equal(T('yuxtaponer-al-sustituir', '3x', -4), null);
  assert.equal(T('signo-al-sustituir', '5 − x', -2), '3');
  assert.equal(T('signo-al-sustituir', '5 − x', 2), null);
  assert.equal(T('jerarquia-al-sustituir', '2 + 3x', 4), '20');
  assert.equal(T('jerarquia-al-sustituir', '3x + 2', 4, { constanteDelante: false }), '18');
  assert.equal(T('por-como-mas', 2), 'x + 2');
  assert.equal(T('mas-como-por', 3), '3x');
  assert.equal(T('entre-como-por', 2), '2x');
  assert.equal(T('entre-como-menos', 2), 'x − 2');
  assert.equal(T('menos-que-al-reves', 3), '−x + 3');
  assert.equal(T('siguiente-y-anterior', 1), 'x − 1');
  assert.equal(T('parentesis-olvidado', 2, 5), '2x + 5');
  assert.equal(T('parentesis-de-mas', 2, 5), '2x + 10');
  assert.equal(T('distribuir-solo-primero', 3, 'x − 2'), '3x − 2');
  assert.equal(T('distribuir-solo-primero', 3, 'x'), null);
  assert.equal(T('signo-solo-primero', -1, 'x − 2'), '−x − 2');
  assert.equal(T('signo-solo-primero', -2, '3 − x'), '−2x − 6');
  assert.equal(T('signo-solo-primero', 2, '3 − x'), null);
  assert.equal(T('multiplicar-solo-la-x', 3, '5 − x'), '−3x + 5');
  assert.equal(T('sumar-antes-del-parentesis', 4, 4, '5 − 2x'), '−16x + 40');
  assert.equal(T('transponer-sin-signo', 'x + 3 = 10'), 'x = 10 + 3');
  assert.equal(T('transponer-sin-signo', '3x = 12'), null, 'nada que pasar');
  assert.equal(T('pasar-factor-restando', '3x = 12'), 'x = 12 − 3');
  assert.equal(T('pasar-factor-restando', 'x = 12'), null);
  assert.equal(T('multiplicar-en-vez-de-dividir', '3x = 12'), 'x = 36');
  assert.equal(T('multiplicar-en-vez-de-dividir', '−x = 7'), null, 'por −1 o entre −1 da lo mismo');
  assert.equal(T('invertir-coeficiente', '12x = 3'), 'x = 4');
  assert.equal(T('invertir-coeficiente', '3x = 3'), null);
  assert.equal(T('signo-al-dividir', '−2x = 8'), 'x = 4');
  assert.equal(T('signo-al-dividir', '2x = 8'), null);
  assert.equal(T('cero-x-como-x', '2x + 1 = 2x + 3'), 'x = 2');
  assert.equal(T('cero-x-como-x', 'x = 3'), null);
  assert.equal(T('mcm-solo-denominadores', 'x/2 + 1 = x/3'), '3x + 1 = 2x');
  assert.equal(T('mcm-solo-denominadores', 'x/2 + x/3 = 5/6'), null, 'si todos tienen denominador no hay error');
  assert.equal(T('olvidar-numerador', '3x/4 = 6'), 'x = 24');
  assert.equal(T('olvidar-numerador', '3x/4 = 6', 12), '3x = 72', 'por 12: 12 : 4 = 3, y no 9');
  assert.equal(T('olvidar-numerador', 'x/4 = 6'), null);
  assert.equal(T('signo-de-la-solucion', 'x + 9 = 4'), 'x = 5');
  assert.equal(T('contestar-x', 7, 10), '7');
  assert.equal(T('contestar-x', 7, 7), null);
});

test('álgebra: ningún error típico da lo mismo que lo bueno (al azar), y todos tienen nombre en los dos idiomas', () => {
  const rng = crearRng(144);
  const ent = (a, b) => rng.entero(a, b);
  for (const [id, err] of Object.entries(A.ERRORES_TIPICOS)) {
    assert.match(id, /^[a-z0-9-]{1,40}$/);
    assert.ok(err.nombre.es && err.nombre.en && err.ejemplo && ['lineal', 'numero', 'ecuacion'].includes(err.devuelve), id);
    assert.ok(!/×/.test(err.ejemplo + err.nombre.es + err.nombre.en), `${id}: sin ×`);
  }
  for (let i = 0; i < 500; i++) {
    const a = ent(-9, 9) || 2, b = ent(-9, 9), c = ent(-9, 9), k = ent(-5, 5) || -2, v = ent(-6, 6), n = ent(1, 9);
    const ex = A.lineal(a, b), ec = A.ecuacion(A.lineal(a, b), A.lineal(c, ent(-20, 20)));
    const chequeos = [
      ['suma-no-semejantes', ex, ex], ['yuxtaponer-al-sustituir', ex, v, ex.evaluar(v)], ['signo-al-sustituir', ex, v, ex.evaluar(v)],
      ['jerarquia-al-sustituir', ex, v, ex.evaluar(v)], ['distribuir-solo-primero', k, ex, A.expandir(k, ex)],
      ['signo-solo-primero', k, ex, A.expandir(k, ex)], ['multiplicar-solo-la-x', k, ex, A.expandir(k, ex)],
      ['sumar-antes-del-parentesis', n, k, ex, A.expandir(k, ex).sumar(n)], ['parentesis-olvidado', k, n, A.expandir(k, A.lineal(1, n))],
      ['parentesis-de-mas', k, n, A.lineal(k, n)], ['menos-que-al-reves', n, A.lineal(1, -n)],
    ];
    for (const [id, ...resto] of chequeos) {
      const bueno = resto.pop();
      const mal = A.ERRORES_TIPICOS[id].fn(...resto);
      if (mal !== null) assert.ok(!A.hayEquivalentes([mal, bueno]), `${id}(${resto.map(String).join(', ')}) da lo bueno`);
    }
    for (const id of ['transponer-sin-signo', 'pasar-factor-restando', 'multiplicar-en-vez-de-dividir', 'invertir-coeficiente', 'signo-al-dividir', 'signo-de-la-solucion', 'mcm-solo-denominadores', 'olvidar-numerador']) {
      const mal = A.ERRORES_TIPICOS[id].fn(ec);
      if (mal !== null) assert.ok(!mal.equivalente(ec), `${id}(${ec.aTexto()}) da la misma solución`);
    }
  }
});

test('álgebra: distractores sin equivalentes entre sí ni con la correcta', () => {
  const d = A.distractores([
    ['transponer-sin-signo', 'x + 3 = 10'], ['signo-de-la-solucion', 'x + 3 = 10'], ['contestar-x', 13, 7],
  ], 7);
  assert.deepEqual(d.map(x => x.error), ['transponer-sin-signo', 'signo-de-la-solucion'], 'x = 13 y 13 son el mismo valor');
  const e2 = A.distractores([['distribuir-solo-primero', -1, 'x − 2'], ['signo-solo-primero', -1, 'x − 2'], ['multiplicar-solo-la-x', -1, 'x − 2']], A.expandir(-1, 'x − 2'));
  assert.deepEqual(e2.map(x => x.error), ['distribuir-solo-primero'], 'los tres dan −x − 2: se queda uno');
  assert.equal(A.distractores([['suma-no-semejantes', '3x']], '3x').length, 0);
  assert.ok(A.hayEquivalentes(['2x + 3', '3 + 2x']));
  assert.ok(A.hayEquivalentes([A.ecuacion('x + 3', 10), A.ecuacion('2x + 6', 20)]));
  assert.ok(A.hayEquivalentes([fraccion(3, 2), '6/4']));
  assert.ok(!A.hayEquivalentes(['2x + 3', '2x + 5', 'x/2']));
  assert.throws(() => A.distractores([['no-existe']], 1), /desconocido/);
  assert.ok(Object.keys(A.NO_ES_ERROR).every(id => !A.ERRORES_TIPICOS[id]), 'lo que no es error no es error típico');
});

// ─── Traducción ────────────────────────────────────────────────────────────────

test('álgebra: FRASES, sin dos entradas con la misma expresión y con distractores que son errores', () => {
  const ids = A.FRASES.map(f => f.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const n of [2, 3, 5, 7, 12]) {
    const exprs = A.FRASES.filter(f => f.expresion(n)).map(f => f.expresion(n));
    assert.ok(!A.hayEquivalentes(exprs), `n = ${n}: dos frases con la misma expresión`);
    for (const f of A.FRASES) {
      assert.ok(f.es(n) && f.en(n) && f.glosa, f.id);
      assert.ok(!/\d/.test(f.es(n) + f.en(n)), `${f.id}: el número va en letra`);
      if (f.expresion(n)) {
        const d = A.distractores(f.errores(n), f.expresion(n));
        assert.ok(d.length >= 1, `${f.id} (n = ${n}): al menos un distractor`);
        assert.ok(!A.hayEquivalentes([f.expresion(n), ...d.map(x => x.valor)]));
      } else {
        const [p1, p2] = f.pareja(n);
        assert.ok(!p1.equals(p2), f.id);
      }
    }
  }
  const doble = A.FRASES.find(f => f.id === 'doble-mas'), suma = A.FRASES.find(f => f.id === 'doble-de-la-suma');
  assert.equal(doble.en(5), 'twice a number, plus five');
  assert.equal(suma.en(5), 'twice the sum of a number and five');
  assert.equal(doble.expresion(5).aTexto(), '2x + 5');
  assert.equal(suma.expresion(5).aTexto(), '2x + 10');
  assert.equal(A.FRASES.find(f => f.id === 'menos-que').expresion(3, 'n').aTexto(), 'n − 3');
});
