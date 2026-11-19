// «No lo sé» en `regla-de-tres` (PU2 tarea 214): cada explicación lleva la solución del ítem calculada con
// `logica.js`, en los dos idiomas, sin restos y acabada en «La respuesta es …» (ej. 1 y 3) o «x = …» (ej. 2 y 4).

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { declaracionDe } from '../practicas/_comun/base.js';
import { fraccion } from '../practicas/_comun/fracciones.js';
import { aTexto } from '../practicas/_comun/proporcion.js';
import * as L from '../practicas/regla-de-tres/logica.js';

const val = s => { const [n, d] = s.split('/').map(Number); return fraccion(n, d); };
const IDIOMAS = ['es', 'en'];
const N = 1000;
const textosDe = idioma => ({ idioma, t: T[idioma], tt: o => o[idioma], esc: x => x });
const blanco = x => x.replace(/[\s\u00a0\u202f]+/g, ' ').trim();
const plano = html => blanco(html.replace(/<[^>]+>/g, ' '));
const practica = await declaracionDe(CATALOGO.find(f => f.slug === 'regla-de-tres'));
const [ej1, ej2, ej3, ej4] = practica.ejercicios;
const items = (def, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, (_, i) => def.generar(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] }));
};
function sana(html, donde) {
  assert.equal(typeof html, 'string', donde);
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×|%/, `${donde}: ${plano(html)}`);
  assert.doesNotMatch(plano(html), /inversa|inverse/i, `${donde}: ${plano(html)}`);
  assert.doesNotMatch(plano(html), /: [A-ZÁÉÍÓÚÑ]/, `mayúscula tras «:» — ${donde}: ${plano(html)}`);
  assert.doesNotMatch(plano(html), / · [A-ZÁÉÍÓÚÑ]/, `«·» separando frases — ${donde}: ${plano(html)}`);
}

test('regla-de-tres · ej. 1: la explicación lleva lo que vale 1 y la cantidad pedida', () => {
  for (const idioma of IDIOMAS) for (const item of items(ej1, 41)) {
    const html = ej1.explicacion(item, textosDe(idioma));
    sana(html, `ej1 ${idioma}`);
    const uno = aTexto(L.valorDeUno(item), idioma);
    const total = L.txt(item, 'd', idioma);
    assert.ok(plano(html).includes(blanco(uno)), `1: ${uno} — ${plano(html)}`);
    assert.ok(plano(html).includes(blanco(total)), `total: ${total} — ${plano(html)}`);
    assert.match(plano(html), idioma === 'es' ? /La respuesta es/ : /The answer is/);
  }
});

test('regla-de-tres · ej. 2: la explicación da la x buena y nombra el planteamiento correcto', () => {
  for (const idioma of IDIOMAS) for (const item of items(ej2, 42)) {
    const html = ej2.explicacion(item, textosDe(idioma));
    sana(html, `ej2 ${idioma}`);
    const cuenta = `x = ${L.num(val(item.b), idioma)} · ${L.num(val(item.c), idioma)} : ${L.num(val(item.a), idioma)}`;
    assert.ok(plano(html).includes(cuenta), `${cuenta} — ${plano(html)}`);
  }
});

test('regla-de-tres · ej. 3: la explicación acaba con la solución y su unidad, en las dos direcciones', () => {
  for (const idioma of IDIOMAS) for (const item of items(ej3, 43)) {
    const html = ej3.explicacion(item, textosDe(idioma));
    sana(html, `ej3 ${idioma}`);
    const id = L.unidadBuena(item);
    const lado = id === 'A' ? 'a' : 'b';
    const esperado = L.txt(item, lado, idioma, L.solucion(item).valor);
    assert.ok(plano(html).includes(blanco(esperado)), `${esperado} — ${plano(html)}`);
    assert.match(plano(html), idioma === 'es' ? /La respuesta es/ : /The answer is/);
  }
});

test('regla-de-tres · ej. 4: la explicación da el valor bueno y el motivo', () => {
  for (const idioma of IDIOMAS) for (const item of items(ej4, 44)) {
    const html = ej4.explicacion(item, textosDe(idioma));
    sana(html, `ej4 ${idioma}`);
    assert.ok(plano(html).includes(blanco(L.txt(item, 'd', idioma))), plano(html));
  }
});
