// «No lo sé» en denominadores (tarea 176): cada explicación lleva la solución que el ejercicio da por buena.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import * as L from '../practicas/denominadores/logica.js';
import * as A from '../practicas/denominadores/ayuda.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const items = (fn, semilla, n = 1000) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };
const sinRestos = (html, donde) => {
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, donde);
  assert.ok(html.length > 40, donde);
};
const lleva = (html, trozo, donde) => assert.ok(html.includes(trozo), `${donde}: falta «${trozo}» en «${html.replace(/<[^>]+>/g, '')}»`);
const resp = idioma => (idioma === 'es' ? 'La respuesta es' : 'The answer is');

test('denominadores ej. 1: la explicación termina con el m.c.m. del ítem', () => {
  for (const idioma of IDIOMAS) {
    for (const item of items(L.generarMcm, 1)) {
      const html = A.explicaMcm(item, ctx(idioma));
      sinRestos(html, 'ej1');
      assert.equal(item.opciones.find(o => o.correcta).valor, String(item.mcm));
      lleva(html, `${resp(idioma)} <span class="cuenta">${item.mcm}</span>.`, 'ej1');
    }
  }
});

test('denominadores ej. 2: la explicación lleva la ecuación correcta', () => {
  for (const idioma of IDIOMAS) {
    for (const item of items(L.generarSin, 2)) {
      const html = A.explicaSin(item, ctx(idioma));
      sinRestos(html, 'ej2');
      // Con un solo denominador no se habla de «el m.c.m. de 7» (revisión 191).
      assert.doesNotMatch(html, /m\.c\.m\. de (\d+) es \1\b|LCM of (\d+) is \2\b/, `ej2: ${html}`);
      lleva(html, `${resp(idioma)} <span class="cuenta">${item.opciones.find(o => o.correcta).html}</span>.`, 'ej2');
    }
  }
});

test('denominadores ej. 3: la explicación lleva la solución de la ecuación', () => {
  for (const idioma of IDIOMAS) {
    for (const item of items(L.generarResuelve, 3)) {
      const html = A.explicaResuelve(item, ctx(idioma));
      sinRestos(html, 'ej3');
      lleva(html, `= ${item.solucion}</span>.`, 'ej3');
      lleva(html, item.explicacion[idioma], 'ej3 pasos');
    }
  }
});

test('denominadores ej. 4: la explicación lleva el m.c.m., la ecuación sin denominadores y la solución', () => {
  for (const idioma of IDIOMAS) {
    for (const item of items(L.generarPasos, 4)) {
      const html = A.explicaPasos(item, ctx(idioma));
      sinRestos(html, 'ej4');
      lleva(html, `<span class="cuenta">${item.mcm}</span>`, 'ej4 mcm');
      lleva(html, `<span class="cuenta">${item.cerrada}</span>`, 'ej4 cerrada');
      lleva(html, `<span class="cuenta"><i>x</i> = ${item.solucion}</span>.`, 'ej4 solución');
    }
  }
});
