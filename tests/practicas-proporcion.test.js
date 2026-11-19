// Proporcionalidad y porcentajes de la unidad 7 (practicas/_comun/proporcion.js, tarea 211): una
// tabla de casos hechos a mano, 3000 casos al azar contra aritmética entera propia con BigInt por un
// segundo camino, la comparación por valor, lo que teclea el alumno, la escritura y la lectura en
// los dos idiomas, los errores típicos, la huella y el banco de contextos con sus cotas.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as P from '../practicas/_comun/proporcion.js';
import { Fraccion, fraccion } from '../practicas/_comun/fracciones.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { huella as huellaEquivalentes } from '../practicas/equivalentes/logica.js';
import { huella as huellaAlgebra } from '../practicas/_comun/algebra.js';

const c = (v, u = null) => P.cantidad(v, u);
const es = x => P.aTexto(x, 'es');
const en = x => P.aTexto(x, 'en');
const lineas = (r, idioma = 'es') => r.pasos.map(p => p[idioma]);
const N = ' ', T = ' ';
/** ¿Vale la Fraccion f lo mismo que el racional n/d (BigInt)? */
const igualQue = (f, n, d) => BigInt(f.num) * d === n * BigInt(f.den);

test('proporción: la cantidad es inmutable, exacta y compara por valor (regla 1)', () => {
  const x = c('3,5', 'km');
  assert.ok(Object.isFrozen(x));
  assert.ok(x.valor instanceof Fraccion && x.valor.num === 7 && x.valor.den === 2);
  assert.equal(x.magnitud(), 'longitud');
  assert.ok(x.valorBase().equals(3500));
  assert.ok(c(20, '%').valorBase().equals(fraccion(1, 5)));
  assert.equal(es(c(2500, 'm').enUnidad('km')), `2,5${N}km`);
  assert.throws(() => c(1, 'kilo'), /no es una unidad/);
  assert.throws(() => c(2, 'kg').enUnidad('m'), /misma magnitud/);
  const iguales = [['20 %', '0,2'], ['20 %', '1/5'], ['0,2', '1/5'], ['3/4', '6/8'], ['3/4', '0,75'], ['3/4', '75 %'], ['2,5 km', '2500 m'],
    ['12 €', '12,00 €'], ['12 €', '1200 céntimos'], ['1,5 h', '90 min'], ['1,5 h', '1 h 30 min'], ['250 mL', '0,25 L'], [9, '9 €'], ['120 %', '1,2'],
    ['3 m²', '300 dm²'], ['1 t', '1000 kg'], ['3 : 4', '0,75']];
  for (const [a, b] of iguales) assert.ok(P.mismoValor(a, b), `${a} = ${b}`);
  const distintos = [['0,33', '1/3'], ['20 %', 20], ['20 %', '0,02'], ['2,5 km', '2,5 m'], ['1,5 h', '1 h 50 min'], ['9 €', '9 kg'], ['3/4', '4/3'], ['12 €', '12 cm']];
  for (const [a, b] of distintos) assert.ok(!P.mismoValor(a, b), `${a} ≠ ${b}`);
  assert.ok(P.mismoValor([c(48, '€'), c(72, '€')], ['48,00 €', '72 €']), 'listas, elemento a elemento');
  assert.ok(!P.mismoValor([c(48, '€'), c(72, '€')], ['72 €', '48 €']), 'en su orden');
  assert.ok(P.hayEquivalentes(['20 %', '0,3', '1/5']) && !P.hayEquivalentes(['20 %', '0,3', '1/4']));
});

