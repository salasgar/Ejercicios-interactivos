// Base de la unidad 4 (reparto-practicas-u2, tarea 98): `practicas/_comun/fracciones.js`
// y la parte pura de `practicas/_comun/dibujo-fracciones.js`. La aritmética se prueba
// contra una tabla calculada a mano y contra BigInt en 3000 casos al azar (con productos
// cruzados, nunca con decimales); el evaluador, contra un evaluador BigInt del árbol del
// generador (no del analizador).

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { errorValido } from '../practicas/_comun/registro.js';
import {
  MENOS, Fraccion, fraccion, aFraccion, comparar, comunDenominador, productosCruzados, ordenar,
  aTexto, htmlFraccion, htmlRaya, htmlCuenta, leerFraccion, enPalabras, lecturasValidas, esLecturaValida,
  ordinalIngles, partitivoEspanol, ERRORES_TIPICOS, NO_ES_ERROR, distractores, hayEquivalentes, terminoATermino,
  analizar, evaluar, html, aTextoExpresion, pasosPosibles, aplicarPaso, pasoCanonico, cadenaDePasos, valorLiteral,
  deIzquierdaADerecha, ErrorFracciones,
} from '../practicas/_comun/fracciones.js';
import {
  geometriaFigura, parteEn, figurasPara, indicesSombreados, marcasRecta, conNumeroRecta, geometriaRecta,
  marcaMasCercanaRecta, anchoEtiqueta, ANCHO,
} from '../practicas/_comun/dibujo-fracciones.js';

const N = 3000;
const f = (n, d = 1) => fraccion(n, d);
/** Misma forma exacta (num y den), no solo el valor. */
const forma = (x, n, d) => { assert.equal(x.num, n, `${x} numerador`); assert.equal(x.den, d, `${x} denominador`); };

// --- El modelo ------------------------------------------------------------------------

test('Fraccion: inmutable, denominador positivo, signo arriba, sin simplificar sola; errores con código', () => {
  forma(f(5, -12), -5, 12);
  forma(f(-5, -12), 5, 12);
  forma(f(6, 8), 6, 8);
  forma(f(0, -3), 0, 3);
  assert.ok(Object.is(f(0, -3).num, 0), 'sin −0');
  assert.throws(() => { f(1, 2).num = 3; }, TypeError);
  assert.throws(() => f(1, 0), e => e instanceof ErrorFracciones && e.codigo === 'denominador-0');
  assert.throws(() => f(1.5, 2), e => e.codigo === 'no-entero');
  assert.throws(() => f(0).inversa(), e => e.codigo === 'division-entre-0');
  assert.throws(() => f(1, 2).dividir(0), e => e.codigo === 'division-entre-0');
  assert.throws(() => f(3, 5).de(7), e => e.codigo === 'no-exacta');
  assert.throws(() => aFraccion('x'), e => e.codigo === 'no-es-fraccion');
  forma(aFraccion(3), 3, 1);
  forma(aFraccion('−6/8'), -6, 8);
  forma(aFraccion({ num: 2, den: 4 }), 2, 4);
  assert.equal(String(f(-3, 5)), '−3/5');
  assert.equal(aTexto(f(8, 2)), '8/2');
  assert.equal(aTexto(f(4, 1)), '4');
  assert.equal(aTexto(f(4, 1), { conUno: true }), '4/1');
  assert.equal(aTexto(f(-4, 1)), '−4');
  assert.equal(f(-6, 8).clave(), '−3/4');
});

test('aritmética: 40 casos calculados a mano (las operaciones no simplifican; simplificar sí)', () => {
  const casos = [
    // suma y resta, sobre el m.c.m.
    [f(1, 2).sumar(f(1, 3)), 5, 6], [f(1, 4).sumar(f(2, 3)), 11, 12], [f(3, 7).sumar(f(2, 7)), 5, 7],
    [f(5, 6).sumar(f(3, 8)), 29, 24], [f(5, 12).sumar(f(7, 18)), 29, 36], [f(2).sumar(f(1, 3)), 7, 3],
    [f(-2, 7).sumar(2), 12, 7], [f(1, 4).restar(f(2, 3)), -5, 12], [f(5, 9).restar(f(2, 9)), 3, 9],
    [f(7, 10).restar(f(2, 5)), 3, 10], [f(1).restar(f(3, 8)), 5, 8], [f(3, 10).restar(f(7, 10)), -4, 10],
    // producto
    [f(2, 5).multiplicar(f(3, 4)), 6, 20], [f(3).multiplicar(f(2, 5)), 6, 5], [f(2, 3).multiplicar(f(3, 4)), 6, 12],
    [f(-2, 3).multiplicar(f(3, 4)), -6, 12], [f(4, 9).multiplicar(f(15, 8)), 60, 72],
    // cociente (por la inversa)
    [f(2, 3).dividir(f(4, 5)), 10, 12], [f(6).dividir(f(3, 4)), 24, 3], [f(3, 4).dividir(6), 3, 24],
    [f(8, 3).dividir(f(5, 2)), 16, 15], [f(6, 8).dividir(f(2, 4)), 24, 16], [f(1, 2).dividir(f(-4, 7)), -7, 8],
    // potencias de base positiva
    [f(2, 3).potencia(2), 4, 9], [f(1, 2).potencia(3), 1, 8], [f(3, 2).potencia(2), 9, 4],
    // simplificar
    [f(36, 48).simplificar(), 3, 4], [f(84, 126).simplificar(), 2, 3], [f(-6, 8).simplificar(), -3, 4],
    [f(0, 5).simplificar(), 0, 1], [f(9, 14).simplificar(), 9, 14], [f(5, -12).simplificar(), -5, 12],
    // inversa y opuesta
    [f(3, 5).inversa(), 5, 3], [f(4).inversa(), 1, 4], [f(-3, 4).inversa(), -4, 3], [f(3, 5).opuesta(), -3, 5],
    // un paso de simplificar y ampliar
    [f(36, 48).simplificarPor(2), 18, 24], [f(2, 3).equivalentePor(10), 20, 30],
  ];
  assert.equal(casos.length, 38);
  for (const [x, n, d] of casos) forma(x, n, d);
  // la fracción de una cantidad (2 casos más: 40)
  assert.equal(f(3, 5).de(40), 24);
  assert.equal(f(1, 4).de(36), 9);
  assert.equal(f(36, 48).simplificarPor(5), null);
  assert.deepEqual(f(2, 3).amplificaciones(3).map(String), ['4/6', '6/9']);
});

