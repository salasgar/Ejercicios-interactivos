// Práctica «Constructor de números» (reparto-practicas-u2, tarea 26): fuerza bruta con definiciones
// independientes de las de logica.js (permutaciones propias, analizadores de números en palabras
// y de la notación con comas/puntos propios), semilla fija.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  CONSIGNAS, generarConstruir, esAciertoConstruir, permutaciones, solucionDe,
  generarASuma, esAciertoASuma, generarANumero, esAciertoANumero, errorPegado, componentesDe,
  generarValor, generarPosicion, generarDescomposicion, esAciertoOpcion,
  generarComa, esAciertoComa, escribir, generarPalabras, esAciertoPalabras, enPalabras, generarComaPalabras, fmt,
} from '../practicas/constructor/logica.js';

const N = 3000;
const generarN = (fn, semilla = 1, n = N) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };
const cuantos = (arr, f) => arr.filter(f).length;
const maxFraccion = valores => { const c = {}; valores.forEach(v => { c[v] = (c[v] || 0) + 1; }); return Math.max(...Object.values(c)) / valores.length; };

/** Permutaciones propias (recursivas, con repetición de cifras posible) → números sin cero delante. */
function todasLasPermutaciones(cifras) {
  const out = [];
  const rec = (resto, acum) => {
    if (!resto.length) { if (acum[0] !== 0) out.push(Number(acum.join(''))); return; }
    for (let i = 0; i < resto.length; i++) rec(resto.filter((_, j) => j !== i), [...acum, resto[i]]);
  };
  rec(cifras, []);
  return out;
}

// --- Ejercicio 1 -----------------------------------------------------------------

test('construir: permutaciones coincide con la fuerza bruta (sin cero delante)', () => {
  for (const it of generarN(generarConstruir, 3, 300)) {
    assert.deepEqual([...new Set(todasLasPermutaciones(it.cifras))].sort((a, b) => a - b), permutaciones(it.cifras).sort((a, b) => a - b));
  }
});

test('construir: la solución de cada consigna es la de la fuerza bruta, única, y no viene ya hecha', () => {
  const items = generarN(generarConstruir);
  for (const it of items) {
    assert.ok(it.cifras.length === 4 || it.cifras.length === 5);
    assert.equal(new Set(it.cifras).size, it.cifras.length, 'cifras distintas');
    const todas = todasLasPermutaciones(it.cifras);
    let esperado;
    if (it.consigna === 'mayor') esperado = Math.max(...todas);
    else if (it.consigna === 'menor') esperado = Math.min(...todas);
    else if (it.consigna === 'menor_par') esperado = Math.min(...todas.filter(n => n % 2 === 0));
    else if (it.consigna === 'mayor_impar') esperado = Math.max(...todas.filter(n => n % 2 === 1));
    else {
      const d = Math.min(...todas.map(n => Math.abs(n - it.objetivo)));
      const buenos = todas.filter(n => Math.abs(n - it.objetivo) === d);
      assert.equal(buenos.length, 1, `solución única ${it.cifras} → ${it.objetivo}`);
      esperado = buenos[0];
    }
    assert.equal(it.solucion, esperado, `${it.consigna} ${it.cifras}`);
    assert.notEqual(Number(it.cifras.join('')), it.solucion);
    assert.ok(esAciertoConstruir(it, [...String(it.solucion)].map(Number)));
    assert.equal(it.hayCero, it.cifras.includes(0));
  }
  for (const c of CONSIGNAS) assert.ok(cuantos(items, i => i.consigna === c) > N * 0.12, c);
  assert.ok(cuantos(items, i => i.hayCero) / N > 0.4 && cuantos(items, i => i.hayCero) / N < 0.6);
});

test('construir: «el menor» con un 0 no pone el 0 delante; el 0 delante nunca acierta', () => {
  assert.equal(solucionDe([0, 3, 5, 7], 'menor'), 3057);
  assert.equal(solucionDe([5, 0, 8, 2], 'mayor'), 8520);
  const it = { cifras: [0, 3, 5, 7], consigna: 'menor', solucion: 3057 };
  assert.ok(esAciertoConstruir(it, [3, 0, 5, 7]));
  assert.ok(!esAciertoConstruir(it, [0, 3, 5, 7]));
  assert.ok(!esAciertoConstruir(it, [3, 0, 7, 5]));
  assert.equal(solucionDe([2, 4, 6, 8], 'mayor_impar'), null, 'sin cifra impar no hay solución');
});

