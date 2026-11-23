// Práctica «Cambia de unidad» (unidad 7, PU2 tarea 223): 3000 ítems por ejercicio con semillas fijas, contra
// comprobaciones escritas AQUÍ, aparte del generador (BigInt, todo en la unidad más pequeña de la magnitud).

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { mismoValor, cantidad, aTexto, aHtml, huella } from '../practicas/_comun/proporcion.js';
import { Fraccion } from '../practicas/_comun/fracciones.js';
import {
  EXP, NUCLEARES, ESCALERA, HORAS, PARES, BANCO_UNIDAD, CASOS_HOJA, HUELLAS_EXAMEN, esReservado, claveCaso, unidadesFalsas, valorEn,
  generarLongitud, generarMasaCapacidad, generarTiempo, generarComplejo, generarUnidad,
  claveLongitud, claveMasaCapacidad, claveTiempo, claveComplejo, claveUnidad,
  errorCambio, errorComplejo, fallosCambio, fallosComplejo, buenoComplejo,
} from '../practicas/unidades/logica.js';
import {
  enunciadoLongitud, enunciadoMasaCapacidad, enunciadoTiempo, enunciadoComplejo, enunciadoUnidad, NOMBRE_ERROR, quePaso, TX,
} from '../practicas/unidades/textos.js';