test('proporción: la tabla hecha a mano (proporciones, tablas, directa, inversa, porcentajes, repartos, escalas, unidades)', () => {
  // Proporciones y término que falta.
  assert.deepEqual(P.sonProporcion(4, 6, 10, 15).productos.map(String), ['60', '60']);
  assert.equal(P.sonProporcion(4, 6, 10, 15).resultado, true);
  assert.equal(P.sonProporcion(3, 5, 5, 7).resultado, false);
  assert.ok(P.terminoQueFalta(3, 4, null, 20).resultado.equals(15));
  assert.ok(P.terminoQueFalta(3, 4, 6, null).resultado.equals(8));
  assert.ok(P.terminoQueFalta(null, 20, 3, 4).resultado.equals(15));
  assert.ok(P.terminoQueFalta(15, 20, 12, null).resultado.equals(16));
  assert.deepEqual(lineas(P.terminoQueFalta(3, 4, null, 20)), ['3/4 = x/20', '4x = 3 · 20', '4x = 60', 'x = 60 : 4', 'x = 15']);
  assert.deepEqual(lineas(P.terminoQueFalta(3, 4, 6, null)), ['3/4 = 6/x', '3x = 4 · 6', '3x = 24', 'x = 24 : 3', 'x = 8']);
  // Tablas.
  assert.ok(P.esTablaDirecta([[1, '1,20'], [2, '2,40'], [3, '3,60'], [5, 6]]).constante.equals(fraccion(6, 5)));
  assert.equal(P.esTablaDirecta([[2, 3], [4, 5], [6, 7]]).resultado, false, 'la que suma en vez de multiplicar');
  assert.ok(P.esTablaInversa([[2, 12], [3, 8], [4, 6], [6, 4]]).constante.equals(24));
  assert.equal(P.esTablaInversa([[2, 12], [3, 9]]).resultado, false);
  assert.deepEqual(P.completarTabla([[2, 12], [3, null], [null, 6]], 'inversa').resultado.map(([x, y]) => `${x}-${y}`), ['2-12', '3-8', '4-6']);
  assert.deepEqual(P.completarTabla([[1, '1,20'], [5, null], [null, '3,60']]).resultado.map(([x, y]) => `${x}-${es(y)}`), ['1-1,2', '5-6', '3-3,6']);
  // Directa: los tres métodos.
  const naranjas = { a: '3 kg', b: '4,50 €', c: '5 kg' };
  for (const m of ['regla-de-tres', 'unidad', 'constante']) assert.equal(es(P.proporcionDirecta(naranjas, m).resultado), `7,50${N}€`, m);
  assert.deepEqual(lineas(P.proporcionDirecta(naranjas, 'unidad')), [`4,50${N}€ : 3 = 1,50${N}€`, `5 · 1,50${N}€ = 7,50${N}€`]);
  assert.deepEqual(lineas(P.proporcionDirecta(naranjas)), ['3/5 = 4,5/x', '3x = 5 · 4,5', '3x = 22,5', 'x = 22,5 : 3', 'x = 7,5']);
  assert.equal(es(P.proporcionDirecta({ a: '15 m', b: '12 €', c: '20 m' }).resultado), `16,00${N}€`);
  const queso = P.proporcionDirecta({ a: '250 g', b: '4 €', c: '1,5 kg' });
  assert.equal(es(queso.resultado), `24,00${N}€`, 'con el cambio de unidad dentro');
  assert.equal(queso.pasos[0].es, `1,5${N}kg = 1500${N}g`);
  assert.equal(es(P.proporcionDirecta({ a: '90 min', b: '150 km', c: '150 min' }).resultado), `250${N}km`);
  // Inversa.
  assert.equal(es(P.proporcionInversa({ a: 6, b: 10, c: 4 }).resultado), '15');
  assert.equal(es(P.proporcionInversa({ a: 6, b: 10, c: 4 }, 'producto').resultado), '15');
  assert.deepEqual(lineas(P.proporcionInversa({ a: 6, b: 10, c: 4 })), ['6/4 = x/10', '4x = 6 · 10', '4x = 60', 'x = 60 : 4', 'x = 15']);
  assert.equal(P.proporcionInversa({ a: 6, b: 10, c: 4 }).comprobacion.es, '6 · 10 = 4 · 15 = 60');
  assert.equal(es(P.proporcionInversa({ a: 8, b: '225 min', c: 6 }).resultado), `300${N}min`);
  // Porcentajes.
  for (const m of ['fraccion', 'decimal', 'diez', 'uno', 'regla-de-tres']) assert.equal(es(P.porcentajeDe(20, 150, m).resultado), '30', m);
  assert.deepEqual(lineas(P.porcentajeDe(20, 150)), [`20${N}% de 150 = 20/100 · 150`, '20/100 · 150 = 30']);
  assert.deepEqual(lineas(P.porcentajeDe(15, 80, 'decimal'), 'en'), ['15% = 0.15', '0.15 · 80 = 12']);
  assert.deepEqual(lineas(P.porcentajeDe(5, 340, 'diez')), [`10${N}% de 340 = 340 : 10 = 34`, `5${N}% de 340 = 34 : 2 = 17`]);
  assert.equal(es(P.porcentajeDe(150, 20).resultado), '30');
  assert.equal(es(P.porcentajeDe('0,5', 1000).resultado), '5');
  assert.equal(es(P.porcentajeDe('12,5', 64).resultado), '8');
  assert.equal(es(P.porcentajeDe(15, '4 km').resultado), `0,6${N}km`);
  assert.equal(es(P.quePorcentaje(30, 150).resultado), `20${N}%`);
  assert.deepEqual(lineas(P.quePorcentaje(30, 150)), ['30/150 = 1/5', `1/5 = 20/100`, `20/100 = 20${N}%`]);
  assert.deepEqual(lineas(P.quePorcentaje(3, 25)), ['3/25 = 12/100', `12/100 = 12${N}%`]);
  assert.equal(es(P.quePorcentaje(9, 12).resultado), `75${N}%`);
  assert.equal(P.quePorcentaje(1, 3), null, 'un periódico no es un porcentaje exacto');
  assert.equal(es(P.totalDesdePorcentaje(20, 30).resultado), '150');
  assert.equal(es(P.totalDesdePorcentaje(32, 480).resultado), '1500');
  assert.equal(es(P.totalDesdePorcentaje(25, 12).resultado), '48');
  const chaqueta = P.aplicarPorcentaje('45 €', 20);
  assert.deepEqual([es(chaqueta.cambio), es(chaqueta.final), P.numeroATexto(chaqueta.factor, 'es', { cifras: 2 })], [`9,00${N}€`, `36,00${N}€`, '0,80']);
  assert.deepEqual(chaqueta.pasosComplementario.map(p => p.es), [`100${N}% − 20${N}% = 80${N}%`, `80${N}% de 45,00${N}€ = 36,00${N}€`]);
  assert.equal(chaqueta.pasosUnPaso[1].es, `0,80 · 45,00${N}€ = 36,00${N}€`);
  assert.equal(es(P.aplicarPorcentaje('50 €', 21, 'aumento').final), `60,50${N}€`);
  assert.equal(P.aplicarPorcentaje('50 €', 21, 'aumento').pasosUnPaso[1].en, '1.21 · €50.00 = €60.50');
  assert.equal(es(P.aplicarPorcentaje('80 €', 5, 'aumento').final), `84,00${N}€`);
  assert.equal(es(P.aplicarPorcentaje('20 €', 4, 'aumento').cambio), `0,80${N}€`);
  // Repartos.
  const r = P.repartir('120 €', [2, 3]);
  assert.deepEqual(r.partes.map(es), [`48,00${N}€`, `72,00${N}€`]);
  assert.equal(es(r.unaParte), `24,00${N}€`);
  assert.equal(r.comprobacion.es, `48,00${N}€ + 72,00${N}€ = 120,00${N}€`);
  assert.deepEqual(P.repartir('300 €', [4, 6, 10]).partes.map(es), [`60,00${N}€`, `90,00${N}€`, `150,00${N}€`]);
  assert.equal(P.repartir(10, [1, 2]), null, 'diez cromos no se reparten en la razón 1 : 2');
  assert.equal(P.repartir('10 €', [1, 2]), null, 'ni diez euros al céntimo');
  // Escalas.
  assert.equal(es(P.realidad('3 cm', 50000, 'km').resultado), `1,5${N}km`);
  assert.deepEqual(lineas(P.realidad('3 cm', 50000, 'km')), [`3${N}cm · 50${T}000 = 150${T}000${N}cm`, `150${T}000${N}cm = 1,5${N}km`]);
  assert.equal(es(P.enElPlano('4,5 m', 50).resultado), `9${N}cm`);
  assert.equal(P.hallarEscala('6 cm', '30 km').resultado, 500000);
  assert.equal(P.hallarEscala('7 cm', '1 m'), null, 'una escala es un natural');
  assert.equal(P.escala.realidad, P.realidad);
  // Unidades.
  assert.equal(es(P.cambiarUnidad('3,5 km', 'm').resultado), `3500${N}m`);
  assert.equal(P.cambiarUnidad('3,5 km', 'm').saltos, 3);
  assert.equal(es(P.cambiarUnidad('25 mm', 'cm').resultado), `2,5${N}cm`);
  assert.equal(es(P.cambiarUnidad('33 cL', 'mL').resultado), `330${N}mL`);
  assert.equal(es(P.cambiarUnidad('1,2 t', 'kg').resultado), `1200${N}kg`);
  assert.equal(P.cambiarUnidad('1,2 t', 'kg').saltos, 3, 'la t no es un escalón, pero el salto es de mil');
  assert.match(P.cambiarUnidad('1,2 t', 'kg').pasos[0].es, /^1 t = 1000 kg/);
  assert.equal(es(P.cambiarUnidad('3 m²', 'dm²').resultado), `300${N}dm²`);
  assert.equal(P.cambiarUnidad('3 m²', 'dm²').saltos, 1);
  assert.equal(es(P.cambiarUnidad('0,75 h', 'min').resultado), `45${N}min`);
  assert.deepEqual(P.aComplejo('1,5 h').partes.map(es), [`1${N}h`, `30${N}min`]);
  assert.deepEqual(P.aComplejo('150 min').partes.map(es), [`2${N}h`, `30${N}min`]);
  assert.deepEqual(P.aComplejo('4250 m').partes.map(es), [`4${N}km`, `250${N}m`]);
  assert.deepEqual(P.aComplejo('2,25 h').partes.map(es), [`2${N}h`, `15${N}min`]);
  assert.equal(P.complejoATexto(P.aComplejo('200 min').partes), `3${N}h 20${N}min`);
  assert.equal(es(P.aIncomplejo(['3 km', '250 m'], 'm').resultado), `3250${N}m`);
  assert.equal(es(P.aIncomplejo(['2 kg', '300 g'], 'kg').resultado), `2,3${N}kg`);
  assert.equal(es(P.aIncomplejo(['2 h', '15 min'], 'h').resultado), `2,25${N}h`);
  // Redondeo: al más cercano, la mitad hacia arriba.
  assert.ok(P.redondear(fraccion(20, 3), 2).equals(fraccion(667, 100)));
  assert.ok(P.redondear(fraccion(5, 2), 0).equals(3));
  assert.ok(P.redondear('2,345', 2).equals(fraccion(235, 100)));
  assert.ok(P.redondear('2,344', 2).equals(fraccion(234, 100)));
});

