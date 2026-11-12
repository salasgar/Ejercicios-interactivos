// «No lo sé» en leelo3: la explicación de cada ítem trae el consejo de su tipo, la explicación
// del ítem y acaba con la opción que el ejercicio da por buena.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/leelo3/logica.js';
import * as X from '../practicas/leelo3/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const N = 1000;
const EJERCICIOS = [['1', L.generarEnteros], ['2', L.generarOperaciones], ['3', L.generarPotencias], ['4', L.generarPalabras]];

for (const [n, generar] of EJERCICIOS) {
  test(`ej. ${n}: la explicación acaba con la opción correcta y lleva la explicación del ítem`, () => {
    const rng = crearRng(100 + Number(n));
    const instrucciones = new Set();
    for (let i = 0; i < N; i++) {
      const item = generar(rng);
      instrucciones.add(item.instruccion);
      assert.equal(item.opciones.filter(o => o.correcta).length, 1);
      const buena = item.opciones.find(o => o.correcta);
      for (const idioma of IDIOMAS) {
        const html = X.explicaElegir(item, ctx(idioma));
        const donde = `ej${n} ${idioma}: ${plano(html)}`;
        assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, donde);
        assert.ok(html.includes(item.solucion[idioma]), `${donde}: falta la explicación del ítem`);
        const [abre, cierra] = idioma === 'es' ? ['«', '»'] : ['“', '”'];
        const fin = `${idioma === 'es' ? 'La respuesta es' : 'The answer is'} <span class="cuenta">${abre}${buena.html ?? buena.texto}${cierra}</span>.`;
        assert.ok(html.endsWith(fin), donde);
      }
    }
    assert.ok(instrucciones.size >= 1);
  });
}
