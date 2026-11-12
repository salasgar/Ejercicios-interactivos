// «No lo sé» en «Del enunciado al álgebra» (tarea 175): la explicación lleva la solución que el ejercicio da por buena.
import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import { generarElige, generarEscribe, generarFrase, generarSituacion, corregirEscribe } from '../practicas/traduce/logica.js';
import { explicaTraduce } from '../practicas/traduce/textos.js';

const IDIOMAS = ['es', 'en'];
const textosDe = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const N = 1000;

const casos = [
  ['elige', generarElige, 1],
  ['escribe', generarEscribe, 2],
  ['frase', generarFrase, 3],
  ['situaciones', generarSituacion, 4],
];

for (const [nombre, generar, semilla] of casos) {
  test(`traduce, «${nombre}»: la explicación lleva la solución de ${N} ítems en los dos idiomas`, () => {
    const rng = crearRng(semilla * 7919);
    for (let i = 0; i < N; i++) {
      const item = generar(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: 'es' });
      for (const idioma of IDIOMAS) {
        const ctx = textosDe(idioma);
        const html = explicaTraduce(item, ctx);
        const que = `${nombre} ${idioma} ${item.clave}: ${plano(html)}`;
        assert.ok(html.includes(item.solucion[idioma]), `la solución del ítem — ${que}`);
        const buena = item.opciones?.find(o => o.correcta);
        if (buena) {
          assert.equal(item.opciones.filter(o => o.correcta).length, 1, que);
          assert.ok(html.endsWith(`${buena.frases ? (idioma === 'es' ? `«${buena.frases[idioma]}»` : `“${buena.frases[idioma]}”`) : buena.html}.`), `la respuesta al final — ${que}`);
        } else {
          assert.ok(corregirEscribe(item, item.correcta).acierto, `lo que se da por bueno — ${que}`);
          assert.ok(html.endsWith(`<span class="cuenta">${item.correcta}</span>.`), `la respuesta al final — ${que}`);
        }
        assert.doesNotMatch(html, /undefined|NaN|\[object|×/, que);
      }
    }
  });
}