test('comparar, equivalencia, común denominador y ordenar (con enteros, nunca con decimales)', () => {
  assert.equal(comparar('5/8', '3/8'), 1);
  assert.equal(comparar('3/5', '3/7'), 1);
  assert.equal(comparar('2/3', '3/4'), -1);
  assert.equal(comparar('-3/4', '-2/3'), -1);
  assert.equal(comparar('4/9', '1/2'), -1);
  assert.equal(comparar('21/28', '15/20'), 0);
  assert.ok(f(1, 2).equals('4/8') && !f(1, 2).mismaForma('4/8') && f(1, 2).mismaForma('1/2'));
  assert.deepEqual(productosCruzados('21/28', '15/20'), [420, 420]);
  const cd = comunDenominador('5/6', '3/8');
  assert.equal(cd.mcm, 24);
  assert.deepEqual(cd.fracciones.map(String), ['20/24', '9/24']);
  assert.equal(comunDenominador(['1/2', '2/3', '3/4']).mcm, 12);
  assert.deepEqual(ordenar(['3/4', '5/6', '2/3', '7/12']).map(String), ['7/12', '2/3', '3/4', '5/6']);
  assert.deepEqual(ordenar(['-1/2', '1/3', '0', '-3/4'], { descendente: true }).map(String), ['1/3', '0', '−1/2', '−3/4']);
  assert.ok(f(6, 6).esImpropia() && !f(6, 6).esPropia(), '6/6 es impropia (26-10)');
  assert.ok(f(3, 5).esPropia() && f(7, 4).esImpropia() && f(-3, 5).esPropia());
  assert.ok(f(12, 4).esNatural() && f(12, 4).aEntero() === 3 && !f(3, 5).esEntera() && f(3, 5).aEntero() === null);
  assert.ok(f(-12, 4).esEntera() && !f(-12, 4).esNatural());
  assert.ok(f(9, 14).esIrreducible() && !f(9, 15).esIrreducible() && f(-5, 12).esNegativa());
});

test('aritmética contra BigInt en 3000 casos al azar (también con negativas)', () => {
  const rng = crearRng(4098);
  const big = x => BigInt(x);
  const mismoValor = (r, n, d) => big(r.num) * d === n * big(r.den);
  const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
  for (let i = 0; i < N; i++) {
    const a = f(rng.entero(-60, 60), rng.entero(1, 36)), b = f(rng.entero(-60, 60), rng.entero(1, 36));
    const [an, ad, bn, bd] = [a.num, a.den, b.num, b.den].map(big);
    assert.ok(mismoValor(a.sumar(b), an * bd + bn * ad, ad * bd), `${a} + ${b}`);
    assert.ok(mismoValor(a.restar(b), an * bd - bn * ad, ad * bd), `${a} − ${b}`);
    assert.ok(mismoValor(a.multiplicar(b), an * bn, ad * bd), `${a} · ${b}`);
    // la suma y la resta van sobre el m.c.m. de los denominadores
    assert.equal(big(a.sumar(b).den), ad * bd / gcd(ad, bd));
    if (b.num !== 0) assert.ok(mismoValor(a.dividir(b), an * bd, ad * bn), `${a} : ${b}`);
    const c = an * bd - bn * ad;
    assert.equal(comparar(a, b), c > 0n ? 1 : c < 0n ? -1 : 0, `comparar ${a} y ${b}`);
    assert.equal(a.equals(b), c === 0n);
    const s = a.simplificar();
    assert.ok(s.equals(a) && s.den > 0 && gcd(big(s.num), big(s.den)) === 1n, `simplificar ${a}`);
    assert.equal(Math.sign(s.num), Math.sign(a.num), 'conserva el signo');
    if (a.num > 0) {
      const p = rng.entero(2, 3);
      assert.ok(mismoValor(a.potencia(p), an ** big(p), ad ** big(p)));
    }
    // equals es por valor: una ampliada es igual
    assert.ok(a.equivalentePor(rng.entero(2, 9)).equals(a));
  }
});

// --- Escritura y lectura ---------------------------------------------------------------

