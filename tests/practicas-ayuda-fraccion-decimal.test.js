// «No lo sé» en fraccion-decimal: cada explicación acaba con la respuesta del ítem, calculada aquí con
// aritmética entera propia (división larga y producto cruzado), no con la lógica de la práctica.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { htmlFraccion } from '../practicas/_comun/fracciones.js';
import * as L from '../practicas/fraccion-decimal/logica.js';
import * as X from '../practicas/fraccion-decimal/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const N = 1000;
const items = (fn, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, (_, i) => fn(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] }));
};
const FIN = { es: 'La respuesta es', en: 'The answer is' };
const mcd = (a, b) => (b === 0 ? a : mcd(b, a % b));
const cf = t => `<span class="cuenta-frac">${t}</span>`;
const h = f => htmlFraccion({ num: f.num, den: f.den }, { compacta: true });
const sep = idioma => (idioma === 'es' ? ',' : '.');

/** División larga a 3 decimales (truncada) y si es exacta, solo con enteros. */
function dividirLargo(num, den) {
  let resto = num % den;
  let texto = String(Math.floor(num / den));
  let cifras = '';
  let exacta = resto === 0;
  for (let i = 0; i < 3 && resto !== 0; i++) { resto *= 10; cifras += Math.floor(resto / den); resto %= den; }
  exacta = resto === 0;
  cifras = cifras.replace(/0+$/, '');
  return { exacta, entero: texto, cifras };
}
const textoDecimal = (num, den, idioma) => {
  const { exacta, entero, cifras } = dividirLargo(num, den);
  const cuerpo = cifras ? `${entero}${sep(idioma)}${cifras}` : entero;
  return exacta ? cuerpo : `${cuerpo}…`;
};

/** La explicación acaba con «La respuesta es <strong>X</strong>.» y X es lo esperado. */
function comprobar(html, idioma, esperado, que) {
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, `${que}: ${plano(html)}`);
  const m = html.match(new RegExp(`${FIN[idioma]} <strong>(.*?)</strong>\\.$`));
  assert.ok(m, `${que}: no acaba con la respuesta — ${plano(html)}`);
  assert.equal(m[1], esperado, `${que}: ${plano(html)}`);
}

test('ej. 1: acaba con el decimal de la fracción (con «…» si es periódico) o con exacto / periódico', () => {
  for (const item of items(L.generarFraccionADecimal, 1)) {
    const { exacta } = dividirLargo(item.f.num, item.f.den);
    if (item.tipo === 'tipo') assert.equal(item.periodica, !exacta);
    for (const idioma of IDIOMAS) {
      const esperado = item.tipo === 'tipo'
        ? (exacta ? { es: 'que es exacto (termina)', en: 'that it is terminating (it ends)' }[idioma] : { es: 'que es periódico (no termina)', en: 'that it is recurring (never ends)' }[idioma])
        : textoDecimal(item.f.num, item.f.den, idioma);
      comprobar(X.explicaFraccionADecimal(item, ctx(idioma)), idioma, esperado, `ej1 ${item.tipo} ${idioma}`);
    }
  }
});

test('ej. 2: acaba con la fracción irreducible del decimal', () => {
  for (const item of items(L.generarDecimalAFraccion, 2)) {
    const den = 10 ** item.d.k, g = mcd(item.d.m, den);
    const esperado = cf(h({ num: item.d.m / g, den: den / g }));
    for (const idioma of IDIOMAS) comprobar(X.explicaDecimalAFraccion(item, ctx(idioma)), idioma, esperado, `ej2 ${idioma}`);
  }
});

test('ej. 3: lista las seis parejas, cada una con su división', () => {
  for (const item of items(L.generarParejas, 3)) {
    for (const idioma of IDIOMAS) {
      const html = X.explicaParejas(item, ctx(idioma));
      const pares = item.fracciones.map(f => `${h(f)} = ${textoDecimal(f.num, f.den, idioma).replace('…', '')}`);
      comprobar(html, idioma, cf(pares.join('; ')), `ej3 ${idioma}`);
      for (const f of item.fracciones) assert.ok(html.includes(`${f.num} : ${f.den} =`), `ej3 ${idioma}: falta la cuenta ${f.num} : ${f.den}`);
    }
  }
});

test('ej. 4: acaba con el signo que sale del producto cruzado', () => {
  for (const item of items(L.generarFraccionODecimal, 4)) {
    const izqF = item.orden === 'fd';
    const a = item.f.num * 10 ** item.d.k, b = item.d.m * item.f.den;   // fracción contra decimal
    const sigF = a < b ? '<' : a > b ? '>' : '=';                       // fracción respecto al decimal
    const sig = izqF ? sigF : { '<': '>', '>': '<', '=': '=' }[sigF];
    const ESC = { '<': '&lt;', '>': '&gt;', '=': '=' };
    for (const idioma of IDIOMAS) {
      const f = h(item.f), d = textoDecimal(item.d.m, 10 ** item.d.k, idioma);
      const [izq, der] = izqF ? [f, d] : [d, f];
      comprobar(X.explicaFraccionODecimal(item, ctx(idioma)), idioma, cf(`${izq} ${ESC[sig]} ${der}`), `ej4 ${idioma}`);
    }
  }
});
