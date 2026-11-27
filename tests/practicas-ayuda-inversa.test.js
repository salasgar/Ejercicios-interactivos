// «No lo sé» de «Proporcionalidad inversa» (PU2 tarea 215): la explicación de cada ítem contiene la solución
// calculada con la lógica de la práctica, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { generarEsInversa, generarCompleta, generarProblema, generarCaza, CONTEXTOS } from '../practicas/inversa/logica.js';
import { explicaEsInversa, explicaCompleta, explicaProblema, explicaCaza, fv } from '../practicas/inversa/textos.js';

const N = 1000;
const IDIOMAS = ['es', 'en'];
const texto = h => h.replace(/<[^>]+>/g, '').replace(/ /g, ' ');
const lote = (generar, semilla) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => generar(rng)); };

test('ej. 1: la explicación dice la respuesta y todos los productos', () => {
  for (const it of lote(generarEsInversa, 21)) for (const idioma of IDIOMAS) {
    const x = texto(explicaEsInversa(it, { idioma }));
    assert.ok(x.includes(it.si ? (idioma === 'es' ? 'La respuesta es: sí' : 'The answer is: yes') : (idioma === 'es' ? 'La respuesta es: no' : 'The answer is: no')), x);
    for (const col of it.cols) assert.ok(x.includes(`${col.x} · ${col.y} = ${col.x * col.y}`), x);
  }
});

test('ej. 2: la explicación trae el producto y los dos huecos con su unidad', () => {
  for (const it of lote(generarCompleta, 22)) for (const idioma of IDIOMAS) {
    const x = texto(explicaCompleta(it, { idioma }));
    const m = CONTEXTOS[it.ctx].din ? 100 : 1, ref = it.cols[it.ref];
    assert.ok(x.includes(`${ref.x} · ${fv(it.ctx, ref.y, idioma)} = ${fv(it.ctx, it.P * m, idioma)}`), x);
    for (const h of it.huecos) {
      const col = it.cols[h.col];
      assert.ok(x.includes(h.que === 'x' ? ` = ${col.x}` : ` = ${fv(it.ctx, col.y, idioma)}`), x);
    }
    assert.ok(x.includes(idioma === 'es' ? 'La respuesta es' : 'The answer is'));
  }
});

test('ej. 3: la explicación termina en la solución', () => {
  for (const it of lote(generarProblema, 23)) for (const idioma of IDIOMAS) {
    const x = texto(explicaProblema(it, { idioma }));
    const m = CONTEXTOS[it.ctx].din ? 100 : 1, r = (it.P * m) / it.c;
    assert.ok(x.includes(`${fv(it.ctx, it.P * m, idioma)} : ${it.c} = ${fv(it.ctx, r, idioma)}`), x);
    assert.ok(x.includes(idioma === 'es' ? 'La respuesta es' : 'The answer is'));
  }
});

test('ej. 4: la explicación dice si está bien o mal y da la cuenta correcta', () => {
  for (const it of lote(generarCaza, 24)) for (const idioma of IDIOMAS) {
    const x = texto(explicaCaza(it, { idioma }));
    const bien = idioma === 'es' ? 'Está bien' : 'It is right', mal = idioma === 'es' ? 'Está mal' : 'It is wrong';
    assert.ok(x.startsWith(it.tipo.startsWith('bien') ? bien : mal), x);
    assert.ok(x.includes(` = ${fv(it.ctx, it.bien, idioma)}`), x);
  }
});