test('htmlFraccion, htmlRaya y htmlCuenta: raya horizontal, el menos (U+2212) delante y paréntesis tras una operación', () => {
  assert.equal(MENOS.codePointAt(0), 0x2212);
  assert.equal(htmlFraccion('3/5'), '<span class="frac"><span>3</span><span>5</span></span>');
  assert.equal(htmlFraccion(4), '4');
  assert.equal(htmlFraccion('4/1', { conUno: true }), '<span class="frac"><span>4</span><span>1</span></span>');
  assert.equal(htmlFraccion('-3/5'), '<span class="frac-neg">−<span class="frac"><span>3</span><span>5</span></span></span>');
  assert.equal(htmlFraccion('5/(-12)', { parentesis: true }), '(<span class="frac-neg">−<span class="frac"><span>5</span><span>12</span></span></span>)');
  assert.equal(htmlFraccion('6/8', { compacta: true }), '<span class="frac frac--compacta"><span>6</span><span>8</span></span>');
  assert.equal(htmlRaya('□', 20), '<span class="frac"><span>□</span><span>20</span></span>');
  const c = htmlCuenta(['1/2', '·', '-3/4', '=', '-3/8']);
  assert.ok(c.includes('· (<span class="frac-neg">'), 'negativa tras una operación: entre paréntesis');
  assert.ok(c.includes('= <span class="frac-neg">'), 'tras el igual: sin paréntesis');
  assert.ok(htmlCuenta(['-3/4', '<', '-2/3']).includes('&lt; <span class="frac-neg">'), 'tras < : sin paréntesis');
  assert.ok(htmlCuenta(['(', '1/2', '+', '1/3', ')']).includes('(<span class="frac">'), 'pegado al paréntesis');
  assert.ok(htmlCuenta(['3/5', '=', htmlRaya('□', 20)]).includes('<span>□</span>'), 'un texto que no es fracción va tal cual');
  const sinEtiquetas = s => s.replace(/<[^>]*>/g, '');
  for (const s of [htmlFraccion('-7/9'), htmlCuenta(['2', '-', '1/3']), htmlCuenta(['-1/2', '−', '-1/3'])]) {
    assert.ok(!sinEtiquetas(s).includes('-') && sinEtiquetas(s).includes('−'), `nunca el guion como menos: ${sinEtiquetas(s)}`);
  }
});

test('leerFraccion: las escrituras que valen, las tres de una negativa, y lo que no', () => {
  const bien = {
    '3/5': [3, 5], ' 3 / 5 ': [3, 5], '3⁄5': [3, 5], '3∕5': [3, 5], '4': [4, 1], '+4/6': [4, 6], '6/8': [6, 8],
    '-5/12': [-5, 12], '−5/12': [-5, 12], '–5/12': [-5, 12], '(-5)/12': [-5, 12], '(−5)/12': [-5, 12],
    '5/(-12)': [-5, 12], '5/(−12)': [-5, 12], '(−5/12)': [-5, 12], '-5/-12': [5, 12], '0/7': [0, 7], '-3': [-3, 1],
  };
  for (const [t, [n, d]] of Object.entries(bien)) forma(leerFraccion(t), n, d);
  for (const t of ['', '   ', 'abc', '3/0', '0,5', '0.5', '3/5/7', '3//5', '/5', '3/', '--3/5', '3 5', '3:5', '3÷5', 'x/5', '1e3/2', null, undefined]) {
    assert.equal(leerFraccion(t), null, `«${t}» no es una fracción`);
  }
  assert.ok(leerFraccion('-5/12').equals(leerFraccion('5/(-12)')) && leerFraccion('(−5)/12').equals('-5/12'), 'las tres escrituras, el mismo número');
});

test('enPalabras y lecturasValidas: ordinales, a half y a quarter, las parejas válidas y las negativas', () => {
  const en = { '1/2': 'a half', '3/2': 'three halves', '1/4': 'a quarter', '3/4': 'three quarters', '1/3': 'one third',
    '2/3': 'two thirds', '3/5': 'three fifths', '5/8': 'five eighths', '5/12': 'five twelfths', '7/9': 'seven ninths',
    '21/40': 'twenty-one fortieths', '1/100': 'one hundredth', '-3/5': 'minus three fifths', '6/1': 'six' };
  for (const [x, l] of Object.entries(en)) assert.equal(enPalabras(x, 'en'), l, x);
  const es = { '1/2': 'un medio', '3/2': 'tres medios', '1/3': 'un tercio', '3/4': 'tres cuartos', '3/5': 'tres quintos',
    '7/10': 'siete décimos', '7/12': 'siete doceavos', '1/11': 'un onceavo', '21/5': 'veintiún quintos', '5/16': 'cinco dieciseisavos',
    '3/20': 'tres veinteavos', '1/21': 'un veintiunavo', '2/31': 'dos treintaiunavos', '1/30': 'un treintavo',
    '-3/5': 'menos tres quintos', '3/101': 'tres partido por ciento uno' };
  for (const [x, l] of Object.entries(es)) assert.equal(enPalabras(x, 'es'), l, x);
  // Las parejas válidas están las dos: nunca pueden ser distractor la una de la otra.
  const parejas = [['1/2', 'a half', 'one half'], ['1/4', 'a quarter', 'one fourth'], ['3/4', 'three quarters', 'three fourths'],
    ['1/3', 'one third', 'a third'], ['3/5', 'three fifths', 'three over five'], ['-3/5', 'minus three fifths', 'negative three fifths']];
  for (const [x, a, b] of parejas) assert.ok(lecturasValidas(x).includes(a) && lecturasValidas(x).includes(b), `${a} / ${b}`);
  for (const [x, a, b] of [['1/2', 'un medio', 'la mitad'], ['5/12', 'cinco doceavos', 'cinco dozavos'], ['1/11', 'un onceavo', 'un onzavo']]) {
    assert.ok(lecturasValidas(x, 'es').includes(a) && lecturasValidas(x, 'es').includes(b), `${a} / ${b}`);
  }
  // Los distractores típicos de la ficha 99 no son lecturas válidas.
  for (const mala of ['three fives', 'five thirds', 'third fives', 'three fifth']) assert.ok(!esLecturaValida('3/5', mala), mala);
  assert.ok(esLecturaValida('3/5', 'Three-Fifths') && esLecturaValida('3/4', ' three  fourths '), 'sin mayúsculas, guiones ni espacios de más');
  assert.ok(esLecturaValida('7/10', 'siete decimos', 'es'), 'sin tildes');
  // La lectura es la de lo escrito, no la de la irreducible.
  assert.equal(enPalabras('2/4'), 'two quarters');
  assert.equal(ordinalIngles(21), 'twenty-first');
  assert.equal(ordinalIngles(12), 'twelfth');
  assert.equal(partitivoEspanol(100), 'centésimo');
  assert.equal(partitivoEspanol(150), null);
});

