// «No lo sé» en `arbol` (tarea 184): la explicación lleva la solución que el ejercicio da por buena,
// calculada con la lógica de la práctica. 1000+ ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import { factorizar, htmlFact, esPrimo } from '../practicas/_comun/aritmetica.js';
import * as L from '../practicas/arbol/logica.js';
import * as X from '../practicas/arbol/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
const generar = (fn, semilla, n = 1200) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };

test('arbol · ejercicio 1: la explicación parte hasta los primos y lleva la factorización', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarConstruir, 1)) {
      const html = X.explicaConstruir(item, ctx(idioma));
      const f = `${item.n} = ${htmlFact(factorizar(item.n))}`;
      assert.ok(html.endsWith(`<strong>`) === false);
      assert.ok(plano(html).endsWith(`${plano(f)}.`), `${item.n}: ${plano(html)}`);
      const pasos = [...html.matchAll(/<li>/g)].length;
      assert.equal(pasos, L.numeroDeHojas(item.n) - 1, 'un paso por cada partición');
      for (const [, c, p, r] of plano(html).matchAll(/(\d+) = (\d+) · (\d+):/g)) {
        assert.equal(Number(p) * Number(r), Number(c));
        assert.ok(esPrimo(Number(p)));
      }
    }
  }
});

test('arbol · ejercicio 2: la explicación dice si está terminada y, si no, cuál es el compuesto', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarTerminada, 2)) {
      const html = plano(X.explicaTerminada(item, ctx(idioma)));
      const respuesta = idioma === 'es' ? /La respuesta es (.*)\.$/ : /The answer is (.*)\.$/;
      const dicho = html.match(respuesta)?.[1] ?? '';
      if (item.terminada) {
        assert.ok(item.igualdad.every(([b]) => esPrimo(b)));
        assert.match(dicho, idioma === 'es' ? /^Sí, está terminada$/ : /^Yes, it is finished$/);
      } else {
        assert.ok(!esPrimo(item.compuesto));
        assert.ok(dicho.endsWith(`${item.compuesto}`), `${item.n}: ${html}`);
        assert.ok(html.includes(`${item.compuesto} = `), 'la cuenta del compuesto');
      }
    }
  }
});

test('arbol · ejercicio 3: la explicación lleva las cuentas de las ramas y los números de los huecos', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarCompletar, 3, 400)) {
      const html = plano(X.explicaCompletar(item, ctx(idioma)).replace(/<\/li>/g, ' '));
      const faltan = L.solucionCompletar(item);
      assert.ok(L.esCorrectaCompletar(item, faltan));
      const fin = idioma === 'es' ? `La respuesta es ${faltan.slice(0, -1).join(', ')} y ${faltan.at(-1)}.` : `The answer is ${faltan.slice(0, -1).join(', ')} and ${faltan.at(-1)}.`;
      assert.ok(html.endsWith(fin), `${html}`);
      for (const [, c, a, b] of html.matchAll(/(\d+) = (\d+) · (\d+)/g)) assert.equal(Number(a) * Number(b), Number(c));
    }
  }
});
