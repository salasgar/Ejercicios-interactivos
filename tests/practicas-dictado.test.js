// Dictado de números (practicas/dictado/): generadores y comprobaciones por fuerza
// bruta, con analizadores y reglas de ortografía escritos aquí, independientes de logica.js.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  generarDictado, esRespuestaDictado, gruposConValor, generarTeen, PARES_TEEN, generarEscritura, MAL_ESCRITAS,
  generarFichas, esSecuenciaCorrecta, generarDictadoEs, NOTAS_FICHAS, enNum, esNum,
} from '../practicas/dictado/logica.js';

const N = 3000;

// --- Analizadores y ortografía independientes ----------------------------------------

const EN_UNOS = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19 };
const EN_DECENAS = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };

function leerEn(texto) {
  let total = 0, actual = 0;
  for (const p of texto.replace(/-/g, ' ').split(' ')) {
    if (p === 'and') continue;
    if (p in EN_UNOS) actual += EN_UNOS[p];
    else if (p in EN_DECENAS) actual += EN_DECENAS[p];
    else if (p === 'hundred') actual *= 100;
    else if (p === 'thousand') { total += actual * 1000; actual = 0; }
    else throw new Error(`palabra desconocida «${p}» en «${texto}»`);
  }
  return total + actual;
}

/** Ortografía estricta: palabras del diccionario, y decena-unidad unidas con UN guion. */
function ortografiaEnValida(texto) {
  const toks = texto.split(' ');
  // Una decena seguida de una unidad con espacio («eighty one») está mal escrita.
  if (toks.some((t, i) => t in EN_DECENAS && toks[i + 1] in EN_UNOS && EN_UNOS[toks[i + 1]] >= 1 && EN_UNOS[toks[i + 1]] <= 9)) return false;
  return toks.every(tok => {
    if (tok in EN_UNOS || ['and', 'hundred', 'thousand'].includes(tok)) return true;
    if (tok in EN_DECENAS) return true;
    const m = tok.match(/^([a-z]+)-([a-z]+)$/);
    return !!m && m[1] in EN_DECENAS && m[2] in EN_UNOS && EN_UNOS[m[2]] >= 1 && EN_UNOS[m[2]] <= 9;
  });
}

const ES_PALABRAS = {
  cero: 0, uno: 1, un: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12, trece: 13, catorce: 14, quince: 15,
  dieciséis: 16, diecisiete: 17, dieciocho: 18, diecinueve: 19, veinte: 20, veintiuno: 21, veintiún: 21, veintidós: 22, veintitrés: 23, veinticuatro: 24, veinticinco: 25,
  veintiséis: 26, veintisiete: 27, veintiocho: 28, veintinueve: 29, treinta: 30, cuarenta: 40, cincuenta: 50, sesenta: 60, setenta: 70, ochenta: 80, noventa: 90,
  cien: 100, ciento: 100, doscientos: 200, trescientos: 300, cuatrocientos: 400, quinientos: 500, seiscientos: 600, setecientos: 700, ochocientos: 800, novecientos: 900,
};

function leerEs(texto) {
  let miles = 0, actual = 0;
  for (const p of texto.split(' ')) {
    if (p === 'y') continue;
    if (p in ES_PALABRAS) actual += ES_PALABRAS[p];
    else if (p === 'mil') { miles += (actual || 1) * 1000; actual = 0; }
    else throw new Error(`palabra española desconocida «${p}» en «${texto}»`);
  }
  return miles + actual;
}

const conCerosInteriores = n => /[1-9]0+[1-9]/.test(String(n));
const proporcion = (lista, f) => lista.filter(f).length / lista.length;

// --- Ejercicio 1: dictado en inglés ----------------------------------------------------------