// --- Errores típicos ------------------------------------------------------------------

// Qué valdría la cuenta bien hecha para cada error, con los mismos argumentos.
const BIEN = {
  'suma-arriba-y-abajo': (a, b) => F(a).sumar(b), 'resta-arriba-y-abajo': (a, b) => F(a).restar(b),
  'en-cruz-al-sumar': (a, b) => F(a).sumar(b), 'suma-solo-cambia-denominador': (a, b, op) => (op === '-' ? F(a).restar(b) : F(a).sumar(b)),
  'natural-al-numerador': (n, b, op) => (op === '-' ? F(n).restar(b) : F(n).sumar(b)), 'suma-multiplicando-denominadores': (a, b) => F(a).sumar(b),
  'signo-perdido': r => F(r), 'signo-del-primero': (a, b, op) => (op === '-' ? F(a).restar(b) : F(a).sumar(b)),
  'simplifica-solo-numerador': x => F(x), 'simplifica-solo-denominador': x => F(x), 'amplia-solo-numerador': x => F(x),
  'amplia-solo-denominador': x => F(x), 'suma-mismo-numero': x => F(x),
  'hueco-sumando': (x, c, cual) => (cual === 'den' ? F(x).num * c / F(x).den : F(x).den * c / F(x).num),
  'signo-perdido-al-simplificar': x => F(x), 'fraccion-de-al-reves': (x, n) => F(x).multiplicar(n),
  'se-queda-en-la-unitaria': (x, n) => F(x).multiplicar(n), 'multiplica-por-el-denominador': (x, n) => F(x).multiplicar(n),
  'fraccion-del-dato': (x, d) => F(d).dividir(x), 'parte-entre-el-resto': (p, t) => f(p, t),
  'del-resto-como-del-total': (a, b) => F(a).sumar(F(b).multiplicar(F(1).restar(a))),
  'gastado-como-queda': (...ps) => ps.reduce((s, p) => s.restar(p), F(1)),
  'compara-solo-numeradores': (a, b) => comparar(a, b), 'compara-solo-denominadores': (a, b) => comparar(a, b), 'ignora-el-signo': (a, b) => comparar(a, b),
  'contar-marcas': x => F(x), 'contar-desde-menos-uno': x => F(x),
  'producto-denominador-comun': (a, b) => F(a).multiplicar(b), 'natural-por-ambos': (n, b) => F(b).multiplicar(n),
  'multiplica-en-cruz': (a, b) => F(a).multiplicar(b), 'multiplica-sumando-denominadores': (a, b) => F(a).multiplicar(b),
  'suma-en-vez-de-multiplicar': (a, b) => F(a).multiplicar(b), 'inversa-como-opuesta': x => F(x).inversa(), 'inversa-del-natural': n => F(n).inversa(),
  'invierte-la-primera': (a, b) => F(a).dividir(b), 'no-invierte': (a, b) => F(a).dividir(b), 'invierte-las-dos': (a, b) => F(a).dividir(b),
  'eleva-solo-el-numerador': (x, n) => F(x).potencia(n), 'base-por-exponente': (x, n) => F(x).potencia(n),
  'izquierda-a-derecha': x => evaluar(x),
};
const F = aFraccion;

// Argumentos al azar para cada error (los de la unidad: denominadores de 2 a 12, alguna negativa).
function argumentos(id, rng) {
  const fr = (neg = true) => f((neg && rng.azar() < 0.25 ? -1 : 1) * rng.entero(1, 12), rng.entero(2, 12));
  const pos = () => fr(false);
  switch (id) {
    case 'suma-solo-cambia-denominador': case 'signo-del-primero': return [fr(), fr(), rng.elegir(['+', '-'])];
    case 'natural-al-numerador': return [rng.entero(1, 5), pos(), rng.elegir(['+', '-'])];
    case 'signo-perdido': case 'signo-perdido-al-simplificar': case 'contar-marcas': case 'inversa-como-opuesta': return [fr()];
    case 'contar-desde-menos-uno': { const d = rng.entero(2, 12); return [f(-rng.entero(1, d - 1), d)]; }
    case 'simplifica-solo-numerador': case 'simplifica-solo-denominador': { const k = rng.entero(2, 5); return [f(k * rng.entero(1, 9), k * rng.entero(1, 9)), k]; }
    case 'amplia-solo-numerador': case 'amplia-solo-denominador': case 'suma-mismo-numero': return [pos(), rng.entero(1, 6)];
    case 'hueco-sumando': { const x = pos(); return [x, x.den * rng.entero(2, 6), 'den']; }
    case 'fraccion-de-al-reves': case 'se-queda-en-la-unitaria': case 'multiplica-por-el-denominador': { const x = pos(); return [x, x.den * rng.entero(1, 10)]; }
    case 'fraccion-del-dato': { const x = pos(); return [x, x.num * rng.entero(1, 10)]; }
    case 'parte-entre-el-resto': { const t = rng.entero(12, 36); return [rng.entero(1, t), t]; }
    case 'del-resto-como-del-total': case 'gastado-como-queda': return [f(1, rng.entero(2, 6)), f(1, rng.entero(2, 6))];
    case 'natural-por-ambos': return [rng.entero(1, 6), pos()];
    case 'inversa-del-natural': return [rng.entero(-6, 9)];
    case 'eleva-solo-el-numerador': case 'base-por-exponente': return [pos(), rng.entero(2, 3)];
    case 'izquierda-a-derecha': return [rng.elegir(['1/2 + 1/3 · 3/4', '2 − 1/3 : (1/2 + 1/6)', '3/4 · 2/3 + 1/6', '1/2 · 1/3 · 3/4', '5/6 − 1/4 : 3/8'])];
    case 'producto-denominador-comun': { const d = rng.entero(2, 12); return [f(rng.entero(1, 12), d), rng.azar() < 0.8 ? f(rng.entero(1, 12), d) : pos()]; }
    default: return [fr(), fr()];
  }
}

