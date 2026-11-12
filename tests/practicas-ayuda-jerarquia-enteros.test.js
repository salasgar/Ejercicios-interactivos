// «No lo sé» en `jerarquia-enteros` (tarea 179): la explicación lleva la solución del ítem,
// calculada con la lógica de la práctica. Por fuerza bruta: 1000+ ítems por ejercicio, dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { fmt, evaluar, analizar } from '../practicas/_comun/enteros.js';
import * as L from '../practicas/jerarquia-enteros/logica.js';
import * as X from '../practicas/jerarquia-enteros/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const generar = (fn, semilla, n = 1200) => {
  const rng = crearRng(semilla);
  return Array.from({ length: n }, (_, i) => fn(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] }));
};
const limpio = html => !/undefined|NaN|\[object|×|null/.test(html);

test('jerarquia-enteros · ejercicio 1: la explicación dice una operación que de verdad puede ir primero', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarPrimero, 501)) {
      const html = X.explicaPrimero(item, ctx(idioma));
      const posibles = L.primerosPasos(L.arbolDe(item.texto));
      assert.ok(posibles.some(p => html.includes(`<span class="cuenta">${p}</span>.</p>`)), 'la respuesta es una de las buenas');
      assert.ok(limpio(html));
    }
  }
});

for (const [n, gen, semilla] of [[2, L.generarMezcla, 502], [3, L.generarCadena, 503], [4, L.generarCombinada, 504]]) {
  test(`jerarquia-enteros · ejercicio ${n}: la explicación lleva el valor final`, () => {
    for (const idioma of IDIOMAS) {
      for (const item of generar(gen, semilla)) {
        const html = X.explicaCadena(item, ctx(idioma));
        const valores = item.tipo === 'par' ? L.valoresDelPar(item) : [evaluar(analizar(item.texto))];
        for (const v of valores) assert.ok(plano(html).includes(`${fmt(v)}`), 'el valor final');
        const texto = plano(html);
        assert.ok(texto.includes(idioma === 'es' ? 'La respuesta es' : 'The answer is'));
        assert.ok(limpio(html));
      }
    }
  });
}

test('jerarquia-enteros · el ejercicio 3 genera cadenas y pares', () => {
  const tipos = new Set(generar(L.generarCadena, 505).map(i => i.tipo));
  assert.ok(tipos.has('par') && tipos.size >= 2);
});
