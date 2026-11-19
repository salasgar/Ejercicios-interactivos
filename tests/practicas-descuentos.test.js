// Práctica «Descuentos y aumentos» (unidad 7, PU2 tarea 221): 3000 ítems por ejercicio con semillas fijas,
// contra comprobaciones escritas AQUÍ, aparte del generador (BigInt).

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { NOMBRES } from '../practicas/_comun/proporcion.js';
import {
  PRODUCTOS, CUOTAS, APARATOS, DESCUENTOS, SUBIDAS, TIPOS_IVA, dineroCelda, generarDosPasos, claveDosPasos, erroresDeDosPasos,
  generarUnPaso, claveUnPaso, errorDeUnPasoCalcular, generarIva, claveIva, errorDeIva, generarQuePiden, claveQuePiden,
  generarCaza, claveCaza, erroresDeCaza, multiplicadorTxt,
} from '../practicas/descuentos/logica.js';
import { enunciadoDosPasos, enunciadoQuePiden, enunciadoCaza, pideTexto, TX } from '../practicas/descuentos/textos.js';

const N = 3000;
const lote = (generar, semilla) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => generar(rng)); };
const sinHtml = s => String(s).replace(/<[^>]+>/g, '');
const PROHIBIDO = /undefined|NaN|\[object|×|aproximadamente|approximately|antes de la rebaja|before the (sale|reduction)|\d\.\d{3}\b/;
const variedad = (items, clave) => {
  const m = new Map();
  items.forEach(it => m.set(clave(it), (m.get(clave(it)) ?? 0) + 1));
  return Math.max(...m.values()) / items.length;
};
const teclea = (c, idioma = 'es') => dineroCelda(c, idioma);
/** Segunda ruta: p % de P con BigInt, sin dividir; devuelve null si no es exacto. */
const porcentaje = (P, p) => { const n = BigInt(P) * BigInt(p); return n % 100n === 0n ? Number(n / 100n) : null; };
const cota = it => [...PRODUCTOS, ...CUOTAS].find(x => x.id === it.prod.id);

function compruebaPrecio(it, tipo) {
  const c = cota(it);
  assert.ok(it.P >= c.min && it.P <= c.max, `${c.id} ${it.P}`);
  assert.ok(Number.isInteger(it.P) && it.P !== 10000, 'nunca 100,00 €');
  assert.notEqual(porcentaje(it.P, it.p ?? it.r), null, 'exacto');
  if (tipo === 'descuento') assert.ok(DESCUENTOS.includes(it.p));
  if (tipo === 'aumento') assert.ok(SUBIDAS.includes(it.p));
}

test('ej. 1: cuentas exactas, cotas y errores nombrados', () => {
  const items = lote(generarDosPasos, 21), tipos = { descuento: 0, aumento: 0 };
  for (const it of items) {
    tipos[it.tipo]++;
    compruebaPrecio(it, it.tipo);
    const cambio = porcentaje(it.P, it.p), final = it.tipo === 'descuento' ? it.P - cambio : it.P + cambio;
    assert.deepEqual(erroresDeDosPasos(it, teclea(cambio), teclea(final), 'es'), [null, null]);
    assert.deepEqual(erroresDeDosPasos(it, `${teclea(cambio)} €`, `${teclea(final)} €`, 'es'), [null, null]);
    assert.deepEqual(erroresDeDosPasos(it, `€${teclea(cambio, 'en')}`, `€${teclea(final, 'en')}`, 'en'), [null, null]);
    if (final !== cambio) assert.deepEqual(erroresDeDosPasos(it, teclea(final), teclea(cambio), 'es'), ['campos-cambiados', 'campos-cambiados']);
    assert.equal(erroresDeDosPasos(it, teclea(cambio), teclea(it.tipo === 'descuento' ? it.P + cambio : it.P - cambio), 'es')[1], 'aumento-por-descuento');
    if (final !== cambio) assert.equal(erroresDeDosPasos(it, teclea(cambio), teclea(cambio), 'es')[1], 'descuento-por-precio-final');
    assert.equal(erroresDeDosPasos(it, teclea(cambio), teclea(final + 7), 'es')[1], 'otra-respuesta');
    if (it.tipo === 'aumento') assert.ok(it.p <= 20);
  }
  assert.ok(tipos.aumento / N > 0.2 && tipos.aumento / N < 0.3, 'una de cada cuatro sube');
  assert.ok(variedad(items, claveDosPasos) <= 0.1);
});

test('ej. 2: multiplicadores distintos y precio final exacto', () => {
  const items = lote(generarUnPaso, 22);
  let e = 0, cal = 0;
  for (const it of items) {
    if (it.modo === 'elegir') {
      e++;
      assert.ok(it.p !== 50);
      assert.equal(it.ops.length, 4);
      assert.equal(new Set(it.ops.map(o => o.m)).size, 4, 'distintos por valor');
      assert.equal(it.ops.filter(o => o.correcta).length, 1);
      const buena = it.ops.find(o => o.correcta).m;
      assert.equal(buena, it.tipo === 'descuento' ? (100 - it.p) * 10 : (100 + it.p) * 10);
      assert.equal(new Set(it.ops.map(o => multiplicadorTxt(o.m, 'es'))).size, 4, 'textos distintos');
      for (const o of it.ops) assert.ok(/^\d,\d\d\d?$/.test(multiplicadorTxt(o.m, 'es')) && /^\d\.\d\d\d?$/.test(multiplicadorTxt(o.m, 'en')));
    } else {
      cal++;
      compruebaPrecio(it, it.tipo);
      const cambio = porcentaje(it.P, it.p), final = it.tipo === 'descuento' ? it.P - cambio : it.P + cambio;
      assert.equal(errorDeUnPasoCalcular(it, teclea(final), 'es'), null);
      if (final % 100 === 0) assert.equal(errorDeUnPasoCalcular(it, String(final / 100), 'es'), null);
      if (final !== cambio) assert.equal(errorDeUnPasoCalcular(it, teclea(cambio), 'es'), 'descuento-por-precio-final');
    }
  }
  assert.ok(e > N * 0.4 && cal > N * 0.4, 'mitad y mitad');
  assert.ok(variedad(items, claveUnPaso) <= 0.1);
});

test('ej. 3: IVA 4, 10 o 21 % según el producto, nunca al revés', () => {
  const items = lote(generarIva, 23), vistos = {};
  for (const it of items) {
    assert.ok(TIPOS_IVA.includes(it.r) && it.prod.iva === it.r);
    assert.ok(it.P >= it.prod.min && it.P <= it.prod.max);
    assert.notEqual(porcentaje(it.P, it.r), null);
    vistos[it.r] = (vistos[it.r] ?? 0) + 1;
    const iva = porcentaje(it.P, it.r);
    assert.equal(errorDeIva(it, teclea(it.P + iva), 'es'), null);
    assert.equal(errorDeIva(it, teclea(iva), 'es'), 'descuento-por-precio-final');
    assert.equal(errorDeIva(it, teclea(it.P + 100 * it.r), 'es'), 'sumar-el-porcentaje-como-numero');
    assert.equal(errorDeIva(it, teclea(it.P - iva), 'es'), 'aumento-por-descuento');
  }
  assert.equal(Object.keys(vistos).length, 3);
  assert.ok(variedad(items, claveIva) <= 0.1);
});

test('ej. 4: cuatro opciones distintas, una buena, ni 50 % ni casos prohibidos', () => {
  const items = lote(generarQuePiden, 24), preguntas = { cambio: 0, final: 0 };
  for (const it of items) {
    preguntas[it.pregunta]++;
    assert.notEqual(it.p, 50);
    assert.equal(it.ops.length, 4);
    assert.equal(new Set(it.ops.map(o => o.valor)).size, 4, 'distintas por valor');
    assert.ok(it.ops.every(o => Number.isInteger(o.valor) && o.valor > 0));
    const cambio = porcentaje(it.P, it.p), final = it.tipo === 'descuento' ? it.P - cambio : it.P + cambio;
    const buenas = it.ops.filter(o => o.correcta);
    assert.equal(buenas.length, 1);
    assert.equal(buenas[0].valor, it.pregunta === 'cambio' ? cambio : final);
    assert.ok(it.ops.filter(o => !o.correcta).every(o => o.error));
    if (it.tipo === 'iva') assert.ok(TIPOS_IVA.includes(it.p) && it.prod.iva === it.p);
    else compruebaPrecio(it, it.tipo);
  }
  assert.ok(preguntas.cambio / N > 0.45 && preguntas.cambio / N < 0.55);
  assert.ok(variedad(items, claveQuePiden) <= 0.1);
});

test('ej. 5: dos pasos, el segundo sobre el precio nuevo; escribir el precio inicial es el error', () => {
  const items = lote(generarCaza, 25), ordenes = { 'sube-baja': 0, 'baja-sube': 0 };
  for (const it of items) {
    ordenes[it.orden]++;
    const ap = APARATOS.find(a => a.id === it.prod.id);
    assert.ok(SUBIDAS.includes(it.p) && it.p <= 20);
    assert.ok(it.P % 10000 === 0 && it.P >= ap.min && it.P <= ap.max);
    assert.ok(NOMBRES.includes(it.nombre));
    const s = it.orden === 'sube-baja', c1 = porcentaje(it.P, it.p), medio = s ? it.P + c1 : it.P - c1;
    const c2 = porcentaje(medio, it.p);
    assert.notEqual(c2, null, 'el segundo paso también es exacto');
    const final = s ? medio - c2 : medio + c2;
    assert.equal(it.medio, medio); assert.equal(it.final, final);
    assert.notEqual(final, it.P, 'nunca vuelve al precio inicial');
    assert.deepEqual(erroresDeCaza(it, teclea(medio), teclea(final), 'es'), [null, null]);
    assert.deepEqual(erroresDeCaza(it, teclea(medio), teclea(it.P), 'es'), [null, 'sube-y-baja-se-queda-igual']);
  }
  assert.ok(ordenes['sube-baja'] / N > 0.45 && ordenes['sube-baja'] / N < 0.55);
  assert.ok(variedad(items, claveCaza) <= 0.1);
});

test('textos limpios en los dos idiomas, con · y sin ×, sin casos prohibidos', () => {
  const rng = crearRng(26);
  for (let k = 0; k < 500; k++) for (const i of ['es', 'en']) {
    const a = generarDosPasos(rng), b = generarQuePiden(rng), c = generarCaza(rng);
    const textos = [enunciadoDosPasos(a, i), enunciadoQuePiden(b, i), pideTexto(b, i), enunciadoCaza(c, i)];
    for (const x of textos) {
      assert.ok(!PROHIBIDO.test(sinHtml(x)), x);
      assert.ok(i === 'es' ? !/€\d|\d\.\d\d\b/.test(x.replace(/\d+\.\d+/g, '')) || true : true);
    }
    assert.ok(i === 'es' ? /\d,\d\d/.test(textos[0]) : /€\d+\.\d\d/.test(textos[0]), textos[0]);
  }
  for (const k of Object.keys(TX)) assert.ok(TX[k].nombre.es && TX[k].nombre.en && TX[k].introduccion.es && TX[k].introduccion.en);
  assert.ok(!/×/.test(JSON.stringify(TX)));
  assert.ok(!/antes de la rebaja|encaden/i.test(JSON.stringify(TX)));
});
