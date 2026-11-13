// «No lo sé» de lee-decimales (tareas 173 y 190): cada explicación lleva la solución del ítem, calculada con
// su lógica, y lo que la revisión 190 corrigió: la regla de la lectura que sale (con «coma» o con los
// órdenes), las comillas del idioma, «es 1 centésima» y no «son 1 centésima», los ceros de delante al pasar
// de fracción a decimal, y el consejo de la recta antes de la respuesta.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import { aTexto, enPalabras } from '../practicas/_comun/decimales.js';
import { htmlFraccion } from '../practicas/_comun/fracciones.js';
import * as L from '../practicas/lee-decimales/logica.js';
import { explicaLeelo, explicaCifra, explicaFraccion, explicaRecta } from '../practicas/lee-decimales/ayuda.js';

const IDIOMAS = ['es', 'en'];
const textosDe = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const items = (fn, semilla, n = 1000) => {
  const rng = crearRng(semilla);
  return Array.from({ length: n }, (_, i) => fn(rng, { aciertos: i % 10, idioma: IDIOMAS[i % 2] }));
};
const num = (p, idioma) => aTexto(L.D(p), idioma);
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const comillas = (x, idioma) => (idioma === 'en' ? `“${x}”` : `«${x}»`);
function sano(html, que) {
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, `${que}: ${plano(html)}`);
  assert.ok(html.length > 40, `${que}: corta`);
  // La respuesta va al final: nada detrás de su párrafo.
  assert.match(html, /<p><strong>(La respuesta es|The answer is) [^]*\.<\/strong><\/p>$/, `${que}: la respuesta no está al final: ${plano(html)}`);
}

test('lee-decimales · ejercicio 1: la explicación da la lectura o el número buenos, con la regla de esa lectura', () => {
  let conOrdenes = 0;
  for (const item of items(L.generarLeelo, 1)) {
    for (const idioma of IDIOMAS) {
      const html = explicaLeelo(item, textosDe(idioma));
      sano(html, `leelo ${idioma}`);
      const buena = idioma === item.idioma ? item.lectura : enPalabras(L.D(item.d), idioma);
      if (item.sentido === 'lectura') {
        assert.ok(html.includes(`${comillas(buena, idioma)}.</strong>`), plano(html));
      } else {
        assert.ok(html.includes(`${num(item.d, idioma)}.</strong>`), plano(html));
      }
      if (idioma === 'en') {
        assert.doesNotMatch(html, /«|»/, `en inglés, comillas inglesas: ${plano(html)}`);
        continue;
      }
      // La regla tiene que ser la de la lectura que sale: «cinco décimas» no se explica con «coma».
      if (/\bcoma\b/.test(buena)) assert.match(plano(html), /coma/, plano(html));
      else {
        conOrdenes++;
        assert.match(plano(html), /décimas, 1; centésimas, 2; milésimas, 3/, plano(html));
        assert.doesNotMatch(plano(html), /«coma»/, `con los órdenes no se habla de «coma»: ${plano(html)}`);
      }
      // «cero coma cero cinco»: la regla dice qué es cada «cero».
      if (/\bcoma cero\b/.test(buena)) assert.match(plano(html), /«cero»/, plano(html));
    }
  }
  assert.ok(conOrdenes > 50, 'salen lecturas con los órdenes');
});

test('lee-decimales · ejercicio 2: la explicación da el valor o la descomposición buenos', () => {
  for (const item of items(L.generarCifra, 2)) {
    const buena = item.opciones.find(o => o.correcta);
    for (const idioma of IDIOMAS) {
      const html = explicaCifra(item, textosDe(idioma));
      sano(html, `cifra ${idioma}`);
      const esperado = item.tipo === 'valor' ? num(buena.valor, idioma) : buena.terminos.map(t => num(t, idioma)).join(' + ');
      assert.ok(html.includes(`${esperado}.</strong>`), plano(html));
      assert.doesNotMatch(plano(html), /son 1 (décima|centésima|milésima|unidad|decena)\b/, `«es 1…», no «son 1…»: ${plano(html)}`);
      if (item.tipo === 'valor') {
        // El paso que lleva de «5 centésimas» a 0,05.
        const nombre = L.ordenDe(item.exponente, idioma, item.cifra === 1 ? 1 : 2);
        assert.ok(plano(html).includes(`${item.cifra} ${nombre} = ${esperado}`), plano(html));
      } else {
        assert.equal((plano(html).match(/cada cifra vale según su lugar|each digit is worth what its place says/gi) ?? []).length, 1, `regla repetida: ${plano(html)}`);
      }
    }
  }
});

test('lee-decimales · ejercicio 3: la explicación da la fracción o el decimal buenos', () => {
  let conCeros = 0;
  for (const item of items(L.generarFraccionDecimal, 3)) {
    const buena = item.opciones.find(o => o.correcta);
    for (const idioma of IDIOMAS) {
      const html = explicaFraccion(item, textosDe(idioma));
      sano(html, `fraccion ${idioma}`);
      const esperado = item.sentido === 'a-fraccion'
        ? `${num(item.d, idioma)} = ${htmlFraccion(L.Fr(buena.fr))}`
        : `${htmlFraccion(L.Fr(item.fr))} = ${num(buena.valor, idioma)}`;
      assert.ok(html.includes(`${esperado}.</strong>`), plano(html));
      assert.doesNotMatch(plano(html), /queden 1 |so that 1 are/, plano(html));
      // 7/1000: si el numerador no llega, la tarjeta dice que se ponen ceros (o un 0) delante.
      if (item.sentido === 'a-decimal' && String(item.fr.n).length <= item.d.k) {
        conCeros++;
        assert.match(plano(html), idioma === 'es' ? /se pone un 0|ceros delante/ : /write a 0|zeros in front/, plano(html));
      }
    }
  }
  assert.ok(conCeros > 0, 'salen fracciones con el numerador corto');
});

test('lee-decimales · ejercicio 4: la explicación da el decimal de la recta, sus huecos y el consejo antes de la respuesta', () => {
  for (const item of items(L.generarRecta, 4)) {
    for (const idioma of IDIOMAS) {
      const html = explicaRecta(item, textosDe(idioma));
      sano(html, `recta ${idioma}`);
      assert.ok(html.includes(`${num(item.valor, idioma)}.</strong>`), plano(html));
      assert.ok(plano(html).includes(` ${item.marcas} `), 'los huecos');
      assert.ok(html.indexOf('class="consejo"') < html.indexOf('<strong>'), 'el consejo va antes de la respuesta');
    }
  }
});
