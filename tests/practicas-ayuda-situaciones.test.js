// «No lo sé» en `situaciones` (tarea 178): la explicación de cada ejercicio lleva la solución del ítem,
// calculada con la lógica de la práctica. 1000+ ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { fmt } from '../practicas/_comun/enteros.js';
import * as L from '../practicas/situaciones/logica.js';
import * as X from '../practicas/situaciones/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const generar = (fn, semilla, n = 1200) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };

test('situaciones · ejercicio 1: la explicación lleva el entero que el ejercicio da por bueno', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarEntero, 1)) {
      const html = plano(X.explicaEntero(item, ctx(idioma)));
      assert.ok(L.enCota(item.ctx, item.n));
      assert.ok(html.includes(`${fmt(item.n)} .`) || html.includes(`${fmt(item.n)}.`), `respuesta ${item.n}`);
      assert.ok(html.includes(item.n < 0 ? (idioma === 'es' ? 'negativo. La' : 'negative. The') : item.n > 0 ? (idioma === 'es' ? 'positivo. La' : 'positive. The') : '0'), 'el signo');
    }
  }
});

test('situaciones · ejercicio 2: la explicación lleva la frase buena, y solo esa', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarSituacion, 2)) {
      const html = plano(X.explicaSituacion(item, ctx(idioma)));
      const buena = L.opcionBuena(item);
      assert.equal(buena.v, item.n);
      const dicha = X.frase(buena.ctx, buena.v, idioma);
      assert.ok(html.endsWith(`${dicha}” .`.replace(' .', '.')) || html.endsWith(`${dicha}».`) || html.endsWith(`${dicha}”.`), `frase «${dicha}»`);
      for (const o of item.opciones.filter(x => x.error !== null)) {
        assert.ok(!html.endsWith(`${X.frase(o.ctx, o.v, idioma)}».`) && !html.endsWith(`${X.frase(o.ctx, o.v, idioma)}”.`), 'no nombra una opción mala como respuesta');
      }
    }
  }
});

test('situaciones · ejercicio 3: la explicación lleva la cuenta, el resultado y la frase', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarPaso, 3)) {
      const html = plano(X.explicaPaso(item, ctx(idioma)));
      assert.ok(L.esCorrectoPaso(item, item.r, item.r));
      assert.ok(html.includes(`${L.cuentaPaso(item)} = ${fmt(item.r)}`), 'la cuenta');
      assert.ok(html.includes(`${fmt(item.r)}, `), 'el resultado');
      const buena = L.frasesPaso(item).find(f => f.error === null);
      assert.equal(buena.v, item.r);
      const dicha = X.fraseResultado(item.ctx, buena.v, idioma);
      assert.ok(html.endsWith(idioma === 'es' ? `con la frase «${dicha}».` : `with the sentence “${dicha}”.`), 'la frase del resultado, al final');
    }
  }
});
