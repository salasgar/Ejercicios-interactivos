// «Problemas de toda la unidad» (PU2 tarea 224): 3000 ítems por ejercicio contra una segunda vía de cálculo, las cotas
// de cada contexto, la inequívoca falsedad de cada opción, la variedad y los textos en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { declaracionDe } from '../practicas/_comun/base.js';
import { fraccion, comparar } from '../practicas/_comun/fracciones.js';
import { dentroDeCota } from '../practicas/_comun/proporcion.js';
import * as L from '../practicas/problemas-proporcion/logica.js';
import * as X from '../practicas/problemas-proporcion/textos.js';

const IDIOMAS = ['es', 'en'];
const N = 3000;
const textosDe = idioma => ({ idioma, t: T[idioma], tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/[\s  ]+/g, ' ').trim();
const practica = await declaracionDe(CATALOGO.find(f => f.slug === 'problemas-proporcion'));
const [ej1, ej4, ej5] = practica.ejercicios;
const items = (def, semilla, n = N) => {
  const rng = crearRng(semilla);
  return Array.from({ length: n }, (_, i) => def.generar(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] }));
};
const val = s => { const [n, d] = s.split('/').map(Number); return fraccion(n, d); };
const sana = (html, donde) => {
  assert.equal(typeof html, 'string', donde);
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, `${donde}: ${plano(html)}`);
  assert.doesNotMatch(plano(html), /aproximadamente|approximately|veces más|times more|inversa|inverse/i, `${donde}: ${plano(html)}`);
  assert.doesNotMatch(plano(html), /(?<![\d,.])\d{5,}(?![\d])/, `cinco cifras sin espacio fino — ${donde}: ${plano(html)}`);
  for (const m of plano(html).matchAll(/(\d+[.,]\d+)\s*€|€\s*(\d+[.,]\d+)/g)) assert.match(m[1] ?? m[2], /^\d+[.,]\d\d$/, `dinero sin 2 decimales — ${donde}: ${plano(html)}`);
  assert.doesNotMatch(plano(html), / · [A-ZÁÉÍÓÚÑ]/, `«·» separando frases — ${donde}`);
};
const variedad = (lista, tope = 0.1) => {
  const cuenta = new Map();
  for (const k of lista) cuenta.set(k, (cuenta.get(k) ?? 0) + 1);
  assert.ok(Math.max(...cuenta.values()) / lista.length <= tope, `un caso se repite demasiado: ${[...cuenta].sort((a, b) => b[1] - a[1])[0]}`);
};

test('problemas-proporcion: declarada con tres ejercicios, todos con «No lo sé»', () => {
  assert.equal(practica.ejercicios.length, 3);
  for (const e of practica.ejercicios) assert.equal(typeof e.explicacion, 'function');
});

test('ej. 1: cada tipo lleva sus marcas, está dentro de cota y no es un caso reservado', () => {
  const lista = items(ej1, 1);
  const vistos = new Set();
  for (const item of lista) {
    vistos.add(item.tipo);
    const ctx = L.ctxPorId(item.ctx);
    assert.ok(ctx);
    const datos = L.datosDe(item);
    assert.ok(dentroDeCota(ctx, datos), `fuera de cota: ${item.ctx}`);
    for (const idioma of IDIOMAS) {
      const txt = plano(X.enunciadoTipo(item, idioma));
      sana(X.enunciadoTipo(item, idioma).replace(/%/g, ' por ciento'), `ej1 ${item.ctx}`);
      if (item.tipo === 'porcentaje') assert.match(txt, /%|por cent|percent/i, txt);
      if (item.tipo === 'escala') assert.match(txt, /1\s*:\s*\d|escala|scale/i, txt);
      if (item.tipo === 'directa') assert.doesNotMatch(txt, /%|escala|scale|1\s*:\s*\d|proporcional|proportional|razón|ratio/i, txt);
      if (item.tipo === 'reparto') assert.match(txt, /proporcional|proportional|razón|ratio|reparte|share|divide/i, txt);
    }
    assert.ok(!L.esReservado(item.tipo, Object.fromEntries(Object.keys(ctx.datos).map(k => [k, datos[k]]))));
  }
  assert.deepEqual([...vistos].sort(), [...L.TIPOS].sort());
  variedad(lista.map(i => `${i.ctx}:${Object.values(i.v).join(',')}`));
});

test('ej. 1: las cuatro opciones son distintas y solo una es la buena', () => {
  for (const idioma of IDIOMAS) {
    const textos = L.TIPOS.map(t => plano(X.TIPO[t][idioma]));
    assert.equal(new Set(textos).size, 4);
  }
});