test('errores típicos: id válido para api.responder, nombre en los dos idiomas, y nunca dan lo mismo que la cuenta buena', () => {
  assert.deepEqual(Object.keys(BIEN).sort(), Object.keys(ERRORES_TIPICOS).filter(id => id !== 'simplifica-a-medias').sort(),
    'cada error tiene su comprobación en este test');
  const rng = crearRng(26);
  for (const [id, e] of Object.entries(ERRORES_TIPICOS)) {
    assert.equal(errorValido(id), id, `${id}: lo admite api.responder({ error })`);
    assert.ok(e.nombre.es && e.nombre.en && e.ejemplo && typeof e.fn === 'function', id);
    assert.ok(['fraccion', 'entero', 'comparacion'].includes(e.devuelve), id);
    assert.ok(!/×/.test(e.nombre.es + e.nombre.en + e.ejemplo) && !/(^|\s)-\d/.test(e.ejemplo), `${id}: · y −`);
    if (id === 'simplifica-a-medias') continue;
    let usados = 0;
    for (let i = 0; i < 400; i++) {
      const args = argumentos(id, rng);
      const mal = e.fn(...args);
      if (mal === null) continue;
      usados++;
      const bien = BIEN[id](...args);
      if (e.devuelve === 'comparacion') assert.notEqual(mal, bien, `${id}(${args.join(', ')})`);
      else assert.ok(!F(mal).equals(bien), `${id}(${args.join(', ')}) = ${mal}, igual que la buena`);
    }
    assert.ok(usados > 20, `${id}: sirve en bastantes ítems (${usados} de 400)`);
  }
});

test('errores típicos: los ejemplos del inventario, y los casos en que no sirven (null)', () => {
  const v = (id, ...a) => ERRORES_TIPICOS[id].fn(...a);
  const igual = (x, t) => assert.ok(x !== null && F(x).mismaForma(t), `${x} ≠ ${t}`);
  igual(v('suma-arriba-y-abajo', '1/2', '1/3'), '2/5');
  igual(v('suma-arriba-y-abajo', '3/7', '2/7'), '5/14');
  igual(v('suma-arriba-y-abajo', 2, '1/3'), '3/4');
  igual(v('en-cruz-al-sumar', '1/4', '2/3'), '3/8');
  igual(v('suma-solo-cambia-denominador', '1/4', '2/3'), '3/12');
  igual(v('natural-al-numerador', 2, '1/3'), '3/3');
  igual(v('natural-al-numerador', 1, '3/8', '-'), '2/8');
  igual(v('signo-perdido', f(1, 4).restar('2/3')), '5/12');
  assert.equal(v('signo-perdido', '5/12'), null);
  igual(v('signo-del-primero', '-2/7', 2), '-12/7');
  igual(v('simplifica-solo-numerador', '12/18', 2), '6/18');
  igual(v('suma-mismo-numero', '2/3', 1), '3/4');
  assert.equal(v('hueco-sumando', '3/5', 20), 18);
  igual(v('simplifica-a-medias', '36/48'), '18/24');
  igual(v('simplifica-a-medias', '84/126', 2), '42/63');
  igual(v('simplifica-a-medias', '36/48', 3), '12/16');
  assert.equal(v('simplifica-a-medias', '6/9'), null, 'm.c.d. primo: no hay mitad de camino');
  igual(v('signo-perdido-al-simplificar', '-6/8'), '3/4');
  igual(v('fraccion-de-al-reves', '3/5', 40), '200/3');
  igual(v('se-queda-en-la-unitaria', '3/5', 40), '40/5');
  igual(v('multiplica-por-el-denominador', '1/4', 36), '144');
  igual(v('fraccion-del-dato', '3/5', 15), '45/5');
  igual(v('parte-entre-el-resto', 8, 20), '8/12');
  igual(v('del-resto-como-del-total', '1/3', '1/4'), '7/12');
  assert.equal(v('compara-solo-denominadores', '3/7', '3/5'), 1);
  assert.equal(v('compara-solo-numeradores', '1/3', '2/5'), null, 'acierta por casualidad: no sirve');
  assert.equal(v('ignora-el-signo', '-3/4', '-2/3'), 1);
  igual(v('contar-marcas', '3/4'), '2/4');
  igual(v('contar-marcas', '-3/4'), '-2/4');
  igual(v('contar-desde-menos-uno', '-3/4'), '-1/4');
  igual(v('producto-denominador-comun', '2/5', '3/5'), '6/5');
  assert.equal(v('producto-denominador-comun', '2/5', '3/4'), null);
  igual(v('natural-por-ambos', 3, '2/5'), '6/15');
  igual(v('inversa-como-opuesta', '3/5'), '-3/5');
  igual(v('inversa-del-natural', 3), '3/1');
  igual(v('invierte-la-primera', '2/3', '4/5'), '12/10');
  igual(v('no-invierte', '2/3', '4/5'), '8/15');
  assert.equal(v('no-invierte', '2/3', 1), null);
  igual(v('eleva-solo-el-numerador', '2/3', 2), '4/3');
  igual(v('base-por-exponente', '2/3', 2), '4/6');
  igual(v('izquierda-a-derecha', '1/2 + 1/3 · 3/4'), '5/8');
  igual(v('izquierda-a-derecha', '2 − 1/3 : (1/2 + 1/6)'), '5/2');
  assert.equal(v('izquierda-a-derecha', '1/2 + 1/3'), null);
  // Lo que no es un error.
  forma(terminoATermino('6/8', '2/4'), 3, 2);
  assert.equal(terminoATermino('2/3', '4/5'), null);
  assert.ok(terminoATermino('6/8', '2/4').equals(f(6, 8).dividir('2/4')), 'da lo mismo que dividir: por eso no es un error');
  for (const n of Object.values(NO_ES_ERROR)) assert.ok(n.es && n.en);
});

