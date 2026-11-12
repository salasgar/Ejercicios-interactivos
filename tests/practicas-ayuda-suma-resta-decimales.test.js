// «No lo sé» de suma-resta-decimales (tarea 173): cada explicación acaba con la respuesta del ítem,
// calculada con la lógica de la práctica, y lleva la cuenta del feedback.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import { aTexto } from '../practicas/_comun/decimales.js';
import * as L from '../practicas/suma-resta-decimales/logica.js';
import { explicaAlinea, explicaSuper, explicaMedidas, explicaMueve } from '../practicas/suma-resta-decimales/ayuda.js';

const IDIOMAS = ['es', 'en'];
const textosDe = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const items = (fn, semilla, n = 1000) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng, {})); };
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const sano = (html, que) => {
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, `${que}: ${plano(html)}`);
  assert.ok(html.length > 60, `${que}: corta`);
};

test('suma-resta-decimales · ejercicio 1: la explicación da el resultado de la cuenta', () => {
  for (const item of items(L.generarAlinea, 1)) {
    for (const idioma of IDIOMAS) {
      const html = explicaAlinea(item, textosDe(idioma));
      sano(html, `alinea ${idioma}`);
      assert.ok(html.includes(`${aTexto(L.D(item.resultado), idioma)}.</strong>`), plano(html));
    }
  }
});

test('suma-resta-decimales · ejercicio 2: la explicación da el total o la vuelta', () => {
  for (const item of items(L.generarSuper, 2)) {
    const esperado = L.respuestaSuper(item);
    for (const idioma of IDIOMAS) {
      const html = explicaSuper(item, textosDe(idioma));
      sano(html, `super ${idioma}`);
      assert.ok(html.includes(`${aTexto(esperado, idioma)} ${idioma === 'es' ? '€' : 'euros'}.</strong>`), plano(html));
    }
  }
});

test('suma-resta-decimales · ejercicio 3: la explicación da la medida con su unidad', () => {
  for (const item of items(L.generarMedidas, 3)) {
    const unidad = L.CONTEXTOS_MEDIDAS[item.contexto].unidad;
    for (const idioma of IDIOMAS) {
      const html = explicaMedidas(item, textosDe(idioma));
      sano(html, `medidas ${idioma}`);
      assert.ok(html.includes(`${aTexto(L.D(item.respuesta), idioma)} ${unidad}.</strong>`), plano(html));
    }
  }
});

test('suma-resta-decimales · ejercicio 4: la explicación da el resultado de mover la coma', () => {
  for (const item of items(L.generarMueve, 4)) {
    for (const idioma of IDIOMAS) {
      const html = explicaMueve(item, textosDe(idioma));
      sano(html, `mueve ${idioma}`);
      assert.ok(html.includes(`${aTexto(L.D(item.respuesta), idioma)}.</strong>`), plano(html));
      assert.ok(plano(html).includes(`= ${aTexto(L.D(item.respuesta).normalizar(), idioma)}`), 'la cuenta');
    }
  }
});
