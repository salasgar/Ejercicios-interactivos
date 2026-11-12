// «No lo sé» en suma-resta (tarea 172): cada explicación lleva la solución del ítem, calculada con
// su `logica.js` (no copiada de la explicación), en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { htmlFraccion } from '../practicas/_comun/fracciones.js';
import * as L from '../practicas/suma-resta/logica.js';
import * as X from '../practicas/suma-resta/textos.js';

const IDIOMAS = ['es', 'en'];
const textosDe = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
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

test('suma-resta, ejercicio 1: la explicación lleva el resultado simplificado', () => {
  for (const idioma of IDIOMAS) for (const item of items(L.generarMismo, 1)) {
    const html = X.explicaMismo(item, textosDe(idioma));
    sano(html, `mismo ${idioma}`);
    assert.ok(html.includes(htmlFraccion(L.resultadoMismo(item).simplificar())), plano(html));
  }
});

test('suma-resta, ejercicio 2: la explicación lleva el m.c.m. y el resultado', () => {
  for (const idioma of IDIOMAS) for (const item of items(L.generarPasos, 2)) {
    const html = X.explicaPasos(item, textosDe(idioma));
    sano(html, `pasos ${idioma}`);
    assert.ok(html.includes(htmlFraccion(L.resultadoPasos(item).simplificar())), plano(html));
    assert.ok(plano(html).includes(`= ${item.m}.`), 'el m.c.m.');
  }
});

test('suma-resta, ejercicio 3: la explicación lleva el resultado del natural con la fracción', () => {
  for (const idioma of IDIOMAS) for (const item of items(L.generarNaturales, 3)) {
    const html = X.explicaNat(item, textosDe(idioma));
    sano(html, `nat ${idioma}`);
    assert.ok(html.includes(htmlFraccion(L.resultadoNat(item))), plano(html));
  }
});

test('suma-resta, ejercicio 4: la explicación lleva la respuesta buena', () => {
  for (const idioma of IDIOMAS) for (const item of items(L.generarQueda, 4)) {
    const html = X.explicaQueda(item, textosDe(idioma));
    sano(html, `queda ${idioma}`);
    assert.ok(html.includes(htmlFraccion(L.respuestaQueda(item))), plano(html));
  }
});

test('suma-resta, ejercicio 5: la explicación dice qué línea falla (o que no hay error)', () => {
  for (const idioma of IDIOMAS) for (const item of items(L.generarCaza, 5)) {
    const html = X.explicaCazaAyuda(item, textosDe(idioma));
    sano(html, `caza ${idioma}`);
    const texto = plano(html);
    if (item.mala === null) assert.ok(/No hay error|No mistake/.test(texto), texto);
    else {
      assert.ok(texto.includes(idioma === 'es' ? `es la ${item.mala + 1}.` : `is line ${item.mala + 1}.`), texto);
      assert.ok(texto.includes(idioma === 'es' ? `Línea ${item.mala + 1}:` : `Line ${item.mala + 1}:`), 'explica esa línea');
    }
  }
});