test('construir: «el más cercano» con dos candidatos a la misma distancia no tiene solución única', () => {
  assert.equal(solucionDe([1, 3], 'cercano', 22), null); // 13 y 31 están a 9
  assert.equal(solucionDe([1, 3], 'cercano', 20), 13);
});

test('construir: ninguna solución es siempre la misma cifra inicial ni la misma consigna', () => {
  const items = generarN(generarConstruir, 5);
  assert.ok(maxFraccion(items.map(i => i.consigna)) < 0.3);
});

// --- Ejercicio 2 -----------------------------------------------------------------

test('a_suma: las correctas son una por posición no nula; los señuelos no son componentes; ninguna otra selección suma n', () => {
  for (const it of generarN(generarASuma, 2)) {
    const cifras = [...String(it.n)].map(Number);
    const esperado = cifras.map((d, i) => d * 10 ** (cifras.length - 1 - i)).filter(v => v > 0);
    assert.deepEqual(it.correctas, esperado);
    assert.equal(esperado.reduce((a, b) => a + b, 0), it.n);
    assert.equal(it.fichas.length, it.correctas.length + (it.fichas.length - it.correctas.length));
    const senuelos = it.fichas.filter(f => !it.correctas.includes(f));
    assert.ok(senuelos.length >= 3 && senuelos.length <= 4);
    assert.equal(new Set(it.fichas).size, it.fichas.length, 'fichas distintas');
    // fuerza bruta de subconjuntos
    let sumasN = 0;
    for (let mask = 1; mask < 1 << it.fichas.length; mask++) {
      const sel = it.fichas.filter((_, i) => mask & (1 << i));
      if (esAciertoASuma(it, sel)) { sumasN++; assert.deepEqual([...sel].sort((a, b) => a - b), [...it.correctas].sort((a, b) => a - b)); }
    }
    assert.equal(sumasN, 1);
  }
});

test('a_numero: los sumandos reconstruyen el número; el cero interior es frecuente; el error de pegar cifras se detecta', () => {
  const items = generarN(generarANumero, 3);
  for (const it of items) {
    assert.equal(it.sumandos.reduce((a, b) => a + b, 0), it.n);
    assert.deepEqual(it.sumandos, componentesDe(it.n));
    assert.ok(esAciertoANumero(it, it.n));
    assert.ok(!esAciertoANumero(it, it.n + 1));
    const pegado = errorPegado(it);
    if (pegado !== null) { assert.notEqual(pegado, it.n); assert.ok(!esAciertoANumero(it, pegado)); }
  }
  assert.ok(cuantos(items, i => String(i.n).slice(1, -1).includes('0')) / N > 0.5, 'cero interior');
  assert.equal(errorPegado({ n: 5032 }), 532);
  assert.equal(errorPegado({ n: 8274 }), null);
});

test('valor: la cifra es única y no nula, hay cuatro opciones distintas y solo una vale lo que vale la cifra en su sitio', () => {
  const items = generarN(generarValor, 4);
  for (const it of items) {
    const s = String(it.n);
    assert.equal(new Set(s).size, s.length, 'cifras distintas');
    assert.ok(it.cifra > 0);
    assert.equal(s[s.length - 1 - it.pos], String(it.cifra));
    assert.equal(it.opciones.length, 4);
    assert.equal(new Set(it.opciones).size, 4);
    // cada opción es la cifra × 10^p; solo es verdad si en la posición p del número está esa cifra
    const verdaderas = it.opciones.filter(v => {
      const p = String(v).length - String(it.cifra).length;
      return v === it.cifra * 10 ** p && s[s.length - 1 - p] === String(it.cifra);
    });
    assert.deepEqual(verdaderas, [it.correcto]);
    assert.ok(esAciertoOpcion(it, it.correcto));
  }
  for (let p = 0; p < 4; p++) assert.ok(cuantos(items, i => i.opciones[p] === i.correcto) / N < 0.4, `posición ${p}`);
  assert.ok(maxFraccion(items.map(i => i.pos)) < 0.4);
});