test('proporción: 3000 casos al azar contra BigInt por un segundo camino', () => {
  const rng = crearRng(211);
  for (let i = 0; i < 3000; i++) {
    // Directa: a kg (décimas), b € (céntimos), c kg; d = b·c/a. Los tres métodos y la cuenta entera.
    const A = rng.entero(1, 80), B = rng.entero(1, 5000), C = rng.entero(1, 80);
    const a = c(fraccion(A, 10), 'kg'), b = c(fraccion(B, 100), '€'), cc = c(fraccion(C, 10), 'kg');
    const d = P.proporcionDirecta({ a, b, c: cc });
    assert.ok(igualQue(d.resultado.valor, BigInt(B) * BigInt(C), 100n * BigInt(A)), `directa ${A} ${B} ${C}`);
    assert.ok(P.mismoValor(d.resultado, P.proporcionDirecta({ a, b, c: cc }, 'unidad').resultado));
    assert.ok(P.mismoValor(d.resultado, P.proporcionDirecta({ a, b, c: cc }, 'constante').resultado));
    // Inversa: a · b = c · d.
    const x = rng.entero(1, 12), y = rng.entero(1, 60), z = rng.entero(1, 12);
    const inv = P.proporcionInversa({ a: x, b: y, c: z });
    assert.ok(igualQue(inv.resultado.valor, BigInt(x * y), BigInt(z)));
    assert.ok(P.mismoValor(inv.resultado, P.proporcionInversa({ a: x, b: y, c: z }, 'producto').resultado));
    // Término que falta: se quita uno de una proporción hecha y vuelve.
    const k = fraccion(rng.entero(1, 9), rng.entero(1, 9));
    const t = [rng.entero(1, 30), null, rng.entero(1, 30), null];
    t[1] = fraccion(t[0], 1).dividir(k); t[3] = fraccion(t[2], 1).dividir(k);
    for (let j = 0; j < 4; j++) {
      const hueco = t.map((v, h) => (h === j ? null : v));
      assert.ok(P.terminoQueFalta(...hueco).resultado.equals(t[j]), `proporción ${t.join(',')} sin el ${j}`);
    }
    assert.equal(P.sonProporcion(...t).resultado, true);
    // Porcentaje de una cantidad: los cinco métodos; y de vuelta, qué porcentaje y el total.
    const p = rng.entero(1, 99), Q = rng.entero(1, 2000);
    const pd = P.porcentajeDe(p, Q);
    assert.ok(igualQue(pd.resultado.valor, BigInt(p * Q), 100n));
    for (const m of ['decimal', 'diez', 'uno', 'regla-de-tres']) assert.ok(P.mismoValor(pd.resultado, P.porcentajeDe(p, Q, m).resultado), m);
    assert.ok(P.mismoValor(P.quePorcentaje(pd.resultado, Q).resultado, c(p, '%')));
    assert.ok(P.mismoValor(P.totalDesdePorcentaje(p, pd.resultado).resultado, Q));
    // Descuento y aumento en céntimos: el precio final contra «precio menos (o más) el cambio», y los tres caminos.
    const precio = rng.entero(100, 120000), q = rng.elegir([4, 5, 10, 15, 20, 21, 25, 30, 40, 50, 60, 70]);
    for (const tipo of ['descuento', 'aumento']) {
      const r = P.aplicarPorcentaje(c(fraccion(precio, 100), '€'), q, tipo);
      const s = tipo === 'descuento' ? -1n : 1n;
      assert.ok(igualQue(r.final.valor, BigInt(precio) * (100n + s * BigInt(q)), 10000n), `${tipo} ${precio} ${q}`);
      assert.ok(igualQue(r.cambio.valor, BigInt(precio) * BigInt(q), 10000n));
      assert.ok(r.final.valor.equals(tipo === 'descuento' ? c(fraccion(precio, 100)).valor.restar(r.cambio.valor) : c(fraccion(precio, 100)).valor.sumar(r.cambio.valor)));
      assert.ok(P.mismoValor(r.final, c(r.factor.multiplicar(fraccion(precio, 100)), '€')), 'en un paso, lo mismo');
    }
    // Reparto: las partes suman el total y están en la razón.
    const razon = Array.from({ length: rng.entero(2, 4) }, () => rng.entero(1, 9));
    const total = rng.entero(1, 60000);
    const rep = P.repartir(c(fraccion(total, 100), '€'), razon);
    const suma = razon.reduce((s, v) => s + v, 0);
    if ((total * 1) % suma === 0) assert.ok(rep, `el reparto de ${total} céntimos en ${razon} es exacto`);
    if (rep) {
      const sumaPartes = rep.partes.reduce((s, x) => s.sumar(x.valor), fraccion(0, 1));
      assert.ok(igualQue(sumaPartes, BigInt(total), 100n), 'las partes suman el total');
      for (let j = 1; j < razon.length; j++) assert.ok(BigInt(rep.partes[0].valor.num) * BigInt(rep.partes[j].valor.den) * BigInt(razon[j]) === BigInt(rep.partes[j].valor.num) * BigInt(rep.partes[0].valor.den) * BigInt(razon[0]));
    } else assert.notEqual(total % suma, 0);
    // Escala: de ida y de vuelta.
    const n = rng.elegir([50, 100, 200, 18, 24, 43, 87, 25000, 50000, 100000, 1000000]);
    const plano = c(fraccion(rng.entero(5, 300), 10), 'cm');
    const real = P.realidad(plano, n, rng.elegir(['m', 'km', 'cm'])).resultado;
    assert.ok(P.mismoValor(P.enElPlano(real, n, 'cm').resultado, plano));
    assert.equal(P.hallarEscala(plano, real).resultado, n);
    // Cambio de unidad: de ida y de vuelta, y el mismo valor.
    const mag = rng.elegir(Object.keys(P.ESCALERAS));
    const i1 = rng.entero(0, 6), i2 = Math.min(6, Math.max(0, i1 + rng.entero(-3, 3)));
    const [u1, u2] = [P.ESCALERAS[mag][i1], P.ESCALERAS[mag][i2]];
    const v = c(fraccion(rng.entero(1, 99999), 100), u1);
    const ida = P.cambiarUnidad(v, u2).resultado;
    assert.ok(P.mismoValor(ida, v) && P.cambiarUnidad(ida, u1).resultado.valor.equals(v.valor));
    // Complejo e incomplejo, de ida y de vuelta.
    const minutos = c(rng.entero(1, 2000), 'min');
    assert.ok(P.mismoValor(P.aIncomplejo(P.aComplejo(minutos).partes, 'min').resultado, minutos));
  }
});

