// Práctica «Fracciones equivalentes» de la unidad 4: 3000 ítems por ejercicio con semillas fijas.
// Por valor (enteros, nunca decimales): el factor del ej. 1 es entero de 2 a 6 y los denominadores ≤ 60;
// el ej. 2 reparte 50/50 y en los «No» los productos cruzados son distintos de verdad; en el ej. 3
// ninguna caja comparte valor con otra; en el ej. 4 el m.c.m. y las equivalentes son los buenos.
// Y ningún texto de alumno lleva ×, letras de variable, decimales, negativas ni mixtos.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { mcm } from '../practicas/_comun/aritmetica.js';
import {
  fr, generarTermino, generarSonEquivalentes, generarEquipos, generarComun, errorTermino, errorEquivalentes,
  evaluarEquipos, errorMcm, errorNumeradores, cruzados, nombreDe, ERRORES_PROPIOS, DEN_MAX, claveDe,
} from '../practicas/equivalentes/logica.js';
import { TX } from '../practicas/equivalentes/textos.js';

const N = 3000;
const lote = (generar, semilla) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => generar(rng)); };
const sinHtml = t => t.replace(/<[^>]+>/g, '');

test('ej. 1: factor entero de 2 a 6, denominadores ≤ 60, el hueco es el término que falta', () => {
  let ampliar = 0, num = 0;
  for (const it of lote(generarTermino, 4801)) {
    assert.ok(Number.isInteger(it.k) && it.k >= 2 && it.k <= 6);
    const chica = it.direccion === 'ampliar' ? it.izq : it.der;
    const grande = it.direccion === 'ampliar' ? { ...it.der, [it.hueco]: it.respuesta } : it.izq;
    const completa = it.direccion === 'ampliar' ? grande : { ...it.der, [it.hueco]: it.respuesta };
    assert.equal(it.der[it.hueco], null);
    assert.ok(fr(it.izq).equals(fr(completa)), `${JSON.stringify(it)}`);
    assert.ok(Math.max(it.izq.den, completa.den) <= DEN_MAX);
    assert.ok(Number.isInteger(it.respuesta) && it.respuesta >= 1);
    assert.equal(Math.max(it.izq.num, completa.num) / Math.min(it.izq.num, completa.num), it.k);
    if (it.direccion === 'ampliar') ampliar++;
    if (it.hueco === 'num') num++;
    assert.equal(errorTermino(it, it.respuesta), null);
    assert.notEqual(errorTermino(it, it.respuesta + 1), null);
    void chica;
  }
  assert.ok(ampliar > N * 0.4 && ampliar < N * 0.6);
  assert.ok(num > N * 0.4 && num < N * 0.6);
});

test('ej. 1: sumar la diferencia es el error del inventario (3/5 = □/20 → 18)', () => {
  const it = { izq: { num: 3, den: 5 }, der: { num: null, den: 20 }, hueco: 'num', respuesta: 12 };
  assert.equal(errorTermino(it, 18), 'suma-la-diferencia');
  assert.equal(errorTermino(it, 3), 'no-cambia-el-termino');
  assert.equal(errorTermino(it, 7), 'otra-respuesta');
});

test('ej. 2: reparto 50/50 y los «No» no son equivalentes de verdad, con su error típico', () => {
  let si = 0;
  const errores = new Set();
  for (const it of lote(generarSonEquivalentes, 4802)) {
    const [x, y] = cruzados(it);
    assert.equal(x === y, it.equivalentes, `${JSON.stringify(it)}`);
    assert.equal(fr(it.a).equals(fr(it.b)), it.equivalentes);
    assert.ok(Math.max(it.a.den, it.b.den) <= DEN_MAX);
    if (it.equivalentes) { si++; assert.equal(it.error, null); }
    else { assert.ok(nombreDe(it.error), it.error); errores.add(it.error); assert.notEqual(x, y); }
    assert.equal(errorEquivalentes(it, it.equivalentes), null);
    assert.ok(errorEquivalentes(it, !it.equivalentes));
  }
  assert.ok(si > N * 0.45 && si < N * 0.55, `equivalentes: ${si}`);
  assert.deepEqual([...errores].sort(), ['cambia-solo-un-termino', 'mismo-numerador', 'suma-el-mismo-numero']);
});

test('ej. 3: ocho tarjetas, 2-3 cajas, ninguna caja comparte valor con otra, sin tarjetas repetidas', () => {
  for (const it of lote(generarEquipos, 4803)) {
    assert.equal(it.tarjetas.length, 8);
    assert.ok(it.cajas === 2 || it.cajas === 3);
    const grupos = [...new Set(it.tarjetas.map(t => t.grupo))];
    assert.equal(grupos.length, it.cajas);
    assert.equal(new Set(it.tarjetas.map(t => `${t.num}/${t.den}`)).size, 8, 'repetidas');
    for (const a of it.tarjetas) for (const b of it.tarjetas) {
      assert.equal(fr(a).equals(fr(b)), a.grupo === b.grupo, `${a.num}/${a.den} y ${b.num}/${b.den}`);
    }
    for (const t of it.tarjetas) assert.ok(t.den <= 48 && t.den >= 2);
    // El reparto bueno es un acierto, y cualquier mezcla no.
    const bueno = Object.fromEntries(it.tarjetas.map(t => [t.id, t.grupo]));
    assert.equal(evaluarEquipos(it, bueno).acierto, true);
    const girado = Object.fromEntries(it.tarjetas.map(t => [t.id, (t.grupo + 1) % it.cajas]));
    assert.equal(evaluarEquipos(it, girado).acierto, true, 'cualquier orden de cajas vale');
    const sin = { ...bueno, [it.tarjetas[0].id]: null };
    assert.equal(evaluarEquipos(it, sin).acierto, false);
    assert.equal(evaluarEquipos(it, sin).estados[0].estado, 'falta');
    const mezcla = { ...bueno };
    const otra = it.tarjetas.find(t => t.grupo !== it.tarjetas[0].grupo);
    mezcla[otra.id] = it.tarjetas[0].grupo;
    const r = evaluarEquipos(it, mezcla);
    assert.equal(r.acierto, false);
    assert.equal(r.error, 'mezcla-valores');
  }
});

