// «¿Directa, inversa o ninguna?» (PU2, tarea 216): la lógica de los tres ejercicios, con 3000 ítems por ejercicio.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { declaracionDe } from '../practicas/_comun/base.js';
import { fraccion } from '../practicas/_comun/fracciones.js';
import { dentroDeCota, cantidad } from '../practicas/_comun/proporcion.js';
import * as L from '../practicas/directa-o-inversa/logica.js';
import * as X from '../practicas/directa-o-inversa/textos.js';

const N = 3000;
const IDIOMAS = ['es', 'en'];
const practica = await declaracionDe(CATALOGO.find(f => f.slug === 'directa-o-inversa'));
const [ej1, ej2, ej3] = practica.ejercicios;
const items = (def, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, (_, i) => def.generar(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] }));
};
const textosDe = idioma => ({ idioma, t: T[idioma], tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/[\s  ]+/g, ' ').trim();
const sano = (html, donde) => {
  assert.equal(typeof html, 'string', donde);
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×|%/, `${donde}: ${plano(html)}`);
  assert.doesNotMatch(plano(html), /por ciento|per cent|reparto|share out/i, donde);
};
const entre = (x, min, max, donde) => assert.ok(x >= min && x <= max, `${donde}: ${x}`);

test('ej. 1: el banco tiene al menos 10 situaciones por casilla, con su condición y sus pares que lo demuestran', () => {
  for (const clase of L.CLASES) assert.ok(L.BANCO.filter(s => s.clase === clase).length >= 10, clase);
  assert.equal(new Set(L.BANCO.map(s => s.id)).size, L.BANCO.length);
  for (const s of L.BANCO) {
    const [x1, y1, x2, y2] = s.par;
    assert.equal(x2, 2 * x1, `${s.id}: el segundo caso es el doble`);
    const real = L.claseDePar(s.par);
    assert.equal(real, s.clase, `${s.id}: ${real}`);
    if (s.clase === 'directa') assert.equal(x1 * y2, x2 * y1, s.id);
    if (s.clase === 'inversa') assert.equal(x1 * y1, x2 * y2, s.id);
    if (s.clase === 'ninguna') {
      assert.notEqual(x1 * y2, x2 * y1, s.id);
      assert.notEqual(x1 * y1, x2 * y2, s.id);
      assert.notEqual(y2, 2 * y1, s.id);
      assert.notEqual(2 * y2, y1, s.id);
    }
    for (const idioma of IDIOMAS) for (const campo of ['cond', 'x', 'y', 'ux', 'uy']) assert.ok(s[campo][idioma], `${s.id} ${campo} ${idioma}`);
  }
});

test('ej. 1: tres casillas entre el 28 y el 38 %, ninguna situación por encima del 10 % y textos sanos', () => {
  const lista = items(ej1, 161);
  for (const clase of L.CLASES) entre(lista.filter(i => i.clase === clase).length / N, 0.28, 0.38, clase);
  const cuenta = new Map();
  for (const i of lista) cuenta.set(ej1.clave(i), (cuenta.get(ej1.clave(i)) ?? 0) + 1);
  for (const [k, v] of cuenta) assert.ok(v / N <= 0.10, `${k}: ${v}`);
  for (const idioma of IDIOMAS) for (const item of lista.slice(0, 400)) {
    sano(X.enunciadoSituacion(item, idioma), 'ej1 enunciado');
    sano(X.explicaSituacion(item, idioma), 'ej1 explica');
    for (const c of L.CLASES) sano(X.feedbackSituacion(item, c, idioma), 'ej1 feedback');
  }
});

test('ej. 2: la clase de la tabla se calcula con enteros, ninguna cumple dos y todas llevan una columna doble o triple', () => {
  const lista = items(ej2, 162);
  for (const t of lista) {
    assert.ok(t.xs.length >= 3 && t.xs.length <= 4);
    assert.equal(L.claseDeTabla([t.xs, t.ys]), t.clase, JSON.stringify(t));
    assert.ok(L.tieneDobleOTriple(t.xs), JSON.stringify(t));
    assert.equal(new Set(t.xs).size, t.xs.length);
    for (const v of [...t.xs, ...t.ys]) assert.ok(Number.isInteger(v) && v >= 1 && v <= 120, JSON.stringify(t));
  }
  for (const clase of L.CLASES) entre(lista.filter(t => t.clase === clase).length / N, 0.28, 0.38, clase);
  for (const sub of ['suma', 'resta', 'casilla']) assert.ok(lista.some(t => t.subtipo === sub), sub);
  const cuenta = new Map();
  for (const t of lista) cuenta.set(ej2.clave(t), (cuenta.get(ej2.clave(t)) ?? 0) + 1);
  for (const [k, v] of cuenta) assert.ok(v / N <= 0.10, `${k}: ${v}`);
});