test('ej. 4: la mejor oferta sale igual por el precio por unidad y por el producto cruzado', () => {
  const lista = items(ej4, 4);
  let empates = 0, grandeGana = 0, noEmpates = 0;
  for (const item of lista) {
    const [[q1, p1], [q2, p2]] = item.e;
    const u1 = fraccion(p1, q1), u2 = fraccion(p2, q2);
    const c = comparar(u1, u2);
    assert.equal(item.buena, c < 0 ? 0 : c > 0 ? 1 : 2);
    assert.equal(item.buena, L.mejorOferta(item.e));
    assert.notEqual(q1, q2);
    for (const [q, p] of item.e) {
      assert.ok(p % q === 0, 'el precio por unidad es exacto al céntimo');
      const [lo, hi] = L.PRODUCTOS[item.prod].pu;
      assert.ok(p / q >= lo && p / q <= hi, `${item.prod}: ${p / q} cts fuera de cota`);
      assert.ok(p >= 20 && p <= 3000);
    }
    if (item.buena === 2) empates++;
    else { noEmpates++; const grande = q1 > q2 ? 0 : 1; if (item.buena === grande) grandeGana++; }
    for (const idioma of IDIOMAS) {
      const e = X.enunciadoOferta(item, idioma);
      sana(`${e.texto} ${e.pregunta}`, 'ej4 enunciado');
      const ops = X.opcionesOferta(item, idioma).map(plano);
      assert.equal(new Set(ops).size, 3);
    }
  }
  assert.ok(empates / N > 0.1 && empates / N < 0.2, `empates: ${empates / N}`);
  assert.ok(grandeGana / noEmpates > 0.35 && grandeGana / noEmpates < 0.65, `el grande gana: ${grandeGana / noEmpates}`);
  variedad(lista.map(i => `${i.prod}:${i.e.flat().join(',')}`));
});

test('ej. 4: cada fallo tiene su motivo y ninguna opción distinta de la buena es correcta', () => {
  for (const item of items(ej4, 14, 1000)) {
    for (let i = 0; i < 3; i++) {
      const e = L.errorOferta(item, i);
      if (i === item.buena) assert.equal(e, null);
      else assert.ok(['mas-barato-en-total', 'el-grande-siempre', 'cree-que-cuestan-lo-mismo', 'otro'].includes(e), e);
    }
  }
});

test('ej. 5: un solo defecto como mucho; lo absurdo, absurdo de verdad; el redondeo, exacto y no natural', () => {
  const lista = items(ej5, 5);
  const cuenta = { ok: 0, unidad: 0, redondeo: 0, absurdo: 0 };
  for (const item of lista) {
    cuenta[item.motivo]++;
    const mostrado = val(item.mostrado);
    const bueno = L.valorBueno(item);
    if (item.kind === 'redondeo') {
      const q = fraccion(item.total, item.cap).simplificar();
      assert.ok(!q.esEntera(), 'no hay cociente entero');
      assert.ok(bueno.esEntera() && comparar(bueno, q) > 0 && comparar(bueno, q.sumar(fraccion(1))) < 0);
      if (item.motivo === 'redondeo') assert.ok(mostrado.equals(q) && !mostrado.esEntera());
      else assert.ok(mostrado.equals(bueno));
    } else {
      const ctx = L.ctxPorId(item.ctx);
      assert.ok(dentroDeCota(ctx, L.datosDe(item)), `fuera de cota ${item.ctx}`);
      if (item.motivo === 'ok' || item.motivo === 'unidad') assert.ok(mostrado.equals(bueno), 'el número es el bueno');
      if (item.motivo === 'unidad') assert.ok(item.unidad, 'lleva la otra unidad');
      if (item.motivo === 'absurdo') {
        assert.ok(!mostrado.equals(bueno));
        const d = L.datosDe(item);
        if (item.kind === 'descuento') assert.ok(comparar(mostrado, d.precio.valor) > 0, 'el precio rebajado sube');
        else if (item.kind === 'porcentaje') assert.ok(comparar(mostrado, d.total.valor) > 0);
        else assert.ok(L.muyFuera(mostrado, ctx.datos[L.claveRespuesta(item.kind) === 'real' ? 'real' : L.claveRespuesta(item.kind)].cota), `${item.ctx}: ${item.mostrado}`);
      }
    }
    for (const idioma of IDIOMAS) {
      const e = X.enunciadoSentido(item, idioma);
      sana(`${e.texto} ${e.dado} ${e.pregunta}`.replace(/%/g, ' por ciento'), `ej5 ${item.kind}`);
    }
  }
  const total = lista.length;
  assert.ok(cuenta.ok / total > 0.3 && cuenta.ok / total < 0.37, `buenas: ${cuenta.ok / total}`);
  for (const m of ['unidad', 'redondeo', 'absurdo']) assert.ok(cuenta[m] / total > 0.1, m);
  variedad(lista.map(i => `${i.motivo}:${i.ctx}:${i.mostrado}:${i.total ?? Object.values(i.v).join(',')}`));
});

test('ej. 5: las cuatro opciones son distintas en los dos idiomas', () => {
  for (const idioma of IDIOMAS) assert.equal(new Set(L.MOTIVOS.map(m => X.MOTIVO[m][idioma])).size, 4);
});

test('los textos de la práctica están en los dos idiomas', () => {
  for (const clave of ['tipo', 'oferta', 'sentido']) for (const campo of ['nombre', 'detalle', 'introduccion']) for (const idioma of IDIOMAS) assert.ok(X.TX[clave][campo][idioma], `${clave}.${campo}.${idioma}`);
  assert.ok(textosDe('es').idioma);
});
