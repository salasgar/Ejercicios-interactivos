// «No lo sé» en `simplifica` (tarea 171): la explicación lleva la solución del ítem, calculada con
// la lógica de la práctica. 1200 ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { htmlFraccion, fraccion } from '../practicas/_comun/fracciones.js';
import { mcd, factorizar, mcdFact, htmlFact } from '../practicas/_comun/aritmetica.js';
import * as L from '../practicas/simplifica/logica.js';

const IDIOMAS = ['es', 'en'];
const compacta = f => htmlFraccion(f, { compacta: true });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const generar = (fn, semilla, n = 1200) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };

test('simplifica · ejercicio 1: la explicación acaba en la fracción irreducible y la cadena es la del ejercicio', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarPasos, 301)) {
      const html = L.explicaPasos(item, { idioma });
      const buena = fraccion(item.num, item.den).simplificar();
      assert.equal(L.menorDivisorComun(buena), null, 'la última ya es irreducible');
      assert.ok(html.includes(compacta(buena)), 'la irreducible');
      assert.ok(html.includes(compacta(fraccion(item.num, item.den))), 'la de partida');
      // Revisión 190: la cadena no decía entre qué se dividía en cada paso, ni daba la respuesta al final.
      assert.ok(html.endsWith(`${idioma === 'es' ? 'La respuesta es' : 'The answer is'} <span class="cuenta">${compacta(buena)}</span>.`));
      const pasos = [...html.matchAll(/<li>(?:Entre|Divide by) (\d+):/g)].map(m => Number(m[1]));
      assert.ok(pasos.length >= 1 && pasos.every(k => L.BOTONES.includes(k)), 'un paso por botón');
      assert.equal(new Set(pasos).size, pasos.length, 'las divisiones seguidas entre el mismo número, juntas');
      const g = mcd(Math.abs(item.num), item.den);
      const producto = [...html.matchAll(/<li>(?:Entre|Divide by) (\d+):(.*?)<\/li>/g)]
        .reduce((p, [, k, resto]) => p * Number(k) ** (plano(resto).split(' = ').length - 1), 1);
      assert.equal(producto, g, 'las divisiones multiplicadas dan el m.c.d.');
    }
  }
});

test('simplifica · ejercicio 2: una línea por fracción y cada una dice si es irreducible', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarIrreducibles, 302)) {
      const html = L.explicaIrreducibles(item, { idioma });
      assert.equal(html.split('<br>').length, 6, 'regla + cuatro fracciones + respuesta');
      // Revisión 190: no decía cuáles hay que marcar y el «Ojo» de los impares salía una vez por fracción.
      const ultima = html.split('<br>').at(-1);
      assert.ok(ultima.startsWith(idioma === 'es' ? 'La respuesta es ' : 'The answer is '));
      for (const i of L.irreduciblesDe(item)) assert.ok(ultima.includes(compacta(fraccion(item.fracs[i].num, item.fracs[i].den))), 'las que se marcan');
      assert.ok((html.match(/impares|odd/g) || []).length <= 1, 'el consejo, una vez');
      for (const f of item.fracs) {
        assert.ok(html.includes(compacta(fraccion(f.num, f.den))));
        if (!L.esIrreduciblePar(f)) assert.ok(html.includes(compacta(fraccion(f.num, f.den).simplificar())), 'la reducida');
      }
      assert.equal(L.errorIrreducibles(item, L.irreduciblesDe(item)), null, 'lo que da por bueno el ejercicio');
    }
  }
});

test('simplifica · ejercicio 3: la explicación lleva el m.c.d. y la irreducible', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarDeUnaVez, 303)) {
      const html = L.explicaDeUnaVez(item, { idioma });
      assert.equal(mcd(Math.abs(item.num), item.den), item.mcd);
      assert.ok(html.includes(`= ${item.mcd}`), 'el m.c.d.');
      assert.ok(html.includes(compacta(L.irreducibleDe(item))), 'la irreducible');
      // Revisión 190: el m.c.d. salía sin cómo calcularlo; ahora, por factorización, como en la unidad 2.
      const n = Math.abs(item.num), d = item.den;
      const nombre = idioma === 'es' ? 'm.c.d.' : 'GCD';
      assert.ok(html.includes(`${nombre}(${n}, ${d}) = `), 'el m.c.d. de los dos términos');
      if (item.mcd > 1) {
        assert.ok(html.includes(`${n} : ${item.mcd} = ${n / item.mcd}`) && html.includes(`${d} : ${item.mcd} = ${d / item.mcd}`));
        assert.ok(html.includes(htmlFact(mcdFact(factorizar(n), factorizar(d)))), 'los primos comunes');
      }
      assert.ok(plano(html).trim().endsWith('.') && html.includes(`${idioma === 'es' ? 'La respuesta es' : 'The answer is'} ${nombre} = ${item.mcd} y`.replace(' y', idioma === 'es' ? ' y' : ' and')), 'la respuesta al final');
      if (item.mcd === 1) assert.ok(!html.includes(`${compacta(fraccion(item.num, item.den))} = ${compacta(fraccion(item.num, item.den))}`), 'sin «7/20 = 7/20»');
      assert.equal(L.evaluarDeUnaVez(item, { mcd: item.mcd, num: Math.abs(L.irreducibleDe(item).num), den: L.irreducibleDe(item).den, negativo: L.irreducibleDe(item).num < 0 }).acierto, true);
    }
  }
});
