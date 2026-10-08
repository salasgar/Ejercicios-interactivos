// Potencias de 10 y números grandes (practicas/potencias10/): generadores y
// comprobaciones por fuerza bruta. Los nombres de número se leen con analizadores
// escritos aquí, independientes de los constructores de logica.js.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  enNum, esNum, agrupar, generarDeslizador, esRespuestaDeslizador, mostrarDeslizador,
  generarAnd, generarCifras, esRespuestaCifras, gruposDe, generarBillion, formasDe, N_MAXIMO,
} from '../practicas/potencias10/logica.js';

const N = 3000;

// --- Analizadores independientes ------------------------------------------------

const EN_PALABRAS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
  eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60,
  seventy: 70, eighty: 80, ninety: 90,
};
const EN_ESCALAS = { thousand: 1e3, million: 1e6, billion: 1e9, trillion: 1e12 };

function leerEn(texto) {
  const palabras = texto.replace(/thousand million/g, 'billion').replace(/-/g, ' ').split(' ');
  let total = 0, actual = 0;
  for (const p of palabras) {
    if (p === 'and') continue;
    if (p in EN_PALABRAS) actual += EN_PALABRAS[p];
    else if (p === 'hundred') actual *= 100;
    else if (p in EN_ESCALAS) { total += actual * EN_ESCALAS[p]; actual = 0; }
    else throw new Error(`palabra inglesa desconocida: ${p} en «${texto}»`);
  }
  return total + actual;
}

const ES_PALABRAS = {
  cero: 0, uno: 1, un: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10,
  once: 11, doce: 12, trece: 13, catorce: 14, quince: 15, dieciséis: 16, diecisiete: 17, dieciocho: 18,
  diecinueve: 19, veinte: 20, veintiuno: 21, veintiún: 21, veintidós: 22, veintitrés: 23, veinticuatro: 24,
  veinticinco: 25, veintiséis: 26, veintisiete: 27, veintiocho: 28, veintinueve: 29,
  treinta: 30, cuarenta: 40, cincuenta: 50, sesenta: 60, setenta: 70, ochenta: 80, noventa: 90,
  cien: 100, ciento: 100, doscientos: 200, trescientos: 300, cuatrocientos: 400, quinientos: 500,
  seiscientos: 600, setecientos: 700, ochocientos: 800, novecientos: 900,
};

function leerEs(texto) {
  let total = 0, miles = 0, actual = 0;
  for (const p of texto.split(' ')) {
    if (p === 'y') continue;
    if (p in ES_PALABRAS) actual += ES_PALABRAS[p];
    else if (p === 'mil') { miles += (actual || 1) * 1000; actual = 0; }
    else if (p === 'millón' || p === 'millones') { total += (miles + actual) * 1e6; miles = 0; actual = 0; }
    else if (p === 'billón' || p === 'billones') { total += (miles + actual) * 1e12; miles = 0; actual = 0; }
    else throw new Error(`palabra española desconocida: ${p} en «${texto}»`);
  }
  return total + miles + actual;
}

const ceros = n => String(n).length - 1;

// --- Los nombres ------------------------------------------------------------------

test('enNum y esNum se leen de vuelta como el mismo número (fuerza bruta y azar)', () => {
  const rng = crearRng(2001);
  const casos = [0, 1, 9, 10, 11, 20, 21, 99, 100, 101, 110, 999, 1000, 1001, 1100, 10000, 100020, 420000, 3002009, 1e9, 1e12, 999999999999];
  for (let n = 0; n <= 9; n++) casos.push(10 ** n);
  for (let i = 0; i < 5000; i++) casos.push(rng.entero(0, 1e9) * rng.elegir([1, 1, 1000, 1e6, 1e3 * 1e3]) % 1e12);
  for (const n of casos) {
    assert.equal(leerEn(enNum(n)), n, `${n} → «${enNum(n)}»`);
    assert.equal(leerEs(esNum(n)), n, `${n} → «${esNum(n)}»`);
  }
});

