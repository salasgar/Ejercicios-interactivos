// «No lo sé» en parentesis-algebra (tarea 176): cada explicación lleva la solución que el ejercicio da por buena.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import * as L from '../practicas/parentesis-algebra/logica.js';
import * as A from '../practicas/parentesis-algebra/ayuda.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const items = (fn, semilla, n = 1000) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };
const sinRestos = (html, donde) => {
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, donde);
  assert.ok(html.length > 40, donde);
};
const lleva = (html, trozo, donde) => assert.ok(html.includes(trozo), `${donde}: falta «${trozo}» en «${html.replace(/<[^>]+>/g, '')}»`);

test('parentesis-algebra ej. 1: la explicación lleva el desarrollo correcto', () => {
  for (const idioma of IDIOMAS) {
    for (const item of items(L.generarQuita, 1)) {
      const html = A.explicaQuita(item, ctx(idioma));
      sinRestos(html, 'ej1');
      lleva(html, `${idioma === 'es' ? 'La respuesta es' : 'The answer is'} <span class="cuenta">${item.htmlCorrecta}</span>.`, 'ej1');
    }
  }
});

test('parentesis-algebra ej. 2: la explicación lleva la opción correcta', () => {
  for (const idioma of IDIOMAS) {
    for (const item of items(L.generarDesarrollo, 2)) {
      const html = A.explicaDesarrollo(item, ctx(idioma));
      sinRestos(html, 'ej2');
      assert.equal(item.opciones.filter(o => o.correcta).length, 1);
      lleva(html, `<span class="cuenta">${item.opciones.find(o => o.correcta).html}</span>.`, 'ej2');
    }
  }
});

test('parentesis-algebra ej. 3: la explicación lleva la solución de la ecuación', () => {
  for (const idioma of IDIOMAS) {
    for (const item of items(L.generarResuelve, 3)) {
      const html = A.explicaResuelve(item, ctx(idioma));
      sinRestos(html, 'ej3');
      lleva(html, `= ${item.solucion}</span>.`, 'ej3');
      lleva(html, item.explicacion[idioma], 'ej3 pasos');
    }
  }
});

test('parentesis-algebra ej. 4: dice si hay error y de qué tipo', () => {
  for (const idioma of IDIOMAS) {
    for (const item of items(L.generarErrores, 4)) {
      const html = A.explicaErrores(item, ctx(idioma));
      sinRestos(html, 'ej4');
      lleva(html, item.solucion[idioma], 'ej4 solución');
      lleva(html, idioma === 'es' ? 'La respuesta es' : 'The answer is', 'ej4');
    }
  }
});
