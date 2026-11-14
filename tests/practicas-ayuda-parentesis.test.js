// «No lo sé» en `parentesis` (tarea 187): la explicación lleva la solución que el ejercicio da por buena,
// calculada con la lógica de la práctica. 1000+ ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/parentesis/logica.js';
import * as X from '../practicas/parentesis/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<sup>(\d)<\/sup>/g, '^$1').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const N = 1000;
const items = (ejercicio, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, () => L.generar(ejercicio, rng));
};
const FIN = { es: 'La respuesta es', en: 'The answer is' };
const EXPLICA = [X.explicaTres, X.explicaPotencia, X.explicaImposibles, X.explicaDiana];
/** El texto interno (ASCII) de una cuenta pintada: «·» → «*», «−» → «-», «:»/«÷» → «/». */
const interno = s => s.replace(/·/g, '*').replace(/−/g, '-').replace(/ [:÷] /g, ' / ');
const quieto = s => s.replace(/\s+/g, '');

/** El valor de una expresión con paréntesis (texto interno), por el evaluador de la práctica. */
function valorDe(texto, item) {
  const e = L.expresionDe(item);
  const nums = texto.match(/\d+/g).map(Number);
  // Se reconstruye la colocación: cada número lleva los «(» de antes y los «)» de después.
  const abre = [], cierra = [];
  const partes = texto.replace(/\^\d/, '').match(/\(*\d+\)*/g);
  partes.forEach(p => { abre.push((p.match(/^\(*/)[0]).length); cierra.push((p.match(/\)*$/)[0]).length); });
  assert.deepEqual(nums.slice(0, e.numeros.length), e.numeros, texto);
  const r = L.interpretar(e, { abre, cierra });
  assert.ok(!r.error, texto);
  return L.evaluar(r.arbol).valor;
}

for (const [k, nombre] of [[1, 'ej. 1'], [2, 'ej. 2'], [3, 'ej. 3']]) {
  test(`${nombre}: la explicación trae todos los resultados del ítem, cada uno con una cuenta que da ese valor`, () => {
    for (const item of items(k, 100 + k)) {
      for (const idioma of IDIOMAS) {
        const html = EXPLICA[k - 1](item, ctx(idioma));
        assert.doesNotMatch(html, /undefined|NaN|\[object|null/, plano(html));
        const filas = [...html.matchAll(/<li><span class="cuenta">(.*?)<\/span><\/li>/g)].map(m => m[1]);
        assert.equal(filas.length, item.resultados.length, plano(html));
        filas.forEach((f, i) => {
          const trozos = plano(f).split(' = ').map(interno);
          assert.equal(Number(trozos.at(-1)), item.resultados[i], plano(f));
          assert.equal(valorDe(trozos[0].replace(/\^/g, '^'), item), item.resultados[i], plano(f));
        });
        const fin = html.match(new RegExp(`${FIN[idioma]} (.*)\\.</p>$`));
        assert.ok(fin, `no acaba con la respuesta — ${plano(html)}`);
        assert.deepEqual([...fin[1].matchAll(/<span class="cuenta">(\d+)<\/span>/g)].map(m => Number(m[1])), item.resultados);
      }
    }
  });
}

test('ej. 3: la explicación avisa de que las agrupaciones imposibles no cuentan', () => {
  for (const item of items(3, 7)) {
    assert.match(X.explicaImposibles(item, ctx('es')), /no se pueden calcular/);
    assert.match(X.explicaImposibles(item, ctx('en')), /cannot be worked out/);
  }
});

test('ej. 4: la respuesta es una colocación que da el objetivo y la cadena acaba en él', () => {
  for (const item of items(4, 104)) {
    for (const idioma of IDIOMAS) {
      const html = X.explicaDiana(item, ctx(idioma));
      assert.doesNotMatch(html, /undefined|NaN|\[object|null/, plano(html));
      const fin = html.match(new RegExp(`${FIN[idioma]} <span class="cuenta">(.*?)</span>\\.</p>$`));
      assert.ok(fin, `no acaba con la respuesta — ${plano(html)}`);
      assert.equal(valorDe(interno(plano(fin[1])), item), item.objetivo, plano(html));
      const cadena = html.match(/<p><span class="cuenta">(.*?)<\/span><\/p>/)[1];
      const trozos = plano(cadena).split(' = ').map(interno);
      assert.equal(Number(trozos.at(-1)), item.objetivo);
      assert.equal(quieto(trozos[0]), quieto(interno(plano(fin[1]))), 'la cadena empieza por la colocación de la respuesta');
    }
  }
});
