// Práctica «De fracción a decimal y vuelta» de la unidad 5 (PU2, tarea 127): 3000 ítems por ejercicio con
// semillas fijas, contra comprobaciones escritas AQUÍ, aparte del generador (aritmética con BigInt y un
// criterio propio de «decimal exacto o periódico»). La opción buena dice lo que se ve, cada falsa vale
// otra cosa y nace de un error con nombre, nunca se enfrentan dos escrituras del mismo valor (salvo la
// «sin simplificar» del ej. 2, que el enunciado «forma irreducible» deja claramente falsa), no sale ningún
// caso de la hoja ni del examen, y ningún texto de alumno lleva ×, porcentajes ni coma en inglés / punto
// en español.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { aTexto, deTexto } from '../practicas/_comun/decimales.js';
import { TX, divisionDe } from '../practicas/fraccion-decimal/textos.js';
import {
  D, Fr, ERRORES_PROPIOS, nombreDe, huella, HUELLAS_EXAMEN, esFraccionReservada, esDecimalReservado, esParejaReservada,
  generarFraccionADecimal, generarDecimalAFraccion, generarParejas, generarFraccionODecimal,
  errorFraccionADecimal, errorTipo, errorDecimalAFraccion, evaluarParejas, errorSigno, signosDeErrores,
  MEMORIA, EXTRAS, claveDe, decimalDe, primerasCifras, mismaFraccion,
} from '../practicas/fraccion-decimal/logica.js';

const N = 3000;
const lote = (generar, semilla) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => generar(rng)); };
const sinHtml = t => t.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');

// ─── Comprobaciones independientes del generador ─────────────────────────────────────────

const gcd = (a, b) => (b === 0n ? a : gcd(b, a % b));
const B = x => BigInt(x);
const txt = (d, idioma) => aTexto(D(d), idioma);
/** num/den = m/10^k, con BigInt. */
const valeLoMismo = (f, d) => B(f.num) * 10n ** B(d.k) === B(d.m) * B(f.den);
/** Una fracción irreducible da decimal exacto si y solo si su denominador solo tiene los factores 2 y 5. */
const esExactaBig = f => {
  let q = B(f.den) / gcd(B(f.num), B(f.den));
  while (q % 2n === 0n) q /= 2n;
  while (q % 5n === 0n) q /= 5n;
  return q === 1n;
};
/** Compara num/den con m/10^k: -1, 0, 1. */
const cmpBig = (f, d) => { const a = B(f.num) * 10n ** B(d.k), b = B(d.m) * B(f.den); return a < b ? -1 : a > b ? 1 : 0; };
const signo = c => (c < 0 ? '<' : c > 0 ? '>' : '=');
const mismaFraccionBig = (a, b) => B(a.num) * B(b.den) === B(b.num) * B(a.den);

// ─── Los casos que no pueden salir ───────────────────────────────────────────────────────

test('la huella de examen reserva por valor y se puede añadir sin tocar el código', () => {
  const h = huella('f:7/9');
  HUELLAS_EXAMEN.add(h);
  assert.ok(esFraccionReservada({ num: 7, den: 9 }));
  assert.ok(esFraccionReservada({ num: 14, den: 18 }), 'por valor: 14/18 es 7/9');
  HUELLAS_EXAMEN.delete(h);
  assert.ok(!esFraccionReservada({ num: 7, den: 9 }));
  const g = huella('d:7/4');
  HUELLAS_EXAMEN.add(g);
  assert.ok(esDecimalReservado({ m: 175, k: 2 }), '1,75 = 7/4');
  HUELLAS_EXAMEN.delete(g);
  assert.ok(esParejaReservada({ num: 3, den: 4 }, { m: 82, k: 2 }));
  assert.ok(esParejaReservada({ num: 6, den: 8 }, { m: 780, k: 3 }), 'por valor: 6/8 y 0,780');
});

