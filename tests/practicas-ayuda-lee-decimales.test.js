// «No lo sé» de lee-decimales (tarea 173): cada explicación lleva la solución del ítem, calculada con su lógica.

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
function sano(html, que) {
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, `${que}: ${plano(html)}`);
  assert.ok(html.length > 40, `${que}: corta`);
}

test('lee-decimales · ejercicio 1: la explicación da la lectura o el número buenos', () => {
  for (const item of items(L.generarLeelo, 1)) {
    for (const idioma of IDIOMAS) {
      const html = explicaLeelo(item, textosDe(idioma));
      sano(html, `leelo ${idioma}`);
      if (item.sentido === 'lectura') {
        const buena = idioma === item.idioma ? item.opciones.find(o => o.correcta).texto : enPalabras(L.D(item.d), idioma);
        assert.ok(html.includes(`«${buena}»`), plano(html));
      } else {
        assert.ok(html.includes(`${num(item.d, idioma)}.</strong>`), plano(html));
      }
    }
  }
});

test('lee-decimales · ejercicio 2: la explicación da el valor o la descomposición buenos', () => {
  for (const item of items(L.generarCifra, 2)) {
    const buena = item.opciones.find(o => o.correcta);
    for (const idioma of IDIOMAS) {
      const html = explicaCifra(item, textosDe(idioma));
      sano(html, `cifra ${idioma}`);
      const esperado = item.tipo === 'valor' ? num(buena.valor, idioma) : buena.terminos.map(t => num(t, idioma)).join(' + ');
      assert.ok(html.includes(`${esperado}.</strong>`), plano(html));
    }
  }
});

test('lee-decimales · ejercicio 3: la explicación da la fracción o el decimal buenos', () => {
  for (const item of items(L.generarFraccionDecimal, 3)) {
    const buena = item.opciones.find(o => o.correcta);
    for (const idioma of IDIOMAS) {
      const html = explicaFraccion(item, textosDe(idioma));
      sano(html, `fraccion ${idioma}`);
      const esperado = item.sentido === 'a-fraccion'
        ? `${num(item.d, idioma)} = ${htmlFraccion(L.Fr(buena.fr))}`
        : `${htmlFraccion(L.Fr(item.fr))} = ${num(buena.valor, idioma)}`;
      assert.ok(html.includes(`${esperado}.</strong>`), plano(html));
    }
  }
});

test('lee-decimales · ejercicio 4: la explicación da el decimal de la recta y sus huecos', () => {
  for (const item of items(L.generarRecta, 4)) {
    for (const idioma of IDIOMAS) {
      const html = explicaRecta(item, textosDe(idioma));
      sano(html, `recta ${idioma}`);
      assert.ok(html.includes(`${num(item.valor, idioma)}.</strong>`), plano(html));
      assert.ok(plano(html).includes(` ${item.marcas} `), 'los huecos');
    }
  }
});