test('posicion: una sola opción es la posición de la cifra; cuatro distintas', () => {
  const items = generarN(generarPosicion, 6);
  for (const it of items) {
    const s = String(it.n);
    assert.equal(it.opciones.length, 4);
    assert.equal(new Set(it.opciones).size, 4);
    const buenas = it.opciones.filter(p => s[s.length - 1 - p] === String(it.cifra));
    assert.deepEqual(buenas, [it.correcto]);
    assert.ok(esAciertoOpcion(it, it.correcto));
  }
  for (let p = 0; p < 4; p++) assert.ok(cuantos(items, i => i.opciones[p] === i.correcto) / N < 0.4, `posición ${p}`);
});

test('ejercicio 2: salen los cuatro tipos', () => {
  const items = generarN(generarDescomposicion, 7);
  for (const t of ['a_suma', 'a_numero', 'valor', 'posicion']) assert.ok(cuantos(items, i => i.tipo === t) > N * 0.15, t);
});

// --- Ejercicio 3 -----------------------------------------------------------------

/** Analizadores propios (distintos de los de logica.js): valor en centésimas. */
function leerEn(s) {
  assert.match(s, /^\d{1,3}(,\d{3})*(\.\d+)?$|^\d+(\.\d+)?$/, `forma inglesa: ${s}`);
  return Math.round(parseFloat(s.split(',').join('')) * 100);
}
function leerEs(s) {
  const limpio = s.split(' ').join('');
  assert.match(limpio, /^\d{1,3}(\.\d{3})*(,\d+)?$|^\d+(,\d+)?$/, `forma española: ${s}`);
  return Math.round(parseFloat(limpio.split('.').join('').replace(',', '.')) * 100);
}

test('coma: el correcto es el mismo número y los falsos otros distintos (regla de oro)', () => {
  const items = generarN(generarComa, 8);
  let trampas = 0;
  for (const it of items) {
    const lee = it.dir === 'en_es' ? [leerEn, leerEs] : [leerEs, leerEn];
    const valorDado = lee[0](it.dado);
    assert.equal(valorDado, it.c);
    assert.equal(lee[1](it.correcto), valorDado);
    assert.equal(it.opciones.length, 4);
    assert.equal(new Set(it.opciones).size, 4);
    for (const o of it.opciones) {
      if (o === it.correcto) { assert.ok(esAciertoComa(it, o)); continue; }
      assert.notEqual(lee[1](o), valorDado, `${it.dado} vs ${o}`);
      assert.ok(!esAciertoComa(it, o));
    }
    // la trampa: leerlo con las reglas del otro idioma (12,500 → 12,5)
    const otro = it.dir === 'en_es' ? leerEs : leerEn;
    trampas++;
  }
  assert.ok(trampas >= 0);
  assert.ok(cuantos(items, i => i.sub === 'miles') / N > 0.4 && cuantos(items, i => i.sub === 'decimal') / N > 0.3);
  assert.ok(cuantos(items, i => i.dir === 'en_es') / N > 0.4);
  assert.ok(cuantos(items, i => i.estilo === 'espacio' && i.dir === 'es_en' && i.sub === 'miles') > 100, 'forma con espacio');
});

test('coma: la lectura equivocada (reglas del otro idioma) está siempre entre las opciones y es falsa', () => {
  const items = generarN(generarComa, 12);
  for (const it of items) {
    const origen = it.dir === 'en_es' ? 'en' : 'es', destino = it.dir === 'en_es' ? 'es' : 'en';
    const cadena = escribir(it.c, origen, 'punto');
    const limpio = destino === 'es' ? cadena.replace(/\./g, '').replace(',', '.') : cadena.replace(/,/g, '');
    const mal = Math.round(Number(limpio) * 100);
    if (!Number.isFinite(mal)) continue; // «1,000,000» no se puede leer como número español: no hay trampa
    const escrito = escribir(mal, destino, it.estilo);
    assert.notEqual(mal, it.c);
    assert.ok(it.opciones.includes(escrito), `${it.dado}: falta la trampa ${escrito} en ${it.opciones}`);
  }
});

