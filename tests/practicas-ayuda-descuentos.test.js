// «No lo sé» de «Descuentos y aumentos» (PU2 tarea 221): la explicación de cada ítem contiene la solución
// calculada con la lógica de la práctica, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  generarDosPasos, generarUnPaso, generarIva, generarQuePiden, generarCaza, dinero, cambioDe, finalDe, multiplicadorDe, multiplicadorTxt,
} from '../practicas/descuentos/logica.js';
import { explicaDosPasos, explicaUnPaso, explicaIva, explicaQuePiden, explicaCaza, NO_SE_HACERLO } from '../practicas/descuentos/textos.js';

const N = 1000;
const IDIOMAS = ['es', 'en'];
const texto = h => h.replace(/<[^>]+>/g, '').replace(/ /g, ' ');
const lote = (generar, semilla) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => generar(rng)); };

test('ej. 1: descuento y precio final con las cuentas', () => {
  for (const it of lote(generarDosPasos, 41)) for (const i of IDIOMAS) {
    const x = texto(explicaDosPasos(it, { idioma: i })), D = v => dinero(v, i), cambio = cambioDe(it.P, it.p), final = finalDe(it.P, it.p, it.tipo);
    assert.ok(x.includes(`${it.p} ÷ 100 · ${D(it.P)} = ${D(cambio)}`), x);
    assert.ok(x.includes(`${D(it.P)} ${it.tipo === 'descuento' ? '−' : '+'} ${D(cambio)} = ${D(final)}`), x);
    assert.ok(x.includes(i === 'es' ? 'La respuesta es' : 'The answer is') && x.includes(D(final)), x);
    assert.ok(!/undefined|null|×/.test(x));
  }
});

test('ej. 2: el multiplicador y, si hay precio, el precio final', () => {
  for (const it of lote(generarUnPaso, 42)) for (const i of IDIOMAS) {
    const h = explicaUnPaso(it, { idioma: i }), x = texto(h), M = multiplicadorTxt(multiplicadorDe(it.p, it.tipo), i);
    assert.ok(x.includes(M), x);
    assert.ok(h.includes('<ol class="pasos-ayuda">') && h.includes('<span class="cuenta">'));
    if (it.modo === 'calcular') assert.ok(x.includes(dinero(finalDe(it.P, it.p, it.tipo), i)), x);
    assert.ok(x.includes(i === 'es' ? 'La respuesta es' : 'The answer is'), x);
  }
});

test('ej. 3: IVA y precio con IVA', () => {
  for (const it of lote(generarIva, 43)) for (const i of IDIOMAS) {
    const x = texto(explicaIva(it, { idioma: i })), D = v => dinero(v, i), iva = cambioDe(it.P, it.r);
    assert.ok(x.includes(`${it.r} ÷ 100 · ${D(it.P)} = ${D(iva)}`) && x.includes(`${D(it.P)} + ${D(iva)} = ${D(it.P + iva)}`), x);
  }
});

test('ej. 4: da la respuesta que piden', () => {
  for (const it of lote(generarQuePiden, 44)) for (const i of IDIOMAS) {
    const x = texto(explicaQuePiden(it, { idioma: i })), v = it.ops.find(o => o.correcta).valor;
    assert.ok(x.includes(`${i === 'es' ? 'La respuesta es' : 'The answer is'} ${dinero(v, i)}`), x);
  }
});

test('ej. 5: los dos pasos y cuánto cambia', () => {
  for (const it of lote(generarCaza, 45)) for (const i of IDIOMAS) {
    const x = texto(explicaCaza(it, { idioma: i })), D = v => dinero(v, i);
    assert.ok(x.includes(D(it.medio)) && x.includes(D(it.final)), x);
    assert.ok(x.includes(`${it.p} %`.replace(' ', i === 'es' ? ' ' : '').replace(/%$/, '%')) || x.includes(`${it.p}%`), x);
    assert.ok(x.includes(D(Math.abs(it.P - it.final))), x);
  }
});

test('«No sé hacerlo» en los dos idiomas', () => {
  assert.equal(NO_SE_HACERLO.es, 'No sé hacerlo');
  assert.ok(NO_SE_HACERLO.en.startsWith('I don'));
});
