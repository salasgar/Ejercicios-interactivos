// «No lo sé» en `compara` (tarea 171): la explicación lleva la solución del ítem, calculada con la
// lógica de la práctica. 1200 ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { htmlFraccion, fraccion } from '../practicas/_comun/fracciones.js';
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
    }
  }
});

test('compara · ejercicio 2: la explicación trae una línea por fracción', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarCajas, 402)) {
      const html = L.explicaCajas(item, { idioma });
      assert.equal(html.split('<br>').length, 1 + item.fracs.length);
      for (const f of item.fracs) assert.ok(html.includes(h(f)));
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
    }
  }
});