test('ej. 3: dos cajas con el mismo valor, o una vacía, no son un acierto', () => {
  const it = generarEquipos(crearRng(5));
  const grupoDe = Object.fromEntries(it.tarjetas.map(t => [t.id, t.grupo]));
  // todas las del grupo 0 en la caja 0 y en la 1 las del grupo 0 que sobren: se parte el grupo 0 en dos cajas
  const g0 = it.tarjetas.filter(t => t.grupo === 0);
  const partido = { ...grupoDe };
  partido[g0[0].id] = 1;
  for (const t of it.tarjetas) if (t.grupo === 1) partido[t.id] = it.cajas === 2 ? 1 : 1;
  const r = evaluarEquipos(it, partido);
  assert.equal(r.acierto, false);
  const todoEnUna = Object.fromEntries(it.tarjetas.map(t => [t.id, 0]));
  assert.equal(evaluarEquipos(it, todoEnUna).acierto, false);
});

test('ej. 4: el m.c.m. pedido es el de los denominadores, las equivalentes son buenas y la mitad no tiene múltiplos', () => {
  let sinMultiplo = 0;
  for (const it of lote(generarComun, 4804)) {
    assert.ok(it.a.den >= 2 && it.a.den <= 12 && it.b.den >= 2 && it.b.den <= 12 && it.a.den !== it.b.den);
    assert.equal(it.mcm, mcm(it.a.den, it.b.den));
    assert.ok(it.mcm <= DEN_MAX);
    assert.equal(it.ea.den, it.mcm); assert.equal(it.eb.den, it.mcm);
    assert.ok(fr(it.ea).equals(fr(it.a)) && fr(it.eb).equals(fr(it.b)));
    if (it.mcm !== it.a.den && it.mcm !== it.b.den) sinMultiplo++;
    assert.equal(errorMcm(it, it.mcm), null);
    assert.equal(errorNumeradores(it, it.ea.num, it.eb.num), null);
    assert.equal(errorNumeradores(it, it.a.num, it.b.num), 'solo-cambia-el-denominador');
    const producto = it.a.den * it.b.den;
    if (producto !== it.mcm) assert.equal(errorMcm(it, producto), 'producto-de-denominadores');
  }
  assert.ok(sinMultiplo > N * 0.5, `sin múltiplo: ${sinMultiplo}`);
});

test('textos de alumno sin ×, letras, decimales, negativas ni mixtos; todos los errores con nombre', () => {
  const textos = [];
  for (const idioma of ['es', 'en']) {
    const rng = crearRng(4805);
    for (let i = 0; i < 400; i++) {
      const a = generarTermino(rng), b = generarSonEquivalentes(rng), c = generarEquipos(rng), d = generarComun(rng);
      assert.ok(claveDe(a) && claveDe(b) && claveDe(c) && claveDe(d));
      textos.push(TX.ej1.correcto[idioma](a), TX.ej1.solucion[idioma](a), TX.ej1.instruccion[idioma],
        ...Object.values(TX.ej1.por_que).map(p => p[idioma](a, a.respuesta + 1)));
      textos.push(TX.ej2.cruzados[idioma](b, cruzados(b)), TX.ej2.instruccion[idioma],
        ...Object.values(TX.ej2.por_que).map(p => p[idioma](b)));
      textos.push(TX.ej3.instruccion[idioma](c), TX.ej3.solucion[idioma](c), TX.ej3.caja[idioma](1),
        ...Object.values(TX.ej3.por_que).map(p => p[idioma](c.tarjetas.slice(0, 2))));
      textos.push(TX.ej4.paso1[idioma], TX.ej4.paso2[idioma](d), TX.ej4.correcto[idioma](d), TX.ej4.solucion1[idioma](d), TX.ej4.solucion2[idioma](d),
        ...Object.values(TX.ej4.por_que).map(p => p[idioma](d)));
    }
  }
  for (const g of [TX.ej1, TX.ej2, TX.ej3, TX.ej4]) for (const campo of ['nombre', 'detalle', 'introduccion']) textos.push(g[campo].es, g[campo].en);
  for (const t of textos) {
    const l = sinHtml(t);
    assert.ok(!l.includes('×'), `× en «${l}»`);
    assert.ok(!/\d[.,]\d/.test(l), `decimal en «${l}»`);
    assert.ok(!/\d\s*\/\s*\d/.test(l), `barra de fracción en «${l}»`);
    assert.ok(!/−\d/.test(l) && !/\d+\s+\d+\s*\/\s*\d+/.test(l), `negativa o mixta en «${l}»`);
    assert.ok(!/\bundefined\b|NaN|\[object/.test(l), `valor roto en «${l}»`);
  }
  for (const [id, e] of Object.entries(ERRORES_PROPIOS)) { assert.ok(e.nombre.es && e.nombre.en, id); assert.ok(/^[a-z-]+$/.test(id)); }
});