test('distractores: sin null, sin la correcta y sin dos equivalentes (salvo por forma en 1C-13/1C-14)', () => {
  const d = distractores([
    ['suma-arriba-y-abajo', '1/4', '2/3'], ['en-cruz-al-sumar', '1/4', '2/3'],
    ['suma-solo-cambia-denominador', '1/4', '2/3'], ['suma-multiplicando-denominadores', '1/4', '2/3'], ['signo-perdido', '11/12'],
  ], f(11, 12));
  assert.deepEqual(d.map(x => [String(x.valor), x.error]), [['3/7', 'suma-arriba-y-abajo'], ['3/8', 'en-cruz-al-sumar'],
    ['3/12', 'suma-solo-cambia-denominador']], '3/12 y 3/12 (la de multiplicar denominadores) valen lo mismo: se queda una');
  // 2/4 equivale a 1/2: no puede ser distractor de 1/2.
  assert.deepEqual(distractores([['amplia-solo-numerador', '1/4', 2]], f(1, 2)), []);
  // Por forma (solo «la fracción irreducible» de 1C-13 y 1C-14): la equivalente a medio simplificar sí entra.
  const medias = distractores([['simplifica-a-medias', '84/126', 2]], f(2, 3), { porForma: true });
  assert.deepEqual(medias.map(x => String(x.valor)), ['42/63']);
  assert.deepEqual(distractores([['simplifica-a-medias', '84/126', 2]], f(2, 3)), [], 'por valor, no');
  assert.throws(() => distractores([['no-existe']], f(1)), /desconocido/);
  assert.ok(hayEquivalentes(['1/2', '3/4', '2/4']) && !hayEquivalentes(['1/2', '-1/2', '2/3']));
  // Al azar: nunca dos que valgan lo mismo.
  const rng = crearRng(7);
  for (let i = 0; i < N; i++) {
    const a = f(rng.entero(1, 9), rng.entero(2, 12)), b = f(rng.entero(1, 9), rng.entero(2, 12));
    const bien = a.sumar(b);
    const ds = distractores([['suma-arriba-y-abajo', a, b], ['en-cruz-al-sumar', a, b], ['suma-solo-cambia-denominador', a, b],
      ['suma-multiplicando-denominadores', a, b], ['multiplica-en-cruz', a, b]], bien);
    assert.ok(!hayEquivalentes([bien, ...ds.map(x => x.valor)]), `${a} + ${b}`);
  }
});

// --- Expresiones ----------------------------------------------------------------------

test('evaluador: los ejemplos del inventario, la jerarquía, las negativas y las potencias', () => {
  const casos = {
    '1/2 + 1/3 · 3/4': '3/4', '2 - 1/3 : (1/2 + 1/6)': '3/2', '1 + 1/2 : (−4/7 + 2)': '27/20',
    '5/12 + 7/18 − 2/9': '7/12', '(2/3)^2': '4/9', '(1/2)³': '1/8', '−2/3 · 3/4': '−1/2', '2/3 : 4/5': '5/6',
    '6 : 3/4': '8', '3/4 : 6': '1/8', '1/4 − 2/3': '−5/12', '−2/7 + 2': '12/7', '[1 − (1/2 + 1/4)] · 4': '1',
    '1/2 · (−4/7)': '−2/7', '10 · 8 : 4': '20', '6/8': '3/4',
  };
  for (const [e, r] of Object.entries(casos)) forma(evaluar(e), F(r).num, F(r).den);
  assert.throws(() => evaluar('1/2 : (1/3 − 1/3)'), e => e.codigo === 'division-entre-0');
  assert.throws(() => evaluar('1/0 + 1'), e => e.codigo === 'denominador-0');
  for (const malo of ['1/2 +', '(1/2', '1/2 / 3', '1/(2)', '1/2 ? 3', '2^']) assert.throws(() => analizar(malo), e => e.codigo === 'sintaxis', malo);
  // El árbol conserva lo escrito: 6/8 se queda 6/8.
  assert.equal(aTextoExpresion('6/8 + 1/4'), '6/8 + 1/4');
  assert.equal(aTextoExpresion('(2/3)^2 · 3'), '(2/3)² · 3');
  assert.equal(aTextoExpresion('1/2 · (−3/4)'), '1/2 · (−3/4)');
  assert.equal(aTextoExpresion('1/2 - 1/3 : 1/4'), '1/2 − 1/3 : 1/4');
  assert.ok(html('1/2 : 1/3', { dividir: '÷' }).includes('÷'));
  assert.ok(html('1/2 + 1/3 · 3/4', { marcarOperadores: true }).includes('<span class="frac-op" data-ruta="der">·</span>'));
  assert.ok(!html('-2/3 · 3/4 - 1').replace(/<[^>]*>/g, '').includes('-'), 'el menos es U+2212');
});