test('ningún ejercicio saca un caso de la hoja ni de los exámenes', () => {
  for (const it of lote(generarFraccionADecimal, 21)) assert.ok(!esFraccionReservada(it.f), `${it.f.num}/${it.f.den}`);
  for (const it of lote(generarDecimalAFraccion, 22)) assert.ok(!esDecimalReservado(it.d), txt(it.d, 'es'));
  for (const it of lote(generarFraccionODecimal, 23)) assert.ok(!esParejaReservada(it.f, it.d), `${it.f.num}/${it.f.den} y ${txt(it.d, 'es')}`);
});

// ─── Ejercicio 1 ─────────────────────────────────────────────────────────────────────────

test('ej. 1: la fracción es irreducible, del tipo que dice el ítem, y el decimal exacto es el bueno', () => {
  const lista = lote(generarFraccionADecimal, 101);
  const tipos = {};
  let periodicos = 0;
  for (const it of lista) {
    tipos[it.tipo] = (tipos[it.tipo] ?? 0) + 1;
    assert.equal(gcd(B(it.f.num), B(it.f.den)), 1n, 'irreducible');
    assert.ok(it.f.den >= 2 && it.f.num >= 1);
    const exacta = esExactaBig(it.f);
    if (it.tipo === 'tipo') { assert.equal(it.periodica, !exacta); if (it.periodica) periodicos++; }
    else if (it.tipo === 'periodico') { assert.equal(exacta, false); periodicos++; }
    else assert.equal(exacta, true);
    if (it.tipo === 'escribir' || it.tipo === 'elegir' || (it.tipo === 'tipo' && !it.periodica)) {
      assert.ok(valeLoMismo(it.f, it.respuesta), `${it.f.num}/${it.f.den} ≠ ${txt(it.respuesta, 'es')}`);
      assert.ok(it.respuesta.k >= 1 && it.respuesta.k <= 3, 'de 1 a 3 cifras decimales (hasta las milésimas)');
      assert.notEqual(it.respuesta.m % 10, 0, 'sin cero final');
      assert.ok(it.f.num / it.f.den <= 3 && it.f.den <= 50);
    }
    if (it.tipo === 'periodico' || (it.tipo === 'tipo' && it.periodica)) assert.ok([3, 6, 9].includes(it.f.den));
  }
  for (const t of ['escribir', 'elegir', 'tipo', 'periodico']) assert.ok(tipos[t] > 200, `pocos ${t}: ${tipos[t]}`);
  assert.ok(periodicos / N > 0.1 && periodicos / N < 0.3, `periódicos: ${periodicos / N}`);
});

test('ej. 1: elegir y periódico — 4 opciones de valores distintos, una buena, cada falsa de un error con nombre', () => {
  for (const it of lote(generarFraccionADecimal, 102).filter(i => i.opciones)) {
    assert.equal(it.opciones.length, 4);
    assert.equal(it.opciones.filter(o => o.correcta).length, 1);
    for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) {
      const x = it.opciones[a].d, y = it.opciones[b].d;
      assert.notEqual(B(x.m) * 10n ** B(y.k), B(y.m) * 10n ** B(x.k), `dos opciones valen lo mismo en ${it.f.num}/${it.f.den}`);
    }
    const buena = it.opciones.find(o => o.correcta);
    if (it.tipo === 'elegir') assert.ok(valeLoMismo(it.f, buena.d));
    else {
      // 5/6 = 0,8333…: la buena enseña las tres primeras cifras y «…»; ninguna falsa lleva «…»
      assert.equal(buena.puntos, true);
      assert.equal(B(buena.d.m), B(Math.floor(it.f.num * 1000 / it.f.den)) , 'tres cifras cortadas');
      assert.equal(buena.d.k, 3);
      assert.deepEqual(primerasCifras(it.f), buena.d);
      assert.equal(it.opciones.filter(o => o.puntos).length, 1);
      for (const o of it.opciones.filter(x => !x.correcta)) assert.ok(!valeLoMismo(it.f, o.d), 'una falsa vale justo la fracción');
    }
    for (const o of it.opciones.filter(x => !x.correcta)) {
      assert.ok(nombreDe(o.error), `error sin nombre: ${o.error}`);
      assert.ok(TX.ej1.por_que[o.error], `sin texto para ${o.error}`);
      assert.ok(!valeLoMismo(it.f, o.d) || it.tipo === 'periodico', 'una falsa vale lo mismo que la fracción');
    }
    // Las escrituras que se ven son todas distintas en los dos idiomas.
    for (const idioma of ['es', 'en']) {
      const textos = it.opciones.map(o => `${txt(o.d, idioma)}${o.puntos ? '…' : ''}`);
      assert.equal(new Set(textos).size, 4);
    }
  }
});

