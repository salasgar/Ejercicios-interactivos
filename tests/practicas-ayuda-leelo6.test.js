// «No lo sé» en `leelo6` (tarea 177): la explicación de cada ejercicio lleva la opción que el
// ejercicio da por buena y lo que dice el ítem. 1000+ ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/leelo6/logica.js';
import { explicaLeelo, TX } from '../practicas/leelo6/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const GENERADORES = [L.generarPalabra, L.generarLeelo, L.generarConsigna, L.generarCompleta];

GENERADORES.forEach((generar, i) => {
  test(`leelo6 · ejercicio ${i + 1}: la explicación lleva la opción buena y la frase del ítem`, () => {
    const rng = crearRng(600 + i);
    for (let k = 0; k < 1200; k++) {
      const idioma = IDIOMAS[k % 2];
      const item = generar(rng, { aciertos: k % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma });
      const buenas = item.opciones.filter(o => o.correcta);
      assert.equal(buenas.length, 1, 'una sola buena');
      for (const lang of IDIOMAS) {
        const html = explicaLeelo(i)(item, ctx(lang));
        assert.ok(html.includes(buenas[0].html ?? buenas[0].texto), `la opción buena (${buenas[0].texto})`);
        assert.ok(html.includes(item.solucion[lang].replace(/([»”])\.$/, '$1')), 'lo que dice el ítem');
        assert.ok(html.includes(TX.instrucciones[item.instruccion][lang]), 'lo que se pide');
        assert.ok(html.includes(lang === 'es' ? 'La respuesta es' : 'The answer is'));
      }
    }
  });
});
