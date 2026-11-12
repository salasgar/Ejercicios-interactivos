// «No lo sé» en errores4 (tarea 172): cada explicación lleva la solución del ítem (verdadera o falsa,
// el nombre del error, la línea mala, el resultado bien hecho), en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { ERRORES_TIPICOS, fraccion, aTexto } from '../practicas/_comun/fracciones.js';
import * as L from '../practicas/errores4/logica.js';
import * as X from '../practicas/errores4/textos.js';

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

test('errores4, ejercicio 1: la explicación dice si es verdadera o falsa y, si es falsa, el nombre del error', () => {
  let verdaderas = 0, falsas = 0;
  for (const idioma of IDIOMAS) for (const item of items(L.generarBienMal, 1)) {
    const html = X.explicaBienMal(item, textosDe(idioma));
    sano(html, `bienmal ${idioma}`);
    const texto = plano(html);
    if (item.verdadera) {
      verdaderas++;
      assert.ok(texto.includes(idioma === 'es' ? '«Verdadera»' : '“True”'), texto);
      assert.ok(!texto.includes(idioma === 'es' ? '«Falsa»' : '“False”'), texto);
    } else {
      falsas++;
      assert.ok(texto.includes(idioma === 'es' ? '«Falsa»' : '“False”'), texto);
      assert.ok(texto.includes(ERRORES_TIPICOS[item.error].nombre[idioma]), texto);
    }
  }
  assert.ok(verdaderas > 300 && falsas > 300, 'salen de las dos clases');
});

test('errores4, ejercicio 2: la explicación señala la línea mala y el error', () => {
  for (const idioma of IDIOMAS) for (const item of items(L.generarLinea, 2)) {
    const html = X.explicaLinea(item, textosDe(idioma));
    sano(html, `linea ${idioma}`);
    const texto = plano(html);
    assert.ok(texto.includes(idioma === 'es' ? `en la línea ${item.falsa + 1}:` : `in line ${item.falsa + 1}:`), texto);
    assert.ok(texto.includes(ERRORES_TIPICOS[item.error].nombre[idioma]), texto);
  }
});

test('errores4, ejercicio 3: la explicación lleva el resultado bien hecho (irreducible)', () => {
  for (const idioma of IDIOMAS) for (const item of items(L.generarArregla, 3)) {
    const html = X.explicaArregla(item, textosDe(idioma));
    sano(html, `arregla ${idioma}`);
    const bien = aTexto(fraccion(item.bien.num, item.bien.den));
    assert.ok(html.includes(L.ex(bien)), plano(html));
    assert.ok(html.includes(ERRORES_TIPICOS[item.error].nombre[idioma]), plano(html));
  }
});
