// «No lo sé» de leelo5 (tarea 173): cada explicación lleva la explicación del ítem y su respuesta buena.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import * as L from '../practicas/leelo5/logica.js';
import { explicaPalabra, explicaLeelo, explicaConsigna, explicaCompleta, opcionBuena } from '../practicas/leelo5/ayuda.js';

const IDIOMAS = ['es', 'en'];
const textosDe = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

for (const [nombre, generar, explica, semilla] of [
  ['palabra', L.generarPalabra, explicaPalabra, 1],
  ['leelo', L.generarLeelo, explicaLeelo, 2],
  ['consigna', L.generarConsigna, explicaConsigna, 3],
  ['completa', L.generarCompleta, explicaCompleta, 4],
]) {
  test(`leelo5 · ${nombre}: la explicación lleva la del ítem y la opción buena`, () => {
    const rng = crearRng(semilla);
    for (let i = 0; i < 1000; i++) {
      const idioma = IDIOMAS[i % 2];
      const item = generar(rng, { aciertos: i % 10, idioma });
      assert.equal(item.opciones.filter(o => o.correcta).length, 1);
      for (const idi of IDIOMAS) {
        const html = explica(item, textosDe(idi));
        assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, plano(html));
        assert.ok(html.includes(item.solucion[idi]), `${nombre} ${idi}: la explicación del ítem`);
        assert.ok(html.includes(`${opcionBuena(item)}.</strong>`), `${nombre} ${idi}: la respuesta buena`);
        assert.notEqual(explica(item, textosDe('es')), explica(item, textosDe('en')));
      }
    }
  });
}
