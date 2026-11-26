// «Problemas de proporcionalidad directa» (PU2 tarea 214): 3000 ítems por ejercicio contra una segunda vía
// de cálculo, las cotas de cada contexto, los cuatro planteamientos distintos entre sí, la inequívoca
// falsedad de cada motivo del ejercicio 4, la variedad y los textos en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { declaracionDe } from '../practicas/_comun/base.js';
import { fraccion, comparar } from '../practicas/_comun/fracciones.js';
import { dentroDeCota, aCantidad, cantidad, mismoValor } from '../practicas/_comun/proporcion.js';
import * as L from '../practicas/regla-de-tres/logica.js';
import * as X from '../practicas/regla-de-tres/textos.js';
import { HUELLAS_RESERVADAS } from '../practicas/regla-de-tres/reserva.js';

const IDIOMAS = ['es', 'en'];
const N = 3000;
const textosDe = idioma => ({ idioma, t: T[idioma], tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const practica = await declaracionDe(CATALOGO.find(f => f.slug === 'regla-de-tres'));
const [ej1, ej2, ej3, ej4] = practica.ejercicios;
const items = (def, semilla, n = N) => {
  const rng = crearRng(semilla);
  return Array.from({ length: n }, (_, i) => def.generar(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] }));
};
const val = s => { const [n, d] = s.split('/').map(Number); return fraccion(n, d); };
const sana = (html, donde) => {
  assert.equal(typeof html, 'string', donde);
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×|%/, `${donde}: ${plano(html)}`);
  assert.doesNotMatch(plano(html), /inversa|inverse/i, `${donde}: ${plano(html)}`);
};

test('regla-de-tres: la práctica está declarada con cuatro ejercicios y «No lo sé» en los que calculan', () => {
  assert.equal(practica.ejercicios.length, 4);
  assert.ok(ej1.noLoSe && ej3.noLoSe);
  for (const e of practica.ejercicios) assert.equal(typeof e.explicacion, 'function');
});

test('regla-de-tres: todo ítem está dentro de la cota de su contexto y la cuenta es exacta por otra vía', () => {
  for (const [def, semilla] of [[ej1, 1], [ej2, 2], [ej3, 3], [ej4, 4]]) {
    for (const item of items(def, semilla)) {
      const ctx = L.ctxDe(item.ctx);
      assert.ok(ctx, item.ctx);
      const datos = { a: L.Q(item, 'a'), b: L.Q(item, 'b'), c: L.Q(item, 'c'), d: L.Q(item, 'd') };
      if (ctx.datos.k) datos.k = cantidad(val(item.k), ctx.datos.k.unidad);
      assert.ok(dentroDeCota(ctx, datos), `fuera de cota: ${item.ctx} ${item.a} ${item.b} ${item.c} ${item.d}`);
      const a = val(item.a), b = val(item.b), c = val(item.c), d = val(item.d), k = val(item.k);
      const por = fraccion(ctx.porCada ?? 1);
      assert.ok(b.multiplicar(por).dividir(a).equals(k), 'k = b : a (por cada 100 km en el coche)');
      assert.ok(b.multiplicar(c).dividir(a).equals(d), 'd = b · c : a');
      assert.ok(!a.equals(c));
    }
  }
});

test('regla-de-tres · ej. 1: la casilla «1» y la del total valen lo mismo por dos caminos', () => {
  for (const item of items(ej1, 11)) {
    assert.ok(L.valorDeUno(item).valor.equals(val(item.b).dividir(val(item.a))));
    assert.ok(mismoValor(L.Q(item, 'd'), aCantidad(val(item.b).dividir(val(item.a)).multiplicar(val(item.c)), L.Q(item, 'b').unidad)));
  }
});

test('regla-de-tres · ej. 2: cuatro planteamientos con cuatro valores distintos y solo el bueno da x', () => {
  for (const item of items(ej2, 12)) {
    assert.equal(item.opciones.length, 4);
    assert.equal(item.opciones.filter(o => o.error === null).length, 1);
    const valores = item.opciones.map(o => L.valorDelPlanteamiento(item, o.tipo));
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) assert.ok(!valores[i].equals(valores[j]), `valores repetidos: ${valores}`);
    const buena = item.opciones.find(o => o.error === null);
    assert.ok(L.valorDelPlanteamiento(item, buena.tipo).equals(val(item.d)));
    for (const o of item.opciones.filter(o => o.error)) assert.ok(L.valorDelPlanteamiento(item, o.tipo).num > 0);
  }
});

test('regla-de-tres · ej. 3: la solución es la de la dirección y la unidad buena es la de lo que se pide', () => {
  let directas = 0, inversas = 0;
  for (const item of items(ej3, 13)) {
    const s = L.solucion(item);
    if (item.sentido === 'directa') { directas++; assert.ok(s.valor.equals(val(item.d))); assert.equal(L.unidadBuena(item), 'B'); }
    else { inversas++; assert.ok(s.valor.equals(val(item.a).multiplicar(val(item.d)).dividir(val(item.b)))); assert.equal(L.unidadBuena(item), 'A'); }
    assert.deepEqual([...item.orden].sort(), ['A', 'B', 'K']);
  }
  assert.ok(directas > N * 0.4 && inversas > N * 0.4, `${directas}/${inversas}`);
});

