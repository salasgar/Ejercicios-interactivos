// «No lo sé» en combinadas-fracciones (tarea 172): cada explicación lleva la solución del ítem,
// calculada con `fracciones.js` y `logica.js` (no copiada de la explicación), en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { htmlFraccion, leerFraccion, evaluar, analizar, html as htmlExp } from '../practicas/_comun/fracciones.js';
import * as L from '../practicas/combinadas-fracciones/logica.js';
import * as X from '../practicas/combinadas-fracciones/textos.js';

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

test('combinadas-fracciones, ejercicio 1: la explicación nombra todas las operaciones que pueden ir primero', () => {
  for (const idioma of IDIOMAS) for (const item of items(L.generarPrimero, 1)) {
    const html = X.explicaPrimero(item, textosDe(idioma));
    sano(html, `primero ${idioma}`);
    const posibles = L.primerosPasos(L.arbolDe(item.texto));
    assert.ok(posibles.length >= 1);
    for (const op of posibles) assert.ok(html.includes(`<span class="cuenta">${htmlExp(op)}</span>`), plano(html));
  }
});

test('combinadas-fracciones, ejercicio 2: la explicación acaba en el valor de la expresión', () => {
  for (const idioma of IDIOMAS) for (const item of items(L.generarPasos, 2)) {
    const html = X.explicaPasosAyuda(item, textosDe(idioma));
    sano(html, `pasos ${idioma}`);
    const valor = htmlFraccion(evaluar(analizar(item.texto)));
    assert.ok(html.trim().endsWith(`<span class="cuenta">${valor}</span>.`), plano(html));
    assert.ok((html.match(/<li>/g) ?? []).length >= 2, 'al menos dos pasos');
  }
});

test('combinadas-fracciones, ejercicio 3: la explicación dice la línea, el tipo de error y la línea bien hecha', () => {
  for (const idioma of IDIOMAS) for (const item of items(L.generarError, 3)) {
    const html = X.explicaErrorAyuda(item, textosDe(idioma));
    sano(html, `error ${idioma}`);
    const texto = plano(html);
    assert.ok(texto.includes(idioma === 'es' ? `es la ${item.linea}.` : `is line ${item.linea}.`), texto);
    assert.ok(html.includes(`<span class="cuenta">= ${htmlExp(item.bueno)}</span>`), texto);
    if (item.tipo === 'orden') assert.ok(html.includes(htmlExp(item.canonica)), texto);
    else assert.ok(html.includes(htmlFraccion(leerFraccion(item.valorBueno))), texto);
    // La línea bien hecha vale lo mismo que la expresión de partida.
    assert.ok(evaluar(analizar(item.bueno)).equals(evaluar(analizar(item.lineas[0]))), 'la línea buena no cambia el valor');
  }
});