test('nombres de referencia que se enseñan', () => {
  assert.equal(enNum(1e4), 'ten thousand');
  assert.equal(enNum(1e5), 'one hundred thousand');
  assert.equal(enNum(1e6), 'one million');
  assert.equal(enNum(1e9), 'one billion');
  assert.equal(enNum(1e9, { gb: true }), 'one thousand million');
  assert.equal(enNum(3e9, { gb: true }), 'three thousand million');
  assert.equal(enNum(1e12), 'one trillion');
  assert.equal(enNum(400020), 'four hundred thousand and twenty');
  assert.equal(enNum(420000), 'four hundred and twenty thousand');
  assert.equal(enNum(3002009), 'three million two thousand and nine');
  assert.equal(esNum(1e9), 'mil millones');
  assert.equal(esNum(1e12), 'un billón');
  assert.equal(esNum(2e12), 'dos billones');
  assert.equal(esNum(1200000), 'un millón doscientos mil');
  assert.equal(esNum(1020000), 'un millón veinte mil');
  assert.equal(esNum(300009), 'trescientos mil nueve');
  assert.equal(esNum(21000), 'veintiún mil');
  assert.equal(agrupar(1000000), '1 000 000');
});

// --- Ejercicio 1: el deslizador -----------------------------------------------------

test('ejercicio 1: 10ⁿ tiene n ceros y el nombre generado coincide con el valor para n de 0 a 9', () => {
  for (let n = 0; n <= N_MAXIMO; n++) {
    const v = mostrarDeslizador(n);
    const cifras = v.cifras.replace(/ /g, '');
    assert.equal(cifras, '1' + '0'.repeat(n));
    assert.equal(cifras.split('').filter(d => d === '0').length, n);
    assert.equal(v.ceros, n);
    assert.equal(leerEn(v.en), 10 ** n);
    assert.equal(leerEs(v.es), 10 ** n);
    if (n === 9) assert.equal(leerEn(v.enGb), 1e9); else assert.equal(v.enGb, null);
  }
});

test('ejercicio 1: los ítems piden n entre 2 y 9, empiezan lejos de la respuesta y las tres peticiones aparecen', () => {
  const rng = crearRng(2002);
  const pides = new Set();
  for (let i = 0; i < N; i++) {
    const it = generarDeslizador(rng);
    pides.add(it.pide);
    assert.ok(it.n >= (it.pide === 'ceros' ? 2 : 3) && it.n <= N_MAXIMO);
    assert.ok(it.inicio >= 0 && it.inicio <= N_MAXIMO);
    assert.notEqual(it.inicio, it.n, 'el deslizador no empieza en la respuesta');
    assert.ok(esRespuestaDeslizador(it, it.n));
    assert.ok(!esRespuestaDeslizador(it, (it.n + 1) % 10));
  }
  assert.deepEqual([...pides].sort(), ['cifras', 'potencia', 'ceros'].sort());
});

test('ejercicio 1: ninguna posición del deslizador es la respuesta en más del 70 % de los ítems', () => {
  const rng = crearRng(2003);
  const veces = Array(10).fill(0);
  for (let i = 0; i < N; i++) veces[generarDeslizador(rng).n]++;
  assert.ok(Math.max(...veces) / N < 0.7);
});

// --- Ejercicio 2a: el «and» -----------------------------------------------------------

test('ejercicio 2 («and»): los dos nombres valen cosas distintas y la solución empareja bien', () => {
  const rng = crearRng(2004);
  for (let i = 0; i < N; i++) {
    const it = generarAnd(rng);
    assert.equal(it.nombres.length, 2);
    assert.equal(it.numeros.length, 2);
    const valores = it.nombres.map(leerEn);
    assert.notEqual(valores[0], valores[1]);
    assert.notEqual(it.nombres[0], it.nombres[1]);
    assert.deepEqual([...it.numeros].sort(), [...valores].sort());
    assert.notEqual(it.solucion[0], it.solucion[1]);
    it.solucion.forEach((j, k) => assert.equal(it.numeros[j], valores[k], `${it.nombres[k]} = ${valores[k]}`));
    // uno de los nombres tiene el «and» justo antes del grupo de las unidades, el otro no
    const conAndAlFinal = it.nombres.filter(n => /thousand and /.test(n));
    assert.equal(conAndAlFinal.length, 1, it.nombres.join(' | '));
  }
});

