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
        // La razón del banco, sin su flecha final (revisión 193: la respuesta va una sola vez, al final).
        const razon = plano(plantilla.razon(...item.numeros)[idioma]).replace(/ → \S+$/, '').replace(/[«»“”]/g, '').slice(1);
        assert.ok(texto.replace(/[«»“”]/g, '').includes(razon), `lleva la razón — ${donde}`);
        assert.ok(!texto.includes('→'), `sin la flecha de la respuesta — ${donde}`);
        for (const n of item.numeros) assert.ok(texto.includes(String(n)), `lleva el dato ${n} — ${donde}`);
        assert.ok(!/(La respuesta es|The answer is):/.test(texto), `dos puntos tras «es» — ${donde}`);
        if (idioma === 'en') assert.ok(!/[«»]/.test(texto), `comillas «» en inglés — ${donde}`);
        assert.match(texto, /^ ?[«“]?\p{Lu}/u, `mayúscula al empezar — ${donde}`);
        const seguido = html.replace(/<[^>]+>/g, '');
        if (nombre === 'justificar') {
          // Lo que se elige es la razón: la respuesta es el texto de esa opción, entre comillas.
          const opcion = TX.justificacion[item.solucion][idioma];
          assert.ok(seguido.includes(idioma === 'es' ? `La respuesta es «${opcion}».` : `The answer is “${opcion}”.`), donde);
        } else {
          const n = NOMBRE[item.clase][idioma];
          assert.ok(seguido.includes(`${idioma === 'es' ? 'La respuesta es' : 'The answer is'} ${n}${n.endsWith('.') ? '' : '.'}`), donde);
          assert.ok(!seguido.includes(`${n}..`), donde);
        }
        // El consejo tiene que valer también en las trampas: «repartir en partes iguales» no siempre es m.c.d.
        assert.ok(!/se reparte o se corta en partes iguales \(m\.c\.d\.\)|shared or cut into equal parts \(GCD\)/.test(texto), donde);
      }
    }
  });
}