test('proporción: leerCantidad acepta todas las escrituras y rechaza con un motivo', () => {
  const vale = (texto, esperado, opciones = {}) => {
    const r = P.leerCantidad(texto, opciones);
    assert.ok(r.ok, `«${texto}» no se lee: ${r.motivo}`);
    assert.ok(P.mismoValor(r.valor, esperado), `«${texto}» → ${es(r.valor)}, no ${esperado}`);
    assert.equal(r.escrito, texto.trim());
    return r;
  };
  for (const t of ['20 %', '20%', '20 por ciento', '20 per cent', '20 percent', '0,2', '0.2', '1/5', ' 1 / 5 ']) vale(t, '1/5');
  for (const t of ['12 €', '12,00 €', '12.00', '12', '€12', '€ 12.00', '12 euros', '12€', '1200 céntimos']) vale(t, '12 €', { unidad: '€' });
  for (const t of ['2,5 km', '2.5 km', '2500 m', '2 500 m', `2${T}500 m`, '2500m', '2,5 KM', '2,5 Km']) vale(t, '2500 m');
  for (const t of ['1 h 30 min', '1h 30min', '1 h y 30 min', '1,5 h', '90 min', '1.5 hours', '90 minutos']) vale(t, '90 min');
  vale('3 km 250 m', '3250 m');
  vale('2 kg 300 g', '2,3 kg');
  vale('1,5 l', '1500 mL');
  vale('250 ML', '0,25 L');
  vale('50 000', 50000);
  vale('50000', 50000);
  vale('90 km/h', '90 km/h');
  vale('6,5 L/100 km', '6,5 L/100 km');
  vale('1,50 €/kg', '1,5 €/kg');
  vale('3 m2', '300 dm²');
  vale('-3', -3);
  // La razón, solo si se pide.
  for (const t of ['3 : 4', '3:4', '3 a 4', '3 to 4', '3/4', '0,75']) vale(t, '3/4', { razon: true });
  assert.deepEqual(vale('1 : 50 000', fraccion(1, 50000), { razon: true }).razon.map(String), ['1', '50000']);
  vale('1:50000', fraccion(1, 50000), { razon: true });
  assert.equal(P.leerCantidad('3 : 4').motivo, 'expresion', 'sin razon, «:» es dividir');
  // Lo que se escribió se guarda: 6/8 sigue siendo 6/8.
  const seis = P.leerCantidad('6/8');
  assert.equal(seis.forma, 'fraccion');
  assert.deepEqual([seis.fraccion.num, seis.fraccion.den], [6, 8]);
  assert.ok(seis.valor.valor.equals(fraccion(3, 4)));
  assert.deepEqual(P.leerCantidad('12 : 8', { razon: true }).razon.map(String), ['12', '8']);
  assert.equal(P.leerCantidad('0,75').forma, 'decimal');
  assert.equal(P.leerCantidad('75 %').forma, 'porcentaje');
  assert.equal(P.leerCantidad('2500 m').unidadEscrita, 'm');
  // Con la unidad del campo: el número solo vale, y es de esa unidad.
  assert.equal(es(P.deTexto('20', { unidad: '%' })), `20${N}%`);
  assert.equal(es(P.deTexto('0,15', { unidad: '%' })), `0,15${N}%`, 'en un campo de %, 0,15 es el 0,15 %');
  assert.equal(es(P.deTexto('2500 m', { unidad: 'km' })), `2500${N}m`, 'otra unidad de la misma magnitud vale');
  assert.equal(P.leerCantidad('2500 m', { unidad: 'km' }).unidadEscrita, 'm');
  // Los motivos.
  const motivo = (t, m, op = {}) => { const r = P.leerCantidad(t, op); assert.equal(r.ok, false, `«${t}» no debería leerse`); assert.equal(r.motivo, m, `«${t}»`); assert.ok(r.mensaje.es && r.mensaje.en); };
  motivo('', 'vacio');
  motivo('   ', 'vacio');
  motivo('hola', 'basura');
  motivo('3 4', 'basura');
  motivo('12 patatas', 'basura');
  motivo('3 m', 'unidad-que-no-toca', { unidad: '€' });
  motivo('20 %', 'unidad-que-no-toca', { unidad: 'km' });
  motivo('25', 'sin-unidad', { magnitud: 'longitud' });
  motivo('3 kg', 'unidad-que-no-toca', { magnitud: 'longitud' });
  motivo('1,2,3', 'dos-comas');
  motivo('1.2.3', 'dos-comas');
  motivo('1..5', 'basura');
  motivo('50.000', 'millares-con-punto');
  motivo('2.500', 'millares-con-punto');
  motivo('1.234,5', 'millares-con-punto');
  motivo('50,000', 'millares-con-punto', { idioma: 'en' });
  motivo('0,333…', 'periodico');
  motivo('0,333...', 'periodico');
  motivo('3/0', 'division-entre-0');
  motivo('3 : 0', 'division-entre-0', { razon: true });
  motivo('0,2 · 150', 'expresion');
  motivo('45 - 9', 'expresion');
  motivo('20 % de 150', 'expresion');
  motivo('4,50 : 3', 'expresion');
  motivo('2x3', 'expresion');
  assert.equal(P.deTexto('hola'), null);
  // 2,500 en español es 2,5; 1.250 ya es ambiguo.
  vale('2,500', '2,5');
  assert.ok(P.leerCantidad('0.125').ok, '0.125 empieza por 0: no son millares');
});

