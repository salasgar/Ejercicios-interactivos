// «No lo sé» en `propiedades` (tarea 189): la explicación termina en la solución del ítem, calculada con la lógica.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/propiedades/logica.js';
import * as X from '../practicas/propiedades/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<sup>/g, '^').replace(/<\/sup>/g, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
const generar = (fn, semilla, n = 1500) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };
const RESP = { es: 'La respuesta es', en: 'The answer is' };

test('propiedades · ejercicio 1: la explicación termina en los términos que quedan al juntar', () => {
  for (const idioma of IDIOMAS) for (const item of generar(rng => L.generarJuntar(rng, { aciertos: 5 }), 1)) {
    const t = plano(X.explicaJuntar(item, ctx(idioma)));
    const { terminos, ops } = L.resolver(item.terminos, item.operadores);
    const final = terminos.map((q, i) => (i ? `${idioma === 'en' && ops[i - 1] === ':' ? '÷' : ops[i - 1]} ` : '') + `${q.base}^${q.exp}`).join(' ');
    assert.ok(t.includes(`${RESP[idioma]} ${final}.`), `${final} :: ${t}`);
    assert.ok(!/undefined|NaN/.test(t), t);
  }
});

test('propiedades · ejercicio 2: la explicación lleva la potencia solución', () => {
  // Con aciertos 0-9: con 0 solo salen (bᵐ)ᵏ; las cadenas, desde 3 aciertos (antes el test no las veía nunca).
  let n = 0;
  for (const idioma of IDIOMAS) for (const item of generar(rng => L.generarPotencias(rng, { aciertos: n++ % 10 }), 2, 3000)) {
    const t = plano(X.explicaPotencias(item, ctx(idioma)));
    assert.ok(t.includes(`${RESP[idioma]} ${item.base}^${item.solucion}.`), t);
    assert.ok(!/undefined|NaN/.test(t), t);
  }
});

test('propiedades · ejercicio 3: la explicación lleva la última cifra, calculada aparte', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarUltima, 3)) {
    const t = plano(X.explicaUltima(item, ctx(idioma)));
    const cifra = Number(BigInt(item.base) ** BigInt(item.exponente) % 10n);
    assert.equal(item.solucion, cifra);
    const Lc = L.ciclo(item.base);
    if (Lc === 1) assert.ok(t.includes(idioma === 'es' ? `acaban siempre en ${cifra}` : `always end in ${cifra}`), t);
    else {
      const p = L.posicionEnCiclo(item.exponente, Lc);
      assert.equal(L.ultimaCifra(item.base, p), cifra);
      assert.ok(t.includes(`${item.base}^${item.exponente} ${idioma === 'es' ? 'acaba como' : 'ends like'} ${item.base}^${p}: ${idioma === 'es' ? 'en' : 'in'} ${cifra}.`), t);
    }
    assert.ok(t.trim().endsWith(`${RESP[idioma]} ${cifra}.`), t);   // revisión 193: sin «es:», la cifra al final
    assert.ok(!t.includes(`${RESP[idioma]}:`), t);
    assert.ok(!/undefined|NaN/.test(t), t);
  }
});

// ─── Revisión 193 ─────────────────────────────────────────────────────────────

const REGLA_JUNTAR = {
  es: 'Con la misma base, al multiplicar se deja la base y se suman los exponentes, y al dividir se restan; las operaciones van de izquierda a derecha.',
  en: 'With the same base, when you multiply you keep the base and add the exponents, and when you divide you subtract them; operations go from left to right.',
};

