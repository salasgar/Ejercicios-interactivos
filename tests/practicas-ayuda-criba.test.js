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
      // Revisión 193: la opción, entre comillas (es el texto de un botón) y al final.
      const opcion = idioma === 'es' ? `«${NOMBRE[clase].es}».` : `“${NOMBRE[clase].en}”.`;
      assert.ok(html.endsWith(opcion), `${item.n}: ${html}`);
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
      if (!item.compuesto) assert.ok(html.endsWith(`${buena}.`), `${item.n}: ${html}`);
      else {
        // Los dos pasos del ítem: la lista y «¿Y es primo?» → no, con su divisor.
        const fin = idioma === 'es' ? `${buena}, y ${item.n} no es primo.` : `${buena}, and ${item.n} is not prime.`;
        assert.ok(html.endsWith(fin), `${item.n}: ${html}`);
        const m = html.match(new RegExp(`${item.n} = (\\d+) · (\\d+)`));
        assert.ok(m && Number(m[1]) * Number(m[2]) === item.n && Number(m[1]) > 1 && Number(m[2]) > 1, `${item.n}: ${html}`);
      }
      // Revisión 193: el límite con el mismo criterio que la regla (último primo al cuadrado ≤ n < siguiente al cuadrado).
      const u = L.listaHastaRaiz(item.n).at(-1);
      const { siguiente: s } = L.datosExplicacionRaiz(item.n);
      assert.ok(u * u <= item.n && s * s > item.n);
      assert.ok(html.includes(`${u} · ${u} = ${u * u}`) && html.includes(`${s} · ${s} = ${s * s}`), `${item.n}: ${html}`);
    }
  }
});

test('criba · revisión 193: sin letras en la regla, sin «<» sin escapar, una sola respuesta', () => {
  for (const idioma of IDIOMAS) {
    const htmls = [
      ...generar(L.generarFlashcard, 3).map(item => X.explicaFlashcard(item, ctx(idioma))),
      ...generar(L.generarRaiz, 4).map(item => X.explicaRaiz(item, ctx(idioma))),
    ];
    for (const html of htmls) {
      assert.doesNotMatch(plano(html), /\bp · p\b/, html);
      assert.doesNotMatch(html.replace(/<\/?[a-z][^>]*>/g, ''), /</, html);
      assert.equal((plano(html).match(/respuesta es|answer is/g) || []).length, 1, html);
    }
  }
});

test('criba · reabierta 14-11: el feedback del ejercicio 3 dice lo mismo que la tarjeta, sin «<» ni cadena de desigualdades', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarRaiz, 9, 1000)) {
      const html = X.limiteRaiz(item.n, ctx(idioma));
      assert.ok(!/<(?![a-z/])/i.test(html) && !html.includes('≤'), `${item.n}: ${html}`);
      assert.ok(X.explicaRaiz(item, ctx(idioma)).includes(html), 'la tarjeta lleva la misma frase');
      const cuentas = [...html.matchAll(/(\d+) · \1 = (\d+)/g)].map(m => [Number(m[1]), Number(m[2])]);
      assert.equal(cuentas.length, 2);
      const [[u, u2], [s, s2]] = cuentas;
      assert.equal(u2, u * u); assert.equal(s2, s * s);
      assert.ok(u2 <= item.n && s2 > item.n, `${item.n}: ${u2} no pasa y ${s2} sí`);
      assert.ok(L.datosExplicacionRaiz(item.n).siguiente === s && L.datosExplicacionRaiz(item.n).ultimo === u);
    }
  }
});
