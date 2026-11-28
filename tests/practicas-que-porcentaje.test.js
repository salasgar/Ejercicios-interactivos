// «¿Qué porcentaje? ¿De cuánto?» (PU2 tarea 220): exactitud por otro camino, equilibrio del ej. 3,
// cotas del ej. 4, errores y variedad, con fuerza bruta sobre miles de ítems.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { declaracionDe } from '../practicas/_comun/base.js';
import { fraccion } from '../practicas/_comun/fracciones.js';
import { dentroDeCota, CONTEXTOS } from '../practicas/_comun/proporcion.js';
import * as L from '../practicas/que-porcentaje/logica.js';
import * as X from '../practicas/que-porcentaje/textos.js';

const N = 3000;
const val = s => { const [n, d] = s.split('/').map(Number); return fraccion(n, d); };
const practica = await declaracionDe(CATALOGO.find(f => f.slug === 'que-porcentaje'));
const [ej1, ej2, ej3, ej4] = practica.ejercicios;
const items = (def, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, (_, i) => def.generar(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: i % 2 ? 'en' : 'es' }));
};
const cumple = it => BigInt(it.parte) * 100n === BigInt(it.p) * BigInt(it.N);

for (const [nombre, def, s, errores] of [['ej. 1', ej1, 11, L.erroresPorcentaje], ['ej. 2', ej2, 12, L.erroresTotal]]) {
  test(`que-porcentaje · ${nombre}: p entero 1-99, parte natural menor que el total, exacto`, () => {
    for (const it of items(def, s)) {
      assert.ok(Number.isInteger(it.p) && it.p >= 1 && it.p <= 99, `p=${it.p}`);
      assert.ok(Number.isInteger(it.parte) && it.parte >= 1 && it.parte < it.N, `${it.parte} de ${it.N}`);
      assert.ok(cumple(it), `${it.parte}·100 ≠ ${it.p}·${it.N}`);
      assert.ok(it.N >= 10 && it.N <= 500);
      const { P, A, T } = L.trioDe(it);
      const bien = nombre === 'ej. 1' ? P : T;
      for (const e of errores(P, A, T)) {
        assert.ok(!e.valor.equals(bien), `error igual al bueno: ${e.error}`);
        assert.ok(L.decimalExacto(e.valor), `error periódico: ${e.error}`);
      }
    }
  });
}

test('que-porcentaje · ej. 1 y 2: los primeros aciertos usan porcentajes y totales fáciles', () => {
  const rng = crearRng(5);
  for (let i = 0; i < 500; i++) for (const def of [ej1, ej2]) {
    const it = def.generar(rng, { aciertos: i % 3, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: 'es' });
    assert.ok(L.FACILES_P.includes(it.p), `p=${it.p}`);
  }
});

