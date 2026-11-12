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
        const dice = new RegExp(`(= |\\b(es|is) )${buena}(?!\\d)`);
        assert.match(texto, dice, `solución ${buena} — ${donde}`);
        assert.ok(!/undefined|NaN|\[object/.test(html), donde);
        assert.ok(!html.includes('×'), donde);
      }
    }
  });
}
