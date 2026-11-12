// «No lo sé» en clasificador: la explicación lleva la razón del ítem (con sus números) y la
// clase correcta, la que fija la plantilla del banco.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { generarLimpio, generarTrampa, generarJustificar, explicaClasificar, explicaJustificar } from '../practicas/clasificador/logica.js';
import { BANCO, TX } from '../practicas/clasificador/textos.js';

const IDIOMAS = ['es', 'en'];
const N = 1000;
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const NOMBRE = { mcd: { es: 'm.c.d.', en: 'GCD' }, mcm: { es: 'm.c.m.', en: 'LCM' } };

for (const [nombre, generador, explica, semilla] of [
  ['limpio', generarLimpio, explicaClasificar, 51],
  ['trampa', generarTrampa, explicaClasificar, 52],
  ['justificar', generarJustificar, explicaJustificar, 53],
]) {
  test(`clasificador, ejercicio «${nombre}»: la explicación lleva la razón del banco y la clase correcta`, () => {
    const rng = crearRng(semilla);
    for (let i = 0; i < N; i++) {
      const item = generador(rng);
      const plantilla = BANCO[item.plantilla];
      // La clase de verdad: el m.c.m. se pide cuando algo «vuelve a coincidir»; el m.c.d., cuando se parte en partes iguales.
      assert.equal(item.clase, plantilla.clase);
      for (const idioma of IDIOMAS) {
        const html = explica(item, idioma);
        const texto = plano(html);
        const donde = `${nombre} ${idioma}: ${texto}`;
        assert.ok(!/undefined|NaN|\[object|null|×/.test(html), donde);
        assert.ok(texto.includes(plano(plantilla.razon(...item.numeros)[idioma])), `lleva la razón — ${donde}`);
        for (const n of item.numeros) assert.ok(texto.includes(String(n)), `lleva el dato ${n} — ${donde}`);
        const respuesta = new RegExp(`(La respuesta es|The answer is): ${NOMBRE[item.clase][idioma].replace(/\./g, '\\.')}( |,|$)`);
        assert.match(texto, respuesta, donde);
        if (nombre === 'justificar') assert.ok(texto.includes(plano(TX.justificacion[item.solucion][idioma])), donde);
      }
    }
  });
}