test('proporción: la escritura sigue la notación de la regla 3', () => {
  const casos = [
    [c(20, '%'), `20${N}%`, '20%'], [c('12,5', '%'), `12,5${N}%`, '12.5%'], [c(50000), `50${T}000`, `50${T}000`], [c(2500), '2500', '2500'],
    [c(1000000), `1${T}000${T}000`, `1${T}000${T}000`], [c('12345,5'), `12${T}345,5`, `12${T}345.5`], [c(12, '€'), `12,00${N}€`, '€12.00'],
    [c('60,5', '€'), `60,50${N}€`, '€60.50'], [c('3,5', 'km'), `3,5${N}km`, `3.5${N}km`], [c(90, 'km/h'), `90${N}km/h`, `90${N}km/h`],
    [c(250, 'mL'), `250${N}mL`, `250${N}mL`], [c(900, 'cent'), `900${N}céntimos`, `900${N}cents`], [c(1, 'cent'), `1${N}céntimo`, `1${N}cent`],
    [c(fraccion(3, 4)), '0,75', '0.75'], [c(fraccion(1, 3)), '1/3', '1/3'], [c(150000, 'cm'), `150${T}000${N}cm`, `150${T}000${N}cm`],
  ];
  for (const [x, e, i] of casos) { assert.equal(es(x), e); assert.equal(en(x), i); }
  assert.equal(P.aHtml(c(fraccion(1, 3), 'kg'), 'es'), `<span class="frac"><span>1</span><span>3</span></span>${N}kg`);
  assert.equal(P.aHtml(c(fraccion(3, 4)), 'es', { forma: 'fraccion' }), '<span class="frac"><span>3</span><span>4</span></span>');
  assert.equal(P.aTexto(c(fraccion(3, 4)), 'es', { forma: 'fraccion' }), '3/4');
  assert.equal(P.razonATexto(12, 8, 'es'), '12/8', 'sin simplificar');
  assert.equal(P.razonATexto(3, 4, 'es', 'palabras'), '3 a 4');
  assert.equal(P.razonATexto(3, 4, 'en', 'palabras'), '3 to 4');
  assert.equal(P.razonATexto(3, 4, 'es', 'de-cada'), '3 de cada 4');
  assert.equal(P.razonATexto(2, 5, 'en', 'de-cada'), '2 out of 5');
  assert.equal(P.razonATexto(2, 3, 'es', 'dos-puntos'), `2${N}:${N}3`);
  assert.equal(P.razonAHtml(3, 4), '<span class="frac"><span>3</span><span>4</span></span>');
  assert.equal(P.escalaATexto(50000), `1${N}:${N}50${T}000`);
  assert.equal(P.escalaATexto(200), `1${N}:${N}200`);
  assert.equal(P.numeroATexto(fraccion(4, 5), 'es', { cifras: 2 }), '0,80');
  // Nada de ×, ni de periódicos, ni de punto decimal en español, en ninguna línea de pasos.
  const rng = crearRng(7);
  for (let i = 0; i < 300; i++) {
    const r = [P.proporcionDirecta({ a: rng.entero(1, 9), b: c(fraccion(rng.entero(1, 999), 100), '€'), c: rng.entero(1, 9) }, rng.elegir(['regla-de-tres', 'unidad', 'constante'])),
      P.aplicarPorcentaje(c(rng.entero(1, 300), '€'), rng.elegir([10, 15, 20, 25]), rng.elegir(['descuento', 'aumento'])), P.porcentajeDe(rng.entero(1, 99), rng.entero(1, 500), 'decimal')];
    for (const x of r) for (const pasos of [x.pasos, x.pasosUnPaso ?? [], x.pasosComplementario ?? []]) for (const l of pasos) {
      assert.ok(!/×/.test(l.es + l.en), l.es);
      assert.ok(!/\d\.\d/.test(l.es), `punto decimal en español: ${l.es}`);
      assert.ok(!/\d,\d/.test(l.en), `coma decimal en inglés: ${l.en}`);
    }
  }
});