test('paso a paso: lo independiente vale; en una cadena, solo si no cambia el valor; el paso canónico', () => {
  const ops = e => pasosPosibles(e).map(p => p.operacion);
  assert.deepEqual(ops('1/2 + 1/3 · 3/4'), ['1/3 · 3/4']);
  assert.deepEqual(ops('3/4 · 2 + 1/2 · 4'), ['3/4 · 2', '1/2 · 4'], 'dos productos independientes');
  assert.deepEqual(ops('1/2 − 1/4 + 1/8'), ['1/2 − 1/4'], 'adelantar 1/4 + 1/8 cambia el valor');
  assert.deepEqual(ops('10 · 8 : 4'), ['10 · 8', '8 : 4'], 'adelantar 8 : 4 no lo cambia');
  assert.deepEqual(pasosPosibles('10 · 8 : 4', { cadenas: false }).map(p => p.operacion), ['10 · 8']);
  assert.deepEqual(ops('2 − 1/3 : (1/2 + 1/6)'), ['1/2 + 1/6']);
  assert.deepEqual(ops('(2/3)^2 + 1/9'), ['(2/3)²']);
  const p = pasosPosibles('1/2 + 1/3 · 3/4')[0];
  forma(p.valor, 1, 4);
  forma(p.sinSimplificar, 3, 12);
  assert.equal(aTextoExpresion(aplicarPaso('1/2 + 1/3 · 3/4', 0)), '1/2 + 1/4');
  assert.equal(aTextoExpresion(aplicarPaso('10 · 8 : 4', 1)), '10 · 2');
  assert.equal(aTextoExpresion(aplicarPaso('1 + 1/2 : (−4/7 + 2)', 0)), '1 + 1/2 : 10/7');
  assert.equal(aTextoExpresion(aplicarPaso('1/2 · (1/4 − 3/4)', 0)), '1/2 · (−1/2)', 'un negativo que no va el primero, entre paréntesis');
  assert.equal(pasoCanonico('3/4 · 2 + 1/2 · 4').operacion, '3/4 · 2');
  assert.deepEqual(cadenaDePasos('2 - 1/3 : (1/2 + 1/6)').map(s => aTextoExpresion(s.arbol)), ['2 − 1/3 : (1/2 + 1/6)', '2 − 1/3 : 2/3', '2 − 1/2', '3/2']);
  assert.ok(valorLiteral(analizar('(−3/4)')).equals('-3/4') && valorLiteral(analizar('1/2 + 1')) === null);
});

test('evaluador y paso a paso contra BigInt en 3000 expresiones al azar', () => {
  const rng = crearRng(1412);
  const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
  const red = ([n, d]) => { if (d < 0n) { n = -n; d = -d; } const g = gcd(n, d) || 1n; return [n / g, d / g]; };
  const OPS = ['+', '-', '*', ':'];
  // Árbol del generador: { v: [n, d] } o { op, a, b }. Texto con paréntesis explícitos alrededor de cada operación.
  function generar(prof) {
    if (prof === 0 || rng.azar() < 0.3) {
      const n = rng.entero(0, 9), d = rng.azar() < 0.3 ? 1 : rng.entero(2, 9);
      const neg = rng.azar() < 0.2 && n > 0;
      return { v: [BigInt(neg ? -n : n), BigInt(d)], t: neg ? `(−${n}${d === 1 ? '' : `/${d}`})` : `${n}${d === 1 ? '' : `/${d}`}` };
    }
    const a = generar(prof - 1), b = generar(prof - 1), op = rng.elegir(OPS);
    return { op, a, b, t: `(${a.t} ${{ '+': '+', '-': '−', '*': '·', ':': ':' }[op]} ${b.t})` };
  }
  function valor(x) {
    if (x.v) return red(x.v);
    const [an, ad] = valor(x.a), [bn, bd] = valor(x.b);
    if (x.op === '+') return red([an * bd + bn * ad, ad * bd]);
    if (x.op === '-') return red([an * bd - bn * ad, ad * bd]);
    if (x.op === '*') return red([an * bn, ad * bd]);
    if (bn === 0n) return null;
    return red([an * bd, ad * bn]);
  }
  const conCero = x => (x.v ? false : conCero(x.a) || conCero(x.b) || (x.op === ':' && valor(x.b)?.[0] === 0n) || valor(x.a) === null || valor(x.b) === null);
  let probadas = 0;
  for (let i = 0; i < N; i++) {
    const g = generar(3);
    if (conCero(g)) { assert.throws(() => evaluar(g.t), e => e.codigo === 'division-entre-0'); continue; }
    const [n, d] = valor(g);
    const r = evaluar(g.t);
    assert.ok(BigInt(r.num) === n && BigInt(r.den) === d, `${g.t} = ${n}/${d}, no ${r}`);
    // Hacer siempre el paso canónico llega al mismo valor; también cualquier paso posible al azar.
    const estados = cadenaDePasos(g.t);
    assert.ok(valorLiteral(estados.at(-1).arbol).equals(r), g.t);
    let arbol = analizar(g.t);
    for (let k = 0; k < 50 && valorLiteral(arbol) === null; k++) arbol = aplicarPaso(arbol, rng.elegir(pasosPosibles(arbol)));
    assert.ok(valorLiteral(arbol).equals(r), `${g.t}, pasos al azar`);
    // El texto se vuelve a leer igual.
    assert.ok(evaluar(aTextoExpresion(g.t)).equals(r));
    probadas++;
  }
  assert.ok(probadas > N / 2);
  // Al azar, sin paréntesis, la jerarquía y «de izquierda a derecha» se distinguen.
  assert.ok(deIzquierdaADerecha('1/2 + 1/2 · 1/2') !== null);
});

