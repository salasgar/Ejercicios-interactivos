// «No lo sé» en `exponente` (tarea 187): la explicación lleva la solución que el ejercicio da por buena,
// calculada con la lógica de la práctica. 1000+ ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/exponente/logica.js';
import * as X from '../practicas/exponente/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<sup>(\d)<\/sup>/g, '^$1').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const N = 1000;
const sano = html => assert.doesNotMatch(html, /undefined|NaN|\[object|null/, plano(html));

test('ej. 1: la explicación trae la cuenta bien hecha y nombra la base correcta', () => {
  const rng = crearRng(401);
  for (let n = 0; n < N; n++) {
    const item = L.generarAlcance(rng);
    const p = item.partes[item.preguntada];
    for (const idioma of IDIOMAS) {
      const html = X.explicaAlcance(item, ctx(idioma));
      sano(html);
      const cuenta = plano(html.match(/<span class="cuenta">(.*?)<\/span>/)[1]);
      assert.equal(Number(cuenta.split(' = ').at(-1)), L.valorParte(p), cuenta);
      const base = L.idBaseDe(p.forma) === 'grupo'
        ? (idioma === 'es' ? 'todo el paréntesis' : 'the whole bracket')
        : (idioma === 'es' ? `el número ${p.b}` : `the number ${p.b}`);
      assert.ok(plano(html).endsWith(`: ${base}.`), plano(html));
    }
  }
});

test('ej. 2: la explicación de cada subtipo lleva su solución', () => {
  const rng = crearRng(402);
  const vistos = new Set();
  for (let n = 0; n < N; n++) {
    const item = L.generarMultiplicacion(rng);
    vistos.add(item.tipo);
    for (const idioma of IDIOMAS) {
      const html = X.explicaMultiplicacion(item, ctx(idioma));
      sano(html);
      const texto = plano(html);
      if (item.tipo === 'valor') {
        assert.match(texto, new RegExp(`= ${item.correcta}(?!\\d)`), texto);
        assert.ok(texto.endsWith(` ${item.correcta}.`), texto);
      } else if (item.tipo === 'repetida') {
        assert.ok(texto.endsWith(` ${L.secuenciaCorrecta(item).join(' ')}.`), texto);
        assert.ok(L.aciertaRepetida(item, L.secuenciaCorrecta(item)));
      } else {
        assert.ok(texto.endsWith(idioma === 'es' ? `base ${item.base}, exponente ${item.exponente}.` : `base ${item.base}, exponent ${item.exponente}.`), texto);
        assert.ok(L.aciertaPotencia(item, item.base, item.exponente));
      }
    }
  }
  assert.deepEqual([...vistos].sort(), ['potencia', 'repetida', 'valor']);
});

test('ej. 3: la explicación da las dos respuestas que el ejercicio da por buenas', () => {
  const rng = crearRng(403);
  for (let n = 0; n < N; n++) {
    const item = L.generarAreas(rng);
    const { pregunta1, pregunta2 } = L.respuestasAreas(item);
    for (const idioma of IDIOMAS) {
      const html = X.explicaAreas(item, ctx(idioma));
      sano(html);
      const texto = plano(html);
      const y = idioma === 'es' ? 'y' : 'and';
      assert.ok(texto.endsWith(`${pregunta1} ${y} ${pregunta2}.`), texto);
      const finales = [...html.matchAll(/<li><span class="cuenta">(.*?)<\/span><\/li>/g)].map(m => Number(plano(m[1]).split(' = ').at(-1)));
      assert.deepEqual(finales, [pregunta1, pregunta2]);
    }
  }
});
