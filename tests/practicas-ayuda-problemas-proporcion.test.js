// «No lo sé» en `problemas-proporcion` (PU2 tarea 224): cada explicación lleva la solución del ítem calculada con
// `logica.js`, en los dos idiomas y sin restos.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { declaracionDe } from '../practicas/_comun/base.js';
import * as X from '../practicas/problemas-proporcion/textos.js';

const IDIOMAS = ['es', 'en'];
const N = 1000;
const textosDe = idioma => ({ idioma, t: T[idioma], tt: o => o[idioma], esc: x => x });
const blanco = x => x.replace(/[\s  ]+/g, ' ').trim();
const plano = html => blanco(html.replace(/<[^>]+>/g, ' '));
const practica = await declaracionDe(CATALOGO.find(f => f.slug === 'problemas-proporcion'));
const [ej1, ej4, ej5] = practica.ejercicios;
const items = (def, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, (_, i) => def.generar(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] }));
};
function sana(html, donde) {
  assert.equal(typeof html, 'string', donde);
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, `${donde}: ${plano(html)}`);
  assert.doesNotMatch(plano(html), /: [A-ZÁÉÍÓÚÑ]/, `mayúscula tras «:» — ${donde}: ${plano(html)}`);
  assert.doesNotMatch(plano(html), / · [A-ZÁÉÍÓÚÑ]/, `«·» separando frases — ${donde}`);
}

test('ej. 1: la explicación nombra el tipo bueno', () => {
  for (const idioma of IDIOMAS) for (const item of items(ej1, 51)) {
    const html = ej1.explicacion(item, textosDe(idioma));
    sana(html, `ej1 ${idioma}`);
    assert.ok(plano(html).includes(blanco(X.TIPO[item.tipo][idioma])));
  }
});

test('ej. 4: la explicación lleva los dos precios por unidad y la conclusión', () => {
  for (const idioma of IDIOMAS) for (const item of items(ej4, 54)) {
    const html = ej4.explicacion(item, textosDe(idioma));
    sana(html, `ej4 ${idioma}`);
    for (const paso of X.pasosOferta(item, idioma)) assert.ok(plano(html).includes(blanco(paso)), paso);
    if (item.buena === 2) assert.match(plano(html), idioma === 'es' ? /cuestan lo mismo/ : /cost the same/);
    else assert.match(plano(html), idioma === 'es' ? /es menos que/ : /is less than/);
  }
});

test('ej. 5: la explicación lleva la respuesta buena (con su unidad) y la cuenta', () => {
  for (const idioma of IDIOMAS) for (const item of items(ej5, 55)) {
    const html = ej5.explicacion(item, textosDe(idioma));
    sana(html, `ej5 ${idioma}`);
    if (item.motivo !== 'ok') assert.ok(plano(html).includes(blanco(X.respuestaBuena(item, idioma))), `${X.respuestaBuena(item, idioma)} — ${plano(html)}`);
    if (item.motivo !== 'ok' || item.kind !== 'redondeo') assert.ok(html.includes('<li>'), 'lleva la cuenta');
  }
});
