// «No lo sé» en `mental` (tarea 189): la explicación lleva la solución del ítem, calculada con la lógica.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/mental/logica.js';
import * as X from '../practicas/mental/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const generar = (fn, semilla, n = 1500) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };
const RESP = { es: 'La respuesta es', en: 'The answer is' };

test('mental · ejercicio 1: la explicación lleva el resultado que da por bueno el ejercicio', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarCompensar, 1)) {
    const t = plano(X.explicaCompensar(item, ctx(idioma)));
    const esperado = item.variante === 'producto' ? item.n * item.k : item.n + item.k;
    assert.ok(L.resultadoCorrecto(item, esperado));
    assert.ok(t.includes(`${RESP[idioma]} ${esperado}.`), t);
    assert.ok(t.includes(`= ${esperado}`), t);
    assert.ok(!/undefined|NaN/.test(t), t);
  }
});

test('mental · ejercicio 2: la explicación lleva el resultado y una descomposición que reconstruye el factor', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarDescomponer, 2)) {
    const t = plano(X.explicaDescomponer(item, ctx(idioma)));
    const op = item.opciones.find(o => o.correcta && o.clase === 'producto');
    assert.ok(L.reconstruye(item, op));
    assert.ok(L.descomposicionCorrecta(item, item.opciones.indexOf(op), item.a * item.b));
    assert.ok(t.includes(`${RESP[idioma]} ${item.a * item.b}.`), t);
    assert.ok(t.includes(`${item.a} · ${item.b} = ${item.a} · ${op.x} · ${op.y}`), t);
    assert.ok(!/undefined|NaN/.test(t), t);
  }
});
