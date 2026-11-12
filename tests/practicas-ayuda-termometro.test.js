// «No lo sé» en `termometro` (tarea 178): la explicación de cada ejercicio lleva la solución del ítem,
// calculada con la lógica de la práctica. 1000+ ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { fmt } from '../practicas/_comun/enteros.js';
import * as L from '../practicas/termometro/logica.js';
import * as X from '../practicas/termometro/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const generar = (fn, semilla, n = 1200) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };

test('termometro · ejercicio 1: la explicación nombra el entero que hay que tocar', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarColoca, 1)) {
      const html = X.explicaColoca(item, ctx(idioma));
      assert.ok(plano(html).includes(`${fmt(item.objetivo)}.`), 'la respuesta');
      assert.ok(plano(html).includes(`${Math.abs(item.objetivo)} `), 'la distancia al 0');
    }
  }
});

test('termometro · ejercicio 2: la explicación lleva la temperatura que el ejercicio da por buena', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarTemperatura, 2)) {
      const html = plano(X.explicaTemperatura(item, ctx(idioma)));
      assert.ok(html.endsWith(`${fmt(item.valor)} °C.`), `respuesta ${item.valor}`);
      if (item.paso > 1 && item.valor !== 0) assert.ok(html.includes(`${Math.abs(item.valor) / item.paso} · ${item.paso} = ${Math.abs(item.valor)}`));
    }
  }
});

test('termometro · ejercicio 3: la explicación lleva el símbolo que el ejercicio da por bueno', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarComparar, 3)) {
      const html = plano(X.explicaComparar(item, ctx(idioma)));
      const simbolo = L.simbolo(item) === '<' ? '&lt;' : '&gt;';
      assert.equal(L.errorComparar(item, L.simbolo(item)), null);
      assert.ok(html.endsWith(`${fmt(item.a)} ${simbolo} ${fmt(item.b)} .`), `${item.a} ${simbolo} ${item.b}`);
    }
  }
});

test('termometro · ejercicio 4: la explicación lleva la lista bien ordenada', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarOrden, 4)) {
      const html = X.explicaOrden(item, ctx(idioma));
      assert.ok(L.ordenBien(item, L.ordenCorrecto(item)));
      assert.ok(html.includes(L.cadenaOrden(item)), 'la cadena ordenada');
    }
  }
});

test('termometro · ejercicio 5: la explicación reparte cada número en su caja', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarClases, 5)) {
      const html = X.explicaClases(item, ctx(idioma));
      const filas = [...html.matchAll(/<li>[^<]*: <span class="cuenta">([^<]*)<\/span><\/li>/g)].map(m => m[1].split(', ').filter(Boolean));
      assert.equal(filas.length, 3);
      assert.equal(filas.flat().length, item.numeros.length, 'ningún número se pierde ni se repite');
      ['positivo', 'negativo', 'ninguno'].forEach((caja, k) => {
        assert.deepEqual(filas[k], item.numeros.filter(n => L.cajaDe(n.valor) === caja).map(L.escribe));
      });
    }
  }
});
