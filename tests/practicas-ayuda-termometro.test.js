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
      assert.doesNotMatch(html, /\b1 (marcas|marks)\b/, '«1 marca», en singular (revisión 192)');
      if (item.paso > 1) assert.ok(plano(html).includes(`${Math.abs(item.objetivo) / item.paso} mar`), 'cuántas marcas');
    }
  }
});

test('termometro · ejercicio 2: la explicación lleva la temperatura que el ejercicio da por buena', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarTemperatura, 2)) {
      const html = plano(X.explicaTemperatura(item, ctx(idioma)));
      assert.ok(html.endsWith(`${fmt(item.valor)} °C.`), `respuesta ${item.valor}`);
      if (item.paso > 1 && item.valor !== 0) assert.ok(html.includes(`${Math.abs(item.valor) / item.paso} · ${item.paso} = ${Math.abs(item.valor)}`));
      // La temperatura sale una sola vez, al final (antes se decía dos veces: «llega a −2 °C… La respuesta es −2 °C»).
      assert.equal(html.split('°C').length - 1, 1, 'el resultado, una sola vez');
      assert.doesNotMatch(html, /\b1 (marcas|marks)\b/);
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
      // Revisión 192: la regla de los negativos solo sale si hay un negativo, y la comparación no se dice dos veces.
      const hayNegativo = item.a < 0 || item.b < 0;
      assert.equal(/negativ/i.test(html), hayNegativo, 'habla de negativos solo si los hay');
      assert.doesNotMatch(html, /aunque su número|even if its number/);
      assert.doesNotMatch(html, /a la izquierda de [^.]*\. [^.]*más a la izquierda/);
      // Lo que dice el «aunque» tiene que ser verdad: el mayor sin signo es el del menor.
      const m = html.match(/(?:aunque|even though) (\d+) (?:sea menos que|is less than|sea más que|is bigger than) (\d+)/);
      if (m) assert.ok(/menos|less/.test(m[0]) ? +m[1] < +m[2] : +m[1] > +m[2], m[0]);
    }
  }
});

test('termometro · ejercicio 4: la explicación lleva la lista bien ordenada', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarOrden, 4)) {
      const html = X.explicaOrden(item, ctx(idioma));
      assert.ok(L.ordenBien(item, L.ordenCorrecto(item)));
      assert.ok(html.includes(L.cadenaOrden(item)), 'la cadena ordenada');
      // Revisión 192: el consejo sigue el sentido pedido («los negativos van antes» es falso de mayor a menor).
      assert.doesNotMatch(html, /negativos van antes|Negative numbers come before/);
      const p = plano(html);
      const iNeg = p.search(/negativ/i), iPos = p.search(/positiv/i);
      assert.ok(iNeg >= 0 && iPos >= 0);
      assert.equal(iNeg < iPos, item.creciente, 'de menor a mayor, primero los negativos; de mayor a menor, primero los positivos');
      assert.equal(/\b(el 0|then 0)\b/.test(p), item.numeros.includes(0), 'el 0, solo si está');
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
      // El «+n es lo mismo que n», con un número del ítem que lleve el más, y solo si lo hay.
      const mas = html.match(/\+(\d+) (?:es lo mismo que|is the same as) (\d+)/);
      const conMas = item.numeros.filter(n => n.mas && n.valor > 0).map(n => n.valor);
      if (conMas.length) assert.ok(mas && mas[1] === mas[2] && conMas.includes(+mas[1]), 'el +n del ítem');
      else assert.equal(mas, null, 'sin +n si el ítem no lo tiene');
    }
  }
});
