// «No lo sé» en `criba` (tarea 184): la explicación lleva la solución que el ejercicio da por buena,
// calculada con la lógica de la práctica. El ejercicio 1 va por pasos (sinAyuda).

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import * as L from '../practicas/criba/logica.js';
import * as X from '../practicas/criba/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
const generar = (fn, semilla, n = 1200) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };
const NOMBRE = { primo: { es: 'Primo', en: 'Prime' }, compuesto: { es: 'Compuesto', en: 'Composite' }, ninguno: { es: 'Ni primo ni compuesto', en: 'Neither prime nor composite' } };

test('criba · ejercicio 2: la explicación lleva la clase que el ejercicio da por buena', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarFlashcard, 1)) {
      const html = plano(X.explicaFlashcard(item, ctx(idioma)));
      const clase = L.claseDe(item.n);
      assert.ok(html.includes(`${NOMBRE[clase][idioma]}.`), `${item.n}: ${html}`);
      assert.ok(/(respuesta es|answer is)/.test(html));
      if (clase === 'compuesto') assert.match(html, new RegExp(`${item.n} = \\d+ · \\d+`));
    }
  }
});

test('criba · ejercicio 3: la explicación lleva la lista buena y, en los compuestos, su divisor', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarRaiz, 2)) {
      const html = plano(X.explicaRaiz(item, ctx(idioma)));
      const buena = item.opciones.find(o => o.correcta).lista.join(', ');
      assert.equal(buena, L.listaHastaRaiz(item.n).join(', '));
      assert.ok(html.endsWith(`${buena} .`) || html.endsWith(`${buena}.`), `${item.n}: ${html}`);
      if (item.compuesto) assert.match(html, new RegExp(`${item.n} = \\d+ · \\d+`));
    }
  }
});
