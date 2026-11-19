// «El tanto por ciento de una cantidad» (PU2 tarea 219): exactitud por otro camino, un solo resultado en el ej. 3,
// cotas del ej. 4 y variedad, con fuerza bruta sobre miles de ítems.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { declaracionDe } from '../practicas/_comun/base.js';
import { fraccion } from '../practicas/_comun/fracciones.js';
import { dentroDeCota } from '../practicas/_comun/proporcion.js';
import * as L from '../practicas/tanto-por-ciento/logica.js';

const N = 3000;
const val = s => { const [n, d] = s.split('/').map(Number); return fraccion(n, d); };
const practica = await declaracionDe(CATALOGO.find(f => f.slug === 'tanto-por-ciento'));
const [ej1, ej2, ej3, ej4] = practica.ejercicios;
const items = (def, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, (_, i) => def.generar(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: i % 2 ? 'en' : 'es' }));
};
const exacto = (p, n) => (BigInt(p) * BigInt(n)) % 100n === 0n;

test('tanto-por-ciento · ej. 1: p · N es múltiplo de 100 y el resultado es natural', () => {
  for (const it of items(ej1, 11)) {
    assert.ok(L.PORCENTAJES_CABEZA.includes(it.p));
    assert.ok(it.N >= 20 && it.N <= 800, `N=${it.N}`);
    assert.ok(exacto(it.p, it.N), `${it.p} % de ${it.N}`);
    assert.equal(L.parteDe(it.p, it.N).den, 1);
    assert.equal(L.parteDe(it.p, it.N).num, Number(BigInt(it.p) * BigInt(it.N) / 100n));
  }
});

test('tanto-por-ciento · ej. 2: porcentajes que no son de cabeza, siempre exactos', () => {
  let unaCifra = 0;
  for (const it of items(ej2, 12)) {
    assert.ok(!L.PORCENTAJES_CABEZA.includes(it.p), `p=${it.p}`);
    assert.ok(it.p >= 1 && it.p <= 99);
    assert.ok(exacto(it.p, it.N), `${it.p} % de ${it.N}`);
    assert.ok(it.N >= 20 && it.N <= 1000);
    if (it.p < 10) unaCifra++;
  }
  assert.ok(unaCifra > N / 6, `porcentajes de una cifra: ${unaCifra}`);
});

test('tanto-por-ciento · ej. 3: una sola cuenta buena y cuatro valores distintos', () => {
  const estilos = new Set();
  for (const it of items(ej3, 13)) {
    assert.equal(it.opciones.length, 4);
    estilos.add(it.estilo);
    const bien = L.parteDe(it.p, it.N);
    const valores = it.opciones.map(o => {
      const c = L.cuentaDe(o.tipo, it.p, it.N);
      assert.ok(c, `${o.tipo} ${it.p} ${it.N}`);
      assert.ok(L.decimalExacto(c.valor), 'valor con periódico');
      return c.valor;
    });
    assert.equal(it.opciones.filter(o => o.error === null).length, 1);
    valores.forEach((v, i) => assert.equal(v.equals(bien), it.opciones[i].error === null, `${it.opciones[i].tipo}`));
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) assert.ok(!valores[i].equals(valores[j]), `repetidos ${it.p} ${it.N}`);
  }
  assert.deepEqual([...estilos].sort(), [...L.ESTILOS].sort());
});

test('tanto-por-ciento · ej. 4: cotas del contexto, personas enteras, dos decimales en dinero', () => {
  for (const it of items(ej4, 14)) {
    const ctx = L.ctxDe(it.ctx);
    const d = L.datosDe(it);
    assert.ok(it.p >= L.P_PROBLEMAS[0] && it.p <= L.P_PROBLEMAS[1], `p=${it.p}`);
    assert.ok(dentroDeCota(ctx, d), `${it.ctx} ${it.total} ${it.p}`);
    const parte = val(it.parte);
    assert.ok(parte.equals(L.parteDe(it.p, val(it.total).num)));
    if (ctx.datos.parte.etiqueta) assert.equal(parte.den, 1, 'persona partida');
    assert.ok(L.decimalExacto(parte));
    assert.ok(L.aciertaProblema(it, L.leerCampo(L.textoParte(it, 'es').split(' ')[0], 'es', L.unidadLectura(it))), 'acierta con lo suyo');
  }
});

test('tanto-por-ciento · variedad: ningún ítem se repite más del 10 %', () => {
  for (const [def, s] of [[ej1, 21], [ej2, 22], [ej3, 23], [ej4, 24]]) {
    const cuenta = new Map();
    for (const it of items(def, s)) { const k = JSON.stringify([it.p, it.N, it.ctx, it.total]); cuenta.set(k, (cuenta.get(k) ?? 0) + 1); }
    assert.ok(Math.max(...cuenta.values()) <= N / 10);
    assert.ok(cuenta.size > 30, `${cuenta.size} ítems distintos`);
  }
});

test('tanto-por-ciento · errorDe nombra los fallos de «el 15 % de 80» y deja «otro» para lo demás', () => {
  const v = s => ({ valor: fraccion(s) });
  assert.equal(L.errorDe(15, 80, v(65)), 'restar-el-porcentaje');
  assert.equal(L.errorDe(15, 80, v(1200)), 'porcentaje-sin-dividir');
  assert.equal(L.errorDe(15, 80, v(68)), 'dar-el-resto');
  assert.equal(L.errorDe(15, 80, v(7)), 'otro');
  assert.equal(L.errorDe(25, 80, v(40)), 'mitad-por-cuarto');
});