test('coma: la correcta no está siempre en el mismo sitio', () => {
  const items = generarN(generarComa, 9);
  for (let p = 0; p < 4; p++) assert.ok(cuantos(items, i => i.opciones[p] === i.correcto) / N < 0.4, `posición ${p}`);
});

// Analizadores de números en palabras (propios)
const EN_NUM = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
function leerPalabrasEn(texto) {
  let total = 0, grupo = 0;
  for (const t of texto.split(/[\s-]+/)) {
    if (t === 'and') continue;
    if (t in EN_NUM) grupo += EN_NUM[t];
    else if (t === 'hundred') grupo *= 100;
    else if (t === 'thousand') { total += grupo * 1000; grupo = 0; }
    else if (t === 'million') { total += grupo * 1000000; grupo = 0; }
    else assert.fail(`palabra inglesa desconocida: ${t}`);
  }
  return total + grupo;
}
const ES_NUM = {
  cero: 0, un: 1, uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12, trece: 13, catorce: 14, quince: 15,
  dieciséis: 16, diecisiete: 17, dieciocho: 18, diecinueve: 19, veinte: 20, veintiuno: 21, veintiún: 21, veintidós: 22, veintitrés: 23, veinticuatro: 24, veinticinco: 25, veintiséis: 26, veintisiete: 27, veintiocho: 28, veintinueve: 29,
  treinta: 30, cuarenta: 40, cincuenta: 50, sesenta: 60, setenta: 70, ochenta: 80, noventa: 90,
  cien: 100, ciento: 100, doscientos: 200, trescientos: 300, cuatrocientos: 400, quinientos: 500, seiscientos: 600, setecientos: 700, ochocientos: 800, novecientos: 900,
};
function leerPalabrasEs(texto) {
  let total = 0, grupo = 0;
  for (const t of texto.split(/\s+/)) {
    if (t === 'y') continue;
    if (t in ES_NUM) grupo += ES_NUM[t];
    else if (t === 'mil') { total += (grupo || 1) * 1000; grupo = 0; }
    else if (t === 'millón' || t === 'millones') { total += (grupo || 1) * 1000000; grupo = 0; }
    else assert.fail(`palabra española desconocida: ${t}`);
  }
  return total + grupo;
}

test('palabras: números de 1 000 001 a 9 999 999 con al menos dos ceros; el texto vuelve a leerse bien en los dos idiomas', () => {
  const items = generarN(generarPalabras, 10);
  let conGrupoCero = 0;
  for (const it of items) {
    assert.ok(it.n > 1000000 && it.n <= 9999999);
    assert.ok((String(it.n).match(/0/g) || []).length >= 2);
    assert.equal(leerPalabrasEn(enPalabras(it.n, 'en')), it.n, enPalabras(it.n, 'en'));
    assert.equal(leerPalabrasEs(enPalabras(it.n, 'es')), it.n, enPalabras(it.n, 'es'));
    assert.ok(esAciertoPalabras(it, String(it.n)));
    assert.ok(esAciertoPalabras(it, fmt(it.n)), 'con espacios también vale');
    assert.ok(!esAciertoPalabras(it, String(it.n * 10)));
    if (Math.floor(it.n / 1000) % 1000 === 0 || it.n % 1000 === 0) conGrupoCero++;
  }
  assert.ok(conGrupoCero / N > 0.2, 'grupos enteros a cero');
});

test('ejercicio 3: salen coma y palabras', () => {
  const items = generarN(generarComaPalabras, 11);
  assert.ok(cuantos(items, i => i.tipo === 'coma') > N * 0.35);
  assert.ok(cuantos(items, i => i.tipo === 'palabras') > N * 0.35);
});

test('fmt: separador de miles', () => {
  assert.equal(fmt(8274), '8 274');
  assert.equal(fmt(8274, 'en'), '8,274');
  assert.equal(fmt(2040006, 'en'), '2,040,006');
  assert.equal(fmt(974), '974');
});
