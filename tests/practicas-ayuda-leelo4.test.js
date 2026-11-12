// «No lo sé» en leelo4 (tarea 172): cada explicación lleva la solución del ítem (las cinco parejas, la
// opción buena, la cuenta que dice la frase), en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/leelo4/logica.js';
import * as X from '../practicas/leelo4/textos.js';

const IDIOMAS = ['es', 'en'];
const textosDe = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => String(x) });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const N = 1000;
const items = (generar, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, (_, i) => generar(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] }));
};
const sano = (html, donde) => {
  assert.equal(typeof html, 'string', donde);
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, `${donde}: ${plano(html)}`);
};

test('leelo4, ejercicio 1: la explicación lista las cinco parejas', () => {
  for (const idioma of IDIOMAS) for (const item of items(L.generarEmparejar, 1)) {
    const html = X.explicaEmparejar(item, textosDe(idioma));
    sano(html, `emparejar ${idioma}`);
    assert.equal((html.match(/<li>/g) ?? []).length, L.PAREJAS_POR_ITEM);
    for (const id of item.en) {
      assert.ok(html.includes(L.terminoDe(id).en) && html.includes(L.terminoDe(id).es), `${id}: ${plano(html)}`);
    }
  }
});

for (const [n, generar, semilla] of [[2, L.generarLectura, 2], [3, L.generarQuePide, 3]]) {
  test(`leelo4, ejercicio ${n}: la explicación lleva la opción buena y la solución del ítem`, () => {
    for (const idioma of IDIOMAS) for (const item of items(generar, semilla)) {
      const ctx = textosDe(idioma);
      const html = X.explicaElegir(item, ctx);
      sano(html, `elegir ${n} ${idioma}`);
      const buenas = item.opciones.filter(o => o.correcta);
      assert.equal(buenas.length, 1, 'una sola opción buena');
      assert.ok(html.includes(buenas[0].html ?? buenas[0].texto), plano(html));
      assert.ok(html.includes(item.solucion[idioma]), plano(html));
    }
  });
}

test('leelo4, ejercicio 4: la explicación lleva la cuenta que dice la frase', () => {
  for (const idioma of IDIOMAS) for (const item of items(L.generarDictado, 4)) {
    const html = X.explicaDictado(item, textosDe(idioma));
    sano(html, `dictado ${idioma}`);
    assert.ok(html.includes(L.cuentaDelItem(item)), plano(html));
  }
});