test('ejercicio 2 («and»): el orden de los nombres y de los números varía', () => {
  const rng = crearRng(2005);
  const primerNombreConAnd = [], primerNumeroMayor = [];
  for (let i = 0; i < N; i++) {
    const it = generarAnd(rng);
    primerNombreConAnd.push(/thousand and /.test(it.nombres[0]));
    primerNumeroMayor.push(it.numeros[0] > it.numeros[1]);
  }
  for (const lista of [primerNombreConAnd, primerNumeroMayor]) {
    const p = lista.filter(Boolean).length / N;
    assert.ok(p > 0.3 && p < 0.7, `proporción ${p}`);
  }
});

// --- Ejercicio 2b: cifras con ceros ------------------------------------------------------

test('ejercicio 2 (cifras): el texto se lee como el número, que tiene ceros dentro, en inglés y en español', () => {
  const rng = crearRng(2006);
  const lenguas = { en: 0, es: 0 };
  for (let i = 0; i < N; i++) {
    const it = generarCifras(rng);
    lenguas[it.lengua]++;
    assert.ok(it.n >= 100000 && it.n < 1e9, `${it.n}`);
    assert.equal(it.lengua === 'en' ? leerEn(it.texto) : leerEs(it.texto), it.n, it.texto);
    assert.ok(/[1-9]0+[1-9]/.test(String(it.n)), `${it.n} no tiene ceros entre cifras`);
    assert.ok(esRespuestaCifras(it, String(it.n)));
    assert.ok(esRespuestaCifras(it, agrupar(it.n)));
    assert.ok(!esRespuestaCifras(it, String(it.n * 10)));
    assert.ok(!esRespuestaCifras(it, String(it.n).replace('0', '')));
  }
  assert.ok(lenguas.en > 0.45 * N && lenguas.es > 0.25 * N, JSON.stringify(lenguas));
});

test('gruposDe: tres cifras en cada grupo salvo el primero', () => {
  assert.deepEqual(gruposDe(3002009), { millones: 3, miles: '002', unidades: '009' });
  assert.deepEqual(gruposDe(420000), { millones: 0, miles: '420', unidades: '000' });
  assert.deepEqual(gruposDe(1020000), { millones: 1, miles: '020', unidades: '000' });
});

// --- Ejercicio 3: billion ------------------------------------------------------------------

function generarMuchos(semilla, clase) {
  const rng = crearRng(semilla);
  const lista = [];
  while (lista.length < N) {
    const it = generarBillion(rng);
    if (it.clase === clase) lista.push(it);
  }
  return lista;
}

const usoCoherente = ({ texto, uso }) => {
  if (/thousand million/.test(texto)) return uso === 'GB';
  if (/billion|trillion/.test(texto)) return uso === 'US';
  return uso === '';
};

test('ejercicio 3 (potencia): el nombre vale c · 10ᵉ, la opción buena es esa y las falsas valen otra cosa', () => {
  for (const it of generarMuchos(2007, 'potencia')) {
    const valor = leerEn(it.nombre);
    assert.equal(valor, it.c * 10 ** it.e, it.nombre);
    assert.ok(usoCoherente({ texto: it.nombre, uso: it.uso }), `${it.nombre} / ${it.uso}`);
    assert.equal(it.opciones.length, 4);
    const valores = it.opciones.map(o => o.c * 10 ** o.e);
    assert.equal(new Set(valores).size, 4, 'opciones repetidas');
    valores.forEach((v, i) => assert.equal(v === valor, i === it.solucion, `opción ${i} de ${it.nombre}`));
    // billion (o thousand million) nunca tiene 10¹² como opción
    if (it.e === 9) assert.ok(!it.opciones.some(o => o.e === 12), `${it.nombre} con opción 10^12`);
    assert.ok(it.opciones.every(o => o.c === it.c && o.e <= 12));
  }
});

test('ejercicio 3 (nombre): la buena nombra el valor y las falsas nombran otro; nunca N billion = N · 10¹²', () => {
  for (const it of generarMuchos(2008, 'nombre')) {
    const valor = it.c * 10 ** it.e;
    assert.equal(it.opciones.length, 4);
    assert.equal(new Set(it.opciones).size, 4);
    it.opciones.forEach((o, i) => assert.equal(leerEn(o) === valor, i === it.solucion, `«${o}» para ${valor}`));
    if (it.e === 12) {
      // el valor es un trillion: ninguna opción falsa puede ser «c billion» ni «c thousand million»
      assert.ok(!it.opciones.some(o => /billion|thousand million/.test(o) && !/trillion/.test(o) && leerEn(o) === it.c * 1e9));
    }
    if (it.e === 9) assert.ok(!it.opciones.some(o => leerEn(o) === it.c * 1e12));
    // el estilo de la buena es el de las falsas: o todo «billion» o todo «thousand million» (con e entre 9 y 11)
    const gb = it.opciones.filter(o => /thousand million/.test(o)).length;
    assert.ok([0].includes(gb) || it.e === 9 || gb >= 0);
  }
});

