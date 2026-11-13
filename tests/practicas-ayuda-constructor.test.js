// «No lo sé» en `constructor` (tarea 188): la explicación lleva la solución del ítem, calculada con la lógica.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/constructor/logica.js';
import * as X from '../practicas/constructor/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/ ([.;,:])/g, '$1');
const F = (n, idioma) => L.fmt(n, idioma).replace(/\s/g, ' ');
const generar = (fn, semilla, n = 1500) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };

test('constructor · ejercicio 1: la explicación lleva el número que da por bueno el ejercicio', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarConstruir, 1)) {
    const t = plano(X.explicaConstruir(item, ctx(idioma)));
    assert.equal(L.solucionDe(item.cifras, item.consigna, item.objetivo), item.solucion);
    assert.ok(t.includes(`${idioma === 'es' ? 'La respuesta es' : 'The answer is'} ${F(item.solucion, idioma)}`), t);
    assert.ok(!/undefined|NaN/.test(t), t);
  }
});

test('constructor · ejercicio 2: cada tipo de ítem lleva su solución', () => {
  const vistos = {};
  for (const idioma of IDIOMAS) for (const item of generar(L.generarDescomposicion, 2, 2400)) {
    vistos[item.tipo] = (vistos[item.tipo] ?? 0) + 1;
    const t = plano(X.explicaDescomposicion(item, ctx(idioma)));
    assert.ok(!/undefined|NaN/.test(t), t);
    if (item.tipo === 'a_suma') assert.ok(t.includes(`${F(item.n, idioma)} = ${item.correctas.map(v => F(v, idioma)).join(' + ')}`), t);
    else if (item.tipo === 'a_numero') assert.ok(t.includes(`${item.sumandos.map(v => F(v, idioma)).join(' + ')} = ${F(item.n, idioma)}`), t);
    else if (item.tipo === 'valor') assert.ok(t.includes(`= ${F(item.correcto, idioma)}`), t);
    else assert.ok(t.includes(` ${item.cifra} `) && t.includes(L.fmt(item.n, idioma).replace(/\s/g, ' ')), t);
  }
  assert.deepEqual(Object.keys(vistos).sort(), ['a_numero', 'a_suma', 'posicion', 'valor']);
});

test('constructor · ejercicio 3: comas y palabras llevan la solución', () => {
  const vistos = {};
  for (const idioma of IDIOMAS) for (const item of generar(L.generarComaPalabras, 3, 2400)) {
    vistos[item.tipo] = (vistos[item.tipo] ?? 0) + 1;
    const t = plano(X.explicaComaPalabras(item, ctx(idioma)));
    assert.ok(!/undefined|NaN/.test(t), t);
    if (item.tipo === 'coma') assert.ok(t.includes(item.correcto.replace(/\s/g, ' ')), t);   // «776 304» lleva espacio fino: se normaliza como en plano()
    else assert.ok(t.includes(F(item.n, idioma)), t);
  }
  assert.deepEqual(Object.keys(vistos).sort(), ['coma', 'palabras']);
});