test('ej. 1: el error del decimal escrito se reconoce con los números del ítem', () => {
  const f = { num: 3, den: 4 };
  const item = { f, respuesta: { m: 75, k: 2 } };
  assert.equal(errorFraccionADecimal(item, deTexto('0,75')), null);
  assert.equal(errorFraccionADecimal(item, deTexto('0.750')), null, 'ceros finales: no es un error');
  assert.equal(errorFraccionADecimal(item, deTexto('1,33')), 'fraccion-al-reves');
  assert.equal(errorFraccionADecimal(item, deTexto('0,34')), 'numerador-como-decimas');
  assert.equal(errorFraccionADecimal(item, deTexto('0,4')), 'denominador-como-decimas');
  assert.equal(errorFraccionADecimal(item, deTexto('7,5')), 'coma-corrida');
  assert.equal(errorFraccionADecimal(item, deTexto('2,5')), 'otra-respuesta');
  assert.equal(errorTipo({ periodica: true }, 'periodico'), null);
  assert.equal(errorTipo({ periodica: true }, 'exacto'), 'periodico-por-exacto');
  assert.equal(errorTipo({ periodica: false }, 'periodico'), 'exacto-por-periodico');
  for (const it of lote(generarFraccionADecimal, 103).filter(i => i.tipo === 'escribir')) {
    assert.equal(errorFraccionADecimal(it, D(it.respuesta)), null);
    assert.notEqual(errorFraccionADecimal(it, D({ m: it.respuesta.m + 1, k: it.respuesta.k })), null);
  }
});

test('ej. 1: los periódicos se enseñan con puntos suspensivos, sin arco, y 0,33 no es 1/3', () => {
  assert.equal(divisionDe({ num: 1, den: 3 }, 'es').replace(/<[^>]+>/g, ''), '1 : 3 = 0,333…');
  assert.equal(divisionDe({ num: 5, den: 6 }, 'en').replace(/<[^>]+>/g, ''), '5 : 6 = 0.833…');
  assert.equal(divisionDe({ num: 3, den: 4 }, 'es').replace(/<[^>]+>/g, ''), '3 : 4 = 0,75');
  assert.deepEqual(decimalDe({ num: 1, den: 3 }), null);
  const malos = lote(generarFraccionADecimal, 104).filter(i => i.tipo === 'periodico' && i.f.num === 1 && i.f.den === 3);
  assert.ok(malos.length > 0);
  assert.ok(malos.every(i => i.opciones.some(o => o.error === 'periodico-por-redondeo' || o.error === 'corta-el-periodico' || o.error === 'fraccion-al-reves' || o.error === 'numerador-como-decimas')));
});

// ─── Ejercicio 2 ─────────────────────────────────────────────────────────────────────────

test('ej. 2: la respuesta es la fracción irreducible del decimal, con BigInt', () => {
  let escribir = 0;
  for (const it of lote(generarDecimalAFraccion, 201)) {
    assert.ok(it.d.k >= 1 && it.d.k <= 3);
    assert.notEqual(it.d.m % 10, 0, `acaba en 0: ${txt(it.d, 'es')}`);
    assert.ok(it.d.m > 0 && it.d.m < 5 * 10 ** it.d.k, 'menor que 5');
    assert.ok(valeLoMismo(it.respuesta, it.d), `${it.respuesta.num}/${it.respuesta.den} ≠ ${txt(it.d, 'es')}`);
    assert.equal(gcd(B(it.respuesta.num), B(it.respuesta.den)), 1n, 'irreducible');
    assert.ok(it.respuesta.den <= 1000);
    if (it.tipo === 'escribir') escribir++;
    assert.equal(errorDecimalAFraccion(it, it.respuesta.num, it.respuesta.den), null);
  }
  assert.ok(escribir / N > 0.35 && escribir / N < 0.55, `escribir: ${escribir / N}`);
});

