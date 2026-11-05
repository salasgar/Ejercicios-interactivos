// Decimales de la unidad 5 (practicas/_comun/decimales.js y la parte pura de
// recta-decimales.js, tarea 122): una tabla de casos hechos a mano, 3000 casos al azar
// contra BigInt, la escritura y la lectura en los dos idiomas, la fracción, los errores
// típicos y la recta.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../practicas/_comun/decimales.js';
import { fraccion, Fraccion } from '../practicas/_comun/fracciones.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { opcionesRecta, marcasDecimales, valorDeMarca, indiceDe, geometriaDecimales, marcaMasCercanaDecimales, textoDeMarca, ANCHO_RECTA_DECIMALES, puntoMedio } from '../practicas/_comun/recta-decimales.js';

const d = t => { const x = D.deTexto(t); assert.ok(x, `«${t}» no se lee`); return x; };
const txt = x => D.aTexto(x, 'es');

test('decimales: el modelo es un entero escalado, inmutable, que no se normaliza solo', () => {
  const x = D.decimal(250, 2);
  assert.deepEqual([x.m, x.k], [250, 2]);
  assert.equal(txt(x), '2,50');
  assert.equal(txt(x.normalizar()), '2,5');
  assert.equal(txt(D.decimal(300, 2).normalizar()), '3');
  assert.ok(Object.isFrozen(x));
  assert.ok(x.equals(d('2,5')), '2,50 = 2,5 por valor');
  assert.ok(!x.mismaForma(d('2,5')), 'pero no por escritura');
  assert.equal(txt(x.conCifras(3)), '2,500');
  assert.equal(d('2,57').conCifras(1), null);
  assert.equal(D.decimal(-0, 1).m, 0, 'sin −0');
  assert.throws(() => D.decimal(1.5, 1), /entero/);
  assert.throws(() => D.decimal(1, -1), /cifras/);
  assert.equal(D.cifrasDecimales(d('2,50')), 2);
  assert.ok(d('3,0').esEntero());
});

// [operación, a, b, resultado esperado escrito a mano]
const TABLA = [
  ['+', '2,5', '1,25', '3,75'], ['+', '0,5', '0,5', '1,0'], ['+', '3', '0,07', '3,07'], ['+', '12,85', '2,4', '15,25'],
  ['+', '0,999', '0,001', '1,000'], ['+', '−3,5', '1,25', '−2,25'], ['+', '−0,4', '−0,6', '−1,0'], ['+', '7', '8', '15'],
  ['−', '20', '15,25', '4,75'], ['−', '1', '0,25', '0,75'], ['−', '3,1', '3,09', '0,01'], ['−', '1,25', '3,5', '−2,25'],
  ['−', '0,3', '0,3', '0,0'], ['−', '5,007', '0,07', '4,937'], ['·', '1,2', '0,3', '0,36'], ['·', '3', '1,45', '4,35'],
  ['·', '0,1', '0,1', '0,01'], ['·', '2,5', '4', '10,0'], ['·', '−1,5', '0,2', '−0,30'], ['·', '−0,5', '−0,5', '0,25'],
  ['·', '12,5', '0,08', '1,000'], ['·', '0,25', '0,25', '0,0625'],
];
const OP = { '+': D.sumar, '−': D.restar, '·': D.multiplicar };

test('decimales: suma, resta y producto, con la escritura de la cuenta en columna (tabla a mano)', () => {
  for (const [op, a, b, r] of TABLA) assert.equal(txt(OP[op](d(a), d(b))), r, `${a} ${op} ${b}`);
});

test('decimales: división con cociente cortado y resto de la original (tabla a mano y acta, punto d)', () => {
  const casos = [
    ['6,384', '0,49', 2, '13,02', '0,0042'], ['7', '4', null, '1,75', '0'], ['1', '3', null, '0,33', '0,01'],
    ['7,5', '3', null, '2,5', '0'], ['10', '3', 2, '3,33', '0,01'], ['2', '0,3', 2, '6,66', '0,002'],
    ['0,9', '0,03', null, '30', '0'], ['5', '8', null, '0,625', '0'], ['−7', '4', null, '−1,75', '0'], ['19,6', '7', 1, '2,8', '0'],
  ];
  for (const [a, b, c, q, r] of casos) {
    const { cociente, resto, exacta } = D.dividir(d(a), d(b), c);
    assert.equal(txt(cociente), q, `${a} : ${b} cociente`);
    assert.equal(txt(resto), r, `${a} : ${b} resto`);
    assert.equal(exacta, r === '0');
    // La prueba: divisor · cociente + resto = dividendo.
    assert.ok(D.sumar(D.multiplicar(d(b), cociente), resto).equals(d(a)), `${a} : ${b} prueba`);
  }
  assert.throws(() => D.dividir(1, 0), /entre 0/);
});

