// «No lo sé» en parentesis-algebra (tarea 176): cada explicación lleva la solución que el ejercicio da por buena.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import * as L from '../practicas/parentesis-algebra/logica.js';
import * as A from '../practicas/parentesis-algebra/ayuda.js';
import { TX } from '../practicas/parentesis-algebra/textos.js';
import { fraccion, htmlFraccion } from '../practicas/_comun/fracciones.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const items = (fn, semilla, n = 1000) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };
const sinRestos = (html, donde) => {
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, donde);
  assert.ok(html.length > 40, donde);
};
const lleva = (html, trozo, donde) => assert.ok(html.includes(trozo), `${donde}: falta «${trozo}» en «${html.replace(/<[^>]+>/g, '')}»`);
const plano = html => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');

/** El valor de «(−2) · 4 + (−2) · 4x» con x = v (solo para comprobar las cuentas del test). */
const valor = (texto, v) => Function(`return ${texto.replace(/−/g, '-').replace(/·/g, '*').replace(/(\d)x/g, '$1*x').replace(/x/g, `(${v})`)}`)();

/** Revisión 191: «productos = desarrollo» tiene que ser verdad (el feedback ponía a la derecha también lo de delante). */
function igualdadCierta(html, donde) {
  const m = plano(html).match(/(?:paréntesis|brackets): ([^=;]+) = ([^;.]+)[;.]/);
  if (!m) return;
  for (const v of [7, -3]) assert.equal(valor(m[1], v), valor(m[2], v), `${donde}: «${m[1]} = ${m[2]}» no es cierto — ${plano(html)}`);
}

test('parentesis-algebra ej. 1: la explicación lleva el desarrollo correcto', () => {
  for (const idioma of IDIOMAS) {
    for (const item of items(L.generarQuita, 1)) {
      const html = A.explicaQuita(item, ctx(idioma));
      sinRestos(html, 'ej1');
      igualdadCierta(html, 'ej1');
      lleva(html, `${idioma === 'es' ? 'La respuesta es' : 'The answer is'} <span class="cuenta">${item.htmlCorrecta}</span>.`, 'ej1');
    }
  }
});

test('parentesis-algebra ej. 2: la explicación lleva la opción correcta', () => {
  for (const idioma of IDIOMAS) {
    for (const item of items(L.generarDesarrollo, 2)) {
      const html = A.explicaDesarrollo(item, ctx(idioma));
      sinRestos(html, 'ej2');
      igualdadCierta(html, 'ej2');
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
      // La solución al final, con raya si es fracción (revisión 191), y los pasos sin el «La solución es …» repetido.
      const [n, d] = item.solucion.split('/');
      const sol = d ? htmlFraccion(fraccion(Number(n.replace('−', '-')), Number(d))) : item.solucion;
      lleva(html, `= ${sol}</span>.`, 'ej3');
      assert.doesNotMatch(plano(html), /\d\/\d|La solución es|The solution is/, `ej3 — ${plano(html)}`);
      lleva(html, item.explicacion[idioma].replace(/ (La solución es|The solution is) <strong>[^<]*<\/strong>\.$/, ''), 'ej3 pasos');
    }
  }
});

test('parentesis-algebra ej. 4: dice si hay error y de qué tipo', () => {
  for (const idioma of IDIOMAS) {
    for (const item of items(L.generarErrores, 4)) {
      const html = A.explicaErrores(item, ctx(idioma));
      sinRestos(html, 'ej4');
      igualdadCierta(html, 'ej4');
      if (item.correcta !== 'ninguno') lleva(html, item.solucion[idioma], 'ej4 solución');
      const nombre = TX.errores[item.correcta][idioma];
      lleva(html, idioma === 'es' ? `La respuesta es «${nombre}».` : `The answer is “${nombre}”.`, 'ej4');
    }
  }
});