test('ej. 2: elegir — cuatro fracciones, una buena; a lo sumo una falsa vale lo mismo (la «sin simplificar») y las demás, todas distintas', () => {
  let sinSimplificar = 0, conEntera = 0;
  for (const it of lote(generarDecimalAFraccion, 202).filter(i => i.tipo === 'elegir')) {
    assert.equal(it.opciones.length, 4);
    assert.equal(it.opciones.filter(o => o.correcta).length, 1);
    const buena = it.opciones.find(o => o.correcta);
    assert.deepEqual(buena.f, it.respuesta);
    const igualesALaBuena = it.opciones.filter(o => !o.correcta && mismaFraccionBig(o.f, buena.f));
    assert.ok(igualesALaBuena.length <= 1);
    for (const o of igualesALaBuena) {
      assert.equal(o.error, 'sin-simplificar');
      assert.notEqual(gcd(B(o.f.num), B(o.f.den)), 1n, 'la «sin simplificar» se puede simplificar');
      sinSimplificar++;
    }
    const falsas = it.opciones.filter(o => !o.correcta && !igualesALaBuena.includes(o));
    for (let a = 0; a < falsas.length; a++) {
      assert.ok(!mismaFraccionBig(falsas[a].f, buena.f), 'una falsa vale lo mismo que la buena');
      for (let b = a + 1; b < falsas.length; b++) assert.ok(!mismaFraccionBig(falsas[a].f, falsas[b].f), 'dos falsas valen lo mismo');
    }
    for (const o of it.opciones.filter(x => !x.correcta)) {
      assert.ok(nombreDe(o.error), o.error);
      assert.ok(TX.ej2.por_que[o.error], `sin texto para ${o.error}`);
    }
    if (it.d.m >= 10 ** it.d.k) conEntera++;
    // el enunciado pide la irreducible en los dos idiomas: sin eso, la «sin simplificar» sería otra buena
    assert.match(sinHtml(TX.ej2.instruccion.elegir.en), /simplest form/);
    assert.match(sinHtml(TX.ej2.instruccion.elegir.es), /irreducible/);
  }
  assert.ok(sinSimplificar > 100, `la «sin simplificar» casi no sale: ${sinSimplificar}`);
  assert.ok(conEntera > 100);
});

test('ej. 2: el error de la fracción escrita se reconoce', () => {
  const item = { d: { m: 75, k: 2 }, respuesta: { num: 3, den: 4 } };
  assert.equal(errorDecimalAFraccion(item, 3, 4), null);
  assert.equal(errorDecimalAFraccion(item, 75, 100), 'sin-simplificar');
  assert.equal(errorDecimalAFraccion(item, 15, 20), 'sin-simplificar');
  assert.equal(errorDecimalAFraccion(item, 15, 2), 'denominador-equivocado');
  assert.equal(errorDecimalAFraccion(item, 3, 40), 'un-cero-de-mas');
  assert.equal(errorDecimalAFraccion(item, 4, 3), 'fraccion-inversa');
  assert.equal(errorDecimalAFraccion(item, 7, 5), 'otra-respuesta');
  assert.equal(errorDecimalAFraccion(item, 3, 0), 'otra-respuesta');
  const mayor = { d: { m: 125, k: 2 }, respuesta: { num: 5, den: 4 } };
  assert.equal(errorDecimalAFraccion(mayor, 1, 4), 'olvida-parte-entera');
  assert.equal(errorDecimalAFraccion(mayor, 5, 4), null, 'las impropias se quedan impropias');
});

// ─── Ejercicio 3 ─────────────────────────────────────────────────────────────────────────