test('proporción: en palabras y lecturas válidas, en los dos idiomas', () => {
  assert.equal(P.enPalabras(c(20, '%'), 'en'), 'twenty per cent');
  assert.equal(P.enPalabras(c(20, '%'), 'es'), 'veinte por ciento');
  assert.deepEqual(P.lecturasValidas(c(20, '%'), 'en').sort(), ['twenty per cent', 'twenty percent']);
  assert.equal(P.enPalabras({ razon: [3, 4] }, 'en'), 'three to four');
  assert.equal(P.enPalabras({ razon: [3, 4] }, 'es'), 'tres a cuatro');
  assert.ok(P.esLecturaValida({ razon: [3, 4] }, 'Three is to four', 'en'));
  assert.equal(P.enPalabras({ escala: 50000 }, 'en'), 'one to fifty thousand');
  assert.equal(P.enPalabras({ escala: 50000 }, 'es'), 'uno a cincuenta mil');
  assert.ok(P.esLecturaValida({ escala: 50000 }, 'one in fifty thousand', 'en'));
  assert.equal(P.enPalabras(c('3,5', 'km'), 'en'), 'three point five kilometres');
  assert.equal(P.enPalabras(c('3,5', 'km'), 'es'), 'tres coma cinco kilómetros');
  assert.equal(P.enPalabras(c(1, 'L'), 'en'), 'one litre');
  assert.equal(P.enPalabras(c(90, 'km/h'), 'en'), 'ninety kilometres per hour');
  assert.equal(P.enPalabras(c('3,75', '€'), 'en'), 'three euros seventy-five');
  assert.ok(P.esLecturaValida(c(150, '%'), 'one hundred fifty percent', 'en'), 'sin «and» también');
  assert.ok(P.esLecturaValida(c(150, '%'), 'one hundred and fifty per cent', 'en'));
  assert.ok(!P.esLecturaValida(c(20, '%'), 'two per cent', 'en'));
  // Ninguna lectura de un porcentaje lo es de otro distinto.
  const lista = [5, 15, 20, 25, 50, 75, 150].map(p => c(p, '%'));
  for (const x of lista) for (const y of lista) if (x !== y) for (const l of P.lecturasValidas(x, 'en')) assert.ok(!P.esLecturaValida(y, l, 'en'), `${l}`);
});

test('proporción: cada error típico da lo del ejemplo, y null cuando no sirve', () => {
  const E = (id, ...args) => P.ERRORES_TIPICOS[id].fn(...args);
  const vale = (id, args, esperado) => { const r = E(id, ...args); assert.ok(r !== null, `${id} da null`); assert.ok(P.mismoValor(r, esperado), `${id}: ${Array.isArray(r) ? r.map(es) : es(r)}, no ${esperado}`); };
  vale('razonar-sumando', [2, '5 €', 4], '7 €');
  vale('invertir-razon', [3, 4], '4/3');
  vale('parte-parte-como-parte-todo', [2, 3], '2/3');
  vale('parte-todo-como-parte-parte', [2, 3], '2/5');
  vale('productos-en-linea', [15, 20, 12], 9);
  vale('directa-en-inversa', [6, 10, 3], 5);
  vale('inversa-en-directa', [2, '3 €', 4], '1,50 €');
  vale('no-proporcional-como-proporcional', [5, '8 €', 10, '13 €'], '16 €');
  vale('dividir-entre-el-porcentaje', [20, 50], '2,5');
  vale('porcentaje-entre-mil', [20], '0,02');
  vale('porcentaje-entre-diez', [5], '0,5');
  vale('porcentaje-sin-dividir', [20, 150], 3000);
  vale('restar-el-porcentaje-como-numero', ['50 €', 20], '30 €');
  vale('sumar-el-porcentaje-como-numero', ['50 €', 20], '70 €');
  vale('descuento-por-precio-final', ['45 €', 20], '9 €');
  vale('precio-final-por-descuento', ['45 €', 20], '36 €');
  vale('aumento-por-descuento', ['50 €', 20], '40 €');
  vale('sube-y-baja-se-queda-igual', ['100 €', 20], '100 €');
  vale('porcentaje-del-dato', [20, 30], 6);
  vale('porcentaje-al-reves', [30, 150], '500 %');
  vale('fraccion-sin-pasar-a-porcentaje', [30, 150], '0,2 %');
  vale('reparto-a-partes-iguales', ['120 €', [2, 3]], ['60 €', '60 €']);
  vale('reparto-sin-sumar-las-partes', ['120 €', [2, 3]], ['60 €', '40 €']);
  vale('escala-al-reves', ['3 cm', 50000, 'realidad', 'cm'], fraccion(3, 50000));
  vale('escala-sin-cambio-de-unidad', ['3 cm', 50000, 'realidad', 'km'], '150000 km');
  vale('escala-sin-cambio-de-unidad', ['4,5 m', 50, 'plano', 'cm'], '0,09 cm');
  vale('subir-por-bajar', ['3500 m', 'km'], '3500000 km');
  vale('superficie-por-diez', ['3 m²', 'dm²'], '30 dm²');
  vale('hora-decimal-como-minutos', ['1,5 h'], '110 min');
  vale('minutos-como-hora-decimal', [1, 30], '1,3 h');
  vale('contestar-otra-cosa', ['1,50 €', '7,50 €'], '1,50 €');
  // null cuando coinciden, no se aplican o no son exactos.
  assert.equal(E('dividir-entre-el-porcentaje', 10, 50), null, 'el 10 % de 50 y 50 : 10 coinciden');
  assert.equal(E('directa-en-inversa', 6, 10, 4), null, '6,666… no es una opción');
  assert.equal(E('restar-el-porcentaje-como-numero', '100 €', 20), null, 'con 100, restar 20 da lo mismo');
  assert.equal(E('razonar-sumando', 1, '1 €', 3), null, 'con 1 cuesta 1 €, sumar da lo mismo');
  assert.equal(E('invertir-razon', 5, 5), null);
  assert.equal(E('hora-decimal-como-minutos', '2 h'), null);
  assert.equal(E('superficie-por-diez', '3 m', 'cm'), null, 'solo en superficie');
  assert.equal(E('escala-sin-cambio-de-unidad', '3 cm', 50000, 'realidad', 'cm'), null);
  assert.equal(E('restar-el-porcentaje-como-numero', '15 €', 20), null, 'un precio negativo no es opción');
  // Forma de la tabla: el nombre en los dos idiomas, también como .es y .en (lo usa errores7).
  for (const [id, e] of Object.entries(P.ERRORES_TIPICOS)) {
    assert.ok(e.nombre.es && e.nombre.en && e.es === e.nombre.es && e.en === e.nombre.en && e.ejemplo, id);
    assert.ok(['cantidad', 'lista'].includes(e.devuelve), id);
    assert.ok(!/×/.test(e.ejemplo + e.es + e.en), id);
  }
  assert.ok(Object.keys(P.NO_ES_ERROR).length >= 6);
});