test('decimales: ×/÷ por potencias de 10, redondear y truncar (tabla a mano)', () => {
  const p10 = [['2,5', 2, '250'], ['3', -3, '0,003'], ['0,25', 1, '2,5'], ['4,507', 3, '4507'], ['45', -1, '4,5'], ['0,07', 2, '7']];
  for (const [a, n, r] of p10) assert.equal(txt(D.porPotenciaDe10(d(a), n).normalizar()), r, `${a} · 10^${n}`);
  const red = [['2,96', 1, '3,0'], ['3,649', 1, '3,6'], ['3,65', 1, '3,7'], ['3,45', 0, '3'], ['3,5', 0, '4'], ['−2,45', 1, '−2,5'],
    ['0,996', 2, '1,00'], ['7,25', 1, '7,3'], ['3,5', 2, '3,50'], ['12,349', 2, '12,35']];
  for (const [a, c, r] of red) assert.equal(txt(D.redondear(d(a), c)), r, `redondear ${a} a ${c}`);
  assert.equal(txt(D.truncar(d('3,68'), 1)), '3,6');
  assert.equal(txt(D.truncar(d('−3,68'), 1)), '−3,6');
});

/** Un decimal al azar con `k` cifras, también negativo. */
const alAzar = (rng, k = rng.entero(0, 3)) => D.decimal(rng.entero(-99999, 99999), k);
/** El valor exacto como fracción de BigInt: [num, 10^k]. */
const big = x => [BigInt(x.m), 10n ** BigInt(x.k)];

test('decimales: 3000 casos al azar contra BigInt (suma, resta, producto, comparación, redondeo, potencias de 10)', () => {
  const rng = crearRng(122);
  for (let i = 0; i < 3000; i++) {
    const a = alAzar(rng), b = alAzar(rng);
    const [na, da] = big(a), [nb, db] = big(b);
    const igual = (x, num, den, que) => { const [nx, dx] = big(x); assert.equal(nx * den, num * dx, `${que}: ${txt(a)}, ${txt(b)} → ${txt(x)}`); };
    igual(D.sumar(a, b), na * db + nb * da, da * db, 'suma');
    igual(D.restar(a, b), na * db - nb * da, da * db, 'resta');
    igual(D.multiplicar(a, b), na * nb, da * db, 'producto');
    const c = na * db - nb * da;
    assert.equal(D.comparar(a, b), c > 0n ? 1 : c < 0n ? -1 : 0, `comparar ${txt(a)} ${txt(b)}`);
    const n = rng.entero(-3, 3);
    igual(D.porPotenciaDe10(a, n), n >= 0 ? na * 10n ** BigInt(n) : na, n >= 0 ? da : da * 10n ** BigInt(-n), 'potencia de 10');
    // Redondear: |a − r| ≤ media unidad del orden, con el 5 hacia arriba en valor absoluto.
    const cifras = rng.entero(0, 2);
    const r = D.redondear(a, cifras);
    assert.equal(r.k, cifras);
    const [nr, dr] = big(r);
    // |a − r| · da · dr comparado con media unidad del orden (· da · dr), todo por 2 · 10^cifras para quedarse en enteros.
    const dif = na * dr - nr * da;
    const doble = (dif < 0n ? -dif : dif) * 2n * 10n ** BigInt(cifras);
    assert.ok(doble <= da * dr, `redondear ${txt(a)} a ${cifras} → ${txt(r)}`);
    if (doble === da * dr) assert.ok((nr < 0n ? -nr : nr) * da > (na < 0n ? -na : na) * dr, `el 5 sube: ${txt(a)} → ${txt(r)}`);
    // Dividir con dos cifras: la prueba cuadra y |resto| < |divisor| · 0,01.
    if (b.m !== 0) {
      const { cociente, resto } = D.dividir(a, b, 2);
      assert.ok(D.sumar(D.multiplicar(b, cociente), resto).equals(a), `prueba de ${txt(a)} : ${txt(b)}`);
      assert.ok(D.comparar(resto.abs(), D.multiplicar(b.abs(), D.decimal(1, 2))) < 0, `resto de ${txt(a)} : ${txt(b)}`);
    }
  }
});