test('ej. 3: seis parejas de seis valores distintos, entre 3 y 5 de memoria y al menos una de las otras', () => {
  const memoria = new Set(MEMORIA.map(([n, d]) => `${n}/${d}`));
  const extras = new Set(EXTRAS.map(([n, d]) => `${n}/${d}`));
  const vistos = new Set();
  for (const it of lote(generarParejas, 301)) {
    assert.equal(it.fracciones.length, 6);
    assert.equal(it.decimales.length, 6);
    assert.equal(new Set(it.solucion).size, 6, 'la solución es una permutación');
    const claves = it.fracciones.map(f => `${f.num}/${f.den}`);
    const nMem = claves.filter(c => memoria.has(c)).length;
    assert.ok(nMem >= 3 && nMem <= 5, `de memoria: ${nMem}`);
    assert.equal(claves.filter(c => extras.has(c)).length, 6 - nMem);
    assert.equal(new Set(claves).size, 6);
    for (let a = 0; a < 6; a++) {
      assert.ok(valeLoMismo(it.fracciones[a], it.decimales[it.solucion[a]]), `${claves[a]} no vale ${txt(it.decimales[it.solucion[a]], 'es')}`);
      for (let b = a + 1; b < 6; b++) {
        assert.ok(!mismaFraccionBig(it.fracciones[a], it.fracciones[b]), 'dos fracciones del mismo valor');
        const x = it.decimales[a], y = it.decimales[b];
        assert.notEqual(B(x.m) * 10n ** B(y.k), B(y.m) * 10n ** B(x.k), 'dos decimales del mismo valor');
      }
    }
    // nunca es exactamente el ejercicio de la hoja (los seis de memoria)
    assert.notEqual(nMem, 6);
    vistos.add(claveDe(it));
  }
  assert.ok(vistos.size > 500, `poca variedad: ${vistos.size}`);
});

test('ej. 3: la corrección da el error del par mal hecho', () => {
  const it = {
    fracciones: [{ num: 1, den: 4 }, { num: 1, den: 5 }, { num: 1, den: 10 }, { num: 1, den: 100 }, { num: 1, den: 2 }, { num: 3, den: 4 }],
    decimales: [{ m: 25, k: 2 }, { m: 2, k: 1 }, { m: 1, k: 1 }, { m: 1, k: 2 }, { m: 5, k: 1 }, { m: 75, k: 2 }],
    solucion: [0, 1, 2, 3, 4, 5],
  };
  assert.deepEqual(evaluarParejas(it, [0, 1, 2, 3, 4, 5]), { acierto: true, estados: Array(6).fill('bien'), error: null, malas: [] });
  const a = evaluarParejas(it, [0, 1, 3, 2, 4, 5]);   // 1/10 con 0,01 y 1/100 con 0,1
  assert.equal(a.acierto, false);
  assert.deepEqual(a.malas, [2, 3]);
  assert.equal(a.error, 'decimas-por-centesimas');
  const b = evaluarParejas(it, [4, 1, 2, 3, 0, 5]);   // 1/4 con 0,5 y 1/2 con 0,25
  assert.equal(b.error, 'otra-pareja');
  const c = evaluarParejas({ ...it, decimales: [{ m: 25, k: 2 }, { m: 2, k: 1 }, { m: 1, k: 1 }, { m: 1, k: 2 }, { m: 5, k: 1 }, { m: 4, k: 1 }], solucion: [0, 1, 2, 3, 4, 5] }, [5, 1, 2, 3, 4, 0]);
  assert.equal(c.error, 'denominador-como-decimas');
  for (const id of ['denominador-como-decimas', 'decimas-por-centesimas', 'otra-pareja']) assert.ok(nombreDe(id) && TX.ej3.por_que[id]);
});

// ─── Ejercicio 4 ─────────────────────────────────────────────────────────────────────────

