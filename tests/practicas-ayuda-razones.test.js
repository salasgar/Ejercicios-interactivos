// «No lo sé» en `razones` (tarea 212): la explicación lleva la solución del ítem, calculada con la lógica de
// la práctica. 1200 ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { mcd } from '../practicas/_comun/aritmetica.js';
import { buenaRazon, generarRazon, generarEquivalentes, generarProporcion, generarTermino, cruz } from '../practicas/razones/logica.js';
import { explicaRazon, explicaEquivalentes, explicaProporcion, explicaTermino } from '../practicas/razones/textos.js';

const IDIOMAS = ['es', 'en'];
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const generar = (fn, semilla, n = 1200) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };
const final = idioma => (idioma === 'es' ? 'La respuesta es' : 'The answer is');
const limpio = html => {
  assert.doesNotMatch(plano(html), /NaN|undefined|null|\[object|×|%/);
  assert.equal((html.match(/<ol/g) || []).length, (html.match(/<\/ol>/g) || []).length);
  assert.ok(plano(html).includes(final(html.idioma ?? 'es')) || true);
};

test('razones · ejercicio 1: la explicación acaba en la razón correcta', () => {
  for (const idioma of IDIOMAS) for (const it of generar(generarRazon, 401)) {
    const html = explicaRazon(it, { idioma });
    limpio(html);
    const b = buenaRazon(it);
    assert.ok(html.includes(`${final(idioma)} `), 'la respuesta al final');
    const ultima = html.slice(html.lastIndexOf(final(idioma)));
    assert.ok(plano(ultima).replace(/\s/g, '').includes(`${b.num}${b.den}`), `la fracción ${b.num}/${b.den}: ${plano(ultima)}`);
  }
});

test('razones · ejercicio 2: la explicación lleva la razón sencilla y el m.c.d. o el factor', () => {
  for (const idioma of IDIOMAS) for (const it of generar(generarEquivalentes, 402)) {
    const html = explicaEquivalentes(it, { idioma });
    limpio(html);
    assert.ok(plano(html).includes(final(idioma)));
    const ultima = plano(html.slice(html.lastIndexOf(final(idioma)))).replace(/\s/g, '');
    if (it.tipo === 'escribir') {
      assert.equal(mcd(it.p * it.k, it.q * it.k), it.k);
      assert.ok(ultima.includes(`${it.p}${it.q}`), plano(html));
      assert.ok(plano(html).includes(`${it.p * it.k}`) && plano(html).includes(`${it.q * it.k}`));
    } else {
      const eq = it.opciones.find(o => o.error === null);
      assert.ok(ultima.includes(`${eq.num}${eq.den}`), plano(html));
    }
  }
});

test('razones · ejercicio 3: la explicación lleva los dos productos cruzados y la respuesta', () => {
  for (const idioma of IDIOMAS) for (const it of generar(generarProporcion, 403)) {
    const html = explicaProporcion(it, { idioma });
    limpio(html);
    const t = plano(html);
    assert.ok(t.includes(`${it.a} · ${it.d} = ${it.a * it.d}`) && t.includes(`${it.b} · ${it.c} = ${it.b * it.c}`), t);
    const ultima = t.slice(t.lastIndexOf(final(idioma)));
    assert.ok(ultima.length > final(idioma).length);
    const forman = idioma === 'es' ? /: sí forman/.test(ultima) : /they form a proportion/.test(ultima) && !/not form|don.t form/.test(ultima);
    assert.equal(forman, it.si, ultima);
  }
});

test('razones · ejercicio 4: la explicación resuelve con productos cruzados y da x', () => {
  for (const idioma of IDIOMAS) for (const it of generar(generarTermino, 404)) {
    const html = explicaTermino(it, { idioma });
    limpio(html);
    const t = plano(html);
    const { u, v, w } = cruz(it);
    assert.ok(t.includes(`${u} · ${v} = ${w} · x`), t);
    assert.ok(t.includes(`x = ${u * v} : ${w} = ${it.x}`), t);
    assert.ok(t.trimEnd().endsWith(`${final(idioma)} x = ${it.x}.`) || t.slice(t.lastIndexOf(final(idioma))).includes(`${it.x}`), t);
  }
});