test('propiedades · ejercicio 1: la regla de los apuntes delante, cada exponente sale de ella y la respuesta va al final', () => {
  let n = 0;
  const vistos = new Set();
  for (const idioma of IDIOMAS) for (const item of generar(rng => L.generarJuntar(rng, { aciertos: n++ % 10 }), 6, 3000)) {
    const html = X.explicaJuntar(item, ctx(idioma));
    const t = plano(html);
    assert.ok(html.startsWith(`<p>${REGLA_JUNTAR[idioma]}</p>`), t);
    // Cada «a^x · a^y = a^z» y «a^x : a^y = a^z» del texto cumple la regla (z = x + y, z = x − y)
    for (const [, b1, x, op, b2, y, b3, z] of t.matchAll(/(\d+)\^(\d+) ([·:÷]) (\d+)\^(\d+) = (\d+)\^(\d+)/g)) {
      assert.ok(b1 === b2 && b2 === b3, t);
      assert.equal(Number(z), op === '·' ? Number(x) + Number(y) : Number(x) - Number(y), t);
    }
    const quedan = L.resolver(item.terminos, item.operadores).terminos.length;
    vistos.add(quedan);
    assert.ok(/<\/strong><\/p>$/.test(html), html);   // nada detrás de la respuesta (la nota de la base ajena va antes)
    assert.equal(/bases distintas|different bases/.test(t), quedan > 1, t);
  }
  assert.deepEqual([...vistos].sort(), [1, 2]);
});

test('propiedades · ejercicio 2: la regla dice qué se hace con los exponentes, y la cuenta da la solución', () => {
  let n = 0;
  const tipos = new Set();
  for (const idioma of IDIOMAS) for (const item of generar(rng => L.generarPotencias(rng, { aciertos: n++ % 10 }), 7, 3000)) {
    const html = X.explicaPotencias(item, ctx(idioma));
    const t = plano(html);
    const conPdP = item.terminos.some(q => q.k > 1);
    tipos.add(`${item.tipo}-${conPdP}`);
    assert.ok(/se multiplican los exponentes|multiply the exponents/.test(t) === conPdP, t);
    if (item.tipo === 'cadena') {
      assert.ok(/se suman los exponentes|add the exponents/.test(t), t);
      assert.ok(/se restan|subtract them/.test(t), t);
    }
    // El exponente que se escribe en la cuenta (3 · 2 + 4 − 3) vale la solución
    const m = t.match(/= \d+\^([\d ·+−]+) = \d+\^(\d+)/);
    assert.ok(m, t);
    const valor = m[1].split(/ (?=[+−])/).reduce((s, trozo) => {
      const signo = trozo.startsWith('−') ? -1 : 1;
      const prod = trozo.replace(/^[+−] /, '').split(' · ').reduce((p, f) => p * Number(f), 1);
      return s + signo * prod;
    }, 0);
    assert.equal(valor, item.solucion, t);
    assert.equal(Number(m[2]), item.solucion, t);
    assert.equal(t.split(`${RESP[idioma]} `).length - 1, 1, t);
  }
  assert.deepEqual([...tipos].sort(), ['cadena-false', 'cadena-true', 'potencia-true']);
});

test('propiedades · ejercicio 3: la regla de la tabla va delante y cada cifra de la tabla sale de ella', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarUltima, 8, 1000)) {
    const html = X.explicaUltima(item, ctx(idioma));
    assert.ok(new RegExp(idioma === 'es' ? `^<p>No hace falta[^<]* por ${item.base} ` : `^<p>You do not need[^<]* by ${item.base} `).test(html), html);
    item.tabla.forEach((d, i) => assert.equal(d, i ? (item.tabla[i - 1] * item.base) % 10 : item.base % 10));
  }
});

test('propiedades · ejercicios 1 y 2: aunque el generador mire los aciertos, no va por pasos: con los mismos aciertos sale otro ítem', () => {
  // Tras «No lo sé» los aciertos no cambian; la base vuelve a generar si sale el mismo ítem (hasta 5 veces).
  for (const [gen, semilla] of [[L.generarJuntar, 9], [L.generarPotencias, 10]]) for (let aciertos = 0; aciertos < 10; aciertos++) {
    const rng = crearRng(semilla * 100 + aciertos);
    const distintos = new Set(Array.from({ length: 200 }, () => JSON.stringify(gen(rng, { aciertos }))));
    assert.ok(distintos.size > 100, `${gen.name} con ${aciertos} aciertos: ${distintos.size}`);
  }
});