test('decimales: comparar y ordenar, también con fracciones; intercalar', () => {
  assert.equal(D.comparar(d('3,9'), d('3,10')), 1);
  assert.equal(D.comparar(d('0,5'), fraccion(1, 2)), 0);
  assert.equal(D.comparar(fraccion(3, 4), d('0,7')), 1);
  assert.equal(D.comparar(fraccion(1, 3), d('0,33')), 1, '1/3 > 0,33');
  assert.deepEqual(D.ordenar(['3,1', '3,09', '3,9', '−3,9', '3,10'].map(d)).map(txt), ['−3,9', '3,09', '3,1', '3,10', '3,9']);
  assert.deepEqual(D.ordenar(['0,5', '0,45'].map(d), { descendente: true }).map(txt), ['0,5', '0,45']);
  const entre = [['3,4', '3,5', '3,41'], ['2', '3', '2,1'], ['0,99', '1', '0,991'], ['−1,2', '−1,1', '−1,19'], ['3,5', '3,4', '3,41'], ['1,5', '1,52', '1,51']];
  for (const [a, b, r] of entre) {
    const x = D.entreDos(d(a), d(b));
    assert.equal(txt(x), r, `entre ${a} y ${b}`);
  }
  const rng = crearRng(9);
  for (let i = 0; i < 500; i++) {
    const a = alAzar(rng), b = alAzar(rng);
    if (a.equals(b)) continue;
    const x = D.entreDos(a, b);
    assert.ok(D.comparar(x, D.ordenar([a, b])[0]) > 0 && D.comparar(x, D.ordenar([a, b])[1]) < 0, `entre ${txt(a)} y ${txt(b)}: ${txt(x)}`);
  }
  assert.throws(() => D.entreDos(d('2,5'), d('2,50')), /iguales/);
});

test('decimales: descomponer y fracción decimal', () => {
  assert.deepEqual(D.descomponer(d('4,507')).map(t => [t.cifra, t.exponente, txt(t.valor)]), [[4, 0, '4'], [5, -1, '0,5'], [0, -2, '0'], [7, -3, '0,007']]);
  assert.deepEqual(D.descomponer(d('30,02'), { soloNoNulas: true }).map(t => txt(t.valor)), ['30', '0,02']);
  assert.deepEqual(D.descomponer(d('0,05')).map(t => t.exponente), [0, -1, -2]);
  assert.equal(D.ORDENES[-2].en, 'hundredths');
  assert.equal(D.ORDENES[-1].singular.es, 'décima');
  assert.equal(D.aFraccionDecimal(d('3,75')).toString(), '375/100');
  assert.ok(D.aFraccionDecimal(d('3,75')).mismaForma(fraccion(375, 100)));
  assert.ok(D.aFraccion(d('3,75')).mismaForma(fraccion(15, 4)));
  assert.ok(D.aFraccion(d('1,25')).mismaForma(fraccion(5, 4)), 'impropia, sin mixto');
  assert.ok(D.aFraccion(d('−0,5')).mismaForma(fraccion(-1, 2)));
  assert.ok(D.aFraccion(d('0,50')) instanceof Fraccion);
  const exactas = [[1, 2, '0,5'], [1, 4, '0,25'], [3, 4, '0,75'], [1, 5, '0,2'], [1, 10, '0,1'], [1, 100, '0,01'], [7, 20, '0,35'], [7, 8, '0,875'], [9, 4, '2,25'], [6, 8, '0,75'], [-3, 4, '−0,75']];
  for (const [n, den, r] of exactas) assert.equal(txt(D.deFraccion(fraccion(n, den))), r, `${n}/${den}`);
  for (const [n, den] of [[1, 3], [2, 3], [1, 6], [5, 7], [1, 12]]) assert.equal(D.deFraccion(fraccion(n, den)), null, `${n}/${den} es periódico`);
  // Ida y vuelta, contra Fraccion.
  const rng = crearRng(3);
  for (let i = 0; i < 500; i++) {
    const x = alAzar(rng);
    const f = D.aFraccion(x);
    assert.ok(f.esIrreducible());
    assert.ok(f.equals(fraccion(x.m, 10 ** x.k)));
    assert.ok(D.deFraccion(f).equals(x));
  }
});