test('ej. 2: el feedback no lleva números periódicos ni restos', () => {
  for (const idioma of IDIOMAS) for (const t of items(ej2, 163).slice(0, 600)) {
    for (const html of [X.explicaTabla(t, idioma), ...L.CLASES.map(c => X.feedbackTabla(t, c, idioma)), X.enunciadoTabla(t, idioma)]) {
      sano(html, 'ej2');
      assert.doesNotMatch(plano(html), /\d[.,]\d{4,}/, plano(html));
    }
  }
});

test('ej. 3: cuatro cuentas con cuatro valores distintos, solo una buena, dentro de las cotas del contexto', () => {
  const lista = items(ej3, 164);
  const vistos = { directa: 0, inversa: 0 };
  for (const item of lista) {
    vistos[item.sentido]++;
    assert.equal(item.opciones.length, 4);
    assert.equal(item.opciones.filter(t => t === 'buena').length, 1);
    const valores = item.opciones.map(t => L.valorDe(item, t));
    for (let p = 0; p < 4; p++) {
      assert.ok(valores[p].num > 0, JSON.stringify(item));
      for (let q = p + 1; q < 4; q++) assert.ok(!valores[p].equals(valores[q]), JSON.stringify(item));
    }
    const ctx = L.ctxDe(item.ctx);
    assert.equal(ctx.tipo, item.sentido);
    const buena = valores[item.opciones.indexOf('buena')];
    const d = { a: L.Q(item, 'a'), b: L.Q(item, 'b'), c: L.Q(item, 'c'), d: cantidad(buena, ctx.datos.d.unidad ?? null) };
    if (ctx.datos.k) d.k = cantidad(val(item.b).dividir(val(item.a)).simplificar(), ctx.datos.k.unidad ?? null);
    if (!ctx.datos.k) assert.ok(dentroDeCota(ctx, d), `${ctx.id} ${JSON.stringify(item)}`);
  }
  assert.ok(vistos.directa / N > 0.4 && vistos.inversa / N > 0.4, JSON.stringify(vistos));
  const cuenta = new Map();
  for (const i of lista) cuenta.set(ej3.clave(i), (cuenta.get(ej3.clave(i)) ?? 0) + 1);
  for (const [k, v] of cuenta) assert.ok(v / N <= 0.10, `${k}: ${v}`);
});

function val(s) { const [n, d] = s.split('/').map(Number); return fraccion(n, d); }

test('ej. 3: las cuentas enseñan la operación, no el resultado, y los textos están sanos', () => {
  for (const idioma of IDIOMAS) for (const item of items(ej3, 165).slice(0, 600)) {
    const textos = item.opciones.map(t => X.cuentaTexto(item, t, idioma));
    assert.equal(new Set(textos).size, 4, textos.join(' | '));
    for (const c of textos) assert.match(c, /^x = [\d.,]+ [·+−] [\d.,]+( : [\d.,]+)?$/, c);
    sano(X.enunciadoPlan(item, idioma), 'ej3 enunciado');
    sano(X.explicaPlan(item, idioma), 'ej3 explica');
    for (const t of item.opciones.filter(o => o !== 'buena')) sano(X.feedbackPlan(item, t, idioma), `ej3 feedback ${t}`);
    assert.match(plano(X.feedbackPlan(item, item.opciones.find(o => o !== 'buena'), idioma)), idioma === 'es' ? /^De / : /^From /);
  }
});

test('ej. 3: la cuenta buena da el resultado por una segunda vía', () => {
  for (const item of items(ej3, 166).slice(0, 600)) {
    const a = val(item.a), b = val(item.b), c = val(item.c);
    const esperado = item.sentido === 'directa' ? b.dividir(a).multiplicar(c) : b.multiplicar(a).dividir(c);
    assert.ok(esperado.simplificar().equals(L.valorDe(item, 'buena')), JSON.stringify(item));
  }
});

test('reserva: ningún ítem de 3000 de los ej. 2 y 3 es un caso de la hoja 2 ni del examen 2', () => {
  for (const [def, semilla] of [[ej2, 2161], [ej3, 2162]]) {
    for (const it of items(def, semilla)) assert.equal(L.esReservado(it), false, JSON.stringify(it));
  }
});

test('dinero: toda cantidad en euros del ej. 1 lleva dos decimales (es y en)', () => {
  for (const s of L.BANCO) for (const idioma of IDIOMAS) {
    for (const t of [s.cond[idioma], X.enunciadoSituacion({ id: s.id }, idioma)]) {
      assert.doesNotMatch(plano(t), idioma === 'es' ? /\d+ €(?<!,\d\d €)/ : /€\d+(?!\.\d\d|\d)/, `${s.id} ${idioma}: ${plano(t)}`);
    }
    const [x1, y1, x2, y2] = s.par;
    const txt = plano(`${X.con(x1, s.ux[idioma], idioma)} ${X.con(y1, s.uy[idioma], idioma)} ${X.con(x2, s.ux[idioma], idioma)} ${X.con(y2, s.uy[idioma], idioma)}`);
    assert.doesNotMatch(txt, idioma === 'es' ? /\d [ ]?€(?<!,\d\d [ ]?€)/ : /€\d+(?!\.\d\d|\d)/, txt);
  }
});