test('que-porcentaje · ej. 3: las tres preguntas equilibradas y el enunciado no da el dato que pide', () => {
  const cuenta = { parte: 0, porcentaje: 0, total: 0 };
  for (const [i, it] of items(ej3, 13).entries()) {
    cuenta[it.pregunta]++;
    const idioma = i % 2 ? 'en' : 'es';
    const texto = X.enunciadoTipo(it, idioma);
    const pedido = X.textoRespuesta(it, idioma);
    assert.ok(!new RegExp(`(?<![\\d,.])${pedido.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(texto), `${pedido} en «${texto}»`);
  }
  for (const k of Object.keys(cuenta)) assert.ok(Math.abs(cuenta[k] - N / 3) < N * 0.05, `${k}: ${cuenta[k]}`);
});

test('que-porcentaje · ej. 4: cotas del contexto, personas enteras, dos decimales en dinero, sin precios', () => {
  let tipos = { parte: 0, porcentaje: 0, total: 0 };
  for (const it of items(ej4, 14)) {
    tipos[it.pregunta]++;
    const ctx = L.ctxDe(it.ctx);
    assert.ok(ctx && ctx.tipo === 'porcentaje' && L.IDS_CONTEXTOS.includes(ctx.id), it.ctx);
    const d = L.datosDe(it);
    assert.ok(it.p >= L.P_CONTEXTOS[0] && it.p <= L.P_CONTEXTOS[1], `p=${it.p}`);
    assert.ok(dentroDeCota(ctx, d), `${it.ctx} ${it.total} ${it.p}`);
    const A = val(it.parte), T = val(it.total);
    assert.ok(A.multiplicar(100).equals(T.multiplicar(it.p)), 'parte·100 = p·total');
    assert.ok(A.num * T.den < T.num * A.den, 'parte menor que el total');
    for (const [clave, f] of [['parte', A], ['total', T]]) {
      const spec = ctx.datos[clave];
      if (spec.etiqueta) assert.equal(f.den, 1, `${clave} partido`);
      else assert.ok(L.decimalExacto(f), `${clave} periódico`);
    }
    assert.ok(L.aciertaProblema(it, L.leerCampo(X.textoRespuesta(it, 'es').replace(/\s*[^\d,.\s%€\u00a0].*$/, ''), 'es', L.unidadLectura(it))), 'acierta con lo que se lee');
  }
  assert.ok(tipos.porcentaje > tipos.total && tipos.total > tipos.parte, JSON.stringify(tipos));
});

test('que-porcentaje · errorDe nombra los fallos de «¿qué porcentaje es 12 de 80?» y deja «otro» para lo demás', () => {
  const P = fraccion(15), A = fraccion(12), T = fraccion(80);
  const lee = s => L.leerCampo(s, 'es', '%');
  assert.equal(L.errorDe('porcentaje', P, A, T, lee('15'), '%'), 'otro');
  assert.equal(L.errorDe('porcentaje', P, A, T, lee('12'), '%'), 'la-parte-como-porcentaje');
  assert.equal(L.errorDe('porcentaje', P, A, T, lee('77'), '%'), 'otro');
});

test('que-porcentaje · variedad: ningún ítem se repite más del 10 %', () => {
  for (const [def, s] of [[ej1, 21], [ej2, 22], [ej3, 23], [ej4, 24]]) {
    const cuenta = new Map();
    for (const it of items(def, s)) { const k = JSON.stringify([it.p, it.N, it.ctx, it.total, it.pregunta]); cuenta.set(k, (cuenta.get(k) ?? 0) + 1); }
    assert.ok(Math.max(...cuenta.values()) <= N / 10);
    assert.ok(cuenta.size > 30, `${cuenta.size} ítems distintos`);
  }
});

test('que-porcentaje · textos: sin × ni palabras de otras unidades', () => {
  const prohibidas = /descuent|rebaj|aument|IVA|discount|sale price|increase|×/i;
  for (const [def, s] of [[ej1, 41], [ej2, 42], [ej3, 43], [ej4, 44]]) for (const it of items(def, s).slice(0, 300)) for (const idioma of ['es', 'en']) {
    const t = def.enunciado(it, { idioma }) + def.explicacion(it, { idioma, t: {}, tt: o => o[idioma], esc: x => x });
    assert.doesNotMatch(t, prohibidas, t);
  }
});

test('que-porcentaje · casos reservados: ningún ítem de la hoja 3 ni del examen 3 (3000 por ejercicio, también los fáciles)', async () => {
  const { HUELLAS_RESERVADAS } = await import('../practicas/que-porcentaje/reserva.js');
  assert.ok(HUELLAS_RESERVADAS.size >= 80);
  for (const [def, s] of [[ej1, 51], [ej2, 52], [ej3, 53], [ej4, 54]]) {
    for (const it of items(def, s)) assert.ok(!L.huellasDe(it).some(h => HUELLAS_RESERVADAS.has(h)), `${def.nombre.es}: ${JSON.stringify(it)}`);
    const rng = crearRng(s + 10);
    for (let i = 0; i < N; i++) { const it = def.generar(rng, { aciertos: i % 3, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: 'es' }); assert.ok(!L.esReservado(it)); }
  }
  assert.ok(L.esReservado({ p: 75, N: 40 }), 'el 75 % de 40 es de la hoja');
});

test('que-porcentaje · los ejemplos de las introducciones no son casos del papel', () => {
  for (const [p, N] of [[15, 80], [20, 150], [20, 25]]) assert.ok(!L.esReservado({ p, N }), `${p} % de ${N}`);
});

test('que-porcentaje · ahorros: el regalo cuesta como mucho 60,00 € (cota propia, sin tocar proporcion.js)', () => {
  let n = 0;
  for (const def of [ej3, ej4]) for (const it of items(def, 61)) {
    if (it.ctx !== 'ahorros') continue;
    n++;
    const A = val(it.parte);
    assert.ok(A.num <= L.REGALO_MAX * A.den, `regalo ${it.parte}`);
  }
  assert.ok(n > 100, `${n} ítems de ahorros`);
});