// --- Dibujos (parte pura) -------------------------------------------------------------

test('figuras: barras de hasta 12 partes a 375 px, pizzas y cuadrículas; cada toque cae en su parte', () => {
  assert.equal(figurasPara(7, 4), 2);
  assert.equal(figurasPara(0, 4), 1);
  assert.deepEqual(indicesSombreados(3, 8), [0, 1, 2]);
  assert.deepEqual(indicesSombreados([5, 0, 5, 9], 8), [0, 5]);
  for (const tipo of ['barra', 'pizza']) {
    for (let n = 1; n <= 12; n++) {
      for (const figuras of [1, 2, 3]) {
        const geo = geometriaFigura({ tipo, partes: n, figuras });
        assert.equal(geo.partes.length, n * figuras);
        assert.ok(geo.ancho === ANCHO && geo.alto > 0);
        for (const p of geo.partes) {
          // El centro de cada parte (el punto medio del rectángulo o del sector) es de esa parte.
          const [x, y] = p.d
            ? [p.cx + 0.6 * p.r * Math.sin((p.a0 + p.a1) / 2), p.cy - 0.6 * p.r * Math.cos((p.a0 + p.a1) / 2)]
            : [p.x + p.w / 2, p.y + p.h / 2];
          assert.equal(parteEn(x, y, geo), p.i, `${tipo} ${n}×${figuras}, parte ${p.i}`);
          assert.ok(x >= 0 && x <= ANCHO && y >= 0 && y <= geo.alto, 'dentro del dibujo');
        }
        if (tipo === 'barra') assert.ok(geo.partes[0].w >= 28, 'una parte de una barra de 12 mide al menos 28 unidades');
      }
    }
  }
  assert.equal(parteEn(1, 1, { tipo: 'pizza', partes: 4 }), null, 'fuera de la pizza');
  const cuad = geometriaFigura({ tipo: 'cuadricula', filas: 3, columnas: 4, figuras: 2 });
  assert.equal(cuad.partes.length, 24);
  for (const p of cuad.partes) {
    assert.equal(parteEn(p.x + p.w / 2, p.y + p.h / 2, cuad), p.i);
    assert.ok(p.x >= 0 && p.x + p.w <= ANCHO, 'cabe a lo ancho');
  }
  assert.throws(() => geometriaFigura({ tipo: 'estrella', partes: 3 }), /desconocido/);
});

test('recta: marcas en los múltiplos de 1/d (también negativas), la más cercana a un toque y números que no se montan', () => {
  assert.deepEqual(marcasRecta({ min: 0, max: 1, den: 4 }).map(String), ['0/4', '1/4', '2/4', '3/4', '4/4']);
  assert.deepEqual(marcasRecta({ min: -1, max: 0, den: 2 }).map(String), ['−2/2', '−1/2', '0/2']);
  assert.ok(conNumeroRecta(f(4, 4)) && !conNumeroRecta(f(3, 4)) && conNumeroRecta(f(3, 4), { numeros: 'todas' }));
  assert.ok(conNumeroRecta(f(2, 4), { numeros: ['1/2'] }), 'una lista se compara por valor');
  for (const [min, max] of [[0, 1], [0, 2], [-1, 1]]) {
    for (let den = 2; den <= 12; den++) {
      for (const numeros of ['enteros', 'todas']) {
        const op = { min, max, den, numeros };
        const geo = geometriaRecta(op);
        const lista = marcasRecta(op);
        for (const m of lista) {
          const x = geo.coord(m);
          assert.ok(x > 0 && x < ANCHO);
          assert.ok(geo.fraccionEn(x).mismaForma(m), 'cada marca es la más cercana a su sitio');
          assert.ok(marcaMasCercanaRecta(x + geo.separacion * 0.45, op).mismaForma(m), 'y casi media separación más allá');
        }
        // Los números de una misma fila no se montan.
        const numerados = lista.filter(m => conNumeroRecta(m, op));
        for (let i = geo.filas; i < numerados.length; i++) {
          const a = numerados[i - geo.filas], b = numerados[i];
          if (geo.filaDe(a) !== geo.filaDe(b)) continue;
          assert.ok(geo.coord(b) - geo.coord(a) >= (anchoEtiqueta(a, geo.fuente) + anchoEtiqueta(b, geo.fuente)) / 2 || geo.fuente === 8,
            `de ${min} a ${max} en ${den}: ${a} y ${b}`);
        }
        assert.ok(geo.fuente >= 8 && geo.fuente <= 13);
      }
    }
  }
  // 24 marcas (de 0 a 2 en doceavos, 25 con el 0): la separación es la zona de toque.
  const g = geometriaRecta({ min: 0, max: 2, den: 12 });
  assert.equal(g.n, 25);
  assert.ok(g.separacion >= 13, `separación ${g.separacion}`);
  assert.ok(geometriaRecta({ min: -1, max: 1, den: 4 }).coord('-3/4') < geometriaRecta({ min: -1, max: 1, den: 4 }).coord(0));
  assert.ok(marcaMasCercanaRecta(-50, { min: 0, max: 1, den: 4 }).mismaForma(f(0, 4)), 'fuera, la del extremo');
  assert.throws(() => marcasRecta({ min: 1, max: 1, den: 4 }));
});
