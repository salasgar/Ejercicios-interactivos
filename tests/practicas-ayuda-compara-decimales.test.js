// «No lo sé» de compara-decimales (tareas 173 y 190): cada explicación acaba con la respuesta buena del ítem,
// calculada con su lógica, y vigila lo que corrigió la revisión 190: la regla delante, la respuesta una sola
// vez (antes salía también al final del método), la parte entera primero, la cifra que decide y el inglés
// de los órdenes («hundredths», no «hundredth digit»); en «Entre dos», que vale cualquier número.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import { aTexto, decimal, comparar } from '../practicas/_comun/decimales.js';
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
  assert.match(html, /^<p>/, `${que}: empieza por la regla`);
  assert.match(html, /<p><strong>(La respuesta es|The answer is) [^]*\.<\/strong><\/p>$/, `${que}: la respuesta, al final`);
  assert.doesNotMatch(plano(html), /\b(tenth|hundredth|thousandth) digit\b/, `${que}: «the tenths digit», no «the tenth digit»`);
};
const SIG = { '<': '&lt;', '=': '=', '>': '&gt;' };
const veces = (texto, trozo) => texto.split(trozo).length - 1;

test('compara-decimales · ejercicio 1: el signo bueno, una sola vez, y la cifra que lo decide', () => {
  for (const item of items(L.generarComparar, 1)) {
    const a = D(item.a), b = D(item.b);
    for (const idioma of IDIOMAS) {
      const html = explicaComparar(item, textosDe(idioma));
      sano(html, `comparar ${idioma}`);
      const esperado = `${aTexto(a, idioma)} ${SIG[L.simboloComparar(item)]} ${aTexto(b, idioma)}`;
      assert.ok(html.includes(`${esperado}.</strong>`), plano(html));
      assert.equal(veces(html, esperado), 1, `la comparación sale una vez: ${plano(html)}`);
      const positivos = a.m > 0 && b.m > 0 && comparar(a, b) !== 0;
      const ea = Math.floor(Math.abs(a.m) / 10 ** a.k), eb = Math.floor(Math.abs(b.m) / 10 ** b.k);
      // Con partes enteras distintas, decide la parte entera (sin rellenar con ceros).
      if (positivos && ea !== eb) assert.ok(html.includes(`${ea} ${SIG[L.simboloComparar(item)]} ${eb}`), plano(html));
      if (positivos && ea === eb) assert.match(plano(html), idioma === 'es' ? /primera cifra distinta/ : /first different digit/, plano(html));
    }
  }
});

test('compara-decimales · ejercicio 2: el orden bueno, y antes el mismo orden con las mismas cifras decimales', () => {
  for (const item of items(L.generarOrden, 2)) {
    const k = Math.max(...item.vals.map(v => v.k));
    for (const idioma of IDIOMAS) {
      const html = explicaOrden(item, textosDe(idioma));
      sano(html, `orden ${idioma}`);
      const signo = item.creciente ? ' &lt; ' : ' &gt; ';
      const esperado = L.ordenCorrecto(item).map(i => aTexto(D(item.vals[i]), idioma)).join(signo);
      assert.ok(html.includes(`${esperado}.</strong>`), plano(html));
      const igualado = L.ordenCorrecto(item).map(i => aTexto(D(item.vals[i]), idioma, k)).join(signo);
      assert.ok(html.includes(igualado), `el orden con ${k} cifras: ${plano(html)}`);
      const negativos = item.vals.filter(v => v.m < 0).length;
      if (negativos > 1) assert.match(plano(html), /más lejos del 0|farther from 0/, plano(html));
    }
  }
});

test('compara-decimales · ejercicio 3: el ejemplo está entre los dos y, al escribir, dice que vale cualquiera', () => {
  for (const item of items(L.generarEntre, 3)) {
    assert.ok(L.estaEntre(item, L.ejemploEntre(item)), 'el ejemplo está entre a y b');
    const a = D(item.a), b = D(item.b);
    for (const idioma of IDIOMAS) {
      const html = explicaEntre(item, textosDe(idioma));
      sano(html, `entre ${idioma}`);
      const ej = aTexto(L.ejemploEntre(item), idioma);
      if (item.modo === 'elige') {
        assert.ok(html.includes(`${ej}.</strong>`), plano(html));
      } else {
        const final = idioma === 'es'
          ? `${ej}, por ejemplo (o cualquier otro número entre ${aTexto(a, idioma)} y ${aTexto(b, idioma)}).</strong>`
          : `${ej}, for example (or any other number between ${aTexto(a, idioma)} and ${aTexto(b, idioma)}).</strong>`;
        assert.ok(html.includes(final), plano(html));
      }
      // La regla no promete «una cifra más» a cada número: es una más que el más largo.
      assert.doesNotMatch(plano(html), /una cifra decimal más a los dos|one more decimal place to both/, plano(html));
    }
  }
});

test('compara-decimales · ejercicio 4: el redondeo bueno, qué se deja y qué pasa con la última cifra', () => {
  for (const item of items(L.generarRedondeo, 4)) {
    const R = L.redondeoBueno(item);
    for (const idioma of IDIOMAS) {
      const html = explicaRedondeo(item, textosDe(idioma));
      sano(html, `redondeo ${idioma}`);
      assert.ok(html.includes(`${aTexto(R, idioma)}.</strong>`), plano(html));
      assert.equal(veces(plano(html), `${idioma === 'es' ? 'Resultado' : 'Answer'}:`), 0, 'sin «Resultado:» antes de la respuesta');
      assert.ok(plano(html).includes(` ${L.cifraSiguiente(D(item.d), item.c)} `), `la cifra siguiente: ${plano(html)}`);
      if (L.haceArrastre(item.d, item.c)) assert.match(plano(html), /se lleva 1|carry 1/, plano(html));
      if (L.haceArrastre(item.d, item.c) && item.c > 0) assert.match(plano(html), /0 del final no se quita|drop the final 0/, plano(html));
    }
  }
});