test('proporción: ningún error típico da lo mismo que lo bueno ni algo inexacto (3000 casos al azar)', () => {
  const rng = crearRng(2027);
  const E = (id, ...args) => P.ERRORES_TIPICOS[id].fn(...args);
  const comprueba = (id, mal, bien) => {
    if (mal === null) return;
    assert.ok(!P.mismoValor(mal, bien), `${id} da lo mismo que lo bueno`);
    const razon = ['invertir-razon', 'parte-parte-como-parte-todo'].includes(id);
    for (const m of Array.isArray(mal) ? mal : [mal]) assert.ok((razon || m.esExacta()) && m.valor.num > 0, `${id} da ${es(m)}`);
  };
  for (let i = 0; i < 3000; i++) {
    const a = rng.entero(1, 12), b = c(fraccion(rng.entero(1, 3000), 100), '€'), cc = rng.entero(1, 12);
    comprueba('razonar-sumando', E('razonar-sumando', a, b, cc), P.proporcionDirecta({ a, b, c: cc }).resultado);
    comprueba('inversa-en-directa', E('inversa-en-directa', a, b, cc), P.proporcionDirecta({ a, b, c: cc }).resultado);
    comprueba('directa-en-inversa', E('directa-en-inversa', a, rng.entero(1, 60), cc), null);
    const x = rng.entero(1, 60);
    comprueba('directa-en-inversa', E('directa-en-inversa', a, x, cc), P.proporcionInversa({ a, b: x, c: cc }).resultado);
    comprueba('productos-en-linea', E('productos-en-linea', a, cc, x), P.terminoQueFalta(a, cc, x, null).resultado);
    comprueba('invertir-razon', E('invertir-razon', a, cc), fraccion(a, cc));
    comprueba('parte-parte-como-parte-todo', E('parte-parte-como-parte-todo', a, cc), fraccion(a, a + cc));
    const p = rng.entero(1, 99), q = rng.entero(1, 2000);
    const bienP = P.porcentajeDe(p, q).resultado;
    for (const id of ['dividir-entre-el-porcentaje', 'porcentaje-entre-mil', 'porcentaje-entre-diez', 'porcentaje-sin-dividir']) comprueba(id, E(id, p, q), bienP);
    comprueba('porcentaje-del-dato', E('porcentaje-del-dato', p, bienP), q);
    comprueba('porcentaje-al-reves', E('porcentaje-al-reves', bienP, q), c(p, '%'));
    comprueba('fraccion-sin-pasar-a-porcentaje', E('fraccion-sin-pasar-a-porcentaje', bienP, q), c(p, '%'));
    const precio = c(fraccion(rng.entero(100, 50000), 100), '€'), d = rng.elegir([4, 10, 15, 20, 21, 25, 30, 50]);
    const desc = P.aplicarPorcentaje(precio, d), aum = P.aplicarPorcentaje(precio, d, 'aumento');
    comprueba('restar-el-porcentaje-como-numero', E('restar-el-porcentaje-como-numero', precio, d), desc.final);
    comprueba('sumar-el-porcentaje-como-numero', E('sumar-el-porcentaje-como-numero', precio, d), aum.final);
    comprueba('descuento-por-precio-final', E('descuento-por-precio-final', precio, d), desc.final);
    comprueba('precio-final-por-descuento', E('precio-final-por-descuento', precio, d), desc.cambio);
    comprueba('aumento-por-descuento', E('aumento-por-descuento', precio, d), aum.final);
    comprueba('sube-y-baja-se-queda-igual', E('sube-y-baja-se-queda-igual', precio, d), P.aplicarPorcentaje(aum.final, d).final);
    const total = c(rng.entero(10, 600), '€'), razon = [rng.entero(1, 6), rng.entero(1, 6)];
    const rep = P.repartir(total, razon);
    if (rep) for (const id of ['reparto-a-partes-iguales', 'reparto-sin-sumar-las-partes']) comprueba(id, E(id, total, razon), rep.partes);
    const n = rng.elegir([50, 100, 200, 25000, 50000]), plano = c(rng.entero(1, 30), 'cm');
    comprueba('escala-sin-cambio-de-unidad', E('escala-sin-cambio-de-unidad', plano, n, 'realidad', 'm'), P.realidad(plano, n, 'm').resultado);
    comprueba('escala-al-reves', E('escala-al-reves', plano, n, 'realidad', 'm'), P.realidad(plano, n, 'm').resultado);
    const sup = c(rng.entero(1, 99), rng.elegir(P.ESCALERAS.superficie)), u2 = rng.elegir(P.ESCALERAS.superficie);
    comprueba('superficie-por-diez', E('superficie-por-diez', sup, u2), P.cambiarUnidad(sup, u2).resultado);
    comprueba('subir-por-bajar', E('subir-por-bajar', sup, u2), P.cambiarUnidad(sup, u2).resultado);
    const h = c(fraccion(rng.entero(1, 40), 4), 'h');
    comprueba('hora-decimal-como-minutos', E('hora-decimal-como-minutos', h), h);
  }
});

