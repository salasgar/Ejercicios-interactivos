// «No lo sé» en `potencias-enteros` (tarea 179): la explicación de cada ejercicio lleva la solución
// del ítem, calculada con la lógica de la práctica. Por fuerza bruta: 1000+ ítems, dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { fmt } from '../practicas/_comun/enteros.js';
import * as L from '../practicas/potencias-enteros/logica.js';
import * as X from '../practicas/potencias-enteros/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const generar = (fn, semilla, n = 1200) => {
  const rng = crearRng(semilla);
  return Array.from({ length: n }, (_, i) => fn(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] }));
};
const limpio = html => !/undefined|NaN|\[object|×|null/.test(html);

test('potencias-enteros · ejercicio 1: la explicación lleva el producto', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarProducto, 401)) {
      const html = X.explicaProducto(item, ctx(idioma));
      assert.ok(plano(html).includes(`= ${fmt(L.producto(item))}`), 'el resultado');
      assert.ok(html.includes(L.expresionProducto(item)), 'la cuenta');
      assert.ok(limpio(html));
      // Revisión 192: dice qué factores se tocan (la mitad del ejercicio), también cuando hay un 0.
      const negativos = L.posicionesNegativas(item).map(i => item.factores[i]);
      const paso1 = plano(html.split('</li>')[0]);
      if (negativos.length === 0) assert.ok(/no se toca ninguno|do not tap any/.test(paso1), 'ninguno que tocar');
      else for (const f of negativos) assert.ok(paso1.includes(`(${fmt(f)})`), 'cada negativo que se toca');
      if (idioma === 'en' && !item.factores.includes(0) && negativos.length > 0) {
        assert.ok(/odd \(impar\)|even \(par\)/.test(paso1), 'even y odd aclarados');
      }
    }
  }
});

test('potencias-enteros · ejercicio 2: la explicación lleva el valor y el signo por el exponente', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarPotencia, 402)) {
      const html = X.explicaPotencia(item, ctx(idioma));
      assert.equal(L.valorPotencia(item), item.base ** item.exp);
      assert.ok(plano(html).includes(`= ${fmt(L.valorPotencia(item))}`), 'el valor');
      assert.equal(/\b(par|even)\b/.test(plano(html)), item.exp % 2 === 0);
      assert.ok(limpio(html));
      // Revisión 192: even y odd aclarados; la respuesta lleva el botón del signo y el valor.
      if (idioma === 'en') assert.ok(/odd \(impar\)|even \(par\)/.test(plano(html)));
      const final = plano(html).split(idioma === 'es' ? 'La respuesta es' : 'The answer is')[1];
      const v = L.valorPotencia(item);
      assert.ok(final.includes(X.TX.ej2[v > 0 ? 'positivo' : 'negativo'][idioma]) && final.includes(fmt(v)), 'signo y valor');
    }
  }
});

test('potencias-enteros · ejercicio 3: la explicación lleva la base y el valor', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarBase, 403)) {
      const html = X.explicaBase(item, ctx(idioma));
      assert.ok(plano(html).includes(`= ${fmt(L.valorBase(item))}`), 'el valor');
      assert.ok(plano(html).includes(fmt(L.baseDeItem(item))), 'la base');
      assert.ok(limpio(html));
      // Revisión 192: con un menos fuera, la potencia se enseña antes de ponerle el menos.
      if (item.tipo !== 'a') {
        const b = L.baseDeItem(item);
        assert.ok(plano(html).includes(`= ${fmt(b ** item.exp)}`), 'la potencia sin el menos de fuera');
        assert.equal(-(b ** item.exp), L.valorBase(item), 'el menos de fuera cambia el signo');
      }
    }
  }
});

test('potencias-enteros · ejercicio 4: la explicación lleva los enteros, la raíz o «no existe»', () => {
  const vistos = new Set();
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarRaiz, 404)) {
      const html = X.explicaRaiz(item, ctx(idioma));
      vistos.add(item.tipo);
      if (item.tipo === 'cuadrados') {
        assert.deepEqual(L.buenasCuadrados(item), [-item.r, item.r]);
        assert.ok(plano(html).includes(`${item.r} ${idioma === 'es' ? 'y' : 'and'} −${item.r}`), 'los dos enteros');
      } else if (item.tipo === 'raiz') assert.ok(plano(html).includes(`= ${item.r}`));
      else assert.ok(/«No existe»|“Does not exist”/.test(html), 'el botón, entre comillas');
      assert.ok(limpio(html));
    }
  }
  assert.equal(vistos.size, 3);
});
