// «No lo sé» en resuelve (tarea 176): cada explicación lleva la solución que el ejercicio da por buena.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import * as L from '../practicas/resuelve/logica.js';
import { aTexto as textoFraccion, fraccion } from '../practicas/_comun/fracciones.js';
import * as A from '../practicas/resuelve/ayuda.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const items = (fn, semilla, n = 1000) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };
const sinRestos = (html, donde) => assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, donde);
const lleva = (html, trozo, donde) => assert.ok(html.includes(trozo), `${donde}: falta «${trozo}» en «${html.replace(/<[^>]+>/g, '')}»`);

test('resuelve ej. 1: la explicación lleva la línea buena', () => {
  for (const idioma of IDIOMAS) {
    for (const item of items(L.generarPrimerPaso, 1)) {
      const html = A.explicaPrimerPaso(item, ctx(idioma));
      sinRestos(html, 'ej1');
      lleva(html, A.cuenta(A.htmlDatos(item.opciones[item.buena])), 'ej1');
    }
  }
});

test('resuelve ej. 2: la explicación lleva el número de la x, el del segundo miembro y la solución', () => {
  for (const idioma of IDIOMAS) {
    for (const item of items(L.generarPasoAPaso, 2)) {
      const html = A.explicaPasoAPaso(item, ctx(idioma));
      sinRestos(html, 'ej2');
      lleva(html, `= ${textoFraccion(fraccion(item.A, 1))}</span>`, 'ej2 A');
      lleva(html, A.cuenta(A.htmlSol(L.solDe(item))), 'ej2 solución');
      assert.equal(L.ecDe(item).resolver().equals(L.solDe(item)), true);
    }
  }
});

test('resuelve ej. 3: la explicación lleva la solución de la ecuación y su comprobación', () => {
  for (const idioma of IDIOMAS) {
    for (const item of items(L.generarResuelve, 3)) {
      const html = A.explicaResuelve(item, ctx(idioma));
      sinRestos(html, 'ej3');
      const s = L.solucionDe(L.ecDe(item));
      assert.ok(s.equals(L.solDe(item)));
      lleva(html, A.cuenta(A.htmlSol(s)), 'ej3 solución');
      lleva(html, '✓', 'ej3 comprobación');
    }
  }
});

test('resuelve ej. 4: dice dónde está el error (o que no hay) y cómo queda bien hecho', () => {
  for (const idioma of IDIOMAS) {
    for (const item of items(L.generarResolucion, 4)) {
      const html = A.explicaResolucion(item, ctx(idioma));
      sinRestos(html, 'ej4');
      if (item.malo === 0) lleva(html, idioma === 'es' ? 'todo está bien' : 'all correct', 'ej4 todo bien');
      else {
        lleva(html, idioma === 'es' ? `paso ${item.malo}.` : `step ${item.malo}.`, 'ej4 paso');
        lleva(html, A.cuenta(A.htmlDatos(item.correcta)), 'ej4 correcta');
      }
    }
  }
});
