// «No lo sé» en `jerarquia` (tarea 187): la explicación lleva la solución que el ejercicio da por buena,
// calculada con la lógica de la práctica. 1000+ ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/jerarquia/logica.js';
import * as X from '../practicas/jerarquia/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<sup>(\d)<\/sup>/g, '^$1').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const N = 1000;
const FIN = { es: 'La respuesta es', en: 'The answer is' };

const PASOS = [
  [L.generarPasos1, X.explicaSinParentesis, 'ej. 1'],
  [L.generarPasos2, X.explicaPotenciasRaices, 'ej. 2'],
  [L.generarPasos3, X.explicaConParentesis, 'ej. 3'],
];

PASOS.forEach(([generar, explica, nombre], k) => {
  test(`${nombre}: la explicación resuelve la cuenta paso a paso y acaba en su resultado`, () => {
    const rng = crearRng(300 + k);
    for (let n = 0; n < N; n++) {
      const item = generar(rng);
      const estados = L.cadena(item.fichas);
      const resultado = L.texto(estados.at(-1).fichas);
      for (const idioma of IDIOMAS) {
        const html = explica(item, ctx(idioma));
        assert.doesNotMatch(html, /undefined|NaN|\[object|null/, plano(html));
        const cuentas = [...html.matchAll(/<span class="cuenta">(.*?)<\/span>/g)].map(m => m[1]);
        const trozos = plano(cuentas[0]).split(' = ');
        assert.equal(trozos.length, estados.length, plano(html));
        assert.equal(trozos.at(-1), resultado, plano(html));
        assert.match(plano(html), new RegExp(`${FIN[idioma]} ${resultado}\\.$`));
        assert.ok(L.esNatural(Number(resultado)), plano(html));
      }
    }
  });
});

test('ej. 4: la explicación da la línea con los paréntesis que se exigen', () => {
  const rng = crearRng(304);
  for (let n = 0; n < N; n++) {
    const item = L.generarInvisibles(rng);
    const piden = L.exigidos(item);
    for (const idioma of IDIOMAS) {
      const html = X.explicaInvisibles(item, ctx(idioma));
      assert.doesNotMatch(html, /undefined|NaN|\[object|null/, plano(html));
      const linea = L.texto(L.lineal(item, piden), idioma);
      assert.ok(plano(html).endsWith(`${FIN[idioma]} ${linea}.`), plano(html));
      assert.equal(L.esCorrecto(item, piden), true);
      const abre = (linea.match(/\(/g) ?? []).length;
      assert.equal(abre, piden.filter(Boolean).length + item.grupos.flat().filter(f => f === '(').length);
      assert.ok(L.esNatural(L.evaluar(L.lineal(item, piden))), plano(html));
    }
  }
});