test('decimales: aTexto y deTexto, con coma o punto en los dos idiomas', () => {
  assert.equal(D.aTexto(d('3,75'), 'es'), '3,75');
  assert.equal(D.aTexto(d('3,75'), 'en'), '3.75');
  assert.equal(D.aTexto(d('-3,05'), 'en'), '−3.05');
  assert.equal(D.aTexto(d('2,5'), 'es', 2), '2,50');
  assert.equal(D.aTexto(d('0,007'), 'es'), '0,007');
  assert.throws(() => D.aTexto(d('2,567'), 'es', 2), /más de 2/);
  assert.equal(D.fmtDecimal, D.aTexto);
  assert.equal(D.leerDecimal, D.deTexto);
  const buenos = [['3,75', '3,75'], ['3.75', '3,75'], [' 3,75 ', '3,75'], ['.5', '0,5'], [',5', '0,5'], ['0.05', '0,05'], ['12', '12'],
    ['-2,5', '−2,5'], ['−2,5', '−2,5'], ['–2,5', '−2,5'], ['- 4', '−4'], ['2,50', '2,50'], ['1.234', '1,234'], ['007', '7']];
  for (const [t, r] of buenos) assert.equal(txt(D.deTexto(t)), r, `«${t}»`);
  for (const t of ['1.234,5', '1,234.5', '1,2,3', '3,', '3.', '', ' ', ',', '.', 'abc', '3,7a', '3 ,75', '3,7 5', '--3', '+3', '3e2', null, undefined, '1/2', '½']) {
    assert.equal(D.deTexto(t), null, `«${t}» no vale`);
  }
});

test('decimales: en palabras y todas las lecturas que valen', () => {
  const en = [['3,75', 'three point seven five'], ['0,05', 'nought point nought five'], ['12,5', 'twelve point five'], ['−0,4', 'minus nought point four'], ['7', 'seven'], ['40,013', 'forty point nought one three']];
  for (const [x, r] of en) assert.equal(D.enPalabras(d(x), 'en'), r);
  const es = [['3,75', 'tres coma setenta y cinco'], ['0,05', 'cero coma cero cinco'], ['3,5', 'tres coma cinco'], ['−1,2', 'menos uno coma dos'], ['21,021', 'veintiuno coma cero veintiuno']];
  for (const [x, r] of es) assert.equal(D.enPalabras(d(x), 'es'), r);
  const l = D.lecturasValidas(d('0,5'), 'en');
  for (const v of ['nought point five', 'zero point five', 'point five']) assert.ok(l.includes(v), v);
  assert.ok(D.lecturasValidas(d('0,05'), 'en').includes('zero point zero five'));
  assert.ok(!D.lecturasValidas(d('3,75'), 'en').includes('three point seventy-five'), 'la del precio no es la lectura del decimal');
  assert.deepEqual(D.lecturasValidas(d('3,75'), 'es'), ['tres coma setenta y cinco', 'tres unidades y setenta y cinco centésimas']);
  assert.ok(D.lecturasValidas(d('0,21'), 'es').includes('veintiuna centésimas'));
  assert.ok(D.lecturasValidas(d('1,001'), 'es').includes('una unidad y una milésima'));
  assert.ok(D.lecturasValidas(d('0,201'), 'es').includes('doscientas una milésimas'));
  assert.ok(D.esLecturaValida(d('3,75'), 'Three-point seven  five', 'en'));
  assert.ok(D.esLecturaValida(d('3,75'), 'TRES COMA SETENTA Y CINCO', 'es'));
  assert.ok(!D.esLecturaValida(d('3,75'), 'thirty-seven point five', 'en'));
  assert.ok(!D.esLecturaValida(d('3,75'), 'seven point three five', 'en'));
  // Ninguna lectura de un decimal es lectura de otro distinto.
  const rng = crearRng(5);
  for (let i = 0; i < 300; i++) {
    const a = alAzar(rng, rng.entero(0, 3)), b = alAzar(rng, rng.entero(0, 3));
    if (a.equals(b)) continue;
    for (const idioma of ['en', 'es']) for (const lec of D.lecturasValidas(a, idioma)) assert.ok(!D.esLecturaValida(b, lec, idioma), `${lec} ≠ ${txt(b)}`);
  }
});

