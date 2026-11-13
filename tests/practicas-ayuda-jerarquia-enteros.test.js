// «No lo sé» en `jerarquia-enteros` (tarea 179): la explicación lleva la solución del ítem,
// calculada con la lógica de la práctica. Por fuerza bruta: 1000+ ítems por ejercicio, dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { fmt, evaluar, analizar, pasoCanonico, pasosPosibles, aplicarPaso, cadenaDePasos } from '../practicas/_comun/enteros.js';
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
      // Revisión 192: la respuesta es la de la izquierda / la de más nivel, y nunca se cita como
      // alternativa una operación de cadena (adelantar la segunda: en 10 : 2 · (−3) : 3, «−3 : 3»).
      const arbol = L.arbolDe(item.texto);
      assert.ok(html.endsWith(`<span class="cuenta">${pasoCanonico(arbol).operacion}</span>.</p>`), 'la respuesta es el paso canónico');
      for (const p of pasosPosibles(arbol).filter(q => q.cadena)) {
        assert.ok(!html.includes(`<span class="cuenta">${p.operacion}</span>`), `no cita ${p.operacion}`);
      }
      const soloProductos = arbol.tipo === 'op' && (arbol.op === '*' || arbol.op === ':');
      assert.equal(/izquierda a derecha|left to right/.test(html), soloProductos, 'en las cadenas, de izquierda a derecha');
    }
  }
});

test('jerarquia-enteros · ejercicio 1: el caso de la tarea 179 (10 : 2 · (−3) : 3)', () => {
  const item = { texto: '10 : 2 · (−3) : 3' };
  const arbol = L.arbolDe(item.texto);
  // La lógica acepta «−3 : 3» (regla de Juan Luis del 08-10: no cambia el valor) …
  assert.deepEqual(L.primerosPasos(arbol), ['10 : 2', '−3 : 3']);
  assert.equal(evaluar(aplicarPaso(arbol, pasosPosibles(arbol)[1])), evaluar(arbol));
  // … pero la explicación solo enseña la de la izquierda.
  for (const idioma of IDIOMAS) {
    const html = X.explicaPrimero(item, ctx(idioma));
    assert.ok(!html.includes('−3 : 3'));
    assert.ok(html.includes('<span class="cuenta">10 : 2</span>'));
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
        // Revisión 192: cada paso dice su cuenta, y la cuenta es verdad.
        if (item.tipo !== 'par') {
          for (const { paso } of cadenaDePasos(item.texto).slice(1)) {
            assert.equal(evaluar(analizar(paso.operacion)), paso.valor, paso.operacion);
            assert.ok(texto.includes(`${paso.operacion} = ${fmt(paso.valor)}`), 'el paso y su valor');
          }
        }
        // Con −4³ delante, se dice que el 64 queda como −64 (antes el menos aparecía de golpe).
        if (n !== 3 && /^−\d+[²³]/.test(item.texto)) assert.ok(texto.includes('→'), 'lo que queda tras −b²');
      }
    }
  });
}

test('jerarquia-enteros · el ejercicio 3 genera cadenas y pares', () => {
  const tipos = new Set(generar(L.generarCadena, 505).map(i => i.tipo));
  assert.ok(tipos.has('par') && tipos.size >= 2);
});
