// «No lo sé» en `errores1` (tarea 189): la explicación lleva la solución del ítem, calculada con la lógica.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/errores1/logica.js';
import * as X from '../practicas/errores1/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const generar = (fn, semilla, n = 1000) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };
const RESP = { es: 'La respuesta es', en: 'The answer is' };

test('errores1 · ejercicio 1: la explicación dice si hay error o no', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarHay, 1)) {
    const t = plano(X.explicaHay(item, ctx(idioma)));
    assert.equal(item.solucion, item.error ? 'error' : 'bien');
    assert.ok(t.includes(`${RESP[idioma]}: ${item.error ? X.TX.error[idioma] : X.TX.bien[idioma]}.`), t);
    assert.ok(!/undefined|NaN/.test(t), t);
  }
});

test('errores1 · ejercicio 2: la explicación señala la línea del error', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarLinea, 2)) {
    const t = plano(X.explicaLinea(item, ctx(idioma)));
    assert.equal(item.solucion, item.error.linea);
    assert.ok(t.includes(`${RESP[idioma]}: ${X.TX.linea[idioma]} ${item.error.linea + 1}.`), t);
    assert.ok(t.includes(plano(X.html(item.lineas[item.error.linea][idioma]))), t);
    assert.ok(!/undefined|NaN/.test(t), t);
  }
});

test('errores1 · ejercicio 3: la explicación da el nombre del error', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarNombre, 3)) {
    const t = plano(X.explicaNombre(item, ctx(idioma)));
    assert.equal(item.solucion, item.error.nombre);
    assert.ok(t.includes(`${RESP[idioma]}: ${X.NOMBRES[item.error.nombre][idioma]}`), t);
    assert.ok(!t.includes('..'), t);
    assert.ok(!/undefined|NaN/.test(t), t);
  }
});

test('errores1 · ejercicio 4: la explicación dice si falta un paso', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarPasos, 4)) {
    const t = plano(X.explicaPasos(item, ctx(idioma)));
    assert.equal(item.solucion, item.salta ? 'si' : 'no');
    assert.ok(t.includes(`${RESP[idioma]}: ${(item.salta ? X.TX.si : X.TX.no)[idioma]}.`), t);
    assert.ok(!/undefined|NaN/.test(t), t);
  }
});