test('decimales: dinero, con dos cifras, y sus lecturas', () => {
  assert.equal(D.dinero(d('3,75')), '3,75 €');
  assert.equal(D.dinero(d('3,5'), 'en'), '€3.50');
  assert.equal(D.dinero(d('12')), '12,00 €');
  assert.equal(D.dineroEnPalabras(d('3,75'), 'en'), 'three euros seventy-five');
  assert.equal(D.dineroEnPalabras(d('1,01'), 'en'), 'one euro one');
  assert.equal(D.dineroEnPalabras(d('0,05'), 'en'), 'five cents');
  assert.equal(D.dineroEnPalabras(d('3'), 'en'), 'three euros');
  assert.equal(D.dineroEnPalabras(d('3,75'), 'es'), 'tres euros con setenta y cinco céntimos');
  assert.equal(D.dineroEnPalabras(d('21,01'), 'es'), 'veintiún euros con un céntimo');
  assert.equal(D.dineroEnPalabras(d('0,21'), 'es'), 'veintiún céntimos');
  assert.ok(D.lecturasDinero(d('3,75'), 'en').includes('three euros and seventy-five cents'));
  assert.ok(D.lecturasDinero(d('3,75'), 'es').includes('tres euros con setenta y cinco'));
  assert.throws(() => D.dineroEnPalabras(d('3,755')), /dinero/);
});

test('decimales: cada error típico da el cálculo equivocado con los números del ítem, o null si coincide con el bueno', () => {
  const s = x => (x === null ? null : x instanceof Fraccion ? x.toString() : typeof x === 'number' ? x : txt(x));
  assert.equal(D.compararPorCifras(d('3,9'), d('3,10')), -1, 'dice 3,9 < 3,10');
  assert.equal(D.compararPorCifras(d('3,5'), d('3,25')), -1);
  assert.equal(D.compararPorCifras(d('3,25'), d('3,5')), 1);
  assert.equal(D.compararPorCifras(d('3,4'), d('3,5')), null, 'con las mismas cifras acierta');
  assert.equal(s(D.alinearDerecha(d('2,5'), d('1,25'))), '1,50');
  assert.equal(s(D.alinearDerecha(d('2,5'), d('1,5'))), null);
  assert.equal(s(D.comaMalPuesta(d('1,2'), d('0,3'))), '3,6');
  assert.equal(s(D.comaMalPuesta(d('3'), d('1,45'))), null, 'con un natural no hay dónde equivocarse así');
  assert.equal(s(D.porDiezAnadiendoCero(d('2,5'))), '2,50');
  assert.equal(s(D.porDiezAnadiendoCero(d('0'))), null);
  assert.equal(s(D.entreDiezQuitandoCero(d('2,50'))), '2,5');
  assert.equal(D.entreDiezQuitandoCero(d('30')), null, '30 : 10 = 3 está bien');
  assert.equal(D.entreDiezQuitandoCero(d('2,5')), null);
  assert.equal(s(D.redondearTruncando(d('3,68'), 1)), '3,6');
  assert.equal(D.redondearTruncando(d('3,62'), 1), null);
  assert.equal(s(D.redondearEnCadena(d('3,649'), 1)), '3,7');
  assert.equal(D.redondearEnCadena(d('3,68'), 1), null);
  assert.equal(s(D.olvidarComaCociente(d('7,5'), d('3'))), '25');
  assert.equal(s(D.restoSinDeshacer(d('6,384'), d('0,49'))), '0,42');
  assert.equal(D.restoSinDeshacer(d('10'), d('3')), null, 'divisor natural: nada que deshacer');
  assert.equal(s(D.periodicoPorRedondeo(fraccion(1, 3))), '0,33');
  assert.equal(s(D.periodicoPorRedondeo(fraccion(2, 3))), '0,67');
  assert.equal(D.periodicoPorRedondeo(fraccion(3, 4)), null);
  assert.equal(s(D.decimasPorCentesimas(d('0,05'))), '0,5');
  assert.equal(s(D.fraccionAlReves(fraccion(3, 4))), '1,33');
  assert.equal(s(D.denominadorEquivocado(d('0,75'))), '75/10');
  assert.equal(s(D.denominadorEquivocado(d('0,5'))), '5/100');
  assert.equal(s(D.centimosPorEuros(5)), '0,5');
  assert.equal(D.centimosPorEuros(50), null);
  assert.equal(s(D.signoPerdido(d('−2,25'))), '2,25');
  assert.equal(s(D.comaSoloEnDivisor(d('7,5'), d('2,5'))), '0,3');
  assert.equal(D.comaSoloEnDivisor(d('7,5'), d('3')), null);
  assert.equal(s(D.numeradorComoDecimas(fraccion(3, 4))), '0,34');
  assert.equal(s(D.redondearOtroOrden(d('3,649'), 1)), '3,65');
  assert.equal(D.redondearOtroOrden(d('3,64'), 1), null, 'con una cifra más de las pedidas no hay otro orden');
  assert.equal(D.aTextoPeriodico(fraccion(1, 3)), '0,333…');
  assert.equal(D.aTextoPeriodico(fraccion(1, 6), 'en'), '0.166…');
  assert.equal(D.aTextoPeriodico(fraccion(3, 4)), '0,75', 'exacto, sin puntos suspensivos');
  assert.deepEqual(Object.keys(D.APLICA_A).sort(), Object.keys(D.ERRORES_TIPICOS).sort(), 'cada error dice a qué cálculo se aplica');
  for (const [id, e] of Object.entries(D.ERRORES_TIPICOS)) {
    assert.match(id, /^[a-z0-9-]{1,40}$/);
    assert.ok(e.nombre.es && e.nombre.en && e.ejemplo && typeof e.fn === 'function', id);
    assert.ok(!/×/.test(e.ejemplo + e.nombre.es + e.nombre.en), `${id}: producto con ·`);
  }
});