test('proporción: distractores sin equivalentes entre sí ni con la correcta', () => {
  const r = P.distractores([['descuento-por-precio-final', '45 €', 20], ['restar-el-porcentaje-como-numero', '45 €', 20],
    ['porcentaje-sin-dividir', 20, '45 €'], ['contestar-otra-cosa', '9,00 €', '36 €'], ['contestar-otra-cosa', '36 €', '36 €']], '36,00 €');
  assert.deepEqual(r.map(x => x.error), ['descuento-por-precio-final', 'restar-el-porcentaje-como-numero', 'porcentaje-sin-dividir']);
  assert.ok(!P.hayEquivalentes([P.cantidad(36, '€'), ...r.map(x => x.valor)]));
  assert.throws(() => P.distractores([['no-existe']], 1), /desconocido/);
  const rng = crearRng(5);
  for (let i = 0; i < 500; i++) {
    const precio = c(rng.entero(5, 120), '€'), p = rng.elegir([10, 15, 20, 25, 30, 40, 50]);
    const bien = P.aplicarPorcentaje(precio, p).final;
    const ds = P.distractores(rng.barajar([['descuento-por-precio-final', precio, p], ['restar-el-porcentaje-como-numero', precio, p],
      ['aumento-por-descuento', precio, p, 'descuento'], ['dividir-entre-el-porcentaje', p, precio], ['porcentaje-entre-diez', p, precio]]), bien);
    assert.ok(!P.hayEquivalentes([bien, ...ds.map(d => d.valor)]), `${es(precio)} ${p}`);
  }
});

test('proporción: la huella es la de equivalentes y álgebra, y la del caso va por valor', () => {
  for (const s of ['', 'a', '20 % de 150', 'proporcion|3/4']) assert.equal(P.huella(s), huellaEquivalentes(s));
  assert.equal(P.huella('x + 3 = 10'), huellaAlgebra('x + 3 = 10'));
  assert.equal(P.huellaCaso('porcentaje-de', [c(20, '%'), 150]), P.huellaCaso('porcentaje-de', ['0,2', c(150, '€')]));
  assert.equal(P.huellaCaso('porcentaje-de', ['20 %', 150]), P.huellaCaso('porcentaje-de', ['1/5', '150 €']));
  assert.notEqual(P.huellaCaso('porcentaje-de', ['20 %', 150]), P.huellaCaso('porcentaje-de', ['20 %', 160]));
  assert.notEqual(P.huellaCaso('porcentaje-de', ['20 %', 150]), P.huellaCaso('total', ['20 %', 150]));
  assert.equal(P.huellaCaso('proporcion', [3, 4, null, 20]), P.huellaCaso('proporcion', [null, 20, 3, 4]), '3/4 = x/20 y x/20 = 3/4');
  assert.equal(P.huellaCaso('proporcion', [3, 4, null, 20]), P.huellaCaso('proporcion', ['6/2', 4, null, 20]), 'por valor');
  assert.equal(P.huellaCaso('directa', ['3 kg', '4,50 €', '5 kg']), P.huellaCaso('directa', [3, '4,5', 5]), 'otro contexto, el mismo caso');
  assert.equal(P.huellaCaso('reparto', { total: '120 €', razon: [2, 3] }), P.huellaCaso('reparto', { razon: [2, 3], total: 120 }));
  assert.match(P.huellaCaso('directa', [1, 2, 3]), /^[0-9a-z]+$/);
});

test('proporción: el banco de contextos, con su cota, completo en los dos idiomas y con datos exactos (500 por contexto)', () => {
  const ids = new Set();
  const tipos = new Set(['directa', 'inversa', 'porcentaje', 'descuento', 'aumento', 'reparto', 'escala', 'velocidad', 'moneda']);
  for (const ctx of P.CONTEXTOS) {
    assert.ok(!ids.has(ctx.id), `contexto repetido: ${ctx.id}`);
    ids.add(ctx.id);
    assert.ok(tipos.has(ctx.tipo), `${ctx.id}: tipo ${ctx.tipo}`);
    assert.ok(['nuevo', 'cantera'].includes(ctx.origen), ctx.id);
    for (const [k, spec] of Object.entries(ctx.datos)) assert.ok(spec.rango || spec.lista || spec.cota, `${ctx.id}.${k} sin cota`);
    const preguntas = typeof ctx.es === 'string' ? [null] : Object.keys(ctx.es);
    assert.deepEqual(typeof ctx.en === 'string' ? [null] : Object.keys(ctx.en), preguntas, `${ctx.id}: las mismas preguntas en los dos idiomas`);
    const rng = crearRng(ctx.id.length * 977);
    for (let i = 0; i < 500; i++) {
      const d = P.generarDatos(ctx, rng);
      assert.ok(P.dentroDeCota(ctx, d), ctx.id);
      for (const [k, v] of Object.entries(d)) if (ctx.datos[k]) {
        assert.ok(v.esExacta(), `${ctx.id}.${k} inexacto`);
        if (v.unidad === null && !ctx.datos[k].cifras) assert.ok(v.valor.esEntera(), `${ctx.id}.${k}: personas y cosas, enteras`);
        if (v.unidad === '€') assert.ok(P.esExacta(v, 2), `${ctx.id}.${k}: al céntimo`);
      }
      if (i < 25) for (const q of preguntas) for (const idioma of ['es', 'en']) {
        const t = P.enunciado(ctx, d, idioma, q);
        assert.ok(!/[{}]|undefined|NaN|null|×/.test(t), `${ctx.id}: ${t}`);
        if (idioma === 'es') assert.ok(!/\d\.\d/.test(t), `punto decimal en español: ${t}`);
        else assert.ok(!/\d,\d/.test(t), `coma decimal en inglés: ${t}`);
      }
    }
  }
  // Las cotas de la regla 7 que se pueden mirar desde fuera.
  const cota = (id, k) => P.contexto(id).datos[k];
  assert.deepEqual(cota('fruteria-naranjas', 'k').rango.slice(0, 2), ['0,80', '2,50']);
  assert.deepEqual(P.contexto('iva-patinete').datos.p.lista, ['21']);
  assert.deepEqual(P.contexto('rebajas-camiseta').datos.p.lista, ['10', '15', '20', '25', '30', '40', '50', '60', '70']);
  for (const id of ['pintores', 'grifos', 'maquinas', 'pienso']) assert.match(P.contexto(id).es, /mismo ritmo|iguales|comen lo mismo/, `${id}: «al mismo ritmo» en el enunciado`);
  assert.throws(() => P.contexto('no-existe'), /No hay contexto/);
  assert.ok(P.NOMBRES.length >= 10 && new Set(P.NOMBRES).size === P.NOMBRES.length);
});
