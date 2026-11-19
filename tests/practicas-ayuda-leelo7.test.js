// «No lo sé» en `leelo7` (tarea 226): la explicación de cada ejercicio lleva la opción que el ejercicio da por buena
// y lo que dice el ítem. 1000+ ítems por ejercicio, en los dos idiomas y en las fechas de cada paquete.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/leelo7/logica.js';
import { explicaLeelo, TX } from '../practicas/leelo7/textos.js';

const IDIOMAS = ['es', 'en'];
const FECHAS = ['2026-11-19', '2027-03-09', '2027-03-16', '2027-04-06', '2027-04-13'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const plano = h => h.replace(/<[^>]+>/g, '');
const GENERADORES = [L.generarPalabra, L.generarLeelo, L.generarConsigna, L.generarCompleta];

GENERADORES.forEach((generar, i) => {
  test(`leelo7 · ejercicio ${i + 1}: la explicación lleva la opción buena y la frase del ítem`, () => {
    const rng = crearRng(700 + i);
    for (let k = 0; k < 1250; k++) {
      const idioma = IDIOMAS[k % 2];
      const item = generar(rng, { aciertos: k % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma, fecha: FECHAS[k % FECHAS.length] });
      const buenas = item.opciones.filter(o => o.correcta);
      assert.equal(buenas.length, 1, 'una sola buena');
      for (const lang of IDIOMAS) {
        const html = explicaLeelo(i)(item, ctx(lang));
        assert.ok(html.includes(buenas[0].html ?? buenas[0].texto), `la opción buena (${buenas[0].texto})`);
        assert.ok(plano(html).includes(plano(item.solucion[lang].replace(/([»”])\.$/, '$1'))), 'lo que dice el ítem');
        assert.doesNotMatch(plano(html), /\w\/\d/, `fracción con barra — ${plano(html)}`);
        assert.ok(html.includes(TX.instrucciones[item.instruccion][lang]), 'lo que se pide');
        assert.ok(html.includes(lang === 'es' ? 'La respuesta es' : 'The answer is'));
      }
    }
  });
});

test('leelo7 · con los paquetes 1-2, la explicación tampoco habla de porcentajes, descuentos, IVA ni escalas', () => {
  const rng = crearRng(777);
  for (const fecha of ['2026-11-19', '2027-03-09']) {
    GENERADORES.forEach((generar, i) => {
      for (let k = 0; k < 400; k++) {
        const item = generar(rng, { idioma: IDIOMAS[k % 2], fecha });
        for (const lang of IDIOMAS) {
          const t = plano(explicaLeelo(i)(item, ctx(lang)));
          assert.doesNotMatch(t, /%|per cent|percent|porcent|discount|descuento|\bVAT\b|\bIVA\b|\bscale\b|escala|\bmap\b|\bmodel\b/i, `${fecha}: ${t}`);
        }
      }
    });
  }
});