test('ej. 4: el signo es el de verdad (BigInt), el «=» solo cuando son el mismo número y el periódico nunca es igual', () => {
  const cuenta = { '<': 0, '=': 0, '>': 0 }, tipos = { igual: 0, periodico: 0, distinto: 0 }, ordenes = { fd: 0, df: 0 };
  for (const it of lote(generarFraccionODecimal, 401)) {
    const c = cmpBig(it.f, it.d);
    assert.equal(it.respuesta, signo(it.orden === 'fd' ? c : -c), `${it.f.num}/${it.f.den} y ${txt(it.d, 'es')} (${it.orden})`);
    if (it.tipo === 'igual') assert.equal(c, 0);
    else assert.notEqual(c, 0);
    if (it.tipo === 'periodico') { assert.equal(esExactaBig(it.f), false); assert.ok([3, 6, 9].includes(it.f.den)); }
    else { assert.ok(esExactaBig(it.f)); assert.equal(gcd(B(it.f.num), B(it.f.den)), 1n); }
    assert.ok(it.d.m > 0 && it.d.k >= 1 && it.d.k <= 3);
    assert.ok(it.d.m < 3.6 * 10 ** it.d.k + 1, 'el decimal es ≤ 3,6');
    cuenta[it.respuesta]++; tipos[it.tipo]++; ordenes[it.orden]++;
  }
  assert.ok(tipos.igual / N > 0.1 && tipos.igual / N < 0.25, `iguales: ${tipos.igual / N}`);
  assert.ok(tipos.periodico / N > 0.15 && tipos.periodico / N < 0.3, `periódicos: ${tipos.periodico / N}`);
  assert.ok(cuenta['<'] > 700 && cuenta['>'] > 700, 'los dos signos salen');
  assert.ok(ordenes.fd > 1300 && ordenes.df > 1300, 'la fracción va a un lado y al otro');
});

test('ej. 4: los errores del signo salen con los números del ítem y se pueden provocar', () => {
  const item = { tipo: 'distinto', f: { num: 4, den: 5 }, d: { m: 75, k: 2 }, orden: 'fd', respuesta: '>' };   // 0,8 > 0,75
  assert.equal(errorSigno(item, '>'), null);
  assert.equal(errorSigno(item, '<'), 'numerador-contra-decimas');   // 4 contra 75
  assert.equal(errorSigno(item, '='), 'otra-respuesta');
  const igual = { tipo: 'igual', f: { num: 1, den: 4 }, d: { m: 25, k: 2 }, orden: 'df', respuesta: '=' };
  assert.equal(errorSigno(igual, '<'), 'no-ve-que-son-iguales');
  const per = { tipo: 'periodico', f: { num: 2, den: 3 }, d: { m: 67, k: 2 }, orden: 'fd', respuesta: '<' };
  assert.equal(errorSigno(per, '='), 'periodico-por-redondeo');
  let numerador = 0, alReves = 0;
  for (const it of lote(generarFraccionODecimal, 402)) {
    for (const s of ['<', '=', '>']) {
      const e = errorSigno(it, s);
      if (s === it.respuesta) assert.equal(e, null);
      else { assert.notEqual(e, null); assert.ok(nombreDe(e), e); assert.ok(TX.ej4.por_que[e], `sin texto para ${e}`); }
    }
    const posibles = signosDeErrores(it);
    if (posibles['numerador-contra-decimas'] && posibles['numerador-contra-decimas'] !== it.respuesta) numerador++;
    if (posibles['fraccion-al-reves'] && posibles['fraccion-al-reves'] !== it.respuesta) alReves++;
  }
  assert.ok(numerador > 200, `el error del numerador casi no se puede cometer: ${numerador}`);
  assert.ok(alReves > 200, `el error de dividir al revés casi no se puede cometer: ${alReves}`);
});

// ─── Textos ──────────────────────────────────────────────────────────────────────────────

