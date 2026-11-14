// «No lo sé» en venn: cada explicación lleva la descomposición de los dos números y la
// solución del ítem, calculada aquí por fuerza bruta (no con las funciones de la práctica).

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { generarVenn, generarMcd, generarMcm, generarMezcla, explicaVenn, explicaReglas } from '../practicas/venn/logica.js';

const IDIOMAS = ['es', 'en'];
const N = 1000;
const plano = html => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');

const mcdBruto = (a, b) => { for (let d = Math.min(a, b); d >= 1; d--) if (a % d === 0 && b % d === 0) return d; };
const mcmBruto = (a, b) => { for (let m = Math.max(a, b); ; m += Math.max(a, b)) if (m % a === 0 && m % b === 0) return m; };

const casos = [
  ['venn', generarVenn, explicaVenn, 5],
  ['mcd', generarMcd, explicaReglas, 6],
  ['mcm', generarMcm, explicaReglas, 7],
  ['mezcla', generarMezcla, explicaReglas, 8],
];

for (const [nombre, generador, explica, semilla] of casos) {
  test(`venn, ejercicio «${nombre}»: la explicación descompone los dos números y lleva la solución`, () => {
    const rng = crearRng(semilla);
    for (let i = 0; i < N; i++) {
      const item = generador(rng);
      const { a, b } = item;
      const buena = item.pide === 'mcd' ? mcdBruto(a, b) : mcmBruto(a, b);
      for (const idioma of IDIOMAS) {
        const html = explica(item, idioma);
        const texto = plano(html);
        const donde = `${nombre} ${a},${b} ${idioma}: ${texto}`;
        assert.ok(texto.includes(`${a} = `) && texto.includes(`${b} = `), `descomposición — ${donde}`);
        // El m.c.d. 1 (sin primos comunes) se dice con palabras: «el m.c.d. es 1».
        // En el Venn lo que se contesta es la colocación de las fichas (lo prueba el test de más abajo).
        const dice = new RegExp(`(= |\\b(es|is) )${buena}(?!\\d)`);
        if (nombre !== 'venn') assert.match(texto, dice, `solución ${buena} — ${donde}`);
        assert.ok(!/undefined|NaN|\[object/.test(html), donde);
        assert.ok(!html.includes('×'), donde);
        // Revisión 193: sin dos puntos entre «es» y la respuesta, y la respuesta una sola vez.
        assert.ok(!/(La respuesta es|The answer is):/.test(texto), `dos puntos tras «es» — ${donde}`);
        assert.equal(texto.split(/La respuesta es|The answer is/).length, 2, `una sola respuesta — ${donde}`);
        assert.ok((texto.match(/Consejo:|Tip:|Fíjate:|Notice:/g) ?? []).length <= 1, `como mucho un consejo — ${donde}`);
      }
    }
  });
}

// Por fuerza bruta: los exponentes de p en n.
const exp = (n, p) => { let e = 0; while (n % p === 0) { n /= p; e++; } return e; };
const primosDe = n => [2, 3, 5, 7, 11, 13].filter(p => n % p === 0);
const fichas = (n, quitar) => primosDe(n).flatMap(p => Array(exp(n, p) - (quitar[p] ?? 0)).fill(p));
const enLista = (xs, y) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ${y} ${xs.at(-1)}`);

test('venn, ejercicio 1 (revisión 193): la respuesta es dónde va cada ficha, no el m.c.d.', () => {
  const rng = crearRng(9);
  for (let i = 0; i < N; i++) {
    const item = generarVenn(rng);
    const { a, b } = item;
    const comun = {};
    for (const p of primosDe(a)) if (b % p === 0) comun[p] = Math.min(exp(a, p), exp(b, p));
    for (const [idioma, y, pareja, nada, solo] of [
      ['es', 'y', (n, p) => `${n} ${n === 1 ? 'pareja' : 'parejas'} de ${p}`, 'nada', n => `«solo ${n}»`],
      ['en', 'and', (n, p) => `${n} ${n === 1 ? 'pair' : 'pairs'} of ${p}`, 'nothing', n => `“only ${n}”`],
    ]) {
      const texto = plano(explicaVenn(item, idioma));
      const centro = Object.keys(comun).length ? enLista(Object.entries(comun).map(([p, n]) => pareja(n, p)), y) : nada;
      const lado = n => enLista(fichas(n, comun), y) || nada;
      const esperado = idioma === 'es'
        ? `La respuesta es esta: en el centro, ${centro}; en ${solo(a)}, ${lado(a)}; en ${solo(b)}, ${lado(b)}.`
        : `The answer is this: in the middle, ${centro}; in ${solo(a)}, ${lado(a)}; in ${solo(b)}, ${lado(b)}.`;
      assert.ok(texto.includes(esperado), `${esperado} — ${texto}`);
    }
  }
});

test('venn, ejercicios 2-4 (revisión 193): la regla se aplica con los primos del ítem, sin repetirse al final', () => {
  for (const [generador, semilla] of [[generarMcd, 10], [generarMcm, 11], [generarMezcla, 12]]) {
    const rng = crearRng(semilla);
    for (let i = 0; i < N; i++) {
      const item = generador(rng);
      const { a, b } = item;
      const primos = [...new Set([...primosDe(a), ...primosDe(b)])].sort((p, q) => p - q);
      const elegidos = primos
        .map(p => [p, item.pide === 'mcd' ? Math.min(exp(a, p), exp(b, p)) : Math.max(exp(a, p), exp(b, p))])
        .filter(([, e]) => e > 0)
        .map(([p, e]) => (e === 1 ? `${p}` : `${p}${e}`));
      for (const [idioma, y] of [['es', 'y'], ['en', 'and']]) {
        const texto = plano(explicaReglas(item, idioma));
        if (elegidos.length) assert.ok(texto.includes(`exponente: ${enLista(elegidos, y)}.`) || texto.includes(`power: ${enLista(elegidos, y)}.`), `${elegidos} — ${texto}`);
        else assert.ok(/no tienen ninguno|have none/.test(texto) && /= 1\./.test(texto), texto);
        assert.ok(!/\((los primos comunes|todos los primos|the common prime|all the prime)/.test(texto), `la regla repetida al final — ${texto}`);
      }
    }
  }
});
