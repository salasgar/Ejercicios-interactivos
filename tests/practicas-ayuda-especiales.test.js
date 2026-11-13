// «No lo sé» en `especiales` (tarea 189): la explicación lleva la solución del ítem, calculada con la lógica.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/especiales/logica.js';
import * as X from '../practicas/especiales/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const generar = (fn, semilla, n = 1500) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };

test('especiales · ejercicio 1: la explicación dice verdadero o falso según la lógica', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarVF, 1)) {
    const t = plano(X.explicaVF(item, ctx(idioma)));
    const { verdad } = L.evaluar(item.id, item.vars);
    assert.equal(verdad, item.verdad);
    const esperado = idioma === 'es' ? (verdad ? 'La respuesta es verdadero.' : 'La respuesta es falso.') : (verdad ? 'The answer is true.' : 'The answer is false.');
    assert.ok(t.includes(esperado), t);
    assert.ok(!/undefined|NaN/.test(t), t);
  }
});

test('especiales · ejercicio 2: la explicación señala la igualdad falsa', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarFalsa, 2)) {
    const t = plano(X.explicaFalsa(item, ctx(idioma)));
    const falsa = item.items[item.solucion];
    assert.equal(L.evaluar(falsa.id, falsa.vars).verdad, false);
    assert.ok(t.includes(plano(X.renderPlantilla(falsa.id, falsa.vars))), t);
    assert.ok(!/undefined|NaN/.test(t), t);
  }
});