/** Todos los textos que puede ver un alumno de un ítem, en los dos idiomas. */
function textosDe(it) {
  const salida = [];
  for (const idioma of ['es', 'en']) {
    const tt = o => o[idioma];
    if (it.ejercicio === 1) {
      salida.push([idioma, tt(TX.ej1.correcto)(it), tt(TX.ej1.solucion)(it)]);
      for (const id of ['fraccion-al-reves', 'numerador-como-decimas', 'denominador-como-decimas', 'coma-corrida', 'periodico-por-redondeo', 'corta-el-periodico', 'periodico-por-exacto', 'exacto-por-periodico', 'otra-respuesta'])
        salida.push([idioma, tt(TX.ej1.por_que[id])(it, { m: 133, k: 2 })]);
    } else if (it.ejercicio === 2) {
      salida.push([idioma, tt(TX.ej2.correcto)(it), tt(TX.ej2.solucion)(it)]);
      for (const id of Object.keys(TX.ej2.por_que)) salida.push([idioma, tt(TX.ej2.por_que[id])(it, { num: 75, den: 100 })]);
    } else if (it.ejercicio === 3) {
      salida.push([idioma, tt(TX.ej3.correcto), tt(TX.ej3.mal)]);
      for (const id of Object.keys(TX.ej3.por_que)) salida.push([idioma, tt(TX.ej3.por_que[id])(it.fracciones[0], it.decimales[it.solucion[0]])]);
      salida.push([idioma, tt(TX.ej3.pareja)(it.fracciones[0], it.decimales[it.solucion[0]], it.decimales[1])]);
    } else {
      salida.push([idioma, tt(TX.ej4.correcto)(it), tt(TX.ej4.solucion)(it)]);
      for (const id of Object.keys(TX.ej4.por_que)) salida.push([idioma, tt(TX.ej4.por_que[id])(it)]);
    }
  }
  return salida;
}

test('ningún texto de alumno lleva ×, porcentajes, coma en inglés ni punto en español', () => {
  const generadores = [generarFraccionADecimal, generarDecimalAFraccion, generarParejas, generarFraccionODecimal];
  generadores.forEach((g, e) => {
    for (const it of lote(g, 500 + e).slice(0, 800)) {
      for (const [idioma, ...textos] of textosDe(it)) {
        for (const t of textos.map(sinHtml)) {
          assert.doesNotMatch(t, /×|%|\bpor ciento\b|per cent|percent/, t);
          if (idioma === 'en') assert.doesNotMatch(t, /\d,\d/, `coma en inglés: ${t}`);
          else assert.doesNotMatch(t, /\d\.\d/, `punto en español: ${t}`);
          assert.doesNotMatch(t, /undefined|NaN|\[object/, t);
        }
      }
    }
  });
  for (const e of [TX.ej1, TX.ej2, TX.ej3, TX.ej4]) {
    for (const idioma of ['es', 'en']) {
      const t = sinHtml(e.introduccion[idioma]);
      assert.doesNotMatch(t, /×|%/);
      assert.doesNotMatch(t, idioma === 'en' ? /\d,\d/ : /\d\.\d/, t);
    }
    assert.ok(e.nombre.es && e.nombre.en && e.detalle.es && e.detalle.en);
  }
});

test('lo que la unidad deja fuera no sale: ni mixtos, ni arcos, ni letras de variable, ni nada de la semana siguiente', () => {
  for (const e of [TX.ej1, TX.ej2, TX.ej3, TX.ej4]) {
    for (const idioma of ['es', 'en']) {
      const t = sinHtml(e.introduccion[idioma]);
      assert.doesNotMatch(t, /mixt|mixed number|\bx\b|\bperiodo\b|vinculum|arco/i, t);
    }
  }
  assert.doesNotMatch(sinHtml(TX.ej1.introduccion.es), /clasific/i);
});

test('todos los errores que declara la lógica tienen nombre y texto, y la clave distingue ítems', () => {
  for (const id of Object.keys(ERRORES_PROPIOS)) assert.ok(ERRORES_PROPIOS[id].nombre.es && ERRORES_PROPIOS[id].nombre.en);
  assert.ok(nombreDe('fraccion-al-reves') && nombreDe('numerador-como-decimas') && nombreDe('periodico-por-redondeo') && nombreDe('decimas-por-centesimas'));
  const rng = crearRng(777);
  const a = generarFraccionADecimal(rng), b = generarFraccionADecimal(rng);
  assert.equal(claveDe(a), claveDe(a));
  assert.ok(typeof claveDe(b) === 'string');
  assert.ok(mismaFraccion(Fr({ num: 2, den: 4 }), Fr({ num: 1, den: 2 })));
});