test('decimales: los errores, por fuerza bruta, nunca dan el valor bueno; distractores sin dos iguales', () => {
  const rng = crearRng(11);
  for (let i = 0; i < 1000; i++) {
    const a = alAzar(rng), b = alAzar(rng);
    const bien = { suma: D.sumar(a, b), producto: D.multiplicar(a, b) };
    for (const [mal, buena] of [[D.alinearDerecha(a, b), bien.suma], [D.alinearDerecha(a, b, '−'), D.restar(a, b)], [D.comaMalPuesta(a, b), bien.producto],
      [D.porDiezAnadiendoCero(a), D.porPotenciaDe10(a, 1)], [D.entreDiezQuitandoCero(a), D.porPotenciaDe10(a, -1)],
      [D.redondearTruncando(a, 1), D.redondear(a, 1)], [D.redondearEnCadena(a, 1), D.redondear(a, 1)]]) {
      if (mal !== null) assert.ok(!D.mismoValor(mal, buena), `${txt(a)}, ${txt(b)}`);
    }
    const c = D.compararPorCifras(a, b);
    if (c !== null) assert.notEqual(c, D.comparar(a, b));
    if (b.m !== 0) {
      const { cociente, resto } = D.dividir(a, b, 2);
      const o = D.olvidarComaCociente(a, b, 2), r = D.restoSinDeshacer(a, b);
      if (o !== null) assert.ok(!D.mismoValor(o, cociente));
      if (r !== null) assert.ok(!D.mismoValor(r, resto));
    }
  }
  const correcta = D.multiplicar(d('1,2'), d('0,3'));
  const ds = D.distractores([['coma-mal-puesta', d('1,2'), d('0,3')], ['coma-mal-puesta', d('1,2'), d('0,3'), 2], ['por-diez-anadiendo-cero', d('0,36')], ['alinea-a-la-derecha', d('1,2'), d('0,3')]], correcta);
  assert.deepEqual(ds.map(x => [x.error, txt(x.valor)]), [['coma-mal-puesta', '3,6'], ['coma-mal-puesta', '36']], 'el de 0,360 vale lo mismo que 0,36 y se descarta');
  assert.ok(!D.hayIguales([correcta, ...ds.map(x => x.valor)]));
  assert.ok(D.hayIguales([d('0,5'), fraccion(1, 2)]), '0,5 y 1/2 son la misma respuesta');
  assert.ok(D.hayIguales([d('0,5'), d('0,50')]));
  assert.ok(D.mismoValor(fraccion(2, 4), d('0,5')));
  assert.ok(!D.mismoValor(fraccion(1, 3), d('0,33')));
  assert.throws(() => D.distractores([['inventado']], correcta), /desconocido/);
});

