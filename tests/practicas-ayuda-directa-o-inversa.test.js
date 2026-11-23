// «No lo sé» en `directa-o-inversa` (PU2 tarea 216): cada explicación lleva la solución del ítem, en los dos idiomas,
// sin restos y acabada en «La respuesta es …» / «The answer is …».

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { declaracionDe } from '../practicas/_comun/base.js';
import * as L from '../practicas/directa-o-inversa/logica.js';
import * as X from '../practicas/directa-o-inversa/textos.js';

const IDIOMAS = ['es', 'en'];
const N = 1000;
const textosDe = idioma => ({ idioma, t: T[idioma], tt: o => o[idioma], esc: x => x });
const blanco = x => x.replace(/[\s  ]+/g, ' ').trim();
const plano = html => blanco(html.replace(/<[^>]+>/g, ' ')).replace(/ \./g, '.');
const practica = await declaracionDe(CATALOGO.find(f => f.slug === 'directa-o-inversa'));
const [ej1, ej2, ej3] = practica.ejercicios;
const items = (def, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, (_, i) => def.generar(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] }));
};
function sana(html, donde) {
  assert.equal(typeof html, 'string', donde);
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×|%/, `${donde}: ${plano(html)}`);
  assert.doesNotMatch(plano(html), /: [A-ZÁÉÍÓÚÑ]/, `mayúscula tras «:» — ${donde}: ${plano(html)}`);
  assert.doesNotMatch(plano(html), / · [A-ZÁÉÍÓÚÑ]/, `«·» separando frases — ${donde}: ${plano(html)}`);
}
const fin = idioma => (idioma === 'es' ? /La respuesta es/ : /The answer is/);

test('directa-o-inversa · ej. 1: la explicación lleva los dos pares y la clase', () => {
  for (const idioma of IDIOMAS) for (const item of items(ej1, 171)) {
    const html = ej1.explicacion(item, textosDe(idioma));
    sana(html, `ej1 ${idioma}`);
    const s = L.situacionDe(item.id);
    for (const v of [s.par[1], s.par[3]]) assert.ok(plano(html).includes(String(v)), `${v} — ${plano(html)}`);
    assert.match(plano(html), fin(idioma));
    assert.ok(plano(html).endsWith(X.CLASE ? (idioma === 'es' ? { directa: 'directa.', inversa: 'inversa.', ninguna: 'ninguna de las dos.' } : { directa: 'direct.', inversa: 'inverse.', ninguna: 'neither.' })[item.clase] : ''), plano(html));
  }
});

test('directa-o-inversa · ej. 2: la explicación lleva los cálculos de la tabla y la clase', () => {
  for (const idioma of IDIOMAS) for (const item of items(ej2, 172)) {
    const html = ej2.explicacion(item, textosDe(idioma));
    sana(html, `ej2 ${idioma}`);
    assert.match(plano(html), fin(idioma));
    const marca = item.clase === 'directa' ? ' : ' : ' · ';
    assert.ok(plano(html).includes(`${item.xs[0]}${marca}`) || plano(html).includes(`${item.ys[0]}${marca}`), plano(html));
    assert.equal((html.match(/<li>/g) ?? []).length >= 3, true, plano(html));
  }
});

test('directa-o-inversa · ej. 3: la explicación acaba con la cuenta buena y su resultado', () => {
  for (const idioma of IDIOMAS) for (const item of items(ej3, 173)) {
    const html = ej3.explicacion(item, textosDe(idioma));
    sana(html, `ej3 ${idioma}`);
    const cuenta = X.cuentaTexto(item, 'buena', idioma);
    assert.ok(plano(html).includes(cuenta), `${cuenta} — ${plano(html)}`);
    assert.match(plano(html), fin(idioma));
    assert.ok(plano(html).endsWith(`${cuenta}.`), plano(html));
  }
});
