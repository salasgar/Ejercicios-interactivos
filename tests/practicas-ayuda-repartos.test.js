// «No lo sé» de «Repartos proporcionales» (PU2 tarea 217): la explicación de cada ítem contiene la solución
// calculada con la lógica de la práctica, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { generarCuenta, generarReparte, generarEstaBien, generarCaza } from '../practicas/repartos/logica.js';
import { fv, explicaCuenta, explicaReparte, explicaEstaBien, explicaCaza, NO_SE_HACERLO } from '../practicas/repartos/textos.js';

const N = 1000;
const IDIOMAS = ['es', 'en'];
const texto = h => h.replace(/<[^>]+>/g, '').replace(/ /g, ' ');
const lote = (generar, semilla) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => generar(rng)); };

test('ej. 1: partes en total y lo que vale una parte', () => {
  for (const it of lote(generarCuenta, 31)) for (const idioma of IDIOMAS) {
    const x = texto(explicaCuenta(it, { idioma })), S = it.a + it.b;
    assert.ok(x.includes(`${it.a} + ${it.b} = ${S}`), x);
    assert.ok(x.includes(`${fv(it.ctx, it.T, idioma)} : ${S} = ${fv(it.ctx, it.u, idioma)}`), x);
    assert.ok(x.includes(idioma === 'es' ? `hay ${S} partes` : `there are ${S} parts`), x);
  }
});

test('ej. 2: las dos partes y la comprobación', () => {
  for (const it of lote(generarReparte, 32)) for (const idioma of IDIOMAS) {
    const x = texto(explicaReparte(it, { idioma })), F = v => fv(it.ctx, v, idioma);
    assert.ok(x.includes(`${it.a} · ${F(it.u)} = ${F(it.a * it.u)}`), x);
    assert.ok(x.includes(`${it.b} · ${F(it.u)} = ${F(it.b * it.u)}`), x);
    assert.ok(x.includes(`${F(it.a * it.u)} + ${F(it.b * it.u)} = ${F(it.T)}`), x);
  }
});

test('ej. 3: dice lo que falla y trae el reparto bien hecho', () => {
  for (const it of lote(generarEstaBien, 33)) for (const idioma of IDIOMAS) {
    const x = texto(explicaEstaBien(it, { idioma })), F = v => fv(it.ctx, v, idioma);
    if (it.tipo === 'bien') assert.ok(x.includes(idioma === 'es' ? 'Sí está bien' : 'Yes, it is shared correctly'), x);
    else {
      assert.ok(x.includes(`${F(it.a * it.u)}`) && x.includes(`${F(it.b * it.u)}`), x);
      assert.ok(x.includes(idioma === 'es' ? 'Está mal' : 'It is wrong'), x);
    }
    if (it.tipo === 'no-suman') assert.ok(x.includes(`${F(it.dado[0])} + ${F(it.dado[1])} = ${F(it.dado[0] + it.dado[1])}`), x);
  }
});

test('ej. 4: dice qué línea está mal y trae el reparto bien hecho con su comprobación', () => {
  const ord = { es: ['primera', 'segunda', 'tercera'], en: ['first', 'second', 'third'] };
  for (const it of lote(generarCaza, 34)) for (const idioma of IDIOMAS) {
    const x = texto(explicaCaza(it, { idioma })), F = v => fv(it.ctx, v, idioma);
    assert.ok(x.includes(idioma === 'es' ? `El error está en la ${ord.es[it.mala]} línea` : `The mistake is in the ${ord.en[it.mala]} line`), x);
    assert.ok(x.includes(idioma === 'es' ? 'Lo correcto es:' : 'The right way is:'), x);
    assert.ok(x.includes(`${F(it.T)} : ${it.a + it.b} = ${F(it.u)}`), x);
    assert.ok(x.includes(`${F(it.a * it.u)} + ${F(it.b * it.u)} = ${F(it.T)}`), x);
    assert.ok(!/línea \d|line \d/.test(x), x);
  }
});

test('«No sé hacerlo» en los dos idiomas', () => {
  assert.equal(NO_SE_HACERLO.es, 'No sé hacerlo');
  assert.ok(NO_SE_HACERLO.en.startsWith('I don'));
});