test('recta de decimales: marcas, grandes, números, índices y la más cercana a un toque', () => {
  const o = opcionesRecta({ desde: '3', hasta: '4', cifras: 2 });
  assert.equal(o.n, 101);
  assert.equal(o.grandes, 1);
  assert.equal(o.tocables, 'grandes', 'con 101 marcas solo se tocan las grandes');
  const ms = marcasDecimales(o);
  assert.equal(ms.filter(m => m.grande).length, 11);
  assert.deepEqual(ms.filter(m => m.numero).map(m => textoDeMarca(m.valor, o)), ['3', '3,1', '3,2', '3,3', '3,4', '3,5', '3,6', '3,7', '3,8', '3,9', '4']);
  assert.equal(txt(valorDeMarca(45, o)), '3,45');
  assert.equal(indiceDe(d('3,45'), o), 45);
  assert.equal(indiceDe(d('3,456'), o), null, 'no cae en una marca');
  assert.equal(indiceDe(d('5'), o), null, 'fuera del tramo');
  const geo = geometriaDecimales(o);
  assert.equal(geo.x(0), 20);
  assert.equal(geo.x(100), ANCHO_RECTA_DECIMALES - 20);
  assert.equal(geo.coord(d('3,5')), geo.x(50));
  assert.ok(Math.abs(geo.coord(d('3,456')) - (geo.x(45) + geo.x(46)) / 2 - 0.6 * (geo.x(46) - geo.x(45)) + 0.5 * (geo.x(46) - geo.x(45))) < 1e-9);
  assert.equal(txt(marcaMasCercanaDecimales(geo.x(45) + 1, o).valor), '3,45');
  assert.equal(txt(marcaMasCercanaDecimales(geo.x(45) + 1, o, { soloTocables: true }).valor), '3,50');
  assert.equal(txt(marcaMasCercanaDecimales(-50, o).valor), '3,00', 'fuera, el extremo');
  assert.ok(geo.fuente >= 9 && geo.fuente <= 14);
  // A 375 px, once números con coma caben sin montarse.
  for (let j = 1; j < 11; j++) assert.ok(geo.x(j * 10) - geo.x((j - 1) * 10) >= 3 * geo.fuente * 0.6);
  // Décimas de 0 a 1, todas tocables; en inglés, con punto.
  const p = opcionesRecta({ desde: 0, hasta: 1, cifras: 1, idioma: 'en', numeros: 'extremos' });
  assert.equal(p.tocables, 'todas');
  assert.deepEqual(marcasDecimales(p).filter(m => m.numero).map(m => textoDeMarca(m.valor, p)), ['0', '1']);
  assert.equal(textoDeMarca(d('0,3'), { ...p, grandes: 1 }), '0.3');
  // Negativos: de −1 a 0 en décimas.
  const neg = opcionesRecta({ desde: '-1', hasta: '0', cifras: 1, numeros: ['−0,5'] });
  assert.deepEqual(marcasDecimales(neg).filter(m => m.numero).map(m => txt(m.valor)), ['−0,5']);
  assert.deepEqual(marcasDecimales(neg).filter(m => m.grande).map(m => txt(m.valor)), ['−1,0', '0,0']);
  assert.equal(txt(puntoMedio(d('3,4'), d('3,5'))), '3,45');
  assert.throws(() => opcionesRecta({ desde: 4, hasta: 3, cifras: 1 }), /sin tramo/);
  assert.throws(() => opcionesRecta({ desde: 0, hasta: 2, cifras: 2 }), /como mucho/);
  assert.throws(() => opcionesRecta({ desde: '0,05', hasta: 1, cifras: 1 }), /caer en una marca/);
});
