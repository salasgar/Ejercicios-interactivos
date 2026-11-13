// «No lo sé» en `simplifica` (tarea 171): la explicación lleva la solución del ítem, calculada con
// la lógica de la práctica. 1200 ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { htmlFraccion, fraccion } from '../practicas/_comun/fracciones.js';
import { mcd } from '../practicas/_comun/aritmetica.js';
import * as L from '../practicas/simplifica/logica.js';

const IDIOMAS = ['es', 'en'];
const compacta = f => htmlFraccion(f, { compacta: true });
const generar = (fn, semilla, n = 1200) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };

test('simplifica · ejercicio 1: la explicación acaba en la fracción irreducible y la cadena es la del ejercicio', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarPasos, 301)) {
      const html = L.explicaPasos(item, { idioma });
      const buena = fraccion(item.num, item.den).simplificar();
      assert.equal(L.menorDivisorComun(buena), null, 'la última ya es irreducible');
      assert.ok(html.includes(compacta(buena)), 'la irreducible');
      assert.ok(html.includes(compacta(fraccion(item.num, item.den))), 'la de partida');
    }
  }
});

test('simplifica · ejercicio 2: una línea por fracción y cada una dice si es irreducible', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarIrreducibles, 302)) {
      const html = L.explicaIrreducibles(item, { idioma });
      assert.equal(html.split('<br>').length, 5, 'regla + cuatro fracciones');
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
      assert.equal(L.evaluarDeUnaVez(item, { mcd: item.mcd, num: Math.abs(L.irreducibleDe(item).num), den: L.irreducibleDe(item).den, negativo: L.irreducibleDe(item).num < 0 }).acierto, true);
    }
  }
});