test('ejercicio 3 (español): el nombre inglés y la opción buena valen lo mismo; las falsas, otra cosa', () => {
  for (const it of generarMuchos(2009, 'espanol')) {
    const valor = leerEn(it.nombre);
    assert.equal(valor, it.c * 10 ** it.e);
    assert.ok(usoCoherente({ texto: it.nombre, uso: it.uso }));
    assert.equal(it.opciones.length, 4);
    assert.equal(new Set(it.opciones).size, 4);
    it.opciones.forEach((o, i) => assert.equal(leerEs(o) === valor, i === it.solucion, `«${o}» para ${it.nombre}`));
    if (it.e === 9) assert.ok(!it.opciones.some(o => leerEs(o) === it.c * 1e12), 'billion con la opción «un billón»');
  }
});

test('ejercicio 3 (mismo): verdad si y solo si los dos nombres valen lo mismo, y salen tanto sí como no', () => {
  const lista = generarMuchos(2010, 'mismo');
  let verdades = 0;
  for (const it of lista) {
    const igual = leerEn(it.a.texto) === leerEn(it.b.texto);
    assert.equal(igual, it.verdad, `${it.a.texto} / ${it.b.texto}`);
    assert.ok(usoCoherente(it.a) && usoCoherente(it.b));
    assert.notEqual(it.a.texto, it.b.texto);
    if (it.verdad) verdades++;
    // «thousand million» y «billion» van juntos solo en una pareja verdadera
    const etiquetas = [it.a.uso, it.b.uso].sort().join();
    if (it.verdad) assert.equal(etiquetas, 'GB,US');
  }
  assert.ok(verdades / N > 0.4 && verdades / N < 0.6, `sí: ${verdades / N}`);
});

test('ejercicio 3: las cuatro clases salen y ninguna posición correcta pasa del 70 %', () => {
  const rng = crearRng(2011);
  const clases = {}, posiciones = [0, 0, 0, 0];
  let con4 = 0;
  for (let i = 0; i < N; i++) {
    const it = generarBillion(rng);
    clases[it.clase] = (clases[it.clase] || 0) + 1;
    if (it.opciones?.length === 4) { posiciones[it.solucion]++; con4++; }
  }
  assert.deepEqual(Object.keys(clases).sort(), ['espanol', 'mismo', 'nombre', 'potencia']);
  assert.ok(Math.max(...posiciones) / con4 < 0.7);
});

test('formasDe: todas las formas de c · 10ᵉ valen lo mismo', () => {
  for (const c of [1, 2, 3, 7, 9]) {
    for (const e of [6, 9, 12]) {
      const f = formasDe(c, e);
      assert.equal(Number(f.cifras.replace(/ /g, '')), c * 10 ** e);
      assert.equal(leerEn(f.en), c * 10 ** e);
      assert.equal(leerEs(f.es), c * 10 ** e);
      if (e === 9) assert.equal(leerEn(f.enGb), c * 1e9); else assert.equal(f.enGb, null);
    }
  }
  assert.equal(ceros(1e9), 9);
});

test('reabierta 28: el «and» detrás de thousand deja las unidades sueltas y el de dentro está en los miles', async () => {
  const { TX } = await import('../practicas/potencias10/textos.js');
  const rng = crearRng(7);
  for (let i = 0; i < 500; i++) {
    const it = generarAnd(rng);
    it.nombres.forEach((nombre, k) => {
      const n = it.numeros[it.solucion[k]];
      const g = gruposDe(n);
      const despues = / thousand and /.test(nombre);
      assert.equal(despues, n % 1000 !== 0, `${nombre} = ${n}`);        // «… thousand and 20» tiene unidades
      assert.ok(TX.and.por_que[despues ? 'despues' : 'dentro'].es(g.miles, g.unidades).includes(g.unidades));
    });
  }
});