test('ejercicio 1: el texto se lee como n, de 3 a 5 cifras, y el 40 % lleva ceros interiores', () => {
  const rng = crearRng(3001);
  const items = Array.from({ length: N }, () => generarDictado(rng));
  for (const it of items) {
    assert.ok(it.n >= 100 && it.n <= 99999);
    assert.equal(leerEn(it.texto), it.n, `${it.n} → «${it.texto}»`);
    assert.ok(esRespuestaDictado(it, String(it.n)));
    assert.ok(esRespuestaDictado(it, it.n.toLocaleString('en').replace(/,/g, ' ')));
    assert.ok(!esRespuestaDictado(it, String(it.n + 1)));
  }
  const p = proporcion(items, it => conCerosInteriores(it.n));
  assert.ok(p > 0.36 && p < 0.44, `con ceros interiores: ${p}`);
  assert.ok(new Set(items.map(it => String(it.n).length)).size === 3);
});

test('ejercicio 1: el «and» va antes del grupo final de menos de 100 y no se enfrenta a lecturas equivalentes', () => {
  assert.equal(enNum(6014), 'six thousand and fourteen');
  assert.equal(enNum(20307), 'twenty thousand three hundred and seven');
  assert.equal(enNum(5063), 'five thousand and sixty-three');
  const rng = crearRng(3002);
  for (let i = 0; i < N; i++) assert.ok(!/hundred and thousand|fourteen hundred/.test(generarDictado(rng).texto));
});

test('gruposConValor: los valores de los grupos suman n', () => {
  for (const n of [6014, 20307, 5063, 100, 99999, 40012]) {
    const g = gruposConValor(n);
    assert.equal(g.reduce((a, x) => a + x.valor, 0), n);
    g.forEach(x => assert.equal(leerEn(x.texto), x.valor));
  }
});

// --- Ejercicio 2a: -teen o -ty -------------------------------------------------------------------

test('ejercicio 2 (teen): dos números distintos, el texto vale uno de ellos y es un par confundible', () => {
  const rng = crearRng(3003);
  const solucionEn = [0, 0];
  const pares = new Set();
  for (let i = 0; i < N; i++) {
    const it = generarTeen(rng);
    assert.equal(leerEn(it.texto), it.n);
    assert.equal(it.opciones.length, 2);
    assert.notEqual(it.opciones[0], it.opciones[1]);
    const [teen, ty] = it.base;
    assert.ok(PARES_TEEN.some(([a, b]) => a === teen && b === ty));
    assert.deepEqual([...it.opciones].sort((a, b) => a - b), [teen * it.escala, ty * it.escala]);
    // Fuerza bruta: exactamente una opción coincide con lo que se oye.
    const iguales = it.opciones.filter(o => o === leerEn(it.texto));
    assert.equal(iguales.length, 1);
    assert.equal(it.opciones[it.solucion], it.n);
    // Y las dos opciones se leen con el par confundible (una acaba en -teen y la otra en -ty).
    const palabras = it.opciones.map(o => enNum(o).split(' ')[0]);
    assert.ok(palabras.some(p => p.endsWith('teen')) && palabras.some(p => p.endsWith('ty')), palabras.join());
    solucionEn[it.solucion]++;
    pares.add(teen);
  }
  assert.equal(pares.size, 7);
  assert.ok(Math.max(...solucionEn) / N < 0.7);
});

// --- Ejercicio 2b: cómo se escribe -------------------------------------------------------------------

test('ejercicio 2 (escritura): solo la buena está bien escrita; las falsas no son ortografía válida', () => {
  const rng = crearRng(3004);
  const clases = {}, posiciones = [0, 0, 0, 0];
  for (let i = 0; i < N; i++) {
    const it = generarEscritura(rng);
    clases[it.clase] = (clases[it.clase] || 0) + 1;
    assert.equal(it.opciones.length, 4);
    assert.equal(new Set(it.opciones).size, 4, `repetidas: ${it.opciones}`);
    it.opciones.forEach((o, k) => {
      const valida = ortografiaEnValida(o);
      assert.equal(valida, k === it.solucion, `«${o}» para ${it.n}`);
      if (valida) assert.equal(leerEn(o), it.n);
    });
    posiciones[it.solucion]++;
  }
  assert.deepEqual(Object.keys(clases).sort(), ['compuesto', 'decena', 'plural']);
  assert.ok(Math.max(...posiciones) / N < 0.7);
});

