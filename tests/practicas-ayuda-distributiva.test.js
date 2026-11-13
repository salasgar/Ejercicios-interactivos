// «No lo sé» en `distributiva` (tarea 188): la explicación lleva la solución del ítem, calculada con la lógica.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/distributiva/logica.js';
import * as X from '../practicas/distributiva/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/ ([.;,:])/g, '$1');
const F = (n, idioma) => L.fmt(n, idioma).replace(/\s/g, ' ');
const RESP = { es: 'La respuesta es', en: 'The answer is' };
const generar = (fn, semilla, n = 1500) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };

test('distributiva · ejercicio 1: la explicación lleva el total y la igualdad', () => {
  const vistos = { suma: 0, resta: 0 };
  for (const idioma of IDIOMAS) for (const item of generar(L.generarPartir, 1)) {
    vistos[item.resta ? 'resta' : 'suma']++;
    const t = plano(X.explicaPartir(item, ctx(idioma)));
    assert.ok(L.totalCorrecto(item, String(item.solucion)));
    assert.ok(t.endsWith(`${RESP[idioma]} ${F(item.solucion, idioma)}.`), t);
    assert.ok(t.includes(L.igualdad(item)), t);
    assert.ok(t.includes(`tras la celda ${item.corte}`) || t.includes(`after cell ${item.corte}`), t);
    assert.ok(!/undefined|NaN/.test(t), t);
  }
  assert.ok(vistos.suma > 0 && vistos.resta > 0);
});

test('distributiva · ejercicio 2: la explicación lleva el producto con paréntesis que da por bueno el ejercicio', () => {
  const vistos = { juntar: 0, factor: 0 };
  for (const idioma of IDIOMAS) for (const item of generar(L.generarFactorValido, 2)) {
    vistos[item.tipo]++;
    const t = plano(X.explicaFactor(item, ctx(idioma)));
    const buena = `${item.a} · (${item.b} ${item.resta ? '−' : '+'} ${item.c})`;
    if (item.tipo === 'juntar') assert.ok(L.juntarCorrecto(item, ['a', '·', '(', 'b', item.resta ? '−' : '+', 'c', ')']));
    else assert.equal(item.opciones.find(o => o.correcta).expr, buena);
    assert.ok(t.endsWith(`${RESP[idioma]} ${buena}.`), t);
    assert.ok(t.includes(`= ${item.valor}`), t);
    assert.ok(!/undefined|NaN/.test(t), t);
  }
  assert.ok(vistos.juntar > 0 && vistos.factor > 0);
});

test('distributiva · ejercicio 3: la explicación lleva el resultado y la escritura correcta', () => {
  const vistos = { producto: 0, suma: 0 };
  for (const idioma of IDIOMAS) for (const item of generar(L.generarCompensar, 3)) {
    vistos[item.tipo]++;
    const t = plano(X.explicaCompensar(item, ctx(idioma)));
    assert.ok(L.compensarCorrecto(item, String(item.valor)));
    assert.ok(t.endsWith(`${RESP[idioma]} ${F(item.valor, idioma)}.`), t);
    assert.ok(t.includes(`= ${F(item.valor, idioma)}`), t);
    const buena = item.opciones.find(o => o.correcta).expr;
    assert.ok(t.includes(buena.replace(/ /g, ' ').replace(/\s+/g, ' ')), `${buena} / ${t}`);
    assert.ok(!/undefined|NaN/.test(t), t);
  }
  assert.ok(vistos.producto > 0 && vistos.suma > 0);
});
