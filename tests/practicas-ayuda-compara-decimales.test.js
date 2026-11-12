// «No lo sé» de compara-decimales (tarea 173): cada explicación acaba con la respuesta buena del ítem,
// calculada con su lógica.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import { aTexto, decimal } from '../practicas/_comun/decimales.js';
import * as L from '../practicas/compara-decimales/logica.js';
import { explicaComparar, explicaOrden, explicaEntre, explicaRedondeo } from '../practicas/compara-decimales/ayuda.js';

const IDIOMAS = ['es', 'en'];
const D = ({ m, k }) => decimal(m, k);
const textosDe = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const items = (fn, semilla, n = 1000) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng, {})); };
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const sano = (html, que) => {
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, `${que}: ${plano(html)}`);
  assert.ok(html.length > 60, `${que}: corta`);
};
const SIG = { '<': '&lt;', '=': '=', '>': '&gt;' };

test('compara-decimales · ejercicio 1: la explicación da el signo bueno entre los dos números', () => {
  for (const item of items(L.generarComparar, 1)) {
    for (const idioma of IDIOMAS) {
      const html = explicaComparar(item, textosDe(idioma));
      sano(html, `comparar ${idioma}`);
      const esperado = `${aTexto(D(item.a), idioma)} ${SIG[L.simboloComparar(item)]} ${aTexto(D(item.b), idioma)}`;
      assert.ok(html.includes(`${esperado}.</strong>`), plano(html));
    }
  }
});

test('compara-decimales · ejercicio 2: la explicación da el orden bueno', () => {
  for (const item of items(L.generarOrden, 2)) {
    for (const idioma of IDIOMAS) {
      const html = explicaOrden(item, textosDe(idioma));
      sano(html, `orden ${idioma}`);
      const esperado = L.ordenCorrecto(item).map(i => aTexto(D(item.vals[i]), idioma)).join(item.creciente ? ' &lt; ' : ' &gt; ');
      assert.ok(html.includes(`${esperado}.</strong>`), plano(html));
    }
  }
});

test('compara-decimales · ejercicio 3: el ejemplo que da está entre los dos números', () => {
  for (const item of items(L.generarEntre, 3)) {
    assert.ok(L.estaEntre(item, L.ejemploEntre(item)), 'el ejemplo está entre a y b');
    for (const idioma of IDIOMAS) {
      const html = explicaEntre(item, textosDe(idioma));
      sano(html, `entre ${idioma}`);
      assert.ok(html.includes(`<strong>`) && plano(html).includes(aTexto(L.ejemploEntre(item), idioma)), plano(html));
    }
  }
});

test('compara-decimales · ejercicio 4: la explicación da el redondeo bueno', () => {
  for (const item of items(L.generarRedondeo, 4)) {
    for (const idioma of IDIOMAS) {
      const html = explicaRedondeo(item, textosDe(idioma));
      sano(html, `redondeo ${idioma}`);
      assert.ok(html.includes(`${aTexto(L.redondeoBueno(item), idioma)}.</strong>`), plano(html));
    }
  }
});