test('ejercicio 2 (escritura): las erratas no coinciden con ningún número bien escrito de 0 a 1000', () => {
  const buenas = new Set(Array.from({ length: 1001 }, (_, n) => enNum(n)));
  for (const lista of Object.values(MAL_ESCRITAS)) for (const mal of lista) assert.ok(!buenas.has(mal) && !(mal in EN_UNOS) && !(mal in EN_DECENAS), mal);
  for (const [bien, malas] of Object.entries(MAL_ESCRITAS)) {
    assert.equal(malas.length, 3);
    assert.ok(bien in EN_UNOS || bien in EN_DECENAS);
    malas.forEach(m => assert.notEqual(m, bien));
  }
});

// --- Ejercicio 3: ortografía española con fichas ------------------------------------------------

test('ejercicio 3 (fichas): las fichas buenas, en orden, forman el número; las que sobran son erróneas', () => {
  const rng = crearRng(3005);
  let conVeinti = 0, conY = 0;
  for (let i = 0; i < N; i++) {
    const it = generarFichas(rng);
    assert.ok(it.n >= 1000 && it.n <= 99999);
    assert.equal(leerEs(it.texto), it.n, it.texto);
    const buenas = it.texto.split(' ');
    assert.deepEqual([...it.fichas].sort(), [...buenas, ...it.sobran].sort());
    assert.ok(it.sobran.length >= 1 && it.sobran.length <= 3);
    for (const s of it.sobran) {
      assert.ok(s in NOTAS_FICHAS, s);
      assert.ok(!buenas.includes(s), `la ficha de más «${s}» está también entre las buenas`);
    }
    assert.ok(esSecuenciaCorrecta(it, buenas));
    assert.equal(esSecuenciaCorrecta(it, [...buenas].reverse()), [...buenas].reverse().join(' ') === it.texto); // «cuatro mil cuatro» es capicúa
    assert.ok(!esSecuenciaCorrecta(it, [...buenas, it.sobran[0]]));
    assert.ok(!/ miles|^un mil|sietecientos|nuevecientos| y y /.test(it.texto));
    if (/veinti|dieci/.test(it.texto)) conVeinti++;
    if (/ y /.test(it.texto)) conY++;
  }
  assert.ok(conVeinti > 100 && conY > 500, `${conVeinti} ${conY}`);
});

test('ejercicio 3 (fichas): veintitrés y dieciséis son una sola ficha; el mil no lleva «un»', () => {
  assert.equal(esNum(23000), 'veintitrés mil');
  assert.equal(esNum(16000), 'dieciséis mil');
  assert.equal(esNum(21000), 'veintiún mil');
  assert.equal(esNum(1000), 'mil');
  assert.equal(esNum(31000), 'treinta y un mil');
  assert.equal(esNum(8143), 'ocho mil ciento cuarenta y tres');
  assert.equal(esNum(2081), 'dos mil ochenta y uno');
  assert.equal(esNum(700), 'setecientos');
});

test('ejercicio 3 (dictado en español): se lee como n; cuatro o cinco cifras, la mayoría con cero interior', () => {
  const rng = crearRng(3006);
  const items = Array.from({ length: N }, () => generarDictadoEs(rng));
  for (const it of items) {
    assert.ok(it.n >= 1000 && it.n <= 99999);
    assert.equal(leerEs(it.texto), it.n, it.texto);
    assert.ok(esRespuestaDictado(it, String(it.n)));
  }
  const p = proporcion(items, it => conCerosInteriores(it.n));
  assert.ok(p > 0.6 && p < 0.8, `con ceros interiores: ${p}`);
});
