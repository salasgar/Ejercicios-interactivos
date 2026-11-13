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

/**
 * La explicación acaba con «La respuesta es <strong>X</strong>.» y X es lo esperado. Si X acaba en «…», sin punto
 * detrás (revisión de la tarea 190: nada de «….» en ningún sitio).
 */
function comprobar(html, idioma, esperado, que) {
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, `${que}: ${plano(html)}`);
  assert.doesNotMatch(html, /…(<\/[a-z]+>)*\./, `${que}: «….» — ${plano(html)}`);
  const m = html.match(new RegExp(`${FIN[idioma]} <strong>(.*?)</strong>(\\.?)$`));
  assert.ok(m, `${que}: no acaba con la respuesta — ${plano(html)}`);
  assert.equal(m[1], esperado, `${que}: ${plano(html)}`);
  assert.equal(m[2], m[1].endsWith('…') ? '' : '.', `${que}: el punto final — ${plano(html)}`);
}
const OPCION = { es: t => `«${t}»`, en: t => `“${t}”` };

test('ej. 1: acaba con el decimal de la fracción (con «…» si es periódico) o con «Exacto» / «Periódico», como el botón', () => {
  for (const item of items(L.generarFraccionADecimal, 1)) {
    const { exacta } = dividirLargo(item.f.num, item.f.den);
    if (item.tipo === 'tipo') assert.equal(item.periodica, !exacta);
    for (const idioma of IDIOMAS) {
      const esperado = item.tipo === 'tipo'
        ? OPCION[idioma](X.TX.ej1[exacta ? 'exacto' : 'periodico'][idioma])
        : textoDecimal(item.f.num, item.f.den, idioma);
      const html = X.explicaFraccionADecimal(item, ctx(idioma));
      comprobar(html, idioma, esperado, `ej1 ${item.tipo} ${idioma}`);
      // La cuenta va cerrada: «15 : 8 = 1,875. La división…», nunca «1,875 La división».
      assert.doesNotMatch(plano(html), /\d [A-Z]/, `ej1 ${idioma}: frase sin cerrar — ${plano(html)}`);
      if (!exacta) {
        // «el 3 se repite»: la cifra que dice es la que se repite de verdad (división larga hecha aquí).
        const m = plano(html).match(idioma === 'es' ? /el (\d) se repite/ : /the (\d) repeats/);
        assert.ok(m, `ej1 ${idioma}: no dice qué cifra se repite — ${plano(html)}`);
        let resto = item.f.num % item.f.den;
        const cifras = [];
        for (let i = 0; i < 8; i++) { resto *= 10; cifras.push(Math.floor(resto / item.f.den)); resto %= item.f.den; }
        assert.ok(cifras.slice(2).every(c => c === Number(m[1])), `ej1 ${idioma}: ${item.f.num}/${item.f.den} no repite el ${m[1]}`);
      }
    }
  }
});

test('ej. 2: acaba con la fracción irreducible del decimal; simplifica entre el m.c.d. o dice que ya es irreducible', () => {
  for (const item of items(L.generarDecimalAFraccion, 2)) {
    const den = 10 ** item.d.k, g = mcd(item.d.m, den);
    const esperado = cf(h({ num: item.d.m / g, den: den / g }));
    for (const idioma of IDIOMAS) {
      const html = X.explicaDecimalAFraccion(item, ctx(idioma));
      comprobar(html, idioma, esperado, `ej2 ${idioma}`);
      assert.ok(html.includes(h({ num: item.d.m, den })), `ej2 ${idioma}: falta la fracción decimal ${item.d.m}/${den}`);
      if (g > 1) assert.ok(plano(html).includes(idioma === 'es' ? `entre ${g}:` : `by ${g}:`), `ej2 ${idioma}: no divide entre ${g} — ${plano(html)}`);
      else assert.match(plano(html), idioma === 'es' ? /ya es irreducible/ : /already in its simplest form/, `ej2 ${idioma}: ${plano(html)}`);
    }
  }
});

test('ej. 3: lista las seis parejas, cada una con su división', () => {
  for (const item of items(L.generarParejas, 3)) {
    for (const idioma of IDIOMAS) {
      const html = X.explicaParejas(item, ctx(idioma));
      const pares = item.fracciones.map(f => `${h(f)} = ${f.num} : ${f.den} = ${textoDecimal(f.num, f.den, idioma).replace('…', '')}`);
      comprobar(html, idioma, cf(pares.join('; ')), `ej3 ${idioma}`);
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
      const html = X.explicaFraccionODecimal(item, ctx(idioma));
      comprobar(html, idioma, cf(`${izq} ${ESC[sig]} ${der}`), `ej4 ${idioma}`);
      // La cifra que decide: «se distinguen en las centésimas: 6 < 7», con el mismo signo que la respuesta.
      const m = plano(html).match(idioma === 'es' ? /se distinguen en [a-zé ]+: (\d+) (&lt;|&gt;) (\d+)/ : /first differ in [a-z ]+: (\d+) (&lt;|&gt;) (\d+)/);
      if (sig === '=') assert.equal(m, null, `ej4 ${idioma}: ${plano(html)}`);
      else {
        assert.ok(m, `ej4 ${idioma}: no dice dónde se distinguen — ${plano(html)}`);
        assert.equal(m[2], ESC[sig], `ej4 ${idioma}: ${plano(html)}`);
        assert.ok(sig === '<' ? Number(m[1]) < Number(m[3]) : Number(m[1]) > Number(m[3]), `ej4 ${idioma}: ${plano(html)}`);
      }
    }
  }
});
