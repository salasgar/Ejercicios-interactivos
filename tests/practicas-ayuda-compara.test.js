// «No lo sé» en `compara` (tarea 171): la explicación lleva la solución del ítem, calculada con la
// lógica de la práctica. 1200 ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { htmlFraccion, fraccion } from '../practicas/_comun/fracciones.js';
import { mcm } from '../practicas/_comun/aritmetica.js';
import * as L from '../practicas/compara/logica.js';

const IDIOMAS = ['es', 'en'];
const h = f => htmlFraccion(fraccion(f.num, f.den), { compacta: true });
const generar = (fn, semilla, n = 1200) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };

test('compara · ejercicio 1: la explicación lleva el símbolo bueno entre las dos fracciones', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarComparar, 401)) {
      const html = L.explicaComparar(item, { idioma });
      assert.equal(L.errorComparar(item, L.simboloComparar(item)), null);
      assert.ok(html.includes(h(item.a)) && html.includes(h(item.b)), 'las dos fracciones');
      assert.ok(html.includes(L.simboloComparar(item)), 'el símbolo bueno');
      // Revisión 190: no daba la respuesta; con dos negativas decía «con denominador 20» sin las
      // equivalentes, y en el común denominador escribía «13/8 = 13/8».
      const s = L.simboloComparar(item) === '<' ? '&lt;' : '&gt;';
      assert.ok(html.endsWith(`${idioma === 'es' ? 'La respuesta es' : 'The answer is'} <strong>${s}</strong>.`));
      for (const f of [item.a, item.b]) assert.ok(!html.includes(`${h(f)} = ${h(f)}`), 'sin «X = X»');
      const ax = fraccion(Math.abs(item.a.num), item.a.den), ay = fraccion(Math.abs(item.b.num), item.b.den);
      if (item.a.num < 0 && item.b.num < 0 && ax.den !== ay.den) {
        const m = mcm(ax.den, ay.den);
        for (const f of [ax, ay]) if (f.den !== m) assert.ok(html.includes(h({ num: f.num * m / f.den, den: m })), 'las equivalentes sin el signo');
      }
    }
  }
});

test('compara · ejercicio 2: la explicación trae una línea por fracción', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarCajas, 402)) {
      const html = L.explicaCajas(item, { idioma });
      // Revisión 190: la regla hablaba de «la mitad del denominador» y las líneas doblaban el numerador;
      // ahora la regla es la de las líneas y la respuesta va caja por caja.
      const lineas = html.split('<br>');
      assert.ok(lineas[0].includes(idioma === 'es' ? 'dobla el numerador' : 'double the numerator') && !/mitad del denominador|half the denominator/.test(html));
      assert.equal(lineas.length, 1 + new Set(item.fracs.map(L.cajaDe)).size, 'regla + una línea por caja');
      for (const f of item.fracs) {
        const caja = L.cajaDe(f);
        const linea = lineas.slice(1)[L.CAJAS.filter(c => item.fracs.some(g => L.cajaDe(g) === c)).indexOf(caja)];
        assert.ok(linea.includes(h(f)), 'cada fracción en la línea de su caja');
        assert.ok(linea.includes(caja === 'mayor' ? `${f.num} &gt; ${f.den}` : `${f.num} · 2 = ${2 * f.num} ${caja === 'menor' ? '&lt;' : '&gt;'} ${f.den}`), 'con su cuenta');
      }
      assert.equal(L.fallosCajas(item, item.fracs.map(L.cajaDe)).length, 0);
    }
  }
});

test('compara · ejercicio 3: la explicación termina en la cadena en el orden bueno', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarOrden, 403)) {
      const html = L.explicaOrden(item, { idioma });
      const orden = L.ordenCorrecto(item);
      assert.equal(L.errorOrden(item, orden), null);
      const posiciones = orden.map(i => html.lastIndexOf(h(item.fracs[i])));
      assert.ok(posiciones.every((p, k) => p >= 0 && (k === 0 || p > posiciones[k - 1])), 'en el orden bueno');
      // Revisión 190: sin regla delante, «11/18 = 11/18», y el consejo de «dos negativas» con una sola.
      assert.ok(html.startsWith(idioma === 'es' ? 'Pasa todas a común denominador' : 'Write them all with a common denominator'));
      for (const f of item.fracs) assert.ok(!html.includes(`${h(f)} = ${h(f)}`), 'sin «X = X»');
      const negativas = item.fracs.filter(f => f.num < 0).length;
      assert.equal(/dos negativas|two negatives/.test(html), negativas === 2);
      assert.ok(html.includes(idioma === 'es' ? 'La respuesta es ' : 'The answer is '));
    }
  }
});

test('compara · ejercicio 4: la explicación lleva la fracción de la recta', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarRecta, 404)) {
      const html = L.explicaRecta(item, { idioma });
      assert.equal(L.errorRecta(item, L.fraccionRecta(item)), null);
      assert.ok(html.includes(h(item)), 'la fracción');
      assert.ok(html.includes(String(Math.abs(item.num))), 'los huecos');
      // Revisión 190: solo decía «está a 3 huecos del 0», sin cuántos huecos hay de un entero al siguiente,
      // hacia dónde contar ni la respuesta.
      const n = Math.abs(item.num);
      const es = idioma === 'es';
      assert.ok(html.includes(es ? `hay ${item.den} huecos iguales` : `there are ${item.den} equal gaps`));
      assert.ok(html.includes(es ? `cuenta ${n} ${n === 1 ? 'hueco' : 'huecos'} hacia la ${item.num < 0 ? 'izquierda' : 'derecha'}` : `count ${n} ${n === 1 ? 'gap' : 'gaps'} to the ${item.num < 0 ? 'left' : 'right'}`));
      assert.equal(html.includes(es ? 'llegas al 1' : 'take you to 1'), n > item.den, 'pasa del 1 solo en las impropias');
      assert.ok(html.endsWith(`${h(item)}.`));
    }
  }
});