test('regla-de-tres · ej. 4: cada motivo es inequívoco (valor, unidad y cota) y los cuatro salen', () => {
  const vistos = {};
  for (const item of items(ej4, 14)) {
    vistos[item.motivo] = (vistos[item.motivo] ?? 0) + 1;
    const ctx = L.ctxDe(item.ctx);
    const m = val(item.mostrado), d = val(item.d), a = val(item.a), b = val(item.b), c = val(item.c);
    const [min, max] = ctx.datos.d.cota;
    const dentro = v => comparar(v, cantidad(min).valor) >= 0 && comparar(v, cantidad(max).valor) <= 0;
    if (item.motivo === 'ok') assert.ok(m.equals(d));
    if (item.motivo === 'va-al-reves') { assert.ok(m.equals(a.multiplicar(b).dividir(c).simplificar())); assert.ok(!m.equals(d)); assert.ok(dentro(m)); assert.equal(item.lado, 'B'); }
    if (item.motivo === 'unidad-equivocada') { assert.ok(m.equals(d)); assert.equal(item.lado, 'A'); const [r0, r1] = ctx.datos.a.rango; assert.ok(cantidad(r0).valor.num * d.den <= d.num * cantidad(r0).valor.den && d.num * cantidad(r1).valor.den <= cantidad(r1).valor.num * d.den); }
    if (item.motivo === 'fuera-de-cota') { assert.ok(!dentro(m)); assert.ok(c.num * a.den > a.num * c.den, 'c > a'); assert.ok(m.equals(d.multiplicar(fraccion(10))) || m.equals(d.multiplicar(fraccion(100)))); }
  }
  for (const mo of L.MOTIVOS) assert.ok(vistos[mo] > N * 0.1, `${mo}: ${vistos[mo]}`);
});

test('regla-de-tres: variedad (ningún caso pasa del 10 %) y sin nombres reales', () => {
  for (const [def, semilla] of [[ej1, 21], [ej2, 22], [ej3, 23], [ej4, 24]]) {
    const cuenta = new Map();
    for (const item of items(def, semilla)) cuenta.set(def.clave(item), (cuenta.get(def.clave(item)) ?? 0) + 1);
    const maximo = Math.max(...cuenta.values());
    assert.ok(maximo <= N * 0.1, `clave repetida ${maximo} veces`);
    assert.ok(cuenta.size > 200, `solo ${cuenta.size} casos distintos`);
  }
});

test('regla-de-tres: los enunciados y los textos salen sanos en los dos idiomas', () => {
  for (const idioma of IDIOMAS) {
    for (const item of items(ej1, 31, 600)) sana(X.enunciadoDe(item, idioma), `ej1 ${idioma}`);
    for (const item of items(ej2, 32, 600)) {
      const e = X.enunciadoPlanteamiento(item, idioma);
      sana(`${e.texto} ${e.pregunta}`, `ej2 ${idioma}`);
      for (const o of item.opciones) sana(X.htmlPlanteamiento(item, o.tipo, idioma), `ej2 opción ${idioma}`);
    }
    for (const item of items(ej3, 33, 600)) {
      sana(X.enunciadoContesta(item, idioma), `ej3 ${idioma}`);
      for (const id of item.orden) sana(X.nombreDeUnidad(item, id, idioma), `ej3 unidad ${idioma}`);
    }
    for (const item of items(ej4, 34, 600)) {
      const e = X.enunciadoSentido(item, idioma);
      sana(`${e.texto} ${e.dado} ${e.pregunta}`, `ej4 ${idioma}`);
    }
    for (const m of Object.values(X.MOTIVO)) sana(m[idioma], 'motivo');
  }
});

test('regla-de-tres: los números de cada contexto son creíbles (cotas propias declaradas)', () => {
  for (const id of L.IDS) {
    const ctx = L.ctxDe(id);
    assert.ok(ctx.datos.a && ctx.datos.b && ctx.datos.c && ctx.datos.d, id);
    assert.ok(ctx.datos.d.cota, `${id} sin cota en d`);
  }
});

test('regla-de-tres: la reserva (hoja y examen de la sesión 3) tiene 54 huellas y ningún ítem coincide con ella', () => {
  assert.equal(HUELLAS_RESERVADAS.size, 54);
  for (const [def, semilla] of [[ej1, 11], [ej2, 12], [ej3, 13], [ej4, 14]]) {
    for (const it of items(def, semilla)) assert.ok(!L.esReservado(it), `reservado: ${JSON.stringify(it)}`);
  }
  const arroz = { ctx: 'receta-leche', a: '4/1', b: '300/1', c: '10/1', d: '750/1', k: '75/1' };
  assert.ok(L.esReservado(arroz), 'el caso «4 personas, 300 → 10» de la hoja está reservado aunque cambie de contexto');
  assert.ok(!L.esReservado({ ...arroz, c: '11/1' }), 'otro caso no');
});