const N = 3000;
const lote = (generar, semilla) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => generar(rng)); };
const sinHtml = s => String(s).replace(/<[^>]+>/g, '');
const F = (n, d = 1) => new Fraccion(n, d).simplificar();
const num = x => Number(x.num) / Number(x.den);
const IDIOMAS = ['es', 'en'];
const PROHIBIDO = /undefined|NaN|\[object|×|m³|m²|cm²|km²|dm²|superficie|área|\barea\b|volumen|volume/i;
const LITRO_MINUSCULA = /\d[\s  ]?(?:l|hl|dal|dl|cl|ml|kl)(?![\p{L}])/u;
const SIMBOLO_MAL = /\b(?:Km|Kg|Dam|Hm|Hl|mts)\b|\d(?:km|hm|dam|dm|cm|mm|kg|hg|dag|g|mg|kL|hL|daL|L|dL|cL|mL)\b/;
const SIN_TIEMPO = /\d[\s  ]?(?:h|min)\b|\bhoras?\b|\bminutos?\b|\bhours?\b|\bminutes?\b/i;
const P = u => 10n ** BigInt(EXP[u] + 3);
const big = x => [BigInt(x.num), BigInt(x.den)];

/** Segundo camino: x en `de` = res en `a`, pasando las dos a la unidad más pequeña (mm, mg, mL), con BigInt. */
function mismoPorBigInt(x, de, res, a) {
  const [xn, xd] = big(x), [rn, rd] = big(res);
  return xn * rd * P(de) === rn * xd * P(a);
}
const textosDe = (it, f) => IDIOMAS.map(i => sinHtml(f(it, i)));
const generales = (textos, { tiempo = false } = {}) => {
  for (const x of textos) {
    assert.ok(!PROHIBIDO.test(x), x);
    assert.ok(!LITRO_MINUSCULA.test(x), x);
    assert.ok(!SIMBOLO_MAL.test(x), x);
    if (!tiempo) assert.ok(!SIN_TIEMPO.test(x), x);
  }
};
const maxFrecuencia = (items, clave) => {
  const cuenta = new Map();
  for (const it of items) cuenta.set(clave(it), (cuenta.get(clave(it)) ?? 0) + 1);
  return Math.max(...cuenta.values()) / items.length;
};

// ─── Ejercicio 1: longitud ───────────────────────────────────────────────────────────────────────

test('ej. 1: el resultado es exacto (segundo camino), 1-3 saltos y cotas', () => {
  const items = lote(generarLongitud, 11);
  for (const it of items) {
    assert.ok(ESCALERA.longitud.includes(it.de) && ESCALERA.longitud.includes(it.a));
    const s = Math.abs(EXP[it.de] - EXP[it.a]);
    assert.ok(s >= 1 && s <= 3);
    assert.ok(mismoPorBigInt(it.x, it.de, it.res, it.a));
    assert.ok(num(it.x) >= 0.01 && num(it.x) <= 999);
    assert.ok(num(it.res) >= 0.01 && num(it.res) <= 9999);
    assert.ok(it.res.multiplicar(1000).simplificar().esEntera(), 'como mucho tres decimales');
    generales([...textosDe(it, enunciadoLongitud)]);
  }
  assert.ok(items.filter(it => !NUCLEARES.has(it.de) || !NUCLEARES.has(it.a)).length > N * 0.3, 'salen unidades menos frecuentes');
  assert.ok(items.filter(it => NUCLEARES.has(it.de) && NUCLEARES.has(it.a)).length > N * 0.1, 'salen las nucleares');
});

test('ej. 1: lo que teclea el alumno (todas las escrituras) y cada error con nombre', () => {
  for (const it of lote(generarLongitud, 12).slice(0, 600)) {
    const bueno = it.res;
    for (const i of IDIOMAS) {
      const t = aTexto(cantidad(bueno, null), i);
      assert.equal(errorCambio(it, t, i), null);
      assert.equal(errorCambio(it, `${t} ${it.a}`, i), null);
    }
    assert.equal(errorCambio(it, String(num(bueno)).replace('.', ','), 'es'), null);
    assert.equal(errorCambio(it, String(num(bueno)), 'en'), null);
    for (const [id, v] of Object.entries(fallosCambio(it))) {
      if (v.equals(bueno)) continue;
      const texto = aTexto(cantidad(v, null), 'es');
      const e = errorCambio(it, texto, 'es');
      assert.ok(e === id || (e !== null && NOMBRE_ERROR[e]), `${id} ${texto} → ${e}`);
      assert.ok(NOMBRE_ERROR[id]);
      assert.equal(errorCambio(it, texto, 'es') === null, false);
    }
    assert.equal(errorCambio(it, 'hola', 'es'), 'otra-respuesta');
  }
});

// ─── Ejercicio 2: masa y capacidad ───────────────────────────────────────────────────────────────

test('ej. 2: cuatro opciones distintas por valor, una correcta, cada distractor es un error con nombre', () => {
  const items = lote(generarMasaCapacidad, 21);
  for (const it of items) {
    assert.ok(['masa', 'capacidad'].includes(it.mag) && ESCALERA[it.mag].includes(it.de) && ESCALERA[it.mag].includes(it.a));
    assert.ok(mismoPorBigInt(it.x, it.de, it.res, it.a));
    assert.equal(it.ops.length, 4);
    for (let j = 0; j < 4; j++) for (let k = j + 1; k < 4; k++) assert.ok(!mismoValor(cantidad(it.ops[j].valor, it.a), cantidad(it.ops[k].valor, it.a)));
    const buenas = it.ops.filter(o => o.correcta);
    assert.equal(buenas.length, 1);
    assert.ok(mismoPorBigInt(it.x, it.de, buenas[0].valor, it.a));
    const f = fallosCambio(it);
    for (const o of it.ops.filter(o => !o.correcta)) {
      assert.ok(f[o.error] && f[o.error].equals(o.valor), o.error);
      assert.ok(NOMBRE_ERROR[o.error]);
    }
    // el salto de más y de menos son distractores si hay hueco: ×10 y :10 del bueno
    const fm = it.res.multiplicar(10).simplificar(), fn = it.res.dividir(10).simplificar();
    const esperadas = it.ops.filter(o => !o.correcta).map(o => o.valor);
    assert.ok(esperadas.some(v => v.equals(fm) || v.equals(fn) || v.equals(it.x) || v.equals(f['subir-por-bajar'])));
    generales(textosDe(it, enunciadoMasaCapacidad));
    for (const o of it.ops) for (const i of IDIOMAS) generales([sinHtml(aHtml(cantidad(o.valor, it.a), i))]);
  }
  assert.ok(items.filter(it => !NUCLEARES.has(it.de) || !NUCLEARES.has(it.a)).length >= N / 2, 'al menos la mitad lleva una unidad rara');
  assert.ok(items.some(it => it.de === 't' || it.a === 't'), 'sale la tonelada');
  assert.ok(items.some(it => it.mag === 'masa') && items.some(it => it.mag === 'capacidad'));
});

// ─── Ejercicio 3: horas y minutos ────────────────────────────────────────────────────────────────

test('ej. 3: horas sencillas, minutos enteros, el 100 como error y sin opciones equivalentes', () => {
  const items = lote(generarTiempo, 31);
  for (const it of items) {
    const h = it.pasos === 'h-min' ? it.x : it.res, min = it.pasos === 'h-min' ? it.res : it.x;
    assert.ok(HORAS.some(v => v.equals(h)));
    assert.ok(min.esEntera() && num(min) === num(h) * 60);
    assert.equal(it.ops.length, 4);
    for (let j = 0; j < 4; j++) for (let k = j + 1; k < 4; k++) assert.ok(!it.ops[j].valor.equals(it.ops[k].valor));
    assert.equal(it.ops.filter(o => o.correcta).length, 1);
    assert.ok(it.ops.find(o => o.correcta).valor.equals(it.res));
    for (const o of it.ops.filter(o => !o.correcta)) assert.ok(NOMBRE_ERROR[o.error]);
    generales(textosDe(it, enunciadoTiempo), { tiempo: true });
    for (const o of it.ops) for (const i of IDIOMAS) assert.ok(!PROHIBIDO.test(sinHtml(aHtml(cantidad(o.valor, it.a), i))));
  }
  assert.ok(items.some(it => it.pasos === 'h-min') && items.some(it => it.pasos === 'min-h'));
  assert.ok(items.some(it => it.ops.some(o => o.error === 'cien-en-vez-de-sesenta')));
  assert.ok(!items.some(it => /\bsuperficie|m²/.test(textosDe(it, enunciadoTiempo).join(' '))));
});

// ─── Ejercicio 4: complejo e incomplejo ──────────────────────────────────────────────────────────

test('ej. 4: la suma de las dos partes en la unidad pequeña (segundo camino) y la parte pequeña única', () => {
  const items = lote(generarComplejo, 41);
  for (const it of items) {
    const par = PARES.find(p => p.grande === it.grande && p.pequena === it.pequena);
    assert.ok(par, 'par de unidades del catálogo');
    const FF = it.mag === 'tiempo' ? 60n : 10n ** BigInt(EXP[it.grande] - EXP[it.pequena]);
    assert.ok(it.big >= 1 && it.big <= par.max);
    assert.ok(it.small >= 1 && BigInt(it.small) < FF, 'la parte pequeña es menor que un salto entero');
    assert.equal(BigInt(it.total.num), BigInt(it.big) * FF + BigInt(it.small));
    assert.equal(buenoComplejo(it).num, it.forma === 'a' ? it.total.num : it.small);
    if (it.forma === 'b1') {
      assert.equal(BigInt(it.x.num) * FF % BigInt(it.x.den), 0n);
      assert.equal(BigInt(it.x.num) * FF / BigInt(it.x.den), BigInt(it.big) * FF + BigInt(it.small));
    }
    generales(IDIOMAS.map(i => sinHtml(enunciadoComplejo(it, i))), { tiempo: it.mag === 'tiempo' });
    for (const i of IDIOMAS) for (const [id] of Object.entries(fallosComplejo(it))) assert.ok(NOMBRE_ERROR[id] && quePaso(id, it, i));
  }
  for (const f of ['a', 'b1', 'b2']) assert.ok(items.some(it => it.forma === f), f);
  assert.ok(items.some(it => it.forma === 'a' && it.grande === 'km' && it.small < 100), 'con un cero intermedio');
  const a = items.filter(it => it.forma === 'a').length;
  assert.ok(a > N * 0.4 && a < N * 0.6, 'a partes iguales');
});

test('ej. 4: lo que teclea el alumno y cada error', () => {
  for (const it of lote(generarComplejo, 42).slice(0, 800)) {
    const b = buenoComplejo(it);
    assert.equal(errorComplejo(it, aTexto(cantidad(b, null), 'es'), 'es'), null);
    assert.equal(errorComplejo(it, `${aTexto(cantidad(b, null), 'en')} ${it.pequena}`, 'en'), null);
    for (const [id, v] of Object.entries(fallosComplejo(it))) {
      if (v.equals(b)) continue;
      const e = errorComplejo(it, aTexto(cantidad(v, null), 'es'), 'es');
      const iguales = Object.entries(fallosComplejo(it)).filter(([, w]) => w.equals(v)).map(([k]) => k);
      assert.ok(iguales.includes(e), `${id} → ${e}`);
    }
  }
});

// ─── Ejercicio 5: ¿qué unidad? ───────────────────────────────────────────────────────────────────

test('ej. 5: el banco tiene 24 casos, ocho por magnitud, y en cada uno una sola unidad cae en el intervalo', () => {
  assert.ok(BANCO_UNIDAD.length >= 24);
  for (const mag of ['longitud', 'masa', 'capacidad']) assert.ok(BANCO_UNIDAD.filter(c => c.mag === mag).length >= 8, mag);
  assert.equal(new Set(BANCO_UNIDAD.map(c => c.id)).size, BANCO_UNIDAD.length);
  for (const c of BANCO_UNIDAD) {
    assert.ok(ESCALERA[c.mag].includes(c.u));
    assert.ok(valorEn(c, c.u) >= c.lo && valorEn(c, c.u) <= c.hi, c.id);
    assert.ok(unidadesFalsas(c).length >= 3, `${c.id}: faltan distractores`);
    for (const u of unidadesFalsas(c)) assert.ok(valorEn(c, u) < c.lo / 5 || valorEn(c, u) > c.hi * 5, `${c.id} ${u}`);
  }
});

test('ej. 5: cuatro unidades de la misma magnitud, una buena y las otras fuera con el margen de cinco veces', () => {
  const items = lote(generarUnidad, 51);
  for (const it of items) {
    const c = it.caso;
    assert.equal(it.ops.length, 4);
    assert.equal(new Set(it.ops.map(o => o.unidad)).size, 4);
    for (const o of it.ops) assert.ok(ESCALERA[c.mag].includes(o.unidad));
    const dentro = it.ops.filter(o => valorEn(c, o.unidad) >= c.lo && valorEn(c, o.unidad) <= c.hi);
    assert.equal(dentro.length, 1);
    assert.equal(dentro[0].unidad, c.u);
    assert.equal(it.ops.filter(o => o.correcta).length, 1);
    for (const o of it.ops.filter(o => !o.correcta)) {
      const v = valorEn(c, o.unidad);
      assert.ok(v < c.lo / 5 || v > c.hi * 5);
      assert.equal(o.error, v > c.hi * 5 ? 'unidad-demasiado-grande' : 'unidad-demasiado-pequena');
      assert.ok(quePaso(o.error, { ...it, elegida: o.unidad }, 'es').includes(String(o.unidad).length ? '' : ''));
    }
    generales(textosDe(it, enunciadoUnidad));
  }
  assert.ok(new Set(items.map(it => it.caso.id)).size === BANCO_UNIDAD.length, 'salen todos los casos del banco');
});

// ─── Variedad, reserva y textos ──────────────────────────────────────────────────────────────────

test('variedad: ningún ítem sale en más del 10 % de los de su ejercicio', () => {
  for (const [gen, clave, sem] of [[generarLongitud, claveLongitud, 61], [generarMasaCapacidad, claveMasaCapacidad, 62], [generarTiempo, claveTiempo, 63],
    [generarComplejo, claveComplejo, 64], [generarUnidad, claveUnidad, 65]]) {
    assert.ok(maxFrecuencia(lote(gen, sem), clave) <= 0.1, clave.name);
  }
});

test('reserva anti-copia: los casos de la hoja (en claro) y los del examen (huella) no salen y se detectan por valor', () => {
  const caso = { mag: 'longitud', de: 'km', a: 'm', x: F(7, 2) };
  assert.equal(esReservado({ tipo: 'cambio', ...caso }), false);
  CASOS_HOJA.push(caso);
  try {
    assert.equal(esReservado({ tipo: 'cambio', ...caso }), true);
    assert.equal(esReservado({ tipo: 'cambio', mag: 'longitud', de: 'km', a: 'cm', x: F(7, 2) }), false);
  } finally { CASOS_HOJA.pop(); }
  const k = claveCaso('cambio', 'masa', 'kg', 'g', F(3, 2)), h = huella(k);
  HUELLAS_EXAMEN.add(h);
  try {
    assert.equal(esReservado({ tipo: 'cambio', mag: 'masa', de: 'kg', a: 'g', x: F(3, 2) }), true);
    const rng = crearRng(99);
    for (let i = 0; i < 2000; i++) { const it = generarMasaCapacidad(rng); assert.equal(esReservado(it), false); }
  } finally { HUELLAS_EXAMEN.delete(h); }
  assert.equal(CASOS_HOJA.length, 0, 'sin casos en claro del examen: la hoja del paquete 4 aún no existe');
});

test('los textos fijos: sin ×, sin superficie ni volumen y los cinco ejercicios con nombre en los dos idiomas', () => {
  for (const k of ['ej1', 'ej2', 'ej3', 'ej4', 'ej5']) {
    const tx = TX[k];
    for (const campo of [tx.nombre, tx.detalle, tx.introduccion, tx.instruccion]) for (const i of IDIOMAS) {
      const x = sinHtml(campo[i]);
      assert.ok(x.length > 3 && !/×|m³|m²|undefined|superficie|area units/i.test(x), x);
      assert.ok(!LITRO_MINUSCULA.test(x) && !SIMBOLO_MAL.test(x), x);
    }
  }
  for (const [id, n] of Object.entries(NOMBRE_ERROR)) for (const i of IDIOMAS) assert.ok(n[i].length > 5, id);
});
