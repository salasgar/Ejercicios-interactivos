// «No lo sé» en parentesis-enteros: cada explicación acaba con la respuesta que el ejercicio da por
// buena, calculada aquí con el evaluador y no copiada de la explicación.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { evaluar, aTexto, fmt } from '../practicas/_comun/enteros.js';
import * as L from '../practicas/parentesis-enteros/logica.js';
import * as X from '../practicas/parentesis-enteros/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const N = 1000;
const items = (fn, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, () => fn(rng));
};
const FIN = { es: 'La respuesta es', en: 'The answer is' };

/** Lo que va en el último «cuenta» tras «La respuesta es», en texto plano. */
function final(html, idioma, que) {
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, `${que}: ${plano(html)}`);
  const m = html.match(new RegExp(`${FIN[idioma]} <span class="cuenta">(.*?)</span>\\.</p>$`));
  assert.ok(m, `${que}: no acaba con la respuesta — ${plano(html)}`);
  return plano(m[1]);
}
const quieto = s => s.replace(/\s+/g, '');
/** Texto plano que el evaluador entiende: los exponentes <sup>2</sup> como ^2. */
const planoExp = html => plano(html.replace(/<sup>(.*?)<\/sup>/g, '^$1'));

test('ej. 1: la respuesta es la cuenta sin paréntesis con los signos buenos y vale lo mismo', () => {
  for (const item of items(L.generarQuita, 1)) {
    const signos = item.dentro.map(t => t.signo * item.signoPar);
    for (const idioma of IDIOMAS) {
      const r = final(X.explicaQuita(item, ctx(idioma)), idioma, `ej1 ${idioma}`);
      const esperado = L.reescritura(item, signos);
      assert.equal(quieto(r), quieto(aTexto(esperado)));
      assert.equal(evaluar(r), evaluar(item.expr));
      assert.ok(!r.includes('('), r);
    }
  }
});

test('ej. 2: la respuesta es el valor de la cuenta', () => {
  for (const item of items(L.generarCalcula, 2)) {
    for (const idioma of IDIOMAS) {
      const html = X.explicaCalcula(item, ctx(idioma));
      assert.equal(final(html, idioma, `ej2 ${idioma}`), fmt(evaluar(item.expr)));
    }
  }
});

test('ej. 3: la respuesta son los valores de las cuentas, en orden', () => {
  let parejas = 0, solas = 0;
  for (const item of items(L.generarPotencia, 3)) {
    const valores = item.exprs.map(e => evaluar(e));
    for (const idioma of IDIOMAS) {
      const r = final(X.explicaPotencia(item, ctx(idioma)), idioma, `ej3 ${idioma}`);
      assert.equal(r, valores.length === 2 ? `A = ${fmt(valores[0])}; B = ${fmt(valores[1])}` : fmt(valores[0]));
    }
    if (valores.length === 2) parejas++; else solas++;
  }
  assert.ok(parejas > 100 && solas > 100, 'salen parejas y cuentas solas');
});

test('ej. 1: si el paréntesis va el primero y sin signo, no dice «delante hay un +»', () => {
  let primeros = 0;
  for (const item of items(L.generarQuita, 11)) {
    if (item.antes.length || item.signoPar < 0) continue;
    primeros++;
    for (const idioma of IDIOMAS) {
      assert.doesNotMatch(X.explicaQuita(item, ctx(idioma)), /hay un \+|There is a \+/, `ej1 ${idioma}`);
    }
  }
  assert.ok(primeros > 20, 'salen paréntesis el primero');
});

/** Las cuentas de una cadena «a = b = c» valen todas lo mismo que la expresión. */
function cadenaVale(texto, valor, que) {
  for (const trozo of texto.split(' = ')) assert.equal(evaluar(trozo), valor, `${que}: «${trozo}» en «${texto}»`);
}

test('ej. 2 y 3: antes del resultado, el número entre paréntesis de la suma se quita («7 − (−1) + 12 = 7 + 1 + 12»)', () => {
  let vistos = 0;
  for (const [generar, explica, semilla] of [[L.generarCalcula, X.explicaCalcula, 21], [L.generarPotencia, X.explicaPotencia, 31]]) {
    for (const item of items(generar, semilla)) {
      for (const idioma of IDIOMAS) {
        const html = explica(item, ctx(idioma));
        if (/Quito los paréntesis de los números|Remove the brackets around the numbers/.test(html)) vistos++;
        for (const m of html.matchAll(/<span class="cuenta">(.*?)<\/span>/g)) {
          const c = planoExp(m[1]);
          if (!c.includes(' = ') || c.startsWith('A = ')) continue;   // «A = 70; B = 20» es la respuesta, no una cadena
          const lados = c.split(' = ');
          // Si el último paso lleva al resultado, el de antes no es una suma o resta con un número entre paréntesis.
          const pen = lados.at(-2);
          if (/^−?\d+$/.test(lados.at(-1)) && /[+−] \(−?\d+\)( [+−]|$)/.test(pen)) assert.fail(`queda «${pen}» antes del resultado: ${c}`);
          cadenaVale(c, evaluar(lados[0]), 'ej2/3');
        }
      }
    }
  }
  assert.ok(vistos > 50, 'salen cuentas con el paso intermedio');
});

test('ej. 4: la resolución entera de dentro afuera, y la respuesta es el valor', () => {
  for (const item of items(L.generarCorchetes, 4)) {
    const valor = evaluar(item.expr);
    for (const idioma of IDIOMAS) {
      const html = X.explicaCorchetes(item, ctx(idioma));
      assert.equal(final(html, idioma, `ej4 ${idioma}`), fmt(valor));
      const cadena = planoExp(html.match(/<p><span class="cuenta">(.*?)<\/span><\/p>/)[1]);
      assert.equal(quieto(cadena.split(' = ')[0]), quieto(aTexto(item.expr)));
      cadenaVale(cadena, valor, `ej4 ${idioma}`);
    }
  }
});

test('ej. 5: la respuesta son TODAS las colocaciones que dan el objetivo, y solo esas', () => {
  let varias = 0;
  const rng = crearRng(5);
  // Más de una colocación buena sale en 1 de cada 400 ítems: hacen falta muchos para ver alguno.
  for (const item of Array.from({ length: 4000 }, () => L.generarColocar(rng))) {
    const esperadas = L.buenas(item).map(b => quieto(b.texto));
    if (esperadas.length > 1) varias++;
    for (const idioma of IDIOMAS) {
      const html = X.explicaColocar(item, ctx(idioma));
      assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, plano(html));
      const fin = html.match(new RegExp(`<p>${FIN[idioma]} (.*)\\.</p>$`));
      assert.ok(fin, `ej5 ${idioma}: no acaba con la respuesta — ${plano(html)}`);
      const cuentas = [...fin[1].matchAll(/<span class="cuenta">(.*?)<\/span>/g)].map(m => planoExp(m[1]));
      assert.deepEqual(cuentas.map(c => quieto(c.split(' = ')[0])), esperadas, plano(html));
      for (const c of cuentas) {
        const trozos = c.split(' = ');
        assert.ok(trozos[0].includes('('), trozos[0]);
        assert.notEqual(quieto(trozos[0]), quieto(item.expr));
        assert.equal(trozos.at(-1), fmt(item.objetivo));
        cadenaVale(c, item.objetivo, `ej5 ${idioma}`);
      }
      if (esperadas.length > 1) assert.match(plano(html), /valen las dos|both are right|cualquiera|any of/);
    }
  }
  assert.ok(varias >= 1, 'sale algún ítem con más de una colocación buena');
});
